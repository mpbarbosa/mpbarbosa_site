// Music in Numbers - Service Worker for Offline Functionality
// Version 3.0 - Performance Optimized

const CACHE_NAME = 'music-in-numbers-v3.0';
const STATIC_CACHE = 'music-in-numbers-static-v3.0';
const API_CACHE = 'music-in-numbers-api-v3.0';

// Resources to cache
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/music_in_numbers.html',
    '/artist.html',
    '/styles.css',
    // Add other static resources as needed
];

// API endpoints to cache
const CACHEABLE_API_PATTERNS = [
    /^https:\/\/api\.spotify\.com\/v1\/me$/,
    /^https:\/\/api\.spotify\.com\/v1\/me\/top\//,
    /^https:\/\/api\.spotify\.com\/v1\/me\/player\/recently-played/,
    /^https:\/\/api\.spotify\.com\/v1\/audio-features/
];

// Install event - cache static resources
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static resources
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static resources');
                return cache.addAll(STATIC_RESOURCES.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
            }),
            
            // Initialize API cache
            caches.open(API_CACHE).then(cache => {
                console.log('📡 API cache initialized');
                return cache;
            })
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker installation failed:', error);
        })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== API_CACHE && 
                        cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Static resources - Cache First strategy
        event.respondWith(handleStaticRequest(request));
    } else if (url.hostname === 'api.spotify.com') {
        // Spotify API - Network First with cache fallback
        event.respondWith(handleAPIRequest(request));
    } else if (url.hostname === 'accounts.spotify.com') {
        // Spotify auth - Network Only
        event.respondWith(fetch(request));
    }
});

// Handle static resource requests
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Serving from cache:', request.url);
            return cachedResponse;
        }
        
        // Fetch from network and cache
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('🌐 Fetched and cached:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Static request failed:', error);
        
        // Return cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page if available
        if (request.destination === 'document') {
            return caches.match('/offline.html') || 
                   new Response('Offline - Please check your connection', {
                       status: 503,
                       headers: { 'Content-Type': 'text/html' }
                   });
        }
        
        throw error;
    }
}

// Handle API requests
async function handleAPIRequest(request) {
    const url = request.url;
    const isCacheable = CACHEABLE_API_PATTERNS.some(pattern => pattern.test(url));
    
    try {
        // Always try network first for fresh data
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok && isCacheable) {
            // Cache successful responses for cacheable endpoints
            const cache = await caches.open(API_CACHE);
            
            // Clone response for caching
            const responseToCache = networkResponse.clone();
            
            // Add timestamp to cached response
            const responseWithTimestamp = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: {
                    ...Object.fromEntries(responseToCache.headers.entries()),
                    'x-cache-timestamp': Date.now().toString()
                }
            });
            
            cache.put(request, responseWithTimestamp);
            console.log('📡 API response cached:', url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.warn('🌐 Network request failed, trying cache:', url);
        
        if (isCacheable) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                // Check if cached response is not too old (5 minutes)
                const cacheTimestamp = cachedResponse.headers.get('x-cache-timestamp');
                const isStale = cacheTimestamp && 
                    (Date.now() - parseInt(cacheTimestamp)) > 5 * 60 * 1000;
                
                if (!isStale) {
                    console.log('📦 Serving cached API response:', url);
                    
                    // Add offline indicator header
                    const offlineResponse = new Response(cachedResponse.body, {
                        status: cachedResponse.status,
                        statusText: cachedResponse.statusText,
                        headers: {
                            ...Object.fromEntries(cachedResponse.headers.entries()),
                            'x-served-from': 'cache-offline'
                        }
                    });
                    
                    return offlineResponse;
                }
            }
        }
        
        // Return error response for uncacheable or stale requests
        return new Response(
            JSON.stringify({
                error: 'offline',
                message: 'No network connection and no cached data available'
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle background sync for when connection is restored
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync-analytics') {
        event.waitUntil(syncAnalyticsData());
    }
});

// Sync analytics data when connection is restored
async function syncAnalyticsData() {
    try {
        console.log('📊 Syncing analytics data...');
        
        // Get any pending analytics data from IndexedDB
        const pendingData = await getPendingAnalyticsData();
        
        if (pendingData && pendingData.length > 0) {
            // Send pending data to analytics endpoint
            for (const data of pendingData) {
                try {
                    await fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    // Remove from pending queue
                    await removePendingAnalyticsData(data.id);
                    
                } catch (error) {
                    console.error('Failed to sync analytics data:', error);
                }
            }
            
            console.log('✅ Analytics data synced successfully');
        }
        
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// IndexedDB helpers for offline data storage
async function getPendingAnalyticsData() {
    // Implementation would use IndexedDB to retrieve pending data
    // This is a placeholder for the actual implementation
    return [];
}

async function removePendingAnalyticsData(id) {
    // Implementation would remove data from IndexedDB
    // This is a placeholder for the actual implementation
    console.log('Removing pending data:', id);
}

// Handle push notifications (future feature)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log('🔔 Push notification received:', data);
        
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            data: data.data,
            actions: data.actions
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('🔔 Notification clicked:', event.notification);
    
    event.notification.close();
    
    if (event.action === 'open-app') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_STATS') {
        getCacheStats().then(stats => {
            event.ports[0].postMessage(stats);
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearAllCaches().then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Get cache statistics
async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }
    
    return {
        caches: stats,
        totalCaches: cacheNames.length,
        timestamp: Date.now()
    };
}

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ All caches cleared');
}

console.log('🎵 Music in Numbers Service Worker loaded');