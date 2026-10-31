# Revisão 002 — Pedido certo, erva certa

> **Revisor:** Claude (supervisor) · **Data:** 2026-10-31 · **Executor:** Gemini (commits `2edcf28` a `1cd1c1a`)

## Resultado
**Aprovada, com uma correção feita na revisão.**

| Critério | Resultado |
|---|---|
| CA-01 Mapa antes do catálogo, 8 grupos e 19 ervas, chip abre a ficha | ✅ |
| CA-02 Sem "impenetrável" em `data/ervas.js` | ⚠️ A guiné foi corrigida, mas a `comigo-ninguem-pode` ainda dizia "escudo impenetrável". Corrigido na revisão. |
| CA-03 Bloco `#pedido-bem-feito`, 6 cartões, checklist e placeholder novo | ✅ |
| CA-04 "Escolha o seu pedido" com 3 caminhos e ervas linkadas | ✅ |
| CA-05 Busca por "pedido" e "pitanga" | ✅ |
| CA-06 1440 px, 375 px, offline, console limpo, sem rolagem lateral | ✅ (conferido no navegador sem interface) |

Os textos das RF-02, RF-07, RF-08, RF-09, RF-10, RF-11 e RF-12 foram copiados da spec sem reescrita.

## Ajustes feitos na revisão
- `comigo-ninguem-pode`: "escudo impenetrável" passou a "escudo protetor" (constituição III.2).
- Chips do mapa com 44 px de altura no celular, para o toque ficar confortável.

## Fora da spec, revisado junto
O commit `ed817b6` (10 ervas de quintal) entrou sem spec. As fotos e os créditos foram conferidos no Commons e estão corretos. Na auditoria de 2026-10-31 foram corrigidos: folhas na cabeça sem base (jambo, pinha, carambola e abacateiro passaram a "do pescoço para baixo"), aviso de persina para pets no abacateiro, alergia de contato no cajueiro, correspondências com entidades específicas, promessas de saúde e a parte "brote" (agora "broto").
