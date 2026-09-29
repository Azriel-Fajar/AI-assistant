// Builds the assignment report PDF.
// 1. Compiles and runs every program, so the report shows the real code and real output.
// 2. Checks the output matches what the report text claims.
// 3. Fills report.template.html and prints it to PDF with Playwright.
// Run from anywhere: node projects/os-assignment-1-thread/report/build.js

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('@playwright/test');

const SRC = path.resolve(__dirname, '..');
const BIN = fs.mkdtempSync(path.join(os.tmpdir(), 'os-a1-'));
const HTML = path.join(__dirname, 'report.html');
const PDF = path.join(SRC, 'Task_1_Thread_Multithreading_672025121.pdf');

const programs = [
  { name: '1_thread', std: 'c++20', runs: 1 },
  { name: '2_mutex', std: 'c++20', runs: 3 },
  { name: '3_semaphore', std: 'c++20', runs: 1 },
  { name: '4_coroutine', std: 'c++23', runs: 1 },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const KEYWORDS = /^(void|int|for|while|if|return|const|auto|using|namespace|co_yield)$/;

// Tiny C++ highlighter: comments, strings, #include, keywords, numbers
function highlight(line) {
  const re = /(\/\/.*$)|("(?:\\.|[^"\\])*")|(#include\s*<[^>]*>)|([A-Za-z_]\w*)|(\d+(?:ms|s)?\b)/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(line))) {
    const t = m[0];
    out += esc(line.slice(last, m.index));
    if (m[1]) out += `<span class="c">${esc(t)}</span>`;
    else if (m[2]) out += `<span class="s">${esc(t)}</span>`;
    else if (m[3]) out += `<span class="p">${esc(t)}</span>`;
    else if (m[4]) out += KEYWORDS.test(t) ? `<span class="k">${t}</span>` : t;
    else out += `<span class="n">${t}</span>`;
    last = m.index + t.length;
  }
  return out + esc(line.slice(last));
}

function codeBlock(name) {
  const lines = fs.readFileSync(path.join(SRC, `${name}.cpp`), 'utf8').replace(/\r/g, '').trimEnd().split('\n');
  const body = lines.map((l, i) => `<span class="ln">${i + 1}</span>${highlight(l)}`).join('\n');
  return `<div class="code"><div class="code-head">${name}.cpp</div><pre>${body}</pre></div>`;
}

function termBlock(text) {
  return `<div class="term"><div class="term-head">Terminal (PowerShell)</div><pre>${esc(text)}</pre></div>`;
}

function check(ok, msg) {
  if (!ok) throw new Error('Output check failed: ' + msg);
  console.log('  check OK: ' + msg);
}

const fill = {};
fill['gxx'] = execFileSync('g++', ['--version'], { encoding: 'utf8' }).split('\n')[0].trim();

for (const p of programs) {
  const exe = path.join(BIN, `${p.name}.exe`);
  execFileSync('g++', [`-std=${p.std}`, path.join(SRC, `${p.name}.cpp`), '-o', exe]);
  console.log(`built ${p.name}`);

  let term = `> g++ -std=${p.std} ${p.name}.cpp -o ${p.name}\n`;
  const outs = [];
  for (let r = 0; r < p.runs; r++) {
    const start = Date.now();
    const out = execFileSync(exe, { encoding: 'utf8' }).replace(/\r/g, '');
    p.seconds = (Date.now() - start) / 1000;
    outs.push(out);
    term += `> .\\${p.name}.exe\n${out}`;
  }
  p.outs = outs;
  fill[`code:${p.name}`] = codeBlock(p.name);
  fill[`output:${p.name}`] = termBlock(term.trimEnd());
}

// Checks for every claim the report text makes about the output
const [thread, mutex, sem, coro] = programs;

check(thread.seconds < 2.5, `program 1 ran in ${thread.seconds.toFixed(2)} s (parallel, not ~3 s)`);
fill['time:1_thread'] = `${thread.seconds.toFixed(2)} s`;

const lost = [];
for (const out of mutex.outs) {
  const bad = Number(out.match(/Without mutex: (\d+)/)[1]);
  const good = Number(out.match(/With mutex:\s+(\d+)/)[1]);
  check(bad < 2000000, `without mutex = ${bad} (lost ${2000000 - bad})`);
  check(good === 2000000, `with mutex = ${good}`);
  lost.push(2000000 - bad);
}
const bads = mutex.outs.map((o) => o.match(/Without mutex: (\d+)/)[1]);
check(new Set(bads).size === bads.length, 'without-mutex result differs every run');
fill['lost:2_mutex'] = `${Math.min(...lost).toLocaleString('en-US')} and ${Math.max(...lost).toLocaleString('en-US')}`;

let parked = 0;
let maxParked = 0;
for (const line of sem.outs[0].split('\n')) {
  if (line.endsWith('PARKED')) parked++;
  if (line.endsWith('leaving')) parked--;
  maxParked = Math.max(maxParked, parked);
}
check(maxParked === 2, `max cars parked at once = ${maxParked}`);

const coroAgain = execFileSync(path.join(BIN, '4_coroutine.exe'), { encoding: 'utf8' }).replace(/\r/g, '');
check(coroAgain === coro.outs[0], 'coroutine output identical on a second run');

// Fill the template
let html = fs.readFileSync(path.join(__dirname, 'report.template.html'), 'utf8');
html = html.replace(/\{\{([\w:]+)\}\}/g, (_, key) => {
  if (!(key in fill)) throw new Error('No value for placeholder ' + key);
  return fill[key];
});
fs.writeFileSync(HTML, html, 'utf8');
fs.rmSync(BIN, { recursive: true, force: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + HTML);
  await page.pdf({
    path: PDF,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:9px;width:100%;text-align:center;color:#64748b;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log('PDF done: ' + PDF);
})();
