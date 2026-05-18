import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';

// Mock auth module
jest.unstable_mockModule('../auth/instagram.js', () => ({
  getToken: jest.fn(() => ({ access_token: 'ig_test_token' })),
  saveToken: jest.fn(),
  getAuthHeaders: jest.fn(() => ({ Authorization: 'Bearer ig_test_token' })),
}));

// Mock axios
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock output
jest.unstable_mockModule('../lib/output.js', () => ({
  printTable: jest.fn(),
  printJSON: jest.fn(),
  printSuccess: jest.fn(),
  printInfo: jest.fn(),
}));

const axios = (await import('axios')).default;
const { printTable, printJSON } = await import('../lib/output.js');
const { igList } = await import('../instagram/index.js');

describe('ig list', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches posts and prints table', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 'p1', caption: 'Hello world', media_type: 'IMAGE', timestamp: '2026-05-01T10:00:00Z', permalink: 'https://ig.com/p/1' },
          { id: 'p2', caption: 'Second post', media_type: 'VIDEO', timestamp: '2026-05-10T10:00:00Z', permalink: 'https://ig.com/p/2' },
        ],
      },
    });

    await igList({ limit: 10, json: false });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/me/media'),
      expect.objectContaining({
        params: expect.objectContaining({ limit: 10 }),
      })
    );
    expect(printTable).toHaveBeenCalledWith(
      ['ID', 'Type', 'Caption (preview)', 'Date', 'Link'],
      expect.arrayContaining([
        expect.arrayContaining(['p1', 'IMAGE']),
      ])
    );
  });

  test('prints JSON when --json flag set', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ id: 'p1', media_type: 'IMAGE' }] } });
    await igList({ limit: 5, json: true });
    expect(printJSON).toHaveBeenCalledWith(expect.any(Array));
  });
});
