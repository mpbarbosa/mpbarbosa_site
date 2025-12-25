/**
 * UtilsUtilities - Dependency injection factory and mixed utility functions
 * Part of the Music in Numbers modular architecture
 * 
 * This class provides comprehensive dependency injection containers for different
 * environments and contexts, along with mixed utility functions that handle
 * infrastructure concerns.
 * 
 * Contains both pure and impure functions, with clear separation of concerns.
 */
class UtilsUtilities {
    /**
     * Create default production dependencies for utils operations
     * @param {Object} customDependencies - Custom dependencies to override defaults
     * @returns {Object} Complete dependency container for production use
     */
    static createDefaultDependencies(customDependencies = {}) {
        const defaultDeps = {
            // DOM Access Functions
            getElementById: (id) => document.getElementById(id),
            createElement: (tagName) => document.createElement(tagName),
            
            // Browser APIs
            createBlob: (blobParams) => UtilsBuilders.createBlob(blobParams),
            createObjectURL: (blob) => URL.createObjectURL(blob),
            revokeObjectURL: (url) => URL.revokeObjectURL(url),
            setTimeout: (callback, delay) => setTimeout(callback, delay),
            
            // Global State Access
            window: typeof window !== 'undefined' ? window : {},
            document: typeof document !== 'undefined' ? document : {},
            
            // Crypto APIs
            crypto: typeof crypto !== 'undefined' ? crypto : null,
            btoa: typeof btoa !== 'undefined' ? btoa : null,
            
            // Application-specific functions (injected from external modules)
            getValidAccessToken: null,
            showResult: null,
            
            // Logging and monitoring
            logInfo: (message, ...args) => console.log(`[Utils]`, message, ...args),
            logError: (message, ...args) => console.error(`[Utils ERROR]`, message, ...args),
            logWarning: (message, ...args) => console.warn(`[Utils WARNING]`, message, ...args),
            
            // Performance monitoring
            performanceNow: () => typeof performance !== 'undefined' ? performance.now() : Date.now(),
            
            // Environment detection
            isNode: typeof process !== 'undefined' && process.versions && process.versions.node,
            isBrowser: typeof window !== 'undefined' && typeof document !== 'undefined',
            isWebWorker: typeof importScripts === 'function',
            
            // Error handling
            handleError: (error, context = 'Utils operation') => {
                console.error(`${context} failed:`, error);
                return { success: false, error: error.message };
            }
        };

        return { ...defaultDeps, ...customDependencies };
    }

    /**
     * Create test dependencies with mocks for testing scenarios
     * @param {Object} customMocks - Custom mock implementations
     * @returns {Object} Complete mock dependency container for testing
     */
    static createTestDependencies(customMocks = {}) {
        const mockElement = {
            textContent: 'Test User',
            value: 'medium_term',
            style: {},
            setAttribute: () => {},
            removeAttribute: () => {},
            focus: () => {},
            scrollIntoView: () => {},
            click: () => {}
        };

        const testDeps = {
            // Mock DOM functions
            getElementById: (id) => {
                const mockElements = {
                    'musicAnalytics': mockElement,
                    'userName': { textContent: 'Test User' },
                    'userCountry': { textContent: 'Test Country' },
                    'timeRangeSelector': { value: 'medium_term' },
                    'result': {
                        ...mockElement,
                        className: '',
                        setAttribute: () => {},
                        removeAttribute: () => {}
                    }
                };
                return mockElements[id] || mockElement;
            },
            
            createElement: () => mockElement,
            
            // Mock browser APIs
            createBlob: (blobParams) => ({ type: blobParams.mimeType }),
            createObjectURL: () => 'mock://blob-url',
            revokeObjectURL: () => {},
            setTimeout: (callback) => callback(),
            
            // Mock global state
            window: {
                currentAnalyticsData: {
                    analytics: {
                        totalTracks: 100,
                        uniqueArtists: 50,
                        musicPersonality: { explorationLevel: 'High' },
                        moodAnalysis: { mood: 'Happy', happiness: 80 },
                        listeningPatterns: { skipRate: 10 },
                        trendAnalysis: { trend: 'Increasing' },
                        topGenres: [{ genre: 'Pop', count: 25 }]
                    }
                }
            },
            
            document: {
                body: {
                    appendChild: () => {},
                    removeChild: () => {}
                }
            },
            
            // Mock crypto APIs
            crypto: {
                subtle: {
                    digest: async () => new ArrayBuffer(32)
                }
            },
            
            btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
            
            // Mock application functions
            getValidAccessToken: () => 'mock-token-12345',
            showResult: (message, type) => ({ message, type }),
            
            // Mock logging (silent in tests)
            logInfo: () => {},
            logError: () => {},
            logWarning: () => {},
            
            // Mock performance
            performanceNow: () => 1000,
            
            // Environment flags
            isNode: false,
            isBrowser: true,
            isWebWorker: false,
            
            // Mock error handling
            handleError: (error, context) => ({ success: false, error: error.message, context })
        };

        return { ...testDeps, ...customMocks };
    }

    /**
     * Create development dependencies with enhanced logging and debugging
     * @param {Object} customDependencies - Custom dependencies to override defaults
     * @returns {Object} Complete dependency container for development
     */
    static createDevelopmentDependencies(customDependencies = {}) {
        const baseDeps = this.createDefaultDependencies();
        
        const devEnhancements = {
            // Enhanced logging with timestamps
            logInfo: (message, ...args) => {
                const timestamp = new Date().toISOString();
                console.log(`[${timestamp}] [Utils INFO]`, message, ...args);
            },
            
            logError: (message, ...args) => {
                const timestamp = new Date().toISOString();
                console.error(`[${timestamp}] [Utils ERROR]`, message, ...args);
                console.trace(); // Add stack trace in development
            },
            
            logWarning: (message, ...args) => {
                const timestamp = new Date().toISOString();
                console.warn(`[${timestamp}] [Utils WARNING]`, message, ...args);
            },
            
            // Performance monitoring wrapper
            measurePerformance: (operation, fn) => {
                const start = performance.now();
                const result = fn();
                const duration = performance.now() - start;
                console.log(`[Utils Performance] ${operation} took ${duration.toFixed(2)}ms`);
                return result;
            },
            
            // Enhanced error handling with context
            handleError: (error, context = 'Utils operation') => {
                const timestamp = new Date().toISOString();
                console.group(`[${timestamp}] [Utils Error Handler]`);
                console.error(`Context: ${context}`);
                console.error(`Error:`, error);
                console.error(`Stack:`, error.stack);
                console.groupEnd();
                return { success: false, error: error.message, context, timestamp };
            },
            
            // Development flags
            isDevelopment: true,
            debugMode: true
        };

        return { ...baseDeps, ...devEnhancements, ...customDependencies };
    }

    /**
     * Auto-detect environment and create appropriate dependencies
     * @param {Object} customDependencies - Custom dependencies to override
     * @returns {Object} Environment-appropriate dependency container
     */
    static createAutoDependencies(customDependencies = {}) {
        // Check for test environment indicators
        const isTest = typeof jest !== 'undefined' || 
                      typeof mocha !== 'undefined' || 
                      process?.env?.NODE_ENV === 'test';

        // Check for development environment
        const isDevelopment = process?.env?.NODE_ENV === 'development' ||
                             window?.location?.hostname === 'localhost';

        if (isTest) {
            return this.createTestDependencies(customDependencies);
        } else if (isDevelopment) {
            return this.createDevelopmentDependencies(customDependencies);
        } else {
            return this.createDefaultDependencies(customDependencies);
        }
    }

    /**
     * Validate that all required dependencies are available
     * @param {Object} dependencies - Dependencies to validate
     * @param {string[]} requiredKeys - Required dependency keys
     * @returns {Object} Validation result
     */
    static validateDependencies(dependencies, requiredKeys = []) {
        const missing = [];
        
        const defaultRequired = [
            'getElementById', 'createElement', 'createBlob', 
            'createObjectURL', 'revokeObjectURL', 'setTimeout'
        ];
        
        const allRequired = [...defaultRequired, ...requiredKeys];
        
        for (const key of allRequired) {
            if (!(key in dependencies) || dependencies[key] === null) {
                missing.push(key);
            }
        }

        if (missing.length > 0) {
            return {
                isValid: false,
                error: `Missing required dependencies: ${missing.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Create performance wrapper for functions
     * @param {Function} fn - Function to wrap
     * @param {string} operationName - Name for performance logging
     * @returns {Function} Wrapped function with performance monitoring
     */
    static createPerformanceWrapper(fn, operationName) {
        return (...args) => {
            const start = performance.now();
            try {
                const result = fn(...args);
                const duration = performance.now() - start;
                console.log(`[Utils Performance] ${operationName} completed in ${duration.toFixed(2)}ms`);
                return result;
            } catch (error) {
                const duration = performance.now() - start;
                console.error(`[Utils Performance] ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
                throw error;
            }
        };
    }

    /**
     * Create error boundary wrapper for functions
     * @param {Function} fn - Function to wrap
     * @param {string} context - Context for error reporting
     * @returns {Function} Wrapped function with error handling
     */
    static createErrorBoundary(fn, context) {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                console.error(`[Utils Error Boundary] ${context}:`, error);
                return { success: false, error: error.message, context };
            }
        };
    }

    /**
     * Create retry wrapper for functions
     * @param {Function} fn - Function to wrap
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} delay - Delay between retries in ms
     * @returns {Function} Wrapped function with retry logic
     */
    static createRetryWrapper(fn, maxRetries = 3, delay = 1000) {
        return async (...args) => {
            let lastError;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return await fn(...args);
                } catch (error) {
                    lastError = error;
                    console.warn(`[Utils Retry] Attempt ${attempt}/${maxRetries} failed:`, error.message);
                    
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, delay * attempt));
                    }
                }
            }
            
            throw lastError;
        };
    }

    /**
     * Get environment information
     * @returns {Object} Environment details
     */
    static getEnvironmentInfo() {
        return {
            isNode: typeof process !== 'undefined' && process.versions && process.versions.node,
            isBrowser: typeof window !== 'undefined' && typeof document !== 'undefined',
            isWebWorker: typeof importScripts === 'function',
            hasWebCrypto: typeof crypto !== 'undefined' && crypto.subtle,
            hasCanvas: typeof HTMLCanvasElement !== 'undefined',
            hasBlob: typeof Blob !== 'undefined',
            hasURL: typeof URL !== 'undefined',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Create mock implementations for missing browser APIs (Node.js environment)
     * @returns {Object} Mock implementations
     */
    static createNodeMocks() {
        return {
            document: {
                getElementById: () => null,
                createElement: () => ({}),
                body: { appendChild: () => {}, removeChild: () => {} }
            },
            window: {},
            URL: {
                createObjectURL: () => 'mock://url',
                revokeObjectURL: () => {}
            },
            Blob: class MockBlob {
                constructor(content, options) {
                    this.content = content;
                    this.type = options?.type || 'text/plain';
                }
            },
            crypto: {
                subtle: {
                    digest: async (algorithm, data) => {
                        // Mock SHA-256 digest
                        return new ArrayBuffer(32);
                    }
                }
            },
            btoa: (str) => Buffer.from(str, 'binary').toString('base64')
        };
    }
}

// Auto-export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsUtilities;
}

if (typeof window !== 'undefined') {
    window.UtilsUtilities = UtilsUtilities;
}