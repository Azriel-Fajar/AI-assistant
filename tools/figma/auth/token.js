import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function configPath() {
  return process.env.FIGMA_CONFIG_PATH
    || path.join(__dirname, '..', 'config.json');
}

export function storeToken(token) {
  fs.writeFileSync(configPath(), JSON.stringify({ token }, null, 2), 'utf8');
}

export function retrieveToken() {
  const p = configPath();
  if (!fs.existsSync(p)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    return data.token || null;
  } catch {
    return null;
  }
}

export async function validateToken(token) {
  const res = await axios.get('https://api.figma.com/v1/me', {
    headers: { 'X-Figma-Token': token },
  });
  return res.data;
}
