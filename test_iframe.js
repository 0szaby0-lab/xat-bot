const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_iframe_' + Date.now(),
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

                setTimeout(() => {
                    // Evaluate inside appframe
                    ws.send(JSON.stringify({
                        id: 10,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `(() => {
                                const iframe = document.getElementById('appframe');
                                if (!iframe || !iframe.contentDocument) return { error: 'No iframe doc' };
                                const idv = iframe.contentDocument.getElementById('idvisitors');
                                const msg = iframe.contentDocument.getElementById('messages');
                                const txt = iframe.contentDocument.getElementById('textEntryEditable');
                                const tabs = iframe.contentDocument.getElementById('chattabs');
                                const mainApp = iframe.contentDocument.getElementById('mainApp');
                                const chatName = iframe.contentDocument.getElementById('chatName');

                                return {
                                    hasMainApp: !!mainApp,
                                    mainAppVisible: mainApp ? window.getComputedStyle(mainApp).display : null,
                                    chatNameText: chatName ? chatName.innerText : null,
                                    visitorsCount: idv ? idv.children.length : 0,
                                    visitorsHTML: idv ? idv.innerHTML.slice(0, 300) : null,
                                    messagesCount: msg ? msg.children.length : 0,
                                    messagesHTML: msg ? msg.innerHTML.slice(0, 300) : null,
                                    hasTextEntry: !!txt,
                                    hasTabs: !!tabs,
                                    iframeBodyBg: window.getComputedStyle(iframe.contentDocument.body).backgroundColor
                                };
                            })()`,
                            returnByValue: true
                        }
                    }));
                }, 3000);

                setTimeout(() => {
                    chrome.kill();
                    process.exit(0);
                }, 5000);
            });

            ws.on('message', m => {
                const r = JSON.parse(m.toString());
                if (r.id === 10) {
                    console.log('IFRAME CONTENT STATE:\n', JSON.stringify(r.result?.result?.value, null, 2));
                }
            });
        });
    });
}, 1500);
