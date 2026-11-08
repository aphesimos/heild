#!/usr/bin/env python3
"""
Gera os SVGs animados do README da Heild (assets/readme/), nos dois temas.

- hero-{claro,escuro}.svg: o wordmark HE·I·LD com o I passando por formas do
  sistema de movimento (pílula, barras do Contábil, pontos do Atendimento) e a
  luz do time (uma cor por integrante) respirando atrás.
- time-{claro,escuro}.svg: os orbs dos integrantes, cada um no seu ritmo,
  piscando e flutuando.
- areia-{claro,escuro}.svg: a escala de areia e o destaque.

As medidas da logo vêm de ferramentas/wordmark.json (os mesmos traçados do
componente <heild-logo>); as cores, do tokens.json do design system. Animação
em SMIL: o GitHub mostra SVG como imagem e roda SMIL, não roda script.

Uso: python3 ferramentas/gerar_svgs_readme.py
"""
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, '..', 'assets', 'readme')
W = json.load(open(os.path.join(AQUI, 'wordmark.json')))
CX, CY, H, PW = W['CX'], W['CY'], W['H'], W['PW']
U, STEP = 96, 120

AREIA = {50: '#fefbf9', 100: '#faf6f3', 150: '#f4efeb', 200: '#ede7e1', 300: '#d9d2cc', 400: '#bdb6b0', 500: '#9a948f', 600: '#7e7975', 650: '#696663',
         700: '#585552', 800: '#3a3735', 850: '#2e2b28', 900: '#24211f', 925: '#1b1917', 950: '#13110f'}
DESTAQUE = '#4f5bf5'
TEMAS = {
    'claro': {'fundo': AREIA[50], 'fundo_fim': AREIA[200], 'tinta': AREIA[900], 'suave': AREIA[650], 'luz': 0.42, 'mistura': 'multiply', 'olho': AREIA[950], 'assistente': AREIA[850], 'olho_assistente': AREIA[100]},
    'escuro': {'fundo': AREIA[900], 'fundo_fim': AREIA[950], 'tinta': AREIA[100], 'suave': AREIA[400], 'luz': 0.55, 'mistura': 'screen', 'olho': AREIA[950], 'assistente': AREIA[100], 'olho_assistente': AREIA[900]},
}
# Integrantes: nome e cor do orb (tema de fábrica do sistema).
TIME = [
    ('Assistente', None), ('Consultor', '#6e5cf2'), ('Fiscal', '#f7a335'), ('DP', '#3d86f7'), ('Contábil', '#4fc9a8'), ('Societário', '#e86a8a'), ('Notas', '#f2d04b'),
    ('Atendimento', '#5bc0eb'), ('Financeiro', '#9bc53d'), ('Contas a Pagar', '#f08a5d'), ('Contas a Receber', '#4cb782'), ('Conciliação', '#7c8cf8'), ('Gerencial', '#c46fd6'),
]
FONTE = "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif"


def f(v):
    return f'{v:.2f}'.rstrip('0').rstrip('.')


# ---------------------------------------------------------------- hero

def pilula():
    return [(CX - PW / 2, 0, PW, H)] * 3


def contabil():
    return [(CX - STEP - U / 2, H - 174, U, 174), (CX - U / 2, H - 270, U, 270), (CX + STEP - U / 2, 0, U, H)]


def pontos(sobe=(0, 0, 0)):
    return [(CX + (i - 1) * STEP - U / 2, CY - U / 2 - sobe[i], U, U) for i in range(3)]


def hero(tema):
    t = TEMAS[tema]
    afasta = 168 - PW / 2  # mesma conta do componente: a forma ocupa ±168 do centro
    # Linha do tempo (s) e o estado de cada momento: (forma das 3 cápsulas, afastamento das letras)
    quadros = [
        (0.0, pilula(), 0), (1.2, pilula(), 0),
        (1.36, [(CX - PW * 1.07 / 2, H * 0.025, PW * 1.07, H * 0.95)] * 3, 0),  # contração
        (2.3, contabil(), afasta), (2.45, [(x, y - 6, w, h + 6) if i == 2 else (x, y, w, h) for i, (x, y, w, h) in enumerate(contabil())], afasta),
        (2.6, contabil(), afasta), (4.2, contabil(), afasta),
        (5.1, pilula(), 0), (6.3, pilula(), 0),
        (6.46, [(CX - PW * 1.07 / 2, H * 0.025, PW * 1.07, H * 0.95)] * 3, 0),
        (7.3, pontos(), afasta), (7.55, pontos((44, 0, 0)), afasta), (7.8, pontos((0, 44, 0)), afasta), (8.05, pontos((0, 0, 44)), afasta),
        (8.3, pontos(), afasta), (8.55, pontos((44, 0, 0)), afasta), (8.8, pontos((0, 44, 0)), afasta), (9.05, pontos((0, 0, 44)), afasta), (9.3, pontos(), afasta),
        (10.2, pilula(), 0), (11.4, pilula(), 0),
    ]
    dur = quadros[-1][0]
    kt = ';'.join(f(q[0] / dur) for q in quadros)

    def anim(attr, vals):
        return f'<animate attributeName="{attr}" dur="{f(dur)}s" repeatCount="indefinite" keyTimes="{kt}" values="{";".join(f(v) for v in vals)}" calcMode="spline" keySplines="{";".join(["0.45 0 0.2 1"] * (len(quadros) - 1))}"/>'

    capsulas = []
    for i in range(3):
        xs = [q[1][i][0] for q in quadros]
        ys = [q[1][i][1] for q in quadros]
        ws = [q[1][i][2] for q in quadros]
        hs = [q[1][i][3] for q in quadros]
        rx = [min(w, h) / 2 for w, h in zip(ws, hs)]
        x0, y0, w0, h0 = quadros[0][1][i]
        capsulas.append(f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(w0)}" height="{f(h0)}" rx="{f(min(w0, h0) / 2)}">{anim("x", xs)}{anim("y", ys)}{anim("width", ws)}{anim("height", hs)}{anim("rx", rx)}</rect>')
    desloc = ';'.join(f'{f(-q[2])} 0' for q in quadros)
    desloc_ld = ';'.join(f'{f(q[2])} 0' for q in quadros)
    spl = ';'.join(['0.45 0 0.2 1'] * (len(quadros) - 1))

    def mover(vals):
        return f'<animateTransform attributeName="transform" type="translate" dur="{f(dur)}s" repeatCount="indefinite" keyTimes="{kt}" values="{vals}" calcMode="spline" keySplines="{spl}"/>'

    # Luz: manchas das cores do time, desfocadas, cada uma derivando devagar.
    cores = [c for _, c in TIME if c][:10] + [DESTAQUE]
    manchas = []
    for i, c in enumerate(cores):
        x = 140 + i * 100
        y = 230 + (40 if i % 2 else -30)
        dx, dy = 30 + (i % 3) * 14, 18 + (i % 4) * 6
        d = 9 + (i % 5) * 1.7
        manchas.append(
            f'<circle cx="{x}" cy="{y}" r="{110 + (i % 3) * 18}" fill="{c}">'
            f'<animateTransform attributeName="transform" type="translate" dur="{f(d)}s" repeatCount="indefinite" values="0 0;{dx} {-dy};{-dx} {dy};0 0" keyTimes="0;0.33;0.66;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>'
            f'<animate attributeName="opacity" dur="{f(d * 1.3)}s" repeatCount="indefinite" values="0.55;1;0.55" keyTimes="0;0.5;1"/></circle>'
        )
    escala = 0.42
    lx = (1280 - 1259 * escala) / 2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="460" viewBox="0 0 1280 460" role="img" aria-label="Heild: tudo, num lugar só">
<defs>
<linearGradient id="fundo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{t['fundo']}"/><stop offset="1" stop-color="{t['fundo_fim']}"/></linearGradient>
<filter id="desfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
<linearGradient id="some" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff"/><stop offset="0.75" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="faixa"><rect width="1280" height="460" fill="url(#some)"/></mask>
</defs>
<rect width="1280" height="460" rx="28" fill="url(#fundo)"/>
<g mask="url(#faixa)" opacity="{t['luz']}" style="mix-blend-mode:{t['mistura']}"><g filter="url(#desfoque)">{''.join(manchas)}</g></g>
<g transform="translate({f(lx)} 112) scale({escala})" fill="{t['tinta']}">
<g>{mover(desloc)}<path d="{W['HE']}"/></g>
<g>{mover(desloc_ld)}<path fill-rule="evenodd" d="{W['LD']}"/></g>
<g>{''.join(capsulas)}</g>
</g>
<text x="640" y="372" text-anchor="middle" font-family="{FONTE}" font-size="30" letter-spacing="-0.6" fill="{t['tinta']}">Tudo, num lugar só.</text>
<text x="640" y="408" text-anchor="middle" font-family="{FONTE}" font-size="16" fill="{t['suave']}">A marca, o site, o design system e o sistema da Heild, num repositório só.</text>
</svg>
'''


# ---------------------------------------------------------------- time (orbs)

def orb(cx, cy, r, cor, olho, atraso, i):
    """Um orb: esfera com brilho, sombra e dois olhos em cápsula que piscam."""
    ow, oh = r * 0.22, r * 0.5
    ex = r * 0.3
    pisca = f'{f(4 + (i % 4) * 0.9)}s'
    olhos = ''.join(
        f'<rect x="{f(cx + s * ex - ow / 2)}" y="{f(cy - r * 0.18 - oh / 2)}" width="{f(ow)}" height="{f(oh)}" rx="{f(ow / 2)}" fill="{olho}">'
        f'<animate attributeName="height" dur="{pisca}" begin="{f(atraso)}s" repeatCount="indefinite" values="{f(oh)};{f(oh)};{f(oh * 0.12)};{f(oh)};{f(oh)}" keyTimes="0;0.9;0.94;0.98;1"/>'
        f'<animate attributeName="y" dur="{pisca}" begin="{f(atraso)}s" repeatCount="indefinite" values="{f(cy - r * 0.18 - oh / 2)};{f(cy - r * 0.18 - oh / 2)};{f(cy - r * 0.18 - oh * 0.06)};{f(cy - r * 0.18 - oh / 2)};{f(cy - r * 0.18 - oh / 2)}" keyTimes="0;0.9;0.94;0.98;1"/></rect>'
        for s in (-1, 1)
    )
    return (
        f'<g><animateTransform attributeName="transform" type="translate" dur="{f(3 + (i % 3) * 0.4)}s" begin="{f(-atraso)}s" repeatCount="indefinite" values="0 0;0 -7;0 0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>'
        f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{cor}"/>'
        f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#brilho)"/>{olhos}</g>'
    )


def time(tema):
    t = TEMAS[tema]
    n = len(TIME)
    largura, alto = 1280, 230
    passo = (largura - 80) / n
    corpo = []
    for i, (nome, cor) in enumerate(TIME):
        cx = 40 + passo * (i + 0.5)
        c = cor or t['assistente']
        olho = t['olho_assistente'] if cor is None else t['olho']
        corpo.append(f'<ellipse cx="{f(cx)}" cy="150" rx="26" ry="5" fill="{t["tinta"]}" opacity="0.12"/>')
        corpo.append(orb(cx, 96, 30, c, olho, i * 0.37, i))
        # Nomes longos quebram em duas linhas (Contas a / Pagar).
        partes = [nome] if len(nome) <= 12 else [nome.rsplit(' ', 1)[0], nome.rsplit(' ', 1)[1]]
        for k, parte in enumerate(partes):
            corpo.append(f'<text x="{f(cx)}" y="{186 + k * 16}" text-anchor="middle" font-family="{FONTE}" font-size="13" fill="{t["suave"]}">{parte}</text>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{largura}" height="{alto}" viewBox="0 0 {largura} {alto}" role="img" aria-label="Os integrantes de IA da Heild">
<defs><radialGradient id="brilho" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.12"/></radialGradient></defs>
<rect width="{largura}" height="{alto}" rx="28" fill="{t['fundo']}"/>
{''.join(corpo)}
</svg>
'''


# ---------------------------------------------------------------- areia

def areia(tema):
    t = TEMAS[tema]
    passos = [50, 100, 150, 200, 300, 400, 500, 600, 650, 700, 800, 850, 900, 925, 950]
    largura, alto = 1280, 170
    w = (largura - 80 - 16 - 90) / len(passos)
    corpo = []
    for i, p in enumerate(passos):
        x = 40 + i * w
        corpo.append(
            f'<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="{f(i * 0.06)}s" dur="0.5s" fill="freeze"/>'
            f'<rect x="{f(x)}" y="36" width="{f(w - 6)}" height="70" rx="16" fill="{AREIA[p]}" stroke="{t["tinta"]}" stroke-opacity="0.08"/>'
            f'<text x="{f(x + (w - 6) / 2)}" y="130" text-anchor="middle" font-family="{FONTE}" font-size="12" fill="{t["suave"]}">{p}</text></g>'
        )
    xd = 40 + len(passos) * w + 16
    corpo.append(
        f'<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="{f(len(passos) * 0.06)}s" dur="0.5s" fill="freeze"/>'
        f'<rect x="{f(xd)}" y="36" width="84" height="70" rx="35" fill="{DESTAQUE}"><animate attributeName="width" values="84;92;84" dur="3.2s" repeatCount="indefinite"/></rect>'
        f'<text x="{f(xd + 42)}" y="130" text-anchor="middle" font-family="{FONTE}" font-size="12" fill="{t["suave"]}">destaque</text></g>'
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{largura}" height="{alto}" viewBox="0 0 {largura} {alto}" role="img" aria-label="A escala de areia e o destaque">
<rect width="{largura}" height="{alto}" rx="28" fill="{t['fundo']}"/>
{''.join(corpo)}
</svg>
'''


if __name__ == '__main__':
    os.makedirs(SAIDA, exist_ok=True)
    for tema in TEMAS:
        for nome, gerar in (('hero', hero), ('time', time), ('areia', areia)):
            caminho = os.path.join(SAIDA, f'{nome}-{tema}.svg')
            open(caminho, 'w').write(gerar(tema))
            print(caminho, os.path.getsize(caminho), 'bytes')
