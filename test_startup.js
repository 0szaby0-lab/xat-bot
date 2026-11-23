const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_nav_' + Date.now(),
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
                    ws.send(JSON.stringify({
                        id: 10,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `(() => {
                                const af = document.getElementById('appframe');
                                const idv = af?.contentDocument?.getElementById('idvisitors');
                                const msg = af?.contentDocument?.getElementById('messages');
                                return {
                                    fifoLen: typeof _Activity !== 'undefined' ? _Activity.instance?.FIFO?.length : null,
                                    appFrameLoaded: typeof _Activity !== 'undefined' ? _Activity.instance?.AppFrameLoaded : null,
                                    isSockOpen: typeof _Activity !== 'undefined' ? _Activity.instance?.IsSockOpen : null,
                                    wsReadyState: typeof _Activity !== 'undefined' ? _Activity.instance?.WebSocket?.readyState : null,
                                    iframeVisitors: idv ? idv.children.length : null,
                                    iframeMessages: msg ? msg.children.length : null
                                };
                            })()`,
                            returnByValue: true
                        }
                    }));
                }, 4000);

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 6000);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.method === 'Runtime.consoleAPICalled') {
                    const text = (r.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                    if (text.includes('LOADURL') || text.includes('CONNECT') || text.includes('WebSocket')) {
                        console.log('CONSOLE:', text);
                    }
                } else if (r.method === 'Network.webSocketCreated') {
                    console.log('NET WS CREATED:', r.params.url);
                } else if (r.method === 'Network.webSocketFrameSent') {
                    console.log('NET WS SENT:', r.params.response.payloadData);
                } else if (r.method === 'Network.webSocketFrameReceived') {
                    console.log('NET WS RECV:', r.params.response.payloadData);
                } else if (r.id === 10) {
                    console.log('FINAL STATE EVAL:', JSON.stringify(r.result?.result?.value, null, 2));
                }
            });
        });
    });
}, 1500);
