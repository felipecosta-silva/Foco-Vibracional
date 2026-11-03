/* Foco Vibracional • nucleo.js
   Base: navegação (NAV), ícones, utilitários, dados, favoritos, modo e eventos globais.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

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
let PONTOS = [];

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
      { label: "Comece aqui", url: "comece.html" },
      { label: "Fundamentos da Jurema", url: "jurema.html" },
      { label: "Tarot & Cigano", url: "tarot.html" },
      { label: "Pontos Cantados", url: "pontos.html" },
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

  const main = document.querySelector("main");
  if (main && !main.id) main.id = "conteudo";
  if (main) main.setAttribute("tabindex", "-1");

  container.innerHTML = `
    <a class="skip-link" href="#${main ? main.id : "conteudo"}">Pular para o conteúdo</a>
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
        <button class="page-btn page-btn--nav u-fs-82 u-h-32" type="button" id="btnToggleAllPages">
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
          if (p === 2) html += `<span class="u-muted u-px-4">…</span>`;
          continue;
        }
        if (p < totalPages && p > currentPage + 1 && p !== totalPages) {
          if (p === totalPages - 1) html += `<span class="u-muted u-px-4">…</span>`;
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
  // Dia do calendário local (no Brasil, contar em UTC trocaria o "de hoje" às 21h)
  const seed = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return ((seed % length) + length) % length;
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function feedbackCopyBtn(btn) {
  if (!btn || btn.dataset.copying) return;
  btn.dataset.copying = "1";
  const origHtml = btn.innerHTML;
  btn.innerHTML = "✓ Copiado";
  btn.classList.add("btn--copied");
  setTimeout(() => {
    btn.innerHTML = origHtml;
    btn.classList.remove("btn--copied");
    delete btn.dataset.copying;
  }, 1500);
}

async function copyText(text, triggerEl) {
  if (triggerEl) feedbackCopyBtn(triggerEl);
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
  el.setAttribute("role", "status");
  document.body.appendChild(el);
  // O texto entra depois da região viva existir, para o leitor de tela anunciar
  requestAnimationFrame(() => { el.textContent = message; });
  setTimeout(() => {
    el.classList.add("toast-notification--out");
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

function loadPontos() {
  if (window.FV_DATA && Array.isArray(window.FV_DATA.pontos) && window.FV_DATA.pontos.length) {
    PONTOS = window.FV_DATA.pontos;
  } else {
    PONTOS = [];
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
        copyText(text, t);
      }
      return;
    }

    // COPY por texto direto
    const copyDirect = t.getAttribute("data-copy-text");
    if (copyDirect) {
      copyText(copyDirect, t);
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

