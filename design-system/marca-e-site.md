# Marca e site

O site e as apresentações são onde a Heild fala para fora. Usam os mesmos tokens do produto com duas diferenças: o título do hero é mais pesado e o fundo ganha a grade de pontos.

## O hero

A primeira tela tem uma ideia só: tudo num lugar só.

- **O que entra:** o título, uma frase e uma ação, visíveis em 1280 × 800 sem rolar. Mais nada de texto: cerca de 80 palavras por tela, no máximo.
- **Título:** estilo `hero` (`titulo`, 500, 72px, -0,04em), alinhado à esquerda, até três linhas, em `texto`. Quebra equilibrada. No celular, 44px.
- **Frase:** `subtitulo-hero` em `texto-suave`, uma linha no desktop.
- **Ação:** botão em pílula (`raio-pilula`), preenchido em `primaria` com `texto-sobre-primaria`, 44px de altura. Uma ação principal; a segunda, se houver, é um link em `texto`.
- **Imagem:** à direita, o desenho das camadas (abaixo) ou a logo animando `centralizar`. Nunca os dois animando juntos.
- **Entrada:** o hero entra uma vez ao carregar (título, frase e ação sobem 4px e aparecem em sequência, com desaceleração). Com movimento reduzido, aparece parado. O conteúdo já é visível antes de a animação rodar.
- **Sem:** rótulo pequeno acima do título, faixa de logos de clientes, números de uso, depoimentos, selo de prêmio. A Heild ainda não tem nada disso, e nada é inventado.

## A grade de pontos

- O fundo do hero e das seções de marca é `fundo` liso com uma grade de pontos de 1px, a cada 24px (`espaco-6`), em `grade-ponto` (`grade-pontos-claro` ou `grade-pontos-escuro`).
- A grade é chão, não figura: fica sob o desenho e as áreas vazias. Sob texto pequeno, deixe uma área lisa de `fundo`.
- No produto, o fundo continua o gradiente de areia. A grade é só do site e do material de marca.

## O desenho das camadas

A figura da marca: os sistemas do escritório como camadas empilhadas que se fundem numa só.

- **Forma:** de três a cinco planos em perspectiva isométrica, empilhados com o mesmo espaçamento, em traço de 1,5px na cor `texto`, sem preenchimento ou com `fundo` por dentro para esconder o traço de trás. Cantos com o raio da casa (`raio-cartao` em escala).
- **Movimento:** os planos descem e se juntam no de baixo, que fica um só (o inteiro). Uma vez, ao entrar na tela; com movimento reduzido, mostre o estado final.
- **Rótulos:** cada plano pode levar o nome de um módulo (Painel, CRM, Timesheet, Financeiro, BPO, App do cliente) em `rotulo`, caixa normal, numa pílula de contorno (`sombra-contorno`). O código de tarefa vai em `codigo`. Nada em caixa alta.
- **Linha de passagem:** uma linha tracejada vertical em `texto-suave` pode atravessar os planos até o de baixo, como o trabalho passando de um setor a outro.
- **Cor:** só `texto`, `texto-suave` e `fundo`. Um único elemento pode levar uma cor: o orb de um integrante sobre o plano de baixo, para dizer quem faz o trabalho.

## O produto de verdade

- Depois do hero, cada tela mostra o produto como ele é: capturas da demonstração (o chat do Assistente acompanhando um pedido, o Painel, o cartão de aprovação), recortadas e na escala certa.
- Uma seção por tela, cada uma com uma ideia: o time que faz, a pessoa que aprova, a lei com citação, um sistema no lugar de vinte.
- Nada de janela de navegador ou de sistema desenhada à mão em volta da captura, e nada de legenda sob a imagem.
- Diagramas pequenos (um pedido entrando, um integrante, três setores em paralelo) seguem o desenho das camadas: traço fino, sem cor, um orb no máximo.

## Navegação do site

- Logo estática à esquerda (`<heild-logo>` sem animação, 96 a 120px), links em `rotulo` ou `corpo` em `texto-suave` (o atual em `texto`), uma ação à direita no mesmo botão em pílula do hero.
- Barra fixa só se ela não cobrir o conteúdo: fundo `fundo` sólido com `borda` embaixo ao rolar. Sem vidro e sem desfoque de enfeite.
- A logo do cabeçalho nunca anima enquanto a pessoa lê.

## Contêiner e ritmo

- Conteúdo centralizado, até 1152px (no máximo 1280px no hero), com as duas margens iguais. Em 1920px crescem as margens, não a medida.
- Entre seções, uma tela de altura, no máximo duas. Dentro de cada uma, grupos apertados e títulos com mais espaço acima do que abaixo.
- Sem caixa espaçada de cartões iguais (ícone, título, texto) como estrutura da página, e sem cartão dentro de cartão.

## Apresentações

- Mesma base: `fundo` com a grade de pontos, `hero` para o título de cada slide, `corpo-grande` para o texto, uma ideia por slide.
- Capa: a logo animando `centralizar` ou `cycle`, sozinha no centro, sem mais nada.
- Valores e prazos em algarismos tabulares e no padrão brasileiro.

## Detalhes do navegador

A página é feita, não montada: a seleção de texto usa `destaque` a 25% com `texto`; o anel de foco é o `anel-foco`; a barra de rolagem fina usa `areia-300` no claro e `areia-800` no escuro; o sublinhado de link tem 2px de afastamento.
