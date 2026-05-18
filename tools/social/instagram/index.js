#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import { getToken, saveToken, getAuthHeaders } from '../auth/instagram.js';
import { printTable, printJSON, printSuccess, printInfo } from '../lib/output.js';
import { handleError, notAuthenticated } from '../lib/error.js';

const IG_API = 'https://graph.instagram.com/v21.0';

function isNetworkError(err) {
  return err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
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

program.name('ig').description('Instagram CLI');

// ---- auth ----
program
  .command('auth')
  .description('Authenticate with Instagram (Meta OAuth)')
  .action(async () => {
    console.log(chalk.yellow('Instagram OAuth requires setting up a Meta app.'));
    console.log('1. Go to developers.facebook.com and create an app');
    console.log('2. Add your App ID and Secret to tools/social/config.json');
    console.log('3. Generate a long-lived access token and run:');
    console.log('   ig auth --token <your-token>');
  });

// ---- auth:token (quick token setup) ----
program
  .command('auth:token')
  .description('Store an Instagram access token directly')
  .requiredOption('--token <t>', 'Instagram access token')
  .action(async (opts) => {
    try {
      saveToken('instagram', { access_token: opts.token });
      printSuccess('Instagram token saved.');
    } catch (err) {
      handleError(err);
    }
  });

// ---- post ----
program
  .command('post')
  .description('Create an Instagram feed post (requires public image URL)')
  .option('--image-url <url>', 'Public URL of the image to post')
  .option('--caption <text>', 'Post caption')
  .option('--tags <tags>', 'Hashtags to append to caption')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      if (!opts.imageUrl) {
        console.error(chalk.red('--image-url is required (Instagram API requires a public URL)'));
        process.exit(1);
      }
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');
      const caption = [opts.caption || '', opts.tags || ''].filter(Boolean).join(' ');

      printInfo('Creating media container...');
      const container = await axios.post(`${IG_API}/me/media`, null, {
        params: { image_url: opts.imageUrl, caption, access_token: token },
        headers,
      });
      const containerId = container.data.id;

      printInfo('Publishing post...');
      const publish = await axios.post(`${IG_API}/me/media_publish`, null, {
        params: { creation_id: containerId, access_token: token },
        headers,
      });

      if (opts.debug) return printJSON(publish.data);
      printSuccess(`Post published: ${publish.data.id}`);
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- reels ----
program
  .command('reels')
  .description('Post an Instagram Reel (requires public video URL)')
  .option('--video-url <url>', 'Public URL of the video')
  .option('--caption <text>', 'Reel caption')
  .option('--tags <tags>', 'Hashtags to append')
  .option('--cover-url <url>', 'Custom cover image URL')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      if (!opts.videoUrl) {
        console.error(chalk.red('--video-url is required (Instagram API requires a public URL)'));
        process.exit(1);
      }
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');
      const caption = [opts.caption || '', opts.tags || ''].filter(Boolean).join(' ');

      printInfo('Creating Reel container...');
      const params = {
        media_type: 'REELS',
        video_url: opts.videoUrl,
        caption,
        access_token: token,
      };
      if (opts.coverUrl) params.cover_url = opts.coverUrl;

      const container = await axios.post(`${IG_API}/me/media`, null, { params, headers });
      const containerId = container.data.id;

      printInfo('Publishing Reel...');
      const publish = await axios.post(`${IG_API}/me/media_publish`, null, {
        params: { creation_id: containerId, access_token: token },
        headers,
      });

      if (opts.debug) return printJSON(publish.data);
      printSuccess(`Reel published: ${publish.data.id}`);
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- stories ----
program
  .command('stories')
  .description('Post an Instagram Story (requires public image URL)')
  .option('--image-url <url>', 'Public URL of the image')
  .option('--caption <text>', 'Story caption (overlay text)')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      if (!opts.imageUrl) {
        console.error(chalk.red('--image-url is required'));
        process.exit(1);
      }
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');

      const container = await axios.post(`${IG_API}/me/media`, null, {
        params: { image_url: opts.imageUrl, media_type: 'STORIES', access_token: token },
        headers,
      });
      const publish = await axios.post(`${IG_API}/me/media_publish`, null, {
        params: { creation_id: container.data.id, access_token: token },
        headers,
      });

      if (opts.debug) return printJSON(publish.data);
      printSuccess(`Story posted: ${publish.data.id}`);
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- list ----
export async function igList(opts) {
  const headers = getAuthHeaders('instagram');
  const token = headers.Authorization.replace('Bearer ', '');

  const res = await axios.get(`${IG_API}/me/media`, {
    params: {
      fields: 'id,caption,media_type,permalink,timestamp',
      limit: opts.limit,
      access_token: token,
    },
    headers,
  });

  const items = res.data.data || [];

  if (opts.json) {
    return printJSON(items);
  }

  if (!items.length) {
    console.log('No posts found.');
    return;
  }

  printTable(
    ['ID', 'Type', 'Caption (preview)', 'Date', 'Link'],
    items.map(i => [
      i.id,
      i.media_type,
      (i.caption || '').slice(0, 40) + ((i.caption || '').length > 40 ? '...' : ''),
      formatDate(i.timestamp),
      i.permalink || '',
    ])
  );
}

program
  .command('list')
  .description('List your Instagram posts')
  .option('--limit <n>', 'Max results', '10')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await igList({ limit: parseInt(opts.limit), json: !!opts.json });
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- analytics ----
export async function igAnalytics(opts) {
  const headers = getAuthHeaders('instagram');
  const token = headers.Authorization.replace('Bearer ', '');

  if (opts.postId) {
    const res = await axios.get(`${IG_API}/${opts.postId}/insights`, {
      params: {
        metric: 'reach,impressions,likes_count,comments_count',
        period: 'lifetime',
        access_token: token,
      },
      headers,
    });

    const data = res.data.data || [];
    if (opts.json) return printJSON(data);

    printTable(
      ['Metric', 'Value'],
      data.map(m => [m.name, m.values?.[0]?.value ?? m.value ?? '?'])
    );
  } else {
    const res = await axios.get(`${IG_API}/me`, {
      params: {
        fields: 'followers_count,media_count',
        access_token: token,
      },
      headers,
    });

    if (opts.json) return printJSON(res.data);
    printTable(
      ['Metric', 'Value'],
      [
        ['followers_count', res.data.followers_count ?? '?'],
        ['media_count', res.data.media_count ?? '?'],
      ]
    );
  }
}

program
  .command('analytics')
  .description('Account or post insights')
  .option('--post <id>', 'Post ID (omit for account-level)')
  .option('--period <p>', '7d or 30d', '30d')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      await igAnalytics({ postId: opts.post || null, period: opts.period, json: !!opts.json });
    } catch (err) {
      if (isNetworkError(err)) { console.error(chalk.red('No connection. Check network.')); process.exit(1); }
      handleError(err, opts.debug);
    }
  });

// ---- comments ----
const comments = program.command('comments').description('Manage post comments');

export async function igCommentsList(opts) {
  const headers = getAuthHeaders('instagram');
  const token = headers.Authorization.replace('Bearer ', '');

  const res = await axios.get(`${IG_API}/${opts.postId}/comments`, {
    params: {
      fields: 'id,text,username,timestamp',
      access_token: token,
    },
    headers,
  });

  const items = res.data.data || [];

  if (opts.json) return printJSON(items);
  if (!items.length) { console.log('No comments.'); return; }

  printTable(
    ['ID', 'Username', 'Text', 'Date'],
    items.map(c => [c.id, c.username || '?', (c.text || '').slice(0, 50), formatDate(c.timestamp)])
  );
}

comments
  .command('list <post-id>')
  .description('List comments on a post')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (postId, opts) => {
    try {
      await igCommentsList({ postId, json: !!opts.json });
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

export async function igCommentsReply(opts) {
  const headers = getAuthHeaders('instagram');
  const token = headers.Authorization.replace('Bearer ', '');

  const res = await axios.post(`${IG_API}/${opts.commentId}/replies`, null, {
    params: { message: opts.body, access_token: token },
    headers,
  });

  printSuccess(`Reply posted: ${res.data.id}`);
}

comments
  .command('reply <comment-id>')
  .description('Reply to a comment')
  .requiredOption('--body <b>', 'Reply text')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      await igCommentsReply({ commentId, body: opts.body });
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

export async function igCommentsDelete(opts) {
  const headers = getAuthHeaders('instagram');
  const token = headers.Authorization.replace('Bearer ', '');

  await axios.delete(`${IG_API}/${opts.commentId}`, {
    params: { access_token: token },
    headers,
  });

  printSuccess(`Deleted comment: ${opts.commentId}`);
}

comments
  .command('delete <comment-id>')
  .description('Delete a comment')
  .option('--yolo', 'Skip confirmation')
  .option('--debug', 'Show raw API response')
  .action(async (commentId, opts) => {
    try {
      if (!opts.yolo) {
        const { createInterface } = await import('readline');
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        const answer = await new Promise(resolve => rl.question(`Delete comment ${commentId}? (y/n) `, resolve));
        rl.close();
        if (answer.toLowerCase() !== 'y') { console.log('Cancelled.'); return; }
      }
      await igCommentsDelete({ commentId });
    } catch (err) {
      handleError(err, opts.debug);
    }
  });

// ---- dms ----
const dms = program.command('dms').description('Manage Instagram DMs (requires instagram_manage_messages scope)');

dms
  .command('list')
  .description('List DM threads')
  .option('--json', 'Output JSON')
  .option('--debug', 'Show raw API response')
  .action(async (opts) => {
    try {
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');
      const res = await axios.get(`${IG_API}/me/conversations`, {
        params: { fields: 'id,participants,updated_time', access_token: token },
        headers,
      });
      if (opts.debug || opts.json) return printJSON(res.data);
      const items = res.data.data || [];
      if (!items.length) { console.log('No DM threads.'); return; }
      printTable(
        ['Thread ID', 'Participants', 'Updated'],
        items.map(t => [
          t.id,
          (t.participants?.data || []).map(p => p.name || p.id).join(', '),
          formatDate(t.updated_time),
        ])
      );
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require instagram_manage_messages scope — Meta app review needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

dms
  .command('read <thread-id>')
  .description('Read a DM thread')
  .option('--json', 'Output JSON')
  .action(async (threadId, opts) => {
    try {
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');
      const res = await axios.get(`${IG_API}/${threadId}/messages`, {
        params: { fields: 'id,message,from,created_time', access_token: token },
        headers,
      });
      if (opts.json) return printJSON(res.data);
      const msgs = res.data.data || [];
      if (!msgs.length) { console.log('No messages.'); return; }
      printTable(
        ['From', 'Message', 'Date'],
        msgs.map(m => [m.from?.name || '?', (m.message || '').slice(0, 60), formatDate(m.created_time)])
      );
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require instagram_manage_messages scope — Meta app review needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

dms
  .command('send <thread-id>')
  .description('Send a DM reply')
  .requiredOption('--body <b>', 'Message text')
  .action(async (threadId, opts) => {
    try {
      const headers = getAuthHeaders('instagram');
      const token = headers.Authorization.replace('Bearer ', '');
      const res = await axios.post(`${IG_API}/me/messages`, null, {
        params: { recipient: JSON.stringify({ thread_key: threadId }), message: JSON.stringify({ text: opts.body }), access_token: token },
        headers,
      });
      printSuccess(`Message sent: ${res.data.message_id || 'ok'}`);
    } catch (err) {
      if (err?.response?.status === 403) {
        console.error(chalk.yellow('DMs require instagram_manage_messages scope — Meta app review needed.'));
        process.exit(1);
      }
      handleError(err, opts.debug);
    }
  });

if (process.env.NODE_ENV !== 'test') {
  program.parse();
}
