const WebSocket = require('ws');
const http = require('http');

const PORT = 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('xat local server active\n');
});

const wss = new WebSocket.Server({ server });
let clientSeq = 1000;
const clients = new Map(); // ws -> user

function parseAttrs(tagStr) {
    const attrs = {};
    const re = /([a-zA-Z0-9_]+)="([^"]*)"/g;
    let match;
    while ((match = re.exec(tagStr)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
}

function sendPacket(ws, xml) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // xat protocol uses null-terminated XML packets
        const payload = xml.endsWith('\0') ? xml : (xml + '\0');
        ws.send(Buffer.from(payload, 'utf8'));
    }
}

function broadcast(xml, excludeWs = null) {
    const payload = xml.endsWith('\0') ? xml : (xml + '\0');
    const buf = Buffer.from(payload, 'utf8');
    for (const [ws] of clients) {
        if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
            ws.send(buf);
        }
    }
}

wss.on('connection', (ws, req) => {
    console.log('[SRV] Client connected from', req.socket.remoteAddress);
    let currentUser = null;
    let rxBuffer = '';

    ws.on('message', (data) => {
        const text = data.toString('utf8');
        rxBuffer += text;

        let nullIdx;
        while ((nullIdx = rxBuffer.indexOf('\0')) !== -1) {
            const raw = rxBuffer.slice(0, nullIdx).trim();
            rxBuffer = rxBuffer.slice(nullIdx + 1);
            if (raw.length > 0) {
                handlePacket(ws, raw);
            }
        }
        if (rxBuffer.length > 0 && rxBuffer.includes('/>')) {
            const lastClose = rxBuffer.lastIndexOf('/>');
            const chunk = rxBuffer.slice(0, lastClose + 2).trim();
            rxBuffer = rxBuffer.slice(lastClose + 2);
            if (chunk.length > 0) {
                handlePacket(ws, chunk);
            }
        }
    });

    function handlePacket(ws, packet) {
        console.log('[IN]', packet);

        if (packet.startsWith('<y ') || packet === '<y/>') {
            const attrs = parseAttrs(packet);
            const r = attrs.r || '1';
            // Valid xat challenge format expected by WASM
            const challenge = `<y I="32654" i="12345678" c="${Math.floor(Date.now() / 1000)}" cb="147" p="57878238499501,1" k="32654" t="10022" s="40" e="2815963999" />`;
            console.log('[SRV] Sending challenge to client:', challenge);
            sendPacket(ws, challenge);
            return;
        }

        if (packet.startsWith('<j2 ') || packet.startsWith('<j ')) {
            const attrs = parseAttrs(packet);
            let uid = attrs.u;
            if (!uid || uid === '0' || uid === 'undefined') {
                uid = String(4215168000 + (clientSeq++));
            }

            currentUser = {
                ws,
                id: uid,
                nick: attrs.n || ('Guest' + uid.slice(-4)),
                avatar: attrs.a || '1',
                home: attrs.h || '',
                flags: attrs.f || '0',
                cb: attrs.cb || '0'
            };
            clients.set(ws, currentUser);
            console.log(`[SRV] User registered: ${currentUser.nick} (${currentUser.id})`);

            // Room header
            sendPacket(ws, `<i c="1" f="0" b="0" />`);
            sendPacket(ws, `<c i="1" t="${Math.floor(Date.now() / 1000)}" m="0" />`);

            // Send existing user list
            for (const [otherWs, otherUser] of clients) {
                if (otherWs !== ws) {
                    sendPacket(ws, `<u u="${otherUser.id}" n="${otherUser.nick}" a="${otherUser.avatar}" f="${otherUser.flags}" h="${otherUser.home}" cb="${otherUser.cb}" />`);
                }
            }

            // Send self
            sendPacket(ws, `<u u="${currentUser.id}" n="${currentUser.nick}" a="${currentUser.avatar}" f="${currentUser.flags}" h="${currentUser.home}" cb="${currentUser.cb}" />`);
            sendPacket(ws, `<done />`);

            // Broadcast new user to everyone else
            broadcast(`<u u="${currentUser.id}" n="${currentUser.nick}" a="${currentUser.avatar}" f="${currentUser.flags}" h="${currentUser.home}" cb="${currentUser.cb}" />`, ws);

            // System welcome message
            sendPacket(ws, `<m u="10101" t="Local xat server online. Welcome ${currentUser.nick}!" />`);
            return;
        }

        if (packet.startsWith('<m ')) {
            if (!currentUser) return;
            const attrs = parseAttrs(packet);
            const msg = attrs.t || '';
            console.log(`[MSG] [${currentUser.nick}]: ${msg}`);
            // Broadcast public message to all clients
            broadcast(`<m u="${currentUser.id}" t="${msg}" />`);
            return;
        }

        if (packet.startsWith('<p ')) {
            if (!currentUser) return;
            const attrs = parseAttrs(packet);
            const targetId = attrs.u;
            const msg = attrs.t || '';
            console.log(`[PM] [${currentUser.nick} -> ${targetId}]: ${msg}`);

            // Find target client
            for (const [otherWs, otherUser] of clients) {
                if (otherUser.id === targetId) {
                    sendPacket(otherWs, `<p u="${currentUser.id}" t="${msg}" />`);
                    break;
                }
            }
            // Echo to sender
            sendPacket(ws, `<p u="${targetId}" d="${currentUser.id}" t="${msg}" s="2" />`);
            return;
        }

        if (packet.startsWith('<z ')) {
            if (!currentUser) return;
            const attrs = parseAttrs(packet);
            const targetId = attrs.d;
            const msg = attrs.t || '';
            console.log(`[PC] [${currentUser.nick} -> ${targetId}]: t="${msg}"`);

            if (msg === '/') {
                // Private chat open / tab request
                for (const [otherWs, otherUser] of clients) {
                    if (otherUser.id === targetId) {
                        sendPacket(otherWs, `<z d="${targetId}" u="${currentUser.id}" t="/" />`);
                        break;
                    }
                }
                sendPacket(ws, `<z d="${targetId}" u="${targetId}" t="/" />`);
            } else {
                // Private chat text message
                for (const [otherWs, otherUser] of clients) {
                    if (otherUser.id === targetId) {
                        sendPacket(otherWs, `<z d="${targetId}" u="${currentUser.id}" t="${msg}" s="2" />`);
                        break;
                    }
                }
                sendPacket(ws, `<z d="${targetId}" u="${currentUser.id}" t="${msg}" s="1" />`);
            }
            return;
        }

        if (packet.startsWith('<w ')) {
            // Typing tickle / presence
            if (!currentUser) return;
            const attrs = parseAttrs(packet);
            const targetId = attrs.u;
            for (const [otherWs, otherUser] of clients) {
                if (otherUser.id === targetId) {
                    sendPacket(otherWs, `<w u="${currentUser.id}" v="${attrs.v || '0'}" />`);
                    break;
                }
            }
            return;
        }
    }

    ws.on('close', () => {
        if (currentUser) {
            console.log(`[SRV] User disconnected: ${currentUser.nick} (${currentUser.id})`);
            clients.delete(ws);
            broadcast(`<l u="${currentUser.id}" />`);
        }
    });

    ws.on('error', (err) => {
        console.error('[WS ERR]', err.message);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SRV] Local xat WebSocket Server running on ws://127.0.0.1:${PORT}`);
});
