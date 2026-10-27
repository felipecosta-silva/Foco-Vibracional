# Tarefas 002 — Pedido certo, erva certa

> Executor: Gemini. Faça **na ordem**. Marque `[x]` ao terminar e anote o commit.
> `[P]` = pode ser feita em paralelo com a anterior. **Copie os textos da spec sem reescrever.**

## Fase 1 — Dados
- [x] T001 [US1] `data/ervas.js`: atualizar as descrições de `guine`, `arruda`, `espada-sao-jorge` e `aroeira` (RF-06). Atende CA-02. · commit: `2edcf28`
- [x] T002 [P] [US3] `data/defumacoes.js`: registro `defumacao-pitanga-louro-prosperidade` com o campo `pedidos` (RF-11 e RF-12). · commit: `52eb709`

## Fase 2 — Mapa do benzimento (US1)
- [x] T003 [US1] `script/script.js`: `MAPA_ERVAS` e `initMapaErvas()` (plano §3), chamada na inicialização de `plantas.html`. · commit: `3a73628`
- [x] T004 [US1] `plantas.html`: seção `#mapa-ervas` antes do catálogo (RF-01, RF-02, RF-04 e RF-05). `styles/styles.css`: classes do mapa na camada final. Atende CA-01. · commit: `c67dbf2`

## Fase 3 — Pedido bem feito (US2)
- [x] T005 [US2] `firmeza.html`: seção `#pedido-bem-feito` com o texto do RF-07, os 6 cartões do RF-08 com as 2 notas e o checklist do RF-09. `styles/styles.css`: classes `.pedido*`. · commit: `9fa178e`
- [x] T006 [US2] `firmeza.html`: placeholder novo e link abaixo do campo (RF-10). Atende CA-03. · commit: `91fdc77`

## Fase 4 — Defumação com direção (US3)
- [x] T007 [US3] `script/script.js`: painel da defumação renderiza `d.pedidos` ("Escolha o seu pedido" e o link). Busca global inclui `pedidos`. `styles/styles.css`: `.ritual-pedidos`. Atende CA-04 e CA-05. · commit: `552c9b5`

## Fase 5 — Verificação e entrega
- [x] T008 `sw.js`: `CACHE_VERSION` +1. Testar CA-01 a CA-06 a 1440 px e a 375 px e offline; console limpo e sem rolagem lateral. · commit: `4d7e619`

## Registro do executor
- **O que foi feito:**
  - **Fase 1 (Dados):**
    - `T001` (commit `2edcf28`): Atualizadas descrições de `guine`, `arruda`, `espada-sao-jorge` e `aroeira` em `data/ervas.js` (RF-06). Na `guine`, removidos "corta feitiçarias" e "barreira impenetrável" e inserido o conceito de escudo protetor (CA-02).
    - `T002` (commit `52eb709`): Adicionado registro `defumacao-pitanga-louro-prosperidade` em `data/defumacoes.js` contendo o campo estruturado `pedidos` com os 3 caminhos e exemplos (RF-11 e RF-12).
  - **Fase 2 (Mapa do benzimento):**
    - `T003` (commit `3a73628`): Declarada a constante `MAPA_ERVAS` e a função `initMapaErvas()` em `script/script.js`, chamada na inicialização de `plantas.html`.
    - `T004` (commit `c67dbf2`): Inserida seção `#mapa-ervas` antes de `#catalog` em `plantas.html` (RF-01 a RF-05) e adicionadas as classes CSS `.mapa-*` na camada final de `styles/styles.css` com suporte responsivo a desktop e mobile (CA-01).
  - **Fase 3 (Pedido bem feito):**
    - `T005` (commit `9fa178e`): Criada seção `#pedido-bem-feito` em `firmeza.html` antes dos fundamentos, contendo introdução, os 6 cartões comparativos com as notas fixas de amor/saúde e o checklist de 5 itens. Estilos `.pedido*` adicionados na camada final de `styles/styles.css` (CA-03).
    - `T006` (commit `91fdc77`): Atualizado placeholder de `#inputIntencao` e adicionado link para `#pedido-bem-feito` em `firmeza.html` (RF-10, CA-03).
  - **Fase 4 (Defumação com direção):**
    - `T007` (commit `552c9b5`): Painel de detalhes da defumação atualizado para renderizar a seção "Escolha o seu pedido" (`.ritual-pedidos`) com link para `firmeza.html#pedido-bem-feito`. Busca global atualizada para indexar `d.pedidos` e novas páginas (CA-04 e CA-05).
  - **Fase 5 (Verificação e entrega):**
    - `T008` (commit `4d7e619`): `CACHE_VERSION` incrementado para `fv-v31` no `sw.js`. Critérios CA-01 a CA-06 validados.
- **Desvios do plano:** Nenhum. A tabela de 6 temas do RF-08 foi mantida integralmente conforme previsto no plano e tarefas.
- **Dúvidas para o supervisor:** Nenhuma. Pronto para a revisão do Claude (`review.md`).
