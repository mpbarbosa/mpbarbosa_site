/**
 * ================================================================================
 * ARTIST API PROCESSORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure data processing functions for artist-related operations.
 * All functions are deterministic with no side effects.
 * 
 * PROCESSING TYPES:
 * - Image Processing (finding largest images, image selection)
 * - Instagram Handle Generation and Processing
 * - Artist Data Transformation
 * - Social Media URL Processing
 * - Data Formatting and Normalization
 * 
 * PATTERNS:
 * - Pure functions only - no side effects
 * - Immutable data processing
 * - Defensive programming with null/undefined checks
 * - Consistent return formats
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistApiProcessors {
    
    /**
     * Finds the largest image from an array of image objects
     * @param {Array} images - Array of image objects with width and height
     * @returns {Object|null} Largest image object or null if no valid images
     */
    static findLargestImage(images) {
        if (!images || !Array.isArray(images) || images.length === 0) {
            return null;
        }
        
        return images.reduce((largest, current) => {
            if (!current || typeof current !== 'object') {
                return largest;
            }
            
            if (!largest) {
                return current;
            }
            
            const currentArea = (current.width || 0) * (current.height || 0);
            const largestArea = (largest.width || 0) * (largest.height || 0);
            
            return currentArea > largestArea ? current : largest;
        }, null);
    }
    
    /**
     * Finds the smallest image from an array of image objects
     * @param {Array} images - Array of image objects with width and height
     * @returns {Object|null} Smallest image object or null if no valid images
     */
    static findSmallestImage(images) {
        if (!images || !Array.isArray(images) || images.length === 0) {
            return null;
        }
        
        return images.reduce((smallest, current) => {
            if (!current || typeof current !== 'object') {
                return smallest;
            }
            
            if (!smallest) {
                return current;
            }
            
            const currentArea = (current.width || 0) * (current.height || 0);
            const smallestArea = (smallest.width || 0) * (smallest.height || 0);
            
            return currentArea < smallestArea ? current : smallest;
        }, null);
    }
    
    /**
     * Selects best image based on preferred dimensions
     * @param {Array} images - Array of image objects
     * @param {number} preferredWidth - Preferred width (default: 300)
     * @param {number} preferredHeight - Preferred height (default: 300)
     * @returns {Object|null} Best matching image or null
     */
    static selectBestImage(images, preferredWidth = 300, preferredHeight = 300) {
        if (!images || !Array.isArray(images) || images.length === 0) {
            return null;
        }
        
        const preferredArea = preferredWidth * preferredHeight;
        
        return images.reduce((best, current) => {
            if (!current || typeof current !== 'object') {
                return best;
            }
            
            if (!best) {
                return current;
            }
            
            const currentArea = (current.width || preferredWidth) * (current.height || preferredHeight);
            const bestArea = (best.width || preferredWidth) * (best.height || preferredHeight);
            
            const currentDiff = Math.abs(currentArea - preferredArea);
            const bestDiff = Math.abs(bestArea - preferredArea);
            
            return currentDiff < bestDiff ? current : best;
        }, null);
    }
    
    /**
     * Generates a potential Instagram handle from artist name
     * @param {string} artistName - Artist name
     * @returns {string} Generated Instagram handle (empty string if invalid input)
     */
    static generateInstagramHandle(artistName) {
        if (!artistName || typeof artistName !== 'string') {
            return '';
        }
        
        return artistName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '') // Remove special characters
            .replace(/\s+/g, '');       // Remove spaces
    }
    
    /**
     * Checks if a generated Instagram handle is valid
     * @param {string} handle - Instagram handle to validate
     * @returns {boolean} True if handle length and format are valid
     */
    static isValidInstagramHandle(handle) {
        if (!handle || typeof handle !== 'string') {
            return false;
        }
        
        const trimmedHandle = handle.trim();
        return trimmedHandle.length > 0 && trimmedHandle.length <= 30;
    }
    
    /**
     * Determines Instagram URL and confirmation status for artist
     * @param {Object} artistData - Spotify artist data
     * @returns {Object} Object with instagramUrl and isConfirmed properties
     */
    static getInstagramInfo(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return {
                instagramUrl: null,
                isConfirmed: false
            };
        }
        
        // Check if Spotify provides Instagram URL directly
        if (artistData.external_urls && 
            artistData.external_urls.instagram && 
            typeof artistData.external_urls.instagram === 'string') {
            return {
                instagramUrl: artistData.external_urls.instagram,
                isConfirmed: true
            };
        }
        
        // Fallback: construct potential Instagram URL from artist name
        if (artistData.name) {
            const handle = this.generateInstagramHandle(artistData.name);
            
            if (this.isValidInstagramHandle(handle)) {
                return {
                    instagramUrl: `https://www.instagram.com/${handle}/`,
                    isConfirmed: false
                };
            }
        }
        
        return {
            instagramUrl: null,
            isConfirmed: false
        };
    }
    
    /**
     * Processes and normalizes genre information
     * @param {Array} genres - Array of genre strings
     * @returns {string} Formatted genre string
     */
    static processGenres(genres) {
        if (!genres || !Array.isArray(genres)) {
            return 'No genres listed';
        }
        
        if (genres.length === 0) {
            return 'No genres listed';
        }
        
        // Filter out empty or invalid genres
        const validGenres = genres.filter(genre => 
            genre && typeof genre === 'string' && genre.trim().length > 0
        );
        
        if (validGenres.length === 0) {
            return 'No genres listed';
        }
        
        // Capitalize first letter of each genre
        const capitalizedGenres = validGenres.map(genre => 
            genre.trim().charAt(0).toUpperCase() + genre.trim().slice(1).toLowerCase()
        );
        
        return capitalizedGenres.join(', ');
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
        
        return followerCount.toLocaleString();
    }
    
    /**
     * Processes and validates popularity score
     * @param {number} popularity - Popularity score (0-100)
     * @returns {number} Validated popularity score
     */
    static processPopularity(popularity) {
        if (typeof popularity !== 'number') {
            return 0;
        }
        
        // Clamp between 0 and 100
        return Math.max(0, Math.min(100, Math.round(popularity)));
    }
    
    /**
     * Extracts and processes external URLs
     * @param {Object} externalUrls - External URLs object from Spotify
     * @returns {Object} Processed external URLs
     */
    static processExternalUrls(externalUrls) {
        const defaultUrls = {
            spotify: '',
            instagram: null,
            twitter: null,
            facebook: null
        };
        
        if (!externalUrls || typeof externalUrls !== 'object') {
            return defaultUrls;
        }
        
        return {
            spotify: externalUrls.spotify || '',
            instagram: externalUrls.instagram || null,
            twitter: externalUrls.twitter || null,
            facebook: externalUrls.facebook || null
        };
    }
    
    /**
     * Formats complete artist data for display
     * @param {Object} artistData - Raw Spotify artist data
     * @returns {Object} Formatted artist information
     */
    static formatArtistData(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return this.getDefaultFormattedData();
        }
        
        const largestImage = this.findLargestImage(artistData.images);
        const defaultImage = artistData.images && artistData.images.length > 0 ? artistData.images[0] : null;
        const instagram = this.getInstagramInfo(artistData);
        const externalUrls = this.processExternalUrls(artistData.external_urls);
        
        return {
            name: artistData.name || 'Unknown Artist',
            imageUrl: largestImage?.url || defaultImage?.url || '',
            imageWidth: largestImage?.width || defaultImage?.width || 300,
            imageHeight: largestImage?.height || defaultImage?.height || 300,
            followers: this.formatFollowerCount(artistData.followers?.total),
            genres: this.processGenres(artistData.genres),
            popularity: this.processPopularity(artistData.popularity),
            spotifyUrl: externalUrls.spotify,
            instagramUrl: instagram.instagramUrl,
            isInstagramConfirmed: instagram.isConfirmed,
            externalUrls: externalUrls,
            rawData: JSON.stringify(artistData, null, 2)
        };
    }
    
    /**
     * Returns default formatted artist data structure
     * @returns {Object} Default formatted data
     */
    static getDefaultFormattedData() {
        return {
            name: 'Unknown Artist',
            imageUrl: '',
            imageWidth: 300,
            imageHeight: 300,
            followers: '0',
            genres: 'No genres listed',
            popularity: 0,
            spotifyUrl: '',
            instagramUrl: null,
            isInstagramConfirmed: false,
            externalUrls: {
                spotify: '',
                instagram: null,
                twitter: null,
                facebook: null
            },
            rawData: '{}'
        };
    }
    
    /**
     * Compares artist popularity levels
     * @param {Object} artist1 - First artist data
     * @param {Object} artist2 - Second artist data
     * @returns {number} Comparison result (-1, 0, 1)
     */
    static comparePopularity(artist1, artist2) {
        const pop1 = this.processPopularity(artist1?.popularity);
        const pop2 = this.processPopularity(artist2?.popularity);
        
        if (pop1 < pop2) return -1;
        if (pop1 > pop2) return 1;
        return 0;
    }
    
    /**
     * Extracts artist summary information
     * @param {Object} artistData - Raw artist data
     * @returns {Object} Artist summary
     */
    static extractArtistSummary(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return {
                id: null,
                name: 'Unknown Artist',
                popularity: 0,
                followerCount: 0,
                genreCount: 0,
                hasImage: false
            };
        }
        
        return {
            id: artistData.id || null,
            name: artistData.name || 'Unknown Artist',
            popularity: this.processPopularity(artistData.popularity),
            followerCount: artistData.followers?.total || 0,
            genreCount: Array.isArray(artistData.genres) ? artistData.genres.length : 0,
            hasImage: Array.isArray(artistData.images) && artistData.images.length > 0
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistApiProcessors;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistApiProcessors = ArtistApiProcessors;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistApiProcessors = ArtistApiProcessors;
}