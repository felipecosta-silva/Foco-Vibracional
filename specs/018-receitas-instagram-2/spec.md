# Spec 018: Receitas vindas do Instagram, 2º lote (triagem)

> **Status:** feita por Claude em 2026-11-19. Não publicada.
> **Pedido:** o dono colou a transcrição de 12 postagens, em dois blocos. Cada uma traz "Pontos importantes que não estão ditos", comentários de quem resumiu as postagens.
> **Origem:** postagens de redes sociais. **Não são fonte de tradição.** Cada item que entrou leva a linha de origem "rede social, enviada pelo dono do site em 19/11/2026".
> **Regras:** `.specify/memory/constitution.md` (I.1, I.4, II e III), seguindo o modelo da spec 011.

## Como os comentários foram lidos

- **Entram como cuidado:** os comentários de segurança e de bom senso.
  - Mel não vai para bebê com menos de 1 ano, por causa do botulismo.
  - O mel leva só flor seca.
  - Vidro trinca com calor.
  - Algodão e açúcar pegam fogo.
  - Mel e fruta atraem formiga.
  - Grão parado junta caruncho.
  - Banho quente à noite pode tirar o sono.
  - O boldo não se ferve.
- **Não entram como fato:**
  - correspondências fixas: "muito alinhada à linha de Pombagira" e "energia de Oxalá e dos Pretos-Velhos" (III.4 e I.4);
  - promessas de efeito, como a lista de usos medicinais do mel (III.2 e III.3).

## Triagem

| # | Postagem | Onde entrou | Ajustes |
|---|---|---|---|
| 1 | Copo de arroz | Firmeza › Rituais simples | Manutenção a cada 30 dias, porque o arroz junta caruncho. |
| 2 | Banho de prosperidade para homens | Banhos (`prosperidade`, médio) | <ul><li>Do pescoço para baixo.</li><li>Ferver só o que é duro e abafar o louro e a laranja.</li><li>Aviso do sono e da pele.</li></ul> |
| 3 | Banho de louro | Já existe ("Banho de Folhas de Louro Puro") | <ul><li>Não ganhou banho novo: a forma da postagem foi para a observação do banho que já existe.</li><li>Entraram a água que não ferve, a toalha e as folhas que voltam à terra.</li><li>Também entrou que o louro atrai e não limpa.</li><li>E que a quinta-feira é dia de Júpiter na magia planetária.</li></ul> |
| 4 | Ritual cigano da laranja | Firmeza › Rituais simples | <ul><li>A vela fica num pires à parte, nunca no meio do alecrim seco.</li><li>Cuidado com formigas.</li><li>Nota: oferenda a uma linha é coisa de cada casa; quem não trabalha com o Povo Cigano reza ao anjo da guarda.</li></ul> |
| 5 | Mel de camomila e de lavanda | Chás (`calma`, noite) | <ul><li>**Sem a lista de usos medicinais.** Fica só "pela tradição popular, acalma, ajuda a dormir, conforta a garganta".</li><li>Avisos: bebê, flor seca, lavanda culinária, gestantes e diabetes.</li></ul> |
| 6 | Curiosidades do capim-santo | Chás (novo chá) e Ervas (capim-limão) | <ul><li>O chá recebeu o preparo caseiro popular, porque a postagem não traz receita.</li><li>Em Ervas, a ficha agora explica as três "cidreiras".</li><li>Saiu a promessa "baixa a pressão arterial", que virou cuidado.</li><li>"Energia de Oxalá e dos Pretos-Velhos" não entrou.</li></ul> |
| 7 | Banho de boldo (7 ou 10 folhas) | Já existe ("Banho da Paz de Oxalá") | <ul><li>Não ganhou banho novo.</li><li>As duas medidas, a reza e o aviso da espécie (*Plectranthus barbatus*) foram para a observação do banho que já existe.</li></ul> |
| 8 | Pote da prosperidade | Firmeza › Rituais simples | <ul><li>Lavar as moedas com água e sabão.</li><li>Trocar os grãos todo mês.</li></ul> |
| 9 | Pastilhas de ervas para o rechaud | Firmeza › Rituais simples | <ul><li>Água na base do rechaud e cuidado com a velinha.</li><li>Óleos essenciais longe de pets.</li><li>Não comer.</li></ul> |
| 10 | Defumação contra brigas (café, açúcar e orégano) | Defumações (`harmonizacao`, suave) | <ul><li>**Defumador de barro ou de metal** no lugar do pote de vidro.</li><li>Algodão e açúcar pegam fogo: ter tampa à mão.</li><li>As dicas da autora entraram (orégano no dia a dia, pano com chá de camomila e a versão de prosperidade).</li></ul> |
| 11 | Banho de magnetismo e poder pessoal | Banhos (`energia`, médio, lua nova) | <ul><li>Do pescoço para baixo.</li><li>"Banho para você, nada de dirigir a alguém" (III.3).</li><li>Sem a frase sobre Pombagira.</li><li>Vela sempre sobre pires.</li><li>Gestantes não usam hibisco.</li></ul> |
| 12 | Sigilos (joia de proteção e abundância infinita) | **Não entrou** | <ul><li>São só capturas de vídeo, sem o passo a passo.</li><li>A joia usa vela preta, que é trabalho de esquerda.</li><li>O site já ensina a fazer sigilo em Símbolos.</li></ul> |

## Para o dono confirmar

- **Ritual 4:** entrou como ritual simples, com a nota sobre a linha cigana. Se preferir, recebe o selo "Só com orientação".
- **Banho 11:** ficou só na lua nova, como na receita.
- **Sigilos:** se você mandar o passo a passo, eles podem entrar em Símbolos.

## Registro

- **Dados:**
  - `data/banhos.js`: 2 banhos novos (96 no total); o louro e o boldo foram completados.
  - `data/defumacoes.js`: 1 defumação nova (38).
  - `data/chas.js`: 2 itens novos (8).
  - `data/ervas.js`: a ficha do capim-limão (diferenciação e chá).
- **`firmeza.html`:** 4 itens novos em Rituais simples, e a linha de origem foi atualizada.
- **`sw.js`:** `CACHE_VERSION` continua fv-v59, porque esse pacote ainda não foi publicado e nenhum arquivo novo entrou no precache.
