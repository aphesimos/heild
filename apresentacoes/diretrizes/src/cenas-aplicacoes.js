/* Identidade da Heild — as aplicações reais e o fechamento. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, I = M.I, u = M.u;
  var h = u.h, q = u.q, qa = u.qa, orb = u.orb, logo = u.logo, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe;
  var LUZ = ['consultor', 'fiscal', 'dp', 'contabil', 'societario', 'notas', 'atendimento', 'financeiro', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'];

  /* ---------------- 29. No produto: o Início ---------------- */
  var PONTOS = [
    ['lateral', 'Fundo e barra lateral em gradiente de areia, do claro para o escuro da mesma camada.'],
    ['abas', 'Abas segmentadas: o trilho afunda, a aba ativa sobe com a sombra da pílula.'],
    ['pergunta', 'Uma frase por tela, no display leve: PP Neue Montreal 300.'],
    ['orb', 'O orb do Assistente, vivo: segue o cursor e reage ao clique.'],
    ['campo', 'O campo do chat em elevada, com o raio de 24 e a sombra do campo.'],
    ['limite', 'O índigo, só num ponto pequeno: a barra de limite de IA.']
  ];
  S.push({
    id: 'produto', capitulo: 'Aplicações', curto: 'No produto', grade: 'direita',
    notas: 'O Início do sistema, como no protótipo: a barra lateral e o fundo em gradiente de areia, as abas segmentadas, a frase em display leve, o orb do Assistente vivo, o campo do chat e o índigo só na barra de limite de IA. Os números passam pela tela sozinhos; passe o cursor neles.',
    html: function () {
      var tela = '<div class="tela-inicio tela-produto"><div class="ti-lat"><span class="ti-sig">' + u.he(16) + '</span><i class="at"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="ti-cont"><div class="ti-abas"><span class="at">Assistente</span><span>Time</span><span>Visão geral</span></div>' +
        '<div class="ti-pergunta">No que posso ajudar?' + orb('assistente', { tamanho: 52, modo: 'follow', vivo: true, attrs: ' idle-time="6" sleep-after="0"' }) + '</div>' +
        '<div class="ti-sug"><span>Feche outubro da Metalúrgica Andrade</span><span>Quem está aguardando documento?</span><span>Monte o lote de sexta da Padaria</span></div>' +
        '<div class="ti-campo"><span>Peça ao Assistente…</span><div class="ti-acoes"><span class="mais"></span><span class="enviar"></span></div></div>' +
        '<div class="ti-limite"><span>Limite de IA da janela de 5 horas</span><div class="barra-ia"><i></i></div></div></div>' +
        PONTOS.map(function (p, i) { return '<button type="button" class="ponto-n pn-' + p[0] + '" data-k="' + i + '" aria-label="' + h(p[1]) + '">' + (i + 1) + '</button>'; }).join('') + '</div>';
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('No produto, a marca é a superfície.') +
        '<ol class="legenda-n" data-e style="--d:420ms">' + PONTOS.map(function (p, i) { return '<li data-k="' + i + '"><span class="n tnum">' + (i + 1) + '</span><span>' + h(p[1]) + '</span></li>'; }).join('') + '</ol></div>' +
        encaixe(780, 520, '<div class="moldura-tela" data-e="zoom" style="--d:250ms">' + tela + '</div>') + '</div>';
    },
    entrar: function (el, api) {
      var ps = qa(el, '.ponto-n'), lis = qa(el, '.legenda-n li'), k = -1, sobre = false, o = q(el, '.tela-produto orb-avatar');
      function por(i) { k = i; ps.forEach(function (p, j) { p.classList.toggle('at', j === i); }); lis.forEach(function (l, j) { l.classList.toggle('at', j === i); }); }
      ps.concat(lis).forEach(function (x) {
        api.ouvir(x, 'pointerenter', function () { sobre = true; por(+x.dataset.k); });
        api.ouvir(x, 'pointerleave', function () { sobre = false; });
      });
      api.ouvir(o, 'click', function () { if (o.poke) o.poke(); });
      if (api.parado) { por(0); return; }
      api.depois(900, function () { por(0); });
      api.intervalo(function () { if (!sobre) por((k + 1) % ps.length); }, 2400);
    }
  });

  /* ---------------- 30. No site: o hero ---------------- */
  var LEGENDAS = [
    ['contabil', 'working', 'está conciliando os 214 lançamentos de outubro da Metalúrgica'],
    ['bpo_pagar', 'done', 'montou o lote de sexta da Padaria: 4 contas, R$ 8.420'],
    ['consultor', 'thinking', 'está lendo a LC 123 para o fator R da Clínica Sorriso'],
    ['dp', 'done', 'preparou os contratos de experiência da Padaria']
  ];
  S.push({
    id: 'site', capitulo: 'Aplicações', curto: 'No site', grade: 'nenhuma',
    notas: 'O hero do site, como ele é: a navegação com a logo estática, o título no estilo hero (500, -0,04em) entrando palavra por palavra, a frase, uma ação em pílula e, atrás, a luz do time se juntando numa faixa. A legenda conta o que o time acabou de fazer. Sem rótulo acima do título, sem faixa de logos, sem números de uso.',
    html: function () {
      var ls = LEGENDAS[0];
      var pagina = '<div class="pagina-site">' + u.luzHtml(['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas', 'atendimento', 'bpo_pagar'], 'luz-site') +
        '<div class="nav-site">' + logo({ estilo: 'width:92px' }) + '<nav><span>Soluções <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg></span><span>Como funciona</span><span>O time</span><span>Sobre</span><span>Perguntas</span></nav>' +
        '<span class="botao botao--pequeno-site">Agendar uma demonstração</span></div>' +
        '<div class="hero-site"><h3 class="hero-t">' + 'Toda a sua operação num sistema só.'.split(' ').map(function (p, i) { return '<span style="--i:' + i + '">' + p + '</span>'; }).join(' ') + '</h3>' +
        '<p class="hero-f">A Heild junta as ferramentas da sua empresa num lugar só, com um time de integrantes de IA, um para cada área. Eles preparam o trabalho; uma pessoa aprova.</p>' +
        '<div class="hero-acoes"><span class="botao">Agendar uma demonstração</span><span class="link-sub">Ver o time trabalhando</span></div>' +
        '<div class="legenda-site"><span class="leg">' + orb(ls[0], { tamanho: 28, reacao: ls[1], extras: false }) + '<span><b>' + h(I[ls[0]].nome) + '</b> <span class="suave t">' + h(ls[2]) + '</span></span></span></div></div></div>';
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('No site, a mesma voz para fora.') + frase('O hero diz uma ideia só, com o título no estilo hero e a luz do time atrás.', 320) + '</div>' +
        encaixe(1200, 600, pagina, 'encaixe-site') + '</div>';
    },
    entrar: function (el, api) {
      u.luz(api, el, { forca: 0.6, faixa: 1100 });
      var leg = q(el, '.leg'), o = q(leg, 'orb-avatar'), nome = q(leg, 'b'), t = q(leg, '.t'), k = 0, p = q(el, '.pagina-site');
      api.depois(80, function () { p.classList.add('no-ar'); });
      if (api.parado) return;
      api.intervalo(function () {
        leg.classList.add('sai');
        api.depois(420, function () {
          k = (k + 1) % LEGENDAS.length; var l = LEGENDAS[k];
          o.dataset.cor = I[l[0]].cor; api.colorir(leg); o.setAttribute('reaction', l[1]); o.setAttribute('label', I[l[0]].nome);
          nome.textContent = I[l[0]].nome; t.textContent = l[2];
          leg.classList.remove('sai');
        });
      }, 3600);
    }
  });

  /* ---------------- 31. Marca branca: o app do cliente com a marca do escritório ---------------- */
  // Os temas de exemplo do protótipo (app/src/theme/temas.ts, branch prototipo), como em apresentacoes/produto/src/dados.js.
  var TEMAS = [
    { id: 'fabrica', nome: 'Heild', rotulo: 'Heild, de fábrica', sigla: 'HE', titulo: 'var(--font-titulo)', texto: 'var(--font-texto)', raio: '17px',
      claro: { primaria: '#24211f', fundo: '#fefbf9', texto: '#2e2b28', destaque: '#4f5bf5' }, escuro: { primaria: '#faf6f3', fundo: '#24211f', texto: '#faf6f3', destaque: '#4f5bf5' } },
    { id: 'horizonte', nome: 'Horizonte Contábil', rotulo: 'Horizonte Contábil', sigla: 'H', titulo: 'Georgia, ui-serif, serif', texto: 'ui-sans-serif, system-ui, sans-serif', raio: '16px',
      claro: { primaria: '#1f4fd8', fundo: '#f7f8fb', texto: '#111827', destaque: '#f97316' }, escuro: { primaria: '#6d8dff', fundo: '#0b1020', texto: '#e5e7eb', destaque: '#f97316' } },
    { id: 'verde', nome: 'Verde Campo Assessoria', rotulo: 'Verde Campo Assessoria', sigla: 'VC', titulo: 'ui-rounded, ui-sans-serif, system-ui, sans-serif', texto: 'ui-sans-serif, system-ui, sans-serif', raio: '6px',
      claro: { primaria: '#166534', fundo: '#fbfaf6', texto: '#1c1917', destaque: '#ca8a04' }, escuro: { primaria: '#4ade80', fundo: '#0c120e', texto: '#ecfdf5', destaque: '#ca8a04' } }
  ];
  function lum(hex) { var c = hex.replace('#', ''), r = parseInt(c.substr(0, 2), 16) / 255, g = parseInt(c.substr(2, 2), 16) / 255, b = parseInt(c.substr(4, 2), 16) / 255; return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  function aparelho(t) {
    var marca = t.id === 'fabrica' ? '<span class="marca-app">' + logo({ estilo: 'width:72px' }) + '</span>' : '<span class="marca-app"><span class="sigla">' + t.sigla + '</span><span class="nome-esc">' + h(t.nome) + '</span></span>';
    return '<div class="aparelho" data-t="' + t.id + '"><div class="tela-app"><span class="ilha"></span>' +
      '<div class="topo-app">' + marca + '<span class="sino"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg><i></i></span></div>' +
      '<div class="cliente-app"><b>Metalúrgica Andrade</b><span>Rita</span></div>' +
      '<p class="ola-app">Olá, Rita. Hoje é 18/11.</p>' +
      '<div class="bloco-app"><b>O escritório precisa de você (1)</b><div class="linha-app"><span>Extrato de outubro do Itaú<small>há 2 dias</small></span><span class="b-app contorno">Enviar</span></div></div>' +
      '<div class="bloco-app"><b>Guias de outubro</b><div class="valor-app"><span>ISS · vence 20/11</span><span>R$ 4.812,40</span></div><div class="valor-app"><span>PIS/COFINS · 25/11</span><span>R$ 7.215,90</span></div><span class="b-app cheio">Baixar as guias</span></div>' +
      '</div><p class="nome-tema">' + h(t.rotulo) + '</p></div>';
  }
  S.push({
    id: 'marcabranca', capitulo: 'Aplicações', curto: 'Marca branca', grade: 'nenhuma',
    notas: 'Dentro do sistema e no app do cliente, cada escritório pode trocar nome, sigla, cores e fontes pelo tema. Sem personalização, vale a Heild, de fábrica. Os três aparelhos usam os temas de exemplo do protótipo. Fora do produto (site, material de venda), é sempre Heild.',
    html: function () {
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Por dentro, a marca do escritório.') +
        frase('No sistema e no app do cliente, cada escritório troca nome, sigla, cores e fontes. Sem personalização, vale a Heild. Fora do produto, é sempre Heild.', 360) + '</div>' +
        encaixe(900, 600, '<div class="tres-aparelhos">' + TEMAS.map(aparelho).join('') + '</div>') + '</div>';
    },
    entrar: function (el, api) {
      var aps = qa(el, '.aparelho'), k = 0, sobre = false;
      function pintar() {
        var escuro = api.escuro();
        aps.forEach(function (a, i) {
          var t = TEMAS[i], m = escuro ? t.escuro : t.claro, tela = q(a, '.tela-app');
          if (t.id === 'fabrica') { tela.removeAttribute('style'); tela.classList.add('de-fabrica'); return; }
          tela.style.setProperty('--m-fundo', m.fundo); tela.style.setProperty('--m-texto', m.texto); tela.style.setProperty('--m-primaria', m.primaria);
          tela.style.setProperty('--m-destaque', m.destaque); tela.style.setProperty('--m-sobre', lum(m.primaria) > 0.5 ? '#0b0b0f' : '#ffffff');
          tela.style.setProperty('--m-fonte-titulo', t.titulo); tela.style.setProperty('--m-fonte-texto', t.texto); tela.style.setProperty('--m-raio', t.raio);
        });
      }
      pintar(); api.aoTema(pintar);
      function foco(i) { k = i; aps.forEach(function (a, j) { a.classList.toggle('foco', j === i); }); }
      aps.forEach(function (a, i) { api.ouvir(a, 'pointerenter', function () { sobre = true; foco(i); }); api.ouvir(a, 'pointerleave', function () { sobre = false; }); });
      foco(0);
      if (api.parado) return;
      api.intervalo(function () { if (!sobre) foco((k + 1) % aps.length); }, 2800);
    }
  });

  /* ---------------- 32. No README ---------------- */
  // Os SVGs do README entram em linha (para usar as fontes da página); os ids ganham um prefixo para não colidirem.
  function svgDoReadme(nome, prefixo) {
    var t = document.getElementById('readme-' + nome); if (!t) return '';
    return t.innerHTML.replace(/id="([^"]+)"/g, 'id="' + prefixo + '$1"').replace(/url\(#([^)]+)\)/g, 'url(#' + prefixo + '$1)');
  }
  S.push({
    id: 'readme', capitulo: 'Aplicações', curto: 'No README', grade: 'nenhuma',
    notas: 'As imagens do README do repositório: SVGs animados em SMIL, gerados dos traçados da logo (ferramentas/wordmark.json) e das cores do design system, cada uma em claro e escuro; o GitHub escolhe pela preferência de quem lê. Aqui elas seguem o tema da apresentação.',
    html: function () {
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('No GitHub, o README também anima.') +
        frase('SVGs gerados dos traçados da logo e das cores do design system, em claro e escuro. O GitHub escolhe pela preferência de quem lê.', 360) +
        '<p class="rotulo" data-e style="--d:600ms"><span class="codigo">python3 ferramentas/gerar_svgs_readme.py</span></p></div>' +
        '<div class="visual"><div class="readme-pilha" data-e="zoom" style="--d:250ms"><div class="readme-svg r-hero"></div><div class="readme-svg r-time"></div></div></div></div>';
    },
    entrar: function (el, api) {
      var hero = q(el, '.r-hero'), time = q(el, '.r-time');
      function por() {
        var m = api.escuro() ? 'escuro' : 'claro';
        hero.innerHTML = svgDoReadme('hero-' + m, 'rh-'); time.innerHTML = svgDoReadme('time-' + m, 'rt-');
        qa(el, '.readme-svg svg').forEach(function (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('preserveAspectRatio', 'xMidYMid meet'); if (api.parado && s.pauseAnimations) s.pauseAnimations(); });
      }
      por(); api.aoTema(por);
    }
  });

  /* ---------------- 33. Fecho ---------------- */
  S.push({
    id: 'fecho', capitulo: 'Fecho', curto: 'Fecho', grade: 'nenhuma',
    notas: 'O fechamento, como o do site: a luz do time e a logo na forma orbs, em que o I vira o orb e se divide como uma célula em três. O inteiro: todos os sistemas da empresa num lugar só.',
    html: function () {
      return u.luzHtml(LUZ, 'luz-fecho') + '<div class="centralizado">' + logo({ classe: 'logo-fecho', attrs: ' data-e="zoom" tabindex="0" role="button" aria-label="Tocar a forma orbs"' }) +
        titulo('O inteiro: todos os sistemas da empresa em um só lugar.', 't-fecho') + '</div>';
    },
    entrar: function (el, api) {
      u.luz(api, el, { forca: 0.5 });
      var l = q(el, 'heild-logo');
      api.depois(900, function () { u.logoEmLoop(api, l, 'orbs'); });
    }
  });
})();
