# Gradientes

O sistema usa gradiente como luz, não como cor: um degradê vertical leve, do passo claro para o escuro da mesma camada. É o que dá profundidade à areia sem precisar de borda.

## Os três gradientes de camada

| Gradiente | Claro | Escuro | Onde |
| --- | --- | --- | --- |
| Fundo | `gradiente-fundo-claro` (areia 50 → 300) | `gradiente-fundo-escuro` (900 → 950) | Página inteira de toda tela, login, modo espera |
| Lateral | `gradiente-lateral-claro` (150 → 400) | `gradiente-lateral-escuro` (850 → 925) | Barra lateral |
| Rebaixada | `gradiente-rebaixada-claro` (200 → 300) | `gradiente-rebaixada-escuro` (925 → 950) | Coluna de integrantes do Time, colunas afundadas altas |

Regras:

- **Sempre vertical**, 180°, de cima para baixo, do claro para o escuro. Nunca horizontal, diagonal ou radial.
- **Sempre dentro de uma camada**: os dois pontos são passos da mesma escala de areia e da mesma camada (`fundo` → `fundo-fim`). Nunca misture camadas nem cores.
- **Altura cheia**: o gradiente cobre a altura do elemento que ele pinta (a janela, a barra lateral, a coluna). Em bloco baixo ele quase não aparece; use a cor chapada da camada.
- **O que fica por cima é chapado**: `superficie`, `elevada`, cartões, campos e menus nunca têm gradiente. O contraste entre o painel chapado e o fundo em degradê é o efeito.
- **Sem gradiente de cor**: `destaque`, estados e orbs nunca entram em gradiente. Nada de degradê índigo, de dois matizes ou "aurora".
- **Sem gradiente em texto.**
- O fim do gradiente do claro (`fundo-fim`, areia 300) é escuro demais para `texto-suave`: o que fica no pé da página ou da barra lateral leva `texto`.

## Máscara de esmaecer

- `mascara-esmaecer` é uma máscara (`mask-image`), não uma cor. O conteúdo que rola some em 24px sob um topo fixo ou sobre um campo fixo.
- Use na borda de toda área que rola e tem algo fixo acima ou abaixo (a conversa sob o cabeçalho, a lista sobre o campo).
- Nunca simule esse efeito com um degradê de cor por cima: a máscara funciona sobre qualquer camada e nos dois modos.

## Hachura de estimado

- `listras-estimado`: listras finas a 135°, 4px de traço e 4px de vão.
- Marca valor estimado, previsto ou ainda não confirmado em gráfico e barra: horas não confirmadas no Timesheet, previsão de caixa no Financeiro.
- A cor da listra é a da própria série, com transparência; para estouro, `erro` com transparência. O exemplo do token usa `areia-500`.
- É padrão de dado, não ornamento. Fora de gráfico, não use.
