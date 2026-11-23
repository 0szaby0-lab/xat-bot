const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Szaby\\AppData\\Local\\Temp\\chrome_debug_' + Date.now();

console.log('Launching headless Chrome to http://localhost/chat/#... ');
const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    'http://localhost/chat/'
], { detached: false });

setTimeout(() => {
    http.get('http://localhost:9222/json', (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const targets = JSON.parse(data);
                console.log('Targets:', targets.map(t => ({ type: t.type, title: t.title, url: t.url, id: t.id })));
                
                // Find the main page target
                const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('localhost/chat/'));
                if (!pageTarget) {
                    console.log('No page target found');
                    chrome.kill();
                    process.exit(1);
                }

                const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
                ws.on('open', () => {
                    console.log('Connected to Main Page CDP!');
                    ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
                    ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
                    ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
                    ws.send(JSON.stringify({ id: 4, method: 'Network.enable' }));

                    setTimeout(() => {
                        // Check main page DOM and iframe
                        ws.send(JSON.stringify({
                            id: 10,
                            method: 'Runtime.evaluate',
                            params: {
                                expression: `(() => {
                                    const appframe = document.getElementById('appframe');
                                    let iframeDocState = null;
                                    let iframeBodyHTML = null;
                                    try {
                                        if (appframe && appframe.contentDocument) {
                                            iframeDocState = appframe.contentDocument.readyState;
                                            const v = appframe.contentDocument.getElementById('idvisitors');
                                            const m = appframe.contentDocument.getElementById('messages');
                                            const t = appframe.contentDocument.getElementById('textEntryEditable');
                                            const tabs = appframe.contentDocument.getElementById('chattabs');
                                            const bg = appframe.contentDocument.body ? window.getComputedStyle(appframe.contentDocument.body).backgroundColor : null;
                                            iframeBodyHTML = {
                                                hasVisitorsDiv: !!v,
                                                visitorsCount: v ? v.children.length : 0,
                                                hasMessagesDiv: !!m,
                                                messagesCount: m ? m.children.length : 0,
                                                hasTextEntry: !!t,
                                                hasTabs: !!tabs,
                                                bodyBg: bg,
                                                bodyDisplay: appframe.contentDocument.body ? window.getComputedStyle(appframe.contentDocument.body).display : null,
                                                bodyVisibility: appframe.contentDocument.body ? window.getComputedStyle(appframe.contentDocument.body).visibility : null,
                                                bodyWidth: appframe.contentDocument.body ? appframe.contentDocument.body.offsetWidth : 0,
                                                bodyHeight: appframe.contentDocument.body ? appframe.contentDocument.body.offsetHeight : 0
                                            };
                                        }
                                    } catch(e) {
                                        iframeDocState = 'cross-origin-blocked: ' + e.message;
                                    }
                                    return {
                                        title: document.title,
                                        url: window.location.href,
                                        appframeExists: !!appframe,
                                        appframeWidth: appframe ? appframe.offsetWidth : 0,
                                        appframeHeight: appframe ? appframe.offsetHeight : 0,
                                        appframeSrc: appframe ? appframe.src : null,
                                        topBodyBg: window.getComputedStyle(document.body).backgroundColor,
                                        topBodyWidth: document.body.offsetWidth,
                                        topBodyHeight: document.body.offsetHeight,
                                        activityInstance: typeof _Activity !== 'undefined' && !!_Activity.instance,
                                        fifoLen: typeof _Activity !== 'undefined' && _Activity.instance ? _Activity.instance.FIFO?.length : null,
                                        iframeInfo: iframeBodyHTML
                                    };
                                })()`,
                                returnByValue: true
                            }
                        }));
                    }, 3000);

                    setTimeout(() => {
                        console.log('Inspection complete.');
                        ws.close();
                        chrome.kill();
                        process.exit(0);
                    }, 5000);
                });

                ws.on('message', (msg) => {
                    const evt = JSON.parse(msg.toString('utf8'));
                    if (evt.method === 'Console.messageAdded') {
                        console.log('[TOP CONSOLE]', evt.params.message.level, evt.params.message.text);
                    } else if (evt.method === 'Runtime.consoleAPICalled') {
                        const args = (evt.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                        if (args.length > 200) {
                            console.log('[TOP CONSOLE ' + evt.params.type + ']', args.slice(0, 200) + '... (len ' + args.length + ')');
                        } else {
                            console.log('[TOP CONSOLE ' + evt.params.type + ']', args);
                        }
                    } else if (evt.method === 'Runtime.exceptionThrown') {
                        console.log('[TOP EXCEPTION]', evt.params.exceptionDetails.text, evt.params.exceptionDetails.exception?.description);
                    } else if (evt.method === 'Network.webSocketCreated') {
                        console.log('[NETWORK WS CREATED]', evt.params.url);
                    } else if (evt.method === 'Network.webSocketFrameSent') {
                        console.log('[NETWORK WS SENT]', evt.params.response.payloadData);
                    } else if (evt.method === 'Network.webSocketFrameReceived') {
                        console.log('[NETWORK WS RECV]', evt.params.response.payloadData);
                    } else if (evt.id === 10) {
                        console.log('[EVAL RESULT]', JSON.stringify(evt.result?.result?.value, null, 2));
                    }
                });
            } catch (e) {
                console.error('Failed to parse:', e);
                chrome.kill();
                process.exit(1);
            }
        });
    }).on('error', err => {
        console.error('HTTP err:', err);
        chrome.kill();
        process.exit(1);
    });
}, 1500);
