/**
 * RealTimeCore - Core orchestration functions for real-time monitoring with dependency injection
 * 
 * This class contains the business logic orchestration for real-time monitoring:
 * - Real-time monitoring lifecycle management
 * - Playback state updates and change detection
 * - UI updates and DOM manipulation orchestration
 * - Interval management and cleanup
 * 
 * Functions in this class are IMPURE and use dependency injection:
 * - Orchestrate side effects through injected dependencies
 * - Handle DOM manipulation, network requests, and timers
 * - Coordinate between pure functions and external systems
 * 
 * Note: This is the imperative shell in the functional core/imperative shell pattern
 */
class RealTimeCore {
    
    /**
     * IMPURE: Core function for starting real-time monitoring with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getValidAccessToken - Function to get valid access token
     * @param {Function} dependencies.showResult - Function to show user messages
     * @param {Function} dependencies.setInterval - Timer function for interval creation
     * @param {Function} dependencies.clearInterval - Timer function for interval cleanup
     * @param {Object} dependencies.monitoringState - Global state object for tracking
     * @param {number} updateInterval - Update interval in milliseconds (default: 5000)
     * @returns {Object} Result object with success status and interval reference
     */
    static startRealTimeMonitoringCore(dependencies, updateInterval = 5000) {
        const { getValidAccessToken, showResult, setInterval, clearInterval, monitoringState } = dependencies;
        
        // Pure validation
        const tokenValidation = RealTimeValidators.validateAccessToken(getValidAccessToken());
        if (!tokenValidation.isValid) {
            showResult('No valid access token for real-time monitoring', 'error');
            return { success: false, error: tokenValidation.error };
        }
        
        const intervalValidation = RealTimeValidators.validateMonitoringInterval(updateInterval);
        if (!intervalValidation.isValid) {
            showResult(`Invalid monitoring interval: ${intervalValidation.error}`, 'error');
            return { success: false, error: intervalValidation.error };
        }
        
        // Clear any existing interval
        if (monitoringState.interval) {
            clearInterval(monitoringState.interval);
        }
        
        // Create new monitoring interval
        const interval = setInterval(async () => {
            const token = getValidAccessToken();
            if (token) {
                await this.updateCurrentPlaybackCore(dependencies, token);
            }
        }, updateInterval);
        
        // Update global state
        monitoringState.interval = interval;
        
        // Initial update
        const token = getValidAccessToken();
        if (token) {
            this.updateCurrentPlaybackCore(dependencies, token);
        }
        
        return { success: true, interval: interval };
    }

    /**
     * IMPURE: Core function for stopping real-time monitoring with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.clearInterval - Timer function for interval cleanup
     * @param {Object} dependencies.monitoringState - Global state object for tracking
     * @returns {Object} Result object with success status
     */
    static stopRealTimeMonitoringCore(dependencies) {
        const { clearInterval, monitoringState } = dependencies;
        
        if (monitoringState.interval) {
            clearInterval(monitoringState.interval);
            monitoringState.interval = null;
        }
        
        return { success: true };
    }

    /**
     * IMPURE: Core function for updating current playback with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getCurrentPlayback - Function to fetch current playback
     * @param {Function} dependencies.logError - Function for error logging
     * @param {Object} dependencies.monitoringState - Global state object
     * @param {string} accessToken - Valid access token
     * @returns {Promise<Object>} Result object with success status and playback data
     */
    static async updateCurrentPlaybackCore(dependencies, accessToken) {
        const { getCurrentPlayback, logError, monitoringState } = dependencies;
        
        try {
            // Fetch current playback (impure - network request)
            const playback = await getCurrentPlayback(accessToken);
            
            // Pure validation
            const playbackValidation = RealTimeValidators.validatePlaybackData(playback);
            if (!playbackValidation.isValid) {
                logError('Invalid playback data received:', playbackValidation.error);
                return { success: false, error: playbackValidation.error };
            }
            
            // Pure change detection
            const hasChanged = RealTimeProcessors.hasPlaybackStateChanged(
                monitoringState.currentPlayback, 
                playback
            );
            
            // Only update if playback state has changed
            if (hasChanged) {
                monitoringState.currentPlayback = playback;
                
                // Trigger UI update
                await this.updateCurrentPlaybackDisplayCore(dependencies, playback);
            }
            
            return { success: true, playback: playback, changed: hasChanged };
            
        } catch (error) {
            logError('Error updating current playback:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * IMPURE: Core function for updating playback display with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM query function
     * @param {Function} dependencies.createElement - DOM creation function
     * @param {Function} dependencies.appendChild - DOM manipulation function
     * @param {Object} dependencies.document - Document object reference
     * @param {Object} playback - Current playback data
     * @returns {Promise<Object>} Result object with success status
     */
    static async updateCurrentPlaybackDisplayCore(dependencies, playback) {
        const { getElementById, createElement, appendChild, document } = dependencies;
        
        try {
            // Get or create display element
            let currentPlaybackDiv = getElementById('realTimePlayback');
            
            if (!currentPlaybackDiv) {
                // Create the real-time playback div if it doesn't exist
                currentPlaybackDiv = createElement('div');
                const attributes = RealTimeUIBuilders.buildElementAttributes(
                    'realTimePlayback', 
                    RealTimeUIBuilders.buildContainerStyles()
                );
                
                currentPlaybackDiv.id = attributes.id;
                currentPlaybackDiv.style.cssText = attributes.styles;
                
                appendChild(document.body, currentPlaybackDiv);
            }
            
            // Process playback data
            const processedData = RealTimeProcessors.processPlaybackData(playback);
            
            // Build appropriate HTML content
            let htmlContent;
            if (processedData.hasActivePlayback) {
                htmlContent = RealTimeUIBuilders.buildActivePlaybackDisplay(
                    playback,
                    processedData.formattedProgress,
                    processedData.formattedDuration,
                    processedData.progressPercent
                );
            } else {
                htmlContent = RealTimeUIBuilders.buildInactivePlaybackDisplay();
            }
            
            // Update DOM (impure)
            currentPlaybackDiv.innerHTML = htmlContent;
            
            // Ensure CSS animations are available
            await this.ensureStylesAvailableCore(dependencies);
            
            return { success: true };
            
        } catch (error) {
            dependencies.logError('Error updating playback display:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * IMPURE: Core function for ensuring CSS styles are available with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.getElementById - DOM query function
     * @param {Function} dependencies.createElement - DOM creation function
     * @param {Function} dependencies.appendChild - DOM manipulation function
     * @param {Object} dependencies.document - Document object reference
     * @returns {Promise<Object>} Result object with success status
     */
    static async ensureStylesAvailableCore(dependencies) {
        const { getElementById, createElement, appendChild, document } = dependencies;
        
        try {
            if (!getElementById('realTimeStyles')) {
                const style = createElement('style');
                const styleAttributes = RealTimeUIBuilders.buildStyleElementAttributes(
                    'realTimeStyles',
                    RealTimeUIBuilders.buildCompleteStyles()
                );
                
                style.id = styleAttributes.id;
                style.textContent = styleAttributes.textContent;
                
                appendChild(document.head, style);
            }
            
            return { success: true };
            
        } catch (error) {
            dependencies.logError('Error ensuring styles available:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * IMPURE: Core function for toggling real-time monitoring with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.monitoringState - Global state object
     * @param {Function} dependencies.getElementById - DOM query function
     * @param {Function} dependencies.removeElement - DOM removal function
     * @returns {Object} Result object with success status and action taken
     */
    static toggleRealTimeMonitoringCore(dependencies) {
        const { monitoringState, getElementById, removeElement } = dependencies;
        
        try {
            if (monitoringState.interval) {
                // Stop monitoring
                const stopResult = this.stopRealTimeMonitoringCore(dependencies);
                
                // Remove display element
                const displayElement = getElementById('realTimePlayback');
                if (displayElement) {
                    removeElement(displayElement);
                }
                
                return { success: true, action: 'stopped', stopResult };
            } else {
                // Start monitoring
                const startResult = this.startRealTimeMonitoringCore(dependencies);
                
                return { success: true, action: 'started', startResult };
            }
            
        } catch (error) {
            dependencies.logError('Error toggling real-time monitoring:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * IMPURE: Core function for cleanup and resource management
     * @param {Object} dependencies - Injected dependencies
     * @param {Function} dependencies.clearInterval - Timer cleanup function
     * @param {Function} dependencies.getElementById - DOM query function
     * @param {Function} dependencies.removeElement - DOM removal function
     * @param {Object} dependencies.monitoringState - Global state object
     * @returns {Object} Result object with success status
     */
    static cleanupRealTimeResourcesCore(dependencies) {
        const { clearInterval, getElementById, removeElement, monitoringState } = dependencies;
        
        try {
            // Clear interval
            if (monitoringState.interval) {
                clearInterval(monitoringState.interval);
                monitoringState.interval = null;
            }
            
            // Remove DOM elements
            const displayElement = getElementById('realTimePlayback');
            if (displayElement) {
                removeElement(displayElement);
            }
            
            const styleElement = getElementById('realTimeStyles');
            if (styleElement) {
                removeElement(styleElement);
            }
            
            // Reset state
            monitoringState.currentPlayback = null;
            
            return { success: true };
            
        } catch (error) {
            dependencies.logError('Error cleaning up real-time resources:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * IMPURE: Core function for initializing real-time monitoring system
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} config - Configuration object
     * @returns {Object} Result object with initialization status
     */
    static initializeRealTimeSystemCore(dependencies, config = {}) {
        const { monitoringState, logInfo } = dependencies;
        
        try {
            // Build configuration
            const displayConfig = RealTimeUIBuilders.buildDisplayConfiguration(config);
            
            // Initialize state
            monitoringState.interval = null;
            monitoringState.currentPlayback = null;
            monitoringState.config = displayConfig;
            
            logInfo('Real-time monitoring system initialized with config:', displayConfig);
            
            return { success: true, config: displayConfig };
            
        } catch (error) {
            dependencies.logError('Error initializing real-time system:', error);
            return { success: false, error: error.message };
        }
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeCore;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.RealTimeCore = RealTimeCore;
}