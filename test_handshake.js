const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_hs_' + Date.now(),
    'http://localhost/chat/'
]);

setTimeout(() => {
    http.get('http://localhost:9222/json', (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => {
            const tabs = JSON.parse(d);
            const page = tabs.find(x => x.type === 'page');
            const ws = new WebSocket(page.webSocketDebuggerUrl);

            ws.on('open', () => {
                ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
                ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
                ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 6000);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.method === 'Runtime.consoleAPICalled') {
                    const text = (r.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                    if (text.includes('JSON FROM C') || text.includes('xatReceived') || text.includes('SendSock') || text.includes('_xatSend')) {
                        console.log(text.slice(0, 160));
                    }
                } else if (r.method === 'Network.webSocketFrameSent') {
                    const buf = Buffer.from(r.params.response.payloadData, 'base64');
                    console.log('[NET SENT]', buf.toString('utf8').replace(/\0/g, '<NUL>'));
                } else if (r.method === 'Network.webSocketFrameReceived') {
                    const buf = Buffer.from(r.params.response.payloadData, 'base64');
                    console.log('[NET RECV]', buf.toString('utf8').replace(/\0/g, '<NUL>'));
                }
            });
        });
    });
}, 1500);
