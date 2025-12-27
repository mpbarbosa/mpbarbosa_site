/**
 * ================================================================================
 * ARTIST UI BUILDERS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure UI building functions for artist page components and HTML template generation.
 * Contains all HTML construction logic with comprehensive accessibility and security features.
 * 
 * BUILDING TYPES:
 * - Artist Display Components (profile cards, information sections)
 * - Error State Components (error messages, fallback displays)
 * - Loading State Components (spinners, placeholders, progress indicators)
 * - Interactive Elements (buttons, links, form components)
 * - Layout Components (containers, sections, responsive layouts)
 * - Accessibility Components (ARIA attributes, semantic markup)
 * 
 * PATTERNS:
 * - Pure functions with no side effects or DOM manipulation
 * - HTML string generation with comprehensive escaping
 * - Accessibility-first approach with ARIA attributes
 * - Responsive design with mobile-first considerations
 * - Security-focused with XSS prevention
 * - Semantic HTML5 markup for better structure
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistUIBuilders {
    
    /**
     * Builds complete artist display HTML with all components
     * @param {Object} formattedData - Processed artist data
     * @param {Object} options - Display options and configuration
     * @returns {string} Complete artist display HTML
     */
    static buildArtistDisplay(formattedData, options = {}) {
        const {
            showInstagram = true,
            showRawData = true,
            enableImageLazyLoading = true,
            compactMode = false
        } = options;
        
        if (!formattedData || typeof formattedData !== 'object') {
            return this.buildErrorDisplay('Invalid artist data provided');
        }
        
        const instagramSection = showInstagram && formattedData.instagramUrl ? 
            this.buildInstagramSection(formattedData) : '';
        
        const rawDataSection = showRawData ? 
            this.buildRawDataSection(formattedData.rawData) : '';
        
        const artistImage = this.buildArtistImage(formattedData, { 
            lazyLoading: enableImageLazyLoading,
            compact: compactMode 
        });
        
        const artistStats = this.buildArtistStats(formattedData, { compact: compactMode });
        const spotifyLink = this.buildSpotifyLink(formattedData);
        
        return `
            <article class="artist-display ${compactMode ? 'artist-display--compact' : ''}" 
                     role="article" 
                     aria-labelledby="artist-name-${this.generateUniqueId()}">
                <div class="artist-display__content">
                    ${artistImage}
                    <div class="artist-display__info">
                        ${artistStats}
                        ${spotifyLink}
                        ${instagramSection}
                    </div>
                </div>
                ${rawDataSection}
            </article>
        `;
    }
    
    /**
     * Builds artist image component with responsive features
     * @param {Object} artistData - Artist data with image information
     * @param {Object} options - Image display options
     * @returns {string} Artist image HTML component
     */
    static buildArtistImage(artistData, options = {}) {
        const {
            lazyLoading = true,
            compact = false,
            showOverlay = true
        } = options;
        
        const uniqueId = this.generateUniqueId();
        const imageId = `artist-image-${uniqueId}`;
        const nameId = `artist-name-${uniqueId}`;
        
        const imageAttributes = [
            `id="${imageId}"`,
            `src="${artistData.imageUrl}"`,
            `alt="${artistData.name}"`,
            `class="artist-image ${compact ? 'artist-image--compact' : ''}"`,
            `width="${artistData.imageWidth}"`,
            `height="${artistData.imageHeight}"`,
            lazyLoading ? 'loading="lazy"' : '',
            'decoding="async"'
        ].filter(attr => attr).join(' ');
        
        const nameOverlay = showOverlay ? `
            <h2 id="${nameId}" class="artist-name-overlay">
                ${artistData.name}
            </h2>
        ` : '';
        
        return `
            <div class="artist-image-container ${compact ? 'artist-image-container--compact' : ''}"
                 role="img" 
                 aria-labelledby="${nameId}">
                <img ${imageAttributes}>
                ${nameOverlay}
            </div>
        `;
    }
    
    /**
     * Builds artist statistics section
     * @param {Object} artistData - Artist data with statistics
     * @param {Object} options - Statistics display options
     * @returns {string} Artist statistics HTML
     */
    static buildArtistStats(artistData, options = {}) {
        const { compact = false, showLabels = true } = options;
        
        const statsClass = `artist-stats ${compact ? 'artist-stats--compact' : ''}`;
        const labelClass = showLabels ? 'artist-stats__label' : 'sr-only';
        
        return `
            <section class="${statsClass}" aria-label="Artist statistics">
                <div class="artist-stats__item">
                    <span class="${labelClass}">Followers:</span>
                    <span class="artist-stats__value" aria-label="${artistData.followers} followers">
                        ${artistData.followers}
                    </span>
                </div>
                <div class="artist-stats__item">
                    <span class="${labelClass}">Genres:</span>
                    <span class="artist-stats__value" aria-label="Music genres: ${artistData.genres}">
                        ${artistData.genres}
                    </span>
                </div>
                <div class="artist-stats__item">
                    <span class="${labelClass}">Popularity:</span>
                    <span class="artist-stats__value" aria-label="Popularity score ${artistData.popularity} out of 100">
                        ${artistData.popularity}/100
                    </span>
                </div>
            </section>
        `;
    }
    
    /**
     * Builds Spotify link component
     * @param {Object} artistData - Artist data with Spotify URL
     * @returns {string} Spotify link HTML
     */
    static buildSpotifyLink(artistData) {
        return `
            <div class="spotify-link-container">
                <a href="${artistData.spotifyUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="spotify-link"
                   aria-label="View ${artistData.name} on Spotify (opens in new tab)">
                    <span class="spotify-link__icon" aria-hidden="true">🎵</span>
                    <span class="spotify-link__text">View Artist on Spotify</span>
                    <span class="spotify-link__external-indicator sr-only">Opens in new tab</span>
                </a>
            </div>
        `;
    }
    
    /**
     * Builds Instagram section if available
     * @param {Object} artistData - Artist data with Instagram information
     * @returns {string} Instagram section HTML
     */
    static buildInstagramSection(artistData) {
        if (!artistData.instagramUrl) {
            return '';
        }
        
        const linkText = artistData.isInstagramConfirmed ? 
            'Follow on Instagram' : 'Find on Instagram';
        const confirmationText = artistData.isInstagramConfirmed ? 
            'Verified Instagram link from Spotify' : 'Unverified Instagram link';
        
        return `
            <div class="instagram-section">
                <a href="${artistData.instagramUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="instagram-link ${artistData.isInstagramConfirmed ? 'instagram-link--verified' : 'instagram-link--unverified'}"
                   aria-label="${linkText} (opens in new tab)">
                    <i class="fa-brands fa-instagram" aria-hidden="true"></i>
                    <span class="instagram-link__text">${linkText}</span>
                </a>
                <p class="instagram-link__status">
                    <em>${confirmationText}</em>
                </p>
            </div>
        `;
    }
    
    /**
     * Builds raw data details section
     * @param {string} rawData - JSON string of raw artist data
     * @returns {string} Raw data section HTML
     */
    static buildRawDataSection(rawData) {
        const uniqueId = this.generateUniqueId();
        const detailsId = `raw-data-${uniqueId}`;
        
        return `
            <details class="raw-data-section" aria-labelledby="${detailsId}">
                <summary id="${detailsId}" class="raw-data-summary">
                    Raw JSON Data
                    <span class="raw-data-toggle-icon" aria-hidden="true">▼</span>
                </summary>
                <div class="raw-data-content" role="region" aria-label="Artist JSON data">
                    <pre class="raw-data-pre"><code class="raw-data-code">${rawData}</code></pre>
                    <button type="button" 
                            class="raw-data-copy-btn" 
                            aria-label="Copy raw data to clipboard"
                            data-copy-text="${rawData.replace(/"/g, '&quot;')}">
                        Copy to Clipboard
                    </button>
                </div>
            </details>
        `;
    }
    
    /**
     * Builds error display component
     * @param {string} message - Error message to display
     * @param {Object} options - Error display options
     * @returns {string} Error display HTML
     */
    static buildErrorDisplay(message, options = {}) {
        const {
            showIcon = true,
            allowRetry = false,
            showHomeLink = false,
            severity = 'error'
        } = options;
        
        const processedError = typeof window !== 'undefined' && window.ArtistUIProcessors ? 
            window.ArtistUIProcessors.processErrorMessage(message) :
            { displayMessage: String(message || 'An error occurred'), needsAuthLink: false };
        
        const severityClass = `error-display--${severity}`;
        const roleAttribute = severity === 'warning' ? 'alert' : 'alert';
        
        const iconHtml = showIcon ? `
            <div class="error-display__icon" aria-hidden="true">
                ${severity === 'warning' ? '⚠️' : '❌'}
            </div>
        ` : '';
        
        const retryButton = allowRetry ? `
            <button type="button" 
                    class="error-display__retry-btn"
                    onclick="location.reload()"
                    aria-label="Retry loading artist data">
                Try Again
            </button>
        ` : '';
        
        const homeLink = (processedError.needsAuthLink || showHomeLink) ? `
            <p class="error-display__navigation">
                <a href="index.html" class="error-display__home-link">
                    ${processedError.needsAuthLink ? 'Go to authentication page' : 'Return to home page'}
                </a>
            </p>
        ` : '';
        
        return `
            <div class="error-display ${severityClass}" role="${roleAttribute}">
                <div class="error-display__content">
                    ${iconHtml}
                    <div class="error-display__message">
                        <p class="error-display__text">${processedError.displayMessage}</p>
                        ${homeLink}
                        ${retryButton}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Builds loading state component
     * @param {Object} options - Loading display options
     * @returns {string} Loading state HTML
     */
    static buildLoadingState(options = {}) {
        const {
            message = 'Loading artist information...',
            showSpinner = true,
            showProgress = false,
            progressValue = 0
        } = options;
        
        const spinnerHtml = showSpinner ? `
            <div class="loading-spinner" aria-hidden="true">
                <div class="loading-spinner__circle"></div>
            </div>
        ` : '';
        
        const progressHtml = showProgress ? `
            <div class="loading-progress">
                <div class="loading-progress__bar" 
                     role="progressbar" 
                     aria-valuenow="${progressValue}" 
                     aria-valuemin="0" 
                     aria-valuemax="100"
                     style="width: ${progressValue}%">
                </div>
            </div>
        ` : '';
        
        return `
            <div class="loading-state" role="status" aria-live="polite">
                <div class="loading-state__content">
                    ${spinnerHtml}
                    <p class="loading-state__message">${message}</p>
                    ${progressHtml}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds placeholder component for missing data
     * @param {Object} options - Placeholder options
     * @returns {string} Placeholder HTML
     */
    static buildPlaceholder(options = {}) {
        const {
            type = 'artist',
            message = 'No artist data available',
            showIcon = true,
            allowRefresh = true
        } = options;
        
        const iconMap = {
            artist: '🎤',
            image: '🖼️',
            data: '📊',
            generic: '❓'
        };
        
        const icon = showIcon ? iconMap[type] || iconMap.generic : '';
        
        const refreshButton = allowRefresh ? `
            <button type="button" 
                    class="placeholder__refresh-btn"
                    onclick="location.reload()"
                    aria-label="Refresh page to try loading data again">
                Refresh Page
            </button>
        ` : '';
        
        return `
            <div class="placeholder placeholder--${type}" role="status">
                <div class="placeholder__content">
                    ${icon ? `<div class="placeholder__icon" aria-hidden="true">${icon}</div>` : ''}
                    <p class="placeholder__message">${message}</p>
                    ${refreshButton}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds container wrapper with proper attributes
     * @param {string} content - Content to wrap
     * @param {Object} options - Container options
     * @returns {string} Container HTML
     */
    static buildContainer(content, options = {}) {
        const {
            id = '',
            className = 'artist-ui-container',
            ariaLabel = '',
            role = '',
            busy = false
        } = options;
        
        const attributes = [
            id ? `id="${id}"` : '',
            `class="${className}"`,
            ariaLabel ? `aria-label="${ariaLabel}"` : '',
            role ? `role="${role}"` : '',
            busy ? 'aria-busy="true"' : 'aria-busy="false"'
        ].filter(attr => attr).join(' ');
        
        return `
            <div ${attributes}>
                ${content}
            </div>
        `;
    }
    
    /**
     * Builds accessible button component
     * @param {Object} config - Button configuration
     * @returns {string} Button HTML
     */
    static buildButton(config) {
        const {
            text = 'Button',
            type = 'button',
            className = 'btn',
            ariaLabel = '',
            disabled = false,
            onClick = '',
            variant = 'primary'
        } = config;
        
        const buttonClass = `${className} ${className}--${variant}`;
        const disabledAttr = disabled ? 'disabled' : '';
        const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
        const onClickAttr = onClick ? `onclick="${onClick}"` : '';
        
        return `
            <button type="${type}" 
                    class="${buttonClass}" 
                    ${ariaLabelAttr}
                    ${disabledAttr}
                    ${onClickAttr}>
                ${text}
            </button>
        `;
    }
    
    /**
     * Builds accessible link component
     * @param {Object} config - Link configuration
     * @returns {string} Link HTML
     */
    static buildLink(config) {
        const {
            href = '#',
            text = 'Link',
            className = 'link',
            ariaLabel = '',
            target = '',
            rel = '',
            external = false
        } = config;
        
        const targetAttr = target || (external ? '_blank' : '');
        const relAttr = rel || (external ? 'noopener noreferrer' : '');
        const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
        
        const externalIndicator = external ? `
            <span class="link__external-indicator sr-only">Opens in new tab</span>
        ` : '';
        
        return `
            <a href="${href}" 
               class="${className}"
               ${targetAttr ? `target="${targetAttr}"` : ''}
               ${relAttr ? `rel="${relAttr}"` : ''}
               ${ariaLabelAttr}>
                ${text}
                ${externalIndicator}
            </a>
        `;
    }
    
    /**
     * Builds responsive image component
     * @param {Object} config - Image configuration
     * @returns {string} Image HTML
     */
    static buildResponsiveImage(config) {
        const {
            src = '',
            alt = '',
            width = 300,
            height = 300,
            className = 'responsive-image',
            lazyLoading = true,
            sizes = '(max-width: 600px) 100vw, 300px'
        } = config;
        
        const attributes = [
            `src="${src}"`,
            `alt="${alt}"`,
            `class="${className}"`,
            `width="${width}"`,
            `height="${height}"`,
            lazyLoading ? 'loading="lazy"' : '',
            'decoding="async"',
            `sizes="${sizes}"`
        ].filter(attr => attr).join(' ');
        
        return `<img ${attributes}>`;
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Generates a unique ID for component identification
     * @returns {string} Unique identifier
     */
    static generateUniqueId() {
        return `ui-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Builds CSS class string from array or object
     * @param {Array|Object|string} classes - Classes to process
     * @returns {string} CSS class string
     */
    static buildCssClasses(classes) {
        if (typeof classes === 'string') {
            return classes;
        }
        
        if (Array.isArray(classes)) {
            return classes.filter(cls => cls && typeof cls === 'string').join(' ');
        }
        
        if (typeof classes === 'object') {
            return Object.keys(classes)
                .filter(key => classes[key])
                .join(' ');
        }
        
        return '';
    }
    
    /**
     * Escapes HTML attributes safely
     * @param {string} value - Attribute value to escape
     * @returns {string} Escaped attribute value
     */
    static escapeAttribute(value) {
        if (typeof value !== 'string') {
            return String(value || '');
        }
        
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    
    /**
     * Builds data attributes from object
     * @param {Object} dataAttributes - Data attributes object
     * @returns {string} Data attributes string
     */
    static buildDataAttributes(dataAttributes) {
        if (!dataAttributes || typeof dataAttributes !== 'object') {
            return '';
        }
        
        return Object.keys(dataAttributes)
            .map(key => {
                const dataKey = key.startsWith('data-') ? key : `data-${key}`;
                const value = this.escapeAttribute(dataAttributes[key]);
                return `${dataKey}="${value}"`;
            })
            .join(' ');
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistUIBuilders;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistUIBuilders = ArtistUIBuilders;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistUIBuilders = ArtistUIBuilders;
}