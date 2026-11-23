const { execSync } = require('child_process');
const out = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV /NH').toString();
for (const line of out.split('\n')) {
    const parts = line.split(',');
    if (parts.length >= 2) {
        const pid = parseInt(parts[1].replace(/"/g, '').trim(), 10);
        if (pid && pid !== process.pid && pid !== 4244 && pid !== 7740) {
            try {
                process.kill(pid, 'SIGKILL');
                console.log('Killed node PID:', pid);
            } catch (_) {}
        }
    }
}
