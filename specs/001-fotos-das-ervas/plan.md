# Plano 001 — Fotos das ervas com créditos verdadeiros

> Implementa `spec.md`. Regras: `.specify/memory/constitution.md`

## 1. Abordagem
O crédito deixa de ser texto digitado e passa a ser **dado gerado por ferramenta**. Três scripts Python em `tools/fotos/` resolvem tudo:

1. **`baixar.py <id-da-erva> "File:Nome_do_arquivo.jpg"`** — pega o arquivo no Commons, salva `images/<id>.jpg` e grava o crédito em `tools/fotos/creditos.json`.
2. **`verificar.py`** — confere todos os créditos contra a API e compara cada foto local com o arquivo do Commons (impressão digital visual). É o "juiz" da spec.
3. **`gerar.py`** — gera `data/creditos-fotos.js` (usado pelo site) e `images/CREDITOS.md` a partir de `creditos.json`.

O executor **escolhe** a foto certa (busca no Commons e olha a imagem). A ferramenta faz o resto, então não há como digitar um autor errado.

## 2. Arquivos tocados
| Arquivo | Mudança |
|---|---|
| `tools/fotos/commons.py` | Funções comuns: consulta à API, download, compressão, impressão digital (dHash). |
| `tools/fotos/baixar.py`, `verificar.py`, `gerar.py` | CLIs descritas acima. |
| `tools/fotos/creditos.json` | **Fonte única** dos créditos (gerada; não editar à mão, exceto o campo `nota`). |
| `tools/fotos/README.md` | Como usar (3 comandos). |
| `data/creditos-fotos.js` | Gerado: `window.FV_DATA.creditosFotos = { "<id>": {...} }`. |
| `images/<id>.jpg` | 14 fotos novas, mais as trocas que o `verificar.py` exigir. |
| `data/ervas.js` | Campo `"imagem": "./images/<id>.jpg"` nas 14 ervas. |
| `images/CREDITOS.md` | Gerado. |
| `script/script.js` | Mostra o crédito abaixo da foto no painel da erva (onde se monta `<div class="drawer__hero">`; procure por `drawer__hero`). |
| `styles/styles.css` | Classe `.drawer__credit` na camada final (tokens: `--muted`, `--faint`). |
| HTMLs que incluem `data/ervas.js` | Incluir também `data/creditos-fotos.js` logo depois. |
| `sw.js` | `data/creditos-fotos.js` no `PRECACHE`, as 14 fotos novas e `CACHE_VERSION` +1. |

## 3. Dados / formatos

**API do Commons** (sem chave). Sempre envie o cabeçalho `User-Agent: FocoVibracional/1.0 (felipecosta-silva.github.io)`:
```
https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=File:<nome>
  &prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=900
```
Use `imageinfo[0]`: `thumburl` (900 px), `descriptionurl` (página do arquivo), `extmetadata.Artist.value` (é HTML: **remova as tags**), `extmetadata.LicenseShortName.value` e `extmetadata.LicenseUrl.value`.
Para buscar candidatos: `action=query&list=search&srnamespace=6&srsearch=<nome científico>`.

**`creditos.json`** (um registro por erva):
```json
{
  "jiboia": {
    "arquivo": "images/jiboia.jpg",
    "commons": "File:Epipremnum aureum 31082012.jpg",
    "pagina": "https://commons.wikimedia.org/wiki/File:Epipremnum_aureum_31082012.jpg",
    "autor": "Nome lido da API",
    "licenca": "CC BY-SA 3.0",
    "licencaUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "dhash": "a1b2c3d4e5f60718",
    "baixadoEm": "2026-10-22"
  }
}
```

**Licença aceita** (RF-06): `LicenseShortName` casando com `^(CC0|Public domain|PD.*|CC BY(-SA)? [0-9.]+.*)$`. O `baixar.py` **recusa** o arquivo se não casar.

**Compressão** (RF-08): baixe o `thumburl` de 900 px. Se passar de 150 KB, recomprima com Pillow (qualidade 85 → 75 → 65) até caber. Salve como JPEG progressivo, sem EXIF.

**Impressão digital (dHash 64 bits):** a imagem vai para escala de cinza, 9×8 px, e cada bit compara um pixel com o vizinho à direita. O `verificar.py` baixa o thumb do arquivo citado, calcula o dHash e compara com o da foto local. **Distância de Hamming ≤ 10 = mesma foto.** Acima disso, falha.

**No site** (`script/script.js`, painel da erva): logo abaixo do `<div class="drawer__hero">`, se existir `FV_DATA.creditosFotos[e.id]`:
```html
<p class="drawer__credit">Foto: <autor> · <a href="<pagina>" target="_blank" rel="noopener">licença <licenca></a> · Wikimedia Commons</p>
```
Sempre com `escapeHtml`. 

## 4. Riscos e cuidados
- **Espécie errada** (o risco maior). Confira o nome científico na página do arquivo e nas categorias. Palmeira: prefira folha de *Cocos nucifera* ou de *Dypsis lutescens*, e **nunca** a *Cycas revoluta* (palmeira-sagu, a planta do alerta).
- **`Artist` com HTML ou vazio:** remova as tags. Se ficar vazio, use `extmetadata.Credit` e, depois, o usuário do upload (`iiprop=user`). Nunca escreva "Wikimedia Commons" como autor.
- **Bloqueio da API:** no máximo 1 requisição por segundo, sempre com `User-Agent`.
- **Pillow não instalado:** `python -m pip install pillow requests` (só isso).
- Scripts temporários **fora** do projeto. As ferramentas de `tools/fotos/` ficam e vão para o git.

## 5. Checagem da constituição
- [x] **I. Verdade:** o crédito vem da API, e a foto é provada por dHash.
- [x] **II. Segurança:** fotos das plantas tóxicas ajudam a reconhecê-las.
- [x] **III. Tom:** sem texto novo de conteúdo.
- [x] **IV. Visual:** classe nova na camada final, só tokens.
- [x] **V. Engenharia:** offline via `PRECACHE`, ≤ 150 KB, ferramentas em `tools/`.
- [x] **VI. Qualidade:** testes nos dois tamanhos e um commit por tarefa.

## 6. Como verificar
```
python tools/fotos/verificar.py         # CA-01: 0 falhas
python tools/fotos/gerar.py && git diff --stat images/CREDITOS.md data/creditos-fotos.js   # CA-04: sem diferença
```
- **CA-02:** abrir `plantas.html#jiboia`, ver a foto e o crédito e clicar no link.
- **CA-03:** o `verificar.py` também checa tamanho e largura.
- **CA-05:** DevTools → Network → Offline → recarregar `plantas.html`.
- **CA-06:** DevTools a 375 px e a 1440 px, com o console aberto.
