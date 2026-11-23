'use strict';

/**
 * xat.com Dynamic Account Generator & Pool Manager
 * Author: RITMADA
 * Loads pre-harvested authentic guest credentials from listids.txt
 * and/or generates live credentials via auser3.php using proxies.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const LIST_FILE = path.join(__dirname, 'listids.txt');

const REALISTIC_NAMES = [
    'Bence', 'David', 'Balazs', 'Gabor', 'Peter', 'Zoltan', 'Tamas', 'Adam', 'Laszlo', 'Attila',
    'Krisztian', 'Mate', 'Daniel', 'Norbert', 'Roland', 'Richard', 'Patrik', 'Balint', 'Akos', 'Levente',
    'Anna', 'Viktoria', 'Dora', 'Petra', 'Eszter', 'Zsofia', 'Laura', 'Fanni', 'Boglarka', 'Lili',
    'Kata', 'Nikolett', 'Vivien', 'Alexandra', 'Klaudia', 'Bianka', 'Noemi', 'Rebeka', 'Eniko', 'Csilla',
    'Shadow', 'Ghost', 'Phoenix', 'Hunter', 'Falcon', 'Raven', 'Viper', 'Spark', 'Blaze', 'Wolf',
    'Storm', 'Cyber', 'Titan', 'Apex', 'Ranger', 'Frost', 'Echo', 'Nexus', 'Vortex', 'Phantom',
    'Sanyi', 'Bari', 'Laci', 'Jani', 'Peti', 'Zoli', 'Dani', 'Ricsi', 'Karesz', 'Tibi'
];

const CHAT_PHRASES = [
    "sziasztok :)", "hali mindenkinek", "szep napot mindenkinek!", "jo a zene nagyon",
    "koszi az adast!", "udv a szobaban", "szia szia", "szep napot", "nagyon adja a radio",
    "pacek a track", "jo pihenest mindenkinek", "helloka", "mizu erre?", "pacsi mindenkinek",
    "hallgatom a hatterben :)", "szupi zene", "udv mindenkinek!", "jofejek vagytok",
    ":)", ";)", "szep estet", "kellemes delutant", "szia", "szep zene :D"
];

class AccountPool {
    constructor(listPath = LIST_FILE) {
        this.listPath = listPath;
        this.cachedAccounts = [];
        this.loadLocalPool();
    }

    loadLocalPool() {
        if (!fs.existsSync(this.listPath)) {
            console.warn(`[POOL] Warning: Credential file not found at ${this.listPath}`);
            return;
        }

        const content = fs.readFileSync(this.listPath, 'utf8');
        const lines = content.split('\n');

        const seen = new Set();
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const uMatch = trimmed.match(/UserId=(\d+)/i);
            const k1Match = trimmed.match(/k1=([a-f0-9]+)/i);
            const k2Match = trimmed.match(/k2=(\d+)/i);

            if (uMatch && k1Match) {
                const id = uMatch[1];
                const k1 = k1Match[1];
                const k2 = k2Match ? k2Match[1] : '0';

                if (!seen.has(id)) {
                    seen.add(id);
                    this.cachedAccounts.push({ id, k1, k2 });
                }
            }
        }
        console.log(`[POOL] Loaded ${this.cachedAccounts.length} unique authentic guest credentials.`);
    }

    /**
     * Attempts to query auser3.php live through a proxy to obtain a fresh ID
     */
    async generateLive(proxyUrl = null) {
        return new Promise((resolve) => {
            const targetUrl = 'https://xat.com/web_gear/chat/auser3.php';
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': 'https://xat.com/'
                },
                timeout: 8000
            };

            if (proxyUrl) {
                if (proxyUrl.startsWith('socks')) {
                    options.agent = new SocksProxyAgent(proxyUrl);
                } else {
                    options.agent = new HttpsProxyAgent(proxyUrl);
                }
            }

            const req = https.get(targetUrl, options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    const uMatch = data.match(/UserId=(\d+)/i);
                    const k1Match = data.match(/k1=([a-f0-9]+)/i);
                    const k2Match = data.match(/k2=(\d+)/i);

                    if (uMatch && k1Match) {
                        resolve({
                            id: uMatch[1],
                            k1: k1Match[1],
                            k2: k2Match ? k2Match[1] : '0',
                            source: 'live'
                        });
                    } else {
                        resolve(null);
                    }
                });
            });

            req.on('error', () => resolve(null));
            req.on('timeout', () => {
                req.destroy();
                resolve(null);
            });
        });
    }

    /**
     * Generates a batch of guest specifications with custom nick and messages.
     */
    async getSwarmPool(count, options = {}) {
        const {
            nickPrefix = 'Szaby',
            proxies = [],
            tryLive = false,
            startIndex = 50 // Start deep in the pool to avoid common collisions
        } = options;

        const results = [];
        let poolOffset = startIndex;
        const usedIds = new Set();
        const usedNicks = new Set();

        for (let i = 0; i < count; i++) {
            let nick;
            if (nickPrefix && nickPrefix !== 'Szaby' && nickPrefix !== 'realistic') {
                nick = `${nickPrefix}_${i + 1}`;
            } else {
                const base = REALISTIC_NAMES[i % REALISTIC_NAMES.length];
                const cycle = Math.floor(i / REALISTIC_NAMES.length);
                nick = cycle === 0 ? base : `${base}_${cycle + 1}`;
                let attempts = 0;
                while (usedNicks.has(nick) && attempts < 100) {
                    nick = `${base}_${Math.floor(Math.random() * 900 + 100)}`;
                    attempts++;
                }
            }
            usedNicks.add(nick);

            // Assign unique avatars (mix of internet image URLs and diverse xat avatar IDs)
            let avatar;
            if (i % 3 === 0) {
                avatar = `https://picsum.photos/seed/${i + 100}/150/150`;
            } else if (i % 3 === 1) {
                avatar = `https://i.pravatar.cc/150?u=${i + 200}`;
            } else {
                const xatAvatars = [1, 14, 42, 60, 167, 218, 320, 383, 617, 735, 784, 875, 1100, 1148, 1361, 1470, 1566, 1688, 1747];
                avatar = String(xatAvatars[i % xatAvatars.length]);
            }

            const msg = CHAT_PHRASES[i % CHAT_PHRASES.length];
            const proxy = proxies.length > 0 ? proxies[i % proxies.length] : null;

            let cred = null;
            if (tryLive && proxy) {
                cred = await this.generateLive(proxy);
            }

            if (!cred) {
                while (usedIds.has(this.cachedAccounts[poolOffset % this.cachedAccounts.length].id)) {
                    poolOffset++;
                }
                const localCred = this.cachedAccounts[poolOffset % this.cachedAccounts.length];
                usedIds.add(localCred.id);
                poolOffset += 23; // Prime stride prevents picking consecutive IDs

                cred = {
                    id: localCred.id,
                    k1: localCred.k1,
                    k2: localCred.k2,
                    source: 'pool'
                };
            }

            results.push({
                id: cred.id,
                k1: cred.k1,
                k2: cred.k2,
                nick,
                avatar,
                msg,
                proxy
            });
        }

        return results;
    }
}

module.exports = { AccountPool, CHAT_PHRASES };
