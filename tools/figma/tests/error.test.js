import { jest } from '@jest/globals';

jest.unstable_mockModule('chalk', () => ({
  default: {
    red: (s) => s,
    yellow: (s) => s,
  },
}));

const { handleError, notAuthenticated, fileNotFound, noConnection, badFormat } = await import('../lib/error.js');

describe('handleError', () => {
  test('prints message and exits 1 for Error object', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    handleError(new Error('boom'));
    expect(errSpy).toHaveBeenCalledWith(expect.any(String), 'boom');
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('prints raw error in debug mode', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const err = new Error('raw');
    handleError(err, true);
    expect(errSpy).toHaveBeenCalledWith(expect.any(String), err);
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('notAuthenticated', () => {
  test('prints auth hint and exits 1', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    notAuthenticated();
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('figma auth --token'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('fileNotFound', () => {
  test('prints file-not-found message with id and exits 1', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    fileNotFound('abc123');
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('abc123'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('noConnection', () => {
  test('prints network error and exits 1', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    noConnection();
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('No connection'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('badFormat', () => {
  test('prints format error and exits 1', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    badFormat();
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('png, svg, or pdf'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
