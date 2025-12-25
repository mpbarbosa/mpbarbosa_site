/**
 * Spotify API Core - Core orchestration functions with dependency injection
 * 
 * This class contains the core business logic functions that:
 * - Orchestrate API workflows (auth, token exchange, data fetching)
 * - Handle dependency injection for testability
 * - Implement "functional core, imperative shell" pattern
 * - Manage side effects through explicit dependencies
 * 
 * Functions in this class are IMPURE by design:
 * - They perform side effects (network, DOM, storage)
 * - They coordinate between pure functions and external systems
 * - They use dependency injection for all external dependencies
 * 
 * Note: All functions require dependency objects for operation
 * Browser environment: Use createDefaultDependencies() factory
 * Testing environment: Inject mock dependencies
 */
class SpotifyApiCore {
    /**
     * Enhanced authentication with session reuse optimization
     * 
     * This function implements a two-phase authentication strategy:
     * Phase 1: Attempt to detect and reuse existing Spotify browser sessions
     * Phase 2: Fall back to standard OAuth flow if no session detected
     * 
     * Session Detection Benefits:
     * - Instant authentication for users already logged into Spotify
     * - Reduced friction and improved user experience
     * - Cross-tab consistency for multi-window usage
     * - Performance optimization for returning users
     * 
     * NOTE: This function is NOT pure (has side effects and non-deterministic behavior)
     * but follows "functional core, imperative shell" pattern with session optimization:
     * - Uses pure functions for core logic and session validation
     * - Controls side effects through dependency injection
     * - Implements graceful fallback for session detection failures
     * - All dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElement - Function to get DOM elements
     * @param {Function} dependencies.showResult - Function to display results
     * @param {Object} dependencies.storage - Storage interface
     * @param {Function} dependencies.generateCodeVerifier - PKCE code verifier generator
     * @param {Function} dependencies.generateCodeChallenge - PKCE code challenge generator
     * @param {Function} dependencies.generateRandomString - Random string generator
     * @param {Object} dependencies.themeManager - Theme manager for accessibility
     * @param {Function} dependencies.navigate - Navigation function
     * @param {Function} dependencies.getRedirectUri - Function to get redirect URI
     * @param {Object} dependencies.sessionDetector - Session detection module (optional)
     * @param {Function} dependencies.exchangeCodeForTokenCore - Token exchange function
     * @param {Object} options - Authentication options
     * @param {boolean} options.enableSessionDetection - Enable session reuse optimization
     * @param {number} options.sessionDetectionTimeout - Timeout for session detection
     */
    static async initiateAuthWithSessionOptimization(dependencies, options = {}) {
        const {
            getElement,
            showResult,
            storage,
            generateCodeVerifier,
            generateCodeChallenge,
            generateRandomString,
            themeManager,
            navigate,
            getRedirectUri,
            sessionDetector,
            exchangeCodeForTokenCore
        } = dependencies;

        const {
            enableSessionDetection = true,
            sessionDetectionTimeout = 8000
        } = options;
        
        // SIDE EFFECT: Reading DOM state through dependency injection
        const clientIdInput = getElement('clientId');
        const connectBtn = getElement('connectBtn');
        
        if (!clientIdInput || !connectBtn) {
            throw new Error('Required DOM elements not found');
        }
        
        // EXTERNAL STATE: Reading user input (non-deterministic)
        const clientId = clientIdInput.value;
        
        // PURE FUNCTION: Validation logic with no side effects
        const validation = validateClientId(clientId);
        if (!validation.isValid) {
            // SIDE EFFECT: Display error message to user
            showResult(validation.error, 'error');
            // SIDE EFFECT: DOM manipulation for accessibility
            clientIdInput.focus();
            clientIdInput.setAttribute('aria-invalid', 'true');
            return;
        }
        
        // SIDE EFFECT: DOM manipulation to clear validation state
        clientIdInput.setAttribute('aria-invalid', 'false');
        
        // SIDE EFFECT: DOM manipulation to show loading state
        connectBtn.disabled = true;
        connectBtn.innerHTML = '🔄 Detecting existing session...';
        connectBtn.setAttribute('aria-busy', 'true');
        
        try {
            // NON-DETERMINISTIC: Generate random values for security
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const state = generateRandomString(16); // Different value each call
            const redirectUri = getRedirectUri();
            
            // PURE FUNCTION: Create session data (contains timestamp - non-deterministic)
            const sessionData = createAuthSession(validation.clientId, codeVerifier);
            
            // SIDE EFFECT: Persist data to storage
            Object.entries(sessionData).forEach(([key, value]) => {
                storage.setItem(key, value);
            });

            // PHASE 1: Session Detection and Reuse Optimization
            if (enableSessionDetection && sessionDetector) {
                try {
                    // SIDE EFFECT: Accessibility announcement
                    if (themeManager && themeManager.announceToScreenReader) {
                        themeManager.announceToScreenReader('Checking for existing Spotify session');
                    }

                    // IMPURE: Attempt to detect existing Spotify session
                    const authParams = {
                        clientId: validation.clientId,
                        redirectUri,
                        codeChallenge,
                        state
                    };

                    const sessionResult = await sessionDetector.detectExistingSession(
                        dependencies,
                        authParams,
                        { timeoutMs: sessionDetectionTimeout }
                    );

                    // Check if we successfully detected and reused a session
                    if (sessionResult.sessionDetected && sessionResult.authResult) {
                        // SIDE EFFECT: Update UI for successful session reuse
                        connectBtn.innerHTML = '✅ Session found - exchanging token...';
                        
                        // SIDE EFFECT: Accessibility announcement
                        if (themeManager && themeManager.announceToScreenReader) {
                            themeManager.announceToScreenReader('Existing session found, completing authentication');
                        }

                        // IMPURE: Exchange the authorization code from session detection
                        const tokenDependencies = {
                            ...dependencies,
                            getElement: (id) => {
                                // Mock the authCode input with detected code
                                if (id === 'authCode') {
                                    return { value: sessionResult.authResult.authCode };
                                }
                                return getElement(id);
                            }
                        };

                        await exchangeCodeForTokenCore(tokenDependencies);

                        // SIDE EFFECT: Reset DOM state for success
                        connectBtn.disabled = false;
                        connectBtn.innerHTML = '🎵 Connected via Session Reuse';
                        connectBtn.setAttribute('aria-busy', 'false');

                        // SIDE EFFECT: Display success message
                        showResult('Successfully connected using existing Spotify session!', 'success');
                        
                        return; // Exit early - session reuse successful
                    }

                    // Session detection completed but no usable session found
                    // Fall through to standard OAuth flow
                    
                } catch (sessionError) {
                    // SIDE EFFECT: Log session detection error (non-critical)
                    console.warn('Session detection failed, falling back to standard OAuth:', sessionError);
                    
                    // Continue to standard OAuth flow
                }
            }

            // PHASE 2: Standard OAuth Flow (fallback or primary when session detection disabled)
            // SIDE EFFECT: Update UI for standard OAuth
            connectBtn.innerHTML = '🔄 Redirecting to Spotify...';
            
            // PURE FUNCTION: Build authorization URL deterministically
            const authUrl = buildAuthUrl({
                clientId: validation.clientId,
                redirectUri,
                codeChallenge,
                state
            });
            
            // SIDE EFFECT: Accessibility announcement
            if (themeManager && themeManager.announceToScreenReader) {
                themeManager.announceToScreenReader('Redirecting to Spotify for authentication');
            }
            
            // SIDE EFFECT: Navigation with timer (asynchronous side effect)
            setTimeout(() => {
                navigate(authUrl);
            }, 500);
            
        } catch (error) {
            // SIDE EFFECT: Console logging
            console.error('Auth initiation error:', error);
            // SIDE EFFECT: Display error to user
            showResult('Failed to initiate authentication. Please try again.', 'error');
            
            // SIDE EFFECT: Reset DOM state
            connectBtn.disabled = false;
            connectBtn.innerHTML = '🎵 Connect to Spotify';
            connectBtn.setAttribute('aria-busy', 'false');
            
            throw error; // Re-throw for caller to handle
        }
    }

    /**
     * Legacy authentication function for backward compatibility
     * 
     * This maintains the original API while providing session optimization.
     * New code should use initiateAuthWithSessionOptimization for full control.
     * 
     * NOTE: This function is NOT pure (has side effects and non-deterministic behavior)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for core logic (validateClientId, buildAuthUrl, createAuthSession)
     * - Controls side effects through dependency injection (DOM, storage, navigation)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElement - Function to get DOM elements
     * @param {Function} dependencies.showResult - Function to display results
     * @param {Object} dependencies.storage - Storage interface
     * @param {Function} dependencies.generateCodeVerifier - PKCE code verifier generator
     * @param {Function} dependencies.generateCodeChallenge - PKCE code challenge generator
     * @param {Function} dependencies.generateRandomString - Random string generator
     * @param {Object} dependencies.themeManager - Theme manager for accessibility
     * @param {Function} dependencies.navigate - Navigation function
     * @param {Function} dependencies.getRedirectUri - Function to get redirect URI
     */
    static async initiateAuthCore(dependencies) {
        // Enhanced session detection is enabled by default for backward compatibility
        // while maintaining the same API signature for existing code
        const enhancedDependencies = {
            ...dependencies,
            sessionDetector: dependencies.sessionDetector || (typeof SpotifySessionDetector !== 'undefined' ? SpotifySessionDetector : null),
            exchangeCodeForTokenCore: dependencies.exchangeCodeForTokenCore || this.exchangeCodeForTokenCore.bind(this)
        };

        // Call the enhanced authentication with session optimization
        return this.initiateAuthWithSessionOptimization(enhancedDependencies, {
            enableSessionDetection: true, // Enable session detection by default
            sessionDetectionTimeout: 8000 // 8 second timeout for session detection
        });
            
            // SIDE EFFECT: Persist data to storage
            Object.entries(sessionData).forEach(([key, value]) => {
                storage.setItem(key, value);
            });
            
            // PURE FUNCTION: Build authorization URL deterministically
            const authUrl = buildAuthUrl({
                clientId: validation.clientId,
                redirectUri,
                codeChallenge,
                state
            });
            
            // SIDE EFFECT: Accessibility announcement
            if (themeManager && themeManager.announceToScreenReader) {
                themeManager.announceToScreenReader('Redirecting to Spotify for authentication');
            }
            
            // SIDE EFFECT: Navigation with timer (asynchronous side effect)
            setTimeout(() => {
                navigate(authUrl);
            }, 500);
            
        } catch (error) {
            // SIDE EFFECT: Console logging
            console.error('Auth initiation error:', error);
            // SIDE EFFECT: Display error to user
            showResult('Failed to initiate authentication. Please try again.', 'error');
            
            // SIDE EFFECT: Reset DOM state
            connectBtn.disabled = false;
            connectBtn.innerHTML = '🎵 Connect to Spotify';
            connectBtn.setAttribute('aria-busy', 'false');
            
            throw error; // Re-throw for caller to handle
        }
    }

    /**
     * Core token exchange logic with dependency injection
     * 
     * NOTE: This function is NOT pure (has side effects and network dependencies)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for validation, request building, and data creation
     * - Controls side effects through dependency injection (DOM, storage, network, UI)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElement - Function to get DOM elements
     * @param {Function} dependencies.getStorageItem - Function to read from storage
     * @param {Function} dependencies.setStorageItem - Function to write to storage
     * @param {Function} dependencies.showResult - Function to display results
     * @param {Function} dependencies.fetchApi - Function to make HTTP requests
     * @param {Function} dependencies.getUserProfile - Function to get user profile
     * @param {Function} dependencies.getRedirectUri - Function to get redirect URI
     */
    static async exchangeCodeForTokenCore(dependencies) {
        const {
            getElement,
            getStorageItem,
            setStorageItem,
            showResult,
            fetchApi,
            getUserProfile,
            getRedirectUri
        } = dependencies;
        
        // EXTERNAL STATE: Reading user inputs and stored data
        const authCodeInput = getElement('authCode');
        const clientIdInput = getElement('clientId');
        
        if (!authCodeInput || !clientIdInput) {
            throw new Error('Required DOM elements not found');
        }
        
        const authCode = authCodeInput.value;
        const clientId = clientIdInput.value || getStorageItem('spotify_client_id');
        const codeVerifier = getStorageItem('spotify_code_verifier');
        
        // PURE FUNCTION: Validate all inputs
        const validation = validateTokenExchangeInputs(authCode, clientId, codeVerifier);
        if (!validation.isValid) {
            // SIDE EFFECT: Display error to user
            showResult(validation.error, 'error');
            return;
        }
        
        try {
            const redirectUri = getRedirectUri();
            
            // PURE FUNCTION: Build request configuration
            const requestConfig = buildTokenExchangeRequest({
                clientId: validation.clientId,
                authCode: validation.authCode,
                redirectUri,
                codeVerifier: validation.codeVerifier
            });
            
            // SIDE EFFECT: Network request to Spotify API
            const response = await fetchApi(requestConfig.url, {
                method: requestConfig.method,
                headers: requestConfig.headers,
                body: requestConfig.body
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // PURE FUNCTION: Create storage data
                const storageData = createTokenStorageData(data);
                
                // SIDE EFFECT: Persist tokens to storage
                Object.entries(storageData).forEach(([key, value]) => {
                    setStorageItem(key, value);
                });
                
                // SIDE EFFECT: Display success message
                showResult('Successfully connected to Spotify API!', 'success');
                
                // SIDE EFFECT: Get user profile with the new access token
                await getUserProfile(data.access_token);
                
            } else {
                // SIDE EFFECT: Display API error
                showResult('Error: ' + (data.error || 'Unknown error'), 'error');
            }
            
        } catch (error) {
            // SIDE EFFECT: Display network/unexpected error
            showResult('Error: ' + error.message, 'error');
            throw error; // Re-throw for caller to handle
        }
    }

    /**
     * Core audio features logic with dependency injection
     * 
     * NOTE: This function is NOT pure (has side effects and network dependencies)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for validation, request building, and response processing
     * - Controls side effects through dependency injection (network, caching, logging)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.fetchApi - Function to make HTTP requests
     * @param {Function} dependencies.queueRequest - Function to handle caching and request queuing
     * @param {Function} dependencies.logWarning - Function to log warnings
     * @param {Function} dependencies.logError - Function to log errors
     * @param {string} accessToken - Spotify access token
     * @param {Array} trackIds - Array of track IDs to get features for
     */
    static async getAudioFeaturesCore(dependencies, accessToken, trackIds) {
        const {
            fetchApi,
            queueRequest,
            logWarning,
            logError
        } = dependencies;
        
        // PURE FUNCTION: Validate inputs
        const validation = validateAudioFeaturesInputs(accessToken, trackIds);
        if (!validation.isValid) {
            // SIDE EFFECT: Log validation error
            logError('Audio features validation failed:', validation.error);
            return [];
        }
        
        // PURE FUNCTION: Build request configuration
        const requestConfig = buildAudioFeaturesRequest(validation.accessToken, validation.trackIds);
        
        try {
            // SIDE EFFECT: Network request with caching through performance optimizer
            return await queueRequest(async () => {
                // SIDE EFFECT: HTTP request to Spotify API
                const response = await fetchApi(requestConfig.url, requestConfig.options);
                const data = await response.json();
                
                // PURE FUNCTION: Process response
                const result = processAudioFeaturesResponse(response, data);
                
                if (result.success) {
                    return result.audioFeatures;
                } else {
                    // SIDE EFFECT: Log API warning
                    logWarning('Failed to get audio features:', result.statusCode);
                    return [];
                }
            }, requestConfig.cacheKey);
            
        } catch (error) {
            // SIDE EFFECT: Log unexpected error
            logError('Error getting audio features:', error);
            return [];
        }
    }

    /**
     * Core top tracks logic with dependency injection
     * 
     * NOTE: This function is NOT pure (has side effects and network dependencies)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for validation, request building, and response processing
     * - Controls side effects through dependency injection (network, caching, logging)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.fetchApi - Function to make HTTP requests
     * @param {Function} dependencies.queueRequest - Function to handle caching and request queuing
     * @param {Function} dependencies.logError - Function to log errors
     * @param {string} accessToken - Spotify access token
     * @param {string} timeRange - Time range for top tracks
     * @param {number} limit - Number of tracks to return
     */
    static async getTopTracksCore(dependencies, accessToken, timeRange, limit) {
        const {
            fetchApi,
            queueRequest,
            logError
        } = dependencies;
        
        // PURE FUNCTION: Validate inputs
        const validation = validateTopTracksInputs(accessToken, timeRange, limit);
        if (!validation.isValid) {
            // SIDE EFFECT: Log validation error
            logError('Top tracks validation failed:', validation.error);
            throw new Error(validation.error);
        }
        
        // PURE FUNCTION: Build request configuration
        const requestConfig = buildTopTracksRequest(
            validation.accessToken,
            validation.timeRange,
            validation.limit
        );
        
        try {
            // SIDE EFFECT: Network request with caching through performance optimizer
            return await queueRequest(async () => {
                // SIDE EFFECT: HTTP request to Spotify API
                const response = await fetchApi(requestConfig.url, requestConfig.options);
                const data = await response.json();
                
                // PURE FUNCTION: Process response
                const result = processTopTracksResponse(response, data);
                
                if (result.success) {
                    return result.tracks;
                } else {
                    // SIDE EFFECT: Log API error and throw
                    logError('Failed to get top tracks:', result.statusCode);
                    throw new Error(result.error);
                }
            }, requestConfig.cacheKey);
            
        } catch (error) {
            // SIDE EFFECT: Log unexpected error and re-throw
            logError('Error getting top tracks:', error);
            throw error;
        }
    }

    /**
     * Core top artists logic with dependency injection
     * 
     * NOTE: This function is NOT pure (has side effects and network dependencies)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for validation, request building, and response processing
     * - Controls side effects through dependency injection (network, caching, logging)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.fetchApi - Function to make HTTP requests
     * @param {Function} dependencies.queueRequest - Function to handle caching and request queuing
     * @param {Function} dependencies.logError - Function to log errors
     * @param {string} accessToken - Spotify access token
     * @param {string} timeRange - Time range for top artists
     * @param {number} limit - Number of artists to return
     */
    static async getTopArtistsCore(dependencies, accessToken, timeRange, limit) {
        const {
            fetchApi,
            queueRequest,
            logError
        } = dependencies;
        
        // PURE FUNCTION: Validate inputs
        const validation = validateTopArtistsInputs(accessToken, timeRange, limit);
        if (!validation.isValid) {
            // SIDE EFFECT: Log validation error
            logError('Top artists validation failed:', validation.error);
            throw new Error(validation.error);
        }
        
        // PURE FUNCTION: Build request configuration
        const requestConfig = buildTopArtistsRequest(
            validation.accessToken,
            validation.timeRange,
            validation.limit
        );
        
        try {
            // SIDE EFFECT: Network request with caching through performance optimizer
            return await queueRequest(async () => {
                // SIDE EFFECT: HTTP request to Spotify API
                const response = await fetchApi(requestConfig.url, requestConfig.options);
                const data = await response.json();
                
                // PURE FUNCTION: Process response
                const result = processTopArtistsResponse(response, data);
                
                if (result.success) {
                    return result.artists;
                } else {
                    // SIDE EFFECT: Log API error and throw
                    logError('Failed to get top artists:', result.statusCode);
                    throw new Error(result.error);
                }
            }, requestConfig.cacheKey);
            
        } catch (error) {
            // SIDE EFFECT: Log unexpected error and re-throw
            logError('Error getting top artists:', error);
            throw error;
        }
    }

    /**
     * Core recently played tracks logic with dependency injection
     * 
     * NOTE: This function is NOT pure (has side effects and network dependencies)
     * but follows "functional core, imperative shell" pattern for maximum testability:
     * - Uses pure functions for validation, request building, and response processing
     * - Controls side effects through dependency injection (network, caching, logging)
     * - All external dependencies are mockable for comprehensive testing
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.fetchApi - Function to make HTTP requests
     * @param {Function} dependencies.queueRequest - Function to handle caching and request queuing
     * @param {Function} dependencies.logWarning - Function to log warnings
     * @param {Function} dependencies.logError - Function to log errors
     * @param {string} accessToken - Spotify access token
     * @param {number} limit - Number of recently played tracks to return
     */
    static async getRecentlyPlayedCore(dependencies, accessToken, limit) {
        const {
            fetchApi,
            queueRequest,
            logWarning,
            logError
        } = dependencies;
        
        // PURE FUNCTION: Validate inputs
        const validation = validateRecentlyPlayedInputs(accessToken, limit);
        if (!validation.isValid) {
            // SIDE EFFECT: Log validation error
            logError('Recently played validation failed:', validation.error);
            return [];
        }
        
        // PURE FUNCTION: Build request configuration
        const requestConfig = buildRecentlyPlayedRequest(
            validation.accessToken,
            validation.limit
        );
        
        try {
            // SIDE EFFECT: Network request with caching through performance optimizer
            return await queueRequest(async () => {
                // SIDE EFFECT: HTTP request to Spotify API
                const response = await fetchApi(requestConfig.url, requestConfig.options);
                const data = await response.json();
                
                // PURE FUNCTION: Process response
                const result = processRecentlyPlayedResponse(response, data);
                
                if (result.success) {
                    return result.tracks;
                } else {
                    // SIDE EFFECT: Log API warning (non-critical failure)
                    logWarning('Failed to get recently played tracks:', result.statusCode);
                    return [];
                }
            }, requestConfig.cacheKey);
            
        } catch (error) {
            // SIDE EFFECT: Log unexpected error (non-critical failure)
            logError('Error getting recently played tracks:', error);
            return [];
        }
    }

    /**
     * IMPURE: Dependency-injected core function for current playback retrieval
     * 
     * Implements "functional core, imperative shell" pattern:
     * - Pure functions handle validation, request building, response processing
     * - This function orchestrates side effects (network, caching, logging)
     * - Explicit dependency injection for testability
     * 
     * Side effects performed:
     * - HTTP request to Spotify Web API
     * - Performance optimization caching
     * - Error logging to console
     * - Promise-based asynchronous operations
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.fetch - HTTP client function
     * @param {Object} dependencies.performanceOptimizer - Caching system
     * @param {Object} dependencies.console - Logging interface
     * @param {string} accessToken - Spotify access token
     * @returns {Promise<Object|null>} Current playback state or null
     */
    static async getCurrentPlaybackCore(dependencies, accessToken) {
        // PURE: Input validation with detailed error information
        const validation = validateCurrentPlaybackInputs(accessToken);
        if (!validation.isValid) {
            dependencies.console.error('Current playback validation failed:', validation.error);
            return null;
        }
        
        // PURE: Build standardized request configuration
        const request = buildCurrentPlaybackRequest(accessToken);
        const cacheKey = 'current_playback';
        
        try {
            // IMPURE: Network request with performance optimization
            return await dependencies.performanceOptimizer.queueRequest(async () => {
                // IMPURE: HTTP request execution
                const response = await dependencies.fetch(request.url, request.options);
                
                // IMPURE: Response parsing (potential JSON parsing side effects)
                let responseData = null;
                if (response.status !== 204) {
                    try {
                        responseData = await response.json();
                    } catch (parseError) {
                        dependencies.console.warn('Failed to parse current playback response:', parseError);
                        return null;
                    }
                }
                
                // PURE: Response processing and transformation
                const result = processCurrentPlaybackResponse(response, responseData);
                
                if (result === null && response.status !== 204 && !response.ok) {
                    dependencies.console.warn('Failed to get current playback:', response.status);
                }
                
                return result;
            }, cacheKey);
        } catch (error) {
            // IMPURE: Error logging
            dependencies.console.error('Error getting current playback:', error);
            return null;
        }
    }

    /**
     * IMPURE: Dependency-injected core function for user profile retrieval
     * 
     * Implements "functional core, imperative shell" pattern:
     * - Pure functions handle validation, request building, response processing
     * - This function orchestrates side effects (network, UI updates, logging)
     * - Explicit dependency injection for testability
     * 
     * Side effects performed:
     * - HTTP request to Spotify Web API
     * - UI updates via displayUserInfo() and showResult()
     * - Error logging to console
     * - Exception throwing for error propagation
     * - Promise-based asynchronous operations
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.fetch - HTTP client function
     * @param {Function} dependencies.displayUserInfo - UI update function for user data
     * @param {Function} dependencies.showResult - UI function for status messages
     * @param {Object} dependencies.console - Logging interface
     * @param {string} accessToken - Spotify access token
     * @returns {Promise<Object>} User profile data from Spotify API
     * @throws {Error} Re-throws errors for upstream handling
     */
    static async getUserProfileCore(dependencies, accessToken) {
        // PURE: Input validation with detailed error information
        const validation = validateUserProfileInputs(accessToken);
        if (!validation.isValid) {
            const errorMessage = `User profile validation failed: ${validation.error}`;
            dependencies.console.error(errorMessage);
            dependencies.showResult('Error getting user profile: ' + validation.error, 'error');
            throw new Error(validation.error);
        }
        
        // PURE: Build standardized request configuration
        const request = buildUserProfileRequest(accessToken);
        
        try {
            // IMPURE: HTTP request execution
            const response = await dependencies.fetch(request.url, request.options);
            
            // IMPURE: Response parsing (potential JSON parsing side effects)
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (parseError) {
                const errorMessage = 'Failed to parse user profile response';
                dependencies.console.error('Error parsing user profile response:', parseError);
                dependencies.showResult('Error getting user profile: ' + errorMessage, 'error');
                throw new Error(errorMessage);
            }
            
            // PURE: Response processing and transformation
            const result = processUserProfileResponse(response, responseData);
            
            if (result.success) {
                // IMPURE: UI update with user information
                dependencies.displayUserInfo(result.data);
                return result.data;
            } else {
                // IMPURE: Error UI feedback and exception throwing
                dependencies.showResult('Failed to get user profile', 'error');
                throw new Error(result.error);
            }
        } catch (error) {
            // IMPURE: Error logging and UI feedback
            dependencies.console.error('Error getting user profile:', error);
            dependencies.showResult('Error getting user profile: ' + error.message, 'error');
            throw error;
        }
    }

    /**
     * IMPURE: Dependency-injected core function for token validation
     * 
     * Implements "functional core, imperative shell" pattern:
     * - Pure functions handle validation and expiry checking
     * - This function orchestrates side effects (storage access, time reading)
     * - Explicit dependency injection for testability
     * 
     * Side effects performed:
     * - Reading from localStorage (storage access)
     * - Getting current time (Date.now() or equivalent)
     * - External state observation
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.getStorageItem - Storage read function
     * @param {Function} dependencies.getCurrentTime - Time provider function
     * @returns {boolean} True if token exists and is valid, false otherwise
     */
    static isTokenValidCore(dependencies) {
        // IMPURE: Read token data from storage
        const token = dependencies.getStorageItem('spotify_access_token');
        const expiry = dependencies.getStorageItem('spotify_token_expiry');
        
        // PURE: Validate token data integrity
        const validation = validateTokenData(token, expiry);
        if (!validation.isValid) {
            return false;
        }
        
        // IMPURE: Get current time
        const currentTime = dependencies.getCurrentTime();
        
        // PURE: Check expiry status
        return checkTokenExpiry(currentTime, validation.expiry);
    }

    /**
     * IMPURE: Dependency-injected core function for valid token retrieval
     * 
     * Implements "functional core, imperative shell" pattern:
     * - Pure functions handle conditional logic
     * - This function orchestrates side effects (token validation, storage access)
     * - Explicit dependency injection for testability
     * - Leverages already-refactored isTokenValidCore function
     * 
     * Side effects performed:
     * - Token validation via isTokenValidCore (localStorage + Date.now())
     * - Storage reading for token retrieval
     * - External state observation
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.getStorageItem - Storage read function
     * @param {Function} dependencies.isTokenValidCore - Token validation function
     * @returns {string|null} Valid access token or null if invalid/missing
     */
    static getValidAccessTokenCore(dependencies) {
        // IMPURE: Check token validity using dependency-injected validation
        const isValid = dependencies.isTokenValidCore(dependencies);
        
        if (!isValid) {
            // Early return for invalid/missing tokens
            return null;
        }
        
        // IMPURE: Retrieve token from storage
        const token = dependencies.getStorageItem('spotify_access_token');
        
        // PURE: Apply conditional logic
        return getTokenIfValid(isValid, token);
    }

    /**
     * IMPURE: Dependency-injected core function for user playlists retrieval
     * 
     * Implements "functional core, imperative shell" pattern:
     * - Pure functions handle validation, request building, response processing
     * - This function orchestrates side effects (network, logging, exceptions)
     * - Explicit dependency injection for testability
     * 
     * Side effects performed:
     * - HTTP request to Spotify Web API
     * - Error logging to console
     * - Exception throwing for error propagation
     * - Promise-based asynchronous operations
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.fetch - HTTP client function
     * @param {Object} dependencies.console - Logging interface
     * @param {string} accessToken - Spotify access token
     * @param {number} limit - Number of playlists to return (1-50)
     * @returns {Promise<Array>} Array of playlist objects or empty array on error
     * @throws {Error} Re-throws errors for upstream handling when appropriate
     */
    static async getUserPlaylistsCore(dependencies, accessToken, limit = 20) {
        // PURE: Input validation with detailed error information
        const validation = validatePlaylistsInputs(accessToken, limit);
        if (!validation.isValid) {
            const errorMessage = `Playlists validation failed: ${validation.error}`;
            dependencies.console.error(errorMessage);
            return [];
        }
        
        // PURE: Build standardized request configuration
        const request = buildPlaylistsRequest(validation.accessToken, validation.limit);
        
        try {
            // IMPURE: HTTP request execution
            const response = await dependencies.fetch(request.url, request.options);
            
            // IMPURE: Response parsing (potential JSON parsing side effects)
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (parseError) {
                const errorMessage = 'Failed to parse playlists response';
                dependencies.console.error('Error parsing playlists response:', parseError);
                return [];
            }
            
            // PURE: Response processing and transformation
            const result = processPlaylistsResponse(response, responseData);
            
            if (result.success) {
                return result.data;
            } else {
                // IMPURE: Error logging and exception throwing
                dependencies.console.error('Error getting playlists:', result.error);
                throw new Error(result.error);
            }
        } catch (error) {
            // IMPURE: Error logging and fallback return
            dependencies.console.error('Error getting playlists:', error);
            return [];
        }
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyApiCore;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.SpotifyApiCore = SpotifyApiCore;
}