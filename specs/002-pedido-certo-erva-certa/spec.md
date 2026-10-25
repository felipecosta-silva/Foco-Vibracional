# Spec 002 — Pedido certo, erva certa

> **Status:** aprovada
> **Pedido por:** dono do site em 2026-10-25 (ensinamento da casa) · **Escrita por:** Claude
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
O iniciante costuma errar de duas formas:
1. **Pede de forma vaga.** "Quero prosperidade" tem muitos caminhos, e alguns ele não quer: mais dinheiro pode vir de uma demissão com indenização, ou de horas extras que tiram o tempo de aproveitar esse dinheiro. "Quero um amor": qualquer amor serve?
2. **Usa a erva errada para o pedido.** Pedir prosperidade a uma erva de corte é usar a ferramenta errada, como assar bolo dentro da geladeira.

Ensinamento da casa: **"A arruda corta, a guiné blinda e a espada guarda a porta."** Cada erva tem a sua energia específica.

## 2. O quê
- **Mapa do benzimento com ervas** no topo da página Ervas: o provérbio, a explicação e 8 grupos de função, cada um com as ervas da casa. Tocar numa erva abre a ficha dela.
- **"Como fazer um pedido bem feito"** na página de Velas (Firmeza): o princípio, os exemplos da casa, um "pedido vago x pedido bem feito" para 4 temas e um checklist curto.
- **Defumação nova: pitanga com louro**, para prosperidade. A mesma fumaça serve a 3 caminhos, e **a intenção dá a direção**: o card mostra "Escolha o seu pedido".
- As fichas de **arruda, guiné, espada-de-são-jorge e aroeira** passam a dizer a função de cada uma, como a casa ensina.

## 3. Histórias de uso
- **US1 (P1)** Como iniciante, quero ver qual erva serve para cada tipo de pedido, para não usar a ferramenta errada.
- **US2 (P1)** Como iniciante, quero exemplos de pedidos bem feitos, para firmar o pensamento sem abrir caminhos que eu não quero.
- **US3 (P2)** Como iniciante, quero uma defumação de prosperidade que eu direcione para o meu pedido específico.

## 4. Requisitos

### US1 — Mapa do benzimento com ervas (`plantas.html`, antes do catálogo)
- **RF-01** Título "Mapa do benzimento com ervas". Logo abaixo, o provérbio em destaque: *"A arruda corta, a guiné blinda e a espada guarda a porta."*
- **RF-02** Texto de abertura (use este):
  > Cada erva tem a sua energia específica. A arruda é de corte rápido: corta o mau-olhado, a inveja e o quebranto. A guiné funciona como escudo: fecha o corpo para que esse mal não volte. A espada-de-são-jorge guarda a porta da casa. A aroeira é de descarrego pesado, e só se usa quando é necessário.
  > Pedir prosperidade a uma erva de corte é usar a ferramenta errada: é como querer assar um bolo dentro da geladeira. O que muda o resultado é saber qual erva serve para cada tipo de pedido.
- **RF-03** Os 8 grupos, nesta ordem, com estas ervas (ids de `data/ervas.js`). Este mapa foi **aprovado pelo dono do site**. Não acrescente nem mova ervas.

  | Grupo | Para quê | Ervas |
  |---|---|---|
  | ✂️ Cortar | corte rápido: mau-olhado, inveja, quebranto | `arruda` |
  | 🛡️ Blindar | fechar o corpo para o mal não voltar | `guine` |
  | 🚪 Guardar a porta | vaso vivo na entrada da casa | `espada-sao-jorge`, `comigo-ninguem-pode`, `pimenteira` |
  | 🔥 Descarrego pesado | só quando é necessário | `aroeira` |
  | 🌿 Harmonizar | depois do corte, o doce | `manjericao`, `boldo`, `rosa-branca` |
  | 🌙 Acalmar | serenar a mente e o sono | `alfazema`, `camomila`, `erva-cidreira`, `maracuja` |
  | ✨ Atrair e prosperar | fartura, oportunidade, vitória | `louro`, `pitangueira`, `canela`, `girassol` |
  | 🧭 Abrir caminhos | destravar o que está parado | `abre-caminho`, `levante` |

- **RF-04** Cada erva é um chip que abre a ficha (`#id`). O grupo "Descarrego pesado" leva o selo **"Só com orientação de um(a) zelador(a)"**. O grupo "Guardar a porta" leva a nota **"Planta de vaso: não vai em banho nem no fogo"**.
- **RF-05** Fecho do bloco: *"O pedido também precisa ser certo."*, com link para `firmeza.html#pedido-bem-feito`.
- **RF-06** Atualizar as fichas, mantendo o resto do texto:
  - **`guine`:** a descrição passa a dizer que é **escudo, que fecha o corpo para o mal não voltar**. Sai "corta feitiçarias" e sai "barreira impenetrável".
  - **`arruda`:** a descrição começa por "**Erva de corte rápido**".
  - **`espada-sao-jorge`:** a descrição cita que ela **guarda a porta**.
  - **`aroeira`:** a descrição diz "**usada só quando é necessário**".

### US2 — Como fazer um pedido bem feito (`firmeza.html`, `id="pedido-bem-feito"`)
- **RF-07** Bloco novo, **antes** dos acordeões de fundamentos, aberto (não em acordeão). Texto de abertura (use este):
  > Na firmeza de pensamento, o pedido deve ser o mais específico possível, principalmente na prosperidade. "Prosperidade" tem muitos caminhos. Você quer prosperidade financeira? Mais clientes? Uma promoção?
  > Se você pede apenas "mais dinheiro no trabalho", esse dinheiro pode chegar por uma demissão com indenização, ou por um convite para fazer hora extra: você recebe mais, mas fica sem tempo para aproveitar. No amor é igual: se você pede só "um amor", aceitaria qualquer amor?
- **RF-08** Os 4 temas, cada um em um cartão com **Pedido vago** e **Pedido bem feito** (use estes textos):

  | Tema | Pedido vago | Pedido bem feito |
  |---|---|---|
  | **Prosperidade e trabalho** | "Quero mais dinheiro no trabalho." | "Peço que meu trabalho seja reconhecido e que eu receba uma promoção justa, com saúde e com tempo para aproveitar o que eu ganhar." |
  | **Prosperidade no negócio** | "Quero prosperar." | "Peço que novos clientes encontrem o meu negócio, que voltem satisfeitos e que o movimento cresça na medida em que eu dou conta." |
  | **Amor** | "Quero um amor." | "Peço um amor recíproco, que me respeite, que caminhe ao meu lado e que some à minha vida, e que eu esteja pronto(a) para recebê-lo." |
  | **Saúde** | "Quero ser curado(a)." | "Peço força para seguir o tratamento, que os médicos encontrem o melhor caminho e que meu corpo responda bem." |
  | **Casa e família** | "Quero paz em casa." | "Peço que as conversas na minha casa sejam feitas com respeito e que a gente aprenda a se escutar." |
  | **Estudos** | "Quero passar na prova." | "Peço foco e memória para estudar até o dia da prova, e calma para fazer a prova bem." |

  Nota fixa no cartão do **Amor**: *"Nunca peça uma pessoa específica contra a vontade dela: isso é amarração, e o site não ensina."*
  Nota fixa no cartão da **Saúde**: *"A firmeza soma, mas nunca substitui o médico."*
- **RF-09** Checklist **"Antes de firmar, responda"**:
  1. **O quê**, exatamente?
  2. **Para quê**: o que vai mudar na sua vida?
  3. **Em que condições**: com saúde, de forma justa, sem prejudicar ninguém?
  4. **O que você vai fazer do seu lado**, no mundo físico?
  5. Agora escreva o pedido em **uma ou duas frases claras**.
- **RF-10** No altar interativo:
  - **Placeholder do campo de pedido:** troque o texto atual ("Não há limite…") por: *"Escreva seu pedido em uma ou duas frases, o mais específico possível. Ex.: 'Peço que meu trabalho seja reconhecido e que eu receba uma promoção justa, com saúde e tempo para aproveitar.'"*
  - **Abaixo do campo**, um link: *"Como fazer um pedido bem feito"*, que leva a `#pedido-bem-feito`.

### US3 — Defumação de pitanga com louro (`data/defumacoes.js`)
- **RF-11** Registro novo `defumacao-pitanga-louro-prosperidade`:
  - `nome`: "Pitanga com Louro (Prosperidade com Direção)"
  - `objetivo`: `prosperidade`. `intensidade`: `suave`. `luas`: `crescente`, `cheia`. `dias`: `qui`, `dom`.
  - `horario`: "manhã ou fim da tarde, com a casa arrumada"
  - `ervas`: "Folhas secas de Pitangueira" e "Folhas secas de Louro"
  - `sentido`: "Da porta da rua para o fundo da casa (para atrair)"
  - `servePara`: "Prosperidade com direção. A mesma fumaça serve a três caminhos, e é a sua intenção que escolhe qual. Antes de acender, escolha o seu pedido e diga-o com clareza."
  - `reza`: "Pitanga que alegra, louro que coroa a vitória: levai o meu pedido com clareza e abri o caminho certo para ele. (Diga aqui o seu pedido específico.)"
  - `cuidados`: "Folhas bem secas, para não chiar na brasa. Turíbulo ou pires de barro, longe de cortinas, crianças e pets. Janelas entreabertas para ventilar."
- **RF-12** Campo novo e opcional `pedidos` (lista de `{ "caminho", "exemplo" }`). Quando existir, o painel da defumação mostra uma seção **"Escolha o seu pedido"** logo depois de "Para que serve". Os três desta defumação:
  - **Oportunidade e promoção:** "Peço ser lembrado(a) e chamado(a) para uma oportunidade melhor no trabalho, onde meu esforço seja reconhecido."
  - **Fartura no lar:** "Peço que o dinheiro que entra nesta casa renda, fique e não falte na mesa de ninguém aqui."
  - **Vitória e firmeza:** "Peço força para concluir o que comecei e fechar esta etapa com justiça."
  - Abaixo da lista: link "Como fazer um pedido bem feito" para `firmeza.html#pedido-bem-feito`.

## 5. Fora do escopo
- Mudar outras ervas além das 4 do RF-06.
- Criar o campo `pedidos` em outros banhos e defumações (fica para depois).
- A trilha "Comece aqui" (spec futura). Ela vai apontar para este conteúdo.

## 6. Critérios de aceite
- [ ] **CA-01** `plantas.html` mostra o mapa antes do catálogo, com os 8 grupos e as 19 ervas. Tocar em "guiné" abre a ficha da guiné.
- [ ] **CA-02** A ficha da guiné não contém "impenetrável" nem "corta feitiçarias". `grep -i impenetr data/ervas.js` não encontra nada.
- [ ] **CA-03** `firmeza.html#pedido-bem-feito` mostra o bloco com os 6 cartões e o checklist. O placeholder novo aparece no campo.
- [ ] **CA-04** `defumacao.html#defumacao-pitanga-louro-prosperidade` mostra "Escolha o seu pedido" com os 3 caminhos, e as duas ervas linkam para as fichas.
- [ ] **CA-05** A busca global por "pedido" e por "pitanga" encontra o conteúdo novo.
- [ ] **CA-06** Funciona a 1440 px e a 375 px e offline, com o console limpo e sem rolagem lateral.
