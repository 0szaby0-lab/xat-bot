const https = require('https');

function get(url) {
    return new Promise((resolve) => {
        https.get(url, { family: 4, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 6000 }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve({ status: res.statusCode, data: d }));
        }).on('error', e => resolve({ err: e.message }));
    });
}

async function run() {
    const page = await get('https://xath.hu/chat');
    console.log('--- CHAT PAGE STATUS ---', page.status, 'LEN:', page.data?.length);
    if (page.data) {
        // Find xjson
        const xjson = page.data.match(/id=xjson[^>]*>([^<]+)/);
        if (xjson) console.log('XJSON:', xjson[1].trim());

        // Find scripts
        const scripts = page.data.match(/<script[^>]+src=["']([^"']+)["']/g) || [];
        console.log('Scripts:', scripts);
    }

    // Query roomid.php?d=chat
    const roomInfo = await get('https://xath.hu/web_gear/chat/roomid.php?d=chat');
    console.log('--- ROOMID.PHP RESULT ---', roomInfo.status);
    console.log('Data:', roomInfo.data);
}
run();
