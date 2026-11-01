# Plano 003 — Fundamentos da Jurema

> Spec: `spec.md` · Regras: `.specify/memory/constitution.md`

## Arquivos

| Arquivo | Mudança |
|---|---|
| `jurema.html` (novo) | Cópia da estrutura de `comece.html`: mesmo `<head>` (título "Foco Vibracional • Fundamentos da Jurema", `description`, Open Graph, `twitter:card`, canonical com `jurema.html`), `#site-header`, `<noscript>`, `<main class="wrap page">`, `#site-footer` e os 11 scripts na ordem de `script/ORDEM.md`. Dentro do `main`: o `.pagehead` com o `.notice` da RF-01 e uma `<section class="card section-gap">` por seção da RF-02, cada uma com o seu `id` e `aria-labelledby`. |
| `comece.html` | O passo novo (RF-04) e os textos de 8 passos (RF-05). |
| `glossario.html` | Os 12 termos da RF-06, juntos, logo depois do item "Linha de trabalho" e antes de "Falange"; o `id` na Quartinha (RF-07). |
| `data/ervas.js` | `cuidados` e `cabeca` da `jurema-preta` (RF-09 e RF-10). Nada mais na ficha. |
| `script/nucleo.js` | `NAV`, "Saberes": a entrada da RF-11. |
| `script/busca.js` | `SEARCH_PAGES`: a entrada da RF-12, logo depois de "Comece aqui". |
| `pontos.html` | O link da RF-13. |
| `styles/styles.css` | Só se faltar alguma coisa. Se precisar, bloco "Spec 003" no fim, só com tokens. |
| `sw.js` | `jurema.html` no `PRECACHE`, logo depois de `comece.html`, e `CACHE_VERSION` de `fv-v41` para `fv-v42`. |
| `sitemap.xml` | A URL de `jurema.html`, com `lastmod` do dia. |

## Classes que já existem (use estas)
- Seções: `card section-gap`. Aviso: `notice`. Selo: `<span class="badge-danger">Só com orientação de um(a) zelador(a)</span>`, como em `comece.html` (bloco `.trail-warn`).
- Lista de definição: `<dl class="trail-terms">` com `<div><dt>…</dt><dd>…</dd></div>`, como no passo 2 da trilha.
- Listas: `<ul class="trail-list">`. Links: `<div class="trail-links">` com `<a class="pill">`.
- Passo da trilha: copie um `<li class="trail-step card">` de `comece.html`.
- Itens do glossário: copie um `<details class="faq__item" id="…">` com `<summary><b>Termo</b></summary>` e `<p class="muted">`.

## Decisões
- **Página própria, e não um bloco da trilha.** O passo da trilha é um resumo de 3 linhas que manda para a página.
- **`data-step="jurema"` em vez de renumerar.** `initTrilha()` guarda os ids dos passos marcados; renumerar marcaria o passo errado para quem já tem progresso. O número que aparece na tela vem da ordem do `<ol>`, e o contador conta os passos do DOM, então `script/inicio.js` não muda.
- **Sem listas de Reinos, Cidades ou nomes de Mestres.** Variam por tronco e não vieram do dono (constituição I.4 e I.5). A página ensina a perguntar.
- **A bebida sagrada aparece só como aviso de segurança**, com o selo, porque o iniciante vai ouvir falar dela na casa e precisa saber que não se faz em casa.
- **Os textos são copiados da spec.** O executor não reescreve, não acrescenta seções, nomes, cantos nem fontes.
