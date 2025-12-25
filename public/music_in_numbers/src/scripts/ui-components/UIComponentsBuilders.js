/**
 * UI Components Builders - Pure UI Building Functions
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This class contains pure UI building functions for HTML generation, component creation,
 * template building, and styling. All methods are static and side-effect free.
 * 
 * Pattern: "Functional Core" - Pure functions with no side effects
 * Dependencies: UIComponentsValidators, UIComponentsProcessors (for data processing)
 * 
 * @class UIComponentsBuilders
 */
class UIComponentsBuilders {
    
    /**
     * Generate current playback section HTML
     * @param {Object} data - Analytics data containing current playback info
     * @returns {string} HTML string for current playback section
     */
    static generateCurrentPlaybackSection(data) {
        // Validate input data if validators available
        if (typeof UIComponentsValidators !== 'undefined') {
            const validation = UIComponentsValidators.validateCurrentPlaybackData(data?.currentPlayback);
            if (!validation.isValid) {
                console.warn('UIComponentsBuilders.generateCurrentPlaybackSection validation failed:', validation.error);
                return ''; // Return empty string for invalid data
            }
        }

        if (!data?.currentPlayback) {
            return ''; // No current playback data
        }

        const playback = data.currentPlayback;
        const isPlaying = playback.is_playing;
        const pulseAnimation = isPlaying ? 'animation: pulse 1.5s infinite;' : '';
        const statusColor = isPlaying ? '#fff' : '#ccc';
        const statusText = isPlaying ? 'Playing' : 'Paused';
        
        return `
        <div class="current-playback" style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);">
            <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${statusColor}; ${pulseAnimation}"></div>
                🎧 Currently Playing
            </h3>
            <p style="margin: 5px 0; font-size: 16px;"><strong>${playback.item.name}</strong></p>
            <p style="margin: 5px 0; opacity: 0.9;">by ${playback.item.artists.map(a => a.name).join(', ')}</p>
            <p style="margin: 5px 0; opacity: 0.8; font-size: 14px;">${statusText} on ${playback.device.name}</p>
        </div>
        `;
    }

    /**
     * Generate music personality card HTML
     * @param {Object} data - Analytics data containing music personality info
     * @returns {string} HTML string for music personality card
     */
    static generateMusicPersonalityCard(data) {
        if (!data?.analytics?.musicPersonality || !data?.analytics?.moodAnalysis) {
            return ''; // Return empty if required data is missing
        }

        const personality = data.analytics.musicPersonality;
        const mood = data.analytics.moodAnalysis;

        return `
        <div class="personality-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <h3 style="margin: 0 0 15px 0;">🎭 Your Music Personality</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 15px;">
                <div><strong>Type:</strong><br>${personality.explorationLevel || 'Unknown'}</div>
                <div><strong>Diversity:</strong><br>${personality.diversityScore || 'Unknown'}</div>
                <div><strong>Pattern:</strong><br>${personality.consistencyPattern || 'Unknown'}</div>
                <div><strong>Mood:</strong><br>${mood.mood || 'Unknown'}</div>
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                You're a <strong>${personality.explorationLevel || 'unknown'}</strong> listener with <strong>${(personality.diversityScore || 'unknown').toString().toLowerCase()}</strong> taste, 
                preferring <strong>${personality.preferredListeningTime || 'unknown'}</strong> sessions and showing <strong>${(personality.socialListener || 'unknown').toString().toLowerCase()}</strong> tendencies.
            </div>
        </div>
        `;
    }

    /**
     * Generate mood analysis section HTML
     * @param {Object} data - Analytics data containing mood analysis
     * @returns {string} HTML string for mood analysis section
     */
    static generateMoodAnalysisSection(data) {
        if (!data?.analytics?.moodAnalysis) {
            return '';
        }

        // Process mood data using processors if available
        let processedMood;
        if (typeof UIComponentsProcessors !== 'undefined') {
            processedMood = UIComponentsProcessors.processMoodAnalysis(data.analytics.moodAnalysis);
        } else {
            processedMood = {
                happiness: Math.round(data.analytics.moodAnalysis.happiness || 0),
                energy: Math.round(data.analytics.moodAnalysis.energy || 0),
                danceability: Math.round(data.analytics.moodAnalysis.danceability || 0),
                acousticness: Math.round(data.analytics.moodAnalysis.acousticness || 0),
                mood: data.analytics.moodAnalysis.mood || 'Unknown'
            };
        }

        return `
        <div class="mood-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ff6b6b;">
            <h3 style="color: #333; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                🧠 Mood Analysis
                <span style="font-size: 12px; background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 10px;">${processedMood.mood}</span>
            </h3>
            <div class="mood-bars" style="display: grid; gap: 10px;">
                ${this.generateMoodBar('Happiness', processedMood.happiness, 'linear-gradient(90deg, #ff6b6b, #feca57)')}
                ${this.generateMoodBar('Energy', processedMood.energy, 'linear-gradient(90deg, #48dbfb, #0abde3)')}
                ${this.generateMoodBar('Danceability', processedMood.danceability, 'linear-gradient(90deg, #ff9ff3, #f368e0)')}
                ${this.generateMoodBar('Acoustic', processedMood.acousticness, 'linear-gradient(90deg, #7bed9f, #2ed573)')}
            </div>
        </div>
        `;
    }

    /**
     * Generate individual mood bar HTML
     * @param {string} label - Mood attribute label
     * @param {number} value - Mood attribute value (0-100)
     * @param {string} gradient - CSS gradient for the bar
     * @returns {string} HTML string for mood bar
     */
    static generateMoodBar(label, value, gradient) {
        const safeValue = Math.max(0, Math.min(100, value || 0));
        
        return `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 80px; font-size: 14px;">${label}:</span>
            <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                <div style="background: ${gradient}; height: 100%; border-radius: 10px; width: ${safeValue}%; transition: width 0.5s ease;"></div>
            </div>
            <span style="width: 40px; font-size: 12px;">${safeValue}%</span>
        </div>
        `;
    }

    /**
     * Generate analytics grid with stats cards HTML
     * @param {Object} data - Analytics data
     * @returns {string} HTML string for analytics grid
     */
    static generateAnalyticsGrid(data) {
        if (!data?.analytics) {
            return '';
        }

        // Process listening stats
        let processedStats;
        if (typeof UIComponentsProcessors !== 'undefined') {
            processedStats = UIComponentsProcessors.processListeningStats(data.analytics);
        } else {
            processedStats = {
                totalTracks: data.analytics.totalTracks || 0,
                uniqueArtists: data.analytics.uniqueArtists || 0,
                totalListeningTime: `${data.analytics.totalListeningTime || 0} min`,
                averageTrackLength: '0:00',
                skipRate: data.analytics.listeningPatterns?.skipRate || 0,
                repeatRate: data.analytics.listeningPatterns?.repeatRate || 0
            };
        }

        // Process time patterns
        let timePatterns;
        if (typeof UIComponentsProcessors !== 'undefined') {
            timePatterns = UIComponentsProcessors.processTimePatterns(
                data.analytics.listeningTimes,
                data.analytics.listeningPatterns
            );
        } else {
            timePatterns = {
                morning: data.analytics.listeningTimes?.morning || 0,
                afternoon: data.analytics.listeningTimes?.afternoon || 0,
                evening: data.analytics.listeningTimes?.evening || 0,
                night: data.analytics.listeningTimes?.night || 0,
                peakHours: data.analytics.listeningPatterns?.peakHours?.join(' & ') || 'Unknown'
            };
        }

        // Process trend analysis
        let trendData;
        if (typeof UIComponentsProcessors !== 'undefined') {
            trendData = UIComponentsProcessors.processTrendAnalysis(data.analytics.trendAnalysis);
        } else {
            const trend = data.analytics.trendAnalysis?.trend || 'Stable';
            trendData = {
                dailyAverage: Math.round(data.analytics.trendAnalysis?.dailyAverage || 0),
                peakDay: data.analytics.trendAnalysis?.peakDay?.[0] 
                    ? new Date(data.analytics.trendAnalysis.peakDay[0]).toLocaleDateString()
                    : 'Unknown',
                trend,
                trendIcon: trend === 'Increasing' ? '📈' : trend === 'Decreasing' ? '📉' : '📊',
                trendColor: trend === 'Increasing' ? '#2ed573' : trend === 'Decreasing' ? '#ff6b6b' : '#ffa502'
            };
        }

        return `
        <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
            ${this.generateListeningStatsCard(processedStats)}
            ${this.generateTimePatternsCard(timePatterns)}
            ${this.generateTrendAnalysisCard(trendData)}
        </div>
        `;
    }

    /**
     * Generate listening stats card HTML
     * @param {Object} stats - Processed listening statistics
     * @returns {string} HTML string for listening stats card
     */
    static generateListeningStatsCard(stats) {
        return `
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #1DB954; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">📊 Listening Stats</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Recent Tracks:</strong> ${stats.totalTracks}</div>
                <div><strong>Unique Artists:</strong> ${stats.uniqueArtists}</div>
                <div><strong>Total Time:</strong> ${stats.totalListeningTime}</div>
                <div><strong>Avg Track:</strong> ${stats.averageTrackLength}</div>
                <div><strong>Skip Rate:</strong> ${stats.skipRate}%</div>
                <div><strong>Repeat Rate:</strong> ${stats.repeatRate}%</div>
            </div>
        </div>
        `;
    }

    /**
     * Generate time patterns card HTML
     * @param {Object} patterns - Processed time patterns
     * @returns {string} HTML string for time patterns card
     */
    static generateTimePatternsCard(patterns) {
        return `
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #4ecdc4; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">🕐 Time Patterns</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Morning:</strong> ${patterns.morning}</div>
                <div><strong>Afternoon:</strong> ${patterns.afternoon}</div>
                <div><strong>Evening:</strong> ${patterns.evening}</div>
                <div><strong>Night:</strong> ${patterns.night}</div>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center;">
                <strong>Peak:</strong> ${patterns.peakHours}
            </div>
        </div>
        `;
    }

    /**
     * Generate trend analysis card HTML
     * @param {Object} trend - Processed trend data
     * @returns {string} HTML string for trend analysis card
     */
    static generateTrendAnalysisCard(trend) {
        return `
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #ff6b6b; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">📈 Trend Analysis</h3>
            <div style="text-align: center;">
                <div style="margin-bottom: 10px;"><strong>Daily Average:</strong> ${trend.dailyAverage} tracks</div>
                <div style="margin-bottom: 10px;"><strong>Peak Day:</strong> ${trend.peakDay}</div>
                <div><strong>Trend:</strong> 
                    <span style="color: ${trend.trendColor};">
                        ${trend.trend} ${trend.trendIcon}
                    </span>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Generate genre distribution section HTML
     * @param {Object} data - Analytics data containing genre information
     * @returns {string} HTML string for genre distribution section
     */
    static generateGenreDistribution(data) {
        if (!data?.analytics?.topGenres || !Array.isArray(data.analytics.topGenres)) {
            return '';
        }

        const topGenres = data.analytics.topGenres.slice(0, 8);
        const genreItems = topGenres.map((genre, index) => {
            let genreColor;
            if (typeof UIComponentsProcessors !== 'undefined') {
                genreColor = UIComponentsProcessors.getGenreColor(index);
            } else {
                const colors = ['#ff6b6b, #feca57', '#48dbfb, #0abde3', '#ff9ff3, #f368e0'];
                genreColor = colors[index % colors.length];
            }

            return `
            <div style="background: linear-gradient(135deg, ${genreColor}); color: white; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${genre.genre || 'Unknown'}</div>
                <div style="opacity: 0.9;">${genre.count || 0} tracks</div>
            </div>
            `;
        }).join('');

        return `
        <div class="genre-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffa502;">
            <h3 style="color: #333; margin: 0 0 15px 0;">🎪 Genre Distribution</h3>
            <div class="genre-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                ${genreItems}
            </div>
        </div>
        `;
    }

    /**
     * Generate top content sections (tracks and artists) HTML
     * @param {Object} data - Analytics data containing top tracks and artists
     * @returns {string} HTML string for top content sections
     */
    static generateTopContentSections(data) {
        return `
        <div class="top-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
            <div class="top-tracks" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #a55eea;">
                <h3 style="color: #333; margin: 0 0 15px 0;">🎵 Top Tracks</h3>
                <div class="track-list" id="trackListContainer" style="max-height: 350px; overflow-y: auto;">
                    <!-- Virtual scrolling will be applied here -->
                </div>
            </div>
            
            <div class="top-artists" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #26de81;">
                <h3 style="color: #333; margin: 0 0 15px 0;">🎤 Top Artists</h3>
                <div class="artist-list" id="artistListContainer" style="max-height: 350px; overflow-y: auto;">
                    <!-- Virtual scrolling will be applied here -->
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Generate behavior insights section HTML
     * @param {Object} data - Analytics data containing behavior insights
     * @returns {string} HTML string for behavior insights section
     */
    static generateBehaviorInsights(data) {
        if (!data?.analytics) {
            return '';
        }

        // Process behavior insights
        let insights;
        if (typeof UIComponentsProcessors !== 'undefined') {
            insights = UIComponentsProcessors.processBehaviorInsights(data.analytics);
        } else {
            insights = {
                sessionLength: data.analytics.listeningPatterns?.sessionLength || 'Unknown',
                weekdayPreference: data.analytics.listeningPatterns?.weekdayPreference || 'Unknown',
                artistDiversity: Math.round(((data.analytics.uniqueArtists || 0) / (data.analytics.totalTracks || 1)) * 100)
            };
        }

        return `
        <div class="behavior-insights" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0;">🔍 Listening Behavior Insights</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">${insights.sessionLength}</div>
                    <div style="font-size: 12px; opacity: 0.9;">Avg Session Length</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">${insights.weekdayPreference}</div>
                    <div style="font-size: 12px; opacity: 0.9;">Favorite Day</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">${insights.artistDiversity}%</div>
                    <div style="font-size: 12px; opacity: 0.9;">Artist Diversity</div>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Generate advanced controls section HTML
     * @returns {string} HTML string for advanced controls section
     */
    static generateAdvancedControls() {
        return `
        <div style="margin-top: 20px; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 12px;">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="margin-right: 5px; font-weight: 500; font-size: 14px;">Time Range:</label>
                    <select id="timeRangeSelector" onchange="updateAnalyticsTimeRange()" style="padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd; font-size: 14px;">
                        <option value="short_term">Last 4 weeks</option>
                        <option value="medium_term" selected>Last 6 months</option>
                        <option value="long_term">All time</option>
                    </select>
                </div>
                ${this.generateAdvancedButton('refreshAnalytics()', '🔄 Refresh Analytics', 'linear-gradient(135deg, #1DB954, #1ed760)')}
                ${this.generateAdvancedButton('exportAdvancedAnalytics()', '📊 Export Data', 'linear-gradient(135deg, #667eea, #764ba2)')}
                ${this.generateAdvancedButton('generateInsightReport()', '📝 Generate Report', 'linear-gradient(135deg, #f093fb, #f5576c)')}
                ${this.generateAdvancedButton('showPerformanceStats()', '📊 Performance', 'linear-gradient(135deg, #ffecd2, #fcb69f)', '#333')}
                ${this.generateAdvancedButton('clearCache()', '🗑️ Clear Cache', 'linear-gradient(135deg, #ff9a9e, #fecfef)', '#333')}
            </div>
            <div>
                ${this.generateSimpleButton('toggleRealTimeMonitoring()', '🎵 Live Monitor', '#ff6b6b')}
                ${this.generateSimpleButton('exportAnalytics()', '📊 Export Data', '#333')}
                ${this.generateSimpleButton('generateShareableCard()', '📷 Share Card', '#1ed760')}
            </div>
        </div>
        `;
    }

    /**
     * Generate advanced button HTML
     * @param {string} onclick - Click handler function
     * @param {string} text - Button text
     * @param {string} background - Button background gradient
     * @param {string} color - Text color (default: white)
     * @returns {string} HTML string for advanced button
     */
    static generateAdvancedButton(onclick, text, background, color = 'white') {
        return `
        <button onclick="${onclick}" style="background: ${background}; color: ${color}; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
            ${text}
        </button>
        `;
    }

    /**
     * Generate simple button HTML
     * @param {string} onclick - Click handler function
     * @param {string} text - Button text
     * @param {string} backgroundColor - Button background color
     * @returns {string} HTML string for simple button
     */
    static generateSimpleButton(onclick, text, backgroundColor) {
        return `
        <button onclick="${onclick}" style="background-color: ${backgroundColor}; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-right: 10px;">
            ${text}
        </button>
        `;
    }

    /**
     * Create a DOM element for track rendering
     * @param {Object} track - Track data
     * @param {number} index - Track index
     * @returns {HTMLElement} DOM element for track item
     */
    static createTrackElement(track, index) {
        // Process track data
        let processedTrack;
        if (typeof UIComponentsProcessors !== 'undefined') {
            processedTrack = UIComponentsProcessors.processTrackForRendering(track, index);
        } else {
            processedTrack = {
                name: track?.name || 'Unknown Track',
                artists: track?.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
                duration: '0:00',
                popularity: track?.popularity || 0,
                explicit: Boolean(track?.explicit),
                index: index + 1
            };
        }

        const element = document.createElement('div');
        element.style.cssText = `
            display: flex; 
            align-items: center; 
            padding: 10px; 
            border-bottom: 1px solid #eee; 
            transition: background-color 0.2s ease;
        `;

        element.innerHTML = `
            <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #1DB954, #1ed760); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px;">${processedTrack.index}</div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${processedTrack.name}</div>
                <div style="font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${processedTrack.artists}</div>
                <div style="font-size: 11px; color: #999; margin-top: 2px;">Popularity: ${processedTrack.popularity}/100</div>
            </div>
            <div style="text-align: right; margin-left: 10px;">
                <div style="font-size: 12px; color: #999;">${processedTrack.duration}</div>
                <div style="font-size: 10px; color: #1DB954; margin-top: 2px;">♪ ${processedTrack.explicit ? 'E' : 'C'}</div>
            </div>
        `;

        // Add hover effects
        const hoverEffects = typeof UIComponentsProcessors !== 'undefined' 
            ? UIComponentsProcessors.generateHoverEffects()
            : { mouseEnter: { backgroundColor: '#f0f0f0' }, mouseLeave: { backgroundColor: 'transparent' } };

        element.addEventListener('mouseenter', () => {
            Object.assign(element.style, hoverEffects.mouseEnter);
        });

        element.addEventListener('mouseleave', () => {
            Object.assign(element.style, hoverEffects.mouseLeave);
        });

        return element;
    }

    /**
     * Create a DOM element for artist rendering
     * @param {Object} artist - Artist data
     * @param {number} index - Artist index
     * @returns {HTMLElement} DOM element for artist item
     */
    static createArtistElement(artist, index) {
        // Process artist data
        let processedArtist;
        if (typeof UIComponentsProcessors !== 'undefined') {
            processedArtist = UIComponentsProcessors.processArtistForRendering(artist, index);
        } else {
            processedArtist = {
                name: artist?.name || 'Unknown Artist',
                genres: artist?.genres?.slice(0, 3).join(', ') || 'Various',
                popularity: artist?.popularity || 0,
                followers: artist?.followers?.total?.toLocaleString() || '0',
                index: index + 1
            };
        }

        const element = document.createElement('div');
        element.style.cssText = `
            display: flex; 
            align-items: center; 
            padding: 10px; 
            border-bottom: 1px solid #eee; 
            transition: background-color 0.2s ease;
        `;

        element.innerHTML = `
            <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #26de81, #20bf6b); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px;">${processedArtist.index}</div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${processedArtist.name}</div>
                <div style="font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${processedArtist.genres}</div>
                <div style="font-size: 11px; color: #999; margin-top: 2px;">Popularity: ${processedArtist.popularity}/100</div>
            </div>
            <div style="text-align: right; margin-left: 10px;">
                <div style="font-size: 11px; color: #999;">${processedArtist.followers}</div>
                <div style="font-size: 10px; color: #26de81; margin-top: 2px;">followers</div>
            </div>
        `;

        // Add hover effects
        const hoverEffects = typeof UIComponentsProcessors !== 'undefined' 
            ? UIComponentsProcessors.generateHoverEffects()
            : { mouseEnter: { backgroundColor: '#f0f0f0' }, mouseLeave: { backgroundColor: 'transparent' } };

        element.addEventListener('mouseenter', () => {
            Object.assign(element.style, hoverEffects.mouseEnter);
        });

        element.addEventListener('mouseleave', () => {
            Object.assign(element.style, hoverEffects.mouseLeave);
        });

        return element;
    }

    /**
     * Generate complete analytics HTML template
     * @param {Object} data - Complete analytics data
     * @returns {string} Complete HTML string for analytics display
     */
    static generateAnalyticsHTML(data) {
        if (!data) {
            return '<div class="analytics-error">No analytics data available</div>';
        }

        return `
        <div class="analytics-container" style="margin-top: 30px;">
            <h2 style="color: #1DB954; border-bottom: 2px solid #1DB954; padding-bottom: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                🎵 Your Advanced Music Analytics
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button onclick="toggleAnalyticsView()" style="background: #1DB954; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;">Toggle View</button>
                    <button onclick="showExportModal()" style="background: #ff6b35; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Export your music analytics">
                        📊 Export
                    </button>
                </div>
            </h2>
            
            ${this.generateCurrentPlaybackSection(data)}
            ${this.generateMusicPersonalityCard(data)}
            ${this.generateMoodAnalysisSection(data)}
            ${this.generateAnalyticsGrid(data)}
            ${this.generateGenreDistribution(data)}
            ${this.generateTopContentSections(data)}
            ${this.generateBehaviorInsights(data)}
            ${this.generateAdvancedControls()}
        </div>
        `;
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponentsBuilders;
} else if (typeof window !== 'undefined') {
    window.UIComponentsBuilders = UIComponentsBuilders;
}

// ES6 module export
if (typeof exports !== 'undefined') {
    exports.UIComponentsBuilders = UIComponentsBuilders;
}