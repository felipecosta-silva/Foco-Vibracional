/* Service Worker — Foco Vibracional
   Funciona offline (na mata ou na estrada). Ao publicar mudanças, aumente CACHE_VERSION. */
const CACHE_VERSION = "fv-v14";
const PRECACHE = [
  "./",
  "banhos.html",
  "calendario.html",
  "colheita.html",
  "defumacao.html",
  "firmeza.html",
  "glossario.html",
  "index.html",
  "mantras.html",
  "plantas.html",
  "portais.html",
  "simbolos.html",
  "tarot.html",
  "styles/styles.css",
  "script/script.js",
  "data/banhos.js",
  "data/defumacoes.js",
  "data/ervas.js",
  "data/mantras.js",
  "data/tarot.js",
  "fonts/fraunces-latin-opsz-italic.woff2",
  "fonts/fraunces-latin-opsz-normal.woff2",
  "fonts/inter-latin-wght-normal.woff2",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "images/alecrim.jpg",
  "images/alfazema.jpg",
  "images/arruda.jpg",
  "images/boldo.jpg",
  "images/camomila.jpg",
  "images/capim_limao.jpg",
  "images/espada.jpg",
  "images/guine.jpg",
  "images/hortela.jpg",
  "images/jurema.jpg",
  "images/louro.jpg",
  "images/manjericao.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Stale-while-revalidate: responde do cache na hora e atualiza em segundo plano */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE_VERSION).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    })
  );
});
