// Batch-render the Merdeka ad for each referral code.
// Usage:
//   node render-merdeka-referrals.mjs            -> all codes in CODES below
//   node render-merdeka-referrals.mjs BRY10 YEZ10 -> only the codes you pass
// Output: out/merdeka/<CODE>/{reel-9x16,feed-4x5}.mp4
//
// Overrides the on-screen `code` via --props. VO is code-agnostic (it says
// "pakai kodenya", never the code itself), so one audio set covers every friend.
// Renders are serialized on purpose: concurrent Remotion renders collide and
// silently kill each other mid-batch while still exiting 0.

import { execSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const CODES = ["SIDE07", "NAND24", "FRED14", "CYN10", "YEZ10", "BRY10", "LIN10", "CAL10"];

// Friends post to Story/Reels/WA (9x16) and feed (4x5). Landscape is ads-only.
const ASSETS = [
  { id: "Merdeka-M1-9x16", file: "reel-9x16.mp4" },
  { id: "Merdeka-M1-4x5", file: "feed-4x5.mp4" },
];

const codes = process.argv.slice(2).length ? process.argv.slice(2) : CODES;
const expected = codes.length * ASSETS.length;

console.log(`Rendering ${ASSETS.length} assets x ${codes.length} codes = ${expected} videos\n`);

const failed = [];

for (const code of codes) {
  const dir = join("out", "merdeka", code);
  mkdirSync(dir, { recursive: true });
  for (const a of ASSETS) {
    const out = join(dir, a.file);
    const props = JSON.stringify({ code });
    console.log(`-> ${code} / ${a.file}`);
    try {
      execSync(`npx remotion render ${a.id} "${out}" --props=${JSON.stringify(props)} --log=error`, {
        stdio: "inherit",
      });
    } catch {
      failed.push(`${code}/${a.file}`);
      continue;
    }
    // Exit 0 is not proof a render survived. Check the file is real.
    if (!existsSync(out) || statSync(out).size < 100_000) {
      failed.push(`${code}/${a.file} (missing or truncated)`);
    }
  }
}

const ok = expected - failed.length;
console.log(`\n${ok}/${expected} rendered under out/merdeka/`);
if (failed.length) {
  console.error("FAILED:");
  for (const f of failed) console.error(`  ${f}`);
  process.exit(1);
}
