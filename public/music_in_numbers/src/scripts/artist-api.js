/**
 * ================================================================================
 * ARTIST API MODULE - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * LEGACY COMPATIBILITY LAYER
 * 
 * This file now serves as a backward-compatible delegation wrapper for the new
 * modular Artist API architecture. All functions delegate to the appropriate
 * modular classes while maintaining the original function signatures.
 * 
 * MODULAR ARCHITECTURE (NEW):
 * ✅ ArtistApiValidators - Pure validation functions
 * ✅ ArtistApiProcessors - Pure data processing functions  
 * ✅ ArtistApiUIBuilders - Pure UI building functions
 * ✅ ArtistApiCore - Business logic orchestration with dependency injection
 * ✅ ArtistApiUtilities - Dependency injection factory and utilities
 * 
 * BACKWARD COMPATIBILITY:
 * All original function signatures are preserved and delegate to new modules.
 * This ensures existing code continues to work without modification.
 * 
 * MIGRATION PATH:
 * 1. Update imports to use modular classes directly
 * 2. Use dependency injection for better testability
 * 3. Leverage new features: caching, performance monitoring, retry logic
 * 
 * See: JAVASCRIPT_MODULARIZATION_COMPLETION_REPORT.md
 * ================================================================================
 */

'use strict';

// ============================================
// MODULE DEPENDENCIES
// ============================================

// Try to load modular classes (they may not be available in all environments)
let ArtistApiValidators, ArtistApiProcessors, ArtistApiUIBuilders, ArtistApiCore, ArtistApiUtilities;

try {
    // Browser environment
    if (typeof window !== 'undefined') {
        ArtistApiValidators = window.ArtistApiValidators;
        ArtistApiProcessors = window.ArtistApiProcessors;
        ArtistApiUIBuilders = window.ArtistApiUIBuilders;
        ArtistApiCore = window.ArtistApiCore;
        ArtistApiUtilities = window.ArtistApiUtilities;
    }
    // Node.js environment
    else if (typeof require !== 'undefined') {
        ArtistApiValidators = require('./artist-api/ArtistApiValidators');
        ArtistApiProcessors = require('./artist-api/ArtistApiProcessors');
        ArtistApiUIBuilders = require('./artist-api/ArtistApiUIBuilders');
        ArtistApiCore = require('./artist-api/ArtistApiCore');
        ArtistApiUtilities = require('./artist-api/ArtistApiUtilities');
    }
} catch (error) {
    console.warn('⚠️ Modular Artist API classes not available, using fallback implementations');
}

// ============================================
// DEPENDENCY INJECTION CONTAINER
// ============================================

const dependencies = ArtistApiUtilities 
    ? ArtistApiUtilities.createDependencyContainer()
    : createFallbackDependencies();

// ============================================
// BACKWARD-COMPATIBLE FUNCTION DELEGATES
// ============================================

/**
 * Finds the largest image from an array of image objects
 * @param {Array} images - Array of image objects with width and height
 * @returns {Object|null} Largest image object or null
 */
function findLargestImage(images) {
    if (ArtistApiProcessors) {
        return ArtistApiProcessors.findLargestImage(images);
    }
    
    // Fallback implementation
    if (!images || images.length === 0) return null;
    
    return images.reduce((largest, current) => {
        if (!largest) return current;
        const currentArea = (current.width || 0) * (current.height || 0);
        const largestArea = (largest.width || 0) * (largest.height || 0);
        return currentArea > largestArea ? current : largest;
    }, null);
}

/**
 * Generates a potential Instagram handle from artist name
 * @param {string} artistName - Artist name
 * @returns {string} Generated Instagram handle
 */
function generateInstagramHandle(artistName) {
    if (ArtistApiProcessors) {
        return ArtistApiProcessors.generateInstagramHandle(artistName);
    }
    
    // Fallback implementation
    return artistName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove special characters
        .replace(/\s+/g, '');       // Remove spaces
}

/**
 * Checks if a generated Instagram handle is valid
 * @param {string} handle - Instagram handle to validate
 * @returns {boolean} True if handle length is valid
 */
function isValidInstagramHandle(handle) {
    if (ArtistApiValidators) {
        const result = ArtistApiValidators.validateInstagramHandle(handle);
        return result.isValid;
    }
    
    // Fallback implementation
    return handle.length > 0 && handle.length <= 30;
}

/**
 * Determines Instagram URL for artist
 * @param {Object} artistData - Spotify artist data
 * @returns {Object} Object with instagramUrl and isConfirmed properties
 */
function getInstagramInfo(artistData) {
    if (ArtistApiProcessors) {
        return ArtistApiProcessors.getInstagramInfo(artistData);
    }
    
    // Fallback implementation
    if (artistData.external_urls && artistData.external_urls.instagram) {
        return {
            instagramUrl: artistData.external_urls.instagram,
            isConfirmed: true
        };
    }
    
    const handle = generateInstagramHandle(artistData.name);
    
    if (isValidInstagramHandle(handle)) {
        return {
            instagramUrl: `https://www.instagram.com/${handle}/`,
            isConfirmed: false
        };
    }
    
    return {
        instagramUrl: null,
        isConfirmed: false
    };
}

/**
 * Formats artist data for display
 * @param {Object} artistData - Spotify artist data
 * @returns {Object} Formatted artist information
 */
function formatArtistData(artistData) {
    if (ArtistApiProcessors) {
        return ArtistApiProcessors.formatArtistData(artistData);
    }
    
    // Fallback implementation
    const largestImage = findLargestImage(artistData.images);
    const defaultImage = artistData.images?.[0];
    const instagram = getInstagramInfo(artistData);
    
    return {
        name: artistData.name || 'Unknown Artist',
        imageUrl: largestImage?.url || defaultImage?.url || '',
        imageWidth: largestImage?.width || defaultImage?.width || 300,
        imageHeight: largestImage?.height || defaultImage?.height || 300,
        followers: artistData.followers?.total?.toLocaleString() || '0',
        genres: artistData.genres?.join(', ') || 'No genres listed',
        popularity: artistData.popularity || 0,
        spotifyUrl: artistData.external_urls?.spotify || '',
        instagramUrl: instagram.instagramUrl,
        isInstagramConfirmed: instagram.isConfirmed,
        rawData: JSON.stringify(artistData, null, 2)
    };
}

/**
 * Fetches artist data from Spotify API (impure - network I/O)
 * @param {string} artistId - Spotify artist ID
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Promise<Object>} Artist data from API
 */
async function fetchArtistFromAPI(artistId, accessToken) {
    if (ArtistApiCore) {
        return await ArtistApiCore.fetchArtistDataCore(artistId, accessToken, dependencies);
    }
    
    // Fallback implementation
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Fetches current user's profile from Spotify API (impure - network I/O)
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Promise<Object>} User profile data
 */
async function fetchUserProfile(accessToken) {
    if (ArtistApiCore) {
        return await ArtistApiCore.fetchUserProfileCore(accessToken, dependencies);
    }
    
    // Fallback implementation
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// ============================================
// FALLBACK DEPENDENCIES (when modules unavailable)
// ============================================

function createFallbackDependencies() {
    return {
        fetch: typeof fetch !== 'undefined' ? fetch.bind(window) : null,
        logInfo: console.log.bind(console),
        logError: console.error.bind(console),
        logWarning: console.warn.bind(console),
        logDebug: console.log.bind(console),
        showResult: (message, type) => console.log(`[${type}] ${message}`),
        config: {
            apiBaseUrl: 'https://api.spotify.com/v1',
            cacheTimeout: 5 * 60 * 1000,
            retryAttempts: 3,
            retryDelay: 1000,
            performanceMonitoring: false
        }
    };
}