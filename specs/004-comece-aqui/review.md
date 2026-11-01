# Revisão 004 — Trilha "Comece aqui"

> **Revisor:** Claude · **Data:** 2026-10-31 · **Executor:** Claude, por ordem do dono (ver `tasks.md`)
> Como quem escreveu também executou, esta revisão foi feita com testes automáticos no navegador. Vale uma leitura do dono antes de publicar.

## Resultado
**Aprovada.**

| Critério | Resultado |
|---|---|
| CA-01 7 passos na ordem, textos da spec e links funcionando | ✅ 16 links, todos respondendo 200 |
| CA-02 Selo no bloco e nenhum link para esquerda, descarrego forte ou cabeça forte | ✅ (ver a observação abaixo) |
| CA-03 Contador, progresso mantido ao recarregar e "Recomeçar" | ✅ "2 de 7" sobrevive ao recarregar e "Recomeçar" volta a "0 de 7" |
| CA-04 Chip da capa, menu, busca ("comece") e atalho do app | ✅ |
| CA-05 `glossario.html#dois-tempos` abre o item | ✅ abre e rola até ele |
| CA-06 1440 px e 375 px, offline, console limpo, sem rolagem lateral, PRECACHE e sitemap | ✅ 28 combinações de página e largura sem problemas; 129 arquivos no cache `fv-v36` |

## Observações
- O filtro "Defumações de harmonização" também mostra a `defumacao-resinas-magos` (consagração do altar, intensidade forte). Ela não é de esquerda, e o texto do passo 5 já aponta alecrim e manjericão. Se o dono preferir, uma spec futura pode criar um filtro por intensidade.
- O banho `banho-forca-mestras-jurema` (intensidade média) aparece em "Banhos de harmonização". Ele não é de esquerda nem de cabeça forte.
- Quando a spec 003 (Fundamentos da Jurema) existir, ela entra como passo novo, entre o 2 e o 3.
