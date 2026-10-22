# Tarefas 001 — Fotos das ervas com créditos verdadeiros

> Executor: Gemini. Faça **na ordem**. Marque `[x]` ao terminar e anote o commit.
> `[P]` = pode ser feita em paralelo com a anterior. Não pule a verificação.

## Fase 1 — Ferramentas
- [ ] T001 Instalar `pillow` e `requests`. Criar `tools/fotos/commons.py` com: `info(arquivo)` (consulta à API, licença validada, autor sem HTML), `baixar_thumb(url)`, `comprimir(bytes) -> bytes` (≤ 150 KB, ≤ 900 px, sem EXIF) e `dhash(imagem) -> hex`. Atende RF-02, RF-06, RF-08. · commit: ``
- [ ] T002 `tools/fotos/baixar.py <id> "File:..."`: usa `commons.py`, salva `images/<id>.jpg` e grava ou atualiza o registro em `creditos.json`. Recusa licença não aceita. Atende RF-02. · commit: ``
- [ ] T003 `tools/fotos/verificar.py`: para cada erva de `data/ervas.js`, checa (a) foto existe, (b) ≤ 150 KB e ≤ 900 px, (c) registro em `creditos.json`, (d) API: arquivo existe, autor e licença iguais, (e) dHash ≤ 10. Imprime uma tabela e sai com código 1 se houver falha. Atende RF-03 e CA-01. · commit: ``
- [ ] T004 `tools/fotos/gerar.py`: gera `data/creditos-fotos.js` e `images/CREDITOS.md` (tabela: erva, arquivo, autor, licença, link). Criar `tools/fotos/README.md`. Atende CA-04. · commit: ``

## Fase 2 — Fotos
- [ ] T005 Importar as 49 fotos da Fase 9: para cada linha da seção 2 do `CREDITOS.md` atual, crie o registro com o arquivo citado **pela API** (não copie o autor da tabela) e rode o `verificar.py`. Liste no registro quais passaram e quais falharam. Atende RF-03. · commit: ``
- [ ] T006 Para cada foto que falhou na T005: rode `baixar.py` com o arquivo citado, se ele mostrar a espécie certa, ou com outro arquivo escolhido por você. Atende RF-03 e RF-07. · commit: ``
- [ ] T007 As 14 ervas sem foto: escolha um arquivo do Commons por erva (veja os riscos no plano §4) e rode `baixar.py`. Preencha `"imagem"` em `data/ervas.js`. Atende RF-01 e RF-07. · commit: ``
- [ ] T008 As 12 fotos originais (geradas por IA): trocar todas por fotos do Commons com `baixar.py`, seguindo os mesmos critérios da T007. Atende RF-04. · commit: ``

## Fase 3 — Site
- [ ] T009 Crédito na ficha: em `script/script.js`, renderizar `.drawer__credit` abaixo do `drawer__hero`. Em `styles/styles.css`, a classe na camada final (`font-size: .78rem; color: var(--muted)`; link com `var(--accent)`). Incluir `data/creditos-fotos.js` em todo HTML que inclui `data/ervas.js`. Atende RF-05. · commit: ``
- [ ] T010 `sw.js`: `data/creditos-fotos.js` e as fotos novas no `PRECACHE`; `CACHE_VERSION` +1. Atende RF-08 e CA-05. · commit: ``

## Fase 4 — Verificação e entrega
- [ ] T011 Rodar `verificar.py` (0 falhas) e `gerar.py` (sem diferença no git). Abrir `plantas.html#jiboia`, `#palmeira` e `#hibisco` a 1440 px e a 375 px e offline; console limpo e sem rolagem lateral. Atende CA-01 a CA-06. · commit: ``

## Registro do executor
> Preencha ao final: o que foi feito, quais fotos foram trocadas na T006 (e por quê), desvios do plano e dúvidas para o supervisor.
