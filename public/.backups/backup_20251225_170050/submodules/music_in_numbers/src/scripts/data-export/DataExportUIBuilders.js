// ===== DATA EXPORT UI BUILDERS CLASS =====
// Pure UI building functions for data export operations
// Part of the Data Export modular architecture following "Functional Core, Imperative Shell" pattern

/**
 * DataExportUIBuilders - Pure UI building functions for data export operations
 * 
 * This class contains only pure functions that generate HTML/CSS content for the export interface.
 * No side effects, no DOM access, no external dependencies - only pure HTML generation logic.
 * 
 * All methods return HTML strings or style objects that can be used by the imperative shell.
 * 
 * @class DataExportUIBuilders
 */
class DataExportUIBuilders {
    
    /**
     * Build format-specific options HTML
     * @param {string} format - The export format to build options for
     * @returns {string} HTML string for format options
     */
    static buildFormatOptionsHtml(format) {
        switch (format.toLowerCase()) {
            case 'pdf':
                return DataExportUIBuilders.buildPdfOptionsHtml();
            case 'csv':
                return DataExportUIBuilders.buildCsvOptionsHtml();
            case 'json':
                return DataExportUIBuilders.buildJsonOptionsHtml();
            case 'images':
                return DataExportUIBuilders.buildImageOptionsHtml();
            default:
                return DataExportUIBuilders.buildDefaultOptionsHtml();
        }
    }
    
    /**
     * Build PDF export options HTML
     * @returns {string} HTML string for PDF options
     */
    static buildPdfOptionsHtml() {
        return `
            <div class="option-group">
                <h4>Content Options</h4>
                <label class="checkbox-label">
                    <input type="checkbox" id="includeSummary" checked>
                    <span class="checkmark"></span>
                    Include Summary Statistics
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="includeCharts" checked>
                    <span class="checkmark"></span>
                    Include Charts & Visualizations
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="includePersonality" checked>
                    <span class="checkmark"></span>
                    Include Music Personality Analysis
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="includeRecommendations" checked>
                    <span class="checkmarks"></span>
                    Include Recommendations
                </label>
            </div>
            <div class="option-group">
                <h4>Report Settings</h4>
                <label for="reportTitle" class="input-label">Report Title:</label>
                <input 
                    type="text" 
                    id="reportTitle" 
                    value="My Music Analytics Report"
                    placeholder="Enter report title"
                    maxlength="100"
                    class="text-input"
                    aria-describedby="reportTitleHelp"
                >
                <small id="reportTitleHelp" class="help-text">Maximum 100 characters</small>
            </div>
        `;
    }
    
    /**
     * Build CSV export options HTML
     * @returns {string} HTML string for CSV options
     */
    static buildCsvOptionsHtml() {
        return `
            <div class="option-group">
                <h4>Data Selection</h4>
                <label class="checkbox-label">
                    <input type="checkbox" id="exportTracks" checked>
                    <span class="checkmark"></span>
                    Top Tracks Data
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="exportArtists" checked>
                    <span class="checkmark"></span>
                    Top Artists Data
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="exportGenres" checked>
                    <span class="checkmark"></span>
                    Genre Analysis
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="exportListeningHistory" checked>
                    <span class="checkmark"></span>
                    Recent Listening History
                </label>
            </div>
            <div class="option-group">
                <h4>Format Settings</h4>
                <label for="csvDelimiter" class="input-label">Field Delimiter:</label>
                <select id="csvDelimiter" class="select-input" aria-describedby="delimiterHelp">
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\\t">Tab</option>
                </select>
                <small id="delimiterHelp" class="help-text">Choose delimiter for CSV fields</small>
            </div>
        `;
    }
    
    /**
     * Build JSON export options HTML
     * @returns {string} HTML string for JSON options
     */
    static buildJsonOptionsHtml() {
        return `
            <div class="option-group">
                <h4>JSON Options</h4>
                <label class="checkbox-label">
                    <input type="checkbox" id="prettyPrint" checked>
                    <span class="checkmark"></span>
                    Pretty Print (Formatted)
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="includeMetadata" checked>
                    <span class="checkmark"></span>
                    Include Export Metadata
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="compressData">
                    <span class="checkmark"></span>
                    Compress Data (Remove Detailed Fields)
                </label>
            </div>
            <div class="option-group">
                <small class="help-text">
                    Pretty printing makes the JSON more readable but increases file size.
                    Compression removes detailed fields to reduce file size.
                </small>
            </div>
        `;
    }
    
    /**
     * Build image export options HTML
     * @returns {string} HTML string for image options
     */
    static buildImageOptionsHtml() {
        return `
            <div class="option-group">
                <h4>Image Format</h4>
                <label for="imageFormat" class="input-label">Format:</label>
                <select id="imageFormat" class="select-input" aria-describedby="formatHelp">
                    <option value="png">PNG (High Quality, Larger Size)</option>
                    <option value="jpg">JPEG (Good Quality, Smaller Size)</option>
                    <option value="svg">SVG (Vector Graphics)</option>
                </select>
                <small id="formatHelp" class="help-text">PNG recommended for charts with transparency</small>
            </div>
            <div class="option-group">
                <h4>Quality Settings</h4>
                <label for="imageResolution" class="input-label">Resolution:</label>
                <select id="imageResolution" class="select-input" aria-describedby="resolutionHelp">
                    <option value="1">Standard (1x)</option>
                    <option value="2">High DPI (2x)</option>
                    <option value="3">Ultra High (3x)</option>
                </select>
                <small id="resolutionHelp" class="help-text">Higher resolution increases file size</small>
            </div>
            <div class="option-group">
                <h4>Additional Options</h4>
                <label class="checkbox-label">
                    <input type="checkbox" id="watermark">
                    <span class="checkmark"></span>
                    Add Watermark
                </label>
            </div>
        `;
    }
    
    /**
     * Build default options HTML for unknown formats
     * @returns {string} HTML string for default options
     */
    static buildDefaultOptionsHtml() {
        return `
            <div class="option-group">
                <p class="info-text">No specific options available for this export format.</p>
            </div>
        `;
    }
    
    /**
     * Build export progress HTML
     * @param {number} percentage - Progress percentage (0-100)
     * @param {string} message - Progress message
     * @returns {string} HTML string for progress display
     */
    static buildProgressHtml(percentage = 0, message = 'Preparing export...') {
        return `
            <div class="progress-container" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text" aria-live="polite">${message}</div>
            </div>
        `;
    }
    
    /**
     * Build error message HTML
     * @param {string} message - Error message to display
     * @param {boolean} allowRetry - Whether to show retry button
     * @returns {string} HTML string for error display
     */
    static buildErrorHtml(message, allowRetry = true) {
        const retryButton = allowRetry ? `
            <button type="button" class="retry-button" onclick="executeExport()" aria-label="Retry export">
                <span class="button-icon">🔄</span>
                Retry Export
            </button>
        ` : '';
        
        return `
            <div class="error-container" role="alert">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                ${retryButton}
            </div>
        `;
    }
    
    /**
     * Build success message HTML
     * @param {string} message - Success message to display
     * @param {string} filename - Name of exported file (optional)
     * @returns {string} HTML string for success display
     */
    static buildSuccessHtml(message, filename = null) {
        const filenameInfo = filename ? `
            <div class="filename-info">
                <strong>File:</strong> ${filename}
            </div>
        ` : '';
        
        return `
            <div class="success-container" role="status">
                <div class="success-icon">✅</div>
                <div class="success-message">${message}</div>
                ${filenameInfo}
            </div>
        `;
    }
    
    /**
     * Build export modal HTML structure
     * @returns {string} Complete modal HTML
     */
    static buildExportModalHtml() {
        return `
            <div id="exportModal" class="modal-overlay" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 id="modalTitle">Export Analytics Data</h2>
                        <button type="button" class="close-button" onclick="hideExportModal()" aria-label="Close dialog">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="format-selection">
                            <h3>Select Export Format</h3>
                            <div class="format-options">
                                ${DataExportUIBuilders.buildFormatOptionButtons()}
                            </div>
                        </div>
                        
                        <div id="exportOptions" class="export-options" style="display: none;">
                            <h3>Export Options</h3>
                            <div id="exportOptionsContent"></div>
                        </div>
                        
                        <div id="exportProgress" class="export-progress" style="display: none;">
                            <div id="progressContent">
                                ${DataExportUIBuilders.buildProgressHtml()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="secondary-button" onclick="hideExportModal()">
                            Cancel
                        </button>
                        <button type="button" id="exportButton" class="primary-button" onclick="executeExport()" disabled>
                            <span class="button-icon">📁</span>
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Build format option buttons HTML
     * @returns {string} HTML string for format selection buttons
     */
    static buildFormatOptionButtons() {
        const formats = [
            { value: 'pdf', label: 'PDF Report', icon: '📄', description: 'Comprehensive report with charts' },
            { value: 'csv', label: 'CSV Data', icon: '📊', description: 'Spreadsheet-compatible data' },
            { value: 'json', label: 'JSON Data', icon: '📋', description: 'Structured data format' },
            { value: 'images', label: 'Chart Images', icon: '🖼️', description: 'Export charts as images' }
        ];
        
        return formats.map(format => `
            <button 
                type="button" 
                class="format-option" 
                data-format="${format.value}"
                onclick="selectExportFormat('${format.value}')"
                aria-describedby="${format.value}-desc"
            >
                <div class="format-icon">${format.icon}</div>
                <div class="format-label">${format.label}</div>
                <div class="format-description" id="${format.value}-desc">${format.description}</div>
            </button>
        `).join('');
    }
    
    /**
     * Build loading spinner HTML
     * @param {string} message - Loading message
     * @returns {string} HTML string for loading spinner
     */
    static buildLoadingSpinnerHtml(message = 'Loading...') {
        return `
            <div class="loading-container">
                <div class="loading-spinner" aria-hidden="true">
                    <div class="spinner-circle"></div>
                </div>
                <div class="loading-message" aria-live="polite">${message}</div>
            </div>
        `;
    }
    
    /**
     * Build validation message HTML
     * @param {string} message - Validation message
     * @param {string} type - Message type ('error', 'warning', 'info')
     * @returns {string} HTML string for validation message
     */
    static buildValidationMessageHtml(message, type = 'error') {
        const icons = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const icon = icons[type] || icons.info;
        const role = type === 'error' ? 'alert' : 'status';
        
        return `
            <div class="validation-message validation-${type}" role="${role}">
                <span class="validation-icon" aria-hidden="true">${icon}</span>
                <span class="validation-text">${message}</span>
            </div>
        `;
    }
    
    /**
     * Build export summary HTML for confirmation
     * @param {object} options - Export configuration options
     * @returns {string} HTML string for export summary
     */
    static buildExportSummaryHtml(options) {
        const formatLabels = {
            pdf: 'PDF Report',
            csv: 'CSV Data',
            json: 'JSON Data',
            images: 'Chart Images'
        };
        
        const formatLabel = formatLabels[options.format] || options.format.toUpperCase();
        
        return `
            <div class="export-summary">
                <h4>Export Summary</h4>
                <div class="summary-item">
                    <strong>Format:</strong> ${formatLabel}
                </div>
                <div class="summary-item">
                    <strong>Estimated Size:</strong> ${DataExportUIBuilders.estimateFileSize(options)}
                </div>
                <div class="summary-item">
                    <strong>Includes:</strong> ${DataExportUIBuilders.getIncludedContent(options)}
                </div>
            </div>
        `;
    }
    
    /**
     * Estimate file size based on export options
     * @param {object} options - Export options
     * @returns {string} Estimated file size string
     */
    static estimateFileSize(options) {
        const estimates = {
            pdf: '2-5 MB',
            csv: '100-500 KB',
            json: '500 KB - 2 MB',
            images: '1-10 MB'
        };
        
        return estimates[options.format] || 'Unknown';
    }
    
    /**
     * Get included content description based on options
     * @param {object} options - Export options
     * @returns {string} Content description
     */
    static getIncludedContent(options) {
        const contentMap = {
            pdf: 'Summary, Charts, Analysis',
            csv: 'Tracks, Artists, Genres',
            json: 'Complete Analytics Data',
            images: 'All Chart Visualizations'
        };
        
        return contentMap[options.format] || 'Selected Content';
    }
    
    /**
     * Build accessibility-friendly button HTML
     * @param {string} text - Button text
     * @param {string} onclick - Click handler function name
     * @param {string} className - CSS class name
     * @param {boolean} disabled - Whether button is disabled
     * @param {string} ariaLabel - ARIA label for accessibility
     * @returns {string} HTML string for accessible button
     */
    static buildAccessibleButtonHtml(text, onclick, className = 'button', disabled = false, ariaLabel = null) {
        const disabledAttr = disabled ? 'disabled' : '';
        const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';
        
        return `
            <button 
                type="button" 
                class="${className}" 
                onclick="${onclick}" 
                ${disabledAttr} 
                ${ariaLabelAttr}
            >
                ${text}
            </button>
        `;
    }
}

// ===== MODULE EXPORTS =====

// Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExportUIBuilders;
}

// Browser environment
if (typeof window !== 'undefined') {
    window.DataExportUIBuilders = DataExportUIBuilders;
}

// ES6 module support
if (typeof exports !== 'undefined') {
    exports.DataExportUIBuilders = DataExportUIBuilders;
}