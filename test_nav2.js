const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_nav_' + Date.now(),
    'about:blank'
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
                ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
                ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));
                ws.send(JSON.stringify({
                    id: 4,
                    method: 'Page.addScriptToEvaluateOnNewDocument',
                    params: {
                        source: `
                            const origInner = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
                            Object.defineProperty(Element.prototype, 'innerHTML', {
                                set: function(val) {
                                    if (this.tagName === 'BODY') {
                                        const stack = new Error().stack;
                                        console.log('[STACK BODY.innerHTML]', val, '--- STACK:', stack);
                                    }
                                    return origInner.call(this, val);
                                }
                            });
                        `
                    }
                }));

                setTimeout(() => {
                    ws.send(JSON.stringify({
                        id: 5,
                        method: 'Page.navigate',
                        params: { url: 'http://localhost/chat/' }
                    }));
                }, 300);

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 3500);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.method === 'Runtime.consoleAPICalled') {
                    const args = (r.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                    if (args.includes('[STACK BODY.innerHTML]')) {
                        console.log(args);
                    }
                }
            });
        });
    });
}, 1500);
