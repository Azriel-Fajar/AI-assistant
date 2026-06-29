// quiz-auto runner — probe or answer a Google Form
// Usage:
//   node run.js --form-url <URL> --mode probe
//   node run.js --form-url <URL> --mode answer --answers <path-to-json>

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

function loadPlaywright() {
  const tryPaths = [
    'playwright',
    'C:\\nvm4w\\nodejs\\node_modules\\playwright',
    path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', 'playwright'),
    'C:\\Users\\afw14\\AppData\\Roaming\\npm\\node_modules\\playwright',
  ];
  for (const p of tryPaths) {
    try { return require(p); } catch {}
  }
  throw new Error('Playwright not found. Install: npm i -g playwright');
}
const { chromium } = loadPlaywright();

function resolveProfile() {
  const candidates = [
    process.env.QUIZ_AUTO_PROFILE,
    'd:/Main Storage/Documents/JARVIS/.pw-profile',
    'C:/Users/afw14/Documents/JARVIS/.pw-profile',
    path.join(os.homedir(), 'Documents', 'JARVIS', '.pw-profile'),
    path.join(os.homedir(), '.pw-profile'),
  ].filter(Boolean);
  for (const c of candidates) {
    const parent = path.dirname(c);
    if (fs.existsSync(c) || fs.existsSync(parent)) return c;
  }
  return candidates[candidates.length - 1];
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const FORM_URL = arg('form-url');
const MODE = arg('mode', 'probe');
const ANSWERS_PATH = arg('answers');
const PROFILE = arg('profile', resolveProfile());
// label auto-derived from form title at runtime

function formIdFromUrl(url) {
  const m = url && url.match(/\/forms\/d\/(?:e\/)?([A-Za-z0-9_-]+)/);
  return m ? m[1].slice(0, 24) : 'form';
}
function tsStamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
function safeLabel(s) { return s ? s.replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 40) : ''; }
const EMAIL = process.env.QUIZ_AUTO_EMAIL || 'afw1407@gmail.com';

if (!FORM_URL) {
  console.error('Missing --form-url');
  process.exit(2);
}
if (MODE === 'answer' && !ANSWERS_PATH) {
  console.error('Missing --answers <path> for answer mode');
  process.exit(2);
}

function waitEnter(msg) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(msg, () => { rl.close(); resolve(); });
  });
}

async function enumerate(page) {
  await page.waitForSelector('div[role="listitem"]', { timeout: 15000 });
  const rawItems = await page.$$('div[role="listitem"]');
  const items = [];
  const questions = [];
  for (const item of rawItems) {
    const options = await item.$$eval('div[role="radio"]', els => els.map(e => e.getAttribute('aria-label')));
    if (options.length === 0) continue;
    let qText = '';
    const heading = await item.$('[role="heading"]');
    if (heading) qText = (await heading.innerText()).trim();
    if (!qText || /^untitled section$/i.test(qText)) {
      qText = await item.evaluate(el => {
        const spans = el.querySelectorAll('span');
        for (const s of spans) {
          const t = s.innerText?.trim();
          if (t && t.length > 10 && !/untitled section/i.test(t)) return t;
        }
        return el.innerText.split('\n').map(s => s.trim()).find(s => s.length > 10 && !/untitled section/i.test(s)) || '';
      });
    }
    if (!qText) continue;
    items.push(item);
    questions.push({ heading: qText, options });
  }
  return { items, questions };
}

async function scrapeErrors(page) {
  // Google Forms validation error: span with class containing "error" or aria-live region
  return await page.evaluate(() => {
    const errs = [];
    document.querySelectorAll('[role="listitem"]').forEach(li => {
      const heading = li.querySelector('[role="heading"]')?.innerText?.trim() || '';
      li.querySelectorAll('div').forEach(d => {
        const t = d.innerText?.trim();
        if (t && /required|wajib|harus diisi|please/i.test(t) && t.length < 120 && !d.querySelector('div')) {
          errs.push({ heading, msg: t });
        }
      });
    });
    return errs;
  });
}

async function findNextOrSubmit(page) {
  const buttons = await page.$$('div[role="button"]');
  for (const b of buttons) {
    const label = (await b.getAttribute('aria-label')) || (await b.innerText()).trim();
    if (/submit/i.test(label)) return { kind: 'submit', el: b };
    if (/^next$/i.test(label) || /berikutnya/i.test(label)) return { kind: 'next', el: b };
  }
  return null;
}

(async () => {
  const profile = path.resolve(PROFILE);
  const cookiePathA = path.join(profile, 'Default', 'Cookies');
  const cookiePathB = path.join(profile, 'Default', 'Network', 'Cookies');
  const firstRun = !fs.existsSync(cookiePathA) && !fs.existsSync(cookiePathB);

  const ctx = await chromium.launchPersistentContext(profile, {
    headless: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  try {
    await page.goto(FORM_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    if (firstRun) {
      await waitEnter('First run — sign in to Google in the open window, then press Enter here to continue: ');
      await page.goto(FORM_URL, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(2000);
    }

    let formTitle = '';
    try {
      formTitle = await page.evaluate(() => {
        const h = document.querySelector('div[role="heading"]')?.innerText?.trim();
        if (h) return h;
        return document.title.replace(/\s*-\s*Google Forms.*$/i, '').trim();
      });
    } catch {}
    const LABEL = safeLabel(formTitle);
    if (formTitle) console.log(`Form title: ${formTitle}${LABEL ? ` (label: ${LABEL})` : ''}`);

    let answers = [];
    if (MODE === 'answer') {
      answers = JSON.parse(fs.readFileSync(ANSWERS_PATH, 'utf8'));
    }

    const allQuestions = [];
    const questionsByPage = [];
    const seenHeadings = new Set();
    let answered = 0;
    const miss = [];
    const IDLE_MS = 20000;
    let pageNum = 0;
    let lastProgress = Date.now();

    const watchdog = setInterval(async () => {
      if (Date.now() - lastProgress > IDLE_MS) {
        clearInterval(watchdog);
        console.error(`\nIDLE >${IDLE_MS/1000}s — no progress on page ${pageNum}. Closing browser.`);
        console.error(`State: ${answered} answered, ${seenHeadings.size} questions seen.`);
        console.error(`URL: ${page.url()}`);
        await ctx.close().catch(() => {});
        process.exit(3);
      }
    }, 2000);

    async function tickEmailCheckbox() {
      try {
        const cb = await page.$('div[role="checkbox"][aria-label*="email to be included"]');
        if (cb && (await cb.getAttribute('aria-checked')) !== 'true') {
          await cb.scrollIntoViewIfNeeded().catch(() => {});
          await cb.click();
          console.log('Email checkbox ticked.');
        }
      } catch {}
    }

    while (true) {
      pageNum++;
      await tickEmailCheckbox();
      const { items, questions } = await enumerate(page);
      let pageAnswered = 0;
      let pageNew = 0;
      const thisPageQs = [];
      questionsByPage.push(thisPageQs);

      for (let i = 0; i < items.length; i++) {
        const q = questions[i];
        if (!q) continue;
        if (seenHeadings.has(q.heading)) continue;
        seenHeadings.add(q.heading);
        allQuestions.push(q);
        thisPageQs.push(q);
        pageNew++;
        lastProgress = Date.now();

        if (MODE === 'probe') {
          // Click first radio just to satisfy required-validation so we can advance to next page.
          const firstRadio = await items[i].$('div[role="radio"]');
          if (firstRadio) {
            await firstRadio.scrollIntoViewIfNeeded().catch(() => {});
            await firstRadio.click().catch(() => {});
          }
        }

        if (MODE === 'answer') {
          const match = answers.find(a => q.heading.includes(a.keyword));
          if (!match) {
            miss.push({ heading: q.heading, options: q.options, reason: 'no keyword match' });
            continue;
          }
          const radio = await items[i].$(`div[role="radio"][aria-label="${match.answer.replace(/"/g, '\\"')}"]`);
          if (!radio) {
            console.error(`MISS: "${match.answer}" not in options for "${q.heading.slice(0,70)}" — opts: ${JSON.stringify(q.options)}`);
            miss.push({ heading: q.heading, options: q.options, reason: `answer "${match.answer}" not in options` });
            continue;
          }
          await radio.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(300);
          await radio.click();
          const checked = await radio.getAttribute('aria-checked');
          if (checked !== 'true') {
            console.error(`Click did not register for "${q.heading.slice(0,70)}" — retrying with force.`);
            await radio.click({ force: true }).catch(() => {});
          }
          console.log(`OK: "${match.answer}" ← "${q.heading.slice(0, 70)}"`);
          answered++;
          pageAnswered++;
          lastProgress = Date.now();
        }
      }

      console.log(`Page ${pageNum}: ${pageNew} new questions, ${pageAnswered} answered.`);

      if (pageNum > 1 && pageNew === 0) {
        console.log('No new questions on this page — likely validation block or end. Stopping.');
        break;
      }

      const nav = await findNextOrSubmit(page);
      if (!nav) {
        console.log('No Next/Submit button found — end of form.');
        break;
      }
      if (nav.kind === 'submit') {
        console.log('Submit button reached — stopping (will NOT click).');
        break;
      }
      // In probe mode, force a selection on every still-unanswered required radio
      // so the page passes validation and Next advances. This lets probe walk ALL
      // pages in one pass (otherwise it stalls on page 1 due to aria-checked races).
      if (MODE === 'probe') {
        const lis = await page.$$('div[role="listitem"]');
        for (const li of lis) {
          const radios = await li.$$('div[role="radio"]');
          if (radios.length === 0) continue;
          let anyChecked = false;
          for (const r of radios) {
            if ((await r.getAttribute('aria-checked')) === 'true') { anyChecked = true; break; }
          }
          if (!anyChecked) {
            await radios[0].scrollIntoViewIfNeeded().catch(() => {});
            await radios[0].click().catch(() => {});
            if ((await radios[0].getAttribute('aria-checked')) !== 'true') {
              await radios[0].click({ force: true }).catch(() => {});
            }
            lastProgress = Date.now();
          }
        }
      }
      const unanswered = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('div[role="listitem"]').forEach(li => {
          const radios = li.querySelectorAll('div[role="radio"]');
          if (radios.length === 0) return;
          const anyChecked = Array.from(radios).some(r => r.getAttribute('aria-checked') === 'true');
          if (!anyChecked) {
            const h = li.querySelector('[role="heading"]')?.innerText?.trim() || '(no heading)';
            out.push(h.slice(0, 80));
          }
        });
        return out;
      });
      if (unanswered.length) {
        console.error(`Blocked: ${unanswered.length} unanswered on page ${pageNum}. Not clicking Next.`);
        for (const u of unanswered) console.error(`  - ${u}`);
        break;
      }
      console.log(`Clicking Next → page ${pageNum + 1}`);
      const headingsBefore = new Set(questions.map(q => q.heading));
      await nav.el.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await page.waitForSelector('div[role="listitem"]', { timeout: 15000 }).catch(() => {});

      const errs = await scrapeErrors(page).catch(() => []);
      if (errs.length) {
        console.error(`Validation errors on page ${pageNum}:`);
        for (const e of errs) console.error(`  - [${e.heading.slice(0,60)}] ${e.msg}`);
      }
      const { questions: nextQs } = await enumerate(page);
      const sameHeadings = nextQs.length && nextQs.every(q => headingsBefore.has(q.heading));
      if (sameHeadings) {
        console.error(`Page did not advance — still on page ${pageNum}. Likely unanswered required question blocking Next.`);
        if (MODE === 'probe') {
          console.error('Probe mode cannot bypass validation. Stopping. To capture later pages, run answer mode with partial answers.');
          break;
        } else {
          console.error('Stopping to avoid infinite loop. Check MISS list above.');
          break;
        }
      }
    }

    clearInterval(watchdog);

    function groupedJson(pages) {
      const blocks = pages.filter(p => p.length).map(p =>
        p.map(o => '  ' + JSON.stringify(o)).join(',\n')
      );
      return '[\n' + blocks.join(',\n\n') + '\n]\n';
    }

    const outDir = path.dirname(ANSWERS_PATH || path.join(__dirname, 'cache', 'x'));
    if (MODE === 'probe') {
      const probePath = path.join(outDir, 'probe.json');
      try {
        fs.writeFileSync(probePath, groupedJson(questionsByPage));
        console.log(`Probe written grouped → ${probePath}`);
      } catch (e) { console.error('Probe write failed:', e.message); }
      console.log(JSON.stringify(allQuestions, null, 2));
      console.log('Probe complete — closing browser.');
      await ctx.close().catch(() => {});
      process.exit(0);
    } else {
      try {
        const pagesGrouped = questionsByPage.map(pageQs =>
          pageQs.map(q => answers.find(a => q.heading.includes(a.keyword))).filter(Boolean)
        );
        const usedKeywords = new Set();
        pagesGrouped.flat().forEach(a => usedKeywords.add(a.keyword));
        const orphans = answers.filter(a => !usedKeywords.has(a.keyword));
        if (orphans.length) pagesGrouped.push(orphans);
        const grouped = groupedJson(pagesGrouped);
        fs.writeFileSync(ANSWERS_PATH, grouped);
        console.log(`Answers regrouped by page → ${ANSWERS_PATH}`);
        const archiveDir = path.join(outDir, 'archive');
        try { fs.mkdirSync(archiveDir, { recursive: true }); } catch {}
        const lbl = safeLabel(LABEL);
        const archiveName = `${formIdFromUrl(FORM_URL)}${lbl ? '_' + lbl : ''}_${tsStamp()}.json`;
        const archivePath = path.join(archiveDir, archiveName);
        const archivePayload = {
          formUrl: FORM_URL,
          label: LABEL || null,
          runAt: new Date().toISOString(),
          answered,
          total: allQuestions.length,
          miss,
          questionsByPage,
          answersByPage: pagesGrouped,
        };
        fs.writeFileSync(archivePath, JSON.stringify(archivePayload, null, 2));
        console.log(`Archived → ${archivePath}`);

        // Study doc: every question, full text, all options, chosen answer.
        const study = allQuestions.map((q, idx) => {
          const match = answers.find(a => q.heading.includes(a.keyword));
          return {
            number: idx + 1,
            question: q.heading,
            options: q.options,
            answer: match ? match.answer : null,
          };
        });
        const moduleTag = (ANSWERS_PATH.match(/answers_(module\d+)/i) || [])[1] || formIdFromUrl(FORM_URL);
        const studyJsonPath = path.join(outDir, `study_${moduleTag}.json`);
        fs.writeFileSync(studyJsonPath, JSON.stringify(study, null, 2));
        console.log(`Study JSON → ${studyJsonPath}`);

        const md = [];
        md.push(`# ${formTitle || moduleTag}`);
        md.push('');
        for (const s of study) {
          md.push(`## ${s.number}. ${s.question}`);
          for (const opt of s.options) {
            const correct = s.answer && opt === s.answer;
            md.push(`- ${correct ? '**' + opt + '** ✅' : opt}`);
          }
          md.push('');
          md.push(`**Answer:** ${s.answer || '(unanswered)'}`);
          md.push('');
        }
        const studyMdPath = path.join(outDir, `study_${moduleTag}.md`);
        fs.writeFileSync(studyMdPath, md.join('\n'));
        console.log(`Study Markdown → ${studyMdPath}`);
      } catch (e) { console.error('Regroup/archive failed:', e.message); }
      console.log(`\n${answered}/${allQuestions.length} answered.`);
      if (miss.length) {
        console.log(`\nMISS (${miss.length}):`);
        for (const m of miss) {
          console.log(`- ${m.heading}`);
          console.log(`  reason: ${m.reason}`);
          console.log(`  options: ${JSON.stringify(m.options)}`);
        }
      }
      console.log('\nBrowser left open. Review then submit manually.');
    }
  } catch (err) {
    console.error('Error:', err.message);
    await ctx.close().catch(() => {});
    process.exit(1);
  }
})();
