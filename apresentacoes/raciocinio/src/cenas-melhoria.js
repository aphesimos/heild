/*
 * O raciocínio do Consultor — a melhoria e o fecho: benchmark, dgm, burla, diferenca.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;

  /* ---------------- benchmark: o ciclo da correção ao caso de teste ---------------- */
  var CICLO = [[150, 60], [480, 60], [480, 230], [150, 230]];
  T.benchmark = {
    html: function (d) {
      var nos = d.etapas.map(function (e, i) {
        var p = CICLO[i];
        return '<div class="no-b" data-i="' + i + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px"><span class="n tnum">' + (i + 1) + '</span><b>' + h(e[0]) + '</b><span>' + h(e[1]) + '</span></div>';
      }).join('');
      var fios = [[260, 60, 370, 60], [480, 112, 480, 178], [370, 230, 260, 230], [150, 178, 150, 112]].map(function (f, i) {
        return '<path class="fio-b" data-i="' + i + '" d="M' + f[0] + ' ' + f[1] + ' L' + f[2] + ' ' + f[3] + '"/>';
      }).join('');
      var metas = d.metas.map(function (m) { return '<li><b>' + h(m[0]) + '</b><span>' + h(m[1]) + '</span></li>'; }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 520, '<div class="bench" data-e="zoom" style="--d:250ms">' +
        '<div class="ciclo"><svg class="fios-b" viewBox="0 0 640 300" aria-hidden="true">' + fios + '</svg>' + nos +
        '<div class="reservado"><span class="cadeado" aria-hidden="true"></span>reservado</div></div>' +
        '<ul class="metas">' + metas + '</ul><p class="bench-jur">' + h(d.juridico) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var svg = q(el, '.fios-b'), fios = qa(el, '.fio-b'), nos = qa(el, '.no-b');
      if (api.parado) { nos.forEach(function (n) { n.classList.add('on'); }); return; }
      R.laco(async function () {
        for (var i = 0; i < nos.length; i++) {
          nos.forEach(function (n, j) { n.classList.toggle('on', j === i); });
          await api.esperar(1500);
          await R.viajar(api, svg, fios[i], 1100);
        }
      });
    }
  };

  /* ---------------- dgm: o arquivo de variantes cresce; as que passam ficam, as que falham saem ---------------- */
  // [x, y, pai, passa, forte]. O índice 0 é a versão de partida. Uma fraca (6) dá origem ao salto (12).
  var ARVORE = [
    [230, 470, -1, 1, 0], [140, 390, 0, 1, 0], [320, 390, 0, 0, 0], [300, 390, 0, 1, 0], [90, 310, 1, 1, 0], [190, 310, 1, 0, 0],
    [350, 310, 3, 1, 0], [250, 310, 3, 0, 0], [60, 230, 4, 1, 0], [140, 230, 4, 0, 0], [330, 230, 6, 1, 0], [410, 230, 6, 0, 0],
    [300, 150, 10, 1, 1], [100, 150, 8, 1, 0], [240, 150, 10, 0, 0], [330, 70, 12, 1, 1]
  ];
  T.dgm = {
    html: function (d) {
      var art = d.artigo.map(function (a) { return '<li><b>' + h(a[0]) + '</b><span>' + h(a[1]) + '</span></li>'; }).join('');
      return '<div class="dividido dividido--estreito">' + R.cab(d) + R.encaixe(760, 540, '<div class="dgm" data-e="zoom" style="--d:250ms">' +
        '<div class="arquivo"><p class="rotulo">Arquivo de variantes</p><svg class="arv" viewBox="0 0 460 500" aria-hidden="true"><g class="ramos"></g><g class="nos-a"></g></svg>' +
        '<p class="arv-leg rotulo"><span class="leg-p"></span>passou e ficou <span class="leg-f"></span>não passou na prova <span class="leg-s"></span>o salto</p></div>' +
        '<div class="artigo-dgm"><p class="rotulo">No artigo</p><ul>' + art + '</ul><p class="rotulo fonte-dgm">' + h(d.fonte) + '</p><p class="lacos">' + h(d['laços']) + '</p></div>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ramos = q(el, '.ramos'), nos = q(el, '.nos-a'), svg = q(el, '.arv'), gs = {};
      function no(i, cls) {
        var n = ARVORE[i], g = R.svg('g', { 'class': 'no-a ' + (cls || ''), transform: 'translate(' + n[0] + ' ' + n[1] + ')' }, nos);
        gs[i] = g;
        R.svg('circle', { r: n[4] ? 13 : 10 }, g);
        if (n[4]) R.svg('circle', { r: 3.5, 'class': 'miolo' }, g);
        return g;
      }
      function ramo(i) { var n = ARVORE[i], p = ARVORE[n[2]]; return R.svg('path', { d: 'M' + p[0] + ' ' + p[1] + ' C ' + p[0] + ' ' + ((p[1] + n[1]) / 2) + ', ' + n[0] + ' ' + ((p[1] + n[1]) / 2) + ', ' + n[0] + ' ' + n[1], 'class': 'ramo' }, ramos); }
      function final() { ARVORE.forEach(function (n, i) { if (i && n[3]) ramo(i).classList.add('on'); if (n[3]) no(i, n[4] ? 'forte' : 'passou'); }); }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        ramos.innerHTML = ''; nos.innerHTML = ''; gs = {};
        no(0, 'passou'); await api.esperar(900);
        for (var i = 1; i < ARVORE.length; i++) {
          var n = ARVORE[i], pai = gs[n[2]];
          if (pai) pai.classList.add('escolhido');
          var r = ramo(i), L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L;
          await R.viajar(api, svg, r, 800, { cheio: r });
          var g = no(i, 'na-prova'); if (pai) pai.classList.remove('escolhido');
          await api.esperar(650);
          if (n[3]) { g.setAttribute('class', 'no-a ' + (n[4] ? 'forte' : 'passou')); r.classList.add('on'); }
          else { g.setAttribute('class', 'no-a falhou'); r.classList.add('falhou'); await api.esperar(500); g.remove(); r.remove(); }
          await api.esperar(250);
        }
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- burla: a variante tenta mexer no que está trancado e volta ---------------- */
  T.burla = {
    html: function (d) {
      var ed = d.editavel.map(function (t) { return '<li>' + h(t) + '</li>'; }).join('');
      var tr = d.trancado.map(function (t) { return '<li><span class="cad" aria-hidden="true"></span>' + h(t) + '</li>'; }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 500, '<div class="burla" data-e="zoom" style="--d:250ms">' +
        '<div class="historia"><div class="h-passo" data-i="0"><span class="n tnum">1</span><span>O detector procura os marcadores no registro.</span></div>' +
        '<div class="h-passo" data-i="1"><span class="n tnum">2</span><span>A variante apaga o registro dos marcadores.</span></div>' +
        '<div class="h-passo" data-i="2"><span class="n tnum">3</span><span>A nota sobe. O problema continua.</span></div>' +
        '<div class="medidores"><span class="rotulo">nota</span><i class="med nota"><i></i></i><span class="rotulo">problema resolvido</span><i class="med prob"><i></i></i></div></div>' +
        '<div class="zonas"><div class="zona ed"><p class="rotulo">A variante pode mudar</p><ul>' + ed + '</ul></div>' +
        '<div class="zona tr"><p class="rotulo">Fica trancado</p><ul>' + tr + '</ul></div>' +
        '<svg class="burla-svg" viewBox="0 0 600 230" aria-hidden="true"><line class="divisa" x1="300" y1="10" x2="300" y2="220"/></svg></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var passos = qa(el, '.h-passo'), nota = q(el, '.med.nota i'), prob = q(el, '.med.prob i'), svg = q(el, '.burla-svg'), tr = q(el, '.zona.tr');
      function final() { passos.forEach(function (p) { p.classList.add('on'); }); nota.style.transform = 'scaleX(1)'; prob.style.transform = 'scaleX(0.12)'; }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        passos.forEach(function (p) { p.classList.remove('on'); }); nota.style.transform = 'scaleX(0.3)'; prob.style.transform = 'scaleX(0.12)';
        await api.esperar(700);
        for (var i = 0; i < passos.length; i++) { passos[i].classList.add('on'); if (i === 2) nota.style.transform = 'scaleX(1)'; await api.esperar(1300); }
        // A variante anda pela área editável, tenta cruzar a divisa e volta.
        await R.viajar(api, svg, 'M60 60 C 140 20, 220 120, 150 160', 1300);
        await R.viajar(api, svg, 'M150 160 C 220 190, 260 130, 292 115', 1000);
        tr.classList.add('barrou'); await api.esperar(450); tr.classList.remove('barrou');
        await R.viajar(api, svg, 'M292 115 C 250 90, 180 60, 90 110', 1100);
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- diferenca: a tabela final, uma linha em foco por vez ---------------- */
  T.diferenca = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 400;
      var linhas = d.linhas.map(function (l, i) {
        return '<li class="dif" data-e style="--d:' + (300 + i * 70) + 'ms"><b>' + h(l[0]) + '</b><span class="comum">' + h(l[1]) + '</span><span class="cons">' + R.marca('sim') + h(l[2]) + '</span></li>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<div class="difer"><div class="dif-cab"><span></span><span>IA comum</span><span>' + R.orb('consultor', { tamanho: 22, estatico: true, extras: false }) + 'Consultor da Heild</span></div><ol class="difs">' + linhas + '</ol></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ls = qa(el, '.dif'), i = -1;
      if (api.parado) return;
      api.depois(1500, function () { api.intervalo(function () { i = (i + 1) % ls.length; ls.forEach(function (l, j) { l.classList.toggle('foco', j === i); }); }, 5000); });
    }
  };
})();
