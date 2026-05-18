import { jest } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-tt-test-'));
const tokensPath = path.join(tmpDir, 'tokens.json');
process.env.SOCIAL_TOKENS_PATH = tokensPath;

const { getToken, saveToken, getAuthHeaders } = await import('../auth/tiktok.js');

afterEach(() => {
  if (fs.existsSync(tokensPath)) fs.unlinkSync(tokensPath);
  jest.clearAllMocks();
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('saveToken (tiktok)', () => {
  it('writes tiktok token to tokens.json', () => {
    saveToken('tiktok', { access_token: 'tt_abc', expires_in: 86400 });
    const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    expect(data.tiktok.access_token).toBe('tt_abc');
  });
});

describe('getToken (tiktok)', () => {
  it('returns token when it exists', () => {
    fs.writeFileSync(tokensPath, JSON.stringify({ tiktok: { access_token: 'tt_xyz' } }));
    const token = getToken('tiktok');
    expect(token.access_token).toBe('tt_xyz');
  });

  it('returns null when no token', () => {
    expect(getToken('tiktok')).toBeNull();
  });
});

describe('getAuthHeaders (tiktok)', () => {
  it('exits if no token', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    getAuthHeaders('tiktok');
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('returns Authorization header when token exists', () => {
    fs.writeFileSync(tokensPath, JSON.stringify({ tiktok: { access_token: 'tt_valid' } }));
    const headers = getAuthHeaders('tiktok');
    expect(headers.Authorization).toBe('Bearer tt_valid');
  });
});
