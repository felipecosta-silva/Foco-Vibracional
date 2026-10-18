# Foco Vibracional & Sabedoria da Jurema Sagrada 🌿

Um portal espiritual e vibracional gratuito desenvolvido por um Juremeiro com mais de 30 anos de caminhada tradicional e desenvolvedor web. Feito para filhos de fé, consulentes e todos aqueles que buscam um guia acolhedor, fundamentado e livre de cobranças para iniciar seus passos no mundo espiritual, nas ervas sagradas, nos banhos energéticos e na firmeza de pensamento.

---

## 🌟 O Que Você Encontra Aqui

| Menu | Página | Conteúdo |
|---|---|---|
| **Hoje** | `index.html` | Mantra do dia, banho e defumação sugeridos pela lua, portal e sequência do dia, **Oráculo "Como você está?"** |
| **Rituais** | `plantas.html` · `banhos.html` · `defumacao.html` · `colheita.html` | Catálogos ligados entre si (cada erva leva à sua ficha e cada ficha mostra onde é usada) |
| **Mantras** | `mantras.html` | Abas: Mantras • Afirmações • Ritual da Noite • Favoritos |
| **Lua** | `calendario.html` · `portais.html` | Fases da lua e o que fazer em cada uma; portais e sequências de Grabovoi |
| **Saberes** | `tarot.html` · `simbolos.html` · `glossario.html` | Tarot clássico e Baralho Cigano; pemba, runas, mandalas e sigilos; termos da tradição |

Em qualquer página: **lupa no topo** (ou tecla `/`) para buscar em todo o site.

---

## 🚀 Como Executar

Projeto 100% estático (HTML, CSS e JavaScript puro).

- **Abrir direto:** dois cliques em `index.html` (funciona sem servidor).
- **Com servidor local:** `python -m http.server 8000` e acesse `http://localhost:8000`. Pelo servidor, o site também pode ser **instalado como app** e funciona **offline**.

> Ao publicar mudanças, aumente `CACHE_VERSION` em `sw.js` para que quem instalou o app receba a versão nova.

---

## ➕ Como Adicionar um Banho, Erva ou Defumação

Os dados ficam em `data/*.js` (fonte única):

| Arquivo | Campos obrigatórios |
|---|---|
| `data/banhos.js` | `id`, `nome`, `objetivo` (limpeza · protecao · calma · energia · prosperidade · harmonizacao), `intensidade` (suave · media · forte), `luas`, `dias` (seg…dom), `horario`, `ervas`, `cabeca` (true/false), `modoPreparo`, `reza`, `observacao` |
| `data/defumacoes.js` | `id`, `nome`, `objetivo`, `intensidade`, `luas`, `dias`, `horario`, `ervas`, `sentido`, `reza`, `servePara`, `cuidados` |
| `data/ervas.js` | `id`, `nome`, `nomePopular`, `energia` (frias · quentes · equilibradoras), `intensidade`, `objetivos`, `usos`, `partes`, `cabeca` (texto), `imagem`, `descricao`, `colheita`, `cuidados`, `tradicao` |

Regras:
- `id` único, em minúsculas e com hífens (ex.: `banho-alecrim-foco`).
- **Cuidados de segurança são obrigatórios** (toxicidade, gestantes, crianças, se vai ou não na cabeça).
- Para o link automático com a ficha da erva funcionar, cite a erva pelo nome dela (ex.: "Folhas de Alecrim").

---

## 📖 Documentação Completa

História, fundamentos e detalhamento técnico: **[DOCUMENTACAO_JUREMA_FOCO.md](DOCUMENTACAO_JUREMA_FOCO.md)**

---

*Salve a Jurema Sagrada e a força curadora das matas.*
