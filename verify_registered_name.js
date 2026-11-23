'use strict';

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

const roomName = 'xmradio';
const botNick = 'Laszlo_Pro';
const botAvatar = '123';

const idLine = fs.readFileSync('listids_xath.txt', 'utf8').split('\n')[0].trim();
const uMatch = idLine.match(/UserId=(\d+)/i);
const k1Match = idLine.match(/k1=([a-zA-Z0-9]+)/i);

const guestId = uMatch[1];
const guestK1 = k1Match[1];

console.log('Testing with guestId:', guestId, 'k1:', guestK1, 'nick:', botNick);

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

global.localStorage = {
    _d: {},
    getItem: function(k) { return this._d[k] || null; },
    setItem: function(k, v) { this._d[k] = String(v); },
    removeItem: function(k) { delete this._d[k]; }
};

global.window = {
    location: { host: 'xath.hu', hostname: 'xath.hu', href: `https://xath.hu/${roomName}`, search: '' },
    navigator: { userAgent: USER_AGENT, userLanguage: 'hu', language: 'hu' }
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
    if (resPtr) {
        ret = readUtf8(resPtr);
        if (Module._xFree) Module._xFree(resPtr);
    }
    return ret;
}

let activeWs = null;

function handleJson(raw) {
    if (!raw) return;
    try {
        const obj = JSON.parse(raw);
        const type = parseInt(obj.Type, 10);
        const cmd = obj.Cmd || '';
        const data = obj.Data || '';

        if (type === 1) {
            const targetUrl = cmd.replace('https://xat.com', 'https://xath.hu');
            https.get(targetUrl, {
                headers: { 'User-Agent': USER_AGENT, 'Origin': 'https://xath.hu', 'Referer': `https://xath.hu/${roomName}` }
            }, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => SendC('xatURL', cmd, body));
            });
        } else if (type === 4) {
            activeWs = new WebSocket('wss://wss.xath.hu:443/v2', {
                headers: { 'Origin': 'https://xath.hu', 'User-Agent': USER_AGENT }
            });

            activeWs.on('open', () => {
                SendC('xatMessageReceived', '#CONNECT_OK', '');
                SendC('xatMessageOK', '#CONNECT_CHECK', Buffer.from('xat.com').toString('base64'));
            });

            activeWs.on('message', (eventData) => {
                const buf = Buffer.from(eventData);
                const str = buf.toString('utf8');
                console.log('[SERVER RAW]:', str.replace(/\0/g, ' '));

                if (str.includes('<done')) {
                    console.log('Authenticated! Done received.');
                    setTimeout(() => { if (activeWs) activeWs.close(); process.exit(0); }, 1500);
                }

                SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
            });

            activeWs.on('close', () => {
                SendC('xatMessageReceived', '#CONNECT_CLOSE', '');
                process.exit(0);
            });
        } else if (type === 2) {
            let pkt = data;
            if (pkt.startsWith('<j2 ')) {
                pkt = pkt.replace(/u="[^"]*"/, `u="${guestId}"`);
                pkt = pkt.replace(/k="[^"]*"/, `k="${guestK1}"`);
                pkt = pkt.replace(/n="[^"]*"/, `n="${botNick}## "`);
                pkt = pkt.replace(/a="[^"]*"/, `a="${botAvatar}"`);
                console.log('[SENDING AUTH J2]:', pkt.replace(/\0/g, ' '));
            } else if (pkt.startsWith('<y ')) {
                pkt = pkt.replace(/u="[^"]*"/, `u="${guestId}"`);
            }
            if (activeWs && activeWs.readyState === WebSocket.OPEN) {
                activeWs.send(Buffer.from(pkt));
            }
        }
    } catch (_) {}
}

Module.onRuntimeInitialized = async () => {
    SendC('sendStuff', JSON.stringify({ Flags: 6, origin: 'https://xath.hu' }), '');
    SendC('xatInit', '', '');
    SendC('SetPage', '', 'classic');
    SendC('xatMain', '', '');
    SendC('leaveBackground', '', roomName);
    SendC('ConsoleOff', '', '');
    SendC('SetPhoneFontSize', '', '1.0');
    SendC('setLang', '', 'hu');
    SendC('xatCommand', '', JSON.stringify({ Command: 'EnableTick' }));

    for (let i = 0; i < 150; i++) {
        let res = SendC('xatTick', '', '');
        while (res) {
            handleJson(res);
            res = SendC('ReadToJavaFifo', '', '');
        }
        await new Promise(r => setTimeout(r, 50));
    }
    if (activeWs) activeWs.close();
    process.exit(0);
};

new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
