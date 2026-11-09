/*
 * O raciocínio do Consultor — o que todas as cenas usam.
 *
 * Os tipos de slide da apresentação de produto (../produto/src/slides.js) seguem valendo: capa, abertura e
 * fecho vêm de lá. Os tipos novos deste arquivo e dos cenas-*.js entram no mesmo window.HEILD_TIPOS.
 * Cada tipo tem html(d), que desenha, e entrar(el, d, api), que liga a cena; os temporizadores e quadros de
 * `api` param sozinhos quando o slide sai. As cenas tocam em loop até a pessoa mexer.
 */
(function () {
  'use strict';
  var D = window.HEILD_APRESENTACAO, U = window.HEILD_UTIL;
  var NS = 'http://www.w3.org/2000/svg';
  var R = {};

  R.I = D.integrantes;
  R.h = U.h;
  R.orb = U.orb;
  R.NS = NS;
  R.q = function (el, s) { return el.querySelector(s); };
  R.qa = function (el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); };
  R.retrato = function () { return document.documentElement.classList.contains('retrato'); };

  /* ---------- a mesma composição da apresentação de produto ---------- */
  R.titulo = function (t, largo) { return '<h2 class="titulo' + (largo ? ' titulo--largo' : '') + '">' + R.h(t) + '</h2>'; };
  R.frase = function (t, d) { return t ? '<p class="frase" data-e style="--d:' + (d || 320) + 'ms">' + R.h(t) + '</p>' : ''; };
  R.cab = function (d, extra, largo) { return '<div class="cab">' + R.titulo(d.titulo, largo) + R.frase(d.frase) + (extra || '') + '</div>'; };
  R.encaixe = function (w, hh, html, cls) { return '<div class="visual"><div class="encaixe ' + (cls || '') + '" style="--w:' + w + 'px;--h:' + hh + 'px">' + html + '</div></div>'; };
  R.selo = function (tipo, texto, cls) { return '<span class="selo' + (tipo && tipo !== 'neutro' ? ' selo--' + tipo : '') + (cls ? ' ' + cls : '') + '">' + R.h(texto) + '</span>'; };
  R.rotulo = function (t, d, cls) { return '<p class="rotulo' + (cls ? ' ' + cls : '') + '" data-e style="--d:' + (d || 600) + 'ms">' + R.h(t) + '</p>'; };

  /* ---------- tempo e datas ---------- */
  R.inOut = function (x) { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  R.sai = function (x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); };
  R.dia = function (s) { var p = String(s).split('-'); return Date.UTC(+p[0], (+p[1] || 1) - 1, +p[2] || 1); };
  R.fmt = function (ms) { var d = new Date(ms); function z(n) { return (n < 10 ? '0' : '') + n; } return z(d.getUTCDate()) + '/' + z(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear(); };
  R.ano = function (ms) { return new Date(ms).getUTCFullYear(); };
  R.num = function (n, casas) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 }); };

  /* Um laço que se repete enquanto o slide está na tela (api.esperar não volta depois que ele sai). */
  R.laco = function (fn) { (async function () { for (;;) { await fn(); } })().catch(function () {}); };

  /* ---------- SVG ---------- */
  R.svg = function (tag, attrs, pai) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(e);
    return e;
  };

  /*
   * A passagem: uma cápsula (o material da logo) anda por um caminho com um rastro curto, como o pedido que
   * passa de um orb para outro na apresentação de produto. `caminho` é um <path> que já está no SVG ou o
   * atributo d de um caminho novo (que some no fim). Devolve uma promessa que resolve na chegada.
   */
  R.viajar = function (api, svg, caminho, ms, o) {
    o = o || {};
    var temp = typeof caminho === 'string';
    var p = temp ? R.svg('path', { d: caminho, fill: 'none', stroke: 'none' }, svg) : caminho;
    if (api.parado) { if (temp) p.remove(); if (o.cheio) o.cheio.style.strokeDashoffset = '0'; return api.esperar(60); }
    var L = p.getTotalLength(), dur = ms || 1200;
    var g = R.svg('g', { 'class': 'viajante' + (o.cls ? ' ' + o.cls : '') }, svg), rastro = [];
    for (var k = 3; k >= 1; k--) rastro.push([R.svg('circle', { r: (3.2 - k * 0.6).toFixed(1), 'class': 'rastro' }, g), k]);
    var ficha = R.svg('rect', { x: -9, y: -4.5, width: 18, height: 9, rx: 4.5, 'class': 'ficha' }, g);
    if (o.cheio) { o.cheio.style.strokeDasharray = L.toFixed(1); o.cheio.style.strokeDashoffset = L.toFixed(1); }
    function ponto(e) { var a = p.getPointAtLength(Math.max(0, Math.min(1, e)) * L); return [a.x, a.y]; }
    return new Promise(function (res) {
      var t0 = performance.now();
      api.quadro(function (agora) {
        var u = Math.min(1, (agora - t0) / dur), e = R.inOut(u), a = ponto(e), b = ponto(Math.min(1, e + 0.01)), c = ponto(Math.max(0, e - 0.01));
        var ang = Math.atan2(b[1] - c[1], b[0] - c[0]) * 180 / Math.PI;
        var esc = 0.7 + 0.3 * Math.sin(Math.PI * u), alfa = Math.min(1, u * 8, (1 - u) * 8);
        ficha.setAttribute('transform', 'translate(' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + esc.toFixed(3) + ' 1)');
        ficha.style.opacity = alfa.toFixed(3);
        rastro.forEach(function (r) { var q2 = ponto(R.inOut(u - r[1] * 0.035)); r[0].setAttribute('cx', q2[0].toFixed(1)); r[0].setAttribute('cy', q2[1].toFixed(1)); r[0].style.opacity = (alfa * (0.5 - r[1] * 0.12)).toFixed(3); });
        if (o.cheio) o.cheio.style.strokeDashoffset = (L * (1 - e)).toFixed(1);
        if (u >= 1) { g.remove(); if (temp) p.remove(); res(); return false; }
        return true;
      });
    });
  };

  /* Uma pílula de HTML que anda por um caminho dentro de um contêiner (para levar um item de uma lista a outra). */
  R.levar = function (api, cont, el, de, para, ms, curva) {
    if (api.parado) return api.esperar(30);
    var c = el.cloneNode(true); c.classList.add('levado'); c.style.left = de[0] + 'px'; c.style.top = de[1] + 'px';
    cont.appendChild(c);
    var mx = (de[0] + para[0]) / 2, my = Math.min(de[1], para[1]) - (curva == null ? 40 : curva), dur = ms || 900;
    return new Promise(function (res) {
      var t0 = performance.now();
      api.quadro(function (agora) {
        var u = Math.min(1, (agora - t0) / dur), e = R.inOut(u), v = 1 - e;
        var x = v * v * de[0] + 2 * v * e * mx + e * e * para[0], y = v * v * de[1] + 2 * v * e * my + e * e * para[1];
        c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (1 - 0.08 * Math.sin(Math.PI * u)).toFixed(3) + ')';
        c.style.left = '0'; c.style.top = '0';
        c.style.opacity = Math.min(1, (1 - u) * 6, u * 10 + 0.2).toFixed(3);
        if (u >= 1) { c.remove(); res(); return false; }
        return true;
      });
    });
  };

  /* Conta um número de `de` até `ate`, no padrão brasileiro. */
  R.contar = function (api, el, ate, ms, fmt) {
    fmt = fmt || function (v) { return R.num(Math.round(v)); };
    if (api.parado) { el.textContent = fmt(ate); return api.esperar(30); }
    return new Promise(function (res) {
      var t0 = performance.now(), dur = ms || 1400;
      api.quadro(function (agora) {
        var u = Math.min(1, (agora - t0) / dur);
        el.textContent = fmt(ate * R.sai(u));
        if (u >= 1) { res(); return false; }
        return true;
      });
    });
  };

  /* Marca de conferência: um círculo que vira "sim", "não" ou um traço, sempre com a palavra. */
  R.marca = function (tipo) {
    var p = tipo === 'sim' ? '<path d="M7 12.5l3.2 3.2L17 9"/>' : tipo === 'nao' ? '<path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>' : '<path d="M8 12h8"/>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/>' + p + '</svg>';
  };

  /* Um cartão de citação: a norma, a vigência e o trecho literal. */
  R.citacao = function (c, cls) {
    return '<div class="r-cit' + (cls ? ' ' + cls : '') + '"><div class="r-cit-cab"><b>' + R.h(c.norma) + '</b><span>' + R.h(c.vig || '') + '</span></div>' +
      (c.trecho ? '<blockquote>' + R.h(c.trecho) + '</blockquote>' : '') + '</div>';
  };

  window.RAC = R;
})();
