/* Identidade da Heild — cenas da abertura e da logo. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, I = M.I, u = M.u;
  var h = u.h, q = u.q, qa = u.qa, orb = u.orb, logo = u.logo, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe;
  var LUZ = ['consultor', 'fiscal', 'dp', 'contabil', 'societario', 'notas', 'atendimento', 'financeiro', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'];
  var VB_W = 1259, VB_H = 387, CX = 634.344, PW = 147.297, H = 386.111; // ferramentas/wordmark.json

  /* ---------------- 1. Capa: a logo sozinha, passando pelas formas originais ---------------- */
  S.push({
    id: 'capa', capitulo: 'Abertura', curto: 'Capa', grade: 'toda', semRodape: true,
    notas: 'A logo, sozinha no centro, passando pelas formas originais em loop (cycle): centralizar, orb, contábil, jurídico, BPO, IA e atendimento. Mais nada na capa, como pede o design system.',
    html: function () { return '<div class="centralizado">' + logo({ classe: 'logo-capa', attrs: ' data-e="zoom"' }) + '</div>'; },
    entrar: function (el, api) {
      var l = q(el, 'heild-logo');
      if (!api.parado) { l.setAttribute('loop', ''); l.setAttribute('animation', 'cycle'); }
      u.pararLogo(api, l);
    }
  });

  /* ---------------- 2. A ideia ---------------- */
  S.push({
    id: 'ideia', capitulo: 'Abertura', curto: 'Tudo, num lugar só', grade: 'nenhuma',
    notas: 'A ideia que define a marca. Atrás do título, a luz do time: uma mancha por integrante, espalhadas, que se juntam numa faixa, como no hero do site. A ideia aparece de três formas, e toda peça nova repete pelo menos uma.',
    html: function () {
      var tres = [['A logo é modular', 'O I fica sozinho e se transforma em cada coisa.'], ['A interface é feita de camadas', 'Areia que se empilha e vira uma superfície só.'], ['O time trabalha dentro dela', 'Cada integrante tem o seu orb de cor.']];
      return u.luzHtml(LUZ) + '<div class="centralizado">' + titulo('Tudo, num lugar só.', 'titulo-ideia') +
        frase('Heild junta as ferramentas de uma empresa num lugar só, com um time de integrantes de IA. A marca repete essa ideia em cada peça.', 520, 'frase-ideia') + '</div>' +
        '<ol class="tres">' + tres.map(function (t, i) { return '<li data-e style="--d:' + (900 + i * 140) + 'ms"><span class="n">' + (i + 1) + '</span><span><b>' + h(t[0]) + '</b>' + h(t[1]) + '</span></li>'; }).join('') + '</ol>';
    },
    entrar: function (el, api) { u.luz(api, el); }
  });

  /* ---------------- 3. O nome ---------------- */
  // As letras começam soltas e se juntam numa palavra só: o todo, sem partes separadas. Em loop.
  var SOLTAS = [[-150, -40, -9], [-60, 52, 6], [0, -64, -4], [70, 46, 8], [160, -22, -6]];
  S.push({
    id: 'nome', capitulo: 'Abertura', curto: 'O nome', grade: 'direita',
    notas: 'Heild vem do islandês: o inteiro, o todo sem partes separadas, com raiz no nórdico antigo heill. As letras soltas se juntam numa palavra só, que é o que o sistema faz com as ferramentas da empresa.',
    html: function () {
      var letras = 'heild'.split('').map(function (c, i) { var s = SOLTAS[i]; return '<span style="--dx:' + s[0] + 'px;--dy:' + s[1] + 'px;--r:' + s[2] + 'deg;--k:' + i + '">' + c + '</span>'; }).join('');
      return '<div class="nome-grade"><p class="verbete" aria-label="heild" data-e="fade" style="--d:200ms"><span class="letras" aria-hidden="true">' + letras + '</span></p>' +
        '<div class="definicao" data-e style="--d:500ms"><p class="rotulo">islandês · raiz no nórdico antigo heill</p>' +
        '<ol class="acepcoes"><li><span>1</span><span>o inteiro</span></li><li><span>2</span><span>o todo, sem partes separadas</span></li></ol>' +
        '<p class="corpo-grande suave">É o que o sistema faz com as ferramentas de uma empresa: Painel, CRM, timesheet, financeiro, arquivos e app do cliente, num produto só.</p></div></div>';
    },
    entrar: function (el, api) {
      var v = q(el, '.verbete');
      if (api.parado) { v.classList.add('junto'); return; }
      var junto = false;
      function trocar() { junto = !junto; v.classList.toggle('junto', junto); api.depois(junto ? 4600 : 2200, trocar); }
      api.depois(900, trocar);
    }
  });

  /* ---------------- 4. O desenho das camadas ---------------- */
  var PLANOS = ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'BPO', 'App do cliente'];
  S.push({
    id: 'camadas', capitulo: 'Abertura', curto: 'O desenho das camadas', grade: 'direita',
    notas: 'A figura da marca: os sistemas do escritório como planos isométricos, em traço de 1,5 px na cor do texto, que descem e se juntam no de baixo. Um único elemento leva cor: o orb de um integrante no plano de baixo. Clique no desenho para separar e juntar.',
    html: function () {
      var n = PLANOS.length, topo = 40, passo = 60, yb = topo + n * passo;
      var planos = PLANOS.map(function (nome, i) {
        return '<div class="plano" style="--y:' + (topo + i * passo) + 'px;--a:' + (i * 90) + 'ms;--aj:' + ((n - i) * 80) + 'ms"><div class="placa"></div>' +
          '<span class="etiqueta' + (i % 2 ? ' esq' : '') + '"><span class="pilula pilula--contorno">' + h(nome) + '</span></span></div>';
      }).join('');
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Camadas que viram uma só.', 't-camadas') +
        frase('A figura da marca: os sistemas do escritório empilhados, que descem e se juntam no de baixo. O inteiro.', 380) +
        '<p class="rotulo" data-e style="--d:620ms">Clique no desenho para separar e juntar.</p></div>' +
        encaixe(660, 600, '<div class="pilha inicio" style="--yb:' + yb + 'px" role="button" tabindex="0" aria-label="Separar e juntar as camadas">' +
          '<div class="fio" style="top:' + topo + 'px;height:' + (yb - topo) + 'px"></div>' +
          '<div class="plano base" style="--y:' + yb + 'px;--a:' + (n * 90) + 'ms"><div class="placa"></div></div>' + planos +
          '<div class="base-orb" style="top:' + (yb - 10) + 'px">' + orb('contabil', { tamanho: 60, reacao: 'working' }) + '</div>' +
          '<p class="rotulo rotulo-base" style="top:' + (yb + 128) + 'px">Uma superfície só, sobre o mesmo cadastro</p></div>') + '</div>';
    },
    entrar: function (el, api) {
      var p = q(el, '.pilha'), mexeu = -1e9;
      if (api.parado) { p.classList.remove('inicio'); p.classList.add('junto'); return; }
      api.depois(80, function () { p.classList.remove('inicio'); });
      api.depois(2300, function () {
        p.classList.add('junto');
        api.intervalo(function () { if (performance.now() - mexeu < 8000) return; p.classList.toggle('junto'); }, 4400);
      });
      function alternar() { mexeu = performance.now(); p.classList.toggle('junto'); }
      api.ouvir(p, 'click', alternar);
      api.ouvir(p, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); alternar(); } });
    }
  });

  /* ---------------- 5. A pílula é a marca: a construção ---------------- */
  S.push({
    id: 'construcao', capitulo: 'A logo', curto: 'A pílula é a marca', grade: 'nenhuma',
    notas: 'HE · I · LD. H e E dividem a mesma haste, L e D dividem a mesma base, e o I fica sozinho no centro como uma pílula, mais grossa que os outros traços. A área de proteção é a largura da pílula (cerca de 12% da logo) e acompanha a logo quando ela anima: HE e LD se afastam e a área abre junto.',
    html: function () {
      var L = 640, LX = 220, LY = 112, k = L / VB_W, X = function (v) { return +(LX + v * k).toFixed(1); }, Y = function (v) { return +(LY + v * k).toFixed(1); };
      var x = PW * k, alt = H * k;
      var pil = function (cx, cy, vert) { return vert ? '<rect class="modulo" x="' + (cx - x / 2).toFixed(1) + '" y="' + (cy - x / 2).toFixed(1) + '" width="' + x.toFixed(1) + '" height="' + x.toFixed(1) + '" rx="' + (x / 2).toFixed(1) + '"/>' : ''; };
      var svg = '<svg class="anot" viewBox="0 0 1080 420" aria-hidden="true">' +
        // guias de topo e base da pílula, de ponta a ponta
        '<line class="guia" x1="0" y1="' + Y(0) + '" x2="1080" y2="' + Y(0) + '"/><line class="guia" x1="0" y1="' + Y(H) + '" x2="1080" y2="' + Y(H) + '"/>' +
        // a pílula medida: x
        '<g class="cota"><line x1="' + X(CX - PW / 2) + '" y1="' + (Y(0) - 22) + '" x2="' + X(CX + PW / 2) + '" y2="' + (Y(0) - 22) + '"/><line x1="' + X(CX - PW / 2) + '" y1="' + (Y(0) - 28) + '" x2="' + X(CX - PW / 2) + '" y2="' + (Y(0) - 16) + '"/><line x1="' + X(CX + PW / 2) + '" y1="' + (Y(0) - 28) + '" x2="' + X(CX + PW / 2) + '" y2="' + (Y(0) - 16) + '"/>' +
        '<text x="' + X(CX) + '" y="' + (Y(0) - 34) + '" text-anchor="middle">x</text></g>' +
        // área de proteção: x em volta, acompanha as letras
        '<rect class="area" data-x="' + (LX - x).toFixed(1) + '" data-w="' + (L + 2 * x).toFixed(1) + '" x="' + (LX - x).toFixed(1) + '" y="' + (Y(0) - x).toFixed(1) + '" width="' + (L + 2 * x).toFixed(1) + '" height="' + (alt + 2 * x).toFixed(1) + '" rx="10"/>' +
        '<g class="mod-esq">' + pil(LX - x / 2, LY + alt / 2, true) + '</g><g class="mod-dir">' + pil(LX + L + x / 2, LY + alt / 2, true) + '</g>' +
        '<text class="t2 rot-area" data-x="' + (LX + L + x).toFixed(1) + '" x="' + (LX + L + x).toFixed(1) + '" y="' + (Y(0) - x - 10).toFixed(1) + '" text-anchor="end">área de proteção: x, a largura da pílula</text>' +
        // anotações
        '<g class="lado-he"><line class="traco" style="--l:120;--d:500ms" x1="' + X(258) + '" y1="' + Y(20) + '" x2="' + X(258) + '" y2="' + (Y(0) - 70) + '"/><circle class="aparece" style="--d:500ms" cx="' + X(258) + '" cy="' + Y(20) + '" r="3.5"/>' +
        '<text class="aparece" style="--d:900ms" x="' + X(258) + '" y="' + (Y(0) - 80) + '" text-anchor="middle">H e E dividem a haste</text></g>' +
        '<g class="lado-ld"><line class="traco" style="--l:120;--d:900ms" x1="' + X(900) + '" y1="' + Y(352) + '" x2="' + X(900) + '" y2="' + (Y(H) + 70) + '"/><circle class="aparece" style="--d:900ms" cx="' + X(900) + '" cy="' + Y(352) + '" r="3.5"/>' +
        '<text class="aparece" style="--d:1300ms" x="' + X(900) + '" y="' + (Y(H) + 88) + '" text-anchor="middle">L e D dividem a base</text></g>' +
        '<line class="traco" style="--l:160;--d:1300ms" x1="' + X(CX) + '" y1="' + Y(H - 30) + '" x2="' + X(CX) + '" y2="' + (Y(H) + 70) + '"/>' +
        '<text class="aparece" style="--d:1700ms" x="' + X(CX) + '" y="' + (Y(H) + 88) + '" text-anchor="middle">o I fica sozinho</text>' +
        '</svg>';
      return '<div class="cab cab-construcao">' + titulo('A pílula é a marca.', 't-construcao') + frase('HE · I · LD, numa cor só: a primária sobre o fundo. Sem gradiente, sombra, contorno ou segunda cor, nem no I.', 340) + '</div>' +
        encaixe(1080, 420, '<div class="construcao">' + svg + logo({ classe: 'logo-construcao', attrs: ' tabindex="0" role="button" aria-label="Tocar uma forma"' }) + '</div>', 'encaixe-construcao');
    },
    entrar: function (el, api) {
      var l = q(el, 'heild-logo'), svg = q(el, 'svg.anot'), k = 640 / VB_W;
      var area = q(svg, 'rect.area'), rot = q(svg, '.rot-area'), he = q(svg, '.lado-he'), ld = q(svg, '.lado-ld'), me = q(svg, '.mod-esq'), md = q(svg, '.mod-dir');
      var ax = +area.dataset.x, aw = +area.dataset.w, rx = +rot.dataset.x, ultimo = -1;
      // A área de proteção é contêiner da logo: lê, a cada quadro, quanto HE e LD se afastaram e acompanha.
      api.quadro(function () {
        var s = (typeof l._lastL === 'number' ? l._lastL : 0) * k;
        if (Math.abs(s - ultimo) > 0.05) {
          ultimo = s;
          area.setAttribute('x', (ax - s).toFixed(2)); area.setAttribute('width', (aw + 2 * s).toFixed(2));
          rot.setAttribute('x', (rx + s).toFixed(2));
          he.setAttribute('transform', 'translate(' + (-s).toFixed(2) + ' 0)'); ld.setAttribute('transform', 'translate(' + s.toFixed(2) + ' 0)');
          me.setAttribute('transform', 'translate(' + (-s).toFixed(2) + ' 0)'); md.setAttribute('transform', 'translate(' + s.toFixed(2) + ' 0)');
        }
        return true;
      });
      if (api.parado) return;
      // A logo descansa como pílula para a construção ser lida e, de tempos em tempos, toca uma forma.
      var formas = ['orb', 'centralizar', 'bpo', 'contabil'], i = 0, tocando = false;
      function tocar(f) { if (tocando) return; tocando = true; var p = l.play(f || formas[i++ % formas.length]); (p && p.then ? p : Promise.resolve()).then(function () { tocando = false; }); }
      api.depois(2600, tocar);
      api.intervalo(tocar, 8600);
      api.ouvir(l, 'click', function () { tocando = false; tocar(); });
      api.ouvir(l, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tocando = false; tocar(); } });
      u.pararLogo(api, l);
    }
  });

  /* ---------------- 6. Tamanho mínimo e ícones ---------------- */
  function favicon(px) {
    // O ícone da aba é o HE da logo (logos/favicon-he.svg): os mesmos traçados, com um contorno leve para ler em 16 px.
    return '<svg class="favicon" width="' + px + '" height="' + px + '" viewBox="-26 -77 541 541" aria-hidden="true"><path stroke-width="18" stroke-linejoin="miter" d="' + window.Heild.paths.HE + '"/></svg>';
  }
  function pilulaSvg(alt) { var w = alt * PW / H; return '<svg class="pilula-ico" width="' + w.toFixed(1) + '" height="' + alt + '" viewBox="0 0 147.297 386.111" aria-hidden="true"><rect width="147.297" height="386.111" rx="73.648"/></svg>'; }
  S.push({
    id: 'minimo', capitulo: 'A logo', curto: '72 px e os ícones', grade: 'direita',
    notas: 'O wordmark tem 72 px de largura no mínimo em tela. Abaixo disso, usa-se só a pílula, como ícone. Na aba do navegador, o ícone é o HE da logo, com um contorno leve para ler em 16 px, que segue o tema do navegador. Arraste o controle para ver a troca.',
    html: function () {
      var tam = [16, 32, 48];
      var icones = '<div class="icones" data-e style="--d:620ms">' +
        '<div class="ico-grupo"><div class="ladrilhos"><div class="ladrilho forca-claro">' + tam.map(favicon).join('') + '</div><div class="ladrilho forca-escuro">' + tam.map(favicon).join('') + '</div></div><p class="rotulo">Na aba do navegador: o HE, que segue o tema</p></div>' +
        '<div class="ico-grupo"><div class="ladrilhos"><div class="ladrilho forca-claro">' + [16, 24, 40].map(pilulaSvg).join('') + '</div><div class="ladrilho forca-escuro">' + [16, 24, 40].map(pilulaSvg).join('') + '</div></div><p class="rotulo">Abaixo de 72 px: a pílula, nas duas tintas</p></div></div>';
      return '<div class="dividido dividido--meio"><div class="cab">' + titulo('72 px, no mínimo.') + frase('Abaixo disso, a pílula sozinha vira o ícone. A área de proteção vale em qualquer tamanho.', 360) +
        '<label class="controle-tam" data-e style="--d:520ms"><span>Largura</span><input type="range" min="24" max="460" step="1" value="320" aria-label="Largura da logo em pixels"><output class="tnum">320 px</output></label>' + icones + '</div>' +
        '<div class="visual"><div class="caixa-tam" data-e="zoom" style="--d:250ms"><div class="medida"><div class="protecao"></div>' + logo({ classe: 'logo-tam' }) + '<div class="so-pilula" hidden>' + pilulaSvg(40) + '</div></div>' +
        '<div class="regua" aria-hidden="true"><div class="trilho-regua"><i class="limite"></i><i class="atual"></i></div><div class="marcas-regua"><span>0</span><span class="m72">72 px</span><span>460 px</span></div></div>' +
        '<p class="leitura-tam"><b class="qual">Wordmark</b><span class="suave">· área de proteção de <span class="xpx tnum">37</span> px</span></p></div></div></div>';
    },
    entrar: function (el, api) {
      var atual = q(el, '.regua .atual'), r = q(el, 'input'), o = q(el, 'output'), l = q(el, '.logo-tam'), prot = q(el, '.protecao'), so = q(el, '.so-pilula'), qual = q(el, '.qual'), xpx = q(el, '.xpx'), mexeu = -1e9;
      function por(w) {
        w = Math.round(w); r.value = w; o.textContent = w + ' px';
        var x = w * PW / VB_W, alt = w * VB_H / VB_W, peq = w < 72;
        l.hidden = peq; so.hidden = !peq;
        if (peq) { var s = q(so, 'svg'); s.setAttribute('height', alt.toFixed(1)); s.setAttribute('width', (alt * PW / H).toFixed(1)); }
        var bw = peq ? alt * PW / H : w, xx = peq ? alt * PW / H : x;
        l.style.width = w + 'px';
        prot.style.width = (bw + 2 * xx).toFixed(1) + 'px'; prot.style.height = (alt + 2 * xx).toFixed(1) + 'px';
        qual.textContent = peq ? 'Só a pílula' : 'Wordmark'; xpx.textContent = Math.max(1, Math.round(xx));
        atual.style.left = (w / 460 * 100).toFixed(2) + '%'; atual.classList.toggle('abaixo', peq);
      }
      api.ouvir(r, 'input', function () { mexeu = performance.now(); por(+r.value); });
      api.ouvir(r, 'keydown', function (e) { e.stopPropagation(); });
      por(320);
      if (api.parado) return;
      // Sozinho, o controle vai e volta, devagar perto do limite de 72 px.
      var t0 = performance.now();
      api.quadro(function (agora) {
        if (performance.now() - mexeu < 6000) { t0 = agora - 2600; return true; }
        var t = ((agora - t0) / 1000) % 10, f = t < 5 ? t / 5 : 1 - (t - 5) / 5, e = u.inOut(f);
        por(420 - e * 380);
        return true;
      });
    }
  });

  /* ---------------- 7. O que não fazer ---------------- */
  var ERROS = [
    { id: 'esticar', txt: 'Não estique.' },
    { id: 'inclinar', txt: 'Não incline.' },
    { id: 'colorir', txt: 'Não pinte o I.' },
    { id: 'sombra', txt: 'Sem sombra nem contorno.' },
    { id: 'fundo', txt: 'Não ponha sobre fundo agitado.' },
    { id: 'certo', txt: 'Uma cor, sobre fundo liso.', certo: true }
  ];
  S.push({
    id: 'naofaca', capitulo: 'A logo', curto: 'O que não fazer', grade: 'nenhuma',
    notas: 'O que o design system proíbe: esticar, inclinar, colorir o I, pôr sombra ou contorno, e colocar a logo sobre um fundo sem área lisa. Passe o cursor num erro para ver a logo voltar ao certo.',
    html: function () {
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('O que não fazer.') + frase('Passe o cursor num erro para ver a logo voltar ao certo.', 360) + '</div>' +
        '<div class="erros">' + ERROS.map(function (e, i) {
          return '<div class="erro-cartao' + (e.certo ? ' certo' : '') + '" data-erro="' + e.id + '" data-e style="--d:' + (300 + i * 90) + 'ms"><div class="erro-palco">' + logo({ classe: 'logo-erro' }) + '</div>' +
            '<p class="erro-legenda">' + u.icone(e.certo ? 'check' : 'x') + '<span>' + h(e.txt) + '</span></p></div>';
        }).join('') + '</div></div>';
    },
    entrar: function (el, api) {
      var cs = qa(el, '.erro-cartao:not(.certo)'), sobre = null;
      // Pintar o I: a cor de destaque entra só no exemplo do erro (o componente desenha o I num grupo próprio).
      var pintar = function (on) {
        var l = q(el, '[data-erro="colorir"] heild-logo'), g = l && l.shadowRoot && l.shadowRoot.querySelector('g.i');
        if (g) g.setAttribute('fill', on ? getComputedStyle(l).getPropertyValue('--destaque').trim() : 'currentColor');
      };
      function corrigir(c, on) { c.classList.toggle('corrigido', on); if (c.dataset.erro === 'colorir') pintar(!on); }
      requestAnimationFrame(function () { pintar(true); });
      cs.forEach(function (c) {
        api.ouvir(c, 'pointerenter', function () { sobre = c; corrigir(c, true); });
        api.ouvir(c, 'pointerleave', function () { sobre = null; corrigir(c, false); });
      });
      if (api.parado) return;
      var i = 0;
      api.intervalo(function () {
        if (sobre) return;
        var c = cs[i++ % cs.length]; corrigir(c, true);
        api.depois(1500, function () { if (sobre !== c) corrigir(c, false); });
      }, 2400);
    }
  });
})();
