const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_layout_' + Date.now(),
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
                ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

                setTimeout(() => {
                    ws.send(JSON.stringify({
                        id: 2,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `(() => {
                                const af = document.getElementById('appframe');
                                const doc = af?.contentDocument;
                                if (!doc) return 'no doc';
                                const els = ['messagesContainer', 'visitorsContainer', 'tabsOuter', 'chatlinks', 'signIn', 'sideBar'];
                                return els.map(id => {
                                    const el = doc.getElementById(id) || doc.querySelector('.' + id);
                                    if (!el) return { id, exists: false };
                                    const rect = el.getBoundingClientRect();
                                    return {
                                        id,
                                        exists: true,
                                        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                                        display: window.getComputedStyle(el).display,
                                        visibility: window.getComputedStyle(el).visibility,
                                        opacity: window.getComputedStyle(el).opacity
                                    };
                                });
                            })()`,
                            returnByValue: true
                        }
                    }));
                }, 3000);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.id === 2) {
                    console.log('LAYOUT:\n', JSON.stringify(r.result?.result?.value, null, 2));
                    chrome.kill();
                    process.exit(0);
                }
            });
        });
    });
}, 1500);
