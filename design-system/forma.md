# Forma

## Raios

O raio base do tema é 17px (`raio-lg`, 1,0625rem). Os outros saem dele ou são os raios fixos das peças grandes.

| Token | Valor | Onde |
| --- | --- | --- |
| `raio-sm` | 8,5px | Miniatura, ícone com fundo, campo pequeno |
| `raio-md` | 12,75px | Item de menu, célula de calendário |
| `raio-lg` | 17px | Botão retangular, campo, cartão de chat |
| `raio-cartao` | 20px | Cartão de conteúdo, widget |
| `raio-campo` | 24px | Campo do chat; painel no celular |
| `raio-xl` | 25,5px | Gaveta, diálogo |
| `raio-painel` | 34px | Painel grande da tela no desktop |
| `raio-pilula` | redondo | Abas segmentadas, sugestões, selos, botões redondos |

- Quanto maior a peça, maior o raio. Elemento dentro de outro tem raio menor que o de fora (cartão de 20px dentro de painel de 34px).
- Nenhum canto vivo na interface. A exceção são tabela e gráfico, que ficam dentro de um cartão arredondado.
- Botão de ação principal e sugestão são pílulas; campos e cartões, retângulos arredondados.

## Sombras

Toda sombra usa a `tinta-sombra` do modo: areia 850 no claro, para a sombra ficar quente e nunca cinza; preto no escuro. Quase todas têm duas camadas, uma difusa e um contorno de 1px que substitui a borda.

| Token | Onde |
| --- | --- |
| `sombra-contorno` | Pílula de sugestão, chip, botão solto |
| `sombra-cartao` | Cartão e widget |
| `sombra-painel` | O painel grande da tela |
| `sombra-campo` | Campo do chat e botões da margem dele |
| `sombra-pilula` | Marcador ativo das abas segmentadas |
| `sombra-md` | Popover, menu |
| `sombra-lg` | Gaveta, diálogo |
| `sombra-2xl` | Só a janela que cobre a tela |
| `sombra-trilho` | Trilho afundado das abas, barras de progresso |
| `sombra-orb` | O orb, como drop-shadow |

- A sombra acompanha a camada: `superficie` leva `sombra-cartao` ou `sombra-painel`; o que flutua leva `sombra-md` ou `sombra-lg`.
- Não escreva sombra à mão nem use sombra colorida. Uma peça tem uma sombra só.
- No escuro a sombra quase não aparece; a separação vem da camada mais clara. Não aumente a sombra para compensar.

## Espaçamento

Base de 4px.

| Token | Valor | Onde |
| --- | --- | --- |
| `espaco-1` | 4px | Ícone e rótulo colados |
| `espaco-2` | 8px | Entre chips e botões de um grupo |
| `espaco-3` | 12px | Dentro de cartão pequeno; entre orb e texto |
| `espaco-4` | 16px | Padding de cartão; gap da grade; margem lateral no celular |
| `espaco-5` | 20px | Padding de painel em tela média |
| `espaco-6` | 24px | Padding de painel; entre mensagens |
| `espaco-8` | 32px | Entre seções |

- Espaço entre irmãos vem de `gap`, não de margem.
- Todas as telas de conteúdo dividem o mesmo contêiner: até 1152px de largura (1600px em ultrawide), centralizado, com o mesmo topo. Trocar de aba não move o conteúdo.
- Margem lateral mínima de 16px em qualquer largura.

## Movimento

- No produto, o orb é o único elemento sempre animado. O resto só se move quando algo acontece.
- Na marca, quem anima é a logo, pelas regras do Sistema de movimento (README).
- Entrada de cartão: sobe 4px e aparece em 0,3s, com desaceleração (`ease-out`).
- Texto de integrante aparece sendo escrito, cerca de 55 caracteres por segundo, com cursor.
- Passagem entre integrantes: um ponto anda de orb a orb em 1,6s.
- Com movimento reduzido ligado no sistema, nada disso anima; o orb fica parado.
