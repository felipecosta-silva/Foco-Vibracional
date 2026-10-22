---
description: Construir (Build) uma spec executando o tasks.md
---

1. Leia, nesta ordem: `.specify/memory/constitution.md`, depois `spec.md`, `plan.md` e `tasks.md` da pasta indicada.
2. Execute as tarefas **na ordem**. Ao terminar cada uma:
   - faça um commit `feat(NNN-Txx): ...`;
   - marque `[x]` no `tasks.md` e anote o hash do commit.
3. **Não mude a spec nem o plano.** Se algo não der para fazer como planejado, pare, explique no "Registro do executor" e aguarde.
4. Rode os testes da fase final (1440 px, 375 px, offline, console limpo).
5. Preencha o "Registro do executor" e avise o dono do site para pedir a revisão ao Claude. **Não faça `git push`.**
