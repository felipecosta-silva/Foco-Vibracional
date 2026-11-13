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

## Revisão 1 (2026-11-13, retorno do dono com fotos de referência)

O dono não gostou da cera derretida, da chama "duplicada" (eram duas chamas separadas), do defumador (desconexo da foto) nem da xícara dos chás.

- **Vela palito nº 8:** o ciclo passou de 8 h para **4 h**, porque a vela palito nº 8 queima de 4 a 5 horas, segundo o dono. Seis velas por dia: 0h, 4h, 8h, 12h, 16h e 20h.
- **Corpo da vela em SVG** (`velaSvg`):
  - A borda é derretida e irregular: lábios mais altos nas beiradas e a poça acesa no meio.
  - De 6 a 8 escorridos por vela, espalhados pela queima. Cada um é um "dedo" de cera com calombo e gota endurecida na ponta, com sombra e brilho. A cera que chega ao pé se junta em volta da base.
  - O que estava acima do topo atual já queimou, como numa vela de verdade.
  - A luz da chama atravessa a cera do topo.
- **Jeitos da chama:**
  - **calma.**
  - **alta.**
  - **levanta e abaixa.**
  - **corrente de ar:** a chama deita para um lado e oscila.
  - **ponta bifurcada:** duas línguas que nascem juntas e se abrem no alto.
  - **baixa.**
- **Defumação:** saiu o pote. Agora há uma **neblina em fios** sobre a página inteira: duas camadas de ruído fractal (`feTurbulence`), desenhadas uma vez e deslizando devagar, mais densas no alto e no pé da tela. Ficam abaixo do cabeçalho e não pegam clique.
- **Chás:** a xícara foi redesenhada em SVG: pires, pé, asa, filete dourado, chá com reflexo e brilho na porcelana.
- `CACHE_VERSION` continua fv-v59, porque esse pacote ainda não foi publicado.

## Revisão 2 (2026-11-13, pedida pelo dono; executor: Gemini)

O dono aprovou a neblina da Defumação. Pediu mais realismo na vela e trocar a xícara por um bule de vidro. Fotos de referência: bules de vidro com chá âmbar, com rodela de laranja, flor e lavanda boiando no líquido.

1. **A vela nasce pontuda.**
   - Uma vela palito nova tem a ponta arredondada, quase cônica, com o pavio no alto.
   - Só depois de algum tempo (cerca de 30 min) a queima afunda o meio e as bordas ficam um pouco mais altas.
   - A passagem é gradual.
2. **Percepção de quem olha de lado.**
   - De lado não se enxerga a concavidade em volta do pavio, nem as bordas sendo comidas aos poucos.
   - Então a borda madura é quase reta, com lábios baixos (1,5 a 3,5 px).
   - Não há poça amarela visível: só a luz atravessando a cera do topo.
3. **A corrente de ar vem e vai.**
   - Não é um jeito sorteado a cada 1 min 30 s.
   - Cada vela tem de 0 a 3 rajadas em horas fixas (sorteio pelo relógio, igual para todos), de 4 a 20 min cada, de um lado e com uma força.
   - Durante a rajada:
     - A chama deita para o lado sorteado, e esse lado queima mais: a borda desse lado desce.
     - A vela "chora" mais por ali: 2 ou 3 escorridos extras, mais longos, nesse lado.
   - Quando a rajada acaba, a chama volta ao normal e o desgaste do lado vai sumindo aos poucos, em cerca de 15 min, até a vela voltar a queimar por igual.
   - Os escorridos que se formaram ficam até a vela acabar.
   - Rajada fraca dá pouca inclinação e pouco desgaste. Sem rajada, a vela queima por igual.
4. **Bule de vidro nos Chás** no lugar da xícara:
   - O vidro é transparente, com tampa e pegador, bico curvo e alça.
   - O chá âmbar ocupa a metade de baixo, com a superfície visível.
   - Dentro dele boiam devagar as ervas: folhas, uma flor e uma rodela.
   - O vapor sai do bico e da tampa.
5. **Teste por horário.**
   - `?vela=AAAA-MM-DDTHH:MM` na URL de Mantras ou Firmeza congela a vela nesse instante, para conferir e revisar.
   - Sem o parâmetro, nada muda.

Fora do escopo: a Defumação (aprovada), o tarot, os banhos e o sigilo. Não alterar.
