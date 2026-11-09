/*
 * Genealogia do inteiro — as formações do campo de cápsulas.
 *
 * O campo é a matéria da marca: milhares de cápsulas (o material do <heild-logo>: traços de pontas
 * 100% redondas) que se arrumam em formações e se fundem como líquido. Cada formação é um
 * Float32Array com N cápsulas e 6 números por cápsula:
 *   x, y  centro, em px da tela
 *   a     ângulo em radianos (0 = de pé, como o I; positivo gira no sentido do relógio, como o rotate do SVG)
 *   c     comprimento total, com as pontas
 *   e     espessura (diâmetro). e = 0 é uma cápsula guardada: não aparece e espera dentro da forma
 *   g     grupo de deriva (-1 = parada)
 * As cápsulas de uma formação ficam ordenadas por uma chave diagonal (x + 0,35·y). Como todas as
 * formações seguem a mesma ordem, a cápsula i de uma vai para um lugar vizinho na seguinte: a
 * passagem varre a tela em cascata, como a divisão da logo, em vez de embaralhar.
 *
 * Fonte das medidas: o <heild-logo> (window.Heild.paths e as constantes do componente):
 * viewBox 1259 × 387, pílula de 147,297 por 386,111, cápsulas de 96, vão de 24.
 * Para portar ao site (React): este arquivo é puro, sem DOM além de um canvas de trabalho.
 */
(function () {
  'use strict';
  var G = window.Genealogia = window.Genealogia || {};

  var PASSO = 6;
  var CX = 634.344, CY = 193.055, H = 386.111, PW = 147.297, U = 96, STEP = 120;
  G.LOGO = { CX: CX, CY: CY, H: H, PW: PW, U: U, STEP: STEP, W: 1259, VH: 387 };
  G.PASSO = PASSO;

  /* ---------- utilidades ---------- */
  function aleatorio(semente) {
    var s = (semente >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function chave(x, y) { return x + y * 0.35; }
  function distSeg(px, py, ax, ay, bx, by) {
    var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy, t = l2 ? ((px - ax) * vx + (py - ay) * vy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    var dx = px - (ax + vx * t), dy = py - (ay + vy * t);
    return Math.sqrt(dx * dx + dy * dy);
  }
  /* a cápsula (x, y, a, c, e) contém o ponto? */
  function dentroCap(p, x, y) {
    var h = Math.max(0, (p.c - p.e) / 2), s = Math.sin(p.a), co = Math.cos(p.a);
    return distSeg(x, y, p.x - s * h, p.y + co * h, p.x + s * h, p.y - co * h) <= p.e / 2;
  }
  /* uma cápsula no formato do componente: cap(x, y, T, L, r em graus) */
  function capLogo(x, y, T, L, r) { return { x: x, y: y, e: T, c: L, a: (r || 0) * Math.PI / 180 }; }
  /* mapa das unidades da logo para px: S (escala) e origem */
  function mapaMeet(caixa, vb) {
    var S = Math.min(caixa.w / vb.w, caixa.h / vb.h);
    return { S: S, ox: caixa.x + (caixa.w - vb.w * S) / 2 - vb.x * S, oy: caixa.y + (caixa.h - vb.h * S) / 2 - vb.y * S };
  }
  function noMapa(m, c) { return { x: m.ox + c.x * m.S, y: m.oy + c.y * m.S, e: c.e * m.S, c: c.c * m.S, a: c.a }; }

  /*
   * Amostra pontos dentro de uma forma, em células de proporção `prop` (alto/largo), com fileiras
   * desencontradas e um pouco de tremor. Ajusta o passo até caber perto de n pontos.
   */
  function amostrar(caixa, n, dentro, area, al, prop, tremor) {
    prop = prop || 1.7; tremor = tremor == null ? 0.12 : tremor;
    var s = Math.sqrt(Math.max(area, 1) / Math.max(n, 1)), pts = [], sx = s, sy = s;
    for (var tent = 0; tent < 6; tent++) {
      sx = s / Math.sqrt(prop); sy = s * Math.sqrt(prop); pts = [];
      var semente = al();
      for (var y = sy / 2, lin = 0; y < caixa.h; y += sy, lin++) {
        for (var x = (lin % 2 ? sx : sx / 2); x < caixa.w; x += sx) {
          var r1 = Math.sin((x * 12.9898 + y * 78.233 + semente * 400) ) * 43758.5453, j1 = r1 - Math.floor(r1);
          var r2 = Math.sin((x * 39.3468 + y * 11.135 + semente * 300)) * 24634.6345, j2 = r2 - Math.floor(r2);
          var px = x + (j1 - 0.5) * tremor * sx, py = y + (j2 - 0.5) * tremor * sy;
          if (dentro(px, py)) pts.push([caixa.x + px, caixa.y + py]);
        }
      }
      var r = pts.length / n;
      if (r <= 1.02 && r >= 0.9) break;
      s *= Math.sqrt(Math.max(r, 0.05)) * (r > 1 ? 1.004 : 0.996);
    }
    if (pts.length > n) { // sobrou um pouco: tira ao acaso, sem abrir buraco grande
      for (var i = pts.length - 1; i > 0; i--) { var k = Math.floor(al() * (i + 1)), t = pts[i]; pts[i] = pts[k]; pts[k] = t; }
      pts.length = n;
    }
    return { pts: pts, sx: sx, sy: sy, s: Math.sqrt(sx * sy) };
  }
  /* desenha num canvas de trabalho e amostra onde há tinta */
  function amostrarDesenho(caixa, n, desenhar, al, prop) {
    var q = Math.min(1, 640 / Math.max(caixa.w, caixa.h, 1));
    var w = Math.max(8, Math.round(caixa.w * q)), h = Math.max(8, Math.round(caixa.h * q));
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.setTransform(q, 0, 0, q, 0, 0); ctx.fillStyle = '#000';
    desenhar(ctx);
    var px = ctx.getImageData(0, 0, w, h).data, area = 0;
    for (var i = 3; i < px.length; i += 4) if (px[i] > 127) area++;
    area /= q * q;
    var dentro = function (x, y) {
      var ix = Math.floor(x * q), iy = Math.floor(y * q);
      return ix >= 0 && iy >= 0 && ix < w && iy < h && px[(iy * w + ix) * 4 + 3] > 127;
    };
    return amostrar(caixa, n, dentro, area, al, prop);
  }

  /*
   * Monta a formação: as cápsulas visíveis e, se faltarem, guardadas (e = 0) em cima de visíveis
   * sorteadas, para nascerem de dentro da forma. Ordena tudo pela chave.
   */
  function montar(n, itens, al) {
    var lista = itens.slice(0, n), m = lista.length, f = new Float32Array(n * PASSO);
    for (var i = m; i < n; i++) {
      var h = m ? lista[Math.floor(al() * m)] : { x: 0, y: 0, a: 0, g: -1 };
      lista.push({ x: h.x + (al() - 0.5) * 2, y: h.y + (al() - 0.5) * 2, a: h.a, c: 0, e: 0, g: h.g });
    }
    lista.sort(function (p, q) { return chave(p.x, p.y) - chave(q.x, q.y); });
    for (var j = 0; j < n; j++) {
      var p = lista[j], o = j * PASSO;
      f[o] = p.x; f[o + 1] = p.y; f[o + 2] = p.a || 0; f[o + 3] = p.c; f[o + 4] = p.e; f[o + 5] = p.g == null ? -1 : p.g;
    }
    return f;
  }
  /* pontos amostrados viram cápsulas de pé (pequenos I), inclinadas por `a` */
  function capsulasDe(pts, sx, sy, a, kE, kC, g) {
    return pts.map(function (p) { return { x: p[0], y: p[1], a: a || 0, e: sx * (kE || 0.56), c: sy * (kC || 0.88), g: g == null ? -1 : g }; });
  }
  /* formação de poucas cápsulas grandes: o resto fica guardado dentro delas, espalhado pela área */
  function deGrandes(n, grandes, al) {
    var area = 0; grandes.forEach(function (c) { area += c.e * (c.c - c.e) + Math.PI * c.e * c.e / 4; });
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    grandes.forEach(function (c) { var r = c.c / 2; minX = Math.min(minX, c.x - r); minY = Math.min(minY, c.y - r); maxX = Math.max(maxX, c.x + r); maxY = Math.max(maxY, c.y + r); });
    var caixa = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    var dentro = function (x, y) { for (var i = 0; i < grandes.length; i++) if (dentroCap(grandes[i], caixa.x + x, caixa.y + y)) return true; return false; };
    var am = amostrar(caixa, n - grandes.length, dentro, area, al, 1.7, 0.3);
    var guard = am.pts.map(function (p) {
      var dono = grandes[0], best = 1e9;
      grandes.forEach(function (c) { var d = Math.hypot(c.x - p[0], c.y - p[1]); if (d < best) { best = d; dono = c; } });
      return { x: p[0], y: p[1], a: dono.a, c: 0, e: 0, g: -1 };
    });
    return montar(n, grandes.map(function (c) { return { x: c.x, y: c.y, a: c.a, c: c.c, e: c.e, g: -1 }; }).concat(guard), al);
  }

  /* inclinação da itálica, medida na própria fonte: o centro da tinta de um "l" no alto e embaixo */
  var inclinacaoMedida = null;
  function inclinacao(peso) {
    if (inclinacaoMedida != null) return inclinacaoMedida;
    var cv = document.createElement('canvas'); cv.width = 200; cv.height = 240;
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.font = 'italic ' + (peso || 400) + ' 200px "PP Neue Montreal"'; ctx.fillStyle = '#000';
    ctx.fillText('l', 70, 220);
    var px = ctx.getImageData(0, 0, 200, 240).data;
    var centro = function (y) { var s = 0, k = 0; for (var x = 0; x < 200; x++) if (px[(y * 200 + x) * 4 + 3] > 127) { s += x; k++; } return k ? s / k : null; };
    var a = centro(90), b = centro(200);
    inclinacaoMedida = a != null && b != null ? Math.atan2(a - b, 110) : 0.15;
    if (!(inclinacaoMedida > 0.02 && inclinacaoMedida < 0.35)) inclinacaoMedida = 0.15;
    return inclinacaoMedida;
  }

  /* ---------- as formações ---------- */
  var F = {};

  /* a palavra heild, em itálico, num peso do eixo variável (100 a 900). `tam` em px fixa o corpo para fino e pesado ficarem no mesmo lugar */
  F.palavra = function (caixa, n, peso, tam) {
    var al = aleatorio(11 + peso), fonte = function (t) { return 'italic ' + peso + ' ' + t + 'px "PP Neue Montreal"'; };
    var cv = document.createElement('canvas').getContext('2d');
    cv.font = fonte(100); var m = cv.measureText('heild');
    var larg = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || m.width, alt = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    var k = tam ? tam / 100 : Math.min(caixa.w * 0.98 / larg, caixa.h * 0.96 / alt);
    var am = amostrarDesenho(caixa, n, function (ctx) {
      ctx.font = fonte(100 * k);
      var mm = ctx.measureText('heild'), L = (mm.actualBoundingBoxLeft + mm.actualBoundingBoxRight) || mm.width;
      var A = mm.actualBoundingBoxAscent, D = mm.actualBoundingBoxDescent;
      ctx.fillText('heild', (caixa.w - L) / 2 + mm.actualBoundingBoxLeft, (caixa.h - (A + D)) / 2 + A);
    }, al, 1.75);
    return { f: montar(n, capsulasDe(am.pts, am.sx, am.sy, inclinacao(peso)), al), esc: am.s, tam: 100 * k };
  };
  /* o corpo que cabe a palavra no peso mais largo, para usar nos dois */
  F.tamanhoPalavra = function (caixa) {
    var cv = document.createElement('canvas').getContext('2d');
    cv.font = 'italic 900 100px "PP Neue Montreal"'; var m = cv.measureText('heild');
    var larg = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || m.width, alt = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    return 100 * Math.min(caixa.w * 0.98 / larg, caixa.h * 0.96 / alt);
  };

  /* o múltiplo: as cápsulas soltas pela tela, cada uma no seu ângulo, longe do texto (`evitar`) */
  F.muitos = function (tela, n, evitar, semente) {
    var al = aleatorio(semente || 23), itens = [], margem = Math.min(tela.w, tela.h) * 0.04;
    var area = tela.w * tela.h, quantas = Math.min(n, Math.max(60, Math.round(area / 2600)));
    var s = Math.sqrt(area / quantas), cols = Math.ceil(tela.w / s), lins = Math.ceil(tela.h / s);
    var fora = function (x, y) {
      for (var i = 0; i < evitar.length; i++) { var r = evitar[i]; if (x > r.x - 24 && x < r.x + r.w + 24 && y > r.y - 24 && y < r.y + r.h + 24) return false; }
      return x > margem && x < tela.w - margem && y > margem * 1.6 && y < tela.h - margem;
    };
    for (var j = 0; j < lins; j++) for (var i = 0; i < cols; i++) {
      var x = tela.x + (i + 0.5 + (al() - 0.5) * 0.8) * s, y = tela.y + (j + 0.5 + (al() - 0.5) * 0.8) * s;
      if (!fora(x - tela.x, y - tela.y)) continue;
      var e = s * (0.07 + al() * 0.07), c = e * (1.6 + al() * 3.2);
      itens.push({ x: x, y: y, a: (al() - 0.5) * Math.PI, e: e, c: c, g: itens.length % 48 });
    }
    return { f: montar(n, itens, al), esc: s * 0.5 };
  };

  /* a pílula no mapa da logo: cheia (milhares de cápsulas que formam o I), única (uma peça só), em contração e dividida na grade de 9 */
  var VB_PILULA = { x: CX - 300, y: -40, w: 600, h: H + 80 };
  G.VB_PILULA = VB_PILULA;
  F.pilulaCheia = function (caixa, n) {
    var m = mapaMeet(caixa, VB_PILULA), p = noMapa(m, capLogo(CX, CY, PW, H)), al = aleatorio(31);
    var bx = { x: p.x - p.e / 2, y: p.y - p.c / 2, w: p.e, h: p.c };
    var area = p.e * (p.c - p.e) + Math.PI * p.e * p.e / 4;
    var am = amostrar(bx, n, function (x, y) { return dentroCap(p, bx.x + x, bx.y + y); }, area, al, 1.7, 0.1);
    return { f: montar(n, capsulasDe(am.pts, am.sx, am.sy, 0, 0.6, 0.86), al), esc: am.s * 1.7, mapa: m };
  };
  F.pilulaUnica = function (caixa, n) {
    var m = mapaMeet(caixa, VB_PILULA);
    return { f: deGrandes(n, [noMapa(m, capLogo(CX, CY, PW, H))], aleatorio(37)), esc: 30 * m.S, mapa: m };
  };
  F.contracao = function (caixa, n) { // a pílula engorda 7% e encolhe 5% (os 160 ms da contração)
    var m = mapaMeet(caixa, VB_PILULA);
    return { f: deGrandes(n, [noMapa(m, capLogo(CX, CY, PW * 1.07, H * 0.95))], aleatorio(41)), esc: 30 * m.S, mapa: m };
  };
  F.grade9 = function (caixa, n) {
    var m = mapaMeet(caixa, VB_PILULA), g = [];
    for (var j = -1; j <= 1; j++) for (var i = -1; i <= 1; i++) g.push(noMapa(m, capLogo(CX + i * STEP, CY + j * STEP, U, U)));
    return { f: deGrandes(n, g, aleatorio(43)), esc: 30 * m.S, mapa: m };
  };

  /* HE, a pílula e LD, amostrados dos traçados oficiais (window.Heild.paths), na caixa exata do <heild-logo> */
  F.marca = function (caixaLogo, n) {
    var P = window.Heild && window.Heild.paths, al = aleatorio(53);
    if (!P) return F.pilulaUnica(caixaLogo, n);
    var S = caixaLogo.w / 1259;
    var am = amostrarDesenho(caixaLogo, n, function (ctx) {
      ctx.save(); ctx.scale(S, S);
      ctx.fill(new Path2D(P.HE)); ctx.fill(new Path2D(P.LD), 'evenodd');
      var px = P.pill.cx - P.pill.width / 2, py = P.pill.cy - P.pill.height / 2, r = P.pill.width / 2;
      ctx.beginPath(); ctx.moveTo(px + r, py); ctx.arc(px + r, py + r, r, Math.PI, 0); ctx.lineTo(px + 2 * r, py + P.pill.height - r);
      ctx.arc(px + r, py + P.pill.height - r, r, 0, Math.PI); ctx.closePath(); ctx.fill();
      ctx.restore();
    }, al, 1.6);
    return { f: montar(n, capsulasDe(am.pts, am.sx, am.sy, 0, 0.6, 0.86), al), esc: am.s * 1.15 };
  };

  /* areia: grãos soltos no ar, depois assentados em estratos, depois uma superfície só */
  F.graos = function (tela, n) {
    var al = aleatorio(61), itens = [], q = Math.min(n, Math.round(tela.w * tela.h / 900));
    for (var i = 0; i < q; i++) {
      var e = 1.6 + al() * 2.2;
      itens.push({ x: tela.x + al() * tela.w, y: tela.y + al() * tela.h * 0.94, a: 0, e: e, c: e, g: i % 64 });
    }
    return { f: montar(n, itens, al), esc: 3 };
  };
  F.estratos = function (tela, n) {
    // fileiras de grãos assentados, cada estrato com a sua densidade; espaçados para não se tocarem
    var al = aleatorio(67), itens = [], topo = tela.y + tela.h * 0.74, base = tela.y + tela.h * 0.985;
    var q = Math.min(n, Math.round(tela.w * tela.h / 900)), linhas = [], soma = 0;
    for (var y = topo; y < base; y += 5) { var d = 0.2 + 0.8 * Math.pow(0.5 + 0.5 * Math.sin(y * 0.09 + Math.sin(y * 0.027) * 3), 2) * ((y - topo) / (base - topo) * 0.6 + 0.4); linhas.push([y, d]); soma += d; }
    linhas.forEach(function (l) {
      var k = Math.max(1, Math.round(q * l[1] / soma)), passo = tela.w / k, x0 = al() * passo;
      for (var i = 0; i < k; i++) { var e = 1.2 + al() * 1.3; itens.push({ x: tela.x + x0 + i * passo + (al() - 0.5) * passo * 0.5, y: l[0] + (al() - 0.5) * 1.6, a: 0, e: e, c: e, g: -1 }); }
    });
    return { f: montar(n, itens, al), esc: 4 };
  };
  F.superficie = function (tela, n) {
    var al = aleatorio(71), bx = { x: tela.x - 20, y: tela.y + tela.h * 0.9, w: tela.w + 40, h: tela.h * 0.1 + 10 };
    var am = amostrar(bx, Math.min(n, Math.round(tela.w * tela.h / 900)), function () { return true; }, bx.w * bx.h, al, 1, 0.2);
    return { f: montar(n, am.pts.map(function (p) { return { x: p[0], y: p[1], a: 0, e: am.sx * 0.5, c: am.sx * 0.5, g: -1 }; }), al), esc: am.s * 1.2 };
  };

  /* a grade de pontos da marca, a cada 24 (ou mais, se a tela não couber em n pontos) */
  /* sob o texto, a grade abre uma área lisa (marca-e-site: "sob texto pequeno, deixe uma área lisa de fundo") */
  F.grade = function (tela, n, evitar) {
    var al = aleatorio(73), s = 24;
    while (Math.ceil(tela.w / s) * Math.ceil(tela.h / s) > n) s += 2;
    var itens = [], x0 = (tela.w % s) / 2, y0 = (tela.h % s) / 2, ev = evitar || [];
    // distância até o retângulo mais perto: os pontos encolhem até sumir em 72 px antes do texto
    var folga = function (x, y) {
      var m = 1e9;
      for (var i = 0; i < ev.length; i++) { var r = ev[i], dx = Math.max(r.x - x, 0, x - r.x - r.w), dy = Math.max(r.y - y, 0, y - r.y - r.h); m = Math.min(m, Math.hypot(dx, dy)); }
      return m;
    };
    for (var y = y0; y < tela.h; y += s) for (var x = x0; x < tela.w; x += s) {
      var k = Math.min(1, Math.max(0, (folga(tela.x + x, tela.y + y) - 16) / 72));
      if (k > 0.05) itens.push({ x: tela.x + x, y: tela.y + y, a: 0, e: 2.4 * (0.35 + 0.65 * k), c: 2.4 * (0.35 + 0.65 * k), g: -1 });
    }
    return { f: montar(n, itens, al), esc: 2, passo: s };
  };

  /* o fim: tudo volta para a pílula do <heild-logo> final */
  F.pilulaFinal = function (caixaLogo, n) {
    var S = caixaLogo.w / 1259;
    var p = { x: caixaLogo.x + CX * S, y: caixaLogo.y + CY * S, e: PW * S, c: H * S, a: 0 };
    return { f: deGrandes(n, [p], aleatorio(79)), esc: Math.max(6, 40 * S) };
  };

  G.F = F;
  G.mapaMeet = mapaMeet;
  G.aleatorio = aleatorio;
})();
