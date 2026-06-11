import { chromium } from '@playwright/test';
import path from 'path';

const base = 'http://localhost/parallaxnet-dashboard';
const outDir = path.resolve('screenshots');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

// 1. login page
await page.goto(base + '/login.php');
await page.screenshot({ path: path.join(outDir, 'pnx-1-login.png') });

// wrong password
await page.fill('input[name=username]', 'admin');
await page.fill('input[name=password]', 'wrong');
await page.click('button');
if (!(await page.textContent('body')).includes('salah')) errors.push('wrong-password error not shown');

// real login
await page.fill('input[name=username]', 'admin');
await page.fill('input[name=password]', 'parallaxnet2026');
await page.click('button');
await page.waitForURL('**/index.php');
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(outDir, 'pnx-2-dashboard.png'), fullPage: true });

// kampus list + detail
await page.goto(base + '/kampus.php');
await page.screenshot({ path: path.join(outDir, 'pnx-3-kampus.png'), fullPage: true });
await page.goto(base + '/kampus.php?id=1');
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, 'pnx-4-kampus-detail.png'), fullPage: true });

// alerts
await page.goto(base + '/alerts.php');
await page.screenshot({ path: path.join(outDir, 'pnx-5-alerts.png'), fullPage: true });
const alertBody = await page.textContent('body');
console.log('alerts page has bulan badges:', alertBody.includes('bulan'));

// data page
await page.goto(base + '/data.php');
await page.screenshot({ path: path.join(outDir, 'pnx-6-data.png'), fullPage: true });

// CSV import end-to-end
await page.goto(base + '/import.php');
await page.setInputFiles('input[type=file]', path.join(outDir, 'pnx-test-import.csv'));
await page.click('button');
await page.waitForSelector('text=Pemetaan Kolom');
await page.screenshot({ path: path.join(outDir, 'pnx-7-import-map.png'), fullPage: true });
await page.click('button:has-text("Proses Import")');
await page.waitForSelector('text=Import selesai');
const res = await page.textContent('.alert-success');
console.log('IMPORT RESULT:', res.trim());
await page.screenshot({ path: path.join(outDir, 'pnx-8-import-done.png'), fullPage: true });

// re-import same file -> should update not insert
await page.goto(base + '/import.php');
await page.setInputFiles('input[type=file]', path.join(outDir, 'pnx-test-import.csv'));
await page.click('button');
await page.waitForSelector('text=Pemetaan Kolom');
await page.click('button:has-text("Proses Import")');
await page.waitForSelector('text=Import selesai');
console.log('RE-IMPORT RESULT:', (await page.textContent('.alert-success')).trim());

// logout
await page.goto(base + '/logout.php');
await page.waitForURL('**/login.php');
// protected page redirects back to login
await page.goto(base + '/index.php');
console.log('auth redirect works:', page.url().includes('login.php'));

console.log('JS errors:', errors.length ? errors : 'none');
await browser.close();
