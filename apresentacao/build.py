#!/usr/bin/env python3
"""Monta a apresentação da Heild num HTML só, sem dependências de rede.

Junta src/modelo.html, src/estilo.css e os scripts de src/ com o que vem dos outros branches deste
repositório, que são a fonte da verdade:
  - as fontes PP Neue Montreal e o <heild-logo>, do branch design-system;
  - o <orb-avatar>, da cópia que o protótipo usa (branch prototipo).

Uso:
  python3 apresentacao/build.py                 # gera apresentacao/dist/heild-apresentacao.html
  python3 apresentacao/build.py --saida X.html  # escolhe o arquivo de saída
Precisa dos branches no remoto: git fetch origin design-system prototipo
"""
import argparse
import base64
import pathlib
import subprocess

AQUI = pathlib.Path(__file__).resolve().parent
SRC = AQUI / 'src'

FONTES = [
    ('PP Neue Montreal', 'normal', '100 900', 'design-system/fontes/PPNeueMontreal-Roman-Variable.woff2'),
    ('PP Neue Montreal Text', 'normal', '200 700', 'design-system/fontes/PPNeueMontrealText-Roman-Variable.woff2'),
    ('PP Neue Montreal Text', 'italic', '200 700', 'design-system/fontes/PPNeueMontrealText-Italic-Variable.woff2'),
]


def do_git(ref: str, caminho: str) -> bytes:
    return subprocess.run(['git', '-C', str(AQUI), 'show', f'{ref}:{caminho}'], check=True, capture_output=True).stdout


def principal() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', default=str(AQUI / 'dist' / 'heild-apresentacao.html'))
    ap.add_argument('--design-system', default='origin/design-system')
    ap.add_argument('--prototipo', default='origin/prototipo')
    a = ap.parse_args()

    fontes = []
    for familia, estilo, pesos, caminho in FONTES:
        b64 = base64.b64encode(do_git(a.design_system, caminho)).decode('ascii')
        fontes.append(
            f"@font-face{{font-family:'{familia}';src:url(data:font/woff2;base64,{b64}) format('woff2');"
            f"font-weight:{pesos};font-style:{estilo};font-display:swap}}"
        )

    html = (SRC / 'modelo.html').read_text(encoding='utf-8')
    trocas = {
        '/*{{FONTES}}*/': '\n'.join(fontes),
        '/*{{ESTILO}}*/': (SRC / 'estilo.css').read_text(encoding='utf-8'),
        '/*{{HEILD_LOGO}}*/': do_git(a.design_system, 'design-system/componentes/heild-logo/heild-logo.js').decode('utf-8'),
        '/*{{ORB_AVATAR}}*/': do_git(a.prototipo, 'app/src/vendor/orb-avatar/orb-avatar.js').decode('utf-8'),
        '/*{{DADOS}}*/': (SRC / 'dados.js').read_text(encoding='utf-8'),
        '/*{{SLIDES}}*/': (SRC / 'slides.js').read_text(encoding='utf-8'),
        '/*{{MOTOR}}*/': (SRC / 'motor.js').read_text(encoding='utf-8'),
    }
    for marca, conteudo in trocas.items():
        if marca not in html:
            raise SystemExit(f'marca {marca} não está no modelo')
        html = html.replace(marca, conteudo.replace('</script', '<\\/script'))

    saida = pathlib.Path(a.saida)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding='utf-8')
    print(f'{saida} ({saida.stat().st_size / 1024:.0f} KB)')


if __name__ == '__main__':
    principal()
