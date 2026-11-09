# Diretrizes da marca Heild

A identidade visual da Heild sozinha, como um livro de marca animado e interativo, num HTML só: a logo modular, o sistema de movimento, a areia, os orbs dos integrantes, a tipografia, a forma, a voz e as aplicações reais (produto, site, app do cliente com marca branca, README). Segue a preferência de claro ou escuro de quem assiste.

`#12` abre o slide 12.

## Atalhos

| Tecla | O que faz |
|---|---|
| → ↓ espaço PageDown Enter | Avança |
| ← ↑ PageUp Backspace | Volta |
| Home / End | Primeiro / último slide |
| número + Enter | Vai para o slide |
| O | Visão geral, por capítulo |
| T | Troca claro e escuro (em onda, como no site) |
| N | Notas do apresentador |
| R | Repete a cena do slide |
| F | Tela cheia |

No toque, arraste para os lados. Os controles somem com o mouse parado.

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py diretrizes
```

Gera `apresentacoes/dist/heild-diretrizes.html` (fora do git). As fontes e o `<heild-logo>` vêm do branch `design-system`; o `<orb-avatar>`, da cópia do protótipo; as imagens do README, de `assets/readme/`.

## Arquivos

| Caminho | O que é |
|---|---|
| `src/modelo.html` | A página, com as marcas que o build preenche |
| `src/comum.js` | Os integrantes, as 16 formas, os estados e as utilidades das cenas (orb, logo, luz, contraste) |
| `src/cenas-*.js` | As cenas, um arquivo por capítulo: cada slide tem o HTML e o que liga ao chegar |
| `src/motor.js` | O palco, a navegação, a visão geral, as notas e a troca de tema |
| `src/base.css`, `src/cenas.css` | A base (palco, tipografia, moldura) e o estilo de cada cena; os tokens ficam em `../comum/tokens.css` |

## Regras que a apresentação segue

- Tokens do design system no lugar de valores soltos; a logo é sempre o `<heild-logo>`, com no máximo uma animando por tela. Na grade das 16 formas, cada logo vai até a sua com `morph()`, uma de cada vez, e fica parada.
- A área de proteção acompanha a logo quando HE e LD se afastam (lida de `_lastL` a cada quadro).
- Cores dos integrantes só nos orbs, nos marcadores deles e na luz da abertura e do fecho; a cor de cada orb vem do token e é relida ao trocar o tema.
- Com movimento reduzido no sistema, tudo aparece no estado final.
- Nada inventado: os nomes, tempos, medidas e cores vêm do design system e dos componentes; as cenas usam os escritórios e empresas fictícios do protótipo.
