import { jest } from '@jest/globals';

describe('handleError', () => {
  it('exits 1 and prints the error message', async () => {
    const { handleError } = await import('../lib/error.js');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    handleError(new Error('boom'));
    expect(errSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('prints full error object in debug mode', async () => {
    const { handleError } = await import('../lib/error.js');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const err = new Error('debug error');
    handleError(err, true);
    expect(errSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('notAuthenticated', () => {
  it('prints platform-specific hint for ig', async () => {
    const { notAuthenticated } = await import('../lib/error.js');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    notAuthenticated('ig');
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('ig auth'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('prints platform-specific hint for tt', async () => {
    const { notAuthenticated } = await import('../lib/error.js');
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    notAuthenticated('tt');
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('tt auth'));
    expect(exitSpy).toHaveBeenCalledWith(1);
    errSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
