# Plano 002 — Pedido certo, erva certa

> Implementa `spec.md`. Regras: `.specify/memory/constitution.md`

## 1. Abordagem
Conteúdo da casa, com textos já definidos na spec: **copie os textos sem reescrever**, só ajustando a pontuação se precisar. O mapa vem de **uma constante única** no JS, sem HTML repetido. A defumação ganha um campo opcional `pedidos`, genérico, para poder ser usado depois em outros rituais.

## 2. Arquivos tocados
| Arquivo | Mudança |
|---|---|
| `script/script.js` | `const MAPA_ERVAS = [...]` (8 grupos: `k`, `icone`, `titulo`, `paraQue`, `ids`, `selo?`, `nota?`) e `initMapaErvas()`, chamada em `plantas.html`. O painel da defumação renderiza `d.pedidos` (seção "Escolha o seu pedido"). Busca global: incluir o texto de `pedidos`. |
| `plantas.html` | `<section id="mapa-ervas" class="mapa-ervas">` antes do `#catalog`, com o título, o provérbio, o texto do RF-02, um container `[data-mapa-ervas]` (preenchido pelo JS) e o fecho do RF-05. |
| `firmeza.html` | `<section id="pedido-bem-feito" class="pedido">` antes de `.fund`, com os 6 cartões (`.pedido__card`, com `.pedido__vago` e `.pedido__bom`), as 2 notas e o checklist (`<ol class="pedido__check">`). Placeholder novo no `#inputIntencao` e link abaixo dele. |
| `data/ervas.js` | Descrições de `guine`, `arruda`, `espada-sao-jorge` e `aroeira` (RF-06). |
| `data/defumacoes.js` | Registro `defumacao-pitanga-louro-prosperidade` (RF-11 e RF-12). |
| `styles/styles.css` | Na camada final: `.mapa-ervas`, `.mapa-ervas__proverbio`, `.mapa-grupo`, `.mapa-chip`, `.pedido`, `.pedido__card`, `.pedido__vago` (cor `var(--muted)`, sem riscado), `.pedido__bom` (borda `var(--accent2)`), `.pedido__check`, `.ritual-pedidos`. Selo: reutilize a classe de selo/alerta que já existe (procure `badge-danger` ou `.notice`). |
| `sw.js` | `CACHE_VERSION` +1 (nenhum arquivo novo). |

## 3. Dados / formatos
```js
// script/script.js
const MAPA_ERVAS = [
  { k: "cortar",     icone: "✂️", titulo: "Cortar",            paraQue: "Corte rápido: mau-olhado, inveja, quebranto", ids: ["arruda"] },
  { k: "blindar",    icone: "🛡️", titulo: "Blindar",           paraQue: "Fechar o corpo para o mal não voltar",        ids: ["guine"] },
  { k: "porta",      icone: "🚪", titulo: "Guardar a porta",   paraQue: "Vaso vivo na entrada da casa",                ids: ["espada-sao-jorge", "comigo-ninguem-pode", "pimenteira"], nota: "Planta de vaso: não vai em banho nem no fogo." },
  { k: "descarrego", icone: "🔥", titulo: "Descarrego pesado", paraQue: "Só quando é necessário",                      ids: ["aroeira"], selo: "Só com orientação de um(a) zelador(a)" },
  { k: "harmonizar", icone: "🌿", titulo: "Harmonizar",        paraQue: "Depois do corte, o doce",                     ids: ["manjericao", "boldo", "rosa-branca"] },
  { k: "acalmar",    icone: "🌙", titulo: "Acalmar",           paraQue: "Serenar a mente e o sono",                    ids: ["alfazema", "camomila", "erva-cidreira", "maracuja"] },
  { k: "atrair",     icone: "✨", titulo: "Atrair e prosperar", paraQue: "Fartura, oportunidade, vitória",             ids: ["louro", "pitangueira", "canela", "girassol"] },
  { k: "caminhos",   icone: "🧭", titulo: "Abrir caminhos",    paraQue: "Destravar o que está parado",                 ids: ["abre-caminho", "levante"] }
];
```
- `initMapaErvas()`: para cada id, busca a erva em `ERVAS` e mostra o nome curto (`splitName(e.nome)[0]`). O chip é um `<a href="#id">`, que o catálogo já abre no painel. **Se um id não existir, `console.warn` e pula** (nunca quebra).
- Emojis com ZWJ: escreva o arquivo pela ferramenta de edição, não por heredoc (constituição V.6).
- `pedidos` na defumação:
  ```json
  "pedidos": [
    { "caminho": "Oportunidade e promoção", "exemplo": "Peço ser lembrado(a) e chamado(a) para uma oportunidade melhor no trabalho, onde meu esforço seja reconhecido." },
    { "caminho": "Fartura no lar", "exemplo": "Peço que o dinheiro que entra nesta casa renda, fique e não falte na mesa de ninguém aqui." },
    { "caminho": "Vitória e firmeza", "exemplo": "Peço força para concluir o que comecei e fechar esta etapa com justiça." }
  ]
  ```
  Renderização: `<div class="dsec ritual-pedidos"><h3>Escolha o seu pedido</h3><ul>…<li><b>caminho</b> “exemplo”</li>…</ul><a href="firmeza.html#pedido-bem-feito">Como fazer um pedido bem feito →</a></div>`, sempre com `escapeHtml`.

## 4. Riscos e cuidados
- **Não reescreva os textos da casa** (RF-02, RF-07, RF-08, RF-12): eles vêm do dono do site.
- `boldo` está no grupo Harmonizar por decisão do dono. Não "corrija".
- O mapa fica **antes** do catálogo, mas deve ser compacto no celular: grupos em grade de 2 colunas a ≥ 700 px e 1 coluna abaixo disso, com chips que quebram linha.
- O link `#pedido-bem-feito` vindo de outra página precisa rolar até o bloco (é âncora HTML comum; confira que nenhum script de abas engole o hash).

## 5. Checagem da constituição
- [x] **I. Verdade:** o conteúdo e o mapa vêm do dono do site (2026-10-25).
- [x] **II. Segurança:** aroeira com selo; plantas de vaso com aviso; saúde sem substituir o médico; amor sem amarração; brasa com cuidados.
- [x] **III. Tom:** guia neutro; "impenetrável" sai da guiné.
- [x] **IV. Visual:** classes na camada final, tokens, sem `style=""`.
- [x] **V. Engenharia:** constante única, sem arquivo novo, `CACHE_VERSION` +1.
- [x] **VI. Qualidade:** testes nos dois tamanhos e offline.

## 6. Como verificar
- **CA-01:** abrir `plantas.html`, contar 8 grupos e 19 chips, tocar em "Guiné" e ver a ficha abrir.
- **CA-02:** `grep -i -E "impenetr|corta feitiçarias" data/ervas.js` não devolve a guiné (o ideal é não devolver nada).
- **CA-03:** abrir `firmeza.html#pedido-bem-feito`.
- **CA-04:** abrir `defumacao.html#defumacao-pitanga-louro-prosperidade`.
- **CA-05:** busca global (tecla `/`) por "pedido" e por "pitanga".
- **CA-06:** DevTools a 375 px e a 1440 px, com o console aberto; Network em Offline e recarregar.
