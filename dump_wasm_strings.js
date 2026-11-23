'use strict';
const fs = require('fs');

const buf = fs.readFileSync('xath_xatcorewasm.wasm');
const str = buf.toString('latin1');

// Match printable ASCII sequences of length >= 4
const ascii = str.match(/[\x20-\x7E]{4,}/g) || [];

const xml = ascii.filter(s => s.startsWith('<') && s.includes('>'));
console.log('--- XML STRINGS IN WASM ---');
console.log(Array.from(new Set(xml)).slice(0, 100).join('\n'));

const settings = ascii.filter(s => s.toLowerCase().includes('nick') || s.toLowerCase().includes('avatar') || s.toLowerCase().includes('name'));
console.log('\n--- NICK/NAME/AVATAR STRINGS ---');
console.log(Array.from(new Set(settings)).slice(0, 50).join('\n'));
