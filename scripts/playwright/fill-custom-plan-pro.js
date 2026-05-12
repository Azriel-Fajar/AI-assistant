const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();
    await page.goto('http://localhost/rielcode/custom-plan/', { waitUntil: 'networkidle' });

    // 5 pages (Pro cap range: 2-5)
    await page.evaluate(() => window.cpSetPages(5));
    await page.waitForTimeout(400);

    // Enable CMS
    await page.evaluate(() => {
        const cb = document.getElementById('feat-cms');
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(400);

    // Standard CMS (1.4M) → 5 pages + std CMS + 1mo maint = 2540k > 2499k cap (saves 41k < 300k limit)
    await page.evaluate(() => {
        const r = document.querySelector('input[name="cms-diff"][value="1400000"]');
        r.checked = true;
        r.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(400);

    // 1 month maintenance to push total just above Pro cap
    await page.evaluate(() => window.cpStep('maintenance', 1));
    await page.waitForTimeout(600);

    // Verify cap badge
    const badgeText = await page.locator('#plan-cap-badge').textContent();
    const totalHTML = await page.locator('#summary-total').innerHTML();
    console.log('Total:', totalHTML);
    console.log('Cap badge:', badgeText);

    // Scroll to form
    await page.evaluate(() => window.scrollToOrderForm());
    await page.waitForTimeout(800);

    // Fill contact details
    await page.fill('#cf-nama', 'Test User');
    await page.fill('#cf-email', 'test@rielcode.com');
    await page.fill('#cf-phone', '081289328493');

    await page.locator('.cp-submit-btn').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Submit
    await page.click('button[name="submit"]');

    // Wait for checkout
    await page.waitForURL('**/checkout/**', { timeout: 15000 });
    console.log('Checkout URL:', page.url());

    // Keep open for 2 min for manual inspection
    await page.waitForTimeout(120000);
    await browser.close();
})();
