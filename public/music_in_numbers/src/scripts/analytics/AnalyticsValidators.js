/**
 * AnalyticsValidators - Pure validation functions for music analytics
 * 
 * This class contains pure validation functions for analytics parameters and data:
 * - Input data validation (tracks, audio features, time ranges)
 * - Analytics parameter validation
 * - Data structure validation
 * - Range and boundary validation
 * 
 * All functions in this class are PURE:
 * - No side effects or external dependencies
 * - Deterministic output for given inputs
 * - No DOM manipulation or API calls
 * - No global state modification
 * 
 * Validation functions return consistent format: { isValid: boolean, error?: string }
 */
class AnalyticsValidators {

    /**
     * PURE: Validates recently played tracks data structure
     * @param {Array} recentlyPlayed - Array of recently played track objects
     * @returns {Object} Validation result
     */
    static validateRecentlyPlayed(recentlyPlayed) {
        if (!recentlyPlayed) {
            return {
                isValid: false,
                error: 'Recently played data is required'
            };
        }

        if (!Array.isArray(recentlyPlayed)) {
            return {
                isValid: false,
                error: 'Recently played data must be an array'
            };
        }

        if (recentlyPlayed.length === 0) {
            return {
                isValid: false,
                error: 'No listening data available for analysis'
            };
        }

        // Validate structure of first track to ensure data integrity
        const firstTrack = recentlyPlayed[0];
        if (!firstTrack.track || !firstTrack.played_at) {
            return {
                isValid: false,
                error: 'Invalid track data structure - missing track or played_at fields'
            };
        }

        if (!firstTrack.track.artists || !Array.isArray(firstTrack.track.artists)) {
            return {
                isValid: false,
                error: 'Invalid track data structure - missing or invalid artists array'
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates audio features data array
     * @param {Array} audioFeatures - Array of audio feature objects
     * @returns {Object} Validation result
     */
    static validateAudioFeatures(audioFeatures) {
        if (!audioFeatures) {
            return {
                isValid: false,
                error: 'Audio features data is required'
            };
        }

        if (!Array.isArray(audioFeatures)) {
            return {
                isValid: false,
                error: 'Audio features must be an array'
            };
        }

        // Audio features can be empty array - that's valid
        if (audioFeatures.length === 0) {
            return { isValid: true };
        }

        // Validate structure of first audio feature if available
        const firstFeature = audioFeatures.find(feature => feature !== null);
        if (firstFeature) {
            const requiredFields = ['valence', 'energy', 'danceability', 'acousticness'];
            const missingFields = requiredFields.filter(field => 
                typeof firstFeature[field] !== 'number' || 
                firstFeature[field] < 0 || 
                firstFeature[field] > 1
            );

            if (missingFields.length > 0) {
                return {
                    isValid: false,
                    error: `Invalid audio features - missing or invalid fields: ${missingFields.join(', ')}`
                };
            }
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates top tracks data array
     * @param {Array} topTracks - Array of top track objects
     * @returns {Object} Validation result
     */
    static validateTopTracks(topTracks) {
        if (!topTracks) {
            return { isValid: true }; // Optional parameter
        }

        if (!Array.isArray(topTracks)) {
            return {
                isValid: false,
                error: 'Top tracks must be an array'
            };
        }

        if (topTracks.length > 0) {
            const firstTrack = topTracks[0];
            if (!firstTrack.name || !firstTrack.artists || !firstTrack.duration_ms) {
                return {
                    isValid: false,
                    error: 'Invalid top tracks structure - missing required fields'
                };
            }
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates top artists data array
     * @param {Array} topArtists - Array of top artist objects
     * @returns {Object} Validation result
     */
    static validateTopArtists(topArtists) {
        if (!topArtists) {
            return { isValid: true }; // Optional parameter
        }

        if (!Array.isArray(topArtists)) {
            return {
                isValid: false,
                error: 'Top artists must be an array'
            };
        }

        if (topArtists.length > 0) {
            const firstArtist = topArtists[0];
            if (!firstArtist.name || !firstArtist.genres) {
                return {
                    isValid: false,
                    error: 'Invalid top artists structure - missing name or genres'
                };
            }
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates Spotify time range parameter
     * @param {string} timeRange - Time range parameter ('short_term', 'medium_term', 'long_term')
     * @returns {Object} Validation result
     */
    static validateTimeRange(timeRange) {
        if (!timeRange) {
            return {
                isValid: false,
                error: 'Time range is required'
            };
        }

        if (typeof timeRange !== 'string') {
            return {
                isValid: false,
                error: 'Time range must be a string'
            };
        }

        const validRanges = ['short_term', 'medium_term', 'long_term'];
        if (!validRanges.includes(timeRange)) {
            return {
                isValid: false,
                error: `Invalid time range. Must be one of: ${validRanges.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates access token for API calls
     * @param {string} accessToken - Spotify access token
     * @returns {Object} Validation result
     */
    static validateAccessToken(accessToken) {
        if (!accessToken) {
            return {
                isValid: false,
                error: 'Access token is required'
            };
        }

        if (typeof accessToken !== 'string') {
            return {
                isValid: false,
                error: 'Access token must be a string'
            };
        }

        if (accessToken.length < 10) {
            return {
                isValid: false,
                error: 'Access token appears to be invalid (too short)'
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates limit parameter for API requests
     * @param {number} limit - Number of items to request (1-50)
     * @returns {Object} Validation result
     */
    static validateLimit(limit) {
        if (limit === undefined || limit === null) {
            return { isValid: true }; // Optional parameter
        }

        if (typeof limit !== 'number' || !Number.isInteger(limit)) {
            return {
                isValid: false,
                error: 'Limit must be a valid integer'
            };
        }

        if (limit < 1 || limit > 50) {
            return {
                isValid: false,
                error: 'Limit must be between 1 and 50'
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates analytics configuration object
     * @param {Object} config - Analytics configuration options
     * @returns {Object} Validation result
     */
    static validateAnalyticsConfig(config) {
        if (!config) {
            return { isValid: true }; // Optional parameter
        }

        if (typeof config !== 'object' || Array.isArray(config)) {
            return {
                isValid: false,
                error: 'Analytics config must be an object'
            };
        }

        // Validate specific config properties if present
        if (config.includeAudioFeatures !== undefined && typeof config.includeAudioFeatures !== 'boolean') {
            return {
                isValid: false,
                error: 'includeAudioFeatures must be a boolean'
            };
        }

        if (config.analysisDepth !== undefined) {
            const validDepths = ['basic', 'standard', 'advanced'];
            if (!validDepths.includes(config.analysisDepth)) {
                return {
                    isValid: false,
                    error: `analysisDepth must be one of: ${validDepths.join(', ')}`
                };
            }
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates mood metrics data structure
     * @param {Object} moodMetrics - Object containing mood metric arrays
     * @returns {Object} Validation result
     */
    static validateMoodMetrics(moodMetrics) {
        if (!moodMetrics) {
            return {
                isValid: false,
                error: 'Mood metrics data is required'
            };
        }

        if (typeof moodMetrics !== 'object' || Array.isArray(moodMetrics)) {
            return {
                isValid: false,
                error: 'Mood metrics must be an object'
            };
        }

        const requiredMetrics = ['valence', 'energy', 'danceability', 'acousticness', 'instrumentalness'];
        const missingMetrics = requiredMetrics.filter(metric => 
            !Array.isArray(moodMetrics[metric])
        );

        if (missingMetrics.length > 0) {
            return {
                isValid: false,
                error: `Missing mood metrics arrays: ${missingMetrics.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates track IDs array for audio features requests
     * @param {Array} trackIds - Array of Spotify track IDs
     * @returns {Object} Validation result
     */
    static validateTrackIds(trackIds) {
        if (!trackIds) {
            return {
                isValid: false,
                error: 'Track IDs array is required'
            };
        }

        if (!Array.isArray(trackIds)) {
            return {
                isValid: false,
                error: 'Track IDs must be an array'
            };
        }

        if (trackIds.length === 0) {
            return {
                isValid: false,
                error: 'Track IDs array cannot be empty'
            };
        }

        if (trackIds.length > 100) {
            return {
                isValid: false,
                error: 'Too many track IDs (maximum 100 allowed)'
            };
        }

        // Validate track ID format (basic check)
        const invalidIds = trackIds.filter(id => 
            !id || typeof id !== 'string' || id.length < 10
        );

        if (invalidIds.length > 0) {
            return {
                isValid: false,
                error: `Invalid track IDs found: ${invalidIds.length} invalid IDs`
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates numeric array for statistical calculations
     * @param {Array} numbers - Array of numeric values
     * @param {string} fieldName - Name of the field being validated (for error messages)
     * @returns {Object} Validation result
     */
    static validateNumericArray(numbers, fieldName = 'numeric array') {
        if (!numbers) {
            return {
                isValid: false,
                error: `${fieldName} is required`
            };
        }

        if (!Array.isArray(numbers)) {
            return {
                isValid: false,
                error: `${fieldName} must be an array`
            };
        }

        if (numbers.length === 0) {
            return { isValid: true }; // Empty arrays are valid for calculations
        }

        const invalidValues = numbers.filter(num => 
            typeof num !== 'number' || isNaN(num) || !isFinite(num)
        );

        if (invalidValues.length > 0) {
            return {
                isValid: false,
                error: `${fieldName} contains invalid numeric values`
            };
        }

        return { isValid: true };
    }

    /**
     * PURE: Validates date string format for analytics
     * @param {string} dateString - Date string to validate
     * @returns {Object} Validation result
     */
    static validateDateString(dateString) {
        if (!dateString) {
            return {
                isValid: false,
                error: 'Date string is required'
            };
        }

        if (typeof dateString !== 'string') {
            return {
                isValid: false,
                error: 'Date must be a string'
            };
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return {
                isValid: false,
                error: 'Invalid date format'
            };
        }

        // Check if date is reasonable (not in the future beyond reasonable bounds)
        const now = new Date();
        const maxFutureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day in future
        if (date > maxFutureDate) {
            return {
                isValid: false,
                error: 'Date cannot be in the future'
            };
        }

        return { isValid: true };
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsValidators;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.AnalyticsValidators = AnalyticsValidators;
}