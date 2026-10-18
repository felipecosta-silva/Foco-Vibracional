# Foco Vibracional & Sabedoria da Jurema Sagrada
## Documento de Contexto, Fundamentos e Evolução Técnica

> *"Jurema é um pau sagrado, onde Jesus descansou;  
> Deu sombra, deu abrigo, a quem o Pai consagrou."*  
> — Ponto tradicional da Jurema Sagrada

---

## 1. Carta do Velho Juremeiro: O Propósito Deste Guia

Ao longo de mais de 30 anos vivenciando a ciência da Jurema Sagrada, entre as matas, o chão batido, as fumaças de cachimbo, as quartinhas de barro e o aroma das folhas pisadas, uma verdade sempre permaneceu viva: **a espiritualidade verdadeira é acolhimento, cura e partilha desinteressada.**

Muitos chegam ao caminho espiritual perdidos, assustados por misticismos pesados, promessas vazias ou cobranças indevidas. Este projeto nasceu da união de dois mundos:
1. **O chão da Jurema:** O conhecimento tradicional das ervas, dos banhos de firmeza, do respeito à cabeça (Ori), da defumação e da vibração dos pensamentos.
2. **O desenvolvimento web:** A tecnologia como ponte para organizar, clarear e entregar esse saber de forma limpa, moderna, gratuita e acessível a qualquer pessoa pelo celular ou computador.

Aqui, nenhum filho de fé ou consulente precisa pagar por um guia de paz ou ter medo de uma folha. Este portal é a quartinha d'água fresca deixada na beira da estrada para quem tem sede de verdade.

---

## 2. Diagnóstico Inicial: O Que Havia no Projeto

Ao revisar detalhadamente o repositório (`Foco-Vibracional`), identificamos a seguinte situação:

### A. Pontos Positivos Encontrados
- **Arquitetura estática limpa:** Estrutura HTML/CSS/JS sem dependências pesadas, ideal para hospedar gratuitamente em plataformas como GitHub Pages ou rodar localmente.
- **Identidade estética moderna:** Paleta escura com gradientes e cartões elegantes já delineados em `styles.css`.
- **Diversidade de páginas temáticas:** Páginas dedicadas a Início, Mantras, Plantas, Banhos, Defumação, Colheita, Glossário, Calendário Lunar, Portais, Afirmações e Perguntas.

### B. Gargalos e Inconsistências Críticas
1. **`banhos.html` inoperante:** O HTML continha a barra de filtros, seletores lunares e contadores, e o arquivo `data/banhos.json` existia, mas **não havia uma única linha de código JavaScript** no `script.js` para renderizar os dados ou responder aos filtros. A tela ficava vazia.
2. **`defumacao.html` inoperante:** Mesma situação; os dados em `data/defumacoes.json` nunca eram carregados na tela.
3. **`plantas.html` quebrado por descompasso de seletores e atributos:** O script tentava buscar IDs `#ervasList`, `#ervaSearch` e propriedades inexistentes (`e.tipo`, `e.tags`), enquanto o HTML oficial continha `#herbGrid`, `#qHerb`, `#fEnergia` e o JSON usava `energia`, `usos`, `partes`, `cuidados`. O catálogo de ervas não aparecia.
4. **Dependência vulnerável ao CORS / protocolo `file:///`:** O carregamento via `fetch()` direto falhava caso o consulente abrisse o arquivo HTML diretamente no navegador (dois cliques), sem um servidor local rodando.
5. **Navegação fragmentada:** Links fundamentais como Plantas, Banhos e Defumação haviam sumido do menu de páginas como `afirmacoes.html` e `perguntas.html`. O link de Portais sumia em várias telas.
6. **Falta de profundidade e fundamentos ancestrais:** Os dados continham textos genéricos, sem o coração da tradição das ervas (a distinção vital entre ervas frias para a coroa e ervas quentes para o pescoço para baixo, as orações tradicionais e o sentido de defumar).

---

## 3. O Que Foi Realizado Nesta Etapa

Todas as correções técnicas e elevações conceituais foram implementadas de ponta a ponta:

### 3.1. Motor JavaScript Unificado e Blindado (`script/script.js`)
- **Implementação dos Módulos Faltantes:**
  - `initPlantasPage()`: Renderização dinâmica, busca em tempo real e filtros múltiplos (energia, uso, objetivo, parte da planta e intensidade).
  - `initBanhosPage()`: Renderização completa com badges de permissão na cabeça, orações consagradas, cópia de reza em 1 clique e leitura por voz (Web Speech API).
  - `initDefumacaoPage()`: Renderização com sentido de defumação, oração tradicional, precauções de queima e filtros dinâmicos.
- **Sistema de Fallback Offline / `file:///` Nativo:**
  - Caso o navegador bloqueie o `fetch('./data/...')` por estar em ambiente offline ou protocolo de arquivos locais, o script aciona automaticamente as bases em memória (`FALLBACK_ERVAS`, `FALLBACK_BANHOS`, `FALLBACK_DEFUMACOES`, `FALLBACK_MANTRAS`). O site agora funciona **em 100% dos ambientes**, com ou sem servidor.
- **Modo Iniciante / Avançado Sincronizado:**
  - Persistência no `localStorage` sob a chave `foco.mode.v1`, ativando detalhes de fundamentos profundos para praticantes e mantendo a visão acolhedora para iniciantes.

### 3.2. Enriquecimento dos Dados e Fundamentos da Jurema
- **`data/ervas.json`:**
  - Inclusão das ervas regentes da tradição: Jurema-Preta, Alecrim, Arruda, Guiné, Manjericão, Boldo (Tapete de Oxalá), Alfazema, Camomila, Louro, Hortelã, Capim-Santo, Espada de Ogum.
  - Atributo fundamental `cabeca`: Instrução inequívoca sobre quando a erva pode tocar a coroa e quando deve ser mantida apenas do pescoço para baixo.
  - Notas de tradição, colheita e cuidados para peles sensíveis.
- **`data/banhos.json`:**
  - Banhos completos estruturados por necessidade espiritual: *Descarrego Forte*, *Alinhamento do Ori e Paz Interior*, *Abertura de Caminhos e Prosperidade Solar*, *Firmeza Espiritual e Escudo*, *Serenidade e Sono Reparador*, *Renovação de Energia e Disposição*.
  - Instruções de preparo de folhas vivas (maceração com as próprias mãos) e orações consagradas para ativação energética.
- **`data/defumacoes.json`:**
  - Defumações com sentido direcional fundamentado: *Purificação e Descarrego* (do fundo para a rua) e *Atração e Prosperidade* (da rua para dentro).
  - Orações tradicionais e alertas práticos de segurança com brasas e ventilação.

### 3.3. Unificação Visual e Navegação
- **Menu Completo e Coerente:** As 11 páginas agora compartilham a mesma barra de navegação fluida:
  1. Início (`index.html`)
  2. Mantras & Firmezas (`mantras.html`)
  3. Catálogo de Plantas (`plantas.html`)
  4. Banhos Sagrados (`banhos.html`)
  5. Defumação (`defumacao.html`)
  6. Colheita Simbólica (`colheita.html`)
  7. Glossário de Conceitos (`glossario.html`)
  8. Calendário Lunar (`calendario.html`)
  9. Portais Numéricos (`portais.html`)
  10. Afirmações Diárias (`afirmacoes.html`)
  11. Perguntas Reflexivas (`perguntas.html`)
- **Estilo Refinado (`styles/styles.css`):**
  - Criação das classes `.badge-safe` (verde para ervas/banhos permitidos na cabeça) e `.badge-danger` (âmbar para advertência de pescoço para baixo).
  - Toasts flutuantes com efeito de desvanecimento e backdrop blur.
  - Efeitos táteis e microinterações de elevação nos cartões.

### 3.4. Melhorias Visuais, Fotos Botânicas e Detecção da Lua em Tempo Real
- **Correção Definitiva das Listas Suspensas (`<select>`):**
  - Identificado o motivo das telas brancas nos seletores em navegadores Windows/Chromium: a falta de cor de fundo sólida em `<option>` gerava texto branco sobre fundo branco do sistema operacional.
  - Implementado CSS de alto contraste com fundo escuro sólido (`#111827 !important`), texto claro nítido (`#f8fafc !important`) e ícone indicador em SVG nativo em todas as páginas (`plantas.html`, `banhos.html`, `defumacao.html`, `colheita.html`, `portais.html`).
- **Substituição de Imagens & Armazenamento Local 100% Offline (`images/*.jpg`):**
  - As imagens anteriores apontavam para links externos sujeitos a bloqueios HTTP 403 e erros de busca (a imagem antiga de arruda mostrava tomates-cereja e a de alfazema uma árvore solitária na névoa).
  - Todas as 12 plantas sagradas receberam ilustrações e fotos botânicas fiéis, geradas e armazenadas localmente no diretório `images/` (`arruda.jpg`, `alfazema.jpg`, `boldo.jpg`, `guine.jpg`, `jurema.jpg`, `espada.jpg`, `alecrim.jpg`, `manjericao.jpg`, `camomila.jpg`, `louro.jpg`, `capim_limao.jpg`, `hortela.jpg`).
- **Redesenho dos Cartões (Fim da Delimitação Repetitiva de Linhas):**
  - Removido o acúmulo excessivo de bordas e caixas delimitadoras de linha única (`.kv li`). O layout agora adota tipografia editorial espaçada, permitindo leitura limpa e fluida.
  - Destaque nobre para as permissões na cabeça (Ori) e para os quadros sagrados de diferenciação ancestral.
- **Motor de Detecção da Lua de Hoje no Céu:**
  - Implementado o cálculo astronômico sinódico em tempo real (`getLiveMoonData()`), que informa exatamente aos consulentes e praticantes qual a lua presente no céu no momento exato da visita (ex.: Lua Nova, Crescente, Cheia ou Minguante, porcentagem de iluminação e idade do ciclo).
  - Criação do banner dinâmico `.today-moon-banner` nas páginas de Banhos, Defumação e Colheita, acompanhado pelo selo pulsante "HOJE NO CÉU" sobre a fase ativa e botão direto para filtrar rituais e práticas ideais para a data atual.
  - Integração do widget da Lua de Hoje no cartão "Agora" da página inicial (`index.html`).

### 3.5. Correção de Fundo, Sequências Grabovoi Interativas e Novo Módulo de Símbolos Sagrados
- **Eliminação da "Repartição de Sombra" no Fundo:**
  - O gradiente anterior utilizava elipses com raio truncado a 50% de altura combinadas com `height: 100%`, criando uma visível costura ou linha horizontal de sombra que parecia "repartir" o fundo das telas.
  - O CSS em `styles.css` foi refinado com um gradiente circular difuso de grande amplitude (`radial-gradient(circle at 50% 0%, ...)`) e fixação absoluta (`background-attachment: fixed`), garantindo uma transição aveludada, escura e completamente contínua, sem nenhuma linha de corte ou divisão artificial em qualquer resolução ou rolagem.
- **Transformação do Módulo Grabovoi na Página Inicial (`index.html`):**
  - Anteriormente, a página inicial mostrava apenas uma sequência fixa estática (`520 741 777 888`) e continha um link quebrado direcionando para `mantras.html#sequencias` (onde não existiam sequências numéricas).
  - A seção foi reconstruída como um **widget interativo dinâmico**:
    * Botões de alternância rápida (*pills*): Prosperidade Máxima (`520 741 777 888`), Dinheiro Inesperado (`520`), Solução Imediata (`741`), Milagres & Fé (`777`), Saúde & Vitalidade (`1814321`), Tudo é Possível (`519 7148`), Paz Interior (`1001105010`), Proteção Total (`917 498 814316`) e botão de Sorteio Aleatório (`🎲`).
    * Exibição visual destacada com quebra harmoniosa dos blocos numéricos.
    * Botão de cópia automática e botão de pronúncia pausada via síntese de voz (Web Speech API).
    * Correção definitiva do redirecionamento: o botão agora aponta para `portais.html#grabovoi`, onde fica o catálogo completo com filtros de busca.
- **Expansão do Catálogo de Sequências em `portais.html`:**
  - Base ampliada para 15 sequências tradicionais, com novas categorias de filtro adicionadas ao seletor (`saude`, `limpeza`, `prosperidade`, `foco`, `calma`, `protecao`, `harmonizacao`).
- **Criação da Nova Página de Símbolos Sagrados (`simbolos.html`):**
  - Estruturada em 4 grandes abas temáticas interativas:
    1. **Pontos Riscados (Fundamento de Pemba & Jurema):** A ciência do giz consagrado, anatomia dos símbolos ancestrais (Flechas, Cruzes de Pemba, Ondas/Âncoras, Sol/Estrelas, Espadas/Raios, Chaves/Trancas), fundamentos das falanges (Caboclos, Pretos Velhos e Mestres) e os 4 preceitos éticos inegociáveis de terreiro (não riscar por curiosidade, respeito ao Ori, como desmanchar com pano branco consagrado).
    2. **Runas Sagradas (Elder Futhark):** O alfabeto vibracional do Norte com todos os 24 glifos nórdicos autênticos em Unicode, significados arquetípicos, filtros por objetivo e a ferramenta interativa **"Tirar Runa do Momento"** (oráculo com conselho do Velho Juremeiro, afirmação diária e narração por áudio).
    3. **Mandalas Vibracionais & Respiração Guiada 4-2-6:** 4 mandalas originais em SVG de alta definição (*Flor da Vida Cósmica*, *Mandala Solar da Prosperidade*, *Mandala Esmeralda da Jurema* e *Mandala Safira das Águas*), integradas a um cronômetro visual de coerência cardíaca e pranayama (Inspire 4s → Retenha 2s → Expire 6s) com pulsação geométrica sincronizada.
    4. **Criador de Sigilos & Roda Numérica Cósmica (Austin Osman Spare & Magia Geométrica):** Estúdio interativo onde o praticante digita sua intenção e acompanha o processo autêntico de condensação esotérica em tempo real: (1) Frase Original → (2) Eliminação de Vogais → (3) Corte de Repetições → (4) Conversão na Tabela Pitagórica Universal (1 a 9) → (5) Traçado do Sigilo na Roda Mística do Relógio (nó de origem, arcos harmônicos ou retas cristalinas e barra terminal de ancoragem). Inclui exportação do glifo em SVG para impressão ou amuleto, cópia de dados, animação de risco e tabela de consulta.
- **Unificação da Barra de Navegação nas 12 Páginas:**
  - O link `<a class="nav__link" href="simbolos.html">Símbolos</a>` foi incluído harmonicamente em todas as 12 páginas do portal, mantendo a experiência do usuário coesa e fluida.

### 3.6. Expansão das Tradições de Defumação, Banhos, Despoluição Visual e Ergonomia
- **Expansão Massiva da Base de Defumações (`defumacao.html` e `data/defumacoes.json`):**
  - O catálogo de defumações contava anteriormente com apenas 4 receitas e 1 única opção no filtro de Limpeza.
  - O acervo foi expandido para **15 formulações completas e fundamentadas**, incluindo as variações consagradas solicitadas pelos praticantes:
    1. *Casca de Alho Pura* (quebra de quebras, descarrego leve e prático)
    2. *Pó de Café Puro na Brasa ou Frigideira* (absorção de miasmas e quebra de tristeza crônica)
    3. *Casca de Alho com Pó de Café* (a dupla clássica de purificação pesada de terreiro)
    4. *Descarrego Pesado de Três Folhas* (Arruda + Guiné + Casca de Alho)
    5. *Casca de Alho & Eucalipto Seco* (purificação com desobstrução mental)
    6. *Pinhão Roxo & Guiné* (quebra de correntes densas)
    7. *Defumação Doce de Café, Açúcar e Canela* (o clássico ritual de atração de dinheiro e clientes)
    8. *Prosperidade Solar de Louro, Canela e Cravo*
    9. *Fartura dos Caboclos* (Palha de Milho Seca e Açúcar Cristal)
    10. *Dinamismo & Boas Vendas* (Pitangueira e Alecrim)
    11. *Harmonia do Lar* (Alfazema, Camomila e Benjoim)
    12. *Paz & Equilíbrio* (Alecrim e Manjericão Secos)
    13. *Resinas dos Três Reis Magos* (Benjoim, Mirra e Estoraque)
    14. *Escudo de Porteira* (Cascas de Cebola e Alho)
    15. *Firmeza de Negócios* (Alecrim, Eucalipto e Louro)
  - Implementação do guia de destaque didático: *"🍳 O Segredo da Cozinha: Defumação na Frigideira Seca"*, permitindo que consulentes em apartamentos ou sem braseiro façam defumações poderosas com casca de alho, café e açúcar no fogão.
  - Inclusão dos *Pills* de categoria rápida (`#defumacaoPills`) sincronizados com o seletor.
- **Expansão do Acervo de Banhos Sagrados (`banhos.html` e `data/banhos.json`):**
  - Base expandida de 6 para **12 banhos sagrados autênticos**, contemplando fórmulas puras (Boldo puro de Oxalá, Louro puro de atração, Casca de alho com sal grosso nos pés/joelhos) e banhos compostos de firmeza, sono e renovação.
  - Inclusão de *Pills* de categoria rápida (`#banhoPills`) e painel explicativo sobre a Coroa (Ori) e a maceração de folhas vivas.
- **Ajuste Responsivo da Barra de Navegação (`styles/styles.css`):**
  - Corrigida a quebra de linha que isolava "Afirmações" e "Perguntas" em uma segunda linha feia em telas médias.
  - Implementada rolagem horizontal tátil suave (`overflow-x: auto; flex-wrap: nowrap`) em telas menores, mantendo os 12 itens do menu sempre lineares e elegantes.
- **Grade Dinâmica de Cartões (`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`):**
  - Fim da grade rígida de 3 colunas que deixava espaços vazios desengonçados quando a filtragem exibia apenas 1 ou 2 resultados.
- **Despoluição Visual Radical das Telas de Afirmações (`afirmacoes.html`) e Perguntas (`perguntas.html`):**
  - Substituição de dezenas de botões grandes empilhados pelo componente limpo `.quote-strip` com micro-ações `.btn-micro` (📋 Copiar e 🔊 Ouvir). A interface agora respira, trazendo foco à oração e reflexão.
- **Enriquecimento Conceitual do Glossário (`glossario.html`):**
  - Adição dos termos fundamentais: *Ori (A Coroa Espiritual)*, *Defumação Doce vs. Descarrego*, *Pemba e Pontos Riscados*, *Runas Nórdicas* e *Mandalas Vibracionais*.

### 3.7. Construção do Almanaque Virtual Completo: Banhos Sagrados, Defumações e Ervas Tradicionais
- **Expansão Massiva do Catálogo de Banhos (`banhos.html` e `data/banhos.json`):**
  - Acervo ampliado para **27 banhos fundamentados**, cobrindo todas as necessidades do consulente e praticante de terreiro:
    1. *Banho Solar de Girassol* (pétalas frescas e sementes imantadas no sol para magnetismo, ouro e autoestima — liberado na cabeça);
    2. *Banho de Brilhantina Fresca* (orvalho sagrado de Oxum para viço, frescor e doçura — liberado na cabeça);
    3. *Banho de Samambaia das Matas* (aterramento de cargas pesadas, quebra de olho-gordo e força de Oxóssi);
    4. *Banho de Folha de Manga com Alecrim* (força de Boiadeiro, vigor, quebra de moleza e ânimo guerreiro);
    5. *Banho de Folha de Amora com Alfazema* (acolhimento maternal de Nanã, cura de mágoas e consolo em momentos de luto — liberado na cabeça);
    6. *Banho de Anis Estrelado com Camomila* (clarividência, abertura do terceiro olho, sonhos lúcidos e magnetismo cigano — liberado na cabeça);
    7. *Banho de Canela em Pau com Louro* (calor de prosperidade, atração de clientes e dinheiro — do pescoço para baixo);
    8. *O Trio da Vitalidade Viva* (Hortelã fresca + Alecrim + Manjericão — frescor, disposição e clareza mental — liberado na cabeça);
    9. *Banho na Força das Mestras da Jurema* (Rosas brancas/amarelas, alfazema, anis e manjericão doce para encanto, desatar nós afetivos e amor-próprio);
    10. *Banho na Força dos Mestres da Jurema e Catimbó* (Jurema-preta, louro, alecrim e eucalipto para desobstrução de caminhos e firmeza de negócios);
    11. *Banho de Porteira na Força de Exu e Guardiões* (Casca de alho, pinhão roxo, manga e mamona para quebra de demanda pesada e blindagem de encruza);
    12. *Banho na Força de Boiadeiro* (Manga, samambaia, eucalipto e guiné para desenroscar assuntos difíceis e trazer persistência sertaneja);
    13. *Banho 2 em 1: Descarrego e Reenergização Simultânea* (fórmula alquímica balanceada com Arruda/Guiné para corte e Alecrim/Manjericão/Alfazema para preenchimento imediato);
    14. *Banho de Revitalização Pós-Doença & Convalescença* (Boldo, folha de amora, pitangueira e camomila para recomposição celular e energética);
    15. *Banho das 7 Ervas Sagradas de Terreiro* (Arruda, Guiné, Espada de São Jorge, Alecrim, Manjericão, Boldo e Alfazema — a blindagem universal de fim de ano e viradas de ciclo).
- **Expansão das Defumações Tradicionais (`defumacao.html` e `data/defumacoes.json`):**
  - Acervo ampliado para **19 formulações completas**, incluindo:
    * *Casca de Cebola Pura* (queima de fofocas, calar a "língua de fogo" e desfazer intrigas de vizinhança);
    * *O Trio da Cozinha Sagrada* (Casca de alho, casca de cebola e louro seco para queima rápida na frigideira seca em menos de 10 minutos);
    * *Defumação na Força de Boiadeiro* (Palha de milho seca, pó de café e folha de manga para sacudir marasmo comercial e atrair compradores);
    * *Defumação Doce das Mestras da Jurema* (Canela, anis estrelado, alfazema e açúcar cristal para harmonização conjugal e aroma encantado no lar).
- **Expansão do Herbário Ancestral (`plantas.html` e `data/ervas.json`):**
  - Acervo ampliado para **22 plantas e ervas sagradas detalhadas**, com diferenciações botânicas e tradicionais profundas:
    * *Girassol* (pétalas de magnetismo vs. sementes de multiplicação de fartura);
    * *Brilhantina* (erva viva de Oxum para viço e doçura);
    * *Samambaia* (erva de Oxóssi para aterramento vegetal e filtro de entrada);
    * *Folha de Manga* (folha de ferro e fogo dos Boiadeiros e de Ogum para quebra de prostração);
    * *Folha de Amora* (bálsamo de Nanã para cura emocional e sabedoria ancestral);
    * *Anis Estrelado* (a estrela de 8 pontas do Povo Cigano e das Mestras para clarividência e amor);
    * *Canela* (o fogo da prosperidade para sopro de primeiro de mês e aquecimento financeiro);
    * *Pinhão Roxo / Pião Roxo* (o pára-raios vegetal contra demandas graves e quebra de feitiços de prostração);
    * *Peregúm / Peregum* (a folha mestra do Bate-Folha e Sasanyin de Ogum e Oxóssi);
    * *Folha da Mamona* (a esteira de descarrego que suga miasmas para a terra de Omulu e Exu);
    * *Folha do Mamão* (o descarrego da Linha das Almas para decompor pesos crônicos nas costas e ombros).
- **Almanaque de Práticas Tradicionais no Glossário (`glossario.html`):**
  - Documentação em profundidade dos fundamentos centrais de terreiro:
    * *O Ritual do Bate-Folha (Sacudimento)*: como ramos vivos de peregum, manga, mamona e pinhão roxo são percutidos suavemente da cabeça aos pés para arrancar larvas astrais antes do banho;
    * *A Tríplice da Limpeza Pesada*: Pinhão Roxo, Peregum e Mamona na proteção de porteira;
    * *Espada de Ogum vs. Espada de Santa Bárbara*: a lâmina de ferro frio de corte de demanda contra o raio flamejante de transmutação de Iansã;
    * *A Ciência do Banho 2 em 1*: o equilíbrio de ervas quentes com frias/mornas para nunca deixar o corpo esvaziado;
    * *As Linhas Espirituais e seus Axés Vegetais*: a vibração de Mestras, Mestres, Boiadeiros e Guardiões de encruzilhada.

### 3.8 O Axé da Cozinha Sagrada e Ervas Populares Acessíveis (63 Banhos • 50 Ervas • 25 Defumações)

Atendendo ao princípio ancestral de que **a espiritualidade deve estar ao alcance de todos**, o catálogo foi massivamente expandido com plantas e temperos do cotidiano:
- **Ervas Culinárias com Poder de Terreiro:** Salsa (*Petroselinum crispum*), Orégano (*Origanum vulgare*), Tomilho (*Thymus vulgaris*), Cravo-da-Índia, Noz-Moscada, Erva-Doce/Funcho, Gengibre, Manjerona, Sálvia, Coentro.
- **Folhas Frutíferas e Flores de Cura:** Folha de Goiabeira (fechamento de corpo e blindagem contra drenos áuricos), Folha de Pitangueira (dinamismo e quebra de lentidão), Folhas e Flores de Laranjeira (doçura e superação de tristeza), Rosa Branca (Ori de Oxalá), Rosa Vermelha (magnetismo das Mestras), Rosa Amarela (Ouro de Oxum), Rosa Cor-de-Rosa (Ibejis e Nanã), Arnica (cicatrização áurica pós-conflito).
- **As Folhas Mestras de Reerguimento e Coroa:** Abre-Caminho (*Justicia gendarussa*), Levante (*Mentha crispa*), Saião / Folha-da-Fortuna (*Kalanchoe pinnata*), Espada de Santa Bárbara, Colônia (*Alpinia zerumbet*) e Eucalipto.
- **Catálogo Expandido:**
  * **63 Banhos Tradicionais Completos** com receitas, rezas, dias, luas e regras de cabeça;
  * **50 Ervas Sagradas e de Horta** com fichas botânicas, energéticas e instruções de uso em chá medicinal;
  * **25 Fórmulas de Defumação** de quebra rápida de olho-gordo, fartura e paz no lar;
  * **Paginação Cósmica Inteligente** (9 banhos/página = 7 páginas, 8 ervas/página = 7 páginas) com busca tolerante a digitação e opção de "Ver Todos".

### 3.9 As Novas Fórmulas Sagradas, Ciclos em 2 Tempos & Medicina dos Chás
- **Ciclos Sagrados em 2 Etapas (Limpar & Depois Construir):** Seção de destaque em `banhos.html` ensinando a nunca fazer apenas um descarrego sem ancorar desenvolvimento e proteção (ex.: Boldo na coroa + Samambaia, Anis e Alfazema no dia seguinte).
- **Banho de Desenvolvimento Mediúnico & Intuição Lúcida (Samambaia, Anis-Estrelado & Alfazema):** Abertura serena da percepção espiritual e alinhamento do Ori.
- **Banho do Triunfo & Caminhos Abertos (Abre-Caminho, Levante & Louro):** Destrava portas emperradas e devolve o ânimo combativo de Ogum e Oxóssi.
- **Banho de Saião (Folha-da-Fortuna) com Rosa Branca:** Regeneração áurica de Oxalá para pessoas que enfrentaram esgotamento, luto ou burnout.
- **Escalda-Pés de Aterramento & Sono Profundo (Sal Grosso, Alfazema e Alecrim):** Drenagem do calor e estresse da cabeça direto para a terra.
- **A Firmeza do Anjo da Guarda:** Guia em `glossario.html` explicando o copo com água pura, a vela branca acima da altura da cabeça e as orações de sustentação.
- **Banho do Brilho Pessoal & Fé nos Sonhos (Calêndula & Anis-Estrelado):** A receita solar exata para ativar o plexo solar e magnetismo de realização, permitida da cabeça aos pés.
- **Banho de Espada de São Jorge Pura (Corte Incisivo de Ogum):** 1 folha cortada em 7 pedaços transversais com alecrim e sal grosso; rigorosamente do pescoço para baixo.
- **Banho Severo de Comigo-Ninguém-Pode:** Quebra de subjugação psíquica e olho-gordo destrutivo; manuseio com tesoura, estritamente dos joelhos para baixo e aviso de proibição absoluta de ingestão (oxalato de cálcio).
- **O Trio Mágico da Fartura (Anis-Estrelado, Canela em Pau & Cravo-da-Índia):** Destravamento financeiro e atração de clientes (pescoço para baixo) com sua versão em chá termogênico e estimulante.
- **Banho da Intuição, Terceiro Olho & Sonhos Lúcidos (Artemísia, Anis & Alfazema):** Abertura dos canais perceptivos e pineal para leitura de oráculos e sono reparador lúcido.
- **O Mistério e Segredo das Rosas:** Fichas completas da Rosa Branca, Vermelha, Amarela (com mel e alecrim de Oxum), Cor-de-Rosa (reconciliação afetiva) e o Banho das Quatro Rosas (alinhamento dos 7 chakras).
- **A Polaridade dos Chás Ancestrais:** Instruções de preparo de chá para 16 ervas comestíveis e avisos expressos de não ingestão para plantas rituais tóxicas.

---

## 4. O Coração do Ensinamento: Regras de Ouro Transmitidas

Para que qualquer pessoa possa utilizar o portal com segurança e respeito, três princípios fundamentais foram selados no código e nos textos:

1. **A Regra da Cabeça (Ori / Coroa):**  
   Na Jurema Sagrada e nas tradições afro-indígenas brasileiras, a cabeça é a morada do sagrado individual. **Nunca se joga banho quente, erva brava ou descarrego pesado na cabeça.** Banho de descarrego é sempre do pescoço para baixo. Na cabeça, apenas ervas mansas de paz (como Boldo, Manjericão e Alfazema).
2. **O Segredo das Folhas Vivas (Maceração):**  
   Folha fresca não se ferve em fogo bravo, pois o fogo cozinha a seiva da folha viva. A folha fresca é macerada com as palmas das mãos em água fresca ou tépida, cantando, rezando ou mentalizando a intenção. Apenas cascas, raízes ou folhas secas levam infusão quente.
3. **A Força do Pensamento e da Simplicidade:**  
   Espiritualidade não depende de rituais caros ou de gastar dinheiro. Um copo de água limpa, uma oração sincera e um coração em paz movimentam mais força no astral do que qualquer artifício grandioso.

4. **A Diferenciação Ancestral das Ervas (Macho vs. Fêmea e Polaridades):**  
   Na sabedoria da Jurema e dos antigos raizeiros, a classificação entre "macho" e "fêmea" não é puramente botânica reprodutiva, mas reflete o **comportamento vibracional, o formato da folha e a ação espiritual**:
   - **Arruda-Fêmea (*Ruta graveolens*):** Folhas miúdas, delicadas, arredondadas e ramos densos. Tem aroma aveludado. Usada para cura de quebranto em crianças, alívio de mau-olhado sutil, inveja cotidiana e bênção familiar com galho verde na orelha.
   - **Arruda-Macho (*Ruta chalepensis* / rústica):** Folhas mais compridas, pontiagudas, espaçadas e ramos mais lenhosos e grossos, com aroma pungente e penetrante. Usada para cortes pesados de demanda, afastar espíritos zombeteiros/eguns, desmanchar amarrações e firmar cruzeiros e porteiras.
   - **Guiné-Pipiu (Fêmea) vs. Guiné-Caboclo (Macho):** O Pipiu (folhas menores e cheiro mais ameno de alho) atua na proteção pessoal e banhos diários; o Caboclo (folhas largas, porte ereto e cheiro fortíssimo de alho silvestre) atua no descarrego pesado de terreiro e na fumaça dos cachimbos de Mestres e Pretos Velhos.
   - **Espada de São Jorge (Ogum) vs. Espada de Santa Bárbara (Iansã):** A de Ogum é verde estriada, cortando na frieza do ferro; a de Santa Bárbara possui bordas douradas, trazendo a eletricidade do raio e dos ventos que queimam e dissipam o mal.
   - **Manjericão Branco vs. Roxo:** O branco/verde é bálsamo de Oxalá para o Ori (cabeça); o roxo é erva de limpeza e corte de cansaço mental para uso do pescoço para baixo.

---

## 5. Próximos Passos (Roadmap de Desenvolvimento)

Para continuar honrando a caminhada e expandindo o portal:

| Etapa | Funcionalidade Proposta | Descrição |
|---|---|---|
| **Fase 1** *(Concluída)* | **Funcionalidade Plena dos Módulos** | Banhos, Plantas, Defumação, Mantras e Portais 100% interativos com busca, voz e proteção offline. |
| **Fase 2** *(Próxima)* | **Oráculo / Orientador Interativo de Banhos** | Assistente interativo onde o visitante clica no que está sentindo (ex.: "Cansaço extremo", "Dúvida no trabalho", "Insônia") e recebe na hora o ritual guiado ideal. |
| **Fase 3** | **Cantigas e Toques da Jurema (Áudio Nativo)** | Biblioteca de toques sagrados de maracá e cantigas de mestres explicadas com áudio embutido e significado histórico/espiritual. |
| **Fase 4** | **Caderno de Firmeza Pessoal (Offline)** | Espaço no navegador para o praticante anotar seus ciclos, percepções de banhos e hábitos espirituais sem envio de dados a servidores. |
| **Fase 5** | **PWA (Progressive Web App)** | Permitir que o filho de fé instale o site na tela inicial do celular como um aplicativo nativo que funciona mesmo sem internet na mata ou na estrada. |

---

*Salve os Mestres e Mestras da Jurema Sagrada. Salve as folhas, o vento e a força da terra.*
