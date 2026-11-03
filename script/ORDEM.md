# script/: o motor do site

O antigo `script.js` (cerca de 4.800 linhas) foi dividido em 11 arquivos comuns, **não módulos**.
Assim o site continua abrindo por `file://` (constituição V.1).

Tudo o que um arquivo declara no nível de cima (`function`, `const`, `let`) fica visível para os outros.
Nenhum arquivo roda nada sozinho ao carregar, além de registrar eventos.
Quem chama os `init…()` de todas as páginas é o `DOMContentLoaded`, no fim de `inicio.js`.

## Ordem de carga (obrigatória)

Toda página carrega os 11 arquivos, nesta ordem, depois dos arquivos de `data/`:

| # | Arquivo | O que tem |
|---|---|---|
| 1 | `nucleo.js` | `NAV` (menu, fonte única), `ICONS`, utilitários (`$`, `escapeHtml`, `toast`, `speak`), carga de `window.FV_DATA`, favoritos, modo iniciante/avançado e eventos globais de copiar/ouvir |
| 2 | `lua.js` | Motor lunar: fases verdadeiras e iluminação (Meeus), `getLiveMoonData` |
| 3 | `praticas.js` | Início (relógio e modo foco), mantras, caderno de firmeza, firmeza de vela e contas da casa |
| 4 | `catalogo.js` | `createCatalog`, `getDrawer`, cartões e fichas de banhos, ervas e defumações, mapa das ervas e ligações cruzadas |
| 5 | `tarot-pontos.js` | Tarot, baralho cigano e pontos cantados |
| 6 | `colheita-calendario.js` | Colheita pela lua e calendário lunar |
| 7 | `portais.js` | Portais numéricos e Grabovoi da página inicial |
| 8 | `simbolos.js` | Pontos riscados, runas, mandalas e sigilos |
| 9 | `hoje.js` | Painel "Hoje" e oráculo "Como você está se sentindo?" |
| 10 | `busca.js` | Busca global (lupa e atalho `/`) |
| 11 | `inicio.js` | Herói da página inicial, camada imersiva e a **inicialização de todas as páginas** |

## Regras

- **Função nova** vai no arquivo do assunto. Se ela precisa rodar ao abrir a página, chame o `init…()` dela no `DOMContentLoaded` de `inicio.js`.
- **Página nova:** entrada em `NAV` (`nucleo.js`). O bloco de `<script>` é o mesmo de qualquer outra página.
- **Arquivo novo em `script/`:** inclua-o em **todas** as páginas, na posição certa da ordem, e no `PRECACHE` do `sw.js`, e aumente `CACHE_VERSION`.
- Não use `import` e `export` nem `type="module"`: isso quebra o `file://`.
