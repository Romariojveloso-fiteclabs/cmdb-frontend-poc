const CACHE_PREFIX = 'cmdb-pwa';
const CACHE_VERSION = 'v4';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const withScope = (path) => `${SCOPE_PATH}/${path.replace(/^\/+/, '')}`;

const APP_SHELL = [
  withScope('/manifest.webmanifest'),
  withScope('/assets/cmdb-logo.png'),
  withScope('/assets/ufpe-brasao.png'),
  withScope('/assets/cmdb-icon-192.png'),
  withScope('/assets/cmdb-icon-512.png'),
  withScope('/assets/cmdb-icon-maskable-512.png')
];

async function cacheBuildGraph(cache, initialAssets) {
  const pending = [...initialAssets];
  const visited = new Set();

  while (pending.length > 0) {
    const assetPath = pending.shift();
    if (!assetPath || visited.has(assetPath)) continue;
    visited.add(assetPath);

    const assetUrl = new URL(assetPath, self.location.origin);
    const response = await fetch(assetUrl, { cache: 'reload' });
    if (!response.ok) continue;

    await cache.put(assetUrl, response.clone());

    if (assetUrl.pathname.endsWith('.js')) {
      const source = await response.text();
      const staticImports = Array.from(source.matchAll(/(?:\bfrom\s*|\bimport\s*)["']([^"']+\.js)["']/g));

      for (const match of staticImports) {
        const dependency = new URL(match[1], assetUrl);
        if (dependency.origin === self.location.origin && dependency.pathname.startsWith(`${SCOPE_PATH}/`)) {
          pending.push(dependency.pathname);
        }
      }
    }
  }
}

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const appUrl = withScope('/');
  const appResponse = await fetch(appUrl, { cache: 'reload' });

  if (!appResponse.ok) throw new Error('Unable to cache the CMDB application shell.');

  await cache.put(appUrl, appResponse.clone());
  const html = await appResponse.text();
  const buildAssets = Array.from(html.matchAll(/["']([^"']+\.(?:css|js))["']/g))
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin && url.pathname.startsWith(`${SCOPE_PATH}/`))
    .map((url) => url.pathname);

  await cache.addAll(APP_SHELL);
  await cacheBuildGraph(cache, [...new Set(buildAssets)]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(withScope('/')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => cachedResponse || new Response('Offline', {
          status: 503,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }));

      return cachedResponse || networkResponse;
    })
  );
});
