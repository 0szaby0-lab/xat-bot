const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetZip = 'C:/Users/Szaby/Downloads/xat_bot.zip';
if (fs.existsSync(targetZip)) {
    fs.unlinkSync(targetZip);
}

console.log('Packaging ONLY xat-bot directory...');
execSync(`powershell -Command "Compress-Archive -Path 'C:/Users/Szaby/Downloads/xat-bot/*' -DestinationPath '${targetZip}' -CompressionLevel Optimal"`, { stdio: 'inherit' });

const stat = fs.statSync(targetZip);
console.log(`[ZIP SUCCESS] Created ${targetZip} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
