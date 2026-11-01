/* Foco Vibracional • busca.js
   Busca global (lupa do cabeçalho e atalho /).
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

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
  { t: "Comece aqui — primeiros passos", u: "comece.html", k: "comece comecar iniciante primeiros passos trilha inicio" },
  { t: "Glossário", u: "glossario.html", k: "glossario termos ori firmeza descarrego" },
  { t: "Como fazer um pedido bem feito", u: "firmeza.html#pedido-bem-feito", k: "pedido bem feito firmeza intencao prosperidade amor saude checklist" },
  { t: "Mapa do benzimento com ervas", u: "plantas.html#mapa-ervas", k: "mapa benzimento proverbio arruda guine espada porta corte blindar" },
  { t: "Tarot & Baralho Cigano — cartas e significados", u: "tarot.html", k: "tarot cigano cartas arcanos baralho lenormand" },
  { t: "Pontos Cantados & Curimba — cantigas tradicionais", u: "pontos.html", k: "pontos cantados curimba toques jurema mestres mestras caboclos pretos velhos atabaque" }
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
  await Promise.all(["ervas", "banhos", "defumacoes", "mantras", "tarot", "pontos"].map(loadDataScript));
  if (!ERVAS.length) loadErvas();
  if (!BANHOS.length) loadBanhos();
  if (!DEFUMACOES.length) loadDefumacoes();
  if (!DAILY_MANTRAS.length) loadMantras();
  if (!PONTOS.length) loadPontos();
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
        <input class="input gsearch__input" type="search" placeholder="Buscar ervas, banhos, defumações, mantras…" aria-label="Buscar no site" autocomplete="off" enterkeyhint="search" />
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
      results.innerHTML = `<p class="muted small u-pad-8-4">Digite pelo menos 2 letras. Dica: tecle <b>/</b> em qualquer página para abrir a busca.</p>`;
      return;
    }
    const has = (...parts) => normalizeSpiritualSearch(parts.join(" ")).includes(q);
    const html =
      group("🌿 Ervas", ERVAS.filter(e => has(e.nome, e.nomePopular, (e.objetivos || []).join(" "), e.descricao))
        .map(e => row(`plantas.html#${encodeURIComponent(e.id)}`, e.nome, e.nomePopular))) +
      group("🛁 Banhos", BANHOS.filter(b => has(b.nome, (b.ervas || []).join(" "), b.objetivo, b.observacao))
        .map(b => row(`banhos.html#${encodeURIComponent(b.id)}`, b.nome, (b.ervas || []).slice(0, 4).join(" + ")))) +
      group("💨 Defumações", DEFUMACOES.filter(d => has(d.nome, (d.ervas || []).join(" "), d.objetivo, d.servePara, (d.pedidos || []).map(p => `${p.caminho} ${p.exemplo}`).join(" ")))
        .map(d => row(`defumacao.html#${encodeURIComponent(d.id)}`, d.nome, (d.ervas || []).slice(0, 4).join(" + ")))) +
      group("🙏 Mantras", DAILY_MANTRAS.filter(m => has(m.text, m.tag))
        .map(m => row("mantras.html#mantras", `“${m.text}”`, m.tag))) +
      group("🃏 Tarot & Cigano", ((window.FV_DATA && window.FV_DATA.tarot) || []).filter(c => has(c.nome, (c.palavrasChave || []).join(" "), c.significado || "", c.correspondencia || ""))
        .map(c => row(`tarot.html#${encodeURIComponent(c.id)}`, c.nome, c.baralho === "cigano" ? `Baralho Cigano • ${c.correspondencia || ""}` : (c.arcano === "maior" ? "Arcano Maior" : `Arcano Menor • ${(NAIPES.find(n => n.k === c.naipe) || {}).label || ""}`)))) +
      group("🥁 Pontos Cantados", PONTOS.filter(p => has(p.titulo, p.linhaNome, p.entidade, p.toque, p.saudacao, p.letra, p.significado))
        .map(p => row(`pontos.html#${encodeURIComponent(p.id)}`, `${p.titulo} • ${p.entidade}`, `${p.linhaNome} (${p.toque})`))) +
      group("📄 Páginas", SEARCH_PAGES.filter(p => has(p.t, p.k)).map(p => row(p.u, p.t, "")));
    results.innerHTML = html || `<p class="muted small u-pad-8-4">Nada encontrado para “${escapeHtml(input.value)}”.</p>`;
  }

  let lastFocus = null;
  async function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("gsearch-open");
    input.focus();
    if (!ready) { results.innerHTML = `<p class="muted small u-pad-8-4">Carregando…</p>`; await ensureAllData(); ready = true; }
    run();
  }
  function close() {
    overlay.hidden = true;
    document.body.classList.remove("gsearch-open");
    lastFocus?.focus?.({ preventScroll: true });
  }

  btn.addEventListener("click", open);
  $all("[data-open-search]").forEach(b => b.addEventListener("click", open));

  // Setas ↑ ↓ percorrem os resultados; Enter abre
  overlay.addEventListener("keydown", e => {
    if (e.key === "Tab") trapFocus(e, overlay.querySelector(".gsearch__panel"));
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

