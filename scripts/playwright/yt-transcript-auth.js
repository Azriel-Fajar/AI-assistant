const https = require('https');

const videoId = process.argv[2];

const COOKIES = [
  '__Secure-1PAPISID=Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o',
  '__Secure-1PSID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7l2T0_Dljp2EeVBqcNZmWEwACgYKAfASARQSFQHGX2MihCdyQmLuRJ49xmi0qZdy0xoVAUF8yKqKt8F_h43y6ea76mZDHmC30076',
  '__Secure-1PSIDCC=AKEyXzWEjws62oQYGLP3Iw6DPvf8zZSFt7HuEE_-NPeOoh8Luh9ADd3HErA28ffZGRaiWVtdCg',
  '__Secure-1PSIDTS=sidts-CjQBhkeRd15FN3W4UKpjHoHZGF_LAh9kAJq6hkHFf94zyM8vGIJtjKvg5hPI6uYfrqu1NP9EEAA',
  '__Secure-3PAPISID=Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o',
  '__Secure-3PSID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7O0mC1AKyNc7q7aUL6hFDSQACgYKARQSARQSFQHGX2MiAl8H_UoABPnAfH6DRYloIxoVAUF8yKr-1uhdSi7UtuR0rOJhMH4_0076',
  '__Secure-3PSIDCC=AKEyXzVoCKv6Zl-GqBPcPkdvrib7Vq2DXG4VCc-0Gk6h6sG_PhX6wtNl1bXu3-aXktpOjXwyPVk',
  '__Secure-3PSIDTS=sidts-CjQBhkeRd15FN3W4UKpjHoHZGF_LAh9kAJq6hkHFf94zyM8vGIJtjKvg5hPI6uYfrqu1NP9EEAA',
  'APISID=pzx9cZ-8q9DvIbP_/AdFKGdrcJhwr7UkHJ',
  'HSID=AwgM73NPdrYG2FGcI',
  'LOGIN_INFO=AFmmF2swRQIgBqPoec62kA9RYU8aCaw9Px7scGWiI-dcYDihsM3JwF0CIQDRVVtXheTADGQLwYhE8Og7RRb7uYVhzgNqJmirXjGgdQ:QUQ3MjNmejljUEtodWZta3xZZ0M2NHhaSzV6TS13UEtLMzhUWWExc3NESTBxVHhKTWp3ZnJCbkVFQmpRaFFITm1uS1htblVxM2NkcEJ4MnBYaU9ablcxUy1fM3NhUFdwcXA0dzZVV2J3bGcwalZkSWNMZ19pOUw0al94dXFwWGp0U0g3VmFsaFNTLTBNU2JiTTl2RlhrSnlsQS1iVk5ldlh3',
  'PREF=f4=4000000&f6=40000000&tz=Asia.Jakarta&f7=100',
  'SAPISID=Qg2aANocYVVBN1eY/AocO2pjPwArDqQa9o',
  'SID=g.a000-Ah9HG3g8Uk_Gv5ASJNvzxd-Tv0oXESguQExZntVRJ-pkKx7z2fuWgtcPUCAh2SsCTiIqAACgYKAYESARQSFQHGX2MipvX2iyiGCWqze4QxXI8IiRoVAUF8yKr6jiU05pDB6AxWo2Bp-0Ik0076',
  'SIDCC=AKEyXzUiesh2_UwzQJ8bFbRbul7iM9XjV8P685bKtA1D6IIfX8LedvBAERtSrkjfrg49xJ_A',
  'SSID=ANNpg0ql_LjlKMD2T',
].join('; ');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'identity',
        'Cookie': COOKIES,
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString()));
    }).on('error', reject);
  });
}

(async () => {
  const body = await get(`https://www.youtube.com/watch?v=${videoId}`);

  const idx = body.indexOf('captionTracks');
  if (idx === -1) {
    console.error('No captionTracks. Logged in:', body.includes('LOGOUT'));
    process.exit(1);
  }

  const snippet = body.substring(idx, idx + 800);
  const urlMatch = snippet.match(/"baseUrl":"([^"]+)"/);
  if (!urlMatch) { console.error('No baseUrl'); process.exit(1); }

  const captionUrl = JSON.parse('"' + urlMatch[1] + '"');
  const xml = await get(captionUrl);

  if (!xml.includes('<text')) {
    console.error('Empty captions XML. Length:', xml.length, xml.substring(0, 200));
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

  console.log(lines.join('\n'));
})();
