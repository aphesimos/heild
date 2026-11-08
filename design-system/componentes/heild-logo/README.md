# HeildLogo

O wordmark HEILD como Web Component, sem dependências, com o I que se transforma nas formas do sistema de movimento.

## Uso

```html
<script src="heild-logo.js"></script>

<!-- estático: cabeçalhos, rodapés, documentos -->
<heild-logo style="width:120px"></heild-logo>

<!-- toca uma vez quando aparece -->
<heild-logo animation="centralizar" style="width:360px"></heild-logo>

<!-- em loop: hero, splash, tela de espera -->
<heild-logo animation="orb" loop style="width:420px"></heild-logo>
```

Em resposta a algo que aconteceu:

```js
const logo = document.querySelector('heild-logo')
await logo.play('bpo') // resolve quando o I volta ao repouso
logo.stop()
```

Seguindo um estado (hover, foco, a peça sob o cursor):

```js
item.addEventListener('pointerenter', () => logo.morph('contabil'))
item.addEventListener('pointerleave', () => logo.morph(null)) // volta à pílula
// ou, por item: logo.follow('contabil', true) / logo.follow('contabil', false)
```

React:

```jsx
const { HeildLogo } = window.Heild
<HeildLogo animation="cycle" loop style={{ width: 360 }} />
```

## Atributos

| Atributo | Valores | Padrão | O que faz |
|---|---|---|---|
| `animation` | `none`, `centralizar`, `orb`, `contabil`, `juridico`, `bpo`, `ia`, `atendimento`, `financeiro`, `tempo`, `arquivos`, `conversa`, `celular`, `painel`, `lupa`, `equipe`, `cycle` | `none` | Forma em que o I se transforma. `cycle` passa por todas. |
| `loop` | booleano | ausente | Repete com 1,3 s de repouso entre as vezes. Sem ele, toca uma vez ao aparecer. |
| `label` | texto | `Heild` | Nome lido por leitores de tela. |

## Métodos

| Método | O que faz |
|---|---|
| `play(nome?)` | Toca uma forma uma vez (contração, divisão em cascata, pausa, retorno). Resolve quando o I volta ao repouso. |
| `stop()` | Para e volta ao repouso. |
| `morph(nome?)` | Vai até a forma partindo do desenho atual; sem nome, volta à pílula. Para hover e troca de forma: nunca corta, mesmo com chamadas seguidas. |
| `follow(nome, ligado)` | Atalho de `morph` para estados: ligado vai à forma; desligado volta à pílula só se `nome` for o alvo atual. |

### Como o `morph` anda

- Cada cápsula do I é uma mola com estado próprio (posição, espessura, comprimento, rotação). Uma chamada só troca o alvo; posição e velocidade seguem de onde estão.
- Na troca, as cápsulas primeiro recolhem rumo à pílula, com a contração da marca, e depois se abrem na ordem da forma nova, com um leve passar do ponto (o mesmo assentamento do retorno). A volta à pílula usa a ordem inversa.
- A fusão (o efeito líquido entre as cápsulas) acompanha a velocidade: aparece só na travessia.
- Formas com número diferente de cápsulas: as que sobram se fundem na mais próxima e nascem dela na volta.
- A rotação sempre pelo caminho mais curto; espessura e comprimento nunca negativos.
- Com o mouse chacoalhando entre itens, o I pulsa perto do centro e abre na última forma pedida quando o cursor para.

## O que quem usa precisa fornecer

- **Largura:** defina `width` no elemento (padrão 160px). A altura acompanha (proporção 1259 × 387).
- **Cor:** a logo usa a cor do texto em volta (`color`). Use `color: var(--primaria)`.
- **Espaço livre:** ao animar, as letras se afastam até cerca de 9% da largura para cada lado, e o desenho pode passar da caixa. Deixe margem e não corte com `overflow: hidden`.
- **Fundo:** os olhos do orb são recortes e mostram o que estiver atrás. Use fundo liso.

## Regras

- Uma forma por momento; não misture duas na mesma logo.
- No máximo uma logo animando por tela. A do cabeçalho nunca anima enquanto a pessoa lê.
- Com `prefers-reduced-motion: reduce`, o componente fica estático: `play()` não anima e `morph()` vai direto ao destino.

Veja todas as formas em `exemplo.html`.
