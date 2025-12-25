/**
 * UI Components Utilities - Dependency Injection Factory and Infrastructure
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This class provides comprehensive dependency injection containers, environment detection,
 * utility functions, performance wrappers, and error handling for UI components.
 * 
 * Pattern: Infrastructure and Dependency Factory
 * Dependencies: Environment APIs (DOM, Window, Console, etc.)
 * 
 * @class UIComponentsUtilities
 */
class UIComponentsUtilities {
    
    /**
     * Create production dependency container for UI components
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Complete dependency container for production use
     */
    static createProductionDependencies(customDependencies = {}) {
        const productionContainer = {
            // ===== DOM DEPENDENCIES =====
            document: typeof document !== 'undefined' ? document : null,
            window: typeof window !== 'undefined' ? window : null,
            
            // ===== CONSOLE AND LOGGING =====
            console: typeof console !== 'undefined' ? console : {
                log: () => {},
                error: () => {},
                warn: () => {},
                info: () => {}
            },
            
            // ===== TIMING FUNCTIONS =====
            setTimeout: typeof setTimeout !== 'undefined' ? setTimeout : null,
            clearTimeout: typeof clearTimeout !== 'undefined' ? clearTimeout : null,
            
            // ===== EXTRACTED CLASS DEPENDENCIES =====
            UIComponentsValidators: typeof UIComponentsValidators !== 'undefined' ? UIComponentsValidators : null,
            UIComponentsProcessors: typeof UIComponentsProcessors !== 'undefined' ? UIComponentsProcessors : null,
            UIComponentsBuilders: typeof UIComponentsBuilders !== 'undefined' ? UIComponentsBuilders : null,
            UIComponentsCore: typeof UIComponentsCore !== 'undefined' ? UIComponentsCore : null,
            
            // ===== EXTERNAL LIBRARY DEPENDENCIES =====
            VirtualScroller: typeof VirtualScroller !== 'undefined' ? VirtualScroller : null,
            lazyLoader: typeof lazyLoader !== 'undefined' ? lazyLoader : null,
            performanceOptimizer: typeof performanceOptimizer !== 'undefined' ? performanceOptimizer : null,
            
            // ===== APPLICATION-SPECIFIC DEPENDENCIES =====
            getValidAccessToken: typeof getValidAccessToken !== 'undefined' ? getValidAccessToken : null,
            loadMusicAnalytics: typeof loadMusicAnalytics !== 'undefined' ? loadMusicAnalytics : null,
            startRealTimeMonitoring: typeof startRealTimeMonitoring !== 'undefined' ? startRealTimeMonitoring : null,
            
            // ===== PERFORMANCE AND MONITORING =====
            performance: typeof performance !== 'undefined' ? performance : null,
            
            // ===== ERROR HANDLING =====
            errorHandler: this.createErrorHandler(),
            logger: this.createLogger('UIComponents'),
            
            // ===== ENVIRONMENT INFO =====
            environment: this.detectEnvironment(),
            
            // ===== UTILITY FUNCTIONS =====
            debounce: this.createDebounceFunction(),
            throttle: this.createThrottleFunction(),
            retry: this.createRetryFunction()
        };

        // Merge with custom dependencies
        return { ...productionContainer, ...customDependencies };
    }

    /**
     * Create development dependency container with additional debugging features
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Development dependency container with debugging tools
     */
    static createDevelopmentDependencies(customDependencies = {}) {
        const productionDeps = this.createProductionDependencies();
        
        const developmentContainer = {
            ...productionDeps,
            
            // ===== DEVELOPMENT-SPECIFIC LOGGING =====
            console: {
                ...productionDeps.console,
                debug: (...args) => console.debug('[UI-Components-Dev]', ...args),
                trace: (...args) => console.trace('[UI-Components-Trace]', ...args),
                time: (label) => console.time(`[UI-Components] ${label}`),
                timeEnd: (label) => console.timeEnd(`[UI-Components] ${label}`)
            },
            
            // ===== DEVELOPMENT LOGGER WITH TIMESTAMPS =====
            logger: this.createLogger('UIComponents-Dev', { 
                includeTimestamp: true,
                includeStackTrace: true,
                logLevel: 'debug'
            }),
            
            // ===== PERFORMANCE MONITORING =====
            performanceMonitor: this.createPerformanceMonitor(),
            
            // ===== DEBUG UTILITIES =====
            debugUtils: {
                inspectElement: (element) => {
                    console.debug('Element inspection:', {
                        tagName: element?.tagName,
                        id: element?.id,
                        className: element?.className,
                        childCount: element?.children?.length,
                        parentTag: element?.parentElement?.tagName
                    });
                },
                validateDependencies: (deps) => {
                    const missing = [];
                    const required = ['document', 'console', 'UIComponentsBuilders'];
                    required.forEach(dep => {
                        if (!deps[dep]) missing.push(dep);
                    });
                    if (missing.length > 0) {
                        console.warn('Missing dependencies:', missing);
                    }
                    return missing.length === 0;
                }
            },
            
            // ===== DEVELOPMENT FLAGS =====
            isDevelopment: true,
            enableDebugLogs: true,
            enablePerformanceTracking: true
        };

        return { ...developmentContainer, ...customDependencies };
    }

    /**
     * Create test dependency container with mocks and test utilities
     * @param {Object} testOverrides - Test-specific dependency overrides
     * @returns {Object} Test dependency container with mocks
     */
    static createTestDependencies(testOverrides = {}) {
        const testContainer = {
            // ===== MOCK DOM =====
            document: this.createMockDocument(),
            window: this.createMockWindow(),
            
            // ===== MOCK CONSOLE =====
            console: this.createMockConsole(),
            
            // ===== MOCK TIMING =====
            setTimeout: (fn, delay) => {
                // Immediate execution for tests
                return setTimeout(fn, 0);
            },
            clearTimeout: clearTimeout,
            
            // ===== MOCK EXTRACTED CLASSES =====
            UIComponentsValidators: this.createMockValidators(),
            UIComponentsProcessors: this.createMockProcessors(),
            UIComponentsBuilders: this.createMockBuilders(),
            
            // ===== MOCK EXTERNAL LIBRARIES =====
            VirtualScroller: this.createMockVirtualScroller(),
            lazyLoader: this.createMockLazyLoader(),
            performanceOptimizer: this.createMockPerformanceOptimizer(),
            
            // ===== MOCK APPLICATION FUNCTIONS =====
            getValidAccessToken: () => 'mock-token-12345',
            loadMusicAnalytics: (token) => Promise.resolve({ success: true, token }),
            startRealTimeMonitoring: () => ({ success: true, monitoring: true }),
            
            // ===== TEST UTILITIES =====
            testUtils: {
                capturedCalls: [],
                captureCall: function(method, args) {
                    this.capturedCalls.push({ method, args, timestamp: Date.now() });
                },
                getCalls: function(method) {
                    return this.capturedCalls.filter(call => call.method === method);
                },
                clearCalls: function() {
                    this.capturedCalls = [];
                },
                assertCallCount: function(method, expectedCount) {
                    const calls = this.getCalls(method);
                    if (calls.length !== expectedCount) {
                        throw new Error(`Expected ${expectedCount} calls to ${method}, got ${calls.length}`);
                    }
                }
            },
            
            // ===== TEST FLAGS =====
            isTest: true,
            enableMocking: true,
            captureErrors: true
        };

        return { ...testContainer, ...testOverrides };
    }

    /**
     * Create dependency container for Node.js environment
     * @param {Object} nodeOverrides - Node.js specific overrides
     * @returns {Object} Node.js compatible dependency container
     */
    static createNodeDependencies(nodeOverrides = {}) {
        const nodeContainer = {
            // ===== NODE.JS CONSOLE =====
            console: console,
            
            // ===== NODE.JS TIMING =====
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            
            // ===== NO DOM IN NODE.JS =====
            document: null,
            window: null,
            
            // ===== NODE.JS PERFORMANCE =====
            performance: typeof performance !== 'undefined' ? performance : {
                now: () => Date.now(),
                mark: () => {},
                measure: () => {}
            },
            
            // ===== NODE.JS UTILITIES =====
            logger: this.createLogger('UIComponents-Node'),
            errorHandler: this.createErrorHandler(),
            
            // ===== ENVIRONMENT INFO =====
            environment: 'node',
            isNode: true,
            isBrowser: false,
            
            // ===== NODE.JS FILE SYSTEM (if needed) =====
            fs: typeof require !== 'undefined' ? require('fs') : null,
            path: typeof require !== 'undefined' ? require('path') : null
        };

        return { ...nodeContainer, ...nodeOverrides };
    }

    /**
     * Automatically detect environment and create appropriate dependencies
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Environment-appropriate dependency container
     */
    static createAutoDependencies(customDependencies = {}) {
        const environment = this.detectEnvironment();
        
        switch (environment) {
            case 'node':
                return this.createNodeDependencies(customDependencies);
            case 'test':
                return this.createTestDependencies(customDependencies);
            case 'development':
                return this.createDevelopmentDependencies(customDependencies);
            case 'browser':
            default:
                return this.createProductionDependencies(customDependencies);
        }
    }

    // ===== ENVIRONMENT DETECTION =====

    /**
     * Detect the current runtime environment
     * @returns {string} Environment type (browser, node, test, development)
     */
    static detectEnvironment() {
        // Node.js environment
        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
            // Check if in test environment
            if (process.env.NODE_ENV === 'test' || 
                typeof global !== 'undefined' && global.jest) {
                return 'test';
            }
            return 'node';
        }
        
        // Browser environment
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Check if in development mode
            if (window.location?.hostname === 'localhost' || 
                window.location?.hostname === '127.0.0.1' ||
                window.location?.search?.includes('debug=true')) {
                return 'development';
            }
            return 'browser';
        }
        
        // Web Worker environment
        if (typeof importScripts !== 'undefined') {
            return 'webworker';
        }
        
        // Default fallback
        return 'unknown';
    }

    // ===== UTILITY FUNCTION FACTORIES =====

    /**
     * Create error handler function
     * @param {Object} options - Error handler options
     * @returns {Function} Error handler function
     */
    static createErrorHandler(options = {}) {
        const { logErrors = true, throwInDevelopment = false } = options;
        
        return function(error, context = '') {
            const errorInfo = {
                message: error.message || error,
                stack: error.stack,
                context,
                timestamp: new Date().toISOString()
            };
            
            if (logErrors && console) {
                console.error('UIComponents Error:', errorInfo);
            }
            
            if (throwInDevelopment && this.environment?.includes('development')) {
                throw error;
            }
            
            return errorInfo;
        };
    }

    /**
     * Create logger function with customizable options
     * @param {string} prefix - Log message prefix
     * @param {Object} options - Logger options
     * @returns {Object} Logger functions
     */
    static createLogger(prefix, options = {}) {
        const {
            includeTimestamp = false,
            includeStackTrace = false,
            logLevel = 'info'
        } = options;
        
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        const currentLevel = levels[logLevel] || 1;
        
        const formatMessage = (level, message, ...args) => {
            let formatted = `[${prefix}]`;
            
            if (includeTimestamp) {
                formatted += ` [${new Date().toISOString()}]`;
            }
            
            formatted += ` ${message}`;
            
            return [formatted, ...args];
        };
        
        return {
            debug: (...args) => {
                if (currentLevel <= 0 && console.debug) {
                    console.debug(...formatMessage('DEBUG', ...args));
                }
            },
            info: (...args) => {
                if (currentLevel <= 1 && console.info) {
                    console.info(...formatMessage('INFO', ...args));
                }
            },
            warn: (...args) => {
                if (currentLevel <= 2 && console.warn) {
                    console.warn(...formatMessage('WARN', ...args));
                }
            },
            error: (...args) => {
                if (currentLevel <= 3 && console.error) {
                    console.error(...formatMessage('ERROR', ...args));
                    if (includeStackTrace) {
                        console.trace();
                    }
                }
            }
        };
    }

    /**
     * Create performance monitor
     * @returns {Object} Performance monitoring utilities
     */
    static createPerformanceMonitor() {
        const measurements = new Map();
        
        return {
            start: (label) => {
                measurements.set(label, { start: performance.now() });
            },
            end: (label) => {
                const measurement = measurements.get(label);
                if (measurement) {
                    measurement.end = performance.now();
                    measurement.duration = measurement.end - measurement.start;
                    return measurement.duration;
                }
                return 0;
            },
            getMeasurements: () => Array.from(measurements.entries()),
            clear: () => measurements.clear()
        };
    }

    /**
     * Create debounce function
     * @returns {Function} Debounce utility
     */
    static createDebounceFunction() {
        return function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        };
    }

    /**
     * Create throttle function
     * @returns {Function} Throttle utility
     */
    static createThrottleFunction() {
        return function(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    }

    /**
     * Create retry function
     * @returns {Function} Retry utility
     */
    static createRetryFunction() {
        return async function(fn, maxRetries = 3, delay = 1000) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                }
            }
        };
    }

    // ===== MOCK FACTORIES FOR TESTING =====

    /**
     * Create mock document object
     * @returns {Object} Mock document
     */
    static createMockDocument() {
        const elements = new Map();
        
        return {
            getElementById: (id) => elements.get(id) || null,
            createElement: (tagName) => ({
                tagName: tagName.toUpperCase(),
                style: {},
                innerHTML: '',
                textContent: '',
                appendChild: () => {},
                addEventListener: () => {},
                setAttribute: () => {},
                removeAttribute: () => {},
                scrollIntoView: () => {}
            }),
            querySelector: () => null,
            querySelectorAll: () => [],
            body: {
                appendChild: () => {}
            }
        };
    }

    /**
     * Create mock window object
     * @returns {Object} Mock window
     */
    static createMockWindow() {
        return {
            location: {
                reload: () => {},
                hostname: 'localhost',
                search: ''
            },
            currentAnalyticsData: null
        };
    }

    /**
     * Create mock console object
     * @returns {Object} Mock console
     */
    static createMockConsole() {
        const logs = [];
        
        return {
            log: (...args) => logs.push({ level: 'log', args }),
            error: (...args) => logs.push({ level: 'error', args }),
            warn: (...args) => logs.push({ level: 'warn', args }),
            info: (...args) => logs.push({ level: 'info', args }),
            debug: (...args) => logs.push({ level: 'debug', args }),
            getLogs: () => logs,
            clearLogs: () => logs.length = 0
        };
    }

    /**
     * Create mock validators
     * @returns {Object} Mock validators
     */
    static createMockValidators() {
        return {
            validateAnalyticsData: () => ({ isValid: true, error: null }),
            validateUserData: () => ({ isValid: true, error: null }),
            validateDOMElement: () => ({ isValid: true, error: null }),
            validateResultMessage: () => ({ isValid: true, error: null })
        };
    }

    /**
     * Create mock processors
     * @returns {Object} Mock processors
     */
    static createMockProcessors() {
        return {
            getGenreColor: (index) => '#ff6b6b, #feca57',
            formatTrackDuration: (ms) => '3:45',
            processMoodAnalysis: (mood) => ({ ...mood, processed: true }),
            processMessageType: (type) => ({ icon: '✅', role: 'status' })
        };
    }

    /**
     * Create mock builders
     * @returns {Object} Mock builders
     */
    static createMockBuilders() {
        return {
            generateAnalyticsHTML: () => '<div>Mock Analytics</div>',
            createTrackElement: () => ({ innerHTML: 'Mock Track' }),
            createArtistElement: () => ({ innerHTML: 'Mock Artist' })
        };
    }

    /**
     * Create mock virtual scroller
     * @returns {Object} Mock virtual scroller
     */
    static createMockVirtualScroller() {
        return class MockVirtualScroller {
            constructor(container, itemHeight, buffer) {
                this.container = container;
                this.itemHeight = itemHeight;
                this.buffer = buffer;
            }
            
            setData(items, renderFunction) {
                this.items = items;
                this.renderFunction = renderFunction;
            }
        };
    }

    /**
     * Create mock lazy loader
     * @returns {Object} Mock lazy loader
     */
    static createMockLazyLoader() {
        return {
            observe: (element) => {
                // Mock lazy loading - immediately trigger load
                setTimeout(() => {
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                    }
                }, 0);
            }
        };
    }

    /**
     * Create mock performance optimizer
     * @returns {Object} Mock performance optimizer
     */
    static createMockPerformanceOptimizer() {
        return {
            getCacheStats: () => ({
                hits: 10,
                misses: 2,
                size: 12,
                hitRate: 83.3
            })
        };
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponentsUtilities;
} else if (typeof window !== 'undefined') {
    window.UIComponentsUtilities = UIComponentsUtilities;
}

// ES6 module export
if (typeof exports !== 'undefined') {
    exports.UIComponentsUtilities = UIComponentsUtilities;
}