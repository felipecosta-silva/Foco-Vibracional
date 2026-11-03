# Spec 008 — Contas da casa

> **Status:** aprovada
> **Pedido por:** dono do site em 2026-11-03: "uma aba para calcular compras de velas: compro velas de 7 dias, uma para cada entidade (por enquanto Caboclo Treme Terra e a corrente franciscana); quantas velas vou precisar comprar no mês e o valor, colocando o valor das velas, o preço da caixa etc. Essa parte teria que ficar de certa forma restrita. Não seria só para isso: talvez incenso, se eu acendo um incenso por semana etc. Veja a melhor forma de fazer."
> **Escrita e executada por:** Claude, por ordem do dono ("queria que você construísse")
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
O dono mantém velas de 7 dias acesas sem parar e quer saber, todo mês, quantas comprar e quanto vai gastar. O mesmo vale para incenso e para outros itens.
É uma ferramenta pessoal, e não um conteúdo para o iniciante.

## 2. Como fica "restrita"
O site é estático e público: **não existe senha de verdade sem servidor.** Uma senha escrita no JavaScript qualquer pessoa leria. Por isso a restrição é esta:
- **Os dados ficam só no aparelho** (`localStorage`). Nada vai para a internet, e nenhum nome de entidade fica no código publicado. Quem abrir a página em outro aparelho vê uma calculadora vazia.
- **A página fica escondida:** não entra no `NAV`, na busca, no `sitemap.xml` nem na trilha, e tem `<meta name="robots" content="noindex, nofollow">`. Ela abre pelo endereço `contas.html`, que o dono salva nos favoritos ou na tela inicial.
- **Exceção registrada à constituição IV.4** (toda página tem entrada no `NAV`), por pedido do dono.

## 3. Requisitos
- **RF-01** Página `contas.html`, "Contas da casa", com rótulo "Só neste aparelho" e o aviso:
  > Esta página não aparece no menu nem na busca. O que você digita fica guardado só neste aparelho e não vai para a internet. Se os dados do navegador forem apagados, as contas somem: use "Salvar cópia" de vez em quando.
- **RF-02** Uma lista de **itens**, cada um com:
  - **Item** (ex.: "Vela de 7 dias branca") e **Para quê** (opcional, ex.: a entidade ou o altar).
  - **Frequência:** "A cada N dias", com a data da próxima troca, ou "N vezes por mês".
  - **Quantidade por vez** (padrão 1).
  - **Como compra:** "Por unidade", com o preço da unidade, ou "Por caixa", com as unidades por caixa e o preço da caixa.
  - **Já tenho em casa:** o estoque, em unidades.
  - Botão "Remover", que pede confirmação.
- **RF-03** O botão **"+ Adicionar item"** cria um item novo: a cada 7 dias, próxima troca hoje, 1 por vez, por unidade.
- **RF-04** Um seletor de **mês** (padrão: o mês atual). As contas são sempre desse mês.
- **RF-05** As contas de cada item:
  - **Vezes no mês.** Em "a cada N dias", conta as trocas que caem dentro do mês, a partir da próxima troca e de N em N dias; trocas antes do início do mês não contam. Em "N vezes por mês", é N.
  - **Usa no mês** = vezes × quantidade por vez.
  - **Itens com o mesmo nome são comprados juntos** (ex.: duas velas de 7 dias brancas, uma para cada entidade, saem da mesma caixa). A compra usa o jeito de comprar e o preço do primeiro item com aquele nome, e o aviso diz isso.
  - **Comprar** (por nome) = soma do que usam no mês − soma do que já tenho (nunca menos que 0). Por caixa: caixas = arredondar para cima (comprar ÷ unidades por caixa), e mostra quantas unidades sobram.
  - **Paga na compra:** por unidade, comprar × preço; por caixa, caixas × preço da caixa.
  - **Gasto do mês** = usa no mês × preço de uma unidade (na caixa, preço da caixa ÷ unidades).
  - **Por ano (estimativa)**: em "a cada N dias", 365 ÷ N × quantidade × preço da unidade; em "N vezes por mês", N × 12 × quantidade × preço da unidade.
- **RF-06** Um resumo no topo: **a pagar na compra**, **gasto do mês** e **por ano**, somando todos os itens.
- **RF-07** **Lista de compras** do mês em texto, com os botões "Copiar" e "Compartilhar" (o "Compartilhar" só aparece se o aparelho oferecer). Itens com nada a comprar não entram.
- **RF-08** **"Salvar cópia"** baixa um arquivo `.json` com os itens. **"Restaurar cópia"** lê esse arquivo e, depois de confirmar, troca os itens.
- **RF-09** Valores em reais (`pt-BR`). Os campos de preço aceitam vírgula ou ponto.
- **RF-10** Tudo é salvo a cada mudança, na chave `foco.contas.v1`, com try/catch. Sem armazenamento (janela anônima), a página funciona sem guardar.
- **RF-11** Funciona offline: `contas.html` entra no `PRECACHE`.

## 4. Critérios de aceite
- **CA-01** Dois itens "Vela de 7 dias", por caixa (12 unidades por R$ 90,00), próxima troca em 03/11/2026, mês de novembro de 2026, sem estoque: cada um usa 4 no mês (dias 3, 10, 17 e 24) e gasta R$ 30,00. Juntos: comprar 8, ou seja 1 caixa de R$ 90,00, e sobram 4.
- **CA-02** Incenso, 1 a cada 7 dias, por unidade a R$ 2,50: o gasto por ano é R$ 130,36.
- **CA-03** Recarregar a página mantém os itens; "Salvar cópia" e "Restaurar cópia" devolvem os mesmos itens.
- **CA-04** A página não está no menu, na busca nem no `sitemap.xml`, e tem `noindex`.
- **CA-05** 1440 px, 375 px e offline: console limpo, sem rolagem lateral e `CACHE_VERSION` aumentado.
