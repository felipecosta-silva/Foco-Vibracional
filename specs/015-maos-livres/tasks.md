# Tarefas 015 — Mãos livres

> Spec: `spec.md`. Plano curto, feito e executado pelo Claude no mesmo dia (2026-11-12).

## Plano

| Arquivo | O que muda |
|---|---|
| `script/nucleo.js` | `telaAcesa` (Screen Wake Lock por motivo: `timer`, `pratica`, `gaveta`; pede de novo ao voltar para a aba). |
| `script/catalogo.js` | `addRecipeTimers()` (botão "⏱ N min" depois de cada "N minuto(s)", 1 a 60, nos `.dsec p` e `.dsec li` da gaveta); `RecipeTimer` (barra fixa, contagem pela hora do relógio, Pausar/Continuar, Cancelar, OK, vibração e sinal sonoro suave); botão de sol na gaveta (`[data-tela]`), que desliga ao fechar. |
| `script/colheita-calendario.js` | A prática de 2 minutos pede e solta a tela acesa. |
| `script/portais.js` | `agendaLuaPortaisIcs()` (RFC 5545: escape, dobra a 75 bytes, CRLF, eventos de dia inteiro com aviso às 9h) e `initAgendaIcs()` (`[data-agenda-ics]`). |
| `calendario.html`, `portais.html` | Botão "📅 Adicionar à minha agenda" com a linha explicativa. |
| `script/inicio.js` | Chama `initAgendaIcs()`. |
| `styles/styles.css` | `.timer-chip`, `.timer-bar`, `.agenda-ics`, só tokens. |
| `sw.js` | `CACHE_VERSION` fv-v56 (nenhum arquivo novo). |

## Tarefas

- [x] T001 Tela acesa (`telaAcesa`) e botão de sol na gaveta.
- [x] T002 Botões de tempo nas fichas e barra do temporizador.
- [x] T003 Tela acesa na prática de 2 minutos da lua.
- [x] T004 Arquivo `.ics` e botões no Calendário e em Portais.
- [x] T005 CSS e `CACHE_VERSION`.
- [x] T006 Testes.

## Registro do executor

**Executor: Claude (2026-11-12).**

- Puppeteer a 375 e 1440 px no "Banho da Paz de Oxalá": botões "⏱ 15 min" (preparo) e "⏱ 10 min" (versão em chá). A barra começa em 15:00 e continua depois de fechar a gaveta. Pausada, não anda (relógio adiantado 60 min). No fim mostra "Deu o tempo: 15 minutos." e o OK fecha. A tela acesa liga e desliga com a gaveta e com o temporizador. Sem rolagem lateral; console limpo.
- Chás: a ficha do chá de cravo, canela, gengibre e abacaxi mostra os botões de 10 min.
- Agenda: 61 eventos em 12 meses (49 de lua e 12 portais), nenhuma linha acima de 75 bytes, só CRLF; o botão baixa `foco-vibracional-lua-e-portais.ics`.
- Corrigido no teste: no fim, a barra ficava translúcida sobre a página; agora o fundo é opaco.
- Não testado em aparelho real: o sinal sonoro e a vibração (o headless não toca som nem vibra) e a importação do `.ics` na agenda do iPhone e do Android.
