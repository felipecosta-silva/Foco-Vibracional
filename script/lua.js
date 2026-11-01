/* Foco Vibracional • lua.js
   Motor lunar: fases verdadeiras e iluminação calculadas no aparelho (Meeus).
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Motor Lunar Central (fases verdadeiras, cálculo local)
   Horários das fases pelo método de Jean Meeus ("Astronomical Algorithms",
   cap. 49, precisão de minutos) e iluminação pelo cap. 48. Roda offline e
   não depende de serviço externo.
   ========================================================================== */
const SYNODIC_DAYS = 29.530588853;
const MOON_WINDOW_DAYS = 1.5; // dias, antes e depois do instante exato, em que a fase "principal" vale
const PHASE_NAMES = ["Lua Nova", "Quarto Crescente", "Lua Cheia", "Quarto Minguante"];

/* Data local no formato AAAA-MM-DD (toISOString usa UTC e "pula" o dia à noite no Brasil) */
function localISODate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const rad = deg => deg * Math.PI / 180;
const jdToDate = jd => new Date((jd - 2440587.5) * 86400000 - 69000); // TT → UTC (ΔT ≈ 69 s)
const dateToJd = d => d.getTime() / 86400000 + 2440587.5;

/* Instante verdadeiro de uma fase. q: 0 nova, 1 crescente, 2 cheia, 3 minguante; k: lunação desde jan/2000 */
function truePhaseDate(k, q) {
  k += q / 4;
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
  const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
  const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
  const Om = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);
  const s = Math.sin;
  if (q === 0 || q === 2) {
    const [a, b, c, d, e] = q === 0 ? [-0.4072, 0.17241, 0.01608, 0.01039, 0.00739] : [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734];
    jde += a * s(Mp) + b * E * s(M) + c * s(2 * Mp) + d * s(2 * F) + e * E * s(Mp - M)
      - 0.00514 * E * s(Mp + M) + 0.00208 * E * E * s(2 * M) - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F)
      + 0.00056 * E * s(2 * Mp + M) - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F)
      - 0.00024 * E * s(2 * Mp - M) - 0.00017 * s(Om) - 0.00007 * s(Mp + 2 * M) + 0.00004 * s(2 * Mp - 2 * F)
      + 0.00004 * s(3 * M) + 0.00003 * s(Mp + M - 2 * F) + 0.00003 * s(2 * Mp + 2 * F) - 0.00003 * s(Mp + M + 2 * F)
      + 0.00003 * s(Mp - M + 2 * F) - 0.00002 * s(Mp - M - 2 * F) - 0.00002 * s(3 * Mp + M) + 0.00002 * s(4 * Mp);
  } else {
    const c = Math.cos;
    jde += -0.62801 * s(Mp) + 0.17172 * E * s(M) - 0.01183 * E * s(Mp + M) + 0.00862 * s(2 * Mp) + 0.00804 * s(2 * F)
      + 0.00454 * E * s(Mp - M) + 0.00204 * E * E * s(2 * M) - 0.0018 * s(Mp - 2 * F) - 0.0007 * s(Mp + 2 * F)
      - 0.0004 * s(3 * Mp) - 0.00034 * E * s(2 * Mp - M) + 0.00032 * E * s(M + 2 * F) + 0.00032 * E * s(M - 2 * F)
      - 0.00028 * E * E * s(Mp + 2 * M) + 0.00027 * E * s(2 * Mp + M) - 0.00017 * s(Om) - 0.00005 * s(Mp - M - 2 * F)
      + 0.00004 * s(2 * Mp + 2 * F) - 0.00004 * s(Mp + M + 2 * F) + 0.00004 * s(Mp - 2 * M) + 0.00003 * s(Mp + M - 2 * F)
      + 0.00003 * s(3 * M) + 0.00002 * s(2 * Mp - 2 * F) + 0.00002 * s(Mp - M + 2 * F) - 0.00002 * s(3 * Mp + M);
    const W = 0.00306 - 0.00038 * E * c(M) + 0.00026 * c(Mp) - 0.00002 * c(Mp - M) + 0.00002 * c(Mp + M) + 0.00002 * c(2 * F);
    jde += q === 1 ? W : -W;
  }
  return jdToDate(jde);
}

/* Todas as fases principais entre duas datas, em ordem: [{ name, q, date }] */
function moonEventsBetween(from, to) {
  const k0 = Math.floor((dateToJd(from) - 2451550.09766) / SYNODIC_DAYS) - 1;
  const events = [];
  for (let k = k0; ; k++) {
    for (let q = 0; q < 4; q++) {
      const date = truePhaseDate(k, q);
      if (date > to) return events;
      if (date >= from) events.push({ name: PHASE_NAMES[q], q, date });
    }
  }
}

/* Fase anterior e próxima em torno de uma data */
function moonEventsAround(date) {
  const events = moonEventsBetween(new Date(date.getTime() - 9 * 86400000), new Date(date.getTime() + 9 * 86400000));
  const next = events.find(e => e.date > date);
  return { prev: events[events.indexOf(next) - 1], next };
}

/* Idade da lua: dias desde a última lua nova verdadeira */
function moonAgeDays(date) {
  const newMoons = moonEventsBetween(new Date(date.getTime() - 32 * 86400000), date).filter(e => e.q === 0);
  return (date - newMoons[newMoons.length - 1].date) / 86400000;
}

/* Fração iluminada (0 a 1), pelo ângulo de fase aproximado */
function moonIllumination(date) {
  const T = (dateToJd(date) - 2451545) / 36525;
  const D = rad(297.8501921 + 445267.1114034 * T);
  const M = rad(357.5291092 + 35999.0502909 * T);
  const Mp = rad(134.9633964 + 477198.8675055 * T);
  const i = rad(180 - D * 180 / Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) - 1.274 * Math.sin(2 * D - Mp)
    - 0.658 * Math.sin(2 * D) - 0.214 * Math.sin(2 * Mp) - 0.11 * Math.sin(D));
  return (1 + Math.cos(i)) / 2;
}

/* Nome da fase de uma data: "Lua Cheia" se estiver a até 1,5 dia do instante exato; senão, o intervalo */
function majorPhaseAt(date) {
  const { prev, next } = moonEventsAround(date);
  const near = [prev, next].filter(Boolean).find(e => Math.abs(date - e.date) <= MOON_WINDOW_DAYS * 86400000);
  if (near) return near.name;
  return ["Crescente (entre Nova e Crescente)", "Crescente (entre Crescente e Cheia)",
    "Minguante (entre Cheia e Minguante)", "Minguante (entre Minguante e Nova)"][prev.q];
}

function phaseIntention(major) {
  const map = {
    "Lua Nova": "Intenção e recomeço • planejar hábitos e semear paz",
    "Quarto Crescente": "Crescimento • disciplina, prosperidade e ação",
    "Lua Cheia": "Força e expansão • harmonização, firmeza e gratidão",
    "Quarto Minguante": "Limpeza e descarrego • soltar pesares e encerrar ciclos"
  };
  return map[major] || "Ajuste e presença • escolha uma intenção de paz.";
}

function banhoTipoSugestao(major) {
  const map = {
    "Lua Nova": "Banho sugerido: Abertura suave e planejamento",
    "Quarto Crescente": "Banho sugerido: Prosperidade, energia e foco (Alecrim / Louro)",
    "Lua Cheia": "Banho sugerido: Harmonização e bênção da cabeça (Boldo / Manjericão)",
    "Quarto Minguante": "Banho sugerido: Limpeza e descarrego simbólico (Pescoço para baixo)"
  };
  return map[major] || "Banho sugerido: Calma e serenidade (Camomila / Lavanda)";
}

/* Fases do ciclo: 4 principais (perto do instante exato) e 4 intermediárias (entre elas) */
const MOON_STAGES = {
  "Lua Nova": { key: "nova", icon: "🌑", orientacao: "Ciclo de recomeço e semeadura pura. Ideal para banhos suaves de acalento e firmar intenções de paz, novos hábitos e prosperidade." },
  "Quarto Crescente": { key: "crescente", icon: "🌓", orientacao: "Força motriz, disciplina e expansão. Momento propício para banhos de alecrim, louro e atração de fartura." },
  "Lua Cheia": { key: "cheia", icon: "🌕", orientacao: "Potência máxima, plenitude e harmonização. O Ori pede luz suave (Boldo, Manjericão, Alfazema) e agradecimento aos Mestres." },
  "Quarto Minguante": { key: "minguante", icon: "🌗", orientacao: "Corte de pesos, faxina espiritual e descarrego. Momento de arruda e guiné, sempre do pescoço para baixo." },
  "Lua Crescente": { key: "crescente", icon: "🌒", orientacao: "A luz começa a expandir. Perfeita para movimentar novos projetos, estudar e dar o primeiro passo com coragem." },
  "Lua Gibosa Crescente": { key: "crescente", icon: "🌔", orientacao: "Fase de refinamento e amadurecimento dos propósitos antes do ápice da Cheia." },
  "Lua Gibosa Minguante": { key: "minguante", icon: "🌖", orientacao: "Início do recolhimento, reflexão e desapego do que não serve mais." },
  "Lua Balsâmica Minguante": { key: "minguante", icon: "🌘", orientacao: "Limpeza profunda e encerramento de ciclos para purificar o terreno antes da Nova." }
};
const BETWEEN_STAGES = ["Lua Crescente", "Lua Gibosa Crescente", "Lua Gibosa Minguante", "Lua Balsâmica Minguante"];

/* Desenho da lua como se vê do Brasil (hemisfério sul): a crescente acende pela esquerda ("C"),
   a minguante pela direita. Devolve o deslocamento, em %, do disco de sombra. */
function moonShadowShift(moon) {
  return (moon.waxing ? 1 : -1) * Math.min(100, moon.illum);
}

function getLiveMoonData(date = new Date()) {
  const age = moonAgeDays(date);
  const illum = Math.round(moonIllumination(date) * 100);
  const { prev, next } = moonEventsAround(date);
  const near = [prev, next].filter(Boolean).find(e => Math.abs(date - e.date) <= MOON_WINDOW_DAYS * 86400000);
  const name = near ? near.name : BETWEEN_STAGES[prev.q];
  const { key, icon, orientacao } = MOON_STAGES[name];

  return {
    age: Number(age.toFixed(1)),
    waxing: prev.q < 2,
    illum,
    key, // 'nova' | 'crescente' | 'cheia' | 'minguante'
    name,
    icon,
    orientacao,
    intention: phaseIntention(key === "nova" ? "Lua Nova" : key === "cheia" ? "Lua Cheia" : key === "crescente" ? "Quarto Crescente" : "Quarto Minguante")
  };
}

function initTodayMoonBanner(containerSelector, onSelectPhase) {
  const container = $(containerSelector);
  const moon = getLiveMoonData(new Date());

  if (container) {
    container.innerHTML = `
      <div class="today-moon-banner">
        <div class="today-moon-left">
          <div class="today-moon-icon" aria-hidden="true">${moon.icon}</div>
          <div>
            <div class="today-moon-tag">
              <span class="live-pulse"></span> Hoje no Céu • Fase Atual
            </div>
            <h3 class="today-moon-name">${moon.name}</h3>
            <p class="today-moon-sub">Idade: ${moon.age} dias • Iluminação aprox.: ~${moon.illum}%</p>
          </div>
        </div>
        <div class="today-moon-right">
          <p class="today-moon-text">${moon.orientacao}</p>
          <button class="btn btn--today-moon" id="btnFilterTodayMoon" type="button">
            Ver receitas para a Lua de Hoje ✨
          </button>
        </div>
      </div>
    `;

    const btnFilter = container.querySelector("#btnFilterTodayMoon");
    if (btnFilter && typeof onSelectPhase === "function") {
      btnFilter.addEventListener("click", () => {
        onSelectPhase(moon.key);
      });
    }
  }

  // Destacar o botão correspondente na linha do tempo lunar
  const targetBtn = document.querySelector(`.lunar__item[data-moon="${moon.key}"]`);
  if (targetBtn) {
    targetBtn.classList.add("is-today");
    if (!targetBtn.querySelector(".lunar__today-pill")) {
      const pill = document.createElement("span");
      pill.className = "lunar__today-pill";
      pill.textContent = "HOJE";
      targetBtn.appendChild(pill);
    }
  }

  return moon;
}

