/* Foco Vibracional • portais.js
   Portais numéricos e widget de Grabovoi da página inicial.
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Página: Portais Numéricos & Sequências (portais.html)
   ========================================================================== */
const PORTAL_MEANINGS = {
  1: { tema: "Recomeço • decisão • direção", fazer: "Definir 1 meta clara e 1 ação mínima hoje." },
  2: { tema: "Equilíbrio • relações • escolhas conscientes", fazer: "Harmonizar emoções e alinhar decisões com calma." },
  3: { tema: "Expressão • criatividade • comunicação", fazer: "Escrever ideias, estudar, comunicar um objetivo." },
  4: { tema: "Estrutura • disciplina • base", fazer: "Organizar rotina/finanças; construir constância." },
  5: { tema: "Mudança • movimento • liberdade", fazer: "Quebrar um padrão e iniciar um hábito novo." },
  6: { tema: "Cuidado • responsabilidade • amor", fazer: "Autocuidado e equilíbrio nos relacionamentos." },
  7: { tema: "Introspecção • fé • estudo", fazer: "Silêncio, meditação, leitura e autoconhecimento." },
  8: { tema: "Poder pessoal • prosperidade • expansão", fazer: "Foco em resultados, coragem e ação financeira." },
  9: { tema: "Encerramento • desapego • conclusão", fazer: "Finalizar pendências, limpar excessos, perdoar e soltar." },
  10: { tema: "Alinhamento • clareza • ação", fazer: "Escolher prioridades e executar o essencial." },
  11: { tema: "Consciência • propósito • despertar", fazer: "Revisar rumo de vida e reafirmar propósito com fé." },
  12: { tema: "Integração • síntese • fechamento", fazer: "Revisar o ano, agradecer aos mestres e planejar novo ciclo." }
};

function getNextPortals(fromDate, howMany = 8) {
  const out = [];
  let y = fromDate.getFullYear();

  while (out.length < howMany) {
    for (let m = 1; m <= 12; m++) {
      const d = new Date(y, m - 1, m);
      const dayStart = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const candStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (candStart >= dayStart) {
        out.push(d);
        if (out.length >= howMany) break;
      }
    }
    y++;
  }
  return out;
}

function isPortalDay(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return m === d && m >= 1 && m <= 12;
}

function portalName(month) {
  const mm = String(month).padStart(2, "0");
  return `${mm}/${mm}`;
}

/* Sequências numéricas (Grabovoi) — fonte única usada em portais.html e no painel Hoje */
const GRABOVOI_SEQS = [
  { seq: "520 741 777 888", cat: "prosperidade", titulo: "Prosperidade Máxima & Fluxo Total", uso: "Combinação clássica para destravamento material, milagres e abundância divina." },
  { seq: "520", cat: "prosperidade", titulo: "Dinheiro Inesperado", uso: "Abertura rápida de canais de renda imprevistos, destravamento de pagamentos e circulação do fluxo material." },
  { seq: "318 798", cat: "prosperidade", titulo: "Paz Financeira & Quitação de Dívidas", uso: "Organização mental para pagar pendências, tranquilidade orçamentária e prosperidade sustentável." },
  { seq: "888", cat: "prosperidade", titulo: "Abundância Divina & Expansão Justa", uso: "Trabalhar disciplina, merecimento e colheita fértil do próprio suor." },
  { seq: "741", cat: "foco", titulo: "Solução Imediata de Problemas", uso: "Clareza mental instantânea quando estiver diante de um impasse ou aperto urgente." },
  { seq: "519 7148", cat: "foco", titulo: "Tudo é Possível", uso: "Rompimento de crenças de incapacidade e conexão direta com o campo de infinitas possibilidades." },
  { seq: "111", cat: "foco", titulo: "Começo Abençoado & Direção", uso: "Iniciar um novo projeto, trabalho ou estudo com firmeza, bênção e constância." },
  { seq: "1814321", cat: "saude", titulo: "Saúde Integral & Vitalidade", uso: "Harmonização do corpo físico, fortalecimento celular e vigor para a jornada diária." },
  { seq: "1891014", cat: "calma", titulo: "Alívio do Estresse & Ansiedade", uso: "Acalmar o peito apertado, desanuviar pensamentos acelerados e respirar em paz." },
  { seq: "1001105010", cat: "calma", titulo: "Paz Interior Profunda", uso: "Serenidade de espírito, equilíbrio emocional e alinhamento do coração." },
  { seq: "222", cat: "harmonizacao", titulo: "Harmonia Familiar & no Lar", uso: "Apaziguar conflitos de convivência, fortalecer a paciência mútua e restaurar a concórdia." },
  { seq: "918 005 914", cat: "harmonizacao", titulo: "Amor Próprio & Autoestima", uso: "Reconhecimento do seu valor sagrado e libertação de sentimentos de culpa ou rejeição." },
  { seq: "917 498 814316", cat: "protecao", titulo: "Escudo Protetor Energético", uso: "Blindagem áurica contra inveja, energias intrusas e ambientes espiritualmente densos." },
  { seq: "777", cat: "protecao", titulo: "Milagres & Bênçãos Cósmicas", uso: "Sustentação na fé, amparo superior em horas difíceis e gratidão pelas vitórias." },
  { seq: "999", cat: "limpeza", titulo: "Encerramento de Ciclos & Desapego", uso: "Fechar portas do passado com dignidade e soltar laços que não servem mais à sua evolução." }
];

function initPortaisPage() {
  const grid = $("#portalGrid");
  if (!grid) return;

  const yearBadge = $("#portalYear");
  if (yearBadge) yearBadge.textContent = `Hoje • ${new Date().getFullYear()}`;

  const nextWrap = $("#portalNextList");
  if (nextWrap) {
    const next = getNextPortals(new Date(), 6);
    nextWrap.innerHTML = "";
    next.forEach(d => {
      const m = d.getMonth() + 1;
      const meaning = PORTAL_MEANINGS[m];
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <b>${portalName(m)} • ${formatDateBR(d)}</b>
        <div class="muted small">${meaning.tema}</div>
        <div class="muted small advanced-only u-mt-6"><b>Intenção:</b> ${meaning.fazer}</div>
      `;
      nextWrap.appendChild(el);
    });
  }

  const today = new Date();
  const todayBadge = $("#portalTodayBadge");
  const todayTitle = $("#portalTodayTitle");
  const todayMeaning = $("#portalTodayMeaning");
  const todayDo = $("#portalTodayDo");

  if (todayBadge && todayTitle) {
    if (isPortalDay(today)) {
      const m = today.getMonth() + 1;
      const meaning = PORTAL_MEANINGS[m];
      todayBadge.textContent = "SIM";
      todayTitle.textContent = `${portalName(m)} • ${formatDateBR(today)}`;
      if (todayMeaning) todayMeaning.textContent = meaning.tema;
      if (todayDo) todayDo.textContent = `Sugestão: ${meaning.fazer}`;
    } else {
      todayBadge.textContent = "NÃO";
      todayTitle.textContent = formatDateBR(today);
      if (todayMeaning) todayMeaning.textContent = "Mesmo sem portal numérico, o dia de hoje é sagrado para sua prática.";
      if (todayDo) todayDo.textContent = "Sugestão: faça uma oração de agradecimento, tome um chá ou banho de manjericão e aja com clareza.";
    }
  }

  grid.innerHTML = "";
  for (let m = 1; m <= 12; m++) {
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
        <li class="advanced-only"><b>Dica da Jurema:</b> combine com a Lua para escolher banho de “limpeza” (minguante) ou “expansão” (crescente/cheia).</li>
      </ul>
    `;
    grid.appendChild(card);
  }

  // Grabovoi & Sequências Expandidas (fonte única: GRABOVOI_SEQS)
  const SEQS = GRABOVOI_SEQS;

  const seqWrap = $("#seqList");
  const qSeq = $("#qSeq");
  const fSeq = $("#fSeqCat");
  const btnRnd = $("#seqRandom");
  const btnClr = $("#seqClear");

  function renderSeq(list) {
    if (!seqWrap) return;
    seqWrap.innerHTML = "";
    list.forEach(s => {
      const el = document.createElement("div");
      el.className = "item";
      const id = "seq_" + s.seq.replace(/\s/g, "_");
      el.innerHTML = `
        <div class="u-flex u-between u-wrap u-gap-8">
          <b class="mono u-fs-115 u-white">${s.seq}</b>
          <span class="badge">${s.cat}</span>
        </div>
        <div class="muted small u-mt-4 u-fw-600 u-text">${s.titulo}</div>
        <div class="muted small u-mt-4" id="${id}">${s.uso}</div>
        <div class="row wrap-row u-mt-10 u-gap-8">
          <button class="btn btn--ghost" data-copy-text="${s.seq}" type="button">📋 Copiar</button>
          <button class="btn" data-speak="#${id}" type="button">🔊 Ouvir</button>
        </div>
      `;
      seqWrap.appendChild(el);
    });
  }

  function applySeq() {
    const q = (qSeq?.value || "").toLowerCase().trim();
    const cat = fSeq?.value || "todas";
    const filtered = SEQS.filter(s => {
      const hay = (s.seq + " " + s.cat + " " + s.titulo + " " + s.uso).toLowerCase();
      const okQ = !q || hay.includes(q);
      const okC = (cat === "todas") || s.cat === cat;
      return okQ && okC;
    });
    renderSeq(filtered.length ? filtered : SEQS);
  }

  if (qSeq) qSeq.addEventListener("input", applySeq);
  if (fSeq) fSeq.addEventListener("change", applySeq);
  if (btnClr) {
    btnClr.addEventListener("click", () => {
      if (qSeq) qSeq.value = "";
      if (fSeq) fSeq.value = "todas";
      applySeq();
    });
  }
  if (btnRnd) {
    btnRnd.addEventListener("click", () => {
      const list = SEQS.filter(s => (!fSeq || fSeq.value === "todas") || s.cat === fSeq.value);
      const pick = list[Math.floor(Math.random() * list.length)];
      renderSeq([pick]);
      toast("Sequência sorteada!");
    });
  }

  applySeq();
}

/* ==========================================================================
   Inicialização do Widget Interativo de Grabovoi na Home (index.html)
   ========================================================================== */
function initHomeGrabovoi() {
  const pillsWrap = $("#grabovoiPills");
  if (!pillsWrap) return;

  const titleEl = $("#grabovoiActiveTitle");
  const codeEl = $("#grabovoiActiveCode");
  const descEl = $("#grabovoiActiveDesc");
  const blockEl = $("#grabovoiBlockDisplay");
  const copyBtn = $("#grabovoiCopyBtn");
  const speakBtn = $("#grabovoiSpeakBtn");
  const btnRandom = $("#grabovoiBtnRandom");

  function setSequence(seq, title, desc, clickedBtn) {
    if (titleEl) titleEl.textContent = title;
    if (codeEl) codeEl.textContent = seq;
    if (descEl) descEl.textContent = desc;

    if (blockEl) {
      blockEl.innerHTML = "";
      const parts = seq.split(/\s+/).filter(Boolean);
      parts.forEach(p => {
        const span = document.createElement("span");
        span.textContent = p;
        blockEl.appendChild(span);
      });
    }

    if (copyBtn) {
      copyBtn.setAttribute("data-copy-text", seq);
    }

    pillsWrap.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
    if (clickedBtn) {
      clickedBtn.classList.add("pill--active");
    }
  }

  pillsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-seq]");
    if (!btn) return;
    const seq = btn.getAttribute("data-seq");
    const title = btn.getAttribute("data-title") || "Sequência de Foco";
    const desc = btn.getAttribute("data-desc") || "";
    setSequence(seq, title, desc, btn);
  });

  if (btnRandom) {
    btnRandom.addEventListener("click", () => {
      const allBtns = Array.from(pillsWrap.querySelectorAll("button[data-seq]"));
      if (!allBtns.length) return;
      const pick = allBtns[Math.floor(Math.random() * allBtns.length)];
      pick.click();
      toast("Sequência alternada!");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const seq = copyBtn.getAttribute("data-copy-text") || (codeEl ? codeEl.textContent : "520 741 777 888");
      navigator.clipboard?.writeText(seq).then(() => toast("Sequência copiada: " + seq));
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      const title = titleEl ? titleEl.textContent : "Sequência";
      const code = codeEl ? codeEl.textContent : "520 741 777 888";
      const spokenCode = code.split("").map(c => c === " " ? "..." : c).join(" ");
      speak(`${title}. Números: ${spokenCode}`);
    });
  }
}

