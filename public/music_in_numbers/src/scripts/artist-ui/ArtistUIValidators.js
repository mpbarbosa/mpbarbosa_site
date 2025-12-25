/**
 * ================================================================================
 * ARTIST UI VALIDATORS - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Pure validation functions for artist UI components and data structures.
 * Contains comprehensive validation logic for HTML inputs, DOM elements, and UI states.
 * 
 * VALIDATION TYPES:
 * - HTML Content Validation (text, attributes, elements)
 * - Artist Data Structure Validation (API responses, formatted data)
 * - DOM Element Validation (existence, properties, states)
 * - UI State Validation (configuration, accessibility, security)
 * - URL and Link Validation (security, format, accessibility)
 * - Template Data Validation (completeness, safety, structure)
 * 
 * PATTERNS:
 * - Pure functions with no side effects
 * - Consistent return format: { isValid: boolean, error?: string, details?: any }
 * - Comprehensive input validation with detailed error messages
 * - XSS prevention and security validation
 * - Accessibility compliance checking
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistUIValidators {
    
    /**
     * Validates HTML text content for XSS prevention and safety
     * @param {any} text - Text content to validate
     * @returns {Object} Validation result with safety details
     */
    static validateHtmlText(text) {
        // Basic type and existence check
        if (text === null || text === undefined) {
            return {
                isValid: false,
                error: 'Text content cannot be null or undefined',
                details: { providedType: typeof text, expectedType: 'string' }
            };
        }
        
        // Convert to string if not already
        const textStr = String(text);
        
        // Length validation
        if (textStr.length === 0) {
            return {
                isValid: true,
                error: null,
                details: { length: 0, isEmpty: true }
            };
        }
        
        if (textStr.length > 10000) {
            return {
                isValid: false,
                error: 'Text content exceeds maximum length of 10,000 characters',
                details: { length: textStr.length, maxLength: 10000 }
            };
        }
        
        // XSS risk assessment
        const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(textStr);
        const hasOnEvents = /\bon\w+\s*=/i.test(textStr);
        const hasJavaScriptProtocol = /javascript:/i.test(textStr);
        const hasDangerousTags = /<(iframe|object|embed|form|input)\b/i.test(textStr);
        
        const xssRisks = [];
        if (hasScriptTags) xssRisks.push('script tags');
        if (hasOnEvents) xssRisks.push('event handlers');
        if (hasJavaScriptProtocol) xssRisks.push('javascript protocol');
        if (hasDangerousTags) xssRisks.push('potentially dangerous HTML tags');
        
        return {
            isValid: true,
            error: null,
            details: {
                length: textStr.length,
                xssRisks: xssRisks,
                hasXssRisks: xssRisks.length > 0,
                requiresEscaping: xssRisks.length > 0
            }
        };
    }
    
    /**
     * Validates artist data structure for completeness and safety
     * @param {any} artistData - Artist data object to validate
     * @returns {Object} Validation result with structure analysis
     */
    static validateArtistData(artistData) {
        if (!artistData || typeof artistData !== 'object') {
            return {
                isValid: false,
                error: 'Artist data must be a valid object',
                details: { providedType: typeof artistData, expectedType: 'object' }
            };
        }
        
        // Required fields for artist display
        const requiredFields = ['name', 'imageUrl', 'followers', 'genres', 'popularity', 'spotifyUrl'];
        const missingFields = requiredFields.filter(field => !artistData[field] && artistData[field] !== 0);
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                error: `Missing required artist data fields: ${missingFields.join(', ')}`,
                details: { missingFields, requiredFields, providedFields: Object.keys(artistData) }
            };
        }
        
        // Validate individual field types and values
        const fieldValidations = {};
        
        // Name validation
        if (typeof artistData.name !== 'string' || artistData.name.trim().length === 0) {
            fieldValidations.name = 'Artist name must be a non-empty string';
        }
        
        // Image URL validation
        if (typeof artistData.imageUrl !== 'string' || !this.isValidUrl(artistData.imageUrl)) {
            fieldValidations.imageUrl = 'Artist image URL must be a valid URL string';
        }
        
        // Followers validation (can be string or number)
        if (!artistData.followers && artistData.followers !== 0) {
            fieldValidations.followers = 'Followers count is required';
        }
        
        // Genres validation
        if (typeof artistData.genres !== 'string' || artistData.genres.trim().length === 0) {
            fieldValidations.genres = 'Genres must be a non-empty string';
        }
        
        // Popularity validation
        const popularity = Number(artistData.popularity);
        if (isNaN(popularity) || popularity < 0 || popularity > 100) {
            fieldValidations.popularity = 'Popularity must be a number between 0 and 100';
        }
        
        // Spotify URL validation
        if (typeof artistData.spotifyUrl !== 'string' || !this.isValidUrl(artistData.spotifyUrl)) {
            fieldValidations.spotifyUrl = 'Spotify URL must be a valid URL string';
        }
        
        const validationErrors = Object.keys(fieldValidations);
        if (validationErrors.length > 0) {
            return {
                isValid: false,
                error: `Invalid artist data fields: ${validationErrors.join(', ')}`,
                details: { fieldValidations, invalidFields: validationErrors }
            };
        }
        
        return {
            isValid: true,
            error: null,
            details: {
                hasOptionalFields: {
                    instagramUrl: !!artistData.instagramUrl,
                    isInstagramConfirmed: !!artistData.isInstagramConfirmed,
                    imageWidth: !!artistData.imageWidth,
                    imageHeight: !!artistData.imageHeight,
                    rawData: !!artistData.rawData
                }
            }
        };
    }
    
    /**
     * Validates DOM element for existence and basic properties
     * @param {any} element - DOM element to validate
     * @param {string} elementType - Expected element type for better error messages
     * @returns {Object} Validation result with element analysis
     */
    static validateDomElement(element, elementType = 'element') {
        if (!element) {
            return {
                isValid: false,
                error: `${elementType} is null or undefined`,
                details: { providedValue: element, expectedType: 'HTMLElement' }
            };
        }
        
        // Check if it's a DOM element
        if (typeof element !== 'object' || !element.nodeType) {
            return {
                isValid: false,
                error: `${elementType} is not a valid DOM element`,
                details: { 
                    providedType: typeof element, 
                    hasNodeType: !!element.nodeType,
                    expectedType: 'HTMLElement' 
                }
            };
        }
        
        // Additional element property checks
        const hasId = !!element.id;
        const hasClassName = !!element.className;
        const hasInnerHTML = 'innerHTML' in element;
        const hasSetAttribute = typeof element.setAttribute === 'function';
        
        return {
            isValid: true,
            error: null,
            details: {
                nodeType: element.nodeType,
                tagName: element.tagName,
                hasId,
                hasClassName,
                hasInnerHTML,
                hasSetAttribute,
                isConnected: element.isConnected
            }
        };
    }
    
    /**
     * Validates error message for display safety and usefulness
     * @param {any} message - Error message to validate
     * @returns {Object} Validation result with message analysis
     */
    static validateErrorMessage(message) {
        if (message === null || message === undefined) {
            return {
                isValid: false,
                error: 'Error message cannot be null or undefined',
                details: { providedType: typeof message }
            };
        }
        
        const messageStr = String(message);
        
        if (messageStr.length === 0) {
            return {
                isValid: false,
                error: 'Error message cannot be empty',
                details: { length: 0 }
            };
        }
        
        if (messageStr.length > 500) {
            return {
                isValid: false,
                error: 'Error message exceeds maximum length of 500 characters',
                details: { length: messageStr.length, maxLength: 500 }
            };
        }
        
        // Check for authentication-related messages
        const isAuthError = /authenticate|login|token|access/i.test(messageStr);
        
        // Validate HTML text content for XSS
        const htmlValidation = this.validateHtmlText(messageStr);
        
        return {
            isValid: true,
            error: null,
            details: {
                length: messageStr.length,
                isAuthenticationError: isAuthError,
                needsAuthenticationLink: isAuthError,
                htmlValidation: htmlValidation.details
            }
        };
    }
    
    /**
     * Validates URL for security and format
     * @param {any} url - URL to validate
     * @returns {Object} Validation result with URL analysis
     */
    static validateUrl(url) {
        if (!url || typeof url !== 'string') {
            return {
                isValid: false,
                error: 'URL must be a non-empty string',
                details: { providedType: typeof url }
            };
        }
        
        const urlStr = url.trim();
        if (urlStr.length === 0) {
            return {
                isValid: false,
                error: 'URL cannot be empty',
                details: { length: 0 }
            };
        }
        
        // Basic URL format validation
        try {
            const urlObj = new URL(urlStr);
            
            // Security checks
            const isSecure = urlObj.protocol === 'https:';
            const isHttp = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
            const isJavaScript = urlObj.protocol === 'javascript:';
            const isData = urlObj.protocol === 'data:';
            
            if (isJavaScript) {
                return {
                    isValid: false,
                    error: 'JavaScript URLs are not allowed for security reasons',
                    details: { protocol: urlObj.protocol, securityRisk: 'XSS' }
                };
            }
            
            return {
                isValid: true,
                error: null,
                details: {
                    protocol: urlObj.protocol,
                    hostname: urlObj.hostname,
                    isSecure,
                    isHttp,
                    isData,
                    isRelative: false
                }
            };
            
        } catch (error) {
            // Try as relative URL
            if (urlStr.startsWith('/') || urlStr.startsWith('./') || urlStr.startsWith('../')) {
                return {
                    isValid: true,
                    error: null,
                    details: {
                        isRelative: true,
                        path: urlStr,
                        isSecure: false
                    }
                };
            }
            
            return {
                isValid: false,
                error: `Invalid URL format: ${error.message}`,
                details: { parseError: error.message, providedUrl: urlStr }
            };
        }
    }
    
    /**
     * Validates UI state configuration for consistency
     * @param {any} config - UI configuration object
     * @returns {Object} Validation result with configuration analysis
     */
    static validateUIConfig(config) {
        if (!config || typeof config !== 'object') {
            return {
                isValid: false,
                error: 'UI configuration must be a valid object',
                details: { providedType: typeof config }
            };
        }
        
        const validatedProperties = {};
        
        // Validate accessibility settings
        if (config.accessibility !== undefined) {
            if (typeof config.accessibility !== 'object') {
                validatedProperties.accessibility = 'Accessibility config must be an object';
            } else {
                const accessibilityValidation = this.validateAccessibilityConfig(config.accessibility);
                if (!accessibilityValidation.isValid) {
                    validatedProperties.accessibility = accessibilityValidation.error;
                }
            }
        }
        
        // Validate theme settings
        if (config.theme !== undefined) {
            if (typeof config.theme !== 'string' || !['light', 'dark', 'auto'].includes(config.theme)) {
                validatedProperties.theme = 'Theme must be one of: light, dark, auto';
            }
        }
        
        // Validate layout settings
        if (config.layout !== undefined) {
            if (typeof config.layout !== 'object') {
                validatedProperties.layout = 'Layout config must be an object';
            }
        }
        
        const hasErrors = Object.keys(validatedProperties).length > 0;
        
        return {
            isValid: !hasErrors,
            error: hasErrors ? `Invalid UI configuration properties: ${Object.keys(validatedProperties).join(', ')}` : null,
            details: {
                validatedProperties,
                hasAccessibilityConfig: !!config.accessibility,
                hasThemeConfig: !!config.theme,
                hasLayoutConfig: !!config.layout
            }
        };
    }
    
    /**
     * Validates accessibility configuration
     * @param {Object} accessibilityConfig - Accessibility settings
     * @returns {Object} Validation result
     */
    static validateAccessibilityConfig(accessibilityConfig) {
        const requiredProperties = ['ariaLabels', 'keyboardNavigation'];
        const missingProperties = requiredProperties.filter(prop => 
            accessibilityConfig[prop] === undefined
        );
        
        if (missingProperties.length > 0) {
            return {
                isValid: false,
                error: `Missing accessibility properties: ${missingProperties.join(', ')}`,
                details: { missingProperties, requiredProperties }
            };
        }
        
        return {
            isValid: true,
            error: null,
            details: { hasAllRequiredProperties: true }
        };
    }
    
    /**
     * Validates HTML attributes for safety and compliance
     * @param {Object} attributes - HTML attributes object
     * @returns {Object} Validation result with attribute analysis
     */
    static validateHtmlAttributes(attributes) {
        if (!attributes || typeof attributes !== 'object') {
            return {
                isValid: false,
                error: 'HTML attributes must be a valid object',
                details: { providedType: typeof attributes }
            };
        }
        
        const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'];
        const foundDangerousAttributes = dangerousAttributes.filter(attr => 
            attributes.hasOwnProperty(attr)
        );
        
        if (foundDangerousAttributes.length > 0) {
            return {
                isValid: false,
                error: `Dangerous event handler attributes found: ${foundDangerousAttributes.join(', ')}`,
                details: { 
                    dangerousAttributes: foundDangerousAttributes,
                    securityRisk: 'XSS vulnerability'
                }
            };
        }
        
        // Validate attribute values
        const attributeValidations = {};
        Object.keys(attributes).forEach(key => {
            const value = attributes[key];
            if (typeof value === 'string' && value.includes('javascript:')) {
                attributeValidations[key] = 'JavaScript URLs not allowed in attributes';
            }
        });
        
        const hasAttributeErrors = Object.keys(attributeValidations).length > 0;
        
        return {
            isValid: !hasAttributeErrors,
            error: hasAttributeErrors ? 'Invalid attribute values found' : null,
            details: {
                attributeCount: Object.keys(attributes).length,
                attributeValidations,
                hasSecurityIssues: hasAttributeErrors
            }
        };
    }
    
    /**
     * Validates container element ID for DOM operations
     * @param {any} containerId - Container element ID
     * @returns {Object} Validation result
     */
    static validateContainerId(containerId) {
        if (!containerId || typeof containerId !== 'string') {
            return {
                isValid: false,
                error: 'Container ID must be a non-empty string',
                details: { providedType: typeof containerId }
            };
        }
        
        const idStr = containerId.trim();
        if (idStr.length === 0) {
            return {
                isValid: false,
                error: 'Container ID cannot be empty',
                details: { length: 0 }
            };
        }
        
        // Validate ID format (should be valid CSS identifier)
        const validIdPattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
        if (!validIdPattern.test(idStr)) {
            return {
                isValid: false,
                error: 'Container ID must be a valid CSS identifier (start with letter, contain only letters, numbers, underscore, hyphen)',
                details: { providedId: idStr, pattern: validIdPattern.toString() }
            };
        }
        
        return {
            isValid: true,
            error: null,
            details: {
                id: idStr,
                length: idStr.length,
                isValidCssIdentifier: true
            }
        };
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Basic URL validation helper
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is valid
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            // Try as relative URL
            return typeof url === 'string' && (
                url.startsWith('/') || 
                url.startsWith('./') || 
                url.startsWith('../')
            );
        }
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistUIValidators;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistUIValidators = ArtistUIValidators;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistUIValidators = ArtistUIValidators;
}