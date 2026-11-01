# Spec 003 — Fundamentos da Jurema

> **Status:** aprovada para execução, com os textos a conferir pelo dono antes de publicar
> **Pedido por:** dono do site em 2026-11-01 ("vamos montar a spec 003 (Fundamentos da Jurema), pode prosseguir sem perguntar nada")
> **Escrita por:** Claude · **Executor:** Gemini (`tasks.md`)
> **Origem do conteúdo:** a entrevista com o dono não aconteceu; ele pediu para seguir sem perguntas. Os textos trazem só o que é comum e público sobre a tradição (a árvore, a origem indígena nordestina, o encontro com o catolicismo popular e a herança africana, Mestres, Mestras, Caboclos, fumaça, maracá, a bebida sagrada e a iniciação). Tudo o que muda de casa para casa fica em aberto e vira pergunta para o iniciante levar à casa. **O dono confere e ajusta à leitura da casa** (constituição I.5 e III.4).
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
O site é feito para quem está começando na **Umbanda com Jurema**, mas não tem nenhuma página que explique o que é a Jurema.
Hoje o iniciante encontra Mestres, Mestras, cidades encantadas e a jurema-preta espalhados em pontos, fichas e no glossário, sem a base.
A trilha "Comece aqui" (spec 004) reservou um passo para isso, entre o 2 e o 3.

Riscos que a página precisa evitar:
- **Inventar fundamento.** A lista dos Reinos, quem mora em cada cidade e o ponto riscado de cada Mestre mudam de tronco para tronco (constituição I.3 e I.4). A página não traz listas: manda perguntar na casa.
- **Incentivar a bebida sagrada fora da casa.** A casca da jurema-preta tem substâncias que agem na mente e no corpo (constituição II).

## 2. O quê
- **Página nova `jurema.html` ("Fundamentos da Jurema")**, com 9 seções curtas, na ordem da RF-02.
- **Passo novo na trilha** "Comece aqui": "O que é a Jurema", entre o passo 2 e o 3. A trilha passa a ter 8 passos.
- **12 termos novos no glossário**, cada um com `id`, e um `id` na Quartinha.
- **Cuidados da ficha da jurema-preta** atualizados: não é planta de chá.
- **Portas de entrada:** menu, busca e um link na seção de Mestres e Mestras de `pontos.html`.

## 3. Histórias de uso
- **US1 (P1)** Como iniciante, quero entender o que é a Jurema e o que vou ver numa casa, para chegar à primeira sessão sem medo.
- **US2 (P1)** Como iniciante, quero saber o que não faço sozinho na Jurema (bebida sagrada e iniciação), e por quê.
- **US3 (P2)** Como iniciante, quero perguntas prontas para levar à minha casa, porque cada casa tem o seu tronco.

## 4. Requisitos

### US1 — A página (`jurema.html`)
- **RF-01** Cabeçalho:
  - Rótulo "Fundamentos" e título **"Fundamentos da Jurema"**.
  - Texto: *"O que é a Jurema, de onde ela vem e o que você vai ver numa casa de Umbanda com Jurema. É uma primeira conversa: cada casa tem o seu tronco, e o fundamento de verdade se aprende nela."*
  - Logo abaixo, um aviso (`.notice`): *"**Cada casa, um tronco.** Tronco é a linhagem de onde vem o fundamento de uma casa: os Mestres que a guiam e as casas mais antigas de onde ela nasceu. Por isso os nomes, os cantos e os preceitos mudam de uma casa para outra. Quando este site e a sua casa disserem coisas diferentes, siga a sua casa."*

- **RF-02** As seções, nesta ordem, cada uma com `id`, título `<h2>` e estes textos, sem reescrita. Na primeira vez que um termo do glossário aparece na página, ele vira link para `glossario.html#id` (constituição §0).

  **1. A árvore e a ciência** (`id="arvore"`)
  > Jurema é, primeiro, uma árvore: a jurema-preta (*Mimosa tenuiflora*), pequena e cheia de espinhos, que resiste à seca da caatinga. Dela vem o nome de uma tradição inteira. Quando alguém fala da "ciência da Jurema", fala do conjunto de saberes dessa tradição: as rezas, as ervas, a fumaça, os cantos e a relação com os Mestres e os Encantados.
  > A Jurema nasceu entre os povos indígenas do Nordeste e, ao longo dos séculos, se encontrou com o catolicismo popular e com a herança africana. Em muitos lugares ela também é chamada de Catimbó. Hoje, muitas casas cultuam a Jurema junto com a Umbanda: é a Umbanda com Jurema, a base deste site.
  - Link: "Ficha da jurema-preta" (`plantas.html#jurema-preta`).

  **2. Os Reinos e as Cidades** (`id="reinos"`)
  > Na Jurema, o mundo espiritual é contado como uma terra encantada, com reinos e cidades. Os Mestres e os Encantados moram e trabalham nessas cidades, e muitos pontos cantados falam delas.
  > Quantos são os reinos, quais são os nomes e quem mora em cada um muda de tronco para tronco. Por isso o site não traz uma lista: pergunte na sua casa como ela conta essa geografia.

  **3. Quem trabalha na Jurema** (`id="quem-trabalha"`), em lista de definição (`<dl>`):
  - **Mestres e Mestras:** espíritos de pessoas que viveram na terra, muitas delas rezadoras, raizeiras e gente do povo, que conhecem a vida de perto. Trabalham com a fumaça, a reza, as ervas e o conselho.
  - **Caboclos e Caboclas:** os Encantados das matas, ligados aos povos indígenas. Trazem a força da mata, das folhas e da flecha.
  - **As linhas da Umbanda:** na Umbanda com Jurema, a mesma casa também recebe as linhas da Umbanda, como Pretos Velhos, Baianos e Boiadeiros. Cada casa tem as suas.
  > Quem é cada Mestre, em que cidade mora e qual é o seu ponto riscado, só a sua casa e a própria entidade ensinam.
  - Link: "Pontos de Mestres e Mestras" (`pontos.html?linha=mestres`).

  **4. O que você vai ver na casa** (`id="na-casa"`), em lista de definição:
  - **Cachimbo:** a fumaça dos Mestres. Na Jurema, a fumaça é reza: ela limpa, abençoa e leva o pedido.
  - **Maracá:** o chocalho que marca o canto e chama a força.
  - **Mesa:** o lugar onde a Jurema é firmada, com toalha, velas, água e os objetos da casa. Muitas casas chamam a própria sessão de "mesa".
  - **Princesa:** uma vasilha com água que fica na mesa da Jurema. Cada casa explica o que ela guarda.
  - **Quartinha:** um pote de barro com água, que firma a casa.
  - **Ponto cantado:** a reza cantada que chama e firma a força.
  - Links: "Pontos cantados" (`pontos.html`) · "Defumação suave para casa" (`defumacao.html?objetivo=harmonizacao&intensidade=suave`).

  **5. Na sua primeira sessão** (`id="primeira-sessao"`)
  > Uma gira (a sessão em que as entidades chegam) pode parecer muita coisa de uma vez: canto, fumaça, maracá e gente incorporada. Tudo isso tem ordem. Alguns cuidados ajudam:
  - Chegue antes do começo e avise que é a sua primeira vez.
  - Vá de roupa clara e confortável, se a casa não pedir outra coisa.
  - Fique onde indicarem e ouça mais do que fala.
  - Não filme nem fotografe sem permissão.
  - Na consulta com uma entidade, pergunte com simplicidade e guarde o conselho.
  - Ninguém é obrigado a beber, fumar ou fazer o que não quer. Você pode dizer não.
  - As dúvidas vão para o(a) zelador(a) ou para um(a) cambono(a), a pessoa que ajuda as entidades e os médiuns durante a gira.

  **6. A bebida sagrada** (`id="vinho-da-jurema"`), com o selo **"Só com orientação de um(a) zelador(a)"** (constituição II.0):
  > Muitas casas preparam com a jurema-preta uma bebida sagrada, o vinho da Jurema. Ela é um sacramento: tem preparo, reza e momento próprios, e é servida só pela casa, dentro do ritual.
  - Não prepare a bebida em casa nem a compre pela internet. A casca da jurema-preta tem substâncias que agem na mente e no corpo.
  - A jurema-preta não vira chá.
  - Se você usa remédio de uso contínuo (principalmente para depressão ou ansiedade), tem problema de coração, está grávida ou amamentando: fale com o seu médico e avise a casa antes de qualquer ritual.
  - Em caso de mal-estar, ligue para o **Disque-Intoxicação: 0800 722 6001** (link `tel:08007226001`).

  **7. Ser juremado(a)** (`id="juremado"`), com o selo **"Só com orientação de um(a) zelador(a)"**:
  > Juremar-se é ser iniciado(a) na Jurema. É um compromisso com a casa e com os Mestres, feito com preceitos que só a casa ensina, no tempo dela. O site não ensina iniciação e não substitui esse caminho.

  **8. A Jurema é caridade** (`id="caridade"`)
  > A tradição da Jurema é um caminho de caridade: ajudar quem chega com reza, conselho e ervas. Desconfie de quem cobra caro para "resolver" a sua vida, promete resultado garantido, oferece amarração ou assusta você para vender um trabalho. Uma casa séria acolhe, explica e não tem pressa.

  **9. Para levar à sua casa** (`id="perguntas"`)
  > Estas perguntas ajudam a conhecer o fundamento da sua casa. Faça com calma, uma de cada vez:
  - De que tronco vem a casa?
  - Quais Mestres, Mestras e Caboclos trabalham nela?
  - Como a casa conta os Reinos e as Cidades da Jurema?
  - O que eu posso fazer em casa, e o que só se faz aqui?
  - Como devo me vestir e me comportar nas sessões?
  - Links: "Comece aqui" (`comece.html`) · "Glossário" (`glossario.html`).

- **RF-03** O conteúdo das seções 6 e 7 só **explica**. Nenhum link da página leva a prática de esquerda, a ponto riscado de entidade ou a preparo da bebida (constituição I.3 e II.0).

### US1 — Passo novo na trilha (`comece.html`)
- **RF-04** Passo novo, logo depois de "As palavras do terreiro" e antes de "Os cuidados que valem sempre", com `data-step="jurema"` (os passos antigos mantêm os seus `data-step`, para não apagar o progresso de quem já marcou):

  **O que é a Jurema**
  > A Jurema é uma árvore da caatinga e o nome de uma tradição que nasceu entre os povos indígenas do Nordeste. Os Mestres, as Mestras e os Caboclos que trabalham nela, a fumaça e os cantos são a base da Umbanda com Jurema. Antes de praticar, vale saber o que você vai ver na casa e como chegar à primeira sessão.
  - Links: "Fundamentos da Jurema" (`jurema.html`) · "Na sua primeira sessão" (`jurema.html#primeira-sessao`).
- **RF-05** A trilha passa a falar de 8 passos: o contador começa em "0 de 8", o fecho diz "Quando os oito passos…" e as descrições (`description`, `og:description`) dizem "em 8 passos".

### US1 — Glossário (`glossario.html`)
- **RF-06** Termos novos, cada um num `<details class="faq__item">` com o `id` indicado, no padrão dos outros itens:
  | `id` | Termo | Texto |
  |---|---|---|
  | `jurema` | Jurema | A árvore jurema-preta e a tradição religiosa que leva o nome dela, nascida entre os povos indígenas do Nordeste. |
  | `catimbo` | Catimbó | Outro nome para a tradição da Jurema, usado em muitos lugares do Nordeste. |
  | `tronco` | Tronco | A linhagem de onde vem o fundamento de uma casa: os Mestres que a guiam e as casas mais antigas de onde ela nasceu. |
  | `mestres` | Mestres e Mestras | Espíritos de pessoas que viveram na terra e trabalham na Jurema com fumaça, reza, ervas e conselho. |
  | `encantados` | Encantados | Seres espirituais da Jurema que vivem nas matas e nas cidades encantadas, como os Caboclos. |
  | `cidades-da-jurema` | Reinos e Cidades da Jurema | O mundo espiritual da Jurema, contado como uma terra encantada. Os nomes e a quantidade mudam de tronco para tronco. |
  | `maraca` | Maracá | Chocalho que marca o canto e chama a força na Jurema. |
  | `princesa` | Princesa | Vasilha com água que fica na mesa da Jurema. Cada casa explica o que ela guarda. |
  | `juremado` | Juremado(a) | Quem foi iniciado(a) na Jurema, com os preceitos da casa. |
  | `gira` | Gira | A sessão em que as entidades chegam, com cantos e a presença dos médiuns. |
  | `cambono` | Cambono(a) | Quem ajuda as entidades e os médiuns durante a gira e orienta quem chega. |
  | `zelador` | Zelador(a) | A pessoa que cuida da casa e orienta os filhos e quem chega. |
- **RF-07** O item "Quartinha", que já existe, ganha `id="quartinha"`.
- **RF-08** Cada termo novo termina com o link "Ler em Fundamentos da Jurema" para a seção certa de `jurema.html`, quando houver uma (`jurema`, `catimbo` e `tronco` → `#arvore`; `mestres` e `encantados` → `#quem-trabalha`; `cidades-da-jurema` → `#reinos`; `maraca` e `princesa` → `#na-casa`; `juremado` → `#juremado`; `gira` e `cambono` → `#primeira-sessao`).

### US2 — Ficha da jurema-preta (`data/ervas.js`)
- **RF-09** O campo `cuidados` de `jurema-preta` passa a ser:
  > "Não é planta de chá: a casca tem substâncias que agem na mente e no corpo. A bebida sagrada da Jurema é preparada e servida só pela casa, dentro do ritual. Na cabeça, só com orientação de um(a) zelador(a)."
- **RF-10** O campo `cabeca` passa a ser `"Só com orientação de um(a) zelador(a)"`, para usar o mesmo selo do site.

### Portas de entrada
- **RF-11** Menu: `{ label: "Fundamentos da Jurema", url: "jurema.html" }` em "Saberes" do `NAV` (`script/nucleo.js`), logo depois de "Comece aqui".
- **RF-12** Busca global (`script/busca.js`, `SEARCH_PAGES`): "Fundamentos da Jurema — árvore, Mestres e primeira sessão" (`jurema.html`), com as palavras-chave "jurema fundamentos catimbo mestres mestras caboclos encantados cidades reinos tronco maraca cachimbo princesa juremado gira primeira sessao vinho".
- **RF-13** `pontos.html`, na seção "Mestres & Mestras da Jurema": um link a mais em `.home-section__actions`, "Quem são os Mestres?" (`jurema.html#quem-trabalha`), no mesmo estilo do botão "Ver da Jurema →".

## 5. Fora do escopo
- Nomes de Mestres e Mestras, a lista dos Reinos e Cidades, pontos riscados e preceitos de iniciação. Se o dono mandar, entram numa spec futura, com a origem registrada.
- Receita ou preparo da bebida sagrada. **Nunca** entra.
- Revisar os nomes de entidades que já estão no glossário (item "As Linhas Espirituais e a Força de suas Ervas"): fica para o dono.

## 6. Critérios de aceite
- **CA-01** `jurema.html` mostra o cabeçalho, o aviso e as 9 seções na ordem, com os textos da RF-02 sem reescrita e todos os links funcionando.
- **CA-02** As seções 6 e 7 têm o selo, e nenhum link da página leva a esquerda, ponto riscado ou preparo da bebida.
- **CA-03** Na trilha, "O que é a Jurema" é o 3º passo, o contador diz "de 8", e um passo marcado antes da mudança continua marcado.
- **CA-04** `glossario.html#princesa` abre o item, e o link do item leva a `jurema.html#na-casa`.
- **CA-05** A ficha da jurema-preta mostra os cuidados novos.
- **CA-06** Menu, busca ("jurema", "catimbó", "maracá") e o link de `pontos.html` levam à página.
- **CA-07** 1440 px, 375 px e offline: console limpo, sem rolagem lateral, `jurema.html` no `PRECACHE`, `CACHE_VERSION` aumentado e página no `sitemap.xml`.
