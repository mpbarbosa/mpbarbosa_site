/**
 * PerformanceValidators.js
 * 
 * Part 1 of 5 in the Performance API Class Extraction
 * 
 * PURPOSE:
 * Pure validation functions for performance optimization parameters, thresholds,
 * cache validation, and memory management validation logic.
 * 
 * ARCHITECTURE:
 * - Static methods only (no state)
 * - Pure functions with no side effects
 * - Consistent return format: { isValid: boolean, error?: string }
 * - Zero dependencies on other classes
 * 
 * PATTERNS FOLLOWED:
 * - "Functional Core" - All functions are pure
 * - Input validation with comprehensive error reporting
 * - Consistent error message formatting
 * - Type safety and boundary checks
 * 
 * EXTRACTION CONSISTENCY:
 * This follows the exact same patterns as:
 * - AnalyticsValidators.js (pure validation functions)
 * - ArtistUIValidators.js (HTML content and data validation)
 * - InitializationValidators.js (URL parameters and environment validation)
 * - SpotifyApiValidators.js (API parameter validation)
 * - RealTimeValidators.js (token and interval validation)
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
        global.PerformanceValidators = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this, function() {
    
    'use strict';

    /**
     * PerformanceValidators
     * 
     * Static class providing pure validation functions for performance optimization
     * parameters, memory thresholds, cache configuration, and system capabilities.
     */
    class PerformanceValidators {
        
        /**
         * Validate cache key parameter
         * @param {string} cacheKey - The cache key to validate
         * @returns {Object} validation result with isValid and potential error
         */
        static validateCacheKey(cacheKey) {
            try {
                if (typeof cacheKey !== 'string') {
                    return {
                        isValid: false,
                        error: 'Cache key must be a string'
                    };
                }
                
                if (cacheKey.length === 0) {
                    return {
                        isValid: false,
                        error: 'Cache key cannot be empty'
                    };
                }
                
                if (cacheKey.length > 200) {
                    return {
                        isValid: false,
                        error: 'Cache key too long (maximum 200 characters)'
                    };
                }
                
                // Check for invalid characters that might cause issues
                if (/[<>:"/\\|?*\x00-\x1f]/.test(cacheKey)) {
                    return {
                        isValid: false,
                        error: 'Cache key contains invalid characters'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Cache key validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate cache timeout value
         * @param {number} timeout - The timeout value in milliseconds
         * @returns {Object} validation result with isValid and potential error
         */
        static validateCacheTimeout(timeout) {
            try {
                if (typeof timeout !== 'number') {
                    return {
                        isValid: false,
                        error: 'Cache timeout must be a number'
                    };
                }
                
                if (isNaN(timeout)) {
                    return {
                        isValid: false,
                        error: 'Cache timeout cannot be NaN'
                    };
                }
                
                if (timeout < 0) {
                    return {
                        isValid: false,
                        error: 'Cache timeout cannot be negative'
                    };
                }
                
                if (timeout > 24 * 60 * 60 * 1000) { // 24 hours
                    return {
                        isValid: false,
                        error: 'Cache timeout too long (maximum 24 hours)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Cache timeout validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate memory threshold parameter
         * @param {number} threshold - The memory threshold in bytes
         * @returns {Object} validation result with isValid and potential error
         */
        static validateMemoryThreshold(threshold) {
            try {
                if (typeof threshold !== 'number') {
                    return {
                        isValid: false,
                        error: 'Memory threshold must be a number'
                    };
                }
                
                if (isNaN(threshold)) {
                    return {
                        isValid: false,
                        error: 'Memory threshold cannot be NaN'
                    };
                }
                
                if (threshold <= 0) {
                    return {
                        isValid: false,
                        error: 'Memory threshold must be positive'
                    };
                }
                
                // Minimum reasonable threshold: 1MB
                if (threshold < 1024 * 1024) {
                    return {
                        isValid: false,
                        error: 'Memory threshold too low (minimum 1MB)'
                    };
                }
                
                // Maximum reasonable threshold: 1GB
                if (threshold > 1024 * 1024 * 1024) {
                    return {
                        isValid: false,
                        error: 'Memory threshold too high (maximum 1GB)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Memory threshold validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate buffer size for virtual scrolling
         * @param {number} bufferSize - The buffer size for virtual scrolling
         * @returns {Object} validation result with isValid and potential error
         */
        static validateBufferSize(bufferSize) {
            try {
                if (typeof bufferSize !== 'number') {
                    return {
                        isValid: false,
                        error: 'Buffer size must be a number'
                    };
                }
                
                if (isNaN(bufferSize)) {
                    return {
                        isValid: false,
                        error: 'Buffer size cannot be NaN'
                    };
                }
                
                if (!Number.isInteger(bufferSize)) {
                    return {
                        isValid: false,
                        error: 'Buffer size must be an integer'
                    };
                }
                
                if (bufferSize < 0) {
                    return {
                        isValid: false,
                        error: 'Buffer size cannot be negative'
                    };
                }
                
                if (bufferSize > 100) {
                    return {
                        isValid: false,
                        error: 'Buffer size too large (maximum 100)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Buffer size validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate item height for virtual scrolling
         * @param {number} itemHeight - The height of each item in pixels
         * @returns {Object} validation result with isValid and potential error
         */
        static validateItemHeight(itemHeight) {
            try {
                if (typeof itemHeight !== 'number') {
                    return {
                        isValid: false,
                        error: 'Item height must be a number'
                    };
                }
                
                if (isNaN(itemHeight)) {
                    return {
                        isValid: false,
                        error: 'Item height cannot be NaN'
                    };
                }
                
                if (itemHeight <= 0) {
                    return {
                        isValid: false,
                        error: 'Item height must be positive'
                    };
                }
                
                if (itemHeight < 10) {
                    return {
                        isValid: false,
                        error: 'Item height too small (minimum 10px)'
                    };
                }
                
                if (itemHeight > 1000) {
                    return {
                        isValid: false,
                        error: 'Item height too large (maximum 1000px)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Item height validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate throttle delay parameter
         * @param {number} delay - The throttle delay in milliseconds
         * @returns {Object} validation result with isValid and potential error
         */
        static validateThrottleDelay(delay) {
            try {
                if (typeof delay !== 'number') {
                    return {
                        isValid: false,
                        error: 'Throttle delay must be a number'
                    };
                }
                
                if (isNaN(delay)) {
                    return {
                        isValid: false,
                        error: 'Throttle delay cannot be NaN'
                    };
                }
                
                if (delay < 0) {
                    return {
                        isValid: false,
                        error: 'Throttle delay cannot be negative'
                    };
                }
                
                if (delay > 10000) { // 10 seconds
                    return {
                        isValid: false,
                        error: 'Throttle delay too long (maximum 10 seconds)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Throttle delay validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate DOM container element
         * @param {HTMLElement} container - The DOM container element
         * @returns {Object} validation result with isValid and potential error
         */
        static validateContainer(container) {
            try {
                if (!container) {
                    return {
                        isValid: false,
                        error: 'Container element is required'
                    };
                }
                
                if (typeof HTMLElement !== 'undefined' && !(container instanceof HTMLElement)) {
                    return {
                        isValid: false,
                        error: 'Container must be a valid DOM element'
                    };
                }
                
                if (container.nodeType !== 1) { // Element node
                    return {
                        isValid: false,
                        error: 'Container must be an element node'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Container validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate performance monitoring interval
         * @param {number} interval - The monitoring interval in milliseconds
         * @returns {Object} validation result with isValid and potential error
         */
        static validateMonitoringInterval(interval) {
            try {
                if (typeof interval !== 'number') {
                    return {
                        isValid: false,
                        error: 'Monitoring interval must be a number'
                    };
                }
                
                if (isNaN(interval)) {
                    return {
                        isValid: false,
                        error: 'Monitoring interval cannot be NaN'
                    };
                }
                
                if (interval <= 0) {
                    return {
                        isValid: false,
                        error: 'Monitoring interval must be positive'
                    };
                }
                
                if (interval < 1000) { // 1 second
                    return {
                        isValid: false,
                        error: 'Monitoring interval too frequent (minimum 1 second)'
                    };
                }
                
                if (interval > 300000) { // 5 minutes
                    return {
                        isValid: false,
                        error: 'Monitoring interval too long (maximum 5 minutes)'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Monitoring interval validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate intersection observer options
         * @param {Object} options - The intersection observer options
         * @returns {Object} validation result with isValid and potential error
         */
        static validateIntersectionObserverOptions(options) {
            try {
                if (!options || typeof options !== 'object') {
                    return {
                        isValid: false,
                        error: 'Intersection observer options must be an object'
                    };
                }
                
                if (options.rootMargin && typeof options.rootMargin !== 'string') {
                    return {
                        isValid: false,
                        error: 'Root margin must be a string'
                    };
                }
                
                if (options.threshold !== undefined) {
                    if (typeof options.threshold !== 'number' && !Array.isArray(options.threshold)) {
                        return {
                            isValid: false,
                            error: 'Threshold must be a number or array of numbers'
                        };
                    }
                    
                    const thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold];
                    for (const threshold of thresholds) {
                        if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
                            return {
                                isValid: false,
                                error: 'Threshold values must be numbers between 0 and 1'
                            };
                        }
                    }
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Intersection observer options validation failed: ${error.message}`
                };
            }
        }

        /**
         * Validate render function for virtual scrolling
         * @param {Function} renderFunction - The render function
         * @returns {Object} validation result with isValid and potential error
         */
        static validateRenderFunction(renderFunction) {
            try {
                if (!renderFunction) {
                    return {
                        isValid: false,
                        error: 'Render function is required'
                    };
                }
                
                if (typeof renderFunction !== 'function') {
                    return {
                        isValid: false,
                        error: 'Render function must be a function'
                    };
                }
                
                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    error: `Render function validation failed: ${error.message}`
                };
            }
        }

        /**
         * Get module information for documentation and debugging
         * @returns {Object} Module information including version and capabilities
         */
        static getModuleInfo() {
            return {
                name: 'PerformanceValidators',
                version: '1.0.0',
                extractionPhase: 'API Class Extraction',
                architecture: 'Functional Core, Imperative Shell',
                functionCount: 10,
                functionTypes: 'Pure validation functions only',
                dependencies: 'Zero dependencies',
                capabilities: [
                    'Cache key validation',
                    'Memory threshold validation', 
                    'Buffer size validation',
                    'Item height validation',
                    'Throttle delay validation',
                    'DOM container validation',
                    'Monitoring interval validation',
                    'Intersection observer options validation',
                    'Render function validation'
                ],
                extractedAt: new Date().toISOString(),
                extractedBy: 'API Class Extraction Methodology v1.0'
            };
        }
    }

    // Return the class for module systems
    return PerformanceValidators;
});