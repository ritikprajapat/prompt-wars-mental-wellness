import {
  jsonResponse,
  errorResponse,
  safeErrorMessage,
  readJsonBody,
  clientKey,
} from '@/lib/http';

// Mock NextResponse since this is a server-side module
jest.mock('next/server', () => ({
  NextResponse: {
    json: (
      body: unknown,
      init?: { status?: number; headers?: Record<string, string> }
    ) => ({
      json: async () => body,
      status: init?.status ?? 200,
      headers: new Map(Object.entries(init?.headers ?? {})),
      get: (key: string) => (init?.headers ?? {})[key],
    }),
  },
}));

describe('http utilities', () => {
  describe('safeErrorMessage', () => {
    it('returns generic message in production', () => {
      const original = (process.env as Record<string, unknown>).NODE_ENV;
      (process.env as Record<string, unknown>).NODE_ENV = 'production';
      expect(safeErrorMessage(new Error('sensitive data'))).toBe(
        'Internal server error'
      );
      (process.env as Record<string, unknown>).NODE_ENV = original;
    });

    it('returns error message in development', () => {
      const original = (process.env as Record<string, unknown>).NODE_ENV;
      (process.env as Record<string, unknown>).NODE_ENV = 'development';
      expect(safeErrorMessage(new Error('test error'))).toBe('test error');
      (process.env as Record<string, unknown>).NODE_ENV = original;
    });

    it('handles non-Error thrown values', () => {
      const original = (process.env as Record<string, unknown>).NODE_ENV;
      (process.env as Record<string, unknown>).NODE_ENV = 'development';
      expect(safeErrorMessage('string error')).toBe('Unknown error');
      expect(safeErrorMessage(null)).toBe('Unknown error');
      (process.env as Record<string, unknown>).NODE_ENV = original;
    });
  });

  describe('clientKey', () => {
    it('returns x-forwarded-for header if present', () => {
      const mockRequest = {
        headers: new Map([['x-forwarded-for', '192.168.1.1']]),
        get: (key: string) => {
          return {
            'x-forwarded-for': '192.168.1.1',
          }[key];
        },
      } as unknown as Request;
      expect(clientKey(mockRequest)).toBe('192.168.1.1');
    });

    it('falls back to host header', () => {
      const mockRequest = {
        headers: new Map([['host', 'example.com']]),
        get: (key: string) => {
          return {
            host: 'example.com',
          }[key];
        },
      } as unknown as Request;
      expect(clientKey(mockRequest)).toBe('example.com');
    });

    it('returns unknown if no headers match', () => {
      const mockRequest = {
        headers: new Map(),
        get: () => null,
      } as unknown as Request;
      expect(clientKey(mockRequest)).toBe('unknown');
    });
  });
});
