/**
 * ================================================================================
 * ARTIST API UTILITIES - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Dependency injection factory and utility functions for artist API operations.
 * Provides production and test containers, performance monitoring, and caching.
 * 
 * UTILITY TYPES:
 * - Dependency Injection Factory (Production & Test)
 * - Performance Monitoring and Wrappers
 * - Caching Mechanisms with TTL
 * - Error Handling and Retry Logic
 * - Environment Detection and Configuration
 * 
 * PATTERNS:
 * - Factory pattern for dependency containers
 * - Strategy pattern for different environments
 * - Decorator pattern for performance monitoring
 * - Observer pattern for cache events
 * - Template method for retry logic
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistApiUtilities {
    
    /**
     * Creates production dependency container with real services
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Complete dependency container
     */
    static createDependencyContainer(customDependencies = {}) {
        const defaultDependencies = {
            // ============================================
            // HTTP and Network Services
            // ============================================
            fetch: typeof fetch !== 'undefined' 
                ? fetch.bind(window) 
                : require('node-fetch'),
            
            // ============================================
            // DOM Manipulation Services
            // ============================================
            getElementById: (id) => {
                return typeof document !== 'undefined' 
                    ? document.getElementById(id)
                    : null;
            },
            
            querySelector: (selector) => {
                return typeof document !== 'undefined'
                    ? document.querySelector(selector)
                    : null;
            },
            
            createElement: (tagName) => {
                return typeof document !== 'undefined'
                    ? document.createElement(tagName)
                    : { tagName: tagName.toUpperCase() };
            },
            
            // ============================================
            // Logging Services
            // ============================================
            logInfo: (message, ...args) => {
                console.log(`[ArtistAPI Info]`, message, ...args);
            },
            
            logError: (message, ...args) => {
                console.error(`[ArtistAPI Error]`, message, ...args);
            },
            
            logWarning: (message, ...args) => {
                console.warn(`[ArtistAPI Warning]`, message, ...args);
            },
            
            logDebug: (message, ...args) => {
                if (this.isDebugMode()) {
                    console.log(`[ArtistAPI Debug]`, message, ...args);
                }
            },
            
            // ============================================
            // UI Notification Services
            // ============================================
            showResult: (message, type = 'info') => {
                if (typeof window !== 'undefined' && window.showResult) {
                    window.showResult(message, type);
                } else {
                    console.log(`[UI ${type.toUpperCase()}]`, message);
                }
            },
            
            // ============================================
            // Performance Services
            // ============================================
            performanceNow: () => {
                return typeof performance !== 'undefined' 
                    ? performance.now()
                    : Date.now();
            },
            
            performanceMark: (name) => {
                if (typeof performance !== 'undefined' && performance.mark) {
                    performance.mark(name);
                }
            },
            
            performanceMeasure: (name, startMark, endMark) => {
                if (typeof performance !== 'undefined' && performance.measure) {
                    performance.measure(name, startMark, endMark);
                }
            },
            
            // ============================================
            // Storage Services
            // ============================================
            localStorage: typeof localStorage !== 'undefined' 
                ? localStorage 
                : this.createMockStorage(),
            
            sessionStorage: typeof sessionStorage !== 'undefined'
                ? sessionStorage
                : this.createMockStorage(),
            
            // ============================================
            // Timing Services
            // ============================================
            setTimeout: (callback, delay) => {
                return typeof setTimeout !== 'undefined'
                    ? setTimeout(callback, delay)
                    : null;
            },
            
            setInterval: (callback, interval) => {
                return typeof setInterval !== 'undefined'
                    ? setInterval(callback, interval)
                    : null;
            },
            
            clearTimeout: (timeoutId) => {
                if (typeof clearTimeout !== 'undefined') {
                    clearTimeout(timeoutId);
                }
            },
            
            clearInterval: (intervalId) => {
                if (typeof clearInterval !== 'undefined') {
                    clearInterval(intervalId);
                }
            },
            
            // ============================================
            // Class References (injected when available)
            // ============================================
            ArtistApiValidators: typeof ArtistApiValidators !== 'undefined' 
                ? ArtistApiValidators 
                : null,
            
            ArtistApiProcessors: typeof ArtistApiProcessors !== 'undefined'
                ? ArtistApiProcessors
                : null,
            
            ArtistApiUIBuilders: typeof ArtistApiUIBuilders !== 'undefined'
                ? ArtistApiUIBuilders
                : null,
            
            // ============================================
            // Cache Services
            // ============================================
            cache: this.createCache(),
            
            // ============================================
            // Environment Services
            // ============================================
            environment: this.detectEnvironment(),
            
            // ============================================
            // Configuration
            // ============================================
            config: {
                apiBaseUrl: 'https://api.spotify.com/v1',
                cacheTimeout: 5 * 60 * 1000, // 5 minutes
                retryAttempts: 3,
                retryDelay: 1000,
                performanceMonitoring: true
            }
        };
        
        return { ...defaultDependencies, ...customDependencies };
    }
    
    /**
     * Creates test dependency container with mocks
     * @param {Object} mockOverrides - Mock dependency overrides
     * @returns {Object} Test dependency container
     */
    static createTestDependencyContainer(mockOverrides = {}) {
        const testDefaults = {
            // ============================================
            // HTTP Mocks
            // ============================================
            fetch: jest.fn(() => Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve({
                    id: 'test-artist-id',
                    name: 'Test Artist',
                    type: 'artist',
                    images: [{ url: 'test-image.jpg', width: 300, height: 300 }],
                    followers: { total: 1000 },
                    genres: ['pop', 'rock'],
                    popularity: 75,
                    external_urls: { spotify: 'https://spotify.com/test' }
                })
            })),
            
            // ============================================
            // DOM Mocks
            // ============================================
            getElementById: jest.fn(() => ({
                innerHTML: '',
                textContent: '',
                appendChild: jest.fn(),
                removeChild: jest.fn(),
                classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }
            })),
            
            querySelector: jest.fn(() => ({
                innerHTML: '',
                textContent: '',
                style: {},
                classList: { add: jest.fn(), remove: jest.fn() }
            })),
            
            createElement: jest.fn((tagName) => ({
                tagName: tagName.toUpperCase(),
                innerHTML: '',
                textContent: '',
                appendChild: jest.fn(),
                setAttribute: jest.fn(),
                getAttribute: jest.fn(() => null),
                classList: { add: jest.fn(), remove: jest.fn() }
            })),
            
            // ============================================
            // Logging Mocks (Silent)
            // ============================================
            logInfo: jest.fn(),
            logError: jest.fn(),
            logWarning: jest.fn(),
            logDebug: jest.fn(),
            
            // ============================================
            // UI Mocks
            // ============================================
            showResult: jest.fn(),
            
            // ============================================
            // Performance Mocks
            // ============================================
            performanceNow: jest.fn(() => 1000),
            performanceMark: jest.fn(),
            performanceMeasure: jest.fn(),
            
            // ============================================
            // Storage Mocks
            // ============================================
            localStorage: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            
            sessionStorage: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn()
            },
            
            // ============================================
            // Timing Mocks
            // ============================================
            setTimeout: jest.fn((callback) => { 
                callback(); 
                return 1; 
            }),
            setInterval: jest.fn(() => 1),
            clearTimeout: jest.fn(),
            clearInterval: jest.fn(),
            
            // ============================================
            // Class Mocks
            // ============================================
            ArtistApiValidators: {
                validateAccessToken: jest.fn(() => ({ isValid: true })),
                validateArtistId: jest.fn(() => ({ isValid: true })),
                validateArtistData: jest.fn(() => ({ isValid: true })),
                validateApiResponse: jest.fn(() => ({ isValid: true }))
            },
            
            ArtistApiProcessors: {
                formatArtistData: jest.fn((data) => ({
                    name: data?.name || 'Test Artist',
                    imageUrl: 'test-image.jpg',
                    followers: '1,000',
                    genres: 'pop, rock',
                    popularity: 75
                })),
                findLargestImage: jest.fn(() => ({ url: 'test-image.jpg' })),
                generateInstagramHandle: jest.fn(() => 'testartist')
            },
            
            ArtistApiUIBuilders: {
                buildArtistProfile: jest.fn(() => '<div>Test Profile</div>'),
                buildArtistHeader: jest.fn(() => '<div>Test Header</div>'),
                buildArtistCard: jest.fn(() => '<div>Test Card</div>')
            },
            
            // ============================================
            // Cache Mock
            // ============================================
            cache: {
                get: jest.fn(() => null),
                set: jest.fn(),
                has: jest.fn(() => false),
                delete: jest.fn(),
                clear: jest.fn(),
                size: 0
            },
            
            // ============================================
            // Environment Mock
            // ============================================
            environment: 'test',
            
            // ============================================
            // Test Configuration
            // ============================================
            config: {
                apiBaseUrl: 'https://api.spotify.com/v1',
                cacheTimeout: 100, // Short timeout for tests
                retryAttempts: 1,
                retryDelay: 10,
                performanceMonitoring: false
            }
        };
        
        return { ...testDefaults, ...mockOverrides };
    }
    
    /**
     * Creates performance wrapper for functions
     * @param {Function} originalFunction - Function to wrap
     * @param {string} functionName - Name for performance tracking
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Wrapped function with performance monitoring
     */
    static createPerformanceWrapper(originalFunction, functionName, dependencies) {
        if (!dependencies.config?.performanceMonitoring) {
            return originalFunction;
        }
        
        return async function(...args) {
            const { performanceNow, performanceMark, logDebug } = dependencies;
            
            const startTime = performanceNow();
            const startMark = `${functionName}-start`;
            const endMark = `${functionName}-end`;
            
            performanceMark(startMark);
            
            try {
                const result = await originalFunction.apply(this, args);
                
                const endTime = performanceNow();
                performanceMark(endMark);
                
                const duration = endTime - startTime;
                logDebug(`⏱️ ${functionName} completed in ${duration.toFixed(2)}ms`);
                
                return result;
                
            } catch (error) {
                const endTime = performanceNow();
                const duration = endTime - startTime;
                logDebug(`⚠️ ${functionName} failed after ${duration.toFixed(2)}ms:`, error.message);
                
                throw error;
            }
        };
    }
    
    /**
     * Creates retry wrapper for functions with exponential backoff
     * @param {Function} originalFunction - Function to wrap
     * @param {Object} options - Retry options
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Wrapped function with retry logic
     */
    static createRetryWrapper(originalFunction, options = {}, dependencies) {
        const { 
            maxRetries = dependencies.config?.retryAttempts || 3,
            delay = dependencies.config?.retryDelay || 1000,
            backoffMultiplier = 2,
            retryCondition = (error) => error.message.includes('network') || error.message.includes('timeout')
        } = options;
        
        const { setTimeout, logWarning } = dependencies;
        
        return async function(...args) {
            let lastError;
            let currentDelay = delay;
            
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await originalFunction.apply(this, args);
                    
                } catch (error) {
                    lastError = error;
                    
                    if (attempt === maxRetries || !retryCondition(error)) {
                        break;
                    }
                    
                    logWarning(`🔄 Attempt ${attempt + 1} failed, retrying in ${currentDelay}ms:`, error.message);
                    
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay *= backoffMultiplier;
                }
            }
            
            throw lastError;
        };
    }
    
    /**
     * Creates simple cache implementation
     * @param {number} maxSize - Maximum cache size (default: 100)
     * @param {number} defaultTTL - Default TTL in milliseconds
     * @returns {Object} Cache instance
     */
    static createCache(maxSize = 100, defaultTTL = 5 * 60 * 1000) {
        const cache = new Map();
        const timestamps = new Map();
        
        return {
            get(key) {
                if (!cache.has(key)) {
                    return null;
                }
                
                const timestamp = timestamps.get(key);
                if (Date.now() - timestamp > defaultTTL) {
                    cache.delete(key);
                    timestamps.delete(key);
                    return null;
                }
                
                return cache.get(key);
            },
            
            set(key, value, ttl = defaultTTL) {
                if (cache.size >= maxSize) {
                    const oldestKey = cache.keys().next().value;
                    cache.delete(oldestKey);
                    timestamps.delete(oldestKey);
                }
                
                cache.set(key, value);
                timestamps.set(key, Date.now());
            },
            
            has(key) {
                return this.get(key) !== null;
            },
            
            delete(key) {
                cache.delete(key);
                timestamps.delete(key);
            },
            
            clear() {
                cache.clear();
                timestamps.clear();
            },
            
            get size() {
                return cache.size;
            }
        };
    }
    
    /**
     * Creates mock storage for environments without localStorage
     * @returns {Object} Mock storage implementation
     */
    static createMockStorage() {
        const storage = new Map();
        
        return {
            getItem(key) {
                return storage.get(key) || null;
            },
            
            setItem(key, value) {
                storage.set(key, String(value));
            },
            
            removeItem(key) {
                storage.delete(key);
            },
            
            clear() {
                storage.clear();
            },
            
            get length() {
                return storage.size;
            },
            
            key(index) {
                const keys = Array.from(storage.keys());
                return keys[index] || null;
            }
        };
    }
    
    /**
     * Detects current environment
     * @returns {string} Environment name ('browser', 'node', 'test', 'unknown')
     */
    static detectEnvironment() {
        if (typeof jest !== 'undefined' || process?.env?.NODE_ENV === 'test') {
            return 'test';
        }
        
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            return 'browser';
        }
        
        if (typeof process !== 'undefined' && process.versions?.node) {
            return 'node';
        }
        
        return 'unknown';
    }
    
    /**
     * Checks if debug mode is enabled
     * @returns {boolean} True if debug mode is enabled
     */
    static isDebugMode() {
        return (
            (typeof process !== 'undefined' && process.env?.DEBUG === 'true') ||
            (typeof localStorage !== 'undefined' && localStorage.getItem('debug') === 'true') ||
            (typeof window !== 'undefined' && window.location?.search?.includes('debug=true'))
        );
    }
    
    /**
     * Validates dependency container completeness
     * @param {Object} dependencies - Dependency container to validate
     * @param {Array<string>} requiredDependencies - Required dependency names
     * @returns {{isValid: boolean, missing?: Array<string>, error?: string}}
     */
    static validateDependencies(dependencies, requiredDependencies = []) {
        const missing = [];
        
        requiredDependencies.forEach(depName => {
            if (!(depName in dependencies)) {
                missing.push(depName);
            }
        });
        
        return {
            isValid: missing.length === 0,
            missing: missing.length > 0 ? missing : undefined,
            error: missing.length > 0 
                ? `Missing required dependencies: ${missing.join(', ')}` 
                : undefined
        };
    }
    
    /**
     * Creates comprehensive error handler
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Error handler function
     */
    static createErrorHandler(dependencies) {
        const { logError, showResult } = dependencies;
        
        return function(error, context = 'ArtistAPI') {
            const errorMessage = error?.message || String(error);
            const timestamp = new Date().toISOString();
            
            logError(`❌ [${context}] Error at ${timestamp}:`, errorMessage);
            
            if (error?.stack && dependencies.environment !== 'production') {
                logError('Stack trace:', error.stack);
            }
            
            if (showResult) {
                showResult(`${context} error: ${errorMessage}`, 'error');
            }
            
            return {
                success: false,
                error: errorMessage,
                timestamp,
                context
            };
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistApiUtilities;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistApiUtilities = ArtistApiUtilities;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistApiUtilities = ArtistApiUtilities;
}