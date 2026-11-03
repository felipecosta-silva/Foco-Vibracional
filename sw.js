/* Service Worker — Foco Vibracional
   Funciona offline (na mata ou na estrada). Ao publicar mudanças, aumente CACHE_VERSION. */
const CACHE_VERSION = "fv-v43";
const PRECACHE = [
  "./",
  "banhos.html",
  "calendario.html",
  "colheita.html",
  "defumacao.html",
  "firmeza.html",
  "comece.html",
  "jurema.html",
  "contas.html",
  "glossario.html",
  "index.html",
  "mantras.html",
  "plantas.html",
  "pontos.html",
  "portais.html",
  "simbolos.html",
  "tarot.html",
  "404.html",
  "styles/styles.css",
  "script/nucleo.js",
  "script/lua.js",
  "script/praticas.js",
  "script/catalogo.js",
  "script/tarot-pontos.js",
  "script/colheita-calendario.js",
  "script/portais.js",
  "script/simbolos.js",
  "script/hoje.js",
  "script/busca.js",
  "script/inicio.js",
  "data/banhos.js",
  "data/creditos-fotos.js",
  "data/defumacoes.js",
  "data/ervas.js",
  "data/mantras.js",
  "data/pontos.js",
  "data/tarot.js",
  "fonts/fraunces-latin-opsz-italic.woff2",
  "fonts/fraunces-latin-opsz-normal.woff2",
  "fonts/inter-latin-wght-normal.woff2",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "images/abacateiro.jpg",
  "images/abacaxi-roxo.jpg",
  "images/abre-caminho.jpg",
  "images/alecrim.jpg",
  "images/alfavaca.jpg",
  "images/alfazema.jpg",
  "images/amora.jpg",
  "images/anis-estrelado.jpg",
  "images/araca.jpg",
  "images/arnica.jpg",
  "images/aroeira.jpg",
  "images/arruda.jpg",
  "images/artemisia.jpg",
  "images/babosa.jpg",
  "images/boldo.jpg",
  "images/brilhantina.jpg",
  "images/buganvilia.jpg",
  "images/caja.jpg",
  "images/cajueiro.jpg",
  "images/calendula.jpg",
  "images/camomila.jpg",
  "images/cana-do-brejo.jpg",
  "images/canela.jpg",
  "images/capim-limao.jpg",
  "images/carambola.jpg",
  "images/coentro.jpg",
  "images/colonia.jpg",
  "images/comigo-ninguem-pode.jpg",
  "images/cravo-da-india.jpg",
  "images/erva-cidreira.jpg",
  "images/erva-doce.jpg",
  "images/espada-santa-barbara.jpg",
  "images/espada-sao-jorge.jpg",
  "images/espinheira-santa.jpg",
  "images/eucalipto.jpg",
  "images/folha-bananeira.jpg",
  "images/gengibre.jpg",
  "images/girassol.jpg",
  "images/goiabeira.jpg",
  "images/guine.jpg",
  "images/hibisco.jpg",
  "images/hortela.jpg",
  "images/jambo.jpg",
  "images/jasmim.jpg",
  "images/jenipapo.jpg",
  "images/jiboia.jpg",
  "images/jurema-preta.jpg",
  "images/laranjeira.jpg",
  "images/levante.jpg",
  "images/limoeiro.jpg",
  "images/louro.jpg",
  "images/malva.jpg",
  "images/mamao.jpg",
  "images/mamona.jpg",
  "images/manga.jpg",
  "images/manjericao-roxo.jpg",
  "images/manjericao.jpg",
  "images/manjerona.jpg",
  "images/maracuja.jpg",
  "images/noz-moscada.jpg",
  "images/og-cover.jpg",
  "images/onze-horas.jpg",
  "images/ora-pro-nobis.jpg",
  "images/oregano.jpg",
  "images/palmeira.jpg",
  "images/pata-de-vaca.jpg",
  "images/peregum.jpg",
  "images/peregun-roxo.jpg",
  "images/pimenteira.jpg",
  "images/pinha.jpg",
  "images/pinhao-roxo.jpg",
  "images/pitangueira.jpg",
  "images/rosa-amarela.jpg",
  "images/rosa-branca.jpg",
  "images/rosa-champanhe.jpg",
  "images/rosa-cor-de-rosa.jpg",
  "images/rosa-vermelha.jpg",
  "images/saiao.jpg",
  "images/salsa.jpg",
  "images/salvia.jpg",
  "images/samambaia.jpg",
  "images/seriguela.jpg",
  "images/tomilho.jpg",
  "images/trevo-roxo.jpg",
  "images/vence-demanda.jpg",
  "images/zamioculca.jpg"
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
