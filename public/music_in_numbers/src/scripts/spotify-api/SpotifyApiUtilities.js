/**
 * SpotifyApiUtilities - Utility functions and dependency injection for Spotify API
 * 
 * This class contains utility functions that support the Spotify API implementation:
 * - Dependency injection factory for browser environment
 * - Pure helper functions for common operations
 * - Development utilities and mock functions
 * - Time-based utility functions
 * 
 * Functions in this class include both PURE and IMPURE functions:
 * - Pure functions: deterministic utilities with no side effects
 * - Impure functions: dependency factories that access global state
 * 
 * Note: This is the final utility class in the modular architecture
 */
class SpotifyApiUtilities {
    
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
    static createDefaultDependencies() {
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
            
            // SESSION OPTIMIZATION: Spotify session detection and reuse
            sessionDetector: (typeof SpotifySessionDetector !== 'undefined') ? SpotifySessionDetector : null,
            
            // CORE FUNCTIONS: References to core API functions for session reuse
            exchangeCodeForTokenCore: (typeof SpotifyApiCore !== 'undefined') ? SpotifyApiCore.exchangeCodeForTokenCore.bind(SpotifyApiCore) : null,
            
            // SIDE EFFECT: Navigation function that modifies browser location
            navigate: (url) => { window.location.href = url; },
            
            // TIME-DEPENDENT: Current URL can change between calls
            getRedirectUri: () => window.location.href.split('?')[0]
        };
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
    static buildAuthUrl({ clientId, redirectUri, codeChallenge, state }) {
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
    static createAuthSession(clientId, codeVerifier) {
        return {
            spotify_code_verifier: codeVerifier,
            spotify_client_id: clientId,
            spotify_auth_timestamp: Date.now().toString()
        };
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
    static checkTokenExpiry(currentTime, expiryTime) {
        return currentTime < expiryTime;
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
    static getTokenIfValid(isValid, token) {
        return isValid ? token : null;
    }

    /**
     * IMPURE: Core function for setting mock token (development utility)
     * 
     * Development helper function for testing:
     * - Sets a mock access token in localStorage
     * - Sets a future expiry time for token validity
     * - Uses dependency injection for storage operations
     * 
     * Side effects performed:
     * - Writing to localStorage (storage modification)
     * - Setting current time + offset for expiry calculation
     * 
     * @param {Object} dependencies - Injected dependencies container
     * @param {Function} dependencies.setStorageItem - Storage write function
     * @param {Function} dependencies.getCurrentTime - Time provider function
     * @param {string} mockToken - Mock access token to set (optional)
     * @param {number} expiryHours - Hours until token expires (default: 1)
     */
    static setMockTokenCore(dependencies, mockToken = 'mock_access_token_for_development', expiryHours = 1) {
        const { setStorageItem, getCurrentTime } = dependencies;
        
        // IMPURE: Get current time
        const currentTime = getCurrentTime();
        
        // PURE: Calculate expiry time
        const expiryTime = currentTime + (expiryHours * 60 * 60 * 1000); // Convert hours to milliseconds
        
        // IMPURE: Write mock data to storage
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
     * Legacy wrapper for mock token setting
     * 
     * NOTE: This function is NOT pure (transitively inherits impurity from called functions)
     * Development utility that:
     * - Provides simple API for setting mock tokens
     * - Uses default browser environment dependencies
     * - Facilitates testing and development workflows
     * 
     * Impurity sources:
     * - Calls createDefaultDependencies() which accesses global state
     * - Delegates to setMockTokenCore() which performs storage side effects
     * 
     * @param {string} mockToken - Mock access token to set (optional)
     * @param {number} expiryHours - Hours until token expires (default: 1)
     * @returns {Object} Mock token information
     */
    static setMockToken(mockToken = 'mock_access_token_for_development', expiryHours = 1) {
        // IMPURE: Factory function that reads from global browser state
        const dependencies = SpotifyApiUtilities.createDefaultDependencies();
        
        // IMPURE: Orchestration function with side effects
        return SpotifyApiUtilities.setMockTokenCore(dependencies, mockToken, expiryHours);
    }

    /**
     * PURE: Validates URL format for redirect URIs
     * 
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is valid, false otherwise
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * PURE: Generates cache key for API requests
     * 
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Request parameters
     * @returns {string} Generated cache key
     */
    static generateCacheKey(endpoint, params = {}) {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        return `${endpoint}${paramString ? '?' + paramString : ''}`;
    }

    /**
     * PURE: Formats timestamp to ISO string
     * 
     * @param {number} timestamp - Unix timestamp
     * @returns {string} ISO formatted date string
     */
    static formatTimestamp(timestamp) {
        return new Date(timestamp).toISOString();
    }

    /**
     * PURE: Calculates time remaining until expiry
     * 
     * @param {number} expiryTime - Token expiry timestamp
     * @param {number} currentTime - Current timestamp (optional, defaults to Date.now())
     * @returns {number} Milliseconds until expiry (negative if expired)
     */
    static getTimeUntilExpiry(expiryTime, currentTime = Date.now()) {
        return expiryTime - currentTime;
    }

    /**
     * PURE: Checks if token expires within a certain threshold
     * 
     * @param {number} expiryTime - Token expiry timestamp
     * @param {number} thresholdMinutes - Minutes before expiry to consider "expiring soon"
     * @param {number} currentTime - Current timestamp (optional)
     * @returns {boolean} True if token expires within threshold
     */
    static isTokenExpiringSoon(expiryTime, thresholdMinutes = 5, currentTime = Date.now()) {
        const thresholdMs = thresholdMinutes * 60 * 1000;
        const timeUntilExpiry = SpotifyApiUtilities.getTimeUntilExpiry(expiryTime, currentTime);
        return timeUntilExpiry <= thresholdMs && timeUntilExpiry > 0;
    }

    /**
     * PURE: Truncates string to maximum length with ellipsis
     * 
     * @param {string} str - String to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated string
     */
    static truncateString(str, maxLength = 50) {
        if (!str || str.length <= maxLength) {
            return str || '';
        }
        return str.slice(0, maxLength - 3) + '...';
    }

    /**
     * PURE: Sanitizes string for use in cache keys or URLs
     * 
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeForKey(str) {
        return str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyApiUtilities;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.SpotifyApiUtilities = SpotifyApiUtilities;
}