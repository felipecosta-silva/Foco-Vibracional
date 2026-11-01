/* Foco Vibracional • catalogo.js
   Catálogo unificado (banhos, defumações, ervas), painel de detalhes e ligações cruzadas.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

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
const OBJ_ICONS = {
  descarrego: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  limpeza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m19 5-8 8"/><path d="m14 14-6 6a2 2 0 0 1-2.8-2.8l6-6"/><path d="M17 3l4 4"/></svg>',
  protecao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  calma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7l5.6 5.6a8 8 0 1 1-11.3 0z"/><path d="M12 12a3 3 0 0 0-3 3"/></svg>',
  energia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>',
  prosperidade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M9 9.5c.6-.9 1.6-1.5 3-1.5 1.7 0 3 .9 3 2s-1 1.7-2.5 2c-1.5.3-2.5 1-2.5 2s1.3 2 3 2c1.4 0 2.4-.6 3-1.5"/></svg>',
  harmonizacao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
};

const MOON_ICONS = {
  nova: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5" stroke-dasharray="3 2"/></svg>',
  crescente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17" fill="currentColor"/></svg>',
  cheia: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/></svg>',
  minguante: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17" fill="currentColor"/></svg>'
};

const OBJETIVOS = [
  { k: "descarrego", label: "Descarrego", icon: OBJ_ICONS.descarrego },
  { k: "limpeza", label: "Limpeza", icon: OBJ_ICONS.limpeza },
  { k: "harmonizacao", label: "Harmonização", icon: OBJ_ICONS.harmonizacao },
  { k: "protecao", label: "Proteção", icon: OBJ_ICONS.protecao },
  { k: "calma", label: "Calma", icon: OBJ_ICONS.calma },
  { k: "energia", label: "Energia", icon: OBJ_ICONS.energia },
  { k: "prosperidade", label: "Prosperidade", icon: OBJ_ICONS.prosperidade }
];
const LUAS = [
  { k: "nova", label: "Nova", icon: MOON_ICONS.nova },
  { k: "crescente", label: "Crescente", icon: MOON_ICONS.crescente },
  { k: "cheia", label: "Cheia", icon: MOON_ICONS.cheia },
  { k: "minguante", label: "Minguante", icon: MOON_ICONS.minguante }
];
const ENERGIAS = [
  { k: "frias", label: "Frias (paz)", c: "var(--c-calma)" },
  { k: "equilibradoras", label: "Equilibradoras", c: "var(--c-harmonizacao)" },
  { k: "quentes", label: "Quentes (força)", c: "var(--c-protecao)" }
];
const INTENSIDADE_NIVEL = { suave: 1, media: 2, forte: 3 };
const INTENSIDADE_LABEL = { suave: "Suave", media: "Média", forte: "Forte" };
const DIAS_LABEL = { dom: "Dom", seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb" };

const objInfo = k => OBJETIVOS.find(o => o.k === k) || { k, label: k ? k[0].toUpperCase() + k.slice(1) : "—", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5 12 2"/></svg>' };

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
  let alertBadge = "";
  if (kind === "banho") {
    if (it.cabeca) {
      foot = `<span class="ori ori--yes">✓ Pode na cabeça</span>`;
    } else {
      foot = `<span class="ori ori--no">⚠️ Pescoço p/ baixo</span>`;
      alertBadge = `<span class="rcard-alert-icon" data-quick-alert="${escapeHtml(it.id)}" title="Toque para ver os cuidados deste banho" aria-hidden="true">⚠️</span>`;
    }
  } else {
    const s = sentidoCurto(it.sentido);
    foot = s ? `<span class="badge">${s}</span>` : "";
  }
  return `
    <button class="rcard" type="button" data-open="${escapeHtml(it.id)}" style="--c:var(--c-${o.k})">
      <span class="rcard__top">
        <span class="rcard__kind">${o.icon} ${o.label}</span>
        <span class="rcard__top-right">
          ${alertBadge}
          ${intensityHtml(it.intensidade)}
        </span>
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

function banhoTopAlertHtml(b) {
  const isDescarrego = b.objetivo === "descarrego" || b.intensidade === "forte" || !b.cabeca;
  if (!isDescarrego && b.cabeca) {
    return `
      <div class="drawer-alert drawer-alert--safe">
        <div class="drawer-alert__head">
          <span class="drawer-alert__icon" aria-hidden="true">👑</span>
          <div>
            <b class="drawer-alert__title">BANHO DE COROA (PODE IR À CABEÇA / ORI)</b>
            <span class="drawer-alert__sub">Folhas mansas e pacificadoras. Pode ser vertido suavemente da coroa aos pés para serenar a mente, fortalecer o Ori e ancorar a bênção do seu Anjo da Guarda.</span>
          </div>
        </div>
      </div>`;
  }
  return `
    <div class="drawer-alert drawer-alert--danger" id="drawerTopAlert">
      <div class="drawer-alert__head">
        <span class="drawer-alert__icon" aria-hidden="true">⚠️</span>
        <div>
          <b class="drawer-alert__title">${b.objetivo === "descarrego" ? "CUIDADO CRÍTICO • BANHO DE DESCARREGO PESADO" : "ATENÇÃO • APENAS DO PESCOÇO PARA BAIXO"}</b>
          <span class="drawer-alert__sub">${b.objetivo === "descarrego" ? "Este banho utiliza ervas quentes e de choque para cortar demandas pesadas. Ele deixa o corpo vazio e exige 3 regras sagradas para sua segurança:" : "Este banho utiliza folhas fortes ou mornas de limpeza e nunca deve tocar a coroa sagrada (Ori)."}</span>
        </div>
      </div>
      <ul class="drawer-alert__list">
        <li>
          <strong>🚫 1. NUNCA JOGAR NA CABEÇA (ORI):</strong>
          Verta estritamente do pescoço para baixo. O Ori é a sede do anjo da guarda e das forças sutis; ervas quentes na coroa causam dor de cabeça, tonturas, peso e perturbação.
        </li>
        <li>
          <strong>⚡ 2. O CORPO FICA VAZIO — TOME HARMONIZAÇÃO LOGO EM SEGUIDA:</strong>
          O descarrego quebra o mal, mas deixa a sua aura zerada. <em>Tome logo a seguir um banho de harmonização</em> (manjericão, boldo ou camomila) para preencher seu campo com luz e não virar "esponja aberta".
        </li>
        <li>
          <strong>🚪 3. RESGUARDO E ABSTENÇÃO OBRIGATÓRIOS:</strong>
          Após o descarrego, permaneça em casa e vista roupas claras. Evite locais cheios e aglomerações (bares, shoppings, transporte lotado), nada de álcool, sexo ou discussões nas horas seguintes.
        </li>
      </ul>
    </div>`;
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
      ${b.cabeca ? `<span class="ori ori--yes">✓ Pode na cabeça (Ori)</span>` : `<span class="ori ori--no">⚠️ Do pescoço para baixo</span>`}
    </div>
    ${banhoTopAlertHtml(b)}
    <div class="facts">
      <div class="fact"><span>Luas</span><b>${moonsHtml(b.luas)}</b></div>
      <div class="fact"><span>Dias</span><b>${(b.dias || []).map(d => DIAS_LABEL[d] || d).join(", ") || "Qualquer dia"}</b></div>
      <div class="fact u-span-all"><span>Horário</span><b>${escapeHtml(b.horario || "Livre")}</b></div>
    </div>
    <div class="dsec"><h3>Ingredientes</h3>${ingredientsHtml(b.ervas)}</div>
    <div class="dsec"><h3>Modo de preparo</h3><p>${escapeHtml(b.modoPreparo || "")}</p></div>
    ${rezaHtml(b)}
    <div class="dsec ${b.cabeca ? "" : "dsec--warn"}"><h3>Atenção & fundamento detalhado</h3><p>${escapeHtml(b.observacao || "")}</p></div>
    ${b.versaoCha ? `<div class="dsec dsec--tea"><h3>☕ Versão em chá</h3><p>${escapeHtml(b.versaoCha)}</p></div>` : ""}`;
}

function ritualPedidosHtml(d) {
  if (!d.pedidos || !Array.isArray(d.pedidos) || !d.pedidos.length) return "";
  const items = d.pedidos.map(p =>
    `<li><b>${escapeHtml(p.caminho)}:</b> “${escapeHtml(p.exemplo)}”</li>`
  ).join("");
  return `
    <div class="dsec ritual-pedidos">
      <h3>Escolha o seu pedido</h3>
      <ul class="ritual-pedidos__list">${items}</ul>
      <p class="ritual-pedidos__footer"><a href="firmeza.html#pedido-bem-feito">Como fazer um pedido bem feito →</a></p>
    </div>`;
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
      <div class="fact u-span-all"><span>Sentido</span><b>${escapeHtml(d.sentido || "Por todos os cômodos, com ventilação")}</b></div>
      <div class="fact u-span-all"><span>Horário</span><b>${escapeHtml(d.horario || "Livre")}</b></div>
    </div>
    <div class="dsec"><h3>Ervas e resinas</h3>${ingredientsHtml(d.ervas)}</div>
    <div class="dsec"><h3>Para que serve</h3><p>${escapeHtml(d.servePara || "")}</p></div>
    ${ritualPedidosHtml(d)}
    ${rezaHtml(d)}
    <div class="dsec dsec--warn"><h3>Cuidados</h3><p>${escapeHtml(d.cuidados || "Ventile bem; cuidado com fogo, crianças e animais.")}</p></div>`;
}

function herbCreditHtml(e) {
  const c = window.FV_DATA && window.FV_DATA.creditosFotos && window.FV_DATA.creditosFotos[e.id];
  if (!c) return "";
  const autor = escapeHtml(c.autor || "");
  const licenca = escapeHtml(c.licenca || "");
  const pagina = escapeHtml(c.pagina || "");
  return `<p class="drawer__credit">Foto: ${autor} · <a href="${pagina}" target="_blank" rel="noopener">licença ${licenca}</a> · Wikimedia Commons</p>`;
}

function ervaDetailHtml(e) {
  const [titulo, sub] = splitName(e.nome);
  const en = ENERGIAS.find(x => x.k === e.energia);
  const cab = herbCabeca(e);
  const usos = (e.usos || []).map(u => u.replace("banho-external", "banho externo").replace("escalda-pes", "escalda-pés")).join(", ");
  const used = usedInHtml(e);
  return `
    <div class="drawer__hero">${herbThumbHtml(e)}</div>
    ${herbCreditHtml(e)}
    <h2 class="drawer__title">${escapeHtml(titulo)}</h2>
    <p class="drawer__sub">${escapeHtml(e.nomePopular || sub)}</p>
    <div class="drawer__chips">
      ${en ? `<span class="badge" style="color:${en.c}">${en.label}</span>` : ""}
      <span class="badge">Intensidade ${INTENSIDADE_LABEL[e.intensidade] || e.intensidade || "—"}</span>
      ${(e.objetivos || []).map(k => `<span class="badge">${objInfo(k).icon} ${objInfo(k).label}</span>`).join("")}
    </div>
    <div class="dsec u-bt-0 u-pt-0 ${cab === "no" ? "dsec--warn" : ""}">
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

/* Mantém o foco do teclado dentro de um painel aberto (Tab e Shift+Tab circulam) */
function trapFocus(e, panel) {
  const items = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(x => x.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

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
          <button hidden class="drawer-alert-pill" id="drawerAlertPill" type="button" data-scroll-alert title="Ver cuidados e resguardo">⚠️ Ver Cuidados</button>
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

      const pill = el.querySelector("#drawerAlertPill");
      if (pill) {
        pill.hidden = !html.includes('id="drawerTopAlert"');
      }

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
    if (e.target.closest("[data-scroll-alert]")) {
      const topAlert = el.querySelector("#drawerTopAlert");
      if (topAlert) {
        topAlert.scrollIntoView({ behavior: "smooth", block: "start" });
        topAlert.style.transform = "scale(1.02)";
        setTimeout(() => topAlert.style.transform = "none", 300);
      }
    }
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
  document.addEventListener("keydown", e => {
    if (!api.isOpen) return;
    if (e.key === "Escape") api.close();
    if (e.key === "Tab") trapFocus(e, el.querySelector(".drawer__panel"));
  });
  DRAWER = api;
  return api;
}

/* Modal de Alerta Rápido ao tocar no ícone de perigo/cuidado do card */
function openQuickAlert(id) {
  const b = BANHOS.find(x => x.id === id);
  if (!b) return;
  let dialog = $("#quickAlertDialog");
  if (!dialog) {
    dialog = document.createElement("div");
    dialog.id = "quickAlertDialog";
    dialog.className = "quick-alert-dialog";
    dialog.hidden = true;
    dialog.innerHTML = `
      <div class="quick-alert-dialog__backdrop" data-close-alert></div>
      <div class="quick-alert-dialog__box" role="alertdialog" aria-modal="true" aria-labelledby="quickAlertTitle">
        <button class="icon-btn quick-alert-dialog__close" type="button" data-close-alert aria-label="Fechar">${ICONS.close}</button>
        <div id="quickAlertContent"></div>
      </div>`;
    document.body.appendChild(dialog);
    dialog.addEventListener("click", e => {
      if (e.target.closest("[data-close-alert]")) closeQuickAlert();
    });
  }
  const [titulo, sub] = splitName(b.nome);
  const isDescarrego = b.objetivo === "descarrego" || b.intensidade === "forte";
  const content = $("#quickAlertContent");
  content.innerHTML = `
    <div class="drawer-alert drawer-alert--danger u-mb-16">
      <div class="drawer-alert__head">
        <span class="drawer-alert__icon">⚠️</span>
        <div>
          <b class="drawer-alert__title" id="quickAlertTitle">${isDescarrego ? "Cuidados deste banho de descarrego" : "Cuidados deste banho"}</b>
          <span class="drawer-alert__sub">${escapeHtml(titulo)} ${sub ? `• ${escapeHtml(sub)}` : ""}</span>
        </div>
      </div>
      <ul class="drawer-alert__list u-mt-12">
        <li>
          <strong>1. Do pescoço para baixo:</strong>
          este banho não vai na cabeça (Ori). Por tradição, folhas de corte e de força ficam do pescoço para baixo.
        </li>
        ${isDescarrego ? `
        <li>
          <strong>2. Depois, um banho doce:</strong>
          o descarrego limpa o que pesa. Em seguida, um banho de harmonização (manjericão, boldo ou camomila) ajuda a trazer calma e equilíbrio.
        </li>
        <li>
          <strong>3. Resguardo recomendado:</strong>
          nas horas seguintes, prefira ficar em casa, com roupas claras, longe de álcool, festas e discussões.
        </li>` : ""}
      </ul>
      ${b.observacao ? `<p class="muted small u-mt-12 u-divider-top u-pt-8"><strong>Fundamento:</strong> ${escapeHtml(b.observacao)}</p>` : ""}
    </div>
    <div class="row wrap-row u-justify-end u-gap-8">
      <button class="btn btn--ghost" type="button" data-close-alert>Fechar aviso</button>
      <button class="btn btn--primary" type="button" id="btnGoToFullBath">Ver receita completa →</button>
    </div>`;
  $("#btnGoToFullBath")?.addEventListener("click", () => {
    closeQuickAlert();
    getDrawer().open("Banho", banhoDetailHtml(b), b.id);
  });
  quickAlertReturn = document.activeElement;
  dialog.hidden = false;
  $("#btnGoToFullBath")?.focus({ preventScroll: true });
}

let quickAlertReturn = null;
function closeQuickAlert() {
  const dialog = $("#quickAlertDialog");
  if (!dialog || dialog.hidden) return;
  dialog.hidden = true;
  quickAlertReturn?.focus?.({ preventScroll: true });
}
document.addEventListener("keydown", e => {
  const dialog = $("#quickAlertDialog");
  if (!dialog || dialog.hidden) return;
  if (e.key === "Escape") closeQuickAlert();
  if (e.key === "Tab") trapFocus(e, dialog.querySelector(".quick-alert-dialog__box"));
});

// Delegação de cliques para botões de alerta rápido nos cards
document.addEventListener("click", e => {
  const alertBtn = e.target.closest("[data-quick-alert]");
  if (alertBtn) {
    e.preventDefault();
    e.stopPropagation();
    openQuickAlert(alertBtn.dataset.quickAlert);
  }
});

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
    <h2 class="sr-only">${escapeHtml(mount.getAttribute("aria-label") || "Catálogo")}</h2>
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

const MAPA_ERVAS = [
  { k: "cortar",     icone: "✂️", titulo: "Cortar",            paraQue: "Corte rápido: mau-olhado, inveja, quebranto", ids: ["arruda"] },
  { k: "blindar",    icone: "🛡️", titulo: "Blindar",           paraQue: "Fechar o corpo para o mal não voltar",        ids: ["guine"] },
  { k: "porta",      icone: "🚪", titulo: "Guardar a porta",   paraQue: "Vaso vivo na entrada da casa",                ids: ["espada-sao-jorge", "comigo-ninguem-pode", "pimenteira"], nota: "Planta de vaso: não vai em banho nem no fogo." },
  { k: "descarrego", icone: "🔥", titulo: "Descarrego pesado", paraQue: "Só quando é necessário",                      ids: ["aroeira"], selo: "Só com orientação de um(a) zelador(a)" },
  { k: "harmonizar", icone: "🌿", titulo: "Harmonizar",        paraQue: "Depois do corte, o doce",                     ids: ["manjericao", "boldo", "rosa-branca"] },
  { k: "acalmar",    icone: "🌙", titulo: "Acalmar",           paraQue: "Serenar a mente e o sono",                    ids: ["alfazema", "camomila", "erva-cidreira", "maracuja"] },
  { k: "atrair",     icone: "✨", titulo: "Atrair e prosperar", paraQue: "Fartura, oportunidade, vitória",             ids: ["louro", "pitangueira", "canela", "girassol"] },
  { k: "caminhos",   icone: "🧭", titulo: "Abrir caminhos",    paraQue: "Destravar o que está parado",                 ids: ["abre-caminho", "levante"] }
];

function initMapaErvas() {
  const mount = document.querySelector("[data-mapa-ervas]");
  if (!mount) return;
  mount.innerHTML = MAPA_ERVAS.map(g => {
    const chips = g.ids.map(id => {
      const e = ERVAS.find(x => x.id === id);
      if (!e) {
        console.warn(`[mapa-ervas] Erva não encontrada: ${id}`);
        return "";
      }
      const nomeCurto = splitName(e.nome)[0];
      return `<a class="mapa-chip" href="#${encodeURIComponent(e.id)}">${escapeHtml(nomeCurto)}</a>`;
    }).filter(Boolean).join("");

    return `
      <div class="mapa-grupo" data-grupo="${escapeHtml(g.k)}">
        <div class="mapa-grupo__head">
          <span class="mapa-grupo__icon">${g.icone}</span>
          <h3 class="mapa-grupo__title">${escapeHtml(g.titulo)}</h3>
          ${g.selo ? `<span class="badge-danger">${escapeHtml(g.selo)}</span>` : ""}
        </div>
        <p class="mapa-grupo__para">${escapeHtml(g.paraQue)}</p>
        <div class="mapa-grupo__chips">${chips}</div>
        ${g.nota ? `<p class="mapa-grupo__nota"><small class="muted">${escapeHtml(g.nota)}</small></p>` : ""}
      </div>`;
  }).join("");

  mount.addEventListener("click", e => {
    const chip = e.target.closest(".mapa-chip");
    if (!chip) return;
    const href = chip.getAttribute("href");
    if (href && href.startsWith("#")) {
      const id = decodeURIComponent(href.slice(1));
      const it = ERVAS.find(x => x.id === id);
      if (it) getDrawer().open("Erva", ervaDetailHtml(it), it.id);
    }
  });
}

function initPlantasPage() {
  initMapaErvas();
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

