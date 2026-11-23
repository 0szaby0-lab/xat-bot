const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Szaby/.gemini/antigravity/brain/f560c2be-b920-44f5-9dcd-2c022df07967/.system_generated/logs/transcript.jsonl')
});

rl.on('line', line => {
  if (line.includes('"step_index":59,') || line.includes('"step_index":84,')) {
    try {
      const obj = JSON.parse(line);
      console.log('STEP', obj.step_index, ':\n', obj.content);
    } catch {}
  }
});
