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


def eventos(peca: str) -> list[dict]:
    """Os eventos do roteiro com o tempo resolvido (como em motor.js e som.py)."""
    p = ROTEIRO['pecas'][peca]
    out = []
    for e in p['eventos']:
        if 't' not in e and 'em' not in e:
            continue
        ts = [e['t']] if 't' in e else p['marcas'][e['em']]
        ts = ts if isinstance(ts, list) else [ts]
        if 'indices' in e:
            ts = [ts[i] for i in e['indices']]
        for t in ts:
            t += e.get('mais', 0.0)
            if t >= 0:
                out.append({**e, 't': t})
    return sorted(out, key=lambda e: e['t'])


def sincronia(arq: pathlib.Path, peca: str) -> None:
    """Confere, no MP4 pronto, se cada impacto do roteiro bate com um ataque no áudio e com um salto na imagem.

    Áudio: decodificado do arquivo (o ffmpeg respeita o atraso inicial do AAC); o ataque é o primeiro instante,
    perto do evento, em que a energia em 1 ms passa de 6 vezes a energia de 10 a 20 ms antes. Imagem: a diferença
    média entre quadros seguidos (cinza, reduzida); o tremor e o corte de cada impacto aparecem como um salto no
    quadro do evento (num trecho que já vinha em movimento rápido, o salto pode não se destacar)."""
    import numpy as np
    fps, sr = ROTEIRO['fps'], 48000
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(arq), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True, check=True)
    x = np.frombuffer(r.stdout, dtype='<f4')
    energia = np.convolve(x.astype(np.float64) ** 2, np.ones(48) / 48, 'same')

    def ataque(t: float):
        a, b = max(int(0.02 * sr), int((t - 0.03) * sr)), int((t + 0.08) * sr)
        for i in range(a, min(b, len(energia)), 12):
            base = energia[i - 960:i - 480].mean() + 1e-7
            if energia[i] > 6 * base and energia[i] > 1e-5:
                return (i / sr - t) * 1000
        return None
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(arq), '-vf', 'scale=96:-2,format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True)
    d = ffprobe(arq)
    v = next(s for s in d['streams'] if s['codec_type'] == 'video')
    w = 96
    h = int(round(v['height'] * 96 / v['width'] / 2) * 2)
    q = np.frombuffer(r.stdout, dtype=np.uint8).reshape(-1, h, w).astype(np.float32)
    dif = np.concatenate([[0], np.abs(np.diff(q, axis=0)).mean(axis=(1, 2))])
    linhas, atrasos, saltos = [], [], 0
    fortes = [e for e in eventos(peca) if e['som'] in ('impacto', 'carimbo', 'pop') and e.get('forca', 1) >= 0.5]
    for e in fortes:
        t = e['t']
        atraso = ataque(t)
        if atraso is not None:
            atrasos.append(atraso)
        fq = int(round(t * fps))
        viz = dif[max(0, fq - 4):fq]
        salto = dif[fq:fq + 2].max() > (viz.mean() if len(viz) else 0) * 1.15 if fq < len(dif) else False
        saltos += bool(salto)
        linhas.append(f"    {t:6.2f} s  {e['som']:<8} {e.get('em', ''):<20} áudio {('%+5.0f ms' % atraso) if atraso is not None else 'sobre som contínuo'}   imagem {'salta' if salto else 'parada'} no quadro {fq}")
    print(f"  sincronia: {len(fortes)} impactos fortes; ataque do áudio a {np.median(np.abs(atrasos)):.0f} ms (mediana) do evento, "
          f"o pior a {max(np.abs(atrasos)):.0f} ms ({len(atrasos)} medidos); {saltos} de {len(fortes)} com salto na imagem no quadro do evento")
    print('\n'.join(linhas))


def conferir_video(arq: pathlib.Path) -> None:
    print(resumo(arq))
    print(loudness(arq))
    sincronia(arq, 'vinheta' if 'vinheta' in arq.name else 'principal')
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
