#!/usr/bin/env python3
"""
Gera as logos estáticas em design-system/logos/ a partir dos traçados do
componente <heild-logo> (os mesmos de ferramentas/wordmark.json no main):
o wordmark HEILD e a pílula do I, nas duas tintas da primaria
(areia-900 para fundo claro, areia-100 para fundo escuro).

Uso: python3 design-system/ferramentas/gerar_logos.py
"""
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, '..')
js = open(os.path.join(RAIZ, 'componentes', 'heild-logo', 'heild-logo.js')).read()
HE = re.search(r"var HE = '([^']+)'", js).group(1)
LD = re.search(r"var LD = '([^']+)'", js).group(1)
CX, H, PW = 634.344, 386.111, 147.297
TINTAS = {'tinta': '#24211f', 'papel': '#faf6f3'}  # areia-900 e areia-100

for nome, cor in TINTAS.items():
    wordmark = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1259 387" role="img" aria-label="Heild">'
                f'<path fill="{cor}" d="{HE}"/><path fill="{cor}" fill-rule="evenodd" d="{LD}"/>'
                f'<rect fill="{cor}" x="{CX - PW / 2:.3f}" y="0" width="{PW}" height="{H}" rx="{PW / 2:.3f}"/></svg>\n')
    pilula = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {PW} {H}" role="img" aria-label="Heild">'
              f'<rect fill="{cor}" width="{PW}" height="{H}" rx="{PW / 2:.3f}"/></svg>\n')
    for arquivo, conteudo in ((f'heild-wordmark-{nome}.svg', wordmark), (f'heild-i-{nome}.svg', pilula)):
        open(os.path.join(RAIZ, 'logos', arquivo), 'w').write(conteudo)
        print('logos/' + arquivo)
