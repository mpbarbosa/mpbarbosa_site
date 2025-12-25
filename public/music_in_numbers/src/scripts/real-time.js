/**
 * ===== REAL-TIME FEATURES - MODULAR DELEGATION WRAPPER =====
 * 
 * This file now serves as a delegation wrapper that maintains backward compatibility
 * while leveraging the new modular architecture with extracted classes:
 * - RealTimeValidators: Pure validation functions
 * - RealTimeUIBuilders: Pure UI building functions  
 * - RealTimeProcessors: Pure data processing functions
 * - RealTimeCore: Business logic orchestration with dependency injection
 * - RealTimeUtilities: Utility functions and dependency factory
 * 
 * All original function signatures are preserved for backward compatibility.
 */

// Load modular classes (assuming they're loaded via script tags or imports)
// In production, these would be loaded via proper module system

// Global state variables (maintained for backward compatibility)
let realTimeInterval = null;
let currentPlaybackState = null;

// Initialize dependency container using the modular architecture
let dependencies = {};
let isInitialized = false;

/**
 * Initialize the modular real-time system
 * This is called automatically on first use
 */
function initializeRealTimeSystem() {
    if (isInitialized) return;
    
    try {
        // Create dependencies using the utilities factory
        if (typeof RealTimeUtilities !== 'undefined') {
            dependencies = RealTimeUtilities.createDefaultDependencies();
        } else {
            // Fallback to basic dependencies if modules aren't loaded
            dependencies = {
                getElementById: (id) => document.getElementById(id),
                createElement: (tagName) => document.createElement(tagName),
                appendChild: (parent, child) => parent.appendChild(child),
                setInterval: (callback, interval) => setInterval(callback, interval),
                clearInterval: (intervalId) => clearInterval(intervalId),
                showResult: window.showResult || ((msg, type) => console.log(`${type}: ${msg}`)),
                getValidAccessToken: window.getValidAccessToken || (() => null),
                getCurrentPlayback: window.getCurrentPlayback || (async () => null),
                monitoringState: { interval: null, currentPlayback: null, config: null }
            };
        }
        isInitialized = true;
    } catch (error) {
        console.warn('Failed to initialize modular real-time system, using fallback:', error);
        isInitialized = true; // Mark as initialized to prevent retry loops
    }
}

// Start real-time monitoring (maintains original function signature)
function startRealTimeMonitoring() {
    initializeRealTimeSystem();
    
    // Use modular architecture if available, fallback to legacy implementation
    if (typeof RealTimeCore !== 'undefined') {
        try {
            const config = { updateInterval: 5000 };
            const result = RealTimeCore.startRealTimeMonitoringCore(dependencies, config);
            
            if (result.success) {
                // Update global state for backward compatibility
                realTimeInterval = dependencies.monitoringState.interval;
                console.log('Real-time monitoring started using modular architecture');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.warn('Modular start failed, using legacy implementation:', error);
            startRealTimeMonitoringLegacy();
        }
    } else {
        startRealTimeMonitoringLegacy();
    }
}

// Legacy implementation for backward compatibility
function startRealTimeMonitoringLegacy() {
    const token = dependencies.getValidAccessToken();
    if (!token) {
        dependencies.showResult('No valid access token for real-time monitoring', 'error');
        return;
    }

    // Clear any existing interval
    if (realTimeInterval) {
        dependencies.clearInterval(realTimeInterval);
    }

    // Update every 5 seconds
    realTimeInterval = dependencies.setInterval(async () => {
        await updateCurrentPlayback(token);
    }, 5000);

    // Initial update
    updateCurrentPlayback(token);
}

// Stop real-time monitoring (maintains original function signature)
function stopRealTimeMonitoring() {
    initializeRealTimeSystem();
    
    // Use modular architecture if available
    if (typeof RealTimeCore !== 'undefined' && dependencies.monitoringState.interval) {
        try {
            const result = RealTimeCore.stopRealTimeMonitoringCore(dependencies);
            if (result.success) {
                realTimeInterval = null; // Update global state for backward compatibility
                console.log('Real-time monitoring stopped using modular architecture');
                return;
            }
        } catch (error) {
            console.warn('Modular stop failed, using legacy implementation:', error);
        }
    }
    
    // Legacy implementation
    if (realTimeInterval) {
        dependencies.clearInterval(realTimeInterval);
        realTimeInterval = null;
    }
}

// Update current playback in real-time (maintains original function signature)
async function updateCurrentPlayback(accessToken) {
    initializeRealTimeSystem();
    
    // Use modular architecture if available
    if (typeof RealTimeCore !== 'undefined') {
        try {
            const result = await RealTimeCore.updateCurrentPlaybackCore(dependencies, accessToken);
            if (result.success) {
                // Update global state for backward compatibility
                currentPlaybackState = result.playback;
                return;
            }
        } catch (error) {
            console.warn('Modular update failed, using legacy implementation:', error);
        }
    }
    
    // Legacy implementation
    try {
        const playback = await dependencies.getCurrentPlayback(accessToken);

        // Only update if playback state has changed
        if (JSON.stringify(playback) !== JSON.stringify(currentPlaybackState)) {
            currentPlaybackState = playback;
            updateCurrentPlaybackDisplay(playback);
        }
    } catch (error) {
        console.error('Error updating current playback:', error);
    }
}

// Update the current playback display (maintains original function signature)
function updateCurrentPlaybackDisplay(playback) {
    initializeRealTimeSystem();
    
    // Use modular architecture if available
    if (typeof RealTimeCore !== 'undefined') {
        try {
            const result = RealTimeCore.updateCurrentPlaybackDisplayCore(dependencies, playback);
            if (result.success) {
                return;
            }
        } catch (error) {
            console.warn('Modular display update failed, using legacy implementation:', error);
        }
    }
    
    // Legacy implementation
    let currentPlaybackDiv = dependencies.getElementById('realTimePlayback');

    if (!currentPlaybackDiv) {
        // Create the real-time playback div if it doesn't exist
        currentPlaybackDiv = dependencies.createElement('div');
        currentPlaybackDiv.id = 'realTimePlayback';
        currentPlaybackDiv.style.cssText = `
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
        document.body.appendChild(currentPlaybackDiv);
    }

    if (playback && playback.item) {
        const progress = playback.progress_ms || 0;
        const duration = playback.item.duration_ms;
        const progressPercent = (progress / duration) * 100;

        currentPlaybackDiv.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${playback.is_playing ? '#fff' : '#ccc'}; margin-right: 8px; ${playback.is_playing ? 'animation: pulse 1.5s infinite;' : ''}"></div>
                <span style="font-size: 12px; opacity: 0.9;">${playback.is_playing ? 'NOW PLAYING' : 'PAUSED'}</span>
            </div>
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; line-height: 1.2;">${playback.item.name}</div>
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">${playback.item.artists.map(a => a.name).join(', ')}</div>
            <div style="background-color: rgba(255,255,255,0.3); border-radius: 10px; height: 4px; margin-bottom: 5px;">
                <div style="background-color: white; height: 100%; border-radius: 10px; width: ${progressPercent}%; transition: width 0.5s ease;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.8;">
                <span>${formatTime(progress)}</span>
                <span>${formatTime(duration)}</span>
            </div>
            <button onclick="toggleRealTimeMonitoring()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; font-size: 12px; cursor: pointer; opacity: 0.7;">✕</button>
        `;

        // Add pulsing animation CSS if it doesn't exist
        if (!dependencies.getElementById('realTimeStyles')) {
            const style = dependencies.createElement('style');
            style.id = 'realTimeStyles';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

    } else {
        currentPlaybackDiv.innerHTML = `
            <div style="text-align: center; opacity: 0.8;">
                <div style="font-size: 14px; margin-bottom: 5px;">No active playback</div>
                <div style="font-size: 12px;">Start playing music on Spotify</div>
                <button onclick="toggleRealTimeMonitoring()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; font-size: 12px; cursor: pointer; opacity: 0.7;">✕</button>
            </div>
        `;
    }
}

// Format time in MM:SS format (maintains original function signature)
function formatTime(ms) {
    // Use modular architecture if available
    if (typeof RealTimeProcessors !== 'undefined') {
        try {
            return RealTimeProcessors.formatTime(ms);
        } catch (error) {
            console.warn('Modular formatTime failed, using legacy implementation:', error);
        }
    }
    
    // Legacy implementation
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Toggle real-time monitoring (maintains original function signature)
function toggleRealTimeMonitoring() {
    if (realTimeInterval) {
        stopRealTimeMonitoring();
        const div = document.getElementById('realTimePlayback');
        if (div) div.remove();
    } else {
        startRealTimeMonitoring();
    }
}