/* ==========================================================================
   FOCO VIBRACIONAL & JUREMA SAGRADA • MOTOR JAVASCRIPT
   Compartilhamento gratuito de fundamentos, vibração, banhos e sabedoria vegetal.
   Desenvolvido com respeito às matas, aos encantados e aos mestres da tradição.
   ========================================================================== */

/* =========================
   Armazenamento Local & Chaves Globais
========================= */
const FAVORITES_KEY = "focoVibracional.favorites.v1";
const MODE_KEY = "foco.mode.v1";

/* =========================
   Bases de Dados em Memória (alimentadas por window.FV_DATA)
========================= */
let DAILY_MANTRAS = [];
let ERVAS = [];
let BANHOS = [];
let DEFUMACOES = [];

const ICONS = {
  hoje: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M19 12h2M17 7l1.4-1.4"/><path d="M7 16a5 5 0 0 1 10 0"/><path d="M3 20h18"/></svg>',
  rituais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-10-1 12-5 16-9 17z"/><path d="M4 21c3-5 6-8 10-10"/></svg>',
  mantras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  lua: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  saberes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7M8 11h5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-10-1 12-5 16-9 17z"/><path d="M4 21c3-5 6-8 10-10"/></svg>'
};

/* ==========================================================================
   Arquitetura de Navegação (fonte única): 5 seções; cada seção pode ter subpáginas
   ========================================================================== */
const NAV = [
  { id: "hoje", label: "Hoje", url: "index.html" },
  {
    id: "rituais", label: "Rituais", url: "banhos.html",
    children: [
      { label: "Banhos", url: "banhos.html" },
      { label: "Defumações", url: "defumacao.html" },
      { label: "Ervas", url: "plantas.html" },
      { label: "Colheita", url: "colheita.html" },
      { label: "Firmeza de Vela", url: "firmeza.html" }
    ]
  },
  { id: "mantras", label: "Mantras", url: "mantras.html" },
  {
    id: "lua", label: "Lua", url: "calendario.html",
    children: [
      { label: "Calendário Lunar", url: "calendario.html" },
      { label: "Portais & Números", url: "portais.html" }
    ]
  },
  {
    id: "saberes", label: "Saberes", url: "simbolos.html",
    children: [
      { label: "Tarot & Cigano", url: "tarot.html" },
      { label: "Símbolos & Runas", url: "simbolos.html" },
      { label: "Glossário", url: "glossario.html" }
    ]
  }
];

function currentPage() {
  return (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
}

function currentSection() {
  const page = currentPage();
  return NAV.find(s => s.url === page || (s.children || []).some(c => c.url === page)) || NAV[0];
}

function renderHeader() {
  const container = document.getElementById("site-header");
  if (!container) return;

  const page = currentPage();
  const section = currentSection();
  const links = NAV.map(s => `
          <a class="nav__link ${s === section ? "nav__link--active" : ""}" href="${s.url}" ${s === section ? 'aria-current="page"' : ""}>${ICONS[s.id]}${s.label}</a>`).join("");
  const bottom = NAV.map(s => `
      <a class="bottomnav__item ${s === section ? "bottomnav__item--active" : ""}" href="${s.url}" ${s === section ? 'aria-current="page"' : ""}>${ICONS[s.id]}<span>${s.label}</span></a>`).join("");
  const sub = section.children ? `
    <nav class="subnav" aria-label="${section.label}">
      <div class="wrap subnav__inner">
        ${section.children.map(c => `<a class="subnav__link ${c.url === page ? "subnav__link--active" : ""}" href="${c.url}" ${c.url === page ? 'aria-current="page"' : ""}>${c.label}</a>`).join("")}
      </div>
    </nav>` : "";

  container.innerHTML = `
    <header class="topbar">
      <div class="wrap topbar__inner">
        <a class="brand" href="index.html" aria-label="Foco Vibracional — início">
          <img class="brand__logo" src="icons/icon.svg" alt="" width="30" height="30" />
          <span>Foco Vibracional</span>
        </a>
        <nav class="nav" aria-label="Principal">${links}
        </nav>
        <button class="search-trigger" type="button" id="globalSearchBtn" aria-label="Buscar no site (atalho /)">
          ${ICONS.search}<span>Buscar folha, banho…</span><kbd>/</kbd>
        </button>
      </div>
    </header>
    ${sub}
    <nav class="bottomnav" aria-label="Principal">${bottom}
    </nav>
  `;

  // Rola o link ativo do alternador para a vista no celular
  container.querySelector(".subnav__link--active")?.scrollIntoView({ block: "nearest", inline: "center" });
}

function renderFooter() {
  const container = document.getElementById("site-footer");
  if (!container) return;

  const cols = NAV.filter(s => s.children).map(s => `
          <div class="site-footer__col">
            <span class="site-footer__heading">${s.label}</span>
            ${s.children.map(c => `<a href="${c.url}">${c.label}</a>`).join("")}
          </div>`).join("");

  container.innerHTML = `
    <footer class="site-footer">
      <div class="wrap site-footer__inner">
        <div class="site-footer__brand">
          <div class="site-footer__title">
            <img class="brand__logo" src="icons/icon.svg" alt="" width="26" height="26" />
            <strong>Foco Vibracional</strong>
          </div>
          <p class="site-footer__blessing">
            "Salve a Jurema Sagrada, salve os Mestres e Mestras das Matas e das Cidades. Que a sabedoria vegetal traga paz, firmeza e bons caminhos ao seu caminhar."
          </p>
        </div>
        <div class="site-footer__links">${cols}
          <div class="site-footer__col">
            <span class="site-footer__heading">Mantras</span>
            <a href="mantras.html#mantras">Mantras</a>
            <a href="mantras.html#afirmacoes">Afirmações</a>
            <a href="mantras.html#noite">Ritual da Noite</a>
          </div>
        </div>
      </div>
      <div class="wrap site-footer__bottom">
        <small class="muted site-footer__copy">
          Guia gratuito e educativo. Não substitui orientação médica ou psicológica. • Salve a Jurema Sagrada
        </small>
      </div>
    </footer>
  `;
}

/* ==========================================================================
   Normalização Fonética e Tolerante de Termos Sagrados e Ervas
   Garante busca sem acento e tolera variações comuns:
   "samanbaia" -> "samambaia", "blilhantina" -> "brilhantina", "hortelam" -> "hortela", etc.
   ========================================================================== */
function normalizeSpiritualSearch(str) {
  if (!str) return "";
  let s = String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentuação (á, ã, é, í, ó, ç etc.)
    .replace(/ç/g, "c")
    .replace(/nb/g, "mb")            // samanbaia -> samambaia
    .replace(/np/g, "mp")
    .replace(/blil/g, "bril")         // blilhantina -> brilhantina
    .replace(/blilh/g, "brilh")
    .replace(/sebola/g, "cebola")    // sebola -> cebola
    .replace(/hortelam/g, "hortela") // hortelam -> hortela
    .replace(/amaora/g, "amora")     // amaora -> amora
    .replace(/piao/g, "pinhao")      // piao -> pinhao
    .replace(/\bfolhas\b/g, "folha") // folhas -> folha
    .replace(/\bpetalas\b/g, "petala") // petalas -> petala
    .trim();
  return s;
}

/* ==========================================================================
   Motor de Paginação Reutilizável com Design Cósmico
   ========================================================================== */
function renderPaginationControls({ container, totalItems, currentPage, perPage, onPageChange, onToggleViewAll, viewAll, unitName = "itens" }) {
  if (!container) return;
  if (totalItems <= 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "flex";
  const totalPages = viewAll ? 1 : Math.ceil(totalItems / perPage);
  const startIdx = viewAll ? 1 : (currentPage - 1) * perPage + 1;
  const endIdx = viewAll ? totalItems : Math.min(currentPage * perPage, totalItems);

  let html = `
    <div class="pagination-info">
      <span>Exibindo <b>${startIdx}–${endIdx}</b> de <b>${totalItems}</b> ${unitName}</span>
      ${totalItems > perPage ? `
        <button class="page-btn page-btn--nav" type="button" id="btnToggleAllPages" style="font-size: 0.82rem; height: 32px;">
          ${viewAll ? "📄 Dividir em Páginas" : `👁️ Ver Todos (${totalItems})`}
        </button>
      ` : ""}
    </div>
  `;

  if (!viewAll && totalPages > 1) {
    html += `<div class="pagination-controls">`;
    // Anterior
    html += `<button class="page-btn page-btn--nav" type="button" ${currentPage <= 1 ? "disabled" : ""} data-page="${currentPage - 1}">« Anterior</button>`;

    // Números de Página
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 7) {
        if (p > 1 && p < currentPage - 1 && p !== 1) {
          if (p === 2) html += `<span style="color: var(--muted); padding: 0 4px;">…</span>`;
          continue;
        }
        if (p < totalPages && p > currentPage + 1 && p !== totalPages) {
          if (p === totalPages - 1) html += `<span style="color: var(--muted); padding: 0 4px;">…</span>`;
          continue;
        }
      }
      const isActive = p === currentPage;
      html += `<button class="page-btn ${isActive ? "active" : ""}" type="button" data-page="${p}">${p}</button>`;
    }

    // Próxima
    html += `<button class="page-btn page-btn--nav" type="button" ${currentPage >= totalPages ? "disabled" : ""} data-page="${currentPage + 1}">Próxima »</button>`;
    html += `</div>`;
  }

  container.innerHTML = html;

  // Event Listeners
  container.querySelectorAll("[data-page]").forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const p = parseInt(btn.getAttribute("data-page"), 10);
      if (p >= 1 && p <= totalPages && p !== currentPage) {
        onPageChange(p);
      }
    };
  });

  const toggleBtn = container.querySelector("#btnToggleAllPages");
  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.preventDefault();
      onToggleViewAll(!viewAll);
    };
  }
}

/* =========================
   Utilitários DOM e Auxiliares
========================= */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

function formatDateBR(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function dailyIndexByDate(date, length) {
  if (length <= 0) return 0;
  const seed = Math.floor(date.getTime() / 86400000);
  return ((seed % length) + length) % length;
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copiado com sucesso!");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Copiado!");
  }
}

function toast(message) {
  const oldToast = document.querySelector(".toast-notification");
  if (oldToast) oldToast.remove();

  const el = document.createElement("div");
  el.className = "toast-notification";
  el.textContent = message;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "24px";
  el.style.transform = "translateX(-50%)";
  el.style.background = "rgba(11, 23, 19, 0.95)";
  el.style.border = "1px solid rgba(159,208,154, 0.35)";
  el.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4)";
  el.style.backdropFilter = "blur(12px)";
  el.style.color = "#ffffff";
  el.style.padding = "10px 18px";
  el.style.borderRadius = "999px";
  el.style.fontSize = "0.92rem";
  el.style.fontWeight = "500";
  el.style.letterSpacing = "0.2px";
  el.style.zIndex = "9999";
  el.style.transition = "opacity 0.25s ease";
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  }, 1600);
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Seu navegador não suporta leitura em voz.");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

/* =========================
   Carregamento de Dados da Fonte Única (window.FV_DATA)
========================= */
function loadMantras() {
  if (window.FV_DATA && Array.isArray(window.FV_DATA.mantras) && window.FV_DATA.mantras.length) {
    DAILY_MANTRAS = window.FV_DATA.mantras;
  } else {
    DAILY_MANTRAS = [];
  }
}

function loadErvas() {
  if (window.FV_DATA && Array.isArray(window.FV_DATA.ervas) && window.FV_DATA.ervas.length) {
    ERVAS = window.FV_DATA.ervas;
  } else {
    ERVAS = [];
  }
}

function loadBanhos() {
  if (window.FV_DATA && Array.isArray(window.FV_DATA.banhos) && window.FV_DATA.banhos.length) {
    BANHOS = window.FV_DATA.banhos;
  } else {
    BANHOS = [];
  }
}

function loadDefumacoes() {
  if (window.FV_DATA && Array.isArray(window.FV_DATA.defumacoes) && window.FV_DATA.defumacoes.length) {
    DEFUMACOES = window.FV_DATA.defumacoes;
  } else {
    DEFUMACOES = [];
  }
}

/* =========================
   Favoritos no LocalStorage
========================= */
function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); }
  catch { return []; }
}
function saveFavorites(items) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(items)); } catch {}
}
function addFavorite(text) {
  const items = loadFavorites();
  if (items.includes(text)) {
    toast("Já está nos seus favoritos.");
    return;
  }
  items.unshift(text);
  saveFavorites(items);
  toast("Salvo nos favoritos!");
}
function removeFavorite(text) {
  const items = loadFavorites().filter(x => x !== text);
  saveFavorites(items);
}

/* Favoritos Universais do Catálogo (Banhos, Ervas, Defumações e Cartas) */
const CATALOG_FAVS_KEY = "fv_catalog_favs_v1";
function loadCatalogFavorites() {
  try { return JSON.parse(localStorage.getItem(CATALOG_FAVS_KEY) || "[]"); }
  catch { return []; }
}
function saveCatalogFavorites(items) {
  try { localStorage.setItem(CATALOG_FAVS_KEY, JSON.stringify(items)); } catch {}
}
function isCatalogFavorite(id) {
  if (!id) return false;
  return loadCatalogFavorites().some(x => x.id === id);
}
function toggleCatalogFavorite(item) {
  if (!item || !item.id) return false;
  let items = loadCatalogFavorites();
  const exists = items.some(x => x.id === item.id);
  if (exists) {
    items = items.filter(x => x.id !== item.id);
    saveCatalogFavorites(items);
    return false;
  } else {
    items.unshift({
      id: item.id,
      eyebrow: item.eyebrow || "Item",
      title: item.title || item.id,
      url: item.url || (location.pathname + "#" + item.id)
    });
    saveCatalogFavorites(items);
    return true;
  }
}

/* =========================
   Modo Iniciante / Avançado Sincronizado
========================= */
function initModeToggle() {
  const mode = localStorage.getItem(MODE_KEY) || "beginner";
  document.body.dataset.mode = (mode === "advanced") ? "advanced" : "beginner";

  const btns = $all("#modeToggle");
  btns.forEach(btn => {
    const isAdv = mode === "advanced";
    btn.setAttribute("aria-pressed", isAdv ? "true" : "false");
    btn.textContent = isAdv ? "Avançado" : "Iniciante";

    btn.onclick = () => {
      const next = (localStorage.getItem(MODE_KEY) === "advanced") ? "beginner" : "advanced";
      localStorage.setItem(MODE_KEY, next);
      document.body.dataset.mode = next === "advanced" ? "advanced" : "beginner";
      $all("#modeToggle").forEach(b => {
        b.setAttribute("aria-pressed", next === "advanced" ? "true" : "false");
        b.textContent = next === "advanced" ? "Avançado" : "Iniciante";
      });
      toast(`Modo ${next === "advanced" ? "Avançado (Fundamentos Profundos)" : "Iniciante (Guiado e Acolhedor)"} ativado.`);
    };
  });
}

/* =========================
   Eventos Globais de Cópia, Leitura e Navegação
========================= */
function initCopySpeak() {
  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-copy], [data-copy-text], [data-speak], [data-scroll]");
    if (!t) return;

    // SCROLL PILL
    const scrollTarget = t.getAttribute("data-scroll");
    if (scrollTarget) {
      const targetEl = document.querySelector(scrollTarget);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // COPY por seletor
    const copySel = t.getAttribute("data-copy");
    if (copySel) {
      const el = document.querySelector(copySel);
      if (el) {
        const text = el.textContent.trim().replace(/^“|”$/g, "");
        copyText(text);
      }
      return;
    }

    // COPY por texto direto
    const copyDirect = t.getAttribute("data-copy-text");
    if (copyDirect) {
      copyText(copyDirect);
      return;
    }

    // SPEAK por seletor
    const speakSel = t.getAttribute("data-speak");
    if (speakSel) {
      const el = document.querySelector(speakSel);
      if (el) {
        const text = el.textContent.trim().replace(/^“|”$/g, "");
        if (text) speak(text);
      }
      return;
    }
  });
}

/* ==========================================================================
   Motor Lunar Central (Cálculo Sinódico & Fases em Tempo Real)
   Permite saber exatamente em qual lua estamos hoje e o que é propício fazer
   ========================================================================== */
const FARM_API = "https://api.farmsense.net/v1/moonphases/?d=";
const SYNODIC_DAYS = 29.530588853;
const REF_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

function toUnixSeconds(d) { return Math.floor(d.getTime() / 1000); }

/* Data local no formato AAAA-MM-DD (toISOString usa UTC e "pula" o dia à noite no Brasil) */
function localISODate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function moonAgeDays(date) {
  const diffDays = (date.getTime() - REF_NEW_MOON_UTC) / 86400000;
  let age = diffDays % SYNODIC_DAYS;
  if (age < 0) age += SYNODIC_DAYS;
  return age;
}

function majorPhaseFromAge(age) {
  if (age < 1.5 || age > SYNODIC_DAYS - 1.5) return "Lua Nova";
  if (Math.abs(age - SYNODIC_DAYS / 2) < 1.5) return "Lua Cheia";
  if (Math.abs(age - SYNODIC_DAYS / 4) < 1.5) return "Quarto Crescente";
  if (Math.abs(age - 3 * SYNODIC_DAYS / 4) < 1.5) return "Quarto Minguante";

  if (age < SYNODIC_DAYS / 4) return "Crescente (entre Nova e Crescente)";
  if (age < SYNODIC_DAYS / 2) return "Crescente (entre Crescente e Cheia)";
  if (age < 3 * SYNODIC_DAYS / 4) return "Minguante (entre Cheia e Minguante)";
  return "Minguante (entre Minguante e Nova)";
}

function phaseIntention(major) {
  const map = {
    "Lua Nova": "Intenção e recomeço • planejar hábitos e semear paz",
    "Quarto Crescente": "Crescimento • disciplina, prosperidade e ação",
    "Lua Cheia": "Força e expansão • harmonização, firmeza e gratidão",
    "Quarto Minguante": "Limpeza e descarrego • soltar pesares e encerrar ciclos"
  };
  return map[major] || "Ajuste e presença • escolha uma intenção de paz.";
}

function banhoTipoSugestao(major) {
  const map = {
    "Lua Nova": "Banho sugerido: Abertura suave e planejamento",
    "Quarto Crescente": "Banho sugerido: Prosperidade, energia e foco (Alecrim / Louro)",
    "Lua Cheia": "Banho sugerido: Harmonização e bênção da cabeça (Boldo / Manjericão)",
    "Quarto Minguante": "Banho sugerido: Limpeza e descarrego simbólico (Pescoço para baixo)"
  };
  return map[major] || "Banho sugerido: Calma e serenidade (Camomila / Lavanda)";
}

function getLiveMoonData(date = new Date()) {
  const age = moonAgeDays(date);
  const illum = Math.round((1 - Math.cos((2 * Math.PI * age) / SYNODIC_DAYS)) / 2 * 100);

  let key = "nova";
  let name = "Lua Nova";
  let icon = "🌑";
  let orientacao = "Ciclo de recomeço e semeadura pura. Ideal para banhos suaves de acalento e firmar intenções de paz, novos hábitos e prosperidade.";

  if (age < 1.5 || age > SYNODIC_DAYS - 1.5) {
    key = "nova";
    name = "Lua Nova";
    icon = "🌑";
    orientacao = "Ciclo de recomeço e semeadura pura. Ideal para banhos suaves de acalento e firmar intenções de paz, novos hábitos e prosperidade.";
  } else if (age < (SYNODIC_DAYS / 4) - 1.5) {
    key = "crescente";
    name = "Lua Crescente";
    icon = "🌒";
    orientacao = "A luz começa a expandir. Perfeita para movimentar novos projetos, estudar e dar o primeiro passo com coragem.";
  } else if (Math.abs(age - SYNODIC_DAYS / 4) <= 1.5) {
    key = "crescente";
    name = "Quarto Crescente";
    icon = "🌓";
    orientacao = "Força motriz, disciplina e expansão. Momento propício para banhos de alecrim, louro e atração de fartura.";
  } else if (age < (SYNODIC_DAYS / 2) - 1.5) {
    key = "crescente";
    name = "Lua Gibosa Crescente";
    icon = "🌔";
    orientacao = "Fase de refinamento e amadurecimento dos propósitos antes do ápice da Cheia.";
  } else if (Math.abs(age - SYNODIC_DAYS / 2) <= 1.5) {
    key = "cheia";
    name = "Lua Cheia";
    icon = "🌕";
    orientacao = "Potência máxima, plenitude e harmonização. O Ori pede luz suave (Boldo, Manjericão, Alfazema) e agradecimento aos Mestres.";
  } else if (age < (3 * SYNODIC_DAYS / 4) - 1.5) {
    key = "minguante";
    name = "Lua Gibosa Minguante";
    icon = "🌖";
    orientacao = "Início do recolhimento, reflexão e desapego do que não serve mais.";
  } else if (Math.abs(age - 3 * SYNODIC_DAYS / 4) <= 1.5) {
    key = "minguante";
    name = "Quarto Minguante";
    icon = "🌗";
    orientacao = "Corte de pesos, faxina espiritual e descarrego. Momento sagrado de arruda e guiné (SEMPRE do pescoço para baixo).";
  } else {
    key = "minguante";
    name = "Lua Balsâmica Minguante";
    icon = "🌘";
    orientacao = "Limpeza profunda e encerramento de ciclos para purificar o terreno antes da Nova.";
  }

  return {
    age: Number(age.toFixed(1)),
    illum,
    key, // 'nova' | 'crescente' | 'cheia' | 'minguante'
    name,
    icon,
    orientacao,
    intention: phaseIntention(key === "nova" ? "Lua Nova" : key === "cheia" ? "Lua Cheia" : key === "crescente" ? "Quarto Crescente" : "Quarto Minguante")
  };
}

function initTodayMoonBanner(containerSelector, onSelectPhase) {
  const container = $(containerSelector);
  const moon = getLiveMoonData(new Date());

  if (container) {
    container.innerHTML = `
      <div class="today-moon-banner">
        <div class="today-moon-left">
          <div class="today-moon-icon" aria-hidden="true">${moon.icon}</div>
          <div>
            <div class="today-moon-tag">
              <span class="live-pulse"></span> Hoje no Céu • Fase Atual
            </div>
            <h3 class="today-moon-name">${moon.name}</h3>
            <p class="today-moon-sub">Idade: ${moon.age} dias • Iluminação aprox.: ~${moon.illum}%</p>
          </div>
        </div>
        <div class="today-moon-right">
          <p class="today-moon-text">${moon.orientacao}</p>
          <button class="btn btn--today-moon" id="btnFilterTodayMoon" type="button">
            Ver receitas para a Lua de Hoje ✨
          </button>
        </div>
      </div>
    `;

    const btnFilter = container.querySelector("#btnFilterTodayMoon");
    if (btnFilter && typeof onSelectPhase === "function") {
      btnFilter.addEventListener("click", () => {
        onSelectPhase(moon.key);
      });
    }
  }

  // Destacar o botão correspondente na linha do tempo lunar
  const targetBtn = document.querySelector(`.lunar__item[data-moon="${moon.key}"]`);
  if (targetBtn) {
    targetBtn.classList.add("is-today");
    if (!targetBtn.querySelector(".lunar__today-pill")) {
      const pill = document.createElement("span");
      pill.className = "lunar__today-pill";
      pill.textContent = "HOJE";
      targetBtn.appendChild(pill);
    }
  }

  return moon;
}

/* =========================
   Página: Início (Relógio & Modo Foco)
========================= */
function wireClock() {
  const clockEl = $("#clock");
  const badge = $("#todayBadge");
  if (!clockEl || !badge) return;

  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hh}:${mm}`;

    const moon = getLiveMoonData(now);
    badge.textContent = `${formatDateBR(now)} • ${moon.icon} ${moon.name}`;

    const homeIcon = $("#homeMoonIcon");
    const homeName = $("#homeMoonName");
    const homeDetail = $("#homeMoonDetail");
    if (homeIcon) homeIcon.textContent = moon.icon;
    if (homeName) homeName.textContent = `${moon.name} (Hoje)`;
    if (homeDetail) homeDetail.textContent = `${moon.intention} • Ilum. ~${moon.illum}%`;
  }
  tick();
  setInterval(tick, 1000 * 10);
}

function wireFocusMode() {
  const btn = $("#focusModeBtn");
  const overlay = $("#focusOverlay");
  if (!btn || !overlay) return;

  let on = false;
  function set(onNow) {
    on = onNow;
    overlay.hidden = !on;
    btn.textContent = on ? "Desativar modo foco" : "Ativar modo foco (escurecer)";
    if (on) toast("Modo foco ativado. Respire com calma.");
  }

  btn.addEventListener("click", () => set(!on));
  overlay.addEventListener("click", () => set(false));
}

/* =========================
   Página: Mantras Diários
========================= */
let currentDailyIndex = null;

function setDailyMantra(forcedIndex = null) {
  const el = $("#dailyMantra");
  const tag = $("#dailyTag");
  const tip = $("#dailyTip");
  const favBtn = $("#favDailyBtn");
  const shuffleBtn = $("#shuffleBtn");
  if (!el || !tag) return;

  if (!DAILY_MANTRAS.length) {
    el.textContent = "“Eu estou em paz e confiante no meu caminho.”";
    tag.textContent = "presença";
    if (tip) tip.textContent = "Mantra de recolhimento e fé.";
    return;
  }

  const idx = forcedIndex !== null ? forcedIndex : dailyIndexByDate(new Date(), DAILY_MANTRAS.length);
  currentDailyIndex = idx;

  const item = DAILY_MANTRAS[idx];
  el.textContent = `“${item.text}”`;
  tag.textContent = item.tag || "mantra";
  if (tip) tip.textContent = item.tip || "";

  if (favBtn) favBtn.onclick = () => addFavorite(item.text);

  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      const newIdx = randInt(DAILY_MANTRAS.length);
      setDailyMantra(newIdx);
      toast("Novo mantra sorteado!");
    };
  }
}

function renderAllMantras(filter = "") {
  const list = $("#allMantrasList");
  const countBadge = $("#countBadge");
  const empty = $("#emptySearch");
  if (!list || !countBadge || !empty) return;

  const q = filter.trim().toLowerCase();

  const filtered = DAILY_MANTRAS.filter(m => {
    const t = (m.text || "").toLowerCase();
    const tag = (m.tag || "").toLowerCase();
    const tip = (m.tip || "").toLowerCase();
    return !q || t.includes(q) || tag.includes(q) || tip.includes(q);
  });

  countBadge.textContent = String(filtered.length);
  list.innerHTML = "";
  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(m => {
    const wrap = document.createElement("div");
    wrap.className = "mantra-item";

    const top = document.createElement("div");
    top.className = "mantra-item__top";

    const left = document.createElement("div");
    left.innerHTML = `<span class="badge">${m.tag || "mantra"}</span>`;

    const useBtn = document.createElement("button");
    useBtn.className = "btn";
    useBtn.type = "button";
    useBtn.textContent = "Usar como mantra de agora";
    useBtn.onclick = () => {
      const realIndex = DAILY_MANTRAS.indexOf(m);
      if (realIndex >= 0) setDailyMantra(realIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    top.append(left, useBtn);

    const text = document.createElement("p");
    text.className = "mantra-item__text";
    text.textContent = `“${m.text}”`;

    const actions = document.createElement("div");
    actions.className = "mantra-item__actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn btn--ghost";
    copyBtn.type = "button";
    copyBtn.textContent = "Copiar";
    copyBtn.onclick = () => copyText(m.text);

    const speakBtn = document.createElement("button");
    speakBtn.className = "btn";
    speakBtn.type = "button";
    speakBtn.textContent = "Ouvir";
    speakBtn.onclick = () => speak(m.text);

    const favBtn = document.createElement("button");
    favBtn.className = "btn btn--ghost";
    favBtn.type = "button";
    favBtn.textContent = "Favoritar";
    favBtn.onclick = () => {
      addFavorite(m.text);
      renderFavorites();
    };

    actions.append(copyBtn, speakBtn, favBtn);

    if (m.tip) {
      const tip = document.createElement("p");
      tip.className = "muted small";
      tip.style.margin = "8px 0 0";
      tip.textContent = m.tip;
      wrap.append(top, text, actions, tip);
    } else {
      wrap.append(top, text, actions);
    }

    list.append(wrap);
  });
}

function wireSearch() {
  const input = $("#searchInput");
  const clearBtn = $("#clearSearchBtn");
  const randomBtn = $("#randomFromListBtn");

  if (input) {
    input.addEventListener("input", () => renderAllMantras(input.value));
  }
  if (clearBtn && input) {
    clearBtn.onclick = () => {
      input.value = "";
      renderAllMantras("");
      input.focus();
    };
  }
  if (randomBtn) {
    randomBtn.onclick = () => {
      if (!DAILY_MANTRAS.length) return;
      setDailyMantra(randInt(DAILY_MANTRAS.length));
      toast("Mantra sorteado!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
}

/* Abas de seção de página (ex.: mantras.html#afirmacoes), sincronizadas com o hash da URL */
function initPageTabs() {
  const tabs = $all("[data-page-tab]");
  if (!tabs.length) return;
  const ids = tabs.map(t => t.getAttribute("data-page-tab"));

  function show(id, scroll) {
    if (!ids.includes(id)) id = ids[0];
    tabs.forEach(t => {
      const on = t.getAttribute("data-page-tab") === id;
      t.classList.toggle("page-tab--active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $all("[data-page-panel]").forEach(p => { p.hidden = p.getAttribute("data-page-panel") !== id; });
    if (scroll) document.querySelector(".page-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fromHash(scroll) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (ids.includes(h)) return show(h, scroll);
    // âncora interna (ex.: #tecnicas, #antes-dormir): abre a aba que a contém
    const target = h ? document.getElementById(h) : null;
    const panel = target?.closest("[data-page-panel]");
    show(panel ? panel.getAttribute("data-page-panel") : ids[0], false);
    if (target && panel) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  tabs.forEach(t => t.addEventListener("click", () => {
    const id = t.getAttribute("data-page-tab");
    history.replaceState(null, "", "#" + id);
    show(id, false);
  }));
  window.addEventListener("hashchange", () => fromHash(true));
  fromHash(false);
}

function wireTabs() {
  const tabs = $all(".tab");
  if (!tabs.length) return;

  tabs.forEach(t => {
    t.addEventListener("click", () => {
      const id = t.getAttribute("data-tab");
      tabs.forEach(x => x.classList.toggle("tab--active", x === t));
      $all(".pane").forEach(p => p.classList.toggle("pane--active", p.id === id));
    });
  });
}

function renderFavorites() {
  const list = $("#favoritesList");
  const empty = $("#favoritesEmpty");
  const clearBtn = $("#clearFavsBtn");
  const catalogList = $("#catalogFavoritesList");
  const catalogSection = $("#catalogFavoritesSection");
  const mantraSection = $("#mantraFavoritesSection");

  const mantraItems = loadFavorites();
  const catalogItems = loadCatalogFavorites();

  const totalCount = mantraItems.length + catalogItems.length;
  if (empty) empty.style.display = totalCount === 0 ? "block" : "none";

  // Catalog items (Banhos, Ervas, Cartas, Defumações)
  if (catalogList && catalogSection) {
    catalogList.innerHTML = "";
    if (catalogItems.length) {
      catalogSection.hidden = false;
      catalogItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "fav-catalog-card";
        card.innerHTML = `
          <div>
            <span class="badge" style="font-size:0.75rem;">${escapeHtml(item.eyebrow || "Item")}</span>
            <b class="fav-catalog-title">${escapeHtml(item.title || item.id)}</b>
          </div>
          <div class="row wrap-row" style="gap:8px; align-items:center;">
            <a class="btn btn--ghost small" href="${escapeHtml(item.url || "#")}">Abrir ficha →</a>
            <button class="btn btn--ghost small" type="button" data-del-catfav="${escapeHtml(item.id)}">Remover</button>
          </div>
        `;
        card.querySelector("[data-del-catfav]")?.addEventListener("click", () => {
          toggleCatalogFavorite(item);
          renderFavorites();
          toast("Item removido dos favoritos.");
        });
        catalogList.appendChild(card);
      });
    } else {
      catalogSection.hidden = true;
    }
  }

  // Mantra items
  if (list && mantraSection) {
    list.innerHTML = "";
    if (mantraItems.length) {
      mantraSection.hidden = false;
      mantraItems.forEach(text => {
        const card = document.createElement("div");
        card.className = "fav";
        card.innerHTML = `
          <p class="fav__text">“${escapeHtml(text)}”</p>
          <div class="fav__actions">
            <button class="btn btn--ghost" type="button" data-copy-fav>Copiar</button>
            <button class="btn" type="button" data-speak-fav>Ouvir</button>
            <button class="btn btn--ghost" type="button" data-del-fav>Remover</button>
          </div>
        `;
        card.querySelector("[data-copy-fav]")?.addEventListener("click", () => copyText(text));
        card.querySelector("[data-speak-fav]")?.addEventListener("click", () => speak(text));
        card.querySelector("[data-del-fav]")?.addEventListener("click", () => {
          removeFavorite(text);
          renderFavorites();
          toast("Removido dos favoritos.");
        });
        list.appendChild(card);
      });
    } else {
      mantraSection.hidden = true;
    }
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      saveFavorites([]);
      saveCatalogFavorites([]);
      renderFavorites();
      toast("Todos os favoritos foram limpos.");
    };
  }
}

/* ==========================================================================
   Caderno de Firmeza (Diário Espiritual Pessoal em mantras.html#caderno)
   ========================================================================== */
const CADERNO_KEY = "fv_caderno_entries_v1";
function loadCadernoEntries() {
  try { return JSON.parse(localStorage.getItem(CADERNO_KEY) || "[]"); }
  catch { return []; }
}
function saveCadernoEntries(entries) {
  try { localStorage.setItem(CADERNO_KEY, JSON.stringify(entries)); } catch {}
}

function initCadernoFirmeza() {
  const form = $("#cadernoForm");
  const list = $("#cadernoList");
  if (!form || !list) return;

  const dataInput = $("#cadernoData");
  const moonTag = $("#cadernoMoonTag");
  const countBadge = $("#cadernoCount");
  const exportBtn = $("#btnExportCaderno");

  if (dataInput && !dataInput.value) {
    dataInput.value = localISODate();
  }

  if (moonTag) {
    const m = getLiveMoonData(new Date());
    moonTag.textContent = `${m.name} ${m.icon}`;
  }

  function renderCaderno() {
    const entries = loadCadernoEntries();
    if (countBadge) countBadge.textContent = `${entries.length} registro${entries.length === 1 ? "" : "s"}`;
    if (!entries.length) {
      list.innerHTML = `<p class="muted small" id="cadernoEmpty">Nenhum registro no caderno ainda. Preencha seu primeiro relato acima!</p>`;
      return;
    }
    list.innerHTML = "";
    const sorted = [...entries].reverse();
    sorted.forEach(entry => {
      const card = document.createElement("article");
      card.className = "caderno-card";

      const tipoMap = {
        banho: "🌿 Banho de Ervas",
        defumacao: "💨 Defumação",
        oraculo: "🎴 Oráculo",
        firmeza: "🕯️ Firmeza",
        oracao: "🙏 Oração",
        sonho: "🌙 Sonho ou Sinal",
        outro: "✨ Prática"
      };
      const tipoLabel = tipoMap[entry.tipo] || "✨ Prática";
      const formattedDate = entry.data ? new Date(entry.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "";

      card.innerHTML = `
        <div class="caderno-card__header">
          <div class="row wrap-row" style="gap:6px; align-items:center;">
            <span class="badge badge--tea">${escapeHtml(tipoLabel)}</span>
            ${entry.moon ? `<span class="badge">${escapeHtml(entry.moon)}</span>` : ""}
            <span class="muted small" style="margin-left:4px;">${escapeHtml(formattedDate)}</span>
          </div>
          <button class="btn-micro" type="button" data-del-entry="${entry.id}" title="Excluir este relato">🗑️</button>
        </div>
        <h3 class="caderno-card__title">${escapeHtml(entry.titulo)}</h3>
        ${entry.relato ? `<p class="caderno-card__relato">${escapeHtml(entry.relato)}</p>` : ""}
      `;

      card.querySelector("[data-del-entry]")?.addEventListener("click", () => {
        if (confirm("Deseja apagar este registro do seu caderno?")) {
          const updated = loadCadernoEntries().filter(x => x.id !== entry.id);
          saveCadernoEntries(updated);
          renderCaderno();
          toast("Registro removido.");
        }
      });

      list.appendChild(card);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const dataVal = $("#cadernoData")?.value;
    const tipoVal = $("#cadernoTipo")?.value || "outro";
    const tituloVal = $("#cadernoTitulo")?.value?.trim();
    const relatoVal = $("#cadernoRelato")?.value?.trim();

    if (!tituloVal) return;

    const m = getLiveMoonData(dataVal ? new Date(dataVal + "T12:00:00") : new Date());

    const newEntry = {
      id: Date.now(),
      data: dataVal || localISODate(),
      moon: `${m.name} ${m.icon}`,
      tipo: tipoVal,
      titulo: tituloVal,
      relato: relatoVal || ""
    };

    const entries = loadCadernoEntries();
    entries.push(newEntry);
    saveCadernoEntries(entries);

    form.reset();
    if (dataInput) dataInput.value = localISODate();
    renderCaderno();
    toast("Registro guardado no seu Caderno de Firmeza! ✨");
  });

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const entries = loadCadernoEntries();
      if (!entries.length) {
        toast("Seu caderno ainda não possui registros para exportar.");
        return;
      }
      let txt = "=======================================================\\n";
      txt += "       MEU CADERNO DE FIRMEZA — FOCO VIBRACIONAL\\n";
      txt += "  Diário Espiritual Pessoal & Relato de Práticas Sagradas\\n";
      txt += "=======================================================\\n\\n";
      txt += `Total de relatos: ${entries.length}\\nGerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}\\n\\n`;

      entries.forEach((e, idx) => {
        txt += `-------------------------------------------------------\\n`;
        txt += `[Registro #${idx + 1}] • ${e.data} • ${e.moon || ""}\\n`;
        txt += `Tipo: ${e.tipo.toUpperCase()}\\n`;
        txt += `Título / Prática: ${e.titulo}\\n`;
        if (e.relato) {
          txt += `Relato / Sensações:\\n${e.relato}\\n`;
        }
        txt += `\\n`;
      });

      const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `meu_caderno_de_firmeza_${localISODate()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast("Caderno exportado em .txt com sucesso! 📥");
    });
  }

  renderCaderno();
}

/* ==========================================================================
   Firmeza de Vela & Momento de Foco (firmeza.html)
   ========================================================================== */
function initFirmezaPage() {
  const candleWrapper = $("#candleWrapper");
  if (!candleWrapper) return;

  const candleAura = $("#candleAura");
  const candleFlame = $("#candleFlame");
  const candleBody = $("#candleBody");
  const candleLabel = $("#candleLabel");
  const intentionDisplay = $("#firmezaIntentionDisplay");
  const inputIntencao = $("#inputIntencao");
  const timerDisplay = $("#timerDisplay");
  const btnToggle = $("#btnTimerToggle");
  const btnReset = $("#btnTimerReset");
  const btnSound = $("#btnSoundToggle");
  const colorPills = $all("[data-candle-color]");
  const durationPills = $all("[data-duration]");

  let timerInterval = null;
  let remainingSeconds = 300; // default 5 min
  let selectedDuration = 300;
  let isRunning = false;
  let soundEnabled = true;

  // Mapa de cores e auras
  const COLORS = {
    branca: {
      body: "linear-gradient(180deg, #f8f9fa, #e2e8f0)",
      aura: "radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(227, 184, 103, 0.25) 50%, transparent 75%)"
    },
    amarela: {
      body: "linear-gradient(180deg, #fef08a, #f59e0b)",
      aura: "radial-gradient(circle, rgba(251, 191, 36, 0.55) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 75%)"
    },
    verde: {
      body: "linear-gradient(180deg, #86efac, #16a34a)",
      aura: "radial-gradient(circle, rgba(74, 222, 128, 0.5) 0%, rgba(22, 163, 74, 0.25) 50%, transparent 75%)"
    },
    azul: {
      body: "linear-gradient(180deg, #93c5fd, #2563eb)",
      aura: "radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 75%)"
    },
    violeta: {
      body: "linear-gradient(180deg, #d8b4fe, #7c3aed)",
      aura: "radial-gradient(circle, rgba(192, 132, 252, 0.5) 0%, rgba(124, 58, 237, 0.25) 50%, transparent 75%)"
    },
    vermelha: {
      body: "linear-gradient(180deg, #fca5a5, #dc2626)",
      aura: "radial-gradient(circle, rgba(248, 113, 113, 0.5) 0%, rgba(220, 38, 38, 0.25) 50%, transparent 75%)"
    }
  };

  function playTibetanBowl() {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      // Sintetizador harmônico de Taça Tibetana (432Hz fundamental, harmônicos 864Hz e 1296Hz)
      const freqs = [432, 864, 1296];
      const gains = [0.22, 0.07, 0.025];

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(gains[i], ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.3);
      });
    } catch (e) {
      // áudio desabilitado ou sem permissão
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    if (selectedDuration === 0) {
      timerDisplay.textContent = isRunning ? "Chama Viva 🕯️" : "Livre";
      return;
    }
    timerDisplay.textContent = formatTime(remainingSeconds);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    btnToggle.textContent = "Iniciar Firmeza 🕯️";
    btnToggle.classList.remove("btn--ghost");
    if (candleFlame) candleFlame.style.animation = "flameFlicker 3s infinite ease-in-out";
  }

  function startTimer() {
    isRunning = true;
    btnToggle.textContent = "Pausar ⏸️";
    btnToggle.classList.add("btn--ghost");
    if (candleFlame) candleFlame.style.animation = "flameFlickerActive 1.5s infinite ease-in-out";
    playTibetanBowl();

    if (selectedDuration === 0) {
      updateTimerDisplay();
      return;
    }

    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        stopTimer();
        playTibetanBowl();
        toast("Firmeza concluída com luz e bênçãos! 🙏✨");
      }
    }, 1000);
  }

  btnToggle.addEventListener("click", () => {
    if (isRunning) {
      stopTimer();
    } else {
      if (remainingSeconds <= 0 && selectedDuration > 0) remainingSeconds = selectedDuration;
      startTimer();
    }
  });

  btnReset.addEventListener("click", () => {
    stopTimer();
    remainingSeconds = selectedDuration;
    updateTimerDisplay();
  });

  btnSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnSound.textContent = soundEnabled ? "🔔" : "🔕";
    btnSound.title = soundEnabled ? "Som ativado" : "Som silenciado";
    toast(soundEnabled ? "Sino tibetano ativado 🔔" : "Sino silenciado 🔕");
  });

  durationPills.forEach(p => {
    p.addEventListener("click", () => {
      stopTimer();
      durationPills.forEach(x => x.classList.remove("pill--active"));
      p.classList.add("pill--active");
      selectedDuration = parseInt(p.dataset.duration, 10);
      remainingSeconds = selectedDuration;
      updateTimerDisplay();
    });
  });

  colorPills.forEach(cp => {
    cp.addEventListener("click", () => {
      colorPills.forEach(x => x.classList.remove("color-pill--active"));
      cp.classList.add("color-pill--active");
      const colKey = cp.dataset.candleColor;
      const col = COLORS[colKey] || COLORS.branca;
      if (candleBody) candleBody.style.background = col.body;
      if (candleAura) candleAura.style.background = col.aura;
      if (candleLabel) candleLabel.textContent = cp.dataset.label;
    });
  });

  if (inputIntencao) {
    inputIntencao.addEventListener("input", () => {
      const val = inputIntencao.value.trim();
      if (intentionDisplay) {
        intentionDisplay.textContent = val ? `“${val}”` : "“Abençoada seja a luz que guia meus passos em serenidade.”";
      }
    });
  }

  updateTimerDisplay();
}

/* ==========================================================================
   Página: Plantas & Ervas Sagradas (plantas.html)
   Compatível com o layout oficial com IDs #herbGrid, #qHerb, #fEnergia, etc.
   ========================================================================== */
/* ==========================================================================
   Ligações cruzadas Ervas ⇄ Banhos ⇄ Defumações
   Casa "Pétalas de 3 Rosas Brancas" com a ficha "Rosa Branca", "7 Folhas de Manga" com "Folha de Manga" etc.
   ========================================================================== */
let HERB_MATCHERS = null;

function herbMatchers() {
  if (HERB_MATCHERS) return HERB_MATCHERS;
  const norm = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ");
  HERB_MATCHERS = ERVAS.map(e => {
    const base = norm(e.nome)
      .replace(/\(.*?\)/g, "")
      .replace(/^folha e flor de |^folha de /, "")
      .replace(/\s+/g, " ")
      .trim();
    // cada palavra aceita plural simples: "rosa branca" casa "rosas brancas"
    const pattern = base.split(" ").map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "s?").join("\\s+");
    return { erva: e, re: new RegExp(`(^|[^a-z])${pattern}([^a-z]|$)`), len: base.length };
  }).sort((a, b) => b.len - a.len); // nomes mais longos primeiro ("rosa branca" antes de "rosa")
  HERB_MATCHERS.norm = norm;
  return HERB_MATCHERS;
}

function findHerbFor(text) {
  const ms = herbMatchers();
  const t = ms.norm(text);
  const m = ms.find(x => x.re.test(t));
  return m ? m.erva : null;
}

/* Lista de ingredientes com link para a ficha da erva quando existir */
function linkedHerbList(list) {
  return (list || []).map(txt => {
    const erva = ERVAS.length ? findHerbFor(txt) : null;
    return erva
      ? `<a class="herb-link" href="plantas.html#${encodeURIComponent(erva.id)}">${escapeHtml(txt)}</a>`
      : escapeHtml(txt);
  }).join(" + ");
}

/* Banhos e defumações que usam uma erva */
function ritualsUsingHerb(erva) {
  const uses = it => (it.ervas || []).some(txt => { const h = findHerbFor(txt); return h && h.id === erva.id; });
  return {
    banhos: BANHOS.filter(uses),
    defumacoes: DEFUMACOES.filter(uses)
  };
}

function usedInHtml(erva) {
  if (!BANHOS.length && !DEFUMACOES.length) return "";
  const { banhos, defumacoes } = ritualsUsingHerb(erva);
  if (!banhos.length && !defumacoes.length) return "";
  const links = [
    ...banhos.map(b => `<a class="herb-link" href="banhos.html#${encodeURIComponent(b.id)}">🛁 ${escapeHtml(b.nome)}</a>`),
    ...defumacoes.map(d => `<a class="herb-link" href="defumacao.html#${encodeURIComponent(d.id)}">💨 ${escapeHtml(d.nome)}</a>`)
  ];
  return `
          <li>
            <b>Usada em (${links.length}):</b>
            <span class="used-in">${links.join("")}</span>
          </li>`;
}

/* ==========================================================================
   CATÁLOGO UNIFICADO (Banhos • Defumações • Ervas)
   Cards compactos + filtros em chips + "mostrar mais" + painel de detalhes.
   Filtros ficam na URL (?q=&objetivo=&lua=…) e cada item abre por #id.
   ========================================================================== */
const OBJETIVOS = [
  { k: "limpeza", label: "Limpeza", icon: "🧹" },
  { k: "protecao", label: "Proteção", icon: "🛡️" },
  { k: "calma", label: "Calma", icon: "💧" },
  { k: "energia", label: "Energia", icon: "☀️" },
  { k: "prosperidade", label: "Prosperidade", icon: "🌻" },
  { k: "harmonizacao", label: "Harmonização", icon: "🕊️" }
];
const LUAS = [
  { k: "nova", label: "Nova", icon: "🌑" },
  { k: "crescente", label: "Crescente", icon: "🌓" },
  { k: "cheia", label: "Cheia", icon: "🌕" },
  { k: "minguante", label: "Minguante", icon: "🌗" }
];
const ENERGIAS = [
  { k: "frias", label: "Frias (paz)", c: "var(--c-calma)" },
  { k: "equilibradoras", label: "Equilibradoras", c: "var(--c-harmonizacao)" },
  { k: "quentes", label: "Quentes (força)", c: "var(--c-protecao)" }
];
const INTENSIDADE_NIVEL = { suave: 1, media: 2, forte: 3 };
const INTENSIDADE_LABEL = { suave: "Suave", media: "Média", forte: "Forte" };
const DIAS_LABEL = { dom: "Dom", seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb" };

const objInfo = k => OBJETIVOS.find(o => o.k === k) || { k, label: k || "—", icon: "✨" };

function splitName(nome) {
  const m = String(nome || "").match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? [m[1], m[2]] : [String(nome || ""), ""];
}

function herbCabeca(e) {
  const t = String(e.cabeca || "");
  if (/nunca|jamais/i.test(t)) return "no";
  if (/^sim/i.test(t)) return "yes";
  return "maybe";
}

function sentidoCurto(s) {
  const t = normalizeSpiritualSearch(s || "");
  if (t.includes("fundo") && t.includes("porta")) return "Fundo → porta";
  if (t.includes("porta para dentro") || t.startsWith("da porta")) return "Porta → dentro";
  return "";
}

function moonsHtml(luas) {
  return `<span class="moons" aria-label="Luas: ${(luas || []).join(", ")}">${LUAS.map(l =>
    `<span class="${(luas || []).includes(l.k) ? "" : "off"}" title="Lua ${l.label}">${l.icon}</span>`).join("")}</span>`;
}

function intensityHtml(v) {
  const n = INTENSIDADE_NIVEL[v] || 1;
  return `<span class="intensity" title="Intensidade ${INTENSIDADE_LABEL[v] || v}">${[1, 2, 3].map(i => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
}

function herbThumbHtml(e, cls = "") {
  if (e && e.imagem) return `<img class="${cls}" src="${escapeHtml(e.imagem)}" alt="${escapeHtml(e.nome)}" loading="lazy" decoding="async">`;
  const en = ENERGIAS.find(x => x.k === e?.energia);
  return `<div class="leaf-ph" style="--c:${en ? en.c : "var(--accent2)"}">${ICONS.leaf}<span>${escapeHtml(splitName(e?.nome || "?")[0].charAt(0))}</span></div>`;
}

/* ---------- Cards ---------- */
function ritualCardHtml(kind, it) {
  const [titulo, sub] = splitName(it.nome);
  const o = objInfo(it.objetivo);
  // Resumo de ervas: nomes das fichas reconhecidas (sem quantidades), sem repetir o subtítulo
  const names = [];
  (it.ervas || []).forEach(t => { const e = ERVAS.length ? findHerbFor(t) : null; const n = e ? splitName(e.nome)[0] : null; if (n && !names.includes(n)) names.push(n); });
  const subN = normalizeSpiritualSearch(sub);
  const herbs = names.length && !names.every(n => subN.includes(normalizeSpiritualSearch(n))) ? names.slice(0, 5).join(" · ") : "";
  let foot;
  if (kind === "banho") {
    foot = it.cabeca ? `<span class="ori ori--yes">✓ Pode na cabeça</span>` : `<span class="ori ori--no">Pescoço p/ baixo</span>`;
  } else {
    const s = sentidoCurto(it.sentido);
    foot = s ? `<span class="badge">${s}</span>` : "";
  }
  return `
    <button class="rcard" type="button" data-open="${escapeHtml(it.id)}" style="--c:var(--c-${o.k})">
      <span class="rcard__top">
        <span class="rcard__kind">${o.icon} ${o.label}</span>
        ${intensityHtml(it.intensidade)}
      </span>
      <h3 class="rcard__title">${escapeHtml(titulo)}</h3>
      ${sub ? `<p class="rcard__sub">${escapeHtml(sub)}</p>` : ""}
      ${herbs ? `<span class="rcard__herbs">🌿 ${escapeHtml(herbs)}</span>` : ""}
      <span class="rcard__foot">${moonsHtml(it.luas)}${foot}</span>
    </button>`;
}

function herbCardHtml(e) {
  const en = ENERGIAS.find(x => x.k === e.energia);
  const cab = herbCabeca(e);
  const oriBadge = cab === "yes" ? `<span class="ori ori--yes">✓ Cabeça</span>` : cab === "no" ? `<span class="ori ori--no">Pescoço p/ baixo</span>` : `<span class="badge">Com orientação</span>`;
  const objs = (e.objetivos || []).slice(0, 2).map(k => `<span class="badge">${objInfo(k).icon} ${objInfo(k).label}</span>`).join("");
  return `
    <button class="hcard" type="button" data-open="${escapeHtml(e.id)}">
      <span class="hcard__media">
        ${herbThumbHtml(e)}
        ${en ? `<span class="hcard__energy" style="color:${en.c}">${en.label}</span>` : ""}
      </span>
      <span class="hcard__body">
        <h3 class="hcard__title">${escapeHtml(splitName(e.nome)[0])}</h3>
        <p class="hcard__pop">${escapeHtml(e.nomePopular || "")}</p>
        <span class="hcard__foot">${oriBadge}${objs}</span>
      </span>
    </button>`;
}

/* ---------- Detalhes ---------- */
function linkHerb(txt) {
  const erva = ERVAS.length ? findHerbFor(txt) : null;
  return erva ? `<a class="herb-link" href="plantas.html#${encodeURIComponent(erva.id)}">${escapeHtml(txt)}</a>` : escapeHtml(txt);
}

function rezaHtml(it) {
  if (!it.reza) return "";
  const id = "reza_" + it.id.replace(/[^a-z0-9_-]/gi, "");
  return `
      <div class="dsec">
        <h3>Reza</h3>
        <blockquote class="quote" id="${id}">“${escapeHtml(it.reza)}”</blockquote>
        <div class="row wrap-row">
          <button class="btn btn--ghost" data-copy="#${id}" type="button">📋 Copiar reza</button>
          <button class="btn btn--ghost" data-speak="#${id}" type="button">🔊 Ouvir</button>
        </div>
      </div>`;
}

function ingredientsHtml(list) {
  return `<ul class="ingredients">${(list || []).map(t => `<li>${linkHerb(t)}</li>`).join("")}</ul>`;
}

function heroForRitual(it) {
  for (const t of it.ervas || []) {
    const e = ERVAS.length ? findHerbFor(t) : null;
    if (e && e.imagem) return `<div class="drawer__hero"><img src="${escapeHtml(e.imagem)}" alt="${escapeHtml(e.nome)}"></div>`;
  }
  return "";
}

function banhoDetailHtml(b) {
  const [titulo, sub] = splitName(b.nome);
  const o = objInfo(b.objetivo);
  return `
    ${heroForRitual(b)}
    <h2 class="drawer__title">${escapeHtml(titulo)}</h2>
    ${sub ? `<p class="drawer__sub">${escapeHtml(sub)}</p>` : ""}
    <div class="drawer__chips">
      <span class="badge" style="color:var(--c-${o.k})">${o.icon} ${o.label}</span>
      <span class="badge">Intensidade ${INTENSIDADE_LABEL[b.intensidade] || b.intensidade}</span>
      ${b.cabeca ? `<span class="ori ori--yes">✓ Pode na cabeça (Ori)</span>` : `<span class="ori ori--no">⚠ Do pescoço para baixo</span>`}
    </div>
    <div class="facts">
      <div class="fact"><span>Luas</span><b>${moonsHtml(b.luas)}</b></div>
      <div class="fact"><span>Dias</span><b>${(b.dias || []).map(d => DIAS_LABEL[d] || d).join(", ") || "Qualquer dia"}</b></div>
      <div class="fact" style="grid-column: 1 / -1"><span>Horário</span><b>${escapeHtml(b.horario || "Livre")}</b></div>
    </div>
    <div class="dsec"><h3>Ingredientes</h3>${ingredientsHtml(b.ervas)}</div>
    <div class="dsec"><h3>Modo de preparo</h3><p>${escapeHtml(b.modoPreparo || "")}</p></div>
    ${rezaHtml(b)}
    <div class="dsec ${b.cabeca ? "" : "dsec--warn"}"><h3>Atenção & fundamento</h3><p>${escapeHtml(b.observacao || "")}</p></div>
    ${b.versaoCha ? `<div class="dsec dsec--tea"><h3>☕ Versão em chá</h3><p>${escapeHtml(b.versaoCha)}</p></div>` : ""}`;
}

function defumacaoDetailHtml(d) {
  const [titulo, sub] = splitName(d.nome);
  const o = objInfo(d.objetivo);
  return `
    ${heroForRitual(d)}
    <h2 class="drawer__title">${escapeHtml(titulo)}</h2>
    ${sub ? `<p class="drawer__sub">${escapeHtml(sub)}</p>` : ""}
    <div class="drawer__chips">
      <span class="badge" style="color:var(--c-${o.k})">${o.icon} ${o.label}</span>
      <span class="badge">Intensidade ${INTENSIDADE_LABEL[d.intensidade] || d.intensidade}</span>
    </div>
    <div class="facts">
      <div class="fact"><span>Luas</span><b>${moonsHtml(d.luas)}</b></div>
      <div class="fact"><span>Dias</span><b>${(d.dias || []).map(x => DIAS_LABEL[x] || x).join(", ") || "Qualquer dia"}</b></div>
      <div class="fact" style="grid-column: 1 / -1"><span>Sentido</span><b>${escapeHtml(d.sentido || "Por todos os cômodos, com ventilação")}</b></div>
      <div class="fact" style="grid-column: 1 / -1"><span>Horário</span><b>${escapeHtml(d.horario || "Livre")}</b></div>
    </div>
    <div class="dsec"><h3>Ervas e resinas</h3>${ingredientsHtml(d.ervas)}</div>
    <div class="dsec"><h3>Para que serve</h3><p>${escapeHtml(d.servePara || "")}</p></div>
    ${rezaHtml(d)}
    <div class="dsec dsec--warn"><h3>Cuidados</h3><p>${escapeHtml(d.cuidados || "Ventile bem; cuidado com fogo, crianças e animais.")}</p></div>`;
}

function ervaDetailHtml(e) {
  const [titulo, sub] = splitName(e.nome);
  const en = ENERGIAS.find(x => x.k === e.energia);
  const cab = herbCabeca(e);
  const usos = (e.usos || []).map(u => u.replace("banho-external", "banho externo").replace("escalda-pes", "escalda-pés")).join(", ");
  const used = usedInHtml(e);
  return `
    <div class="drawer__hero">${herbThumbHtml(e)}</div>
    <h2 class="drawer__title">${escapeHtml(titulo)}</h2>
    <p class="drawer__sub">${escapeHtml(e.nomePopular || sub)}</p>
    <div class="drawer__chips">
      ${en ? `<span class="badge" style="color:${en.c}">${en.label}</span>` : ""}
      <span class="badge">Intensidade ${INTENSIDADE_LABEL[e.intensidade] || e.intensidade || "—"}</span>
      ${(e.objetivos || []).map(k => `<span class="badge">${objInfo(k).icon} ${objInfo(k).label}</span>`).join("")}
    </div>
    <div class="dsec ${cab === "no" ? "dsec--warn" : ""}" style="border-top:0; padding-top:0;">
      <h3>Na cabeça (Ori)</h3><p>${escapeHtml(e.cabeca || "")}</p>
    </div>
    <div class="dsec"><h3>Sobre</h3><p>${escapeHtml(e.descricao || "")}</p></div>
    <div class="facts">
      <div class="fact"><span>Partes usadas</span><b>${escapeHtml((e.partes || []).join(", ") || "—")}</b></div>
      <div class="fact"><span>Usos</span><b>${escapeHtml(usos || "—")}</b></div>
    </div>
    ${e.diferenciacao ? `<div class="dsec"><h3>Diferenciação na tradição</h3><p>${escapeHtml(e.diferenciacao).replace(/\n/g, "<br>")}</p></div>` : ""}
    <div class="dsec"><h3>Colheita</h3><p>${escapeHtml(e.colheita || "")}</p></div>
    <div class="dsec"><h3>Fundamento & tradição</h3><p>${escapeHtml(e.tradicao || "")}</p></div>
    <div class="dsec dsec--warn"><h3>Cuidados e segurança</h3><p>${escapeHtml(e.cuidados || "Uso externo consciente.")}</p></div>
    ${e.cha ? `<div class="dsec dsec--tea"><h3>☕ Uso em chá / medicina popular</h3><p>${escapeHtml(e.cha)}</p></div>` : ""}
    ${used ? `<div class="dsec"><h3>Usada em</h3>${used.replace(/^[\s\S]*?<span class="used-in">/, '<span class="used-in">').replace(/<\/li>\s*$/, "")}</div>` : ""}`;
}

/* ---------- Painel de detalhes ---------- */
let DRAWER = null;

function getDrawer() {
  if (DRAWER) return DRAWER;
  const el = document.createElement("div");
  el.className = "drawer";
  el.hidden = true;
  el.innerHTML = `
    <div class="drawer__backdrop" data-close></div>
    <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <div class="drawer__bar">
        <span class="eyebrow" id="drawerEyebrow"></span>
        <div class="drawer__actions">
          <button class="icon-btn" type="button" data-fav aria-label="Favoritar" title="Salvar nos favoritos">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fav-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="icon-btn" type="button" data-share aria-label="Compartilhar">${ICONS.share}</button>
          <button class="icon-btn" type="button" data-close aria-label="Fechar">${ICONS.close}</button>
        </div>
      </div>
      <div class="drawer__body" id="drawerBody"></div>
    </aside>`;
  document.body.appendChild(el);
  let lastFocus = null;
  let currentDrawerItem = null;

  const api = {
    open(eyebrow, html, id) {
      lastFocus = document.activeElement;
      currentDrawerItem = { id, eyebrow };
      el.querySelector("#drawerEyebrow").textContent = eyebrow;
      const body = el.querySelector("#drawerBody");
      body.innerHTML = html;
      body.scrollTop = 0;
      body.querySelector(".drawer__title")?.setAttribute("id", "drawerTitle");

      const favBtn = el.querySelector("[data-fav]");
      if (favBtn) {
        favBtn.classList.toggle("icon-btn--active", isCatalogFavorite(id));
      }

      el.hidden = false;
      document.body.classList.add("drawer-open");
      if (id && location.hash !== "#" + id) history.replaceState(null, "", location.pathname + location.search + "#" + id);
      el.querySelector("[data-close].icon-btn").focus({ preventScroll: true });
    },
    close() {
      if (el.hidden) return;
      el.hidden = true;
      document.body.classList.remove("drawer-open");
      history.replaceState(null, "", location.pathname + location.search);
      lastFocus?.focus?.({ preventScroll: true });
    },
    get isOpen() { return !el.hidden; }
  };

  el.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) api.close();
    if (e.target.closest("[data-fav]")) {
      const title = el.querySelector(".drawer__title")?.textContent || "";
      const isNowFav = toggleCatalogFavorite({
        id: currentDrawerItem?.id,
        eyebrow: currentDrawerItem?.eyebrow,
        title,
        url: location.pathname + (currentDrawerItem?.id ? "#" + currentDrawerItem.id : "")
      });
      el.querySelector("[data-fav]")?.classList.toggle("icon-btn--active", isNowFav);
      toast(isNowFav ? "Salvo nos seus favoritos! ❤️" : "Removido dos favoritos.");
    }
    if (e.target.closest("[data-share]")) {
      const url = location.href;
      const title = el.querySelector(".drawer__title")?.textContent || document.title;
      if (navigator.share) navigator.share({ title, url }).catch(() => {});
      else copyText(url);
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && api.isOpen) api.close(); });
  DRAWER = api;
  return api;
}

/* ---------- Motor do catálogo ---------- */
function createCatalog(cfg) {
  const mount = cfg.mount;
  const params = new URLSearchParams(location.search);
  const state = { q: params.get("q") || "", shown: cfg.perPage };
  cfg.filters.forEach(f => { state[f.key] = params.get(f.key) || "todos"; });
  (cfg.toggles || []).forEach(t => { state[t.key] = params.get(t.key) === "1"; });
  const todayMoon = getLiveMoonData(new Date()).key;

  const chipRow = f => `
      <div class="chip-row" role="group" aria-label="${f.label}" data-filter-row="${f.key}">
        <span class="chip-row__label">${f.label}</span>
        <button class="pill" type="button" data-f="${f.key}" data-v="todos">Todos</button>
        ${f.options.map(o => `<button class="pill" type="button" data-f="${f.key}" data-v="${o.k}" ${o.c ? `style="--c:${o.c}"` : ""}>${o.icon ? o.icon + " " : ""}${o.label}${f.key === "lua" && o.k === todayMoon ? ' <span class="today-tag">hoje</span>' : ""}</button>`).join("")}
        ${f === cfg.filters[cfg.filters.length - 1] ? (cfg.toggles || []).map(t => `<button class="pill" type="button" data-t="${t.key}">${t.label}</button>`).join("") : ""}
      </div>`;

  mount.innerHTML = `
    <label class="cat-search">
      ${ICONS.search}
      <input class="input" type="search" placeholder="${cfg.placeholder}" value="${escapeHtml(state.q)}" aria-label="${cfg.placeholder}" />
    </label>
    <div class="cat-filters">${cfg.filters.map(chipRow).join("")}</div>
    <div class="cat-meta"><span class="cat-count"></span><button class="cat-clear" type="button" hidden>Limpar filtros</button></div>
    <div class="cat-grid"></div>
    <div class="cat-empty" hidden>Nada encontrado com esses filtros. <button class="cat-clear" type="button">Limpar filtros</button></div>
    <div class="cat-more"></div>`;

  const input = mount.querySelector(".cat-search input");
  const grid = mount.querySelector(".cat-grid");
  const countEl = mount.querySelector(".cat-count");
  const empty = mount.querySelector(".cat-empty");
  const more = mount.querySelector(".cat-more");
  const clearBtns = mount.querySelectorAll(".cat-clear");

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    cfg.filters.forEach(f => { if (state[f.key] !== "todos") p.set(f.key, state[f.key]); });
    (cfg.toggles || []).forEach(t => { if (state[t.key]) p.set(t.key, "1"); });
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }

  function filtered() {
    const q = normalizeSpiritualSearch(state.q);
    return cfg.items.filter(it =>
      (!q || normalizeSpiritualSearch(cfg.searchText(it)).includes(q)) &&
      cfg.filters.every(f => state[f.key] === "todos" || f.test(it, state[f.key])) &&
      (cfg.toggles || []).every(t => !state[t.key] || t.test(it))
    );
  }

  function render() {
    cfg.filters.forEach(f => {
      if (typeof f.showWhen === "function") {
        const row = mount.querySelector(`.chip-row[data-filter-row="${f.key}"]`);
        if (row) {
          const visible = f.showWhen(state);
          row.hidden = !visible;
          if (!visible && state[f.key] !== "todos") {
            state[f.key] = "todos";
          }
        }
      }
    });

    mount.querySelectorAll("[data-f]").forEach(b => b.classList.toggle("pill--active", state[b.dataset.f] === b.dataset.v));
    mount.querySelectorAll("[data-t]").forEach(b => b.classList.toggle("pill--active", !!state[b.dataset.t]));
    const list = filtered();
    const active = state.q || cfg.filters.some(f => state[f.key] !== "todos") || (cfg.toggles || []).some(t => state[t.key]);
    countEl.innerHTML = `<b>${list.length}</b> ${list.length === 1 ? cfg.unit[0] : cfg.unit[1]}${active ? ` de ${cfg.items.length}` : ""}`;
    clearBtns[0].hidden = !active;
    empty.hidden = list.length > 0;
    grid.innerHTML = list.slice(0, state.shown).map(cfg.renderCard).join("");
    const rest = list.length - state.shown;
    more.innerHTML = rest > 0 ? `<button class="btn btn--ghost" type="button">Mostrar mais ${Math.min(rest, cfg.perPage)} (${rest} restantes)</button>` : "";
  }

  function update() { state.shown = cfg.perPage; syncUrl(); render(); }

  let t;
  input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { state.q = input.value.trim(); update(); }, 120); });
  mount.addEventListener("click", e => {
    const f = e.target.closest("[data-f]");
    if (f) { state[f.dataset.f] = (state[f.dataset.f] === f.dataset.v && f.dataset.v !== "todos") ? "todos" : f.dataset.v; return update(); }
    const tg = e.target.closest("[data-t]");
    if (tg) { state[tg.dataset.t] = !state[tg.dataset.t]; return update(); }
    if (e.target.closest(".cat-clear")) {
      state.q = ""; input.value = "";
      cfg.filters.forEach(x => { state[x.key] = "todos"; });
      (cfg.toggles || []).forEach(x => { state[x.key] = false; });
      return update();
    }
    if (e.target.closest(".cat-more button")) { state.shown += cfg.perPage; return render(); }
    const card = e.target.closest("[data-open]");
    if (card) openItem(card.dataset.open);
  });

  function openItem(id) {
    const it = cfg.items.find(x => x.id === id);
    if (it) getDrawer().open(cfg.eyebrow, cfg.detail(it), it.id);
  }
  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && cfg.items.some(x => x.id === id)) openItem(id);
  }
  window.addEventListener("hashchange", fromHash);

  render();
  fromHash();
}

const OBJ_FILTER = { key: "objetivo", label: "Para", options: OBJETIVOS.map(o => ({ ...o, c: `var(--c-${o.k})` })), test: (it, v) => it.objetivo === v };
const LUA_FILTER = { key: "lua", label: "Lua", options: LUAS, test: (it, v) => (it.luas || []).includes(v) };

function initBanhosPage() {
  const mount = $("#catalog[data-catalog='banhos']");
  if (!mount) return;
  createCatalog({
    mount, items: BANHOS, perPage: 24, unit: ["banho", "banhos"], eyebrow: "Banho",
    placeholder: "Buscar banho, erva ou intenção…",
    searchText: b => `${b.nome} ${(b.ervas || []).join(" ")} ${b.objetivo} ${b.observacao} ${b.modoPreparo}`,
    filters: [OBJ_FILTER, LUA_FILTER],
    toggles: [{ key: "cabeca", label: "👑 Pode na cabeça", test: b => b.cabeca === true }],
    renderCard: b => ritualCardHtml("banho", b),
    detail: banhoDetailHtml
  });
}

function initDefumacaoPage() {
  const mount = $("#catalog[data-catalog='defumacoes']");
  if (!mount) return;
  createCatalog({
    mount, items: DEFUMACOES, perPage: 24, unit: ["defumação", "defumações"], eyebrow: "Defumação",
    placeholder: "Buscar defumação, erva ou intenção…",
    searchText: d => `${d.nome} ${(d.ervas || []).join(" ")} ${d.objetivo} ${d.servePara} ${d.sentido}`,
    filters: [OBJ_FILTER, LUA_FILTER],
    renderCard: d => ritualCardHtml("defumacao", d),
    detail: defumacaoDetailHtml
  });
}

function initPlantasPage() {
  const mount = $("#catalog[data-catalog='ervas']");
  if (!mount) return;
  createCatalog({
    mount, items: ERVAS, perPage: 24, unit: ["erva", "ervas"], eyebrow: "Erva",
    placeholder: "Buscar erva pelo nome ou uso…",
    searchText: e => `${e.nome} ${e.nomePopular} ${(e.objetivos || []).join(" ")} ${e.descricao} ${e.tradicao}`,
    filters: [
      { key: "energia", label: "Energia", options: ENERGIAS, test: (e, v) => e.energia === v },
      { key: "objetivo", label: "Para", options: OBJETIVOS, test: (e, v) => (e.objetivos || []).includes(v) }
    ],
    toggles: [{ key: "cabeca", label: "👑 Vai na cabeça", test: e => herbCabeca(e) === "yes" }],
    renderCard: herbCardHtml,
    detail: ervaDetailHtml
  });
}

/* ==========================================================================
   TAROT (clássico) & BARALHO CIGANO (tarot.html) — usa o mesmo motor do catálogo
   ========================================================================== */
let TAROT = [];
const NAIPES = [
  { k: "copas", label: "Copas", icon: "🏆", elemento: "Água • emoções" },
  { k: "paus", label: "Paus", icon: "🔥", elemento: "Fogo • ação" },
  { k: "espadas", label: "Espadas", icon: "⚔️", elemento: "Ar • mente" },
  { k: "ouros", label: "Ouros", icon: "🪙", elemento: "Terra • matéria" }
];
const ROMANOS = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

function tarotNumeral(c) {
  if (c.baralho === "cigano") return String(c.numero);
  if (c.arcano === "maior") return ROMANOS[c.numero] ?? String(c.numero);
  return "";
}

function tarotFaceHtml(c) {
  if (c.imagem) return `<img class="tface tface--${c.baralho}" src="${escapeHtml(c.imagem)}" alt="${escapeHtml(c.nome)}" loading="lazy" decoding="async">`;
  const naipe = NAIPES.find(n => n.k === c.naipe);
  return `
    <span class="tcard__ph ${c.baralho === "cigano" ? "tcard__ph--cigano" : ""}">
      <span class="tcard__num">${tarotNumeral(c) || (naipe ? naipe.icon : "✦")}</span>
      <span class="tcard__ornament">${c.baralho === "cigano" ? "✶" : naipe ? naipe.icon : "☾ ✦ ☽"}</span>
      <span class="tcard__phname">${escapeHtml(c.nome)}</span>
    </span>`;
}

function tarotCardHtml(c) {
  const sub = c.baralho === "cigano"
    ? `Baralho Cigano${c.correspondencia ? " • " + escapeHtml(c.correspondencia) : ""}`
    : c.arcano === "maior" ? "Arcano Maior" : `${(NAIPES.find(n => n.k === c.naipe) || {}).label || ""}`;
  return `
    <button class="tcard" type="button" data-open="${escapeHtml(c.id)}">
      <span class="tcard__face">${tarotFaceHtml(c)}</span>
      <span class="tcard__body">
        <b class="tcard__title">${escapeHtml(c.nome)}</b>
        <span class="tcard__sub">${sub}</span>
      </span>
    </button>`;
}

function tarotDetailHtml(c) {
  const naipe = NAIPES.find(n => n.k === c.naipe);
  const tipo = c.baralho === "cigano" ? "Baralho Cigano" : c.arcano === "maior" ? "Arcano Maior" : `Arcano Menor • ${naipe ? naipe.label : ""}`;
  return `
    <div class="tdetail__face">${tarotFaceHtml(c)}</div>
    <h2 class="drawer__title">${tarotNumeral(c) ? `<span class="muted">${tarotNumeral(c)} · </span>` : ""}${escapeHtml(c.nome)}</h2>
    <p class="drawer__sub">${tipo}${naipe ? ` • ${naipe.elemento}` : ""}${c.correspondencia ? ` • corresponde ao ${escapeHtml(c.correspondencia)}` : ""}</p>
    <div class="drawer__chips">${(c.palavrasChave || []).map(p => `<span class="badge">${escapeHtml(p)}</span>`).join("")}</div>
    <div class="dsec"><h3>Significado</h3><p>${escapeHtml(c.significado || "")}</p></div>
    ${c.invertida ? `<div class="dsec"><h3>Invertida</h3><p>${escapeHtml(c.invertida)}</p></div>` : ""}
    <div class="facts">
      ${c.amor ? `<div class="fact" style="grid-column:1/-1"><span>❤️ Amor</span><b>${escapeHtml(c.amor)}</b></div>` : ""}
      ${c.trabalho ? `<div class="fact" style="grid-column:1/-1"><span>💼 Trabalho</span><b>${escapeHtml(c.trabalho)}</b></div>` : ""}
    </div>
    ${c.conselho ? `<div class="dsec dsec--tea" style="margin-top:14px;"><h3>✨ Conselho</h3><p>${escapeHtml(c.conselho)}</p></div>` : ""}
    <p class="muted small" style="margin-top:18px;">O baralho é uma ferramenta de reflexão e autoconhecimento, não uma sentença sobre o futuro.</p>`;
}

/* Carta do dia (determinística por data, muda à meia-noite) */
function initTarotDaily() {
  const box = $("#tarotDaily");
  if (!box || !TAROT.length) return;
  const render = baralho => {
    const list = TAROT.filter(c => c.baralho === baralho);
    if (!list.length) { box.innerHTML = `<p class="muted">Cartas deste baralho em breve.</p>`; return; }
    const c = list[dailyIndexByDate(new Date(), list.length)];
    box.innerHTML = `
      <button class="tdaily" type="button" data-open-card="${escapeHtml(c.id)}">
        <span class="tcard__face">${tarotFaceHtml(c)}</span>
        <span>
          <span class="eyebrow">Carta do dia • ${baralho === "cigano" ? "Cigano" : "Tarot"}</span>
          <b class="tdaily__title">${escapeHtml(c.nome)}</b>
          <span class="muted">${escapeHtml(c.significado || "")}</span>
          <span class="tdaily__cta">Ver significado completo →</span>
        </span>
      </button>`;
  };
  $all("[data-daily-deck]").forEach(b => b.addEventListener("click", () => {
    $all("[data-daily-deck]").forEach(x => x.classList.toggle("pill--active", x === b));
    render(b.dataset.dailyDeck);
  }));
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-open-card]");
    if (b) location.hash = b.dataset.openCard;
  });
  render("classico");
}

/* Tiragem de 3 cartas (passado • presente • conselho) */
function initTarotSpread() {
  const spreadBox = $("#tarotSpread");
  const btnTrigger = $("#btnTiragem3");
  if (!spreadBox || !btnTrigger) return;

  function runSpread() {
    const activeDeckBtn = document.querySelector("[data-daily-deck].pill--active");
    const baralho = activeDeckBtn ? activeDeckBtn.dataset.dailyDeck : "classico";
    const deck = TAROT.filter(c => c.baralho === baralho);
    if (deck.length < 3) return;

    // Sorteia 3 cartas distintas
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const [cPassado, cPresente, cConselho] = [shuffled[0], shuffled[1], shuffled[2]];

    const deckNome = baralho === "cigano" ? "Baralho Cigano" : "Tarot";

    spreadBox.hidden = false;
    spreadBox.innerHTML = `
      <div class="tspread__header">
        <div>
          <span class="eyebrow">Tiragem de 3 Cartas • ${deckNome}</span>
          <h3 style="margin:2px 0 0; font-family:var(--font-display);">Passado • Presente • Conselho</h3>
        </div>
        <button class="btn btn--ghost small" type="button" id="btnResortearSpread">Sortear Novamente 🔀</button>
      </div>
      <div class="tspread__grid">
        <div class="tspread__slot">
          <span class="tspread__pos">1. Passado / Raízes</span>
          <button class="tcard" type="button" data-open-card="${escapeHtml(cPassado.id)}" style="width:100%;">
            <span class="tcard__face">${tarotFaceHtml(cPassado)}</span>
            <span class="tcard__body">
              <b class="tcard__title">${escapeHtml(cPassado.nome)}</b>
              <span class="tcard__sub">${cPassado.baralho === "cigano" ? (cPassado.correspondencia || "") : (cPassado.arcano === "maior" ? "Arcano Maior" : (NAIPES.find(n => n.k === cPassado.naipe) || {}).label || "")}</span>
            </span>
          </button>
          <p class="tspread__advice"><b>As raízes:</b> ${escapeHtml(cPassado.significado)}</p>
        </div>
        <div class="tspread__slot">
          <span class="tspread__pos">2. Presente / O Momento</span>
          <button class="tcard" type="button" data-open-card="${escapeHtml(cPresente.id)}" style="width:100%;">
            <span class="tcard__face">${tarotFaceHtml(cPresente)}</span>
            <span class="tcard__body">
              <b class="tcard__title">${escapeHtml(cPresente.nome)}</b>
              <span class="tcard__sub">${cPresente.baralho === "cigano" ? (cPresente.correspondencia || "") : (cPresente.arcano === "maior" ? "Arcano Maior" : (NAIPES.find(n => n.k === cPresente.naipe) || {}).label || "")}</span>
            </span>
          </button>
          <p class="tspread__advice"><b>A energia viva:</b> ${escapeHtml(cPresente.significado)}</p>
        </div>
        <div class="tspread__slot">
          <span class="tspread__pos">3. Conselho / Caminho</span>
          <button class="tcard" type="button" data-open-card="${escapeHtml(cConselho.id)}" style="width:100%;">
            <span class="tcard__face">${tarotFaceHtml(cConselho)}</span>
            <span class="tcard__body">
              <b class="tcard__title">${escapeHtml(cConselho.nome)}</b>
              <span class="tcard__sub">${cConselho.baralho === "cigano" ? (cConselho.correspondencia || "") : (cConselho.arcano === "maior" ? "Arcano Maior" : (NAIPES.find(n => n.k === cConselho.naipe) || {}).label || "")}</span>
            </span>
          </button>
          <p class="tspread__advice"><b>O conselho:</b> ${escapeHtml(cConselho.conselho)}</p>
        </div>
      </div>
      <p class="muted small" style="text-align:center; margin-top:16px;">
        Clique em qualquer carta para abrir o significado completo, aspectos de amor e trabalho.
      </p>
    `;

    spreadBox.querySelector("#btnResortearSpread")?.addEventListener("click", runSpread);
    spreadBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  spreadBox.addEventListener("click", e => {
    const b = e.target.closest("[data-open-card]");
    if (b) location.hash = b.dataset.openCard;
  });

  btnTrigger.addEventListener("click", () => {
    if (spreadBox.hidden) {
      runSpread();
      btnTrigger.textContent = "Fechar Tiragem";
    } else {
      spreadBox.hidden = true;
      btnTrigger.textContent = "🎴 Tiragem de 3 Cartas";
    }
  });

  $all("[data-daily-deck]").forEach(b => b.addEventListener("click", () => {
    if (!spreadBox.hidden) runSpread();
  }));
}

function initTarotPage() {
  const mount = $("#catalog[data-catalog='tarot']");
  if (!mount) return;
  TAROT = (window.FV_DATA && window.FV_DATA.tarot) || [];
  createCatalog({
    mount, items: TAROT, perPage: 36, unit: ["carta", "cartas"], eyebrow: "Carta",
    placeholder: "Buscar carta ou palavra-chave (ex.: amor, viagem, Imperatriz)…",
    searchText: c => `${c.nome} ${(c.palavrasChave || []).join(" ")} ${c.significado} ${c.correspondencia || ""}`,
    filters: [
      { key: "baralho", label: "Baralho", options: [{ k: "classico", label: "Tarot clássico", icon: "🃏" }, { k: "cigano", label: "Baralho Cigano", icon: "🌹" }], test: (c, v) => c.baralho === v },
      {
        key: "arcano",
        label: "Arcano",
        showWhen: state => state.baralho !== "cigano",
        options: [{ k: "maior", label: "Maiores" }, ...NAIPES.map(n => ({ k: n.k, label: n.label, icon: n.icon }))],
        test: (c, v) => v === "maior" ? c.arcano === "maior" : c.naipe === v
      }
    ],
    renderCard: tarotCardHtml,
    detail: tarotDetailHtml
  });
  initTarotDaily();
  initTarotSpread();
}

/* ==========================================================================
   Página: Colheita Sagrada & Fases Lunares (colheita.html)
   ========================================================================== */
function initColheitaPage() {
  const grid = $("#harvestGrid");
  const count = $("#harvestCount");
  const empty = $("#harvestEmpty");
  if (!grid || !count) return;

  const qInput = $("#qHarvest");
  const fParte = $("#fParteHarvest");
  const fIntencao = $("#fIntencaoHarvest");
  const clearBtn = $("#clearHarvest");
  const lunarBtns = $all(".lunarpick");

  const CARDS = [
    {
      titulo: "Lua Nova • intenção e recomeço",
      lua: "nova",
      parte: "folhas",
      intencao: "prosperidade",
      resumo: "Culturalmente associada a iniciar ciclos e plantar intenções.",
      avancado: "Bom para planejamento/propósito. Evite agir com pressa: intenção primeiro, prática depois."
    },
    {
      titulo: "Lua Crescente • crescimento",
      lua: "crescente",
      parte: "folhas",
      intencao: "energia",
      resumo: "Símbolo de expansão e construção (crescer, fortalecer).",
      avancado: "Em algumas tradições, combina com práticas de fortalecimento e progresso."
    },
    {
      titulo: "Lua Cheia • força e plenitude",
      lua: "cheia",
      parte: "flores",
      intencao: "harmonizacao",
      resumo: "Ligada à potência e plenitude; energia ‘alta’.",
      avancado: "Boa para ritos de celebração e harmonização. Para sensíveis, pode ser ‘intensa’."
    },
    {
      titulo: "Lua Minguante • limpeza",
      lua: "minguante",
      parte: "folhas",
      intencao: "limpeza",
      resumo: "Associada a descarregar e finalizar ciclos (limpar, soltar).",
      avancado: "Usada culturalmente para práticas de descarrego. Cautela com ervas fortes se você é sensível."
    },
    {
      titulo: "Folhas • uso comum e versátil",
      lua: "todas",
      parte: "folhas",
      intencao: "calma",
      resumo: "Folhas costumam ser a parte mais usada por iniciantes (dependendo da erva).",
      avancado: "Prefira folhas saudáveis e limpas. Se não conhece a planta, não use."
    },
    {
      titulo: "Flores • energia sutil",
      lua: "todas",
      parte: "flores",
      intencao: "harmonizacao",
      resumo: "Flores são associadas a suavidade e harmonização (ex.: alfazema, camomila).",
      avancado: "Guarde bem para evitar mofo. Se for usar aroma, ventile o ambiente."
    },
    {
      titulo: "Cascas/raízes • cautela",
      lua: "todas",
      parte: "raizes",
      intencao: "protecao",
      resumo: "Partes mais densas (casca/raiz) exigem cuidado e orientação.",
      avancado: "Evite como iniciante sem aprendizado direto. Algumas podem ser irritantes/tóxicas."
    },
    {
      titulo: "Sementes • potencial",
      lua: "todas",
      parte: "sementes",
      intencao: "prosperidade",
      resumo: "Sementes simbolizam potencial e continuidade (ciclo).",
      avancado: "Use como símbolo/estudo; práticas variam muito por tradição."
    }
  ];

  let moonLock = "todas";

  function render() {
    const q = (qInput?.value || "").toLowerCase().trim();
    const parte = fParte?.value || "todas";
    const intencao = fIntencao?.value || "todas";

    const filtered = CARDS.filter(c => {
      const hay = (c.titulo + " " + c.resumo + " " + c.intencao + " " + c.parte).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okMoon = (moonLock === "todas") || (c.lua === moonLock) || (c.lua === "todas");
      const okParte = (parte === "todas") || (c.parte === parte);
      const okInt = (intencao === "todas") || (c.intencao === intencao);
      return okQ && okMoon && okParte && okInt;
    });

    count.textContent = String(filtered.length);
    grid.innerHTML = "";
    if (empty) empty.style.display = filtered.length ? "none" : "block";

    filtered.forEach(c => {
      const card = document.createElement("div");
      card.className = "info-card";
      card.innerHTML = `
        <div class="info-card__top">
          <div>
            <h3 class="info-title">${c.titulo}</h3>
            <p class="muted small info-desc">${c.resumo}</p>
          </div>
          <div class="badges">
            <span class="badge">${c.lua === "todas" ? "lua: qualquer" : "lua: " + c.lua}</span>
            <span class="badge">parte: ${c.parte}</span>
            <span class="badge">intenção: ${c.intencao}</span>
          </div>
        </div>
        <ul class="kv advanced-only">
          <li><b>Notas de estudo (avançado):</b> <span>${c.avancado}</span></li>
        </ul>
      `;
      grid.appendChild(card);
    });
  }

  // Banner da Lua de Hoje em colheita.html
  const todayMoonHarvest = initTodayMoonBanner("#colheitaMoonBanner", (phaseKey) => {
    lunarBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-moon") === phaseKey));
    moonLock = phaseKey;
    render();
    toast(`Filtrado para a Lua de Hoje (${todayMoonHarvest.name}) ✨`);
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (qInput) qInput.addEventListener("input", render);
  if (fParte) fParte.addEventListener("change", render);
  if (fIntencao) fIntencao.addEventListener("change", render);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (qInput) qInput.value = "";
      if (fParte) fParte.value = "todas";
      if (fIntencao) fIntencao.value = "todas";
      moonLock = "todas";
      lunarBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-moon") === "todas"));
      render();
    });
  }

  lunarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      lunarBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      moonLock = btn.getAttribute("data-moon");
      render();
    });
  });

  render();
}

/* ==========================================================================
   Página: Calendário Lunar (Online + Fallback Aritmético)
   ========================================================================== */

function nextMajorPhases(startDate, count = 4) {
  const targets = [
    { name: "Lua Nova", targetAge: 0 },
    { name: "Quarto Crescente", targetAge: SYNODIC_DAYS / 4 },
    { name: "Lua Cheia", targetAge: SYNODIC_DAYS / 2 },
    { name: "Quarto Minguante", targetAge: 3 * SYNODIC_DAYS / 4 }
  ];

  const results = [];
  const baseAge = moonAgeDays(startDate);

  for (const t of targets) {
    let delta = t.targetAge - baseAge;
    if (delta <= 0) delta += SYNODIC_DAYS;
    const date = new Date(startDate.getTime() + delta * 86400000);
    results.push({ name: t.name, date });
  }

  results.sort((a, b) => a.date - b.date);
  return results.slice(0, count);
}

async function fetchFarmSense(date) {
  const url = FARM_API + toUnixSeconds(date);
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const item = Array.isArray(data) ? data[0] : null;
  if (!item || item.Error !== 0) throw new Error("FarmSense error");
  return item;
}

function initWeekPlanner(major) {
  const wrap = $("#weekPlanner");
  if (!wrap) return;

  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  wrap.innerHTML = "";

  const today = new Date();
  const day = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const age = moonAgeDays(d);
    const m = majorPhaseFromAge(age);
    const card = document.createElement("div");
    card.className = "day";
    card.innerHTML = `
      <div class="top">
        <b>${days[i]} • ${formatDateBR(d)}</b>
        <span class="pill">${m.replace("Lua ", "")}</span>
      </div>
      <div class="muted small">${phaseIntention(
        m.includes("Nova") ? "Lua Nova" :
        m.includes("Cheia") ? "Lua Cheia" :
        m.includes("Crescente") ? "Quarto Crescente" :
        m.includes("Minguante") ? "Quarto Minguante" : ""
      )}</div>
      <div class="muted small" style="margin-top:6px;">${banhoTipoSugestao(
        m.includes("Nova") ? "Lua Nova" :
        m.includes("Cheia") ? "Lua Cheia" :
        m.includes("Crescente") ? "Quarto Crescente" :
        m.includes("Minguante") ? "Quarto Minguante" : ""
      )}</div>
    `;
    wrap.appendChild(card);
  }
}

async function initCalendarioLunar() {
  const nowName = $("#moonNowName");
  if (!nowName) return;

  const nowBadge = $("#moonNowBadge");
  const nowDetails = $("#moonNowDetails");
  const nextWrap = $("#nextPhases");

  const today = new Date();
  let major = null;

  try {
    const item = await fetchFarmSense(today);
    const phase = item.Phase || "—";
    const illum = typeof item.Illumination === "number" ? Math.round(item.Illumination * 100) : null;

    let label = phase.replace("Waxing", "Crescente")
                     .replace("Waning", "Minguante")
                     .replace("Crescent", "Crescente")
                     .replace("Gibbous", "Gibosa")
                     .replace("Quarter", "Quarto");

    const age = moonAgeDays(today);
    const m = majorPhaseFromAge(age);
    major = m.includes("Nova") ? "Lua Nova"
          : m.includes("Cheia") ? "Lua Cheia"
          : m.includes("Crescente") ? "Quarto Crescente"
          : m.includes("Minguante") ? "Quarto Minguante"
          : "—";

    nowName.textContent = label;
    nowBadge.textContent = `Hoje • ${major}`;
    nowDetails.textContent = illum !== null ? `Iluminação aprox.: ${illum}% (online)` : `(online)`;
  } catch {
    const age = moonAgeDays(today);
    const m = majorPhaseFromAge(age);
    major = m.includes("Nova") ? "Lua Nova"
          : m.includes("Cheia") ? "Lua Cheia"
          : m.includes("Crescente") ? "Quarto Crescente"
          : m.includes("Minguante") ? "Quarto Minguante"
          : "—";

    nowName.textContent = m;
    nowBadge.textContent = `Hoje • ${major}`;
    nowDetails.textContent = `Estimativa local (offline) • idade lunar: ${age.toFixed(1)} dias`;
  }

  if (nextWrap) {
    const next = nextMajorPhases(today, 4);
    nextWrap.innerHTML = "";
    next.forEach(p => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <b>${p.name}</b>
        <div class="muted small">${formatDateBR(p.date)} • ${phaseIntention(p.name)}</div>
        <div class="muted small advanced-only" style="margin-top:6px;">${banhoTipoSugestao(p.name)}</div>
      `;
      nextWrap.appendChild(div);
    });
  }

  initWeekPlanner(major);
}

/* ==========================================================================
   Página: Portais Numéricos & Sequências (portais.html)
   ========================================================================== */
const PORTAL_MEANINGS = {
  1: { tema: "Recomeço • decisão • direção", fazer: "Definir 1 meta clara e 1 ação mínima hoje." },
  2: { tema: "Equilíbrio • relações • escolhas conscientes", fazer: "Harmonizar emoções e alinhar decisões com calma." },
  3: { tema: "Expressão • criatividade • comunicação", fazer: "Escrever ideias, estudar, comunicar um objetivo." },
  4: { tema: "Estrutura • disciplina • base", fazer: "Organizar rotina/finanças; construir constância." },
  5: { tema: "Mudança • movimento • liberdade", fazer: "Quebrar um padrão e iniciar um hábito novo." },
  6: { tema: "Cuidado • responsabilidade • amor", fazer: "Autocuidado e equilíbrio nos relacionamentos." },
  7: { tema: "Introspecção • fé • estudo", fazer: "Silêncio, meditação, leitura e autoconhecimento." },
  8: { tema: "Poder pessoal • prosperidade • expansão", fazer: "Foco em resultados, coragem e ação financeira." },
  9: { tema: "Encerramento • desapego • conclusão", fazer: "Finalizar pendências, limpar excessos, perdoar e soltar." },
  10: { tema: "Alinhamento • clareza • ação", fazer: "Escolher prioridades e executar o essencial." },
  11: { tema: "Consciência • propósito • despertar", fazer: "Revisar rumo de vida e reafirmar propósito com fé." },
  12: { tema: "Integração • síntese • fechamento", fazer: "Revisar o ano, agradecer aos mestres e planejar novo ciclo." }
};

function getNextPortals(fromDate, howMany = 8) {
  const out = [];
  let y = fromDate.getFullYear();

  while (out.length < howMany) {
    for (let m = 1; m <= 12; m++) {
      const d = new Date(y, m - 1, m);
      const dayStart = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const candStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (candStart >= dayStart) {
        out.push(d);
        if (out.length >= howMany) break;
      }
    }
    y++;
  }
  return out;
}

function isPortalDay(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return m === d && m >= 1 && m <= 12;
}

function portalName(month) {
  const mm = String(month).padStart(2, "0");
  return `${mm}/${mm}`;
}

/* Sequências numéricas (Grabovoi) — fonte única usada em portais.html e no painel Hoje */
const GRABOVOI_SEQS = [
  { seq: "520 741 777 888", cat: "prosperidade", titulo: "Prosperidade Máxima & Fluxo Total", uso: "Combinação clássica para destravamento material, milagres e abundância divina." },
  { seq: "520", cat: "prosperidade", titulo: "Dinheiro Inesperado", uso: "Abertura rápida de canais de renda imprevistos, destravamento de pagamentos e circulação do fluxo material." },
  { seq: "318 798", cat: "prosperidade", titulo: "Paz Financeira & Quitação de Dívidas", uso: "Organização mental para pagar pendências, tranquilidade orçamentária e prosperidade sustentável." },
  { seq: "888", cat: "prosperidade", titulo: "Abundância Divina & Expansão Justa", uso: "Trabalhar disciplina, merecimento e colheita fértil do próprio suor." },
  { seq: "741", cat: "foco", titulo: "Solução Imediata de Problemas", uso: "Clareza mental instantânea quando estiver diante de um impasse ou aperto urgente." },
  { seq: "519 7148", cat: "foco", titulo: "Tudo é Possível", uso: "Rompimento de crenças de incapacidade e conexão direta com o campo de infinitas possibilidades." },
  { seq: "111", cat: "foco", titulo: "Começo Abençoado & Direção", uso: "Iniciar um novo projeto, trabalho ou estudo com firmeza, bênção e constância." },
  { seq: "1814321", cat: "saude", titulo: "Saúde Integral & Vitalidade", uso: "Harmonização do corpo físico, fortalecimento celular e vigor para a jornada diária." },
  { seq: "1891014", cat: "calma", titulo: "Alívio do Estresse & Ansiedade", uso: "Acalmar o peito apertado, desanuviar pensamentos acelerados e respirar em paz." },
  { seq: "1001105010", cat: "calma", titulo: "Paz Interior Profunda", uso: "Serenidade de espírito, equilíbrio emocional e alinhamento do coração." },
  { seq: "222", cat: "harmonizacao", titulo: "Harmonia Familiar & no Lar", uso: "Apaziguar conflitos de convivência, fortalecer a paciência mútua e restaurar a concórdia." },
  { seq: "918 005 914", cat: "harmonizacao", titulo: "Amor Próprio & Autoestima", uso: "Reconhecimento do seu valor sagrado e libertação de sentimentos de culpa ou rejeição." },
  { seq: "917 498 814316", cat: "protecao", titulo: "Escudo Protetor Energético", uso: "Blindagem áurica contra inveja, energias intrusas e ambientes espiritualmente densos." },
  { seq: "777", cat: "protecao", titulo: "Milagres & Bênçãos Cósmicas", uso: "Sustentação na fé, amparo superior em horas difíceis e gratidão pelas vitórias." },
  { seq: "999", cat: "limpeza", titulo: "Encerramento de Ciclos & Desapego", uso: "Fechar portas do passado com dignidade e soltar laços que não servem mais à sua evolução." }
];

function initPortaisPage() {
  const grid = $("#portalGrid");
  if (!grid) return;

  const yearBadge = $("#portalYear");
  if (yearBadge) yearBadge.textContent = `Hoje • ${new Date().getFullYear()}`;

  const nextWrap = $("#portalNextList");
  if (nextWrap) {
    const next = getNextPortals(new Date(), 6);
    nextWrap.innerHTML = "";
    next.forEach(d => {
      const m = d.getMonth() + 1;
      const meaning = PORTAL_MEANINGS[m];
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <b>${portalName(m)} • ${formatDateBR(d)}</b>
        <div class="muted small">${meaning.tema}</div>
        <div class="muted small advanced-only" style="margin-top:6px;"><b>Intenção:</b> ${meaning.fazer}</div>
      `;
      nextWrap.appendChild(el);
    });
  }

  const today = new Date();
  const todayBadge = $("#portalTodayBadge");
  const todayTitle = $("#portalTodayTitle");
  const todayMeaning = $("#portalTodayMeaning");
  const todayDo = $("#portalTodayDo");

  if (todayBadge && todayTitle) {
    if (isPortalDay(today)) {
      const m = today.getMonth() + 1;
      const meaning = PORTAL_MEANINGS[m];
      todayBadge.textContent = "SIM";
      todayTitle.textContent = `${portalName(m)} • ${formatDateBR(today)}`;
      if (todayMeaning) todayMeaning.textContent = meaning.tema;
      if (todayDo) todayDo.textContent = `Sugestão: ${meaning.fazer}`;
    } else {
      todayBadge.textContent = "NÃO";
      todayTitle.textContent = formatDateBR(today);
      if (todayMeaning) todayMeaning.textContent = "Mesmo sem portal numérico, o dia de hoje é sagrado para sua prática.";
      if (todayDo) todayDo.textContent = "Sugestão: faça uma oração de agradecimento, tome um chá ou banho de manjericão e aja com clareza.";
    }
  }

  grid.innerHTML = "";
  for (let m = 1; m <= 12; m++) {
    const meaning = PORTAL_MEANINGS[m];
    const card = document.createElement("div");
    card.className = "info-card";
    card.innerHTML = `
      <div class="info-card__top">
        <div>
          <h3 class="info-title">${portalName(m)}</h3>
          <p class="muted small info-desc">${meaning.tema}</p>
        </div>
        <div class="badges"><span class="badge">intenção</span></div>
      </div>
      <ul class="kv">
        <li><b>Melhor uso:</b> ${meaning.fazer}</li>
        <li class="advanced-only"><b>Dica da Jurema:</b> combine com a Lua para escolher banho de “limpeza” (minguante) ou “expansão” (crescente/cheia).</li>
      </ul>
    `;
    grid.appendChild(card);
  }

  // Grabovoi & Sequências Expandidas (fonte única: GRABOVOI_SEQS)
  const SEQS = GRABOVOI_SEQS;

  const seqWrap = $("#seqList");
  const qSeq = $("#qSeq");
  const fSeq = $("#fSeqCat");
  const btnRnd = $("#seqRandom");
  const btnClr = $("#seqClear");

  function renderSeq(list) {
    if (!seqWrap) return;
    seqWrap.innerHTML = "";
    list.forEach(s => {
      const el = document.createElement("div");
      el.className = "item";
      const id = "seq_" + s.seq.replace(/\s/g, "_");
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <b class="mono" style="font-size:1.15rem; color:#fff;">${s.seq}</b>
          <span class="badge">${s.cat}</span>
        </div>
        <div class="muted small" style="margin-top:4px; font-weight:600; color:#e2e8f0;">${s.titulo}</div>
        <div class="muted small" id="${id}" style="margin-top:4px;">${s.uso}</div>
        <div class="row wrap-row" style="margin-top:10px; gap:8px;">
          <button class="btn btn--ghost" data-copy-text="${s.seq}" type="button">📋 Copiar</button>
          <button class="btn" data-speak="#${id}" type="button">🔊 Ouvir</button>
        </div>
      `;
      seqWrap.appendChild(el);
    });
  }

  function applySeq() {
    const q = (qSeq?.value || "").toLowerCase().trim();
    const cat = fSeq?.value || "todas";
    const filtered = SEQS.filter(s => {
      const hay = (s.seq + " " + s.cat + " " + s.titulo + " " + s.uso).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okC = (cat === "todas") || s.cat === cat;
      return okQ && okC;
    });
    renderSeq(filtered.length ? filtered : SEQS);
  }

  if (qSeq) qSeq.addEventListener("input", applySeq);
  if (fSeq) fSeq.addEventListener("change", applySeq);
  if (btnClr) {
    btnClr.addEventListener("click", () => {
      if (qSeq) qSeq.value = "";
      if (fSeq) fSeq.value = "todas";
      applySeq();
    });
  }
  if (btnRnd) {
    btnRnd.addEventListener("click", () => {
      const list = SEQS.filter(s => (!fSeq || fSeq.value === "todas") || s.cat === fSeq.value);
      const pick = list[Math.floor(Math.random() * list.length)];
      renderSeq([pick]);
      toast("Sequência sorteada!");
    });
  }

  applySeq();
}

/* ==========================================================================
   Inicialização do Widget Interativo de Grabovoi na Home (index.html)
   ========================================================================== */
function initHomeGrabovoi() {
  const pillsWrap = $("#grabovoiPills");
  if (!pillsWrap) return;

  const titleEl = $("#grabovoiActiveTitle");
  const codeEl = $("#grabovoiActiveCode");
  const descEl = $("#grabovoiActiveDesc");
  const blockEl = $("#grabovoiBlockDisplay");
  const copyBtn = $("#grabovoiCopyBtn");
  const speakBtn = $("#grabovoiSpeakBtn");
  const btnRandom = $("#grabovoiBtnRandom");

  function setSequence(seq, title, desc, clickedBtn) {
    if (titleEl) titleEl.textContent = title;
    if (codeEl) codeEl.textContent = seq;
    if (descEl) descEl.textContent = desc;

    if (blockEl) {
      blockEl.innerHTML = "";
      const parts = seq.split(/\s+/).filter(Boolean);
      parts.forEach(p => {
        const span = document.createElement("span");
        span.textContent = p;
        blockEl.appendChild(span);
      });
    }

    if (copyBtn) {
      copyBtn.setAttribute("data-copy-text", seq);
    }

    pillsWrap.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
    if (clickedBtn) {
      clickedBtn.classList.add("pill--active");
    }
  }

  pillsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-seq]");
    if (!btn) return;
    const seq = btn.getAttribute("data-seq");
    const title = btn.getAttribute("data-title") || "Sequência de Foco";
    const desc = btn.getAttribute("data-desc") || "";
    setSequence(seq, title, desc, btn);
  });

  if (btnRandom) {
    btnRandom.addEventListener("click", () => {
      const allBtns = Array.from(pillsWrap.querySelectorAll("button[data-seq]"));
      if (!allBtns.length) return;
      const pick = allBtns[Math.floor(Math.random() * allBtns.length)];
      pick.click();
      toast("Sequência alternada!");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const seq = copyBtn.getAttribute("data-copy-text") || (codeEl ? codeEl.textContent : "520 741 777 888");
      navigator.clipboard?.writeText(seq).then(() => toast("Sequência copiada: " + seq));
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      const title = titleEl ? titleEl.textContent : "Sequência";
      const code = codeEl ? codeEl.textContent : "520 741 777 888";
      const spokenCode = code.split("").map(c => c === " " ? "..." : c).join(" ");
      speakText(`${title}. Números: ${spokenCode}`);
    });
  }
}

/* ==========================================================================
   Inicialização da Página de Símbolos Sagrados (simbolos.html)
   Pontos Riscados, 24 Runas com Oráculo e Mandalas com Respiração 4-2-6
   ========================================================================== */
function initSimbolosPage() {
  // 1. Alternador de Abas Principais
  const tabBtnPontos = $("#tabBtnPontos");
  const tabBtnRunas = $("#tabBtnRunas");
  const tabBtnMandalas = $("#tabBtnMandalas");
  const tabBtnSigilos = $("#tabBtnSigilos");

  const panePontos = $("#panePontos");
  const paneRunas = $("#paneRunas");
  const paneMandalas = $("#paneMandalas");
  const paneSigilos = $("#paneSigilos");

  if (!tabBtnPontos || !panePontos) return; // Não está em simbolos.html

  function switchSimboloTab(activeTab, activePane) {
    [tabBtnPontos, tabBtnRunas, tabBtnMandalas, tabBtnSigilos].forEach(t => t?.classList.remove("tab--active"));
    [panePontos, paneRunas, paneMandalas, paneSigilos].forEach(p => { if (p) p.style.display = "none"; });

    activeTab.classList.add("tab--active");
    if (activePane) activePane.style.display = "block";
  }

  tabBtnPontos.addEventListener("click", () => switchSimboloTab(tabBtnPontos, panePontos));
  tabBtnRunas.addEventListener("click", () => switchSimboloTab(tabBtnRunas, paneRunas));
  tabBtnMandalas.addEventListener("click", () => switchSimboloTab(tabBtnMandalas, paneMandalas));
  tabBtnSigilos?.addEventListener("click", () => switchSimboloTab(tabBtnSigilos, paneSigilos));

  // 2. Base de Dados das 24 Runas do Elder Futhark
  const RUNAS_DATA = [
    { glyph: "ᚠ", nome: "FEHU", cat: "prosperidade", traducao: "Gado / Riqueza Circulante", palavra: "Prosperidade Viva, Fluxo e Generosidade", conselho: "A verdadeira fartura não é o que você acumula debaixo do colchão por medo, mas o que você faz circular com honra e retidão. Abra as mãos para dar e receber.", afirmacao: "Eu sou um canal limpo de prosperidade e abundância abundante." },
    { glyph: "ᚢ", nome: "URUZ", cat: "cura", traducao: "Touro Selvagem / Força Primal", palavra: "Vitalidade Física, Resistência e Superação", conselho: "Não fuja do desafio nem se vitimize. A terra te deu ossos fortes e coração valente; enfrente a lida com serenidade e postura ereta.", afirmacao: "Minha saúde física é vigorosa e minha força interior é inabalável." },
    { glyph: "ᚦ", nome: "THURISAZ", cat: "protecao", traducao: "Gigante / Espinho de Defesa", palavra: "Escudo Ativo, Corte de Armadilhas e Limpeza", conselho: "Como o espinho do mandacaru e a espada de Ogum, esta runa avisa: não ataque ninguém, mas não permita que pisem na sua dignidade. Corte o mal pela raiz.", afirmacao: "Sou protegido por escudos de luz contra toda maledicência." },
    { glyph: "ᚨ", nome: "ANSUZ", cat: "sabedoria", traducao: "Voz dos Deuses / Sabedoria Ancestral", palavra: "Comunicação Clara, Inspiração e Conselho", conselho: "Escute a voz dos mais velhos e o sussurro da brisa nas folhas. Antes de falar palavras amargas, respire três vezes e prefira a verdade com respeito.", afirmacao: "Minhas palavras edificam, pacificam e manifestam a verdade divina." },
    { glyph: "ᚱ", nome: "RAIDO", cat: "sabedoria", traducao: "Carruagem / A Grande Jornada", palavra: "Ritmo Certo, Movimento Ordenado e Viagem", conselho: "A vida não está estagnada; é uma estrada de aprendizado contínuo. Não tente apressar o passo nem queira pular etapas. Mantenha o passo firme.", afirmacao: "Estou no ritmo certo do Universo e confio no meu caminho." },
    { glyph: "ᚲ", nome: "KENAZ", cat: "sabedoria", traducao: "Tocha / Luz Reveladora", palavra: "Clareza Mental, Criatividade e Verdade", conselho: "A tocha dissipa a sombra da ignorância e da dúvida. Olhe para os seus problemas sem medo: o que antes parecia um monstro se revela algo simples de resolver.", afirmacao: "A luz da sabedoria ilumina todas as minhas escolhas." },
    { glyph: "ᚷ", nome: "GEBO", cat: "prosperidade", traducao: "Presente / Troca Justa", palavra: "Equilíbrio entre Dar e Receber, Alianças Leais", conselho: "Nenhuma relação se sustenta onde só um lado se doa e o outro só explora. Honre seus combinados e cultive amigos que andam ombro a ombro com você.", afirmacao: "Minhas relações são fundadas no respeito mútuo e na lealdade." },
    { glyph: "ᚹ", nome: "WUNJO", cat: "cura", traducao: "Alegria / Harmonia Fraterna", palavra: "Contentamento, Realização e Bênção no Lar", conselho: "Alegre-se com as pequenas vitórias do dia: o café quente, a água fresca, o dever cumprido. O contentamento sincero fecha as portas para o olho-gordo.", afirmacao: "Eu acolho a paz, a alegria legítima e a harmonia em minha casa." },
    { glyph: "ᚺ", nome: "HAGALAZ", cat: "transformacao", traducao: "Granizo / Tempestade Inesperada", palavra: "Ruptura Libertadora, Fim do Velho e Renascimento", conselho: "Quando o temporal cai na mata, não adianta brigar com a chuva. Abrace o que acabou sem desespero: a tempestade veio lavar o solo para o novo brotar.", afirmacao: "Eu me liberto do que já não me serve e aceito a renovação." },
    { glyph: "ᛁ", nome: "ISA", cat: "sabedoria", traducao: "Gelo / Imobilidade Sagrada", palavra: "Pausa Reflexiva, Paciência e Esfriar da Cabeça", conselho: "Não tome decisões de cabeça quente nem force portas emperradas. Recolha-se, acalme o sangue e espere o gelo derreter antes de dar o próximo passo.", afirmacao: "No silêncio e na paciência, eu encontro minha maior firmeza." },
    { glyph: "ᛃ", nome: "JERA", cat: "prosperidade", traducao: "Colheita Fértil / Ciclo do Ano", palavra: "Recompensa Justa, Frutos do Trabalho e Merecimento", conselho: "Quem plantou com amor e regou com paciência não teme o inverno. Sua colheita está madura; receba com gratidão o fruto sagrado do seu empenho.", afirmacao: "Eu colho hoje com júbilo o bem que plantei com constância." },
    { glyph: "ᛇ", nome: "EIHWAZ", cat: "protecao", traducao: "Teixo / Árvore da Vida e Morte", palavra: "Resiliência Profunda, Longevidade e Raiz Firme", conselho: "Como o pé de jurema preta no sertão, você foi feito para aguentar seca e vendaval sem quebrar. Suas raízes são profundas na fé de seus antepassados.", afirmacao: "Eu sou firme, resistente e inabalável perante as adversidades." },
    { glyph: "ᛈ", nome: "PERTHRO", cat: "sabedoria", traducao: "Taça de Sortes / O Mistério do Destino", palavra: "Intuição Aguçada, Sincronicidade e Revelação", conselho: "Nem tudo na vida é explicado pelo intelecto. Confie na voz sutil do seu sexto sentido e nas sincronicidades que os guias colocam discretamente no seu dia.", afirmacao: "Minha intuição é límpida e eu confio nos mistérios do Criador." },
    { glyph: "ᛉ", nome: "ALGIZ", cat: "protecao", traducao: "Alce Sagrado / Chifres de Defesa", palavra: "Proteção Espiritual Máxima e Conexão Superior", conselho: "Você está debaixo do manto da luz superior. Mentalize a cruz de pemba e o olhar dos seus guardiões. Ande com retidão moral e nada te derrubará.", afirmacao: "Eu sou guiado, guardado e protegido em todos os meus passos." },
    { glyph: "ᛋ", nome: "SOWILO", cat: "prosperidade", traducao: "Sol Triunfante / Vitória da Luz", palavra: "Sucesso, Iluminação, Saúde e Entusiasmo", conselho: "O Sol dissipa todo nevoeiro. Deixe sua luz brilhar sem vergonha e sem soberba. Assuma o leme da sua própria história com confiança e vigor renovado.", afirmacao: "A luz do Sol brilha em meu coração, trazendo vitória e saúde." },
    { glyph: "ᛏ", nome: "TIWAZ", cat: "protecao", traducao: "Lança da Justiça / O Deus Týr", palavra: "Justiça Implacável, Honra, Coragem e Retidão", conselho: "A justiça divina não dorme nem se vende. Mantenha as mãos limpas, cumpra a palavra empenhada e não tenha medo de lutar pelo que é honesto e nobre.", afirmacao: "Eu caminho guiado pela verdade, pela honra e pela justiça divina." },
    { glyph: "ᛒ", nome: "BERKANA", cat: "cura", traducao: "Bétula / A Grande Mãe da Terra", palavra: "Renascimento Suave, Fertilidade e Cuidado do Lar", conselho: "Como uma mãe que nina o filho e a terra que aconchega a semente, cuide com ternura dos seus novos projetos e da sua família. Cultive o afeto diário.", afirmacao: "A ternura e a fertilidade renovam minha vida todos os dias." },
    { glyph: "ᛖ", nome: "EHWAZ", cat: "sabedoria", traducao: "Cavalo Fiel / Parceria Leal", palavra: "Cooperação Mútua, Progresso Rápido e Lealdade", conselho: "Ninguém vence batalha sozinho. Valorize quem divide a carga com você, seja no trabalho ou no amor. O passo conjunto é duas vezes mais ligeiro.", afirmacao: "Eu atraio companheiros leais e avanço em harmonia com todos." },
    { glyph: "ᛗ", nome: "MANNAZ", cat: "sabedoria", traducao: "Humanidade / Consciência Coletiva", palavra: "Autoconhecimento, Humildade e Fraternidade", conselho: "Lembre-se de quem você é: nem superior a ninguém pela vitória, nem inferior pela prova passageira. Somos todos filhos do mesmo solo e do mesmo sopro divino.", afirmacao: "Eu me conheço profundamente e trato a todos com reverência." },
    { glyph: "ᛚ", nome: "LAGUZ", cat: "cura", traducao: "Água Corrente / Mar Profundo", palavra: "Fluidez Emocional, Purificação e Cura de Mágoas", conselho: "Água parada cria limo e amargura. Perdoe quem te feriu e deixe o rio da vida levar o que passou. Deixe suas emoções fluírem límpidas como cachoeira de Oxum.", afirmacao: "Minhas águas internas são puras, calmas e curadoras." },
    { glyph: "ᛜ", nome: "INGWAZ", cat: "prosperidade", traducao: "Semente Sagrada / Deus da Fertilidade", palavra: "Gestação Silenciosa, Descanso Produtivo e Potencial", conselho: "A semente precisa ficar no escuro da terra antes de brotar flor e fruto. Não queira mostrar antes da hora o que ainda está amadurecendo em segredo.", afirmacao: "Meus planos amadurecem com segurança e darão frutos benditos." },
    { glyph: "ᛟ", nome: "OTHALA", cat: "protecao", traducao: "Herança Ancestral / O Lar Sagrado", palavra: "Raízes de Família, Tradição e Território Protegido", conselho: "Honre a memória dos seus avós e a terra que te acolhe. Proteja as quatro paredes da sua casa com prece, fumaça de defumação e respeito mútuo.", afirmacao: "Meu lar é um santuário de paz, proteção e bênção ancestral." },
    { glyph: "ᛞ", nome: "DAGAZ", cat: "transformacao", traducao: "Aurora / Novo Dia Desperto", palavra: "Despertar da Luz, Fim da Noite Escura e Esperança", conselho: "A noite mais escura sempre precede o clarão do amanhecer. A dor que te afligia chegou ao fim; respire fundo e acolha o recomeço que já brilha no horizonte.", afirmacao: "Um novo dia abençoado amanhece hoje em todos os meus caminhos." }
  ];

  // Renderizar o Catálogo de Runas
  const runasGrid = $("#runasGrid");
  const filterCat = $("#filterRunaCat");

  function renderRunas(list) {
    if (!runasGrid) return;
    runasGrid.innerHTML = "";
    list.forEach(r => {
      const card = document.createElement("article");
      card.className = "runa-card";
      card.innerHTML = `
        <div class="runa-card__header">
          <span class="runa-glyph-mini">${r.glyph}</span>
          <span class="badge">${r.cat}</span>
        </div>
        <h4 class="runa-name">${r.nome}</h4>
        <p class="muted small" style="margin:0; font-size:0.82rem; color:var(--accent);">${r.traducao}</p>
        <p class="muted small" style="margin:4px 0 0; line-height:1.4;">${r.palavra}</p>
      `;
      card.addEventListener("click", () => showOracleResult(r));
      runasGrid.appendChild(card);
    });
  }

  if (filterCat) {
    filterCat.addEventListener("change", () => {
      const cat = filterCat.value;
      const filtered = (cat === "todas") ? RUNAS_DATA : RUNAS_DATA.filter(r => r.cat === cat);
      renderRunas(filtered);
    });
  }

  renderRunas(RUNAS_DATA);

  // Oráculo: Tirar Runa do Momento
  const btnTirarRuna = $("#btnTirarRuna");
  const runaResultado = $("#runaResultado");
  const oracleGlyph = $("#oracleGlyph");
  const oracleName = $("#oracleName");
  const oracleArchetype = $("#oracleArchetype");
  const oracleAdvice = $("#oracleAdvice");
  const oracleCopyBtn = $("#oracleCopyBtn");
  const oracleSpeakBtn = $("#oracleSpeakBtn");

  let currentOracleRuna = null;

  function showOracleResult(r) {
    currentOracleRuna = r;
    if (!runaResultado) return;

    if (oracleGlyph) oracleGlyph.textContent = r.glyph;
    if (oracleName) oracleName.textContent = `${r.nome} • ${r.palavra.split(",")[0]}`;
    if (oracleArchetype) oracleArchetype.textContent = `Significado: ${r.traducao} (${r.palavra})`;
    if (oracleAdvice) oracleAdvice.textContent = r.conselho;

    runaResultado.style.display = "block";
    runaResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (btnTirarRuna) {
    btnTirarRuna.addEventListener("click", () => {
      btnTirarRuna.textContent = "Consultando os ventos…";
      btnTirarRuna.disabled = true;
      setTimeout(() => {
        const randomRuna = RUNAS_DATA[Math.floor(Math.random() * RUNAS_DATA.length)];
        showOracleResult(randomRuna);
        btnTirarRuna.textContent = "⚡ Tirar Outra Runa";
        btnTirarRuna.disabled = false;
        toast(`Runa sorteada: ${randomRuna.nome} (${randomRuna.glyph})`);
      }, 350);
    });
  }

  if (oracleCopyBtn) {
    oracleCopyBtn.addEventListener("click", () => {
      if (!currentOracleRuna) return;
      const text = `Runa ${currentOracleRuna.nome} (${currentOracleRuna.glyph})\n${currentOracleRuna.palavra}\nConselho: ${currentOracleRuna.conselho}\nAfirmação: ${currentOracleRuna.afirmacao}`;
      navigator.clipboard?.writeText(text).then(() => toast("Conselho rúnico copiado!"));
    });
  }

  if (oracleSpeakBtn) {
    oracleSpeakBtn.addEventListener("click", () => {
      if (!currentOracleRuna) return;
      speakText(`Runa ${currentOracleRuna.nome}. ${currentOracleRuna.palavra}. Conselho do Velho Juremeiro: ${currentOracleRuna.conselho}`);
    });
  }

  // 3. Mandalas Vibracionais & Respiração 4-2-6
  const mandalaPills = $("#mandalaPills");
  const mandalaSvgWrap = $("#mandalaSvgWrap");
  const mandalaSvgCanvas = $("#mandalaSvgCanvas");
  const mandalaCaption = $("#mandalaCaption");

  const MANDALAS_DICT = {
    flor: {
      title: "Flor da Vida (Geometria Cósmica Primordial)",
      caption: "<strong>Flor da Vida:</strong> Geometria sagrada universal dos 19 círculos entrelaçados. Harmoniza a estrutura celular e dissolve pensamentos dispersos.",
      svg: `
        <defs>
          <radialGradient id="gradFlor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#e3b867" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="88" fill="none" stroke="#e3b867" stroke-width="2" stroke-opacity="0.6"/>
        <circle cx="100" cy="100" r="94" fill="none" stroke="#9fd09a" stroke-width="1.2" stroke-opacity="0.4"/>
        <circle cx="100" cy="100" r="32" fill="none" stroke="#e3b867" stroke-width="1.6"/>
        <!-- 6 Círculos Concêntricos -->
        <circle cx="100" cy="68" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle cx="127" cy="84" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle cx="127" cy="116" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle cx="100" cy="132" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle cx="73" cy="116" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle cx="73" cy="84" r="32" fill="none" stroke="#e3b867" stroke-width="1.4" stroke-opacity="0.7"/>
        <!-- Anel Externo de Pétalas -->
        <circle cx="100" cy="36" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="155" cy="68" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="155" cy="132" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="100" cy="164" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="45" cy="132" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="45" cy="68" r="32" fill="none" stroke="#9fd09a" stroke-width="1" stroke-opacity="0.45"/>
        <circle cx="100" cy="100" r="5" fill="#ffffff" />
      `
    },
    solar: {
      title: "Mandala Solar (Fartura, Ouro & Realização)",
      caption: "<strong>Mandala Solar:</strong> Alinhamento com o chakra do plexo solar. Desperta entusiasmo, energia de realização e sensação de merecimento da fartura.",
      svg: `
        <circle cx="100" cy="100" r="90" fill="none" stroke="#e3b867" stroke-width="2" stroke-dasharray="4,3" opacity="0.6"/>
        <circle cx="100" cy="100" r="76" fill="none" stroke="#d97706" stroke-width="1.5" opacity="0.8"/>
        <!-- 12 Raios Solares Geométricos -->
        <g stroke="#f59e0b" stroke-width="2" opacity="0.85">
          <line x1="100" y1="12" x2="100" y2="40"/>
          <line x1="100" y1="160" x2="100" y2="188"/>
          <line x1="12" y1="100" x2="40" y2="100"/>
          <line x1="160" y1="100" x2="188" y2="100"/>
          <line x1="38" y1="38" x2="58" y2="58"/>
          <line x1="142" y1="142" x2="162" y2="162"/>
          <line x1="162" y1="38" x2="142" y2="58"/>
          <line x1="38" y1="162" x2="58" y2="142"/>
        </g>
        <!-- Estrela de Ouro Interna -->
        <polygon points="100,45 118,78 155,80 125,104 135,140 100,120 65,140 75,104 45,80 82,78" fill="rgba(245,158,11,0.2)" stroke="#e3b867" stroke-width="1.8"/>
        <circle cx="100" cy="100" r="22" fill="rgba(251,191,36,0.3)" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="100" cy="100" r="6" fill="#fff" />
      `
    },
    jurema: {
      title: "Mandala da Jurema (Matas Sagradas, Cura & Raiz)",
      caption: "<strong>Mandala das Matas & Jurema:</strong> Sintonização com Oxóssi e os Mestres das Matas. Ancora os pés na terra, acalma vertigens e restabelece a força física.",
      svg: `
        <circle cx="100" cy="100" r="88" fill="none" stroke="#10b981" stroke-width="2" opacity="0.6"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6,4"/>
        <!-- 8 Folhas em Cruz e Diagonal -->
        <g stroke="#10b981" stroke-width="1.6" fill="rgba(16,185,129,0.18)">
          <path d="M100,100 C115,70 115,40 100,25 C85,40 85,70 100,100 Z"/>
          <path d="M100,100 C115,130 115,160 100,175 C85,160 85,130 100,100 Z"/>
          <path d="M100,100 C70,115 40,115 25,100 C40,85 70,85 100,100 Z"/>
          <path d="M100,100 C130,115 160,115 175,100 C160,85 130,85 100,100 Z"/>
          <!-- Diagonais menores -->
          <path d="M100,100 C125,85 145,65 155,45 C135,55 115,75 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C75,125 55,145 45,155 C65,135 85,115 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C125,115 145,135 155,155 C135,145 115,125 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C75,85 55,65 45,45 C65,55 85,75 100,100 Z" opacity="0.8"/>
        </g>
        <circle cx="100" cy="100" r="14" fill="rgba(5,150,105,0.4)" stroke="#34d399" stroke-width="1.8"/>
        <circle cx="100" cy="100" r="5" fill="#a7f3d0" />
      `
    },
    aguas: {
      title: "Mandala das Águas (Purificação, Lótus & Serenidade)",
      caption: "<strong>Mandala das Águas Sagradas:</strong> Conexão com Iemanjá e Oxum. Acalma a ansiedade no peito, dissolve o peso de insônias e limpa mágoas acumuladas.",
      svg: `
        <circle cx="100" cy="100" r="92" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.5"/>
        <circle cx="100" cy="100" r="78" fill="none" stroke="#0ea5e9" stroke-width="2" opacity="0.75"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#7dd3fc" stroke-width="1.5" stroke-dasharray="3,3"/>
        <!-- Ondas Consecutivas em Lótus -->
        <g stroke="#38bdf8" stroke-width="1.8" fill="rgba(14,165,233,0.14)">
          <path d="M100,100 Q120,60 100,35 Q80,60 100,100 Z"/>
          <path d="M100,100 Q140,80 165,100 Q140,120 100,100 Z"/>
          <path d="M100,100 Q120,140 100,165 Q80,140 100,100 Z"/>
          <path d="M100,100 Q60,80 35,100 Q60,120 100,100 Z"/>
          <!-- Ondas Intermediárias -->
          <circle cx="100" cy="100" r="42" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
          <path d="M100,100 C115,85 130,85 145,100 C130,115 115,115 100,100" fill="none" stroke="#38bdf8"/>
          <path d="M100,100 C85,85 70,85 55,100 C70,115 85,115 100,100" fill="none" stroke="#38bdf8"/>
        </g>
        <circle cx="100" cy="100" r="12" fill="rgba(14,165,233,0.3)" stroke="#bae6fd" stroke-width="2"/>
        <circle cx="100" cy="100" r="4" fill="#ffffff" />
      `
    }
  };

  function setMandala(key, btn) {
    const data = MANDALAS_DICT[key] || MANDALAS_DICT.flor;
    if (mandalaSvgCanvas) {
      mandalaSvgCanvas.innerHTML = data.svg;
    }
    if (mandalaCaption) {
      mandalaCaption.innerHTML = data.caption;
    }
    if (mandalaPills) {
      mandalaPills.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      if (btn) btn.classList.add("pill--active");
    }
  }

  if (mandalaPills) {
    mandalaPills.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-mandala]");
      if (!btn) return;
      const key = btn.getAttribute("data-mandala");
      setMandala(key, btn);
    });
  }

  // Define padrão inicial
  setMandala("flor", mandalaPills?.querySelector("button[data-mandala='flor']"));

  // 4. Temporizador de Respiração 4-2-6
  const btnStartBreathe = $("#btnStartBreathe");
  const btnResetBreathe = $("#btnResetBreathe");
  const breathePhaseBadge = $("#breathePhaseBadge");
  const breatheTimerCount = $("#breatheTimerCount");
  const breathePhaseInstruction = $("#breathePhaseInstruction");
  const breatheCycleCount = $("#breatheCycleCount");

  let breatheInterval = null;
  let breathePhase = "idle"; // "inhale", "hold", "exhale"
  let secondsLeft = 4;
  let cyclesCompleted = 0;
  let isRunning = false;

  function updateBreatheUI(phase, count, instruction, badgeClass, badgeText, pulseClass) {
    if (breatheTimerCount) breatheTimerCount.textContent = count;
    if (breathePhaseInstruction) breathePhaseInstruction.textContent = instruction;
    if (breathePhaseBadge) {
      breathePhaseBadge.className = `breathe-phase-pill ${badgeClass}`;
      breathePhaseBadge.textContent = badgeText;
    }
    if (mandalaSvgWrap) {
      mandalaSvgWrap.className = `mandala-svg-wrap ${pulseClass}`;
    }
  }

  function startNextPhase() {
    if (breathePhase === "idle" || breathePhase === "exhale") {
      breathePhase = "inhale";
      secondsLeft = 4;
      updateBreatheUI(
        "inhale",
        secondsLeft,
        "Puxe o ar suavemente pelo nariz, trazendo a luz da geometria para o peito.",
        "phase-inhale",
        "🌱 INSPIRE (4 segundos)",
        "pulse-inhale"
      );
    } else if (breathePhase === "inhale") {
      breathePhase = "hold";
      secondsLeft = 2;
      updateBreatheUI(
        "hold",
        secondsLeft,
        "Segure o ar com calma. Sinta sua firmeza interior.",
        "phase-hold",
        "🟡 RETENHA (2 segundos)",
        "pulse-hold"
      );
    } else if (breathePhase === "hold") {
      breathePhase = "exhale";
      secondsLeft = 6;
      updateBreatheUI(
        "exhale",
        secondsLeft,
        "Solte o ar devagar pela boca, liberando todo o cansaço, estresse e peso.",
        "phase-exhale",
        "🌊 EXPIRE (6 segundos)",
        "pulse-exhale"
      );
    }
  }

  function tickBreathe() {
    secondsLeft--;
    if (secondsLeft > 0) {
      if (breatheTimerCount) breatheTimerCount.textContent = secondsLeft;
    } else {
      if (breathePhase === "exhale") {
        cyclesCompleted++;
        if (breatheCycleCount) breatheCycleCount.textContent = cyclesCompleted;
      }
      startNextPhase();
    }
  }

  if (btnStartBreathe) {
    btnStartBreathe.addEventListener("click", () => {
      if (!isRunning) {
        isRunning = true;
        btnStartBreathe.textContent = "⏸️ Pausar Respiração";
        btnStartBreathe.classList.add("btn--ghost");
        startNextPhase();
        breatheInterval = setInterval(tickBreathe, 1000);
      } else {
        isRunning = false;
        btnStartBreathe.textContent = "▶️ Retomar Respiração";
        btnStartBreathe.classList.remove("btn--ghost");
        clearInterval(breatheInterval);
      }
    });
  }

  if (btnResetBreathe) {
    btnResetBreathe.addEventListener("click", () => {
      isRunning = false;
      clearInterval(breatheInterval);
      breathePhase = "idle";
      secondsLeft = 4;
      cyclesCompleted = 0;
      if (breatheCycleCount) breatheCycleCount.textContent = "0";
      if (btnStartBreathe) {
        btnStartBreathe.textContent = "▶️ Iniciar Respiração Guiada";
        btnStartBreathe.classList.remove("btn--ghost");
      }
      updateBreatheUI(
        "idle",
        "4",
        "Fixe o olhar no ponto central da mandala e acompanhe o ritmo do círculo.",
        "phase-inhale",
        "🌱 INSPIRE (Pelo nariz)",
        ""
      );
    });
  }

  // 5. Criador de Sigilos Sagrados & Roda Numérica Cósmica (1 a 9)
  const sigilInput = $("#sigilInput");
  const sigilClearBtn = $("#sigilClearBtn");
  const sigilPresets = $("#sigilPresets");
  const sigilStepOrig = $("#sigilStepOrig");
  const sigilStepCons = $("#sigilStepCons");
  const sigilStepUniq = $("#sigilStepUniq");
  const sigilStepNums = $("#sigilStepNums");
  const sigilLetterMap = $("#sigilLetterMap");
  const sigilSvgCanvas = $("#sigilSvgCanvas");
  const sigilCaption = $("#sigilCaption");
  const btnStyleStraight = $("#btnStyleStraight");
  const btnStyleCurved = $("#btnStyleCurved");
  const btnViewComplete = $("#btnViewComplete");
  const btnViewPure = $("#btnViewPure");
  const sigilColors = $("#sigilColors");
  const btnDownloadSigil = $("#btnDownloadSigil");
  const btnAnimateSigil = $("#btnAnimateSigil");
  const btnCopySigilData = $("#btnCopySigilData");

  const PYTHAGOREAN_TABLE = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  const VOWELS_SET = new Set(["A", "E", "I", "O", "U"]);

  let sigilLineStyle = "straight"; // "straight" | "curved"
  let sigilViewMode = "complete";  // "complete" | "pure"
  let sigilActiveColor = "#e3b867"; // default gold
  let currentSigilData = null;

  function processSigilWord(rawText) {
    if (!rawText || !rawText.trim()) {
      return {
        original: "",
        consonants: [],
        uniqueConsonants: [],
        letterMap: [],
        numberSequence: []
      };
    }

    const cleanUpper = rawText
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    const lettersOnly = cleanUpper.replace(/[^A-Z]/g, "").split("");
    const consonants = lettersOnly.filter(c => !VOWELS_SET.has(c));
    const uniqueConsonants = Array.from(new Set(consonants));

    const letterMap = uniqueConsonants.map(c => ({
      letter: c,
      num: PYTHAGOREAN_TABLE[c] || 1
    }));

    const numberSequence = letterMap.map(item => item.num);

    return {
      original: cleanUpper,
      consonants,
      uniqueConsonants,
      letterMap,
      numberSequence
    };
  }

  function getWheelCoords(num, radius = 110, cx = 160, cy = 160) {
    // 9 números distribuídos como relógio sagrado (1 no ápice a -90°)
    const angleDeg = -90 + (num - 1) * 40;
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
      angleDeg,
      rad
    };
  }

  function renderSigilSvg(data, shouldAnimate = true) {
    if (!sigilSvgCanvas) return;

    const cx = 160;
    const cy = 160;
    const rWheel = 110;
    const seq = data.numberSequence;
    const color = sigilActiveColor;
    const isPure = sigilViewMode === "pure";

    // 1. Defs: Filtro de brilho sutil
    let svgHtml = `
      <defs>
        <filter id="sigilGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="sigilCenterGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
    `;

    // 2. Elementos de Fundo Místico (Anéis Orbitais e Centro Cósmico)
    svgHtml += `
      <!-- Centro Cósmico -->
      <circle cx="${cx}" cy="${cy}" r="148" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="138" fill="none" stroke="${color}" stroke-opacity="${isPure ? '0.08' : '0.22'}" stroke-width="1.2" stroke-dasharray="4,4"/>
      <circle cx="${cx}" cy="${cy}" r="${rWheel}" fill="url(#sigilCenterGrad)" stroke="rgba(255,255,255,${isPure ? '0.04' : '0.12'})" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="2" fill="${color}" opacity="0.6"/>
    `;

    // 3. Mostrador da Roda de 9 Pontos (estilo relógio)
    if (!isPure) {
      for (let n = 1; n <= 9; n++) {
        const pt = getWheelCoords(n, rWheel, cx, cy);
        const inSeq = seq.includes(n);

        // Nó do número
        svgHtml += `
          <g class="wheel-node">
            ${inSeq ? `
              <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="14" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-dasharray="2,2"/>
            ` : ""}
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="9.5" fill="${inSeq ? 'rgba(227,184,103, 0.15)' : 'rgba(20,29,23, 0.9)'}" stroke="${inSeq ? color : 'rgba(255,255,255,0.22)'}" stroke-width="1.4"/>
            <text x="${pt.x.toFixed(1)}" y="${(pt.y + 3.8).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${inSeq ? color : 'rgba(255,255,255,0.7)'}" font-family="inherit">${n}</text>
          </g>
        `;
      }
    }

    // 4. Traçado do Sigilo Sagrado
    if (seq.length > 0) {
      const animClass = shouldAnimate ? "sigil-drawn-path sigil-animate-active" : "sigil-drawn-path";

      if (seq.length === 1) {
        // Apenas um ponto: Nó de Ativação Sagrado com Anel Solar
        const pt0 = getWheelCoords(seq[0], rWheel, cx, cy);
        svgHtml += `
          <g filter="url(#sigilGlow)">
            <circle cx="${pt0.x.toFixed(1)}" cy="${pt0.y.toFixed(1)}" r="7" fill="${color}"/>
            <circle cx="${pt0.x.toFixed(1)}" cy="${pt0.y.toFixed(1)}" r="16" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="5,3"/>
            <line x1="${(pt0.x - 14).toFixed(1)}" y1="${pt0.y.toFixed(1)}" x2="${(pt0.x + 14).toFixed(1)}" y2="${pt0.y.toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          </g>
        `;
      } else {
        const ptStart = getWheelCoords(seq[0], rWheel, cx, cy);

        // Construir caminho (Path)
        let pathD = `M ${ptStart.x.toFixed(1)} ${ptStart.y.toFixed(1)}`;
        let lastPt = ptStart;
        let lastTanDx = 0;
        let lastTanDy = 0;

        for (let i = 1; i < seq.length; i++) {
          const ptCurr = getWheelCoords(seq[i], rWheel, cx, cy);

          if (seq[i] === seq[i - 1]) {
            // Número repetido em sequência: Laço orbital místico
            const loopRadius = 18;
            pathD += ` A ${loopRadius} ${loopRadius} 0 1 1 ${(ptCurr.x + 0.1).toFixed(1)} ${(ptCurr.y + 0.1).toFixed(1)}`;
            lastTanDx = ptCurr.x - cx;
            lastTanDy = ptCurr.y - cy;
          } else if (sigilLineStyle === "curved") {
            // Linhas Curvas: arco gracioso puxado suavemente para o centro
            const mx = (lastPt.x + ptCurr.x) / 2;
            const my = (lastPt.y + ptCurr.y) / 2;
            const cpx = mx + (cx - mx) * 0.32;
            const cpy = my + (cy - my) * 0.32;
            pathD += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ptCurr.x.toFixed(1)} ${ptCurr.y.toFixed(1)}`;
            lastTanDx = ptCurr.x - cpx;
            lastTanDy = ptCurr.y - cpy;
          } else {
            // Linhas Retas: Geometria cristalina pura
            pathD += ` L ${ptCurr.x.toFixed(1)} ${ptCurr.y.toFixed(1)}`;
            lastTanDx = ptCurr.x - lastPt.x;
            lastTanDy = ptCurr.y - lastPt.y;
          }

          lastPt = ptCurr;
        }

        // SVG Path principal
        svgHtml += `
          <g filter="url(#sigilGlow)">
            <path id="sigilActivePath" d="${pathD}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" class="${animClass}"/>
          </g>
        `;

        // Ponto de Origem: Nó Circular Sagrado
        svgHtml += `
          <g class="sigil-start-node" filter="url(#sigilGlow)">
            <circle cx="${ptStart.x.toFixed(1)}" cy="${ptStart.y.toFixed(1)}" r="6" fill="${color}"/>
            <circle cx="${ptStart.x.toFixed(1)}" cy="${ptStart.y.toFixed(1)}" r="11" fill="none" stroke="${color}" stroke-width="1.6" stroke-opacity="0.6"/>
          </g>
        `;

        // Vértices Intermediários: Pequenos nós de firmeza
        for (let i = 1; i < seq.length - 1; i++) {
          const ptMid = getWheelCoords(seq[i], rWheel, cx, cy);
          svgHtml += `
            <circle cx="${ptMid.x.toFixed(1)}" cy="${ptMid.y.toFixed(1)}" r="3.2" fill="${color}" opacity="0.85"/>
          `;
        }

        // Barra Terminal Perpendicular (T-Bar de Ancoragem Tradicional)
        const ptEnd = lastPt;
        const len = Math.hypot(lastTanDx, lastTanDy);
        let nx = 0;
        let ny = 1;
        if (len > 0.001) {
          nx = -lastTanDy / len;
          ny = lastTanDx / len;
        }

        const barHalf = 13;
        const barX1 = ptEnd.x - nx * barHalf;
        const barY1 = ptEnd.y - ny * barHalf;
        const barX2 = ptEnd.x + nx * barHalf;
        const barY2 = ptEnd.y + ny * barHalf;

        svgHtml += `
          <g class="sigil-end-bar" filter="url(#sigilGlow)">
            <line x1="${barX1.toFixed(1)}" y1="${barY1.toFixed(1)}" x2="${barX2.toFixed(1)}" y2="${barY2.toFixed(1)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
          </g>
        `;
      }
    } else {
      // Estado vazio / apenas vogais
      svgHtml += `
        <text x="${cx}" y="${cy}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="12">
          Digite palavras com consoantes
        </text>
      `;
    }

    sigilSvgCanvas.innerHTML = svgHtml;
  }

  function updateSigilUI(shouldAnimate = true) {
    const rawWord = sigilInput ? sigilInput.value : "PROSPERIDADE";
    const data = processSigilWord(rawWord);
    currentSigilData = data;

    // Atualizar Decomposição Visual Passo a Passo
    if (sigilStepOrig) {
      sigilStepOrig.textContent = data.original || "—";
    }

    if (sigilStepCons) {
      sigilStepCons.textContent = data.consonants.length > 0 ? data.consonants.join(" ") : "(sem consoantes)";
    }

    if (sigilStepUniq) {
      sigilStepUniq.textContent = data.uniqueConsonants.length > 0 ? data.uniqueConsonants.join(" ") : "(nenhuma)";
    }

    if (sigilStepNums) {
      sigilStepNums.textContent = data.numberSequence.length > 0 ? data.numberSequence.join(" • ") : "—";
    }

    if (sigilLetterMap) {
      if (data.letterMap.length > 0) {
        sigilLetterMap.textContent = data.letterMap.map(m => `${m.letter} (${m.num})`).join(" ➔ ");
      } else {
        sigilLetterMap.textContent = "Digite uma palavra contendo consoantes para iniciar a sequência geométrica.";
      }
    }

    // Atualizar Legenda do Sigilo
    if (sigilCaption) {
      if (data.numberSequence.length > 1) {
        const startNum = data.numberSequence[0];
        const endNum = data.numberSequence[data.numberSequence.length - 1];
        sigilCaption.innerHTML = `<strong>Sigilo Consagrado:</strong> Roda de 9 pontos iniciada no número <strong>${startNum}</strong> e ancorada no número <strong>${endNum}</strong>. (${data.numberSequence.length} traçados de firmeza).`;
      } else if (data.numberSequence.length === 1) {
        sigilCaption.innerHTML = `<strong>Vórtice Concentrado:</strong> Intenção polarizada no número sagrado <strong>${data.numberSequence[0]}</strong>.`;
      } else {
        sigilCaption.innerHTML = `Escreva uma palavra de intenção positiva para traçar a geometria sagrada.`;
      }
    }

    // Renderizar SVG
    renderSigilSvg(data, shouldAnimate);
  }

  // Event Listeners do Criador de Sigilos
  if (sigilInput) {
    sigilInput.addEventListener("input", () => {
      // Remover classe ativa dos presets quando o usuário digita livremente
      if (sigilPresets) {
        sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      }
      updateSigilUI(true);
    });
  }

  if (sigilClearBtn) {
    sigilClearBtn.addEventListener("click", () => {
      if (sigilInput) {
        sigilInput.value = "";
        sigilInput.focus();
      }
      if (sigilPresets) {
        sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      }
      updateSigilUI(false);
    });
  }

  if (sigilPresets) {
    sigilPresets.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-preset]");
      if (!btn) return;
      const val = btn.getAttribute("data-preset");
      if (sigilInput) sigilInput.value = val;

      sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      btn.classList.add("pill--active");

      updateSigilUI(true);
      toast(`Intenção carregada: ${val}`);
    });
  }

  // Controles de Estilo de Linha
  if (btnStyleStraight) {
    btnStyleStraight.addEventListener("click", () => {
      sigilLineStyle = "straight";
      btnStyleStraight.classList.add("pill--active");
      btnStyleCurved?.classList.remove("pill--active");
      updateSigilUI(true);
    });
  }

  if (btnStyleCurved) {
    btnStyleCurved.addEventListener("click", () => {
      sigilLineStyle = "curved";
      btnStyleCurved.classList.add("pill--active");
      btnStyleStraight?.classList.remove("pill--active");
      updateSigilUI(true);
    });
  }

  // Controles de Modo de Visualização (Com Relógio vs Puro)
  if (btnViewComplete) {
    btnViewComplete.addEventListener("click", () => {
      sigilViewMode = "complete";
      btnViewComplete.classList.add("pill--active");
      btnViewPure?.classList.remove("pill--active");
      updateSigilUI(false);
    });
  }

  if (btnViewPure) {
    btnViewPure.addEventListener("click", () => {
      sigilViewMode = "pure";
      btnViewPure.classList.add("pill--active");
      btnViewComplete?.classList.remove("pill--active");
      updateSigilUI(false);
    });
  }

  // Paleta de Cores do Sigilo
  if (sigilColors) {
    sigilColors.addEventListener("click", (e) => {
      const dot = e.target.closest("button[data-color]");
      if (!dot) return;
      sigilActiveColor = dot.getAttribute("data-color");
      sigilColors.querySelectorAll(".color-dot-btn").forEach(d => d.classList.remove("color-dot--active"));
      dot.classList.add("color-dot--active");
      updateSigilUI(false);
    });
  }

  // Ação: Animar Novamente
  if (btnAnimateSigil) {
    btnAnimateSigil.addEventListener("click", () => {
      updateSigilUI(true);
      toast("Traçado sagrado reanimado!");
    });
  }

  // Ação: Copiar Dados do Sigilo
  if (btnCopySigilData) {
    btnCopySigilData.addEventListener("click", () => {
      if (!currentSigilData || currentSigilData.numberSequence.length === 0) {
        toast("Nenhum sigilo ativo para copiar.");
        return;
      }
      const textToCopy = `✨ SIGILO SAGRADO — FOCO VIBRACIONAL\nIntenção: ${currentSigilData.original}\nConsoantes Únicas: ${currentSigilData.uniqueConsonants.join(" - ")}\nSequência na Roda (1-9): ${currentSigilData.numberSequence.join(" • ")}\nInício: Nó no ${currentSigilData.numberSequence[0]} | Término: Barra no ${currentSigilData.numberSequence[currentSigilData.numberSequence.length - 1]}`;
      navigator.clipboard?.writeText(textToCopy).then(() => {
        toast("Dados do sigilo copiados!");
      });
    });
  }

  // Ação: Baixar Sigilo em SVG
  if (btnDownloadSigil) {
    btnDownloadSigil.addEventListener("click", () => {
      if (!sigilSvgCanvas) return;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(sigilSvgCanvas);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const wordSlug = (currentSigilData?.original || "sigilo")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
      downloadLink.href = url;
      downloadLink.download = `sigilo-${wordSlug}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      toast(`Arquivo sigilo-${wordSlug}.svg baixado com sucesso!`);
    });
  }

  // Inicializar renderização inicial do sigilo
  updateSigilUI(true);
}

/* ==========================================================================
   Inicialização Global
   ========================================================================== */

/* ==========================================================================
   Painel "Hoje" (index.html): sugestão de banho/defumação pela lua + dia,
   portal do dia e sequência numérica do dia
   ========================================================================== */
const WEEKDAY_KEYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const OBJETIVO_LABEL = {
  harmonizacao: "harmonização", limpeza: "limpeza", prosperidade: "prosperidade",
  protecao: "proteção", calma: "calma", energia: "energia"
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Itens compatíveis com a lua e o dia de hoje (com recuo gradual se não houver) */
function itemsForToday(list, moonKey, dayKey) {
  const both = list.filter(x => (x.luas || []).includes(moonKey) && (x.dias || []).includes(dayKey));
  if (both.length) return both;
  const byMoon = list.filter(x => (x.luas || []).includes(moonKey));
  return byMoon.length ? byMoon : list;
}

function ritualItemHtml(kind, item, href) {
  if (!item) return "";
  const icon = kind === "banho" ? "🛁" : "💨";
  const cabeca = kind === "banho"
    ? (item.cabeca ? ' • <span style="color:#9fd09a;">pode na cabeça</span>' : ' • <span style="color:#e8a07c;">do pescoço para baixo</span>')
    : "";
  return `
    <a class="item ritual-link" href="${href}#${encodeURIComponent(item.id)}">
      <span class="muted small">${icon} ${kind === "banho" ? "Banho" : "Defumação"} • ${escapeHtml(OBJETIVO_LABEL[item.objetivo] || item.objetivo || "")}${cabeca}</span>
      <b>${escapeHtml(item.nome)}</b>
    </a>`;
}

function initHojePage() {
  const wrap = $("#todaySuggest");
  if (!wrap) return;

  const today = new Date();
  const moon = getLiveMoonData(today);
  const dayKey = WEEKDAY_KEYS[today.getDay()];
  const banhos = itemsForToday(BANHOS, moon.key, dayKey);
  const defs = itemsForToday(DEFUMACOES, moon.key, dayKey);
  let offset = 0;

  const badge = $("#todaySuggestBadge");
  if (badge) badge.textContent = `${moon.icon} ${({ dom: "domingo", seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", sab: "sábado" })[dayKey]}`;

  function render() {
    const b = banhos.length ? banhos[(dailyIndexByDate(today, banhos.length) + offset) % banhos.length] : null;
    const d = defs.length ? defs[(dailyIndexByDate(today, defs.length) + offset) % defs.length] : null;
    wrap.innerHTML = ritualItemHtml("defumacao", d, "defumacao.html") + ritualItemHtml("banho", b, "banhos.html") +
      `<p class="muted small" style="margin:6px 0 0;">${escapeHtml(moon.orientacao || "")}</p>`;
  }
  $("#todaySuggestNext")?.addEventListener("click", () => { offset++; render(); });
  render();

  // Portal do dia
  const pBadge = $("#todayPortalBadge");
  const pText = $("#todayPortalText");
  if (isPortalDay(today)) {
    if (pBadge) pBadge.textContent = "✨ Hoje é portal";
    if (pText) pText.innerHTML = `Hoje é o portal <b>${portalName(today.getMonth() + 1)}</b>. Faça 3 passos: intenção clara, uma ação pequena real e gratidão. <a href="portais.html">Saiba mais →</a>`;
  } else {
    const next = getNextPortals(today, 1)[0];
    if (pBadge) pBadge.textContent = "Próximo portal";
    if (pText && next) pText.innerHTML = `Próximo portal: <b>${formatDateBR(next)}</b>. <a href="portais.html">Ver o mapa de portais →</a>`;
  }

  // Sequência do dia
  const seq = GRABOVOI_SEQS[dailyIndexByDate(today, GRABOVOI_SEQS.length)];
  const seqEl = $("#todaySeq");
  if (seqEl && seq) {
    seqEl.textContent = seq.seq;
    const t = $("#todaySeqTitle");
    if (t) t.textContent = `${seq.titulo} — ${seq.uso}`;
    $("#todaySeqCopy")?.addEventListener("click", () => copyText(seq.seq));
  }
}

/* ==========================================================================
   Oráculo "Como você está se sentindo?" — ritual guiado em 3 passos
   ========================================================================== */
const ORACULO = [
  { id: "cansaco", label: "😮‍💨 Cansaço / peso nas costas", defumacao: ["limpeza"], banho1: ["limpeza", "protecao"], banho2: ["harmonizacao", "calma"], mantra: ["leveza", "energia", "equilíbrio"],
    palavra: "Peso acumulado pede dois tempos: primeiro limpar, depois reconstruir. Nunca deixe o corpo 'aberto' depois de um descarrego." },
  { id: "ansiedade", label: "😟 Ansiedade / insônia", defumacao: ["harmonizacao"], banho1: ["calma"], mantra: ["calma", "paz", "presença"],
    palavra: "Prefira banhos mornos, à noite, e respire 4-2-6 antes de deitar. Folha mansa acalma a cabeça (Ori)." },
  { id: "caminhos", label: "🚪 Caminhos fechados / trabalho travado", defumacao: ["prosperidade"], banho1: ["prosperidade"], mantra: ["prosperidade", "oportunidades", "fluxo"],
    palavra: "Abra caminhos de preferência na lua crescente, e faça uma ação concreta no mesmo dia: o Axé acompanha quem se move." },
  { id: "inveja", label: "🧿 Inveja / olho-gordo", defumacao: ["limpeza", "protecao"], banho1: ["protecao", "limpeza"], banho2: ["harmonizacao"], mantra: ["proteção", "limites", "confiança"],
    palavra: "Corte primeiro, feche o corpo depois. Erva quente (arruda, guiné) sempre do pescoço para baixo." },
  { id: "desanimo", label: "🪫 Desânimo / sem força", defumacao: ["energia", "prosperidade"], banho1: ["energia"], mantra: ["energia", "coragem", "crescimento"],
    palavra: "Sol da manhã, água fresca e um banho de vitalidade. Comece pequeno: uma tarefa de cada vez." },
  { id: "casa", label: "🏠 Casa pesada / brigas", defumacao: ["limpeza", "harmonizacao"], banho1: ["harmonizacao"], mantra: ["paz", "equilíbrio", "comunicação"],
    palavra: "Defume do fundo da casa para a porta da rua, abra as janelas e, depois, ofereça um banho de harmonização a quem mora junto." },
  { id: "tristeza", label: "💧 Tristeza / saudade", defumacao: ["harmonizacao"], banho1: ["calma", "harmonizacao"], mantra: ["gratidão", "paz", "autovalor"],
    palavra: "Acolha o sentimento sem pressa. Banho suave, oração e conversa com quem você confia. Se a tristeza persistir, procure ajuda profissional." },
  { id: "decisao", label: "🎯 Prova, entrevista ou decisão", defumacao: ["energia", "prosperidade"], banho1: ["energia", "prosperidade"], mantra: ["foco", "clareza", "concentração", "confiança"],
    palavra: "Na véspera: banho de clareza, cabeça fresca e sono cedo. No dia: respire, recite o mantra 3 vezes e vá com fé." }
];

function pickByObjectives(list, objetivos, moonKey, seed, extraFilter) {
  let pool = list.filter(x => objetivos.includes(x.objetivo) && (!extraFilter || extraFilter(x)));
  if (!pool.length) pool = list.filter(x => objetivos.includes(x.objetivo));
  const withMoon = pool.filter(x => (x.luas || []).includes(moonKey));
  if (withMoon.length) pool = withMoon;
  return pool.length ? pool[seed % pool.length] : null;
}

function initOraculo() {
  const chips = $("#oracleChips");
  const out = $("#oracleResult");
  if (!chips || !out) return;

  const moon = getLiveMoonData(new Date());
  const base = dailyIndexByDate(new Date(), 997);
  let current = null;
  let variant = 0;

  chips.innerHTML = ORACULO.map(o => `<button class="pill" type="button" data-oraculo="${o.id}">${o.label}</button>`).join("");

  function render() {
    const o = ORACULO.find(x => x.id === current);
    if (!o) return;
    const seed = base + variant;
    const def = pickByObjectives(DEFUMACOES, o.defumacao, moon.key, seed);
    const b1 = pickByObjectives(BANHOS, o.banho1, moon.key, seed, o.banho2 ? (x => x.intensidade !== "suave") : null);
    const b2 = o.banho2 ? pickByObjectives(BANHOS, o.banho2, moon.key, seed, x => x.cabeca === true && x.intensidade === "suave") : null;
    const mantras = DAILY_MANTRAS.filter(m => o.mantra.includes(m.tag));
    const mantra = mantras.length ? mantras[seed % mantras.length] : DAILY_MANTRAS[seed % Math.max(1, DAILY_MANTRAS.length)];

    const steps = [];
    if (def) steps.push({ t: "Limpe o ambiente", html: ritualItemHtml("defumacao", def, "defumacao.html") });
    if (b1) steps.push({ t: o.banho2 ? "1º tempo — descarrego" : "Tome o banho", html: ritualItemHtml("banho", b1, "banhos.html") });
    if (b2) steps.push({ t: "2º tempo — reconstrução (no mesmo dia ou no seguinte)", html: ritualItemHtml("banho", b2, "banhos.html") });
    if (mantra) steps.push({ t: "Firme o pensamento", html: `<div class="item"><span class="muted small">🙏 Mantra • ${escapeHtml(mantra.tag)}</span><b id="oracleMantra">“${escapeHtml(mantra.text)}”</b><div class="row wrap-row" style="margin-top:8px;"><button class="btn-micro" data-copy="#oracleMantra" type="button">📋 Copiar</button><button class="btn-micro" data-speak="#oracleMantra" type="button">🔊 Ouvir</button></div></div>` });

    out.innerHTML = `
      <div class="notice"><strong>Palavra do Juremeiro:</strong> ${escapeHtml(o.palavra)}</div>
      <ol class="oracle-steps">
        ${steps.map(s => `<li><span class="oracle-steps__title">${escapeHtml(s.t)}</span>${s.html}</li>`).join("")}
      </ol>
      <div class="row wrap-row">
        <button class="btn btn--ghost" id="oracleOther" type="button">🔄 Outra combinação</button>
        <span class="muted small">Lua de hoje: ${moon.icon} ${escapeHtml(moon.name)}</span>
      </div>`;
    $("#oracleOther")?.addEventListener("click", () => { variant++; render(); });
  }

  chips.addEventListener("click", e => {
    const btn = e.target.closest("[data-oraculo]");
    if (!btn) return;
    current = btn.getAttribute("data-oraculo");
    variant = 0;
    chips.querySelectorAll(".pill").forEach(p => p.classList.toggle("pill--active", p === btn));
    render();
  });
}

/* ==========================================================================
   Busca global (lupa no cabeçalho, atalho "/")
   Carrega os data/*.js sob demanda para funcionar em qualquer página.
   ========================================================================== */
const SEARCH_PAGES = [
  { t: "Painel Hoje — sugestões do dia", u: "index.html#hoje", k: "hoje dia sugestao lua" },
  { t: "Oráculo — Como você está se sentindo?", u: "index.html#oraculo", k: "oraculo sentimento ansiedade cansaco inveja tristeza ritual" },
  { t: "Ritual da Noite — perguntas ao Universo", u: "mantras.html#noite", k: "noite dormir perguntas universo sono" },
  { t: "Afirmações", u: "mantras.html#afirmacoes", k: "afirmacoes frases" },
  { t: "Técnicas no trabalho", u: "mantras.html#tecnicas", k: "trabalho pausa foco tecnica" },
  { t: "Favoritos", u: "mantras.html#favoritos", k: "favoritos salvos" },
  { t: "Sequências numéricas (Grabovoi)", u: "portais.html#grabovoi", k: "grabovoi numeros sequencia" },
  { t: "Portais numéricos", u: "portais.html", k: "portal 11/11 datas" },
  { t: "Calendário Lunar — fases e o que fazer", u: "calendario.html#fases", k: "lua fases nova crescente cheia minguante calendario" },
  { t: "Colheita & Secagem", u: "colheita.html", k: "colheita colher secar chuva" },
  { t: "Símbolos — Pemba e ponto riscado", u: "simbolos.html", k: "pemba ponto riscado simbolos" },
  { t: "Runas (Elder Futhark)", u: "simbolos.html", k: "runas futhark oraculo" },
  { t: "Sigilos & Roda dos Números", u: "simbolos.html", k: "sigilo roda numeros pitagorica" },
  { t: "Glossário", u: "glossario.html", k: "glossario termos ori firmeza descarrego" },
  { t: "Tarot & Baralho Cigano — cartas e significados", u: "tarot.html", k: "tarot cigano cartas arcanos baralho lenormand" }
];

function loadDataScript(name) {
  if (window.FV_DATA && Array.isArray(window.FV_DATA[name])) return Promise.resolve();
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = `./data/${name}.js`;
    s.onload = s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

async function ensureAllData() {
  await Promise.all(["ervas", "banhos", "defumacoes", "mantras", "tarot"].map(loadDataScript));
  if (!ERVAS.length) loadErvas();
  if (!BANHOS.length) loadBanhos();
  if (!DEFUMACOES.length) loadDefumacoes();
  if (!DAILY_MANTRAS.length) loadMantras();
}

function initGlobalSearch() {
  const btn = $("#globalSearchBtn");
  if (!btn) return;

  const overlay = document.createElement("div");
  overlay.className = "gsearch";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="gsearch__panel" role="dialog" aria-modal="true" aria-label="Buscar no site">
      <div class="gsearch__bar">
        <input class="input gsearch__input" type="search" placeholder="Buscar ervas, banhos, defumações, mantras…" autocomplete="off" />
        <button class="btn btn--ghost gsearch__close" type="button" aria-label="Fechar busca">Esc</button>
      </div>
      <div class="gsearch__results" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector(".gsearch__input");
  const results = overlay.querySelector(".gsearch__results");
  let ready = false;

  function group(title, items) {
    if (!items.length) return "";
    return `<div class="gsearch__group"><div class="gsearch__title">${title} <span class="muted">(${items.length})</span></div>${items.slice(0, 8).join("")}</div>`;
  }
  const row = (href, title, sub) =>
    `<a class="gsearch__item" href="${href}"><b>${escapeHtml(title)}</b>${sub ? `<span class="muted small">${escapeHtml(sub)}</span>` : ""}</a>`;

  function run() {
    const q = normalizeSpiritualSearch(input.value);
    if (q.length < 2) {
      results.innerHTML = `<p class="muted small" style="padding:8px 4px;">Digite pelo menos 2 letras. Dica: tecle <b>/</b> em qualquer página para abrir a busca.</p>`;
      return;
    }
    const has = (...parts) => normalizeSpiritualSearch(parts.join(" ")).includes(q);
    const html =
      group("🌿 Ervas", ERVAS.filter(e => has(e.nome, e.nomePopular, (e.objetivos || []).join(" "), e.descricao))
        .map(e => row(`plantas.html#${encodeURIComponent(e.id)}`, e.nome, e.nomePopular))) +
      group("🛁 Banhos", BANHOS.filter(b => has(b.nome, (b.ervas || []).join(" "), b.objetivo, b.observacao))
        .map(b => row(`banhos.html#${encodeURIComponent(b.id)}`, b.nome, (b.ervas || []).slice(0, 4).join(" + ")))) +
      group("💨 Defumações", DEFUMACOES.filter(d => has(d.nome, (d.ervas || []).join(" "), d.objetivo, d.servePara))
        .map(d => row(`defumacao.html#${encodeURIComponent(d.id)}`, d.nome, (d.ervas || []).slice(0, 4).join(" + ")))) +
      group("🙏 Mantras", DAILY_MANTRAS.filter(m => has(m.text, m.tag))
        .map(m => row("mantras.html#mantras", `“${m.text}”`, m.tag))) +
      group("🃏 Tarot & Cigano", ((window.FV_DATA && window.FV_DATA.tarot) || []).filter(c => has(c.nome, (c.palavrasChave || []).join(" "), c.significado || "", c.correspondencia || ""))
        .map(c => row(`tarot.html#${encodeURIComponent(c.id)}`, c.nome, c.baralho === "cigano" ? `Baralho Cigano • ${c.correspondencia || ""}` : (c.arcano === "maior" ? "Arcano Maior" : `Arcano Menor • ${(NAIPES.find(n => n.k === c.naipe) || {}).label || ""}`)))) +
      group("📄 Páginas", SEARCH_PAGES.filter(p => has(p.t, p.k)).map(p => row(p.u, p.t, "")));
    results.innerHTML = html || `<p class="muted small" style="padding:8px 4px;">Nada encontrado para “${escapeHtml(input.value)}”.</p>`;
  }

  async function open() {
    overlay.hidden = false;
    document.body.classList.add("gsearch-open");
    input.focus();
    if (!ready) { results.innerHTML = `<p class="muted small" style="padding:8px 4px;">Carregando…</p>`; await ensureAllData(); ready = true; }
    run();
  }
  function close() {
    overlay.hidden = true;
    document.body.classList.remove("gsearch-open");
  }

  btn.addEventListener("click", open);
  $all("[data-open-search]").forEach(b => b.addEventListener("click", open));

  // Setas ↑ ↓ percorrem os resultados; Enter abre
  overlay.addEventListener("keydown", e => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [...results.querySelectorAll(".gsearch__item")];
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i <= 0 ? -1 : i - 1);
    if (next === -1) input.focus(); else items[next].focus();
  });
  overlay.querySelector(".gsearch__close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  results.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    // mesmo documento: o hashchange cuida do destaque; só fecha o painel
    close();
  });
  input.addEventListener("input", run);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !overlay.hidden) close();
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "") || document.activeElement?.isContentEditable;
    if (e.key === "/" && !typing && overlay.hidden) { e.preventDefault(); open(); }
  });
}

/* Índice "Nesta página" (headings com data-toc) e botão "voltar ao topo" */
function initPageToc() {
  const nav = $("[data-toc-nav]");
  if (!nav) return;
  const heads = $all("h2[data-toc]");
  if (!heads.length) { nav.remove(); return; }
  nav.innerHTML = heads.map((h, i) => {
    const target = h.closest("section, article") || h;
    if (!target.id) target.id = "sec-" + (i + 1);
    return `<a class="pill" href="#${target.id}">${escapeHtml(h.getAttribute("data-toc"))}</a>`;
  }).join("");
}

function initBackToTop() {
  if (document.body.scrollHeight < window.innerHeight * 2.5) return;
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Voltar ao topo");
  btn.textContent = "↑";
  btn.hidden = true;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => { btn.hidden = window.scrollY < 900; }, { passive: true });
}

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
    const waxing = moon.age < SYNODIC_DAYS / 2;
    shadow.style.transform = `translateX(${(waxing ? -1 : 1) * Math.min(100, moon.illum)}%)`;
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

document.addEventListener("DOMContentLoaded", async () => {
  // Renderizar Cabeçalho e Rodapé únicos
  renderHeader();
  renderFooter();
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
    loadDefumacoes()
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
  initBanhosPage();
  initDefumacaoPage();
  initColheitaPage();
  initCalendarioLunar();
  initCadernoFirmeza();
  initFirmezaPage();
  initPortaisPage();
  initSimbolosPage();
  initHomeHero();
  initHojePage();
  initOraculo();
  initPageToc();
  // após renderizar tudo, para medir a altura real da página
  initBackToTop();
});

/* PWA: registra o service worker (só funciona em http/https, não em file://) */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
