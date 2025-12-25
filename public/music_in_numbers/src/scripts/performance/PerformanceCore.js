/**
 * PerformanceCore.js
 * 
 * Part 4 of 5 in the Performance API Class Extraction
 * 
 * PURPOSE:
 * Orchestration logic with comprehensive dependency injection for performance
 * optimization, cache management, memory monitoring, and virtual scrolling coordination.
 * 
 * ARCHITECTURE:
 * - Dependency injection container
 * - Environment-aware configuration
 * - Coordinated business logic orchestration
 * - Integration with pure function modules
 * 
 * PATTERNS FOLLOWED:
 * - "Imperative Shell" - Coordinates side effects and state
 * - Dependency injection with production/development/test configs
 * - Comprehensive error handling and logging
 * - Environment detection and adaptation
 * 
 * EXTRACTION CONSISTENCY:
 * This follows the exact same patterns as:
 * - AnalyticsCore.js (analytics orchestration with DI)
 * - ArtistCore.js (artist data coordination)
 * - InitializationCore.js (startup and config management)
 * - SpotifyApiCore.js (API coordination and state management)
 * - RealTimeCore.js (real-time monitoring orchestration)
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
        global.PerformanceCore = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this, function() {
    
    'use strict';

    /**
     * PerformanceCore
     * 
     * Core orchestration class for performance optimization with comprehensive
     * dependency injection, cache management, memory monitoring, and virtual scrolling.
     */
    class PerformanceCore {
        
        /**
         * Initialize PerformanceCore with dependency injection
         * @param {Object} dependencies - Injected dependencies
         * @param {Object} config - Configuration object
         */
        constructor(dependencies = {}, config = {}) {
            // Dependency injection setup
            this.dependencies = this.setupDependencies(dependencies);
            this.config = this.setupConfiguration(config);
            
            // Core state management
            this.cache = new Map();
            this.cacheExpiry = new Map();
            this.requestQueue = [];
            this.memoryMonitorInterval = null;
            this.performanceObserver = null;
            
            // Virtual scrolling state
            this.virtualScrollInstances = new Map();
            this.intersectionObservers = new Map();
            
            // Performance tracking
            this.performanceStats = {
                cacheHits: 0,
                cacheMisses: 0,
                memoryChecks: 0,
                lastCleanup: null,
                startTime: Date.now()
            };
            
            // Initialize core systems
            this.initializeCore();
        }

        /**
         * Setup dependency injection container
         * @param {Object} dependencies - External dependencies
         * @returns {Object} Configured dependencies
         */
        setupDependencies(dependencies) {
            const environment = this.detectEnvironment();
            
            // Default dependency configuration
            const defaultDeps = {
                // Performance modules (will be injected)
                validators: null,
                processors: null,
                uiBuilders: null,
                utilities: null,
                
                // Browser APIs with fallbacks
                performance: typeof performance !== 'undefined' ? performance : null,
                console: typeof console !== 'undefined' ? console : { log: () => {}, warn: () => {}, error: () => {} },
                setTimeout: typeof setTimeout !== 'undefined' ? setTimeout : null,
                clearTimeout: typeof clearTimeout !== 'undefined' ? clearTimeout : null,
                requestAnimationFrame: typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : null,
                IntersectionObserver: typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null,
                
                // Environment-specific features
                document: environment.browser ? (typeof document !== 'undefined' ? document : null) : null,
                window: environment.browser ? (typeof window !== 'undefined' ? window : null) : null
            };

            return { ...defaultDeps, ...dependencies };
        }

        /**
         * Setup configuration with environment-aware defaults
         * @param {Object} config - User configuration
         * @returns {Object} Configured settings
         */
        setupConfiguration(config) {
            const environment = this.detectEnvironment();
            
            const defaultConfig = {
                // Cache configuration
                cache: {
                    maxSize: 100,
                    defaultTTL: 300000, // 5 minutes
                    cleanupInterval: 60000, // 1 minute
                    enableCleanup: true
                },
                
                // Memory monitoring
                memory: {
                    monitoringEnabled: environment.browser && typeof performance !== 'undefined',
                    checkInterval: 10000, // 10 seconds
                    warningThreshold: 0.6, // 60%
                    criticalThreshold: 0.8, // 80%
                    enableGC: environment.development
                },
                
                // Virtual scrolling
                virtualScroll: {
                    defaultItemHeight: 60,
                    bufferSize: 5,
                    throttleDelay: 16, // ~60fps
                    useIntersectionObserver: typeof IntersectionObserver !== 'undefined'
                },
                
                // Performance tracking
                performance: {
                    enableTracking: true,
                    enableLogging: environment.development,
                    logLevel: environment.development ? 'debug' : 'error'
                },
                
                // Environment flags
                environment
            };

            return this.deepMerge(defaultConfig, config);
        }

        /**
         * Initialize core systems and monitoring
         */
        initializeCore() {
            try {
                // Start cache cleanup if enabled
                if (this.config.cache.enableCleanup) {
                    this.startCacheCleanup();
                }
                
                // Start memory monitoring if enabled
                if (this.config.memory.monitoringEnabled) {
                    this.startMemoryMonitoring();
                }
                
                // Initialize performance observer if available
                if (this.dependencies.performance && this.dependencies.performance.getEntriesByType) {
                    this.initializePerformanceObserver();
                }
                
                this.log('PerformanceCore initialized successfully', 'info');
            } catch (error) {
                this.log(`Core initialization error: ${error.message}`, 'error');
            }
        }

        /**
         * Cache management with TTL and cleanup
         * @param {string} key - Cache key
         * @param {*} value - Value to cache
         * @param {number} ttl - Time to live in milliseconds
         * @returns {boolean} Success status
         */
        setCache(key, value, ttl = null) {
            try {
                // Validate key using injected validator
                if (this.dependencies.validators && !this.dependencies.validators.validateCacheKey(key)) {
                    this.log(`Invalid cache key: ${key}`, 'warn');
                    return false;
                }
                
                // Use configured TTL if not provided
                const cacheTTL = ttl || this.config.cache.defaultTTL;
                const expiryTime = Date.now() + cacheTTL;
                
                // Check cache size limits
                if (this.cache.size >= this.config.cache.maxSize) {
                    this.performCacheCleanup();
                }
                
                // Store value and expiry
                this.cache.set(key, value);
                this.cacheExpiry.set(key, expiryTime);
                
                this.performanceStats.cacheHits++;
                this.log(`Cache set: ${key} (TTL: ${cacheTTL}ms)`, 'debug');
                
                return true;
            } catch (error) {
                this.log(`Cache set error: ${error.message}`, 'error');
                return false;
            }
        }

        /**
         * Retrieve value from cache with expiry checking
         * @param {string} key - Cache key
         * @returns {*} Cached value or null
         */
        getCache(key) {
            try {
                if (!this.cache.has(key)) {
                    this.performanceStats.cacheMisses++;
                    return null;
                }
                
                const expiryTime = this.cacheExpiry.get(key);
                const now = Date.now();
                
                if (expiryTime && now >= expiryTime) {
                    // Expired - remove and return null
                    this.cache.delete(key);
                    this.cacheExpiry.delete(key);
                    this.performanceStats.cacheMisses++;
                    this.log(`Cache expired: ${key}`, 'debug');
                    return null;
                }
                
                this.performanceStats.cacheHits++;
                return this.cache.get(key);
            } catch (error) {
                this.log(`Cache get error: ${error.message}`, 'error');
                this.performanceStats.cacheMisses++;
                return null;
            }
        }

        /**
         * Start automatic cache cleanup process
         */
        startCacheCleanup() {
            if (this.cleanupInterval) {
                clearInterval(this.cleanupInterval);
            }
            
            this.cleanupInterval = setInterval(() => {
                this.performCacheCleanup();
            }, this.config.cache.cleanupInterval);
            
            this.log('Cache cleanup started', 'debug');
        }

        /**
         * Perform cache cleanup of expired entries
         * @returns {Object} Cleanup results
         */
        performCacheCleanup() {
            try {
                const now = Date.now();
                const expiredKeys = [];
                
                for (const [key, expiry] of this.cacheExpiry.entries()) {
                    if (now >= expiry) {
                        expiredKeys.push(key);
                    }
                }
                
                // Remove expired entries
                expiredKeys.forEach(key => {
                    this.cache.delete(key);
                    this.cacheExpiry.delete(key);
                });
                
                this.performanceStats.lastCleanup = now;
                
                const result = {
                    cleaned: expiredKeys.length,
                    remaining: this.cache.size,
                    timestamp: now
                };
                
                if (expiredKeys.length > 0) {
                    this.log(`Cache cleanup: removed ${expiredKeys.length} expired entries`, 'debug');
                }
                
                return result;
            } catch (error) {
                this.log(`Cache cleanup error: ${error.message}`, 'error');
                return { cleaned: 0, remaining: this.cache.size, error: error.message };
            }
        }

        /**
         * Start memory monitoring
         */
        startMemoryMonitoring() {
            if (!this.dependencies.performance || !this.dependencies.performance.memory) {
                this.log('Memory monitoring not available in this environment', 'warn');
                return;
            }
            
            if (this.memoryMonitorInterval) {
                clearInterval(this.memoryMonitorInterval);
            }
            
            this.memoryMonitorInterval = setInterval(() => {
                this.checkMemoryUsage();
            }, this.config.memory.checkInterval);
            
            this.log('Memory monitoring started', 'debug');
        }

        /**
         * Check memory usage and trigger warnings
         * @returns {Object} Memory status
         */
        checkMemoryUsage() {
            try {
                if (!this.dependencies.performance || !this.dependencies.performance.memory) {
                    return { available: false };
                }
                
                const memoryInfo = this.dependencies.performance.memory;
                
                // Process memory statistics using injected processor
                let processedStats = null;
                if (this.dependencies.processors) {
                    processedStats = this.dependencies.processors.processMemoryStatistics(memoryInfo);
                }
                
                this.performanceStats.memoryChecks++;
                
                // Check thresholds and trigger actions
                if (processedStats && processedStats.processed) {
                    const stats = processedStats.statistics;
                    const percentage = stats.percentage / 100;
                    
                    if (percentage >= this.config.memory.criticalThreshold) {
                        this.log(`Critical memory usage: ${stats.percentage}%`, 'error');
                        this.performCacheCleanup();
                        this.triggerMemoryPressureResponse();
                    } else if (percentage >= this.config.memory.warningThreshold) {
                        this.log(`High memory usage: ${stats.percentage}%`, 'warn');
                    }
                    
                    return {
                        available: true,
                        status: stats.status,
                        percentage: stats.percentage,
                        used: stats.used,
                        limit: stats.limit
                    };
                }
                
                return { available: true, processed: false };
            } catch (error) {
                this.log(`Memory check error: ${error.message}`, 'error');
                return { available: false, error: error.message };
            }
        }

        /**
         * Create virtual scrolling instance
         * @param {HTMLElement} container - Container element
         * @param {Array} items - Items to virtualize
         * @param {Object} options - Virtual scroll options
         * @returns {Object} Virtual scroll instance
         */
        createVirtualScroll(container, items = [], options = {}) {
            try {
                // Validate container using injected validator
                if (this.dependencies.validators && !this.dependencies.validators.validateContainer(container)) {
                    throw new Error('Invalid container element');
                }
                
                const config = { ...this.config.virtualScroll, ...options };
                const instanceId = `vs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                const instance = {
                    id: instanceId,
                    container,
                    items,
                    config,
                    currentRange: { start: 0, end: 0 },
                    lastScrollTop: 0,
                    throttledUpdateFn: null
                };
                
                // Setup throttled update function
                instance.throttledUpdateFn = this.createThrottledFunction(
                    () => this.updateVirtualScrollView(instanceId),
                    config.throttleDelay
                );
                
                // Setup scroll listener
                container.addEventListener('scroll', instance.throttledUpdateFn);
                
                // Setup intersection observer if available
                if (config.useIntersectionObserver && this.dependencies.IntersectionObserver) {
                    this.setupIntersectionObserver(instanceId, container);
                }
                
                // Store instance
                this.virtualScrollInstances.set(instanceId, instance);
                
                // Initial render
                this.updateVirtualScrollView(instanceId);
                
                this.log(`Virtual scroll instance created: ${instanceId}`, 'debug');
                
                return {
                    id: instanceId,
                    instance,
                    destroy: () => this.destroyVirtualScroll(instanceId)
                };
            } catch (error) {
                this.log(`Virtual scroll creation error: ${error.message}`, 'error');
                return null;
            }
        }

        /**
         * Update virtual scroll view
         * @param {string} instanceId - Virtual scroll instance ID
         */
        updateVirtualScrollView(instanceId) {
            try {
                const instance = this.virtualScrollInstances.get(instanceId);
                if (!instance) return;
                
                const scrollTop = instance.container.scrollTop;
                const containerHeight = instance.container.clientHeight;
                
                // Calculate visible range using injected processor
                let rangeData = null;
                if (this.dependencies.processors) {
                    rangeData = this.dependencies.processors.calculateVisibleRange(
                        scrollTop,
                        containerHeight,
                        instance.config.itemHeight,
                        instance.items.length,
                        instance.config.bufferSize
                    );
                }
                
                if (rangeData && rangeData.calculated) {
                    instance.currentRange = rangeData.range;
                    instance.lastScrollTop = scrollTop;
                    
                    // Trigger render update if UI builder is available
                    if (this.dependencies.uiBuilders) {
                        this.renderVirtualScrollItems(instanceId, rangeData);
                    }
                }
            } catch (error) {
                this.log(`Virtual scroll update error: ${error.message}`, 'error');
            }
        }

        /**
         * Render virtual scroll items
         * @param {string} instanceId - Instance ID
         * @param {Object} rangeData - Calculated range data
         */
        renderVirtualScrollItems(instanceId, rangeData) {
            try {
                const instance = this.virtualScrollInstances.get(instanceId);
                if (!instance) return;
                
                // Use UI builder to generate container
                const containerResult = this.dependencies.uiBuilders.buildVirtualScrollContainer(
                    rangeData,
                    instance.items.slice(rangeData.range.start, rangeData.range.end),
                    instance.config.itemRenderer,
                    {
                        containerHeight: instance.container.clientHeight,
                        itemHeight: instance.config.itemHeight,
                        className: 'virtual-scroll-content'
                    }
                );
                
                if (containerResult.built) {
                    // Update container content (this is the imperative shell part)
                    instance.container.innerHTML = containerResult.element;
                }
            } catch (error) {
                this.log(`Virtual scroll render error: ${error.message}`, 'error');
            }
        }

        /**
         * Get comprehensive performance statistics
         * @returns {Object} Performance statistics
         */
        getPerformanceStatistics() {
            try {
                const stats = { ...this.performanceStats };
                
                // Add cache statistics using processor if available
                if (this.dependencies.processors) {
                    const cacheStats = this.dependencies.processors.processCacheStatistics(
                        this.cache,
                        this.cacheExpiry,
                        this.requestQueue
                    );
                    stats.cache = cacheStats;
                }
                
                // Add memory statistics if available
                const memoryStatus = this.checkMemoryUsage();
                if (memoryStatus.available) {
                    stats.memory = memoryStatus;
                }
                
                // Add timing information
                stats.uptime = Date.now() - stats.startTime;
                stats.timestamp = new Date().toISOString();
                
                return stats;
            } catch (error) {
                this.log(`Performance statistics error: ${error.message}`, 'error');
                return { error: error.message, timestamp: new Date().toISOString() };
            }
        }

        /**
         * Create throttled function
         * @param {Function} func - Function to throttle
         * @param {number} delay - Throttle delay
         * @returns {Function} Throttled function
         */
        createThrottledFunction(func, delay) {
            let lastExecution = 0;
            let timeoutId = null;
            
            return function throttled(...args) {
                const now = Date.now();
                
                if (now - lastExecution >= delay) {
                    lastExecution = now;
                    func.apply(this, args);
                } else if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        lastExecution = Date.now();
                        timeoutId = null;
                        func.apply(this, args);
                    }, delay - (now - lastExecution));
                }
            };
        }

        /**
         * Trigger memory pressure response
         */
        triggerMemoryPressureResponse() {
            try {
                // Clear all expired cache entries
                this.performCacheCleanup();
                
                // Clear request queue
                this.requestQueue.length = 0;
                
                // Suggest garbage collection if available
                if (this.config.memory.enableGC && typeof gc === 'function') {
                    gc();
                }
                
                this.log('Memory pressure response triggered', 'info');
            } catch (error) {
                this.log(`Memory pressure response error: ${error.message}`, 'error');
            }
        }

        /**
         * Destroy virtual scroll instance
         * @param {string} instanceId - Instance ID to destroy
         */
        destroyVirtualScroll(instanceId) {
            try {
                const instance = this.virtualScrollInstances.get(instanceId);
                if (!instance) return;
                
                // Remove event listeners
                if (instance.throttledUpdateFn) {
                    instance.container.removeEventListener('scroll', instance.throttledUpdateFn);
                }
                
                // Cleanup intersection observer
                const observer = this.intersectionObservers.get(instanceId);
                if (observer) {
                    observer.disconnect();
                    this.intersectionObservers.delete(instanceId);
                }
                
                // Remove instance
                this.virtualScrollInstances.delete(instanceId);
                
                this.log(`Virtual scroll instance destroyed: ${instanceId}`, 'debug');
            } catch (error) {
                this.log(`Virtual scroll destroy error: ${error.message}`, 'error');
            }
        }

        /**
         * Shutdown core systems
         */
        shutdown() {
            try {
                // Clear intervals
                if (this.cleanupInterval) {
                    clearInterval(this.cleanupInterval);
                    this.cleanupInterval = null;
                }
                
                if (this.memoryMonitorInterval) {
                    clearInterval(this.memoryMonitorInterval);
                    this.memoryMonitorInterval = null;
                }
                
                // Destroy all virtual scroll instances
                for (const instanceId of this.virtualScrollInstances.keys()) {
                    this.destroyVirtualScroll(instanceId);
                }
                
                // Clear caches
                this.cache.clear();
                this.cacheExpiry.clear();
                this.requestQueue.length = 0;
                
                this.log('PerformanceCore shutdown complete', 'info');
            } catch (error) {
                this.log(`Shutdown error: ${error.message}`, 'error');
            }
        }

        /**
         * Detect execution environment
         * @returns {Object} Environment information
         */
        detectEnvironment() {
            return {
                browser: typeof window !== 'undefined' && typeof document !== 'undefined',
                node: typeof process !== 'undefined' && process.versions && process.versions.node,
                worker: typeof WorkerGlobalScope !== 'undefined',
                development: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development',
                test: typeof process !== 'undefined' && process.env && (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined)
            };
        }

        /**
         * Deep merge configuration objects
         * @param {Object} target - Target object
         * @param {Object} source - Source object
         * @returns {Object} Merged object
         */
        deepMerge(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(target[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            
            return result;
        }

        /**
         * Logging with configurable levels
         * @param {string} message - Log message
         * @param {string} level - Log level
         */
        log(message, level = 'info') {
            if (!this.config.performance.enableLogging) return;
            
            const logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
            const currentLevel = logLevels[this.config.performance.logLevel] || 1;
            const messageLevel = logLevels[level] || 1;
            
            if (messageLevel >= currentLevel && this.dependencies.console) {
                const timestamp = new Date().toISOString();
                const logMessage = `[${timestamp}] PerformanceCore: ${message}`;
                
                switch (level) {
                    case 'debug':
                    case 'info':
                        this.dependencies.console.log(logMessage);
                        break;
                    case 'warn':
                        this.dependencies.console.warn(logMessage);
                        break;
                    case 'error':
                        this.dependencies.console.error(logMessage);
                        break;
                    default:
                        this.dependencies.console.log(logMessage);
                }
            }
        }

        /**
         * Get module information for documentation and debugging
         * @returns {Object} Module information including version and capabilities
         */
        static getModuleInfo() {
            return {
                name: 'PerformanceCore',
                version: '1.0.0',
                extractionPhase: 'API Class Extraction',
                architecture: 'Functional Core, Imperative Shell',
                role: 'Orchestration and dependency injection',
                dependencies: 'PerformanceValidators, PerformanceProcessors, PerformanceUIBuilders, PerformanceUtilities',
                capabilities: [
                    'Dependency injection container',
                    'Cache management with TTL',
                    'Memory monitoring and pressure response',
                    'Virtual scrolling orchestration',
                    'Performance statistics tracking',
                    'Environment-aware configuration',
                    'Throttled function creation',
                    'Comprehensive logging system'
                ],
                extractedAt: new Date().toISOString(),
                extractedBy: 'API Class Extraction Methodology v1.0'
            };
        }
    }

    // Return the class for module systems
    return PerformanceCore;
});