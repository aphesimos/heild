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
Saída: apresentacoes/dist/heild-<nome>.html (fora do git). É o formato da página do claude.ai, que
acrescenta <!doctype>, <html>, <head> e <body>.

Modo site: as peças que também são páginas do site (SITE, abaixo) viram documentos completos, numa pasta:
  python3 apresentacoes/build.py --site <pasta>               # as duas: diretrizes.html e inteiro.html
  python3 apresentacoes/build.py --site <pasta> inteiro       # só uma
Cada página ganha <!doctype html>, <html lang="pt-BR"> e um <head> com título, descrição, og, theme-color
e o favicon do site (favicon.svg); as fontes vão para <pasta>/fontes/*.woff2, fora do HTML, para as páginas
dividirem o cache; e window.HEILD_LINKS leva os links entre as peças e para a página inicial do site, como
endereços relativos (as peças leem antes das constantes do claude.ai). No site, a pasta é app/public/.

Precisa dos branches no remoto: git fetch origin design-system prototipo
"""
import argparse
import base64
import html as html_mod
import json
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

# As peças que também são páginas do site: o arquivo, o título e a frase curta (og:description). A descrição
# longa vem do <meta name="description"> do modelo. theme-color: os tokens de fundo (comum/tokens.css); a do
# "Do inteiro" é a do escuro, porque a peça começa no escuro, qualquer que seja o tema.
SITE = {
    'diretrizes-web': {
        'arquivo': 'diretrizes.html',
        'titulo': 'Diretrizes da marca · Heild',
        'frase': 'A logo, o movimento, a cor, os orbs e a voz da Heild, numa página de rolagem.',
        'cor': {'claro': '--areia-50', 'escuro': '--areia-900'},
    },
    'inteiro': {
        'arquivo': 'inteiro.html',
        'titulo': 'Do inteiro · Heild',
        'frase': 'O nome e a filosofia da Heild, em fólios.',
        'cor': {'sempre': '--areia-900'},
    },
}
# Os links das páginas do site, relativos: as três ficam na mesma pasta (a raiz do site publicado).
LINKS_SITE = {'inicio': './', 'diretrizes': SITE['diretrizes-web']['arquivo'], 'inteiro': SITE['inteiro']['arquivo']}

# O começo do modelo que vai para o <head> no modo site: <title>, <meta>, <link>, <style> e <script>.
CABECA = re.compile(r'\s*(<title>.*?</title>|<meta\b[^>]*>|<link\b[^>]*>|<style>.*?</style>|<script>.*?</script>)', re.S)


def do_git(ref: str, caminho: str) -> bytes:
    return subprocess.run(['git', '-C', str(AQUI), 'show', f'{ref}:{caminho}'], check=True, capture_output=True).stdout


def git_texto(*args: str) -> str:
    return subprocess.run(['git', '-C', str(AQUI), *args], check=True, capture_output=True, text=True).stdout.strip()


def apresentacoes() -> list[str]:
    return sorted(p.parent.parent.name for p in AQUI.glob('*/src/modelo.html'))


def montar_html(nome: str, ds: str, proto: str, fontes_url: str | None = None) -> str:
    """O modelo com as marcas trocadas. Com fontes_url, as fontes apontam para arquivos nessa pasta (relativa)
    em vez de irem embutidas."""
    pasta = AQUI / nome
    html = (pasta / 'src' / 'modelo.html').read_text(encoding='utf-8')
    cache: dict[str, str] = {}

    def fontes() -> str:
        if 'f' not in cache:
            css = []
            for familia, estilo, pesos, caminho in FONTES:
                if fontes_url is None:
                    b64 = base64.b64encode(do_git(ds, caminho)).decode('ascii')
                    src = f'data:font/woff2;base64,{b64}'
                else:
                    src = f'{fontes_url}/{pathlib.PurePosixPath(caminho).name}'
                css.append(f"@font-face{{font-family:'{familia}';src:url({src}) format('woff2');"
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

    return re.sub(r'/\*\{\{([A-Z_]+(?::[^}]+)?)\}\}\*/', trocar, html)


def montar(nome: str, ds: str, proto: str) -> pathlib.Path:
    saida = AQUI / 'dist' / f'heild-{nome}.html'
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(montar_html(nome, ds, proto), encoding='utf-8')
    return saida


def token(nome: str) -> str:
    """O valor de um token na raiz (claro) de comum/tokens.css."""
    m = re.search(re.escape(nome) + r':\s*(#[0-9a-fA-F]{3,8})', (AQUI / 'comum' / 'tokens.css').read_text(encoding='utf-8'))
    if not m:
        raise SystemExit(f'token {nome} não encontrado em comum/tokens.css')
    return m.group(1)


def origem() -> str:
    """De onde a página saiu: o branch e o commit (e se havia mudanças fora do commit nas apresentações)."""
    ramo, commit = git_texto('rev-parse', '--abbrev-ref', 'HEAD'), git_texto('rev-parse', '--short', 'HEAD')
    sujo = ' com alterações fora do commit' if git_texto('status', '--porcelain', '--', str(AQUI)) else ''
    return f'branch {ramo}, commit {commit}{sujo}'


def montar_site(nome: str, ds: str, proto: str, destino: pathlib.Path, de_onde: str) -> pathlib.Path:
    """Uma página completa do site: o mesmo modelo, com <head>, fontes por URL e os links do site."""
    cfg = SITE[nome]
    corpo = montar_html(nome, ds, proto, fontes_url='fontes')
    # separa o começo do modelo (title, meta, style, script) do resto, que vai para o <body>
    cabeca, fim = [], 0
    for m in CABECA.finditer(corpo):
        if m.start() != fim:
            break
        cabeca.append(m.group(1))
        fim = m.end()
    corpo = corpo[fim:].lstrip('\n')
    descricao = ''
    resto = []
    for el in cabeca:
        if el.startswith('<title>') or re.match(r'<meta\s+charset', el, re.I):
            continue
        d = re.match(r'<meta\s+name="description"\s+content="([^"]*)"', el)
        if d:
            descricao = d.group(1)
            continue
        resto.append(el)
    if not descricao:
        raise SystemExit(f'{nome}: o modelo não tem <meta name="description">')

    def atr(v: str) -> str:
        return html_mod.escape(v, quote=True)

    cores = cfg['cor']
    if 'sempre' in cores:
        tema_cor = [f'<meta name="theme-color" content="{token(cores["sempre"])}">']
    else:
        tema_cor = [f'<meta name="theme-color" media="(prefers-color-scheme: light)" content="{token(cores["claro"])}">',
                    f'<meta name="theme-color" media="(prefers-color-scheme: dark)" content="{token(cores["escuro"])}">']
    links = json.dumps(LINKS_SITE, ensure_ascii=False)
    # as metas que o modelo já tinha (viewport, color-scheme) vêm antes do resto da cabeça (style, script)
    metas = [el for el in resto if el.startswith('<meta')]
    outros = [el for el in resto if not el.startswith('<meta')]
    viewport = [el for el in metas if 'name="viewport"' in el]
    metas = [el for el in metas if el not in viewport]
    head = [
        '<meta charset="utf-8">',
        *viewport,
        f'<title>{html_mod.escape(cfg["titulo"])}</title>',
        f'<meta name="description" content="{descricao}">',
        f'<meta property="og:title" content="{atr(cfg["titulo"])}">',
        f'<meta property="og:description" content="{atr(cfg["frase"])}">',
        '<meta property="og:type" content="website">',
        *tema_cor,
        *metas,
        '<link rel="icon" type="image/svg+xml" href="favicon.svg">',
        f'<script>window.HEILD_LINKS = {links};</script>',
        *outros,
    ]
    pagina = ('<!doctype html>\n'
              f'<!-- Gerado por apresentacoes/build.py --site ({de_onde}), a partir de apresentacoes/{nome}. Não edite à mão. -->\n'
              '<html lang="pt-BR">\n<head>\n' + '\n'.join(head) + '\n</head>\n<body>\n' + corpo.rstrip('\n') + '\n</body>\n</html>\n')
    saida = destino / cfg['arquivo']
    saida.write_text(pagina, encoding='utf-8')
    return saida


def principal() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('nomes', nargs='*', help='apresentações a montar (padrão: todas; com --site, as do site)')
    ap.add_argument('--design-system', default='origin/design-system')
    ap.add_argument('--prototipo', default='origin/prototipo')
    ap.add_argument('--site', metavar='PASTA', type=pathlib.Path,
                    help='gera as páginas completas do site nesta pasta (no branch site: app/public)')
    a = ap.parse_args()
    if a.site is None:
        for nome in a.nomes or apresentacoes():
            s = montar(nome, a.design_system, a.prototipo)
            print(f'{s} ({s.stat().st_size / 1024:.0f} KB)')
        return
    nomes = a.nomes or list(SITE)
    fora = [n for n in nomes if n not in SITE]
    if fora:
        raise SystemExit(f'sem página no site: {", ".join(fora)} (as do site são {", ".join(SITE)})')
    destino = a.site.resolve()
    (destino / 'fontes').mkdir(parents=True, exist_ok=True)
    for _, _, _, caminho in FONTES:
        f = destino / 'fontes' / pathlib.PurePosixPath(caminho).name
        f.write_bytes(do_git(a.design_system, caminho))
        print(f'{f} ({f.stat().st_size / 1024:.0f} KB)')
    de_onde = origem()
    for nome in nomes:
        s = montar_site(nome, a.design_system, a.prototipo, destino, de_onde)
        print(f'{s} ({s.stat().st_size / 1024:.0f} KB)')


if __name__ == '__main__':
    principal()
