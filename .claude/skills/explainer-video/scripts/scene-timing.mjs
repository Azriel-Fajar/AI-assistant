#!/usr/bin/env node
// Align an explainer script to a voiceover's word-level transcript.
//
// Script format (script.md): scenes separated by blank lines. Optional first line
// "# <scene-id>". Keywords to animate on are wrapped in [brackets].
//
//   # data
//   Rahasianya, AI belajar dari [data].
//
// Transcript: kit format { audio_duration_secs, words: [{ text, start, end }] }
// (scripts/transcribe-whisper.py or transcribe-elevenlabs.mjs).
//
// Usage: node scene-timing.mjs <script.md> <transcript.json> [--out scenes.json] [--tail 1.2]
// Writes scenes.json + scenes.js (window.SCENES = same object): { duration, scenes: [{ id, start, end, speechStart, keys: [{ word, time }], words: [[w, t]] }],
//                       captions: [{ text, start, end, keys }], unmatched }
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i === -1 ? def : args[i + 1]; };
const [scriptPath, transcriptPath] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!scriptPath || !transcriptPath) {
  console.error("usage: node scene-timing.mjs <script.md> <transcript.json> [--out scenes.json] [--tail 1.2]");
  process.exit(1);
}
const out = resolve(opt("--out", join(dirname(resolve(transcriptPath)), "scenes.json")));
const tail = Number(opt("--tail", 1.2));

const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const close = (a, b) => {
  if (a === b) return true;
  if (a.length >= 3 && b.length >= 3 && (a.startsWith(b) || b.startsWith(a))) return true;
  if (Math.min(a.length, b.length) < 4 || Math.abs(a.length - b.length) > 1) return false;
  let diff = 0; // edit distance <= 1
  for (let i = 0, j = 0; i < a.length || j < b.length; i++, j++) {
    if (a[i] === b[j]) continue;
    if (++diff > 1) return false;
    if (a.length > b.length) j--; else if (b.length > a.length) i--;
  }
  return true;
};

// ---- parse script ----
const blocks = readFileSync(scriptPath, "utf8").replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
const tokens = []; // { text, n, key, scene }
const scenes = blocks.map((block, s) => {
  let lines = block.split("\n");
  const id = lines[0].startsWith("#") ? lines.shift().replace(/^#+\s*/, "").trim() : `scene-${s + 1}`;
  for (const raw of lines.join(" ").split(/\s+/).filter(Boolean)) {
    const key = /\[.+\]/.test(raw);
    const text = raw.replace(/[[\]]/g, "");
    if (norm(text)) tokens.push({ text, n: norm(text), key, scene: s });
  }
  return { id };
});

// ---- align (greedy, small lookahead) ----
const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
const words = transcript.words.filter((w) => (w.type ? w.type === "word" : true) && norm(w.text));
let p = 0;
for (const t of tokens) {
  for (let k = p; k < Math.min(words.length, p + 8); k++) {
    if (close(t.n, norm(words[k].text))) { t.start = words[k].start; t.end = words[k].end; p = k + 1; break; }
  }
}
const unmatched = tokens.filter((t) => t.start === undefined).length;
// interpolate unmatched tokens between matched neighbours
tokens.forEach((t, i) => {
  if (t.start !== undefined) return;
  const prev = tokens.slice(0, i).reverse().find((x) => x.start !== undefined);
  const next = tokens.slice(i + 1).find((x) => x.start !== undefined);
  t.start = prev ? prev.end : 0;
  t.end = next ? next.start : t.start + 0.3;
});

// ---- scenes ----
const lastEnd = Math.max(...tokens.map((t) => t.end));
const duration = +Math.max(lastEnd + tail, transcript.audio_duration_secs || 0).toFixed(2);
scenes.forEach((sc, s) => {
  const own = tokens.filter((t) => t.scene === s);
  sc.speechStart = own[0].start;
  sc.keys = own.filter((t) => t.key).map((t) => ({ word: t.text.replace(/[^\p{L}\p{N}-]/gu, ""), time: t.start }));
  sc.words = own.map((t) => [t.n, +t.start.toFixed(2)]); // anchor any word: [normalized, start]
});
scenes.forEach((sc, s) => {
  sc.start = s === 0 ? 0 : sc.speechStart;
  sc.end = s < scenes.length - 1 ? scenes[s + 1].speechStart : duration;
});

// ---- captions: 2-4 words, break after punctuation, never across scenes ----
const captions = [];
scenes.forEach((sc, s) => {
  let group = [];
  const flush = () => { if (group.length) captions.push(group); group = []; };
  for (const t of tokens.filter((x) => x.scene === s)) {
    group.push(t);
    if (group.length === 4 || (/[,.?!:;]$/.test(t.text) && group.length >= 2)) flush();
  }
  flush();
});
const capOut = captions.map((g, i) => ({
  text: g.map((t) => t.text).join(" "),
  start: g[0].start,
  end: i < captions.length - 1 && captions[i + 1][0].scene === g[0].scene ? captions[i + 1][0].start : g.at(-1).end + 0.25,
  keys: g.filter((t) => t.key).map((t) => t.text.replace(/[^\p{L}\p{N}-]/gu, "")),
}));

const r2 = (x) => +x.toFixed(2);
const result = {
  duration,
  scenes: scenes.map(({ id, start, end, speechStart, keys, words }) => ({ id, start: r2(start), end: r2(end), speechStart: r2(speechStart), keys: keys.map((k) => ({ word: k.word, time: r2(k.time) })), words })),
  captions: capOut.map((c) => ({ ...c, start: r2(c.start), end: r2(c.end) })),
  unmatched,
};
writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
// same data for the composition: <script src="scenes.js"></script> -> window.SCENES
writeFileSync(out.replace(/\.json$/, "") + ".js", `window.SCENES = ${JSON.stringify(result)};\n`);

console.log(`duration ${duration}s | ${scenes.length} scenes | ${capOut.length} captions | unmatched ${unmatched}/${tokens.length} words`);
for (const sc of result.scenes) console.log(`  ${sc.id.padEnd(14)} ${sc.start.toFixed(2)}-${sc.end.toFixed(2)}  keys: ${sc.keys.map((k) => `${k.word}@${k.time}`).join(", ") || "-"}`);
if (unmatched / tokens.length > 0.15) console.log("WARNING: >15% of script words not found in the voiceover. Check the VO matches the script.");
console.log(out);
