const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--window-size=1000,700',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_snap_' + Date.now(),
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
                ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

                setTimeout(() => {
                    ws.send(JSON.stringify({
                        id: 2,
                        method: 'Page.captureScreenshot',
                        params: { format: 'png' }
                    }));
                }, 3500);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.id === 2 && r.result?.data) {
                    const buf = Buffer.from(r.result.data, 'base64');
                    fs.writeFileSync('C:/Users/Szaby/.gemini/antigravity/brain/f560c2be-b920-44f5-9dcd-2c022df07967/chat_screen.png', buf);
                    console.log('Saved screenshot, bytes:', buf.length);
                    chrome.kill();
                    process.exit(0);
                }
            });
        });
    });
}, 1500);
