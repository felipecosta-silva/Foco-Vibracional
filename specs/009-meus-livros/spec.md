# Spec 009 — Meus livros

> **Status:** aprovada
> **Pedido por:** dono do site em 2026-11-04: "uma página de livros onde vai ter os livros que tenho, se já li eles, o que pretendo comprar, e quais e para quem emprestei".
> **Escrita e executada por:** Claude, por ordem do dono
> Regras: `.specify/memory/constitution.md`

## 1. Por quê
O dono quer controlar a própria biblioteca: o que tem, o que já leu, o que quer comprar e o que está emprestado, com quem.
É uma ferramenta pessoal, como as Contas da casa (spec 008), e guarda nomes de pessoas.

## 2. Privacidade
Mesmo modelo da spec 008:
- Os dados ficam **só no aparelho** (`localStorage`, chave `foco.livros.v1`). Nenhum título nem nome de pessoa fica no código publicado.
- A página fica fora do `NAV`, da busca e do `sitemap.xml`, com `noindex`. Ela abre pelo endereço `livros.html`.
- As duas páginas pessoais ganham um link entre si ("Minhas páginas"), para o dono achar uma a partir da outra.

## 3. Requisitos
- **RF-01** Página `livros.html`, "Meus livros", com o rótulo "Só neste aparelho" e o mesmo aviso de privacidade da spec 008.
- **RF-02** Formulário "Adicionar livro" com:
  - **Título** (obrigatório) e **Autor**.
  - **Situação:** "Tenho" ou "Quero comprar".
  - **Leitura:** "Não li", "Lendo" ou "Li".
  - **Preço** (opcional, para a lista de compras).
  - **Emprestado para** e **Desde** (data), só quando a situação é "Tenho".
  - **Anotações** (opcional).
  - O mesmo formulário edita um livro. Durante a edição, o botão diz "Salvar alterações" e aparece "Cancelar".
- **RF-03** Lista dos livros em ordem de título, cada um em um cartão com:
  - Título, autor e selos: leitura, "Quero comprar" e "Emprestado para Fulano · há N dias".
  - Ações: "Editar" e "Remover" (com confirmação). Conforme o caso, também "Devolvido" (limpa o empréstimo) e "Comprei" (passa para "Tenho").
- **RF-04** Filtros com contagem: Todos, Tenho, Quero comprar, Emprestados, Não li e Li. Uma busca por título, autor ou pessoa.
- **RF-05** Bloco **"Para comprar"**, em texto: os livros com "Quero comprar", com o preço quando houver e o total. Botões "Copiar" e "Compartilhar" (se o aparelho oferecer).
- **RF-06** "Salvar cópia" e "Restaurar cópia" em `.json`, como na spec 008.
- **RF-07** Funciona offline: `livros.html` entra no `PRECACHE`.

## 4. Critérios de aceite
- **CA-01** Adicionar 3 livros: um lido, um emprestado para "Ana" desde 3 dias atrás e um "Quero comprar" de R$ 45,90. Os filtros mostram Todos 3, Tenho 2, Quero comprar 1, Emprestados 1, Li 1. O cartão do emprestado diz "há 3 dias".
- **CA-02** "Devolvido" tira o livro dos Emprestados; "Comprei" o leva para "Tenho".
- **CA-03** "Para comprar" lista o livro com R$ 45,90 e o total.
- **CA-04** Recarregar mantém os livros. A página não está no menu, na busca nem no sitemap.
- **CA-05** 1440 px e 375 px: console limpo e sem rolagem lateral; `CACHE_VERSION` aumentado.

## 5. Emenda de 2026-11-04: categorias e livros de uma vez
> **Pedido do dono:** "seria bom categorizar", com os primeiros livros da lista.

- **RF-08** Campos novos no formulário: **Categoria** (com sugestões: Romance espírita, Estudo espírita, Umbanda, Jurema, Candomblé, Ervas e plantas, Outros, mais as já usadas), **Série ou coleção** e **Volume**.
- **RF-09** "Agrupar por": Categoria (padrão), Autor, Série ou Não agrupar. Cada grupo tem título e contagem. Dentro do grupo, a ordem é série, volume e título. A busca também procura na categoria e na série.
- **RF-10** Link `livros.html#adicionar=<lista em base64url>`: ao abrir, pergunta e **acrescenta** os livros que ainda não estão na lista (mesmo título e autor), sem apagar nada. O trecho depois do `#` não sai do aparelho. O endereço volta a `livros.html` depois de lido.
- **CA-06** O link com 9 livros acrescenta 9 e mantém o livro que já existia. Aberto de novo, não duplica.
- **CA-07** Agrupar por série mostra "O Reino das Sombras (2)" e "Segredos de Aruanda (3)", na ordem dos volumes.

## 6. Emenda de 2026-11-04: capas e formato
> **Pedido do dono:** "se possível coloque as imagens das capas dos livros", com a segunda lista (vários em Kindle).

- **RF-11** Campo **Formato**: Físico (padrão), Digital (Kindle, e-book) ou Audiolivro. Digital e Audiolivro aparecem na linha de dados do cartão.
- **RF-12** **Capa** de três jeitos:
  - **Foto da capa:** a imagem do aparelho é reduzida a 240 px de altura em JPEG (cerca de 15 KB) e fica só no aparelho.
  - **Endereço** `https://` colado.
  - **Buscar capa:** só quando o dono toca. Envia título e autor à Open Library e ao Google Livros e mostra até 8 capas para escolher. O aviso fica ao lado do botão.
- **RF-13** O cartão mostra a capa à esquerda. Capa que não carrega (sem internet ou endereço quebrado) some sem quebrar o cartão. Se faltar espaço no aparelho, o livro não é salvo e aparece um aviso.
- **RF-14** O link `#adicionar=` também **completa campos vazios** de livros que já existem (capa, formato, série...), sem trocar o que o dono escreveu.
- **CA-08** Foto de capa salva como `data:image/jpeg` (≈15 KB) e formato "Digital" aparece no cartão.
- **CA-09** "Buscar capa" para "Há dois mil anos" / "Xavier" mostra a capa da Open Library; ao tocar, ela vai para o livro.
- **CA-10** Link com 24 livros sobre uma lista que já tem "Há Dois Mil Anos" sem capa: acrescenta 23, completa 1 (capa ganha, nota e leitura do dono mantidas). Aberto de novo, nada muda.

## 7. Emenda de 2026-11-05: estante, fitas e estante vazia
> **Pedido do dono:** "ter um tipo de biblioteca... uma tarja, um ícone ou algo do tipo mostrando que foi lido". Ele abriu a página pelo arquivo do computador e não viu os livros.

- **RF-15** A opção **"Ver como"** tem dois modos:
  - **Estante (capas)**, o padrão: capas lado a lado com uma prateleira embaixo de cada grupo. Livro sem foto ganha uma capa desenhada com título e autor, numa cor fixa para cada título.
  - **Lista**: os cartões de antes.
  - A escolha fica guardada no aparelho.
- **RF-16** Uma **fita no canto** da capa e do cartão: "✓ Lido" (verde), "📖 Lendo" (âmbar) ou "🛒 Quero" (dourado). Nas capas há também os selos "↗ Pessoa" (emprestado) e "Digital" ou "Audiolivro".
- **RF-17** Tocar numa capa abre uma janela com os detalhes e as ações. Nos cartões entram dois atalhos novos: "✓ Marcar como lido" e "📖 Estou lendo".
- **RF-18** A contagem mostra quantos livros foram lidos, quantos estão em leitura e quantos estão emprestados.
- **RF-19** Com a estante vazia, um aviso explica que cada aparelho e cada endereço guarda a própria lista e leva até "Restaurar cópia".
- **CA-11** Com 68 livros restaurados da cópia:
  - A estante mostra 68 capas.
  - "Marcar como lido" na janela põe a fita na janela e na estante.
  - A tela tem 390 px e 1440 px, sem rolagem lateral e com o console limpo.
  - `CACHE_VERSION` é fv-v48.
