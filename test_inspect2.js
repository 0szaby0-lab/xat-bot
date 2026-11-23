const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_test_' + Date.now(),
    'http://localhost/chat/'
]);

setTimeout(() => {
    http.get('http://localhost:9222/json', (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => {
            const tabs = JSON.parse(d);
            const t = tabs.find(x => x.type === 'page');
            const ws = new WebSocket(t.webSocketDebuggerUrl);
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    id: 1,
                    method: 'Runtime.evaluate',
                    params: {
                        expression: `document.documentElement.outerHTML`,
                        returnByValue: true
                    }
                }));
            });
            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.id === 1) {
                    console.log('OUTER HTML:', r.result?.result?.value);
                    chrome.kill();
                    process.exit(0);
                }
            });
        });
    });
}, 2500);
