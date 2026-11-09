# Apresentações da Heild

Cada apresentação é uma pasta, com o mesmo build e os mesmos tokens do design system.

| Pasta | O que é |
|---|---|
| [`produto/`](produto) | A marca e o produto, com uma versão por plataforma (principal, Heild Contábil, Heild BPO), montadas no mesmo molde |
| [`diretrizes/`](diretrizes) | As diretrizes da marca: a identidade sozinha, slide a slide (logo, movimento, cor, orbs, tipografia, forma, voz, aplicações) |
| [`diretrizes-web/`](diretrizes-web) | As diretrizes da marca numa página de rolagem, para o site: o nome, a ideia, a logo, o movimento, a cor, os orbs, a tipografia, a forma, a voz e as aplicações, com o campo de cápsulas feito do material da logo |
| [`inteiro/`](inteiro) | Do inteiro: a filosofia da marca como uma experiência em câmaras, que se descobre (o nome raspado até a raiz, as duas raízes, a roda de Llull, os brancos, a obra de corpo, alma e espírito, o selo), com as fontes à parte |
| [`raciocinio/`](raciocinio) | O raciocínio do Consultor: como ele responde com a lei certa, na data certa, com a prova, e por que é diferente de uma IA comum; para advocacia, contabilidade e BPO |
| `comum/` | O que todas usam: os tokens do design system (`tokens.css`) e o tema do site em JS puro (`tema.js` e `tema.css`: o mesmo botão de sol e lua, a mesma onda e a mesma escolha guardada em `heild-tema`), usado pelas diretrizes em rolagem |

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py            # todas
python3 apresentacoes/build.py diretrizes # só uma
```

Cada uma vira `apresentacoes/dist/heild-<nome>.html`, um HTML só, que abre sem internet. O build embute as fontes e o `<heild-logo>` do branch `design-system` e o `<orb-avatar>` do protótipo (branch `prototipo`), sempre na versão atual.

Uma apresentação nova é uma pasta com `src/modelo.html`; as marcas que o build troca estão descritas no topo de `build.py`.

## No site

As diretrizes em rolagem e o "Do inteiro" também são páginas do site (branch `site`). O modo site do build gera as duas como documentos completos, com as fontes à parte:

```bash
python3 apresentacoes/build.py --site <caminho do branch site>/app/public
```

Saem `diretrizes.html`, `inteiro.html` e `fontes/*.woff2`, que o Vite copia como estão para o build do site. Cada página ganha o `<head>` (título, descrição, og, theme-color e o favicon do site) e `window.HEILD_LINKS`, com os links entre as peças e para a página inicial como endereços relativos; as peças leem `HEILD_LINKS` antes das constantes do claude.ai (`LINK_FILOSOFIA` em `diretrizes-web/src/diretrizes.js` e `LINK_DIRETRIZES` em `inteiro/src/modelo.html`), que seguem valendo nas versões publicadas lá. O modo normal continua gerando as páginas do claude.ai.

O tema das diretrizes é o do site (`comum/tema.js` e `comum/tema.css`, extraídos de `app/src/site/SiteApp.tsx` e `app/src/site/tema.css`): trocar no site e abrir as diretrizes, ou o contrário, mantém o tema. O "Do inteiro" não segue o tema: começa no escuro e amanhece por narrativa.
