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
