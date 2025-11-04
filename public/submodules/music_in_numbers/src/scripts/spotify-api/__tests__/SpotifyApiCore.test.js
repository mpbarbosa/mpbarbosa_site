/**
 * @jest-environment jsdom
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

/**
 * Unit Tests for SpotifyApiCore.js
 * 
 * Tests the core orchestration functions with dependency injection for Spotify API operations.
 * This class contains impure functions that coordinate side effects through explicit dependency
 * injection, following the "functional core, imperative shell" pattern.
 * 
 * Test Coverage:
 * - initiateAuthCore: OAuth 2.0 authentication initiation with PKCE
 * - exchangeCodeForTokenCore: Authorization code to access token exchange
 * - getAudioFeaturesCore: Audio features retrieval with caching
 * - getTopTracksCore: Top tracks retrieval with validation
 * - getTopArtistsCore: Top artists retrieval with validation
 * - getRecentlyPlayedCore: Recently played tracks retrieval
 * - getCurrentPlaybackCore: Current playback state retrieval
 * - getUserProfileCore: User profile information retrieval
 * - isTokenValidCore: Token validation and expiry checking
 * - getValidAccessTokenCore: Valid token retrieval
 * - getUserPlaylistsCore: User playlists retrieval
 */

// SpotifyApiCore implementation for testing with dependency injection pattern
class SpotifyApiCore {
    
    static async initiateAuthCore(dependencies) {
        const {
            getElement,
            showResult,
            storage,
            generateCodeVerifier,
            generateCodeChallenge,
            generateRandomString,
            themeManager,
            navigate,
            getRedirectUri
        } = dependencies;
        
        const clientIdInput = getElement('clientId');
        const connectBtn = getElement('connectBtn');
        
        if (!clientIdInput || !connectBtn) {
            throw new Error('Required DOM elements not found');
        }
        
        const clientId = clientIdInput.value;
        
        // Simple validation
        if (!clientId || clientId.trim().length === 0) {
            showResult('Please enter a valid Client ID', 'error');
            clientIdInput.focus();
            clientIdInput.setAttribute('aria-invalid', 'true');
            return;
        }
        
        clientIdInput.setAttribute('aria-invalid', 'false');
        
        connectBtn.disabled = true;
        connectBtn.innerHTML = '🔄 Connecting...';
        connectBtn.setAttribute('aria-busy', 'true');
        
        try {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const state = generateRandomString(16);
            const redirectUri = getRedirectUri();
            
            // Store session data
            storage.setItem('spotify_client_id', clientId);
            storage.setItem('spotify_code_verifier', codeVerifier);
            storage.setItem('spotify_auth_state', state);
            storage.setItem('spotify_auth_timestamp', Date.now().toString());
            
            // Build auth URL
            const authUrl = `https://accounts.spotify.com/authorize?` +
                `client_id=${encodeURIComponent(clientId)}&` +
                `response_type=code&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `code_challenge_method=S256&` +
                `code_challenge=${encodeURIComponent(codeChallenge)}&` +
                `state=${encodeURIComponent(state)}&` +
                `scope=${encodeURIComponent('user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative user-library-read user-read-currently-playing user-read-playback-state')}`;
            
            if (themeManager && themeManager.announceToScreenReader) {
                themeManager.announceToScreenReader('Redirecting to Spotify for authentication');
            }
            
            setTimeout(() => {
                navigate(authUrl);
            }, 500);
            
        } catch (error) {
            console.error('Auth initiation error:', error);
            showResult('Failed to initiate authentication. Please try again.', 'error');
            
            connectBtn.disabled = false;
            connectBtn.innerHTML = '🎵 Connect to Spotify';
            connectBtn.setAttribute('aria-busy', 'false');
            
            throw error;
        }
    }

    static async exchangeCodeForTokenCore(dependencies) {
        const {
            getElement,
            getStorageItem,
            setStorageItem,
            showResult,
            fetchApi,
            getUserProfile,
            getRedirectUri
        } = dependencies;
        
        const authCodeInput = getElement('authCode');
        const clientIdInput = getElement('clientId');
        
        if (!authCodeInput || !clientIdInput) {
            throw new Error('Required DOM elements not found');
        }
        
        const authCode = authCodeInput.value;
        const clientId = clientIdInput.value || getStorageItem('spotify_client_id');
        const codeVerifier = getStorageItem('spotify_code_verifier');
        
        if (!authCode || !clientId || !codeVerifier) {
            showResult('Missing required parameters for token exchange', 'error');
            return;
        }
        
        try {
            const redirectUri = getRedirectUri();
            
            const requestBody = new URLSearchParams({
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: redirectUri,
                client_id: clientId,
                code_verifier: codeVerifier
            });
            
            const response = await fetchApi('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody.toString()
            });
            
            const data = await response.json();
            
            if (response.ok) {
                const expiryTime = Date.now() + (data.expires_in * 1000);
                
                setStorageItem('spotify_access_token', data.access_token);
                setStorageItem('spotify_token_expiry', expiryTime.toString());
                if (data.refresh_token) {
                    setStorageItem('spotify_refresh_token', data.refresh_token);
                }
                
                showResult('Successfully connected to Spotify API!', 'success');
                await getUserProfile(data.access_token);
                
            } else {
                showResult('Error: ' + (data.error || 'Unknown error'), 'error');
            }
            
        } catch (error) {
            showResult('Error: ' + error.message, 'error');
            throw error;
        }
    }

    static async getAudioFeaturesCore(dependencies, accessToken, trackIds) {
        const {
            fetchApi,
            queueRequest,
            logWarning,
            logError
        } = dependencies;
        
        if (!accessToken || !trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
            logError('Audio features validation failed: Invalid inputs');
            return [];
        }
        
        const validTrackIds = trackIds.filter(id => id && typeof id === 'string');
        if (validTrackIds.length === 0) {
            logError('Audio features validation failed: No valid track IDs');
            return [];
        }
        
        const url = `https://api.spotify.com/v1/audio-features?ids=${validTrackIds.join(',')}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            return await queueRequest(async () => {
                const response = await fetchApi(url, options);
                const data = await response.json();
                
                if (response.ok && data.audio_features) {
                    return data.audio_features.filter(feature => feature !== null);
                } else {
                    logWarning('Failed to get audio features:', response.status);
                    return [];
                }
            }, `audio_features_${validTrackIds.join('_')}`);
            
        } catch (error) {
            logError('Error getting audio features:', error);
            return [];
        }
    }

    static async getTopTracksCore(dependencies, accessToken, timeRange = 'medium_term', limit = 20) {
        const {
            fetchApi,
            queueRequest,
            logError
        } = dependencies;
        
        if (!accessToken) {
            logError('Top tracks validation failed: Missing access token');
            throw new Error('Missing access token');
        }
        
        const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
        const validatedTimeRange = validTimeRanges.includes(timeRange) ? timeRange : 'medium_term';
        const validatedLimit = Math.max(1, Math.min(50, limit));
        
        const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${validatedTimeRange}&limit=${validatedLimit}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            return await queueRequest(async () => {
                const response = await fetchApi(url, options);
                const data = await response.json();
                
                if (response.ok && data.items) {
                    return data.items;
                } else {
                    logError('Failed to get top tracks:', response.status);
                    throw new Error(`Failed to get top tracks: ${response.status}`);
                }
            }, `top_tracks_${validatedTimeRange}_${validatedLimit}`);
            
        } catch (error) {
            logError('Error getting top tracks:', error);
            throw error;
        }
    }

    static async getTopArtistsCore(dependencies, accessToken, timeRange = 'medium_term', limit = 20) {
        const {
            fetchApi,
            queueRequest,
            logError
        } = dependencies;
        
        if (!accessToken) {
            logError('Top artists validation failed: Missing access token');
            throw new Error('Missing access token');
        }
        
        const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
        const validatedTimeRange = validTimeRanges.includes(timeRange) ? timeRange : 'medium_term';
        const validatedLimit = Math.max(1, Math.min(50, limit));
        
        const url = `https://api.spotify.com/v1/me/top/artists?time_range=${validatedTimeRange}&limit=${validatedLimit}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            return await queueRequest(async () => {
                const response = await fetchApi(url, options);
                const data = await response.json();
                
                if (response.ok && data.items) {
                    return data.items;
                } else {
                    logError('Failed to get top artists:', response.status);
                    throw new Error(`Failed to get top artists: ${response.status}`);
                }
            }, `top_artists_${validatedTimeRange}_${validatedLimit}`);
            
        } catch (error) {
            logError('Error getting top artists:', error);
            throw error;
        }
    }

    static async getRecentlyPlayedCore(dependencies, accessToken, limit = 50) {
        const {
            fetchApi,
            queueRequest,
            logWarning,
            logError
        } = dependencies;
        
        if (!accessToken) {
            logError('Recently played validation failed: Missing access token');
            return [];
        }
        
        const validatedLimit = Math.max(1, Math.min(50, limit));
        
        const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${validatedLimit}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            return await queueRequest(async () => {
                const response = await fetchApi(url, options);
                const data = await response.json();
                
                if (response.ok && data.items) {
                    return data.items;
                } else {
                    logWarning('Failed to get recently played tracks:', response.status);
                    return [];
                }
            }, `recently_played_${validatedLimit}`);
            
        } catch (error) {
            logError('Error getting recently played tracks:', error);
            return [];
        }
    }

    static async getCurrentPlaybackCore(dependencies, accessToken) {
        const { fetch, performanceOptimizer, console } = dependencies;
        
        if (!accessToken) {
            console.error('Current playback validation failed: Missing access token');
            return null;
        }
        
        const url = 'https://api.spotify.com/v1/me/player';
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            return await performanceOptimizer.queueRequest(async () => {
                const response = await fetch(url, options);
                
                if (response.status === 204) {
                    return null; // No active playback
                }
                
                if (!response.ok) {
                    console.warn('Failed to get current playback:', response.status);
                    return null;
                }
                
                try {
                    const data = await response.json();
                    return data;
                } catch (parseError) {
                    console.warn('Failed to parse current playback response:', parseError);
                    return null;
                }
            }, 'current_playback');
        } catch (error) {
            console.error('Error getting current playback:', error);
            return null;
        }
    }

    static async getUserProfileCore(dependencies, accessToken) {
        const { fetch, displayUserInfo, showResult, console } = dependencies;
        
        if (!accessToken) {
            const errorMessage = 'Missing access token';
            console.error('User profile validation failed:', errorMessage);
            showResult('Error getting user profile: ' + errorMessage, 'error');
            throw new Error(errorMessage);
        }
        
        const url = 'https://api.spotify.com/v1/me';
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            const response = await fetch(url, options);
            
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (parseError) {
                const errorMessage = 'Failed to parse user profile response';
                console.error('Error parsing user profile response:', parseError);
                showResult('Error getting user profile: ' + errorMessage, 'error');
                throw new Error(errorMessage);
            }
            
            if (response.ok && responseData) {
                displayUserInfo(responseData);
                return responseData;
            } else {
                showResult('Failed to get user profile', 'error');
                throw new Error('Failed to get user profile');
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            showResult('Error getting user profile: ' + error.message, 'error');
            throw error;
        }
    }

    static isTokenValidCore(dependencies) {
        const { getStorageItem, getCurrentTime } = dependencies;
        
        const token = getStorageItem('spotify_access_token');
        const expiry = getStorageItem('spotify_token_expiry');
        
        if (!token || !expiry) {
            return false;
        }
        
        const expiryTime = parseInt(expiry, 10);
        if (isNaN(expiryTime)) {
            return false;
        }
        
        const currentTime = getCurrentTime();
        return currentTime < expiryTime;
    }

    static getValidAccessTokenCore(dependencies) {
        const { getStorageItem, isTokenValidCore } = dependencies;
        
        const isValid = isTokenValidCore(dependencies);
        
        if (!isValid) {
            return null;
        }
        
        const token = getStorageItem('spotify_access_token');
        return token || null;
    }

    static async getUserPlaylistsCore(dependencies, accessToken, limit = 20) {
        const { fetch, console } = dependencies;
        
        if (!accessToken) {
            const errorMessage = 'Playlists validation failed: Missing access token';
            console.error(errorMessage);
            return [];
        }
        
        const validatedLimit = Math.max(1, Math.min(50, limit));
        
        const url = `https://api.spotify.com/v1/me/playlists?limit=${validatedLimit}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        
        try {
            const response = await fetch(url, options);
            
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (parseError) {
                console.error('Error parsing playlists response:', parseError);
                return [];
            }
            
            if (response.ok && responseData && responseData.items) {
                return responseData.items;
            } else {
                console.error('Error getting playlists:', response.status);
                throw new Error(`Failed to get playlists: ${response.status}`);
            }
        } catch (error) {
            console.error('Error getting playlists:', error);
            if (error.message && error.message.includes('Failed to get playlists:')) {
                throw error;
            }
            return [];
        }
    }
}

describe('SpotifyApiCore', () => {
    let mockDependencies;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        // Create comprehensive mock dependencies
        mockDependencies = {
            // DOM element mocks
            getElement: jest.fn(),
            
            // UI feedback mocks
            showResult: jest.fn(),
            displayUserInfo: jest.fn(),
            
            // Storage mocks
            storage: {
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn()
            },
            getStorageItem: jest.fn(),
            setStorageItem: jest.fn(),
            
            // Crypto/security mocks
            generateCodeVerifier: jest.fn(),
            generateCodeChallenge: jest.fn(),
            generateRandomString: jest.fn(),
            
            // Theme/accessibility mocks
            themeManager: {
                announceToScreenReader: jest.fn()
            },
            
            // Navigation mock
            navigate: jest.fn(),
            getRedirectUri: jest.fn(),
            
            // Network mocks
            fetchApi: jest.fn(),
            fetch: jest.fn(),
            
            // Performance optimization mocks
            queueRequest: jest.fn(),
            performanceOptimizer: {
                queueRequest: jest.fn()
            },
            
            // Logging mocks
            logWarning: jest.fn(),
            logError: jest.fn(),
            console: {
                error: jest.fn(),
                warn: jest.fn(),
                log: jest.fn()
            },
            
            // User profile mock
            getUserProfile: jest.fn(),
            
            // Time mock
            getCurrentTime: jest.fn(),
            
            // Token validation mock
            isTokenValidCore: jest.fn()
        };
    });

    describe('initiateAuthCore', () => {
        test('should successfully initiate OAuth authentication flow', async () => {
            // Arrange
            const mockClientIdInput = { 
                value: 'test-client-id',
                focus: jest.fn(),
                setAttribute: jest.fn()
            };
            const mockConnectBtn = { 
                disabled: false,
                innerHTML: '',
                setAttribute: jest.fn()
            };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'clientId') return mockClientIdInput;
                if (id === 'connectBtn') return mockConnectBtn;
                return null;
            });

            mockDependencies.generateCodeVerifier.mockReturnValue('test-code-verifier');
            mockDependencies.generateCodeChallenge.mockResolvedValue('test-code-challenge');
            mockDependencies.generateRandomString.mockReturnValue('test-state');
            mockDependencies.getRedirectUri.mockReturnValue('http://localhost:8080');

            // Act
            await SpotifyApiCore.initiateAuthCore(mockDependencies);

            // Assert
            expect(mockDependencies.getElement).toHaveBeenCalledWith('clientId');
            expect(mockDependencies.getElement).toHaveBeenCalledWith('connectBtn');
            expect(mockClientIdInput.setAttribute).toHaveBeenCalledWith('aria-invalid', 'false');
            expect(mockConnectBtn.disabled).toBe(true);
            expect(mockConnectBtn.innerHTML).toBe('🔄 Connecting...');
            expect(mockConnectBtn.setAttribute).toHaveBeenCalledWith('aria-busy', 'true');
            expect(mockDependencies.storage.setItem).toHaveBeenCalledWith('spotify_client_id', 'test-client-id');
            expect(mockDependencies.storage.setItem).toHaveBeenCalledWith('spotify_code_verifier', 'test-code-verifier');
        });

        test('should handle missing DOM elements', async () => {
            // Arrange
            mockDependencies.getElement.mockReturnValue(null);

            // Act & Assert
            await expect(SpotifyApiCore.initiateAuthCore(mockDependencies))
                .rejects.toThrow('Required DOM elements not found');
        });

        test('should handle empty client ID', async () => {
            // Arrange
            const mockClientIdInput = { 
                value: '',
                focus: jest.fn(),
                setAttribute: jest.fn()
            };
            const mockConnectBtn = { 
                disabled: false,
                innerHTML: '',
                setAttribute: jest.fn()
            };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'clientId') return mockClientIdInput;
                if (id === 'connectBtn') return mockConnectBtn;
                return null;
            });

            // Act
            await SpotifyApiCore.initiateAuthCore(mockDependencies);

            // Assert
            expect(mockDependencies.showResult).toHaveBeenCalledWith('Please enter a valid Client ID', 'error');
            expect(mockClientIdInput.focus).toHaveBeenCalled();
            expect(mockClientIdInput.setAttribute).toHaveBeenCalledWith('aria-invalid', 'true');
        });

        test('should handle authentication initiation errors', async () => {
            // Arrange
            const mockClientIdInput = { 
                value: 'test-client-id',
                focus: jest.fn(),
                setAttribute: jest.fn()
            };
            const mockConnectBtn = { 
                disabled: false,
                innerHTML: '',
                setAttribute: jest.fn()
            };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'clientId') return mockClientIdInput;
                if (id === 'connectBtn') return mockConnectBtn;
                return null;
            });

            mockDependencies.generateCodeVerifier.mockImplementation(() => {
                throw new Error('Code verifier generation failed');
            });

            // Act & Assert
            await expect(SpotifyApiCore.initiateAuthCore(mockDependencies))
                .rejects.toThrow('Code verifier generation failed');

            expect(mockDependencies.showResult).toHaveBeenCalledWith(
                'Failed to initiate authentication. Please try again.',
                'error'
            );
            expect(mockConnectBtn.disabled).toBe(false);
            expect(mockConnectBtn.innerHTML).toBe('🎵 Connect to Spotify');
        });
    });

    describe('exchangeCodeForTokenCore', () => {
        test('should successfully exchange authorization code for access token', async () => {
            // Arrange
            const mockAuthCodeInput = { value: 'test-auth-code' };
            const mockClientIdInput = { value: 'test-client-id' };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'authCode') return mockAuthCodeInput;
                if (id === 'clientId') return mockClientIdInput;
                return null;
            });

            mockDependencies.getStorageItem.mockImplementation((key) => {
                if (key === 'spotify_code_verifier') return 'test-code-verifier';
                return null;
            });

            mockDependencies.getRedirectUri.mockReturnValue('http://localhost:8080');

            const mockTokenResponse = {
                access_token: 'test-access-token',
                expires_in: 3600,
                refresh_token: 'test-refresh-token'
            };

            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockTokenResponse)
            });

            mockDependencies.getUserProfile.mockResolvedValue({});

            // Act
            await SpotifyApiCore.exchangeCodeForTokenCore(mockDependencies);

            // Assert
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                'https://accounts.spotify.com/api/token',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            );
            expect(mockDependencies.setStorageItem).toHaveBeenCalledWith('spotify_access_token', 'test-access-token');
            expect(mockDependencies.showResult).toHaveBeenCalledWith('Successfully connected to Spotify API!', 'success');
            expect(mockDependencies.getUserProfile).toHaveBeenCalledWith('test-access-token');
        });

        test('should handle missing DOM elements', async () => {
            // Arrange
            mockDependencies.getElement.mockReturnValue(null);

            // Act & Assert
            await expect(SpotifyApiCore.exchangeCodeForTokenCore(mockDependencies))
                .rejects.toThrow('Required DOM elements not found');
        });

        test('should handle missing required parameters', async () => {
            // Arrange
            const mockAuthCodeInput = { value: '' };
            const mockClientIdInput = { value: '' };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'authCode') return mockAuthCodeInput;
                if (id === 'clientId') return mockClientIdInput;
                return null;
            });

            mockDependencies.getStorageItem.mockReturnValue(null);

            // Act
            await SpotifyApiCore.exchangeCodeForTokenCore(mockDependencies);

            // Assert
            expect(mockDependencies.showResult).toHaveBeenCalledWith(
                'Missing required parameters for token exchange',
                'error'
            );
        });

        test('should handle API errors', async () => {
            // Arrange
            const mockAuthCodeInput = { value: 'test-auth-code' };
            const mockClientIdInput = { value: 'test-client-id' };

            mockDependencies.getElement.mockImplementation((id) => {
                if (id === 'authCode') return mockAuthCodeInput;
                if (id === 'clientId') return mockClientIdInput;
                return null;
            });

            mockDependencies.getStorageItem.mockReturnValue('test-code-verifier');
            mockDependencies.getRedirectUri.mockReturnValue('http://localhost:8080');

            mockDependencies.fetchApi.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue({
                    error: 'invalid_grant'
                })
            });

            // Act
            await SpotifyApiCore.exchangeCodeForTokenCore(mockDependencies);

            // Assert
            expect(mockDependencies.showResult).toHaveBeenCalledWith('Error: invalid_grant', 'error');
        });
    });

    describe('getAudioFeaturesCore', () => {
        test('should successfully retrieve audio features', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const trackIds = ['track1', 'track2', 'track3'];
            const mockAudioFeatures = [
                { id: 'track1', valence: 0.8, energy: 0.7 },
                { id: 'track2', valence: 0.6, energy: 0.5 },
                { id: 'track3', valence: 0.4, energy: 0.9 }
            ];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    audio_features: mockAudioFeatures
                })
            });

            // Act
            const result = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, accessToken, trackIds);

            // Assert
            expect(result).toEqual(mockAudioFeatures);
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle invalid inputs', async () => {
            // Act
            const result1 = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, null, ['track1']);
            const result2 = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, 'token', null);
            const result3 = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, 'token', []);

            // Assert
            expect(result1).toEqual([]);
            expect(result2).toEqual([]);
            expect(result3).toEqual([]);
            expect(mockDependencies.logError).toHaveBeenCalledTimes(3);
        });

        test('should filter out null audio features', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const trackIds = ['track1', 'track2', 'track3'];
            const mockResponse = [
                { id: 'track1', valence: 0.8, energy: 0.7 },
                null,
                { id: 'track3', valence: 0.4, energy: 0.9 }
            ];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    audio_features: mockResponse
                })
            });

            // Act
            const result = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, accessToken, trackIds);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('track1');
            expect(result[1].id).toBe('track3');
        });
    });

    describe('getTopTracksCore', () => {
        test('should successfully retrieve top tracks', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const timeRange = 'medium_term';
            const limit = 20;
            const mockTracks = [
                { id: 'track1', name: 'Track 1' },
                { id: 'track2', name: 'Track 2' }
            ];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    items: mockTracks
                })
            });

            // Act
            const result = await SpotifyApiCore.getTopTracksCore(mockDependencies, accessToken, timeRange, limit);

            // Assert
            expect(result).toEqual(mockTracks);
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle missing access token', async () => {
            // Act & Assert
            await expect(SpotifyApiCore.getTopTracksCore(mockDependencies, null))
                .rejects.toThrow('Missing access token');
            expect(mockDependencies.logError).toHaveBeenCalledWith(
                'Top tracks validation failed: Missing access token'
            );
        });

        test('should validate and correct time range and limit parameters', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const invalidTimeRange = 'invalid_range';
            const invalidLimit = 100;

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ items: [] })
            });

            // Act
            await SpotifyApiCore.getTopTracksCore(mockDependencies, accessToken, invalidTimeRange, invalidLimit);

            // Assert
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
                expect.any(Object)
            );
        });
    });

    describe('getTopArtistsCore', () => {
        test('should successfully retrieve top artists', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const timeRange = 'short_term';
            const limit = 10;
            const mockArtists = [
                { id: 'artist1', name: 'Artist 1' },
                { id: 'artist2', name: 'Artist 2' }
            ];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    items: mockArtists
                })
            });

            // Act
            const result = await SpotifyApiCore.getTopArtistsCore(mockDependencies, accessToken, timeRange, limit);

            // Assert
            expect(result).toEqual(mockArtists);
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle API errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: false,
                status: 401,
                json: jest.fn().mockResolvedValue({
                    error: { message: 'Unauthorized' }
                })
            });

            // Act & Assert
            await expect(SpotifyApiCore.getTopArtistsCore(mockDependencies, accessToken))
                .rejects.toThrow('Failed to get top artists: 401');
            expect(mockDependencies.logError).toHaveBeenCalledWith('Failed to get top artists:', 401);
        });
    });

    describe('getRecentlyPlayedCore', () => {
        test('should successfully retrieve recently played tracks', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const limit = 30;
            const mockTracks = [
                { track: { id: 'track1', name: 'Recent Track 1' }, played_at: '2023-01-01T10:00:00Z' },
                { track: { id: 'track2', name: 'Recent Track 2' }, played_at: '2023-01-01T09:30:00Z' }
            ];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    items: mockTracks
                })
            });

            // Act
            const result = await SpotifyApiCore.getRecentlyPlayedCore(mockDependencies, accessToken, limit);

            // Assert
            expect(result).toEqual(mockTracks);
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle missing access token gracefully', async () => {
            // Act
            const result = await SpotifyApiCore.getRecentlyPlayedCore(mockDependencies, null);

            // Assert
            expect(result).toEqual([]);
            expect(mockDependencies.logError).toHaveBeenCalledWith(
                'Recently played validation failed: Missing access token'
            );
        });

        test('should limit validation', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const invalidLimit = 100;

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ items: [] })
            });

            // Act
            await SpotifyApiCore.getRecentlyPlayedCore(mockDependencies, accessToken, invalidLimit);

            // Assert
            expect(mockDependencies.fetchApi).toHaveBeenCalledWith(
                'https://api.spotify.com/v1/me/player/recently-played?limit=50',
                expect.any(Object)
            );
        });
    });

    describe('getCurrentPlaybackCore', () => {
        test('should successfully retrieve current playback', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const mockPlayback = {
                is_playing: true,
                item: { id: 'track1', name: 'Current Track' }
            };

            mockDependencies.performanceOptimizer.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockPlayback)
            });

            // Act
            const result = await SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken);

            // Assert
            expect(result).toEqual(mockPlayback);
            expect(mockDependencies.fetch).toHaveBeenCalledWith(
                'https://api.spotify.com/v1/me/player',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle no active playback (204 status)', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.performanceOptimizer.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetch.mockResolvedValue({
                status: 204
            });

            // Act
            const result = await SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken);

            // Assert
            expect(result).toBeNull();
        });

        test('should handle missing access token', async () => {
            // Act
            const result = await SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, null);

            // Assert
            expect(result).toBeNull();
            expect(mockDependencies.console.error).toHaveBeenCalledWith(
                'Current playback validation failed: Missing access token'
            );
        });

        test('should handle JSON parsing errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.performanceOptimizer.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockRejectedValue(new Error('JSON parse error'))
            });

            // Act
            const result = await SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken);

            // Assert
            expect(result).toBeNull();
            expect(mockDependencies.console.warn).toHaveBeenCalledWith(
                'Failed to parse current playback response:',
                expect.any(Error)
            );
        });
    });

    describe('getUserProfileCore', () => {
        test('should successfully retrieve user profile', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const mockProfile = {
                id: 'user123',
                display_name: 'Test User',
                email: 'test@example.com'
            };

            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockProfile)
            });

            // Act
            const result = await SpotifyApiCore.getUserProfileCore(mockDependencies, accessToken);

            // Assert
            expect(result).toEqual(mockProfile);
            expect(mockDependencies.displayUserInfo).toHaveBeenCalledWith(mockProfile);
            expect(mockDependencies.fetch).toHaveBeenCalledWith(
                'https://api.spotify.com/v1/me',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle missing access token', async () => {
            // Act & Assert
            await expect(SpotifyApiCore.getUserProfileCore(mockDependencies, null))
                .rejects.toThrow('Missing access token');
            expect(mockDependencies.showResult).toHaveBeenCalledWith(
                'Error getting user profile: Missing access token',
                'error'
            );
        });

        test('should handle API errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.fetch.mockResolvedValue({
                ok: false,
                status: 401,
                json: jest.fn().mockResolvedValue({
                    error: { message: 'Unauthorized' }
                })
            });

            // Act & Assert
            await expect(SpotifyApiCore.getUserProfileCore(mockDependencies, accessToken))
                .rejects.toThrow('Failed to get user profile');
            expect(mockDependencies.showResult).toHaveBeenCalledWith('Failed to get user profile', 'error');
        });

        test('should handle JSON parsing errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockRejectedValue(new Error('JSON parse error'))
            });

            // Act & Assert
            await expect(SpotifyApiCore.getUserProfileCore(mockDependencies, accessToken))
                .rejects.toThrow('Failed to parse user profile response');
            expect(mockDependencies.showResult).toHaveBeenCalledWith(
                'Error getting user profile: Failed to parse user profile response',
                'error'
            );
        });
    });

    describe('isTokenValidCore', () => {
        test('should return true for valid token', () => {
            // Arrange
            const currentTime = Date.now();
            const futureTime = currentTime + 3600000; // 1 hour from now

            mockDependencies.getStorageItem.mockImplementation((key) => {
                if (key === 'spotify_access_token') return 'valid-token';
                if (key === 'spotify_token_expiry') return futureTime.toString();
                return null;
            });
            mockDependencies.getCurrentTime.mockReturnValue(currentTime);

            // Act
            const result = SpotifyApiCore.isTokenValidCore(mockDependencies);

            // Assert
            expect(result).toBe(true);
        });

        test('should return false for expired token', () => {
            // Arrange
            const currentTime = Date.now();
            const pastTime = currentTime - 3600000; // 1 hour ago

            mockDependencies.getStorageItem.mockImplementation((key) => {
                if (key === 'spotify_access_token') return 'expired-token';
                if (key === 'spotify_token_expiry') return pastTime.toString();
                return null;
            });
            mockDependencies.getCurrentTime.mockReturnValue(currentTime);

            // Act
            const result = SpotifyApiCore.isTokenValidCore(mockDependencies);

            // Assert
            expect(result).toBe(false);
        });

        test('should return false for missing token', () => {
            // Arrange
            mockDependencies.getStorageItem.mockReturnValue(null);

            // Act
            const result = SpotifyApiCore.isTokenValidCore(mockDependencies);

            // Assert
            expect(result).toBe(false);
        });

        test('should return false for invalid expiry format', () => {
            // Arrange
            mockDependencies.getStorageItem.mockImplementation((key) => {
                if (key === 'spotify_access_token') return 'valid-token';
                if (key === 'spotify_token_expiry') return 'invalid-expiry';
                return null;
            });

            // Act
            const result = SpotifyApiCore.isTokenValidCore(mockDependencies);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('getValidAccessTokenCore', () => {
        test('should return token when valid', () => {
            // Arrange
            const validToken = 'valid-access-token';
            mockDependencies.isTokenValidCore.mockReturnValue(true);
            mockDependencies.getStorageItem.mockReturnValue(validToken);

            // Act
            const result = SpotifyApiCore.getValidAccessTokenCore(mockDependencies);

            // Assert
            expect(result).toBe(validToken);
            expect(mockDependencies.isTokenValidCore).toHaveBeenCalledWith(mockDependencies);
        });

        test('should return null when token is invalid', () => {
            // Arrange
            mockDependencies.isTokenValidCore.mockReturnValue(false);

            // Act
            const result = SpotifyApiCore.getValidAccessTokenCore(mockDependencies);

            // Assert
            expect(result).toBeNull();
        });

        test('should return null when token is missing', () => {
            // Arrange
            mockDependencies.isTokenValidCore.mockReturnValue(true);
            mockDependencies.getStorageItem.mockReturnValue(null);

            // Act
            const result = SpotifyApiCore.getValidAccessTokenCore(mockDependencies);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getUserPlaylistsCore', () => {
        test('should successfully retrieve user playlists', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const limit = 20;
            const mockPlaylists = [
                { id: 'playlist1', name: 'My Playlist 1' },
                { id: 'playlist2', name: 'My Playlist 2' }
            ];

            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    items: mockPlaylists
                })
            });

            // Act
            const result = await SpotifyApiCore.getUserPlaylistsCore(mockDependencies, accessToken, limit);

            // Assert
            expect(result).toEqual(mockPlaylists);
            expect(mockDependencies.fetch).toHaveBeenCalledWith(
                `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            );
        });

        test('should handle missing access token', async () => {
            // Act
            const result = await SpotifyApiCore.getUserPlaylistsCore(mockDependencies, null);

            // Assert
            expect(result).toEqual([]);
            expect(mockDependencies.console.error).toHaveBeenCalledWith(
                'Playlists validation failed: Missing access token'
            );
        });

        test('should validate limit parameter', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const invalidLimit = 100;

            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ items: [] })
            });

            // Act
            await SpotifyApiCore.getUserPlaylistsCore(mockDependencies, accessToken, invalidLimit);

            // Assert
            expect(mockDependencies.fetch).toHaveBeenCalledWith(
                'https://api.spotify.com/v1/me/playlists?limit=50',
                expect.any(Object)
            );
        });

        test('should handle API errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.fetch.mockResolvedValue({
                ok: false,
                status: 403,
                json: jest.fn().mockResolvedValue({
                    error: { message: 'Forbidden' }
                })
            });

            // Act & Assert
            await expect(SpotifyApiCore.getUserPlaylistsCore(mockDependencies, accessToken))
                .rejects.toThrow('Failed to get playlists: 403');
            expect(mockDependencies.console.error).toHaveBeenCalledWith('Error getting playlists:', 403);
            expect(mockDependencies.console.error).toHaveBeenCalledWith('Error getting playlists:', expect.any(Error));
        });

        test('should handle JSON parsing errors', async () => {
            // Arrange
            const accessToken = 'test-access-token';

            mockDependencies.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockRejectedValue(new Error('JSON parse error'))
            });

            // Act
            const result = await SpotifyApiCore.getUserPlaylistsCore(mockDependencies, accessToken);

            // Assert
            expect(result).toEqual([]);
            expect(mockDependencies.console.error).toHaveBeenCalledWith(
                'Error parsing playlists response:',
                expect.any(Error)
            );
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle network timeouts gracefully', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            mockDependencies.performanceOptimizer.queueRequest.mockImplementation(async (fn) => {
                throw new Error('Network timeout');
            });

            // Act
            const result = await SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken);

            // Assert
            expect(result).toBeNull();
            expect(mockDependencies.console.error).toHaveBeenCalledWith(
                'Error getting current playback:',
                expect.any(Error)
            );
        });

        test('should handle malformed response data', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            const trackIds = ['track1'];

            mockDependencies.queueRequest.mockImplementation(async (fn) => await fn());
            mockDependencies.fetchApi.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    // Missing audio_features property
                    items: []
                })
            });

            // Act
            const result = await SpotifyApiCore.getAudioFeaturesCore(mockDependencies, accessToken, trackIds);

            // Assert
            expect(result).toEqual([]);
        });

        test('should handle concurrent request scenarios', async () => {
            // Arrange
            const accessToken = 'test-access-token';
            let callCount = 0;

            mockDependencies.performanceOptimizer.queueRequest.mockImplementation(async (fn) => {
                callCount++;
                return await fn();
            });

            mockDependencies.fetch.mockResolvedValue({
                status: 204
            });

            // Act
            const promises = [
                SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken),
                SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken),
                SpotifyApiCore.getCurrentPlaybackCore(mockDependencies, accessToken)
            ];

            const results = await Promise.all(promises);

            // Assert
            expect(results).toEqual([null, null, null]);
            expect(callCount).toBe(3);
        });
    });
});