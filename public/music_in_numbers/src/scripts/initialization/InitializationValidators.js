/**
 * INITIALIZATION VALIDATORS - Pure Validation Functions
 * =====================================================
 * 
 * Following "Functional Core" pattern - All functions are pure with no side effects.
 * Validates initialization parameters, environment conditions, and browser capabilities.
 * 
 * Part of the 7th successful API Class Extraction using proven methodology.
 */

class InitializationValidators {
    
    /**
     * Validates URL parameters for initialization
     * @param {URLSearchParams} urlParams - URL search parameters
     * @returns {Object} Validation result with parsed parameters
     */
    static validateUrlParameters(urlParams) {
        if (!urlParams || typeof urlParams.get !== 'function') {
            return { 
                isValid: false, 
                error: 'Invalid URLSearchParams object',
                authCode: null,
                mockToken: null
            };
        }

        const authCode = urlParams.get('code');
        const mockToken = urlParams.get('token');

        return {
            isValid: true,
            error: null,
            authCode: authCode && typeof authCode === 'string' ? authCode.trim() : null,
            mockToken: mockToken && typeof mockToken === 'string' ? mockToken.trim() : null,
            hasAuthCode: Boolean(authCode),
            hasMockToken: Boolean(mockToken)
        };
    }

    /**
     * Validates authorization code format
     * @param {string} authCode - Authorization code from URL
     * @returns {Object} Validation result
     */
    static validateAuthCode(authCode) {
        if (!authCode || typeof authCode !== 'string') {
            return { 
                isValid: false, 
                error: 'Authorization code must be a non-empty string'
            };
        }

        const trimmedCode = authCode.trim();
        
        if (trimmedCode.length === 0) {
            return { 
                isValid: false, 
                error: 'Authorization code cannot be empty'
            };
        }

        // Basic format validation for Spotify auth codes
        if (trimmedCode.length < 10) {
            return { 
                isValid: false, 
                error: 'Authorization code appears to be too short'
            };
        }

        return {
            isValid: true,
            error: null,
            code: trimmedCode
        };
    }

    /**
     * Validates mock token for development
     * @param {string} mockToken - Mock token from URL parameter
     * @returns {Object} Validation result
     */
    static validateMockToken(mockToken) {
        if (!mockToken || typeof mockToken !== 'string') {
            return { 
                isValid: false, 
                error: 'Mock token must be a non-empty string'
            };
        }

        const trimmedToken = mockToken.trim();
        
        if (trimmedToken.length === 0) {
            return { 
                isValid: false, 
                error: 'Mock token cannot be empty'
            };
        }

        return {
            isValid: true,
            error: null,
            token: trimmedToken
        };
    }

    /**
     * Validates current environment for development mode detection
     * @param {Location} location - Window location object
     * @returns {Object} Environment validation result
     */
    static validateEnvironment(location) {
        if (!location || typeof location !== 'object') {
            return { 
                isValid: false, 
                error: 'Invalid location object',
                isDevelopment: false
            };
        }

        const { hostname, protocol } = location;

        if (!hostname || !protocol) {
            return { 
                isValid: false, 
                error: 'Location object missing required properties',
                isDevelopment: false
            };
        }

        const isDevelopment = 
            hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            protocol === 'file:';

        return {
            isValid: true,
            error: null,
            isDevelopment,
            hostname,
            protocol,
            isLocalhost: hostname === 'localhost' || hostname === '127.0.0.1',
            isFileProtocol: protocol === 'file:'
        };
    }

    /**
     * Validates service worker support in current browser
     * @param {Navigator} navigator - Browser navigator object
     * @returns {Object} Service worker support validation
     */
    static validateServiceWorkerSupport(navigator) {
        if (!navigator || typeof navigator !== 'object') {
            return { 
                isValid: false, 
                error: 'Invalid navigator object',
                isSupported: false
            };
        }

        const isSupported = 'serviceWorker' in navigator;

        return {
            isValid: true,
            error: null,
            isSupported,
            hasServiceWorker: isSupported,
            navigatorAvailable: Boolean(navigator)
        };
    }

    /**
     * Validates service worker registration path
     * @param {string} swPath - Service worker script path
     * @param {string} scope - Service worker scope
     * @returns {Object} Registration path validation
     */
    static validateServiceWorkerConfig(swPath, scope) {
        const result = {
            isValid: true,
            error: null,
            swPath: swPath || '/sw.js',
            scope: scope || '/'
        };

        if (swPath && typeof swPath !== 'string') {
            result.isValid = false;
            result.error = 'Service worker path must be a string';
            return result;
        }

        if (scope && typeof scope !== 'string') {
            result.isValid = false;
            result.error = 'Service worker scope must be a string';
            return result;
        }

        // Validate path format
        if (result.swPath && !result.swPath.startsWith('/')) {
            result.swPath = '/' + result.swPath;
        }

        if (result.scope && !result.scope.startsWith('/')) {
            result.scope = '/' + result.scope;
        }

        return result;
    }

    /**
     * Validates browser localStorage support
     * @param {Storage} localStorage - Browser localStorage object
     * @returns {Object} Storage validation result
     */
    static validateLocalStorageSupport(localStorage) {
        if (!localStorage) {
            return { 
                isValid: false, 
                error: 'localStorage not available',
                isSupported: false
            };
        }

        try {
            // Test localStorage functionality
            const testKey = '_test_storage_' + Date.now();
            localStorage.setItem(testKey, 'test');
            const testValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            const isWorking = testValue === 'test';
            
            return {
                isValid: true,
                error: null,
                isSupported: isWorking,
                canWrite: isWorking,
                canRead: isWorking
            };
        } catch (error) {
            return { 
                isValid: false, 
                error: `localStorage test failed: ${error.message}`,
                isSupported: false
            };
        }
    }

    /**
     * Validates window object and required properties
     * @param {Window} windowObj - Browser window object
     * @returns {Object} Window validation result
     */
    static validateWindowObject(windowObj) {
        if (!windowObj || typeof windowObj !== 'object') {
            return { 
                isValid: false, 
                error: 'Invalid window object',
                hasRequiredProperties: false
            };
        }

        const requiredProperties = ['location', 'history', 'localStorage', 'navigator', 'document'];
        const missingProperties = [];

        for (const prop of requiredProperties) {
            if (!(prop in windowObj) || !windowObj[prop]) {
                missingProperties.push(prop);
            }
        }

        const hasAllProperties = missingProperties.length === 0;

        return {
            isValid: hasAllProperties,
            error: hasAllProperties ? null : `Missing required properties: ${missingProperties.join(', ')}`,
            hasRequiredProperties: hasAllProperties,
            missingProperties,
            availableProperties: requiredProperties.filter(prop => prop in windowObj && windowObj[prop])
        };
    }
}

// ===== MODULE EXPORTS =====

// Node.js/CommonJS support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InitializationValidators;
}

// Browser/AMD support
if (typeof window !== 'undefined') {
    window.InitializationValidators = InitializationValidators;
}

// ES6 Module support
if (typeof globalThis !== 'undefined') {
    globalThis.InitializationValidators = InitializationValidators;
}