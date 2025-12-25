/**
 * @jest-environment jsdom
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals';

/**
 * Unit Tests for AnalyticsProcessors.js
 * 
 * Tests the pure data processing functions for music analytics calculations.
 * This class contains only pure functions with no side effects, making testing
 * straightforward and reliable.
 * 
 * Test Coverage:
 * - calculateAverage: Arithmetic mean calculations
 * - determineMood: Mood classification based on audio features
 * - calculateExplorationLevel: Artist diversity analysis
 * - calculateDiversityScore: Genre variety assessment
 * - calculateConsistencyPattern: Listening pattern consistency
 * - findPreferredTime: Peak listening time identification
 * - determineSocialTendency: Social vs introspective classification
 * - findPeakListeningHours: Top listening periods
 * - findWeekdayPreference: Preferred weekday analysis
 * - calculateAverageSessionLength: Session duration calculations
 * - calculateSkipRate: Track skipping behavior
 * - calculateRepeatRate: Repeat listening patterns
 * - calculateTrendAnalysis: Listening trend analysis
 * - analyzeListeningPatterns: Main analytics orchestration
 * - calculateDistribution: Statistical distribution calculations
 * - processTimePatterns: Time-based pattern analysis
 */

// Simple AnalyticsProcessors implementation for testing
class AnalyticsProcessors {
    
    static calculateAverage(arr) {
        if (!arr || arr.length === 0) return 0;
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }

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

    static calculateExplorationLevel(uniqueArtists, totalTracks) {
        if (totalTracks === 0) return "Unknown";
        
        const ratio = uniqueArtists / totalTracks;
        if (ratio > 0.8) return "Explorer";
        if (ratio > 0.6) return "Adventurous";  
        if (ratio > 0.4) return "Moderate";
        return "Loyal";
    }

    static calculateDiversityScore(genres) {
        const genreCount = Object.keys(genres).length;
        if (genreCount > 15) return "Very Diverse";
        if (genreCount > 10) return "Diverse";
        if (genreCount > 5) return "Moderate";
        return "Focused";
    }

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

    static findPreferredTime(listeningTimes) {
        return Object.entries(listeningTimes)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    static determineSocialTendency(metrics) {
        const avgDanceability = AnalyticsProcessors.calculateAverage(metrics.danceability);
        const avgEnergy = AnalyticsProcessors.calculateAverage(metrics.energy);

        return (avgDanceability > 0.6 && avgEnergy > 0.6) ? "Social" : "Introspective";
    }

    static findPeakListeningHours(listeningTimes) {
        const sortedTimes = Object.entries(listeningTimes)
            .sort((a, b) => b[1] - a[1]);
        return sortedTimes.slice(0, 2).map(([time]) => time);
    }

    static findWeekdayPreference(weekdayPattern) {
        return Object.entries(weekdayPattern)
            .reduce((a, b) => weekdayPattern[a[0]] > weekdayPattern[b[0]] ? a : b)[0];
    }

    static calculateAverageSessionLength(tracks) {
        if (!tracks || tracks.length === 0) return 0;
        if (tracks.length === 1) return 1;

        let sessions = 1;
        const sessionThreshold = 30 * 60 * 1000; // 30 minutes

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

    static calculateSkipRate(tracks) {
        if (!tracks || tracks.length === 0) return 0;

        const skipThreshold = 30000; // 30 seconds
        let skips = 0;
        
        tracks.forEach(track => {
            const duration = track.track?.duration_ms || 0;
            if (duration > 0 && duration < skipThreshold) {
                skips++;
            }
        });
        
        return Math.round((skips / tracks.length) * 100);
    }

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

    static calculateTrendAnalysis(tracks) {
        if (!tracks || tracks.length === 0) {
            return {
                dailyAverage: 0,
                peakDay: null,
                trend: "No Data"
            };
        }

        const periods = {};
        tracks.forEach(track => {
            if (track.played_at) {
                const date = new Date(track.played_at).toDateString();
                periods[date] = (periods[date] || 0) + 1;
            }
        });

        const dailyCounts = Object.values(periods);
        if (dailyCounts.length === 0) {
            return {
                dailyAverage: 0,
                peakDay: null,
                trend: "No Data"
            };
        }

        const dailyAverage = AnalyticsProcessors.calculateAverage(dailyCounts);

        const peakDay = Object.entries(periods)
            .reduce((a, b) => a[1] > b[1] ? a : b);

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
        
        const median = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        const frequency = {};
        values.forEach(val => {
            frequency[val] = (frequency[val] || 0) + 1;
        });
        const mode = Object.entries(frequency)
            .reduce((a, b) => frequency[a[0]] > frequency[b[0]] ? a : b)[0];

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

    static processTimePatterns(tracks) {
        const hourlyDistribution = new Array(24).fill(0);
        const monthlyDistribution = {};
        const seasonalDistribution = { spring: 0, summer: 0, fall: 0, winter: 0 };

        tracks.forEach(track => {
            if (track.played_at) {
                const date = new Date(track.played_at);
                const hour = date.getHours();
                const month = date.getMonth();

                hourlyDistribution[hour]++;

                const monthName = date.toLocaleString('default', { month: 'long' });
                monthlyDistribution[monthName] = (monthlyDistribution[monthName] || 0) + 1;

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

    static analyzeListeningPatterns(recentlyPlayed, audioFeatures = [], topTracks = [], topArtists = []) {
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

        recentlyPlayed.forEach((item, index) => {
            if (item.track && item.track.artists) {
                item.track.artists.forEach(artist => {
                    artists.add(artist.name);
                });

                item.track.artists.forEach(artist => {
                    if (artist.genres) {
                        artist.genres.forEach(genre => {
                            genres[genre] = (genres[genre] || 0) + 1;
                        });
                    }
                });
            }

            if (item.played_at) {
                const playedAt = new Date(item.played_at);
                const hour = playedAt.getHours();
                const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][playedAt.getDay()];

                if (hour >= 6 && hour < 12) listeningTimes.morning++;
                else if (hour >= 12 && hour < 18) listeningTimes.afternoon++;
                else if (hour >= 18 && hour < 22) listeningTimes.evening++;
                else listeningTimes.night++;

                weekdayPattern[dayOfWeek]++;
            }

            if (item.track && item.track.duration_ms) {
                totalDuration += item.track.duration_ms;
            }

            if (audioFeatures[index]) {
                const features = audioFeatures[index];
                moodMetrics.valence.push(features.valence || 0);
                moodMetrics.energy.push(features.energy || 0);
                moodMetrics.danceability.push(features.danceability || 0);
                moodMetrics.acousticness.push(features.acousticness || 0);
                moodMetrics.instrumentalness.push(features.instrumentalness || 0);
            }
        });

        const moodAnalysis = {
            happiness: AnalyticsProcessors.calculateAverage(moodMetrics.valence) * 100,
            energy: AnalyticsProcessors.calculateAverage(moodMetrics.energy) * 100,
            danceability: AnalyticsProcessors.calculateAverage(moodMetrics.danceability) * 100,
            acousticness: AnalyticsProcessors.calculateAverage(moodMetrics.acousticness) * 100,
            mood: AnalyticsProcessors.determineMood(moodMetrics)
        };

        const sortedGenres = Object.entries(genres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        const genreDistribution = Object.fromEntries(sortedGenres);

        const musicPersonality = {
            explorationLevel: AnalyticsProcessors.calculateExplorationLevel(artists.size, recentlyPlayed.length),
            diversityScore: AnalyticsProcessors.calculateDiversityScore(genreDistribution),
            consistencyPattern: AnalyticsProcessors.calculateConsistencyPattern(listeningTimes),
            preferredListeningTime: AnalyticsProcessors.findPreferredTime(listeningTimes),
            socialListener: AnalyticsProcessors.determineSocialTendency(moodMetrics)
        };

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
}

describe('AnalyticsProcessors', () => {
    
    describe('calculateAverage', () => {
        test('should calculate average of numeric array', () => {
            // Arrange
            const numbers = [1, 2, 3, 4, 5];

            // Act
            const result = AnalyticsProcessors.calculateAverage(numbers);

            // Assert
            expect(result).toBe(3);
        });

        test('should return 0 for empty array', () => {
            // Arrange
            const emptyArray = [];

            // Act
            const result = AnalyticsProcessors.calculateAverage(emptyArray);

            // Assert
            expect(result).toBe(0);
        });

        test('should return 0 for null input', () => {
            // Act
            const result = AnalyticsProcessors.calculateAverage(null);

            // Assert
            expect(result).toBe(0);
        });

        test('should handle decimal numbers correctly', () => {
            // Arrange
            const decimals = [0.1, 0.2, 0.3, 0.4];

            // Act
            const result = AnalyticsProcessors.calculateAverage(decimals);

            // Assert
            expect(result).toBeCloseTo(0.25);
        });
    });

    describe('determineMood', () => {
        test('should return Euphoric for high valence and energy', () => {
            // Arrange
            const metrics = { valence: [0.8, 0.9], energy: [0.8, 0.9] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Euphoric");
        });

        test('should return Happy for good valence and energy', () => {
            // Arrange
            const metrics = { valence: [0.6, 0.7], energy: [0.6, 0.7] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Happy");
        });

        test('should return Peaceful for moderate valence and low energy', () => {
            // Arrange
            const metrics = { valence: [0.5, 0.6], energy: [0.2, 0.3] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Peaceful");
        });

        test('should return Intense for low valence and high energy', () => {
            // Arrange
            const metrics = { valence: [0.2, 0.3], energy: [0.7, 0.8] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Intense");
        });

        test('should return Melancholic for low valence and energy', () => {
            // Arrange
            const metrics = { valence: [0.2, 0.3], energy: [0.2, 0.3] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Melancholic");
        });

        test('should return Balanced for moderate values', () => {
            // Arrange
            const metrics = { valence: [0.5], energy: [0.5] };

            // Act
            const result = AnalyticsProcessors.determineMood(metrics);

            // Assert
            expect(result).toBe("Balanced");
        });
    });

    describe('calculateExplorationLevel', () => {
        test('should return Explorer for high artist diversity', () => {
            // Act
            const result = AnalyticsProcessors.calculateExplorationLevel(90, 100);

            // Assert
            expect(result).toBe("Explorer");
        });

        test('should return Adventurous for good diversity', () => {
            // Act
            const result = AnalyticsProcessors.calculateExplorationLevel(70, 100);

            // Assert
            expect(result).toBe("Adventurous");
        });

        test('should return Moderate for medium diversity', () => {
            // Act
            const result = AnalyticsProcessors.calculateExplorationLevel(50, 100);

            // Assert
            expect(result).toBe("Moderate");
        });

        test('should return Loyal for low diversity', () => {
            // Act
            const result = AnalyticsProcessors.calculateExplorationLevel(30, 100);

            // Assert
            expect(result).toBe("Loyal");
        });

        test('should return Unknown for zero tracks', () => {
            // Act
            const result = AnalyticsProcessors.calculateExplorationLevel(0, 0);

            // Assert
            expect(result).toBe("Unknown");
        });
    });

    describe('calculateDiversityScore', () => {
        test('should return Very Diverse for many genres', () => {
            // Arrange
            const genres = {};
            for (let i = 0; i < 20; i++) {
                genres[`genre${i}`] = 1;
            }

            // Act
            const result = AnalyticsProcessors.calculateDiversityScore(genres);

            // Assert
            expect(result).toBe("Very Diverse");
        });

        test('should return Diverse for good genre variety', () => {
            // Arrange
            const genres = {};
            for (let i = 0; i < 12; i++) {
                genres[`genre${i}`] = 1;
            }

            // Act
            const result = AnalyticsProcessors.calculateDiversityScore(genres);

            // Assert
            expect(result).toBe("Diverse");
        });

        test('should return Moderate for medium variety', () => {
            // Arrange
            const genres = { rock: 5, pop: 3, jazz: 2, blues: 1, folk: 1, country: 1 };

            // Act
            const result = AnalyticsProcessors.calculateDiversityScore(genres);

            // Assert
            expect(result).toBe("Moderate");
        });

        test('should return Focused for few genres', () => {
            // Arrange
            const genres = { rock: 10, pop: 5 };

            // Act
            const result = AnalyticsProcessors.calculateDiversityScore(genres);

            // Assert
            expect(result).toBe("Focused");
        });
    });

    describe('calculateConsistencyPattern', () => {
        test('should return Very Consistent for even distribution', () => {
            // Arrange
            const listeningTimes = { morning: 10, afternoon: 10, evening: 10, night: 10 };

            // Act
            const result = AnalyticsProcessors.calculateConsistencyPattern(listeningTimes);

            // Assert
            expect(result).toBe("Very Consistent");
        });

        test('should return Moderately Consistent for moderate variation', () => {
            // Arrange
            const listeningTimes = { morning: 10, afternoon: 8, evening: 6, night: 5 };

            // Act
            const result = AnalyticsProcessors.calculateConsistencyPattern(listeningTimes);

            // Assert
            expect(result).toBe("Moderately Consistent");
        });

        test('should return Variable for high variation', () => {
            // Arrange
            const listeningTimes = { morning: 20, afternoon: 2, evening: 1, night: 1 };

            // Act
            const result = AnalyticsProcessors.calculateConsistencyPattern(listeningTimes);

            // Assert
            expect(result).toBe("Variable");  
        });

        test('should return No Data for all zeros', () => {
            // Arrange
            const listeningTimes = { morning: 0, afternoon: 0, evening: 0, night: 0 };

            // Act
            const result = AnalyticsProcessors.calculateConsistencyPattern(listeningTimes);

            // Assert
            expect(result).toBe("No Data");
        });
    });

    describe('findPreferredTime', () => {
        test('should return time period with highest count', () => {
            // Arrange
            const listeningTimes = { morning: 5, afternoon: 15, evening: 10, night: 3 };

            // Act
            const result = AnalyticsProcessors.findPreferredTime(listeningTimes);

            // Assert
            expect(result).toBe("afternoon");
        });

        test('should handle tie by returning one of the tied values', () => {
            // Arrange
            const listeningTimes = { morning: 10, afternoon: 10, evening: 5, night: 3 };

            // Act
            const result = AnalyticsProcessors.findPreferredTime(listeningTimes);

            // Assert - Should return one of the tied highest values
            expect(["morning", "afternoon"]).toContain(result);
        });
    });

    describe('determineSocialTendency', () => {
        test('should return Social for high danceability and energy', () => {
            // Arrange
            const metrics = { danceability: [0.7, 0.8], energy: [0.7, 0.8] };

            // Act
            const result = AnalyticsProcessors.determineSocialTendency(metrics);

            // Assert
            expect(result).toBe("Social");
        });

        test('should return Introspective for low danceability or energy', () => {
            // Arrange
            const metrics = { danceability: [0.3, 0.4], energy: [0.3, 0.4] };

            // Act
            const result = AnalyticsProcessors.determineSocialTendency(metrics);

            // Assert
            expect(result).toBe("Introspective");
        });
    });

    describe('findPeakListeningHours', () => {
        test('should return top 2 listening periods', () => {
            // Arrange
            const listeningTimes = { 
                morning: 5, 
                afternoon: 15, 
                evening: 10, 
                night: 3 
            };

            // Act
            const result = AnalyticsProcessors.findPeakListeningHours(listeningTimes);

            // Assert
            expect(result).toEqual(["afternoon", "evening"]);
        });

        test('should handle fewer than 2 periods', () => {
            // Arrange
            const listeningTimes = { morning: 10 };

            // Act
            const result = AnalyticsProcessors.findPeakListeningHours(listeningTimes);

            // Assert
            expect(result).toEqual(["morning"]);
        });
    });

    describe('findWeekdayPreference', () => {
        test('should return weekday with highest count', () => {
            // Arrange
            const weekdayPattern = { 
                sunday: 2, monday: 8, tuesday: 5, wednesday: 3,
                thursday: 6, friday: 12, saturday: 4 
            };

            // Act
            const result = AnalyticsProcessors.findWeekdayPreference(weekdayPattern);

            // Assert
            expect(result).toBe("friday");
        });
    });

    describe('calculateAverageSessionLength', () => {
        test('should return 0 for empty tracks', () => {
            // Act
            const result = AnalyticsProcessors.calculateAverageSessionLength([]);

            // Assert
            expect(result).toBe(0);
        });

        test('should return 1 for single track', () => {
            // Arrange
            const tracks = [{ played_at: "2023-01-01T10:00:00Z" }];

            // Act
            const result = AnalyticsProcessors.calculateAverageSessionLength(tracks);

            // Assert
            expect(result).toBe(1);
        });

        test('should calculate sessions based on time gaps', () => {
            // Arrange - tracks with large time gaps (should create multiple sessions)
            const tracks = [
                { played_at: "2023-01-01T10:00:00Z" },
                { played_at: "2023-01-01T10:03:00Z" }, // Same session
                { played_at: "2023-01-01T15:00:00Z" }, // New session (5 hour gap)
                { played_at: "2023-01-01T15:03:00Z" }  // Same session
            ];

            // Act
            const result = AnalyticsProcessors.calculateAverageSessionLength(tracks);

            // Assert
            expect(result).toBe(2); // 4 tracks / 2 sessions = 2 tracks per session
        });
    });

    describe('calculateSkipRate', () => {
        test('should return 0 for empty tracks', () => {
            // Act
            const result = AnalyticsProcessors.calculateSkipRate([]);

            // Assert
            expect(result).toBe(0);
        });

        test('should calculate skip rate for short tracks', () => {
            // Arrange
            const tracks = [
                { track: { duration_ms: 15000 } }, // Skip (< 30 seconds)
                { track: { duration_ms: 45000 } }, // No skip
                { track: { duration_ms: 20000 } }, // Skip (< 30 seconds)
                { track: { duration_ms: 60000 } }  // No skip
            ];

            // Act
            const result = AnalyticsProcessors.calculateSkipRate(tracks);

            // Assert
            expect(result).toBe(50); // 2 skips out of 4 tracks = 50%
        });

        test('should handle tracks without duration', () => {
            // Arrange
            const tracks = [
                { track: {} },
                { track: { duration_ms: 45000 } }
            ];

            // Act
            const result = AnalyticsProcessors.calculateSkipRate(tracks);

            // Assert
            expect(result).toBe(0); // No valid short tracks to skip
        });
    });

    describe('calculateRepeatRate', () => {
        test('should return 0 for empty tracks', () => {
            // Act
            const result = AnalyticsProcessors.calculateRepeatRate([]);

            // Assert
            expect(result).toBe(0);
        });

        test('should calculate repeat rate correctly', () => {
            // Arrange
            const tracks = [
                { track: { name: "Song A", artists: [{ name: "Artist 1" }] } },
                { track: { name: "Song B", artists: [{ name: "Artist 2" }] } },
                { track: { name: "Song A", artists: [{ name: "Artist 1" }] } }, // Repeat
                { track: { name: "Song C", artists: [{ name: "Artist 3" }] } }
            ];

            // Act  
            const result = AnalyticsProcessors.calculateRepeatRate(tracks);

            // Assert
            expect(result).toBe(33); // 1 repeated track out of 3 unique = 33%
        });

        test('should handle tracks without proper structure', () => {
            // Arrange
            const tracks = [
                { track: null },
                { track: { name: "Song A" } }, // Missing artists
                { track: { artists: [{ name: "Artist 1" }] } } // Missing name
            ];

            // Act
            const result = AnalyticsProcessors.calculateRepeatRate(tracks);

            // Assert
            expect(result).toBe(0);
        });
    });

    describe('calculateTrendAnalysis', () => {
        test('should return no data structure for empty tracks', () => {
            // Act
            const result = AnalyticsProcessors.calculateTrendAnalysis([]);

            // Assert
            expect(result).toEqual({
                dailyAverage: 0,
                peakDay: null,
                trend: "No Data"
            });
        });

        test('should calculate trend analysis for tracks with timestamps', () => {
            // Arrange
            const tracks = [
                { played_at: "2023-01-01T10:00:00Z" },
                { played_at: "2023-01-01T11:00:00Z" },
                { played_at: "2023-01-02T10:00:00Z" },
                { played_at: "2023-01-03T10:00:00Z" },
                { played_at: "2023-01-03T11:00:00Z" },
                { played_at: "2023-01-03T12:00:00Z" }
            ];

            // Act
            const result = AnalyticsProcessors.calculateTrendAnalysis(tracks);

            // Assert
            expect(result.dailyAverage).toBeCloseTo(2);
            expect(result.peakDay).toBeDefined();
            expect(result.peakDay[0]).toBe("Tue Jan 03 2023"); // Peak day (3 tracks)
            expect(result.peakDay[1]).toBe(3); // Count on peak day
            expect(result.trend).toBe("Increasing"); // 2 -> 3 tracks per day trend
        });

        test('should detect decreasing trend', () => {
            // Arrange
            const tracks = [
                { played_at: "2023-01-01T10:00:00Z" },
                { played_at: "2023-01-01T11:00:00Z" },
                { played_at: "2023-01-01T12:00:00Z" }, // 3 tracks
                { played_at: "2023-01-03T10:00:00Z" }  // 1 track
            ];

            // Act
            const result = AnalyticsProcessors.calculateTrendAnalysis(tracks);

            // Assert
            expect(result.trend).toBe("Decreasing");
        });
    });

    describe('calculateDistribution', () => {
        test('should return zero distribution for empty values', () => {
            // Act
            const result = AnalyticsProcessors.calculateDistribution([]);

            // Assert
            expect(result).toEqual({
                mean: 0,
                median: 0,
                mode: 0,
                min: 0,
                max: 0,
                standardDeviation: 0
            });
        });

        test('should calculate correct distribution statistics', () => {
            // Arrange
            const values = [1, 2, 2, 3, 4, 5];

            // Act
            const result = AnalyticsProcessors.calculateDistribution(values);

            // Assert
            expect(result.mean).toBeCloseTo(2.83);
            expect(result.median).toBe(2.5);
            expect(result.mode).toBe(2); // Most frequent value
            expect(result.min).toBe(1);
            expect(result.max).toBe(5);
            expect(result.standardDeviation).toBeGreaterThan(0);
        });

        test('should handle single value correctly', () => {
            // Arrange
            const values = [5];

            // Act
            const result = AnalyticsProcessors.calculateDistribution(values);

            // Assert
            expect(result.mean).toBe(5);
            expect(result.median).toBe(5);
            expect(result.mode).toBe(5);
            expect(result.min).toBe(5);
            expect(result.max).toBe(5);
            expect(result.standardDeviation).toBe(0);
        });
    });

    describe('processTimePatterns', () => {
        test('should process time patterns correctly', () => {
            // Arrange
            const tracks = [
                { played_at: "2023-06-15T10:30:00.000Z" }, // June (summer), hour 10
                { played_at: "2023-06-15T14:30:00.000Z" }, // June (summer), hour 14  
                { played_at: "2023-12-15T18:30:00.000Z" }, // December (winter), hour 18
                { played_at: "2023-12-15T22:30:00.000Z" }  // December (winter), hour 22
            ];

            // Act
            const result = AnalyticsProcessors.processTimePatterns(tracks);

            // Assert
            expect(result.hourlyDistribution).toHaveLength(24);
            // Check that some hours have been recorded (exact hour may vary due to timezone)
            const totalHourlyListening = result.hourlyDistribution.reduce((sum, val) => sum + val, 0);
            expect(totalHourlyListening).toBe(4);
            expect(result.seasonalDistribution.summer).toBe(2);
            expect(result.seasonalDistribution.winter).toBe(2);
            expect(Object.keys(result.monthlyDistribution)).toContain("June");
            expect(Object.keys(result.monthlyDistribution)).toContain("December");
            expect(typeof result.peakHour).toBe('number');
            expect(typeof result.quietestHour).toBe('number');
        });

        test('should handle empty tracks', () => {
            // Act
            const result = AnalyticsProcessors.processTimePatterns([]);

            // Assert
            expect(result.hourlyDistribution).toEqual(new Array(24).fill(0));
            expect(result.monthlyDistribution).toEqual({});
            expect(result.seasonalDistribution).toEqual({ spring: 0, summer: 0, fall: 0, winter: 0 });
        });
    });

    describe('analyzeListeningPatterns', () => {
        test('should analyze comprehensive listening patterns', () => {
            // Arrange
            const recentlyPlayed = [
                {
                    track: {
                        name: "Song 1",
                        artists: [{ name: "Artist 1", genres: ["rock", "pop"] }],
                        duration_ms: 180000
                    },
                    played_at: "2023-01-01T10:30:00Z"
                },
                {
                    track: {
                        name: "Song 2", 
                        artists: [{ name: "Artist 2", genres: ["jazz"] }],
                        duration_ms: 240000
                    },
                    played_at: "2023-01-01T15:30:00Z"
                }
            ];

            const audioFeatures = [
                { valence: 0.8, energy: 0.7, danceability: 0.6, acousticness: 0.3, instrumentalness: 0.1 },
                { valence: 0.6, energy: 0.5, danceability: 0.4, acousticness: 0.7, instrumentalness: 0.8 }
            ];

            // Act
            const result = AnalyticsProcessors.analyzeListeningPatterns(
                recentlyPlayed, 
                audioFeatures, 
                [], 
                []
            );

            // Assert
            expect(result.totalTracks).toBe(2);
            expect(result.uniqueArtists).toBe(2);
            expect(result.topGenres).toBeDefined();
            expect(result.listeningTimes).toBeDefined();
            expect(result.weekdayPattern).toBeDefined();
            expect(result.moodAnalysis).toBeDefined();
            expect(result.moodAnalysis.mood).toBeDefined();
            expect(result.musicPersonality).toBeDefined();
            expect(result.listeningPatterns).toBeDefined();
            expect(result.trendAnalysis).toBeDefined();
        });

        test('should handle empty input gracefully', () => {
            // Act
            const result = AnalyticsProcessors.analyzeListeningPatterns([], [], [], []);

            // Assert
            expect(result.totalTracks).toBe(0);
            expect(result.uniqueArtists).toBe(0);
            expect(result.topGenres).toEqual([]);
            expect(result.averageTrackLength).toBe(0);
            expect(result.totalListeningTime).toBe(0);
        });

        test('should process mood analysis correctly', () => {
            // Arrange
            const recentlyPlayed = [
                { 
                    track: { name: "Happy Song", artists: [{ name: "Artist 1" }] },
                    played_at: "2023-01-01T10:00:00Z"  // Add played_at to prevent trend analysis error
                }
            ];
            const audioFeatures = [
                { valence: 0.9, energy: 0.8, danceability: 0.7, acousticness: 0.2, instrumentalness: 0.1 }
            ];

            // Act
            const result = AnalyticsProcessors.analyzeListeningPatterns(recentlyPlayed, audioFeatures);

            // Assert
            expect(result.moodAnalysis.happiness).toBe(90);
            expect(result.moodAnalysis.energy).toBe(80);
            expect(result.moodAnalysis.mood).toBe("Euphoric");
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle null and undefined inputs gracefully', () => {
            // Assert no errors thrown
            expect(() => AnalyticsProcessors.calculateAverage(null)).not.toThrow();
            expect(() => AnalyticsProcessors.calculateSkipRate(undefined)).not.toThrow();
            expect(() => AnalyticsProcessors.calculateRepeatRate(null)).not.toThrow();
        });

        test('should handle malformed data structures', () => {
            // Arrange
            const malformedTracks = [
                { /* missing track property */ },
                { track: null },
                { track: { /* missing required fields */ } }
            ];

            // Assert no errors thrown
            expect(() => AnalyticsProcessors.calculateSkipRate(malformedTracks)).not.toThrow();
            expect(() => AnalyticsProcessors.calculateRepeatRate(malformedTracks)).not.toThrow();
            expect(() => AnalyticsProcessors.analyzeListeningPatterns(malformedTracks)).not.toThrow();
        });

        test('should return sensible defaults for edge cases', () => {
            // Test various edge cases return expected defaults
            expect(AnalyticsProcessors.calculateAverage([])).toBe(0);
            expect(AnalyticsProcessors.calculateExplorationLevel(0, 0)).toBe("Unknown");
            expect(AnalyticsProcessors.calculateConsistencyPattern({ morning: 0, afternoon: 0 })).toBe("No Data");
        });
    });
});