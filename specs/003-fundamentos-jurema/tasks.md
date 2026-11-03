# Tarefas 003 — Fundamentos da Jurema

> Spec: `spec.md` · Plano: `plan.md`
> **Executor:** Gemini. Faça na ordem, marque `[x]` e anote o commit em cada tarefa. Textos copiados da spec, sem reescrita. Não mude a spec nem o plano.

- [x] **T001** `jurema.html` com o `<head>`, a estrutura e os scripts de `comece.html`, o cabeçalho e o aviso (RF-01). · commit: `635a9f9`
- [x] **T002** As 9 seções da RF-02 em `jurema.html`, com os `id`, os selos das seções 6 e 7 e os links do glossário na primeira vez que cada termo aparece (RF-02 e RF-03). · commit: `635a9f9`
- [x] **T003** `comece.html`: o passo "O que é a Jurema" com `data-step="jurema"` entre o passo 2 e o 3, e os textos de 8 passos (RF-04 e RF-05). · commit: `5736851`
- [x] **T004** `glossario.html`: os 12 termos com `id` e o link para `jurema.html`, e o `id="quartinha"` (RF-06 a RF-08). · commit: `758a1ed`
- [x] **T005** `data/ervas.js`: `cuidados` e `cabeca` da `jurema-preta` (RF-09 e RF-10). · commit: `072ee4c`
- [x] **T006** Portas de entrada: `NAV`, `SEARCH_PAGES` e o link em `pontos.html` (RF-11 a RF-13). · commit: `9b5fc89`
- [x] **T007** `sw.js` (`jurema.html` no `PRECACHE`, `fv-v42`) e `sitemap.xml`. · commit: `460310e`
- [x] **T008** Testes a 1440 px e 375 px e offline: console limpo, sem rolagem lateral, todos os links da página e do passo novo, `glossario.html#princesa`, busca por "jurema", "catimbó" e "maracá", e um passo da trilha marcado antes da mudança continua marcado (CA-01 a CA-07). · validado via CDP headless

## Registro do executor
<!-- Data, tarefa, commit e o que foi feito. Se algo da spec não couber, anote aqui e não invente. -->
- **2026-11-03 — T001 e T002 (`635a9f9`):** Criada `jurema.html` a partir da estrutura de `comece.html` (mesmo `<head>` com metadados e canonical de `jurema.html`, `#site-header`, `<noscript>`, `<main class="wrap page">`, `#site-footer` e os 11 scripts na ordem de `script/ORDEM.md`). Incluídos o cabeçalho `.pagehead` e o `.notice` da RF-01, seguidos das 9 seções (`#arvore`, `#reinos`, `#quem-trabalha`, `#na-casa`, `#primeira-sessao`, `#vinho-da-jurema`, `#juremado`, `#caridade`, `#perguntas`) com os textos exatos da RF-02, selo `.badge-danger` nas seções 6 e 7 (RF-03) e links para `glossario.html#id` na primeira ocorrência de cada termo do glossário.
- **2026-11-03 — T003 (`5736851`):** Inserido o passo "O que é a Jurema" (`data-step="jurema"`) entre os passos 2 e 3 em `comece.html`, mantendo os `data-step` originais dos demais passos (RF-04). Atualizados `description`, `og:description`, contador inicial (`0 de 8 passos feitos`) e o texto de fecho (`Quando os oito passos...`) (RF-05).
- **2026-11-03 — T004 (`758a1ed`):** Adicionado `id="quartinha"` ao item Quartinha em `glossario.html` (RF-07) e inseridos os 12 novos termos (`jurema`, `catimbo`, `tronco`, `mestres`, `encantados`, `cidades-da-jurema`, `maraca`, `princesa`, `juremado`, `gira`, `cambono`, `zelador`) entre "Linha de trabalho" e "Falange", com os links "Ler em Fundamentos da Jurema" apontando para as seções correspondentes de `jurema.html` (RF-06 e RF-08).
- **2026-11-03 — T005 (`072ee4c`):** Atualizados `cuidados` e `cabeca` da ficha `jurema-preta` em `data/ervas.js` com os textos da RF-09 e RF-10.
- **2026-11-03 — T006 (`9b5fc89`):** Adicionada a entrada de `jurema.html` em `NAV` ("Saberes", logo após "Comece aqui") em `script/nucleo.js` (RF-11), em `SEARCH_PAGES` de `script/busca.js` (RF-12), e o botão "Quem são os Mestres?" (`jurema.html#quem-trabalha`) em `.home-section__actions` de `pontos.html` (RF-13), além de `.home-section__actions { flex-wrap: wrap; }` no bloco Spec 003 no fim de `styles/styles.css` para evitar rolagem lateral a 375 px.
- **2026-11-03 — T007 (`460310e`):** Incluída `jurema.html` no `PRECACHE` de `sw.js`, incrementado `CACHE_VERSION` para `fv-v42` e adicionada a URL de `jurema.html` em `sitemap.xml` com `lastmod` `2026-11-03`.
- **2026-11-03 — T008:** Validados CA-01 a CA-07 via navegador headless (CDP) em 1440×900 e 375×812 e em modo offline: UTF-8 sem BOM, console limpo (zero erros/exceções), zero rolagem lateral em `jurema.html`, `comece.html`, `glossario.html`, `plantas.html` e `pontos.html`, todos os links respondendo HTTP 200 com âncoras válidas, `glossario.html#princesa` abrindo o `<details>` e apontando para `jurema.html#na-casa`, busca global encontrando `jurema.html` para `"jurema"`, `"catimbó"` e `"maracá"`, preservação de passos já marcados na trilha (`data-step="1"` e `data-step="3"` permanecem marcados como `2 de 8 passos feitos`), e carregamento offline via Service Worker `fv-v42`.
