/*
 * Genealogia do inteiro — o cursor: uma cápsula.
 *
 * Só em ponteiro fino (mouse) e sem movimento reduzido. O cursor é um pequeno I que segue o mouse
 * por uma mola; quando corre, estica na direção do movimento (o comprimento cresce, a espessura
 * fica), como as cápsulas da marca. Sobre o que se clica, vira um anel; sobre um orb, some (o orb
 * olha para o mouse de verdade). O desenho para quando a mola assenta.
 */
(function () {
  'use strict';
  var G = window.Genealogia = window.Genealogia || {};
  var fino = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var parado = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  G.cursor = { x: -999, y: -999, ativo: false };
  if (!fino || parado) return;

  var el = document.createElement('div'); el.className = 'cursor'; el.setAttribute('aria-hidden', 'true');
  var miolo = document.createElement('i'); el.appendChild(miolo);
  document.body.appendChild(el);
  document.documentElement.classList.add('cursor-proprio');

  var mx = -999, my = -999, x = -999, y = -999, vx = 0, vy = 0, raf = 0, ultimo = 0, modo = '', esc = 1, escAlvo = 1;
  var K = 640, C = 2 * Math.sqrt(640) * 0.82;

  function quadro(agora) {
    var dt = Math.min(1 / 30, (agora - (ultimo || agora - 16)) / 1000); ultimo = agora;
    var n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (var i = 0; i < n; i++) { vx += (K * (mx - x) - C * vx) * h; vy += (K * (my - y) - C * vy) * h; x += vx * h; y += vy * h; }
    esc += (escAlvo - esc) * Math.min(1, dt * 14);
    var vel = Math.hypot(vx, vy), estica = Math.min(30, vel * 0.018), ang = Math.atan2(vy, vx) * 180 / Math.PI + 90;
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + (estica > 0.6 ? ang : 0).toFixed(1) + 'deg)';
    miolo.style.height = (10 + estica) * esc + 'px'; miolo.style.width = 10 * esc + 'px';
    if (vel > 2 || Math.abs(mx - x) > 0.3 || Math.abs(my - y) > 0.3 || Math.abs(escAlvo - esc) > 0.01) raf = requestAnimationFrame(quadro);
    else raf = 0;
  }
  function acordar() { if (!raf) { ultimo = 0; raf = requestAnimationFrame(quadro); } }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY; G.cursor.x = mx; G.cursor.y = my; G.cursor.ativo = true;
    if (x < -900) { x = mx; y = my; }
    el.classList.add('visivel');
    var alvo = e.target && e.target.closest ? e.target.closest('a, button, [data-cursor]') : null;
    var m = alvo ? (alvo.getAttribute('data-cursor') || 'anel') : '';
    if (m !== modo) { modo = m; el.setAttribute('data-modo', m); escAlvo = m === 'anel' ? 3.4 : m === 'some' ? 0.001 : 1; }
    acordar();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { el.classList.remove('visivel'); G.cursor.ativo = false; });
  window.addEventListener('blur', function () { el.classList.remove('visivel'); G.cursor.ativo = false; });
  window.addEventListener('pointerdown', function () { el.classList.add('aperta'); }, { passive: true });
  window.addEventListener('pointerup', function () { el.classList.remove('aperta'); }, { passive: true });
})();
