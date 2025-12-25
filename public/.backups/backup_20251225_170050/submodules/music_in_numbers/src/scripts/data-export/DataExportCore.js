// ===== DATA EXPORT CORE CLASS =====
// Orchestration functions with dependency injection for data export operations
// Part of the Data Export modular architecture following "Functional Core, Imperative Shell" pattern

/**
 * DataExportCore - Orchestration functions with dependency injection for data export operations
 * 
 * This class contains impure functions that orchestrate complex export workflows with explicit dependencies.
 * Uses "Functional Core, Imperative Shell" pattern - business logic orchestration with injected side effects.
 * 
 * All methods accept dependencies as the first parameter, enabling comprehensive testing and mocking.
 * 
 * @class DataExportCore
 */
class DataExportCore {
    
    /**
     * Core function to show export modal with dependency injection
     * @param {object} dependencies - Injected dependencies for DOM manipulation and event handling
     * @param {object} options - Modal display options
     * @returns {object} Operation result with success status
     */
    static showExportModalCore(dependencies, options = {}) {
        const { getElementById, querySelector, addEventListener, removeEventListener, logInfo } = dependencies;
        
        try {
            // Validate modal element exists
            const modal = getElementById('exportModal');
            if (!modal) {
                return { success: false, error: 'Export modal element not found' };
            }
            
            // Show modal
            modal.style.display = 'flex';
            
            // Handle body overflow for modal
            const body = querySelector('body');
            if (body) {
                body.style.overflow = 'hidden';
            }
            
            // Focus management for accessibility
            const firstFocusable = querySelector('.format-option');
            if (firstFocusable && firstFocusable.focus) {
                firstFocusable.focus();
            }
            
            // Set up ESC key handler
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    DataExportCore.hideExportModalCore(dependencies);
                }
            };
            
            // Store handler for cleanup
            if (addEventListener) {
                addEventListener('keydown', escHandler);
                // Store handler reference for cleanup
                modal.escHandler = escHandler;
            }
            
            if (logInfo) {
                logInfo('Export modal displayed successfully');
            }
            
            return { success: true, modal, escHandler };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to hide export modal with dependency injection
     * @param {object} dependencies - Injected dependencies for DOM manipulation and event handling
     * @param {object} options - Modal hide options
     * @returns {object} Operation result with success status
     */
    static hideExportModalCore(dependencies, options = {}) {
        const { getElementById, querySelector, removeEventListener, logInfo } = dependencies;
        
        try {
            const modal = getElementById('exportModal');
            if (!modal) {
                return { success: false, error: 'Export modal element not found' };
            }
            
            // Hide modal
            modal.style.display = 'none';
            
            // Restore body overflow
            const body = querySelector('body');
            if (body) {
                body.style.overflow = 'auto';
            }
            
            // Clean up event listener
            if (removeEventListener && modal.escHandler) {
                removeEventListener('keydown', modal.escHandler);
                delete modal.escHandler;
            }
            
            // Reset modal state
            const resetResult = DataExportCore.resetModalStateCore(dependencies);
            if (!resetResult.success) {
                if (logInfo) {
                    logInfo('Modal hidden but reset failed:', resetResult.error);
                }
            }
            
            if (logInfo) {
                logInfo('Export modal hidden successfully');
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to reset modal state with dependency injection
     * @param {object} dependencies - Injected dependencies for DOM manipulation
     * @returns {object} Operation result with success status
     */
    static resetModalStateCore(dependencies) {
        const { getElementById, querySelectorAll, logInfo } = dependencies;
        
        try {
            // Reset format selection
            const formatOptions = querySelectorAll('.format-option');
            if (formatOptions) {
                formatOptions.forEach(option => {
                    option.classList.remove('selected');
                });
            }
            
            // Hide export options
            const exportOptions = getElementById('exportOptions');
            if (exportOptions) {
                exportOptions.style.display = 'none';
            }
            
            // Disable export button
            const exportButton = getElementById('exportButton');
            if (exportButton) {
                exportButton.disabled = true;
            }
            
            // Hide progress
            const exportProgress = getElementById('exportProgress');
            if (exportProgress) {
                exportProgress.style.display = 'none';
            }
            
            if (logInfo) {
                logInfo('Modal state reset successfully');
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to select export format with dependency injection
     * @param {object} dependencies - Injected dependencies for DOM manipulation and UI building
     * @param {string} format - Export format to select
     * @returns {object} Operation result with success status
     */
    static selectExportFormatCore(dependencies, format) {
        const { getElementById, querySelector, querySelectorAll, DataExportValidators, DataExportUIBuilders, logInfo } = dependencies;
        
        try {
            // Validate format
            if (DataExportValidators) {
                const validation = DataExportValidators.validateExportFormat(format);
                if (!validation.isValid) {
                    return { success: false, error: validation.error };
                }
            }
            
            // Update format selection UI
            const formatOptions = querySelectorAll('.format-option');
            if (formatOptions) {
                formatOptions.forEach(option => {
                    option.classList.remove('selected');
                });
            }
            
            const selectedOption = querySelector(`[data-format="${format}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
            
            // Show format-specific options
            const optionsResult = DataExportCore.showFormatOptionsCore(dependencies, format);
            if (!optionsResult.success) {
                return optionsResult;
            }
            
            // Enable export button
            const exportButton = getElementById('exportButton');
            if (exportButton) {
                exportButton.disabled = false;
            }
            
            if (logInfo) {
                logInfo(`Export format selected: ${format}`);
            }
            
            return { success: true, format };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to show format-specific options with dependency injection
     * @param {object} dependencies - Injected dependencies for DOM manipulation and UI building
     * @param {string} format - Export format to show options for
     * @returns {object} Operation result with success status
     */
    static showFormatOptionsCore(dependencies, format) {
        const { getElementById, DataExportUIBuilders, logInfo } = dependencies;
        
        try {
            const optionsDiv = getElementById('exportOptions');
            const contentDiv = getElementById('exportOptionsContent');
            
            if (!optionsDiv || !contentDiv) {
                return { success: false, error: 'Export options containers not found' };
            }
            
            // Generate options HTML using UI builders
            let optionsHTML = '';
            if (DataExportUIBuilders) {
                optionsHTML = DataExportUIBuilders.buildFormatOptionsHtml(format);
            } else {
                // Fallback HTML generation
                optionsHTML = DataExportCore.generateFallbackOptionsHtml(format);
            }
            
            // Update content
            contentDiv.innerHTML = optionsHTML;
            optionsDiv.style.display = 'block';
            
            if (logInfo) {
                logInfo(`Format options displayed for: ${format}`);
            }
            
            return { success: true, optionsHTML };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to execute export workflow with dependency injection
     * @param {object} dependencies - Injected dependencies for export operations
     * @param {string} format - Export format to execute
     * @param {object} options - Export options
     * @returns {object} Operation result with success status
     */
    static async executeExportWorkflowCore(dependencies, format, options = {}) {
        const { 
            DataExportValidators, 
            DataExportProcessors, 
            getElementById, 
            getCurrentAnalyticsData,
            createBlob,
            downloadFile,
            updateProgress,
            showError,
            logInfo,
            logError 
        } = dependencies;
        
        try {
            // Validate format and analytics data
            if (DataExportValidators) {
                const formatValidation = DataExportValidators.validateExportFormat(format);
                if (!formatValidation.isValid) {
                    return { success: false, error: formatValidation.error };
                }
            }
            
            // Get analytics data
            const analyticsData = getCurrentAnalyticsData();
            if (DataExportValidators) {
                const dataValidation = DataExportValidators.validateAnalyticsData(analyticsData);
                if (!dataValidation.isValid) {
                    return { success: false, error: dataValidation.error };
                }
            }
            
            // Show initial progress
            if (updateProgress) {
                updateProgress(5, 'Initializing export...');
            }
            
            // Execute format-specific export
            let exportResult;
            switch (format.toLowerCase()) {
                case 'pdf':
                    exportResult = await DataExportCore.executePdfExportCore(dependencies, analyticsData, options);
                    break;
                case 'csv':
                    exportResult = await DataExportCore.executeCsvExportCore(dependencies, analyticsData, options);
                    break;
                case 'json':
                    exportResult = await DataExportCore.executeJsonExportCore(dependencies, analyticsData, options);
                    break;
                case 'images':
                    exportResult = await DataExportCore.executeImageExportCore(dependencies, analyticsData, options);
                    break;
                default:
                    return { success: false, error: `Unsupported export format: ${format}` };
            }
            
            if (!exportResult.success) {
                if (showError) {
                    showError(exportResult.error);
                }
                return exportResult;
            }
            
            // Final progress update
            if (updateProgress) {
                updateProgress(100, `${format.toUpperCase()} export completed!`);
            }
            
            if (logInfo) {
                logInfo(`Export completed successfully: ${format}`, exportResult);
            }
            
            return exportResult;
        } catch (error) {
            const errorMessage = `Export failed: ${error.message}`;
            if (logError) {
                logError(errorMessage, error);
            }
            if (showError) {
                showError(errorMessage);
            }
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Core function to execute PDF export with dependency injection
     * @param {object} dependencies - Injected dependencies for PDF generation
     * @param {object} analyticsData - Analytics data to export
     * @param {object} options - PDF export options
     * @returns {object} Operation result with success status
     */
    static async executePdfExportCore(dependencies, analyticsData, options = {}) {
        const { 
            jsPDF, 
            DataExportProcessors, 
            getElementById, 
            updateProgress, 
            downloadFile, 
            logInfo 
        } = dependencies;
        
        try {
            if (updateProgress) {
                updateProgress(10, 'Initializing PDF generator...');
            }
            
            if (!jsPDF) {
                return { success: false, error: 'PDF library not available' };
            }
            
            // Extract PDF options from DOM
            const pdfOptions = DataExportCore.extractPdfOptionsFromDom(dependencies);
            const mergedOptions = { ...pdfOptions, ...options };
            
            if (updateProgress) {
                updateProgress(20, 'Generating PDF content...');
            }
            
            // Generate PDF structure using processors
            let pdfStructure;
            if (DataExportProcessors) {
                pdfStructure = DataExportProcessors.generatePdfContentStructure(analyticsData, mergedOptions);
            } else {
                return { success: false, error: 'PDF processors not available' };
            }
            
            if (updateProgress) {
                updateProgress(40, 'Creating PDF document...');
            }
            
            // Create PDF document
            const doc = new jsPDF();
            const buildResult = await DataExportCore.buildPdfDocumentCore(dependencies, doc, pdfStructure);
            if (!buildResult.success) {
                return buildResult;
            }
            
            if (updateProgress) {
                updateProgress(90, 'Saving PDF file...');
            }
            
            // Generate filename and save
            const filename = DataExportProcessors ? 
                DataExportProcessors.generateSafeFilename(mergedOptions.title || 'music_analytics', 'pdf') :
                `music_analytics_${Date.now()}.pdf`;
            
            if (downloadFile) {
                const downloadResult = downloadFile(doc, filename, 'pdf');
                if (!downloadResult.success) {
                    return downloadResult;
                }
            } else {
                doc.save(filename);
            }
            
            if (logInfo) {
                logInfo(`PDF export completed: ${filename}`);
            }
            
            return { success: true, filename, format: 'pdf' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to execute CSV export with dependency injection
     * @param {object} dependencies - Injected dependencies for CSV generation
     * @param {object} analyticsData - Analytics data to export
     * @param {object} options - CSV export options
     * @returns {object} Operation result with success status
     */
    static async executeCsvExportCore(dependencies, analyticsData, options = {}) {
        const { 
            DataExportProcessors, 
            getElementById, 
            updateProgress, 
            createBlob, 
            downloadFile, 
            logInfo 
        } = dependencies;
        
        try {
            if (updateProgress) {
                updateProgress(10, 'Preparing CSV data...');
            }
            
            // Extract CSV options from DOM
            const csvOptions = DataExportCore.extractCsvOptionsFromDom(dependencies);
            const mergedOptions = { ...csvOptions, ...options };
            
            if (updateProgress) {
                updateProgress(30, 'Generating CSV content...');
            }
            
            // Generate CSV content using processors
            let csvContent;
            if (DataExportProcessors) {
                csvContent = DataExportProcessors.generateCsvContent(analyticsData, mergedOptions);
            } else {
                return { success: false, error: 'CSV processors not available' };
            }
            
            if (updateProgress) {
                updateProgress(70, 'Creating CSV file...');
            }
            
            // Create blob and download
            const filename = DataExportProcessors ?
                DataExportProcessors.generateSafeFilename('music_analytics', 'csv') :
                `music_analytics_${Date.now()}.csv`;
            
            if (createBlob && downloadFile) {
                const blob = createBlob(csvContent, 'text/csv;charset=utf-8;');
                const downloadResult = downloadFile(blob, filename, 'csv');
                if (!downloadResult.success) {
                    return downloadResult;
                }
            } else {
                // Fallback download method
                DataExportCore.fallbackDownload(csvContent, filename, 'text/csv;charset=utf-8;');
            }
            
            if (logInfo) {
                logInfo(`CSV export completed: ${filename}`);
            }
            
            return { success: true, filename, format: 'csv' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to execute JSON export with dependency injection
     * @param {object} dependencies - Injected dependencies for JSON generation
     * @param {object} analyticsData - Analytics data to export
     * @param {object} options - JSON export options
     * @returns {object} Operation result with success status
     */
    static async executeJsonExportCore(dependencies, analyticsData, options = {}) {
        const { 
            DataExportProcessors, 
            getElementById, 
            updateProgress, 
            createBlob, 
            downloadFile, 
            logInfo 
        } = dependencies;
        
        try {
            if (updateProgress) {
                updateProgress(20, 'Preparing JSON data...');
            }
            
            // Extract JSON options from DOM
            const jsonOptions = DataExportCore.extractJsonOptionsFromDom(dependencies);
            const mergedOptions = { ...jsonOptions, ...options };
            
            if (updateProgress) {
                updateProgress(50, 'Serializing data...');
            }
            
            // Generate JSON content using processors
            let jsonContent;
            if (DataExportProcessors) {
                jsonContent = DataExportProcessors.generateJsonContent(analyticsData, mergedOptions);
            } else {
                return { success: false, error: 'JSON processors not available' };
            }
            
            if (updateProgress) {
                updateProgress(80, 'Creating JSON file...');
            }
            
            // Create blob and download
            const filename = DataExportProcessors ?
                DataExportProcessors.generateSafeFilename('music_analytics', 'json') :
                `music_analytics_${Date.now()}.json`;
            
            if (createBlob && downloadFile) {
                const blob = createBlob(jsonContent, 'application/json;charset=utf-8;');
                const downloadResult = downloadFile(blob, filename, 'json');
                if (!downloadResult.success) {
                    return downloadResult;
                }
            } else {
                // Fallback download method
                DataExportCore.fallbackDownload(jsonContent, filename, 'application/json;charset=utf-8;');
            }
            
            if (logInfo) {
                logInfo(`JSON export completed: ${filename}`);
            }
            
            return { success: true, filename, format: 'json' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Core function to execute image export with dependency injection
     * @param {object} dependencies - Injected dependencies for image processing
     * @param {object} analyticsData - Analytics data (not used for images)
     * @param {object} options - Image export options
     * @returns {object} Operation result with success status
     */
    static async executeImageExportCore(dependencies, analyticsData, options = {}) {
        const { 
            DataExportProcessors, 
            getElementById, 
            querySelectorAll, 
            updateProgress, 
            JSZip, 
            createBlob, 
            downloadFile, 
            logInfo 
        } = dependencies;
        
        try {
            if (updateProgress) {
                updateProgress(10, 'Locating charts...');
            }
            
            // Find canvas elements
            const canvases = querySelectorAll('canvas');
            if (!canvases || canvases.length === 0) {
                return { success: false, error: 'No charts found to export' };
            }
            
            // Extract image options from DOM
            const imageOptions = DataExportCore.extractImageOptionsFromDom(dependencies);
            const mergedOptions = { ...imageOptions, ...options };
            
            if (updateProgress) {
                updateProgress(30, 'Processing charts...');
            }
            
            // Process canvas elements
            if (!JSZip) {
                return { success: false, error: 'ZIP library not available' };
            }
            
            const zip = new JSZip();
            const processResult = await DataExportCore.processCanvasesToZipCore(
                dependencies, 
                zip, 
                canvases, 
                mergedOptions
            );
            
            if (!processResult.success) {
                return processResult;
            }
            
            if (updateProgress) {
                updateProgress(90, 'Creating ZIP archive...');
            }
            
            // Generate ZIP file
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const filename = `music_charts_${Date.now()}.zip`;
            
            if (downloadFile) {
                const downloadResult = downloadFile(zipBlob, filename, 'zip');
                if (!downloadResult.success) {
                    return downloadResult;
                }
            } else {
                DataExportCore.fallbackDownload(zipBlob, filename, 'application/zip');
            }
            
            if (logInfo) {
                logInfo(`Image export completed: ${filename}`);
            }
            
            return { success: true, filename, format: 'images', chartCount: canvases.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ===== HELPER METHODS =====
    
    /**
     * Extract PDF options from DOM elements
     * @param {object} dependencies - Injected dependencies
     * @returns {object} PDF options
     */
    static extractPdfOptionsFromDom(dependencies) {
        const { getElementById } = dependencies;
        
        return {
            title: getElementById('reportTitle')?.value || 'Music Analytics Report',
            includeSummary: getElementById('includeSummary')?.checked ?? true,
            includeCharts: getElementById('includeCharts')?.checked ?? true,
            includePersonality: getElementById('includePersonality')?.checked ?? true,
            includeRecommendations: getElementById('includeRecommendations')?.checked ?? true
        };
    }
    
    /**
     * Extract CSV options from DOM elements
     * @param {object} dependencies - Injected dependencies
     * @returns {object} CSV options
     */
    static extractCsvOptionsFromDom(dependencies) {
        const { getElementById } = dependencies;
        
        return {
            delimiter: getElementById('csvDelimiter')?.value || ',',
            exportTracks: getElementById('exportTracks')?.checked ?? true,
            exportArtists: getElementById('exportArtists')?.checked ?? true,
            exportGenres: getElementById('exportGenres')?.checked ?? true,
            exportListeningHistory: getElementById('exportListeningHistory')?.checked ?? true
        };
    }
    
    /**
     * Extract JSON options from DOM elements
     * @param {object} dependencies - Injected dependencies
     * @returns {object} JSON options
     */
    static extractJsonOptionsFromDom(dependencies) {
        const { getElementById } = dependencies;
        
        return {
            prettyPrint: getElementById('prettyPrint')?.checked ?? true,
            includeMetadata: getElementById('includeMetadata')?.checked ?? true,
            compressData: getElementById('compressData')?.checked ?? false
        };
    }
    
    /**
     * Extract image options from DOM elements
     * @param {object} dependencies - Injected dependencies
     * @returns {object} Image options
     */
    static extractImageOptionsFromDom(dependencies) {
        const { getElementById } = dependencies;
        
        return {
            format: getElementById('imageFormat')?.value || 'png',
            resolution: parseInt(getElementById('imageResolution')?.value) || 1,
            watermark: getElementById('watermark')?.checked ?? false
        };
    }
    
    /**
     * Build PDF document with injected dependencies
     * @param {object} dependencies - Injected dependencies
     * @param {object} doc - jsPDF document instance
     * @param {object} pdfStructure - PDF content structure
     * @returns {object} Operation result
     */
    static async buildPdfDocumentCore(dependencies, doc, pdfStructure) {
        const { updateProgress } = dependencies;
        
        try {
            // Add title page
            doc.setFontSize(24);
            doc.text(pdfStructure.title, 20, 30);
            
            doc.setFontSize(12);
            doc.text(`Generated on: ${pdfStructure.generatedDate}`, 20, 45);
            doc.text('Spotify Music Analytics Report', 20, 55);
            
            // Add sections
            let yPos = 80;
            for (const section of pdfStructure.sections) {
                if (section.type === 'title') continue; // Already added
                
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 30;
                }
                
                doc.setFontSize(16);
                doc.text(section.title, 20, yPos);
                yPos += 20;
                
                // Add section content based on type
                yPos = DataExportCore.addSectionContent(doc, section, yPos);
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Add section content to PDF document
     * @param {object} doc - jsPDF document instance
     * @param {object} section - Section data
     * @param {number} yPos - Current Y position
     * @returns {number} Updated Y position
     */
    static addSectionContent(doc, section, yPos) {
        doc.setFontSize(12);
        
        switch (section.type) {
            case 'summary':
                return DataExportCore.addSummarySection(doc, section.content, yPos);
            case 'tracks':
                return DataExportCore.addTracksSection(doc, section.content, yPos);
            case 'artists':
                return DataExportCore.addArtistsSection(doc, section.content, yPos);
            default:
                doc.text('Content section would be added here.', 20, yPos);
                return yPos + 20;
        }
    }
    
    /**
     * Add summary section to PDF
     * @param {object} doc - jsPDF document instance
     * @param {object} content - Summary content
     * @param {number} yPos - Current Y position
     * @returns {number} Updated Y position
     */
    static addSummarySection(doc, content, yPos) {
        if (content.musicPersonality) {
            doc.text(`Music Personality: ${content.musicPersonality.explorationLevel}`, 20, yPos);
            yPos += 10;
            doc.text(`Diversity Score: ${content.musicPersonality.diversityScore}`, 20, yPos);
            yPos += 10;
        }
        
        if (content.moodAnalysis) {
            doc.text(`Dominant Mood: ${content.moodAnalysis.mood}`, 20, yPos);
            yPos += 10;
        }
        
        return yPos + 10;
    }
    
    /**
     * Add tracks section to PDF
     * @param {object} doc - jsPDF document instance
     * @param {Array} tracks - Tracks data
     * @param {number} yPos - Current Y position
     * @returns {number} Updated Y position
     */
    static addTracksSection(doc, tracks, yPos) {
        tracks.slice(0, 5).forEach((track, index) => {
            doc.text(`${track.rank}. ${track.name} - ${track.artist}`, 25, yPos);
            yPos += 8;
        });
        
        return yPos + 10;
    }
    
    /**
     * Add artists section to PDF
     * @param {object} doc - jsPDF document instance
     * @param {Array} artists - Artists data
     * @param {number} yPos - Current Y position
     * @returns {number} Updated Y position
     */
    static addArtistsSection(doc, artists, yPos) {
        artists.slice(0, 5).forEach((artist, index) => {
            doc.text(`${artist.rank}. ${artist.name} (${artist.genres})`, 25, yPos);
            yPos += 8;
        });
        
        return yPos + 10;
    }
    
    /**
     * Process canvas elements to ZIP archive
     * @param {object} dependencies - Injected dependencies
     * @param {object} zip - JSZip instance
     * @param {NodeList} canvases - Canvas elements
     * @param {object} options - Image options
     * @returns {object} Operation result
     */
    static async processCanvasesToZipCore(dependencies, zip, canvases, options) {
        const { DataExportProcessors, updateProgress } = dependencies;
        
        try {
            let processedCount = 0;
            
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i];
                
                // Process canvas metadata
                const metadata = DataExportProcessors ?
                    DataExportProcessors.processCanvasMetadata(canvas, i) :
                    { filename: `chart_${i + 1}` };
                
                if (updateProgress) {
                    updateProgress(
                        30 + (60 * processedCount / canvases.length),
                        `Processing ${metadata.title || metadata.filename}...`
                    );
                }
                
                try {
                    // Convert canvas to blob
                    const imageData = await DataExportCore.canvasToBlob(canvas, options.format, options.resolution);
                    const fileName = `${metadata.filename}.${options.format}`;
                    
                    zip.file(fileName, imageData);
                    processedCount++;
                } catch (error) {
                    console.error(`Failed to export chart ${i}:`, error);
                    // Continue with other charts
                }
            }
            
            return { success: true, processedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Convert canvas to blob with Promise wrapper
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {string} format - Image format
     * @param {number} resolution - Image resolution multiplier
     * @returns {Promise<Blob>} Canvas blob data
     */
    static canvasToBlob(canvas, format, resolution) {
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
    
    /**
     * Fallback download method when specialized download function unavailable
     * @param {string|Blob} content - Content to download
     * @param {string} filename - File name
     * @param {string} mimeType - MIME type
     */
    static fallbackDownload(content, filename, mimeType) {
        const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }
    
    /**
     * Generate fallback options HTML when UI builders unavailable
     * @param {string} format - Export format
     * @returns {string} Fallback HTML
     */
    static generateFallbackOptionsHtml(format) {
        return `
            <div class="option-group">
                <p>Options for ${format.toUpperCase()} export:</p>
                <p><em>Standard options will be used.</em></p>
            </div>
        `;
    }
}

// ===== MODULE EXPORTS =====

// Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExportCore;
}

// Browser environment
if (typeof window !== 'undefined') {
    window.DataExportCore = DataExportCore;
}

// ES6 module support
if (typeof exports !== 'undefined') {
    exports.DataExportCore = DataExportCore;
}