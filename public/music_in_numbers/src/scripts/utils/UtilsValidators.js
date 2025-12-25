/**
 * UtilsValidators - Pure validation functions for utility operations
 * Part of the Music in Numbers modular architecture
 * 
 * This class contains pure validation functions that ensure data integrity
 * and input validation for export operations and utility functions.
 * 
 * All methods are static and pure (no side effects).
 */
class UtilsValidators {
    /**
     * Validate access token for export operations
     * @param {string} token - The access token to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateAccessToken(token) {
        if (!token || typeof token !== 'string') {
            return {
                isValid: false,
                error: 'Access token must be a non-empty string'
            };
        }

        if (token.length < 10) {
            return {
                isValid: false,
                error: 'Access token appears to be too short'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate code verifier for OAuth PKCE
     * @param {string} verifier - The code verifier to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateCodeVerifier(verifier) {
        if (!verifier || typeof verifier !== 'string') {
            return {
                isValid: false,
                error: 'Code verifier must be a non-empty string'
            };
        }

        // PKCE code verifier should be 43-128 characters
        if (verifier.length < 43 || verifier.length > 128) {
            return {
                isValid: false,
                error: 'Code verifier must be between 43 and 128 characters'
            };
        }

        // Should contain only unreserved characters
        const unreservedChars = /^[A-Za-z0-9\-._~]+$/;
        if (!unreservedChars.test(verifier)) {
            return {
                isValid: false,
                error: 'Code verifier contains invalid characters'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate analytics data for export
     * @param {Object} analyticsData - The analytics data to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateAnalyticsData(analyticsData) {
        if (!analyticsData || typeof analyticsData !== 'object') {
            return {
                isValid: false,
                error: 'Analytics data must be a valid object'
            };
        }

        const requiredFields = ['analytics'];
        for (const field of requiredFields) {
            if (!(field in analyticsData)) {
                return {
                    isValid: false,
                    error: `Missing required field: ${field}`
                };
            }
        }

        return { isValid: true };
    }

    /**
     * Validate export data structure
     * @param {Object} exportData - The export data to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateExportData(exportData) {
        if (!exportData || typeof exportData !== 'object') {
            return {
                isValid: false,
                error: 'Export data must be a valid object'
            };
        }

        const requiredFields = ['timestamp', 'metadata'];
        for (const field of requiredFields) {
            if (!(field in exportData)) {
                return {
                    isValid: false,
                    error: `Missing required field: ${field}`
                };
            }
        }

        // Validate timestamp format
        if (!exportData.timestamp || isNaN(Date.parse(exportData.timestamp))) {
            return {
                isValid: false,
                error: 'Invalid timestamp format'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate message and type for result display
     * @param {string} message - The message to validate
     * @param {string} type - The message type to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateResultMessage(message, type) {
        if (!message || typeof message !== 'string') {
            return {
                isValid: false,
                error: 'Message must be a non-empty string'
            };
        }

        const validTypes = ['error', 'success', 'warning', 'info'];
        if (!type || !validTypes.includes(type)) {
            return {
                isValid: false,
                error: `Type must be one of: ${validTypes.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Validate canvas dimensions
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateCanvasDimensions(width, height) {
        if (typeof width !== 'number' || typeof height !== 'number') {
            return {
                isValid: false,
                error: 'Width and height must be numbers'
            };
        }

        if (width <= 0 || height <= 0) {
            return {
                isValid: false,
                error: 'Width and height must be positive numbers'
            };
        }

        // Reasonable limits for canvas size
        if (width > 4096 || height > 4096) {
            return {
                isValid: false,
                error: 'Canvas dimensions too large (max 4096x4096)'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate file name for downloads
     * @param {string} fileName - The file name to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateFileName(fileName) {
        if (!fileName || typeof fileName !== 'string') {
            return {
                isValid: false,
                error: 'File name must be a non-empty string'
            };
        }

        // Check for invalid characters
        const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
        if (invalidChars.test(fileName)) {
            return {
                isValid: false,
                error: 'File name contains invalid characters'
            };
        }

        // Check length limits
        if (fileName.length > 255) {
            return {
                isValid: false,
                error: 'File name too long (max 255 characters)'
            };
        }

        return { isValid: true };
    }

    /**
     * Validate user data for reports
     * @param {Object} userData - The user data to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateUserData(userData) {
        if (!userData || typeof userData !== 'object') {
            return {
                isValid: false,
                error: 'User data must be a valid object'
            };
        }

        if (!userData.name || typeof userData.name !== 'string') {
            return {
                isValid: false,
                error: 'User name is required and must be a string'
            };
        }

        return { isValid: true };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsValidators;
}

if (typeof window !== 'undefined') {
    window.UtilsValidators = UtilsValidators;
}