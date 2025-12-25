// ===== ADVANCED DATA EXPORT & INTEGRATION ENGINE =====
// DELEGATION WRAPPER - Maintains backward compatibility while using modular architecture
// 
// This file now serves as a backward-compatible delegation layer that orchestrates
// the extracted modular classes while preserving all original functionality.
// 
// Uses "Functional Core, Imperative Shell" pattern with dependency injection.

// ===== MODULAR CLASS IMPORTS =====

// Load extracted classes conditionally for maximum compatibility
let DataExportValidators, DataExportProcessors, DataExportUIBuilders, DataExportCore, DataExportUtilities;

try {
    // Browser environment - classes loaded via script tags
    if (typeof window !== 'undefined') {
        DataExportValidators = window.DataExportValidators;
        DataExportProcessors = window.DataExportProcessors;
        DataExportUIBuilders = window.DataExportUIBuilders;
        DataExportCore = window.DataExportCore;
        DataExportUtilities = window.DataExportUtilities;
    }
    
    // Node.js environment - require modules
    if (typeof require !== 'undefined' && !DataExportValidators) {
        try {
            DataExportValidators = require('./data-export/DataExportValidators.js');
            DataExportProcessors = require('./data-export/DataExportProcessors.js');
            DataExportUIBuilders = require('./data-export/DataExportUIBuilders.js');
            DataExportCore = require('./data-export/DataExportCore.js');
            DataExportUtilities = require('./data-export/DataExportUtilities.js');
        } catch (requireError) {
            console.warn('Could not require data export modules:', requireError.message);
        }
    }
} catch (error) {
    console.warn('Data export modules not available, using fallback implementation:', error.message);
}

// Create dependency container
let dependencies = null;
function ensureDataExportDependencies() {
    if (!dependencies) {
        if (DataExportUtilities) {
            dependencies = DataExportUtilities.createDependencyContainer();
        } else {
            // Fallback dependency container
            dependencies = createFallbackDependencies();
        }
    }
    return dependencies;
}

// Data Export Engine for Track 4 - Now using modular architecture
class DataExportEngine {
    constructor() {
        this.selectedFormat = null;
        this.exportOptions = {};
        this.isExporting = false;
        this.progressCallback = null;
        
        // Initialize dependencies
        this.dependencies = ensureDataExportDependencies();
    }
    
    // Show export modal - Delegates to modular architecture
    showModal() {
        if (DataExportCore) {
            // Use modular implementation
            const result = DataExportCore.showExportModalCore(this.dependencies);
            if (result.success) {
                // Store ESC handler for cleanup
                this.escHandler = result.escHandler;
                return result;
            }
            // Fall back to legacy implementation if modular fails
        }
        
        // Legacy fallback implementation
        return this.showModalLegacy();
    }
    
    // Legacy implementation preserved for backward compatibility
    showModalLegacy() {
        const modal = document.getElementById('exportModal');
        if (!modal) return { success: false, error: 'Modal not found' };
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('.format-option');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // ESC key handler
        this.escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        };
        document.addEventListener('keydown', this.escHandler);
        
        return { success: true };
    }
    
    // Hide export modal - Delegates to modular architecture
    hideModal() {
        if (DataExportCore) {
            // Use modular implementation
            const result = DataExportCore.hideExportModalCore(this.dependencies);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
        }
        
        // Legacy fallback implementation
        return this.hideModalLegacy();
    }
    
    // Legacy implementation preserved for backward compatibility
    hideModalLegacy() {
        const modal = document.getElementById('exportModal');
        if (!modal) return { success: false, error: 'Modal not found' };
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clean up
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }
        
        // Reset state
        this.resetModal();
        
        return { success: true };
    }
    
    // Reset modal state - Delegates to modular architecture
    resetModal() {
        if (DataExportCore) {
            // Use modular implementation
            const result = DataExportCore.resetModalStateCore(this.dependencies);
            if (result.success) {
                this.selectedFormat = null;
                return result;
            }
            // Fall back to legacy implementation if modular fails
        }
        
        // Legacy fallback implementation
        return this.resetModalLegacy();
    }
    
    // Legacy implementation preserved for backward compatibility
    resetModalLegacy() {
        this.selectedFormat = null;
        
        document.querySelectorAll('.format-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const exportOptions = document.getElementById('exportOptions');
        if (exportOptions) exportOptions.style.display = 'none';
        
        const exportButton = document.getElementById('exportButton');
        if (exportButton) exportButton.disabled = true;
        
        const exportProgress = document.getElementById('exportProgress');
        if (exportProgress) exportProgress.style.display = 'none';
        
        return { success: true };
    }
    
    // Select export format - Delegates to modular architecture
    selectFormat(format) {
        if (DataExportCore) {
            // Use modular implementation
            const result = DataExportCore.selectExportFormatCore(this.dependencies, format);
            if (result.success) {
                this.selectedFormat = format;
                return result;
            }
            // Fall back to legacy implementation if modular fails
        }
        
        // Legacy fallback implementation
        return this.selectFormatLegacy(format);
    }
    
    // Legacy implementation preserved for backward compatibility
    selectFormatLegacy(format) {
        this.selectedFormat = format;
        
        // Update UI
        document.querySelectorAll('.format-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-format="${format}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Show format-specific options
        this.showFormatOptions(format);
        
        // Enable export button
        const exportButton = document.getElementById('exportButton');
        if (exportButton) {
            exportButton.disabled = false;
        }
        
        return { success: true, format };
    }
    
    // Show format-specific options - Delegates to modular architecture
    showFormatOptions(format) {
        if (DataExportCore) {
            // Use modular implementation
            const result = DataExportCore.showFormatOptionsCore(this.dependencies, format);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
        }
        
        // Legacy fallback implementation
        return this.showFormatOptionsLegacy(format);
    }
    
    // Legacy implementation preserved for backward compatibility
    showFormatOptionsLegacy(format) {
        const optionsDiv = document.getElementById('exportOptions');
        const contentDiv = document.getElementById('exportOptionsContent');
        
        if (!optionsDiv || !contentDiv) {
            return { success: false, error: 'Options containers not found' };
        }
        
        let optionsHTML = '';
        
        switch (format) {
            case 'pdf':
                optionsHTML = `
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="includeSummary" checked> Include Summary Statistics
                        </label>
                        <label>
                            <input type="checkbox" id="includeCharts" checked> Include Charts & Visualizations
                        </label>
                        <label>
                            <input type="checkbox" id="includePersonality" checked> Include Music Personality Analysis
                        </label>
                        <label>
                            <input type="checkbox" id="includeRecommendations" checked> Include Recommendations
                        </label>
                    </div>
                    <div class="option-group">
                        <label for="reportTitle">Report Title:</label>
                        <input type="text" id="reportTitle" value="My Music Analytics Report" 
                               style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                    </div>
                `;
                break;
            case 'csv':
                optionsHTML = `
                    <div class="option-group">
                        <label>Select data to export:</label>
                        <label>
                            <input type="checkbox" id="exportTracks" checked> Top Tracks Data
                        </label>
                        <label>
                            <input type="checkbox" id="exportArtists" checked> Top Artists Data
                        </label>
                        <label>
                            <input type="checkbox" id="exportGenres" checked> Genre Analysis
                        </label>
                        <label>
                            <input type="checkbox" id="exportListeningHistory" checked> Recent Listening History
                        </label>
                    </div>
                    <div class="option-group">
                        <label for="csvDelimiter">Delimiter:</label>
                        <select id="csvDelimiter" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value=",">Comma (,)</option>
                            <option value=";">Semicolon (;)</option>
                            <option value="\t">Tab</option>
                        </select>
                    </div>
                `;
                break;
            case 'json':
                optionsHTML = `
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="prettyPrint" checked> Pretty Print (Formatted)
                        </label>
                        <label>
                            <input type="checkbox" id="includeMetadata" checked> Include Metadata
                        </label>
                        <label>
                            <input type="checkbox" id="compressData"> Compress Data
                        </label>
                    </div>
                `;
                break;
            case 'images':
                optionsHTML = `
                    <div class="option-group">
                        <label for="imageFormat">Image Format:</label>
                        <select id="imageFormat" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value="png">PNG (High Quality)</option>
                            <option value="jpg">JPEG (Smaller Size)</option>
                            <option value="svg">SVG (Vector)</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label for="imageResolution">Resolution:</label>
                        <select id="imageResolution" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value="1">Standard (1x)</option>
                            <option value="2">High DPI (2x)</option>
                            <option value="3">Ultra High (3x)</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="watermark"> Add Watermark
                        </label>
                    </div>
                `;
                break;
        }
        
        contentDiv.innerHTML = optionsHTML;
        optionsDiv.style.display = 'block';
        
        return { success: true, optionsHTML };
    }
    
    // Execute export - Delegates to modular architecture
    async executeExport() {
        if (!this.selectedFormat || this.isExporting) return { success: false, error: 'Export already in progress or no format selected' };
        
        this.isExporting = true;
        this.showProgress();
        
        try {
            if (DataExportCore) {
                // Use modular implementation
                const result = await DataExportCore.executeExportWorkflowCore(
                    this.dependencies, 
                    this.selectedFormat, 
                    this.exportOptions
                );
                
                if (result.success) {
                    setTimeout(() => {
                        this.hideModal();
                    }, 2000);
                    return result;
                }
                
                // Fall back to legacy implementation if modular fails
                console.warn('Modular export failed, falling back to legacy:', result.error);
            }
            
            // Legacy fallback implementation
            return await this.executeExportLegacy();
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showError('Export failed. Please try again.');
            return { success: false, error: error.message };
        } finally {
            this.isExporting = false;
        }
    }
    
    // Legacy implementation preserved for backward compatibility
    async executeExportLegacy() {
        try {
            switch (this.selectedFormat) {
                case 'pdf':
                    return await this.exportPDF();
                case 'csv':
                    return await this.exportCSV();
                case 'json':
                    return await this.exportJSON();
                case 'images':
                    return await this.exportImages();
                default:
                    return { success: false, error: 'Unknown export format' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Show export progress - Enhanced with fallback support
    showProgress() {
        const exportProgress = document.getElementById('exportProgress');
        const exportButton = document.getElementById('exportButton');
        
        if (exportProgress) exportProgress.style.display = 'block';
        if (exportButton) exportButton.disabled = true;
    }
    
    // Update progress - Enhanced with validation
    updateProgress(percentage, message) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = Math.max(0, Math.min(100, percentage)) + '%';
        }
        if (progressText) {
            progressText.textContent = message || 'Processing...';
        }
    }
    
    // Show error message - Enhanced with recovery
    showError(message) {
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        
        if (progressText) {
            progressText.textContent = message || 'An error occurred';
        }
        if (progressFill) {
            progressFill.style.backgroundColor = 'var(--error-color, #ff4444)';
        }
    }
    
    // Export as PDF - Delegates to modular architecture
    async exportPDF() {
        if (DataExportCore) {
            // Use modular implementation
            const analyticsData = window.currentAnalyticsData;
            const result = await DataExportCore.executePdfExportCore(this.dependencies, analyticsData);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
            console.warn('Modular PDF export failed, falling back to legacy:', result.error);
        }
        
        // Legacy fallback implementation
        return await this.exportPDFLegacy();
    }
    
    // Legacy PDF export implementation preserved for backward compatibility
    async exportPDFLegacy() {
        try {
            this.updateProgress(10, 'Initializing PDF generator...');
            
            const { jsPDF } = window.jspdf || {};
            if (!jsPDF) {
                throw new Error('PDF library not available');
            }
            
            const doc = new jsPDF();
            
            // Get export options
            const title = document.getElementById('reportTitle')?.value || 'Music Analytics Report';
            const includeSummary = document.getElementById('includeSummary')?.checked ?? true;
            const includeCharts = document.getElementById('includeCharts')?.checked ?? true;
            
            this.updateProgress(20, 'Generating report content...');
            
            // Add title page
            doc.setFontSize(24);
            doc.text(title, 20, 30);
            
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
            doc.text('Spotify Music Analytics Report', 20, 55);
            
            this.updateProgress(40, 'Adding analytics data...');
            
            // Add summary if enabled
            if (includeSummary && window.currentAnalyticsData) {
                const data = window.currentAnalyticsData;
                let yPos = 80;
                
                doc.setFontSize(16);
                doc.text('Music Analytics Summary', 20, yPos);
                yPos += 20;
                
                doc.setFontSize(12);
                if (data.analytics) {
                    doc.text(`Music Personality: ${data.analytics.musicPersonality?.explorationLevel || 'N/A'}`, 20, yPos);
                    yPos += 10;
                    doc.text(`Diversity Score: ${data.analytics.musicPersonality?.diversityScore || 'N/A'}`, 20, yPos);
                    yPos += 10;
                    doc.text(`Dominant Mood: ${data.analytics.moodAnalysis?.mood || 'N/A'}`, 20, yPos);
                    yPos += 10;
                }
                
                if (data.topTracks && data.topTracks.length > 0) {
                    yPos += 10;
                    doc.text('Top 5 Tracks:', 20, yPos);
                    yPos += 10;
                    
                    data.topTracks.slice(0, 5).forEach((track, index) => {
                        doc.text(`${index + 1}. ${track.name} - ${track.artists[0].name}`, 25, yPos);
                        yPos += 8;
                    });
                }
            }
            
            this.updateProgress(70, 'Finalizing PDF...');
            
            // Add charts if enabled and available
            if (includeCharts) {
                // Note: In a real implementation, we would capture chart images
                // For now, we'll add a placeholder
                doc.addPage();
                doc.setFontSize(16);
                doc.text('Charts and Visualizations', 20, 30);
                doc.setFontSize(12);
                doc.text('Chart visualizations would be embedded here in the full implementation.', 20, 50);
            }
            
            this.updateProgress(90, 'Saving PDF file...');
            
            // Save the PDF
            const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
            doc.save(fileName);
            
            this.updateProgress(100, 'PDF export completed!');
            
            return { success: true, filename: fileName, format: 'pdf' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Export as CSV - Delegates to modular architecture
    async exportCSV() {
        if (DataExportCore) {
            // Use modular implementation
            const analyticsData = window.currentAnalyticsData;
            const result = await DataExportCore.executeCsvExportCore(this.dependencies, analyticsData);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
            console.warn('Modular CSV export failed, falling back to legacy:', result.error);
        }
        
        // Legacy fallback implementation
        return await this.exportCSVLegacy();
    }
    
    // Legacy CSV export implementation preserved for backward compatibility
    async exportCSVLegacy() {
        try {
            this.updateProgress(10, 'Preparing CSV data...');
            
            if (!window.currentAnalyticsData) {
                throw new Error('No analytics data available');
            }
            
            const data = window.currentAnalyticsData;
            const delimiter = document.getElementById('csvDelimiter')?.value || ',';
            const exportTracks = document.getElementById('exportTracks')?.checked ?? true;
            const exportArtists = document.getElementById('exportArtists')?.checked ?? true;
            
            this.updateProgress(30, 'Processing tracks data...');
            
            let csvContent = '';
            
            // Export tracks
            if (exportTracks && data.topTracks) {
                csvContent += 'Track Data\n';
                csvContent += `Name${delimiter}Artist${delimiter}Popularity${delimiter}Duration${delimiter}Release Date\n`;
                
                data.topTracks.forEach(track => {
                    const name = track.name.replace(/"/g, '""');
                    const artist = track.artists[0].name.replace(/"/g, '""');
                    const popularity = track.popularity || 'N/A';
                    const duration = Math.round(track.duration_ms / 1000) + 's';
                    const releaseDate = track.album?.release_date || 'N/A';
                    
                    csvContent += `"${name}"${delimiter}"${artist}"${delimiter}${popularity}${delimiter}${duration}${delimiter}${releaseDate}\n`;
                });
                csvContent += '\n';
            }
            
            this.updateProgress(60, 'Processing artists data...');
            
            // Export artists
            if (exportArtists && data.topArtists) {
                csvContent += 'Artist Data\n';
                csvContent += `Name${delimiter}Genres${delimiter}Popularity${delimiter}Followers\n`;
                
                data.topArtists.forEach(artist => {
                    const name = artist.name.replace(/"/g, '""');
                    const genres = artist.genres.join('; ').replace(/"/g, '""');
                    const popularity = artist.popularity || 'N/A';
                    const followers = artist.followers?.total || 'N/A';
                    
                    csvContent += `"${name}"${delimiter}"${genres}"${delimiter}${popularity}${delimiter}${followers}\n`;
                });
            }
            
            this.updateProgress(90, 'Saving CSV file...');
            
            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const fileName = `music_analytics_${Date.now()}.csv`;
            
            if (window.saveAs) {
                window.saveAs(blob, fileName);
            } else {
                // Fallback download method
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            this.updateProgress(100, 'CSV export completed!');
            
            return { success: true, filename: fileName, format: 'csv' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Export as JSON - Delegates to modular architecture
    async exportJSON() {
        if (DataExportCore) {
            // Use modular implementation
            const analyticsData = window.currentAnalyticsData;
            const result = await DataExportCore.executeJsonExportCore(this.dependencies, analyticsData);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
            console.warn('Modular JSON export failed, falling back to legacy:', result.error);
        }
        
        // Legacy fallback implementation
        return await this.exportJSONLegacy();
    }
    
    // Legacy JSON export implementation preserved for backward compatibility
    async exportJSONLegacy() {
        try {
            this.updateProgress(20, 'Preparing JSON data...');
            
            if (!window.currentAnalyticsData) {
                throw new Error('No analytics data available');
            }
            
            const prettyPrint = document.getElementById('prettyPrint')?.checked ?? true;
            const includeMetadata = document.getElementById('includeMetadata')?.checked ?? true;
            
            this.updateProgress(50, 'Serializing data...');
            
            let exportData = { ...window.currentAnalyticsData };
            
            // Add metadata if requested
            if (includeMetadata) {
                exportData.exportMetadata = {
                    exportDate: new Date().toISOString(),
                    exportVersion: '1.0',
                    source: 'Spotify Music Analytics',
                    format: 'JSON'
                };
            }
            
            this.updateProgress(80, 'Generating JSON file...');
            
            // Convert to JSON
            const jsonString = prettyPrint ? 
                JSON.stringify(exportData, null, 2) : 
                JSON.stringify(exportData);
            
            // Create and download JSON file
            const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
            const fileName = `music_analytics_${Date.now()}.json`;
            
            if (window.saveAs) {
                window.saveAs(blob, fileName);
            } else {
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            this.updateProgress(100, 'JSON export completed!');
            
            return { success: true, filename: fileName, format: 'json' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Export chart images - Delegates to modular architecture
    async exportImages() {
        if (DataExportCore) {
            // Use modular implementation
            const analyticsData = window.currentAnalyticsData;
            const result = await DataExportCore.executeImageExportCore(this.dependencies, analyticsData);
            if (result.success) {
                return result;
            }
            // Fall back to legacy implementation if modular fails
            console.warn('Modular image export failed, falling back to legacy:', result.error);
        }
        
        // Legacy fallback implementation
        return await this.exportImagesLegacy();
    }
    
    // Legacy image export implementation preserved for backward compatibility
    async exportImagesLegacy() {
        try {
            this.updateProgress(10, 'Locating charts...');
            
            const format = document.getElementById('imageFormat')?.value || 'png';
            const resolution = parseInt(document.getElementById('imageResolution')?.value) || 1;
            
            // Find all canvas elements (charts)
            const canvases = document.querySelectorAll('canvas');
            
            if (canvases.length === 0) {
                throw new Error('No charts found to export');
            }
            
            this.updateProgress(30, 'Preparing image export...');
            
            if (!window.JSZip) {
                throw new Error('JSZip library not available');
            }
            
            const zip = new JSZip();
            let processedCount = 0;
            
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i];
                const chartTitle = this.getChartTitle(canvas) || `chart_${i + 1}`;
                
                this.updateProgress(
                    30 + (60 * processedCount / canvases.length), 
                    `Processing ${chartTitle}...`
                );
                
                try {
                    // Convert canvas to image data
                    const imageData = await this.canvasToBlob(canvas, format, resolution);
                    const fileName = `${chartTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
                    
                    zip.file(fileName, imageData);
                    processedCount++;
                } catch (error) {
                    console.error(`Failed to export chart ${i}:`, error);
                }
            }
            
            this.updateProgress(90, 'Creating ZIP archive...');
            
            // Generate ZIP file
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const fileName = `music_charts_${Date.now()}.zip`;
            
            if (window.saveAs) {
                window.saveAs(zipBlob, fileName);
            } else {
                const link = document.createElement('a');
                const url = URL.createObjectURL(zipBlob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            this.updateProgress(100, 'Images export completed!');
            
            return { success: true, filename: fileName, format: 'images', chartCount: canvases.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Helper function to convert canvas to blob
    canvasToBlob(canvas, format, resolution) {
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert canvas to blob'));
                    }
                }, `image/${format}`, 0.9);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Helper function to get chart title
    getChartTitle(canvas) {
        // Try to find the chart title from nearby elements
        const parent = canvas.closest('.chart-container') || canvas.parentElement;
        const titleElement = parent?.querySelector('h3, h4, .chart-title');
        
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        
        // Fallback to canvas ID or class
        return canvas.id || canvas.className || 'chart';
    }
    
    // Create fallback dependencies when modular architecture is not available
    createFallbackDependencies() {
        return {
            validators: {
                validateExportFormat: (format) => ['pdf', 'csv', 'json', 'png', 'jpg', 'jpeg'].includes(format),
                validateAnalyticsData: (data) => data && typeof data === 'object' && Object.keys(data).length > 0,
                validateFilename: (filename) => filename && typeof filename === 'string' && filename.trim().length > 0
            },
            processors: {
                generateSafeFilename: (baseName) => baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
                sanitizeText: (text) => (text || '').toString().replace(/"/g, '""')
            },
            ui: {
                buildErrorHtml: (message) => `<div class="error-message">${message}</div>`
            },
            // Reference external libraries when available
            jsPDF: typeof window !== 'undefined' ? window.jsPDF : null,
            JSZip: typeof window !== 'undefined' ? window.JSZip : null,
            saveAs: typeof window !== 'undefined' ? window.saveAs : null
        };
    }
}

// Initialize export engine
window.dataExportEngine = new DataExportEngine();

// Create fallback dependencies function for global use
function createFallbackDependencies() {
    return {
        validators: {
            validateExportFormat: (format) => ['pdf', 'csv', 'json', 'png', 'jpg', 'jpeg'].includes(format),
            validateAnalyticsData: (data) => data && typeof data === 'object' && Object.keys(data).length > 0,
            validateFilename: (filename) => filename && typeof filename === 'string' && filename.trim().length > 0
        },
        processors: {
            generateSafeFilename: (baseName) => baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
            sanitizeText: (text) => (text || '').toString().replace(/"/g, '""')
        },
        ui: {
            buildErrorHtml: (message) => `<div class="error-message">${message}</div>`
        },
        // Reference external libraries when available
        jsPDF: typeof window !== 'undefined' ? window.jsPDF : null,
        JSZip: typeof window !== 'undefined' ? window.JSZip : null,
        saveAs: typeof window !== 'undefined' ? window.saveAs : null
    };
}

// Global export functions with delegation pattern
function showExportModal() {
    if (DataExportCore && window.dataExportEngine && window.dataExportEngine.dependencies) {
        // Use modular implementation
        DataExportCore.showExportModalCore(window.dataExportEngine.dependencies, window.currentAnalyticsData)
            .catch(error => {
                console.error('Modular showExportModal failed:', error);
                // Fall back to legacy
                if (window.dataExportEngine) {
                    window.dataExportEngine.showModal();
                }
            });
    } else if (window.dataExportEngine) {
        // Legacy fallback
        window.dataExportEngine.showModal();
    } else {
        console.error('DataExportEngine not initialized');
    }
}

function hideExportModal() {
    if (DataExportCore && window.dataExportEngine && window.dataExportEngine.dependencies) {
        // Use modular implementation
        try {
            DataExportCore.hideExportModalCore(window.dataExportEngine.dependencies);
        } catch (error) {
            console.error('Modular hideExportModal failed:', error);
            // Fall back to legacy
            if (window.dataExportEngine) {
                window.dataExportEngine.hideModal();
            }
        }
    } else if (window.dataExportEngine) {
        // Legacy fallback
        window.dataExportEngine.hideModal();
    } else {
        console.error('DataExportEngine not initialized');
    }
}

function selectExportFormat(format) {
    if (DataExportCore && window.dataExportEngine && window.dataExportEngine.dependencies) {
        // Use modular implementation
        try {
            DataExportCore.selectFormatCore(window.dataExportEngine.dependencies, format);
        } catch (error) {
            console.error('Modular selectExportFormat failed:', error);
            // Fall back to legacy
            if (window.dataExportEngine) {
                window.dataExportEngine.selectFormat(format);
            }
        }
    } else if (window.dataExportEngine) {
        // Legacy fallback
        window.dataExportEngine.selectFormat(format);
    } else {
        console.error('DataExportEngine not initialized');
    }
}

function executeExport() {
    if (DataExportCore && window.dataExportEngine && window.dataExportEngine.dependencies) {
        // Use modular implementation
        DataExportCore.executeExportWorkflowCore(
            window.dataExportEngine.dependencies, 
            window.dataExportEngine.selectedFormat, 
            window.dataExportEngine.exportOptions
        ).catch(error => {
            console.error('Modular executeExport failed:', error);
            // Fall back to legacy
            if (window.dataExportEngine) {
                window.dataExportEngine.executeExport();
            }
        });
    } else if (window.dataExportEngine) {
        // Legacy fallback
        window.dataExportEngine.executeExport();
    } else {
        console.error('DataExportEngine not initialized');
    }
}