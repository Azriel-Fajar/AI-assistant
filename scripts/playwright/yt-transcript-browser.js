const { chromium } = require('playwright');
const fs = require('fs');

const videoId = process.argv[2] || 'vaBxYgZ7MAU';

const COOKIES = [
  { name: '__Secure-1PAPISID', value: 'Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o', domain: '.youtube.com', path: '/', secure: true, httpOnly: false, sameSite: 'None' },
  { name: '__Secure-1PSID', value: 'g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7l2T0_Dljp2EeVBqcNZmWEwACgYKAfASARQSFQHGX2MihCdyQmLuRJ49xmi0qZdy0xoVAUF8yKqKt8F_h43y6ea76mZDHmC30076', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: '__Secure-1PSIDCC', value: 'AKEyXzUL5cVSzNlV15BQCyBxqgtkgqPUXiuPC41XGNAz9TRs1Jfh-vy-94R4ZWQOWBvmGcLHKg', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: '__Secure-1PSIDTS', value: 'sidts-CjQBhkeRd15FN3W4UKpjHoHZGF_LAh9kAJq6hkHFf94zyM8vGIJtjKvg5hPI6uYfrqu1NP9EEAA', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: '__Secure-3PAPISID', value: 'Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o', domain: '.youtube.com', path: '/', secure: true, httpOnly: false, sameSite: 'None' },
  { name: '__Secure-3PSID', value: 'g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7O0mC1AKyNc7q7aUL6hFDSQACgYKARQSARQSFQHGX2MiAl8H_UoABPnAfH6DRYloIxoVAUF8yKr-1uhdSi7UtuR0rOJhMH4_0076', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: '__Secure-3PSIDCC', value: 'AKEyXzUWdLXmELWlD3atd-8d4SAJzpqr2d4eSk3TsM86X4vP1fk5kQVnxSSaRokCJbM2RuSE1V4', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: '__Secure-3PSIDTS', value: 'sidts-CjQBhkeRd15FN3W4UKpjHoHZGF_LAh9kAJq6hkHFf94zyM8vGIJtjKvg5hPI6uYfrqu1NP9EEAA', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: 'APISID', value: 'pzx9cZ-8q9DvIbP_/AdFKGdrcJhwr7UkHJ', domain: '.youtube.com', path: '/', secure: false, httpOnly: false, sameSite: 'None' },
  { name: 'HSID', value: 'AwgM73NPdrYG2FGcI', domain: '.youtube.com', path: '/', secure: false, httpOnly: true, sameSite: 'None' },
  { name: 'LOGIN_INFO', value: 'AFmmF2swRQIgBqPoec62kA9RYU8aCaw9Px7scGWiI-dcYDihsM3JwF0CIQDRVVtXheTADGQLwYhE8Og7RRb7uYVhzgNqJmirXjGgdQ:QUQ3MjNmejljUEtodWZta3lZZ0M2NHhaSzV6TS13UEtLMzhUWWExc3NESTBxVHhKTWp3ZnJCbkVFQmpRaFFITm1uS1htblVxM2NkcEJ4MnBYaU9ablcxUy1fM3NhUFdwcXA0dzZVV2J3bGcwalZkSWNMZ19pOUw4al94dXFwWGp0U0g3VmFsaFNTLTBNU2JiTTl2RlhrSnlsQS1iVk5ldlh3', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
  { name: 'PREF', value: 'f4=4000000&f6=40000000&tz=Asia.Jakarta&f7=100', domain: '.youtube.com', path: '/', secure: true, httpOnly: false, sameSite: 'None' },
  { name: 'SAPISID', value: 'Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o', domain: '.youtube.com', path: '/', secure: true, httpOnly: false, sameSite: 'None' },
  { name: 'SID', value: 'g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7z2fuWgtcPUCAh2SsCTiIqAACgYKAYESARQSFQHGX2MipvX2iyiGCWqze4QxXI8IiRoVAUF8yKr6jiU05pDB6AxWo2Bp-0Ik0076', domain: '.youtube.com', path: '/', secure: false, httpOnly: false, sameSite: 'None' },
  { name: 'SIDCC', value: 'AKEyXzUETqlwhyACVVGhLtTCZKZLVnK4t4w1KvtmCCZYav7LOdj1nsgCh_QPWgmpv9csl6nq', domain: '.youtube.com', path: '/', secure: false, httpOnly: false, sameSite: 'None' },
  { name: 'SSID', value: 'ANNpg0ql_LjlKMD2T', domain: '.youtube.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
  });

  await context.addCookies(COOKIES);

  const page = await context.newPage();

  // Intercept timedtext response
  let captionXml = null;
  page.on('response', async res => {
    if (res.url().includes('/api/timedtext') && !captionXml) {
      try { captionXml = await res.text(); } catch {}
    }
  });

  await page.goto(`https://www.youtube.com/watch?v=${videoId}`, { waitUntil: 'networkidle' });

  // Check logged in
  const isLoggedIn = await page.evaluate(() => !!window.ytInitialData?.header?.c4TabbedHeaderRenderer?.avatar);
  process.stderr.write(`Logged in: ${isLoggedIn}\n`);

  // Get caption URL from page JS
  const captionUrl = await page.evaluate(() => {
    const r = window.ytInitialPlayerResponse;
    const tracks = r?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    return tracks && tracks.length ? tracks[0].baseUrl : null;
  });

  process.stderr.write(`Caption URL found: ${!!captionUrl}\n`);

  if (captionUrl) {
    captionXml = await page.evaluate(async (url) => {
      const r = await fetch(url);
      return r.text();
    }, captionUrl);
  }

  await browser.close();

  if (!captionXml || !captionXml.includes('<text')) {
    console.error('No transcript XML. len:', captionXml ? captionXml.length : 0);
    process.exit(1);
  }

  const lines = [...captionXml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)].map(([, start, text]) => {
    const secs = Math.floor(parseFloat(start));
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    const clean = text
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim();
    return `${m}:${s}  ${clean}`;
  });

  fs.mkdirSync('transcripts', { recursive: true });
  const md = `# How To Succeed With A NEW Meta Ad Account in 2026\n\nSource: https://www.youtube.com/watch?v=${videoId}\n\n` + lines.join('\n');
  fs.writeFileSync(`transcripts/${videoId}.md`, md);
  console.log(`Done. ${lines.length} lines → transcripts/${videoId}.md`);
})();
