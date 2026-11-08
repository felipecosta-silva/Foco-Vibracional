# Tarefas 012 — Chás da casa

> Leia `spec.md` e `plan.md` antes. Faça na ordem, marque cada uma e registre no fim. Um commit por tarefa: `feat(012-T00X): ...`. **Não faça `git push`.**

- [x] T001 Criar `data/chas.js` com as 6 receitas da spec §4. Copie os textos sem mudar nenhuma palavra.
- [x] T002 Criar `chas.html` a partir de `defumacao.html`, com o aviso da RF-01 e a regra comum da §4 acima de `#catalog`.
- [x] T003 `NAV` em `script/nucleo.js` e carga de `FV_DATA.chas`.
- [x] T004 `chaCardHtml`, `chaDetailHtml` e `initChasPage()` em `script/catalogo.js`; chamar em `script/inicio.js`.
- [x] T005 Parte 2: `chasDasFichasHtml()` com os chás de `ERVAS.cha` e `BANHOS.versaoCha` e links para as fichas.
- [x] T006 Busca global (`script/busca.js`), se ela já indexar banhos e defumações.
- [x] T007 CSS, só se precisar (fim do arquivo, só tokens).
- [x] T008 `sw.js`: `PRECACHE` e `CACHE_VERSION`.
- [x] T009 Testar a 375 px e a 1440 px e offline: console limpo, sem rolagem lateral, os 6 painéis abrindo, links da Parte 2 abrindo a ficha certa. Conferir os acentos.

## Registro do executor

Executado em 2026-11-08 (sem `git push`, um commit por tarefa):

- **T001 (`44a03dc`):** Criado `data/chas.js` (`window.FV_DATA.chas`) com as 6 receitas da `spec.md` §4 palavra por palavra (`cha-cravo-canela-gengibre-abacaxi`, `cha-limao-gengibre`, `cha-laranja-canela-cravo`, `cha-maca-canela`, `cha-uva-laranja` e `cha-maca-abacaxi-gengibre`) e os campos da §5 (`id`, `nome`, `objetivo`, `momento`, `servir`, `ingredientes`, `preparo`, `guardar`, `servePara`, `variacoes`, `cuidados`, `origem`). Zero termos proibidos pela RF-07.
- **T002 (`b139958`):** Criado `chas.html` a partir da estrutura de `defumacao.html`, sem `.pagehead--hero` para preservar o aviso visível sem rolar no celular, com `<div class="notice">` da RF-01 (incluindo link `tel:08007226001` no Disque-Intoxicação) e `<p class="muted cha-regra">` da §4 acima de `#catalog[data-catalog="chas"]`, seguidos de `#chas-das-fichas` e dos scripts na ordem de `script/ORDEM.md` (`data/chas.js`, `data/ervas.js`, `data/banhos.js`, `data/creditos-fotos.js` e `script/*.js`).
- **T003 (`b9d7808`):** Atualizado `script/nucleo.js` com `let CHAS = [];`, entrada `{ label: "Chás da casa", url: "chas.html" }` em `NAV` → grupo `Rituais` logo após `Defumações`, e função `loadChas()` espelhando `loadDefumacoes()`.
- **T004 (`567dc53`):** Adicionados em `script/catalogo.js` `MOMENTOS`, `MOMENTO_FILTER`, `servirLabel()`, `chaCardHtml()`, `chaDetailHtml()` (com `ingredientsHtml`, `<ol class="list">`, `Guardar`, `Para que serve`, `Variações`, `Cuidados` em `.dsec--warn` e `origemHtml`) e `initChasPage()` usando `createCatalog` e `getDrawer`. Chamados `loadChas()` e `initChasPage()` no `DOMContentLoaded` de `script/inicio.js`.
- **T005 (`11f7888`):** Implementadas em `script/catalogo.js` `isChaSeguro()`, `resumoCha()` (corte limpo por palavra em até 120 caracteres) e `chasDasFichasHtml()`, montando dinamicamente dois acordeões `<details>` em ordem alfabética (`pt-BR`) sem duplicar dados (Constituição V.1):
  - **Das ervas (26):** das 28 fichas de `data/ervas.js` que possuem a chave `cha`, 2 (`comigo-ninguem-pode` e `espada-santa-barbara`) trazem aviso `"PROIBIDO INGERIR (Planta tóxica)..."`; `isChaSeguro()` filtra esses avisos em cumprimento estrito à Constituição II.2 (*ervas tóxicas por ingestão nunca aparecem como chá*).
  - **Dos banhos (8):** das 24 fichas de `data/banhos.js` com a chave `versaoCha`, 16 têm string vazia (`""`) e 8 trazem receita de chá, todas listadas com link para `banhos.html#id`.
- **T006 (`3862860`):** Atualizado `script/busca.js` para carregar `"chas"` sob demanda em `ensureAllData()`, incluir `"Chás da casa"` em `SEARCH_PAGES`, atualizar o `placeholder` e exibir o grupo `"🍵 Chás"` com links `chas.html#id`.
- **T007 (`0b3749c`):** Adicionadas no fim de `styles/styles.css` apenas regras com tokens (`[data-obj="..."]`, `.badge[data-obj]`, `.cha-regra`, `.card.fund`, `.cha-fichas-list`, `.cha-ficha-item`), mantendo zero atributos `style=""` novos e zero cores fixas fora de `:root` (Constituição IV.1 e IV.2).
- **T008 (`bfadc85`):** Atualizado `sw.js` (`CACHE_VERSION` de `"fv-v51"` para `"fv-v52"`, inclusão de `"chas.html"` e `"data/chas.js"` em `PRECACHE`) e incluída `chas.html` em `sitemap.xml`.
- **T009 (este commit):** Verificação automatizada em navegador headless via CDP + checagem estática:
  - **375 px (`375×667`):** `scrollWidth = 375 px` (zero rolagem lateral); aviso RF-01 renderizado em `y = 317..578 px`, inteiramente visível sem rolar e antes de `#catalog` (`y = 757 px`) — **CA-01 atendido**.
  - **Cartões, filtros e painéis:** os 6 cartões renderizam e abrem os 6 painéis (`getDrawer`) com textos idênticos à `spec.md` §4, `.dsec--warn` de cuidados e linha `Origem:` — **CA-02, CA-03 e RF-05 atendidos**; verificado que `"abacaxi"` nos ingredientes não gera link falso para a ficha tóxica `abacaxi-roxo`.
  - **Parte 2:** 26 ervas + 8 banhos em ordem alfabética com resumos de até 119 caracteres; navegação testada abrindo o painel da ficha correspondente em `plantas.html#id` e `banhos.html#id` — **CA-04 atendido**.
  - **1440 px (`1440×900`), busca global e offline:** `scrollWidth = 1440 px` (zero rolagem lateral); busca global retornando grupo `"🍵 Chás"`; Service Worker `fv-v52` ativo com `chas.html` e `data/chas.js` em cache e recarregamento em modo `offline` renderizando catálogo e Parte 2 com console 100% limpo; UTF-8 sem BOM e acentuação íntegra em todos os arquivos — **CA-05 atendido**.
