'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_DIR = 'D:\\xampp\\htdocs\\chat';
const BASE_URL = 'https://xath.hu/content/web/R00266/box/';

const FILES = [
    'embed.html',
    'activity.js',
    'xatcorewasm.js',
    'xatcorewasm.wasm',
    'www/Quickbar.js',
    'www/xat.js',
    'www/classic.js',
    'www/messages.js',
    'www/settings.js',
    'www/Count.js',
    'www/Smilies.js',
    'www/Avatars.js',
    'www/normalize.css',
    'www/platform.css',
    'www/quickbar.css',
    'www/manifest.json',
    'www/svg/returnw.svg',
    'www/svg/star.svg',
    'www/svg/makefav.svg',
    'www/svg/ablogo.svg',
    'www/svg/abme.svg',
    'www/svg/abfriends.svg',
    'www/svg/abchats.svg',
    'www/svg/abgroups.svg',
    'www/svg/abmore.svg',
    'www/svg/actSettings.svg',
    'www/svg/actStore.svg',
    'www/svg/actBuyXats.svg',
    'www/svg/help.svg',
    'www/svg/groups.svg',
    'www/svg/x.svg',
    'www/svg/cookie.svg',
    'www/svg/logoutx.svg',
    'www/svg/switch.svg',
    'www/svg/bubble.svg',
    'www/svg/bubble2.svg',
    'www/svg/notif.svg',
    'www/svg/notif2.svg',
    'www/poweredbygiphy.png'
];

async function downloadFile(relPath) {
    const dest = path.join(TARGET_DIR, relPath);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const url = BASE_URL + relPath.replace(/\\/g, '/');
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://xath.hu/'
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                console.log(`[ERR ${res.statusCode}] ${relPath}`);
                resolve(false);
                return;
            }
            const stream = fs.createWriteStream(dest);
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close();
                console.log(`[OK] ${relPath}`);
                resolve(true);
            });
        }).on('error', (err) => {
            console.log(`[FAIL] ${relPath}: ${err.message}`);
            resolve(false);
        });
    });
}

async function run() {
    console.log(`Starting client mirror to ${TARGET_DIR}...`);
    for (const f of FILES) {
        await downloadFile(f);
    }
    console.log('Mirror complete!');
}

run();
