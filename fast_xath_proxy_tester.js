'use strict';

const fs = require('fs');
const WebSocket = require('ws');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const INPUT_FILE = '/storage/emulated/0/Download/xat_bot/fresh_candidates.txt';
const OUTPUT_FILE = '/storage/emulated/0/Download/xat_bot/proxies_all_working.txt';

if (!fs.existsSync(INPUT_FILE)) {
    console.error('Candidate file not found.');
    process.exit(1);
}

const rawProxies = fs.readFileSync(INPUT_FILE, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

console.log(`[TESTER] Loaded ${rawProxies.length} candidate proxies.`);
console.log(`[TESTER] Testing live against wss://wss.xath.hu:443/v2 ...`);

function testProxyOnXath(proxyStr, timeoutMs = 2500) {
    return new Promise((resolve) => {
        let agent;
        try {
            if (proxyStr.startsWith('socks')) {
                agent = new SocksProxyAgent(proxyStr);
            } else {
                const url = proxyStr.startsWith('http') ? proxyStr : 'http://' + proxyStr;
                agent = new HttpsProxyAgent(url);
            }
        } catch (e) {
            return resolve(null);
        }

        let done = false;
        function finish(res) {
            if (done) return;
            done = true;
            try { ws.terminate(); } catch (_) {}
            resolve(res);
        }

        const timer = setTimeout(() => finish(null), timeoutMs);

        let ws;
        try {
            ws = new WebSocket('wss://wss.xath.hu:443/v2', {
                agent,
                headers: {
                    'Origin': 'https://xath.hu',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                handshakeTimeout: timeoutMs
            });
        } catch (e) {
            clearTimeout(timer);
            return resolve(null);
        }

        ws.on('open', () => {
            // Handshake open, send <y> packet
            ws.send(Buffer.from('<y r="418" v="0" u="0" />\0'));
        });

        ws.on('message', (data) => {
            const str = data.toString('utf8');
            if (str.includes('<y I=') || str.includes('<y i=') || str.includes('<y ')) {
                if (str.includes('E46') || str.includes('logout')) {
                    finish(null); // E46 block
                } else {
                    clearTimeout(timer);
                    finish(proxyStr); // Clean accepted response!
                }
            } else if (str.includes('E46') || str.includes('logout')) {
                finish(null);
            }
        });

        ws.on('error', () => {
            clearTimeout(timer);
            finish(null);
        });

        ws.on('close', () => {
            clearTimeout(timer);
            finish(null);
        });
    });
}

async function runScan() {
    const verified = new Set();
    const BATCH_SIZE = 100;
    const TARGET = 300;
    let scanned = 0;

    for (let i = 0; i < rawProxies.length && verified.size < TARGET; i += BATCH_SIZE) {
        const batch = rawProxies.slice(i, i + BATCH_SIZE);
        scanned += batch.length;
        const results = await Promise.all(batch.map(p => testProxyOnXath(p)));

        for (const res of results) {
            if (res && !verified.has(res)) {
                verified.add(res);
                console.log(`[VERIFIED XATH PROXY #${verified.size}]: ${res}`);
                // Append immediately
                fs.appendFileSync(OUTPUT_FILE, res + '\n', 'utf8');
                if (verified.size >= TARGET) break;
            }
        }

        process.stdout.write(`Scanned: ${scanned}/${rawProxies.length} | Working: ${verified.size}\r`);
    }

    console.log(`\n[TESTER] Complete! Verified ${verified.size} working proxies for xath.hu saved to ${OUTPUT_FILE}`);
}

runScan();
