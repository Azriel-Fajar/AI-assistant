const { test, expect } = require('@playwright/test');

test('smoke: example.com loads', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
