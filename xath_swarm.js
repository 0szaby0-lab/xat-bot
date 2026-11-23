'use strict';

/**
 * xath.hu Multi-Guest Swarm Orchestrator
S * Target: https://xath.hu/
 */

const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

const RUNNER_SCRIPT = path.join(__dirname, 'xath_guest_runner.js');
const IDS_FILE = path.join(__dirname, 'listids_xath.txt');
const PROXY_FILE = path.join(__dirname, 'proxies_all_working.txt');

const args = process.argv.slice(2);
function getArg(name, def) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const TARGET_ROOM = getArg('room', 'xmradio');
const COUNT = parseInt(getArg('count', '5'), 10);
const STAY_SECONDS = getArg('stay', '0'); // 0 = indefinite
const STAGGER_MS = parseInt(getArg('stagger', '800'), 10);
const CHAT_INTERVAL = getArg('chat-interval', '45');
const TARGET_USER = getArg('target', null);
const IS_SILENT = args.includes('--silent') || args.includes('--no-chat') || args.includes('--no-msg');
const CUSTOM_MSG = getArg('msg', null);

const RAW_NAMES = [
    'Bence', 'David', 'Balazs', 'Gabor', 'Peter', 'Zoltan', 'Tamas', 'Adam', 'Laszlo', 'Attila',
    'Krisztian', 'Mate', 'Daniel', 'Norbert', 'Roland', 'Richard', 'Patrik', 'Balint', 'Akos', 'Levente',
    'Anna', 'Viktoria', 'Dora', 'Petra', 'Eszter', 'Zsofia', 'Laura', 'Fanni', 'Boglarka', 'Lili',
    'Kata', 'Nikolett', 'Vivien', 'Alexandra', 'Klaudia', 'Bianka', 'Noemi', 'Rebeka', 'Eniko', 'Csilla',
    'Shadow', 'Ghost', 'Phoenix', 'Hunter', 'Falcon', 'Raven', 'Viper', 'Spark', 'Blaze', 'Wolf',
    'Storm', 'Cyber', 'Titan', 'Apex', 'Ranger', 'Frost', 'Echo', 'Nexus', 'Vortex', 'Phantom',
    'Sanyi', 'Bari', 'Laci', 'Jani', 'Peti', 'Zoli', 'Dani', 'Ricsi', 'Karesz', 'Tibi'
];
const REALISTIC_NAMES = RAW_NAMES.filter(n => !n.toLowerCase().includes('szab'));

const GREETING_MESSAGES = [
    "sziasztok :)", "hali mindenkinek", "szep napot mindenkinek!", "jo a zene nagyon",
    "koszi az adast!", "udv a szobaban", "szia szia", "szep estet", "nagyon adja a radio",
    "pacek a track", "jo pihenest mindenkinek", "helloka", "mizu erre?", "pacsi mindenkinek",
    "hallgatom a hatterben :)", "szupi zene", "udv mindenkinek!", "jofejek vagytok",
    ":)", ";)", "szep zene :D"
];

// Load IDs
if (!fs.existsSync(IDS_FILE)) {
    console.error(`[ERROR] ID file not found: ${IDS_FILE}`);
    process.exit(1);
}
const idLines = fs.readFileSync(IDS_FILE, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

console.log(`[SWARM] Loaded ${idLines.length} guest accounts from ${path.basename(IDS_FILE)}`);

// Load Proxies from all available lists
let proxies = [];
const USE_DIRECT = args.includes('--direct') || args.includes('--no-proxy');
if (!USE_DIRECT) {
    const proxySources = [
        path.join(__dirname, 'proxies_all_working.txt'),
        path.join(__dirname, 'proxies.txt'),
        path.join(__dirname, 'proxies_premium.txt'),
        path.join(__dirname, 'proxies_socks5_active.txt')
    ];
    const set = new Set();
    for (const src of proxySources) {
        if (fs.existsSync(src)) {
            const lines = fs.readFileSync(src, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
            for (const p of lines) set.add(p);
        }
    }
    proxies = Array.from(set);
}
console.log(`[SWARM] Loaded ${proxies.length} unique proxies${USE_DIRECT ? ' (DIRECT MODE: proxies disabled)' : ''}`);

const activeWorkers = new Map();
let currentConnected = 0;
let shouldKeepRunning = true;

function parseCred(credLine) {
    const uMatch = credLine.match(/UserId=(\d+)/i);
    const k1Match = credLine.match(/k1=([a-zA-Z0-9]+)/i);
    const k2Match = credLine.match(/k2=(\d+)/i);
    return {
        id: uMatch ? uMatch[1] : null,
        k1: k1Match ? k1Match[1] : null,
        k2: k2Match ? k2Match[1] : null
    };
}

let proxyCursor = 0;
async function spawnBot(index) {
    const proxy = proxies.length > 0 ? proxies[(proxyCursor++) % proxies.length] : null;
    const name = REALISTIC_NAMES[index % REALISTIC_NAMES.length];
    const avatar = String(1 + (index * 7) % 1700);
    const greeting = IS_SILENT ? '' : (CUSTOM_MSG !== null ? CUSTOM_MSG : GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]);
    const cred = parseCred(idLines[index % idLines.length]);

    const childArgs = [
        '--room', TARGET_ROOM,
        '--id', 'auto',
        '--nick', name,
        '--avatar', avatar,
        '--stay', String(STAY_SECONDS),
        '--chat-interval', IS_SILENT ? '0' : String(CHAT_INTERVAL),
        '--msg', greeting
    ];

    if (IS_SILENT) {
        childArgs.push('--silent');
    }
    if (proxy) {
        childArgs.push('--proxy', proxy);
    }
    if (TARGET_USER) {
        childArgs.push('--target', TARGET_USER);
    }

    const worker = fork(RUNNER_SCRIPT, childArgs, {
        execArgv: ['--max-old-space-size=24'],
        stdio: ['ignore', 'pipe', 'pipe', 'ipc']
    });

    const botTag = `Bot #${index + 1} [${name}]`;
    activeWorkers.set(worker.pid, { index, name });

    worker.stdout.on('data', (data) => {
        const text = data.toString();
        for (const line of text.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.includes('[ONLINE]')) {
                currentConnected++;
                console.log(`[SWARM ${currentConnected}/${COUNT}] ${trimmed}`);
            } else if (trimmed.includes('[PC TAB]') || trimmed.includes('[PC REPLY]') || trimmed.includes('[INBOUND PC/PM]')) {
                console.log(`[PC] ${trimmed}`);
            } else if (trimmed.includes('[CHATTER]')) {
                console.log(`[CHAT] ${trimmed}`);
            } else if (trimmed.includes('[RAW') || trimmed.includes('[OUT') || trimmed.includes('[ERROR]') || trimmed.includes('dup') || trimmed.includes('logout') || trimmed.includes('FAIL')) {
                console.log(`[${botTag}] ${trimmed}`);
            }
        }
    });

    worker.stderr.on('data', (d) => {
        console.error(`[${botTag} ERR]:`, d.toString().trim());
    });

    worker.on('exit', (code) => {
        console.log(`[${botTag}] exited with code ${code}`);
        if (activeWorkers.has(worker.pid)) {
            const info = activeWorkers.get(worker.pid);
            activeWorkers.delete(worker.pid);
            currentConnected = Math.max(0, currentConnected - 1);
            if (shouldKeepRunning) {
                setTimeout(() => spawnBot(info.index), 2000);
            }
        }
    });
}

async function main() {
    console.log(`=======================================================`);
    console.log(`  XATH.HU SWARM ORCHESTRATOR`);
    console.log(`  Target Room:   https://xath.hu/${TARGET_ROOM}`);
    console.log(`  Target Count:  ${COUNT} bots`);
    console.log(`  Stagger Delay: ${STAGGER_MS} ms`);
    console.log(`  Stay Duration: ${STAY_SECONDS === '0' ? 'Indefinite' : STAY_SECONDS + 's'}`);
    console.log(`  Proxies:       ${proxies.length > 0 ? proxies.length + ' active' : 'Direct'}`);
    console.log(`=======================================================`);

    for (let i = 0; i < COUNT; i++) {
        spawnBot(i);
        await new Promise(r => setTimeout(r, STAGGER_MS));
    }

    console.log(`[SWARM] All ${COUNT} bot dispatch requests completed. Active swarm holding room...`);
}

process.on('SIGINT', () => {
    shouldKeepRunning = false;
    console.log('\n[SWARM] Shutting down all bots cleanly...');
    for (const [pid, _] of activeWorkers) {
        try { process.kill(pid); } catch (_) {}
    }
    process.exit(0);
});

main();
