"""
tools/fotos/commons.py
Funcoes comuns: consulta a API do Wikimedia Commons, download, compressao e impressao digital (dHash).
Regras: spec.md e plan.md (specs/001-fotos-das-ervas)
"""

import html
import io
import re
import time
from typing import Any, Dict, Optional, Tuple, Union
from PIL import Image
import requests

USER_AGENT = "FocoVibracionalBot/1.0 (https://felipecosta-silva.github.io/Foco-Vibracional/)"
API_ENDPOINT = "https://commons.wikimedia.org/w/api.php"
MAX_WIDTH = 900
MAX_BYTES = 150 * 1024  # 153.600 bytes (150 KB)

# Licencas livres aceitas (RF-06): CC0, Public Domain / PD, CC BY e CC BY-SA (qualquer versao)
# Pode haver mencao dupla (ex: GFDL / CC BY-SA 3.0), desde que contenha uma licenca livre aceita.
LICENCA_REGEX = re.compile(
    r"(CC0|Public\s+domain|PD.*|CC\s+BY(-SA)?(\s+[0-9.]+.*)?)",
    re.IGNORECASE
)

_LAST_REQUEST_TIME = 0.0


def _rate_limit(min_interval: float = 1.2):
    global _LAST_REQUEST_TIME
    now = time.time()
    elapsed = now - _LAST_REQUEST_TIME
    if elapsed < min_interval:
        time.sleep(min_interval - elapsed)
    _LAST_REQUEST_TIME = time.time()


def _request_com_retry(url: str, params: Optional[dict] = None, timeout: int = 25, max_retries: int = 5) -> requests.Response:
    headers = {"User-Agent": USER_AGENT}
    resp = None
    for tentativa in range(max_retries):
        _rate_limit(1.2)
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=timeout)
            if resp.status_code in (429, 502, 503, 504):
                espera = int(resp.headers.get("Retry-After", 2 ** (tentativa + 1) + 2))
                print(f"[!] Commons retornou status {resp.status_code}. Aguardando {espera}s para tentar novamente...")
                time.sleep(espera)
                continue
            resp.raise_for_status()
            return resp
        except (requests.exceptions.RequestException) as e:
            if tentativa == max_retries - 1:
                raise
            espera = 2 ** (tentativa + 1) + 1
            print(f"[!] Erro de conexao ({e}). Aguardando {espera}s...")
            time.sleep(espera)
    if resp is not None:
        resp.raise_for_status()
        return resp
    raise RuntimeError("Falha na requisicao apos retries")


def normalizar_nome_arquivo(nome: str) -> str:
    """Garante que o nome comece com File: e substitua espacos por underscores onde necessario."""
    nome = nome.strip()
    if not nome.lower().startswith("file:"):
        nome = "File:" + nome
    return nome


def limpar_texto(texto: Optional[str]) -> str:
    if not texto:
        return ""
    # Remove tags HTML
    sem_html = re.sub(r"<[^>]+>", " ", texto)
    # Decodifica entidades HTML (&amp;, &#039;, etc)
    decodificado = html.unescape(sem_html)
    # Remove espacos multiplos
    limpo = re.sub(r"\s+", " ", decodificado).strip()
    return limpo


def validar_licenca(licenca: str) -> bool:
    if not licenca:
        return False
    # Proibido: NC (NonCommercial), ND (NoDerivatives), Fair use
    proibidas = ["-nc", " nc", "-nd", " nd", "fair use"]
    licenca_lower = licenca.lower()
    for p in proibidas:
        if p in licenca_lower:
            return False
    return bool(LICENCA_REGEX.search(licenca))


def info(arquivo: str) -> Dict[str, Any]:
    """
    Consulta metadados de um arquivo no Wikimedia Commons via API.
    Retorna dicionario com:
      commons, pagina, autor, licenca, licencaUrl, thumburl, url, licencaValida
    """
    _rate_limit(1.0)
    nome_arquivo = normalizar_nome_arquivo(arquivo)

    params = {
        "action": "query",
        "format": "json",
        "titles": nome_arquivo,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata|user",
        "iiurlwidth": str(MAX_WIDTH)
    }
    resp = _request_com_retry(API_ENDPOINT, params=params, timeout=25)
    data = resp.json()

    pages = data.get("query", {}).get("pages", {})
    if not pages:
        raise ValueError(f"Arquivo nao encontrado no Commons: {nome_arquivo}")

    page_id, page_data = next(iter(pages.items()))
    if page_id == "-1" or "missing" in page_data:
        raise ValueError(f"Arquivo nao existe no Commons: {nome_arquivo}")

    imageinfo = page_data.get("imageinfo", [])
    if not imageinfo:
        raise ValueError(f"Sem informacoes de imagem para: {nome_arquivo}")

    info0 = imageinfo[0]
    extmetadata = info0.get("extmetadata", {})

    thumburl = info0.get("thumburl") or info0.get("url")
    url = info0.get("url")
    pagina = info0.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/{nome_arquivo.replace(' ', '_')}"

    # Autor
    autor_raw = extmetadata.get("Artist", {}).get("value", "")
    autor = limpar_texto(autor_raw)
    if not autor or autor.lower() in ("wikimedia commons", "unknown", "desconhecido"):
        credit_raw = extmetadata.get("Credit", {}).get("value", "")
        autor = limpar_texto(credit_raw)
    # "Own work" / "Trabalho próprio" descrevem a origem, não o autor: usa quem enviou o arquivo
    if not autor or autor.lower().strip(" .") in ("own work", "trabalho próprio", "obra própria", "self-photographed"):
        autor = info0.get("user", "")

    # Licenca
    licenca = extmetadata.get("LicenseShortName", {}).get("value", "").strip()
    if not licenca:
        licenca = extmetadata.get("License", {}).get("value", "").strip()
    licenca_url = extmetadata.get("LicenseUrl", {}).get("value", "").strip()

    licenca_valida = validar_licenca(licenca)

    return {
        "commons": nome_arquivo,
        "pagina": pagina,
        "autor": autor,
        "licenca": licenca,
        "licencaUrl": licenca_url,
        "thumburl": thumburl,
        "url": url,
        "licencaValida": licenca_valida
    }


def baixar_thumb(url: str) -> bytes:
    """Baixa o arquivo da URL com User-Agent apropriado e retry automatico."""
    resp = _request_com_retry(url, timeout=35)
    return resp.content


def comprimir(img_bytes: bytes) -> bytes:
    """
    Otimiza a imagem para caber em <= 150 KB e <= 900 px de largura.
    Remove EXIF e salva como JPEG progressivo.
    """
    with Image.open(io.BytesIO(img_bytes)) as img:
        # Converter para RGB se necessario
        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
            img = img.convert("RGBA")
            fundo = Image.new("RGB", img.size, (255, 255, 255))
            fundo.paste(img, mask=img.split()[3])
            img = fundo
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Redimensionar se largura > MAX_WIDTH
        if img.width > MAX_WIDTH:
            nova_altura = int(img.height * (MAX_WIDTH / img.width))
            img = img.resize((MAX_WIDTH, nova_altura), Image.Resampling.LANCZOS)

        # Compressao iterativa por qualidade
        qualidades = [85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35]
        for q in qualidades:
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=q, progressive=True, optimize=True)
            if buf.tell() <= MAX_BYTES:
                return buf.getvalue()

        # Se ainda exceder (ex: imagem muito alta), reduz resolucao gradualmente
        escala = 0.9
        while escala >= 0.2:
            nw = max(100, int(img.width * escala))
            nh = max(100, int(img.height * escala))
            img_res = img.resize((nw, nh), Image.Resampling.LANCZOS)
            for q in [75, 65, 55, 45, 35]:
                buf = io.BytesIO()
                img_res.save(buf, format="JPEG", quality=q, progressive=True, optimize=True)
                if buf.tell() <= MAX_BYTES:
                    return buf.getvalue()
            escala *= 0.85

        # Ultimo recurso: qualidade 30 na menor escala
        buf = io.BytesIO()
        img_res.save(buf, format="JPEG", quality=30, progressive=True, optimize=True)
        return buf.getvalue()


def dhash(imagem: Union[Image.Image, bytes]) -> str:
    """
    Calcula impressao digital dHash de 64 bits para comparacao visual.
    Reduz para 9x8 em tons de cinza e compara pixels adjacentes.
    Retorna string hexadecimal de 16 caracteres.
    """
    if isinstance(imagem, bytes):
        img = Image.open(io.BytesIO(imagem))
    else:
        img = imagem

    # Escala de cinza e redimensionamento para 9x8
    img_gray = img.convert("L").resize((9, 8), Image.Resampling.LANCZOS)

    diff = []
    for row in range(8):
        for col in range(8):
            p1 = img_gray.getpixel((col, row))
            p2 = img_gray.getpixel((col + 1, row))
            diff.append(1 if p1 > p2 else 0)

    val = 0
    for bit in diff:
        val = (val << 1) | bit

    return f"{val:016x}"


def distancia_hamming(h1: str, h2: str) -> int:
    """Calcula a distancia de Hamming entre dois dHashes hexadecimais de 64 bits."""
    val1 = int(h1, 16)
    val2 = int(h2, 16)
    return bin(val1 ^ val2).count("1")
