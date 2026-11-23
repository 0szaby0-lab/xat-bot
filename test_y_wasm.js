const fs = require('fs');
const path = require('path');

const wasmCode = fs.readFileSync('xath_xatcorewasm.js', 'utf8');
const wasmBinary = fs.readFileSync('xath_xatcorewasm.wasm');

global.window = {
    location: {
        host: 'xath.hu',
        hostname: 'xath.hu',
        origin: 'https://xath.hu',
        href: 'https://xath.hu/chat'
    },
    navigator: { userAgent: 'Mozilla/5.0' }
};

const Module = {
    wasmBinary,
    onAbort: (m) => console.log('ABORT:', m)
};

eval(wasmCode);

function SendC(func, p1 = '', p2 = '') {
    const l1 = (func.length * 2 + 1) * 2, ptr1 = Module._malloc(l1); Module.stringToUTF8(func, ptr1, l1);
    const l2 = (p1.length * 2 + 1) * 2, ptr2 = Module._malloc(l2); Module.stringToUTF8(p1, ptr2, l2);
    const l3 = (p2.length * 2 + 1) * 2, ptr3 = Module._malloc(l3); Module.stringToUTF8(p2, ptr3, l3);
    const resPtr = Module.ccall('cToC', null, ['number', 'number', 'number'], [ptr1, ptr2, ptr3]);
    let ret = '';
    if (resPtr) {
        let end = resPtr;
        while (Module.HEAPU8[end] !== 0) end++;
        ret = Buffer.from(Module.HEAPU8.subarray(resPtr, end)).toString('utf8');
        if (Module._xFree) Module._xFree(resPtr);
    }
    return ret;
}

// Emulate activity initialization
console.log('xatInit:', SendC('xatInit', '', ''));
console.log('CONNECT_OK:', SendC('xatMessageReceived', '#CONNECT_OK', ''));
console.log('CONNECT_CHECK:', SendC('xatMessageOK', '#CONNECT_CHECK', Buffer.from('xat.com').toString('base64')));

// Test real challenge packet:
const realY = '<y I="32750" i="43923035" c="1795300667" cb="147" p="7866276525659,1" k="32750" t="10000" s="41" e="4213428468" />';
console.log('Testing realY...');
const res1 = SendC('xatMessageReceived', '#MESSAGE', Buffer.from(realY).toString('base64'));
console.log('Result on realY:', res1);

// Now test local challenge packet:
const localY = '<y I="32654" i="12345678" c="1795386179" cb="147" p="57878238499501,1" k="32654" t="10022" s="40" e="2815963999" />';
console.log('Testing localY...');
const res2 = SendC('xatMessageReceived', '#MESSAGE', Buffer.from(localY).toString('base64'));
console.log('Result on localY:', res2);

// Check if any outgoing tick/message was generated
for (let i = 0; i < 5; i++) {
    const tick = SendC('xatTick', '', '');
    if (tick) console.log('TICK ' + i + ':', tick);
}
