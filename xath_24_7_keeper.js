'use strict';

/**
 * xath.hu 24/7 Registered User Keeper & Bot Daemon
 * 
 * Target: https://xath.hu/
 * Built for 24/7 deployment on Render.com, VPS, or local server.
 * 
 * Features:
 * - Full Registered Account support (w_registered, w_userno, w_k1, w_k2, PassHash, DeviceId)
 * - Automatic Reconnect with exponential backoff & dup recovery
 * - Built-in HTTP health check & dashboard on process.env.PORT (Render requirement)
 * - Self-ping keepalive to prevent Render free-tier sleep
 * - Native WebAssembly protocol engine (xath_xatcorewasm)
 * - Never drops out, handles uncaught exceptions without crashing
 */

const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

// --- Configuration ---
const args = process.argv.slice(2);
function getArg(name, def = null) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const CONFIG_FILE = path.join(__dirname, 'account_config.json');
let fileConfig = {};
if (fs.existsSync(CONFIG_FILE)) {
    try {
        fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        console.log(`[CONFIG] Loaded settings from ${path.basename(CONFIG_FILE)}`);
    } catch (e) {
        console.error(`[CONFIG] Error reading ${CONFIG_FILE}:`, e.message);
    }
}

// Support raw localStorage 'todo' JSON string from environment or config
let rawTodo = process.env.XAT_TODO || fileConfig.todo || getArg('todo');
let parsedTodo = {};
if (rawTodo) {
    try {
        parsedTodo = typeof rawTodo === 'string' ? JSON.parse(rawTodo) : rawTodo;
        console.log(`[CONFIG] Loaded registered account credentials from 'todo' object.`);
    } catch (e) {
        console.error(`[CONFIG] Invalid XAT_TODO JSON:`, e.message);
    }
}

const EMAIL = process.env.EMAIL || process.env.XAT_EMAIL || fileConfig.email || getArg('email', '');
const PASSWORD = process.env.PASSWORD || process.env.XAT_PASSWORD || fileConfig.password || getArg('password', '');
const TARGET_ROOM = process.env.ROOM || fileConfig.room || getArg('room', 'xmradio');
const USER_ID = process.env.USER_ID || fileConfig.userId || parsedTodo.w_userno || getArg('id', 'auto');
const REGNAME = process.env.REGNAME || fileConfig.regname || parsedTodo.w_registered || getArg('regname', '');
const K1 = process.env.K1 || fileConfig.k1 || parsedTodo.w_k1 || getArg('k1', '');
const K2 = process.env.K2 || fileConfig.k2 || parsedTodo.w_k2 || getArg('k2', '');
const DEVICE_ID = process.env.DEVICE_ID || fileConfig.deviceId || parsedTodo.DeviceId || getArg('deviceid', '');
const PASS_HASH = process.env.PASS_HASH || fileConfig.passHash || parsedTodo.PassHash || getArg('passhash', '');
const BOT_NICK = process.env.NICK || fileConfig.nick || parsedTodo.w_name || getArg('nick', REGNAME || 'Szaby');
const BOT_AVATAR = process.env.AVATAR || fileConfig.avatar || parsedTodo.w_avatar || getArg('avatar', '100');
const PROXY_URL = process.env.PROXY || fileConfig.proxy || getArg('proxy', null);
const HTTP_PORT = parseInt(process.env.PORT || fileConfig.port || getArg('port', '10000'), 10);
const GREETING_MSG = process.env.GREETING || fileConfig.greeting || getArg('msg', 'Sziasztok!');
const AUTO_REPLY = process.env.AUTO_REPLY !== 'false' && !args.includes('--no-reply');
const SELF_PING_URL = process.env.RENDER_EXTERNAL_URL || fileConfig.selfPingUrl || null;

console.log('=======================================================');
console.log('  XATH.HU 24/7 REGISTERED KEEPER');
console.log(`  Target Room:    https://xath.hu/${TARGET_ROOM}`);
console.log(`  Account ID:     ${USER_ID}`);
console.log(`  Registered:     ${REGNAME ? REGNAME : '(Guest mode / Unspecified)'}`);
console.log(`  Display Nick:   ${BOT_NICK}`);
console.log(`  HTTP Port:      ${HTTP_PORT} (Render Web Service)`);
console.log(`  Proxy:          ${PROXY_URL || 'Direct connection'}`);
console.log('=======================================================');

// --- WASM Engine Setup ---
const WASM_JS_PATH = path.join(__dirname, 'xath_xatcorewasm.js');
const WASM_BIN_PATH = path.join(__dirname, 'xath_xatcorewasm.wasm');

if (!fs.existsSync(WASM_JS_PATH) || !fs.existsSync(WASM_BIN_PATH)) {
    console.error('[ERROR] WASM files missing! xath_xatcorewasm.js or .wasm not found in', __dirname);
    process.exit(1);
}

const wasmCode = fs.readFileSync(WASM_JS_PATH, 'utf8');
const wasmBinary = fs.readFileSync(WASM_BIN_PATH);

// Runtime State
let isConnected = false;
let activeWs = null;
let currentModule = null;
let tickTimer = null;
let pingTimer = null;
let reconnectAttempts = 0;
let lastConnectedTime = null;
let totalPacketsReceived = 0;
let totalPacketsSent = 0;
let startTime = Date.now();
let currentActiveId = 'connecting...';
let currentActiveRegname = REGNAME || '';
let hasUnstealthed = false;
const seenUsers = new Map();
const urlCache = {};

// --- HTTP Server for Render Healthcheck & Live Dashboard ---
const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: isConnected ? 'online' : 'reconnecting',
            uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
            room: TARGET_ROOM,
            bot: BOT_NICK,
            userId: currentActiveId,
            registeredName: currentActiveRegname,
            reconnects: reconnectAttempts
        }));
    }

    const uptimeHrs = ((Date.now() - startTime) / 3600000).toFixed(2);
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>xath 24/7 Keeper - ${BOT_NICK}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0d1117; color: #c9d1d9; margin: 0; padding: 24px; }
        .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; max-width: 650px; margin: 0 auto; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        h1 { color: #58a6ff; font-size: 20px; margin-top: 0; display: flex; align-items: center; gap: 8px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: bold; }
        .badge-online { background: #238636; color: #fff; }
        .badge-offline { background: #da3633; color: #fff; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td { padding: 10px 0; border-bottom: 1px solid #21262d; }
        td:first-child { color: #8b949e; width: 40%; }
        .footer { margin-top: 20px; font-size: 12px; color: #8b949e; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <h1>xath 24/7 Keeper Status</h1>
        <div>Status: <span class="badge ${isConnected ? 'badge-online' : 'badge-offline'}">${isConnected ? 'ONLINE 24/7' : 'RECONNECTING'}</span></div>
        <table>
            <tr><td>Target Room</td><td><a href="https://xath.hu/${TARGET_ROOM}" target="_blank" style="color:#58a6ff;">https://xath.hu/${TARGET_ROOM}</a></td></tr>
            <tr><td>Nickname</td><td><b>${BOT_NICK}</b></td></tr>
            <tr><td>Registered Name</td><td>${currentActiveRegname || '<i>None</i>'}</td></tr>
            <tr><td>User ID</td><td><code>${currentActiveId}</code></td></tr>
            <tr><td>Uptime</td><td>${uptimeHrs} hours</td></tr>
            <tr><td>Last Connected</td><td>${lastConnectedTime ? new Date(lastConnectedTime).toLocaleTimeString() : 'Connecting...'}</td></tr>
            <tr><td>Total Reconnects</td><td>${reconnectAttempts}</td></tr>
            <tr><td>Packets In / Out</td><td>${totalPacketsReceived} / ${totalPacketsSent}</td></tr>
        </table>
        <div class="footer">xath.hu 24/7 Daemon &bull; Antigravity Engine</div>
    </div>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

server.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`[HTTP] Render health check & web dashboard listening on port ${HTTP_PORT}`);
});

// Self-ping loop for Render free-tier (pings itself every 9 minutes to avoid sleep)
if (SELF_PING_URL) {
    console.log(`[KEEP-AWAKE] Registered self-ping targeting ${SELF_PING_URL} every 9 minutes.`);
    setInterval(() => {
        try {
            const proto = SELF_PING_URL.startsWith('https') ? https : http;
            proto.get(`${SELF_PING_URL}/health`, (res) => {
                res.on('data', () => {});
            }).on('error', () => {});
        } catch (_) {}
    }, 9 * 60 * 1000);
}

// --- Fetch Guest Credentials Fallback (if ID is auto) ---
async function fetchGuestCredentials(proxyUrl) {
    let agent = null;
    if (proxyUrl) {
        if (proxyUrl.startsWith('socks')) agent = new SocksProxyAgent(proxyUrl);
        else agent = new HttpsProxyAgent(proxyUrl);
    }
    return new Promise((resolve) => {
        const req = https.get('https://xath.hu/web_gear/chat/auser3.php', {
            agent,
            timeout: 7000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (res) => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => {
                const u = d.match(/UserId=(\d+)/);
                const k1 = d.match(/k1=([a-zA-Z0-9]+)/);
                const k2 = d.match(/k2=(\d+)/);
                if (u && k1 && k2) resolve({ id: u[1], k1: k1[1], k2: k2[1] });
                else resolve(null);
            });
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

// --- Direct Email/Password Login via xath register5.php ---
async function loginWithCredentials(emailOrUser, password, proxyUrl) {
    console.log(`[AUTH] Authenticating registered account (${emailOrUser}) via https://xath.hu/web_gear/chat/register5.php ...`);
    return new Promise((resolve) => {
        let agent = null;
        if (proxyUrl) {
            if (proxyUrl.startsWith('socks')) agent = new SocksProxyAgent(proxyUrl);
            else agent = new HttpsProxyAgent(proxyUrl);
        }

        const postData = new URLSearchParams({
            YourEmail: emailOrUser,
            NameEmail: emailOrUser,
            password: password,
            Login: '1'
        }).toString();

        const req = https.request('https://xath.hu/web_gear/chat/register5.php', {
            method: 'POST',
            agent,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'Origin': 'https://xath.hu',
                'Referer': 'https://xath.hu/login',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    if (data && data.Err && data.Err.todo) {
                        console.log(`[AUTH SUCCESS] Successfully authenticated as ${data.Err.todo.w_registered} (ID: ${data.Err.todo.w_userno})!`);
                        resolve(data.Err.todo);
                    } else if (data && data.Err && data.Err.login) {
                        console.error(`[AUTH ERROR] Server login message: ${data.Err.login}`);
                        resolve(null);
                    } else {
                        console.error(`[AUTH UNEXPECTED RESPONSE]`, body);
                        resolve(null);
                    }
                } catch (e) {
                    console.error(`[AUTH PARSE ERROR]`, e.message);
                    resolve(null);
                }
            });
        });

        req.on('error', (err) => {
            console.error(`[AUTH HTTP ERROR]`, err.message);
            resolve(null);
        });
        req.on('timeout', () => {
            req.destroy();
            resolve(null);
        });

        req.write(postData);
        req.end();
    });
}

// --- Main Connection Controller ---
async function startKeeper() {
    let activeId = USER_ID;
    let activeK1 = K1;
    let activeK2 = K2;
    let activeRegname = REGNAME;
    let activeDeviceId = DEVICE_ID;
    let activePassHash = PASS_HASH;
    let activeNick = BOT_NICK;
    let activeAvatar = BOT_AVATAR;

    // 1. Try direct Email & Password login if supplied
    if (EMAIL && PASSWORD && (!activeK1 || activeId === 'auto')) {
        const loginTodo = await loginWithCredentials(EMAIL, PASSWORD, PROXY_URL);
        if (loginTodo) {
            activeId = String(loginTodo.w_userno);
            activeK1 = loginTodo.w_k1;
            activeK2 = loginTodo.w_k2;
            activeRegname = loginTodo.w_registered || EMAIL;
            activeDeviceId = loginTodo.DeviceId || '';
            activePassHash = loginTodo.PassHash || '';
            activeNick = loginTodo.w_name || activeRegname || activeNick;
            activeAvatar = loginTodo.w_avatar || activeAvatar;
            parsedTodo = loginTodo;
        } else {
            console.warn('[AUTH WARNING] Email login did not return session. Checking fallback credentials...');
        }
    }

    // 2. Fetch fresh session keys (k1, k2) or guest credentials
    if (!activeK1 || !activeId || activeId === 'auto') {
        const creds = await fetchGuestCredentials(PROXY_URL);
        if (!creds) {
            console.error('[AUTH FAIL] Unable to fetch session credentials. Retrying in 5 seconds...');
            return cleanupAndReconnect(5000);
        }
        if (!activeId || activeId === 'auto') {
            activeId = creds.id;
        }
        activeK1 = creds.k1;
        activeK2 = creds.k2;
        currentActiveId = activeId;
        currentActiveRegname = activeRegname;
        console.log(`[AUTH] Session keys established. User ID: ${activeId} (${activeRegname || 'Guest'})`);
    } else {
        currentActiveId = activeId;
        currentActiveRegname = activeRegname;
    }

    // Build the exact 'todo' storage structure matching browser
    const todoObject = {
        w_userno: activeId,
        w_k1: activeK1,
        w_k2: activeK2,
        w_name: activeNick,
        w_avatar: activeAvatar,
        w_homepage: parsedTodo.w_homepage || '',
        w_sound: parsedTodo.w_sound || '',
        w_powers: parsedTodo.w_powers || '',
        w_userpowers: parsedTodo.w_userpowers || '',
        w_registered: activeRegname,
        DeviceId: activeDeviceId,
        PassHash: activePassHash,
        MobNo: ''
    };

    const storage = {
        'todo': JSON.stringify(todoObject),
        'Macros': JSON.stringify({ Stealth: 'disable' }),
        'Settings': JSON.stringify({ Stealth: 'disable' }),
        'w_Powers': '{}'
    };

    global.localStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => { storage[k] = String(v); },
        removeItem: (k) => { delete storage[k]; }
    };

    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    global.window = {
        location: { host: 'xath.hu', hostname: 'xath.hu', href: `https://xath.hu/${TARGET_ROOM}`, search: '' },
        navigator: { userAgent: USER_AGENT, userLanguage: 'hu', language: 'hu' }
    };
    global.location = global.window.location;

    // Instantiate fresh Module
    const Module = { wasmBinary };
    currentModule = Module;

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

    function handleJson(raw) {
        if (!raw) return;
        try {
            const obj = JSON.parse(raw);
            const type = parseInt(obj.Type, 10);
            const cmd = obj.Cmd || '';
            const data = obj.Data || '';

            // Type 1: HTTP API Fetch
            if (type === 1) {
                const targetUrl = cmd.replace('https://xat.com', 'https://xath.hu');
                if (urlCache[targetUrl]) {
                    SendC('xatURL', cmd, urlCache[targetUrl]);
                    return;
                }
                https.get(targetUrl, {
                    headers: { 'User-Agent': USER_AGENT, 'Origin': 'https://xath.hu', 'Referer': `https://xath.hu/${TARGET_ROOM}` }
                }, (res) => {
                    let body = '';
                    res.on('data', c => body += c);
                    res.on('end', () => {
                        urlCache[cmd] = body;
                        SendC('xatURL', cmd, body);
                    });
                }).on('error', () => {});
            }
            // Type 4: Establish WebSocket
            else if (type === 4) {
                if (activeWs) {
                    try { activeWs.terminate(); } catch (_) {}
                }

                const wsOptions = {
                    headers: { 'Origin': 'https://xath.hu', 'User-Agent': USER_AGENT },
                    handshakeTimeout: 8000
                };
                if (PROXY_URL) {
                    if (PROXY_URL.startsWith('socks')) wsOptions.agent = new SocksProxyAgent(PROXY_URL);
                    else wsOptions.agent = new HttpsProxyAgent(PROXY_URL);
                }

                activeWs = new WebSocket('wss://wss.xath.hu:443/v2', wsOptions);

                activeWs.on('open', () => {
                    isConnected = true;
                    lastConnectedTime = Date.now();
                    reconnectAttempts = 0;
                    console.log(`[ONLINE] Connected to wss://wss.xath.hu:443/v2 for room: ${TARGET_ROOM}`);
                    SendC('xatMessageReceived', '#CONNECT_OK', '');
                    SendC('xatMessageOK', '#CONNECT_CHECK', Buffer.from('xat.com').toString('base64'));
                });

                activeWs.on('message', (eventData) => {
                    totalPacketsReceived++;
                    const buf = Buffer.from(eventData);
                    const str = buf.toString('utf8');

                    // Detect disconnect / duplicate kick
                    if (str.includes('<logout')) {
                        console.warn(`[KICK/LOGOUT] Server returned logout: ${str.replace(/\0/g, ' ')}`);
                        if (str.includes('e="dup"')) {
                            console.warn('[NOTICE] Account logged in from another location (dup). Waiting 10s to reclaim session...');
                            cleanupAndReconnect(10000);
                            return;
                        } else if (str.includes('e="E43"')) {
                            console.warn('[NOTICE] Session key expired (E43). Re-fetching fresh session credentials...');
                            cleanupAndReconnect(3000);
                            return;
                        }
                    }

                    // Welcome message / joined
                    if ((str.includes('<done') || str.includes('<i ')) && !hasUnstealthed) {
                        hasUnstealthed = true;
                        // Explicitly disable invisible power so the bot is visible in the room
                        activeWs.send(Buffer.from('<m t="/u" u="0" />\0'));
                        console.log('[VISIBILITY] Disabled invisible mode (/u sent). User is now visible in the room.');

                        if (GREETING_MSG) {
                            setTimeout(() => {
                                sendRoomMessage(GREETING_MSG);
                            }, 1200);
                        }
                    }

                    // Auto-reply to Private Chats (PMs)
                    if (AUTO_REPLY && (str.includes('<p ') || str.includes('<z '))) {
                        handleIncomingPrivateMessage(str, activeId);
                    }

                    SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
                });

                activeWs.on('close', (code, reason) => {
                    console.warn(`[WS CLOSED] Connection dropped (code: ${code}, reason: ${reason || 'none'}). Reconnecting...`);
                    cleanupAndReconnect(3000);
                });

                activeWs.on('error', (err) => {
                    console.error('[WS ERROR]:', err.message);
                    cleanupAndReconnect(4000);
                });
            }
            // Type 2: Outbound protocol packet from WASM
            else if (type === 2) {
                let pkt = data;
                if (pkt.startsWith('<j2 ')) {
                    if (REGNAME) {
                        pkt = pkt.replace(/n="[^"]*"/, `n="${REGNAME}## "`);
                    }
                    if (BOT_AVATAR) {
                        pkt = pkt.replace(/a="[^"]*"/, `a="${BOT_AVATAR}"`);
                    }
                    // Strip invisible flag (bit 6 = 64) from auth packet
                    pkt = pkt.replace(/f="(\d+)"/, (m, fVal) => `f="${parseInt(fVal, 10) & ~64}"`);
                    console.log(`[AUTH J2]: User ${activeId} (${REGNAME || BOT_NICK}) authenticating...`);
                }
                if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                    totalPacketsSent++;
                    activeWs.send(Buffer.from(pkt));
                }
            }
        } catch (e) {
            console.error('[HANDLE_JSON ERR]:', e.message);
        }
    }

    function sendRoomMessage(text) {
        if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;
        const msgOpts = Buffer.from(JSON.stringify({
            isTranslated: "",
            msgId: Math.random().toString(36).substr(2, 9),
            type: "msg"
        })).toString('base64');
        const pkt = `<m t="${text.replace(/"/g, '&quot;')}" o="${msgOpts}" u="${activeId}" />\0`;
        activeWs.send(Buffer.from(pkt));
        totalPacketsSent++;
        console.log(`[MSG SENT] [${BOT_NICK}]: "${text}"`);
    }

    function handleIncomingPrivateMessage(rawPkt, myId) {
        const uMatch = rawPkt.match(/u="([^"_]+)/);
        const tMatch = rawPkt.match(/t="([^"]+)"/);
        if (!uMatch || !tMatch) return;
        const senderId = uMatch[1];
        const text = tMatch[1];
        if (senderId === myId || senderId === '0' || text.startsWith('/')) return;

        console.log(`[PM RECEIVED] From ${senderId}: "${text}"`);
        const replies = [
            "Szia! Koszi hogy irtal, jo zenehallgatast! :)",
            "Szia! Kellemes estet, jo pihenest nalunk! :D",
            "Halika! Nagyon adja az adas! ;)",
            "Pacsi! Jo szorakozast kivanok!"
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        setTimeout(() => {
            if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                const optB64 = Buffer.from(JSON.stringify({ isTranslated: "", msgId: Math.random().toString(36).substr(2, 9), type: "msg" })).toString('base64');
                activeWs.send(Buffer.from(`<z d="${senderId}" t="/l" />\0`));
                activeWs.send(Buffer.from(`<z d="${senderId}" u="${myId}_0" t="${reply}" o="${optB64}" s="2" />\0`));
                activeWs.send(Buffer.from(`<p u="${senderId}" t="${reply}" />\0`));
                totalPacketsSent += 3;
                console.log(`[PM AUTO-REPLY] To ${senderId}: "${reply}"`);
            }
        }, 1500);
    }

    // WASM Lifecycle Bootstrap
    Module.onRuntimeInitialized = () => {
        SendC('sendStuff', JSON.stringify({ Flags: 6, origin: 'https://xath.hu' }), '');
        SendC('xatInit', '', '');
        SendC('SetPage', '', 'classic');
        SendC('xatMain', '', '');
        SendC('leaveBackground', '', TARGET_ROOM);
        SendC('ConsoleOff', '', '');
        SendC('SetPhoneFontSize', '', '1.0');
        SendC('setLang', '', 'hu');
        SendC('xatCommand', '', JSON.stringify({ Command: 'EnableTick' }));

        // Tick loop (every 60ms)
        tickTimer = setInterval(() => {
            try {
                let res = SendC('xatTick', '', '');
                while (res) {
                    handleJson(res);
                    res = SendC('ReadToJavaFifo', '', '');
                }
            } catch (e) {
                console.error('[TICK ERR]:', e.message);
            }
        }, 60);

        // Keepalive Ping (every 25 seconds)
        pingTimer = setInterval(() => {
            if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                try { activeWs.ping(); } catch (_) {}
                activeWs.send(Buffer.from('<c u="1" t="/KEEPALIVE" />\0'));
                totalPacketsSent++;
            }
        }, 25000);
    };

    // Run WASM engine
    try {
        new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
    } catch (e) {
        console.error('[WASM EXEC ERR]:', e);
        cleanupAndReconnect(5000);
    }
}

// --- Clean Reconnection Logic ---
let isReconnecting = false;
function cleanupAndReconnect(delayMs = 3000) {
    if (isReconnecting) return;
    isReconnecting = true;
    isConnected = false;
    hasUnstealthed = false;
    reconnectAttempts++;

    console.log(`[RECONNECT] Resetting session. Reconnecting in ${(delayMs / 1000).toFixed(1)}s (Attempt #${reconnectAttempts})...`);

    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
    if (activeWs) {
        try { activeWs.terminate(); } catch (_) {}
        activeWs = null;
    }

    setTimeout(() => {
        isReconnecting = false;
        startKeeper().catch(err => {
            console.error('[RECOVERY FAIL]:', err.message);
            cleanupAndReconnect(Math.min(delayMs * 1.5, 30000));
        });
    }, delayMs);
}

// Global crash protection
process.on('uncaughtException', (err) => {
    console.error('[UNCAUGHT EXCEPTION]:', err);
    cleanupAndReconnect(5000);
});

process.on('unhandledRejection', (reason) => {
    console.error('[UNHANDLED REJECTION]:', reason);
});

// Start the daemon
startKeeper();
