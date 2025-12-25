/**
 * ================================================================================
 * ARTIST PAGE UTILITIES - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Dependency injection factory and utility functions for the artist page modular architecture.
 * Provides containers, performance wrappers, environment support, and testing utilities.
 * 
 * UTILITIES TYPES:
 * - Dependency Injection Factory (production/test containers)
 * - Performance Monitoring (caching, timing, optimization)
 * - Environment Detection (browser/Node.js/test environments)
 * - Testing Support (mock containers, validation helpers)
 * - Error Handling (centralized error processing)
 * - Configuration Management (settings, features, toggles)
 * 
 * PATTERNS:
 * - Factory pattern for dependency creation
 * - Singleton pattern for shared resources
 * - Strategy pattern for environment-specific behavior
 * - Observer pattern for performance monitoring
 * - Builder pattern for container configuration
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistPageUtilities {
    
    // ============================================
    // DEPENDENCY INJECTION FACTORY
    // ============================================
    
    /**
     * Creates production dependency container with real implementations
     * @param {Object} overrides - Optional dependency overrides
     * @returns {Object} Complete dependency container
     */
    static createProductionContainer(overrides = {}) {
        const container = {
            // ===============================
            // EXTERNAL API DEPENDENCIES
            // ===============================
            getValidAccessToken: overrides.getValidAccessToken || (() => {
                return localStorage.getItem('spotifyAccessToken') || 
                       sessionStorage.getItem('spotifyAccessToken') || 
                       null;
            }),
            
            fetchArtistFromAPI: overrides.fetchArtistFromAPI || (async (artistId, accessToken) => {
                const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
                }
                
                return await response.json();
            }),
            
            fetchUserProfile: overrides.fetchUserProfile || (async (accessToken) => {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`User profile API error: ${response.status} ${response.statusText}`);
                }
                
                return await response.json();
            }),
            
            // ===============================
            // DOM MANIPULATION DEPENDENCIES
            // ===============================
            getElementById: overrides.getElementById || ((id) => {
                return document.getElementById(id);
            }),
            
            addEventListener: overrides.addEventListener || ((element, event, handler) => {
                element.addEventListener(event, handler);
            }),
            
            displayArtistInfo: overrides.displayArtistInfo || ((html) => {
                const container = document.getElementById('artistInfo');
                if (container) {
                    container.innerHTML = html;
                }
            }),
            
            // ===============================
            // USER INTERACTION DEPENDENCIES
            // ===============================
            showAlert: overrides.showAlert || ((message) => {
                alert(message);
            }),
            
            showResult: overrides.showResult || ((message, type = 'info') => {
                console.log(`[${type.toUpperCase()}] ${message}`);
                // Optional: Could integrate with toast notifications
            }),
            
            openInNewTab: overrides.openInNewTab || ((url) => {
                window.open(url, '_blank', 'noopener,noreferrer');
            }),
            
            // ===============================
            // LOGGING DEPENDENCIES
            // ===============================
            logInfo: overrides.logInfo || ((message, ...args) => {
                console.log(`ℹ️ [ArtistPage] ${message}`, ...args);
            }),
            
            logError: overrides.logError || ((message, ...args) => {
                console.error(`❌ [ArtistPage] ${message}`, ...args);
            }),
            
            logWarning: overrides.logWarning || ((message, ...args) => {
                console.warn(`⚠️ [ArtistPage] ${message}`, ...args);
            }),
            
            // ===============================
            // CLASS DEPENDENCIES
            // ===============================
            ArtistPageValidators: overrides.ArtistPageValidators || (
                typeof window !== 'undefined' ? window.ArtistPageValidators : 
                typeof require !== 'undefined' ? require('./ArtistPageValidators') : 
                null
            ),
            
            ArtistPageProcessors: overrides.ArtistPageProcessors || (
                typeof window !== 'undefined' ? window.ArtistPageProcessors : 
                typeof require !== 'undefined' ? require('./ArtistPageProcessors') : 
                null
            ),
            
            ArtistPageUIBuilders: overrides.ArtistPageUIBuilders || (
                typeof window !== 'undefined' ? window.ArtistPageUIBuilders : 
                typeof require !== 'undefined' ? require('./ArtistPageUIBuilders') : 
                null
            )
        };
        
        // Validate critical dependencies
        this.validateContainer(container);
        
        return container;
    }
    
    /**
     * Creates test dependency container with mock implementations
     * @param {Object} customMocks - Custom mock implementations
     * @returns {Object} Test dependency container
     */
    static createTestContainer(customMocks = {}) {
        return {
            // ===============================
            // MOCK API DEPENDENCIES
            // ===============================
            getValidAccessToken: customMocks.getValidAccessToken || (() => {
                return 'mock_access_token_12345';
            }),
            
            fetchArtistFromAPI: customMocks.fetchArtistFromAPI || (async (artistId) => {
                await this.simulateDelay(100); // Simulate network delay
                return {
                    id: artistId,
                    name: 'Mock Artist',
                    followers: { total: 1000000 },
                    genres: ['pop', 'dance'],
                    popularity: 85,
                    images: [{ url: 'https://example.com/image.jpg', height: 640, width: 640 }],
                    external_urls: { spotify: `https://open.spotify.com/artist/${artistId}` }
                };
            }),
            
            fetchUserProfile: customMocks.fetchUserProfile || (async () => {
                await this.simulateDelay(50);
                return {
                    id: 'mock_user_123',
                    display_name: 'Mock User',
                    external_urls: { spotify: 'https://open.spotify.com/user/mock_user_123' }
                };
            }),
            
            // ===============================
            // MOCK DOM DEPENDENCIES
            // ===============================
            getElementById: customMocks.getElementById || ((id) => {
                return {
                    id: id,
                    innerHTML: '',
                    addEventListener: () => {},
                    click: () => {}
                };
            }),
            
            addEventListener: customMocks.addEventListener || ((element, event, handler) => {
                // Mock event listener attachment
                element[`on${event}`] = handler;
            }),
            
            displayArtistInfo: customMocks.displayArtistInfo || ((html) => {
                console.log('[MOCK] Displaying artist info:', html.substring(0, 100) + '...');
            }),
            
            // ===============================
            // MOCK USER INTERACTION
            // ===============================
            showAlert: customMocks.showAlert || ((message) => {
                console.log('[MOCK] Alert:', message);
            }),
            
            showResult: customMocks.showResult || ((message, type) => {
                console.log(`[MOCK] Result [${type}]:`, message);
            }),
            
            openInNewTab: customMocks.openInNewTab || ((url) => {
                console.log('[MOCK] Opening URL in new tab:', url);
            }),
            
            // ===============================
            // MOCK LOGGING
            // ===============================
            logInfo: customMocks.logInfo || ((message, ...args) => {
                console.log(`[MOCK INFO] ${message}`, ...args);
            }),
            
            logError: customMocks.logError || ((message, ...args) => {
                console.log(`[MOCK ERROR] ${message}`, ...args);
            }),
            
            logWarning: customMocks.logWarning || ((message, ...args) => {
                console.log(`[MOCK WARNING] ${message}`, ...args);
            }),
            
            // ===============================
            // MOCK CLASS DEPENDENCIES
            // ===============================
            ArtistPageValidators: customMocks.ArtistPageValidators || this.createMockValidators(),
            ArtistPageProcessors: customMocks.ArtistPageProcessors || this.createMockProcessors(),
            ArtistPageUIBuilders: customMocks.ArtistPageUIBuilders || this.createMockUIBuilders()
        };
    }
    
    /**
     * Creates performance-wrapped dependency container
     * @param {Object} baseContainer - Base container to wrap
     * @param {Object} options - Performance monitoring options
     * @returns {Object} Performance-wrapped container
     */
    static createPerformanceContainer(baseContainer, options = {}) {
        const {
            enableTiming = true,
            enableCaching = true,
            cacheSize = 100,
            enableMetrics = true
        } = options;
        
        const cache = enableCaching ? new Map() : null;
        const metrics = enableMetrics ? {
            apiCalls: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalTime: 0,
            operations: {}
        } : null;
        
        const wrappedContainer = {};
        
        // Wrap each dependency with performance monitoring
        Object.keys(baseContainer).forEach(key => {
            const originalFn = baseContainer[key];
            
            if (typeof originalFn === 'function') {
                wrappedContainer[key] = this.wrapWithPerformance(
                    originalFn, key, { enableTiming, enableCaching, cache, metrics }
                );
            } else {
                wrappedContainer[key] = originalFn;
            }
        });
        
        // Add performance utilities
        wrappedContainer._performance = {
            getMetrics: () => ({ ...metrics }),
            clearCache: () => cache && cache.clear(),
            getCacheSize: () => cache ? cache.size : 0
        };
        
        return wrappedContainer;
    }
    
    // ============================================
    // ENVIRONMENT DETECTION
    // ============================================
    
    /**
     * Detects the current runtime environment
     * @returns {Object} Environment information
     */
    static detectEnvironment() {
        const env = {
            isBrowser: typeof window !== 'undefined',
            isNode: typeof process !== 'undefined' && process.versions && process.versions.node,
            isTest: typeof jest !== 'undefined' || typeof mocha !== 'undefined' || process?.env?.NODE_ENV === 'test',
            isWebWorker: typeof importScripts !== 'undefined',
            hasLocalStorage: typeof localStorage !== 'undefined',
            hasSessionStorage: typeof sessionStorage !== 'undefined',
            hasDOM: typeof document !== 'undefined'
        };
        
        env.canMakeHTTPRequests = env.isBrowser || env.isNode;
        env.canAccessDOM = env.isBrowser && env.hasDOM;
        env.canPersistData = env.hasLocalStorage || env.hasSessionStorage;
        
        return env;
    }
    
    /**
     * Creates environment-specific container
     * @param {Object} options - Environment options
     * @returns {Object} Environment-appropriate container
     */
    static createEnvironmentContainer(options = {}) {
        const env = this.detectEnvironment();
        const { forceEnvironment = null, enablePerformance = false } = options;
        
        let baseContainer;
        
        if (forceEnvironment === 'test' || env.isTest) {
            baseContainer = this.createTestContainer(options.testMocks);
        } else {
            baseContainer = this.createProductionContainer(options.overrides);
        }
        
        if (enablePerformance && !env.isTest) {
            baseContainer = this.createPerformanceContainer(baseContainer, options.performance);
        }
        
        // Add environment information to container
        baseContainer._environment = env;
        baseContainer._options = options;
        
        return baseContainer;
    }
    
    // ============================================
    // VALIDATION AND TESTING UTILITIES
    // ============================================
    
    /**
     * Validates that a dependency container has all required dependencies
     * @param {Object} container - Container to validate
     * @throws {Error} If required dependencies are missing
     */
    static validateContainer(container) {
        const requiredDependencies = [
            'getValidAccessToken', 'fetchArtistFromAPI', 'fetchUserProfile',
            'getElementById', 'addEventListener', 'displayArtistInfo',
            'showAlert', 'showResult', 'openInNewTab',
            'logInfo', 'logError', 'logWarning',
            'ArtistPageValidators', 'ArtistPageProcessors', 'ArtistPageUIBuilders'
        ];
        
        const missing = requiredDependencies.filter(dep => !container[dep]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required dependencies: ${missing.join(', ')}`);
        }
        
        // Validate class dependencies are objects/classes
        const classDeps = ['ArtistPageValidators', 'ArtistPageProcessors', 'ArtistPageUIBuilders'];
        classDeps.forEach(dep => {
            if (container[dep] && typeof container[dep] !== 'object' && typeof container[dep] !== 'function') {
                throw new Error(`${dep} must be a class or object`);
            }
        });
    }
    
    /**
     * Creates a test runner for the artist page functionality
     * @param {Object} container - Dependency container
     * @returns {Object} Test runner with utility methods
     */
    static createTestRunner(container) {
        return {
            /**
             * Tests artist data loading workflow
             */
            async testArtistDataLoading(artistId = '6qqNVTkY8uBg9cP3Jd7DAH') {
                const ArtistPageCore = this.getArtistPageCore();
                const result = await ArtistPageCore.loadArtistDataCore(container, artistId);
                return {
                    passed: result.success,
                    result,
                    description: 'Artist data loading workflow test'
                };
            },
            
            /**
             * Tests Spotify profile opening workflow
             */
            async testSpotifyProfileOpening() {
                const ArtistPageCore = this.getArtistPageCore();
                const result = await ArtistPageCore.openSpotifyProfileCore(container);
                return {
                    passed: result.success,
                    result,
                    description: 'Spotify profile opening workflow test'
                };
            },
            
            /**
             * Tests application initialization workflow
             */
            async testApplicationInitialization() {
                const ArtistPageCore = this.getArtistPageCore();
                const result = await ArtistPageCore.initializeApplicationCore(container);
                return {
                    passed: result.success,
                    result,
                    description: 'Application initialization workflow test'
                };
            },
            
            /**
             * Runs all tests
             */
            async runAllTests() {
                const tests = [
                    this.testArtistDataLoading(),
                    this.testSpotifyProfileOpening(),
                    this.testApplicationInitialization()
                ];
                
                const results = await Promise.all(tests);
                const passed = results.filter(r => r.passed).length;
                const total = results.length;
                
                return {
                    results,
                    summary: {
                        passed,
                        failed: total - passed,
                        total,
                        successRate: (passed / total) * 100
                    }
                };
            }
        };
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Wraps a function with performance monitoring
     * @param {Function} fn - Function to wrap
     * @param {string} name - Function name for metrics
     * @param {Object} options - Performance options
     * @returns {Function} Wrapped function
     */
    static wrapWithPerformance(fn, name, options) {
        const { enableTiming, enableCaching, cache, metrics } = options;
        
        return async function(...args) {
            // Generate cache key for cacheable operations
            const cacheKey = enableCaching && args.length > 0 ? 
                `${name}:${JSON.stringify(args)}` : null;
            
            // Check cache first
            if (cacheKey && cache && cache.has(cacheKey)) {
                metrics && metrics.cacheHits++;
                return cache.get(cacheKey);
            }
            
            // Execute function with timing
            const startTime = enableTiming ? performance.now() : 0;
            
            try {
                const result = await fn.apply(this, args);
                
                // Record timing
                if (enableTiming && metrics) {
                    const duration = performance.now() - startTime;
                    metrics.totalTime += duration;
                    if (!metrics.operations[name]) {
                        metrics.operations[name] = { count: 0, totalTime: 0 };
                    }
                    metrics.operations[name].count++;
                    metrics.operations[name].totalTime += duration;
                }
                
                // Update metrics
                if (metrics) {
                    if (name.includes('fetch') || name.includes('API')) {
                        metrics.apiCalls++;
                    }
                    if (cacheKey) {
                        metrics.cacheMisses++;
                    }
                }
                
                // Cache result
                if (cacheKey && cache && cache.size < 100) {
                    cache.set(cacheKey, result);
                }
                
                return result;
                
            } catch (error) {
                // Record error metrics
                if (metrics) {
                    if (!metrics.operations[name]) {
                        metrics.operations[name] = { count: 0, totalTime: 0, errors: 0 };
                    }
                    metrics.operations[name].errors = (metrics.operations[name].errors || 0) + 1;
                }
                
                throw error;
            }
        };
    }
    
    /**
     * Creates mock validators for testing
     * @returns {Object} Mock validators
     */
    static createMockValidators() {
        return {
            validateAccessToken: () => ({ isValid: true }),
            validateArtistId: () => ({ isValid: true }),
            validateUserData: () => ({ isValid: true }),
            validateDOMElement: () => ({ isValid: true }),
            validateEventHandler: () => ({ isValid: true }),
            validateProfileUrl: () => ({ isValid: true }),
            validateArtistData: () => ({ isValid: true }),
            validateLoadingState: () => ({ isValid: true }),
            validateErrorState: () => ({ isValid: true }),
            validateInitializationConfig: () => ({ isValid: true })
        };
    }
    
    /**
     * Creates mock processors for testing
     * @returns {Object} Mock processors
     */
    static createMockProcessors() {
        return {
            processArtistData: (data) => ({ ...data, processed: true }),
            formatProfileUrl: (url) => url,
            processUserProfile: (data) => ({ ...data, isValid: true }),
            generateErrorMessage: (error) => error.message || 'Mock error',
            processStateTransition: (state) => ({ state, isValid: true }),
            processUrlParameters: (url) => ({ url, isValid: true })
        };
    }
    
    /**
     * Creates mock UI builders for testing
     * @returns {Object} Mock UI builders
     */
    static createMockUIBuilders() {
        return {
            buildLoadingState: () => '<div>Loading...</div>',
            buildErrorState: () => '<div>Error occurred</div>',
            buildArtistDisplay: () => '<div>Artist Display</div>',
            buildProfileButton: () => '<button>Profile</button>',
            buildPageHeader: () => '<header>Header</header>',
            buildPageFooter: () => '<footer>Footer</footer>'
        };
    }
    
    /**
     * Gets ArtistPageCore class from environment
     * @returns {Function} ArtistPageCore class
     */
    static getArtistPageCore() {
        if (typeof window !== 'undefined' && window.ArtistPageCore) {
            return window.ArtistPageCore;
        }
        if (typeof require !== 'undefined') {
            return require('./ArtistPageCore');
        }
        throw new Error('ArtistPageCore not found in environment');
    }
    
    /**
     * Simulates network delay for testing
     * @param {number} ms - Delay in milliseconds
     * @returns {Promise} Promise that resolves after delay
     */
    static simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Creates a configuration object with defaults
     * @param {Object} userConfig - User configuration
     * @returns {Object} Complete configuration
     */
    static createConfiguration(userConfig = {}) {
        return {
            // Default artist for demos
            defaultArtistId: '6qqNVTkY8uBg9cP3Jd7DAH', // Billie Eilish
            
            // UI configuration
            showLoadingSpinner: true,
            autoLoadOnInit: true,
            enableProfileButton: true,
            
            // Error handling
            maxRetries: 3,
            retryDelay: 1000,
            showTechnicalErrors: false,
            
            // Performance
            enableCaching: true,
            cacheSize: 100,
            enableMetrics: false,
            
            // Development
            debugMode: false,
            verboseLogging: false,
            
            ...userConfig
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistPageUtilities;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistPageUtilities = ArtistPageUtilities;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistPageUtilities = ArtistPageUtilities;
}