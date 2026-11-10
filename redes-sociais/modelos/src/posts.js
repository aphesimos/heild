/*
 * Os posts da Heild, em ordem de publicação: o conteúdo, a legenda, as hashtags e o texto alternativo.
 *
 * Fonte dos textos: os textos aprovados do site (branch site, app/src/site/SiteApp.tsx), os dados da
 * apresentação (apresentacoes/produto/src/dados.js), a filosofia (apresentacoes/inteiro) e as notas de pesquisa
 * (docs/planos/pesquisa-redes-sociais/). O produto aparece só com os dados fictícios da demonstração
 * (Metalúrgica Andrade, Clínica Sorriso, Padaria Pão Quente, João Batista, Rita), marcados como exemplo.
 * Lei: só com a fonte conferida em docs/planos/pesquisa-redes-sociais/notas/fatos-legais-verificados.md.
 *
 * Campos: id, grupo (fixado, feed, stories, reels, perfil), tipo, formato (feed 1080×1440 por padrão), tema
 * (claro ou escuro; no feed, alterna post a post), serie, pilar, slides, legenda, hashtags (no máximo 5),
 * alt (um por slide). `video` diz o que o Reel precisa para ir ao ar.
 */
(function () {
  'use strict';
  var HP = window.HP, orb = HP.orb, logo = HP.logo, luz = HP.luz, h = HP.h;
  var LUZ_TIME = ['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas', 'atendimento', 'bpo_pagar'];

  /* ---------- desenhos únicos ---------- */

  // O panorama de "Um sistema no lugar de vinte": as ferramentas soltas, a linha de passagem que atravessa
  // os cinco slides, as camadas que se empilham e o plano único, com um orb em cima (marca-e-site.md).
  function panoramaVinte() {
    // cada pílula cabe inteira dentro do seu slide (a emenda só é atravessada pela linha tracejada)
    var soltas = [
      ['Prazos', 440, 70], ['Portal de guias', 600, 104], ['Planilha de horas', 452, 160], ['WhatsApp no celular', 560, 204], ['Caixa postal', 470, 288],
      ['Extrato do banco', 804, 72], ['Senhas', 1044, 96], ['ERP do cliente', 862, 152], ['Contratos', 1012, 204], ['Cobrança', 822, 290], ['Arquivos', 990, 296]
    ];
    var pilulas = soltas.map(function (p, i) {
      return '<span class="pilula" style="position:absolute;left:' + p[1] + 'px;top:' + p[2] + 'px;transform:rotate(' + ((i % 3) - 1) * 3 + 'deg)">' + h(p[0]) + '</span>';
    }).join('');
    // camadas isométricas em traço (marca-e-site.md): cinco planos empilhados, depois um só
    function plano(cx, cy, w) {
      var a = w * 0.5, b = w * 0.29;
      return '<path d="M' + (cx - a) + ' ' + cy + ' L' + cx + ' ' + (cy - b) + ' L' + (cx + a) + ' ' + cy + ' L' + cx + ' ' + (cy + b) + ' Z" fill="var(--fundo)" stroke="var(--texto)" stroke-width="1.5" stroke-linejoin="round"/>';
    }
    var ys = [120, 160, 200, 240, 280];
    var cam = '<svg style="position:absolute;left:0;top:0" width="1950" height="520" viewBox="0 0 1950 520" aria-hidden="true">' +
      '<line x1="390" y1="250" x2="1755" y2="250" stroke="var(--texto-suave)" stroke-width="1.5" stroke-dasharray="4 6"/>' +
      ys.map(function (y) { return plano(1300, y, 180); }).join('') + plano(1755, 250, 260) + '</svg>';
    var rotulos = ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'App do cliente'].map(function (r, i) {
      return '<span class="pilula" style="position:absolute;left:1405px;top:' + (ys[i] - 14) + 'px">' + r + '</span>';
    }).join('');
    var titulos = [[414, 'Prazos num sistema, conversas no celular, horas numa planilha.'], [804, 'Cada um com o seu cadastro e a sua senha.'],
      [1194, 'Na Heild, cada sistema vira uma camada.'], [1584, 'E as camadas viram uma superfície só.']].map(function (t) {
      return '<h2 class="t-titulo" style="position:absolute;left:' + t[0] + 'px;top:352px;width:330px">' + t[1] + '</h2>';
    }).join('');
    return pilulas + cam + rotulos + titulos + '<div style="position:absolute;left:1729px;top:214px">' + orb('assistente', 52) + '</div>';
  }
  // a linha tracejada no primeiro slide (uma capa comum): começa num ponto e sai pela borda direita
  var LINHA_CAPA = '<div style="position:absolute;left:24px;right:0;top:250px;border-top:1.5px dashed var(--texto-suave)"></div>' +
    '<span style="position:absolute;left:20px;top:245px;width:10px;height:10px;border-radius:var(--raio-pilula);background:var(--destaque)"></span>';

  // Grade de 3×3 integrantes, para o post do time e a capa do Facebook.
  function gradeOrbs(ids, tam, gap) {
    return '<div style="display:grid;grid-template-columns:repeat(' + Math.ceil(Math.sqrt(ids.length)) + ',auto);gap:' + gap + 'px;justify-content:center">' +
      ids.map(function (id) { return orb(id, tam); }).join('') + '</div>';
  }

  /* ---------- o feed ---------- */
  var P = [];

  /* Os três fixados: uma linha com o mesmo desenho (logo numa forma no alto, título no pé), escuro, claro, escuro. */
  P.push({
    id: 'F1', grupo: 'fixado', tipo: 'carrossel', desenho: 'Manifesto', tema: 'escuro', serie: 'Manifesto', pilar: 'O inteiro',
    slides: [
      { l: 'capa', forma: 'centralizar', formaTopo: '33%', titulo: 'Tudo, num lugar só.', sub: 'O manifesto da Heild, em seis frases.' },
      { l: 'manifesto', frase: 'Um escritório não é feito de partes.' },
      { l: 'manifesto', frase: 'Mas trabalha espalhado em vinte sistemas.' },
      { l: 'manifesto', frase: 'A Heild junta tudo num lugar só.', sub: 'Painel, CRM com WhatsApp, timesheet, financeiro, BPO, arquivos e app do cliente, sobre o mesmo cadastro.' },
      { l: 'manifesto', frase: 'Um integrante de IA em cada setor.', sub: 'Eles preparam o trabalho. Uma pessoa aprova.' },
      { l: 'manifesto', classe: 't-leve p', frase: '*Heild*, do islandês: o inteiro. O todo sem partes separadas.' },
      { l: 'fecho', luz: LUZ_TIME, forma: 'orbs', frase: 'Tudo, num lugar só.', sub: 'A Heild ainda não foi lançada. A demonstração está no site, com o link na bio.' }
    ],
    legenda: 'Um escritório não é feito de partes. Mas trabalha espalhado em vinte sistemas.\n\nPrazos num lugar, conversas no celular, horas numa planilha, guias em outro portal. Cada um com o seu cadastro e a sua senha.\n\nA Heild junta tudo num lugar só: Painel, CRM com WhatsApp, timesheet, financeiro, BPO, arquivos e app do cliente. Em cada setor, um integrante de IA prepara o trabalho, e uma pessoa aprova.\n\nO nome vem do islandês heild: o inteiro, o todo sem partes separadas.\n\nA Heild ainda não foi lançada. A demonstração roda no site, com o link na bio.',
    hashtags: ['#EscritorioContabil', '#Contabilidade', '#BPOFinanceiro'],
    alt: [
      'Fundo escuro com grade de pontos. No alto, a logo da Heild com o I em forma de grade de nove pontos. Embaixo, o título: Tudo, num lugar só. O manifesto da Heild, em seis frases.',
      'Texto grande em fundo escuro: Um escritório não é feito de partes.',
      'Texto grande em fundo escuro: Mas trabalha espalhado em vinte sistemas.',
      'Texto grande: A Heild junta tudo num lugar só. Abaixo: Painel, CRM com WhatsApp, timesheet, financeiro, BPO, arquivos e app do cliente, sobre o mesmo cadastro.',
      'Texto grande: Um integrante de IA em cada setor. Abaixo: Eles preparam o trabalho. Uma pessoa aprova.',
      'Texto: Heild, do islandês: o inteiro. O todo sem partes separadas.',
      'Fecho: uma faixa de luz nas cores dos integrantes atrás da logo da Heild, com o I dividido em três orbs. Texto: Tudo, num lugar só. A Heild ainda não foi lançada. A demonstração está no site, com o link na bio.'
    ]
  });

  P.push({
    id: 'F2', grupo: 'fixado', tipo: 'carrossel', desenho: 'Panorâmico contínuo', tema: 'claro', serie: 'O que é', pilar: 'Como funciona',
    panorama: { html: panoramaVinte() },
    slides: [{ l: 'capa', forma: 'painel', formaTopo: '33%', html: LINHA_CAPA, titulo: 'Um sistema no lugar de vinte.', sub: 'Arraste para o lado. É assim que a Heild junta o escritório.' }, { l: 'pano' }, { l: 'pano' }, { l: 'pano' }, { l: 'pano', pe: { logo: true } }],
    legenda: 'Um sistema no lugar de vinte. Arraste para o lado.\n\nO escritório de hoje vive em ferramentas soltas: os prazos num sistema, as conversas no WhatsApp do celular, as horas numa planilha, as guias num portal, o extrato no banco. Cada uma com o seu cadastro.\n\nNa Heild, cada sistema vira uma camada, e as camadas viram uma superfície só, sobre o mesmo cadastro. O que acontece num lado aparece em todos os outros, sem ninguém digitar de novo.\n\nEm cima dessa superfície trabalha o time de integrantes de IA. Mas isso fica para o próximo post fixado.',
    hashtags: ['#EscritorioContabil', '#GestaoContabil', '#BPOFinanceiro'],
    alt: [
      'Começo de um carrossel panorâmico em fundo claro. No alto, a logo da Heild com o I em forma de painel. Uma linha tracejada começa num ponto índigo e atravessa todos os slides. Título: Um sistema no lugar de vinte. Texto: Arraste para o lado. É assim que a Heild junta o escritório.',
      'Pílulas soltas e tortas com nomes de ferramentas: Prazos, Portal de guias, Planilha de horas, WhatsApp no celular, Caixa postal. Texto: Prazos num sistema, conversas no celular, horas numa planilha.',
      'Mais pílulas soltas: Extrato do banco, Senhas, ERP do cliente, Contratos, Cobrança, Arquivos. Texto: Cada um com o seu cadastro e a sua senha.',
      'Cinco planos em perspectiva, empilhados, com os nomes Painel, CRM, Timesheet, Financeiro e App do cliente. Texto: Na Heild, cada sistema vira uma camada.',
      'Um plano único, maior, com o orb do Assistente em cima, onde a linha tracejada termina. Texto: E as camadas viram uma superfície só. A logo da Heild no pé.'
    ]
  });

  P.push({
    id: 'F3', grupo: 'fixado', tipo: 'carrossel', desenho: 'Passo a passo', tema: 'escuro', serie: 'Como funciona', pilar: 'Como funciona',
    slides: [
      { l: 'capa', forma: 'bpo', formaTopo: '33%', titulo: 'A IA prepara. Uma pessoa aprova.', sub: 'Um pedido do começo ao fim, em quatro passos.' },
      { l: 'passo', chao: 'pontos', num: '1', quem: 'assistente', titulo: 'Você pede como pediria a um colega.', exemplo: true,
        html: '<div class="painel" style="display:flex;flex-direction:column;gap:14px">' + HP.bolha('Feche outubro da Metalúrgica Andrade', { minha: true }) +
          HP.bolha('Dividi em duas partes: o Contábil concilia e gera o balancete; depois o Fiscal apura o ISS e o PIS/COFINS. Vou acompanhando aqui.', { quem: 'assistente' }) + '</div>' },
      { l: 'passo', chao: 'pontos', num: '2', quem: ['contabil', 'fiscal'], titulo: 'Cada integrante faz a parte do seu setor.', exemplo: true,
        html: '<div class="painel" style="display:flex;flex-direction:column;gap:14px">' + HP.linhaTime('contabil', 'Fechei outubro da Metalúrgica: 211 de 214 casados.') +
          HP.linhaTime('fiscal', 'Apurei o ISS e o PIS/COFINS de outubro.') + HP.linhaTime('atendimento', 'Vou avisar a Rita quando as guias saírem.') + '</div>' },
      { l: 'passo', chao: 'pontos', num: '3', quem: 'fiscal', titulo: 'O que sai do escritório vira um cartão.', exemplo: true,
        html: HP.cartaoAprovacao({ quem: 'fiscal', estado: 'pede a sua aprovação', titulo: 'Enviar as guias de outubro da Metalúrgica ao cliente', campos: [['ISS', 'R$ 4.812,40'], ['PIS/COFINS', 'R$ 7.215,90']] }) },
      { l: 'passo', chao: 'pontos', num: '4', titulo: 'Uma pessoa aprova, e o nome dela fica registrado.', exemplo: true,
        html: HP.cartaoAprovacao({ quem: 'fiscal', estado: 'enviado ao cliente', titulo: 'Enviar as guias de outubro da Metalúrgica ao cliente', campos: [['ISS', 'R$ 4.812,40'], ['PIS/COFINS', 'R$ 7.215,90']], aprovado: 'Aprovado por você' }) },
      { l: 'fecho', forma: 'bpo', frase: 'A IA faz. A pessoa aprova.', sub: 'Veja a demonstração no site, com o link na bio.' }
    ],
    legenda: 'A IA prepara. Uma pessoa aprova.\n\nNa Heild, você pede como pediria a um colega: "Feche outubro da Metalúrgica Andrade". O Assistente divide o pedido entre o time: o Contábil concilia e gera o balancete, o Fiscal apura os tributos.\n\nTudo que tem efeito fora do escritório chega como um cartão: transmitir, pagar, assinar e enviar ao cliente. Uma pessoa aprova, e o nome dela fica registrado na tarefa e no histórico do cliente.\n\nOs nomes e valores deste carrossel são fictícios, da demonstração do produto.',
    hashtags: ['#EscritorioContabil', '#Contabilidade', '#InteligenciaArtificial'],
    alt: [
      'Fundo escuro com grade de pontos. No alto, a logo da Heild com o I em forma de check. Título: A IA prepara. Uma pessoa aprova. Um pedido do começo ao fim, em quatro passos.',
      'Passo 1, com o orb do Assistente. Título: Você pede como pediria a um colega. Um chat de exemplo: a pessoa escreve "Feche outubro da Metalúrgica Andrade" e o Assistente responde que dividiu entre o Contábil e o Fiscal. Marcado como exemplo da demonstração, com dados fictícios.',
      'Passo 2, com os orbs do Contábil e do Fiscal. Título: Cada integrante faz a parte do seu setor. Lista: o Contábil fechou outubro, 211 de 214 casados; o Fiscal apurou o ISS e o PIS/COFINS; o Atendimento vai avisar a Rita. Exemplo da demonstração.',
      'Passo 3. Título: O que sai do escritório vira um cartão. Um cartão do Fiscal pede aprovação para enviar as guias de outubro da Metalúrgica ao cliente: ISS de R$ 4.812,40 e PIS/COFINS de R$ 7.215,90, com os botões Aprovar e Ver detalhes. Exemplo da demonstração.',
      'Passo 4. Título: Uma pessoa aprova, e o nome dela fica registrado. O mesmo cartão, agora com a marca Aprovado por você. Exemplo da demonstração.',
      'Fecho: a logo da Heild com o I em forma de check. Texto: A IA faz. A pessoa aprova. Veja a demonstração no site, com o link na bio.'
    ]
  });

  /* 01 a 21: alternam claro (ímpar) e escuro (par), o que desenha o xadrez na grade de 3 colunas. */
  P.push({
    id: '01', titulo: 'O nome', tipo: 'estatico', tema: 'claro', serie: 'Do inteiro', pilar: 'O inteiro',
    slides: [{ l: 'livre', html:
      '<div class="area" style="gap:0;padding-bottom:40px">' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px">' +
      '<p class="t-leve g" style="font-style:italic">heild</p>' +
      '<p class="t-sub" style="color:var(--texto)">Islandês: o inteiro, o todo sem partes separadas.</p>' +
      '<hr class="divisoria" style="width:100%;margin:6px 0">' +
      '<p class="t-leve p" style="font-style:italic">heill</p>' +
      '<p class="t-sub">Nórdico antigo: são, inteiro. A raiz.</p></div>' +
      '<p class="t-rotulo" style="max-width:330px">Cleasby e Vigfússon, An Icelandic-English Dictionary (1874), verbete heill.</p></div>' }],
    legenda: 'De onde vem o nome.\n\nHeild é uma palavra islandesa: o inteiro, o todo sem partes separadas. A raiz é o nórdico antigo heill, que quer dizer são, inteiro.\n\nÉ o que a Heild quer ser para um escritório: as ferramentas, as conversas, as horas e o financeiro num lugar só, inteiros.\n\nA história completa do nome está no "Do inteiro", no site.',
    hashtags: ['#Heild', '#Etimologia', '#EscritorioContabil'],
    alt: ['Fundo claro com grade de pontos. Em itálico grande, a palavra heild, com a explicação: islandês, o inteiro, o todo sem partes separadas. Abaixo de uma linha, a palavra heill: nórdico antigo, são, inteiro, a raiz. No pé, a fonte: Cleasby e Vigfússon, An Icelandic-English Dictionary, 1874, e a logo da Heild.']
  });

  var PRAZOS = [['15', 'eSocial', 'Os eventos da folha do mês anterior.', 'Manual de Orientação do eSocial'],
    ['20', 'FGTS Digital', 'A guia do FGTS do mês anterior.', 'Lei nº 8.036/1990, art. 15'],
    ['Último dia útil', 'DCTFWeb', 'Os fatos geradores do mês anterior.', 'IN RFB nº 2.237/2024, art. 6º']];
  P.push({
    id: '02', titulo: 'Três prazos de todo mês', tipo: 'estatico', tema: 'escuro', serie: 'Calendário', pilar: 'A lei, com fonte', lei: true,
    slides: [{ l: 'livre', html:
      '<div class="area" style="gap:14px;padding-bottom:40px">' +
      '<h2 class="t-hero" style="max-width:330px;font-size:36px;line-height:38px">Três prazos de todo mês.</h2>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px">' +
      PRAZOS.map(function (p) {
        return '<div class="cartao" style="display:grid;grid-template-columns:84px 1fr;gap:12px;align-items:center;padding:12px 16px">' +
          '<span class="t-leve num" style="font-size:' + (p[0].length > 3 ? 18 : 40) + 'px;line-height:' + (p[0].length > 3 ? 20 : 40) + 'px">' + p[0] + '</span>' +
          '<span style="display:flex;flex-direction:column;gap:1px"><span class="t-enfase">' + p[1] + '</span><span style="font-size:13px;line-height:18px">' + p[2] + '</span><span class="t-rotulo">' + p[3] + '</span></span></div>';
      }).join('') + '</div></div>' }],
    legenda: 'Três prazos que voltam todo mês.\n\nDia 15: os eventos da folha do mês anterior no eSocial. Se cair em dia não útil, passa para o primeiro dia útil seguinte (Manual de Orientação do eSocial, S-1.3).\n\nDia 20: o depósito do FGTS pela guia do FGTS Digital, sobre a remuneração do mês anterior (Lei nº 8.036/1990, art. 15). Se o dia 20 não for útil, o vencimento é antecipado.\n\nÚltimo dia útil: a DCTFWeb dos fatos geradores do mês anterior (IN RFB nº 2.237/2024, art. 6º, na redação da IN RFB nº 2.248/2025). O prazo de pagamento dos tributos declarados não mudou.\n\nNa Heild, o calendário de cada cliente sai do perfil dele cruzado com as regras vigentes.',
    hashtags: ['#DepartamentoPessoal', '#eSocial', '#FGTS', '#Contabilidade'],
    alt: ['Fundo escuro. Título: Três prazos de todo mês. Três cartões: dia 15, eSocial, os eventos da folha do mês anterior, fonte Manual de Orientação do eSocial; dia 20, FGTS Digital, a guia do FGTS do mês anterior, fonte Lei nº 8.036/1990, art. 15; último dia útil, DCTFWeb, os fatos geradores do mês anterior, fonte IN RFB nº 2.237/2024, art. 6º.'],
    fontes: ['https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-03-2025.pdf', 'https://www2.camara.leg.br/legin/fed/lei/1990/lei-8036-11-maio-1990-365155-normaatualizada-pl.html', 'https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/fevereiro/contribuintes-ganham-mais-tempo-para-entregar-a-dctfweb']
  });

  var CONTABIL = [['fiscal', 'Gerei as guias de outubro e deixei para você aprovar.'], ['dp', 'Os contratos de experiência da Padaria estão prontos.'],
    ['contabil', 'Fechei outubro da Metalúrgica: 211 de 214 casados.'], ['societario', 'Montei a resposta à exigência da JUCESP para você revisar.'], ['notas', 'Estou capturando as notas de entrada de outubro.']];
  P.push({
    id: '03', tipo: 'carrossel', desenho: 'Integrante por integrante', tema: 'claro', serie: 'O time', pilar: 'O time',
    slides: [{ l: 'capa', orbs: CONTABIL.map(function (c) { return c[0]; }), orbTam: 58, orbsTopo: '34%', titulo: 'O time da Heild Contábil.', sub: 'Um integrante de IA em cada setor do escritório.' }]
      .concat(CONTABIL.map(function (c) { return { l: 'integrante', id: c[0], fala: c[1] }; }))
      .concat([{ l: 'fecho', forma: 'equipe', frase: 'Cada um conhece o trabalho do seu setor.', sub: 'E passa o que é de outro setor para quem faz.' }]),
    legenda: 'O time da Heild Contábil: um integrante de IA em cada setor.\n\nFiscal: apura os tributos, gera as guias e prepara as transmissões.\nDP: prepara admissões, a folha e os envios ao eSocial.\nContábil: concilia, classifica e fecha o mês com o balancete.\nSocietário: cuida do cadastro na Receita, dos certificados e das exigências da Junta.\nNotas: captura as notas do mês e confere a tributação.\n\nCada um tem o seu chat, a sua fila e a memória do que já fez. As falas são da demonstração, com empresas fictícias.',
    hashtags: ['#EscritorioContabil', '#Contabilidade', '#DepartamentoPessoal'],
    alt: ['Fundo claro. Cinco orbs coloridos com olhos, lado a lado: laranja, azul, verde-água, rosa e amarelo. Título: O time da Heild Contábil. Um integrante de IA em cada setor do escritório.']
      .concat(CONTABIL.map(function (c) { var it = HP.I[c[0]]; return 'O orb do ' + it.nome + ', grande. Nome: ' + it.nome + '. Área: ' + it.area + '. ' + it.faz + ' Fala de exemplo: ' + c[1]; }))
      .concat(['Fecho: a logo da Heild com o I em forma de três pessoas. Texto: Cada um conhece o trabalho do seu setor. E passa o que é de outro setor para quem faz.'])
  });

  P.push({
    id: '04', tipo: 'estatico', tema: 'escuro', serie: 'O Consultor', pilar: 'Como funciona',
    slides: [{ l: 'texto', orb: 'consultor', orbTam: 64, alinha: 'flex-end', classe: 't-hero', titulo: 'A lei, com o artigo e a data.',
      itens: [['Vigente na data.', 'Cada afirmação aponta para a redação que valia na data do fato, não para a de hoje.'], ['Com o trecho citado.', 'O texto da lei vem junto, para conferir em segundos.'], ['Com o grau de segurança.', 'Alto, médio ou baixo. Sem base suficiente, ele diz que não encontrou.']] }],
    legenda: 'O Consultor responde sobre a lei com o artigo e a data.\n\nPergunte como a um colega. A resposta vem pela redação que vale na data do fato, com o trecho citado e o grau de segurança: alto, médio ou baixo. Sem base suficiente, ele diz que não encontrou.\n\nAfirmação legal, na Heild, só com fonte conferida.',
    hashtags: ['#Contabilidade', '#Tributario', '#ReformaTributaria'],
    alt: ['Fundo escuro com o orb roxo do Consultor no canto. Título: A lei, com o artigo e a data. Três pontos: Vigente na data, cada afirmação aponta para a redação que valia na data do fato; Com o trecho citado, o texto da lei vem junto; Com o grau de segurança, alto, médio ou baixo, e sem base ele diz que não encontrou.']
  });

  // 05: o fator R no texto da lei (preenchido com a verificação; ver fatos-legais-verificados.md)
  P.push({
    id: '05', tipo: 'carrossel', desenho: 'Citação da lei', tema: 'claro', serie: 'A lei, com fonte', pilar: 'A lei, com fonte', lei: true,
    slides: [
      { l: 'capa', forma: 'lupa', formaTopo: '33%', titulo: 'O fator R, no texto da lei.', sub: 'LC 123/2006, art. 18: os quatro parágrafos que decidem entre o Anexo III e o V.' },
      { l: 'lei', ref: 'Qual período conta: § 5º-K.', trecho: '“Para o cálculo da razão a que se referem os §§ 5º-J e 5º-M, serão considerados, respectivamente, os montantes pagos e auferidos nos doze meses anteriores ao período de apuração para fins de enquadramento no regime tributário do Simples Nacional.”', fonte: 'LC 123/2006, art. 18, § 5º-K, redação da LC 155/2016.', leitura: 'A partir de 1º/1/2027, a janela passa a ser os doze meses antecedentes ao mês anterior ao da apuração (LC 214/2025, art. 517).' },
      { l: 'lei', ref: 'O que entra na folha: § 24.', trechoTam: 14, trecho: '“[…] considera-se folha de salários, incluídos encargos, o montante pago, nos doze meses anteriores ao período de apuração, a título de remunerações a pessoas físicas decorrentes do trabalho, acrescido do montante efetivamente recolhido a título de contribuição patronal previdenciária e FGTS, incluídas as retiradas de pró-labore.”', fonte: 'LC 123/2006, art. 18, § 24. O § 26 tira da conta aluguéis e distribuição de lucros.', leitura: 'Salários, pró-labore, INSS patronal e FGTS.' },
      { l: 'lei', ref: '28% ou mais: § 5º-J.', trecho: '“As atividades de prestação de serviços a que se refere o § 5º-I serão tributadas na forma do Anexo III desta Lei Complementar caso a razão entre a folha de salários e a receita bruta da pessoa jurídica seja igual ou superior a 28% (vinte e oito por cento).”', fonte: 'LC 123/2006, art. 18, § 5º-J, incluído pela LC 155/2016.', leitura: 'As atividades do § 5º-I, que iriam para o Anexo V, passam ao Anexo III.' },
      { l: 'lei', ref: 'Menos de 28%: § 5º-M.', trechoTam: 14, trecho: '“Quando a relação entre a folha de salários e a receita bruta da microempresa ou da empresa de pequeno porte for inferior a 28% (vinte e oito por cento), serão tributadas na forma do Anexo V desta Lei Complementar as atividades previstas: I - nos incisos XVI, XVIII, XIX, XX e XXI do § 5º-B deste artigo; II - no § 5º-D deste artigo.”', fonte: 'LC 123/2006, art. 18, § 5º-M, incluído pela LC 155/2016.', leitura: 'Fisioterapia, arquitetura, medicina, odontologia, psicologia e as outras dos incisos citados vão do Anexo III para o V.' },
      { l: 'texto', classe: 't-titulo', titulo: 'A conta, numa linha.', html:
        '<div class="cartao" style="display:flex;flex-direction:column;gap:10px;padding:18px"><span class="t-corpo">Folha dos 12 meses</span><hr class="divisoria"><span class="t-corpo">Receita bruta dos 12 meses</span></div>' +
        '<p class="t-corpo">Com 28% ou mais, Anexo III. Abaixo de 28%, Anexo V, para as atividades que a lei sujeita ao fator R.</p>' },
      { l: 'fecho', forma: 'lupa', frase: 'A lei, com o artigo e a data.', sub: 'O Consultor da Heild responde pela redação vigente na data do fato, com o trecho citado.' }
    ],
    legenda: 'O fator R, no texto da lei.\n\nQuatro parágrafos do art. 18 da LC 123/2006 decidem se uma atividade de serviço fica no Anexo III ou no V:\n\n§ 5º-K: conta os doze meses anteriores ao período de apuração. A partir de 1º/1/2027, a LC 214/2025 (art. 517) muda a janela para os doze meses antecedentes ao mês anterior ao da apuração.\n§ 24: a folha inclui salários, pró-labore, INSS patronal e FGTS. O § 26 deixa de fora aluguéis e lucros distribuídos.\n§ 5º-J: com folha de 28% ou mais da receita, as atividades do § 5º-I vão para o Anexo III.\n§ 5º-M: com menos de 28%, as atividades dos incisos XVI, XVIII, XIX, XX e XXI do § 5º-B e do § 5º-D vão para o Anexo V.\n\nTexto conferido na LC 123/2006 compilada, na Legislação Informatizada da Câmara dos Deputados. Este post é informativo; confira o caso concreto.',
    hashtags: ['#FatorR', '#SimplesNacional', '#Contabilidade', '#Tributario'],
    alt: [
      'Fundo claro. No alto, a logo da Heild com o I em forma de lupa. Título: O fator R, no texto da lei. LC 123/2006, art. 18: os quatro parágrafos que decidem entre o Anexo III e o V.',
      'Título: Qual período conta: parágrafo 5º-K. Trecho da lei em itálico: para o cálculo da razão, serão considerados os montantes pagos e auferidos nos doze meses anteriores ao período de apuração. Nota: a partir de 1º de janeiro de 2027, a janela passa a ser os doze meses antecedentes ao mês anterior ao da apuração, pela LC 214/2025, art. 517.',
      'Título: O que entra na folha: parágrafo 24. Trecho da lei: folha de salários, incluídos encargos, é o montante pago nos doze meses anteriores a pessoas físicas pelo trabalho, mais a contribuição patronal previdenciária e o FGTS, incluídas as retiradas de pró-labore. Nota: o parágrafo 26 tira da conta aluguéis e distribuição de lucros. Resumo: salários, pró-labore, INSS patronal e FGTS.',
      'Título: 28% ou mais: parágrafo 5º-J. Trecho da lei: as atividades do parágrafo 5º-I serão tributadas pelo Anexo III caso a razão entre a folha de salários e a receita bruta seja igual ou superior a 28%. Resumo: as atividades do parágrafo 5º-I, que iriam para o Anexo V, passam ao Anexo III.',
      'Título: Menos de 28%: parágrafo 5º-M. Trecho da lei: quando a relação entre a folha de salários e a receita bruta for inferior a 28%, serão tributadas pelo Anexo V as atividades dos incisos XVI, XVIII, XIX, XX e XXI do parágrafo 5º-B e do parágrafo 5º-D. Resumo: fisioterapia, arquitetura, medicina, odontologia, psicologia e as outras dos incisos citados vão do Anexo III para o V.',
      'Título: A conta, numa linha. Uma fração: folha dos 12 meses sobre receita bruta dos 12 meses. Texto: com 28% ou mais, Anexo III; abaixo de 28%, Anexo V, para as atividades que a lei sujeita ao fator R.',
      'Fecho: a logo da Heild com o I em forma de lupa. Texto: A lei, com o artigo e a data. O Consultor da Heild responde pela redação vigente na data do fato, com o trecho citado.'
    ],
    fontes: ['https://www2.camara.leg.br/legin/fed/leicom/2006/leicomplementar-123-14-dezembro-2006-548099-normaatualizada-pl.html', 'https://www2.camara.leg.br/legin/fed/leicom/2025/leicomplementar-214-16-janeiro-2025-796905-normaatualizada-pl.html']
  });

  P.push({
    id: '06', tipo: 'estatico', tema: 'escuro', serie: 'Do inteiro', pilar: 'O inteiro',
    slides: [{ l: 'citacao', texto: '“Um é o todo, fonte de tudo e remate de tudo: se o todo não contivesse o todo, não seria nada.”', tam: 30,
      quem: 'Julius Evola, *A tradição hermética* (1931), cap. 4, sobre a fórmula da Crisopeia de Cleópatra. Tradução nossa, da edição inglesa de 1995.' }],
    legenda: 'Um, o todo.\n\nA fórmula está na Crisopeia de Cleópatra, um códice alquímico guardado em Veneza: uma serpente que morde a própria cauda em volta de três palavras gregas, hen to pan, um o todo. Julius Evola leu ali o primeiro princípio do ensinamento hermético: a unidade.\n\nA Heild nasceu da mesma ideia, num lugar bem menos místico: o escritório inteiro num sistema só.\n\nA citação: Julius Evola, A tradição hermética (1931), cap. 4. Tradução nossa, a partir da edição inglesa (Inner Traditions, 1995).',
    hashtags: ['#Heild', '#Filosofia', '#Alquimia'],
    alt: ['Fundo escuro com grade de pontos. Citação em itálico grande: Um é o todo, fonte de tudo e remate de tudo: se o todo não contivesse o todo, não seria nada. Abaixo: Julius Evola, A tradição hermética, 1931, capítulo 4, sobre a fórmula da Crisopeia de Cleópatra. Tradução nossa. A logo da Heild no pé.']
  });

  P.push({
    id: '07', titulo: 'Toda a sua operação num sistema só', grupo: 'reels', tipo: 'reels', formato: 'reels', tema: 'claro', serie: 'Reels', pilar: 'Como funciona',
    video: 'O anúncio em vídeo (apresentacoes/anuncio/, feito em outra frente). Publicar quando o vídeo estiver pronto.',
    slides: [{ l: 'livre', html:
      '<div class="area" style="justify-content:center;align-items:flex-start;gap:16px">' +
      '<div style="height:150px;display:flex;align-items:center">' + logo(250, 'centralizar') + '</div>' +
      '<h1 class="t-hero g" style="max-width:320px">Toda a sua operação num sistema só.</h1>' +
      '<p class="t-sub" style="max-width:300px">O anúncio da Heild.</p></div>', semPe: true }],
    legenda: 'Toda a sua operação num sistema só.\n\nA Heild junta as ferramentas da sua empresa num lugar só, com um time de integrantes de IA, um para cada área. Eles preparam o trabalho; uma pessoa aprova.\n\nA demonstração está no site, com o link na bio.',
    hashtags: ['#EscritorioContabil', '#BPOFinanceiro', '#Contabilidade'],
    alt: ['Capa do Reel em fundo claro: a logo da Heild com o I em forma de grade de nove pontos e o título Toda a sua operação num sistema só. Abaixo: O anúncio da Heild.']
  });

  var ANTES = [
    ['Os prazos', 'Num sistema de tarefas, à parte de tudo.', 'Na aba de cada setor, com o calendário do cliente.', 'fiscal'],
    ['As conversas', 'No WhatsApp do celular de alguém.', 'No fio do cliente, ligadas ao cadastro.', 'atendimento'],
    ['As horas', 'Numa planilha preenchida no fim do mês.', 'Registradas sozinhas; a pessoa só confirma.', 'financeiro'],
    ['O que sai do escritório', 'Por mensagem, sem saber quem liberou.', 'Num cartão, com o nome de quem aprovou.', 'assistente']
  ];
  P.push({
    id: '08', tipo: 'carrossel', desenho: 'Antes e depois', tema: 'escuro', serie: 'Antes e depois', pilar: 'Como funciona',
    slides: [{ l: 'capa', forma: 'painel', formaTopo: '33%', titulo: 'Onde está cada coisa?', sub: 'Quatro perguntas de todo escritório, antes e na Heild.' }]
      .concat(ANTES.map(function (a) { return { l: 'antesDepois', assunto: a[0], antes: a[1], depois: a[2], quem: a[3] }; }))
      .concat([{ l: 'fecho', forma: 'painel', frase: 'Um sistema, um fato.', sub: 'O que acontece num módulo aparece em todos os outros, sem digitar duas vezes.' }]),
    legenda: 'Onde está cada coisa?\n\nOs prazos: antes, num sistema de tarefas à parte. Na Heild, na aba de cada setor, com o calendário do cliente.\nAs conversas: antes, no WhatsApp do celular de alguém. Na Heild, no fio do cliente, ligadas ao cadastro.\nAs horas: antes, numa planilha no fim do mês. Na Heild, registradas sozinhas; a pessoa só confirma.\nO que sai do escritório: antes, por mensagem. Na Heild, num cartão, com o nome de quem aprovou.\n\nUm sistema, um fato: o que acontece num módulo aparece em todos os outros.',
    hashtags: ['#EscritorioContabil', '#GestaoContabil', '#Produtividade'],
    alt: ['Fundo escuro. No alto, a logo da Heild com o I em forma de painel. Título: Onde está cada coisa? Quatro perguntas de todo escritório, antes e na Heild.']
      .concat(ANTES.map(function (a) { return a[0] + '. Faixa de cima, Antes: ' + a[1] + ' Faixa de baixo, Na Heild: ' + a[2]; }))
      .concat(['Fecho: a logo da Heild com o I em forma de painel. Texto: Um sistema, um fato. O que acontece num módulo aparece em todos os outros, sem digitar duas vezes.'])
  });

  P.push({
    id: '09', titulo: 'O cartão de aprovação', tipo: 'estatico', tema: 'claro', serie: 'Como funciona', pilar: 'Como funciona',
    slides: [{ l: 'livre', chao: 'gradiente', html:
      '<div class="area" style="gap:16px;padding-bottom:40px">' +
      '<h2 class="t-hero" style="max-width:330px">O cartão de aprovação.</h2>' +
      '<p class="t-sub" style="max-width:320px">Transmitir, pagar, assinar e enviar ao cliente sempre passam por ele.</p>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px">' +
      HP.cartaoAprovacao({ quem: 'fiscal', estado: 'pede a sua aprovação · expira em 2 dias', titulo: 'Transmitir o PGDAS-D de outubro', sub: '14 clientes do Simples Nacional', campos: [['Competência', '10/2026'], ['Total de DAS', 'R$ 38.402,15']] }) +
      HP.exemplo() + '</div></div>' }],
    legenda: 'O cartão de aprovação: a IA prepara, uma pessoa decide.\n\nTransmitir a declaração, liberar o pagamento, assinar o contrato, mandar a guia ao cliente: na Heild, nada disso acontece sozinho. O integrante prepara e deixa um cartão no chat, no Painel ou no celular. Quem aprovou, quando e o que foi feito depois ficam na tarefa e no histórico do cliente.\n\nO cartão da imagem é da demonstração, com dados fictícios.',
    hashtags: ['#SimplesNacional', '#EscritorioContabil', '#Contabilidade'],
    alt: ['Fundo claro em degradê. Título: O cartão de aprovação. Transmitir, pagar, assinar e enviar ao cliente sempre passam por ele. Um cartão do Fiscal, que pede a sua aprovação e expira em 2 dias: Transmitir o PGDAS-D de outubro, 14 clientes do Simples Nacional, competência 10/2026, total de DAS R$ 38.402,15, com os botões Aprovar e Ver detalhes. Marcado como exemplo da demonstração, com dados fictícios.']
  });

  var FORMAS = [
    ['centralizar', 'Centralizar', 'Uma grade de nove pontos que volta a ser uma peça só. A animação principal da marca.'],
    ['contabil', 'Contábil', 'Três barras crescentes na linha de base. Fechamento concluído.'],
    ['bpo', 'BPO', 'Duas cápsulas formam um check. Rotina entregue.'],
    ['financeiro', 'Financeiro', 'Um cifrão em zigue-zague. Cobrança e pagamentos.'],
    ['tempo', 'Tempo', 'Uma ampulheta que vira e cabe na própria caixa. Prazos e horas.'],
    ['lupa', 'Lupa', 'Uma lente com cabo, que varre. O Consultor e a busca.'],
    ['orbs', 'Orbs', 'O I vira o orb e se divide como uma célula em três. O time.']
  ];
  P.push({
    id: '10', tipo: 'carrossel', desenho: 'Vitrine da marca', tema: 'escuro', serie: 'A marca', pilar: 'Bastidores da marca',
    slides: [{ l: 'capa', forma: 'orb', formaLargura: 260, formaTopo: '34%', titulo: 'O I que vira tudo.', sub: 'A logo da Heild é modular. Arraste para ver as formas.' }]
      .concat(FORMAS.map(function (f) { return { l: 'forma', forma: f[0], nome: f[1], desc: f[2] }; }))
      .concat([{ l: 'fecho', forma: false, frase: 'Depois de cada forma, o I volta a ser uma pílula.', sub: 'A pílula é a marca. Tudo que se move sai dela e volta para ela.' }]),
    legenda: 'O I que vira tudo.\n\nA logo da Heild é HE, I e LD. H e E dividem a mesma haste, L e D dividem a mesma base, e o I fica sozinho no centro, como uma pílula. Ele se divide numa forma, as letras abrem espaço, e tudo volta ao repouso.\n\nCentralizar, Contábil, BPO, Financeiro, Tempo, Lupa, Orbs: uma forma para cada coisa que acontece no produto.\n\nNo Reel, as formas em movimento.',
    hashtags: ['#DesignDeMarca', '#Branding', '#Heild'],
    alt: ['Fundo escuro. A logo da Heild com o I virando uma esfera com dois olhos recortados. Título: O I que vira tudo. A logo da Heild é modular. Arraste para ver as formas.']
      .concat(FORMAS.map(function (f) { return 'A logo da Heild com o I parado na forma ' + f[1] + '. ' + f[2]; }))
      .concat(['Fecho: Depois de cada forma, o I volta a ser uma pílula. A pílula é a marca. Tudo que se move sai dela e volta para ela.'])
  });

  // 11: a reforma tributária em linha do tempo (preenchido com a verificação)
  P.push({
    id: '11', tipo: 'carrossel', desenho: 'Linha do tempo', tema: 'claro', serie: 'A lei, com fonte', pilar: 'A lei, com fonte', lei: true,
    slides: [
      { l: 'capa', forma: 'tempo', formaTopo: '33%', titulo: 'A reforma tributária, de 2026 a 2033.', sub: 'Quatro marcos, com o artigo de cada um.' },
      { l: 'tempo', ano: '2026', agora: true, titulo: 'CBS de 0,9% e IBS de 0,1%, em teste.', corpo: 'Compensáveis com PIS e Cofins. Quem cumpre as obrigações acessórias fica dispensado do recolhimento. As alíquotas de teste não se aplicam ao Simples Nacional.', fonte: 'ADCT, art. 125 (EC 132/2023); LC 214/2025, arts. 343, 346 e 348.' },
      { l: 'tempo', ano: '2027', titulo: 'A CBS entra; PIS e Cofins saem.', corpo: 'Começa também o Imposto Seletivo. O IBS segue em teste em 2027 e 2028: 0,05% estadual e 0,05% municipal.', fonte: 'ADCT, arts. 126 e 127; LC 214/2025, arts. 344, 409 e 542.' },
      { l: 'tempo', ano: '2029', titulo: 'ICMS e ISS diminuem ano a ano.', corpo: 'Até 2032, as alíquotas ficam em 9/10 em 2029, 8/10 em 2030, 7/10 em 2031 e 6/10 em 2032.', fonte: 'ADCT, art. 128 (EC 132/2023).' },
      { l: 'tempo', ano: '2033', titulo: 'ICMS e ISS deixam de existir.', corpo: 'Ficam a CBS e o IBS. As alíquotas de referência saem de resolução do Senado Federal.', fonte: 'ADCT, arts. 129 e 130 (EC 132/2023).' },
      { l: 'fecho', forma: 'tempo', frase: 'Cada resposta pela lei da data do fato.', sub: 'Na transição, a redação muda de ano para ano. O Consultor da Heild responde pela que vale na data.' }
    ],
    legenda: 'A reforma tributária em quatro marcos.\n\n2026: CBS de 0,9% e IBS de 0,1%, em teste, compensáveis com PIS e Cofins. Quem cumpre as obrigações acessórias fica dispensado do recolhimento, e as alíquotas de teste não se aplicam ao Simples Nacional (ADCT, art. 125; LC 214/2025, arts. 343, 346 e 348).\n\n2027: a CBS passa a ser cobrada, PIS e Cofins são extintos e começa o Imposto Seletivo. O IBS fica em 0,05% estadual e 0,05% municipal em 2027 e 2028 (ADCT, arts. 126 e 127; LC 214/2025, arts. 344, 409 e 542).\n\n2029 a 2032: ICMS e ISS caem para 9/10, 8/10, 7/10 e 6/10 das alíquotas (ADCT, art. 128).\n\n2033: ICMS e ISS são extintos (ADCT, art. 129).\n\nConferido na EC 132/2023 e na LC 214/2025, na Legislação Informatizada da Câmara dos Deputados. Post informativo; o caso concreto pede análise.',
    hashtags: ['#ReformaTributaria', '#CBS', '#IBS', '#Contabilidade'],
    alt: [
      'Fundo claro. No alto, a logo da Heild com o I em forma de ampulheta. Título: A reforma tributária, de 2026 a 2033. Quatro marcos, com o artigo de cada um.',
      'Linha do tempo. Ano 2026, marcado como o atual por um ponto índigo. Título: CBS de 0,9% e IBS de 0,1%, em teste. Texto: compensáveis com PIS e Cofins; quem cumpre as obrigações acessórias fica dispensado do recolhimento; as alíquotas de teste não se aplicam ao Simples Nacional. Fonte: ADCT, artigo 125; LC 214/2025, artigos 343, 346 e 348.',
      'Linha do tempo. Ano 2027. Título: A CBS entra; PIS e Cofins saem. Texto: começa também o Imposto Seletivo; o IBS segue em teste em 2027 e 2028, com 0,05% estadual e 0,05% municipal. Fonte: ADCT, artigos 126 e 127; LC 214/2025, artigos 344, 409 e 542.',
      'Linha do tempo. Ano 2029. Título: ICMS e ISS diminuem ano a ano. Texto: até 2032, as alíquotas ficam em 9/10 em 2029, 8/10 em 2030, 7/10 em 2031 e 6/10 em 2032. Fonte: ADCT, artigo 128.',
      'Linha do tempo, que termina aqui. Ano 2033. Título: ICMS e ISS deixam de existir. Texto: ficam a CBS e o IBS; as alíquotas de referência saem de resolução do Senado Federal. Fonte: ADCT, artigos 129 e 130.',
      'Fecho: a logo da Heild com o I em forma de ampulheta. Texto: Cada resposta pela lei da data do fato. Na transição, a redação muda de ano para ano. O Consultor da Heild responde pela que vale na data.'
    ],
    fontes: ['https://www2.camara.leg.br/legin/fed/emecon/2023/emendaconstitucional-132-20-dezembro-2023-795084-publicacaooriginal-170513-pl.html', 'https://www2.camara.leg.br/legin/fed/leicom/2025/leicomplementar-214-16-janeiro-2025-796905-normaatualizada-pl.html']
  });

  P.push({
    id: '12', tipo: 'estatico', tema: 'escuro', serie: 'Princípios', pilar: 'O inteiro',
    slides: [{ l: 'manifesto', classe: 't-leve', frase: 'Afirmação legal só com fonte conferida.', sub: 'Sem fonte, a resposta diz que não encontrou. Um dos quatro princípios do produto.' }],
    legenda: 'Afirmação legal só com fonte conferida.\n\nÉ um dos quatro princípios da Heild. O Consultor responde com o artigo, a data e o trecho citado. Quando não há base suficiente, a resposta diz que não encontrou, em vez de adivinhar.\n\nOs outros três: a IA faz e a pessoa aprova; um sistema, um fato; substituir, não somar.',
    hashtags: ['#Contabilidade', '#Tributario', '#InteligenciaArtificial'],
    alt: ['Fundo escuro com grade de pontos. Texto grande: Afirmação legal só com fonte conferida. Abaixo: Sem fonte, a resposta diz que não encontrou. Um dos quatro princípios do produto. A logo da Heild no pé.']
  });

  // 13: pergunta e resposta com o Consultor, com o caso fictício da demonstração (preenchido com a verificação)
  P.push({
    id: '13', tipo: 'carrossel', desenho: 'Pergunta e resposta', tema: 'claro', serie: 'O Consultor', pilar: 'A lei, com fonte', lei: true,
    slides: [
      { l: 'capa', orbs: ['consultor'], orbTam: 120, orbsTopo: '32%', reacao: 'thinking', titulo: 'Pergunte como a um colega.', sub: 'Uma pergunta sobre fator R ao Consultor, na demonstração da Heild.' },
      { l: 'conversa', titulo: 'A pergunta e a resposta.', msgs: [
        { minha: true, t: 'A Clínica Sorriso fica no Anexo III se optar pelo Simples em janeiro de 2027?' },
        { quem: 'consultor', t: 'Sim, se a Clínica optar pelo Simples Nacional em janeiro de 2027. Odontologia é atividade sujeita ao fator R e a folha da Clínica é 31,2% da receita dos últimos 12 meses, acima dos 28%. Com isso, ela seria tributada pelo Anexo III, e não pelo Anexo V.' }] },
      { l: 'lei', ref: 'O trecho citado na resposta.', trechoTam: 14, trecho: '“Quando a relação entre a folha de salários e a receita bruta da microempresa ou da empresa de pequeno porte for inferior a 28% (vinte e oito por cento), serão tributadas na forma do Anexo V desta Lei Complementar as atividades previstas: I - nos incisos XVI, XVIII, XIX, XX e XXI do § 5º-B deste artigo; […]”', fonte: 'LC 123/2006, art. 18, § 5º-M. O inciso XX do § 5º-B é odontologia e prótese dentária.',
        leitura: 'Com folha acima de 28%, a odontologia fica no Anexo III, onde o § 5º-B a coloca.' },
      { l: 'texto', classe: 't-titulo', titulo: 'Por que a data importa.', corpo: 'A partir de 1º/1/2027, a janela do fator R passa a ser os doze meses antecedentes ao mês anterior ao da apuração (LC 214/2025, art. 517). Uma resposta para janeiro de 2027 usa essa redação, e não a de hoje.', nota: 'A Clínica Sorriso e os 31,2% são fictícios, da demonstração.' },
      { l: 'fecho', forma: 'lupa', frase: 'Com o artigo, a data e o grau de segurança.', sub: 'Sem base suficiente, o Consultor diz que não encontrou.' }
    ],
    legenda: 'Pergunte como a um colega.\n\nNa demonstração da Heild, alguém pergunta ao Consultor se a Clínica Sorriso fica no Anexo III ao optar pelo Simples em janeiro de 2027. A resposta vem com o motivo (odontologia é atividade sujeita ao fator R, e a folha da Clínica é 31,2% da receita), o trecho da lei (LC 123/2006, art. 18, § 5º-M, com o inciso XX do § 5º-B) e a redação da data: em 2027, a janela de doze meses muda pela LC 214/2025, art. 517.\n\nA Clínica Sorriso e os números são fictícios, da demonstração. O texto da lei foi conferido na LC 123/2006 compilada, na Legislação Informatizada da Câmara.',
    hashtags: ['#FatorR', '#SimplesNacional', '#Contabilidade'],
    alt: [
      'Fundo claro com grade de pontos. O orb roxo do Consultor, grande, com os olhos para cima, pensando. Título: Pergunte como a um colega. Uma pergunta sobre fator R ao Consultor, na demonstração da Heild.',
      'Um chat de exemplo. A pessoa pergunta: A Clínica Sorriso fica no Anexo III se optar pelo Simples em janeiro de 2027? O Consultor responde: Sim; odontologia é atividade sujeita ao fator R e a folha da Clínica é 31,2% da receita dos últimos 12 meses, acima dos 28%; com isso, ela seria tributada pelo Anexo III, e não pelo Anexo V. Marcado como exemplo da demonstração, com dados fictícios.',
      'Título: O trecho citado na resposta. Trecho da LC 123/2006, art. 18, parágrafo 5º-M: quando a relação entre a folha de salários e a receita bruta for inferior a 28%, serão tributadas pelo Anexo V as atividades dos incisos XVI, XVIII, XIX, XX e XXI do parágrafo 5º-B. Nota: o inciso XX é odontologia e prótese dentária. Resumo: com folha acima de 28%, a odontologia fica no Anexo III.',
      'Título: Por que a data importa. Texto: a partir de 1º de janeiro de 2027, a janela do fator R passa a ser os doze meses antecedentes ao mês anterior ao da apuração, pela LC 214/2025, art. 517; uma resposta para janeiro de 2027 usa essa redação. Nota: a Clínica Sorriso e os 31,2% são fictícios, da demonstração.',
      'Fecho: a logo da Heild com o I em forma de lupa. Texto: Com o artigo, a data e o grau de segurança. Sem base suficiente, o Consultor diz que não encontrou.'
    ],
    fontes: ['https://www2.camara.leg.br/legin/fed/leicom/2006/leicomplementar-123-14-dezembro-2006-548099-normaatualizada-pl.html', 'https://www2.camara.leg.br/legin/fed/leicom/2025/leicomplementar-214-16-janeiro-2025-796905-normaatualizada-pl.html']
  });

  P.push({
    id: '14', titulo: 'Um pedido, o time inteiro', grupo: 'reels', tipo: 'reels', formato: 'reels', tema: 'escuro', serie: 'Reels', pilar: 'Como funciona',
    video: 'Gravação da demonstração do site: o pedido ao Assistente e o time trabalhando, de 20 a 30 segundos.',
    slides: [{ l: 'livre', html:
      '<div class="area" style="justify-content:center;gap:16px">' +
      '<div style="display:flex;gap:10px">' + ['assistente', 'contabil', 'fiscal', 'atendimento'].map(function (id) { return orb(id, 62); }).join('') + '</div>' +
      '<h1 class="t-hero g" style="max-width:320px">Um pedido, o time inteiro.</h1>' +
      '<p class="t-sub" style="max-width:300px">A demonstração, ao vivo.</p></div>', semPe: true }],
    legenda: 'Um pedido, o time inteiro.\n\nUm pedido ao Assistente, e o time trabalha em cada chat: o Contábil fecha a conciliação, passa ao Fiscal, e o fechamento chega com as guias para você aprovar.\n\nGravado na demonstração do site, com empresas fictícias.',
    hashtags: ['#EscritorioContabil', '#InteligenciaArtificial', '#Contabilidade'],
    alt: ['Capa do Reel em fundo escuro: quatro orbs lado a lado, do Assistente, do Contábil, do Fiscal e do Atendimento, e o título Um pedido, o time inteiro. A demonstração, ao vivo.']
  });

  var BPO = [['bpo_pagar', 'Montei o lote de sexta da Padaria: 4 contas, R$ 8.420.'], ['bpo_receber', 'Estou emitindo os boletos de convênio de novembro da Clínica Sorriso.'],
    ['bpo_conciliacao', 'Separei 3 lançamentos do Studio Forma para você conferir.'], ['bpo_gerencial', 'Entreguei o relatório financeiro de outubro da Clínica Sorriso.']];
  P.push({
    id: '15', tipo: 'carrossel', desenho: 'Integrante por integrante', tema: 'claro', serie: 'O time', pilar: 'O time',
    slides: [{ l: 'capa', orbs: BPO.map(function (c) { return c[0]; }), orbTam: 64, orbsTopo: '34%', titulo: 'O time da Heild BPO.', sub: 'Um integrante por função do financeiro.' }]
      .concat(BPO.map(function (c) { return { l: 'integrante', id: c[0], fala: c[1] }; }))
      .concat([{ l: 'manifesto', classe: 't-leve p', frase: 'Quem digita nunca confere.', sub: 'Como numa equipe de BPO, cada função tem o seu integrante. Um fornecedor novo é conferido por uma pessoa diferente de quem digitou.' }])
      .concat([{ l: 'fecho', forma: 'financeiro', frase: 'O financeiro dos seus clientes, num lugar só.', sub: 'O cliente aprova o lote no app. O banco só libera depois.' }]),
    legenda: 'O time da Heild BPO: um integrante por função do financeiro.\n\nContas a Pagar: monta os lotes de pagamento e confere fornecedor novo.\nContas a Receber: emite os boletos e acompanha os recebimentos.\nConciliação: concilia o extrato e separa o que precisa de uma pessoa.\nGerencial: fecha o relatório financeiro do mês de cada empresa.\n\nComo numa equipe de BPO, quem digita nunca confere. O cliente aprova o lote no app, e o banco só libera depois.\n\nAs falas são da demonstração, com empresas fictícias.',
    hashtags: ['#BPOFinanceiro', '#ContasAPagar', '#GestaoFinanceira'],
    alt: ['Fundo claro. Quatro orbs coloridos lado a lado: laranja, verde, azul-lavanda e lilás. Título: O time da Heild BPO. Um integrante por função do financeiro.']
      .concat(BPO.map(function (c) { var it = HP.I[c[0]]; return 'O orb do ' + it.nome + ', grande. Nome: ' + it.nome + '. Área: BPO. ' + it.faz + ' Fala de exemplo: ' + c[1]; }))
      .concat(['Texto grande: Quem digita nunca confere. Abaixo: como numa equipe de BPO, cada função tem o seu integrante, e um fornecedor novo é conferido por uma pessoa diferente de quem digitou.',
        'Fecho: a logo da Heild com o I em forma de cifrão. Texto: O financeiro dos seus clientes, num lugar só. O cliente aprova o lote no app. O banco só libera depois.'])
  });

  var RAIZES = [
    ['islandês moderno', 'heild', 'A totalidade, o inteiro. Cleasby e Vigfússon, em 1874, marcam a palavra como moderna.'],
    ['nórdico antigo', 'heill', 'São; inteiro. O dicionário traduz em latim: *integer*.'],
    ['inglês antigo', 'hāl', 'Inteiro, ileso, são. Dele vêm *whole*, *hale* e *heal*.'],
    ['germânico reconstruído', '*hailaz', 'Inteiro, intacto, são, e também presságio.'],
    ['indo-europeu reconstruído', '*kailo-', 'Inteiro, ileso. O asterisco quer dizer que ninguém nunca leu esta palavra: ela foi achada para trás, a partir das filhas.']
  ];
  P.push({
    id: '16', tipo: 'carrossel', desenho: 'Escada de raízes', tema: 'escuro', serie: 'Do inteiro', pilar: 'O inteiro',
    slides: [{ l: 'capa', classe: 't-hero', titulo: 'O nome, raspado até a raiz.', sub: 'Cinco palavras, mil anos para trás.', html: '<p class="t-leve g" style="position:absolute;left:var(--m);top:22%;font-style:italic">heild</p>' }]
      .concat(RAIZES.map(function (r, i) { return { l: 'raiz', lingua: r[0], palavra: r[1], sentido: r[2], degrau: i }; }))
      .concat([{ l: 'fecho', forma: 'centralizar', frase: 'Inteiro, são, ileso.', sub: 'As fontes estão no "Do inteiro", no site: Cleasby e Vigfússon (1874), Kroonen (2013), Orel (2003).' }]),
    legenda: 'O nome, raspado até a raiz.\n\nheild, islandês moderno: a totalidade.\nheill, nórdico antigo: são, inteiro.\nhāl, inglês antigo: inteiro, ileso, são; dele vêm whole, hale e heal.\n*hailaz, germânico reconstruído: inteiro, intacto, são.\n*kailo-, indo-europeu reconstruído: inteiro, ileso.\n\nO asterisco quer dizer que ninguém nunca leu a palavra: ela foi achada para trás, a partir das filhas.\n\nFontes: Cleasby e Vigfússon, An Icelandic-English Dictionary (1874); Guus Kroonen, Etymological Dictionary of Proto-Germanic (Brill, 2013); Vladimir Orel, A Handbook of Germanic Etymology (Brill, 2003).',
    hashtags: ['#Etimologia', '#Heild', '#Linguistica'],
    alt: ['Fundo escuro. A palavra heild em itálico grande no alto. Título: O nome, raspado até a raiz. Cinco palavras, mil anos para trás.']
      .concat(RAIZES.map(function (r) { return 'Em itálico grande, ' + r[1] + ', do ' + r[0] + '. ' + r[2].replace(/\*/g, ''); }))
      .concat(['Fecho: a logo da Heild com o I em forma de grade de nove pontos. Texto: Inteiro, são, ileso. As fontes estão no Do inteiro, no site.'])
  });

  P.push({
    id: '17', tipo: 'carrossel', desenho: 'Passo a passo', tema: 'claro', serie: 'Como funciona', pilar: 'Como funciona',
    slides: [
      { l: 'capa', forma: 'financeiro', formaTopo: '33%', titulo: 'O lote de sexta, do pedido ao banco.', sub: 'Como um pagamento anda na Heild BPO.' },
      { l: 'passo', num: '1', quem: ['assistente', 'bpo_pagar'], titulo: 'O pedido vai para quem faz.', exemplo: true,
        html: '<div class="painel" style="display:flex;flex-direction:column;gap:14px">' + HP.bolha('Monte o lote de pagamentos de sexta da Padaria', { minha: true }) + HP.bolha('Passei ao Contas a Pagar, que monta o lote e confere o fornecedor novo; depois o Atendimento avisa o João Batista.', { quem: 'assistente' }) + '</div>' },
      { l: 'passo', num: '2', quem: 'bpo_pagar', titulo: 'O lote é montado e o fornecedor novo, conferido.', exemplo: true, corpo: 'Por uma pessoa diferente de quem digitou.',
        html: '<div class="painel" style="display:flex;flex-direction:column;gap:14px">' + HP.linhaTime('bpo_pagar', 'Montei o lote de sexta da Padaria: 4 contas, R$ 8.420.') + HP.linhaTime('bpo_pagar', 'Conferi o fornecedor novo da Padaria com a Marina.') + '</div>' },
      { l: 'passo', num: '3', quem: 'atendimento', titulo: 'O cliente sabe na hora, no WhatsApp.', exemplo: true,
        html: '<div class="painel" style="display:flex;flex-direction:column;gap:14px">' + HP.bolha('Oi, João! O lote de pagamentos de sexta da Padaria (4 contas, R$ 8.420) está no app, em Aprovações. O banco só libera depois da sua aprovação.', { quem: 'atendimento' }) + '</div>' },
      { l: 'passo', num: '4', titulo: 'O cliente aprova pelo celular. Pagar nunca é automático.', exemplo: true,
        html: HP.cartaoAprovacao({ quem: 'bpo_pagar', estado: 'aprovado no app do cliente', titulo: 'Lote de sexta · Padaria Pão Quente', campos: [['Contas', '4'], ['Total', 'R$ 8.420,00']], aprovado: 'Aprovado por João Batista' }) },
      { l: 'fecho', forma: 'bpo', frase: 'Agora o João libera no banco.', sub: 'A decisão chega ao escritório com o nome dele.' }
    ],
    legenda: 'O lote de sexta, do pedido ao banco.\n\n1. O pedido vai para o Contas a Pagar, que monta o lote.\n2. O fornecedor novo é conferido por uma pessoa diferente de quem digitou.\n3. O Atendimento avisa o cliente no WhatsApp do contato de pagamentos.\n4. O cliente aprova pelo app. A decisão chega ao escritório com o nome dele, e o banco só libera depois.\n\nPagar nunca é automático. Padaria Pão Quente e João Batista são da demonstração, fictícios.',
    hashtags: ['#BPOFinanceiro', '#ContasAPagar', '#GestaoFinanceira'],
    alt: [
      'Fundo claro. No alto, a logo da Heild com o I em forma de cifrão. Título: O lote de sexta, do pedido ao banco. Como um pagamento anda na Heild BPO.',
      'Passo 1, com os orbs do Assistente e do Contas a Pagar. Título: O pedido vai para quem faz. Chat de exemplo: a pessoa pede o lote de pagamentos de sexta da Padaria e o Assistente responde que passou ao Contas a Pagar. Exemplo da demonstração.',
      'Passo 2. Título: O lote é montado e o fornecedor novo, conferido. Por uma pessoa diferente de quem digitou. Linhas do Contas a Pagar: montei o lote de sexta da Padaria, 4 contas, R$ 8.420; conferi o fornecedor novo com a Marina. Exemplo da demonstração.',
      'Passo 3, com o orb do Atendimento. Título: O cliente sabe na hora, no WhatsApp. Mensagem do Atendimento ao João avisando que o lote está no app, em Aprovações, e que o banco só libera depois da aprovação. Exemplo da demonstração.',
      'Passo 4. Título: O cliente aprova pelo celular. Pagar nunca é automático. Cartão do lote de sexta da Padaria Pão Quente, 4 contas, total de R$ 8.420,00, aprovado por João Batista. Exemplo da demonstração.',
      'Fecho: a logo da Heild com o I em forma de check. Texto: Agora o João libera no banco. A decisão chega ao escritório com o nome dele.'
    ]
  });

  P.push({
    id: '18', titulo: 'Um sistema, um fato', tipo: 'estatico', tema: 'escuro', serie: 'Princípios', pilar: 'Como funciona',
    slides: [{ l: 'livre', html:
      '<div class="area" style="gap:0;padding-bottom:40px">' +
      '<div style="flex:1;position:relative">' +
      ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'App do cliente'].map(function (n, i) {
        return '<span class="pilula" style="position:absolute;left:' + (24 + i * 52) + 'px;top:' + (40 + i * 46) + 'px">' + n + '</span>';
      }).join('') +
      '<div class="linha-passagem" style="left:350px;top:20px;height:250px"></div>' +
      '<div style="position:absolute;left:330px;top:262px">' + orb('assistente', 40) + '</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:12px"><h2 class="t-hero">Um sistema, um fato.</h2>' +
      '<p class="t-corpo suave" style="max-width:320px">O cadastro é um só e todo efeito vira um evento. O que acontece num lado aparece em todos os outros, sem ninguém digitar de novo.</p></div></div>' }],
    legenda: 'Um sistema, um fato.\n\nNa Heild, o cadastro é um só e todo efeito vira um evento. A aprovação do cliente aparece na fila, na conversa e no aviso do Assistente. A guia gerada aparece no Painel, no app do cliente e no histórico. Ninguém digita de novo.\n\nÉ o segundo dos quatro princípios do produto.',
    hashtags: ['#EscritorioContabil', '#GestaoContabil', '#BPOFinanceiro'],
    alt: ['Fundo escuro. Cinco pílulas em escada, Painel, CRM, Timesheet, Financeiro e App do cliente, atravessadas por uma linha tracejada que desce até o orb do Assistente. Título: Um sistema, um fato. Texto: O cadastro é um só e todo efeito vira um evento. O que acontece num lado aparece em todos os outros, sem ninguém digitar de novo.']
  });

  P.push({
    id: '19', tipo: 'estatico', tema: 'claro', serie: 'Do inteiro', pilar: 'O inteiro',
    slides: [{ l: 'citacao', luz: ['contabil', 'consultor', 'fiscal', 'dp'], forca: 0.35, tam: 26,
      texto: '“Assim como todas as coisas vieram do um, pela meditação do um, assim todas as coisas nasceram desta coisa única, por adaptação.”',
      quem: 'A Tábua de Esmeralda, atribuída a Hermes Trismegisto, na versão latina que corria na Europa desde o fim do século XII. Tradução nossa.' }],
    legenda: 'Do um, todas as coisas.\n\nA Tábua de Esmeralda é um texto curto, atribuído a Hermes Trismegisto, que a Europa leu em latim desde o fim do século XII. A segunda frase diz que todas as coisas vieram do um, por adaptação.\n\nNa Heild, a frase vira método: um cadastro só, e cada módulo nasce dele.\n\nTradução nossa, da versão latina vulgata (Steele e Singer, "The Emerald Table", 1928).',
    hashtags: ['#Heild', '#Filosofia', '#HermesTrismegisto'],
    alt: ['Fundo claro com uma faixa suave de luz nas cores dos integrantes. Citação em itálico: Assim como todas as coisas vieram do um, pela meditação do um, assim todas as coisas nasceram desta coisa única, por adaptação. Abaixo: A Tábua de Esmeralda, atribuída a Hermes Trismegisto, na versão latina que corria na Europa desde o fim do século XII. Tradução nossa.']
  });

  P.push({
    id: '20', titulo: 'O cliente resolve pelo celular', tipo: 'estatico', tema: 'escuro', serie: 'Como funciona', pilar: 'Como funciona',
    slides: [{ l: 'livre', chao: 'gradiente', html:
      '<div class="area" style="gap:16px;padding-bottom:40px">' +
      '<h2 class="t-hero" style="max-width:330px">O cliente resolve pelo celular.</h2>' +
      '<p class="t-sub" style="max-width:320px">Documentos, pendências, guias e a conversa com o escritório, no app com a marca do escritório.</p>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px">' +
      '<div class="cartao elevado" style="display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:var(--raio-campo)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between"><span class="t-enfase">Pendências</span><span class="selo" style="--c:var(--atencao)">' + HP.icone('relogio') + 'aguard. você</span></div>' +
      '<hr class="divisoria"><div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:15px;line-height:20px">Pendência: extrato de outubro do Itaú</span><span class="t-rotulo">Pedido pelo Atendimento · Metalúrgica Andrade</span></div>' +
      '<div style="display:flex;gap:8px"><span class="botao">Enviar o extrato</span></div></div>' +
      HP.exemplo() + '</div></div>' }],
    legenda: 'O cliente resolve pelo celular.\n\nNo app do cliente, com a marca do escritório: documentos, pendências, guias e a conversa com o escritório no mesmo fio do WhatsApp. Abrir ou baixar fica registrado do lado de cá.\n\nA pendência da imagem é da demonstração, com dados fictícios.',
    hashtags: ['#EscritorioContabil', '#AppDoCliente', '#Contabilidade'],
    alt: ['Fundo escuro em degradê. Título: O cliente resolve pelo celular. Texto: Documentos, pendências, guias e a conversa com o escritório, no app com a marca do escritório. Um cartão de Pendências, com o selo aguardando você: Pendência, extrato de outubro do Itaú, pedido pelo Atendimento, Metalúrgica Andrade, com o botão Enviar o extrato. Exemplo da demonstração, com dados fictícios.']
  });

  P.push({
    id: '21', titulo: 'A logo que se transforma', grupo: 'reels', tipo: 'reels', formato: 'reels', tema: 'claro', serie: 'Reels', pilar: 'Bastidores da marca',
    video: 'A logo em movimento: o <heild-logo> com animation="cycle" gravado em tela, 1080 × 1920, uns 30 segundos, com as formas do post 10.',
    slides: [{ l: 'livre', html:
      '<div class="area" style="justify-content:center;gap:16px">' +
      '<div style="height:150px;display:flex;align-items:center">' + logo(260, 'orbs') + '</div>' +
      '<h1 class="t-hero g" style="max-width:320px">A logo que se transforma.</h1>' +
      '<p class="t-sub" style="max-width:300px">As formas do I, em movimento.</p></div>', semPe: true }],
    legenda: 'A logo que se transforma.\n\nO I da Heild se divide em cápsulas, vira uma forma e volta a ser uma pílula. Contração, divisão em cascata, pausa e retorno, com um leve assentamento.\n\nAs formas paradas estão no carrossel "O I que vira tudo".',
    hashtags: ['#DesignDeMarca', '#MotionDesign', '#Heild'],
    alt: ['Capa do Reel em fundo claro: a logo da Heild com o I dividido em três orbs com olhos, e o título A logo que se transforma. As formas do I, em movimento.']
  });

  /* ---------- perfil ---------- */
  var perfil = [];
  perfil.push({
    id: 'perfil-foto', grupo: 'perfil', tipo: 'perfil', formato: 'quadrado', tema: 'escuro', serie: 'Perfil',
    slides: [{ l: 'livre', chao: 'nenhum', semPe: true, html: '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span class="pilula-marca" style="height:58%"></span></div>' }],
    legenda: 'Foto do perfil (Instagram e Facebook): a pílula do I sobre areia escura. Envie em 1080 × 1080; as redes recortam em círculo.',
    alt: ['A pílula do I da logo da Heild, em areia clara, sobre fundo areia escuro.']
  });
  perfil.push({
    id: 'perfil-foto-claro', grupo: 'perfil', tipo: 'perfil', formato: 'quadrado', tema: 'claro', serie: 'Perfil',
    slides: [{ l: 'livre', chao: 'nenhum', semPe: true, html: '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span class="pilula-marca" style="height:58%"></span></div>' }],
    legenda: 'Variação clara da foto do perfil, para o Facebook ou para datas em que a grade pedir. A principal é a escura.',
    alt: ['A pílula do I da logo da Heild, em areia escura, sobre fundo areia claro.']
  });
  perfil.push({
    id: 'perfil-capa-facebook', grupo: 'perfil', tipo: 'perfil', formato: 'capa-fb', tema: 'claro', serie: 'Perfil',
    slides: [{ l: 'livre', semPe: true, html: luz(HP.TODOS, { y: '52%', faixa: 300, forca: 0.45 }) +
      '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">' + logo(96, 'centralizar') +
      '<p style="font-size:9px;line-height:12px;color:var(--texto);margin:0">Tudo, num lugar só.</p></div>' }],
    legenda: 'Capa do Facebook, 1702 × 630 (o dobro do recomendado pela Meta, 851 × 315). A logo e a frase ficam no centro, dentro dos 560 × 315 que aparecem no computador e no celular.',
    alt: ['Capa clara com uma faixa de luz nas cores dos integrantes da Heild. No centro, a logo da Heild com o I em forma de grade de nove pontos e a frase Tudo, num lugar só.']
  });
  var DESTAQUES = [['destaque-o-que-e', 'O que é', 'marca'], ['destaque-time', 'O time', 'assistente'], ['destaque-a-lei', 'A lei', 'consultor'],
    ['destaque-contabil', 'Contábil', 'contabil'], ['destaque-bpo', 'BPO', 'bpo_conciliacao']];
  DESTAQUES.forEach(function (d) {
    var meio = d[2] === 'marca' ? '<span class="pilula-marca" style="height:150px"></span>' : orb(d[2], 150);
    perfil.push({
      id: d[0], grupo: 'perfil', tipo: 'destaque', formato: 'stories', tema: 'claro', serie: 'Destaques',
      slides: [{ l: 'livre', chao: 'nenhum', semPe: true, html: '<div style="position:absolute;inset:0;background:var(--rebaixada)"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">' + meio + '</div>' }],
      legenda: 'Capa do destaque "' + d[1] + '". O ícone fica no círculo central de 720 px; o nome vai no campo do Instagram, não na imagem.',
      alt: ['Capa do destaque ' + d[1] + ': ' + (d[2] === 'marca' ? 'a pílula do I da logo da Heild' : 'o orb do ' + HP.I[d[2]].nome) + ' no centro, sobre areia clara.']
    });
  });

  /* ---------- stories (modelos) ---------- */
  var stories = [];
  stories.push({
    id: 'story-post-novo', grupo: 'stories', tipo: 'story', formato: 'stories', tema: 'claro', serie: 'Stories',
    slides: [{ l: 'livre', semPe: true, html:
      '<div class="area" style="gap:18px;justify-content:center">' +
      '<h2 class="t-hero">Post novo no perfil.</h2>' +
      '<div style="aspect-ratio:3/4;width:72%;align-self:center;border-radius:var(--raio-campo);background:var(--rebaixada);box-shadow:var(--sombra-trilho);display:flex;align-items:center;justify-content:center"><span class="t-rotulo">Área do post compartilhado (3:4)</span></div>' +
      '<p class="t-sub">Toque para ver o carrossel inteiro.</p></div>' +
      '<div class="pe" style="bottom:128px">' + logo(80) + '</div>' }],
    legenda: 'Modelo: aviso de post novo. Compartilhe o post do feed por cima da área marcada (o Instagram põe o post como figurinha). A área marcada sai na versão final, coberta pelo post.',
    alt: ['Modelo de Story em fundo claro: título Post novo no perfil, uma área 3:4 para o post compartilhado e o texto Toque para ver o carrossel inteiro.']
  });
  stories.push({
    id: 'story-prazo', grupo: 'stories', tipo: 'story', formato: 'stories', tema: 'escuro', serie: 'Stories', lei: true,
    slides: [{ l: 'livre', semPe: true, html:
      '<div class="area" style="gap:16px;justify-content:center">' +
      '<span class="t-leve g num">Dia 20</span>' +
      '<h2 class="t-hero">Vence o FGTS Digital.</h2>' +
      '<p class="t-sub">A guia do mês anterior. Se o dia 20 não for útil, o vencimento antecipa. Lei nº 8.036/1990, art. 15.</p></div>' +
      '<div class="pe" style="bottom:128px">' + logo(80) + '</div>' }],
    legenda: 'Modelo: prazo da semana. Uma data, uma obrigação e a fonte. Use só prazos conferidos na lei (ver o checklist).',
    alt: ['Story em fundo escuro: Dia 20 em grande, o título Vence o FGTS Digital e o texto A guia do mês anterior. Se o dia 20 não for útil, o vencimento antecipa. Lei nº 8.036/1990, artigo 15.']
  });
  stories.push({
    id: 'story-pergunta', grupo: 'stories', tipo: 'story', formato: 'stories', tema: 'claro', serie: 'Stories',
    slides: [{ l: 'livre', semPe: true, html:
      '<div class="area" style="gap:18px;justify-content:center">' + orb('consultor', 84) +
      '<h2 class="t-hero">Qual dúvida sobre a reforma tributária você quer ver aqui?</h2>' +
      '<div style="height:120px;border-radius:var(--raio-campo);border:1.5px dashed var(--texto-suave);display:flex;align-items:center;justify-content:center"><span class="t-rotulo">Área da caixinha de perguntas</span></div>' +
      '<p class="t-sub">Respondemos com o artigo e a fonte.</p></div>' +
      '<div class="pe" style="bottom:128px">' + logo(80) + '</div>' }],
    legenda: 'Modelo: caixinha de perguntas. A figurinha de perguntas do Instagram vai sobre a área tracejada. Responda só com fonte conferida.',
    alt: ['Modelo de Story em fundo claro com o orb roxo do Consultor: Qual dúvida sobre a reforma tributária você quer ver aqui? Uma área tracejada para a caixinha de perguntas e o texto Respondemos com o artigo e a fonte.']
  });
  stories.push({
    id: 'story-marca', grupo: 'stories', tipo: 'story', formato: 'stories', tema: 'escuro', serie: 'Stories',
    slides: [{ l: 'livre', semPe: true, html:
      '<div class="area" style="gap:22px;justify-content:center;align-items:center;text-align:center">' + logo(280, 'tempo') +
      '<h2 class="t-titulo">Hoje o I virou uma ampulheta.</h2>' +
      '<p class="t-sub">É a forma dos prazos e das horas.</p></div>' }],
    legenda: 'Modelo: bastidor da marca. Uma forma do I por story, com o que ela quer dizer. Troque a forma (tempo, contabil, bpo, lupa…).',
    alt: ['Story em fundo escuro: a logo da Heild com o I em forma de ampulheta, o título Hoje o I virou uma ampulheta e o texto É a forma dos prazos e das horas.']
  });
  stories.push({
    id: 'story-demonstracao', grupo: 'stories', tipo: 'story', formato: 'stories', tema: 'claro', serie: 'Stories',
    slides: [{ l: 'livre', semPe: true, html: luz(LUZ_TIME, { y: '34%', faixa: 300, forca: 0.5 }) +
      '<div class="area" style="gap:18px;justify-content:flex-end;padding-bottom:40px">' +
      '<h2 class="t-hero g">Veja a Heild trabalhando.</h2>' +
      '<p class="t-sub">A demonstração roda no site, com empresas fictícias.</p>' +
      '<div style="height:56px;border-radius:var(--raio-pilula);border:1.5px dashed var(--texto-suave);display:flex;align-items:center;justify-content:center"><span class="t-rotulo">Área da figurinha de link</span></div></div>' +
      '<div class="pe" style="bottom:128px;justify-content:center"></div>' }],
    legenda: 'Modelo: convite para a demonstração. A figurinha de link vai na área tracejada.',
    alt: ['Story em fundo claro com uma faixa de luz nas cores dos integrantes: Veja a Heild trabalhando. A demonstração roda no site, com empresas fictícias. Uma área tracejada para a figurinha de link.']
  });

  /* ---------- capas de Reels (as três do feed já são as capas; aqui ficam as versões só da capa) ---------- */

  window.HEILD_POSTS = P.concat(perfil, stories);
  window.HEILD_DESTAQUES = DESTAQUES;
})();
