import { jest } from '@jest/globals';

// Suppress actual console.log output during tests
let logSpy;
beforeEach(() => { logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); });
afterEach(() => { logSpy.mockRestore(); });

describe('printTable', () => {
  it('calls console.log once with table string', async () => {
    const { printTable } = await import('../lib/output.js');
    printTable(['Name', 'Age'], [['Alice', '30'], ['Bob', '25']]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(typeof output).toBe('string');
    expect(output).toContain('Alice');
    expect(output).toContain('Bob');
  });
});

describe('printJSON', () => {
  it('pretty-prints JSON to console.log', async () => {
    const { printJSON } = await import('../lib/output.js');
    printJSON({ id: '123', name: 'test' });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('"id": "123"');
    expect(output).toContain('"name": "test"');
  });
});

describe('printSuccess', () => {
  it('logs a message containing the text', async () => {
    const { printSuccess } = await import('../lib/output.js');
    printSuccess('Post created');
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('Post created');
  });
});

describe('printInfo', () => {
  it('logs a message containing the text', async () => {
    const { printInfo } = await import('../lib/output.js');
    printInfo('Uploading...');
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('Uploading...');
  });
});
