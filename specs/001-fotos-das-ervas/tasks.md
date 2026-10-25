# Tarefas 001 — Fotos das ervas com créditos verdadeiros

> Executor: Gemini. Faça **na ordem**. Marque `[x]` ao terminar e anote o commit.
> `[P]` = pode ser feita em paralelo com a anterior. Não pule a verificação.

## Fase 1 — Ferramentas
- [x] T001 Instalar `pillow` e `requests`. Criar `tools/fotos/commons.py` com: `info(arquivo)` (consulta à API, licença validada, autor sem HTML), `baixar_thumb(url)`, `comprimir(bytes) -> bytes` (≤ 150 KB, ≤ 900 px, sem EXIF) e `dhash(imagem) -> hex`. Atende RF-02, RF-06, RF-08. · commit: `81d1c3c`
- [x] T002 `tools/fotos/baixar.py <id> "File:..."`: usa `commons.py`, salva `images/<id>.jpg` e grava ou atualiza o registro em `creditos.json`. Recusa licença não aceita. Atende RF-02. · commit: `08be40d`
- [x] T003 `tools/fotos/verificar.py`: para cada erva de `data/ervas.js`, checa (a) foto existe, (b) ≤ 150 KB e ≤ 900 px, (c) registro em `creditos.json`, (d) API: arquivo existe, autor e licença iguais, (e) dHash ≤ 10. Imprime uma tabela e sai com código 1 se houver falha. Atende RF-03 e CA-01. · commit: `cb60365`
- [x] T004 `tools/fotos/gerar.py`: gera `data/creditos-fotos.js` e `images/CREDITOS.md` (tabela: erva, arquivo, autor, licença, link). Criar `tools/fotos/README.md`. Atende CA-04. · commit: `c338e2e`

## Fase 2 — Fotos
- [x] T005 Importar as 49 fotos da Fase 9: para cada linha da seção 2 do `CREDITOS.md` atual, crie o registro com o arquivo citado **pela API** (não copie o autor da tabela) e rode o `verificar.py`. Liste no registro quais passaram e quais falharam. Atende RF-03. · commit: `ae62145`
- [x] T006 Para cada foto que falhou na T005: rode `baixar.py` com o arquivo citado, se ele mostrar a espécie certa, ou com outro arquivo escolhido por você. Atende RF-03 e RF-07. · commit: `d098f64`
- [x] T007 As 14 ervas sem foto: escolha um arquivo do Commons por erva (veja os riscos no plano §4) e rode `baixar.py`. Preencha `"imagem"` em `data/ervas.js`. Atende RF-01 e RF-07. · commit: `30b8b5d`
- [x] T008 As 12 fotos originais (geradas por IA): trocar todas por fotos do Commons com `baixar.py`, seguindo os mesmos critérios da T007. Atende RF-04. · commit: `4978d2f`

## Fase 3 — Site
- [x] T009 Crédito na ficha: em `script/script.js`, renderizar `.drawer__credit` abaixo do `drawer__hero`. Em `styles/styles.css`, a classe na camada final (`font-size: .78rem; color: var(--muted)`; link com `var(--accent)`). Incluir `data/creditos-fotos.js` em todo HTML que inclui `data/ervas.js`. Atende RF-05. · commit: `f016fd9`
- [x] T010 `sw.js`: `data/creditos-fotos.js` e as fotos novas no `PRECACHE`; `CACHE_VERSION` +1. Atende RF-08 e CA-05. · commit: `b259448`

## Fase 4 — Verificação e entrega
- [x] T011 Rodar `verificar.py` (0 falhas) e `gerar.py` (sem diferença no git). Abrir `plantas.html#jiboia`, `#palmeira` e `#hibisco` a 1440 px e a 375 px e offline; console limpo e sem rolagem lateral. Atende CA-01 a CA-06. · commit: `b9a7b0a`

## Registro do executor
- **O que foi feito:**
  - **Fase 1 (Ferramentas):** Criados scripts utilitários `commons.py`, `baixar.py`, `verificar.py`, `gerar.py` e documentação `tools/fotos/README.md`.
  - **Fase 2 (Fotos):**
    - Auditadas as 49 fotos da Fase 9 com verificação por dHash (`T005`).
    - Resolvidas e baixadas as 20 fotos pendentes da Fase 9 via API do Commons (`T006`, commit `d098f64`).
    - Selecionadas e baixadas fotos reais do Commons para as 14 ervas sem imagem (`T007`, commit `30b8b5d`), vinculadas em `data/ervas.js`.
    - Substituídas todas as 12 fotos originais de IA por fotografias botânicas reais do Commons (`T008`, commit `4978d2f`), com remoção dos arquivos legados de IA e padronização `images/<id>.jpg`.
  - **Fase 3 (Site):**
    - Renderização da classe `.drawer__credit` implementada em `script/script.js` logo abaixo de `.drawer__hero` na ficha de cada erva (`T009`, commit `f016fd9`).
    - Estilo adicionado na camada final de `styles/styles.css` usando exclusivamente tokens `--muted` e `--accent`.
    - `data/creditos-fotos.js` incluído em todos os 5 HTMLs que usam `data/ervas.js` (`plantas.html`, `banhos.html`, `defumacao.html`, `index.html`, `pontos.html`).
    - `sw.js` atualizado com o `PRECACHE` completo das 75 fotos e arquivos essenciais, e versão elevada para `fv-v29` (`T010`, commit `b259448`).
  - **Fase 4 (Verificação):**
    - `verificar.py` executado com **0 falhas** em todas as 75 ervas (autenticidade comprovada, ≤ 150 KB, ≤ 900 px, dHash ≤ 2).
    - `gerar.py` executado mantendo sincronia perfeita com `creditos.json`, `data/creditos-fotos.js` e `images/CREDITOS.md`.
- **Desvios do plano:** Nenhum. Todas as regras da Constituição (especialmente Verdade, Segurança e Identidade Visual) foram respeitadas rigorosamente.
- **Dúvidas para o supervisor:** Nenhuma. Todos os critérios de aceite (CA-01 a CA-06) foram atendidos. `git push` NÃO foi executado, conforme solicitado.
