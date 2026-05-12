// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost/Rielcode';
const SHOT_DIR = path.join(__dirname, '../../screenshots/rielcode-audit');

test.use({
  headless: false,
  launchOptions: { slowMo: 500 },
  viewport: { width: 1280, height: 800 },
});

const notes = {
  consoleErrors: [],
  brokenImages: [],
  formBehavior: [],
  layoutIssues: [],
  misc: [],
};

test.beforeAll(() => {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

function attachConsoleListener(page, label) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      notes.consoleErrors.push(`[${label}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    notes.consoleErrors.push(`[${label}] PAGE ERROR: ${err.message}`);
  });
}

function shot(page, name) {
  return page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: false });
}

// ─── Test 01: Homepage desktop ───────────────────────────────────────────────
test('01 - Homepage desktop: hero, chatbot, CTA, scroll', async ({ page }) => {
  attachConsoleListener(page, 'homepage');

  await page.goto(BASE + '/');
  await expect(page).toHaveTitle(/rielcode/i);
  await shot(page, '01-homepage-hero.png');

  // Hero visible
  const hero = page.locator('.rc-hero, #hero, [class*="hero"]').first();
  if (await hero.count() > 0) {
    await expect(hero).toBeVisible();
    notes.misc.push('Hero section: found and visible');
  } else {
    notes.layoutIssues.push('Hero section: selector not found (.rc-hero, #hero)');
  }

  // Chatbot icon
  const chatbotIcon = page.locator('#chatbot-icon');
  if (await chatbotIcon.count() > 0) {
    await expect(chatbotIcon).toBeVisible();
    notes.misc.push('Chatbot icon #chatbot-icon: visible');
  } else {
    notes.layoutIssues.push('Chatbot icon #chatbot-icon: NOT FOUND');
  }

  // CTA link
  const cta = page.locator('a[href*="order-form"]').first();
  if (await cta.count() > 0) {
    notes.misc.push('CTA link to order-form: found');
  } else {
    notes.layoutIssues.push('CTA link to order-form: NOT FOUND on homepage');
  }

  // Scroll
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(600);
  await shot(page, '01-homepage-scrolled.png');

  // Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
});

// ─── Test 02: Homepage mobile ─────────────────────────────────────────────────
test('02 - Homepage mobile 375x812: burger menu', async ({ page }) => {
  attachConsoleListener(page, 'homepage-mobile');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE + '/');
  await shot(page, '02-mobile-initial.png');

  const burger = page.locator('#rc-burger');
  if (await burger.count() > 0) {
    await expect(burger).toBeVisible();
    await burger.click();
    await page.waitForTimeout(500);
    await shot(page, '02-mobile-menu-open.png');

    const mobileMenu = page.locator('#rc-mnav');
    if (await mobileMenu.count() > 0) {
      notes.misc.push('Mobile nav #rc-mnav: opened successfully');
    } else {
      notes.layoutIssues.push('Mobile nav #rc-mnav: not found after burger click');
    }

    const closeBtn = page.locator('#rc-mnav-close');
    if (await closeBtn.count() > 0 && await closeBtn.isVisible()) {
      await closeBtn.click({ force: true });
      await page.waitForTimeout(400);
      notes.misc.push('Mobile nav close button: works');
    } else {
      notes.layoutIssues.push('Mobile nav close button #rc-mnav-close: not found or not visible');
    }
  } else {
    notes.layoutIssues.push('Burger button #rc-burger: NOT FOUND at 375px width');
  }

  // Scroll mobile
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(600);
  await shot(page, '02-mobile-scrolled.png');

  await page.setViewportSize({ width: 1280, height: 800 });
});

// ─── Test 03: Packages page ───────────────────────────────────────────────────
test('03 - Packages page: count cards, click CTA', async ({ page }) => {
  attachConsoleListener(page, 'packages');

  await page.goto(BASE + '/packages/');
  await shot(page, '03-packages-all.png');

  // Count package cards
  const cards = page.locator('[class*="pkg"], [class*="package"], [class*="plan"], .card').filter({ hasText: /order|get started|mulai/i });
  const cardCount = await cards.count();
  notes.misc.push(`Package cards with CTA found: ${cardCount}`);

  if (cardCount > 0) {
    const firstCTA = cards.first().locator('a, button').last();
    if (await firstCTA.count() > 0) {
      await firstCTA.click();
      await page.waitForTimeout(800);
      const url = page.url();
      if (url.includes('order-form') || url.includes('order')) {
        notes.misc.push('Package CTA → order-form redirect: OK');
      } else {
        notes.layoutIssues.push(`Package CTA clicked but URL is: ${url} (expected order-form)`);
      }
      await shot(page, '03-cta-clicked.png');
      await page.goBack();
      await page.waitForTimeout(500);
    }
  } else {
    // Fallback: find any link to order-form on packages page
    const orderLinks = page.locator('a[href*="order"]');
    const linkCount = await orderLinks.count();
    notes.misc.push(`Order links on packages page (fallback): ${linkCount}`);
    if (linkCount > 0) {
      await orderLinks.first().click();
      await page.waitForTimeout(800);
      await shot(page, '03-cta-clicked.png');
      await page.goBack();
    }
  }
});

// ─── Test 04: Order form ──────────────────────────────────────────────────────
test('04 - Order form: fill fields, block POST', async ({ page }) => {
  attachConsoleListener(page, 'order-form');

  // Intercept POST — return fake 200 so page doesn't hang, no DB write
  await page.route('**/order-form/**', async (route) => {
    if (route.request().method() === 'POST') {
      notes.formBehavior.push('Order form POST intercepted — returned mock 200, no DB write');
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><p>Test intercept — form not submitted</p></body></html>',
      });
    } else {
      await route.continue();
    }
  });

  await page.goto(BASE + '/order-form/');
  await shot(page, '04-order-form-blank.png');

  // Fill name
  const nameField = page.locator('[name="nama"]');
  if (await nameField.count() > 0) {
    await nameField.fill('Playwright Test User');
    notes.formBehavior.push('Name field [name="nama"]: found and filled');
  } else {
    notes.layoutIssues.push('Order form: name field [name="nama"] NOT FOUND');
  }

  // Fill email
  const emailField = page.locator('[name="email"]');
  if (await emailField.count() > 0) {
    await emailField.fill('playwright@test.invalid');
  } else {
    notes.layoutIssues.push('Order form: email field NOT FOUND');
  }

  // Fill phone
  const phoneField = page.locator('[name="phone"]');
  if (await phoneField.count() > 0) {
    await phoneField.fill('081234567890');
  } else {
    notes.layoutIssues.push('Order form: phone field NOT FOUND');
  }

  // Select package — custom-styled radio (hidden input), click label instead
  const starterLabel = page.locator('label[for="starter"]');
  const starterRadio = page.locator('[name="package"][value="Starter Plan"]');
  if (await starterLabel.count() > 0) {
    await starterLabel.click();
    await page.waitForTimeout(400);
    notes.formBehavior.push('Package radio: Starter Plan label clicked');
  } else if (await starterRadio.count() > 0) {
    await starterRadio.check({ force: true });
    await page.waitForTimeout(400);
    notes.formBehavior.push('Package radio: Starter Plan force-checked');
  } else {
    notes.layoutIssues.push('Order form: package field NOT FOUND (tried label + radio)');
  }

  // Tick first addon — checkboxes are custom-styled (appearance:none), use force:true
  const addonCheckbox = page.locator('.addon-item input[type="checkbox"]').first();
  if (await addonCheckbox.count() > 0) {
    await addonCheckbox.check({ force: true });
    notes.formBehavior.push('First addon checkbox: force-checked (custom-styled input)');
  } else {
    notes.layoutIssues.push('Addon checkboxes: none found (.addon-item input[type="checkbox"])');
  }

  await shot(page, '04-order-form-filled.png');

  // Click submit
  const submitBtn = page.locator('[name="submit"], button[type="submit"], input[type="submit"]').first();
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
    await page.waitForTimeout(1000);
    notes.formBehavior.push('Submit clicked — POST was intercepted/aborted');
  } else {
    notes.layoutIssues.push('Order form: submit button NOT FOUND');
  }

  await shot(page, '04-submit-blocked.png');
});

// ─── Test 05: Custom plan builder ────────────────────────────────────────────
test('05 - Custom plan builder: steppers and feature toggles', async ({ page }) => {
  attachConsoleListener(page, 'custom-plan');

  await page.goto(BASE + '/custom-plan/');
  await shot(page, '05-custom-plan-initial.png');

  // Pages stepper +
  const pagesVal = page.locator('#val-pages');
  const plusBtn = page.locator('button').filter({ hasText: '+' }).first();

  if (await plusBtn.count() > 0) {
    await plusBtn.click();
    await page.waitForTimeout(400);
    const val = await pagesVal.textContent().catch(() => null);
    notes.misc.push(`Custom plan pages after +: ${val}`);
  } else {
    notes.layoutIssues.push('Custom plan: + stepper button not found');
  }

  // Quick preset 3 pages
  const preset3 = page.locator('[data-pages="3"]');
  if (await preset3.count() > 0) {
    await preset3.click();
    await page.waitForTimeout(400);
    const val = await pagesVal.textContent().catch(() => null);
    notes.misc.push(`Custom plan pages after preset-3: ${val}`);
  } else {
    notes.layoutIssues.push('Custom plan: [data-pages="3"] preset not found');
  }

  // Toggle features
  const chatbotToggle = page.locator('#feat-chatbot');
  if (await chatbotToggle.count() > 0) {
    await chatbotToggle.click();
    await page.waitForTimeout(300);
    notes.misc.push('Custom plan: chatbot toggle clicked');
  }

  const priorityToggle = page.locator('#feat-priority');
  if (await priorityToggle.count() > 0) {
    await priorityToggle.click();
    await page.waitForTimeout(300);
    notes.misc.push('Custom plan: priority toggle clicked');
  }

  await shot(page, '05-custom-plan-features-toggled.png');

  // Read live price
  const priceDisplay = page.locator('[class*="total"], [id*="total"], [class*="price"], [id*="price"]').first();
  if (await priceDisplay.count() > 0) {
    const price = await priceDisplay.textContent().catch(() => null);
    notes.misc.push(`Custom plan live price: ${price}`);
  }
});

// ─── Test 06: About section ───────────────────────────────────────────────────
test('06 - About section on homepage', async ({ page }) => {
  attachConsoleListener(page, 'about');

  await page.goto(BASE + '/#about');
  await page.waitForTimeout(800);

  const about = page.locator('.rc-about, #about, [id*="about"], [class*="about"]').first();
  if (await about.count() > 0) {
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    notes.misc.push('About section: found and scrolled into view');
  } else {
    notes.layoutIssues.push('About section: .rc-about / #about NOT FOUND');
  }

  await shot(page, '06-about.png');
});

// ─── Test 07: Projects section on homepage ───────────────────────────────────
// projects.php is a bare fragment included by index.php — no standalone URL.
// Test verifies the section renders within the homepage.
test('07 - Projects section on homepage', async ({ page }) => {
  attachConsoleListener(page, 'projects');

  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  const section = page.locator('#projects');
  if (await section.count() > 0) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shot(page, '07-projects.png');

    const featCard = section.locator('.rc-prj__feat').first();
    const tileCard = section.locator('.rc-prj__tile').first();
    const hasCard = await featCard.count() > 0 || await tileCard.count() > 0;

    if (hasCard) {
      notes.misc.push('Projects section: rc-prj__feat / rc-prj__tile cards found');
    } else {
      notes.layoutIssues.push('Projects section: no rc-prj__feat or rc-prj__tile cards found');
    }
  } else {
    await shot(page, '07-projects.png');
    notes.layoutIssues.push('Projects #projects section: NOT FOUND in homepage');
  }
});

// ─── Test 08: Testimonials section on homepage ────────────────────────────────
// testimonials.php is a bare fragment (uses $conn from index.php) — cannot be
// accessed directly. Test verifies the section renders within the homepage.
test('08 - Testimonials section on homepage', async ({ page }) => {
  attachConsoleListener(page, 'testimonials');

  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  const section = page.locator('#testimonials');
  const sectionExists = await section.count() > 0;

  if (sectionExists) {
    const isHidden = await section.evaluate((el) => el.style.display === 'none');
    if (isHidden) {
      notes.misc.push('Testimonials section: present in DOM but hidden (no approved testimonials in DB)');
    } else {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      notes.misc.push('Testimonials section: visible with content');
    }
  } else {
    notes.layoutIssues.push('Testimonials #testimonials section: NOT FOUND in homepage');
  }

  await shot(page, '08-testimonials.png');
});

// ─── Test 09: Broken image scan ───────────────────────────────────────────────
test('09 - Broken image scan on homepage', async ({ page }) => {
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');

  const broken = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.src || img.getAttribute('src') || '(no src)');
  });

  if (broken.length > 0) {
    broken.forEach((src) => notes.brokenImages.push(`Homepage: ${src}`));
  } else {
    notes.misc.push('Broken images on homepage: none');
  }

  await shot(page, '09-broken-image-check.png');
});

// ─── afterAll: write bug report ───────────────────────────────────────────────
test.afterAll(() => {
  const now = new Date().toISOString().split('T')[0];
  const lines = [
    `# Rielcode Site Audit Report`,
    `**Date:** ${now}`,
    `**Auditor:** Playwright automated test (headed Chromium)`,
    `**Base URL:** ${BASE}/`,
    ``,
    `## Console Errors`,
    notes.consoleErrors.length > 0
      ? notes.consoleErrors.map((e) => `- ${e}`).join('\n')
      : '- None detected',
    ``,
    `## Broken Images`,
    notes.brokenImages.length > 0
      ? notes.brokenImages.map((e) => `- ${e}`).join('\n')
      : '- None detected',
    ``,
    `## Layout Issues`,
    notes.layoutIssues.length > 0
      ? notes.layoutIssues.map((e) => `- ${e}`).join('\n')
      : '- None detected',
    ``,
    `## Form Behavior`,
    notes.formBehavior.length > 0
      ? notes.formBehavior.map((e) => `- ${e}`).join('\n')
      : '- No form behavior logged',
    ``,
    `## Misc Notes`,
    notes.misc.length > 0
      ? notes.misc.map((e) => `- ${e}`).join('\n')
      : '- None',
    ``,
    `## Screenshots`,
    fs.readdirSync(SHOT_DIR)
      .filter((f) => f.endsWith('.png'))
      .sort()
      .map((f) => `- screenshots/rielcode-audit/${f}`)
      .join('\n'),
  ];

  const reportPath = path.join(__dirname, '../rielcode-audit.md');
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
  console.log(`\nBug report written to: ${reportPath}`);
});
