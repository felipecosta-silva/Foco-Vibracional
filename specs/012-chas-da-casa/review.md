# Revisão 012 — Chás da casa

> **Revisor:** Claude, em 2026-11-09 · **Executor:** Gemini (commits `44a03dc` a `baf01f9`)
> **Resultado:** aprovada, com 5 correções feitas na revisão. Não publicada.

## O que está certo

- As 6 receitas estão em `data/chas.js` com o texto da spec, sem palavra nova (conferido por script, frase a frase).
- Aviso da RF-01 visível sem rolar a 375 px (termina em 578 px), com o telefone clicável.
- `NAV`, carga dos dados, `createCatalog`, `getDrawer`, filtros "Para" e "Momento", busca global, `PRECACHE` e `sitemap.xml`.
- Parte 2 lê `ERVAS.cha` e `BANHOS.versaoCha` sem copiar dados. Tirou sozinha as 2 ervas tóxicas cujo campo `cha` é um aviso de proibição (II.2): boa decisão.
- Nenhum `style=""` novo; CSS só com tokens. Console limpo; sem rolagem lateral a 375 px e 1440 px.

## Correções feitas na revisão

1. **Letra inicial minúscula** em "Guardar", "Para que serve", "Variações", "Cuidados" e em ingredientes: a spec trazia essas frases depois de dois-pontos. Primeira letra em maiúscula, sem mudar palavras.
2. **"Gengibre: os mesmos cuidados da receita 1"** (erro da spec): na página as receitas não têm número. Trocado pelo cuidado escrito por inteiro.
3. **Cuidados escondidos na Parte 2 (II.1):** o resumo de 120 caracteres cortava os avisos da ficha, como "gestantes não devem tomar" na artemísia e na salsa, e "não confundir com o anis japonês tóxico". Agora o item mostra "⚠️ Tem cuidados importantes: leia a ficha antes de tomar" quando a ficha fala em gestante, gravidez, tóxico, abortivo ou "não confundir". São 7 itens.
4. **Momento e "como servir" repetidos** nas etiquetas e nos quadros do painel: ficou só nos quadros.
5. "quente / gelado" → "Quente ou gelado".

`CACHE_VERSION` → `fv-v53`.

## Fica para depois (fora do escopo, spec §7)

- Os textos antigos de `cha` nas Ervas e de `versaoCha` nos Banhos prometem demais em alguns casos, como "induz ao sono reparador" e "excelente digestivo". O chá de eucalipto por via oral também merece um cuidado maior. Precisa de uma revisão própria.
