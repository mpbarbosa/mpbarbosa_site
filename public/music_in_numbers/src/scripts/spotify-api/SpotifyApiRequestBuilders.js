/**
 * SpotifyApiRequestBuilders - Pure request building functions for Spotify API
 * 
 * This class contains all request building and data creation logic as static methods.
 * All methods are PURE functions for maximum testability and reusability.
 * No side effects, no external dependencies, deterministic outputs.
 */
class SpotifyApiRequestBuilders {
    static BASE_URL = 'https://api.spotify.com/v1';
    static AUTH_URL = 'https://accounts.spotify.com';

    /**
     * PURE: Builds Spotify authorization URL
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
        
        return `${this.AUTH_URL}/authorize?${params.toString()}`;
    }

    /**
     * PURE: Creates auth session data
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
     * PURE: Builds token exchange request parameters
     * @param {Object} params - Token exchange parameters
     * @param {string} params.clientId - Spotify client ID
     * @param {string} params.authCode - Authorization code
     * @param {string} params.redirectUri - Redirect URI
     * @param {string} params.codeVerifier - PKCE code verifier
     * @returns {Object} Request configuration object
     */
    static buildTokenExchangeRequest({ clientId, authCode, redirectUri, codeVerifier }) {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier
        });

        return {
            url: `${this.AUTH_URL}/api/token`,
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString()
            }
        };
    }

    /**
     * PURE: Creates token storage data
     * @param {Object} tokenResponse - Response from Spotify token endpoint
     * @param {string} tokenResponse.access_token - Access token
     * @param {number} tokenResponse.expires_in - Token expiry in seconds
     * @returns {Object} Storage data to persist
     */
    static createTokenStorageData(tokenResponse) {
        return {
            spotify_access_token: tokenResponse.access_token,
            spotify_token_expiry: (Date.now() + (tokenResponse.expires_in * 1000)).toString()
        };
    }

    /**
     * PURE: Builds authorization headers
     * @param {string} accessToken - Spotify access token
     * @returns {Object} Headers object with authorization
     */
    static buildAuthHeaders(accessToken) {
        return {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * PURE: Builds audio features API request configuration
     * @param {string} accessToken - Validated access token
     * @param {Array} trackIds - Validated array of track IDs
     * @returns {Object} Request configuration object
     */
    static buildAudioFeaturesRequest(accessToken, trackIds) {
        const ids = trackIds.join(',');
        return {
            url: `${this.BASE_URL}/audio-features?ids=${ids}`,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            },
            cacheKey: `audio_features_${ids.slice(0, 50)}${ids.length > 50 ? '...' : ''}` // Shortened key for long IDs
        };
    }

    /**
     * PURE: Builds top tracks API request configuration
     * @param {string} accessToken - Validated access token
     * @param {string} timeRange - Validated time range
     * @param {number} limit - Validated limit
     * @returns {Object} Request configuration object
     */
    static buildTopTracksRequest(accessToken, timeRange, limit) {
        return {
            url: `${this.BASE_URL}/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            },
            cacheKey: `top_tracks_${timeRange}_${limit}`
        };
    }

    /**
     * PURE: Builds top artists API request configuration
     * @param {string} accessToken - Validated access token
     * @param {string} timeRange - Validated time range
     * @param {number} limit - Validated limit
     * @returns {Object} Request configuration object
     */
    static buildTopArtistsRequest(accessToken, timeRange, limit) {
        return {
            url: `${this.BASE_URL}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
            options: {
                method: 'GET',
                headers: this.buildAuthHeaders(accessToken)
            },
            cacheKey: `top_artists_${timeRange}_${limit}`
        };
    }

    /**
     * PURE: Builds recently played tracks API request configuration
     * @param {string} accessToken - Validated access token
     * @param {number} limit - Validated limit
     * @returns {Object} Request configuration object
     */
    static buildRecentlyPlayedRequest(accessToken, limit) {
        return {
            url: `${this.BASE_URL}/me/player/recently-played?limit=${limit}`,
            options: {
                method: 'GET',
                headers: this.buildAuthHeaders(accessToken)
            },
            cacheKey: `recently_played_${limit}`
        };
    }

    /**
     * PURE: Builds current playback API request configuration
     * @param {string} accessToken - Validated access token
     * @returns {Object} Request configuration object
     */
    static buildCurrentPlaybackRequest(accessToken) {
        return {
            url: `${this.BASE_URL}/me/player`,
            options: {
                method: 'GET',
                headers: this.buildAuthHeaders(accessToken)
            }
        };
    }

    /**
     * PURE: Builds user profile API request configuration
     * @param {string} accessToken - Validated access token
     * @returns {Object} Request configuration object
     */
    static buildUserProfileRequest(accessToken) {
        return {
            url: `${this.BASE_URL}/me`,
            options: {
                method: 'GET',
                headers: this.buildAuthHeaders(accessToken)
            }
        };
    }

    /**
     * PURE: Builds playlists API request configuration
     * @param {string} accessToken - Validated access token
     * @param {number} limit - Validated limit
     * @returns {Object} Request configuration object
     */
    static buildPlaylistsRequest(accessToken, limit) {
        return {
            url: `${this.BASE_URL}/me/playlists?limit=${limit}`,
            options: {
                method: 'GET',
                headers: this.buildAuthHeaders(accessToken)
            }
        };
    }
}

// Export for both CommonJS and ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyApiRequestBuilders;
}

// For browser/ES6 environments
if (typeof window !== 'undefined') {
    window.SpotifyApiRequestBuilders = SpotifyApiRequestBuilders;
}