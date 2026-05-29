const { YoutubeTranscript } = require('youtube-transcript');

const videoId = process.argv[2];

(async () => {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  const lines = transcript.map(({ offset, text }) => {
    const secs = Math.floor(offset / 1000);
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}  ${text}`;
  });
  console.log(lines.join('\n'));
})().catch(e => { console.error(e.message); process.exit(1); });
