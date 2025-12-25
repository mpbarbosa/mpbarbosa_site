/**
 * PerformanceUtilities.js
 * 
 * Part 5 of 5 in the Performance API Class Extraction
 * 
 * PURPOSE:
 * Dependency injection factory and comprehensive utility functions for performance
 * optimization module initialization, configuration, and environment management.
 * 
 * ARCHITECTURE:
 * - Dependency injection factory
 * - Environment detection utilities
 * - Module initialization helpers
 * - Configuration management
 * 
 * PATTERNS FOLLOWED:
 * - Factory pattern for dependency creation
 * - Environment detection and adaptation
 * - Comprehensive error handling and fallbacks
 * - Multi-environment module loading
 * 
 * EXTRACTION CONSISTENCY:
 * This follows the exact same patterns as:
 * - AnalyticsUtilities.js (analytics DI factory and utilities)
 * - ArtistUtilities.js (artist module initialization)
 * - InitializationUtilities.js (app startup and config)
 * - SpotifyApiUtilities.js (API client factory and utilities)
 * - RealTimeUtilities.js (real-time monitoring utilities)
 */

// Multi-environment compatibility
(function(global, factory) {
    'use strict';
    
    // Environment detection and module loading
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node.js/CommonJS environment
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD environment
        define([], factory);
    } else {
        // Browser global environment
        global.PerformanceUtilities = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this, function() {
    
    'use strict';

    /**
     * PerformanceUtilities
     * 
     * Utility class providing dependency injection factory, environment detection,
     * module initialization, and configuration management for performance optimization.
     */
    class PerformanceUtilities {
        
        /**
         * Create dependency injection container with all performance modules
         * @param {Object} overrides - Optional dependency overrides
         * @param {Object} config - Configuration object
         * @returns {Object} Configured dependency container
         */
        static createDependencyContainer(overrides = {}, config = {}) {
            try {
                const environment = this.detectEnvironment();
                const dependencies = {};
                
                // Load performance modules based on environment
                const moduleLoaders = {
                    validators: () => this.loadPerformanceValidators(),
                    processors: () => this.loadPerformanceProcessors(),
                    uiBuilders: () => this.loadPerformanceUIBuilders(),
                    core: () => this.loadPerformanceCore()
                };
                
                // Load each module with fallback handling
                for (const [moduleName, loader] of Object.entries(moduleLoaders)) {
                    try {
                        dependencies[moduleName] = overrides[moduleName] || loader();
                    } catch (loadError) {
                        dependencies[moduleName] = this.createModuleFallback(moduleName, loadError);
                        this.logWarning(`Failed to load ${moduleName}: ${loadError.message}`);
                    }
                }
                
                // Add browser API dependencies with fallbacks
                dependencies.performance = typeof performance !== 'undefined' ? performance : this.createPerformanceFallback();
                dependencies.console = typeof console !== 'undefined' ? console : this.createConsoleFallback();
                dependencies.setTimeout = typeof setTimeout !== 'undefined' ? setTimeout : this.createTimerFallback();
                dependencies.clearTimeout = typeof clearTimeout !== 'undefined' ? clearTimeout : this.createTimerFallback();
                dependencies.requestAnimationFrame = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : this.createRAFFallback();
                dependencies.IntersectionObserver = typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : this.createIntersectionObserverFallback();
                
                // Environment-specific dependencies
                if (environment.browser) {
                    dependencies.document = typeof document !== 'undefined' ? document : null;
                    dependencies.window = typeof window !== 'undefined' ? window : null;
                }
                
                // Apply any additional overrides
                Object.assign(dependencies, overrides);
                
                return {
                    dependencies,
                    environment,
                    config: this.createDefaultConfiguration(config),
                    loadedAt: new Date().toISOString(),
                    loadedModules: Object.keys(dependencies).filter(key => dependencies[key] !== null)
                };
            } catch (error) {
                return this.createEmergencyFallbackContainer(error);
            }
        }

        /**
         * Initialize complete performance system
         * @param {Object} options - Initialization options
         * @returns {Object} Initialized performance system
         */
        static initializePerformanceSystem(options = {}) {
            try {
                const {
                    config = {},
                    dependencies = {},
                    autoStart = true,
                    enableMonitoring = true
                } = options;
                
                // Create dependency container
                const container = this.createDependencyContainer(dependencies, config);
                
                // Initialize core system
                const PerformanceCore = container.dependencies.core;
                if (!PerformanceCore) {
                    throw new Error('PerformanceCore not available');
                }
                
                const performanceSystem = new PerformanceCore(
                    container.dependencies,
                    container.config
                );
                
                // Setup system monitoring if enabled
                if (enableMonitoring && autoStart) {
                    this.setupSystemMonitoring(performanceSystem, container);
                }
                
                return {
                    system: performanceSystem,
                    container,
                    initialized: true,
                    initializationTime: Date.now(),
                    monitoring: enableMonitoring,
                    
                    // Helper methods
                    getStatistics: () => performanceSystem.getPerformanceStatistics(),
                    shutdown: () => this.shutdownPerformanceSystem(performanceSystem),
                    restart: (newOptions = {}) => this.initializePerformanceSystem({ ...options, ...newOptions })
                };
            } catch (error) {
                return this.createFailsafeSystem(error);
            }
        }

        /**
         * Load PerformanceValidators module
         * @returns {Object} PerformanceValidators class or fallback
         */
        static loadPerformanceValidators() {
            const environment = this.detectEnvironment();
            
            try {
                if (environment.browser && typeof window !== 'undefined' && window.PerformanceValidators) {
                    return window.PerformanceValidators;
                }
                
                if (environment.node && typeof require !== 'undefined') {
                    return require('./PerformanceValidators');
                }
                
                // ES6 modules - provide fallback for compatibility
                return this.createValidatorsFallback();
            } catch (error) {
                return this.createValidatorsFallback();
            }
        }

        /**
         * Load PerformanceProcessors module
         * @returns {Object} PerformanceProcessors class or fallback
         */
        static loadPerformanceProcessors() {
            const environment = this.detectEnvironment();
            
            try {
                if (environment.browser && typeof window !== 'undefined' && window.PerformanceProcessors) {
                    return window.PerformanceProcessors;
                }
                
                if (environment.node && typeof require !== 'undefined') {
                    return require('./PerformanceProcessors');
                }
                
                return this.createProcessorsFallback();
            } catch (error) {
                return this.createProcessorsFallback();
            }
        }

        /**
         * Load PerformanceUIBuilders module
         * @returns {Object} PerformanceUIBuilders class or fallback
         */
        static loadPerformanceUIBuilders() {
            const environment = this.detectEnvironment();
            
            try {
                if (environment.browser && typeof window !== 'undefined' && window.PerformanceUIBuilders) {
                    return window.PerformanceUIBuilders;
                }
                
                if (environment.node && typeof require !== 'undefined') {
                    return require('./PerformanceUIBuilders');
                }
                
                return this.createUIBuildersFallback();
            } catch (error) {
                return this.createUIBuildersFallback();
            }
        }

        /**
         * Load PerformanceCore module
         * @returns {Object} PerformanceCore class or fallback
         */
        static loadPerformanceCore() {
            const environment = this.detectEnvironment();
            
            try {
                if (environment.browser && typeof window !== 'undefined' && window.PerformanceCore) {
                    return window.PerformanceCore;
                }
                
                if (environment.node && typeof require !== 'undefined') {
                    return require('./PerformanceCore');
                }
                
                return this.createCoreFallback();
            } catch (error) {
                return this.createCoreFallback();
            }
        }

        /**
         * Create default configuration for performance system
         * @param {Object} userConfig - User-provided configuration
         * @returns {Object} Complete configuration object
         */
        static createDefaultConfiguration(userConfig = {}) {
            const environment = this.detectEnvironment();
            
            const defaultConfig = {
                // Cache settings
                cache: {
                    maxSize: environment.node ? 1000 : 100,
                    defaultTTL: 300000, // 5 minutes
                    cleanupInterval: 60000, // 1 minute
                    enableCleanup: true
                },
                
                // Memory monitoring
                memory: {
                    monitoringEnabled: environment.browser && typeof performance !== 'undefined',
                    checkInterval: environment.development ? 5000 : 10000,
                    warningThreshold: 0.6,
                    criticalThreshold: 0.8,
                    enableGC: environment.development || environment.test
                },
                
                // Virtual scrolling
                virtualScroll: {
                    defaultItemHeight: 60,
                    bufferSize: environment.mobile ? 3 : 5,
                    throttleDelay: environment.mobile ? 32 : 16, // 30fps vs 60fps
                    useIntersectionObserver: typeof IntersectionObserver !== 'undefined'
                },
                
                // Performance tracking
                performance: {
                    enableTracking: true,
                    enableLogging: environment.development || environment.test,
                    logLevel: environment.development ? 'debug' : 'error',
                    enableProfiling: environment.development
                },
                
                // UI settings
                ui: {
                    theme: 'light',
                    enableAnimations: !environment.mobile,
                    compactMode: environment.mobile,
                    updateInterval: environment.mobile ? 1000 : 500
                },
                
                // Environment information
                environment
            };
            
            return this.deepMergeConfigs(defaultConfig, userConfig);
        }

        /**
         * Setup system monitoring for performance tracking
         * @param {Object} performanceSystem - Performance system instance
         * @param {Object} container - Dependency container
         */
        static setupSystemMonitoring(performanceSystem, container) {
            try {
                // Setup periodic statistics collection
                const statsInterval = setInterval(() => {
                    try {
                        const stats = performanceSystem.getPerformanceStatistics();
                        this.logPerformanceStats(stats, container.config);
                    } catch (statsError) {
                        this.logWarning(`Stats collection error: ${statsError.message}`);
                    }
                }, container.config.ui.updateInterval);
                
                // Setup cleanup on page unload (browser only)
                if (container.environment.browser && typeof window !== 'undefined') {
                    window.addEventListener('beforeunload', () => {
                        clearInterval(statsInterval);
                        performanceSystem.shutdown();
                    });
                }
                
                return { statsInterval, monitoring: true };
            } catch (error) {
                this.logWarning(`System monitoring setup failed: ${error.message}`);
                return { monitoring: false, error: error.message };
            }
        }

        /**
         * Shutdown performance system gracefully
         * @param {Object} performanceSystem - Performance system instance
         */
        static shutdownPerformanceSystem(performanceSystem) {
            try {
                if (performanceSystem && typeof performanceSystem.shutdown === 'function') {
                    performanceSystem.shutdown();
                }
                return { shutdown: true, timestamp: new Date().toISOString() };
            } catch (error) {
                return { shutdown: false, error: error.message };
            }
        }

        /**
         * Detect execution environment
         * @returns {Object} Environment information
         */
        static detectEnvironment() {
            return {
                browser: typeof window !== 'undefined' && typeof document !== 'undefined',
                node: typeof process !== 'undefined' && process.versions && process.versions.node,
                worker: typeof WorkerGlobalScope !== 'undefined',
                mobile: typeof window !== 'undefined' && window.navigator && /Mobile|Android|iPhone|iPad/.test(window.navigator.userAgent),
                development: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development',
                test: typeof process !== 'undefined' && process.env && (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined),
                production: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production',
                
                // Feature detection
                hasPerformanceAPI: typeof performance !== 'undefined',
                hasIntersectionObserver: typeof IntersectionObserver !== 'undefined',
                hasRequestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
                hasLocalStorage: typeof localStorage !== 'undefined',
                hasSessionStorage: typeof sessionStorage !== 'undefined'
            };
        }

        /**
         * Deep merge configuration objects
         * @param {Object} target - Target configuration
         * @param {Object} source - Source configuration
         * @returns {Object} Merged configuration
         */
        static deepMergeConfigs(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMergeConfigs(target[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            
            return result;
        }

        /**
         * Log performance statistics
         * @param {Object} stats - Performance statistics
         * @param {Object} config - Configuration object
         */
        static logPerformanceStats(stats, config) {
            if (!config.performance.enableLogging) return;
            
            try {
                const summary = {
                    uptime: Math.round(stats.uptime / 1000),
                    cacheHitRate: stats.cacheHits + stats.cacheMisses > 0 ? 
                        Math.round((stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100) : 0,
                    memoryStatus: stats.memory ? stats.memory.status : 'unknown',
                    timestamp: stats.timestamp
                };
                
                if (config.performance.logLevel === 'debug') {
                    console.log('Performance Stats:', summary);
                }
            } catch (error) {
                // Silent fail for logging
            }
        }

        /**
         * Create validators fallback
         * @returns {Object} Fallback validators
         */
        static createValidatorsFallback() {
            return {
                validateCacheKey: (key) => typeof key === 'string' && key.length > 0,
                validateContainer: (container) => container && typeof container === 'object',
                validateMemoryThreshold: (threshold) => typeof threshold === 'number' && threshold >= 0 && threshold <= 1,
                validateBufferSize: (size) => typeof size === 'number' && size >= 0,
                validateItemHeight: (height) => typeof height === 'number' && height > 0,
                validateThrottleDelay: (delay) => typeof delay === 'number' && delay >= 0,
                validateMonitoringInterval: (interval) => typeof interval === 'number' && interval > 0,
                validateIntersectionObserverOptions: (options) => options === null || typeof options === 'object',
                validateRenderFunction: (func) => func === null || typeof func === 'function',
                getModuleInfo: () => ({ name: 'PerformanceValidators (Fallback)', version: '1.0.0-fallback' })
            };
        }

        /**
         * Create processors fallback
         * @returns {Object} Fallback processors
         */
        static createProcessorsFallback() {
            return {
                processMemoryStatistics: () => ({ processed: false, error: 'Fallback processor' }),
                processCacheStatistics: () => ({ processed: false, error: 'Fallback processor' }),
                processPerformanceTiming: () => ({ processed: false, error: 'Fallback processor' }),
                calculateVisibleRange: () => ({ calculated: false, error: 'Fallback processor' }),
                processThrottleConfiguration: () => ({ processed: false, error: 'Fallback processor' }),
                getModuleInfo: () => ({ name: 'PerformanceProcessors (Fallback)', version: '1.0.0-fallback' })
            };
        }

        /**
         * Create UI builders fallback
         * @returns {Object} Fallback UI builders
         */
        static createUIBuildersFallback() {
            return {
                buildMemoryStatsPanel: () => ({ built: false, error: 'Fallback UI builder' }),
                buildCacheStatsPanel: () => ({ built: false, error: 'Fallback UI builder' }),
                buildPerformanceTimingDisplay: () => ({ built: false, error: 'Fallback UI builder' }),
                buildVirtualScrollContainer: () => ({ built: false, error: 'Fallback UI builder' }),
                buildPerformanceDashboard: () => ({ built: false, error: 'Fallback UI builder' }),
                buildErrorPanel: (message) => ({ built: true, element: `<div class="error">${message}</div>` }),
                getModuleInfo: () => ({ name: 'PerformanceUIBuilders (Fallback)', version: '1.0.0-fallback' })
            };
        }

        /**
         * Create core fallback
         * @returns {Function} Fallback core constructor
         */
        static createCoreFallback() {
            return class PerformanceCoreFallback {
                constructor() {
                    this.fallback = true;
                }
                
                setCache() { return false; }
                getCache() { return null; }
                performCacheCleanup() { return { cleaned: 0, remaining: 0 }; }
                checkMemoryUsage() { return { available: false }; }
                createVirtualScroll() { return null; }
                getPerformanceStatistics() { return { fallback: true, error: 'Core not available' }; }
                shutdown() { return true; }
                
                static getModuleInfo() {
                    return { name: 'PerformanceCore (Fallback)', version: '1.0.0-fallback' };
                }
            };
        }

        /**
         * Create emergency fallback container
         * @param {Error} error - Initialization error
         * @returns {Object} Emergency fallback container
         */
        static createEmergencyFallbackContainer(error) {
            return {
                dependencies: {
                    validators: this.createValidatorsFallback(),
                    processors: this.createProcessorsFallback(),
                    uiBuilders: this.createUIBuildersFallback(),
                    core: this.createCoreFallback()
                },
                environment: this.detectEnvironment(),
                config: this.createDefaultConfiguration(),
                emergency: true,
                error: error.message,
                loadedAt: new Date().toISOString()
            };
        }

        /**
         * Create failsafe system when initialization fails
         * @param {Error} error - Initialization error
         * @returns {Object} Failsafe system object
         */
        static createFailsafeSystem(error) {
            const CoreFallback = this.createCoreFallback();
            
            return {
                system: new CoreFallback(),
                container: this.createEmergencyFallbackContainer(error),
                initialized: false,
                failsafe: true,
                error: error.message,
                
                getStatistics: () => ({ failsafe: true, error: error.message }),
                shutdown: () => ({ shutdown: true, failsafe: true }),
                restart: () => this.createFailsafeSystem(error)
            };
        }

        /**
         * Create various API fallbacks
         */
        static createPerformanceFallback() {
            return {
                now: () => Date.now(),
                memory: null,
                getEntriesByType: () => []
            };
        }

        static createConsoleFallback() {
            return {
                log: () => {},
                warn: () => {},
                error: () => {},
                info: () => {},
                debug: () => {}
            };
        }

        static createTimerFallback() {
            return () => {};
        }

        static createRAFFallback() {
            return (callback) => setTimeout(callback, 16);
        }

        static createIntersectionObserverFallback() {
            return class {
                constructor() {}
                observe() {}
                unobserve() {}
                disconnect() {}
            };
        }

        /**
         * Log warning message
         * @param {string} message - Warning message
         */
        static logWarning(message) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn(`PerformanceUtilities: ${message}`);
            }
        }

        /**
         * Get module information for documentation and debugging
         * @returns {Object} Module information including version and capabilities
         */
        static getModuleInfo() {
            return {
                name: 'PerformanceUtilities',
                version: '1.0.0',
                extractionPhase: 'API Class Extraction',
                architecture: 'Functional Core, Imperative Shell',
                role: 'Dependency injection factory and utilities',
                dependencies: 'All performance modules (dynamic loading)',
                capabilities: [
                    'Dependency injection container creation',
                    'Performance system initialization',
                    'Environment detection and adaptation',
                    'Module loading with fallbacks',
                    'Configuration management',
                    'System monitoring setup',
                    'Graceful shutdown handling',
                    'Emergency fallback systems'
                ],
                extractedAt: new Date().toISOString(),
                extractedBy: 'API Class Extraction Methodology v1.0'
            };
        }
    }

    // Return the class for module systems
    return PerformanceUtilities;
});