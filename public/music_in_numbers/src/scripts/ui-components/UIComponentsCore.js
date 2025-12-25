/**
 * UI Components Core - Business Logic Orchestration with Dependency Injection
 * Music in Numbers - Professional UI Component Architecture
 * 
 * This class contains dependency-injected orchestration methods for UI component workflows,
 * display coordination, and business logic. All methods use explicit dependency injection.
 * 
 * Pattern: "Imperative Shell" - Orchestration functions with dependency injection
 * Dependencies: DOM APIs, UI utility functions, performance APIs (all injected)
 * 
 * @class UIComponentsCore
 */
class UIComponentsCore {
    
    /**
     * Display advanced music analytics with comprehensive insights (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} data - Analytics data to display
     * @returns {Object} Operation result with success status
     */
    static displayAdvancedMusicAnalyticsCore(dependencies, data) {
        const {
            document,
            window,
            UIComponentsBuilders,
            UIComponentsValidators,
            setTimeout,
            console,
            performanceOptimizer,
            VirtualScroller,
            lazyLoader
        } = dependencies;

        try {
            // Validate input data
            if (UIComponentsValidators) {
                const validation = UIComponentsValidators.validateAnalyticsData(data);
                if (!validation.isValid) {
                    console.error('Analytics data validation failed:', validation.error);
                    return { success: false, error: validation.error };
                }
            }

            // Store data globally for export functions
            if (window) {
                window.currentAnalyticsData = data;
            }

            // Generate analytics HTML
            const analyticsHtml = UIComponentsBuilders 
                ? UIComponentsBuilders.generateAnalyticsHTML(data)
                : this.fallbackGenerateAnalyticsHTML(data);

            // Find or create analytics container
            const userInfo = document.getElementById('userInfo');
            if (!userInfo) {
                console.error('User info element not found');
                return { success: false, error: 'User info element not found' };
            }

            let analyticsDiv = document.getElementById('musicAnalytics');
            if (!analyticsDiv) {
                analyticsDiv = document.createElement('div');
                analyticsDiv.id = 'musicAnalytics';
                userInfo.parentNode.insertBefore(analyticsDiv, userInfo.nextSibling);
            }
            analyticsDiv.innerHTML = analyticsHtml;

            // Initialize virtual scrolling and performance optimizations
            if (setTimeout) {
                setTimeout(() => {
                    this.initializeVirtualScrollingCore(dependencies, data);
                    this.enableLazyLoadingCore(dependencies);
                    this.logPerformanceStatsCore(dependencies);
                }, 100);
            }

            return { success: true, message: 'Analytics displayed successfully' };
        } catch (error) {
            console.error('Error displaying analytics:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Initialize virtual scrolling for track and artist lists (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} data - Analytics data containing tracks and artists
     * @returns {Object} Operation result
     */
    static initializeVirtualScrollingCore(dependencies, data) {
        const { document, console, VirtualScroller, UIComponentsBuilders } = dependencies;

        try {
            const trackContainer = document.getElementById('trackListContainer');
            const artistContainer = document.getElementById('artistListContainer');

            // Initialize track virtual scrolling
            if (trackContainer && data.topTracks && data.topTracks.length > 10) {
                if (VirtualScroller) {
                    const virtualScroller = new VirtualScroller(trackContainer, 70, 3);
                    const renderFunction = UIComponentsBuilders 
                        ? (track, index) => UIComponentsBuilders.createTrackElement(track, index)
                        : this.fallbackRenderTrackItem;
                    virtualScroller.setData(data.topTracks, renderFunction);
                    console.log('📊 Virtual scrolling enabled for tracks');
                } else {
                    console.warn('VirtualScroller not available, falling back to normal rendering');
                    this.renderTrackListNormallyCore(dependencies, trackContainer, data.topTracks);
                }
            } else if (trackContainer && data.topTracks) {
                this.renderTrackListNormallyCore(dependencies, trackContainer, data.topTracks);
            }

            // Initialize artist virtual scrolling
            if (artistContainer && data.topArtists && data.topArtists.length > 10) {
                if (VirtualScroller) {
                    const virtualScroller = new VirtualScroller(artistContainer, 70, 3);
                    const renderFunction = UIComponentsBuilders 
                        ? (artist, index) => UIComponentsBuilders.createArtistElement(artist, index)
                        : this.fallbackRenderArtistItem;
                    virtualScroller.setData(data.topArtists, renderFunction);
                    console.log('📊 Virtual scrolling enabled for artists');
                } else {
                    console.warn('VirtualScroller not available, falling back to normal rendering');
                    this.renderArtistListNormallyCore(dependencies, artistContainer, data.topArtists);
                }
            } else if (artistContainer && data.topArtists) {
                this.renderArtistListNormallyCore(dependencies, artistContainer, data.topArtists);
            }

            return { success: true, message: 'Virtual scrolling initialized' };
        } catch (error) {
            console.error('Error initializing virtual scrolling:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Render track list normally without virtual scrolling
     * @param {Object} dependencies - Injected dependencies
     * @param {Element} container - Track container element
     * @param {Array} tracks - Track data array
     */
    static renderTrackListNormallyCore(dependencies, container, tracks) {
        const { UIComponentsBuilders } = dependencies;
        
        tracks.forEach((track, index) => {
            const trackElement = UIComponentsBuilders 
                ? UIComponentsBuilders.createTrackElement(track, index)
                : this.fallbackRenderTrackItem(track, index);
            container.appendChild(trackElement);
        });
    }

    /**
     * Render artist list normally without virtual scrolling
     * @param {Object} dependencies - Injected dependencies
     * @param {Element} container - Artist container element
     * @param {Array} artists - Artist data array
     */
    static renderArtistListNormallyCore(dependencies, container, artists) {
        const { UIComponentsBuilders } = dependencies;
        
        artists.forEach((artist, index) => {
            const artistElement = UIComponentsBuilders 
                ? UIComponentsBuilders.createArtistElement(artist, index)
                : this.fallbackRenderArtistItem(artist, index);
            container.appendChild(artistElement);
        });
    }

    /**
     * Enable lazy loading for analytics sections (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @returns {Object} Operation result
     */
    static enableLazyLoadingCore(dependencies) {
        const { document, lazyLoader } = dependencies;

        try {
            if (!lazyLoader) {
                return { success: false, error: 'Lazy loader not available' };
            }

            const lazyElements = document.querySelectorAll('[data-lazy]');
            lazyElements.forEach(element => {
                lazyLoader.observe(element);
            });

            return { success: true, message: `Lazy loading enabled for ${lazyElements.length} elements` };
        } catch (error) {
            console.error('Error enabling lazy loading:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Log performance statistics (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     */
    static logPerformanceStatsCore(dependencies) {
        const { console, performanceOptimizer } = dependencies;

        if (performanceOptimizer) {
            const stats = performanceOptimizer.getCacheStats();
            console.log('📊 Performance Stats:', stats);
        }
        console.log('⚡ Analytics rendering completed with performance optimizations');
    }

    /**
     * Display user information with automatic analytics loading (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} userData - User data to display
     * @returns {Object} Operation result
     */
    static displayUserInfoCore(dependencies, userData) {
        const {
            document,
            UIComponentsValidators,
            getValidAccessToken,
            loadMusicAnalytics,
            startRealTimeMonitoring,
            setTimeout,
            console
        } = dependencies;

        try {
            // Validate user data
            if (UIComponentsValidators) {
                const validation = UIComponentsValidators.validateUserData(userData);
                if (!validation.isValid) {
                    console.error('User data validation failed:', validation.error);
                    return { success: false, error: validation.error };
                }
            }

            // Update user info elements
            const userElements = [
                { id: 'userName', value: userData.display_name || 'N/A' },
                { id: 'userEmail', value: userData.email || 'N/A' },
                { id: 'userCountry', value: userData.country || 'N/A' },
                { id: 'userProduct', value: userData.product || 'N/A' },
                { id: 'userId', value: userData.id || 'N/A' }
            ];

            userElements.forEach(({ id, value }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });

            // Show user info container
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.style.display = 'block';
            }

            // Automatically load music analytics after displaying user info
            if (getValidAccessToken && loadMusicAnalytics) {
                const token = getValidAccessToken();
                if (token) {
                    loadMusicAnalytics(token);
                    
                    // Start real-time monitoring after delay
                    if (setTimeout && startRealTimeMonitoring) {
                        setTimeout(() => {
                            startRealTimeMonitoring();
                        }, 2000);
                    }
                }
            }

            return { success: true, message: 'User info displayed and analytics initiated' };
        } catch (error) {
            console.error('Error displaying user info:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Show result message with enhanced accessibility (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {string} message - Message to display
     * @param {string} type - Message type (error, success, warning, info)
     * @returns {Object} Operation result
     */
    static showResultCore(dependencies, message, type) {
        const {
            document,
            UIComponentsValidators,
            UIComponentsProcessors,
            setTimeout,
            console
        } = dependencies;

        try {
            // Validate message parameters
            if (UIComponentsValidators) {
                const validation = UIComponentsValidators.validateResultMessage(message, type);
                if (!validation.isValid) {
                    console.error('Result message validation failed:', validation.error);
                    return { success: false, error: validation.error };
                }
            }

            const resultDiv = document.getElementById('result');
            if (!resultDiv) {
                console.error('Result element not found');
                return { success: false, error: 'Result element not found' };
            }

            // Process message type for styling
            let messageInfo;
            if (UIComponentsProcessors) {
                messageInfo = UIComponentsProcessors.processMessageType(type);
            } else {
                messageInfo = { icon: 'ℹ️', role: 'status', color: '#48dbfb', priority: 'low' };
            }

            // Configure result element
            resultDiv.textContent = messageInfo.icon + ' ' + message;
            resultDiv.className = 'result ' + type;
            resultDiv.style.display = 'block';
            resultDiv.setAttribute('role', messageInfo.role);
            resultDiv.setAttribute('aria-live', 'polite');
            resultDiv.setAttribute('aria-atomic', 'true');

            // Scroll to result with better accessibility
            resultDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });

            // Set focus for screen readers (only for errors)
            if (type === 'error') {
                resultDiv.setAttribute('tabindex', '-1');
                resultDiv.focus();

                setTimeout(() => {
                    resultDiv.removeAttribute('tabindex');
                }, 1000);
            }

            // Auto-hide non-error messages after 5 seconds
            if (type !== 'error' && setTimeout) {
                setTimeout(() => {
                    if (resultDiv.style.display === 'block') {
                        resultDiv.style.display = 'none';
                    }
                }, 5000);
            }

            return { success: true, message: 'Result message displayed successfully' };
        } catch (error) {
            console.error('Error showing result:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Show service worker update notification (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @returns {Object} Operation result
     */
    static showUpdateNotificationCore(dependencies) {
        const { document, window, setTimeout, console } = dependencies;

        try {
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
            
            // Add click handler for reload
            notification.addEventListener('click', () => {
                if (window && window.location) {
                    window.location.reload();
                }
            });
            
            // Auto-remove after 10 seconds
            if (setTimeout) {
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    }
                }, 10000);
            }
            
            document.body.appendChild(notification);
            
            // Animate in
            if (setTimeout) {
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
            }
            
            console.log('🔄 Update notification displayed');
            return { success: true, message: 'Update notification displayed' };
        } catch (error) {
            console.error('Error showing update notification:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Toggle analytics view between compact and detailed (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {boolean} currentCompactState - Current compact view state
     * @returns {Object} Operation result with new state
     */
    static toggleAnalyticsViewCore(dependencies, currentCompactState) {
        const { document, UIComponentsProcessors } = dependencies;

        try {
            const newCompactState = !currentCompactState;
            const container = document.querySelector('.analytics-container');
            
            if (!container) {
                return { success: false, error: 'Analytics container not found' };
            }

            // Process view toggle settings
            let viewSettings;
            if (UIComponentsProcessors) {
                viewSettings = UIComponentsProcessors.processViewToggle(newCompactState);
            } else {
                viewSettings = {
                    fontSize: newCompactState ? '12px' : '14px',
                    cardPadding: newCompactState ? '15px' : '20px'
                };
            }

            // Apply view settings
            container.style.fontSize = viewSettings.fontSize;
            
            const analyticsCards = container.querySelectorAll('.analytics-card');
            analyticsCards.forEach(card => {
                card.style.padding = viewSettings.cardPadding;
            });

            return { 
                success: true, 
                newState: newCompactState,
                message: `Analytics view switched to ${newCompactState ? 'compact' : 'detailed'} mode`
            };
        } catch (error) {
            console.error('Error toggling analytics view:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Enable virtual scrolling for containers (Core orchestration)
     * @param {Object} dependencies - Injected dependencies
     * @param {Element} container - Container element
     * @param {Array} items - Items to scroll
     * @param {Function} renderFunction - Render function for items
     * @returns {Object} Operation result with virtual scroller instance
     */
    static enableVirtualScrollingCore(dependencies, container, items, renderFunction) {
        const { UIComponentsValidators, VirtualScroller, console } = dependencies;

        try {
            // Validate parameters
            if (UIComponentsValidators) {
                const validation = UIComponentsValidators.validateVirtualScrollingParams(
                    container, items, renderFunction
                );
                if (!validation.isValid) {
                    console.error('Virtual scrolling validation failed:', validation.error);
                    return { success: false, error: validation.error };
                }
            }

            if (!container || !items.length) {
                return { success: false, error: 'Invalid container or empty items array' };
            }

            if (!VirtualScroller) {
                console.warn('VirtualScroller not available');
                return { success: false, error: 'VirtualScroller not available' };
            }

            const virtualScroller = new VirtualScroller(container, 70, 3);
            virtualScroller.setData(items, renderFunction);

            return { success: true, virtualScroller, message: 'Virtual scrolling enabled successfully' };
        } catch (error) {
            console.error('Error enabling virtual scrolling:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== FALLBACK METHODS FOR GRACEFUL DEGRADATION =====

    /**
     * Fallback method to generate analytics HTML when builders not available
     * @param {Object} data - Analytics data
     * @returns {string} Basic HTML string
     */
    static fallbackGenerateAnalyticsHTML(data) {
        return `
        <div class="analytics-container" style="margin-top: 30px;">
            <h2 style="color: #1DB954;">🎵 Your Music Analytics</h2>
            <div class="analytics-fallback">
                <p>Analytics data loaded. UI builders not available for detailed display.</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
        `;
    }

    /**
     * Fallback method to render track items
     * @param {Object} track - Track data
     * @param {number} index - Track index
     * @returns {HTMLElement} Basic track element
     */
    static fallbackRenderTrackItem(track, index) {
        const element = document.createElement('div');
        element.style.padding = '10px';
        element.style.borderBottom = '1px solid #eee';
        element.innerHTML = `
            <strong>${index + 1}. ${track.name || 'Unknown'}</strong><br>
            <small>${track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</small>
        `;
        return element;
    }

    /**
     * Fallback method to render artist items
     * @param {Object} artist - Artist data
     * @param {number} index - Artist index
     * @returns {HTMLElement} Basic artist element
     */
    static fallbackRenderArtistItem(artist, index) {
        const element = document.createElement('div');
        element.style.padding = '10px';
        element.style.borderBottom = '1px solid #eee';
        element.innerHTML = `
            <strong>${index + 1}. ${artist.name || 'Unknown'}</strong><br>
            <small>${artist.followers?.total?.toLocaleString() || '0'} followers</small>
        `;
        return element;
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponentsCore;
} else if (typeof window !== 'undefined') {
    window.UIComponentsCore = UIComponentsCore;
}

// ES6 module export
if (typeof exports !== 'undefined') {
    exports.UIComponentsCore = UIComponentsCore;
}