/**
 * ================================================================================
 * ARTIST API CORE - MUSIC IN NUMBERS
 * ================================================================================
 * 
 * Core orchestration functions with dependency injection for artist API operations.
 * Implements "functional core, imperative shell" pattern.
 * 
 * ORCHESTRATION TYPES:
 * - API Communication Coordination
 * - Error Handling and Recovery
 * - Business Logic Workflow Management
 * - Data Processing Pipeline Coordination
 * - User Profile and Artist Data Integration
 * 
 * PATTERNS:
 * - Dependency injection for all external services
 * - Comprehensive error handling and logging
 * - Pure function delegation for business logic
 * - Explicit separation of concerns
 * - Consistent result object format
 * 
 * @author Music in Numbers Development Team
 * @version 1.0.0
 * ================================================================================
 */

'use strict';

class ArtistApiCore {
    
    /**
     * Fetches and processes artist data with comprehensive error handling
     * @param {Object} dependencies - Injected dependencies
     * @param {string} artistId - Spotify artist ID
     * @param {string} accessToken - Valid Spotify access token
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    static async fetchArtistDataCore(dependencies, artistId, accessToken) {
        const { fetch, logInfo, logError, showResult } = dependencies;
        
        try {
            // Pure validation using ArtistApiValidators
            const tokenValidation = this.validateInputs(dependencies, { accessToken, artistId });
            if (!tokenValidation.isValid) {
                logError('❌ Input validation failed:', tokenValidation.error);
                return { success: false, error: tokenValidation.error };
            }
            
            logInfo('🔄 Fetching artist data for ID:', artistId);
            
            // API call through injected fetch dependency
            const response = await this.makeApiRequest(dependencies, 
                `https://api.spotify.com/v1/artists/${artistId}`, 
                { 'Authorization': `Bearer ${accessToken}` }
            );
            
            if (!response.success) {
                return response;
            }
            
            // Pure data processing using ArtistApiProcessors
            const formattedData = this.processArtistData(dependencies, response.data);
            
            logInfo('✅ Successfully processed artist data:', formattedData.name);
            
            return { 
                success: true, 
                data: formattedData 
            };
            
        } catch (error) {
            const errorMessage = `Failed to fetch artist data: ${error.message}`;
            logError('❌ Artist data fetch error:', error);
            
            if (showResult) {
                showResult(errorMessage, 'error');
            }
            
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Fetches user profile data with error handling
     * @param {Object} dependencies - Injected dependencies
     * @param {string} accessToken - Valid Spotify access token
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    static async fetchUserProfileCore(dependencies, accessToken) {
        const { fetch, logInfo, logError, showResult } = dependencies;
        
        try {
            // Pure validation
            const tokenValidation = this.validateAccessToken(dependencies, accessToken);
            if (!tokenValidation.isValid) {
                logError('❌ Access token validation failed:', tokenValidation.error);
                return { success: false, error: tokenValidation.error };
            }
            
            logInfo('🔄 Fetching user profile data');
            
            // API call through injected dependency
            const response = await this.makeApiRequest(dependencies,
                'https://api.spotify.com/v1/me',
                { 'Authorization': `Bearer ${accessToken}` }
            );
            
            if (!response.success) {
                return response;
            }
            
            logInfo('✅ Successfully fetched user profile:', response.data.display_name || response.data.id);
            
            return {
                success: true,
                data: response.data
            };
            
        } catch (error) {
            const errorMessage = `Failed to fetch user profile: ${error.message}`;
            logError('❌ User profile fetch error:', error);
            
            if (showResult) {
                showResult(errorMessage, 'error');
            }
            
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Processes complete artist workflow with UI updates
     * @param {Object} dependencies - Injected dependencies
     * @param {string} artistId - Spotify artist ID
     * @param {string} accessToken - Valid Spotify access token
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    static async processArtistWorkflowCore(dependencies, artistId, accessToken) {
        const { showResult, logInfo, logError } = dependencies;
        
        try {
            logInfo('🚀 Starting complete artist workflow for ID:', artistId);
            
            // Show loading state
            if (showResult) {
                showResult('Loading artist information...', 'info');
            }
            
            // Fetch artist data
            const artistResult = await this.fetchArtistDataCore(dependencies, artistId, accessToken);
            
            if (!artistResult.success) {
                if (showResult) {
                    showResult(`Failed to load artist: ${artistResult.error}`, 'error');
                }
                return artistResult;
            }
            
            // Generate UI components using pure functions
            const uiComponents = this.generateArtistUI(dependencies, artistResult.data);
            
            // Update display through injected UI service
            if (showResult) {
                showResult('Artist information loaded successfully', 'success');
            }
            
            logInfo('✅ Artist workflow completed successfully');
            
            return {
                success: true,
                data: {
                    artist: artistResult.data,
                    ui: uiComponents
                }
            };
            
        } catch (error) {
            const errorMessage = `Artist workflow failed: ${error.message}`;
            logError('❌ Artist workflow error:', error);
            
            if (showResult) {
                showResult(errorMessage, 'error');
            }
            
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Validates multiple inputs using pure validation functions
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} inputs - Object containing inputs to validate
     * @returns {{isValid: boolean, error?: string}}
     */
    static validateInputs(dependencies, inputs) {
        // Access validators through dependencies or fallback
        const validators = dependencies.ArtistApiValidators || global.ArtistApiValidators;
        
        if (!validators) {
            return { isValid: false, error: 'Validation system not available' };
        }
        
        // Validate access token
        if (inputs.accessToken) {
            const tokenValidation = validators.validateAccessToken(inputs.accessToken);
            if (!tokenValidation.isValid) {
                return tokenValidation;
            }
        }
        
        // Validate artist ID
        if (inputs.artistId) {
            const artistIdValidation = validators.validateArtistId(inputs.artistId);
            if (!artistIdValidation.isValid) {
                return artistIdValidation;
            }
        }
        
        // Validate artist data
        if (inputs.artistData) {
            const artistDataValidation = validators.validateArtistData(inputs.artistData);
            if (!artistDataValidation.isValid) {
                return artistDataValidation;
            }
        }
        
        return { isValid: true };
    }
    
    /**
     * Validates access token using pure validation
     * @param {Object} dependencies - Injected dependencies
     * @param {string} accessToken - Access token to validate
     * @returns {{isValid: boolean, error?: string}}
     */
    static validateAccessToken(dependencies, accessToken) {
        const validators = dependencies.ArtistApiValidators || global.ArtistApiValidators;
        
        if (!validators) {
            return { isValid: false, error: 'Validation system not available' };
        }
        
        return validators.validateAccessToken(accessToken);
    }
    
    /**
     * Makes API request with comprehensive error handling
     * @param {Object} dependencies - Injected dependencies
     * @param {string} url - API endpoint URL
     * @param {Object} headers - Request headers
     * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
     */
    static async makeApiRequest(dependencies, url, headers = {}) {
        const { fetch, logInfo, logError } = dependencies;
        
        try {
            logInfo('📡 Making API request to:', url);
            
            const response = await fetch(url, { headers });
            
            // Validate response using pure validation
            const responseValidation = this.validateApiResponse(dependencies, response);
            if (!responseValidation.isValid) {
                return { success: false, error: responseValidation.error };
            }
            
            const data = await response.json();
            
            logInfo('✅ API request successful');
            return { success: true, data };
            
        } catch (error) {
            const errorMessage = `API request failed: ${error.message}`;
            logError('❌ API request error:', error);
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Validates API response using pure validation
     * @param {Object} dependencies - Injected dependencies
     * @param {Response} response - Fetch API response
     * @returns {{isValid: boolean, error?: string}}
     */
    static validateApiResponse(dependencies, response) {
        const validators = dependencies.ArtistApiValidators || global.ArtistApiValidators;
        
        if (!validators) {
            return { isValid: false, error: 'Validation system not available' };
        }
        
        return validators.validateApiResponse(response);
    }
    
    /**
     * Processes artist data using pure processors
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} rawArtistData - Raw artist data from API
     * @returns {Object} Formatted artist data
     */
    static processArtistData(dependencies, rawArtistData) {
        const processors = dependencies.ArtistApiProcessors || global.ArtistApiProcessors;
        
        if (!processors) {
            dependencies.logError?.('⚠️ ArtistApiProcessors not available, using fallback');
            return this.fallbackProcessArtistData(rawArtistData);
        }
        
        return processors.formatArtistData(rawArtistData);
    }
    
    /**
     * Generates UI components using pure UI builders  
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} artistData - Formatted artist data
     * @returns {Object} UI components object
     */
    static generateArtistUI(dependencies, artistData) {
        const uiBuilders = dependencies.ArtistApiUIBuilders || global.ArtistApiUIBuilders;
        
        if (!uiBuilders) {
            dependencies.logError?.('⚠️ ArtistApiUIBuilders not available, using fallback');
            return { profile: '<div>Artist UI not available</div>' };
        }
        
        return {
            profile: uiBuilders.buildArtistProfile(artistData),
            header: uiBuilders.buildArtistHeader(artistData),
            card: uiBuilders.buildArtistCard(artistData),
            genres: uiBuilders.buildGenresComponent(artistData.genres),
            socialLinks: uiBuilders.buildSocialLinksComponent(
                artistData.externalUrls,
                artistData.instagramUrl,
                artistData.isInstagramConfirmed
            )
        };
    }
    
    /**
     * Batch processes multiple artists
     * @param {Object} dependencies - Injected dependencies
     * @param {Array<string>} artistIds - Array of artist IDs
     * @param {string} accessToken - Valid Spotify access token
     * @returns {Promise<{success: boolean, data?: Array, errors?: Array}>}
     */
    static async batchProcessArtistsCore(dependencies, artistIds, accessToken) {
        const { logInfo, logError } = dependencies;
        
        try {
            logInfo('🔄 Starting batch artist processing:', artistIds.length, 'artists');
            
            const results = [];
            const errors = [];
            
            // Process artists in parallel (with reasonable limit)
            const batchSize = 5;
            for (let i = 0; i < artistIds.length; i += batchSize) {
                const batch = artistIds.slice(i, i + batchSize);
                const batchPromises = batch.map(artistId => 
                    this.fetchArtistDataCore(dependencies, artistId, accessToken)
                );
                
                const batchResults = await Promise.all(batchPromises);
                
                batchResults.forEach((result, index) => {
                    if (result.success) {
                        results.push(result.data);
                    } else {
                        errors.push({
                            artistId: batch[index],
                            error: result.error
                        });
                    }
                });
            }
            
            logInfo('✅ Batch processing completed:', results.length, 'successful,', errors.length, 'errors');
            
            return {
                success: true,
                data: results,
                errors: errors.length > 0 ? errors : undefined
            };
            
        } catch (error) {
            const errorMessage = `Batch processing failed: ${error.message}`;
            logError('❌ Batch processing error:', error);
            return { success: false, error: errorMessage };
        }
    }
    
    /**
     * Fallback artist data processing when processors not available
     * @param {Object} rawArtistData - Raw artist data
     * @returns {Object} Basic formatted data
     */
    static fallbackProcessArtistData(rawArtistData) {
        return {
            name: rawArtistData?.name || 'Unknown Artist',
            imageUrl: rawArtistData?.images?.[0]?.url || '',
            imageWidth: rawArtistData?.images?.[0]?.width || 300,
            imageHeight: rawArtistData?.images?.[0]?.height || 300,
            followers: rawArtistData?.followers?.total?.toLocaleString() || '0',
            genres: rawArtistData?.genres?.join(', ') || 'No genres listed',
            popularity: rawArtistData?.popularity || 0,
            spotifyUrl: rawArtistData?.external_urls?.spotify || '',
            instagramUrl: null,
            isInstagramConfirmed: false,
            rawData: JSON.stringify(rawArtistData, null, 2)
        };
    }
}

// ================================================================================
// MODULE EXPORTS - Multi-environment support
// ================================================================================

// Node.js/CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtistApiCore;
}

// Browser global environment
if (typeof window !== 'undefined') {
    window.ArtistApiCore = ArtistApiCore;
}

// ES6 modules (when supported)
if (typeof exports !== 'undefined') {
    exports.ArtistApiCore = ArtistApiCore;
}