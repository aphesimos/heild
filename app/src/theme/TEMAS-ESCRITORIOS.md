# Temas dos escritórios parceiros: Condesp e Requinte

Dois temas de marca branca com a marca real de dois escritórios parceiros e
investidores do projeto, para eles verem o protótipo com a própria marca. Cada
um é um objeto `Tema` com modo claro e escuro, como os temas de exemplo.

| Opção no seletor | Arquivo | Logos |
| --- | --- | --- |
| Condesp | `temas/condesp.ts` | `src/assets/marcas/condesp/` |
| Requinte | `temas/requinte.ts` | `src/assets/marcas/requinte/` |

Os dois entram no seletor de tema que já existe (aba Demonstração → Tema), como
mais duas opções depois do tema de fábrica e dos exemplos fictícios. O claro e o
escuro vêm do botão de modo, como nos outros temas.

## Uso restrito: só no wireframe

> **Marcas de terceiros, usadas com a permissão deles numa demonstração interna.**
> Estes temas existem só no wireframe (o app do protótipo, `npm run app`). **Não
> entram no site nem no GitHub Pages** (branch `site`/`gh-pages`, que é só a landing
> page da Heild). Antes de levar o wireframe para o `prototipo` ou o `site`, tire
> `src/theme/temas/condesp.ts`, `src/theme/temas/requinte.ts`, a linha deles em
> `temas.ts`, `src/assets/marcas/` e `src/assets/fontes/parceiros*`. O `vite build`
> do app copia as logos para `dist/` assim que os temas estão registrados.

O tema de fábrica e os outros temas não mudaram.

## De onde veio cada coisa

Tudo baixado com `curl` em 14/11/2026. Os dois sites abriram (HTTP 200). Duas
imagens da Condesp (`nova-marca-condesp-2021-1776x1452.jpg` e
`alteracao-logo-almozara-maio-2021-v2-676x172.png`) falharam na primeira tentativa
com `curl: (35) Recv failure: Connection reset by peer` e vieram na segunda.

### Condesp Contabilidade

Site em Mobirise (Bootstrap). A página da marca
(https://condespcontabilidade.com.br/sobre.html#Sobre, seção "Significado da Marca
Condesp") explica o conceito (um razonete: débito à esquerda, crédito à direita, a
esfera dourada da "atenção") na imagem `assets/images/nova-marca-condesp-2021-1776x1452.jpg`,
mas não traz códigos de cor nem tipografia. As cores saíram do CSS e dos pixels da logo.

| Cor | Hex | Origem |
| --- | --- | --- |
| Azul-marinho (marca) | `#00304f` | Pixels do "CONDESP" em `assets/images/logo-consultiva-557x153.png`. No CSS, `.bg-success`/`.btn-success` = `#0a314f` (`assets/mobirise/css/mbr-additional.css`) |
| Azul | `#0090ff` | `.btn-primary`, `.bg-primary`, `.text-primary` e o `.btn` padrão (mbr-additional.css); também o brilho do degradê azul da logo e do favicon |
| Azul info | `#1073bf` | `.btn-info`, `.bg-info` (mbr-additional.css) |
| Laranja | `#ff6c00` | `.btn-secondary`, `.bg-warning`, `.text-secondary` (mbr-additional.css) e `style="color: #ff6c00"` em sobre.html. Na logo ("contabilidade consultiva"), `#ff6a13` |
| Dourado | `#f6c519` | A esfera da logo (pixels de logo-consultiva-557x153.png) |
| Cinza | `#838383` | `.bg-danger`/`.text-danger`: o "perigo" do site é cinza, não serve como erro |

Fontes (Google Fonts nas duas páginas): **Poppins** (`.display-1`, `.display-2`,
`.display-4`, `.display-5`: títulos) e **Roboto** (`.display-7`: texto). Ambas
gratuitas (SIL OFL 1.1); foram copiadas para `src/assets/fontes/parceiros/`
(subconjuntos latin e latin-ext) e declaradas em `src/assets/fontes/parceiros.css`.

Raio: `.btn { border-radius: 3px }`, `.btn-form { border-radius: 0 }`, e 10 px em
caixas (mbr-additional.css).

Logos (só PNG; o site não publica SVG):

| Arquivo no app | Origem | Uso |
| --- | --- | --- |
| `logo-completa.png` (557×153) | `assets/images/logo-consultiva-557x153.png` | barra aberta e login, claro |
| `logo-completa-branca.png` (465×128) | `assets/images/logo-consultiva-white-465x128.png` | barra aberta e login, escuro |
| `logotipo.png` (128×106) | `assets/images/logo-favicon-128x106.png` (o favicon) | barra fechada, claro |
| `logotipo-branco.png` (132×107) | recorte do símbolo de logo-consultiva-white-465x128.png | barra fechada, escuro |

### Requinte Contábil

Site em WordPress com Elementor (https://requintecontabil.com.br/). Não há página
de marca; as cores são as **cores globais do Elementor** do site, em
`wp-content/uploads/elementor/css/post-6.css` (`.elementor-kit-6`). As globais
padrão do Elementor (`primary #6EC1E4`, `secondary #54595F`, `text #7A7A7A`,
`accent #61CE70`) não são usadas nas páginas e foram ignoradas. A página não tem
`<meta name="theme-color">`; o `#007cba` que aparece no HTML é a cor do painel do
WordPress (`--wp-admin-theme-color`), não da marca.

| Cor | Hex | Global do Elementor | Onde o site usa |
| --- | --- | --- | --- |
| Azul (marca) | `#1e99d6` | `--e-global-color-73b415f` | botões (`.elementor-button`), ícones, borda no hover dos cartões, busca (post-13.css, post-30.css, post-56.css) |
| Azul da logo | `#0098d6` | (no SVG) | `fill` de `wp-content/uploads/2025/11/logo-azul.svg` e `favicon-1.svg` |
| Cinza-azulado | `#394e57` | `--e-global-color-5c351a5` | títulos e texto corrido (post-13.css, post-56.css, post-76.css) |
| Cinza claro | `#f4f4f4` | `--e-global-color-02f7c20` | fundo de seções e texto sobre o azul |
| Azul-aço | `#3e7996` | `--e-global-color-cb2ca7a` | — (declarada no kit) |
| Azul-claro | `#57c1eb` | `--e-global-color-07edbe5` | — |
| Laranja | `#d6841f` | `--e-global-color-bf0935e` | hover do fechar da busca (post-56.css) |
| Laranja-claro | `#df9d36` | `--e-global-color-d09be2e` | — |
| Verde | `#349321` | `--e-global-color-4911482` | — |
| Vermelho | `#ad1e05` | `--e-global-color-fbc0a0c` | — |
| Cinza-claro azulado | `#9eaaaf` | (post-*.css) | detalhes |

Fonte: **Source Sans 3** em tudo (`--e-global-typography-*-font-family`, títulos
`h1`–`h6` e corpo em post-6.css; Google Fonts). Gratuita (SIL OFL 1.1), copiada
para `src/assets/fontes/parceiros/`.

Raio: botões 16 px (`.elementor-kit-6 .elementor-button`), ícones 18 px, cartões
20 px e um bloco de 30 px (post-13.css).

Logos (SVG, só caminhos, sem script):

| Arquivo no app | Origem | Uso |
| --- | --- | --- |
| `logo-completa.svg` | `wp-content/uploads/2025/11/logo-azul.svg` | barra aberta e login, claro |
| `logo-completa-branca.svg` | `wp-content/uploads/2025/11/logo-branco.svg` | barra aberta e login, escuro |
| `logotipo-branco.svg` | `wp-content/uploads/2025/11/icone-branco.svg` | barra fechada, escuro |
| `logotipo.svg` | o mesmo `icone-branco.svg` com o `fill` trocado de branco para `#0098d6`, o azul da logo | barra fechada, claro |

## Decisões

- **Logo no modo escuro.** O "CONDESP" da logo é azul-marinho e sumiria no fundo
  escuro. O `Tema` ganhou dois campos opcionais, `logotipo_ref_escuro` e
  `logo_completa_ref_escuro` (`tipos.ts`), e a marca da barra e do login usa a versão
  em negativo no escuro (`logosDoModo` em `components/compostos/marca.tsx`). Os dois
  escritórios publicam a versão branca; os outros temas não mudam.
- **Neutros no matiz da marca**, como a `areia` do tema de fábrica: uma escala de
  50 a 950 por escritório, gerada em OKLCH com as mesmas luminosidades e croma baixo.
  - Condesp, `nevoaCondesp`: matiz 244 (o azul-marinho da logo); croma 0,016 nos
    claros e médios e 0,03 nos escuros, para o modo escuro puxar para o marinho.
  - Requinte, `ardosiaRequinte`: matiz 226 (o cinza-azulado do texto do site);
    croma mais baixo nos claros (o site usa fundos quase cinza) e o passo 700 é
    exatamente o `#394e57` do site, que vira o texto suave do claro.
  - As camadas usam os mesmos passos nos dois temas (tabela no comentário de cada
    arquivo). Diferenças para a areia: o fundo vai do 50 ao 200 (e não ao 300) e o
    texto suave é o 700 (e não o 650), para o texto suave passar de 4,5:1 até no fim
    do degradê da barra lateral; a camada elevada é branca no claro.
- **Primária.** Condesp: o azul-marinho da marca no claro (branco por cima, 13,7:1)
  e o azul exato do botão do site, `#0090ff`, no escuro, com texto escuro (o branco
  daria 3,3:1). Requinte: no claro, o azul do site escurecido no mesmo matiz,
  `#0a74a4` (o `#1e99d6` com branco por cima dá 3,2:1, abaixo do AA); no escuro, o
  `#1e99d6` exato com texto escuro.
- **Destaque, atenção, erro e sucesso** partem das cores do site e mudam só a
  luminosidade (matiz e croma mantidos) até passar de 4,5:1 em todas as camadas de
  conteúdo e no selo de 15% sobre a camada elevada. No escuro ficam claras o
  bastante para o texto sobre elas ser escuro (o `textoSobre` só escolhe o escuro
  acima de luminância 0,45).

  | Token | Condesp claro | Condesp escuro | Requinte claro | Requinte escuro |
  | --- | --- | --- | --- | --- |
  | destaque | `#0867ad` (de `#1073bf`) | `#89c0fe` (de `#0090ff`) | `#326d8a` (de `#3e7996`) | `#60c9f3` (de `#57c1eb`) |
  | atenção | `#ab4703` (de `#ff6c00`) | `#ffa67d` (de `#ff6c00`) | `#935706` (de `#d6841f`) | `#f0ad49` (de `#df9d36`) |
  | erro | `#ba3222` (de `#c8402f`, o erro da fábrica: o site não tem vermelho) | `#ffa494` | `#ad1e05` (exato) | `#fea392` (de `#ad1e05`) |
  | sucesso | `#077450` (de `#2f9e72`, o sucesso da fábrica: o "success" do site é o marinho) | `#67d0a1` | `#1f7608` (de `#349321`) | `#74d264` (de `#349321`) |

  O laranja da marca ficou na **atenção** e o azul no **destaque**, como pede o
  README (atenção separada do destaque da marca).
- **Fontes.** Condesp: Poppins nos títulos, Roboto no texto, como no site. Requinte:
  Source Sans 3 nos dois. As letras das logos estão desenhadas na imagem, então não
  dependem de fonte.
- **Raio.** Condesp `0.5rem`: o site usa 3 px nos botões e 10 px nas caixas, e a
  logo é toda curva; 8 px fica entre os dois. Requinte `1rem`: botões de 16 px,
  ícones de 18 px e cartões de 20 px no site.
- **Nome.** `nome_produto` é "Condesp" e "Requinte", os nomes das opções no seletor.
  Sigla "C" e "R" (só aparece se a logo não carregar).
- **Integrantes.** A paleta padrão com os setores que brigavam com a marca puxados
  para ela. Condesp: Fiscal no laranja `#ff6c00`, DP no azul `#0090ff`, Notas no
  dourado da esfera `#f6c519`, Consultor no marinho `#00304f` de olhos brancos (no
  escuro, `#9ccaf5` de olhos marinho), Atendimento em violeta `#8b7cf6` (o azul-céu
  padrão ficava colado no DP), Contábil num verde-água mais fechado `#2fae8f`,
  Conciliação `#5b8def`. Requinte: Fiscal `#df9d36` e DP `#1e99d6` do site,
  Consultor no cinza-azulado `#394e57` de olhos brancos (no escuro, `#9eaaaf`),
  Atendimento em violeta `#8b7cf6`. O orb do Assistente continua o contraste do tema.

## Contraste (WCAG AA)

Medido nas variáveis CSS que o `ThemeProvider` aplicou de fato no navegador, com
`scripts/temas-escritorios.cjs` (que também tira as capturas). Critérios: texto
normal 4,5:1; componentes e ícones 3:1. Cada número é o **pior caso** entre as
camadas: texto e texto suave contra fundo, fim do fundo, superfície, elevada,
rebaixada (início e fim) e barra lateral (início e fim); destaque, atenção, erro e
sucesso contra as camadas de conteúdo e contra o próprio selo a 15% sobre a
elevada (a barra lateral só tem texto e texto suave).

| Medida | Condesp claro | Condesp escuro | Requinte claro | Requinte escuro |
| --- | --- | --- | --- | --- |
| texto | 10,85 | 11,00 | 10,81 | 11,02 |
| texto suave | 5,06 | 5,97 | 5,94 | 5,99 |
| destaque | 4,73 | 4,60 | 4,60 | 4,62 |
| atenção | 4,61 | 4,70 | 4,71 | 4,61 |
| erro | 4,65 | 4,67 | 5,45 | 4,60 |
| sucesso | 4,66 | 4,62 | 4,61 | 4,65 |
| texto na primária | 13,67 | 5,75 | 5,19 | 5,89 |
| texto no erro | 5,89 | 10,28 | 7,08 | 10,17 |
| texto no sucesso | 5,80 | 10,40 | 5,75 | 10,43 |
| primária x fundo (3:1) | 12,64 | 3,64 | 4,81 | 3,73 |
| ícone suave x barra lateral (3:1) | 5,06 | 7,07 | 5,94 | 7,02 |
| **mínimo de texto** | **4,61** | **4,60** | **4,60** | **4,60** |

Para repetir: `npm run app` e, noutro terminal,
`node scripts/temas-escritorios.cjs <pasta> http://localhost:5173/` (precisa do
Playwright; sai com código 1 se alguma medida cair abaixo do mínimo).

## Limitações

- **Logo da Condesp só em PNG.** O site não publica vetor. Na barra (36 px de
  altura) a logo completa fica com cerca de 131 px de largura e o "contabilidade
  consultiva" vira letra de 6 px, ilegível; o "CONDESP" e o símbolo se leem bem. O
  símbolo branco do escuro é um recorte da logo branca (132×107). Para um uso além
  da demonstração, pedir à Condesp o SVG ou um PNG grande.
- **Símbolo azul da Requinte derivado.** O site publica o símbolo solto só em branco
  (`icone-branco.svg`); o azul é o mesmo desenho com o `fill` da logo (`#0098d6`).
- **Cores ajustadas.** Para passar no AA, o azul primário da Requinte no claro e as
  cores de estado foram escurecidas (claro) ou clareadas (escuro) no mesmo matiz;
  não são as cores exatas do site. As exatas estão nas tabelas acima.
- **A página da marca da Condesp não traz códigos de cor nem fonte;** as cores vêm
  do CSS do site e dos pixels da logo (amostrados em blocos, com margem de alguns
  pontos por causa da compressão).
- **Raio de borda parcial.** Muitos componentes do protótipo usam raio fixo
  (`rounded-[26px]`, `rounded-[14px]`), então o `raio_borda` do tema só muda parte
  dos cantos.
- **Botão desabilitado no escuro.** O botão primário desabilitado (opacidade 50%)
  fica com pouco contraste no escuro, como nos outros temas; estado desabilitado não
  entra no critério do WCAG.
- **Bordas** (`borda`) não passam de 3:1, como no tema de fábrica; são separadores,
  não o único sinal de um controle.
- **Orbs dos integrantes** são decorativos (o nome vai sempre ao lado) e não entram
  na medição.
