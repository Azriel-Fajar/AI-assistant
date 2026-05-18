import { jest } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Use a temp file for tokens
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-test-'));
const tokensPath = path.join(tmpDir, 'tokens.json');
process.env.SOCIAL_TOKENS_PATH = tokensPath;

const { getToken, saveToken, getAuthHeaders } = await import('../auth/instagram.js');

afterEach(() => {
  if (fs.existsSync(tokensPath)) fs.unlinkSync(tokensPath);
  jest.clearAllMocks();
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('saveToken', () => {
  it('writes instagram token to tokens.json', () => {
    saveToken('instagram', { access_token: 'ig_abc', expires_in: 5183944 });
    const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    expect(data.instagram.access_token).toBe('ig_abc');
  });
});

describe('getToken', () => {
  it('returns token when it exists', () => {
    fs.writeFileSync(tokensPath, JSON.stringify({ instagram: { access_token: 'ig_xyz' } }));
    const token = getToken('instagram');
    expect(token.access_token).toBe('ig_xyz');
  });

  it('returns null when no token', () => {
    expect(getToken('instagram')).toBeNull();
  });
});

describe('getAuthHeaders', () => {
  it('exits if no token', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    getAuthHeaders('instagram');
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('returns Authorization header when token exists', () => {
    fs.writeFileSync(tokensPath, JSON.stringify({ instagram: { access_token: 'ig_valid' } }));
    const headers = getAuthHeaders('instagram');
    expect(headers.Authorization).toBe('Bearer ig_valid');
  });
});
