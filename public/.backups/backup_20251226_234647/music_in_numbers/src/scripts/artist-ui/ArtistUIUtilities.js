/**
 * ================================================================================
 * ARTIST UI UTILITIES - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Dependency injection factory and utilities for Artist UI modular architecture.
 * Provides comprehensive dependency containers, performance wrappers, and testing utilities.
 * 
 * UTILITIES PROVIDED:
 * - Dependency injection containers (production, development, testing)
 * - Performance monitoring and optimization wrappers
 * - Environment detection and configuration
 * - Error tracking and logging utilities
 * - Cache management and optimization
 * - Testing utilities and mock containers
 * 
 * PATTERNS:
 * - Factory pattern for dependency container creation
 * - Strategy pattern for different environment configurations
 * - Decorator pattern for performance enhancement
 * - Observer pattern for error tracking
 * - Singleton pattern for shared resources
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistUIUtilities {
    
    // ============================================
    // ENVIRONMENT DETECTION
    // ============================================
    
    /**
     * Detects current execution environment
     * @returns {Object} Environment information
     */
    static detectEnvironment() {
        const env = {
            isNode: typeof process !== 'undefined' && process.versions && process.versions.node,
            isBrowser: typeof window !== 'undefined' && typeof document !== 'undefined',
            isWebWorker: typeof self !== 'undefined' && typeof importScripts === 'function',
            isTest: typeof global !== 'undefined' && (global.jest || global.jasmine || global.mocha),
            isDevelopment: false,
            isProduction: false
        };
        
        // Determine development vs production
        if (env.isNode) {
            env.isDevelopment = process.env.NODE_ENV === 'development';
            env.isProduction = process.env.NODE_ENV === 'production';
        } else if (env.isBrowser) {
            env.isDevelopment = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1' ||
                                window.location.hostname.includes('dev');
            env.isProduction = !env.isDevelopment;
        }
        
        return env;
    }
    
    /**
     * Gets environment-specific configuration
     * @param {Object} env - Environment information
     * @returns {Object} Configuration object
     */
    static getEnvironmentConfig(env) {
        const baseConfig = {
            cacheTimeout: 300000, // 5 minutes
            performanceTracking: true,
            errorReporting: true,
            verboseLogging: false,
            enableOptimizations: true
        };
        
        if (env.isDevelopment || env.isTest) {
            return {
                ...baseConfig,
                cacheTimeout: 60000, // 1 minute in dev
                verboseLogging: true,
                enableMocks: true,
                debugMode: true
            };
        }
        
        if (env.isProduction) {
            return {
                ...baseConfig,
                cacheTimeout: 600000, // 10 minutes in production
                verboseLogging: false,
                enableOptimizations: true,
                minifyOutput: true
            };
        }
        
        return baseConfig;
    }
    
    // ============================================
    // DEPENDENCY INJECTION CONTAINERS
    // ============================================
    
    /**
     * Creates production dependency injection container
     * @param {Object} options - Container options
     * @returns {Object} Production DI container
     */
    static createProductionContainer(options = {}) {
        const env = this.detectEnvironment();
        const config = this.getEnvironmentConfig(env);
        
        // Get class references (with fallbacks for different environments)
        const validators = this.getValidatorsClass();
        const processors = this.getProcessorsClass();
        const builders = this.getBuildersClass();
        
        const container = {
            // Core dependencies
            validators,
            processors,
            builders,
            
            // Configuration
            config: { ...config, ...options },
            environment: env,
            
            // Logging
            logger: this.createLogger(config.verboseLogging),
            
            // Performance tracking
            performance: this.createPerformanceTracker(config.performanceTracking),
            
            // Error handling
            errorHandler: this.createErrorHandler(config.errorReporting),
            
            // Cache management
            cache: this.createCacheManager(config.cacheTimeout),
            
            // Utilities
            utils: this.createUtilities(),
            
            // Metadata
            version: '1.0.0',
            created: new Date().toISOString(),
            containerType: 'production'
        };
        
        // Add performance wrappers
        if (config.enableOptimizations) {
            this.wrapWithPerformanceOptimizations(container);
        }
        
        return container;
    }
    
    /**
     * Creates development dependency injection container
     * @param {Object} options - Container options
     * @returns {Object} Development DI container
     */
    static createDevelopmentContainer(options = {}) {
        const productionContainer = this.createProductionContainer(options);
        
        // Development-specific enhancements
        const devContainer = {
            ...productionContainer,
            containerType: 'development',
            
            // Enhanced logging for development
            logger: this.createVerboseLogger(),
            
            // Development utilities
            debugUtils: this.createDebugUtilities(),
            profiler: this.createProfiler(),
            validator: this.createContainerValidator(),
            
            // Hot reload support
            hotReload: this.createHotReloadManager(),
            
            // Development flags
            enableSourceMaps: true,
            enableDetailedErrors: true,
            enablePerformanceWarnings: true
        };
        
        return devContainer;
    }
    
    /**
     * Creates test dependency injection container with mocks
     * @param {Object} options - Container options
     * @returns {Object} Test DI container
     */
    static createTestContainer(options = {}) {
        const mockValidators = this.createMockValidators();
        const mockProcessors = this.createMockProcessors();
        const mockBuilders = this.createMockBuilders();
        
        const container = {
            // Mock dependencies
            validators: mockValidators,
            processors: mockProcessors,
            builders: mockBuilders,
            
            // Test configuration
            config: {
                cacheTimeout: 1000, // 1 second for tests
                performanceTracking: false,
                errorReporting: false,
                verboseLogging: true,
                enableMocks: true,
                ...options
            },
            
            // Test environment
            environment: {
                isTest: true,
                isDevelopment: true,
                isProduction: false,
                isBrowser: typeof window !== 'undefined',
                isNode: typeof process !== 'undefined'
            },
            
            // Test utilities
            logger: this.createTestLogger(),
            performance: this.createMockPerformanceTracker(),
            errorHandler: this.createTestErrorHandler(),
            cache: this.createMockCache(),
            
            // Test helpers
            testUtils: this.createTestUtilities(),
            assertions: this.createTestAssertions(),
            fixtures: this.createTestFixtures(),
            
            // Metadata
            version: '1.0.0-test',
            created: new Date().toISOString(),
            containerType: 'test'
        };
        
        return container;
    }
    
    /**
     * Creates minimal dependency injection container
     * @param {Object} options - Container options
     * @returns {Object} Minimal DI container
     */
    static createMinimalContainer(options = {}) {
        return {
            validators: this.getValidatorsClass() || this.createMockValidators(),
            processors: this.getProcessorsClass() || this.createMockProcessors(),
            builders: this.getBuildersClass() || this.createMockBuilders(),
            logger: console,
            config: { ...options },
            containerType: 'minimal'
        };
    }
    
    // ============================================
    // CLASS REFERENCE GETTERS
    // ============================================
    
    /**
     * Gets validators class reference
     * @returns {Object} Validators class
     */
    static getValidatorsClass() {
        if (typeof window !== 'undefined' && window.ArtistUIValidators) {
            return window.ArtistUIValidators;
        }
        if (typeof global !== 'undefined' && global.ArtistUIValidators) {
            return global.ArtistUIValidators;
        }
        if (typeof require === 'function') {
            try {
                return require('./ArtistUIValidators');
            } catch (e) {
                // Module not available
            }
        }
        return null;
    }
    
    /**
     * Gets processors class reference
     * @returns {Object} Processors class
     */
    static getProcessorsClass() {
        if (typeof window !== 'undefined' && window.ArtistUIProcessors) {
            return window.ArtistUIProcessors;
        }
        if (typeof global !== 'undefined' && global.ArtistUIProcessors) {
            return global.ArtistUIProcessors;
        }
        if (typeof require === 'function') {
            try {
                return require('./ArtistUIProcessors');
            } catch (e) {
                // Module not available
            }
        }
        return null;
    }
    
    /**
     * Gets builders class reference
     * @returns {Object} Builders class
     */
    static getBuildersClass() {
        if (typeof window !== 'undefined' && window.ArtistUIBuilders) {
            return window.ArtistUIBuilders;
        }
        if (typeof global !== 'undefined' && global.ArtistUIBuilders) {
            return global.ArtistUIBuilders;
        }
        if (typeof require === 'function') {
            try {
                return require('./ArtistUIBuilders');
            } catch (e) {
                // Module not available
            }
        }
        return null;
    }
    
    // ============================================
    // UTILITY FACTORIES
    // ============================================
    
    /**
     * Creates logger instance
     * @param {boolean} verbose - Enable verbose logging
     * @returns {Object} Logger instance
     */
    static createLogger(verbose = false) {
        const logger = {
            log: verbose ? console.log.bind(console, '[ArtistUI]') : () => {},
            info: verbose ? console.info.bind(console, '[ArtistUI]') : () => {},
            warn: console.warn.bind(console, '[ArtistUI]'),
            error: console.error.bind(console, '[ArtistUI]'),
            debug: verbose ? console.debug.bind(console, '[ArtistUI]') : () => {},
            group: verbose ? console.group.bind(console) : () => {},
            groupEnd: verbose ? console.groupEnd.bind(console) : () => {},
            time: verbose ? console.time.bind(console) : () => {},
            timeEnd: verbose ? console.timeEnd.bind(console) : () => {}
        };
        
        return logger;
    }
    
    /**
     * Creates verbose logger for development
     * @returns {Object} Verbose logger instance
     */
    static createVerboseLogger() {
        return {
            log: (msg, ...args) => console.log(`[ArtistUI] ${msg}`, ...args),
            info: (msg, ...args) => console.info(`[ArtistUI] ${msg}`, ...args),
            warn: (msg, ...args) => console.warn(`[ArtistUI] ${msg}`, ...args),
            error: (msg, ...args) => console.error(`[ArtistUI] ${msg}`, ...args),
            debug: (msg, ...args) => console.debug(`[ArtistUI] ${msg}`, ...args),
            group: console.group.bind(console),
            groupEnd: console.groupEnd.bind(console),
            time: console.time.bind(console),
            timeEnd: console.timeEnd.bind(console),
            trace: console.trace.bind(console),
            table: console.table.bind(console)
        };
    }
    
    /**
     * Creates performance tracker
     * @param {boolean} enabled - Enable performance tracking
     * @returns {Object} Performance tracker instance
     */
    static createPerformanceTracker(enabled = true) {
        if (!enabled) {
            return {
                track: () => {},
                trackInteraction: () => {},
                getMetrics: () => ({}),
                reset: () => {}
            };
        }
        
        const metrics = new Map();
        const interactions = [];
        
        return {
            track: (operationId, duration, outcome) => {
                metrics.set(operationId, {
                    duration,
                    outcome,
                    timestamp: Date.now()
                });
            },
            
            trackInteraction: (action, data) => {
                interactions.push({
                    action,
                    data,
                    timestamp: Date.now()
                });
            },
            
            getMetrics: () => ({
                operations: Object.fromEntries(metrics),
                interactions: interactions.slice(-100), // Keep last 100
                summary: {
                    totalOperations: metrics.size,
                    totalInteractions: interactions.length,
                    avgDuration: this.calculateAverageDuration(metrics)
                }
            }),
            
            reset: () => {
                metrics.clear();
                interactions.length = 0;
            }
        };
    }
    
    /**
     * Creates error handler
     * @param {boolean} enabled - Enable error reporting
     * @returns {Function} Error handler function
     */
    static createErrorHandler(enabled = true) {
        if (!enabled) {
            return () => {};
        }
        
        return (error, context, metadata) => {
            const errorInfo = {
                message: error.message,
                stack: error.stack,
                context,
                metadata,
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
                url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
            };
            
            console.error('ArtistUI Error:', errorInfo);
            
            // In production, could send to error tracking service
            if (typeof window !== 'undefined' && window.errorTracker) {
                window.errorTracker.report(errorInfo);
            }
        };
    }
    
    /**
     * Creates cache manager
     * @param {number} timeout - Cache timeout in milliseconds
     * @returns {Object} Cache manager instance
     */
    static createCacheManager(timeout = 300000) {
        const cache = new Map();
        const timeouts = new Map();
        
        return {
            set: (key, value) => {
                // Clear existing timeout
                if (timeouts.has(key)) {
                    clearTimeout(timeouts.get(key));
                }
                
                // Set value
                cache.set(key, value);
                
                // Set new timeout
                const timeoutId = setTimeout(() => {
                    cache.delete(key);
                    timeouts.delete(key);
                }, timeout);
                
                timeouts.set(key, timeoutId);
            },
            
            get: (key) => cache.get(key),
            has: (key) => cache.has(key),
            delete: (key) => {
                if (timeouts.has(key)) {
                    clearTimeout(timeouts.get(key));
                    timeouts.delete(key);
                }
                return cache.delete(key);
            },
            
            clear: () => {
                timeouts.forEach(timeoutId => clearTimeout(timeoutId));
                cache.clear();
                timeouts.clear();
            },
            
            size: () => cache.size,
            
            keys: () => Array.from(cache.keys()),
            values: () => Array.from(cache.values())
        };
    }
    
    /**
     * Creates general utilities
     * @returns {Object} Utilities object
     */
    static createUtilities() {
        return {
            generateId: () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            
            debounce: (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },
            
            throttle: (func, limit) => {
                let inThrottle;
                return function(...args) {
                    if (!inThrottle) {
                        func.apply(this, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            },
            
            deepClone: (obj) => {
                if (obj === null || typeof obj !== 'object') return obj;
                if (obj instanceof Date) return new Date(obj.getTime());
                if (obj instanceof Array) return obj.map(item => this.createUtilities().deepClone(item));
                if (typeof obj === 'object') {
                    const clonedObj = {};
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            clonedObj[key] = this.createUtilities().deepClone(obj[key]);
                        }
                    }
                    return clonedObj;
                }
            },
            
            isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
            
            formatBytes: (bytes) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        };
    }
    
    // ============================================
    // MOCK FACTORIES (FOR TESTING)
    // ============================================
    
    /**
     * Creates mock validators for testing
     * @returns {Object} Mock validators
     */
    static createMockValidators() {
        return {
            validateHtmlText: () => ({ isValid: true, error: null }),
            validateArtistData: () => ({ isValid: true, error: null }),
            validateDomElement: () => ({ isValid: true, error: null }),
            validateErrorMessage: () => ({ isValid: true, error: null }),
            validateUrl: () => ({ isValid: true, error: null }),
            validateUIConfig: () => ({ isValid: true, error: null }),
            validateAccessibilityConfig: () => ({ isValid: true, error: null }),
            validateHtmlAttributes: () => ({ isValid: true, error: null }),
            validateContainerId: () => ({ isValid: true, error: null })
        };
    }
    
    /**
     * Creates mock processors for testing
     * @returns {Object} Mock processors
     */
    static createMockProcessors() {
        return {
            escapeHtml: (text) => String(text || ''),
            formatArtistDisplayData: (data) => data || {},
            processImageUrl: (url) => url || '',
            processSpotifyUrl: (url) => url || '',
            processInstagramUrl: (url) => url || '',
            formatFollowerCount: (count) => String(count || 0),
            formatGenresList: (genres) => Array.isArray(genres) ? genres.join(', ') : '',
            processErrorMessage: (msg) => ({ displayMessage: String(msg || ''), needsAuthLink: false }),
            processUrl: (url) => url || '',
            processHtmlAttributes: (attrs) => attrs || {},
            processAccessibilityText: (text) => String(text || ''),
            processResponsiveImage: (config) => config || {}
        };
    }
    
    /**
     * Creates mock builders for testing
     * @returns {Object} Mock builders
     */
    static createMockBuilders() {
        return {
            buildArtistDisplay: () => '<div class="mock-artist-display">Mock Artist</div>',
            buildArtistImage: () => '<div class="mock-artist-image">Mock Image</div>',
            buildArtistStats: () => '<div class="mock-artist-stats">Mock Stats</div>',
            buildSpotifyLink: () => '<a href="#" class="mock-spotify-link">Mock Spotify</a>',
            buildInstagramSection: () => '<div class="mock-instagram">Mock IG</div>',
            buildRawDataSection: () => '<details class="mock-raw-data">Mock Data</details>',
            buildErrorDisplay: (msg) => `<div class="mock-error">${msg || 'Mock Error'}</div>`,
            buildLoadingState: () => '<div class="mock-loading">Mock Loading</div>',
            buildPlaceholder: () => '<div class="mock-placeholder">Mock Placeholder</div>',
            buildContainer: (content) => `<div class="mock-container">${content || ''}</div>`,
            buildButton: (config) => `<button class="mock-button">${config?.text || 'Mock Button'}</button>`,
            buildLink: (config) => `<a href="${config?.href || '#'}" class="mock-link">${config?.text || 'Mock Link'}</a>`,
            buildResponsiveImage: (config) => `<img src="${config?.src || ''}" alt="${config?.alt || ''}" class="mock-image">`
        };
    }
    
    /**
     * Creates test logger
     * @returns {Object} Test logger
     */
    static createTestLogger() {
        const logs = [];
        
        return {
            log: (...args) => logs.push({ level: 'log', args, timestamp: Date.now() }),
            info: (...args) => logs.push({ level: 'info', args, timestamp: Date.now() }),
            warn: (...args) => logs.push({ level: 'warn', args, timestamp: Date.now() }),
            error: (...args) => logs.push({ level: 'error', args, timestamp: Date.now() }),
            debug: (...args) => logs.push({ level: 'debug', args, timestamp: Date.now() }),
            group: () => {},
            groupEnd: () => {},
            time: () => {},
            timeEnd: () => {},
            getLogs: () => logs,
            clearLogs: () => logs.length = 0
        };
    }
    
    /**
     * Creates mock performance tracker
     * @returns {Object} Mock performance tracker
     */
    static createMockPerformanceTracker() {
        return {
            track: () => {},
            trackInteraction: () => {},
            getMetrics: () => ({ operations: {}, interactions: [], summary: {} }),
            reset: () => {}
        };
    }
    
    /**
     * Creates test error handler
     * @returns {Function} Test error handler
     */
    static createTestErrorHandler() {
        const errors = [];
        
        const handler = (error, context, metadata) => {
            errors.push({ error, context, metadata, timestamp: Date.now() });
        };
        
        handler.getErrors = () => errors;
        handler.clearErrors = () => errors.length = 0;
        
        return handler;
    }
    
    /**
     * Creates mock cache
     * @returns {Object} Mock cache
     */
    static createMockCache() {
        const storage = new Map();
        
        return {
            set: (key, value) => storage.set(key, value),
            get: (key) => storage.get(key),
            has: (key) => storage.has(key),
            delete: (key) => storage.delete(key),
            clear: () => storage.clear(),
            size: () => storage.size,
            keys: () => Array.from(storage.keys()),
            values: () => Array.from(storage.values())
        };
    }
    
    // ============================================
    // DEVELOPMENT UTILITIES
    // ============================================
    
    /**
     * Creates debug utilities for development
     * @returns {Object} Debug utilities
     */
    static createDebugUtilities() {
        return {
            inspectContainer: (container) => {
                console.group('Container Inspection');
                console.log('Type:', container.containerType);
                console.log('Environment:', container.environment);
                console.log('Config:', container.config);
                console.log('Dependencies:', Object.keys(container).filter(key => 
                    !['config', 'environment', 'containerType', 'version', 'created'].includes(key)
                ));
                console.groupEnd();
            },
            
            validateDependencies: (container) => {
                const required = ['validators', 'processors', 'builders', 'logger'];
                const missing = required.filter(dep => !container[dep]);
                
                if (missing.length > 0) {
                    console.warn('Missing dependencies:', missing);
                    return false;
                }
                
                console.log('All dependencies satisfied');
                return true;
            },
            
            benchmarkOperation: (operation, iterations = 1000) => {
                const start = performance.now ? performance.now() : Date.now();
                
                for (let i = 0; i < iterations; i++) {
                    operation();
                }
                
                const end = performance.now ? performance.now() : Date.now();
                const duration = end - start;
                const avgDuration = duration / iterations;
                
                console.log(`Benchmark Results:
                    Total: ${duration.toFixed(2)}ms
                    Average: ${avgDuration.toFixed(4)}ms per operation
                    Iterations: ${iterations}`);
                
                return { total: duration, average: avgDuration, iterations };
            }
        };
    }
    
    /**
     * Creates profiler for development
     * @returns {Object} Profiler instance
     */
    static createProfiler() {
        const profiles = new Map();
        
        return {
            start: (name) => {
                profiles.set(name, {
                    startTime: performance.now ? performance.now() : Date.now(),
                    endTime: null,
                    duration: null
                });
            },
            
            end: (name) => {
                const profile = profiles.get(name);
                if (profile) {
                    profile.endTime = performance.now ? performance.now() : Date.now();
                    profile.duration = profile.endTime - profile.startTime;
                    console.log(`Profile [${name}]: ${profile.duration.toFixed(2)}ms`);
                }
            },
            
            getProfiles: () => Object.fromEntries(profiles),
            
            clear: () => profiles.clear()
        };
    }
    
    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================
    
    /**
     * Wraps container with performance optimizations
     * @param {Object} container - DI container to enhance
     */
    static wrapWithPerformanceOptimizations(container) {
        // Memoize expensive operations
        container.processors = this.wrapWithMemoization(container.processors);
        container.builders = this.wrapWithMemoization(container.builders);
        
        // Add performance monitoring
        container.performance = this.enhancePerformanceTracker(container.performance);
        
        // Add memory management
        container.memoryManager = this.createMemoryManager();
    }
    
    /**
     * Wraps object methods with memoization
     * @param {Object} obj - Object to wrap
     * @returns {Object} Wrapped object
     */
    static wrapWithMemoization(obj) {
        const cache = new Map();
        const wrapped = {};
        
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'function') {
                wrapped[key] = (...args) => {
                    const cacheKey = `${key}_${JSON.stringify(args)}`;
                    
                    if (cache.has(cacheKey)) {
                        return cache.get(cacheKey);
                    }
                    
                    const result = obj[key](...args);
                    cache.set(cacheKey, result);
                    
                    // Cleanup cache if it gets too large
                    if (cache.size > 1000) {
                        const firstKey = cache.keys().next().value;
                        cache.delete(firstKey);
                    }
                    
                    return result;
                };
            } else {
                wrapped[key] = obj[key];
            }
        });
        
        return wrapped;
    }
    
    /**
     * Enhances performance tracker with additional metrics
     * @param {Object} tracker - Performance tracker to enhance
     * @returns {Object} Enhanced tracker
     */
    static enhancePerformanceTracker(tracker) {
        const memoryUsage = [];
        
        return {
            ...tracker,
            
            trackMemory: () => {
                if (performance.memory) {
                    memoryUsage.push({
                        used: performance.memory.usedJSHeapSize,
                        total: performance.memory.totalJSHeapSize,
                        limit: performance.memory.jsHeapSizeLimit,
                        timestamp: Date.now()
                    });
                    
                    // Keep only last 100 measurements
                    if (memoryUsage.length > 100) {
                        memoryUsage.shift();
                    }
                }
            },
            
            getMemoryMetrics: () => ({
                current: performance.memory || null,
                history: memoryUsage,
                peak: memoryUsage.reduce((max, curr) => 
                    curr.used > max ? curr.used : max, 0)
            }),
            
            getDetailedMetrics: () => ({
                ...tracker.getMetrics(),
                memory: tracker.getMemoryMetrics ? tracker.getMemoryMetrics() : null,
                timestamp: new Date().toISOString()
            })
        };
    }
    
    /**
     * Creates memory manager
     * @returns {Object} Memory manager instance
     */
    static createMemoryManager() {
        return {
            cleanup: () => {
                // Force garbage collection if available
                if (global && global.gc) {
                    global.gc();
                }
            },
            
            getUsage: () => {
                if (process && process.memoryUsage) {
                    return process.memoryUsage();
                }
                if (performance && performance.memory) {
                    return {
                        heapUsed: performance.memory.usedJSHeapSize,
                        heapTotal: performance.memory.totalJSHeapSize,
                        heapLimit: performance.memory.jsHeapSizeLimit
                    };
                }
                return null;
            },
            
            monitor: (interval = 30000) => {
                setInterval(() => {
                    const usage = this.createMemoryManager().getUsage();
                    if (usage) {
                        console.log('Memory Usage:', usage);
                    }
                }, interval);
            }
        };
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Calculates average duration from metrics
     * @param {Map} metrics - Performance metrics
     * @returns {number} Average duration
     */
    static calculateAverageDuration(metrics) {
        if (metrics.size === 0) return 0;
        
        const durations = Array.from(metrics.values()).map(m => m.duration);
        const sum = durations.reduce((total, duration) => total + duration, 0);
        
        return sum / durations.length;
    }
    
    /**
     * Creates container validator
     * @returns {Object} Container validator
     */
    static createContainerValidator() {
        return {
            validate: (container) => {
                const errors = [];
                const warnings = [];
                
                // Check required properties
                const required = ['validators', 'processors', 'builders', 'logger'];
                required.forEach(prop => {
                    if (!container[prop]) {
                        errors.push(`Missing required property: ${prop}`);
                    }
                });
                
                // Check methods
                if (container.validators && typeof container.validators.validateArtistData !== 'function') {
                    errors.push('validators.validateArtistData is not a function');
                }
                
                if (container.processors && typeof container.processors.escapeHtml !== 'function') {
                    errors.push('processors.escapeHtml is not a function');
                }
                
                if (container.builders && typeof container.builders.buildArtistDisplay !== 'function') {
                    errors.push('builders.buildArtistDisplay is not a function');
                }
                
                // Check configuration
                if (!container.config) {
                    warnings.push('No configuration provided');
                }
                
                return {
                    isValid: errors.length === 0,
                    errors,
                    warnings
                };
            }
        };
    }
    
    /**
     * Creates hot reload manager for development
     * @returns {Object} Hot reload manager
     */
    static createHotReloadManager() {
        return {
            enabled: false,
            watchers: new Map(),
            
            enable: () => {
                if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                    this.enabled = true;
                    console.log('Hot reload enabled');
                }
            },
            
            disable: () => {
                this.enabled = false;
                this.watchers.forEach(watcher => {
                    if (watcher.disconnect) watcher.disconnect();
                });
                this.watchers.clear();
            },
            
            watch: (selector, callback) => {
                if (!this.enabled) return;
                
                const observer = new MutationObserver(callback);
                const target = document.querySelector(selector);
                
                if (target) {
                    observer.observe(target, {
                        childList: true,
                        subtree: true,
                        attributes: true
                    });
                    
                    this.watchers.set(selector, observer);
                }
            }
        };
    }
    
    /**
     * Creates test utilities
     * @returns {Object} Test utilities
     */
    static createTestUtilities() {
        return {
            createMockElement: (tagName = 'div', attributes = {}) => {
                if (typeof document !== 'undefined') {
                    const element = document.createElement(tagName);
                    Object.keys(attributes).forEach(key => {
                        element.setAttribute(key, attributes[key]);
                    });
                    return element;
                }
                
                // Mock element for non-browser environments
                return {
                    tagName: tagName.toUpperCase(),
                    attributes,
                    innerHTML: '',
                    textContent: '',
                    setAttribute: (key, value) => { attributes[key] = value; },
                    getAttribute: (key) => attributes[key],
                    removeAttribute: (key) => { delete attributes[key]; }
                };
            },
            
            simulateUserInteraction: (element, eventType = 'click') => {
                if (typeof document !== 'undefined' && element.dispatchEvent) {
                    const event = new Event(eventType, { bubbles: true });
                    element.dispatchEvent(event);
                } else {
                    console.log(`Simulated ${eventType} event on mock element`);
                }
            },
            
            measureRenderTime: (renderFunction) => {
                const start = performance.now ? performance.now() : Date.now();
                const result = renderFunction();
                const end = performance.now ? performance.now() : Date.now();
                
                return {
                    result,
                    renderTime: end - start
                };
            }
        };
    }
    
    /**
     * Creates test assertions
     * @returns {Object} Test assertions
     */
    static createTestAssertions() {
        return {
            assertHtmlValid: (html) => {
                if (typeof html !== 'string') {
                    throw new Error('Expected HTML to be a string');
                }
                
                if (html.includes('<script')) {
                    throw new Error('HTML contains script tags');
                }
                
                return true;
            },
            
            assertAccessible: (html) => {
                const requiredAttributes = ['aria-label', 'role', 'tabindex'];
                const hasAccessibility = requiredAttributes.some(attr => 
                    html.includes(attr)
                );
                
                if (!hasAccessibility) {
                    throw new Error('HTML lacks accessibility attributes');
                }
                
                return true;
            },
            
            assertPerformant: (operation, maxDuration = 100) => {
                const start = performance.now ? performance.now() : Date.now();
                operation();
                const duration = (performance.now ? performance.now() : Date.now()) - start;
                
                if (duration > maxDuration) {
                    throw new Error(`Operation took ${duration}ms, exceeds ${maxDuration}ms limit`);
                }
                
                return true;
            }
        };
    }
    
    /**
     * Creates test fixtures
     * @returns {Object} Test fixtures
     */
    static createTestFixtures() {
        return {
            artistData: {
                name: 'Test Artist',
                followers: '1,234,567',
                genres: ['Pop', 'Rock'],
                popularity: 85,
                imageUrl: 'https://example.com/image.jpg',
                imageWidth: 300,
                imageHeight: 300,
                spotifyUrl: 'https://open.spotify.com/artist/test',
                instagramUrl: 'https://instagram.com/testartist',
                isInstagramConfirmed: true,
                rawData: '{"name":"Test Artist","followers":1234567}'
            },
            
            invalidArtistData: {
                name: null,
                followers: 'invalid',
                genres: 'not-an-array',
                popularity: 'high'
            },
            
            containerElement: {
                id: 'test-container',
                className: 'artist-container',
                innerHTML: '',
                setAttribute: () => {},
                getAttribute: () => null,
                removeAttribute: () => {}
            },
            
            mockConfig: {
                cacheTimeout: 1000,
                performanceTracking: false,
                errorReporting: false,
                verboseLogging: true
            }
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistUIUtilities;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistUIUtilities = ArtistUIUtilities;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistUIUtilities = ArtistUIUtilities;
}