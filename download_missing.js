const https = require('https');
const fs = require('fs');
const path = require('path');

const baseBox = 'https://xath.hu/content/web/R00266/box/www/';
const baseRoot = 'https://xath.hu/';

const htmlFiles = ['settings.html', 'selector.html', 'actions.html', 'classic.html'];
const needed = new Set([
    'actions.js',
    'settings.js',
    'selector.js',
    'classic.js',
    'messages.js',
    'visitors.js',
    'friends.js',
    'xat.js',
    'xat2.js'
]);

htmlFiles.forEach(file => {
    const p = path.join('D:/xampp/htdocs/chat/www/', file);
    if (fs.existsSync(p)) {
        const text = fs.readFileSync(p, 'utf8');
        const re = /(?:src|href)=["']?([^"'>\s]+)/gi;
        let match;
        while ((match = re.exec(text)) !== null) {
            let ref = match[1];
            if (!ref.startsWith('http') && !ref.startsWith('#') && !ref.startsWith('data:')) {
                ref = ref.split('?')[0];
                needed.add(ref);
            }
        }
    }
});

console.log('Total referenced files:', needed.size);

const toDownload = [];
needed.forEach(ref => {
    let localPath = '';
    let remoteUrl = '';
    if (ref.startsWith('/')) {
        localPath = path.join('D:/xampp/htdocs/', ref);
        remoteUrl = baseRoot + ref.slice(1);
    } else {
        localPath = path.join('D:/xampp/htdocs/chat/www/', ref);
        remoteUrl = baseBox + ref;
    }
    if (!fs.existsSync(localPath)) {
        toDownload.push({ url: remoteUrl, dest: localPath, ref });
    }
});

console.log('Missing to download:', toDownload.length);

async function downloadAll() {
    for (const item of toDownload) {
        fs.mkdirSync(path.dirname(item.dest), { recursive: true });
        await new Promise(resolve => {
            https.get(item.url, res => {
                if (res.statusCode === 200) {
                    const ws = fs.createWriteStream(item.dest);
                    res.pipe(ws);
                    ws.on('finish', () => {
                        console.log('DOWNLOADED:', item.ref);
                        resolve();
                    });
                } else {
                    console.log('FAIL (' + res.statusCode + '):', item.url);
                    resolve();
                }
            }).on('error', e => {
                console.log('ERR:', item.url, e.message);
                resolve();
            });
        });
    }
    console.log('DONE CHECKING & DOWNLOADING ASSETS');
}

downloadAll();
