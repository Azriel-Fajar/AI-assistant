import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';

jest.unstable_mockModule('../auth/tiktok.js', () => ({
  getToken: jest.fn(() => ({ access_token: 'tt_test_token' })),
  saveToken: jest.fn(),
  getAuthHeaders: jest.fn(() => ({ Authorization: 'Bearer tt_test_token' })),
}));

jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.unstable_mockModule('../lib/output.js', () => ({
  printTable: jest.fn(),
  printJSON: jest.fn(),
  printSuccess: jest.fn(),
  printInfo: jest.fn(),
}));

const axios = (await import('axios')).default;
const { printTable, printJSON } = await import('../lib/output.js');
const { ttList } = await import('../tiktok/index.js');

describe('tt list', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches videos and prints table', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          videos: [
            { id: 'v1', title: 'My First Video', view_count: 1000, like_count: 50, comment_count: 5, create_time: 1714550400 },
            { id: 'v2', title: 'Second Video', view_count: 500, like_count: 30, comment_count: 2, create_time: 1715760000 },
          ],
        },
      },
    });

    await ttList({ limit: 10, json: false });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/video/list/'),
      expect.objectContaining({ max_count: 10 }),
      expect.any(Object)
    );
    expect(printTable).toHaveBeenCalledWith(
      ['ID', 'Title', 'Views', 'Likes', 'Comments', 'Date'],
      expect.arrayContaining([
        expect.arrayContaining(['v1', 'My First Video', 1000, 50, 5]),
      ])
    );
  });

  test('prints JSON when --json flag set', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: { videos: [{ id: 'v1' }] } } });
    await ttList({ limit: 5, json: true });
    expect(printJSON).toHaveBeenCalledWith(expect.any(Array));
  });
});
