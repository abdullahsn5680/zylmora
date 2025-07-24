// Custom Service Worker for Maximum Edge Request Reduction
// Place this file in your public/ directory as sw.js

importScripts('/workbox-sw.js');

if (workbox) {
  console.log('Workbox loaded successfully');
  
  // Skip waiting and claim clients immediately
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();
  
  // Set cache name prefix
  workbox.core.setCacheNameDetails({
    prefix: 'pwa-app',
    suffix: 'v1',
  });
  
  // Precache all static assets
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  
  // Cache everything strategy - most aggressive approach
  
  // 1. Cache all navigation requests (HTML pages)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  // 2. Cache all API requests with long expiration
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.CacheFirst({
      cacheName: 'api-cache-extreme',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200, 201, 202, 203, 204, 300, 301, 302, 304],
        }),
        // Remove cache-busting parameters
        {
          cacheKeyWillBeUsed: async ({ request }) => {
            const url = new URL(request.url);
            ['t', 'timestamp', '_', 'v', 'cache'].forEach(param => {
              url.searchParams.delete(param);
            });
            return url.toString();
          },
        },
      ],
    })
  );
  
  // 3. Cache all images extremely aggressively
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-extreme',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 1000,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200, 206],
        }),
      ],
    })
  );
  
  // 4. Cache all external resources
  workbox.routing.registerRoute(
    ({ url }) => url.origin !== self.location.origin,
    new workbox.strategies.CacheFirst({
      cacheName: 'external-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  // 5. Cache all static assets
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets-extreme',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 300,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        }),
      ],
    })
  );
  
  // Offline fallback
  const offlinePage = '/offline.html';
  
  // Cache the offline page
  workbox.precaching.precacheAndRoute([
    { url: offlinePage, revision: null },
  ]);
  
  // Catch all routing - serve from cache first, fallback to offline page
  workbox.routing.setCatchHandler(({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(offlinePage);
    }
    return Response.error();
  });
  
  // Background sync for failed requests
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('api-queue', {
    maxRetentionTime: 24 * 60, // 24 hours
  });
  
  // Add background sync to API requests
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/') && url.pathname.includes('sync'),
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin],
    }),
    'POST'
  );
  
} else {
  console.log('Workbox could not be loaded');
}

// Additional aggressive caching strategies
self.addEventListener('fetch', (event) => {
  // Cache everything that wasn't caught by Workbox
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Determine cache name based on request type
          let cacheName = 'general-cache';
          if (event.request.url.includes('/api/')) {
            cacheName = 'api-fallback';
          } else if (event.request.destination === 'image') {
            cacheName = 'images-fallback';
          }
          
          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
  }
});

// Clear old caches periodically
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [
    'pwa-app-pages-cache-v1',
    'pwa-app-api-cache-extreme-v1',
    'pwa-app-images-extreme-v1',
    'pwa-app-static-assets-extreme-v1',
    'pwa-app-external-resources-v1',
  ];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});