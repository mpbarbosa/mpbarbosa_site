/**
 * ================================================================================
 * ARTIST UI PROCESSORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure data processing functions for artist UI components and content transformation.
 * Contains all business logic for HTML escaping, data formatting, and content processing.
 * 
 * PROCESSING TYPES:
 * - HTML Content Processing (escaping, sanitization, formatting)
 * - Artist Data Transformation (API response to display format)
 * - URL Processing and Construction (security, formatting, validation)
 * - Content Formatting (numbers, text, dates, measurements)
 * - Template Data Preparation (structure, safety, completeness)
 * - Accessibility Enhancement (ARIA attributes, semantic markup)
 * 
 * PATTERNS:
 * - Pure functions with no side effects
 * - Immutable data transformations
 * - Comprehensive input sanitization for security
 * - Consistent output formats for reliability
 * - Error handling with graceful degradation
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistUIProcessors {
    
    /**
     * Escapes HTML special characters to prevent XSS attacks
     * @param {any} text - Text content to escape
     * @returns {string} Escaped text safe for HTML insertion
     */
    static escapeHtml(text) {
        if (text === null || text === undefined) {
            return '';
        }
        
        const textStr = String(text);
        if (textStr.length === 0) {
            return '';
        }
        
        // Use a more comprehensive escaping approach
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#96;',
            '=': '&#61;'
        };
        
        return textStr.replace(/[&<>"'`=\/]/g, (char) => escapeMap[char]);
    }
    
    /**
     * Processes and formats artist data for display
     * @param {Object} rawArtistData - Raw artist data from API
     * @returns {Object} Formatted artist data ready for UI display
     */
    static formatArtistDisplayData(rawArtistData) {
        if (!rawArtistData || typeof rawArtistData !== 'object') {
            return this.createEmptyArtistData();
        }
        
        return {
            // Basic artist information
            name: this.escapeHtml(rawArtistData.name || 'Unknown Artist'),
            
            // Image handling with fallbacks
            imageUrl: this.processImageUrl(rawArtistData.images),
            imageWidth: this.extractImageDimension(rawArtistData.images, 'width'),
            imageHeight: this.extractImageDimension(rawArtistData.images, 'height'),
            
            // Social media and external links
            spotifyUrl: this.processSpotifyUrl(rawArtistData.external_urls),
            instagramUrl: this.processInstagramUrl(rawArtistData.external_urls),
            isInstagramConfirmed: this.validateInstagramLink(rawArtistData.external_urls),
            
            // Statistics and metrics
            followers: this.formatFollowerCount(rawArtistData.followers),
            genres: this.formatGenresList(rawArtistData.genres),
            popularity: this.formatPopularityScore(rawArtistData.popularity),
            
            // Raw data for debugging
            rawData: this.formatRawDataString(rawArtistData)
        };
    }
    
    /**
     * Processes image URL from Spotify images array
     * @param {Array} images - Spotify images array
     * @returns {string} Best quality image URL or fallback
     */
    static processImageUrl(images) {
        if (!Array.isArray(images) || images.length === 0) {
            return this.getDefaultArtistImage();
        }
        
        // Sort by size (largest first) and pick the best quality
        const sortedImages = images
            .filter(img => img && img.url)
            .sort((a, b) => (b.width * b.height) - (a.width * a.height));
        
        return sortedImages.length > 0 ? sortedImages[0].url : this.getDefaultArtistImage();
    }
    
    /**
     * Extracts image dimensions from Spotify images array
     * @param {Array} images - Spotify images array
     * @param {string} dimension - 'width' or 'height'
     * @returns {number} Image dimension or default
     */
    static extractImageDimension(images, dimension) {
        if (!Array.isArray(images) || images.length === 0) {
            return dimension === 'width' ? 300 : 300;
        }
        
        const primaryImage = images
            .filter(img => img && img[dimension])
            .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
        
        return primaryImage ? primaryImage[dimension] : (dimension === 'width' ? 300 : 300);
    }
    
    /**
     * Processes Spotify profile URL from external URLs
     * @param {Object} externalUrls - External URLs object from API
     * @returns {string} Spotify profile URL or fallback
     */
    static processSpotifyUrl(externalUrls) {
        if (!externalUrls || typeof externalUrls !== 'object') {
            return '#';
        }
        
        const spotifyUrl = externalUrls.spotify;
        if (!spotifyUrl || typeof spotifyUrl !== 'string') {
            return '#';
        }
        
        // Validate that it's a proper Spotify URL
        if (spotifyUrl.includes('open.spotify.com') || spotifyUrl.includes('spotify:')) {
            return spotifyUrl;
        }
        
        return '#';
    }
    
    /**
     * Processes Instagram URL from external URLs or constructs search URL
     * @param {Object} externalUrls - External URLs object from API
     * @returns {string|null} Instagram URL or null if not available
     */
    static processInstagramUrl(externalUrls) {
        if (!externalUrls || typeof externalUrls !== 'object') {
            return null;
        }
        
        // Check for direct Instagram link
        if (externalUrls.instagram && typeof externalUrls.instagram === 'string') {
            return externalUrls.instagram;
        }
        
        // For now, return null - Instagram integration would require additional logic
        return null;
    }
    
    /**
     * Validates Instagram link authenticity
     * @param {Object} externalUrls - External URLs object from API
     * @returns {boolean} True if Instagram link is confirmed from Spotify
     */
    static validateInstagramLink(externalUrls) {
        if (!externalUrls || typeof externalUrls !== 'object') {
            return false;
        }
        
        // Only return true if we have a direct Instagram URL from Spotify
        return !!(externalUrls.instagram && typeof externalUrls.instagram === 'string');
    }
    
    /**
     * Formats follower count for display
     * @param {Object|number} followers - Followers object or count
     * @returns {string} Formatted follower count
     */
    static formatFollowerCount(followers) {
        let count;
        
        if (typeof followers === 'object' && followers !== null) {
            count = followers.total;
        } else if (typeof followers === 'number') {
            count = followers;
        } else {
            return 'Unknown';
        }
        
        if (typeof count !== 'number' || isNaN(count)) {
            return 'Unknown';
        }
        
        // Format large numbers with appropriate suffixes
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        } else {
            return count.toLocaleString();
        }
    }
    
    /**
     * Formats genres list for display
     * @param {Array} genres - Array of genre strings
     * @returns {string} Formatted genres string
     */
    static formatGenresList(genres) {
        if (!Array.isArray(genres) || genres.length === 0) {
            return 'Unknown';
        }
        
        // Filter out empty/invalid genres and escape them
        const validGenres = genres
            .filter(genre => genre && typeof genre === 'string' && genre.trim().length > 0)
            .map(genre => this.escapeHtml(genre.trim()))
            .slice(0, 5); // Limit to first 5 genres
        
        if (validGenres.length === 0) {
            return 'Unknown';
        }
        
        // Capitalize first letter of each genre
        const capitalizedGenres = validGenres.map(genre => 
            genre.charAt(0).toUpperCase() + genre.slice(1)
        );
        
        return capitalizedGenres.join(', ');
    }
    
    /**
     * Formats popularity score for display
     * @param {any} popularity - Popularity score from API
     * @returns {string} Formatted popularity score
     */
    static formatPopularityScore(popularity) {
        const score = Number(popularity);
        
        if (isNaN(score) || score < 0 || score > 100) {
            return 'Unknown';
        }
        
        return score.toString();
    }
    
    /**
     * Formats raw JSON data for display in details section
     * @param {Object} rawData - Raw API response data
     * @returns {string} Formatted JSON string
     */
    static formatRawDataString(rawData) {
        if (!rawData || typeof rawData !== 'object') {
            return '{}';
        }
        
        try {
            return JSON.stringify(rawData, null, 2);
        } catch (error) {
            return '{"error": "Unable to serialize data"}';
        }
    }
    
    /**
     * Processes error message for display with safety and formatting
     * @param {any} message - Error message to process
     * @returns {Object} Processed error information
     */
    static processErrorMessage(message) {
        if (message === null || message === undefined) {
            return {
                displayMessage: 'An unknown error occurred',
                needsAuthLink: false,
                isSecure: true
            };
        }
        
        const messageStr = String(message);
        const escapedMessage = this.escapeHtml(messageStr);
        
        // Check if this is an authentication-related error
        const authKeywords = ['authenticate', 'login', 'token', 'access', 'authorization', 'forbidden'];
        const needsAuthLink = authKeywords.some(keyword => 
            messageStr.toLowerCase().includes(keyword)
        );
        
        return {
            displayMessage: escapedMessage,
            needsAuthLink: needsAuthLink,
            isSecure: true,
            originalLength: messageStr.length
        };
    }
    
    /**
     * Processes URL for security and formatting
     * @param {string} url - URL to process
     * @param {Object} options - Processing options
     * @returns {Object} Processed URL information
     */
    static processUrl(url, options = {}) {
        const {
            requireHttps = false,
            allowRelative = true,
            maxLength = 2000
        } = options;
        
        if (!url || typeof url !== 'string') {
            return {
                processedUrl: '#',
                isValid: false,
                isSecure: false,
                error: 'Invalid URL provided'
            };
        }
        
        const urlStr = url.trim();
        if (urlStr.length === 0 || urlStr.length > maxLength) {
            return {
                processedUrl: '#',
                isValid: false,
                isSecure: false,
                error: urlStr.length === 0 ? 'Empty URL' : 'URL too long'
            };
        }
        
        // Check for dangerous protocols
        if (urlStr.toLowerCase().startsWith('javascript:') || 
            urlStr.toLowerCase().startsWith('data:') ||
            urlStr.toLowerCase().startsWith('vbscript:')) {
            return {
                processedUrl: '#',
                isValid: false,
                isSecure: false,
                error: 'Potentially dangerous URL protocol'
            };
        }
        
        try {
            const urlObj = new URL(urlStr);
            const isSecure = urlObj.protocol === 'https:';
            
            if (requireHttps && !isSecure) {
                return {
                    processedUrl: '#',
                    isValid: false,
                    isSecure: false,
                    error: 'HTTPS required but URL is not secure'
                };
            }
            
            return {
                processedUrl: urlStr,
                isValid: true,
                isSecure: isSecure,
                protocol: urlObj.protocol,
                hostname: urlObj.hostname
            };
            
        } catch (error) {
            // Try to handle as relative URL
            if (allowRelative && (urlStr.startsWith('/') || urlStr.startsWith('./') || urlStr.startsWith('../'))) {
                return {
                    processedUrl: urlStr,
                    isValid: true,
                    isSecure: false,
                    isRelative: true
                };
            }
            
            return {
                processedUrl: '#',
                isValid: false,
                isSecure: false,
                error: `Invalid URL format: ${error.message}`
            };
        }
    }
    
    /**
     * Creates HTML attributes string from object
     * @param {Object} attributes - Attributes object
     * @returns {string} Safe HTML attributes string
     */
    static processHtmlAttributes(attributes) {
        if (!attributes || typeof attributes !== 'object') {
            return '';
        }
        
        const safeAttributes = [];
        const allowedAttributes = [
            'id', 'class', 'src', 'alt', 'width', 'height', 'href', 'target', 
            'rel', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby',
            'aria-hidden', 'tabindex', 'title', 'loading'
        ];
        
        Object.keys(attributes).forEach(key => {
            const lowerKey = key.toLowerCase();
            
            // Only allow safe attributes
            if (allowedAttributes.includes(lowerKey)) {
                const value = attributes[key];
                if (value !== null && value !== undefined) {
                    const escapedValue = this.escapeHtml(String(value));
                    safeAttributes.push(`${lowerKey}="${escapedValue}"`);
                }
            }
        });
        
        return safeAttributes.join(' ');
    }
    
    /**
     * Processes text content for accessibility
     * @param {string} text - Text content
     * @param {Object} options - Accessibility options
     * @returns {Object} Processed accessibility information
     */
    static processAccessibilityText(text, options = {}) {
        const {
            maxLength = 150,
            stripHtml = true,
            addDescription = false
        } = options;
        
        if (!text || typeof text !== 'string') {
            return {
                accessibleText: '',
                ariaLabel: '',
                needsDescription: false
            };
        }
        
        let processedText = text;
        
        // Strip HTML tags if requested
        if (stripHtml) {
            processedText = text.replace(/<[^>]*>/g, '');
        }
        
        // Trim and limit length
        processedText = processedText.trim();
        if (processedText.length > maxLength) {
            processedText = processedText.substring(0, maxLength - 3) + '...';
        }
        
        return {
            accessibleText: processedText,
            ariaLabel: processedText,
            needsDescription: addDescription && processedText.length > 50,
            originalLength: text.length
        };
    }
    
    /**
     * Creates responsive image attributes
     * @param {string} imageUrl - Image URL
     * @param {Object} dimensions - Image dimensions
     * @returns {Object} Responsive image attributes
     */
    static processResponsiveImage(imageUrl, dimensions = {}) {
        const { width = 300, height = 300 } = dimensions;
        
        const processedUrl = this.processUrl(imageUrl);
        if (!processedUrl.isValid) {
            return {
                src: this.getDefaultArtistImage(),
                width: 300,
                height: 300,
                loading: 'lazy',
                isDefault: true
            };
        }
        
        return {
            src: processedUrl.processedUrl,
            width: Math.min(Math.max(width, 100), 800),  // Clamp between 100-800px
            height: Math.min(Math.max(height, 100), 800), // Clamp between 100-800px
            loading: 'lazy',
            isDefault: false
        };
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Creates empty artist data structure for fallback
     * @returns {Object} Empty artist data with safe defaults
     */
    static createEmptyArtistData() {
        return {
            name: 'Unknown Artist',
            imageUrl: this.getDefaultArtistImage(),
            imageWidth: 300,
            imageHeight: 300,
            spotifyUrl: '#',
            instagramUrl: null,
            isInstagramConfirmed: false,
            followers: 'Unknown',
            genres: 'Unknown',
            popularity: 'Unknown',
            rawData: '{}'
        };
    }
    
    /**
     * Gets default artist image URL
     * @returns {string} Default artist image URL
     */
    static getDefaultArtistImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
    }
    
    /**
     * Sanitizes and validates text input
     * @param {any} input - Input to sanitize
     * @param {string} fallback - Fallback value
     * @returns {string} Sanitized text
     */
    static sanitizeTextInput(input, fallback = '') {
        if (input === null || input === undefined) {
            return fallback;
        }
        
        const textStr = String(input).trim();
        return textStr.length > 0 ? this.escapeHtml(textStr) : fallback;
    }
    
    /**
     * Validates and processes numeric input
     * @param {any} input - Numeric input
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} fallback - Fallback value
     * @returns {number} Processed number
     */
    static processNumericInput(input, min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0) {
        const num = Number(input);
        
        if (isNaN(num)) {
            return fallback;
        }
        
        return Math.min(Math.max(num, min), max);
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistUIProcessors;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistUIProcessors = ArtistUIProcessors;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistUIProcessors = ArtistUIProcessors;
}