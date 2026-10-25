# Ferramentas de Gestão de Fotos e Créditos das Ervas

Este diretório contém o conjunto de ferramentas em Python responsável por gerenciar, validar e auditar as fotografias do acervo de ervas do Foco Vibracional, conforme a **Spec 001** (`specs/001-fotos-das-ervas/`).

---

## Estrutura

- **`commons.py`**: Módulo base com rotinas de consulta à API do Wikimedia Commons, controle de requisição (`User-Agent` e *rate limiting*), download de miniaturas, compressão para JPEG progressivo (≤ 150 KB e ≤ 900 px de largura) e cálculo de impressão digital visual de 64 bits (`dHash`).
- **`baixar.py`**: CLI para baixar uma nova foto do Wikimedia Commons, validar se a licença é livre, comprimi-la e gravar/atualizar o registro em `creditos.json`.
- **`verificar.py`**: O "juiz" automatizado. Valida para cada uma das 75 ervas se a foto existe, se está dentro dos limites de dimensão/peso, se possui registro de crédito, se o arquivo citado existe na API com os mesmos metadados e se o `dHash` confere com o arquivo remoto (distância de Hamming ≤ 10).
- **`gerar.py`**: Gera o arquivo consumido pelo site (`data/creditos-fotos.js`) e a documentação pública auditável (`images/CREDITOS.md`).
- **`creditos.json`**: Fonte única dos metadados de crédito das fotografias.

---

## Como Usar (3 Comandos Principais)

### 1. Baixar ou trocar a foto de uma erva
```bash
python tools/fotos/baixar.py <id-da-erva> "File:Nome_do_Arquivo.jpg"
```
*Exemplo:*
```bash
python tools/fotos/baixar.py jiboia "File:Epipremnum aureum 31082012.jpg"
```

### 2. Verificar a conformidade de todas as fotos
```bash
python tools/fotos/verificar.py
```
Para checagem rápida offline (sem chamadas à API):
```bash
python tools/fotos/verificar.py --rapido
```
Para verificar uma erva específica:
```bash
python tools/fotos/verificar.py <id-da-erva>
```

### 3. Gerar arquivos do site e documentação
```bash
python tools/fotos/gerar.py
```
Gera automaticamente `data/creditos-fotos.js` e `images/CREDITOS.md` sincronizados.
