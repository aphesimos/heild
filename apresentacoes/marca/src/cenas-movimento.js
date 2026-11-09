/* Identidade da Heild — cenas do sistema de movimento. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, u = M.u, FORMAS = M.FORMAS, AFASTA = M.AFASTA;
  var h = u.h, q = u.q, qa = u.qa, logo = u.logo, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe, clamp = u.clamp, inOut = u.inOut, outBack = u.outBack;
  var VB_W = 1259, CX = 634.344, PW = 147.297, H = 386.111, U = 96;
  // Tempos do sistema de movimento (design-system/README.md; os mesmos do componente).
  var T = { contracao: 160, antecipa: 140, divisao: 1000, cascata: 55, letrasDe: 90, letras: 720, retorno: 900, cascataVolta: 40, repouso: 1300 };
  // Cápsulas (K) e pausa de cada forma, como no componente.
  var DADOS = { centralizar: [9, 1900], orb: [1, 3700], contabil: [3, 1600], juridico: [2, 1600], bpo: [2, 1600], ia: [3, 2000], atendimento: [3, 2300], financeiro: [4, 1600], tempo: [4, 2200], arquivos: [6, 1600], conversa: [5, 1600], celular: [4, 1600], painel: [5, 1600], lupa: [9, 2200], equipe: [6, 2200], orbs: [3, 5400] };
  function nomeDe(id) { var f = FORMAS.find(function (x) { return x.id === id; }); return f ? f.nome : id; }
  function ms(v) { return u.num(v) + ' ms'; }

  /* ---------------- 8. O material: cápsulas que se fundem como líquido ---------------- */
  // As peças, em unidades do viewBox da logo (espessura 96, como no componente): [x, y, comprimento, rotação].
  var PECAS = [[560, 250, 300, 0], [700, 430, 96, 0], [820, 270, 220, 90], [640, 620, 260, 90], [880, 560, 96, 0], [500, 470, 180, 0]];
  S.push({
    id: 'material', capitulo: 'Movimento', curto: 'O material', grade: 'direita',
    notas: 'O I é feito de cápsulas: só cápsulas e círculos com as pontas totalmente redondas, de 96 de espessura (a pílula tem 147). Durante a divisão e o retorno, elas se fundem como líquido: um desfoque de até 11 e um limiar de alfa, os mesmos do componente. Arraste as peças.',
    html: function () {
      var goo = '<filter id="goo-material" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="11"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>';
      var pecas = PECAS.map(function (p, i) { return '<rect class="peca" data-i="' + i + '" x="' + (-U / 2) + '" y="' + (-p[2] / 2) + '" width="' + U + '" height="' + p[2] + '" rx="' + (U / 2) + '"/>'; }).join('');
      var svg = '<svg class="material-svg" viewBox="0 0 1000 840" data-arrasta role="img" aria-label="A pílula e as cápsulas do I">' +
        '<defs>' + goo + '</defs>' +
        '<g class="ref"><rect x="80" y="227" width="' + PW + '" height="' + H + '" rx="' + (PW / 2) + '"/>' +
        '<line class="cota" x1="80" y1="190" x2="' + (80 + PW) + '" y2="190"/><line class="cota" x1="80" y1="180" x2="80" y2="200"/><line class="cota" x1="' + (80 + PW) + '" y1="180" x2="' + (80 + PW) + '" y2="200"/>' +
        '<text x="' + (80 + PW / 2) + '" y="166" text-anchor="middle">147</text><text class="t2" x="' + (80 + PW / 2) + '" y="680" text-anchor="middle">a pílula</text></g>' +
        '<g class="massa" filter="url(#goo-material)">' + pecas + '</g>' +
        '<g class="cota-96"><line class="cota" x1="0" y1="0" x2="96" y2="0"/><line class="cota" x1="0" y1="-10" x2="0" y2="10"/><line class="cota" x1="96" y1="-10" x2="96" y2="10"/><text x="48" y="-22" text-anchor="middle">96</text></g>' +
        '<text class="t2 rot-cap" x="700" y="800" text-anchor="middle">as cápsulas</text></svg>';
      return '<div class="dividido"><div class="cab">' + titulo('O I é feito de cápsulas.') +
        frase('Só cápsulas e círculos, com as pontas totalmente redondas. Quando se dividem e voltam, elas se fundem como líquido.', 360) +
        '<ul class="fatos" data-e style="--d:560ms"><li><b>96</b><span>a espessura das peças</span></li><li><b>147</b><span>a espessura da pílula</span></li><li><b>11</b><span>o desfoque máximo da fusão</span></li></ul>' +
        '<p class="rotulo" data-e style="--d:700ms">Arraste as peças.</p></div>' +
        encaixe(620, 520, svg) + '</div>';
    },
    entrar: function (el, api) {
      var svg = q(el, 'svg'), rs = qa(svg, '.peca'), cota = q(svg, '.cota-96');
      var st = PECAS.map(function (p, i) { return { x: p[0], y: p[1], ox: 0, oy: 0, vx: 0, vy: 0, preso: false, fase: i * 1.37 }; });
      var arrastando = null, dx = 0, dy = 0, t0 = performance.now();
      function ponto(e) { var r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 1000, (e.clientY - r.top) / r.height * 840]; }
      api.ouvir(svg, 'pointerdown', function (e) {
        var p = ponto(e), melhor = -1, md = 1e9;
        st.forEach(function (s, i) { var cx = s.x + s.ox, cy = s.y + s.oy, d = Math.hypot(cx - p[0], cy - p[1]); if (d < md) { md = d; melhor = i; } });
        if (md > 200) return;
        arrastando = melhor; st[melhor].preso = true; dx = st[melhor].x + st[melhor].ox - p[0]; dy = st[melhor].y + st[melhor].oy - p[1];
        svg.setPointerCapture(e.pointerId); e.preventDefault();
      });
      api.ouvir(svg, 'pointermove', function (e) { if (arrastando === null) return; var p = ponto(e), s = st[arrastando]; s.ox = p[0] + dx - s.x; s.oy = p[1] + dy - s.y; });
      api.ouvir(svg, 'pointerup', function () { if (arrastando !== null) st[arrastando].preso = false; arrastando = null; });
      function desenhar(t) {
        st.forEach(function (s, i) {
          var p = PECAS[i];
          // Sozinhas, as peças orbitam devagar em volta de casa e se encostam umas nas outras de tempos em tempos.
          var ax = api.parado ? 0 : Math.sin(t * 0.55 + s.fase) * 46, ay = api.parado ? 0 : Math.cos(t * 0.43 + s.fase * 1.3) * 40;
          if (!s.preso) { s.vx += (-s.ox * 18 - s.vx * 6) / 60; s.vy += (-s.oy * 18 - s.vy * 6) / 60; s.ox += s.vx / 60; s.oy += s.vy / 60; }
          var x = s.x + s.ox + ax, y = s.y + s.oy + ay, r = p[3] + (api.parado ? 0 : Math.sin(t * 0.3 + s.fase) * 6);
          rs[i].setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + r.toFixed(1) + ')');
          if (i === 1) cota.setAttribute('transform', 'translate(' + (x - U / 2).toFixed(1) + ' ' + (y - U / 2 - 26).toFixed(1) + ')');
        });
      }
      api.quadro(function (agora) { desenhar((agora - t0) / 1000); return !api.parado || arrastando !== null; });
      if (api.parado) api.ouvir(svg, 'pointermove', function () { desenhar(0); });
    }
  });

  /* ---------------- 9. As quatro regras ---------------- */
  var REGRAS = [
    ['Material', 'Só cápsulas e círculos, com as pontas redondas. A exceção é o orb: o I inteiro virando esfera.'],
    ['Limite', 'A forma nunca passa da altura das letras. Só cresce para os lados.'],
    ['Espaço', 'HE e LD se afastam na medida exata da forma e voltam quando o I se fecha.'],
    ['Ritmo', 'Contração, divisão em cascata, pausa e retorno com um leve assentamento.']
  ];
  S.push({
    id: 'regras', capitulo: 'Movimento', curto: 'As quatro regras', grade: 'centro',
    notas: 'As quatro regras do movimento. As linhas mostram o limite (a forma nunca passa da altura das letras) e a cota mostra o espaço: HE e LD se afastam exatamente a largura da forma, lida do componente a cada quadro.',
    html: function () {
      var L = 600, k = L / VB_W, alt = H * k;
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Quatro regras, uma forma por vez.') + '</div>' +
        '<div class="visual cresce"><div class="palco-regras" style="--alt:' + alt.toFixed(1) + 'px">' +
        '<div class="guia-limite topo"><span>limite: a altura das letras</span></div><div class="guia-limite base"></div>' +
        logo({ classe: 'logo-regras' }) +
        '<div class="cota-forma" aria-hidden="true"><i class="ponta e"></i><i class="ponta d"></i><span class="valor tnum">147</span></div>' +
        '<div class="letras-afasta" aria-hidden="true"><span class="seta e tnum">0</span><span class="seta d tnum">0</span></div>' +
        '<p class="nome-forma-regras" aria-live="polite"></p></div></div>' +
        '<ol class="quatro">' + REGRAS.map(function (r, i) { return '<li data-e style="--d:' + (400 + i * 100) + 'ms" data-r="' + i + '"><span class="n">' + (i + 1) + '</span><b>' + r[0] + '</b><span class="d">' + h(r[1]) + '</span></li>'; }).join('') + '</ol></div>';
    },
    entrar: function (el, api) {
      var l = q(el, '.logo-regras'), cota = q(el, '.cota-forma'), val = q(el, '.cota-forma .valor'), se = q(el, '.seta.e'), sd = q(el, '.seta.d'), nome = q(el, '.nome-forma-regras'), lis = qa(el, '.quatro li');
      var k = 600 / VB_W, seq = ['contabil', 'financeiro', 'equipe', 'tempo', 'conversa', 'painel'], i = 0, t0 = 0, atual = null;
      api.quadro(function (agora) {
        var s = typeof l._lastL === 'number' ? l._lastL : 0, larg = PW + 2 * s;
        cota.style.width = (larg * k).toFixed(1) + 'px';
        val.textContent = Math.round(larg);
        se.textContent = '← ' + Math.round(s); sd.textContent = Math.round(s) + ' →';
        se.style.transform = 'translateX(' + (-s * k).toFixed(1) + 'px)'; sd.style.transform = 'translateX(' + (s * k).toFixed(1) + 'px)';
        // a regra em destaque segue a fase: contração e divisão (material), pausa (limite e espaço), retorno (ritmo)
        if (atual) {
          var t = agora - t0, d = DADOS[atual], f = t < T.divisao ? 0 : t < T.divisao + d[1] ? 1 : t < T.divisao + d[1] + T.retorno ? 3 : -1;
          lis.forEach(function (li, j) { li.classList.toggle('ativa', f === 0 ? j === 0 : f === 1 ? (j === 1 || j === 2) : f === 3 ? j === 3 : false); });
        }
        return true;
      });
      if (api.parado) return;
      function tocar() {
        if (!api.vivo()) return;
        atual = seq[i++ % seq.length]; t0 = performance.now();
        nome.textContent = 'forma ' + nomeDe(atual);
        var p = l.play(atual);
        (p && p.then ? p : Promise.resolve()).then(function () { api.depois(T.repouso, tocar); });
      }
      api.depois(900, tocar);
      u.pararLogo(api, l);
    }
  });

  /* ---------------- 10. Os tempos: a linha do tempo tocando com a logo ---------------- */
  var SEQ_TEMPO = ['contabil', 'bpo', 'tempo', 'centralizar', 'orb'];
  S.push({
    id: 'tempos', capitulo: 'Movimento', curto: 'Os tempos', grade: 'nenhuma',
    notas: 'Os tempos exatos do sistema de movimento, desenhados com as mesmas curvas do componente: a contração de 160 ms, a divisão de 1000 ms com as cápsulas saindo em cascata de 55 ms e passando do ponto (back-out 1,25), as letras com ease-in-out cúbico, a fusão de até 11, a pausa de cada forma, o retorno de 900 ms com assentamento e o repouso de 1300 ms entre loops. A cabeça de leitura anda junto com a logo.',
    html: function () {
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Contração, divisão, pausa, retorno.') +
        '<div class="chips formas-tempo" role="group" aria-label="Formas" data-e style="--d:400ms">' + SEQ_TEMPO.map(function (f) { return '<button type="button" class="chip" data-f="' + f + '" aria-pressed="false">' + nomeDe(f) + '</button>'; }).join('') + '</div></div>' +
        '<div class="tempos-corpo"><div class="tempos-logo">' + logo({ classe: 'logo-tempos' }) + '</div>' +
        '<div class="grafico" data-e style="--d:300ms"><div class="fases-t"></div><svg class="curvas" viewBox="0 0 1152 210" preserveAspectRatio="none" aria-hidden="true"></svg>' +
        '<div class="faixas-t"><span>Cápsulas</span><span>Letras</span><span>Fusão</span></div>' +
        '<div class="leituras"><span class="l-cap tnum"></span><span class="l-let tnum"></span><span class="l-goo tnum"></span></div>' +
        '<i class="cabeca"></i><div class="eixo tnum"></div></div></div></div>';
    },
    entrar: function (el, api) {
      var l = q(el, '.logo-tempos'), svg = q(el, '.curvas'), fases = q(el, '.fases-t'), eixo = q(el, '.eixo'), cab = q(el, '.cabeca'), bs = qa(el, '.formas-tempo .chip');
      var lc = q(el, '.l-cap'), ll = q(el, '.l-let'), lg = q(el, '.l-goo');
      var W = 1152, LANE = 70, k = 0, ativa = null, t0 = 0, total = 0, rodando = false, mexeu = -1e9;
      // Curvas exatas do componente, em função do tempo t (ms) desde o play().
      function valores(id, t) {
        var d = DADOS[id], K = d[0], hold = d[1], span = T.divisao - T.antecipa - (K - 1) * T.cascata, spanB = T.retorno - (K - 1) * T.cascataVolta, caps = [], let_ = 0, goo = 0;
        for (var r = 0; r < K; r++) {
          var v;
          if (t < T.divisao) v = outBack(clamp((t - T.antecipa - r * T.cascata) / span, 0, 1), 1.25);
          else if (t < T.divisao + hold) v = 1;
          else { var mb = t - T.divisao - hold; v = 1 - outBack(clamp((mb - (K - 1 - r) * T.cascataVolta) / spanB, 0, 1), 1.1); }
          caps.push(t >= T.divisao + hold + T.retorno ? 0 : v);
        }
        if (t < T.divisao) { let_ = inOut(clamp((t - T.letrasDe) / T.letras, 0, 1)); goo = 11 * Math.sin(Math.PI * clamp((t - T.antecipa) / (T.divisao - T.antecipa), 0, 1)); }
        else if (t < T.divisao + hold) { let_ = 1; goo = 0; }
        else if (t < T.divisao + hold + T.retorno) { var mb2 = t - T.divisao - hold; let_ = 1 - outBack(clamp((mb2 - 140) / (T.retorno - 140), 0, 1), .9); goo = 11 * Math.sin(Math.PI * clamp(mb2 / (T.retorno * .8), 0, 1)); }
        return { caps: caps, let_: let_, goo: goo };
      }
      function desenhar(id) {
        var d = DADOS[id], hold = d[1];
        total = T.divisao + hold + T.retorno + T.repouso;
        var X = function (t) { return (t / total * W).toFixed(1); };
        var blocos = [['Contração', T.contracao], ['Divisão', T.divisao - T.contracao], ['Pausa', hold], ['Retorno', T.retorno], ['Repouso', T.repouso]];
        fases.innerHTML = blocos.map(function (b, i) { return '<span class="fase-t" data-f="' + i + '" style="flex:' + b[1] + ' 1 0"><b>' + b[0] + '</b><small>' + ms(b[1]) + '</small></span>'; }).join('');
        var path = '', n = 240, r, j, v;
        var lane = function (i, val, max) { return (i * LANE + LANE - 10 - (val / max) * (LANE - 26)).toFixed(1); };
        for (r = 0; r < d[0]; r++) {
          var pts = [];
          for (j = 0; j <= n; j++) { var t = j / n * total; v = valores(id, t).caps[r]; pts.push(X(t) + ',' + lane(0, v, 1.12)); }
          path += '<polyline class="c-cap" points="' + pts.join(' ') + '"/>';
        }
        var pl = [], pg = [];
        for (j = 0; j <= n; j++) { var tt = j / n * total, vv = valores(id, tt); pl.push(X(tt) + ',' + lane(1, vv.let_, 1.12)); pg.push(X(tt) + ',' + lane(2, vv.goo, 11.5)); }
        path += '<polyline class="c-let" points="' + pl.join(' ') + '"/><polyline class="c-goo" points="' + pg.join(' ') + '"/>';
        // linhas de repouso de cada faixa e a marca de 100% das cápsulas (o passar do ponto fica acima dela)
        var base = '';
        for (r = 0; r < 3; r++) base += '<line class="base-faixa" x1="0" x2="' + W + '" y1="' + (r * LANE + LANE - 10) + '" y2="' + (r * LANE + LANE - 10) + '"/>';
        base += '<line class="alvo" x1="0" x2="' + W + '" y1="' + lane(0, 1, 1.12) + '" y2="' + lane(0, 1, 1.12) + '"/>';
        svg.innerHTML = base + path;
        eixo.innerHTML = [0, .25, .5, .75, 1].map(function (f) { return '<span style="left:' + (f * 100) + '%">' + u.num(Math.round(f * total / 10) * 10) + ' ms</span>'; }).join('');
      }
      function tocar(id) {
        if (!api.vivo()) return;
        ativa = id; desenhar(id); t0 = performance.now(); rodando = true;
        bs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === id)); });
        if (!api.parado) l.play(id);
      }
      api.quadro(function (agora) {
        if (!ativa) return true;
        var t = api.parado ? T.divisao + 200 : agora - t0;
        if (t >= total) { if (!api.parado && performance.now() - mexeu > 0) { k = (SEQ_TEMPO.indexOf(ativa) + 1) % SEQ_TEMPO.length; tocar(SEQ_TEMPO[k]); } return true; }
        cab.style.setProperty('--xf', (t / total).toFixed(4));
        var d = DADOS[ativa], v = valores(ativa, t), f = t < T.contracao ? 0 : t < T.divisao ? 1 : t < T.divisao + d[1] ? 2 : t < T.divisao + d[1] + T.retorno ? 3 : 4;
        qa(fases, '.fase-t').forEach(function (x, i) { x.classList.toggle('atual', i === f); });
        var media = v.caps.reduce(function (a, b) { return a + b; }, 0) / v.caps.length;
        lc.textContent = u.num(Math.round(media * 100)) + '%';
        ll.textContent = '+' + Math.round(v.let_ * AFASTA[ativa] * VB_W);
        lg.textContent = u.num(v.goo, 1);
        return true;
      });
      bs.forEach(function (b) { api.ouvir(b, 'click', function () { mexeu = performance.now(); tocar(b.dataset.f); }); });
      api.depois(api.parado ? 0 : 700, function () { tocar(SEQ_TEMPO[0]); });
      u.pararLogo(api, l);
    }
  });

  /* ---------------- 11. As 16 formas: cada logo vai até a sua, uma de cada vez ---------------- */
  S.push({
    id: 'formas', capitulo: 'Movimento', curto: 'As 16 formas', grade: 'nenhuma',
    notas: 'As dezesseis formas do I, uma por tema. Para nunca haver duas logos animando juntas, cada uma vai até a sua forma com morph(), uma de cada vez, e fica parada; depois voltam à pílula, também uma de cada vez. Passe o cursor numa forma para tocá-la de novo.',
    html: function () {
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Dezesseis formas, uma por tema.') + frase('Cada uma vai até a sua forma, uma de cada vez, e fica parada. Passe o cursor para tocar de novo.', 320) + '</div>' +
        '<div class="grade16">' + FORMAS.map(function (f, i) {
          return '<div class="cel" data-f="' + f.id + '" data-e style="--d:' + (200 + i * 30) + 'ms"><div class="cel-logo">' + logo({ classe: 'logo-cel', rotulo: 'Heild, forma ' + f.nome }) + '</div>' +
            '<p class="cel-nome"><b>' + h(f.nome) + '</b><span>' + h(f.uso) + '</span></p></div>';
        }).join('') + '</div></div>';
    },
    entrar: function (el, api) {
      var cels = qa(el, '.cel'), logos = cels.map(function (c) { return q(c, 'heild-logo'); }), ids = cels.map(function (c) { return c.dataset.f; });
      var estado = ids.map(function () { return false; }), ocupado = 0, pausaAte = 0;
      if (api.parado) { logos.forEach(function (l, i) { l.morph(ids[i]); }); return; }
      // Orb e Orbs seguem olhando enquanto são o alvo do morph; aqui, ficam parados assim que os olhos abrem.
      function congelar(l, id) {
        return new Promise(function (res) {
          var t0 = performance.now();
          api.quadro(function () {
            var m = l._m;
            if (!m || performance.now() - t0 > 6000) { res(); return false; }
            var pronto = m.eo >= 1 && m.et > 240 && m.et < 420 && (id !== 'orbs' || m.su >= 1);
            if (pronto) { l._m = null; l._anim = null; res(); return false; }
            return true;
          });
        });
      }
      function ir(i, para) {
        var l = logos[i], id = ids[i];
        ocupado = performance.now() + (para ? (id === 'orbs' ? 3400 : id === 'orb' ? 1900 : 1200) : 750);
        cels[i].classList.toggle('na-forma', para);
        l.morph(para ? id : null); estado[i] = para;
        if (para && (id === 'orb' || id === 'orbs')) return congelar(l, id).then(function () { return api.esperar(150); });
        return api.esperar(para ? 1150 : 520);
      }
      function livre() { return new Promise(function (res) { (function espera() { if (!api.vivo()) return; if (performance.now() >= Math.max(ocupado, pausaAte)) res(); else api.depois(120, espera); })(); }); }
      (async function () {
        await api.esperar(1100);
        for (;;) {
          for (var i = 0; i < ids.length; i++) { await livre(); if (!estado[i]) await ir(i, true); }
          await api.esperar(3200);
          for (var j = ids.length - 1; j >= 0; j--) { await livre(); if (estado[j]) await ir(j, false); }
          await api.esperar(900);
        }
      })().catch(function () {});
      // Passar o cursor toca a forma daquela logo (só quando nenhuma outra está se mexendo).
      var alvo = -1, tHover = 0;
      cels.forEach(function (c, i) {
        api.ouvir(c, 'pointerenter', function () {
          alvo = i; pausaAte = performance.now() + 4000;
          clearTimeout(tHover);
          var tentar = function () {
            if (alvo !== i || !api.vivo()) return;
            // espera a logo que está se mexendo assentar: nunca duas animando juntas
            if (performance.now() < ocupado) { tHover = setTimeout(tentar, 120); return; }
            pausaAte = performance.now() + 4000;
            if (estado[i]) ir(i, false).then(function () { return ir(i, true); }); else ir(i, true);
          };
          tHover = setTimeout(tentar, 140);
        });
        api.ouvir(c, 'pointerleave', function () { if (alvo === i) alvo = -1; pausaAte = performance.now() + 2500; });
      });
      api.aoSair(function () { clearTimeout(tHover); logos.forEach(function (l) { l.stop(); }); });
    }
  });

  /* ---------------- 12. O morph por molas ---------------- */
  var ITENS = [['Painel', 'painel'], ['CRM', 'conversa'], ['Timesheet', 'tempo'], ['Financeiro', 'financeiro'], ['BPO', 'bpo'], ['Arquivos', 'arquivos'], ['App do cliente', 'celular'], ['Assistente', 'orb'], ['Consultor', 'lupa'], ['Integrantes', 'orbs'], ['IA e agentes', 'ia']];
  S.push({
    id: 'molas', capitulo: 'Movimento', curto: 'O morph por molas', grade: 'direita',
    notas: 'No hover e na troca de forma, o I não corta: cada cápsula é uma mola com estado próprio (rigidez 150, amortecimento a 58% do crítico). Trocar de forma só troca o alvo; primeiro tudo recolhe rumo à pílula em 160 ms e depois abre em cascata de 55 ms. O gráfico mostra, ao vivo, o afastamento das letras lido do componente. Chacoalhe o cursor entre os itens: o I pulsa perto do centro e abre na última forma.',
    html: function () {
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Molas, não cortes.') +
        frase('Cada cápsula é uma mola. Trocar de forma só troca o alvo: posição e velocidade seguem de onde estão.', 360) +
        '<ul class="fatos fatos--lista" data-e style="--d:560ms"><li><b>150</b><span>rigidez de cada mola</span></li><li><b>58%</b><span>do amortecimento crítico: passa do ponto e assenta</span></li><li><b>160 ms</b><span>para recolher rumo à pílula</span></li><li><b>55 ms</b><span>de cascata para abrir</span></li></ul></div>' +
        '<div class="visual"><div class="palco-molas"><div class="molas-logo">' + logo({ classe: 'logo-molas' }) + '</div>' +
        '<div class="chips itens-molas" role="group" aria-label="Módulos">' + ITENS.map(function (it) { return '<button type="button" class="chip" data-f="' + it[1] + '" aria-pressed="false">' + it[0] + '</button>'; }).join('') + '</div>' +
        '<div class="osc"><svg viewBox="0 0 640 110" preserveAspectRatio="none" aria-hidden="true"><line class="osc-alvo" x1="0" x2="640" y1="100" y2="100"/><polyline class="osc-linha" points=""/></svg>' +
        '<p class="rotulo"><span>Afastamento das letras, ao vivo</span><span class="osc-valor tnum">0</span></p></div></div></div></div>';
    },
    entrar: function (el, api) {
      var l = q(el, '.logo-molas'), bs = qa(el, '.itens-molas .chip'), grupo = q(el, '.itens-molas'), linha = q(el, '.osc-linha'), alvo = q(el, '.osc-alvo'), valor = q(el, '.osc-valor');
      var hist = [], JANELA = 5000, MAX = 240, mexeu = -1e9, atual = null;
      function por(f) {
        atual = f;
        bs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === f)); });
        l.morph(f);
        var y = 100 - (f ? AFASTA[f] * VB_W : 0) / MAX * 90; alvo.setAttribute('y1', y.toFixed(1)); alvo.setAttribute('y2', y.toFixed(1));
      }
      bs.forEach(function (b) {
        var ir = function () { mexeu = performance.now(); por(b.dataset.f); };
        api.ouvir(b, 'pointerenter', ir); api.ouvir(b, 'focus', ir); api.ouvir(b, 'click', ir);
      });
      api.ouvir(grupo, 'pointerleave', function () { mexeu = performance.now(); por(null); });
      api.quadro(function (agora) {
        var s = typeof l._lastL === 'number' ? l._lastL : 0;
        hist.push([agora, s]); while (hist.length && agora - hist[0][0] > JANELA) hist.shift();
        linha.setAttribute('points', hist.map(function (p) { return (640 - (agora - p[0]) / JANELA * 640).toFixed(1) + ',' + (100 - Math.min(1.15, p[1] / MAX) * 90).toFixed(1); }).join(' '));
        valor.textContent = Math.round(s) + ' de 1259';
        return true;
      });
      if (api.parado) { por('painel'); return; }
      // Sozinho: passa pelos itens; às vezes uma rajada (o cursor chacoalhando) e o I pulsa antes de abrir.
      var k = 0, rodada = 0;
      api.depois(900, function passo() {
        if (performance.now() - mexeu > 6000) {
          rodada++;
          if (rodada % 4 === 0) {
            var a = ITENS[(k + 3) % ITENS.length][1], b = ITENS[(k + 6) % ITENS.length][1], c = ITENS[(k + 1) % ITENS.length][1];
            por(a); api.depois(110, function () { por(b); }); api.depois(220, function () { por(c); }); k = (k + 2) % ITENS.length;
          } else { por(ITENS[k][1]); k = (k + 1) % ITENS.length; }
        }
        api.depois(2600, passo);
      });
      api.aoSair(function () { l.stop(); });
    }
  });
})();
