// ===== DATA EXPORT VALIDATORS CLASS =====
// Pure validation functions for data export operations
// Part of the Data Export modular architecture following "Functional Core, Imperative Shell" pattern

/**
 * DataExportValidators - Pure validation functions for data export operations
 * 
 * This class contains only pure functions that validate inputs for data export operations.
 * No side effects, no DOM access, no external dependencies - only pure validation logic.
 * 
 * All methods return a consistent format: { isValid: boolean, error?: string }
 * 
 * @class DataExportValidators
 */
class DataExportValidators {
    
    /**
     * Validate export format selection
     * @param {string} format - The export format to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateExportFormat(format) {
        const validFormats = ['pdf', 'csv', 'json', 'images'];
        
        if (!format || typeof format !== 'string') {
            return {
                isValid: false,
                error: 'Export format is required and must be a string'
            };
        }
        
        if (!validFormats.includes(format.toLowerCase())) {
            return {
                isValid: false,
                error: `Invalid export format. Must be one of: ${validFormats.join(', ')}`
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate analytics data for export
     * @param {object} data - The analytics data to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateAnalyticsData(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Analytics data is required and must be an object'
            };
        }
        
        // Check for essential data properties
        const hasTopTracks = data.topTracks && Array.isArray(data.topTracks);
        const hasTopArtists = data.topArtists && Array.isArray(data.topArtists);
        const hasAnalytics = data.analytics && typeof data.analytics === 'object';
        
        if (!hasTopTracks && !hasTopArtists && !hasAnalytics) {
            return {
                isValid: false,
                error: 'Analytics data must contain at least one of: topTracks, topArtists, or analytics'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate filename for export
     * @param {string} filename - The filename to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateFilename(filename) {
        if (!filename || typeof filename !== 'string') {
            return {
                isValid: false,
                error: 'Filename is required and must be a string'
            };
        }
        
        // Check for invalid characters
        const invalidChars = /[<>:"/\\|?*]/;
        if (invalidChars.test(filename)) {
            return {
                isValid: false,
                error: 'Filename contains invalid characters: < > : " / \\ | ? *'
            };
        }
        
        // Check length
        if (filename.length > 255) {
            return {
                isValid: false,
                error: 'Filename is too long (maximum 255 characters)'
            };
        }
        
        if (filename.length === 0) {
            return {
                isValid: false,
                error: 'Filename cannot be empty'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate PDF export options
     * @param {object} options - The PDF export options to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validatePdfOptions(options) {
        if (!options || typeof options !== 'object') {
            return {
                isValid: false,
                error: 'PDF options are required and must be an object'
            };
        }
        
        // Validate title if provided
        if (options.title !== undefined) {
            if (typeof options.title !== 'string') {
                return {
                    isValid: false,
                    error: 'PDF title must be a string'
                };
            }
            
            if (options.title.length > 100) {
                return {
                    isValid: false,
                    error: 'PDF title is too long (maximum 100 characters)'
                };
            }
        }
        
        // Validate boolean options
        const booleanOptions = ['includeSummary', 'includeCharts', 'includePersonality', 'includeRecommendations'];
        for (const option of booleanOptions) {
            if (options[option] !== undefined && typeof options[option] !== 'boolean') {
                return {
                    isValid: false,
                    error: `PDF option '${option}' must be a boolean`
                };
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate CSV export options
     * @param {object} options - The CSV export options to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateCsvOptions(options) {
        if (!options || typeof options !== 'object') {
            return {
                isValid: false,
                error: 'CSV options are required and must be an object'
            };
        }
        
        // Validate delimiter
        if (options.delimiter !== undefined) {
            const validDelimiters = [',', ';', '\t'];
            if (!validDelimiters.includes(options.delimiter)) {
                return {
                    isValid: false,
                    error: 'CSV delimiter must be one of: comma (,), semicolon (;), or tab (\\t)'
                };
            }
        }
        
        // Validate boolean export options
        const booleanOptions = ['exportTracks', 'exportArtists', 'exportGenres', 'exportListeningHistory'];
        for (const option of booleanOptions) {
            if (options[option] !== undefined && typeof options[option] !== 'boolean') {
                return {
                    isValid: false,
                    error: `CSV option '${option}' must be a boolean`
                };
            }
        }
        
        // At least one export option must be true
        const hasAnyExportEnabled = booleanOptions.some(option => options[option] === true);
        if (!hasAnyExportEnabled && options.exportTracks !== undefined) {
            return {
                isValid: false,
                error: 'At least one CSV export option must be enabled'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate JSON export options
     * @param {object} options - The JSON export options to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateJsonOptions(options) {
        if (!options || typeof options !== 'object') {
            return {
                isValid: false,
                error: 'JSON options are required and must be an object'
            };
        }
        
        // Validate boolean options
        const booleanOptions = ['prettyPrint', 'includeMetadata', 'compressData'];
        for (const option of booleanOptions) {
            if (options[option] !== undefined && typeof options[option] !== 'boolean') {
                return {
                    isValid: false,
                    error: `JSON option '${option}' must be a boolean`
                };
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate image export options
     * @param {object} options - The image export options to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateImageOptions(options) {
        if (!options || typeof options !== 'object') {
            return {
                isValid: false,
                error: 'Image options are required and must be an object'
            };
        }
        
        // Validate image format
        if (options.format !== undefined) {
            const validFormats = ['png', 'jpg', 'jpeg', 'svg'];
            if (!validFormats.includes(options.format.toLowerCase())) {
                return {
                    isValid: false,
                    error: `Image format must be one of: ${validFormats.join(', ')}`
                };
            }
        }
        
        // Validate resolution
        if (options.resolution !== undefined) {
            if (!Number.isInteger(options.resolution) || options.resolution < 1 || options.resolution > 5) {
                return {
                    isValid: false,
                    error: 'Image resolution must be an integer between 1 and 5'
                };
            }
        }
        
        // Validate boolean options
        const booleanOptions = ['watermark'];
        for (const option of booleanOptions) {
            if (options[option] !== undefined && typeof options[option] !== 'boolean') {
                return {
                    isValid: false,
                    error: `Image option '${option}' must be a boolean`
                };
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate export progress percentage
     * @param {number} percentage - The progress percentage to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateProgressPercentage(percentage) {
        if (percentage === undefined || percentage === null) {
            return {
                isValid: false,
                error: 'Progress percentage is required'
            };
        }
        
        if (typeof percentage !== 'number' || isNaN(percentage)) {
            return {
                isValid: false,
                error: 'Progress percentage must be a number'
            };
        }
        
        if (percentage < 0 || percentage > 100) {
            return {
                isValid: false,
                error: 'Progress percentage must be between 0 and 100'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate export progress message
     * @param {string} message - The progress message to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateProgressMessage(message) {
        if (!message || typeof message !== 'string') {
            return {
                isValid: false,
                error: 'Progress message is required and must be a string'
            };
        }
        
        if (message.length > 200) {
            return {
                isValid: false,
                error: 'Progress message is too long (maximum 200 characters)'
            };
        }
        
        return { isValid: true };
    }
    
    /**
     * Validate canvas elements for image export
     * @param {Array|NodeList} canvases - The canvas elements to validate
     * @returns {object} Validation result with isValid boolean and optional error message
     */
    static validateCanvasElements(canvases) {
        if (!canvases) {
            return {
                isValid: false,
                error: 'Canvas elements are required'
            };
        }
        
        // Convert NodeList to Array if needed
        const canvasArray = Array.from(canvases);
        
        if (!Array.isArray(canvasArray) || canvasArray.length === 0) {
            return {
                isValid: false,
                error: 'At least one canvas element is required for image export'
            };
        }
        
        // Validate each canvas element
        for (let i = 0; i < canvasArray.length; i++) {
            const canvas = canvasArray[i];
            if (!canvas || canvas.tagName !== 'CANVAS') {
                return {
                    isValid: false,
                    error: `Element at index ${i} is not a valid canvas element`
                };
            }
        }
        
        return { isValid: true };
    }
}

// ===== MODULE EXPORTS =====

// Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExportValidators;
}

// Browser environment
if (typeof window !== 'undefined') {
    window.DataExportValidators = DataExportValidators;
}

// ES6 module support
if (typeof exports !== 'undefined') {
    exports.DataExportValidators = DataExportValidators;
}