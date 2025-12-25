/**
 * UI Components - Backward Compatible Delegation Wrapper
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This file maintains backward compatibility by delegating to extracted classes
 * when available, falling back to legacy implementations when classes are unavailable.
 * 
 * Architecture: Delegation pattern with intelligent fallbacks
 * Dependencies: UI Components modular classes (optional with fallbacks)
 */

// ===== IMPORT EXTRACTED CLASSES WITH FALLBACKS =====

// Import UI Components classes if available
let UIComponentsValidators, UIComponentsProcessors, UIComponentsBuilders, UIComponentsCore, UIComponentsUtilities;

// Attempt to load extracted classes
try {
    if (typeof require !== 'undefined') {
        // Node.js environment
        UIComponentsValidators = require('./ui-components/UIComponentsValidators.js');
        UIComponentsProcessors = require('./ui-components/UIComponentsProcessors.js');
        UIComponentsBuilders = require('./ui-components/UIComponentsBuilders.js');
        UIComponentsCore = require('./ui-components/UIComponentsCore.js');
        UIComponentsUtilities = require('./ui-components/UIComponentsUtilities.js');
    } else {
        // Browser environment - classes should be loaded via script tags
        UIComponentsValidators = window.UIComponentsValidators;
        UIComponentsProcessors = window.UIComponentsProcessors;
        UIComponentsBuilders = window.UIComponentsBuilders;
        UIComponentsCore = window.UIComponentsCore;
        UIComponentsUtilities = window.UIComponentsUtilities;
    }
} catch (error) {
    console.warn('UI Components classes not available, using fallback implementations:', error.message);
}

// ===== DEPENDENCY MANAGEMENT =====

/**
 * Ensure UI Components dependencies are available
 * @returns {Object} Dependency container
 */
function ensureUIComponentsDependencies() {
    if (UIComponentsUtilities && typeof UIComponentsUtilities.createAutoDependencies === 'function') {
        return UIComponentsUtilities.createAutoDependencies();
    }
    
    // Fallback dependency container
    return {
        document: typeof document !== 'undefined' ? document : null,
        window: typeof window !== 'undefined' ? window : null,
        console: typeof console !== 'undefined' ? console : { log: () => {}, error: () => {} },
        setTimeout: typeof setTimeout !== 'undefined' ? setTimeout : null,
        UIComponentsBuilders,
        UIComponentsValidators,
        UIComponentsProcessors,
        VirtualScroller: typeof VirtualScroller !== 'undefined' ? VirtualScroller : null,
        lazyLoader: typeof lazyLoader !== 'undefined' ? lazyLoader : null,
        performanceOptimizer: typeof performanceOptimizer !== 'undefined' ? performanceOptimizer : null,
        getValidAccessToken: typeof getValidAccessToken !== 'undefined' ? getValidAccessToken : null,
        loadMusicAnalytics: typeof loadMusicAnalytics !== 'undefined' ? loadMusicAnalytics : null,
        startRealTimeMonitoring: typeof startRealTimeMonitoring !== 'undefined' ? startRealTimeMonitoring : null
    };
}

// ===== GLOBAL STATE FOR VIEW MANAGEMENT =====
if (typeof isCompactView === 'undefined') {
    var isCompactView = false;
}

// ===== DELEGATION WRAPPER FUNCTIONS =====

/**
 * Display advanced music analytics with comprehensive insights
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function displayAdvancedMusicAnalytics(data) {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.displayAdvancedMusicAnalyticsCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.displayAdvancedMusicAnalyticsCore(dependencies, data);
        
        if (!result.success) {
            console.error('Failed to display analytics via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return displayAdvancedMusicAnalyticsLegacy(data);
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return displayAdvancedMusicAnalyticsLegacy(data);
}

/**
 * Display advanced music analytics - Legacy fallback implementation
 * Maintains original functionality when extracted classes are unavailable
 */
function displayAdvancedMusicAnalyticsLegacy(data) {
    // Store data globally for export functions
    window.currentAnalyticsData = data;
    const analyticsHtml = `
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
            
            ${data.currentPlayback ? `
            <div class="current-playback" style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);">
                <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${data.currentPlayback.is_playing ? '#fff' : '#ccc'}; ${data.currentPlayback.is_playing ? 'animation: pulse 1.5s infinite;' : ''}"></div>
                    🎧 Currently Playing
                </h3>
                <p style="margin: 5px 0; font-size: 16px;"><strong>${data.currentPlayback.item.name}</strong></p>
                <p style="margin: 5px 0; opacity: 0.9;">by ${data.currentPlayback.item.artists.map(a => a.name).join(', ')}</p>
                <p style="margin: 5px 0; opacity: 0.8; font-size: 14px;">${data.currentPlayback.is_playing ? 'Playing' : 'Paused'} on ${data.currentPlayback.device.name}</p>
            </div>
            ` : ''}
            
            <!-- Music Personality Card -->
            <div class="personality-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <h3 style="margin: 0 0 15px 0;">🎭 Your Music Personality</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div><strong>Type:</strong><br>${data.analytics.musicPersonality.explorationLevel}</div>
                    <div><strong>Diversity:</strong><br>${data.analytics.musicPersonality.diversityScore}</div>
                    <div><strong>Pattern:</strong><br>${data.analytics.musicPersonality.consistencyPattern}</div>
                    <div><strong>Mood:</strong><br>${data.analytics.moodAnalysis.mood}</div>
                </div>
                <div style="font-size: 14px; opacity: 0.9;">
                    You're a <strong>${data.analytics.musicPersonality.explorationLevel}</strong> listener with <strong>${data.analytics.musicPersonality.diversityScore.toLowerCase()}</strong> taste, 
                    preferring <strong>${data.analytics.musicPersonality.preferredListeningTime}</strong> sessions and showing <strong>${data.analytics.musicPersonality.socialListener.toLowerCase()}</strong> tendencies.
                </div>
            </div>
            
            <!-- Mood Analysis -->
            <div class="mood-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ff6b6b;">
                <h3 style="color: #333; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                    🧠 Mood Analysis
                    <span style="font-size: 12px; background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 10px;">${data.analytics.moodAnalysis.mood}</span>
                </h3>
                <div class="mood-bars" style="display: grid; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 80px; font-size: 14px;">Happiness:</span>
                        <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                            <div style="background: linear-gradient(90deg, #ff6b6b, #feca57); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.happiness}%; transition: width 0.5s ease;"></div>
                        </div>
                        <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.happiness)}%</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 80px; font-size: 14px;">Energy:</span>
                        <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                            <div style="background: linear-gradient(90deg, #48dbfb, #0abde3); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.energy}%; transition: width 0.5s ease;"></div>
                        </div>
                        <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.energy)}%</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 80px; font-size: 14px;">Danceability:</span>
                        <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                            <div style="background: linear-gradient(90deg, #ff9ff3, #f368e0); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.danceability}%; transition: width 0.5s ease;"></div>
                        </div>
                        <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.danceability)}%</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 80px; font-size: 14px;">Acoustic:</span>
                        <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                            <div style="background: linear-gradient(90deg, #7bed9f, #2ed573); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.acousticness}%; transition: width 0.5s ease;"></div>
                        </div>
                        <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.acousticness)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #1DB954; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <h3 style="color: #333; margin: 0 0 15px 0;">📊 Listening Stats</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div><strong>Recent Tracks:</strong> ${data.analytics.totalTracks}</div>
                        <div><strong>Unique Artists:</strong> ${data.analytics.uniqueArtists}</div>
                        <div><strong>Total Time:</strong> ${data.analytics.totalListeningTime} min</div>
                        <div><strong>Avg Track:</strong> ${Math.floor(data.analytics.averageTrackLength / 60)}:${(data.analytics.averageTrackLength % 60).toString().padStart(2, '0')}</div>
                        <div><strong>Skip Rate:</strong> ${data.analytics.listeningPatterns.skipRate}%</div>
                        <div><strong>Repeat Rate:</strong> ${data.analytics.listeningPatterns.repeatRate}%</div>
                    </div>
                </div>
                
                <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #4ecdc4; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <h3 style="color: #333; margin: 0 0 15px 0;">🕐 Time Patterns</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div><strong>Morning:</strong> ${data.analytics.listeningTimes.morning}</div>
                        <div><strong>Afternoon:</strong> ${data.analytics.listeningTimes.afternoon}</div>
                        <div><strong>Evening:</strong> ${data.analytics.listeningTimes.evening}</div>
                        <div><strong>Night:</strong> ${data.analytics.listeningTimes.night}</div>
                    </div>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center;">
                        <strong>Peak:</strong> ${data.analytics.listeningPatterns.peakHours.join(' & ')}
                    </div>
                </div>
                
                <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #ff6b6b; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <h3 style="color: #333; margin: 0 0 15px 0;">📈 Trend Analysis</h3>
                    <div style="text-align: center;">
                        <div style="margin-bottom: 10px;"><strong>Daily Average:</strong> ${Math.round(data.analytics.trendAnalysis.dailyAverage)} tracks</div>
                        <div style="margin-bottom: 10px;"><strong>Peak Day:</strong> ${new Date(data.analytics.trendAnalysis.peakDay[0]).toLocaleDateString()}</div>
                        <div><strong>Trend:</strong> 
                            <span style="color: ${data.analytics.trendAnalysis.trend === 'Increasing' ? '#2ed573' : data.analytics.trendAnalysis.trend === 'Decreasing' ? '#ff6b6b' : '#ffa502'};">
                                ${data.analytics.trendAnalysis.trend} ${data.analytics.trendAnalysis.trend === 'Increasing' ? '📈' : data.analytics.trendAnalysis.trend === 'Decreasing' ? '📉' : '📊'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Genre Distribution -->
            <div class="genre-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffa502;">
                <h3 style="color: #333; margin: 0 0 15px 0;">🎪 Genre Distribution</h3>
                <div class="genre-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                    ${data.analytics.topGenres.slice(0, 8).map((genre, index) => `
                        <div style="background: linear-gradient(135deg, ${getGenreColor(index)}); color: white; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px;">
                            <div style="font-weight: bold; margin-bottom: 5px;">${genre.genre}</div>
                            <div style="opacity: 0.9;">${genre.count} tracks</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
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
            
            <!-- Listening Behavior Insights -->
            <div class="behavior-insights" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0;">🔍 Listening Behavior Insights</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold;">${data.analytics.listeningPatterns.sessionLength}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Avg Session Length</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold;">${data.analytics.listeningPatterns.weekdayPreference}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Favorite Day</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold;">${Math.round((data.analytics.uniqueArtists / data.analytics.totalTracks) * 100)}%</div>
                        <div style="font-size: 12px; opacity: 0.9;">Artist Diversity</div>
                    </div>
                </div>
            </div>
            
            <!-- Advanced Controls -->
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
                    <button onclick="refreshAnalytics()" style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        🔄 Refresh Analytics
                    </button>
                    <button onclick="exportAdvancedAnalytics()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        📊 Export Data
                    </button>
                    <button onclick="generateInsightReport()" style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        📝 Generate Report
                    </button>
                    <button onclick="showPerformanceStats()" style="background: linear-gradient(135deg, #ffecd2, #fcb69f); color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        📊 Performance
                    </button>
                    <button onclick="clearCache()" style="background: linear-gradient(135deg, #ff9a9e, #fecfef); color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        🗑️ Clear Cache
                    </button>
                </div>
                <div>
                    <button onclick="toggleRealTimeMonitoring()" style="background-color: #ff6b6b; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-right: 10px;">
                        🎵 Live Monitor
                    </button>
                    <button onclick="exportAnalytics()" style="background-color: #333; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-right: 10px;">
                        📊 Export Data
                    </button>
                    <button onclick="generateShareableCard()" style="background-color: #1ed760; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500;">
                        📷 Share Card
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add analytics section after user info
    const userInfo = document.getElementById('userInfo');
    let analyticsDiv = document.getElementById('musicAnalytics');
    if (!analyticsDiv) {
        analyticsDiv = document.createElement('div');
        analyticsDiv.id = 'musicAnalytics';
        userInfo.parentNode.insertBefore(analyticsDiv, userInfo.nextSibling);
    }
    analyticsDiv.innerHTML = analyticsHtml;

    // Initialize virtual scrolling and performance optimizations
    setTimeout(() => {
        const trackContainer = document.getElementById('trackListContainer');
        const artistContainer = document.getElementById('artistListContainer');

        if (trackContainer && data.topTracks.length > 10) {
            enableVirtualScrolling(trackContainer, data.topTracks, renderTrackItem);
            console.log('📊 Virtual scrolling enabled for tracks');
        } else if (trackContainer) {
            // Render normally for small lists
            data.topTracks.forEach((track, index) => {
                trackContainer.appendChild(renderTrackItem(track, index));
            });
        }

        if (artistContainer && data.topArtists.length > 10) {
            enableVirtualScrolling(artistContainer, data.topArtists, renderArtistItem);
            console.log('📊 Virtual scrolling enabled for artists');
        } else if (artistContainer) {
            // Render normally for small lists
            data.topArtists.forEach((artist, index) => {
                artistContainer.appendChild(renderArtistItem(artist, index));
            });
        }

        // Enable lazy loading for other elements
        enableLazyLoading();

        // Show performance stats after loading
        const stats = performanceOptimizer.getCacheStats();
        console.log('📊 Performance Stats:', stats);
        console.log('⚡ Analytics rendering completed with performance optimizations');
    }, 100);
}

/**
 * Initialize virtual scrolling for large lists
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function initializeVirtualScrolling(container, items, renderFunction) {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.initializeVirtualScrollingCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.initializeVirtualScrollingCore(dependencies, container, items, renderFunction);
        
        if (!result.success) {
            console.error('Failed to initialize virtual scrolling via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return enableVirtualScrollingLegacy(container, items, renderFunction);
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return enableVirtualScrollingLegacy(container, items, renderFunction);
}

/**
 * Toggle analytics view between compact and detailed
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function toggleAnalyticsView() {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.toggleAnalyticsViewCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.toggleAnalyticsViewCore(dependencies);
        
        if (!result.success) {
            console.error('Failed to toggle analytics view via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return toggleAnalyticsViewLegacy();
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return toggleAnalyticsViewLegacy();
}

/**
 * Display user information
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function displayUserInfo(userData) {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.displayUserInfoCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.displayUserInfoCore(dependencies, userData);
        
        if (!result.success) {
            console.error('Failed to display user info via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return displayUserInfoLegacy(userData);
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return displayUserInfoLegacy(userData);
}

/**
 * Show result message with styling
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function showResult(message, type) {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.showResultCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.showResultCore(dependencies, message, type);
        
        if (!result.success) {
            console.error('Failed to show result via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return showResultLegacy(message, type);
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return showResultLegacy(message, type);
}

/**
 * Show update notification
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function showUpdateNotification() {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.showUpdateNotificationCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.showUpdateNotificationCore(dependencies);
        
        if (!result.success) {
            console.error('Failed to show update notification via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return showUpdateNotificationLegacy();
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return showUpdateNotificationLegacy();
}

// ===== UTILITY DELEGATION FUNCTIONS =====

/**
 * Get genre color
 * BACKWARD COMPATIBLE: Delegates to UIComponentsProcessors when available
 */
function getGenreColor(index) {
    // Delegate to extracted class if available
    if (UIComponentsProcessors && typeof UIComponentsProcessors.getGenreColor === 'function') {
        return UIComponentsProcessors.getGenreColor(index);
    }
    
    // Fallback to legacy implementation
    return getGenreColorLegacy(index);
}

/**
 * Enable virtual scrolling for container
 * BACKWARD COMPATIBLE: Delegates to UIComponentsCore when available
 */
function enableVirtualScrolling(container, items, renderFunction) {
    // Delegate to extracted class if available
    if (UIComponentsCore && typeof UIComponentsCore.enableVirtualScrollingCore === 'function') {
        const dependencies = ensureUIComponentsDependencies();
        const result = UIComponentsCore.enableVirtualScrollingCore(dependencies, container, items, renderFunction);
        
        if (!result.success) {
            console.error('Failed to enable virtual scrolling via UIComponentsCore:', result.error);
            // Fall back to legacy implementation
            return enableVirtualScrollingLegacy(container, items, renderFunction);
        }
        
        return result;
    }
    
    // Fallback to legacy implementation
    return enableVirtualScrollingLegacy(container, items, renderFunction);
}

/**
 * Render track item
 * BACKWARD COMPATIBLE: Delegates to UIComponentsBuilders when available
 */
function renderTrackItem(track, index) {
    // Delegate to extracted class if available
    if (UIComponentsBuilders && typeof UIComponentsBuilders.createTrackElement === 'function') {
        return UIComponentsBuilders.createTrackElement(track, index);
    }
    
    // Fallback to legacy implementation
    return renderTrackItemLegacy(track, index);
}

/**
 * Render artist item
 * BACKWARD COMPATIBLE: Delegates to UIComponentsBuilders when available
 */
function renderArtistItem(artist, index) {
    // Delegate to extracted class if available
    if (UIComponentsBuilders && typeof UIComponentsBuilders.createArtistElement === 'function') {
        return UIComponentsBuilders.createArtistElement(artist, index);
    }
    
    // Fallback to legacy implementation
    return renderArtistItemLegacy(artist, index);
}

/**
 * Enable lazy loading
 */
function enableLazyLoading() {
    if (typeof lazyLoader !== 'undefined' && lazyLoader.init) {
        lazyLoader.init();
    } else {
        console.log('⚡ Lazy loading not available, skipping optimization');
    }
}

// ===== LEGACY IMPLEMENTATIONS =====

// Virtual scrolling implementation for track lists
function enableVirtualScrolling(container, items, renderFunction) {
    if (!container || !items.length) return;

    const virtualScroller = new VirtualScroller(container, 70, 3);
    virtualScroller.setData(items, renderFunction);

    return virtualScroller;
}

// Render function for track items
function renderTrackItem(track, index) {
    const element = document.createElement('div');
    element.style.cssText = `
        display: flex; 
        align-items: center; 
        padding: 10px; 
        border-bottom: 1px solid #eee; 
        transition: background-color 0.2s ease;
    `;

    element.innerHTML = `
        <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #1DB954, #1ed760); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px;">${index + 1}</div>
        <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${track.name}</div>
            <div style="font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${track.artists.map(a => a.name).join(', ')}</div>
            <div style="font-size: 11px; color: #999; margin-top: 2px;">Popularity: ${track.popularity}/100</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
            <div style="font-size: 12px; color: #999;">${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</div>
            <div style="font-size: 10px; color: #1DB954; margin-top: 2px;">♪ ${track.explicit ? 'E' : 'C'}</div>
        </div>
    `;

    element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = '#f0f0f0';
    });

    element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = 'transparent';
    });

    return element;
}

// Render function for artist items
function renderArtistItem(artist, index) {
    const element = document.createElement('div');
    element.style.cssText = `
        display: flex; 
        align-items: center; 
        padding: 10px; 
        border-bottom: 1px solid #eee; 
        transition: background-color 0.2s ease;
    `;

    element.innerHTML = `
        <div style="width: 25px; height: 25px; border-radius: 50%; background: linear-gradient(135deg, #26de81, #20bf6b); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px;">${index + 1}</div>
        <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${artist.name}</div>
            <div style="font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${artist.genres.slice(0, 3).join(', ') || 'Various'}</div>
            <div style="font-size: 11px; color: #999; margin-top: 2px;">Popularity: ${artist.popularity}/100</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
            <div style="font-size: 11px; color: #999;">${artist.followers.total.toLocaleString()}</div>
            <div style="font-size: 10px; color: #26de81; margin-top: 2px;">followers</div>
        </div>
    `;

    element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = '#f0f0f0';
    });

    element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = 'transparent';
    });

    return element;
}

// Enable lazy loading for analytics sections
function enableLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach(element => {
        lazyLoader.observe(element);
    });
}

// Helper function to get genre colors
function getGenreColor(index) {
    const colors = [
        '#ff6b6b, #feca57',
        '#48dbfb, #0abde3',
        '#ff9ff3, #f368e0',
        '#7bed9f, #2ed573',
        '#a55eea, #8854d0',
        '#26de81, #20bf6b',
        '#fd79a8, #e84393',
        '#6c5ce7, #5f3dc4',
        '#ffeaa7, #fdcb6e',
        '#74b9ff, #0984e3'
    ];
    return colors[index % colors.length];
}

// Toggle analytics view (compact/detailed)
let isCompactView = false;
function toggleAnalyticsView() {
    isCompactView = !isCompactView;
    const container = document.querySelector('.analytics-container');
    if (container) {
        if (isCompactView) {
            container.style.fontSize = '12px';
            container.querySelectorAll('.analytics-card').forEach(card => {
                card.style.padding = '15px';
            });
        } else {
            container.style.fontSize = '14px';
            container.querySelectorAll('.analytics-card').forEach(card => {
                card.style.padding = '20px';
            });
        }
    }
}

function displayUserInfo(userData) {
    document.getElementById('userName').textContent = userData.display_name || 'N/A';
    document.getElementById('userEmail').textContent = userData.email || 'N/A';
    document.getElementById('userCountry').textContent = userData.country || 'N/A';
    document.getElementById('userProduct').textContent = userData.product || 'N/A';
    document.getElementById('userId').textContent = userData.id || 'N/A';
    document.getElementById('userInfo').style.display = 'block';

    // Automatically load music analytics after displaying user info
    const token = getValidAccessToken();
    if (token) {
        loadMusicAnalytics(token);
        // Start real-time monitoring
        setTimeout(() => {
            startRealTimeMonitoring();
        }, 2000); // Start after 2 seconds to let analytics load first
    }
}

// ===== ANALYTICS TEMPLATE COMPONENTS =====

// Generate current playback section
function generateCurrentPlaybackSection(data) {
    if (!data.currentPlayback) return '';
    
    return `
    <div class="current-playback" style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);">
        <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${data.currentPlayback.is_playing ? '#fff' : '#ccc'}; ${data.currentPlayback.is_playing ? 'animation: pulse 1.5s infinite;' : ''}"></div>
            🎧 Currently Playing
        </h3>
        <p style="margin: 5px 0; font-size: 16px;"><strong>${data.currentPlayback.item.name}</strong></p>
        <p style="margin: 5px 0; opacity: 0.9;">by ${data.currentPlayback.item.artists.map(a => a.name).join(', ')}</p>
        <p style="margin: 5px 0; opacity: 0.8; font-size: 14px;">${data.currentPlayback.is_playing ? 'Playing' : 'Paused'} on ${data.currentPlayback.device.name}</p>
    </div>
    `;
}

// Generate music personality card
function generateMusicPersonalityCard(data) {
    return `
    <div class="personality-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin: 0 0 15px 0;">🎭 Your Music Personality</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 15px;">
            <div><strong>Type:</strong><br>${data.analytics.musicPersonality.explorationLevel}</div>
            <div><strong>Diversity:</strong><br>${data.analytics.musicPersonality.diversityScore}</div>
            <div><strong>Pattern:</strong><br>${data.analytics.musicPersonality.consistencyPattern}</div>
            <div><strong>Mood:</strong><br>${data.analytics.moodAnalysis.mood}</div>
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
            You're a <strong>${data.analytics.musicPersonality.explorationLevel}</strong> listener with <strong>${data.analytics.musicPersonality.diversityScore.toLowerCase()}</strong> taste, 
            preferring <strong>${data.analytics.musicPersonality.preferredListeningTime}</strong> sessions and showing <strong>${data.analytics.musicPersonality.socialListener.toLowerCase()}</strong> tendencies.
        </div>
    </div>
    `;
}

// Generate mood analysis section
function generateMoodAnalysisSection(data) {
    return `
    <div class="mood-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ff6b6b;">
        <h3 style="color: #333; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
            🧠 Mood Analysis
            <span style="font-size: 12px; background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 10px;">${data.analytics.moodAnalysis.mood}</span>
        </h3>
        <div class="mood-bars" style="display: grid; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 80px; font-size: 14px;">Happiness:</span>
                <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                    <div style="background: linear-gradient(90deg, #ff6b6b, #feca57); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.happiness}%; transition: width 0.5s ease;"></div>
                </div>
                <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.happiness)}%</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 80px; font-size: 14px;">Energy:</span>
                <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                    <div style="background: linear-gradient(90deg, #48dbfb, #0abde3); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.energy}%; transition: width 0.5s ease;"></div>
                </div>
                <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.energy)}%</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 80px; font-size: 14px;">Danceability:</span>
                <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                    <div style="background: linear-gradient(90deg, #ff9ff3, #f368e0); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.danceability}%; transition: width 0.5s ease;"></div>
                </div>
                <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.danceability)}%</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 80px; font-size: 14px;">Acoustic:</span>
                <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 8px;">
                    <div style="background: linear-gradient(90deg, #7bed9f, #2ed573); height: 100%; border-radius: 10px; width: ${data.analytics.moodAnalysis.acousticness}%; transition: width 0.5s ease;"></div>
                </div>
                <span style="width: 40px; font-size: 12px;">${Math.round(data.analytics.moodAnalysis.acousticness)}%</span>
            </div>
        </div>
    </div>
    `;
}

// Generate analytics grid with stats cards
function generateAnalyticsGrid(data) {
    return `
    <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #1DB954; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">📊 Listening Stats</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Recent Tracks:</strong> ${data.analytics.totalTracks}</div>
                <div><strong>Unique Artists:</strong> ${data.analytics.uniqueArtists}</div>
                <div><strong>Total Time:</strong> ${data.analytics.totalListeningTime} min</div>
                <div><strong>Avg Track:</strong> ${Math.floor(data.analytics.averageTrackLength / 60)}:${(data.analytics.averageTrackLength % 60).toString().padStart(2, '0')}</div>
                <div><strong>Skip Rate:</strong> ${data.analytics.listeningPatterns.skipRate}%</div>
                <div><strong>Repeat Rate:</strong> ${data.analytics.listeningPatterns.repeatRate}%</div>
            </div>
        </div>
        
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #4ecdc4; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">🕐 Time Patterns</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Morning:</strong> ${data.analytics.listeningTimes.morning}</div>
                <div><strong>Afternoon:</strong> ${data.analytics.listeningTimes.afternoon}</div>
                <div><strong>Evening:</strong> ${data.analytics.listeningTimes.evening}</div>
                <div><strong>Night:</strong> ${data.analytics.listeningTimes.night}</div>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center;">
                <strong>Peak:</strong> ${data.analytics.listeningPatterns.peakHours.join(' & ')}
            </div>
        </div>
        
        <div class="analytics-card" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #ff6b6b; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h3 style="color: #333; margin: 0 0 15px 0;">📈 Trend Analysis</h3>
            <div style="text-align: center;">
                <div style="margin-bottom: 10px;"><strong>Daily Average:</strong> ${Math.round(data.analytics.trendAnalysis.dailyAverage)} tracks</div>
                <div style="margin-bottom: 10px;"><strong>Peak Day:</strong> ${new Date(data.analytics.trendAnalysis.peakDay[0]).toLocaleDateString()}</div>
                <div><strong>Trend:</strong> 
                    <span style="color: ${data.analytics.trendAnalysis.trend === 'Increasing' ? '#2ed573' : data.analytics.trendAnalysis.trend === 'Decreasing' ? '#ff6b6b' : '#ffa502'};">
                        ${data.analytics.trendAnalysis.trend} ${data.analytics.trendAnalysis.trend === 'Increasing' ? '📈' : data.analytics.trendAnalysis.trend === 'Decreasing' ? '📉' : '📊'}
                    </span>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Generate genre distribution section
function generateGenreDistribution(data) {
    return `
    <div class="genre-analysis" style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffa502;">
        <h3 style="color: #333; margin: 0 0 15px 0;">🎪 Genre Distribution</h3>
        <div class="genre-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
            ${data.analytics.topGenres.slice(0, 8).map((genre, index) => `
                <div style="background: linear-gradient(135deg, ${getGenreColor(index)}); color: white; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${genre.genre}</div>
                    <div style="opacity: 0.9;">${genre.count} tracks</div>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

// Generate top content sections (tracks and artists)
function generateTopContentSections(data) {
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

// Generate behavior insights section
function generateBehaviorInsights(data) {
    return `
    <div class="behavior-insights" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0;">🔍 Listening Behavior Insights</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${data.analytics.listeningPatterns.sessionLength}</div>
                <div style="font-size: 12px; opacity: 0.9;">Avg Session Length</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${data.analytics.listeningPatterns.weekdayPreference}</div>
                <div style="font-size: 12px; opacity: 0.9;">Favorite Day</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${Math.round((data.analytics.uniqueArtists / data.analytics.totalTracks) * 100)}%</div>
                <div style="font-size: 12px; opacity: 0.9;">Artist Diversity</div>
            </div>
        </div>
    </div>
    `;
}

// Generate advanced controls section
function generateAdvancedControls() {
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
            <button onclick="refreshAnalytics()" style="background: linear-gradient(135deg, #1DB954, #1ed760); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                🔄 Refresh Analytics
            </button>
            <button onclick="exportAdvancedAnalytics()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                📊 Export Data
            </button>
            <button onclick="generateInsightReport()" style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                📝 Generate Report
            </button>
            <button onclick="showPerformanceStats()" style="background: linear-gradient(135deg, #ffecd2, #fcb69f); color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                📊 Performance
            </button>
            <button onclick="clearCache()" style="background: linear-gradient(135deg, #ff9a9e, #fecfef); color: #333; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                🗑️ Clear Cache
            </button>
        </div>
        <div>
            <button onclick="toggleRealTimeMonitoring()" style="background-color: #ff6b6b; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-right: 10px;">
                🎵 Live Monitor
            </button>
            <button onclick="exportAnalytics()" style="background-color: #333; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-right: 10px;">
                📊 Export Data
            </button>
            <button onclick="generateShareableCard()" style="background-color: #1ed760; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500;">
                📷 Share Card
            </button>
        </div>
    </div>
    `;
}
// Show result message with enhanced accessibility
function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = 'result ' + type;
    resultDiv.style.display = 'block';

    // Enhanced accessibility
    resultDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    resultDiv.setAttribute('aria-live', 'polite');
    resultDiv.setAttribute('aria-atomic', 'true');

    // Add appropriate icon
    const icon = type === 'error' ? '❌ ' :
        type === 'success' ? '✅ ' :
            type === 'warning' ? '⚠️ ' : 'ℹ️ ';
    resultDiv.textContent = icon + message;

    // Scroll to result with better accessibility
    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });

    // Set focus for screen readers (only for errors)
    if (type === 'error') {
        resultDiv.setAttribute('tabindex', '-1');
        resultDiv.focus();

        // Remove tabindex after focus
        setTimeout(() => {
            resultDiv.removeAttribute('tabindex');
        }, 1000);
    }

    // Auto-hide non-error messages after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            if (resultDiv.style.display === 'block') {
                resultDiv.style.display = 'none';
            }
        }, 5000);
    }
}

// Service worker update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1DB954;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>🔄</span>
            <div>
                <strong>Update Available</strong><br>
                <span style="opacity: 0.9;">Click to reload with latest version</span>
            </div>
        </div>
    `;
    
    notification.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 10000);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    console.log('🔄 Update notification displayed');
}

// ===== LEGACY IMPLEMENTATIONS =====

/**
 * Enable virtual scrolling - Legacy implementation
 */
function enableVirtualScrollingLegacy(container, items, renderFunction) {
    if (typeof VirtualScroller !== 'undefined') {
        const virtualScroller = new VirtualScroller(container, {
            items: items,
            renderItem: renderFunction,
            itemHeight: 60,
            visibleItems: 10,
            buffer: 5
        });
        virtualScroller.init();
    } else {
        // Fallback to regular rendering for small lists
        items.forEach((item, index) => {
            const element = renderFunction(item, index);
            container.appendChild(element);
        });
    }
}

/**
 * Toggle analytics view - Legacy implementation
 */
function toggleAnalyticsViewLegacy() {
    isCompactView = !isCompactView;
    const container = document.querySelector('.analytics-container');
    if (container) {
        if (isCompactView) {
            container.style.fontSize = '12px';
            container.querySelectorAll('.analytics-card').forEach(card => {
                card.style.padding = '15px';
            });
        } else {
            container.style.fontSize = '14px';
            container.querySelectorAll('.analytics-card').forEach(card => {
                card.style.padding = '20px';
            });
        }
    }
}

/**
 * Display user info - Legacy implementation
 */
function displayUserInfoLegacy(userData) {
    document.getElementById('userName').textContent = userData.display_name || 'N/A';
    document.getElementById('userEmail').textContent = userData.email || 'N/A';
    document.getElementById('userCountry').textContent = userData.country || 'N/A';
    document.getElementById('userProduct').textContent = userData.product || 'N/A';
    document.getElementById('userId').textContent = userData.id || 'N/A';
    document.getElementById('userInfo').style.display = 'block';

    // Automatically load music analytics after displaying user info
    const token = getValidAccessToken();
    if (token) {
        loadMusicAnalytics(token);
        // Start real-time monitoring
        setTimeout(() => {
            startRealTimeMonitoring();
        }, 2000); // Start after 2 seconds to let analytics load first
    }
}

/**
 * Show result message - Legacy implementation
 */
function showResultLegacy(message, type) {
    const resultContainer = document.getElementById('result');
    if (!resultContainer) return;

    resultContainer.textContent = message;
    resultContainer.className = `result ${type}`;
    resultContainer.style.display = 'block';

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            resultContainer.style.display = 'none';
        }, 5000);
    }
}

/**
 * Show update notification - Legacy implementation
 */
function showUpdateNotificationLegacy() {
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'updateNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1DB954;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>🔄</span>
            <div>
                <strong>Update Available</strong><br>
                <span style="opacity: 0.9;">Click to reload with latest version</span>
            </div>
        </div>
    `;
    
    notification.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 10000);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    console.log('🔄 Update notification displayed (legacy)');
}

/**
 * Get genre color - Legacy implementation
 */
function getGenreColorLegacy(index) {
    const colors = [
        '#ff6b6b, #feca57',
        '#48dbfb, #0abde3',
        '#ff9ff3, #f368e0',
        '#7bed9f, #2ed573',
        '#a55eea, #8854d0',
        '#26de81, #20bf6b',
        '#fd79a8, #e84393',
        '#6c5ce7, #5f3dc4',
        '#ffeaa7, #fdcb6e',
        '#74b9ff, #0984e3'
    ];
    return colors[index % colors.length];
}

/**
 * Render track item - Legacy implementation
 */
function renderTrackItemLegacy(track, index) {
    const trackElement = document.createElement('div');
    trackElement.className = 'track-item';
    trackElement.style.cssText = `
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s ease;
        cursor: pointer;
    `;
    
    trackElement.innerHTML = `
        <div style="margin-right: 15px; font-weight: bold; color: #1DB954; min-width: 20px;">
            ${index + 1}
        </div>
        <div style="flex: 1;">
            <div style="font-weight: 500; margin-bottom: 4px;">
                ${track.name}
            </div>
            <div style="font-size: 12px; color: #666;">
                ${track.artists.map(a => a.name).join(', ')} • ${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
            </div>
        </div>
    `;
    
    trackElement.addEventListener('mouseover', () => {
        trackElement.style.backgroundColor = '#f5f5f5';
    });
    
    trackElement.addEventListener('mouseout', () => {
        trackElement.style.backgroundColor = 'transparent';
    });
    
    return trackElement;
}

/**
 * Render artist item - Legacy implementation
 */
function renderArtistItemLegacy(artist, index) {
    const artistElement = document.createElement('div');
    artistElement.className = 'artist-item';
    artistElement.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s ease;
        cursor: pointer;
    `;
    
    artistElement.innerHTML = `
        <div style="margin-right: 15px; font-weight: bold; color: #1DB954; min-width: 20px;">
            ${index + 1}
        </div>
        <div style="margin-right: 15px;">
            <img src="${artist.images[0]?.url || '/api/placeholder/50/50'}" 
                 alt="${artist.name}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
        </div>
        <div style="flex: 1;">
            <div style="font-weight: 500; margin-bottom: 4px;">
                ${artist.name}
            </div>
            <div style="font-size: 12px; color: #666;">
                ${artist.genres.slice(0, 2).join(', ')} • ${artist.followers.total.toLocaleString()} followers
            </div>
        </div>
    `;
    
    artistElement.addEventListener('mouseover', () => {
        artistElement.style.backgroundColor = '#f5f5f5';
    });
    
    artistElement.addEventListener('mouseout', () => {
        artistElement.style.backgroundColor = 'transparent';
    });
    
    return artistElement;
}

// ===== BACKWARD COMPATIBILITY EXPORTS =====

// Ensure functions are available globally for backward compatibility
if (typeof window !== 'undefined') {
    window.displayAdvancedMusicAnalytics = displayAdvancedMusicAnalytics;
    window.initializeVirtualScrolling = initializeVirtualScrolling;
    window.toggleAnalyticsView = toggleAnalyticsView;
    window.displayUserInfo = displayUserInfo;
    window.showResult = showResult;
    window.showUpdateNotification = showUpdateNotification;
    window.getGenreColor = getGenreColor;
    window.enableVirtualScrolling = enableVirtualScrolling;
    window.renderTrackItem = renderTrackItem;
    window.renderArtistItem = renderArtistItem;
    window.enableLazyLoading = enableLazyLoading;
}

console.log('✅ UI Components delegation wrapper loaded successfully');
console.log('🔄 Using ' + (UIComponentsCore ? 'extracted classes' : 'legacy implementations') + ' for UI components');
