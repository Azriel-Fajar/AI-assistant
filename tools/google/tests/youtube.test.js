// tools/google/tests/youtube.test.js
import { jest } from '@jest/globals';

// --- Mocks must be declared before any import of the module under test ---

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

jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(() => ({
      videos: {
        list: mockVideosList,
        insert: mockVideosInsert,
      },
      search: {
        list: mockSearchList,
      },
      channels: {
        list: mockChannelsList,
      },
      playlistItems: {
        list: mockPlaylistItemsList,
      },
      commentThreads: {
        list: mockCommentThreadsList,
      },
      comments: {
        list: mockCommentsList,
        insert: mockCommentsInsert,
        delete: mockCommentsDelete,
      },
    })),
    youtubeAnalytics: jest.fn(() => ({
      reports: {
        query: mockReportsDimAndMetrics,
      },
    })),
  },
}));

// Mock the shared auth module
jest.mock('../auth/oauth.js', () => ({
  getAuthenticatedClient: jest.fn().mockResolvedValue({ mock: 'authClient' }),
  runAuthFlow: jest.fn().mockResolvedValue(undefined),
}));

// Mock output helpers so tests don't print to stdout
jest.mock('../lib/output.js', () => ({
  printTable: jest.fn(),
  printJson: jest.fn(),
  printSuccess: jest.fn(),
  printInfo: jest.fn(),
}));

// Mock error helpers -- capture exit calls
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

import { printTable, printJson, printSuccess } from '../lib/output.js';

// Expose mocks for use in describe blocks
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

// Placeholder test so jest can parse this file without zero-test error
describe('YouTube CLI mock scaffold', () => {
  test('mock setup loads without error', () => {
    expect(true).toBe(true);
  });
});
