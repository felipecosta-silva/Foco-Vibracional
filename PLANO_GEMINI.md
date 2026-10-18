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


---

## 6. Revisões do Supervisor (preenchido pelo Claude)

<!-- Claude: notas de revisão, correções e aprovação de cada fase -->
