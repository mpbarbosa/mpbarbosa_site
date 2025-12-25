/**
 * ThemeManagerUIBuilders - Pure UI building functions for theme management
 * 
 * This class contains pure functions that generate HTML, CSS, and accessibility
 * elements for theme management interfaces. All methods are static and pure,
 * returning UI structures without performing DOM manipulation.
 * 
 * Architecture: Functional Core (Pure Functions)
 * Pattern: Static methods returning HTML/CSS/accessibility structures
 * Dependencies: ThemeManagerValidators, ThemeManagerProcessors
 */

class ThemeManagerUIBuilders {
    /**
     * Build theme button HTML structure
     * @param {string} theme - Theme name
     * @param {boolean} isActive - Whether this theme is currently active
     * @param {Object} options - Additional options
     * @returns {string} HTML string for theme button
     */
    static buildThemeButton(theme, isActive = false, options = {}) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        const buttonId = ThemeManagerProcessors.processThemeToButtonId(theme);
        const displayName = ThemeManagerProcessors.processThemeForDisplay(theme);
        const classes = ThemeManagerProcessors.processButtonClasses(
            isActive ? theme : 'none', 
            theme
        );

        const iconClass = options.iconClass || `icon-${theme}`;
        const size = options.size || 'medium';
        const showLabel = options.showLabel !== false;

        return `
            <button 
                id="${buttonId}"
                class="${classes.join(' ')} theme-btn--${size}"
                type="button"
                role="radio"
                aria-checked="${isActive}"
                aria-describedby="${buttonId}-description"
                data-theme="${theme}"
                title="Switch to ${displayName}"
            >
                <span class="${iconClass}" aria-hidden="true"></span>
                ${showLabel ? `<span class="theme-btn-label">${displayName}</span>` : ''}
                <span class="sr-only">
                    ${isActive ? 'Currently active theme: ' : 'Switch to '}${displayName}
                </span>
            </button>
        `.trim();
    }

    /**
     * Build complete theme selector UI
     * @param {string} currentTheme - Currently active theme
     * @param {Array<string>} availableThemes - Array of available themes
     * @param {Object} options - UI options
     * @returns {string} Complete theme selector HTML
     */
    static buildThemeSelector(currentTheme, availableThemes = ['light', 'dark', 'high-contrast'], options = {}) {
        const currentValidation = ThemeManagerValidators.validateTheme(currentTheme);
        if (!currentValidation.isValid) {
            throw new Error(`Invalid current theme: ${currentValidation.error}`);
        }

        const selectorId = options.id || 'theme-selector';
        const label = options.label || 'Choose Theme';
        const orientation = options.orientation || 'horizontal';

        const buttonsHTML = availableThemes
            .filter(theme => ThemeManagerValidators.validateTheme(theme).isValid)
            .map(theme => this.buildThemeButton(theme, theme === currentTheme, options))
            .join('\n');

        return `
            <div 
                id="${selectorId}"
                class="theme-selector theme-selector--${orientation}"
                role="radiogroup"
                aria-labelledby="${selectorId}-label"
            >
                <h3 id="${selectorId}-label" class="theme-selector-label">
                    ${label}
                </h3>
                <div class="theme-selector-buttons">
                    ${buttonsHTML}
                </div>
                <div class="theme-selector-description">
                    <p>Use keyboard shortcuts: Alt+L (Light), Alt+D (Dark), Alt+H (High Contrast)</p>
                </div>
            </div>
        `.trim();
    }

    /**
     * Build screen reader announcement element
     * @param {string} message - Message to announce
     * @param {string} priority - Announcement priority (polite, assertive)
     * @returns {string} Screen reader announcement HTML
     */
    static buildScreenReaderAnnouncement(message, priority = 'polite') {
        const validation = ThemeManagerValidators.validateScreenReaderMessage(message);
        if (!validation.isValid) {
            throw new Error(`Invalid screen reader message: ${validation.error}`);
        }

        const validPriorities = ['polite', 'assertive', 'off'];
        const ariaPriority = validPriorities.includes(priority) ? priority : 'polite';

        return `
            <div 
                class="sr-only" 
                aria-live="${ariaPriority}" 
                aria-atomic="true"
            >
                ${message}
            </div>
        `.trim();
    }

    /**
     * Build keyboard shortcuts help panel
     * @param {Object} shortcuts - Shortcut mappings
     * @param {Object} options - Display options
     * @returns {string} Keyboard shortcuts help HTML
     */
    static buildKeyboardShortcutsHelp(shortcuts = {}, options = {}) {
        const defaultShortcuts = {
            'Alt + L': 'Switch to Light theme',
            'Alt + D': 'Switch to Dark theme', 
            'Alt + H': 'Switch to High Contrast theme',
            'Alt + C': 'Connect to Spotify (if available)',
            'Escape': 'Return focus to main content'
        };

        const allShortcuts = { ...defaultShortcuts, ...shortcuts };
        const showTitle = options.showTitle !== false;
        const panelId = options.id || 'keyboard-shortcuts-help';

        const shortcutsHTML = Object.entries(allShortcuts)
            .map(([key, description]) => `
                <dt class="shortcut-key">
                    <kbd>${key}</kbd>
                </dt>
                <dd class="shortcut-description">
                    ${description}
                </dd>
            `).join('');

        return `
            <div id="${panelId}" class="keyboard-shortcuts-help" role="complementary">
                ${showTitle ? '<h4 class="shortcuts-title">Keyboard Shortcuts</h4>' : ''}
                <dl class="shortcuts-list">
                    ${shortcutsHTML}
                </dl>
            </div>
        `.trim();
    }

    /**
     * Build focus indicator for accessibility
     * @param {string} targetId - ID of element to indicate focus for
     * @param {Object} options - Focus indicator options
     * @returns {string} Focus indicator HTML
     */
    static buildFocusIndicator(targetId, options = {}) {
        if (!targetId || typeof targetId !== 'string') {
            throw new Error('Target ID is required for focus indicator');
        }

        const indicatorId = options.id || `${targetId}-focus-indicator`;
        const style = options.style || 'ring';
        const visible = options.visible !== false;

        return `
            <div 
                id="${indicatorId}"
                class="focus-indicator focus-indicator--${style} ${visible ? 'visible' : 'hidden'}"
                aria-hidden="true"
                data-target="${targetId}"
            >
                <span class="focus-indicator-inner"></span>
            </div>
        `.trim();
    }

    /**
     * Build accessibility preferences panel
     * @param {Object} preferences - Current accessibility preferences
     * @param {Object} options - Panel options
     * @returns {string} Accessibility preferences HTML
     */
    static buildAccessibilityPanel(preferences = {}, options = {}) {
        const validation = ThemeManagerValidators.validateAccessibilityPreferences(preferences);
        if (!validation.isValid) {
            throw new Error(`Invalid accessibility preferences: ${validation.error}`);
        }

        const processed = ThemeManagerProcessors.processAccessibilityPreferences(preferences);
        const panelId = options.id || 'accessibility-preferences';
        const showTitle = options.showTitle !== false;

        return `
            <div id="${panelId}" class="accessibility-preferences" role="region" aria-labelledby="${panelId}-title">
                ${showTitle ? `<h4 id="${panelId}-title" class="accessibility-title">Accessibility Settings</h4>` : ''}
                
                <div class="preference-group">
                    <label class="preference-label">
                        <input 
                            type="checkbox" 
                            ${processed.reducedMotion ? 'checked' : ''} 
                            data-preference="reducedMotion"
                        >
                        <span class="preference-text">Reduce motion and animations</span>
                    </label>
                </div>

                <div class="preference-group">
                    <label class="preference-label">
                        <input 
                            type="checkbox" 
                            ${processed.highContrast ? 'checked' : ''} 
                            data-preference="highContrast"
                        >
                        <span class="preference-text">Use high contrast colors</span>
                    </label>
                </div>

                <div class="preference-group">
                    <label class="preference-label">
                        <input 
                            type="checkbox" 
                            ${processed.announceChanges ? 'checked' : ''} 
                            data-preference="announceChanges"
                        >
                        <span class="preference-text">Announce theme changes to screen readers</span>
                    </label>
                </div>

                <div class="preference-group">
                    <label class="preference-label">
                        <input 
                            type="checkbox" 
                            ${processed.keyboardNavigation ? 'checked' : ''} 
                            data-preference="keyboardNavigation"
                        >
                        <span class="preference-text">Enable keyboard navigation shortcuts</span>
                    </label>
                </div>
            </div>
        `.trim();
    }

    /**
     * Build theme preview card
     * @param {string} theme - Theme to preview
     * @param {Object} options - Preview options
     * @returns {string} Theme preview HTML
     */
    static buildThemePreview(theme, options = {}) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        const displayName = ThemeManagerProcessors.processThemeForDisplay(theme);
        const showColors = options.showColors !== false;
        const showDescription = options.showDescription !== false;
        const cardId = options.id || `${theme}-preview`;

        const descriptions = {
            'light': 'Clean, bright interface with high readability',
            'dark': 'Comfortable dark interface that reduces eye strain',
            'high-contrast': 'Maximum contrast for improved accessibility'
        };

        return `
            <div id="${cardId}" class="theme-preview theme-preview--${theme}" data-theme-preview="${theme}">
                <div class="theme-preview-header">
                    <h5 class="theme-preview-title">${displayName}</h5>
                </div>
                
                ${showColors ? `
                    <div class="theme-preview-colors">
                        <div class="color-sample color-sample--primary" aria-label="Primary color"></div>
                        <div class="color-sample color-sample--secondary" aria-label="Secondary color"></div>
                        <div class="color-sample color-sample--background" aria-label="Background color"></div>
                        <div class="color-sample color-sample--text" aria-label="Text color"></div>
                    </div>
                ` : ''}

                ${showDescription ? `
                    <p class="theme-preview-description">
                        ${descriptions[theme] || 'Custom theme configuration'}
                    </p>
                ` : ''}

                <div class="theme-preview-actions">
                    <button 
                        class="preview-apply-btn" 
                        data-theme="${theme}"
                        type="button"
                    >
                        Apply ${displayName}
                    </button>
                </div>
            </div>
        `.trim();
    }

    /**
     * Build CSS styles for theme management UI
     * @param {string} theme - Current theme
     * @param {Object} customProperties - Custom CSS properties
     * @returns {string} CSS styles string
     */
    static buildThemeStyles(theme, customProperties = {}) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        const processed = ThemeManagerProcessors.processCSSCustomProperties(theme, customProperties);
        
        const cssProperties = Object.entries(processed)
            .map(([property, value]) => `  ${property}: ${value};`)
            .join('\n');

        return `
            <style data-theme-styles="${theme}">
                :root[data-theme="${theme}"] {
                ${cssProperties}
                }
                
                .theme-btn--${theme}.active {
                    --btn-background: var(--color-primary);
                    --btn-color: var(--color-on-primary);
                    --btn-border: var(--color-primary);
                }
                
                .theme-preview--${theme} {
                    border: 2px solid var(--color-primary);
                    background: var(--color-surface);
                }
            </style>
        `.trim();
    }

    /**
     * Build loading state for theme management
     * @param {string} message - Loading message
     * @param {Object} options - Loading options
     * @returns {string} Loading state HTML
     */
    static buildLoadingState(message = 'Loading theme...', options = {}) {
        const validation = ThemeManagerValidators.validateScreenReaderMessage(message);
        if (!validation.isValid) {
            throw new Error(`Invalid loading message: ${validation.error}`);
        }

        const loadingId = options.id || 'theme-loading';
        const showSpinner = options.showSpinner !== false;

        return `
            <div id="${loadingId}" class="theme-loading" role="status" aria-live="polite">
                ${showSpinner ? '<div class="loading-spinner" aria-hidden="true"></div>' : ''}
                <span class="loading-message">${message}</span>
            </div>
        `.trim();
    }

    /**
     * Build error state for theme management
     * @param {string} error - Error message
     * @param {Object} options - Error display options
     * @returns {string} Error state HTML
     */
    static buildErrorState(error, options = {}) {
        if (!error || typeof error !== 'string') {
            throw new Error('Error message is required');
        }

        const errorId = options.id || 'theme-error';
        const showRetry = options.showRetry !== false;
        const retryAction = options.retryAction || 'retry-theme-operation';

        return `
            <div id="${errorId}" class="theme-error" role="alert">
                <div class="error-icon" aria-hidden="true">⚠️</div>
                <div class="error-content">
                    <h5 class="error-title">Theme Error</h5>
                    <p class="error-message">${error}</p>
                    ${showRetry ? `
                        <button 
                            class="error-retry-btn" 
                            type="button"
                            data-action="${retryAction}"
                        >
                            Try Again
                        </button>
                    ` : ''}
                </div>
            </div>
        `.trim();
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManagerUIBuilders;
}

if (typeof window !== 'undefined') {
    window.ThemeManagerUIBuilders = ThemeManagerUIBuilders;
}