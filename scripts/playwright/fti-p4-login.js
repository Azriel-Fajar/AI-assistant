const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 880 } });
  const page = await ctx.newPage();
  const log = (m) => console.log(m);

  await page.goto('http://127.0.0.1:5601', { waitUntil: 'load' });
  await page.waitForTimeout(6500);
  await page.mouse.click(387, 16); // skip onboarding
  await page.waitForTimeout(1800);
  await page.mouse.click(378, 842); // profile tab
  await page.waitForTimeout(1500);
  await page.mouse.click(210, 471); // Masuk/Daftar button
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/fti-p4-auth.png' });

  // Type into the focused Flutter text inputs. Tap first field region then type.
  // Auth screen layout unknown precisely; tap upper-middle for email field.
  await page.mouse.click(210, 320);
  await page.waitForTimeout(400);
  await page.keyboard.type('user1@example.com', { delay: 30 });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  await page.keyboard.type('password', { delay: 30 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/fti-p4-auth-filled.png' });

  // Submit: press Enter, then also try tapping a button near bottom.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/fti-p4-after-login.png' });
  log('done');
  await browser.close();
})();
