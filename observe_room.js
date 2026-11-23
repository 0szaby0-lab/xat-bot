'use strict';

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

const roomName = 'xmradio';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let botId = null;
let botK1 = null;
let botK2 = null;
let botNick = 'Observer_' + Math.floor(1000 + Math.random() * 9000);

let todoObj = {
    w_userno: '0',
    w_k1: '',
    w_k2: '',
    w_name: botNick,
    w_avatar: '1',
    w_registered: '',
    w_userrev: 1
};

const store = {
    'mobCookies': '1',
    'todo': JSON.stringify(todoObj),
    'Settings': JSON.stringify({
        name: botNick,
        avatar: '1',
        home: '',
        status: ''
    })
};

global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

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
    onAbort: (msg) => console.error('[OBSERVER WASM ABORT]:', msg)
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

let activeWs = null;

function sendPacket(pkt) {
    if (!pkt || !activeWs || activeWs.readyState !== WebSocket.OPEN) return;
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

        if (type === 1) {
            const targetUrl = cmd.replace('https://xat.com', 'https://xath.hu');
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
                    SendC('xatURL', cmd, body);
                });
            }).on('error', () => {});
        } else if (type === 4) {
            if (activeWs) try { activeWs.close(); } catch (_) {}

            activeWs = new WebSocket('wss://wss.xath.hu:443/v2', {
                headers: {
                    'Origin': 'https://xath.hu',
                    'User-Agent': global.window.navigator.userAgent
                },
                handshakeTimeout: 8000
            });

            activeWs.on('open', () => {
                SendC('xatMessageReceived', '#CONNECT_OK', '');
                const hostB64 = Buffer.from('xat.com').toString('base64');
                SendC('xatMessageOK', '#CONNECT_CHECK', hostB64);
            });

            activeWs.on('message', (eventData) => {
                const buf = Buffer.from(eventData);
                const str = buf.toString('utf8');

                if (str.includes('<u ')) {
                    const uPackets = str.match(/<u [^>]+>/g) || [];
                    for (const uPkt of uPackets) {
                        const uMatch = uPkt.match(/\bu="(\d+)"/);
                        const nMatch = uPkt.match(/\bN="([^"]*)"/);
                        const nickMatch = uPkt.match(/\bn="([^"]*)"/);
                        const aMatch = uPkt.match(/\ba="([^"]*)"/);
                        const fMatch = uPkt.match(/\bf="([^"]*)"/);
                        const wMatch = uPkt.match(/\bW="([^"]*)"/);
                        const uid = uMatch ? uMatch[1] : '?';
                        const reg = nMatch ? nMatch[1] : '';
                        const nick = nickMatch ? nickMatch[1] : '';
                        const avatar = aMatch ? aMatch[1] : '';
                        const flag = fMatch ? fMatch[1] : '';

                        let stealthInfo = '';
                        if (wMatch) {
                            try {
                                const decodedW = Buffer.from(wMatch[1], 'base64').toString('utf8');
                                stealthInfo = ` [W: ${decodedW}]`;
                            } catch (_) {}
                        }

                        console.log(`[GUEST-OBSERVER] User ID: ${uid} | Reg: "${reg}" | Nick: "${nick}" | Avatar: ${avatar} | Flag: ${flag}${stealthInfo}`);
                        if (uid === '2000000' || reg === 'Szaby' || nick.toLowerCase().includes('szaby')) {
                            console.log(`\n======================================================`);
                            console.log(`>>> [TARGET FOUND] SZABY IS FULLY VISIBLE TO GUEST! <<<`);
                            console.log(`RAW PACKET: ${uPkt}`);
                            console.log(`======================================================\n`);
                        }
                    }
                }

                if (str.includes('<m ')) {
                    const mPackets = str.match(/<m [^>]+>/g) || [];
                    for (const mPkt of mPackets) {
                        console.log(`[GUEST-OBSERVER CHAT]: ${mPkt}`);
                    }
                }

                if (str.includes('<done')) {
                    console.log(`[GUEST-OBSERVER] Complete user list downloaded (<done />).`);
                }

                if (str.includes('<m t="/s"')) {
                    sendPacket('<m t="/s" u="0" />');
                }

                SendC('xatMessageReceived', '#MESSAGE', buf.toString('base64'));
            });

            activeWs.on('close', (code, reason) => {
                console.log('[OBSERVER WS CLOSED]', code, reason ? reason.toString() : '');
                process.exit(0);
            });
        } else if (type === 2) {
            sendPacket(Buffer.from(data));
        }
    } catch (_) {}
}

Module.onRuntimeInitialized = async () => {
    SendC('sendStuff', JSON.stringify({ Flags: 6, origin: 'https://xath.hu' }), '');
    SendC('xatInit', '', '');
    SendC('xatCommand', '', JSON.stringify({ Type: 'Setting', Command: 'Setting', Name: 'name', Value: botNick }));
    SendC('SetPage', '', 'classic');
    SendC('xatMain', '', '');
    SendC('leaveBackground', '', roomName);
    SendC('ConsoleOff', '', '');
    SendC('SetPhoneFontSize', '', '1.0');
    SendC('setLang', '', 'hu');
    SendC('xatCommand', '', JSON.stringify({ Command: 'EnableTick' }));

    const start = Date.now();
    while (Date.now() - start < 15000) {
        let res = SendC('xatTick', '', '');
        while (res) {
            handleJson(res);
            res = SendC('ReadToJavaFifo', '', '');
        }
        await new Promise(r => setTimeout(r, 60));
    }

    if (activeWs) activeWs.close();
    console.log('[GUEST-OBSERVER FINISHED]');
    process.exit(0);
};

async function fetchGuestCredentials() {
    return new Promise((resolve) => {
        const req = https.get('https://xath.hu/web_gear/chat/auser3.php', {
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
    const creds = await fetchGuestCredentials();
    if (creds) {
        botId = creds.id;
        botK1 = creds.k1;
        botK2 = creds.k2;
        todoObj.w_userno = botId;
        todoObj.w_k1 = botK1;
        todoObj.w_k2 = botK2;
        store['todo'] = JSON.stringify(todoObj);
        console.log(`[GUEST-OBSERVER] Acquired clean guest ID: ${botId}`);
    } else {
        console.log(`[GUEST-OBSERVER] Failed to fetch guest creds, proceeding as anonymous`);
    }

    new Function('Module', 'require', '__dirname', '__filename', wasmCode)(Module, require, __dirname, __filename);
}

bootstrap();
