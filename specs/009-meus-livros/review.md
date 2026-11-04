# Revisão 009 — Meus livros

> **Revisor:** Claude · **Data:** 2026-11-04 · **Executor:** Claude, por ordem do dono
> Como quem escreveu também executou, a revisão foi feita com testes automáticos no navegador.

## Resultado
**Aprovada.**

| Critério | Resultado |
|---|---|
| CA-01 Três livros e os filtros | ✅ Todos 3, Tenho 2, Quero comprar 1, Emprestados 1, Li 1; "Emprestado para Ana · há 3 dias" |
| CA-02 "Devolvido" e "Comprei" | ✅ Emprestados 0, Tenho 3 |
| CA-03 "Para comprar" | ✅ R$ 45,90 e o total |
| CA-04 Recarregar mantém; fora do menu, da busca e do sitemap | ✅ |
| CA-05 1440 px e 375 px | ✅ Console limpo e sem rolagem lateral. As Contas da casa continuam com as mesmas contas |

## Observações
- Livro em "Quero comprar" não mostra o selo de leitura, que só faz sentido para o que você já tem.

## Emenda de 2026-11-04
| Critério | Resultado |
|---|---|
| CA-06 Link com 9 livros | ✅ Pergunta, acrescenta 9 e mantém o que existia; aberto de novo, fica em 10 |
| CA-07 Agrupar por série | ✅ "O Reino das Sombras (2): Legião, A Marca da Besta" e "Segredos de Aruanda (3): Tambores de Angola, Aruanda, Corpo Fechado" |

- Os títulos dos livros do dono foram conferidos em livrarias e no Skoob. O link com eles **não** está no repositório, porque tudo o que está no repositório é publicado.

## Emenda de 2026-11-04: capas e formato (Claude)
- CA-08 a CA-10 conferidos no Chrome sem janela, a 1440 px e 375 px: console limpo, sem rolagem lateral, `CACHE_VERSION` em fv-v46.
- A busca no Google Livros pode falhar por cota do Google (erro 429 visto no teste). Nesse caso ficam as capas da Open Library, ou a foto.
- As capas do link de importação foram conferidas uma a uma, olhando a imagem. Nenhum título nem capa está no código publicado.
