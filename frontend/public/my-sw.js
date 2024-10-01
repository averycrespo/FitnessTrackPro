function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'FTP_STATIC_CACHE';

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        // Add URLs of all hard-coded files to cache during installation
        'https://fonts.googleapis.com/css2?family=Alumni+Sans+Inline+One:ital@0;1&family=Bungee+Inline&family=Bungee+Shade&family=Faster+One&family=Orbitron&display=swap',
        'https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('FTP') && cacheName !== STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  // Treat API calls (to our API) differently
  if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    // If we are here, we are intercepting a call to our API
    if (event.request.method === "GET") {
      // Only intercept (and cache) GET API requests
      event.respondWith(cacheFirst(event.request));
    }
  } else {
    // If we are here, this was not a call to our API
    event.respondWith(cacheFirst(event.request));
  }
});

function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      // Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      // Return the cached offline page if there's an error (e.g., if the user is offline)
      // return Response.redirect('/offline', 302);
    });
}

function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      var requestUrl = new URL(request.url);
      // Cache successful GET requests that are not browser extensions
      if (response.ok && request.method === "GET" && !requestUrl.protocol.startsWith('chrome-extension')) {
        caches.open(STATIC_CACHE_NAME).then(cache => {
          cache.put(request, response);
        });
      }
      return response.clone();
    })
    .catch(() => {
      // Return the cached offline page if the fetch fails (e.g., due to network error)
      // return Response.redirect('/offline', 302);
    });
}
