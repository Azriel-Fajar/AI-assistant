const https = require('https');

const videoId = process.argv[2];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'identity',
        'Cookie': 'CONSENT=YES+1; PREF=hl=en',
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
    console.error('No captionTracks found.');
    process.exit(1);
  }

  const snippet = body.substring(idx, idx + 800);
  const urlMatch = snippet.match(/"baseUrl":"([^"]+)"/);
  if (!urlMatch) {
    console.error('No baseUrl found');
    process.exit(1);
  }

  const captionUrl = JSON.parse('"' + urlMatch[1] + '"');
  const xml = await get(captionUrl);

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
