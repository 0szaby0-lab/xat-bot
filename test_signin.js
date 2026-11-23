const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_signin_' + Date.now(),
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
                    console.log('Triggering signIn button click inside iframe...');
                    ws.send(JSON.stringify({
                        id: 10,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `(() => {
                                const af = document.getElementById('appframe');
                                if (af && af.contentWindow && af.contentWindow.signInButtonPressed) {
                                    af.contentWindow.signInButtonPressed();
                                    return 'Clicked signInButtonPressed()';
                                }
                                return 'No signInButtonPressed found';
                            })()`,
                            returnByValue: true
                        }
                    }));
                }, 3000);

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 6000);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.method === 'Runtime.consoleAPICalled') {
                    const text = (r.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                    if (text.includes('JSON FROM C') || text.includes('LOADURL') || text.includes('CONNECT') || text.includes('WebSocket')) {
                        console.log(text);
                    }
                } else if (r.method === 'Network.webSocketCreated') {
                    console.log('*** NETWORK WS CREATED:', r.params.url);
                } else if (r.method === 'Network.webSocketFrameSent') {
                    console.log('*** NETWORK WS SENT:', r.params.response.payloadData);
                } else if (r.id === 10) {
                    console.log('CLICK RESULT:', r.result?.result?.value);
                }
            });
        });
    });
}, 1500);
