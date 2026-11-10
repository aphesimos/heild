/*
 * As peças dos posts da Heild: os integrantes, a logo, o orb e os desenhos de slide.
 *
 * Cada post (posts.js) é um objeto { id, tipo, formato, tema, serie, slides: [...], legenda, hashtags, alt: [...] }.
 * Cada slide é { l: 'nome do desenho', ...dados }. Os desenhos estão em DESENHOS, abaixo; o render chama
 * HP.montar(id, n) para pôr um quadro no palco e espera as fontes, os orbs e a logo.
 *
 * Regras (design-system/README.md): logo sempre <heild-logo>, estática ou parada numa forma do I; cor dos
 * integrantes só no orb, nos marcadores e na luz; índigo só em pontos pequenos; sem caixa alta, sem rótulo acima do
 * título, sem emoji, sem texto em gradiente. Nada inventado: o produto aparece com os dados fictícios da
 * demonstração, sempre com a marca "Exemplo da demonstração".
 */
(function () {
  'use strict';

  var Z = 1080 / 390; // pontos de celular → pixels do arquivo

  /* ---------- os integrantes (design-system/orbs.md) ---------- */
  var I = {
    assistente: { nome: 'Assistente', cor: '--orb-assistente', olho: '--olho-assistente', area: 'Todas as áreas', faz: 'Recebe qualquer pedido, divide entre o time e acompanha até o fim.' },
    consultor: { nome: 'Consultor', cor: '--orb-consultor', area: 'Lei e reforma', faz: 'Responde sobre a lei com o artigo, a data e o grau de segurança.' },
    atendimento: { nome: 'Atendimento', cor: '--orb-atendimento', area: 'Todas as áreas', faz: 'Fala com o cliente no WhatsApp, cobra documentos e tria as conversas.' },
    financeiro: { nome: 'Financeiro', cor: '--orb-financeiro', area: 'O financeiro do escritório', faz: 'Prepara as cobranças, os contratos e as contas do próprio escritório.' },
    fiscal: { nome: 'Fiscal', cor: '--orb-fiscal', area: 'Contábil', faz: 'Apura os tributos, gera as guias e prepara as transmissões.' },
    dp: { nome: 'DP', cor: '--orb-dp', area: 'Contábil', faz: 'Prepara admissões, a folha e os envios ao eSocial.' },
    contabil: { nome: 'Contábil', cor: '--orb-contabil', area: 'Contábil', faz: 'Concilia, classifica e fecha o mês com o balancete.' },
    societario: { nome: 'Societário', cor: '--orb-societario', area: 'Contábil', faz: 'Cuida do cadastro na Receita, dos certificados e das exigências da Junta.' },
    notas: { nome: 'Notas', cor: '--orb-notas', area: 'Contábil', faz: 'Captura as notas do mês e confere a tributação.' },
    bpo_pagar: { nome: 'Contas a Pagar', cor: '--orb-bpo-pagar', area: 'BPO', faz: 'Monta os lotes de pagamento e confere fornecedor novo.' },
    bpo_receber: { nome: 'Contas a Receber', cor: '--orb-bpo-receber', area: 'BPO', faz: 'Emite os boletos e acompanha os recebimentos de cada empresa.' },
    bpo_conciliacao: { nome: 'Conciliação', cor: '--orb-bpo-conciliacao', area: 'BPO', faz: 'Concilia o extrato e separa o que precisa de uma pessoa.' },
    bpo_gerencial: { nome: 'Gerencial', cor: '--orb-bpo-gerencial', area: 'BPO', faz: 'Fecha o relatório financeiro do mês de cada empresa.' }
  };
  var TODOS = ['consultor', 'fiscal', 'dp', 'contabil', 'societario', 'notas', 'atendimento', 'financeiro', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'];

  /* ---------- utilidades ---------- */
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // texto com ênfase leve: *assim* vira <em> (itálico só em citação e nome de obra; quem chama decide)
  function rico(s) { return h(s).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>'); }
  function px(v) { return v + 'px'; }

  /* A logo: sempre o componente. `forma` para o I parado numa forma (morph com movimento reduzido). */
  // Quanto HE e LD se afastam, em fração da largura, com o I parado na forma (medido no componente; o mesmo de
  // apresentacoes/diretrizes/src/comum.js). Vira margem dos dois lados, para as letras não saírem do quadro.
  var AFASTA = { centralizar: .075, contabil: .075, juridico: .069, bpo: .083, ia: .079, atendimento: .075, orb: .095, tempo: .075, arquivos: .115, conversa: .115, financeiro: .115, celular: .067, painel: .075, lupa: .088, equipe: .168, orbs: .184 };
  function logo(largura, forma, extra) {
    var m = forma ? Math.round(largura * (AFASTA[forma] || 0.1)) : 0;
    return '<heild-logo label="Heild"' + (forma ? ' data-forma="' + forma + '"' : '') + ' style="width:' + px(largura) + ';margin:0 ' + px(m) + ';color:var(--primaria);display:block;flex:none;' + (extra || '') + '"></heild-logo>';
  }
  /* O orb de um integrante, parado. Desenhado no tamanho real do arquivo (sem zoom) para o canvas sair nítido. */
  function orb(id, tam, reacao, extra) {
    var it = I[id] || I.assistente;
    return '<span class="orb" style="width:' + px(tam) + ';height:' + px(tam) + ';' + (extra || '') + '"><orb-avatar data-cor="' + it.cor + '"' +
      (it.olho ? ' data-olho="' + it.olho + '"' : '') + ' size="' + Math.round(tam * Z) + '" static extras="off"' +
      (reacao ? ' reaction="' + reacao + '"' : '') + ' label="' + h(it.nome) + '" style="zoom:' + (1 / Z) + '"></orb-avatar></span>';
  }
  function icone(nome) {
    var p = {
      check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      relogio: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
      seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      mais: '<path d="M12 5v14M5 12h14"/>'
    }[nome] || '';
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  /* A luz: uma mancha por integrante, espalhada numa faixa (estado final da luz do site, parada). */
  function luz(ids, o) {
    o = o || {};
    var n = ids.length, faixa = o.faixa || 340;
    return '<div class="luz" aria-hidden="true" style="--y:' + (o.y || '50%') + ';--forca:' + (o.forca || 0.55) + '">' + ids.map(function (id, i) {
      var x = (n === 1 ? 0 : (i / (n - 1) - 0.5) * faixa), dy = Math.sin(i * 2.3) * 10, s = 0.85 + 0.15 * Math.sin(i * 1.1);
      return '<span class="mancha" style="--c:var(' + I[id].cor + ');--x:' + x.toFixed(1) + 'px;--dy:' + dy.toFixed(1) + 'px;--s:' + s.toFixed(2) + '"></span>';
    }).join('') + '<span class="nucleo"></span></div>';
  }
  function chao(tipo) { return tipo === 'nenhum' ? '' : '<div class="chao-' + (tipo || 'pontos') + '"></div>'; }

  /* O pé de cada quadro: a logo na capa e no fim; nos do meio, a série e o contador. */
  function pe(ctx, o) {
    o = o || {};
    var esq = (ctx.capa || ctx.fim || o.logo) && o.logo !== false ? logo(80) : '<span class="serie">' + h(ctx.post.serie || '') + '</span>';
    var dir = ctx.n > 1 ? '<span class="contador num">' + (ctx.i + 1) + ' de ' + ctx.n + '</span>' : (o.dir || '');
    return '<div class="pe">' + esq + dir + '</div>';
  }
  function exemplo(t) { return '<span class="exemplo">' + h(t || 'Exemplo da demonstração, com dados fictícios') + '</span>'; }

  /* ---------- peças de produto (com os dados da demonstração) ---------- */
  function cartaoAprovacao(c) {
    return '<div class="cartao elevado" style="display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:var(--raio-campo);' + (c.estilo || '') + '">' +
      '<div style="display:flex;align-items:center;gap:10px">' + orb(c.quem, 32) + '<div><div class="t-enfase" style="font-size:14px;line-height:18px">' + h(I[c.quem].nome) + '</div><div class="t-rotulo">' + h(c.estado) + '</div></div></div>' +
      '<div><div style="font-family:var(--font-titulo);font-size:22px;line-height:26px;font-weight:300;letter-spacing:-0.025em">' + h(c.titulo) + '</div>' +
      (c.sub ? '<div class="t-rotulo" style="margin-top:4px;font-size:13px">' + h(c.sub) + '</div>' : '') + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + (c.campos || []).map(function (f) {
        return '<div><div class="t-rotulo">' + h(f[0]) + '</div><div class="num" style="font-size:15px;line-height:20px;font-weight:500;margin-top:2px">' + h(f[1]) + '</div></div>';
      }).join('') + '</div>' +
      (c.aprovado ? '<div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--sucesso-texto)">' + icone('check') + h(c.aprovado) + '</div>'
        : '<div style="display:flex;gap:8px">' + '<span class="botao">Aprovar</span><span class="botao sec">Ver detalhes</span></div>') +
      '</div>';
  }
  function bolha(texto, o) {
    o = o || {};
    if (o.minha) return '<div style="align-self:flex-end;max-width:78%;padding:10px 14px;border-radius:18px 18px 6px 18px;background:var(--primaria);color:var(--texto-sobre-primaria);font-size:14px;line-height:20px">' + rico(texto) + '</div>';
    return '<div style="display:flex;gap:10px;align-items:flex-start;max-width:94%">' + orb(o.quem || 'assistente', 28) +
      '<div style="display:flex;flex-direction:column;gap:4px"><span class="t-enfase" style="font-size:13px;line-height:18px;font-weight:600">' + h(I[o.quem || 'assistente'].nome) + '</span>' +
      '<div style="font-size:14px;line-height:22px">' + rico(texto) + '</div></div></div>';
  }
  function linhaTime(id, texto) {
    return '<div style="display:flex;align-items:center;gap:10px">' + orb(id, 26) + '<div style="font-size:13px;line-height:18px"><span style="font-weight:500">' + h(I[id].nome) + '</span> <span class="suave">' + h(texto) + '</span></div></div>';
  }

  /* ---------- os desenhos de slide ---------- */
  var D = {};

  // Capa: o título manda. Visual opcional em cima (orb, logo numa forma, luz, camadas); título embaixo, à esquerda.
  D.capa = function (s, ctx) {
    var vis = '';
    if (s.luz) vis += luz(s.luz, { y: s.luzY || '38%', forca: s.forca });
    if (s.forma) vis += '<div style="position:absolute;left:0;right:0;top:' + (s.formaTopo || '34%') + ';display:flex;justify-content:center;transform:translateY(-50%)">' + logo(s.formaLargura || 230, s.forma) + '</div>';
    if (s.orbs) vis += '<div style="position:absolute;left:var(--m);right:var(--m);top:' + (s.orbsTopo || '30%') + ';display:flex;justify-content:' + (s.orbsAlinha || 'flex-start') + ';gap:' + px(s.orbsGap || 10) + ';transform:translateY(-50%);flex-wrap:wrap">' + s.orbs.map(function (id) { return orb(id, s.orbTam || 56, s.reacao); }).join('') + '</div>';
    if (s.html) vis += s.html;
    return chao(s.chao) + vis +
      '<div class="area" style="justify-content:' + (s.topo ? 'flex-start' : 'flex-end') + ';padding-bottom:' + (s.topo ? 0 : 52) + 'px;gap:12px">' +
      '<h1 class="' + (s.classe || 't-hero') + '" style="max-width:' + px(s.larg || 342) + '">' + rico(s.titulo) + '</h1>' +
      (s.sub ? '<p class="t-sub" style="max-width:300px">' + rico(s.sub) + '</p>' : '') + '</div>' + pe(ctx);
  };

  // Manifesto: uma frase por slide, leve e grande, no meio do quadro.
  D.manifesto = function (s, ctx) {
    return chao(s.chao) + (s.luz ? luz(s.luz, { y: '50%', forca: s.forca }) : '') +
      '<div class="area" style="justify-content:center;gap:16px">' +
      '<p class="' + (s.classe || 't-leve') + '" style="max-width:' + px(s.larg || 330) + '">' + rico(s.frase) + '</p>' +
      (s.sub ? '<p class="t-sub" style="max-width:300px">' + rico(s.sub) + '</p>' : '') + '</div>' + pe(ctx);
  };

  // Texto: título e um corpo curto, com lista opcional de pontos (marcador índigo pequeno).
  D.texto = function (s, ctx) {
    var lista = (s.itens || []).map(function (it) {
      return '<li style="display:flex;gap:12px;align-items:baseline"><span class="ponto-destaque" style="transform:translateY(-2px)"></span><span><span class="t-enfase">' + rico(it[0]) + '</span>' + (it[1] ? '<br><span class="suave">' + rico(it[1]) + '</span>' : '') + '</span></li>';
    }).join('');
    return chao(s.chao) + (s.orb ? '<div style="position:absolute;right:var(--m);top:var(--m)">' + orb(s.orb, s.orbTam || 48, s.reacao) + '</div>' : '') +
      '<div class="area" style="justify-content:' + (s.alinha || 'center') + ';gap:18px;padding-bottom:40px">' +
      (s.titulo ? '<h2 class="' + (s.classe || 't-titulo') + '" style="max-width:' + px(s.larg || 330) + '">' + rico(s.titulo) + '</h2>' : '') +
      (s.corpo ? '<p class="t-corpo" style="max-width:320px">' + rico(s.corpo) + '</p>' : '') +
      (lista ? '<ul style="list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:14px;max-width:330px">' + lista + '</ul>' : '') +
      (s.nota ? '<p class="t-rotulo" style="max-width:320px">' + rico(s.nota) + '</p>' : '') +
      (s.html || '') + '</div>' + pe(ctx);
  };

  // Integrante por integrante: o orb grande, o nome, a área, o que faz e uma fala dele na primeira pessoa.
  D.integrante = function (s, ctx) {
    var it = I[s.id];
    return chao(s.chao) +
      '<div class="area" style="gap:0">' +
      '<div style="flex:1;display:flex;align-items:center;justify-content:center">' + orb(s.id, 170, s.reacao) + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;padding-bottom:44px">' +
      '<div style="display:flex;align-items:center;gap:8px"><span class="marcador" style="--c:var(' + it.cor + ')"></span><span class="t-rotulo">' + h(s.area || it.area) + '</span></div>' +
      '<h2 class="t-hero">' + h(it.nome) + '</h2>' +
      '<p class="t-corpo" style="max-width:320px">' + rico(s.faz || it.faz) + '</p>' +
      (s.fala ? '<p class="t-cita suave" style="max-width:320px">“' + rico(s.fala) + '”</p>' : '') +
      '</div></div>' + pe(ctx);
  };

  // A lei: a referência como título, o trecho em itálico numa faixa rebaixada e a leitura em uma frase.
  D.lei = function (s, ctx) {
    return chao(s.chao) + '<div class="area" style="justify-content:center;gap:16px;padding-bottom:40px">' +
      '<h2 class="t-titulo" style="font-size:26px;line-height:30px;max-width:330px">' + rico(s.ref) + '</h2>' +
      '<div class="rebaixada" style="display:flex;flex-direction:column;gap:10px;padding:18px">' +
      '<p class="t-cita" style="font-size:' + (s.trechoTam || 15) + 'px;line-height:' + ((s.trechoTam || 15) + 8) + 'px">' + rico(s.trecho) + '</p>' +
      (s.fonte ? '<p class="t-rotulo">' + rico(s.fonte) + '</p>' : '') + '</div>' +
      (s.leitura ? '<p class="t-corpo" style="max-width:330px">' + rico(s.leitura) + '</p>' : '') +
      '</div>' + pe(ctx);
  };

  // Passo: o número leve e grande, o título do passo, o texto e uma peça de produto opcional.
  D.passo = function (s, ctx) {
    return chao(s.chao || 'gradiente') + '<div class="area" style="gap:14px;padding-bottom:40px">' +
      '<div style="display:flex;align-items:baseline;gap:14px"><span class="t-leve num" style="font-size:64px;line-height:60px">' + h(s.num) + '</span>' +
      (s.quem ? '<span style="display:flex;gap:6px;align-self:center">' + [].concat(s.quem).map(function (id) { return orb(id, 30); }).join('') + '</span>' : '') + '</div>' +
      '<h2 class="t-titulo" style="max-width:330px">' + rico(s.titulo) + '</h2>' +
      (s.corpo ? '<p class="t-corpo suave" style="max-width:320px">' + rico(s.corpo) + '</p>' : '') +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px">' + (s.html || '') + '</div>' +
      (s.exemplo ? exemplo() : '') + '</div>' + pe(ctx);
  };

  // Antes e depois, sem números: o mesmo assunto em duas faixas, a de antes rebaixada, a de depois em superfície.
  D.antesDepois = function (s, ctx) {
    return chao(s.chao || 'nenhum') + '<div class="area" style="gap:12px;padding-bottom:40px">' +
      '<h2 class="t-titulo" style="font-size:26px;line-height:30px">' + rico(s.assunto) + '</h2>' +
      '<div class="rebaixada" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:18px;border-radius:var(--raio-campo)">' +
      '<span class="t-rotulo">Antes</span><p class="t-leve p" style="font-size:28px;line-height:32px">' + rico(s.antes) + '</p></div>' +
      '<div class="cartao" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:18px;border-radius:var(--raio-campo);box-shadow:var(--sombra-painel)">' +
      '<span class="t-rotulo" style="display:flex;align-items:center;gap:6px">' + (s.quem ? orb(s.quem, 18) : '') + 'Na Heild</span><p class="t-leve p" style="font-size:28px;line-height:32px">' + rico(s.depois) + '</p></div>' +
      '</div>' + pe(ctx);
  };

  // Linha do tempo: o ano leve e grande sobre uma linha que atravessa os slides de ponta a ponta (a continuidade).
  D.tempo = function (s, ctx) {
    var y = 196, primeira = ctx.i === 1, ultima = ctx.i === ctx.n - 2;
    var linha = '<div style="position:absolute;top:' + y + 'px;left:' + (primeira ? 'var(--m)' : '0') + ';right:' + (ultima ? '50%' : '0') + ';height:1.5px;background:var(--texto)"></div>' +
      '<span style="position:absolute;top:' + (y - 5) + 'px;left:var(--m);width:12px;height:12px;border-radius:var(--raio-pilula);background:' + (s.agora ? 'var(--destaque)' : 'var(--texto)') + '"></span>';
    return chao(s.chao) + linha + '<div class="area" style="gap:0;padding-bottom:40px">' +
      '<div style="height:150px;display:flex;align-items:flex-end"><span class="t-leve g num">' + h(s.ano) + '</span></div>' +
      '<div style="margin-top:46px;display:flex;flex-direction:column;gap:14px">' +
      '<h2 class="t-titulo" style="max-width:330px">' + rico(s.titulo) + '</h2>' +
      '<p class="t-corpo" style="max-width:330px">' + rico(s.corpo) + '</p>' +
      (s.fonte ? '<p class="t-rotulo" style="max-width:330px">' + rico(s.fonte) + '</p>' : '') + '</div></div>' + pe(ctx);
  };

  // Uma forma do I: a logo parada na forma, o nome da forma e quando ela aparece.
  D.forma = function (s, ctx) {
    return chao(s.chao) + '<div class="area" style="gap:0;padding-bottom:40px">' +
      '<div style="flex:1;display:flex;align-items:center;justify-content:center">' + logo(250, s.forma) + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px"><h2 class="t-titulo">' + h(s.nome) + '</h2>' +
      '<p class="t-corpo suave" style="max-width:320px">' + rico(s.desc) + '</p></div></div>' + pe(ctx);
  };

  // Conversa: a pergunta da pessoa e a resposta do integrante, como no chat do produto.
  D.conversa = function (s, ctx) {
    return chao(s.chao || 'gradiente') + '<div class="area" style="gap:14px;padding-bottom:40px">' +
      (s.titulo ? '<h2 class="t-titulo" style="font-size:26px;line-height:30px;max-width:330px">' + rico(s.titulo) + '</h2>' : '') +
      '<div class="painel" style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:18px">' +
      s.msgs.map(function (m) { return bolha(m.t, m); }).join('') + (s.extra || '') + '</div>' +
      exemplo() + '</div>' + pe(ctx);
  };

  // Raiz: uma palavra em itálico (nome de língua e forma antiga), a língua e o sentido. A escada desce slide a slide.
  D.raiz = function (s, ctx) {
    var degrau = s.degrau || 0;
    return chao(s.chao) + '<div class="area" style="gap:0;padding-bottom:40px">' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;padding-left:' + (degrau * 22) + 'px">' +
      '<span class="t-rotulo">' + h(s.lingua) + '</span>' +
      '<p class="t-leve g" style="font-style:italic">' + h(s.palavra) + '</p>' +
      '<p class="t-corpo" style="max-width:' + (320 - degrau * 22) + 'px">' + rico(s.sentido) + '</p></div>' +
      (s.fonte ? '<p class="t-rotulo" style="max-width:330px">' + rico(s.fonte) + '</p>' : '') + '</div>' + pe(ctx);
  };

  // Citação: o trecho grande em itálico, quem disse e onde.
  D.citacao = function (s, ctx) {
    return chao(s.chao) + (s.luz ? luz(s.luz, { y: '50%', forca: s.forca || 0.4 }) : '') +
      '<div class="area" style="justify-content:center;gap:18px;padding-bottom:40px">' +
      '<p class="t-cita-g" style="max-width:' + px(s.larg || 330) + ';font-size:' + px(s.tam || 30) + ';line-height:' + px((s.tam || 30) + 4) + '">' + rico(s.texto) + '</p>' +
      '<p class="t-rotulo" style="max-width:320px">' + rico(s.quem) + '</p></div>' + pe(ctx);
  };

  // Panorama: um desenho só, da largura do carrossel inteiro, que cada slide mostra deslocado (as emendas casam).
  D.pano = function (s, ctx) {
    var p = ctx.post.panorama, w = 390 * ctx.n;
    return chao(s.chao || p.chao) + '<div style="position:absolute;top:0;bottom:0;left:' + (-390 * ctx.i) + 'px;width:' + w + 'px">' + p.html + '</div>' + pe(ctx, s.pe);
  };

  // Livre: html inteiro (para as peças únicas), com o chão e o pé.
  D.livre = function (s, ctx) { return chao(s.chao) + s.html + (s.semPe ? '' : pe(ctx, s.pe)); };

  // Fecho de carrossel: a logo grande, uma frase e o próximo passo (sem link clicável no post: "na bio").
  D.fecho = function (s, ctx) {
    return chao(s.chao) + (s.luz ? luz(s.luz, { y: '42%', forca: s.forca || 0.5 }) : '') +
      '<div class="area" style="align-items:center;justify-content:center;gap:22px;text-align:center;padding-bottom:30px">' +
      (s.forma === false ? '' : logo(200, s.forma)) +
      '<p class="t-titulo" style="font-size:26px;line-height:30px;max-width:300px">' + rico(s.frase || 'Tudo, num lugar só.') + '</p>' +
      (s.sub ? '<p class="t-corpo suave" style="max-width:290px">' + rico(s.sub) + '</p>' : '') + '</div>' +
      '<div class="pe" style="justify-content:center"><span class="contador num">' + (ctx.n > 1 ? (ctx.i + 1) + ' de ' + ctx.n : '') + '</span></div>';
  };

  /* ---------- montar um quadro ---------- */
  var posts = function () { return window.HEILD_POSTS || []; };
  function achar(id) { var p = posts().filter(function (x) { return x.id === id; })[0]; if (!p) throw new Error('post desconhecido: ' + id); return p; }
  var FORMATOS = { feed: [1080, 1440, ''], stories: [1080, 1920, 'stories'], reels: [1080, 1920, 'stories reels'], quadrado: [1080, 1080, 'quadrado'], 'capa-fb': [1702, 630, 'capa-fb'] };

  function quadroHtml(post, n) {
    var f = FORMATOS[post.formato || 'feed'], s = post.slides[n], tema = s.tema || post.tema;
    var ctx = { post: post, i: n, n: post.slides.length, capa: n === 0, fim: n === post.slides.length - 1 && post.slides.length > 1 };
    var corpo = D[s.l](s, ctx);
    var w = f[0] / Z;
    var ph = f[1] / Z;
    return '<div class="quadro forca-' + tema + ' ' + f[2] + '" style="zoom:' + Z + ';--pw:' + w + 'px;--ph:' + ph + 'px">' + corpo + '</div>';
  }

  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function colorir(el) {
    Array.prototype.forEach.call(el.querySelectorAll('orb-avatar[data-cor]'), function (o) {
      var cs = getComputedStyle(o), c = cs.getPropertyValue(o.dataset.cor).trim();
      if (c) o.setAttribute('color', c);
      if (o.dataset.olho) { var e = cs.getPropertyValue(o.dataset.olho).trim(); if (e) o.setAttribute('eye-color', e); }
    });
  }
  async function montar(id, n) {
    var post = achar(id), palco = document.getElementById('palco');
    palco.innerHTML = quadroHtml(post, n);
    var q = palco.firstElementChild;
    colorir(q);
    await document.fonts.ready;
    Array.prototype.forEach.call(q.querySelectorAll('heild-logo[data-forma]'), function (l) { l.morph(l.dataset.forma); });
    await esperar(120);
    colorir(q); // de novo, depois do primeiro desenho (o orb lê a cor ao montar)
    Array.prototype.forEach.call(q.querySelectorAll('orb-avatar'), function (o) { if (o._update) o._update(0, 0); });
    await esperar(80);
    var f = FORMATOS[post.formato || 'feed'];
    return { w: f[0], h: f[1] };
  }

  window.HP = { I: I, TODOS: TODOS, h: h, rico: rico, logo: logo, orb: orb, luz: luz, icone: icone, exemplo: exemplo, cartaoAprovacao: cartaoAprovacao, bolha: bolha, linhaTime: linhaTime, D: D, montar: montar, achar: achar, posts: posts, FORMATOS: FORMATOS, Z: Z };
})();
