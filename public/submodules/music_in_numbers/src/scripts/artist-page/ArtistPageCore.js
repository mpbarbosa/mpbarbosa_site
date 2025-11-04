/**
 * ================================================================================
 * ARTIST PAGE CORE - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Business logic orchestration for artist page operations with dependency injection.
 * Contains the "imperative shell" that coordinates pure functions and manages side effects.
 * 
 * ORCHESTRATION TYPES:
 * - Artist Data Loading (API coordination, error handling)
 * - User Profile Management (Authentication, profile operations) 
 * - Application Initialization (Event setup, state management)
 * - Navigation Workflows (Page routing, external links)
 * - Error Recovery (Retry logic, fallback handling)
 * - UI State Management (Loading, success, error states)
 * 
 * PATTERNS:
 * - Dependency injection for all external dependencies
 * - "Functional core, imperative shell" architecture
 * - Comprehensive error handling and recovery
 * - State management and transitions
 * - Async workflow coordination
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistPageCore {
    
    /**
     * Core artist data loading workflow with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {string} artistId - Spotify artist ID (optional, uses default if not provided)
     * @returns {Promise<Object>} Result object with success/error status
     */
    static async loadArtistDataCore(dependencies, artistId = null) {
        const {
            getValidAccessToken,
            fetchArtistFromAPI,
            formatArtistData,
            buildArtistHTML,
            buildErrorHTML,
            displayArtistInfo,
            logInfo,
            logError,
            showResult,
            ArtistPageValidators,
            ArtistPageProcessors,
            ArtistPageUIBuilders
        } = dependencies;
        
        try {
            logInfo('🎯 Starting artist data loading workflow');
            
            // Phase 1: Authentication validation
            const accessToken = getValidAccessToken();
            const tokenValidation = ArtistPageValidators.validateAccessToken(accessToken);
            
            if (!tokenValidation.isValid) {
                logError('❌ Authentication validation failed:', tokenValidation.error);
                const errorHTML = ArtistPageUIBuilders.buildErrorState({
                    message: 'No valid access token found. Please authenticate with Spotify first.',
                    errorCode: 'AUTH_REQUIRED',
                    technical: false
                });
                displayArtistInfo(errorHTML);
                return {
                    success: false,
                    error: tokenValidation.error,
                    errorType: 'authentication'
                };
            }
            
            // Phase 2: Artist ID processing
            const targetArtistId = artistId || this.getDefaultArtistId();
            const artistIdValidation = ArtistPageValidators.validateArtistId(targetArtistId);
            
            if (!artistIdValidation.isValid) {
                logError('❌ Artist ID validation failed:', artistIdValidation.error);
                const errorHTML = ArtistPageUIBuilders.buildErrorState({
                    message: 'Invalid artist ID provided',
                    errorCode: 'INVALID_ARTIST_ID',
                    technical: false
                });
                displayArtistInfo(errorHTML);
                return {
                    success: false,
                    error: artistIdValidation.error,
                    errorType: 'validation'
                };
            }
            
            logInfo('✅ Validation passed, fetching artist data for:', targetArtistId);
            
            // Phase 3: Show loading state
            const loadingHTML = ArtistPageUIBuilders.buildLoadingState({
                message: 'Loading artist information...',
                showSpinner: true
            });
            displayArtistInfo(loadingHTML);
            
            // Phase 4: API data fetching
            const artistData = await fetchArtistFromAPI(targetArtistId, accessToken);
            
            // Phase 5: Data validation
            const dataValidation = ArtistPageValidators.validateArtistData(artistData);
            if (!dataValidation.isValid) {
                logError('❌ Artist data validation failed:', dataValidation.error);
                throw new Error(`Invalid artist data: ${dataValidation.error}`);
            }
            
            // Phase 6: Data processing
            const processedData = ArtistPageProcessors.processArtistData(artistData);
            logInfo('✅ Artist data processed successfully:', processedData.displayName);
            
            // Phase 7: UI generation and display
            const artistHTML = ArtistPageUIBuilders.buildArtistDisplay(processedData);
            displayArtistInfo(artistHTML);
            
            logInfo('🎉 Artist data loading completed successfully');
            showResult && showResult('Artist data loaded successfully', 'success');
            
            return {
                success: true,
                data: processedData,
                artistId: targetArtistId
            };
            
        } catch (error) {
            logError('💥 Artist data loading failed:', error);
            
            const errorMessage = ArtistPageProcessors.generateErrorMessage(error, 'artist loading');
            const errorHTML = ArtistPageUIBuilders.buildErrorState({
                message: errorMessage,
                showRetry: true,
                errorCode: error.status || 'UNKNOWN_ERROR'
            });
            displayArtistInfo(errorHTML);
            
            showResult && showResult(`Failed to load artist data: ${errorMessage}`, 'error');
            
            return {
                success: false,
                error: error.message,
                errorType: 'api_error',
                artistId: artistId
            };
        }
    }
    
    /**
     * Core user profile opening workflow with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Result object with success/error status
     */
    static async openSpotifyProfileCore(dependencies) {
        const {
            getValidAccessToken,
            fetchUserProfile,
            showAlert,
            openInNewTab,
            logInfo,
            logError,
            ArtistPageValidators,
            ArtistPageProcessors
        } = dependencies;
        
        try {
            logInfo('🎯 Starting Spotify profile opening workflow');
            
            // Phase 1: Authentication check
            const accessToken = getValidAccessToken();
            const tokenValidation = ArtistPageValidators.validateAccessToken(accessToken);
            
            if (!tokenValidation.isValid) {
                logError('❌ Authentication failed for profile access:', tokenValidation.error);
                showAlert && showAlert('Please authenticate with Spotify first!');
                return {
                    success: false,
                    error: tokenValidation.error,
                    errorType: 'authentication'
                };
            }
            
            logInfo('✅ Authentication validated, fetching user profile');
            
            // Phase 2: User profile fetching
            const userData = await fetchUserProfile(accessToken);
            
            // Phase 3: User data validation
            const userValidation = ArtistPageValidators.validateUserData(userData);
            if (!userValidation.isValid) {
                logError('❌ User data validation failed:', userValidation.error);
                throw new Error(`Invalid user data: ${userValidation.error}`);
            }
            
            // Phase 4: Profile URL processing
            const processedProfile = ArtistPageProcessors.processUserProfile(userData);
            if (!processedProfile.isValid) {
                throw new Error(processedProfile.error || 'Failed to process user profile');
            }
            
            // Phase 5: URL validation and opening
            const urlValidation = ArtistPageValidators.validateProfileUrl(processedProfile.profileUrl);
            if (!urlValidation.isValid) {
                logError('❌ Profile URL validation failed:', urlValidation.error);
                throw new Error(`Invalid profile URL: ${urlValidation.error}`);
            }
            
            logInfo('✅ Opening Spotify profile:', processedProfile.profileUrl);
            openInNewTab(processedProfile.profileUrl);
            
            logInfo('🎉 Spotify profile opened successfully');
            return {
                success: true,
                profileUrl: processedProfile.profileUrl,
                userData: processedProfile
            };
            
        } catch (error) {
            logError('💥 Profile opening failed:', error);
            
            const errorMessage = ArtistPageProcessors.generateErrorMessage(error, 'profile loading');
            showAlert && showAlert(`Error opening Spotify profile: ${errorMessage}`);
            
            return {
                success: false,
                error: error.message,
                errorType: 'api_error'
            };
        }
    }
    
    /**
     * Core application initialization workflow with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Initialization options
     * @returns {Promise<Object>} Result object with initialization status
     */
    static async initializeApplicationCore(dependencies, options = {}) {
        const {
            getElementById,
            addEventListener,
            logInfo,
            logError,
            showResult,
            ArtistPageValidators
        } = dependencies;
        
        const {
            profileButtonId = 'spotifyProfileBtn',
            autoLoadArtist = true,
            artistId = null
        } = options;
        
        try {
            logInfo('🎯 Starting application initialization');
            
            // Phase 1: Profile button setup
            const profileBtn = getElementById(profileButtonId);
            const buttonValidation = ArtistPageValidators.validateDOMElement(profileBtn, 'profile button');
            
            if (buttonValidation.isValid) {
                logInfo('✅ Profile button found, attaching event listener');
                
                const profileHandler = async () => {
                    const result = await this.openSpotifyProfileCore(dependencies);
                    if (!result.success) {
                        logError('Profile opening failed from button:', result.error);
                    }
                };
                
                const handlerValidation = ArtistPageValidators.validateEventHandler(profileHandler, 'click');
                if (handlerValidation.isValid) {
                    addEventListener(profileBtn, 'click', profileHandler);
                    logInfo('✅ Profile button event listener attached');
                } else {
                    logError('❌ Invalid event handler:', handlerValidation.error);
                }
            } else {
                logError('⚠️ Profile button not found or invalid:', buttonValidation.error);
            }
            
            // Phase 2: Auto-load artist data if requested
            if (autoLoadArtist) {
                logInfo('🔄 Auto-loading artist data');
                const loadResult = await this.loadArtistDataCore(dependencies, artistId);
                if (!loadResult.success) {
                    logError('Auto-load failed:', loadResult.error);
                }
            }
            
            logInfo('🎉 Application initialization completed');
            return {
                success: true,
                profileButtonAttached: buttonValidation.isValid,
                autoLoadResult: autoLoadArtist ? loadResult : null
            };
            
        } catch (error) {
            logError('💥 Application initialization failed:', error);
            showResult && showResult(`Initialization error: ${error.message}`, 'error');
            
            return {
                success: false,
                error: error.message,
                errorType: 'initialization'
            };
        }
    }
    
    /**
     * Core error recovery workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} errorContext - Context about the error
     * @returns {Promise<Object>} Recovery result
     */
    static async handleErrorRecoveryCore(dependencies, errorContext = {}) {
        const {
            logInfo,
            logError,
            showResult,
            ArtistPageUIBuilders,
            displayArtistInfo
        } = dependencies;
        
        const {
            errorType = 'unknown',
            originalError = null,
            retryAttempts = 0,
            maxRetries = 3
        } = errorContext;
        
        try {
            logInfo(`🔄 Starting error recovery for: ${errorType}`);
            
            // Determine recovery strategy based on error type
            switch (errorType) {
                case 'authentication':
                    return await this.handleAuthenticationRecovery(dependencies);
                    
                case 'api_error':
                    return await this.handleAPIErrorRecovery(dependencies, errorContext);
                    
                case 'validation':
                    return await this.handleValidationErrorRecovery(dependencies, errorContext);
                    
                default:
                    return await this.handleGenericErrorRecovery(dependencies, errorContext);
            }
            
        } catch (recoveryError) {
            logError('💥 Error recovery failed:', recoveryError);
            
            const errorHTML = ArtistPageUIBuilders.buildErrorState({
                message: 'Unable to recover from error. Please refresh the page.',
                showRetry: false,
                showHome: true,
                errorCode: 'RECOVERY_FAILED',
                technical: true
            });
            displayArtistInfo && displayArtistInfo(errorHTML);
            
            return {
                success: false,
                error: recoveryError.message,
                errorType: 'recovery_failed'
            };
        }
    }
    
    /**
     * Core page navigation workflow
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} navigationData - Navigation parameters
     * @returns {Object} Navigation result
     */
    static navigateToPageCore(dependencies, navigationData = {}) {
        const {
            logInfo,
            logError,
            ArtistPageValidators,
            ArtistPageProcessors
        } = dependencies;
        
        const {
            targetUrl = '',
            openInNewWindow = false,
            validateUrl = true
        } = navigationData;
        
        try {
            logInfo('🎯 Starting page navigation:', targetUrl);
            
            // URL processing and validation
            const processedUrl = ArtistPageProcessors.processUrlParameters(targetUrl);
            
            if (validateUrl && !processedUrl.isValid) {
                logError('❌ URL validation failed:', processedUrl.parseError);
                return {
                    success: false,
                    error: processedUrl.parseError,
                    errorType: 'validation'
                };
            }
            
            // Execute navigation
            if (openInNewWindow) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = targetUrl;
            }
            
            logInfo('✅ Navigation completed successfully');
            return {
                success: true,
                targetUrl,
                openInNewWindow
            };
            
        } catch (error) {
            logError('💥 Navigation failed:', error);
            return {
                success: false,
                error: error.message,
                errorType: 'navigation'
            };
        }
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * Gets default artist ID for demo purposes
     * @returns {string} Default Spotify artist ID
     */
    static getDefaultArtistId() {
        // Billie Eilish - good example artist with rich data
        return '6qqNVTkY8uBg9cP3Jd7DAH';
    }
    
    /**
     * Handles authentication error recovery
     * @param {Object} dependencies - Injected dependencies
     * @returns {Promise<Object>} Recovery result
     */
    static async handleAuthenticationRecovery(dependencies) {
        const { logInfo, showResult, navigateToPageCore } = dependencies;
        
        logInfo('🔄 Attempting authentication recovery');
        
        // Redirect to main page for re-authentication
        const navigationResult = this.navigateToPageCore(dependencies, {
            targetUrl: 'index.html',
            openInNewWindow: false
        });
        
        showResult && showResult('Redirecting to authentication page...', 'info');
        
        return {
            success: true,
            recoveryAction: 'redirect_to_auth',
            result: navigationResult
        };
    }
    
    /**
     * Handles API error recovery
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} errorContext - Error context
     * @returns {Promise<Object>} Recovery result
     */
    static async handleAPIErrorRecovery(dependencies, errorContext) {
        const { logInfo, logError, showResult } = dependencies;
        const { retryAttempts = 0, maxRetries = 3, originalError } = errorContext;
        
        if (retryAttempts >= maxRetries) {
            logError('❌ Max retry attempts reached');
            return {
                success: false,
                error: 'Maximum retry attempts exceeded',
                errorType: 'max_retries'
            };
        }
        
        logInfo(`🔄 Attempting API error recovery (attempt ${retryAttempts + 1}/${maxRetries})`);
        
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, retryAttempts), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the original operation
        const retryResult = await this.loadArtistDataCore(dependencies);
        
        if (retryResult.success) {
            showResult && showResult('Successfully recovered from error', 'success');
            return {
                success: true,
                recoveryAction: 'retry_successful',
                attempts: retryAttempts + 1
            };
        }
        
        return {
            success: false,
            error: 'Retry failed',
            errorType: 'retry_failed',
            attempts: retryAttempts + 1
        };
    }
    
    /**
     * Handles validation error recovery
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} errorContext - Error context
     * @returns {Promise<Object>} Recovery result
     */
    static async handleValidationErrorRecovery(dependencies, errorContext) {
        const { logInfo, ArtistPageUIBuilders, displayArtistInfo } = dependencies;
        
        logInfo('🔄 Attempting validation error recovery');
        
        // Show error state with clear guidance
        const errorHTML = ArtistPageUIBuilders.buildErrorState({
            message: 'Invalid data detected. Please try again or contact support.',
            showRetry: true,
            showHome: true,
            errorCode: 'VALIDATION_ERROR'
        });
        
        displayArtistInfo && displayArtistInfo(errorHTML);
        
        return {
            success: true,
            recoveryAction: 'show_error_guidance'
        };
    }
    
    /**
     * Handles generic error recovery
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} errorContext - Error context
     * @returns {Promise<Object>} Recovery result
     */
    static async handleGenericErrorRecovery(dependencies, errorContext) {
        const { logInfo, ArtistPageUIBuilders, displayArtistInfo } = dependencies;
        
        logInfo('🔄 Attempting generic error recovery');
        
        // Show generic error state
        const errorHTML = ArtistPageUIBuilders.buildErrorState({
            message: 'An unexpected error occurred. Please try again.',
            showRetry: true,
            showHome: true,
            errorCode: 'GENERIC_ERROR'
        });
        
        displayArtistInfo && displayArtistInfo(errorHTML);
        
        return {
            success: true,
            recoveryAction: 'show_generic_error'
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistPageCore;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistPageCore = ArtistPageCore;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistPageCore = ArtistPageCore;
}