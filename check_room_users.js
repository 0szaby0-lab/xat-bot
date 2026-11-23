'use strict';
const WebSocket = require('ws');

const ws = new WebSocket('wss://wss.xath.hu:443/v2', {
    headers: { 'Origin': 'https://xath.hu', 'User-Agent': 'Mozilla/5.0' }
});

ws.on('open', () => {
    console.log('[PROBE OPEN]');
    ws.send(Buffer.from('<y r="418" v="0" u="0" />\0'));
});
ws.on('error', (e) => console.log('[PROBE ERR]', e));

ws.on('message', (d) => {
    const s = d.toString('utf8');
    if (s.includes('<c ') || s.includes('<i ') || s.includes('<y ')) {
        ws.send(Buffer.from('<j2 cb="0" y="2" v="0" u="0" m="1" c="418" />\0'));
    }
    const uMatches = s.match(/<u [^>]+>/g);
    if (uMatches) {
        for (const u of uMatches) {
            console.log('[ROOM USER]:', u);
        }
    }
    if (s.includes('<done')) {
        setTimeout(() => {
            ws.close();
            process.exit(0);
        }, 1500);
    }
});

setTimeout(() => {
    ws.close();
    process.exit(0);
}, 6000);
