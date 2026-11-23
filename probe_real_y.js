const WebSocket = require('ws');
const ws = new WebSocket('wss://wss.xath.hu:443/v2', {
  headers: {
    'Origin': 'https://xath.hu',
    'User-Agent': 'Mozilla/5.0'
  }
});
ws.on('open', () => {
  console.log('Connected to real xat! Sending <y>');
  ws.send('<y r="418" v="0" u="2" />\0');
});
ws.on('message', data => {
  console.log('REAL XAT RESPONSE:', data.toString('utf8').replace(/\0/g, '<NUL>'));
  ws.close();
  process.exit(0);
});
ws.on('error', e => console.error('ERR:', e.message));
