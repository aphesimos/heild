#!/usr/bin/env python3
"""Monta as apresentações da Heild, cada uma num HTML só, sem dependências de rede.

Cada apresentação é uma pasta aqui dentro (produto, marca, raciocinio…) com src/modelo.html. O modelo
tem marcas que o build troca pelo conteúdo:
  /*{{FONTES}}*/              as quatro PP Neue Montreal, embutidas (branch design-system)
  /*{{HEILD_LOGO}}*/          o <heild-logo> (branch design-system)
  /*{{ORB_AVATAR}}*/          o <orb-avatar> que o protótipo usa (branch prototipo)
  /*{{ARQ:caminho}}*/         um arquivo, com o caminho relativo à pasta da apresentação
                              (por exemplo src/estilo.css ou ../comum/tokens.css)

Uso:
  python3 apresentacoes/build.py                  # monta todas
  python3 apresentacoes/build.py produto marca    # só as escolhidas
Saída: apresentacoes/dist/heild-<nome>.html (fora do git).
Precisa dos branches no remoto: git fetch origin design-system prototipo
"""
import argparse
import base64
import pathlib
import re
import subprocess

AQUI = pathlib.Path(__file__).resolve().parent

FONTES = [
    ('PP Neue Montreal', 'normal', '100 900', 'design-system/fontes/PPNeueMontreal-Roman-Variable.woff2'),
    ('PP Neue Montreal', 'italic', '100 900', 'design-system/fontes/PPNeueMontreal-Italic-Variable.woff2'),
    ('PP Neue Montreal Text', 'normal', '200 700', 'design-system/fontes/PPNeueMontrealText-Roman-Variable.woff2'),
    ('PP Neue Montreal Text', 'italic', '200 700', 'design-system/fontes/PPNeueMontrealText-Italic-Variable.woff2'),
]


def do_git(ref: str, caminho: str) -> bytes:
    return subprocess.run(['git', '-C', str(AQUI), 'show', f'{ref}:{caminho}'], check=True, capture_output=True).stdout


def apresentacoes() -> list[str]:
    return sorted(p.parent.parent.name for p in AQUI.glob('*/src/modelo.html'))


def montar(nome: str, ds: str, proto: str) -> pathlib.Path:
    pasta = AQUI / nome
    html = (pasta / 'src' / 'modelo.html').read_text(encoding='utf-8')
    cache: dict[str, str] = {}

    def fontes() -> str:
        if 'f' not in cache:
            css = []
            for familia, estilo, pesos, caminho in FONTES:
                b64 = base64.b64encode(do_git(ds, caminho)).decode('ascii')
                css.append(f"@font-face{{font-family:'{familia}';src:url(data:font/woff2;base64,{b64}) format('woff2');"
                           f"font-weight:{pesos};font-style:{estilo};font-display:swap}}")
            cache['f'] = '\n'.join(css)
        return cache['f']

    def trocar(m: re.Match) -> str:
        chave = m.group(1)
        if chave == 'FONTES':
            conteudo = fontes()
        elif chave == 'HEILD_LOGO':
            conteudo = do_git(ds, 'design-system/componentes/heild-logo/heild-logo.js').decode('utf-8')
        elif chave == 'ORB_AVATAR':
            conteudo = do_git(proto, 'app/src/vendor/orb-avatar/orb-avatar.js').decode('utf-8')
        elif chave.startswith('ARQ:'):
            conteudo = (pasta / chave[4:]).read_text(encoding='utf-8')
        else:
            raise SystemExit(f'{nome}: marca desconhecida {{{{{chave}}}}}')
        return conteudo.replace('</script', '<\\/script')

    html = re.sub(r'/\*\{\{([A-Z_]+(?::[^}]+)?)\}\}\*/', trocar, html)
    saida = AQUI / 'dist' / f'heild-{nome}.html'
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding='utf-8')
    return saida


def principal() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('nomes', nargs='*', help='apresentações a montar (padrão: todas)')
    ap.add_argument('--design-system', default='origin/design-system')
    ap.add_argument('--prototipo', default='origin/prototipo')
    a = ap.parse_args()
    for nome in a.nomes or apresentacoes():
        s = montar(nome, a.design_system, a.prototipo)
        print(f'{s} ({s.stat().st_size / 1024:.0f} KB)')


if __name__ == '__main__':
    principal()
