/**
 * ================================================================================
 * ARTIST PAGE VALIDATORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure validation functions for artist page operations.
 * Contains only deterministic functions with no side effects.
 * 
 * VALIDATION TYPES:
 * - Access Token Validation (OAuth token structure)
 * - Artist ID Validation (Spotify artist ID format)
 * - User Data Validation (Profile data structure)
 * - URL Validation (Spotify profile URL format)
 * - DOM Element Validation (Event handler targets)
 * - Application State Validation (Loading states, errors)
 * 
 * PATTERNS:
 * - Pure functions only (no side effects)
 * - Consistent error reporting format
 * - Comprehensive input validation
 * - Type safety and null checking
 * - Descriptive error messages
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistPageValidators {
    
    /**
     * Validates Spotify access token format and structure
     * @param {string} accessToken - OAuth access token to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateAccessToken(accessToken) {
        if (!accessToken) {
            return {
                isValid: false,
                error: 'Access token is required for artist page operations'
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
                error: 'Access token appears to be too short to be valid'
            };
        }
        
        // Basic OAuth token format check (alphanumeric + some special chars)
        if (!/^[A-Za-z0-9_-]+$/.test(accessToken)) {
            return {
                isValid: false,
                error: 'Access token contains invalid characters'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates Spotify artist ID format
     * @param {string} artistId - Spotify artist ID to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateArtistId(artistId) {
        if (!artistId) {
            return {
                isValid: false,
                error: 'Artist ID is required'
            };
        }
        
        if (typeof artistId !== 'string') {
            return {
                isValid: false,
                error: 'Artist ID must be a string'
            };
        }
        
        // Spotify artist IDs are typically 22 characters, base62 encoded
        if (artistId.length !== 22) {
            return {
                isValid: false,
                error: 'Artist ID must be exactly 22 characters long'
            };
        }
        
        // Check for valid base62 characters (A-Z, a-z, 0-9)
        if (!/^[A-Za-z0-9]+$/.test(artistId)) {
            return {
                isValid: false,
                error: 'Artist ID contains invalid characters (must be alphanumeric)'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates user profile data structure from Spotify API
     * @param {Object} userData - User profile data to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateUserData(userData) {
        if (!userData) {
            return {
                isValid: false,
                error: 'User data is required'
            };
        }
        
        if (typeof userData !== 'object' || Array.isArray(userData)) {
            return {
                isValid: false,
                error: 'User data must be an object'
            };
        }
        
        // Check for required Spotify user fields
        if (!userData.id) {
            return {
                isValid: false,
                error: 'User data must contain an ID field'
            };
        }
        
        if (typeof userData.id !== 'string') {
            return {
                isValid: false,
                error: 'User ID must be a string'
            };
        }
        
        // Validate external_urls structure if present
        if (userData.external_urls) {
            if (typeof userData.external_urls !== 'object' || Array.isArray(userData.external_urls)) {
                return {
                    isValid: false,
                    error: 'User external_urls must be an object'
                };
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates Spotify profile URL format
     * @param {string} profileUrl - Spotify profile URL to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateProfileUrl(profileUrl) {
        if (!profileUrl) {
            return {
                isValid: false,
                error: 'Profile URL is required'
            };
        }
        
        if (typeof profileUrl !== 'string') {
            return {
                isValid: false,
                error: 'Profile URL must be a string'
            };
        }
        
        // Check for valid Spotify URL format
        const spotifyUrlPattern = /^https:\/\/open\.spotify\.com\/user\/[A-Za-z0-9_.-]+$/;
        if (!spotifyUrlPattern.test(profileUrl)) {
            return {
                isValid: false,
                error: 'Profile URL must be a valid Spotify user profile URL'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates DOM element for event handler attachment
     * @param {HTMLElement} element - DOM element to validate
     * @param {string} elementType - Expected element type (e.g., 'button')
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateDOMElement(element, elementType = 'element') {
        if (!element) {
            return {
                isValid: false,
                error: `${elementType} element not found or is null`
            };
        }
        
        // Check if it's a DOM element
        if (!(element instanceof Element) && typeof element !== 'object') {
            return {
                isValid: false,
                error: `${elementType} must be a valid DOM element`
            };
        }
        
        // Check if element has required properties for event handling
        if (typeof element.addEventListener !== 'function') {
            return {
                isValid: false,
                error: `${elementType} element must support addEventListener`
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates application loading state
     * @param {string} state - Current application state
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateLoadingState(state) {
        const validStates = ['loading', 'loaded', 'error', 'idle'];
        
        if (!state) {
            return {
                isValid: false,
                error: 'Loading state is required'
            };
        }
        
        if (typeof state !== 'string') {
            return {
                isValid: false,
                error: 'Loading state must be a string'
            };
        }
        
        if (!validStates.includes(state)) {
            return {
                isValid: false,
                error: `Loading state must be one of: ${validStates.join(', ')}`
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates error message structure
     * @param {string} errorMessage - Error message to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateErrorMessage(errorMessage) {
        if (!errorMessage) {
            return {
                isValid: false,
                error: 'Error message is required'
            };
        }
        
        if (typeof errorMessage !== 'string') {
            return {
                isValid: false,
                error: 'Error message must be a string'
            };
        }
        
        if (errorMessage.length < 5) {
            return {
                isValid: false,
                error: 'Error message is too short to be meaningful'
            };
        }
        
        if (errorMessage.length > 500) {
            return {
                isValid: false,
                error: 'Error message is too long (max 500 characters)'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates event handler function
     * @param {Function} handler - Event handler function to validate
     * @param {string} eventType - Type of event (e.g., 'click', 'load')
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateEventHandler(handler, eventType = 'event') {
        if (!handler) {
            return {
                isValid: false,
                error: `${eventType} handler is required`
            };
        }
        
        if (typeof handler !== 'function') {
            return {
                isValid: false,
                error: `${eventType} handler must be a function`
            };
        }
        
        // Check if function can accept event parameter
        if (handler.length > 1) {
            return {
                isValid: false,
                error: `${eventType} handler should accept at most one parameter (event)`
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates artist data structure from API response
     * @param {Object} artistData - Artist data to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateArtistData(artistData) {
        if (!artistData) {
            return {
                isValid: false,
                error: 'Artist data is required'
            };
        }
        
        if (typeof artistData !== 'object' || Array.isArray(artistData)) {
            return {
                isValid: false,
                error: 'Artist data must be an object'
            };
        }
        
        // Check for required Spotify artist fields
        const requiredFields = ['id', 'name', 'type'];
        for (const field of requiredFields) {
            if (!(field in artistData)) {
                return {
                    isValid: false,
                    error: `Artist data missing required field: ${field}`
                };
            }
        }
        
        // Validate artist type
        if (artistData.type !== 'artist') {
            return {
                isValid: false,
                error: 'Artist data type must be "artist"'
            };
        }
        
        // Validate name
        if (typeof artistData.name !== 'string' || artistData.name.length === 0) {
            return {
                isValid: false,
                error: 'Artist name must be a non-empty string'
            };
        }
        
        return { isValid: true };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistPageValidators;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistPageValidators = ArtistPageValidators;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistPageValidators = ArtistPageValidators;
}