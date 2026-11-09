# Apresentações da Heild

Cada apresentação é uma pasta, com o mesmo build e os mesmos tokens do design system.

| Pasta | O que é |
|---|---|
| [`produto/`](produto) | A marca e o produto, com uma versão por plataforma (principal, Heild Contábil, Heild BPO), montadas no mesmo molde |
| [`diretrizes/`](diretrizes) | As diretrizes da marca: a identidade sozinha, slide a slide (logo, movimento, cor, orbs, tipografia, forma, voz, aplicações) |
| [`diretrizes-web/`](diretrizes-web) | As diretrizes da marca numa página de rolagem, para o site: o nome, a ideia, a logo, o movimento, a cor, os orbs, a tipografia, a forma, a voz e as aplicações, com o campo de cápsulas feito do material da logo |
| [`raciocinio/`](raciocinio) | O raciocínio do Consultor: como ele responde com a lei certa, na data certa, com a prova, e por que é diferente de uma IA comum; para advocacia, contabilidade e BPO |
| `comum/` | O que todas usam: os tokens do design system (`tokens.css`) |

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py            # todas
python3 apresentacoes/build.py diretrizes # só uma
```

Cada uma vira `apresentacoes/dist/heild-<nome>.html`, um HTML só, que abre sem internet. O build embute as fontes e o `<heild-logo>` do branch `design-system` e o `<orb-avatar>` do protótipo (branch `prototipo`), sempre na versão atual.

Uma apresentação nova é uma pasta com `src/modelo.html`; as marcas que o build troca estão descritas no topo de `build.py`.
