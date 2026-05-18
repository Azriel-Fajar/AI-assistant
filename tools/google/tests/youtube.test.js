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
const { listVideos, uploadVideo, searchVideos } = await import('../youtube/index.js');

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
