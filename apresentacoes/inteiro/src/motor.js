/*
 * Do inteiro — o motor.
 *
 * Uma máquina de estados: cada fólio é uma câmara (src/camaras.js) com um gesto a descobrir. O motor:
 *   - roda um laço só (requestAnimationFrame), que pausa quando a aba some;
 *   - anda as peças do campo por molas e desenha o campo (src/campo.js);
 *   - mede o tempo de leitura (que corre mais quando a pessoa está parada) e faz as glosas crescerem
 *     nas margens, palavra por palavra, sem mexer na quebra de linha (o resto fica transparente);
 *   - mostra "seguir" depois de um tempo, abre o índice e as fontes, troca o mundo (noite e dia);
 *   - leva o ponteiro, o teclado e a roda do mouse até a câmara ativa.
 * Com movimento reduzido (ou ?parado na URL, ou "ler como códice" no índice), nada disso roda: a página
 * vira o códice parado, e src/estatico.js desenha as figuras uma vez.
 */
(function () {
  'use strict';
  var I = window.Inteiro;
  var raiz = document.documentElement;
  var RMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var FINO = window.matchMedia ? matchMedia('(hover: hover) and (pointer: fine)').matches : false;
  function q(s, el) { return (el || document).querySelector(s); }
  function qa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- o que vale nos dois modos ---------- */
  var linkDir = (typeof LINK_DIRETRIZES === 'string' && LINK_DIRETRIZES) ? LINK_DIRETRIZES : '#';
  qa('.link-diretrizes').forEach(function (a) { a.href = linkDir; if (linkDir === '#') { a.removeAttribute('target'); a.setAttribute('aria-disabled', 'true'); } });
  // a referência de cada glosa vira um número discreto, que leva à fonte
  qa('.glosa[data-fonte]').forEach(function (g) {
    var n = g.getAttribute('data-fonte'), sup = document.createElement('sup'), a = document.createElement('a');
    a.href = '#fonte-' + n; a.textContent = n; a.setAttribute('data-acao', 'fonte'); a.setAttribute('aria-label', 'fonte ' + n);
    sup.appendChild(a); g.appendChild(document.createTextNode(' ')); g.appendChild(sup);
  });

  var indice = q('#indice'), botaoIndice = q('[data-acao="indice"]'), fontes = q('#fontes');
  function abrirIndice() {
    indice.hidden = false; botaoIndice.setAttribute('aria-expanded', 'true');
    var atual = I.M && I.M.atual ? I.M.atual.id : null;
    qa('[data-ir]', indice).forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-ir') === atual ? 'true' : 'false'); });
    var f = q('[aria-current="true"]', indice) || q('a', indice); if (f) f.focus();
  }
  function fecharIndice() { indice.hidden = true; botaoIndice.setAttribute('aria-expanded', 'false'); }

  function parado() {
    raiz.classList.remove('vivo'); raiz.classList.add('parado'); raiz.removeAttribute('data-theme');
    if (I.Estatico) I.Estatico.desenhar();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-acao], [data-ir]') : null;
    if (!el) return;
    var acao = el.getAttribute('data-acao'), ir = el.getAttribute('data-ir');
    if (ir) {
      e.preventDefault(); fecharIndice();
      if (I.M && I.M.vivo) I.M.ir(ir, 'salto');
      else { var alvo = document.getElementById(ir); if (alvo) alvo.scrollIntoView(); }
      return;
    }
    if (acao === 'indice') { e.preventDefault(); if (indice.hidden) abrirIndice(); else fecharIndice(); }
    else if (acao === 'fechar') { e.preventDefault(); fecharIndice(); }
    else if (acao === 'fontes' || acao === 'fonte') {
      fecharIndice();
      if (I.M && I.M.vivo) {
        e.preventDefault(); fontes.classList.add('aberta');
        var href = el.getAttribute('href'), item = href && href.length > 1 ? document.getElementById(href.slice(1)) : null;
        fontes.scrollTop = 0;
        if (item && item.id !== 'fontes') { item.scrollIntoView({ block: 'center' }); history.replaceState(null, '', href); }
        var f = q('.fechar', fontes); if (f) f.focus({ preventScroll: true });
      }
    }
    else if (acao === 'fechar-fontes') { e.preventDefault(); fontes.classList.remove('aberta'); if (I.M && I.M.atual) history.replaceState(null, '', '#' + I.M.atual.id); }
    else if (acao === 'codice') { e.preventDefault(); fecharIndice(); if (I.M) I.M.parar(); parado(); window.scrollTo(0, 0); }
    else if (acao === 'recomecar') { e.preventDefault(); if (I.M && I.M.vivo) I.M.ir('limiar', 'salto'); else window.scrollTo(0, 0); }
    else if (acao === 'som') { e.preventDefault(); var on = I.Som && I.Som.alternar(); el.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!indice.hidden) { fecharIndice(); botaoIndice.focus(); }
      else if (fontes.classList.contains('aberta')) { fontes.classList.remove('aberta'); }
      else if (I.M && I.M.vivo) abrirIndice();
    }
  });

  if (RMQ.matches || /[?&]parado/.test(location.search) || !window.requestAnimationFrame) { parado(); return; }

  /* ---------- o vivo ---------- */
  raiz.classList.add('vivo');
  var canvas = q('#campo'), luz = q('.luz'), seguir = q('.seguir'), folioRotulo = q('.cabeca-folio');
  var ORDEM = ['limiar', 'i', 'ii', 'iii', 'iv', 'v', 'vi'];
  var NUM = { limiar: '', i: 'i', ii: 'ii', iii: 'iii', iv: 'iv', v: 'v', vi: 'vi' };

  /* cores dos tokens, em [r, g, b] de 0 a 1 */
  function hex(h) { h = String(h).trim(); if (h[0] === '#') h = h.slice(1); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function token(nome) { return hex(getComputedStyle(raiz).getPropertyValue(nome) || '#000'); }
  var COR = {};
  ['areia-50', 'areia-100', 'areia-150', 'areia-200', 'areia-300', 'areia-400', 'areia-500', 'areia-600', 'areia-650', 'areia-700', 'areia-800', 'areia-850', 'areia-900', 'areia-925', 'areia-950', 'destaque', 'orb-fiscal', 'orb-bpo-conciliacao', 'orb-notas'].forEach(function (n) { COR[n] = token('--' + n); });

  /* ---------- as peças: cada uma é uma mola por propriedade ---------- */
  function meiaVolta(d) { while (d > Math.PI / 2) d -= Math.PI; while (d <= -Math.PI / 2) d += Math.PI; return d; }
  function Peca(i) {
    this.i = i; this.x = 0; this.y = 0; this.a = 0; this.c = 0; this.e = 0; this.k = 1; this.anel = 0; this.cor = [0, 0, 0];
    this.vx = 0; this.vy = 0; this.va = 0; this.vc = 0; this.ve = 0; this.vr = 0;
    this.t = { x: 0, y: 0, a: 0, c: 0, e: 0, k: 1, anel: 0, cor: [0, 0, 0] };
    this.K = 170; this.amort = 0.62; this.atraso = 0; this.direto = 0; this.taxaCor = 4; this.taxaK = 8; this.inteiro = false;
  }
  Peca.prototype.alvo = function (o, atraso) {
    for (var k in o) { if (k === 'cor') this.t.cor = o.cor.slice(); else if (k in this.t) this.t[k] = o[k]; }
    if (atraso != null) this.atraso = atraso;
    return this;
  };
  Peca.prototype.por = function (o) {
    this.alvo(o);
    for (var k in o) { if (k === 'cor') this.cor = o.cor.slice(); else if (k in this.t) this[k] = o[k]; }
    this.vx = this.vy = this.va = this.vc = this.ve = this.vr = 0; this.atraso = 0;
    return this;
  };
  Peca.prototype.passo = function (dt) {
    var t = this.t;
    if (this.atraso > 0) { this.atraso -= dt; if (this.atraso > 0) return; }
    var K = this.K, C = 2 * Math.sqrt(K) * this.amort, n = Math.max(1, Math.ceil(dt * 120)), h = dt / n;
    var ta = this.inteiro ? t.a : this.a + meiaVolta(t.a - this.a);
    for (var s = 0; s < n; s++) {
      this.vx += (K * (t.x - this.x) - C * this.vx) * h; this.x += this.vx * h;
      this.vy += (K * (t.y - this.y) - C * this.vy) * h; this.y += this.vy * h;
      this.va += (K * (ta - this.a) - C * this.va) * h; this.a += this.va * h;
      this.vc += (K * (t.c - this.c) - C * this.vc) * h; this.c += this.vc * h;
      this.ve += (K * (t.e - this.e) - C * this.ve) * h; this.e += this.ve * h;
      this.vr += (K * (t.anel - this.anel) - C * this.vr) * h; this.anel += this.vr * h;
    }
    if (this.direto) {
      var d = this.direto;
      this.x += (t.x - this.x) * d; this.y += (t.y - this.y) * d; this.a += (ta - this.a) * d;
      this.c += (t.c - this.c) * d; this.e += (t.e - this.e) * d; this.anel += (t.anel - this.anel) * d;
      this.vx *= 1 - d; this.vy *= 1 - d; this.va *= 1 - d; this.vc *= 1 - d; this.ve *= 1 - d; this.vr *= 1 - d;
    }
    if (this.e < 0) { this.e = 0; if (this.ve < 0) this.ve = 0; }
    if (this.c < 0) { this.c = 0; if (this.vc < 0) this.vc = 0; }
    var fk = 1 - Math.exp(-dt * this.taxaK); this.k += (t.k - this.k) * fk;
    var fc = 1 - Math.exp(-dt * this.taxaCor);
    for (var j = 0; j < 3; j++) this.cor[j] += (t.cor[j] - this.cor[j]) * fc;
  };
  Peca.prototype.assentada = function (tol) {
    tol = tol || 0.6; var t = this.t;
    return Math.abs(t.x - this.x) < tol && Math.abs(t.y - this.y) < tol && Math.abs(t.c - this.c) < tol && Math.abs(t.e - this.e) < tol && Math.abs(this.vx) + Math.abs(this.vy) < 4;
  };

  var M = I.M = {
    vivo: true, COR: COR, campo: new I.Campo(canvas), pecas: [], vw: 0, vh: 0, dpr: 1, movel: false,
    p: { x: -9999, y: -9999, ativo: false, baixo: false, tMov: -10, tipo: 'mouse', vel: 0 },
    agora: 0, tLeitura: 0, tFim: 0, concluido: false, eventos: {}, atual: null, mundo: null, trocando: false,
    pal: null // o palimpsesto (fólio i), quando visível
  };
  for (var pi = 0; pi < I.MAXPECAS; pi++) M.pecas.push(new Peca(pi));
  M.Peca = Peca;
  M.clamp = clamp;
  M.esconder = function (de, atraso) { // recolhe as peças a partir de `de` (e = 0, guardadas onde estão)
    for (var i = de || 0; i < M.pecas.length; i++) { var p = M.pecas[i]; p.alvo({ e: 0, k: 1 }, atraso == null ? null : atraso); p.direto = 0; p.inteiro = false; }
  };
  M.limparPecas = function () { M.pecas.forEach(function (p) { p.por({ e: 0, c: 0, k: 1, anel: 0 }); p.direto = 0; p.K = 170; p.amort = 0.62; p.inteiro = false; p.taxaCor = 4; p.taxaK = 8; }); };
  M.evento = function (nome) { M.eventos[nome] = true; };
  M.concluir = function () { if (M.concluido) return; M.concluido = true; M.tFim = 0; mostrarSeguir(false); };

  /* ---------- medidas ---------- */
  function medir() {
    M.vw = window.innerWidth; M.vh = window.innerHeight; M.dpr = window.devicePixelRatio || 1;
    M.movel = M.vw < 860;
    M.campo.redimensionar(M.vw, M.vh, M.dpr);
    M.margem = 0;
    if (!M.movel) { var m = q('.folio.ativo .margem'); M.margem = (m && m.getBoundingClientRect().width) || Math.max(188, Math.min(252, M.vw * 0.155)); }
    M.gutter = M.movel ? 16 : 32;
    M.cabeca = M.movel ? 52 : 64;
    if (M.atual && M.atual.medir) M.atual.medir();
  }
  var tRedim = 0;
  window.addEventListener('resize', function () { clearTimeout(tRedim); tRedim = setTimeout(medir, 120); });

  /* ---------- o mundo: noite e dia ---------- */
  var GRAD = { noite: 'linear-gradient(180deg, #24211f 0%, #13110f 100%)', dia: 'linear-gradient(180deg, #fefbf9 0%, #d9d2cc 100%)' };
  GRAD.noite = 'linear-gradient(180deg, ' + getComputedStyle(raiz).getPropertyValue('--areia-900') + ' 0%, ' + getComputedStyle(raiz).getPropertyValue('--areia-950') + ' 100%)';
  GRAD.dia = 'linear-gradient(180deg, ' + getComputedStyle(raiz).getPropertyValue('--areia-50') + ' 0%, ' + getComputedStyle(raiz).getPropertyValue('--areia-300') + ' 100%)';
  M.mundoAgora = function (m) {
    M.mundo = m; raiz.setAttribute('data-theme', m === 'noite' ? 'dark' : 'light');
    M.corPrimaria = m === 'noite' ? COR['areia-100'] : COR['areia-900'];
    luz.style.visibility = 'hidden'; luz.style.transition = ''; luz.style.opacity = '';
  };
  /* troca de mundo num salto: a camada do outro mundo aparece por cima e depois vira o fundo */
  function mundoSuave(m, depois) {
    if (M.mundo === m) { if (depois) depois(); return; }
    luz.style.background = GRAD[m]; luz.style.clipPath = 'none'; luz.style.transition = 'none'; luz.style.opacity = '0'; luz.style.visibility = 'visible';
    luz.getBoundingClientRect();
    luz.style.transition = 'opacity 480ms cubic-bezier(0.65, 0, 0.35, 1)'; luz.style.opacity = '1';
    setTimeout(function () { M.mundoAgora(m); luz.style.clipPath = ''; if (depois) depois(); }, 500);
  }
  /* a íris: o dia entra num círculo que cresce (usado pela roda, do fólio iii para o iv) */
  M.iris = function (cx, cy, r) {
    luz.style.background = GRAD.dia; luz.style.transition = 'none'; luz.style.opacity = '1'; luz.style.visibility = 'visible';
    luz.style.clipPath = 'circle(' + Math.max(0, r).toFixed(1) + 'px at ' + cx.toFixed(1) + 'px ' + cy.toFixed(1) + 'px)';
  };

  /* ---------- as glosas e as falas ---------- */
  function condicao(s) {
    if (!s) return { tipo: 't', v: 0 };
    var m = s.split(':');
    if (m[0] === 't') return { tipo: 't', v: parseFloat(m[1]) || 0 };
    if (m[0] === 'e') return { tipo: 'e', v: m[1] };
    if (m[0] === 'fim') return { tipo: 'fim', v: parseFloat(m[1]) || 0 };
    return { tipo: 't', v: 0 };
  }
  function vale(c) {
    if (c.tipo === 't') return M.tLeitura >= c.v;
    if (c.tipo === 'e') return !!M.eventos[c.v];
    return M.concluido && M.tFim >= c.v;
  }
  /* parte o texto da glosa em palavras (spans), sem tocar nos elementos (i, sup, a) */
  function partir(el) {
    if (el._palavras) return el._palavras;
    var lista = [], andar = function (no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (f) {
        if (f.nodeType === 3) {
          var partes = f.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          partes.forEach(function (pt) {
            if (!pt) return;
            if (/^\s+$/.test(pt)) { frag.appendChild(document.createTextNode(pt)); return; }
            var s = document.createElement('span'); s.textContent = pt; s.className = 'ainda'; frag.appendChild(s); lista.push(s);
          });
          no.replaceChild(frag, f);
        } else if (f.nodeType === 1 && f.tagName !== 'SUP') andar(f);
        else if (f.nodeType === 1) { f.classList.add('ainda'); lista.push(f); }
      });
    };
    andar(el); el._palavras = lista; return lista;
  }
  function prepararGlosas(C) {
    C.glosas = qa('.glosa', C.sec).map(function (el) { el.classList.remove('visivel', 'ultima'); var l = partir(el); l.forEach(function (s) { s.classList.add('ainda'); }); return { el: el, c: condicao(el.getAttribute('data-quando')), n: 0, mostrada: false, lista: l, quando: 0 }; });
    C.falas = qa('.fala, .colofao', C.sec).map(function (el) { el.classList.remove('visivel'); return { el: el, c: condicao(el.getAttribute('data-quando')), mostrada: false }; });
  }
  var ordemGlosa = 0;
  function glosas(C, dt) {
    var parado = M.parado;
    C.glosas.forEach(function (g) {
      if (!g.mostrada && vale(g.c)) {
        g.mostrada = true; g.quando = ++ordemGlosa; g.el.classList.add('visivel');
        C.glosas.forEach(function (o) { o.el.classList.remove('ultima'); }); g.el.classList.add('ultima');
      }
      if (g.mostrada && g.n < g.lista.length) {
        var antes = Math.floor(g.n);
        g.n += dt * (parado ? 11 : 4.5);
        var agora = Math.min(g.lista.length, Math.floor(g.n));
        for (var i = antes; i < agora; i++) g.lista[i].classList.remove('ainda');
      }
    });
    C.falas.forEach(function (f) { if (!f.mostrada && vale(f.c)) { f.mostrada = true; f.el.classList.add('visivel'); } });
  }

  /* ---------- seguir: a saída que aparece com o tempo ---------- */
  var seguirVisivel = false;
  function mostrarSeguir(sim) {
    if (sim === seguirVisivel) return; seguirVisivel = sim; seguir.hidden = !sim;
    if (sim) seguir.textContent = M.atual && M.atual.id === 'vi' ? 'recomeçar' : 'seguir';
  }
  seguir.addEventListener('click', function (e) {
    e.preventDefault();
    if (!M.atual) return;
    if (M.atual.id === 'vi') { M.ir('limiar', 'salto'); return; }
    M.avancar('seguir');
  });

  /* ---------- as câmaras ---------- */
  var CAMARAS = {};
  ORDEM.forEach(function (id) { CAMARAS[id] = I.camaras[id](M); CAMARAS[id].id = id; CAMARAS[id].sec = q('#' + id); });
  M.camaras = CAMARAS;

  M.ir = function (id, modo) {
    var para = CAMARAS[id]; if (!para || M.trocando) return;
    var de = M.atual;
    M.trocando = true; mostrarSeguir(false);
    if (fontes.classList.contains('aberta')) fontes.classList.remove('aberta');
    var espera = de ? (modo === 'fluxo' && de.saidaRapida ? 0 : 420) : 0;
    if (de) { de.sec.classList.add('saindo'); if (de.sair) de.sair(para, modo); }
    var entrar = function () {
      if (de) { de.sec.classList.remove('ativo', 'saindo'); }
      if (modo !== 'fluxo' && modo !== 'seguir' || !de) M.pal = null;
      para.sec.classList.add('ativo');
      M.atual = para; M.tLeitura = 0; M.concluido = false; M.tFim = 0; M.eventos = {};
      prepararGlosas(para);
      folioRotulo.textContent = NUM[id];
      if (I.Som && I.Som.folio) I.Som.folio(id);
      try { history.replaceState(null, '', id === 'limiar' ? location.pathname + location.search : '#' + id); } catch (er) { /* sem histórico */ }
      medir();
      para.entrar(de ? de.id : null, modo || 'salto');
      M.trocando = false;
    };
    setTimeout(function () {
      if (modo === 'fluxo' && M.mundo === para.mundo) entrar();
      else if (modo === 'fluxo' && para.mundoJaTrocado) { M.mundoAgora(para.mundo); entrar(); }
      else { if (!de) { M.mundoAgora(para.mundo); entrar(); } else mundoSuave(para.mundo, entrar); }
    }, espera);
  };
  M.avancar = function (modo) {
    var i = ORDEM.indexOf(M.atual.id);
    if (i < ORDEM.length - 1) M.ir(ORDEM[i + 1], modo || 'fluxo');
  };

  /* ---------- o ponteiro ---------- */
  function naInterface(t) { return t && t.closest && t.closest('.cabeca, .indice, .fontes, .seguir, .saidas, a, .glosa sup'); }
  window.addEventListener('pointerdown', function (e) {
    if (naInterface(e.target)) return;
    M.p.x = e.clientX; M.p.y = e.clientY; M.p.baixo = true; M.p.ativo = true; M.p.tipo = e.pointerType; M.p.tMov = M.agora; M.p.alvo = e.target;
    if (I.Som) I.Som.acordar();
    if (M.atual && M.atual.baixo) M.atual.baixo(M.p, e);
  });
  window.addEventListener('pointermove', function (e) {
    var dx = e.clientX - M.p.x, dy = e.clientY - M.p.y;
    if (e.pointerType === 'mouse' || M.p.baixo) {
      if (Math.abs(dx) + Math.abs(dy) > 0.5) M.p.tMov = M.agora;
      M.p.px = M.p.x; M.p.py = M.p.y; M.p.x = e.clientX; M.p.y = e.clientY; M.p.ativo = true; M.p.tipo = e.pointerType;
      if (M.atual && M.atual.move && !naInterface(e.target)) M.atual.move(M.p, e);
    }
  }, { passive: true });
  function soltar(e) {
    if (!M.p.baixo) return;
    M.p.baixo = false; M.p.tMov = M.agora;
    if (M.atual && M.atual.cima) M.atual.cima(M.p, e);
    if (e.pointerType !== 'mouse') M.p.ativo = false;
  }
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
  document.addEventListener('pointerleave', function () { M.p.ativo = false; });
  window.addEventListener('blur', function () { M.p.ativo = false; if (M.p.baixo) soltar({ pointerType: M.p.tipo }); });
  window.addEventListener('wheel', function (e) { M.p.tMov = M.agora; if (M.atual && M.atual.roda && !naInterface(e.target)) M.atual.roda(e); }, { passive: true });
  window.addEventListener('keydown', function (e) {
    if (!indice.hidden || fontes.classList.contains('aberta')) return;
    if (e.target && e.target.closest && e.target.closest('.cabeca, .seguir, .saidas')) return;
    if (M.atual && M.atual.tecla) M.atual.tecla(e, true);
  });
  window.addEventListener('keyup', function (e) { if (M.atual && M.atual.tecla) M.atual.tecla(e, false); });

  /* ---------- o cursor: uma pequena cápsula que estica quando corre (só em ponteiro fino) ---------- */
  var cursor = null;
  if (FINO) {
    cursor = { el: document.createElement('div'), x: -99, y: -99, vx: 0, vy: 0, esc: 1 };
    cursor.el.className = 'cursor'; cursor.el.setAttribute('aria-hidden', 'true'); cursor.i = document.createElement('i'); cursor.el.appendChild(cursor.i);
    document.body.appendChild(cursor.el); raiz.classList.add('cursor-proprio');
  }
  function andarCursor(dt) {
    if (!cursor) return;
    var vis = M.p.ativo && M.p.tipo === 'mouse' && indice.hidden && !fontes.classList.contains('aberta');
    cursor.el.classList.toggle('visivel', vis);
    if (!vis) return;
    if (cursor.x < -90) { cursor.x = M.p.x; cursor.y = M.p.y; }
    var K = 640, C = 2 * Math.sqrt(K) * 0.82, n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (var s = 0; s < n; s++) { cursor.vx += (K * (M.p.x - cursor.x) - C * cursor.vx) * h; cursor.vy += (K * (M.p.y - cursor.y) - C * cursor.vy) * h; cursor.x += cursor.vx * h; cursor.y += cursor.vy * h; }
    var alvo = M.p.alvo, sobre = document.elementFromPoint ? document.elementFromPoint(M.p.x, M.p.y) : null;
    var interativo = sobre && sobre.closest && sobre.closest('a, button, .palavra');
    var escAlvo = interativo ? 2.6 : (M.p.baixo ? 0.8 : 1);
    if (M.atual && M.atual.cursorEsc) escAlvo = M.atual.cursorEsc(escAlvo);
    cursor.esc += (escAlvo - cursor.esc) * Math.min(1, dt * 14);
    cursor.el.classList.toggle('anel', escAlvo > 2);
    var vel = Math.hypot(cursor.vx, cursor.vy), estica = Math.min(26, vel * 0.016), ang = Math.atan2(cursor.vy, cursor.vx) * 180 / Math.PI + 90;
    cursor.el.style.transform = 'translate3d(' + cursor.x.toFixed(1) + 'px,' + cursor.y.toFixed(1) + 'px,0) rotate(' + (estica > 0.6 ? ang : 0).toFixed(1) + 'deg)';
    cursor.i.style.width = (10 * cursor.esc).toFixed(1) + 'px'; cursor.i.style.height = ((10 + estica) * cursor.esc).toFixed(1) + 'px';
  }

  /* ---------- o laço ---------- */
  var raf = 0, ultimo = 0;
  function quadro(agoraMs) {
    raf = requestAnimationFrame(quadro);
    var t0js = performance.now();
    var dtMs = ultimo ? agoraMs - ultimo : 16.7; ultimo = agoraMs;
    var dt = Math.min(0.05, dtMs / 1000);
    M.agora = agoraMs / 1000;
    M.parado = !M.p.baixo && (M.agora - M.p.tMov > 0.7);
    var C = M.atual;
    if (C) {
      M.tLeitura += dt * (M.parado || !M.p.ativo ? 1 : 0.4);
      if (M.concluido) M.tFim += dt;
      if (C.sec._fim !== M.concluido) { C.sec._fim = M.concluido; C.sec.classList.toggle('concluido', M.concluido); }
      if (C.quadro) C.quadro(dt, M);
      for (var i = 0; i < M.pecas.length; i++) M.pecas[i].passo(dt);
      if (C.depois) C.depois(dt, M);
      if (M.pal && C.id !== 'i') { M.pal.opac = Math.max(0, M.pal.opac - dt * 1.6); if (M.pal.opac <= 0) M.pal = null; }
      // só redesenha o campo se algo mudou (sem desenhar, o canvas guarda o último quadro)
      var h = (M.campo.versao || 0) * 7.13 + (M.pal ? M.pal.opac * 1000 + 3 : 0);
      for (var j = 0; j < M.pecas.length; j++) { var pc = M.pecas[j]; if (pc.e > 0.35) h += (j + 1) * (pc.x * 1.31 + pc.y * 1.73 + pc.a * 97 + pc.c * 2.11 + pc.e * 2.93 + pc.k * 0.71 + pc.anel * 1.17 + (pc.cor[0] + pc.cor[1] * 3 + pc.cor[2] * 5) * 50); }
      if (h !== M.hashCampo) {
        M.hashCampo = h;
        M.campo.limpar();
        if (M.pal && M.pal.opac > 0.002) M.campo.palimpsesto(M.pal.papel, M.pal.tinta, M.pal.opac);
        M.campo.pecas(M.pecas, 1);
        M.desenhou = (M.desenhou || 0) + 1;
      }
      glosas(C, dt);
      if (!M.concluido && !M.trocando && M.tLeitura >= (C.seguir || 30)) mostrarSeguir(true);
      if (M.concluido && !M.trocando && M.tFim >= (C.seguirFim || 3)) mostrarSeguir(true);
    }
    andarCursor(dt);
    if (M.hashCampo !== M.hashGov) M.campo.governar(dtMs, agoraMs); // só conta os quadros em que o campo pintou
    M.hashGov = M.hashCampo;
    M.msJS = (M.msJS || 0) * 0.92 + (performance.now() - t0js) * 0.08; // custo do quadro na CPU (para medir)
  }
  M.parar = function () { M.vivo = false; cancelAnimationFrame(raf); raf = 0; M.campo.limpar(); if (I.Som) I.Som.desligar(); if (cursor) cursor.el.remove(); raiz.classList.remove('cursor-proprio'); };
  document.addEventListener('visibilitychange', function () {
    if (!M.vivo) return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; if (I.Som) I.Som.pausar(true); }
    else if (!raf) { ultimo = 0; raf = requestAnimationFrame(quadro); if (I.Som) I.Som.pausar(false); }
  });
  M.campo.aoRestaurar = function () { if (M.atual && M.atual.restaurar) M.atual.restaurar(); };
  M.campo.aoDensidade = function () { if (M.atual && M.atual.restaurar) M.atual.restaurar(); };

  /* ---------- começa ---------- */
  medir();
  var pedido = (location.hash || '').slice(1), qs = /[?&]folio=([a-z]+)/.exec(location.search);
  if (qs) pedido = qs[1];
  var inicio = CAMARAS[pedido] ? pedido : 'limiar';
  var comecar = function () { M.ir(inicio, 'inicio'); raf = requestAnimationFrame(quadro); };
  // as fontes estão embutidas; espera os cortes usados no canvas (o palimpsesto desenha texto)
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('200 100px "PP Neue Montreal"'), document.fonts.load('300 100px "PP Neue Montreal"'),
      document.fonts.load('italic 400 16px "PP Neue Montreal Text"'), document.fonts.load('400 16px "PP Neue Montreal Text"')
    ]).then(comecar, comecar);
  } else comecar();
})();
