const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_' + Date.now();

console.log('Launching headless Chrome...');
const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    'http://localhost/chat/embed.html#!&id=1&n=chat'
], { detached: false });

setTimeout(() => {
    http.get('http://localhost:9222/json', (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const tabs = JSON.parse(data);
                console.log('Open tabs:', tabs.length);
                const chatTab = tabs.find(t => t.url.includes('localhost')) || tabs[0];
                if (!chatTab || !chatTab.webSocketDebuggerUrl) {
                    console.log('No debugger URL found:', tabs);
                    chrome.kill();
                    process.exit(1);
                }

                console.log('Connecting to DevTools:', chatTab.webSocketDebuggerUrl);
                const ws = new WebSocket(chatTab.webSocketDebuggerUrl);

                ws.on('open', () => {
                    console.log('DevTools connected! Enabling Console & Runtime...');
                    ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
                    ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
                    ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));

                    setTimeout(() => {
                        // Evaluate #appframe dimensions and content
                        ws.send(JSON.stringify({
                            id: 4,
                            method: 'Runtime.evaluate',
                            params: {
                                expression: `({
                                    appframe: !!document.getElementById('appframe'),
                                    appframe_src: document.getElementById('appframe')?.src,
                                    appframe_w: document.getElementById('appframe')?.offsetWidth,
                                    appframe_h: document.getElementById('appframe')?.offsetHeight,
                                    body_bg: window.getComputedStyle(document.body).backgroundColor,
                                    activity_exists: typeof _Activity !== 'undefined',
                                    isClassic: typeof _Activity !== 'undefined' ? _Activity.instance?.IsClassic : null
                                })`,
                                returnByValue: true
                            }
                        }));
                    }, 2000);

                    setTimeout(() => {
                        console.log('Done inspecting.');
                        ws.close();
                        chrome.kill();
                        process.exit(0);
                    }, 4000);
                });

                ws.on('message', (msg) => {
                    const evt = JSON.parse(msg.toString('utf8'));
                    if (evt.method === 'Console.messageAdded') {
                        console.log('[BROWSER CONSOLE]', evt.params.message.level, evt.params.message.text);
                    } else if (evt.method === 'Runtime.consoleAPICalled') {
                        const args = (evt.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                        console.log('[CONSOLE ' + evt.params.type + ']', args);
                    } else if (evt.method === 'Runtime.exceptionThrown') {
                        console.log('[EXCEPTION]', evt.params.exceptionDetails.text, evt.params.exceptionDetails.exception?.description);
                    } else if (evt.id === 4) {
                        console.log('[EVAL RESULT]', JSON.stringify(evt.result?.result?.value, null, 2));
                    }
                });
            } catch (e) {
                console.error('Error parsing tabs:', e.message);
                chrome.kill();
                process.exit(1);
            }
        });
    }).on('error', (err) => {
        console.error('Failed to query DevTools:', err.message);
        chrome.kill();
        process.exit(1);
    });
}, 1500);
