# Tarefas 017 · Revisão 2

> Spec: `spec.md`, seção "Revisão 2". Plano: `plan.md`.
> - Faça um commit por tarefa: `fix(017-T00N): ...`.
> - **Não faça `git push`.**
> - Use `git add` com os arquivos certos, nunca `-A`.

- [ ] T001 Teste por horário: `?vela=AAAA-MM-DDTHH:MM` em `initVelaRelogio` (plano D). Faça primeiro, porque é a ferramenta para conferir as outras tarefas.
- [ ] T002 Em `velaEstado` (plano A):
  - acrescentar `forma`, `ventos`, `vento` e `desgaste`;
  - o modo `vento` só aparece durante uma rajada;
  - escorridos de base mais os escorridos de cada rajada.
- [ ] T003 Em `velaSvg` (plano B):
  - a ponta passa de pontuda a madura;
  - lábios baixos;
  - o lado gasto conforme o desgaste;
  - sem `vc-poca`;
  - `--ponta` no pavio, na chama e no halo.
- [ ] T004 Chama na corrente de ar com `--vento-lado` e `--vento-forca` (plano C).
- [ ] T005 Bule de vidro (plano E): chá, ervas boiando e vapor no bico e na tampa. Remover a xícara.
- [ ] T006 Testes. Com `?vela=`, ache um ciclo que tenha rajada (registre no console as horas de `ventos`). Confira a 1440 px e a 375 px, com uma captura de cada momento:
  - aos 2 min, aos 15 min e aos 40 min, para ver a ponta virando borda;
  - durante uma rajada;
  - logo depois da rajada;
  - 30 min depois da rajada, quando a vela já queima por igual de novo, mas os escorridos daquele lado continuam;
  - no fim, com a vela apagada;
  - a página de Chás;
  - com "menos movimento" ligado.

  Em mantras, firmeza e chas, o console deve ficar limpo e sem rolagem lateral.

## Registro do executor

Preencha:
- o que fez;
- os desvios do plano e por quê;
- as datas de `?vela=` usadas nos testes;
- as dúvidas.
