'use strict';

const fs = require('fs');
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

const roomName = getArg('room', fileCfg.room || 'xmradio');
const botNick = getArg('nick', fileCfg.nick || 'Szaby');
const botAvatar = getArg('avatar', fileCfg.avatar || '753');
let botId = getArg('id', fileCfg.userId || (fileCfg.todo && fileCfg.todo.w_userno) || null);
let botK1 = getArg('k1', fileCfg.k1 || (fileCfg.todo && fileCfg.todo.w_k1) || null);
let botK2 = getArg('k2', fileCfg.k2 || (fileCfg.todo && fileCfg.todo.w_k2) || null);
let botRegname = getArg('regname', fileCfg.regname || (fileCfg.todo && fileCfg.todo.w_registered) || (botId ? botNick : null));
let botDeviceId = getArg('deviceid', fileCfg.deviceId || (fileCfg.todo && fileCfg.todo.DeviceId) || '');
let botPassHash = getArg('passhash', fileCfg.passHash || (fileCfg.todo && fileCfg.todo.PassHash) || '');

const IS_SILENT = args.includes('--silent') || args.includes('--no-chat') || args.includes('--no-msg');
const initialMsg = IS_SILENT ? '' : getArg('msg', fileCfg.greeting || 'sziasztok mindenkinek :)');
const STAY_SECONDS = parseInt(getArg('stay', '0'), 10);
const CHAT_INTERVAL = IS_SILENT ? 0 : parseInt(getArg('chat-interval', '60'), 10);
const rawProxy = getArg('proxy', null);
const TARGET_USER = getArg('target', null);

const messagedUsers = new Set();
const PM_GREETINGS = [
    "Szia! Jo szorakozast a radional! :)",
    "Szia! Kellemes estet, jo pihenest!",
    "Udv a szobaban, szuper a musor ma! :)",
    "Szia szia! Jo zenehallgatast! :D",
    "Pacsi! Kellemes estet neked!",
    "Szia, orulok hogy itt vagy! :)"
];

const PM_REPLIES = [
    "koszi szepen! :)",
    "kellemes estet neked is!",
    "nagyon adja a zene!",
    "orulok, hogy tetszik! ;)",
    ":)",
    "koszonom szepen! :D",
    "hallgatom a hatterben :)"
];

const ROOM_PHRASES = [
    "sziasztok :)", "hali mindenkinek", "szep estet mindenkinek!", "jo a zene nagyon",
    "koszi az adast!", "udv a szobaban", "szia szia", "szep estet", "nagyon adja a radio",
    "pacek a track", "jo pihenest mindenkinek", "helloka", "mizu erre?", "pacsi mindenkinek",
    "hallgatom a hatterben :)", "szupi zene", "udv mindenkinek!", "jofejek vagytok",
    ":)", ";)", "szep zene :D"
];

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
    todoObj = Object.assign({}, fileCfg.todo, todoObj);
    todoObj.w_PowerO = '';
    todoObj.w_registered = botRegname || fileCfg.todo.w_registered || botNick;
    if (botId) todoObj.w_userno = botId;
    if (botK1) todoObj.w_k1 = botK1;
    if (botK2) todoObj.w_k2 = botK2;
    if (botNick) todoObj.w_name = botNick;
    if (botAvatar) todoObj.w_avatar = String(botAvatar);
    if (botDeviceId) todoObj.DeviceId = botDeviceId;
    if (botPassHash) todoObj.PassHash = botPassHash;
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

const BOT_IDS = new Set();
try {
    const rawIds = fs.readFileSync(path.join(__dirname, 'listids_xath.txt'), 'utf8');
    const matches = rawIds.match(/UserId=(\d+)/gi) || [];
    for (const m of matches) {
        const id = m.split('=')[1];
        if (id) BOT_IDS.add(id);
    }
} catch (_) {}

let activeWs = null;
let joined = false;
let myServerId = botId;
const roomUsers = new Set();

function sendPacket(pkt) {
    if (!pkt || !activeWs || activeWs.readyState !== WebSocket.OPEN) {
        console.log('[SEND DROPPED: WS NOT OPEN]', pkt);
        return;
    }
    const s = typeof pkt === 'string' ? pkt : pkt.toString();
    console.log('[RAW SEND]:', s);
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
            https.get(targetUrl, {
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
            if (activeWs) {
                try { activeWs.close(); } catch (_) {}
            }

            const wsOptions = {
                headers: {
                    'Origin': 'https://xath.hu',
                    'User-Agent': global.window.navigator.userAgent
                },
                handshakeTimeout: 8000
            };
            if (PROXY_URL) {
                if (PROXY_URL.startsWith('socks')) {
                    wsOptions.agent = new SocksProxyAgent(PROXY_URL);
                } else {
                    wsOptions.agent = new HttpsProxyAgent(PROXY_URL);
                }
            }

            activeWs = new WebSocket('wss://wss.xath.hu:443/v2', wsOptions);

            activeWs.on('open', () => {
                SendC('xatMessageReceived', '#CONNECT_OK', '');
                const hostB64 = Buffer.from('xat.com').toString('base64');
                SendC('xatMessageOK', '#CONNECT_CHECK', hostB64);
            });

            function initiatePrivateChat(targetId) {
                if (!targetId || targetId === botId || targetId === myServerId || targetId === '0' || BOT_IDS.has(targetId) || messagedUsers.has(targetId)) return;
                messagedUsers.add(targetId);

                const pmText = PM_GREETINGS[Math.floor(Math.random() * PM_GREETINGS.length)];
                console.log(`[INITIATE PC] ${botNick} proactively messaging ${targetId}: "${pmText}"`);

                const opts = Buffer.from(JSON.stringify({
                    isTranslated: "",
                    msgId: Math.random().toString(36).substr(2, 9),
                    type: "msg"
                })).toString('base64');

                // 1. Tickle notification
                sendPacket(`<z d="${targetId}" t="/l" />`);

                // 2. Private Chat packet (routes to PC tab)
                sendPacket(`<z d="${targetId}" u="${botId}_0" t="${pmText}" o="${opts}" s="2" />`);
                sendPacket(`<z d="${targetId}" u="${botId}" t="${pmText}" o="${opts}" s="2" />`);

                // 3. Direct Private Message (padlock in room, seen exclusively by target user)
                sendPacket(`<p u="${targetId}" t="${pmText}" />`);
            }

            activeWs.on('message', (eventData) => {
                const buf = Buffer.from(eventData);
                const str = buf.toString('utf8');
                console.log('[RAW RECV]:', str);

                // Track our own assigned user ID
                if (str.includes(botNick)) {
                    const idMatch = str.match(new RegExp(`<u [^>]*u="(\\d+)"[^>]*n="${botNick}`, 'i')) ||
                                    str.match(new RegExp(`<u [^>]*n="${botNick}[^"]*"[^>]*u="(\\d+)"`, 'i'));
                    if (idMatch) myServerId = idMatch[1];
                }

                // Server keepalive / ping
                if (str.includes('<m t="/s"')) {
                    sendPacket('<m t="/s" u="0" />');
                }

                // Inbound Private Chat (PC) or Private Message (PM)
                if (str.includes('<p ') || str.includes('<z ')) {
                    const pPackets = str.match(/<[pz] [^>]+>/g) || [];
                    for (const pkt of pPackets) {
                        console.log(`[INBOUND PC/PM]: ${pkt}`);
                        const uMatch = pkt.match(/\bu="(\d+)"/);
                        const dMatch = pkt.match(/\bd="(\d+)"/);
                        if (dMatch) {
                            myServerId = dMatch[1];
                        }
                        let senderId = uMatch ? uMatch[1] : null;
                        if (!senderId || senderId === myServerId || senderId === botId) {
                            if (dMatch && dMatch[1] !== botId && dMatch[1] !== myServerId) {
                                senderId = dMatch[1];
                            }
                        }

                        const tMatch = pkt.match(/\bt="([^"]*)"/);
                        const msgText = tMatch ? tMatch[1] : '';

                        if (!IS_SILENT && senderId && senderId !== botId && senderId !== myServerId && senderId !== '0' && senderId !== '1' && !msgText.startsWith('/')) {
                            const replyDelay = Math.floor(400 + Math.random() * 500);
                            setTimeout(() => {
                                const reply = PM_REPLIES[Math.floor(Math.random() * PM_REPLIES.length)];
                                console.log(`[PC REPLY] ${botNick} (${myServerId}) replying in PC tab to ${senderId}: "${reply}"`);

                                const opts = Buffer.from(JSON.stringify({
                                    isTranslated: "",
                                    msgId: Math.random().toString(36).substr(2, 9),
                                    type: "msg"
                                })).toString('base64');

                                // Direct verified <z> Private Chat packets
                                sendPacket(`<z d="${senderId}" u="${botId}_0" t="${reply}" o="${opts}" s="2" />`);
                                sendPacket(`<z d="${senderId}" u="${botId}" t="${reply}" o="${opts}" s="2" />`);
                            }, replyDelay);
                        }
                    }
                }

                // If another user speaks in main room, small chance to open PC tab
                if (str.includes('<m ') && joined) {
                    const mMatch = str.match(/u="(\d+)"/);
                    if (mMatch) {
                        const senderId = mMatch[1];
                        if (senderId !== botId && senderId !== myServerId && senderId !== '0' && !messagedUsers.has(senderId)) {
                            if (Math.random() < 0.12) {
                                messagedUsers.add(senderId);
                                const delay = Math.floor(1800 + Math.random() * 2500);
                                setTimeout(() => {
                                    const pmText = PM_GREETINGS[Math.floor(Math.random() * PM_GREETINGS.length)];
                                    console.log(`[PC TAB OPENED] ${botNick} opening Private Chat tab with ${senderId}: "${pmText}"`);

                                    const opts = Buffer.from(JSON.stringify({
                                        isTranslated: "",
                                        msgId: Math.random().toString(36).substr(2, 9),
                                        type: "msg"
                                    })).toString('base64');

                                    sendPacket(`<z d="${senderId}" t="/l" />`);
                                    setTimeout(() => {
                                        sendPacket(`<z d="${senderId}" u="${botId}_0" t="${pmText}" o="${opts}" s="2" />`);
                                    }, 400);
                                }, delay);
                            }
                        }
                    }
                }

                // Scan all room visitors (<u packets)
                if (str.includes('<u ')) {
                    const uPackets = str.match(/<u [^>]+>/g) || [];
                    for (const uPkt of uPackets) {
                        const idMatch = uPkt.match(/\bu="(\d+)"/);
                        if (idMatch) {
                            const uId = idMatch[1];
                            if (uId !== botId && uId !== myServerId && uId !== '0' && !BOT_IDS.has(uId)) {
                                roomUsers.add(uId);
                                if (!IS_SILENT && joined && !messagedUsers.has(uId)) {
                                    const delay = Math.floor(1500 + Math.random() * 3000);
                                    setTimeout(() => {
                                        initiatePrivateChat(uId);
                                    }, delay);
                                }
                            }
                        }
                    }
                }

                if (str.includes('<done') && !joined) {
                    joined = true;
                    console.log(`[ONLINE] ${botNick} joined ${roomName}! Detected ${roomUsers.size} real room users.`);

                    // Keep-alive ping interval
                    setInterval(() => {
                        sendPacket('<m t="/s" u="0" />');
                    }, 25000);
                    setTimeout(() => {
                        sendPacket(`<x i="418" n="${botNick}" a="${botAvatar}" />`);
                    }, 500);

                    setTimeout(() => {
                        console.log('[VISIBILITY] Breaking invisible mode via normal greeting in main room...');
                        SendC('xatCommand', '', JSON.stringify({
                            Type: 'Send',
                            Command: 'Send',
                            Page: 'messages',
                            Message: 'Sziasztok :)',
                            msgId: Math.random().toString(36).substr(2, 9)
                        }));
                    }, 1500);

                    // Proactively message all real room visitors
                    if (!IS_SILENT) {
                        let staggerOffset = 2000;
                        for (const uId of roomUsers) {
                            if (!messagedUsers.has(uId)) {
                                setTimeout(() => {
                                    initiatePrivateChat(uId);
                                }, staggerOffset);
                                staggerOffset += Math.floor(2500 + Math.random() * 2000);
                            }
                        }
                    }

                    if (initialMsg && !TARGET_USER) {
                        const greetDelay = Math.floor(1500 + Math.random() * 3500);
                        setTimeout(() => {
                            SendC('xatCommand', '', JSON.stringify({
                                Type: 'Send',
                                Command: 'Send',
                                Page: 'messages',
                                Message: initialMsg,
                                msgId: Math.random().toString(36).substr(2, 9)
                            }));
                        }, greetDelay);
                    }

                    if (TARGET_USER) {
                        setTimeout(() => {
                            initiatePrivateChat(TARGET_USER);
                        }, 800);
                    }

                    // Periodic chatter in the main room via WASM
                    if (CHAT_INTERVAL > 0) {
                        function scheduleChat() {
                            const delay = Math.floor((CHAT_INTERVAL * 0.7 + Math.random() * CHAT_INTERVAL * 0.6) * 1000);
                            setTimeout(() => {
                                if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                                    if (Math.random() < 0.25) {
                                        const phrase = ROOM_PHRASES[Math.floor(Math.random() * ROOM_PHRASES.length)];
                                        console.log(`[CHATTER] ${botNick} sending to room: "${phrase}"`);
                                        SendC('xatCommand', '', JSON.stringify({
                                            Type: 'Send',
                                            Command: 'Send',
                                            Page: 'messages',
                                            Message: phrase,
                                            msgId: Math.random().toString(36).substr(2, 9)
                                        }));
                                    }
                                    scheduleChat();
                                }
                            }, delay);
                        }
                        scheduleChat();
                    }
                }

                // Capture <v ...> updates from server (re-login or power update)
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
                        console.log('[UPDATED TODO FROM <v> PACKET]: saved power masks to account_config.json');
                    }
                }

                SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
            });

            activeWs.on('close', (code, reason) => {
                console.log('[WS CLOSED]', code, reason ? reason.toString() : '');
                SendC('xatMessageReceived', '#CONNECT_CLOSE', '');
                if (joined) {
                    console.log('[SESSION ENDED] Exiting cleanly for supervisor restart...');
                    process.exit(0);
                } else {
                    setTimeout(() => {
                        if (!activeWs || activeWs.readyState === WebSocket.CLOSED) {
                            console.log('[RECONNECTING AFTER CLOSE]...');
                            SendC('leaveBackground', '', roomName);
                        }
                    }, 1000);
                }
            });

            activeWs.onerror = (err) => {};
        }
        // 2 = SEND PACKET
        else if (type === 2) {
            if (data.includes('Not added you as a friend')) {
                return;
            }
            console.log('[WASM ORIGINAL 2]:', data);
            let outData = data;
            console.log('[OUT 2]:', outData);
            sendPacket(Buffer.from(outData));
        }
    } catch (_) {}
}

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

    const start = Date.now();
    const DURATION = STAY_SECONDS > 0 ? STAY_SECONDS * 1000 : Infinity;

    while (STAY_SECONDS <= 0 || (Date.now() - start < DURATION)) {
        let res = SendC('xatTick', '', '');
        while (res) {
            handleJson(res);
            res = SendC('ReadToJavaFifo', '', '');
        }
        await new Promise(r => setTimeout(r, 60));
    }

    if (activeWs) activeWs.close();
    process.exit(0);
};

async function fetchGuestCredentials(proxyUrl) {
    let agent = null;
    if (proxyUrl) {
        if (proxyUrl.startsWith('socks')) agent = new SocksProxyAgent(proxyUrl);
        else agent = new HttpsProxyAgent(proxyUrl);
    }
    return new Promise((resolve) => {
        const req = https.get('https://xath.hu/web_gear/chat/auser3.php', {
            agent,
            timeout: 6000,
            headers: { 'User-Agent': USER_AGENT }
        }, (res) => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => {
                const u = d.match(/UserId=(\d+)/);
                const k1 = d.match(/k1=([a-zA-Z0-9]+)/);
                const k2 = d.match(/k2=(\d+)/);
                if (u && k1 && k2) {
                    resolve({ id: u[1], k1: k1[1], k2: k2[1] });
                } else {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

async function bootstrap() {
    if (!botId || botId === 'auto' || !botK1 || !botK2) {
        const creds = await fetchGuestCredentials(PROXY_URL);
        if (!creds) {
            console.log(`[PROXY FAIL] Unable to obtain guest ID through proxy: ${PROXY_URL || 'direct'}`);
            process.exit(1);
        }
        botId = creds.id;
        botK1 = creds.k1;
        botK2 = creds.k2;
        myServerId = botId;
        todoObj.w_userno = botId;
        todoObj.w_k1 = botK1;
        todoObj.w_k2 = botK2;
        store['todo'] = JSON.stringify(todoObj);
    }

    new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
}

bootstrap();
