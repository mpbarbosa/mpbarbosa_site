import '../src/jest.setup.js';

describe('jest.setup.js global polyfills and configuration', () => {
  describe('Response polyfill', () => {
    it('should define global.Response as a class', () => {
      expect(typeof global.Response).toBe('function');
      expect(() => new global.Response('{}')).not.toThrow();
    });

    it('should set default status and statusText', () => {
      const res = new global.Response('{"a":1}');
      expect(res.status).toBe(200);
      expect(res.statusText).toBe('OK');
      expect(res.ok).toBe(true);
    });

    it('should set custom status and headers', () => {
      const res = new global.Response('body', { status: 404, statusText: 'Not Found', headers: { foo: 'bar' } });
      expect(res.status).toBe(404);
      expect(res.statusText).toBe('Not Found');
      expect(res.ok).toBe(false);
      expect(res.headers.get('foo')).toBe('bar');
    });

    it('should parse JSON body', async () => {
      const res = new global.Response('{"x":42}');
      await expect(res.json()).resolves.toEqual({ x: 42 });
    });

    it('should return text body', async () => {
      const res = new global.Response('hello');
      await expect(res.text()).resolves.toBe('hello');
    });

    it('should stringify non-string body for text()', async () => {
      const res = new global.Response({ foo: 'bar' });
      await expect(res.text()).resolves.toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('should return a Blob from blob()', async () => {
      const res = new global.Response('blobdata');
      const blob = await res.blob();
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should return an ArrayBuffer from arrayBuffer()', async () => {
      const res = new global.Response('abc');
      const buf = await res.arrayBuffer();
      expect(buf).toBeInstanceOf(ArrayBuffer);
      expect(new Uint8Array(buf)).toEqual(new TextEncoder().encode('abc'));
    });

    it('should clone the response', () => {
      const res = new global.Response('foo', { status: 201 });
      const clone = res.clone();
      expect(clone).not.toBe(res);
      expect(clone.status).toBe(201);
      expect(clone._body).toBe('foo');
    });
  });

  describe('Headers polyfill', () => {
    it('should define global.Headers as a class', () => {
      expect(typeof global.Headers).toBe('function');
      expect(() => new global.Headers({ foo: 'bar' })).not.toThrow();
    });

    it('should set, get, has, and delete headers', () => {
      const headers = new global.Headers();
      headers.set('X-Test', '123');
      expect(headers.get('x-test')).toBe('123');
      expect(headers.has('X-TEST')).toBe(true);
      headers.delete('x-test');
      expect(headers.has('x-test')).toBe(false);
    });

    it('should iterate headers with forEach', () => {
      const headers = new global.Headers({ a: '1', b: '2' });
      const result = {};
      headers.forEach((v, k) => { result[k] = v; });
      expect(result).toEqual({ a: '1', b: '2' });
    });
  });

  describe('AbortController polyfill', () => {
    it('should define global.AbortController as a class', () => {
      expect(typeof global.AbortController).toBe('function');
      expect(() => new global.AbortController()).not.toThrow();
    });

    it('should set signal.aborted to true on abort', () => {
      const ac = new global.AbortController();
      expect(ac.signal.aborted).toBe(false);
      ac.abort();
      expect(ac.signal.aborted).toBe(true);
    });
  });

  describe('TextEncoder/TextDecoder polyfill', () => {
    it('should define global.TextEncoder and TextDecoder as classes', () => {
      expect(typeof global.TextEncoder).toBe('function');
      expect(typeof global.TextDecoder).toBe('function');
    });

    it('should encode and decode strings', () => {
      const encoder = new global.TextEncoder();
      const decoder = new global.TextDecoder();
      const str = 'hello';
      const encoded = encoder.encode(str);
      expect(encoded).toBeInstanceOf(Uint8Array);
      const decoded = decoder.decode(encoded);
      expect(decoded).toBe(str);
    });
  });

  describe('Web Crypto API polyfill', () => {
    it('should define global.crypto with getRandomValues and subtle.digest', async () => {
      expect(global.crypto).toBeDefined();
      expect(typeof global.crypto.getRandomValues).toBe('function');
      expect(typeof global.crypto.subtle.digest).toBe('function');
      const arr = new Uint8Array(8);
      const filled = global.crypto.getRandomValues(arr);
      expect(filled).toBe(arr);
      expect(arr.some(v => v !== 0)).toBe(true);
      const buf = await global.crypto.subtle.digest('SHA-256', new Uint8Array([1, 2, 3]));
      expect(buf).toBeInstanceOf(ArrayBuffer);
      expect(new Uint8Array(buf).length).toBe(32);
    });
  });

  describe('Environment detection globals', () => {
    it('should set IS_TEST_ENV and IS_JSDOM to true', () => {
      expect(global.IS_TEST_ENV).toBe(true);
      expect(global.IS_JSDOM).toBe(true);
    });
  });

  describe('DOM method mocks', () => {
    it('should mock scrollIntoView on Element and HTMLElement', () => {
      if (typeof Element !== 'undefined') {
        expect(typeof Element.prototype.scrollIntoView).toBe('function');
      }
      if (typeof window !== 'undefined' && window.HTMLElement) {
        expect(typeof window.HTMLElement.prototype.scrollIntoView).toBe('function');
      }
    });
  });

  describe('localStorage/sessionStorage mock', () => {
    it('should define global.localStorage and global.sessionStorage', () => {
      expect(global.localStorage).toBeDefined();
      expect(global.sessionStorage).toBeDefined();
    });

    it('should set, get, remove, clear, and key items', () => {
      global.localStorage.clear();
      expect(global.localStorage.length).toBe(0);
      global.localStorage.setItem('foo', 'bar');
      expect(global.localStorage.getItem('foo')).toBe('bar');
      expect(global.localStorage.length).toBe(1);
      expect(global.localStorage.key(0)).toBe('foo');
      global.localStorage.removeItem('foo');
      expect(global.localStorage.getItem('foo')).toBeNull();
      expect(global.localStorage.length).toBe(0);
    });

    it('should share storage between localStorage and sessionStorage', () => {
      global.localStorage.setItem('baz', 'qux');
      expect(global.sessionStorage.getItem('baz')).toBe('qux');
      global.sessionStorage.clear();
      expect(global.localStorage.length).toBe(0);
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('should handle Response with undefined body', async () => {
      const res = new global.Response();
      await expect(res.json()).resolves.toBeUndefined();
      await expect(res.text()).resolves.toBe(JSON.stringify(undefined));
    });

    it('should handle Headers with no initial value', () => {
      const headers = new global.Headers();
      expect(headers.get('missing')).toBeUndefined();
      expect(headers.has('missing')).toBe(false);
    });

    it('should handle TextDecoder with empty array', () => {
      const decoder = new global.TextDecoder();
      expect(decoder.decode(new Uint8Array([]))).toBe('');
    });

    it('should handle crypto.getRandomValues with empty array', () => {
      const arr = new Uint8Array(0);
      expect(global.crypto.getRandomValues(arr)).toBe(arr);
    });

    it('should handle crypto.subtle.digest with empty input', async () => {
      const buf = await global.crypto.subtle.digest('SHA-256', new Uint8Array([]));
      expect(buf).toBeInstanceOf(ArrayBuffer);
      expect(new Uint8Array(buf).length).toBe(32);
    });
  });
});
