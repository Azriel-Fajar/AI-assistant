// Batch-render the 4 launch assets for each referral code.
// Usage:
//   node render-referrals.mjs                 -> renders all codes in CODES below
//   node render-referrals.mjs RIEL-ANDI FOO12 -> renders only the codes you pass
// Output: out/referrals/<CODE>/{reel,feed,story,wa}.mp4
//
// Reuses the Launch-* compositions, overriding the on-screen `code` via --props.
// VO (vo-launch-*.mp3) is shared and code-agnostic, so no per-code audio needed.

import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

// Referral codes from the admin panel. Edit this list as codes change.
const CODES = ["SIDE07", "NAND24", "FRED14", "CYN10", "YEZ10", "BRY10", "LIN10", "CAL10"];

// composition id -> output filename
const ASSETS = [
  { id: "Launch-Reel-9x16", file: "reel-9x16.mp4" },
  { id: "Launch-Feed-4x5", file: "feed-4x5.mp4" },
  { id: "Launch-Story-9x16", file: "story-9x16.mp4" },
  { id: "Launch-WA-9x16", file: "wa-9x16.mp4" },
];

const codes = process.argv.slice(2).length ? process.argv.slice(2) : CODES;

console.log(`Rendering ${ASSETS.length} assets x ${codes.length} codes = ${ASSETS.length * codes.length} videos\n`);

for (const code of codes) {
  const dir = join("out", "referrals", code);
  mkdirSync(dir, { recursive: true });
  for (const a of ASSETS) {
    const out = join(dir, a.file);
    const props = JSON.stringify({ code });
    console.log(`-> ${code} / ${a.file}`);
    execSync(
      `npx remotion render ${a.id} "${out}" --props=${JSON.stringify(props)} --log=error`,
      { stdio: "inherit" }
    );
  }
  console.log(`   done: ${dir}\n`);
}

console.log("All referral videos rendered under out/referrals/");
