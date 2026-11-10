#!/usr/bin/env python3
"""Monta os modelos dos posts num HTML só (redes-sociais/render/dist/posts.html), com o build das apresentações.

Reaproveita apresentacoes/build.py: as mesmas marcas (FONTES, HEILD_LOGO, ORB_AVATAR, ARQ) e as mesmas fontes de
verdade (branch design-system para as fontes e o <heild-logo>, branch prototipo para o <orb-avatar>).

Uso:
  git fetch origin design-system prototipo
  python3 redes-sociais/render/montar.py
"""
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
sys.path.insert(0, str(RAIZ / 'apresentacoes'))
sys.dont_write_bytecode = True  # não deixa __pycache__ em apresentacoes/
import build  # noqa: E402

DS = 'origin/design-system'
PROTO = 'origin/prototipo'


def montar() -> pathlib.Path:
    # build.montar_html lê <pasta>/src/modelo.html, com a pasta relativa a apresentacoes/
    html = build.montar_html('../redes-sociais/modelos', DS, PROTO)
    saida = AQUI / 'dist' / 'posts.html'
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding='utf-8')
    return saida


if __name__ == '__main__':
    s = montar()
    print(f'{s} ({s.stat().st_size / 1024:.0f} KB)')
