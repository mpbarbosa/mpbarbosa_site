// ===== SPOTIFY API INTEGRATION =====

// Import validators class - make it globally available
let SpotifyApiValidators;
if (typeof require !== 'undefined') {
    // Node.js environment
    SpotifyApiValidators = require('./spotify-api/SpotifyApiValidators.js');
} else if (typeof window !== 'undefined') {
    // Browser environment - the class will be loaded via script tag
    // SpotifyApiValidators should be available globally via the script tag
    SpotifyApiValidators = window.SpotifyApiValidators;
}

// Import request builders class - make it globally available
let SpotifyApiRequestBuilders;
if (typeof require !== 'undefined') {
    // Node.js environment
    SpotifyApiRequestBuilders = require('./spotify-api/SpotifyApiRequestBuilders.js');
} else if (typeof window !== 'undefined') {
    // Browser environment - the class will be loaded via script tag
    // SpotifyApiRequestBuilders should be available globally via the script tag
    SpotifyApiRequestBuilders = window.SpotifyApiRequestBuilders;
}

// Import response processors class - make it globally available
let SpotifyApiResponseProcessors;
if (typeof require !== 'undefined') {
    // Node.js environment
    SpotifyApiResponseProcessors = require('./spotify-api/SpotifyApiResponseProcessors.js');
} else if (typeof window !== 'undefined') {
    // Browser environment - the class will be loaded via script tag
    // SpotifyApiResponseProcessors should be available globally via the script tag
    SpotifyApiResponseProcessors = window.SpotifyApiResponseProcessors;
}

// Import core API class - make it globally available
let SpotifyApiCore;
if (typeof require !== 'undefined') {
    // Node.js environment
    SpotifyApiCore = require('./spotify-api/SpotifyApiCore.js');
} else if (typeof window !== 'undefined') {
    // Browser environment - the class will be loaded via script tag
    // SpotifyApiCore should be available globally via the script tag
    SpotifyApiCore = window.SpotifyApiCore;
}

// Import utilities class - make it globally available
let SpotifyApiUtilities;
if (typeof require !== 'undefined') {
    // Node.js environment
    SpotifyApiUtilities = require('./spotify-api/SpotifyApiUtilities.js');
} else if (typeof window !== 'undefined') {
    // Browser environment - the class will be loaded via script tag
    // SpotifyApiUtilities should be available globally via the script tag
    SpotifyApiUtilities = window.SpotifyApiUtilities;
}

// Legacy validation functions for backward compatibility
/**
 * @deprecated Use SpotifyApiValidators.validateClientId() instead
 * Pure function to validate Spotify Client ID
 * @param {string} clientId - The client ID to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
function validateClientId(clientId) {
    return SpotifyApiValidators.validateClientId(clientId);
}

/**
 * @deprecated Use SpotifyApiValidators.validateTokenExchangeInputs() instead
 */
function validateTokenExchangeInputs(authCode, clientId, codeVerifier) {
    return SpotifyApiValidators.validateTokenExchangeInputs(authCode, clientId, codeVerifier);
}

/**
 * @deprecated Use SpotifyApiValidators.validateAudioFeaturesInputs() instead
 */
function validateAudioFeaturesInputs(accessToken, trackIds) {
    return SpotifyApiValidators.validateAudioFeaturesInputs(accessToken, trackIds);
}

/**
 * @deprecated Use SpotifyApiValidators.validateTopTracksInputs() instead
 */
function validateTopTracksInputs(accessToken, timeRange, limit) {
    return SpotifyApiValidators.validateTopTracksInputs(accessToken, timeRange, limit);
}

/**
 * @deprecated Use SpotifyApiValidators.validateTopArtistsInputs() instead
 */
function validateTopArtistsInputs(accessToken, timeRange, limit) {
    return SpotifyApiValidators.validateTopArtistsInputs(accessToken, timeRange, limit);
}

/**
 * @deprecated Use SpotifyApiValidators.validateRecentlyPlayedInputs() instead
 */
function validateRecentlyPlayedInputs(accessToken, limit) {
    return SpotifyApiValidators.validateRecentlyPlayedInputs(accessToken, limit);
}

/**
 * @deprecated Use SpotifyApiValidators.validateCurrentPlaybackInputs() instead
 */
function validateCurrentPlaybackInputs(accessToken) {
    return SpotifyApiValidators.validateCurrentPlaybackInputs(accessToken);
}

/**
 * @deprecated Use SpotifyApiValidators.validateUserProfileInputs() instead
 */
function validateUserProfileInputs(accessToken) {
    return SpotifyApiValidators.validateUserProfileInputs(accessToken);
}

/**
 * @deprecated Use SpotifyApiValidators.validateTokenData() instead
 */
function validateTokenData(token, expiry) {
    return SpotifyApiValidators.validateTokenData(token, expiry);
}

/**
 * @deprecated Use SpotifyApiValidators.validatePlaylistsInputs() instead
 */
function validatePlaylistsInputs(accessToken, limit) {
    return SpotifyApiValidators.validatePlaylistsInputs(accessToken, limit);
}

/**
 * Pure function to build Spotify authorization URL
 * @param {Object} params - Authorization parameters
 * @param {string} params.clientId - Spotify client ID
 * @param {string} params.redirectUri - Redirect URI
 * @param {string} params.codeChallenge - PKCE code challenge
 * @param {string} params.state - CSRF protection state
 * @returns {string} Complete authorization URL
 */
function buildAuthUrl({ clientId, redirectUri, codeChallenge, state }) {
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.buildAuthUrl) {
        return SpotifyApiUtilities.buildAuthUrl({ clientId, redirectUri, codeChallenge, state });
    }

    // Extended scopes for advanced music analytics (Phase 3 Track 1)
    const scope = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-library-read user-read-currently-playing user-read-playback-state';
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Pure function to create auth session data
 * @param {string} clientId - Validated client ID
 * @param {string} codeVerifier - PKCE code verifier
 * @returns {Object} Session data to store
 */
function createAuthSession(clientId, codeVerifier) {
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.createAuthSession) {
        return SpotifyApiUtilities.createAuthSession(clientId, codeVerifier);
    }

    return {
        spotify_code_verifier: codeVerifier,
        spotify_client_id: clientId,
        spotify_auth_timestamp: Date.now().toString()
    };
}

/**
 * Core authentication logic with dependency injection
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
async function initiateAuthCore(dependencies) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.initiateAuthCore) {
        return SpotifyApiCore.initiateAuthCore(dependencies);
    }

    const {
        getElement,
        showResult,
        storage,
        generateCodeVerifier,
        generateCodeChallenge,
        generateRandomString,
        themeManager,
        navigate,
        getRedirectUri
    } = dependencies;
    
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
    connectBtn.innerHTML = '🔄 Connecting...';
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
 * Default dependency factory for browser environment
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
function createDefaultDependencies() {
    // Delegate to extracted utilities class when available
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.createDefaultDependencies) {
        return SpotifyApiUtilities.createDefaultDependencies();
    }

    return {
        // GLOBAL ACCESS: Reading from document object (browser-specific)
        getElement: (id) => document.getElementById(id),
        
        // BROWSER API: Storage operations
        getStorageItem: (key) => localStorage.getItem(key),
        setStorageItem: (key, value) => localStorage.setItem(key, value),
        
        // FALLBACK BEHAVIOR: Non-deterministic based on what's available on window
        showResult: window.showResult || ((message, type) => console.log(`${type}: ${message}`)),
        
        // UI FUNCTION: User information display (fallback for compatibility)
        displayUserInfo: window.displayUserInfo || ((userData) => console.log('User Profile:', userData)),
        
        // BROWSER API: Direct reference to localStorage (environment-dependent)
        storage: localStorage,
        
        // NETWORK API: HTTP requests (side effects)
        fetch: fetch,
        fetchApi: (url, options) => fetch(url, options),
        
        // LOGGING: Console interface for error reporting
        console: console,
        
        // TIME PROVIDER: Current timestamp for token validation
        getCurrentTime: () => Date.now(),
        
        // TOKEN VALIDATION: Reference to dependency-injected token validation
        isTokenValidCore: isTokenValidCore,
        
        // PERFORMANCE OPTIMIZATION: Caching and request queuing (side effects)
        performanceOptimizer: {
            queueRequest: (requestFn, cacheKey) => {
                // Fallback if performanceOptimizer is not available
                if (typeof performanceOptimizer !== 'undefined' && performanceOptimizer.queueRequest) {
                    return performanceOptimizer.queueRequest(requestFn, cacheKey);
                }
                // Direct execution without caching as fallback
                return requestFn();
            }
        },
        
        // LOGGING FUNCTIONS: Console output (side effects)
        logWarning: (message, ...args) => console.warn(message, ...args),
        logError: (message, ...args) => console.error(message, ...args),
        
        // GLOBAL FUNCTIONS: Reading from window object (may be undefined at runtime)
        generateCodeVerifier: window.generateCodeVerifier,
        generateCodeChallenge: window.generateCodeChallenge,
        generateRandomString: window.generateRandomString,
        themeManager: window.themeManager,
        getUserProfile: window.getUserProfile || getUserProfile,
        
        // SIDE EFFECT: Navigation function that modifies browser location
        navigate: (url) => { window.location.href = url; },
        
        // TIME-DEPENDENT: Current URL can change between calls
        getRedirectUri: () => window.location.href.split('?')[0]
    };
}

/**
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to initiateAuthCore() which performs side effects
 * - Indirectly performs DOM manipulation, storage, and navigation
 */
async function initiateAuth() {
    // IMPURE: Factory function that reads from global browser state
    // Creates dependencies from document, window, localStorage, etc.
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    // Performs DOM manipulation, storage writes, navigation, etc.
    return initiateAuthCore(dependencies);
}

/**
 * Pure function to validate token exchange inputs
 * @param {string} authCode - Authorization code from Spotify
 * @param {string} clientId - Spotify client ID
 * @param {string} codeVerifier - PKCE code verifier
 * @returns {Object} Validation result with isValid boolean and error message
 */
// Function moved to SpotifyApiValidators class

/**
 * Pure function to build token exchange request parameters
 * @param {Object} params - Token exchange parameters
 * @param {string} params.clientId - Spotify client ID
 * @param {string} params.authCode - Authorization code
 * @param {string} params.redirectUri - Redirect URI
 * @param {string} params.codeVerifier - PKCE code verifier
 * @returns {Object} Request configuration object
 */
function buildTokenExchangeRequest({ clientId, authCode, redirectUri, codeVerifier }) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildTokenExchangeRequest) {
        return SpotifyApiRequestBuilders.buildTokenExchangeRequest({ clientId, authCode, redirectUri, codeVerifier });
    }

    return {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        }).toString()
    };
}

/**
 * Pure function to create token storage data
 * @param {Object} tokenResponse - Response from Spotify token endpoint
 * @param {string} tokenResponse.access_token - Access token
 * @param {number} tokenResponse.expires_in - Token expiry in seconds
 * @returns {Object} Storage data to persist
 */
function createTokenStorageData(tokenResponse) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.createTokenStorageData) {
        return SpotifyApiRequestBuilders.createTokenStorageData(tokenResponse);
    }

    return {
        spotify_access_token: tokenResponse.access_token,
        spotify_token_expiry: (Date.now() + (tokenResponse.expires_in * 1000)).toString()
    };
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
async function exchangeCodeForTokenCore(dependencies) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.exchangeCodeForTokenCore) {
        return SpotifyApiCore.exchangeCodeForTokenCore(dependencies);
    }

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

// Exchange authorization code for access token
/**
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to exchangeCodeForTokenCore() which performs side effects
 * - Indirectly performs DOM reading, storage operations, and network requests
 */
async function exchangeCodeForToken() {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return exchangeCodeForTokenCore(dependencies);
}

/**
 * Pure function to validate audio features request inputs
 * @param {string} accessToken - Spotify access token
 * @param {Array} trackIds - Array of track IDs
 * @returns {Object} Validation result with isValid boolean and processed data
 */
// validateAudioFeaturesInputs moved to SpotifyApiValidators class

/**
 * Pure function to build audio features API request configuration
 * @param {string} accessToken - Validated access token
 * @param {Array} trackIds - Validated array of track IDs
 * @returns {Object} Request configuration object
 */
function buildAudioFeaturesRequest(accessToken, trackIds) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildAudioFeaturesRequest) {
        return SpotifyApiRequestBuilders.buildAudioFeaturesRequest(accessToken, trackIds);
    }

    const ids = trackIds.join(',');
    
    return {
        url: `https://api.spotify.com/v1/audio-features?ids=${ids}`,
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        },
        cacheKey: `audio_features_${ids.slice(0, 50)}${ids.length > 50 ? '...' : ''}` // Shortened key for long IDs
    };
}

/**
 * Pure function to process audio features API response
 * @param {Response} response - Fetch API response object
 * @param {Object} data - Parsed JSON response data
 * @returns {Object} Processed result with success status and audio features
 */
function processAudioFeaturesResponse(response, data) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processAudioFeaturesResponse) {
        return SpotifyApiResponseProcessors.processAudioFeaturesResponse(response, data);
    }

    if (response.ok) {
        return {
            success: true,
            audioFeatures: data.audio_features || [],
            statusCode: response.status
        };
    } else {
        return {
            success: false,
            audioFeatures: [],
            statusCode: response.status,
            error: `Failed to get audio features: ${response.status}`
        };
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
async function getAudioFeaturesCore(dependencies, accessToken, trackIds) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getAudioFeaturesCore) {
        return SpotifyApiCore.getAudioFeaturesCore(dependencies, accessToken, trackIds);
    }

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

// Get audio features for tracks
/**
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getAudioFeaturesCore() which performs side effects
 * - Indirectly performs network requests, caching, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @param {Array} trackIds - Array of track IDs to get features for
 * @returns {Promise<Array>} Array of audio features or empty array on error
 */
async function getAudioFeatures(accessToken, trackIds) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getAudioFeaturesCore(dependencies, accessToken, trackIds);
}

/**
 * Pure function to build top tracks API request configuration
 * @param {string} accessToken - Validated access token
 * @param {string} timeRange - Validated time range
 * @param {number} limit - Validated limit
 * @returns {Object} Request configuration object
 */
function buildTopTracksRequest(accessToken, timeRange, limit) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildTopTracksRequest) {
        return SpotifyApiRequestBuilders.buildTopTracksRequest(accessToken, timeRange, limit);
    }

    return {
        url: `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        },
        cacheKey: `top_tracks_${timeRange}_${limit}`
    };
}

/**
 * Pure function to process top tracks API response
 * @param {Response} response - Fetch API response object
 * @param {Object} data - Parsed JSON response data
 * @returns {Object} Processed result with success status and tracks
 */
function processTopTracksResponse(response, data) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processTopTracksResponse) {
        return SpotifyApiResponseProcessors.processTopTracksResponse(response, data);
    }

    if (response.ok) {
        return {
            success: true,
            tracks: data.items || [],
            statusCode: response.status
        };
    } else {
        return {
            success: false,
            tracks: [],
            statusCode: response.status,
            error: `Failed to get top tracks: ${response.status}`
        };
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
async function getTopTracksCore(dependencies, accessToken, timeRange, limit) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getTopTracksCore) {
        return SpotifyApiCore.getTopTracksCore(dependencies, accessToken, timeRange, limit);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getTopTracksCore() which performs side effects
 * - Indirectly performs network requests, caching, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @param {string} timeRange - Time range for top tracks (short_term, medium_term, long_term)
 * @param {number} limit - Number of tracks to return (1-50)
 * @returns {Promise<Array>} Array of top tracks or throws error
 */
async function getTopTracks(accessToken, timeRange = 'medium_term', limit = 20) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getTopTracksCore(dependencies, accessToken, timeRange, limit);
}

/**
 * Pure function to build top artists API request configuration
 * @param {string} accessToken - Validated access token
 * @param {string} timeRange - Validated time range
 * @param {number} limit - Validated limit
 * @returns {Object} Request configuration object
 */
function buildTopArtistsRequest(accessToken, timeRange, limit) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildTopArtistsRequest) {
        return SpotifyApiRequestBuilders.buildTopArtistsRequest(accessToken, timeRange, limit);
    }

    return {
        url: `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        },
        cacheKey: `top_artists_${timeRange}_${limit}`
    };
}

/**
 * Pure function to process top artists API response
 * @param {Response} response - Fetch API response object
 * @param {Object} data - Parsed JSON response data
 * @returns {Object} Processed result with success status and artists
 */
function processTopArtistsResponse(response, data) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processTopArtistsResponse) {
        return SpotifyApiResponseProcessors.processTopArtistsResponse(response, data);
    }

    if (response.ok) {
        return {
            success: true,
            artists: data.items || [],
            statusCode: response.status
        };
    } else {
        return {
            success: false,
            artists: [],
            statusCode: response.status,
            error: `Failed to get top artists: ${response.status}`
        };
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
async function getTopArtistsCore(dependencies, accessToken, timeRange, limit) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getTopArtistsCore) {
        return SpotifyApiCore.getTopArtistsCore(dependencies, accessToken, timeRange, limit);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getTopArtistsCore() which performs side effects
 * - Indirectly performs network requests, caching, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @param {string} timeRange - Time range for top artists (short_term, medium_term, long_term)
 * @param {number} limit - Number of artists to return (1-50)
 * @returns {Promise<Array>} Array of top artists or throws error
 */
async function getTopArtists(accessToken, timeRange = 'medium_term', limit = 20) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getTopArtistsCore(dependencies, accessToken, timeRange, limit);
}

/**
 * Pure function to build recently played tracks API request configuration
 * @param {string} accessToken - Validated access token
 * @param {number} limit - Validated limit
 * @returns {Object} Request configuration object
 */
function buildRecentlyPlayedRequest(accessToken, limit) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildRecentlyPlayedRequest) {
        return SpotifyApiRequestBuilders.buildRecentlyPlayedRequest(accessToken, limit);
    }

    return {
        url: `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        },
        cacheKey: `recently_played_${limit}`
    };
}

/**
 * Pure function to process recently played tracks API response
 * @param {Response} response - Fetch API response object
 * @param {Object} data - Parsed JSON response data
 * @returns {Object} Processed result with success status and tracks
 */
function processRecentlyPlayedResponse(response, data) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processRecentlyPlayedResponse) {
        return SpotifyApiResponseProcessors.processRecentlyPlayedResponse(response, data);
    }

    if (response.ok) {
        return {
            success: true,
            tracks: data.items || [],
            statusCode: response.status
        };
    } else {
        return {
            success: false,
            tracks: [],
            statusCode: response.status,
            error: `Failed to get recently played tracks: ${response.status}`
        };
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
async function getRecentlyPlayedCore(dependencies, accessToken, limit) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getRecentlyPlayedCore) {
        return SpotifyApiCore.getRecentlyPlayedCore(dependencies, accessToken, limit);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getRecentlyPlayedCore() which performs side effects
 * - Indirectly performs network requests, caching, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Number of recently played tracks to return (1-50)
 * @returns {Promise<Array>} Array of recently played tracks or empty array on error
 */
async function getRecentlyPlayed(accessToken, limit = 50) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getRecentlyPlayedCore(dependencies, accessToken, limit);
}

/**
 * PURE: Builds HTTP request configuration for current playback endpoint
 * 
 * Creates standardized request structure:
 * - Spotify Web API current playback endpoint URL
 * - Authorization headers with Bearer token
 * - GET method configuration
 * 
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Object} Complete fetch request configuration
 * @throws {never} Pure function - deterministic output for given inputs
 */
function buildCurrentPlaybackRequest(accessToken) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildCurrentPlaybackRequest) {
        return SpotifyApiRequestBuilders.buildCurrentPlaybackRequest(accessToken);
    }

    return {
        url: 'https://api.spotify.com/v1/me/player',
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }
    };
}

/**
 * PURE: Processes HTTP response for current playback requests
 * 
 * Handles Spotify-specific response patterns:
 * - 200 OK: Returns parsed JSON data
 * - 204 No Content: Returns null (no active playback)
 * - Error status: Returns null with error context
 * 
 * @param {Response} response - HTTP response object from fetch
 * @param {Object} responseData - Parsed JSON response data (or null)
 * @returns {*} Processed playback data, null for no playback/errors
 * @throws {never} Pure function - handles all error cases gracefully
 */
function processCurrentPlaybackResponse(response, responseData) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processCurrentPlaybackResponse) {
        return SpotifyApiResponseProcessors.processCurrentPlaybackResponse(response, responseData);
    }

    if (response.ok) {
        return responseData; // Can be null for empty response
    } else if (response.status === 204) {
        // 204 No Content indicates no active playback session
        return null;
    } else {
        // All other error cases return null
        return null;
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
async function getCurrentPlaybackCore(dependencies, accessToken) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getCurrentPlaybackCore) {
        return SpotifyApiCore.getCurrentPlaybackCore(dependencies, accessToken);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getCurrentPlaybackCore() which performs side effects
 * - Indirectly performs network requests, caching, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object|null>} Current playback state or null if no active playback
 */
async function getCurrentPlayback(accessToken) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getCurrentPlaybackCore(dependencies, accessToken);
}

/**
 * PURE: Builds HTTP request configuration for user profile endpoint
 * 
 * Creates standardized request structure:
 * - Spotify Web API user profile endpoint URL
 * - Authorization headers with Bearer token
 * - GET method configuration
 * 
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Object} Complete fetch request configuration
 * @throws {never} Pure function - deterministic output for given inputs
 */
function buildUserProfileRequest(accessToken) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildUserProfileRequest) {
        return SpotifyApiRequestBuilders.buildUserProfileRequest(accessToken);
    }

    return {
        url: 'https://api.spotify.com/v1/me',
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }
    };
}

/**
 * PURE: Processes HTTP response for user profile requests
 * 
 * Handles standard HTTP response patterns:
 * - 200 OK: Returns parsed JSON user data
 * - Error status: Returns error information for handling
 * - Validates response structure and data integrity
 * 
 * @param {Response} response - HTTP response object from fetch
 * @param {Object} responseData - Parsed JSON response data
 * @returns {Object} Processed result with success flag and data/error
 * @throws {never} Pure function - handles all error cases gracefully
 */
function processUserProfileResponse(response, responseData) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processUserProfileResponse) {
        return SpotifyApiResponseProcessors.processUserProfileResponse(response, responseData);
    }

    if (response.ok) {
        return {
            success: true,
            data: responseData
        };
    } else {
        return {
            success: false,
            error: `Failed to get user profile: ${response.status}`,
            statusCode: response.status
        };
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
async function getUserProfileCore(dependencies, accessToken) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getUserProfileCore) {
        return SpotifyApiCore.getUserProfileCore(dependencies, accessToken);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getUserProfileCore() which performs side effects
 * - Indirectly performs network requests, UI updates, and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object>} User profile data from Spotify API
 * @throws {Error} Propagates errors from core function
 */
async function getUserProfile(accessToken) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getUserProfileCore(dependencies, accessToken);
}

/**
 * PURE: Checks if token is still valid based on current time
 * 
 * Core expiry logic:
 * - Compares current time against token expiry
 * - Pure time-based calculation
 * - Deterministic given same inputs
 * 
 * @param {number} currentTime - Current timestamp (e.g., from Date.now())
 * @param {number} expiryTime - Token expiry timestamp
 * @returns {boolean} True if token is still valid, false if expired
 * @throws {never} Pure function - deterministic comparison
 */
function checkTokenExpiry(currentTime, expiryTime) {
    // Delegate to extracted utilities class when available
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.checkTokenExpiry) {
        return SpotifyApiUtilities.checkTokenExpiry(currentTime, expiryTime);
    }

    return currentTime < expiryTime;
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
function isTokenValidCore(dependencies) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.isTokenValidCore) {
        return SpotifyApiCore.isTokenValidCore(dependencies);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to isTokenValidCore() which performs side effects
 * - Indirectly reads from localStorage and accesses Date.now()
 * 
 * @returns {boolean} True if token exists and is valid, false otherwise
 */
function isTokenValid() {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return isTokenValidCore(dependencies);
}

/**
 * PURE: Conditional token retrieval logic
 * 
 * Core conditional logic:
 * - Returns token if validation indicates it's valid
 * - Returns null if token is invalid or missing
 * - Pure conditional flow with no side effects
 * 
 * @param {boolean} isValid - Token validation status
 * @param {string|null} token - Access token value
 * @returns {string|null} Valid token or null
 * @throws {never} Pure function - deterministic conditional logic
 */
function getTokenIfValid(isValid, token) {
    // Delegate to extracted utilities class when available
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.getTokenIfValid) {
        return SpotifyApiUtilities.getTokenIfValid(isValid, token);
    }

    return isValid ? token : null;
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
function getValidAccessTokenCore(dependencies) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getValidAccessTokenCore) {
        return SpotifyApiCore.getValidAccessTokenCore(dependencies);
    }

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
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getValidAccessTokenCore() which performs side effects
 * - Transitively calls isTokenValidCore() with localStorage and Date.now()
 * 
 * @returns {string|null} Valid access token or null if invalid/missing
 */
function getValidAccessToken() {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getValidAccessTokenCore(dependencies);
}

// Development helper: Set mock token directly
function setMockToken(mockToken = 'mock_access_token_for_development', expiryHours = 1) {
    // Delegate to extracted utilities class when available
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.setMockToken) {
        return SpotifyApiUtilities.setMockToken(mockToken, expiryHours);
    }

    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Use SpotifyApiUtilities.setMockTokenCore if available, otherwise fallback
    if (typeof SpotifyApiUtilities !== 'undefined' && SpotifyApiUtilities && SpotifyApiUtilities.setMockTokenCore) {
        return SpotifyApiUtilities.setMockTokenCore(dependencies, mockToken, expiryHours);
    }
    
    // Fallback implementation
    const { setStorageItem, getCurrentTime } = dependencies;
    const currentTime = getCurrentTime();
    const expiryTime = currentTime + (expiryHours * 60 * 60 * 1000);
    
    setStorageItem('spotify_access_token', mockToken);
    setStorageItem('spotify_token_expiry', expiryTime.toString());
    
    console.log(`Mock token set with ${expiryHours} hour(s) expiry`);
    return {
        token: mockToken,
        expiry: expiryTime,
        valid: true
    };
}

/**
 * PURE: Builds HTTP request configuration for user playlists endpoint
 * 
 * Creates standardized request structure:
 * - Spotify Web API playlists endpoint URL with query parameters
 * - Authorization headers with Bearer token
 * - GET method configuration
 * 
 * @param {string} accessToken - Valid Spotify access token
 * @param {number} limit - Number of playlists to return
 * @returns {Object} Complete fetch request configuration
 * @throws {never} Pure function - deterministic output for given inputs
 */
function buildPlaylistsRequest(accessToken, limit) {
    if (typeof SpotifyApiRequestBuilders !== 'undefined' && SpotifyApiRequestBuilders && SpotifyApiRequestBuilders.buildPlaylistsRequest) {
        return SpotifyApiRequestBuilders.buildPlaylistsRequest(accessToken, limit);
    }

    return {
        url: `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
        options: {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }
    };
}

/**
 * PURE: Processes HTTP response for user playlists requests
 * 
 * Handles standard HTTP response patterns:
 * - 200 OK: Returns playlist items array from response data
 * - Error status: Returns error information for handling
 * - Validates response structure and data integrity
 * 
 * @param {Response} response - HTTP response object from fetch
 * @param {Object} responseData - Parsed JSON response data
 * @returns {Object} Processed result with success flag and data/error
 * @throws {never} Pure function - handles all error cases gracefully
 */
function processPlaylistsResponse(response, responseData) {
    if (typeof SpotifyApiResponseProcessors !== 'undefined' && SpotifyApiResponseProcessors && SpotifyApiResponseProcessors.processPlaylistsResponse) {
        return SpotifyApiResponseProcessors.processPlaylistsResponse(response, responseData);
    }

    if (response.ok) {
        // Return playlist items array, or empty array if items is missing
        return {
            success: true,
            data: responseData?.items || []
        };
    } else {
        return {
            success: false,
            error: `Failed to get playlists: ${response.status}`,
            statusCode: response.status
        };
    }
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
async function getUserPlaylistsCore(dependencies, accessToken, limit = 20) {
    if (typeof SpotifyApiCore !== 'undefined' && SpotifyApiCore && SpotifyApiCore.getUserPlaylistsCore) {
        return SpotifyApiCore.getUserPlaylistsCore(dependencies, accessToken, limit);
    }

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

/**
 * Legacy wrapper function for backward compatibility
 * Maintains existing API while using dependency injection internally
 * 
 * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
 * but serves as a "progressive disclosure" pattern providing:
 * - Simple API for basic usage (legacy compatibility)
 * - Zero breaking changes for existing code
 * - Default browser environment configuration
 * - Facade over complex dependency injection architecture
 * 
 * Impurity sources:
 * - Calls createDefaultDependencies() which accesses global state
 * - Delegates to getUserPlaylistsCore() which performs side effects
 * - Indirectly performs network requests and logging operations
 * 
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Number of playlists to return (default: 20)
 * @returns {Promise<Array>} Array of playlist objects or empty array on error
 */
async function getUserPlaylists(accessToken, limit = 20) {
    // IMPURE: Factory function that reads from global browser state
    const dependencies = createDefaultDependencies();
    
    // IMPURE: Orchestration function with side effects
    return getUserPlaylistsCore(dependencies, accessToken, limit);
}