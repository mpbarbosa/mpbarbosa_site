// ===== DATA EXPORT UTILITIES CLASS =====
// Dependency injection factory and utilities for data export operations
// Part of the Data Export modular architecture following "Functional Core, Imperative Shell" pattern

/**
 * DataExportUtilities - Dependency injection factory and utility functions
 * 
 * This class provides the dependency injection containers and utility functions needed
 * for the data export system. It creates appropriate dependencies for different environments
 * (production, development, testing) and provides infrastructure utilities.
 * 
 * @class DataExportUtilities
 */
class DataExportUtilities {
    
    /**
     * Create production dependency container with real implementations
     * @param {object} customDependencies - Custom dependency overrides
     * @returns {object} Complete dependency container for production use
     */
    static createProductionDependencyContainer(customDependencies = {}) {
        const container = {
            // ===== DOM MANIPULATION DEPENDENCIES =====
            getElementById: (id) => document.getElementById(id),
            querySelector: (selector) => document.querySelector(selector),
            querySelectorAll: (selector) => document.querySelectorAll(selector),
            addEventListener: (event, handler) => document.addEventListener(event, handler),
            removeEventListener: (event, handler) => document.removeEventListener(event, handler),
            
            // ===== DATA ACCESS DEPENDENCIES =====
            getCurrentAnalyticsData: () => {
                // Try multiple global data sources
                return window.currentAnalyticsData || 
                       window.analyticsData || 
                       window.musicAnalyticsData || 
                       null;
            },
            
            // ===== FILE OPERATIONS DEPENDENCIES =====
            createBlob: (content, mimeType) => {
                try {
                    return new Blob([content], { type: mimeType });
                } catch (error) {
                    return null;
                }
            },
            
            downloadFile: (content, filename, format) => {
                try {
                    if (content instanceof Blob) {
                        DataExportUtilities.downloadBlob(content, filename);
                    } else if (content.save && typeof content.save === 'function') {
                        // jsPDF or similar object with save method
                        content.save(filename);
                    } else {
                        // Fallback to blob creation
                        const mimeTypes = {
                            pdf: 'application/pdf',
                            csv: 'text/csv;charset=utf-8;',
                            json: 'application/json;charset=utf-8;',
                            zip: 'application/zip'
                        };
                        const mimeType = mimeTypes[format] || 'application/octet-stream';
                        const blob = new Blob([content], { type: mimeType });
                        DataExportUtilities.downloadBlob(blob, filename);
                    }
                    return { success: true };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },
            
            // ===== UI UPDATE DEPENDENCIES =====
            updateProgress: (percentage, message) => {
                const progressFill = document.getElementById('progressFill');
                const progressText = document.getElementById('progressText');
                
                if (progressFill) {
                    progressFill.style.width = percentage + '%';
                }
                if (progressText) {
                    progressText.textContent = message;
                }
            },
            
            showError: (message) => {
                const progressText = document.getElementById('progressText');
                const progressFill = document.getElementById('progressFill');
                
                if (progressText) {
                    progressText.textContent = message;
                }
                if (progressFill) {
                    progressFill.style.backgroundColor = 'var(--error-color, #ff4444)';
                }
            },
            
            // ===== EXTERNAL LIBRARY DEPENDENCIES =====
            jsPDF: DataExportUtilities.getJsPDF(),
            JSZip: DataExportUtilities.getJSZip(),
            
            // ===== MODULAR CLASS DEPENDENCIES =====
            DataExportValidators: DataExportUtilities.getDataExportValidators(),
            DataExportProcessors: DataExportUtilities.getDataExportProcessors(),
            DataExportUIBuilders: DataExportUtilities.getDataExportUIBuilders(),
            
            // ===== LOGGING DEPENDENCIES =====
            logInfo: (message, ...args) => {
                console.log(`[DataExport]`, message, ...args);
            },
            
            logError: (message, error, ...args) => {
                console.error(`[DataExport ERROR]`, message, error, ...args);
            },
            
            logDebug: (message, ...args) => {
                if (window.DEBUG_MODE || localStorage.getItem('debugDataExport')) {
                    console.debug(`[DataExport DEBUG]`, message, ...args);
                }
            },
            
            // ===== PERFORMANCE MONITORING =====
            performanceNow: () => performance.now ? performance.now() : Date.now(),
            
            measurePerformance: (operationName, operation) => {
                const start = container.performanceNow();
                const result = operation();
                const end = container.performanceNow();
                const duration = end - start;
                
                container.logDebug(`Performance: ${operationName} took ${duration.toFixed(2)}ms`);
                
                return { result, duration };
            },
            
            // ===== ENVIRONMENT DETECTION =====
            environment: DataExportUtilities.detectEnvironment(),
            
            // ===== ERROR HANDLING =====
            handleError: (error, context = 'Unknown') => {
                const errorInfo = {
                    message: error.message || String(error),
                    stack: error.stack,
                    context,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                container.logError(`Error in ${context}:`, errorInfo);
                
                return {
                    success: false,
                    error: errorInfo.message,
                    errorInfo
                };
            }
        };
        
        // Apply custom dependency overrides
        Object.assign(container, customDependencies);
        
        // Add performance wrappers if in debug mode
        if (container.environment.debug) {
            DataExportUtilities.addPerformanceWrappers(container);
        }
        
        return container;
    }
    
    /**
     * Create development dependency container with enhanced logging and debugging
     * @param {object} customDependencies - Custom dependency overrides
     * @returns {object} Development dependency container
     */
    static createDevelopmentDependencyContainer(customDependencies = {}) {
        const prodContainer = DataExportUtilities.createProductionDependencyContainer();
        
        const devEnhancements = {
            // Enhanced logging for development
            logInfo: (message, ...args) => {
                console.log(`[DataExport DEV]`, new Date().toISOString(), message, ...args);
            },
            
            logError: (message, error, ...args) => {
                console.group(`[DataExport ERROR] ${message}`);
                console.error(error);
                console.trace();
                if (args.length > 0) {
                    console.log('Additional data:', ...args);
                }
                console.groupEnd();
            },
            
            logDebug: (message, ...args) => {
                console.debug(`[DataExport DEBUG]`, new Date().toISOString(), message, ...args);
            },
            
            // Development mode flags
            environment: {
                ...prodContainer.environment,
                debug: true,
                development: true
            },
            
            // Enhanced error handling for development
            handleError: (error, context = 'Unknown') => {
                const errorInfo = prodContainer.handleError(error, context);
                
                // Additional development error reporting
                if (window.console && window.console.group) {
                    console.group(`🚨 Data Export Error in ${context}`);
                    console.error('Error object:', error);
                    console.error('Stack trace:', error.stack);
                    console.error('Context:', context);
                    console.groupEnd();
                }
                
                return errorInfo;
            },
            
            // Mock capabilities for development testing
            enableMockMode: () => {
                // Replace some functions with mocks for testing
                devEnhancements.getCurrentAnalyticsData = () => DataExportUtilities.getMockAnalyticsData();
                devEnhancements.downloadFile = (content, filename, format) => {
                    console.log(`[MOCK DOWNLOAD]`, filename, format, content);
                    return { success: true, mocked: true };
                };
            }
        };
        
        // Merge development enhancements
        Object.assign(prodContainer, devEnhancements, customDependencies);
        
        return prodContainer;
    }
    
    /**
     * Create test dependency container with mocks and spies
     * @param {object} customDependencies - Custom dependency overrides
     * @returns {object} Test dependency container with mocks
     */
    static createTestDependencyContainer(customDependencies = {}) {
        const testContainer = {
            // ===== MOCKED DOM DEPENDENCIES =====
            getElementById: (id) => DataExportUtilities.createMockElement(id),
            querySelector: (selector) => DataExportUtilities.createMockElement(selector),
            querySelectorAll: (selector) => [DataExportUtilities.createMockElement(selector)],
            addEventListener: (event, handler) => ({ event, handler, mocked: true }),
            removeEventListener: (event, handler) => ({ event, handler, mocked: true }),
            
            // ===== MOCKED DATA DEPENDENCIES =====
            getCurrentAnalyticsData: () => DataExportUtilities.getMockAnalyticsData(),
            
            // ===== MOCKED FILE OPERATIONS =====
            createBlob: (content, mimeType) => ({ content, mimeType, mocked: true }),
            downloadFile: (content, filename, format) => ({
                success: true,
                mocked: true,
                content,
                filename,
                format
            }),
            
            // ===== MOCKED UI OPERATIONS =====
            updateProgress: (percentage, message) => ({
                percentage,
                message,
                mocked: true
            }),
            
            showError: (message) => ({
                message,
                mocked: true
            }),
            
            // ===== MOCKED EXTERNAL LIBRARIES =====
            jsPDF: DataExportUtilities.createMockJsPDF(),
            JSZip: DataExportUtilities.createMockJSZip(),
            
            // ===== REAL MODULAR CLASSES FOR TESTING =====
            DataExportValidators: DataExportUtilities.getDataExportValidators(),
            DataExportProcessors: DataExportUtilities.getDataExportProcessors(),
            DataExportUIBuilders: DataExportUtilities.getDataExportUIBuilders(),
            
            // ===== TEST LOGGING =====
            logInfo: (message, ...args) => {
                testContainer._logs = testContainer._logs || [];
                testContainer._logs.push({ level: 'info', message, args });
            },
            
            logError: (message, error, ...args) => {
                testContainer._logs = testContainer._logs || [];
                testContainer._logs.push({ level: 'error', message, error, args });
            },
            
            logDebug: (message, ...args) => {
                testContainer._logs = testContainer._logs || [];
                testContainer._logs.push({ level: 'debug', message, args });
            },
            
            // ===== TEST UTILITIES =====
            _logs: [],
            _calls: {},
            
            recordCall: (functionName, args) => {
                testContainer._calls[functionName] = testContainer._calls[functionName] || [];
                testContainer._calls[functionName].push(args);
            },
            
            getCallCount: (functionName) => {
                return testContainer._calls[functionName] ? testContainer._calls[functionName].length : 0;
            },
            
            getCalls: (functionName) => {
                return testContainer._calls[functionName] || [];
            },
            
            clearCalls: () => {
                testContainer._calls = {};
                testContainer._logs = [];
            },
            
            // ===== ENVIRONMENT =====
            environment: {
                test: true,
                browser: false,
                node: true,
                debug: true
            },
            
            // ===== PERFORMANCE MOCKS =====
            performanceNow: () => 123.456,
            measurePerformance: (operationName, operation) => {
                const result = operation();
                return { result, duration: 123.456 };
            },
            
            // ===== ERROR HANDLING =====
            handleError: (error, context = 'Test') => ({
                success: false,
                error: error.message || String(error),
                context,
                mocked: true
            })
        };
        
        // Apply custom overrides
        Object.assign(testContainer, customDependencies);
        
        return testContainer;
    }
    
    /**
     * Get appropriate dependency container based on environment
     * @param {string} environment - Environment type ('production', 'development', 'test')
     * @param {object} customDependencies - Custom dependency overrides
     * @returns {object} Appropriate dependency container
     */
    static createDependencyContainer(environment = null, customDependencies = {}) {
        const detectedEnv = environment || DataExportUtilities.detectEnvironment().type;
        
        switch (detectedEnv) {
            case 'test':
                return DataExportUtilities.createTestDependencyContainer(customDependencies);
            case 'development':
                return DataExportUtilities.createDevelopmentDependencyContainer(customDependencies);
            case 'production':
            default:
                return DataExportUtilities.createProductionDependencyContainer(customDependencies);
        }
    }
    
    // ===== ENVIRONMENT DETECTION =====
    
    /**
     * Detect current runtime environment
     * @returns {object} Environment information
     */
    static detectEnvironment() {
        const env = {
            browser: typeof window !== 'undefined',
            node: typeof process !== 'undefined' && process.versions && process.versions.node,
            webWorker: typeof importScripts === 'function',
            debug: false,
            development: false,
            test: false,
            type: 'production'
        };
        
        // Detect debug mode
        if (typeof window !== 'undefined') {
            env.debug = !!(window.DEBUG_MODE || 
                          localStorage.getItem('debug') || 
                          window.location.href.includes('debug=true'));
        }
        
        // Detect development mode
        if (typeof window !== 'undefined') {
            env.development = !!(window.location.hostname === 'localhost' ||
                               window.location.hostname === '127.0.0.1' ||
                               window.location.hostname.includes('dev'));
        }
        
        // Detect test environment
        env.test = !!(typeof global !== 'undefined' && global.jasmine) ||
                   !!(typeof window !== 'undefined' && window.jasmine) ||
                   !!(typeof jest !== 'undefined') ||
                   !!(typeof mocha !== 'undefined');
        
        // Determine environment type
        if (env.test) {
            env.type = 'test';
        } else if (env.development || env.debug) {
            env.type = 'development';
        } else {
            env.type = 'production';
        }
        
        return env;
    }
    
    // ===== LIBRARY ACCESS HELPERS =====
    
    /**
     * Get jsPDF library instance
     * @returns {object|null} jsPDF constructor or null if unavailable
     */
    static getJsPDF() {
        if (typeof window !== 'undefined') {
            return window.jspdf?.jsPDF || window.jsPDF || null;
        }
        return null;
    }
    
    /**
     * Get JSZip library instance
     * @returns {object|null} JSZip constructor or null if unavailable
     */
    static getJSZip() {
        if (typeof window !== 'undefined') {
            return window.JSZip || null;
        }
        return null;
    }
    
    /**
     * Get DataExportValidators class
     * @returns {object|null} DataExportValidators class or null if unavailable
     */
    static getDataExportValidators() {
        if (typeof window !== 'undefined' && window.DataExportValidators) {
            return window.DataExportValidators;
        }
        
        // Try to require in Node.js environment
        try {
            return require('./DataExportValidators.js');
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get DataExportProcessors class
     * @returns {object|null} DataExportProcessors class or null if unavailable
     */
    static getDataExportProcessors() {
        if (typeof window !== 'undefined' && window.DataExportProcessors) {
            return window.DataExportProcessors;
        }
        
        // Try to require in Node.js environment
        try {
            return require('./DataExportProcessors.js');
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get DataExportUIBuilders class
     * @returns {object|null} DataExportUIBuilders class or null if unavailable
     */
    static getDataExportUIBuilders() {
        if (typeof window !== 'undefined' && window.DataExportUIBuilders) {
            return window.DataExportUIBuilders;
        }
        
        // Try to require in Node.js environment
        try {
            return require('./DataExportUIBuilders.js');
        } catch (error) {
            return null;
        }
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Download blob as file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - Filename for download
     */
    static downloadBlob(blob, filename) {
        if (typeof window !== 'undefined' && window.saveAs) {
            // Use FileSaver.js if available
            window.saveAs(blob, filename);
        } else if (typeof document !== 'undefined') {
            // Fallback method
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up object URL
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        }
    }
    
    /**
     * Add performance monitoring wrappers to dependency container
     * @param {object} container - Dependency container to enhance
     */
    static addPerformanceWrappers(container) {
        const wrapWithPerformance = (fn, name) => {
            return (...args) => {
                const start = container.performanceNow();
                const result = fn(...args);
                const end = container.performanceNow();
                
                container.logDebug(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
                
                return result;
            };
        };
        
        // Wrap key functions with performance monitoring
        const functionsToWrap = ['createBlob', 'downloadFile', 'updateProgress'];
        functionsToWrap.forEach(fnName => {
            if (container[fnName]) {
                container[fnName] = wrapWithPerformance(container[fnName], fnName);
            }
        });
    }
    
    // ===== MOCK DATA AND OBJECTS =====
    
    /**
     * Create mock analytics data for testing
     * @returns {object} Mock analytics data
     */
    static getMockAnalyticsData() {
        return {
            topTracks: [
                {
                    name: 'Test Track 1',
                    artists: [{ name: 'Test Artist 1' }],
                    album: { name: 'Test Album 1', release_date: '2023-01-01' },
                    popularity: 85,
                    duration_ms: 210000
                },
                {
                    name: 'Test Track 2',
                    artists: [{ name: 'Test Artist 2' }],
                    album: { name: 'Test Album 2', release_date: '2023-02-01' },
                    popularity: 78,
                    duration_ms: 195000
                }
            ],
            topArtists: [
                {
                    name: 'Test Artist 1',
                    genres: ['pop', 'rock'],
                    popularity: 90,
                    followers: { total: 1000000 },
                    external_urls: { spotify: 'https://open.spotify.com/artist/test1' }
                },
                {
                    name: 'Test Artist 2',
                    genres: ['electronic', 'ambient'],
                    popularity: 85,
                    followers: { total: 750000 },
                    external_urls: { spotify: 'https://open.spotify.com/artist/test2' }
                }
            ],
            analytics: {
                musicPersonality: {
                    explorationLevel: 'High Explorer',
                    diversityScore: 85,
                    mainGenres: ['pop', 'rock', 'electronic']
                },
                moodAnalysis: {
                    mood: 'Energetic',
                    energy: 0.8,
                    valence: 0.7
                },
                totalTracks: 50,
                uniqueArtists: 25,
                averagePopularity: 82
            }
        };
    }
    
    /**
     * Create mock DOM element for testing
     * @param {string} identifier - Element ID or selector
     * @returns {object} Mock DOM element
     */
    static createMockElement(identifier) {
        return {
            id: identifier,
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            },
            innerHTML: '',
            textContent: '',
            value: '',
            checked: false,
            disabled: false,
            focus: () => {},
            click: () => {},
            querySelector: () => DataExportUtilities.createMockElement('child'),
            querySelectorAll: () => [DataExportUtilities.createMockElement('child')],
            closest: () => DataExportUtilities.createMockElement('parent'),
            addEventListener: () => {},
            removeEventListener: () => {},
            mocked: true
        };
    }
    
    /**
     * Create mock jsPDF instance for testing
     * @returns {object} Mock jsPDF instance
     */
    static createMockJsPDF() {
        const mockDoc = {
            setFontSize: () => mockDoc,
            text: () => mockDoc,
            addPage: () => mockDoc,
            save: (filename) => ({ saved: filename, mocked: true }),
            mocked: true
        };
        
        return function MockJsPDF() {
            return mockDoc;
        };
    }
    
    /**
     * Create mock JSZip instance for testing
     * @returns {object} Mock JSZip constructor
     */
    static createMockJSZip() {
        return function MockJSZip() {
            return {
                file: (name, content) => ({ name, content, mocked: true }),
                generateAsync: () => Promise.resolve({ zipBlob: true, mocked: true }),
                mocked: true
            };
        };
    }
}

// ===== MODULE EXPORTS =====

// Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExportUtilities;
}

// Browser environment
if (typeof window !== 'undefined') {
    window.DataExportUtilities = DataExportUtilities;
}

// ES6 module support
if (typeof exports !== 'undefined') {
    exports.DataExportUtilities = DataExportUtilities;
}