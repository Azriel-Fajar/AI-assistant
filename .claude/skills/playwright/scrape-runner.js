#!/usr/bin/env node
// Helper: executes a generated scrape script and pipes stdout.
// Usage: node scrape-runner.js <script-path>
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = process.argv[2];
if (!scriptPath) {
  console.error('Usage: node scrape-runner.js <script-path>');
  process.exit(1);
}

const child = spawn(process.execPath, [path.resolve(scriptPath)], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..', '..', '..'),
});

child.on('exit', (code) => process.exit(code ?? 1));
