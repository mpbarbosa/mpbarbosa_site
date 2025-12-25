/**
 * INITIALIZATION UI BUILDERS - Pure UI Building Functions
 * =======================================================
 * 
 * Following "Functional Core" pattern - All functions are pure with no side effects.
 * Builds UI components for development mode, notifications, and initialization feedback.
 * 
 * Part of the 7th successful API Class Extraction using proven methodology.
 */

class InitializationUIBuilders {
    
    /**
     * Builds development mode border styling
     * @param {Object} config - Development environment configuration
     * @returns {Object} CSS styling configuration for development border
     */
    static buildDevelopmentBorderStyle(config) {
        if (!config || !config.showBorder) {
            return {
                success: false,
                error: 'Development border not needed',
                styles: null
            };
        }

        const styles = {
            borderTop: `${config.borderWidth} ${config.borderStyle} ${config.borderColor}`,
            position: 'relative'
        };

        const cssText = Object.entries(styles)
            .map(([property, value]) => `${property.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
            .join('; ');

        return {
            success: true,
            error: null,
            styles,
            cssText,
            target: 'document.body',
            description: 'Development mode indicator border'
        };
    }

    /**
     * Builds service worker update notification HTML
     * @param {Object} options - Notification options
     * @returns {Object} Update notification HTML structure
     */
    static buildUpdateNotificationHTML(options = {}) {
        const config = {
            title: options.title || 'App Update Available',
            message: options.message || 'A new version of Music in Numbers is available. Refresh to update.',
            actionText: options.actionText || 'Refresh Now',
            dismissText: options.dismissText || 'Later',
            type: options.type || 'info',
            autoHide: options.autoHide !== false,
            duration: options.duration || 10000
        };

        const html = `
            <div class="update-notification" data-type="${config.type}">
                <div class="notification-content">
                    <div class="notification-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div class="notification-text">
                        <h4 class="notification-title">${config.title}</h4>
                        <p class="notification-message">${config.message}</p>
                    </div>
                    <div class="notification-actions">
                        <button class="notification-action primary" data-action="refresh">
                            ${config.actionText}
                        </button>
                        <button class="notification-action secondary" data-action="dismiss">
                            ${config.dismissText}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return {
            success: true,
            error: null,
            html: html.trim(),
            config,
            className: 'update-notification',
            dataAttributes: { type: config.type },
            autoHide: config.autoHide,
            duration: config.duration
        };
    }

    /**
     * Builds service worker update notification CSS
     * @returns {Object} CSS styles for update notification
     */
    static buildUpdateNotificationCSS() {
        const css = `
            .update-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1DB954;
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            }

            .update-notification[data-type="warning"] {
                background: #f39c12;
            }

            .update-notification[data-type="error"] {
                background: #e74c3c;
            }

            .notification-content {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }

            .notification-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                margin-top: 4px;
            }

            .notification-icon svg {
                width: 100%;
                height: 100%;
            }

            .notification-text {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                margin: 0 0 4px 0;
                font-size: 14px;
                font-weight: 600;
                line-height: 1.2;
            }

            .notification-message {
                margin: 0 0 12px 0;
                font-size: 13px;
                line-height: 1.4;
                opacity: 0.9;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .notification-action {
                background: none;
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-action.primary {
                background: rgba(255, 255, 255, 0.2);
            }

            .notification-action:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .update-notification.hiding {
                animation: slideOut 0.3s ease-in forwards;
            }
        `;

        return {
            success: true,
            error: null,
            css: css.trim(),
            styleId: 'update-notification-styles',
            mediaQueries: {
                mobile: '@media (max-width: 480px) { .update-notification { left: 10px; right: 10px; max-width: none; } }'
            }
        };
    }

    /**
     * Builds initialization progress indicator HTML
     * @param {Object} progress - Initialization progress data
     * @returns {Object} Progress indicator HTML structure
     */
    static buildInitializationProgress(progress) {
        if (!progress || typeof progress.completionPercentage !== 'number') {
            return {
                success: false,
                error: 'Invalid progress data provided',
                html: null
            };
        }

        const percentage = Math.max(0, Math.min(100, progress.completionPercentage));
        const isComplete = percentage === 100;

        const html = `
            <div class="initialization-progress" data-complete="${isComplete}">
                <div class="progress-header">
                    <h3 class="progress-title">🚀 Music in Numbers</h3>
                    <span class="progress-percentage">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-details">
                    <p class="progress-status">
                        ${isComplete ? 'Initialization Complete!' : 'Initializing application...'}
                    </p>
                    <small class="progress-components">
                        ${progress.completedComponents}/${progress.totalComponents} components ready
                    </small>
                </div>
            </div>
        `;

        return {
            success: true,
            error: null,
            html: html.trim(),
            percentage,
            isComplete,
            className: 'initialization-progress',
            dataAttributes: { complete: isComplete }
        };
    }

    /**
     * Builds development mode console styling
     * @param {Object} environment - Environment configuration
     * @returns {Object} Console styling configuration
     */
    static buildDevelopmentConsoleStyle(environment) {
        if (!environment || !environment.isDevelopment) {
            return {
                success: false,
                error: 'Development console styling not needed',
                styles: null
            };
        }

        const styles = {
            banner: {
                background: 'linear-gradient(45deg, #1DB954, #1ed760)',
                color: 'white',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '5px'
            },
            info: {
                color: '#1DB954',
                fontSize: '14px',
                fontWeight: 'normal'
            },
            warning: {
                color: '#f39c12',
                fontSize: '14px',
                fontWeight: 'bold'
            }
        };

        const messages = {
            banner: '🔧 Development mode detected. Mock token options available.',
            features: [
                '• Mock token: Add ?token=your_token_here to URL',
                '• Debug logging: Enhanced console output enabled',
                '• Development border: Visual development indicator shown'
            ]
        };

        return {
            success: true,
            error: null,
            styles,
            messages,
            logMethods: ['log', 'info', 'warn', 'error'],
            bannerStyle: 'background: linear-gradient(45deg, #1DB954, #1ed760); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;'
        };
    }

    /**
     * Builds error message HTML for initialization failures
     * @param {Object} error - Error information
     * @returns {Object} Error message HTML structure
     */
    static buildInitializationErrorHTML(error) {
        if (!error) {
            return {
                success: false,
                error: 'No error information provided',
                html: null
            };
        }

        const errorConfig = {
            title: error.title || 'Initialization Error',
            message: error.message || 'An error occurred during application initialization',
            code: error.code || 'INIT_ERROR',
            details: error.details || null,
            canRetry: error.canRetry !== false,
            timestamp: new Date().toLocaleTimeString()
        };

        const html = `
            <div class="initialization-error" data-error-code="${errorConfig.code}">
                <div class="error-header">
                    <div class="error-icon">⚠️</div>
                    <h3 class="error-title">${errorConfig.title}</h3>
                    <span class="error-timestamp">${errorConfig.timestamp}</span>
                </div>
                <div class="error-content">
                    <p class="error-message">${errorConfig.message}</p>
                    ${errorConfig.details ? `<details class="error-details">
                        <summary>Technical Details</summary>
                        <pre><code>${errorConfig.details}</code></pre>
                    </details>` : ''}
                </div>
                ${errorConfig.canRetry ? `
                    <div class="error-actions">
                        <button class="error-action retry" data-action="retry">
                            Try Again
                        </button>
                        <button class="error-action reload" data-action="reload">
                            Reload Page
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        return {
            success: true,
            error: null,
            html: html.trim(),
            config: errorConfig,
            className: 'initialization-error',
            canRetry: errorConfig.canRetry
        };
    }

    /**
     * Builds success message HTML for completed initialization
     * @param {Object} summary - Initialization summary
     * @returns {Object} Success message HTML structure
     */
    static buildInitializationSuccessHTML(summary) {
        if (!summary || !summary.isFullyInitialized) {
            return {
                success: false,
                error: 'Initialization not fully complete',
                html: null
            };
        }

        const config = {
            title: '🎉 Ready to Rock!',
            message: 'Music in Numbers has been successfully initialized and is ready to use.',
            features: [
                'Spotify OAuth authentication ready',
                'Real-time monitoring enabled',
                'Performance tracking active',
                'Service worker registered'
            ],
            timestamp: new Date().toLocaleTimeString()
        };

        const html = `
            <div class="initialization-success">
                <div class="success-header">
                    <div class="success-icon">✅</div>
                    <h3 class="success-title">${config.title}</h3>
                </div>
                <div class="success-content">
                    <p class="success-message">${config.message}</p>
                    <ul class="success-features">
                        ${config.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="success-footer">
                    <small class="success-timestamp">Initialized at ${config.timestamp}</small>
                </div>
            </div>
        `;

        return {
            success: true,
            error: null,
            html: html.trim(),
            config,
            className: 'initialization-success',
            timestamp: config.timestamp
        };
    }

    /**
     * Builds loading spinner HTML for initialization
     * @param {Object} options - Loading spinner options
     * @returns {Object} Loading spinner HTML structure
     */
    static buildLoadingSpinnerHTML(options = {}) {
        const config = {
            size: options.size || 'medium',
            color: options.color || '#1DB954',
            text: options.text || 'Initializing...',
            showText: options.showText !== false
        };

        const sizeMap = {
            small: '20px',
            medium: '32px',
            large: '48px'
        };

        const spinnerSize = sizeMap[config.size] || sizeMap.medium;

        const html = `
            <div class="loading-spinner" data-size="${config.size}">
                <div class="spinner-animation" style="width: ${spinnerSize}; height: ${spinnerSize}; border-color: ${config.color}20; border-top-color: ${config.color};">
                </div>
                ${config.showText ? `<span class="spinner-text">${config.text}</span>` : ''}
            </div>
        `;

        const css = `
            .loading-spinner {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                padding: 20px;
            }

            .spinner-animation {
                border: 3px solid;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .spinner-text {
                font-size: 14px;
                color: #666;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        return {
            success: true,
            error: null,
            html: html.trim(),
            css: css.trim(),
            config,
            className: 'loading-spinner'
        };
    }
}

// ===== MODULE EXPORTS =====

// Node.js/CommonJS support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InitializationUIBuilders;
}

// Browser/AMD support
if (typeof window !== 'undefined') {
    window.InitializationUIBuilders = InitializationUIBuilders;
}

// ES6 Module support
if (typeof globalThis !== 'undefined') {
    globalThis.InitializationUIBuilders = InitializationUIBuilders;
}