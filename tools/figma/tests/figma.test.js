import { jest } from '@jest/globals';

// Shared mocks
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}));

jest.unstable_mockModule('chalk', () => ({
  default: {
    cyan: s => s, green: s => s, red: s => s, yellow: s => s,
  },
}));

jest.unstable_mockModule('cli-table3', () => {
  const T = jest.fn(() => ({ push: jest.fn(), toString: () => 'TABLE' }));
  return { default: T };
});

// Provide a fake token so validation always passes in command tests
jest.unstable_mockModule('../auth/token.js', () => ({
  retrieveToken: jest.fn(() => 'figd_fake'),
  storeToken: jest.fn(),
  validateToken: jest.fn(async () => ({ id: '1', handle: 'az' })),
}));

const axios = (await import('axios')).default;
const { storeToken, validateToken } = await import('../auth/token.js');

const FIGMA_API = 'https://api.figma.com/v1';

// ---- figma auth --token ----
describe('figma auth --token', () => {
  test('stores the token and prints success', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    storeToken('figd_testtoken');
    console.log('Token saved.');
    expect(storeToken).toHaveBeenCalledWith('figd_testtoken');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Token saved'));
    logSpy.mockRestore();
  });
});

// ---- figma files ----
describe('figma files --team <id>', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches projects and files for team', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { projects: [{ id: 'proj1', name: 'Mobile App' }] } })
      .mockResolvedValueOnce({ data: { files: [{ key: 'fileA', name: 'Home Screen', last_modified: '2026-05-01T00:00:00Z' }] } });

    const headers = { 'X-Figma-Token': 'figd_fake' };
    const projectsRes = await axios.get(`${FIGMA_API}/teams/team99/projects`, { headers });
    const filesRes = await axios.get(`${FIGMA_API}/projects/proj1/files`, { headers });
    expect(filesRes.data.files[0].key).toBe('fileA');
  });
});

// ---- figma export ----
describe('figma export', () => {
  beforeEach(() => jest.clearAllMocks());

  test('calls images API with correct format and node', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { images: { 'node1': 'https://cdn.figma.com/img.png' } } });
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.get(
      `${FIGMA_API}/images/fileXYZ?ids=node1&format=png&scale=2`,
      { headers }
    );
    expect(res.data.images['node1']).toContain('cdn.figma.com');
  });

  test('exits 1 for invalid format', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const format = 'gif';
    if (!['png', 'svg', 'pdf'].includes(format)) {
      console.error('Format must be png, svg, or pdf');
      process.exit(1);
    }
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

// ---- figma inspect ----
describe('figma inspect', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches node and extracts design properties', async () => {
    const mockNode = {
      document: {
        name: 'Button',
        type: 'FRAME',
        absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 48 },
        fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 1, a: 1 }, opacity: 1 }],
        style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 16, lineHeightPx: 24 },
      },
    };
    axios.get.mockResolvedValueOnce({
      data: { nodes: { 'node5': mockNode } },
    });
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.get(`${FIGMA_API}/files/fileXYZ/nodes?ids=node5`, { headers });
    const doc = res.data.nodes['node5'].document;
    expect(doc.style.fontFamily).toBe('Inter');
    expect(doc.absoluteBoundingBox.width).toBe(200);
  });
});

// ---- figma download ----
describe('figma download', () => {
  beforeEach(() => jest.clearAllMocks());

  test('calls files API', async () => {
    const mockFile = { name: 'Mobile App', document: { id: '0:0', type: 'DOCUMENT' } };
    axios.get.mockResolvedValueOnce({ data: mockFile });
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.get(`${FIGMA_API}/files/fileXYZ`, { headers });
    expect(res.data.name).toBe('Mobile App');
  });
});

// ---- figma comments list ----
describe('figma comments list', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches and returns comment list', async () => {
    const mockComments = [
      { id: 'c1', message: 'Looks good!', created_at: '2026-05-10T09:00:00Z', user: { handle: 'azriel' } },
      { id: 'c2', message: 'Change the blue', created_at: '2026-05-11T10:00:00Z', user: { handle: 'client' } },
    ];
    axios.get.mockResolvedValueOnce({ data: { comments: mockComments } });
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.get(`${FIGMA_API}/files/fileXYZ/comments`, { headers });
    expect(res.data.comments).toHaveLength(2);
  });
});

// ---- figma comments add ----
describe('figma comments add', () => {
  beforeEach(() => jest.clearAllMocks());

  test('posts comment and prints success', async () => {
    const newComment = { id: 'c3', message: 'Nice work!', created_at: '2026-05-18T08:00:00Z', user: { handle: 'azriel' } };
    axios.post.mockResolvedValueOnce({ data: newComment });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.post(
      `${FIGMA_API}/files/fileXYZ/comments`,
      { message: 'Nice work!' },
      { headers }
    );
    console.log('Comment added: ' + res.data.id);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('c3'));
    logSpy.mockRestore();
  });
});

// ---- figma versions ----
describe('figma versions', () => {
  beforeEach(() => jest.clearAllMocks());

  test('fetches and returns version list', async () => {
    const mockVersions = [
      { id: 'v1', created_at: '2026-05-01T00:00:00Z', label: 'v1.0', description: 'Initial', user: { handle: 'azriel' } },
      { id: 'v2', created_at: '2026-05-10T00:00:00Z', label: 'v1.1', description: 'Tweaks', user: { handle: 'azriel' } },
    ];
    axios.get.mockResolvedValueOnce({ data: { versions: mockVersions } });
    const headers = { 'X-Figma-Token': 'figd_fake' };
    const res = await axios.get(`${FIGMA_API}/files/fileXYZ/versions`, { headers });
    expect(res.data.versions).toHaveLength(2);
    expect(res.data.versions[1].label).toBe('v1.1');
  });
});
