# Spec 004 — Trilha "Comece aqui"

> **Status:** aprovada
> **Pedido por:** dono do site em 2026-10-31 ("pode prosseguir com tudo") · **Escrita por:** Claude
> **Executada por:** Claude, por ordem do dono, porque a entrega é no mesmo dia (ver `tasks.md`)
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
Quem chega pela primeira vez encontra mais de 400 fichas (banhos, ervas, defumações, pontos, cartas) e não sabe por onde começar.
O risco é começar pelo que não deve: um descarrego forte, um banho na cabeça ou um trabalho de esquerda.
A constituição (§0) diz que o site serve para o iniciante **entender sem medo** e **praticar com segurança o que é de casa**.
A trilha é a porta de entrada que faz isso: 7 passos curtos, na ordem certa.

## 2. O quê
- **Página nova `comece.html` ("Comece aqui")**, com 7 passos numerados. Cada passo tem um título, o porquê em poucas linhas, os links para as práticas e um botão **"Marcar como feito"**.
- **Contador de progresso** ("N de 7 passos feitos"), guardado só no aparelho, com o botão "Recomeçar".
- Um bloco fixo **"O que o iniciante não faz sozinho"**, com o selo da constituição.
- **Portas de entrada:** um chip na capa, uma entrada no menu e um resultado na busca.
- **Âncoras no glossário** para os termos que a trilha explica. O link com `#termo` abre o item.

## 3. Histórias de uso
- **US1 (P1)** Como iniciante, quero um caminho curto e em ordem, para começar sem medo e sem pular etapas.
- **US2 (P1)** Como iniciante, quero saber o que **não** devo fazer sozinho, e por quê.
- **US3 (P2)** Como iniciante, quero marcar os passos que já fiz e voltar depois de onde parei.

## 4. Requisitos

### US1 — A trilha (`comece.html`)
- **RF-01** Cabeçalho da página:
  - Rótulo "Primeiros passos" e título **"Comece aqui"**.
  - Texto: *"Um caminho curto para os primeiros dias: o que entender antes, os cuidados que valem sempre e práticas simples de casa. Vá no seu ritmo; não precisa fazer tudo de uma vez."*
- **RF-02** Os 7 passos, nesta ordem, com estes textos e links:

  **1. O site soma, a casa ensina**
  > Este site é um guia de estudo para quem está começando na Umbanda com Jurema. Ele complementa a casa de santo, nunca a substitui. O fundamento de verdade se aprende com um(a) zelador(a), a pessoa que cuida da casa e orienta quem chega, ou com um(a) mais velho(a).
  > Cores, orixás, linhas e correspondências mudam de casa para casa. Quando o site e a sua casa disserem coisas diferentes, siga a sua casa.

  **2. As palavras do terreiro**
  > Algumas palavras aparecem em todo o site. Vale conhecer estas quatro antes de praticar:
  - **Ori:** o alto da cabeça, a parte mais sensível do corpo espiritual. Por isso ervas fortes não vão na cabeça. → `glossario.html#ori`
  - **Descarrego:** soltar cargas, aliviar o peso acumulado de cansaço e angústia. → `glossario.html#descarrego`
  - **Dois tempos:** a regra de ouro dos banhos. Primeiro se limpa, depois se fecha o corpo com ervas mansas. → `glossario.html#dois-tempos`
  - **Firmar:** ancorar o pensamento e a intenção, por exemplo numa vela acesa com recolhimento. → `glossario.html#firmar`
  - Link final: "Abrir o glossário completo" (`glossario.html`).

  **3. Os cuidados que valem sempre**
  > Antes de qualquer banho, chá, vela ou defumação:
  - Na dúvida, do pescoço para baixo. A cabeça só recebe ervas mansas, e só quando a ficha diz que pode.
  - Vela e brasa sempre sobre pires firme, longe de cortinas, crianças e pets. Nunca durma com chama acesa.
  - Pimenta nunca vai ao fogo. Planta tóxica não vira banho, chá nem defumação.
  - Leia os cuidados de cada ficha: gestantes e lactantes, crianças e pets.
  - Nada substitui o médico ou o psicólogo. Antes de buscar uma causa espiritual, descarte as físicas, como gás, fiação ou saúde.
  - Em caso de intoxicação, ligue para o **Disque-Intoxicação: 0800 722 6001** (link `tel:08007226001`).

  **4. Primeira prática: um banho leve**
  > Comece por um banho suave de calma ou de harmonização. Tome o seu banho de higiene normal e, depois, despeje o banho de ervas do pescoço para baixo, com calma. Antes, leia a ficha inteira, inclusive os cuidados de cada erva.
  > Os banhos de descarrego ficam para depois, quando você já conhecer os dois tempos, e de preferência com orientação.
  - Links: "Banhos de calma" (`banhos.html?objetivo=calma&intensidade=suave`) · "Banhos de harmonização" (`banhos.html?objetivo=harmonizacao&intensidade=suave`).

  **5. Uma defumação suave da casa**
  > A defumação leva a fumaça das ervas pelos cômodos. Para começar, escolha uma defumação doce, de harmonização, com ervas que você já conhece da cozinha, como alecrim e manjericão.
  > Use um recipiente próprio sobre pires firme, deixe as janelas abertas e mantenha crianças, pets e quem tem problema respiratório longe da fumaça.
  - Links: "Defumações de harmonização" (`defumacao.html?objetivo=harmonizacao&intensidade=suave`) · "Alecrim e manjericão" (`defumacao.html#defumacao-alecrim-manjericao-bencao`).

  **6. Firmar o pensamento**
  > Toda prática começa pela intenção. Antes de um banho ou de uma vela, saiba exatamente o que você está pedindo: um pedido vago pode abrir caminhos que você não quer.
  - Links: "Como fazer um pedido bem feito" (`firmeza.html#pedido-bem-feito`) · "Mantra de hoje" (`mantras.html`).

  **7. Acompanhe a Lua**
  > Cada fase da Lua combina com um tipo de prática: a nova com o recomeço, a crescente com atrair e crescer, a cheia com harmonizar e agradecer, e a minguante com limpar. O calendário mostra a fase de hoje, e a página Hoje sugere um banho e uma defumação para o dia.
  - Links: "Calendário Lunar" (`calendario.html`) · "Sugestões de hoje" (`index.html#hoje`).

- **RF-03** Fecho da página, **"E depois?"**:
  > Quando os sete passos já forem conhecidos, explore o site com calma: as ervas, os pontos cantados e os símbolos. E leve as suas dúvidas para a sua casa.
  - Links: "Ervas" (`plantas.html`) · "Pontos cantados" (`pontos.html`).

### US2 — O que o iniciante não faz sozinho
- **RF-04** Bloco depois do passo 7 e antes de "E depois?", com o selo **"Só com orientação de um(a) zelador(a)"** e o texto:
  > O site explica estas práticas para você entender o que vê na casa. Mas elas não se fazem sozinho, sem instrução ou sem um mais velho acompanhando:
  - Riscar ponto de entidade.
  - Chamar ou firmar entidade específica.
  - Trabalho de esquerda: velas preta e vermelha, encruzilhada, oferendas a Exu e Pombagira.
  - Banho de cabeça forte e preceitos de iniciado.
- **RF-05** Nenhum passo da trilha aponta para essas práticas (constituição II.0).

### US3 — Progresso
- **RF-06** Cada passo tem o botão "Marcar como feito", com `aria-pressed`. Feito, o passo fica marcado e o botão passa a dizer "Feito ✓".
- **RF-07** Acima dos passos aparece o contador "**N** de 7 passos feitos" (região viva, `aria-live="polite"`) e o botão "Recomeçar".
- **RF-08** O progresso fica só no aparelho (`localStorage`, chave `foco.trilha.v1`). Se o armazenamento falhar (janela anônima), a trilha funciona igual, sem guardar.

### Portas de entrada
- **RF-09** Capa (`index.html`): primeiro chip de `.hero-quick`, **"🌱 Primeira vez? Comece aqui"**, que leva a `comece.html`.
- **RF-10** Menu: entrada **"Comece aqui"** como primeiro item de "Saberes" em `NAV` (`script/nucleo.js`). Nada de HTML de menu (constituição IV.4).
- **RF-11** Busca global: resultado "Comece aqui — primeiros passos" (`comece.html`), com as palavras-chave "comece começar iniciante primeiros passos trilha inicio".
- **RF-12** Atalho do app instalado (`manifest.webmanifest`): "Comece aqui".

### Glossário
- **RF-13** Os itens Ori, Descarrego, 2 tempos e Firmar (vela) de `glossario.html` ganham, respectivamente, `id="ori"`, `id="descarrego"`, `id="dois-tempos"` e `id="firmar"`.
- **RF-14** Abrir uma página com `#id` de um `<details>` abre o item e rola até ele. Vale para qualquer página do site.

## 5. Fora do escopo
- O conteúdo da spec 003 (Fundamentos da Jurema), que ainda depende da entrevista com o dono. Quando ela existir, entra como passo novo, entre o 2 e o 3.
- Contas, nuvem ou sincronizar o progresso entre aparelhos.

## 6. Critérios de aceite
- **CA-01** `comece.html` mostra os 7 passos na ordem, com os textos da RF-02 sem reescrita e todos os links funcionando.
- **CA-02** O bloco da RF-04 tem o selo, e nenhum link da trilha leva a prática de esquerda, descarrego forte ou banho de cabeça forte.
- **CA-03** Marcar um passo atualiza o contador. Recarregar a página mantém o progresso, e "Recomeçar" zera.
- **CA-04** O chip da capa, o menu, a busca ("comece") e o atalho do app levam à trilha.
- **CA-05** `glossario.html#dois-tempos` abre o item "2 tempos".
- **CA-06** Testes a 1440 px, a 375 px e offline: console limpo, sem rolagem lateral, página no `PRECACHE`, `CACHE_VERSION` aumentado e página no `sitemap.xml`.
