/**
 * RealTimeProcessors - Pure data processing functions for real-time monitoring
 * 
 * This class contains pure functions for processing real-time data:
 * - Time formatting and duration calculations
 * - Playback data processing and state comparison
 * - Progress percentage calculations
 * - Data transformation for UI display
 * 
 * All functions in this class are PURE:
 * - Deterministic data transformation with no side effects
 * - Consistent output format for processed data
 * - No global state access or mutations
 * 
 * Note: This is part of the modular real-time monitoring architecture
 */
class RealTimeProcessors {
    
    /**
     * PURE: Formats time duration from milliseconds to MM:SS format
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted time string in MM:SS format
     */
    static formatTime(ms) {
        if (typeof ms !== 'number' || ms < 0) {
            return '0:00';
        }
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * PURE: Calculates progress percentage from current position and total duration
     * @param {number} progress - Current progress in milliseconds
     * @param {number} duration - Total duration in milliseconds
     * @returns {number} Progress percentage (0-100)
     */
    static calculateProgressPercent(progress, duration) {
        if (typeof progress !== 'number' || typeof duration !== 'number') {
            return 0;
        }
        
        if (duration <= 0) {
            return 0;
        }
        
        if (progress <= 0) {
            return 0;
        }
        
        if (progress >= duration) {
            return 100;
        }
        
        return (progress / duration) * 100;
    }

    /**
     * PURE: Processes raw playback data into display-ready format
     * @param {Object} rawPlayback - Raw playback data from Spotify API
     * @returns {Object} Processed playback data for display
     */
    static processPlaybackData(rawPlayback) {
        if (!rawPlayback || typeof rawPlayback !== 'object') {
            return {
                hasActivePlayback: false,
                trackName: null,
                artists: [],
                isPlaying: false,
                progress: 0,
                duration: 0,
                progressPercent: 0,
                formattedProgress: '0:00',
                formattedDuration: '0:00'
            };
        }

        // Handle case where no active playback
        if (!rawPlayback.item) {
            return {
                hasActivePlayback: false,
                trackName: null,
                artists: [],
                isPlaying: false,
                progress: 0,
                duration: 0,
                progressPercent: 0,
                formattedProgress: '0:00',
                formattedDuration: '0:00'
            };
        }

        const progress = rawPlayback.progress_ms || 0;
        const duration = rawPlayback.item.duration_ms || 0;
        const progressPercent = this.calculateProgressPercent(progress, duration);

        return {
            hasActivePlayback: true,
            trackName: rawPlayback.item.name || 'Unknown Track',
            artists: rawPlayback.item.artists || [],
            isPlaying: rawPlayback.is_playing || false,
            progress: progress,
            duration: duration,
            progressPercent: progressPercent,
            formattedProgress: this.formatTime(progress),
            formattedDuration: this.formatTime(duration)
        };
    }

    /**
     * PURE: Compares two playback states to detect changes
     * @param {Object} currentState - Current playback state
     * @param {Object} newState - New playback state
     * @returns {boolean} True if states are different, false if identical
     */
    static hasPlaybackStateChanged(currentState, newState) {
        // Convert to JSON strings for deep comparison
        const currentJson = JSON.stringify(currentState);
        const newJson = JSON.stringify(newState);
        
        return currentJson !== newJson;
    }

    /**
     * PURE: Extracts artist names from artists array
     * @param {Array<Object>} artists - Array of artist objects
     * @returns {Array<string>} Array of artist names
     */
    static extractArtistNames(artists) {
        if (!Array.isArray(artists)) {
            return [];
        }
        
        return artists
            .filter(artist => artist && typeof artist.name === 'string')
            .map(artist => artist.name);
    }

    /**
     * PURE: Processes time remaining calculation
     * @param {number} progress - Current progress in milliseconds
     * @param {number} duration - Total duration in milliseconds
     * @returns {Object} Time remaining data
     */
    static calculateTimeRemaining(progress, duration) {
        if (typeof progress !== 'number' || typeof duration !== 'number') {
            return {
                remainingMs: 0,
                formattedRemaining: '0:00',
                percentRemaining: 0
            };
        }
        
        const remaining = Math.max(0, duration - progress);
        const percentRemaining = duration > 0 ? (remaining / duration) * 100 : 0;
        
        return {
            remainingMs: remaining,
            formattedRemaining: this.formatTime(remaining),
            percentRemaining: percentRemaining
        };
    }

    /**
     * PURE: Determines playback status text based on state
     * @param {boolean} isPlaying - Whether music is currently playing
     * @param {boolean} hasActivePlayback - Whether there is active playback
     * @returns {string} Status text for display
     */
    static getPlaybackStatusText(isPlaying, hasActivePlayback) {
        if (!hasActivePlayback) {
            return 'NO PLAYBACK';
        }
        
        return isPlaying ? 'NOW PLAYING' : 'PAUSED';
    }

    /**
     * PURE: Processes playback data for minimal display (track + artist only)
     * @param {Object} rawPlayback - Raw playback data
     * @returns {Object} Minimal display data
     */
    static processMinimalPlaybackData(rawPlayback) {
        if (!rawPlayback || !rawPlayback.item) {
            return {
                displayText: 'No active playback',
                hasContent: false
            };
        }

        const trackName = rawPlayback.item.name || 'Unknown Track';
        const artistNames = this.extractArtistNames(rawPlayback.item.artists);
        const artistText = artistNames.length > 0 ? artistNames.join(', ') : 'Unknown Artist';
        
        return {
            displayText: `${trackName} - ${artistText}`,
            hasContent: true,
            trackName: trackName,
            artists: artistText
        };
    }

    /**
     * PURE: Validates and sanitizes duration values
     * @param {number} duration - Duration value to sanitize
     * @returns {number} Sanitized duration value
     */
    static sanitizeDuration(duration) {
        if (typeof duration !== 'number' || isNaN(duration)) {
            return 0;
        }
        
        if (duration < 0) {
            return 0;
        }
        
        // Cap at 24 hours (reasonable maximum)
        const maxDuration = 24 * 60 * 60 * 1000;
        if (duration > maxDuration) {
            return maxDuration;
        }
        
        return Math.floor(duration);
    }

    /**
     * PURE: Processes playback change detection with timestamps
     * @param {Object} previousState - Previous playback state
     * @param {Object} currentState - Current playback state
     * @param {number} timestamp - Current timestamp
     * @returns {Object} Change detection result
     */
    static processPlaybackChange(previousState, currentState, timestamp) {
        const hasChanged = this.hasPlaybackStateChanged(previousState, currentState);
        
        return {
            hasChanged: hasChanged,
            timestamp: timestamp,
            changeType: this.detectChangeType(previousState, currentState),
            previousState: previousState,
            currentState: currentState
        };
    }

    /**
     * PURE: Detects the type of change between playback states
     * @param {Object} previousState - Previous playback state
     * @param {Object} currentState - Current playback state
     * @returns {string} Type of change detected
     */
    static detectChangeType(previousState, currentState) {
        if (!previousState && currentState) {
            return 'playback_started';
        }
        
        if (previousState && !currentState) {
            return 'playback_stopped';
        }
        
        if (!previousState || !currentState) {
            return 'unknown';
        }
        
        // Check for track change
        if (previousState.item?.id !== currentState.item?.id) {
            return 'track_changed';
        }
        
        // Check for play/pause change
        if (previousState.is_playing !== currentState.is_playing) {
            return currentState.is_playing ? 'resumed' : 'paused';
        }
        
        // Check for progress change
        if (Math.abs((previousState.progress_ms || 0) - (currentState.progress_ms || 0)) > 2000) {
            return 'progress_changed';
        }
        
        return 'minor_update';
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeProcessors;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.RealTimeProcessors = RealTimeProcessors;
}