/**
 * PerformanceUIBuilders.js
 * 
 * Part 3 of 5 in the Performance API Class Extraction
 * 
 * PURPOSE:
 * Pure UI building functions for performance dashboards, memory monitors,
 * cache statistics displays, and virtual scrolling components.
 * 
 * ARCHITECTURE:
 * - Static methods only (no state)
 * - Pure DOM element generation
 * - No DOM manipulation (building only)
 * - Zero dependencies on external state
 * 
 * PATTERNS FOLLOWED:
 * - "Functional Core" - All functions are pure
 * - DOM element factory pattern
 * - Comprehensive HTML escaping and sanitization
 * - Consistent styling and structure
 * 
 * EXTRACTION CONSISTENCY:
 * This follows the exact same patterns as:
 * - AnalyticsUIBuilders.js (dashboard component generation)
 * - ArtistUIBuilders.js (profile and track UI elements)
 * - InitializationUIBuilders.js (setup and status displays)
 * - SpotifyApiUIBuilders.js (API status and error displays)
 * - RealTimeUIBuilders.js (real-time monitoring components)
 */

// Multi-environment compatibility
(function(global, factory) {
    'use strict';
    
    // Environment detection and module loading
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node.js/CommonJS environment
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD environment
        define([], factory);
    } else {
        // Browser global environment
        global.PerformanceUIBuilders = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : 
   typeof window !== 'undefined' ? window : 
   typeof global !== 'undefined' ? global : this, function() {
    
    'use strict';

    /**
     * PerformanceUIBuilders
     * 
     * Static class providing pure UI building functions for performance
     * monitoring dashboards, memory displays, cache statistics, and optimization panels.
     */
    class PerformanceUIBuilders {
        
        /**
         * Build memory statistics display panel
         * @param {Object} memoryStats - Processed memory statistics object
         * @param {Object} options - Display configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildMemoryStatsPanel(memoryStats, options = {}) {
            try {
                const {
                    showDetails = true,
                    showChart = false,
                    className = 'performance-memory-panel',
                    theme = 'light'
                } = options;

                if (!memoryStats || !memoryStats.processed) {
                    return this.buildErrorPanel('Memory statistics not available', 'memory-error');
                }

                const stats = memoryStats.statistics;
                const statusClass = `memory-status-${stats.status}`;
                const themeClass = `theme-${theme}`;

                let panelHTML = `
                    <div class="${this.escapeHTML(className)} ${statusClass} ${themeClass}">
                        <div class="performance-panel-header">
                            <h3 class="panel-title">Memory Usage</h3>
                            <span class="memory-status-badge ${statusClass}">${this.escapeHTML(stats.status)}</span>
                        </div>
                        <div class="memory-summary">
                            <div class="memory-metric">
                                <span class="metric-label">Used:</span>
                                <span class="metric-value">${this.escapeHTML(stats.used)}</span>
                            </div>
                            <div class="memory-metric">
                                <span class="metric-label">Total:</span>
                                <span class="metric-value">${this.escapeHTML(stats.total)}</span>
                            </div>
                            <div class="memory-metric">
                                <span class="metric-label">Limit:</span>
                                <span class="metric-value">${this.escapeHTML(stats.limit)}</span>
                            </div>
                            <div class="memory-percentage">
                                <div class="percentage-bar">
                                    <div class="percentage-fill ${statusClass}" style="width: ${stats.percentage}%"></div>
                                </div>
                                <span class="percentage-text">${stats.percentage}%</span>
                            </div>
                        </div>`;

                if (showDetails) {
                    panelHTML += `
                        <div class="memory-details">
                            <div class="detail-row">
                                <span>Used Bytes:</span>
                                <span>${stats.bytes.used.toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span>Total Bytes:</span>
                                <span>${stats.bytes.total.toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span>Limit Bytes:</span>
                                <span>${stats.bytes.limit.toLocaleString()}</span>
                            </div>
                        </div>`;
                }

                panelHTML += `</div>`;

                return {
                    built: true,
                    element: panelHTML,
                    metadata: {
                        type: 'memory-stats-panel',
                        status: stats.status,
                        percentage: stats.percentage,
                        theme,
                        hasDetails: showDetails
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Memory panel build failed: ${error.message}`, 'memory-build-error');
            }
        }

        /**
         * Build cache statistics display panel
         * @param {Object} cacheStats - Processed cache statistics object
         * @param {Object} options - Display configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildCacheStatsPanel(cacheStats, options = {}) {
            try {
                const {
                    showEfficiency = true,
                    showDetails = true,
                    className = 'performance-cache-panel',
                    theme = 'light'
                } = options;

                if (!cacheStats || !cacheStats.processed) {
                    return this.buildErrorPanel('Cache statistics not available', 'cache-error');
                }

                const stats = cacheStats.statistics;
                const efficiencyClass = stats.cacheEfficiency > 80 ? 'high-efficiency' : 
                                       stats.cacheEfficiency > 60 ? 'medium-efficiency' : 'low-efficiency';
                const themeClass = `theme-${theme}`;

                let panelHTML = `
                    <div class="${this.escapeHTML(className)} ${efficiencyClass} ${themeClass}">
                        <div class="performance-panel-header">
                            <h3 class="panel-title">Cache Statistics</h3>
                            <span class="cache-efficiency-badge">${stats.cacheEfficiency}% efficient</span>
                        </div>
                        <div class="cache-summary">
                            <div class="cache-metric">
                                <span class="metric-label">Total Entries:</span>
                                <span class="metric-value">${stats.totalEntries}</span>
                            </div>
                            <div class="cache-metric">
                                <span class="metric-label">Active:</span>
                                <span class="metric-value active-count">${stats.activeEntries}</span>
                            </div>
                            <div class="cache-metric">
                                <span class="metric-label">Expired:</span>
                                <span class="metric-value expired-count">${stats.expiredEntries}</span>
                            </div>
                            <div class="cache-metric">
                                <span class="metric-label">Pending:</span>
                                <span class="metric-value pending-count">${stats.pendingRequests}</span>
                            </div>
                        </div>`;

                if (showEfficiency) {
                    panelHTML += `
                        <div class="cache-efficiency">
                            <div class="efficiency-bar">
                                <div class="efficiency-fill ${efficiencyClass}" style="width: ${stats.cacheEfficiency}%"></div>
                            </div>
                            <span class="efficiency-text">Cache Efficiency: ${stats.cacheEfficiency}%</span>
                        </div>`;
                }

                if (showDetails) {
                    panelHTML += `
                        <div class="cache-details">
                            <div class="detail-row">
                                <span>Total Data Size:</span>
                                <span>${stats.totalDataSize} KB</span>
                            </div>
                            <div class="detail-row">
                                <span>Average Entry Size:</span>
                                <span>${stats.averageEntrySize} KB</span>
                            </div>
                        </div>`;
                }

                panelHTML += `</div>`;

                return {
                    built: true,
                    element: panelHTML,
                    metadata: {
                        type: 'cache-stats-panel',
                        efficiency: stats.cacheEfficiency,
                        totalEntries: stats.totalEntries,
                        activeEntries: stats.activeEntries,
                        theme
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Cache panel build failed: ${error.message}`, 'cache-build-error');
            }
        }

        /**
         * Build performance timing display
         * @param {Object} timingData - Processed performance timing object
         * @param {Object} options - Display configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildPerformanceTimingDisplay(timingData, options = {}) {
            try {
                const {
                    showChart = false,
                    showBenchmarks = true,
                    className = 'performance-timing-display',
                    theme = 'light'
                } = options;

                if (!timingData || !timingData.processed) {
                    return this.buildErrorPanel('Performance timing not available', 'timing-error');
                }

                const timing = timingData.timing;
                const themeClass = `theme-${theme}`;

                // Determine performance rating
                const pageLoadMs = timing.values.pageLoad;
                let performanceRating = 'excellent';
                if (pageLoadMs > 3000) performanceRating = 'poor';
                else if (pageLoadMs > 1500) performanceRating = 'moderate';
                else if (pageLoadMs > 500) performanceRating = 'good';

                let displayHTML = `
                    <div class="${this.escapeHTML(className)} performance-${performanceRating} ${themeClass}">
                        <div class="performance-panel-header">
                            <h3 class="panel-title">Performance Timing</h3>
                            <span class="performance-rating-badge ${performanceRating}">${performanceRating}</span>
                        </div>
                        <div class="timing-metrics">
                            <div class="timing-metric">
                                <span class="metric-label">Page Load:</span>
                                <span class="metric-value">${this.escapeHTML(timing.pageLoad)}</span>
                            </div>
                            <div class="timing-metric">
                                <span class="metric-label">DOM Ready:</span>
                                <span class="metric-value">${this.escapeHTML(timing.domReady)}</span>
                            </div>
                            <div class="timing-metric">
                                <span class="metric-label">First Paint:</span>
                                <span class="metric-value">${this.escapeHTML(timing.firstPaint)}</span>
                            </div>
                        </div>`;

                if (showBenchmarks) {
                    displayHTML += `
                        <div class="timing-benchmarks">
                            <div class="benchmark-row">
                                <span class="benchmark-label">Excellent:</span>
                                <span class="benchmark-value">&lt; 500ms</span>
                            </div>
                            <div class="benchmark-row">
                                <span class="benchmark-label">Good:</span>
                                <span class="benchmark-value">500ms - 1.5s</span>
                            </div>
                            <div class="benchmark-row">
                                <span class="benchmark-label">Moderate:</span>
                                <span class="benchmark-value">1.5s - 3s</span>
                            </div>
                            <div class="benchmark-row">
                                <span class="benchmark-label">Poor:</span>
                                <span class="benchmark-value">&gt; 3s</span>
                            </div>
                        </div>`;
                }

                displayHTML += `</div>`;

                return {
                    built: true,
                    element: displayHTML,
                    metadata: {
                        type: 'performance-timing-display',
                        rating: performanceRating,
                        pageLoadMs,
                        domReadyMs: timing.values.domReady,
                        theme
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Timing display build failed: ${error.message}`, 'timing-build-error');
            }
        }

        /**
         * Build virtual scrolling container
         * @param {Object} rangeData - Calculated visible range data
         * @param {Array} items - Items to render
         * @param {Function} itemRenderer - Function to render individual items
         * @param {Object} options - Container configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildVirtualScrollContainer(rangeData, items = [], itemRenderer = null, options = {}) {
            try {
                const {
                    containerHeight = 400,
                    itemHeight = 60,
                    className = 'virtual-scroll-container',
                    showScrollbar = true,
                    theme = 'light'
                } = options;

                if (!rangeData || !rangeData.calculated) {
                    return this.buildErrorPanel('Virtual scroll range not calculated', 'virtual-scroll-error');
                }

                if (!Array.isArray(items)) {
                    return this.buildErrorPanel('Items must be an array', 'virtual-scroll-items-error');
                }

                const range = rangeData.range;
                const themeClass = `theme-${theme}`;
                const scrollbarClass = showScrollbar ? 'show-scrollbar' : 'hide-scrollbar';

                let containerHTML = `
                    <div class="${this.escapeHTML(className)} ${themeClass} ${scrollbarClass}" 
                         style="height: ${containerHeight}px; overflow-y: auto;">
                        <div class="virtual-scroll-spacer" 
                             style="height: ${range.totalHeight}px; position: relative;">
                            <div class="virtual-scroll-viewport" 
                                 style="position: absolute; top: ${range.start * itemHeight}px; width: 100%;">`;

                // Render visible items
                for (let i = range.start; i < range.end && i < items.length; i++) {
                    const item = items[i];
                    let itemHTML = '';

                    if (typeof itemRenderer === 'function') {
                        try {
                            itemHTML = itemRenderer(item, i);
                        } catch (renderError) {
                            itemHTML = `<div class="virtual-item-error">Item ${i}: Render error</div>`;
                        }
                    } else {
                        // Default item renderer
                        itemHTML = `
                            <div class="virtual-scroll-item" style="height: ${itemHeight}px;">
                                <div class="item-content">
                                    ${typeof item === 'object' ? this.escapeHTML(JSON.stringify(item)) : this.escapeHTML(String(item))}
                                </div>
                            </div>`;
                    }

                    containerHTML += itemHTML;
                }

                containerHTML += `
                            </div>
                        </div>
                    </div>`;

                return {
                    built: true,
                    element: containerHTML,
                    metadata: {
                        type: 'virtual-scroll-container',
                        visibleRange: {
                            start: range.start,
                            end: range.end,
                            count: range.end - range.start
                        },
                        totalItems: items.length,
                        containerHeight,
                        itemHeight,
                        theme
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Virtual scroll build failed: ${error.message}`, 'virtual-scroll-build-error');
            }
        }

        /**
         * Build performance dashboard summary
         * @param {Object} summaryData - Combined performance data
         * @param {Object} options - Dashboard configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildPerformanceDashboard(summaryData, options = {}) {
            try {
                const {
                    sections = ['memory', 'cache', 'timing'],
                    className = 'performance-dashboard',
                    theme = 'light',
                    compact = false
                } = options;

                const themeClass = `theme-${theme}`;
                const compactClass = compact ? 'compact-view' : 'full-view';

                let dashboardHTML = `
                    <div class="${this.escapeHTML(className)} ${themeClass} ${compactClass}">
                        <div class="dashboard-header">
                            <h2 class="dashboard-title">Performance Dashboard</h2>
                            <div class="dashboard-timestamp">
                                Last updated: ${new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        <div class="dashboard-sections">`;

                // Build requested sections
                sections.forEach(section => {
                    switch (section) {
                        case 'memory':
                            if (summaryData.memory) {
                                const memoryPanel = this.buildMemoryStatsPanel(summaryData.memory, { theme, showDetails: !compact });
                                if (memoryPanel.built) {
                                    dashboardHTML += `<div class="dashboard-section">${memoryPanel.element}</div>`;
                                }
                            }
                            break;
                        case 'cache':
                            if (summaryData.cache) {
                                const cachePanel = this.buildCacheStatsPanel(summaryData.cache, { theme, showDetails: !compact });
                                if (cachePanel.built) {
                                    dashboardHTML += `<div class="dashboard-section">${cachePanel.element}</div>`;
                                }
                            }
                            break;
                        case 'timing':
                            if (summaryData.timing) {
                                const timingDisplay = this.buildPerformanceTimingDisplay(summaryData.timing, { theme, showBenchmarks: !compact });
                                if (timingDisplay.built) {
                                    dashboardHTML += `<div class="dashboard-section">${timingDisplay.element}</div>`;
                                }
                            }
                            break;
                    }
                });

                dashboardHTML += `
                        </div>
                    </div>`;

                return {
                    built: true,
                    element: dashboardHTML,
                    metadata: {
                        type: 'performance-dashboard',
                        sections,
                        theme,
                        compact,
                        buildTimestamp: new Date().toISOString()
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Dashboard build failed: ${error.message}`, 'dashboard-build-error');
            }
        }

        /**
         * Build cache cleanup display
         * @param {Object} cleanupData - Processed cache cleanup data
         * @param {Object} options - Display configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildCacheCleanupDisplay(cleanupData, options = {}) {
            try {
                const {
                    showExpiredKeys = true,
                    maxKeysShown = 5,
                    className = 'cache-cleanup-display',
                    theme = 'light'
                } = options;

                if (!cleanupData || !cleanupData.processed) {
                    return this.buildErrorPanel('Cache cleanup data not available', 'cleanup-error');
                }

                const cleanup = cleanupData.cleanup;
                const themeClass = `theme-${theme}`;

                let displayHTML = `
                    <div class="${this.escapeHTML(className)} ${themeClass}">
                        <div class="cleanup-header">
                            <h3 class="cleanup-title">Cache Cleanup Analysis</h3>
                        </div>
                        <div class="cleanup-summary">
                            <div class="cleanup-metric">
                                <span class="metric-label">Expired Entries:</span>
                                <span class="metric-value expired">${cleanup.expiredCount}</span>
                            </div>
                            <div class="cleanup-metric">
                                <span class="metric-label">Active Entries:</span>
                                <span class="metric-value active">${cleanup.activeCount}</span>
                            </div>
                            <div class="cleanup-metric">
                                <span class="metric-label">Space to Reclaim:</span>
                                <span class="metric-value savings">${cleanup.spaceSavings} KB</span>
                            </div>
                        </div>`;

                if (showExpiredKeys && cleanup.expiredKeys.length > 0) {
                    displayHTML += `
                        <div class="expired-keys-section">
                            <h4 class="section-title">Expired Keys (showing ${Math.min(maxKeysShown, cleanup.expiredKeys.length)})</h4>
                            <div class="expired-keys-list">`;

                    cleanup.expiredKeys.slice(0, maxKeysShown).forEach(keyData => {
                        displayHTML += `
                            <div class="expired-key-item">
                                <span class="key-name">${this.escapeHTML(keyData.key)}</span>
                                <span class="key-size">${(keyData.size / 1024).toFixed(2)} KB</span>
                                <span class="key-age">${Math.round(keyData.ageMs / 1000)}s ago</span>
                            </div>`;
                    });

                    displayHTML += `
                            </div>
                        </div>`;
                }

                if (cleanup.nextExpiryIn) {
                    displayHTML += `
                        <div class="next-expiry">
                            <span class="expiry-label">Next expiry in:</span>
                            <span class="expiry-time">${Math.round(cleanup.nextExpiryIn / 1000)}s</span>
                        </div>`;
                }

                displayHTML += `</div>`;

                return {
                    built: true,
                    element: displayHTML,
                    metadata: {
                        type: 'cache-cleanup-display',
                        expiredCount: cleanup.expiredCount,
                        spaceSavings: cleanup.spaceSavings,
                        theme
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Cleanup display build failed: ${error.message}`, 'cleanup-build-error');
            }
        }

        /**
         * Build throttle configuration display
         * @param {Object} throttleConfig - Processed throttle configuration
         * @param {Object} options - Display configuration options
         * @returns {Object} Built UI element with metadata
         */
        static buildThrottleConfigDisplay(throttleConfig, options = {}) {
            try {
                const {
                    showRecommendations = true,
                    className = 'throttle-config-display',
                    theme = 'light'
                } = options;

                if (!throttleConfig || !throttleConfig.processed) {
                    return this.buildErrorPanel('Throttle configuration not available', 'throttle-error');
                }

                const config = throttleConfig.configuration;
                const themeClass = `theme-${theme}`;
                const priorityClass = `priority-${config.priority}`;

                let displayHTML = `
                    <div class="${this.escapeHTML(className)} ${themeClass} ${priorityClass}">
                        <div class="throttle-header">
                            <h3 class="throttle-title">Throttle Configuration</h3>
                            <span class="priority-badge ${priorityClass}">${config.priority} priority</span>
                        </div>
                        <div class="throttle-details">
                            <div class="config-metric">
                                <span class="metric-label">Delay:</span>
                                <span class="metric-value">${config.delay}ms</span>
                            </div>
                            <div class="config-metric">
                                <span class="metric-label">Frequency:</span>
                                <span class="metric-value">${this.escapeHTML(config.frequency)}</span>
                            </div>
                            <div class="config-metric">
                                <span class="metric-label">Max Executions/sec:</span>
                                <span class="metric-value">${config.settings.maxExecutionsPerSecond}</span>
                            </div>
                        </div>`;

                if (showRecommendations) {
                    displayHTML += `
                        <div class="throttle-recommendations">
                            <div class="recommendation-status ${config.recommended ? 'recommended' : 'not-recommended'}">
                                ${config.recommended ? '✓ Optimal configuration' : '⚠ Consider adjusting settings'}
                            </div>
                            <div class="recommendation-details">
                                <div class="recommendation-item">
                                    Use setTimeout: ${config.settings.useTimeout ? 'Yes' : 'No'}
                                </div>
                                <div class="recommendation-item">
                                    Use requestAnimationFrame: ${config.settings.useRequestAnimationFrame ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </div>`;
                }

                displayHTML += `</div>`;

                return {
                    built: true,
                    element: displayHTML,
                    metadata: {
                        type: 'throttle-config-display',
                        delay: config.delay,
                        priority: config.priority,
                        recommended: config.recommended,
                        theme
                    }
                };
            } catch (error) {
                return this.buildErrorPanel(`Throttle config build failed: ${error.message}`, 'throttle-build-error');
            }
        }

        /**
         * Build error display panel
         * @param {string} errorMessage - Error message to display
         * @param {string} errorType - Type of error for styling
         * @returns {Object} Built error UI element
         */
        static buildErrorPanel(errorMessage, errorType = 'general-error') {
            const safeMessage = this.escapeHTML(errorMessage);
            const safeType = this.escapeHTML(errorType);

            return {
                built: true,
                element: `
                    <div class="performance-error-panel ${safeType}">
                        <div class="error-icon">⚠</div>
                        <div class="error-message">${safeMessage}</div>
                        <div class="error-timestamp">${new Date().toLocaleTimeString()}</div>
                    </div>`,
                metadata: {
                    type: 'error-panel',
                    errorType: safeType,
                    isError: true,
                    timestamp: new Date().toISOString()
                }
            };
        }

        /**
         * Escape HTML to prevent XSS attacks
         * @param {string} unsafe - Unsafe HTML string
         * @returns {string} HTML-escaped safe string
         */
        static escapeHTML(unsafe) {
            if (typeof unsafe !== 'string') {
                return String(unsafe);
            }
            
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        /**
         * Get module information for documentation and debugging
         * @returns {Object} Module information including version and capabilities
         */
        static getModuleInfo() {
            return {
                name: 'PerformanceUIBuilders',
                version: '1.0.0',
                extractionPhase: 'API Class Extraction',
                architecture: 'Functional Core, Imperative Shell',
                functionCount: 9,
                functionTypes: 'Pure UI building functions only',
                dependencies: 'Zero dependencies',
                capabilities: [
                    'Memory statistics panel building',
                    'Cache statistics panel building',
                    'Performance timing display building',
                    'Virtual scrolling container building',
                    'Performance dashboard building',
                    'Cache cleanup display building',
                    'Throttle configuration display building',
                    'Error panel building',
                    'HTML escaping and sanitization'
                ],
                extractedAt: new Date().toISOString(),
                extractedBy: 'API Class Extraction Methodology v1.0'
            };
        }
    }

    // Return the class for module systems
    return PerformanceUIBuilders;
});