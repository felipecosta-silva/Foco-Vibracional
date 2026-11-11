# Plano 013 — Ritual do portal

> Spec: `specs/013-ritual-do-portal/spec.md` · Executor: Gemini · Revisão: Claude

## Arquivos

| Arquivo | O que muda |
|---|---|
| `data/portal.js` | Novo: `window.FV_DATA.portalRitual` com `luas` (§4) e `temas` (§7), texto copiado sem mudar. |
| `portais.html` | Carrega `data/portal.js` antes de `script/nucleo.js`. Seção nova `<section class="fund section-gap" id="ritual-do-portal">` depois da `<section class="grid">` de "Próximos portais / Hoje é portal?". Dentro: abertura (RF-01), `<div id="portalLuas">` (preenchido por JS), "Como escrever" (§5) em `<ul class="list">`, "Passo a passo" (§6) em `<ol class="list">` mais um `<div class="notice">` com os cuidados do fogo, `<div id="portalTemas">` (preenchido por JS) e a linha de origem (§8) em `<p class="muted small">`. No card "Hoje é portal?", um `<p id="portalTodayLua" class="muted small">` e um link `<a href="#ritual-do-portal">Ver o ritual do portal</a>`. |
| `script/portais.js` | Em `initPortaisPage()`: `renderPortalLuas()` monta o quadro das luas com a linha de hoje marcada (`getLiveMoonData(new Date()).key`, etiqueta "Hoje"); `renderPortalTemas()` monta um `<details>` por tema, cada afirmação com `<button class="pill" type="button" data-copy-text="...">Copiar</button>` (escape com `escapeHtml`); `#portalTodayLua` recebe "Lua de hoje: {ícone} {nome}. {pede}". |
| `script/hoje.js` | No bloco "Portal do dia" (perto de `isPortalDay(today)`), acrescente o link "Ver o ritual do portal" para `portais.html#ritual-do-portal`, só no dia de portal. |
| `styles/styles.css` | Só o que faltar, no fim, com tokens: a linha da lua de hoje destacada (`.portal-lua--hoje`, borda `var(--accent)`) e a lista de afirmações com o botão ao lado. |
| `sw.js` | `data/portal.js` no `PRECACHE`; `CACHE_VERSION` sobe. |

## Decisões

- Os `<details>` dos temas usam o visual `.fund` que já existe (como em `firmeza.html#rituais-simples`). Todos começam fechados.
- O quadro das luas pode ser uma lista de 4 cartões (`.info-card`, como o "Mapa de intenção por portal"), sem tabela, para caber em 375 px.
- Não mexa no "Mapa de intenção por portal" nem no Grabovoi.
