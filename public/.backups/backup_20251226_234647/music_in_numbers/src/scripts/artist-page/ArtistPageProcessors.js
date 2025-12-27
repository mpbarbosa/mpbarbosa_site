/**
 * ================================================================================
 * ARTIST PAGE PROCESSORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure data processing functions for artist page operations.
 * Contains only deterministic functions with no side effects.
 * 
 * PROCESSING TYPES:
 * - Artist Data Processing (Format for display)
 * - Profile URL Processing (Construct and validate URLs)
 * - User Profile Processing (Transform user data)
 * - Error Message Processing (Generate user-friendly messages)
 * - Application State Processing (Handle loading states)
 * - Navigation Processing (Handle routing and redirects)
 * 
 * PATTERNS:
 * - Pure functions only (no side effects)
 * - Immutable data transformations
 * - Consistent return formats
 * - Error-safe processing with fallbacks
 * - Type-safe data handling
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistPageProcessors {
    
    /**
     * Processes artist data for display on the artist page
     * @param {Object} artistData - Raw artist data from Spotify API
     * @returns {Object} Processed artist data for UI consumption
     */
    static processArtistData(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return {
                id: null,
                name: 'Unknown Artist',
                displayName: 'Unknown Artist',
                imageUrl: '',
                followers: '0',
                genres: 'No genres available',
                popularity: 0,
                spotifyUrl: '',
                isValid: false,
                error: 'Invalid artist data provided'
            };
        }
        
        return {
            id: artistData.id || null,
            name: artistData.name || 'Unknown Artist',
            displayName: this.formatArtistDisplayName(artistData.name || 'Unknown Artist'),
            imageUrl: this.extractArtistImageUrl(artistData.images || []),
            followers: this.formatFollowerCount(artistData.followers?.total || 0),
            genres: this.formatGenresList(artistData.genres || []),
            popularity: this.normalizePopularity(artistData.popularity || 0),
            spotifyUrl: artistData.external_urls?.spotify || '',
            isValid: true,
            error: null
        };
    }
    
    /**
     * Formats artist display name for UI presentation
     * @param {string} artistName - Raw artist name
     * @returns {string} Formatted display name
     */
    static formatArtistDisplayName(artistName) {
        if (!artistName || typeof artistName !== 'string') {
            return 'Unknown Artist';
        }
        
        // Trim whitespace and handle empty strings
        const trimmed = artistName.trim();
        if (trimmed.length === 0) {
            return 'Unknown Artist';
        }
        
        // Handle very long names
        if (trimmed.length > 50) {
            return trimmed.substring(0, 47) + '...';
        }
        
        return trimmed;
    }
    
    /**
     * Extracts the best image URL from artist images array
     * @param {Array} images - Array of image objects from Spotify API
     * @returns {string} Best image URL or empty string
     */
    static extractArtistImageUrl(images) {
        if (!Array.isArray(images) || images.length === 0) {
            return '';
        }
        
        // Find largest image (prefer width > 300px)
        const largeImages = images.filter(img => img.width && img.width >= 300);
        if (largeImages.length > 0) {
            // Sort by size descending and pick the largest
            largeImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));
            return largeImages[0].url || '';
        }
        
        // Fallback to any available image
        return images[0]?.url || '';
    }
    
    /**
     * Formats follower count for display
     * @param {number} followerCount - Raw follower count
     * @returns {string} Formatted follower count string
     */
    static formatFollowerCount(followerCount) {
        if (typeof followerCount !== 'number' || followerCount < 0) {
            return '0';
        }
        
        if (followerCount >= 1000000) {
            return `${(followerCount / 1000000).toFixed(1)}M`;
        }
        
        if (followerCount >= 1000) {
            return `${(followerCount / 1000).toFixed(1)}K`;
        }
        
        return followerCount.toLocaleString();
    }
    
    /**
     * Formats genres list for display
     * @param {Array} genres - Array of genre strings
     * @returns {string} Formatted genres string
     */
    static formatGenresList(genres) {
        if (!Array.isArray(genres) || genres.length === 0) {
            return 'No genres available';
        }
        
        // Filter out empty/invalid genres
        const validGenres = genres.filter(genre => 
            genre && typeof genre === 'string' && genre.trim().length > 0
        );
        
        if (validGenres.length === 0) {
            return 'No genres available';
        }
        
        // Capitalize first letter of each genre
        const capitalizedGenres = validGenres.map(genre => 
            genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
        );
        
        // Limit to first 5 genres to avoid overwhelming display
        const displayGenres = capitalizedGenres.slice(0, 5);
        
        return displayGenres.join(', ');
    }
    
    /**
     * Normalizes popularity score for consistent display
     * @param {number} popularity - Raw popularity score (0-100)
     * @returns {number} Normalized popularity score
     */
    static normalizePopularity(popularity) {
        if (typeof popularity !== 'number' || popularity < 0 || popularity > 100) {
            return 0;
        }
        
        return Math.round(popularity);
    }
    
    /**
     * Processes user profile data for display
     * @param {Object} userData - Raw user data from Spotify API
     * @returns {Object} Processed user profile data
     */
    static processUserProfile(userData) {
        if (!userData || typeof userData !== 'object') {
            return {
                id: null,
                displayName: 'Unknown User',
                profileUrl: '',
                imageUrl: '',
                isValid: false,
                error: 'Invalid user data provided'
            };
        }
        
        return {
            id: userData.id || null,
            displayName: this.formatUserDisplayName(userData),
            profileUrl: this.formatProfileUrl(userData),
            imageUrl: this.extractUserImageUrl(userData.images || []),
            country: userData.country || '',
            followers: this.formatFollowerCount(userData.followers?.total || 0),
            isValid: true,
            error: null
        };
    }
    
    /**
     * Formats user display name from profile data
     * @param {Object} userData - User data object
     * @returns {string} Formatted display name
     */
    static formatUserDisplayName(userData) {
        if (!userData || typeof userData !== 'object') {
            return 'Unknown User';
        }
        
        // Prefer display_name, fallback to id
        const displayName = userData.display_name || userData.id || 'Unknown User';
        
        if (typeof displayName !== 'string') {
            return 'Unknown User';
        }
        
        const trimmed = displayName.trim();
        if (trimmed.length === 0) {
            return 'Unknown User';
        }
        
        // Handle very long display names
        if (trimmed.length > 30) {
            return trimmed.substring(0, 27) + '...';
        }
        
        return trimmed;
    }
    
    /**
     * Formats Spotify profile URL from user data
     * @param {Object} userData - User data containing ID and external URLs
     * @returns {string} Formatted Spotify profile URL
     */
    static formatProfileUrl(userData) {
        if (!userData || typeof userData !== 'object') {
            return '';
        }
        
        // Prefer external URL from API
        if (userData.external_urls?.spotify) {
            return userData.external_urls.spotify;
        }
        
        // Construct URL from user ID
        if (userData.id && typeof userData.id === 'string') {
            return `https://open.spotify.com/user/${encodeURIComponent(userData.id)}`;
        }
        
        return '';
    }
    
    /**
     * Extracts user profile image URL
     * @param {Array} images - Array of image objects
     * @returns {string} Best profile image URL or empty string
     */
    static extractUserImageUrl(images) {
        if (!Array.isArray(images) || images.length === 0) {
            return '';
        }
        
        // For user profiles, prefer medium-sized images (64-300px)
        const mediumImages = images.filter(img => 
            img.width && img.width >= 64 && img.width <= 300
        );
        
        if (mediumImages.length > 0) {
            // Sort by size and pick closest to 150px
            mediumImages.sort((a, b) => 
                Math.abs(a.width - 150) - Math.abs(b.width - 150)
            );
            return mediumImages[0].url || '';
        }
        
        // Fallback to any available image
        return images[0]?.url || '';
    }
    
    /**
     * Generates user-friendly error messages
     * @param {Error|string} error - Error object or error message
     * @param {string} context - Context where error occurred
     * @returns {string} User-friendly error message
     */
    static generateErrorMessage(error, context = 'operation') {
        if (!error) {
            return `An unknown error occurred during ${context}`;
        }
        
        let errorMessage = '';
        
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = String(error);
        }
        
        // Clean up technical error messages for users
        const cleanMessage = this.sanitizeErrorMessage(errorMessage);
        
        // Add context-specific guidance
        const contextualMessage = this.addErrorContext(cleanMessage, context);
        
        return contextualMessage;
    }
    
    /**
     * Sanitizes error messages for user consumption
     * @param {string} message - Raw error message
     * @returns {string} Sanitized error message
     */
    static sanitizeErrorMessage(message) {
        if (!message || typeof message !== 'string') {
            return 'An unexpected error occurred';
        }
        
        // Common API error message mappings
        const errorMappings = {
            'fetch failed': 'Network connection failed',
            'Failed to fetch': 'Unable to connect to Spotify',
            'HTTP error! status: 401': 'Authentication expired. Please login again',
            'HTTP error! status: 403': 'Access denied. Please check your permissions',
            'HTTP error! status: 404': 'Requested content not found',
            'HTTP error! status: 429': 'Too many requests. Please try again later',
            'HTTP error! status: 500': 'Spotify service temporarily unavailable'
        };
        
        // Check for exact matches first
        for (const [technical, friendly] of Object.entries(errorMappings)) {
            if (message.includes(technical)) {
                return friendly;
            }
        }
        
        // Remove technical stack trace info
        const cleaned = message.split('\n')[0]; // Take only first line
        
        // Remove common technical prefixes
        const prefixesToRemove = ['Error: ', 'TypeError: ', 'ReferenceError: '];
        let result = cleaned;
        
        for (const prefix of prefixesToRemove) {
            if (result.startsWith(prefix)) {
                result = result.substring(prefix.length);
                break;
            }
        }
        
        return result || 'An unexpected error occurred';
    }
    
    /**
     * Adds context-specific guidance to error messages
     * @param {string} message - Base error message
     * @param {string} context - Error context
     * @returns {string} Enhanced error message with context
     */
    static addErrorContext(message, context) {
        const contextGuidance = {
            'authentication': '. Please check your Spotify login and try again.',
            'artist loading': '. Please try refreshing the page or selecting a different artist.',
            'profile loading': '. Please check your Spotify connection and try again.',
            'data fetching': '. Please check your internet connection and try again.',
            'initialization': '. Please refresh the page to restart the application.'
        };
        
        const guidance = contextGuidance[context] || '. Please try again or refresh the page.';
        
        return message + guidance;
    }
    
    /**
     * Processes application state changes
     * @param {string} currentState - Current application state
     * @param {string} newState - Desired new state
     * @param {Object} stateData - Additional state data
     * @returns {Object} Processed state transition
     */
    static processStateTransition(currentState, newState, stateData = {}) {
        const validStates = ['idle', 'loading', 'loaded', 'error'];
        
        // Validate states
        if (!validStates.includes(currentState) || !validStates.includes(newState)) {
            return {
                isValid: false,
                state: currentState,
                error: 'Invalid state transition attempted'
            };
        }
        
        // Check for valid transitions
        const validTransitions = {
            'idle': ['loading'],
            'loading': ['loaded', 'error', 'idle'],
            'loaded': ['loading', 'idle'],
            'error': ['loading', 'idle']
        };
        
        if (!validTransitions[currentState]?.includes(newState)) {
            return {
                isValid: false,
                state: currentState,
                error: `Invalid transition from ${currentState} to ${newState}`
            };
        }
        
        return {
            isValid: true,
            state: newState,
            previousState: currentState,
            data: stateData,
            timestamp: new Date().toISOString(),
            error: null
        };
    }
    
    /**
     * Processes URL parameters for artist page routing
     * @param {string} urlString - Full URL string
     * @returns {Object} Parsed URL parameters
     */
    static processUrlParameters(urlString) {
        try {
            const url = new URL(urlString);
            const params = new URLSearchParams(url.search);
            
            return {
                artistId: params.get('artist') || null,
                view: params.get('view') || 'default',
                tab: params.get('tab') || null,
                auth: params.get('code') || null,
                error: params.get('error') || null,
                isValid: true
            };
        } catch (error) {
            return {
                artistId: null,
                view: 'default',
                tab: null,
                auth: null,
                error: null,
                isValid: false,
                parseError: 'Invalid URL format'
            };
        }
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistPageProcessors;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistPageProcessors = ArtistPageProcessors;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistPageProcessors = ArtistPageProcessors;
}