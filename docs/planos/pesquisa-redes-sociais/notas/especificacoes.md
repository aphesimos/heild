# Especificações técnicas de conteúdo para Instagram e Facebook (2025-2026)

Pesquisa feita em 10/11/2026. Datas entre parênteses são as de publicação ou atualização indicadas por cada fonte. A Meta publica pouca coisa oficial em pixels para conteúdo orgânico (a Central de Ajuda do Instagram não renderizou na coleta). Por isso boa parte dos números vem de guias de terceiros (Sprout Social, Hootsuite, Hopper), e as divergências estão marcadas.

## Feed do Instagram: proporções, tamanho de envio e corte da grade (3:4)

### Takeaway
O feed aceita de 1,91:1 (paisagem) até 3:4 (retrato). O 3:4 nativo entrou no fim de maio de 2025, e o limite antes era 4:5. A largura máxima continua 1080 px, então 3:4 = 1080×1440 e 4:5 = 1080×1350. Desde janeiro de 2025 a grade do perfil mostra todo post como miniatura 3:4. Um 4:5 perde cerca de 34 px de cada lateral na grade, e um 3:4 aparece inteiro.

### Cited Findings
- Adam Mosseri anunciou no Threads (fim de maio de 2025) o suporte nativo a fotos 3:4, que passam a aparecer "como foram tiradas". Antes, retratos eram limitados a 4:5. O 3:4 vale para foto única e carrossel. A largura máxima segue 1080 px. — [PetaPixel, 29/05/2025](https://petapixel.com/2025/05/29/instagram-finally-adds-support-for-34-aspect-ratio-photos); [BetaNews, 30/05/2025](https://betanews.com/2025/05/30/instagram-announces-support-for-the-most-commonly-used-photo-aspect-ratio)
- Central de Ajuda do Instagram ("Image resolution of photos you share"): envia em até 1080 px de largura. Fotos com 320 a 1080 px de largura mantêm a resolução original se a proporção estiver entre 1,91:1 e 3:4 (outra versão da mesma página diz 4:5). Fora da faixa, a foto é cortada. Abaixo de 320 px ela é ampliada, e acima de 1080 px, reduzida. — [help.instagram.com/1631821640426723](https://help.instagram.com/1631821640426723/) (texto lido pelo snippet da busca, porque a página não renderizou no fetch). **Divergência:** o limite inferior aparece como 3:4 numa versão e 4:5 noutra.
- Um post de terceiros no Facebook diz que o 3:4 (altura máxima de 1440 px) vale "desde 11/11/2025", o que contradiz a data de maio de 2025 da imprensa. Provavelmente é um erro ou uma referência ao fim do rollout. — [FRD Tutorials (Facebook)](https://www.facebook.com/100090435211713/posts/facebook-instagram-linkedin-x-image-sizes-for-2026-the-only-social-media-size-gu/864015033289663/)
- Sprout Social: feed em 1080×1080 (1:1) ou 1080×1350 (4:5 ou 3:4, segundo a página). Proporção recomendada 1:1 ou 4:5. A grade mostra 1012×1350, "sempre em 3:4". A miniatura da grade tem 1080×1440 e aparece na tela com ~161×201 px. Limite de 30 MB. Formatos JPG, PNG e HEIC/HEIF no orgânico. — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/). **Inconsistência interna:** chama 1080×1350 de "4:5 ou 3:4", mas 3:4 em 1080 de largura é 1080×1440.
- Hootsuite: paisagem 1080×566, vertical 1080×1350, quadrado 1080×1080 e carrossel 1080×1350. Faixa suportada de 1,91:1 a 4:5 (a página não fala do 3:4). Na grade, tudo aparece vertical em 1012×1350 (3:4). Imagens com mais de 1080 px de largura são reduzidas a 1080. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- A grade vertical 3:4 é datada de janeiro de 2025 pela maioria dos guias. Alguns falam em fim de 2025, e outros descrevem a grade como 4:5 (o que parece errado). O feed mostra o post como foi enviado, e só a miniatura da grade é cortada. — [Neal Schaffer](https://nealschaffer.com/instagram-post-size/); [Planoly](https://planoly.com/blog/guide-to-instagrams-new-vertical-grid); [Hopper HQ](https://help.hopperhq.com/en/articles/10907941-instagram-s-vertical-grid)
- **Divergência sobre o tamanho recomendado:** parte dos guias recomenda 1080×1350 (4:5) por ser o máximo aceito em anúncios de feed e ocupar bem o feed. Outros recomendam 1080×1440 para casar com a grade. Um guia observa que posts 3:4 não podem ser impulsionados como anúncio, porque anúncios de feed vão só até 4:5. — [RecurPost](https://recurpost.com/instagram-scheduler/instagram-post-size-guide/); [AdMakeAI](https://admakeai.com/blog/instagram-post-size); [picturesizes (fev/2026)](https://picturesizes-com.pages.dev/specs/social-media/instagram)
- O guia da Later sobre tamanhos (publicado e atualizado em 19/11/2021) ainda descreve a grade 1:1 e a faixa de 1,91:1 a 4:5. **Está desatualizado** e não deve ser usado. — [Later](https://later.com/blog/instagram-image-size/)

### Inferences
- Conta do corte da grade, supondo corte centralizado em 3:4:
  - 4:5, 1080×1350: a janela 3:4 com altura de 1350 tem 1012,5 de largura, então somem cerca de 34 px de cada lateral (~67 px no total, 6%). Isso bate com o "1012×1350" de Sprout e Hootsuite.
  - 3:4, 1080×1440: nada some.
  - 1:1, 1080×1080: a janela tem 810 de largura, então somem 135 px de cada lateral.
  - 1,91:1, 1080×566: a janela tem cerca de 424 de largura, então somem cerca de 328 px de cada lateral.
- Para a Heild: o 1080×1440 dá o máximo de área no feed orgânico e na grade sem corte. Se a peça puder virar anúncio, desenhe em 1080×1440 com o conteúdo essencial dentro da faixa central de 1080×1350, ou seja, 45 px livres em cima e embaixo. Com isso ela funciona nos dois formatos.

### Gaps
- Não consegui ler a página oficial da Central de Ajuda (ela não renderizou), então não confirmei qual versão (3:4 ou 4:5) está no ar hoje.
- Não achei fonte confiável sobre a opção de reposicionar a miniatura da grade nem sobre se o corte é sempre centralizado.

## Carrossel: máximo de slides, proporção compartilhada e tamanhos

### Takeaway
O máximo é de 20 itens (fotos e/ou vídeos) desde agosto de 2024. Por padrão, o primeiro slide define a proporção e os demais são cortados para ela. Existe uma opção "Mixed" (misto), mas o comportamento dela é descrito de formas conflitantes. Use 1080×1350 ou 1080×1440 em todos os slides.

### Cited Findings
- O limite subiu de 10 para 20 fotos/vídeos por carrossel em agosto de 2024, com rollout global, depois de um teste com 15 em março de 2024. O mínimo é de 1 item. — [PetaPixel, 09/08/2024](https://petapixel.com/2024/08/09/instagram-users-can-now-share-20-photos-videos-in-a-post-carousel-photodump); [TechRadar](https://www.techradar.com/computing/instagram/instagram-will-now-let-you-post-up-to-20-photos-or-videos-in-a-gallery-your-friends-should-be-thrilled); [Social Media Today](https://www.socialmediatoday.com/news/instagram-expands-carousels-to-20-frames/723792/)
- O Sprout Social (02/11/2026) confirma o máximo de 20 e usa os mesmos tamanhos do feed. — [Sprout Social](https://sproutsocial.com/insights/social-media-image-sizes-guide/)
- O 3:4 vale para carrossel (anúncio de Mosseri). — [PetaPixel, 29/05/2025](https://petapixel.com/2025/05/29/instagram-finally-adds-support-for-34-aspect-ratio-photos)
- O primeiro slide define a proporção, e os seguintes são cortados para casar com ele. — [Later (2021)](https://later.com/blog/instagram-image-size/); [Kapwing (atualização 2026)](https://www.kapwing.com/resources/how-to-post-multiple-images-with-different-sizes-to-instagram/)
- A opção de redimensionar "Mixed" apareceu no fim de 2024 e precisa ser ativada (não é o padrão). **Divergência:** uma fonte diz que ela põe faixas vazias acima e abaixo de imagens paisagem ou quadradas, enquanto os retratos ficam em 4:5. Outra diz que ela mantém a proporção original de cada slide. — [postnitro](https://postnitro.ai/blog/post/instagram-multiple-photo-sizes); [Kapwing](https://www.kapwing.com/resources/how-to-post-multiple-images-with-different-sizes-to-instagram/)
- Hootsuite: carrossel em 1080×1350, e a grade mostra o primeiro slide em 1012×1350. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)

### Inferences
- Para carrosséis da marca, fixe uma proporção única (1080×1440 ou 1080×1350) em todos os slides e trate o primeiro slide como capa, já que ele vira a miniatura 3:4 da grade.

### Gaps
- Não há documentação oficial da Meta sobre o modo "Mixed". Seria preciso confirmar com um post de teste.

## Stories e Reels: 1080×1920, zonas seguras, capa do Reels e cortes

### Takeaway
Stories e Reels usam 1080×1920 (9:16). Não existe zona segura oficial em pixels para conteúdo orgânico. A Meta só publica margens percentuais para anúncios: 14% no topo, 35% na base (Reels) ou 20% na base (Stories) e 6% em cada lateral. Os modelos de terceiros variam muito. A capa do Reels aparece cortada em 3:4 (1080×1440 central) na grade, perdendo 240 px em cima e 240 px embaixo.

### Cited Findings
- Hopper HQ (18/09/2026), Reels em 1080×1920 sobre o quadro todo:
  - topo: 14%, ~270 px (nome de usuário, áudio, selo de patrocinado);
  - base: 35%, ~670 px (legenda e áudio);
  - lateral direita: a barra de ações ocupa os 21% mais à direita, ~230 px, e no canto inferior direito a área bloqueada chega a ~40% da altura, ~770 px;
  - laterais: 6% cada, ~65 px;
  - área central segura de ~950×980 px;
  - anúncios com aviso legal: deixe 40% da base livre.

  — [Hopper HQ](https://www.hopperhq.com/blog/instagram-reel-size/)
- Hopper HQ: a capa do Reels é enviada em 1080×1920. Na grade, ela é cortada em 3:4 (1080×1440), perdendo 240 px do topo e 240 px da base. O vídeo vai ao feed em 4:5 ou 1:1 ao ser publicado. — [Hopper HQ, 18/09/2026](https://www.hopperhq.com/blog/instagram-reel-size/)
- Sprout Social: Stories em 1080×1920, com área segura para texto e elementos interativos de 1080×1610. Deixe ~14% (250 px) no topo e ~20% (340 px) na base sem texto ou logo. Lista a capa do Reels como 420×654 (~1:1,55). — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/). **Divergência:** a capa de 420×654 do Sprout contradiz o 1080×1920 da Hopper. 420×654 parece um valor antigo de exibição, e o 1080×1920 é o tamanho de envio mais citado.
- Hootsuite: Stories em 1080×1920, com área segura de 1080×1610. Reels em 1080×1920 no feed e 1080×1440 na grade (3:4). Anúncios de Stories: 14% (250 px) no topo e 20% (340 px) na base livres. Anúncios de Reels: 14% no topo, 35% na base e 6% nas laterais livres. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- Modelos de terceiros para Reels orgânico usam com frequência 108 px no topo, 320 px na base, 60 px à esquerda e 120 px à direita. Outro guia recomenda 220/420 px (topo/base, "zona de conteúdo impulsionado"). Um verificador comparou 15 modelos e achou valores de topo entre 108 e 269 px e de base entre 250 e 672 px. — [Ignite Social Media](https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/); [Outfy](https://www.outfy.com/blog/instagram-safe-zone/); [revid.ai](https://www.revid.ai/instagram-reels-safe-zone)
- A Later (2021) diz para manter visuais importantes fora do quinto inferior do Reels, onde fica a legenda. — [Later](https://later.com/blog/instagram-image-size/)

### Inferences
- Padrão conservador sugerido para a Heild (1080×1920), alinhado às margens da Meta para anúncios:
  - Reels: topo de 270 px, base de 670 px, 65 px na lateral esquerda e ~230 px na direita.
  - Stories: topo de 250 px e base de 340 px. A área de 1080×1610 sai de 1920 menos cerca de 310 px, o que é mais permissivo. Use o valor de 250/340 por segurança.
- Capa do Reels: o título e o rosto devem caber no recorte central de 1080×1440, ou seja, entre y=240 e y=1680. Se o Reels também aparecer em 1:1 no feed, a área comum fica no quadrado central de 1080×1080, entre y=420 e y=1500 (inferência por geometria, sem fonte oficial).

### Gaps
- Não achei página oficial da Meta com zonas seguras em pixels para Reels/Stories orgânicos. O documento de anúncios (Meta Ads Guide) não renderizou e foi citado de forma indireta.
- Não confirmei se o Instagram ainda mostra Reels cortados em 4:5 ou 1:1 no feed principal hoje.

## Foto de perfil (Instagram e Facebook)

### Takeaway
Envie a foto em 320×320 px nas duas redes, com corte circular. O Facebook exibe em 176×176 px no computador e 196×196 px no celular.

### Cited Findings
- Central de Ajuda do Facebook (Páginas): a foto de perfil aparece com 176×176 px no computador, 196×196 px em smartphones e 36×36 px na maioria dos feature phones. É cortada em círculo. Envie em 320×320 para melhor qualidade. — [Facebook Help 125379114252045](https://www.facebook.com/help/125379114252045)
- Sprout: Facebook com recomendação de 320×320, mínimo de 180×60(?), círculo, JPG ou PNG. Instagram em 320×320, 1:1. — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/) (o "180×60" parece erro de digitação da fonte)
- Hootsuite: o Instagram armazena em 320×320 e exibe em círculo de ~110 px ("110×100" no texto). Mantenha o essencial no centro. Para o Facebook, PNG é melhor em perfis e capas com logo ou texto. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)

### Inferences
- Como o círculo inscrito no quadrado perde os cantos, mantenha a marca dentro do círculo central de 320 px, com margem interna. Envie em 2x (640 ou 1080 px) só se a rede aceitar sem recomprimir demais; nenhuma fonte confirma isso.

### Gaps
- Não achei fonte oficial do Instagram para o tamanho de exibição atual.

## Facebook: capa (computador e celular), imagens do feed, corte de 4:5 e 3:4, Stories

### Takeaway
A Meta recomenda envio da capa em 851×315 px, JPG sRGB com menos de 100 KB (mínimo de 400×150). A capa aparece em ~820×312 no computador e ~640×360 no celular. O celular corta as laterais, então a área segura fica perto do centro (~560–640 px de largura). No feed, o retrato mais alto aceito é 4:5. Imagens 3:4 ou mais altas tendem a ser cortadas para 4:5, mas falta fonte oficial sobre isso.

### Cited Findings
- Central de Ajuda do Facebook, capa no computador: proporção "16:9", alinhada à esquerda, sangria total, mínimo de 400×150, recomendado JPG sRGB de 851×315 com menos de 100 KB. Capa no celular: "2.4:1", mínimo de 400×150, mesmo arquivo recomendado. A foto de perfil sobrepõe a capa em cerca de 40 px. — [Facebook Help 125379114252045](https://www.facebook.com/help/125379114252045). **Inconsistência:** 851×315 tem ~2,7:1, não 16:9, e os guias de terceiros dizem que o celular mostra a área mais alta (640×360 ≈ 16:9). Os rótulos de proporção da página parecem trocados.
- Hootsuite: capa recomendada de 851×315, exibida em 820×312 no computador e 640×360 no smartphone, mínimo de 400×150, ideal com menos de 100 KB. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- Sprout: capa de Página com 851×315, mínimo de 400×150, celular em 640×360, "16:9 no computador, 2.4:1 no celular" (repete a Meta), no máximo 100 KB. Capa de perfil pessoal com mínimo de 720 px de largura. — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/)
- **Divergência na área segura da capa:** os guias citam 640×312 centralizado (o mais comum), 820×360 e 640×315. — [madgicx](https://madgicx.com/blog/facebook-post-size); [postfa.st](https://postfa.st/sizes/facebook/cover); [lineardesign](https://lineardesign.com/blog/facebook-banner-sizes/)
- Feed do Facebook segundo o Sprout: quadrado de 1080×1080 e vertical de 1440×1800 (4:5). Segundo a Hootsuite: paisagem de 1080×566 (1,91:1), vertical de "1080×1359" (4:5; provavelmente erro de digitação de 1350) e quadrado de 1080×1080. — [Sprout](https://sproutsocial.com/insights/social-media-image-sizes-guide/); [Hootsuite](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- A proporção vertical mais alta no Feed do Facebook é 4:5 (foto e vídeo). Os cards de carrossel do Facebook usam 1:1, e cards em 4:5 são cortados para quadrado. — [Ignite Social Media](https://www.ignitesocialmedia.com/?p=52487) (post antigo, ano incerto); [theoptimizer.io (2026)](https://theoptimizer.io/blog/every-meta-ad-size-you-need-in-2026-dimensions-formats-and-placements-complete-guide)
- Stories do Facebook: 1080×1920, largura mínima de 500 px, 9:16 (de 4:5 a 1,91:1 também é aceito). Deixe ~14% (~250 px) no topo e na base sem texto ou logo. Até 30 MB, JPG ou PNG. — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/)

### Inferences
- Área segura da capa por geometria: num arquivo de 851×315 exibido em 16:9 no celular, a faixa visível tem altura de 315 e largura de 315×16/9 = 560 px centrais. No computador aparece quase tudo (820×312). Então o conteúdo essencial vai em ~560×315 centralizado, longe do canto inferior esquerdo (foto de perfil no computador) e da faixa inferior (~40 px de sobreposição). Isso é inferência e coincide com o "560×312" atribuído ao Canva por uma fonte fraca.
- Uma peça 3:4 da Heild publicada no Facebook deve ser tratada como se fosse virar 4:5, com a faixa central de 1080×1350 protegida. É a mesma regra do anúncio no Instagram.

### Gaps
- Não achei documentação oficial da Meta que diga como o Feed orgânico do Facebook corta imagens 3:4 hoje.
- Não achei um tamanho oficial de capa em alta densidade (há a sugestão de 1640×624 de um terceiro, não verificada).

## Capa de destaques (Highlights) e círculo seguro

### Takeaway
Não há especificação oficial. Os guias recomendam criar em 1080×1920 (formato de Story) e manter o ícone num círculo central. Eles divergem no tamanho seguro: ~720 px num guia, e um círculo de 880 px dentro do quadrado central de 1080×1080 noutro.

### Cited Findings
- O envio é em 1080×1920 (9:16), e o Instagram recorta um círculo central. Um guia aponta área visível de ~720×720 px no centro. Outro descreve um círculo tirado do quadrado de 1080×1080 e recomenda círculo seguro de 880 px. A exibição varia de ~56 a ~115 px. O nome do destaque já aparece embaixo do círculo, então texto na capa é dispensável. — [krumzi (2026)](https://www.krumzi.com/blog/instagram-highlight-cover-size); [pixotter](https://pixotter.pages.dev/blog/instagram-highlight-cover-size/); [instasize](https://instasize.com/size-guides/instagram/highlight-cover)
- Sprout e Hootsuite não trazem especificação de capa de destaque. — [Sprout](https://sproutsocial.com/insights/social-media-image-sizes-guide/); [Hootsuite](https://blog.hootsuite.com/social-media-image-sizes-guide/)

### Inferences
- Use 1080×1920 com o ícone dentro de um círculo central de ~720 px de diâmetro, o valor mais conservador, e traço/peso grosso, porque a exibição é de ~56–115 px.

### Gaps
- Não existe fonte oficial do Instagram para o diâmetro do círculo.

## Formato de arquivo e compressão

### Takeaway
Use JPG sRGB para fotos e PNG para peças com texto e logo. O limite é de 30 MB para imagens de feed e Stories, e a capa do Facebook deve ter menos de 100 KB. O Instagram reduz tudo a 1080 px de largura, então enviar maior não ganha resolução.

### Cited Findings
- Capa do Facebook: JPG sRGB, menos de 100 KB. — [Facebook Help 125379114252045](https://www.facebook.com/help/125379114252045)
- Instagram: no máximo 30 MB. JPG, PNG e HEIC/HEIF no orgânico, e só JPG ou PNG em anúncios. Facebook: no máximo 30 MB para feed, anúncios e Stories, JPG ou PNG. — [Sprout Social, 02/11/2026](https://sproutsocial.com/insights/social-media-image-sizes-guide/)
- Prefira JPG ou PNG para evitar compressão e distorção. PNG é melhor em perfis e capas com logo ou texto. O Instagram reduz imagens com mais de 1080 px de largura. — [Hootsuite, 02/11/2026](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- O Instagram envia em até 1080 px de largura: abaixo de 320 px amplia, acima de 1080 px reduz. — [help.instagram.com/1631821640426723](https://help.instagram.com/1631821640426723/) (via snippet)

### Inferences
- Exporte em sRGB e exatamente na largura de 1080 px para o Instagram, para evitar um reamostramento a mais. Com texto fino, PNG reduz artefatos, mas a plataforma pode reconverter. Nenhuma fonte oficial confirma isso.

### Gaps
- Não achei a recomendação oficial da Meta sobre perfil de cor (sRGB) para o feed do Instagram. Só a capa do Facebook cita sRGB explicitamente.

## Campos de texto alternativo (alt text) no Instagram e no Facebook

### Takeaway
As duas redes geram alt text automático e permitem texto personalizado. No Instagram fica em "Configurações avançadas > Escrever texto alternativo", antes de publicar, ou pelo menu "⋯ > Editar" depois. No Facebook fica em "Editar > Texto alternativo > Texto alternativo personalizado", antes, ou em "Opções > Alterar texto alternativo", depois.

### Cited Findings
- Instagram: depois de editar a foto, toque em "Configurações avançadas", depois em "Escrever texto alternativo", escreva e toque em "Concluir". Em post existente, use o menu de três pontos e "Adicionar texto alternativo". O texto automático nem sempre descreve bem a imagem. — [Instagram Help (iPhone) 503708446705527](https://help.instagram.com/iphone-app/503708446705527); [Illinois Accessibility Training](https://publish.illinois.edu/accessibility-training/author/rgraham3illinois-edu/); [Hootsuite](https://blog.hootsuite.com/instagram-alt-text/)
- Facebook, antes de publicar: "Foto/vídeo", depois passe o mouse e clique em "Editar", "Texto alternativo", "Texto alternativo personalizado" e "Salvar". Depois de publicar: abra a foto, "Opções" e "Alterar texto alternativo". Dá para voltar ao texto automático com "Limpar". O alt text é lido só por leitores de tela. A página não informa limite de caracteres. — [Facebook Help 214124458607871](https://www.facebook.com/help/214124458607871)

### Inferences
- Cada slide de carrossel deve ter seu próprio alt text. No Instagram, o campo fica por imagem em "Configurações avançadas"; isso não foi verificado nesta coleta.

### Gaps
- Não achei fonte oficial e atual sobre limite de caracteres do alt text no Instagram nem no Facebook.
