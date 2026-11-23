const WebSocket = require('ws');

const BOT_ID = '999999';
const BOT_NAME = 'xatAssistant';
const BOT_AVATAR = '100';

function startBot() {
    const ws = new WebSocket('ws://127.0.0.1:10000');

    ws.on('open', () => {
        console.log('[BOT] Connected to local xat server');
        ws.send('<y r="1" m="1" v="0" u="0" />\0');
    });

    ws.on('message', (data) => {
        const text = data.toString('utf8');
        let nullIdx;
        let buf = text;
        while ((nullIdx = buf.indexOf('\0')) !== -1) {
            const raw = buf.slice(0, nullIdx).trim();
            buf = buf.slice(nullIdx + 1);
            if (raw.length > 0) handlePacket(raw);
        }
        if (buf.trim().length > 0) handlePacket(buf.trim());
    });

    function parseAttrs(tagStr) {
        const attrs = {};
        const re = /([a-zA-Z0-9_]+)="([^"]*)"/g;
        let match;
        while ((match = re.exec(tagStr)) !== null) {
            attrs[match[1]] = match[2];
        }
        return attrs;
    }

    function handlePacket(packet) {
        if (packet.startsWith('<y ')) {
            // Send join
            console.log('[BOT] Joining room as', BOT_NAME);
            ws.send(`<j2 cb="0" y="12345678" k="0" k3="0" u="${BOT_ID}" n="${BOT_NAME}" a="${BOT_AVATAR}" h="" v="1" />\0`);
            return;
        }

        if (packet.startsWith('<z ')) {
            const attrs = parseAttrs(packet);
            const senderId = attrs.u;
            const targetId = attrs.d;
            const msg = attrs.t || '';

            if (targetId === BOT_ID && senderId && senderId !== BOT_ID) {
                console.log(`[BOT] Private chat from ${senderId}: ${msg}`);
                if (msg === '/') {
                    // Stranger initiated private chat tab
                    console.log(`[BOT] Opening private tab with ${senderId}`);
                    setTimeout(() => {
                        ws.send(`<z d="${senderId}" t="Szia! A sajat xat szervered fut, a privat chat tokeletesen mukodik!" />\0`);
                    }, 500);
                } else {
                    // In-tab message
                    setTimeout(() => {
                        ws.send(`<z d="${senderId}" t="Megkaptam a privat uzeneted: ${msg}" />\0`);
                    }, 400);
                }
            }
            return;
        }

        if (packet.startsWith('<p ')) {
            const attrs = parseAttrs(packet);
            const senderId = attrs.u;
            const msg = attrs.t || '';
            if (senderId && senderId !== BOT_ID) {
                console.log(`[BOT] PM from ${senderId}: ${msg}`);
                setTimeout(() => {
                    ws.send(`<p u="${senderId}" t="Szia! Privát üzenetet kaptam: ${msg}" />\0`);
                }, 400);
            }
            return;
        }

        if (packet.startsWith('<m ')) {
            const attrs = parseAttrs(packet);
            const senderId = attrs.u;
            const msg = attrs.t || '';
            if (senderId && senderId !== BOT_ID && senderId !== '10101') {
                console.log(`[BOT] Public message from ${senderId}: ${msg}`);
            }
            return;
        }
    }

    ws.on('close', () => {
        console.log('[BOT] Disconnected, reconnecting in 3s...');
        setTimeout(startBot, 3000);
    });

    ws.on('error', (err) => {
        console.log('[BOT] Error:', err.message);
    });
}

startBot();
