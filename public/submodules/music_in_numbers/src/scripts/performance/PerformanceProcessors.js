/**
 * PerformanceProcessors.js
 * 
 * Part 2 of 5 in the Performance API Class Extraction
 * 
 * PURPOSE:
 * Pure data processing functions for performance metrics, memory calculations,
 * cache statistics, timing analysis, and virtual scrolling computations.
 * 
 * ARCHITECTURE:
 * - Static methods only (no state)
 * - Pure functions with no side effects
 * - Immutable data processing
 * - Zero dependencies on external state
 * 
 * PATTERNS FOLLOWED:
 * - "Functional Core" - All functions are pure
 * - Data transformation without mutation
 * - Comprehensive error handling and logging
 * - Consistent data structure returns
 * 
 * EXTRACTION CONSISTENCY:
 * This follows the exact same patterns as:
 * - AnalyticsProcessors.js (pure analytics calculations)
 * - ArtistUIProcessors.js (HTML escaping and formatting)
 * - InitializationProcessors.js (URL parsing and token handling)
 * - SpotifyApiRequestBuilders.js (URL construction and formatting)
 * - RealTimeProcessors.js (time formatting and progress calculations)
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
        global.PerformanceProcessors = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this, function() {
    
    'use strict';

    /**
     * PerformanceProcessors
     * 
     * Static class providing pure data processing functions for performance
     * optimization, memory calculations, cache statistics, and virtual scrolling.
     */
    class PerformanceProcessors {
        
        /**
         * Calculate memory usage statistics
         * @param {Object} memoryInfo - Browser memory information object
         * @returns {Object} Processed memory statistics
         */
        static processMemoryStatistics(memoryInfo) {
            try {
                if (!memoryInfo || typeof memoryInfo !== 'object') {
                    return {
                        processed: false,
                        error: 'Invalid memory information object',
                        fallbackData: {
                            used: 'N/A',
                            total: 'N/A',
                            limit: 'N/A',
                            percentage: 0,
                            status: 'unknown'
                        }
                    };
                }

                const usedBytes = memoryInfo.usedJSHeapSize || 0;
                const totalBytes = memoryInfo.totalJSHeapSize || 0;
                const limitBytes = memoryInfo.jsHeapSizeLimit || 0;

                const usedMB = Math.round(usedBytes / 1024 / 1024 * 100) / 100;
                const totalMB = Math.round(totalBytes / 1024 / 1024 * 100) / 100;
                const limitMB = Math.round(limitBytes / 1024 / 1024 * 100) / 100;

                const percentage = limitBytes > 0 ? (usedBytes / limitBytes) * 100 : 0;

                let status = 'good';
                if (percentage > 80) status = 'critical';
                else if (percentage > 60) status = 'warning';
                else if (percentage > 40) status = 'moderate';

                return {
                    processed: true,
                    statistics: {
                        used: `${usedMB}MB`,
                        total: `${totalMB}MB`,
                        limit: `${limitMB}MB`,
                        percentage: Math.round(percentage * 100) / 100,
                        status,
                        bytes: {
                            used: usedBytes,
                            total: totalBytes,
                            limit: limitBytes
                        }
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Memory statistics processing failed: ${error.message}`,
                    fallbackData: {
                        used: 'Error',
                        total: 'Error',
                        limit: 'Error',
                        percentage: 0,
                        status: 'error'
                    }
                };
            }
        }

        /**
         * Process cache statistics
         * @param {Map} cache - The cache Map object
         * @param {Map} cacheExpiry - The cache expiry Map object
         * @param {Array} requestQueue - The request queue array
         * @returns {Object} Processed cache statistics
         */
        static processCacheStatistics(cache, cacheExpiry, requestQueue = []) {
            try {
                const cacheSize = cache ? cache.size : 0;
                const expirySize = cacheExpiry ? cacheExpiry.size : 0;
                const queueLength = Array.isArray(requestQueue) ? requestQueue.length : 0;

                const now = Date.now();
                let expiredCount = 0;
                let totalDataSize = 0;

                if (cache && cacheExpiry) {
                    for (const [key, expiry] of cacheExpiry.entries()) {
                        if (now >= expiry) {
                            expiredCount++;
                        }
                        
                        const data = cache.get(key);
                        if (data) {
                            totalDataSize += this.estimateObjectSize(data);
                        }
                    }
                }

                const activeEntries = cacheSize - expiredCount;
                const averageSize = cacheSize > 0 ? Math.round(totalDataSize / cacheSize) : 0;

                return {
                    processed: true,
                    statistics: {
                        totalEntries: cacheSize,
                        activeEntries,
                        expiredEntries: expiredCount,
                        pendingRequests: queueLength,
                        totalDataSize: Math.round(totalDataSize / 1024 * 100) / 100, // KB
                        averageEntrySize: Math.round(averageSize / 1024 * 100) / 100, // KB
                        cacheEfficiency: cacheSize > 0 ? Math.round((activeEntries / cacheSize) * 100) : 0
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Cache statistics processing failed: ${error.message}`,
                    fallbackData: {
                        totalEntries: 0,
                        activeEntries: 0,
                        expiredEntries: 0,
                        pendingRequests: 0,
                        totalDataSize: 0,
                        averageEntrySize: 0,
                        cacheEfficiency: 0
                    }
                };
            }
        }

        /**
         * Process performance timing data
         * @param {PerformanceTiming} timing - Browser performance timing object
         * @returns {Object} Processed timing statistics
         */
        static processPerformanceTiming(timing) {
            try {
                if (!timing || typeof timing !== 'object') {
                    return {
                        processed: false,
                        error: 'Invalid performance timing object',
                        fallbackData: {
                            pageLoad: 'N/A',
                            domReady: 'N/A',
                            firstPaint: 'N/A'
                        }
                    };
                }

                const navigationStart = timing.navigationStart || 0;
                const loadEventEnd = timing.loadEventEnd || 0;
                const domContentLoadedEventEnd = timing.domContentLoadedEventEnd || 0;

                const pageLoadTime = loadEventEnd > 0 ? 
                    Math.round(loadEventEnd - navigationStart) : 0;
                const domReadyTime = domContentLoadedEventEnd > 0 ? 
                    Math.round(domContentLoadedEventEnd - navigationStart) : 0;

                // Get first paint from performance entries if available
                let firstPaintTime = 'N/A';
                if (typeof performance !== 'undefined' && performance.getEntriesByType) {
                    const paintEntries = performance.getEntriesByType('paint');
                    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
                    if (firstPaint) {
                        firstPaintTime = Math.round(firstPaint.startTime);
                    }
                }

                return {
                    processed: true,
                    timing: {
                        pageLoad: pageLoadTime > 0 ? `${pageLoadTime}ms` : 'N/A',
                        domReady: domReadyTime > 0 ? `${domReadyTime}ms` : 'N/A',
                        firstPaint: firstPaintTime !== 'N/A' ? `${firstPaintTime}ms` : 'N/A',
                        values: {
                            pageLoad: pageLoadTime,
                            domReady: domReadyTime,
                            firstPaint: firstPaintTime !== 'N/A' ? firstPaintTime : 0
                        }
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Performance timing processing failed: ${error.message}`,
                    fallbackData: {
                        pageLoad: 'Error',
                        domReady: 'Error',
                        firstPaint: 'Error'
                    }
                };
            }
        }

        /**
         * Calculate virtual scrolling visible range
         * @param {number} scrollTop - Current scroll position
         * @param {number} containerHeight - Height of the container
         * @param {number} itemHeight - Height of each item
         * @param {number} totalItems - Total number of items
         * @param {number} bufferSize - Buffer size for optimization
         * @returns {Object} Calculated visible range
         */
        static calculateVisibleRange(scrollTop, containerHeight, itemHeight, totalItems, bufferSize = 5) {
            try {
                if (typeof scrollTop !== 'number' || scrollTop < 0) scrollTop = 0;
                if (typeof containerHeight !== 'number' || containerHeight <= 0) containerHeight = 0;
                if (typeof itemHeight !== 'number' || itemHeight <= 0) itemHeight = 60;
                if (typeof totalItems !== 'number' || totalItems < 0) totalItems = 0;
                if (typeof bufferSize !== 'number' || bufferSize < 0) bufferSize = 5;

                const visibleCount = containerHeight > 0 ? Math.ceil(containerHeight / itemHeight) : 0;
                const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
                const endIndex = Math.min(totalItems, startIndex + visibleCount + (bufferSize * 2));

                return {
                    calculated: true,
                    range: {
                        start: startIndex,
                        end: endIndex,
                        visibleCount,
                        totalHeight: totalItems * itemHeight,
                        bufferItems: Math.min(bufferSize * 2, endIndex - startIndex)
                    }
                };
            } catch (error) {
                return {
                    calculated: false,
                    error: `Visible range calculation failed: ${error.message}`,
                    fallbackRange: {
                        start: 0,
                        end: 0,
                        visibleCount: 0,
                        totalHeight: 0,
                        bufferItems: 0
                    }
                };
            }
        }

        /**
         * Process throttling parameters
         * @param {Function} func - Function to throttle
         * @param {number} delay - Throttle delay in milliseconds
         * @returns {Object} Processed throttling configuration
         */
        static processThrottleConfiguration(func, delay) {
            try {
                if (typeof func !== 'function') {
                    return {
                        processed: false,
                        error: 'Function parameter is required for throttling'
                    };
                }

                if (typeof delay !== 'number' || delay < 0) {
                    delay = 100; // Default 100ms
                }

                // Calculate optimal settings based on delay
                let frequency = delay > 0 ? Math.round(1000 / delay) : 10;
                let priority = 'normal';
                
                if (delay <= 16) priority = 'high'; // ~60fps
                else if (delay <= 33) priority = 'medium'; // ~30fps
                else if (delay >= 100) priority = 'low'; // <=10fps

                return {
                    processed: true,
                    configuration: {
                        delay,
                        frequency: `${frequency}Hz`,
                        priority,
                        recommended: delay >= 16 && delay <= 100,
                        settings: {
                            useTimeout: delay > 50,
                            useRequestAnimationFrame: delay <= 16,
                            maxExecutionsPerSecond: frequency
                        }
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Throttle configuration processing failed: ${error.message}`
                };
            }
        }

        /**
         * Calculate object size estimation
         * @param {*} obj - Object to estimate size for
         * @returns {number} Estimated size in bytes
         */
        static estimateObjectSize(obj) {
            try {
                if (obj === null || obj === undefined) return 0;
                
                if (typeof obj === 'string') {
                    return obj.length * 2; // UTF-16 encoding
                }
                
                if (typeof obj === 'number') {
                    return 8; // 64-bit number
                }
                
                if (typeof obj === 'boolean') {
                    return 4; // 32-bit boolean
                }
                
                if (Array.isArray(obj)) {
                    return obj.reduce((total, item) => total + this.estimateObjectSize(item), 0);
                }
                
                if (typeof obj === 'object') {
                    return JSON.stringify(obj).length * 2; // Rough estimate
                }
                
                return 0;
            } catch (error) {
                // Fallback for circular references or other issues
                try {
                    return JSON.stringify(obj).length * 2;
                } catch (jsonError) {
                    return 1024; // 1KB fallback estimate
                }
            }
        }

        /**
         * Process cache expiry cleanup data
         * @param {Map} cache - The cache Map object
         * @param {Map} cacheExpiry - The cache expiry Map object
         * @returns {Object} Cleanup analysis data
         */
        static processCacheCleanupData(cache, cacheExpiry) {
            try {
                if (!cache || !cacheExpiry) {
                    return {
                        processed: false,
                        error: 'Cache maps are required'
                    };
                }

                const now = Date.now();
                const expiredKeys = [];
                const activeKeys = [];
                let totalExpiredSize = 0;
                let totalActiveSize = 0;

                for (const [key, expiry] of cacheExpiry.entries()) {
                    const data = cache.get(key);
                    const size = data ? this.estimateObjectSize(data) : 0;

                    if (now >= expiry) {
                        expiredKeys.push({
                            key,
                            expiry: new Date(expiry).toISOString(),
                            size,
                            ageMs: now - expiry
                        });
                        totalExpiredSize += size;
                    } else {
                        activeKeys.push({
                            key,
                            expiry: new Date(expiry).toISOString(),
                            size,
                            remainingMs: expiry - now
                        });
                        totalActiveSize += size;
                    }
                }

                return {
                    processed: true,
                    cleanup: {
                        expiredCount: expiredKeys.length,
                        activeCount: activeKeys.length,
                        expiredSize: Math.round(totalExpiredSize / 1024 * 100) / 100, // KB
                        activeSize: Math.round(totalActiveSize / 1024 * 100) / 100, // KB
                        spaceSavings: Math.round(totalExpiredSize / 1024 * 100) / 100, // KB
                        expiredKeys: expiredKeys.slice(0, 10), // Limit for performance
                        nextExpiryIn: activeKeys.length > 0 ? 
                            Math.min(...activeKeys.map(k => k.remainingMs)) : null
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Cache cleanup data processing failed: ${error.message}`
                };
            }
        }

        /**
         * Process intersection observer entry data
         * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
         * @returns {Object} Processed intersection data
         */
        static processIntersectionEntries(entries) {
            try {
                if (!Array.isArray(entries)) {
                    return {
                        processed: false,
                        error: 'Entries must be an array'
                    };
                }

                const visibleElements = [];
                const hiddenElements = [];

                entries.forEach(entry => {
                    const elementData = {
                        target: entry.target,
                        isIntersecting: entry.isIntersecting,
                        intersectionRatio: entry.intersectionRatio,
                        boundingClientRect: {
                            top: entry.boundingClientRect.top,
                            bottom: entry.boundingClientRect.bottom,
                            height: entry.boundingClientRect.height,
                            width: entry.boundingClientRect.width
                        }
                    };

                    if (entry.isIntersecting) {
                        visibleElements.push(elementData);
                    } else {
                        hiddenElements.push(elementData);
                    }
                });

                return {
                    processed: true,
                    intersection: {
                        totalEntries: entries.length,
                        visibleCount: visibleElements.length,
                        hiddenCount: hiddenElements.length,
                        visibleElements,
                        hiddenElements,
                        averageRatio: entries.length > 0 ? 
                            entries.reduce((sum, entry) => sum + entry.intersectionRatio, 0) / entries.length : 0
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Intersection entries processing failed: ${error.message}`
                };
            }
        }

        /**
         * Calculate request queue statistics
         * @param {Array} requestQueue - Array of pending requests
         * @returns {Object} Processed queue statistics
         */
        static processRequestQueueStatistics(requestQueue) {
            try {
                if (!Array.isArray(requestQueue)) {
                    return {
                        processed: false,
                        error: 'Request queue must be an array'
                    };
                }

                const now = Date.now();
                const queueData = requestQueue.map(req => ({
                    cacheKey: req.cacheKey,
                    isPending: req.promise && typeof req.promise.then === 'function',
                    age: req.startTime ? now - req.startTime : 0
                }));

                const pendingCount = queueData.filter(req => req.isPending).length;
                const averageAge = queueData.length > 0 ? 
                    queueData.reduce((sum, req) => sum + req.age, 0) / queueData.length : 0;

                return {
                    processed: true,
                    queue: {
                        totalRequests: requestQueue.length,
                        pendingRequests: pendingCount,
                        completedRequests: requestQueue.length - pendingCount,
                        averageAge: Math.round(averageAge),
                        oldestRequest: queueData.length > 0 ? Math.max(...queueData.map(req => req.age)) : 0,
                        requests: queueData.slice(0, 5) // Limit for performance
                    }
                };
            } catch (error) {
                return {
                    processed: false,
                    error: `Request queue processing failed: ${error.message}`
                };
            }
        }

        /**
         * Get module information for documentation and debugging
         * @returns {Object} Module information including version and capabilities
         */
        static getModuleInfo() {
            return {
                name: 'PerformanceProcessors',
                version: '1.0.0',
                extractionPhase: 'API Class Extraction',
                architecture: 'Functional Core, Imperative Shell',
                functionCount: 10,
                functionTypes: 'Pure processing functions only',
                dependencies: 'Zero dependencies',
                capabilities: [
                    'Memory statistics processing',
                    'Cache statistics processing',
                    'Performance timing processing',
                    'Virtual scrolling range calculation',
                    'Throttle configuration processing',
                    'Object size estimation',
                    'Cache cleanup data processing',
                    'Intersection observer data processing',
                    'Request queue statistics processing'
                ],
                extractedAt: new Date().toISOString(),
                extractedBy: 'API Class Extraction Methodology v1.0'
            };
        }
    }

    // Return the class for module systems
    return PerformanceProcessors;
});