/**
 * ThemeManagerUtilities - Dependency injection factory and utility functions
 * 
 * This class provides dependency injection containers and utility functions
 * for theme management. It handles environment detection, dependency factory
 * creation, and infrastructure support for the theme management system.
 * 
 * Architecture: Mixed (Infrastructure Support)
 * Pattern: Factory pattern with environment-specific implementations
 * Dependencies: Browser/Node.js APIs (isolated here)
 */

class ThemeManagerUtilities {
    /**
     * Create default dependency container for production use
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Complete dependency container
     */
    static createThemeManagerDependencyContainer(customDependencies = {}) {
        const defaultDependencies = {
            // LocalStorage operations
            getStoredTheme: () => {
                try {
                    const storageKey = ThemeManagerProcessors.processStorageKey('default');
                    const stored = localStorage.getItem(storageKey);
                    return stored;
                } catch (error) {
                    console.warn('Failed to get stored theme:', error);
                    return null;
                }
            },

            storeTheme: (theme) => {
                try {
                    const validation = ThemeManagerValidators.validateTheme(theme);
                    if (!validation.isValid) {
                        return { success: false, error: validation.error };
                    }
                    
                    const storageKey = ThemeManagerProcessors.processStorageKey('default');
                    localStorage.setItem(storageKey, theme);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // DOM operations
            setDocumentTheme: (theme) => {
                try {
                    const validation = ThemeManagerValidators.validateTheme(theme);
                    if (!validation.isValid) {
                        return { success: false, error: validation.error };
                    }
                    
                    document.documentElement.setAttribute('data-theme', theme);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            getElementById: (id) => {
                try {
                    return document.getElementById(id);
                } catch (error) {
                    console.warn('getElementById failed:', error);
                    return null;
                }
            },

            queryAllElements: (selector) => {
                try {
                    return Array.from(document.querySelectorAll(selector));
                } catch (error) {
                    console.warn('queryAllElements failed:', error);
                    return [];
                }
            },

            updateElementClasses: (element, classes, action) => {
                try {
                    const elementValidation = ThemeManagerValidators.validateDOMElement(element);
                    if (!elementValidation.isValid) {
                        return { success: false, error: elementValidation.error };
                    }

                    classes.forEach(className => {
                        if (action === 'add') {
                            element.classList.add(className);
                        } else if (action === 'remove') {
                            element.classList.remove(className);
                        } else if (action === 'toggle') {
                            element.classList.toggle(className);
                        }
                    });

                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            clickElement: (element) => {
                try {
                    const elementValidation = ThemeManagerValidators.validateDOMElement(element);
                    if (!elementValidation.isValid) {
                        return { success: false, error: elementValidation.error };
                    }
                    
                    element.click();
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            focusElement: (element) => {
                try {
                    const elementValidation = ThemeManagerValidators.validateDOMElement(element);
                    if (!elementValidation.isValid) {
                        return { success: false, error: elementValidation.error };
                    }
                    
                    element.focus();
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            scrollElementIntoView: (element, options = {}) => {
                try {
                    const elementValidation = ThemeManagerValidators.validateDOMElement(element);
                    if (!elementValidation.isValid) {
                        return { success: false, error: elementValidation.error };
                    }
                    
                    element.scrollIntoView(options);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // CSS operations
            setCSSCustomProperty: (property, value) => {
                try {
                    if (!property || typeof property !== 'string') {
                        return { success: false, error: 'Property must be a string' };
                    }
                    
                    document.documentElement.style.setProperty(property, value);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // Event operations
            addDocumentEventListener: (event, handler) => {
                try {
                    if (!event || typeof event !== 'string') {
                        return { success: false, error: 'Event must be a string' };
                    }
                    if (typeof handler !== 'function') {
                        return { success: false, error: 'Handler must be a function' };
                    }
                    
                    document.addEventListener(event, handler);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            addBodyClass: (className) => {
                try {
                    if (!className || typeof className !== 'string') {
                        return { success: false, error: 'Class name must be a string' };
                    }
                    
                    document.body.classList.add(className);
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // Media queries
            setupMediaQueryListener: (query, handler) => {
                try {
                    const validation = ThemeManagerValidators.validateMediaQuery(query);
                    if (!validation.isValid) {
                        return { success: false, error: validation.error };
                    }
                    
                    if (typeof handler !== 'function') {
                        return { success: false, error: 'Handler must be a function' };
                    }

                    if (window.matchMedia) {
                        const mediaQuery = window.matchMedia(query);
                        mediaQuery.addListener((e) => handler(e.matches));
                        return { success: true, mediaQuery };
                    } else {
                        return { success: false, error: 'matchMedia not supported' };
                    }
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // System detection
            detectSystemTheme: () => {
                try {
                    if (window.matchMedia) {
                        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                        const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
                        
                        if (darkQuery.matches) return 'dark';
                        if (lightQuery.matches) return 'light';
                    }
                    return null;
                } catch (error) {
                    console.warn('System theme detection failed:', error);
                    return null;
                }
            },

            detectTouchDevice: () => {
                try {
                    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                } catch (error) {
                    console.warn('Touch device detection failed:', error);
                    return false;
                }
            },

            // Accessibility
            announceToScreenReader: (message) => {
                try {
                    const validation = ThemeManagerValidators.validateScreenReaderMessage(message);
                    if (!validation.isValid) {
                        console.warn('Invalid screen reader message:', validation.error);
                        return { success: false, error: validation.error };
                    }

                    const announcement = document.createElement('div');
                    announcement.setAttribute('aria-live', 'polite');
                    announcement.setAttribute('aria-atomic', 'true');
                    announcement.className = 'sr-only';
                    announcement.textContent = message;

                    document.body.appendChild(announcement);

                    // Remove after announcement
                    setTimeout(() => {
                        if (announcement.parentNode) {
                            document.body.removeChild(announcement);
                        }
                    }, 1000);

                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            // Logging
            logInfo: (message, ...args) => {
                console.log(`[ThemeManager]`, message, ...args);
            },

            logError: (message, ...args) => {
                console.error(`[ThemeManager]`, message, ...args);
            },

            logWarn: (message, ...args) => {
                console.warn(`[ThemeManager]`, message, ...args);
            }
        };

        // Merge with custom dependencies
        return { ...defaultDependencies, ...customDependencies };
    }

    /**
     * Create test dependency container with mocks
     * @param {Object} customMocks - Custom mock implementations
     * @returns {Object} Test dependency container
     */
    static createTestDependencyContainer(customMocks = {}) {
        const testMocks = {
            // Mock localStorage
            getStoredTheme: () => 'dark',
            storeTheme: (theme) => ({ success: true }),

            // Mock DOM operations
            setDocumentTheme: (theme) => ({ success: true }),
            getElementById: (id) => ({ id, classList: { add: () => {}, remove: () => {} } }),
            queryAllElements: (selector) => [],
            updateElementClasses: () => ({ success: true }),
            clickElement: () => ({ success: true }),
            focusElement: () => ({ success: true }),
            scrollElementIntoView: () => ({ success: true }),

            // Mock CSS operations
            setCSSCustomProperty: () => ({ success: true }),

            // Mock events
            addDocumentEventListener: () => ({ success: true }),
            addBodyClass: () => ({ success: true }),
            setupMediaQueryListener: () => ({ success: true }),

            // Mock system detection
            detectSystemTheme: () => 'dark',
            detectTouchDevice: () => false,

            // Mock accessibility
            announceToScreenReader: () => ({ success: true }),

            // Mock logging
            logInfo: () => {},
            logError: () => {},
            logWarn: () => {}
        };

        return { ...testMocks, ...customMocks };
    }

    /**
     * Create development dependency container with enhanced logging
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Development dependency container
     */
    static createDevelopmentDependencyContainer(customDependencies = {}) {
        const productionContainer = this.createThemeManagerDependencyContainer();
        
        // Enhanced logging for development
        const developmentEnhancements = {
            logInfo: (message, ...args) => {
                console.log(`[ThemeManager][${new Date().toISOString()}]`, message, ...args);
            },

            logError: (message, ...args) => {
                console.error(`[ThemeManager][${new Date().toISOString()}]`, message, ...args);
                console.trace('Stack trace:');
            },

            logWarn: (message, ...args) => {
                console.warn(`[ThemeManager][${new Date().toISOString()}]`, message, ...args);
            },

            // Performance monitoring wrapper
            performanceWrapper: (name, fn) => {
                return async (...args) => {
                    const start = performance.now();
                    try {
                        const result = await fn(...args);
                        const end = performance.now();
                        console.log(`[ThemeManager][Performance] ${name}: ${(end - start).toFixed(2)}ms`);
                        return result;
                    } catch (error) {
                        const end = performance.now();
                        console.error(`[ThemeManager][Performance] ${name} failed after ${(end - start).toFixed(2)}ms:`, error);
                        throw error;
                    }
                };
            }
        };

        return { ...productionContainer, ...developmentEnhancements, ...customDependencies };
    }

    /**
     * Create minimal dependency container for Node.js environments
     * @param {Object} customDependencies - Custom dependency overrides  
     * @returns {Object} Node.js dependency container
     */
    static createNodeDependencyContainer(customDependencies = {}) {
        const nodeDependencies = {
            // Mock browser APIs for Node.js
            getStoredTheme: () => null,
            storeTheme: () => ({ success: false, error: 'localStorage not available' }),
            setDocumentTheme: () => ({ success: false, error: 'document not available' }),
            getElementById: () => null,
            queryAllElements: () => [],
            updateElementClasses: () => ({ success: false, error: 'DOM not available' }),
            clickElement: () => ({ success: false, error: 'DOM not available' }),
            focusElement: () => ({ success: false, error: 'DOM not available' }),
            scrollElementIntoView: () => ({ success: false, error: 'DOM not available' }),
            setCSSCustomProperty: () => ({ success: false, error: 'DOM not available' }),
            addDocumentEventListener: () => ({ success: false, error: 'DOM not available' }),
            addBodyClass: () => ({ success: false, error: 'DOM not available' }),
            setupMediaQueryListener: () => ({ success: false, error: 'matchMedia not available' }),
            detectSystemTheme: () => null,
            detectTouchDevice: () => false,
            announceToScreenReader: () => ({ success: false, error: 'DOM not available' }),

            // Node.js compatible logging
            logInfo: (message, ...args) => {
                console.log(`[ThemeManager]`, message, ...args);
            },
            logError: (message, ...args) => {
                console.error(`[ThemeManager]`, message, ...args);
            },
            logWarn: (message, ...args) => {
                console.warn(`[ThemeManager]`, message, ...args);
            }
        };

        return { ...nodeDependencies, ...customDependencies };
    }

    /**
     * Detect current environment and return appropriate dependency container
     * @param {Object} customDependencies - Custom dependency overrides
     * @returns {Object} Environment-appropriate dependency container
     */
    static createEnvironmentAwareDependencyContainer(customDependencies = {}) {
        // Check for browser environment
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Check for development mode
            const isDevelopment = 
                (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
                (typeof location !== 'undefined' && location.hostname === 'localhost') ||
                (typeof window !== 'undefined' && window.location?.hostname === '127.0.0.1');

            return isDevelopment 
                ? this.createDevelopmentDependencyContainer(customDependencies)
                : this.createThemeManagerDependencyContainer(customDependencies);
        }

        // Check for test environment
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
            return this.createTestDependencyContainer(customDependencies);
        }

        // Default to Node.js environment
        return this.createNodeDependencyContainer(customDependencies);
    }

    /**
     * Get performance metrics for theme operations
     * @returns {Object} Performance metrics
     */
    static getPerformanceMetrics() {
        return {
            memory: typeof performance !== 'undefined' && performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null,
            timing: typeof performance !== 'undefined' ? {
                now: performance.now(),
                timeOrigin: performance.timeOrigin
            } : null,
            connection: typeof navigator !== 'undefined' && navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }

    /**
     * Validate environment compatibility
     * @returns {Object} Environment compatibility report
     */
    static validateEnvironmentCompatibility() {
        const features = {
            localStorage: typeof localStorage !== 'undefined',
            document: typeof document !== 'undefined',
            window: typeof window !== 'undefined',
            matchMedia: typeof window !== 'undefined' && typeof window.matchMedia === 'function',
            classList: typeof document !== 'undefined' && 
                      document.createElement('div').classList !== undefined,
            customProperties: typeof CSS !== 'undefined' && CSS.supports && 
                              CSS.supports('--custom-property', 'value'),
            touchEvents: typeof window !== 'undefined' && 'ontouchstart' in window,
            screenReader: typeof document !== 'undefined' && 
                          document.createElement('div').hasAttribute('aria-live')
        };

        const compatible = Object.values(features).filter(Boolean).length;
        const total = Object.keys(features).length;
        const compatibility = (compatible / total) * 100;

        return {
            features,
            compatibility: Math.round(compatibility),
            compatible: compatibility >= 80, // 80% feature support required
            missing: Object.entries(features)
                .filter(([, supported]) => !supported)
                .map(([feature]) => feature)
        };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManagerUtilities;
}

if (typeof window !== 'undefined') {
    window.ThemeManagerUtilities = ThemeManagerUtilities;
}