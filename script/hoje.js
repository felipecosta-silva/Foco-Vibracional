/* Foco Vibracional • hoje.js
   Painel Hoje e oráculo "Como você está se sentindo?".
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Inicialização Global
   ========================================================================== */

/* ==========================================================================
   Painel "Hoje" (index.html): sugestão de banho/defumação pela lua + dia,
   portal do dia e sequência numérica do dia
   ========================================================================== */
const WEEKDAY_KEYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const OBJETIVO_LABEL = {
  descarrego: "descarrego", harmonizacao: "harmonização", limpeza: "limpeza", prosperidade: "prosperidade",
  protecao: "proteção", calma: "calma", energia: "energia"
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Itens compatíveis com a lua e o dia de hoje (com recuo gradual se não houver) */
/* Constituição II.0: o que o site sugere sozinho (Hoje, oráculo, faixa da capa)
   nunca traz prática forte nem de esquerda. Elas continuam no catálogo, com seus avisos. */
function isSuggestible(item) {
  return !!item && item.intensidade !== "forte" && !isEsquerda(item);
}

function itemsForToday(all, moonKey, dayKey) {
  const list = all.filter(isSuggestible);
  const both = list.filter(x => (x.luas || []).includes(moonKey) && (x.dias || []).includes(dayKey));
  if (both.length) return both;
  const byMoon = list.filter(x => (x.luas || []).includes(moonKey));
  return byMoon.length ? byMoon : list;
}

function ritualItemHtml(kind, item, href) {
  if (!item) return "";
  const icon = kind === "banho" ? "🛁" : "💨";
  const cabeca = kind === "banho"
    ? (item.cabeca ? ' • <span class="tone-leaf tone-text">pode na cabeça</span>' : ' • <span class="tone-clay tone-text">do pescoço para baixo</span>')
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
      `<p class="muted small u-m0 u-mt-6">${escapeHtml(moon.orientacao || "")}</p>`;
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
    $("#todaySeqCopy")?.addEventListener("click", e => copyText(seq.seq, e.currentTarget));
  }
}

/* ==========================================================================
   Oráculo "Como você está se sentindo?" — ritual guiado em 3 passos
   ========================================================================== */
const ICONS_ORACULO = {
  cansaco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 13h2M14 13h2"/></svg>',
  ansiedade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l3-6 4 12 3-9 2 5 3-2h4"/></svg>',
  caminhos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M14 11h.01"/></svg>',
  inveja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  desanimo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/><line x1="6" x2="6" y1="11" y2="13"/><line x1="10" x2="10" y1="11" y2="13"/></svg>',
  casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  tristeza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7l5.6 5.6a8 8 0 1 1-11.3 0z"/></svg>',
  decisao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
};

const ORACULO = [
  { id: "cansaco", label: "Cansaço / peso nas costas", icon: ICONS_ORACULO.cansaco, defumacao: ["limpeza"], banho1: ["descarrego", "limpeza", "protecao"], banho2: ["harmonizacao", "calma"], mantra: ["leveza", "energia", "equilíbrio"],
    palavra: "Peso acumulado pede dois tempos: primeiro descarregar ou purificar, depois reconstruir. Nunca deixe o corpo 'aberto' depois de um descarrego." },
  { id: "ansiedade", label: "Ansiedade / insônia", icon: ICONS_ORACULO.ansiedade, defumacao: ["harmonizacao"], banho1: ["calma"], mantra: ["calma", "paz", "presença"],
    palavra: "Prefira banhos mornos, à noite, e respire 4-2-6 antes de deitar. Folha mansa acalma a cabeça (Ori)." },
  { id: "caminhos", label: "Caminhos fechados / trabalho travado", icon: ICONS_ORACULO.caminhos, defumacao: ["prosperidade"], banho1: ["prosperidade"], mantra: ["prosperidade", "oportunidades", "fluxo"],
    palavra: "Abra caminhos de preferência na lua crescente, e faça uma ação concreta no mesmo dia: o Axé acompanha quem se move." },
  { id: "inveja", label: "Inveja / olho-gordo", icon: ICONS_ORACULO.inveja, defumacao: ["limpeza", "protecao"], banho1: ["descarrego", "protecao", "limpeza"], banho2: ["harmonizacao"], mantra: ["proteção", "limites", "confiança"],
    palavra: "Corte primeiro, feche o corpo depois. Erva quente (arruda, guiné) sempre do pescoço para baixo." },
  { id: "desanimo", label: "Desânimo / sem força", icon: ICONS_ORACULO.desanimo, defumacao: ["energia", "prosperidade"], banho1: ["energia"], mantra: ["energia", "coragem", "crescimento"],
    palavra: "Sol da manhã, água fresca e um banho de vitalidade. Comece pequeno: uma tarefa de cada vez." },
  { id: "casa", label: "Casa pesada / brigas", icon: ICONS_ORACULO.casa, defumacao: ["limpeza", "harmonizacao"], banho1: ["harmonizacao"], mantra: ["paz", "equilíbrio", "comunicação"],
    palavra: "Defume do fundo da casa para a porta da rua, abra as janelas e, depois, ofereça um banho de harmonização a quem mora junto." },
  { id: "tristeza", label: "Tristeza / saudade", icon: ICONS_ORACULO.tristeza, defumacao: ["harmonizacao"], banho1: ["calma", "harmonizacao"], mantra: ["gratidão", "paz", "autovalor"],
    palavra: "Acolha o sentimento sem pressa. Banho suave, oração e conversa com quem você confia. Se a tristeza persistir, procure ajuda profissional." },
  { id: "decisao", label: "Prova, entrevista ou decisão", icon: ICONS_ORACULO.decisao, defumacao: ["energia", "prosperidade"], banho1: ["energia", "prosperidade"], mantra: ["foco", "clareza", "concentração", "confiança"],
    palavra: "Na véspera: banho de clareza, cabeça fresca e sono cedo. No dia: respire, recite o mantra 3 vezes e vá com fé." }
];

function pickByObjectives(list, objetivos, moonKey, seed, extraFilter) {
  const safe = list.filter(isSuggestible);
  let pool = safe.filter(x => objetivos.includes(x.objetivo) && (!extraFilter || extraFilter(x)));
  if (!pool.length) pool = safe.filter(x => objetivos.includes(x.objetivo));
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

  chips.innerHTML = ORACULO.map(o => `<button class="pill" type="button" data-oraculo="${o.id}">${o.icon} <span>${escapeHtml(o.label)}</span></button>`).join("");

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
    if (mantra) steps.push({ t: "Firme o pensamento", html: `<div class="item"><span class="muted small">🙏 Mantra • ${escapeHtml(mantra.tag)}</span><b id="oracleMantra">“${escapeHtml(mantra.text)}”</b><div class="row wrap-row u-mt-8"><button class="btn-micro" data-copy="#oracleMantra" type="button">📋 Copiar</button><button class="btn-micro" data-speak="#oracleMantra" type="button">🔊 Ouvir</button></div></div>` });

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

