// ===== ANALYTICS MODULE WITH MODULAR ARCHITECTURE =====
// This file provides backward-compatible delegation wrappers that maintain
// the existing API while leveraging the new modular class-based architecture.
// 
// Architecture Overview:
// - AnalyticsValidators: Pure validation functions
// - AnalyticsProcessors: Pure data processing functions  
// - AnalyticsUIBuilders: Pure UI building functions
// - AnalyticsCore: Impure orchestration with dependency injection
// - AnalyticsUtilities: Dependency injection factory and utilities
// 
// All original function signatures are preserved for backward compatibility.

// Initialize analytics dependencies (will be set up when page loads)
let analyticsDependencies = null;

// Initialize analytics dependencies - called from main initialization
function initializeAnalyticsDependencies() {
    // Create dependency container with required functions
    analyticsDependencies = AnalyticsUtilities.createAnalyticsDependencyContainer({
        // Spotify API functions (injected from spotify-api.js)
        getTopTracks: typeof getTopTracks !== 'undefined' ? getTopTracks : null,
        getTopArtists: typeof getTopArtists !== 'undefined' ? getTopArtists : null,
        getRecentlyPlayed: typeof getRecentlyPlayed !== 'undefined' ? getRecentlyPlayed : null,
        getCurrentPlayback: typeof getCurrentPlayback !== 'undefined' ? getCurrentPlayback : null,
        getAudioFeatures: typeof getAudioFeatures !== 'undefined' ? getAudioFeatures : null,
        getValidAccessToken: typeof getValidAccessToken !== 'undefined' ? getValidAccessToken : null,
        
        // UI utility functions (injected from ui-components.js)
        showResult: typeof showResult !== 'undefined' ? showResult : null
    });
}

// Ensure dependencies are initialized
function ensureAnalyticsDependencies() {
    if (!analyticsDependencies) {
        initializeAnalyticsDependencies();
    }
    return analyticsDependencies;
}

// ===== BACKWARD-COMPATIBLE DELEGATION WRAPPERS =====

/**
 * BACKWARD COMPATIBLE: Analyze listening patterns with advanced features
 * Delegates to AnalyticsProcessors.analyzeListeningPatterns (pure function)
 */
function analyzeListeningPatterns(recentlyPlayed, audioFeatures = [], topTracks = [], topArtists = []) {
    return AnalyticsProcessors.analyzeListeningPatterns(recentlyPlayed, audioFeatures, topTracks, topArtists);
}

/**
 * BACKWARD COMPATIBLE: Calculate average of array values
 * Delegates to AnalyticsProcessors.calculateAverage (pure function)
 */
function calculateAverage(arr) {
    return AnalyticsProcessors.calculateAverage(arr);
}

/**
 * BACKWARD COMPATIBLE: Determine mood from metrics
 * Delegates to AnalyticsProcessors.determineMood (pure function)
 */
function determineMood(metrics) {
    return AnalyticsProcessors.determineMood(metrics);
}

/**
 * BACKWARD COMPATIBLE: Calculate exploration level
 * Delegates to AnalyticsProcessors.calculateExplorationLevel (pure function)
 */
function calculateExplorationLevel(uniqueArtists, totalTracks) {
    return AnalyticsProcessors.calculateExplorationLevel(uniqueArtists, totalTracks);
}

/**
 * BACKWARD COMPATIBLE: Calculate diversity score
 * Delegates to AnalyticsProcessors.calculateDiversityScore (pure function)
 */
function calculateDiversityScore(genres) {
    return AnalyticsProcessors.calculateDiversityScore(genres);
}

/**
 * BACKWARD COMPATIBLE: Calculate consistency pattern
 * Delegates to AnalyticsProcessors.calculateConsistencyPattern (pure function)
 */
function calculateConsistencyPattern(listeningTimes) {
    return AnalyticsProcessors.calculateConsistencyPattern(listeningTimes);
}

/**
 * BACKWARD COMPATIBLE: Find preferred listening time
 * Delegates to AnalyticsProcessors.findPreferredTime (pure function)
 */
function findPreferredTime(listeningTimes) {
    return AnalyticsProcessors.findPreferredTime(listeningTimes);
}

/**
 * BACKWARD COMPATIBLE: Determine social tendency
 * Delegates to AnalyticsProcessors.determineSocialTendency (pure function)
 */
function determineSocialTendency(metrics) {
    return AnalyticsProcessors.determineSocialTendency(metrics);
}

/**
 * BACKWARD COMPATIBLE: Find peak listening hours
 * Delegates to AnalyticsProcessors.findPeakListeningHours (pure function)
 */
function findPeakListeningHours(listeningTimes) {
    return AnalyticsProcessors.findPeakListeningHours(listeningTimes);
}

/**
 * BACKWARD COMPATIBLE: Find weekday preference
 * Delegates to AnalyticsProcessors.findWeekdayPreference (pure function)
 */
function findWeekdayPreference(weekdayPattern) {
    return AnalyticsProcessors.findWeekdayPreference(weekdayPattern);
}

/**
 * BACKWARD COMPATIBLE: Calculate average session length
 * Delegates to AnalyticsProcessors.calculateAverageSessionLength (pure function)
 */
function calculateAverageSessionLength(tracks) {
    return AnalyticsProcessors.calculateAverageSessionLength(tracks);
}

/**
 * BACKWARD COMPATIBLE: Calculate skip rate
 * Delegates to AnalyticsProcessors.calculateSkipRate (pure function)
 */
function calculateSkipRate(tracks) {
    return AnalyticsProcessors.calculateSkipRate(tracks);
}

/**
 * BACKWARD COMPATIBLE: Calculate repeat rate
 * Delegates to AnalyticsProcessors.calculateRepeatRate (pure function)
 */
function calculateRepeatRate(tracks) {
    return AnalyticsProcessors.calculateRepeatRate(tracks);
}

/**
 * BACKWARD COMPATIBLE: Calculate trend analysis
 * Delegates to AnalyticsProcessors.calculateTrendAnalysis (pure function)
 */
function calculateTrendAnalysis(tracks) {
    return AnalyticsProcessors.calculateTrendAnalysis(tracks);
}

/**
 * BACKWARD COMPATIBLE: Load and display comprehensive music analytics with advanced features
 * Delegates to AnalyticsCore.runCompleteAnalyticsWorkflowCore with dependency injection
 */
async function loadMusicAnalytics(accessToken) {
    const dependencies = ensureAnalyticsDependencies();
    const result = await AnalyticsCore.runCompleteAnalyticsWorkflowCore(dependencies, accessToken);
    
    if (!result.success) {
        throw new Error(result.error);
    }
    
    return result.data;
}

/**
 * BACKWARD COMPATIBLE: Refresh analytics data
 * Delegates to AnalyticsCore.refreshAnalyticsCore with dependency injection
 */
async function refreshAnalytics() {
    const dependencies = ensureAnalyticsDependencies();
    const result = await AnalyticsCore.refreshAnalyticsCore(dependencies);
    
    if (!result.success) {
        console.error('Failed to refresh analytics:', result.error);
    }
    
    return result;
}

/**
 * BACKWARD COMPATIBLE: Update analytics based on selected time range
 * Delegates to AnalyticsCore.updateAnalyticsTimeRangeCore with dependency injection
 */
async function updateAnalyticsTimeRange() {
    const dependencies = ensureAnalyticsDependencies();
    const timeRange = document.getElementById('timeRangeSelector')?.value || 'medium_term';
    
    const result = await AnalyticsCore.updateAnalyticsTimeRangeCore(dependencies, timeRange);
    
    if (!result.success) {
        console.error('Failed to update analytics time range:', result.error);
    }
    
    return result;
}

/**
 * BACKWARD COMPATIBLE: Update just the top tracks and artists content
 * Delegates to AnalyticsCore.updateTopContentCore with dependency injection
 */
function updateTopContent(topTracks, topArtists) {
    const dependencies = ensureAnalyticsDependencies();
    const result = AnalyticsCore.updateTopContentCore(dependencies, topTracks, topArtists);
    
    if (!result.success) {
        console.error('Failed to update top content:', result.error);
    }
    
    return result;
}

// ===== BACKWARD-COMPATIBLE UI DISPLAY DELEGATION WRAPPERS =====

/**
 * BACKWARD COMPATIBLE: Generate the complete analytics HTML template
 * Delegates to AnalyticsUIBuilders.generateAnalyticsHTML (pure function)
 */
function generateAnalyticsHTML(data) {
    return AnalyticsUIBuilders.generateAnalyticsHTML(data);
}

/**
 * BACKWARD COMPATIBLE: Initialize the analytics display in the DOM
 * Delegates to AnalyticsCore.initializeAnalyticsDisplayCore with dependency injection
 */
function initializeAnalyticsDisplay(analyticsHtml, data) {
    const dependencies = ensureAnalyticsDependencies();
    const result = AnalyticsCore.initializeAnalyticsDisplayCore(dependencies, analyticsHtml, data);
    
    if (!result.success) {
        console.error('Failed to initialize analytics display:', result.error);
    }
    
    return result;
}

/**
 * BACKWARD COMPATIBLE: Setup performance optimizations for analytics
 * Delegates to AnalyticsCore.setupAnalyticsOptimizationsCore with dependency injection
 */
function setupAnalyticsOptimizations(data) {
    const dependencies = ensureAnalyticsDependencies();
    const result = AnalyticsCore.setupAnalyticsOptimizationsCore(dependencies, data);
    
    if (!result.success) {
        console.warn('Failed to setup analytics optimizations:', result.error);
    }
    
    return result;
}

/**
 * BACKWARD COMPATIBLE: Main display function - now uses modular helpers
 * Delegates to AnalyticsCore.displayAdvancedMusicAnalyticsCore with dependency injection
 */
function displayAdvancedMusicAnalytics(data) {
    const dependencies = ensureAnalyticsDependencies();
    const result = AnalyticsCore.displayAdvancedMusicAnalyticsCore(dependencies, data);
    
    if (!result.success) {
        console.error('Failed to display advanced music analytics:', result.error);
    }
    
    return result;
}

// ===== AUTOMATIC DEPENDENCY INITIALIZATION =====
// Initialize analytics dependencies when DOM is ready or immediately if already loaded
(function initializeWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnalyticsDependencies);
    } else {
        // DOM already loaded
        initializeAnalyticsDependencies();
    }
})();
