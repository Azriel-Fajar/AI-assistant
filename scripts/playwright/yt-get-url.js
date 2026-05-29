const https = require('https');

const COOKIES = 'SID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7z2fuWgtcPUCAh2SsCTiIqAACgYKAYESARQSFQHGX2MipvX2iyiGCWqze4QxXI8IiRoVAUF8yKr6jiU05pDB6AxWo2Bp-0Ik0076; SIDCC=AKEyXzUETqlwhyACVVGhLtTCZKZLVnK4t4w1KvtmCCZYav7LOdj1nsgCh_QPWgmpv9csl6nq; __Secure-1PSID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7l2T0_Dljp2EeVBqcNZmWEwACgYKAfASARQSFQHGX2MihCdyQmLuRJ49xmi0qZdy0xoVAUF8yKqKt8F_h43y6ea76mZDHmC30076; __Secure-1PSIDCC=AKEyXzUL5cVSzNlV15BQCyBxqgtkgqPUXiuPC41XGNAz9TRs1Jfh-vy-94R4ZWQOWBvmGcLHKg; __Secure-3PSID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7O0mC1AKyNc7q7aUL6hFDSQACgYKARQSARQSFQHGX2MiAl8H_UoABPnAfH6DRYloIxoVAUF8yKr-1uhdSi7UtuR0rOJhMH4_0076; __Secure-3PSIDCC=AKEyXzUWdLXmELWlD3atd-8d4SAJzpqr2d4eSk3TsM86X4vP1fk5kQVnxSSaRokCJbM2RuSE1V4; SAPISID=Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o; APISID=pzx9cZ-8q9DvIbP_/AdFKGdrcJhwr7UkHJ; HSID=AwgM73NPdrYG2FGcI; SSID=ANNpg0ql_LjlKMD2T; LOGIN_INFO=AFmmF2swRQIgBqPoec62kA9RYU8aCaw9Px7scGWiI-dcYDihsM3JwF0CIQDRVVtXheTADGQLwYhE8Og7RRb7uYVhzgNqJmirXjGgdQ:QUQ3MjNmejljUEtodWZta3lZZ0M2NHhaSzV6TS13UEtLMzhUWWExc3NESTBxVHhKTWp3ZnJCbkVFQmpRaFFITm1uS1htblVxM2NkcEJ4MnBYaU9ablcxUy1fM3NhUFdwcXA0dzZVV2J3bGcwalZkSWNMZ19pOUw4al94dXFwWGp0U0g3VmFsaFNTLTBNU2JiTTl2RlhrSnlsQS1iVk5ldlh3; PREF=f4=4000000&f6=40000000&tz=Asia.Jakarta&f7=100';

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Cookie': COOKIES,
};

function get(url) {
  return new Promise((r, j) => {
    https.get(url, { headers: H }, res => {
      const c = [];
      res.on('data', d => c.push(d));
      res.on('end', () => r(Buffer.concat(c).toString()));
    }).on('error', j);
  });
}

async function getCaptionUrl(videoId) {
  for (let i = 0; i < 5; i++) {
    const body = await get(`https://www.youtube.com/watch?v=${videoId}`);
    const idx = body.indexOf('captionTracks');
    if (idx === -1) { process.stderr.write(`attempt ${i+1}: no captionTracks (len=${body.length})\n`); continue; }
    const snip = body.substring(idx, idx + 2000);
    const m = snip.match(/"baseUrl":"([^"]+)"/);
    if (!m) { process.stderr.write(`attempt ${i+1}: no baseUrl\n`); continue; }
    const url = m[1].replace(/\\u0026/g, '&').replace(/\\u003d/g, '=').replace(/\\u003c/g, '<');
    return { url, body };
  }
  return null;
}

(async () => {
  const videoId = process.argv[2] || 'vaBxYgZ7MAU';
  const result = await getCaptionUrl(videoId);
  if (!result) { console.error('Failed after 5 attempts'); process.exit(1); }

  const { url } = result;
  process.stderr.write(`Caption URL: ${url.substring(0, 100)}...\n`);

  const xml = await get(url);
  process.stderr.write(`XML len: ${xml.length}\n`);

  if (!xml.includes('<text')) {
    console.error('Empty XML response');
    process.exit(1);
  }

  const lines = [...xml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)].map(([, start, text]) => {
    const secs = Math.floor(parseFloat(start));
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    const clean = text
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim();
    return `${m}:${s}  ${clean}`;
  });

  const fs = require('fs');
  fs.mkdirSync('transcripts', { recursive: true });
  const md = `# How To Succeed With A NEW Meta Ad Account in 2026\n\nSource: https://www.youtube.com/watch?v=${videoId}\n\n` + lines.join('\n');
  fs.writeFileSync(`transcripts/${videoId}.md`, md);
  console.log(`Done. ${lines.length} lines → transcripts/${videoId}.md`);
})();
