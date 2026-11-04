# Spec 010: Sincronizar entre aparelhos

> **Status:** aprovada e executada
> **Pedido por:** o dono do site, em 2026-11-04: "gostaria de que eu pudesse ver independente se estou no computador ou não... se eu adicionar que emprestei algum, tem que ficar em ambos os lugares".
> **Escrita e executada por:** Claude, por ordem do dono.
> **Regras:** `.specify/memory/constitution.md`

## 1. Por quê
"Meus livros" (spec 009) e "Contas da casa" (spec 008) guardavam os dados só no aparelho. O dono quer a mesma lista no computador e no celular.

## 2. Decisão
- **Recusado: JSON no repositório do site.** O repositório é público e publicaria títulos e nomes de pessoas. Gravar nele também exigiria guardar uma chave com acesso ao site.
- **Escolhido: repositório privado do dono no GitHub** (ex.: `foco-dados`), com `livros.json` e `contas.json`.
  - A página lê e grava pela API do GitHub, com uma chave de acesso de permissão mínima (fine-grained token, só esse repositório, Contents: Read and write).
  - O nome do repositório e a chave ficam só no `localStorage` do aparelho e nunca no código publicado.
  - Não precisa de servidor nem de serviço novo.

## 3. Requisitos
- **RF-01** Bloco "Sincronizar entre aparelhos" em `livros.html` e `contas.html`, com campos Repositório (dono/nome), Chave e o botão Conectar.
- **RF-02** Ao conectar, a página confere se o repositório existe, se a chave é aceita e se o repositório é **privado**. Se ele for público, a conexão é recusada.
- **RF-03** A sincronização sobe e desce `livros.json` e `contas.json`:
  - Roda ao abrir a página, 1,5 s depois de cada mudança, quando a internet volta e quando a página volta para a tela.
- **RF-04** A mesclagem é em três vias (aqui, nuvem e última versão sincronizada), item por item e campo por campo:
  - Uma mudança feita em um aparelho não apaga a do outro.
  - Uma remoção vale nos dois aparelhos.
  - O mesmo livro criado nos dois aparelhos (mesmo título e autor) fica uma vez só.
- **RF-05** Se outro aparelho gravar no meio da sincronização (conflito 409/422), a página lê e mescla de novo, até 2 vezes.
- **RF-06** A linha de situação mostra:
  - "Sincronizado às HH:MM".
  - "Sem internet", quando as mudanças ficam no aparelho e sobem depois.
  - O aviso de chave recusada ou de falta de acesso ao repositório.
- **RF-07** "Copiar link de conexão" gera `#conectar=…` para conectar o outro aparelho com um toque. O trecho depois do `#` não vai para o servidor. Há também o botão "Desconectar este aparelho".
- **RF-08** O aviso de privacidade das duas páginas passa a explicar a sincronização.

## 4. Critérios de aceite (conferidos com um GitHub simulado, em dois perfis de navegador)
- **CA-01** Um repositório público é recusado, e uma chave errada mostra o aviso.
- **CA-02** O aparelho A conecta, e a nuvem recebe os livros e as contas.
- **CA-03** O aparelho B conecta pelo link e recebe os livros. O livro igual que B já tinha fica uma vez só.
- **CA-04** B empresta "Legião" para Ana enquanto A acrescenta um livro. Os dois aparelhos terminam com os 3 livros e o empréstimo.
- **CA-05** A remove um livro, e o livro some em B.
- **CA-06** Um item das Contas criado em A aparece em B.
- **CA-07** Console limpo e sem rolagem lateral a 375 px. `CACHE_VERSION` é fv-v47.
