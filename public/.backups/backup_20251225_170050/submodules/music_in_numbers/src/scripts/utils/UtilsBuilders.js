/**
 * UtilsBuilders - Pure UI building and content generation functions
 * Part of the Music in Numbers modular architecture
 * 
 * This class contains pure functions for building UI elements, generating canvas content,
 * creating HTML structures, and constructing file formats. All functions are deterministic
 * and have no side effects.
 * 
 * All methods are static and pure (no side effects).
 */
class UtilsBuilders {
    /**
     * Build canvas content for shareable music stats card
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
     * @param {Object} canvasData - Canvas configuration data from UtilsProcessors
     * @returns {void} Canvas is drawn directly on the context
     */
    static buildShareableCanvas(ctx, canvasData) {
        const { dimensions, content, styling, positioning } = canvasData;

        // Set canvas size
        ctx.canvas.width = dimensions.width;
        ctx.canvas.height = dimensions.height;

        // Draw background
        ctx.fillStyle = styling.backgroundColor;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Draw title
        ctx.fillStyle = styling.textColor;
        ctx.font = styling.titleFont;
        ctx.fillText(content.title, positioning.title.x, positioning.title.y);

        // Draw user name
        ctx.font = styling.bodyFont;
        ctx.fillText(content.userName, positioning.userName.x, positioning.userName.y);

        // Draw footer
        ctx.fillText(content.footer, positioning.footer.x, positioning.footer.y);
    }

    /**
     * Create download link element with properties
     * @param {Object} linkProperties - Link properties from UtilsProcessors
     * @returns {HTMLAnchorElement} Configured download link element
     */
    static createDownloadLink(linkProperties) {
        const link = document.createElement('a');
        
        // Set basic properties
        link.href = linkProperties.href;
        link.download = linkProperties.download;
        
        // Apply styling
        if (linkProperties.style) {
            const styles = linkProperties.style.split(';');
            styles.forEach(style => {
                const [property, value] = style.split(':').map(s => s.trim());
                if (property && value) {
                    link.style[property] = value;
                }
            });
        }
        
        // Set attributes
        if (linkProperties.attributes) {
            Object.entries(linkProperties.attributes).forEach(([key, value]) => {
                link.setAttribute(key, value);
            });
        }
        
        return link;
    }

    /**
     * Create blob from content and parameters
     * @param {Object} blobParams - Blob creation parameters from UtilsProcessors
     * @returns {Blob} Created blob object
     */
    static createBlob(blobParams) {
        const { content, options } = blobParams;
        return new Blob([content], options);
    }

    /**
     * Build result message element structure
     * @param {string} message - Message text
     * @param {string} type - Message type
     * @param {Object} messageProperties - Message properties from UtilsProcessors
     * @returns {Object} Result element configuration
     */
    static buildResultMessageElement(message, type, messageProperties) {
        const fullMessage = messageProperties.icon + message;
        
        return {
            content: fullMessage,
            className: `result ${type}`,
            attributes: {
                role: messageProperties.role,
                'aria-live': messageProperties.ariaLive,
                'aria-atomic': 'true'
            },
            styling: {
                display: 'block'
            },
            focus: messageProperties.focusable,
            tabIndex: messageProperties.focusable ? '-1' : null
        };
    }

    /**
     * Generate JSON string from data with formatting
     * @param {Object} data - Data to convert to JSON
     * @param {number} indent - Number of spaces for indentation
     * @returns {string} Formatted JSON string
     */
    static generateFormattedJSON(data, indent = 2) {
        try {
            return JSON.stringify(data, null, indent);
        } catch (error) {
            throw new Error(`Failed to generate JSON: ${error.message}`);
        }
    }

    /**
     * Build canvas element with specified dimensions
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {HTMLCanvasElement} Created canvas element
     */
    static buildCanvasElement(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    /**
     * Create URL from blob for downloads
     * @param {Blob} blob - Blob to create URL from
     * @returns {string} Object URL for the blob
     */
    static createBlobURL(blob) {
        return URL.createObjectURL(blob);
    }

    /**
     * Build scroll options for smooth scrolling
     * @param {string} block - Block alignment ('nearest', 'start', 'center', 'end')
     * @returns {Object} Scroll options object
     */
    static buildScrollOptions(block = 'nearest') {
        return {
            behavior: 'smooth',
            block: block
        };
    }

    /**
     * Generate timeout configuration for auto-hide messages
     * @param {number} timeout - Timeout in milliseconds
     * @param {Function} callback - Callback function to execute
     * @returns {Object} Timeout configuration
     */
    static buildTimeoutConfiguration(timeout, callback) {
        return {
            delay: timeout,
            callback: callback,
            shouldExecute: timeout > 0
        };
    }

    /**
     * Build accessibility attributes for result messages
     * @param {string} type - Message type
     * @param {boolean} focusable - Whether element should be focusable
     * @returns {Object} Accessibility attributes
     */
    static buildAccessibilityAttributes(type, focusable = false) {
        const baseAttributes = {
            'aria-atomic': 'true'
        };

        if (type === 'error') {
            baseAttributes.role = 'alert';
            baseAttributes['aria-live'] = 'assertive';
        } else {
            baseAttributes.role = 'status';
            baseAttributes['aria-live'] = 'polite';
        }

        if (focusable) {
            baseAttributes.tabindex = '-1';
        }

        return baseAttributes;
    }

    /**
     * Create CSS class string from type
     * @param {string} baseClass - Base CSS class
     * @param {string} type - Type modifier
     * @returns {string} Complete CSS class string
     */
    static buildCSSClassString(baseClass, type) {
        return `${baseClass} ${type}`;
    }

    /**
     * Build file export metadata
     * @param {string} fileName - File name
     * @param {string} mimeType - MIME type
     * @param {number} size - File size in bytes
     * @returns {Object} File metadata object
     */
    static buildFileMetadata(fileName, mimeType, size = 0) {
        return {
            name: fileName,
            type: mimeType,
            size: size,
            created: new Date().toISOString(),
            source: 'Music in Numbers - Utils Module'
        };
    }

    /**
     * Generate canvas data URL
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {string} format - Image format ('image/png', 'image/jpeg', etc.)
     * @param {number} quality - Image quality (0-1, for JPEG)
     * @returns {string} Data URL for the canvas
     */
    static generateCanvasDataURL(canvas, format = 'image/png', quality = 0.92) {
        if (format === 'image/jpeg') {
            return canvas.toDataURL(format, quality);
        }
        return canvas.toDataURL(format);
    }

    /**
     * Build DOM cleanup configuration
     * @param {HTMLElement} element - Element to clean up
     * @param {string} url - URL to revoke (optional)
     * @returns {Object} Cleanup configuration
     */
    static buildCleanupConfiguration(element, url = null) {
        return {
            element: element,
            parent: element.parentNode,
            url: url,
            shouldRevokeURL: Boolean(url),
            shouldRemoveElement: true
        };
    }

    /**
     * Create export success message
     * @param {string} exportType - Type of export performed
     * @param {string} fileName - Name of exported file
     * @returns {string} Success message
     */
    static createExportSuccessMessage(exportType, fileName) {
        const typeMessages = {
            'analytics': 'Analytics data exported successfully!',
            'advanced': 'Advanced analytics exported successfully!',
            'report': 'Insight report generated successfully!',
            'card': 'Shareable card generated! Check your downloads.'
        };

        const baseMessage = typeMessages[exportType] || 'Export completed successfully!';
        
        if (fileName) {
            return `${baseMessage} File: ${fileName}`;
        }
        
        return baseMessage;
    }

    /**
     * Build error message for failed operations
     * @param {string} operation - Operation that failed
     * @param {string} reason - Reason for failure
     * @returns {string} Error message
     */
    static buildErrorMessage(operation, reason) {
        const operationNames = {
            'export': 'export operation',
            'validation': 'validation',
            'canvas': 'canvas generation',
            'file': 'file operation',
            'accessibility': 'accessibility setup'
        };

        const operationName = operationNames[operation] || operation;
        return `Failed to complete ${operationName}: ${reason}`;
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsBuilders;
}

if (typeof window !== 'undefined') {
    window.UtilsBuilders = UtilsBuilders;
}