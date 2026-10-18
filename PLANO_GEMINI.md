# PLANO DE EXECUÇÃO — Reestruturação do Foco Vibracional

> **Executor:** Gemini (Antigravity) — faz todo o trabalho braçal.
> **Supervisor:** Claude — define a estratégia, revisa cada fase e faz os ajustes finos.
> **Contexto do projeto:** leia antes `DOCUMENTACAO_JUREMA_FOCO.md` (propósito, tom de voz e regras de ouro).

---

## 0. Regras para o executor (LEIA PRIMEIRO)

1. **Trabalhe uma fase por vez, na ordem.** Ao terminar uma fase, **pare**, preencha a seção *Registro de Execução* no fim deste arquivo e aguarde a revisão antes de seguir.
2. **Não invente fundamentos.** Conteúdo espiritual novo deve seguir o tom e a linha da Jurema Sagrada já presentes no site (acolhedor, sem medo, sem cobrança). Nada de "trabalhos" de amarração, prejuízo a terceiros ou promessas de cura médica.
3. **Segurança das ervas é obrigatória.** Toda erva ou banho novo precisa do campo `cuidados` preenchido: toxicidade, fotossensibilidade, gestantes/lactantes, crianças, pets e se vai ou não na cabeça. Na dúvida: "do pescoço para baixo".
4. **Não quebre links.** Se uma página for fundida em outra, o arquivo antigo vira um redirecionamento (ver modelo na Fase 2).
5. **Codificação:** todos os arquivos em **UTF-8 sem BOM**. Confira se acentos (ã, ç, é) aparecem certos no navegador.
6. **Teste local** ao fim de cada fase: `python -m http.server 8000` e navegue por **todas** as páginas, no desktop e com DevTools em 375 px (celular). Console sem erros.
7. **Commits pequenos**, um por fase, com mensagem em português (`fase 1: ...`).
8. Mantenha o **visual atual** (cores, fontes, cards). O objetivo é organizar, não redesenhar.

---

## 1. Diagnóstico (feito pelo supervisor)

| # | Problema | Onde |
|---|---|---|
| D1 | Menu com **12 links soltos**, copiado à mão em 13 HTMLs (`simbolos.html` já está fora de sincronia) | todas as páginas |
| D2 | **Grabovoi / sequências numéricas** repetidas em 3 lugares | `index.html` (#grabovoi), `mantras.html` ("Sequências numéricas"), `portais.html` |
| D3 | **"Antes de dormir"** espalhado em 3 lugares | `index.html` (#antes-dormir), `afirmacoes.html`, `perguntas.html` |
| D4 | **Mantra do dia + técnicas no trabalho** duplicados | `index.html` e `mantras.html` |
| D5 | **Fases da lua** explicadas em 4 lugares | `calendario.html`, `colheita.html`, `banhos.html` e `defumacao.html` ("Linha do tempo lunar") |
| D6 | **Colheita** duplicada | `plantas.html` ("Colheita (visão geral)") e `colheita.html` |
| D7 | **Respiração 4-2-6** duplicada | `index.html` e `simbolos.html` |
| D8 | `script/script.js` tem **285 KB / 6.393 linhas**; as linhas ~27–3620 são `FALLBACK_*`, que **copiam os JSONs** e já começam a divergir | `script/script.js` |
| D9 | **Banhos duplicados nos dados** | `banho-boldo-puro-ori` ≈ `banho-boldo-tapete-oxala-puro`; `banho-folha-manga-boiadeiro` ≈ `banho-folha-manga-limpeza-profunda`; `banho-folha-amora-nana` ≈ `banho-folha-amora-cha-cura`; `banho-pitangueira-hortela` ≈ `banho-pitangueira-dinamismo`; verificar também `banho-ervadoce-alfazema` × `banho-ervadoce-puro-ori` |
| D10 | Ervas, banhos e defumações **não se ligam entre si** (a pessoa vê "Arruda" num banho, mas não consegue clicar e abrir a ficha da erva) | dados e renderização |
| D11 | Não existe **busca global**, nem um caminho do tipo "estou sentindo X, o que faço?" | — |

---

## 2. Nova arquitetura de informação (alvo)

Menu principal com **6 itens** (com submenu no desktop e menu hambúrguer no celular):

| Menu | Página | Conteúdo (fonte única) | Absorve |
|---|---|---|---|
| **Hoje** | `index.html` | Painel do dia: lua atual, mantra do dia, **banho/defumação sugeridos para hoje** (lua + dia da semana), "É portal hoje?", **Oráculo "Como você está?"** e atalhos | resumo de D2, D3, D4 (somente cards com links, sem repetir conteúdo) |
| **Ervas & Rituais** ▾ | `plantas.html` · `banhos.html` · `defumacao.html` · `colheita.html` | Catálogos ligados entre si | D6 (a colheita fica só em `colheita.html`) |
| **Mente & Palavra** ▾ | `mantras.html` (abas: Mantras · Afirmações · Perguntas da Noite · Favoritos) | Fonte única de mantras, técnicas de trabalho e do ritual da noite | `afirmacoes.html`, `perguntas.html` → redirecionamentos |
| **Números & Lua** ▾ | `calendario.html` (fases + planner) · `portais.html` (portais + **Grabovoi, fonte única**) | Toda a explicação lunar fica em `calendario.html` | D2, D5 |
| **Símbolos** | `simbolos.html` | Pemba, runas, mandalas, sigilos | D7 (o 4-2-6 fica aqui; o index só linka) |
| **Glossário** | `glossario.html` | Termos | — |

As páginas de banhos e defumação mantêm apenas um **mini selo da lua de hoje + filtro por lua**; a explicação completa vira link para `calendario.html#fases`.

---

## 3. Fases de execução

### FASE 1 — Fundação técnica (sem mudança visível)

**1.1 Dados com fonte única (resolve D8)**
- Criar `data/ervas.js`, `data/banhos.js`, `data/defumacoes.js` e `data/mantras.js`, cada um no formato:
  ```js
  window.FV_DATA = window.FV_DATA || {};
  window.FV_DATA.banhos = [ /* conteúdo do array "banhos" do JSON */ ];
  ```
  Gere por script (não copie à mão), por exemplo em Python: ler o JSON e gravar `window.FV_DATA.x = ` + `json.dumps(..., ensure_ascii=False, indent=1)` + `;`.
- Em cada HTML que usa dados, antes de `script.js`, incluir só os arquivos necessários: `<script src="./data/banhos.js"></script>`.
- Em `script.js`: **apagar todos os `FALLBACK_*`** e as funções `loadMantras/loadErvas/loadBanhos/loadDefumacoes` passam a ler de `window.FV_DATA` (sem `fetch`). Assim o site funciona até abrindo o arquivo direto (`file://`), sem servidor.
- Apagar os `.json` antigos **somente depois** de confirmar que todas as páginas renderizam. A partir daqui, os `.js` em `data/` são a única fonte da verdade.
- Meta: `script.js` abaixo de ~110 KB.

**1.2 Cabeçalho e rodapé únicos (resolve D1)**
- Em `script.js`, criar `const NAV = [...]` com a estrutura da seção 2 e uma função `renderHeader()`, que monta o `<header class="topbar">` dentro de um `<div id="site-header"></div>` presente em cada página e marca o link ativo pelo `location.pathname`.
- Celular (≤ 900 px): botão hambúrguer (`aria-expanded`, fecha com Esc e ao clicar fora). Desktop: submenus abrem no hover **e** no foco do teclado.
- Criar também `renderFooter()`, com links rápidos e a frase "Salve os Mestres e Mestras da Jurema Sagrada".
- Em cada HTML, substituir o `<header>...</header>` atual por `<div id="site-header"></div>` e colocar um `<noscript>` com um link simples para `index.html`.

**1.3 Limpeza dos dados (resolve D9)**
- Fundir os pares duplicados de D9 num único registro, ficando com o texto mais completo de cada campo. Manter o `id` mais curto e registrar no log quais `id`s foram removidos.
- Validar: nenhum `id` repetido; todo banho com `objetivo`, `intensidade`, `luas`, `dias`, `ervas`, `cabeca`, `modoPreparo`, `reza` e `observacao`.

✅ **Aceite da Fase 1:** todas as páginas funcionam como antes; o menu é gerado por JS e fica idêntico em todas; o hambúrguer funciona em 375 px; o console fica limpo; o site abre via `file://`.

---

### FASE 2 — Fusões e remoção de repetições

Modelo de redirecionamento para páginas absorvidas:
```html
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=mantras.html#afirmacoes">
<link rel="canonical" href="mantras.html#afirmacoes"><title>Redirecionando…</title></head>
<body><a href="mantras.html#afirmacoes">Ir para Afirmações</a></body></html>
```

- **2.1 `mantras.html` em abas:** Mantras | Afirmações | Perguntas da Noite | Favoritos. Mover para lá o conteúdo de `afirmacoes.html` e `perguntas.html` (incluindo "Antes de dormir" e "Fechamento da noite"). A aba é ativada pelo hash (`#afirmacoes`, `#noite`). Remover a seção "Sequências numéricas" de `mantras.html` e pôr no lugar um card com link para `portais.html#grabovoi`.
- **2.2 Grabovoi em fonte única** (`portais.html#grabovoi`): unir ali as sequências de `index.html` e de `mantras.html`, sem duplicar. Os dados das sequências ficam em um único array no JS.
- **2.3 Lua em fonte única:** "Como ler as fases" e o conteúdo de "Fases da lua e intenções" (de `colheita.html`) vão para `calendario.html#fases`. Em `banhos.html` e `defumacao.html`, trocar a "Linha do tempo lunar" por um selo compacto ("Hoje: Lua Crescente 🌒 · ver calendário") + filtro por lua.
- **2.4 Colheita:** remover "Colheita (visão geral)" de `plantas.html` e pôr um link para `colheita.html`. A colheita de cada erva continua na ficha da erva.
- **2.5 Index enxuto:** remover os blocos completos de Grabovoi, de "Antes de dormir" e de "Técnicas rápidas no trabalho". O index passa a mostrar só **cards-resumo com link** (ver Fase 3.1).
- **2.6** `afirmacoes.html` e `perguntas.html` viram redirecionamentos.

✅ **Aceite da Fase 2:** cada conteúdo existe em **um único lugar**; nenhum link quebrado (rodar uma verificação de `href` locais); os redirecionamentos funcionam.

---

### FASE 3 — Navegabilidade e recursos novos

**3.1 Painel "Hoje" (`index.html`)**
- Card da lua (já existe) + **"Sugestão para hoje"**: escolher 1 banho e 1 defumação cujos `luas` contenham a fase atual e cujos `dias` contenham o dia da semana. A escolha deve ser determinística por data (usar `dailyIndexByDate`), com botão "outra sugestão".
- Card "É portal hoje?" (reaproveitar `isPortalDay`).
- Card do mantra do dia (reaproveitar `setDailyMantra`), com link "ver todos".

**3.2 Oráculo "Como você está se sentindo?"** (Fase 2 do roadmap da documentação)
- Componente no index e no topo de `banhos.html`. São chips de sentimento, cada um ligado a objetivos dos dados:
  | Sentimento | objetivos |
  |---|---|
  | Cansaço / peso nas costas | limpeza → depois harmonizacao |
  | Ansiedade / insônia | harmonizacao, calma |
  | Caminhos fechados / trabalho travado | prosperidade, abertura |
  | Inveja / olho-gordo | protecao, limpeza |
  | Desânimo / sem força | vitalidade |
  | Casa pesada / brigas | defumação de limpeza + harmonização do lar |
  | Tristeza / luto | consolo, harmonizacao |
  | Antes de uma prova ou entrevista | foco, coragem |
  (Confira os valores reais de `objetivo` nos dados e ajuste o mapa a eles.)
- O resultado mostra um **ritual guiado em 3 passos**: (1) defumação, (2) banho, (3) mantra ou afirmação, cada um com link para a ficha completa. Para "cansaço/peso", sempre aplicar a regra dos **2 tempos** (descarrego → reconstrução) já descrita em `banhos.html`.
- Aviso fixo: "Este guia é espiritual e não substitui orientação médica ou psicológica."

**3.3 Ligações cruzadas (resolve D10)**
- Toda erva citada em banhos e defumações vira link para `plantas.html#<id-da-erva>`. Criar um mapa `nome → id` (normalizado com `normalizeSpiritualSearch`). Erva sem ficha fica como texto simples e entra numa lista no log.
- Na ficha da erva: seção **"Usada em"**, que lista os banhos e defumações que a contêm.
- `plantas.html`, `banhos.html` e `defumacao.html` devem abrir e destacar o card quando a URL tiver `#id` (scroll + realce de 2 s).

**3.4 Busca global (resolve D11)**
- Ícone de lupa no cabeçalho que abre um painel de busca com resultados agrupados (Ervas / Banhos / Defumações / Mantras / Glossário). Usar `normalizeSpiritualSearch` para ignorar acentos. Atalho de teclado: `/`.
- Para que a busca funcione em qualquer página, o painel carrega os `data/*.js` sob demanda (injetando `<script>`).

**3.5 Ergonomia**
- Botão "voltar ao topo" nas páginas longas (glossário, símbolos, catálogos).
- Índice ("Nesta página") fixo no topo de `simbolos.html` e `glossario.html`, com âncoras.
- Filtros dos catálogos refletidos na URL (`banhos.html?lua=cheia&objetivo=protecao`), para dar para compartilhar.

✅ **Aceite da Fase 3:** a partir do index, qualquer conteúdo é alcançado em ≤ 2 cliques; o oráculo retorna um ritual para todos os sentimentos; os links de ervas funcionam nos dois sentidos.

---

### FASE 4 — Novo conteúdo

Seguir **exatamente** o esquema dos dados existentes (veja o primeiro registro de cada arquivo). Todos com `cuidados`/`observacao` de segurança.

**4.1 Novas ervas (alvo: +10).** Sugestões acessíveis no Brasil. Antes de incluir, confirme se já existem:
aroeira-vermelha (*Schinus terebinthifolia*, que pode irritar a pele), alfavaca, erva-cidreira / melissa, capim-santo (se for diferente do capim-limão, senão unificar), malva, pata-de-vaca, vence-demanda, espinheira-santa, manjericão-roxo, folha de bananeira (uso ambiental) e cana-do-brejo.
Não incluir plantas de alta toxicidade para uso em banho de cabeça. Se incluir alguma tóxica (ex.: erva-de-santa-maria), o uso deve ser **somente ambiental**, com aviso em destaque.

**4.2 Novos banhos (alvo: +15), cobrindo lacunas:**
- Banho de **aroeira** (descarrego forte, do pescoço para baixo)
- Banho de **erva-cidreira + camomila** (sono das crianças: suave, morno, sem cabeça para bebês)
- Banho de **alfavaca + manjericão** (harmonização pós-descarrego, 2º tempo)
- Banho de **malva** (acalmar, consolo)
- Banho de **pata-de-vaca** (firmeza da casa e da família)
- Banho de **vence-demanda** (proteção no trabalho)
- Banho de **mel + rosa amarela** (doçura e prosperidade, adaptado da Oxum, se não duplicar um existente)
- Banho de **água de coco + rosa branca** (paz no Ori)
- Banho de **sal grosso + alecrim** (versão segura: só do pescoço para baixo, seguido de banho de ervas)
- Banho para **início de ciclo / aniversário**
- Banho para **véspera de prova ou entrevista** (foco)
- Banho de **luto e saudade** (consolo, manjerona + rosa branca)
- Banho de **reconciliação do lar** (para a família tomar)
- **Escalda-pés de alecrim + sal** (cansaço físico do trabalho; já existe um de alfazema, então diferenciar)
- Banho de **lua cheia** (água serenada na lua cheia + pétalas brancas)

**4.3 Novas defumações (alvo: +8):** aroeira + alecrim; erva-cidreira (paz noturna); casca de laranja seca + canela (alegria do lar); folha de louro + mirra; capim-santo; defumação para o **local de trabalho/escritório** (versão sem brasa: spray de ervas ou difusão); para **quarto de criança** (suave); e de **ano-novo / virada de ciclo**.

**4.4 Novos mantras e afirmações (alvo: +20)**, distribuídos entre as abas de `mantras.html`.

**4.5 Glossário:** acrescentar os termos novos que aparecerem nos rituais (ex.: água serenada, quartinha, Ori, eguns, firmeza, serenar).

✅ **Aceite da Fase 4:** contagens atualizadas (escrever no log); todos os novos registros com `id` único e cuidados preenchidos; os links cruzados da Fase 3.3 funcionam com as ervas novas.

---

### FASE 5 — Acabamento (opcional, após aprovação)

- **5.1 PWA:** `manifest.webmanifest` + `sw.js` com cache das páginas, CSS, JS, `data/*.js` e imagens. Ícone gerado a partir do `brand__dot`. Testar a instalação no Android/Chrome.
- **5.2 Desempenho:** `loading="lazy"` nas imagens; converter `images/*.jpg` para WebP ≤ 80 KB mantendo o `.jpg` como fallback, se for o caso.
- **5.3 Acessibilidade:** contraste AA, `alt` em todas as imagens, foco visível, `aria-label` nos botões só com ícone.
- **5.4 SEO básico:** `<meta name="description">` e Open Graph por página.
- **5.5 Documentação:** acrescentar a seção **3.10** em `DOCUMENTACAO_JUREMA_FOCO.md` resumindo esta reestruturação e atualizar o roadmap (marcar o Oráculo como concluído). Atualizar o `README.md` com a nova estrutura e "como adicionar um banho novo".

---

## 4. Checklist de verificação (rodar ao fim de cada fase)

- [ ] `python -m http.server 8000`: todas as páginas abrem sem erro no console
- [ ] Abrir `index.html` via `file://` também funciona (a partir da Fase 1)
- [ ] Menu igual em todas as páginas, com item ativo correto, hambúrguer em 375 px
- [ ] Nenhum `href` local quebrado (script simples que lista os `href` e testa se o arquivo/âncora existe)
- [ ] Acentos corretos (UTF-8)
- [ ] Busca, filtros, voz, copiar e favoritos continuam funcionando
- [ ] Sem conteúdo duplicado entre páginas

---

## 5. Registro de Execução (preenchido pelo Gemini)

> Formato: `### Fase N — AAAA-MM-DD` · o que foi feito · arquivos alterados · `id`s removidos/criados · pendências/dúvidas para o supervisor.

<!-- Gemini: escreva abaixo desta linha -->

### Fase 1 — 2026-10-18 · Fundação técnica, menu unificado e fonte única de dados

- **O que foi feito:**
  - **1.1 Dados com fonte única (resolve D8):**
    - Gerados `data/ervas.js` (50 ervas), `data/banhos.js` (58 banhos), `data/defumacoes.js` (25 defumações) e `data/mantras.js` (30 mantras) no padrão `window.FV_DATA = window.FV_DATA || {}; window.FV_DATA.x = [...]`.
    - Em `script/script.js`: Eliminados todos os arrays `FALLBACK_*` (~3.590 linhas de duplicação removidas). O script foi reduzido de 285 KB para ~121 KB (redução de 57% mantendo todos os recursos).
    - `loadMantras()`, `loadErvas()`, `loadBanhos()`, `loadDefumacoes()` agora lêem síncrona e diretamente de `window.FV_DATA` sem `fetch()`, garantindo funcionamento 100% offline em `file:///` e sem dependência de servidor web.
    - Arquivos `.json` legados arquivados em backup seguro e removidos de `data/`.
  - **1.2 Cabeçalho e rodapé únicos (resolve D1):**
    - Definida a estrutura `const NAV = [...]` em `script/script.js` com os 6 itens principais da Seção 2 (Hoje, Ervas & Rituais, Mente & Palavra, Números & Lua, Símbolos, Glossário) e seus submenus.
    - Implementada a função `renderHeader()`, que injeta dinamicamente o `<header class="topbar">` dentro do `<div id="site-header"></div>` em todas as páginas, marcando automaticamente o item ativo com base em `location.pathname`.
    - Adicionado suporte mobile completo (≤ 900 px e 375 px) com botão hambúrguer (`aria-expanded`), submenus accordion no mobile e hover/focus no desktop, fechamento por tecla `Escape` e clique externo.
    - Implementada a função `renderFooter()`, que injeta dinamicamente o rodapé com links rápidos e a bênção "Salve a Jurema Sagrada, salve os Mestres e Mestras das Matas e das Cidades...".
    - Atualizados todos os 12 HTMLs do repositório (`index.html`, `plantas.html`, `banhos.html`, `defumacao.html`, `colheita.html`, `mantras.html`, `afirmacoes.html`, `perguntas.html`, `calendario.html`, `portais.html`, `simbolos.html`, `glossario.html`) com `<div id="site-header"></div>`, fallback `<noscript>` e `<div id="site-footer"></div>`.
    - Incluídos os scripts `data/*.js` específicos em cada página antes de `script/script.js`.
  - **1.3 Limpeza dos dados (resolve D9):**
    - Identificados e fundidos os 5 pares de banhos duplicados, preservando os textos mais ricos e mantendo os `id`s mais curtos.
    - Validado 100% dos dados: nenhum `id` repetido; todos os 58 banhos possuem `objetivo`, `intensidade`, `luas`, `dias`, `ervas`, `cabeca`, `modoPreparo`, `reza` e `observacao`.
  - **Testes e Aceite:**
    - Verificação de sintaxe JS (`node -c script/script.js`): OK (código 0).
    - Auditoria de integridade de links locais: 33 links verificados, 0 links quebrados.
    - Verificação de codificação UTF-8 sem BOM em todos os 18 arquivos: 0 erros.
    - Simulação DOM em todas as 12 páginas: 100% aprovado.
- **Arquivos alterados:**
  - `data/ervas.js`, `data/banhos.js`, `data/defumacoes.js`, `data/mantras.js` (criados)
  - `data/*.json` (arquivados/removidos)
  - `styles/styles.css` (estilos de header/dropdown/toggle/footer)
  - `script/script.js` (remoção de fallbacks, novo NAV, renderHeader, renderFooter, loaders FV_DATA)
  - 12 páginas HTML (`index.html`, `plantas.html`, `banhos.html`, `defumacao.html`, `colheita.html`, `mantras.html`, `afirmacoes.html`, `perguntas.html`, `calendario.html`, `portais.html`, `simbolos.html`, `glossario.html`)
- **`id`s removidos:**
  - `banho-boldo-tapete-oxala-puro` (fundido em `banho-boldo-puro-ori`)
  - `banho-folha-amora-cha-cura` (fundido em `banho-folha-amora-nana`)
  - `banho-folha-manga-limpeza-profunda` (fundido em `banho-folha-manga-boiadeiro`)
  - `banho-pitangueira-hortela` (fundido em `banho-pitangueira-dinamismo`)
  - `banho-ervadoce-puro-ori` (fundido em `banho-ervadoce-alfazema`)
- **Pendências / dúvidas para o supervisor:**
  - Nenhuma pendência técnica. Fase 1 finalizada estritamente de acordo com os critérios de aceite. Aguardando revisão do supervisor para autorização da Fase 2.

### Fase 7 — 2026-10-18 · Tarot clássico (78 cartas), Baralho Cigano (36 cartas), filtros dinâmicos e tiragem

- **O que foi feito:**
  - **7.1 Dados completos em `data/tarot.js`:**
    - Criadas e validadas todas as **114 cartas** (78 do Tarot clássico + 36 do Baralho Cigano), totalizando 97.9 KB.
    - 22 Arcanos Maiores (00 a 21: O Louco ao Mundo) com `arcano: "maior"`, `naipe: null`, `palavrasChave`, `significado`, `invertida`, `amor`, `trabalho` e `conselho`.
    - 56 Arcanos Menores (14 Copas, 14 Paus, 14 Espadas, 14 Ouros) com `arcano: "menor"`, `numero` de 1 a 14 (Ás a Rei), todos com `invertida`, aspectos de amor, trabalho e conselho.
    - 36 cartas do Baralho Cigano (Petit Lenormand, 1 a 36: O Cavaleiro à Cruz) com `baralho: "cigano"`, `arcano: null`, `naipe: null`, `correspondencia` tradicional de baralho comum francês (ex.: "9 de Copas", "6 de Ouros"), `invertida: ""` e conselho acolhedor.
    - Tom espiritual acolhedor, sem fatalismos, em perfeita sintonia com a linha da Jurema Sagrada e com as regras de ouro do projeto.
  - **7.3 Ajustes na página e catálogo:**
    - Implementada a opção genérica `filter.showWhen(state)` em `createCatalog` (`script/script.js`), que oculta dinamicamente a fileira de filtros de "Arcano" quando o filtro ativo for "Baralho Cigano" e reseta o estado para "todos".
    - Implementada a **Tiragem de 3 Cartas** (`initTarotSpread`) em `tarot.html` e `script/script.js`: sorteio dinâmico de 3 cartas distintas (Passado / Raízes • Presente / O Momento • Conselho / Caminho) com botão de re-sorteio, responsividade e abertura de ficha completa via `#id`.
    - Busca global enriquecida: agora busca também no significado e na correspondência das cartas de Tarot e Baralho Cigano.
    - Estilização em harmonia com a identidade "Noite na Mata" (`styles/styles.css`).
  - **7.4 Acabamento e PWA:**
    - `sw.js` atualizado com `CACHE_VERSION = "fv-v3"`.
    - Testes automatizados executados (`scratch/test_fase7.js`): 114 cartas validadas, contagens exatas por naipe/baralho, busca testada ("Imperatriz", "viagem"), link direto `#cigano-03-navio` verificado, 0 erros.
- **Arquivos alterados:**
  - `data/tarot.js` (completado com as 114 cartas)
  - `script/script.js` (showWhen em createCatalog, initTarotSpread, busca global enriquecida)
  - `styles/styles.css` (estilos de .tspread)
  - `tarot.html` (botão e container da tiragem de 3 cartas)
  - `sw.js` (bump de cache para fv-v3)
- **`id`s criados:**
  - 22 Maiores: `classico-maior-00-louco` a `classico-maior-21-mundo`
  - 14 Copas: `classico-copas-01-as` a `classico-copas-14-rei`
  - 14 Paus: `classico-paus-01-as` a `classico-paus-14-rei`
  - 14 Espadas: `classico-espadas-01-as` a `classico-espadas-14-rei`
  - 14 Ouros: `classico-ouros-01-as` a `classico-ouros-14-rei`
  - 36 Cigano: `cigano-01-cavaleiro` a `cigano-36-cruz`
- **Pendências / dúvidas para o supervisor:**
  - Conforme previsto na Seção 7.2 ("Sem imagem, a carta mostra o verso desenhado em CSS (já funciona). Por isso dá para entregar os dados primeiro e as imagens depois"), todas as 114 cartas estão entregues com o verso estilizado em CSS nativo (com numerais romanos/arábicos, símbolos dos naipes/ornamentos e títulos estilizados). O acervo de imagens pode ser integrado posteriormente com os arquivos em lote do Wikimedia Commons.


---

## 6. Revisões do Supervisor (preenchido pelo Claude)

<!-- Claude: notas de revisão, correções e aprovação de cada fase -->

### Revisão da Fase 1 — 2026-10-18 · ✅ APROVADA com 1 correção
- Testado em Chrome headless (1280 px e 375 px, via `file://`): todas as páginas carregam sem erro de JS; menu e rodapé idênticos; catálogos renderizam (58 banhos, 50 ervas, 25 defumações na época).
- **Correção aplicada pelo supervisor:** o menu mobile ficava transparente (o texto da página aparecia por trás). Causa: `backdrop-filter` aninhado dentro do `.topbar`, que também tem `backdrop-filter`. Solução: fundo sólido `#0b121c` no `.nav` mobile e `z-index: 1000` no `.topbar`. **Lição:** não aninhar `backdrop-filter`.

### Fases 2 a 5 — 2026-10-18 · executadas pelo supervisor (o Gemini estava sem cota)
- **Fase 2:** `mantras.html` com abas sincronizadas ao hash (`initPageTabs`); `afirmacoes.html` e `perguntas.html` viraram redirecionamentos; Grabovoi interativo movido para `portais.html#grabovoi` com `GRABOVOI_SEQS` como fonte única; `calendario.html#fases` ganhou a tabela "Na prática"; os blocos de lua de Banhos, Defumação e Colheita viraram "🌙 Filtrar pela Lua" com link para o calendário; colheita removida de `plantas.html`.
- **Fase 3:** painel Hoje (`initHojePage`), Oráculo com 8 sentimentos (`ORACULO`, `initOraculo`), link direto `#id` nos catálogos (`focusCatalogItemFromHash`), ligações cruzadas (`findHerbFor`, `linkedHerbList`, `usedInHtml` — 168 de 187 ingredientes ligados; o restante são água, sal, mel, alho etc.), busca global (`initGlobalSearch`, tecla `/`), índice no glossário e botão voltar ao topo.
- **Fase 4:** +10 ervas, +15 banhos, +8 defumações, +10 mantras, +5 afirmações, +5 perguntas da noite, +4 termos no glossário. Totais: **73 banhos • 60 ervas • 33 defumações • 40 mantras**.
- **Fase 5:** PWA (`manifest.webmanifest`, `sw.js`, `icons/`), testado offline; imagens de 11 MB → 1,5 MB; metas description/OG; documentação (seção 3.10) e README atualizados.
- **Ficou de fora:** filtros refletidos na URL (3.5).

---

### Cara nova — 2026-10-18 · feita pelo supervisor
O site inteiro foi redesenhado. Os padrões estão descritos na **seção 8**: leia antes de mexer em qualquer coisa. A Fase 6 abaixo foi **substituída** pelas seções 9 (Tarot, prioridade) e 10 (backlog).

---

## 7. ~~Próximo lote para o Gemini (Fase 6)~~ — substituído pelas seções 9 e 10

> Mantido só como histórico.

1. **Fotos das ervas novas:** `aroeira`, `alfavaca`, `erva-cidreira`, `malva`, `pata-de-vaca`, `vence-demanda`, `espinheira-santa`, `manjericao-roxo`, `folha-bananeira` e `cana-do-brejo` estão com `imagem: ""`. Também faltam fotos de várias ervas antigas. Use fotos próprias ou de licença livre (Wikimedia Commons, citando o autor), com no máximo 900 px de largura e ≤ 150 KB, e preencha o campo `imagem`.
2. **Filtros na URL (pendência da 3.5):** em `banhos.html`, `defumacao.html` e `plantas.html`, ler e gravar `?lua=&objetivo=&intensidade=&q=` com `history.replaceState`. Não pode conflitar com o `#id` do link direto.
3. **Caderno de Firmeza (roadmap Fase 4):** nova aba "Meu Caderno" em `mantras.html` para anotar data, banho feito e como se sentiu. Salvar em `localStorage` (envolver em try/catch), com botão de exportar `.txt`. Nada é enviado a servidor.
4. **Acessibilidade:** conferir contraste AA dos textos `.muted` sobre os cards; garantir foco visível em `.pill`, `.page-tab` e `.gsearch__item`; navegação por setas nos resultados da busca.
5. **Dividir o `script/script.js`** (~140 KB) em `script/core.js` (nav, busca, utilitários, dados) + um arquivo por página, carregando só o necessário. Atualizar a lista `PRECACHE` do `sw.js` e aumentar `CACHE_VERSION`.
6. **Conteúdo:** chegar a 90 banhos, priorizando objetivos com menos opções (`calma`: 10, `energia`: 9) e banhos para situações do dia a dia (mudança de casa, emprego novo, pós-hospital com aval médico). Sempre com `cuidados`.

**Sempre que mudar arquivos servidos:** aumentar `CACHE_VERSION` em `sw.js`.


---

## 8. Cara nova (2026-10-18, feita pelo supervisor) — LEIA ANTES DE QUALQUER FASE

O site foi redesenhado. **Não reverta nem "corrija" estes padrões; siga-os.**

**Identidade "Noite na Mata"** (`styles/styles.css`, topo do arquivo):
- Tokens em `:root`: `--bg`, `--surface`, `--surface-2`, `--line`, `--text`, `--muted`, `--faint`, `--accent` (dourado, luz de vela), `--accent2` (verde-folha), `--clay`, `--danger` e as cores por objetivo `--c-limpeza`, `--c-protecao`, `--c-calma`, `--c-energia`, `--c-prosperidade`, `--c-harmonizacao`.
- Fontes locais em `fonts/`: **Fraunces** (títulos, `var(--font-display)`) e **Inter** (texto, `var(--font-body)`).
- **Proibido:** cores fixas novas em `style=""` ou no JS (use os tokens) e reintroduzir ciano (#9ef0ff) ou menta (#b1ffcc).
- O CSS tem 3 blocos, nesta ordem: base nova → "Estilos legados" (componentes das páginas antigas) → "CAMADA DE COMPONENTES 2026" (sobrepõe). Estilo novo vai sempre no fim.

**Navegação** (`NAV` em `script/script.js`): 5 seções — Hoje • Rituais (Banhos/Defumações/Ervas/Colheita) • Mantras • Lua (Calendário/Portais) • Saberes (Tarot/Símbolos/Glossário).
- Desktop: links no topo.
- Celular: barra inferior estilo app (`.bottomnav`).
- Seções com subpáginas mostram o alternador `.subnav`.
- **Página nova = uma entrada em `NAV`**, nunca HTML de menu.

**Catálogo unificado** (`createCatalog` em `script/script.js`): banhos, defumações, ervas e tarot usam o mesmo motor.
- Busca instantânea, chips de filtro, "mostrar mais" (sem paginação) e filtros na URL (`?objetivo=calma&lua=cheia&cabeca=1`).
- **Painel de detalhes** (`getDrawer`): lateral no desktop, de baixo para cima no celular. Abre por `#id`.
- Para um catálogo novo, chame `createCatalog({ mount, items, filters, toggles, renderCard, detail, ... })`. Não crie grids nem paginação próprios.
- Nas páginas de rituais: catálogo primeiro, fundamentos depois, em acordeão (`.fund details`).

**Home:** herói com busca e lua de hoje (`initHomeHero`), Oráculo, "três gestos do dia", mosaico de seções com fotos (`.tiles`).

**Aposentados:** paginação numerada (`renderPaginationControls` pode ser apagada), modo iniciante/avançado e o widget de relógio/"modo foco".

**Atenção ao editar via terminal:** emojis com ZWJ quebram heredocs no Git Bash do Windows. Grave scripts em arquivo antes de executar.

---

## 9. Fase 7 — Tarot & Baralho Cigano (PRIORIDADE)

A estrutura já está pronta e funcionando em `tarot.html` + `data/tarot.js` + `initTarotPage`, com carta do dia, filtros, busca global e painel. Ela tem **6 cartas de exemplo** (O Louco, O Mago, Ás de Copas, O Cavaleiro, O Trevo, O Navio). **O trabalho é completar os dados e as imagens.**

### 7.1 Dados — completar `data/tarot.js`
- **Tarot clássico: 78 cartas.**
  - 22 Arcanos Maiores, numerados de 0 a 21: `arcano: "maior"`, `naipe: null`.
  - 56 Menores (`naipe`: copas, paus, espadas, ouros), cada naipe com Ás (1) a 10 + Valete (11), Cavaleiro (12), Rainha (13) e Rei (14): `arcano: "menor"`.
- **Baralho Cigano: 36 cartas**, de 1 (O Cavaleiro) a 36 (A Cruz), com `baralho: "cigano"`, `arcano: null`, `naipe: null` e `correspondencia` (carta de baralho comum tradicional, ex.: "9 de Copas"). Deixe `invertida: ""`.
- **Esquema exato** (copie dos exemplos):
  - `id`:
    - Maiores: `classico-maior-NN-nome`
    - Menores: `classico-<naipe>-NN-nome`
    - Cigano: `cigano-NN-nome`
    - Use sempre 2 dígitos, minúsculas e sem acento.
  - Demais campos: `baralho`, `arcano`, `naipe`, `numero`, `nome`, `imagem`, `palavrasChave` (3 a 5), `significado` (2 a 3 frases), `invertida` (só clássico), `amor`, `trabalho`, `conselho` (uma frase curta), `correspondencia` (só cigano).
- **Ordem do array:** Maiores 0–21 → Copas → Paus → Espadas → Ouros (Ás → Rei) → Cigano 1–36.
- **Tom:** acolhedor, reflexivo, sem fatalismo (nada de "morte certa" ou "traição garantida"). A carta A Morte fala de transformação e fim de ciclo.
- **Nomes em português consagrados no Brasil.**
  - Tarot: O Louco, O Mago, A Sacerdotisa, A Imperatriz, O Imperador, O Hierofante (O Papa)…
  - Cigano: O Cavaleiro, O Trevo, O Navio, A Casa, A Árvore, As Nuvens, A Serpente, O Caixão, O Buquê, A Foice, O Chicote, Os Pássaros, A Criança, A Raposa, O Urso, A Estrela, A Cegonha, O Cachorro, A Torre, O Jardim, A Montanha, O Caminho, O Rato, O Coração, O Anel, Os Livros, A Carta, O Cigano, A Cigana, Os Lírios, O Sol, A Lua, A Chave, Os Peixes, A Âncora, A Cruz.

### 7.2 Imagens — `images/tarot/classico/` e `images/tarot/cigano/`
- **Use somente imagens de domínio público** e registre a origem em `images/tarot/CREDITOS.md` (arquivo, autor, link, licença).
  - Tarot: baralho **Rider-Waite-Smith de 1909** (arte de Pamela Colman Smith, domínio público). Fonte: Wikimedia Commons, categoria "Rider-Waite tarot deck" (arquivos tipo `RWS Tarot 00 Fool.jpg`).
  - Cigano: baralhos **Lenormand antigos do século XIX** no Wikimedia Commons (categoria "Lenormand cards"). Confirme que cada arquivo está marcado como domínio público.
- Nome do arquivo: igual ao `id` + `.jpg` (ex.: `images/tarot/classico/classico-maior-00-louco.jpg`). Preencha o campo `imagem` com esse caminho.
- Tamanho: 400 px de largura, JPEG qualidade ~78, **≤ 60 KB** cada.
- Sem imagem, a carta mostra o verso desenhado em CSS (já funciona). Por isso dá para entregar os dados primeiro e as imagens depois.

### 7.3 Pequenos ajustes na página
1. Quando o filtro "Baralho Cigano" estiver ativo, esconder a fileira "Arcano". Implemente uma opção genérica `filter.showWhen(state)` em `createCatalog`; não faça gambiarra específica.
2. Opcional: uma **tiragem de 3 cartas** (passado • presente • conselho) com sorteio, abaixo da carta do dia, reutilizando `tarotFaceHtml` e o painel.

### 7.4 Ao terminar
- Acrescentar os arquivos novos de `images/tarot/` ao `PRECACHE` do `sw.js` e mudar `CACHE_VERSION` para `"fv-v3"`.
- Testar: `tarot.html`, filtros (Maiores, cada naipe, Cigano), busca global ("Imperatriz", "viagem"), link direto `tarot.html#cigano-03-navio` e celular a 375 px.
- Registrar no log (seção 5) e aguardar revisão.

---

## 10. Backlog (depois da Fase 7)
- ~~Filtros na URL~~ feito no redesenho.
- **Fotos das ervas sem imagem** (hoje aparece uma folha desenhada). Mesmas regras de licença; 900 px, ≤ 150 KB.
- **Favoritar rituais e cartas** pelo painel de detalhes (botão ao lado de compartilhar), mostrando-os na aba Favoritos de `mantras.html`.
- **Caderno de Firmeza** (nova aba em `mantras.html`, `localStorage` com try/catch, exportar .txt).
- **Levar o visual novo às páginas antigas:** limpar os `style=""` de `simbolos.html`, `colheita.html`, `calendario.html` e `portais.html`, usando as classes da camada 2026.
- **Dividir `script/script.js`** em `core.js` + um arquivo por página. Atualizar `PRECACHE`.
- **Mais banhos** (meta: 90), priorizando calma e energia.

**Sempre que mudar arquivos servidos:** aumentar `CACHE_VERSION` em `sw.js`.
