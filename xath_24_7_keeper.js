'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const args = process.argv.slice(2);
function getArg(name, def) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const configFile = getArg('config', 'account_config.json');
let fileCfg = {};
if (configFile && fs.existsSync(path.resolve(__dirname, configFile))) {
    try {
        fileCfg = JSON.parse(fs.readFileSync(path.resolve(__dirname, configFile), 'utf8'));
    } catch (_) {}
}

const roomName = process.env.ROOM || getArg('room', fileCfg.room || 'xmradio');
const botNick = process.env.NICK || getArg('nick', fileCfg.nick || 'Szaby');
const botAvatar = process.env.AVATAR || getArg('avatar', fileCfg.avatar || '753');
let botId = process.env.USER_ID || getArg('id', fileCfg.userId || (fileCfg.todo && fileCfg.todo.w_userno) || null);
let botK1 = process.env.K1 || getArg('k1', fileCfg.k1 || (fileCfg.todo && fileCfg.todo.w_k1) || null);
let botK2 = process.env.K2 || getArg('k2', fileCfg.k2 || (fileCfg.todo && fileCfg.todo.w_k2) || null);
let botRegname = process.env.REGNAME || getArg('regname', fileCfg.regname || (fileCfg.todo && fileCfg.todo.w_registered) || (botId ? botNick : null));
let botDeviceId = process.env.DEVICE_ID || getArg('deviceid', fileCfg.deviceId || (fileCfg.todo && fileCfg.todo.DeviceId) || '');
let botPassHash = process.env.PASS_HASH || getArg('passhash', fileCfg.passHash || (fileCfg.todo && fileCfg.todo.PassHash) || '');

const IS_SILENT = args.includes('--silent') || args.includes('--no-chat') || args.includes('--no-msg');
const initialMsg = IS_SILENT ? '' : getArg('msg', fileCfg.greeting || 'Sziasztok :)');
const rawProxy = process.env.PROXY || getArg('proxy', fileCfg.proxy || null);

function normalizeProxy(s) {
    if (!s) return null;
    s = s.trim();
    if (!s) return null;
    if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('socks')) return s;
    const parts = s.split(':');
    if (parts.length === 4) {
        return `http://${parts[2]}:${parts[3]}@${parts[0]}:${parts[1]}`;
    }
    return `http://${s}`;
}

const PROXY_URL = normalizeProxy(rawProxy);

let todoObj = {
    w_userno: botId,
    w_k1: botK1,
    w_k2: botK2,
    w_name: botNick,
    w_avatar: String(botAvatar),
    w_registered: botRegname || (botId ? botNick : ''),
    DeviceId: botDeviceId,
    PassHash: botPassHash,
    w_userrev: 1
};

if (fileCfg.todo && typeof fileCfg.todo === 'object') {
    todoObj = Object.assign({}, todoObj, fileCfg.todo);
    todoObj.w_PowerO = '';
    todoObj.w_registered = botRegname || fileCfg.todo.w_registered || botNick;
    if (botId) todoObj.w_userno = botId;
    if (botK1) todoObj.w_k1 = botK1;
    if (botK2) todoObj.w_k2 = botK2;
    if (botNick) todoObj.w_name = botNick;
    if (botAvatar) todoObj.w_avatar = String(botAvatar);
    if (botDeviceId) todoObj.DeviceId = botDeviceId;
    if (botPassHash) todoObj.PassHash = botPassHash;
    if (fileCfg.todo.w_userrev !== undefined) todoObj.w_userrev = fileCfg.todo.w_userrev;
}

const store = {
    'mobCookies': '1',
    'todo': JSON.stringify(todoObj),
    'Settings': JSON.stringify({
        name: botNick,
        avatar: String(botAvatar),
        home: '',
        status: ''
    })
};

global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

global.window = {
    location: {
        host: 'xath.hu',
        hostname: 'xath.hu',
        href: `https://xath.hu/${roomName}`,
        search: ''
    },
    navigator: {
        userAgent: USER_AGENT,
        userLanguage: 'hu',
        language: 'hu'
    }
};
global.location = global.window.location;

const wasmCode = fs.readFileSync(path.join(__dirname, 'xath_xatcorewasm.js'), 'utf8');
const wasmBinary = fs.readFileSync(path.join(__dirname, 'xath_xatcorewasm.wasm'));

const Module = {
    wasmBinary: wasmBinary,
    onAbort: (msg) => console.error('[WASM ABORT]:', msg)
};

function readUtf8(ptr) {
    if (!ptr) return '';
    let end = ptr;
    while (Module.HEAPU8[end] !== 0) end++;
    return Buffer.from(Module.HEAPU8.subarray(ptr, end)).toString('utf8');
}

function SendC(func, p1 = '', p2 = '') {
    const l1 = (func.length * 2 + 1) * 2, ptr1 = Module._malloc(l1); Module.stringToUTF8(func, ptr1, l1);
    const l2 = (p1.length * 2 + 1) * 2, ptr2 = Module._malloc(l2); Module.stringToUTF8(p1, ptr2, l2);
    const l3 = (p2.length * 2 + 1) * 2, ptr3 = Module._malloc(l3); Module.stringToUTF8(p2, ptr3, l3);
    const resPtr = Module.ccall('cToC', null, ['number', 'number', 'number'], [ptr1, ptr2, ptr3]);
    let ret = '';
    if (resPtr) {
        ret = readUtf8(resPtr);
        if (Module._xFree) Module._xFree(resPtr);
    }
    return ret;
}

let urlCache = {};
try {
    urlCache = JSON.parse(fs.readFileSync(path.join(__dirname, 'xath_url_cache.json'), 'utf8'));
} catch (_) {}

let pingTimer = null;
let hasGreeted = false;
let reconnectTimer = null;

let standbyEnabled = process.env.STANDBY !== '0';
let isStandby = false;
let lastUserHeartbeat = 0;
let standbyCooldownUntil = 0;
let standbyWatcherTimer = null;
let pendingExitTimer = null;

function enterStandbyMode(reason) {
    if (pendingExitTimer) {
        clearTimeout(pendingExitTimer);
        pendingExitTimer = null;
    }
    if (!standbyEnabled) {
        addLog(`[STANDBY DISABLED] Kérelem: ${reason} - A 24/7 mód aktív, a kapcsolat nem szakad meg.`);
        return;
    }
    const wasStandby = isStandby;
    isStandby = true;
    lastUserHeartbeat = Date.now();
    standbyCooldownUntil = Date.now() + 180000; // 3 perc védelem ha nincs aktív heartbeat

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (!wasStandby) {
        addLog(`[STANDBY AKTIVÁLVA] Indok: ${reason}. A 24/7 keeper átadja a helyet a PC-nek.`);
    }

    if (activeWs) {
        try {
            activeWs.close(1000, 'Yielding to PC user');
        } catch (_) {}
    }
    joined = false;

    if (!standbyWatcherTimer) {
        standbyWatcherTimer = setInterval(checkStandbyLoop, 10000);
    }
}

function checkStandbyLoop() {
    if (!isStandby) return;

    const now = Date.now();
    // 1. Ha az elmúlt 35 másodpercben jött heartbeat a böngészőből, a felhasználó aktív
    if (now - lastUserHeartbeat < 35000) {
        return;
    }

    // 2. Ha nem jött heartbeat, de még tart a minimális cooldown (pl. más eszközről belépés):
    if (now < standbyCooldownUntil) {
        addLog(`[STANDBY] Várakozás a PC használat befejezésére (${Math.round((standbyCooldownUntil - now) / 1000)}s van hátra)...`);
        return;
    }

    // 3. Ha lejárt a heartbeat és a cooldown is -> a felhasználó kilépett a PC-ről!
    exitStandbyMode('Inaktivitás / Kilépés észlelve');
}

function exitStandbyMode(reason) {
    if (!isStandby) return;
    isStandby = false;
    standbyCooldownUntil = 0;
    lastUserHeartbeat = 0;
    if (standbyWatcherTimer) {
        clearInterval(standbyWatcherTimer);
        standbyWatcherTimer = null;
    }
    addLog(`[STANDBY FELOLDVA] ${reason || ''}. 24/7 keeper visszacsatlakozik az xmradio szobába.`);
    scheduleReconnect();
}

function scheduleReconnect() {
    if (isStandby) {
        addLog('[AUTO-RECONNECT SKIPPED] Standby aktív (felhasználó PC-n van), nem csatlakozunk újra.');
        return;
    }
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (isStandby) return;
        if (!activeWs || activeWs.readyState === WebSocket.CLOSED) {
            addLog('[AUTO-RECONNECT] Re-entering room...');
            SendC('leaveBackground', '', roomName);
        }
    }, 4000);
}

const knownUsers = new Map();
const lastInteraction = new Map();
let lastTargetId = '';
let lastTargetNick = '';
const userDeliveryState = new Map();

const PM_REPLY_TEXT = "Hey there! Thanks for reaching out, enjoy the music on xmradio! :)";
const ROOM_FALLBACK_TEXT = (nick) => `@${nick} Hey! Your private messages are locked, but welcome and enjoy the music on xmradio! (cool)`;

// TIER 1 (FŐ / PRIMARY): Privát csevegő fül (PC tab)
function sendTier1PCTab(senderId, nick) {
    addLog(`[TIER 1 - PRIVÁT CSEVEGŐ FÜL] Privát csevegő fül nyitása és küldés ${nick} (${senderId}) részére...`);
    userDeliveryState.set(senderId, { nick, tier: 1, time: Date.now() });

    // 1. WASM native PrivateChat init (nyitja a privát csevegő fül munkamenetet a WASM-ban)
    try {
        SendC('xatCommand', '', JSON.stringify({
            Command: 'Action',
            Next: 'messages',
            Page: 'actions',
            Type: 'Action',
            UserNo: parseInt(senderId, 10),
            name: 'PrivateChat'
        }));
    } catch (_) {}

    // 2. Szabályos xat privát fül nyitás
    sendPacket(`<z d="${senderId}" t="/" />`);

    setTimeout(() => {
        // 3. Szabályos xat privát üzenet küldés a fülbe (s="2")
        sendPacket(`<p u="${senderId}" t="${PM_REPLY_TEXT}" s="2" />`);
    }, 150);
}

// TIER 2 (FALLBACK 1): Fő chaten lakatban (<priv>) ha a privát csevegő fül zárolva van
function sendTier2MainPadlock(senderId, nick) {
    addLog(`[TIER 2 - FŐ CHAT LAKAT] Privát fül zárolva, lakat küldése a közös chaten ${nick} (${senderId}) részére...`);
    userDeliveryState.set(senderId, { nick, tier: 2, time: Date.now() });

    // 1. Üzenet a közös chatfolyamba lakat ikonnal (<priv>)
    sendPacket(`<p u="${senderId}" t="${PM_REPLY_TEXT}" />`);

    // 2. WASM native PrivateMessage dispatch (közös chat lakat <priv>)
    try {
        SendC('xatCommand', '', JSON.stringify({
            Command: 'Action',
            Message: PM_REPLY_TEXT,
            Next: 'messages',
            Page: 'actions',
            Type: 'Action',
            UserNo: parseInt(senderId, 10),
            name: 'PrivateMessage'
        }));
    } catch (_) {}
}

// TIER 3 (FALLBACK 2): Fő chaten nyilvánosan ahol mindenki látja (ha mindkét privát mód zárolva van)
function sendTier3Public(senderId, nick) {
    addLog(`[TIER 3 - FŐ CHAT NYILVÁNOS] Nyilvános kiírás a fő chaten @${nick} részére...`);
    userDeliveryState.set(senderId, { nick, tier: 3, time: Date.now() });

    const pubText = ROOM_FALLBACK_TEXT(nick);
    sendPacket(`<m t="${pubText}" />`);

    try {
        SendC('xatCommand', '', JSON.stringify({
            Type: 'Send',
            Command: 'Send',
            Page: 'messages',
            Message: pubText,
            msgId: Math.random().toString(36).substr(2, 9)
        }));
    } catch (_) {}
}

function handleUserInteraction(senderId, text, isClick, isPCTab) {
    const now = Date.now();
    // 4 seconds debounce per user
    if (lastInteraction.has(senderId) && (now - lastInteraction.get(senderId) < 4000)) {
        return;
    }
    lastInteraction.set(senderId, now);

    lastTargetId = senderId;
    const userObj = knownUsers.get(senderId);
    let targetNick = userObj ? userObj.cleanNick : `User_${senderId}`;
    if (!targetNick || targetNick === 'User_' + senderId) {
        targetNick = 'friend';
    }
    lastTargetNick = targetNick;

    const isGuest = parseInt(senderId, 10) > 4000000000;

    addLog(`[INTERACTION] Felhasználó: ${targetNick} (${senderId}, isGuest=${isGuest}) interakciót kezdeményezett (click=${isClick}, isPCTab=${isPCTab}, text="${text}").`);

    // Ha a profilból ismert, hogy a privát TELJESEN zárolt (friends-only padlock):
    if (userObj && userObj.isFriendOnly) {
        addLog(`[ZÁROLT PROFIL] ${targetNick} profilja friends-only zárolt (mindkét privát zárva), azonnali ugrás a fő nyilvános chatre...`);
        sendTier3Public(senderId, targetNick);
        return;
    }

    // Ha a felhasználó vendég vagy NoPC tiltása van:
    if (isGuest || (userObj && userObj.isNoPC)) {
        addLog(`[VENDÉG / NoPC] ${targetNick} nem tud privát fület fogadni, azonnali küldés lakatban és fő chaten nyilvánosan...`);
        sendTier2MainPadlock(senderId, targetNick);
        setTimeout(() => {
            sendTier3Public(senderId, targetNick);
        }, 500);
        return;
    }

    // FŐ ÁG (Tier 1): Privát csevegő fülbe küldés
    sendTier1PCTab(senderId, targetNick);

    // GARANTÁLT VÁLASZ: Ha 1.5 másodpercig nem igazolódik vissza a privát fül, menjen lakatban és a fő chaten
    setTimeout(() => {
        const state = userDeliveryState.get(senderId);
        if (state && state.tier === 1) {
            addLog(`[GARANTÁLT FALLBACK] ${targetNick} (${senderId}) részére lakat és nyilvános megerősítés...`);
            sendTier2MainPadlock(senderId, targetNick);
        }
    }, 1500);
}

let activeWs = null;
let joined = false;
let myServerId = botId;
let totalPacketsIn = 0;
let totalPacketsOut = 0;
const liveLogs = [];


function addLog(line) {
    const ts = new Date().toLocaleTimeString();
    liveLogs.push(`[${ts}] ${line}`);
    if (liveLogs.length > 200) liveLogs.shift();
    console.log(line);
}

function sendPacket(pkt) {
    if (!pkt || !activeWs || activeWs.readyState !== WebSocket.OPEN) return;
    totalPacketsOut++;
    const s = typeof pkt === 'string' ? pkt : pkt.toString();
    addLog('[RAW SEND]: ' + s.slice(0, 500));
    if (typeof pkt === 'string') {
        if (!pkt.endsWith('\0')) pkt += '\0';
        activeWs.send(Buffer.from(pkt));
    } else {
        activeWs.send(pkt);
    }
}

function handleJson(raw) {
    if (!raw) return;
    try {
        const obj = JSON.parse(raw);
        const type = parseInt(obj.Type, 10);
        const cmd = obj.Cmd || '';
        const data = obj.Data || '';

        // 1 = LOADURL
        if (type === 1) {
            if (urlCache[cmd]) {
                SendC('xatURL', cmd, urlCache[cmd]);
                return;
            }
            const targetUrl = cmd.replace('https://xat.com', 'https://xath.hu');
            if (urlCache[targetUrl]) {
                SendC('xatURL', cmd, urlCache[targetUrl]);
                return;
            }
            let httpAgent = null;
            if (PROXY_URL) {
                if (PROXY_URL.startsWith('socks')) httpAgent = new SocksProxyAgent(PROXY_URL);
                else httpAgent = new HttpsProxyAgent(PROXY_URL);
            }
            https.get(targetUrl, {
                agent: httpAgent,
                headers: {
                    'User-Agent': global.window.navigator.userAgent,
                    'Origin': 'https://xath.hu',
                    'Referer': `https://xath.hu/${roomName}`
                }
            }, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => {
                    urlCache[cmd] = body;
                    SendC('xatURL', cmd, body);
                });
            }).on('error', () => {});
        }
        // 4 = CONNECT
        else if (type === 4) {
            if (isStandby) {
                addLog('[WS CONNECT BLOCKED] Standby aktív (felhasználó PC-n/másik eszközön van), kapcsolat blokkolva.');
                return;
            }
            if (activeWs) {
                try { activeWs.close(); } catch (_) {}
            }

            const wsOptions = {
                headers: {
                    'Origin': 'https://xath.hu',
                    'User-Agent': global.window.navigator.userAgent
                },
                handshakeTimeout: 10000
            };
            if (PROXY_URL) {
                if (PROXY_URL.startsWith('socks')) {
                    wsOptions.agent = new SocksProxyAgent(PROXY_URL);
                } else {
                    wsOptions.agent = new HttpsProxyAgent(PROXY_URL);
                }
            }

            addLog(`[WS CONNECTING] Connecting to wss://wss.xath.hu:443/v2 via ${PROXY_URL || 'Direct'}...`);
            activeWs = new WebSocket('wss://wss.xath.hu:443/v2', wsOptions);

            activeWs.on('open', () => {
                addLog('[WS OPEN] Connected to wss.xath.hu!');
                if (reconnectTimer) {
                    clearTimeout(reconnectTimer);
                    reconnectTimer = null;
                }
                SendC('xatMessageReceived', '#CONNECT_OK', '');
                const hostB64 = Buffer.from('xat.com').toString('base64');
                SendC('xatMessageOK', '#CONNECT_CHECK', hostB64);
            });

            activeWs.on('message', (eventData) => {
                totalPacketsIn++;
                const buf = Buffer.from(eventData);
                const str = buf.toString('utf8');
                addLog('[RAW RECV]: ' + str.slice(0, 500));

                if (str.includes(botNick)) {
                    const idMatch = str.match(new RegExp(`<u [^>]*u="(\\d+)"[^>]*n="${botNick}`, 'i')) ||
                                    str.match(new RegExp(`<u [^>]*n="${botNick}[^"]*"[^>]*u="(\\d+)"`, 'i'));
                    if (idMatch) myServerId = idMatch[1];
                }

                if (str.includes('<m t="/s"')) {
                    sendPacket('<m t="/s" u="0" />');
                }

                // Track all room users and their padlock status
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

                // Listen for clicks (<z ... t="/l"/>) and inbound PMs
                if (str.includes('<z ') || str.includes('<p ')) {
                    const pPackets = str.match(/<[pz] [^>]+>/g) || [];
                    for (const pkt of pPackets) {
                        const uMatch = pkt.match(/\bu="(\d+)"/);
                        const dMatch = pkt.match(/\bd="(\d+)"/);
                        const tMatch = pkt.match(/\bt="([^"]*)"/);
                        const text = tMatch ? tMatch[1] : '';
                        let senderId = uMatch ? uMatch[1] : null;
                        if (!senderId && dMatch && dMatch[1] !== botId && dMatch[1] !== myServerId) {
                            senderId = dMatch[1];
                        }
                        const isForMe = !dMatch || dMatch[1] === botId || dMatch[1] === myServerId;

                        if (isForMe && senderId && senderId !== botId && senderId !== myServerId && senderId !== '0' && senderId !== '1' && senderId !== '10101' && senderId !== '30303') {
                            const isClick = pkt.includes('t="/l"');
                            const isPCTab = pkt.includes('s="2"') || (pkt.startsWith('<z ') && !isClick);
                            handleUserInteraction(senderId, text, isClick, isPCTab);
                        }
                    }
                }

                // Hierarchical Escalation on Server Rejection:
                const isFriendOnlyRejection = str.includes('Not added you as a friend') ||
                                              str.includes('only accepts private messages from friends');

                const isPcRejection = str.includes('does not accept private chats') ||
                                      str.includes('cannot private chat') ||
                                      str.includes('has private chat disabled') ||
                                      str.includes('nopc') ||
                                      str.includes('only accepts private messages') ||
                                      str.includes('Not accepting private chat');

                const isGeneralRejection = isFriendOnlyRejection ||
                                           str.includes('cannot send private message') ||
                                           str.includes('does not accept private') ||
                                           str.includes('cannot private message') ||
                                           str.includes('blocked');

                if ((isGeneralRejection || isPcRejection) && lastTargetId) {
                    const currentState = userDeliveryState.get(lastTargetId);
                    const targetNick = lastTargetNick || (currentState ? currentState.nick : `User_${lastTargetId}`);

                    if (isFriendOnlyRejection) {
                        // Friend-only lock: Mindkét privát csatorna zárva -> Tier 3 nyilvános
                        addLog(`[SZERVER ELUTASÍTÁS - FRIEND-ONLY ZÁROLVA]: Target: ${targetNick} (${lastTargetId}) -> Tier 3 Fő chat nyilvános`);
                        setTimeout(() => {
                            sendTier3Public(lastTargetId, targetNick);
                        }, 300);
                    } else if (currentState && currentState.tier === 1) {
                        // Tier 1 (PC fül) visszadobva -> Tier 2 Fő chat lakat
                        addLog(`[SZERVER ELUTASÍTÁS - PRIVÁT FÜL ZÁROLVA]: Target: ${targetNick} (${lastTargetId}) -> Tier 2 Fő chat lakat`);
                        setTimeout(() => {
                            sendTier2MainPadlock(lastTargetId, targetNick);
                        }, 300);
                    } else if (currentState && currentState.tier === 2) {
                        // Tier 2 (Fő chat lakat) is visszadobva -> Tier 3 Fő chat nyilvános
                        addLog(`[SZERVER ELUTASÍTÁS - LAKAT IS ZÁROLVA]: Target: ${targetNick} (${lastTargetId}) -> Tier 3 Fő chat nyilvános`);
                        setTimeout(() => {
                            sendTier3Public(lastTargetId, targetNick);
                        }, 300);
                    }
                }


                if (str.includes('<done') && !joined) {
                    joined = true;
                    addLog(`[ONLINE 24/7] ${botNick} (${myServerId}) joined ${roomName} successfully!`);

                    if (!pingTimer) {
                        pingTimer = setInterval(() => {
                            sendPacket('<m t="/s" u="0" />');
                        }, 25000);
                    }

                    setTimeout(() => {
                        sendPacket(`<x i="418" n="${botNick}" a="${botAvatar}" />`);
                    }, 500);

                    if (initialMsg && !hasGreeted) {
                        hasGreeted = true;
                        setTimeout(() => {
                            addLog('[VISIBILITY] Sending initial greeting...');
                            SendC('xatCommand', '', JSON.stringify({
                                Type: 'Send',
                                Command: 'Send',
                                Page: 'messages',
                                Message: initialMsg,
                                msgId: Math.random().toString(36).substr(2, 9)
                            }));
                        }, 4000);
                    }
                }


                if (str.includes('<v ')) {
                    const vMatch = str.match(/<v ([^>]+)>/);
                    if (vMatch) {
                        const attrs = vMatch[1].match(/(\w+)="([^"]*)"/g) || [];
                        for (const attr of attrs) {
                            const [k, v] = attr.split('="');
                            const val = v.slice(0, -1);
                            if (k.startsWith('d') && !isNaN(parseInt(k.slice(1), 10))) {
                                todoObj['w_' + k] = val;
                            } else if (k === 'k1') {
                                todoObj.w_k1 = val;
                                botK1 = val;
                            } else if (k === 'k2') {
                                todoObj.w_k2 = val;
                                botK2 = val;
                            } else if (k === 'k3') {
                                todoObj.w_k3 = val;
                            }
                        }
                        todoObj.w_PowerO = '';
                        store['todo'] = JSON.stringify(todoObj);
                        try {
                            fileCfg.todo = todoObj;
                            fs.writeFileSync(path.resolve(__dirname, configFile), JSON.stringify(fileCfg, null, 2));
                        } catch (_) {}
                        addLog('[POWER MASKS UPDATED] Saved masks from <v> packet.');
                    }
                }

                // Duplicate login / kick észlelése
                if (str.includes('<dup') || str.includes('t="/k"') || str.includes('<k ') || str.includes('duplicate') || str.includes('another location')) {
                    addLog('[DUPLICATE SESSION] Belépés történt egy másik eszközről (PC/telefon)! Standby mód bekapcsolása...');
                    enterStandbyMode('Szerver duplikált bejelentkezési kick');
                } else if (str.includes('<logout')) {
                    addLog(`[SERVER LOGOUT / REJECT] Szerver kijelentkeztetési válasz: ${str.slice(0, 100)}`);
                    if (str.includes('E43')) {
                        addLog('[AUTH E43] A munkamenet kulcsok lejártak vagy a fiók jelenleg másik eszközről aktív.');
                        enterStandbyMode('E43 - Másik eszközön aktív vagy friss session szükséges');
                    } else {
                        enterStandbyMode(`Szerver logout (${str.slice(0, 40)})`);
                    }
                }

                SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
            });

            activeWs.on('close', (code, reason) => {
                const reasonStr = reason ? reason.toString('utf8') : '';
                addLog(`[WS CLOSED] Code: ${code}, Reason: ${reasonStr}`);
                SendC('xatMessageReceived', '#CONNECT_CLOSE', '');
                joined = false;
                if (code === 1008 || code === 4000 || reasonStr.toLowerCase().includes('dup') || reasonStr.toLowerCase().includes('another')) {
                    enterStandbyMode(`Szerver zárási kód: ${code} (${reasonStr || 'Másik eszközről belépve'})`);
                } else {
                    scheduleReconnect();
                }
            });

            activeWs.onerror = (err) => {
                addLog(`[WS ERROR] ${err.message}`);
            };
        }
        // 2 = SEND PACKET
        else if (type === 2) {
            if (data.includes('Not added you as a friend')) return;
            sendPacket(Buffer.from(data));
        }
    } catch (_) {}
}

// HTTP Server for Render Healthcheck & Dashboard
const HTTP_PORT = parseInt(process.env.PORT || '10000', 10);
const startTime = Date.now();
const srv = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/api/sync-session') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let receivedTodo = null;
            if (body) {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.todo && typeof parsed.todo === 'object') {
                        receivedTodo = parsed.todo;
                    } else if (parsed.PassHash && (parsed.w_userno || parsed.DeviceId)) {
                        receivedTodo = parsed;
                    }
                } catch (_) {}
            }

            if (receivedTodo) {
                const isSzaby = String(receivedTodo.w_userno || receivedTodo.UserId || '') === '2000000' ||
                                String(receivedTodo.w_name || '') === 'Szaby' ||
                                String(receivedTodo.w_registered || '') === 'Szaby';
                if (!isSzaby || !receivedTodo.PassHash) {
                    addLog(`[SESSION SYNC ELDOBVA] Nem Szaby bejelentkezett munkamenet (User: ${receivedTodo.w_name || receivedTodo.w_userno}, PassHash: ${receivedTodo.PassHash ? 'van' : 'nincs'})`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ status: 'ignored', ok: false }));
                }

                addLog(`[SESSION SYNC ELFOGADVA] Új hitelesítés Szaby részére (cb: ${receivedTodo.w_cb}, dt: ${receivedTodo.w_dt})!`);
                todoObj = Object.assign({}, todoObj, receivedTodo);
                todoObj.w_PowerO = '';
                store['todo'] = JSON.stringify(todoObj);
                try {
                    fileCfg.todo = todoObj;
                    if (receivedTodo.w_k1) fileCfg.k1 = receivedTodo.w_k1;
                    if (receivedTodo.w_k2) fileCfg.k2 = receivedTodo.w_k2;
                    if (receivedTodo.PassHash) fileCfg.passHash = receivedTodo.PassHash;
                    if (receivedTodo.DeviceId) fileCfg.deviceId = receivedTodo.DeviceId;
                    fs.writeFileSync(path.resolve(__dirname, configFile), JSON.stringify(fileCfg, null, 2));
                } catch (_) {}

                if (!joined && !isStandby) {
                    scheduleReconnect();
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ status: 'synced', ok: true }));
            }

            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'error', message: 'No todo provided' }));
        });
        return;
    }

    if (url.pathname === '/user-active' || url.pathname === '/yield') {
        enterStandbyMode('PC böngésző / felhasználó kérése');
        const accept = req.headers['accept'] || '';
        if (req.method === 'GET' && !accept.includes('application/json')) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end('<!DOCTYPE html><html><body style="background:#0d1117;color:#58a6ff;font-family:sans-serif;text-align:center;padding:50px;"><h2>Standby aktív! A 24/7 bot átadta a helyet a gépednek.</h2><p style="color:#c9d1d9;">Most már nyugodtan cseveghetsz a gépedről. Ha bezárod a lapot, a bot automatikusan visszalép.</p></body></html>');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'standby', ok: true, isStandby: isStandby }));
    }

    if (url.pathname === '/user-inactive') {
        addLog('[BÖNGÉSZŐ JELEZTE A KILÉPÉST] 20 másodperces türelmi idő indul (újratöltés elleni védelem)...');
        if (!pendingExitTimer) {
            pendingExitTimer = setTimeout(() => {
                pendingExitTimer = null;
                if (isStandby && Date.now() - lastUserHeartbeat >= 15000) {
                    lastUserHeartbeat = 0;
                    exitStandbyMode('Böngésző végleg bezárva');
                }
            }, 20000);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'grace_period', ok: true, isStandby: isStandby }));
    }

    if (url.pathname === '/force-reconnect') {
        addLog('[MANUÁLIS PARANCS] Kézi újracsatlakozás kérése...');
        isStandby = false;
        joined = false;
        if (activeWs) {
            try { activeWs.close(1000, 'Manual reconnect'); } catch (_) {}
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'reconnecting', ok: true }));
        scheduleReconnect();
        return;
    }

    if (url.pathname === '/health' || url.pathname === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: isStandby ? 'standby' : (joined ? 'online' : 'connecting'),
            user: botNick,
            id: myServerId,
            room: roomName,
            isStandby: isStandby,
            proxy: PROXY_URL || 'Direct',
            packetsIn: totalPacketsIn,
            packetsOut: totalPacketsOut,
            uptime_sec: Math.floor((Date.now() - startTime) / 1000)
        }));
    }

    if (url.pathname === '/api/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ logs: liveLogs }));
    }

    if (url.pathname === '/api/debug') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            todoObj: todoObj,
            joined: joined,
            isStandby: isStandby,
            standbyEnabled: standbyEnabled
        }, null, 2));
    }

    // Default HTML Dashboard
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const badgeColor = isStandby ? '#d29922' : (joined ? '#238636' : '#da3633');
    const badgeText = isStandby ? 'STANDBY (PC-n használatban)' : (joined ? 'ONLINE 24/7' : 'CONNECTING...');
    res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>xath 24/7 Keeper - ${botNick}</title>
<style>body{background:#0d1117;color:#c9d1d9;font-family:sans-serif;padding:20px;max-width:700px;margin:auto;}
.badge{padding:4px 10px;border-radius:12px;font-weight:bold;background:${badgeColor};color:#fff;}
pre{background:#161b22;padding:12px;border-radius:6px;overflow-x:auto;max-height:300px;border:1px solid #30363d;font-size:12px;}
button{background:#238636;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:bold;}
</style></head>
<body>
<h2>xath 24/7 Keeper &bull; <span class="badge">${badgeText}</span></h2>
<p><b>Felhasználó:</b> ${botNick} (ID: ${myServerId}) | <b>Szoba:</b> ${roomName}</p>
<p><b>Állapot:</b> ${isStandby ? 'Háttérben vár (PC-ről bejelentkezve)' : (joined ? 'Aktív 24/7 jelenlét' : 'Csatlakozás...')}</p>
<p><b>Proxy:</b> ${PROXY_URL || 'Direct connection'}</p>
<p><b>Csomagok (Ki / Be):</b> ${totalPacketsOut} / ${totalPacketsIn}</p>
<p><a href="/force-reconnect"><button>Force Reconnect (Azonnali újracsatlakozás)</button></a></p>
<h3>Élő Napló:</h3>
<pre>${liveLogs.join('\n')}</pre>
</body></html>`);
});

srv.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`[HTTP] Render health check server listening on port ${HTTP_PORT}`);
});

Module.onRuntimeInitialized = async () => {
    SendC('sendStuff', JSON.stringify({ Flags: 6, origin: 'https://xath.hu' }), '');
    SendC('xatInit', '', '');
    SendC('xatCommand', '', JSON.stringify({ Type: 'Setting', Command: 'Setting', Name: 'name', Value: botNick }));
    SendC('xatCommand', '', JSON.stringify({ Type: 'Setting', Command: 'Setting', Name: 'avatar', Value: String(botAvatar) }));
    SendC('SetPage', '', 'classic');
    SendC('xatMain', '', '');
    SendC('leaveBackground', '', roomName);
    SendC('ConsoleOff', '', '');
    SendC('SetPhoneFontSize', '', '1.0');
    SendC('setLang', '', 'hu');
    SendC('xatCommand', '', JSON.stringify({ Command: 'EnableTick' }));

    while (true) {
        let res = SendC('xatTick', '', '');
        while (res) {
            handleJson(res);
            res = SendC('ReadToJavaFifo', '', '');
        }
        await new Promise(r => setTimeout(r, 60));
    }
};

new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
