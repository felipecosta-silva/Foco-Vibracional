# Tarefas 014 — Luz viva e prática da lua

> Leia `spec.md` e `plan.md` antes. Faça na ordem, marque cada uma e registre no fim. Um commit por tarefa: `feat(014-T00X): ...`. **Não faça `git push`.**

## Parte A — Luz viva
- [x] T001 Tokens novos no `:root` e a vela em camadas (chama, pavio, cera, gota, halo que respira, fumaça), em `heroArtHtml("candle")` e no CSS.
- [x] T002 `initHeroLuz()`: chama que se inclina com o ponteiro, sopro com o toque, pausa fora da tela, tudo desligado com movimento reduzido.
- [x] T003 Luar no calendário, brilho que percorre o 11:11, halo atrás das cartas, pulso de luz na geometria.
- [x] T004 Vaga-lumes nas aberturas com foto (função reaproveitada de `initFireflies`) e fios de fumaça na Defumação.
- [x] T005 Abertura `steam` com xícara e vapor em `chas.html`; conferir o aviso da spec 012 sem rolar a 375 px.

## Parte B — Prática de 2 minutos
- [x] T006 `data/lua-praticas.js` com os textos da spec, sem mudar nenhuma palavra.
- [x] T007 Card `#pratica-da-lua` em `calendario.html` e `initPraticaLua()` com Ouvir, Copiar e a contagem de 2 minutos.
- [x] T008 Primeira afirmação em cada cartão de "Próximas fases" e a linha no Hoje.
- [x] T009 `sw.js`: `PRECACHE` e `CACHE_VERSION`.
- [x] T010 Testar a 375 px e 1440 px, offline, com movimento reduzido e com CPU 4× mais lenta: console limpo, sem rolagem lateral, acentos certos.

## Registro do executor

**Executor: Claude (2026-11-12), a pedido do dono ("você mesmo pode aplicar").**

- T001: tokens `--chama-*`, `--luz-vela*`, `--luar*`, `--vapor`, `--fumaca`, `--cera*`, `--porcelana*` num `:root` no fim do CSS. A vela virou elementos reais (`CANDLE_HTML` em `script/inicio.js`): halo, fumaça, chama (pai com `--inclina` e `.ph-candle__fogo` com 3 camadas em 2,3 s, 3,7 s e 5,9 s), pavio, corpo com cera e gota. Os pseudo-elementos antigos ficaram com `content: none`. `.pagehead--vela h1` ganhou um brilho quente fraco.
- T002: `initHeroLuz()` (ponteiro inclina a chama para longe, até 16°; toque no celular aplica `.ph-candle--sopro` por 900 ms; `IntersectionObserver` aplica `.ph-pausado`, que pausa as animações fora da tela). Não roda com movimento reduzido; a regra global de `prefers-reduced-motion` já desliga as animações CSS.
- T003: `.ph-luar` e estrelas em 3 ritmos (6 s, 4,3 s, 7,7 s) no calendário; `.ph-numbers__brilho` (brilho dourado a cada 7 s); `.ph-luz-cartas`; `.ph-geo__pulso`.
- T004: `initFireflies()` passou a usar `startFireflies(canvas, {count, alpha})`; as aberturas com foto ganham `.ph-art--luz` com o canvas (10 no celular, 18 no computador, com máscara para não passar perto do título). `defumacao.html` ganha `.ph-fumaca` com 4 fios.
- T005: `PAGE_HERO["chas.html"] = { art: "steam" }` com xícara, pires, 3 fios de vapor e luz quente. A 375 px o aviso da spec 012 aparece sem rolar.
- T006: `data/lua-praticas.js` com os textos da spec (o "lema" da §6 ficou em campo próprio).
- T007: card `#pratica-da-lua` em `calendario.html`; `initPraticaLua()` em `script/colheita-calendario.js`, chamada por `initCalendarioLunar()`. Contagem por `performance.now()` em `requestAnimationFrame`, anel SVG por `stroke-dashoffset`, passos 1 e 2 até 0:40, 3 até 1:40, 4 até 2:00; Pausar/Continuar, Recomeçar, `pagehide` zera; no fim a chama para e aparece a mensagem, com `navigator.vibrate?.(200)`. No celular o anel fica acima dos passos.
- T008: primeira afirmação em itálico em cada cartão de "Próximas fases"; no Hoje, linha com a afirmação e o link para a prática (`script/hoje.js`, `data/lua-praticas.js` carregado em `index.html`).
- T009: `data/lua-praticas.js` no `PRECACHE`; `CACHE_VERSION` fv-v54.
- T010: puppeteer a 1440 e 375 px em mantras, firmeza, calendário, portais, tarot, símbolos, banhos, defumação e chás: console limpo, sem rolagem lateral. Contagem testada com relógio acelerado (0 s, 50 s, pausa, 105 s, fim). Movimento reduzido: nenhuma animação na abertura. CPU 4×: 56 a 60 quadros por segundo ao rolar. Offline: calendário e chás abrem com tudo.
