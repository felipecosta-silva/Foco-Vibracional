# Spec 016 — Afirmação do dia alinhada com a carta do dia

> **Status:** pedida e feita em 2026-11-13 · **Escrita e executada por:** Claude
> **Pedido do dono:** "Na afirmação do dia coloque afirmações diferentes. Seria ideal que fosse alinhada com a carta do dia também. Adicione mais afirmações do dia a dia, do trabalho, de relacionamento, de amor-próprio, de confiança etc." Enviou 17 afirmações e o fecho "Está feito, está selado e assim já é. Gratidão."
> Regras: `.specify/memory/constitution.md` (III.2, III.3, IV.1, IV.2)

## O que mudou

1. **`data/afirmacoes.js`:** 12 temas e 71 afirmações: Dia a dia, Trabalho, Prosperidade, Amor e relacionamento, Amor-próprio, Confiança, Coragem e recomeço, Saúde e disposição, Intuição e espiritualidade, Proteção, Paz e equilíbrio, Gratidão e alegria. O fecho do dono e a linha de origem.
2. **Tema pela carta do dia:** cada carta do Tarot clássico aponta para um tema (arcanos maiores pelo número; menores pelo naipe, alternando: Copas entre amor-próprio e relacionamento, Ouros entre trabalho e prosperidade, Espadas entre paz e confiança, Paus entre dia a dia, coragem e saúde).
3. **"Afirmação do dia"** (no lugar de "Mantra do dia" na Home e de "Mantra de hoje" em Mantras): mostra a afirmação do tema da carta, a etiqueta do tema, "Alinhada com a carta do dia: {carta}" com link e o fecho. "Sortear outro" sorteia entre as afirmações por tema e os mantras antigos.
4. **Mantras › Afirmações:** a "Afirmação do momento" fixa deu lugar a "Afirmações por tema" (um `<details>` por tema, o tema de hoje aberto com a etiqueta "Tema de hoje", Copiar e Ouvir em cada frase).
5. **Tarot:** abaixo da carta do dia, a afirmação do dia com o link "Mais afirmações".
6. **Carta do dia embaralhada:** antes ela andava pelo baralho em ordem (Ás, Dois, Três de Copas…), o que deixaria o tema igual por duas semanas. Agora `dailyCardIndex()` salta 29 cartas por dia; continua a mesma carta o dia inteiro, na Home e no Tarot.

## Ajustes no texto do dono (constituição)

- "Eu e minha parceira" → "Eu e meu amor" (o site é para todos).
- "Nosso relacionamento é blindado" → "está protegido" (III.2: sem promessas absolutas).
- "Tenho saúde perfeita" → "Tenho saúde" (III.2), com a nota "Afirmação acompanha o tratamento, nunca substitui o médico."
- "o meu desejo sexual" → "o meu desejo"; "intimidade física" → "intimidade" (tom do site público).
- "guiado" → "guiado(a)"; acentos e concordância ("têm permissão", "diálogo", "saudáveis").

## Testes (puppeteer, 375 e 1440 px)

Home, Mantras e Tarot com a mesma afirmação e o mesmo tema da carta do dia (13/11: O Mundo → Gratidão e alegria). Dez dias simulados dão dez cartas e oito temas diferentes. 12 temas e 71 frases na aba Afirmações, tema do dia aberto. Sorteio funciona. Sem rolagem lateral; console limpo. `CACHE_VERSION` fv-v57, `data/afirmacoes.js` no `PRECACHE`.
