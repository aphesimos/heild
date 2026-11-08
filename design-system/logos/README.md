# Logos

Versões estáticas da marca, para quando o componente `<heild-logo>` não serve: e-mail, documentos, favicon, redes sociais, imagem de compartilhamento.

| Arquivo | O que é | Use sobre |
|---|---|---|
| `heild-wordmark-tinta.svg` | o wordmark HEILD em `areia-900` | fundo claro |
| `heild-wordmark-papel.svg` | o wordmark HEILD em `areia-100` | fundo escuro |
| `heild-i-tinta.svg` | só a pílula do I, em `areia-900` | ícone e favicon em fundo claro |
| `heild-i-papel.svg` | só a pílula do I, em `areia-100` | ícone e avatar em fundo escuro |

- As tintas são as da `primaria` em cada modo (`areia-900` no claro, `areia-100` no escuro).
- Gerados por `ferramentas/gerar_logos.py` a partir dos traçados do componente. Se a logo mudar, mude o componente e gere de novo; não edite os SVGs à mão.
- Na tela, prefira o componente, que usa a cor do texto em volta.
- Não recolorir, não esticar, não pôr contorno nem sombra. Abaixo de 72px de largura, use a pílula no lugar do wordmark.
- O orb estático (a logo virando esfera, com olhos recortados) ainda não foi exportado aqui; ele existe animado no componente (`animation="orb"`).
