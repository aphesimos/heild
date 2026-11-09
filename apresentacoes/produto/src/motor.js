/*
 * Apresentação da Heild — o motor.
 * Palco escalado, navegação (teclado, toque, controles), passos, versões pelo endereço (#principal,
 * #contabil, #bpo; #contabil-7 abre o slide 7), visão geral, notas e a troca de tema em onda.
 * Cada slide é desenhado de novo ao chegar, então as cenas sempre começam do zero.
 */
(function () {
  'use strict';
  var D = window.HEILD_APRESENTACAO, T = window.HEILD_TIPOS;
  var VERSOES = D.versoes();
  var raiz = document.documentElement;
  var palco = document.querySelector('.palco');
  var moldura = document.querySelector('.moldura');
  var onde = moldura.querySelector('.onde');
  var barra = moldura.querySelector('.progresso i');
  var controles = document.querySelector('.controles');
  var RMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var DMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener: function () {} };

  var versao = null, slides = [], els = [], atual = -1, passo = 0, cena = null;

  /* ---------- utilidades ---------- */
  function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
  function escuroAgora() { var t = raiz.getAttribute('data-theme'); return t ? t === 'dark' : DMQ.matches; }
  function colorir(el) {
    qa(el || palco, 'orb-avatar[data-cor]').forEach(function (o) {
      var cs = getComputedStyle(o), c = cs.getPropertyValue(o.dataset.cor).trim();
      if (c && o.getAttribute('color') !== c) o.setAttribute('color', c);
      if (o.dataset.olho) { var e = cs.getPropertyValue(o.dataset.olho).trim(); if (e && o.getAttribute('eye-color') !== e) o.setAttribute('eye-color', e); }
    });
  }
  function dividirTitulos(el) {
    qa(el, '.titulo, .display').forEach(function (t) {
      if (t.dataset.dividido) return; t.dataset.dividido = '1';
      var palavras = t.textContent.trim().split(/\s+/);
      t.setAttribute('aria-label', t.textContent.trim());
      t.innerHTML = palavras.map(function (p, i) { return '<span class="p" aria-hidden="true" style="--i:' + i + '">' + p.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
    });
  }
  function passosDe(i) {
    var d = slides[i], t = T[d.tipo];
    if (t.passos) return t.passos;
    var el = els[i], m = 0;
    qa(el, '[data-passo]').forEach(function (x) { m = Math.max(m, +x.dataset.passo || 0); });
    return m;
  }

  /* ---------- escala e encaixe ---------- */
  function escalar() {
    var w = window.innerWidth, h = window.innerHeight;
    var retrato = h > w * 1.12 && w < 1000;
    raiz.classList.toggle('retrato', retrato);
    var pw = retrato ? 540 : 1280, ph = retrato ? 960 : 720;
    palco.style.setProperty('--escala', Math.min(w / pw, h / ph));
    if (atual >= 0) encaixar(els[atual]);
  }
  function encaixar(el) {
    qa(el, '.encaixe').forEach(function (e) {
      var pai = e.parentElement, w = parseFloat(e.style.getPropertyValue('--w')), h = parseFloat(e.style.getPropertyValue('--h'));
      var aw = pai.clientWidth, ah = pai.clientHeight;
      if (!aw || !ah) return;
      e.style.transform = 'scale(' + Math.min(aw / w, ah / h, 1).toFixed(4) + ')';
    });
  }

  /* ---------- cena: o que um slide liga ao chegar e desliga ao sair ---------- */
  function criarCena() {
    var c = { vivo: true, timeouts: [], intervals: [], ouvintes: [], aoSair: [], aoTema: [] };
    var api = {
      parado: RMQ.matches,
      vivo: function () { return c.vivo; },
      depois: function (ms, fn) { var id = setTimeout(function () { if (c.vivo) fn(); }, ms); c.timeouts.push(id); return id; },
      intervalo: function (fn, ms) { var id = setInterval(function () { if (c.vivo) fn(); }, ms); c.intervals.push(id); return id; },
      esperar: function (ms) { return new Promise(function (res) { var id = setTimeout(function () { if (c.vivo) res(); }, ms); c.timeouts.push(id); }); },
      quadro: function (fn) {
        var laco = function (t) { if (!c.vivo) return; if (fn(t) === false) return; requestAnimationFrame(laco); };
        requestAnimationFrame(laco);
      },
      digitar: function (el, texto, cps) {
        return new Promise(function (res) {
          if (!c.vivo) return;
          if (api.parado) { el.textContent = texto; res(); return; }
          var no = document.createTextNode(''), cur = document.createElement('span');
          cur.className = 'cursor-texto'; cur.setAttribute('aria-hidden', 'true');
          el.appendChild(no); el.appendChild(cur);
          var ms = 1000 / (cps || 55), t0 = performance.now(), n = 0;
          api.quadro(function (agora) {
            var k = Math.min(texto.length, Math.floor((agora - t0) / ms));
            if (k !== n) { n = k; no.textContent = texto.slice(0, n); }
            if (n >= texto.length) { cur.remove(); res(); return false; }
            return true;
          });
        });
      },
      ouvir: function (alvo, ev, fn, op) { if (!alvo) return; alvo.addEventListener(ev, fn, op); c.ouvintes.push([alvo, ev, fn, op]); },
      aoSair: function (fn) { c.aoSair.push(fn); },
      aoTema: function (fn) { c.aoTema.push(fn); },
      colorir: colorir,
      escuro: escuroAgora,
      avancar: function () { avancar(); },
      repetir: function () { repetir(); }
    };
    c.api = api;
    c.encerrar = function () {
      c.vivo = false;
      c.timeouts.forEach(clearTimeout); c.intervals.forEach(clearInterval);
      c.ouvintes.forEach(function (o) { o[0].removeEventListener(o[1], o[2], o[3]); });
      c.aoSair.forEach(function (fn) { try { fn(); } catch (e) { /* segue */ } });
    };
    return c;
  }

  /* ---------- montar uma versão ---------- */
  function montar(v) {
    versao = v; slides = v.slides; atual = -1; passo = 0;
    if (cena) { cena.encerrar(); cena = null; }
    qa(palco, '.slide').forEach(function (s) { s.remove(); });
    els = slides.map(function (d, i) {
      var s = document.createElement('section');
      s.className = 'slide s-' + d.tipo;
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' de ' + slides.length + ': ' + (d.curto || d.titulo || ''));
      palco.insertBefore(s, moldura);
      return s;
    });
    document.title = v.id === 'principal' ? 'Apresentação da Heild' : 'Apresentação da ' + v.nome;
    controles.querySelector('.versao-atual').textContent = v.nome;
    construirVisaoGeral();
  }
  function desenhar(i) {
    var d = slides[i], t = T[d.tipo], el = els[i];
    el.dataset.grade = d.grade || t.grade || '';
    el.innerHTML = t.html(d);
    dividirTitulos(el);
    colorir(el);
  }

  /* ---------- navegação ---------- */
  function ir(n, p) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === atual) { definirPasso(p || 0); return; }
    var anterior = atual;
    if (cena) { cena.encerrar(); cena = null; }
    if (anterior >= 0) {
      var velho = els[anterior], t0 = T[slides[anterior].tipo];
      velho.classList.remove('ativo', 'visivel', 'entrou');
      velho.classList.add('saindo');
      if (t0.sair) try { t0.sair(velho); } catch (e) { /* segue */ }
      setTimeout(function () { if (!velho.classList.contains('ativo')) { velho.classList.remove('saindo'); velho.innerHTML = ''; } }, 620);
    }
    atual = n;
    var el = els[n];
    el.classList.remove('saindo', 'entrou', 'visivel');
    desenhar(n);
    el.classList.add('ativo');
    encaixar(el);
    void el.offsetWidth;
    el.classList.add('visivel');
    entrar(n, p || 0);
    atualizarMoldura();
    escreverEndereco();
  }
  function entrar(n, p) {
    var el = els[n], d = slides[n], t = T[d.tipo];
    cena = criarCena();
    passo = Math.min(p, passosDe(n));
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (atual === n) el.classList.add('entrou'); encaixar(el); }); });
    try { if (t.entrar) t.entrar(el, d, cena.api); } catch (e) { console.error(e); }
    aplicarPasso();
  }
  function aplicarPasso() {
    var el = els[atual], t = T[slides[atual].tipo];
    qa(el, '[data-passo]').forEach(function (x) { x.classList.toggle('visto', (+x.dataset.passo || 0) <= passo); });
    if (t.passo) try { t.passo(el, passo, cena.api); } catch (e) { console.error(e); }
    atualizarMoldura();
  }
  function definirPasso(p) { passo = Math.max(0, Math.min(passosDe(atual), p)); aplicarPasso(); }
  function avancar() {
    if (passo < passosDe(atual)) { passo++; aplicarPasso(); escreverEndereco(); return; }
    if (atual < slides.length - 1) ir(atual + 1, 0);
  }
  function voltar() {
    if (passo > 0) { passo--; aplicarPasso(); return; }
    if (atual > 0) { var n = atual - 1; ir(n, 0); definirPasso(passosDe(n)); }
  }
  function repetir() {
    var n = atual; if (n < 0) return;
    if (cena) { cena.encerrar(); cena = null; }
    var el = els[n];
    el.classList.remove('entrou');
    desenhar(n); encaixar(el);
    void el.offsetWidth;
    entrar(n, 0);
  }

  /* ---------- moldura e endereço ---------- */
  function atualizarMoldura() {
    if (atual < 0) return;
    var d = slides[atual], t = T[d.tipo], el = els[atual];
    onde.textContent = (d.capitulo ? d.capitulo + '  ·  ' : '') + (atual + 1) + ' / ' + slides.length;
    barra.style.setProperty('--p', ((atual + 1) / slides.length).toFixed(4));
    moldura.classList.toggle('sem-logo', !!(t.semLogo || el.querySelector('heild-logo')));
    moldura.classList.toggle('oculta', !!t.semRodape);
    if (notasAbertas) mostrarNotas();
  }
  function escreverEndereco() {
    var alvo = '#' + versao.id + (atual > 0 ? '-' + (atual + 1) : '');
    if (location.hash !== alvo) { try { history.replaceState(null, '', alvo); } catch (e) { location.hash = alvo; } }
  }
  function lerEndereco() {
    var m = (location.hash || '').replace(/^#/, '').match(/^([a-z][a-z0-9]*)?(?:-?(\d+))?$/i);
    var id = m && m[1] ? m[1].toLowerCase() : 'principal';
    var v = VERSOES.find(function (x) { return x.id === id; }) || VERSOES[0];
    var n = m && m[2] ? Math.max(0, parseInt(m[2], 10) - 1) : 0;
    return { v: v, n: n };
  }
  function trocarVersao(id, n) {
    var v = VERSOES.find(function (x) { return x.id === id; }); if (!v) return;
    montar(v); ir(n || 0, 0);
  }

  /* ---------- tema em onda ---------- */
  function trocarTema(origem) {
    var novo = escuroAgora() ? 'light' : 'dark';
    var aplicar = function () { raiz.setAttribute('data-theme', novo); aposTema(); };
    if (document.startViewTransition && !RMQ.matches) {
      var r = origem && origem.getBoundingClientRect ? origem.getBoundingClientRect() : { left: innerWidth - 40, top: innerHeight - 40, width: 0, height: 0 };
      var x = r.left + r.width / 2, y = r.top + r.height / 2, raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      try {
        var vt = document.startViewTransition(aplicar);
        vt.ready.then(function () {
          raiz.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + raio + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 760, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' });
        }).catch(function () {});
      } catch (e) { aplicar(); }
    } else aplicar();
  }
  function aposTema() {
    colorir(palco);
    if (cena) cena.aoTema.forEach(function (fn) { try { fn(); } catch (e) { /* segue */ } });
  }
  DMQ.addEventListener && DMQ.addEventListener('change', function () { if (!raiz.getAttribute('data-theme')) aposTema(); });
  // O tema de quem assiste pode mudar por fora (o claude.ai põe data-theme na raiz).
  new MutationObserver(function () { aposTema(); }).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---------- visão geral, versões, notas ---------- */
  var geral = document.querySelector('.visao-geral'), menu = document.querySelector('.menu-versoes'), notas = document.querySelector('.notas'), notasAbertas = false;
  function construirVisaoGeral() {
    var ol = geral.querySelector('ol'), cap = null, html = '';
    slides.forEach(function (d, i) {
      if (d.capitulo !== cap) { cap = d.capitulo; html += '<li class="capitulo">' + (cap || '') + '</li>'; }
      html += '<li><button type="button" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span class="t">' + (d.titulo || d.curto || '').replace(/</g, '&lt;') + '</span></button></li>';
    });
    ol.innerHTML = html;
    geral.querySelector('.vg-titulo').textContent = versao.nome + ' · ' + slides.length + ' slides';
  }
  function abrirGeral(abrir) {
    geral.hidden = !abrir;
    if (abrir) {
      qa(geral, 'li button').forEach(function (b) { b.setAttribute('aria-current', String(+b.dataset.i === atual)); });
      var b = geral.querySelector('[aria-current="true"]'); if (b) { b.focus(); b.scrollIntoView({ block: 'center' }); }
    }
  }
  geral.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]'); if (b) { abrirGeral(false); ir(+b.dataset.i, 0); return; }
    if (e.target.closest('.vg-fechar')) abrirGeral(false);
  });
  function construirMenu() {
    menu.innerHTML = '<p>Versão da apresentação</p>' + VERSOES.map(function (v) {
      return '<button type="button" data-v="' + v.id + '"><b>' + v.nome + '</b><small>' + v.descricao + '</small></button>';
    }).join('');
  }
  function abrirMenu(abrir) {
    menu.hidden = !abrir;
    controles.querySelector('[data-acao="versoes"]').setAttribute('aria-expanded', String(abrir));
    if (abrir) qa(menu, 'button').forEach(function (b) {
      var sel = b.dataset.v === versao.id; b.setAttribute('aria-current', String(sel));
      var m = b.querySelector('.marca-atual'); if (sel && !m) b.insertAdjacentHTML('beforeend', '<span class="marca-atual" aria-hidden="true"></span>'); if (!sel && m) m.remove();
    });
    if (abrir) { var a = menu.querySelector('[aria-current="true"]'); if (a) a.focus(); }
  }
  menu.addEventListener('click', function (e) { var b = e.target.closest('button[data-v]'); if (!b) return; abrirMenu(false); if (b.dataset.v !== versao.id) trocarVersao(b.dataset.v, 0); });
  function mostrarNotas() {
    var d = slides[atual];
    notas.innerHTML = '<b>Notas · ' + (atual + 1) + ' de ' + slides.length + '</b>' + (d.notas || d.frase || 'Sem notas para este slide.').replace(/</g, '&lt;');
  }
  function alternarNotas() { notasAbertas = !notasAbertas; notas.hidden = !notasAbertas; if (notasAbertas) mostrarNotas(); }
  function telaCheia() {
    var f = document.fullscreenElement;
    try { var p = f ? document.exitFullscreen() : raiz.requestFullscreen(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* sem tela cheia aqui */ }
  }

  /* ---------- controles ---------- */
  controles.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-acao]'); if (!b) return;
    var a = b.dataset.acao;
    if (a === 'voltar') voltar();
    else if (a === 'avancar') avancar();
    else if (a === 'versoes') abrirMenu(menu.hidden);
    else if (a === 'geral') abrirGeral(true);
    else if (a === 'tema') trocarTema(b);
    else if (a === 'cheia') telaCheia();
    else if (a === 'notas') alternarNotas();
  });
  document.addEventListener('click', function (e) { if (!menu.hidden && !e.target.closest('.menu-versoes') && !e.target.closest('[data-acao="versoes"]')) abrirMenu(false); });

  /* ---------- teclado ---------- */
  var digitos = '', irPara = document.querySelector('.ir-para'), tIr = 0;
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var alvo = e.target, k = e.key;
    if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable)) return;
    if (!geral.hidden) { if (k === 'Escape' || k === 'o' || k === 'O') { e.preventDefault(); abrirGeral(false); } return; }
    if (!menu.hidden && k === 'Escape') { abrirMenu(false); return; }
    var ativavel = alvo && alvo.closest && alvo.closest('button, a, [role="button"], [role="slider"], [role="tab"]') && alvo !== document.body;
    if ((k === ' ' || k === 'Enter') && ativavel) return;
    if (/^\d$/.test(k)) { digitos += k; irPara.hidden = false; irPara.textContent = 'Ir para o slide ' + digitos; clearTimeout(tIr); tIr = setTimeout(function () { digitos = ''; irPara.hidden = true; }, 2200); return; }
    if (k === 'Enter' && digitos) { e.preventDefault(); ir(parseInt(digitos, 10) - 1, 0); digitos = ''; irPara.hidden = true; return; }
    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); avancar(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); voltar(); break;
      case 'Home': e.preventDefault(); ir(0, 0); break;
      case 'End': e.preventDefault(); ir(slides.length - 1, 0); break;
      case 'o': case 'O': case 'Escape': if (k !== 'Escape') { e.preventDefault(); abrirGeral(true); } break;
      case 't': case 'T': trocarTema(controles.querySelector('[data-acao="tema"]')); break;
      case 'f': case 'F': telaCheia(); break;
      case 'n': case 'N': alternarNotas(); break;
      case 'r': case 'R': repetir(); break;
      case 'v': case 'V': abrirMenu(menu.hidden); break;
    }
  });

  /* ---------- toque: arrastar para os lados ---------- */
  var x0 = null, y0 = 0;
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1 || e.target.closest('.comparador, input, .controles, .visao-geral, .menu-versoes')) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 60) { if (dx < 0) avancar(); else voltar(); }
  }, { passive: true });

  /* ---------- controles somem com o mouse parado ---------- */
  var tParado = 0;
  function acordar(e) {
    raiz.classList.remove('parado'); clearTimeout(tParado);
    if (e && e.pointerType === 'mouse') tParado = setTimeout(function () { if (!controles.matches(':hover') && menu.hidden) raiz.classList.add('parado'); }, 2600);
  }
  document.addEventListener('pointermove', acordar, { passive: true });

  /* ---------- começo ---------- */
  window.addEventListener('resize', escalar);
  window.addEventListener('hashchange', function () {
    var r = lerEndereco();
    if (r.v !== versao) { montar(r.v); ir(r.n, 0); } else if (r.n !== atual) ir(r.n, 0);
  });
  construirMenu();
  escalar();
  var inicio = lerEndereco();
  montar(inicio.v);
  ir(inicio.n, 0);
  var dica = document.querySelector('.dica');
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches) dica.textContent = 'Arraste para os lados para passar os slides';
  setTimeout(function () { dica.classList.add('some'); }, 5200);
})();
