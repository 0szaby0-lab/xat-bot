'use strict';

/**
 * xat.com Multi-Guest Swarm Orchestrator (Dynamic Pool + Proxy Support)
 * Author: RITMADA
 * Automatically generates/draws unique guest credentials from account pool
 * and distributes proxies to allow scaling beyond single-IP limits.
 */

const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');
const { AccountPool } = require('./xat_account_pool');

const RUNNER_SCRIPT = path.join(__dirname, 'xat_guest_runner.js');

const args = process.argv.slice(2);
function getArg(name, def) {
    const idx = args.indexOf('--' + name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const TARGET_ROOM = getArg('room', 'TestRadio42');
const count = parseInt(getArg('count', '2'), 10);
const stay = getArg('stay', '600');
const nickPrefix = getArg('nick', 'Szaby');
const proxyFile = getArg('proxies', path.join(__dirname, 'proxies.txt'));
const staggerMs = parseInt(getArg('stagger', '1000'), 10);
const chatInterval = getArg('chat-interval', '40');
const startIndex = parseInt(getArg('start-index', '100'), 10);
const proxyOffset = parseInt(getArg('proxy-offset', '0'), 10);
const tryLive = args.includes('--live-gen');

function normalizeProxy(proxyStr) {
    if (!proxyStr) return null;
    let s = proxyStr.trim();
    if (!s) return null;
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

// Load proxies if file exists
let proxies = [];
if (fs.existsSync(proxyFile)) {
    const raw = fs.readFileSync(proxyFile, 'utf8');
    proxies = raw.split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('#'))
        .map(normalizeProxy);
}

async function main() {
    const pool = new AccountPool();
    console.log(`[SWARM] Initializing swarm for ${TARGET_ROOM}...`);
    console.log(`[SWARM] Target Count: ${count} users | Stay Duration: ${stay}s | Proxy Count: ${proxies.length}`);

    if (proxies.length === 0 && count > 2) {
        console.warn('[SWARM] Note: Running >2 guests without proxies may trigger xat <dup /> IP disconnects.');
        console.warn('[SWARM] Add proxies to /data/user/0/com.agy/files/proxies.txt for unlimited concurrent guests.');
    }

    const effectiveProxies = proxyOffset > 0 ? proxies.slice(proxyOffset) : proxies;

    const swarmList = await pool.getSwarmPool(count, {
        nickPrefix,
        proxies: effectiveProxies,
        tryLive,
        startIndex
    });

    console.log(`[SWARM] Generated ${swarmList.length} distinct guest specifications.`);
    const children = [];
    let exitedCount = 0;

    function spawnGuest(guest, index) {
        // Dynamically rotate from latest proxies.txt so dead proxies are replaced by fresh ones
        let currentProxy = guest.proxy;
        if (fs.existsSync(proxyFile)) {
            const latest = fs.readFileSync(proxyFile, 'utf8')
                .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(normalizeProxy);
            if (latest.length > 0) {
                currentProxy = latest[index % latest.length];
            }
        }

        const proxyNote = currentProxy ? `via [${currentProxy}]` : '(Direct IP)';
        console.log(`[SWARM] Spawning guest #${index + 1}: ${guest.nick} (ID: ${guest.id}) ${proxyNote}...`);

        const childArgs = [
            '--room', TARGET_ROOM,
            '--nick', guest.nick,
            '--id', guest.id,
            '--k1', guest.k1,
            '--k2', guest.k2,
            '--msg', guest.msg,
            '--stay', stay,
            '--chat-interval', chatInterval
        ];

        if (guest.avatar) {
            childArgs.push('--avatar', guest.avatar);
        }

        if (currentProxy) {
            childArgs.push('--proxy', currentProxy);
        }

        const child = fork(RUNNER_SCRIPT, childArgs);

        child.on('exit', (code) => {
            console.log(`[SWARM] Guest ${guest.nick} exited with code ${code}.`);
            if (stay === '0' || parseInt(stay, 10) <= 0) {
                console.log(`[SWARM] Auto-reconnecting ${guest.nick} in 3.5s...`);
                setTimeout(() => spawnGuest(guest, index), 3500);
            } else {
                exitedCount++;
                if (exitedCount >= swarmList.length) {
                    console.log('[SWARM] All guest instances completed. Exiting swarm.');
                    process.exit(0);
                }
            }
        });

        children.push(child);
    }

    swarmList.forEach((guest, index) => {
        setTimeout(() => spawnGuest(guest, index), index * staggerMs);
    });

    process.on('SIGINT', () => {
        console.log('[SWARM] Terminating all spawned guest instances...');
        children.forEach((c) => c.kill());
        process.exit(0);
    });
}

main().catch((err) => {
    console.error('[SWARM ERROR]:', err);
    process.exit(1);
});
