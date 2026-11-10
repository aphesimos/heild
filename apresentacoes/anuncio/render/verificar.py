#!/usr/bin/env python3
"""Anúncio da Heild — a conferência dos vídeos.

  python3 apresentacoes/anuncio/render/verificar.py                 # todos os MP4 de saida/
  python3 apresentacoes/anuncio/render/verificar.py --pasta saida/quadros/heild-anuncio-9x16   # PNGs soltos

Para cada vídeo:
- ffprobe: resolução, fps, duração, codecs, perfil, pix_fmt, cor, áudio;
- os quadros dos momentos do roteiro (as marcas de src/roteiro.json), numa folha de contato
  (saida/conferencia/<nome>-folha.png), e uma cópia com as zonas seguras do Reels e do TikTok desenhadas
  por cima (no 9:16: 14% de cima, 22% de baixo e 13% à direita), em <nome>-zonas.png;
- o loudness integrado e o pico real do áudio (ffmpeg ebur128).
Precisa de Pillow (pip install pillow).
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

AQUI = pathlib.Path(__file__).resolve().parent
ANUNCIO = AQUI.parent
SAIDA = ANUNCIO / 'saida'
CONF = SAIDA / 'conferencia'
ROTEIRO = json.loads((ANUNCIO / 'src' / 'roteiro.json').read_text(encoding='utf-8'))

ZONAS_9x16 = {'cima': 0.14, 'baixo': 0.22, 'direita': 0.13}


def ffprobe(arq: pathlib.Path) -> dict:
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(arq)], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def resumo(arq: pathlib.Path) -> str:
    d = ffprobe(arq)
    v = next(s for s in d['streams'] if s['codec_type'] == 'video')
    a = next((s for s in d['streams'] if s['codec_type'] == 'audio'), None)
    fps = v['r_frame_rate']
    linhas = [f"{arq.name}: {v['width']}x{v['height']}, {fps} fps, {float(d['format']['duration']):.3f} s, "
              f"{v['codec_name']} {v.get('profile')} {v.get('pix_fmt')} ({v.get('color_space')}/{v.get('color_primaries')}/{v.get('color_transfer')}), "
              f"{int(v.get('nb_frames', 0))} quadros, {int(d['format']['bit_rate']) // 1000} kb/s, {arq.stat().st_size / 1e6:.1f} MB"]
    if a:
        linhas.append(f"  áudio: {a['codec_name']} {a.get('profile')} {a['sample_rate']} Hz, {a['channels']} canais ({a.get('channel_layout')})")
    else:
        linhas.append('  sem áudio')
    return '\n'.join(linhas)


def loudness(arq: pathlib.Path) -> str:
    r = subprocess.run(['ffmpeg', '-nostats', '-i', str(arq), '-filter_complex', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
    txt = r.stderr
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', txt)
    tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', txt)
    lra = re.findall(r'LRA:\s+(-?[\d.]+) LU', txt)
    return f"  loudness: {i[-1] if i else '?'} LUFS integrado, pico real {tp[-1] if tp else '?'} dBTP, LRA {lra[-1] if lra else '?'} LU"


def momentos(peca: str) -> list[tuple[float, str]]:
    """Os instantes que valem conferir: o começo, cada palavra que bate e as marcas de cada cena."""
    p = ROTEIRO['pecas'][peca]
    ms = [(0.0, 'quadro 0')]
    for nome, v in p['marcas'].items():
        if nome == 'gancho.fichas':
            continue
        if isinstance(v, list):
            if 'palavras' in nome:
                ms.append((v[-1] + 0.25, nome.split('.')[0] + ' (frase inteira)'))
            else:
                ms.append((v[-1] + 0.15, nome))
        else:
            ms.append((v + 0.12, nome))
    for c in p['cenas']:
        ms.append((min(c['ate'] - 0.05, p['duracao'] - 1 / ROTEIRO['fps']), c['id'] + ' (fim)'))
    ms.append((p['capa'], 'capa'))
    ms = sorted({round(t * ROTEIRO['fps']) / ROTEIRO['fps']: n for t, n in ms if 0 <= t < p['duracao']}.items())
    return ms


def quadro(arq: pathlib.Path, t: float) -> Image.Image:
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.4f}', '-i', str(arq), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True, check=True)
    import io
    return Image.open(io.BytesIO(r.stdout)).convert('RGB')


def zonas(img: Image.Image) -> Image.Image:
    """Desenha as zonas seguras do 9:16 por cima (vermelho translúcido = fora da área segura)."""
    w, h = img.size
    sob = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(sob)
    cor = (220, 40, 40, 90)
    d.rectangle([0, 0, w, int(h * ZONAS_9x16['cima'])], fill=cor)
    d.rectangle([0, int(h * (1 - ZONAS_9x16['baixo'])), w, h], fill=cor)
    d.rectangle([int(w * (1 - ZONAS_9x16['direita'])), int(h * ZONAS_9x16['cima']), w, int(h * (1 - ZONAS_9x16['baixo']))], fill=cor)
    return Image.alpha_composite(img.convert('RGBA'), sob).convert('RGB')


def fonte(tam: int):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        if pathlib.Path(f).exists():
            return ImageFont.truetype(f, tam)
    return ImageFont.load_default()


def folha(imgs: list[tuple[Image.Image, str]], destino: pathlib.Path, largura: int = 300, colunas: int = 6) -> None:
    w0, h0 = imgs[0][0].size
    esc = largura / w0
    tw, th = largura, int(h0 * esc)
    linhas = (len(imgs) + colunas - 1) // colunas
    rot = 26
    f = Image.new('RGB', (colunas * (tw + 8) + 8, linhas * (th + rot + 8) + 8), (40, 38, 36))
    d = ImageDraw.Draw(f)
    ft = fonte(14)
    for i, (im, txt) in enumerate(imgs):
        c, l = i % colunas, i // colunas
        x, y = 8 + c * (tw + 8), 8 + l * (th + rot + 8)
        f.paste(im.resize((tw, th), Image.LANCZOS), (x, y + rot))
        d.text((x + 2, y + 4), txt, fill=(240, 236, 230), font=ft)
    destino.parent.mkdir(parents=True, exist_ok=True)
    f.save(destino)
    print(f'  folha: {destino}')


def conferir_video(arq: pathlib.Path) -> None:
    print(resumo(arq))
    print(loudness(arq))
    peca = 'vinheta' if 'vinheta' in arq.name else 'principal'
    ms = momentos(peca)
    imgs = [(quadro(arq, t), f'{t:05.2f} s  {n}') for t, n in ms]
    nome = arq.stem
    folha(imgs, CONF / f'{nome}-folha.png')
    if '9x16' in nome:
        folha([(zonas(im), n) for im, n in imgs], CONF / f'{nome}-zonas.png')


def conferir_pasta(pasta: pathlib.Path) -> None:
    arqs = sorted(pasta.glob('q*.png'))
    imgs = [(Image.open(a).convert('RGB'), f'{int(a.stem[1:]) / ROTEIRO["fps"]:05.2f} s') for a in arqs]
    folha(imgs, CONF / f'{pasta.name}-folha.png', colunas=8 if imgs[0][0].width < imgs[0][0].height else 6)
    if imgs[0][0].size == (1080, 1920):
        folha([(zonas(im), n) for im, n in imgs], CONF / f'{pasta.name}-zonas.png', colunas=8)


def principal() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('arquivos', nargs='*', type=pathlib.Path)
    ap.add_argument('--pasta', type=pathlib.Path)
    a = ap.parse_args()
    if a.pasta:
        conferir_pasta(a.pasta.resolve())
        return
    arqs = a.arquivos or sorted(SAIDA.glob('*.mp4'))
    if not arqs:
        sys.exit('nenhum MP4 em saida/ (rode render/render.mjs)')
    for arq in arqs:
        conferir_video(arq.resolve())
        print()


if __name__ == '__main__':
    principal()
