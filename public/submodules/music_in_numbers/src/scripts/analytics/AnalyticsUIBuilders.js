/**
 * AnalyticsUIBuilders - Pure UI building functions for analytics visualization
 * 
 * This class contains pure UI building functions for analytics displays:
 * - HTML template generation for analytics sections
 * - CSS styling for analytics components
 * - Data visualization markup creation
 * - UI component builders for charts and metrics
 * - Layout and formatting utilities
 * 
 * All functions in this class are PURE:
 * - No side effects or external dependencies
 * - Deterministic HTML/CSS output for given inputs
 * - No DOM manipulation or API calls
 * - No global state modification
 * - Template generation and string building only
 */
class AnalyticsUIBuilders {

    /**
     * PURE: Generates the main analytics container HTML
     * @param {Object} data - Complete analytics data object
     * @returns {string} Complete analytics HTML template
     */
    static generateAnalyticsHTML(data) {
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
                
                ${AnalyticsUIBuilders.generateCurrentPlaybackSection(data)}
                ${AnalyticsUIBuilders.generateMusicPersonalityCard(data)}
                ${AnalyticsUIBuilders.generateMoodAnalysisSection(data)}
                ${AnalyticsUIBuilders.generateAnalyticsGrid(data)}
                ${AnalyticsUIBuilders.generateGenreDistribution(data)}
                ${AnalyticsUIBuilders.generateTopContentSections(data)}
                ${AnalyticsUIBuilders.generateBehaviorInsights(data)}
                ${AnalyticsUIBuilders.generateAdvancedControls()}
            </div>
        `;
    }

    /**
     * PURE: Generates current playback section HTML
     * @param {Object} data - Analytics data containing current playback info
     * @returns {string} Current playback section HTML
     */
    static generateCurrentPlaybackSection(data) {
        if (!data.currentPlayback || !data.currentPlayback.item) {
            return `
                <div style="background: linear-gradient(135deg, #434343, #000000); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                    <h3 style="margin: 0; color: #1DB954;">🎵 No music currently playing</h3>
                    <p style="margin: 10px 0 0 0; opacity: 0.8;">Start playing music on Spotify to see live analytics</p>
                </div>
            `;
        }

        const track = data.currentPlayback.item;
        const isPlaying = data.currentPlayback.is_playing;
        const progress = data.currentPlayback.progress_ms || 0;
        const duration = track.duration_ms;
        const progressPercent = (progress / duration) * 100;

        return `
            <div style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${isPlaying ? '#fff' : '#ccc'}; ${isPlaying ? 'animation: pulse 1.5s infinite;' : ''}"></div>
                    <h3 style="margin: 0; font-size: 18px;">${isPlaying ? '🎵 NOW PLAYING' : '⏸️ PAUSED'}</h3>
                </div>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">${track.name}</div>
                <div style="font-size: 16px; opacity: 0.9; margin-bottom: 15px;">${track.artists.map(a => a.name).join(', ')}</div>
                <div style="background-color: rgba(255,255,255,0.3); border-radius: 10px; height: 6px; margin-bottom: 8px;">
                    <div style="background-color: white; height: 100%; border-radius: 10px; width: ${progressPercent}%; transition: width 0.5s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; opacity: 0.9;">
                    <span>${AnalyticsUIBuilders.formatTime(progress)}</span>
                    <span>${AnalyticsUIBuilders.formatTime(duration)}</span>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates music personality card HTML
     * @param {Object} data - Analytics data containing personality analysis
     * @returns {string} Music personality card HTML
     */
    static generateMusicPersonalityCard(data) {
        const personality = data.analytics?.musicPersonality || {};
        
        return `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                    🎭 Your Music Personality
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 14px; opacity: 0.8;">Exploration Level</div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${personality.explorationLevel || 'Unknown'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 14px; opacity: 0.8;">Diversity Score</div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${personality.diversityScore || 'Unknown'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 14px; opacity: 0.8;">Listening Pattern</div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${personality.consistencyPattern || 'Unknown'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 14px; opacity: 0.8;">Social Tendency</div>
                        <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${personality.socialListener || 'Unknown'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates mood analysis section HTML
     * @param {Object} data - Analytics data containing mood analysis
     * @returns {string} Mood analysis section HTML
     */
    static generateMoodAnalysisSection(data) {
        const mood = data.analytics?.moodAnalysis || {};
        
        return `
            <div style="background: linear-gradient(135deg, #ff9a9e, #fecfef); color: #333; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                    😊 Mood Analysis: ${mood.mood || 'Unknown'}
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    ${AnalyticsUIBuilders.generateMoodMeter('Happiness', mood.happiness || 0, '#ff6b6b')}
                    ${AnalyticsUIBuilders.generateMoodMeter('Energy', mood.energy || 0, '#4ecdc4')}
                    ${AnalyticsUIBuilders.generateMoodMeter('Danceability', mood.danceability || 0, '#45b7d1')}
                    ${AnalyticsUIBuilders.generateMoodMeter('Acousticness', mood.acousticness || 0, '#96ceb4')}
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates a mood meter component
     * @param {string} label - Label for the mood meter
     * @param {number} value - Value (0-100)
     * @param {string} color - Color for the meter
     * @returns {string} Mood meter HTML
     */
    static generateMoodMeter(label, value, color) {
        const percentage = Math.round(value);
        
        return `
            <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">${label}</div>
                <div style="position: relative; width: 80px; height: 80px; margin: 0 auto;">
                    <svg style="width: 100%; height: 100%; transform: rotate(-90deg);">
                        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="6"/>
                        <circle cx="40" cy="40" r="35" fill="none" stroke="${color}" stroke-width="6" stroke-dasharray="${2 * Math.PI * 35}" stroke-dashoffset="${2 * Math.PI * 35 * (1 - percentage / 100)}" style="transition: stroke-dashoffset 0.5s ease;"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; font-weight: bold;">${percentage}%</div>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates analytics grid section
     * @param {Object} data - Analytics data
     * @returns {string} Analytics grid HTML
     */
    static generateAnalyticsGrid(data) {
        const analytics = data.analytics || {};
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                ${AnalyticsUIBuilders.generateStatCard('Total Tracks', analytics.totalTracks || 0, '🎵')}
                ${AnalyticsUIBuilders.generateStatCard('Unique Artists', analytics.uniqueArtists || 0, '👨‍🎤')}
                ${AnalyticsUIBuilders.generateStatCard('Listening Hours', Math.round((analytics.totalListeningTime || 0) / 60 * 10) / 10, '⏰')}
                ${AnalyticsUIBuilders.generateStatCard('Avg Track Length', `${Math.floor((analytics.averageTrackLength || 0) / 60)}:${((analytics.averageTrackLength || 0) % 60).toString().padStart(2, '0')}`, '📏')}
                ${AnalyticsUIBuilders.generateStatCard('Skip Rate', `${analytics.listeningPatterns?.skipRate || 0}%`, '⏭️')}
                ${AnalyticsUIBuilders.generateStatCard('Repeat Rate', `${analytics.listeningPatterns?.repeatRate || 0}%`, '🔁')}
            </div>
        `;
    }

    /**
     * PURE: Generates a statistics card
     * @param {string} label - Label for the statistic
     * @param {string|number} value - Value to display
     * @param {string} icon - Emoji icon
     * @returns {string} Stat card HTML
     */
    static generateStatCard(label, value, icon) {
        return `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; border-left: 4px solid #1DB954;">
                <div style="font-size: 24px; margin-bottom: 8px;">${icon}</div>
                <div style="font-size: 24px; font-weight: bold; color: #1DB954; margin-bottom: 5px;">${value}</div>
                <div style="font-size: 14px; color: #666; font-weight: 500;">${label}</div>
            </div>
        `;
    }

    /**
     * PURE: Generates genre distribution section
     * @param {Object} data - Analytics data containing genre information
     * @returns {string} Genre distribution HTML
     */
    static generateGenreDistribution(data) {
        const genres = data.analytics?.topGenres || [];
        
        if (genres.length === 0) {
            return `
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">🎼 Genre Distribution</h3>
                    <p style="color: #666;">No genre data available</p>
                </div>
            `;
        }

        const maxCount = Math.max(...genres.map(g => g.count));
        
        return `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">🎼 Genre Distribution</h3>
                <div style="space-y: 10px;">
                    ${genres.map(genre => AnalyticsUIBuilders.generateGenreBar(genre.genre, genre.count, maxCount)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates a genre bar chart item
     * @param {string} genre - Genre name
     * @param {number} count - Number of tracks in this genre
     * @param {number} maxCount - Maximum count for scaling
     * @returns {string} Genre bar HTML
     */
    static generateGenreBar(genre, count, maxCount) {
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span style="font-weight: 500; color: #333; text-transform: capitalize;">${genre}</span>
                    <span style="font-size: 14px; color: #666;">${count}</span>
                </div>
                <div style="background: #f0f0f0; border-radius: 10px; height: 8px;">
                    <div style="background: linear-gradient(90deg, #1DB954, #1ed760); height: 100%; border-radius: 10px; width: ${percentage}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates top content sections (tracks and artists)
     * @param {Object} data - Analytics data containing top tracks and artists
     * @returns {string} Top content sections HTML
     */
    static generateTopContentSections(data) {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                ${AnalyticsUIBuilders.generateTopTracksSection(data.topTracks || [])}
                ${AnalyticsUIBuilders.generateTopArtistsSection(data.topArtists || [])}
            </div>
        `;
    }

    /**
     * PURE: Generates top tracks section
     * @param {Array} topTracks - Array of top track objects
     * @returns {string} Top tracks section HTML
     */
    static generateTopTracksSection(topTracks) {
        return `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #333; display: flex; align-items: center; gap: 8px;">
                    🎵 Top Tracks
                    <select id="timeRangeSelector" onchange="updateAnalyticsTimeRange()" style="margin-left: auto; padding: 5px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px;">
                        <option value="short_term">Last 4 weeks</option>
                        <option value="medium_term" selected>Last 6 months</option>
                        <option value="long_term">All time</option>
                    </select>
                </h3>
                <div class="track-list" id="trackListContainer">
                    ${topTracks.slice(0, 10).map((track, index) => AnalyticsUIBuilders.generateTrackItem(track, index)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates top artists section
     * @param {Array} topArtists - Array of top artist objects
     * @returns {string} Top artists section HTML
     */
    static generateTopArtistsSection(topArtists) {
        return `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #333;">👨‍🎤 Top Artists</h3>
                <div class="artist-list" id="artistListContainer">
                    ${topArtists.slice(0, 10).map((artist, index) => AnalyticsUIBuilders.generateArtistItem(artist, index)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates a track list item
     * @param {Object} track - Track object
     * @param {number} index - Track position (0-based)
     * @returns {string} Track item HTML
     */
    static generateTrackItem(track, index) {
        return `
            <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; margin-right: 10px; color: #1DB954; min-width: 20px;">${index + 1}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: #333;">${track.name}</div>
                    <div style="font-size: 12px; color: #666;">${track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</div>
                </div>
                <div style="font-size: 12px; color: #999; text-align: right;">
                    ${AnalyticsUIBuilders.formatTime(track.duration_ms || 0)}
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates an artist list item
     * @param {Object} artist - Artist object
     * @param {number} index - Artist position (0-based)
     * @returns {string} Artist item HTML
     */
    static generateArtistItem(artist, index) {
        return `
            <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; margin-right: 10px; color: #1DB954; min-width: 20px;">${index + 1}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: #333;">${artist.name}</div>
                    <div style="font-size: 12px; color: #666;">${artist.genres?.slice(0, 3).join(', ') || 'No genres'}</div>
                </div>
                <div style="font-size: 12px; color: #999; text-align: right;">
                    ${artist.followers?.total?.toLocaleString() || '0'} followers
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates behavior insights section
     * @param {Object} data - Analytics data containing behavior patterns
     * @returns {string} Behavior insights HTML
     */
    static generateBehaviorInsights(data) {
        const patterns = data.analytics?.listeningPatterns || {};
        const personality = data.analytics?.musicPersonality || {};
        
        return `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 20px;">🧠 Behavior Insights</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">⏰ Peak Listening</div>
                        <div style="font-size: 14px; opacity: 0.9;">
                            ${patterns.peakHours?.join(' & ') || 'Unknown'} • ${patterns.weekdayPreference || 'Unknown'}
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">🎧 Session Style</div>
                        <div style="font-size: 14px; opacity: 0.9;">
                            ${patterns.sessionLength || 0} tracks per session
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">🎭 Listening Style</div>
                        <div style="font-size: 14px; opacity: 0.9;">
                            ${personality.preferredListeningTime || 'Unknown'} listener
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Generates advanced controls section
     * @returns {string} Advanced controls HTML
     */
    static generateAdvancedControls() {
        return `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #333;">⚙️ Advanced Controls</h3>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="refreshAnalytics()" style="background: #1DB954; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        🔄 Refresh Data
                    </button>
                    <button onclick="showDetailedAnalytics()" style="background: #ff6b35; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        📊 Detailed View
                    </button>
                    <button onclick="generateReport()" style="background: #4ecdc4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        📋 Generate Report
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * PURE: Formats time in milliseconds to MM:SS format
     * @param {number} ms - Time in milliseconds
     * @returns {string} Formatted time string
     */
    static formatTime(ms) {
        if (!ms || ms < 0) return '0:00';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * PURE: Generates updated top content HTML for time range updates
     * @param {Array} topTracks - Updated top tracks array
     * @param {Array} topArtists - Updated top artists array
     * @returns {Object} Object containing HTML for tracks and artists
     */
    static generateUpdatedTopContent(topTracks, topArtists) {
        const topTracksHtml = topTracks.map((track, index) => 
            AnalyticsUIBuilders.generateTrackItem(track, index)
        ).join('');

        const topArtistsHtml = topArtists.map((artist, index) => 
            AnalyticsUIBuilders.generateArtistItem(artist, index)
        ).join('');

        return {
            tracksHtml: topTracksHtml,
            artistsHtml: topArtistsHtml
        };
    }

    /**
     * PURE: Generates CSS styles for analytics components
     * @returns {string} CSS stylesheet for analytics
     */
    static generateAnalyticsStyles() {
        return `
            <style id="analyticsStyles">
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .analytics-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .analytics-container button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }
                
                .analytics-container .track-list::-webkit-scrollbar,
                .analytics-container .artist-list::-webkit-scrollbar {
                    width: 6px;
                }
                
                .analytics-container .track-list::-webkit-scrollbar-track,
                .analytics-container .artist-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .analytics-container .track-list::-webkit-scrollbar-thumb,
                .analytics-container .artist-list::-webkit-scrollbar-thumb {
                    background: #1DB954;
                    border-radius: 3px;
                }
                
                .analytics-container .track-list::-webkit-scrollbar-thumb:hover,
                .analytics-container .artist-list::-webkit-scrollbar-thumb:hover {
                    background: #1aa34a;
                }
                
                @media (max-width: 768px) {
                    .analytics-container {
                        padding: 10px;
                    }
                    
                    .analytics-container > div {
                        margin-bottom: 15px;
                    }
                    
                    .analytics-container h2 {
                        font-size: 18px;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .analytics-container h3 {
                        font-size: 16px;
                    }
                }
            </style>
        `;
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsUIBuilders;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.AnalyticsUIBuilders = AnalyticsUIBuilders;
}