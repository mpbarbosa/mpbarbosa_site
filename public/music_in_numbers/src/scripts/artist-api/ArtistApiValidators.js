/**
 * ================================================================================
 * ARTIST API VALIDATORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure validation functions for artist API operations.
 * All functions are deterministic with no side effects.
 * 
 * VALIDATION TYPES:
 * - Access Token Validation
 * - Artist ID Validation
 * - Artist Data Structure Validation
 * - Instagram Handle Validation
 * - API Response Validation
 * 
 * PATTERNS:
 * - Consistent return format: { isValid: boolean, error?: string }
 * - Pure functions only - no side effects
 * - Comprehensive error messages
 * - Defensive programming approach
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistApiValidators {
    
    /**
     * Validates Spotify access token
     * @param {string} accessToken - Access token to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateAccessToken(accessToken) {
        if (!accessToken) {
            return { isValid: false, error: 'Access token is required' };
        }
        
        if (typeof accessToken !== 'string') {
            return { isValid: false, error: 'Access token must be a string' };
        }
        
        if (accessToken.trim().length === 0) {
            return { isValid: false, error: 'Access token cannot be empty' };
        }
        
        // Basic format validation for Spotify tokens
        if (accessToken.length < 10) {
            return { isValid: false, error: 'Access token appears to be too short' };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates Spotify artist ID
     * @param {string} artistId - Artist ID to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateArtistId(artistId) {
        if (!artistId) {
            return { isValid: false, error: 'Artist ID is required' };
        }
        
        if (typeof artistId !== 'string') {
            return { isValid: false, error: 'Artist ID must be a string' };
        }
        
        if (artistId.trim().length === 0) {
            return { isValid: false, error: 'Artist ID cannot be empty' };
        }
        
        // Spotify IDs are typically 22 characters long
        if (artistId.length !== 22) {
            return { isValid: false, error: 'Artist ID should be 22 characters long' };
        }
        
        // Spotify IDs contain only alphanumeric characters
        if (!/^[A-Za-z0-9]+$/.test(artistId)) {
            return { isValid: false, error: 'Artist ID should contain only alphanumeric characters' };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates artist data structure from Spotify API
     * @param {Object} artistData - Artist data object to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateArtistData(artistData) {
        if (!artistData) {
            return { isValid: false, error: 'Artist data is required' };
        }
        
        if (typeof artistData !== 'object' || Array.isArray(artistData)) {
            return { isValid: false, error: 'Artist data must be an object' };
        }
        
        // Check for required fields
        const requiredFields = ['id', 'name', 'type'];
        for (const field of requiredFields) {
            if (!(field in artistData)) {
                return { isValid: false, error: `Missing required field: ${field}` };
            }
        }
        
        // Validate artist type
        if (artistData.type !== 'artist') {
            return { isValid: false, error: 'Data type must be "artist"' };
        }
        
        // Validate name
        if (!artistData.name || typeof artistData.name !== 'string') {
            return { isValid: false, error: 'Artist name must be a non-empty string' };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates image array structure
     * @param {Array} images - Array of image objects
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateImages(images) {
        if (!images) {
            return { isValid: true }; // Images are optional
        }
        
        if (!Array.isArray(images)) {
            return { isValid: false, error: 'Images must be an array' };
        }
        
        // Validate each image object
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            
            if (!image || typeof image !== 'object') {
                return { isValid: false, error: `Image at index ${i} must be an object` };
            }
            
            if (!image.url || typeof image.url !== 'string') {
                return { isValid: false, error: `Image at index ${i} must have a valid URL` };
            }
            
            // Width and height should be numbers if present
            if (image.width !== undefined && (typeof image.width !== 'number' || image.width <= 0)) {
                return { isValid: false, error: `Image at index ${i} width must be a positive number` };
            }
            
            if (image.height !== undefined && (typeof image.height !== 'number' || image.height <= 0)) {
                return { isValid: false, error: `Image at index ${i} height must be a positive number` };
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates Instagram handle format
     * @param {string} handle - Instagram handle to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateInstagramHandle(handle) {
        if (!handle) {
            return { isValid: false, error: 'Instagram handle is required' };
        }
        
        if (typeof handle !== 'string') {
            return { isValid: false, error: 'Instagram handle must be a string' };
        }
        
        const trimmedHandle = handle.trim();
        
        if (trimmedHandle.length === 0) {
            return { isValid: false, error: 'Instagram handle cannot be empty' };
        }
        
        if (trimmedHandle.length > 30) {
            return { isValid: false, error: 'Instagram handle cannot exceed 30 characters' };
        }
        
        // Instagram handles can only contain letters, numbers, underscores, and periods
        if (!/^[a-zA-Z0-9_.]+$/.test(trimmedHandle)) {
            return { isValid: false, error: 'Instagram handle can only contain letters, numbers, underscores, and periods' };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates API response structure
     * @param {Response} response - Fetch API response object
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateApiResponse(response) {
        if (!response) {
            return { isValid: false, error: 'API response is required' };
        }
        
        if (typeof response !== 'object') {
            return { isValid: false, error: 'API response must be an object' };
        }
        
        // Check for Response object properties
        if (typeof response.ok !== 'boolean') {
            return { isValid: false, error: 'API response must have an "ok" property' };
        }
        
        if (typeof response.status !== 'number') {
            return { isValid: false, error: 'API response must have a "status" property' };
        }
        
        if (!response.ok && (response.status < 200 || response.status >= 300)) {
            return { 
                isValid: false, 
                error: `HTTP error! status: ${response.status} ${response.statusText || ''}` 
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates formatted artist data structure
     * @param {Object} formattedData - Formatted artist data
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    static validateFormattedArtistData(formattedData) {
        if (!formattedData) {
            return { isValid: false, error: 'Formatted artist data is required' };
        }
        
        if (typeof formattedData !== 'object' || Array.isArray(formattedData)) {
            return { isValid: false, error: 'Formatted artist data must be an object' };
        }
        
        const requiredFields = ['name', 'imageUrl', 'followers', 'genres', 'popularity'];
        for (const field of requiredFields) {
            if (!(field in formattedData)) {
                return { isValid: false, error: `Missing required field: ${field}` };
            }
        }
        
        // Validate specific field types
        if (typeof formattedData.name !== 'string') {
            return { isValid: false, error: 'Artist name must be a string' };
        }
        
        if (typeof formattedData.imageUrl !== 'string') {
            return { isValid: false, error: 'Image URL must be a string' };
        }
        
        if (typeof formattedData.followers !== 'string') {
            return { isValid: false, error: 'Followers must be a string (formatted number)' };
        }
        
        if (typeof formattedData.genres !== 'string') {
            return { isValid: false, error: 'Genres must be a string' };
        }
        
        if (typeof formattedData.popularity !== 'number' || formattedData.popularity < 0 || formattedData.popularity > 100) {
            return { isValid: false, error: 'Popularity must be a number between 0 and 100' };
        }
        
        return { isValid: true };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistApiValidators;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistApiValidators = ArtistApiValidators;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistApiValidators = ArtistApiValidators;
}