/**
 * RealTimeUtilities - Utility functions and dependency injection for real-time monitoring
 * 
 * This class contains utility functions that support the real-time monitoring implementation:
 * - Dependency injection factory for browser environment
 * - Helper functions for DOM manipulation
 * - State management utilities
 * - Configuration and setup functions
 * 
 * Functions in this class include both PURE and IMPURE functions:
 * - Pure functions: deterministic utilities with no side effects
 * - Impure functions: dependency factories that access global state
 * 
 * Note: This is the final utility class in the modular real-time architecture
 */
class RealTimeUtilities {
    
    /**
     * Default dependency factory for real-time monitoring in browser environment
     * 
     * NOTE: This function is NOT pure (depends on global state and environment)
     * but serves as a "dependency injection container" that:
     * - Isolates all global variable access to one place
     * - Provides environment-specific defaults for browser context
     * - Enables pure core functions to remain testable through dependency injection
     * - Can be completely replaced with mocks during testing
     * 
     * @returns {Object} Default dependencies for browser environment
     */
    static createDefaultDependencies() {
        return {
            // DOM ACCESS: Reading and manipulating document elements (browser-specific)
            getElementById: (id) => document.getElementById(id),
            createElement: (tagName) => document.createElement(tagName),
            appendChild: (parent, child) => parent.appendChild(child),
            removeElement: (element) => element.remove(),
            document: document,
            
            // TIMING: Browser timing functions
            setInterval: (callback, interval) => setInterval(callback, interval),
            clearInterval: (intervalId) => clearInterval(intervalId),
            
            // GLOBAL STATE: Real-time monitoring state
            monitoringState: {
                interval: null,
                currentPlayback: null,
                config: null
            },
            
            // API FUNCTIONS: Access to Spotify API functions (may be undefined)
            getValidAccessToken: window.getValidAccessToken || (() => null),
            getCurrentPlayback: window.getCurrentPlayback || (async () => null),
            
            // UI FUNCTIONS: User feedback and display
            showResult: window.showResult || ((message, type) => console.log(`${type}: ${message}`)),
            
            // LOGGING: Console interface for debugging and errors
            logInfo: (message, ...args) => console.log(message, ...args),
            logWarning: (message, ...args) => console.warn(message, ...args),
            logError: (message, ...args) => console.error(message, ...args),
            
            // TIME PROVIDER: Current timestamp for change detection
            getCurrentTime: () => Date.now(),
            
            // CONFIGURATION: Default settings
            defaultConfig: {
                updateInterval: 5000,
                containerId: 'realTimePlayback',
                styleId: 'realTimeStyles'
            }
        };
    }

    /**
     * PURE: Creates monitoring state object
     * @returns {Object} Initial monitoring state
     */
    static createInitialState() {
        return {
            interval: null,
            currentPlayback: null,
            config: null,
            isActive: false,
            lastUpdate: null
        };
    }

    /**
     * PURE: Generates unique element ID for real-time components
     * @param {string} prefix - Prefix for the ID
     * @param {number} timestamp - Optional timestamp for uniqueness
     * @returns {string} Unique element ID
     */
    static generateUniqueElementId(prefix = 'realTime', timestamp = Date.now()) {
        return `${prefix}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * PURE: Creates configuration object with defaults
     * @param {Object} customConfig - Custom configuration overrides
     * @returns {Object} Complete configuration object
     */
    static createConfiguration(customConfig = {}) {
        const defaultConfig = {
            updateInterval: 5000,
            containerId: 'realTimePlayback',
            styleId: 'realTimeStyles',
            position: { top: '20px', right: '20px' },
            enableAnimations: true,
            autoStart: false,
            showTimeRemaining: false,
            compactMode: false
        };
        
        return { ...defaultConfig, ...customConfig };
    }

    /**
     * PURE: Validates real-time monitoring configuration
     * @param {Object} config - Configuration object to validate
     * @returns {Object} Validation result
     */
    static validateConfiguration(config) {
        if (!config || typeof config !== 'object') {
            return { 
                isValid: false, 
                error: 'Configuration must be a valid object' 
            };
        }
        
        if (config.updateInterval && typeof config.updateInterval !== 'number') {
            return { 
                isValid: false, 
                error: 'updateInterval must be a number' 
            };
        }
        
        if (config.updateInterval && config.updateInterval < 1000) {
            return { 
                isValid: false, 
                error: 'updateInterval must be at least 1000ms' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * IMPURE: Factory function for creating DOM manipulation utilities
     * @returns {Object} DOM utility functions
     */
    static createDOMUtilities() {
        return {
            safeGetElement: (id) => {
                try {
                    return document.getElementById(id);
                } catch (error) {
                    console.warn(`Failed to get element with ID: ${id}`, error);
                    return null;
                }
            },
            
            safeCreateElement: (tagName, attributes = {}) => {
                try {
                    const element = document.createElement(tagName);
                    Object.keys(attributes).forEach(key => {
                        if (key === 'style') {
                            element.style.cssText = attributes[key];
                        } else {
                            element[key] = attributes[key];
                        }
                    });
                    return element;
                } catch (error) {
                    console.warn(`Failed to create element: ${tagName}`, error);
                    return null;
                }
            },
            
            safeAppendChild: (parent, child) => {
                try {
                    if (parent && child && parent.appendChild) {
                        return parent.appendChild(child);
                    }
                    return null;
                } catch (error) {
                    console.warn('Failed to append child element', error);
                    return null;
                }
            },
            
            safeRemoveElement: (element) => {
                try {
                    if (element && element.remove) {
                        element.remove();
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.warn('Failed to remove element', error);
                    return false;
                }
            }
        };
    }

    /**
     * PURE: Creates error handling utilities
     * @returns {Object} Error handling functions
     */
    static createErrorHandlers() {
        return {
            handleApiError: (error, context) => {
                return {
                    type: 'api_error',
                    message: error.message || 'Unknown API error',
                    context: context,
                    timestamp: Date.now(),
                    recoverable: error.status !== 401 && error.status !== 403
                };
            },
            
            handleDOMError: (error, element) => {
                return {
                    type: 'dom_error',
                    message: error.message || 'DOM manipulation error',
                    element: element?.tagName || 'unknown',
                    timestamp: Date.now(),
                    recoverable: true
                };
            },
            
            handleValidationError: (validationResult) => {
                return {
                    type: 'validation_error',
                    message: validationResult.error || 'Validation failed',
                    timestamp: Date.now(),
                    recoverable: true
                };
            }
        };
    }

    /**
     * PURE: Creates performance monitoring utilities
     * @returns {Object} Performance monitoring functions
     */
    static createPerformanceMonitors() {
        return {
            startTimer: (label) => {
                const startTime = performance.now();
                return {
                    label: label,
                    startTime: startTime,
                    end: () => {
                        const endTime = performance.now();
                        return {
                            label: label,
                            duration: endTime - startTime,
                            startTime: startTime,
                            endTime: endTime
                        };
                    }
                };
            },
            
            measureMemory: () => {
                if (performance.memory) {
                    return {
                        used: performance.memory.usedJSHeapSize,
                        total: performance.memory.totalJSHeapSize,
                        limit: performance.memory.jsHeapSizeLimit,
                        timestamp: Date.now()
                    };
                }
                return { unavailable: true, timestamp: Date.now() };
            },
            
            trackUpdateFrequency: (updates = []) => {
                const now = Date.now();
                const recentUpdates = updates.filter(time => now - time < 60000); // Last minute
                return {
                    count: recentUpdates.length,
                    averageInterval: recentUpdates.length > 1 
                        ? (recentUpdates[recentUpdates.length - 1] - recentUpdates[0]) / (recentUpdates.length - 1)
                        : 0,
                    timestamp: now
                };
            }
        };
    }

    /**
     * IMPURE: Creates debugging utilities that access global state
     * @returns {Object} Debugging utility functions
     */
    static createDebuggingUtilities() {
        return {
            logStateSnapshot: (state) => {
                console.group('Real-Time Monitoring State Snapshot');
                console.log('Timestamp:', new Date().toISOString());
                console.log('Interval Active:', !!state.interval);
                console.log('Current Playback:', state.currentPlayback);
                console.log('Configuration:', state.config);
                console.groupEnd();
            },
            
            enableDebugMode: () => {
                window.realTimeDebug = true;
                console.log('Real-time monitoring debug mode enabled');
            },
            
            disableDebugMode: () => {
                window.realTimeDebug = false;
                console.log('Real-time monitoring debug mode disabled');
            },
            
            isDebugMode: () => {
                return !!window.realTimeDebug;
            }
        };
    }

    /**
     * PURE: Calculates optimal update interval based on usage patterns
     * @param {Array} updateHistory - Array of recent update timestamps
     * @param {number} defaultInterval - Default interval fallback
     * @returns {number} Recommended update interval in milliseconds
     */
    static calculateOptimalInterval(updateHistory = [], defaultInterval = 5000) {
        if (updateHistory.length < 2) {
            return defaultInterval;
        }
        
        // Calculate intervals between updates
        const intervals = [];
        for (let i = 1; i < updateHistory.length; i++) {
            intervals.push(updateHistory[i] - updateHistory[i - 1]);
        }
        
        // Calculate average interval
        const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        
        // Clamp between reasonable bounds
        const minInterval = 2000; // 2 seconds minimum
        const maxInterval = 30000; // 30 seconds maximum
        
        return Math.max(minInterval, Math.min(maxInterval, averageInterval));
    }

    /**
     * PURE: Creates cleanup checklist for real-time monitoring
     * @returns {Array} Array of cleanup tasks
     */
    static getCleanupChecklist() {
        return [
            { task: 'Clear monitoring interval', critical: true },
            { task: 'Remove display element from DOM', critical: false },
            { task: 'Remove style element from DOM', critical: false },
            { task: 'Reset monitoring state', critical: true },
            { task: 'Clear event listeners', critical: false },
            { task: 'Release memory references', critical: true }
        ];
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeUtilities;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.RealTimeUtilities = RealTimeUtilities;
}