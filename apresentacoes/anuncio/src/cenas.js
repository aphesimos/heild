/*
 * Anúncio da Heild — as cenas.
 *
 * Cada cena é uma camada (motor.js) com `montar` (o DOM e o layout do formato, uma vez) e `quadro(t)`
 * (o estado no instante t, sem ler layout). As ações nos componentes (play e morph da logo, a reação
 * dos orbs) disparam uma vez, quando t passa da marca (ANUNCIO.uma).
 *
 * Peça principal, ~25 s:
 *   abertura  0 a 7 s     o gancho (vinte sistemas batem na tela), a sucção para a pílula, a logo
 *                         tocando centralizar e o I virando orbs, que explodem no time
 *   trabalho  7 a 14 s    o pedido digitado, o Contábil e o Fiscal preparando, o cartão de aprovação
 *   lei       14 a 17 s   o Consultor e a citação (escuro, depois da onda do tema)
 *   camadas   17 a 20 s   as camadas que descem e viram uma só (escuro)
 *   final     20 a 25 s   a logo, a frase, as plataformas e "Agende uma demonstração" (claro, depois da onda)
 * Vinheta de 6 s: o gancho e o cartão final.
 *
 * Os dados das cenas são os fictícios da demonstração (apresentacoes/produto/src/dados.js). Nada inventado.
 */
(function () {
  'use strict';
  var A = window.ANUNCIO, U = A.U, F = A.formato, R = A.roteiro;
  var marca = A.marca;
  var PRINCIPAL = A.peca === 'principal';
  var RET = F.tipo === 'retrato', FEED = F.tipo === 'feed', PAI = F.tipo === 'paisagem';

  /* ---------- os integrantes (design-system/orbs.md): a cor é o token do orb ---------- */
  var INT = {
    assistente: { nome: 'Assistente', cor: '--orb-assistente', olho: '--olho-assistente' },
    consultor: { nome: 'Consultor', cor: '--orb-consultor' },
    fiscal: { nome: 'Fiscal', cor: '--orb-fiscal' },
    dp: { nome: 'DP', cor: '--orb-dp' },
    contabil: { nome: 'Contábil', cor: '--orb-contabil' },
    societario: { nome: 'Societário', cor: '--orb-societario' },
    notas: { nome: 'Notas', cor: '--orb-notas' },
    atendimento: { nome: 'Atendimento', cor: '--orb-atendimento' },
    financeiro: { nome: 'Financeiro', cor: '--orb-financeiro' },
    bpo_pagar: { nome: 'Contas a Pagar', cor: '--orb-bpo-pagar' },
    bpo_receber: { nome: 'Contas a Receber', cor: '--orb-bpo-receber' },
    bpo_conciliacao: { nome: 'Conciliação', cor: '--orb-bpo-conciliacao' },
    bpo_gerencial: { nome: 'Gerencial', cor: '--orb-bpo-gerencial' }
  };
  /* A luz do fecho: as mesmas oito do hero do site. */
  var LUZ = ['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas', 'atendimento', 'bpo_pagar'];

  function orb(pai, id, tamanho, cls) {
    var it = INT[id], o = document.createElement('orb-avatar');
    if (cls) o.className = cls;
    o.setAttribute('size', String(tamanho));
    o.setAttribute('color', 'var(' + it.cor + ')');
    if (it.olho) o.setAttribute('eye-color', 'var(' + it.olho + ')');
    o.setAttribute('mode', 'drift');
    o.setAttribute('label', it.nome);
    pai.appendChild(o);
    return o;
  }
  function reagir(o, r) { if ((o.getAttribute('reaction') || 'idle') !== r) o.setAttribute('reaction', r); }
  function cutucar(o, f) { if (o.poke) o.poke(f, { react: false }); }
  function chicote(t, t0, dur) { var p = U.seg(t, t0, t0 + (dur || 0.25)); return { p: p, e: U.vaiVolta(p), b: Math.pow(Math.sin(Math.PI * p), 2) }; }
  function transl(e, x, y, s, r, extra) {
    e.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)' + (r ? ' rotate(' + r.toFixed(2) + 'deg)' : '') +
      (s !== undefined && s !== 1 ? ' scale(' + (typeof s === 'number' ? s.toFixed(4) : s) + ')' : '') + (extra || '');
  }
  var SVG = 'http://www.w3.org/2000/svg';
  function svg(tag, pai, attrs) { var e = document.createElementNS(SVG, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (pai) pai.appendChild(e); return e; }
  var ICONE_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONE_ENVIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- a logo: medidas do wordmark (window.Heild.paths, viewBox 1259 × 387) ---------- */
  var LG = { VW: 1259, VH: 387, CX: 634.344, CY: 193.055, PW: 147.297, PH: 386.111 };
  /* Onde fica a logo do cartão final (a vinheta leva a pílula do gancho direto para lá). */
  function layoutFinal() {
    if (RET) return { w: 300, top: 230, tituloTop: 368, tam: F.fim };
    if (FEED) return { w: 270, top: 169, tituloTop: 288, tam: F.fim };
    return { w: 290, top: 58, tituloTop: 177, tam: F.fim };
  }
  function caixaLogo(w, cx, cy) {
    var h = w * LG.VH / LG.VW, x = cx - w / 2, y = cy - h / 2, k = w / LG.VW;
    return { w: w, h: h, x: x, y: y, k: k, ix: x + LG.CX * k, iy: y + LG.CY * k, pw: LG.PW * k, ph: LG.PH * k };
  }
  function colocarLogo(pai, cx, cls) {
    var m = U.el('div', 'marca ' + (cls || ''), pai);
    U.pos(m, cx.x, cx.y, cx.w);
    var l = document.createElement('heild-logo');
    l.setAttribute('label', 'Heild');
    l.style.width = '100%';
    m.appendChild(l);
    m.style.transformOrigin = U.px(cx.ix - cx.x) + ' ' + U.px(cx.iy - cx.y);
    return { caixa: m, logo: l };
  }
  /* A coluna do título no 16:9 (à esquerda) e a área do visual (à direita). */
  var COL = { x: F.L, w: 300 };
  var VIS = { x: 384, w: F.R - 384 };

  /* ===================================================================================== */
  /* abertura: o gancho, a sucção, a logo e o time                                          */
  /* ===================================================================================== */
  (function () {
    var cena = { id: 'abertura', tema: 'claro', rotulo: 'Vinte sistemas. Tudo, num lugar só. Um integrante de IA em cada setor.' };
    cena.de = -1;
    cena.ate = PRINCIPAL ? marca('time.sai') + 0.3 : marca('final.entra');
    var fichas = [], tGancho, tJuntar, tTime, L, alvo, gooEl, gooBlur, pilula, ints = [], fontes = [], borraoCena;
    var LF = layoutFinal();
    var BOLHAS = { 'WhatsApp': 1, 'E-mail': 1, 'DTE estadual': 1, 'Aprovação por mensagem': 1 };

    /* a logo da cena juntar: centro da caixa e largura */
    function caixa2() {
      if (!PRINCIPAL) return caixaLogo(LF.w, F.cx, LF.top + LF.w * LG.VH / LG.VW / 2);
      if (RET) return caixaLogo(330, F.cx, 380);
      if (FEED) return caixaLogo(320, F.cx, 252);
      return caixaLogo(400, F.cx, 180);
    }
    /* para onde o I vai no time (centro do I e escala), e a grade dos doze */
    var ALVO3 = RET ? { x: F.cx, y: 545, s: 1.32 } : FEED ? { x: F.cx, y: 402, s: 1.25 } : { x: VIS.x + VIS.w / 2, y: 226, s: 1.0 };
    var ORDEM = RET
      ? ['fiscal', 'dp', 'contabil', 'societario', 'notas', 'consultor', 'atendimento', 'financeiro', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial']
      : ['fiscal', 'dp', 'contabil', 'societario', 'notas', 'consultor', 'atendimento', 'financeiro', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'];
    function grade() {
      var cols, x0, x1, y0, y1, so;
      if (RET) { cols = 3; x0 = F.L; x1 = F.R; y0 = 350; y1 = F.B; so = 56; }
      else if (FEED) { cols = 4; x0 = F.L; x1 = F.R; y0 = 182; y1 = F.B; so = 56; }
      else { cols = 4; x0 = VIS.x; x1 = VIS.x + VIS.w; y0 = 46; y1 = F.B; so = 54; }
      var rows = Math.ceil(ORDEM.length / cols), cw = (x1 - x0) / cols, rh = (y1 - y0) / rows;
      return ORDEM.map(function (id, i) {
        var c = i % cols, r = Math.floor(i / cols);
        return { id: id, x: x0 + (c + 0.5) * cw, y: y0 + r * rh + so / 2 + (rh - so - 46) / 2, so: so, cw: cw };
      });
    }

    cena.montar = function (el) {
      var k = A.noPalco(el).k;
      L = caixa2();
      alvo = { x: L.ix, y: L.iy, w: L.pw, h: L.ph };

      /* a pílula líquida: as fichas viram cápsulas e se fundem nela (desfoque + limiar de alfa, como na logo) */
      var f = svg('filter', document.querySelector('svg.filtros defs'), { id: 'goo-abertura', x: '-20%', y: '-20%', width: '140%', height: '140%', 'color-interpolation-filters': 'sRGB' });
      gooBlur = svg('feGaussianBlur', f, { stdDeviation: '0' });
      svg('feColorMatrix', f, { values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9' });
      gooEl = U.el('div', 'goo', el);
      pilula = U.el('i', 'gota', gooEl);

      /* as vinte fichas */
      var nomes = R.conteudo.fichas, tempos = marca('gancho.fichas');
      var cols = RET ? 3 : FEED ? 4 : 5, rows = Math.ceil(nomes.length / cols);
      var rnd = U.sorteio(20261110), cel = [];
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) cel.push([c, r]);
      for (var i = cel.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tmp = cel[i]; cel[i] = cel[j]; cel[j] = tmp; }
      var cw = F.W / cols, ch = F.H / rows;
      nomes.forEach(function (nome, n) {
        var e = U.el('span', 'ficha pilula', el, (BOLHAS[nome] ? '<i class="ponto"></i>' : '') + U.h(nome));
        var q = cel[n];
        fichas.push({
          el: e, nome: nome, t: tempos[n],
          x: (q[0] + 0.5 + (rnd() - 0.5) * 0.55 + (q[1] % 2 ? 0.16 : -0.16)) * cw,
          y: (q[1] + 0.5 + (rnd() - 0.5) * 0.5) * ch,
          rot: (rnd() - 0.5) * 22, giro: (rnd() - 0.5) * 50, fase: rnd() * 6.28, sentido: rnd() < 0.5 ? -1 : 1, empurroes: []
        });
      });
      fichas.forEach(function (fi) {
        var m = A.noPalco(fi.el); fi.w = m.w; fi.h = m.h;
        fi.x = U.clamp(fi.x, fi.w * 0.3, F.W - fi.w * 0.3); fi.y = U.clamp(fi.y, fi.h, F.H - fi.h);
        fi.gota = U.el('i', 'gota', gooEl);
        fi.borrao = new A.Borrao(fi.el);
      });

      /* o título do gancho, grande, à esquerda e no meio da área segura */
      var lg = A.texto('gancho');
      tGancho = new A.Titulo(el, lg, marca('gancho.palavras'), { classe: 't-gancho', escala: 2.5, borrao: 16, tamanho: F.gancho });
      var larg = PAI ? F.R - F.L : F.R - F.L;
      tGancho.caber(larg, k);
      var hg = A.noPalco(tGancho.el).h;
      U.pos(tGancho.el, F.L, F.cy - hg / 2);
      tGancho.el.style.transformOrigin = U.px(alvo.x - F.L) + ' ' + U.px(alvo.y - (F.cy - hg / 2));
      /* as fichas debaixo do título saem do caminho quando cada palavra bate */
      var palavras = tGancho.palavras.map(function (w) { var m = A.noPalco(w.el); return { t: w.t, x0: m.x - 14, y0: m.y - 10, x1: m.x + m.w + 14, y1: m.y + m.h + 10 }; });
      fichas.forEach(function (fi) {
        var x = fi.x, y = fi.y;
        palavras.forEach(function (p) {
          var fx0 = x - fi.w / 2, fx1 = x + fi.w / 2, fy0 = y - fi.h / 2, fy1 = y + fi.h / 2;
          if (fx1 < p.x0 || fx0 > p.x1 || fy1 < p.y0 || fy0 > p.y1) {
            // fora: só a onda de choque (empurrão pequeno, para longe da palavra)
            var dx = x - (p.x0 + p.x1) / 2, dy = y - (p.y0 + p.y1) / 2, d = Math.hypot(dx, dy) || 1, a = 14 / (1 + d / 120);
            fi.empurroes.push({ t: p.t, dx: dx / d * a, dy: dy / d * a, volta: true });
            return;
          }
          var cimaY = p.y0 - fi.h / 2 - 4, baixoY = p.y1 + fi.h / 2 + 4;
          var ny = Math.abs(cimaY - y) < Math.abs(baixoY - y) ? cimaY : baixoY;
          if (ny - fi.h / 2 < 0) ny = baixoY; if (ny + fi.h / 2 > F.H) ny = cimaY;
          var nx = x + (x - (p.x0 + p.x1) / 2) * 0.18;
          fi.empurroes.push({ t: p.t, dx: nx - x, dy: ny - y });
          x = nx; y = ny;
        });
        fi.fx = x; fi.fy = y;
        var d = Math.hypot(x - alvo.x, y - alvo.y);
        fi.dist = d;
      });
      var dmax = Math.max.apply(null, fichas.map(function (fi) { return fi.dist; })) || 1;
      var suga = marca('gancho.suga');
      fichas.forEach(function (fi) {
        var q = fi.dist / dmax;
        fi.ts = suga + (1 - q) * 0.05;
        fi.te = marca('juntar.pilula') - 0.01 - (1 - q) * 0.02;
      });

      /* a logo */
      var lo = colocarLogo(el, L);
      cena.caixa = lo.caixa; cena.logo = lo.logo;
      U.opacidade(lo.caixa, 0);

      if (PRINCIPAL) {
        /* "Tudo, num lugar só." embaixo da logo, no centro */
        tJuntar = new A.Titulo(el, A.texto('juntar'), marca('juntar.palavras'), { classe: 'centro', sai: marca('juntar.sai'), tamanho: F.hero });
        U.pos(tJuntar.el, F.L, 0, F.R - F.L);
        tJuntar.caber(F.R - F.L, k);
        U.pos(tJuntar.el, F.L, L.y + L.h + (RET ? 46 : FEED ? 40 : 34), F.R - F.L);

        /* "Um integrante de IA em cada setor." */
        tTime = new A.Titulo(el, A.texto('time'), marca('time.palavras'), { tamanho: F.hero });
        if (PAI) {
          tTime.caber(COL.w, k);
          var ht = A.noPalco(tTime.el).h;
          U.pos(tTime.el, COL.x, F.cy - ht / 2 + 8);
        } else {
          tTime.caber(F.R - F.L, k);
          U.pos(tTime.el, F.L, F.T);
        }

        /* os doze integrantes: nascem das três filhas do orb da logo e vão para a grade */
        var fontesU = [[-190, 25, 230], [75, -70, 170], [230, 75, 150]];
        var kk = L.k * ALVO3.s;
        fontes = fontesU.map(function (u) { return { x: ALVO3.x + u[0] * kk, y: ALVO3.y + u[1] * kk, d: u[2] * kk }; });
        var cels = grade();
        var xs = cels.map(function (c) { return c.x; }), xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
        cels.forEach(function (c, n) {
          var fi = Math.min(2, Math.floor((c.x - xmin) / Math.max(1, xmax - xmin) * 2.999));
          var o = orb(el, c.id, c.so, 'int-orb');
          o.style.left = '0px'; o.style.top = '0px';
          U.opacidade(o, 0);
          var nome = U.el('span', 'int-nome', el, U.h(INT[c.id].nome));
          nome.style.cssText += ';font-size:16px;line-height:19px;font-weight:500;text-align:center;';
          if (PAI || FEED) { nome.style.whiteSpace = 'normal'; nome.style.width = U.px(c.cw - 6); U.pos(nome, c.x - (c.cw - 6) / 2, c.y + c.so / 2 + 8); }
          else { nome.style.whiteSpace = 'nowrap'; nome.style.width = U.px(c.cw); U.pos(nome, c.x - c.cw / 2, c.y + c.so / 2 + 8); }
          U.opacidade(nome, 0);
          var src = fontes[fi];
          ints.push({ o: o, nome: nome, c: c, src: src, d: Math.hypot(c.x - src.x, c.y - src.y) });
        });
        var porFonte = [[], [], []];
        ints.forEach(function (it) { porFonte[fontes.indexOf(it.src)].push(it); });
        porFonte.forEach(function (g) { g.sort(function (a, b) { return a.d - b.d; }).forEach(function (it, n) { it.atraso = n * 0.035 + fontes.indexOf(it.src) * 0.012; }); });
        borraoCena = new A.Borrao(el);
      }
    };

    cena.reiniciar = function () { cena.logo.stop(); ints.forEach(function (it) { it.o.removeAttribute('reaction'); }); };

    cena.quadro = function (t) {
      var suga = marca('gancho.suga'), tp = marca('juntar.pilula');

      /* ---- as fichas ---- */
      var algumaGota = false;
      for (var i = 0; i < fichas.length; i++) {
        var fi = fichas[i], a = fi.t - 0.14;
        if (t < a || t > fi.te + 0.02) { U.opacidade(fi.el, 0); fi.gota.style.visibility = 'hidden'; continue; }
        var p = U.seg(t, a, fi.t), e = U.saiCub(p);
        var s = U.lerp(2.5, 1, e), rot = fi.rot + (1 - e) * fi.giro, b = 10 * (1 - U.saiQuad(p)), op = U.clamp(p * 4);
        if (t > fi.t) s = 1 - 0.07 * Math.sin((t - fi.t) * 30) * Math.exp(-(t - fi.t) * 12);
        var x = fi.x, y = fi.y;
        for (var m = 0; m < fi.empurroes.length; m++) {
          var em = fi.empurroes[m], d = t - em.t;
          if (d <= 0) continue;
          var v = em.volta ? (d / 0.06) * Math.exp(1 - d / 0.06) : 1 - U.mola(d, 22, 0.55);
          x += em.dx * v; y += em.dy * v;
        }
        x += 1.6 * Math.sin(t * 13 + fi.fase); y += 1.6 * Math.sin(t * 11.3 + fi.fase * 1.7); rot += 1.3 * Math.sin(t * 9 + fi.fase * 2.3);
        var sx = s, sy = s, bx = 0;
        if (t > fi.ts) {
          /* sucção: recua um pouco, acelera para a pílula girando em espiral e estica no sentido do movimento */
          var u = U.seg(t, fi.ts, fi.te), ant = Math.sin(Math.PI * U.seg(u, 0, 0.22)) * 0.07, e2 = U.entraCub(U.seg(u, 0.14, 1));
          var dx0 = x - alvo.x, dy0 = y - alvo.y, ang = e2 * 0.85 * fi.sentido, ca = Math.cos(ang), sa = Math.sin(ang), k1 = (1 + ant) * (1 - e2);
          x = alvo.x + (dx0 * ca - dy0 * sa) * k1; y = alvo.y + (dx0 * sa + dy0 * ca) * k1;
          var vn = U.clamp(Math.pow(U.seg(u, 0.14, 1), 2) * 1.6);
          var dir = Math.atan2(alvo.y - y, alvo.x - x) * 180 / Math.PI;
          while (dir - rot > 90) dir -= 180; while (dir - rot < -90) dir += 180;
          rot = U.lerp(rot, dir, U.seg(u, 0.12, 0.45));
          var enc = U.lerp(1, 0.32, e2);
          sx = s * (1 + 1.2 * vn) * enc; sy = s * (1 - 0.45 * vn) * enc; bx = 14 * vn;
          op *= 1 - U.seg(u, 0.32, 0.52);
          if (u > 0.32 && u < 1) {
            var gw = Math.max(16, fi.w * sx), gh = Math.max(11, fi.h * sy);
            var g = fi.gota.style;
            g.visibility = 'visible'; g.width = U.px(gw); g.height = U.px(gh);
            g.transform = 'translate(' + (x - gw / 2).toFixed(2) + 'px,' + (y - gh / 2).toFixed(2) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
            algumaGota = true;
          } else fi.gota.style.visibility = 'hidden';
        } else fi.gota.style.visibility = 'hidden';
        U.opacidade(fi.el, op);
        if (op > 0) {
          fi.el.style.transform = 'translate(' + (x - fi.w / 2).toFixed(2) + 'px,' + (y - fi.h / 2).toFixed(2) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
          fi.borrao.xy(bx, 0, b > 0.05 ? 'blur(' + b.toFixed(2) + 'px)' : '');
        }
      }

      /* ---- o título do gancho: bate, e é sugado junto ---- */
      tGancho.quadro(t);
      var us = U.seg(t, suga + 0.04, tp - 0.02);
      if (us > 0) {
        var es = U.entraCub(us);
        tGancho.el.style.transform = 'scale(' + U.lerp(1, 0.04, es).toFixed(4) + ') rotate(' + (es * 14).toFixed(2) + 'deg)';
        tGancho.el.style.filter = U.borrao(18 * us);
        U.opacidade(tGancho.el, 1 - U.seg(us, 0.55, 1));
      } else { tGancho.el.style.transform = 'none'; tGancho.el.style.filter = 'none'; U.opacidade(tGancho.el, 1); }

      /* ---- a pílula líquida ---- */
      var tl = marca('juntar.logo'), gp = U.seg(t, tp - 0.14, tp), gooV = 5.5 * U.seg(t, suga + 0.07, suga + 0.24) * (1 - U.seg(t, tp + 0.02, tl + 0.02));
      if (t > tp - 0.14 && t < tl + 0.08) {
        var dd = t - tp, wq, hq;
        if (dd < 0) { var ge = U.saiCub(gp); wq = alvo.w * ge; hq = alvo.h * 0.9 * ge; }
        else { var mo = U.mola(dd, 26, 0.42); hq = alvo.h * (1 + 0.12 * mo); wq = alvo.w * (1 - 0.1 * mo); }
        var ps = pilula.style;
        ps.visibility = 'visible'; ps.width = U.px(Math.max(1, wq)); ps.height = U.px(Math.max(1, hq));
        ps.transform = 'translate(' + (alvo.x - wq / 2).toFixed(2) + 'px,' + (alvo.y - hq / 2).toFixed(2) + 'px)';
        ps.opacity = String(1 - U.seg(t, tl, tl + 0.06));
      } else pilula.style.visibility = 'hidden';
      if (gooV > 0.3 && (algumaGota || t < tl)) { gooBlur.setAttribute('stdDeviation', gooV.toFixed(2)); if (gooEl._f !== 1) { gooEl.style.filter = 'url(#goo-abertura)'; gooEl._f = 1; } }
      else if (gooEl._f !== 0) { gooEl.style.filter = 'none'; gooEl._f = 0; }

      /* ---- a logo: as letras saem de trás da pílula ---- */
      var cx = cena.caixa;
      U.opacidade(cx, U.seg(t, tl - 0.02, tl + 0.04));
      if (t >= tl - 0.02) {
        var qr = U.saiCub(U.seg(t, tl, tl + 0.24));
        if (qr < 1) cx.style.clipPath = 'inset(0 ' + (43.77 * (1 - qr)).toFixed(3) + '% 0 ' + (44.53 * (1 - qr)).toFixed(3) + '%)';
        else if (cx.style.clipPath !== 'none') cx.style.clipPath = 'none';
      }
      var sLogo = 1 + 0.05 * (1 - U.saiCub(U.seg(t, tl, tl + 0.3)));
      if (PRINCIPAL) {
        A.uma(cena, 'centralizar', t, marca('juntar.centralizar'), function () { cena.logo.play('centralizar'); });
        A.uma(cena, 'orbs', t, marca('time.orbs'), function () { cena.logo.morph('orbs'); });
        /* o I desce para o meio do time e cresce; HE e LD somem por uma máscara */
        var mv = U.vaiVolta(U.seg(t, 3.2, 3.8)), dxl = (ALVO3.x - alvo.x) * mv, dyl = (ALVO3.y - alvo.y) * mv, sl = U.lerp(1, ALVO3.s, mv) * sLogo;
        transl(cx, dxl, dyl, sl);
        var mk = U.vaiVolta(U.seg(t, 3.15, 3.7));
        if (mk > 0) {
          var aa = (1 - mk).toFixed(3), mm = 'linear-gradient(90deg, rgba(0,0,0,' + aa + ') 0%, rgba(0,0,0,' + aa + ') 21%, #000 25.5%, #000 74.5%, rgba(0,0,0,' + aa + ') 79%, rgba(0,0,0,' + aa + ') 100%)';
          cx.style.webkitMaskImage = cx.style.maskImage = mm;
        } else cx.style.webkitMaskImage = cx.style.maskImage = 'none';
        var E = marca('time.explode');
        if (t >= E) U.opacidade(cx, 1 - U.seg(t, E, E + 0.05));

        tJuntar.quadro(t);
        tTime.quadro(t);

        /* ---- a explosão no time ---- */
        for (var n = 0; n < ints.length; n++) {
          var it = ints[n], tau = t - (E + it.atraso);
          if (tau < 0) { U.opacidade(it.o, 0); U.opacidade(it.nome, 0); continue; }
          var mo2 = U.mola(tau, 11.5, 0.62), so0 = it.src.d / it.c.so;
          var ox = it.c.x + (it.src.x - it.c.x) * mo2, oy = it.c.y + (it.src.y - it.c.y) * mo2;
          var sc = 1 + (so0 - 1) * U.clamp(mo2, -0.2, 1) + 0.12 * Math.exp(-tau * 9) * Math.sin(tau * 18);
          U.opacidade(it.o, 1);
          it.o.style.transform = 'translate(' + (ox - it.c.so / 2).toFixed(2) + 'px,' + (oy - it.c.so / 2).toFixed(2) + 'px) scale(' + sc.toFixed(4) + ')';
          var bo = 4.5 * Math.pow(U.clamp(mo2), 1.4);
          it.o.style.filter = bo > 0.1 ? 'blur(' + bo.toFixed(2) + 'px) drop-shadow(var(--sombra-orb))' : '';
          A.uma(cena, 'cutuca' + n, t, E + it.atraso + 0.34, function (o) { return function () { cutucar(o, 0.55); }; }(it.o));
          var qn = U.seg(tau, 0.22, 0.42);
          U.opacidade(it.nome, qn);
          it.nome.style.transform = 'translateY(' + ((1 - U.saiCub(qn)) * 8).toFixed(2) + 'px)';
        }

        /* ---- saída em chicote para a esquerda ---- */
        var ch = chicote(t, marca('time.sai'));
        if (ch.p > 0) { cena.el.style.transform = 'translateX(' + (-F.W * ch.e).toFixed(2) + 'px)'; borraoCena.xy(42 * ch.b, 0); }
        else if (cena.el.style.transform) { cena.el.style.transform = ''; borraoCena.xy(0, 0); }
      } else {
        transl(cx, 0, 0, sLogo);
      }
    };
    A.cena(cena);
  })();

  /* ===================================================================================== */
  /* trabalho: o pedido, o Contábil e o Fiscal preparando, o cartão de aprovação           */
  /* ===================================================================================== */
  if (PRINCIPAL) (function () {
    var cena = { id: 'trabalho', tema: 'claro', rotulo: 'Ele prepara. Você aprova.' };
    cena.de = marca('prepara.entra');
    cena.ate = marca('aprova.onda') + R.onda + 0.05;
    var D = {}, G, borraoCena, borraoTopo;
    var pedido = R.conteudo.pedido, dig = A.pecaDados.digitacao;

    cena.montar = function (el) {
      var k = A.noPalco(el).k;
      if (RET) G = { x0: F.L, cw: F.R - F.L, campoY: F.T + 92, campoH: 92, duplaY: F.T + 216, duplaH: 124, so: 66, c1Y: F.T + 368, c2Y: F.T + 480, cH: 100, co: 36, aprY: F.T + 96, ao: 50 };
      else if (FEED) G = { x0: F.L, cw: F.R - F.L, campoY: F.T + 78, campoH: 84, duplaY: F.T + 186, duplaH: 116, so: 60, c1Y: F.T + 324, c2Y: F.T + 424, cH: 88, co: 32, aprY: F.T + 82, ao: 46 };
      else G = { x0: VIS.x, cw: VIS.w, campoY: 40, campoH: 78, duplaY: 136, duplaH: 104, so: 54, c1Y: 252, c2Y: 326, cH: 66, co: 26, aprY: 36, ao: 44 };

      /* títulos */
      function titulo(nome, tempos, sai) {
        var tt = new A.Titulo(el, A.texto(nome), tempos, { tamanho: F.hero, sai: sai });
        if (PAI) { tt.caber(COL.w, k); var h = A.noPalco(tt.el).h; U.pos(tt.el, COL.x, F.cy - h / 2 + 8); }
        else { tt.caber(F.R - F.L, k); U.pos(tt.el, F.L, F.T); }
        return tt;
      }
      D.tPrepara = titulo('prepara', marca('prepara.palavras'), marca('prepara.sai'));
      D.tAprova = titulo('aprova', marca('aprova.palavras'));

      /* um grupo de cima (campo e dupla), que sai junto em chicote para cima */
      D.topo = U.el('div', 'topo', el); D.topo.style.cssText += ';left:0;top:0;width:100%;height:100%;';
      borraoTopo = new A.Borrao(D.topo);

      /* o campo do Assistente */
      D.campo = U.el('div', 'campo', D.topo);
      U.pos(D.campo, G.x0, G.campoY, G.cw, G.campoH);
      D.campo.style.position = 'absolute';
      var ct = U.el('div', 'campo-texto', D.campo);
      D.digitado = U.el('span', '', ct); D.cursor = U.el('i', 'cursor-texto', ct);
      D.dica = U.el('span', 'dica', ct, 'Peça ao Assistente…');
      D.enviar = U.el('span', 'enviar', D.campo, ICONE_ENVIAR);

      /* a dupla: Contábil e Fiscal, ligados por um fio pontilhado */
      D.dupla = U.el('div', 'dupla', D.topo);
      D.dupla.style.position = 'absolute';
      U.pos(D.dupla, G.x0, G.duplaY, G.cw, G.duplaH);
      function elo(id, x) {
        var e = U.el('div', 'elo', D.dupla); e.style.left = U.px(x - 85);
        var o = orb(e, id, G.so);
        U.el('b', '', e, U.h(INT[id].nome));
        var est = U.el('span', 'estado', e, 'disponível');
        return { el: e, o: o, est: est, x: G.x0 + x, y: G.duplaY + G.so / 2 };
      }
      D.eC = elo('contabil', 85); D.eF = elo('fiscal', G.cw - 85);

      /* a viagem: as cápsulas e o fio, num SVG do tamanho do palco */
      D.via = svg('svg', null, { width: F.W, height: F.H, viewBox: '0 0 ' + F.W + ' ' + F.H, 'aria-hidden': 'true' });
      D.via.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
      D.topo.appendChild(D.via);
      var r0 = G.so / 2 + 10, x1 = D.eC.x + r0, x2 = D.eF.x - r0, y = D.eC.y;
      svg('line', D.via, { x1: x1, y1: y, x2: x2, y2: y, class: 'fio-base' });
      D.cheio = svg('line', D.via, { x1: x1, y1: y, x2: x2, y2: y, class: 'fio-cheio' });
      D.fioLen = x2 - x1;
      D.cheio.style.strokeDasharray = D.fioLen.toFixed(1); D.cheio.style.strokeDashoffset = D.fioLen.toFixed(1);
      function capsula() {
        var g = svg('g', D.via, {}), rs = [];
        for (var i = 3; i >= 1; i--) rs.push([svg('circle', g, { r: (4.2 - i * 0.8).toFixed(1), class: 'rastro' }), i]);
        var c = svg('rect', g, { x: -12, y: -6, width: 24, height: 12, rx: 6, class: 'capsula' });
        g.style.visibility = 'hidden';
        return { g: g, c: c, rs: rs };
      }
      D.cap1 = capsula(); D.cap2 = capsula();
      D.c1x0 = G.x0 + G.cw - 12 - F.ui * 1.1; D.c1y0 = G.campoY + G.campoH / 2;

      /* os cartões que se empilham */
      function linha(y, id, rot, val, seloTipo, seloTxt) {
        var c = U.el('div', 'cartao c-linha', el);
        U.pos(c, G.x0, y, G.cw, G.cH);
        orb(c, id, G.co);
        U.el('div', 'txt', c, '<span class="rot">' + U.h(rot) + '</span><span class="val">' + U.h(val) + '</span>');
        var s = seloTipo ? U.el('span', 'selo selo--' + seloTipo, c, U.h(seloTxt)) : null;
        return { el: c, selo: s, y: y };
      }
      D.c1 = linha(G.c1Y, 'contabil', 'Conciliação de outubro', '211 de 214 casados', 'sucesso', 'Concluído');
      D.c2 = linha(G.c2Y, 'fiscal', 'ISS · vence 20/11', 'R$ 4.812,40', 'atencao', 'Pede aprovação');

      /* o cartão de aprovação (o PGDAS-D de outubro, da demonstração) */
      var ap = D.ap = U.el('div', 'cartao aprovacao', el);
      U.pos(ap, G.x0, G.aprY, G.cw);
      var quem = U.el('div', 'quem', ap);
      D.apOrb = orb(quem, 'fiscal', G.ao);
      reagir(D.apOrb, 'needs');
      var qt = U.el('div', '', quem, '<b>Fiscal</b>');
      D.apEst = U.el('span', '', qt, 'pede a sua aprovação');
      U.el('div', 'o-que', ap, '<b>Transmitir o PGDAS-D de outubro</b><span>14 clientes do Simples Nacional</span>');
      U.el('dl', '', ap, '<div><dt>Competência</dt><dd>10/2026</dd></div><div><dt>Total de DAS</dt><dd>R$ 38.402,15</dd></div>');
      var dec = U.el('div', 'decisao', ap);
      D.botoes = U.el('div', 'botoes', dec, '<span class="botao b-aprovar">Aprovar</span><span class="botao botao--fantasma">Editar e aprovar</span>');
      D.bAprovar = D.botoes.querySelector('.b-aprovar');
      D.carimbo = U.el('div', 'carimbo', dec, ICONE_CHECK + '<span>Aprovado por você</span>');
      D.barra = U.el('div', 'barra', dec, '<span class="trilho"><i></i></span><span class="cont">0 de 14 transmitidas</span>');
      D.trilho = D.barra.querySelector('.trilho i'); D.cont = D.barra.querySelector('.cont');
      U.opacidade(D.carimbo, 0); U.opacidade(D.barra, 0);
      if (PAI) { ap.style.padding = '20px 22px 18px'; ap.style.gap = '13px'; }
      D.apCaixa = A.noPalco(ap);
      ap.style.transformOrigin = '50% 50%';
      var bA = A.noPalco(D.bAprovar); D.alvoDedo = { x: bA.x + bA.w * 0.5, y: bA.y + bA.h * 0.55 };
      var ic = A.noPalco(D.carimbo.querySelector('svg')); A.origemOndaEscura = { x: ic.x + ic.w / 2, y: ic.y + ic.h / 2 };

      /* o dedo */
      D.dedo = U.el('div', 'dedo', el); D.anel = U.el('div', 'anel', el);
      U.opacidade(D.dedo, 0); U.opacidade(D.anel, 0);
      borraoCena = new A.Borrao(el);
      [D.c1.el, D.c2.el].forEach(function (c) { c.style.left = '0px'; c.style.top = '0px'; });
    };

    function viajar(cap, t, t0, t1, ponto) {
      var u = U.seg(t, t0, t1);
      if (u <= 0 || u >= 1) { cap.g.style.visibility = 'hidden'; return u; }
      cap.g.style.visibility = 'visible';
      var e = U.vaiVolta(u), p = ponto(e), q = ponto(Math.min(1, e + 0.01)), ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      var esc = 0.75 + 0.45 * Math.sin(Math.PI * u), alfa = Math.min(1, u * 8, (1 - u) * 8);
      cap.c.setAttribute('transform', 'translate(' + p[0].toFixed(2) + ' ' + p[1].toFixed(2) + ') rotate(' + ang.toFixed(2) + ') scale(' + (esc * 1.3).toFixed(3) + ' ' + (1 / esc).toFixed(3) + ')');
      cap.c.style.opacity = alfa.toFixed(3);
      cap.rs.forEach(function (r) { var q2 = ponto(U.vaiVolta(Math.max(0, u - r[1] * 0.045))); r[0].setAttribute('cx', q2[0].toFixed(2)); r[0].setAttribute('cy', q2[1].toFixed(2)); r[0].style.opacity = (alfa * (0.55 - r[1] * 0.13)).toFixed(3); });
      return u;
    }
    function entrarCartao(c, t, t0, saiT, alvoX, alvoY) {
      var tau = t - t0;
      if (tau < 0) { U.opacidade(c.el, 0); return; }
      var mo = U.mola(tau, 16, 0.6), y = c.y + 34 * mo, s = 1 - 0.06 * U.clamp(mo, -1, 1), b = 6 * U.clamp(mo), op = U.clamp(tau / 0.08);
      var x = G.x0;
      if (t > saiT) {
        var q = U.entraCub(U.seg(t, saiT, saiT + 0.2));
        x = U.lerp(x, alvoX - G.cw / 2, q); y = U.lerp(y, alvoY - G.cH / 2, q); s *= 1 - 0.35 * q; op *= 1 - q; b += 8 * q;
      }
      U.opacidade(c.el, op);
      c.el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
      c.el.style.filter = U.borrao(b);
    }

    cena.reiniciar = function () { [D.eC.o, D.eF.o].forEach(function (o) { o.removeAttribute('reaction'); }); reagir(D.apOrb, 'needs'); };

    cena.quadro = function (t) {
      /* entrada em chicote, da direita */
      var ch = chicote(t, marca('prepara.entra'));
      if (ch.p < 1) { cena.el.style.transform = 'translateX(' + (F.W * (1 - ch.e)).toFixed(2) + 'px)'; borraoCena.xy(42 * ch.b, 0); }
      else if (cena.el._x !== 1) { cena.el.style.transform = ''; borraoCena.xy(0, 0); cena.el._x = 1; }

      D.tPrepara.quadro(t); D.tAprova.quadro(t);

      /* o pedido sendo digitado */
      var n = Math.max(0, Math.min(pedido.length, Math.floor((t - dig.de) / dig.passo) + 1));
      if (t < dig.de) n = 0;
      if (D._n !== n) { D.digitado.textContent = pedido.slice(0, n); D._n = n; }
      U.opacidade(D.dica, n ? 0 : 1);
      var digitando = t >= dig.de && t < dig.de + pedido.length * dig.passo + 0.1;
      U.opacidade(D.cursor, (digitando || Math.floor(t * 2.4) % 2 === 0) && t < marca('prepara.enviar') ? 1 : 0);
      var te = marca('prepara.enviar'), pe = t - te;
      var sEnv = pe > 0 && pe < 0.3 ? 1 - 0.14 * Math.sin(Math.PI * U.seg(pe, 0, 0.16)) : 1;
      D.enviar.style.transform = 'scale(' + sEnv.toFixed(4) + ')';
      var sCampo = pe > 0 ? 1 + 0.025 * U.mola(pe, 22, 0.4) * (pe < 0.5 ? 1 : 0) : 1;

      /* a dupla aparece quando o pedido sai */
      [D.eC, D.eF].forEach(function (e, i) {
        var tau = t - (te + 0.04 + i * 0.07);
        if (tau < 0) { U.opacidade(e.el, 0); return; }
        var mo = U.mola(tau, 15, 0.5);
        U.opacidade(e.el, U.clamp(tau / 0.08));
        e.el.style.transform = 'translateY(' + (16 * mo).toFixed(2) + 'px) scale(' + (1 - 0.25 * U.clamp(mo, -1, 1)).toFixed(4) + ')';
      });
      var tc = marca('prepara.contabil'), tfi = marca('prepara.fiscal');
      A.uma(cena, 'c-trab', t, tc, function () { reagir(D.eC.o, 'working'); D.eC.est.textContent = 'trabalhando'; cutucar(D.eC.o, 0.6); });
      A.uma(cena, 'c-fim', t, marca('prepara.cartao1') + 0.05, function () { reagir(D.eC.o, 'done'); D.eC.est.textContent = 'concluído'; });
      A.uma(cena, 'f-trab', t, tfi, function () { reagir(D.eF.o, 'working'); D.eF.est.textContent = 'trabalhando'; cutucar(D.eF.o, 0.7); });
      A.uma(cena, 'f-pede', t, marca('prepara.pede'), function () { reagir(D.eF.o, 'needs'); D.eF.est.textContent = 'precisa de você'; });

      /* as cápsulas: do campo ao Contábil, do Contábil ao Fiscal */
      var ax = D.c1x0, ay = D.c1y0, bx = D.eC.x, by = D.eC.y - G.so / 2 - 4, cxp = (ax + bx) / 2, cyp = Math.min(ay, by) - 60;
      viajar(D.cap1, t, te + 0.02, tc - 0.02, function (e) { var u = 1 - e; return [u * u * ax + 2 * u * e * cxp + e * e * bx, u * u * ay + 2 * u * e * cyp + e * e * by]; });
      var r0 = G.so / 2 + 10, x1 = D.eC.x + r0, x2 = D.eF.x - r0, y = D.eC.y;
      var up = viajar(D.cap2, t, marca('prepara.passa'), tfi, function (e) { return [x1 + (x2 - x1) * e, y]; });
      var fill = t >= tfi ? 1 : U.vaiVolta(up);
      D.cheio.style.strokeDashoffset = (D.fioLen * (1 - fill)).toFixed(1);

      /* saída: o topo sobe em chicote; os cartões entram no cartão de aprovação */
      var ts = marca('prepara.sai'), cs = chicote(t, ts, 0.22);
      if (cs.p > 0) { D.topo.style.transform = 'translateY(' + (-F.H * 0.45 * U.entraCub(cs.p)).toFixed(2) + 'px)'; borraoTopo.xy(0, 24 * cs.b); U.opacidade(D.topo, 1 - U.seg(cs.p, 0.5, 1)); }
      else { D.topo.style.transform = 'none'; borraoTopo.xy(0, 0); U.opacidade(D.topo, 1); }
      D.campo.style.transform = 'scale(' + sCampo.toFixed(4) + ')';
      var acx = D.apCaixa.x + D.apCaixa.w / 2, acy = D.apCaixa.y + D.apCaixa.h / 2;
      entrarCartao(D.c1, t, marca('prepara.cartao1') - 0.08, ts, acx, acy);
      entrarCartao(D.c2, t, marca('prepara.cartao2') - 0.08, ts, acx, acy);
      var ps = t - marca('prepara.pede');
      U.opacidade(D.c2.selo, U.seg(ps, 0, 0.1));
      D.c2.selo.style.transform = 'scale(' + (ps > 0 ? 1 + 0.25 * U.mola(ps, 20, 0.5) : 0.8).toFixed(4) + ')';

      /* o cartão de aprovação entra com zoom */
      var ta = ts + 0.06, tau = t - ta;
      if (tau < 0) U.opacidade(D.ap, 0);
      else {
        var mo = U.mola(tau, 14, 0.58);
        U.opacidade(D.ap, U.clamp(tau / 0.08));
        D.ap.style.transform = 'scale(' + (1 - 0.42 * mo).toFixed(4) + ')';
        D.ap.style.filter = U.borrao(10 * U.clamp(mo));
      }

      /* o toque em Aprovar, o carimbo e as 14 transmissões */
      var td = marca('aprova.dedo'), tq = marca('aprova.toque'), tk = marca('aprova.carimbo');
      if (t >= td && t < tq + 0.5) {
        var md = U.vaiVolta(U.seg(t, td, tq - 0.1)), dx = U.lerp(D.alvoDedo.x + 120, D.alvoDedo.x, md), dy = U.lerp(D.alvoDedo.y + 190, D.alvoDedo.y, md);
        var press = t > tq - 0.07 ? 1 - 0.2 * Math.sin(Math.PI * U.seg(t, tq - 0.07, tq + 0.09)) : 1;
        U.opacidade(D.dedo, U.seg(t, td, td + 0.12) * (1 - U.seg(t, tq + 0.1, tq + 0.26)));
        D.dedo.style.transform = 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' + press.toFixed(4) + ')';
      } else U.opacidade(D.dedo, 0);
      var pa = U.seg(t, tq, tq + 0.3);
      if (pa > 0 && pa < 1) { U.opacidade(D.anel, 0.75 * (1 - pa)); D.anel.style.transform = 'translate(' + D.alvoDedo.x.toFixed(2) + 'px,' + D.alvoDedo.y.toFixed(2) + 'px) scale(' + (1 + 1.8 * U.saiCub(pa)).toFixed(4) + ')'; }
      else U.opacidade(D.anel, 0);
      var bpress = t > tq - 0.06 && t < tq + 0.12 ? 1 - 0.05 * Math.sin(Math.PI * U.seg(t, tq - 0.06, tq + 0.12)) : 1;
      D.bAprovar.style.transform = 'scale(' + bpress.toFixed(4) + ')';
      U.opacidade(D.botoes, 1 - U.seg(t, tk - 0.08, tk));
      var tauK = t - tk;
      if (tauK >= 0) {
        U.opacidade(D.carimbo, U.clamp(tauK / 0.05));
        var mk = U.mola(tauK, 18, 0.45);
        D.carimbo.style.transform = 'scale(' + (1 + 0.45 * mk).toFixed(4) + ')';
        D.carimbo.style.filter = U.borrao(6 * U.clamp(mk));
      } else U.opacidade(D.carimbo, 0);
      A.uma(cena, 'aprovado', t, tk, function () { reagir(D.apOrb, 'done'); D.apEst.textContent = 'aprovado · transmitindo'; cutucar(D.apOrb, 0.7); });
      var tr = marca('aprova.transmite'), qtr = U.seg(t, tr[0], tr[1]), nt = t >= tr[1] ? 14 : Math.floor(qtr * 14 + 1e-6);
      U.opacidade(D.barra, U.seg(t, tk + 0.08, tk + 0.2));
      D.trilho.style.width = (U.saiQuad(qtr) * 100).toFixed(2) + '%';
      if (D._nt !== nt) { D.cont.textContent = nt + ' de 14 transmitidas'; D._nt = nt; }
      A.uma(cena, 'transmitiu', t, tr[1], function () { D.apEst.textContent = 'transmitiu as 14 declarações'; });
    };
    A.cena(cena);
  })();

  /* ===================================================================================== */
  /* lei: o Consultor responde com o artigo e a data (escuro)                              */
  /* ===================================================================================== */
  if (PRINCIPAL) (function () {
    var cena = { id: 'lei', tema: 'escuro', rotulo: 'A lei, com o artigo e a data.' };
    cena.de = marca('aprova.onda');
    cena.ate = marca('lei.sai') + 0.3;
    var D = {}, borraoCena;
    cena.montar = function (el) {
      var k = A.noPalco(el).k, x0, cw, y;
      D.titulo = new A.Titulo(el, A.texto('lei'), marca('lei.palavras'), { tamanho: F.hero });
      if (PAI) { D.titulo.caber(COL.w, k); var h = A.noPalco(D.titulo.el).h; U.pos(D.titulo.el, COL.x, F.cy - h / 2 + 8); x0 = VIS.x; cw = VIS.w; y = 46; }
      else { D.titulo.caber(F.R - F.L, k); U.pos(D.titulo.el, F.L, F.T); x0 = F.L; cw = F.R - F.L; y = F.T + A.noPalco(D.titulo.el).h + (RET ? 34 : 22); }
      /* a pergunta, como o balão de quem pede */
      D.bolha = U.el('div', 'bolha', el, 'A Clínica Sorriso pode usar o fator R em 2027?');
      D.bolha.style.maxWidth = U.px(RET ? 340 : FEED ? 360 : 330);
      D.bolha.style.left = '0px'; D.bolha.style.top = U.px(y);
      var mb = A.noPalco(D.bolha);
      D.bolha.style.left = U.px(x0 + cw - mb.w);
      y += mb.h + (PAI ? 16 : RET ? 24 : 18);
      /* a resposta: o Consultor e a citação */
      var c = D.card = U.el('div', 'cartao citacao', el);
      U.pos(c, x0, y, cw);
      if (PAI) { c.style.padding = '18px 22px'; c.style.gap = '8px'; }
      var q = U.el('div', 'consultor', c);
      D.orb = orb(q, 'consultor', RET ? 72 : FEED ? 64 : 54);
      reagir(D.orb, 'thinking');
      var qt = U.el('div', '', q, '<b>Consultor</b>');
      D.est = U.el('span', '', qt, 'pensando');
      function mascara(cls, txt) { var m = U.el('div', 'mascara', c); return U.el('span', cls, m, U.h(txt)); }
      D.norma = mascara('norma', 'LC 123/2006, art. 18, § 5º-M, I');
      D.com = mascara('com', 'com o § 5º-B, XX');
      D.divisa = U.el('div', 'divisa', c);
      D.vig = mascara('vig', 'vigente desde 01/01/2018');
      D.selo = U.el('span', 'selo selo--sucesso', c, 'Segurança alta');
      /* o cartão cresce com a resposta: começa só com o Consultor e abre linha a linha */
      var mc = A.noPalco(c), mq = A.noPalco(q);
      D.hCheio = mc.h; D.hCab = mq.y + mq.h - mc.y + (PAI ? 18 : 22);
      borraoCena = new A.Borrao(el);
    };
    cena.reiniciar = function () { reagir(D.orb, 'thinking'); };
    cena.quadro = function (t) {
      /* entra pela onda do tema, que nasce no check do carimbo */
      var o = A.origemOndaEscura || { x: F.W / 2, y: F.H / 2 };
      A.onda(cena.el, t, marca('aprova.onda'), o.x, o.y);
      D.titulo.quadro(t);
      var tb = t - (marca('aprova.onda') + 0.28);
      U.opacidade(D.bolha, U.clamp(tb / 0.08));
      D.bolha.style.transform = tb > 0 ? 'scale(' + (1 - 0.14 * U.mola(tb, 16, 0.55)).toFixed(4) + ')' : 'scale(0.86)';
      var tcar = t - (marca('aprova.onda') + 0.45);
      U.opacidade(D.card, U.clamp(tcar / 0.1));
      D.card.style.transform = 'translateY(' + (tcar > 0 ? 18 * U.mola(tcar, 14, 0.62) : 18).toFixed(2) + 'px)';
      A.uma(cena, 'responde', t, marca('lei.responde'), function () { reagir(D.orb, 'working'); D.est.textContent = 'respondendo'; });
      var ls = marca('lei.linhas');
      var abre = U.vaiVolta(U.seg(t, ls[0] - 0.12, marca('lei.seguranca') + 0.05)), hv = U.lerp(D.hCab, D.hCheio, abre);
      D.card.style.clipPath = abre >= 1 ? 'none' : 'inset(0 0 ' + (D.hCheio - hv).toFixed(2) + 'px 0 round var(--raio-cartao))';
      [D.norma, D.com, D.vig].forEach(function (e, i) {
        var q = U.saiCub(U.seg(t, ls[i] - 0.06, ls[i] + 0.26));
        e.style.transform = 'translateY(' + ((1 - q) * 110).toFixed(2) + '%)';
        U.opacidade(e, q > 0 ? 1 : 0);
      });
      D.divisa.style.transform = 'scaleX(' + U.saiCub(U.seg(t, ls[1] + 0.06, ls[1] + 0.4)).toFixed(4) + ')';
      var tsg = marca('lei.seguranca'), d = t - tsg;
      U.opacidade(D.selo, U.clamp(d / 0.06));
      D.selo.style.transform = d > 0 ? 'scale(' + (1 + 0.5 * U.mola(d, 18, 0.45)).toFixed(4) + ')' : 'scale(0.5)';
      A.uma(cena, 'respondeu', t, tsg + 0.04, function () { reagir(D.orb, 'done'); D.est.textContent = 'respondeu, com a fonte'; cutucar(D.orb, 0.6); });
      /* sai em chicote para cima */
      var ch = chicote(t, marca('lei.sai'));
      if (ch.p > 0) { cena.el.style.transform = 'translateY(' + (-F.H * ch.e).toFixed(2) + 'px)'; borraoCena.xy(0, 42 * ch.b); }
      else if (cena.el.style.transform) { cena.el.style.transform = ''; borraoCena.xy(0, 0); }
    };
    A.cena(cena);
  })();

  /* ===================================================================================== */
  /* camadas: os planos descem e viram um só (escuro)                                      */
  /* ===================================================================================== */
  if (PRINCIPAL) (function () {
    var cena = { id: 'camadas', tema: 'escuro', rotulo: 'Um sistema no lugar de vinte.' };
    cena.de = marca('lei.sai');
    cena.ate = marca('camadas.onda') + R.onda + 0.05;
    var D = {}, borraoCena, NOMES = ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'BPO', 'App do cliente'];
    /* a pilha fica à esquerda da área do desenho e os nomes, numa coluna à direita, fora dos planos */
    var G = RET ? { s: 172, y0: 352, sp: 48, x0: F.L } : FEED ? { s: 168, y0: 232, sp: 40, x0: F.L } : { s: 158, y0: 112, sp: 36, x0: VIS.x };
    G.rw = G.s * Math.SQRT2; G.cx = G.x0 + G.rw / 2 + 6; G.xr = G.cx + G.rw / 2 + 10;
    cena.montar = function (el) {
      var k = A.noPalco(el).k;
      D.titulo = new A.Titulo(el, A.texto('camadas'), marca('camadas.palavras'), { tamanho: F.hero });
      if (PAI) { D.titulo.caber(COL.w, k); var h = A.noPalco(D.titulo.el).h; U.pos(D.titulo.el, COL.x, F.cy - h / 2 + 8); }
      else { D.titulo.caber(F.R - F.L, k); U.pos(D.titulo.el, F.L, F.T); }
      var n = NOMES.length, yb = G.y0 + n * G.sp, rw = G.s * Math.SQRT2;
      G.yb = yb;
      D.pilha = U.el('div', 'pilha', el); D.pilha.style.cssText += ';left:0;top:0;width:100%;height:100%;';
      D.fio = U.el('div', 'fio-pilha', D.pilha); U.pos(D.fio, G.cx, G.y0, null, yb - G.y0);
      function plano(i, nome) {
        var p = U.el('div', 'plano', D.pilha);
        p.style.left = U.px(G.cx);
        var placa = U.el('div', 'placa', p); U.pos(placa, -G.s / 2, -G.s / 2, G.s, G.s);
        var et = null;
        if (nome) {
          et = U.el('span', 'etiqueta', p, '<span class="pilula">' + U.h(nome) + '</span>');
          et.style.left = U.px(G.xr - G.cx);
        }
        return { el: p, placa: placa, et: et, y: nome ? G.y0 + i * G.sp : yb };
      }
      D.base = plano(n, null);
      D.planos = NOMES.map(function (nome, i) { return plano(i, nome); });
      D.orbBox = U.el('div', '', el);
      D.orb = orb(D.orbBox, 'assistente', 56);
      U.pos(D.orbBox, G.cx - 28, yb - 46);
      A.origemOndaClara = { x: G.cx, y: yb - 18 };
      borraoCena = new A.Borrao(el);
    };
    cena.quadro = function (t) {
      var ch = chicote(t, marca('lei.sai'));
      if (ch.p < 1) { cena.el.style.transform = 'translateY(' + (F.H * (1 - ch.e)).toFixed(2) + 'px)'; borraoCena.xy(0, 42 * ch.b); }
      else if (cena.el._x !== 1) { cena.el.style.transform = ''; borraoCena.xy(0, 0); cena.el._x = 1; }
      D.titulo.quadro(t);
      var tps = marca('camadas.planos'), td = marca('camadas.desce'), tj = marca('camadas.junta'), n = D.planos.length;
      D.planos.forEach(function (p, i) {
        var tau = t - tps[i], y = p.y, op = U.clamp(tau / 0.08);
        if (tau < 0) { U.opacidade(p.el, 0); return; }
        y -= 46 * U.mola(tau, 15, 0.55);
        /* descem para a base: os de baixo primeiro; o de cima chega por último, no impacto */
        var fim = tj - (n - 1 - i) * 0.045, ini = fim - 0.5;
        var q = U.seg(t, ini, fim), e = 0.35 * U.vaiVolta(q) + 0.65 * U.entraCub(q);
        y = U.lerp(y, G.yb, e);
        if (t >= fim) op = 0;
        U.opacidade(p.el, op);
        p.el.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
        if (p.et) { var qe = U.seg(t, td, td + 0.25); U.opacidade(p.et, 1 - qe); p.et.style.transform = 'translateX(' + (14 * qe).toFixed(2) + 'px)'; }
      });
      var tb = t - tps[0];
      U.opacidade(D.base.el, U.clamp(tb / 0.1));
      var dj = t - tj, sb = dj > 0 ? 1 + 0.06 * U.mola(dj, 16, 0.4) : 1;
      D.base.el.style.transform = 'translateY(' + G.yb.toFixed(2) + 'px) scale(' + sb.toFixed(4) + ')';
      D.base.placa.style.borderWidth = dj > 0 && dj < 0.4 ? (1.5 + 1.5 * (1 - dj / 0.4)).toFixed(2) + 'px' : '';
      U.opacidade(D.fio, U.clamp(tb / 0.2) * (1 - U.seg(t, td, td + 0.2)));
      var to = t - (tj + 0.06);
      if (to < 0) U.opacidade(D.orbBox, 0);
      else { U.opacidade(D.orbBox, U.clamp(to / 0.06)); D.orbBox.style.transform = 'translateY(' + (-18 * U.mola(to, 15, 0.45)).toFixed(2) + 'px) scale(' + (1 - 0.5 * U.clamp(U.mola(to, 15, 0.45), -1, 1)).toFixed(4) + ')'; }
      A.uma(cena, 'pula', t, tj + 0.1, function () { cutucar(D.orb, 0.8); });
    };
    A.cena(cena);
  })();

  /* ===================================================================================== */
  /* final: a logo, a frase, as plataformas e a ação                                       */
  /* ===================================================================================== */
  (function () {
    var cena = { id: 'final', tema: 'claro', rotulo: 'Toda a sua operação num sistema só. Heild Contábil e Heild BPO. Agende uma demonstração.' };
    cena.de = PRINCIPAL ? marca('camadas.onda') : marca('final.entra');
    cena.ate = A.duracao + 1;
    var D = {}, LF = layoutFinal();
    cena.montar = function (el) {
      var k = A.noPalco(el).k;
      /* a luz: uma mancha por integrante, que se junta numa faixa atrás da frase */
      D.luz = U.el('div', 'luz', el);
      D.manchas = LUZ.map(function (id) { var s = U.el('span', '', D.luz); s.style.setProperty('--c', 'var(' + INT[id].cor + ')'); return s; });
      var L = caixaLogo(LF.w, F.cx, LF.top + LF.w * LG.VH / LG.VW / 2);
      var lo = colocarLogo(el, L);
      D.logo = lo.logo;
      D.titulo = new A.Titulo(el, A.texto('final'), marca('final.palavras'), { classe: 'centro', tamanho: LF.tam });
      U.pos(D.titulo.el, F.L, LF.tituloTop, F.R - F.L);
      D.titulo.caber(F.R - F.L, k);
      var ht = A.noPalco(D.titulo.el).h;
      D.plat = U.el('div', 'plataformas', el, '<span>' + U.h(R.conteudo.plataformas) + '</span>');
      U.pos(D.plat, F.L, LF.tituloTop + ht + (PAI ? 14 : 20), F.R - F.L);
      var hp = A.noPalco(D.plat).h;
      D.cta = U.el('span', 'botao cta', el, U.h(R.conteudo.cta));
      var wc = A.noPalco(D.cta).w;
      var yc = LF.tituloTop + ht + (PAI ? 14 : 20) + hp + (PAI ? 26 : 34);
      U.pos(D.cta, F.cx - wc / 2, yc);
      D.anel = U.el('span', 'anel-cta', el);
      D.anel.style.cssText += ';border-radius:var(--raio-pilula);box-shadow:inset 0 0 0 2px color-mix(in srgb, var(--texto) 40%, transparent);';
      U.pos(D.anel, F.cx - wc / 2, yc, wc, 56);
      U.opacidade(D.anel, 0);
      D.faixaY = LF.tituloTop + ht * 0.55;
      D.mw = RET ? 300 : FEED ? 300 : 340; D.mh = RET ? 210 : FEED ? 200 : 220;
      D.manchas.forEach(function (s) { s.style.width = U.px(D.mw); s.style.height = U.px(D.mh); });
    };
    cena.reiniciar = function () { D.logo.stop(); };
    cena.quadro = function (t) {
      if (PRINCIPAL) { var o = A.origemOndaClara || { x: F.W / 2, y: F.H / 2 }; A.onda(cena.el, t, marca('camadas.onda'), o.x, o.y); }
      /* a luz */
      var t0 = PRINCIPAL ? marca('camadas.onda') : marca('final.entra') - 0.15, tl = Math.max(0, t - t0), n = D.manchas.length;
      var junta = 1 - Math.pow(1 - Math.min(1, tl / 2.4), 3), faixa = F.W * (PAI ? 0.7 : 0.88);
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2 + 0.6, sx = Math.cos(ang) * F.W * 0.55, sy = Math.sin(ang) * F.H * 0.45;
        var bx = (i / (n - 1) - 0.5) * faixa, fx = bx + Math.sin(t * 0.5 + i * 1.7) * F.W * 0.03, fy = Math.sin(t * 0.7 + i * 2.3) * D.mh * 0.18;
        var x = F.cx + sx + (fx - sx) * junta, y = D.faixaY + sy + (fy - sy) * junta;
        var s = (0.85 + 0.15 * Math.sin(t * 0.9 + i * 1.1)) * (0.6 + 0.4 * junta);
        D.manchas[i].style.transform = 'translate(' + (x - D.mw / 2).toFixed(2) + 'px,' + (y - D.mh / 2).toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
        U.opacidade(D.manchas[i], 0.42 * (0.3 + 0.7 * junta) * U.clamp(tl / 0.3));
      }
      A.uma(cena, 'centralizar', t, marca('final.centralizar'), function () { D.logo.play('centralizar'); });
      D.titulo.quadro(t);
      var q = U.saiCub(U.seg(t, marca('final.plataformas') - 0.05, marca('final.plataformas') + 0.3));
      var sp = D.plat.firstChild;
      sp.style.transform = 'translateY(' + ((1 - q) * 110).toFixed(2) + '%)';
      U.opacidade(sp, q > 0 ? 1 : 0);
      var tc = t - marca('final.cta');
      if (tc < 0) U.opacidade(D.cta, 0);
      else {
        var mo = U.mola(tc, 15, 0.5);
        U.opacidade(D.cta, U.clamp(tc / 0.06));
        var tq = t - marca('final.toque'), press = tq > -0.06 && tq < 0.14 ? 1 - 0.05 * Math.sin(Math.PI * U.seg(tq, -0.06, 0.14)) : 1;
        D.cta.style.transform = 'scale(' + ((1 - 0.4 * U.clamp(mo, -1, 1)) * press).toFixed(4) + ')';
        D.cta.style.filter = U.borrao(8 * U.clamp(mo));
        var pa = U.seg(tq, 0, 0.6);
        if (pa > 0 && pa < 1) { U.opacidade(D.anel, 0.9 * (1 - pa)); D.anel.style.transform = 'scale(' + (1 + 0.16 * U.saiCub(pa)).toFixed(4) + ',' + (1 + 0.5 * U.saiCub(pa)).toFixed(4) + ')'; }
        else U.opacidade(D.anel, 0);
      }
    };
    A.cena(cena);
  })();
})();
