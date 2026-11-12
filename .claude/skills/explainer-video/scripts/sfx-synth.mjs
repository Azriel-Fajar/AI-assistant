#!/usr/bin/env node
// Code-made SFX track synced to a composition's own animation.
// The composition logs events to window.__sfxEvents (theme helpers + Motion recipes do this):
//   { type, t, dur?, gain?, strong? }
// This tool loads index.html in headless Chromium, reads the log and synthesizes a 48 kHz
// stereo WAV the length of the video. Deterministic: seeded noise, no sample files.
//
// Voices: chalk pen tap erase swish whoosh blip hit riser drop pop glitch typing stamp ping tick chime
//
// Usage (run from video-studio/, Playwright comes from its node_modules):
//   node ../.claude/skills/explainer-video/scripts/sfx-synth.mjs <project-dir> --duration <s> [--out assets/sfx.wav]
import { writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const { chromium } = createRequire(join(process.cwd(), "package.json"))("playwright");

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const dir = resolve(args[0] ?? ".");
const duration = Number(opt("--duration", NaN));
if (!Number.isFinite(duration)) { console.error("usage: sfx-synth.mjs <project-dir> --duration <seconds> [--out assets/sfx.wav]"); process.exit(1); }
const out = resolve(dir, opt("--out", "assets/sfx.wav"));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(join(dir, "index.html")).href);
const events = await page.evaluate(() => window.__sfxEvents || []);
await browser.close();

// ---- DSP helpers ----
const SR = 48000, N = Math.ceil(duration * SR), buf = new Float32Array(N);
let seed = 0x2f6b1d;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rand() * 2 - 1;
// state-variable filter: fc may change every sample (for sweeps)
function svf(q = 1) { let lp = 0, bp = 0; return (x, fc) => { const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR); lp += f * bp; const hp = x - lp - bp / q; bp += f * hp; return { lp, bp, hp }; }; }
const env = (t, dur, atk, rel) => Math.max(0, Math.min(1, t / atk, (dur - t) / rel));
// write voice fn(t) -> sample for `dur` seconds starting at t0
let G = 1; // per-event gain (e.gain), applied by add()
function add(t0, dur, gain, fn) { const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR); for (let i = 0; i < n && s0 + i < N; i++) if (s0 + i >= 0) buf[s0 + i] += fn(i / SR) * gain * G; }
const sine = (f, t) => Math.sin(2 * Math.PI * f * t);

const voices = {
  chalk(e) { // gritty scrape with stroke rhythm + crackle
    const b = svf(1.1), s = svf(3), fc = 2600 + rand() * 800, rate = 6 + rand() * 5, ph = rand() * 6.28;
    add(e.t, e.dur, 0.55, (t) => { const st = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * rate * t + ph)), 0.6); const cr = rand() < 0.004 ? noise() * 3 : 0; return (b(noise(), fc).bp + s(noise(), 5200).bp * 0.25 + cr * 0.15) * st * env(t, e.dur, 0.015, 0.04); });
  },
  pen(e) { // ballpoint: finer, higher, smoother
    const b = svf(1.4), rate = 8 + rand() * 4, ph = rand() * 6.28;
    add(e.t, e.dur, 0.35, (t) => b(noise(), 4400).bp * (0.5 + 0.5 * Math.abs(Math.sin(2 * Math.PI * rate * t + ph))) * env(t, e.dur, 0.01, 0.03));
  },
  tap(e) { const h = svf(0.7), g = e.strong ? 1 : 0.6; add(e.t, 0.08, g, (t) => h(noise(), 3000).bp * Math.exp(-t / 0.006) * 0.9 + sine(180, t) * Math.exp(-t / 0.02) * 0.35); },
  erase(e) { const l = svf(0.6); add(e.t, e.dur, 0.9, (t) => l(noise(), 900).bp * (0.6 + 0.4 * sine(9, t)) * env(t, e.dur, 0.03, 0.06)); },
  swish(e) { const f = svf(1.4), d = e.dur || 0.35; add(e.t, d, 0.6, (t) => f(noise(), 900 + 5000 * (t / d)).bp * Math.sin(Math.PI * t / d)); },
  whoosh(e) { const f = svf(1.2), d = e.dur || 0.7; add(e.t - d * 0.6, d, 0.8, (t) => f(noise(), 250 + 2600 * Math.sin(Math.PI * t / d)).bp * Math.pow(Math.sin(Math.PI * t / d), 2)); },
  blip(e) { add(e.t, 0.09, 0.45, (t) => sine(1400 - 4000 * t, t) * Math.exp(-t / 0.03)); },
  hit(e) { // 808-style: pitch-dropping sine + click, soft clipped
    add(e.t, 0.6, 0.9, (t) => Math.tanh(1.6 * (sine(45 + 75 * Math.exp(-t / 0.04), t) * Math.exp(-t / 0.22) + noise() * Math.exp(-t / 0.004) * 0.4)));
  },
  riser(e) { // ends exactly at e.t + e.dur (place the drop there)
    const f = svf(2), d = e.dur || 1.5;
    add(e.t, d, 0.5, (t) => { const p = t / d; return (f(noise(), 400 + 5600 * p * p).bp * 0.8 + sine(200 + 1000 * p * p, t) * 0.2) * Math.pow(p, 2.2); });
  },
  drop(e) { // sub impact + crash
    const l = svf(0.7);
    add(e.t, 1.4, 1, (t) => Math.tanh(1.4 * (sine(40 + 60 * Math.exp(-t / 0.06), t) * Math.exp(-t / 0.5) + l(noise(), 1800).bp * Math.exp(-t / 0.25) * 0.6)));
  },
  pop(e) { const h = svf(2); add(e.t, 0.07, 0.6, (t) => sine(620 - 3200 * t, t) * Math.exp(-t / 0.02) + h(noise(), 2400).bp * Math.exp(-t / 0.004) * 0.5); },
  glitch(e) { // sample-and-hold noise chopped by fixed gates
    const d = e.dur || 0.25; let held = 0, hold = 0;
    add(e.t, d, 0.4, (t) => { if (hold-- <= 0) { held = noise(); hold = 20 + Math.floor(rand() * 200); } const gate = Math.floor(t * 45) % 3 !== 1 ? 1 : 0; return held * gate * env(t, d, 0.005, 0.02); });
  },
  typing(e) { // key clicks at ~14/s
    const d = e.dur || 0.6, rate = e.rate || 14;
    for (let k = 0; k < d * rate; k++) { const h = svf(2.5), fc = 2200 + rand() * 1800, g = 0.4 + rand() * 0.4, tk = e.t + k / rate + rand() * 0.02; add(tk, 0.03, g, (t) => h(noise(), fc).bp * Math.exp(-t / 0.005)); }
  },
  stamp(e) { const l = svf(0.8); add(e.t, 0.25, 0.9, (t) => sine(90, t) * Math.exp(-t / 0.05) + l(noise(), 700).bp * Math.exp(-t / 0.03) * 0.8); },
  ping(e) { add(e.t, 0.9, 0.3, (t) => (sine(1800, t) + sine(2700, t) * 0.4) * Math.exp(-t / 0.25)); },
  tick(e) { const h = svf(3); add(e.t, 0.03, 0.35, (t) => h(noise(), 3500).bp * Math.exp(-t / 0.004)); },
  chime(e) { add(e.t, 1.2, 0.22, (t) => (sine(880, t) + sine(1320, t) * 0.5 + sine(1760, t) * 0.2) * Math.exp(-t / 0.4) * Math.min(1, t / 0.005)); },
};

// merge overlapping continuous strokes (chalk/pen) so letters become one scrape
const merged = [], counts = {};
for (const type of ["chalk", "pen"]) {
  const list = events.filter((e) => e.type === type).sort((a, b) => a.t - b.t);
  for (const e of list) { const last = merged.findLast((m) => m.type === type); if (last && e.t <= last.t + last.dur + 0.03) last.dur = Math.max(last.dur, e.t + e.dur - last.t); else merged.push({ ...e }); }
}
const all = [...merged, ...events.filter((e) => e.type !== "chalk" && e.type !== "pen")];
const unknown = new Set();
for (const e of all) {
  counts[e.type] = (counts[e.type] || 0) + 1;
  if (!voices[e.type]) { unknown.add(e.type); continue; }
  G = e.gain ?? 1;
  voices[e.type](e);
}

// peak-normalize to -6 dBFS; final level is set by the <audio> data-volume and the master step
const peak = buf.reduce((m, v) => Math.max(m, Math.abs(v)), 1e-9), gain = 0.5 / peak;
const wav = Buffer.alloc(44 + N * 4);
wav.write("RIFF", 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { const v = Math.max(-1, Math.min(1, buf[i] * gain)) * 32767 | 0; wav.writeInt16LE(v, 44 + i * 4); wav.writeInt16LE(v, 46 + i * 4); }
writeFileSync(out, wav);
console.log(`${events.length} events -> ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")} | ${out}`);
if (unknown.size) console.log(`WARNING: no voice for: ${[...unknown].join(", ")}`);
