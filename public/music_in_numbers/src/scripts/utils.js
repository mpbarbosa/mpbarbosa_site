/**
 * Utils Module - Backward Compatible Delegation Wrapper
 * Part of the Music in Numbers modular architecture
 * 
 * This file maintains 100% backward compatibility with the original utils.js
 * while delegating to the extracted modular classes when available.
 * Falls back to legacy implementations when modular classes are not loaded.
 */

// ===== EXTRACTED CLASS IMPORTS =====
// Import modular classes when available
let UtilsValidators, UtilsProcessors, UtilsBuilders, UtilsCore, UtilsUtilities;

try {
    // Try to import classes (works in module environments)
    if (typeof require !== 'undefined') {
        UtilsValidators = require('./utils/UtilsValidators.js');
        UtilsProcessors = require('./utils/UtilsProcessors.js');
        UtilsBuilders = require('./utils/UtilsBuilders.js');
        UtilsCore = require('./utils/UtilsCore.js');
        UtilsUtilities = require('./utils/UtilsUtilities.js');
    }
} catch (error) {
    // Classes not available, will use fallback implementations
    console.info('Utils modular classes not available, using fallback implementations');
}

// Try to get classes from global scope (browser environment)
if (typeof window !== 'undefined') {
    UtilsValidators = UtilsValidators || window.UtilsValidators;
    UtilsProcessors = UtilsProcessors || window.UtilsProcessors;
    UtilsBuilders = UtilsBuilders || window.UtilsBuilders;
    UtilsCore = UtilsCore || window.UtilsCore;
    UtilsUtilities = UtilsUtilities || window.UtilsUtilities;
}

// ===== DEPENDENCY MANAGEMENT =====
let utilsDependencies = null;

function ensureUtilsDependencies() {
    if (!utilsDependencies) {
        if (UtilsUtilities && typeof UtilsUtilities.createAutoDependencies === 'function') {
            // Create auto-detected dependencies with application-specific overrides
            utilsDependencies = UtilsUtilities.createAutoDependencies({
                getValidAccessToken: typeof getValidAccessToken === 'function' ? getValidAccessToken : () => null,
                showResult: showResult  // Self-reference for delegation
            });
        } else {
            // Fallback dependencies for legacy mode
            utilsDependencies = {
                getElementById: (id) => document.getElementById(id),
                createElement: (tagName) => document.createElement(tagName),
                createBlob: (blobParams) => new Blob([blobParams.content], blobParams.options),
                createObjectURL: (blob) => URL.createObjectURL(blob),
                revokeObjectURL: (url) => URL.revokeObjectURL(url),
                setTimeout: (callback, delay) => setTimeout(callback, delay),
                window: window,
                document: document,
                crypto: crypto,
                btoa: btoa,
                getValidAccessToken: typeof getValidAccessToken === 'function' ? getValidAccessToken : () => null
            };
        }
    }
    return utilsDependencies;
}

// ===== EXPORTED FUNCTIONS WITH DELEGATION =====

/**
 * Generate code challenge from verifier
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
async function generateCodeChallenge(verifier) {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.generateCodeChallengeCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = await UtilsCore.generateCodeChallengeCore(dependencies, verifier);
        if (result.success) {
            return result.challenge;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Export analytics data as JSON
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
async function exportAnalytics() {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.exportAnalyticsCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = await UtilsCore.exportAnalyticsCore(dependencies);
        if (result.success) {
            return result;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const analyticsDiv = document.getElementById('musicAnalytics');
    if (!analyticsDiv) {
        showResult('No analytics data to export', 'error');
        return;
    }

    const exportData = {
        timestamp: new Date().toISOString(),
        user: document.getElementById('userName').textContent,
        timeRange: document.getElementById('timeRangeSelector')?.value || 'medium_term',
        note: 'This is a demo export. In a full implementation, this would contain the actual analytics data.'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `spotify-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showResult('Analytics data exported successfully!', 'success');
}

/**
 * Generate shareable music statistics card
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
async function generateShareableCard() {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.generateShareableCardCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = await UtilsCore.generateShareableCardCore(dependencies);
        if (result.success) {
            return result;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1DB954';
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('My Spotify Stats', 50, 60);

    ctx.font = '16px Arial';
    const userName = document.getElementById('userName').textContent;
    ctx.fillText(`User: ${userName}`, 50, 100);
    ctx.fillText('Generated by Music in Numbers', 50, 350);

    const link = document.createElement('a');
    link.download = 'my-spotify-stats.png';
    link.href = canvas.toDataURL();
    link.click();

    showResult('Shareable card generated! Check your downloads.', 'success');
}

/**
 * Export advanced analytics data
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
async function exportAdvancedAnalytics() {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.exportAdvancedAnalyticsCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = await UtilsCore.exportAdvancedAnalyticsCore(dependencies);
        if (result.success) {
            return result;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const token = getValidAccessToken();
    if (!token) {
        showResult('No valid access token for export', 'error');
        return;
    }

    const analyticsData = window.currentAnalyticsData || {};

    const exportData = {
        timestamp: new Date().toISOString(),
        user: {
            name: document.getElementById('userName').textContent,
            country: document.getElementById('userCountry').textContent
        },
        analytics: analyticsData,
        metadata: {
            exportVersion: '3.0',
            source: 'Music in Numbers - Advanced Analytics',
            timeRange: document.getElementById('timeRangeSelector').value
        }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `spotify-advanced-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showResult('✅ Advanced analytics exported successfully!', 'success');
}

/**
 * Generate detailed insight report
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
async function generateInsightReport() {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.generateInsightReportCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = await UtilsCore.generateInsightReportCore(dependencies);
        if (result.success) {
            return result;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const analytics = window.currentAnalyticsData?.analytics;
    if (!analytics) {
        showResult('No analytics data available for report generation', 'error');
        return;
    }

    const report = `
# Your Music Listening Report
Generated on ${new Date().toLocaleDateString()}

## 🎭 Music Personality Profile
- **Listener Type**: ${analytics.musicPersonality.explorationLevel}
- **Diversity Level**: ${analytics.musicPersonality.diversityScore}
- **Listening Pattern**: ${analytics.musicPersonality.consistencyPattern}
- **Social Tendency**: ${analytics.musicPersonality.socialListener}
- **Preferred Time**: ${analytics.musicPersonality.preferredListeningTime}

## 🧠 Mood Analysis
- **Current Mood**: ${analytics.moodAnalysis.mood}
- **Happiness Level**: ${Math.round(analytics.moodAnalysis.happiness)}%
- **Energy Level**: ${Math.round(analytics.moodAnalysis.energy)}%
- **Danceability**: ${Math.round(analytics.moodAnalysis.danceability)}%
- **Acoustic Preference**: ${Math.round(analytics.moodAnalysis.acousticness)}%

## 📊 Listening Statistics
- **Total Tracks Analyzed**: ${analytics.totalTracks}
- **Unique Artists**: ${analytics.uniqueArtists}
- **Total Listening Time**: ${analytics.totalListeningTime} minutes
- **Average Track Length**: ${Math.floor(analytics.averageTrackLength / 60)}:${(analytics.averageTrackLength % 60).toString().padStart(2, '0')}
- **Skip Rate**: ${analytics.listeningPatterns.skipRate}%
- **Repeat Rate**: ${analytics.listeningPatterns.repeatRate}%

## 🕐 Time Patterns
- **Peak Listening Hours**: ${analytics.listeningPatterns.peakHours.join(' and ')}
- **Favorite Day**: ${analytics.listeningPatterns.weekdayPreference}
- **Average Session Length**: ${analytics.listeningPatterns.sessionLength} tracks

## 📈 Trends
- **Listening Trend**: ${analytics.trendAnalysis.trend}
- **Daily Average**: ${Math.round(analytics.trendAnalysis.dailyAverage)} tracks
- **Most Active Day**: ${new Date(analytics.trendAnalysis.peakDay[0]).toLocaleDateString()}

## 🎪 Top Genres
${analytics.topGenres.slice(0, 5).map((genre, i) => `${i + 1}. ${genre.genre} (${genre.count} tracks)`).join('\n')}

---
Generated by Music in Numbers - Advanced Analytics Engine
    `.trim();

    const reportBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(reportBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `music-insight-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showResult('📝 Insight report generated successfully!', 'success');
}

/**
 * Show result message with accessibility features
 * BACKWARD COMPATIBLE: Original function signature preserved
 */
function showResult(message, type) {
    // Try modular approach first
    if (UtilsCore && typeof UtilsCore.showResultCore === 'function') {
        const dependencies = ensureUtilsDependencies();
        const result = UtilsCore.showResultCore(dependencies, message, type);
        if (result.success) {
            return result;
        }
        // If modular approach fails, fall back to legacy
    }

    // Legacy implementation
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = 'result ' + type;
    resultDiv.style.display = 'block';

    resultDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    resultDiv.setAttribute('aria-live', 'polite');
    resultDiv.setAttribute('aria-atomic', 'true');

    const icon = type === 'error' ? '❌ ' : 
                type === 'success' ? '✅ ' : 
                type === 'warning' ? '⚠️ ' : 'ℹ️ ';
    resultDiv.textContent = icon + message;

    resultDiv.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
    });

    if (type === 'error') {
        resultDiv.setAttribute('tabindex', '-1');
        resultDiv.focus();

        setTimeout(() => {
            resultDiv.removeAttribute('tabindex');
        }, 1000);
    }

    if (type !== 'error') {
        setTimeout(() => {
            if (resultDiv.style.display === 'block') {
                resultDiv.style.display = 'none';
            }
        }, 5000);
    }
}

// ===== MODULE EXPORTS =====
// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCodeChallenge,
        exportAnalytics,
        generateShareableCard,
        exportAdvancedAnalytics,
        generateInsightReport,
        showResult,
        // Also export the classes if available
        UtilsValidators,
        UtilsProcessors,
        UtilsBuilders,
        UtilsCore,
        UtilsUtilities
    };
}