// ==UserScript==
// @name         xath.hu Auto-Reply on Profile Click
// @namespace    https://xath.hu/
// @version      1.4.0
// @description  Automatikus privát üzenet küldése azonnal, ha valaki rákattint a profilodra vagy privátot nyit
// @match        *://xath.hu/*
// @match        *://*.xath.hu/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      xat-bot-qziz.onrender.com
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_USER_ID = '2000000'; // Szaby azonosítója
    const STORE_KEY = 'xath_autoreply_cfg';
    let savedCfg = {};
    try { savedCfg = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (_) {}
    const config = Object.assign({
        enabled: true,
        replyText: "Hey there! Thanks for reaching out, enjoy the music! :)",
        fallbackText: "Hey! Your private messages are locked, but welcome and enjoy the music! (cool)",
        debounceMs: 3000
    }, savedCfg);

    // Kényszerített bekapcsolás és v1.4 frissítés
    if (localStorage.getItem('xath_ar_v14') !== '1') {
        config.enabled = true;
        localStorage.setItem('xath_ar_v14', '1');
        try { localStorage.setItem(STORE_KEY, JSON.stringify(config)); } catch (_) {}
    }

    function saveConfig() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(config)); } catch (_) {}
    }

    let activeSocket = null;
    let currentTabUserId = TARGET_USER_ID;
    try {
        const rawTodo = localStorage.getItem('todo');
        if (rawTodo) {
            const t = JSON.parse(rawTodo);
            if (t.w_userno) currentTabUserId = String(t.w_userno);
        }
    } catch (_) {}

    let lastTargetId = '';
    let lastTargetNick = '';
    const lastInteraction = new Map();
    const knownUsers = new Map();
    const userDeliveryState = new Map();

    // 1. TIER KÜLDÉSI FÜGGVÉNYEK (SZIGORÚAN SZABVÁNYOS XAT CSOMAGOK)

    function sendRawPacket(ws, xml) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        try {
            const act = (typeof unsafeWindow !== 'undefined' ? unsafeWindow._Activity : window._Activity) ||
                        (typeof parent !== 'undefined' && parent._Activity) ||
                        (typeof window.top !== 'undefined' && window.top._Activity);
            if (act && act.instance && typeof act.instance.SendSock === 'function') {
                act.instance.SendSock(xml);
                return;
            }
        } catch (_) {}

        try {
            const bytes = new TextEncoder().encode(xml);
            ws.send(bytes.buffer);
        } catch (_) {
            try { ws.send(xml); } catch (_) {}
        }
    }

    // Tier 1: Privát csevegő fül (PC tab) - Elsődleges
    function sendTier1PCTab(ws, senderId, nick) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        userDeliveryState.set(senderId, { nick, tier: 1, time: Date.now() });

        const myId = TARGET_USER_ID;
        const msgId = Math.random().toString(36).substr(2, 9);
        const opts = (typeof btoa !== 'undefined')
            ? btoa(JSON.stringify({ isTranslated: "", msgId: msgId, type: "msg" }))
            : Buffer.from(JSON.stringify({ isTranslated: "", msgId: msgId, type: "msg" })).toString('base64');

        // Küldés a privát csevegő fülbe natív SendSock / bináris ArrayBuffer formátumban NUL byte nélkül
        sendRawPacket(ws, `<z d="${senderId}" u="${myId}" t="${config.replyText}" o="${opts}" s="2" />`);
    }

    // Tier 2: Fő chaten lakat ikonnal (<priv>) - Fallback 1
    function sendTier2MainPadlock(ws, senderId, nick) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        userDeliveryState.set(senderId, { nick, tier: 2, time: Date.now() });
        sendRawPacket(ws, `<p u="${senderId}" t="${config.replyText}" />`);
    }

    // Tier 3: Fő chaten nyilvánosan (@Nick) - Fallback 2
    function sendTier3Public(ws, senderId, nick) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        userDeliveryState.set(senderId, { nick, tier: 3, time: Date.now() });
        const pubMsg = `@${nick} ${config.fallbackText}`;
        sendRawPacket(ws, `<m t="${pubMsg}" />`);
    }

    // Interakció kezelése és szigorú prioritási lépcső
    function handleUserInteraction(ws, senderId, text, isClick, isPCTab) {
        if (!config.enabled) return;

        // Csak akkor küldünk választ Szabyként, ha ez a böngésző fül ténylegesen Szaby!
        if (currentTabUserId && currentTabUserId !== TARGET_USER_ID) {
            return;
        }

        const now = Date.now();
        if (lastInteraction.has(senderId) && (now - lastInteraction.get(senderId) < config.debounceMs)) {
            return;
        }
        lastInteraction.set(senderId, now);

        lastTargetId = senderId;
        const userObj = knownUsers.get(senderId);
        let targetNick = userObj ? userObj.cleanNick : `User_${senderId}`;
        if (!targetNick || targetNick === 'User_' + senderId) targetNick = 'friend';
        lastTargetNick = targetNick;

        const isGuest = parseInt(senderId, 10) > 4000000000;

        console.log(`[AUTO-REPLY] Interakció: ${targetNick} (${senderId}, isGuest=${isGuest}, click=${isClick})`);

        // 1. Ha Friends-Only zárolt: azonnal fő chat nyilvános
        if (userObj && userObj.isFriendOnly) {
            sendTier3Public(ws, senderId, targetNick);
            return;
        }

        // 2. Ha vendég vagy NoPC tiltott (nem tud privát fület nyitni):
        if (isGuest || (userObj && userObj.isNoPC)) {
            sendTier2MainPadlock(ws, senderId, targetNick);
            setTimeout(() => {
                sendTier3Public(ws, senderId, targetNick);
            }, 500);
            return;
        }

        // 3. Fő ág: Szabályos privát fül nyitás és küldés
        sendTier1PCTab(ws, senderId, targetNick);
    }

    // Bejövő szerver csomagok vizsgálata
    function inspectPacket(str, ws) {
        if (!str || typeof str !== 'string') return;

        // Felhasználók és lakat / no-pc státusz nyilvántartása
        if (str.includes('<u ')) {
            const uMatches = str.match(/<u [^>]+>/g) || [];
            for (const uPkt of uMatches) {
                const uMatch = uPkt.match(/\bu="(\d+)"/);
                const nMatch = uPkt.match(/\bn="([^"]*)"/);
                const fMatch = uPkt.match(/\bf="([^"]*)"/);
                if (uMatch) {
                    const uid = uMatch[1];
                    const rawNick = nMatch ? nMatch[1] : '';
                    const cleanNick = rawNick.replace(/\([^)]*\)/g, '').replace(/_##.*$/, '').trim() || `User_${uid}`;
                    const flag = fMatch ? parseInt(fMatch[1], 10) : 0;
                    const isFriendOnly = (flag & 32) !== 0 || uPkt.includes('padlock');
                    const isNoPC = uPkt.includes('no-pc') || uPkt.includes('nopc');
                    knownUsers.set(uid, { cleanNick, rawNick, isFriendOnly, isNoPC });
                }
            }
        }

        // Kattintások (<z ... t="/l"/>) és bejövő privát üzenetek
        if (str.includes('<z ') || str.includes('<p ')) {
            const pPackets = str.match(/<[pz] [^>]+>/g) || [];
            for (const pkt of pPackets) {
                const uMatch = pkt.match(/\bu="(\d+)"/);
                const dMatch = pkt.match(/\bd="(\d+)"/);
                const tMatch = pkt.match(/\bt="([^"]*)"/);
                const text = tMatch ? tMatch[1] : '';
                let senderId = uMatch ? uMatch[1] : null;

                if (!senderId && dMatch && dMatch[1] !== TARGET_USER_ID) {
                    senderId = dMatch[1];
                }

                // Csak akkor válaszolunk, ha a csomag Szabynak (2000000) érkezett
                const isForSzaby = dMatch ? dMatch[1] === TARGET_USER_ID : (currentTabUserId === TARGET_USER_ID);

                if (isForSzaby && senderId && senderId !== TARGET_USER_ID && senderId !== '0' && senderId !== '1') {
                    const isClick = pkt.includes('t="/l"');
                    const isPCTab = pkt.includes('s="2"') || (pkt.startsWith('<z ') && !isClick);
                    console.log('[AUTO-REPLY INTERACTION DETECTED] Feladó:', senderId, 'Kattintás:', isClick, 'Szöveg:', text);
                    handleUserInteraction(ws, senderId, text, isClick, isPCTab);
                }
            }
        }

        // Szerver általi elutasítás észlelése -> Eszkaláció
        const isFriendOnlyRejection = str.includes('Not added you as a friend') ||
                                      str.includes('only accepts private messages from friends') ||
                                      str.includes('Csak barátoktól fogad privát');

        const isPcRejection = str.includes('does not accept private chats') ||
                              str.includes('cannot private chat') ||
                              str.includes('has private chat disabled') ||
                              str.includes('nopc') ||
                              str.includes('only accepts private messages') ||
                              str.includes('Not accepting private chat') ||
                              str.includes('nem fogad privát csevegést');

        const isGeneralRejection = isFriendOnlyRejection ||
                                   str.includes('cannot send private message') ||
                                   str.includes('does not accept private') ||
                                   str.includes('cannot private message') ||
                                   str.includes('nem küldhető privát') ||
                                   str.includes('blocked');

        if ((isGeneralRejection || isPcRejection) && lastTargetId) {
            const currentState = userDeliveryState.get(lastTargetId);
            const targetNick = lastTargetNick || (currentState ? currentState.nick : `User_${lastTargetId}`);

            if (isFriendOnlyRejection) {
                setTimeout(() => sendTier3Public(ws, lastTargetId, targetNick), 250);
            } else if (currentState && currentState.tier === 1) {
                setTimeout(() => sendTier2MainPadlock(ws, lastTargetId, targetNick), 250);
            } else if (currentState && currentState.tier === 2) {
                setTimeout(() => sendTier3Public(ws, lastTargetId, targetNick), 250);
            }
        }
    }

    // 2. WEBSOCKET ELFOGÁS ÉS HELYI FELHASZNÁLÓ BEAZONOSÍTÁSA
    const targetScope = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
    const OrigWebSocket = targetScope.WebSocket || window.WebSocket;

    function CustomWebSocket(...args) {
        const ws = new OrigWebSocket(...args);

        // Kimenő csomagok vizsgálata a helyi felhasználó beazonosításához
        const origSend = ws.send;
        ws.send = function (data) {
            try {
                let s = '';
                if (typeof data === 'string') s = data;
                else if (data instanceof ArrayBuffer) s = new TextDecoder().decode(data);
                else if (data instanceof Uint8Array) s = new TextDecoder().decode(data);

                if (s.startsWith('<y ') || s.startsWith('<j2 ')) {
                    const uMatch = s.match(/\bu="(\d+)"/);
                    if (uMatch) {
                        currentTabUserId = uMatch[1];
                        console.log('[AUTO-REPLY] Helyi böngészőfül felhasználó ID:', currentTabUserId);

                        if (currentTabUserId === TARGET_USER_ID) {
                            activeSocket = ws;
                            callKeeper('USER_ACTIVE', { user: 'Szaby' });
                        }
                    }
                }
            } catch (_) {}
            return origSend.apply(this, arguments);
        };

        ws.addEventListener('message', (ev) => {
            // Ha ez a böngésző fül NEM Szaby, semmit nem csinálunk
            if (currentTabUserId && currentTabUserId !== TARGET_USER_ID) {
                return;
            }

            if (typeof ev.data === 'string') {
                inspectPacket(ev.data, ws);
            } else if (ev.data instanceof ArrayBuffer) {
                const text = new TextDecoder().decode(ev.data);
                inspectPacket(text, ws);
            } else if (ev.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => inspectPacket(reader.result, ws);
                reader.readAsText(ev.data);
            }
        });

        ws.addEventListener('close', () => {
            if (activeSocket === ws) activeSocket = null;
        });

        return ws;
    }

    CustomWebSocket.prototype = OrigWebSocket.prototype;
    CustomWebSocket.CONNECTING = OrigWebSocket.CONNECTING;
    CustomWebSocket.OPEN = OrigWebSocket.OPEN;
    CustomWebSocket.CLOSING = OrigWebSocket.CLOSING;
    CustomWebSocket.CLOSED = OrigWebSocket.CLOSED;

    try {
        window.WebSocket = CustomWebSocket;
        if (typeof unsafeWindow !== 'undefined') unsafeWindow.WebSocket = CustomWebSocket;
    } catch (_) {}

    // 3. LEBEGŐ FELHASZNÁLÓI FELÜLET (UI GOMB & BEÁLLÍTÁSOK)
    function injectUI() {
        if (window !== window.top) return; // Csak a fő ablakban jelenik meg
        if (document.getElementById('xath-autoreply-widget')) return;

        const container = document.createElement('div');
        container.id = 'xath-autoreply-widget';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
        `;

        const btn = document.createElement('button');
        btn.id = 'xath-autoreply-btn';
        function updateBtn() {
            btn.innerHTML = `⚡ Auto-Reply: <b>${config.enabled ? 'BE' : 'KI'}</b>`;
            btn.style.background = config.enabled ? '#238636' : '#6e7681';
        }
        btn.style.cssText = `
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        `;
        updateBtn();

        btn.onclick = () => {
            config.enabled = !config.enabled;
            saveConfig();
            updateBtn();
        };

        const settingsBtn = document.createElement('span');
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.style.marginLeft = '4px';
        settingsBtn.title = 'Üzenet szerkesztése';
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            openModal();
        };
        btn.appendChild(settingsBtn);

        container.appendChild(btn);
        document.body.appendChild(container);
    }

    function openModal() {
        if (document.getElementById('xath-autoreply-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'xath-autoreply-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000000;
            font-family: sans-serif;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: #161b22;
            color: #c9d1d9;
            padding: 20px;
            border-radius: 10px;
            width: 360px;
            max-width: 90vw;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            border: 1px solid #30363d;
        `;

        box.innerHTML = `
            <h3 style="margin-top:0; color:#58a6ff;">⚡ xath Auto-Reply Beállítások</h3>
            <label style="display:block; margin-bottom:6px; font-weight:600;">Privát válasz szövege:</label>
            <textarea id="ar-text" style="width:100%; height:70px; background:#0d1117; color:#c9d1d9; border:1px solid #30363d; border-radius:6px; padding:8px; box-sizing:border-box;">${config.replyText}</textarea>
            
            <label style="display:block; margin-top:12px; margin-bottom:6px; font-weight:600;">Nyilvános tartalék szöveg (ha zárolva a privát):</label>
            <textarea id="ar-fallback" style="width:100%; height:50px; background:#0d1117; color:#c9d1d9; border:1px solid #30363d; border-radius:6px; padding:8px; box-sizing:border-box;">${config.fallbackText}</textarea>
            
            <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:8px;">
                <button id="ar-cancel" style="padding:6px 14px; background:#30363d; color:#fff; border:none; border-radius:6px; cursor:pointer;">Mégse</button>
                <button id="ar-save" style="padding:6px 14px; background:#238636; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Mentés</button>
            </div>
        `;

        modal.appendChild(box);
        document.body.appendChild(modal);

        document.getElementById('ar-cancel').onclick = () => modal.remove();
        document.getElementById('ar-save').onclick = () => {
            config.replyText = document.getElementById('ar-text').value.trim() || config.replyText;
            config.fallbackText = document.getElementById('ar-fallback').value.trim() || config.fallbackText;
            saveConfig();
            modal.remove();
        };
    }

    // 4. AUTOMATIKUS RENDER 24/7 STANDBY SZINKRONIZÁCIÓ
    const KEEPER_URL = 'https://xat-bot-qziz.onrender.com';

    function callKeeper(type, data = null) {
        // PostMessage híd a háttér Service Worker felé
        try {
            window.postMessage({
                type: 'XATH_KEEPER_CALL',
                payload: { type, data }
            }, '*');
        } catch (_) {}

        // Tampermonkey fallback
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            const endpoints = {
                'SYNC_SESSION': '/api/sync-session',
                'USER_ACTIVE': '/user-active',
                'USER_INACTIVE': '/user-inactive'
            };
            try {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${KEEPER_URL}${endpoints[type] || '/user-active'}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(data || {})
                });
                return;
            } catch (_) {}
        }

        // Közvetlen fetch fallback
        try {
            const path = type === 'SYNC_SESSION' ? '/api/sync-session' : (type === 'USER_INACTIVE' ? '/user-inactive' : '/user-active');
            fetch(`${KEEPER_URL}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data || {})
            }).catch(() => {});
        } catch (_) {}
    }

    function syncKeeperSession() {
        if (currentTabUserId && currentTabUserId !== TARGET_USER_ID) return;
        try {
            const rawTodo = localStorage.getItem('todo');
            if (!rawTodo) return;
            const todoData = JSON.parse(rawTodo);
            if (!todoData || !todoData.PassHash || String(todoData.w_userno || '') !== TARGET_USER_ID) return;
            callKeeper('SYNC_SESSION', { user: 'Szaby', todo: todoData });
        } catch (_) {}
    }

    function sendKeeperHeartbeat() {
        if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;
        if (currentTabUserId && currentTabUserId !== TARGET_USER_ID) return;
        callKeeper('USER_ACTIVE', { user: 'Szaby' });
    }

    function sendKeeperExit() {
        if (window !== window.top) return;
        if (currentTabUserId && currentTabUserId !== TARGET_USER_ID) return;
        callKeeper('USER_INACTIVE', { user: 'Szaby' });
    }

    setTimeout(syncKeeperSession, 2000);
    setInterval(sendKeeperHeartbeat, 15000);

    if (window === window.top) {
        window.addEventListener('beforeunload', sendKeeperExit);
        window.addEventListener('pagehide', sendKeeperExit);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
})();
