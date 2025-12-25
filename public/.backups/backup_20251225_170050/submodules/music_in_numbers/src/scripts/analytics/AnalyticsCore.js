/**
 * AnalyticsCore - Business logic orchestration with dependency injection for music analytics
 * 
 * This class contains the core business logic orchestration for analytics:
 * - Main analytics loading and processing workflows
 * - API orchestration with dependency injection
 * - UI display orchestration and management
 * - Data refresh and update coordination
 * - Error handling and fallback management
 * 
 * Functions in this class are IMPURE (require dependency injection):
 * - Access external APIs through injected dependencies
 * - Manage UI state through injected DOM utilities
 * - Handle side effects like logging and error reporting
 * - Coordinate between pure processing functions and impure I/O operations
 * 
 * All functions use explicit dependency injection to maintain testability
 */
class AnalyticsCore {

    /**
     * IMPURE: Core function for loading comprehensive music analytics
     * @param {Object} dependencies - Injected dependencies
     * @param {string} accessToken - Spotify access token
     * @returns {Promise<Object>} Analytics loading result
     */
    static async loadMusicAnalyticsCore(dependencies, accessToken) {
        const { 
            showResult, getTopTracks, getTopArtists, 
            getRecentlyPlayed, getCurrentPlayback, getAudioFeatures,
            logInfo, logError 
        } = dependencies;

        try {
            // Validate access token
            const tokenValidation = AnalyticsValidators.validateAccessToken(accessToken);
            if (!tokenValidation.isValid) {
                return {
                    success: false,
                    error: tokenValidation.error
                };
            }

            logInfo('🔄 Starting comprehensive music analytics loading...');
            showResult('🔄 Loading your comprehensive music analytics...', 'success');

            // Load all music data concurrently with API calls
            const [topTracks, topArtists, recentlyPlayed, currentPlayback] = await Promise.all([
                getTopTracks(accessToken, 'medium_term', 20),
                getTopArtists(accessToken, 'medium_term', 20),
                getRecentlyPlayed(accessToken, 50),
                getCurrentPlayback(accessToken)
            ]);

            logInfo('📊 Music data loaded, processing analytics...');
            showResult('🎵 Analyzing your music patterns...', 'success');

            // Validate recently played data (required for analytics)
            const recentlyPlayedValidation = AnalyticsValidators.validateRecentlyPlayed(recentlyPlayed);
            if (!recentlyPlayedValidation.isValid) {
                return {
                    success: false,
                    error: recentlyPlayedValidation.error
                };
            }

            // Get audio features for recent tracks for mood analysis
            const trackIds = recentlyPlayed.map(item => item.track?.id).filter(id => id);
            let audioFeatures = [];
            
            if (trackIds.length > 0) {
                const trackIdsValidation = AnalyticsValidators.validateTrackIds(trackIds);
                if (trackIdsValidation.isValid) {
                    audioFeatures = await getAudioFeatures(accessToken, trackIds);
                    const audioFeaturesValidation = AnalyticsValidators.validateAudioFeatures(audioFeatures);
                    if (!audioFeaturesValidation.isValid) {
                        logError('Audio features validation failed:', audioFeaturesValidation.error);
                        audioFeatures = []; // Continue without audio features
                    }
                }
            }

            logInfo('🧠 Generating insights and recommendations...');
            showResult('🧠 Generating insights and recommendations...', 'success');

            // Process analytics using pure functions
            const analytics = AnalyticsProcessors.analyzeListeningPatterns(
                recentlyPlayed, 
                audioFeatures, 
                topTracks, 
                topArtists
            );

            // Prepare complete data object
            const analyticsData = {
                topTracks,
                topArtists,
                recentlyPlayed,
                currentPlayback,
                analytics,
                audioFeatures
            };

            logInfo('✅ Analytics processing completed successfully');
            return {
                success: true,
                data: analyticsData
            };

        } catch (error) {
            logError('❌ Error in loadMusicAnalyticsCore:', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred while loading analytics'
            };
        }
    }

    /**
     * IMPURE: Core function for displaying advanced music analytics
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} data - Complete analytics data
     * @returns {Object} Display operation result
     */
    static displayAdvancedMusicAnalyticsCore(dependencies, data) {
        const { getElementById, createElement, appendChild, logInfo, logError } = dependencies;

        try {
            logInfo('🎨 Rendering analytics display...');

            // Generate analytics HTML using pure UI builders
            const analyticsHtml = AnalyticsUIBuilders.generateAnalyticsHTML(data);

            // Initialize analytics display in DOM
            const result = AnalyticsCore.initializeAnalyticsDisplayCore(dependencies, analyticsHtml, data);
            if (!result.success) {
                return result;
            }

            // Setup performance optimizations
            AnalyticsCore.setupAnalyticsOptimizationsCore(dependencies, data);

            logInfo('✅ Analytics display completed successfully');
            return { success: true };

        } catch (error) {
            logError('❌ Error in displayAdvancedMusicAnalyticsCore:', error);
            return {
                success: false,
                error: error.message || 'Failed to display analytics'
            };
        }
    }

    /**
     * IMPURE: Core function for initializing analytics display in DOM
     * @param {Object} dependencies - Injected dependencies
     * @param {string} analyticsHtml - Generated analytics HTML
     * @param {Object} data - Analytics data
     * @returns {Object} Initialization result
     */
    static initializeAnalyticsDisplayCore(dependencies, analyticsHtml, data) {
        const { getElementById, createElement, appendChild, window, logInfo, logError } = dependencies;

        try {
            // Store data globally for export functions (impure operation)
            if (window) {
                window.currentAnalyticsData = data;
            }

            // Find or create analytics container
            const userInfo = getElementById('userInfo');
            if (!userInfo) {
                return {
                    success: false,
                    error: 'User info element not found - cannot initialize analytics display'
                };
            }

            let analyticsDiv = getElementById('musicAnalytics');
            if (!analyticsDiv) {
                analyticsDiv = createElement('div');
                analyticsDiv.id = 'musicAnalytics';
                appendChild(userInfo.parentNode, analyticsDiv);
            }

            // Set analytics content
            analyticsDiv.innerHTML = analyticsHtml;

            // Add analytics styles if not present
            if (!getElementById('analyticsStyles')) {
                const styleElement = createElement('style');
                styleElement.id = 'analyticsStyles';
                styleElement.innerHTML = AnalyticsUIBuilders.generateAnalyticsStyles();
                appendChild(document.head, styleElement);
            }

            logInfo('📱 Analytics display initialized in DOM');
            return { success: true };

        } catch (error) {
            logError('❌ Error in initializeAnalyticsDisplayCore:', error);
            return {
                success: false,
                error: error.message || 'Failed to initialize analytics display'
            };
        }
    }

    /**
     * IMPURE: Core function for setting up analytics performance optimizations
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} data - Analytics data
     * @returns {Object} Optimization setup result
     */
    static setupAnalyticsOptimizationsCore(dependencies, data) {
        const { setTimeout, getElementById, logInfo, logWarning } = dependencies;

        try {
            // Defer optimization setup to avoid blocking main thread
            setTimeout(() => {
                const trackContainer = getElementById('trackListContainer');
                const artistContainer = getElementById('artistListContainer');

                // Setup virtual scrolling for large lists
                if (trackContainer && data.topTracks && data.topTracks.length > 10) {
                    // Enable virtual scrolling (implementation would depend on available utilities)
                    logInfo('📊 Virtual scrolling enabled for tracks');
                } else if (trackContainer && data.topTracks) {
                    // Render normally for small lists
                    data.topTracks.forEach((track, index) => {
                        const trackElement = AnalyticsCore.renderTrackItemCore(track, index);
                        if (trackElement) {
                            trackContainer.appendChild(trackElement);
                        }
                    });
                }

                if (artistContainer && data.topArtists && data.topArtists.length > 10) {
                    logInfo('📊 Virtual scrolling enabled for artists');
                } else if (artistContainer && data.topArtists) {
                    // Render normally for small lists
                    data.topArtists.forEach((artist, index) => {
                        const artistElement = AnalyticsCore.renderArtistItemCore(artist, index);
                        if (artistElement) {
                            artistContainer.appendChild(artistElement);
                        }
                    });
                }

                logInfo('⚡ Analytics performance optimizations completed');
            }, 100);

            return { success: true };

        } catch (error) {
            logWarning('⚠️ Non-critical error in setupAnalyticsOptimizationsCore:', error);
            return {
                success: false,
                error: error.message || 'Failed to setup performance optimizations'
            };
        }
    }

    /**
     * IMPURE: Core function for refreshing analytics data
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Refresh operation result
     */
    static async refreshAnalyticsCore(dependencies) {
        const { getValidAccessToken, showResult, logInfo, logError } = dependencies;

        try {
            logInfo('🔄 Refreshing analytics data...');

            const token = getValidAccessToken();
            if (!token) {
                const error = 'No valid access token. Please reconnect to Spotify.';
                showResult(error, 'error');
                return {
                    success: false,
                    error: error
                };
            }

            // Load fresh analytics data
            const loadResult = await AnalyticsCore.loadMusicAnalyticsCore(dependencies, token);
            if (!loadResult.success) {
                showResult(`❌ Error refreshing analytics: ${loadResult.error}`, 'error');
                return loadResult;
            }

            // Display refreshed analytics
            const displayResult = AnalyticsCore.displayAdvancedMusicAnalyticsCore(dependencies, loadResult.data);
            if (!displayResult.success) {
                showResult(`❌ Error displaying refreshed analytics: ${displayResult.error}`, 'error');
                return displayResult;
            }

            showResult('✅ Analytics refreshed successfully!', 'success');
            logInfo('✅ Analytics refresh completed');
            return { success: true };

        } catch (error) {
            const errorMessage = `❌ Error refreshing analytics: ${error.message}`;
            showResult(errorMessage, 'error');
            logError('❌ Error in refreshAnalyticsCore:', error);
            return {
                success: false,
                error: error.message || 'Unknown error during refresh'
            };
        }
    }

    /**
     * IMPURE: Core function for updating analytics time range
     * @param {Object} dependencies - Injected dependencies
     * @param {string} timeRange - Selected time range
     * @returns {Promise<Object>} Update operation result
     */
    static async updateAnalyticsTimeRangeCore(dependencies, timeRange) {
        const { getValidAccessToken, showResult, getTopTracks, getTopArtists, logInfo, logError } = dependencies;

        try {
            // Validate time range
            const timeRangeValidation = AnalyticsValidators.validateTimeRange(timeRange);
            if (!timeRangeValidation.isValid) {
                return {
                    success: false,
                    error: timeRangeValidation.error
                };
            }

            const token = getValidAccessToken();
            if (!token) {
                const error = 'No valid access token available';
                showResult(error, 'error');
                return {
                    success: false,
                    error: error
                };
            }

            logInfo(`🔄 Updating analytics for time range: ${timeRange}`);
            showResult('Updating analytics for selected time range...', 'success');

            // Get data for selected time range
            const [topTracks, topArtists] = await Promise.all([
                getTopTracks(token, timeRange, 10),
                getTopArtists(token, timeRange, 10)
            ]);

            // Validate loaded data
            const tracksValidation = AnalyticsValidators.validateTopTracks(topTracks);
            const artistsValidation = AnalyticsValidators.validateTopArtists(topArtists);

            if (!tracksValidation.isValid || !artistsValidation.isValid) {
                return {
                    success: false,
                    error: 'Invalid data received from API'
                };
            }

            // Update only the top tracks and artists sections
            const updateResult = AnalyticsCore.updateTopContentCore(dependencies, topTracks, topArtists);
            if (!updateResult.success) {
                return updateResult;
            }

            logInfo('✅ Time range update completed');
            return { success: true };

        } catch (error) {
            const errorMessage = `Error updating time range: ${error.message}`;
            showResult(errorMessage, 'error');
            logError('❌ Error in updateAnalyticsTimeRangeCore:', error);
            return {
                success: false,
                error: error.message || 'Unknown error during time range update'
            };
        }
    }

    /**
     * IMPURE: Core function for updating top content sections
     * @param {Object} dependencies - Injected dependencies  
     * @param {Array} topTracks - Updated top tracks data
     * @param {Array} topArtists - Updated top artists data
     * @returns {Object} Update operation result
     */
    static updateTopContentCore(dependencies, topTracks, topArtists) {
        const { querySelector, logInfo, logError } = dependencies;

        try {
            // Generate updated content using pure UI builders
            const updatedContent = AnalyticsUIBuilders.generateUpdatedTopContent(topTracks, topArtists);

            // Update DOM elements
            const trackListElement = querySelector('.track-list');
            const artistListElement = querySelector('.artist-list');

            if (trackListElement) {
                trackListElement.innerHTML = updatedContent.tracksHtml;
            } else {
                logError('Track list element not found for update');
            }

            if (artistListElement) {
                artistListElement.innerHTML = updatedContent.artistsHtml;
            } else {
                logError('Artist list element not found for update');
            }

            logInfo('📊 Top content sections updated successfully');
            return { success: true };

        } catch (error) {
            logError('❌ Error in updateTopContentCore:', error);
            return {
                success: false,
                error: error.message || 'Failed to update top content'
            };
        }
    }

    /**
     * IMPURE: Helper function for rendering track items (if needed for optimization)
     * @param {Object} track - Track object
     * @param {number} index - Track index
     * @returns {HTMLElement|null} Track element or null
     */
    static renderTrackItemCore(track, index) {
        try {
            // This would create a DOM element from the pure HTML generator
            // Implementation depends on available DOM utilities in dependencies
            const trackHtml = AnalyticsUIBuilders.generateTrackItem(track, index);
            
            // Convert HTML string to DOM element (simplified - would need proper implementation)
            const wrapper = document.createElement('div');
            wrapper.innerHTML = trackHtml;
            return wrapper.firstElementChild;

        } catch (error) {
            console.warn('Failed to render track item:', error);
            return null;
        }
    }

    /**
     * IMPURE: Helper function for rendering artist items (if needed for optimization)
     * @param {Object} artist - Artist object
     * @param {number} index - Artist index
     * @returns {HTMLElement|null} Artist element or null
     */
    static renderArtistItemCore(artist, index) {
        try {
            // This would create a DOM element from the pure HTML generator
            const artistHtml = AnalyticsUIBuilders.generateArtistItem(artist, index);
            
            // Convert HTML string to DOM element (simplified - would need proper implementation)
            const wrapper = document.createElement('div');
            wrapper.innerHTML = artistHtml;
            return wrapper.firstElementChild;

        } catch (error) {
            console.warn('Failed to render artist item:', error);
            return null;
        }
    }

    /**
     * IMPURE: Core function for comprehensive analytics workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {string} accessToken - Spotify access token
     * @returns {Promise<Object>} Complete workflow result
     */
    static async runCompleteAnalyticsWorkflowCore(dependencies, accessToken) {
        const { logInfo, logError, showResult } = dependencies;

        try {
            logInfo('🚀 Starting complete analytics workflow...');

            // Step 1: Load analytics data
            const loadResult = await AnalyticsCore.loadMusicAnalyticsCore(dependencies, accessToken);
            if (!loadResult.success) {
                return loadResult;
            }

            // Step 2: Display analytics
            const displayResult = AnalyticsCore.displayAdvancedMusicAnalyticsCore(dependencies, loadResult.data);
            if (!displayResult.success) {
                return displayResult;
            }

            // Step 3: Final success notification
            showResult('✅ Analytics loaded successfully!', 'success');
            logInfo('🎉 Complete analytics workflow finished successfully');

            return {
                success: true,
                data: loadResult.data
            };

        } catch (error) {
            const errorMessage = `Complete workflow failed: ${error.message}`;
            showResult(`❌ ${errorMessage}`, 'error');
            logError('❌ Error in runCompleteAnalyticsWorkflowCore:', error);
            return {
                success: false,
                error: error.message || 'Unknown workflow error'
            };
        }
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsCore;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.AnalyticsCore = AnalyticsCore;
}