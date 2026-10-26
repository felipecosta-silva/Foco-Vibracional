# Spec 001 — Fotos das ervas com créditos verdadeiros

> **Status:** concluída (ver review.md)
> **Pedido por:** dono do site em 2026-10-22 · **Escrita por:** Claude
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
14 das 75 ervas aparecem só com a folha desenhada, e várias delas são tóxicas (jiboia, zamioculca, abacaxi-roxo, pimenteira): **a foto ajuda a pessoa a reconhecer a planta certa**. Além disso, o site agora é público, e os créditos de foto já foram inventados duas vezes. Crédito falso em licença Creative Commons é violação de licença e quebra a regra I da constituição.

## 2. O quê
- Toda erva do catálogo mostra uma **foto real da espécie certa**.
- Na ficha da erva, logo abaixo da foto, aparece o crédito: **"Foto: autor · licença · Wikimedia Commons"**, com link para a página do arquivo.
- `images/CREDITOS.md` lista todas as fotos, e cada linha pode ser conferida.
- Existe uma ferramenta que **prova** que cada foto do site é o arquivo citado no crédito.

## 3. Histórias de uso
- **Como** visitante, **quero** ver a foto da jiboia na ficha, **para** reconhecê-la e saber que não vai em banho.
- **Como** fotógrafo do Commons, **quero** ver meu nome e a licença junto da minha foto, como a licença exige.
- **Como** supervisor, **quero** rodar um comando que confira todos os créditos, **para** não depender da palavra de ninguém.

## 4. Requisitos
- **RF-01** As 14 ervas sem foto ganham foto do Wikimedia Commons: `ora-pro-nobis`, `buganvilia`, `onze-horas`, `jasmim`, `palmeira`, `jiboia`, `zamioculca`, `pimenteira`, `babosa`, `maracuja`, `abacaxi-roxo`, `trevo-roxo`, `peregun-roxo`, `hibisco`.
- **RF-02** Autor, licença e link de **todo** crédito são lidos da API do Commons pela ferramenta. **Ninguém digita crédito à mão.**
- **RF-03** As 49 fotos da Fase 9 (seção 2 do `CREDITOS.md`) são conferidas: a foto local precisa ser visualmente o arquivo citado. Se não for, é trocada.
- **RF-04** As 12 fotos originais (arruda, guiné, alecrim, espada, manjericão, boldo, alfazema, camomila, hortelã, louro, capim-limão, jurema) **são imagens geradas por IA** (Nano Banana, do Gemini) e são **trocadas por fotos reais do Commons**. Imagem de IA pode errar detalhes da planta, e o site serve para reconhecer a erva certa.
- **RF-05** O crédito aparece na ficha da erva (painel de detalhes), abaixo da foto, com link para a página do arquivo.
- **RF-06** Só licenças livres que permitem uso: CC0, Domínio Público, CC BY e CC BY-SA (qualquer versão). **Proibido:** NC, ND e "fair use".
- **RF-07** A foto mostra a **espécie da ficha**, de preferência a parte usada (folha, flor ou bráctea), sem marca-d'água, sem pessoas e nítida. Se a ficha cita duas espécies (ex.: malagueta e biquinho), use a primeira.
- **RF-08** Cada foto tem ≤ 900 px de largura e ≤ 150 KB, com o nome `images/<id>.jpg`, e funciona offline.

## 5. Fora do escopo
- Imagens do tarot e do baralho cigano, e as fotos de fundo das páginas.
- Mudar os textos das ervas.

## 6. Critérios de aceite
- [x] **CA-01** `python tools/fotos/verificar.py` termina com **0 falhas** e lista as 75 ervas com foto conferida.
- [x] **CA-02** Abrir `plantas.html#jiboia` mostra a foto e, abaixo dela, o crédito com link que abre a página certa no Commons.
- [x] **CA-03** Nenhuma foto passa de 150 KB nem de 900 px de largura.
- [x] **CA-04** `images/CREDITOS.md` é gerado pela ferramenta e bate com os dados.
- [x] **CA-05** Offline (modo avião), as fotos novas aparecem.
- [x] **CA-06** Console limpo e sem rolagem lateral a 1440 px e a 375 px.

## 7. Dúvidas resolvidas
- **As 12 fotos originais são do dono?** Não: foram geradas por IA (Nano Banana). Resposta do dono em 2026-10-22 → trocar pelo Commons (RF-04).
