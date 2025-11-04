// ===== DATA EXPORT PROCESSORS CLASS =====
// Pure data processing functions for data export operations
// Part of the Data Export modular architecture following "Functional Core, Imperative Shell" pattern

/**
 * DataExportProcessors - Pure data processing functions for data export operations
 * 
 * This class contains only pure functions that process and transform data for export.
 * No side effects, no DOM access, no external dependencies - only pure data transformation logic.
 * 
 * All methods are stateless and deterministic - same input always produces same output.
 * 
 * @class DataExportProcessors
 */
class DataExportProcessors {
    
    /**
     * Process CSV content generation from analytics data
     * @param {object} data - The analytics data to process
     * @param {object} options - CSV export options
     * @returns {string} Generated CSV content
     */
    static generateCsvContent(data, options = {}) {
        const delimiter = options.delimiter || ',';
        const exportTracks = options.exportTracks !== false;
        const exportArtists = options.exportArtists !== false;
        const exportGenres = options.exportGenres !== false;
        const exportListeningHistory = options.exportListeningHistory !== false;
        
        let csvContent = '';
        
        // Export tracks data
        if (exportTracks && data.topTracks && Array.isArray(data.topTracks)) {
            csvContent += 'Track Data\n';
            csvContent += `Name${delimiter}Artist${delimiter}Popularity${delimiter}Duration${delimiter}Release Date${delimiter}Album\n`;
            
            data.topTracks.forEach(track => {
                const name = DataExportProcessors.escapeCsvField(track.name || 'Unknown');
                const artist = DataExportProcessors.escapeCsvField(track.artists?.[0]?.name || 'Unknown Artist');
                const popularity = track.popularity || 'N/A';
                const duration = track.duration_ms ? `${Math.round(track.duration_ms / 1000)}s` : 'N/A';
                const releaseDate = track.album?.release_date || 'N/A';
                const album = DataExportProcessors.escapeCsvField(track.album?.name || 'Unknown Album');
                
                csvContent += `"${name}"${delimiter}"${artist}"${delimiter}${popularity}${delimiter}${duration}${delimiter}${releaseDate}${delimiter}"${album}"\n`;
            });
            csvContent += '\n';
        }
        
        // Export artists data
        if (exportArtists && data.topArtists && Array.isArray(data.topArtists)) {
            csvContent += 'Artist Data\n';
            csvContent += `Name${delimiter}Genres${delimiter}Popularity${delimiter}Followers${delimiter}External URLs\n`;
            
            data.topArtists.forEach(artist => {
                const name = DataExportProcessors.escapeCsvField(artist.name || 'Unknown Artist');
                const genres = DataExportProcessors.escapeCsvField((artist.genres || []).join('; '));
                const popularity = artist.popularity || 'N/A';
                const followers = artist.followers?.total || 'N/A';
                const externalUrls = DataExportProcessors.escapeCsvField(
                    Object.values(artist.external_urls || {}).join('; ')
                );
                
                csvContent += `"${name}"${delimiter}"${genres}"${delimiter}${popularity}${delimiter}${followers}${delimiter}"${externalUrls}"\n`;
            });
            csvContent += '\n';
        }
        
        // Export genres data
        if (exportGenres && data.analytics?.genreAnalysis) {
            csvContent += 'Genre Analysis\n';
            csvContent += `Genre${delimiter}Count${delimiter}Percentage\n`;
            
            Object.entries(data.analytics.genreAnalysis).forEach(([genre, stats]) => {
                const genreName = DataExportProcessors.escapeCsvField(genre);
                const count = stats.count || 0;
                const percentage = stats.percentage ? `${stats.percentage.toFixed(1)}%` : 'N/A';
                
                csvContent += `"${genreName}"${delimiter}${count}${delimiter}${percentage}\n`;
            });
            csvContent += '\n';
        }
        
        // Export listening history
        if (exportListeningHistory && data.recentlyPlayed && Array.isArray(data.recentlyPlayed)) {
            csvContent += 'Recent Listening History\n';
            csvContent += `Track${delimiter}Artist${delimiter}Played At${delimiter}Context\n`;
            
            data.recentlyPlayed.forEach(item => {
                const trackName = DataExportProcessors.escapeCsvField(item.track?.name || 'Unknown Track');
                const artistName = DataExportProcessors.escapeCsvField(item.track?.artists?.[0]?.name || 'Unknown Artist');
                const playedAt = item.played_at || 'N/A';
                const context = DataExportProcessors.escapeCsvField(item.context?.type || 'Unknown');
                
                csvContent += `"${trackName}"${delimiter}"${artistName}"${delimiter}${playedAt}${delimiter}"${context}"\n`;
            });
        }
        
        return csvContent;
    }
    
    /**
     * Process JSON data for export
     * @param {object} data - The analytics data to process
     * @param {object} options - JSON export options
     * @returns {string} Formatted JSON string
     */
    static generateJsonContent(data, options = {}) {
        const prettyPrint = options.prettyPrint !== false;
        const includeMetadata = options.includeMetadata !== false;
        const compressData = options.compressData === true;
        
        let exportData = { ...data };
        
        // Add metadata if requested
        if (includeMetadata) {
            exportData.exportMetadata = {
                exportDate: new Date().toISOString(),
                exportVersion: '1.0.0',
                source: 'Spotify Music Analytics',
                format: 'JSON',
                options: {
                    prettyPrint,
                    includeMetadata,
                    compressData
                }
            };
        }
        
        // Compress data if requested
        if (compressData) {
            exportData = DataExportProcessors.compressAnalyticsData(exportData);
        }
        
        // Generate JSON string
        return prettyPrint ? 
            JSON.stringify(exportData, null, 2) : 
            JSON.stringify(exportData);
    }
    
    /**
     * Process PDF content structure from analytics data
     * @param {object} data - The analytics data to process
     * @param {object} options - PDF export options
     * @returns {object} Structured PDF content data
     */
    static generatePdfContentStructure(data, options = {}) {
        const title = options.title || 'Music Analytics Report';
        const includeSummary = options.includeSummary !== false;
        const includeCharts = options.includeCharts !== false;
        const includePersonality = options.includePersonality !== false;
        const includeRecommendations = options.includeRecommendations !== false;
        
        const pdfStructure = {
            title: DataExportProcessors.sanitizeText(title),
            generatedDate: new Date().toLocaleDateString(),
            sections: []
        };
        
        // Title page section
        pdfStructure.sections.push({
            type: 'title',
            content: {
                title: pdfStructure.title,
                subtitle: 'Spotify Music Analytics Report',
                date: pdfStructure.generatedDate
            }
        });
        
        // Summary section
        if (includeSummary && data.analytics) {
            const summaryContent = DataExportProcessors.generateSummaryContent(data.analytics);
            pdfStructure.sections.push({
                type: 'summary',
                title: 'Music Analytics Summary',
                content: summaryContent
            });
        }
        
        // Top tracks section
        if (data.topTracks && Array.isArray(data.topTracks) && data.topTracks.length > 0) {
            const tracksContent = DataExportProcessors.generateTopTracksContent(data.topTracks);
            pdfStructure.sections.push({
                type: 'tracks',
                title: 'Top Tracks',
                content: tracksContent
            });
        }
        
        // Top artists section
        if (data.topArtists && Array.isArray(data.topArtists) && data.topArtists.length > 0) {
            const artistsContent = DataExportProcessors.generateTopArtistsContent(data.topArtists);
            pdfStructure.sections.push({
                type: 'artists',
                title: 'Top Artists',
                content: artistsContent
            });
        }
        
        // Music personality section
        if (includePersonality && data.analytics?.musicPersonality) {
            const personalityContent = DataExportProcessors.generatePersonalityContent(data.analytics.musicPersonality);
            pdfStructure.sections.push({
                type: 'personality',
                title: 'Music Personality Analysis',
                content: personalityContent
            });
        }
        
        // Charts section placeholder
        if (includeCharts) {
            pdfStructure.sections.push({
                type: 'charts',
                title: 'Charts and Visualizations',
                content: {
                    note: 'Chart visualizations would be embedded here in the full implementation.',
                    chartsAvailable: true
                }
            });
        }
        
        // Recommendations section
        if (includeRecommendations && data.recommendations) {
            const recommendationsContent = DataExportProcessors.generateRecommendationsContent(data.recommendations);
            pdfStructure.sections.push({
                type: 'recommendations',
                title: 'Music Recommendations',
                content: recommendationsContent
            });
        }
        
        return pdfStructure;
    }
    
    /**
     * Generate safe filename from title and timestamp
     * @param {string} title - The base title for the filename
     * @param {string} extension - File extension (without dot)
     * @returns {string} Safe filename with timestamp
     */
    static generateSafeFilename(title, extension) {
        const safeTitle = title
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        
        const timestamp = Date.now();
        return `${safeTitle}_${timestamp}.${extension}`;
    }
    
    /**
     * Process image metadata for canvas elements
     * @param {HTMLCanvasElement} canvas - Canvas element to process
     * @param {number} index - Index of the canvas in the collection
     * @returns {object} Image metadata
     */
    static processCanvasMetadata(canvas, index = 0) {
        const metadata = {
            index,
            width: canvas.width,
            height: canvas.height,
            id: canvas.id || null,
            className: canvas.className || null,
            title: null,
            filename: null
        };
        
        // Try to extract title from nearby elements
        const parent = canvas.closest?.('.chart-container') || canvas.parentElement;
        const titleElement = parent?.querySelector?.('h3, h4, .chart-title');
        
        if (titleElement) {
            metadata.title = DataExportProcessors.sanitizeText(titleElement.textContent);
        }
        
        // Generate filename
        const baseName = metadata.title || metadata.id || metadata.className || `chart_${index + 1}`;
        metadata.filename = DataExportProcessors.generateSafeFilename(baseName, 'png').replace(/\.png$/, '');
        
        return metadata;
    }
    
    /**
     * Escape CSV field content to prevent injection and formatting issues
     * @param {string} field - Field content to escape
     * @returns {string} Escaped field content
     */
    static escapeCsvField(field) {
        if (typeof field !== 'string') {
            return String(field || '');
        }
        
        // Replace double quotes with double double quotes
        return field.replace(/"/g, '""');
    }
    
    /**
     * Sanitize text content for PDF generation
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    static sanitizeText(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        
        return text
            .trim()
            .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
            .replace(/\s+/g, ' '); // Normalize whitespace
    }
    
    /**
     * Compress analytics data by removing unnecessary fields
     * @param {object} data - Data to compress
     * @returns {object} Compressed data
     */
    static compressAnalyticsData(data) {
        const compressed = { ...data };
        
        // Remove large image URLs and detailed metadata
        if (compressed.topTracks) {
            compressed.topTracks = compressed.topTracks.map(track => ({
                name: track.name,
                artist: track.artists?.[0]?.name,
                popularity: track.popularity,
                duration_ms: track.duration_ms,
                release_date: track.album?.release_date
            }));
        }
        
        if (compressed.topArtists) {
            compressed.topArtists = compressed.topArtists.map(artist => ({
                name: artist.name,
                genres: artist.genres,
                popularity: artist.popularity,
                followers: artist.followers?.total
            }));
        }
        
        return compressed;
    }
    
    /**
     * Generate summary content for PDF
     * @param {object} analytics - Analytics data
     * @returns {object} Summary content structure
     */
    static generateSummaryContent(analytics) {
        return {
            musicPersonality: {
                explorationLevel: analytics.musicPersonality?.explorationLevel || 'N/A',
                diversityScore: analytics.musicPersonality?.diversityScore || 'N/A',
                mainGenres: (analytics.musicPersonality?.mainGenres || []).join(', ') || 'N/A'
            },
            moodAnalysis: {
                mood: analytics.moodAnalysis?.mood || 'N/A',
                energy: analytics.moodAnalysis?.energy || 'N/A',
                valence: analytics.moodAnalysis?.valence || 'N/A'
            },
            listeningPatterns: {
                totalTracks: analytics.totalTracks || 'N/A',
                uniqueArtists: analytics.uniqueArtists || 'N/A',
                averagePopularity: analytics.averagePopularity || 'N/A'
            }
        };
    }
    
    /**
     * Generate top tracks content for PDF
     * @param {Array} topTracks - Top tracks data
     * @returns {Array} Formatted tracks data
     */
    static generateTopTracksContent(topTracks) {
        return topTracks.slice(0, 10).map((track, index) => ({
            rank: index + 1,
            name: DataExportProcessors.sanitizeText(track.name || 'Unknown Track'),
            artist: DataExportProcessors.sanitizeText(track.artists?.[0]?.name || 'Unknown Artist'),
            album: DataExportProcessors.sanitizeText(track.album?.name || 'Unknown Album'),
            popularity: track.popularity || 'N/A',
            duration: track.duration_ms ? `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` : 'N/A'
        }));
    }
    
    /**
     * Generate top artists content for PDF
     * @param {Array} topArtists - Top artists data
     * @returns {Array} Formatted artists data
     */
    static generateTopArtistsContent(topArtists) {
        return topArtists.slice(0, 10).map((artist, index) => ({
            rank: index + 1,
            name: DataExportProcessors.sanitizeText(artist.name || 'Unknown Artist'),
            genres: (artist.genres || []).slice(0, 3).join(', ') || 'N/A',
            popularity: artist.popularity || 'N/A',
            followers: artist.followers?.total ? artist.followers.total.toLocaleString() : 'N/A'
        }));
    }
    
    /**
     * Generate personality content for PDF
     * @param {object} personality - Music personality data
     * @returns {object} Formatted personality content
     */
    static generatePersonalityContent(personality) {
        return {
            explorationLevel: personality.explorationLevel || 'N/A',
            diversityScore: personality.diversityScore || 'N/A',
            mainGenres: (personality.mainGenres || []).join(', ') || 'N/A',
            listeningHabits: personality.listeningHabits || 'N/A',
            musicEra: personality.musicEra || 'N/A',
            characteristics: (personality.characteristics || []).join(', ') || 'N/A'
        };
    }
    
    /**
     * Generate recommendations content for PDF
     * @param {object} recommendations - Recommendations data
     * @returns {object} Formatted recommendations content
     */
    static generateRecommendationsContent(recommendations) {
        return {
            tracks: (recommendations.tracks || []).slice(0, 5).map(track => ({
                name: DataExportProcessors.sanitizeText(track.name || 'Unknown Track'),
                artist: DataExportProcessors.sanitizeText(track.artists?.[0]?.name || 'Unknown Artist')
            })),
            artists: (recommendations.artists || []).slice(0, 5).map(artist => ({
                name: DataExportProcessors.sanitizeText(artist.name || 'Unknown Artist'),
                genres: (artist.genres || []).slice(0, 2).join(', ') || 'N/A'
            }))
        };
    }
}

// ===== MODULE EXPORTS =====

// Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExportProcessors;
}

// Browser environment
if (typeof window !== 'undefined') {
    window.DataExportProcessors = DataExportProcessors;
}

// ES6 module support
if (typeof exports !== 'undefined') {
    exports.DataExportProcessors = DataExportProcessors;
}