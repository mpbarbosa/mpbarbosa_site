// ===== PERFORMANCE OPTIMIZATION ENGINE - MODULAR ARCHITECTURE =====
//
// This file has been transformed from a monolithic structure to a modular
// architecture using the "Functional Core, Imperative Shell" pattern.
// 
// ARCHITECTURE OVERVIEW:
// - PerformanceValidators: Pure validation functions
// - PerformanceProcessors: Pure data processing functions  
// - PerformanceUIBuilders: Pure UI building functions
// - PerformanceCore: Orchestration with dependency injection
// - PerformanceUtilities: DI factory and environment utilities
//
// This delegation wrapper maintains 100% backward compatibility while
// providing the benefits of modular, testable, and maintainable code.

// Initialize the modular performance system
let performanceSystem = null;

// Initialize system on load
(function initializeModularPerformanceSystem() {
    try {
        // Load performance utilities for system initialization
        if (typeof PerformanceUtilities !== 'undefined') {
            performanceSystem = PerformanceUtilities.initializePerformanceSystem({
                autoStart: true,
                enableMonitoring: true,
                config: {
                    cache: {
                        maxSize: 100,
                        defaultTTL: 5 * 60 * 1000, // 5 minutes
                        enableCleanup: true
                    },
                    memory: {
                        warningThreshold: 0.6,
                        criticalThreshold: 0.8,
                        checkInterval: 30000 // 30 seconds
                    }
                }
            });
            
            console.log('🚀 Modular performance system initialized successfully');
        } else {
            console.warn('⚠️ PerformanceUtilities not found, using fallback implementation');
            initializeFallbackSystem();
        }
    } catch (error) {
        console.error('❌ Failed to initialize modular performance system:', error);
        initializeFallbackSystem();
    }
})();

// Backward-compatible PerformanceOptimizer class (delegation wrapper)
class PerformanceOptimizer {
    constructor() {
        // Delegate to modular system if available
        if (performanceSystem && performanceSystem.system) {
            this.core = performanceSystem.system;
            this.cache = this.core.cache;
            this.cacheExpiry = this.core.cacheExpiry;
            this.requestQueue = this.core.requestQueue;
            this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
            this.memoryThreshold = 50 * 1024 * 1024; // 50MB
            this.isRequestInProgress = false;
        } else {
            // Fallback to basic implementation
            this.cache = new Map();
            this.cacheExpiry = new Map();
            this.requestQueue = [];
            this.cacheTimeout = 5 * 60 * 1000;
            this.memoryThreshold = 50 * 1024 * 1024;
            this.isRequestInProgress = false;
            this.initPerformanceMonitoring();
        }
    }
    
    // Initialize performance monitoring (fallback implementation)
    initPerformanceMonitoring() {
        if (this.core) return; // Skip if using modular system
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000); // Check every 30 seconds
        }
        
        // Monitor page visibility for cache management
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseOperations();
            } else {
                this.resumeOperations();
            }
        });
    }
    
    // Cache management - delegates to modular system
    setCache(key, data, customTimeout = null) {
        if (this.core) {
            const timeout = customTimeout || this.cacheTimeout;
            return this.core.setCache(key, data, timeout);
        }
        
        // Fallback implementation
        const timeout = customTimeout || this.cacheTimeout;
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + timeout);
        
        setTimeout(() => {
            this.cleanupExpiredCache();
        }, timeout + 1000);
    }
    
    getCache(key) {
        if (this.core) {
            return this.core.getCache(key);
        }
        
        // Fallback implementation
        if (this.cache.has(key)) {
            const expiry = this.cacheExpiry.get(key);
            if (Date.now() < expiry) {
                return this.cache.get(key);
            } else {
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }
        return null;
    }
    
    cleanupExpiredCache() {
        if (this.core) {
            return this.core.performCacheCleanup();
        }
        
        // Fallback implementation
        const now = Date.now();
        for (const [key, expiry] of this.cacheExpiry.entries()) {
            if (now >= expiry) {
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }
    }
    
    // Request queuing and deduplication
    async queueRequest(requestFn, cacheKey) {
        // Check cache first
        const cachedData = this.getCache(cacheKey);
        if (cachedData) {
            console.log(`📦 Cache hit for ${cacheKey}`);
            return cachedData;
        }
        
        // Check if request is already in progress
        const existingRequest = this.requestQueue.find(req => req.cacheKey === cacheKey);
        if (existingRequest) {
            console.log(`⏳ Request already in progress for ${cacheKey}`);
            return existingRequest.promise;
        }
        
        // Create new request
        console.log(`🔄 New request for ${cacheKey}`);
        const requestPromise = this.executeRequest(requestFn, cacheKey);
        this.requestQueue.push({ cacheKey, promise: requestPromise });
        
        try {
            const result = await requestPromise;
            this.setCache(cacheKey, result);
            return result;
        } finally {
            // Remove from queue
            this.requestQueue = this.requestQueue.filter(req => req.cacheKey !== cacheKey);
        }
    }
    
    async executeRequest(requestFn, cacheKey) {
        const startTime = performance.now();
        try {
            const result = await requestFn();
            const endTime = performance.now();
            console.log(`✅ Request completed for ${cacheKey} in ${Math.round(endTime - startTime)}ms`);
            return result;
        } catch (error) {
            console.error(`❌ Request failed for ${cacheKey}:`, error);
            throw error;
        }
    }
    
    // Memory management - delegates to modular system
    checkMemoryUsage() {
        if (this.core) {
            return this.core.checkMemoryUsage();
        }
        
        // Fallback implementation
        if (performance.memory && performance.memory.usedJSHeapSize > this.memoryThreshold) {
            console.warn('🔥 High memory usage detected, performing cleanup...');
            this.performMemoryCleanup();
        }
    }
    
    performMemoryCleanup() {
        if (this.core) {
            this.core.performCacheCleanup();
            return;
        }
        
        // Fallback implementation
        const beforeSize = this.cache.size;
        this.cleanupExpiredCache();
        
        for (const [key, data] of this.cache.entries()) {
            if (this.getObjectSize(data) > 1024 * 1024) { // 1MB
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }
        
        const afterSize = this.cache.size;
        console.log(`🧹 Memory cleanup: ${beforeSize - afterSize} cache entries removed`);
        
        if (window.gc) {
            window.gc();
        }
    }
    
    getObjectSize(obj) {
        // Use modular processor if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.processors) {
            return performanceSystem.container.dependencies.processors.estimateObjectSize(obj);
        }
        
        // Fallback implementation
        return JSON.stringify(obj).length * 2;
    }
    
    pauseOperations() {
        this.isRequestInProgress = false;
        console.log('⏸️ Operations paused due to page visibility');
    }
    
    resumeOperations() {
        if (this.requestQueue.length > 0) {
            console.log('▶️ Operations resumed with', this.requestQueue.length, 'pending requests');
        }
    }
    
    clearCache() {
        if (this.core) {
            this.core.cache.clear();
            this.core.cacheExpiry.clear();
        } else {
            this.cache.clear();
            this.cacheExpiry.clear();
        }
        console.log('🗑️ All cache cleared');
    }
    
    getCacheStats() {
        // Use modular system statistics if available
        if (this.core) {
            const stats = this.core.getPerformanceStatistics();
            return {
                size: this.core.cache.size,
                totalRequests: this.core.requestQueue.length,
                memoryUsage: stats.memory && stats.memory.available ? {
                    used: stats.memory.used,
                    total: performance.memory ? Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB' : 'N/A',
                    limit: performance.memory ? Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB' : 'N/A'
                } : 'Not available'
            };
        }
        
        // Fallback implementation
        return {
            size: this.cache.size,
            totalRequests: this.requestQueue.length,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            } : 'Not available'
        };
    }
}

// Backward-compatible LazyLoader class (delegation wrapper)
class LazyLoader {
    constructor() {
        this.observer = null;
        this.loadedElements = new Set();
        this.initIntersectionObserver();
    }
    
    initIntersectionObserver() {
        // Use modular system if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.validators) {
            
            const validators = performanceSystem.container.dependencies.validators;
            const observerOptions = {
                rootMargin: '50px 0px',
                threshold: 0.1
            };
            
            if (validators.validateIntersectionObserverOptions(observerOptions) && 
                'IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    // Process entries using modular processors if available
                    if (performanceSystem.container.dependencies.processors) {
                        const processed = performanceSystem.container.dependencies.processors.processIntersectionEntries(entries);
                        if (processed.processed) {
                            processed.intersection.visibleElements.forEach(elementData => {
                                if (!this.loadedElements.has(elementData.target)) {
                                    this.loadElement(elementData.target);
                                    this.loadedElements.add(elementData.target);
                                    this.observer.unobserve(elementData.target);
                                }
                            });
                        }
                    } else {
                        // Fallback to original logic
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !this.loadedElements.has(entry.target)) {
                                this.loadElement(entry.target);
                                this.loadedElements.add(entry.target);
                                this.observer.unobserve(entry.target);
                            }
                        });
                    }
                }, observerOptions);
            }
        } else {
            // Fallback implementation
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.loadedElements.has(entry.target)) {
                            this.loadElement(entry.target);
                            this.loadedElements.add(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });
            }
        }
    }
    
    observe(element) {
        // Validate element using modular validators if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.validators) {
            const validators = performanceSystem.container.dependencies.validators;
            if (validators.validateContainer(element) && this.observer) {
                this.observer.observe(element);
            }
        } else {
            // Fallback validation
            if (this.observer && element) {
                this.observer.observe(element);
            }
        }
    }
    
    loadElement(element) {
        // Handle lazy loading of images
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        // Handle lazy loading of content sections
        if (element.dataset.loadCallback) {
            const callback = window[element.dataset.loadCallback];
            if (typeof callback === 'function') {
                callback(element);
            }
        }
        
        element.classList.add('loaded');
        console.log('👁️ Lazy loaded element:', element);
    }
    
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.loadedElements.clear();
    }
}

// Backward-compatible VirtualScroller class (delegation wrapper)
class VirtualScroller {
    constructor(container, itemHeight = 60, bufferSize = 5) {
        // Validate inputs using modular validators if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.validators) {
            const validators = performanceSystem.container.dependencies.validators;
            
            if (!validators.validateContainer(container)) {
                throw new Error('Invalid container element');
            }
            if (!validators.validateItemHeight(itemHeight)) {
                throw new Error('Invalid item height');
            }
            if (!validators.validateBufferSize(bufferSize)) {
                throw new Error('Invalid buffer size');
            }
        }
        
        this.container = container;
        this.itemHeight = itemHeight;
        this.bufferSize = bufferSize;
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.totalItems = 0;
        this.visibleStart = 0;
        this.visibleEnd = 0;
        this.renderFunction = null;
        this.data = [];
        this.renderedElements = new Map();
        
        // Use modular virtual scroll if available
        if (performanceSystem && performanceSystem.system) {
            this.modularInstance = performanceSystem.system.createVirtualScroll(
                container, 
                [], 
                {
                    itemHeight,
                    bufferSize,
                    itemRenderer: null
                }
            );
        }
        
        this.initScrolling();
    }
    
    initScrolling() {
        if (!this.container) return;
        
        // Use modular throttled function if available
        let throttledUpdate;
        if (performanceSystem && performanceSystem.system) {
            throttledUpdate = performanceSystem.system.createThrottledFunction(() => {
                this.scrollTop = this.container.scrollTop;
                this.updateVisibleRange();
                this.renderVisibleItems();
            }, 16);
        } else {
            throttledUpdate = this.throttle(() => {
                this.scrollTop = this.container.scrollTop;
                this.updateVisibleRange();
                this.renderVisibleItems();
            }, 16);
        }
        
        this.container.addEventListener('scroll', throttledUpdate);
        
        // Initial setup
        this.containerHeight = this.container.clientHeight;
        this.updateVisibleRange();
    }
    
    throttle(func, delay) {
        // Use modular throttle configuration if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.processors) {
            const processors = performanceSystem.container.dependencies.processors;
            const throttleConfig = processors.processThrottleConfiguration(func, delay);
            
            if (throttleConfig.processed && throttleConfig.configuration.settings.useRequestAnimationFrame) {
                let rafId;
                return function (...args) {
                    if (rafId) return;
                    rafId = requestAnimationFrame(() => {
                        func.apply(this, args);
                        rafId = null;
                    });
                };
            }
        }
        
        // Fallback throttle implementation
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    setData(items, renderFn) {
        // Validate render function using modular validators if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.validators) {
            const validators = performanceSystem.container.dependencies.validators;
            if (!validators.validateRenderFunction(renderFn)) {
                throw new Error('Invalid render function');
            }
        }
        
        this.totalItems = items.length;
        this.data = items;
        this.renderFunction = renderFn;
        
        // Update modular instance if available
        if (this.modularInstance) {
            this.modularInstance.instance.items = items;
            this.modularInstance.instance.config.itemRenderer = renderFn;
        }
        
        // Create a wrapper for virtual scrolling
        if (!this.wrapper) {
            this.wrapper = document.createElement('div');
            this.wrapper.style.position = 'relative';
            this.container.appendChild(this.wrapper);
        }
        
        // Set container height to accommodate all items
        const totalHeight = this.totalItems * this.itemHeight;
        this.wrapper.style.height = totalHeight + 'px';
        
        this.updateVisibleRange();
        this.renderVisibleItems();
        
        console.log(`📊 Virtual scrolling initialized with ${this.totalItems} items`);
    }
    
    updateVisibleRange() {
        // Use modular processor for range calculation if available
        if (performanceSystem && performanceSystem.container && 
            performanceSystem.container.dependencies.processors) {
            const processors = performanceSystem.container.dependencies.processors;
            const rangeResult = processors.calculateVisibleRange(
                this.scrollTop,
                this.containerHeight,
                this.itemHeight,
                this.totalItems,
                this.bufferSize
            );
            
            if (rangeResult.calculated) {
                this.visibleStart = rangeResult.range.start;
                this.visibleEnd = rangeResult.range.end;
                return;
            }
        }
        
        // Fallback calculation
        const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        this.visibleStart = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
        this.visibleEnd = Math.min(this.totalItems, this.visibleStart + visibleCount + (this.bufferSize * 2));
    }
    
    renderVisibleItems() {
        if (!this.renderFunction || !this.data) return;
        
        // Remove elements that are no longer visible
        for (const [index, element] of this.renderedElements.entries()) {
            if (index < this.visibleStart || index >= this.visibleEnd) {
                element.remove();
                this.renderedElements.delete(index);
            }
        }
        
        // Render visible items
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            if (!this.renderedElements.has(i)) {
                const item = this.data[i];
                const element = this.renderFunction(item, i);
                element.style.position = 'absolute';
                element.style.top = (i * this.itemHeight) + 'px';
                element.style.height = this.itemHeight + 'px';
                element.style.width = '100%';
                element.style.boxSizing = 'border-box';
                
                this.wrapper.appendChild(element);
                this.renderedElements.set(i, element);
            }
        }
    }
    
    destroy() {
        // Destroy modular instance if available
        if (this.modularInstance && this.modularInstance.destroy) {
            this.modularInstance.destroy();
        }
        
        this.renderedElements.clear();
        if (this.wrapper) {
            this.wrapper.remove();
        }
    }
}

// Fallback system initialization for when modular system fails
function initializeFallbackSystem() {
    console.log('🔄 Initializing fallback performance system...');
    
    // Create basic performance system with minimal dependencies
    performanceSystem = {
        system: null,
        container: {
            dependencies: {
                validators: null,
                processors: null,
                uiBuilders: null,
                core: null
            },
            environment: {
                browser: typeof window !== 'undefined',
                node: false,
                development: false
            }
        },
        initialized: true,
        fallback: true
    };
}

// Initialize backward-compatible instances
const performanceOptimizer = new PerformanceOptimizer();
const lazyLoader = new LazyLoader();

// Enhanced performance monitoring dashboard with modular system integration
function showPerformanceStats() {
    let stats, performanceInfo;
    
    try {
        // Use modular system statistics if available
        if (performanceSystem && performanceSystem.system && !performanceSystem.fallback) {
            const systemStats = performanceSystem.system.getPerformanceStatistics();
            stats = performanceOptimizer.getCacheStats();
            
            performanceInfo = `
                📊 Performance Statistics (Modular System):
                
                🗂️ Cache: ${stats.size} entries
                📡 Active Requests: ${stats.totalRequests}
                💾 Memory Usage: ${stats.memoryUsage?.used || 'N/A'}
                📈 Memory Limit: ${stats.memoryUsage?.limit || 'N/A'}
                ⏱️ System Uptime: ${Math.round(systemStats.uptime / 1000)}s
                📈 Cache Hit Rate: ${systemStats.cacheHits + systemStats.cacheMisses > 0 ? 
                    Math.round((systemStats.cacheHits / (systemStats.cacheHits + systemStats.cacheMisses)) * 100) : 0}%
                
                Navigation Timing:
                🏁 Page Load: ${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms
                🎯 DOM Ready: ${Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart)}ms
                📄 First Paint: ${performance.getEntriesByType ? 
                    Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) : 'N/A'}ms
            `;
        } else {
            // Fallback to basic statistics
            stats = performanceOptimizer.getCacheStats();
            performanceInfo = `
                📊 Performance Statistics (Fallback Mode):
                
                🗂️ Cache: ${stats.size} entries
                📡 Active Requests: ${stats.totalRequests}
                💾 Memory Usage: ${stats.memoryUsage?.used || 'N/A'}
                📈 Memory Limit: ${stats.memoryUsage?.limit || 'N/A'}
                
                Navigation Timing:
                🏁 Page Load: ${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms
                🎯 DOM Ready: ${Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart)}ms
                📄 First Paint: ${performance.getEntriesByType ? 
                    Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) : 'N/A'}ms
            `;
        }
    } catch (error) {
        performanceInfo = `
            📊 Performance Statistics (Error Mode):
            
            ❌ Error retrieving statistics: ${error.message}
            🔄 System Status: ${performanceSystem?.fallback ? 'Fallback' : 'Unknown'}
        `;
    }
    
    console.log(performanceInfo);
    alert(performanceInfo);
}

// Enhanced memory usage monitor with modular system integration
function startMemoryMonitor() {
    if (!performance.memory) {
        console.log('⚠️ Memory monitoring not available in this environment');
        return null;
    }
    
    const monitor = setInterval(() => {
        try {
            // Use modular system memory checking if available
            if (performanceSystem && performanceSystem.system && !performanceSystem.fallback) {
                const memoryStatus = performanceSystem.system.checkMemoryUsage();
                if (memoryStatus.available && memoryStatus.status === 'critical') {
                    console.warn(`🔥 Critical memory usage: ${memoryStatus.percentage}%`);
                }
            } else {
                // Fallback memory monitoring
                const usage = performance.memory.usedJSHeapSize / 1024 / 1024;
                const limit = performance.memory.jsHeapSizeLimit / 1024 / 1024;
                const percentage = (usage / limit) * 100;
                
                if (percentage > 80) {
                    console.warn(`🔥 High memory usage: ${usage.toFixed(1)}MB (${percentage.toFixed(1)}%)`);
                    performanceOptimizer.performMemoryCleanup();
                }
            }
        } catch (error) {
            console.warn('⚠️ Memory monitoring error:', error.message);
        }
    }, 10000); // Check every 10 seconds
    
    return monitor;
}

// Start enhanced performance monitoring
const memoryMonitor = startMemoryMonitor();

// Enhanced cache clearing with modular system integration
function clearCache() {
    try {
        // Clear performance optimizer cache
        performanceOptimizer.clearCache();
        
        // Clear modular system cache if available
        if (performanceSystem && performanceSystem.system && !performanceSystem.fallback) {
            performanceSystem.system.cache.clear();
            performanceSystem.system.cacheExpiry.clear();
        }
        
        // Clear service worker cache if available
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
                if (event.data.success) {
                    if (typeof showResult === 'function') {
                        showResult('🗑️ All caches cleared successfully!', 'success');
                    } else {
                        console.log('🗑️ All caches cleared successfully!');
                    }
                }
            };
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_CACHE' }, 
                [messageChannel.port2]
            );
        } else {
            if (typeof showResult === 'function') {
                showResult('🗑️ Application cache cleared!', 'success');
            } else {
                console.log('🗑️ Application cache cleared!');
            }
        }
    } catch (error) {
        console.error('❌ Cache clearing error:', error);
    }
}

// Export performance system information for debugging
function getPerformanceSystemInfo() {
    return {
        modular: performanceSystem && !performanceSystem.fallback,
        fallback: performanceSystem?.fallback || false,
        initialized: performanceSystem?.initialized || false,
        environment: performanceSystem?.container?.environment || {},
        availableModules: performanceSystem?.container?.loadedModules || [],
        version: '2.0.0-modular'
    };
}

// Make system info available globally for debugging
window.performanceSystemInfo = getPerformanceSystemInfo;

console.log('✅ Performance system (modular architecture) loaded successfully');
console.log('🔍 System info:', getPerformanceSystemInfo());