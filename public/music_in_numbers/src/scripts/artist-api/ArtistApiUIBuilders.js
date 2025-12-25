/**
 * ================================================================================
 * ARTIST API UI BUILDERS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure UI building functions for artist-related display components.
 * All functions are deterministic with no side effects - no DOM manipulation.
 * 
 * UI BUILDING TYPES:
 * - Artist Information Display Components
 * - Image Display Builders
 * - Social Media Integration Components
 * - Artist Statistics Display
 * - Error and Loading State Components
 * 
 * PATTERNS:
 * - Pure functions only - no DOM manipulation
 * - HTML string generation without side effects
 * - Consistent component structure
 * - Accessible HTML with proper attributes
 * - Material Design component styles
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistApiUIBuilders {
    
    /**
     * Builds artist header component HTML
     * @param {Object} artistData - Formatted artist data
     * @returns {string} HTML string for artist header
     */
    static buildArtistHeader(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return this.buildErrorComponent('Invalid artist data');
        }
        
        const imageHtml = artistData.imageUrl 
            ? `<img src="${this.escapeHtml(artistData.imageUrl)}" 
                   alt="${this.escapeHtml(artistData.name)}" 
                   width="${artistData.imageWidth || 300}" 
                   height="${artistData.imageHeight || 300}"
                   class="artist-image" loading="lazy">`
            : this.buildPlaceholderImage(artistData.name);
            
        return `
            <header class="artist-header">
                <div class="artist-image-container">
                    ${imageHtml}
                </div>
                <div class="artist-info">
                    <h1 class="artist-name">${this.escapeHtml(artistData.name)}</h1>
                    <div class="artist-stats">
                        <span class="followers">
                            <i class="material-icons">people</i>
                            ${this.escapeHtml(artistData.followers)} followers
                        </span>
                        <span class="popularity">
                            <i class="material-icons">trending_up</i>
                            ${artistData.popularity}% popularity
                        </span>
                    </div>
                </div>
            </header>
        `;
    }
    
    /**
     * Builds artist genres component HTML
     * @param {string} genres - Formatted genres string
     * @returns {string} HTML string for genres display
     */
    static buildGenresComponent(genres) {
        if (!genres || typeof genres !== 'string') {
            return '<div class="genres-container">No genres available</div>';
        }
        
        const genreArray = genres.split(', ').filter(g => g.trim().length > 0);
        
        if (genreArray.length === 0) {
            return '<div class="genres-container">No genres available</div>';
        }
        
        const genreTags = genreArray.map(genre => 
            `<span class="genre-tag">${this.escapeHtml(genre.trim())}</span>`
        ).join('');
        
        return `
            <div class="genres-container">
                <h3 class="genres-title">
                    <i class="material-icons">music_note</i>
                    Genres
                </h3>
                <div class="genres-list">
                    ${genreTags}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds social media links component HTML
     * @param {Object} externalUrls - External URLs object
     * @param {string} instagramUrl - Instagram URL
     * @param {boolean} isInstagramConfirmed - Whether Instagram URL is confirmed
     * @returns {string} HTML string for social media links
     */
    static buildSocialLinksComponent(externalUrls, instagramUrl, isInstagramConfirmed) {
        const links = [];
        
        // Spotify link (primary)
        if (externalUrls?.spotify) {
            links.push(`
                <a href="${this.escapeHtml(externalUrls.spotify)}" 
                   target="_blank" rel="noopener noreferrer" 
                   class="social-link spotify-link">
                    <i class="fab fa-spotify"></i>
                    <span>Listen on Spotify</span>
                </a>
            `);
        }
        
        // Instagram link
        if (instagramUrl) {
            const confirmationClass = isInstagramConfirmed ? 'confirmed' : 'unconfirmed';
            const title = isInstagramConfirmed 
                ? 'Follow on Instagram' 
                : 'Potential Instagram profile (not verified)';
                
            links.push(`
                <a href="${this.escapeHtml(instagramUrl)}" 
                   target="_blank" rel="noopener noreferrer" 
                   class="social-link instagram-link ${confirmationClass}"
                   title="${title}">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram${isInstagramConfirmed ? '' : ' (unverified)'}</span>
                </a>
            `);
        }
        
        // Other social media platforms
        if (externalUrls?.twitter) {
            links.push(`
                <a href="${this.escapeHtml(externalUrls.twitter)}" 
                   target="_blank" rel="noopener noreferrer" 
                   class="social-link twitter-link">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </a>
            `);
        }
        
        if (externalUrls?.facebook) {
            links.push(`
                <a href="${this.escapeHtml(externalUrls.facebook)}" 
                   target="_blank" rel="noopener noreferrer" 
                   class="social-link facebook-link">
                    <i class="fab fa-facebook"></i>
                    <span>Facebook</span>
                </a>
            `);
        }
        
        if (links.length === 0) {
            return '<div class="social-links-container">No social media links available</div>';
        }
        
        return `
            <div class="social-links-container">
                <h3 class="social-title">
                    <i class="material-icons">link</i>
                    Links
                </h3>
                <div class="social-links">
                    ${links.join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds complete artist profile component HTML
     * @param {Object} artistData - Complete formatted artist data
     * @returns {string} HTML string for full artist profile
     */
    static buildArtistProfile(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return this.buildErrorComponent('Unable to load artist profile');
        }
        
        const headerHtml = this.buildArtistHeader(artistData);
        const genresHtml = this.buildGenresComponent(artistData.genres);
        const socialLinksHtml = this.buildSocialLinksComponent(
            artistData.externalUrls, 
            artistData.instagramUrl, 
            artistData.isInstagramConfirmed
        );
        
        return `
            <div class="artist-profile">
                ${headerHtml}
                <div class="artist-details">
                    ${genresHtml}
                    ${socialLinksHtml}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds loading state component HTML
     * @param {string} message - Loading message (optional)
     * @returns {string} HTML string for loading component
     */
    static buildLoadingComponent(message = 'Loading artist information...') {
        return `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p class="loading-message">${this.escapeHtml(message)}</p>
            </div>
        `;
    }
    
    /**
     * Builds error state component HTML
     * @param {string} errorMessage - Error message to display
     * @returns {string} HTML string for error component
     */
    static buildErrorComponent(errorMessage) {
        const safeMessage = this.escapeHtml(errorMessage || 'An error occurred');
        
        return `
            <div class="error-container">
                <div class="error-icon">
                    <i class="material-icons">error_outline</i>
                </div>
                <p class="error-message">${safeMessage}</p>
                <button class="retry-button" onclick="location.reload()">
                    <i class="material-icons">refresh</i>
                    Try Again
                </button>
            </div>
        `;
    }
    
    /**
     * Builds placeholder image HTML for artists without images
     * @param {string} artistName - Artist name for alt text
     * @returns {string} HTML string for placeholder image
     */
    static buildPlaceholderImage(artistName) {
        const safeArtistName = this.escapeHtml(artistName || 'Unknown Artist');
        const initials = this.extractInitials(artistName);
        
        return `
            <div class="artist-image-placeholder">
                <div class="placeholder-content">
                    <span class="placeholder-initials">${initials}</span>
                </div>
                <span class="sr-only">${safeArtistName} profile image not available</span>
            </div>
        `;
    }
    
    /**
     * Builds artist statistics component HTML
     * @param {Object} artistData - Artist data with statistics
     * @returns {string} HTML string for statistics component
     */
    static buildArtistStats(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return '';
        }
        
        const stats = [
            {
                icon: 'people',
                label: 'Followers',
                value: artistData.followers || '0'
            },
            {
                icon: 'trending_up',
                label: 'Popularity',
                value: `${artistData.popularity || 0}%`
            },
            {
                icon: 'music_note',
                label: 'Genres',
                value: artistData.genres && artistData.genres !== 'No genres listed' 
                    ? artistData.genres.split(', ').length.toString()
                    : '0'
            }
        ];
        
        const statsHtml = stats.map(stat => `
            <div class="stat-item">
                <i class="material-icons stat-icon">${stat.icon}</i>
                <div class="stat-content">
                    <span class="stat-value">${this.escapeHtml(stat.value)}</span>
                    <span class="stat-label">${stat.label}</span>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="artist-stats-detailed">
                ${statsHtml}
            </div>
        `;
    }
    
    /**
     * Builds artist card component HTML (for lists/grids)
     * @param {Object} artistData - Artist data
     * @returns {string} HTML string for artist card
     */
    static buildArtistCard(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return this.buildErrorComponent('Invalid artist data');
        }
        
        const imageHtml = artistData.imageUrl 
            ? `<img src="${this.escapeHtml(artistData.imageUrl)}" 
                   alt="${this.escapeHtml(artistData.name)}"
                   class="card-image" loading="lazy">`
            : this.buildPlaceholderImage(artistData.name);
            
        return `
            <div class="artist-card">
                <div class="card-image-container">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${this.escapeHtml(artistData.name)}</h3>
                    <p class="card-followers">${this.escapeHtml(artistData.followers)} followers</p>
                    <div class="card-popularity">
                        <div class="popularity-bar">
                            <div class="popularity-fill" style="width: ${artistData.popularity || 0}%"></div>
                        </div>
                        <span class="popularity-text">${artistData.popularity || 0}%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Builds raw data debug component HTML (for development)
     * @param {string} rawData - JSON string of raw artist data
     * @returns {string} HTML string for debug component
     */
    static buildDebugComponent(rawData) {
        if (!rawData || typeof rawData !== 'string') {
            return '';
        }
        
        return `
            <details class="debug-container">
                <summary class="debug-title">
                    <i class="material-icons">code</i>
                    Raw Artist Data (Debug)
                </summary>
                <pre class="debug-content"><code>${this.escapeHtml(rawData)}</code></pre>
            </details>
        `;
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Escapes HTML characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
    
    /**
     * Extracts initials from artist name for placeholder
     * @param {string} artistName - Artist name
     * @returns {string} Initials (max 2 characters)
     */
    static extractInitials(artistName) {
        if (!artistName || typeof artistName !== 'string') {
            return '?';
        }
        
        const words = artistName.trim().split(/\s+/);
        
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    
    /**
     * Validates and sanitizes CSS class names
     * @param {string} className - CSS class name to validate
     * @returns {string} Safe CSS class name
     */
    static sanitizeClassName(className) {
        if (typeof className !== 'string') {
            return '';
        }
        
        return className.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    }
    
    /**
     * Builds accessibility attributes string
     * @param {Object} options - Accessibility options
     * @returns {string} HTML attributes string
     */
    static buildA11yAttributes(options = {}) {
        const attributes = [];
        
        if (options.label) {
            attributes.push(`aria-label="${this.escapeHtml(options.label)}"`);
        }
        
        if (options.describedBy) {
            attributes.push(`aria-describedby="${this.sanitizeClassName(options.describedBy)}"`);
        }
        
        if (options.hidden) {
            attributes.push('aria-hidden="true"');
        }
        
        if (options.expanded !== undefined) {
            attributes.push(`aria-expanded="${options.expanded ? 'true' : 'false'}"`);
        }
        
        return attributes.join(' ');
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistApiUIBuilders;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistApiUIBuilders = ArtistApiUIBuilders;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistApiUIBuilders = ArtistApiUIBuilders;
}