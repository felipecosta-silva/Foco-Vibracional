# Tarefas 008 — Contas da casa

> Spec: `spec.md`
> **Executor:** Claude, por ordem do dono do site em 2026-11-03 ("queria que você construísse"). Pela constituição, o executor seria o Gemini.

- [x] **T001** `contas.html`: cabeçalho, aviso, resumo com o mês, itens, lista de compras e cópia de segurança, com `noindex` e sem Open Graph (RF-01, RF-04, RF-06 a RF-08).
- [x] **T002** `initContas()` no fim de `script/praticas.js`, chamada no `DOMContentLoaded` de `script/inicio.js`: itens, contas, compra junta por nome, lista, copiar e compartilhar, salvar e restaurar cópia, e `localStorage` com try/catch (RF-02 a RF-10).
- [x] **T003** CSS "Spec 008" no fim de `styles/styles.css`, só com tokens.
- [x] **T004** `sw.js` (`contas.html` no `PRECACHE`, `fv-v43`). A página fica fora do `NAV`, da busca e do `sitemap.xml` (RF-11 e seção 2).
- [x] **T005** Testes (ver `review.md`).

## Registro
- 2026-11-03: T001 a T005 feitos. `script/ORDEM.md` e o cabeçalho de `praticas.js` passaram a citar as contas da casa.
