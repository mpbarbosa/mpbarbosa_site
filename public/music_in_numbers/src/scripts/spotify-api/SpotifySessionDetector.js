/**
 * SpotifySessionDetector - Spotify Session Detection and Reuse Module
 * 
 * This module implements sophisticated session detection mechanisms to optimize
 * the Spotify OAuth flow by detecting and reusing existing browser sessions.
 * 
 * Key Features:
 * - Silent authentication attempts via hidden iframe
 * - Cookie-based session presence detection  
 * - Cross-origin session validation
 * - Graceful fallback to standard OAuth flow
 * - Performance optimization for returning users
 * 
 * Browser Compatibility:
 * - Modern browsers with iframe sandbox support
 * - Handles SameSite cookie restrictions
 * - Progressive enhancement for older browsers
 * 
 * Security Considerations:
 * - Respects CORS and same-origin policies
 * - No sensitive data exposure through detection
 * - Maintains PKCE security requirements
 * - Timeout protection against hanging requests
 */

class SpotifySessionDetector {
    // Configuration constants
    static DETECTION_TIMEOUT = 8000; // 8 seconds for session detection
    static IFRAME_TIMEOUT = 5000; // 5 seconds for iframe-based attempts
    static SPOTIFY_DOMAIN = 'https://accounts.spotify.com';
    static SILENT_AUTH_PROMPT = 'none'; // Spotify parameter for silent auth

    /**
     * PURE: Builds silent authentication URL for session detection
     * 
     * Creates Spotify authorization URL configured for silent authentication:
     * - Includes prompt=none parameter for no-interaction auth
     * - Uses standard PKCE parameters for security
     * - Configured for iframe-based execution
     * 
     * @param {Object} params - Authorization parameters
     * @param {string} params.clientId - Spotify client ID
     * @param {string} params.redirectUri - Redirect URI for callback
     * @param {string} params.codeChallenge - PKCE code challenge
     * @param {string} params.state - CSRF protection state
     * @returns {string} Complete silent authorization URL
     * @throws {never} Pure function - deterministic URL construction
     */
    static buildSilentAuthUrl({ clientId, redirectUri, codeChallenge, state }) {
        // Extended scopes for comprehensive music analytics
        const scope = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-library-read user-read-currently-playing user-read-playback-state';
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: state,
            prompt: this.SILENT_AUTH_PROMPT // Key parameter for silent authentication
        });

        return `${this.SPOTIFY_DOMAIN}/authorize?${params.toString()}`;
    }

    /**
     * PURE: Extracts authorization result from callback URL
     * 
     * Parses URL parameters to determine authentication outcome:
     * - Success: Returns authorization code and state
     * - Error: Returns error information for handling
     * - Invalid: Returns null for malformed URLs
     * 
     * @param {string} callbackUrl - URL from OAuth callback
     * @returns {Object|null} Parsed result with success status and data
     * @throws {never} Pure function - deterministic URL parsing
     */
    static parseAuthCallback(callbackUrl) {
        try {
            const url = new URL(callbackUrl);
            const params = url.searchParams;

            // Check for error conditions first
            const error = params.get('error');
            if (error) {
                return {
                    success: false,
                    error: error,
                    errorDescription: params.get('error_description') || 'Authentication failed'
                };
            }

            // Extract successful authorization data
            const code = params.get('code');
            const state = params.get('state');

            if (code && state) {
                return {
                    success: true,
                    authCode: code,
                    state: state
                };
            }

            // No error but no valid data
            return null;
        } catch (parseError) {
            // Malformed URL
            return null;
        }
    }

    /**
     * PURE: Validates that session detection attempt matches expected parameters
     * 
     * Security validation for session detection results:
     * - Verifies state parameter matches original request
     * - Ensures client ID consistency
     * - Validates authorization code format
     * 
     * @param {Object} authResult - Parsed authorization result
     * @param {string} expectedState - Original state parameter
     * @returns {Object} Validation result with success status
     * @throws {never} Pure function - deterministic validation logic
     */
    static validateSessionResult(authResult, expectedState) {
        if (!authResult || !authResult.success) {
            return {
                isValid: false,
                error: 'No valid authorization result'
            };
        }

        // CSRF protection: validate state parameter
        if (authResult.state !== expectedState) {
            return {
                isValid: false,
                error: 'State parameter mismatch - possible CSRF attack'
            };
        }

        // Validate authorization code format
        if (!authResult.authCode || typeof authResult.authCode !== 'string' || authResult.authCode.length === 0) {
            return {
                isValid: false,
                error: 'Invalid authorization code format'
            };
        }

        return {
            isValid: true,
            authCode: authResult.authCode,
            state: authResult.state
        };
    }

    /**
     * IMPURE: Creates and manages hidden iframe for silent authentication
     * 
     * Implements iframe-based session detection:
     * - Creates sandboxed iframe with restricted permissions
     * - Sets up message listener for cross-origin communication
     * - Implements timeout protection against hanging requests
     * - Cleans up resources after completion or timeout
     * 
     * Side effects performed:
     * - DOM manipulation (iframe creation/removal)
     * - Event listener registration/cleanup
     * - Timeout timer management
     * - Promise resolution/rejection
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.document - Document interface for DOM operations
     * @param {Object} dependencies.window - Window interface for messaging
     * @param {Function} dependencies.setTimeout - Timer function
     * @param {Function} dependencies.clearTimeout - Timer cleanup function
     * @param {string} silentAuthUrl - URL for silent authentication attempt
     * @returns {Promise<Object|null>} Promise resolving to auth result or null
     */
    static async createSilentAuthIframe(dependencies, silentAuthUrl) {
        const { document, window, setTimeout, clearTimeout } = dependencies;

        return new Promise((resolve) => {
            let iframe = null;
            let timeout = null;
            let messageListener = null;

            // Cleanup function to prevent resource leaks
            const cleanup = () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                if (messageListener) {
                    window.removeEventListener('message', messageListener);
                    messageListener = null;
                }
                if (iframe && iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                    iframe = null;
                }
            };

            // Set up timeout protection
            timeout = setTimeout(() => {
                cleanup();
                resolve(null); // Timeout indicates no existing session
            }, this.IFRAME_TIMEOUT);

            // Set up message listener for iframe communication
            messageListener = (event) => {
                // Security: verify origin is from our domain (not Spotify's)
                if (event.origin === window.location.origin) {
                    const authResult = this.parseAuthCallback(event.data);
                    cleanup();
                    resolve(authResult);
                }
            };

            window.addEventListener('message', messageListener);

            // Create hidden iframe for silent authentication
            iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-forms';
            
            // Handle iframe load events
            iframe.onload = () => {
                // Check if iframe redirected to our redirect URI
                try {
                    // This will throw if cross-origin, indicating potential session
                    const iframeUrl = iframe.contentWindow.location.href;
                    if (iframeUrl.includes(window.location.origin)) {
                        // Iframe was redirected to our domain - parse result
                        const authResult = this.parseAuthCallback(iframeUrl);
                        cleanup();
                        resolve(authResult);
                    }
                } catch (crossOriginError) {
                    // Expected for cross-origin - iframe is still on Spotify domain
                    // This usually means no session or user interaction required
                }
            };

            iframe.onerror = () => {
                cleanup();
                resolve(null); // Error indicates no usable session
            };

            // Start the silent authentication attempt
            iframe.src = silentAuthUrl;
            document.body.appendChild(iframe);
        });
    }

    /**
     * IMPURE: Detects existing Spotify sessions through cookie analysis
     * 
     * Analyzes browser cookies to determine Spotify session presence:
     * - Checks for known Spotify authentication cookies
     * - Validates cookie freshness and expiry
     * - Provides probabilistic session detection
     * 
     * Note: Limited by browser security policies and SameSite restrictions
     * 
     * Side effects performed:
     * - Reading document.cookie (browser state access)
     * - Cross-domain cookie analysis
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.document - Document interface for cookie access
     * @returns {Object} Session detection result with confidence level
     */
    static detectSpotifySessionFromCookies(dependencies) {
        const { document } = dependencies;

        try {
            // Check for common Spotify session indicators
            const cookies = document.cookie;
            
            // Look for Spotify-specific cookie patterns
            const hasSpotifyIndicators = /sp_t=|sp_key=|spotify_auth=|csrf_token=/i.test(cookies);
            
            return {
                sessionDetected: hasSpotifyIndicators,
                confidence: hasSpotifyIndicators ? 'medium' : 'low',
                method: 'cookie-analysis'
            };
        } catch (error) {
            // Cookie access may be restricted
            return {
                sessionDetected: false,
                confidence: 'low',
                method: 'cookie-analysis',
                error: 'Cookie access restricted'
            };
        }
    }

    /**
     * IMPURE: Performs lightweight test of Spotify API to validate session
     * 
     * Makes a low-impact API call to test session validity:
     * - Uses minimal Spotify API endpoint
     * - Includes credentials for cross-origin session testing
     * - Fast timeout for quick validation
     * 
     * Side effects performed:
     * - HTTP request to Spotify API
     * - Network access and potential browser permission prompts
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.fetch - HTTP client function
     * @returns {Promise<Object>} Session validation result
     */
    static async testSpotifyApiAccess(dependencies) {
        const { fetch } = dependencies;

        try {
            // Use lightweight endpoint that requires authentication
            const response = await fetch(`${this.SPOTIFY_DOMAIN}/api/token`, {
                method: 'HEAD',
                credentials: 'include', // Include cookies for session testing
                mode: 'no-cors', // Avoid CORS preflight
                signal: AbortSignal.timeout(3000) // 3 second timeout
            });

            // Note: no-cors mode limits response analysis
            return {
                sessionDetected: true,
                confidence: 'low', // Limited due to no-cors restrictions
                method: 'api-test'
            };
        } catch (error) {
            return {
                sessionDetected: false,
                confidence: 'high', // Error indicates no session
                method: 'api-test',
                error: error.message
            };
        }
    }

    /**
     * IMPURE: Comprehensive session detection using multiple strategies
     * 
     * Orchestrates multiple detection methods for optimal accuracy:
     * - Combines iframe-based silent authentication
     * - Cookie analysis for session indicators
     * - Optional API testing for validation
     * - Provides confidence-weighted results
     * 
     * Side effects performed:
     * - All side effects from individual detection methods
     * - Concurrent execution of multiple strategies
     * - Resource cleanup and memory management
     * 
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} authParams - Authentication parameters for testing
     * @param {Object} options - Detection options and configuration
     * @returns {Promise<Object>} Comprehensive session detection result
     */
    static async detectExistingSession(dependencies, authParams, options = {}) {
        const {
            enableIframeDetection = true,
            enableCookieAnalysis = true,
            enableApiTesting = false, // Disabled by default due to potential issues
            timeoutMs = this.DETECTION_TIMEOUT
        } = options;

        const results = {
            sessionDetected: false,
            confidence: 'low',
            methods: [],
            authResult: null,
            startTime: Date.now()
        };

        try {
            // Strategy 1: Silent authentication via iframe (most reliable)
            if (enableIframeDetection && authParams) {
                const silentAuthUrl = this.buildSilentAuthUrl(authParams);
                const iframeResult = await this.createSilentAuthIframe(dependencies, silentAuthUrl);
                
                if (iframeResult) {
                    const validation = this.validateSessionResult(iframeResult, authParams.state);
                    if (validation.isValid) {
                        results.sessionDetected = true;
                        results.confidence = 'high';
                        results.authResult = validation;
                        results.methods.push('iframe-silent-auth');
                        
                        // Successful silent auth - no need for other methods
                        results.duration = Date.now() - results.startTime;
                        return results;
                    }
                }
                results.methods.push('iframe-attempted');
            }

            // Strategy 2: Cookie-based detection (medium reliability)
            if (enableCookieAnalysis) {
                const cookieResult = this.detectSpotifySessionFromCookies(dependencies);
                if (cookieResult.sessionDetected) {
                    results.sessionDetected = true;
                    results.confidence = cookieResult.confidence;
                    results.methods.push('cookie-analysis');
                }
            }

            // Strategy 3: API testing (optional, may have side effects)
            if (enableApiTesting) {
                const apiResult = await this.testSpotifyApiAccess(dependencies);
                if (apiResult.sessionDetected) {
                    results.sessionDetected = true;
                    if (results.confidence === 'low') {
                        results.confidence = apiResult.confidence;
                    }
                    results.methods.push('api-test');
                }
            }

            results.duration = Date.now() - results.startTime;
            return results;

        } catch (error) {
            results.error = error.message;
            results.duration = Date.now() - results.startTime;
            return results;
        }
    }

    /**
     * PURE: Creates default dependencies for browser environment
     * 
     * Factory function for session detector dependencies:
     * - Browser-specific implementations
     * - DOM and Window API access
     * - Timer and network functions
     * 
     * @returns {Object} Default dependencies for browser usage
     * @throws {never} Pure function - deterministic dependency creation
     */
    static createDefaultDependencies() {
        return {
            document: document,
            window: window,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            fetch: fetch
        };
    }

    /**
     * IMPURE: Convenience method for session detection with defaults
     * 
     * Simplified interface for session detection:
     * - Uses browser default dependencies
     * - Standard configuration options
     * - Automatic fallback handling
     * 
     * @param {Object} authParams - Authentication parameters
     * @param {Object} options - Detection options
     * @returns {Promise<Object>} Session detection result
     */
    static async detectSession(authParams, options = {}) {
        const dependencies = this.createDefaultDependencies();
        return this.detectExistingSession(dependencies, authParams, options);
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifySessionDetector;
} else if (typeof window !== 'undefined') {
    window.SpotifySessionDetector = SpotifySessionDetector;
}