# Revisão 003 — Fundamentos da Jurema

> **Revisor:** Claude · **Data:** 2026-11-03 · **Executor:** Gemini (commits `635a9f9` a `d2be649`)

## Resultado
**Aprovada. Falta o dono conferir o conteúdo antes de publicar.**

| Critério | Resultado |
|---|---|
| CA-01 Cabeçalho, aviso e 9 seções na ordem, textos da spec, links funcionando | ✅ Textos conferidos linha a linha; 7 destinos respondendo 200 e as 6 âncoras existem |
| CA-02 Selo nas seções 6 e 7, nenhum link para esquerda, ponto riscado ou preparo | ✅ |
| CA-03 "O que é a Jurema" em 3º, contador "de 8", progresso antigo mantido | ✅ Passos `1` e `3` marcados antes da mudança aparecem como "2 de 8" |
| CA-04 `glossario.html#princesa` abre o item e leva a `jurema.html#na-casa` | ✅ |
| CA-05 Ficha da jurema-preta com os cuidados novos | ✅ `plantas.html#jurema-preta` abre a ficha com o texto da RF-09 |
| CA-06 Menu, busca e link em `pontos.html` | ✅ |
| CA-07 1440 px, 375 px, offline, `PRECACHE`, `fv-v42`, sitemap | ✅ 12 combinações de página e largura: console limpo e sem rolagem lateral |

## Observações
- **Fora do plano, aceito:** o Gemini acrescentou `.home-section__actions { flex-wrap: wrap; }` no fim do CSS para o botão novo de `pontos.html` não vazar a 375 px. A regra vale para todas as seções da capa, mas só age quando falta espaço; a capa a 375 px continua igual.
- Ele não inventou nomes, reinos nem fontes. O registro do executor está completo.

## Para o dono conferir
- Os textos das 9 seções, principalmente "Quem trabalha na Jurema", "O que você vai ver na casa" (Princesa e Mesa) e "A bebida sagrada".
- O item "As Linhas Espirituais e a Força de suas Ervas" do glossário cita as Mestras Laura e Luziara e o "Mestre Junqueiro". Esse texto é anterior à spec e não foi conferido.
