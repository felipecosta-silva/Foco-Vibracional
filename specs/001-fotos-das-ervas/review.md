# Revisão 001 — Fotos das ervas com créditos verdadeiros

> **Revisor:** Claude · **Data:** 2026-10-25 · **Commits revisados:** `81d1c3c` a `25500a5` (11 tarefas)
> **Resultado: APROVADA com ajustes** (feitos pelo supervisor e descritos abaixo)

## O que ficou bom
- As ferramentas (`commons.py`, `baixar.py`, `verificar.py`, `gerar.py`) funcionam. O crédito vem da API e a foto é comparada por dHash. **Pela primeira vez, nenhum crédito foi inventado.**
- As 12 imagens de IA foram trocadas por fotos reais, e as 14 ervas sem foto ganharam a sua.
- O crédito na ficha usa `escapeHtml` e só tokens de cor, sem `style=""`.
- Um commit por tarefa e o registro preenchido.

## Auditoria independente (código do supervisor, sem usar as ferramentas do executor)
- 75 ervas, 75 créditos e 75 arquivos distintos no Commons. Todos existem e todos têm licença livre (sem NC nem ND).
- dHash próprio: **as 75 fotos locais são os arquivos citados**.
- Todas com ≤ 150 KB e ≤ 900 px.
- As diferenças de autor que restam são só de formatação (espaços, `&amp;`) ou de autor vazio no Commons substituído pelo usuário que enviou o arquivo, como o plano previa.

## Problemas encontrados e corrigidos
1. **RF-07 (foto útil para reconhecer a planta): 7 fotos trocadas** depois de uma revisão visual das 75:
   | Erva | Antes | Depois |
   |---|---|---|
   | pimenteira | foto de uma **placa** de jardim botânico | *Capsicum frutescens 'Hidalgo'* com frutos no pé |
   | babosa | planta seca e avermelhada em terreno árido | babosa verde em vaso |
   | rosa-vermelha | flor **rosa-choque** | rosa vermelha |
   | manga | só a fruta (a ficha usa a folha) | folhas de *Mangifera indica* |
   | amora | close das flores (a ficha usa a folha) | folha de *Morus nigra* |
   | calendula | semente seca (a ficha usa a flor) | flor com as folhas |
   | aroeira | tronco e copa contra o céu | folhas com os frutinhos vermelhos |
2. **Autor "Own work" (goiabeira):** o `commons.py` aceitava o campo `Credit` mesmo quando ele dizia só "Own work". Corrigido: nesse caso, usa quem enviou o arquivo. A goiabeira agora tem autor "A-giâu".
3. **E-mail inventado no User-Agent:** `commons.py` enviava `tascom@gmail.com`, que não é do dono, num repositório público. Removido.
4. `CACHE_VERSION` → `fv-v30`.

## Lições para o executor
- **A ferramenta prova que a foto é o arquivo citado, mas não que é uma boa foto da espécie.** Olhe cada imagem: a parte usada, sem placas, sem ilustração quando houver foto e com a cor certa (rosa vermelha é vermelha).
- Nunca coloque e-mail ou dado pessoal que não foi fornecido.
- No Windows, rode as ferramentas com `PYTHONIOENCODING=utf-8` (nomes com acento quebram o `print`).
