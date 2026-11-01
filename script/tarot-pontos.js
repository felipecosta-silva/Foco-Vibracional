/* Foco Vibracional • tarot-pontos.js
   Tarot, baralho cigano e pontos cantados.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

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
      ${c.amor ? `<div class="fact u-span-all"><span>❤️ Amor</span><b>${escapeHtml(c.amor)}</b></div>` : ""}
      ${c.trabalho ? `<div class="fact u-span-all"><span>💼 Trabalho</span><b>${escapeHtml(c.trabalho)}</b></div>` : ""}
    </div>
    ${c.conselho ? `<div class="dsec dsec--tea u-mt-14"><h3>✨ Conselho</h3><p>${escapeHtml(c.conselho)}</p></div>` : ""}
    <p class="muted small u-mt-18">O baralho é uma ferramenta de reflexão e autoconhecimento, não uma sentença sobre o futuro.</p>`;
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
          <h3 class="u-m0 u-mt-2 u-font-display">Passado • Presente • Conselho</h3>
        </div>
        <button class="btn btn--ghost small" type="button" id="btnResortearSpread">Sortear Novamente 🔀</button>
      </div>
      <div class="tspread__grid">
        <div class="tspread__slot">
          <span class="tspread__pos">1. Passado / Raízes</span>
          <button class="tcard u-w100" type="button" data-open-card="${escapeHtml(cPassado.id)}">
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
          <button class="tcard u-w100" type="button" data-open-card="${escapeHtml(cPresente.id)}">
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
          <button class="tcard u-w100" type="button" data-open-card="${escapeHtml(cConselho.id)}">
            <span class="tcard__face">${tarotFaceHtml(cConselho)}</span>
            <span class="tcard__body">
              <b class="tcard__title">${escapeHtml(cConselho.nome)}</b>
              <span class="tcard__sub">${cConselho.baralho === "cigano" ? (cConselho.correspondencia || "") : (cConselho.arcano === "maior" ? "Arcano Maior" : (NAIPES.find(n => n.k === cConselho.naipe) || {}).label || "")}</span>
            </span>
          </button>
          <p class="tspread__advice"><b>O conselho:</b> ${escapeHtml(cConselho.conselho)}</p>
        </div>
      </div>
      <p class="muted small u-center u-mt-16">
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
   PONTOS CANTADOS & CURIMBA (pontos.html) — Hinário e Cantigas Tradicionais
   ========================================================================== */
const LINHAS_PONTOS = [
  { k: "mestres", label: "Mestres da Jurema", icon: "🌿" },
  { k: "mestras", label: "Mestras da Jurema", icon: "🌹" },
  { k: "caboclos", label: "Caboclos", icon: "🏹" },
  { k: "pretos-velhos", label: "Pretos Velhos", icon: "☕" },
  { k: "baianos", label: "Baianos", icon: "🥥" },
  { k: "boiadeiros", label: "Boiadeiros", icon: "🪢" },
  { k: "marinheiros", label: "Marinheiros", icon: "⚓" },
  { k: "ciganos", label: "Povo Cigano", icon: "🎴" },
  { k: "guardioes", label: "Guardiões", icon: "🔥" },
  { k: "orixas", label: "Orixás", icon: "👑" },
  { k: "eres", label: "Erês & Crianças", icon: "🍬" },
  { k: "gira", label: "Abertura & Defumação", icon: "🕯️" }
];

const TIPOS_PONTOS = [
  { k: "chamada", label: "Chamada" },
  { k: "firmeza", label: "Firmeza" },
  { k: "cura", label: "Cura" },
  { k: "descarrego", label: "Descarrego" },
  { k: "defumacao", label: "Defumação" },
  { k: "bencao", label: "Bênção" },
  { k: "louvacao", label: "Louvação" },
  { k: "despedida", label: "Despedida" }
];

function linhaBadgeClass(linha) {
  switch (linha) {
    case "mestres": return "badge--jurema";
    case "mestras": return "badge--mestras";
    case "caboclos": return "badge--caboclo";
    case "pretos-velhos": return "badge--almas";
    case "baianos": return "badge--baiano";
    case "boiadeiros": return "badge--boiadeiro";
    case "marinheiros": return "badge--mar";
    case "ciganos": return "badge--cigano";
    case "guardioes": return "badge--guardiao";
    default: return "";
  }
}

function pontoCardHtml(p) {
  const badgeCls = linhaBadgeClass(p.linha);
  const firstLines = p.letra.split("\n\n")[0].split("\n").slice(0, 2).join(" / ");
  return `
    <button class="pcard" type="button" data-open="${escapeHtml(p.id)}">
      <span class="pcard__head">
        <span class="badge ${badgeCls}">${escapeHtml(p.linhaNome)}</span>
        <span class="pcard__toque">🥁 ${escapeHtml(p.toque)}</span>
      </span>
      ${p.origem === "composto" ? `<span class="badge badge--composto">Louvação composta</span>` : ""}
      ${p.linha === "guardioes" ? `<span class="badge-danger">Só com orientação de um(a) zelador(a)</span>` : ""}
      <h3 class="pcard__title">${escapeHtml(p.titulo)}</h3>
      <p class="pcard__entidade">✦ ${escapeHtml(p.entidade)}</p>
      <p class="pcard__preview">“${escapeHtml(firstLines)}…”</p>
      <span class="pcard__foot">
        <span class="pcard__saudacao">${escapeHtml(p.saudacao || p.tipo)}</span>
        <span class="pcard__action">Ver cantiga →</span>
      </span>
    </button>`;
}

/* Link para escutar o ponto: usa p.youtube (vídeo conferido) ou, na falta, uma busca no YouTube
   pelo primeiro verso + entidade (ou p.youtubeBusca, quando definido). */
function pontoYoutubeUrl(p) {
  if (p.youtube) return p.youtube;
  const firstVerse = String(p.letra || "").split("\n")[0].replace(/[!,.;:…]+$/g, "");
  const termo = p.youtubeBusca || `ponto ${p.entidade || ""} ${firstVerse}`;
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(termo.trim());
}

function pontoDetailHtml(p) {
  const badgeCls = linhaBadgeClass(p.linha);
  const letraId = "letra_" + p.id.replace(/[^a-z0-9_-]/gi, "");
  const ervasLinks = (p.ervasAssociadas || []).map(linkHerb).join(" · ");
  return `
    <div class="ponto-detail">
      <div class="ponto-detail__top">
        <span class="badge ${badgeCls}">${escapeHtml(p.linhaNome)}</span>
        <span class="badge">🥁 ${escapeHtml(p.toque)}</span>
        <span class="badge badge--tea">Ponto de ${escapeHtml(p.tipo)}</span>
        ${p.linha === "guardioes" ? `<span class="badge-danger">Só com orientação de um(a) zelador(a)</span>` : ""}
      </div>
      <h2 class="drawer__title">${escapeHtml(p.titulo)}</h2>
      <p class="pcard__entidade">Falange / Entidade: <strong>${escapeHtml(p.entidade)}</strong></p>
      ${p.saudacao ? `<div class="ponto-saudacao-banner">“${escapeHtml(p.saudacao)}”</div>` : ""}

      <div class="dsec">
        <div class="ponto-letra-header">
          <h3>${p.origem === "composto" ? "Louvação composta para o site" : "Letra tradicional"}</h3>
          <span class="muted small">${escapeHtml(p.toque)}</span>
        </div>
        ${p.origem === "composto" ? `<p class="ponto-aviso">Esta letra <strong>não é ponto de raiz</strong>: foi composta para o site, para estudo e louvação. ${p.guiaDaCasa ? "Ela será trocada pelo ponto que se canta no terreiro." : ""} Na gira, cante os pontos ensinados pela curimba da sua casa.</p>` : ""}
        <div class="ponto-letra-card">
          <blockquote class="ponto-letra" id="${letraId}">“${escapeHtml(p.letra)}”</blockquote>
        </div>
        <div class="row wrap-row ponto-acoes">
          <button class="btn btn--ghost" data-copy="#${letraId}" type="button">📋 Copiar letra</button>
          <button class="btn btn--ghost" data-speak="#${letraId}" type="button">🔊 Ouvir letra</button>
          ${p.origem === "composto" ? "" : `<a class="btn" href="${escapeHtml(pontoYoutubeUrl(p))}" target="_blank" rel="noopener noreferrer" title="Abre o YouTube em nova aba">▶️ Escutar no YouTube</a>`}
        </div>
        ${p.nota ? `<p class="muted small ponto-acoes">📝 ${escapeHtml(p.nota)}</p>` : ""}
      </div>

      <div class="dsec">
        <h3>Significado &amp; Fundamento</h3>
        <p>${escapeHtml(p.significado || "")}</p>
      </div>

      ${ervasLinks ? `
        <div class="dsec">
          <h3>Ervas &amp; Fumaças Associadas</h3>
          <p class="ponto-detail__herbs">🌿 ${ervasLinks}</p>
        </div>
      ` : ""}

      ${p.pontoRiscadoDescricao ? `
        <div class="dsec">
          <h3>Conexão com Ponto Riscado</h3>
          <p class="muted">${escapeHtml(p.pontoRiscadoDescricao)}</p>
          <a class="btn btn--ghost" href="simbolos.html">Ver fundamentos de pontos riscados →</a>
        </div>
      ` : ""}
    </div>`;
}

function initPontosPage() {
  const mount = $("#catalog[data-catalog='pontos']");
  if (!mount) return;
  loadPontos();

  createCatalog({
    mount,
    items: PONTOS,
    perPage: 24,
    unit: ["ponto", "pontos"],
    eyebrow: "Ponto Cantado",
    placeholder: "Buscar ponto por letra, entidade, toque ou linha…",
    searchText: p => `${p.titulo} ${p.entidade} ${p.linhaNome} ${p.toque} ${p.saudacao || ""} ${p.letra} ${p.significado || ""} ${(p.ervasAssociadas || []).join(" ")}`,
    filters: [
      {
        key: "linha",
        label: "Linha",
        options: LINHAS_PONTOS.map(l => ({ k: l.k, label: l.label, icon: l.icon })),
        test: (p, v) => p.linha === v
      },
      {
        key: "tipo",
        label: "Tipo",
        options: TIPOS_PONTOS.map(t => ({ k: t.k, label: t.label })),
        test: (p, v) => p.tipo === v
      }
    ],
    renderCard: pontoCardHtml,
    detail: pontoDetailHtml
  });

  // Trilho de Destaque da Jurema Sagrada
  const juremaRail = $("#pontosJuremaRail");
  if (juremaRail && PONTOS.length) {
    const juremaList = PONTOS.filter(p => p.linha === "mestres" || p.linha === "mestras");
    juremaRail.innerHTML = juremaList.slice(0, 10).map(pontoCardHtml).join("");
    juremaRail.addEventListener("click", e => {
      const card = e.target.closest("[data-open]");
      if (card) {
        location.hash = `#${encodeURIComponent(card.dataset.open)}`;
      }
    });
    initRailsNavigation();
  }
}

