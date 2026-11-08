# Os branches da Heild

Cada parte da marca mora no seu branch. Todos nascem do `main`, que guarda o hub e o que é comum; o `site` nasce do `prototipo`, porque usa o código do app.

```
main ─┬─ design-system
      └─ prototipo ── site
```

## `main`

O ponto de partida: o README animado, esta documentação e as ferramentas que geram as imagens do README.

| Caminho | O que é |
|---|---|
| `README.md` | O hub: o que é a Heild, os branches, o time, a marca em uma tela |
| `docs/branches.md` | Este mapa |
| `docs/fluxo-de-trabalho.md` | Como rodar, publicar e mudar cada parte |
| `ferramentas/gerar_svgs_readme.py` | Gera os SVGs animados de `assets/readme/` |
| `ferramentas/wordmark.json` | Os traçados da logo (HE, LD e as medidas da pílula), os mesmos do `<heild-logo>` |
| `assets/readme/` | Os SVGs do README, claro e escuro |
| `CLAUDE.md` | As regras para agentes que trabalham neste repositório |

## `design-system`

A marca inteira, num lugar só: `design-system/`.

- `README.md`: o livro da marca (a ideia, a logo, o sistema de movimento, voz, como usar).
- `cores.md`, `tipografia.md`, `forma.md`, `gradientes.md`, `marca-e-site.md`: as seções.
- `orbs.md`: os integrantes, as cores dos orbs e as regras de estado.
- `tokens.json` e `tokens.css`: os tokens (fonte da verdade) e as variáveis CSS geradas a partir deles.
- `componentes/heild-logo/`: o Web Component `<heild-logo>`, com tipos, documentação e uma página de exemplo.
- `fontes/`: a PP Neue Montreal (quatro arquivos variáveis).
- `logos/`: o wordmark e a pílula em SVG, nas duas tintas.
- `produto/PRODUCT.md` e `produto/DESIGN.md`: o produto e o sistema de design no formato que as ferramentas de design leem.

## `prototipo`

O sistema wireframe interativo, em `app/` (Vite, React 19, TypeScript, Tailwind 4). Mostra o produto funcionando com dados de exemplo: o Início com o Assistente e o time, o Painel de cada setor, o CRM com WhatsApp, o Timesheet, o Financeiro, o BPO, os Arquivos, o app do cliente e as configurações. Os integrantes trabalham de verdade na demonstração: pensam, escrevem, passam adiante e deixam cartões para aprovar.

- `app/README.md`: como rodar, a estrutura e o que cada módulo faz.
- `app/PLANO.md`: as decisões tomadas e o que está aberto.
- `app/REVISAO.md`: a revisão de consistência.

## `site`

O site da Heild e as landing pages, em `app/src/site/` (entrada `app/site.html`). Usa os componentes e o motor do protótipo: a demonstração guiada roda a mesma loja, os mesmos fluxos e os mesmos cartões do sistema.

- Página principal (a operação inteira), Heild Contábil, Heild BPO e contato.
- `app/src/site/README.md`: as páginas, as seções, as peças animadas e como publicar.

## Origem

Tudo veio do repositório de trabalho `DGM-RAG-Contabil` (branch `claude/ui-lab`, pasta `ui-lab/`), onde o produto foi planejado. A partir daqui, a Heild evolui neste repositório.
