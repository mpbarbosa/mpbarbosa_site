/**
 * ThemeManagerProcessors - Pure data processing functions for theme management
 * 
 * This class contains pure processing functions that handle theme name transformation,
 * button selector generation, keyboard shortcut mapping, and accessibility data processing.
 * All methods are static pure functions with no side effects.
 * 
 * Architecture: Functional Core (Pure Functions)
 * Pattern: Static methods returning processed data
 * Dependencies: ThemeManagerValidators for input validation
 */

class ThemeManagerProcessors {
    /**
     * Process theme name for button ID generation
     * @param {string} theme - Theme name to process
     * @returns {string} Processed button ID
     */
    static processThemeToButtonId(theme) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        // Convert theme name to button ID format
        switch (theme) {
            case 'light':
                return 'lightTheme';
            case 'dark':
                return 'darkTheme';
            case 'high-contrast':
                return 'highcontrastTheme';
            default:
                return `${theme}Theme`;
        }
    }

    /**
     * Process theme name for alternative button ID formats
     * @param {string} theme - Theme name to process
     * @returns {Array<string>} Array of possible button IDs
     */
    static processThemeToButtonIds(theme) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        const buttonIds = [];
        
        // Primary format
        buttonIds.push(this.processThemeToButtonId(theme));
        
        // Alternative formats for high-contrast
        if (theme === 'high-contrast') {
            buttonIds.push('high-contrastTheme');
        }
        
        return buttonIds;
    }

    /**
     * Process keyboard key to theme mapping
     * @param {string} key - Keyboard key
     * @returns {string|null} Corresponding theme or null if no mapping
     */
    static processKeyToTheme(key) {
        const validation = ThemeManagerValidators.validateKeyboardShortcut(key);
        if (!validation.isValid) {
            return null;
        }

        const keyMapping = {
            'l': 'light',
            'L': 'light',
            'd': 'dark',
            'D': 'dark',
            'h': 'high-contrast',
            'H': 'high-contrast'
        };

        return keyMapping[key] || null;
    }

    /**
     * Process theme name for display purposes
     * @param {string} theme - Theme name to process
     * @returns {string} Human-readable theme name
     */
    static processThemeForDisplay(theme) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            return 'Unknown Theme';
        }

        const displayNames = {
            'light': 'Light Mode',
            'dark': 'Dark Mode',
            'high-contrast': 'High Contrast Mode'
        };

        return displayNames[theme] || theme;
    }

    /**
     * Process media query result to theme preference
     * @param {boolean} matches - Whether media query matches
     * @param {string} mediaQuery - The media query that was tested
     * @returns {string|null} Corresponding theme or null
     */
    static processMediaQueryToTheme(matches, mediaQuery) {
        const validation = ThemeManagerValidators.validateMediaQuery(mediaQuery);
        if (!validation.isValid) {
            return null;
        }

        if (mediaQuery === '(prefers-color-scheme: dark)') {
            return matches ? 'dark' : 'light';
        }

        if (mediaQuery === '(prefers-color-scheme: light)') {
            return matches ? 'light' : 'dark';
        }

        if (mediaQuery === '(prefers-contrast: high)') {
            return matches ? 'high-contrast' : null;
        }

        return null;
    }

    /**
     * Process accessibility preferences from system
     * @param {Object} systemPreferences - System accessibility preferences
     * @returns {Object} Processed accessibility configuration
     */
    static processAccessibilityPreferences(systemPreferences = {}) {
        const validation = ThemeManagerValidators.validateAccessibilityPreferences(systemPreferences);
        if (!validation.isValid) {
            throw new Error(`Invalid accessibility preferences: ${validation.error}`);
        }

        return {
            reducedMotion: systemPreferences.reducedMotion || false,
            highContrast: systemPreferences.highContrast || false,
            forceFocus: systemPreferences.forceFocus || false,
            announceChanges: systemPreferences.announceChanges !== false, // default true
            keyboardNavigation: systemPreferences.keyboardNavigation !== false // default true
        };
    }

    /**
     * Process screen reader message for optimal delivery
     * @param {string} message - Raw message
     * @param {string} theme - Current theme for context
     * @returns {string} Optimized screen reader message
     */
    static processScreenReaderMessage(message, theme = '') {
        const validation = ThemeManagerValidators.validateScreenReaderMessage(message);
        if (!validation.isValid) {
            throw new Error(`Invalid screen reader message: ${validation.error}`);
        }

        // Add context if theme is provided
        if (theme) {
            const themeValidation = ThemeManagerValidators.validateTheme(theme);
            if (themeValidation.isValid) {
                const displayTheme = this.processThemeForDisplay(theme);
                return `${message}. Current theme: ${displayTheme}`;
            }
        }

        return message.trim();
    }

    /**
     * Process keyboard event to extract shortcut information
     * @param {Object} event - Keyboard event object
     * @returns {Object} Processed shortcut information
     */
    static processKeyboardEvent(event) {
        const validation = ThemeManagerValidators.validateKeyboardEvent(event);
        if (!validation.isValid) {
            throw new Error(`Invalid keyboard event: ${validation.error}`);
        }

        return {
            key: event.key,
            altKey: event.altKey || false,
            ctrlKey: event.ctrlKey || false,
            shiftKey: event.shiftKey || false,
            theme: this.processKeyToTheme(event.key),
            isThemeShortcut: this.processKeyToTheme(event.key) !== null,
            isEscape: event.key === 'Escape',
            shouldPreventDefault: event.altKey && this.processKeyToTheme(event.key) !== null
        };
    }

    /**
     * Process button class list for theme state
     * @param {string} currentTheme - Current active theme
     * @param {string} buttonTheme - Theme this button represents
     * @returns {Array<string>} Array of CSS classes for the button
     */
    static processButtonClasses(currentTheme, buttonTheme) {
        const currentValidation = ThemeManagerValidators.validateTheme(currentTheme);
        const buttonValidation = ThemeManagerValidators.validateTheme(buttonTheme);
        
        if (!currentValidation.isValid || !buttonValidation.isValid) {
            return ['theme-btn'];
        }

        const classes = ['theme-btn'];
        
        if (currentTheme === buttonTheme) {
            classes.push('active');
        }

        // Add theme-specific classes
        classes.push(`theme-btn--${buttonTheme}`);

        return classes;
    }

    /**
     * Process CSS custom properties for theme
     * @param {string} theme - Theme to process
     * @param {Object} options - Processing options
     * @returns {Object} CSS custom properties object
     */
    static processCSSCustomProperties(theme, options = {}) {
        const validation = ThemeManagerValidators.validateTheme(theme);
        if (!validation.isValid) {
            throw new Error(`Invalid theme: ${validation.error}`);
        }

        const properties = {};

        // Handle reduced motion
        if (options.reducedMotion) {
            properties['--transition'] = 'none';
            properties['--animation-duration'] = '0s';
        } else {
            properties['--transition'] = 'all 0.3s ease';
            properties['--animation-duration'] = '0.3s';
        }

        // Handle high contrast adjustments
        if (theme === 'high-contrast') {
            properties['--focus-ring-width'] = '3px';
            properties['--border-width'] = '2px';
        } else {
            properties['--focus-ring-width'] = '2px';
            properties['--border-width'] = '1px';
        }

        return properties;
    }

    /**
     * Process theme storage key for different contexts
     * @param {string} context - Storage context (default, user, session)
     * @returns {string} Processed storage key
     */
    static processStorageKey(context = 'default') {
        const validContexts = ['default', 'user', 'session', 'temporary'];
        
        if (!validContexts.includes(context)) {
            throw new Error(`Invalid storage context: ${context}`);
        }

        const keyMappings = {
            'default': 'spotify-theme',
            'user': 'user-spotify-theme',
            'session': 'session-spotify-theme',
            'temporary': 'temp-spotify-theme'
        };

        return keyMappings[context];
    }

    /**
     * Process focus target for accessibility
     * @param {string} escapeContext - Context when escape was pressed
     * @returns {string} Element ID to focus on
     */
    static processFocusTarget(escapeContext = 'default') {
        const focusTargets = {
            'default': 'main-content',
            'modal': 'modal-close-button',
            'menu': 'menu-toggle',
            'form': 'first-form-input',
            'theme-selector': 'theme-toggle'
        };

        return focusTargets[escapeContext] || focusTargets['default'];
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManagerProcessors;
}

if (typeof window !== 'undefined') {
    window.ThemeManagerProcessors = ThemeManagerProcessors;
}