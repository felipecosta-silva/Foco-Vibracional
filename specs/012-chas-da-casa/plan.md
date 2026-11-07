# Plano 012 — Chás da casa

> Spec: `specs/012-chas-da-casa/spec.md` · Executor: Gemini · Revisão: Claude

## Arquivos

| Arquivo | O que muda |
|---|---|
| `data/chas.js` | Novo. As 6 receitas da spec §4, campos da §5, texto copiado sem mudar. |
| `chas.html` | Novo. Copie a estrutura de `defumacao.html` (cabeçalho, `pagehead`, `#catalog`, scripts na mesma ordem). Troque `data/defumacoes.js` por `data/chas.js` e mantenha `data/ervas.js` e `data/banhos.js`, que a Parte 2 usa. |
| `script/nucleo.js` | `NAV`: `{ label: "Chás da casa", url: "chas.html" }` em Rituais, depois de Defumações. Carga de `FV_DATA.chas` junto das outras (veja como `DEFUMACOES` é lido). |
| `script/catalogo.js` | `chaCardHtml`, `chaDetailHtml`, `initChasPage()` com `createCatalog` e `getDrawer`, no estilo de `initDefumacaoPage`. Filtro "Momento" novo; "Para" reaproveita `OBJ_FILTER`. A Parte 2 é uma função `chasDasFichasHtml()` que lê `ERVAS` (campo `cha`) e `BANHOS` (campo `versaoCha`). Reaproveite `origemHtml`. |
| `script/inicio.js` | Chame `initChasPage()` no `DOMContentLoaded`. |
| `script/busca.js` | A busca carrega os dados sob demanda (linha com `["ervas", "banhos", "defumacoes", …].map(loadDataScript)`). Inclua `"chas"` nessa lista e um grupo "🍵 Chás" como o de "🛁 Banhos", com link para `chas.html#id`. |
| `styles/styles.css` | Só se faltar algo, no fim do arquivo e só com tokens (IV.1). Sem `style=""` novo (IV.2). |
| `sw.js` | `chas.html` e `data/chas.js` no `PRECACHE`; `CACHE_VERSION` sobe. |

## Decisões

- **Cartão:** use o mesmo componente dos rituais (`rcard`), com o objetivo, o momento ("☀️ Manhã", "🌙 Noite", "Qualquer hora") e "quente / gelado".
- **Painel:** ingredientes com `ingredientsHtml`, preparo numa `<ol class="list">`, depois Guardar, Variações, Cuidados (`dsec dsec--warn`) e Origem.
- **Aviso da RF-01:** um `<div class="notice">` em `chas.html`, acima de `#catalog`, com o texto exato da spec.
- **Regra comum (§4):** um parágrafo `muted` logo abaixo do aviso.
- **Parte 2:** `<section class="card section-gap" id="chas-das-fichas">` depois do catálogo, com dois `<details>` ("Das ervas", "Dos banhos") no estilo `.fund`. Cada item: link com o nome e um resumo de até 120 caracteres do texto do chá.
- **Hoje:** os chás não entram nas sugestões do dia nesta entrega.
