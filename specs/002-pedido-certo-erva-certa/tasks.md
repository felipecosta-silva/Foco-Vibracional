# Tarefas 002 — Pedido certo, erva certa

> Executor: Gemini. Faça **na ordem**. Marque `[x]` ao terminar e anote o commit.
> `[P]` = pode ser feita em paralelo com a anterior. **Copie os textos da spec sem reescrever.**

## Fase 1 — Dados
- [ ] T001 [US1] `data/ervas.js`: atualizar as descrições de `guine`, `arruda`, `espada-sao-jorge` e `aroeira` (RF-06). Atende CA-02. · commit: ``
- [ ] T002 [P] [US3] `data/defumacoes.js`: registro `defumacao-pitanga-louro-prosperidade` com o campo `pedidos` (RF-11 e RF-12). · commit: ``

## Fase 2 — Mapa do benzimento (US1)
- [ ] T003 [US1] `script/script.js`: `MAPA_ERVAS` e `initMapaErvas()` (plano §3), chamada na inicialização de `plantas.html`. · commit: ``
- [ ] T004 [US1] `plantas.html`: seção `#mapa-ervas` antes do catálogo (RF-01, RF-02, RF-04 e RF-05). `styles/styles.css`: classes do mapa na camada final. Atende CA-01. · commit: ``

## Fase 3 — Pedido bem feito (US2)
- [ ] T005 [US2] `firmeza.html`: seção `#pedido-bem-feito` com o texto do RF-07, os 6 cartões do RF-08 com as 2 notas e o checklist do RF-09. `styles/styles.css`: classes `.pedido*`. · commit: ``
- [ ] T006 [US2] `firmeza.html`: placeholder novo e link abaixo do campo (RF-10). Atende CA-03. · commit: ``

## Fase 4 — Defumação com direção (US3)
- [ ] T007 [US3] `script/script.js`: painel da defumação renderiza `d.pedidos` ("Escolha o seu pedido" e o link). Busca global inclui `pedidos`. `styles/styles.css`: `.ritual-pedidos`. Atende CA-04 e CA-05. · commit: ``

## Fase 5 — Verificação e entrega
- [ ] T008 `sw.js`: `CACHE_VERSION` +1. Testar CA-01 a CA-06 a 1440 px e a 375 px e offline; console limpo e sem rolagem lateral. · commit: ``

## Registro do executor
> Preencha ao final: o que foi feito, desvios do plano (e por quê) e dúvidas para o supervisor.
