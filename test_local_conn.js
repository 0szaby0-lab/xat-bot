const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:10000');

ws.on('open', () => {
    console.log('WS OPEN, sending <y>');
    ws.send('<y r="1" m="1" v="0" u="0" />\0');
});

ws.on('message', data => {
    const s = data.toString('utf8');
    console.log('RECV:', s);
    if (s.includes('<y ')) {
        console.log('Got challenge, sending <j2>');
        ws.send('<j2 cb="0" y="12345678" k="0" k3="0" u="4215168467" n="Bence" a="1" h="" v="1" />\0');
    }
    if (s.includes('<done')) {
        console.log('HANDSHAKE SUCCESS! Server responded with all packets.');
        setTimeout(() => {
            ws.close();
            process.exit(0);
        }, 500);
    }
});
