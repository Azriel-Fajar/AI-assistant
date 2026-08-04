// Render the 8 Merdeka ad masters (2 angles x 4 ratios) for Azriel's own MERDEKA10 copy.
// Serialized: concurrent Remotion renders collide and silently kill each other while exiting 0.
// Output: out/merdeka/Merdeka-<ANGLE>-<RATIO>.mp4

import { execSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const RATIOS = ["9x16", "4x5", "1x1", "16x9"];
const ids = ["M1", "M2"].flatMap((a) => RATIOS.map((r) => `Merdeka-${a}-${r}`));

mkdirSync(join("out", "merdeka"), { recursive: true });
console.log(`Rendering ${ids.length} ad masters\n`);

const failed = [];
for (const id of ids) {
  const out = join("out", "merdeka", `${id}.mp4`);
  console.log(`-> ${id}`);
  try {
    execSync(`npx remotion render ${id} "${out}" --log=error`, { stdio: "inherit" });
  } catch {
    failed.push(id);
    continue;
  }
  if (!existsSync(out) || statSync(out).size < 100_000) failed.push(`${id} (missing or truncated)`);
}

console.log(`\n${ids.length - failed.length}/${ids.length} rendered under out/merdeka/`);
if (failed.length) {
  console.error("FAILED:");
  for (const f of failed) console.error(`  ${f}`);
  process.exit(1);
}
