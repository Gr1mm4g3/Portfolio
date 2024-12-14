const CACHE_NAME = 'portfolio-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/animations.css',
    '/css/skills-tree.css',
    '/css/project-modal.css',
    '/css/project-carousel.css',
    '/css/experience-timeline.css',
    '/css/lazy-loading.css',
    '/js/main.js',
    '/js/skills-tree.js',
    '/js/project-modal.js',
    '/js/project-carousel.js',
    '/js/experience-timeline.js',
    '/js/lazy-loading.js',
    '/images/projects/portfolio-screenshot.png',
    '/images/projects/2048-screenshot.png',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Error caching assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Cache successful network requests
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                // Only cache same-origin requests
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, fetchResponse.clone());
                                }
                                return fetchResponse;
                            });
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        // You could return a custom offline page here
                        return new Response('Offline - Content not available');
                    });
            })
    );
});
