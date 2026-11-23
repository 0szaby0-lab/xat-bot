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
let USER_ID = process.env.USER_ID || fileConfig.userId || parsedTodo.w_userno || getArg('id', 'auto');
let REGNAME = process.env.REGNAME || fileConfig.regname || parsedTodo.w_registered || getArg('regname', '');
let K1 = process.env.K1 || fileConfig.k1 || parsedTodo.w_k1 || getArg('k1', '');
let K2 = process.env.K2 || fileConfig.k2 || parsedTodo.w_k2 || getArg('k2', '');
let DEVICE_ID = process.env.DEVICE_ID || fileConfig.deviceId || parsedTodo.DeviceId || getArg('deviceid', '');
let PASS_HASH = process.env.PASS_HASH || fileConfig.passHash || parsedTodo.PassHash || getArg('passhash', '');
let BOT_NICK = process.env.NICK || fileConfig.nick || parsedTodo.w_name || getArg('nick', REGNAME || 'Szaby');
let BOT_AVATAR = process.env.AVATAR || fileConfig.avatar || parsedTodo.w_avatar || getArg('avatar', '100');
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

// --- Activity Logs & Global Message / Command Dispatchers ---
const recentLogs = [];
function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    recentLogs.push(`[${time}] ${msg}`);
    if (recentLogs.length > 40) recentLogs.shift();
    console.log(msg);
}

function sendPacket(pkt) {
    if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return false;
    let dataToSend = pkt;
    if (typeof dataToSend === 'string') {
        if (!dataToSend.endsWith('\0')) dataToSend += '\0';
        activeWs.send(Buffer.from(dataToSend, 'utf8'));
    } else {
        if (dataToSend[dataToSend.length - 1] !== 0) {
            dataToSend = Buffer.concat([dataToSend, Buffer.from([0])]);
        }
        activeWs.send(dataToSend);
    }
    totalPacketsSent++;
    return true;
}

function sendRoomMessage(text) {
    if (!activeWs || activeWs.readyState !== WebSocket.OPEN) {
        addLog(`[KÜLDÉS SIKERTELEN] WebSocket nincs nyitva (állapot: ${activeWs ? activeWs.readyState : 'null'})`);
        return false;
    }
    // 1. Send via WASM engine (native client behavior)
    if (currentModule) {
        try {
            SendC('xatCommand', '', JSON.stringify({
                Type: 'Send',
                Command: 'Send',
                Page: 'messages',
                Message: text,
                msgId: Math.random().toString(36).substr(2, 9)
            }));
        } catch (_) {}
    }
    // 2. Plain message packet (accepted by classic xat clients and servers)
    sendPacket(`<m t="${text.replace(/"/g, '&quot;')}" u="${currentActiveId}" />`);

    // 3. Full options packet (accepted by new web/mobile clients)
    const msgOpts = Buffer.from(JSON.stringify({
        isTranslated: "",
        msgId: Math.random().toString(36).substr(2, 9),
        type: "msg"
    })).toString('base64');
    sendPacket(`<m t="${text.replace(/"/g, '&quot;')}" o="${msgOpts}" u="${currentActiveId}" />`);

    addLog(`[ÜZENET KIKÜLDVE] [${BOT_NICK}]: "${text}"`);
    return true;
}

function sendRawCommand(cmd) {
    if (!activeWs || activeWs.readyState !== WebSocket.OPEN) {
        addLog(`[PARANCS SIKERTELEN] WebSocket nincs nyitva`);
        return false;
    }
    if (currentModule) {
        try {
            SendC('xatCommand', '', JSON.stringify({
                Type: 'Send',
                Command: 'Send',
                Page: 'messages',
                Message: cmd,
                msgId: Math.random().toString(36).substr(2, 9)
            }));
        } catch (_) {}
    }
    // 1. Send pure command packet
    sendPacket(`<m t="${cmd.replace(/"/g, '&quot;')}" u="${currentActiveId}" />`);

    // 2. Also send wrapped message packet for full client compatibility
    const msgOpts = Buffer.from(JSON.stringify({
        isTranslated: "",
        msgId: Math.random().toString(36).substr(2, 9),
        type: "msg"
    })).toString('base64');
    sendPacket(`<m t="${cmd.replace(/"/g, '&quot;')}" o="${msgOpts}" u="${currentActiveId}" />`);

    addLog(`[PARANCS KIKÜLDVE]: "${cmd}"`);
    return true;
}

function disableInvisibleMode() {
    addLog(`[LÁTHATÓSÁG] Invisible power kikapcsolása folyamatban (/-invisible, /u, /-stealth)...`);
    sendRawCommand('/-invisible');
    setTimeout(() => {
        sendRawCommand('/u');
    }, 800);
    setTimeout(() => {
        sendRawCommand('/-stealth');
    }, 1600);
    return true;
}

// --- HTTP Server for Render Healthcheck, Live Dashboard & Remote Control ---
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    if (pathname === '/health' || pathname === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: isConnected ? 'online' : 'reconnecting',
            uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
            room: TARGET_ROOM,
            bot: BOT_NICK,
            userId: currentActiveId,
            registeredName: currentActiveRegname,
            hasK1: !!K1,
            k1Len: K1 ? K1.length : 0,
            reconnects: reconnectAttempts
        }));
    }

    if (pathname === '/api/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ logs: recentLogs }));
    }

    if (pathname === '/api/disable-invisible') {
        disableInvisibleMode();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, message: 'Invisible power kikapcsolási parancs (/-invisible) és szoba üzenet elküldve!' }));
    }

    if (pathname === '/api/reconnect') {
        addLog('[TÁVVEZÉRLÉS] Manuális újracsatlakozás kérés érkezett.');
        cleanupAndReconnect(1000);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, message: 'Újracsatlakozás elindítva!' }));
    }

    if (pathname === '/api/send') {
        const msg = parsedUrl.searchParams.get('msg');
        if (msg) {
            if (msg.startsWith('/')) {
                sendRawCommand(msg);
            } else {
                sendRoomMessage(msg);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, sent: msg }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Hiányzó msg paraméter' }));
        }
    }

    if (pathname === '/api/set-todo') {
        let postBody = '';
        req.on('data', chunk => postBody += chunk);
        req.on('end', () => {
            let dataStr = parsedUrl.searchParams.get('data') || postBody;
            try {
                if (postBody && (postBody.trim().startsWith('{') || postBody.trim().startsWith('"'))) {
                    const parsed = JSON.parse(postBody);
                    if (parsed.data) dataStr = parsed.data;
                }
            } catch (_) {}

            if (!dataStr) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Hiányzó todo beviteli adat!' }));
            }

            try {
                let parsedObj = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
                if (parsedObj.todo) parsedObj = parsedObj.todo;

                if (parsedObj.w_userno) USER_ID = String(parsedObj.w_userno);
                if (parsedObj.w_k1) K1 = String(parsedObj.w_k1);
                if (parsedObj.w_k2) K2 = String(parsedObj.w_k2);
                if (parsedObj.w_registered) REGNAME = String(parsedObj.w_registered);
                if (parsedObj.DeviceId) DEVICE_ID = String(parsedObj.DeviceId);
                if (parsedObj.PassHash) PASS_HASH = String(parsedObj.PassHash);
                if (parsedObj.w_name) BOT_NICK = String(parsedObj.w_name);
                if (parsedObj.w_avatar) BOT_AVATAR = String(parsedObj.w_avatar);

                parsedTodo = parsedObj;

                fileConfig.todo = parsedObj;
                fileConfig.userId = USER_ID;
                fileConfig.k1 = K1;
                fileConfig.k2 = K2;
                fileConfig.regname = REGNAME;
                fileConfig.deviceId = DEVICE_ID;
                fileConfig.passHash = PASS_HASH;
                fileConfig.nick = BOT_NICK;
                fileConfig.avatar = BOT_AVATAR;

                try {
                    fs.writeFileSync(CONFIG_FILE, JSON.stringify(fileConfig, null, 2), 'utf8');
                } catch (fsErr) {
                    console.error('[CONFIG SAVE ERR]:', fsErr.message);
                }

                currentActiveId = USER_ID;
                currentActiveRegname = REGNAME;

                addLog(`[FIÓK MENTVE] Sikeres fiókfrissítés! Regisztrált felhasználó: ${REGNAME || 'Szaby'} (ID: ${USER_ID})`);
                cleanupAndReconnect(500);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    message: `Sikeres beállítás! Csatlakozás a regisztrált fiókkal (${REGNAME || 'Szaby'}, ID: ${USER_ID})...`
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Hiba a JSON feldolgozásakor: ' + err.message }));
            }
        });
        return;
    }

    const uptimeHrs = ((Date.now() - startTime) / 3600000).toFixed(2);
    const html = `<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <title>xath 24/7 Vezérlőpult - ${BOT_NICK}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0d1117; color: #c9d1d9; margin: 0; padding: 16px; }
        .card { background: #161b22; border: 1px solid #30363d; border-radius: 10px; max-width: 680px; margin: 0 auto; padding: 20px; box-shadow: 0 6px 20px rgba(0,0,0,0.6); }
        h1 { color: #58a6ff; font-size: 22px; margin-top: 0; display: flex; align-items: center; justify-content: space-between; }
        h2 { font-size: 16px; color: #f0f6fc; margin: 20px 0 10px 0; border-bottom: 1px solid #21262d; padding-bottom: 6px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: bold; }
        .badge-online { background: #238636; color: #fff; }
        .badge-offline { background: #da3633; color: #fff; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
        td { padding: 8px 0; border-bottom: 1px solid #21262d; }
        td:first-child { color: #8b949e; width: 40%; }
        .btn-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        button, .btn { font-size: 13px; font-weight: 600; padding: 10px 14px; border-radius: 6px; border: 1px solid transparent; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-danger { background: #da3633; color: #fff; border-color: #f85149; }
        .btn-danger:hover { background: #b62324; }
        .btn-primary { background: #1f6feb; color: #fff; border-color: #388bfd; }
        .btn-primary:hover { background: #388bfd; }
        .btn-success { background: #238636; color: #fff; border-color: #2ea043; }
        .btn-success:hover { background: #2ea043; }
        .btn-secondary { background: #21262d; color: #c9d1d9; border-color: #30363d; }
        .btn-secondary:hover { background: #30363d; }
        .input-row { display: flex; gap: 8px; }
        input[type="text"] { flex: 1; padding: 10px 12px; border-radius: 6px; border: 1px solid #30363d; background: #0d1117; color: #fff; font-size: 14px; outline: none; }
        input[type="text"]:focus { border-color: #58a6ff; }
        #toast { min-height: 22px; margin-top: 10px; font-size: 13px; font-weight: 600; color: #58a6ff; }
        #logBox { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 10px; height: 170px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.45; color: #8b949e; white-space: pre-wrap; word-break: break-all; }
        .footer { margin-top: 20px; font-size: 12px; color: #8b949e; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <h1>
            <span>xath 24/7 Vezérlőpult</span>
            <span class="badge ${isConnected ? 'badge-online' : 'badge-offline'}">${isConnected ? 'ONLINE 24/7' : 'ÚJRACSATLAKOZÁS'}</span>
        </h1>

        <table>
            <tr><td>Célszoba</td><td><a href="https://xath.hu/${TARGET_ROOM}" target="_blank" style="color:#58a6ff; text-decoration:none;"><b>${TARGET_ROOM}</b> (https://xath.hu/${TARGET_ROOM})</a></td></tr>
            <tr><td>Bot Becenév</td><td><b>${BOT_NICK}</b></td></tr>
            <tr><td>Regisztrált Név</td><td><b>${currentActiveRegname || '<i>Nincs</i>'}</b></td></tr>
            <tr><td>Felhasználói ID</td><td><code>${currentActiveId}</code></td></tr>
            <tr><td>Futási idő (Uptime)</td><td>${uptimeHrs} óra</td></tr>
            <tr><td>Csomagok (Ki / Be)</td><td>${totalPacketsSent} / ${totalPacketsReceived}</td></tr>
        </table>

        <h2>🎮 Power & Láthatóság Távvezérlés</h2>
        <div class="btn-grid">
            <button class="btn btn-danger" onclick="triggerAction('/api/disable-invisible', 'Invisible power kikapcsolva!')">🔴 Invisible Kikapcsolása (/-invisible)</button>
            <button class="btn btn-primary" onclick="triggerAction('/api/send?msg=%2Fu', '/u parancs elküldve!')">👁️ Láthatóság (/u)</button>
            <button class="btn btn-success" onclick="triggerAction('/api/send?msg=Sziasztok!%20%3A%29', 'Üdvözlés elküldve!')">💬 Üdvözlés küldése</button>
            <button class="btn btn-secondary" onclick="triggerAction('/api/reconnect', 'Újracsatlakozás folyamatban...')">🔄 Újracsatlakozás</button>
        </div>

        <form onsubmit="sendCustomMsg(event)" class="input-row">
            <input type="text" id="customMsg" placeholder="Írj be parancsot (pl. /-invisible vagy szöveget)..." autocomplete="off">
            <button type="submit" class="btn btn-primary">Küldés</button>
        </form>
        <div id="toast"></div>

        <h2>🔑 Valódi Regisztrált Fiók Bekötése (todo JSON)</h2>
        <p style="font-size:13px; color:#8b949e; margin-bottom:8px;">Ha a szobában a bot csak sima tagként jelenik meg, illeszd be ide a böngésződből a <code>localStorage.getItem('todo')</code> adataidat, hogy a VALÓDI regisztrált rangoddal lépjen be:</p>
        <textarea id="todoInput" rows="3" style="width:100%; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:6px; padding:8px; font-family:monospace; font-size:12px; outline:none;" placeholder='{"w_userno":"1999928669","w_registered":"Szaby","w_k1":"...","w_k2":"...","PassHash":"..."}'></textarea>
        <div style="margin-top:8px; margin-bottom:14px; display:flex; gap:8px;">
            <button type="button" class="btn btn-success" onclick="saveTodoData()">💾 Fiók Mentése & Csatlakozás</button>
        </div>

        <h2>📜 Élő Esemény & Chat Napló</h2>
        <div id="logBox">Napló betöltése...</div>

        <div class="footer">xath.hu 24/7 Daemon &bull; Render Cloud &bull; RITMADA</div>
    </div>

    <script>
        function triggerAction(url, msg) {
            const toast = document.getElementById('toast');
            toast.innerText = 'Küldés folyamatban...';
            fetch(url)
                .then(r => r.json())
                .then(d => {
                    toast.innerText = '✅ ' + (msg || d.message || 'Sikeres parancsvégrehajtás!');
                    refreshLogs();
                    setTimeout(() => { toast.innerText = ''; }, 4500);
                })
                .catch(e => {
                    toast.innerText = '❌ Hiba: ' + e.message;
                });
        }

        function sendCustomMsg(e) {
            e.preventDefault();
            const inp = document.getElementById('customMsg');
            const val = inp.value.trim();
            if (!val) return;
            triggerAction('/api/send?msg=' + encodeURIComponent(val), 'Elküldve: ' + val);
            inp.value = '';
        }

        function saveTodoData() {
            const val = document.getElementById('todoInput').value.trim();
            if (!val) return alert('Kérlek illeszd be a todo JSON adatot!');
            const toast = document.getElementById('toast');
            toast.innerText = 'Mentés és bejelentkezés folyamatban...';
            fetch('/api/set-todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: val })
            })
            .then(r => r.json())
            .then(d => {
                toast.innerText = d.success ? '✅ ' + d.message : '❌ ' + d.error;
                setTimeout(() => location.reload(), 2500);
            })
            .catch(e => {
                toast.innerText = '❌ Hiba: ' + e.message;
            });
        }

        function refreshLogs() {
            fetch('/api/logs').then(r => r.json()).then(d => {
                const box = document.getElementById('logBox');
                if (box && d.logs && d.logs.length) {
                    box.innerText = d.logs.join('\\n');
                    box.scrollTop = box.scrollHeight;
                }
            }).catch(() => {});
        }
        setInterval(refreshLogs, 2500);
        refreshLogs();
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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

    let isGuestFallback = false;
    // 2. Fetch fresh session keys (k1, k2) or guest credentials
    if (!activeK1 || !activeId || activeId === 'auto') {
        isGuestFallback = true;
        const creds = await fetchGuestCredentials(PROXY_URL);
        if (!creds) {
            console.error('[AUTH FAIL] Unable to fetch session credentials. Retrying in 5 seconds...');
            return cleanupAndReconnect(5000);
        }
        activeId = creds.id;
        activeK1 = creds.k1;
        activeK2 = creds.k2;
        currentActiveId = activeId;
        currentActiveRegname = activeRegname;
        console.log(`[AUTH] Session keys established. Active Connection ID: ${activeId} (${activeRegname || 'Bot'})`);
    } else {
        currentActiveId = activeId;
        currentActiveRegname = activeRegname;
    }

    // Build the exact 'todo' storage structure matching browser
    const todoObject = {
        ...parsedTodo,
        w_userno: activeId,
        w_k1: activeK1,
        w_k2: activeK2,
        w_name: activeNick,
        w_avatar: activeAvatar,
        w_registered: activeRegname,
        DeviceId: activeDeviceId,
        PassHash: activePassHash,
        w_cb: (parsedTodo && parsedTodo.w_cb) ? parsedTodo.w_cb : '0',
        MobNo: ''
    };

    const powersStr = "2147483647|2147483647|4294836223|4294967295|2147483647|2147483647|2147483647|2147483647|2147483647|2147483647|2147483647|2147483647|2147483647|2147483647|2080374783|2112880639|1608499199|1069547519|2130702079|2147483647|1802502011|796917759|2130706431|2097146|0";
    const powersObj = {};
    powersStr.split("|").forEach((p, i) => { powersObj[i] = parseInt(p, 10); });

    const storage = {
        'todo': JSON.stringify(todoObject),
        'Macros': JSON.stringify({ Stealth: 'disable' }),
        'Settings': JSON.stringify({ Stealth: 'disable' }),
        'w_Mask': JSON.stringify({ "0": 16777216 }),
        'w_Powers': JSON.stringify(powersObj)
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
                        addLog(`[KILÉPTETÉS / HIBA]: ${str.replace(/\0/g, ' ')}`);
                        if (str.includes('e="dup"')) {
                            addLog('[ÉRTESÍTÉS] Fiók megnyitva másik böngészőben (dup)! Várakozás 10 másodpercig...');
                            cleanupAndReconnect(10000);
                            return;
                        } else if (str.includes('e="E43"')) {
                            addLog('[ÉRTESÍTÉS] Lejárt munkamenet kulcs (E43). Újracsatlakozás...');
                            cleanupAndReconnect(3000);
                            return;
                        }
                    } else if (str.includes('<y ') || str.includes('<done') || str.includes('<i ')) {
                        addLog(`[SZERVER CSOMAG]: ${str.replace(/\0/g, ' ').slice(0, 80)}`);
                    }

                    // Welcome message / joined room
                    if (str.includes('<done') && !hasUnstealthed) {
                        hasUnstealthed = true;
                        addLog(`[SZOBÁBAN] Sikeresen csatlakozva a szobához (${TARGET_ROOM})!`);
                        setTimeout(() => {
                            disableInvisibleMode();
                        }, 2000);

                        if (GREETING_MSG) {
                            setTimeout(() => {
                                sendRoomMessage(GREETING_MSG);
                            }, 4500);
                        }
                    }

                    // Track room visitors
                    if (str.includes('<u ')) {
                        const uMatches = str.match(/<u [^>]+>/g) || [];
                        for (const uPkt of uMatches) {
                            const idMatch = uPkt.match(/\bu="(\d+)"/);
                            const nMatch = uPkt.match(/\bn="([^"]+)"/);
                            if (idMatch && nMatch) {
                                seenUsers.set(idMatch[1], nMatch[1]);
                                addLog(`[SZOBATAG]: ${nMatch[1]} (ID: ${idMatch[1]})`);
                            }
                        }
                    }

                    // Log incoming room chat
                    if (str.includes('<m ')) {
                        const tMatch = str.match(/t="([^"]+)"/);
                        const uMatch = str.match(/u="([^"_]+)/);
                        if (tMatch && tMatch[1] && !tMatch[1].startsWith('/')) {
                            addLog(`[SZOBACSAT]: ${uMatch ? uMatch[1] : 'tag'}: ${tMatch[1]}`);
                        }
                    }

                    // Auto-reply to Private Chats (PMs)
                    if (AUTO_REPLY && (str.includes('<p ') || str.includes('<z '))) {
                        handleIncomingPrivateMessage(str, activeId);
                    }

                    SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
                });

                activeWs.on('close', (code, reason) => {
                    addLog(`[WS LEZÁRULT] Kód: ${code}, Ok: ${reason || 'nincs'}. Újracsatlakozás 3s múlva...`);
                    cleanupAndReconnect(3000);
                });

                activeWs.on('error', (err) => {
                    addLog(`[WS HIBA]: ${err.message}`);
                    cleanupAndReconnect(4000);
                });
            }
            // Type 2: Outbound protocol packet from WASM
            else if (type === 2) {
                let pkt = data;
                if (pkt.startsWith('<y ')) {
                    pkt = pkt.replace(/u="[^"]*"/, `u="${activeId}"`);
                } else if (pkt.startsWith('<j2 ')) {
                    if (isGuestFallback) {
                        pkt = pkt.replace(/u="[^"]*"/, `u="${activeId}"`);
                        if (activeK1) {
                            pkt = pkt.replace(/k="[^"]*"/, `k="${activeK1}"`);
                        }
                        const cleanNick = (BOT_NICK || 'Szaby').replace(/##/g, '').trim();
                        pkt = pkt.replace(/n="[^"]*"/, `n="${cleanNick}"`);
                        pkt = pkt.replace(/f="(\d+)"/, (m, fVal) => `f="${(parseInt(fVal, 10) & ~65)}"`);
                    }
                    addLog(`[AUTH J2 KÜLDVE]: ${pkt.replace(/\0/g, ' ')}`);
                }
                sendPacket(pkt);
            }
        } catch (e) {
            console.error('[HANDLE_JSON ERR]:', e.message);
        }
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
