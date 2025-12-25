/**
 * SpotifyApiValidators - Pure validation functions for Spotify API
 * 
 * This class contains all validation logic as static methods.
 * All methods are PURE functions for maximum testability and reusability.
 * No side effects, no external dependencies, deterministic outputs.
 */
class SpotifyApiValidators {
    /**
     * PURE: Validates Spotify Client ID
     * @param {string} clientId - The client ID to validate
     * @returns {Object} Validation result with isValid boolean and error message
     */
    static validateClientId(clientId) {
        // Check if clientId is null, undefined, or not a string
        if (!clientId || typeof clientId !== 'string') {
            return {
                isValid: false,
                error: 'Please enter your Client ID'
            };
        }
        
        // Remove leading and trailing whitespace
        const trimmedId = clientId.trim();
        
        // Check if string is empty after trimming whitespace
        if (!trimmedId) {
            return {
                isValid: false,
                error: 'Please enter your Client ID'
            };
        }
        
        // Validate Spotify Client ID format:
        // - Must be exactly 32 characters long
        // - Must contain only hexadecimal characters (0-9, a-f, A-F)
        if (trimmedId.length !== 32 || !/^[a-f0-9]+$/i.test(trimmedId)) {
            return {
                isValid: false,
                error: 'Client ID should be a 32-character hexadecimal string'
            };
        }
        
        // All validations passed - return success with cleaned clientId
        return {
            isValid: true,
            clientId: trimmedId
        };
    }

    /**
     * PURE: Validates Spotify access token
     * @param {string} accessToken - The access token to validate
     * @returns {Object} Validation result with isValid boolean and error message
     */
    static validateAccessToken(accessToken) {
        if (typeof accessToken !== 'string' || accessToken.trim() === '') {
            return { isValid: false, error: 'Access token must be a non-empty string' };
        }
        return { isValid: true, token: accessToken.trim() };
    }

    /**
     * PURE: Validates limit parameter for API calls
     * @param {number} limit - Limit value to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {Object} Validation result
     */
    static validateLimit(limit, min = 1, max = 50) {
        const numLimit = Number(limit);
        if (isNaN(numLimit) || numLimit < min || numLimit > max) {
            return { isValid: false, error: `Limit must be between ${min} and ${max}` };
        }
        return { isValid: true, limit: numLimit };
    }

    /**
     * PURE: Validates time range parameter
     * @param {string} timeRange - Time range to validate
     * @returns {Object} Validation result
     */
    static validateTimeRange(timeRange) {
        const validRanges = ['short_term', 'medium_term', 'long_term'];
        if (!validRanges.includes(timeRange)) {
            return { isValid: false, error: `Time range must be one of: ${validRanges.join(', ')}` };
        }
        return { isValid: true, timeRange };
    }

    /**
     * PURE: Validates token exchange inputs
     * @param {string} authCode - Authorization code from Spotify
     * @param {string} clientId - Spotify client ID
     * @param {string} codeVerifier - PKCE code verifier
     * @returns {Object} Validation result
     */
    static validateTokenExchangeInputs(authCode, clientId, codeVerifier) {
        // Check authorization code
        if (!authCode || typeof authCode !== 'string' || !authCode.trim()) {
            return {
                isValid: false,
                error: 'Please enter an authorization code'
            };
        }
        
        // Check client ID
        if (!clientId || typeof clientId !== 'string' || !clientId.trim()) {
            return {
                isValid: false,
                error: 'Please enter your Client ID'
            };
        }
        
        // Check code verifier (required for PKCE flow)
        if (!codeVerifier || typeof codeVerifier !== 'string' || !codeVerifier.trim()) {
            return {
                isValid: false,
                error: 'Code verifier not found. Please initiate the auth flow again.'
            };
        }
        
        return {
            isValid: true,
            authCode: authCode.trim(),
            clientId: clientId.trim(),
            codeVerifier: codeVerifier.trim()
        };
    }

    /**
     * PURE: Validates audio features inputs
     * @param {string} accessToken - Spotify access token
     * @param {Array} trackIds - Array of track IDs
     * @returns {Object} Validation result
     */
    static validateAudioFeaturesInputs(accessToken, trackIds) {
        // Validate access token
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        // Validate track IDs
        if (!Array.isArray(trackIds)) {
            return {
                isValid: false,
                error: 'Track IDs must be provided as an array'
            };
        }
        
        if (trackIds.length === 0) {
            return {
                isValid: false,
                error: 'At least one track ID is required'
            };
        }
        
        if (trackIds.length > 100) {
            return {
                isValid: false,
                error: 'Maximum 100 track IDs allowed per request'
            };
        }
        
        // Filter out invalid track IDs
        const validTrackIds = trackIds.filter(id => 
            typeof id === 'string' && id.trim() !== ''
        );
        
        if (validTrackIds.length === 0) {
            return {
                isValid: false,
                error: 'At least one valid track ID is required'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim(),
            trackIds: validTrackIds
        };
    }

    /**
     * PURE: Validates top tracks inputs
     * @param {string} accessToken - Spotify access token
     * @param {string} timeRange - Time range for top tracks
     * @param {number} limit - Number of tracks to return
     * @returns {Object} Validation result
     */
    static validateTopTracksInputs(accessToken, timeRange, limit) {
        // Validate access token
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        // Validate time range
        const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
        if (!timeRange || !validTimeRanges.includes(timeRange)) {
            return {
                isValid: false,
                error: `Time range must be one of: ${validTimeRanges.join(', ')}`
            };
        }
        
        // Validate limit
        const numLimit = Number(limit);
        if (isNaN(numLimit) || numLimit < 1 || numLimit > 50) {
            return {
                isValid: false,
                error: 'Limit must be between 1 and 50'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim(),
            timeRange: timeRange,
            limit: numLimit
        };
    }

    /**
     * PURE: Validates top artists inputs
     * @param {string} accessToken - Spotify access token
     * @param {string} timeRange - Time range for top artists
     * @param {number} limit - Number of artists to return
     * @returns {Object} Validation result
     */
    static validateTopArtistsInputs(accessToken, timeRange, limit) {
        // Validate access token
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        // Validate time range
        const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
        if (!timeRange || !validTimeRanges.includes(timeRange)) {
            return {
                isValid: false,
                error: `Time range must be one of: ${validTimeRanges.join(', ')}`
            };
        }
        
        // Validate limit
        const numLimit = Number(limit);
        if (isNaN(numLimit) || numLimit < 1 || numLimit > 50) {
            return {
                isValid: false,
                error: 'Limit must be between 1 and 50'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim(),
            timeRange: timeRange,
            limit: numLimit
        };
    }

    /**
     * PURE: Validates recently played inputs
     * @param {string} accessToken - Spotify access token
     * @param {number} limit - Number of recently played tracks to return
     * @returns {Object} Validation result
     */
    static validateRecentlyPlayedInputs(accessToken, limit) {
        // Validate access token
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        // Validate limit
        const numLimit = Number(limit);
        if (isNaN(numLimit) || numLimit < 1 || numLimit > 50) {
            return {
                isValid: false,
                error: 'Limit must be between 1 and 50'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim(),
            limit: numLimit
        };
    }

    /**
     * PURE: Validates current playback inputs
     * @param {string} accessToken - Spotify access token
     * @returns {Object} Validation result
     */
    static validateCurrentPlaybackInputs(accessToken) {
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim()
        };
    }

    /**
     * PURE: Validates user profile inputs
     * @param {string} accessToken - Spotify access token
     * @returns {Object} Validation result
     */
    static validateUserProfileInputs(accessToken) {
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim()
        };
    }

    /**
     * PURE: Validates token data for expiry checking
     * @param {string} token - Access token
     * @param {string} expiry - Token expiry timestamp
     * @returns {Object} Validation result
     */
    static validateTokenData(token, expiry) {
        if (!token || typeof token !== 'string' || !token.trim()) {
            return {
                isValid: false,
                error: 'Token is required'
            };
        }
        
        if (!expiry || typeof expiry !== 'string' || !expiry.trim()) {
            return {
                isValid: false,
                error: 'Token expiry is required'
            };
        }
        
        const expiryTime = parseInt(expiry);
        if (isNaN(expiryTime)) {
            return {
                isValid: false,
                error: 'Invalid token expiry format'
            };
        }
        
        return {
            isValid: true,
            token: token.trim(),
            expiry: expiryTime
        };
    }

    /**
     * PURE: Validates playlists inputs
     * @param {string} accessToken - Spotify access token
     * @param {number} limit - Number of playlists to return
     * @returns {Object} Validation result
     */
    static validatePlaylistsInputs(accessToken, limit) {
        // Validate access token
        if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }
        
        // Validate limit
        const numLimit = Number(limit);
        if (isNaN(numLimit) || numLimit < 1 || numLimit > 50) {
            return {
                isValid: false,
                error: 'Limit must be between 1 and 50'
            };
        }
        
        return {
            isValid: true,
            accessToken: accessToken.trim(),
            limit: numLimit
        };
    }
}

// Export for both CommonJS and ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyApiValidators;
}

// For browser/ES6 environments
if (typeof window !== 'undefined') {
    window.SpotifyApiValidators = SpotifyApiValidators;
}