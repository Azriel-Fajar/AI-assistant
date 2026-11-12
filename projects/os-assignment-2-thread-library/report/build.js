// Builds the assignment report PDF.
// 1. Compiles and runs every program, so the report shows the real code and real output.
// 2. Checks the output matches what the report text claims.
// 3. Fills report.template.html and prints it to PDF with Playwright.
// Run from anywhere: node projects/os-assignment-2-thread-library/report/build.js

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('@playwright/test');

const SRC = path.resolve(__dirname, '..');
const BIN = fs.mkdtempSync(path.join(os.tmpdir(), 'os-a2-'));
const HTML = path.join(__dirname, 'report.html');
const PDF = path.join(SRC, 'Task_2_Thread_Library_672025121.pdf');

const programs = [
  { name: '0_pthread', file: '0_pthread.c', cc: 'gcc', std: 'c23', extra: ['-pthread'] },
  { name: '1_winapi_thread', file: '1_winapi_thread.c', cc: 'gcc', std: 'c23', extra: [] },
  { name: '2_std_thread', file: '2_std_thread.cpp', cc: 'g++', std: 'c++23', extra: [] },
];

const EXPECTED = ['Hello from the Main Thread!', 'Hello from Worker Thread #1!', 'Worker thread returned: 10'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const KEYWORDS = /^(void|int|if|return|const|auto|sizeof|NULL)$/;

// Tiny C/C++ highlighter: comments, strings, #include, keywords, numbers
function highlight(line) {
  const re = /(\/\/.*$)|("(?:\\.|[^"\\])*")|(#include\s*<[^>]*>)|([A-Za-z_]\w*)|(\d+\b)/g;
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

function codeBlock(file) {
  const lines = fs.readFileSync(path.join(SRC, file), 'utf8').replace(/\r/g, '').trimEnd().split('\n');
  const body = lines.map((l, i) => `<span class="ln">${i + 1}</span>${highlight(l)}`).join('\n');
  return `<div class="code"><div class="code-head">${file}</div><pre>${body}</pre></div>`;
}

function termBlock(text) {
  return `<div class="term"><div class="term-head">Terminal (PowerShell)</div><pre>${esc(text)}</pre></div>`;
}

function check(ok, msg) {
  if (!ok) throw new Error('Output check failed: ' + msg);
  console.log('  check OK: ' + msg);
}

const fill = {};
fill['gcc'] = execFileSync('gcc', ['--version'], { encoding: 'utf8' }).split('\n')[0].trim();

for (const p of programs) {
  const exe = path.join(BIN, `${p.name}.exe`);
  execFileSync(p.cc, [`-std=${p.std}`, path.join(SRC, p.file), '-o', exe, ...p.extra]);
  console.log(`built ${p.name}`);

  const run = () => execFileSync(exe, { encoding: 'utf8' }).replace(/\r/g, '');
  const out = run();
  const lines = out.trimEnd().split('\n');
  check(lines.length === 3 && EXPECTED.every((l) => lines.includes(l)), `${p.name} prints the 3 expected lines`);
  check(lines[2] === 'Worker thread returned: 10', `${p.name} returns 10 from the worker thread`);
  check(lines[0] === 'Hello from the Main Thread!', `${p.name} main printed first`);
  for (let r = 0; r < 4; r++) {
    const again = run().trimEnd().split('\n');
    check(again[2] === 'Worker thread returned: 10', `${p.name} extra run ${r + 2} also returns 10`);
    check(again[0] === 'Hello from the Main Thread!', `${p.name} extra run ${r + 2} main printed first`);
  }

  const term = `> ${p.cc} -std=${p.std} ${p.file} -o ${p.name}${p.extra.map((e) => ' ' + e).join('')}\n> .\\${p.name}.exe\n${out}`;
  fill[`code:${p.name}`] = codeBlock(p.file);
  fill[`output:${p.name}`] = termBlock(term.trimEnd());
}

// Program 2 needs C++, because this compiler has no C11 <threads.h>. Prove it.
const probe = path.join(BIN, 'probe.c');
fs.writeFileSync(probe, '#include <threads.h>\nint main(void) { return 0; }\n');
let probeErr = '';
try {
  execFileSync('gcc', ['-std=c23', probe, '-o', path.join(BIN, 'probe.exe')], { stdio: 'pipe' });
} catch (e) {
  probeErr = e.stderr.toString();
}
check(/threads\.h: No such file or directory/.test(probeErr), 'gcc has no <threads.h> (C11 threads unavailable)');

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
