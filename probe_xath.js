const https = require('https');

function get(path) {
    return new Promise((resolve) => {
        https.get('https://xath.hu' + path, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve({ status: res.statusCode, body: d }));
        }).on('error', e => resolve({ err: e.message }));
    });
}

async function run() {
    const home = await get('/');
    console.log('--- HOMEPAGE LINKS & ROOMS ---');
    // find rooms or groups
    const matches = home.body.match(/href=["']\/([a-zA-Z0-9_-]+)["']/g) || [];
    console.log('Found links:', [...new Set(matches)].slice(0, 20));

    // Also look for chat iframe or scripts
    const iframes = home.body.match(/<iframe[^>]+>/g) || [];
    console.log('Iframes:', iframes);

    const scripts = home.body.match(/<script[^>]+src=["']([^"']+)["']/g) || [];
    console.log('Scripts:', scripts);
}
run();
