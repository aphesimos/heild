#!/usr/bin/env python3
"""
Gera design-system/tokens.css a partir de tokens.json (a fonte da verdade).

- Cores: cada token vira --<nome>; o tema claro em :root e o escuro em
  [data-tema="escuro"] e em prefers-color-scheme: dark (quando a página não fixou
  o tema claro). Aliases ({areia-850}) são resolvidos; token sem valor no escuro
  herda o do claro.
- Espaço, raio, sombra e gradiente: --<nome> em :root.
- Fontes: @font-face de cada arquivo em fontes/ e --font-<família>.

Uso: python3 design-system/ferramentas/gerar_tokens_css.py
"""
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, '..')
t = json.load(open(os.path.join(RAIZ, 'tokens.json')))
cores = {c['name']: c['value'] for c in t['color']['tokens']}
# Sombras com valor por tema entram nos blocos de tema, junto com as cores.
for x in t.get('shadow', {}).get('tokens', []):
    if isinstance(x['value'], dict):
        cores[x['name']] = x['value']


def valor(nome, tema, visto=()):
    v = cores[nome]
    v = v.get(tema, v.get('claro')) if isinstance(v, dict) else v
    if isinstance(v, str) and v.startswith('{') and v.endswith('}'):
        alvo = v[1:-1]
        if alvo in visto:
            raise ValueError(f'alias circular em {nome}')
        return valor(alvo, tema, visto + (nome,))
    return v


def bloco(seletor, tema, recuo=''):
    linhas = [f'{recuo}{seletor} {{']
    linhas += [f'{recuo}  --{n}: {valor(n, tema)};' for n in cores]
    linhas.append(f'{recuo}}}')
    return '\n'.join(linhas)


saida = [f'/* {t.get("name", "Heild")} — gerado de tokens.json por ferramentas/gerar_tokens_css.py; não edite à mão. */', '']
for fo in t['type']['fonts']:
    saida.append(f"@font-face {{ font-family: '{fo['family']}'; src: url('{fo['file']}') format('woff2'); font-weight: {fo['weight']}; font-style: {fo.get('style', 'normal')}; font-display: swap; }}")
saida.append('')
saida.append(bloco(':root', 'claro'))
outros = []
for fam in ('spacing', 'radius', 'shadow', 'gradiente'):
    for x in t.get(fam, {}).get('tokens', []):
        v = x['value']
        if fam == 'shadow' and isinstance(v, dict):
            continue
        outros.append(f"  --{x['name']}: {v.get('claro', next(iter(v.values()))) if isinstance(v, dict) else v};")
for nome, fam in t['type'].get('families', {}).items():
    outros.append(f'  --font-{nome}: {fam};')
saida.append(':root {\n' + '\n'.join(outros) + '\n}')
saida.append('')
saida.append(bloco('[data-tema="escuro"]', 'escuro'))
saida.append('@media (prefers-color-scheme: dark) {\n' + bloco(':root:not([data-tema="claro"])', 'escuro', '  ') + '\n}')
open(os.path.join(RAIZ, 'tokens.css'), 'w').write('\n'.join(saida) + '\n')
print('tokens.css:', len(cores), 'tokens por tema,', len(outros), 'outros tokens')
