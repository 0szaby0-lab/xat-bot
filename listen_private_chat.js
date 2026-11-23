'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const WebSocket = require('ws');

const botNick = 'Bence_PRO';
const botAvatar = '100';
const credId = '4215167226';
const credK1 = '5804wa85n3759a7f2017';
const credK2 = '405892028';

let urlCache = {};
try {
    urlCache = JSON.parse(fs.readFileSync(path.join(__dirname, 'xath_url_cache.json'), 'utf8'));
} catch (_) {}

const store = {
    'mobCookies': '1',
    'todo': JSON.stringify({ w_userno: credId, w_k1: credK1, w_k2: credK2, w_name: botNick, w_avatar: botAvatar }),
    'Settings': JSON.stringify({ name: botNick, avatar: botAvatar })
};

global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

global.window = {
    location: { host: 'xath.hu', hostname: 'xath.hu', href: 'https://xath.hu/xmradio', search: '' },
    navigator: { userAgent: 'Mozilla/5.0', userLanguage: 'hu', language: 'hu' }
};
global.location = global.window.location;

const wasmCode = fs.readFileSync(path.join(__dirname, 'xath_xatcorewasm.js'), 'utf8');
const wasmBinary = fs.readFileSync(path.join(__dirname, 'xath_xatcorewasm.wasm'));
const Module = { wasmBinary };

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
    if (resPtr) { ret = readUtf8(resPtr); if (Module._xFree) Module._xFree(resPtr); }
    return ret;
}

let activeWs = null;
let myServerId = null;

const REPLIES = [
    "Szia! Koszi szepen! :)",
    "Szia! Kellemes estet, jo pihenest!",
    "Nagyon adja a zene nalad is? :)",
    "Koszi szepen! :D",
    "Udv a radional! ;)"
];

function handleJson(raw) {
    if (!raw) return;
    try {
        const obj = JSON.parse(raw);
        const type = parseInt(obj.Type, 10);
        if (type === 1) {
            const cmd = obj.Cmd || '';
            if (urlCache[cmd]) { SendC('xatURL', cmd, urlCache[cmd]); return; }
            const targetUrl = cmd.replace('https://xat.com', 'https://xath.hu');
            if (urlCache[targetUrl]) { SendC('xatURL', cmd, urlCache[targetUrl]); return; }
            https.get(targetUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0', 'Origin': 'https://xath.hu', 'Referer': 'https://xath.hu/xmradio' }
            }, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => SendC('xatURL', cmd, body));
            });
        } else if (type === 4) {
            console.log('[CONNECT] WebSocket connecting to wss://wss.xath.hu:443/v2 ...');
            activeWs = new WebSocket('wss://wss.xath.hu:443/v2', {
                headers: { 'Origin': 'https://xath.hu', 'User-Agent': 'Mozilla/5.0' }
            });
            activeWs.on('open', () => {
                console.log('[WS CONNECTED]');
                SendC('xatMessageReceived', '#CONNECT_OK', '');
                SendC('xatMessageOK', '#CONNECT_CHECK', Buffer.from('xat.com').toString('base64'));
            });
            activeWs.on('message', (d) => {
                const s = d.toString('utf8');

                // Log any packet that is NOT a ping or visitor dump
                if (!s.includes('<c ') && !s.includes('<w ') && !s.includes('<gp ') && !s.includes('<aa ') && !s.includes('<i ')) {
                    console.log('[WS RAW PACKET]:', s.replace(/\0/g, ' '));
                }

                // Check for assigned user ID
                const selfMatch = s.match(/<u [^>]*n="Bence_PRO[^"]*"[^>]*u="(\d+)"/) || s.match(/<u [^>]*u="(\d+)"[^>]*n="Bence_PRO/);
                if (selfMatch) {
                    myServerId = selfMatch[1];
                    console.log(`[IDENTITY] Server assigned my ID: ${myServerId}`);
                }

                // Server keep-alive ping response
                if (s.includes('<m t="/s"')) {
                    if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                        activeWs.send('<m t="/s" u="0" />\0');
                    }
                }

                // Inbound Private Chat (PC tab) or Private Message (PM)
                if (s.includes('<p ') || s.includes('<z ')) {
                    const pPackets = s.match(/<[pz] [^>]+>/g) || [];
                    for (const pkt of pPackets) {
                        console.log('[PRIVATE CHAT PACKET DETECTED]:', pkt);
                        const uMatch = pkt.match(/\bu="(\d+)"/);
                        let sender = uMatch ? uMatch[1] : null;
                        if (!sender) {
                            const dMatch = pkt.match(/\bd="(\d+)"/);
                            if (dMatch) sender = dMatch[1];
                        }

                        if (sender && sender !== myServerId && sender !== credId && sender !== '0') {
                            const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
                            console.log(`>>> [RESPONDING TO PC from ${sender}]: "${reply}"`);
                            
                            // 1. Open PC Tab
                            activeWs.send(`<z d="${sender}" t="/" />\0`);
                            // 2. Send inside PC Tab
                            activeWs.send(`<p u="${sender}" t="${reply}" s="2" />\0`);
                            // 3. Send PM in main chat
                            activeWs.send(`<p u="${sender}" t="${reply}" />\0`);
                        }
                    }
                }

                if (s.includes('<done')) {
                    console.log('>>> [ONLINE & READY] Bot is in xmradio! Open PC tab with Bence_PRO now! <<<');
                }

                SendC('xatMessageReceived', '#MESSAGE', Buffer.from(d).toString('base64'));
            });

            activeWs.on('close', () => {
                console.log('[WS CLOSED]');
                process.exit(0);
            });
        } else if (type === 2) {
            if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                activeWs.send(Buffer.from(obj.Data));
            }
        }
    } catch (e) {
        console.error('[ERR]:', e.message);
    }
}

Module.onRuntimeInitialized = async () => {
    SendC('sendStuff', JSON.stringify({ Flags: 6, origin: 'https://xath.hu' }), '');
    SendC('xatInit', '', '');
    SendC('SetPage', '', 'classic');
    SendC('xatMain', '', '');
    SendC('leaveBackground', '', 'xmradio');
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
        await new Promise(r => setTimeout(r, 50));
    }
};

new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
