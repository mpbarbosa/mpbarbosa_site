/**
 * ================================================================================
 * ARTIST UI CORE - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Core orchestration class for artist UI operations with dependency injection.
 * Handles all side effects and coordinates between pure business logic functions.
 * 
 * ORCHESTRATION RESPONSIBILITIES:
 * - DOM manipulation and side effects
 * - Event handling and user interactions
 * - API calls and external service integration
 * - Error handling and user feedback
 * - Navigation and routing operations
 * - State management and persistence
 * 
 * PATTERNS:
 * - "Functional Core, Imperative Shell" architecture
 * - Dependency injection for testability and flexibility
 * - Comprehensive error handling with user feedback
 * - Accessibility-first user interactions
 * - Performance optimization with caching
 * - Security-focused input validation
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistUICore {
    
    /**
     * Creates instance with dependency injection container
     * @param {Object} diContainer - Dependency injection container
     */
    constructor(diContainer) {
        this.validators = diContainer.validators;
        this.processors = diContainer.processors;
        this.builders = diContainer.builders;
        this.logger = diContainer.logger || console;
        this.performance = diContainer.performance || {};
        this.errorHandler = diContainer.errorHandler || this.defaultErrorHandler.bind(this);
        
        // Performance tracking
        this.startTime = performance.now ? performance.now() : Date.now();
        this.operationCount = 0;
        
        // Cache for frequent operations
        this.cache = new Map();
        this.cacheTimeout = diContainer.cacheTimeout || 300000; // 5 minutes
    }
    
    // ============================================
    // CORE ORCHESTRATION METHODS
    // ============================================
    
    /**
     * Core method for displaying artist information with full error handling
     * @param {Object} artistData - Raw artist data from API
     * @param {string} containerId - Container element ID
     * @param {Object} options - Display options
     * @returns {Promise<boolean>} Success status
     */
    async displayArtistInfoCore(artistData, containerId, options = {}) {
        const operationId = `displayArtist_${++this.operationCount}`;
        const startTime = performance.now ? performance.now() : Date.now();
        
        try {
            // Input validation
            const containerValidation = this.validators.validateContainerId(containerId);
            if (!containerValidation.isValid) {
                throw new Error(`Container validation failed: ${containerValidation.error}`);
            }
            
            const dataValidation = this.validators.validateArtistData(artistData);
            if (!dataValidation.isValid) {
                throw new Error(`Artist data validation failed: ${dataValidation.error}`);
            }
            
            // Get container element
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container element with ID '${containerId}' not found`);
            }
            
            // Show loading state
            this.showLoadingState(container, 'Loading artist information...');
            
            // Process artist data
            const formattedData = this.processors.formatArtistDisplayData(artistData);
            
            // Build HTML content
            const htmlContent = this.builders.buildArtistDisplay(formattedData, options);
            
            // Validate generated HTML
            const htmlValidation = this.validators.validateHtmlText(htmlContent);
            if (!htmlValidation.isValid) {
                throw new Error(`Generated HTML validation failed: ${htmlValidation.error}`);
            }
            
            // Update DOM with proper accessibility
            this.updateContainerContent(container, htmlContent, {
                ariaLabel: `Artist information for ${formattedData.name}`,
                role: 'main'
            });
            
            // Initialize interactive elements
            this.initializeInteractiveElements(container);
            
            // Track performance
            this.trackPerformance(operationId, startTime, 'display_artist_success');
            
            // Cache result for performance
            this.cacheOperation(`artist_${containerId}`, { 
                content: htmlContent, 
                timestamp: Date.now() 
            });
            
            return true;
            
        } catch (error) {
            this.logger.error(`Display artist info error (${operationId}):`, error);
            
            // Show error state
            const errorHtml = this.builders.buildErrorDisplay(error.message, {
                showIcon: true,
                allowRetry: true,
                showHomeLink: true
            });
            
            const container = document.getElementById(containerId);
            if (container) {
                this.updateContainerContent(container, errorHtml, {
                    ariaLabel: 'Error loading artist information',
                    role: 'alert'
                });
            }
            
            // Track error
            this.trackPerformance(operationId, startTime, 'display_artist_error');
            this.errorHandler(error, 'displayArtistInfo', { artistData, containerId, options });
            
            return false;
        }
    }
    
    /**
     * Core method for opening URLs in new tabs with security validation
     * @param {string} url - URL to open
     * @param {Object} options - Opening options
     * @returns {Promise<boolean>} Success status
     */
    async openInNewTabCore(url, options = {}) {
        const operationId = `openTab_${++this.operationCount}`;
        const startTime = performance.now ? performance.now() : Date.now();
        
        try {
            // Input validation
            const urlValidation = this.validators.validateUrl(url);
            if (!urlValidation.isValid) {
                throw new Error(`URL validation failed: ${urlValidation.error}`);
            }
            
            // Process URL for security
            const processedUrl = this.processors.processUrl(url);
            
            // Additional security checks
            if (!this.isUrlSafe(processedUrl)) {
                throw new Error('URL failed security validation');
            }
            
            // Track user interaction
            this.trackUserInteraction('external_link_click', {
                url: processedUrl,
                timestamp: Date.now()
            });
            
            // Open URL with security features
            const newWindow = window.open(
                processedUrl,
                '_blank',
                'noopener,noreferrer'
            );
            
            if (!newWindow) {
                throw new Error('Failed to open new window (popup blocker?)');
            }
            
            // Accessibility announcement
            this.announceToScreenReader(
                `Opening ${this.extractDomain(processedUrl)} in new tab`,
                'polite'
            );
            
            // Track performance
            this.trackPerformance(operationId, startTime, 'open_tab_success');
            
            return true;
            
        } catch (error) {
            this.logger.error(`Open in new tab error (${operationId}):`, error);
            
            // Show user-friendly error
            await this.showAlertCore(`Unable to open link: ${error.message}`, {
                type: 'error',
                timeout: 5000
            });
            
            // Track error
            this.trackPerformance(operationId, startTime, 'open_tab_error');
            this.errorHandler(error, 'openInNewTab', { url, options });
            
            return false;
        }
    }
    
    /**
     * Core method for showing alerts with enhanced UX
     * @param {string} message - Alert message
     * @param {Object} options - Alert options
     * @returns {Promise<boolean>} Success status
     */
    async showAlertCore(message, options = {}) {
        const operationId = `alert_${++this.operationCount}`;
        const startTime = performance.now ? performance.now() : Date.now();
        
        try {
            // Input validation
            const messageValidation = this.validators.validateErrorMessage(message);
            if (!messageValidation.isValid) {
                throw new Error(`Message validation failed: ${messageValidation.error}`);
            }
            
            const {
                type = 'info',
                timeout = 0,
                persistent = false,
                showCloseButton = true,
                customClass = ''
            } = options;
            
            // Process message for display
            const processedMessage = this.processors.processErrorMessage(message);
            
            // Create alert container if doesn't exist
            let alertContainer = document.getElementById('alert-container');
            if (!alertContainer) {
                alertContainer = this.createAlertContainer();
                document.body.appendChild(alertContainer);
            }
            
            // Build alert HTML
            const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const alertHtml = this.buildAlertHtml(alertId, processedMessage.displayMessage, {
                type,
                showCloseButton,
                customClass
            });
            
            // Add alert to container
            const alertElement = this.createElementFromHtml(alertHtml);
            alertContainer.appendChild(alertElement);
            
            // Initialize alert interactions
            this.initializeAlertInteractions(alertElement, alertId);
            
            // Handle auto-dismiss
            if (timeout > 0 && !persistent) {
                setTimeout(() => {
                    this.dismissAlert(alertId);
                }, timeout);
            }
            
            // Accessibility announcement
            this.announceToScreenReader(
                processedMessage.displayMessage,
                type === 'error' ? 'assertive' : 'polite'
            );
            
            // Track performance
            this.trackPerformance(operationId, startTime, 'show_alert_success');
            
            return true;
            
        } catch (error) {
            this.logger.error(`Show alert error (${operationId}):`, error);
            
            // Fallback to browser alert
            alert(message);
            
            // Track error
            this.trackPerformance(operationId, startTime, 'show_alert_error');
            this.errorHandler(error, 'showAlert', { message, options });
            
            return false;
        }
    }
    
    // ============================================
    // DOM MANIPULATION METHODS
    // ============================================
    
    /**
     * Updates container content with proper accessibility
     * @param {HTMLElement} container - Container element
     * @param {string} content - HTML content
     * @param {Object} options - Update options
     */
    updateContainerContent(container, content, options = {}) {
        const { ariaLabel, role } = options;
        
        // Set accessibility attributes
        if (ariaLabel) {
            container.setAttribute('aria-label', ariaLabel);
        }
        if (role) {
            container.setAttribute('role', role);
        }
        
        // Update content
        container.innerHTML = content;
        
        // Announce content change to screen readers
        container.setAttribute('aria-live', 'polite');
        
        // Remove aria-live after announcement
        setTimeout(() => {
            container.removeAttribute('aria-live');
        }, 1000);
    }
    
    /**
     * Shows loading state in container
     * @param {HTMLElement} container - Container element
     * @param {string} message - Loading message
     */
    showLoadingState(container, message) {
        const loadingHtml = this.builders.buildLoadingState({
            message,
            showSpinner: true
        });
        
        container.innerHTML = loadingHtml;
        container.setAttribute('aria-busy', 'true');
        container.setAttribute('aria-live', 'polite');
    }
    
    /**
     * Initializes interactive elements within container
     * @param {HTMLElement} container - Container element
     */
    initializeInteractiveElements(container) {
        // Initialize copy buttons
        const copyButtons = container.querySelectorAll('.raw-data-copy-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCopyToClipboard(e.target);
            });
        });
        
        // Initialize external links
        const externalLinks = container.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleExternalLinkClick(e);
            });
        });
        
        // Initialize details elements
        const detailsElements = container.querySelectorAll('details');
        detailsElements.forEach(details => {
            this.initializeDetailsElement(details);
        });
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    /**
     * Handles copy to clipboard functionality
     * @param {HTMLElement} button - Copy button element
     */
    async handleCopyToClipboard(button) {
        try {
            const textToCopy = button.getAttribute('data-copy-text');
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            // Show success feedback
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copy-success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copy-success');
            }, 2000);
            
            // Accessibility announcement
            this.announceToScreenReader('Text copied to clipboard', 'polite');
            
        } catch (error) {
            this.logger.error('Copy to clipboard failed:', error);
            
            // Show error feedback
            button.textContent = 'Copy failed';
            button.classList.add('copy-error');
            
            setTimeout(() => {
                button.textContent = 'Copy to Clipboard';
                button.classList.remove('copy-error');
            }, 2000);
        }
    }
    
    /**
     * Handles external link click events
     * @param {Event} event - Click event
     */
    handleExternalLinkClick(event) {
        const link = event.target.closest('a');
        const url = link.href;
        
        // Track external link click
        this.trackUserInteraction('external_link_click', {
            url,
            linkText: link.textContent.trim(),
            timestamp: Date.now()
        });
        
        // Additional security validation
        if (!this.isUrlSafe(url)) {
            event.preventDefault();
            this.showAlertCore('This link appears to be unsafe and was blocked.', {
                type: 'warning'
            });
        }
    }
    
    /**
     * Initializes details element with enhanced accessibility
     * @param {HTMLElement} details - Details element
     */
    initializeDetailsElement(details) {
        const summary = details.querySelector('summary');
        const toggleIcon = summary.querySelector('.raw-data-toggle-icon');
        
        details.addEventListener('toggle', () => {
            if (toggleIcon) {
                toggleIcon.textContent = details.open ? '▲' : '▼';
            }
            
            // Announce state change
            const state = details.open ? 'expanded' : 'collapsed';
            this.announceToScreenReader(`Section ${state}`, 'polite');
        });
    }
    
    // ============================================
    // ALERT SYSTEM METHODS
    // ============================================
    
    /**
     * Creates alert container element
     * @returns {HTMLElement} Alert container
     */
    createAlertContainer() {
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.className = 'alert-container';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Notifications');
        container.setAttribute('aria-live', 'polite');
        return container;
    }
    
    /**
     * Builds alert HTML structure
     * @param {string} alertId - Unique alert ID
     * @param {string} message - Alert message
     * @param {Object} options - Alert options
     * @returns {string} Alert HTML
     */
    buildAlertHtml(alertId, message, options) {
        const { type, showCloseButton, customClass } = options;
        
        const typeIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const closeButton = showCloseButton ? `
            <button type="button" 
                    class="alert__close-btn" 
                    aria-label="Close notification"
                    data-alert-id="${alertId}">
                ×
            </button>
        ` : '';
        
        return `
            <div id="${alertId}" 
                 class="alert alert--${type} ${customClass}" 
                 role="alert">
                <div class="alert__content">
                    <span class="alert__icon" aria-hidden="true">${typeIcons[type] || typeIcons.info}</span>
                    <span class="alert__message">${message}</span>
                </div>
                ${closeButton}
            </div>
        `;
    }
    
    /**
     * Initializes alert interactions
     * @param {HTMLElement} alertElement - Alert element
     * @param {string} alertId - Alert ID
     */
    initializeAlertInteractions(alertElement, alertId) {
        const closeButton = alertElement.querySelector('.alert__close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.dismissAlert(alertId);
            });
        }
        
        // Auto-focus for error alerts
        if (alertElement.classList.contains('alert--error')) {
            alertElement.setAttribute('tabindex', '-1');
            alertElement.focus();
        }
    }
    
    /**
     * Dismisses alert by ID
     * @param {string} alertId - Alert ID to dismiss
     */
    dismissAlert(alertId) {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.classList.add('alert--dismissing');
            
            setTimeout(() => {
                alertElement.remove();
            }, 300);
        }
    }
    
    // ============================================
    // UTILITY METHODS
    // ============================================
    
    /**
     * Creates HTML element from string
     * @param {string} htmlString - HTML string
     * @returns {HTMLElement} Created element
     */
    createElementFromHtml(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    }
    
    /**
     * Validates URL safety
     * @param {string} url - URL to validate
     * @returns {boolean} Whether URL is safe
     */
    isUrlSafe(url) {
        try {
            const urlObj = new URL(url);
            const safeProtocols = ['http:', 'https:'];
            const unsafeDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
            
            return safeProtocols.includes(urlObj.protocol) && 
                   !unsafeDomains.includes(urlObj.hostname);
        } catch {
            return false;
        }
    }
    
    /**
     * Extracts domain from URL
     * @param {string} url - URL to process
     * @returns {string} Domain name
     */
    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return 'external site';
        }
    }
    
    /**
     * Announces message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Announcement priority
     */
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }
    
    /**
     * Tracks performance metrics
     * @param {string} operationId - Operation identifier
     * @param {number} startTime - Operation start time
     * @param {string} outcome - Operation outcome
     */
    trackPerformance(operationId, startTime, outcome) {
        if (this.performance.track) {
            const duration = (performance.now ? performance.now() : Date.now()) - startTime;
            this.performance.track(operationId, duration, outcome);
        }
    }
    
    /**
     * Tracks user interactions
     * @param {string} action - User action
     * @param {Object} data - Interaction data
     */
    trackUserInteraction(action, data) {
        if (this.performance.trackInteraction) {
            this.performance.trackInteraction(action, data);
        }
    }
    
    /**
     * Caches operation result
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    cacheOperation(key, value) {
        this.cache.set(key, value);
        
        // Auto-cleanup old cache entries
        setTimeout(() => {
            this.cache.delete(key);
        }, this.cacheTimeout);
    }
    
    /**
     * Gets cached operation result
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    getCachedOperation(key) {
        return this.cache.get(key) || null;
    }
    
    /**
     * Default error handler
     * @param {Error} error - Error object
     * @param {string} context - Error context
     * @param {Object} metadata - Error metadata
     */
    defaultErrorHandler(error, context, metadata) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            metadata,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logger.error('ArtistUICore Error:', errorInfo);
        
        // In production, send to error tracking service
        if (typeof window !== 'undefined' && window.errorTracker) {
            window.errorTracker.report(errorInfo);
        }
    }
    
    /**
     * Gets current performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return {
            operationCount: this.operationCount,
            uptime: (performance.now ? performance.now() : Date.now()) - this.startTime,
            cacheSize: this.cache.size,
            timestamp: new Date().toISOString()
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistUICore;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistUICore = ArtistUICore;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistUICore = ArtistUICore;
}