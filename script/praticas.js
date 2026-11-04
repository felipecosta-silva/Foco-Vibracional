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
const LEITURA_LABEL = { nao: "Não li", lendo: "Lendo", li: "Li" };
const LIVROS_FILTROS = [
  { k: "todos", label: "Todos", test: () => true },
  { k: "tenho", label: "Tenho", test: l => l.situacao === "tenho" },
  { k: "comprar", label: "Quero comprar", test: l => l.situacao === "comprar" },
  { k: "emprestados", label: "Emprestados", test: l => l.situacao === "tenho" && !!l.pessoa },
  { k: "nao", label: "Não li", test: l => l.situacao === "tenho" && l.leitura !== "li" },
  { k: "li", label: "Li", test: l => l.leitura === "li" }
];

function loadLivros() {
  try {
    const livros = JSON.parse(localStorage.getItem(LIVROS_KEY) || "[]");
    return Array.isArray(livros) ? livros : [];
  } catch { return []; }
}
function saveLivros(livros) {
  try { localStorage.setItem(LIVROS_KEY, JSON.stringify(livros)); } catch { /* janela anônima: segue sem guardar */ }
}

function diasDesde(iso) {
  if (!iso) return null;
  const hoje = dataLocal(localISODate());
  return Math.max(0, Math.round((hoje - dataLocal(iso)) / DIA_MS));
}

function initLivros() {
  const lista = $("#livrosLista");
  const form = $("#livroForm");
  if (!lista || !form) return;
  let livros = loadLivros();
  let filtro = "todos";
  let editando = null;
  const f = {
    titulo: $("#livroTitulo"), autor: $("#livroAutor"), situacao: $("#livroSituacao"), leitura: $("#livroLeitura"),
    preco: $("#livroPreco"), pessoa: $("#livroPessoa"), desde: $("#livroDesde"), notas: $("#livroNotas")
  };

  const ajustarEmprestimo = () => { $("#livroEmprestimo").hidden = f.situacao.value !== "tenho"; };
  f.situacao.addEventListener("change", ajustarEmprestimo);

  function limparForm() {
    editando = null;
    form.reset();
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
    if (dados.situacao !== "tenho" || !dados.pessoa) { dados.pessoa = ""; dados.desde = ""; }
    else if (!dados.desde) dados.desde = localISODate();
    if (editando) {
      livros = livros.map(l => l.id === editando ? { ...l, ...dados } : l);
      toast("Livro atualizado.");
    } else {
      livros.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ...dados });
      toast("Livro adicionado.");
    }
    saveLivros(livros);
    limparForm();
    render();
  });
  $("#livroCancelar").addEventListener("click", limparForm);

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
      `<button class="pill" type="button" data-acao="editar">Editar</button>`,
      `<button class="pill" type="button" data-acao="remover">Remover</button>`
    ].join("");
    return `
      <article class="card livros-item" data-id="${l.id}">
        <h3 class="livros-item__titulo">${escapeHtml(l.titulo)}</h3>
        ${l.autor ? `<p class="muted small">${escapeHtml(l.autor)}</p>` : ""}
        <div class="livros-item__selos">${selos.join("")}</div>
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
      .filter(l => !termo || [l.titulo, l.autor, l.pessoa].some(v => (v || "").toLowerCase().includes(termo)))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    lista.innerHTML = vistos.map(cardHtml).join("");
    $("#livrosContagem").textContent = livros.length
      ? `${vistos.length} de ${livros.length} ${livros.length === 1 ? "livro" : "livros"}`
      : "Nenhum livro ainda. Comece pelo formulário acima.";
    $("#livrosCompra").textContent = listaCompra();
  }

  $("#livrosFiltros").addEventListener("click", e => {
    const b = e.target.closest("[data-filtro]");
    if (!b) return;
    filtro = b.dataset.filtro;
    render();
  });
  $("#livrosBusca").addEventListener("input", render);

  lista.addEventListener("click", e => {
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    const id = b.closest(".livros-item").dataset.id;
    const l = livros.find(x => x.id === id);
    if (b.dataset.acao === "editar") return editar(id);
    if (b.dataset.acao === "remover") {
      if (!confirm(`Remover "${l.titulo}"?`)) return;
      livros = livros.filter(x => x.id !== id);
      if (editando === id) limparForm();
    }
    if (b.dataset.acao === "devolvido") { l.pessoa = ""; l.desde = ""; toast("Empréstimo encerrado."); }
    if (b.dataset.acao === "comprei") { l.situacao = "tenho"; toast("Livro na sua biblioteca."); }
    saveLivros(livros);
    render();
  });

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
      livros = novos.map(l => ({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), situacao: "tenho", leitura: "nao", ...l }));
      saveLivros(livros);
      limparForm();
      render();
      toast("Cópia restaurada.");
    } catch {
      toast("Este arquivo não é uma cópia de Meus livros.");
    }
  });

  ajustarEmprestimo();
  render();
}
