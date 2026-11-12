# Plano 014 — Luz viva e prática da lua

> Spec: `specs/014-luz-viva-e-pratica-da-lua/spec.md` · Executor: Gemini · Revisão: Claude

## Parte A — Luz viva

| Arquivo | O que muda |
|---|---|
| `styles/styles.css` | No fim do arquivo: tokens novos no `:root` (`--chama-nucleo`, `--chama`, `--chama-borda`, `--luz-vela`, `--luar`, `--vapor`, `--fumaca`) e todas as regras novas. A vela atual (`.ph-candle::before/::after`, perto da linha 3600) passa a ter filhos reais em vez de pseudo-elementos. Bloco `@media (prefers-reduced-motion: reduce)` desligando todas as animações novas. |
| `script/inicio.js` | `heroArtHtml("candle")` devolve a vela em camadas: `.ph-candle` com `.ph-candle__halo`, `.ph-candle__corpo`, `.ph-candle__cera`, `.ph-candle__gota`, `.ph-candle__pavio`, `.ph-candle__chama` (com 3 filhos para as camadas) e `.ph-candle__fumaca`. Novos `heroArtHtml("steam")` (xícara e 3 fios de vapor) e camadas de luz para `moon`, `numbers`, `cards` e `geo`. `PAGE_HERO` ganha `"chas.html": { art: "steam" }` e, nas páginas com foto, `fireflies: true` (e `smoke: true` em `defumacao.html`). |
| `script/inicio.js` | `initHeroLuz()`: (1) reação ao ponteiro com `pointermove` na abertura, calculando a inclinação pela distância horizontal até a chama e gravando em `--inclina` (variável CSS, não `style=""` no HTML: use `el.style.setProperty`, que não é atributo escrito no código); `pointerleave` volta a zero com transição; (2) toque no celular adiciona `.ph-candle--sopro` por 900 ms; (3) vaga-lumes da abertura: reaproveite a lógica de `initFireflies()` numa função que receba o canvas e a quantidade, para não duplicar código; (4) pare tudo com `IntersectionObserver` quando a abertura sair da tela; (5) nada disso roda com movimento reduzido. Chame em `DOMContentLoaded`, depois de `enhancePageHead()`. |
| `chas.html` | Mantém a `pagehead` como está; a abertura vem de `PAGE_HERO`. Confira que o aviso da RF-01 da spec 012 continua visível sem rolar a 375 px (se não couber, a abertura de `chas.html` usa a altura mínima menor). |

### Notas de implementação

- A chama: 3 camadas absolutas com `transform-origin: 50% 100%` e animações `chamaA`, `chamaB`, `chamaC` (2,3 s, 3,7 s e 5,9 s) que mexem só `transform` (escala, rotação de 1 a 3 graus) e `opacity`. A inclinação do ponteiro entra num elemento pai: `transform: rotate(calc(var(--inclina, 0) * 1deg))`, com `transition: transform .8s`.
- O halo: um `radial-gradient` grande de `--luz-vela`, com `mix-blend-mode: screen` e animação `respira` (escala de 1 a 1,08, 4,1 s).
- Título "iluminado": um `text-shadow` quente bem fraco no `h1` só das páginas com vela (`.pagehead--vela h1`), sem mudar a cor do texto.
- O brilho que percorre o 11:11: um `linear-gradient` animado em `background-position` com `background-clip: text`, por cima do contorno atual.

## Parte B — Prática de 2 minutos

| Arquivo | O que muda |
|---|---|
| `data/lua-praticas.js` | Novo, com os textos das §6 a §8, sem mudar nenhuma palavra. Carregar em `calendario.html` e `index.html` antes dos scripts. |
| `calendario.html` | `<section class="card section-gap" id="pratica-da-lua">` logo depois da `<section>` de "Agora / Próximas fases", com os pontos de montagem: `#praticaFase`, `#praticaPassos`, `#praticaAfirmacoes`, `#praticaTimer`. |
| `script/colheita-calendario.js` | `initPraticaLua()`: monta o card pela fase de hoje; cria os botões com `data-speak` e `data-copy-text`; contagem com `requestAnimationFrame` e `performance.now()` (não use `setInterval` para o tempo); anel de progresso em SVG (`stroke-dashoffset`); passos acesos pela tabela do RF-B4; Pausar e Recomeçar; `navigator.vibrate?.(200)` no fim. Nos cartões de "Próximas fases", acrescente a primeira afirmação da fase. |
| `script/hoje.js` | Linha com a afirmação da lua de hoje e o link para `calendario.html#pratica-da-lua`. |
| `script/inicio.js` | Chamar `initPraticaLua()`. |
| `sw.js` | `data/lua-praticas.js` no `PRECACHE`; `CACHE_VERSION` sobe. |

## Ordem de entrega

Primeiro a vela (Mantras e Firmeza), mostrada ao dono antes de seguir para as outras aberturas. Depois as outras aberturas. Por último a prática da lua.
