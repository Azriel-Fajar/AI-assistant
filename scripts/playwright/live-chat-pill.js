const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8000';

// Each case: message to send, and expectation on the resulting pill.
// pill: substring expected in pill href, or null = expect NO pill.
const cases = [
  { msg: 'I want the Pro plan', pill: '/order?aksi=pro' },
  { msg: 'Give me the Starter plan', pill: '/order?aksi=starter' },
  { msg: "I'll take the Student plan", pill: '/order?aksi=landing' },
  { msg: 'I want the Premium plan', pill: '/order?aksi=business' },
  { msg: "Okay I'm ready to order, not sure which plan yet", pill: '/order' },
  { msg: 'I need an online store with login and a shopping cart', pill: '/custom-plan' },
  { msg: 'What would my site look like? Can I see examples?', pill: 'rielcode.com/demos/' },
  { msg: 'Can I see your past work / portfolio?', pill: '/work' },
  { msg: 'Show me all your pricing and packages', pill: '/services' },
  { msg: 'I want to talk to a human to get started', pill: 'wa.me' },
  { msg: 'Tell me about the studio and the team', pill: '/studio' },
  // Edge: pure info, should NOT pill
  { msg: 'How long does delivery take?', pill: null },
  // Edge: vague "what plans do you have" -> bot teases, should NOT order-pill (may services-pill, allow either none or /services)
  { msg: "What's the weather today?", pill: null }, // off-topic decline
];

async function sendAndRead(page, msg) {
  const prevCount = await page.evaluate(
    () => document.querySelectorAll('#chat-messages .message.bot').length,
  );

  await page.fill('#user-input', msg);
  await page.locator('#user-input').press('Enter');

  // wait for a NEW bot bubble (beyond the greeting) that finished streaming
  await page.waitForFunction((prev) => {
    const bots = document.querySelectorAll('#chat-messages .message.bot');
    if (bots.length <= prev) return false;
    const last = bots[bots.length - 1];
    if (last.classList.contains('typing')) return false;
    return (last.textContent || '').trim().length > 0;
  }, prevCount, { timeout: 45000 });

  // The pill arrives as a final delta AFTER the model's last content delta,
  // then finalize renders it. Wait for the pill anchor, else a grace period
  // for genuine no-pill replies.
  await page.waitForFunction(() => {
    const bots = document.querySelectorAll('#chat-messages .message.bot');
    const last = bots[bots.length - 1];
    return last && last.querySelector('a.chat-pill');
  }, null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(300);

  return await page.evaluate(() => {
    const bots = document.querySelectorAll('#chat-messages .message.bot');
    const last = bots[bots.length - 1];
    const a = last.querySelector('a.chat-pill');
    return {
      text: (last.textContent || '').trim(),
      pillHref: a ? a.getAttribute('href') : null,
      rawSentinel: /\[\[pill:/.test(last.textContent || ''),
    };
  });
}

async function openFreshChat(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
  await page.click('#rc-cookie-accept').catch(() => {});
  await page.waitForTimeout(200);
  await page.click('#chatbot-icon');
  await page.waitForFunction(() => {
    const c = document.getElementById('chatbot-container');
    return c && !c.classList.contains('hidden');
  }, { timeout: 5000 });
  await page.waitForTimeout(300);
  return { ctx, page };
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  let fails = 0;
  for (const c of cases) {
    let res, ctx, page;
    try {
      ({ ctx, page } = await openFreshChat(browser));
      res = await sendAndRead(page, c.msg);
      await ctx.close();
    } catch (e) {
      if (ctx) await ctx.close().catch(() => {});
      console.log(`ERROR  "${c.msg}"  ->  ${e.message.split('\n')[0]}`);
      fails++;
      continue;
    }

    let ok;
    if (c.pill === null) ok = res.pillHref === null;
    else ok = res.pillHref && res.pillHref.includes(c.pill);
    if (res.rawSentinel) ok = false; // raw sentinel leaked = always fail

    console.log(`${ok ? 'PASS' : 'FAIL'}  "${c.msg}"`);
    console.log(`        pill: ${res.pillHref || '(none)'}${c.pill !== null ? '   expect~ ' + c.pill : '   expect none'}`);
    if (res.rawSentinel) console.log('        !! raw [[pill:]] leaked into text');
    if (!ok) {
      fails++;
      console.log(`        reply: ${res.text.slice(0, 160)}`);
    }
  }

  await browser.close();
  console.log(`\n${fails === 0 ? 'ALL PASS' : fails + ' FAIL(S)'} / ${cases.length}`);
  process.exit(fails === 0 ? 0 : 1);
})();
