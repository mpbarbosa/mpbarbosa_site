/**
 * Jest Setup File
 * Global test environment configuration and polyfills
 *
 * Purpose:
 * - Add Response polyfill for jsdom environment (fixes advanced error handling tests)
 * - Configure global test utilities and mocks
 * - Setup environment-specific configurations
 */

// ============================================================================
// Priority 2: Add Response Polyfill for jsdom
// ============================================================================
// Issue: Advanced error handling tests fail with "Response is not defined"
// Solution: Implement Response class polyfill for jsdom environment

global.Response = class Response {
  constructor(body, init = {}) {
    this._body = body;
    this._init = init;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Map(Object.entries(init.headers || {}));
    this.url = init.url || '';
    this.type = init.type || 'default';
  }

  async json() {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body);
    }
    return this._body;
  }

  async text() {
    if (typeof this._body === 'string') {
      return this._body;
    }
    return JSON.stringify(this._body);
  }

  async blob() {
    return new Blob([await this.text()]);
  }

  async arrayBuffer() {
    const text = await this.text();
    const encoder = new TextEncoder();
    return encoder.encode(text).buffer;
  }

  clone() {
    return new Response(this._body, this._init);
  }
};

// ============================================================================
// Additional Global Polyfills
// ============================================================================

// Headers polyfill (if needed for Response)
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = new Map(Object.entries(init));
    }

    get(name) {
      return this._headers.get(name.toLowerCase());
    }

    set(name, value) {
      this._headers.set(name.toLowerCase(), value);
    }

    has(name) {
      return this._headers.has(name.toLowerCase());
    }

    delete(name) {
      this._headers.delete(name.toLowerCase());
    }

    forEach(callback) {
      this._headers.forEach(callback);
    }
  };
}

// AbortController polyfill (if needed for fetch timeout tests)
if (typeof global.AbortController === 'undefined') {
  global.AbortController = class AbortController {
    constructor() {
      this.signal = {
        aborted: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    }

    abort() {
      this.signal.aborted = true;
    }
  };
}

// TextEncoder/TextDecoder polyfill (for PKCE generation tests)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(str) {
      const utf8 = [];
      for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
          utf8.push(charcode);
        } else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(
            0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f),
          );
        } else {
          i++;
          charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
          utf8.push(
            0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f),
          );
        }
      }
      return new Uint8Array(utf8);
    }
  };

  if (typeof window !== 'undefined') {
    window.TextEncoder = global.TextEncoder;
  }
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(bytes) {
      let str = '';
      for (let i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      return str;
    }
  };

  if (typeof window !== 'undefined') {
    window.TextDecoder = global.TextDecoder;
  }
}

// Web Crypto API polyfill (for advanced error handling tests)
// jsdom provides window.crypto with getRandomValues but not subtle
if (typeof window !== 'undefined') {
  const existingCrypto = window.crypto;
  const existingGetRandomValues = existingCrypto?.getRandomValues;

  // Try to delete and recreate window.crypto
  try {
    delete window.crypto;
  } catch {
    // If delete fails, try Object.defineProperty
  }

  const cryptoPolyfill = {
    getRandomValues:
      existingGetRandomValues?.bind(existingCrypto) ||
      ((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      }),
    subtle: {
      digest: async (algorithm, data) => {
        // Mock implementation for testing that generates different outputs for different inputs
        // SHA-256 produces 32 bytes
        const buffer = new ArrayBuffer(32);
        const view = new Uint8Array(buffer);
        const inputView = new Uint8Array(data);

        // Generate pseudo-hash based on input data using a better hash algorithm
        // Use multiple hash seeds for better distribution
        for (let i = 0; i < 32; i++) {
          let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis

          for (let j = 0; j < inputView.length; j++) {
            hash ^= inputView[j];
            hash *= 0x01000193; // FNV-1a 32-bit prime
            hash ^= i * 31; // Mix in output byte index
          }

          view[i] = (hash >>> 0) % 256;
        }

        return buffer;
      },
    },
  };

  // Try to set window.crypto
  try {
    window.crypto = cryptoPolyfill;
  } catch {
    // If direct assignment fails, use defineProperty
    try {
      Object.defineProperty(window, 'crypto', {
        value: cryptoPolyfill,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch (e2) {
      console.error('Failed to polyfill window.crypto:', e2);
    }
  }

  global.crypto = window.crypto;
} else if (typeof global.crypto === 'undefined' || !global.crypto.subtle) {
  const cryptoPolyfill = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      digest: async (algorithm, data) => {
        const buffer = new ArrayBuffer(32);
        const view = new Uint8Array(buffer);
        const inputView = new Uint8Array(data);

        for (let i = 0; i < 32; i++) {
          let hash = 0x811c9dc5;

          for (let j = 0; j < inputView.length; j++) {
            hash ^= inputView[j];
            hash *= 0x01000193;
            hash ^= i * 31;
          }

          view[i] = (hash >>> 0) % 256;
        }

        return buffer;
      },
    },
  };
  global.crypto = cryptoPolyfill;
}

// ============================================================================
// Jest Configuration
// ============================================================================

// Note: jest.setTimeout() is not available in setup files
// Use beforeEach in individual test files if needed, or configure in package.json

// ============================================================================
// Environment Detection
// ============================================================================

// Ensure test environment is properly detected
global.IS_TEST_ENV = true;
global.IS_JSDOM = true;

// ============================================================================
// LocalStorage Mock (suppress jsdom warnings)
// ============================================================================

// jsdom provides localStorage, but we ensure it's properly configured
// This prevents warnings about invalid --localstorage-file paths
if (typeof global.localStorage === 'undefined') {
  const localStorageMock = {
    _data: {},
    getItem(key) {
      return this._data[key] || null;
    },
    setItem(key, value) {
      this._data[key] = String(value);
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    },
    get length() {
      return Object.keys(this._data).length;
    },
    key(index) {
      const keys = Object.keys(this._data);
      return keys[index] || null;
    },
  };

  global.localStorage = localStorageMock;
  global.sessionStorage = localStorageMock;
}

// ============================================================================
// Cleanup
// ============================================================================

// Note: Global hooks like afterEach should be used sparingly in setup files
// as they apply to ALL tests. Prefer test-specific cleanup when possible.
