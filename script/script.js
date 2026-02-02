/* =========================
   Config
========================= */
const MANTRAS_URL = "/data/mantras.json";
const FAVORITES_KEY = "focoVibracional.favorites.v1";

const ERVAS_URL = "./data/ervas.json";
let ERVAS = [];

let DAILY_MANTRAS = [];

/* =========================
   Utilitários
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
  const seed = Math.floor(date.getTime() / 86400000);
  return ((seed % length) + length) % length;
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copiado!");
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
  const el = document.createElement("div");
  el.textContent = message;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "18px";
  el.style.transform = "translateX(-50%)";
  el.style.background = "rgba(255,255,255,.10)";
  el.style.border = "1px solid rgba(255,255,255,.18)";
  el.style.backdropFilter = "blur(10px)";
  el.style.color = "rgba(255,255,255,.92)";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "12px";
  el.style.zIndex = "999";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Seu navegador não suporta leitura em voz.");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/* =========================
   Carregar mantras (JSON)
========================= */
async function loadMantras() {
  try {
    const res = await fetch(MANTRAS_URL, { cache: "no-store" });
    const data = await res.json();
    DAILY_MANTRAS = Array.isArray(data.mantras) ? data.mantras : [];
  } catch (e) {
    DAILY_MANTRAS = [];
  }
}

/* =========================
   Favoritos
========================= */
function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); }
  catch { return []; }
}
function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function addFavorite(text) {
  const items = loadFavorites();
  if (items.includes(text)) {
    toast("Já está nos favoritos.");
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

/* =========================
   UI: Ações globais
========================= */
function wireCopySpeakButtons() {
  $all("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target) return;
      const text = target.innerText.replace(/[“”]/g, '"').trim();
      copyText(text);
    });
  });

  $all("[data-copy-text]").forEach(btn => {
    btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy-text")));
  });

  $all("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.getAttribute("data-speak"));
      if (!target) return;
      speak(target.innerText.trim());
    });
  });
}

function wireScrollPills() {
  $all("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll");
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================
   Página: index (relógio + foco)
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
    badge.textContent = formatDateBR(now);
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
  }

  btn.addEventListener("click", () => set(!on));
  overlay.addEventListener("click", () => set(false));
}

/* =========================
   Página: mantras (diário + lista completa)
========================= */
let currentDailyIndex = null;

function setDailyMantra(forcedIndex = null) {
  const el = $("#dailyMantra");
  const tag = $("#dailyTag");
  const tip = $("#dailyTip");
  const favBtn = $("#favDailyBtn");
  const shuffleBtn = $("#shuffleBtn");
  if (!el || !tag || !tip) return;

  if (!DAILY_MANTRAS.length) {
    el.textContent = "“Não foi possível carregar /data/mantras.json.”";
    tag.textContent = "atenção";
    tip.textContent = "Se você abriu por file://, use Live Server (VS Code) ou abra via http://localhost.";
    return;
  }

  const idx = forcedIndex !== null ? forcedIndex : dailyIndexByDate(new Date(), DAILY_MANTRAS.length);
  currentDailyIndex = idx;

  const item = DAILY_MANTRAS[idx];
  el.textContent = `“${item.text}”`;
  tag.textContent = item.tag || "mantra";
  tip.textContent = item.tip || "";

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

  filtered.forEach((m, i) => {
    const wrap = document.createElement("div");
    wrap.className = "mantra-item";

    const top = document.createElement("div");
    top.className = "mantra-item__top";

    const left = document.createElement("div");
    left.innerHTML = `<span class="badge">${m.tag || "mantra"}</span>`;

    const right = document.createElement("div");
    right.className = "row wrap-row";

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
      tip.style.margin = "0";
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
      toast("Sorteado!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }
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
  if (!list || !empty) return;

  const items = loadFavorites();
  list.innerHTML = "";

  empty.style.display = items.length ? "none" : "block";

  items.forEach(text => {
    const card = document.createElement("div");
    card.className = "fav";

    const p = document.createElement("p");
    p.className = "fav__text";
    p.textContent = `“${text}”`;

    const actions = document.createElement("div");
    actions.className = "fav__actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn btn--ghost";
    copyBtn.type = "button";
    copyBtn.textContent = "Copiar";
    copyBtn.addEventListener("click", () => copyText(text));

    const speakBtn = document.createElement("button");
    speakBtn.className = "btn";
    speakBtn.type = "button";
    speakBtn.textContent = "Ouvir";
    speakBtn.addEventListener("click", () => speak(text));

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn--ghost";
    delBtn.type = "button";
    delBtn.textContent = "Remover";
    delBtn.addEventListener("click", () => {
      removeFavorite(text);
      renderFavorites();
      toast("Removido.");
    });

    actions.append(copyBtn, speakBtn, delBtn);
    card.append(p, actions);
    list.append(card);
  });

  if (clearBtn) {
    clearBtn.onclick = () => {
      saveFavorites([]);
      renderFavorites();
      toast("Favoritos limpos.");
    };
  }
}

/* =========================
   Init
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  wireCopySpeakButtons();
  wireScrollPills();

  wireClock();
  wireFocusMode();

  await loadMantras();

  setDailyMantra();
  wireTabs();
  renderFavorites();

  // ✅ lista completa + busca
  renderAllMantras("");
  wireSearch();

  await loadErvas();
  renderErvas();
  wireErvasUI();

});

async function loadErvas() {
  try {
    const res = await fetch(ERVAS_URL, { cache: "no-store" });
    const data = await res.json();
    ERVAS = Array.isArray(data.ervas) ? data.ervas : [];
  } catch {
    ERVAS = [];
  }
}

function renderErvas() {
  const list = document.querySelector("#ervasList");
  const count = document.querySelector("#ervasCount");
  const empty = document.querySelector("#ervasEmpty");
  if (!list || !count || !empty) return;

  const q = (document.querySelector("#ervaSearch")?.value || "").trim().toLowerCase();
  const tipo = (document.querySelector("#ervaTipo")?.value || "todas");
  const uso = (document.querySelector("#ervaUso")?.value || "todos");

  const filtered = ERVAS.filter(e => {
    const name = (e.nome || "").toLowerCase();
    const tags = (e.tags || []).join(" ").toLowerCase();
    const t = (e.tipo || "").toLowerCase();

    const usos = (e.usos || []).map(u => u.id).join(" ").toLowerCase();

    const okSearch = !q || name.includes(q) || tags.includes(q);
    const okTipo = (tipo === "todas") || (t === tipo);
    const okUso = (uso === "todos") || usos.includes(uso);

    return okSearch && okTipo && okUso;
  });

  count.textContent = String(filtered.length);
  list.innerHTML = "";
  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(e => {
    const card = document.createElement("div");
    card.className = "erva-card";

    const top = document.createElement("div");
    top.className = "erva-card__top";

    const title = document.createElement("div");
    const h = document.createElement("h3");
    h.className = "erva-name";
    h.textContent = e.nome || "Erva";
    const desc = document.createElement("p");
    desc.className = "muted small";
    desc.style.margin = "6px 0 0";
    desc.textContent = e.descricao || "";
    title.append(h, desc);

    const meta = document.createElement("div");
    meta.className = "erva-meta";
    const b1 = document.createElement("span");
    b1.className = "badge";
    b1.textContent = (e.tipo === "frias") ? "fria" : (e.tipo === "quentes" ? "quente" : "erva");
    meta.append(b1);

    (e.tags || []).slice(0, 2).forEach(t => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = t;
      meta.append(b);
    });

    top.append(title, meta);

    const kv = document.createElement("ul");
    kv.className = "kv";

    // usos
    const usosTxt = (e.usos || []).map(u => u.nome).join(", ");
    kv.appendChild(kvItem("Usos comuns", usosTxt || "—"));

    // preparo geral (sem receita)
    kv.appendChild(kvItem("Preparo (geral)", e.preparoGeral || "—"));

    // cabeça: deixo como campo informativo e NÃO como instrução
    kv.appendChild(kvItem("Cabeça", e.cabeca || "varia por tradição"));

    // observações
    kv.appendChild(kvItem("Cuidados", e.cuidados || "—"));

    card.append(top, kv);
    list.append(card);
  });
}

function kvItem(k, v) {
  const li = document.createElement("li");
  const b = document.createElement("b");
  b.textContent = k + ": ";
  const span = document.createElement("span");
  span.textContent = v;
  li.append(b, span);
  return li;
}

function wireErvasUI() {
  const s = document.querySelector("#ervaSearch");
  const t = document.querySelector("#ervaTipo");
  const u = document.querySelector("#ervaUso");
  const c = document.querySelector("#ervaClear");

  if (s) s.addEventListener("input", renderErvas);
  if (t) t.addEventListener("change", renderErvas);
  if (u) u.addEventListener("change", renderErvas);
  if (c) c.addEventListener("click", () => {
    if (s) s.value = "";
    if (t) t.value = "todas";
    if (u) u.value = "todos";
    renderErvas();
  });
}


/* =========================
   CALENDÁRIO LUNAR (online + fallback)
========================= */

// API online (FarmSense) – retorna fase/iluminação para uma data
// doc: https://api.farmsense.net/v1/moonphases/?d=UNIX
const FARM_API = "https://api.farmsense.net/v1/moonphases/?d=";

// Cálculo local aproximado (fallback): usa um “new moon reference” + ciclo sinódico
// (aproximação boa para calendário geral; não é observatório)
const SYNODIC_DAYS = 29.530588853;
const REF_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0); // referência comum (aprox.)

function toUnixSeconds(d){ return Math.floor(d.getTime() / 1000); }

function moonAgeDays(date){
  const diffDays = (date.getTime() - REF_NEW_MOON_UTC) / 86400000;
  let age = diffDays % SYNODIC_DAYS;
  if (age < 0) age += SYNODIC_DAYS;
  return age;
}

// classifica “principal” (para mostrar Nova/Crescente/Cheia/Minguante)
function majorPhaseFromAge(age){
  // divisões simples em 4
  if (age < 1.0 || age > SYNODIC_DAYS - 1.0) return "Lua Nova";
  if (Math.abs(age - SYNODIC_DAYS/2) < 1.0) return "Lua Cheia";
  if (Math.abs(age - SYNODIC_DAYS/4) < 1.0) return "Quarto Crescente";
  if (Math.abs(age - 3*SYNODIC_DAYS/4) < 1.0) return "Quarto Minguante";

  // entre os pontos:
  if (age < SYNODIC_DAYS/4) return "Crescente (entre Nova e Crescente)";
  if (age < SYNODIC_DAYS/2) return "Crescente (entre Crescente e Cheia)";
  if (age < 3*SYNODIC_DAYS/4) return "Minguante (entre Cheia e Minguante)";
  return "Minguante (entre Minguante e Nova)";
}

function phaseIntention(major){
  // sugestões educativas (sem receita)
  const map = {
    "Lua Nova": "Intenção e recomeço • planejar hábitos",
    "Quarto Crescente": "Crescimento • disciplina e ação",
    "Lua Cheia": "Força e expansão • harmonização e gratidão",
    "Quarto Minguante": "Limpeza • soltar e encerrar"
  };
  return map[major] || "Ajuste e presença • escolha uma intenção simples";
}

function banhoTipoSugestao(major){
  // só tipo/intenção (sem receita)
  const map = {
    "Lua Nova": "Tipo: planejamento / prosperidade (leve)",
    "Quarto Crescente": "Tipo: reenergizar / foco",
    "Lua Cheia": "Tipo: harmonização / gratidão",
    "Quarto Minguante": "Tipo: limpeza / descarrego simbólico"
  };
  return map[major] || "Tipo: calma / harmonização";
}

function formatDateBR(d){
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// acha próximas datas aproximadas das 4 fases principais
function nextMajorPhases(startDate, count=4){
  const targets = [
    { name:"Lua Nova", targetAge: 0 },
    { name:"Quarto Crescente", targetAge: SYNODIC_DAYS/4 },
    { name:"Lua Cheia", targetAge: SYNODIC_DAYS/2 },
    { name:"Quarto Minguante", targetAge: 3*SYNODIC_DAYS/4 }
  ];

  const results = [];
  const baseAge = moonAgeDays(startDate);

  for (const t of targets){
    let delta = t.targetAge - baseAge;
    if (delta <= 0) delta += SYNODIC_DAYS;
    const date = new Date(startDate.getTime() + delta * 86400000);
    results.push({ name: t.name, date });
  }

  results.sort((a,b)=>a.date - b.date);
  return results.slice(0, count);
}

async function fetchFarmSense(date){
  const url = FARM_API + toUnixSeconds(date);
  const res = await fetch(url, { cache:"no-store" });
  const data = await res.json();
  // formato esperado: array com 1 item
  const item = Array.isArray(data) ? data[0] : null;
  if (!item || item.Error !== 0) throw new Error("FarmSense error");
  return item;
}

function initWeekPlanner(major){
  const wrap = document.querySelector("#weekPlanner");
  if (!wrap) return;

  const days = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  wrap.innerHTML = "";

  const today = new Date();
  // começar na segunda
  const day = (today.getDay()+6)%7; // 0=Seg
  const monday = new Date(today);
  monday.setDate(today.getDate() - day);

  for (let i=0;i<7;i++){
    const d = new Date(monday);
    d.setDate(monday.getDate()+i);

    const age = moonAgeDays(d);
    const m = majorPhaseFromAge(age);
    const card = document.createElement("div");
    card.className = "day";
    card.innerHTML = `
      <div class="top">
        <b>${days[i]} • ${formatDateBR(d)}</b>
        <span class="pill">${m.replace("Lua ","")}</span>
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

async function initCalendarioLunar(){
  const nowName = document.querySelector("#moonNowName");
  if (!nowName) return; // só roda no calendario.html

  const nowBadge = document.querySelector("#moonNowBadge");
  const nowDetails = document.querySelector("#moonNowDetails");
  const nextWrap = document.querySelector("#nextPhases");

  const today = new Date();

  // tenta online (FarmSense)
  let major = null;
  try{
    const item = await fetchFarmSense(today);
    const phase = item.Phase || "—";
    const illum = typeof item.Illumination === "number" ? Math.round(item.Illumination*100) : null;

    // tradução simples (não perfeito, mas ajuda)
    // Waxing = crescente; Waning = minguante
    let label = phase;
    label = label.replace("Waxing", "Crescente");
    label = label.replace("Waning", "Minguante");
    label = label.replace("Crescent", "Crescente");
    label = label.replace("Gibbous", "Gibosa");
    label = label.replace("Quarter", "Quarto");

    // major aproximado pelo age (fallback) para mapear intenção
    const age = moonAgeDays(today);
    const m = majorPhaseFromAge(age);
    major = m.includes("Nova") ? "Lua Nova"
          : m.includes("Cheia") ? "Lua Cheia"
          : m.includes("Crescente") ? "Quarto Crescente"
          : m.includes("Minguante") ? "Quarto Minguante"
          : "—";

    nowName.textContent = label;
    nowBadge.textContent = `Hoje • ${major}`;
    nowDetails.textContent = illum !== null
      ? `Iluminação aprox.: ${illum}% • (online)`
      : `(online)`;

  }catch{
    // fallback local
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

  // próximas fases (aprox)
  const next = nextMajorPhases(today, 4);
  nextWrap.innerHTML = "";
  next.forEach(p=>{
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <b>${p.name}</b>
      <div class="muted small">${formatDateBR(p.date)} • ${phaseIntention(p.name)}</div>
      <div class="muted small advanced-only" style="margin-top:6px;">${banhoTipoSugestao(p.name)}</div>
    `;
    nextWrap.appendChild(div);
  });

  // planner semanal
  initWeekPlanner(major);
}

// encaixa no seu init geral
document.addEventListener("DOMContentLoaded", () => {
  initCalendarioLunar();
});

/* =========================
   PORTAIS (AUTOMÁTICO) + SEQUÊNCIAS (MELHORADO)
========================= */

// Util: formatar data BR
function fmtBR(d){
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Portais 01/01 .. 12/12 (sempre)
const PORTAL_MEANINGS = {
  1: { tema: "Recomeço • decisão • direção", fazer: "Definir 1 meta clara e 1 ação mínima hoje." },
  2: { tema: "Equilíbrio • relações • escolhas conscientes", fazer: "Harmonizar emoções e alinhar decisões com calma." },
  3: { tema: "Expressão • criatividade • comunicação", fazer: "Escrever ideias, estudar, comunicar um objetivo." },
  4: { tema: "Estrutura • disciplina • base", fazer: "Organizar rotina/finanças; construir constância." },
  5: { tema: "Mudança • movimento • liberdade", fazer: "Quebrar um padrão e iniciar um hábito novo." },
  6: { tema: "Cuidado • responsabilidade • amor", fazer: "Autocuidado e equilíbrio nos relacionamentos." },
  7: { tema: "Introspecção • fé • estudo", fazer: "Silêncio, meditação, leitura e autoconhecimento." },
  8: { tema: "Poder pessoal • prosperidade • expansão", fazer: "Foco em resultados, coragem e ação financeira." },
  9: { tema: "Encerramento • desapego • conclusão", fazer: "Finalizar pendências, limpar excessos, perdoar/soltar." },
  10:{ tema: "Alinhamento • clareza • ação", fazer: "Escolher prioridades e executar o essencial." },
  11:{ tema: "Consciência • propósito • despertar", fazer: "Revisar rumo de vida e reafirmar propósito." },
  12:{ tema: "Integração • síntese • fechamento", fazer: "Revisar o ano, agradecer e planejar o novo ciclo." }
};

// Gera lista de portais a partir de hoje (inclui próximos do ano e já emenda no próximo ano)
function getNextPortals(fromDate, howMany=8){
  const out = [];
  const startYear = fromDate.getFullYear();
  let y = startYear;

  while (out.length < howMany){
    for (let m=1;m<=12;m++){
      const d = new Date(y, m-1, m); // mm/mm (dia = mês)
      // considera "a partir de hoje" (inclui hoje)
      const dayStart = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const candStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (candStart >= dayStart){
        out.push(d);
        if (out.length >= howMany) break;
      }
    }
    y++;
  }
  return out;
}

function isPortalDay(date){
  const m = date.getMonth()+1;
  const d = date.getDate();
  return m === d && m >= 1 && m <= 12;
}

function portalName(month){
  const mm = String(month).padStart(2,"0");
  return `${mm}/${mm}`;
}

function initPortaisPage(){
  const grid = document.querySelector("#portalGrid");
  if (!grid) return; // só roda no portais.html

  // modo iniciante/avançado (reaproveita chave que você já usa)
  const MODE_KEY = "foco.mode.v1";
  const mode = localStorage.getItem(MODE_KEY) || "beginner";
  document.body.dataset.mode = (mode === "advanced") ? "advanced" : "beginner";
  const btn = document.querySelector("#modeToggle");
  if (btn){
    const adv = mode === "advanced";
    btn.setAttribute("aria-pressed", adv ? "true" : "false");
    btn.textContent = adv ? "Avançado" : "Iniciante";
    btn.addEventListener("click", () => {
      const next = (localStorage.getItem(MODE_KEY) === "advanced") ? "beginner" : "advanced";
      localStorage.setItem(MODE_KEY, next);
      document.body.dataset.mode = next === "advanced" ? "advanced" : "beginner";
      btn.setAttribute("aria-pressed", next === "advanced" ? "true" : "false");
      btn.textContent = next === "advanced" ? "Avançado" : "Iniciante";
    });
  }

  // Cabeçalho ano
  const yearBadge = document.querySelector("#portalYear");
  if (yearBadge) yearBadge.textContent = `Hoje • ${new Date().getFullYear()}`;

  // Próximos portais
  const nextWrap = document.querySelector("#portalNextList");
  const next = getNextPortals(new Date(), 10);
  nextWrap.innerHTML = "";
  next.forEach(d=>{
    const m = d.getMonth()+1;
    const meaning = PORTAL_MEANINGS[m];
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <b>${portalName(m)} • ${fmtBR(d)}</b>
      <div class="muted small">${meaning.tema}</div>
      <div class="muted small advanced-only" style="margin-top:6px;"><b>Intenção:</b> ${meaning.fazer}</div>
    `;
    nextWrap.appendChild(el);
  });

  // Hoje é portal?
  const today = new Date();
  const todayBadge = document.querySelector("#portalTodayBadge");
  const todayTitle = document.querySelector("#portalTodayTitle");
  const todayMeaning = document.querySelector("#portalTodayMeaning");
  const todayDo = document.querySelector("#portalTodayDo");

  if (isPortalDay(today)){
    const m = today.getMonth()+1;
    const meaning = PORTAL_MEANINGS[m];
    todayBadge.textContent = "SIM";
    todayTitle.textContent = `${portalName(m)} • ${fmtBR(today)}`;
    todayMeaning.textContent = meaning.tema;
    todayDo.textContent = `Sugestão: ${meaning.fazer}`;
  } else {
    todayBadge.textContent = "NÃO";
    todayTitle.textContent = fmtBR(today);
    todayMeaning.textContent = "Mesmo sem portal, você pode escolher um tema e praticar.";
    todayDo.textContent = "Sugestão: pegue 1 afirmação + 1 pergunta e faça 1 ação real pequena.";
  }

  // Grid de todos portais do ano (01/01..12/12)
  grid.innerHTML = "";
  for (let m=1;m<=12;m++){
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
        <li class="advanced-only"><b>Dica:</b> combine com Lua (Calendário) para escolher “limpeza” (minguante) ou “expansão” (crescente/cheia).</li>
      </ul>
    `;
    grid.appendChild(card);
  }

  // ==== Grabovoi (melhorado) ====
  const SEQS = [
    { seq:"520 741 777 888", cat:"prosperidade", titulo:"Prosperidade + clareza + confiança", uso:"Foco em fluxo, abertura e ação financeira." },
    { seq:"741", cat:"foco", titulo:"Clareza mental (âncora curta)", uso:"Quando estiver disperso: respirar e retornar ao essencial." },
    { seq:"777", cat:"harmonizacao", titulo:"Alinhamento interno", uso:"Estabilidade emocional e fé no processo." },
    { seq:"888", cat:"prosperidade", titulo:"Abundância e expansão", uso:"Trabalhar mentalidade de merecimento + disciplina." },
    { seq:"111", cat:"foco", titulo:"Começo e direção", uso:"Iniciar algo simples e manter constância." },
    { seq:"222", cat:"calma", titulo:"Equilíbrio e paz", uso:"Acalmar e harmonizar antes de dormir." },
    { seq:"999", cat:"limpeza", titulo:"Encerramento e desapego", uso:"Fechar ciclos e soltar o que não serve." }
  ];

  const seqWrap = document.querySelector("#seqList");
  const qSeq = document.querySelector("#qSeq");
  const fSeq = document.querySelector("#fSeqCat");
  const btnRnd = document.querySelector("#seqRandom");
  const btnClr = document.querySelector("#seqClear");

  function renderSeq(list){
    seqWrap.innerHTML = "";
    list.forEach(s=>{
      const el = document.createElement("div");
      el.className = "item";
      const id = "seq_" + s.seq.replace(/\s/g,"_");
      el.innerHTML = `
        <b>${s.seq}</b>
        <div class="muted small">${s.titulo} • <span class="badge">${s.cat}</span></div>
        <div class="muted small" id="${id}" style="margin-top:6px;">${s.uso}</div>
        <div class="row wrap-row" style="margin-top:10px;">
          <button class="btn btn--ghost" data-copy-text="${s.seq}" type="button">Copiar</button>
          <button class="btn" data-speak="#${id}" type="button">Ouvir</button>
        </div>
      `;
      seqWrap.appendChild(el);
    });
  }

  function applySeq(){
    const q = (qSeq.value || "").toLowerCase().trim();
    const cat = fSeq.value || "todas";
    const filtered = SEQS.filter(s=>{
      const hay = (s.seq+" "+s.cat+" "+s.titulo+" "+s.uso).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okC = (cat==="todas") || s.cat===cat;
      return okQ && okC;
    });
    renderSeq(filtered.length ? filtered : SEQS);
  }

  if (qSeq) qSeq.addEventListener("input", applySeq);
  if (fSeq) fSeq.addEventListener("change", applySeq);
  if (btnClr) btnClr.addEventListener("click", ()=>{
    qSeq.value = "";
    fSeq.value = "todas";
    applySeq();
  });
  if (btnRnd) btnRnd.addEventListener("click", ()=>{
    const list = SEQS.filter(s => (fSeq.value==="todas") || s.cat===fSeq.value);
    const pick = list[Math.floor(Math.random()*list.length)];
    renderSeq([pick]);
  });

  applySeq();
}

// Copiar (data-copy ou data-copy-text) + Ouvir (data-speak)
function initCopySpeak(){
  document.addEventListener("click", async (e)=>{
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    // COPY by selector
    const sel = t.getAttribute("data-copy");
    if (sel){
      const el = document.querySelector(sel);
      if (el){
        const text = el.textContent.trim().replace(/^“|”$/g,"");
        try{ await navigator.clipboard.writeText(text); }catch{}
      }
    }

    // COPY by direct text
    const txt = t.getAttribute("data-copy-text");
    if (txt){
      try{ await navigator.clipboard.writeText(txt); }catch{}
    }

    // SPEAK by selector
    const sp = t.getAttribute("data-speak");
    if (sp){
      const el = document.querySelector(sp);
      const text = el ? el.textContent.trim().replace(/^“|”$/g,"") : "";
      if (text && "speechSynthesis" in window){
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "pt-BR";
        window.speechSynthesis.speak(u);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initCopySpeak();
  initPortaisPage();
});
