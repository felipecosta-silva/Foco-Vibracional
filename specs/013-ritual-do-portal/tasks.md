# Tarefas 013 — Ritual do portal

> Leia `spec.md` e `plan.md` antes. Faça na ordem, marque cada uma e registre no fim. Um commit por tarefa: `feat(013-T00X): ...`. **Não faça `git push`.**

- [x] T001 Criar `data/portal.js` com as luas (§4) e os temas (§7), texto sem mudar nenhuma palavra.
- [x] T002 `portais.html`: carregar `data/portal.js`; seção `#ritual-do-portal` com abertura, "Como escrever", "Passo a passo", cuidados do fogo e linha de origem; `#portalTodayLua` e o link no card "Hoje é portal?".
- [x] T003 `script/portais.js`: `renderPortalLuas()`, `renderPortalTemas()` com botões Copiar, e a lua de hoje no card.
- [x] T004 `script/hoje.js`: link para o ritual no dia de portal.
- [x] T005 CSS, só se precisar (fim do arquivo, só tokens, sem `style=""`).
- [x] T006 `sw.js`: `PRECACHE` e `CACHE_VERSION`.
- [x] T007 Testar a 375 px e a 1440 px e offline: console limpo, sem rolagem lateral, Copiar funcionando, lua de hoje destacada. Para testar o dia de portal, simule a data 11/11 no navegador (por exemplo, sobrescrevendo `Date` no teste). Conferir os acentos.

## Registro do executor

**Executor: Claude (2026-11-12), a pedido do dono ("pode fazer"). A tarefa foi enviada ao Gemini pela Antigravity, mas ele não chegou a começar.**

- T001: `data/portal.js` com as 4 luas (§4) e os 9 temas (§7), texto copiado da spec; `nota` só em Saúde.
- T002: `portais.html` carrega `data/portal.js`; seção `#ritual-do-portal` (`.fund`) depois de "Próximos portais / Hoje é portal?", com abertura, quadro das luas, "Como escrever", "Passo a passo", aviso do fogo, temas e origem. No card "Hoje é portal?": `#portalTodayLua` e o link "Ver o ritual do portal".
- T003: `renderPortalRitual()` em `script/portais.js`, chamada por `initPortaisPage()`: cartões `.info-card` das luas com a de hoje em `.portal-lua--hoje` e a etiqueta "Hoje"; um `<details>` por tema, cada afirmação com Copiar (`data-copy-text`, escapado).
- T004: no dia de portal, o texto do Hoje leva a `portais.html#ritual-do-portal`.
- T005: CSS no fim do arquivo, só com tokens (`.portal-luas`, `.portal-lua--hoje`, `.portal-afirmacoes`).
- T006: `data/portal.js` no `PRECACHE`; `CACHE_VERSION` fv-v55.
- T007: puppeteer a 1440 e 375 px: lua crescente marcada "Hoje", 9 temas e 27 botões Copiar (copiou o texto certo), sem rolagem lateral, console limpo. Com a data simulada em 11/11/2026: o Hoje mostra o link do ritual e o card mostra "SIM" com a lua. Offline: a seção abre com os 9 temas.
