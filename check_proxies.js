'use strict';

const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const PROXY_FILE = path.join(__dirname, 'proxies.txt');
const WORKING_FILE = path.join(__dirname, 'working_proxies.txt');
const TIMEOUT_MS = 6000;
const CONCURRENCY = 40;

if (!fs.existsSync(PROXY_FILE)) {
    console.error(`Proxies file not found: ${PROXY_FILE}`);
    process.exit(1);
}

const lines = fs.readFileSync(PROXY_FILE, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));

console.log(`Összesen ${lines.length} proxy tesztelése (cél: wss://wss.xat.com:443/v2)...`);

function createAgent(proxyStr) {
    if (proxyStr.startsWith('socks')) {
        return new SocksProxyAgent(proxyStr);
    }
    const pUrl = proxyStr.startsWith('http') ? proxyStr : `http://${proxyStr}`;
    return new HttpsProxyAgent(pUrl);
}

function testProxy(proxyStr) {
    return new Promise((resolve) => {
        let finished = false;
        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                if (ws) {
                    try { ws.terminate(); } catch (_) {}
                }
                resolve({ proxy: proxyStr, ok: false, err: 'TIMEOUT' });
            }
        }, TIMEOUT_MS);

        let ws = null;
        try {
            const agent = createAgent(proxyStr);
            ws = new WebSocket('wss://wss.xat.com:443/v2', {
                agent,
                headers: {
                    'Origin': 'https://xat.com',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)'
                },
                handshakeTimeout: TIMEOUT_MS - 500
            });

            ws.on('open', () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    try { ws.close(); } catch (_) {}
                    resolve({ proxy: proxyStr, ok: true });
                }
            });

            ws.on('error', (err) => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    resolve({ proxy: proxyStr, ok: false, err: err.message || err.code });
                }
            });
        } catch (e) {
            if (!finished) {
                finished = true;
                clearTimeout(timer);
                resolve({ proxy: proxyStr, ok: false, err: e.message });
            }
        }
    });
}

async function run() {
    let index = 0;
    const working = [];
    const failed = [];

    async function worker() {
        while (index < lines.length) {
            const currentIdx = index++;
            const proxy = lines[currentIdx];
            const res = await testProxy(proxy);
            if (res.ok) {
                working.push(res.proxy);
                process.stdout.write(`\r[+] MŰKÖDIK: ${res.proxy} (élő: ${working.length})   \n`);
            } else {
                failed.push(res);
            }
        }
    }

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);

    console.log(`\n--- Eredmény ---`);
    console.log(`Tesztelve: ${lines.length}`);
    console.log(`Működik: ${working.length}`);
    console.log(`Hibás/halott: ${failed.length}`);

    if (working.length > 0) {
        fs.writeFileSync(WORKING_FILE, working.join('\n') + '\n');
        console.log(`Működő proxyk elmentve ide: ${WORKING_FILE}`);
    }
}

run();
