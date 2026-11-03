# Revisão 008 — Contas da casa

> **Revisor:** Claude · **Data:** 2026-11-03 · **Executor:** Claude, por ordem do dono
> Como quem escreveu também executou, a revisão foi feita com testes automáticos no navegador.

## Resultado
**Aprovada.**

| Critério | Resultado |
|---|---|
| CA-01 Duas velas de 7 dias por caixa | ✅ Cada uma: 4 trocas e R$ 30,00 no mês. Juntas: 1 caixa de 12 (precisa de 8, sobram 4), R$ 90,00 |
| CA-02 Incenso semanal a R$ 2,50 | ✅ R$ 130,36 por ano |
| CA-03 Recarregar mantém os itens; cópia de segurança | ✅ 3 itens depois de recarregar. "Restaurar" aceita o arquivo de "Salvar" e pede confirmação |
| CA-04 Fora do menu, da busca e do sitemap, com `noindex` | ✅ |
| CA-05 1440 px, 375 px, console e rolagem | ✅ Console limpo e sem rolagem lateral. As outras 6 páginas testadas continuam limpas |

## Observações
- **A restrição é de privacidade, não de senha.** Num site estático, qualquer senha ficaria visível no código. Os dados ficam só no aparelho, e quem abrir `contas.html` em outro aparelho vê a calculadora vazia.
- A página abre pelo endereço direto. Para achar fácil, salve nos favoritos ou adicione à tela inicial a partir dela.
