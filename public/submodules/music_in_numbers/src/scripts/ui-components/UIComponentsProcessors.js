/**
 * UI Components Processors - Pure Data Processing Functions
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This class contains pure data processing functions for UI components including
 * color calculations, time formatting, data transformations, and view processing.
 * All methods are static and side-effect free.
 * 
 * Pattern: "Functional Core" - Pure functions with no side effects
 * Dependencies: UIComponentsValidators (for input validation)
 * 
 * @class UIComponentsProcessors
 */
class UIComponentsProcessors {
    
    /**
     * Get genre color based on index with validation
     * @param {number} index - Genre index for color selection
     * @returns {string} CSS gradient colors for the genre
     */
    static getGenreColor(index) {
        // Input validation
        if (typeof UIComponentsValidators !== 'undefined') {
            const validation = UIComponentsValidators.validateGenreIndex(index);
            if (!validation.isValid) {
                console.warn('UIComponentsProcessors.getGenreColor validation failed:', validation.error);
                return '#ff6b6b, #feca57'; // Default fallback
            }
        }

        const colors = [
            '#ff6b6b, #feca57',    // Red-orange gradient
            '#48dbfb, #0abde3',    // Blue gradient
            '#ff9ff3, #f368e0',    // Pink gradient
            '#7bed9f, #2ed573',    // Green gradient
            '#a55eea, #8854d0',    // Purple gradient
            '#26de81, #20bf6b',    // Mint green gradient
            '#fd79a8, #e84393',    // Pink-magenta gradient
            '#6c5ce7, #5f3dc4',    // Deep purple gradient
            '#ffeaa7, #fdcb6e',    // Yellow gradient
            '#74b9ff, #0984e3'     // Light blue gradient
        ];
        
        return colors[index % colors.length];
    }

    /**
     * Format track duration from milliseconds to mm:ss format
     * @param {number} durationMs - Duration in milliseconds
     * @returns {string} Formatted duration string (mm:ss)
     */
    static formatTrackDuration(durationMs) {
        if (typeof durationMs !== 'number' || isNaN(durationMs) || durationMs < 0) {
            return '0:00'; // Fallback for invalid duration
        }

        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Format total listening time from seconds to readable format
     * @param {number} totalSeconds - Total listening time in seconds
     * @returns {string} Formatted time string (e.g., "2h 30m", "45m", "1h")
     */
    static formatListeningTime(totalSeconds) {
        if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
            return '0m';
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    }

    /**
     * Calculate percentage with proper rounding and bounds
     * @param {number} value - Current value
     * @param {number} total - Total value
     * @param {number} decimals - Number of decimal places (default: 1)
     * @returns {number} Percentage value between 0 and 100
     */
    static calculatePercentage(value, total, decimals = 1) {
        if (typeof value !== 'number' || typeof total !== 'number' || 
            isNaN(value) || isNaN(total) || total === 0) {
            return 0;
        }

        const percentage = (value / total) * 100;
        const bounded = Math.max(0, Math.min(100, percentage)); // Bound between 0-100
        return Number(bounded.toFixed(decimals));
    }

    /**
     * Process analytics mood values for display
     * @param {Object} moodAnalysis - Raw mood analysis data
     * @returns {Object} Processed mood data with rounded percentages
     */
    static processMoodAnalysis(moodAnalysis) {
        if (!moodAnalysis || typeof moodAnalysis !== 'object') {
            return {
                happiness: 0,
                energy: 0,
                danceability: 0,
                acousticness: 0,
                mood: 'Unknown'
            };
        }

        return {
            happiness: Math.round(moodAnalysis.happiness || 0),
            energy: Math.round(moodAnalysis.energy || 0),
            danceability: Math.round(moodAnalysis.danceability || 0),
            acousticness: Math.round(moodAnalysis.acousticness || 0),
            mood: moodAnalysis.mood || 'Unknown'
        };
    }

    /**
     * Process trend analysis data for display
     * @param {Object} trendAnalysis - Raw trend analysis data
     * @returns {Object} Processed trend data with formatted values
     */
    static processTrendAnalysis(trendAnalysis) {
        if (!trendAnalysis || typeof trendAnalysis !== 'object') {
            return {
                dailyAverage: 0,
                peakDay: 'Unknown',
                trend: 'Stable',
                trendIcon: '📊',
                trendColor: '#ffa502'
            };
        }

        const trend = trendAnalysis.trend || 'Stable';
        let trendIcon = '📊';
        let trendColor = '#ffa502';

        if (trend === 'Increasing') {
            trendIcon = '📈';
            trendColor = '#2ed573';
        } else if (trend === 'Decreasing') {
            trendIcon = '📉';
            trendColor = '#ff6b6b';
        }

        return {
            dailyAverage: Math.round(trendAnalysis.dailyAverage || 0),
            peakDay: trendAnalysis.peakDay && trendAnalysis.peakDay[0] 
                ? new Date(trendAnalysis.peakDay[0]).toLocaleDateString()
                : 'Unknown',
            trend,
            trendIcon,
            trendColor
        };
    }

    /**
     * Process listening statistics for display
     * @param {Object} analytics - Raw analytics data
     * @returns {Object} Processed listening statistics
     */
    static processListeningStats(analytics) {
        if (!analytics || typeof analytics !== 'object') {
            return {
                totalTracks: 0,
                uniqueArtists: 0,
                totalListeningTime: '0m',
                averageTrackLength: '0:00',
                skipRate: 0,
                repeatRate: 0,
                artistDiversity: 0
            };
        }

        const avgTrackLengthSeconds = analytics.averageTrackLength || 0;
        const totalListeningTimeMinutes = analytics.totalListeningTime || 0;

        return {
            totalTracks: analytics.totalTracks || 0,
            uniqueArtists: analytics.uniqueArtists || 0,
            totalListeningTime: `${totalListeningTimeMinutes} min`,
            averageTrackLength: this.formatTrackDuration(avgTrackLengthSeconds * 1000),
            skipRate: analytics.listeningPatterns?.skipRate || 0,
            repeatRate: analytics.listeningPatterns?.repeatRate || 0,
            artistDiversity: this.calculatePercentage(
                analytics.uniqueArtists || 0, 
                analytics.totalTracks || 1
            )
        };
    }

    /**
     * Process time patterns for display
     * @param {Object} listeningTimes - Raw listening times data
     * @param {Object} listeningPatterns - Raw listening patterns data
     * @returns {Object} Processed time patterns
     */
    static processTimePatterns(listeningTimes, listeningPatterns) {
        const defaultTimes = {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0
        };

        const processedTimes = { ...defaultTimes, ...(listeningTimes || {}) };
        const peakHours = listeningPatterns?.peakHours || [];

        return {
            ...processedTimes,
            peakHours: Array.isArray(peakHours) ? peakHours.join(' & ') : 'Unknown'
        };
    }

    /**
     * Process artist data for rendering
     * @param {Object} artist - Raw artist data
     * @param {number} index - Artist index for display
     * @returns {Object} Processed artist data
     */
    static processArtistForRendering(artist, index) {
        if (!artist || typeof artist !== 'object') {
            return {
                name: 'Unknown Artist',
                genres: 'Various',
                popularity: 0,
                followers: '0',
                index: index + 1
            };
        }

        return {
            name: artist.name || 'Unknown Artist',
            genres: Array.isArray(artist.genres) && artist.genres.length > 0
                ? artist.genres.slice(0, 3).join(', ')
                : 'Various',
            popularity: artist.popularity || 0,
            followers: artist.followers?.total 
                ? artist.followers.total.toLocaleString()
                : '0',
            index: index + 1
        };
    }

    /**
     * Process track data for rendering
     * @param {Object} track - Raw track data
     * @param {number} index - Track index for display
     * @returns {Object} Processed track data
     */
    static processTrackForRendering(track, index) {
        if (!track || typeof track !== 'object') {
            return {
                name: 'Unknown Track',
                artists: 'Unknown Artist',
                duration: '0:00',
                popularity: 0,
                explicit: false,
                index: index + 1
            };
        }

        return {
            name: track.name || 'Unknown Track',
            artists: Array.isArray(track.artists) && track.artists.length > 0
                ? track.artists.map(a => a.name || 'Unknown').join(', ')
                : 'Unknown Artist',
            duration: this.formatTrackDuration(track.duration_ms),
            popularity: track.popularity || 0,
            explicit: Boolean(track.explicit),
            index: index + 1
        };
    }

    /**
     * Process behavior insights data
     * @param {Object} analytics - Raw analytics data
     * @returns {Object} Processed behavior insights
     */
    static processBehaviorInsights(analytics) {
        if (!analytics || typeof analytics !== 'object') {
            return {
                sessionLength: 'Unknown',
                weekdayPreference: 'Unknown',
                artistDiversity: 0
            };
        }

        const listeningPatterns = analytics.listeningPatterns || {};
        const artistDiversity = this.calculatePercentage(
            analytics.uniqueArtists || 0,
            analytics.totalTracks || 1
        );

        return {
            sessionLength: listeningPatterns.sessionLength || 'Unknown',
            weekdayPreference: listeningPatterns.weekdayPreference || 'Unknown',
            artistDiversity: Math.round(artistDiversity)
        };
    }

    /**
     * Generate CSS hover effects for interactive elements
     * @param {string} baseColor - Base color for the element
     * @returns {Object} CSS properties for hover effects
     */
    static generateHoverEffects(baseColor = '#f0f0f0') {
        return {
            mouseEnter: {
                backgroundColor: baseColor,
                transform: 'translateY(-2px)',
                cursor: 'pointer'
            },
            mouseLeave: {
                backgroundColor: 'transparent',
                transform: 'translateY(0)'
            }
        };
    }

    /**
     * Calculate optimal container height for virtual scrolling
     * @param {number} itemCount - Number of items
     * @param {number} itemHeight - Height per item in pixels
     * @param {number} maxHeight - Maximum container height
     * @returns {number} Optimal container height
     */
    static calculateOptimalContainerHeight(itemCount, itemHeight = 70, maxHeight = 350) {
        if (typeof itemCount !== 'number' || itemCount <= 0) {
            return maxHeight;
        }

        const totalHeight = itemCount * itemHeight;
        return Math.min(totalHeight, maxHeight);
    }

    /**
     * Process message type for display styling
     * @param {string} type - Message type (error, success, warning, info)
     * @returns {Object} Processed message styling information
     */
    static processMessageType(type) {
        const typeMap = {
            error: { icon: '❌', role: 'alert', color: '#ff6b6b', priority: 'high' },
            success: { icon: '✅', role: 'status', color: '#2ed573', priority: 'medium' },
            warning: { icon: '⚠️', role: 'status', color: '#ffa502', priority: 'medium' },
            info: { icon: 'ℹ️', role: 'status', color: '#48dbfb', priority: 'low' }
        };

        return typeMap[type] || typeMap.info;
    }

    /**
     * Process compact view toggle state
     * @param {boolean} isCompact - Current compact view state
     * @returns {Object} Processed view settings
     */
    static processViewToggle(isCompact) {
        return {
            fontSize: isCompact ? '12px' : '14px',
            cardPadding: isCompact ? '15px' : '20px',
            buttonText: isCompact ? 'Detailed View' : 'Compact View',
            viewState: isCompact ? 'compact' : 'detailed'
        };
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponentsProcessors;
} else if (typeof window !== 'undefined') {
    window.UIComponentsProcessors = UIComponentsProcessors;
}

// ES6 module export
if (typeof exports !== 'undefined') {
    exports.UIComponentsProcessors = UIComponentsProcessors;
}