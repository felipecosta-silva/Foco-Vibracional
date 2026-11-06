# Spec 011 — Receitas vindas do Instagram (triagem)

> **Status:** aprovada e executada por Claude em 2026-11-06 (decisões na seção 5); não publicada
> **Pedido por:** dono do site em 2026-11-06. Colou a transcrição de 9 postagens com o aviso: "são informações do instagram, então tem que se ter cuidado".
> **Escrita por:** Claude
> **Origem do conteúdo:** postagens de redes sociais, enviadas pelo dono em 2026-11-06. **Não são fonte de tradição.** Cada receita que entrar leva `origem: "rede social, enviada pelo dono em 2026-11-06"` e uma frase visível: "Receita popular de redes sociais, revisada. Confira com a sua casa."
> Regras: `.specify/memory/constitution.md` (I.5, II, III)

## 1. Como as postagens foram lidas

O texto colado mistura duas coisas:
- **A transcrição** das postagens: ingredientes, preparo e reza. É o que pode entrar, depois de revisado.
- **"Fundamentos mágicos":** comentários de quem resumiu as postagens, não das postagens. **Não entram como fato.** Motivos:
  - Afirmam correspondências fixas, como "samambaia é de Oxóssi" e "pitanga é de Oxum e dos ciganos". Isso varia de casa para casa (III.4) e regência não se troca sem o dono (I.4).
  - Fazem promessas de efeito: "acalma sem causar sonolência", "a selenita atua no chakra coronário" (III.2).
  - Trazem história sem fonte: "prática antiga de pajelança" (I.1).

## 2. Triagem

| # | Postagem | O site já tem? | Proposta |
|---|---|---|---|
| 1 | Ritual para paz mental (vela, sal grosso, água, lavanda, hortelã, açúcar, selenita, pedra de São Miguel, vaso com pregos) | Não | Entra como **ritual simples**, com o cuidado do fogo (II.3). A pedra e os pregos ficam opcionais, porque o iniciante não costuma ter. |
| 2 | Spray dourado (canela, cravo, casca de laranja, álcool e água; 7 dias) | Não | Entra como **ritual simples**. Cuidados: álcool é inflamável, longe de vela e brasa; não borrifar em pessoas, plantas nem animais (óleo de cítricos faz mal a gatos); teste num canto do tecido antes. |
| 3 | Moeda no sapato (lua crescente, 7 dias) | Não | Entra como **ritual simples**, sem mudança. |
| 4 | Banho de romã e rosas | Não | Entra em **Banhos** (`prosperidade`, suave, **do pescoço para baixo**, porque a postagem não fala de cabeça). Sai "magnetismo irresistível": fica "resgatar a autoestima e o brilho pessoal" (III.2 e III.3, nada de amor dirigido a alguém). |
| 5 | Defumação para desatar nós (cipó, louro ou arruda; do fundo para a porta) | Não | Entra em **Defumações** (`limpeza`). **Falta saber qual cipó** (seção 5). Cuidado: arruda, gestantes fora do cômodo. |
| 6 | Sal grosso e pimenta no prato (21 dias, em cima da geladeira) | Não | Entra como **ritual simples** de proteção, **sem** "devolver ao remetente" (III.3: nada que vise prejuízo a terceiros). Pimenta não vai ao fogo (II.2); prato fora do alcance de crianças e pets. |
| 7 | Banho de girassol (girassol, calêndula e oliveira, para merecimento) | Sim: "Banho Solar de Girassol" | **Não cria banho novo.** A postagem não traz preparo. No máximo, uma linha no banho que já existe: "Há quem some calêndula e folha de oliveira para trabalhar o merecimento." |
| 8 | Banho de folha de pitanga | Sim: folha de pitangueira nas Ervas, 2 banhos e 1 defumação | **Não cria banho novo.** A postagem não traz preparo nem quantidade. |
| 9 | Banho para desenvolvimento mediúnico (samambaia, anis-estrelado, rosas brancas) | Sim: "Banho de Desenvolvimento Mediúnico" (samambaia, anis-estrelado, alfazema) | **Não cria banho novo.** Rosa branca vira opção no banho que já existe. Ver seção 4. |

## 3. Requisitos (se o dono aprovar)

- **RF-01** Itens 4 e 5 entram em `data/banhos.js` e `data/defumacoes.js` com o campo `origem`.
- **RF-02** O painel (`banhoDetailHtml` e `defumacaoDetailHtml` em `script/catalogo.js`) mostra o campo `origem` numa linha discreta, quando existir.
- **RF-03** Itens 1, 2, 3 e 6 entram onde o dono decidir (seção 5), cada um com: para que serve, materiais, como fazer, reza (texto da postagem), cuidados e a linha de origem.
- **RF-04** Nenhum texto dos "fundamentos mágicos" entra como fato.
- **RF-05** `CACHE_VERSION` sobe; teste a 1440 px e a 375 px, console limpo.

## 4. Achado no conteúdo que já está no site

O "Banho de Desenvolvimento Mediúnico" atual manda **jogar da coroa aos pés** e se chama "banho supremo", sem o selo. Desenvolvimento mediúnico é assunto de terreiro (II.0), e "supremo" fere III.2. **Proposta:** selo "Só com orientação de um(a) zelador(a)", do pescoço para baixo para quem faz sozinho, e tirar "supremo". O mesmo "supremo" aparece no banho de girassol.

## 5. Decisões do dono (2026-11-06)

1. Os rituais 1, 2, 3 e 6 entram numa seção nova, **"Rituais simples do dia a dia"**, em `firmeza.html` (`id="rituais-simples"`), depois da Leitura da vela.
2. A defumação 5 entra **só com louro e arruda**. O cipó fica de fora até a casa confirmar qual.
3. O ajuste da seção 4 está aprovado: selo de orientação (campo `orientacao: true`, que também tira o banho das sugestões do dia), do pescoço para baixo quando feito sozinho, sem "supremo", rosa branca como opção.

## 6. Registro

- `data/banhos.js`: banho de romã e rosas (novo); banho de desenvolvimento mediúnico ajustado; banho de girassol sem "supremo" e com a variação de calêndula e oliveira.
- `data/defumacoes.js`: defumação para desatar nós (nova).
- `script/catalogo.js`: `isEsquerda` aceita `orientacao: true`; os painéis mostram o campo `origem`.
- `firmeza.html`: seção "Rituais simples do dia a dia" com os 4 rituais. A reza do prato de sal e pimenta foi adaptada ("se afastar" em vez de "voltar") e o site diz isso.
- `sw.js`: `fv-v51`.
- `script/catalogo.js`: o aviso do topo dos banhos do pescoço para baixo só mostra "o corpo fica vazio" e "resguardo obrigatório" em descarrego ou banho forte. Antes, aparecia em todo banho que não vai na cabeça, inclusive nos suaves.
- Teste: 375 px e 1440 px, console limpo, sem rolagem lateral; o banho mediúnico saiu das sugestões do dia.
