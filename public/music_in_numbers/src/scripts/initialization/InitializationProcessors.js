/**
 * INITIALIZATION PROCESSORS - Pure Data Processing Functions
 * ==========================================================
 * 
 * Following "Functional Core" pattern - All functions are pure with no side effects.
 * Processes initialization data, tokens, URLs, and environment configurations.
 * 
 * Part of the 7th successful API Class Extraction using proven methodology.
 */

class InitializationProcessors {
    
    /**
     * Processes URL to extract base redirect URI
     * @param {string} url - Current page URL
     * @returns {Object} Processed redirect URI information
     */
    static processRedirectUri(url) {
        if (!url || typeof url !== 'string') {
            return {
                success: false,
                error: 'Invalid URL provided',
                redirectUri: null,
                baseUrl: null
            };
        }

        try {
            const baseUrl = url.split('?')[0];
            return {
                success: true,
                error: null,
                redirectUri: baseUrl,
                baseUrl,
                originalUrl: url,
                hasQueryParams: url.includes('?')
            };
        } catch (error) {
            return {
                success: false,
                error: `URL processing failed: ${error.message}`,
                redirectUri: null,
                baseUrl: null
            };
        }
    }

    /**
     * Processes authorization code from URL parameters
     * @param {string} authCode - Raw authorization code
     * @returns {Object} Processed authorization data
     */
    static processAuthCode(authCode) {
        if (!authCode) {
            return {
                success: false,
                error: 'No authorization code provided',
                processedCode: null,
                shouldCleanUrl: false
            };
        }

        const processedCode = authCode.trim();
        
        return {
            success: true,
            error: null,
            processedCode,
            originalCode: authCode,
            shouldCleanUrl: true,
            codeLength: processedCode.length
        };
    }

    /**
     * Processes mock token for development environment
     * @param {string} mockToken - Raw mock token
     * @returns {Object} Processed token data
     */
    static processMockToken(mockToken) {
        if (!mockToken) {
            return {
                success: false,
                error: 'No mock token provided',
                processedToken: null,
                tokenExpiry: null
            };
        }

        const processedToken = mockToken.trim();
        const tokenExpiry = Date.now() + (3600 * 1000); // 1 hour from now

        return {
            success: true,
            error: null,
            processedToken,
            originalToken: mockToken,
            tokenExpiry,
            expiryDate: new Date(tokenExpiry),
            shouldCleanUrl: true,
            tokenLength: processedToken.length
        };
    }

    /**
     * Processes environment configuration for development mode
     * @param {Object} environment - Environment validation result
     * @returns {Object} Processed environment configuration
     */
    static processEnvironmentConfig(environment) {
        if (!environment || !environment.isValid) {
            return {
                success: false,
                error: environment?.error || 'Invalid environment data',
                config: null
            };
        }

        const config = {
            isDevelopment: environment.isDevelopment,
            showBorder: environment.isDevelopment,
            borderColor: '#e91e63',
            borderWidth: '5px',
            borderStyle: 'solid',
            logLevel: environment.isDevelopment ? 'debug' : 'info',
            mockOptionsEnabled: environment.isDevelopment,
            environmentType: environment.isDevelopment ? 'development' : 'production'
        };

        return {
            success: true,
            error: null,
            config,
            environment: environment,
            features: {
                mockToken: config.isDevelopment,
                debugLogging: config.isDevelopment,
                developmentBorder: config.isDevelopment
            }
        };
    }

    /**
     * Processes service worker configuration
     * @param {Object} swValidation - Service worker validation result
     * @param {string} swPath - Service worker script path
     * @param {string} scope - Service worker scope
     * @returns {Object} Processed service worker configuration
     */
    static processServiceWorkerConfig(swValidation, swPath = '/sw.js', scope = '/') {
        if (!swValidation || !swValidation.isSupported) {
            return {
                success: false,
                error: 'Service worker not supported',
                config: null,
                shouldRegister: false
            };
        }

        const config = {
            scriptPath: swPath,
            scope: scope,
            options: {
                scope: scope
            },
            updateCheckInterval: 24 * 60 * 60 * 1000, // 24 hours
            enableUpdateNotifications: true
        };

        return {
            success: true,
            error: null,
            config,
            shouldRegister: true,
            features: {
                offline: true,
                backgroundSync: true,
                pushNotifications: false, // Can be enabled later
                updateNotifications: config.enableUpdateNotifications
            }
        };
    }

    /**
     * Processes localStorage token storage configuration
     * @param {string} token - Access token
     * @param {number} expiry - Token expiry timestamp
     * @returns {Object} Processed storage configuration
     */
    static processTokenStorage(token, expiry) {
        if (!token || typeof token !== 'string') {
            return {
                success: false,
                error: 'Invalid token provided',
                storageConfig: null
            };
        }

        const storageConfig = {
            tokenKey: 'spotify_access_token',
            expiryKey: 'spotify_token_expiry',
            token: token.trim(),
            expiry: expiry || (Date.now() + (3600 * 1000)),
            metadata: {
                storedAt: Date.now(),
                tokenLength: token.trim().length,
                isTemporary: !expiry
            }
        };

        return {
            success: true,
            error: null,
            storageConfig,
            keys: [storageConfig.tokenKey, storageConfig.expiryKey],
            expiryDate: new Date(storageConfig.expiry)
        };
    }

    /**
     * Processes global variable initialization configuration
     * @param {Object} options - Initialization options
     * @returns {Object} Processed global variables configuration
     */
    static processGlobalVariables(options = {}) {
        const defaultConfig = {
            realTimeInterval: null,
            currentPlaybackState: null,
            memoryMonitor: null,
            initializationComplete: false,
            appVersion: '1.0.0',
            debugMode: false
        };

        const config = {
            ...defaultConfig,
            ...options,
            variables: {
                realTimeInterval: options.realTimeInterval || null,
                currentPlaybackState: options.currentPlaybackState || null,
                memoryMonitor: options.memoryMonitor || null
            },
            metadata: {
                initializedAt: Date.now(),
                initializationId: 'init_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            }
        };

        return {
            success: true,
            error: null,
            config,
            variableNames: Object.keys(config.variables),
            initializationId: config.metadata.initializationId
        };
    }

    /**
     * Processes URL cleanup configuration
     * @param {boolean} shouldClean - Whether URL should be cleaned
     * @param {string} cleanPath - Path to clean to
     * @returns {Object} URL cleanup configuration
     */
    static processUrlCleanup(shouldClean, cleanPath) {
        if (!shouldClean) {
            return {
                success: true,
                error: null,
                shouldClean: false,
                config: null
            };
        }

        const config = {
            targetPath: cleanPath || window.location.pathname,
            method: 'replaceState',
            state: {},
            title: document.title,
            preserveHash: false
        };

        return {
            success: true,
            error: null,
            shouldClean: true,
            config,
            cleanupType: 'remove_query_params'
        };
    }

    /**
     * Processes service worker event listeners configuration
     * @param {Object} registration - Service worker registration object
     * @returns {Object} Event listeners configuration
     */
    static processServiceWorkerEvents(registration) {
        if (!registration) {
            return {
                success: false,
                error: 'No service worker registration provided',
                config: null
            };
        }

        const config = {
            events: {
                updatefound: {
                    enabled: true,
                    handler: 'handleUpdateFound'
                },
                statechange: {
                    enabled: true,
                    handler: 'handleStateChange'
                },
                message: {
                    enabled: true,
                    handler: 'handleMessage'
                }
            },
            logging: {
                success: '✅ Service Worker registered successfully',
                update: '🔄 New Service Worker available, reload to update',
                cacheUpdate: '📦 Cache updated for',
                error: '❌ Service Worker registration failed'
            }
        };

        return {
            success: true,
            error: null,
            config,
            registration,
            eventCount: Object.keys(config.events).length
        };
    }

    /**
     * Processes application initialization summary
     * @param {Object} components - Initialized components
     * @returns {Object} Initialization summary
     */
    static processInitializationSummary(components = {}) {
        const summary = {
            timestamp: Date.now(),
            components: {
                urlParameters: components.urlParameters || false,
                environment: components.environment || false,
                serviceWorker: components.serviceWorker || false,
                localStorage: components.localStorage || false,
                globalVariables: components.globalVariables || false
            },
            metadata: {
                initializationTime: Date.now(),
                version: '1.0.0',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
            }
        };

        const completedComponents = Object.values(summary.components).filter(Boolean).length;
        const totalComponents = Object.keys(summary.components).length;
        const completionPercentage = Math.round((completedComponents / totalComponents) * 100);

        return {
            success: true,
            error: null,
            summary,
            completedComponents,
            totalComponents,
            completionPercentage,
            isFullyInitialized: completionPercentage === 100,
            initializationId: 'summary_' + Date.now()
        };
    }
}

// ===== MODULE EXPORTS =====

// Node.js/CommonJS support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InitializationProcessors;
}

// Browser/AMD support
if (typeof window !== 'undefined') {
    window.InitializationProcessors = InitializationProcessors;
}

// ES6 Module support
if (typeof globalThis !== 'undefined') {
    globalThis.InitializationProcessors = InitializationProcessors;
}