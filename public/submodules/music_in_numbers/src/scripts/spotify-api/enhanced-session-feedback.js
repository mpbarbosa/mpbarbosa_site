/**
 * Enhanced Session Feedback - User Experience Improvements for Session Reuse
 * 
 * This module provides enhanced user feedback during Spotify session detection
 * and reuse, making the optimization more visible and understandable to users.
 */

class EnhancedSessionFeedback {
    /**
     * Show session detection progress with animated feedback
     */
    static showSessionDetectionProgress(dependencies) {
        const { showResult, getElement } = dependencies;
        
        // Progressive feedback during detection
        showResult('🔍 Checking for existing Spotify session...', 'info');
        
        // Update connect button with progress indicator
        const connectBtn = getElement('connectSpotify');
        if (connectBtn) {
            connectBtn.innerHTML = '🔍 Checking session...';
            connectBtn.classList.add('session-detecting');
        }
    }
    
    /**
     * Enhanced success feedback for session reuse
     */
    static showSessionReuseSuccess(dependencies, performanceMetrics = {}) {
        const { showResult, getElement, themeManager } = dependencies;
        const { detectionTime = 0 } = performanceMetrics;
        
        // Calculate time saved (estimated)
        const timeSaved = Math.max(0, 7000 - detectionTime); // 7 seconds typical OAuth time
        const timeSavedText = timeSaved > 1000 ? `${Math.round(timeSaved/1000)}s faster` : '';
        
        // Enhanced success message with performance info
        const message = timeSavedText 
            ? `⚡ Connected via existing session! (${timeSavedText})`
            : '⚡ Connected via existing Spotify session!';
            
        showResult(message, 'success');
        
        // Update button with success state
        const connectBtn = getElement('connectSpotify');
        if (connectBtn) {
            connectBtn.innerHTML = '✅ Session reused successfully!';
            connectBtn.classList.remove('session-detecting');
            connectBtn.classList.add('session-success');
            
            // Reset button text after 3 seconds
            setTimeout(() => {
                connectBtn.innerHTML = '🎵 Connect to Spotify';
                connectBtn.classList.remove('session-success');
            }, 3000);
        }
        
        // Enhanced accessibility announcement
        if (themeManager && themeManager.announceToScreenReader) {
            const announcement = timeSavedText 
                ? `Session reused successfully, ${timeSavedText} than standard login`
                : 'Session reused successfully, authentication completed instantly';
            themeManager.announceToScreenReader(announcement);
        }
        
        // Optional: Show tooltip with session reuse explanation
        this.showSessionReuseTooltip(dependencies);
    }
    
    /**
     * Show informative tooltip explaining session reuse benefit
     */
    static showSessionReuseTooltip(dependencies) {
        const { getElement } = dependencies;
        
        // Create temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'session-reuse-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>🚀 Session Reuse Optimization</strong>
                <p>Your existing Spotify login was detected and reused, skipping the redirect process!</p>
                <small>This saves time and provides a smoother experience.</small>
            </div>
        `;
        
        // Style the tooltip
        tooltip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1db954, #1ed760);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(29, 185, 84, 0.3);
            z-index: 9999;
            max-width: 300px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add CSS animation
        if (!document.querySelector('#session-reuse-styles')) {
            const styles = document.createElement('style');
            styles.id = 'session-reuse-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .session-detecting {
                    background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .session-success {
                    background: linear-gradient(135deg, #1db954, #1ed760);
                    color: white;
                    transform: scale(1.02);
                    transition: all 0.3s ease;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add tooltip to page
        document.body.appendChild(tooltip);
        
        // Remove tooltip after 5 seconds
        setTimeout(() => {
            tooltip.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => tooltip.remove(), 300);
        }, 5000);
        
        // Make tooltip dismissible on click
        tooltip.addEventListener('click', () => {
            tooltip.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => tooltip.remove(), 300);
        });
    }
    
    /**
     * Show session fallback feedback (when OAuth redirect occurs)
     */
    static showSessionFallback(dependencies) {
        const { showResult, getElement } = dependencies;
        
        // Subtle info message (not an error)
        showResult('🔄 Redirecting to Spotify for fresh authentication...', 'info');
        
        const connectBtn = getElement('connectSpotify');
        if (connectBtn) {
            connectBtn.innerHTML = '🔄 Opening Spotify login...';
            connectBtn.classList.remove('session-detecting');
        }
    }
    
    /**
     * Add session statistics to the UI (for power users)
     */
    static addSessionStatsDisplay(dependencies, sessionStats) {
        const { getElement } = dependencies;
        
        // Only show if user has connected before
        if (sessionStats.totalSessions > 1) {
            const statsContainer = getElement('sessionStats') || this.createStatsContainer();
            
            const timeSaved = sessionStats.sessionReuseCount * 7; // 7 seconds per reuse
            
            statsContainer.innerHTML = `
                <div class="session-optimization-stats">
                    <h4>🚀 Session Optimization Stats</h4>
                    <div class="stats-grid">
                        <div class="stat">
                            <span class="stat-value">${sessionStats.sessionReuseCount}</span>
                            <span class="stat-label">Sessions Reused</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${timeSaved}s</span>
                            <span class="stat-label">Time Saved</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${Math.round(sessionStats.averageDetectionTime)}ms</span>
                            <span class="stat-label">Avg Detection Time</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Create container for session statistics if it doesn't exist
     */
    static createStatsContainer() {
        const container = document.createElement('div');
        container.id = 'sessionStats';
        container.className = 'session-stats-container';
        
        // Insert after main authentication section
        const authSection = document.querySelector('.authentication-section');
        if (authSection && authSection.parentNode) {
            authSection.parentNode.insertBefore(container, authSection.nextSibling);
        }
        
        return container;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedSessionFeedback;
}