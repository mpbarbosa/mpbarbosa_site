/**
 * ThemeManagerValidators - Pure validation functions for theme management
 * 
 * This class contains pure validation functions that validate theme data,
 * accessibility preferences, and keyboard input without side effects.
 * All methods are static and return consistent validation result objects.
 * 
 * Architecture: Functional Core (Pure Functions)
 * Pattern: Static methods with consistent return format
 * Dependencies: None (pure functions)
 */

class ThemeManagerValidators {
    /**
     * Validate theme name
     * @param {string} theme - Theme name to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateTheme(theme) {
        if (!theme || typeof theme !== 'string') {
            return {
                isValid: false,
                error: 'Theme must be a non-empty string'
            };
        }

        const validThemes = ['light', 'dark', 'high-contrast'];
        if (!validThemes.includes(theme)) {
            return {
                isValid: false,
                error: `Theme must be one of: ${validThemes.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Validate stored theme value from localStorage
     * @param {string} storedTheme - Theme value from storage
     * @returns {Object} Validation result
     */
    static validateStoredTheme(storedTheme) {
        if (!storedTheme) {
            return {
                isValid: false,
                error: 'No stored theme found'
            };
        }

        return this.validateTheme(storedTheme);
    }

    /**
     * Validate keyboard shortcut key
     * @param {string} key - Key from keyboard event
     * @returns {Object} Validation result
     */
    static validateKeyboardShortcut(key) {
        if (!key || typeof key !== 'string') {
            return {
                isValid: false,
                error: 'Key must be a non-empty string'
            };
        }

        const validKeys = ['l', 'd', 'h', 'c', 'Escape'];
        const normalizedKey = key.toLowerCase();
        
        if (!validKeys.includes(key) && !validKeys.includes(normalizedKey)) {
            return {
                isValid: false,
                error: `Key must be one of: ${validKeys.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Validate accessibility preferences
     * @param {Object} preferences - Accessibility preferences object
     * @returns {Object} Validation result
     */
    static validateAccessibilityPreferences(preferences) {
        if (!preferences || typeof preferences !== 'object') {
            return {
                isValid: false,
                error: 'Preferences must be an object'
            };
        }

        // Validate reduced motion preference
        if (preferences.hasOwnProperty('reducedMotion') && 
            typeof preferences.reducedMotion !== 'boolean') {
            return {
                isValid: false,
                error: 'reducedMotion must be a boolean'
            };
        }

        // Validate high contrast preference
        if (preferences.hasOwnProperty('highContrast') && 
            typeof preferences.highContrast !== 'boolean') {
            return {
                isValid: false,
                error: 'highContrast must be a boolean'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate screen reader message
     * @param {string} message - Message for screen reader
     * @returns {Object} Validation result
     */
    static validateScreenReaderMessage(message) {
        if (!message || typeof message !== 'string') {
            return {
                isValid: false,
                error: 'Screen reader message must be a non-empty string'
            };
        }

        if (message.trim().length === 0) {
            return {
                isValid: false,
                error: 'Screen reader message cannot be empty or whitespace only'
            };
        }

        if (message.length > 200) {
            return {
                isValid: false,
                error: 'Screen reader message should be under 200 characters for optimal experience'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate DOM element for theme operations
     * @param {Element} element - DOM element to validate
     * @returns {Object} Validation result
     */
    static validateDOMElement(element) {
        if (!element) {
            return {
                isValid: false,
                error: 'Element is required'
            };
        }

        if (!(element instanceof Element)) {
            return {
                isValid: false,
                error: 'Must be a valid DOM Element'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate keyboard event for theme shortcuts
     * @param {KeyboardEvent} event - Keyboard event object
     * @returns {Object} Validation result
     */
    static validateKeyboardEvent(event) {
        if (!event) {
            return {
                isValid: false,
                error: 'Keyboard event is required'
            };
        }

        if (typeof event !== 'object' || !event.hasOwnProperty('key')) {
            return {
                isValid: false,
                error: 'Must be a valid KeyboardEvent with key property'
            };
        }

        return this.validateKeyboardShortcut(event.key);
    }

    /**
     * Validate theme button ID format
     * @param {string} buttonId - Button ID to validate
     * @returns {Object} Validation result
     */
    static validateThemeButtonId(buttonId) {
        if (!buttonId || typeof buttonId !== 'string') {
            return {
                isValid: false,
                error: 'Button ID must be a non-empty string'
            };
        }

        const validButtonIds = ['lightTheme', 'darkTheme', 'highcontrastTheme', 'high-contrastTheme'];
        if (!validButtonIds.includes(buttonId)) {
            return {
                isValid: false,
                error: `Button ID must be one of: ${validButtonIds.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Validate media query for system preferences
     * @param {string} mediaQuery - CSS media query string
     * @returns {Object} Validation result
     */
    static validateMediaQuery(mediaQuery) {
        if (!mediaQuery || typeof mediaQuery !== 'string') {
            return {
                isValid: false,
                error: 'Media query must be a non-empty string'
            };
        }

        const validQueries = [
            '(prefers-color-scheme: dark)',
            '(prefers-color-scheme: light)',
            '(prefers-reduced-motion: reduce)',
            '(prefers-contrast: high)'
        ];

        if (!validQueries.includes(mediaQuery)) {
            return {
                isValid: false,
                error: `Media query must be one of: ${validQueries.join(', ')}`
            };
        }

        return { isValid: true };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManagerValidators;
}

if (typeof window !== 'undefined') {
    window.ThemeManagerValidators = ThemeManagerValidators;
}