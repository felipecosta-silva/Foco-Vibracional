# Spec 014 — Luz viva nas aberturas e prática de 2 minutos da lua

> **Status:** aprovada pelo dono em 2026-11-12; pronta para o plano
> **Pedido por:** dono do site em 2026-11-12, olhando a vela da abertura de Mantras e o calendário lunar:
> - "podemos aplicar mais movimento na vela, a ideia da vela se movimentar e ter uma luz que ilumina, isso remete muito a sua luz a minha luz que pode iluminar o caminho, a escuridão… se puder aplicar isso com algo parecido nas outras páginas seria ótimo"
> - "nas fases da lua, ter afirmações ou cocriações que fazem sentido entoar nesses dias, onde você pode parar 2 minutos, limpar a mente e falar aproveitando a força da lua"
>
> **Escrita por:** Claude
> **Origem do conteúdo:** as afirmações e os passos da prática (§6 e §7) foram escritos por Claude para o site, seguindo as leituras das fases que o site já usa (`script/lua.js`) e a spec 013. **O executor não escreve texto novo.**
> Regras: `.specify/memory/constitution.md` (III.2, III.4, IV.1, IV.2, V.3, VI.1)

## Parte A — Luz viva nas aberturas

### A1. A ideia

A abertura de cada página (`.pagehead--hero`, montada por `enhancePageHead()` e `heroArtHtml()` em `script/inicio.js`) passa a ter **uma luz que vive**: ela respira, oscila e **ilumina o que está em volta**. É a imagem do dono: a sua luz e a minha luz iluminando o caminho no escuro.

### A2. A vela (Mantras e Firmeza)

- **RF-A1 Chama em camadas:** núcleo claro, chama amarela e borda alaranjada, cada camada com um ritmo próprio. O movimento não pode ser um loop mecânico igual: use 2 ou 3 animações com durações diferentes e não múltiplas (por exemplo, 2,3 s, 3,7 s e 5,9 s), para a chama nunca repetir o mesmo desenho.
- **RF-A2 Pavio** escuro visível na base da chama e **cera derretida** no topo da vela, com uma gota escorrendo de leve.
- **RF-A3 A luz que ilumina:** um halo grande atrás da vela, que **respira junto com a chama** (cresce e diminui de 4 % a 8 %). O halo esquenta o fundo da abertura e chega, bem fraco, até o título: o texto parece iluminado pela vela.
- **RF-A4 A chama responde:** no computador, quando o ponteiro passa perto, a chama se inclina para longe, como se fosse um sopro leve, e volta devagar. No celular, um toque na abertura faz a chama tremer e voltar. Nunca apaga.
- **RF-A5 Fumaça:** um fio de fumaça muito leve sobe de vez em quando (a cada 8 a 14 s) e some.

### A3. As outras aberturas (mesma linguagem: uma luz que vive)

| Página | Arte de hoje | Luz viva |
|---|---|---|
| `calendario.html` | Lua (`moon`) | **Luar:** halo frio em volta da lua que respira devagar (8 a 12 s) e um brilho que desce sobre o fundo da abertura. Estrelas piscando em ritmos diferentes (3 grupos). |
| `portais.html` | Números 11:11 (`numbers`) | **Luz que percorre o número:** um brilho dourado passa pelo contorno dos números de tempos em tempos (a cada 6 a 8 s). |
| `tarot.html` | Cartas (`cards`) | **Vela atrás das cartas:** um halo quente atrás do leque, respirando como o da vela. |
| `simbolos.html` | Geometria (`geo`) | **Pulso de luz:** o desenho continua girando e ganha um brilho que pulsa do centro para fora. |
| Páginas com foto (`banhos`, `defumacao`, `plantas`, `colheita`, `glossario`, `pontos`) | Foto | **Vaga-lumes:** a mesma camada de vaga-lumes da página inicial (`initFireflies`), mais discreta: 10 no celular, 18 no computador. |
| `defumacao.html` | Foto | Além dos vaga-lumes, **fios de fumaça** subindo devagar do pé da abertura. |
| `chas.html` | Sem abertura | Ganha a abertura **`steam`**: uma xícara desenhada em CSS com **vapor** subindo em 3 fios, e luz quente atrás. |

### A4. Regras

- **RF-A6 Movimento reduzido:** com `prefers-reduced-motion: reduce`, nada se mexe. A luz fica acesa e parada, sem vaga-lumes, sem fumaça e sem a chama reagindo ao ponteiro.
- **RF-A7 Leve:** só CSS (`transform`, `opacity`) e o canvas que já existe. Os vaga-lumes param quando a abertura sai da tela, como já acontece na página inicial. Nada de biblioteca nova.
- **RF-A8 Cores só por tokens (IV.1):** crie tokens novos no `:root` (por exemplo, `--chama-nucleo`, `--chama`, `--chama-borda`, `--luz-vela`, `--luar`, `--vapor`) e use só eles nas regras novas. Nenhum `style=""` novo (IV.2).
- **RF-A9 Leitura:** o título e o texto da abertura continuam com o mesmo contraste. A luz nunca passa por cima do texto.

## Parte B — Prática de 2 minutos da lua

### B1. Onde aparece

- **RF-B1** `calendario.html`: card novo **"Prática de 2 minutos da lua de hoje"**, logo abaixo de "Agora / Próximas fases". Ele mostra a fase de hoje, o que ela pede (§6), os 4 passos (§7), as afirmações da fase com os botões **Ouvir** (`data-speak`) e **Copiar** (`data-copy-text`), e o botão **"Começar 2 minutos"**.
- **RF-B2** Em cada cartão de "Próximas fases", uma linha a mais com a primeira afirmação daquela fase, em itálico.
- **RF-B3** Painel Hoje (`index.html`): uma linha com a afirmação da lua de hoje e o link "Fazer a prática de 2 minutos" para `calendario.html#pratica-da-lua`.

### B2. O botão "Começar 2 minutos"

- **RF-B4** Ao tocar, começa uma contagem de 2 minutos com um anel de progresso em volta de uma pequena chama (a mesma linguagem da Parte A). Os passos acendem um por vez:
  - Passo 1 e 2: de 0:00 a 0:40.
  - Passo 3: de 0:40 a 1:40.
  - Passo 4: de 1:40 a 2:00.
- **RF-B5** No fim, a chama fica parada e aparece: "Pronto. Que a luz de hoje siga com você." Se o aparelho tiver vibração, uma vibração curta. Sem som.
- **RF-B6** Botões **Pausar** e **Recomeçar**. Sair da página cancela a contagem.

### B3. Luas usadas

A fase vem de `getLiveMoonData(new Date()).key`, com 4 grupos: `nova`, `crescente`, `cheia`, `minguante` (as fases intermediárias de `script/lua.js` já caem nesses 4).

## 6. O que cada lua pede (texto final)

- 🌑 **Nova — plantar.** É o começo do ciclo: hora de decidir o que você quer ver crescer.
- 🌒 **Crescente — atrair e fazer crescer.** A luz aumenta a cada noite: boa para começar, pedir e prosperar.
- 🌕 **Cheia — agradecer e brilhar.** É a lua da plenitude: agradeça o que já floresceu.
- 🌗 **Minguante — soltar.** A luz diminui: boa para encerrar ciclos e deixar ir o que pesa.

Fecho, em texto pequeno: "Leitura popular das fases. Cada casa lê a lua de um jeito."

## 7. Os 4 passos da prática (texto final)

1. **Pare e acomode-se.** Sente-se com os pés no chão. Se puder, olhe para a lua; se não, imagine a luz dela sobre você.
2. **Limpe a mente.** Respire fundo 3 vezes, devagar. A cada vez que soltar o ar, solte também os pensamentos do dia.
3. **Fale a afirmação.** Escolha uma afirmação e diga 3 vezes, em voz alta ou baixinho, sentindo como se já fosse verdade.
4. **Agradeça.** Fique alguns instantes em silêncio e agradeça.

## 8. Afirmações de cada lua (texto final)

### 🌑 Lua Nova
- "Eu planto hoje a semente do que quero viver."
- "Eu começo de novo, com calma e com fé."
- "Meu coração sabe o que quer, e eu escuto."
- "Tudo o que eu planto com amor encontra terra boa."

### 🌒 Lua Crescente
- "A cada dia, o que é bom cresce na minha vida."
- "Eu atraio oportunidades, pessoas boas e prosperidade."
- "Meus projetos ganham força e seguem o seu caminho."
- "Eu tenho coragem para dar o próximo passo."

### 🌕 Lua Cheia
- "Eu agradeço por tudo o que já floresceu na minha vida."
- "A luz que me ilumina também ilumina quem caminha comigo."
- "Eu estou inteiro(a), iluminado(a) e em paz."
- "Eu reconheço as bênçãos de hoje."

### 🌗 Lua Minguante
- "Eu deixo ir, com gratidão, o que já não me serve."
- "Eu fico leve e abro espaço para o novo."
- "Eu encerro este ciclo em paz."
- "Eu perdoo e sigo o meu caminho com o coração tranquilo."

Linha de origem no fim do card: "Afirmações escritas para o site. Prática popular: use as palavras que fizerem sentido para você."

## 9. Dados

`data/lua-praticas.js`: `window.FV_DATA.luaPraticas = { passos: [...4 textos da §7], fases: [{ k: "nova", icone: "🌑", nome: "Lua Nova", pede: "...", afirmacoes: [...] }, ...] }`.

Se a spec 013 já tiver sido feita, o quadro "A lua do portal" continua com os textos dele; não precisa juntar os dois nesta entrega.

## 10. Critérios de aceite

- **CA-01** A vela de Mantras e de Firmeza tem chama em camadas, halo que respira e ilumina o fundo, e reage ao ponteiro e ao toque.
- **CA-02** Cada abertura da tabela A3 tem a sua luz viva; `chas.html` ganha a abertura com vapor.
- **CA-03** Com movimento reduzido ligado (emule no DevTools), nada se mexe e tudo continua legível.
- **CA-04** O card da prática mostra a lua de hoje, as 4 afirmações com Ouvir e Copiar, e a contagem de 2 minutos acende os passos na hora certa.
- **CA-05** O Hoje mostra a afirmação da lua e leva ao card.
- **CA-06** Console limpo; sem rolagem lateral a 375 px e 1440 px; funciona offline; o celular não fica lento ao rolar (confira no DevTools com CPU 4× mais lenta).
