/**
 * ================================================================================
 * ARTIST PAGE UI BUILDERS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure UI building functions for artist page components.
 * Contains only functions that generate HTML/CSS strings without DOM manipulation.
 * 
 * UI BUILDING TYPES:
 * - Loading States (Spinner, progress indicators)
 * - Error States (Error messages, retry buttons)
 * - Success States (Artist profile, data displays)
 * - Interactive Components (Buttons, links, forms)
 * - Layout Components (Headers, sections, containers)
 * - Status Indicators (Authentication, connection states)
 * 
 * PATTERNS:
 * - Pure functions only (no DOM manipulation)
 * - String-based HTML generation
 * - CSS class-based styling
 * - Accessibility-first markup
 * - Responsive design considerations
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistPageUIBuilders {
    
    /**
     * Builds loading state UI for artist page
     * @param {Object} options - Loading options (message, progress, etc.)
     * @returns {string} HTML string for loading state
     */
    static buildLoadingState(options = {}) {
        const {
            message = 'Loading artist data...',
            showProgress = false,
            progress = 0,
            showSpinner = true
        } = options;
        
        const spinnerHTML = showSpinner ? `
            <div class="loading-spinner" aria-hidden="true">
                <div class="spinner"></div>
            </div>
        ` : '';
        
        const progressHTML = showProgress ? `
            <div class="loading-progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${progress}%"></div>
                <span class="progress-text">${progress}% complete</span>
            </div>
        ` : '';
        
        return `
            <div class="artist-page-loading" role="status" aria-live="polite">
                ${spinnerHTML}
                <div class="loading-content">
                    <h2 class="loading-message">${this.escapeHtml(message)}</h2>
                    ${progressHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds error state UI for artist page
     * @param {Object} options - Error options (message, retry action, etc.)
     * @returns {string} HTML string for error state
     */
    static buildErrorState(options = {}) {
        const {
            message = 'Unable to load artist data',
            showRetry = true,
            retryText = 'Try Again',
            showHome = true,
            homeText = 'Go to Home',
            errorCode = null,
            technical = false
        } = options;
        
        const errorCodeHTML = errorCode ? `
            <div class="error-code" aria-label="Error code">
                <span class="error-code-label">Error Code:</span>
                <code class="error-code-value">${this.escapeHtml(errorCode)}</code>
            </div>
        ` : '';
        
        const retryButtonHTML = showRetry ? `
            <button type="button" class="btn btn-primary error-retry-btn" onclick="loadArtistData()">
                <span class="btn-icon" aria-hidden="true">🔄</span>
                <span class="btn-text">${this.escapeHtml(retryText)}</span>
            </button>
        ` : '';
        
        const homeButtonHTML = showHome ? `
            <a href="index.html" class="btn btn-secondary error-home-btn">
                <span class="btn-icon" aria-hidden="true">🏠</span>
                <span class="btn-text">${this.escapeHtml(homeText)}</span>
            </a>
        ` : '';
        
        const technicalClass = technical ? ' error-technical' : '';
        
        return `
            <div class="artist-page-error${technicalClass}" role="alert" aria-live="assertive">
                <div class="error-content">
                    <div class="error-icon" aria-hidden="true">⚠️</div>
                    <h2 class="error-title">Oops! Something went wrong</h2>
                    <p class="error-message">${this.escapeHtml(message)}</p>
                    ${errorCodeHTML}
                    <div class="error-actions">
                        ${retryButtonHTML}
                        ${homeButtonHTML}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Builds success state UI showing artist information
     * @param {Object} artistData - Processed artist data
     * @returns {string} HTML string for artist display
     */
    static buildArtistDisplay(artistData) {
        if (!artistData || !artistData.isValid) {
            return this.buildErrorState({
                message: artistData?.error || 'Invalid artist data',
                errorCode: 'INVALID_DATA'
            });
        }
        
        const imageHTML = artistData.imageUrl ? `
            <div class="artist-image-container">
                <img 
                    src="${this.escapeHtml(artistData.imageUrl)}" 
                    alt="${this.escapeHtml(artistData.name)} profile picture"
                    class="artist-image"
                    loading="lazy"
                    onerror="this.style.display='none'"
                />
            </div>
        ` : `
            <div class="artist-image-placeholder" aria-label="No profile picture available">
                <span class="placeholder-icon" aria-hidden="true">🎵</span>
            </div>
        `;
        
        const spotifyLinkHTML = artistData.spotifyUrl ? `
            <a href="${this.escapeHtml(artistData.spotifyUrl)}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="spotify-link btn btn-spotify"
               aria-label="Open ${artistData.name} on Spotify">
                <span class="spotify-icon" aria-hidden="true">🎵</span>
                <span class="link-text">Open on Spotify</span>
                <span class="external-icon" aria-hidden="true">↗</span>
            </a>
        ` : '';
        
        return `
            <div class="artist-page-success" role="main" aria-labelledby="artist-name">
                <div class="artist-header">
                    ${imageHTML}
                    <div class="artist-info">
                        <h1 id="artist-name" class="artist-name">${this.escapeHtml(artistData.displayName)}</h1>
                        <div class="artist-stats" role="list">
                            <div class="stat-item" role="listitem">
                                <span class="stat-label">Followers:</span>
                                <span class="stat-value" aria-label="${artistData.followers} followers">${this.escapeHtml(artistData.followers)}</span>
                            </div>
                            <div class="stat-item" role="listitem">
                                <span class="stat-label">Popularity:</span>
                                <span class="stat-value" aria-label="Popularity ${artistData.popularity} out of 100">${artistData.popularity}/100</span>
                            </div>
                        </div>
                        <div class="artist-genres">
                            <span class="genres-label">Genres:</span>
                            <span class="genres-value">${this.escapeHtml(artistData.genres)}</span>
                        </div>
                    </div>
                </div>
                <div class="artist-actions">
                    ${spotifyLinkHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds profile button component
     * @param {Object} options - Button options (text, user data, etc.)
     * @returns {string} HTML string for profile button
     */
    static buildProfileButton(options = {}) {
        const {
            text = 'My Spotify Profile',
            userId = null,
            userName = null,
            showUserInfo = false,
            disabled = false,
            loading = false
        } = options;
        
        const disabledAttr = disabled ? 'disabled' : '';
        const loadingClass = loading ? ' btn-loading' : '';
        const disabledClass = disabled ? ' btn-disabled' : '';
        
        const userInfoHTML = showUserInfo && userName ? `
            <div class="profile-btn-user-info">
                <span class="user-name">${this.escapeHtml(userName)}</span>
                ${userId ? `<span class="user-id">@${this.escapeHtml(userId)}</span>` : ''}
            </div>
        ` : '';
        
        const loadingSpinner = loading ? `
            <span class="btn-spinner" aria-hidden="true"></span>
        ` : '';
        
        return `
            <button 
                type="button" 
                id="spotifyProfileBtn" 
                class="btn btn-spotify profile-btn${loadingClass}${disabledClass}"
                onclick="openMySpotifyProfile()"
                ${disabledAttr}
                aria-label="${this.escapeHtml(text)}${userName ? ` for ${userName}` : ''}"
            >
                <span class="btn-icon" aria-hidden="true">👤</span>
                ${loadingSpinner}
                <span class="btn-content">
                    <span class="btn-text">${this.escapeHtml(text)}</span>
                    ${userInfoHTML}
                </span>
                <span class="external-icon" aria-hidden="true">↗</span>
            </button>
        `;
    }
    
    /**
     * Builds authentication status indicator
     * @param {Object} status - Authentication status
     * @returns {string} HTML string for auth status
     */
    static buildAuthStatus(status = {}) {
        const {
            isAuthenticated = false,
            userName = null,
            expiresIn = null,
            showExpiry = false
        } = status;
        
        if (!isAuthenticated) {
            return `
                <div class="auth-status auth-status-disconnected" role="status" aria-live="polite">
                    <span class="status-icon" aria-hidden="true">🔒</span>
                    <span class="status-text">Not connected to Spotify</span>
                    <a href="index.html" class="auth-link">Connect Now</a>
                </div>
            `;
        }
        
        const expiryHTML = showExpiry && expiresIn ? `
            <div class="auth-expiry">
                <span class="expiry-label">Session expires in:</span>
                <span class="expiry-time" data-expires="${expiresIn}">${this.formatTimeRemaining(expiresIn)}</span>
            </div>
        ` : '';
        
        return `
            <div class="auth-status auth-status-connected" role="status" aria-live="polite">
                <span class="status-icon" aria-hidden="true">🔓</span>
                <div class="status-content">
                    <span class="status-text">Connected to Spotify</span>
                    ${userName ? `<span class="status-user">as ${this.escapeHtml(userName)}</span>` : ''}
                    ${expiryHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * Builds page header component
     * @param {Object} options - Header options
     * @returns {string} HTML string for page header
     */
    static buildPageHeader(options = {}) {
        const {
            title = 'Artist Profile',
            subtitle = null,
            showBreadcrumbs = true,
            showAuth = true,
            authStatus = {}
        } = options;
        
        const breadcrumbsHTML = showBreadcrumbs ? `
            <nav class="breadcrumbs" aria-label="Breadcrumb navigation">
                <ol class="breadcrumb-list" role="list">
                    <li class="breadcrumb-item" role="listitem">
                        <a href="index.html" class="breadcrumb-link">Home</a>
                    </li>
                    <li class="breadcrumb-item breadcrumb-current" role="listitem" aria-current="page">
                        <span class="breadcrumb-text">${this.escapeHtml(title)}</span>
                    </li>
                </ol>
            </nav>
        ` : '';
        
        const subtitleHTML = subtitle ? `
            <p class="page-subtitle">${this.escapeHtml(subtitle)}</p>
        ` : '';
        
        const authStatusHTML = showAuth ? this.buildAuthStatus(authStatus) : '';
        
        return `
            <header class="page-header" role="banner">
                <div class="header-content">
                    ${breadcrumbsHTML}
                    <div class="header-main">
                        <h1 class="page-title">${this.escapeHtml(title)}</h1>
                        ${subtitleHTML}
                    </div>
                    ${authStatusHTML}
                </div>
            </header>
        `;
    }
    
    /**
     * Builds navigation component
     * @param {Object} options - Navigation options
     * @returns {string} HTML string for navigation
     */
    static buildNavigation(options = {}) {
        const {
            currentPage = 'artist',
            showUserActions = true,
            userName = null
        } = options;
        
        const navigationItems = [
            { id: 'home', href: 'index.html', text: 'Dashboard', icon: '📊' },
            { id: 'artist', href: 'artist.html', text: 'Artist Profile', icon: '🎤' },
        ];
        
        const navItemsHTML = navigationItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? ' nav-item-active' : '';
            const ariaCurrent = isActive ? ' aria-current="page"' : '';
            
            return `
                <li class="nav-item${activeClass}" role="listitem">
                    <a href="${item.href}" class="nav-link"${ariaCurrent}>
                        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
                        <span class="nav-text">${item.text}</span>
                    </a>
                </li>
            `;
        }).join('');
        
        const userActionsHTML = showUserActions ? `
            <div class="nav-user-actions">
                ${this.buildProfileButton({ 
                    text: userName ? `${userName}'s Profile` : 'My Profile',
                    userName,
                    showUserInfo: false
                })}
            </div>
        ` : '';
        
        return `
            <nav class="main-navigation" role="navigation" aria-label="Main navigation">
                <ul class="nav-list" role="list">
                    ${navItemsHTML}
                </ul>
                ${userActionsHTML}
            </nav>
        `;
    }
    
    /**
     * Builds footer component
     * @param {Object} options - Footer options
     * @returns {string} HTML string for footer
     */
    static buildFooter(options = {}) {
        const {
            showLinks = true,
            showVersion = true,
            version = '1.0.0'
        } = options;
        
        const linksHTML = showLinks ? `
            <nav class="footer-nav" aria-label="Footer navigation">
                <ul class="footer-links" role="list">
                    <li class="footer-link-item" role="listitem">
                        <a href="../index.html" class="footer-link">Back to Main Site</a>
                    </li>
                    <li class="footer-link-item" role="listitem">
                        <a href="https://developer.spotify.com/" target="_blank" rel="noopener noreferrer" class="footer-link">
                            Spotify API
                            <span class="external-icon" aria-hidden="true">↗</span>
                        </a>
                    </li>
                </ul>
            </nav>
        ` : '';
        
        const versionHTML = showVersion ? `
            <div class="footer-version">
                <span class="version-label">Version:</span>
                <span class="version-number">${this.escapeHtml(version)}</span>
            </div>
        ` : '';
        
        return `
            <footer class="page-footer" role="contentinfo">
                <div class="footer-content">
                    <div class="footer-main">
                        <p class="footer-title">Music in Numbers</p>
                        <p class="footer-description">Artist Profile Analysis</p>
                    </div>
                    ${linksHTML}
                    ${versionHTML}
                </div>
            </footer>
        `;
    }
    
    /**
     * Builds complete page layout
     * @param {Object} content - Content for different page sections
     * @returns {string} HTML string for complete page
     */
    static buildPageLayout(content = {}) {
        const {
            header = this.buildPageHeader(),
            navigation = this.buildNavigation(),
            main = this.buildLoadingState(),
            footer = this.buildFooter()
        } = content;
        
        return `
            <div class="artist-page-container">
                ${header}
                ${navigation}
                <main class="page-main" role="main">
                    ${main}
                </main>
                ${footer}
            </div>
        `;
    }
    
    // ============================================
    // UTILITY METHODS
    // ============================================
    
    /**
     * Escapes HTML characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} HTML-escaped text
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        return text.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
    }
    
    /**
     * Formats time remaining for display
     * @param {number} seconds - Seconds remaining
     * @returns {string} Formatted time string
     */
    static formatTimeRemaining(seconds) {
        if (typeof seconds !== 'number' || seconds <= 0) {
            return 'Expired';
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
    
    /**
     * Generates unique component ID
     * @param {string} prefix - ID prefix
     * @returns {string} Unique ID
     */
    static generateId(prefix = 'component') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}-${timestamp}-${random}`;
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistPageUIBuilders;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistPageUIBuilders = ArtistPageUIBuilders;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistPageUIBuilders = ArtistPageUIBuilders;
}