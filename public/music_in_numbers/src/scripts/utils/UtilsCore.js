/**
 * UtilsCore - Business logic orchestration with dependency injection
 * Part of the Music in Numbers modular architecture
 * 
 * This class contains orchestration methods that coordinate complex workflows
 * involving multiple dependencies. All methods use explicit dependency injection
 * following the "functional core, imperative shell" pattern.
 * 
 * All methods are static and use dependency injection for side effects.
 */
class UtilsCore {
    /**
     * Execute basic analytics export workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM element access function
     * @param {Function} dependencies.showResult - Result display function
     * @param {Function} dependencies.createBlob - Blob creation function
     * @param {Function} dependencies.createObjectURL - URL creation function
     * @param {Function} dependencies.revokeObjectURL - URL cleanup function
     * @returns {Promise<Object>} Export result with success status
     */
    static async exportAnalyticsCore(dependencies) {
        const { getElementById, showResult, createBlob, createObjectURL, revokeObjectURL } = dependencies;

        try {
            // Get analytics data from DOM
            const analyticsDiv = getElementById('musicAnalytics');
            if (!analyticsDiv) {
                showResult('No analytics data to export', 'error');
                return { success: false, error: 'No analytics data found' };
            }

            // Get user data from DOM
            const userName = getElementById('userName')?.textContent || 'Unknown User';
            const timeRange = getElementById('timeRangeSelector')?.value || 'medium_term';

            // Generate export data using pure function
            const exportData = UtilsProcessors.createBasicExportData({ userName, timeRange });

            // Validate export data
            const validation = UtilsValidators.validateExportData(exportData);
            if (!validation.isValid) {
                showResult(`Export validation failed: ${validation.error}`, 'error');
                return { success: false, error: validation.error };
            }

            // Create download file
            const jsonString = UtilsBuilders.generateFormattedJSON(exportData);
            const blobParams = UtilsProcessors.processBlobCreation(jsonString, 'json');
            const blob = createBlob(blobParams);
            const url = createObjectURL(blob);

            // Generate file name
            const fileName = UtilsProcessors.generateTimestampedFileName('spotify-analytics', 'json');
            
            // Create and trigger download
            const linkProperties = UtilsBuilders.generateDownloadLinkProperties(fileName, url);
            const link = UtilsBuilders.createDownloadLink(linkProperties);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            revokeObjectURL(url);

            // Show success message
            const successMessage = UtilsBuilders.createExportSuccessMessage('analytics', fileName);
            showResult(successMessage, 'success');

            return { success: true, fileName, data: exportData };

        } catch (error) {
            const errorMessage = UtilsBuilders.buildErrorMessage('export', error.message);
            showResult(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Execute advanced analytics export workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM element access function
     * @param {Function} dependencies.getValidAccessToken - Token access function
     * @param {Function} dependencies.showResult - Result display function
     * @param {Function} dependencies.createBlob - Blob creation function
     * @param {Function} dependencies.createObjectURL - URL creation function
     * @param {Function} dependencies.revokeObjectURL - URL cleanup function
     * @param {Object} dependencies.window - Window object for global state access
     * @returns {Promise<Object>} Export result with success status
     */
    static async exportAdvancedAnalyticsCore(dependencies) {
        const { getElementById, getValidAccessToken, showResult, createBlob, createObjectURL, revokeObjectURL, window } = dependencies;

        try {
            // Validate access token
            const token = getValidAccessToken();
            const tokenValidation = UtilsValidators.validateAccessToken(token);
            if (!tokenValidation.isValid) {
                showResult('No valid access token for export', 'error');
                return { success: false, error: 'Invalid access token' };
            }

            // Get user data from DOM
            const userName = getElementById('userName')?.textContent || 'Unknown User';
            const userCountry = getElementById('userCountry')?.textContent || 'Unknown';
            const timeRange = getElementById('timeRangeSelector')?.value || 'medium_term';

            // Get analytics data from global state
            const analyticsData = window.currentAnalyticsData || {};

            // Generate advanced export data
            const exportData = UtilsProcessors.createAdvancedExportData({
                userName,
                userCountry,
                timeRange,
                analyticsData
            });

            // Validate export data
            const validation = UtilsValidators.validateExportData(exportData);
            if (!validation.isValid) {
                showResult(`Export validation failed: ${validation.error}`, 'error');
                return { success: false, error: validation.error };
            }

            // Create download file
            const jsonString = UtilsBuilders.generateFormattedJSON(exportData);
            const blobParams = UtilsProcessors.processBlobCreation(jsonString, 'json');
            const blob = createBlob(blobParams);
            const url = createObjectURL(blob);

            // Generate file name
            const fileName = UtilsProcessors.generateTimestampedFileName('spotify-advanced-analytics', 'json');
            
            // Create and trigger download
            const linkProperties = UtilsBuilders.generateDownloadLinkProperties(fileName, url);
            const link = UtilsBuilders.createDownloadLink(linkProperties);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            revokeObjectURL(url);

            // Show success message
            const successMessage = UtilsBuilders.createExportSuccessMessage('advanced', fileName);
            showResult(successMessage, 'success');

            return { success: true, fileName, data: exportData };

        } catch (error) {
            const errorMessage = UtilsBuilders.buildErrorMessage('export', error.message);
            showResult(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate shareable card workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM element access function
     * @param {Function} dependencies.showResult - Result display function
     * @param {Function} dependencies.createElement - Element creation function
     * @returns {Promise<Object>} Generation result with success status
     */
    static async generateShareableCardCore(dependencies) {
        const { getElementById, showResult, createElement } = dependencies;

        try {
            // Get user data
            const userName = getElementById('userName')?.textContent || 'Unknown User';

            // Validate canvas dimensions
            const canvasDimensions = { width: 600, height: 400 };
            const dimensionValidation = UtilsValidators.validateCanvasDimensions(canvasDimensions.width, canvasDimensions.height);
            if (!dimensionValidation.isValid) {
                showResult(`Canvas validation failed: ${dimensionValidation.error}`, 'error');
                return { success: false, error: dimensionValidation.error };
            }

            // Create canvas and get context
            const canvas = UtilsBuilders.buildCanvasElement(canvasDimensions.width, canvasDimensions.height);
            const ctx = canvas.getContext('2d');

            // Process canvas data
            const canvasData = UtilsProcessors.processCanvasData({ 
                width: canvasDimensions.width, 
                height: canvasDimensions.height, 
                userName 
            });

            // Build canvas content
            UtilsBuilders.buildShareableCanvas(ctx, canvasData);

            // Generate download
            const dataURL = UtilsBuilders.generateCanvasDataURL(canvas);
            const fileName = UtilsProcessors.generateTimestampedFileName('my-spotify-stats', 'png');
            
            // Create and trigger download
            const link = createElement('a');
            link.download = fileName;
            link.href = dataURL;
            link.click();

            // Show success message
            const successMessage = UtilsBuilders.createExportSuccessMessage('card', fileName);
            showResult(successMessage, 'success');

            return { success: true, fileName, canvas };

        } catch (error) {
            const errorMessage = UtilsBuilders.buildErrorMessage('canvas', error.message);
            showResult(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate insight report workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.showResult - Result display function
     * @param {Function} dependencies.createBlob - Blob creation function
     * @param {Function} dependencies.createObjectURL - URL creation function
     * @param {Function} dependencies.revokeObjectURL - URL cleanup function
     * @param {Object} dependencies.window - Window object for global state access
     * @returns {Promise<Object>} Report generation result with success status
     */
    static async generateInsightReportCore(dependencies) {
        const { showResult, createBlob, createObjectURL, revokeObjectURL, window } = dependencies;

        try {
            // Get analytics data from global state
            const analyticsData = window.currentAnalyticsData;
            
            // Validate analytics data
            const validation = UtilsValidators.validateAnalyticsData(analyticsData);
            if (!validation.isValid) {
                showResult('No analytics data available for report generation', 'error');
                return { success: false, error: 'No analytics data available' };
            }

            // Generate report text
            const reportText = UtilsProcessors.generateInsightReportText(analyticsData);

            // Create download file
            const blobParams = UtilsProcessors.processBlobCreation(reportText, 'text');
            const blob = createBlob(blobParams);
            const url = createObjectURL(blob);

            // Generate file name
            const fileName = UtilsProcessors.generateTimestampedFileName('music-insight-report', 'txt');
            
            // Create and trigger download
            const linkProperties = UtilsBuilders.generateDownloadLinkProperties(fileName, url);
            const link = UtilsBuilders.createDownloadLink(linkProperties);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            revokeObjectURL(url);

            // Show success message
            const successMessage = UtilsBuilders.createExportSuccessMessage('report', fileName);
            showResult(successMessage, 'success');

            return { success: true, fileName, reportText };

        } catch (error) {
            const errorMessage = UtilsBuilders.buildErrorMessage('export', error.message);
            showResult(errorMessage, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Show result message with full accessibility workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM element access function
     * @param {Function} dependencies.setTimeout - Timer function
     * @param {string} message - Message to display
     * @param {string} type - Message type (error, success, warning, info)
     * @returns {Object} Result display operation status
     */
    static showResultCore(dependencies, message, type) {
        const { getElementById, setTimeout } = dependencies;

        try {
            // Validate message parameters
            const validation = UtilsValidators.validateResultMessage(message, type);
            if (!validation.isValid) {
                console.error('Invalid result message parameters:', validation.error);
                return { success: false, error: validation.error };
            }

            // Get result element
            const resultDiv = getElementById('result');
            if (!resultDiv) {
                console.error('Result element not found');
                return { success: false, error: 'Result element not found' };
            }

            // Process message properties
            const messageProperties = UtilsProcessors.calculateMessageProperties(type);
            const elementConfig = UtilsBuilders.buildResultMessageElement(message, type, messageProperties);

            // Apply element configuration
            resultDiv.textContent = elementConfig.content;
            resultDiv.className = elementConfig.className;
            resultDiv.style.display = elementConfig.styling.display;

            // Set accessibility attributes
            Object.entries(elementConfig.attributes).forEach(([key, value]) => {
                resultDiv.setAttribute(key, value);
            });

            // Handle focus for accessibility
            if (elementConfig.focus) {
                if (elementConfig.tabIndex) {
                    resultDiv.setAttribute('tabindex', elementConfig.tabIndex);
                }
                resultDiv.focus();

                // Remove tabindex after focus
                setTimeout(() => {
                    resultDiv.removeAttribute('tabindex');
                }, 1000);
            }

            // Scroll to result
            const scrollOptions = UtilsBuilders.buildScrollOptions('nearest');
            resultDiv.scrollIntoView(scrollOptions);

            // Auto-hide non-error messages
            const autoHideTimeout = UtilsProcessors.calculateAutoHideTimeout(message, type);
            if (autoHideTimeout > 0) {
                const timeoutConfig = UtilsBuilders.buildTimeoutConfiguration(autoHideTimeout, () => {
                    if (resultDiv.style.display === 'block') {
                        resultDiv.style.display = 'none';
                    }
                });

                if (timeoutConfig.shouldExecute) {
                    setTimeout(timeoutConfig.callback, timeoutConfig.delay);
                }
            }

            return { success: true, element: resultDiv, timeout: autoHideTimeout };

        } catch (error) {
            console.error('Failed to show result:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate code challenge workflow with crypto operations
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.crypto - Crypto API access
     * @param {Function} dependencies.btoa - Base64 encoding function
     * @param {string} verifier - Code verifier string
     * @returns {Promise<Object>} Code challenge generation result
     */
    static async generateCodeChallengeCore(dependencies, verifier) {
        const { crypto, btoa } = dependencies;

        try {
            // Validate verifier
            const validation = UtilsValidators.validateCodeVerifier(verifier);
            if (!validation.isValid) {
                return { success: false, error: validation.error };
            }

            // Generate challenge using pure function
            const encoder = new TextEncoder();
            const data = encoder.encode(verifier);
            const digest = await crypto.subtle.digest('SHA-256', data);
            
            const challenge = btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            return { success: true, challenge };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsCore;
}

if (typeof window !== 'undefined') {
    window.UtilsCore = UtilsCore;
}