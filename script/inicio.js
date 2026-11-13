/* Foco Vibracional • inicio.js
   Herói da página inicial, camada imersiva e a inicialização de todas as páginas.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Herói da página inicial: saudação, lua de hoje e contadores
   ========================================================================== */
function initHomeHero() {
  const greet = $("#heroGreeting");
  if (!greet) return;
  const now = new Date();
  const h = now.getHours();
  const saud = h < 5 ? "Boa madrugada" : h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const data = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  greet.textContent = `${saud} • ${data}`;

  const moon = getLiveMoonData(now);
  const name = $("#moonCardName");
  if (name) name.textContent = `${moon.icon} ${moon.name}`;
  const meta = $("#moonCardMeta");
  if (meta) meta.textContent = `${moon.illum}% iluminada • ${moon.age} dias de lua`;
  const tip = $("#moonCardTip");
  if (tip) tip.textContent = moon.orientacao || moon.intention || "";
  const shadow = $("#moonOrbShadow");
  if (shadow) {
    // crescente: luz à direita (sombra sai pela esquerda); minguante: o contrário
    shadow.style.transform = `translateX(${moonShadowShift(moon)}%)`;
  }
  const baths = $("#heroMoonBaths");
  if (baths) baths.href = `banhos.html?lua=${moon.key}`;

  const counts = { banhos: BANHOS.length, defumacoes: DEFUMACOES.length, ervas: ERVAS.length };
  $all("[data-count]").forEach(el => {
    const n = counts[el.dataset.count];
    if (n) el.textContent = String(n);
    else el.remove();
  });
}

/* ==========================================================================
   CAMADA IMERSIVA — aberturas de página, vaga-lumes, contadores, carrosséis,
   carta do dia na home e revelação ao rolar
   ========================================================================== */
const PAGE_HERO = {
  "banhos.html": { img: "images/camomila.jpg", fireflies: true },
  "defumacao.html": { img: "images/alecrim.jpg", fireflies: true },
  "plantas.html": { img: "images/manjericao.jpg", fireflies: true },
  "colheita.html": { img: "images/capim-limao.jpg", fireflies: true },
  "glossario.html": { img: "images/jurema-preta.jpg", fireflies: true },
  "mantras.html": { art: "candle" },
  "firmeza.html": { art: "candle" },
  "calendario.html": { art: "moon" },
  "portais.html": { art: "numbers" },
  "tarot.html": { art: "cards" },
  "pontos.html": { img: "images/jurema-preta.jpg", fireflies: true },
  "simbolos.html": { art: "geo" },
  "chas.html": { art: "steam" }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const GEO_SVG = `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width=".8">${
  [0, 60, 120, 180, 240, 300].map(a => {
    const r = a * Math.PI / 180;
    return `<circle cx="${(100 + 30 * Math.cos(r)).toFixed(2)}" cy="${(100 + 30 * Math.sin(r)).toFixed(2)}" r="30"/>`;
  }).join("")}<circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="92" stroke-dasharray="2 4"/><polygon points="100,8 180,146 20,146"/><polygon points="100,192 20,54 180,54"/></svg>`;

function heroArtHtml(kind) {
  if (kind === "moon") {
    // mesma sombra de fase usada no card da home
    const m = getLiveMoonData(new Date());
    const dx = moonShadowShift(m);
    return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-stars ph-stars--b"></div><div class="ph-stars ph-stars--c"></div><div class="ph-luar"></div><div class="ph-moon"><div class="ph-moon__shadow" style="transform:translateX(${dx}%)"></div></div></div>`;
  }
  if (kind === "candle") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars u-o-35"></div>${CANDLE_HTML}</div>`;
  if (kind === "numbers") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-numbers">11:11<span class="ph-numbers__brilho">11:11</span></div></div>`;
  if (kind === "geo") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars u-o-40"></div><div class="ph-geo"><div class="ph-geo__pulso"></div>${GEO_SVG}</div></div>`;
  if (kind === "cards") {
    const imgs = ["images/tarot/classico/classico-maior-17-estrela.jpg", "images/tarot/classico/classico-maior-19-sol.jpg", "images/tarot/classico/classico-maior-18-lua.jpg"];
    return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-luz-cartas"></div><div class="ph-cards">${imgs.map(s => `<img src="${s}" alt="" onerror="this.remove()">`).join("")}</div></div>`;
  }
  if (kind === "steam") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars u-o-35"></div><div class="ph-cha"><div class="ph-cha__luz"></div><div class="ph-cha__vapor"><i></i><i></i><i></i></div>${XICARA_SVG}</div></div>`;
  return "";
}

/* Xícara de porcelana com pires, asa, filete dourado e o chá com reflexo (spec 017) */
const XICARA_SVG = `<svg class="ph-cha__svg" viewBox="0 0 220 150" aria-hidden="true">
  <defs>
    <linearGradient id="xcPorc" x1="0" x2="1" y1="0" y2="0"><stop class="xc-p0" offset="0"/><stop class="xc-p1" offset=".38"/><stop class="xc-p2" offset=".62"/><stop class="xc-p3" offset="1"/></linearGradient>
    <radialGradient id="xcPires" cx=".5" cy=".35" r=".6"><stop class="xc-p1" offset="0"/><stop class="xc-p2" offset=".55"/><stop class="xc-p3" offset="1"/></radialGradient>
    <radialGradient id="xcCha" cx=".42" cy=".4" r=".7"><stop class="xc-c0" offset="0"/><stop class="xc-c1" offset=".55"/><stop class="xc-c2" offset="1"/></radialGradient>
  </defs>
  <ellipse class="xc-sombra" cx="110" cy="138" rx="96" ry="9"/>
  <ellipse fill="url(#xcPires)" cx="110" cy="130" rx="98" ry="15"/>
  <ellipse class="xc-pires-fundo" cx="110" cy="128" rx="54" ry="7.5"/>
  <path class="xc-asa" d="M156 62 C186 56 194 92 160 100" />
  <path class="xc-asa-brilho" d="M159 66 C181 63 186 88 161 95" />
  <path fill="url(#xcPorc)" d="M50 46 C50 92 74 124 110 124 C146 124 170 92 170 46 Z"/>
  <ellipse class="xc-pe" cx="110" cy="124" rx="26" ry="4.5"/>
  <path class="xc-filete" d="M53 58 C60 62 84 66 110 66 C136 66 160 62 167 58"/>
  <ellipse class="xc-borda" cx="110" cy="46" rx="60" ry="11"/>
  <ellipse fill="url(#xcCha)" cx="110" cy="47.5" rx="55" ry="8.6"/>
  <ellipse class="xc-reflexo" cx="92" cy="45.5" rx="17" ry="2.2"/>
  <path class="xc-brilho" d="M62 60 C64 84 74 102 88 112"/>
</svg>`;

/* Vela em camadas (spec 014) no castiçal, queimando com o relógio (spec 017):
   halo, castiçal (prato, haste, copo com a cera que escorreu), corpo em SVG (borda derretida
   e escorridos), fumaça, pavio e a chama (a segunda camada abre a ponta em duas) */
const FOGO_HTML = `<i class="ph-candle__borda"></i><i class="ph-candle__amarela"></i><i class="ph-candle__nucleo"></i>`;
const CANDLE_HTML = `<div class="ph-candle">
  <div class="ph-candle__halo"></div>
  <div class="ph-castical__prato"></div>
  <div class="ph-castical__haste"></div>
  <svg class="ph-candle__svg" aria-hidden="true"></svg>
  <div class="ph-castical__copo"><i class="ph-castical__poca"></i></div>
  <div class="ph-candle__fumaca"><i></i><i></i><i></i></div>
  <div class="ph-candle__pavio"></div>
  <div class="ph-candle__chama"><div class="ph-candle__fogo">${FOGO_HTML}</div><div class="ph-candle__fogo ph-candle__fogo--2">${FOGO_HTML}</div></div>
  <span class="ph-vela-legenda"></span>
</div>`;

function enhancePageHead() {
  const ph = $(".pagehead");
  const cfg = PAGE_HERO[currentPage()];
  if (!ph || !cfg) return;
  ph.classList.add("pagehead--hero");
  // avisos saem da abertura e ficam logo abaixo dela
  [...ph.querySelectorAll(":scope > .notice")].reverse().forEach(n => ph.after(n));
  if (cfg.art === "candle") ph.classList.add("pagehead--vela");
  const luz = (cfg.fireflies || cfg.smoke)
    ? `<div class="ph-art ph-art--luz" aria-hidden="true">${cfg.smoke ? `<div class="ph-fumaca"><i></i><i></i><i></i><i></i></div>` : ""}${cfg.fireflies ? `<canvas class="fireflies ph-fireflies"></canvas>` : ""}</div>`
    : "";
  ph.insertAdjacentHTML("afterbegin", (cfg.img
    ? `<div class="ph-media" aria-hidden="true"><img src="${cfg.img}" alt=""></div>`
    : heroArtHtml(cfg.art)) + luz);
}

/* Luz viva nas aberturas (spec 014): chama que responde ao ponteiro e ao toque,
   vaga-lumes nas aberturas com foto e pausa quando a abertura sai da tela */
function initHeroLuz() {
  const ph = $(".pagehead--hero");
  if (!ph || prefersReducedMotion()) return;
  new IntersectionObserver(([e]) => ph.classList.toggle("ph-pausado", !e.isIntersecting)).observe(ph);

  const ff = ph.querySelector(".ph-fireflies");
  if (ff) startFireflies(ff, { count: window.innerWidth < 700 ? 10 : 18, alpha: .75 });

  const vela = ph.querySelector(".ph-candle");
  const chama = vela?.querySelector(".ph-candle__chama");
  if (!chama) return;
  let raf = 0, alvo = 0, soproT = 0;
  ph.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = chama.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const d = Math.hypot(dx, e.clientY - (r.top + r.height / 2));
    const raio = 300;
    // a chama se inclina para longe do ponteiro, mais forte quanto mais perto
    alvo = d < raio ? -Math.sign(dx) * (1 - d / raio) * 16 : 0;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; vela.style.setProperty("--inclina", alvo.toFixed(1)); });
  });
  ph.addEventListener("pointerleave", () => vela.style.setProperty("--inclina", "0"));
  ph.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse") return;
    vela.classList.remove("ph-candle--sopro");
    void vela.offsetWidth; // reinicia a animação se tocar de novo
    vela.classList.add("ph-candle--sopro");
    clearTimeout(soproT);
    soproT = setTimeout(() => vela.classList.remove("ph-candle--sopro"), 900);
  });
}

/* ==========================================================================
   Spec 017: efeitos vivos. A vela queima com o relógio, as cartas embaralham,
   a defumação solta fumaça pela página e o banho respinga na tela.
   ========================================================================== */
const VELA_CICLO = 4 * 3600e3; // vela palito nº 8: de 4 a 5 horas; uma vela nova a cada 4 h (0h, 4h, 8h, 12h, 16h, 20h)

function velaHash(n) {
  n = (n ^ 0x9e3779b9) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 0x85ebca6b) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/* Estado da vela num instante: altura, jeito da chama e cera escorrida.
   Tudo sai do relógio, então todo mundo vê a mesma vela na mesma hora. */
function velaEstado(date = new Date()) {
  const meiaNoite = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const porDia = Math.round(864e5 / VELA_CICLO);
  const idx = Math.min(porDia - 1, Math.floor((date.getTime() - meiaNoite) / VELA_CICLO));
  const inicio = meiaNoite + idx * VELA_CICLO;
  const ms = date.getTime() - inicio;
  const p = ms / VELA_CICLO;
  const resta = VELA_CICLO - ms;
  const ciclo = ((date.getFullYear() * 13 + date.getMonth()) * 32 + date.getDate()) * porDia + idx;

  let modo;
  if (resta < 2 * 60e3) modo = "apagada";
  else if (ms < 50e3) modo = "acendendo";
  else if (resta < 10 * 60e3) modo = "baixa";
  else {
    const r = velaHash(Math.floor(date.getTime() / 90e3)); // muda de jeito a cada minuto e meio
    modo = r < .34 ? "calma" : r < .5 ? "alta" : r < .64 ? "sobe" : r < .78 ? "vento" : r < .92 ? "bifurcada" : "baixa";
  }

  // de 6 a 8 escorridos por vela, cada um numa hora; antes dela a vela fica lisa,
  // depois a cera desce em poucos minutos, endurece e fica até a vela acabar
  const min = ms / 60e3;
  const total = 6 + Math.floor(velaHash(ciclo * 3) * 3);
  const escorridos = Array.from({ length: total }, (_, i) => {
    const h = k => velaHash(ciclo * 41 + i * 7 + k);
    const pIni = .03 + (i + h(1) * .8) / total * .86; // espalhados ao longo da queima
    const desde = min - pIni * VELA_CICLO / 60e3;
    const borda = h(2) < .5;
    return {
      pIni,
      borda,
      lado: h(3) < .5 ? -1 : 1,
      pos: h(4),
      w: 3.8 + h(5) * 3.8,
      lmax: 30 + Math.pow(h(6), 1.2) * 120,
      calombo: .3 + h(7) * .4,
      torto: (h(8) - .5) * 2.4,
      desde,
      frac: desde <= 0 ? 0 : 1 - Math.exp(-desde / 6)
    };
  });
  const escorrendo = escorridos.some(e => e.desde > 0 && e.desde < 10);
  return { p, h: 1 - .86 * p, ms, ciclo, inicio: new Date(inicio), fim: new Date(inicio + VELA_CICLO), modo, escorridos, escorrendo };
}

const VELA_MODOS = ["calma", "alta", "sobe", "vento", "bifurcada", "baixa", "apagada", "acendendo"];

/* Desenha o corpo da vela: a borda derretida (lábios nas beiradas, poça no meio),
   os escorridos com calombo e gota endurecida, e a cera que juntou no pé */
function velaSvg(svg, e) {
  const Hs = Math.round(svg.clientHeight); // altura de layout (não muda com o scale do celular)
  if (!Hs) return;
  const f = n => n.toFixed(1);
  const W = 90, cx = 45, cw = 30, L = cx - cw / 2, R = cx + cw / 2;
  const yTop = Hs * (1 - e.h);
  const r = k => velaHash(e.ciclo * 31 + k);
  const lipL = 4 + r(1) * 7, lipR = 3 + r(2) * 8;
  const rim = [[L, yTop - lipL * .5], [L + 3, yTop - lipL], [L + 8, yTop + r(3) * 2.5], [cx, yTop + 3.2], [R - 8, yTop + r(4) * 2.5], [R - 3, yTop - lipR], [R, yTop - lipR * .45]];
  const suave = pts => {
    let d = "";
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
    }
    return d;
  };
  const bola = (x, y, rr) => ` M${f(x - rr)},${f(y)} a${f(rr)},${f(rr)} 0 1 0 ${f(2 * rr)},0 a${f(rr)},${f(rr)} 0 1 0 ${f(-2 * rr)},0`;
  // tudo desenhado no mesmo sentido (anti-horário), para a cera somar e não vazar
  const aoContrario = rim.slice().reverse();
  const corpo = `M${R},${Hs} L${f(aoContrario[0][0])},${f(aoContrario[0][1])}${suave(aoContrario)} L${L},${Hs} Z`;
  let cera = "";
  let brilho = "", reflexo = "";
  let noPe = 0;
  for (const d of e.escorridos) {
    if (d.frac <= 0) continue;
    const yIni = Hs * .86 * d.pIni;             // onde estava o topo quando a cera desceu
    const y0 = Math.max(yIni, yTop - 1.5);      // o que ficava acima do topo atual já queimou
    const y1 = Math.min(Hs - 2, yIni + d.lmax * d.frac);
    if (y1 - y0 < 4) continue;
    const w = d.w;
    const x = d.borda ? (d.lado < 0 ? L + 1.2 : R - 1.2) : L + 6 + d.pos * (cw - 12);
    const t = d.torto, m = (y0 + y1) / 2;
    cera += ` M${f(x - w / 2)},${f(y0)} C${f(x - w / 2 + t)},${f(m)} ${f(x - w * .42)},${f(y1 - w * .6)} ${f(x - w * .42)},${f(y1 - w * .2)}`
      + ` A${f(w * .62)},${f(w * .62)} 0 1 0 ${f(x + w * .42)},${f(y1 - w * .2)}`
      + ` C${f(x + w * .42)},${f(y1 - w * .6)} ${f(x + w / 2 + t)},${f(m)} ${f(x + w / 2)},${f(y0)} Z`;
    if (y0 <= yTop) cera += bola(x, yTop + 1, w * .8);               // a cera saindo pela borda
    if (y1 - y0 > 22) cera += bola(x + t * .5, y0 + (y1 - y0) * d.calombo, w * .6); // calombo no caminho
    brilho += ` M${f(x - w * .2)},${f(y0 + 2)} L${f(x - w * .2 + t * .3)},${f(y1 - w * .5)}`;
    reflexo += bola(x - w * .2, y1 - w * .05, w * .14);
    if (y1 >= Hs - 2.5) noPe += w;
  }
  const pe = Math.min(1, noPe / 14);
  const molhado = e.escorrendo && e.modo !== "apagada";
  svg.setAttribute("viewBox", `0 0 ${W} ${Hs}`);
  svg.innerHTML = `<defs>
    <linearGradient id="vcCera" gradientUnits="userSpaceOnUse" x1="${L - 7}" y1="0" x2="${R + 7}" y2="0">
      <stop class="vc-s0" offset="0"/><stop class="vc-s1" offset=".28"/><stop class="vc-s2" offset=".5"/><stop class="vc-s3" offset=".78"/><stop class="vc-s4" offset="1"/>
    </linearGradient>
    <linearGradient id="vcLuz" gradientUnits="userSpaceOnUse" x1="0" y1="${f(yTop - 8)}" x2="0" y2="${f(yTop + 64)}">
      <stop class="vc-l0" offset="0"/><stop class="vc-l1" offset=".3"/><stop class="vc-l2" offset="1"/>
    </linearGradient>
  </defs>
  ${pe > 0 ? `<ellipse class="vc-cera" cx="${cx}" cy="${Hs - 1}" rx="${f(cw / 2 + 2 + pe * 14)}" ry="${f(2.2 + pe * 2.6)}"/>` : ""}
  <path class="vc-cera" d="${corpo}"/>
  ${cera ? `<path class="vc-cera vc-gotas" d="${cera}"/>` : ""}
  <path class="vc-luz" d="${corpo}${cera}"/>
  <ellipse class="vc-poca" cx="${cx}" cy="${f(yTop + 1.6)}" rx="9.5" ry="2.3"/>
  <path class="vc-brilho${molhado ? " vc-brilho--molhado" : ""}" d="${brilho}"/>
  <path class="vc-reflexo" d="${reflexo}"/>`;
}

function aplicarVela(vela, date = new Date()) {
  const e = velaEstado(date);
  VELA_MODOS.forEach(m => vela.classList.toggle(`ph-vela--${m}`, m === e.modo));
  vela.style.setProperty("--h", e.h.toFixed(4));
  const svg = vela.querySelector(".ph-candle__svg");
  if (svg) velaSvg(svg, e);
  const leg = vela.querySelector(".ph-vela-legenda");
  if (leg) {
    const hh = d => `${d.getHours()}h`;
    const q = Math.floor(e.ms / 60e3);
    leg.textContent = e.modo === "apagada"
      ? `A vela terminou. Outra acende às ${hh(e.fim)}.`
      : e.modo === "acendendo"
        ? `Vela nova acesa às ${hh(e.inicio)}.`
        : `Acesa às ${hh(e.inicio)} · ${Math.floor(q / 60)}h${String(q % 60).padStart(2, "0")} de 4h`;
  }
  return e;
}

function initVelaRelogio() {
  const vela = $(".pagehead .ph-candle");
  if (!vela) return;
  aplicarVela(vela);
  setInterval(() => { if (!document.hidden) aplicarVela(vela); }, 15000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) aplicarVela(vela); });
  let rz = 0;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => aplicarVela(vela), 200); });
}

/* Tarot: as três cartas da abertura se embaralham e trocam de rosto */
function embaralharCartasHero() {
  const box = $(".pagehead .ph-cards");
  if (!box || prefersReducedMotion() || box.classList.contains("ph-cards--embaralha")) return;
  box.classList.add("ph-cards--embaralha");
  const deck = ((window.FV_DATA && window.FV_DATA.tarot) || []).filter(c => c.baralho === "classico" && c.imagem);
  setTimeout(() => { // no meio do embaralho, quando as cartas se cruzam
    if (deck.length >= 3) {
      const pick = [...deck].sort(() => Math.random() - .5).slice(0, 3);
      box.querySelectorAll("img").forEach((img, i) => { img.src = pick[i].imagem; });
    }
  }, 520);
  setTimeout(() => box.classList.remove("ph-cards--embaralha"), 1150);
}

/* Banho: respingos de água na tela, como na hora do preparo */
function respingarTela(n = 26) {
  if (prefersReducedMotion()) return;
  const cv = document.createElement("canvas");
  cv.className = "respingos";
  cv.setAttribute("aria-hidden", "true");
  document.body.append(cv);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = innerWidth, h = innerHeight;
  cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const escala = Math.min(1.2, Math.max(.7, w / 1100));
  const gotas = Array.from({ length: n }, () => {
    const r = (2.5 + Math.random() ** 2 * 10) * escala;
    return { x: Math.random() * w, y: Math.random() * h * .85, r, t0: Math.random() * 450, desce: r > 6 && Math.random() < .55, v: 0, rastro: [] };
  });
  // gotinhas de borda em volta das maiores, como num esguicho
  gotas.slice(0, 8).forEach(g => {
    for (let k = 0; k < 3; k++) gotas.push({ x: g.x + (Math.random() - .5) * g.r * 7, y: g.y + (Math.random() - .5) * g.r * 7, r: 1 + Math.random() * 1.6, t0: g.t0 + 40, desce: false, v: 0, rastro: [] });
  });
  const DUR = 3400, t0 = performance.now();
  function gota(x, y, r, sy, a) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(x, y); ctx.scale(1, sy);
    const g = ctx.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r);
    g.addColorStop(0, "rgba(255,255,255,.30)");
    g.addColorStop(.55, "rgba(190,225,235,.06)");
    g.addColorStop(.9, "rgba(255,255,255,.18)");
    g.addColorStop(1, "rgba(255,255,255,.32)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.22)"; ctx.lineWidth = Math.max(.6, r * .14);
    ctx.beginPath(); ctx.arc(0, 0, r * .92, Math.PI * .15, Math.PI * .85); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .22, r * .14, -.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function frame(t) {
    const dt = t - t0;
    ctx.clearRect(0, 0, w, h);
    const fade = dt < DUR - 900 ? 1 : Math.max(0, (DUR - dt) / 900);
    for (const g of gotas) {
      const k = (dt - g.t0) / 120;
      if (k <= 0) continue;
      const nasce = Math.min(1, k);
      if (g.desce && dt > g.t0 + 600) {
        g.v = Math.min(5, g.v + .045);
        g.y += g.v;
        if (Math.random() < .25) g.rastro.push({ x: g.x + (Math.random() - .5) * 1.5, y: g.y - g.r, r: g.r * (.18 + Math.random() * .2) });
        g.x += (Math.random() - .5) * .6;
      }
      for (const p of g.rastro) gota(p.x, p.y, p.r, 1, fade * .9);
      gota(g.x, g.y, g.r * nasce, g.desce && g.v > 0 ? 1.18 : 1, fade);
    }
    if (dt < DUR) requestAnimationFrame(frame); else cv.remove();
  }
  requestAnimationFrame(frame);
}

/* Defumação: uma neblina em fios passa devagar sobre a página */
function initNeblina() {
  if (prefersReducedMotion()) return;
  const n = document.createElement("div");
  n.className = "neblina";
  n.setAttribute("aria-hidden", "true");
  n.innerHTML = "<i class=\"neblina__a\"></i><i class=\"neblina__b\"></i>";
  document.body.append(n);
}

function initEfeitosVivos() {
  initVelaRelogio();
  const pg = currentPage();
  const ph = $(".pagehead--hero");
  if (pg === "tarot.html" && ph) {
    ph.addEventListener("click", e => { if (!e.target.closest("a, button, input, select, textarea")) embaralharCartasHero(); });
  }
  if (pg === "banhos.html") {
    document.addEventListener("fv:ficha", () => respingarTela());
    ph?.addEventListener("click", e => { if (!e.target.closest("a, button, input, select, textarea")) respingarTela(14); });
  }
  if (pg === "defumacao.html") initNeblina();
}

/* Vaga-lumes no herói da home (canvas leve; pausa fora da tela) */
function initFireflies() {
  const canvas = $("#fireflies");
  if (!canvas || prefersReducedMotion()) return;
  startFireflies(canvas, { count: window.innerWidth < 700 ? 22 : 42 });
}

function startFireflies(canvas, { count, alpha = 1 }) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, running = true, raf = 0;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const flies = Array.from({ length: count }, () => ({
    x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 1.8,
    vx: (Math.random() - .5) * .00035, vy: (Math.random() - .5) * .00035,
    p: Math.random() * Math.PI * 2, s: .6 + Math.random() * 1.4
  }));
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const f of flies) {
      f.x += f.vx + Math.sin(t / 3000 + f.p) * .00012;
      f.y += f.vy + Math.cos(t / 3500 + f.p) * .00012;
      if (f.x < -.02) f.x = 1.02; if (f.x > 1.02) f.x = -.02;
      if (f.y < -.02) f.y = 1.02; if (f.y > 1.02) f.y = -.02;
      const a = alpha * (.25 + .75 * Math.max(0, Math.sin(t / (900 / f.s) + f.p)));
      const x = f.x * w, y = f.y * h;
      const g = ctx.createRadialGradient(x, y, 0, x, y, f.r * 7);
      g.addColorStop(0, `rgba(255,226,140,${a})`);
      g.addColorStop(1, "rgba(255,200,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, f.r * 7, 0, Math.PI * 2); ctx.fill();
    }
    if (running) raf = requestAnimationFrame(frame);
  }
  resize();
  window.addEventListener("resize", resize);
  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (running) raf = requestAnimationFrame(frame);
  }).observe(canvas);
}

/* Contadores que sobem quando aparecem na tela */
function initCountUp() {
  const els = $all("[data-countup]");
  if (!els.length) return;
  const totals = {
    banhos: BANHOS.length, ervas: ERVAS.length, defumacoes: DEFUMACOES.length,
    tarot: ((window.FV_DATA && window.FV_DATA.tarot) || []).length
  };
  const run = el => {
    const target = totals[el.dataset.countup] || 0;
    const t0 = performance.now(), dur = 1300;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }), { threshold: .4 });
  els.forEach(el => io.observe(el));
}

/* Carrossel "Banhos para a lua de hoje" e carta do dia (home) */
function initHomeRails() {
  const rail = $("#moonRail");
  if (rail) {
    const moon = getLiveMoonData(new Date());
    const list = BANHOS.filter(b => isSuggestible(b) && (b.luas || []).includes(moon.key));
    const start = dailyIndexByDate(new Date(), Math.max(1, list.length));
    const pick = list.slice(start).concat(list.slice(0, start)).slice(0, 12);
    rail.innerHTML = pick.map(b => ritualCardHtml("banho", b)).join("");
    rail.addEventListener("click", e => {
      const c = e.target.closest("[data-open]");
      if (c) location.href = `banhos.html#${encodeURIComponent(c.dataset.open)}`;
    });
    const title = $("#moonRailTitle");
    if (title) title.textContent = `Banhos para a ${moon.name}`;
    const all = $("#moonRailAll");
    if (all) all.href = `banhos.html?lua=${moon.key}`;
    initRailsNavigation();
  }

  const feat = $("#homeCard");
  const deck = (window.FV_DATA && window.FV_DATA.tarot) || [];
  if (feat && deck.length) {
    const classico = deck.filter(c => c.baralho === "classico");
    const c = classico[dailyCardIndex(new Date(), classico.length)];
    feat.href = `tarot.html#${encodeURIComponent(c.id)}`;
    feat.innerHTML = `
      <div class="feature__card">${c.imagem ? `<img src="${escapeHtml(c.imagem)}" alt="${escapeHtml(c.nome)}" loading="lazy">` : ""}</div>
      <div>
        <span class="eyebrow">Carta do dia • Tarot</span>
        <h3>${escapeHtml(c.nome)}</h3>
        <p>${escapeHtml(c.significado || "")}</p>
        <span class="btn btn--ghost">Ver o significado completo →</span>
      </div>`;
  }
}

/* Carrosséis nas páginas de rituais (Ervas na cabeça e Defumações de Limpeza/Atração) */
function initRitualRails() {
  const headRail = $("#headHerbsRail");
  if (headRail && ERVAS.length) {
    const list = ERVAS.filter(e => herbCabeca(e) === "yes" && e.imagem);
    const finalHerbs = list.length >= 6 ? list : ERVAS.filter(e => herbCabeca(e) === "yes");
    headRail.innerHTML = finalHerbs.slice(0, 14).map(herbCardHtml).join("");
    headRail.addEventListener("click", e => {
      const c = e.target.closest("[data-open]");
      if (c) {
        location.hash = `#${encodeURIComponent(c.dataset.open)}`;
        if (typeof focusCatalogItemFromHash === "function") focusCatalogItemFromHash();
      }
    });
  }

  const defLimpRail = $("#defumacaoLimpezaRail");
  if (defLimpRail && DEFUMACOES.length) {
    const list = DEFUMACOES.filter(d => d.objetivo === "limpeza" || d.objetivo === "protecao");
    defLimpRail.innerHTML = list.slice(0, 12).map(d => ritualCardHtml("defumacao", d)).join("");
    defLimpRail.addEventListener("click", e => {
      const c = e.target.closest("[data-open]");
      if (c) {
        location.hash = `#${encodeURIComponent(c.dataset.open)}`;
        if (typeof focusCatalogItemFromHash === "function") focusCatalogItemFromHash();
      }
    });
  }

  const defAtraRail = $("#defumacaoAtracaoRail");
  if (defAtraRail && DEFUMACOES.length) {
    const list = DEFUMACOES.filter(d => d.objetivo === "prosperidade" || d.objetivo === "harmonizacao" || d.objetivo === "calma");
    defAtraRail.innerHTML = list.slice(0, 12).map(d => ritualCardHtml("defumacao", d)).join("");
    defAtraRail.addEventListener("click", e => {
      const c = e.target.closest("[data-open]");
      if (c) {
        location.hash = `#${encodeURIComponent(c.dataset.open)}`;
        if (typeof focusCatalogItemFromHash === "function") focusCatalogItemFromHash();
      }
    });
  }
  initRailsNavigation();
}

/* Navegação, scroll com a roda do mouse e estado dos botões dos carrosséis (.rail) */
function initRailsNavigation() {
  const rails = $all(".rail");
  if (!rails.length) return;

  rails.forEach(rail => {
    // 1. Suporte a rolagem com o scroll do mouse (vertical -> horizontal no carrossel)
    if (!rail.dataset.hasWheel) {
      rail.dataset.hasWheel = "true";
      rail.addEventListener("wheel", e => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // rolagem horizontal nativa
        if (rail.scrollWidth > rail.clientWidth) {
          const canRight = e.deltaY > 0 && rail.scrollLeft < (rail.scrollWidth - rail.clientWidth - 2);
          const canLeft = e.deltaY < 0 && rail.scrollLeft > 2;
          if (canRight || canLeft) {
            e.preventDefault();
            rail.scrollBy({ left: e.deltaY * 1.6, behavior: "auto" });
          }
        }
      }, { passive: false });
    }

    // 2. Atualizar estado dos botões prev / next vinculados
    const id = rail.id;
    if (!id) return;
    const prevBtn = $(`[data-rail-prev="#${id}"]`);
    const nextBtn = $(`[data-rail-next="#${id}"]`);

    function updateNavState() {
      if (!prevBtn && !nextBtn) return;
      const atStart = rail.scrollLeft <= 6;
      const atEnd = rail.scrollLeft >= (rail.scrollWidth - rail.clientWidth - 6);
      if (prevBtn) prevBtn.disabled = atStart;
      if (nextBtn) nextBtn.disabled = atEnd;
    }

    if (!rail.dataset.hasScrollNav) {
      rail.dataset.hasScrollNav = "true";
      rail.addEventListener("scroll", updateNavState, { passive: true });
    }
    updateNavState();
    setTimeout(updateNavState, 150);
  });
}

// Delegação de cliques nos botões de navegação dos trilhos
if (!window._railNavDelegated) {
  window._railNavDelegated = true;
  document.addEventListener("click", e => {
    const prev = e.target.closest("[data-rail-prev]");
    if (prev) {
      const target = $(prev.dataset.railPrev);
      if (target) {
        const step = Math.min(680, Math.max(280, target.clientWidth * 0.82));
        target.scrollBy({ left: -step, behavior: "smooth" });
      }
      return;
    }
    const next = e.target.closest("[data-rail-next]");
    if (next) {
      const target = $(next.dataset.railNext);
      if (target) {
        const step = Math.min(680, Math.max(280, target.clientWidth * 0.82));
        target.scrollBy({ left: step, behavior: "smooth" });
      }
      return;
    }
  });
}

/* Revelação suave ao rolar (só elementos estáticos; catálogos têm animação própria) */
function initReveal() {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = $all(".home-section, .stats-band, .card:not(.cat .card), .fund, .tiles > *, .ponto-firmeza-card, .runa-card");
  if (!targets.length) return;
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: .06 });
  targets.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) return; // já visível: não esconde
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });
}

/* Topo transparente sobre o herói da home */
function initHomeTopbar() {
  if (!$(".home-hero")) return;
  document.body.classList.add("is-home");
  const onScroll = () => document.body.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================
   Trilha "Comece aqui" (comece.html): progresso guardado só no aparelho
========================= */
const TRILHA_KEY = "foco.trilha.v1";

function initTrilha() {
  const trail = $("#trail");
  if (!trail) return;
  const steps = [...trail.querySelectorAll(".trail-step")];
  const count = $("#trailCount");
  const bar = $("#trailBar");

  let done = [];
  try { done = JSON.parse(localStorage.getItem(TRILHA_KEY) || "[]"); } catch { done = []; }
  if (!Array.isArray(done)) done = [];

  const save = () => { try { localStorage.setItem(TRILHA_KEY, JSON.stringify(done)); } catch { /* janela anônima: segue sem guardar */ } };

  const render = () => {
    steps.forEach(step => {
      const on = done.includes(step.dataset.step);
      const btn = step.querySelector(".trail-step__done");
      step.classList.toggle("trail-step--done", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "Feito ✓" : "Marcar como feito";
    });
    const n = steps.filter(s => done.includes(s.dataset.step)).length;
    if (count) count.innerHTML = `<b>${n}</b> de ${steps.length} passos feitos`;
    if (bar) bar.style.width = `${Math.round((n / steps.length) * 100)}%`;
  };

  trail.addEventListener("click", e => {
    const btn = e.target.closest(".trail-step__done");
    if (!btn) return;
    const id = btn.closest(".trail-step").dataset.step;
    done = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    save();
    render();
  });

  $("#trailReset")?.addEventListener("click", () => {
    done = [];
    save();
    render();
  });

  render();
}

/* Link com #id de um <details> (ex.: glossario.html#dois-tempos) abre o item e rola até ele */
function initHashDetails() {
  const open = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el || el.tagName !== "DETAILS") return;
    el.open = true;
    el.scrollIntoView({ block: "start" });
  };
  open();
  window.addEventListener("hashchange", open);
}

document.addEventListener("DOMContentLoaded", async () => {
  // Renderizar Cabeçalho e Rodapé únicos
  renderHeader();
  renderFooter();
  enhancePageHead();
  initHeroLuz();
  initEfeitosVivos();
  initHomeTopbar();
  initGlobalSearch();

  // Ações globais (cliques, atalhos, modo iniciante/avançado)
  initModeToggle();
  initCopySpeak();

  // Recursos do Index
  wireClock();
  wireFocusMode();
  initHomeGrabovoi();

  // Carregar dados com proteção offline
  await Promise.all([
    loadMantras(),
    loadErvas(),
    loadBanhos(),
    loadDefumacoes(),
    loadChas(),
    loadPontos()
  ]);

  // Inicializar páginas específicas se seus elementos existirem
  setDailyMantra();
  initPageTabs();
  wireTabs();
  renderFavorites();
  renderAllMantras("");
  renderAfirmacoesPorTema();
  wireSearch();

  // Módulos com novos seletores
  initPlantasPage();
  initTarotPage();
  initPontosPage();
  initBanhosPage();
  initDefumacaoPage();
  initChasPage();
  initColheitaPage();
  initCalendarioLunar();
  initCadernoFirmeza();
  initFirmezaPage();
  initPortaisPage();
  initAgendaIcs();
  initSimbolosPage();
  initHomeHero();
  initHomeRails();
  initRitualRails();
  initRailsNavigation();
  initCountUp();
  initFireflies();
  initHojePage();
  initOraculo();
  initTrilha();
  initContas();
  initLivros();
  initNuvem();
  initPageToc();
  initHashDetails();
  // após renderizar tudo, para medir a altura real da página
  initBackToTop();
  initReveal();
});

/* Pré-carrega a página de um link quando o dedo ou o mouse para sobre ele (Chrome/Edge; nos demais, nada muda) */
if (HTMLScriptElement.supports?.("speculationrules")) {
  const rules = document.createElement("script");
  rules.type = "speculationrules";
  rules.textContent = JSON.stringify({ prefetch: [{ where: { href_matches: "*.html" }, eagerness: "moderate" }] });
  document.head.appendChild(rules);
}

/* PWA: registra o service worker (só funciona em http/https, não em file://) */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
