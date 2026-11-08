#!/usr/bin/env python3
"""
Inspeciona arquivos de fonte (woff2, woff, ttf, otf) de uma pasta e aponta
qual arquivo (ou conjunto) é a família variável mais completa.

Uso:  python3 scripts/inspecionar_fontes.py <pasta>
Requer: pip install fonttools brotli
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont

EXTS = {'.woff2', '.woff', '.ttf', '.otf'}


def nome(font, nid):
    rec = font['name'].getDebugName(nid)
    return rec or ''


def recursos(font):
    tags = set()
    for t in ('GSUB', 'GPOS'):
        if t in font and font[t].table.FeatureList:
            tags.update(fr.FeatureTag for fr in font[t].table.FeatureList.FeatureRecord)
    return sorted(tags)


def inspecionar(caminho):
    f = TTFont(caminho, lazy=True)
    info = {
        'arquivo': caminho.name,
        'tamanho_kb': round(caminho.stat().st_size / 1024),
        'familia': nome(f, 16) or nome(f, 1),
        'estilo': nome(f, 17) or nome(f, 2),
        'nome_completo': nome(f, 4),
        'versao': nome(f, 5),
        'glifos': f['maxp'].numGlyphs,
        'caracteres': len(f.getBestCmap() or {}),
        'peso_os2': f['OS/2'].usWeightClass if 'OS/2' in f else None,
        'italico': bool(f['OS/2'].fsSelection & 1) if 'OS/2' in f else False,
        'eixos': [],
        'instancias': [],
        'recursos': recursos(f),
    }
    if 'fvar' in f:
        fvar = f['fvar']
        info['eixos'] = [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in fvar.axes]
        info['instancias'] = [nome(f, i.subfamilyNameID) for i in fvar.instances]
    f.close()
    return info


def pontuar(i):
    # Variável vale mais; depois mais eixos, mais instâncias, mais glifos e recursos.
    return (bool(i['eixos']), len(i['eixos']), len(i['instancias']), i['glifos'], len(i['recursos']))


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    pasta = Path(sys.argv[1])
    arquivos = sorted(p for p in pasta.rglob('*') if p.suffix.lower() in EXTS)
    if not arquivos:
        sys.exit(f'Nenhuma fonte em {pasta}')

    fontes = []
    for p in arquivos:
        try:
            fontes.append(inspecionar(p))
        except Exception as e:  # arquivo corrompido ou não-fonte
            print(f'!! {p.name}: não li ({e})')

    for i in sorted(fontes, key=pontuar, reverse=True):
        tipo = 'VARIÁVEL' if i['eixos'] else 'estática'
        print(f"\n== {i['arquivo']}  ({i['tamanho_kb']} KB, {tipo})")
        print(f"   família: {i['familia']} · estilo: {i['estilo']} · {i['nome_completo']}")
        print(f"   {i['versao']}")
        print(f"   glifos: {i['glifos']} · caracteres mapeados: {i['caracteres']} · itálico: {i['italico']} · peso OS/2: {i['peso_os2']}")
        for tag, mn, df, mx in i['eixos']:
            print(f"   eixo {tag}: {mn:g} a {mx:g} (padrão {df:g})")
        if i['instancias']:
            print(f"   instâncias ({len(i['instancias'])}): {', '.join(i['instancias'])}")
        print(f"   recursos OpenType ({len(i['recursos'])}): {' '.join(i['recursos'])}")

    variaveis = [i for i in fontes if i['eixos']]
    print('\n' + '=' * 70)
    if not variaveis:
        print('Nenhum arquivo variável. Use o conjunto de estáticas por peso.')
        return
    for italico in (False, True):
        grupo = [i for i in variaveis if i['italico'] == italico or ('ital' in [e[0] for e in i['eixos']])]
        if grupo:
            melhor = max(grupo, key=pontuar)
            rot = 'itálico' if italico else 'romano'
            print(f"Mais completa ({rot}): {melhor['arquivo']} · eixos {[e[0] for e in melhor['eixos']]} · {melhor['glifos']} glifos · {len(melhor['recursos'])} recursos")


if __name__ == '__main__':
    main()
