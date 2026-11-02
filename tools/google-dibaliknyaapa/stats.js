// Prints every video of the logged-in channel with its current numbers, as JSON, oldest first.
import { yt } from './lib.js';

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

console.log(JSON.stringify({
  channel: ch.snippet.title,
  subscribers: Number(ch.statistics.subscriberCount ?? 0),
  checked: new Date().toISOString(),
  videos,
}, null, 2));
