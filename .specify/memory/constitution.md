# Constituição do Foco Vibracional

> Regras permanentes do projeto. Toda spec, plano e tarefa obedece a este arquivo.
> Em caso de conflito, **a constituição vence**. Só o dono do site muda estas regras.
> Substitui as seções 0 e 8 do antigo `PLANO_GEMINI.md`.

## 0. Para quem é o site (missão)

- **Público:** iniciantes que estão começando na **Umbanda com Jurema** (a base da casa do dono do site). Usam quase sempre pelo celular.
- **Objetivo:** que a pessoa (1) **entenda os fundamentos** sem medo e (2) **pratique no dia a dia**, com segurança, o que é de casa.
- **O site complementa a casa de santo, nunca a substitui.** O fundamento de verdade se aprende com um(a) zelador(a) ou um(a) mais velho(a).
- **Voz:** guia neutro, como um professor gentil e claro. Explica o porquê; sem primeira pessoa do dono, sem "meu filho" e sem sensacionalismo.
- **Vocabulário:** use as palavras do terreiro (Ori, axé, quizila, descarrego…) e explique cada uma na primeira vez em que aparece na página, com link para o glossário.
- **Filtro de toda melhoria:** "isso ajuda o iniciante a entender ou a praticar com segurança?"

## Papéis

| Quem | Faz |
|---|---|
| **Dono do site** | Decide o que entra, manda o conteúdo da casa (pontos, fundamentos), aprova e publica. |
| **Claude (supervisor)** | Escreve `spec.md`, `plan.md` e `tasks.md`; revisa o que foi construído; corrige detalhes; escreve `review.md`. |
| **Gemini (executor)** | Lê a spec e o plano, executa `tasks.md` na ordem, marca cada tarefa e registra o que fez. **Não muda a spec nem o plano.** |

**Fluxo (GitHub Spec Kit, no Antigravity):** `/speckit-specify` → `/speckit-clarify` (se houver dúvidas) → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement` → revisão do Claude (`review.md`).
Specs, planos e tarefas são escritos **em português**.
Cada funcionalidade vive em `specs/NNN-nome-curto/`.

## I. Verdade antes de tudo (inegociável)

1. **Nunca invente fonte, autor, licença ou link.** Crédito de imagem só de arquivo realmente baixado, com os dados lidos da própria fonte.
2. **Nunca componha ponto cantado e apresente como tradicional.** Cada ponto tem `origem: "tradicional" | "composto"`. Ponto de raiz só se for conhecido em domínio público ou se o dono do site mandar.
3. **Nunca descreva o ponto riscado de uma entidade específica.** O ponto é o "RG" da entidade, e quem explica é ela.
4. **Não troque o gênero, a linha ou a regência de uma entidade** sem confirmar com o dono do site.
5. **Conteúdo fora da spec:** registre a origem ("enviado pelo dono em…"). Se não houver origem, não entra.

## II. Segurança de quem usa o site

0. **O iniciante não faz sozinho** (sem instrução ou sem um mais velho acompanhando): riscar ponto de entidade; chamar ou firmar entidade específica; trabalho de esquerda (velas preta e vermelha, encruzilhada, oferendas a Exu e Pombagira); banho de cabeça forte e preceitos de iniciado. O site pode **explicar** essas práticas, sempre com o selo **"Só com orientação de um(a) zelador(a)"**, e elas **nunca** entram nas sugestões do dia nem na trilha "Comece aqui". Conteúdo de Candomblé ou de iniciados recebe o mesmo selo.

1. Toda erva, banho e defumação tem cuidados: toxicidade, gestantes e lactantes, crianças, pets e se vai ou não na cabeça. **Na dúvida: do pescoço para baixo.**
2. Planta tóxica (oxalatos, látex, seiva cáustica) não vira banho, chá nem defumação sem aviso em destaque. Pimenta **nunca** vai ao fogo.
3. Fogo: vela e brasa sempre sobre pires firme, longe de cortinas, crianças e pets; nunca dormir com chama acesa.
4. Nada substitui o médico. Antes de uma causa espiritual, descarte as físicas (gás, fiação, saúde).
5. Telefone de emergência quando houver risco de intoxicação: **Disque-Intoxicação 0800 722 6001**.

## III. Tom e tradição

1. Acolhedor, sem medo e sem cobrança. Respeito a Jurema, Umbanda, Candomblé, catolicismo popular, judaísmo e esoterismo.
2. **Sem promessas absolutas:** nada de "garantido", "infalível", "impenetrável", "cura" ou "o mais eficaz".
3. Nada de amarração, prejuízo a terceiros ou promessa de cura médica.
4. Correspondências (cores, orixás, linhas) variam por casa: diga isso.

## IV. Identidade visual "Noite na Mata"

1. Cores só por tokens de `styles/styles.css` (`--bg`, `--surface`, `--accent`, `--c-<objetivo>`, `--vela-*` …). **Proibido:** hex no `style=""` ou no JS; ciano `#9ef0ff`; menta `#b1ffcc`.
2. **Nenhum `style=""` novo.** Estilo novo vai no fim do CSS, na camada final.
3. Fontes locais: Fraunces (títulos) e Inter (texto).
4. Página nova = uma entrada em `NAV` (`script/script.js`), nunca HTML de menu.
5. Catálogos usam `createCatalog` e o painel `getDrawer`. Nada de grids ou paginação próprios.
6. Objetivos válidos: `descarrego`, `limpeza`, `harmonizacao`, `protecao`, `calma`, `energia`, `prosperidade`. Não invente outros.

## V. Engenharia

1. Dados em `data/*.js` (`window.FV_DATA.x = [...]`), fonte única. O site abre até por `file://`.
2. UTF-8 sem BOM. Confira os acentos no navegador.
3. **Funciona offline:** todo arquivo novo entra no `PRECACHE` do `sw.js`. A cada entrega, aumente `CACHE_VERSION`.
4. Imagens: ≤ 900 px de largura e ≤ 150 KB.
5. Scripts temporários ficam **fora do projeto**. Ferramentas que ficam vão em `tools/`.
6. Emojis com ZWJ quebram heredocs no Git Bash do Windows: grave scripts em arquivo antes de rodar.

## VI. Qualidade e entrega

1. Teste a **1440 px e a 375 px**, e **offline**. Console limpo e sem rolagem lateral.
2. Um commit por tarefa (ou grupo pequeno), mensagem em português com o id da spec: `feat(001-T03): ...`.
3. **`git push` só quando o dono disser "atualize o git".** O site é público em https://felipecosta-silva.github.io/Foco-Vibracional/, e cada push publica.

---

**Version**: 1.1.0 | **Ratified**: 2026-10-22 | **Last Amended**: 2026-10-23
