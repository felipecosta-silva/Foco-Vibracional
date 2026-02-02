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
