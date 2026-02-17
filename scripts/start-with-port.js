/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Function to parse .env files
function getPortFromEnv() {
    const envPaths = ['.env.local', '.env'];
    for (const envFile of envPaths) {
        const fullPath = path.join(process.cwd(), envFile);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const match = content.match(/^PORT=(\d+)/m);
            if (match) return match[1];
        }
    }
    return '3000'; // Default port
}

const port = getPortFromEnv();
const command = process.argv[2] || 'dev'; // 'dev' or 'start' or 'build'

console.log(`> Starting Next.js on port ${port}...`);

const nextProcess = spawn('npx', ['next', command, '-p', port], {
    stdio: 'inherit',
    shell: true
});

nextProcess.on('exit', (code) => {
    process.exit(code || 0);
});
