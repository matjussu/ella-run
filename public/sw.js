/**
 * Service Worker for ELLA Run PWA
 * 
 * Provides offline functionality and caching for the fitness app
 */

const CACHE_NAME = 'ella-run-v1.0.0';
const API_CACHE_NAME = 'ella-run-api-v1.0.0';

// Files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo_run.png',
  '/logo_run.svg',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_URLS = [
  // Firebase API calls will be cached dynamically
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching essential files');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests (Firebase, RapidAPI)
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('rapidapi.com')) {
    
    event.respondWith(
      caches.open(API_CACHE_NAME)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache successful API responses
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return cached response if available
              return cache.match(request);
            });
        })
    );
    return;
  }

  // Handle app resources
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }

        // Fetch from network and cache the response
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            // Clone the response for caching
            const responseClone = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline workout completions
self.addEventListener('sync', (event) => {
  if (event.tag === 'workout-sync') {
    console.log('🔄 Service Worker: Syncing offline workout data');
    event.waitUntil(
      // This would sync any offline workout completions when back online
      syncOfflineWorkouts()
    );
  }
});

// Handle app update notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Service Worker: Updating to new version');
    self.skipWaiting();
  }
});

// Sync offline workouts (placeholder function)
async function syncOfflineWorkouts() {
  try {
    // This would sync any pending workout data stored locally
    console.log('📊 Service Worker: Syncing workout data...');
    // Implementation would go here
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Service Worker: Sync failed', error);
    throw error;
  }
}

// Push notification handler (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('📬 Service Worker: Push notification received', data);
    
    const options = {
      body: data.body || 'Temps pour votre entraînement !',
      icon: '/logo_run.png',
      badge: '/logo_run.png',
      tag: 'ella-run-notification',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'start-workout',
          title: 'Commencer'
        },
        {
          action: 'dismiss',
          title: 'Plus tard'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'ELLA Run', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start-workout') {
    // Open the app to workout section
    event.waitUntil(
      clients.openWindow('/?action=start-workout')
    );
  } else if (event.action !== 'dismiss') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('💪 ELLA Run Service Worker loaded successfully!');