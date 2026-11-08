---
name: Heild
description: Tudo, num lugar só. O sistema do escritório com um time de integrantes de IA.
colors:
  areia-50: "#fefbf9"
  areia-100: "#faf6f3"
  areia-150: "#f4efeb"
  areia-200: "#ede7e1"
  areia-300: "#d9d2cc"
  areia-400: "#bdb6b0"
  areia-500: "#9a948f"
  areia-650: "#696663"
  areia-800: "#3a3735"
  areia-850: "#2e2b28"
  areia-900: "#24211f"
  areia-925: "#1b1917"
  areia-950: "#13110f"
  indigo-destaque: "#4f5bf5"
  erro: "#c8402f"
  sucesso: "#2f9e72"
  atencao: "#b7791f"
  atencao-escuro: "#e2a845"
  orb-fiscal: "#f7a335"
  orb-dp: "#3d86f7"
  orb-contabil: "#4fc9a8"
  orb-consultor: "#6e5cf2"
  orb-societario: "#e86a8a"
  orb-notas: "#f2d04b"
  orb-atendimento: "#5bc0eb"
  orb-financeiro: "#9bc53d"
  orb-bpo: "#f08a5d"
typography:
  hero:
    fontFamily: "PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  display:
    fontFamily: "PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "PP Neue Montreal Text, PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  body-chat:
    fontFamily: "PP Neue Montreal Text, PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "PP Neue Montreal Text, PP Neue Montreal, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  sm: "8.5px"
  md: "12.75px"
  lg: "17px"
  cartao: "20px"
  campo: "24px"
  xl: "25.5px"
  painel: "34px"
  pilula: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.areia-900}"
    textColor: "{colors.areia-50}"
    rounded: "{rounded.pilula}"
    height: "36px"
    padding: "0 16px"
  button-ghost:
    textColor: "{colors.areia-850}"
    rounded: "{rounded.pilula}"
    height: "36px"
  sugestao:
    backgroundColor: "{colors.areia-100}"
    textColor: "{colors.areia-850}"
    rounded: "{rounded.pilula}"
    padding: "6px 14px"
  campo-chat:
    backgroundColor: "{colors.areia-50}"
    textColor: "{colors.areia-850}"
    rounded: "{rounded.campo}"
  cartao:
    backgroundColor: "{colors.areia-100}"
    rounded: "{rounded.cartao}"
    padding: "16px"
  painel:
    backgroundColor: "{colors.areia-100}"
    rounded: "{rounded.painel}"
---

# Design System: Heild

## Overview

**Creative North Star: "Tudo, num lugar só"**

Heild vem do nórdico *heild*, o inteiro. O sistema junta tudo o que o escritório usa num lugar só, e a marca diz isso de três formas que se repetem em todo lugar. A logo é modular: o I sozinho no centro se transforma em cada coisa (grade, orb, barras, check) e volta a ser um traço, enquanto HE e LD ficam juntos e conectados. A interface é feita de camadas de areia que se empilham e viram uma superfície só. E o time de integrantes, cada um com o seu orb de cor, trabalha dentro dessa superfície neutra.

A paleta é quase toda neutra, com uma escala só de areia quente nos dois modos. A cor fica com os integrantes e com o que pede decisão. A densidade é de ferramenta usada o dia inteiro: texto de 14px, títulos grandes e leves, muito espaço entre seções e pouco dentro dos grupos. Claro e escuro valem o mesmo, e o site segue a preferência da pessoa.

**Key Characteristics:**
- Uma escala de areia (OKLCH, matiz 63) para todos os neutros, nos dois modos.
- Camadas em vez de caixas: fundo, lateral, rebaixada, superfície e elevada, separadas por tom e sombra quente.
- Um só índigo de destaque, em pontos pequenos.
- Orbs coloridos como assinatura dos integrantes.
- PP Neue Montreal: títulos grandes e leves no produto, hero em 500 no site.
- A logo é o único elemento que se transforma; no produto, os orbs são o único movimento contínuo.

## Colors

Areia quente em camadas, um índigo raro e as cores dos integrantes.

### Primary
- **Índigo Destaque** (#4f5bf5): a única cor de marca fora da areia. Barra de limite de IA, ponto de novidade, marcador de seleção, progresso de etapa. Como texto, use a variante de texto (#4a56e6 no claro, #9098f9 no escuro), que passa 4,5:1.

### Neutral
- **Areia Papel** (areia-50, #fefbf9): fundo do claro (topo do gradiente) e camada elevada.
- **Areia Folha** (areia-100, #faf6f3): superfície do claro (painéis, cartões); texto e primária do escuro.
- **Areia Mesa** (areia-200, #ede7e1): camada rebaixada do claro (trilhos, faixas, citações).
- **Areia Duna** (areia-300, #d9d2cc): fim dos gradientes e borda do claro. Uma das duas cores do Figma.
- **Areia Seixo** (areia-400, #bdb6b0): fim da lateral do claro; texto suave do escuro.
- **Areia Grafite** (areia-650, #696663): texto suave do claro. A outra cor do Figma.
- **Areia Carvão** (areia-850, #2e2b28): texto do claro; superfície do escuro; tinta das sombras do claro.
- **Areia Noite** (areia-900, #24211f): primária do claro; fundo do escuro.
- **Areia Fundo** (areia-950, #13110f): fim dos gradientes do escuro.

### Estados
- **Erro** (#c8402f), **Sucesso** (#2f9e72), **Atenção** (#b7791f no claro, #e2a845 no escuro): sempre com palavra ou ícone. Como texto, use as variantes de texto do design system, que passam 4,5:1.

### Integrantes
- Fiscal (#f7a335), DP (#3d86f7), Contábil (#4fc9a8), Consultor (#6e5cf2), Societário (#e86a8a), Notas (#f2d04b), Atendimento (#5bc0eb), Financeiro (#9bc53d), BPO (#f08a5d). O Assistente usa o contraste do tema (areia-850 no claro, areia-100 no escuro).

### Named Rules
**The Sand Only Rule.** Todo neutro sai da escala de areia. Um cinza frio (#e5e5e5, #71717a) não pertence à Heild.

**The One Indigo Rule.** O índigo ocupa pontos pequenos: barra, ponto, link. Nunca fundo de área, nunca gradiente, nunca junto de uma cor de orb para formar paleta.

**The Orb Color Rule.** A cor de um integrante aparece no orb dele e nos marcadores pequenos do mesmo integrante. Nunca em texto, fundo de interface ou logo.

## Typography

**Display Font:** PP Neue Montreal (com ui-sans-serif, system-ui)
**Body Font:** PP Neue Montreal Text (com PP Neue Montreal, ui-sans-serif)
**Code Font:** a monoespaçada do sistema (ui-monospace, SF Mono, Menlo), só para códigos e dados.

**Character:** uma família só em dois cortes. A Neue Montreal fala grande e leve; a Text, desenhada para tamanhos pequenos, carrega a interface.

### Hierarchy
- **Hero** (500, 72px, 1,05, -0,04em): título do site e da capa de apresentação. 44px no celular. Até três linhas, alinhado à esquerda.
- **Display** (300, 48px, 1,0, -0,025em): uma frase por tela no produto ("No que posso ajudar?").
- **Headline** (300, 30px, 1,2, -0,025em): título da tela. 24px no celular.
- **Title** (600, 18px, 1,55): nome no cabeçalho do chat, título de cartão grande.
- **Body** (400, 14px, 1,43): o texto da interface. Mensagem de chat em 1,625. Linha de leitura até cerca de 70 caracteres.
- **Label** (400 ou 500, 12px, 1,33): metadado, legenda, chip, contador. Caixa normal, sem espaçamento extra.
- **Code** (400, 12px): código de tarefa (FIN-201), chave, versão.

### Named Rules
**The Light Headline Rule.** No produto, título de 24px para cima é 300 com -0,025em. O 500 apertado é só do hero do site.

**The No Caps Rule.** Nenhum rótulo em caixa alta ou versalete, nem com espaçamento. Rótulo é a fonte do texto, um passo menor, em caixa normal.

**The Two Inks Rule.** Texto tem duas cores: texto e texto suave. Hierarquia vem de tamanho e peso, nunca de opacidade solta.

## Layout

Todas as telas de conteúdo dividem o mesmo contêiner: até 1152px, centralizado (1600px em ultrawide), com o mesmo topo; trocar de aba não move o conteúdo. O chat fica numa coluna de 768px (896px em tela muito larga). Margem lateral mínima de 16px. Grupos apertados (8 a 12px), seções separadas (24 a 32px). Acima de 2400 × 1300 a base sobe 12,5% e toda a escala em rem cresce junto. No site, a primeira tela mostra título, uma frase e a ação em 1280 × 800, com cerca de 80 palavras por tela.

## Elevation & Depth

Profundidade por camada e por sombra quente, juntas. Cada camada de areia sobe um passo; o que fica por cima ganha uma sombra de duas partes, uma difusa e um contorno de 1px que substitui a borda. A sombra usa a areia escura no claro (fica quente, nunca cinza) e preto no escuro, onde quase não aparece: lá a separação vem da camada mais clara. Três camadas carregam um gradiente vertical leve, do passo claro para o escuro: o fundo da página, a barra lateral e a coluna rebaixada. O que fica por cima é chapado.

### Shadow Vocabulary
- **Contorno** (`box-shadow: 0 0 0 1px rgba(46,43,40,0.07)`): pílulas, chips, botões soltos.
- **Cartão** (`0 1px 2px rgba(46,43,40,0.06), 0 0 0 1px rgba(46,43,40,0.06)`): cartões e widgets.
- **Painel** (`0 1px 3px rgba(46,43,40,0.08), 0 0 0 1px rgba(46,43,40,0.07)`): o painel grande da tela.
- **Campo** (`0 2px 10px rgba(46,43,40,0.10), 0 0 0 1px rgba(46,43,40,0.05)`): campo do chat.
- **Flutuante** (`0 4px 12px rgba(46,43,40,0.12)` e `0 10px 30px rgba(46,43,40,0.16)`): menu e popover; gaveta e diálogo.

### Named Rules
**The Flat Top Rule.** Gradiente só em fundo, lateral e coluna rebaixada, sempre vertical e dentro da mesma camada. Cartão, campo, menu e texto são chapados.

**The Warm Shadow Rule.** Toda sombra usa a tinta do modo. Sombra cinza, colorida ou em bloco sem desfoque não é da Heild.

## Shapes

Tudo arredondado, a partir de um raio base de 17px: peças maiores, raios maiores (cartão 20px, campo 24px, painel 34px), e o que fica dentro tem raio menor que o de fora. Ações e sugestões são pílulas, que ecoam o I da logo; campos e cartões são retângulos arredondados. Nenhum canto vivo fora de tabela e gráfico, que ficam dentro de cartão.

## Components

### Buttons
- **Shape:** pílula na maior parte da interface; o botão base do kit tem 12,75px e 36px de altura.
- **Primary:** fundo na primária (areia-900 no claro, areia-100 no escuro), texto no contraste da primária, 0 16px.
- **Hover / Focus:** a primária a 90% no hover; anel de foco de 2px, afastado 2px, em areia média, só por teclado.
- **Ghost / Outline:** texto em texto, sem fundo ou com contorno; fundo rebaixado no hover.

### Chips (sugestões)
- **Style:** pílula em superfície, com a sombra de contorno, texto de 12px. Fundo elevado no hover.

### Cards / Containers
- **Corner Style:** 20px no cartão, 34px no painel da tela.
- **Background:** superfície; um cartão dentro de painel sobe para elevada.
- **Shadow Strategy:** cartão ou painel (Elevation & Depth).
- **Internal Padding:** 16px no cartão, 20 a 24px no painel.

### Inputs / Fields
- **Style:** o campo do chat em elevada, raio 24px, sombra de campo; ações redondas na margem.
- **Focus:** anel de foco do tema.

### Navigation
- **Style:** barra lateral em gradiente de areia com ícones soltos de 26px; o ativo preenchido. Abas em pílula segmentada sobre um trilho afundado, o marcador ativo com a sombra de pílula.

### Orb do integrante
- **Character:** o avatar vivo do integrante: uma esfera de cor com olhos, que segue o cursor, pisca, pensa e muda de estado (disponível, trabalhando, precisa de você, dormindo). Leva uma sombra própria para não sumir no fundo claro. É o único elemento sempre animado do produto.

### Logo (`<heild-logo>`)
- **Character:** o wordmark HE · I · LD em uma cor só, a primária. O I em pílula se transforma (centralizar, orb, contábil, BPO, IA, atendimento) e volta ao repouso. Regras completas no design system Heild.

## Do's and Don'ts

### Do:
- **Do** tirar todo neutro da escala de areia e empilhar as camadas na ordem: fundo, superfície, elevada.
- **Do** usar a logo em uma cor só, na primária, com a área de proteção da largura da pílula.
- **Do** mostrar estado com palavra ou ícone, além da cor.
- **Do** usar algarismos tabulares em valores, horas e porcentagens, e o padrão brasileiro (R$ 13.940,00; 18/11).
- **Do** dar tema aos detalhes do navegador: seleção de texto, cursor, barra de rolagem e anel de foco saem da paleta.

### Don't:
- **Don't** usar rótulo em caixa alta ou versalete, nem um rótulo pequeno acima do título.
- **Don't** usar gradiente de cor, gradiente em texto ou o índigo em área grande.
- **Don't** usar a cor de um orb em texto, fundo ou logo.
- **Don't** colocar cartão dentro de cartão nem borda colorida grossa na lateral de cartão.
- **Don't** inventar número, depoimento, cliente ou faixa de logos: a Heild ainda não foi lançada.
- **Don't** usar a mono para parecer técnico; ela é só para código e dado.
- **Don't** animar a logo no cabeçalho fixo enquanto a pessoa lê, nem duas logos animando na mesma tela.
