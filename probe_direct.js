const https = require('https');

https.get('https://xath.hu/content/web/R00266/direct.js?z82', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        console.log('direct.js length:', d.length);
        console.log('Sample:\n', d.substring(0, 1500));
        const wssMatches = d.match(/wss?:[^\s"'<>]+/g) || [];
        console.log('WS urls:', wssMatches);
        const ifr = d.match(/embedframe[^\n;]+/g) || [];
        console.log('embedframe refs:', ifr);
    });
});
