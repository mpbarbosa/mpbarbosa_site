/**
 * INITIALIZATION CORE - Business Logic Orchestration with Dependency Injection
 * ===========================================================================
 * 
 * Following "Imperative Shell" pattern - Orchestrates side effects and business logic.
 * Handles service worker registration, DOM manipulation, and application bootstrap.
 * 
 * Part of the 7th successful API Class Extraction using proven methodology.
 */

class InitializationCore {
    
    /**
     * Orchestrates complete application initialization workflow
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Initialization result
     */
    static async initializeApplicationCore(dependencies) {
        const { 
            getElementById, localStorage, showResult, getUserProfile, 
            startMemoryMonitor, logInfo, logError 
        } = dependencies;

        try {
            logInfo('🚀 Starting Music in Numbers application initialization');

            // Step 1: Process URL parameters
            const urlResult = await this.processUrlParametersCore(dependencies);
            
            // Step 2: Setup environment
            const envResult = await this.setupEnvironmentModeCore(dependencies);
            
            // Step 3: Register service worker
            const swResult = await this.registerServiceWorkerCore(dependencies);
            
            // Step 4: Initialize global variables
            const globalResult = await this.initializeGlobalVariablesCore(dependencies);

            // Compile results
            const results = {
                urlParameters: urlResult.success,
                environment: envResult.success,
                serviceWorker: swResult.success,
                globalVariables: globalResult.success
            };

            const completedComponents = Object.values(results).filter(Boolean).length;
            const totalComponents = Object.keys(results).length;
            const isFullyInitialized = completedComponents === totalComponents;

            logInfo(`✅ Initialization complete: ${completedComponents}/${totalComponents} components ready`);

            return {
                success: isFullyInitialized,
                error: isFullyInitialized ? null : 'Some components failed to initialize',
                results,
                completedComponents,
                totalComponents,
                isFullyInitialized,
                timestamp: Date.now()
            };

        } catch (error) {
            logError('❌ Application initialization failed:', error);
            return {
                success: false,
                error: error.message,
                results: null,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Processes URL parameters and handles authentication flow
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} URL processing result
     */
    static async processUrlParametersCore(dependencies) {
        const { 
            getElementById, localStorage, showResult, getUserProfile, 
            cleanUrl, logInfo 
        } = dependencies;

        try {
            // Validate URL parameters using pure functions
            const urlParams = new URLSearchParams(window.location.search);
            const paramValidation = InitializationValidators.validateUrlParameters(urlParams);
            
            if (!paramValidation.isValid) {
                return { 
                    success: false, 
                    error: paramValidation.error,
                    hasAuthCode: false,
                    hasMockToken: false
                };
            }

            let hasAuthCode = false;
            let hasMockToken = false;

            // Process authorization code
            if (paramValidation.authCode) {
                const authResult = await this.processAuthCodeCore(
                    dependencies, 
                    paramValidation.authCode
                );
                hasAuthCode = authResult.success;
            }

            // Process mock token for development
            if (paramValidation.mockToken) {
                const tokenResult = await this.processMockTokenCore(
                    dependencies, 
                    paramValidation.mockToken
                );
                hasMockToken = tokenResult.success;
            }

            // Set redirect URI
            const redirectUriElement = getElementById('redirectUri');
            if (redirectUriElement) {
                const uriResult = InitializationProcessors.processRedirectUri(window.location.href);
                if (uriResult.success) {
                    redirectUriElement.textContent = uriResult.redirectUri;
                }
            }

            logInfo('📊 URL parameters processed successfully');

            return {
                success: true,
                error: null,
                hasAuthCode,
                hasMockToken,
                redirectUriSet: Boolean(redirectUriElement)
            };

        } catch (error) {
            return {
                success: false,
                error: `URL parameter processing failed: ${error.message}`,
                hasAuthCode: false,
                hasMockToken: false
            };
        }
    }

    /**
     * Processes authorization code from URL
     * @param {Object} dependencies - Injected dependencies
     * @param {string} authCode - Authorization code
     * @returns {Promise<Object>} Auth code processing result
     */
    static async processAuthCodeCore(dependencies, authCode) {
        const { getElementById, cleanUrl, logInfo } = dependencies;

        try {
            const validation = InitializationValidators.validateAuthCode(authCode);
            if (!validation.isValid) {
                return { success: false, error: validation.error };
            }

            const processing = InitializationProcessors.processAuthCode(authCode);
            if (!processing.success) {
                return { success: false, error: processing.error };
            }

            // Set auth code in form
            const authCodeElement = getElementById('authCode');
            if (authCodeElement) {
                authCodeElement.value = processing.processedCode;
            }

            // Clean URL if needed
            if (processing.shouldCleanUrl && cleanUrl) {
                cleanUrl();
            }

            logInfo('🔑 Authorization code processed successfully');

            return {
                success: true,
                error: null,
                authCode: processing.processedCode,
                urlCleaned: processing.shouldCleanUrl
            };

        } catch (error) {
            return {
                success: false,
                error: `Auth code processing failed: ${error.message}`
            };
        }
    }

    /**
     * Processes mock token for development
     * @param {Object} dependencies - Injected dependencies
     * @param {string} mockToken - Mock token
     * @returns {Promise<Object>} Mock token processing result
     */
    static async processMockTokenCore(dependencies, mockToken) {
        const { localStorage, showResult, getUserProfile, cleanUrl, logInfo } = dependencies;

        try {
            const validation = InitializationValidators.validateMockToken(mockToken);
            if (!validation.isValid) {
                return { success: false, error: validation.error };
            }

            const processing = InitializationProcessors.processMockToken(mockToken);
            if (!processing.success) {
                return { success: false, error: processing.error };
            }

            // Store token in localStorage
            const storageConfig = InitializationProcessors.processTokenStorage(
                processing.processedToken, 
                processing.tokenExpiry
            );

            if (storageConfig.success) {
                localStorage.setItem(storageConfig.storageConfig.tokenKey, storageConfig.storageConfig.token);
                localStorage.setItem(storageConfig.storageConfig.expiryKey, storageConfig.storageConfig.expiry.toString());
            }

            // Show success message
            if (showResult) {
                showResult('Token loaded from URL parameter!', 'success');
            }

            // Get user profile
            if (getUserProfile) {
                getUserProfile(processing.processedToken);
            }

            // Clean URL
            if (processing.shouldCleanUrl && cleanUrl) {
                cleanUrl();
            }

            logInfo('🧪 Mock token processed successfully for development');

            return {
                success: true,
                error: null,
                token: processing.processedToken,
                expiry: processing.tokenExpiry,
                stored: storageConfig.success
            };

        } catch (error) {
            return {
                success: false,
                error: `Mock token processing failed: ${error.message}`
            };
        }
    }

    /**
     * Sets up environment mode and development features
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Environment setup result
     */
    static async setupEnvironmentModeCore(dependencies) {
        const { logInfo, logError, applyDevelopmentStyling } = dependencies;

        try {
            // Validate environment
            const envValidation = InitializationValidators.validateEnvironment(window.location);
            if (!envValidation.isValid) {
                return { success: false, error: envValidation.error };
            }

            // Process environment configuration
            const envConfig = InitializationProcessors.processEnvironmentConfig(envValidation);
            if (!envConfig.success) {
                return { success: false, error: envConfig.error };
            }

            let developmentSetup = false;

            // Apply development mode features
            if (envConfig.config.isDevelopment) {
                // Apply development border styling
                if (applyDevelopmentStyling) {
                    const borderStyle = InitializationUIBuilders.buildDevelopmentBorderStyle(envConfig.config);
                    if (borderStyle.success) {
                        applyDevelopmentStyling(borderStyle);
                        developmentSetup = true;
                    }
                }

                // Log development mode information
                const consoleStyle = InitializationUIBuilders.buildDevelopmentConsoleStyle(envConfig);
                if (consoleStyle.success) {
                    console.log('%c' + consoleStyle.messages.banner, consoleStyle.bannerStyle);
                    consoleStyle.messages.features.forEach(feature => {
                        console.log(feature);
                    });
                }

                logInfo('🔧 Development mode detected. Mock token options available.');
            }

            return {
                success: true,
                error: null,
                isDevelopment: envConfig.config.isDevelopment,
                environment: envValidation,
                config: envConfig.config,
                developmentSetup
            };

        } catch (error) {
            logError('Environment setup failed:', error);
            return {
                success: false,
                error: `Environment setup failed: ${error.message}`
            };
        }
    }

    /**
     * Registers service worker for offline functionality
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Service worker registration result
     */
    static async registerServiceWorkerCore(dependencies) {
        const { navigator, addEventListener, logInfo, logError, showUpdateNotification } = dependencies;

        try {
            // Validate service worker support
            const swValidation = InitializationValidators.validateServiceWorkerSupport(navigator);
            if (!swValidation.isSupported) {
                logInfo('ℹ️ Service worker not supported in this browser');
                return {
                    success: true, // Not an error, just not supported
                    error: null,
                    registered: false,
                    reason: 'Service worker not supported'
                };
            }

            // Process service worker configuration
            const swConfig = InitializationProcessors.processServiceWorkerConfig(swValidation);
            if (!swConfig.success) {
                return { success: false, error: swConfig.error };
            }

            return new Promise((resolve) => {
                addEventListener('load', async () => {
                    try {
                        const registration = await navigator.serviceWorker.register(
                            swConfig.config.scriptPath,
                            swConfig.config.options
                        );

                        logInfo('✅ Service Worker registered successfully:', registration.scope);

                        // Setup event listeners
                        const eventConfig = InitializationProcessors.processServiceWorkerEvents(registration);
                        if (eventConfig.success) {
                            this.setupServiceWorkerEventsCore(dependencies, registration, eventConfig.config);
                        }

                        resolve({
                            success: true,
                            error: null,
                            registered: true,
                            registration,
                            scope: registration.scope
                        });

                    } catch (error) {
                        logError('❌ Service Worker registration failed:', error);
                        resolve({
                            success: false,
                            error: error.message,
                            registered: false
                        });
                    }
                });
            });

        } catch (error) {
            logError('Service worker setup failed:', error);
            return {
                success: false,
                error: `Service worker setup failed: ${error.message}`,
                registered: false
            };
        }
    }

    /**
     * Sets up service worker event listeners
     * @param {Object} dependencies - Injected dependencies
     * @param {ServiceWorkerRegistration} registration - SW registration
     * @param {Object} eventConfig - Event configuration
     */
    static setupServiceWorkerEventsCore(dependencies, registration, eventConfig) {
        const { navigator, logInfo, showUpdateNotification } = dependencies;

        try {
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        logInfo(eventConfig.logging.update);
                        if (showUpdateNotification) {
                            showUpdateNotification();
                        }
                    }
                });
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data.type === 'CACHE_UPDATED') {
                    logInfo(eventConfig.logging.cacheUpdate, event.data.url);
                }
            });

            logInfo('🔧 Service worker event listeners configured');

        } catch (error) {
            dependencies.logError?.('Service worker event setup failed:', error);
        }
    }

    /**
     * Initializes global variables and monitoring
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Global variables initialization result
     */
    static async initializeGlobalVariablesCore(dependencies) {
        const { startMemoryMonitor, logInfo, logError } = dependencies;

        try {
            // Process global variables configuration
            const globalConfig = InitializationProcessors.processGlobalVariables({
                memoryMonitor: null // Will be set by startMemoryMonitor
            });

            if (!globalConfig.success) {
                return { success: false, error: globalConfig.error };
            }

            // Initialize variables
            let realTimeInterval = null;
            let currentPlaybackState = null;
            let memoryMonitor = null;

            // Start performance monitoring
            if (startMemoryMonitor) {
                try {
                    memoryMonitor = startMemoryMonitor();
                    globalConfig.config.variables.memoryMonitor = memoryMonitor;
                } catch (error) {
                    logError('Memory monitor initialization failed:', error);
                }
            }

            logInfo('📊 Global variables initialized successfully');
            logInfo('🚀 Music In Numbers application initialized');

            return {
                success: true,
                error: null,
                variables: {
                    realTimeInterval,
                    currentPlaybackState,
                    memoryMonitor
                },
                config: globalConfig.config,
                initializationId: globalConfig.initializationId
            };

        } catch (error) {
            logError('Global variables initialization failed:', error);
            return {
                success: false,
                error: `Global variables initialization failed: ${error.message}`
            };
        }
    }

    /**
     * Shows update notification for service worker updates
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Notification options
     * @returns {Object} Notification display result
     */
    static showUpdateNotificationCore(dependencies, options = {}) {
        const { appendToBody, logInfo } = dependencies;

        try {
            // Build notification HTML
            const notification = InitializationUIBuilders.buildUpdateNotificationHTML(options);
            if (!notification.success) {
                return { success: false, error: notification.error };
            }

            // Build notification CSS
            const styles = InitializationUIBuilders.buildUpdateNotificationCSS();
            if (!styles.success) {
                return { success: false, error: styles.error };
            }

            // Inject styles if not already present
            if (!document.getElementById(styles.styleId)) {
                const styleElement = document.createElement('style');
                styleElement.id = styles.styleId;
                styleElement.textContent = styles.css;
                document.head.appendChild(styleElement);
            }

            // Create notification element
            const notificationDiv = document.createElement('div');
            notificationDiv.innerHTML = notification.html;
            const notificationElement = notificationDiv.firstElementChild;

            // Add event listeners
            const refreshButton = notificationElement.querySelector('[data-action="refresh"]');
            const dismissButton = notificationElement.querySelector('[data-action="dismiss"]');

            if (refreshButton) {
                refreshButton.addEventListener('click', () => {
                    window.location.reload();
                });
            }

            if (dismissButton) {
                dismissButton.addEventListener('click', () => {
                    notificationElement.classList.add('hiding');
                    setTimeout(() => {
                        notificationElement.remove();
                    }, 300);
                });
            }

            // Auto-hide after duration
            if (notification.autoHide) {
                setTimeout(() => {
                    if (notificationElement.parentNode) {
                        notificationElement.classList.add('hiding');
                        setTimeout(() => {
                            notificationElement.remove();
                        }, 300);
                    }
                }, notification.duration);
            }

            // Append to body
            if (appendToBody) {
                appendToBody(notificationElement);
            } else {
                document.body.appendChild(notificationElement);
            }

            logInfo('📢 Update notification displayed');

            return {
                success: true,
                error: null,
                element: notificationElement,
                autoHide: notification.autoHide,
                duration: notification.duration
            };

        } catch (error) {
            return {
                success: false,
                error: `Update notification display failed: ${error.message}`
            };
        }
    }
}

// ===== MODULE EXPORTS =====

// Node.js/CommonJS support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InitializationCore;
}

// Browser/AMD support
if (typeof window !== 'undefined') {
    window.InitializationCore = InitializationCore;
}

// ES6 Module support
if (typeof globalThis !== 'undefined') {
    globalThis.InitializationCore = InitializationCore;
}