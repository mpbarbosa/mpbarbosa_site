/**
 * AnalyticsUtilities - Dependency injection factory and utility functions for analytics
 * 
 * This class provides:
 * - Dependency injection factory for all analytics classes
 * - Utility functions for analytics configuration and setup
 * - Environment detection and compatibility utilities
 * - Error handling and logging utilities
 * - Performance monitoring and optimization utilities
 * 
 * Functions in this class handle:
 * - Creating dependency injection configurations
 * - Managing global state and configuration
 * - Providing utility functions for common analytics operations
 * - Facilitating testing and mocking through dependency injection
 * 
 * This class serves as the coordination layer that enables pure functions
 * to interact with impure dependencies in a controlled, testable manner
 */
class AnalyticsUtilities {

    /**
     * Creates a dependency injection container for analytics functions
     * @param {Object} customDependencies - Custom dependencies to override defaults
     * @returns {Object} Complete dependency injection configuration
     */
    static createAnalyticsDependencyContainer(customDependencies = {}) {
        // Default browser dependencies
        const defaultDependencies = {
            // DOM manipulation
            getElementById: (id) => document.getElementById(id),
            querySelector: (selector) => document.querySelector(selector),
            querySelectorAll: (selector) => document.querySelectorAll(selector),
            createElement: (tag) => document.createElement(tag),
            appendChild: (parent, child) => parent.appendChild(child),
            
            // Timing functions
            setTimeout: (callback, delay) => setTimeout(callback, delay),
            setInterval: (callback, interval) => setInterval(callback, interval),
            clearTimeout: (id) => clearTimeout(id),
            clearInterval: (id) => clearInterval(id),
            
            // Global objects
            window: typeof window !== 'undefined' ? window : null,
            document: typeof document !== 'undefined' ? document : null,
            
            // Spotify API functions (to be injected)
            getTopTracks: null,
            getTopArtists: null,
            getRecentlyPlayed: null,
            getCurrentPlayback: null,
            getAudioFeatures: null,
            getValidAccessToken: null,
            
            // UI utility functions (to be injected)
            showResult: null,
            
            // Logging functions
            logInfo: (message, ...args) => console.log(`[Analytics]`, message, ...args),
            logWarning: (message, ...args) => console.warn(`[Analytics]`, message, ...args),
            logError: (message, ...args) => console.error(`[Analytics]`, message, ...args),
            logDebug: (message, ...args) => console.debug(`[Analytics]`, message, ...args),
            
            // Performance monitoring
            performanceNow: () => (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(),
            performanceMark: (name) => {
                if (typeof performance !== 'undefined' && performance.mark) {
                    performance.mark(name);
                }
            },
            performanceMeasure: (name, startMark, endMark) => {
                if (typeof performance !== 'undefined' && performance.measure) {
                    try {
                        performance.measure(name, startMark, endMark);
                    } catch (e) {
                        // Ignore performance measurement errors
                    }
                }
            }
        };

        // Merge with custom dependencies, allowing overrides
        return {
            ...defaultDependencies,
            ...customDependencies
        };
    }

    /**
     * Creates a test-friendly dependency container with mocked functions
     * @param {Object} mockOverrides - Specific mock implementations
     * @returns {Object} Test dependency configuration
     */
    static createTestDependencyContainer(mockOverrides = {}) {
        const testDefaults = {
            // DOM mocks
            getElementById: (id) => ({ id, innerHTML: '', appendChild: () => {}, parentNode: { appendChild: () => {} } }),
            querySelector: (selector) => ({ innerHTML: '', classList: { add: () => {}, remove: () => {} } }),
            querySelectorAll: (selector) => [],
            createElement: (tag) => ({ 
                tagName: tag.toUpperCase(), 
                innerHTML: '', 
                id: '', 
                appendChild: () => {},
                setAttribute: () => {},
                getAttribute: () => null
            }),
            appendChild: () => {},
            
            // Timing mocks
            setTimeout: (callback, delay) => { callback(); return 1; },
            setInterval: (callback, interval) => 1,
            clearTimeout: () => {},
            clearInterval: () => {},
            
            // Global mocks
            window: { currentAnalyticsData: null },
            document: { head: { appendChild: () => {} } },
            
            // API mocks
            getTopTracks: async () => [],
            getTopArtists: async () => [],
            getRecentlyPlayed: async () => [],
            getCurrentPlayback: async () => null,
            getAudioFeatures: async () => [],
            getValidAccessToken: () => 'mock_token',
            
            // UI mocks
            showResult: () => {},
            
            // Logging mocks
            logInfo: () => {},
            logWarning: () => {},
            logError: () => {},
            logDebug: () => {},
            
            // Performance mocks
            performanceNow: () => 0,
            performanceMark: () => {},
            performanceMeasure: () => {}
        };

        return {
            ...testDefaults,
            ...mockOverrides
        };
    }

    /**
     * Validates that required dependencies are present in container
     * @param {Object} dependencies - Dependency container to validate
     * @param {Array<string>} requiredDependencies - List of required dependency names
     * @returns {Object} Validation result
     */
    static validateDependencies(dependencies, requiredDependencies = []) {
        const missing = [];
        const invalid = [];

        requiredDependencies.forEach(depName => {
            if (!(depName in dependencies)) {
                missing.push(depName);
            } else if (typeof dependencies[depName] !== 'function' && dependencies[depName] !== null) {
                // Allow null values for optional dependencies
                invalid.push(depName);
            }
        });

        return {
            isValid: missing.length === 0 && invalid.length === 0,
            missing,
            invalid,
            error: missing.length > 0 
                ? `Missing required dependencies: ${missing.join(', ')}` 
                : invalid.length > 0 
                    ? `Invalid dependencies (not functions): ${invalid.join(', ')}`
                    : null
        };
    }

    /**
     * Creates a performance-monitored wrapper for analytics functions
     * @param {Function} originalFunction - Function to wrap with performance monitoring
     * @param {string} functionName - Name for performance tracking
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Performance-monitored function
     */
    static createPerformanceWrapper(originalFunction, functionName, dependencies) {
        return async function(...args) {
            const { performanceNow, performanceMark, performanceMeasure, logDebug } = dependencies;
            
            const startTime = performanceNow();
            const startMark = `${functionName}-start`;
            const endMark = `${functionName}-end`;
            const measureName = `${functionName}-duration`;
            
            performanceMark(startMark);
            
            try {
                const result = await originalFunction(...args);
                
                const endTime = performanceNow();
                performanceMark(endMark);
                performanceMeasure(measureName, startMark, endMark);
                
                const duration = endTime - startTime;
                logDebug(`${functionName} completed in ${duration.toFixed(2)}ms`);
                
                return result;
            } catch (error) {
                const endTime = performanceNow();
                const duration = endTime - startTime;
                logDebug(`${functionName} failed after ${duration.toFixed(2)}ms:`, error);
                throw error;
            }
        };
    }

    /**
     * Creates error-handling wrapper for analytics functions
     * @param {Function} originalFunction - Function to wrap with error handling
     * @param {string} functionName - Name for error reporting
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Error-handled function
     */
    static createErrorWrapper(originalFunction, functionName, dependencies) {
        return async function(...args) {
            const { logError } = dependencies;
            
            try {
                return await originalFunction(...args);
            } catch (error) {
                logError(`Error in ${functionName}:`, error);
                
                // Return standardized error result
                return {
                    success: false,
                    error: error.message || `Unknown error in ${functionName}`,
                    details: error
                };
            }
        };
    }

    /**
     * Gets environment-specific configuration for analytics
     * @returns {Object} Environment configuration
     */
    static getEnvironmentConfig() {
        const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
        const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
        const isTest = typeof jest !== 'undefined' || (typeof process !== 'undefined' && process.env.NODE_ENV === 'test');

        return {
            isNode,
            isBrowser,
            isTest,
            supportsPerformanceAPI: typeof performance !== 'undefined' && performance.mark,
            supportsConsole: typeof console !== 'undefined',
            supportsDOM: typeof document !== 'undefined',
            supportsLocalStorage: typeof localStorage !== 'undefined',
            supportsSessionStorage: typeof sessionStorage !== 'undefined'
        };
    }

    /**
     * Creates a retry wrapper for analytics functions that might fail
     * @param {Function} originalFunction - Function to wrap with retry logic
     * @param {Object} options - Retry configuration
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Retry-enabled function
     */
    static createRetryWrapper(originalFunction, options = {}, dependencies) {
        const { 
            maxRetries = 3, 
            delay = 1000, 
            backoffMultiplier = 2,
            retryCondition = (error) => true 
        } = options;
        
        const { setTimeout, logWarning } = dependencies;

        return async function(...args) {
            let lastError;
            let currentDelay = delay;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await originalFunction(...args);
                } catch (error) {
                    lastError = error;
                    
                    if (attempt === maxRetries || !retryCondition(error)) {
                        throw error;
                    }
                    
                    logWarning(`Retry attempt ${attempt + 1}/${maxRetries} for function after ${currentDelay}ms delay:`, error.message);
                    
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay *= backoffMultiplier;
                }
            }
            
            throw lastError;
        };
    }

    /**
     * Creates a caching wrapper for analytics functions
     * @param {Function} originalFunction - Function to wrap with caching
     * @param {Object} options - Cache configuration
     * @param {Object} dependencies - Dependency container
     * @returns {Function} Cached function
     */
    static createCacheWrapper(originalFunction, options = {}, dependencies) {
        const { 
            ttl = 5 * 60 * 1000, // 5 minutes default
            maxSize = 100,
            keyGenerator = (...args) => JSON.stringify(args)
        } = options;
        
        const { logDebug } = dependencies;
        const cache = new Map();

        return async function(...args) {
            const key = keyGenerator(...args);
            const now = Date.now();
            
            // Check if cached result exists and is still valid
            if (cache.has(key)) {
                const cached = cache.get(key);
                if (now - cached.timestamp < ttl) {
                    logDebug(`Cache hit for key: ${key}`);
                    return cached.value;
                } else {
                    cache.delete(key);
                }
            }
            
            // Execute function and cache result
            const result = await originalFunction(...args);
            
            // Manage cache size
            if (cache.size >= maxSize) {
                const oldestKey = cache.keys().next().value;
                cache.delete(oldestKey);
            }
            
            cache.set(key, {
                value: result,
                timestamp: now
            });
            
            logDebug(`Cached result for key: ${key}`);
            return result;
        };
    }

    /**
     * Utility function to safely access nested object properties
     * @param {Object} obj - Object to access
     * @param {string} path - Dot-notation path to property
     * @param {*} defaultValue - Default value if path doesn't exist
     * @returns {*} Property value or default
     */
    static safeGet(obj, path, defaultValue = null) {
        try {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : defaultValue;
            }, obj);
        } catch (error) {
            return defaultValue;
        }
    }

    /**
     * Utility function to format time durations for display
     * @param {number} milliseconds - Duration in milliseconds
     * @returns {string} Formatted duration string
     */
    static formatDuration(milliseconds) {
        if (milliseconds < 1000) {
            return `${Math.round(milliseconds)}ms`;
        } else if (milliseconds < 60000) {
            return `${(milliseconds / 1000).toFixed(1)}s`;
        } else {
            const minutes = Math.floor(milliseconds / 60000);
            const seconds = Math.floor((milliseconds % 60000) / 1000);
            return `${minutes}m ${seconds}s`;
        }
    }

    /**
     * Utility function to create analytics configuration with sensible defaults
     * @param {Object} customConfig - Custom configuration overrides
     * @returns {Object} Complete analytics configuration
     */
    static createAnalyticsConfig(customConfig = {}) {
        const defaultConfig = {
            cacheEnabled: true,
            cacheTTL: 5 * 60 * 1000, // 5 minutes
            retryEnabled: true,
            maxRetries: 3,
            retryDelay: 1000,
            performanceMonitoring: true,
            debugLogging: false,
            errorReporting: true,
            batchSize: 20,
            requestTimeout: 30000 // 30 seconds
        };

        return {
            ...defaultConfig,
            ...customConfig
        };
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsUtilities;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.AnalyticsUtilities = AnalyticsUtilities;
}