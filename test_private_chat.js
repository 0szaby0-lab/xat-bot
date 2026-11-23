const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:10000');

ws.on('open', () => {
    ws.send('<y r="1" m="1" v="0" u="0" />\0');
});

ws.on('message', data => {
    const s = data.toString('utf8');
    console.log('[CLIENT 2 RECV]', s);

    if (s.includes('<y ')) {
        ws.send('<j2 cb="0" y="12345678" k="0" k3="0" u="111111" n="Szaby" a="1" h="" v="1" />\0');
    }

    if (s.includes('<done')) {
        console.log('[CLIENT 2] Joined, now initiating Private Chat with xatAssistant (999999)...');
        ws.send('<z d="999999" t="/" />\0');
    }

    if (s.includes('<z ') && s.includes('d="111111"')) {
        console.log('[CLIENT 2] SUCCESS! Received private message in tab:', s);
        setTimeout(() => {
            ws.close();
            process.exit(0);
        }, 500);
    }
});
