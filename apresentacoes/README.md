# Apresentações da Heild

Cada apresentação é uma pasta, com o mesmo build e os mesmos tokens do design system.

| Pasta | O que é |
|---|---|
| [`produto/`](produto) | A marca e o produto, com uma versão por plataforma (principal, Heild Contábil, Heild BPO), montadas no mesmo molde |
| [`diretrizes/`](diretrizes) | As diretrizes da marca: a identidade sozinha, slide a slide (logo, movimento, cor, orbs, tipografia, forma, voz, aplicações) |
| `genealogia/` | A genealogia da marca: uma peça experimental e artística, em formato de microsite com rolagem, para entrar no site |
| `raciocinio/` | O raciocínio do Consultor: como ele responde com a lei certa, na data certa |
| `comum/` | O que todas usam: os tokens do design system (`tokens.css`) |

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py            # todas
python3 apresentacoes/build.py diretrizes # só uma
```

Cada uma vira `apresentacoes/dist/heild-<nome>.html`, um HTML só, que abre sem internet. O build embute as fontes e o `<heild-logo>` do branch `design-system` e o `<orb-avatar>` do protótipo (branch `prototipo`), sempre na versão atual.

Uma apresentação nova é uma pasta com `src/modelo.html`; as marcas que o build troca estão descritas no topo de `build.py`.
