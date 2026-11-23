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
                ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
                ws.send(JSON.stringify({ id: 2, method: 'Page.reload' }));
                // Add script to run before load
                ws.send(JSON.stringify({
                    id: 3,
                    method: 'Page.addScriptToEvaluateOnNewDocument',
                    params: {
                        source: `
                            console.log('--- EVAL AT START ---');
                            window.addEventListener('DOMContentLoaded', () => {
                                console.log('[DOM] DOMContentLoaded, body children:', document.body ? document.body.children.length : 0);
                            });
                            const obs = new MutationObserver((mutations) => {
                                for (let m of mutations) {
                                    if (m.type === 'childList') {
                                        for (let r of m.removedNodes) {
                                            console.log('[DOM REMOVE]', r.nodeName, r.id || r.className);
                                        }
                                    }
                                }
                            });
                            document.addEventListener('readystatechange', () => {
                                console.log('[DOM] readyState:', document.readyState);
                                if (document.body) {
                                    obs.observe(document.body, { childList: true, subtree: true });
                                    obs.observe(document.documentElement, { childList: true });
                                }
                            });
                        `
                    }
                }));
                ws.send(JSON.stringify({ id: 4, method: 'Runtime.enable' }));
                ws.send(JSON.stringify({ id: 5, method: 'Console.enable' }));

                setTimeout(() => {
                    ws.send(JSON.stringify({ id: 6, method: 'Page.reload' }));
                }, 500);

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 4000);
            });
            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.method === 'Runtime.consoleAPICalled') {
                    console.log('CONSOLE:', (r.params.args || []).map(a => a.value).join(' '));
                }
            });
        });
    });
}, 1500);
