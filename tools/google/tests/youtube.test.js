// tools/google/tests/youtube.test.js
// ESM Jest: use jest.unstable_mockModule + dynamic import pattern

import { jest } from '@jest/globals';

// --- Mock fn declarations (used inside unstable_mockModule factories) ---
const mockVideosList = jest.fn();
const mockVideosInsert = jest.fn();
const mockSearchList = jest.fn();
const mockReportsDimAndMetrics = jest.fn();
const mockCommentThreadsList = jest.fn();
const mockCommentsList = jest.fn();
const mockCommentsInsert = jest.fn();
const mockCommentsDelete = jest.fn();
const mockChannelsList = jest.fn();
const mockPlaylistItemsList = jest.fn();

// Mock googleapis
jest.unstable_mockModule('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      videos: { list: mockVideosList, insert: mockVideosInsert },
      search: { list: mockSearchList },
      channels: { list: mockChannelsList },
      playlistItems: { list: mockPlaylistItemsList },
      commentThreads: { list: mockCommentThreadsList },
      comments: { list: mockCommentsList, insert: mockCommentsInsert, delete: mockCommentsDelete },
    })),
    youtubeAnalytics: jest.fn(() => ({
      reports: { query: mockReportsDimAndMetrics },
    })),
  },
}));

// Mock auth
jest.unstable_mockModule('../auth/oauth.js', () => ({
  getAuthenticatedClient: jest.fn().mockResolvedValue({ mock: 'authClient' }),
  runAuthFlow: jest.fn().mockResolvedValue(undefined),
}));

// Mock output helpers
const mockPrintTable = jest.fn();
const mockPrintJson = jest.fn();
const mockPrintSuccess = jest.fn();
const mockPrintInfo = jest.fn();

jest.unstable_mockModule('../lib/output.js', () => ({
  printTable: mockPrintTable,
  printJson: mockPrintJson,
  printSuccess: mockPrintSuccess,
  printInfo: mockPrintInfo,
}));

// Mock error handler
jest.unstable_mockModule('../lib/error.js', () => ({
  handleError: jest.fn(),
}));

// Mock fs — existsSync and createReadStream
const mockExistsSync = jest.fn();
const mockCreateReadStream = jest.fn().mockReturnValue('MOCK_STREAM');

jest.unstable_mockModule('fs', () => ({
  existsSync: mockExistsSync,
  createReadStream: mockCreateReadStream,
  statSync: jest.fn().mockReturnValue({ size: 1024 }),
}));

// Mock chalk
jest.unstable_mockModule('chalk', () => ({
  default: {
    red: jest.fn(s => s),
    green: jest.fn(s => s),
  },
}));

// Capture process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

// Dynamic import — must come AFTER all unstable_mockModule calls
const { listVideos, uploadVideo, searchVideos, getAnalytics, listComments, replyToComment, deleteComment, runAuth } = await import('../youtube/index.js');
const { runAuthFlow } = await import('../auth/oauth.js');

// Expose mocks for completeness
export {
  mockVideosList,
  mockVideosInsert,
  mockSearchList,
  mockReportsDimAndMetrics,
  mockCommentThreadsList,
  mockCommentsList,
  mockCommentsInsert,
  mockCommentsDelete,
  mockChannelsList,
  mockPlaylistItemsList,
  mockExit,
};

// --- Scaffold ---
describe('YouTube CLI mock scaffold', () => {
  test('mock setup loads without error', () => {
    expect(true).toBe(true);
  });
});

// --- Task 3: yt list ---

describe('yt list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChannelsList.mockResolvedValue({
      data: {
        items: [{ contentDetails: { relatedPlaylists: { uploads: 'PLxxx123' } } }],
      },
    });
    mockPlaylistItemsList.mockResolvedValue({
      data: {
        items: [
          {
            snippet: {
              title: 'My First Video',
              resourceId: { videoId: 'vid001' },
              publishedAt: '2026-05-01T10:00:00Z',
            },
          },
          {
            snippet: {
              title: 'Second Video',
              resourceId: { videoId: 'vid002' },
              publishedAt: '2026-05-10T10:00:00Z',
            },
          },
        ],
      },
    });
  });

  test('prints table with video list', async () => {
    await listVideos({ limit: 10, json: false });
    expect(mockChannelsList).toHaveBeenCalledWith({
      part: ['contentDetails'],
      mine: true,
    });
    expect(mockPlaylistItemsList).toHaveBeenCalledWith({
      part: ['snippet'],
      playlistId: 'PLxxx123',
      maxResults: 10,
    });
    expect(mockPrintTable).toHaveBeenCalledWith(
      ['Video ID', 'Title', 'Published'],
      [
        ['vid001', 'My First Video', expect.any(String)],
        ['vid002', 'Second Video', expect.any(String)],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await listVideos({ limit: 5, json: true });
    expect(mockPrintJson).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ videoId: 'vid001', title: 'My First Video' }),
      ])
    );
  });
});

// --- Task 4: yt upload ---

describe('yt upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockVideosInsert.mockResolvedValue({
      data: { id: 'newVid001', snippet: { title: 'Test Video' } },
    });
  });

  test('uploads video and prints success', async () => {
    await uploadVideo({
      file: '/fake/video.mp4',
      title: 'Test Video',
      description: 'A test upload',
      tags: ['tag1', 'tag2'],
      privacy: 'private',
      yolo: true,
    });

    expect(mockVideosInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'Test Video',
            description: 'A test upload',
            tags: ['tag1', 'tag2'],
          },
          status: { privacyStatus: 'private' },
        },
      })
    );
    expect(mockPrintSuccess).toHaveBeenCalledWith(expect.stringContaining('newVid001'));
  });

  test('exits with error when file does not exist', async () => {
    mockExistsSync.mockReturnValue(false);

    await expect(
      uploadVideo({
        file: '/no/such/file.mp4',
        title: 'X',
        description: '',
        tags: [],
        privacy: 'private',
        yolo: true,
      })
    ).rejects.toThrow('process.exit');

    expect(mockVideosInsert).not.toHaveBeenCalled();
  });
});

// --- Task 5: yt search ---

describe('yt search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchList.mockResolvedValue({
      data: {
        items: [
          {
            id: { videoId: 'srch001' },
            snippet: { title: 'Result One', channelTitle: 'Chan A', publishedAt: '2026-01-01T00:00:00Z' },
          },
          {
            id: { videoId: 'srch002' },
            snippet: { title: 'Result Two', channelTitle: 'Chan B', publishedAt: '2026-02-01T00:00:00Z' },
          },
        ],
      },
    });
  });

  test('calls search.list and prints table', async () => {
    await searchVideos({ query: 'react tutorial', json: false });

    expect(mockSearchList).toHaveBeenCalledWith({
      part: ['snippet'],
      q: 'react tutorial',
      type: ['video'],
      maxResults: 10,
    });

    expect(mockPrintTable).toHaveBeenCalledWith(
      ['Video ID', 'Title', 'Channel', 'Published'],
      [
        ['srch001', 'Result One', 'Chan A', expect.any(String)],
        ['srch002', 'Result Two', 'Chan B', expect.any(String)],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await searchVideos({ query: 'react', json: true });
    expect(mockPrintJson).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ videoId: 'srch001', title: 'Result One' }),
      ])
    );
  });
});

// --- Task 6: yt analytics ---

describe('yt analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReportsDimAndMetrics.mockResolvedValue({
      data: {
        columnHeaders: [
          { name: 'day' },
          { name: 'views' },
          { name: 'likes' },
          { name: 'comments' },
        ],
        rows: [
          ['2026-05-01', 120, 10, 2],
          ['2026-05-02', 200, 20, 5],
        ],
      },
    });
  });

  test('queries channel analytics for 7d period', async () => {
    await getAnalytics({ videoId: null, period: '7d', json: false });

    expect(mockReportsDimAndMetrics).toHaveBeenCalledWith(
      expect.objectContaining({
        ids: 'channel==MINE',
        dimensions: 'day',
        metrics: 'views,likes,comments,estimatedMinutesWatched',
        sort: 'day',
      })
    );

    expect(mockPrintTable).toHaveBeenCalledWith(
      ['day', 'views', 'likes', 'comments'],
      [
        ['2026-05-01', 120, 10, 2],
        ['2026-05-02', 200, 20, 5],
      ]
    );
  });

  test('queries video-specific analytics when --video is set', async () => {
    await getAnalytics({ videoId: 'vid123', period: '30d', json: false });

    expect(mockReportsDimAndMetrics).toHaveBeenCalledWith(
      expect.objectContaining({
        ids: 'channel==MINE',
        filters: 'video==vid123',
      })
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await getAnalytics({ videoId: null, period: '7d', json: true });
    expect(mockPrintJson).toHaveBeenCalledWith(
      expect.objectContaining({ rows: expect.any(Array) })
    );
  });
});

// --- Task 7: yt comments list ---

describe('yt comments list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentThreadsList.mockResolvedValue({
      data: {
        items: [
          {
            id: 'ct001',
            snippet: {
              topLevelComment: {
                id: 'c001',
                snippet: {
                  textDisplay: 'Great video!',
                  authorDisplayName: 'Alice',
                  publishedAt: '2026-05-10T08:00:00Z',
                  likeCount: 5,
                },
              },
              totalReplyCount: 2,
            },
          },
          {
            id: 'ct002',
            snippet: {
              topLevelComment: {
                id: 'c002',
                snippet: {
                  textDisplay: 'Nice work!',
                  authorDisplayName: 'Bob',
                  publishedAt: '2026-05-11T09:00:00Z',
                  likeCount: 1,
                },
              },
              totalReplyCount: 0,
            },
          },
        ],
      },
    });
  });

  test('lists comments with table output', async () => {
    await listComments({ videoId: 'vid001', json: false });

    expect(mockCommentThreadsList).toHaveBeenCalledWith({
      part: ['snippet'],
      videoId: 'vid001',
      maxResults: 20,
      order: 'time',
    });

    expect(mockPrintTable).toHaveBeenCalledWith(
      ['Comment ID', 'Author', 'Text (preview)', 'Likes', 'Replies'],
      [
        ['c001', 'Alice', 'Great video!', 5, 2],
        ['c002', 'Bob', 'Nice work!', 1, 0],
      ]
    );
  });

  test('prints JSON when --json flag is set', async () => {
    await listComments({ videoId: 'vid001', json: true });
    expect(mockPrintJson).toHaveBeenCalledWith(expect.any(Array));
  });
});

// --- Task 8: yt comments reply ---

describe('yt comments reply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentsInsert.mockResolvedValue({
      data: { id: 'reply001', snippet: { textDisplay: 'Thanks!' } },
    });
  });

  test('inserts a reply comment and prints success', async () => {
    await replyToComment({ commentId: 'c001', body: 'Thanks!' });

    expect(mockCommentsInsert).toHaveBeenCalledWith({
      part: ['snippet'],
      requestBody: {
        snippet: {
          parentId: 'c001',
          textOriginal: 'Thanks!',
        },
      },
    });

    expect(mockPrintSuccess).toHaveBeenCalledWith(expect.stringContaining('reply001'));
  });
});

// --- Task 9: yt comments delete ---

describe('yt comments delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCommentsList.mockResolvedValue({
      data: {
        items: [
          { id: 'c001', snippet: { textDisplay: 'This is the comment text to preview.' } },
        ],
      },
    });
    mockCommentsDelete.mockResolvedValue({ data: {} });
  });

  test('deletes comment with --yolo flag (no confirmation)', async () => {
    await deleteComment({ commentId: 'c001', yolo: true });

    expect(mockCommentsDelete).toHaveBeenCalledWith({ id: 'c001' });
    expect(mockPrintSuccess).toHaveBeenCalledWith(expect.stringContaining('c001'));
  });
});

// --- Task 10: yt auth ---

describe('yt auth', () => {
  beforeEach(() => jest.clearAllMocks());

  test('delegates to runAuthFlow', async () => {
    await runAuth();
    expect(runAuthFlow).toHaveBeenCalledTimes(1);
  });
});
