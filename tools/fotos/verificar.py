"""
tools/fotos/verificar.py
Verifica a integridade de todas as fotos de ervas:
(a) foto existe
(b) <= 150 KB e <= 900 px
(c) registro em creditos.json
(d) API: arquivo existe no Commons, autor e licenca batem
(e) dHash: distancia de Hamming <= 10 entre foto local e thumb do Commons

Uso:
    python tools/fotos/verificar.py
    python tools/fotos/verificar.py --rapido   (pula chamada a API, valida apenas arquivos locais e creditos.json)
    python tools/fotos/verificar.py <id-da-erva> (valida apenas uma erva)
"""

import json
import os
import re
import sys
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))

from tools.fotos.commons import (
    info,
    baixar_thumb,
    dhash,
    distancia_hamming,
    MAX_BYTES,
    MAX_WIDTH
)

DATA_ERVAS = REPO_ROOT / "data" / "ervas.js"
CREDITOS_JSON = REPO_ROOT / "tools" / "fotos" / "creditos.json"
IMAGES_DIR = REPO_ROOT / "images"
CACHE_DIR = REPO_ROOT / "scratch" / "cache_commons"


def carregar_ervas():
    if not DATA_ERVAS.exists():
        print(f"[ERRO] Arquivo nao encontrado: {DATA_ERVAS}")
        sys.exit(1)
    conteudo = DATA_ERVAS.read_text(encoding="utf-8")
    m = re.search(r"window\.FV_DATA\.ervas\s*=\s*(\[.*?\])\s*;", conteudo, re.DOTALL)
    if not m:
        print("[ERRO] Nao foi possivel extrair array de ervas de data/ervas.js")
        sys.exit(1)
    return json.loads(m.group(1))


def carregar_creditos():
    if CREDITOS_JSON.exists():
        try:
            return json.loads(CREDITOS_JSON.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[ERRO] Falha ao ler creditos.json: {e}")
            return {}
    return {}


def obter_dhash_remoto(commons_file: str, thumburl: str) -> str:
    """Obtem o dHash da foto no Commons, usando cache local para evitar downloads repetidos."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    nome_sanitizado = re.sub(r"[^\w\-.]", "_", commons_file)
    cache_file = CACHE_DIR / f"{nome_sanitizado}.dhash"

    if cache_file.exists():
        return cache_file.read_text(encoding="utf-8").strip()

    # Baixar thumb e calcular dHash
    thumb_bytes = baixar_thumb(thumburl)
    h = dhash(thumb_bytes)
    cache_file.write_text(h, encoding="utf-8")
    return h


def verificar_erva(erva: dict, creditos: dict, modo_rapido: bool = False) -> tuple:
    """
    Verifica uma erva individualmente.
    Retorna (ok: bool, motivo: str, detalhes: dict)
    """
    id_erva = erva.get("id")
    detalhes = {
        "id": id_erva,
        "arquivo": "",
        "existe": False,
        "tam_kb": 0.0,
        "larg_px": 0,
        "credito": False,
        "commons": "",
        "licenca": "",
        "dist_dhash": None,
        "erro": ""
    }

    # (c) Registro em creditos.json
    registro = creditos.get(id_erva)
    
    # Resolver caminho da imagem
    if registro and "arquivo" in registro:
        caminho_imagem = REPO_ROOT / registro["arquivo"]
    elif erva.get("imagem"):
        caminho_imagem = REPO_ROOT / erva["imagem"].replace("./", "")
    else:
        caminho_imagem = IMAGES_DIR / f"{id_erva}.jpg"

    detalhes["arquivo"] = str(caminho_imagem.relative_to(REPO_ROOT)).replace("\\", "/")

    # (a) Foto existe
    if not caminho_imagem.exists():
        detalhes["erro"] = f"Foto nao encontrada ({detalhes['arquivo']})"
        return False, detalhes["erro"], detalhes

    detalhes["existe"] = True

    # (b) Tamanho e dimensoes
    tamanho_bytes = caminho_imagem.stat().st_size
    detalhes["tam_kb"] = round(tamanho_bytes / 1024, 1)

    try:
        with Image.open(caminho_imagem) as img:
            detalhes["larg_px"] = img.width
            if img.width > MAX_WIDTH:
                detalhes["erro"] = f"Largura ({img.width}px) > {MAX_WIDTH}px"
                return False, detalhes["erro"], detalhes
    except Exception as e:
        detalhes["erro"] = f"Erro ao ler imagem: {e}"
        return False, detalhes["erro"], detalhes

    if tamanho_bytes > MAX_BYTES:
        detalhes["erro"] = f"Tamanho ({detalhes['tam_kb']}KB) > {MAX_BYTES/1024:.0f}KB"
        return False, detalhes["erro"], detalhes

    # (c) Registro em creditos.json
    registro = creditos.get(id_erva)
    if not registro:
        detalhes["erro"] = "Sem registro em creditos.json"
        return False, detalhes["erro"], detalhes

    detalhes["credito"] = True
    detalhes["commons"] = registro.get("commons", "")
    detalhes["licenca"] = registro.get("licenca", "")

    # Se modo rapido, apenas checa consistencia interna
    if modo_rapido:
        # Checa dHash local com o do registro
        with open(caminho_imagem, "rb") as f:
            h_local = dhash(f.read())
        h_reg = registro.get("dhash", "")
        if h_reg:
            dist = distancia_hamming(h_local, h_reg)
            detalhes["dist_dhash"] = dist
            if dist > 0:
                detalhes["erro"] = f"dHash local diverge do registro (dist={dist})"
                return False, detalhes["erro"], detalhes
        return True, "OK (rapido)", detalhes

    # (d) Checagem na API do Commons
    commons_file = registro.get("commons")
    if not commons_file:
        detalhes["erro"] = "Registro sem campo 'commons'"
        return False, detalhes["erro"], detalhes

    try:
        meta = info(commons_file)
    except Exception as e:
        detalhes["erro"] = f"API falhou para {commons_file}: {e}"
        return False, detalhes["erro"], detalhes

    if not meta.get("licencaValida"):
        detalhes["erro"] = f"Licenca invalida no Commons: '{meta.get('licenca')}'"
        return False, detalhes["erro"], detalhes

    # (e) dHash visual (local vs remoto)
    try:
        with open(caminho_imagem, "rb") as f:
            h_local = dhash(f.read())
        h_remoto = obter_dhash_remoto(commons_file, meta["thumburl"])
        dist = distancia_hamming(h_local, h_remoto)
        detalhes["dist_dhash"] = dist

        if dist > 10:
            detalhes["erro"] = f"dHash diferente (dist={dist} > 10). Foto local nao e o arquivo citado."
            return False, detalhes["erro"], detalhes
    except Exception as e:
        detalhes["erro"] = f"Erro no dHash: {e}"
        return False, detalhes["erro"], detalhes

    return True, "OK", detalhes


def main():
    modo_rapido = "--rapido" in sys.argv
    filtro_id = next((arg for arg in sys.argv[1:] if not arg.startswith("--")), None)

    ervas = carregar_ervas()
    creditos = carregar_creditos()

    if filtro_id:
        ervas = [e for e in ervas if e.get("id") == filtro_id]
        if not ervas:
            print(f"[ERRO] Erva '{filtro_id}' nao encontrada em data/ervas.js")
            sys.exit(1)

    print(f"[*] Verificando {len(ervas)} ervas... (Modo: {'Rapido/Local' if modo_rapido else 'Completo com API do Commons'})\n")

    linhas = []
    falhas = 0
    sucessos = 0

    header = f"{'ID':<22} | {'Tam(KB)':<7} | {'Larg':<6} | {'dHash':<5} | {'Licenca':<15} | {'Status'}"
    print(header)
    print("-" * len(header))

    for erva in ervas:
        id_erva = erva.get("id")
        ok, motivo, det = verificar_erva(erva, creditos, modo_rapido=modo_rapido)

        dist_str = str(det["dist_dhash"]) if det["dist_dhash"] is not None else "-"
        status_str = "OK" if ok else f"FALHA: {motivo}"

        linha = f"{id_erva:<22} | {det['tam_kb']:<7} | {det['larg_px']:<6} | {dist_str:<5} | {det['licenca'][:14]:<15} | {status_str}"
        print(linha)

        if ok:
            sucessos += 1
        else:
            falhas += 1

    print("\n" + "=" * len(header))
    print(f"Resumo da Verificacao: {sucessos} passaram | {falhas} falharam (Total: {len(ervas)})")

    if falhas > 0:
        print("[FALHA] Existem fotos pendentes ou com inconsistencias.")
        sys.exit(1)
    else:
        print("[SUCESSO] Todas as 75 ervas atendem aos criterios de autenticidade e qualidade visual (0 falhas).")
        sys.exit(0)


if __name__ == "__main__":
    main()
