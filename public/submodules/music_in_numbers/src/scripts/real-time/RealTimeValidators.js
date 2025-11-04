/**
 * RealTimeValidators - Pure validation functions for real-time monitoring features
 * 
 * This class contains validation functions that support the real-time monitoring implementation:
 * - Access token validation for real-time features
 * - Playback data validation and structure checking
 * - Monitoring interval validation
 * - UI element validation for display components
 * 
 * All functions in this class are PURE:
 * - Deterministic validation with consistent return format
 * - No side effects or global state access
 * - Consistent return format: { isValid: boolean, error?: string }
 * 
 * Note: This is part of the modular real-time monitoring architecture
 */
class RealTimeValidators {
    
    /**
     * PURE: Validates access token for real-time monitoring
     * @param {string} token - Access token to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateAccessToken(token) {
        if (!token || typeof token !== 'string') {
            return { 
                isValid: false, 
                error: 'Access token must be a non-empty string for real-time monitoring' 
            };
        }
        
        if (token.length < 10) {
            return { 
                isValid: false, 
                error: 'Access token appears to be too short for real-time features' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates monitoring interval value
     * @param {number} interval - Interval value in milliseconds
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateMonitoringInterval(interval) {
        if (typeof interval !== 'number') {
            return { 
                isValid: false, 
                error: 'Monitoring interval must be a number' 
            };
        }
        
        if (interval < 1000) {
            return { 
                isValid: false, 
                error: 'Monitoring interval must be at least 1000ms to avoid API rate limits' 
            };
        }
        
        if (interval > 60000) {
            return { 
                isValid: false, 
                error: 'Monitoring interval should not exceed 60000ms for reasonable real-time updates' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates playback data structure from Spotify API
     * @param {Object} playback - Playback data object
     * @returns {Object} Validation result with isValid and error properties
     */
    static validatePlaybackData(playback) {
        if (!playback || typeof playback !== 'object') {
            return { 
                isValid: false, 
                error: 'Playback data must be a valid object' 
            };
        }
        
        // Check for required playback properties
        if (playback.item && typeof playback.item !== 'object') {
            return { 
                isValid: false, 
                error: 'Playback item must be a valid object when present' 
            };
        }
        
        // Validate playback item structure when present
        if (playback.item) {
            if (!playback.item.name || typeof playback.item.name !== 'string') {
                return { 
                    isValid: false, 
                    error: 'Playback item must have a valid name' 
                };
            }
            
            if (!Array.isArray(playback.item.artists)) {
                return { 
                    isValid: false, 
                    error: 'Playback item must have a valid artists array' 
                };
            }
            
            if (typeof playback.item.duration_ms !== 'number') {
                return { 
                    isValid: false, 
                    error: 'Playback item must have a valid duration_ms number' 
                };
            }
        }
        
        // Validate progress when present
        if (playback.progress_ms !== undefined && typeof playback.progress_ms !== 'number') {
            return { 
                isValid: false, 
                error: 'Playback progress_ms must be a number when present' 
            };
        }
        
        // Validate is_playing flag
        if (playback.is_playing !== undefined && typeof playback.is_playing !== 'boolean') {
            return { 
                isValid: false, 
                error: 'Playback is_playing must be a boolean when present' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates time duration in milliseconds
     * @param {number} duration - Duration in milliseconds
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateDuration(duration) {
        if (typeof duration !== 'number') {
            return { 
                isValid: false, 
                error: 'Duration must be a number' 
            };
        }
        
        if (duration < 0) {
            return { 
                isValid: false, 
                error: 'Duration cannot be negative' 
            };
        }
        
        if (duration > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            return { 
                isValid: false, 
                error: 'Duration exceeds maximum reasonable track length (24 hours)' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates DOM element ID for real-time UI components
     * @param {string} elementId - DOM element ID to validate
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateElementId(elementId) {
        if (!elementId || typeof elementId !== 'string') {
            return { 
                isValid: false, 
                error: 'Element ID must be a non-empty string' 
            };
        }
        
        // Check for valid HTML ID format (basic validation)
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(elementId)) {
            return { 
                isValid: false, 
                error: 'Element ID must start with a letter and contain only letters, numbers, underscore, or dash' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates progress percentage calculation
     * @param {number} progress - Current progress in milliseconds
     * @param {number} duration - Total duration in milliseconds
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateProgressCalculation(progress, duration) {
        const progressValidation = this.validateDuration(progress);
        if (!progressValidation.isValid) {
            return { 
                isValid: false, 
                error: `Progress validation failed: ${progressValidation.error}` 
            };
        }
        
        const durationValidation = this.validateDuration(duration);
        if (!durationValidation.isValid) {
            return { 
                isValid: false, 
                error: `Duration validation failed: ${durationValidation.error}` 
            };
        }
        
        if (progress > duration) {
            return { 
                isValid: false, 
                error: 'Progress cannot exceed total duration' 
            };
        }
        
        if (duration === 0) {
            return { 
                isValid: false, 
                error: 'Duration cannot be zero for progress calculation' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * PURE: Validates real-time monitoring state object
     * @param {Object} state - Real-time monitoring state
     * @returns {Object} Validation result with isValid and error properties
     */
    static validateMonitoringState(state) {
        if (!state || typeof state !== 'object') {
            return { 
                isValid: false, 
                error: 'Monitoring state must be a valid object' 
            };
        }
        
        // Validate interval reference
        if (state.interval !== null && typeof state.interval !== 'object') {
            return { 
                isValid: false, 
                error: 'Monitoring interval reference must be null or a valid interval object' 
            };
        }
        
        // Validate current playback state
        if (state.currentPlayback !== null) {
            const playbackValidation = this.validatePlaybackData(state.currentPlayback);
            if (!playbackValidation.isValid) {
                return { 
                    isValid: false, 
                    error: `Current playback validation failed: ${playbackValidation.error}` 
                };
            }
        }
        
        return { isValid: true };
    }
}

// Node.js environment support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeValidators;
}

// Browser environment support
if (typeof window !== 'undefined') {
    window.RealTimeValidators = RealTimeValidators;
}