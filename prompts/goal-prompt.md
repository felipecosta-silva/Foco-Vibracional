# Prompt GOAL — Foco Vibracional

> Prompt-mestre para **guiar as melhorias do site**. Cole no Gemini (Antigravity) ou no Claude sempre que pedir algo novo.
> **GOAL** = **G**oal (objetivo) · **O**utput (entrega) · **A**udience & contexto · **L**imits (limites).
> Construído por entrevista com o dono do site em 2026-10-23. Como usar: preencha só o bloco **"TAREFA DE AGORA"** (campos `⟦ ⟧`) e cole tudo.

---

```text
# G — GOAL (objetivo)

Missão do site:
O Foco Vibracional é o companheiro de quem está COMEÇANDO a caminhar na espiritualidade da Umbanda com Jurema.
Depois de usar o site, a pessoa iniciante deve conseguir:
  1. ENTENDER OS FUNDAMENTOS sem medo: o que é a Jurema, os Mestres e as Mestras, as linhas de trabalho, a ciência das ervas e da lua.
  2. PRATICAR NO DIA A DIA, sozinha e com segurança, o que é de casa: banhos e defumações simples, firmeza de vela, orações e o tempo da lua.
O site COMPLEMENTA a casa de santo, nunca a substitui: ensina o básico e sempre lembra que o fundamento de verdade se aprende com um(a) zelador(a) ou um(a) mais velho(a) de um terreiro.

Toda melhoria deve responder a uma pergunta: "isso ajuda o iniciante a entender ou a praticar com segurança?"
Se não ajudar, não entra.

TAREFA DE AGORA:
- Objetivo: ⟦o resultado que eu quero, em 1 ou 2 frases⟧
- Por que importa para o iniciante: ⟦…⟧
- Spec: ⟦specs/NNN-nome/ (aprovada) — ou — "criar nova com /speckit-specify"⟧
- Pronto quando: ⟦critérios verificáveis⟧
- Material que eu envio (se houver): ⟦letras de pontos, textos, fotos…⟧

# O — OUTPUT (o que entregar)

1. Sem spec: crie com /speckit-specify (e /speckit-clarify se houver dúvidas), depois /speckit-plan e /speckit-tasks. PARE e me mostre para aprovar.
2. Com spec aprovada: rode /speckit-analyze e depois /speckit-implement, executando tasks.md na ordem.
3. Um commit por tarefa, em português: feat(NNN-T001): ...
4. Marque [x] em cada tarefa do tasks.md, com o hash do commit.
5. Ao final, preencha o "Registro do executor": o que fez, desvios do plano (e por quê), a ORIGEM de todo conteúdo novo e as dúvidas.
6. Responda com um resumo curto: o que mudou, como testou e o que ficou pendente.
Specs, planos, tarefas e textos do site são escritos em português do Brasil.

# A — AUDIENCE & CONTEXTO

Quem usa:
- Iniciantes da Umbanda com Jurema: pessoas que estão começando, curiosas, às vezes com medo ou com informação errada.
- Usam quase sempre pelo celular, às vezes sem internet.

Voz do site: um GUIA NEUTRO. Tom de professor gentil, calmo e claro, como um bom livro didático.
- Sem "meu filho", sem primeira pessoa do dono e sem sensacionalismo.
- Explica o PORQUÊ das coisas, não só o "como".

Vocabulário: use as palavras do terreiro (Ori, axé, quizila, descarrego, falange, firmeza, gira).
- Explique cada uma em poucas palavras na primeira vez que aparecer na página, com link para o glossário (glossario.html).
- O iniciante deve aprender o vocabulário, não ser poupado dele.

A casa do dono do site: Umbanda com Jurema. Guias com que ele trabalha:
- Exu Tranca Ruas das 7 Encruzilhadas
- Pombagira Tata Miroxa
- Cigana Maria Rosa (e um cigano ainda sem nome)
- Caboclo Treme Terra e Caboclo Cobra Coral
- Boiadeiro Zé do Laço
- Mestre Galo Cego (linha do cangaço)
- Pai Joaquim de Angola
- Mestra Jurema

O site:
- Estático (HTML, CSS e JS puro), PWA offline, no GitHub Pages: https://felipecosta-silva.github.io/Foco-Vibracional/
- Páginas: index (Hoje), banhos, defumacao, plantas (Ervas), colheita, firmeza (Velas), mantras, calendario (Lua), portais, tarot, simbolos (Pontos riscados e Estrelas), pontos (Pontos cantados), glossario.
- Dados (window.FV_DATA): data/ervas.js (75), banhos.js (93), defumacoes.js (35), mantras.js (40), tarot.js (114), pontos.js (43).
- Motor: script/script.js (NAV, createCatalog, getDrawer, findHerbFor), styles/styles.css (tokens "Noite na Mata") e sw.js (PRECACHE + CACHE_VERSION).

Fluxo: GitHub Spec Kit (/speckit-*). O Gemini executa, o Claude escreve e revisa as specs, e o dono aprova e publica.

Rumo combinado (próximas specs, nesta ordem):
  001 Fotos das ervas com créditos verdadeiros (em andamento)
  002 Fundamentos da Jurema para iniciantes: o que é a Jurema, a árvore, os Mestres e as Mestras, as cidades encantadas, a ciência, o que é uma gira e como se portar
  003 Trilha "Comece aqui": a porta de entrada do iniciante, o caminho dos primeiros dias, apontando para os fundamentos e para práticas de casa
  004 Revisão para iniciante: marcar em todo o site o que é "Pode fazer em casa" e o que é "Só com orientação"
  005 Pontos da casa: trocar as louvações compostas pelos pontos reais dos guias (quando o dono enviar as letras)

Leia ANTES de começar:
- .specify/memory/constitution.md (regras permanentes; vence qualquer outra instrução)
- AGENTS.md (mapa do projeto)
- DOCUMENTACAO_JUREMA_FOCO.md (propósito e tom)
- specs/⟦NNN-nome⟧/ (spec.md, plan.md e tasks.md da tarefa)

# L — LIMITS (o que NÃO fazer)

O iniciante NÃO faz sozinho (sem instrução ou sem um mais velho acompanhando):
- Riscar ponto de entidade.
- Chamar ou firmar entidade específica.
- Trabalho de esquerda: velas preta e vermelha, encruzilhada, oferendas a Exu e Pombagira.
- Banho de cabeça forte ou de descarrego na cabeça, e preceitos de iniciado.
→ O site pode EXPLICAR essas coisas, mas sempre com o selo "Só com orientação de um(a) zelador(a)", e elas nunca aparecem nas sugestões do dia nem na trilha "Comece aqui".
→ Conteúdo de Candomblé ou de iniciados (ex.: Ajébó de Xangô) fica no site com esse mesmo selo.

Verdade:
- Nunca invente autor, licença, link ou fonte. Crédito de imagem só de arquivo realmente baixado, com dados lidos da fonte.
- Nunca componha ponto cantado e apresente como tradicional (campo origem: "tradicional" | "composto").
- Nunca descreva o ponto riscado de uma entidade específica.
- Não mude o gênero, a linha ou a regência de uma entidade sem perguntar ao dono.
- Fundamento novo só com fonte (dono do site, autor citado ou tradição oral reconhecida). Sem fonte, não entra.

Segurança:
- Toda erva, banho e defumação tem cuidados: gestantes, crianças, pets e se vai na cabeça. Na dúvida: do pescoço para baixo.
- Planta tóxica não vira banho, chá nem defumação. Pimenta nunca vai ao fogo. Vela e brasa sempre sobre pires, longe de cortinas, crianças e pets.
- Nada substitui o médico ou o psicólogo. Disque-Intoxicação: 0800 722 6001.

Tom:
- Acolhedor, sem medo e sem cobrança.
- Sem "garantido", "infalível", "impenetrável" ou "cura".
- Nada de amarração ou de prejuízo a alguém.
- Correspondências variam por casa: diga isso.

Técnica:
- Só tokens de cor, nenhum style="" novo, estilo novo no fim do CSS.
- Página nova = entrada em NAV.
- Catálogo = createCatalog.
- Objetivos válidos: descarrego, limpeza, harmonizacao, protecao, calma, energia, prosperidade.
- Arquivo novo vai no PRECACHE, e CACHE_VERSION sobe a cada entrega.
- Imagens com no máximo 900 px e 150 KB.
- UTF-8 sem BOM.

Processo:
- Não altere spec.md nem plan.md: se discordar, escreva no Registro e pare.
- Scripts temporários fora do projeto.
- NÃO faça git push: o push publica o site, e só o dono decide.
- Teste a 1440 px e a 375 px e offline, com o console limpo.
- Se faltar informação, PERGUNTE em vez de supor.
```

---

## Exemplo do bloco "TAREFA DE AGORA" — spec 001 (em andamento)

```text
TAREFA DE AGORA:
- Objetivo: todas as 75 ervas com foto real da espécie certa e crédito comprovado do Wikimedia Commons.
- Por que importa para o iniciante: a foto ensina a reconhecer a planta, e várias são tóxicas.
- Spec: specs/001-fotos-das-ervas/ (aprovada)
- Pronto quando: python tools/fotos/verificar.py com 0 falhas; plantas.html#jiboia mostra a foto e o crédito; tudo funciona offline.
- Material que eu envio: nenhum.
```

## Exemplo do bloco "TAREFA DE AGORA" — spec 002 (próxima)

```text
TAREFA DE AGORA:
- Objetivo: uma seção "Fundamentos da Jurema" que explique ao iniciante o que é a Jurema, a árvore sagrada, os Mestres e as Mestras, as cidades encantadas, o que é uma gira e como se portar num terreiro.
- Por que importa para o iniciante: sem a base, as práticas de casa ficam soltas e cheias de medo.
- Spec: criar nova com /speckit-specify ("002-fundamentos-da-jurema")
- Pronto quando: o iniciante lê em até 10 minutos; cada termo técnico tem explicação e link para o glossário; o texto lembra que o site complementa a casa.
- Material que eu envio: ⟦o que a sua casa ensina sobre cada tema, se quiser⟧
```
