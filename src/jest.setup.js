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
                removeEventListener: () => {}
            };
        }

        abort() {
            this.signal.aborted = true;
        }
    };
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
// Cleanup
// ============================================================================

// Note: Global hooks like afterEach should be used sparingly in setup files
// as they apply to ALL tests. Prefer test-specific cleanup when possible.
