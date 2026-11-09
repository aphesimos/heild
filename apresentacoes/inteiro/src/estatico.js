/*
 * Do inteiro — as figuras paradas (movimento reduzido, ou "ler como códice").
 *
 * Desenha, uma vez, em SVG, o estado final de cada câmara: a pílula, os pares das duas raízes, a roda
 * parada em "o um é o todo", a frase dos brancos, as três substâncias e a pedra, e o selo (o <heild-logo>
 * de verdade, parado). As cores e as fontes vêm dos tokens, pelo CSS da página.
 */
(function () {
  'use strict';
  var I = window.Inteiro = window.Inteiro || {};
  var NS = 'http://www.w3.org/2000/svg', L = { PW: 147.297, PH: 386.111 };
  function q(s, el) { return (el || document).querySelector(s); }
  function qa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function el(nome, at, pai) { var e = document.createElementNS(NS, nome); for (var k in at) e.setAttribute(k, at[k]); if (pai) pai.appendChild(e); return e; }
  function svg(vb, rotulo) { var s = el('svg', { viewBox: vb, role: 'img', 'aria-label': rotulo }); return s; }
  var med = document.createElement('canvas').getContext('2d');
  function largura(txt, tam, peso, ital) { med.font = (ital ? 'italic ' : '') + (peso || 300) + ' ' + tam + 'px "PP Neue Montreal"'; return med.measureText(txt).width; }
  function texto(pai, x, y, txt, tam, o) {
    o = o || {};
    var t = el('text', { x: x, y: y, 'text-anchor': o.ancora || 'middle', 'dominant-baseline': 'central' }, pai);
    t.setAttribute('style', 'font-family:var(--font-titulo);font-weight:' + (o.peso || 300) + ';font-size:' + tam + 'px;letter-spacing:' + (o.esp || '-0.01em') + ';fill:' + (o.cor || 'var(--texto)') + (o.ital ? ';font-style:italic' : ''));
    if (o.giro) t.setAttribute('transform', 'rotate(' + o.giro + ' ' + x + ' ' + y + ')');
    t.textContent = txt; return t;
  }
  function capsula(pai, cx, cy, comp, esp, giro, cor) {
    var r = el('rect', { x: cx - comp / 2, y: cy - esp / 2, width: comp, height: esp, rx: esp / 2 }, pai);
    r.setAttribute('style', 'fill:' + (cor || 'var(--elevada)'));
    if (giro) r.setAttribute('transform', 'rotate(' + giro + ' ' + cx + ' ' + cy + ')');
    return r;
  }

  var FIG = {
    pilula: function () {
      var s = svg('0 0 400 280', 'A pílula, sozinha'), H = 220, T = H * L.PW / L.PH;
      capsula(s, 200, 140, H, T, 90, 'var(--primaria)');
      return s;
    },
    raizes: function () {
      var s = svg('0 0 640 470', 'As duas raízes: cinco pares que dizem a mesma coisa');
      var pares = [['whole', 'hólos', 'inteiro'], ['hale', 'salvus', 'são, salvo'], ['heal', 'salūs', 'cura, saúde'], ['hail', 'salvē', 'salve'], ['holy', 'sollemnis', 'sagrado, solene']];
      texto(s, 150, 34, '*kailo-', 18, { ital: true, cor: 'var(--texto-suave)' });
      texto(s, 490, 34, '*solh₂-', 18, { ital: true, cor: 'var(--texto-suave)' });
      pares.forEach(function (p, i) {
        var y = 102 + i * 76, wa = largura(p[0], 18), wb = largura(p[1], 18), E = 38, ca = wa + E + 18, cb = wb + E + 18, ha = (ca - E) / 2, hb = (cb - E) / 2;
        var xa = 320 - hb, xb = 320 + ha;
        capsula(s, 320, y, ca + cb - E, E, 0);
        texto(s, xa, y, p[0], 18); texto(s, xb, y, p[1], 18);
        texto(s, (xa - ha + xb + hb) / 2, y + 32, p[2], 12, { ital: true, cor: 'var(--texto-suave)', peso: 400 });
      });
      return s;
    },
    roda: function () {
      var s = svg('-340 -360 680 760', 'A roda parada: o um é o todo');
      var aneis = qa('#iii .anel').map(function (ol) { return qa('li', ol).map(function (l) { return { p: l.textContent, a: l.getAttribute('data-art') }; }); });
      var R = [290, 219, 151], E = 30, topo = [0, 0, 1], PASSO = 360 / 9;
      aneis.forEach(function (lista, r) {
        lista.forEach(function (w, j) {
          var th = (j - topo[r]) * PASSO - 90, rad = th * Math.PI / 180, x = Math.cos(rad) * R[r], y = Math.sin(rad) * R[r];
          var comp = Math.min(largura(w.p, 14) + E + 10, R[r] * 0.698 * 0.9), g = th + 90;
          var gg = g; while (gg > 90) gg -= 180; while (gg <= -90) gg += 180;
          capsula(s, x, y, comp, E, g);
          texto(s, x, y, w.p, 14, { giro: gg });
        });
      });
      el('circle', { cx: 0, cy: -R[0] - E / 2 - 16, r: 3.5, style: 'fill:var(--destaque)' }, s);
      texto(s, 0, -16, 'εν το παν', 46, { peso: 200 });
      texto(s, 0, 24, 'hèn tò pân', 14, { ital: true, cor: 'var(--texto-suave)', peso: 400 });
      texto(s, 0, R[0] + 62, 'o um é o todo.', 26, {});
      return s;
    },
    brancos: function () {
      var s = svg('0 0 800 520', 'Nada terá tido lugar senão o lugar. Tudo, num lugar só.');
      el('line', { x1: 400, y1: 20, x2: 400, y2: 250, style: 'stroke:var(--borda);stroke-width:1' }, s);
      texto(s, 40, 70, 'nada', 64, { ancora: 'start', peso: 200, esp: '-0.03em' });
      texto(s, 430, 130, 'terá tido lugar', 26, { peso: 300 });
      texto(s, 560, 168, 'senão', 18, { ital: true });
      texto(s, 760, 222, 'o lugar', 64, { ancora: 'end', peso: 200, esp: '-0.03em' });
      el('line', { x1: 400, y1: 290, x2: 400, y2: 500, style: 'stroke:var(--borda);stroke-width:1' }, s);
      texto(s, 40, 350, 'tudo,', 64, { ancora: 'start', peso: 200, esp: '-0.03em' });
      texto(s, 470, 410, 'num', 26, { peso: 300 });
      texto(s, 760, 462, 'lugar só.', 64, { ancora: 'end', peso: 200, esp: '-0.03em' });
      return s;
    },
    obra: function () {
      var s = svg('0 0 800 380', 'Sal, mercúrio e enxofre; corpo, espírito e alma; e a pedra');
      var c = function (n) { return 'var(--' + n + ')'; };
      // sal: cristais
      var sx = 150, sy = 250; capsula(s, sx, sy, 34, 21, 90, c('areia-650'));
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 + Math.PI / 6; capsula(s, sx + Math.cos(a) * 27, sy + Math.sin(a) * 27, 30, 19, 90, c('areia-650')); }
      texto(s, sx, sy + 64, 'sal, o corpo', 13, { cor: 'var(--texto-suave)', peso: 400 });
      // mercúrio: gotas
      var mx = 120, my = 100, D = [34, 26, 22, 18, 29, 14];
      D.forEach(function (d, j) { var an = j * Math.PI * 2 / 6, rr = 22 + (j % 3) * 9; el('circle', { cx: mx + Math.cos(an) * rr, cy: my + Math.sin(an) * rr * 0.86, r: d / 2, style: 'fill:' + c('orb-bpo-conciliacao') }, s); });
      texto(s, mx, my + 70, 'mercúrio, o espírito', 13, { cor: 'var(--texto-suave)', peso: 400 });
      // enxofre: chamas
      var ex = 300, ey = 100, Hs = [42, 68, 92, 64, 40];
      Hs.forEach(function (h, k) { capsula(s, ex + (k - 2) * 15, ey + 40 - h / 2, h, 20, 90, c('orb-fiscal')); });
      texto(s, ex, ey + 70, 'enxofre, a alma', 13, { cor: 'var(--texto-suave)', peso: 400 });
      // a pedra
      var H = 220, T = H * L.PW / L.PH;
      capsula(s, 620, 190, H, T, 90, 'var(--primaria)');
      return s;
    }
  };

  I.Estatico = {
    desenhar: function () {
      qa('figure.estatico').forEach(function (f) {
        if (f.getAttribute('data-feito')) return;
        var nome = f.getAttribute('data-figura');
        if (nome === 'selo') {
          var logo = document.createElement('heild-logo'); logo.setAttribute('label', 'Heild');
          logo.setAttribute('style', 'width:min(60vw,420px);color:var(--primaria);display:block;margin:24px auto');
          f.appendChild(logo);
        } else if (FIG[nome]) f.appendChild(FIG[nome]());
        f.setAttribute('data-feito', '1');
      });
    }
  };
})();
