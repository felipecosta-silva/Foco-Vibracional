# Plano 004 — Trilha "Comece aqui"

> Spec: `spec.md` · Regras: `.specify/memory/constitution.md`

## Arquivos

| Arquivo | Mudança |
|---|---|
| `comece.html` (novo) | Página com cabeçalho, contador, os 7 passos (`<ol class="trail">`), o bloco "não faz sozinho" e o fecho. Metadados no padrão das outras páginas (canonical, Open Graph, `twitter:card`). Carrega os 11 arquivos de `script/` na ordem de `script/ORDEM.md`. |
| `script/inicio.js` | `initTrilha()`: progresso com `localStorage` (try/catch), botões `aria-pressed`, contador e "Recomeçar". `initHashDetails()`: abre o `<details>` cujo `id` está no `#hash` (ao carregar e no `hashchange`). Os dois são chamados no `DOMContentLoaded`. |
| `script/nucleo.js` | `NAV`: `{ label: "Comece aqui", url: "comece.html" }` como primeiro item de "Saberes". |
| `script/busca.js` | `SEARCH_PAGES`: o resultado da RF-11. |
| `index.html` | O chip da RF-09 em `.hero-quick`. |
| `glossario.html` | Os `id` da RF-13 nos quatro `<details>`. |
| `manifest.webmanifest` | O atalho "Comece aqui". |
| `styles/styles.css` | Bloco "Spec 004" no fim: `.trail`, `.trail-step`, `.trail-step--done`, `.trail-progress`, `.trail-links` e `.trail-warn`, só com tokens. |
| `sw.js` | `comece.html` no `PRECACHE` e `CACHE_VERSION` aumentado. |
| `sitemap.xml` | A URL de `comece.html`. |

## Decisões
- **Página própria, e não um bloco na capa.** A capa já é longa, e a trilha precisa de espaço para explicar o porquê de cada passo.
- **No menu, dentro de "Saberes".** "Hoje" não tem subitens, e transformá-lo em menu mudaria a barra inferior do celular. A porta principal é o chip da capa.
- **Os links para banhos e defumações usam filtro** (`?objetivo=calma`), e não uma ficha fixa. Assim a trilha continua certa quando o catálogo crescer. A única exceção é a defumação de alecrim e manjericão: duas ervas de cozinha, suave e sem cuidados especiais.
- **O progresso é só uma conveniência do aparelho.** Nada se perde se ele sumir, e por isso fica no `localStorage`.
- **O passo da Lua resume o `MOON_STAGES`** de `script/lua.js`, para não contradizer o calendário.
