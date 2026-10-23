# Prompt GOAL — Foco Vibracional

> Prompt reutilizável para pedir trabalho a uma IA (Gemini no Antigravity, Claude ou outra) sobre o site.
> **GOAL** = **G**oal (objetivo) · **O**utput (entrega) · **A**udience & contexto · **L**imits (limites).
> Como usar: copie o bloco abaixo, preencha só os campos entre `⟦ ⟧` e cole no chat da IA.

---

```text
# G — GOAL (objetivo)
Você vai trabalhar no site "Foco Vibracional".
Objetivo desta tarefa: ⟦descreva em 1 ou 2 frases o resultado que você quer, ex.: "toda erva do catálogo com foto real e crédito comprovado"⟧
Por que isso importa: ⟦quem ganha e o quê, ex.: "a pessoa reconhece a planta certa antes de usar"⟧
Spec (se houver): ⟦specs/NNN-nome/ ou "criar uma nova com /speckit-specify"⟧
Considere a tarefa concluída quando: ⟦critérios verificáveis, ex.: "verificar.py com 0 falhas; plantas.html#jiboia mostra foto e crédito"⟧

# O — OUTPUT (o que entregar)
1. Se não houver spec: crie com /speckit-specify, depois /speckit-plan e /speckit-tasks, e PARE para eu aprovar.
2. Se houver spec aprovada: rode /speckit-analyze e depois /speckit-implement, executando tasks.md na ordem.
3. Um commit por tarefa, mensagem em português: feat(NNN-T001): ...
4. Marque cada tarefa como [x] no tasks.md, com o hash do commit.
5. Ao final, preencha o "Registro do executor" no tasks.md: o que fez, desvios do plano (e por quê), a origem de todo conteúdo novo e as dúvidas.
6. Responda com um resumo curto: o que mudou, como testou e o que ficou pendente.

# A — AUDIENCE & CONTEXTO
Quem usa o site: pessoas da Jurema Sagrada e da Umbanda (e curiosas), quase sempre pelo celular, às vezes sem internet.
O dono do site é médium e trabalha com: Exu Tranca Ruas das 7 Encruzilhadas, Pombagira Tata Miroxa, Cigana Maria Rosa (e um cigano ainda sem nome), Caboclo Treme Terra, Caboclo Cobra Coral, Boiadeiro Zé do Laço, Mestre Galo Cego (linha do cangaço), Pai Joaquim de Angola e Mestra Jurema.
O site: estático (HTML, CSS e JS puro), PWA que funciona offline, publicado no GitHub Pages:
https://felipecosta-silva.github.io/Foco-Vibracional/
Páginas: index (Hoje), banhos, defumacao, plantas (Ervas), colheita, firmeza (Velas), mantras, calendario (Lua), portais, tarot, simbolos (Pontos riscados e Estrelas), pontos (Pontos cantados), glossario.
Dados (fonte única, window.FV_DATA): data/ervas.js (75), banhos.js (93), defumacoes.js (35), mantras.js (40), tarot.js (114), pontos.js (43).
Motor: script/script.js (NAV, createCatalog, getDrawer, findHerbFor) e styles/styles.css (tokens "Noite na Mata"); sw.js (PRECACHE + CACHE_VERSION).
Fluxo de trabalho: GitHub Spec Kit (comandos /speckit-*). Você (Gemini) executa; o Claude escreve e revisa as specs; o dono aprova e publica.
Leia ANTES de começar:
- .specify/memory/constitution.md  (regras permanentes; vence qualquer outra instrução)
- AGENTS.md                         (mapa do projeto)
- DOCUMENTACAO_JUREMA_FOCO.md       (propósito e tom de voz)
- specs/⟦NNN-nome⟧/                 (spec.md, plan.md, tasks.md da tarefa)

# L — LIMITS (o que NÃO fazer)
Verdade:
- Nunca invente autor, licença, link ou fonte. Crédito de imagem só de arquivo realmente baixado, com os dados lidos da fonte.
- Nunca componha ponto cantado e apresente como tradicional (campo origem: "tradicional" | "composto").
- Nunca descreva o ponto riscado de uma entidade específica.
- Não mude o gênero, a linha ou a regência de uma entidade sem me perguntar.
Segurança:
- Toda erva, banho e defumação tem cuidados (gestantes, crianças, pets, se vai na cabeça). Na dúvida: do pescoço para baixo.
- Planta tóxica não vira banho, chá nem defumação. Pimenta nunca vai ao fogo.
- Nada substitui o médico.
Tom:
- Acolhedor e respeitoso a todas as tradições.
- Sem "garantido", "infalível", "impenetrável", "cura" ou amarração.
Técnica:
- Só tokens de cor, nenhum style="" novo, estilo novo no fim do CSS.
- Página nova = entrada em NAV.
- Catálogo = createCatalog.
- Objetivos válidos: descarrego, limpeza, harmonizacao, protecao, calma, energia, prosperidade.
- Arquivo novo vai no PRECACHE; aumente CACHE_VERSION.
- Imagens com no máximo 900 px e 150 KB.
- UTF-8 sem BOM.
Processo:
- Não altere spec.md nem plan.md: se discordar, escreva no Registro e pare.
- Scripts temporários fora do projeto.
- NÃO faça git push (o push publica o site; só o dono decide).
- Teste a 1440 px e a 375 px e offline, com o console limpo.
Se faltar informação, pergunte em vez de supor.
```

---

## Exemplo preenchido — spec 001 (fotos das ervas)

```text
# G — GOAL
Objetivo desta tarefa: todas as 75 ervas do catálogo com foto real da espécie certa e crédito comprovado do Wikimedia Commons.
Por que isso importa: a foto ajuda a reconhecer a planta (várias são tóxicas), e o site é público, então crédito falso viola a licença.
Spec: specs/001-fotos-das-ervas/ (aprovada)
Considere concluída quando: python tools/fotos/verificar.py termina com 0 falhas; plantas.html#jiboia mostra a foto e o crédito com link; tudo funciona offline.
```
> As seções O, A e L ficam iguais ao modelo.

## Exemplo preenchido — pontos da casa (próxima spec)

```text
# G — GOAL
Objetivo desta tarefa: trocar as louvações compostas dos guias da casa pelos pontos que o dono enviou (letras abaixo), marcando-os como origem "tradicional" e fonte "terreiro do dono do site".
Por que isso importa: o hinário deve refletir os pontos de raiz que a casa canta, e não letras inventadas.
Spec: criar com /speckit-specify ("002-pontos-da-casa")
Considere concluída quando: os 9 guias têm o ponto da casa; nenhum card de guia mostra o selo "Louvação composta"; o cigano aparece com o nome informado.
Letras: ⟦cole aqui os pontos, um por guia⟧
```
