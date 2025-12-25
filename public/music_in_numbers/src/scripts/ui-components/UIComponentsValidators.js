/**
 * UI Components Validators - Pure Validation Functions
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This class contains pure validation functions for UI components, user data,
 * analytics data, and DOM elements. All methods are static and side-effect free.
 * 
 * Pattern: "Functional Core" - Pure functions with no side effects
 * Dependencies: None (pure validation logic)
 * 
 * @class UIComponentsValidators
 */
class UIComponentsValidators {
    
    /**
     * Validate analytics data structure for UI display
     * @param {Object} data - Analytics data object
     * @returns {Object} Validation result with isValid boolean and error message
     */
    static validateAnalyticsData(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Analytics data must be a valid object',
                details: { provided: typeof data, expected: 'object' }
            };
        }

        // Required analytics structure validation
        const requiredFields = ['analytics', 'topTracks', 'topArtists'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                error: `Missing required analytics fields: ${missingFields.join(', ')}`,
                details: { missing: missingFields, provided: Object.keys(data) }
            };
        }

        // Validate analytics sub-structure
        const analyticsValidation = this.validateAnalyticsSubstructure(data.analytics);
        if (!analyticsValidation.isValid) {
            return analyticsValidation;
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate analytics sub-structure (mood analysis, music personality, etc.)
     * @param {Object} analytics - Analytics sub-object
     * @returns {Object} Validation result
     */
    static validateAnalyticsSubstructure(analytics) {
        if (!analytics || typeof analytics !== 'object') {
            return {
                isValid: false,
                error: 'Analytics must be a valid object',
                details: { provided: typeof analytics }
            };
        }

        const requiredSubFields = [
            'moodAnalysis', 'musicPersonality', 'totalTracks', 
            'uniqueArtists', 'listeningPatterns', 'trendAnalysis'
        ];
        
        const missingSubFields = requiredSubFields.filter(field => !analytics[field]);
        
        if (missingSubFields.length > 0) {
            return {
                isValid: false,
                error: `Missing required analytics sub-fields: ${missingSubFields.join(', ')}`,
                details: { missing: missingSubFields }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate user data structure for UI display
     * @param {Object} userData - User data object
     * @returns {Object} Validation result
     */
    static validateUserData(userData) {
        if (!userData || typeof userData !== 'object') {
            return {
                isValid: false,
                error: 'User data must be a valid object',
                details: { provided: typeof userData }
            };
        }

        // Check for essential user fields
        const essentialFields = ['display_name', 'id'];
        const hasEssentialFields = essentialFields.some(field => userData[field]);
        
        if (!hasEssentialFields) {
            return {
                isValid: false,
                error: `User data must contain at least one of: ${essentialFields.join(', ')}`,
                details: { provided: Object.keys(userData), required: essentialFields }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate DOM element for UI operations
     * @param {Element|string} element - DOM element or selector
     * @returns {Object} Validation result
     */
    static validateDOMElement(element) {
        if (typeof element === 'string') {
            if (!element.trim()) {
                return {
                    isValid: false,
                    error: 'DOM selector cannot be empty',
                    details: { provided: element }
                };
            }
            
            // Basic selector validation
            const selectorPattern = /^[#.]?[\w-]+$/;
            if (!selectorPattern.test(element)) {
                return {
                    isValid: false,
                    error: 'Invalid DOM selector format',
                    details: { provided: element, expected: 'Valid CSS selector' }
                };
            }
            
            return { isValid: true, error: null };
        }

        if (element && typeof element === 'object' && element.nodeType === 1) {
            return { isValid: true, error: null };
        }

        return {
            isValid: false,
            error: 'Element must be a valid DOM element or selector string',
            details: { provided: typeof element, nodeType: element?.nodeType }
        };
    }

    /**
     * Validate current playback data structure
     * @param {Object} playbackData - Current playback data
     * @returns {Object} Validation result
     */
    static validateCurrentPlaybackData(playbackData) {
        if (!playbackData) {
            return { isValid: true, error: null }; // Optional data
        }

        if (typeof playbackData !== 'object') {
            return {
                isValid: false,
                error: 'Playback data must be an object',
                details: { provided: typeof playbackData }
            };
        }

        // Required playback fields
        const requiredFields = ['item', 'is_playing', 'device'];
        const missingFields = requiredFields.filter(field => !playbackData[field]);
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                error: `Missing playback fields: ${missingFields.join(', ')}`,
                details: { missing: missingFields }
            };
        }

        // Validate item structure
        if (!playbackData.item.name || !playbackData.item.artists) {
            return {
                isValid: false,
                error: 'Playback item must have name and artists',
                details: { item: playbackData.item }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate track data for rendering
     * @param {Object} track - Track data object
     * @returns {Object} Validation result
     */
    static validateTrackData(track) {
        if (!track || typeof track !== 'object') {
            return {
                isValid: false,
                error: 'Track data must be a valid object',
                details: { provided: typeof track }
            };
        }

        const requiredFields = ['name', 'artists', 'duration_ms', 'popularity'];
        const missingFields = requiredFields.filter(field => track[field] === undefined);
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                error: `Track missing required fields: ${missingFields.join(', ')}`,
                details: { missing: missingFields, provided: Object.keys(track) }
            };
        }

        // Validate artists array
        if (!Array.isArray(track.artists) || track.artists.length === 0) {
            return {
                isValid: false,
                error: 'Track artists must be a non-empty array',
                details: { artists: track.artists }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate artist data for rendering
     * @param {Object} artist - Artist data object
     * @returns {Object} Validation result
     */
    static validateArtistData(artist) {
        if (!artist || typeof artist !== 'object') {
            return {
                isValid: false,
                error: 'Artist data must be a valid object',
                details: { provided: typeof artist }
            };
        }

        const requiredFields = ['name', 'popularity', 'followers'];
        const missingFields = requiredFields.filter(field => artist[field] === undefined);
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                error: `Artist missing required fields: ${missingFields.join(', ')}`,
                details: { missing: missingFields, provided: Object.keys(artist) }
            };
        }

        // Validate followers structure
        if (!artist.followers || typeof artist.followers.total !== 'number') {
            return {
                isValid: false,
                error: 'Artist followers must have a numeric total',
                details: { followers: artist.followers }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate result message parameters
     * @param {string} message - Message text
     * @param {string} type - Message type (error, success, warning, info)
     * @returns {Object} Validation result
     */
    static validateResultMessage(message, type) {
        if (!message || typeof message !== 'string') {
            return {
                isValid: false,
                error: 'Message must be a non-empty string',
                details: { provided: typeof message, value: message }
            };
        }

        const validTypes = ['error', 'success', 'warning', 'info'];
        if (!validTypes.includes(type)) {
            return {
                isValid: false,
                error: `Type must be one of: ${validTypes.join(', ')}`,
                details: { provided: type, valid: validTypes }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate virtual scrolling parameters
     * @param {Element} container - Container element
     * @param {Array} items - Items array
     * @param {Function} renderFunction - Render function
     * @returns {Object} Validation result
     */
    static validateVirtualScrollingParams(container, items, renderFunction) {
        // Validate container
        const containerValidation = this.validateDOMElement(container);
        if (!containerValidation.isValid) {
            return {
                isValid: false,
                error: 'Invalid container for virtual scrolling',
                details: containerValidation.details
            };
        }

        // Validate items array
        if (!Array.isArray(items)) {
            return {
                isValid: false,
                error: 'Items must be an array for virtual scrolling',
                details: { provided: typeof items }
            };
        }

        // Validate render function
        if (typeof renderFunction !== 'function') {
            return {
                isValid: false,
                error: 'Render function must be a valid function',
                details: { provided: typeof renderFunction }
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Validate genre index for color selection
     * @param {number} index - Genre index
     * @returns {Object} Validation result
     */
    static validateGenreIndex(index) {
        if (typeof index !== 'number' || isNaN(index)) {
            return {
                isValid: false,
                error: 'Genre index must be a valid number',
                details: { provided: typeof index, value: index }
            };
        }

        if (index < 0) {
            return {
                isValid: false,
                error: 'Genre index must be non-negative',
                details: { provided: index }
            };
        }

        return { isValid: true, error: null };
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponentsValidators;
} else if (typeof window !== 'undefined') {
    window.UIComponentsValidators = UIComponentsValidators;
}

// ES6 module export
if (typeof exports !== 'undefined') {
    exports.UIComponentsValidators = UIComponentsValidators;
}