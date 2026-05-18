import { jest } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Write config.json to a temp dir and point the module at it via env var
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-test-'));
const configPath = path.join(tmpDir, 'config.json');

// Set env var so token.js uses our temp path
process.env.FIGMA_CONFIG_PATH = configPath;

jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
  },
}));

const { storeToken, retrieveToken, validateToken } = await import('../auth/token.js');
const axiosMod = await import('axios');
const axios = axiosMod.default;

afterEach(() => {
  jest.clearAllMocks();
  if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('storeToken', () => {
  test('writes token to config.json', () => {
    storeToken('figd_abc123');
    const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(data.token).toBe('figd_abc123');
  });
});

describe('retrieveToken', () => {
  test('returns token from config.json', () => {
    fs.writeFileSync(configPath, JSON.stringify({ token: 'figd_xyz' }));
    expect(retrieveToken()).toBe('figd_xyz');
  });

  test('returns null when config.json does not exist', () => {
    expect(retrieveToken()).toBeNull();
  });
});

describe('validateToken', () => {
  test('returns user object when PAT is valid', async () => {
    const user = { id: '123', email: 'az@rielcode.com', handle: 'azriel' };
    axios.get.mockResolvedValueOnce({ data: user });
    const result = await validateToken('figd_valid');
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.figma.com/v1/me',
      { headers: { 'X-Figma-Token': 'figd_valid' } }
    );
    expect(result).toEqual(user);
  });

  test('throws when API returns error', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 403 } });
    await expect(validateToken('bad_token')).rejects.toBeTruthy();
  });
});
