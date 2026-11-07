# Spec 012 — Chás da casa

> **Status:** aprovada pelo dono em 2026-11-07 ("vamos seguir com o que vc sugeriu"); pronta para o plano
> **Pedido por:** dono do site em 2026-11-06: "criação ou feitura de chás ou de misturas fáceis de fazer em casa". Mandou o chá que faz sempre (cravo, canela e gengibre, agora com abacaxi) e perguntou por chás com limão, laranja, uva e maçã.
> **Escrita por:** Claude
> **Origem do conteúdo:** a receita 1 é do dono. As receitas 2 a 6 são receitas caseiras populares, escritas por Claude e conferidas pelo dono no chat de 2026-11-07. Os textos estão todos aqui: **o executor não escreve receita, cuidado nem benefício novo.**
> Regras: `.specify/memory/constitution.md` (I.1, I.5, II.1, II.2, II.4, III.2)

## 1. Por quê

O dono faz chá em casa toda semana e quer ideias novas com frutas. O site já tem 28 chás espalhados nas fichas das **Ervas** (campo `cha`) e 24 nas fichas dos **Banhos** (campo `versaoCha`), mas ninguém os acha juntos. Uma página única reúne as receitas novas e aponta para as que já existem.

## 2. O quê

- Página nova **`chas.html`**, "Chás da casa", no menu **Rituais**, depois de "Defumações".
- **Parte 1, "Receitas da casa":** catálogo com as 6 receitas da seção 4, no mesmo formato de Banhos e Defumações (cartão e painel).
- **Parte 2, "Chás das ervas e dos banhos":** lista montada sozinha a partir de `ervas.cha` e `banhos.versaoCha`. Cada item leva à ficha de origem (`plantas.html#id` ou `banhos.html#id`). **Nada é copiado:** os dados continuam numa fonte só (V.1).

## 3. Requisitos

- **RF-01** Aviso fixo no topo da página, antes de tudo (II.1 e II.4):
  > **Chá é bebida, não remédio.** Gestantes, lactantes, crianças pequenas e quem toma remédio todo dia (para pressão, diabetes ou para afinar o sangue) devem conversar com o médico antes de tomar chá todo dia. Fique em 2 a 3 xícaras por dia. Se alguém passar mal depois de tomar um chá: **Disque-Intoxicação 0800 722 6001**.
- **RF-02** Dados em `data/chas.js` (`window.FV_DATA.chas`), com os campos da seção 5.
- **RF-03** Cartão: nome, para que serve (objetivo), momento do dia, "quente", "gelado" ou os dois.
- **RF-04** Painel (`getDrawer`): ingredientes, modo de preparo em passos numerados, como guardar, momento do dia, variações, **cuidados em destaque** (`dsec--warn`) e a linha de origem (`origemHtml`, da spec 011).
- **RF-05** Filtros: "Para" (objetivo) e "Momento" (manhã, noite, qualquer hora). Busca por nome e ingrediente.
- **RF-06** Parte 2: agrupada em "Das ervas" e "Dos banhos", em ordem alfabética, cada item com o nome da erva ou do banho e o começo do texto do chá. Erva com cuidado de toxicidade (II.2) não aparece aqui se não tiver o campo `cha`.
- **RF-07** Nenhuma promessa (III.2): sem "cura", "emagrece", "desintoxica", "acelera o metabolismo", "termogênico".
- **RF-08** Página nova no `PRECACHE`, `CACHE_VERSION` sobe, entra em `NAV` (IV.4) e na busca global, se a busca já indexar banhos e ervas.

## 4. As receitas (texto final)

Todas rendem **1 litro**. Regra comum, que vai num bloco curto acima do catálogo:
> O que é duro ferve junto com a água: canela, cravo, gengibre, casca de laranja e maçã. O que é delicado entra no fim, com o fogo desligado: limão, suco e uva. Coe antes de guardar. Com fruta, dura de 3 a 4 dias na geladeira, em garrafa de vidro bem fechada.

### 1. Chá da casa: cravo, canela, gengibre e abacaxi
- **id:** `cha-cravo-canela-gengibre-abacaxi` · **objetivo:** `energia` · **momento:** manhã · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; 7 cravos-da-índia; 1 pau de canela; 5 rodelinhas de gengibre; 1 a 2 xícaras de abacaxi (pedaços, miolo ou casca bem lavada).
- **Preparo:**
  1. Coloque tudo na panela com a água.
  2. Quando levantar fervura, abaixe o fogo e deixe de 8 a 10 minutos, com a panela semitampada.
  3. Desligue, tampe e deixe descansar 10 minutos.
  4. Coe ainda morno e guarde em garrafa de vidro.
- **Guardar:** 3 a 4 dias na geladeira. Não deixe os pedaços de abacaxi na garrafa: a fruta fermenta e o chá azeda.
- **Para que serve:** aquece e dá disposição para começar o dia. O abacaxi adoça e quebra o picante do gengibre.
- **Variações:** gelado, fica refrescante no calor.
- **Cuidados:** à noite, observe o sono: gengibre e canela deixam algumas pessoas mais despertas. Gengibre: pouco ou nada para quem toma remédio para afinar o sangue, tem gastrite ou pressão descontrolada. Gestantes: canela com moderação.
- **Origem:** "Receita do dono do site, enviada em 06/11/2026."

### 2. Limão com gengibre
- **id:** `cha-limao-gengibre` · **objetivo:** `energia` · **momento:** manhã · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; 5 rodelas de gengibre; 1 limão; folhas de hortelã (opcional).
- **Preparo:**
  1. Ferva a água com o gengibre por 8 minutos.
  2. Desligue e junte o limão em rodelas finas. Deixe 5 minutos.
  3. Coe.
- **Guardar:** até 3 dias na geladeira.
- **Para que serve:** refresca e desperta. É o mais fácil de todos.
- **Variações:** gelado, com hortelã. Para mais limão, esprema o suco na hora de beber.
- **Cuidados:** não ferva o limão com casca: deixa o chá amargo. Limão pode incomodar quem tem refluxo ou gastrite. Gengibre: os mesmos cuidados da receita 1.
- **Origem:** "Receita caseira popular, revisada pelo site."

### 3. Laranja com canela e cravo
- **id:** `cha-laranja-canela-cravo` · **objetivo:** `harmonizacao` · **momento:** qualquer hora · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; casca de 1 laranja bem lavada, sem a parte branca; suco da mesma laranja; 1 pau de canela; 5 cravos-da-índia.
- **Preparo:**
  1. Ferva a água com a casca, a canela e o cravo por 10 minutos.
  2. Desligue e junte o suco da laranja.
  3. Coe.
- **Guardar:** 3 a 4 dias na geladeira.
- **Para que serve:** chá de aconchego, com cheiro de casa. Lembra quentão, sem álcool.
- **Variações:** quente nos dias frios, gelado nos quentes.
- **Cuidados:** a parte branca da casca amarga o chá. Laranja pode incomodar quem tem refluxo. Gestantes: canela com moderação.
- **Origem:** "Receita caseira popular, revisada pelo site."

### 4. Maçã com canela
- **id:** `cha-maca-canela` · **objetivo:** `calma` · **momento:** noite · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; 1 maçã em cubos, com casca; 1 pau de canela.
- **Preparo:**
  1. Ferva a água com a maçã e a canela por 10 a 12 minutos.
  2. Desligue, tampe e deixe 5 minutos.
  3. Coe.
- **Guardar:** 3 a 4 dias na geladeira.
- **Para que serve:** a maçã adoça sozinha, sem açúcar. Bom para o fim do dia.
- **Variações:** **versão para dormir:** com o fogo desligado, junte 1 colher de sopa de camomila ou de erva-cidreira e deixe abafado 10 minutos.
- **Cuidados:** camomila: evite se tiver alergia a margaridas ou crisântemos. Gestantes: canela com moderação.
- **Origem:** "Receita caseira popular, revisada pelo site."

### 5. Uva com laranja
- **id:** `cha-uva-laranja` · **objetivo:** `harmonizacao` · **momento:** qualquer hora · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; 1 xícara de uvas roxas amassadas; casca de meia laranja bem lavada, sem a parte branca.
- **Preparo:**
  1. Ferva a água com a casca da laranja por 5 minutos.
  2. Junte as uvas e deixe mais 3 minutos no fogo.
  3. Desligue, deixe 10 minutos e coe bem.
- **Guardar:** até 3 dias na geladeira.
- **Para que serve:** chá de frutas vermelhas, de cor bonita e gosto suave.
- **Variações:** misture o chá frio com suco de uva integral, meio a meio.
- **Cuidados:** coe bem, para não ficar semente nem casca de uva. Laranja pode incomodar quem tem refluxo.
- **Origem:** "Receita caseira popular, revisada pelo site."

### 6. Maçã, abacaxi e gengibre
- **id:** `cha-maca-abacaxi-gengibre` · **objetivo:** `energia` · **momento:** manhã · **servir:** quente ou gelado
- **Ingredientes:** 1 litro de água; casca e miolo de 1 abacaxi bem lavados; meia maçã em cubos; 3 rodelas de gengibre.
- **Preparo:**
  1. Ferva tudo junto por 10 minutos.
  2. Desligue, tampe e deixe 10 minutos.
  3. Coe.
- **Guardar:** 3 a 4 dias na geladeira.
- **Para que serve:** aproveita a casca e o miolo do abacaxi, que dão muito sabor.
- **Variações:** junte 1 pau de canela para ficar mais perto do chá da casa.
- **Cuidados:** lave bem a casca do abacaxi com escovinha antes. Gengibre: os mesmos cuidados da receita 1.
- **Origem:** "Receita caseira popular, revisada pelo site."

## 5. Campos de `data/chas.js`

| Campo | Tipo | Exemplo |
|---|---|---|
| `id` | texto | `"cha-limao-gengibre"` |
| `nome` | texto | `"Limão com gengibre"` |
| `objetivo` | um dos 7 da constituição (IV.6) | `"energia"` |
| `momento` | `"manha"`, `"noite"` ou `"qualquer"` | `"manha"` |
| `servir` | lista: `"quente"`, `"gelado"` | `["quente","gelado"]` |
| `ingredientes` | lista de textos | |
| `preparo` | lista de passos | |
| `guardar` | texto | |
| `servePara` | texto | |
| `variacoes` | texto (pode faltar) | |
| `cuidados` | texto, **obrigatório** | |
| `origem` | texto, **obrigatório** | |

## 6. Critérios de aceite

- **CA-01** O aviso da RF-01 aparece antes do catálogo, a 375 px, sem rolar.
- **CA-02** As 6 receitas aparecem com o texto da seção 4, sem palavra nova.
- **CA-03** Todo painel mostra cuidados e origem.
- **CA-04** A Parte 2 lista os chás das ervas e dos banhos, e cada link abre a ficha certa.
- **CA-05** Funciona offline; console limpo; sem rolagem lateral a 375 px e 1440 px.

## 7. Fora do escopo

- Corrigir os textos antigos de `cha` e `versaoCha` (alguns prometem demais, como "induz ao sono"). Fica para uma revisão à parte.
- Chás de ervas fortes ou tóxicas.
