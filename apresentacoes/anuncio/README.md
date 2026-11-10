# Anúncio da Heild

O vídeo de anúncio em motion graphics da Heild, para tráfego pago: Instagram (Reels, Stories e feed), TikTok e YouTube (Shorts e in-stream). A animação é uma página HTML, renderizada quadro a quadro com o relógio falso do Playwright, e o som é sintetizado do zero com numpy. Os MP4 não vão para o git: saem em `saida/`, que fica de fora (`apresentacoes/.gitignore`).

## As peças

| Arquivo em `saida/` | Formato | Duração | Para |
|---|---|---|---|
| `heild-anuncio-9x16.mp4` | 1080 × 1920 | 25 s | Reels, Stories, TikTok, Shorts |
| `heild-anuncio-4x5.mp4` | 1080 × 1350 | 25 s | Feed do Instagram e do Facebook |
| `heild-anuncio-16x9.mp4` | 1920 × 1080 | 25 s | YouTube in-stream |
| `heild-vinheta-6s-16x9.mp4` | 1920 × 1080 | 6 s | Bumper do YouTube |
| `heild-vinheta-6s-9x16.mp4` | 1080 × 1920 | 6 s | Bumper vertical |
| `heild-anuncio-capa-<formato>.png` | um por formato | | Capa (o cartão final, com a logo em repouso) |

Todos em H.264 High, `yuv420p` com cor BT.709, 30 fps, CRF 18, `+faststart`, com áudio AAC 48 kHz estéreo a -14 LUFS.

## O roteiro

Uma ideia por cena, e o texto na tela conta a história sem som. Os tempos estão em `src/roteiro.json`.

| Tempo | Cena | Na tela |
|---|---|---|
| 0 a 1,5 s | O gancho | Vinte fichas (WhatsApp, Planilha de horas, e-CAC, eSocial, Portal da prefeitura, Drive, E-mail, Internet banking…) batem na tela; "Vinte sistemas." entra palavra por palavra e empurra as fichas |
| 1,5 a 3,5 s | Tudo num lugar só | Tudo é sugado: as fichas viram cápsulas e se fundem, como líquido, na pílula; as letras saem de trás dela e a logo toca `centralizar`. "Tudo, num lugar só." |
| 3,5 a 7 s | O time | O I vira o orb e se divide em três (forma `orbs`), que explodem nos doze integrantes. "Um integrante de IA em cada setor." |
| 7 a 11 s | Ele prepara | Chicote. "Feche outubro da Metalúrgica Andrade" é digitado; uma cápsula vai do Contábil ao Fiscal; os cartões se empilham (211 de 214 casados; ISS de R$ 4.812,40). "Ele prepara." |
| 11 a 14 s | Você aprova | O cartão do PGDAS-D de outubro entra com zoom; um toque em Aprovar, o carimbo "Aprovado por você" e as 14 transmissões. "Você aprova." |
| 14 a 17 s | A lei | A onda do tema leva ao escuro. O Consultor responde: LC 123/2006, art. 18, § 5º-M, I, com o § 5º-B, XX, vigente desde 01/01/2018, segurança alta. "A lei, com o artigo e a data." |
| 17 a 20 s | As camadas | Chicote vertical. Painel, CRM, Timesheet, Financeiro, BPO e App do cliente descem e viram uma só. "Um sistema no lugar de vinte." |
| 20 a 25 s | O cartão final | A onda volta ao claro. A luz dos integrantes se junta numa faixa, a logo toca `centralizar`, "Toda a sua operação num sistema só.", "Heild Contábil · Heild BPO" e "Agende uma demonstração". Fica parado nos últimos 3 s |

A vinheta de 6 s é o gancho, a sucção e o cartão final.

Cada formato tem o próprio layout (não é recorte): no 9:16, o título em cima e o desenho embaixo, dentro da área segura do Reels e do TikTok (fora dos 14% de cima, dos 22% de baixo e dos 13% da direita); no 4:5, o mesmo arranjo mais baixo; no 16:9, o título numa coluna à esquerda e o desenho à direita, longe da barra e do botão de pular do YouTube.

## Renderizar de novo

```bash
git fetch origin design-system prototipo
node apresentacoes/anuncio/render/render.mjs                 # tudo (uns 4 a 5 min em 4 núcleos)
node apresentacoes/anuncio/render/render.mjs --peca principal --formato 9x16
node apresentacoes/anuncio/render/render.mjs --peca vinheta
python3 apresentacoes/anuncio/render/verificar.py            # ffprobe, loudness e folhas de contato
```

Precisa de Node com o Playwright (e o Chromium dele), do ffmpeg, de Python 3 com numpy e Pillow. O render monta a página com o build comum (`apresentacoes/build.py anuncio`), gera o som (`render/som.py`) e grava os vídeos e as capas em `saida/`.

Para conferir quadros soltos sem gravar vídeo: `--quadros 0-749/25` grava um PNG a cada 25 quadros em `saida/quadros/<peça>-<formato>/`, e `verificar.py --pasta <essa pasta>` monta a folha de contato (com as zonas seguras desenhadas, no 9:16).

Para ver a animação no navegador, em tempo real: `python3 apresentacoes/build.py anuncio` e abra `apresentacoes/dist/heild-anuncio.html?formato=9x16&peca=principal` (o formato e a peça vêm do endereço; sem eles, o formato segue a proporção da janela).

## Como funciona

- **Tempo determinístico.** Tudo o que se move é função do tempo: `ANUNCIO.quadro(t)` põe cada cena no estado do instante `t`. Não há transição nem animação CSS (elas rodam no compositor e escapam do relógio). O `<heild-logo>` e o `<orb-avatar>` andam com `requestAnimationFrame` e `performance.now`, que o relógio falso do Playwright controla: a cada quadro o relógio anda 1/30 s e as cenas disparam neles ações presas a marcas de tempo (`play`, `morph`, `reaction`), uma vez cada.
- **Mesmo quadro, mesma imagem.** No render, `Math.random` tem semente, o `IntersectionObserver` responde sempre "visível" e a página é montada com o relógio parado; do lado do Chromium, o compositor termina a rasterização antes de desenhar (`--run-all-compositor-stages-before-draw` e companhia), cada quadro rasteriza a página inteira de novo e um quadro de assentamento vem antes da captura. O estado de cada quadro (o DOM, a logo, os orbs) sai idêntico entre renders, e a imagem também, byte a byte, em cerca de 95% dos quadros. No resto, a diferença fica no anti-serrilhado de uma letra ou do traço da logo em movimento, sob uma transformação fracionária, em poucos pixels (no máximo 0,2% do quadro), invisível no vídeo: vem dos caches de glifo e de traçado da rasterização do Chromium, não do relógio (testado com e sem GPU e com uma thread de rasterização só). `CHROMIUM_FLAGS="..."` acrescenta opções ao Chromium para novos testes.
- **Nítido na escala da marca.** O quadro tem o tamanho exato do vídeo, com `deviceScaleFactor` 1; dentro dele o palco é desenhado em px de celular e ampliado por `zoom` (2, ou 2,25 no 16:9). Assim os tokens do design system valem como foram desenhados (a grade de pontos de 24 px, os raios, as sombras) e o texto sai nítido. Os orbs são canvas: no render, o `devicePixelRatio` é 3 para eles desenharem na resolução do vídeo.
- **Um roteiro para a imagem e o som.** `src/roteiro.json` tem as marcas de tempo de cada peça (cada palavra que bate, o toque, o carimbo, a explosão dos orbs…) e os eventos de som e de tremor, presos a essas marcas. A animação e o `som.py` leem o mesmo arquivo; mudar um tempo ali muda os dois.

## Arquivos

| Caminho | O que é |
|---|---|
| `src/modelo.html` | A página, com as marcas que o build preenche (fontes, tokens, `<heild-logo>`, `<orb-avatar>`) |
| `src/roteiro.json` | Os tempos, os textos (com as quebras de linha por orientação) e os eventos de som. **É o arquivo que se edita para mudar o ritmo** |
| `src/motor.js` | Os formatos e as áreas seguras, o relógio, o título cinético, o tremor da câmera, o borrão direcional (SVG), a onda do tema |
| `src/cenas.js` | As cinco camadas: abertura (gancho, sucção, logo, time), trabalho (prepara e aprova), lei, camadas e final |
| `src/estilo.css` | A forma, só com os tokens de `../comum/tokens.css` |
| `render/render.mjs` | O render: Playwright com o relógio falso, PNG por quadro direto para o ffmpeg |
| `render/som.py` | A trilha original, sintetizada com numpy, normalizada em -14 LUFS |
| `render/verificar.py` | A conferência: ffprobe, loudness, folhas de contato e zonas seguras |

## Regras que o anúncio segue

- O design system do branch `design-system`: areia em camadas, um destaque índigo só em pontos pequenos (os avisos nas fichas), PP Neue Montreal com os títulos no estilo hero (500, -0,04em), nenhum texto em caixa alta, nenhum sobretítulo, sem emoji.
- A logo é sempre o `<heild-logo>`, com `play('centralizar')` e `morph('orbs')`; nunca redesenhada. A pílula e as cápsulas viram matéria das transições (a sucção e a fusão líquida usam o mesmo desfoque com limiar de alfa da logo). Uma logo animando por vez.
- Os orbs são o `<orb-avatar>` de verdade, com a cor de cada integrante; as reações (pensando, trabalhando, precisa de você, concluído, com as partículas) aparecem sempre com a palavra do estado ao lado. As cores dos orbs só aparecem nos orbs e na luz do cartão final.
- Os recursos de movimento da marca: a grade de pontos, o desenho das camadas que descem e viram uma só, e a onda da troca de tema (a mesma de `comum/tema.css`, com `cubic-bezier(0.3, 0, 0.2, 1)`) como transição do claro ao escuro e de volta.
- Nada inventado: a Heild não foi lançada. Sem clientes, depoimentos, números de uso, preço ou promessa de economia. As cenas usam os dados fictícios da demonstração (`apresentacoes/produto/src/dados.js`). As fichas do gancho são categorias, canais e sistemas públicos citados na pesquisa, sem marcas de concorrentes. Sem URL: o CTA diz "Agende uma demonstração", e o botão da plataforma de anúncios faz o resto.
- A trilha é original: nenhum trecho de música de terceiros.
