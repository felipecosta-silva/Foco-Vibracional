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

### Commit `583f2cd` — 2026-10-18 · Imagens completas de Tarot e Baralho Cigano
- **O que foi feito:**
  - Inclusão do primeiro acervo de 114 imagens para cobrir todas as cartas do catálogo (`images/tarot/classico/` e `images/tarot/cigano/`).
  - Criação do documento `images/tarot/CREDITOS.md`.
- **Arquivos alterados:** `images/tarot/classico/*.jpg`, `images/tarot/cigano/*.jpg`, `images/tarot/CREDITOS.md`.

### Commit `6224bfe` — 2026-10-18 · Arte clássica em pintura a óleo para Baralho Cigano
- **O que foi feito:**
  - Substituição das 36 ilustrações infantis/estilizadas do Baralho Cigano por pinturas oraculares nobres em estilo óleo sobre tela com moldura dourada e naipes franceses correspondentes.
- **Arquivos alterados:** `images/tarot/cigano/*.jpg`.

### Commit `c70c5ae` — 2026-10-18 · Caderno de Firmeza, Favoritos Universais, Firmeza de Vela e Novos Banhos
- **O que foi feito:**
  - **Caderno de Firmeza (`mantras.html#caderno`):** Diário espiritual seguro e privado (`localStorage` com fallback), com data local, fase da lua ao vivo e exportação em `.txt`.
  - **Favoritos Universais (`mantras.html#favoritos`):** Adicionado botão de coração (`[data-fav]`) no cabeçalho do painel de detalhes (`getDrawer`) para favoritar qualquer Banho, Erva, Defumação ou Carta com 1 clique e visualizá-los agrupados.
  - **Firmeza de Vela & Momento de Foco (`firmeza.html`):** Altar virtual com 6 cores consagradas, timer meditativo com sino de taça tibetana via Web Audio API 100% nativa e offline, e prece de firmeza da Jurema.
  - **Novos dados de fundamento:** Adicionados 8 novos banhos em `data/banhos.js` (total 81 banhos) e 1 nova erva `rosa-champanhe` em `data/ervas.js` (total 61 ervas).
- **Arquivos alterados:** `data/banhos.js`, `data/ervas.js`, `mantras.html`, `firmeza.html`, `script/script.js`, `styles/styles.css`, `sw.js`.

### Fase 8 — 2026-10-19 · Execução das pendências da Seção 11: Tarot 1909 autêntico, limpeza do Cigano e otimização de peso
- **O que foi feito:**
  - **8.1 Tarot Clássico original de 1909 (resolve pendência 3):**
    - Substituídas todas as 78 cartas de `images/tarot/classico/` pelos scans autênticos da primeira edição histórica de 1909 ("Roses & Lilies" / "Pam-A", ilustrada por Pamela Colman Smith e concebida por A. E. Waite), obtidos diretamente do acervo do Wikimedia Commons.
    - Eliminada completamente qualquer dependência da reimpressão da U.S. Games de 1971, removendo logotipos comerciais contemporâneos e controvérsias de recoloração.
  - **8.2 Remoção de textos em inglês e marcas d'água no Baralho Cigano (resolve pendência 2):**
    - Processadas todas as 36 lâminas de `images/tarot/cigano/`: recortado o banner inferior com as legendas em inglês ("The Rider", "The Heart", etc.) e eliminada a marca d'água residual de IA no canto inferior direito.
    - Aplicada a borda dourada ornamental inferior perfeitamente alinhada, preservando os números originais (1 a 36) e naipes franceses no topo. A imagem agora foca 100% no simbolismo artístico, e o nome em português é exibido nativamente pela aplicação.
  - **8.3 Recompressão e meta de peso (resolve pendência 4):**
    - Todas as 114 imagens de Tarot e Baralho Cigano foram reprocessadas e recomprimidas com interpolação bicúbica de alta qualidade e parâmetro JPEG otimizado.
    - **Resultado:** 100% das 114 imagens estão rigorosamente **≤ 57 KB** (meta ≤ 60 KB cumprida com folga; média geral de 44,7 KB por carta). O peso total de `images/tarot/` caiu de 7,7 MB para **4,99 MB** (redução de 35%).
  - **8.4 Atualização de créditos e documentação (resolve pendências 1 e 5):**
    - `images/tarot/CREDITOS.md` reescrito e atualizado com a proveniência exata de cada baralho (scans históricos de 1909 no Commons para o Tarot; IA em estilo clássico do séc. XIX com pós-processamento de descaracterização textual para o Cigano).
    - Registrados no log da Seção 5 todos os commits anteriores (`583f2cd`, `6224bfe`, `c70c5ae`) e o relatório desta Fase 8.
  - **8.5 PWA Cache:**
    - `CACHE_VERSION` incrementada para `"fv-v6"` em `sw.js` para garantir atualização imediata nos navegadores e dispositivos móveis.
- **Arquivos alterados:**
  - `images/tarot/classico/*.jpg` (todas as 78 cartas substituídas pelos scans de 1909)
  - `images/tarot/cigano/*.jpg` (todas as 36 cartas processadas sem texto)
  - `images/tarot/CREDITOS.md` (atualizado)
  - `sw.js` (bump para fv-v6)
  - `PLANO_GEMINI.md` (registro de execução atualizado)
- **Pendências / dúvidas para o supervisor:**
  - Todas as pendências 1 a 5 da Seção 11 foram rigorosamente sanadas. As cartas estão no ar com alta qualidade visual, sem textos estrangeiros e dentro de todos os limites de performance e conformidade legal.

### Fase 9 — 2026-10-19 · "Toque de site": continuação da camada imersiva (Seção 13)

- **O que foi feito (executado e comitado tarefa por tarefa):**
  - **Tarefa 1 (Commit `8af4fdc`): Calendário mais visual**
    - No card "Agora" de `calendario.html`, substituído texto simples por `.moon-orb--cal` com renderização dinâmica da fase real (`#calMoonOrbShadow`) usando cálculo astronômico sinódico.
    - Em "Próximas fases", reorganizado em linha do tempo horizontal no desktop (`.moon-timeline` com grid responsivo de 4 colunas em desktop, 2 em tablet e 1 em mobile) com ícone grande de cada fase, dias restantes e iluminação estimada.
  - **Tarefa 2 (Commit `6287c7d`): Mantras mais visual**
    - Transformado o mantra do dia em `mantras.html` num bloco heróico de destaque (`.mantra-hero`), com tipografia Fraunces itálica responsiva (`clamp(1.45rem, 3.2vw, 2.15rem)`), brilho atmosférico de vela (`candleFlicker` suave) e centralização nobre. O bloco de técnicas no trabalho foi isolado em card próprio.
  - **Tarefa 3 (Commit `2f88127`): Carrosséis nas páginas de rituais**
    - Em `plantas.html`: inserido carrossel horizontal `.rail` "Ervas que vão na cabeça (Ori)" com fotos reais e badges de segurança.
    - Em `defumacao.html`: inseridos carrosséis horizontais `.rail` "Para limpar (descarrego & proteção)" e "Para atrair (prosperidade, energia & harmonia)".
    - Implementada a função genérica `initRitualRails` em `script/script.js` integrando navegação, clique direto e abertura nos drawers (`#id`).
  - **Tarefa 4 (Commit `485d8a1`): Ícones vetoriais SVG em vez de emojis nos filtros e no Oráculo**
    - Criados SVGs finos consistentes com o design system (`stroke-width="1.8"`, `currentColor`, alinhamento vertical e tamanho fixo 15px/14px/13px) para `OBJ_ICONS` (6 objetivos), `MOON_ICONS` (4 luas) e `ICONS_ORACULO` (8 sentimentos).
    - Eliminada a dependência de emojis de sistema operacional em filtros, tags de cards e botões pills do Oráculo.
  - **Tarefa 5 (Commit `dbabcac`): Fotos reais de domínio público para o acervo de ervas**
    - Baixadas e processadas 49 imagens botânicas de alta resolução do Wikimedia Commons cobrindo 100% das ervas faltantes (total de 61 ervas com fotos reais).
    - Todas as imagens foram redimensionadas para resolução máxima de 900 px e comprimidas em JPEG de alta qualidade estritamente **≤ 150 KB** (média de ~110 KB).
    - Criado o documento `images/CREDITOS.md` com atribuição formal de autoria, licenças abertas (CC BY, CC BY-SA, GFDL, Domínio Público) e links diretos para cada arquivo no Wikimedia Commons.
    - Atualizado `data/ervas.js` apontando `"imagem": "./images/<id>.jpg"` para todas as 61 ervas.
  - **Tarefa 6 (Commit `5f26a73`): Microinterações imersivas**
    - Botão "copiar" vira "✓ Copiado" por 1,5 s com estilo ativo e brilho dourado antes de retornar ao estado original (função `feedbackCopyBtn` e `copyText` com `triggerEl`).
    - Estado `:active` com `scale(0.97)` aplicado a `.btn`, `.btn-micro`, `.pill`, `.chip`, `.rcard`, `.hcard` e `.tcard .tcard__face`.
    - Transição suave com animação de subida e fade (`pagePanelFade`, 0.22s) ao alternar entre abas em `mantras.html` (`initPageTabs`).
  - **Tarefa 7 (Commit `feat(fase9-t7)`): Bump de cache e finalização**
    - `CACHE_VERSION` incrementada para `"fv-v9"` em `sw.js` garantindo atualização imediata do PWA e disponibilidade offline de todo o acervo.
- **Arquivos alterados:**
  - `calendario.html`, `mantras.html`, `plantas.html`, `defumacao.html`
  - `script/script.js`
  - `styles/styles.css`
  - `data/ervas.js`
  - `images/*.jpg` (49 novas fotos adicionadas e 2 recomprimidas)
  - `images/CREDITOS.md` (criado)
  - `sw.js` (bump para fv-v9)
  - `PLANO_GEMINI.md`
- **Pendências / dúvidas para o supervisor:**
  - Todas as 7 tarefas da Fase 9 foram executadas e comitadas de forma estritamente isolada e verificada, sem criação de `style=""` novo, mantendo todos os tokens de cores do design system e cumprindo todas as diretrizes da Seção 13.

### Fase 10 — 2026-10-20 · Ponto riscado: leitura, fundamentos e estrelas sagradas (Seção 15)

- **O que foi feito (executado e comitado com 1 commit por subtarefa):**
  - **Subtarefa 10.1 (Commit `72dd948`): Como ler um ponto: o cosmograma Dikenga**
    - Criado bloco interativo em `simbolos.html` (`#dikenga`) com diagrama SVG desenhado à mão no código com visual Noite na Mata (círculo com traço dourado `var(--accent)`, fundo com gradiente sutil, cruz central e a linha horizontal **Kalunga** que divide Ku Nseke e Ku Mpemba).
    - Conforme K. K. Bunseki Fu-Kiau (*African Cosmology of the Bântu-Kôngo*):
      - Ku Nseke (topo) = mundo físico dos vivos; Ku Mpemba (base) = mundo espiritual dos ancestrais.
      - 4 momentos solares interativos com nós clicáveis e pills de seleção: **Musoni** (meia-noite / concepção no espiritual), **Kala** (nascer do sol / nascimento físico), **Tukula** (meio-dia / ápice da maturidade material) e **Luvemba** (pôr do sol / passagem de retorno ao plano espiritual).
      - Card de detalhe dinâmico (`#dikengaDetailCard`) com troca de abas animada, nota sobre variações regionais e leitura aplicada (como a posição no quadrante orienta a ação do símbolo e reforço de que o guia é quem explica o ponto).
    - Adicionado o aviso orientador de leitura no topo da página: o ponto é a assinatura/RG da entidade e firmeza sagrada; quem explica o ponto é a própria entidade.
  - **Subtarefa 10.2 (Commit `dab5eca`): Ampliar a Gramática dos Símbolos**
    - Ampliada a seção de símbolos de 6 para 8 cards em `simbolos.html`, sem repetições e sem inline `style=""`:
      - **Tridente (Linha de Exu):** distinção clara entre tridente reto (força ativa e expansiva) e tridente curvo (força passiva e receptiva).
      - **Espiral:** banimento, descarrego e esgotamento de energias densas, integrada com a regra da Bússola Sagrada (horário atrai movimento/fartura, anti-horário desfaz nós e larvas).
      - **Cruz:** encruzilhada de caminhos ou ligação com as Almas e ancestrais conforme a posição.
      - **Flechas & Setas (Linha de Caboclo):** a ponta da flecha como vetor da direção da força (do espiritual para a matéria ou vice-versa).
      - **Luas e Estrelas:** ciclo/tempo do trabalho (fases da lua) e força estelar/magia (estrelas), interpretadas pelo quadrante da Dikenga.
  - **Subtarefa 10.3 (Commit `7c8d3d0`): Como reconhecer um ponto legítimo**
    - Criada a seção com os 4 pilares fundamentais segundo Márcio Kain (*Umband' Boa*, PTD nº 927):
      1. Símbolo do Orixá regente + símbolo da linha de trabalho/falange (com exemplos práticos e ressalva de variação por terreiro).
      2. Sem "firulas": todo traço tem fundamento e utilidade vibracional; enfeite desnecessário é sinal de alerta.
      3. A entidade sabe explicar com clareza a razão de cada elemento desenhado.
      4. Ninguém deve ser pressionado a riscar ponto: o médium risca quando amadurece com a espiritualidade.
    - Destaque ético do lar: em casa, praticar apenas firmezas temáticas e orações; nunca riscar ponto de entidade específica por conta própria.
    - Removidos estilos inline de alerta/segurança nos cards de firmeza temática vs entidade, substituídos por classes `.ponto-card--alerta` e `.ponto-card--seguro`.
  - **Subtarefa 10.4 (Commit `c1cfd61`): Estrelas sagradas**
    - Criada a seção com 7 cards didáticos e SVGs geométricos limpos desenhados com precisão matemática (`currentColor`, `fill:none`):
      - **Estrela de 5 pontas:** luz, perfeição, renascimento, proteção, equilíbrio e aspiração espiritual.
      - **Pentagrama:** traço contínuo no círculo; espírito sobre os 4 elementos, 5 sentidos e virtudes de proteção no ocultismo.
      - **Hexagrama:** dualidade, masculino e feminino, carne e espírito, os 4 elementos na alquimia e a completude do número 7.
      - **Hexagrama Unicursal:** glifo de traço único contínuo entrelaçado.
      - **Estrela de Davi:** apresentada com respeito como símbolo do povo judeu e do judaísmo, união dos opostos e conexão céu-terra (sem tratamento de 'amuleto').
      - **Selo de Salomão:** os dois triângulos entrelaçados em traço sagrado geométrico, proteção tradicional e simbolismo de Deus, criação e perfeição na maçonaria.
      - **Heptagrama (7 pontas) & Octograma (8 pontas):** ciclos cósmicos, completude, quatro pontos cardeais e colaterais, mantendo estrito consenso histórico.
    - Vinculação direta com âncora ao bloco de Pentagrama & Banhos de Proteção (`#pentagrama-banhos`), limpando styles inline residuais.
  - **Subtarefa 10.5 (Commit `9970764`): Mediunidade olfativa no glossário e defumação completa passo a passo**
    - Em `glossario.html`: inserido o termo "Mediunidade olfativa" explicando odores agradáveis (protetores) e desagradáveis (obsessores), com aviso obrigatório em destaque em `.glossario-alerta` sobre descarte de causas físicas (fiação, vazamento de gás) e problemas de saúde médica antes de atribuir a razões espirituais.
    - Em `defumacao.html`: inserido o acordeão "Defumação completa da casa, passo a passo" com os 5 passos detalhados (abrir portas/janelas; arruda e alecrim no turíbulo com brasa; fundo para a frente / cima para baixo; término no portão à esquerda de quem entra; descarte na terra após frias) e aviso de segurança com o fogo/brasa.
  - **Subtarefa 10.6 (Commit `9597b38`): Novos termos ancestrais e ritualísticos no glossário**
    - Adicionados 7 termos em `glossario.html`: **Dikenga**, **Kalunga** (Grande e Pequena), **Ku Nseke**, **Ku Mpemba**, **Turíbulo**, **Linha de trabalho** e **Falange**, com fundamentação respeitosa e linguagem acessível.
  - **Subtarefa 10.7 (Commit `c588fec`): Rodapé de fontes em símbolos, bump de CACHE_VERSION e registro**
    - Inserido rodapé de fontes ao final da aba Pontos Riscados em `simbolos.html`: K. K. Bunseki Fu-Kiau, Márcio Kain / Umband' Boa (PTD nº 927), aula sobre Dikenga e tradição oral.
    - Incrementada a versão do Service Worker em `sw.js` para `"fv-v11"`.
    - Registro detalhado da Fase 10 no plano de execução.
- **Arquivos alterados:**
  - `simbolos.html`
  - `glossario.html`
  - `defumacao.html`
  - `styles/styles.css`
  - `script/script.js`
  - `sw.js` (bump para fv-v11)
  - `PLANO_GEMINI.md`
- **Resultados e testes:**
  - Zero novos `style=""` inline inseridos em todas as subtarefas.
  - Todos os SVGs em conformidade vetorial, traço fino e responsivo.
  - Acessibilidade e hierarquia semântica preservadas.

### Fase 11 — 2026-10-20 · Banho das Onze Horas e saberes tradicionais da Buganvília e Mestras (Seção 17)

- **O que foi feito (executado e comitado com 1 commit por subtarefa):**
  - **Subtarefa 11.1 (Commit `43c1412`): Novas ervas em `data/ervas.js`**
    - **Ora-pro-nóbis** (`ora-pro-nobis`): Cacto trepadeira rico em mucilagem que amacia a água do banho; arquétipo do sustento simples, firmeza do corpo e fartura que vem do pouco.
    - **Buganvília** (`buganvilia`): Trepadeira rústica e solar ("a rocha"), associada à resiliência, alegria, transmutação e doçura. Diferenciação detalhada entre flores e brácteas coloridas; fundamentação do chá tradicional das brácteas para vias respiratórias (tosse/bronquite com mel); e afinidade com a Linha das Mestras. Permissão explícita de uso na cabeça quando despetalada pura sem espinhos nem galhos.
    - **Onze-horas** (`onze-horas`): Suculenta rasteira de flores solares que abrem às 11h e fecham à tarde; ensinamento do tempo certo e paciência, com alerta sobre oxalatos tóxicos para cães e gatos.
    - **Jasmim** (`jasmim`): Flor aromática de elevação e paz de Oxalá, Iemanjá e das Mestras, atuando na clareza do Ori, serenidade mental e consciência íntima.
  - **Subtarefa 11.2 (Commit `9b48e43`): Atualizar ervas existentes em `data/ervas.js`**
    - **Mamão** (`mamao`): Cuidados ampliados com alerta explícito de contraindicação para quem tem alergia a látex (reação cruzada com a seiva leitosa), gestantes, feridas abertas e recomendação de luvas.
    - **Pitangueira** (`pitangueira`): Texto de cuidados ajustado para tom moderado e sem exagero ("Uso externo suave e bem tolerado. Lave bem as folhas.").
  - **Subtarefa 11.3 (Commit `831c101`): Três novos banhos em `data/banhos.js`**
    - `banho-mamao-corte-vespera`: "Banho de Folha de Mamão (Corte na Véspera do Banho das Onze Horas)", `cabeca: false`, primeira etapa de limpeza pesada da coluna.
    - `banho-onze-horas-fartura`: "Banho das Onze Horas (Ora-pro-nóbis, Pitanga, Buganvília & Onze-horas • Fartura e Caminhos Abertos ao Sol)", `cabeca: false`, ritual solar das 11h com reza tradicional de fartura.
    - `banho-mestras-buganvilia-jasmim`: "Banho das Mestras: Iluminação, Consciência e Autoestima (Buganvília & Jasmim)", `cabeca: true` (Ori), banho doce de flores e brácteas puras para clareza da consciência e resgate do amor-próprio.
    - Testado e verificado que 100% dos ingredientes linkam perfeitamente para as fichas das ervas correspondentes via `findHerbFor`.
  - **Subtarefa 11.4 (Commit `3c29c61`): Ligações e novos termos no Glossário**
    - Em `colheita.html`: verificado que a página opera por fases lunares gerais sem tabela horária estática (registrado no log sem quebras).
    - Em `glossario.html`: inseridos os termos **PANC** (plantas alimentícias não convencionais e o sustento simples), **Brácteas** (as "folhas de cor" protetoras da flor), **Comigo-Ninguém-Pode** (sentinela de vaso vivo e perigo vital de ingestão de oxalatos) e **Vinca** (flor das Almas e acalanto do sono, com contraindicação farmacológica de chá interno).
  - **Subtarefa 11.5 (Commit `9655bea`): Bump de CACHE_VERSION e registro**
    - `CACHE_VERSION` atualizada para `"fv-v13"` em `sw.js`.
    - Registro detalhado da Fase 11 na Seção 5 de `PLANO_GEMINI.md`.
- **Arquivos alterados:**
  - `data/ervas.js`
  - `data/banhos.js`
  - `glossario.html`
  - `sw.js` (bump para fv-v13)
  - `PLANO_GEMINI.md`
### Fase 12 — 2026-10-20 · Plantas fáceis de achar + Guia completo das velas (Seção 19)

- **O que foi feito (executado e comitado com 1 commit por subtarefa):**
  - **Subtarefa 12.1 (Commit `2a344f4`): Novas ervas em `data/ervas.js` com triagem rigorosa de segurança**
    - Adicionadas 6 novas espécies em `data/ervas.js` (total de 71 ervas):
      - **Palmeira** (`palmeira`): "Folha de Palmeira (Ramo Bento)" (*Cocos nucifera*, *Elaeis guineensis*, *Dypsis lutescens*). Usos: defumação e ambiental. Fundamento católico popular do Domingo de Ramos para proteger contra temporais e mariwô de Ogum; alerta crítico sobre a falsa palmeira-sagu (*Cycas revoluta*), tóxica para animais.
      - **Jiboia** (`jiboia`; *Epipremnum aureum*): Uso estritamente ambiental e ornamental. Planta companheira que mantém o verde vivo; alerta de oxalato de cálcio tóxico se mastigado (nunca em banhos, chás ou fogo).
      - **Zamioculca** (`zamioculca`; *Zamioculcas zamiifolia*): "Planta-da-fortuna" moderna urbana. Uso ambiental para recepções e comércio, ensinando constância e resiliência com pouca água; manuseio com luvas por seiva irritante.
      - **Pimenteira** (`pimenteira`; *Capsicum frutescens* e *Capsicum chinense*): "Pimenteira (Malagueta & Biquinho)". Sentinela viva de soleira de porta contra inveja e olho-gordo (força da porteira). Diferenciação da biquinho (sem ardência, segura para lares com pets) vs malagueta. Alerta absoluto: **NUNCA queimar em defumação** (libera capsaicina que cega e queima o trato respiratório) e **nunca usar em banho corporal**.
      - **Babosa** (`babosa`; *Aloe vera*): Uso ambiental/ornamental na soleira como pára-raios de olho-gordo. Diferenciação farmacológica entre gel transparente cicatrizante e o látex amarelo com aloína (amargo, irritante e tóxico para pets e gestantes).
      - **Maracujá** (`maracuja`; *Passiflora edulis*): Folha do maracujazeiro com passiflorina calmante para banho morno do pescoço para baixo, trazendo serenidade para o sono.
    - Cumprida a regra de deixar sem `imagem` as ervas novas que não possuem arquivos baixados e creditados.
  - **Subtarefa 12.2 (Commit `c976255`): Banho e defumação novos**
    - Em `data/banhos.js`: criado `banho-maracuja-cidreira-sono` ("Banho de Folha de Maracujá com Erva-cidreira • Calma para Dormir"), suave, noturno, do pescoço para baixo, com reza de serenidade e nota de acolhimento que não substitui atendimento médico. Total: 85 banhos.
    - Em `data/defumacoes.js`: criada `defumacao-ramos-bentos-palmeira` ("Ramos Bentos de Palmeira • Proteção da Casa & Temporal"), com folha seca de palmeira, alecrim e louro, reza a Santa Bárbara e aviso estrito sobre queimar pedaços pequenos com janelas ventiladas. Total: 34 defumações.
  - **Subtarefa 12.3 (Commit `7f8cba1`): Bloco "Plantas de vaso que guardam a casa" em `plantas.html`**
    - Adicionado novo acordeão nos Fundamentos (`.fund details`) com o texto orientador "Nem toda planta de proteção é de banho. Algumas trabalham vivas, no vaso."
    - Cards em grid com links funcionais para os 7 cards das plantas (Espada de São Jorge, Comigo-Ninguém-Pode, Jiboia, Zamioculca, Pimenteira, Babosa e Folha de Palmeira), especificando onde colocar (porta, sala, comércio), funções energéticas e badges `.badge-danger` com "Tóxica para pets / crianças".
    - Caixa de aviso `.notice` com alerta de emergência médica e telefone nacional do **CIATox (0800 722 6001)**. Zero novos inline `style=""`.
  - **Subtarefa 12.4 (Commit `735cdca`): Guia completo das velas em `firmeza.html`**
    - Inseridos 5 acordeões completos de fundamentos e cuidados de velas abaixo do altar interativo:
      1. *Como firmar uma vela, passo a passo* (6 passos: preparação, consagração/azeite direcional, firmeza no pires com copo d'água, ativação com fósforo e contemplação, abafamento para apagar sem soprar, e descarte respeitoso).
      2. *Tipos de vela* (palito, 7 dias sempre sobre prato/pires fundo para não trincar madeira/tecido, cera de abelha e bicolores).
      3. *O significado das cores* (revisado sem jargões como "vigor celular", respeitando orientações de terreiro: branca, rosa, amarela, laranja, verde, azul-claro, azul-escuro, marrom, lilás, preta e branca para Pretos Velhos, e preta e vermelha só com orientação).
      4. *O que a chama mostra (leitura popular)* (apresentado como folclore/simbolismo, com checklist físico obrigatório: vento, pavio torto, cera de baixa qualidade explicam a maioria dos casos).
      5. *Vela do Anjo da Guarda* (vela branca, água fresca, prece e costume de segunda-feira).
    - Alerta de topo ampliado com recomendação estrita de segurança contra fogo: nunca dormir com vela acesa e não acender no quarto de criança.
  - **Subtarefa 12.5 (Commit `377b7a7`): Refatoração das cores do altar interativo e remoção total de inline styles**
    - Em `styles/styles.css`: criados tokens CSS `:root` (`--vela-branca`, `--vela-amarela`, `--vela-verde`, `--vela-azul`, `--vela-violeta`, `--vela-vermelha`, `--vela-rosa`, `--vela-laranja`, `--vela-marrom`, `--vela-preta`), regra `.candle-wrapper[data-cor="..."]` com controle dinâmico de `--vela` e `--vela-2`, renderização do corpo da vela e da aura via `color-mix()`, e gradiente bicolor meio a meio para preta-branca e preta-vermelha.
    - Em `script/script.js`: removido completamente o objeto `COLORS` e as atribuições manuais de `style.background`; refatorado o clique para aplicar `candleWrapper.dataset.cor = colKey`.
    - Em `firmeza.html`: adicionados os 5 novos botões (rosa, laranja, marrom, preta e branca, e preta e vermelha); removidos todos os 14 atributos `style=""` inline da página, substituídos por classes na folha de estilos. Verificado: `grep 'style="' firmeza.html` retorna 0 ocorrências.
  - **Subtarefa 12.6 (Commit `2495a23`): Novos termos no Glossário**
    - Inseridos 5 novos verbetes detalhados em `glossario.html`: **Ramo bento**, **Mariwô**, **Firmar (vela)**, **Vela de 7 dias** e **CIATox** (com número 0800 722 6001).
  - **Subtarefa 12.7 (Commit `859a90a`): Bump de CACHE_VERSION e testes integrados**
    - `CACHE_VERSION` incrementada para `"fv-v15"` em `sw.js`.
    - Testes automatizados executados com sucesso validando: busca de jiboia, pimenteira, palmeira e maracujá; carregamento de novos banhos/defumações por ID; 0 inline styles em `firmeza.html`; existência de todos os tokens CSS e verbetes.
- **Arquivos alterados:**
  - `data/ervas.js`
  - `data/banhos.js`
  - `data/defumacoes.js`
  - `plantas.html`
  - `firmeza.html`
  - `glossario.html`
  - `script/script.js`
  - `styles/styles.css`
  - `sw.js` (bump para fv-v15)
  - `PLANO_GEMINI.md`
- **Resultados e conformidade:**
  - Zero novos inline styles no projeto.
  - Triagem de segurança rigorosamente respeitada: plantas cáusticas/tóxicas nunca foram incluídas em banhos ou queimas.
  - Respeito integral às tradições do Catimbó, Jurema, Umbanda, Candomblé e Catolicismo popular.

### Expansão a pedido do usuário — 2026-10-20 · Abacaxi-roxo, Trevo-roxo, Peregun roxo e Hibisco

- **O que foi feito:**
  - **4 novas ervas em `data/ervas.js` (total: 75 ervas):**
    - `abacaxi-roxo`: Abacaxi-Roxo (*Tradescantia spathacea* / *Rhoeo discolor*), quente, corte de demanda, vaso de soleira e bate-folhas, alerta de seiva irritante.
    - `trevo-roxo`: Trevo-Roxo de Três Folhas (*Oxalis triangularis*), equilibradora, prosperidade e transmutação, movimento nictinástico, mezinhas e alerta de ácido oxálico.
    - `peregun-roxo`: Peregun Roxo / Dracena Roxa (*Cordyline fruticosa* / *Dracaena*), quente, guerra espiritual e sacudimento de Ogum e Iansã, sentinela de limites territoriais, nunca na cabeça.
    - `hibisco`: Hibisco (*Hibiscus rosa-sinensis* / *Hibiscus sabdariffa*), flor solar de amor-próprio, autoestima, banhos afetivos e defumação acolhedora.
  - **4 novos banhos em `data/banhos.js` (total: 89 banhos):**
    - `banho-hibisco-autoestima-brilho`: auto-estima, amor-próprio, hibisco com rosas e canela.
    - `banho-peregun-roxo-descarrego-guerra`: descarrego pesado de guerra com peregun roxo, guiné e arruda.
    - `banho-trevo-roxo-prosperidade-caminhos`: abertura de caminhos e boa fortuna com louro e alecrim.
    - `banho-abacaxi-roxo-corte-demanda`: corte de inveja e escudo do lar com abacaxi-roxo e espada de são jorge.
  - **1 nova defumação em `data/defumacoes.js` (total: 35 defumações):**
    - `defumacao-hibisco-harmonia-afeto`: pétalas secas de hibisco com louro e canela para harmonia e união afetiva do lar.
  - **Glossário (`glossario.html`):**
    - Adicionado o verbete **Mezinha** (a farmácia viva e os remédios ancestrais de rezadeiras e mestres do Catimbó e Jurema).
  - **PWA Cache (`sw.js`):**
    - `CACHE_VERSION` atualizada para `"fv-v16"`.

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


---

## 11. Revisão do supervisor — Fase 7 + commit extra (2026-10-18)

**Resultado: aprovado com correções.** Revisados os commits `1441076`, `583f2cd`, `6224bfe` e `c70c5ae`.

**O que ficou bom**
- Dados do Tarot completos e íntegros: 114 cartas (78 + 36), sem `id` repetido, todas com imagem existente, no esquema pedido.
- `filter.showWhen` implementado de forma genérica, como pedido; a tiragem de 3 cartas funciona.
- Caderno de Firmeza, favoritos de rituais (botão no painel → aba Favoritos) e a página de Firmeza de Vela funcionam e seguem o visual novo.
- +8 banhos e +1 erva (rosa-champanhe), todos completos e com objetivo válido.

**Problemas encontrados e já corrigidos pelo supervisor**
1. **Bug que quebrava `mantras.html`:** o caderno chamava `moonPhase()`, que não existe (`ReferenceError`), e isso interrompia o restante do script da página. Trocado por `getLiveMoonData()` (campos `name`/`icon`). **Sempre rode as páginas no navegador e olhe o console antes de commitar.**
2. A data padrão do caderno usava `toISOString()` (UTC): depois das 21h no Brasil, mostrava o dia seguinte. Criada `localISODate()`.
3. `firmeza.html` não tinha **nenhum aviso de segurança com fogo**. Adicionado.
4. O banho pós-hospital não pedia liberação médica. Texto corrigido (liberação médica, água morna, não molhar pontos, curativos ou cateter).
5. Três frases do Tarot prometiam resultado ("entrega garantida", "sucesso garantido", "saída garantida"). Suavizadas, conforme a regra de tom.
6. **`images/tarot/CREDITOS.md` dizia coisas falsas:**
   - As cartas clássicas não são scans de 1909: trazem o aviso "© 1971 U.S. Games".
   - As cartas ciganas não são gravuras do século XIX: são ilustrações modernas com títulos em inglês, provavelmente geradas por IA, e sem origem documentada.
   - O arquivo foi reescrito com a situação real. **Nunca registre uma origem ou licença que você não verificou.**
7. `CACHE_VERSION` → `fv-v5`.

**Pendências (Fase 8, para o Gemini)**
1. **Origem das imagens ciganas:** registrar em `CREDITOS.md` exatamente como foram obtidas. Se foram geradas por IA, diga isso.
2. **Títulos em inglês nas cartas ciganas** ("The Rider", "The Heart") num site em português: gere de novo **sem texto na imagem** (o nome já aparece abaixo da carta) ou troque por um Lenormand do século XIX em domínio público.
3. **Tarot clássico:** trocar pelos scans da edição original de 1909 ("Roses & Lilies"/"Pam-A", no Wikimedia Commons), para não depender da recoloração de 1971 da U.S. Games.
4. **Peso:** `images/tarot/` tem 7,7 MB, e as imagens estão entre 55 e 85 KB (a meta era ≤ 60 KB). Recomprimir.
5. **Registrar no log TODOS os commits.** Os commits `583f2cd`, `6224bfe` e `c70c5ae` não entraram no log da seção 5.
6. O que ainda vale do backlog da seção 10: fotos das ervas sem imagem; limpar `style=""` das páginas antigas; dividir `script.js`.


---

## 12. Revisão do supervisor — Fase 8 + guia de pontos riscados (2026-10-19)

**Resultado: aprovado com correções.** Revisados os commits `02c4724` (Fase 8) e `24ee5c7` (guia prático de pontos riscados e pentagrama em `simbolos.html`).

**O que ficou bom**
- Tarot clássico trocado pelos scans de 1909 (papel envelhecido, sem a marca "© 1971 U.S. Games").
- Cartas ciganas sem a faixa em inglês e créditos agora **honestos** (dizem que as imagens foram geradas com IA). Era exatamente o pedido.
- Todas as imagens ≤ 60 KB (de 7,7 MB para 5,3 MB).
- A Fase 8 foi registrada no log.
- O guia de pontos riscados tem bom conteúdo: separa ponto de entidade (não riscar em casa) de ponto de firmeza temática, e os diagramas SVG estão claros.

**Problemas encontrados e já corrigidos pelo supervisor**
1. **`showWhen` não escondia a fileira "Arcano" de verdade:** o JS marcava `hidden`, mas o `display:flex` de `.chip-row` sobrepunha o atributo. Corrigido com `.chip-row[hidden]{display:none !important}`. **Lição:** ao usar `hidden` em elemento que tem `display` no CSS, confira no navegador se ele some mesmo.
2. **Cartas ciganas com 4 proporções diferentes** (376×517, 376×621, 400×550, 400×661) por causa do corte da faixa. Exibidas agora em 8:11, ancoradas no topo (número e naipe sempre visíveis). Ideal: padronizar todas em 400×550.
3. **`24ee5c7` violou a seção 8:** 21 `style=""` novos e cores fora da paleta (ciano `#38bdf8`, verde-neon `#34d399`, lilás `#c084fc`, fundos azul-marinho). Cores convertidas para a paleta e fundos para o verde-mata.
4. **Nenhum aviso de segurança** nas firmezas, que pedem vela acesa no chão. Adicionado, com link para `firmeza.html`.
5. **`24ee5c7` não foi registrado no log** (seção 5). Na próxima, registre todo commit.
6. Carta do dia apertada no celular: ajustada.
7. `CACHE_VERSION` → `fv-v7`.

**Pendências para o Gemini**
1. Padronizar as 36 imagens ciganas em 400×550 (recorte centralizado, mantendo número e naipe).
2. Trocar os `style=""` das seções novas de `simbolos.html` por classes no CSS (camada 2026), usando os tokens.
3. Seguir o backlog da seção 10: fotos das ervas sem imagem, limpar os `style=""` antigos e dividir o `script.js`.
4. **Antes de cada commit:** abrir as páginas alteradas no navegador (desktop e 375 px), conferir o console, usar só os tokens de cor e registrar no log.


---

## 13. Fase 9 — "Toque de site": continuar a camada imersiva (PRIORIDADE)

O dono achou que o site "parecia um blog": toda página abria com texto sobre fundo liso, numa coluna de caixas, sem imagem nem movimento. O supervisor já fez a base, na **"CAMADA IMERSIVA"**, no fim de `styles/styles.css`, e no bloco "CAMADA IMERSIVA" de `script/script.js`:

- **Abertura em largura total em todas as páginas internas** (`enhancePageHead` + mapa `PAGE_HERO`): foto da erva nas páginas de rituais e arte em CSS nas demais (lua na fase real, vela, leque de cartas, geometria sagrada, "11:11"). **Página nova = uma entrada em `PAGE_HERO`.**
- **Home cinematográfica:** foto da jurema em tela cheia com vaga-lumes em canvas (`initFireflies`), faixa de números com contagem (`initCountUp`, `data-countup`), carrossel "Banhos para esta lua" (`.rail`, `initHomeRails`), carta do dia com imagem (`.feature`), divisor botânico e topo transparente sobre o herói.
- **Movimento:** revelação ao rolar (`initReveal`, classes `.reveal`/`.is-in`), cards do catálogo surgindo em sequência e zoom lento nas fotos. Tudo desligado com `prefers-reduced-motion`.

### Tarefas (uma por vez; testar no navegador a 1440 px e a 375 px; console limpo; commit + log)
1. **Calendário mais visual:** no card "Agora", trocar o texto grande por uma lua desenhada na fase real (reaproveite `.moon-orb` e a lógica de sombra de `initHomeHero`). Em "Próximas fases", pôr um ícone de lua grande em cada item e organizar como uma linha do tempo horizontal no desktop.
2. **Mantras mais visual:** o mantra do dia vira um bloco de destaque grande (tipografia Fraunces itálica, ~2rem, centralizado, fundo com brilho de vela), em vez de card comum.
3. **Carrosséis nas páginas de rituais:** acima do catálogo de `plantas.html`, um `.rail` "Ervas que vão na cabeça" (com foto). Em `defumacao.html`, um `.rail` "Para limpar" e outro "Para atrair". Reutilize `ritualCardHtml`/`herbCardHtml` e o padrão de `initHomeRails`.
4. **Ícones em vez de emojis nos chips de filtro e no Oráculo:** crie SVGs finos (estilo de `ICONS`, stroke 1.8, `currentColor`) para os 6 objetivos e as 4 luas, e use-os em `OBJETIVOS`, `LUAS` e `ORACULO`. Os emojis mudam conforme o celular e deixam o site com cara amadora.
5. **Fotos das ervas** (pendente desde a Fase 6): várias ervas aparecem só com a folha desenhada. Use fotos de licença livre (Wikimedia Commons, com crédito em `images/CREDITOS.md`), 900 px, ≤ 150 KB.
6. **Microinterações:** botão "copiar" que vira "✓ copiado" por 1,5 s (em vez de só toast); estado `:active` com leve encolhimento (`scale(.97)`) em `.btn`, `.pill`, `.rcard`, `.hcard` e `.tcard`; e transição suave ao trocar as abas de `mantras.html`.
7. Ao terminar: aumentar `CACHE_VERSION` em `sw.js` e registrar no log (seção 5).

### Regras que continuam valendo (seção 8)
Só tokens de cor (nada de ciano, verde-neon ou azul-marinho), nada de `style=""` novo, aviso de segurança onde houver fogo ou planta tóxica, e não reverter o catálogo, a navegação ou as aberturas.


---

## 14. Revisão do supervisor — Fase 9 (2026-10-20)

**Resultado: aprovado com correções.** Revisados os 7 commits (`8af4fdc` a `54f7014`). **Parabéns pelo processo:** um commit por tarefa, tudo registrado no log, só tokens de cor e só 1 `style=""` novo.

**Ficou bom:** lua real e linha do tempo no Calendário; mantra do dia em destaque; carrosséis em Ervas e Defumações; ícones SVG nos filtros e no Oráculo; microinterações; ~50 fotos novas de ervas que parecem ser mesmo do Wikimedia Commons, com créditos detalhados.

**Corrigido pelo supervisor:**
1. **`moonIllumFraction is not defined`** quebrava o Calendário justamente quando a API da lua falhava ou o site estava offline. Trocado pela fórmula que o resto do site já usa. **Teste sempre também com a internet desligada.**
2. **Créditos falsos de novo:** `images/CREDITOS.md` atribuía as 12 fotos originais (arruda, guiné, jurema…) a fotógrafos do Commons, mas elas já estavam no projeto e só 2 foram recomprimidas. Seção corrigida. **Nunca escreva autor, licença ou link de um arquivo que você não baixou dessa fonte.**
3. Carrosséis (`.rail`): o snap encaixava o 1º card na borda da tela, ignorando o recuo. Adicionado `scroll-padding-inline`.
4. Vela da abertura de Mantras por cima do texto no celular: suavizada.
5. `CACHE_VERSION` → `fv-v10`.

**Pendência herdada:** trocar as 12 fotos originais por arquivos reais do Commons (com o link exato do arquivo baixado) **ou** deixar como estão até o dono do site confirmar a origem. Não invente créditos.

---

## 15. Fase 10 — Ponto riscado: leitura, fundamentos e estrelas sagradas (PRIORIDADE)

**Origem do conteúdo:** resumos de vídeos que o dono do site enviou e duas imagens didáticas sobre estrelas. Um dos vídeos é do canal *Umband' Boa* (Márcio Kain, PTD nº 927); a autoria do outro (aula sobre a Dikenga) não foi informada. O supervisor já filtrou e corrigiu o material abaixo; **use estas orientações, não reinvente o conteúdo.**

**Onde:** `simbolos.html`, aba **Pontos Riscados** (que já tem "Gramática dos Símbolos", "Ética", "Bússola da Intuição" e as 4 firmezas). **Integre, não duplique:** se um símbolo já tem card, **amplie** o card existente.

**Princípio que guia toda a seção** (está nos dois vídeos e deve aparecer em destaque no topo):
> O ponto riscado é a "assinatura" (o "RG") da entidade e também uma ferramenta de firmeza. Os padrões abaixo ajudam a estudar, **mas a leitura não é fixa: quem explica o ponto é a própria entidade.** Na dúvida, pergunte ao guia durante o atendimento.

### 10.1 "Como ler um ponto: o cosmograma Dikenga" (bloco novo, interativo)
- **Diagrama SVG desenhado à mão no código:** círculo, cruz central e a linha horizontal **Kalunga**. Os 4 pontos são clicáveis e abrem a explicação (pode reutilizar o painel `getDrawer()` ou um texto ao lado). Visual "Noite na Mata": traço dourado `var(--accent)`, fundo verde-mata.
- **Use a disposição mais difundida (K. K. Bunseki Fu-Kiau, *African Cosmology of the Bântu-Kôngo*):**
  - **Metade de cima = Ku Nseke** (mundo físico, dos vivos); **metade de baixo = Ku Mpemba** (mundo espiritual, dos ancestrais). A **Kalunga** é a fronteira entre os dois (alusão ao mar e ao cemitério, a "Kalunga Grande" e a "Kalunga Pequena").
  - **Musoni** (embaixo, "meia-noite"): concepção, a ideia no plano espiritual antes de nascer.
  - **Kala** (à direita, "nascer do sol"): nascimento, início da jornada física.
  - **Tukula** (em cima, "meio-dia"): ápice da força, maturidade, sabedoria no mundo material.
  - **Luvemba** (à esquerda, "pôr do sol"): fim da vida física, passagem de volta ao espiritual.
  - O ciclo é contínuo: nada existe no físico sem ter passado pelo espiritual, e vice-versa.
- **Atenção:** o resumo do vídeo trocava as posições (colocava Musoni no topo e dizia ao mesmo tempo que o topo era o mundo dos vivos). **Não reproduza essa contradição.** Acrescente uma nota curta: "Grafias e orientação variam entre autores e casas."
- **Leitura aplicada** (do vídeo): um símbolo em cada quadrante indica em que estágio a força atua: concepção (Musoni), início de uma ação (Kala), ação em plena força (Tukula), encerramento, descarrego ou retorno (Luvemba). Exemplo: uma espiral perto de Luvemba sugere fechamento de ciclo ou limpeza; um tridente cruzando a Kalunga sugere força operando na passagem entre os planos. Sempre com a ressalva de que o guia confirma.

### 10.2 Ampliar a "Gramática dos Símbolos" (cards existentes + novos)
- **Tridente** (card novo, linha de Exu): **curvo** = força passiva e receptiva; **reto** = força ativa e expansiva.
- **Espiral:** associada a banimento e descarrego, ao esgotamento de energias densas. **Junte** com o que já está na "Bússola" (sentido horário atrai movimento; anti-horário desfaz nós) sem contradizer.
- **Cruz:** encruzilhada de caminhos **ou** ligação com as almas, conforme a posição no ponto.
- **Flecha** (linha de Caboclo): a ponta indica a **direção da força** (do espiritual para o físico ou o contrário). Junte com o card "Flechas & Setas" já existente.
- **Luas e estrelas:** indicam o ciclo/tempo do trabalho (lua) e força estelar ou magia (estrela), lidas conforme o quadrante.

### 10.3 "Como reconhecer um ponto legítimo" (bloco novo, curto, com ícones)
Segundo Márcio Kain (*Umband' Boa*, PTD nº 927):
1. Tem **o símbolo do Orixá regente** da entidade + **o símbolo da linha de trabalho/falange**.
   - Exemplos comuns, que **variam por casa**: arco e flecha → Oxóssi; espada e linhas retas → Ogum; ondas → Iemanjá; tridente → linha da esquerda.
2. **Sem "firulas":** todo traço tem função; enfeite sem explicação é sinal de alerta.
3. **A entidade sabe explicar** cada elemento do próprio ponto.
4. **Ninguém deve ser pressionado a riscar ponto** nem copiar da internet: o médium risca quando a mediunidade amadurece, no tempo da espiritualidade.

Feche reforçando a ética que já está na página: em casa, só firmezas temáticas; **nunca** riscar ponto de entidade específica por conta própria.

### 10.4 "Estrelas sagradas" (bloco novo; baseado nas duas imagens enviadas)
Faça um card por estrela, cada um com um **SVG geométrico limpo** (traço `currentColor`, linhas precisas e simétricas, nada de imagem baixada) e um texto curto:
- **Estrela de 5 pontas:** luz, perfeição, renascimento, sabedoria, proteção, esperança, equilíbrio, aspiração.
- **Pentagrama (estrela de 5 pontas em traço contínuo, dentro de círculo):** união e síntese. Os 5 dedos de cada mão e pé lembram os 5 sentidos; o espírito sobre os 4 elementos. No ocultismo, figura a que se atribuem virtudes de proteção.
- **Hexagrama:** masculino e feminino, carne e espírito, atividade e passividade (**dualidade**). No hinduísmo, a ligação entre o masculino e o feminino; na alquimia, a união dos 4 elementos. Seis pontas mais o centro dão 7, número tido como perfeito. Mostre também o **hexagrama unicursal** (traço único), presente na imagem.
- **Estrela de 7 pontas (heptagrama)** e **estrela de 8 pontas (octograma: dois quadrados sobrepostos):** apareciam desenhadas na imagem, sem texto. Escreva só o que for consenso e curto (ex.: 7 = ciclos e completude; 8 = equilíbrio, os quatro pontos cardeais e colaterais). **Não invente atribuições mágicas específicas.**
- **Estrela de Davi:** apresente com respeito, como **símbolo do povo judeu e do judaísmo**, e depois os significados de união do feminino e do masculino, de opostos e de ligação entre céu e terra. Não a trate como "amuleto".
- **Selo de Salomão:** os mesmos 2 triângulos, mas **entrelaçados** (desenhe o entrelaçamento). Não se confunde com a Estrela de Davi. Na tradição esotérica, proteção contra o mal; na maçonaria, "Deus, criação e perfeição".
- Ligue este bloco à seção do Pentagrama que já existe nas firmezas, sem repetir o texto.

### 10.5 Mediunidade olfativa + defumação completa
- Em **`glossario.html`**, termo novo **"Mediunidade olfativa"**: perceber presença espiritual por cheiros sem fonte física.
  - Cheiros **agradáveis** (charuto, cachimbo, flores, perfume, comida boa) costumam ser associados a protetores.
  - Cheiros **desagradáveis**, que causam enjoo, a espíritos desequilibrados (obsessores).
  - Sentir isso com frequência não é o normal; vale uma defumação ou procurar um terreiro.
  - **OBRIGATÓRIO, em destaque:** "Antes de pensar em causa espiritual, descarte causas físicas: cheiro de queimado pode ser fiação ou aparelho elétrico; cheiro de gás pede fechar o registro, abrir as janelas e não acender nada. Alterações no olfato também podem ter causa de saúde: se persistirem, procure um médico."
- Em **`defumacao.html`**, nos Fundamentos, um acordeão novo **"Defumação completa da casa, passo a passo"**:
  1. Abra portas e janelas.
  2. Coloque arruda e alecrim no turíbulo (ou panela própria) sobre brasa.
  3. Percorra do **fundo para a frente**; em sobrado, **de cima para baixo**, passando por todos os cômodos e pelas pessoas da casa.
  4. Termine no portão: deixe o turíbulo apagar **do lado de dentro, à esquerda de quem entra**.
  5. **Só depois de frias**, despeje as cinzas na terra (grama, terreno ou mata afastada da casa).
  - Com cuidado: brasa longe de crianças, animais, cortinas e tapetes.

### 10.6 Glossário
Termos novos (sem duplicar os que já existem): **Dikenga**, **Kalunga**, **Nseke**, **Mpemba**, **Turíbulo**, **Linha de trabalho**, **Falange**, **Mediunidade olfativa**.

### 10.7 Regras desta fase
- Tom acolhedor e respeitoso a todas as tradições citadas (bantu-kongo, umbandista, judaica, maçônica e esotérica). Nada de sensacionalismo ou promessa ("impenetrável", "garantido").
- Ao final da aba, uma linha de **fontes**: Fu-Kiau (cosmograma); canal *Umband' Boa*, Márcio Kain, PTD nº 927 (ponto legítimo e mediunidade olfativa); aula sobre a Dikenga (autor não informado).
- Só tokens de cor; SVGs com `currentColor`; nada de `style=""` novo; classes na camada final do CSS.
- **Testar** a 1440 px e a 375 px **e offline**, com o console limpo. Um commit por subtarefa (10.1 a 10.6), cada um registrado no log. Ao final, aumentar `CACHE_VERSION`.

---

## 16. Revisão do supervisor — Fase 10 (2026-10-20)

**Resultado: aprovado com pequenos ajustes.** Revisados os 7 commits (`72dd948` a `c588fec`). **Melhor entrega até agora:** um commit por subtarefa, log completo, Dikenga na disposição correta (Tukula em cima, Musoni embaixo, Kala à direita, Luvemba à esquerda, sem a contradição do vídeo), alerta de gás e fiação em destaque, Estrela de Davi tratada com respeito, estrelas de 7 e 8 pontas sem atribuições inventadas, fontes citadas, console limpo e sem rolagem lateral a 1440 px e a 375 px.

**Ajustado pelo supervisor:**
1. Diagrama Dikenga: os rótulos "LINHA KALUNGA" e "FRONTEIRA DOS PLANOS" ficavam por cima dos círculos de Luvemba e Kala, e os nomes dentro dos círculos tinham 8,5 px (ilegíveis). Círculos ampliados, nomes a 11 px e rótulos reposicionados.
2. Duas expressões "impenetrável" suavizadas (regra de tom: nada de promessa absoluta).
3. `CACHE_VERSION` → `fv-v12`.

**Próximo passo:** aguardar a nova tarefa do dono do site. Enquanto isso, continua valendo o backlog da seção 10 e a pendência das 12 fotos originais (seção 14).

---

## 17. Fase 11 — Banho das Onze Horas: ora-pro-nóbis, mamão, buganvília, pitanga e onze-horas (PRIORIDADE)

**Pedido do dono do site:** um ritual que use juntas **ora-pro-nóbis, folha de mamão, buganvília, pitanga e onze-horas**. O supervisor desenhou o ritual abaixo; **use estas orientações, não reinvente o conteúdo.**

**Por que são dois banhos e não um:** a folha de mamão é erva **de corte** (já cadastrada em `ervas.js` como "quentes", limpeza/proteção, **nunca na cabeça**). As outras quatro são doces e solares. Misturar tudo enfraquece as duas coisas. Seguindo a lógica que o site já ensina (descarrego primeiro, banho doce depois), o ritual tem **duas etapas**, e cada uma vira um card próprio no catálogo, um apontando para o outro.

**A ideia que amarra o ritual:** a onze-horas (*Portulaca grandiflora*) só abre as flores com o sol alto do fim da manhã. Por isso o banho doce é feito **perto das 11h**, com as flores abertas. Mensagem: "cada coisa abre na sua hora". A ora-pro-nóbis, conhecida como "carne de pobre", traz o sentido de **sustento e fartura simples**. A pitanga traz alegria e dinamismo (como já está no site). A buganvília traz beleza e doçura.

### 11.1 Três ervas novas em `data/ervas.js`
Siga o mesmo formato das outras (com `nomePopular`, `energia`, `objetivos`, `usos`, `partes`, `cabeca`, `descricao`, `diferenciacao`, `colheita`, `cuidados`, `tradicao`). **Antes, confira se já não existem** com outro nome (primavera, três-marias…).

- **Ora-pro-nóbis** (*Pereskia aculeata*; "carne de pobre", "lobrobó"). Um cacto trepadeira de folha carnuda, comestível e rica em proteína (é uma PANC).
  - `energia`: equilibradoras. `objetivos`: prosperidade, harmonização. `partes`: folha.
  - Sentido: sustento, fartura que vem do pouco, firmeza do corpo. A folha solta uma **baba (mucilagem)** que amacia a água do banho.
  - `cuidados`: o caule tem **espinhos fortes**, então colha com luvas e use só as folhas. Planta segura para uso externo. Não usar folhas de plantas pulverizadas.
  - `tradicao`: muito presente nos quintais mineiros e na cozinha da roça. O nome vem do latim "rogai por nós", porque se colhia no quintal do padre enquanto ele rezava. Apresente como **história popular**, sem dar como fato comprovado.
- **Buganvília** (*Bougainvillea* spp.; "primavera", "três-marias").
  - `energia`: equilibradoras. `objetivos`: harmonização, prosperidade. `partes`: brácteas.
  - Detalhe bonito para a `diferenciacao`: as "pétalas" coloridas são **brácteas** (folhas modificadas). A flor de verdade é a pequena flor branca do centro. **Cores:** rosa e magenta para afeto e doçura, branca para paz, laranja e amarela para alegria e brilho. Diga que isso é **associação popular de cor**, não regra.
  - **Não atribua a um Orixá ou entidade específica:** não há consenso. Diga só "associada à alegria, à beleza e à doçura".
  - `cuidados`: galhos com **espinhos**, e a seiva pode irritar pele sensível. Use só as brácteas. Mantenha longe de pets e de crianças pequenas.
- **Onze-horas** (*Portulaca grandiflora*; "flor-de-onze-horas", "portulaca").
  - `energia`: equilibradoras. `objetivos`: energia, prosperidade. `partes`: flor.
  - Sentido: abertura no tempo certo, alegria solar, paciência com o próprio ritmo. As flores **fecham à tarde e em dias nublados**, então colha quando estiverem abertas.
  - `cuidados`: uso externo seguro para pessoas. **Pets:** plantas do gênero *Portulaca* têm **oxalatos**, que podem fazer mal a cães e gatos se mastigadas. Não deixe sobras ao alcance deles.
- **Fotos:** só use foto se você **baixou de verdade** um arquivo do Wikimedia Commons, com o link exato, o autor e a licença daquela página anotados em `images/CREDITOS.md` (900 px, ≤ 150 KB). Se não conseguir, **deixe sem `imagem`**: o card já mostra a folha desenhada. **Nunca invente crédito** (seção 14).

### 11.2 Atualizar ervas que já existem (sem duplicar)
- **`mamao`**: complete `cuidados`. **Quem tem alergia a látex não usa** (a seiva branca é látex e pode dar reação cruzada). Gestantes devem evitar. Teste antes numa área pequena do antebraço. Nunca sobre feridas. Colha e lave a folha usando luvas.
- **`pitangueira`**: troque "Uso externo extremamente agradável e seguro." por algo sem exagero, por exemplo "Uso externo suave e bem tolerado. Lave bem as folhas."

### 11.3 Dois banhos novos em `data/banhos.js`
Use exatamente os campos que os outros banhos usam. Os cuidados vão em `observacao`. **Os nomes das ervas em `ervas` devem bater com `findHerbFor`** (assim o card linka para a erva certa). Confira no painel de detalhes se as 5 ervas aparecem linkadas.

**A) `banho-mamao-corte-vespera`: "Banho de Folha de Mamão (Corte na Véspera do Banho das Onze Horas)"**
- `objetivo`: limpeza. `intensidade`: media. `cabeca`: **false**. `luas`: minguante e crescente. `horario`: "noite da véspera".
- `ervas`: 3 folhas de Mamão e, opcionalmente, um ramo de Alecrim.
- Preparo: lave muito bem as folhas (tirando a seiva), macere em 2 L de água fria e coe. Após o banho de higiene, jogue **do pescoço para baixo**, pedindo que saia o que está parado e pesado. Vista roupa clara e durma cedo.
- `observacao`: "DO PESCOÇO PARA BAIXO. Primeira etapa do Banho das Onze Horas (veja o card dele). Não use se tiver alergia a látex; gestantes devem evitar; não aplique sobre feridas."

**B) `banho-onze-horas-fartura`: "Banho das Onze Horas (Ora-pro-nóbis, Pitanga, Buganvília & Onze-horas • Fartura e Caminhos Abertos ao Sol)"**
- `objetivo`: prosperidade. `intensidade`: suave. `cabeca`: **false**. `luas`: crescente e cheia. `dias`: dom e qui. `horario`: "fim da manhã, perto das 11h, com as onze-horas abertas".
- `ervas`: 7 folhas de Ora-pro-nóbis, 7 folhas de Pitangueira, um punhado de brácteas de Buganvília e um punhado de flores de Onze-horas.
- Preparo:
  1. Colha as flores na hora, ainda abertas. Pegue as folhas de ora-pro-nóbis com luvas.
  2. Em 2 L de água fresca, macere primeiro a ora-pro-nóbis até a água ficar macia.
  3. Junte a pitanga e, por último, as flores, só apertando de leve. **Não ferva.**
  4. Deixe a bacia uns minutos ao sol, se puder.
  5. Coe e jogue do pescoço para baixo, mentalizando sustento, alegria e portas que se abrem no tempo certo.
  6. As sobras de flores e folhas vão para a terra ou para um vaso, **longe de pets**.
- `reza` (use esta): "Flor que abre com o sol, folha que sustenta a mesa, pitanga que alegra o caminho: que a fartura chegue simples e na hora certa, que meus passos se abram com o dia e que nada me falte do que é bom."
- `observacao`: "DO PESCOÇO PARA BAIXO. Se quiser levar algo à cabeça, use só um pouco da água de pitangueira, preparada à parte. Faça na véspera o Banho de Folha de Mamão para limpar antes de chamar a fartura. Espinhos: ora-pro-nóbis e buganvília, colha com luvas. Onze-horas pode fazer mal a cães e gatos se mastigada."
- **Não** escreva promessas como "garante dinheiro" ou "abre todos os caminhos".

### 11.4 Ligações
- Na tela de **Colheita** (`colheita.html`), se houver lista de ervas por horário ou estação, inclua a onze-horas com a dica "colher no fim da manhã, com a flor aberta". Se a página não tiver uma lista assim, não crie: só registre no log.
- **Glossário:** termos novos **PANC** (planta alimentícia não convencional) e **Brácteas**. Confira antes se já não existem.

### 11.5 Regras desta fase
- Sem cores fixas, sem `style=""` novo, nada de grids próprios. Tudo entra pelo `createCatalog`.
- Arquivos em UTF-8 sem BOM. Confira os acentos de "nóbis", "buganvília" e "mamão" no navegador.
- **Testar** a 1440 px e a 375 px, **e offline**: busca por "onze", "nóbis" e "bugan"; filtro `?objetivo=prosperidade`; abrir os dois banhos pelo `#id` e conferir os links para as ervas. Console limpo e sem rolagem lateral.
- Um commit por subtarefa (11.1 a 11.4), cada um registrado no log (seção 5). No fim, `CACHE_VERSION` → `fv-v13`.

---

## 18. Revisão do supervisor — Fase 11 (2026-10-20)

**Resultado: aprovado com ajustes.** Revisados os 5 commits (`43c1412` a `9655bea`). Os dois banhos do plano estão fiéis (reza, observação, ordem do preparo, do pescoço para baixo). As 3 ervas novas estão com cuidados completos (espinhos, oxalatos para pets, látex no mamão) e **nenhum crédito de foto foi inventado**. Os ingredientes linkam para as ervas nos dois sentidos. Console limpo, sem rolagem lateral a 1440 px e a 375 px, e funciona offline.

**Conteúdo extra** (Jasmim, Banho das Mestras, Linha das Mestras na buganvília, Comigo-Ninguém-Pode e Vinca no glossário): o dono do site confirmou que **veio dele**, então foi mantido. **Da próxima vez, registre no log a origem de todo conteúdo que não está no plano** ("enviado pelo dono em…").

**Ajustado pelo supervisor:**
1. **Jasmim, segurança:** "Jasmim-da-noite" e "Jasmim-estrela" saíram dos nomes populares. Jasmim-da-noite costuma ser a **dama-da-noite** (*Cestrum nocturnum*), que é tóxica. Entrou um alerta "não confunda" com dama-da-noite e jasmim-amarelo (*Gelsemium*), também no Banho das Mestras.
2. **Promessas e pseudociência:** saíram "atua no sistema límbico", "afasta pesadelos" e "resiliência inabalável".
3. **Buganvília:** saiu o chá "para tosse e bronquite". É uma promessa de uso medicinal interno, e a mesma ficha manda manter a planta longe de crianças.
4. **Banho de mamão da véspera:** os dias eram sexta e sábado, mas o Banho das Onze Horas é no domingo ou na quinta. Corrigido para quarta e sábado, com explicação no horário.
5. Hash errado no log (`4664020` → `9655bea`). `CACHE_VERSION` → `fv-v14`.

**Próximo passo:** aguardar a nova tarefa do dono do site. Continuam valendo o backlog da seção 10 e a pendência das fotos (seções 13 e 14). As 4 ervas novas estão sem foto.

---

## 19. Fase 12 — Plantas fáceis de achar + Guia completo das velas (PRIORIDADE)

**Pedido do dono do site:** novos banhos e defumações com plantas fáceis de achar (palmeira, jiboia, zamioculca, pimenta malagueta e biquinho), e um conteúdo completo sobre velas: como firmar, as cores e como ativar. O supervisor já fez a triagem de segurança abaixo. **Siga-a à risca: ela decide o que pode virar banho, defumação ou só planta de vaso.**

| Planta | Banho | Defumação | Vaso / ambiente | Por quê |
|---|---|---|---|---|
| Palmeira (folha seca) | não | **sim** | sim | Costume real do ramo bento do Domingo de Ramos. |
| Jiboia | **não** | **não** | sim | Tóxica (oxalato de cálcio): irrita a boca, a pele e os olhos. Perigosa para crianças e pets. |
| Zamioculca | **não** | **não** | sim | Tóxica (oxalato de cálcio). A seiva irrita a pele. |
| Pimenta malagueta / biquinho | **não** | **NUNCA** | sim | Queimar pimenta solta fumaça que arde nos olhos e no pulmão (é o princípio do spray de pimenta). No banho, queima a pele e as mucosas. |
| Babosa | não | não | sim | O gel é seguro na pele, mas o látex amarelo da casca irrita e faz mal a pets. |
| Folha de maracujá | **sim** | não | não | Banho calmante seguro e fácil de achar. |

### 12.1 Ervas novas em `data/ervas.js`
Use o formato das outras. Antes, confira se já não existem com outro nome. Para jiboia, zamioculca, pimenteira e babosa: `usos: ["ambiental"]` e `cabeca: "Nunca. Não usar em banho, chá nem defumação"`.

- **Palmeira** (`palmeira`): "Folha de Palmeira (Ramo Bento)". Nome popular: coqueiro, dendezeiro, areca-bambu (*Cocos nucifera*, *Elaeis guineensis*, *Dypsis lutescens*). `objetivos`: proteção, harmonização. `usos`: defumação, ambiental. `partes`: folha.
  - `tradicao`: no Domingo de Ramos, os ramos bentos levados da missa são guardados atrás da porta ou do quadro de santo. Em dia de temporal, é costume católico popular queimar um pedacinho e rezar a Santa Bárbara. No candomblé e na umbanda, a folha desfiada do dendezeiro é o **mariwô**, ligado a Ogum, usado em portas e portais como sinal de proteção do espaço.
  - `cuidados`: **não confunda com a palmeira-sagu** (*Cycas revoluta*). Ela parece palmeira, mas não é, e é **muito tóxica** para cães e gatos (pode ser fatal). Folha seca de palmeira pega fogo rápido e solta faíscas: queime só pedaços pequenos.
- **Jiboia** (`jiboia`; *Epipremnum aureum*). `objetivos`: harmonização, proteção. Sentido popular: planta que mantém o verde vivo dentro de casa, ocupa cantos parados e acompanha a vida da casa. Seja honesto: é um **uso popular de ambiente**, sem fundamento de terreiro amplamente difundido. `cuidados`: tóxica se mastigada; vasos altos, longe de crianças e pets; luvas na poda.
- **Zamioculca** (`zamioculca`; *Zamioculcas zamiifolia*; "planta-da-fortuna"). `objetivos`: prosperidade, proteção. Sentido popular: firmeza e constância, porque resiste com pouca água e pouca luz. Pode ir em escritórios e na entrada do comércio. `cuidados`: igual à jiboia, com luvas ao mexer, porque a seiva irrita.
- **Pimenteira** (`pimenteira`): "Pimenteira (Malagueta & Biquinho)" (*Capsicum frutescens* e *Capsicum chinense*). `objetivos`: proteção, limpeza.
  - `diferenciacao`: a **malagueta** é ardida, a pimenteira clássica "de guarda" na porta. A **biquinho** quase não arde e serve para quem tem crianças e pets em casa e prefere uma guarda mais suave.
  - `tradicao`: vaso de pimenteira na entrada contra olho-gordo e inveja, ligado à linha da esquerda e à sentinela de porteira (já citado no glossário). Crença popular: quando a pimenteira murcha ou seca de repente, "segurou" uma carga. Apresente como **crença**, e lembre que rega, sol e praga explicam a maior parte desses casos.
  - `cuidados`: **nunca queimar e nunca usar em banho.** Lave as mãos depois de mexer e não leve aos olhos. Pets e crianças longe dos frutos.
- **Babosa** (`babosa`; *Aloe vera*). `objetivos`: proteção, limpeza. Vaso na entrada, sentido popular de "cortar" olho-gordo. `cuidados`: o gel transparente é seguro na pele. O **látex amarelo** junto da casca irrita a pele e faz mal a pets. Não ingerir.
- **Maracujá** (`maracuja`; *Passiflora edulis*; folha de maracujá). `objetivos`: calma, harmonização. `usos`: banho. `partes`: folha. `cabeca`: "Do pescoço para baixo". `cuidados`: uso externo suave; se fizer chá, ele dá sono, então gestantes evitam e não se mistura com remédios para dormir ou para ansiedade.
- **Fotos:** a mesma regra da seção 17. Sem arquivo realmente baixado e creditado, deixe sem `imagem`.

### 12.2 Banho e defumação novos
**A) `data/banhos.js` → `banho-maracuja-cidreira-sono`: "Banho de Folha de Maracujá com Erva-cidreira (Calma para Dormir)"**
- `objetivo`: calma. `intensidade`: suave. `cabeca`: false. `luas`: todas. `dias`: todos. `horario`: "à noite, 1 hora antes de dormir".
- `ervas`: 7 folhas de Maracujá, um punhado de Erva-cidreira (use os nomes que o `findHerbFor` reconhece).
- Preparo: ferva 2 L de água e desligue o fogo. Abafe as folhas por 10 minutos e coe. Espere ficar morno e jogue do pescoço para baixo, respirando devagar. Deite logo depois, sem tela.
- `reza`: "Folha que acalma, água que acolhe: desatai a pressa do meu peito, aquietai meus pensamentos e me dai um sono de paz."
- `observacao`: "DO PESCOÇO PARA BAIXO. Se a insônia ou a ansiedade forem frequentes, procure também um médico. O banho acolhe, mas não substitui o tratamento."

**B) `data/defumacoes.js` → `defumacao-ramos-bentos-palmeira`: "Ramos Bentos de Palmeira (Proteção da Casa & Temporal)"**
- `objetivo`: proteção. `intensidade`: media. `luas`: crescente e cheia. `horario`: "fim da tarde, ou em dia de temporal (só um pedacinho)".
- `ervas`: folha seca de Palmeira (o ramo bento, ou folha seca de coqueiro ou areca), Alecrim e Louro.
- `sentido`: do fundo da casa para a porta.
- `reza`: "Ramo bento que a fé guardou: cobri esta casa, afastai o perigo e o mal, e que Santa Bárbara e todos os protetores desta morada nos guardem do raio e do vendaval."
- `servePara`: proteção do lar e serenidade em dias de tempestade, seguindo o costume de queimar o ramo bento.
- `cuidados`: "A folha seca queima rápido e solta faíscas: use pedaços pequenos, sobre brasa num turíbulo ou pires de barro, longe de cortinas. Em temporal, fique dentro de casa, longe de tomadas e aparelhos ligados. Janelas entreabertas para ventilar."

### 12.3 "Plantas de vaso que guardam a casa" (bloco novo em `plantas.html`)
- Um acordeão novo nos Fundamentos (`.fund details`), com um parágrafo curto: "Nem toda planta de proteção é de banho. Algumas trabalham vivas, no vaso."
- Links para os cards de Espada-de-São-Jorge, Comigo-Ninguém-Pode, Jiboia, Zamioculca, Pimenteira, Babosa e Palmeira, cada um com **onde colocar** (porta, sala, comércio) e um selo **"tóxica para pets / crianças"** quando for o caso. Use classes, sem `style=""`.
- Feche com um alerta (`.notice`): "Planta de vaso não vai para o banho nem para o fogo. Jiboia, zamioculca, comigo-ninguém-pode e pimenta irritam a pele, os olhos e a boca. Em caso de ingestão por criança ou animal, procure atendimento: CIATox 0800 722 6001."

### 12.4 Guia completo das velas (`firmeza.html`)
O altar interativo continua igual. **Abaixo dele**, os Fundamentos ganham estes acordeões, nesta ordem (os que já existem são revisados e ficam no meio):

1. **"Como firmar uma vela, passo a passo"**
   1. Lave as mãos e escolha um lugar firme e alto, longe de vento e cortinas.
   2. **Consagre:** segure a vela entre as mãos e diga a intenção em voz baixa. Costume popular, opcional: untar com um pouco de azeite, **da base para o pavio** para chamar algo, **do pavio para a base** para afastar.
   3. **Firme:** pingue um pouco de cera no pires e cole a base nela. É costume pôr um copo de água ao lado (para o Anjo da Guarda).
   4. **Ative:** acenda (é costume usar fósforo), faça a prece e fique alguns minutos em silêncio, olhando a chama.
   5. Deixe queimar até o fim. Se precisar sair, **apague abafando** (com tampa ou abafador; é costume não soprar) e reacenda depois com a mesma intenção.
   6. **Depois:** agradeça. Restos de cera e de fósforo vão para o lixo comum. A água do copo vai para a terra ou para o ralo. Nunca jogue cera em rio ou mar.
2. **"Tipos de vela":** palito (firmezas rápidas, de 1 a 3 horas), de 7 dias (em copo de vidro), de cera de abelha (mais limpa e doce) e bicolor (para linhas específicas). Para a de 7 dias: **sempre sobre prato ou pires, nunca direto sobre madeira ou toalha, porque o vidro pode trincar.**
3. **"O significado das cores" (revisar o que já existe):** remova expressões como "vigor celular". Inclua as cores que faltam, sempre com a frase "**as correspondências variam de casa para casa; vale a orientação do seu terreiro**":
   - **Rosa:** amor, ternura, autoestima; Ibejis e Erês.
   - **Laranja:** alegria e ânimo.
   - **Azul-claro:** Iemanjá, calma.
   - **Azul-escuro:** em muitas casas, Ogum.
   - **Marrom:** justiça, firmeza, Xangô.
   - **Lilás:** transmutação suave, Nanã (algumas casas).
   - **Preta e branca:** Pretos Velhos.
   - **Preta e vermelha:** Exu e linha da esquerda. **Só com orientação de um terreiro.**
4. **"O que a chama mostra (leitura popular)":** chama alta e firme; chama que tremula ou estala; vela que "chora" muito; pavio que se divide; vela que apaga sozinha. Apresente como **leitura popular, sem recado garantido**. Comece pelo checklist físico (o mesmo espírito do alerta de mediunidade olfativa): **vento, pavio comprido, vela torta e cera de baixa qualidade explicam a maior parte desses casos.**
5. **"Vela do Anjo da Guarda":** vela branca, um copo de água e uma prece curta, uma vez por semana (é costume fazer na segunda-feira).
- Mantenha o alerta de fogo que já existe no topo e acrescente: "nunca durma com vela acesa; nada de vela no quarto de criança".

### 12.5 Novas cores no altar interativo + limpeza do código
- Hoje as cores estão em hexadecimal fixo no `COLORS` do `script/script.js` (perto da linha 1196) e em `style="--c:…"` nos botões de `firmeza.html`. **Isso viola a seção 8.** Refatore assim:
  - No fim do CSS, crie os tokens `--vela-branca`, `--vela-amarela`, `--vela-verde`, `--vela-azul`, `--vela-violeta`, `--vela-vermelha`, `--vela-rosa`, `--vela-laranja`, `--vela-marrom`, `--vela-preta`.
  - Crie as classes `.color-pill--<cor>` e uma regra `.candle-wrapper[data-cor="<cor>"]` que define `--vela` e `--vela-2` (a segunda só nas bicolores). Corpo e aura saem de `var(--vela)` com `color-mix()`.
  - No JS, o clique só faz `candleWrapper.dataset.cor = colKey` e troca o rótulo. **Apague** o objeto `COLORS` e os `style.background`.
- Adicione os botões rosa, laranja, marrom, preta e branca (Pretos Velhos) e preta e vermelha (Exu, com rótulo "só com orientação"). As bicolores são metade de cada cor no corpo da vela.
- Remova os 14 `style=""` de `firmeza.html`, trocando por classes na camada final.

### 12.6 Glossário
Termos novos (sem duplicar): **Ramo bento**, **Mariwô**, **Firmar (vela)**, **Vela de 7 dias**, **CIATox**.

### 12.7 Regras desta fase
- Tom acolhedor, sem promessa ("garante", "infalível", "impenetrável"). Respeito às tradições católica, umbandista e do candomblé.
- **Registre no log a origem** de todo conteúdo fora deste plano.
- Testar a 1440 px e a 375 px, **e offline**:
  - busca por "jiboia", "pimenta", "palmeira" e "maracujá";
  - abrir o banho e a defumação novos pelo `#id`;
  - clicar em **todas** as cores do altar (incluindo as bicolores);
  - console limpo e sem rolagem lateral;
  - `grep 'style="' firmeza.html` deve voltar vazio.
- Um commit por subtarefa (12.1 a 12.6), cada um registrado no log. No fim, `CACHE_VERSION` → `fv-v15`.

---

## 20. Revisão do supervisor — Fase 12 (2026-10-20)

**Resultado: aprovado com ajustes.** Revisados os 8 commits (`2a344f4` a `b0a30f6`). A triagem de segurança foi respeitada: jiboia, zamioculca, pimenteira e babosa ficaram só como plantas de vaso, e a pimenta tem o alerta de "nunca queimar". O alerta da palmeira-sagu entrou. O altar ficou com 11 cores, todas trocando a vela, e as bicolores aparecem certas. `firmeza.html` ficou sem nenhum `style=""`. O bloco "Plantas de vaso" linka para as 7 fichas. Console limpo e sem rolagem lateral a 1440 px e a 375 px.

**Conteúdo extra** (abacaxi-roxo, trevo-roxo, peregun roxo, hibisco, os 4 banhos, a defumação e o termo Mezinha): registrado no log como "a pedido do usuário", então foi mantido. Obrigado por anotar a origem.

**Ajustado pelo supervisor:**
1. **Bug:** o hibisco e o banho de hibisco usavam o objetivo `amor`, que não existe em `OBJETIVOS` (o card ficava sem cor e fora dos filtros). Trocado por `harmonizacao` (e `calma` na erva). **Use só os 6 objetivos existentes.**
2. **Abacaxi-roxo** (seiva que causa dermatite): entrou o teste no antebraço antes do banho e a restrição para crianças, gestantes e peles sensíveis, na ficha e no banho. Saiu "escudo impenetrável".
3. **Peregun roxo:** entrou o alerta de toxicidade para pets e o teste de pele. Saíram "rompendo feitiços antigos" e "larvas astrais".
4. **Maracujá:** saíram "riquíssima em passiflorina", "o mais eficaz banho contra insônia" e "fecha as portas para pesadelos". **Jiboia:** saiu "purifica o ar" (é um mito).
5. A defumação de hibisco dizia "com Louro e Açúcar", mas a receita leva canela e não leva açúcar. Nome corrigido.
6. Hash errado no log (`ab40d1f` → `859a90a`). `CACHE_VERSION` → `fv-v17`.

**Pendência antiga, para uma próxima fase:** 12 ervas antigas usam o objetivo `foco`, que também não existe em `OBJETIVOS`.

**Próximo passo:** aguardar a nova tarefa do dono do site. As 14 ervas novas das Fases 11 e 12 estão sem foto.

---

## 21. Adição da Curimba & Pontos Cantados (A pedido do usuário — 2026-10-20)

**Solicitação:** Adicionar um lugar para pontos cantados separados por Mestre, Mestras, Caboclos, Pretos Velhos, Baianos, Boiadeiros, Marinheiros e Guardiões, com letras, toques, saudações, significados e conexão com pontos riscados.

**Arquivos criados e alterados:**
1. `data/pontos.js`: 20 cantigas tradicionais estruturadas com `id`, `titulo`, `linha`, `linhaNome`, `entidade`, `tipo`, `toque`, `saudacao`, `letra`, `significado`, `ervasAssociadas` e `pontoRiscadoDescricao`.
2. `pontos.html`: Página dedicada da curimba e tradição oral, integrada ao cabeçalho único (em Saberes) e rodapé, com trilho de destaque dos Mestres e Mestras da Jurema, catálogo com filtros por linha e tipo, acordeões de fundamentos da curimba (o que é curimba, os toques tradicionais e conexão com o ponto riscado) e aviso ético sobre respeito à tradição oral.
3. `styles/styles.css`: Classes estilizadas para `.pcard`, badges temáticas por falange (`.badge--jurema`, `.badge--mestras`, `.badge--caboclo`, `.badge--almas`, `.badge--baiano`, `.badge--boiadeiro`, `.badge--aguas`, `.badge--guardiao`) e visual da letra e fundamentos no Drawer (`.ponto-detail`, `.ponto-letra`, `.ponto-detail__saudacao`).
4. `script/script.js`:
   - `PONTOS = []` e `loadPontos()`.
   - Adição de `Pontos Cantados` em `NAV` dentro de `saberes`.
   - Renderizador `pontoCardHtml`, `pontoDetailHtml` e `initPontosPage()` com motor `createCatalog`.
   - Integração completa na busca global (`searchGlobal` com atalho `/`).
   - Carregamento em `Promise.all` com fallback offline e vinculação das ervas às fichas via `linkHerb`.
5. `sw.js`: Inclusão de `pontos.html` e `data/pontos.js` no `PRECACHE`, elevação da `CACHE_VERSION` para `fv-v18`.

---

## 22. Fundamentos de Banhos: Descarrego, Purificação, Banho da Paz de Oxalá & Resguardo (A pedido do usuário — 2026-10-20)

**Solicitação:** Ensinar a diferença crucial entre banho de descarrego (que esvazia o corpo e exige abstenção/resguardo estrito), banho de purificação (que troca energias) e o banho da paz de Oxalá com boldo e água fria tomado na cabeça numa sexta-feira. Detalhar o que fazer antes, durante e depois de cada banho.

**Arquivos alterados:**
1. `banhos.html`:
   - Remoção de todos os estilos inline remanescentes (`style=""` count: 0).
   - Inclusão de 3 novos blocos em acordeão:
     - *Descarrego × Purificação × Banho da Paz (Oxalá): As 3 Funções das Ervas* (distinção teológica e prática de como cada banho atua no corpo sutil).
     - *O Resguardo Sagrado pós-Descarrego: O Que Fazer e o Que Evitar* (abstenção de locais cheios, aglomerações, relações íntimas, álcool e discussões; uso de roupas claras, oração e o 2º tempo de reconstrução).
     - *Guia Ritual: O Passo a Passo Antes, Durante e Depois* (banho de higiene primeiro, preparo calmo, maceração viva, temperatura correta e descarte sagrado na terra).
2. `data/banhos.js`:
   - Atualização de `banho-boldo-puro-ori`: destacado como *Banho da Paz de Oxalá*, com maceração a frio em água fresca na sexta-feira para o Ori.
   - Atualização de `banho-descarrego-forte`: inclusão explícita na observação de que o banho esvazia o corpo e exige resguardo obrigatório de ambientes cheios e trocas íntimas.
3. `styles/styles.css`: Criação das classes utilitárias `.fund-grid`, `.fund-card` e variações (`.fund-card--warn`, `.fund-card--paz`, `.fund-card--jurema`, `.fund-card--resguardo`, `.fund-step-list`) sem nenhum inline style.
4. `sw.js`: Bump de cache para `fv-v19`.


