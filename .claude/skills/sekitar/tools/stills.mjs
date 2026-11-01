// Render chosen moments to a board, without rendering the video. Used for the look and storyboard check-ins.
//   node stills.mjs <project> <slug> <out.jpg> [seconds,comma,separated | every=3] [--scale=0.25] [--cols=8]
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [project, slug, outFile, spec = 'every=3', ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, '').split('=')));
// Remotion caches its 120 MB browser in the working directory; keep that in the project, never a repo.
process.chdir(project);
const scale = Number(opt.scale ?? 0.25);
const cols = Number(opt.cols ?? 8);
const require = createRequire(path.join(project, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderStill, openBrowser } = require('@remotion/renderer');

const serveUrl = await bundle({ entryPoint: path.join(project, 'src', 'index.ts'), publicDir: path.join(project, 'public') });
const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'swiftshader' } });
const composition = await selectComposition({ serveUrl, id: slug, puppeteerInstance: browser });
const fps = composition.fps;
const dur = composition.durationInFrames / fps;
const times = spec.startsWith('every=')
  ? Array.from({ length: Math.floor(dur / Number(spec.slice(6))) + 1 }, (_, i) => i * Number(spec.slice(6)))
  : spec.split(',').map(Number);

const tmp = fs.mkdtempSync(path.join(path.dirname(outFile), '_stills_'));
const t0 = Date.now();
for (let i = 0; i < times.length; i++) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(times[i] * fps));
  await renderStill({
    composition, serveUrl, frame, scale, imageFormat: 'jpeg', jpegQuality: 88,
    output: path.join(tmp, `f${String(i).padStart(3, '0')}.jpg`),
    puppeteerInstance: browser, chromiumOptions: { gl: 'swiftshader' },
  });
}
await browser.close({ silent: true });
const rows = Math.ceil(times.length / cols);
const pad = String(Math.max(1, rows));
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.join(tmp, 'f%03d.jpg'), '-vf', `tile=${cols}x${pad}:padding=6:color=white`, '-frames:v', '1', '-q:v', '3', outFile]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${times.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s (${((Date.now() - t0) / times.length / 1000).toFixed(2)} s/frame at scale ${scale}) -> ${outFile}`);
console.log('order:', times.join(', '));
