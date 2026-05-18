import { jest } from '@jest/globals';

// Mock chalk before importing output.js
jest.unstable_mockModule('chalk', () => ({
  default: {
    cyan: (s) => s,
    green: (s) => s,
    red: (s) => s,
  },
}));

// Mock cli-table3
jest.unstable_mockModule('cli-table3', () => {
  const MockTable = jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    toString: () => 'TABLE_OUTPUT',
  }));
  return { default: MockTable };
});

const { printTable, printJSON, printSuccess } = await import('../lib/output.js');

describe('printTable', () => {
  test('logs table output to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printTable(['Name', 'ID'], [['Foo', '123']]);
    expect(spy).toHaveBeenCalledWith('TABLE_OUTPUT');
    spy.mockRestore();
  });
});

describe('printJSON', () => {
  test('logs pretty-printed JSON to console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printJSON({ key: 'value' });
    expect(spy).toHaveBeenCalledWith(JSON.stringify({ key: 'value' }, null, 2));
    spy.mockRestore();
  });
});

describe('printSuccess', () => {
  test('logs success message', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printSuccess('Done');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Done'));
    spy.mockRestore();
  });
});
