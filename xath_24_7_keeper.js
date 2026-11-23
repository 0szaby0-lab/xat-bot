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

let pingTimer = null;
let hasGreeted = false;
let reconnectTimer = null;


function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (!activeWs || activeWs.readyState === WebSocket.CLOSED) {
            addLog('[AUTO-RECONNECT] Re-entering room...');
            SendC('leaveBackground', '', roomName);
        }
    }, 4000);
}

const knownUsers = new Map();
const lastInteraction = new Map();
let lastTargetNick = '';

const PM_REPLY_TEXT = "Hey there! Thanks for reaching out, enjoy the music on xmradio! :)";
const ROOM_FALLBACK_TEXT = (nick) => `@${nick} Hey! Your private messages are locked, but welcome and enjoy the music on xmradio! (cool)`;

function triggerRoomFallback(nick) {
    if (!nick) return;
    addLog(`[FALLBACK CHAT] Messaging @${nick} in main room...`);
    SendC('xatCommand', '', JSON.stringify({
        Type: 'Send',
        Command: 'Send',
        Page: 'messages',
        Message: ROOM_FALLBACK_TEXT(nick),
        msgId: Math.random().toString(36).substr(2, 9)
    }));
}

function sendPrivateReply(senderId) {
    addLog(`[PRIVÁT KÜLDÉS] Privát válasz küldése: ${senderId}`);

    // 1. Open PC Tab on target client
    sendPacket(`<z d="${senderId}" t="/" />`);

    setTimeout(() => {
        // 2. Private Chat (PC) tab text message
        sendPacket(`<z d="${senderId}" t="${PM_REPLY_TEXT}" />`);

        // 3. PC tab message format (s="2")
        sendPacket(`<p u="${senderId}" t="${PM_REPLY_TEXT}" s="2" />`);

        // 4. Standard PM whisper
        sendPacket(`<p u="${senderId}" t="${PM_REPLY_TEXT}" />`);

        // 5. WASM native PrivateMessage dispatch
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
    }, 250);
}

function handleUserInteraction(senderId, text, isClick) {
    const now = Date.now();
    // 5 seconds debounce per user
    if (lastInteraction.has(senderId) && (now - lastInteraction.get(senderId) < 5000)) {
        return;
    }
    lastInteraction.set(senderId, now);

    const userObj = knownUsers.get(senderId);
    let targetNick = userObj ? userObj.cleanNick : `User_${senderId}`;
    if (!targetNick || targetNick === 'User_' + senderId) {
        targetNick = 'friend';
    }
    lastTargetNick = targetNick;

    addLog(`[INTERACTION] User ${targetNick} (${senderId}) interacted (click=${isClick}, text="${text}").`);

    // If target has friend-only lock, fallback to room chat
    if (userObj && userObj.isFriendOnly) {
        addLog(`[ZÁROLT PRIVÁT] ${targetNick} barát-záras, közös chatre válaszolunk...`);
        setTimeout(() => triggerRoomFallback(targetNick), 400);
        return;
    }

    // Default: EXCLUSIVELY PRIVATE CHAT (PC tab + PM)
    sendPrivateReply(senderId);
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
    if (liveLogs.length > 50) liveLogs.shift();
    console.log(line);
}

function sendPacket(pkt) {
    if (!pkt || !activeWs || activeWs.readyState !== WebSocket.OPEN) return;
    totalPacketsOut++;
    const s = typeof pkt === 'string' ? pkt : pkt.toString();
    addLog('[RAW SEND]: ' + s.slice(0, 80));
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
                addLog('[RAW RECV]: ' + str.slice(0, 80));

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
                            const isFriendOnly = (flag & 32) !== 0 || uPkt.includes('no-pc') || uPkt.includes('padlock');
                            knownUsers.set(uid, { cleanNick, rawNick, isFriendOnly });
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
                            handleUserInteraction(senderId, text, pkt.includes('t="/l"'));
                        }
                    }
                }

                // Handle server rejection when recipient has PM locked (friend-only)
                if (str.includes('Not added you as a friend') || str.includes('only accepts private messages from friends') || str.includes('cannot send private message')) {
                    if (lastTargetNick) {
                        triggerRoomFallback(lastTargetNick);
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

                SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
            });

            activeWs.on('close', (code, reason) => {
                addLog(`[WS CLOSED] Code: ${code}, Reason: ${reason || ''}`);
                SendC('xatMessageReceived', '#CONNECT_CLOSE', '');
                joined = false;
                scheduleReconnect();
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
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/health' || url.pathname === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: joined ? 'online' : 'connecting',
            user: botNick,
            id: myServerId,
            room: roomName,
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

    // Default HTML Dashboard
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>xath 24/7 Keeper - ${botNick}</title>
<style>body{background:#0d1117;color:#c9d1d9;font-family:sans-serif;padding:20px;max-width:700px;margin:auto;}
.badge{padding:4px 10px;border-radius:12px;font-weight:bold;background:${joined ? '#238636' : '#da3633'};color:#fff;}
pre{background:#161b22;padding:12px;border-radius:6px;overflow-x:auto;max-height:300px;border:1px solid #30363d;font-size:12px;}
</style></head>
<body>
<h2>xath 24/7 Keeper &bull; <span class="badge">${joined ? 'ONLINE 24/7' : 'CONNECTING...'}</span></h2>
<p><b>Felhasználó:</b> ${botNick} (ID: ${myServerId}) | <b>Szoba:</b> ${roomName}</p>
<p><b>Proxy:</b> ${PROXY_URL || 'Direct connection'}</p>
<p><b>Csomagok (Ki / Be):</b> ${totalPacketsOut} / ${totalPacketsIn}</p>
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
