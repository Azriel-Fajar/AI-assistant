// Prints every video of the logged-in channel with its current numbers, as JSON, oldest first.
import { yt, ya } from './lib.js';

const ch = (await yt('channels', { part: 'snippet,contentDetails,statistics', mine: 'true' })).items[0];
const ids = [];
let pageToken;
do {
  const p = await yt('playlistItems', {
    part: 'contentDetails',
    playlistId: ch.contentDetails.relatedPlaylists.uploads,
    maxResults: 50,
    ...(pageToken && { pageToken }),
  });
  ids.push(...p.items.map(i => i.contentDetails.videoId));
  pageToken = p.nextPageToken;
} while (pageToken);

const videos = [];
for (let i = 0; i < ids.length; i += 50) {
  const v = await yt('videos', { part: 'snippet,statistics,status', id: ids.slice(i, i + 50).join(',') });
  videos.push(...v.items.map(x => ({
    id: x.id,
    title: x.snippet.title,
    published: x.snippet.publishedAt,
    status: x.status.privacyStatus,
    views: Number(x.statistics.viewCount ?? 0),
    likes: Number(x.statistics.likeCount ?? 0),
    comments: Number(x.statistics.commentCount ?? 0),
  })));
}
videos.sort((a, b) => a.published.localeCompare(b.published));

// Analytics lags 2-3 days, so new videos have no row yet (analytics: null). Each metric set is its own
// query because mixing engagedViews with the others in one video report returns "Internal error".
try {
  const range = { startDate: videos[0]?.published.slice(0, 10) ?? '2026-11-01', endDate: new Date().toISOString().slice(0, 10) };
  const byId = {};
  for (const metrics of ['views,averageViewDuration,averageViewPercentage,shares,subscribersGained', 'engagedViews']) {
    for (const row of await ya({ ...range, dimensions: 'video', metrics, maxResults: 50, sort: '-' + metrics.split(',')[0] })) {
      Object.assign(byId[row.video] ??= {}, row);
    }
  }
  for (const v of videos) {
    const a = byId[v.id];
    if (!a) { v.analytics = null; continue; }
    // Share of viewers still watching at 3s/25%/50%/75%/end; above 1 means rewatches.
    const curve = await ya({ ...range, dimensions: 'elapsedVideoTimeRatio', metrics: 'audienceWatchRatio', filters: `video==${v.id}` });
    const at = p => curve.length ? +curve.reduce((b, c) => Math.abs(c.elapsedVideoTimeRatio - p) < Math.abs(b.elapsedVideoTimeRatio - p) ? c : b).audienceWatchRatio.toFixed(2) : null;
    v.analytics = {
      avgViewSeconds: a.averageViewDuration,
      avgViewPercent: +a.averageViewPercentage.toFixed(1),
      engagedViews: a.engagedViews ?? 0,
      shares: a.shares,
      subscribersGained: a.subscribersGained,
      retention: { '5%': at(0.05), '25%': at(0.25), '50%': at(0.5), '75%': at(0.75), end: at(1) },
    };
  }
} catch (e) {
  for (const v of videos) v.analytics = { error: e.message };
}

console.log(JSON.stringify({
  channel: ch.snippet.title,
  subscribers: Number(ch.statistics.subscriberCount ?? 0),
  checked: new Date().toISOString(),
  videos,
}, null, 2));
