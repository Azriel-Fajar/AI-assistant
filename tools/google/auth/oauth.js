import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import * as readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '..', 'config.json');
const TOKEN_PATH = join(__dirname, 'tokens.json');

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/drive',
];

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error('config.json not found. Copy and fill in tools/google/config.json');
    process.exit(1);
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
}

export function createOAuthClient() {
  const config = loadConfig();
  return new google.auth.OAuth2(
    config.google_client_id,
    config.google_client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );
}

export async function getAuthenticatedClient() {
  const client = createOAuthClient();

  if (existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
    client.setCredentials(tokens);

    // Auto-refresh if expired
    if (tokens.expiry_date && Date.now() > tokens.expiry_date - 60000) {
      const { credentials } = await client.refreshAccessToken();
      writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
      client.setCredentials(credentials);
    }

    return client;
  }

  console.error('Not authenticated. Run: gcal auth');
  process.exit(1);
}

export async function runAuthFlow() {
  const client = createOAuthClient();
  const authUrl = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('Opening browser for Google auth...');
  await open(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Paste the auth code here: ', resolve));
  rl.close();

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('Authenticated. Token saved.');
  return client;
}
