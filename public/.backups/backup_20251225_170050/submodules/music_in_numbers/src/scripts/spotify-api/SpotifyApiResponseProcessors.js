/**
 * SpotifyApiResponseProcessors - Pure response processing functions for Spotify API
 * 
 * This class contains all response processing logic as static methods.
 * All methods are PURE functions for maximum testability and reusability.
 * No side effects, no external dependencies, deterministic outputs.
 */
class SpotifyApiResponseProcessors {

    /**
     * PURE: Processes audio features API response
     * @param {Response} response - Fetch API response object
     * @param {Object} data - Parsed JSON response data
     * @returns {Object} Processed result with success status and audio features
     */
    static processAudioFeaturesResponse(response, data) {
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
     * PURE: Processes top tracks API response
     * @param {Response} response - Fetch API response object
     * @param {Object} data - Parsed JSON response data
     * @returns {Object} Processed result with success status and tracks
     */
    static processTopTracksResponse(response, data) {
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
     * PURE: Processes top artists API response
     * @param {Response} response - Fetch API response object
     * @param {Object} data - Parsed JSON response data
     * @returns {Object} Processed result with success status and artists
     */
    static processTopArtistsResponse(response, data) {
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
     * PURE: Processes recently played tracks API response
     * @param {Response} response - Fetch API response object
     * @param {Object} data - Parsed JSON response data
     * @returns {Object} Processed result with success status and tracks
     */
    static processRecentlyPlayedResponse(response, data) {
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
     * PURE: Processes current playback API response
     * Handles Spotify-specific response patterns:
     * - 200 OK: Returns parsed JSON data
     * - 204 No Content: Returns null (no active playback)
     * - Error status: Returns null with error context
     * @param {Response} response - HTTP response object from fetch
     * @param {Object} responseData - Parsed JSON response data (or null)
     * @returns {*} Processed playback data, null for no playback/errors
     */
    static processCurrentPlaybackResponse(response, responseData) {
        if (response.ok) {
            return responseData; // Can be null for empty response
        } else if (response.status === 204) {
            return null; // No content - no active playback
        } else {
            return null; // Error case
        }
    }

    /**
     * PURE: Processes user profile API response
     * @param {Response} response - HTTP response object from fetch
     * @param {Object} responseData - Parsed JSON response data
     * @returns {Object} Processed result with success flag and data/error
     */
    static processUserProfileResponse(response, responseData) {
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
     * PURE: Processes user playlists API response
     * @param {Response} response - HTTP response object from fetch
     * @param {Object} responseData - Parsed JSON response data
     * @returns {Object} Processed result with success flag and data/error
     */
    static processPlaylistsResponse(response, responseData) {
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
}

// Export for both CommonJS and ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyApiResponseProcessors;
}

// For browser/ES6 environments
if (typeof window !== 'undefined') {
    window.SpotifyApiResponseProcessors = SpotifyApiResponseProcessors;
}