const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

(async () => {
  const { status, body } = await get('https://www.youtube.com/watch?v=vaBxYgZ7MAU');
  console.log('Status:', status);
  console.log('Body length:', body.length);
  console.log('Has captionTracks:', body.includes('captionTracks'));
  console.log('Has ytInitialPlayerResponse:', body.includes('ytInitialPlayerResponse'));
  console.log('Has consent:', body.includes('consent'));
})();
