# Design system da Heild

O inteiro: todos os sistemas da empresa em um só lugar.

Heild é o sistema do escritório contábil e de BPO, vendido a outros escritórios, com marca branca: Painel, CRM com WhatsApp, timesheet, financeiro, BPO, arquivos e app do cliente num produto só, com um time de integrantes de IA que faz o trabalho e uma pessoa que aprova. O nome vem do islandês *heild*, que significa "o inteiro", "o todo sem partes separadas"; a raiz é o nórdico antigo *heill*, inteiro, são. Este documento é a referência para qualquer pessoa ou agente que for construir sites, apresentações ou telas da Heild.

## Tudo, num lugar só

A ideia que define a marca: juntar tudo num lugar só. Ela aparece de três formas, e toda peça nova repete pelo menos uma.

- **A logo é modular.** O I fica sozinho no centro e se transforma em cada coisa (grade, orb, barras, check), depois volta a ser um traço. HE e LD ficam juntos e conectados.
- **A interface é feita de camadas** de areia que se empilham e viram uma superfície só (seção Cores).
- **Os integrantes trabalham dentro dessa superfície.** Cada um tem o seu orb de cor; o resto da tela é neutro.

## Como usar este sistema (agentes, leiam primeiro)

1. **Logo:** use sempre o componente `<heild-logo>` (arquivo `componentes/heild-logo/heild-logo.js`). Não redesenhe a logo, não troque a fonte e não escreva "HEILD" em texto no lugar dela. Para imagem estática, use os SVGs em `logos/`.
2. **Cores, tipos, espaço, raio, sombra e gradiente:** use os tokens. Nunca escreva um hexadecimal ou uma família de fonte fora deles. As seções Cores, Tipografia, Forma e Gradientes dizem onde cada um entra.
3. **Movimento:** o I da logo é o único elemento da marca que se transforma; no produto, o orb dos integrantes é o único movimento contínuo. Siga "Sistema de movimento" e "Quando animar".
4. **Tema:** claro e escuro valem o mesmo. O produto oferece os dois, e o site e as apresentações seguem a preferência da pessoa. Os dois são desenhados com o mesmo cuidado, cada camada com o seu passo de areia em cada modo.
5. **Marca branca:** dentro do sistema, um escritório pode trocar nome, sigla, cores e fontes. Sem personalização, vale este sistema. Fora do produto (site, material de venda), é sempre Heild.

```html
<script src="componentes/heild-logo/heild-logo.js"></script>
<heild-logo style="width:140px; color:var(--primaria)"></heild-logo>          <!-- estático -->
<heild-logo animation="centralizar" loop style="width:360px"></heild-logo>     <!-- hero -->
<script>
  // quando algo termina no produto
  document.querySelector('heild-logo').play('bpo');
  // hover, foco, troca de forma: parte do desenho atual, nunca corta
  document.querySelector('heild-logo').morph('contabil');
</script>
```

## A logo

O wordmark é **HE · I · LD**. H e E dividem a mesma haste, L e D dividem a mesma base, e o I fica sozinho no centro como uma **pílula**: mais grosso que os outros traços, com as pontas totalmente redondas. A pílula é a marca. Tudo que se move na identidade sai dela e volta para ela.

- **Uma cor só.** A logo usa `primaria` sobre `fundo` (no componente, a cor do texto em volta). Nada de gradiente, sombra, contorno ou segunda cor, nem no I. As cores dos orbs são dos integrantes, nunca da logo.
- **Área de proteção:** em volta da logo, deixe livre pelo menos a largura da pílula (≈ 12% da largura da logo).
- **Tamanho mínimo:** 72px de largura em tela. Abaixo disso, use só a pílula (`logos/heild-i-*.svg`) como ícone.
- **Espaço para animar:** quando a logo anima, HE e LD se afastam até ~9% da largura para cada lado. Deixe esse espaço livre em volta, porque o componente não muda o próprio tamanho.
- **Fundo:** sempre uma área lisa de `fundo` ou `superficie`. Os olhos do orb são recortes e mostram o que está atrás.
- **Não faça:** esticar, inclinar, trocar a pílula por um I comum, colorir o I, colocar a logo sobre foto sem uma área lisa.
- **SVGs estáticos:** `logos/` tem o wordmark e a pílula nas tintas da `primaria` (`areia-900` sobre fundo claro, `areia-100` sobre fundo escuro), gerados dos traçados do componente.

## Cor, em resumo

- Todo neutro sai de uma escala só, `areia-50` a `areia-950`. Um cinza frio não pertence à Heild.
- A tela é feita de camadas: `fundo`, `lateral`, `rebaixada`, `superficie`, `elevada`. Texto em `texto` e `texto-suave`.
- `primaria` é a areia mais escura no claro e a mais clara no escuro: a marca é neutra.
- `destaque` (índigo) é a única cor de marca fora da areia, em pontos pequenos. Como texto, `destaque-texto`.
- Estados (`erro`, `sucesso`, `atencao`) vão sempre com palavra ou ícone; como texto, as versões `-texto`.
- Os orbs (`orb-fiscal`, `orb-dp`…) só no orb e nos marcadores do mesmo integrante.

O detalhe, com contraste conferido nos dois modos, está em Cores.

## Tipografia, em resumo

- Uma família só, a **PP Neue Montreal**, em dois cortes, com os arquivos em `fontes/`: a Neue Montreal (`titulo`) para títulos de 24px para cima e para o nome; a Neue Montreal Text (`texto`) para toda a interface.
- No produto, título grande é leve (300). No site, o `hero` é 500 com -0,04em.
- Ênfase em 500. Nenhum rótulo em caixa alta. A `mono` do sistema só para código e dado.

O detalhe está em Tipografia.

## Voz

- Português do Brasil, frases curtas, voz ativa. O sistema fala como um colega do escritório: "Conciliei 41 de 44 lançamentos", e não "A conciliação foi processada".
- Os integrantes falam na primeira pessoa e dizem o que fizeram e o que falta.
- O botão diz o que acontece ("Aprovar", "Ver o cartão"). O aviso diz o que mudou e onde ver.
- Termos do ofício sem explicação (PGDAS-D, DCTFWeb, fator R, lote). Nada de jargão de sistema ("job", "webhook") nem de marketing.
- Sem emoji. Ícones da família Phosphor, no peso regular.
- Nada inventado: a Heild ainda não foi lançada, então não há clientes, depoimentos, números de uso nem faixa de logos para mostrar.

## Sistema de movimento

O I é feito de cápsulas. Ele se divide numa forma, as letras abrem espaço, e tudo volta ao repouso.

1. **Material:** só cápsulas e círculos com pontas 100% redondas. As peças têm 96 de espessura (unidades do viewBox da logo, a pílula tem 147). A exceção é o orb, que é o I inteiro virando esfera.
2. **Limite:** a forma nunca passa da altura das letras. Ela só cresce para os lados.
3. **Espaço:** HE e LD se afastam na medida exata da largura da forma e voltam quando o I se fecha.
4. **Ritmo:** contração, divisão em cascata, pausa e retorno com um leve assentamento. Uma forma por tema.

Tempos exatos (o componente já aplica):

| Fase | Duração | Detalhe |
|---|---|---|
| Contração | 160ms | a pílula engorda 7% e encolhe 5% |
| Divisão | 1000ms | cápsulas saem com 55ms de cascata, easing back-out 1.25; as letras começam aos 90ms e levam 720ms (ease-in-out cúbico) |
| Fusão | — | durante a divisão e o retorno, as cápsulas se fundem como líquido (blur de até 11 + limiar de alfa) |
| Pausa | 1600–3700ms | depende do tema |
| Retorno | 900ms | cascata invertida de 40ms, back-out 1.1; as letras voltam com back-out 0.9 (um pequeno assentamento) |
| Repouso entre loops | 1300ms | só com `loop` |

### As formas

| `animation` | Forma | Quando usar |
|---|---|---|
| `centralizar` | grade de 9 pontos que volta a ser uma peça só | animação principal da marca: hero do site, abertura, splash |
| `orb` | o I vira uma esfera com olhos recortados, olha para dois lados e volta | presença do assistente; onboarding; telas de IA |
| `contabil` | três barras crescentes na linha de base | módulo contábil, relatórios, fechamento concluído |
| `juridico` | o I tomba e vira um sinal de igual | jurídico e conformidade (fora do lançamento; a forma fica pronta) |
| `bpo` | duas cápsulas formam um check | rotina entregue, tarefa concluída |
| `ia` | três cópias do I em leque que giram 60° | o agente começou a trabalhar |
| `atendimento` | três pontos pulando em onda | chat, alguém digitando, carregamento |
| `financeiro` | um $: S em zigue-zague com a haste sobrando em cima e embaixo | financeiro, cobrança, pagamentos |
| `tempo` | ampulheta que vira 180° e cabe na própria caixa | timesheet, prazos, horas |
| `arquivos` | pasta em contorno, com aba | arquivos, documentos |
| `conversa` | balão de fala com rabicho | CRM, conversa com o cliente |
| `celular` | o aparelho, com um ponto como botão | app do cliente |
| `painel` | grade bento: coluna alta, barras e pontos | painel, dashboard, widgets |
| `lupa` | lente octogonal com cabo a 45°, que varre | consultor, análise, busca |
| `equipe` | três pessoas, a do meio mais alta, em onda de aceno | integrantes, o time |
| `orbs` | o I vira o orb, que se divide como uma célula em três orbs com olhos e olhar próprio; na volta se fundem | integrantes, o time de IA |
| `cycle` | passa pelas formas originais, em ordem | vitrines e apresentações da marca |

### O orb na logo

O orb é desenhado com a mesma matemática do componente `<orb-avatar>` (github.com/sundenlast/orb), o mesmo dos integrantes no produto: os olhos `capEye` do idle projetados na esfera (face-scale 1.6), a mola do olhar (K 95, amortecimento 11), a piscada de 0,15s e o corpo de gelatina (jelly 0.6) que balança ao chegar. Na logo ele tem duas diferenças: os olhos são **recortes** (mostram o fundo, não são pintados) e não há partículas. A sequência é: chega balançando, olha forte para a esquerda, pisca, olha para a direita e para baixo, volta ao repouso, fecha os olhos e vira o I.

### Quando animar

- **Uma vez, com propósito:** a logo anima ao aparecer (hero, splash) ou como resposta a algo que aconteceu (`play('bpo')` quando uma tarefa termina).
- **Em loop**, só em hero, tela de espera ou vitrine.
- **Nunca** no cabeçalho fixo de uma página enquanto a pessoa lê, nem duas logos animando ao mesmo tempo na mesma tela.
- Com `prefers-reduced-motion`, o componente fica estático sozinho. Não force a animação.

## Componentes

- **HeildLogo** (`<heild-logo>`): o wordmark com o I animado, com `play()` para tocar uma forma e `morph()` para seguir um estado (hover, foco) sem cortes. Veja `componentes/heild-logo/README.md`.

Não há kit de interface aqui. O produto usa os componentes do próprio código (branch `prototipo`, pasta `app/`); este sistema dá a base de marca.

## Assets

- `logos/`: wordmark e pílula em SVG, nas duas tintas.
- `fontes/`: os quatro arquivos variáveis da PP Neue Montreal (romano e itálico, Neue Montreal e Neue Montreal Text). Licença de uso web confirmada.

## Seções

- **Orbs** (`orbs.md`): os integrantes, as cores, os estados e onde o orb aparece.
- **Cores:** camadas, areia, destaque, estados, orbs e contraste conferido.
- **Forma:** raios, sombras, espaçamento e movimento do produto.
- **Gradientes:** os três gradientes de camada, a máscara de esmaecer e a hachura de estimado.
- **Marca e site:** hero, grade de pontos, desenho das camadas, navegação e o que a primeira tela precisa ter.
- **Tipografia:** as fontes, a escala e as regras.

## Arquivos

| Caminho | O que é |
|---|---|
| `tokens.json` | Os tokens: a fonte da verdade (cores com claro e escuro, tipos, espaço, raio, sombra, gradiente) |
| `tokens.css` | As variáveis CSS geradas do `tokens.json` (`ferramentas/gerar_tokens_css.py`); não edite à mão |
| `componentes/heild-logo/` | O `<heild-logo>`, os tipos, a documentação e `exemplo.html` |
| `fontes/` | PP Neue Montreal e PP Neue Montreal Text, variáveis, romano e itálico |
| `logos/` | Wordmark e pílula em SVG (`ferramentas/gerar_logos.py`) |
| `produto/PRODUCT.md`, `produto/DESIGN.md` | O produto e o sistema de design no formato que as ferramentas de design leem |

Para usar numa página: carregue `tokens.css` e o componente, e use as variáveis.

```html
<link rel="stylesheet" href="tokens.css">
<script src="componentes/heild-logo/heild-logo.js"></script>
<body style="background: var(--fundo); color: var(--texto); font-family: var(--font-texto)">
  <heild-logo style="width:140px; color: var(--primaria)"></heild-logo>
</body>
```

Mudou um token? Edite `tokens.json` e rode `python3 design-system/ferramentas/gerar_tokens_css.py`. O app (branch `prototipo`) tem o tema em `app/src/theme/`; leve a mudança para lá também.
