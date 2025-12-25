/**
 * AnalyticsProcessors - Pure data processing functions for music analytics
 * 
 * This class contains pure data processing functions for analytics calculations:
 * - Statistical calculations (averages, distributions, patterns)
 * - Music behavior analysis (exploration, diversity, consistency)
 * - Mood and personality determination
 * - Trend analysis and pattern recognition
 * - Time-based calculations and session analysis
 * 
 * All functions in this class are PURE:
 * - No side effects or external dependencies
 * - Deterministic output for given inputs
 * - No DOM manipulation or API calls
 * - No global state modification
 * - Mathematical and logical operations only
 */
class AnalyticsProcessors {

    /**
     * PURE: Calculates the arithmetic average of a numeric array
     * @param {Array<number>} arr - Array of numbers
     * @returns {number} Average value, or 0 for empty arrays
     */
    static calculateAverage(arr) {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }

    /**
     * PURE: Determines mood classification based on audio feature metrics
     * @param {Object} metrics - Object containing valence and energy arrays
     * @returns {string} Mood classification
     */
    static determineMood(metrics) {
        const avgValence = AnalyticsProcessors.calculateAverage(metrics.valence);
        const avgEnergy = AnalyticsProcessors.calculateAverage(metrics.energy);

        if (avgValence > 0.7 && avgEnergy > 0.7) return "Euphoric";
        if (avgValence > 0.6 && avgEnergy > 0.6) return "Happy";
        if (avgValence > 0.5 && avgEnergy < 0.4) return "Peaceful";
        if (avgValence < 0.4 && avgEnergy > 0.6) return "Intense";
        if (avgValence < 0.4 && avgEnergy < 0.4) return "Melancholic";
        return "Balanced";
    }

    /**
     * PURE: Calculates music exploration level based on artist diversity
     * @param {number} uniqueArtists - Number of unique artists
     * @param {number} totalTracks - Total number of tracks
     * @returns {string} Exploration level classification
     */
    static calculateExplorationLevel(uniqueArtists, totalTracks) {
        if (totalTracks === 0) return "Unknown";
        
        const ratio = uniqueArtists / totalTracks;
        if (ratio > 0.8) return "Explorer";
        if (ratio > 0.6) return "Adventurous";
        if (ratio > 0.4) return "Moderate";
        return "Loyal";
    }

    /**
     * PURE: Calculates genre diversity score
     * @param {Object} genres - Object with genre names as keys and counts as values
     * @returns {string} Diversity classification
     */
    static calculateDiversityScore(genres) {
        const genreCount = Object.keys(genres).length;
        if (genreCount > 15) return "Very Diverse";
        if (genreCount > 10) return "Diverse";
        if (genreCount > 5) return "Moderate";
        return "Focused";
    }

    /**
     * PURE: Calculates listening consistency pattern
     * @param {Object} listeningTimes - Object with time periods and their counts
     * @returns {string} Consistency pattern classification
     */
    static calculateConsistencyPattern(listeningTimes) {
        const values = Object.values(listeningTimes);
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        if (max === 0) return "No Data";
        
        const ratio = min / max;

        if (ratio > 0.7) return "Very Consistent";
        if (ratio > 0.4) return "Moderately Consistent";
        return "Variable";
    }

    /**
     * PURE: Finds the preferred listening time period
     * @param {Object} listeningTimes - Object with time periods and their counts
     * @returns {string} Most active listening time period
     */
    static findPreferredTime(listeningTimes) {
        return Object.entries(listeningTimes)
            .reduce((a, b) => listeningTimes[a[0]] > listeningTimes[b[0]] ? a : b)[0];
    }

    /**
     * PURE: Determines social listening tendency based on audio metrics
     * @param {Object} metrics - Object containing danceability and energy arrays
     * @returns {string} Social tendency classification
     */
    static determineSocialTendency(metrics) {
        const avgDanceability = AnalyticsProcessors.calculateAverage(metrics.danceability);
        const avgEnergy = AnalyticsProcessors.calculateAverage(metrics.energy);

        return (avgDanceability > 0.6 && avgEnergy > 0.6) ? "Social" : "Introspective";
    }

    /**
     * PURE: Finds peak listening hours from time distribution
     * @param {Object} listeningTimes - Object with time periods and their counts
     * @returns {Array<string>} Top 2 listening time periods
     */
    static findPeakListeningHours(listeningTimes) {
        const sortedTimes = Object.entries(listeningTimes)
            .sort((a, b) => b[1] - a[1]);
        return sortedTimes.slice(0, 2).map(([time]) => time);
    }

    /**
     * PURE: Finds most preferred weekday for listening
     * @param {Object} weekdayPattern - Object with weekdays and their counts
     * @returns {string} Most active weekday
     */
    static findWeekdayPreference(weekdayPattern) {
        return Object.entries(weekdayPattern)
            .reduce((a, b) => weekdayPattern[a[0]] > weekdayPattern[b[0]] ? a : b)[0];
    }

    /**
     * PURE: Calculates average session length based on track timing
     * @param {Array} tracks - Array of track objects with played_at timestamps
     * @returns {number} Average tracks per session
     */
    static calculateAverageSessionLength(tracks) {
        if (!tracks || tracks.length === 0) return 0;
        if (tracks.length === 1) return 1;

        // Simplified session calculation based on time gaps
        let sessions = 1;
        const sessionThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

        for (let i = 1; i < tracks.length; i++) {
            const currentTime = new Date(tracks[i-1].played_at);
            const nextTime = new Date(tracks[i].played_at);
            const timeDiff = Math.abs(currentTime - nextTime);
            
            if (timeDiff > sessionThreshold) {
                sessions++;
            }
        }
        
        return Math.round(tracks.length / sessions);
    }

    /**
     * PURE: Calculates estimated skip rate based on track duration patterns
     * @param {Array} tracks - Array of track objects with duration information
     * @returns {number} Skip rate percentage (0-100)
     */
    static calculateSkipRate(tracks) {
        if (!tracks || tracks.length === 0) return 0;

        const skipThreshold = 30000; // 30 seconds in milliseconds
        let skips = 0;
        
        tracks.forEach(track => {
            const duration = track.track?.duration_ms || 0;
            if (duration > 0 && duration < skipThreshold) {
                skips++;
            }
        });
        
        return Math.round((skips / tracks.length) * 100);
    }

    /**
     * PURE: Calculates repeat listening rate
     * @param {Array} tracks - Array of track objects
     * @returns {number} Repeat rate percentage (0-100)
     */
    static calculateRepeatRate(tracks) {
        if (!tracks || tracks.length === 0) return 0;

        const trackCounts = {};
        
        tracks.forEach(track => {
            if (track.track && track.track.name && track.track.artists) {
                const key = `${track.track.name}-${track.track.artists[0]?.name || 'Unknown'}`;
                trackCounts[key] = (trackCounts[key] || 0) + 1;
            }
        });

        const uniqueTracks = Object.keys(trackCounts).length;
        const repeatedTracks = Object.values(trackCounts).filter(count => count > 1).length;
        
        return uniqueTracks > 0 ? Math.round((repeatedTracks / uniqueTracks) * 100) : 0;
    }

    /**
     * PURE: Calculates trend analysis from listening data over time
     * @param {Array} tracks - Array of track objects with played_at timestamps
     * @returns {Object} Trend analysis results
     */
    static calculateTrendAnalysis(tracks) {
        if (!tracks || tracks.length === 0) {
            return {
                dailyAverage: 0,
                peakDay: null,
                trend: "No Data"
            };
        }

        // Group tracks by date
        const periods = {};
        tracks.forEach(track => {
            if (track.played_at) {
                const date = new Date(track.played_at).toDateString();
                periods[date] = (periods[date] || 0) + 1;
            }
        });

        const dailyCounts = Object.values(periods);
        const dailyAverage = AnalyticsProcessors.calculateAverage(dailyCounts);

        // Find peak day
        const peakDay = Object.entries(periods)
            .reduce((a, b) => a[1] > b[1] ? a : b);

        // Calculate trend direction
        const sortedPeriods = Object.entries(periods)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        let trend = "Stable";
        if (sortedPeriods.length > 1) {
            const firstPeriod = sortedPeriods[0][1];
            const lastPeriod = sortedPeriods[sortedPeriods.length - 1][1];
            
            if (lastPeriod > firstPeriod * 1.2) {
                trend = "Increasing";
            } else if (lastPeriod < firstPeriod * 0.8) {
                trend = "Decreasing";
            }
        }

        return {
            dailyAverage: Math.round(dailyAverage * 100) / 100,
            peakDay: peakDay,
            trend: trend
        };
    }

    /**
     * PURE: Processes listening patterns from raw track data
     * @param {Array} recentlyPlayed - Recently played tracks
     * @param {Array} audioFeatures - Audio features for tracks
     * @param {Array} topTracks - Top tracks data
     * @param {Array} topArtists - Top artists data
     * @returns {Object} Comprehensive analytics results
     */
    static analyzeListeningPatterns(recentlyPlayed, audioFeatures = [], topTracks = [], topArtists = []) {
        // Initialize data structures
        const artists = new Set();
        const genres = {};
        const listeningTimes = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        const weekdayPattern = { 
            sunday: 0, monday: 0, tuesday: 0, wednesday: 0, 
            thursday: 0, friday: 0, saturday: 0 
        };
        const moodMetrics = {
            valence: [],
            energy: [],
            danceability: [],
            acousticness: [],
            instrumentalness: []
        };
        
        let totalDuration = 0;

        // Process each track
        recentlyPlayed.forEach((item, index) => {
            // Collect unique artists
            if (item.track && item.track.artists) {
                item.track.artists.forEach(artist => {
                    artists.add(artist.name);
                });

                // Genre analysis (from artist data if available)
                item.track.artists.forEach(artist => {
                    if (artist.genres) {
                        artist.genres.forEach(genre => {
                            genres[genre] = (genres[genre] || 0) + 1;
                        });
                    }
                });
            }

            // Time analysis
            if (item.played_at) {
                const playedAt = new Date(item.played_at);
                const hour = playedAt.getHours();
                const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][playedAt.getDay()];

                // Time of day patterns
                if (hour >= 6 && hour < 12) listeningTimes.morning++;
                else if (hour >= 12 && hour < 18) listeningTimes.afternoon++;
                else if (hour >= 18 && hour < 22) listeningTimes.evening++;
                else listeningTimes.night++;

                // Weekday patterns
                weekdayPattern[dayOfWeek]++;
            }

            // Sum track durations
            if (item.track && item.track.duration_ms) {
                totalDuration += item.track.duration_ms;
            }

            // Audio features analysis (if available)
            if (audioFeatures[index]) {
                const features = audioFeatures[index];
                moodMetrics.valence.push(features.valence || 0);
                moodMetrics.energy.push(features.energy || 0);
                moodMetrics.danceability.push(features.danceability || 0);
                moodMetrics.acousticness.push(features.acousticness || 0);
                moodMetrics.instrumentalness.push(features.instrumentalness || 0);
            }
        });

        // Calculate mood analysis
        const moodAnalysis = {
            happiness: AnalyticsProcessors.calculateAverage(moodMetrics.valence) * 100,
            energy: AnalyticsProcessors.calculateAverage(moodMetrics.energy) * 100,
            danceability: AnalyticsProcessors.calculateAverage(moodMetrics.danceability) * 100,
            acousticness: AnalyticsProcessors.calculateAverage(moodMetrics.acousticness) * 100,
            mood: AnalyticsProcessors.determineMood(moodMetrics)
        };

        // Genre distribution analysis
        const sortedGenres = Object.entries(genres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        const genreDistribution = Object.fromEntries(sortedGenres);

        // Music personality analysis
        const musicPersonality = {
            explorationLevel: AnalyticsProcessors.calculateExplorationLevel(artists.size, recentlyPlayed.length),
            diversityScore: AnalyticsProcessors.calculateDiversityScore(genreDistribution),
            consistencyPattern: AnalyticsProcessors.calculateConsistencyPattern(listeningTimes),
            preferredListeningTime: AnalyticsProcessors.findPreferredTime(listeningTimes),
            socialListener: AnalyticsProcessors.determineSocialTendency(moodMetrics)
        };

        // Calculate listening efficiency and patterns
        const listeningPatterns = {
            peakHours: AnalyticsProcessors.findPeakListeningHours(listeningTimes),
            weekdayPreference: AnalyticsProcessors.findWeekdayPreference(weekdayPattern),
            sessionLength: AnalyticsProcessors.calculateAverageSessionLength(recentlyPlayed),
            skipRate: AnalyticsProcessors.calculateSkipRate(recentlyPlayed),
            repeatRate: AnalyticsProcessors.calculateRepeatRate(recentlyPlayed)
        };

        return {
            totalTracks: recentlyPlayed.length,
            uniqueArtists: artists.size,
            topGenres: sortedGenres.map(([genre, count]) => ({ genre, count })),
            listeningTimes: listeningTimes,
            weekdayPattern: weekdayPattern,
            averageTrackLength: recentlyPlayed.length > 0 ? Math.round(totalDuration / recentlyPlayed.length / 1000) : 0,
            totalListeningTime: Math.round(totalDuration / 1000 / 60),
            moodAnalysis: moodAnalysis,
            genreDistribution: genreDistribution,
            listeningPatterns: listeningPatterns,
            musicPersonality: musicPersonality,
            trendAnalysis: AnalyticsProcessors.calculateTrendAnalysis(recentlyPlayed)
        };
    }

    /**
     * PURE: Calculates statistical distribution of numeric values
     * @param {Array<number>} values - Array of numeric values
     * @returns {Object} Statistical distribution metrics
     */
    static calculateDistribution(values) {
        if (!values || values.length === 0) {
            return {
                mean: 0,
                median: 0,
                mode: 0,
                min: 0,
                max: 0,
                standardDeviation: 0
            };
        }

        const sorted = [...values].sort((a, b) => a - b);
        const mean = AnalyticsProcessors.calculateAverage(values);
        
        // Calculate median
        const median = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        // Calculate mode (most frequent value)
        const frequency = {};
        values.forEach(val => {
            frequency[val] = (frequency[val] || 0) + 1;
        });
        const mode = Object.entries(frequency)
            .reduce((a, b) => frequency[a[0]] > frequency[b[0]] ? a : b)[0];

        // Calculate standard deviation
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const standardDeviation = Math.sqrt(variance);

        return {
            mean: Math.round(mean * 100) / 100,
            median: Math.round(median * 100) / 100,
            mode: parseFloat(mode),
            min: Math.min(...values),
            max: Math.max(...values),
            standardDeviation: Math.round(standardDeviation * 100) / 100
        };
    }

    /**
     * PURE: Processes time-based listening patterns
     * @param {Array} tracks - Array of tracks with timestamp data
     * @returns {Object} Time-based pattern analysis
     */
    static processTimePatterns(tracks) {
        const hourlyDistribution = new Array(24).fill(0);
        const monthlyDistribution = {};
        const seasonalDistribution = { spring: 0, summer: 0, fall: 0, winter: 0 };

        tracks.forEach(track => {
            if (track.played_at) {
                const date = new Date(track.played_at);
                const hour = date.getHours();
                const month = date.getMonth();

                // Hourly distribution
                hourlyDistribution[hour]++;

                // Monthly distribution
                const monthName = date.toLocaleString('default', { month: 'long' });
                monthlyDistribution[monthName] = (monthlyDistribution[monthName] || 0) + 1;

                // Seasonal distribution
                if (month >= 2 && month <= 4) seasonalDistribution.spring++;
                else if (month >= 5 && month <= 7) seasonalDistribution.summer++;
                else if (month >= 8 && month <= 10) seasonalDistribution.fall++;
                else seasonalDistribution.winter++;
            }
        });

        return {
            hourlyDistribution,
            monthlyDistribution,
            seasonalDistribution,
            peakHour: hourlyDistribution.indexOf(Math.max(...hourlyDistribution)),
            quietestHour: hourlyDistribution.indexOf(Math.min(...hourlyDistribution))
        };
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsProcessors;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.AnalyticsProcessors = AnalyticsProcessors;
}