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
                            console.log('--- EARLY HOOK INSTALLED ---');
                            document.addEventListener('DOMContentLoaded', () => {
                                console.log('[HOOK DOMContentLoaded] body children:', document.body ? document.body.children.length : 0);
                                console.log('[HOOK DOMContentLoaded] appframe:', !!document.getElementById('appframe'));
                            });
                            window.addEventListener('load', () => {
                                console.log('[HOOK load] body children:', document.body ? document.body.children.length : 0);
                                console.log('[HOOK load] appframe:', !!document.getElementById('appframe'));
                            });
                            // Override removeChild or replaceChild on document.body or documentElement
                            const origRemove = Element.prototype.removeChild;
                            Element.prototype.removeChild = function(child) {
                                console.log('[HOOK removeChild]', this.tagName, child.tagName, child.id || child.className);
                                return origRemove.apply(this, arguments);
                            };
                            const origInner = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
                            Object.defineProperty(Element.prototype, 'innerHTML', {
                                set: function(val) {
                                    if (this.tagName === 'BODY') {
                                        console.log('[HOOK innerHTML set on BODY!]', val.slice(0, 100));
                                    }
                                    return origInner.call(this, val);
                                }
                            });
                        `
                    }
                }));

                setTimeout(() => {
                    console.log('Navigating to http://localhost/chat/ ...');
                    ws.send(JSON.stringify({
                        id: 5,
                        method: 'Page.navigate',
                        params: { url: 'http://localhost/chat/' }
                    }));
                }, 300);

                setTimeout(() => {
                    ws.send(JSON.stringify({
                        id: 6,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `({
                                bodyChildren: document.body ? document.body.children.length : 0,
                                bodyHTMLSnippet: document.body ? document.body.innerHTML.slice(0, 200) : null,
                                appframe: !!document.getElementById('appframe'),
                                appframeWindow: !!document.getElementById('appframe')?.contentWindow,
                                url: location.href
                            })`,
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
                if (r.method === 'Runtime.consoleAPICalled') {
                    const args = (r.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
                    if (args.includes('HOOK') || args.includes('[ACT]')) {
                        console.log('CONSOLE:', args);
                    }
                } else if (r.id === 6) {
                    console.log('FINAL EVAL:', JSON.stringify(r.result?.result?.value, null, 2));
                }
            });
        });
    });
}, 1500);
