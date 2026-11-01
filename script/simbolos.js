/* Foco Vibracional • simbolos.js
   Pontos riscados, runas, mandalas e sigilos (simbolos.html).
   Arquivo comum (não é módulo): compartilha o escopo global com os outros
   arquivos de script/ e deve ser carregado na ordem de script/ORDEM.md. */

/* ==========================================================================
   Inicialização da Página de Símbolos Sagrados (simbolos.html)
   Pontos Riscados, 24 Runas com Oráculo e Mandalas com Respiração 4-2-6
   ========================================================================== */
function initDikenga() {
  const container = $("#dikenga");
  if (!container) return;

  const DIKENGA_DATA = {
    tukula: {
      id: "tukula",
      nome: "Tukula — O Meio-Dia da Alma",
      sol: "☀️ Zênite Solar • Ápice da Força & Sabedoria Plena",
      plano: "Ku Nseke (Mundo Físico / Terra dos Vivos)",
      descricao: "Na cosmologia Bântu-Kôngo, Tukula é o ponto mais alto do sol no céu, simbolizando a maturidade, a liderança, a força realizadora e o domínio das ciências materiais e espirituais.",
      ponto: "Símbolos no quadrante superior do ponto operam no ápice da ação manifestada. É onde se firmam coroas de Orixá, espadas de Ogum em guarda, a força realizadora de Caboclos e a autoridade espiritual dos Mestres.",
      exemplo: "Coroas, raios de Iansã, espadas em riste, sóis brilhando."
    },
    luvemba: {
      id: "luvemba",
      nome: "Luvemba — O Pôr do Sol & Passagem",
      sol: "🌅 Crepúsculo • Encerramento, Descarrego & Retorno",
      plano: "Fronteira da Kalunga (Transição de Ku Nseke para Ku Mpemba)",
      descricao: "O entardecer cósmico, onde a jornada física se encerra e o ser prepara sua travessia de volta ao reino ancestral. Rege o recolhimento, a quebra de amarras e a dissolução de energias densas.",
      ponto: "Quadrante de corte de demandas, descarrego pesado e esgotamento. Uma espiral aqui traçada suga e desfaz os miasmas espirituais, devolvendo forças obsessoras ao mar sagrado para transmutação.",
      exemplo: "Espirais em sentido anti-horário, flechas de retorno, nós desfeitos."
    },
    musoni: {
      id: "musoni",
      nome: "Musoni — A Meia-Noite Sagrada",
      sol: "🌑 Meia-Noite • Concepção, Gestações & Mistério Ancestral",
      plano: "Ku Mpemba (Mundo Espiritual / Reino dos Ancestrais)",
      descricao: "A escuridão fértil onde a ideia é fecundada no invisível antes de qualquer manifestação na terra. É o ventre cósmico, o repouso dos espíritos iluminados e o contato com a raiz ancestral.",
      ponto: "A base do ponto onde se ancora a sustentação espiritual. Nenhum trabalho vinga na matéria sem a semente gerada nesta profundeza sagrada. Conecta aos Pretos Velhos, Almas e Encantaria de Jurema.",
      exemplo: "Cruzes de almas, caldeirões, raízes subterrâneas, sementes de pemba."
    },
    kala: {
      id: "kala",
      nome: "Kala — O Nascer do Sol & Alvorecer",
      sol: "🌱 Aurora • Nascimento, Novos Caminhos & Despertar",
      plano: "Fronteira da Kalunga (Emergência de Ku Mpemba para Ku Nseke)",
      descricao: "O alvorecer dourado, quando a centelha divina cruza a Kalunga e entra no mundo dos vivos. É a energia do recomeço, da saúde renascendo, da abertura de portas e do brotar das matas.",
      ponto: "Símbolos à direita do ponto indicam início de trabalhos, abertura de caminhos trancados, prosperidade nascente e o despertar mediúnico seguro de um filho de fé.",
      exemplo: "Flechas apontadas para a frente, chaves de porteira, brotos de erva."
    }
  };

  const detailCard = $("#dikengaDetailCard");
  const nodes = $all(".dikenga-node", container);
  const pills = $all("[data-dikenga-target]", container);

  function render(key) {
    const d = DIKENGA_DATA[key] || DIKENGA_DATA.tukula;
    nodes.forEach(n => {
      const active = n.getAttribute("data-node") === d.id;
      n.classList.toggle("is-active", active);
      n.setAttribute("aria-pressed", active ? "true" : "false");
    });
    pills.forEach(p => {
      const active = p.getAttribute("data-dikenga-target") === d.id;
      p.classList.toggle("pill--active", active);
      p.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (detailCard) {
      detailCard.innerHTML = `
        <div class="dikenga-badge-row">
          <span class="badge">${escapeHtml(d.plano)}</span>
        </div>
        <h3 class="dikenga-detail-title">${escapeHtml(d.nome)}</h3>
        <div class="dikenga-detail-sol">${escapeHtml(d.sol)}</div>
        <p class="dikenga-detail-desc">${escapeHtml(d.descricao)}</p>
        <div class="dikenga-detail-ponto">
          <strong>Como atua no ponto riscado:</strong><br>
          ${escapeHtml(d.ponto)}<br>
          <span class="small muted u-block u-mt-6"><b>Exemplos comuns:</b> ${escapeHtml(d.exemplo)}</span>
        </div>
      `;
    }
  }

  nodes.forEach(n => {
    n.addEventListener("click", () => render(n.getAttribute("data-node")));
    n.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        render(n.getAttribute("data-node"));
      }
    });
  });

  pills.forEach(p => {
    p.addEventListener("click", () => render(p.getAttribute("data-dikenga-target")));
  });

  render("tukula");
}

function initSimbolosPage() {
  // 1. Alternador de Abas Principais
  const tabBtnPontos = $("#tabBtnPontos");
  const tabBtnRunas = $("#tabBtnRunas");
  const tabBtnMandalas = $("#tabBtnMandalas");
  const tabBtnSigilos = $("#tabBtnSigilos");

  const panePontos = $("#panePontos");
  const paneRunas = $("#paneRunas");
  const paneMandalas = $("#paneMandalas");
  const paneSigilos = $("#paneSigilos");

  if (!tabBtnPontos || !panePontos) return; // Não está em simbolos.html

  function switchSimboloTab(activeTab, activePane) {
    [tabBtnPontos, tabBtnRunas, tabBtnMandalas, tabBtnSigilos].forEach(t => t?.classList.remove("tab--active"));
    [panePontos, paneRunas, paneMandalas, paneSigilos].forEach(p => { if (p) p.hidden = true; });

    activeTab.classList.add("tab--active");
    if (activePane) activePane.hidden = false;
  }

  tabBtnPontos.addEventListener("click", () => switchSimboloTab(tabBtnPontos, panePontos));
  tabBtnRunas.addEventListener("click", () => switchSimboloTab(tabBtnRunas, paneRunas));
  tabBtnMandalas.addEventListener("click", () => switchSimboloTab(tabBtnMandalas, paneMandalas));
  tabBtnSigilos?.addEventListener("click", () => switchSimboloTab(tabBtnSigilos, paneSigilos));

  initDikenga();

  // 2. Base de Dados das 24 Runas do Elder Futhark
  const RUNAS_DATA = [
    { glyph: "ᚠ", nome: "FEHU", cat: "prosperidade", traducao: "Gado / Riqueza Circulante", palavra: "Prosperidade Viva, Fluxo e Generosidade", conselho: "A verdadeira fartura não é o que você acumula debaixo do colchão por medo, mas o que você faz circular com honra e retidão. Abra as mãos para dar e receber.", afirmacao: "Eu sou um canal limpo de prosperidade e abundância abundante." },
    { glyph: "ᚢ", nome: "URUZ", cat: "cura", traducao: "Touro Selvagem / Força Primal", palavra: "Vitalidade Física, Resistência e Superação", conselho: "Não fuja do desafio nem se vitimize. A terra te deu ossos fortes e coração valente; enfrente a lida com serenidade e postura ereta.", afirmacao: "Minha saúde física é vigorosa e minha força interior é inabalável." },
    { glyph: "ᚦ", nome: "THURISAZ", cat: "protecao", traducao: "Gigante / Espinho de Defesa", palavra: "Escudo Ativo, Corte de Armadilhas e Limpeza", conselho: "Como o espinho do mandacaru e a espada de Ogum, esta runa avisa: não ataque ninguém, mas não permita que pisem na sua dignidade. Corte o mal pela raiz.", afirmacao: "Sou protegido por escudos de luz contra toda maledicência." },
    { glyph: "ᚨ", nome: "ANSUZ", cat: "sabedoria", traducao: "Voz dos Deuses / Sabedoria Ancestral", palavra: "Comunicação Clara, Inspiração e Conselho", conselho: "Escute a voz dos mais velhos e o sussurro da brisa nas folhas. Antes de falar palavras amargas, respire três vezes e prefira a verdade com respeito.", afirmacao: "Minhas palavras edificam, pacificam e manifestam a verdade divina." },
    { glyph: "ᚱ", nome: "RAIDO", cat: "sabedoria", traducao: "Carruagem / A Grande Jornada", palavra: "Ritmo Certo, Movimento Ordenado e Viagem", conselho: "A vida não está estagnada; é uma estrada de aprendizado contínuo. Não tente apressar o passo nem queira pular etapas. Mantenha o passo firme.", afirmacao: "Estou no ritmo certo do Universo e confio no meu caminho." },
    { glyph: "ᚲ", nome: "KENAZ", cat: "sabedoria", traducao: "Tocha / Luz Reveladora", palavra: "Clareza Mental, Criatividade e Verdade", conselho: "A tocha dissipa a sombra da ignorância e da dúvida. Olhe para os seus problemas sem medo: o que antes parecia um monstro se revela algo simples de resolver.", afirmacao: "A luz da sabedoria ilumina todas as minhas escolhas." },
    { glyph: "ᚷ", nome: "GEBO", cat: "prosperidade", traducao: "Presente / Troca Justa", palavra: "Equilíbrio entre Dar e Receber, Alianças Leais", conselho: "Nenhuma relação se sustenta onde só um lado se doa e o outro só explora. Honre seus combinados e cultive amigos que andam ombro a ombro com você.", afirmacao: "Minhas relações são fundadas no respeito mútuo e na lealdade." },
    { glyph: "ᚹ", nome: "WUNJO", cat: "cura", traducao: "Alegria / Harmonia Fraterna", palavra: "Contentamento, Realização e Bênção no Lar", conselho: "Alegre-se com as pequenas vitórias do dia: o café quente, a água fresca, o dever cumprido. O contentamento sincero fecha as portas para o olho-gordo.", afirmacao: "Eu acolho a paz, a alegria legítima e a harmonia em minha casa." },
    { glyph: "ᚺ", nome: "HAGALAZ", cat: "transformacao", traducao: "Granizo / Tempestade Inesperada", palavra: "Ruptura Libertadora, Fim do Velho e Renascimento", conselho: "Quando o temporal cai na mata, não adianta brigar com a chuva. Abrace o que acabou sem desespero: a tempestade veio lavar o solo para o novo brotar.", afirmacao: "Eu me liberto do que já não me serve e aceito a renovação." },
    { glyph: "ᛁ", nome: "ISA", cat: "sabedoria", traducao: "Gelo / Imobilidade Sagrada", palavra: "Pausa Reflexiva, Paciência e Esfriar da Cabeça", conselho: "Não tome decisões de cabeça quente nem force portas emperradas. Recolha-se, acalme o sangue e espere o gelo derreter antes de dar o próximo passo.", afirmacao: "No silêncio e na paciência, eu encontro minha maior firmeza." },
    { glyph: "ᛃ", nome: "JERA", cat: "prosperidade", traducao: "Colheita Fértil / Ciclo do Ano", palavra: "Recompensa Justa, Frutos do Trabalho e Merecimento", conselho: "Quem plantou com amor e regou com paciência não teme o inverno. Sua colheita está madura; receba com gratidão o fruto sagrado do seu empenho.", afirmacao: "Eu colho hoje com júbilo o bem que plantei com constância." },
    { glyph: "ᛇ", nome: "EIHWAZ", cat: "protecao", traducao: "Teixo / Árvore da Vida e Morte", palavra: "Resiliência Profunda, Longevidade e Raiz Firme", conselho: "Como o pé de jurema preta no sertão, você foi feito para aguentar seca e vendaval sem quebrar. Suas raízes são profundas na fé de seus antepassados.", afirmacao: "Eu sou firme, resistente e inabalável perante as adversidades." },
    { glyph: "ᛈ", nome: "PERTHRO", cat: "sabedoria", traducao: "Taça de Sortes / O Mistério do Destino", palavra: "Intuição Aguçada, Sincronicidade e Revelação", conselho: "Nem tudo na vida é explicado pelo intelecto. Confie na voz sutil do seu sexto sentido e nas sincronicidades que os guias colocam discretamente no seu dia.", afirmacao: "Minha intuição é límpida e eu confio nos mistérios do Criador." },
    { glyph: "ᛉ", nome: "ALGIZ", cat: "protecao", traducao: "Alce Sagrado / Chifres de Defesa", palavra: "Proteção Espiritual Máxima e Conexão Superior", conselho: "Você está debaixo do manto da luz superior. Mentalize a cruz de pemba e o olhar dos seus guardiões. Ande com retidão moral e nada te derrubará.", afirmacao: "Eu sou guiado, guardado e protegido em todos os meus passos." },
    { glyph: "ᛋ", nome: "SOWILO", cat: "prosperidade", traducao: "Sol Triunfante / Vitória da Luz", palavra: "Sucesso, Iluminação, Saúde e Entusiasmo", conselho: "O Sol dissipa todo nevoeiro. Deixe sua luz brilhar sem vergonha e sem soberba. Assuma o leme da sua própria história com confiança e vigor renovado.", afirmacao: "A luz do Sol brilha em meu coração, trazendo vitória e saúde." },
    { glyph: "ᛏ", nome: "TIWAZ", cat: "protecao", traducao: "Lança da Justiça / O Deus Týr", palavra: "Justiça Implacável, Honra, Coragem e Retidão", conselho: "A justiça divina não dorme nem se vende. Mantenha as mãos limpas, cumpra a palavra empenhada e não tenha medo de lutar pelo que é honesto e nobre.", afirmacao: "Eu caminho guiado pela verdade, pela honra e pela justiça divina." },
    { glyph: "ᛒ", nome: "BERKANA", cat: "cura", traducao: "Bétula / A Grande Mãe da Terra", palavra: "Renascimento Suave, Fertilidade e Cuidado do Lar", conselho: "Como uma mãe que nina o filho e a terra que aconchega a semente, cuide com ternura dos seus novos projetos e da sua família. Cultive o afeto diário.", afirmacao: "A ternura e a fertilidade renovam minha vida todos os dias." },
    { glyph: "ᛖ", nome: "EHWAZ", cat: "sabedoria", traducao: "Cavalo Fiel / Parceria Leal", palavra: "Cooperação Mútua, Progresso Rápido e Lealdade", conselho: "Ninguém vence batalha sozinho. Valorize quem divide a carga com você, seja no trabalho ou no amor. O passo conjunto é duas vezes mais ligeiro.", afirmacao: "Eu atraio companheiros leais e avanço em harmonia com todos." },
    { glyph: "ᛗ", nome: "MANNAZ", cat: "sabedoria", traducao: "Humanidade / Consciência Coletiva", palavra: "Autoconhecimento, Humildade e Fraternidade", conselho: "Lembre-se de quem você é: nem superior a ninguém pela vitória, nem inferior pela prova passageira. Somos todos filhos do mesmo solo e do mesmo sopro divino.", afirmacao: "Eu me conheço profundamente e trato a todos com reverência." },
    { glyph: "ᛚ", nome: "LAGUZ", cat: "cura", traducao: "Água Corrente / Mar Profundo", palavra: "Fluidez Emocional, Purificação e Alívio de Mágoas", conselho: "Água parada cria limo e amargura. Perdoe quem te feriu e deixe o rio da vida levar o que passou. Deixe suas emoções fluírem límpidas como cachoeira de Oxum.", afirmacao: "Minhas águas internas são puras, calmas e curadoras." },
    { glyph: "ᛜ", nome: "INGWAZ", cat: "prosperidade", traducao: "Semente Sagrada / Deus da Fertilidade", palavra: "Gestação Silenciosa, Descanso Produtivo e Potencial", conselho: "A semente precisa ficar no escuro da terra antes de brotar flor e fruto. Não queira mostrar antes da hora o que ainda está amadurecendo em segredo.", afirmacao: "Meus planos amadurecem com segurança e darão frutos benditos." },
    { glyph: "ᛟ", nome: "OTHALA", cat: "protecao", traducao: "Herança Ancestral / O Lar Sagrado", palavra: "Raízes de Família, Tradição e Território Protegido", conselho: "Honre a memória dos seus avós e a terra que te acolhe. Proteja as quatro paredes da sua casa com prece, fumaça de defumação e respeito mútuo.", afirmacao: "Meu lar é um santuário de paz, proteção e bênção ancestral." },
    { glyph: "ᛞ", nome: "DAGAZ", cat: "transformacao", traducao: "Aurora / Novo Dia Desperto", palavra: "Despertar da Luz, Fim da Noite Escura e Esperança", conselho: "A noite mais escura sempre precede o clarão do amanhecer. A dor que te afligia chegou ao fim; respire fundo e acolha o recomeço que já brilha no horizonte.", afirmacao: "Um novo dia abençoado amanhece hoje em todos os meus caminhos." }
  ];

  // Renderizar o Catálogo de Runas
  const runasGrid = $("#runasGrid");
  const filterCat = $("#filterRunaCat");

  function renderRunas(list) {
    if (!runasGrid) return;
    runasGrid.innerHTML = "";
    list.forEach(r => {
      const card = document.createElement("article");
      card.className = "runa-card";
      card.innerHTML = `
        <div class="runa-card__header">
          <span class="runa-glyph-mini">${r.glyph}</span>
          <span class="badge">${r.cat}</span>
        </div>
        <h3 class="runa-name">${r.nome}</h3>
        <p class="muted small u-m0 u-fs-82 tone-gold tone-text">${r.traducao}</p>
        <p class="muted small u-m0 u-mt-4 u-lh-140">${r.palavra}</p>
      `;
      card.addEventListener("click", () => showOracleResult(r));
      runasGrid.appendChild(card);
    });
  }

  if (filterCat) {
    filterCat.addEventListener("change", () => {
      const cat = filterCat.value;
      const filtered = (cat === "todas") ? RUNAS_DATA : RUNAS_DATA.filter(r => r.cat === cat);
      renderRunas(filtered);
    });
  }

  renderRunas(RUNAS_DATA);

  // Oráculo: Tirar Runa do Momento
  const btnTirarRuna = $("#btnTirarRuna");
  const runaResultado = $("#runaResultado");
  const oracleGlyph = $("#oracleGlyph");
  const oracleName = $("#oracleName");
  const oracleArchetype = $("#oracleArchetype");
  const oracleAdvice = $("#oracleAdvice");
  const oracleCopyBtn = $("#oracleCopyBtn");
  const oracleSpeakBtn = $("#oracleSpeakBtn");

  let currentOracleRuna = null;

  function showOracleResult(r) {
    currentOracleRuna = r;
    if (!runaResultado) return;

    if (oracleGlyph) oracleGlyph.textContent = r.glyph;
    if (oracleName) oracleName.textContent = `${r.nome} • ${r.palavra.split(",")[0]}`;
    if (oracleArchetype) oracleArchetype.textContent = `Significado: ${r.traducao} (${r.palavra})`;
    if (oracleAdvice) oracleAdvice.textContent = r.conselho;

    runaResultado.hidden = false;
    runaResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (btnTirarRuna) {
    btnTirarRuna.addEventListener("click", () => {
      btnTirarRuna.textContent = "Consultando os ventos…";
      btnTirarRuna.disabled = true;
      setTimeout(() => {
        const randomRuna = RUNAS_DATA[Math.floor(Math.random() * RUNAS_DATA.length)];
        showOracleResult(randomRuna);
        btnTirarRuna.textContent = "⚡ Tirar Outra Runa";
        btnTirarRuna.disabled = false;
        toast(`Runa sorteada: ${randomRuna.nome} (${randomRuna.glyph})`);
      }, 350);
    });
  }

  if (oracleCopyBtn) {
    oracleCopyBtn.addEventListener("click", () => {
      if (!currentOracleRuna) return;
      const text = `Runa ${currentOracleRuna.nome} (${currentOracleRuna.glyph})\n${currentOracleRuna.palavra}\nConselho: ${currentOracleRuna.conselho}\nAfirmação: ${currentOracleRuna.afirmacao}`;
      navigator.clipboard?.writeText(text).then(() => toast("Conselho rúnico copiado!"));
    });
  }

  if (oracleSpeakBtn) {
    oracleSpeakBtn.addEventListener("click", () => {
      if (!currentOracleRuna) return;
      speak(`Runa ${currentOracleRuna.nome}. ${currentOracleRuna.palavra}. Conselho do Velho Juremeiro: ${currentOracleRuna.conselho}`);
    });
  }

  // 3. Mandalas Vibracionais & Respiração 4-2-6
  const mandalaPills = $("#mandalaPills");
  const mandalaSvgWrap = $("#mandalaSvgWrap");
  const mandalaSvgCanvas = $("#mandalaSvgCanvas");
  const mandalaCaption = $("#mandalaCaption");

  const MANDALAS_DICT = {
    flor: {
      title: "Flor da Vida (Geometria Cósmica Primordial)",
      caption: "<strong>Flor da Vida:</strong> Geometria sagrada universal dos 19 círculos entrelaçados. Harmoniza a estrutura celular e dissolve pensamentos dispersos.",
      svg: `
        <defs>
          <radialGradient id="gradFlor" cx="50%" cy="50%" r="50%">
            <stop class="mstop-gold" offset="0%" stop-opacity="0.9"/>
            <stop class="mstop-sky" offset="70%" stop-opacity="0.4"/>
            <stop class="mstop-sky-deep" offset="100%" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <circle class="ms-gold" cx="100" cy="100" r="88" fill="none" stroke-width="2" stroke-opacity="0.6"/>
        <circle class="ms-leaf" cx="100" cy="100" r="94" fill="none" stroke-width="1.2" stroke-opacity="0.4"/>
        <circle class="ms-gold" cx="100" cy="100" r="32" fill="none" stroke-width="1.6"/>
        <!-- 6 Círculos Concêntricos -->
        <circle class="ms-gold" cx="100" cy="68" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle class="ms-gold" cx="127" cy="84" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle class="ms-gold" cx="127" cy="116" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle class="ms-gold" cx="100" cy="132" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle class="ms-gold" cx="73" cy="116" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <circle class="ms-gold" cx="73" cy="84" r="32" fill="none" stroke-width="1.4" stroke-opacity="0.7"/>
        <!-- Anel Externo de Pétalas -->
        <circle class="ms-leaf" cx="100" cy="36" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="ms-leaf" cx="155" cy="68" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="ms-leaf" cx="155" cy="132" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="ms-leaf" cx="100" cy="164" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="ms-leaf" cx="45" cy="132" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="ms-leaf" cx="45" cy="68" r="32" fill="none" stroke-width="1" stroke-opacity="0.45"/>
        <circle class="mf-white" cx="100" cy="100" r="5" />
      `
    },
    solar: {
      title: "Mandala Solar (Fartura, Ouro & Realização)",
      caption: "<strong>Mandala Solar:</strong> Alinhamento com o chakra do plexo solar. Desperta entusiasmo, energia de realização e sensação de merecimento da fartura.",
      svg: `
        <circle class="ms-gold" cx="100" cy="100" r="90" fill="none" stroke-width="2" stroke-dasharray="4,3" opacity="0.6"/>
        <circle class="ms-ember" cx="100" cy="100" r="76" fill="none" stroke-width="1.5" opacity="0.8"/>
        <!-- 12 Raios Solares Geométricos -->
        <g class="ms-amber" stroke-width="2" opacity="0.85">
          <line x1="100" y1="12" x2="100" y2="40"/>
          <line x1="100" y1="160" x2="100" y2="188"/>
          <line x1="12" y1="100" x2="40" y2="100"/>
          <line x1="160" y1="100" x2="188" y2="100"/>
          <line x1="38" y1="38" x2="58" y2="58"/>
          <line x1="142" y1="142" x2="162" y2="162"/>
          <line x1="162" y1="38" x2="142" y2="58"/>
          <line x1="38" y1="162" x2="58" y2="142"/>
        </g>
        <!-- Estrela de Ouro Interna -->
        <polygon class="ms-gold" points="100,45 118,78 155,80 125,104 135,140 100,120 65,140 75,104 45,80 82,78" fill="rgba(245,158,11,0.2)" stroke-width="1.8"/>
        <circle class="ms-amber" cx="100" cy="100" r="22" fill="rgba(251,191,36,0.3)" stroke-width="2"/>
        <circle class="mf-white" cx="100" cy="100" r="6" />
      `
    },
    jurema: {
      title: "Mandala da Jurema (Matas Sagradas & Raiz)",
      caption: "<strong>Mandala das Matas & Jurema:</strong> Sintonização com Oxóssi e os Mestres das Matas. Ancora os pés na terra, acalma vertigens e restabelece a força física.",
      svg: `
        <circle class="ms-emerald" cx="100" cy="100" r="88" fill="none" stroke-width="2" opacity="0.6"/>
        <circle class="ms-emerald-light" cx="100" cy="100" r="70" fill="none" stroke-width="1.5" stroke-dasharray="6,4"/>
        <!-- 8 Folhas em Cruz e Diagonal -->
        <g class="ms-emerald" stroke-width="1.6" fill="rgba(16,185,129,0.18)">
          <path d="M100,100 C115,70 115,40 100,25 C85,40 85,70 100,100 Z"/>
          <path d="M100,100 C115,130 115,160 100,175 C85,160 85,130 100,100 Z"/>
          <path d="M100,100 C70,115 40,115 25,100 C40,85 70,85 100,100 Z"/>
          <path d="M100,100 C130,115 160,115 175,100 C160,85 130,85 100,100 Z"/>
          <!-- Diagonais menores -->
          <path d="M100,100 C125,85 145,65 155,45 C135,55 115,75 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C75,125 55,145 45,155 C65,135 85,115 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C125,115 145,135 155,155 C135,145 115,125 100,100 Z" opacity="0.8"/>
          <path d="M100,100 C75,85 55,65 45,45 C65,55 85,75 100,100 Z" opacity="0.8"/>
        </g>
        <circle class="ms-emerald-light" cx="100" cy="100" r="14" fill="rgba(5,150,105,0.4)" stroke-width="1.8"/>
        <circle class="mf-emerald-pale" cx="100" cy="100" r="5" />
      `
    },
    aguas: {
      title: "Mandala das Águas (Purificação, Lótus & Serenidade)",
      caption: "<strong>Mandala das Águas Sagradas:</strong> Conexão com Iemanjá e Oxum. Acalma a ansiedade no peito, dissolve o peso de insônias e limpa mágoas acumuladas.",
      svg: `
        <circle class="ms-sky" cx="100" cy="100" r="92" fill="none" stroke-width="1.5" opacity="0.5"/>
        <circle class="ms-ocean" cx="100" cy="100" r="78" fill="none" stroke-width="2" opacity="0.75"/>
        <circle class="ms-sky-light" cx="100" cy="100" r="60" fill="none" stroke-width="1.5" stroke-dasharray="3,3"/>
        <!-- Ondas Consecutivas em Lótus -->
        <g class="ms-sky" stroke-width="1.8" fill="rgba(14,165,233,0.14)">
          <path d="M100,100 Q120,60 100,35 Q80,60 100,100 Z"/>
          <path d="M100,100 Q140,80 165,100 Q140,120 100,100 Z"/>
          <path d="M100,100 Q120,140 100,165 Q80,140 100,100 Z"/>
          <path d="M100,100 Q60,80 35,100 Q60,120 100,100 Z"/>
          <!-- Ondas Intermediárias -->
          <circle class="ms-sky-pale" cx="100" cy="100" r="42" fill="none" stroke-width="1.2"/>
          <path class="ms-sky" d="M100,100 C115,85 130,85 145,100 C130,115 115,115 100,100" fill="none"/>
          <path class="ms-sky" d="M100,100 C85,85 70,85 55,100 C70,115 85,115 100,100" fill="none"/>
        </g>
        <circle class="ms-sky-pale" cx="100" cy="100" r="12" fill="rgba(14,165,233,0.3)" stroke-width="2"/>
        <circle class="mf-white" cx="100" cy="100" r="4" />
      `
    }
  };

  function setMandala(key, btn) {
    const data = MANDALAS_DICT[key] || MANDALAS_DICT.flor;
    if (mandalaSvgCanvas) {
      mandalaSvgCanvas.innerHTML = data.svg;
    }
    if (mandalaCaption) {
      mandalaCaption.innerHTML = data.caption;
    }
    if (mandalaPills) {
      mandalaPills.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      if (btn) btn.classList.add("pill--active");
    }
  }

  if (mandalaPills) {
    mandalaPills.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-mandala]");
      if (!btn) return;
      const key = btn.getAttribute("data-mandala");
      setMandala(key, btn);
    });
  }

  // Define padrão inicial
  setMandala("flor", mandalaPills?.querySelector("button[data-mandala='flor']"));

  // 4. Temporizador de Respiração 4-2-6
  const btnStartBreathe = $("#btnStartBreathe");
  const btnResetBreathe = $("#btnResetBreathe");
  const breathePhaseBadge = $("#breathePhaseBadge");
  const breatheTimerCount = $("#breatheTimerCount");
  const breathePhaseInstruction = $("#breathePhaseInstruction");
  const breatheCycleCount = $("#breatheCycleCount");

  let breatheInterval = null;
  let breathePhase = "idle"; // "inhale", "hold", "exhale"
  let secondsLeft = 4;
  let cyclesCompleted = 0;
  let isRunning = false;

  function updateBreatheUI(phase, count, instruction, badgeClass, badgeText, pulseClass) {
    if (breatheTimerCount) breatheTimerCount.textContent = count;
    if (breathePhaseInstruction) breathePhaseInstruction.textContent = instruction;
    if (breathePhaseBadge) {
      breathePhaseBadge.className = `breathe-phase-pill ${badgeClass}`;
      breathePhaseBadge.textContent = badgeText;
    }
    if (mandalaSvgWrap) {
      mandalaSvgWrap.className = `mandala-svg-wrap ${pulseClass}`;
    }
  }

  function startNextPhase() {
    if (breathePhase === "idle" || breathePhase === "exhale") {
      breathePhase = "inhale";
      secondsLeft = 4;
      updateBreatheUI(
        "inhale",
        secondsLeft,
        "Puxe o ar suavemente pelo nariz, trazendo a luz da geometria para o peito.",
        "phase-inhale",
        "🌱 INSPIRE (4 segundos)",
        "pulse-inhale"
      );
    } else if (breathePhase === "inhale") {
      breathePhase = "hold";
      secondsLeft = 2;
      updateBreatheUI(
        "hold",
        secondsLeft,
        "Segure o ar com calma. Sinta sua firmeza interior.",
        "phase-hold",
        "🟡 RETENHA (2 segundos)",
        "pulse-hold"
      );
    } else if (breathePhase === "hold") {
      breathePhase = "exhale";
      secondsLeft = 6;
      updateBreatheUI(
        "exhale",
        secondsLeft,
        "Solte o ar devagar pela boca, liberando todo o cansaço, estresse e peso.",
        "phase-exhale",
        "🌊 EXPIRE (6 segundos)",
        "pulse-exhale"
      );
    }
  }

  function tickBreathe() {
    secondsLeft--;
    if (secondsLeft > 0) {
      if (breatheTimerCount) breatheTimerCount.textContent = secondsLeft;
    } else {
      if (breathePhase === "exhale") {
        cyclesCompleted++;
        if (breatheCycleCount) breatheCycleCount.textContent = cyclesCompleted;
      }
      startNextPhase();
    }
  }

  if (btnStartBreathe) {
    btnStartBreathe.addEventListener("click", () => {
      if (!isRunning) {
        isRunning = true;
        btnStartBreathe.textContent = "⏸️ Pausar Respiração";
        btnStartBreathe.classList.add("btn--ghost");
        startNextPhase();
        breatheInterval = setInterval(tickBreathe, 1000);
      } else {
        isRunning = false;
        btnStartBreathe.textContent = "▶️ Retomar Respiração";
        btnStartBreathe.classList.remove("btn--ghost");
        clearInterval(breatheInterval);
      }
    });
  }

  if (btnResetBreathe) {
    btnResetBreathe.addEventListener("click", () => {
      isRunning = false;
      clearInterval(breatheInterval);
      breathePhase = "idle";
      secondsLeft = 4;
      cyclesCompleted = 0;
      if (breatheCycleCount) breatheCycleCount.textContent = "0";
      if (btnStartBreathe) {
        btnStartBreathe.textContent = "▶️ Iniciar Respiração Guiada";
        btnStartBreathe.classList.remove("btn--ghost");
      }
      updateBreatheUI(
        "idle",
        "4",
        "Fixe o olhar no ponto central da mandala e acompanhe o ritmo do círculo.",
        "phase-inhale",
        "🌱 INSPIRE (Pelo nariz)",
        ""
      );
    });
  }

  // 5. Criador de Sigilos Sagrados & Roda Numérica Cósmica (1 a 9)
  const sigilInput = $("#sigilInput");
  const sigilClearBtn = $("#sigilClearBtn");
  const sigilPresets = $("#sigilPresets");
  const sigilStepOrig = $("#sigilStepOrig");
  const sigilStepCons = $("#sigilStepCons");
  const sigilStepUniq = $("#sigilStepUniq");
  const sigilStepNums = $("#sigilStepNums");
  const sigilLetterMap = $("#sigilLetterMap");
  const sigilSvgCanvas = $("#sigilSvgCanvas");
  const sigilCaption = $("#sigilCaption");
  const btnStyleStraight = $("#btnStyleStraight");
  const btnStyleCurved = $("#btnStyleCurved");
  const btnViewComplete = $("#btnViewComplete");
  const btnViewPure = $("#btnViewPure");
  const sigilColors = $("#sigilColors");
  const btnDownloadSigil = $("#btnDownloadSigil");
  const btnAnimateSigil = $("#btnAnimateSigil");
  const btnCopySigilData = $("#btnCopySigilData");

  const PYTHAGOREAN_TABLE = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  const VOWELS_SET = new Set(["A", "E", "I", "O", "U"]);

  let sigilLineStyle = "straight"; // "straight" | "curved"
  let sigilViewMode = "complete";  // "complete" | "pure"
  let sigilActiveColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(); // dourado padrão
  let currentSigilData = null;

  function processSigilWord(rawText) {
    if (!rawText || !rawText.trim()) {
      return {
        original: "",
        consonants: [],
        uniqueConsonants: [],
        letterMap: [],
        numberSequence: []
      };
    }

    const cleanUpper = rawText
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    const lettersOnly = cleanUpper.replace(/[^A-Z]/g, "").split("");
    const consonants = lettersOnly.filter(c => !VOWELS_SET.has(c));
    const uniqueConsonants = Array.from(new Set(consonants));

    const letterMap = uniqueConsonants.map(c => ({
      letter: c,
      num: PYTHAGOREAN_TABLE[c] || 1
    }));

    const numberSequence = letterMap.map(item => item.num);

    return {
      original: cleanUpper,
      consonants,
      uniqueConsonants,
      letterMap,
      numberSequence
    };
  }

  function getWheelCoords(num, radius = 110, cx = 160, cy = 160) {
    // 9 números distribuídos como relógio sagrado (1 no ápice a -90°)
    const angleDeg = -90 + (num - 1) * 40;
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
      angleDeg,
      rad
    };
  }

  function renderSigilSvg(data, shouldAnimate = true) {
    if (!sigilSvgCanvas) return;

    const cx = 160;
    const cy = 160;
    const rWheel = 110;
    const seq = data.numberSequence;
    const color = sigilActiveColor;
    const isPure = sigilViewMode === "pure";

    // 1. Defs: Filtro de brilho sutil
    let svgHtml = `
      <defs>
        <filter id="sigilGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="sigilCenterGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
    `;

    // 2. Elementos de Fundo Místico (Anéis Orbitais e Centro Cósmico)
    svgHtml += `
      <!-- Centro Cósmico -->
      <circle cx="${cx}" cy="${cy}" r="148" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="138" fill="none" stroke="${color}" stroke-opacity="${isPure ? '0.08' : '0.22'}" stroke-width="1.2" stroke-dasharray="4,4"/>
      <circle cx="${cx}" cy="${cy}" r="${rWheel}" fill="url(#sigilCenterGrad)" stroke="rgba(255,255,255,${isPure ? '0.04' : '0.12'})" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="2" fill="${color}" opacity="0.6"/>
    `;

    // 3. Mostrador da Roda de 9 Pontos (estilo relógio)
    if (!isPure) {
      for (let n = 1; n <= 9; n++) {
        const pt = getWheelCoords(n, rWheel, cx, cy);
        const inSeq = seq.includes(n);

        // Nó do número
        svgHtml += `
          <g class="wheel-node">
            ${inSeq ? `
              <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="14" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-dasharray="2,2"/>
            ` : ""}
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="9.5" fill="${inSeq ? 'rgba(227,184,103, 0.15)' : 'rgba(20,29,23, 0.9)'}" stroke="${inSeq ? color : 'rgba(255,255,255,0.22)'}" stroke-width="1.4"/>
            <text x="${pt.x.toFixed(1)}" y="${(pt.y + 3.8).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${inSeq ? color : 'rgba(255,255,255,0.7)'}" font-family="inherit">${n}</text>
          </g>
        `;
      }
    }

    // 4. Traçado do Sigilo Sagrado
    if (seq.length > 0) {
      const animClass = shouldAnimate ? "sigil-drawn-path sigil-animate-active" : "sigil-drawn-path";

      if (seq.length === 1) {
        // Apenas um ponto: Nó de Ativação Sagrado com Anel Solar
        const pt0 = getWheelCoords(seq[0], rWheel, cx, cy);
        svgHtml += `
          <g filter="url(#sigilGlow)">
            <circle cx="${pt0.x.toFixed(1)}" cy="${pt0.y.toFixed(1)}" r="7" fill="${color}"/>
            <circle cx="${pt0.x.toFixed(1)}" cy="${pt0.y.toFixed(1)}" r="16" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="5,3"/>
            <line x1="${(pt0.x - 14).toFixed(1)}" y1="${pt0.y.toFixed(1)}" x2="${(pt0.x + 14).toFixed(1)}" y2="${pt0.y.toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          </g>
        `;
      } else {
        const ptStart = getWheelCoords(seq[0], rWheel, cx, cy);

        // Construir caminho (Path)
        let pathD = `M ${ptStart.x.toFixed(1)} ${ptStart.y.toFixed(1)}`;
        let lastPt = ptStart;
        let lastTanDx = 0;
        let lastTanDy = 0;

        for (let i = 1; i < seq.length; i++) {
          const ptCurr = getWheelCoords(seq[i], rWheel, cx, cy);

          if (seq[i] === seq[i - 1]) {
            // Número repetido em sequência: Laço orbital místico
            const loopRadius = 18;
            pathD += ` A ${loopRadius} ${loopRadius} 0 1 1 ${(ptCurr.x + 0.1).toFixed(1)} ${(ptCurr.y + 0.1).toFixed(1)}`;
            lastTanDx = ptCurr.x - cx;
            lastTanDy = ptCurr.y - cy;
          } else if (sigilLineStyle === "curved") {
            // Linhas Curvas: arco gracioso puxado suavemente para o centro
            const mx = (lastPt.x + ptCurr.x) / 2;
            const my = (lastPt.y + ptCurr.y) / 2;
            const cpx = mx + (cx - mx) * 0.32;
            const cpy = my + (cy - my) * 0.32;
            pathD += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ptCurr.x.toFixed(1)} ${ptCurr.y.toFixed(1)}`;
            lastTanDx = ptCurr.x - cpx;
            lastTanDy = ptCurr.y - cpy;
          } else {
            // Linhas Retas: Geometria cristalina pura
            pathD += ` L ${ptCurr.x.toFixed(1)} ${ptCurr.y.toFixed(1)}`;
            lastTanDx = ptCurr.x - lastPt.x;
            lastTanDy = ptCurr.y - lastPt.y;
          }

          lastPt = ptCurr;
        }

        // SVG Path principal
        svgHtml += `
          <g filter="url(#sigilGlow)">
            <path id="sigilActivePath" d="${pathD}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" class="${animClass}"/>
          </g>
        `;

        // Ponto de Origem: Nó Circular Sagrado
        svgHtml += `
          <g class="sigil-start-node" filter="url(#sigilGlow)">
            <circle cx="${ptStart.x.toFixed(1)}" cy="${ptStart.y.toFixed(1)}" r="6" fill="${color}"/>
            <circle cx="${ptStart.x.toFixed(1)}" cy="${ptStart.y.toFixed(1)}" r="11" fill="none" stroke="${color}" stroke-width="1.6" stroke-opacity="0.6"/>
          </g>
        `;

        // Vértices Intermediários: Pequenos nós de firmeza
        for (let i = 1; i < seq.length - 1; i++) {
          const ptMid = getWheelCoords(seq[i], rWheel, cx, cy);
          svgHtml += `
            <circle cx="${ptMid.x.toFixed(1)}" cy="${ptMid.y.toFixed(1)}" r="3.2" fill="${color}" opacity="0.85"/>
          `;
        }

        // Barra Terminal Perpendicular (T-Bar de Ancoragem Tradicional)
        const ptEnd = lastPt;
        const len = Math.hypot(lastTanDx, lastTanDy);
        let nx = 0;
        let ny = 1;
        if (len > 0.001) {
          nx = -lastTanDy / len;
          ny = lastTanDx / len;
        }

        const barHalf = 13;
        const barX1 = ptEnd.x - nx * barHalf;
        const barY1 = ptEnd.y - ny * barHalf;
        const barX2 = ptEnd.x + nx * barHalf;
        const barY2 = ptEnd.y + ny * barHalf;

        svgHtml += `
          <g class="sigil-end-bar" filter="url(#sigilGlow)">
            <line x1="${barX1.toFixed(1)}" y1="${barY1.toFixed(1)}" x2="${barX2.toFixed(1)}" y2="${barY2.toFixed(1)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
          </g>
        `;
      }
    } else {
      // Estado vazio / apenas vogais
      svgHtml += `
        <text x="${cx}" y="${cy}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="12">
          Digite palavras com consoantes
        </text>
      `;
    }

    sigilSvgCanvas.innerHTML = svgHtml;
  }

  function updateSigilUI(shouldAnimate = true) {
    const rawWord = sigilInput ? sigilInput.value : "PROSPERIDADE";
    const data = processSigilWord(rawWord);
    currentSigilData = data;

    // Atualizar Decomposição Visual Passo a Passo
    if (sigilStepOrig) {
      sigilStepOrig.textContent = data.original || "—";
    }

    if (sigilStepCons) {
      sigilStepCons.textContent = data.consonants.length > 0 ? data.consonants.join(" ") : "(sem consoantes)";
    }

    if (sigilStepUniq) {
      sigilStepUniq.textContent = data.uniqueConsonants.length > 0 ? data.uniqueConsonants.join(" ") : "(nenhuma)";
    }

    if (sigilStepNums) {
      sigilStepNums.textContent = data.numberSequence.length > 0 ? data.numberSequence.join(" • ") : "—";
    }

    if (sigilLetterMap) {
      if (data.letterMap.length > 0) {
        sigilLetterMap.textContent = data.letterMap.map(m => `${m.letter} (${m.num})`).join(" ➔ ");
      } else {
        sigilLetterMap.textContent = "Digite uma palavra contendo consoantes para iniciar a sequência geométrica.";
      }
    }

    // Atualizar Legenda do Sigilo
    if (sigilCaption) {
      if (data.numberSequence.length > 1) {
        const startNum = data.numberSequence[0];
        const endNum = data.numberSequence[data.numberSequence.length - 1];
        sigilCaption.innerHTML = `<strong>Sigilo Consagrado:</strong> Roda de 9 pontos iniciada no número <strong>${startNum}</strong> e ancorada no número <strong>${endNum}</strong>. (${data.numberSequence.length} traçados de firmeza).`;
      } else if (data.numberSequence.length === 1) {
        sigilCaption.innerHTML = `<strong>Vórtice Concentrado:</strong> Intenção polarizada no número sagrado <strong>${data.numberSequence[0]}</strong>.`;
      } else {
        sigilCaption.innerHTML = `Escreva uma palavra de intenção positiva para traçar a geometria sagrada.`;
      }
    }

    // Renderizar SVG
    renderSigilSvg(data, shouldAnimate);
  }

  // Event Listeners do Criador de Sigilos
  if (sigilInput) {
    sigilInput.addEventListener("input", () => {
      // Remover classe ativa dos presets quando o usuário digita livremente
      if (sigilPresets) {
        sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      }
      updateSigilUI(true);
    });
  }

  if (sigilClearBtn) {
    sigilClearBtn.addEventListener("click", () => {
      if (sigilInput) {
        sigilInput.value = "";
        sigilInput.focus();
      }
      if (sigilPresets) {
        sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      }
      updateSigilUI(false);
    });
  }

  if (sigilPresets) {
    sigilPresets.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-preset]");
      if (!btn) return;
      const val = btn.getAttribute("data-preset");
      if (sigilInput) sigilInput.value = val;

      sigilPresets.querySelectorAll(".pill").forEach(p => p.classList.remove("pill--active"));
      btn.classList.add("pill--active");

      updateSigilUI(true);
      toast(`Intenção carregada: ${val}`);
    });
  }

  // Controles de Estilo de Linha
  if (btnStyleStraight) {
    btnStyleStraight.addEventListener("click", () => {
      sigilLineStyle = "straight";
      btnStyleStraight.classList.add("pill--active");
      btnStyleCurved?.classList.remove("pill--active");
      updateSigilUI(true);
    });
  }

  if (btnStyleCurved) {
    btnStyleCurved.addEventListener("click", () => {
      sigilLineStyle = "curved";
      btnStyleCurved.classList.add("pill--active");
      btnStyleStraight?.classList.remove("pill--active");
      updateSigilUI(true);
    });
  }

  // Controles de Modo de Visualização (Com Relógio vs Puro)
  if (btnViewComplete) {
    btnViewComplete.addEventListener("click", () => {
      sigilViewMode = "complete";
      btnViewComplete.classList.add("pill--active");
      btnViewPure?.classList.remove("pill--active");
      updateSigilUI(false);
    });
  }

  if (btnViewPure) {
    btnViewPure.addEventListener("click", () => {
      sigilViewMode = "pure";
      btnViewPure.classList.add("pill--active");
      btnViewComplete?.classList.remove("pill--active");
      updateSigilUI(false);
    });
  }

  // Paleta de Cores do Sigilo
  if (sigilColors) {
    sigilColors.addEventListener("click", (e) => {
      const dot = e.target.closest("button[data-color]");
      if (!dot) return;
      sigilActiveColor = dot.getAttribute("data-color");
      sigilColors.querySelectorAll(".color-dot-btn").forEach(d => d.classList.remove("color-dot--active"));
      dot.classList.add("color-dot--active");
      updateSigilUI(false);
    });
  }

  // Ação: Animar Novamente
  if (btnAnimateSigil) {
    btnAnimateSigil.addEventListener("click", () => {
      updateSigilUI(true);
      toast("Traçado sagrado reanimado!");
    });
  }

  // Ação: Copiar Dados do Sigilo
  if (btnCopySigilData) {
    btnCopySigilData.addEventListener("click", () => {
      if (!currentSigilData || currentSigilData.numberSequence.length === 0) {
        toast("Nenhum sigilo ativo para copiar.");
        return;
      }
      const textToCopy = `✨ SIGILO SAGRADO — FOCO VIBRACIONAL\nIntenção: ${currentSigilData.original}\nConsoantes Únicas: ${currentSigilData.uniqueConsonants.join(" - ")}\nSequência na Roda (1-9): ${currentSigilData.numberSequence.join(" • ")}\nInício: Nó no ${currentSigilData.numberSequence[0]} | Término: Barra no ${currentSigilData.numberSequence[currentSigilData.numberSequence.length - 1]}`;
      navigator.clipboard?.writeText(textToCopy).then(() => {
        toast("Dados do sigilo copiados!");
      });
    });
  }

  // Ação: Baixar Sigilo em SVG
  if (btnDownloadSigil) {
    btnDownloadSigil.addEventListener("click", () => {
      if (!sigilSvgCanvas) return;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(sigilSvgCanvas);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const wordSlug = (currentSigilData?.original || "sigilo")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
      downloadLink.href = url;
      downloadLink.download = `sigilo-${wordSlug}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      toast(`Arquivo sigilo-${wordSlug}.svg baixado com sucesso!`);
    });
  }

  // Inicializar renderização inicial do sigilo
  updateSigilUI(true);
}

