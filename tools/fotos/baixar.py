"""
tools/fotos/baixar.py
Baixa imagem do Wikimedia Commons, valida licenca, comprime para <=150 KB / <=900 px,
salva em images/<id>.jpg e atualiza tools/fotos/creditos.json.

Uso:
    python tools/fotos/baixar.py <id-da-erva> "File:Nome_do_arquivo.jpg"
"""

from datetime import date
import json
import os
import sys
from pathlib import Path

# Ajustar import caso executado de qualquer pasta
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))

from tools.fotos.commons import (
    info,
    baixar_thumb,
    comprimir,
    dhash,
    normalizar_nome_arquivo,
    MAX_BYTES,
    MAX_WIDTH
)

CREDITOS_JSON = REPO_ROOT / "tools" / "fotos" / "creditos.json"
IMAGES_DIR = REPO_ROOT / "images"


def carregar_creditos() -> dict:
    if CREDITOS_JSON.exists():
        try:
            with open(CREDITOS_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}


def salvar_creditos(creditos: dict) -> None:
    CREDITOS_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(CREDITOS_JSON, "w", encoding="utf-8") as f:
        json.dump(creditos, f, indent=2, ensure_ascii=False)
        f.write("\n")


def baixar_erva(id_erva: str, commons_file: str) -> dict:
    print(f"[*] Consultando API do Commons para: {commons_file} (erva: {id_erva})...")
    meta = info(commons_file)

    if not meta.get("licencaValida"):
        lic = meta.get("licenca") or "desconhecida"
        print(f"[ERRO] Licenca nao aceita para '{commons_file}': '{lic}'. Requer licenca livre valida (CC0, PD, CC BY, CC BY-SA).")
        sys.exit(1)

    print(f"[+] Metadados obtidos: Autor='{meta['autor']}', Licenca='{meta['licenca']}'")
    print(f"[*] Baixando imagem (thumb <= 900px): {meta['thumburl']}...")
    bytes_raw = baixar_thumb(meta["thumburl"])

    print("[*] Comprimindo imagem...")
    bytes_opt = comprimir(bytes_raw)
    tamanho_kb = len(bytes_opt) / 1024

    if len(bytes_opt) > MAX_BYTES:
        print(f"[ERRO] Imagem comprimida ({tamanho_kb:.1f} KB) excede o limite de {MAX_BYTES/1024:.0f} KB.")
        sys.exit(1)

    # Salvar arquivo
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    destino = IMAGES_DIR / f"{id_erva}.jpg"
    with open(destino, "wb") as f:
        f.write(bytes_opt)

    # Calcular dHash
    hash_visual = dhash(bytes_opt)
    print(f"[+] Salvo em '{destino.relative_to(REPO_ROOT)}' ({tamanho_kb:.1f} KB, dHash: {hash_visual})")

    # Atualizar creditos.json
    creditos = carregar_creditos()
    registro_existente = creditos.get(id_erva, {})
    
    registro = {
        "arquivo": f"images/{id_erva}.jpg",
        "commons": meta["commons"],
        "pagina": meta["pagina"],
        "autor": meta["autor"],
        "licenca": meta["licenca"],
        "licencaUrl": meta["licencaUrl"],
        "dhash": hash_visual,
        "baixadoEm": str(date.today())
    }
    # Preserva campo nota se existia
    if "nota" in registro_existente:
        registro["nota"] = registro_existente["nota"]

    creditos[id_erva] = registro
    salvar_creditos(creditos)
    print(f"[+] Registro atualizado em tools/fotos/creditos.json para '{id_erva}'")
    return registro


def main():
    if len(sys.argv) < 3:
        print("Uso: python tools/fotos/baixar.py <id-da-erva> \"File:Nome_do_arquivo.jpg\"")
        sys.exit(1)

    id_erva = sys.argv[1].strip()
    commons_file = sys.argv[2].strip()
    baixar_erva(id_erva, commons_file)


if __name__ == "__main__":
    main()
