#!/usr/bin/env node
// tools/google/youtube/index.js
import { program } from 'commander';
import { google } from 'googleapis';
import * as readline from 'readline';
import { getAuthenticatedClient, runAuthFlow } from '../auth/oauth.js';
import { printTable, printJson, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';
import { existsSync, createReadStream } from 'fs';
import chalk from 'chalk';

// --- Shared helpers ---

async function getYouTube() {
  const auth = await getAuthenticatedClient();
  return google.youtube({ version: 'v3', auth });
}

async function getYouTubeAnalytics() {
  const auth = await getAuthenticatedClient();
  return google.youtubeAnalytics({ version: 'v2', auth });
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question + ' (y/n) ', resolve));
  rl.close();
  return answer.toLowerCase() === 'y';
}

function periodToDates(period) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const fmt = d => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}

// --- Command implementations ---

export async function listVideos(opts) {
  const yt = await getYouTube();

  const channelRes = await yt.channels.list({ part: ['contentDetails'], mine: true });
  const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

  const res = await yt.playlistItems.list({
    part: ['snippet'],
    playlistId: uploadsPlaylistId,
    maxResults: opts.limit,
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      videoId: i.snippet.resourceId.videoId,
      title: i.snippet.title,
      publishedAt: i.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No videos found.');
    return;
  }

  printTable(
    ['Video ID', 'Title', 'Published'],
    items.map(i => [
      i.snippet.resourceId.videoId,
      i.snippet.title,
      formatDate(i.snippet.publishedAt),
    ])
  );
}

export async function uploadVideo(opts) {
  if (!existsSync(opts.file)) {
    console.error(chalk.red('File not found:'), opts.file);
    process.exit(1);
  }

  if (!opts.yolo) {
    const ok = await confirm(`Upload "${opts.title}" as ${opts.privacy}?`);
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  const yt = await getYouTube();

  printInfo(`Uploading "${opts.title}"...`);

  const res = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: opts.title,
        description: opts.description,
        tags: opts.tags,
      },
      status: {
        privacyStatus: opts.privacy,
      },
    },
    media: {
      mimeType: 'video/*',
      body: createReadStream(opts.file),
    },
  });

  printSuccess(`Uploaded: "${res.data.snippet.title}" — ID: ${res.data.id}`);
}

export async function searchVideos(opts) {
  const yt = await getYouTube();

  const res = await yt.search.list({
    part: ['snippet'],
    q: opts.query,
    type: ['video'],
    maxResults: 10,
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      videoId: i.id.videoId,
      title: i.snippet.title,
      channel: i.snippet.channelTitle,
      publishedAt: i.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No results found.');
    return;
  }

  printTable(
    ['Video ID', 'Title', 'Channel', 'Published'],
    items.map(i => [
      i.id.videoId,
      i.snippet.title,
      i.snippet.channelTitle,
      formatDate(i.snippet.publishedAt),
    ])
  );
}

export async function getAnalytics(opts) {
  const yta = await getYouTubeAnalytics();
  const { startDate, endDate } = periodToDates(opts.period);

  const params = {
    ids: 'channel==MINE',
    startDate,
    endDate,
    dimensions: 'day',
    metrics: 'views,likes,comments,estimatedMinutesWatched',
    sort: 'day',
  };

  if (opts.videoId) {
    params.filters = `video==${opts.videoId}`;
  }

  const res = await yta.reports.query(params);

  if (opts.json) {
    return printJson(res.data);
  }

  const headers = (res.data.columnHeaders || []).map(h => h.name);
  const rows = res.data.rows || [];

  if (!rows.length) {
    console.log('No analytics data found for this period.');
    return;
  }

  printTable(headers, rows);
}

export async function listComments(opts) {
  const yt = await getYouTube();

  const res = await yt.commentThreads.list({
    part: ['snippet'],
    videoId: opts.videoId,
    maxResults: 20,
    order: 'time',
  });

  const items = res.data.items || [];

  if (opts.json) {
    return printJson(items.map(i => ({
      threadId: i.id,
      commentId: i.snippet.topLevelComment.id,
      author: i.snippet.topLevelComment.snippet.authorDisplayName,
      text: i.snippet.topLevelComment.snippet.textDisplay,
      likes: i.snippet.topLevelComment.snippet.likeCount,
      replies: i.snippet.totalReplyCount,
      publishedAt: i.snippet.topLevelComment.snippet.publishedAt,
    })));
  }

  if (!items.length) {
    console.log('No comments found.');
    return;
  }

  printTable(
    ['Comment ID', 'Author', 'Text (preview)', 'Likes', 'Replies'],
    items.map(i => {
      const s = i.snippet.topLevelComment.snippet;
      return [
        i.snippet.topLevelComment.id,
        s.authorDisplayName,
        s.textDisplay.slice(0, 60),
        s.likeCount,
        i.snippet.totalReplyCount,
      ];
    })
  );
}

export async function replyToComment(opts) {
  const yt = await getYouTube();

  const res = await yt.comments.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        parentId: opts.commentId,
        textOriginal: opts.body,
      },
    },
  });

  printSuccess(`Reply posted — ID: ${res.data.id}`);
}

export async function deleteComment(opts) {
  const yt = await getYouTube();

  if (!opts.yolo) {
    const res = await yt.comments.list({
      part: ['snippet'],
      id: [opts.commentId],
    });
    const text = res.data.items?.[0]?.snippet?.textDisplay || opts.commentId;
    const preview = text.length > 60 ? text.slice(0, 57) + '...' : text;

    const ok = await confirm(`Delete comment "${preview}"?`);
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  await yt.comments.delete({ id: opts.commentId });
  printSuccess(`Deleted comment: ${opts.commentId}`);
}

export async function runAuth() {
  await runAuthFlow();
}

// --- CLI wiring ---

program.name('yt').description('YouTube CLI');

program
  .command('auth')
  .description('Re-authenticate with Google (adds YouTube scope)')
  .action(async () => {
    try {
      await runAuthFlow();
    } catch (e) {
      handleError(e);
    }
  });

program
  .command('list')
  .description('List your channel videos')
  .option('--limit <n>', 'Max results', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await listVideos({ limit: parseInt(opts.limit), json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

program
  .command('upload <file>')
  .description('Upload a video to YouTube')
  .requiredOption('--title <t>', 'Video title')
  .option('--description <d>', 'Video description', '')
  .option('--tags <tags>', 'Comma-separated tags', '')
  .option('--privacy <p>', 'public, private, or unlisted', 'private')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (file, opts) => {
    try {
      await uploadVideo({
        file,
        title: opts.title,
        description: opts.description,
        tags: opts.tags ? opts.tags.split(',').map(t => t.trim()) : [],
        privacy: opts.privacy,
        yolo: !!opts.yolo,
      });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

program
  .command('search <query>')
  .description('Search YouTube videos')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (query, opts) => {
    try {
      await searchVideos({ query, json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

program
  .command('analytics')
  .description('Channel or video analytics')
  .option('--video <id>', 'Video ID (omit for channel-level)')
  .option('--period <p>', '7d, 30d, or 90d', '30d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await getAnalytics({
        videoId: opts.video || null,
        period: opts.period,
        json: !!opts.json,
      });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

const comments = program.command('comments').description('Manage video comments');

comments
  .command('list <video-id>')
  .description('List comments on a video')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (videoId, opts) => {
    try {
      await listComments({ videoId, json: !!opts.json });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

comments
  .command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--body <b>', 'Reply text')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      await replyToComment({ commentId, body: opts.body });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

comments
  .command('delete <comment-id>')
  .description('Delete a comment')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      await deleteComment({ commentId, yolo: !!opts.yolo });
    } catch (e) {
      handleError(e, opts.debug);
    }
  });

// Only parse CLI args when run directly, not when imported by tests
if (process.env.NODE_ENV !== 'test') {
  program.parse();
}
