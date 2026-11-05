/* Foco Vibracional • praticas.js
   Início (relógio e modo foco), mantras, caderno de firmeza, firmeza de vela, contas da casa e meus livros.
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


/* ==========================================================================
   Contas da casa (contas.html, spec 008): velas, incensos e outros itens do mês.
   Os dados ficam só no aparelho (localStorage); nada vai para a internet.
   ========================================================================== */
const CONTAS_KEY = "foco.contas.v1";
const DIA_MS = 864e5;

function loadContas() {
  try {
    const itens = JSON.parse(localStorage.getItem(CONTAS_KEY) || "[]");
    return Array.isArray(itens) ? itens : [];
  } catch { return []; }
}
function saveContas(itens) {
  try { localStorage.setItem(CONTAS_KEY, JSON.stringify(itens)); } catch { /* janela anônima: segue sem guardar */ }
  document.dispatchEvent(new CustomEvent("foco:salvo"));
}

/* Aceita "12,50", "12.50" e "1.234,50" */
function parseValor(v) {
  let s = String(v ?? "").trim().replace(/\s|R\$/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function parseInteiro(v, min = 0) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= min ? n : min;
}
const fmtReal = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataLocal = iso => { const [y, m, d] = String(iso).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };

function novoItemConta() {
  return { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nome: "", para: "", modo: "cada", dias: 7, proxima: localISODate(), vezesMes: 4, porVez: 1, compra: "unidade", preco: "", porCaixa: 12, precoCaixa: "", estoque: 0 };
}

/* Quantas vezes o item é usado no mês "AAAA-MM" */
function vezesNoMes(it, mes) {
  if (it.modo === "mes") return parseInteiro(it.vezesMes);
  const n = parseInteiro(it.dias, 1);
  const [y, m] = mes.split("-").map(Number);
  const ini = new Date(y, m - 1, 1);
  const fim = new Date(y, m, 0);
  let primeira = dataLocal(it.proxima || localISODate());
  if (primeira < ini) {
    const passos = Math.ceil(Math.round((ini - primeira) / DIA_MS) / n);
    primeira = new Date(primeira.getFullYear(), primeira.getMonth(), primeira.getDate() + passos * n);
  }
  if (primeira > fim) return 0;
  return Math.floor(Math.round((fim - primeira) / DIA_MS) / n) + 1;
}

function precoUnidade(it) {
  if (it.compra === "caixa") {
    const un = parseInteiro(it.porCaixa, 1);
    return parseValor(it.precoCaixa) / un;
  }
  return parseValor(it.preco);
}

function contaDoItem(it, mes) {
  const vezes = vezesNoMes(it, mes);
  const usa = vezes * parseInteiro(it.porVez, 1);
  const pu = precoUnidade(it);
  const porAno = it.modo === "mes"
    ? parseInteiro(it.vezesMes) * 12 * parseInteiro(it.porVez, 1) * pu
    : (365 / parseInteiro(it.dias, 1)) * parseInteiro(it.porVez, 1) * pu;
  return { vezes, usa, gasto: usa * pu, porAno };
}

/* Itens com o mesmo nome são comprados juntos, com o jeito de comprar do primeiro */
function comprasDoMes(itens, mes) {
  const grupos = new Map();
  itens.forEach(it => {
    const chave = (it.nome || "").trim().toLowerCase() || `#${it.id}`;
    const g = grupos.get(chave) || { base: it, nome: (it.nome || "").trim() || "Item sem nome", usa: 0, estoque: 0 };
    g.usa += contaDoItem(it, mes).usa;
    g.estoque += parseInteiro(it.estoque);
    grupos.set(chave, g);
  });
  return [...grupos.values()].map(g => {
    const comprar = Math.max(0, g.usa - g.estoque);
    if (g.base.compra === "caixa") {
      const un = parseInteiro(g.base.porCaixa, 1);
      const caixas = Math.ceil(comprar / un);
      return { ...g, comprar, caixas, un, sobra: caixas * un - comprar, paga: caixas * parseValor(g.base.precoCaixa) };
    }
    return { ...g, comprar, paga: comprar * parseValor(g.base.preco) };
  });
}

function initContas() {
  const lista = $("#contasLista");
  if (!lista) return;
  const mesInput = $("#contasMes");
  let itens = loadContas();
  mesInput.value = localISODate().slice(0, 7);
  const mes = () => mesInput.value || localISODate().slice(0, 7);
  const mesNome = () => dataLocal(mes() + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const campo = (it, k, rotulo, attrs = "") => `
    <label class="form-group">
      <span class="form-label">${rotulo}</span>
      <input class="form-input" data-k="${k}" value="${escapeHtml(String(it[k] ?? ""))}" ${attrs} />
    </label>`;

  function cardHtml(it) {
    return `
      <article class="card contas-item" data-id="${it.id}">
        <div class="form-row">
          ${campo(it, "nome", "Item", 'type="text" placeholder="Ex.: Vela de 7 dias branca"')}
          ${campo(it, "para", "Para quê (opcional)", 'type="text" placeholder="Ex.: firmeza do altar"')}
        </div>
        <div class="form-row">
          <label class="form-group">
            <span class="form-label">Frequência</span>
            <select class="form-select" data-k="modo">
              <option value="cada"${it.modo === "cada" ? " selected" : ""}>A cada N dias</option>
              <option value="mes"${it.modo === "mes" ? " selected" : ""}>N vezes por mês</option>
            </select>
          </label>
          <div class="form-row contas-sub" data-modo="cada"${it.modo === "cada" ? "" : " hidden"}>
            ${campo(it, "dias", "A cada (dias)", 'type="number" min="1" inputmode="numeric"')}
            ${campo(it, "proxima", "Próxima troca", 'type="date"')}
          </div>
          <div class="form-row contas-sub" data-modo="mes"${it.modo === "mes" ? "" : " hidden"}>
            ${campo(it, "vezesMes", "Vezes por mês", 'type="number" min="0" inputmode="numeric"')}
          </div>
          ${campo(it, "porVez", "Quantos por vez", 'type="number" min="1" inputmode="numeric"')}
        </div>
        <div class="form-row">
          <label class="form-group">
            <span class="form-label">Como compra</span>
            <select class="form-select" data-k="compra">
              <option value="unidade"${it.compra === "unidade" ? " selected" : ""}>Por unidade</option>
              <option value="caixa"${it.compra === "caixa" ? " selected" : ""}>Por caixa</option>
            </select>
          </label>
          <div class="form-row contas-sub" data-compra="unidade"${it.compra === "unidade" ? "" : " hidden"}>
            ${campo(it, "preco", "Preço da unidade (R$)", 'type="text" inputmode="decimal" placeholder="0,00"')}
          </div>
          <div class="form-row contas-sub" data-compra="caixa"${it.compra === "caixa" ? "" : " hidden"}>
            ${campo(it, "porCaixa", "Unidades na caixa", 'type="number" min="1" inputmode="numeric"')}
            ${campo(it, "precoCaixa", "Preço da caixa (R$)", 'type="text" inputmode="decimal" placeholder="0,00"')}
          </div>
          ${campo(it, "estoque", "Já tenho em casa", 'type="number" min="0" inputmode="numeric"')}
        </div>
        <p class="contas-item__conta" aria-live="polite"></p>
        <button class="btn btn--ghost small" type="button" data-remover>Remover</button>
      </article>`;
  }

  function contaTexto(it) {
    const c = contaDoItem(it, mes());
    const vezes = it.modo === "mes" ? "" : `${c.vezes} ${c.vezes === 1 ? "troca" : "trocas"} no mês · `;
    return `${vezes}usa <b>${c.usa}</b> · gasto do mês <b>${fmtReal(c.gasto)}</b> · por ano ${fmtReal(c.porAno)}`;
  }

  function listaCompras() {
    const compras = comprasDoMes(itens, mes()).filter(g => g.comprar > 0);
    if (!compras.length) return `Compras de ${mesNome()}: nada a comprar.`;
    const linhas = compras.map(g => g.caixas !== undefined
      ? `• ${g.nome}: ${g.caixas} ${g.caixas === 1 ? "caixa" : "caixas"} de ${g.un} (precisa de ${g.comprar}${g.sobra ? `, sobram ${g.sobra}` : ""}) — ${fmtReal(g.paga)}`
      : `• ${g.nome}: ${g.comprar} un. — ${fmtReal(g.paga)}`);
    const total = compras.reduce((s, g) => s + g.paga, 0);
    return `Compras de ${mesNome()}:\n${linhas.join("\n")}\nTotal: ${fmtReal(total)}`;
  }

  function atualizarContas() {
    lista.querySelectorAll(".contas-item").forEach(card => {
      const it = itens.find(x => x.id === card.dataset.id);
      if (it) card.querySelector(".contas-item__conta").innerHTML = contaTexto(it);
    });
    const m = mes();
    const somas = itens.reduce((s, it) => { const c = contaDoItem(it, m); s.gasto += c.gasto; s.ano += c.porAno; return s; }, { gasto: 0, ano: 0 });
    $("#contasPagar").textContent = fmtReal(comprasDoMes(itens, m).reduce((s, g) => s + g.paga, 0));
    $("#contasGasto").textContent = fmtReal(somas.gasto);
    $("#contasAno").textContent = fmtReal(somas.ano);
    $("#contasCompra").textContent = listaCompras();
    $("#contasVazio").hidden = itens.length > 0;
  }

  function render() {
    lista.innerHTML = itens.map(cardHtml).join("");
    atualizarContas();
  }

  lista.addEventListener("input", e => {
    const el = e.target.closest("[data-k]");
    const card = e.target.closest(".contas-item");
    if (!el || !card) return;
    const it = itens.find(x => x.id === card.dataset.id);
    it[el.dataset.k] = el.value;
    if (el.dataset.k === "modo" || el.dataset.k === "compra") {
      card.querySelectorAll(`[data-${el.dataset.k}]`).forEach(sub => { sub.hidden = sub.dataset[el.dataset.k] !== el.value; });
    }
    saveContas(itens);
    atualizarContas();
  });

  lista.addEventListener("click", e => {
    const btn = e.target.closest("[data-remover]");
    if (!btn) return;
    const id = btn.closest(".contas-item").dataset.id;
    const it = itens.find(x => x.id === id);
    if (!confirm(`Remover "${it.nome || "item sem nome"}"?`)) return;
    itens = itens.filter(x => x.id !== id);
    saveContas(itens);
    render();
  });

  $("#contasAdd").addEventListener("click", () => {
    itens.push(novoItemConta());
    saveContas(itens);
    render();
    lista.lastElementChild?.querySelector("[data-k='nome']")?.focus();
  });

  mesInput.addEventListener("change", atualizarContas);
  document.addEventListener("foco:nuvem", e => { if (e.detail === CONTAS_KEY) { itens = loadContas(); render(); } });

  $("#contasCopiar").addEventListener("click", e => copyText(listaCompras(), e.currentTarget));
  const shareBtn = $("#contasShare");
  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", () => navigator.share({ title: "Lista de compras", text: listaCompras() }).catch(() => {}));
  }

  $("#contasExport").addEventListener("click", () => baixarJson(`contas-da-casa-${localISODate()}.json`, { app: "foco-contas", versao: 1, itens }));

  $("#contasImport").addEventListener("change", async e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dados = JSON.parse(await file.text());
      const novos = Array.isArray(dados) ? dados : dados.itens;
      if (!Array.isArray(novos)) throw new Error("formato");
      if (!confirm(`Trocar os itens atuais pelos ${novos.length} da cópia?`)) return;
      itens = novos.map(x => ({ ...novoItemConta(), ...x }));
      saveContas(itens);
      render();
      toast("Cópia restaurada.");
    } catch {
      toast("Este arquivo não é uma cópia das Contas da casa.");
    }
  });

  render();
}

/* Cópia de segurança das páginas pessoais (contas.html e livros.html) */
function baixarJson(nome, dados) {
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ==========================================================================
   Meus livros (livros.html, spec 009): biblioteca, leitura, compras e empréstimos.
   Os dados ficam só no aparelho (localStorage); nada vai para a internet.
   ========================================================================== */
const LIVROS_KEY = "foco.livros.v1";
const LEITURA_LABEL = { nao: "Não li", lendo: "Lendo", parei: "Leitura incompleta", li: "Li" };
const LIVROS_FILTROS = [
  { k: "todos", label: "Todos", test: () => true },
  { k: "tenho", label: "Tenho", test: l => l.situacao === "tenho" },
  { k: "comprar", label: "Quero comprar", test: l => l.situacao === "comprar" },
  { k: "emprestados", label: "Emprestados", test: l => l.situacao === "tenho" && !!l.pessoa },
  { k: "nao", label: "Não li", test: l => l.situacao === "tenho" && (!l.leitura || l.leitura === "nao") },
  { k: "lendo", label: "Lendo", test: l => l.leitura === "lendo" },
  { k: "parei", label: "Incompleta", test: l => l.leitura === "parei" },
  { k: "li", label: "Li", test: l => l.leitura === "li" }
];
const LIVROS_CATEGORIAS = ["Romance espírita", "Estudo espírita", "Umbanda", "Jurema", "Candomblé", "Ervas e plantas", "Outros"];
const LIVROS_GRUPOS = {
  categoria: { vazio: "Sem categoria", chave: l => (l.categoria || "").trim() },
  autor: { vazio: "Sem autor", chave: l => (l.autor || "").trim() },
  serie: { vazio: "Fora de série", chave: l => (l.serie || "").trim() },
  nenhum: { vazio: "", chave: () => "" }
};
const chaveLivro = l => `${(l.titulo || "").trim().toLowerCase()}|${(l.autor || "").trim().toLowerCase()}`;
const ordemLivro = (a, b) =>
  (a.serie || "").localeCompare(b.serie || "", "pt-BR") ||
  (parseInteiro(a.volume) || 999) - (parseInteiro(b.volume) || 999) ||
  a.titulo.localeCompare(b.titulo, "pt-BR");

/* Link "livros.html#adicionar=<base64url de uma lista JSON>": acrescenta livros sem apagar os que já existem.
   O trecho depois do # não sai do aparelho (o navegador não o envia ao servidor). */
function livrosDoLink() {
  const m = location.hash.match(/^#adicionar=([\w-]+)$/);
  if (!m) return null;
  try {
    const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64 + "=".repeat((4 - b64.length % 4) % 4)), c => c.charCodeAt(0));
    const lista = JSON.parse(new TextDecoder().decode(bytes));
    return Array.isArray(lista) ? lista.filter(l => l && l.titulo) : null;
  } catch { return null; }
}

function loadLivros() {
  try {
    const livros = JSON.parse(localStorage.getItem(LIVROS_KEY) || "[]");
    return Array.isArray(livros) ? livros : [];
  } catch { return []; }
}
function saveLivros(livros) {
  try { localStorage.setItem(LIVROS_KEY, JSON.stringify(livros)); }
  catch { return false; /* janela anônima ou aparelho sem espaço: segue sem guardar */ }
  document.dispatchEvent(new CustomEvent("foco:salvo"));
  return true;
}

const LIVROS_FORMATO = { digital: "Digital", audio: "Audiolivro" };

/* Foto da capa: reduz para 240 px de altura em JPEG, para caber no aparelho (cerca de 15 KB por capa) */
function capaDeArquivo(file) {
  return new Promise((ok, falha) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 240 / img.naturalHeight);
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * escala);
      c.height = Math.round(img.naturalHeight * escala);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error("imagem")); };
    img.src = url;
  });
}

/* "Buscar capa": só quando o dono toca no botão. Envia título e autor à Open Library e ao Google Livros. */
async function buscarCapas(titulo, autor) {
  const capas = [];
  const pedir = url => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
  const ol = await pedir(`https://openlibrary.org/search.json?${new URLSearchParams({ title: titulo, ...(autor ? { author: autor } : {}), limit: "8", fields: "title,cover_i" })}`);
  (ol?.docs || []).filter(d => d.cover_i).forEach(d => capas.push(`https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`));
  const q = `intitle:"${titulo}"${autor ? ` inauthor:"${autor}"` : ""}`;
  const gb = await pedir(`https://www.googleapis.com/books/v1/volumes?${new URLSearchParams({ q, maxResults: "8" })}`);
  (gb?.items || []).map(i => i.volumeInfo?.imageLinks?.thumbnail).filter(Boolean)
    .forEach(u => capas.push(u.replace(/^http:/, "https:").replace("&edge=curl", "")));
  return [...new Set(capas)].slice(0, 8);
}

function diasDesde(iso) {
  if (!iso) return null;
  const hoje = dataLocal(localISODate());
  return Math.max(0, Math.round((hoje - dataLocal(iso)) / DIA_MS));
}

/* ISBN: número do código de barras do livro. Dados pela BrasilAPI (catálogo brasileiro) e pela Open Library;
   capa pelo servidor de imagens da Amazon ou pela Open Library. Só roda quando o dono pede. */
function isbnDez(i13) {
  if (!/^978\d{10}$/.test(i13)) return null;
  const meio = i13.slice(3, 12);
  const c = (11 - [...meio].reduce((s, d, k) => s + (10 - k) * Number(d), 0) % 11) % 11;
  return meio + (c === 10 ? "X" : String(c));
}
async function dadosPorIsbn(isbn) {
  const pedir = url => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
  const br = await pedir(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
  const ol = await pedir(`https://openlibrary.org/search.json?isbn=${isbn}&fields=title,author_name,number_of_pages_median,cover_i`);
  const doc = ol?.docs?.[0];
  const titulo = (br?.title || doc?.title || "").split(":")[0].trim();
  if (!titulo) return null;
  return {
    titulo,
    autor: (br?.authors?.length ? br.authors : doc?.author_name || []).join(", "),
    paginas: br?.page_count || doc?.number_of_pages_median || "",
    capa: br?.cover_url || (doc?.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : "")
  };
}
/* Testa a imagem antes de usar: a Amazon devolve um pixel vazio quando não tem a capa */
const imagemExiste = url => new Promise(ok => {
  const img = new Image();
  img.onload = () => ok(img.naturalWidth > 10 ? url : "");
  img.onerror = () => ok("");
  img.src = url;
});
async function capaPorIsbn(isbn, extra) {
  const dez = isbn.length === 10 ? isbn : isbnDez(isbn);
  for (const url of [dez && `https://images-na.ssl-images-amazon.com/images/P/${dez}.01.LZZZZZZZ.jpg`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`, extra].filter(Boolean)) {
    if (await imagemExiste(url)) return url;
  }
  return "";
}
const progressoLivro = l => {
  const total = parseInteiro(l.paginas), pag = Math.min(parseInteiro(l.pagina), total);
  return total ? { pag, total, pct: Math.round(pag / total * 100) } : null;
};
const fmtData = iso => iso ? dataLocal(iso).toLocaleDateString("pt-BR") : "";

function initLivros() {
  const lista = $("#livrosLista");
  const form = $("#livroForm");
  if (!lista || !form) return;
  let livros = loadLivros();
  let filtro = "todos";
  let editando = null;
  const f = {
    titulo: $("#livroTitulo"), autor: $("#livroAutor"), situacao: $("#livroSituacao"), leitura: $("#livroLeitura"),
    preco: $("#livroPreco"), pessoa: $("#livroPessoa"), desde: $("#livroDesde"), notas: $("#livroNotas"),
    categoria: $("#livroCategoria"), serie: $("#livroSerie"), volume: $("#livroVolume"), formato: $("#livroFormato"),
    isbn: $("#livroIsbn"), pagina: $("#livroPagina"), paginas: $("#livroPaginas"), inicio: $("#livroInicio"), fim: $("#livroFim")
  };
  let capa = "";
  const agrupar = $("#livrosAgrupar");
  const vista = $("#livrosVista");
  try { vista.value = localStorage.getItem("foco.livros.vista") === "lista" ? "lista" : "estante"; } catch { /* sem armazenamento */ }
  const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* Sugestões de categoria e série: as padrão mais as que já foram usadas */
  function atualizarSugestoes() {
    const opcoes = valores => [...new Set(valores.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map(v => `<option value="${escapeHtml(v)}"></option>`).join("");
    $("#livrosCategorias").innerHTML = opcoes([...LIVROS_CATEGORIAS, ...livros.map(l => (l.categoria || "").trim())]);
    $("#livrosSeries").innerHTML = opcoes(livros.map(l => (l.serie || "").trim()));
  }

  const ajustarEmprestimo = () => { $("#livroEmprestimo").hidden = f.situacao.value !== "tenho"; };
  f.situacao.addEventListener("change", ajustarEmprestimo);

  /* Capa: endereço colado, foto do aparelho ou escolha entre as encontradas */
  const capaPreview = $("#livroCapaPreview");
  const capaUrl = $("#livroCapaUrl");
  const capaOpcoes = $("#livroCapaOpcoes");
  function mostrarCapa(valor) {
    capa = valor || "";
    capaPreview.hidden = !capa;
    if (capa) capaPreview.src = capa; else capaPreview.removeAttribute("src");
    capaUrl.value = capa.startsWith("data:") ? "" : capa;
    $("#livroCapaTirar").hidden = !capa;
  }
  capaUrl.addEventListener("change", () => {
    const v = capaUrl.value.trim();
    mostrarCapa(/^https:\/\//.test(v) ? v : "");
    if (v && !capa) toast("Use um endereço que comece com https://");
  });
  $("#livroCapaFoto").addEventListener("change", async e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try { mostrarCapa(await capaDeArquivo(file)); capaOpcoes.innerHTML = ""; }
    catch { toast("Não consegui abrir essa imagem."); }
  });
  $("#livroCapaTirar").addEventListener("click", () => mostrarCapa(""));
  $("#livroCapaBuscar").addEventListener("click", async e => {
    const titulo = f.titulo.value.trim();
    if (!titulo) { toast("Escreva o título primeiro."); f.titulo.focus(); return; }
    const botao = e.currentTarget;
    botao.disabled = true;
    capaOpcoes.innerHTML = `<p class="muted small">Buscando…</p>`;
    const capas = await buscarCapas(titulo, f.autor.value.trim());
    botao.disabled = false;
    capaOpcoes.innerHTML = capas.length
      ? `<p class="muted small livros-capa-aviso">Toque na capa certa:</p>` + capas.map(u =>
        `<button class="livros-capa-opcao" type="button" data-capa="${escapeHtml(u)}"><img class="livros-capa" src="${escapeHtml(u)}" alt="Capa encontrada" loading="lazy" /></button>`).join("")
      : `<p class="muted small">Nenhuma capa encontrada (ou sem internet). Use "Foto da capa".</p>`;
  });
  capaOpcoes.addEventListener("click", e => {
    const b = e.target.closest("[data-capa]");
    if (!b) return;
    mostrarCapa(b.dataset.capa);
    capaOpcoes.innerHTML = "";
  });
  /* Capa que não carrega (sem internet ou endereço quebrado): some, sem quebrar o cartão */
  const esconderCapaQuebrada = e => {
    if (!e.target.matches?.("img.livros-capa")) return;
    const opcao = e.target.closest(".livros-capa-opcao");
    if (opcao) opcao.remove(); else e.target.hidden = true;
  };
  lista.addEventListener("error", esconderCapaQuebrada, true);
  capaOpcoes.addEventListener("error", esconderCapaQuebrada, true);

  async function buscarIsbn() {
    const isbn = f.isbn.value.replace(/[^\dXx]/g, "").toUpperCase();
    if (!/^(97[89]\d{10}|\d{9}[\dX])$/.test(isbn)) { toast("Esse ISBN não parece certo: são 13 números, começando com 978."); f.isbn.focus(); return; }
    f.isbn.value = isbn;
    const ja = livros.find(l => l.isbn === isbn && l.id !== editando);
    if (ja) toast(`Você já tem "${ja.titulo}" na lista.`);
    const botao = $("#livroIsbnBuscar");
    botao.disabled = true;
    botao.textContent = "Buscando…";
    const dados = await dadosPorIsbn(isbn);
    const capaAchada = capa ? "" : await capaPorIsbn(isbn, dados?.capa);
    botao.disabled = false;
    botao.textContent = "🔎 Buscar pelo ISBN";
    if (!dados && !capaAchada) { toast("Não achei esse ISBN (ou estou sem internet). Preencha à mão."); return; }
    if (dados) {
      if (!f.titulo.value.trim()) f.titulo.value = dados.titulo;
      if (!f.autor.value.trim() && dados.autor) f.autor.value = dados.autor;
      if (!f.paginas.value && dados.paginas) f.paginas.value = dados.paginas;
    }
    if (capaAchada) mostrarCapa(capaAchada);
    toast(dados ? `Achei: ${dados.titulo}. Confira e salve.` : "Achei a capa. Preencha o título e salve.");
  }
  $("#livroIsbnBuscar").addEventListener("click", buscarIsbn);
  f.isbn.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); buscarIsbn(); } });

  /* Leitor de código de barras (Chrome no Android). Sem suporte, o botão fica escondido e vale digitar o ISBN. */
  const scanner = $("#livroScanner");
  const video = $("#livroScanVideo");
  let camera = null;
  const pararCamera = () => {
    camera?.getTracks().forEach(t => t.stop());
    camera = null;
    video.srcObject = null;
  };
  if ("BarcodeDetector" in window && navigator.mediaDevices?.getUserMedia) {
    $("#livroScan").hidden = false;
    $("#livroScan").addEventListener("click", async () => {
      let detector;
      try {
        detector = new BarcodeDetector({ formats: ["ean_13"] });
        camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      } catch {
        toast("Não consegui abrir a câmera. Digite o número do código de barras.");
        return;
      }
      video.srcObject = camera;
      scanner.showModal();
      video.play().catch(() => {});
      while (camera && scanner.open) {
        try {
          const lido = (await detector.detect(video)).find(c => /^97[89]\d{10}$/.test(c.rawValue));
          if (lido) {
            scanner.close();
            f.isbn.value = lido.rawValue;
            if (navigator.vibrate) navigator.vibrate(80);
            buscarIsbn();
            break;
          }
        } catch { /* quadro ainda sem imagem */ }
        await new Promise(r => setTimeout(r, 250));
      }
    });
  }
  $("#livroScanFechar").addEventListener("click", () => scanner.close());
  scanner.addEventListener("close", pararCamera);

  function limparForm() {
    editando = null;
    form.reset();
    mostrarCapa("");
    capaOpcoes.innerHTML = "";
    ajustarEmprestimo();
    $("#livroFormTitle").textContent = "Adicionar livro";
    $("#livroSalvar").textContent = "Adicionar livro";
    $("#livroCancelar").hidden = true;
  }

  function editar(id) {
    const l = livros.find(x => x.id === id);
    if (!l) return;
    editando = id;
    Object.keys(f).forEach(k => { f[k].value = l[k] ?? ""; });
    if (!f.formato.value) f.formato.value = "fisico";
    mostrarCapa(l.capa);
    capaOpcoes.innerHTML = "";
    ajustarEmprestimo();
    $("#livroFormTitle").textContent = "Editar livro";
    $("#livroSalvar").textContent = "Salvar alterações";
    $("#livroCancelar").hidden = false;
    form.scrollIntoView({ block: "start" });
    f.titulo.focus({ preventScroll: true });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const dados = Object.fromEntries(Object.keys(f).map(k => [k, f[k].value.trim()]));
    if (!dados.titulo) return;
    dados.capa = capa;
    if (!editando) {
      const igual = livros.find(l => chaveLivro(l) === chaveLivro(dados) || (dados.isbn && l.isbn === dados.isbn));
      if (igual && !confirm(`"${igual.titulo}" já está na sua lista. Adicionar outro mesmo assim?`)) return;
    }
    if (dados.leitura === "li" && !dados.fim) dados.fim = localISODate();
    if (dados.leitura === "lendo" && !dados.inicio) dados.inicio = localISODate();
    if (dados.situacao !== "tenho" || !dados.pessoa) { dados.pessoa = ""; dados.desde = ""; }
    else if (!dados.desde) dados.desde = localISODate();
    const antes = livros;
    if (editando) livros = livros.map(l => l.id === editando ? { ...l, ...dados } : l);
    else livros = [...livros, { id: novoId(), ...dados }];
    if (!saveLivros(livros)) {
      livros = antes;
      toast("Não há espaço no aparelho para guardar. Tente sem a foto da capa.");
      return;
    }
    toast(editando ? "Livro atualizado." : "Livro adicionado.");
    limparForm();
    render();
  });
  $("#livroCancelar").addEventListener("click", limparForm);

  /* Fita no canto da capa ou do cartão: o que já foi lido salta aos olhos */
  function fitaHtml(l) {
    if (l.situacao === "comprar") return `<span class="livros-fita livros-fita--comprar" aria-hidden="true">🛒 Quero</span>`;
    if (l.leitura === "li") return `<span class="livros-fita livros-fita--li" aria-hidden="true">✓ Lido</span>`;
    if (l.leitura === "lendo") return `<span class="livros-fita livros-fita--lendo" aria-hidden="true">📖 Lendo</span>`;
    if (l.leitura === "parei") return `<span class="livros-fita livros-fita--parei" aria-hidden="true">⏸ Incompleta</span>`;
    return "";
  }
  const capaValida = l => /^(https:\/\/|data:image\/)/.test(l.capa || "");
  /* Cor da capa desenhada (livro sem foto): fixa para cada título */
  const corCapa = l => [...(l.titulo || "")].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 6;
  const estadoLivro = l => [
    l.situacao === "comprar" ? "quero comprar" : (LEITURA_LABEL[l.leitura] || "Não li").toLowerCase(),
    l.situacao === "tenho" && l.pessoa ? `emprestado para ${l.pessoa}` : ""
  ].filter(Boolean).join(", ");

  function estanteHtml(l) {
    const emprestado = l.situacao === "tenho" && l.pessoa;
    return `
      <button class="estante-livro" type="button" data-abrir="${escapeHtml(l.id)}" aria-label="${escapeHtml(`${l.titulo}${l.autor ? `, de ${l.autor}` : ""}: ${estadoLivro(l)}`)}">
        <span class="estante-capa estante-cor-${corCapa(l)}">
          <span class="estante-capa__titulo">${escapeHtml(l.titulo)}</span>
          ${l.autor ? `<span class="estante-capa__autor">${escapeHtml(l.autor)}</span>` : ""}
          ${capaValida(l) ? `<img class="livros-capa estante-capa__img" src="${escapeHtml(l.capa)}" alt="" loading="lazy" />` : ""}
          ${fitaHtml(l)}
          ${(l.leitura === "lendo" || l.leitura === "parei") && progressoLivro(l) ? `<progress class="estante-progresso" max="${progressoLivro(l).total}" value="${progressoLivro(l).pag}" aria-hidden="true"></progress>` : ""}
          ${LIVROS_FORMATO[l.formato] ? `<span class="estante-formato" aria-hidden="true">${LIVROS_FORMATO[l.formato]}</span>` : ""}
          ${emprestado ? `<span class="estante-selo" aria-hidden="true">↗ ${escapeHtml(l.pessoa)}</span>` : ""}
        </span>
        <span class="estante-livro__titulo">${escapeHtml(l.titulo)}</span>
        ${l.autor ? `<span class="estante-livro__autor">${escapeHtml(l.autor)}</span>` : ""}
      </button>`;
  }

  function progressoLinha(l) {
    const p = progressoLivro(l);
    const partes = [];
    if (p && l.leitura !== "li") partes.push(`Página ${p.pag} de ${p.total} (${p.pct}%)`);
    else if (p) partes.push(`${p.total} páginas`);
    if (l.inicio) partes.push(`comecei em ${fmtData(l.inicio)}`);
    if (l.fim && l.leitura === "li") partes.push(`terminei em ${fmtData(l.fim)}`);
    if (!partes.length) return "";
    return `<p class="muted small livros-progresso">${escapeHtml(partes.join(" · "))}</p>
      ${p && l.leitura !== "li" && l.leitura !== "nao" ? `<progress class="livros-barra" max="${p.total}" value="${p.pag}" aria-label="Progresso da leitura"></progress>` : ""}`;
  }

  function cardHtml(l) {
    const selos = l.situacao === "comprar" ? [] : [`<span class="badge">${LEITURA_LABEL[l.leitura] || "Não li"}</span>`];
    if (l.situacao === "comprar") selos.push(`<span class="badge livros-comprar">Quero comprar${parseValor(l.preco) ? ` · ${fmtReal(parseValor(l.preco))}` : ""}</span>`);
    if (l.situacao === "tenho" && l.pessoa) {
      const d = diasDesde(l.desde);
      const ha = d === null ? "" : d === 0 ? " · desde hoje" : ` · há ${d} ${d === 1 ? "dia" : "dias"}`;
      selos.push(`<span class="badge livros-emprestado">Emprestado para ${escapeHtml(l.pessoa)}${ha}</span>`);
    }
    const acoes = [
      l.situacao === "tenho" && l.pessoa ? `<button class="pill" type="button" data-acao="devolvido">Devolvido</button>` : "",
      l.situacao === "comprar" ? `<button class="pill" type="button" data-acao="comprei">Comprei</button>` : "",
      l.situacao === "tenho" && l.leitura !== "li" ? `<button class="pill" type="button" data-acao="li">✓ Marcar como lido</button>` : "",
      l.situacao === "tenho" && l.leitura !== "lendo" && l.leitura !== "li" ? `<button class="pill" type="button" data-acao="lendo">📖 ${l.leitura === "parei" ? "Voltei a ler" : "Estou lendo"}</button>` : "",
      l.situacao === "tenho" && l.leitura === "lendo" ? `<button class="pill" type="button" data-acao="parei">⏸ Parei no meio</button>` : "",
      l.leitura === "lendo" || l.leitura === "parei" ? `<button class="pill" type="button" data-acao="pagina">📄 Em que página estou</button>` : "",
      `<button class="pill" type="button" data-acao="editar">Editar</button>`,
      `<button class="pill" type="button" data-acao="remover">Remover</button>`
    ].join("");
    const serie = l.serie ? `${l.serie}${parseInteiro(l.volume) ? `, vol. ${parseInteiro(l.volume)}` : ""}` : "";
    const meta = [l.autor, l.categoria, serie, LIVROS_FORMATO[l.formato]].filter(Boolean).map(escapeHtml).join(" · ");
    const capaOk = capaValida(l);
    return `
      <article class="card livros-item${capaOk ? " livros-item--capa" : ""}" data-id="${escapeHtml(l.id)}">
        ${fitaHtml(l)}
        ${capaOk ? `<img class="livros-capa" src="${escapeHtml(l.capa)}" alt="" loading="lazy" />` : ""}
        <h3 class="livros-item__titulo">${escapeHtml(l.titulo)}</h3>
        ${meta ? `<p class="muted small">${meta}</p>` : ""}
        <div class="livros-item__selos">${selos.join("")}</div>
        ${progressoLinha(l)}
        ${l.notas ? `<p class="livros-item__notas">${escapeHtml(l.notas)}</p>` : ""}
        <div class="trail-links">${acoes}</div>
      </article>`;
  }

  function listaCompra() {
    const quero = livros.filter(l => l.situacao === "comprar").sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    if (!quero.length) return "Nenhum livro na lista de compras.";
    const linhas = quero.map(l => `• ${l.titulo}${l.autor ? ` (${l.autor})` : ""}${parseValor(l.preco) ? ` — ${fmtReal(parseValor(l.preco))}` : ""}`);
    const total = quero.reduce((s, l) => s + parseValor(l.preco), 0);
    return `Livros para comprar:\n${linhas.join("\n")}${total ? `\nTotal: ${fmtReal(total)}` : ""}`;
  }

  function render() {
    $("#livrosFiltros").innerHTML = LIVROS_FILTROS.map(x =>
      `<button class="pill" type="button" data-filtro="${x.k}" aria-pressed="${x.k === filtro}">${x.label} (${livros.filter(x.test).length})</button>`).join("");
    const termo = $("#livrosBusca").value.trim().toLowerCase();
    const teste = LIVROS_FILTROS.find(x => x.k === filtro).test;
    const vistos = livros
      .filter(teste)
      .filter(l => !termo || [l.titulo, l.autor, l.pessoa, l.categoria, l.serie, l.isbn].some(v => (v || "").toLowerCase().includes(termo)))
      .sort(ordemLivro);
    const g = LIVROS_GRUPOS[agrupar.value] || LIVROS_GRUPOS.categoria;
    const grupos = new Map();
    vistos.forEach(l => {
      const nome = g.chave(l) || g.vazio;
      grupos.set(nome, [...(grupos.get(nome) || []), l]);
    });
    const nomes = [...grupos.keys()].sort((a, b) => (a === g.vazio) - (b === g.vazio) || a.localeCompare(b, "pt-BR"));
    lista.innerHTML = nomes.map(nome => `
      <section class="livros-grupo">
        ${nome ? `<h3 class="livros-grupo__titulo">${escapeHtml(nome)} <span class="muted small">(${grupos.get(nome).length})</span></h3>` : ""}
        ${vista.value === "lista"
          ? `<div class="livros-lista">${grupos.get(nome).map(cardHtml).join("")}</div>`
          : `<div class="estante">${grupos.get(nome).map(estanteHtml).join("")}</div>`}
      </section>`).join("");
    atualizarSugestoes();
    const conta = teste => livros.filter(teste).length;
    $("#livrosContagem").textContent = livros.length
      ? [`${vistos.length} de ${livros.length} ${livros.length === 1 ? "livro" : "livros"}`,
        `${conta(l => l.leitura === "li")} lidos`,
        `${conta(l => l.leitura === "lendo")} lendo`,
        `${conta(l => l.leitura === "parei")} incompletos`,
        `${conta(l => l.situacao === "tenho" && !!l.pessoa)} emprestados`].join(" · ")
      : "";
    $("#livrosVazio").hidden = livros.length > 0;
    $("#livrosCompra").textContent = listaCompra();
  }

  $("#livrosFiltros").addEventListener("click", e => {
    const b = e.target.closest("[data-filtro]");
    if (!b) return;
    filtro = b.dataset.filtro;
    render();
  });
  $("#livrosBusca").addEventListener("input", render);
  agrupar.addEventListener("change", render);
  vista.addEventListener("change", () => {
    try { localStorage.setItem("foco.livros.vista", vista.value); } catch { /* sem armazenamento */ }
    render();
  });

  const detalhe = $("#livroDetalhe");
  const abrirDetalhe = id => {
    const l = livros.find(x => x.id === id);
    if (!l) { if (detalhe.open) detalhe.close(); return; }
    $("#livroDetalheCorpo").innerHTML = cardHtml(l);
    if (!detalhe.open) detalhe.showModal();
  };
  function acaoLivro(e) {
    const aberto = e.target.closest("[data-abrir]");
    if (aberto) return abrirDetalhe(aberto.dataset.abrir);
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    const id = b.closest(".livros-item").dataset.id;
    const l = livros.find(x => x.id === id);
    if (b.dataset.acao === "editar") { if (detalhe.open) detalhe.close(); return editar(id); }
    if (b.dataset.acao === "remover") {
      if (!confirm(`Remover "${l.titulo}"?`)) return;
      livros = livros.filter(x => x.id !== id);
      if (editando === id) limparForm();
    }
    if (b.dataset.acao === "devolvido") { l.pessoa = ""; l.desde = ""; toast("Empréstimo encerrado."); }
    if (b.dataset.acao === "comprei") { l.situacao = "tenho"; toast("Livro na sua biblioteca."); }
    if (b.dataset.acao === "li") {
      l.leitura = "li";
      if (!l.fim) l.fim = localISODate();
      if (parseInteiro(l.paginas)) l.pagina = l.paginas;
      toast("Marcado como lido. ✓");
    }
    if (b.dataset.acao === "lendo") { l.leitura = "lendo"; if (!l.inicio) l.inicio = localISODate(); toast("Boa leitura!"); }
    if (b.dataset.acao === "pagina") {
      const resp = prompt(`Em que página de "${l.titulo}" você está?${parseInteiro(l.paginas) ? ` (o livro tem ${l.paginas})` : ""}`, l.pagina || "");
      if (resp === null) return;
      l.pagina = String(parseInteiro(resp));
      if (!parseInteiro(l.paginas)) {
        const total = prompt("Quantas páginas tem o livro? (para mostrar a porcentagem)", "");
        if (total) l.paginas = String(parseInteiro(total, 1));
      }
    }
    if (b.dataset.acao === "parei") { l.leitura = "parei"; toast("Marcado como leitura incompleta."); }
    saveLivros(livros);
    render();
    if (detalhe.open) abrirDetalhe(id);
  }
  lista.addEventListener("click", acaoLivro);
  detalhe.addEventListener("click", e => {
    if (e.target === detalhe) return detalhe.close(); /* toque fora da janela */
    acaoLivro(e);
  });
  $("#livroDetalheFechar").addEventListener("click", () => detalhe.close());
  detalhe.addEventListener("error", e => { if (e.target.matches?.("img.livros-capa")) e.target.hidden = true; }, true);

  $("#livrosCopiar").addEventListener("click", e => copyText(listaCompra(), e.currentTarget));
  const shareBtn = $("#livrosShare");
  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", () => navigator.share({ title: "Livros para comprar", text: listaCompra() }).catch(() => {}));
  }

  $("#livrosExport").addEventListener("click", () => baixarJson(`meus-livros-${localISODate()}.json`, { app: "foco-livros", versao: 1, livros }));
  $("#livrosImport").addEventListener("change", async e => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dados = JSON.parse(await file.text());
      const novos = Array.isArray(dados) ? dados : dados.livros;
      if (!Array.isArray(novos) || novos.some(l => !l || !l.titulo)) throw new Error("formato");
      if (!confirm(`Trocar a lista atual pelos ${novos.length} livros da cópia?`)) return;
      livros = novos.map(l => ({ id: novoId(), situacao: "tenho", leitura: "nao", ...l }));
      saveLivros(livros);
      limparForm();
      render();
      toast("Cópia restaurada.");
    } catch {
      toast("Este arquivo não é uma cópia de Meus livros.");
    }
  });

  function aplicarLink() {
    const doLink = livrosDoLink();
    if (!doLink) return;
    history.replaceState(null, "", location.pathname + location.search);
    const porChave = new Map(livros.map(l => [chaveLivro(l), l]));
    const novos = doLink.filter(l => !porChave.has(chaveLivro(l)));
    /* Livro que já existe: o link só preenche campos vazios (capa, formato, série...), nunca troca o que o dono escreveu */
    const completar = doLink.filter(l => porChave.has(chaveLivro(l)))
      .map(l => [porChave.get(chaveLivro(l)), Object.entries(l).filter(([k, v]) => k !== "id" && v && !porChave.get(chaveLivro(l))[k])])
      .filter(([, campos]) => campos.length);
    if (!novos.length && !completar.length) { toast("Esses livros já estão na sua lista."); return; }
    const partes = [
      novos.length ? `acrescentar ${novos.length} ${novos.length === 1 ? "livro" : "livros"}` : "",
      completar.length ? `completar ${completar.length} que já ${completar.length === 1 ? "existe" : "existem"} (só campos vazios, como a capa)` : ""
    ].filter(Boolean).join(" e ");
    if (!confirm(`Deseja ${partes}? Nada do que já existe será apagado.`)) return;
    livros.push(...novos.map(l => ({ situacao: "tenho", leitura: "nao", ...l, id: novoId() })));
    completar.forEach(([livro, campos]) => Object.assign(livro, Object.fromEntries(campos)));
    saveLivros(livros);
    render();
    toast([novos.length ? `${novos.length} acrescentado(s)` : "", completar.length ? `${completar.length} completado(s)` : ""].filter(Boolean).join(", ") + ".");
  }

  document.addEventListener("foco:nuvem", e => { if (e.detail === LIVROS_KEY) { livros = loadLivros(); render(); } });
  ajustarEmprestimo();
  render();
  aplicarLink();
  window.addEventListener("hashchange", aplicarLink);
}

/* ==========================================================================
   Sincronizar entre aparelhos (spec 010): Meus livros e Contas da casa num
   repositório PRIVADO do dono no GitHub (livros.json e contas.json).
   O nome do repositório e a chave ficam só no aparelho (localStorage);
   nada disso entra no código publicado.
   Mescla em três vias: o que mudou aqui, o que mudou na nuvem e a última
   versão sincronizada (base). Assim nenhum aparelho apaga o que o outro fez.
   ========================================================================== */
const NUVEM_KEY = "foco.nuvem.v1";
const NUVEM_ARQUIVOS = {
  "livros.json": { key: LIVROS_KEY, chave: chaveLivro },
  "contas.json": { key: CONTAS_KEY }
};

function nuvemConfig() {
  try {
    const c = JSON.parse(localStorage.getItem(NUVEM_KEY) || "null");
    return c && c.repo && c.token ? c : null;
  } catch { return null; }
}
function lerLista(k) {
  try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
const igualJson = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
function b64DeTexto(texto) {
  const bytes = new TextEncoder().encode(texto);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
const textoDeB64 = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));
const b64url = texto => b64DeTexto(texto).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function nuvemApi(cfg, caminho, opcoes = {}) {
  const r = await fetch(`https://api.github.com/repos/${cfg.repo}${caminho ? `/${caminho}` : ""}`, {
    cache: "no-store",
    ...opcoes,
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${cfg.token}`, "X-GitHub-Api-Version": "2022-11-28" }
  });
  if (r.status === 404 && !opcoes.method && caminho) return null;
  if (!r.ok) { const e = new Error(`GitHub ${r.status}`); e.status = r.status; throw e; }
  return r.json();
}

async function nuvemLer(cfg, arquivo) {
  const f = await nuvemApi(cfg, `contents/${arquivo}`);
  if (!f) return { itens: null, sha: null };
  /* Arquivo acima de 1 MB (muitas fotos de capa) vem sem conteúdo: busca pelo blob */
  const conteudo = f.encoding === "base64" && f.content ? f.content : (await nuvemApi(cfg, `git/blobs/${f.sha}`)).content;
  const dados = JSON.parse(textoDeB64(conteudo));
  return { itens: Array.isArray(dados) ? dados : (dados.itens || []), sha: f.sha };
}

function nuvemGravar(cfg, arquivo, itens, sha) {
  const corpo = {
    message: `Atualiza ${arquivo}`,
    content: b64DeTexto(JSON.stringify({ app: "foco-vibracional", versao: 1, itens }, null, 1)),
    ...(sha ? { sha } : {})
  };
  return nuvemApi(cfg, `contents/${arquivo}`, { method: "PUT", body: JSON.stringify(corpo) });
}

/* Mescla em três vias, item por item (pelo id) e campo por campo */
function mesclar3(local, base, remoto, chave) {
  const mapa = lista => new Map(lista.map(x => [x.id, x]));
  const L = mapa(local), B = mapa(base), R = mapa(remoto);
  const fim = [];
  [...new Set([...L.keys(), ...R.keys(), ...B.keys()])].forEach(id => {
    const l = L.get(id), b = B.get(id), r = R.get(id);
    const mudouAqui = !igualJson(l, b), mudouLa = !igualJson(r, b);
    let x;
    if (!mudouAqui) x = r;
    else if (!mudouLa) x = l;
    else if (!l || !r) x = l || r; /* apagado de um lado e editado do outro: fica a edição */
    else {
      x = { ...r };
      Object.keys({ ...l, ...r }).forEach(k => { if (!igualJson(l[k], b?.[k])) x[k] = l[k]; });
    }
    if (x) fim.push(x);
  });
  if (!chave) return fim;
  /* O mesmo livro criado nos dois aparelhos (ex.: pelo mesmo link): fica o que já estava na nuvem */
  const naNuvem = new Set(fim.filter(x => R.has(x.id)).map(chave));
  return fim.filter(x => R.has(x.id) || B.has(x.id) || !naNuvem.has(chave(x)));
}

let nuvemRodando = null;
let nuvemDeNovo = false;
let nuvemMudouDurante = false;
document.addEventListener("foco:salvo", () => { if (nuvemRodando) nuvemMudouDurante = true; });

async function sincronizarArquivo(cfg, arquivo, conf, tentativa = 0) {
  const baseKey = `foco.nuvem.base.${arquivo}`;
  nuvemMudouDurante = false;
  const remoto = await nuvemLer(cfg, arquivo);
  const local = lerLista(conf.key);
  const fim = remoto.itens ? mesclar3(local, lerLista(baseKey), remoto.itens, conf.chave) : local;
  if (!remoto.itens || !igualJson(fim, remoto.itens)) {
    try { await nuvemGravar(cfg, arquivo, fim, remoto.sha); }
    catch (e) {
      /* Outro aparelho gravou no meio do caminho: lê de novo e mescla outra vez */
      if ((e.status === 409 || e.status === 422) && tentativa < 2) return sincronizarArquivo(cfg, arquivo, conf, tentativa + 1);
      throw e;
    }
  }
  /* Se o dono mexeu enquanto sincronizava, não sobrescreve: roda de novo logo depois */
  if (nuvemMudouDurante) { nuvemDeNovo = true; return; }
  try {
    if (!igualJson(fim, local)) {
      localStorage.setItem(conf.key, JSON.stringify(fim));
      document.dispatchEvent(new CustomEvent("foco:nuvem", { detail: conf.key }));
    }
    localStorage.setItem(baseKey, JSON.stringify(fim));
  } catch { /* aparelho sem espaço: a nuvem já tem tudo */ }
}

function nuvemErro(e) {
  if (!navigator.onLine || e instanceof TypeError) return "Sem internet: as mudanças ficam neste aparelho e sobem quando a internet voltar.";
  if (e.status === 401) return "A chave não foi aceita (errada, vencida ou apagada). Confira ou crie outra.";
  if (e.status === 403 || e.status === 404) return "Sem acesso ao repositório. Confira o nome e se a chave tem a permissão Contents: Read and write.";
  return `Não consegui sincronizar (${e.message}). Tento de novo na próxima mudança.`;
}

function nuvemStatus(texto, erro = false) {
  const el = $("#nuvemStatus");
  if (!el) return;
  el.textContent = texto;
  el.classList.toggle("nuvem-erro", erro);
}

function sincronizar() {
  const cfg = nuvemConfig();
  if (!cfg) return Promise.resolve();
  if (nuvemRodando) { nuvemDeNovo = true; return nuvemRodando; }
  nuvemStatus("Sincronizando…");
  nuvemRodando = (async () => {
    try {
      for (const [arquivo, conf] of Object.entries(NUVEM_ARQUIVOS)) await sincronizarArquivo(cfg, arquivo, conf);
      nuvemStatus(`Sincronizado às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`);
    } catch (e) {
      nuvemStatus(nuvemErro(e), true);
    } finally {
      nuvemRodando = null;
      if (nuvemDeNovo) { nuvemDeNovo = false; setTimeout(sincronizar, 300); }
    }
  })();
  return nuvemRodando;
}

/* Confere o repositório antes de guardar: precisa existir, aceitar a chave e ser PRIVADO */
async function nuvemConectar(cfg) {
  const repo = await nuvemApi(cfg, "");
  if (!repo.private) throw Object.assign(new Error("público"), { publico: true });
  localStorage.setItem(NUVEM_KEY, JSON.stringify({ repo: repo.full_name, token: cfg.token }));
}

function initNuvem() {
  const caixa = $("#nuvem");
  if (!caixa) return;

  function desenhar() {
    const cfg = nuvemConfig();
    caixa.innerHTML = `
      <h2 id="nuvemTitle">Sincronizar entre aparelhos</h2>
      ${cfg ? `
        <p class="muted small">Conectado ao repositório privado <b>${escapeHtml(cfg.repo)}</b>. Livros e contas ficam iguais em todos os aparelhos conectados.</p>
        <p class="small" id="nuvemStatus" aria-live="polite"></p>
        <div class="trail-links">
          <button class="pill" type="button" id="nuvemAgora">🔄 Sincronizar agora</button>
          <button class="pill" type="button" id="nuvemLink">🔗 Copiar link de conexão</button>
          <button class="pill" type="button" id="nuvemSair">Desconectar este aparelho</button>
        </div>
        <p class="muted small">O link de conexão leva a chave junto. Mande só para você mesmo (por exemplo, no seu próprio WhatsApp) e abra no outro aparelho.</p>` : `
        <p class="muted small">Para ver e mudar a mesma lista no computador e no celular, conecte um repositório <b>privado</b> seu no GitHub. Os dados ficam lá, em <code>livros.json</code> e <code>contas.json</code>, e não aparecem no site.</p>
        <form class="form-row nuvem-form" id="nuvemForm">
          <label class="form-group">
            <span class="form-label">Repositório (dono/nome)</span>
            <input type="text" id="nuvemRepo" class="form-input" placeholder="felipecosta-silva/foco-dados" autocomplete="off" spellcheck="false" required />
          </label>
          <label class="form-group">
            <span class="form-label">Chave de acesso (token)</span>
            <input type="password" id="nuvemToken" class="form-input" placeholder="github_pat_…" autocomplete="off" required />
          </label>
          <button class="btn" type="submit">Conectar</button>
        </form>
        <p class="small" id="nuvemStatus" aria-live="polite"></p>`}`;
  }

  async function conectar(cfg) {
    nuvemStatus("Conferindo o repositório…");
    try {
      await nuvemConectar(cfg);
    } catch (e) {
      nuvemStatus(e.publico ? "Esse repositório é público: qualquer um veria seus dados. Use um repositório privado." : nuvemErro(e), true);
      return false;
    }
    desenhar();
    toast("Aparelho conectado.");
    await sincronizar();
    return true;
  }

  caixa.addEventListener("submit", e => {
    if (e.target.id !== "nuvemForm") return;
    e.preventDefault();
    const repo = $("#nuvemRepo").value.trim().replace(/^https:\/\/github\.com\//, "").replace(/\.git$|\/$/g, "");
    const token = $("#nuvemToken").value.trim();
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) { nuvemStatus("Escreva o repositório como dono/nome.", true); return; }
    conectar({ repo, token });
  });

  caixa.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.id === "nuvemAgora") sincronizar();
    if (b.id === "nuvemLink") {
      const cfg = nuvemConfig();
      copyText(`${location.origin}${location.pathname}#conectar=${b64url(JSON.stringify({ repo: cfg.repo, token: cfg.token }))}`, b);
    }
    if (b.id === "nuvemSair" && confirm("Desconectar este aparelho? A lista continua aqui e na nuvem, só para de sincronizar.")) {
      localStorage.removeItem(NUVEM_KEY);
      Object.keys(NUVEM_ARQUIVOS).forEach(a => localStorage.removeItem(`foco.nuvem.base.${a}`));
      desenhar();
    }
  });

  /* Link "#conectar=…" vindo do outro aparelho (o trecho depois do # não sai do aparelho) */
  async function conectarPeloLink() {
    const m = location.hash.match(/^#conectar=([\w-]+)$/);
    if (!m) return;
    history.replaceState(null, "", location.pathname + location.search);
    let cfg;
    try {
      cfg = JSON.parse(textoDeB64(m[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (!cfg.repo || !cfg.token) throw new Error("link");
    } catch { toast("Link de conexão inválido."); return; }
    if (confirm(`Conectar este aparelho ao repositório ${cfg.repo}?`)) await conectar(cfg);
  }

  let espera;
  document.addEventListener("foco:salvo", () => { clearTimeout(espera); espera = setTimeout(sincronizar, 1500); });
  window.addEventListener("online", sincronizar);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sincronizar(); });
  window.addEventListener("hashchange", conectarPeloLink);

  desenhar();
  conectarPeloLink();
  sincronizar();
}
