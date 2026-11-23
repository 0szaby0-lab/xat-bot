const https = require('https');

const req = https.get('https://xath.hu/content/web/R00266/box/embed.html', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://xath.hu/'
    },
    timeout: 7000
}, res => {
    console.log('STATUS:', res.statusCode);
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        console.log('LENGTH:', d.length);
        console.log('CONTENT:\n', d);
    });
});
req.on('error', e => console.error('ERR:', e.message));
req.on('timeout', () => { req.destroy(); console.error('TIMEOUT'); });
