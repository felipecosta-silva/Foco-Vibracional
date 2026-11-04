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
  "banhos.html": { img: "images/camomila.jpg" },
  "defumacao.html": { img: "images/alecrim.jpg" },
  "plantas.html": { img: "images/manjericao.jpg" },
  "colheita.html": { img: "images/capim-limao.jpg" },
  "glossario.html": { img: "images/jurema-preta.jpg" },
  "mantras.html": { art: "candle" },
  "firmeza.html": { art: "candle" },
  "calendario.html": { art: "moon" },
  "portais.html": { art: "numbers" },
  "tarot.html": { art: "cards" },
  "pontos.html": { img: "images/jurema-preta.jpg" },
  "simbolos.html": { art: "geo" }
};

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
    return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-moon"><div class="ph-moon__shadow" style="transform:translateX(${dx}%)"></div></div></div>`;
  }
  if (kind === "candle") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars u-o-35"></div><div class="ph-candle"></div></div>`;
  if (kind === "numbers") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-numbers">11:11</div></div>`;
  if (kind === "geo") return `<div class="ph-art" aria-hidden="true"><div class="ph-stars u-o-40"></div><div class="ph-geo">${GEO_SVG}</div></div>`;
  if (kind === "cards") {
    const imgs = ["images/tarot/classico/classico-maior-17-estrela.jpg", "images/tarot/classico/classico-maior-19-sol.jpg", "images/tarot/classico/classico-maior-18-lua.jpg"];
    return `<div class="ph-art" aria-hidden="true"><div class="ph-stars"></div><div class="ph-cards">${imgs.map(s => `<img src="${s}" alt="" onerror="this.remove()">`).join("")}</div></div>`;
  }
  return "";
}

function enhancePageHead() {
  const ph = $(".pagehead");
  const cfg = PAGE_HERO[currentPage()];
  if (!ph || !cfg) return;
  ph.classList.add("pagehead--hero");
  // avisos saem da abertura e ficam logo abaixo dela
  [...ph.querySelectorAll(":scope > .notice")].reverse().forEach(n => ph.after(n));
  ph.insertAdjacentHTML("afterbegin", cfg.img
    ? `<div class="ph-media" aria-hidden="true"><img src="${cfg.img}" alt=""></div>`
    : heroArtHtml(cfg.art));
}

/* Vaga-lumes no herói da home (canvas leve; pausa fora da tela) */
function initFireflies() {
  const canvas = $("#fireflies");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, running = true, raf = 0;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const flies = Array.from({ length: window.innerWidth < 700 ? 22 : 42 }, () => ({
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
      const a = .25 + .75 * Math.max(0, Math.sin(t / (900 / f.s) + f.p));
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
    const c = classico[dailyIndexByDate(new Date(), classico.length)];
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
    loadPontos()
  ]);

  // Inicializar páginas específicas se seus elementos existirem
  setDailyMantra();
  initPageTabs();
  wireTabs();
  renderFavorites();
  renderAllMantras("");
  wireSearch();

  // Módulos com novos seletores
  initPlantasPage();
  initTarotPage();
  initPontosPage();
  initBanhosPage();
  initDefumacaoPage();
  initColheitaPage();
  initCalendarioLunar();
  initCadernoFirmeza();
  initFirmezaPage();
  initPortaisPage();
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
