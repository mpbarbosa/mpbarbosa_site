/**
 * UtilsProcessors - Pure data processing functions for utilities
 * Part of the Music in Numbers modular architecture
 * 
 * This class contains pure functions for data transformation, export data creation,
 * and report generation. All functions are deterministic and have no side effects.
 * 
 * All methods are static and pure (no side effects).
 */
class UtilsProcessors {
    /**
     * Generate code challenge from verifier using SHA-256
     * @param {string} verifier - The code verifier string
     * @returns {Promise<string>} Base64URL-encoded code challenge
     */
    static async generateCodeChallenge(verifier) {
        // Validate input
        const validation = UtilsValidators?.validateCodeVerifier?.(verifier);
        if (validation && !validation.isValid) {
            throw new Error(validation.error);
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        
        return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    /**
     * Create basic export data structure
     * @param {Object} options - Export options
     * @param {string} options.userName - User name
     * @param {string} options.timeRange - Time range for analytics
     * @returns {Object} Basic export data structure
     */
    static createBasicExportData(options = {}) {
        const { userName = 'Unknown User', timeRange = 'medium_term' } = options;

        return {
            timestamp: new Date().toISOString(),
            user: userName,
            timeRange: timeRange,
            note: 'This is a demo export. In a full implementation, this would contain the actual analytics data.'
        };
    }

    /**
     * Create advanced export data structure
     * @param {Object} options - Export options
     * @param {string} options.userName - User name
     * @param {string} options.userCountry - User country
     * @param {string} options.timeRange - Time range for analytics
     * @param {Object} options.analyticsData - Analytics data to include
     * @returns {Object} Advanced export data structure
     */
    static createAdvancedExportData(options = {}) {
        const { 
            userName = 'Unknown User', 
            userCountry = 'Unknown', 
            timeRange = 'medium_term',
            analyticsData = {}
        } = options;

        return {
            timestamp: new Date().toISOString(),
            user: {
                name: userName,
                country: userCountry
            },
            analytics: analyticsData,
            metadata: {
                exportVersion: '3.0',
                source: 'Music in Numbers - Advanced Analytics',
                timeRange: timeRange
            }
        };
    }

    /**
     * Generate comprehensive insight report text
     * @param {Object} analyticsData - Analytics data containing insights
     * @returns {string} Formatted insight report
     */
    static generateInsightReportText(analyticsData) {
        if (!analyticsData?.analytics) {
            return '# Music Listening Report\n\nNo analytics data available for report generation.';
        }

        const analytics = analyticsData.analytics;
        const reportDate = new Date().toLocaleDateString();

        return `
# Your Music Listening Report
Generated on ${reportDate}

## 🎭 Music Personality Profile
- **Listener Type**: ${analytics.musicPersonality?.explorationLevel || 'Unknown'}
- **Diversity Level**: ${analytics.musicPersonality?.diversityScore || 'Unknown'}
- **Listening Pattern**: ${analytics.musicPersonality?.consistencyPattern || 'Unknown'}
- **Social Tendency**: ${analytics.musicPersonality?.socialListener || 'Unknown'}
- **Preferred Time**: ${analytics.musicPersonality?.preferredListeningTime || 'Unknown'}

## 🧠 Mood Analysis
- **Current Mood**: ${analytics.moodAnalysis?.mood || 'Unknown'}
- **Happiness Level**: ${Math.round(analytics.moodAnalysis?.happiness || 0)}%
- **Energy Level**: ${Math.round(analytics.moodAnalysis?.energy || 0)}%
- **Danceability**: ${Math.round(analytics.moodAnalysis?.danceability || 0)}%
- **Acoustic Preference**: ${Math.round(analytics.moodAnalysis?.acousticness || 0)}%

## 📊 Listening Statistics
- **Total Tracks Analyzed**: ${analytics.totalTracks || 0}
- **Unique Artists**: ${analytics.uniqueArtists || 0}
- **Total Listening Time**: ${analytics.totalListeningTime || 0} minutes
- **Average Track Length**: ${this.formatTrackDuration(analytics.averageTrackLength || 0)}
- **Skip Rate**: ${analytics.listeningPatterns?.skipRate || 0}%
- **Repeat Rate**: ${analytics.listeningPatterns?.repeatRate || 0}%

## 🕐 Time Patterns
- **Peak Listening Hours**: ${analytics.listeningPatterns?.peakHours?.join(' and ') || 'Unknown'}
- **Favorite Day**: ${analytics.listeningPatterns?.weekdayPreference || 'Unknown'}
- **Average Session Length**: ${analytics.listeningPatterns?.sessionLength || 0} tracks

## 📈 Trends
- **Listening Trend**: ${analytics.trendAnalysis?.trend || 'Unknown'}
- **Daily Average**: ${Math.round(analytics.trendAnalysis?.dailyAverage || 0)} tracks
- **Most Active Day**: ${analytics.trendAnalysis?.peakDay ? new Date(analytics.trendAnalysis.peakDay[0]).toLocaleDateString() : 'Unknown'}

## 🎪 Top Genres
${analytics.topGenres ? analytics.topGenres.slice(0, 5).map((genre, i) => `${i + 1}. ${genre.genre} (${genre.count} tracks)`).join('\n') : 'No genre data available'}

---
Generated by Music in Numbers - Advanced Analytics Engine
        `.trim();
    }

    /**
     * Format track duration from seconds to MM:SS format
     * @param {number} durationSeconds - Duration in seconds
     * @returns {string} Formatted duration string
     */
    static formatTrackDuration(durationSeconds) {
        if (typeof durationSeconds !== 'number' || durationSeconds < 0) {
            return '0:00';
        }

        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Generate file name with timestamp
     * @param {string} baseName - Base name for the file
     * @param {string} extension - File extension (without dot)
     * @param {Date} date - Date to use for timestamp (defaults to now)
     * @returns {string} Generated file name
     */
    static generateTimestampedFileName(baseName, extension, date = new Date()) {
        const dateStr = date.toISOString().split('T')[0];
        return `${baseName}-${dateStr}.${extension}`;
    }

    /**
     * Process canvas data for sharing
     * @param {Object} options - Canvas options
     * @param {number} options.width - Canvas width
     * @param {number} options.height - Canvas height
     * @param {string} options.userName - User name to display
     * @returns {Object} Canvas configuration data  
     */
    static processCanvasData(options = {}) {
        const { width = 600, height = 400, userName = 'Unknown User' } = options;

        return {
            dimensions: { width, height },
            content: {
                title: 'My Spotify Stats',
                userName: `User: ${userName}`,
                footer: 'Generated by Music in Numbers'
            },
            styling: {
                backgroundColor: '#1DB954',
                textColor: 'white',
                titleFont: 'bold 24px Arial',
                bodyFont: '16px Arial'
            },
            positioning: {
                title: { x: 50, y: 60 },
                userName: { x: 50, y: 100 },
                footer: { x: 50, y: 350 }
            }
        };
    }

    /**
     * Calculate result message properties
     * @param {string} type - Message type
     * @returns {Object} Message properties including icon and accessibility settings
     */
    static calculateMessageProperties(type) {
        const typeMap = {
            error: { 
                icon: '❌ ', 
                role: 'alert', 
                ariaLive: 'assertive',
                autoHide: false,
                focusable: true
            },
            success: { 
                icon: '✅ ', 
                role: 'status', 
                ariaLive: 'polite',
                autoHide: true,
                focusable: false
            },
            warning: { 
                icon: '⚠️ ', 
                role: 'status', 
                ariaLive: 'polite',
                autoHide: true,
                focusable: false
            },
            info: { 
                icon: 'ℹ️ ', 
                role: 'status', 
                ariaLive: 'polite',
                autoHide: true,
                focusable: false
            }
        };

        return typeMap[type] || typeMap.info;
    }

    /**
     * Process blob creation parameters
     * @param {string} content - Content to create blob from
     * @param {string} mimeType - MIME type for the blob
     * @returns {Object} Blob creation parameters
     */
    static processBlobCreation(content, mimeType) {
        const mimeTypeMap = {
            json: 'application/json',
            text: 'text/plain',
            png: 'image/png',
            csv: 'text/csv'
        };

        const resolvedMimeType = mimeTypeMap[mimeType] || mimeType || 'text/plain';

        return {
            content,
            mimeType: resolvedMimeType,
            options: { type: resolvedMimeType }
        };
    }

    /**
     * Generate download link properties
     * @param {string} fileName - File name for download
     * @param {string} blobUrl - Blob URL for download
     * @returns {Object} Download link properties
     */
    static generateDownloadLinkProperties(fileName, blobUrl) {
        return {
            href: blobUrl,
            download: fileName,
            style: 'display: none',
            attributes: {
                'aria-hidden': 'true'
            }
        };
    }

    /**
     * Calculate auto-hide timeout based on message length and type
     * @param {string} message - Message text
     * @param {string} type - Message type
     * @returns {number} Timeout in milliseconds
     */
    static calculateAutoHideTimeout(message, type) {
        if (type === 'error') {
            return 0; // Never auto-hide errors
        }

        // Base timeout of 3 seconds, plus 100ms per character over 50
        const baseTimeout = 3000;
        const extraTime = Math.max(0, message.length - 50) * 100;
        const maxTimeout = 10000; // Maximum 10 seconds

        return Math.min(baseTimeout + extraTime, maxTimeout);
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsProcessors;
}

if (typeof window !== 'undefined') {
    window.UtilsProcessors = UtilsProcessors;
}