#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import { getToken, saveToken, getAuthHeaders } from '../auth/tiktok.js';
import { printTable, printJSON, printSuccess, printInfo } from '../lib/output.js';
import { handleError } from '../lib/error.js';

const TT_API = 'https://open.tiktokapis.com/v2';

function isNetworkError(err) {
  return err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
}

function formatDate(ts) {
  if (!ts) return '';
  const d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
  return d.toLocaleDateString('en-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

program.name('tt').description('TikTok CLI');

// ---- auth ----
program
  .command('auth')
  .description('Authenticate with TikTok OAuth')
  .action(async () => {
    console.log(chalk.yellow('TikTok OAuth requires a TikTok Developer app.'));
    console.log('1. Go to developers.tiktok.com and create an app');
    console.log('2. Add your Client Key and Secret to tools/social/config.json');
    console.log('3. Generate an access token and run:');
    console.log('   tt auth:token --token <your-token>');
  });

program
  .command('auth:token')
  .description('Store a TikTok access token directly')
  .requiredOption('--token <t>', 'TikTok access token')
  .action(async (opts) => {
    try {
      saveToken('tiktok', { access_token: opts.token });
      printSuccess('TikTok token saved.');
    } catch (err) {
      handleError(err);
    }
  });

// ---- upload ----
program
  .command('upload <file>')
  .description('Upload a video to TikTok')
  .requiredOption('--title <t>', 'Video title')
  .option('--description <d>', 'Video description', '')
  .option('--privacy <p>', 'public, private, or friends', 'private')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (file, opts) => {
    try {
      const headers = getAuthHeaders('tiktok');
      console.log(chalk.yellow('TikTok video upload requires file chunking and server-side URL.'));
      console.log(chalk.yellow('Use the TikTok Content Posting API directly for full upload support.'));
      console.log(chalk.blue('i') + ` Would upload: ${file} as "${opts.title}" (${opts.privacy})`);
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

// ---- list ----
export async function ttList(opts) {
  const headers = getAuthHeaders('tiktok');

  const res = await axios.post(`${TT_API}/video/list/`, {
    fields: ['id', 'title', 'view_count', 'like_count', 'comment_count', 'create_time', 'share_url'],
    max_count: opts.limit,
  }, { headers });

  const items = res.data?.data?.videos || [];

  if (opts.json) return printJSON(items);
  if (!items.length) { console.log('No videos found.'); return; }

  printTable(
    ['ID', 'Title', 'Views', 'Likes', 'Comments', 'Date'],
    items.map(v => [
      v.id,
      (v.title || '').slice(0, 30),
      v.view_count ?? '?',
      v.like_count ?? '?',
      v.comment_count ?? '?',
      formatDate(v.create_time),
    ])
  );
}

program
  .command('list')
  .description('List your TikTok videos')
  .option('--limit <n>', 'Max results', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await ttList({ limit: parseInt(opts.limit), json: !!opts.json });
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- analytics ----
export async function ttAnalytics(opts) {
  const headers = getAuthHeaders('tiktok');

  if (opts.videoId) {
    const res = await axios.post(`${TT_API}/video/query/`, {
      filters: { video_ids: [opts.videoId] },
      fields: ['id', 'title', 'view_count', 'like_count', 'comment_count', 'share_count'],
    }, { headers });

    const videos = res.data?.data?.videos || [];
    if (opts.json) return printJSON(videos);

    if (!videos.length) { console.log('Video not found.'); return; }
    const v = videos[0];
    printTable(
      ['Metric', 'Value'],
      [
        ['views', v.view_count ?? '?'],
        ['likes', v.like_count ?? '?'],
        ['comments', v.comment_count ?? '?'],
        ['shares', v.share_count ?? '?'],
      ]
    );
  } else {
    // Account-level analytics: list videos and sum
    const res = await axios.post(`${TT_API}/video/list/`, {
      fields: ['view_count', 'like_count', 'comment_count'],
      max_count: 20,
    }, { headers });

    const videos = res.data?.data?.videos || [];
    if (opts.json) return printJSON(videos);

    const totals = videos.reduce((acc, v) => ({
      views: acc.views + (v.view_count || 0),
      likes: acc.likes + (v.like_count || 0),
      comments: acc.comments + (v.comment_count || 0),
    }), { views: 0, likes: 0, comments: 0 });

    printTable(
      ['Metric', 'Total (last 20 videos)'],
      [
        ['views', totals.views],
        ['likes', totals.likes],
        ['comments', totals.comments],
      ]
    );
  }
}

program
  .command('analytics')
  .description('Account or video analytics')
  .option('--video <id>', 'Video ID (omit for account-level)')
  .option('--period <p>', '7d or 30d', '30d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await ttAnalytics({ videoId: opts.video || null, period: opts.period, json: !!opts.json });
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- comments ----
const comments = program.command('comments').description('Manage video comments');

export async function ttCommentsList(opts) {
  const headers = getAuthHeaders('tiktok');

  const res = await axios.get(`${TT_API}/comment/list/`, {
    params: { video_id: opts.videoId, count: 20 },
    headers,
  });

  const items = res.data?.data?.comments || [];
  if (opts.json) return printJSON(items);
  if (!items.length) { console.log('No comments.'); return; }

  printTable(
    ['ID', 'Username', 'Text', 'Likes', 'Date'],
    items.map(c => [
      c.id,
      c.user?.display_name || '?',
      (c.text || '').slice(0, 50),
      c.like_count ?? '?',
      formatDate(c.create_time),
    ])
  );
}

comments
  .command('list <video-id>')
  .description('List comments on a TikTok video')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (videoId, opts) => {
    try {
      await ttCommentsList({ videoId, json: !!opts.json });
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

export async function ttCommentsReply(opts) {
  const headers = getAuthHeaders('tiktok');

  const res = await axios.post(`${TT_API}/comment/create/`, {
    video_id: opts.videoId,
    parent_comment_id: opts.commentId,
    text: opts.body,
  }, { headers });

  printSuccess(`Reply posted: ${res.data?.data?.comment_id || 'ok'}`);
}

comments
  .command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--body <b>', 'Reply text')
  .option('--video <videoId>', 'Video ID (required for TikTok API)')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      if (!opts.video) {
        console.error(chalk.red('--video <videoId> is required for TikTok comment replies'));
        process.exit(1);
      }
      await ttCommentsReply({ commentId, videoId: opts.video, body: opts.body });
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

// ---- dms ----
const dms = program.command('dms').description('Manage TikTok DMs (requires message.send scope)');

dms
  .command('list')
  .description('List DM conversations')
  .option('--json', 'Output JSON')
  .action(async (opts) => {
    try {
      const headers = getAuthHeaders('tiktok');
      const res = await axios.get(`${TT_API}/dm/conversation/list/`, { headers });
      if (opts.json) return printJSON(res.data);
      const items = res.data?.data?.conversations || [];
      if (!items.length) { console.log('No DM conversations.'); return; }
      printTable(
        ['Conversation ID', 'Participants', 'Last Message'],
        items.map(c => [
          c.conversation_id,
          (c.participants || []).map(p => p.display_name || p.open_id).join(', '),
          (c.last_message?.message_content?.text || '').slice(0, 40),
        ])
      );
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require message.send scope — TikTok app review may be needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

dms
  .command('read <conversation-id>')
  .description('Read a DM conversation')
  .option('--json', 'Output JSON')
  .action(async (conversationId, opts) => {
    try {
      const headers = getAuthHeaders('tiktok');
      const res = await axios.get(`${TT_API}/dm/conversation/${conversationId}/messages/`, { headers });
      if (opts.json) return printJSON(res.data);
      const msgs = res.data?.data?.messages || [];
      if (!msgs.length) { console.log('No messages.'); return; }
      printTable(
        ['From', 'Message', 'Date'],
        msgs.map(m => [
          m.sender?.display_name || '?',
          (m.message_content?.text || '').slice(0, 60),
          formatDate(m.create_time),
        ])
      );
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require message.send scope — TikTok app review may be needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

dms
  .command('send <conversation-id>')
  .description('Send a DM reply')
  .requiredOption('--body <b>', 'Message text')
  .action(async (conversationId, opts) => {
    try {
      const headers = getAuthHeaders('tiktok');
      const res = await axios.post(`${TT_API}/dm/send/`, {
        conversation_id: conversationId,
        message_content: { message_type: 'text', text: opts.body },
      }, { headers });
      printSuccess(`Message sent: ${res.data?.data?.message_id || 'ok'}`);
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require message.send scope — TikTok app review may be needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

if (process.env.NODE_ENV !== 'test') {
  program.parse();
}
