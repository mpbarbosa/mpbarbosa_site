/**
 * RealTimeUIBuilders - Pure UI building functions for real-time monitoring display
 * 
 * This class contains pure functions for building UI elements and styles:
 * - HTML structure generation for playback display
 * - CSS style generation for real-time components
 * - Progress bar and status indicator creation
 * - Animation and styling utilities
 * 
 * All functions in this class are PURE:
 * - Generate HTML/CSS strings without DOM manipulation
 * - Deterministic output based on input parameters
 * - No side effects or global state access
 * 
 * Note: This is part of the modular real-time monitoring architecture
 */
class RealTimeUIBuilders {
    
    /**
     * PURE: Builds base container styles for real-time playback display
     * @returns {string} CSS styles for the container element
     */
    static buildContainerStyles() {
        return `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1DB954, #1ed760);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
    }

    /**
     * PURE: Builds status indicator HTML with pulsing animation
     * @param {boolean} isPlaying - Whether music is currently playing
     * @returns {string} HTML string for status indicator
     */
    static buildStatusIndicator(isPlaying) {
        const statusColor = isPlaying ? '#fff' : '#ccc';
        const statusText = isPlaying ? 'NOW PLAYING' : 'PAUSED';
        const animation = isPlaying ? 'animation: pulse 1.5s infinite;' : '';
        
        return `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${statusColor}; margin-right: 8px; ${animation}"></div>
                <span style="font-size: 12px; opacity: 0.9;">${statusText}</span>
            </div>
        `;
    }

    /**
     * PURE: Builds track information HTML
     * @param {string} trackName - Name of the current track
     * @param {Array<Object>} artists - Array of artist objects with name property
     * @returns {string} HTML string for track information display
     */
    static buildTrackInfo(trackName, artists) {
        const artistNames = artists.map(artist => artist.name).join(', ');
        
        return `
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; line-height: 1.2;">${trackName}</div>
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">${artistNames}</div>
        `;
    }

    /**
     * PURE: Builds progress bar HTML
     * @param {number} progressPercent - Progress percentage (0-100)
     * @returns {string} HTML string for progress bar
     */
    static buildProgressBar(progressPercent) {
        return `
            <div style="background-color: rgba(255,255,255,0.3); border-radius: 10px; height: 4px; margin-bottom: 5px;">
                <div style="background-color: white; height: 100%; border-radius: 10px; width: ${progressPercent}%; transition: width 0.5s ease;"></div>
            </div>
        `;
    }

    /**
     * PURE: Builds time display HTML
     * @param {string} currentTime - Formatted current time (MM:SS)
     * @param {string} totalTime - Formatted total time (MM:SS)
     * @returns {string} HTML string for time display
     */
    static buildTimeDisplay(currentTime, totalTime) {
        return `
            <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.8;">
                <span>${currentTime}</span>
                <span>${totalTime}</span>
            </div>
        `;
    }

    /**
     * PURE: Builds close button HTML
     * @param {string} onClickHandler - JavaScript function name for click handler
     * @returns {string} HTML string for close button
     */
    static buildCloseButton(onClickHandler = 'toggleRealTimeMonitoring') {
        return `
            <button onclick="${onClickHandler}()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; font-size: 12px; cursor: pointer; opacity: 0.7;">✕</button>
        `;
    }

    /**
     * PURE: Builds complete playback display HTML for active playback
     * @param {Object} playbackData - Playback data object
     * @param {string} formattedCurrentTime - Formatted current time
     * @param {string} formattedTotalTime - Formatted total time
     * @param {number} progressPercent - Progress percentage
     * @returns {string} Complete HTML string for active playback display
     */
    static buildActivePlaybackDisplay(playbackData, formattedCurrentTime, formattedTotalTime, progressPercent) {
        const statusIndicator = this.buildStatusIndicator(playbackData.is_playing);
        const trackInfo = this.buildTrackInfo(playbackData.item.name, playbackData.item.artists);
        const progressBar = this.buildProgressBar(progressPercent);
        const timeDisplay = this.buildTimeDisplay(formattedCurrentTime, formattedTotalTime);
        const closeButton = this.buildCloseButton();
        
        return statusIndicator + trackInfo + progressBar + timeDisplay + closeButton;
    }

    /**
     * PURE: Builds inactive playback display HTML
     * @param {string} onClickHandler - JavaScript function name for close handler
     * @returns {string} HTML string for inactive playback display
     */
    static buildInactivePlaybackDisplay(onClickHandler = 'toggleRealTimeMonitoring') {
        const closeButton = this.buildCloseButton(onClickHandler);
        
        return `
            <div style="text-align: center; opacity: 0.8;">
                <div style="font-size: 14px; margin-bottom: 5px;">No active playback</div>
                <div style="font-size: 12px;">Start playing music on Spotify</div>
                ${closeButton}
            </div>
        `;
    }

    /**
     * PURE: Builds CSS keyframe animation for pulsing effect
     * @returns {string} CSS keyframe animation string
     */
    static buildPulseAnimation() {
        return `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
    }

    /**
     * PURE: Builds complete CSS styles for real-time components
     * @returns {string} Complete CSS string including animations
     */
    static buildCompleteStyles() {
        return this.buildPulseAnimation();
    }

    /**
     * PURE: Builds DOM element attributes object
     * @param {string} elementId - ID for the DOM element
     * @param {string} styles - CSS styles string
     * @returns {Object} Object with DOM element properties
     */
    static buildElementAttributes(elementId, styles) {
        return {
            id: elementId,
            styles: styles,
            className: 'real-time-playback-display'
        };
    }

    /**
     * PURE: Builds style element attributes for CSS injection
     * @param {string} styleId - ID for the style element
     * @param {string} cssContent - CSS content to inject
     * @returns {Object} Object with style element properties
     */
    static buildStyleElementAttributes(styleId, cssContent) {
        return {
            id: styleId,
            textContent: cssContent,
            type: 'text/css'
        };
    }

    /**
     * PURE: Builds configuration object for real-time display
     * @param {Object} options - Configuration options
     * @returns {Object} Complete configuration object
     */
    static buildDisplayConfiguration(options = {}) {
        return {
            containerId: options.containerId || 'realTimePlayback',
            styleId: options.styleId || 'realTimeStyles',
            position: options.position || { top: '20px', right: '20px' },
            updateInterval: options.updateInterval || 5000,
            animationDuration: options.animationDuration || '0.3s',
            closeHandler: options.closeHandler || 'toggleRealTimeMonitoring'
        };
    }

    /**
     * PURE: Builds custom container styles with position override
     * @param {Object} position - Position object with top, right, bottom, left properties
     * @param {Object} customStyles - Additional custom styles
     * @returns {string} Custom CSS styles string
     */
    static buildCustomContainerStyles(position = {}, customStyles = {}) {
        const baseStyles = this.buildContainerStyles();
        
        let positionStyles = '';
        if (position.top) positionStyles += `top: ${position.top}; `;
        if (position.right) positionStyles += `right: ${position.right}; `;
        if (position.bottom) positionStyles += `bottom: ${position.bottom}; `;
        if (position.left) positionStyles += `left: ${position.left}; `;
        
        let additionalStyles = '';
        Object.keys(customStyles).forEach(key => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            additionalStyles += `${cssKey}: ${customStyles[key]}; `;
        });
        
        return baseStyles + positionStyles + additionalStyles;
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeUIBuilders;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.RealTimeUIBuilders = RealTimeUIBuilders;
}