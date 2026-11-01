/* Foco Vibracional • praticas.js
   Início (relógio e modo foco), mantras, caderno de firmeza e firmeza de vela.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

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
  empty.hidden = filtered.length > 0;

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
    copyBtn.onclick = () => copyText(m.text, copyBtn);

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
    $all("[data-page-panel]").forEach(p => {
      const match = p.getAttribute("data-page-panel") === id;
      if (match) {
        p.hidden = false;
        p.classList.remove("page-panel--entering");
        void p.offsetWidth;
        p.classList.add("page-panel--entering");
      } else {
        p.hidden = true;
        p.classList.remove("page-panel--entering");
      }
    });
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
  if (empty) empty.hidden = totalCount > 0;

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
            <span class="badge u-fs-75">${escapeHtml(item.eyebrow || "Item")}</span>
            <b class="fav-catalog-title">${escapeHtml(item.title || item.id)}</b>
          </div>
          <div class="row wrap-row u-gap-8 u-items-center">
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
        card.querySelector("[data-copy-fav]")?.addEventListener("click", e => copyText(text, e.currentTarget));
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
          <div class="row wrap-row u-gap-6 u-items-center">
            <span class="badge badge--tea">${escapeHtml(tipoLabel)}</span>
            ${entry.moon ? `<span class="badge">${escapeHtml(entry.moon)}</span>` : ""}
            <span class="muted small u-ml-4">${escapeHtml(formattedDate)}</span>
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
  const intencaoCount = $("#intencaoCount");
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

  // Cor inicial pelo dataset
  candleWrapper.dataset.cor = candleWrapper.dataset.cor || "branca";

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
      const colKey = cp.dataset.candleColor || "branca";
      candleWrapper.dataset.cor = colKey;
      if (candleLabel) candleLabel.textContent = cp.dataset.label;
    });
  });

  if (inputIntencao) {
    function updateIntencaoUI() {
      const val = inputIntencao.value;
      const trimmed = val.trim();
      if (intentionDisplay) {
        intentionDisplay.textContent = trimmed ? `“${trimmed}”` : "“Abençoada seja a luz que guia meus passos em serenidade.”";
      }
      if (intencaoCount) {
        const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
        const chars = val.length;
        intencaoCount.textContent = words > 0 ? `${words} palavra${words > 1 ? "s" : ""} • ${chars} letras` : "0 palavras";
      }
      try {
        if (trimmed) {
          localStorage.setItem("fv_firmeza_intencao", val);
        } else {
          localStorage.removeItem("fv_firmeza_intencao");
        }
      } catch (e) {}
    }

    // Carregar intenção salva anteriormente se existir
    try {
      const savedIntencao = localStorage.getItem("fv_firmeza_intencao");
      if (savedIntencao) {
        inputIntencao.value = savedIntencao;
      }
    } catch (e) {}
    updateIntencaoUI();

    inputIntencao.addEventListener("input", updateIntencaoUI);

    // Botões de preces prontas para inspirar ou preencher rapidamente
    const PRECES_PRONTAS = {
      btnPreceDemanda: "Que a força desta chama sagrada quebre toda a maldição, toda a amarra e toda a energia negativa lançada contra mim ou minha casa. Que toda inveja seja consumida no fogo sagrado e transmutada em luz, em energia de movimento, saúde e prosperidade. Onde havia peso, agora reina a vitória. Que assim seja e assim se faça!",
      btnPreceJurema: "Em nome de Deus todo-poderoso, dos Mestres e Mestras da Jurema Sagrada e de todas as forças benfazejas que guardam meus caminhos: firmo esta chama viva em meu favor. Que onde houver trevas, se faça a luz. Que onde houver dúvida, reine a clareza. Que meu anjo da guarda seja fortalecido e que a paz habite meu ser. Amém, Axé!",
      btnPreceAnjo: "Meu Santo Anjo da Guarda, fiel guardião de minha alma e mensageiro da paz divina: firmo esta vela para clarear teus passos ao meu redor. Fortalece o meu Ori, serena meus pensamentos, livra-me de todo tropeço e envolve minha casa num manto de pureza e harmonia. Amém!",
      btnPreceIntuicao: "Que aquilo que preciso compreender se revele com clareza. Que minha intuição seja fortalecida e meu caminho protegido. Que eu reconheça a resposta quando ela chegar.",
      btnPreceBrilho: "Antes de pedir que os caminhos se abram, acendo a força que habita em mim. Que esta chama reacenda meu brilho, minha garra e minha coragem de me posicionar. Que meu campo esteja aquecido, visível e pronto para atrair e sustentar tudo aquilo que desejo. Que a doçura chegue e que eu tenha vigor para recebê-la."
    };

    Object.keys(PRECES_PRONTAS).forEach(btnId => {
      const btn = $(`#${btnId}`);
      if (btn) {
        btn.addEventListener("click", () => {
          inputIntencao.value = PRECES_PRONTAS[btnId];
          updateIntencaoUI();
          inputIntencao.focus();
          toast("Prece inserida na sua firmeza ✨");
        });
      }
    });

    const btnLimpar = $("#btnLimparIntencao");
    if (btnLimpar) {
      btnLimpar.addEventListener("click", () => {
        inputIntencao.value = "";
        updateIntencaoUI();
        inputIntencao.focus();
        toast("Campo limpo. Escreva sua intenção com liberdade.");
      });
    }
  }

  updateTimerDisplay();
}

