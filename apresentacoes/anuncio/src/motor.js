/*
 * Anúncio da Heild — o motor.
 *
 * Tudo o que se move é função do tempo t (em segundos, desde o começo da peça): `ANUNCIO.quadro(t)` põe
 * cada cena no estado daquele instante. Não há transição nem animação CSS (elas rodam no compositor e
 * escapam do relógio): o CSS só dá a forma, e o JS escreve transform, opacity, filter e máscaras a cada
 * quadro. O <heild-logo> e o <orb-avatar> andam sozinhos, com requestAnimationFrame e performance.now;
 * no render, o relógio falso do Playwright controla os dois (render/render.mjs), e as cenas só disparam
 * neles ações presas a marcas de tempo (play, morph, reaction), uma vez cada.
 *
 * Endereço: ?formato=9x16|4x5|16x9 &peca=principal|vinheta &render (o render chama montar, comecar e
 * quadro por fora). Sem render, a página monta sozinha, toca em tempo real e repete.
 *
 * Os tempos vêm de roteiro.json (window.ROTEIRO), o mesmo arquivo que o som usa.
 */
(function () {
  'use strict';
  var R = window.ROTEIRO;
  var busca = new URLSearchParams(location.search);

  /* ---------- os formatos ----------
     O quadro tem o tamanho exato do vídeo; dentro dele, o palco é desenhado em "px de desenho" e ampliado
     por zoom (2 ou 2,25). Assim os tokens do design system (raios, sombras, a grade de 24 px) valem na
     escala em que foram desenhados, a de um celular, e o vídeo sai nítido.
     L, R, T, B: a área segura, em px de desenho. No 9:16, fora dos ~14% de cima, dos ~22% de baixo e da
     faixa de ~13% à direita (os ícones do Reels e do TikTok); no 16:9, longe da barra e do botão de pular
     do YouTube. cx é o centro horizontal da área segura. */
  var FORMATOS = {
    '9x16': { qw: 1080, qh: 1920, z: 2, W: 540, H: 960, L: 34, R: 466, T: 148, B: 740, tipo: 'retrato', hero: 56, gancho: 92, fim: 48, ui: 21, uiP: 17, uiG: 31, ficha: 21 },
    '4x5': { qw: 1080, qh: 1350, z: 2, W: 540, H: 675, L: 40, R: 500, T: 50, B: 625, tipo: 'feed', hero: 50, gancho: 84, fim: 44, ui: 19, uiP: 16, uiG: 29, ficha: 20 },
    '16x9': { qw: 1920, qh: 1080, z: 2.25, W: 1920 / 2.25, H: 480, L: 56, R: 797, T: 44, B: 400, tipo: 'paisagem', hero: 56, gancho: 90, fim: 44, ui: 18, uiP: 15, uiG: 26, ficha: 18 }
  };
  function formatoPelaJanela() { var a = innerWidth / Math.max(1, innerHeight); return a < 0.7 ? '9x16' : a < 1.25 ? '4x5' : '16x9'; }
  var idFormato = FORMATOS[busca.get('formato')] ? busca.get('formato') : formatoPelaJanela();
  var idPeca = R.pecas[busca.get('peca')] ? busca.get('peca') : 'principal';
  var F = Object.assign({ id: idFormato }, FORMATOS[idFormato]);
  F.cx = (F.L + F.R) / 2; F.cy = (F.T + F.B) / 2;
  var P = R.pecas[idPeca];
  var RENDER = busca.has('render');

  /* ---------- utilidades ---------- */
  var U = {};
  U.clamp = function (v, a, b) { return v < (a === undefined ? 0 : a) ? (a === undefined ? 0 : a) : v > (b === undefined ? 1 : b) ? (b === undefined ? 1 : b) : v; };
  U.lerp = function (a, b, p) { return a + (b - a) * p; };
  U.seg = function (t, a, b) { return U.clamp((t - a) / (b - a)); };
  U.saiCub = function (x) { return 1 - Math.pow(1 - x, 3); };
  U.saiQuad = function (x) { return 1 - (1 - x) * (1 - x); };
  U.saiExp = function (x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };
  U.entraCub = function (x) { return x * x * x; };
  U.entraQuad = function (x) { return x * x; };
  U.vaiVolta = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  U.saiBack = function (x, s) { s = s === undefined ? 1.6 : s; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  /* curva de Bézier cúbica como a do CSS (para a onda do tema: cubic-bezier(0.3, 0, 0.2, 1)) */
  U.bezier = function (x1, y1, x2, y2) {
    function b(a1, a2, t) { return 3 * a1 * t * (1 - t) * (1 - t) + 3 * a2 * t * t * (1 - t) + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 40; i++) { t = (lo + hi) / 2; if (b(x1, x2, t) < x) lo = t; else hi = t; }
      return b(y1, y2, t);
    };
  };
  /* mola amortecida: o deslocamento que sobra (1 em d = 0, tende a 0), com passada do ponto */
  U.mola = function (d, w, z) {
    if (d <= 0) return 1;
    w = w || 18; z = z === undefined ? 0.5 : z;
    var wd = w * Math.sqrt(1 - z * z);
    return Math.exp(-z * w * d) * (Math.cos(wd * d) + (z * w / wd) * Math.sin(wd * d));
  };
  /* ruído de valor, 30 amostras por segundo (um valor novo por quadro): o tremor da câmera */
  function hash(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; }
  U.ruido = function (t, s) { var u = t * 30, i = Math.floor(u), f = u - i; f = f * f * (3 - 2 * f); return U.lerp(hash(i, s), hash(i + 1, s), f); };
  /* sorteio com semente (o layout das peças soltas é o mesmo em toda renderização) */
  U.sorteio = function (semente) {
    var a = semente >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  U.px = function (v) { return v.toFixed(2) + 'px'; };
  U.el = function (tag, cls, pai, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; if (pai) pai.appendChild(e); return e; };
  U.h = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.pos = function (e, x, y, w, h) { e.style.left = U.px(x); e.style.top = U.px(y); if (w !== undefined && w !== null) e.style.width = U.px(w); if (h !== undefined && h !== null) e.style.height = U.px(h); return e; };
  U.opacidade = function (e, v) { var s = v <= 0.001 ? '0' : v >= 0.999 ? '1' : v.toFixed(3); if (e._op !== s) { e.style.opacity = s; e._op = s; } };
  U.borrao = function (v) { return v > 0.05 ? 'blur(' + v.toFixed(2) + 'px)' : 'none'; };

  function marca(nome) {
    var v = P.marcas[nome];
    if (v === undefined) throw new Error('roteiro.json: a peça ' + idPeca + ' não tem a marca ' + nome);
    return v;
  }
  function temMarca(nome) { return P.marcas[nome] !== undefined; }
  function texto(nome) { var t = R.textos[nome]; return (t && (t[F.tipo] || t.retrato)) || []; }

  /* ---------- os eventos (sons e tremores), resolvidos das marcas ---------- */
  function eventos() {
    var lista = [];
    (P.eventos || []).forEach(function (e) {
      if (e.t === undefined && !e.em) return;
      var ts = e.t !== undefined ? [e.t] : [].concat(marca(e.em));
      if (e.indices) ts = e.indices.map(function (i) { return ts[i]; });
      ts.forEach(function (t) { t += e.mais || 0; if (t >= 0) lista.push(Object.assign({}, e, { t: t })); });
    });
    return lista.sort(function (a, b) { return a.t - b.t; });
  }
  var TREMORES = eventos().filter(function (e) { return e.tremor; });

  /* O tremor da câmera nos impactos: leve e curto (some em ~0,3 s), com um golpe de escala junto. */
  function tremor(t) {
    var x = 0, y = 0, r = 0, s = 0;
    for (var i = 0; i < TREMORES.length; i++) {
      var ev = TREMORES[i], d = t - ev.t;
      if (d < 0 || d > 0.6) continue;
      var e = Math.exp(-d / 0.075) * ev.tremor;
      x += e * 5 * U.ruido(t, i * 3 + 1); y += e * 5 * U.ruido(t, i * 3 + 2); r += e * 0.35 * U.ruido(t, i * 3 + 3);
      s += ev.tremor * 0.02 * Math.exp(-d / 0.1);
    }
    return { x: x, y: y, r: r, s: s };
  }

  /* ---------- o título cinético ----------
     Palavra por palavra: cada uma entra grande (de 1,9× por padrão), com borrão de movimento, e bate no
     lugar no instante da marca, com uma pequena passada de escala. A saída sobe e desfoca, em cascata. */
  function Titulo(pai, linhas, tempos, o) {
    o = o || {};
    this.o = o;
    var el = this.el = U.el('h2', 'titulo ' + (o.classe || ''), pai);
    el.setAttribute('aria-label', linhas.join(' '));
    var palavras = this.palavras = [], k = 0;
    linhas.forEach(function (linha) {
      var l = U.el('span', 'linha', el);
      linha.split(' ').forEach(function (p, i) {
        if (i) l.appendChild(document.createTextNode(' '));
        var s = U.el('span', 'p', l); s.textContent = p; s.setAttribute('aria-hidden', 'true');
        palavras.push({ el: s, t: tempos[Math.min(k, tempos.length - 1)] + (k >= tempos.length ? 0.1 * (k - tempos.length + 1) : 0) });
        k++;
      });
    });
    if (o.tamanho) el.style.fontSize = U.px(o.tamanho);
  }
  /* Ajusta o corpo para nenhuma linha passar da largura (as quebras são fixas, por orientação). */
  Titulo.prototype.largura = function (k) {
    var linhas = this.el.querySelectorAll('.linha'), maior = 0;
    for (var i = 0; i < linhas.length; i++) {
      var ps = linhas[i].querySelectorAll('.p'), a = ps[0].getBoundingClientRect(), b = ps[ps.length - 1].getBoundingClientRect();
      maior = Math.max(maior, (b.right - a.left) / k);
    }
    return maior;
  };
  Titulo.prototype.caber = function (largura, k) {
    var maior = this.largura(k);
    if (maior > largura) { var fs = parseFloat(getComputedStyle(this.el).fontSize); this.el.style.fontSize = U.px(Math.floor(fs * largura / maior * 10) / 10); }
    return this;
  };
  Titulo.prototype.quadro = function (t) {
    var o = this.o, S0 = o.escala || 1.9, dur = o.dur || 0.16;
    for (var i = 0; i < this.palavras.length; i++) {
      var w = this.palavras[i], a = w.t - dur;
      if (t < a) { U.opacidade(w.el, 0); continue; }
      var p = U.seg(t, a, w.t), e = U.saiCub(p);
      var s = U.lerp(S0, 1, e), y = (1 - e) * 0.16, b = (o.borrao || 12) * (1 - U.saiQuad(p)), op = U.clamp(p * 3);
      if (t > w.t) s = 1 - 0.045 * Math.sin((t - w.t) * 26) * Math.exp(-(t - w.t) * 11);
      if (o.sai !== undefined) {
        var ts = o.sai + i * (o.cascataSai || 0.025), q = U.seg(t, ts, ts + (o.durSai || 0.22)), eq = U.entraQuad(q);
        y -= eq * (o.subirSai === undefined ? 0.9 : o.subirSai); b += eq * 14; op *= 1 - q; s *= 1 - 0.06 * eq;
      }
      U.opacidade(w.el, op);
      w.el.style.transform = 'translateY(' + y.toFixed(3) + 'em) scale(' + s.toFixed(4) + ')';
      w.el.style.filter = U.borrao(b);
    }
  };

  /* ---------- borrão direcional (SVG feGaussianBlur com stdDeviation "x y") ---------- */
  var defs = null, nFiltro = 0;
  function Borrao(el) {
    var id = 'borrao-' + (++nFiltro), NS = 'http://www.w3.org/2000/svg';
    var f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', id); f.setAttribute('x', '-60%'); f.setAttribute('y', '-60%'); f.setAttribute('width', '220%'); f.setAttribute('height', '220%');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    var g = document.createElementNS(NS, 'feGaussianBlur'); g.setAttribute('stdDeviation', '0 0'); f.appendChild(g);
    defs.appendChild(f);
    this.el = el; this.g = g; this.url = 'url(#' + id + ')'; this.atual = '';
  }
  Borrao.prototype.xy = function (bx, by, extra) {
    bx = Math.abs(bx); by = Math.abs(by);
    var v = bx > 0.15 || by > 0.15 ? bx.toFixed(2) + ' ' + by.toFixed(2) : '';
    if (v) this.g.setAttribute('stdDeviation', v);
    var f = (v ? this.url : '') + (extra ? ' ' + extra : '');
    if (f !== this.atual) { this.el.style.filter = f || 'none'; this.atual = f; }
  };

  /* ---------- a onda do tema ----------
     A mesma do site (comum/tema.css): a cena nova entra por uma máscara radial com a borda macia, do ponto
     de origem até cobrir tudo, com cubic-bezier(0.3, 0, 0.2, 1). Aqui ela anda pelo tempo t. */
  var curvaOnda = U.bezier(0.3, 0, 0.2, 1);
  function onda(el, t, t0, x, y, dur) {
    dur = dur || R.onda;
    var p = U.seg(t, t0, t0 + dur), borda = 64;
    if (p >= 1) { if (el._onda !== 'fim') { el.style.webkitMaskImage = el.style.maskImage = 'none'; el._onda = 'fim'; } return 1; }
    var rmax = Math.hypot(Math.max(x, F.W - x), Math.max(y, F.H - y)) + borda + 20;
    var r = curvaOnda(p) * rmax;
    var m = 'radial-gradient(circle at ' + U.px(x) + ' ' + U.px(y) + ', #000 ' + U.px(r - borda) + ', transparent ' + U.px(Math.max(0.01, r)) + ')';
    el.style.webkitMaskImage = el.style.maskImage = m; el._onda = 'meio';
    return p;
  }

  /* ---------- cenas ---------- */
  var cenas = [], palco, camera, quadroEl, montado = false, inicio = 0, ultimo = -1;
  var A = window.ANUNCIO = {
    formato: F, peca: idPeca, pecaDados: P, roteiro: R, render: RENDER, duracao: P.duracao, fps: R.fps,
    U: U, marca: marca, temMarca: temMarca, texto: texto, eventos: eventos, Titulo: Titulo, Borrao: Borrao, onda: onda,
    fontes: false, pronto: false,
    cena: function (def) { cenas.push(def); }
  };

  /* Onde fica um elemento no palco, em px de desenho (lê o layout: use na montagem, não por quadro). */
  A.noPalco = function (e) {
    var rp = palco.getBoundingClientRect(), r = e.getBoundingClientRect(), k = rp.width / F.W;
    return { x: (r.left - rp.left) / k, y: (r.top - rp.top) / k, w: r.width / k, h: r.height / k, k: k };
  };
  /* Uma ação nos componentes, disparada uma vez quando o tempo passa da marca. */
  A.uma = function (dono, chave, t, quando, f) {
    dono._feito = dono._feito || {};
    if (t >= quando && !dono._feito[chave]) { dono._feito[chave] = true; f(); }
  };

  function montar() {
    if (montado) return;
    montado = true;
    var raiz = document.documentElement;
    raiz.classList.add('f-' + F.tipo);
    raiz.style.setProperty('--qw', F.qw + 'px'); raiz.style.setProperty('--qh', F.qh + 'px');
    raiz.style.setProperty('--pw', F.W + 'px'); raiz.style.setProperty('--ph', F.H + 'px'); raiz.style.setProperty('--z', F.z);
    raiz.style.setProperty('--hero', F.hero + 'px'); raiz.style.setProperty('--ui', F.ui + 'px');
    raiz.style.setProperty('--ui-p', F.uiP + 'px'); raiz.style.setProperty('--ui-g', F.uiG + 'px'); raiz.style.setProperty('--ficha', F.ficha + 'px');
    quadroEl = document.querySelector('.quadro');
    palco = quadroEl.querySelector('.palco');
    camera = palco.querySelector('.camera');
    defs = document.querySelector('svg.filtros defs');
    cenas.forEach(function (c) {
      c.el = U.el('section', 'cena cena-' + c.id + ' ' + (c.tema === 'escuro' ? 'forca-escuro' : 'forca-claro'), camera);
      c.el.setAttribute('aria-label', c.rotulo || c.id);
      U.el('div', 'chao', c.el);
      c.montar(c.el, A);
    });
    ajustar();
    A.pronto = true;
  }
  /* No render o quadro tem o tamanho da janela; fora dele, cabe na janela, com faixas. */
  function ajustar() {
    if (RENDER) return;
    var k = Math.min(innerWidth / F.qw, innerHeight / F.qh);
    quadroEl.style.transform = 'translate(' + ((innerWidth - F.qw * k) / 2).toFixed(1) + 'px,' + ((innerHeight - F.qh * k) / 2).toFixed(1) + 'px) scale(' + k.toFixed(5) + ')';
  }

  A.quadro = function (t) {
    if (!montado) return;
    if (t < ultimo - 0.0001) cenas.forEach(function (c) { c._feito = {}; if (c.reiniciar) c.reiniciar(); });
    ultimo = t;
    var tr = tremor(t);
    camera.style.transform = 'translate(' + tr.x.toFixed(2) + 'px,' + tr.y.toFixed(2) + 'px) rotate(' + tr.r.toFixed(3) + 'deg) scale(' + (1 + tr.s).toFixed(4) + ')';
    cenas.forEach(function (c) {
      var vis = t >= c.de && t < c.ate;
      if (c._vis !== vis) { c.el.classList.toggle('on', vis); c._vis = vis; }
      if (vis || c.sempre) c.quadro(t, A);
    });
  };
  A.comecar = function () { inicio = performance.now(); ultimo = -1; };
  A.montar = montar;
  A.tempo = function () { return (performance.now() - inicio) / 1000; };

  /* As fontes primeiro: nenhum quadro sai com a fonte substituta. */
  function carregarFontes() {
    var pedidos = ['500 100px "PP Neue Montreal"', '300 40px "PP Neue Montreal"', '400 20px "PP Neue Montreal Text"', '500 20px "PP Neue Montreal Text"'];
    return Promise.all(pedidos.map(function (f) { return document.fonts.load(f, 'Heild ãçé'); })).then(function () { return document.fonts.ready; });
  }
  function aoCarregar() {
    carregarFontes().then(function () {
      A.fontes = true;
      if (RENDER) return; // o render monta depois de parar o relógio
      montar();
      A.comecar();
      addEventListener('resize', ajustar);
      (function laco() {
        var t = A.tempo();
        if (t > P.duracao + 0.6) { A.comecar(); t = 0; }
        A.quadro(Math.min(t, P.duracao - 1 / R.fps));
        requestAnimationFrame(laco);
      })();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aoCarregar);
  else aoCarregar();
})();
