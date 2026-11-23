'use strict';

/**
 * xat.com Unregistered Guest Chat Client (WASM Engine)
 * Author: RITMADA
 * Room: TestRadio42 (ID: 220527887)
 * User: Szaby (Unregistered Guest)
 * Action: Connect, authenticate, send message "1"
 */

const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const WASM_JS_PATH = path.join(__dirname, 'xatcorewasm.js');

const args = process.argv.slice(2);
function getArg(name, def) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const TARGET_ROOM = getArg('room', 'TestRadio42');
const NICKNAME = getArg('nick', 'Szaby');
const MESSAGE_TO_SEND = getArg('msg', '1');
const GUEST_ID = getArg('id', '1557387427');
const GUEST_K1 = getArg('k1', 'c3380342206b02e3fc00');
const GUEST_K2 = getArg('k2', '1230803968');
const STAY_SECONDS = parseInt(getArg('stay', '300'), 10);
const AVATAR = getArg('avatar', null);
const CHAT_INTERVAL = parseInt(getArg('chat-interval', '35'), 10);

const LIST_IDS_PATH = path.join(__dirname, 'listids.txt');
const KNOWN_BOT_IDS = new Set();
if (fs.existsSync(LIST_IDS_PATH)) {
    try {
        const idLines = fs.readFileSync(LIST_IDS_PATH, 'utf8').split('\n');
        for (const l of idLines) {
            const m = l.match(/UserId=(\d+)/i);
            if (m) KNOWN_BOT_IDS.add(m[1]);
        }
    } catch (_) {}
}

const messagedUsers = new Set();
const PM_GREETINGS = [
    "Szia! Jo szorakozast a radional! :)",
    "Szia! Kellemes delutant, jo pihenest!",
    "Udv a szobaban, szuper a musor ma! :)",
    "Szia szia! Jo zenehallgatast! :D",
    "Pacsi! Kellemes napot neked!",
    "Szia, orulok hogy itt vagy! :)"
];

const PM_REPLIES = [
    "koszi szepen! :)",
    "kellemes delutant neked is!",
    "nagyon adja a zene!",
    "orulok, hogy tetszik! ;)",
    ":)",
    "koszonom szepen! :D"
];

function normalizeProxy(proxyStr) {
    if (!proxyStr) return null;
    let s = proxyStr.trim();
    if (!s) return null;
    if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('socks')) {
        return s;
    }
    const parts = s.split(':');
    if (parts.length === 4) {
        let host = parts[0];
        if (host === 'sp.decodo.com') host = 'isp.decodo.com';
        const port = parts[1];
        const user = parts[2];
        const pass = parts[3];
        return `http://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}`;
    }
    return `http://${s}`;
}

const PROXY_URL = normalizeProxy(getArg('proxy', null));
global.require = require;

// Setup browser/DOM mock environment expected by Emscripten and WASM
const store = {};
global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

const USER_AGENT = 'Mozilla/5.0 (Linux; Android 10; Mobile)';
global.window = {
    location: {
        host: 'xat.com',
        hostname: 'xat.com',
        href: `https://xat.com/${TARGET_ROOM}`,
        search: ''
    },
    navigator: {
        userAgent: USER_AGENT,
        userLanguage: 'en',
        language: 'en'
    }
};

let wasmCode = fs.readFileSync(WASM_JS_PATH, 'utf8');

// Hotpatch Emscripten glue:
// 1. Ensure ASM_CONSTS always returns non-null string pointer
wasmCode = wasmCode.replace('if(!val)return"";', 'if(!val) val="";');
// 2. Export UTF8ToString to Module for SendC
wasmCode = wasmCode.replace(
    'var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";',
    'var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""; Module.UTF8ToString=UTF8ToString;'
);

const Module = {
    onRuntimeInitialized: async function () {
        let activeWs = null;
        let myGuestId = '2';
        let messageSent = false;
        let messageEchoReceived = false;

        function SendC(a0, a1, a2) {
            a0 = String(a0 || '');
            a1 = String(a1 || '');
            a2 = String(a2 || '');
            const len0 = Buffer.byteLength(a0) + 1;
            const len1 = Buffer.byteLength(a1) + 1;
            const len2 = Buffer.byteLength(a2) + 1;
            const ptr0 = Module._malloc(len0);
            const ptr1 = Module._malloc(len1);
            const ptr2 = Module._malloc(len2);
            Module.stringToUTF8(a0, ptr0, len0);
            Module.stringToUTF8(a1, ptr1, len1);
            Module.stringToUTF8(a2, ptr2, len2);
            let resPtr;
            try {
                resPtr = Module._cToC(ptr0, ptr1, ptr2);
            } catch (e) {
                console.error('[cToC ERROR]:', a0, e.message);
                return null;
            }
            const res = resPtr ? Module.UTF8ToString(resPtr) : '';
            // Only free return pointer allocated by C/WASM
            if (resPtr) Module._xFree(resPtr);
            return res;
        }

        async function processFifo() {
            let item;
            while ((item = SendC('ReadToJavaFifo', '', ''))) {
                let parsed;
                try {
                    parsed = JSON.parse(item);
                } catch (e) {
                    continue;
                }
                const type = parseInt(parsed.Type, 10);

                if (type === 1) { // LOADURL
                    const url = parsed.Cmd;
                    try {
                        const res = await fetch(url, {
                            headers: {
                                'User-Agent': USER_AGENT,
                                'Referer': `https://xat.com/${TARGET_ROOM}`
                            }
                        });
                        const text = await res.text();
                        SendC('xatURL', url, text);
                    } catch (err) {
                        console.error('[HTTP FETCH ERROR]:', url, err.message);
                    }
                } else if (type === 2) { // SEND
                    let packet = parsed.Data;
                    if (packet.startsWith('<j2 ')) {
                        packet = packet.replace(/u="[^"]*"/, `u="${GUEST_ID}"`);
                        packet = packet.replace(/k="[^"]*"/, `k="${GUEST_K1}"`);
                        packet = packet.replace(/n="[^"]*"/, `n="${NICKNAME}## "`);
                        if (AVATAR) {
                            packet = packet.replace(/a="[^"]*"/, `a="${AVATAR}"`);
                        }
                        console.log(`[AUTH] Setting guest (${GUEST_ID}, ${NICKNAME}, avatar: ${AVATAR || 'default'}) in join packet:`);
                        console.log(packet);
                    } else if (packet.startsWith('<y ')) {
                        packet = packet.replace(/u="[^"]*"/, `u="${GUEST_ID}"`);
                        console.log('[NETWORK] Outbound <y> packet:', packet);
                    }

                    if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                        activeWs.send(packet);
                    }
                } else if (type === 3) { // CLOSE
                    if (activeWs) activeWs.close();
                } else if (type === 4) { // CONNECT
                    const wsUrl = 'wss://wss.xat.com:443/v2';
                    const wsOptions = {
                        headers: {
                            'Origin': 'https://xat.com',
                            'User-Agent': USER_AGENT
                        }
                    };

                    if (PROXY_URL) {
                        console.log(`[PROXY] Routing socket through: ${PROXY_URL}`);
                        if (PROXY_URL.startsWith('socks')) {
                            wsOptions.agent = new SocksProxyAgent(PROXY_URL);
                        } else {
                            const pUrl = PROXY_URL.startsWith('http') ? PROXY_URL : `http://${PROXY_URL}`;
                            wsOptions.agent = new HttpsProxyAgent(pUrl);
                        }
                    }

                    console.log(`[NETWORK] Connecting to ${wsUrl} ...`);
                    activeWs = new WebSocket(wsUrl, wsOptions);
                    activeWs.binaryType = 'arraybuffer';

                    activeWs.onopen = () => {
                        console.log('[NETWORK] WebSocket connected!');
                        SendC('xatMessageReceived', '#CONNECT_OK', '');
                        const hostB64 = Buffer.from('xat.com').toString('base64');
                        SendC('xatMessageOK', '#CONNECT_CHECK', hostB64);
                    };

                    activeWs.onmessage = (event) => {
                        const buf = Buffer.from(event.data);
                        const msgStr = buf.toString('utf8');
                        const cleanMsg = msgStr.replace(/\0/g, '');

                        if (cleanMsg.startsWith('<m ')) {
                            console.log('[CHAT INBOUND]:', cleanMsg);
                            if (cleanMsg.includes(`t="${MESSAGE_TO_SEND}"`) && cleanMsg.includes(`u="${GUEST_ID}"`)) {
                                console.log(`[VERIFIED SUCCESS] Server confirmed message "${MESSAGE_TO_SEND}" from guest ${GUEST_ID} (${NICKNAME})!`);
                                messageEchoReceived = true;
                            }
                            // If a real human writes in the room, initiate Private Chat (PC tab)
                            const mMatch = cleanMsg.match(/u="(\d+)"/);
                            if (mMatch) {
                                const senderId = mMatch[1];
                                if (senderId !== GUEST_ID && !KNOWN_BOT_IDS.has(senderId) && !messagedUsers.has(senderId)) {
                                    if (Math.random() < 0.25) {
                                        messagedUsers.add(senderId);
                                        const delay = Math.floor(1500 + Math.random() * 2500);
                                        setTimeout(() => {
                                            if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                                                const pmText = PM_GREETINGS[Math.floor(Math.random() * PM_GREETINGS.length)];
                                                console.log(`[PC TAB OPENED] ${NICKNAME} opening Private Chat tab with ${senderId}: "${pmText}"`);
                                                activeWs.send(`<z d="${senderId}" t="/" />\0`);
                                                activeWs.send(`<p u="${senderId}" t="${pmText}" s="2" />\0`);
                                            }
                                        }, delay);
                                    }
                                }
                            }
                        } else if (cleanMsg.includes('<u ') || cleanMsg.includes('<o ')) {
                            console.log('[USER EVENT]:', cleanMsg);
                            const userPackets = cleanMsg.match(/<[uo] [^>]+>/g) || [];
                            for (const pkt of userPackets) {
                                const uMatch = pkt.match(/u="(\d+)"/);
                                if (uMatch) {
                                    const targetId = uMatch[1];
                                    if (targetId !== GUEST_ID && !KNOWN_BOT_IDS.has(targetId) && !messagedUsers.has(targetId)) {
                                        // 15% chance per bot so 2-3 bots open a Private Chat (PC tab) with the real person
                                        if (Math.random() < 0.15) {
                                            messagedUsers.add(targetId);
                                            const delay = Math.floor(2000 + Math.random() * 3000);
                                            setTimeout(() => {
                                                if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                                                    const pmText = PM_GREETINGS[Math.floor(Math.random() * PM_GREETINGS.length)];
                                                    console.log(`[PC TAB OPENED] ${NICKNAME} opening Private Chat tab with ${targetId}: "${pmText}"`);
                                                    activeWs.send(`<z d="${targetId}" t="/" />\0`);
                                                    activeWs.send(`<p u="${targetId}" t="${pmText}" s="2" />\0`);
                                                }
                                            }, delay);
                                        }
                                    }
                                }
                            }
                        } else if (cleanMsg.startsWith('<p ') || cleanMsg.startsWith('<z ')) {
                            console.log('[PRIVATE CHAT INBOUND]:', cleanMsg);
                            const uMatch = cleanMsg.match(/[ud]="(\d+)"/);
                            if (uMatch) {
                                const senderId = uMatch[1];
                                if (senderId !== GUEST_ID && !KNOWN_BOT_IDS.has(senderId)) {
                                    const replyDelay = Math.floor(1500 + Math.random() * 2000);
                                    setTimeout(() => {
                                        if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                                            const reply = PM_REPLIES[Math.floor(Math.random() * PM_REPLIES.length)];
                                            console.log(`[PC REPLY] ${NICKNAME} replying in PC tab to ${senderId}: "${reply}"`);
                                            activeWs.send(`<p u="${senderId}" t="${reply}" s="2" />\0`);
                                        }
                                    }, replyDelay);
                                }
                            }
                        } else if (cleanMsg.startsWith('<done')) {
                            console.log('[ROOM JOINED] Authentication complete. Room presence confirmed.');
                        } else {
                            console.log('[PACKET]:', cleanMsg);
                        }

                        const b64 = buf.toString('base64');
                        SendC('xatMessageReceived', '#MESSAGE', b64);

                        // Once authenticated (<done />), send initial chat message and start periodic chatter
                        if (msgStr.includes('<done') && !messageSent) {
                            messageSent = true;
                            console.log(`[ACTION] Authenticated! Sending message "${MESSAGE_TO_SEND}" to public room...`);
                            setTimeout(() => {
                                const chatPkt = `<m t="${MESSAGE_TO_SEND}" u="${GUEST_ID}" />\0`;
                                console.log('[DISPATCH CHAT]:', chatPkt);
                                activeWs.send(chatPkt);
                            }, 1000);

                            if (CHAT_INTERVAL > 0) {
                                const phrases = [
                                    "sziasztok :)", "hali mindenkinek", "szep napot mindenkinek!", "jo a zene nagyon",
                                    "koszi az adast!", "udv a szobaban", "szia szia", "szep napot", "nagyon adja a radio",
                                    "pacek a track", "jo pihenest mindenkinek", "helloka", "mizu erre?", "pacsi mindenkinek",
                                    "hallgatom a hatterben :)", "szupi zene", "udv mindenkinek!", "jofejek vagytok",
                                    ":)", ";)", "szep estet", "kellemes delutant", "szia", "szep zene :D"
                                ];
                                function scheduleChat() {
                                    const delay = Math.floor((CHAT_INTERVAL * 0.7 + Math.random() * CHAT_INTERVAL * 0.6) * 1000);
                                    setTimeout(() => {
                                        if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                                            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                                            console.log(`[CHATTER] ${NICKNAME} (${GUEST_ID}) sending: "${phrase}"`);
                                            activeWs.send(`<m t="${phrase}" u="${GUEST_ID}" />\0`);
                                            scheduleChat();
                                        }
                                    }, delay);
                                }
                                scheduleChat();
                            }
                        }
                    };

                    activeWs.onclose = (event) => {
                        console.log('[NETWORK] WebSocket closed:', event.code);
                        process.exit(0);
                    };

                    activeWs.onerror = (err) => {
                        console.error('[NETWORK ERROR]:', err.message);
                    };
                }
            }
        }

        console.log(`[INIT] Initializing WASM Core for ${TARGET_ROOM} ...`);
        SendC('sendStuff', JSON.stringify({ Flags: 0, origin: 'https://xat.com' }), '');
        SendC('xatInit', '', '');
        SendC('SetPage', '', 'messages');
        SendC('xatMain', '', '');
        SendC('leaveBackground', '', TARGET_ROOM);
        SendC('ConsoleOff', '', '');
        SendC('SetPhoneFontSize', '', '1.0');
        SendC('setLang', '', 'en');

        // Drain initialization events (roomid, ip3)
        for (let step = 0; step < 3; step++) {
            SendC('xatTick', '', '');
            await processFifo();
            await new Promise((r) => setTimeout(r, 100));
        }

        // Enable WASM internal tick loop
        SendC('xatCommand', '', JSON.stringify({ Command: 'EnableTick' }));
        SendC('getStuff', '', '');

        // Main event loop
        const startTime = Date.now();
        const DURATION = STAY_SECONDS > 0 ? STAY_SECONDS * 1000 : Infinity;
        console.log(`[ONLINE] Maintaining active presence in ${TARGET_ROOM} (${STAY_SECONDS > 0 ? STAY_SECONDS + 's' : 'indefinitely'})...`);
        while (STAY_SECONDS <= 0 || (Date.now() - startTime < DURATION)) {
            SendC('xatTick', '', '');
            await processFifo();
            await new Promise((r) => setTimeout(r, 100));
        }

        if (activeWs) activeWs.close();
        console.log('[EXIT] Client execution finished successfully.');
        process.exit(0);
    }
};

new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
