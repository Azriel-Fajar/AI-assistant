// Shared OAuth + YouTube API helpers for the @intipbaliknya Google account. No dependencies: Node 18+ fetch.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CRED_PATH = join(here, 'credentials.json');
export const TOKEN_PATH = join(here, 'tokens.json');

export function client() {
  if (!existsSync(CRED_PATH)) throw new Error('credentials.json not found. See README.md.');
  const c = JSON.parse(readFileSync(CRED_PATH, 'utf8'));
  return c.installed ?? c.web;
}

export async function token(body) {
  const { client_id, client_secret } = client();
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id, client_secret, ...body }),
  });
  const t = await r.json();
  if (!r.ok) throw new Error(`token: ${t.error} ${t.error_description ?? ''}`);
  return t;
}

export function save(t, refresh_token) {
  writeFileSync(TOKEN_PATH, JSON.stringify({
    access_token: t.access_token,
    refresh_token: t.refresh_token ?? refresh_token,
    expires_at: Date.now() + t.expires_in * 1000,
  }, null, 2));
}

async function accessToken() {
  if (!existsSync(TOKEN_PATH)) throw new Error('Not logged in. Run: node auth.js');
  const saved = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
  if (saved.expires_at > Date.now() + 60000) return saved.access_token;
  const t = await token({ grant_type: 'refresh_token', refresh_token: saved.refresh_token });
  save(t, saved.refresh_token);
  return t.access_token;
}

export async function yt(path, params) {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`${path}: ${d.error?.message ?? r.status}`);
  return d;
}

// YouTube Analytics report for the logged-in channel. Rows come back as objects keyed by column name.
export async function ya(params) {
  const r = await fetch(`https://youtubeanalytics.googleapis.com/v2/reports?${new URLSearchParams({ ids: 'channel==MINE', ...params })}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`analytics: ${d.error?.message ?? r.status}`);
  const cols = d.columnHeaders.map(c => c.name);
  return (d.rows ?? []).map(row => Object.fromEntries(row.map((v, i) => [cols[i], v])));
}
