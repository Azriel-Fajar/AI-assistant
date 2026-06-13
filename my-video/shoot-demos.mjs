import { chromium } from "playwright-core";
import { execSync } from "child_process";

const demos = [
  { slug: "restaurant-cafe", out: "public/demo-cafe.png" },
  { slug: "beauty-salon", out: "public/demo-salon.png" },
  { slug: "gym-fitness", out: "public/demo-gym.png" },
];

// locate installed chromium from root @playwright/test
const exe = execSync("node -e \"console.log(require('playwright-core').chromium.executablePath())\"", {
  cwd: "../",
}).toString().trim();

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 2 });

for (const d of demos) {
  const url = `https://rielcode.com/demos/${d.slug}/`;
  await page.goto(url, { waitUntil: "load", timeout: 60000 });

  // scroll through whole page to trigger lazy-loaded images / reveal animations
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  // back to top, let hero settle
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  // wait for all images decoded
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) =>
        img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
      )
    );
  });
  await page.waitForTimeout(800);

  await page.screenshot({ path: d.out, fullPage: true });
  console.log("shot", d.out);
}

await browser.close();
