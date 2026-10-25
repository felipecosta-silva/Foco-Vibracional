"""
tools/fotos/gerar.py
Gera:
1. data/creditos-fotos.js (para consumo no site pelo script.js)
2. images/CREDITOS.md (tabela completa de creditos para auditoria e documentacao)

Uso:
    python tools/fotos/gerar.py
"""

import json
from pathlib import Path
import re
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
CREDITOS_JSON = REPO_ROOT / "tools" / "fotos" / "creditos.json"
DATA_ERVAS = REPO_ROOT / "data" / "ervas.js"
OUTPUT_JS = REPO_ROOT / "data" / "creditos-fotos.js"
OUTPUT_MD = REPO_ROOT / "images" / "CREDITOS.md"


def carregar_ervas_map():
    if not DATA_ERVAS.exists():
        return {}
    conteudo = DATA_ERVAS.read_text(encoding="utf-8")
    m = re.search(r"window\.FV_DATA\.ervas\s*=\s*(\[.*?\])\s*;", conteudo, re.DOTALL)
    if not m:
        return {}
    ervas = json.loads(m.group(1))
    return {e["id"]: e for e in ervas}


def carregar_creditos():
    if not CREDITOS_JSON.exists():
        return {}
    try:
        return json.loads(CREDITOS_JSON.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[ERRO] Falha ao ler creditos.json: {e}")
        return {}


def gerar_js(creditos: dict):
    # Formato limpo e ordenado por ID da erva
    dados_site = {}
    for id_erva in sorted(creditos.keys()):
        reg = creditos[id_erva]
        dados_site[id_erva] = {
            "arquivo": reg.get("arquivo", f"images/{id_erva}.jpg"),
            "commons": reg.get("commons", ""),
            "pagina": reg.get("pagina", ""),
            "autor": reg.get("autor", ""),
            "licenca": reg.get("licenca", ""),
            "licencaUrl": reg.get("licencaUrl", "")
        }

    js_content = "window.FV_DATA = window.FV_DATA || {};\n"
    js_content += "window.FV_DATA.creditosFotos = " + json.dumps(dados_site, indent=2, ensure_ascii=False) + ";\n"

    OUTPUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JS.write_text(js_content, encoding="utf-8")
    print(f"[+] Gerado com sucesso: {OUTPUT_JS.relative_to(REPO_ROOT)} ({len(dados_site)} registros)")


def extrair_botanico(nome_popular: str) -> str:
    """Tenta extrair nome cientifico botanico entre parenteses se houver."""
    if not nome_popular:
        return ""
    m = re.search(r"\(([^)]+)\)", nome_popular)
    if m:
        return f"*{m.group(1)}*"
    return nome_popular


def gerar_md(creditos: dict, ervas_map: dict):
    md_lines = [
        "# Créditos e Licenças — Fotos do Acervo de Ervas e Plantas Sagradas",
        "",
        "> Documento gerado automaticamente por `tools/fotos/gerar.py` a partir de dados verificados na API do Wikimedia Commons.",
        "> Todas as imagens possuem resolução máxima de 900 px e peso rigorosamente ≤ 150 KB, preservando fidelidade botânica e disponibilidade offline.",
        "",
        "## Tabela de Créditos das 75 Ervas",
        "",
        "| Erva | Arquivo | Identificação Botânica | Autor / Crédito | Licença | Fonte |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |"
    ]

    # Ordenar pelas ervas na ordem de data/ervas.js ou alfabeticamente
    # Usaremos ordem alfabetica por id
    for id_erva in sorted(creditos.keys()):
        reg = creditos[id_erva]
        erva_info = ervas_map.get(id_erva, {})
        nome_exibicao = erva_info.get("nome", id_erva.replace("-", " ").title())
        botanico = extrair_botanico(erva_info.get("nomePopular", ""))

        arquivo = reg.get("arquivo", f"images/{id_erva}.jpg").replace("images/", "")
        autor = reg.get("autor", "-")
        licenca = reg.get("licenca", "-")
        pagina = reg.get("pagina", "")

        fonte_link = f"[Wikimedia Commons]({pagina})" if pagina else "-"
        md_lines.append(f"| {nome_exibicao} | `{arquivo}` | {botanico} | {autor} | {licenca} | {fonte_link} |")

    md_lines.extend([
        "",
        "---",
        "",
        "## Diretrizes de Uso e Licenciamento",
        "- As fotografias utilizadas são disponibilizadas sob licenças livres Creative Commons (CC0, CC BY, CC BY-SA) ou Domínio Público.",
        "- Os metadados de autoria e licença foram recuperados diretamente dos arquivos no Wikimedia Commons via API.",
        "- Este acervo tem caráter exclusivamente educativo, cultural e devocional sem finalidade comercial lucrativa.",
        ""
    ])

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.write_text("\n".join(md_lines), encoding="utf-8")
    print(f"[+] Gerado com sucesso: {OUTPUT_MD.relative_to(REPO_ROOT)} ({len(creditos)} linhas)")


def main():
    creditos = carregar_creditos()
    ervas_map = carregar_ervas_map()

    gerar_js(creditos)
    gerar_md(creditos, ervas_map)


if __name__ == "__main__":
    main()
