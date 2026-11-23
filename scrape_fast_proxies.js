'use strict';

const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const SOURCES = [
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http,socks4,socks5&timeout=3500&country=all',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS5_RAW.txt'
];

function fetchUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { timeout: 8000 }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

function testProxy(proxyUrl, timeoutMs = 3000) {
    return new Promise((resolve) => {
        let agent;
        try {
            if (proxyUrl.startsWith('socks')) {
                agent = new SocksProxyAgent(proxyUrl);
            } else {
                agent = new HttpsProxyAgent(proxyUrl);
            }
        } catch (_) {
            return resolve(null);
        }

        let done = false;
        let ws;
        const timer = setTimeout(() => {
            if (!done) {
                done = true;
                if (ws) try { ws.terminate(); } catch (_) {}
                resolve(null);
            }
        }, timeoutMs);

        try {
            ws = new WebSocket('wss://wss.xath.hu:443/v2', {
                agent,
                headers: {
                    'Origin': 'https://xath.hu',
                    'User-Agent': 'Mozilla/5.0'
                },
                handshakeTimeout: timeoutMs
            });
        } catch (_) {
            clearTimeout(timer);
            return resolve(null);
        }

        ws.on('open', () => {
            if (!done) {
                done = true;
                clearTimeout(timer);
                try { ws.close(); } catch (_) {}
                resolve(proxyUrl);
            }
        });

        ws.on('error', () => {
            if (!done) {
                done = true;
                clearTimeout(timer);
                resolve(null);
            }
        });
    });
}

async function main() {
    console.log('[SCRAPER] Pulling fresh proxy lists...');
    const rawLists = await Promise.all(SOURCES.map(fetchUrl));
    const allProxies = new Set();

    // 1. Add Decodo ISP proxies
    if (fs.existsSync('proxies_decodo_backup.txt')) {
        const dec = fs.readFileSync('proxies_decodo_backup.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
        for (const l of dec) {
            const parts = l.split(':');
            if (parts.length === 4) {
                allProxies.add(`http://${parts[2]}:${parts[3]}@${parts[0]}:${parts[1]}`);
            }
        }
    }

    // 2. Add scraped
    for (const text of rawLists) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        for (const l of lines) {
            if (l.includes(':') && !l.includes(' ') && !l.startsWith('#')) {
                let p = l;
                if (!p.startsWith('http://') && !p.startsWith('https://') && !p.startsWith('socks4://') && !p.startsWith('socks5://')) {
                    p = 'http://' + p;
                }
                allProxies.add(p);
            }
        }
    }

    console.log(`[SCRAPER] Testing candidate proxies directly to wss://wss.xath.hu:443/v2 ...`);
    const candidateArray = Array.from(allProxies);
    const verified = [];
    const CONCURRENCY = 80;

    for (let i = 0; i < candidateArray.length && verified.length < 500; i += CONCURRENCY) {
        const chunk = candidateArray.slice(i, i + CONCURRENCY);
        const results = await Promise.all(chunk.map(p => testProxy(p, 2800)));
        for (const r of results) {
            if (r) {
                verified.push(r);
            }
        }
        process.stdout.write(`\rProgress: ${Math.min(i + CONCURRENCY, candidateArray.length)}/${candidateArray.length} | Alive: ${verified.length}`);
    }

    console.log(`\n[SCRAPER] Successfully verified ${verified.length} fast alive proxies!`);
    fs.writeFileSync('proxies_all_working.txt', verified.join('\n'), 'utf8');
    console.log('Saved to proxies_all_working.txt');
}

main();
