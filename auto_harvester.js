'use strict';

/**
 * xat.com High-Speed Proxy Harvester & Validator
 * Scrapes 10,000+ public proxies and filters only clean residential/unblocked IPs
 * Author: outcome
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const args = process.argv.slice(2);
function getArg(name, def) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const TARGET_ROOM = getArg('room', 'TestRadio42');
const MAX_CLEAN = parseInt(getArg('max-clean', '50'), 10);
const CONCURRENCY = parseInt(getArg('workers', '80'), 10);
const TIMEOUT_MS = parseInt(getArg('timeout', '3500'), 10);
const AUTO_START = args.includes('--auto-start');
const STAY_SEC = getArg('stay', '600');

const SCRAPE_SOURCES = [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS5_RAW.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks5.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/socks5.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/socks5.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/socks5/socks5.txt',
    'https://raw.githubusercontent.com/B4RC0D3-UA/proxy-list/main/SOCKS5.txt',
    'https://raw.githubusercontent.com/B4RC0D3-UA/proxy-list/main/HTTP.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/master/proxy_files/http_proxies.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/master/proxy_files/socks5_proxies.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/http.txt',
    'https://raw.githubusercontent.com/ObcbO/getproxy/master/socks5.txt',
    'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt',
    'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/socks5.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt'
];

// Always include our 10 Decodo ISP proxies as the solid core
const DECODO_BASE = [];
for (let p = 10001; p <= 10010; p++) {
    DECODO_BASE.push(`isp.decodo.com:${p}:spq98exiyj:ke1R_o4Bamuq1IhK4z`);
}

function normalizeProxy(proxyStr) {
    if (!proxyStr) return null;
    let s = proxyStr.trim();
    if (!s || s.startsWith('#')) return null;
    if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('socks')) {
        return s;
    }
    const parts = s.split(':');
    if (parts.length === 4) {
        let host = parts[0];
        if (host === 'sp.decodo.com') host = 'isp.decodo.com';
        const port = parts[1];
        const user = parts[2];
        const pass = parts[3];
        return `http://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}`;
    }
    return `http://${s}`;
}

function extractUniqueKey(proxyStr) {
    if (!proxyStr) return null;
    let s = proxyStr.trim();
    s = s.replace(/^(https?|socks4|socks5):\/\//i, '');
    if (s.includes('@')) {
        s = s.split('@')[1];
    }
    const parts = s.split(':');
    const host = parts[0].toLowerCase();
    const port = parts[1] || '';
    if (host.includes('decodo.com')) {
        return `decodo:${port}`;
    }
    return host;
}

function fetchSource(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { timeout: 6000 }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                const lines = body.split('\n')
                    .map(l => l.trim())
                    .filter(l => l && !l.startsWith('#') && l.includes(':'));
                const isSocks = url.includes('socks');
                const formatted = lines.map(l => isSocks && !l.startsWith('socks') ? 'socks5://' + l : l);
                resolve(formatted);
            });
        }).on('error', () => resolve([])).on('timeout', () => resolve([]));
    });
}

function testProxyAgainstXat(rawProxy) {
    const normalized = normalizeProxy(rawProxy);
    return new Promise((resolve) => {
        let ws;
        const timer = setTimeout(() => {
            if (ws) try { ws.terminate(); } catch (_) {}
            resolve({ ok: false });
        }, TIMEOUT_MS);

        try {
            const agent = normalized.startsWith('socks') ? new SocksProxyAgent(normalized) : new HttpsProxyAgent(normalized);
            ws = new WebSocket('wss://wss.xat.com:443/v2', {
                agent,
                headers: {
                    'Origin': 'https://xat.com',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)'
                },
                handshakeTimeout: TIMEOUT_MS - 500
            });

            ws.on('open', () => {
                ws.send('<y r="220527887" v="0" u="1552015182" />\0');
            });

            ws.on('message', (data) => {
                const s = data.toString('utf8');
                clearTimeout(timer);
                ws.terminate();
                if (s.includes('C="1"') || s.includes("C='1'")) {
                    resolve({ ok: false });
                } else if (s.includes('i="') || s.includes('c="')) {
                    resolve({ ok: true });
                } else {
                    resolve({ ok: false });
                }
            });

            ws.on('error', () => {
                clearTimeout(timer);
                resolve({ ok: false });
            });
        } catch (_) {
            clearTimeout(timer);
            resolve({ ok: false });
        }
    });
}

async function harvest() {
    console.log(`[HARVESTER] 1. Proxyk leszedése forrásokból...`);
    const results = await Promise.all(SCRAPE_SOURCES.map(fetchSource));
    const all = [];
    results.forEach(r => all.push(...r));
    const unique = [...new Set(all)];
    console.log(`[HARVESTER] Sikeresen leszedve: ${unique.length} egyedi publikus proxy.`);

    // Shuffle array for better distribution
    for (let i = unique.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unique[i], unique[j]] = [unique[j], unique[i]];
    }

    // Start with the 10 guaranteed Decodo ISP proxies + any existing verified proxies from proxies.txt
    // Strictly enforce 1 proxy per IP address to prevent <dup /> kickouts
    const proxyFile = path.join(__dirname, 'proxies.txt');
    const existing = fs.existsSync(proxyFile)
        ? fs.readFileSync(proxyFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean)
        : [];

    const seenIps = new Set();
    const cleanList = [];
    for (const p of [...DECODO_BASE, ...existing]) {
        const key = extractUniqueKey(p);
        if (key && !seenIps.has(key)) {
            seenIps.add(key);
            cleanList.push(p);
        }
    }

    console.log(`[HARVESTER] Korábban igazolt EGYEDI IP-jű proxyk betöltve: ${cleanList.length} db.`);
    console.log(`[HARVESTER] 2. Párhuzamos xat kézfogás tesztelése (${CONCURRENCY} szál, cél: ${MAX_CLEAN} tiszta egyedi IP)...`);

    fs.writeFileSync(proxyFile, cleanList.join('\n') + '\n');

    let tested = 0;
    const pool = unique.filter(p => {
        const key = extractUniqueKey(p);
        return key && !seenIps.has(key);
    });
    let stopRequested = false;

    const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (pool.length > 0 && !stopRequested) {
            const p = pool.shift();
            const key = extractUniqueKey(p);
            if (!key || seenIps.has(key)) continue;

            tested++;
            const res = await testProxyAgainstXat(p);
            if (res.ok) {
                if (!seenIps.has(key)) {
                    seenIps.add(key);
                    cleanList.push(p);
                    fs.appendFileSync(proxyFile, p + '\n');
                    console.log(`[+] [${cleanList.length}/${MAX_CLEAN}] TISZTA ÉS MŰKÖDŐ ÚJ IP: ${p} (vizsgálva: ${tested})`);
                    if (cleanList.length >= MAX_CLEAN) {
                        stopRequested = true;
                        break;
                    }
                }
            }
            if (tested % 200 === 0) {
                process.stdout.write(`\r[PROGRESS] Vizsgálva: ${tested}/${unique.length} | Tiszta egyedi IP: ${cleanList.length}   `);
            }
        }
    });

    await Promise.all(workers);

    console.log(`\n[HARVESTER] KÉSZ! Összesen talált tiszta proxy: ${cleanList.length}`);
    console.log(`[HARVESTER] Mentve: ${proxyFile}`);

    if (AUTO_START || cleanList.length >= MAX_CLEAN) {
        // 2 bots per proxy IP (maximum allowed by xat without <dup />)
        const botCount = Math.min(cleanList.length * 2, 300);
        console.log(`[HARVESTER] 3. Swarm indítása ${botCount} bottal (2 bot/IP, egyedi nevek, netes avatarok, duma) a ${TARGET_ROOM} szobába...`);
        const swarmArgs = [
            path.join(__dirname, 'xat_swarm.js'),
            '--room', TARGET_ROOM,
            '--count', String(botCount),
            '--nick', 'realistic',
            '--stay', STAY_SEC,
            '--stagger', '500',
            '--chat-interval', '35'
        ];
        const child = spawn(process.execPath, swarmArgs, { stdio: 'inherit' });
        child.on('exit', (code) => {
            console.log(`[HARVESTER] Swarm befejeződött (${code}).`);
        });
    }
}

harvest().catch(err => {
    console.error('[HARVESTER ERROR]:', err);
    process.exit(1);
});
