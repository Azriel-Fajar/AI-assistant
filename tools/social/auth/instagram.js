import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function tokensPath() {
  return process.env.SOCIAL_TOKENS_PATH
    || path.join(__dirname, 'tokens.json');
}

function readTokens() {
  const p = tokensPath();
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

export function saveToken(platform, tokenData) {
  const tokens = readTokens();
  tokens[platform] = tokenData;
  fs.writeFileSync(tokensPath(), JSON.stringify(tokens, null, 2), 'utf8');
}

export function getToken(platform) {
  const tokens = readTokens();
  return tokens[platform] || null;
}

export function getAuthHeaders(platform) {
  const token = getToken(platform);
  if (!token || !token.access_token) {
    console.error(chalk.yellow(`Not authenticated. Run: ig auth`));
    process.exit(1);
    return; // Ensure we don't continue
  }
  return { Authorization: `Bearer ${token.access_token}` };
}
