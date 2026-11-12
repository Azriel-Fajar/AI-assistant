// One-time login as the @intipbaliknya Google account. Catches Google's redirect on a localhost port
// (the copy-paste "oob" flow is blocked for new OAuth clients) and saves tokens.json next to this file.
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { client, token, save, yt } from './lib.js';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly', // asked now so retention/watch time later needs no new login
];

const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const redirect_uri = `http://127.0.0.1:${server.address().port}`;

const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: client().client_id,
  redirect_uri,
  response_type: 'code',
  scope: SCOPES.join(' '),
  access_type: 'offline',
  prompt: 'consent',
});
console.log(`Log in with the @intipbaliknya Google account:\n${url}\n`);
exec(process.platform === 'win32' ? `start "" "${url}"` : `xdg-open "${url}"`);

const code = await new Promise(resolve => server.on('request', (req, res) => {
  const c = new URL(req.url, redirect_uri).searchParams.get('code');
  res.end(c ? 'Login berhasil. Tab ini boleh ditutup.' : 'Tidak ada kode login.');
  if (c) resolve(c);
}));
server.closeAllConnections();
server.close();

save(await token({ grant_type: 'authorization_code', code, redirect_uri }));
const me = await yt('channels', { part: 'snippet', mine: 'true' });
console.log('Logged in. Channel:', me.items?.map(i => i.snippet.title).join(', ') || '(no channel on this account)');
