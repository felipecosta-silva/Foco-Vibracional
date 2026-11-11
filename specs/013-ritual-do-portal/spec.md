# Spec 013 — Ritual do portal: vela, papel e lua

> **Status:** aprovada pelo dono em 2026-11-11 ("seria bom termos isso tb no site, com sugestões e etc"); pronta para o plano
> **Pedido por:** dono do site em 2026-11-11, dia do portal 11/11 em lua crescente. Mandou um texto com dicas para escrever no papel durante o ritual de portal e vela, e afirmações para o casal.
> **Escrita por:** Claude
> **Origem do conteúdo:**
> - As dicas de escrita, o passo a passo e as afirmações de **amor, intimidade, proteção do casal e limites** foram **adaptadas do texto enviado pelo dono em 11/11/2026**. O texto era pessoal ("minha parceira", a família do casal); no site, tudo vira geral.
> - As afirmações dos outros temas e o quadro das luas foram escritos por Claude, seguindo as leituras que o site já usa (`script/lua.js`, `script/portais.js` e "Como fazer um pedido bem feito" em `firmeza.html`).
> - **O executor não escreve texto novo:** todos os textos estão aqui.
> Regras: `.specify/memory/constitution.md` (II.3, III.2, III.3, III.4)

## 1. Por quê

A página **Portais & Números** (`portais.html`) já mostra quando é portal e o tema de cada mês. Mas não ensina **o que fazer** no dia: como montar a vela, o que escrever no papel, o que cada lua pede. O iniciante chega no 11/11 sem saber por onde começar.

## 2. O quê

1. **Seção nova em `portais.html`:** "Ritual do portal: vela e papel" (`id="ritual-do-portal"`), logo depois do bloco "Próximos portais / Hoje é portal?".
2. **"Hoje é portal?"** mostra também a lua do dia e o que ela pede (§4), com um link "Ver o ritual do portal" para `#ritual-do-portal`.
3. **Painel Hoje (`index.html`):** no dia de portal, o texto do portal ganha o mesmo link para `portais.html#ritual-do-portal`.

## 3. Requisitos

- **RF-01** Abertura da seção:
  > Nos dias de portal (01/01, 02/02… 12/12), muita gente aproveita a data para firmar um pedido. O jeito mais simples é uma vela e um papel escrito à mão. É uma prática popular, simbólica: o que move o pedido é a sua intenção, a sua fé e o passo que você dá depois.
- **RF-02** Bloco **"A lua do portal"**: as 4 leituras da §4, com a lua de hoje destacada. Fecho: "Cada casa lê a lua de um jeito. Na dúvida, siga a sua."
- **RF-03** Bloco **"Como escrever"**, com as regras da §5.
- **RF-04** Bloco **"Passo a passo"**, com a lista numerada da §6, incluindo os cuidados com o fogo.
- **RF-05** Bloco **"Sugestões para escrever"**: os 9 temas da §7, cada um num `<details>`, com as afirmações e um botão **Copiar** por afirmação (use o `data-copy-text` que já existe em `script/nucleo.js`).
- **RF-06** Linha de origem no fim da seção (§8).
- **RF-07** Nenhuma promessa (III.2): sem "garantido", "infalível", "blindado", "o universo vai te dar".
- **RF-08** Afirmações de amor só sobre **a própria pessoa** ou **o casal que já existe**. Nada que mire a vontade, o sentimento ou a escolha de outra pessoa (III.3).

## 4. A lua do portal (texto final)

| Lua | O que pede | No papel |
|---|---|---|
| 🌑 **Nova** | Plantar. É o começo do ciclo: hora de decidir o que você quer ver crescer. | Escreva o que você quer começar. |
| 🌒 **Crescente** | Pedir e fazer crescer. A luz aumenta a cada noite: boa para atrair, começar projetos e prosperidade. | Escreva o que você quer atrair e ver crescer. |
| 🌕 **Cheia** | Agradecer e fortalecer. É a lua da plenitude. | Escreva o que você agradece e o que quer manter forte. |
| 🌗 **Minguante** | Soltar. A luz diminui: boa para encerrar ciclos e deixar ir o que pesa. | Escreva o que você deixa ir, ainda em frase positiva: "Eu deixo ir, com gratidão, o que já não me serve, e fico leve." |

A lua de hoje vem de `getLiveMoonData(new Date()).key` (`nova`, `crescente`, `cheia`, `minguante`). Destaque a linha dela com a etiqueta "Hoje".

## 5. Como escrever (texto final)

- **No presente**, como se já fosse verdade: "Meu trabalho é reconhecido", e não "um dia meu trabalho vai ser reconhecido".
- **Em tom positivo:** escreva o que você quer, não o que você quer evitar. Em vez de "não brigamos mais", escreva "nossa casa é cheia de paz".
- **Específico:** diga o caminho que você quer. Veja "Como fazer um pedido bem feito", na Firmeza (link para `firmeza.html#pedido-bem-feito`).
- **Sobre você e sobre o que é seu.** Não escreva para mudar o sentimento ou a escolha de outra pessoa: isso não é pedido, é amarração.
- **Poucas frases:** um tema por papel, de 3 a 5 afirmações.

## 6. Passo a passo (texto final)

1. **Prepare o lugar:** um pires firme, a vela, um papel liso e caneta ou lápis. A cor da vela pode seguir a intenção: veja "O significado das cores", na Firmeza (link para `firmeza.html`).
2. **Respire e centre-se:** feche os olhos por alguns instantes e sinta o alívio de já ter o que você vai pedir.
3. **Escreva à mão,** com calma, sentindo cada palavra.
4. **Dobre o papel e coloque embaixo do pires da vela.** O papel fica por baixo do pires, nunca encostado na vela, na chama ou na cera. Vela de 7 dias, sempre em prato fundo.
5. **Acenda a vela,** leia as frases em voz alta e agradeça.
6. **Dê um passo real:** uma ação pequena, no mesmo dia, na direção do que você escreveu.
7. **Quando a vela terminar,** guarde o papel num lugar seu, como uma gaveta pessoal, ou dobre e leve na carteira.

**Cuidados com o fogo:** longe de cortinas, crianças e pets; nunca durma nem saia de casa com a vela acesa (II.3).

## 7. Sugestões para escrever (texto final)

### Amor e casal
- "Nosso amor se renova, se aprofunda e se fortalece a cada dia, com respeito e carinho."
- "Somos um time unido, ligados por afeto sincero, admiração e conversa aberta."
- "Nossa casa é cheia de paz, harmonia, leveza e companheirismo."

### Intimidade e paixão do casal
- "Minha energia vital flui com liberdade e vigor."
- "Nossa intimidade é carinhosa, segura e cheia de desejo dos dois lados."
- "Estamos à vontade um com o outro, ligados no corpo e na alma."

### Proteção do casal
- "Nosso relacionamento está envolvido em luz e protegido no amor."
- "Na nossa vida a dois entram a luz, a verdade, a alegria e a prosperidade."
- "Todo pensamento contrário ao nosso bem se transforma em paz."

### Limites e espaço do casal
- "Nosso relacionamento tem limites saudáveis, firmes e respeitados por todos."
- "Cuidamos do nosso espaço a dois com maturidade, clareza e independência."
- "A convivência com a família acontece no tempo certo, respeitando a nossa privacidade e as nossas escolhas."

### Amor-próprio
- "Eu me amo, me respeito e mereço um amor recíproco."
- "Meu coração está aberto para um amor que soma, com respeito e alegria."
- "Eu sou inteiro(a) e feliz na minha própria companhia."

### Prosperidade e trabalho
- "Meu trabalho é reconhecido e bem pago, e eu tenho saúde e tempo para aproveitar o que ganho."
- "O dinheiro chega até mim por caminhos justos e abençoados."
- "Minhas contas estão em dia, e sobra para guardar e para partilhar."

### Caminhos e propósito
- "Eu sei qual é o meu propósito e caminho nele com coragem."
- "Os caminhos certos se abrem para mim, no tempo certo."
- "Eu reconheço os sinais e as oportunidades que chegam até mim."

### Saúde e disposição
- "Eu cuido do meu corpo com carinho, e ele me responde com força."
- "Tenho disposição e energia para viver bem o meu dia."
- "Meu sono é tranquilo e o meu descanso é profundo."
- Nota do tema: "Afirmação acompanha o tratamento, nunca substitui o médico."

### Paz interior
- "Minha mente está serena e meu coração está em paz."
- "Eu respiro com calma e confio no meu caminho."
- "A paz mora em mim e no meu lar."

## 8. Linha de origem

> **Origem:** dicas e afirmações do casal adaptadas de um texto enviado pelo dono do site em 11/11/2026; os outros temas foram escritos para o site. Prática popular: confira com a sua casa.

## 9. Campos de `data/portal.js`

`window.FV_DATA.portalRitual = { luas: [...], temas: [...] }`

- `luas`: `{ k: "crescente", icone: "🌒", nome: "Crescente", pede: "...", papel: "..." }` (§4)
- `temas`: `{ k: "amor", titulo: "Amor e casal", afirmacoes: ["...", "..."], nota: "..." }` (§7; `nota` só em Saúde)

As regras da §5 e o passo a passo da §6 ficam em HTML fixo em `portais.html` (como a Leitura da vela em `firmeza.html`).

## 10. Critérios de aceite

- **CA-01** A seção aparece em `portais.html` com os textos desta spec, sem palavra nova.
- **CA-02** A lua de hoje aparece destacada no quadro das luas e no card "Hoje é portal?".
- **CA-03** Cada afirmação tem um botão Copiar que funciona.
- **CA-04** No dia de portal, o Hoje (`index.html`) leva ao ritual.
- **CA-05** Funciona offline; console limpo; sem rolagem lateral a 375 px e 1440 px.
