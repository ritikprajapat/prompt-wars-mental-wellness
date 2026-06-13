import { log, logError } from '@/lib/logger';

describe('logger utilities', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('log', () => {
    it('is a function', () => {
      expect(typeof log).toBe('function');
    });
  });

  describe('logError', () => {
    it('is a function', () => {
      expect(typeof logError).toBe('function');
    });

    it('can be called without throwing', () => {
      expect(() => {
        logError('test error');
      }).not.toThrow();
    });
  });
});
