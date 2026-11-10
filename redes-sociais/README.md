# Redes sociais da Heild

O design system dos posts: a padronização que todo post do Instagram e do Facebook segue. O plano editorial (pilares, cadência, calendário, perfil) está em [`docs/planos/Plano_Redes_Sociais.md`](../docs/planos/Plano_Redes_Sociais.md), e a pesquisa que sustenta as decisões, com as fontes, em [`docs/planos/pesquisa-redes-sociais/`](../docs/planos/pesquisa-redes-sociais).

Este sistema não cria marca nova. Ele aplica o design system da Heild (branch `design-system`, `design-system/README.md`) ao quadro de um post: os mesmos tokens, as mesmas fontes, o `<heild-logo>` e o `<orb-avatar>`. Onde este documento e o design system discordarem, vale o design system.

| Caminho | O que é |
|---|---|
| `modelos/src/modelo.html` | O molde, com as marcas que o build troca (fontes, `<heild-logo>`, `<orb-avatar>`, tokens) |
| `modelos/src/posts.css` | O quadro, a grade, a escala de tipo e as peças |
| `modelos/src/pecas.js` | Os integrantes, a logo, o orb, a luz e os desenhos de slide |
| `modelos/src/posts.js` | Os posts: conteúdo, legenda, hashtags, texto alternativo e fontes |
| `render/montar.py` | Monta os modelos num HTML só, com o `apresentacoes/build.py` |
| `render/render.mjs` | Renderiza cada quadro no tamanho exato e escreve `posts/legendas.md` |
| `render/revisao.mjs` | Faz as folhas de contato e o mock da grade do perfil |
| `render/bio.txt` | O nome e a bio do perfil |
| `posts/` | As imagens finais (JPG) e `legendas.md`, por grupo e em ordem de publicação |
| `revisao/` | As folhas de contato e a grade (`grade.png`, `grade.html`) |

## Princípios

**O perfil é um inteiro.** O nome vem do islandês *heild*, o inteiro, o todo sem partes separadas. A conta segue a mesma ideia: cada post funciona sozinho, e a grade inteira se lê como uma peça só. Por isso existe uma série de regras fixas (quadro, margens, lugar da logo, alternância de tema), e por isso os carrosséis são feitos para serem lidos de ponta a ponta.

**Corpo, alma e espírito.** A filosofia da marca (apresentacoes/inteiro) vira três camadas de conteúdo, com o mesmo peso:

- **corpo:** o ofício, a lei e o produto, ou seja, o trabalho do escritório como ele é (prazos, fator R, reforma, cartão de aprovação);
- **alma:** o time, os integrantes com rosto, cor e fala própria;
- **espírito:** o nome e a filosofia, do *heill* nórdico à Tábua de Esmeralda e a Evola.

**Voz.** A do design system: português do Brasil, frases curtas, voz ativa, um colega do escritório falando. Termos do ofício sem explicar (PGDAS-D, DCTFWeb, fator R). Os integrantes falam na primeira pessoa e dizem o que fizeram. Nada de jargão de marketing, de "revolucionar", de "transformar a sua contabilidade".

**Nada inventado.** A Heild ainda não foi lançada. Não há clientes, depoimentos, números de uso, preços nem promessa de economia. O produto aparece só com os dados fictícios da demonstração (Metalúrgica Andrade, Clínica Sorriso, Padaria Pão Quente, Studio Forma, João Batista, Rita), sempre com a marca "Exemplo da demonstração, com dados fictícios". Lei só com a fonte conferida e o artigo; sem fonte primária, o post não sai (foi o que aconteceu com o post do 13º salário, trocado pelos três prazos do mês).

## Formatos

Todo quadro é desenhado em **pontos de celular** e ampliado no render até o tamanho do arquivo. Um post de feed tem 390 × 520 pt, o tamanho em que aparece no feed de um celular comum; o render aplica `zoom` 2,7692 e grava 1080 × 1440 px. Assim os tokens entram como estão (raio, sombra, espaço, a escala de tipo do celular), e o que se lê no quadro é o que se lê na tela.

| Formato | Arquivo | Em pontos | Zona segura |
|---|---|---|---|
| Feed e carrossel | 1080 × 1440 (3:4) | 390 × 520 | A grade mostra o quadro inteiro (3:4). Margem de 24 pt; o Facebook pode cortar para 4:5 (cerca de 45 px em cima e embaixo), que cabe na margem |
| Stories | 1080 × 1920 (9:16) | 390 × 693 | Texto entre 250 px do topo e 340 px da base (96 pt e 123 pt); conteúdo até 172 pt da base, a logo logo acima da faixa de 340 px |
| Capa de Reels | 1080 × 1920 | 390 × 693 | Na grade aparece o miolo 3:4 (1080 × 1440, perde 240 px em cima e embaixo). Texto entre 270 px do topo e 670 px da base, longe dos botões da direita |
| Foto do perfil | 1080 × 1080 | 390 × 390 | Recorte em círculo; o ícone ocupa 58% da altura |
| Capa de destaque | 1080 × 1920 | 390 × 693 | Recorte em círculo de cerca de 720 px no centro |
| Capa do Facebook | 1702 × 630 (o dobro de 851 × 315) | 390 × 144 | Logo e frase nos 560 × 315 do centro (o que aparece no computador e no celular) |

- Feed sempre em 3:4. O Instagram aceita 3:4 desde maio de 2025 e a grade corta tudo em 3:4 desde janeiro de 2025; com 3:4, nada some na grade. A exceção é o anúncio: o feed pago vai até 4:5. Para impulsionar um post, renderize uma versão 4:5.
- Carrossel com até 20 quadros; todos no formato do primeiro.
- Arquivo em JPG 4:4:4 (sem subamostragem de cor), qualidade 92, sRGB. A subamostragem borra o texto pequeno e a grade de pontos.

## Grade de diagramação

```
┌──────────────────────────────┐  390 pt
│ 24                        24 │  margem: espaco-6 (24 pt) nos quatro lados
│   visual (logo numa forma,   │  6 colunas, calha de 8 pt (espaco-2)
│   orb, camadas, luz)         │
│   centro a 33% da altura     │
│                              │
│   título no pé, à esquerda   │  o título carrega o próprio peso; nada em cima dele
│   frase em texto-suave       │
│                              │
│ logo 80 pt        "3 de 7"   │  o pé: a logo na capa e no fim; nos do meio, a série
└──────────────────────────────┘  520 pt          e o contador, em rotulo e texto-suave
```

- **Logo:** sempre o `<heild-logo>`. No pé, estática, com 80 pt de largura (o mínimo do design system é 72 px em tela; 80 pt num post de 390 pt dá 80 px no celular). Na capa, parada numa forma do I, com 230 a 260 pt, centrada a 33% da altura. A logo ganha margem dos lados igual ao quanto HE e LD se afastam na forma (de 7% a 18% da largura), para as letras nunca saírem do quadro.
- **Orb:** o `<orb-avatar>` parado, na cor do integrante, com a `sombra-orb`. Integrante por integrante: 170 pt, no meio da metade de cima. Ao lado de um título: 30 pt. Num cabeçalho: 48 a 64 pt, no canto de cima à direita. O orb nunca leva texto por cima.
- **Pé:** a logo (capa e último quadro) ou a série (quadros do meio) à esquerda; o contador à direita ("3 de 7"). No último quadro de carrossel, o contador vai centrado e a logo sobe para o meio.
- **Chão:** `fundo` com a grade de pontos (marca), ou o gradiente de fundo vertical, de altura cheia (produto). O que fica por cima é chapado.

## Tipografia

A escala do celular, em pontos (= pixels de tela). Só a PP Neue Montreal: a Neue Montreal (`titulo`) de 24 pt para cima; a Neue Montreal Text (`texto`) em todo o resto.

| Estilo | Família | Tamanho / entrelinha | Peso | Espaço | Onde |
|---|---|---|---|---|---|
| `t-hero` | titulo | 44 / 44 (52 / 50 nos Reels) | 500 | -0,04em | Título de capa e de post único. É o `hero` do site no celular |
| `t-titulo` | titulo | 30 / 32 | 500 | -0,04em | Título de quadro interno |
| `t-leve` | titulo | 56 / 56 (76 / 72 grande; 36 / 40 pequeno) | 300 | -0,025em | Frase de manifesto, ano, número, palavra |
| `t-cita-g` | titulo, itálico | 26 a 30 | 300 | -0,02em | Citação grande |
| `t-sub` | texto | 17 / 24 | 400 | -0,01em | A frase sob o título, em `texto-suave` |
| `t-corpo` | texto | 15 / 22 | 400 | 0 | Texto corrido |
| `t-cita` | texto, itálico | 14 a 15 / 22 a 23 | 400 | 0 | Trecho de lei, fala de integrante |
| `t-rotulo` | texto | 12 / 16 | 400 | 0 | Fonte, série, contador, metadado |

- Nada abaixo de 12 pt. Títulos com `text-wrap: balance`.
- Itálico só para citação e para palavra estrangeira ou forma antiga (*heild*, *heill*).
- Números que se comparam com algarismos tabulares; moeda e data no padrão brasileiro.
- Sem caixa alta, sem rótulo acima do título, sem emoji, sem texto em gradiente.

## Cor e tema

- **Areia é a base.** Toda superfície sai da escala de areia, pelas camadas do design system (`fundo`, `rebaixada`, `superficie`, `elevada`). Texto em `texto` e `texto-suave`.
- **Índigo em pontos.** O `destaque` só como ponto de lista, ponto de "agora" na linha do tempo e começo da linha de passagem.
- **Cores dos integrantes** só no orb, no marcador ao lado do nome do integrante e na **luz**: as manchas nas cores do time juntas numa faixa, a exceção que o site usa no hero e no fechamento. Nos posts, a luz entra em capa ou fecho de manifesto, numa citação do pilar espírito, na capa do Facebook e no story da demonstração. Nunca atrás de texto pequeno.
- **Claro e escuro valem o mesmo.** Cada quadro leva um tema inteiro (`.forca-claro` ou `.forca-escuro`, dos tokens). No feed, **o tema alterna post a post**: com três colunas, a alternância desenha um xadrez na grade, e cada linha começa no tema oposto ao da linha de cima.
  - Os fixados formam a linha de cima: escuro, claro, escuro.
  - De 01 a 21, ímpar é claro e par é escuro. Assim a primeira linha depois dos fixados começa clara (21), e o xadrez fecha nas oito linhas.
  - Um carrossel guarda o tema da capa em todos os quadros.
  - Se um post sair do lugar (apagado ou publicado fora de ordem), o xadrez quebra dali para baixo. Desde junho de 2026 o Instagram deixa reordenar a grade pelo app; use isso para consertar antes de mudar o tema de um post.

## Organização da grade

```
 F1 escuro   F2 claro    F3 escuro     ← fixados: logo numa forma no alto, título no pé
 21 Reel     20          19
 18          17          16
 15          14 Reel     13
 12          11          10
 09          08          07 Reel       ← os Reels caem numa diagonal
 06          05          04
 03          02          01
```

- **Linha dos fixados:** os três com o mesmo desenho de capa (a logo parada numa forma a 33% da altura, o título no pé), em três formas que contam a história em ordem: centralizar (tudo num lugar só), painel (um sistema no lugar de vinte), check do BPO (a pessoa aprova).
- **Séries:** cada série tem um desenho fixo, para ser reconhecida na grade antes de ser lida. O time (orbs em fila, título no pé); A lei, com fonte (logo em lupa ou ampulheta, título no pé); Do inteiro (palavra ou citação em itálico); Princípios (frase leve e grande); Como funciona (produto em superfície sobre o gradiente).
- **Reels na diagonal:** 07, 14 e 21, um por linha ímpar, cada um numa coluna. A capa tem o título grande e uma forma da logo ou uma fila de orbs.
- **Continuidades:** o F2 é um panorama de cinco quadros (a linha tracejada atravessa todas as emendas, e só ela; nenhuma pílula é cortada). O 11 tem uma linha do tempo que atravessa os quadros de 2026 a 2033. A escada de raízes (16) desce um degrau por quadro.
- **Os nove de cima são a vitrine:** fixados e a primeira linha de posts novos. Troque os fixados só quando um post novo representar melhor a marca.

## Carrosséis

Regras de todos:

- **Capa:** o título manda; ele promete o que o carrossel entrega, numa frase só. O visual fica na metade de cima. A capa é a única que aparece na grade.
- **Quadros do meio:** uma ideia por quadro. A série e o contador no pé.
- **Último quadro:** o fecho, centrado: a logo numa forma que resume o post, uma frase e o próximo passo ("Veja a demonstração no site, com o link na bio"). Sem link no quadro (não é clicável no post).
- Entre 5 e 9 quadros. Mais do que isso só no panorama.

| Desenho | Como funciona | Posts |
|---|---|---|
| Manifesto | Uma frase leve e grande por quadro, no meio. O fecho com a luz do time | F1 |
| Panorâmico contínuo | Um desenho da largura do carrossel, mostrado quadro a quadro. Só a linha atravessa as emendas | F2 |
| Passo a passo | O número leve e grande, os orbs de quem faz, o título do passo e a peça do produto (chat, cartão) | F3, 17 |
| Integrante por integrante | A capa com os orbs em fila; um quadro por integrante, com o orb grande, o nome em `t-hero`, a área com o marcador da cor dele, o que faz e uma fala dele | 03, 15 |
| Citação da lei | A referência como título, o trecho em itálico numa faixa rebaixada com a fonte, e a leitura em uma frase | 05 |
| Antes e depois, sem números | O mesmo assunto em duas faixas: antes (rebaixada) e na Heild (superfície, com o orb de quem faz). Só palavras, nenhum número de ganho | 08 |
| Vitrine da marca | A logo parada em cada forma do I, com o nome e o uso | 10 |
| Linha do tempo | O ano leve e grande sobre uma linha que atravessa os quadros; o ponto índigo marca o ano atual | 11 |
| Pergunta e resposta | O chat do produto, com a pergunta e a resposta do integrante; depois o trecho citado e o porquê da data | 13 |
| Escada de raízes | Uma palavra antiga por quadro, em itálico grande, descendo um degrau a cada quadro | 16 |

## Escrita

**Legenda**

- A primeira linha repete a ideia da capa em outras palavras e cabe nos cerca de 125 caracteres que aparecem antes do "mais".
- Depois, parágrafos curtos. Lista com uma linha por item, sem marcador decorativo.
- Fecho com o próximo passo, quando houver: "A demonstração está no site, com o link na bio." Sem pergunta forçada.
- Toda imagem de produto diz na legenda que os dados são fictícios, da demonstração. Todo post de lei traz a fonte por extenso e "post informativo; confira o caso concreto".
- Palavras de busca no texto, não em hashtag: "escritório contábil", "BPO financeiro", "fator R", "reforma tributária". O Google indexa legenda e texto alternativo desde julho de 2025.

**Hashtags**

- De 3 a 5 por post (o Instagram limita a 5 desde dezembro de 2025), no fim da legenda.
- Em CamelCase e sem acento, para o leitor de tela ler as palavras: `#EscritorioContabil`, `#BPOFinanceiro`, `#ReformaTributaria`, `#SimplesNacional`, `#FatorR`, `#DepartamentoPessoal`.
- Uma de marca quando o post é da marca: `#Heild`.

**Texto alternativo**

- Um por imagem, no campo "Escrever texto alternativo" (Instagram: Configurações avançadas; Facebook: editar a foto).
- Diz o que se vê e todo o texto da imagem, na ordem de leitura. Começa pelo fundo e pelo visual, depois o título. Sem "imagem de", sem hashtags, sem repetir a legenda.
- Orb se descreve pela cor e pelo integrante ("o orb roxo do Consultor"); a logo, pela forma do I ("a logo da Heild com o I em forma de check").

**Acessibilidade**

- Contraste dos tokens, conferido no design system: `texto` a 11:1 ou mais em todas as camadas; `texto-suave` a 4,6:1 ou mais em fundo, superfície, elevada e rebaixada. No claro, `texto-suave` não vai sobre `fundo-fim`: no gradiente de produto, o pé usa `texto`.
- Nada de informação só na cor: o integrante vai com o nome, o estado com palavra ou ícone.
- Texto mínimo de 12 pt no quadro, que dá 12 px no celular.
- O texto da imagem também está no texto alternativo; quem não vê a imagem não perde nada.

## Revisão antes de publicar

- [ ] O quadro tem o tamanho certo (1080 × 1440 no feed, 1080 × 1920 em Stories e Reels) e saiu do render, não de captura de tela.
- [ ] O tema segue o xadrez da grade (ímpar claro, par escuro) e a capa do carrossel tem o tema do resto.
- [ ] A logo é o `<heild-logo>`, estática ou numa forma, inteira, sem cor, sem contorno, com área livre em volta. Nenhuma logo escrita em texto.
- [ ] Só PP Neue Montreal. Títulos 500 com -0,04em; títulos grandes leves (300).
- [ ] Índigo só em pontos; cor de integrante só no orb, no marcador dele e na luz.
- [ ] Sem caixa alta, sem rótulo acima do título, sem emoji, sem texto em gradiente.
- [ ] Nada inventado: nenhum cliente, depoimento, número de uso, preço ou promessa. Produto com a marca "Exemplo da demonstração".
- [ ] Post de lei: o artigo, o parágrafo e a redação vigente conferidos em fonte primária, anotados em `fontes` no `posts.js` e na legenda. Sem fonte primária, o post não sai.
- [ ] Nada cortado: confira a folha de contato e a grade (`revisao/`). Nos Stories e Reels, nada na faixa de cima nem na de baixo.
- [ ] Legenda com a primeira linha forte, no máximo 5 hashtags e um texto alternativo por imagem.
- [ ] Em claro e em escuro, o texto lê bem no celular com o brilho baixo.

## Como renderizar de novo

Da raiz do repositório:

```bash
git fetch origin design-system prototipo
python3 redes-sociais/render/montar.py      # monta render/dist/posts.html (fontes e componentes embutidos)
node redes-sociais/render/render.mjs        # todos os quadros, mais posts/legendas.md (apaga as pastas antes)
node redes-sociais/render/render.mjs 05 F1  # só alguns posts
node redes-sociais/render/revisao.mjs       # folhas de contato e o mock da grade em revisao/
```

O render usa o Playwright do ambiente (`chromium.launch()` sem opções), `deviceScaleFactor` 1 e movimento reduzido: com ele, a logo para direto na forma pedida (`morph`) e os orbs ficam parados. As fontes e o `<heild-logo>` vêm do branch `design-system`, e o `<orb-avatar>` do `prototipo`, sempre na versão atual, pelo mesmo build das apresentações.

**Um post novo** é um objeto a mais em `modelos/src/posts.js`: `id`, `tipo`, `tema` (o próximo do xadrez), `serie`, `pilar`, os `slides` (cada um com um desenho de `pecas.js` e os dados dele), a `legenda`, as `hashtags`, um `alt` por quadro e, se for de lei, as `fontes`. O render avisa quando falta texto alternativo ou sobra hashtag.
