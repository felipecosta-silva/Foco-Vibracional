/* Foco Vibracional • colheita-calendario.js
   Colheita pela lua e calendário lunar.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Página: Colheita Sagrada & Fases Lunares (colheita.html)
   ========================================================================== */
function initColheitaPage() {
  const grid = $("#harvestGrid");
  const count = $("#harvestCount");
  const empty = $("#harvestEmpty");
  if (!grid || !count) return;

  const qInput = $("#qHarvest");
  const fParte = $("#fParteHarvest");
  const fIntencao = $("#fIntencaoHarvest");
  const clearBtn = $("#clearHarvest");
  const lunarBtns = $all(".lunarpick");

  const CARDS = [
    {
      titulo: "Lua Nova • intenção e recomeço",
      lua: "nova",
      parte: "folhas",
      intencao: "prosperidade",
      resumo: "Culturalmente associada a iniciar ciclos e plantar intenções.",
      avancado: "Bom para planejamento/propósito. Evite agir com pressa: intenção primeiro, prática depois."
    },
    {
      titulo: "Lua Crescente • crescimento",
      lua: "crescente",
      parte: "folhas",
      intencao: "energia",
      resumo: "Símbolo de expansão e construção (crescer, fortalecer).",
      avancado: "Em algumas tradições, combina com práticas de fortalecimento e progresso."
    },
    {
      titulo: "Lua Cheia • força e plenitude",
      lua: "cheia",
      parte: "flores",
      intencao: "harmonizacao",
      resumo: "Ligada à potência e plenitude; energia ‘alta’.",
      avancado: "Boa para ritos de celebração e harmonização. Para sensíveis, pode ser ‘intensa’."
    },
    {
      titulo: "Lua Minguante • limpeza",
      lua: "minguante",
      parte: "folhas",
      intencao: "limpeza",
      resumo: "Associada a descarregar e finalizar ciclos (limpar, soltar).",
      avancado: "Usada culturalmente para práticas de descarrego. Cautela com ervas fortes se você é sensível."
    },
    {
      titulo: "Folhas • uso comum e versátil",
      lua: "todas",
      parte: "folhas",
      intencao: "calma",
      resumo: "Folhas costumam ser a parte mais usada por iniciantes (dependendo da erva).",
      avancado: "Prefira folhas saudáveis e limpas. Se não conhece a planta, não use."
    },
    {
      titulo: "Flores • energia sutil",
      lua: "todas",
      parte: "flores",
      intencao: "harmonizacao",
      resumo: "Flores são associadas a suavidade e harmonização (ex.: alfazema, camomila).",
      avancado: "Guarde bem para evitar mofo. Se for usar aroma, ventile o ambiente."
    },
    {
      titulo: "Cascas/raízes • cautela",
      lua: "todas",
      parte: "raizes",
      intencao: "protecao",
      resumo: "Partes mais densas (casca/raiz) exigem cuidado e orientação.",
      avancado: "Evite como iniciante sem aprendizado direto. Algumas podem ser irritantes/tóxicas."
    },
    {
      titulo: "Sementes • potencial",
      lua: "todas",
      parte: "sementes",
      intencao: "prosperidade",
      resumo: "Sementes simbolizam potencial e continuidade (ciclo).",
      avancado: "Use como símbolo/estudo; práticas variam muito por tradição."
    }
  ];

  let moonLock = "todas";

  function render() {
    const q = (qInput?.value || "").toLowerCase().trim();
    const parte = fParte?.value || "todas";
    const intencao = fIntencao?.value || "todas";

    const filtered = CARDS.filter(c => {
      const hay = (c.titulo + " " + c.resumo + " " + c.intencao + " " + c.parte).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okMoon = (moonLock === "todas") || (c.lua === moonLock) || (c.lua === "todas");
      const okParte = (parte === "todas") || (c.parte === parte);
      const okInt = (intencao === "todas") || (c.intencao === intencao);
      return okQ && okMoon && okParte && okInt;
    });

    count.textContent = String(filtered.length);
    grid.innerHTML = "";
    if (empty) empty.hidden = filtered.length > 0;

    filtered.forEach(c => {
      const card = document.createElement("div");
      card.className = "info-card";
      card.innerHTML = `
        <div class="info-card__top">
          <div>
            <h3 class="info-title">${c.titulo}</h3>
            <p class="muted small info-desc">${c.resumo}</p>
          </div>
          <div class="badges">
            <span class="badge">${c.lua === "todas" ? "lua: qualquer" : "lua: " + c.lua}</span>
            <span class="badge">parte: ${c.parte}</span>
            <span class="badge">intenção: ${c.intencao}</span>
          </div>
        </div>
        <ul class="kv advanced-only">
          <li><b>Notas de estudo (avançado):</b> <span>${c.avancado}</span></li>
        </ul>
      `;
      grid.appendChild(card);
    });
  }

  // Banner da Lua de Hoje em colheita.html
  const todayMoonHarvest = initTodayMoonBanner("#colheitaMoonBanner", (phaseKey) => {
    lunarBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-moon") === phaseKey));
    moonLock = phaseKey;
    render();
    toast(`Filtrado para a Lua de Hoje (${todayMoonHarvest.name}) ✨`);
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (qInput) qInput.addEventListener("input", render);
  if (fParte) fParte.addEventListener("change", render);
  if (fIntencao) fIntencao.addEventListener("change", render);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (qInput) qInput.value = "";
      if (fParte) fParte.value = "todas";
      if (fIntencao) fIntencao.value = "todas";
      moonLock = "todas";
      lunarBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-moon") === "todas"));
      render();
    });
  }

  lunarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      lunarBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      moonLock = btn.getAttribute("data-moon");
      render();
    });
  });

  render();
}

/* ==========================================================================
   Página: Calendário Lunar (fases verdadeiras, cálculo local)
   ========================================================================== */

/* Próximas fases principais a partir de uma data: [{ name, q, date }] */
function nextMajorPhases(startDate, count = 4) {
  return moonEventsBetween(startDate, new Date(startDate.getTime() + 40 * 86400000)).slice(0, count);
}

/* Fase "principal" da semana a que um nome de fase pertence (para intenção e banho sugeridos) */
function majorOf(name) {
  return name.includes("Nova") ? "Lua Nova"
    : name.includes("Cheia") ? "Lua Cheia"
    : name.includes("Crescente") ? "Quarto Crescente"
    : "Quarto Minguante";
}

const formatTimeBR = d => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function initWeekPlanner() {
  const wrap = $("#weekPlanner");
  if (!wrap) return;

  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  wrap.innerHTML = "";

  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7, 12);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i, 12);
    const moon = getLiveMoonData(d);
    const major = majorOf(moon.name);
    const card = document.createElement("div");
    card.className = "day" + (localISODate(d) === localISODate(today) ? " day--today" : "");
    card.innerHTML = `
      <div class="top">
        <b>${days[i]} • ${formatDateBR(d)}</b>
        <span class="pill">${moon.icon} ${moon.name.replace("Lua ", "")}</span>
      </div>
      <div class="muted small">${phaseIntention(major)}</div>
      <div class="muted small u-mt-6">${banhoTipoSugestao(major)}</div>
    `;
    wrap.appendChild(card);
  }
}

function initCalendarioLunar() {
  const nowName = $("#moonNowName");
  if (!nowName) return;

  const today = new Date();
  const moon = getLiveMoonData(today);
  nowName.textContent = moon.name;
  $("#moonNowBadge").textContent = `Hoje • ${majorOf(moon.name)}`;
  $("#moonNowDetails").textContent = `Iluminação: ${moon.illum}% • idade lunar: ${moon.age.toFixed(1).replace(".", ",")} dias`;

  // Sombra real da lua no card Agora
  const shadow = $("#calMoonOrbShadow");
  if (shadow) shadow.style.transform = `translateX(${moonShadowShift(moon)}%)`;

  const nextWrap = $("#nextPhases");
  if (nextWrap) {
    const phaseIcons = { "Lua Nova": "🌑", "Quarto Crescente": "🌓", "Lua Cheia": "🌕", "Quarto Minguante": "🌗" };
    nextWrap.innerHTML = nextMajorPhases(today, 4).map(p => `
      <div class="moon-timeline__card">
        <div class="moon-timeline__icon" aria-hidden="true">${phaseIcons[p.name]}</div>
        <div class="moon-timeline__date">${formatDateBR(p.date)} • ${formatTimeBR(p.date)}</div>
        <b class="moon-timeline__name">${p.name}</b>
        <div class="muted small">${phaseIntention(p.name)}</div>
        <div class="muted small advanced-only u-mt-6">${banhoTipoSugestao(p.name)}</div>
      </div>`).join("");
  }

  initWeekPlanner();
}

