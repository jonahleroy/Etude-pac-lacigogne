// Généré par scripts/precache.mjs : ne pas modifier à la main.
const CACHE = 'etude-pac-c174bc3d09cc'
const URLS = ["./","./assets/index-wXS8PQnM.js","./assets/index-BNvm00jM.css","./icon-180.png","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest"]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

// La page : du réseau quand il répond vite, sinon du téléphone ; ainsi une nouvelle version arrive
// à la première ouverture en ligne. Les fichiers versionnés : du téléphone, puis gardés au passage.
const fromNetwork = request =>
  Promise.race([
    fetch(request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put('./', response.clone()))
      return response
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('lent')), 3000)),
  ])

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (event.request.mode === 'navigate') {
    event.respondWith(fromNetwork(event.request).catch(() => caches.match('./')))
    return
  }
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(
      hit =>
        hit ||
        fetch(event.request).then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()))
          return response
        }),
    ),
  )
})
