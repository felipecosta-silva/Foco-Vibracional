# Spec 017: Efeitos vivos (a vela que queima com o relógio)

> **Status:** pedida e feita em 2026-11-13 · **Escrita e executada por:** Claude
> **Pedido do dono:** mostrar a vela queimando conforme o tempo passa (uma vela comum leva 8 horas; se foi acesa à meia-noite, às 6h ela aparece com 6 horas de queima), com chama esticada, duplicada ou balançando, cera escorrendo que fica até a vela acabar, sobre um castiçal, e depois um novo ciclo. Ideias parecidas no resto do site: cartas que embaralham ou pegam fogo numa ação, um defumador com fumaça pairando na página, respingos de água no preparo do banho. "O resto das ideias fica com você."
> Regras: `.specify/memory/constitution.md` (tokens de CSS, sem `style=""` novo, respeitar "menos movimento")

## O que mudou

1. **Vela que queima com o relógio** (Mantras e Firmeza, `script/inicio.js` → `velaEstado`, `aplicarVela`, `initVelaRelogio`):
   - Uma vela nova acende à 0h, às 8h e às 16h e queima por 8 horas. A altura cai de 100% a 14%.
   - Tudo sai do relógio, então todo mundo vê a mesma vela na mesma hora. A vela se atualiza a cada 15 s e quando a aba volta a aparecer.
   - **Jeito da chama**, sorteado de forma fixa a cada 1 min 30 s: calma, alta (esticada, pavio maior), dançando, dupla (duas chamas, pavio mais grosso) ou baixa.
   - **Primeiros 50 s:** a chama nasce pequena e cresce. **Últimos 12 min:** chama baixa. **Últimos 2 min:** a vela apaga, o pavio fica em brasa e sobe um fio de fumaça.
   - **Cera:** de 1 a 3 escorridos por vela, cada um em hora sorteada. A gota corre por 14 min e depois o escorrido fica, com calombo e gota endurecida, até a vela acabar. A cera também se acumula no copo do castiçal.
   - **Castiçal de latão:** prato, haste com nó e copo.
   - **Legenda discreta** (só no computador): "Acesa às 0h · 6h31 de 8h"; "A vela terminou. Outra acende às 8h."
2. **Defumação:** um defumador de barro com brasa viva e uma coluna de fumaça na abertura. Uma fumaça leve paira sobre a página inteira, e ao abrir uma defumação sobe uma baforada.
3. **Banhos:** ao abrir um banho (a hora do preparo), respingos de água aparecem na tela, alguns escorrendo, e somem em cerca de 3 s. Um toque na abertura também respinga.
4. **Tarot:**
   - Tocar na abertura embaralha as três cartas, que trocam de rosto.
   - Na tiragem de 3 cartas, as cartas chegam uma a uma e viram.
5. **Símbolos › Sigilos:** o botão "🔥 Queimar o sigilo (só na tela)" passa o sigilo para um papel em traço de carvão e o queima de baixo para cima, com borda acesa, faíscas e cinzas. Depois aparece "Entregue. ✨" e o lembrete de segurança do fogo. Combina com o item "Ativação pelo Fogo Sagrado" da própria página. Nada é salvo nem enviado.
   - O papel do ritual do portal **não** queima: lá o texto manda guardar o papel.

## Técnica

- Eventos: `catalogo.js` dispara `fv:ficha` ao abrir uma ficha.
- Animações: `embaralharCartasHero()` é global, chamada também pela tiragem. A chama usa as propriedades `scale`, `rotate` e `translate` separadas, para não brigar com o sopro do toque (spec 014).
- Menos movimento: a vela mostra o estado parado (altura e cera certas, sem animação). Fumaça, respingos e embaralho não rodam; o sigilo só mostra o aviso.
- `CACHE_VERSION` fv-v59.

## Testes (puppeteer)

- **Vela:** simulada em 7 horários (acendendo, alta, dupla, dançando, calma, baixa, apagada), com screenshots.
- **Efeitos:** respingos somem sozinhos; cartas trocam de rosto; tiragem com animação; sigilo queima e volta.
- **Celular:** sem rolagem lateral a 375 px.
- **Menos movimento:** a vela tem altura e não há fumaça na página.
- **Console:** limpo em todas as páginas testadas.
