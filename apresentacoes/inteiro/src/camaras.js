/*
 * Do inteiro — as câmaras.
 *
 * Cada fólio é uma câmara com um gesto que a pessoa precisa descobrir:
 *   limiar  a pílula sozinha, no escuro; um toque a dissolve (solve);
 *   i       o palimpsesto: raspar a palavra até a raiz (inteiro, heild, heill, hāl, *hailaz, *kailo-);
 *   ii      as duas raízes: aproximar a família germânica da greco-latina; os sentidos se reconhecem;
 *   iii     a roda: três anéis de cápsulas, como a quarta figura de Llull; achar "o um é o todo";
 *   iv      os brancos: o dia; as palavras só se juntam quando a pessoa para;
 *   v       a obra: sal, mercúrio e enxofre só se ligam com insistência (coagula); soltar os separa;
 *   vi      o inteiro: a pílula e, uma única vez, o selo (<heild-logo>).
 * Uma câmara tem: entrar(de, modo), sair(para, modo), quadro(dt), medir(), e o que precisar de
 * baixo/move/cima (ponteiro), roda (mouse) e tecla. As peças do campo são do motor (M.pecas):
 * a câmara só muda os alvos; as molas fazem a passagem.
 * Medidas da logo (o <heild-logo>, viewBox 1259 × 387): pílula 147,297 × 386,111, cápsulas de 96, vão de 24.
 */
(function () {
  'use strict';
  var I = window.Inteiro;
  var LOGO = { W: 1259, H: 387, CX: 634.344, CY: 193.055, PH: 386.111, PW: 147.297, U: 96, STEP: 120 };
  var TAU = Math.PI * 2, VERTICAL = Math.PI / 2;
  function q(s, el) { return (el || document).querySelector(s); }
  function qa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function suave(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function sai(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function mix(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function aleatorio(s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function som(nome) { if (I.Som && I.Som[nome]) I.Som[nome].apply(I.Som, Array.prototype.slice.call(arguments, 1)); }
  /* a pílula do tamanho certo para a tela, nas proporções da logo */
  function pilula(M) {
    var Hp = M.movel ? Math.min(M.vh * 0.28, 250) : Math.min(M.vh * 0.34, 300);
    return { Hp: Hp, T: Hp * LOGO.PW / LOGO.PH, s: Hp / LOGO.PH };
  }
  /* posiciona um rótulo do DOM sobre uma peça (centro, ângulo legível) */
  function rotulo(el, x, y, a, op) {
    var g = a || 0; while (g > VERTICAL) g -= Math.PI; while (g <= -VERTICAL) g += Math.PI;
    el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) translate(-50%,-50%)' + (g ? ' rotate(' + (g * 180 / Math.PI).toFixed(2) + 'deg)' : '');
    if (op != null) el.style.opacity = op.toFixed(3);
  }
  /* largura do texto de um elemento, medida num canvas com a mesma fonte */
  var medidor = document.createElement('canvas').getContext('2d');
  function larguraTexto(el) {
    var cs = getComputedStyle(el);
    medidor.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    if ('letterSpacing' in medidor) medidor.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    return medidor.measureText(el.textContent).width;
  }

  var camaras = {};

  /* =====================================================================
   * limiar — a pílula sozinha, no escuro. Respira; quando o cursor chega perto, quase se abre (o meio
   * afina, como líquido). Um toque: contração, divisão em nove (a grade da forma centralizar da logo),
   * pausa, e as nove partes se espalham e somem: a obra começa por dissolver.
   * ===================================================================== */
  camaras.limiar = function (M) {
    var C = { mundo: 'noite', seguir: 21, saidaRapida: true };
    var sec = q('#limiar'), alvo = q('.alvo-pilula', sec);
    var estado = 'inteiro', tEstado = 0, prox = 0, cx = 0, cy = 0, P = null;
    C.medir = function () {
      P = pilula(M); cx = M.vw / 2; cy = M.vh * (M.movel ? 0.42 : 0.47);
      alvo.style.left = (cx - P.T * 0.9) + 'px'; alvo.style.top = (cy - P.Hp / 2) + 'px'; alvo.style.width = (P.T * 1.8) + 'px'; alvo.style.height = P.Hp + 'px';
    };
    /* a pílula: fechada, uma peça só (sem emenda); quando o cursor chega perto, duas metades que se
       afastam com um pescoço líquido entre elas. Desenhada direto (sem mola): `prox` já é suave. */
    function metades(abre, nasce) {
      var T = P.T, Hp = P.Hp, cor = M.corPrimaria, b = sai(nasce);
      var resp = Math.sin(M.agora * 1.15), Tr = T * (1 + 0.014 * resp) * b, Hr = Hp * (1 + 0.008 * Math.sin(M.agora * 1.15 + 0.7)) * lerp(0.6, 1, b);
      var p0 = M.pecas[0], p1 = M.pecas[1];
      if (abre < 0.015) {
        p0.por({ x: cx, y: cy, a: VERTICAL, c: Hr, e: Tr, k: 1, cor: cor });
        p1.por({ x: cx, y: cy, a: VERTICAL, c: 0, e: 0, k: 1, cor: cor });
        return;
      }
      var gap = abre * T * 0.34, k = 1 + abre * T * 0.2;
      var top0 = cy - Hr / 2, bot1 = cy + Hr / 2;
      var topIn = cy + Tr / 2 - abre * (Tr + gap) / 2, botIn = cy - Tr / 2 + abre * (Tr + gap) / 2;
      var inc = (M.p.ativo ? clamp((M.p.x - cx) / (P.Hp * 2), -1, 1) : 0) * abre * 0.06;
      p0.por({ x: cx, y: (top0 + topIn) / 2, a: VERTICAL + inc, c: Math.max(Tr, topIn - top0), e: Tr, k: k, cor: cor });
      p1.por({ x: cx, y: (botIn + bot1) / 2, a: VERTICAL + inc, c: Math.max(Tr, bot1 - botIn), e: Tr, k: k, cor: cor });
    }
    var nasce = 1;
    C.entrar = function (de, modo) {
      estado = 'inteiro'; tEstado = 0; prox = 0; C.medir();
      M.limparPecas();
      M.pecas.forEach(function (p) { p.K = 260; p.amort = 0.85; });
      nasce = modo === 'inicio' ? 1 : 0;
      metades(0, nasce);
      for (var i = 2; i < 9; i++) M.pecas[i].por({ x: cx, y: cy, a: VERTICAL, c: 0, e: 0, k: 1, cor: M.corPrimaria });
    };
    function dissolver() {
      if (estado !== 'inteiro') return;
      estado = 'contracao'; tEstado = 0; som('solve');
      M.pecas[0].alvo({ e: P.T * 1.07, c: P.Hp * 0.475 }); M.pecas[1].alvo({ e: P.T * 1.07, c: P.Hp * 0.475 });
    }
    C.quadro = function (dt) {
      tEstado += dt;
      if (estado === 'inteiro') {
        var d = Math.hypot(M.p.x - cx, M.p.y - cy), alvoP = M.p.ativo ? clamp(1 - (d - P.T) / (P.Hp * 1.4), 0, 1) : 0;
        prox += (alvoP - prox) * Math.min(1, dt * 3.2);
        nasce = Math.min(1, nasce + dt / 1.1);
        metades(prox * prox, nasce);
      } else if (estado === 'contracao' && tEstado > 0.16) {
        // divisão em nove, com cascata (a forma centralizar da logo), e a fusão líquida na travessia
        estado = 'divisao'; tEstado = 0;
        var s = P.s, U = LOGO.U * s, ST = LOGO.STEP * s, n = 0;
        for (var j = -1; j <= 1; j++) for (var i = -1; i <= 1; i++) {
          var p = M.pecas[n];
          p.K = 150; p.amort = 0.5; p.k = 14 * s * 3;
          p.alvo({ x: cx + i * ST, y: cy + j * ST, a: VERTICAL, c: U, e: U, k: 18 * s * 2, cor: M.corPrimaria }, n * 0.055);
          n++;
        }
      } else if (estado === 'divisao') {
        if (tEstado > 0.7) M.pecas.slice(0, 9).forEach(function (p) { p.alvo({ k: 1 }); });
        if (tEstado > 1.6) {
          // as partes se espalham e afundam no pergaminho
          estado = 'dispersa'; tEstado = 0;
          var al = aleatorio(7);
          M.pecas.slice(0, 9).forEach(function (p, i) {
            var ang = Math.atan2(p.y - cy, p.x - cx) + (al() - 0.5) * 0.6, dist = Math.max(M.vw, M.vh) * (0.22 + al() * 0.2);
            if (i === 4) ang = al() * TAU;
            p.K = 18; p.amort = 0.9;
            p.alvo({ x: p.x + Math.cos(ang) * dist, y: p.y + Math.sin(ang) * dist, e: 0, c: 0 }, i * 0.04);
          });
          M.ir('i', 'fluxo');
        }
      }
    };
    C.baixo = function (p) { if (Math.hypot(p.x - cx, p.y - cy) < P.Hp * 0.9) dissolver(); };
    alvo.addEventListener('click', function (e) { if (e.detail === 0) dissolver(); });
    C.tecla = function (e, desce) { if (desce && (e.key === 'Enter' || e.key === ' ') && document.activeElement === alvo) { e.preventDefault(); dissolver(); } };
    C.cursorEsc = function (esc) { return estado === 'inteiro' && prox > 0.5 ? 2.6 : esc; };
    return C;
  };

  /* =====================================================================
   * i — o palimpsesto. Seis camadas: a palavra de hoje por cima, e por baixo as mais velhas, até a raiz
   * reconstruída. Como no palimpsesto de Arquimedes, as camadas de baixo correm a 90 graus. O cursor
   * raspa (uma cápsula de raspagem a cada movimento); parado sobre um ponto, raspa devagar; apertado,
   * raspa mais. Quando a raiz aparece de verdade (uma parte boa da palavra), a câmara se cumpre.
   * ===================================================================== */
  camaras.i = function (M) {
    var C = { mundo: 'noite', seguir: 32, seguirFim: 3 };
    var sec = q('#i'), NC = I.NC;
    var estratos = qa('.estratos li', sec).map(function (li) { return { palavra: q('b', li).textContent, linha: q('span', li).textContent, giro: parseFloat(li.getAttribute('data-giro')) || 0 }; });
    var CEL = 6, cols = 0, lins = 0, D = null, bytes = null, mudou = false, contagem = [], raizCaixa = null, raizN = 0, raizCheias = 0;
    var opac = 0, alvoOpac = 0, tFim = 0, saindo = false, ultimo = null, canv = null;
    function cores() {
      var c = M.COR;
      return {
        papel: [[0, 0, 0, 0], c['areia-950'].concat(0.42), c['areia-950'].concat(0.58), c['areia-950'].concat(0.7), c['areia-950'].concat(0.8), c['areia-950'].concat(0.88)],
        tinta: [c['areia-100'], c['areia-300'], c['areia-400'], c['areia-500'], c['areia-600'], c['areia-50']]
      };
    }
    /* as camadas de texto, desenhadas em canvases do tamanho exato do campo (branco = tinta) */
    function desenharCamadas() {
      var campo = M.campo, dc = campo.dc, W = campo.canvas.width, H = campo.canvas.height;
      var cx = M.vw / 2, cy = M.vh * (M.movel ? 0.44 : 0.5);
      var S = M.movel ? Math.min(M.vw * 0.2, M.vh * 0.12) : Math.min(M.vw * 0.15, M.vh * 0.26);
      canv = [];
      for (var j = 0; j < NC; j++) {
        var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        var g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        g.setTransform(dc, 0, 0, dc, 0, 0); g.textAlign = 'center'; g.textBaseline = 'middle';
        var e = estratos[j], raiz = j === NC - 1, tam = raiz ? S * 0.92 : S * (j === 0 ? 1.08 : 1);
        var vert = e.giro !== 0;
        if (vert && M.movel) tam = Math.min(tam, M.vh * 0.11);
        g.save(); g.translate(cx, cy); if (vert) g.rotate(e.giro * Math.PI / 180);
        // as linhas pequenas: o texto da camada, repetido como num fólio pautado
        g.font = 'italic 400 ' + (M.movel ? 13 : 15) + 'px "PP Neue Montreal Text"';
        g.fillStyle = 'rgb(140,140,140)';
        var larg = vert ? M.vh : M.vw, passo = M.movel ? 22 : 26, linhas = vert ? 9 : 6;
        for (var n = 0; n < linhas; n++) {
          var lado = n % 2 ? 1 : -1, o = (Math.floor(n / 2) + 1) * passo + tam * 0.55;
          var frase = (e.linha + '   ·   ').repeat(Math.ceil(larg / Math.max(40, g.measureText(e.linha + '   ·   ').width)) + 1);
          g.save(); g.globalAlpha = 1 - Math.floor(n / 2) * 0.22;
          g.fillText(frase, (n * 37) % 90 - 45, lado * o);
          g.restore();
        }
        g.font = (raiz ? '300 ' : '200 ') + tam.toFixed(1) + 'px "PP Neue Montreal"';
        if ('letterSpacing' in g) g.letterSpacing = (-0.03 * tam).toFixed(2) + 'px';
        g.fillStyle = '#fff';
        g.fillText(e.palavra, 0, 0);
        if (raiz) {
          var w = g.measureText(e.palavra).width;
          raizCaixa = { x0: cx - w / 2, x1: cx + w / 2, y0: cy - tam * 0.36, y1: cy + tam * 0.36 };
        }
        g.restore();
        canv.push(cv);
      }
      campo.camadas(canv);
    }
    function novaGrade() {
      cols = Math.ceil(M.vw / CEL) + 1; lins = Math.ceil(M.vh / CEL) + 1;
      D = new Float32Array(cols * lins); bytes = new Uint8Array(cols * lins);
      contagem = []; for (var j = 0; j < NC; j++) contagem.push(0);
      raizCheias = 0; mudou = true;
    }
    function contarRaiz() {
      if (!raizCaixa) return;
      var a = Math.floor(raizCaixa.x0 / CEL), b = Math.ceil(raizCaixa.x1 / CEL), c = Math.floor(raizCaixa.y0 / CEL), d = Math.ceil(raizCaixa.y1 / CEL);
      raizN = Math.max(1, (b - a) * (d - c)); raizCheias = 0;
      for (var y = c; y < d; y++) for (var x = a; x < b; x++) if (D[y * cols + x] >= NC - 1) raizCheias++;
    }
    /* raspa ao longo de um segmento (uma cápsula de raio r), somando `qt` camadas no centro */
    function raspar(x0, y0, x1, y1, r, qt) {
      var a = Math.max(0, Math.floor((Math.min(x0, x1) - r) / CEL)), b = Math.min(cols - 1, Math.ceil((Math.max(x0, x1) + r) / CEL));
      var c = Math.max(0, Math.floor((Math.min(y0, y1) - r) / CEL)), d = Math.min(lins - 1, Math.ceil((Math.max(y0, y1) + r) / CEL));
      var vx = x1 - x0, vy = y1 - y0, l2 = vx * vx + vy * vy, r2 = r * r, max = NC - 0.02;
      for (var y = c; y <= d; y++) for (var x = a; x <= b; x++) {
        var px = x * CEL + CEL / 2, py = y * CEL + CEL / 2, t = l2 ? ((px - x0) * vx + (py - y0) * vy) / l2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var dx = px - (x0 + vx * t), dy = py - (y0 + vy * t), d2 = dx * dx + dy * dy;
        if (d2 >= r2) continue;
        var w = 1 - d2 / r2; w *= w;
        var i = y * cols + x, antes = D[i], depois = Math.min(max, antes + qt * w);
        if (depois === antes) continue;
        D[i] = depois; bytes[i] = Math.round(depois / NC * 255);
        for (var j = Math.floor(antes) + 1; j <= Math.floor(depois); j++) contagem[j]++;
      }
      mudou = true;
    }
    C.medir = function () {
      if (!D) return;
      var velho = { D: D, cols: cols, lins: lins };
      novaGrade();
      // guarda o que já foi raspado (a grade é em px da tela)
      for (var y = 0; y < Math.min(lins, velho.lins); y++) for (var x = 0; x < Math.min(cols, velho.cols); x++) { var v = velho.D[y * velho.cols + x]; D[y * cols + x] = v; bytes[y * cols + x] = Math.round(v / NC * 255); }
      desenharCamadas(); contarRaiz();
    };
    C.restaurar = function () { desenharCamadas(); mudou = true; };
    C.entrar = function (de, modo) {
      opac = 0; alvoOpac = 1; tFim = 0; saindo = false; ultimo = null;
      if (de !== 'limiar') { M.limparPecas(); }
      novaGrade(); desenharCamadas(); contarRaiz();
      M.pal = { opac: 0, papel: null, tinta: null };
      var k = cores(); M.pal.papel = k.papel; M.pal.tinta = k.tinta;
      setTimeout(function () { M.evento('estrato-0'); }, 1200);
    };
    C.sair = function () { alvoOpac = 0; };
    C.quadro = function (dt) {
      opac += (alvoOpac - opac) * Math.min(1, dt * (saindo ? 2.2 : 1.6));
      if (M.pal) M.pal.opac = opac;
      var p = M.p;
      // parado sobre um ponto, raspa devagar; apertado, raspa mais
      if (!M.concluido && p.ativo && (p.tipo === 'mouse' || p.baixo) && opac > 0.5) {
        var r = M.movel ? 30 : 26;
        if (ultimo) {
          var dx = p.x - ultimo.x, dy = p.y - ultimo.y, dist = Math.hypot(dx, dy);
          if (dist > 1.5) { raspar(ultimo.x, ultimo.y, p.x, p.y, r, (p.baixo ? 0.62 : 0.4) * Math.min(1, dist / 18 + 0.35)); som('raspa', dist / Math.max(dt, 0.008)); ultimo = { x: p.x, y: p.y }; }
          else raspar(p.x, p.y, p.x, p.y, r * 0.8, dt * (p.baixo ? 0.9 : 0.32));
        } else ultimo = { x: p.x, y: p.y };
      } else ultimo = null;
      if (teclaRaspa && !M.concluido) raspar(M.vw / 2 + Math.sin(M.agora * 2.1) * 60, M.vh / 2 + Math.cos(M.agora * 1.3) * 18, M.vw / 2 + Math.sin(M.agora * 2.1 + 0.3) * 60, M.vh / 2, 30, dt * 2.4);
      for (var j = 1; j < NC; j++) if (!M.eventos['estrato-' + j] && contagem[j] > 16) { M.evento('estrato-' + j); som('estrato', j); }
      if (mudou) { M.campo.profundidade(bytes, cols, lins, CEL); mudou = false; contarRaiz(); }
      if (!M.concluido && raizCheias / raizN > 0.2) { M.concluir(); som('achado'); }
      if (M.concluido) {
        tFim += dt;
        if (tFim > 4.2 && !saindo) { saindo = true; alvoOpac = 0; }
        if (tFim > 5.2 && !M.trocando && M.atual === C) M.ir('ii', 'fluxo');
      }
    };
    var teclaRaspa = false;
    C.tecla = function (e, desce) { if (e.key === ' ') { e.preventDefault(); teclaRaspa = desce; } };
    C.baixo = function () { ultimo = { x: M.p.x, y: M.p.y }; };
    return C;
  };

  /* =====================================================================
   * ii — as duas raízes. A família de *kailo- (whole, hale, heal, hail, holy) e a de *solh₂- (hólos,
   * salvus, salūs, salvē, sollemnis), cada palavra numa cápsula. Arrastar uma família para perto da
   * outra: cada palavra procura a que diz o mesmo e as duas se fundem numa cápsula só. As raízes,
   * no alto, nunca se tocam.
   * ===================================================================== */
  camaras.ii = function (M) {
    var C = { mundo: 'noite', seguir: 30, seguirFim: 4 };
    var sec = q('#ii');
    var fam = { a: qa('[data-familia="a"] .palavra', sec), b: qa('[data-familia="b"] .palavra', sec) };
    var sentidos = qa('.sentidos li', sec);
    var ancora = { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } }, casa = { a: null, b: null }, d0 = 1;
    var larg = { a: [], b: [] }, E = 36, fundido = [false, false, false, false, false], arrasto = null, auto = 0, tEntrada = 0, tFim = 0, saiu = false;
    var deriva = aleatorio(11);
    function pecaDe(f, i) { return M.pecas[(f === 'a' ? 0 : 6) + i]; } // i = 0 raiz, 1..5 palavras
    function offsets(f) {
      var m = f === 'a' ? -1 : 1, lista = [];
      if (M.movel) {
        var w = M.vw * 0.21, r = 46;
        lista = [[0, -1.7 * r], [-w, -0.55 * r], [w, -0.55 * r], [-w * 0.95, 0.6 * r], [w * 0.95, 0.6 * r], [0, 1.7 * r]];
      } else {
        var row = 66, jx = [0, -34, 30, -12, 40, -30];
        lista = [[0, -2.75 * row]];
        for (var i = 0; i < 5; i++) lista.push([jx[i + 1] * m, (i - 1.6) * row]);
      }
      return lista;
    }
    C.medir = function () {
      E = M.movel ? 32 : 38;
      ['a', 'b'].forEach(function (f) { larg[f] = fam[f].map(function (el) { return larguraTexto(el); }); });
      var A = M.movel ? { x: M.vw / 2, y: M.vh * 0.3 } : { x: M.vw * 0.33, y: M.vh * 0.52 };
      var B = M.movel ? { x: M.vw / 2, y: M.vh * 0.64 } : { x: M.vw * 0.67, y: M.vh * 0.52 };
      if (!casa.a || !arrasto) { casa.a = A; casa.b = B; }
      d0 = Math.hypot(B.x - A.x, B.y - A.y);
    };
    function comp(f, i) { return larg[f][i] + E + 18; }
    C.entrar = function (de, modo) {
      fundido = [false, false, false, false, false]; arrasto = null; auto = 0; tEntrada = 0; tFim = 0; saiu = false;
      sentidos.forEach(function (s) { s.classList.remove('visivel'); });
      C.medir();
      ancora.a = { x: casa.a.x, y: casa.a.y }; ancora.b = { x: casa.b.x, y: casa.b.y };
      M.limparPecas();
      var cx = M.vw / 2, cy = M.vh / 2, el = M.COR['areia-800'];
      ['a', 'b'].forEach(function (f, fi) {
        var off = offsets(f), base = f === 'a' ? (modo === 'fluxo' ? { x: cx, y: cy } : ancora.a) : ancora.b;
        for (var i = 0; i < 6; i++) {
          var p = pecaDe(f, i), o = off[i];
          p.K = 120; p.amort = 0.7;
          p.por({ x: base.x + (i ? off[0][0] : 0), y: base.y + (i ? off[0][1] : 0), a: 0, c: 0, e: 0, k: 1.2, cor: el });
          var atraso = (fi ? 1.1 : 0) + (i ? 0.35 + i * 0.08 : 0) + (modo === 'fluxo' ? 0.2 : 0);
          p.alvo({ x: ancora[f].x + o[0], y: ancora[f].y + o[1], c: comp(f, i), e: E }, atraso);
        }
      });
    };
    function arrastavel(t) { var el = t && t.closest ? t.closest('.palavra') : null; if (!el) return null; return el.closest('[data-familia="a"]') ? 'a' : 'b'; }
    C.baixo = function (p, e) {
      var f = arrastavel(e.target);
      if (!f) { // perto de uma cápsula também vale
        var melhor = null, dm = 1e9;
        ['a', 'b'].forEach(function (ff) { for (var i = 0; i < 6; i++) { var pc = pecaDe(ff, i), d = Math.hypot(pc.x - p.x, pc.y - p.y); if (d < dm && d < pc.c / 2 + 14) { dm = d; melhor = ff; } } });
        f = melhor;
      }
      if (!f) return;
      arrasto = { f: f, dx: ancora[f].x - p.x, dy: ancora[f].y - p.y, x0: p.x, y0: p.y, moveu: false };
      som('toque');
    };
    C.move = function (p) {
      if (!arrasto) return;
      if (Math.hypot(p.x - arrasto.x0, p.y - arrasto.y0) > 4) arrasto.moveu = true;
      ancora[arrasto.f].x = clamp(p.x + arrasto.dx, 40, M.vw - 40); ancora[arrasto.f].y = clamp(p.y + arrasto.dy, M.cabeca + 60, M.vh - 60);
    };
    C.cima = function () { if (arrasto && !arrasto.moveu) auto = 0.0001; arrasto = null; };
    C.tecla = function (e, desce) { if (desce && (e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.palavra')) { e.preventDefault(); auto = 0.0001; } };
    function aproximacao() {
      var d = Math.hypot(ancora.a.x - ancora.b.x, ancora.a.y - ancora.b.y);
      return clamp((d0 * 0.7 - d) / (d0 * 0.45), 0, 1);
    }
    C.quadro = function (dt) {
      tEntrada += dt;
      if (auto > 0 && !arrasto) { // um toque sem arrastar: a família de baixo vem sozinha
        auto += dt;
        var alvoB = { x: lerp(casa.b.x, ancora.a.x, 0.86), y: lerp(casa.b.y, ancora.a.y, 0.86) };
        ancora.b.x += (alvoB.x - ancora.b.x) * Math.min(1, dt * 1.6); ancora.b.y += (alvoB.y - ancora.b.y) * Math.min(1, dt * 1.6);
        if (auto > 3) auto = 0;
      }
      var s = sai(aproximacao()), mx = (ancora.a.x + ancora.b.x) / 2, my = (ancora.a.y + ancora.b.y) / 2;
      if (M.movel) my = clamp(my, M.cabeca + 230, M.vh - 290);
      else my = clamp(my, M.cabeca + 240, M.vh - 230);
      var row = M.movel ? 58 : 68, t = M.agora;
      ['a', 'b'].forEach(function (f) {
        var off = offsets(f);
        for (var i = 0; i < 6; i++) {
          var p = pecaDe(f, i); if (p.atraso > 0) continue;
          var bx = ancora[f].x + off[i][0] + Math.sin(t * 0.6 + i * 1.7 + (f === 'b' ? 2 : 0)) * 5 * (1 - s);
          var by = ancora[f].y + off[i][1] + Math.cos(t * 0.5 + i * 2.3 + (f === 'b' ? 1 : 0)) * 4 * (1 - s);
          var tx, ty;
          if (i === 0) { // as raízes vão para o alto, cada uma para um lado, e nunca se tocam
            tx = mx + (f === 'a' ? -1 : 1) * (M.movel ? M.vw * 0.22 : 170); ty = my - (M.movel ? 3.1 : 3.2) * row;
          } else {
            var j = i - 1, ca = comp('a', i), cb = comp('b', i), ha = (ca - E) / 2, hb = (cb - E) / 2;
            var gap = fundido[j] ? 0 : (1 - s) * 90 + 26;
            tx = f === 'a' ? mx - hb - gap / 2 : mx + ha + gap / 2; ty = my + (j - 2) * row;
          }
          p.alvo({ x: lerp(bx, tx, s), y: lerp(by, ty, s), k: i && !fundido[i - 1] ? 1.2 + s * 16 : 1.2 });
        }
      });
      // a fusão: quando o par chega perto o bastante, fica
      for (var j = 0; j < 5; j++) {
        if (fundido[j] || s < 0.96) continue;
        var pa = pecaDe('a', j + 1), pb = pecaDe('b', j + 1);
        var junta = (pb.x - pb.c / 2) - (pa.x + pa.c / 2);
        if (junta < 30) { fundido[j] = true; sentidos[j].classList.add('visivel'); som('liga', j); }
      }
      if (!M.concluido && fundido.every(Boolean)) M.concluir();
      if (M.concluido) { tFim += dt; if (tFim > 8.5 && !saiu && M.atual === C) { saiu = true; M.ir('iii', 'fluxo'); } }
    };
    C.depois = function () {
      ['a', 'b'].forEach(function (f) {
        fam[f].forEach(function (el, i) {
          var p = pecaDe(f, i), op = p.t.e > 0 ? clamp((p.e / p.t.e - 0.6) / 0.4, 0, 1) : 0;
          rotulo(el, p.x, p.y, 0, op);
        });
      });
      sentidos.forEach(function (el, j) {
        var pa = pecaDe('a', j + 1), pb = pecaDe('b', j + 1), xm = ((pa.x - pa.c / 2) + (pb.x + pb.c / 2)) / 2;
        rotulo(el, xm, pa.y + E / 2 + 13);
      });
    };
    return C;
  };

  /* =====================================================================
   * iii — a roda. Três anéis de nove cápsulas, como a quarta figura da Ars brevis de Llull: o de fora
   * diz quem, o do meio o que faz, o de dentro a quem. Girar (arrastar, tocar numa palavra, a roda do
   * mouse, as setas): a frase do alto se lê embaixo. Parados, os três do alto se ligam (as cápsulas se
   * fundem pelo raio). Quando a frase é "o um é o todo", os anéis viram um só: o ouroboros, hèn tò pân.
   * Depois o anel cresce e traz o dia por dentro (a íris).
   * ===================================================================== */
  camaras.iii = function (M) {
    var C = { mundo: 'noite', seguir: 44, seguirFim: 5, saidaRapida: true };
    var sec = q('#iii'), roda = q('.roda', sec), frase = q('.frase', sec), hen = q('.hen', sec);
    var aneis = qa('.anel', sec).map(function (ol, r) {
      return { el: ol, li: qa('li', ol), palavras: qa('li', ol).map(function (l) { return l.textContent; }), art: qa('li', ol).map(function (l) { return l.getAttribute('data-art'); }), R: 0, ang: 0, vel: 0, larg: [], base: 0 };
    });
    var PASSO = TAU / 9, cx = 0, cy = 0, E = 30, arrasto = null, sel = 0, liga = 0, tParado = 0, estado = 'roda', tEstado = 0, ultimoTopo = [-1, -1, -1];
    var INICIO = [4, 3, 6]; // nenhum anel começa na frase
    function topo(r) { var a = aneis[r]; return ((Math.round(-a.ang / PASSO) % 9) + 9) % 9; }
    function texto() {
      var s = topo(0), v = topo(1), o = topo(2), A = aneis;
      return A[0].art[s] + ' ' + A[0].palavras[s] + ' ' + A[1].palavras[v] + ' ' + A[2].art[o] + ' ' + A[2].palavras[o] + '.';
    }
    function certa() {
      var s = aneis[0].palavras[topo(0)], v = aneis[1].palavras[topo(1)], o = aneis[2].palavras[topo(2)];
      return v === 'é' && ((s === 'um' && o === 'todo') || (s === 'todo' && o === 'um'));
    }
    C.medir = function () {
      var S = M.movel ? Math.min(M.vw - 24, M.vh * 0.5) : Math.min(M.vw - 2 * (M.margem + M.gutter + 28), M.vh - M.cabeca * 2 - 150);
      S = Math.max(S, 300);
      cx = M.vw / 2; cy = M.movel ? M.cabeca + 30 + S / 2 : M.cabeca + (M.vh - M.cabeca - 120) / 2;
      var R0 = S * 0.45; E = clamp(S * 0.048, 22, 32);
      aneis[0].R = R0; aneis[1].R = R0 * 0.755; aneis[2].R = R0 * 0.52;
      aneis.forEach(function (a) { a.larg = a.li.map(function (l) { return larguraTexto(l); }); });
      frase.style.top = (cy + R0 + E / 2 + (M.movel ? 26 : 34)) + 'px';
      hen.style.top = (cy - 54) + 'px';
      var f = q('.falas', sec); if (f) { f.style.top = (cy + 28) + 'px'; f.style.transform = 'none'; }
    };
    function comp(r, j) { var a = aneis[r]; return Math.min(a.larg[j] + E + 10, a.R * PASSO * 0.9); }
    function posicionar(imediato, atrasoBase) {
      aneis.forEach(function (a, r) {
        for (var j = 0; j < 9; j++) {
          var p = M.pecas[r * 9 + j], th = a.ang + j * PASSO - VERTICAL;
          var noTopo = j === topo(r) && liga > 0.01, nud = noTopo ? (r === 0 ? -1 : r === 2 ? 1 : 0) * liga * E * 0.22 : 0;
          var o = { x: cx + Math.cos(th) * (a.R + nud), y: cy + Math.sin(th) * (a.R + nud), a: th + VERTICAL, c: comp(r, j), e: E, k: noTopo ? 1.2 + liga * (aneis[0].R - aneis[1].R) * 1.05 : 1.2, cor: M.corPrimaria === M.COR['areia-100'] ? M.COR['areia-800'] : M.COR['areia-800'] };
          if (imediato) p.por(o); else p.alvo(o, atrasoBase != null ? atrasoBase + (r * 9 + j) * 0.018 : null);
        }
      });
      var dot = M.pecas[27];
      var od = { x: cx, y: cy - aneis[0].R - E / 2 - 16, a: 0, c: 7, e: 7, k: 1, cor: M.COR.destaque };
      if (imediato) dot.por(od); else dot.alvo(od, atrasoBase != null ? atrasoBase + 0.6 : null);
    }
    C.entrar = function (de, modo) {
      estado = 'roda'; tEstado = 0; liga = 0; tParado = 0; arrasto = null; sel = 0;
      roda.classList.remove('fundindo'); hen.classList.remove('visivel'); frase.classList.add('girando');
      aneis.forEach(function (a, r) { a.ang = -INICIO[r] * PASSO; a.vel = 0; });
      C.medir();
      if (de !== 'ii' || modo !== 'fluxo') M.limparPecas();
      M.pecas.forEach(function (p, i) { p.K = 140; p.amort = 0.72; p.inteiro = false; if (i < 28 && p.e < 0.4) p.por({ x: cx, y: cy, e: 0, c: 0 }); });
      for (var i = 29; i < M.pecas.length; i++) M.pecas[i].alvo({ e: 0 });
      M.pecas[28].por({ x: cx, y: cy, anel: aneis[1].R, e: 0, c: 0, k: 1, cor: M.corPrimaria });
      posicionar(false, 0.1);
      ultimoTopo = [topo(0), topo(1), topo(2)];
    };
    function anelEm(x, y) {
      var d = Math.hypot(x - cx, y - cy), melhor = -1, dm = 1e9;
      aneis.forEach(function (a, r) { var dd = Math.abs(d - a.R); if (dd < dm) { dm = dd; melhor = r; } });
      return dm < E * 0.9 + 14 ? melhor : -1;
    }
    C.baixo = function (p) {
      if (estado === 'ouro') { tEstado = Math.max(tEstado, 4.6); return; }
      if (estado !== 'roda') return;
      var r = anelEm(p.x, p.y); if (r < 0) return;
      sel = r; arrasto = { r: r, ang: Math.atan2(p.y - cy, p.x - cx), t: M.agora, total: 0, x: p.x, y: p.y };
      aneis[r].vel = 0; som('toque');
    };
    C.move = function (p) {
      if (!arrasto) return;
      var a = Math.atan2(p.y - cy, p.x - cx), d = a - arrasto.ang;
      while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
      var A = aneis[arrasto.r], agora = M.agora, dtm = Math.max(0.008, agora - arrasto.t);
      A.ang += d; A.vel = A.vel * 0.5 + (d / dtm) * 0.5; arrasto.ang = a; arrasto.t = agora; arrasto.total += Math.abs(d);
    };
    C.cima = function (p) {
      if (!arrasto) return;
      var A = aneis[arrasto.r];
      if (arrasto.total < 0.04) { // um toque numa palavra: o anel a traz para o alto
        A.vel = 0;
        var th = Math.atan2(arrasto.y - cy, arrasto.x - cx) + VERTICAL, j = ((Math.round((th - A.ang) / PASSO) % 9) + 9) % 9;
        var alvo = -j * PASSO, d = alvo - A.ang; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
        A.alvo = A.ang + d;
      } else if (M.agora - arrasto.t > 0.08) A.vel = 0;
      arrasto = null;
    };
    C.roda = function (e) {
      if (estado !== 'roda') return;
      var r = anelEm(M.p.x, M.p.y); if (r < 0) r = sel;
      var A = aneis[r]; A.vel = 0;
      A.alvo = Math.round(((A.alvo != null ? A.alvo : A.ang)) / PASSO) * PASSO + (e.deltaY > 0 ? PASSO : -PASSO);
    };
    C.tecla = function (e, desce) {
      if (!desce || estado !== 'roda') { if (desce && estado === 'ouro' && (e.key === 'Enter' || e.key === ' ')) tEstado = Math.max(tEstado, 4.6); return; }
      if (e.key === 'ArrowUp') { sel = (sel + 2) % 3; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { sel = (sel + 1) % 3; e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        var A = aneis[sel]; A.vel = 0; A.alvo = Math.round(((A.alvo != null ? A.alvo : A.ang)) / PASSO) * PASSO + (e.key === 'ArrowRight' ? PASSO : -PASSO); e.preventDefault();
      }
    };
    C.quadro = function (dt) {
      tEstado += dt;
      if (estado === 'roda') {
        var todosParados = true;
        aneis.forEach(function (A, r) {
          if (arrasto && arrasto.r === r) { A.alvo = null; todosParados = false; return; }
          if (A.alvo != null) { // indo a uma posição pedida
            A.ang += (A.alvo - A.ang) * Math.min(1, dt * 9);
            if (Math.abs(A.alvo - A.ang) < 0.002) { A.ang = A.alvo; A.alvo = null; }
            todosParados = false;
          } else if (Math.abs(A.vel) > 1.1) { A.ang += A.vel * dt; A.vel *= Math.exp(-dt * 2.6); todosParados = false; }
          else { // assenta na casa mais perto
            var alvo = Math.round(A.ang / PASSO) * PASSO; A.vel = 0;
            A.ang += (alvo - A.ang) * Math.min(1, dt * 10);
            if (Math.abs(alvo - A.ang) > 0.004) todosParados = false; else A.ang = alvo;
          }
          var t = topo(r); if (t !== ultimoTopo[r]) { ultimoTopo[r] = t; som('tique', r); }
        });
        tParado = todosParados ? tParado + dt : 0;
        liga += ((tParado > 0.25 ? 1 : 0) - liga) * Math.min(1, dt * (tParado > 0.25 ? 3 : 10));
        if (tParado > 0.3) { if (frase.classList.contains('girando')) { frase.textContent = texto(); frase.classList.remove('girando'); } }
        else frase.classList.add('girando');
        posicionar(false);
        if (tParado > 0.9 && certa()) { estado = 'funde'; tEstado = 0; M.concluir(); som('achado'); }
      } else if (estado === 'funde') {
        // os três anéis viram um só: o ouroboros
        if (tEstado > 0.9 && !roda.classList.contains('fundindo')) { roda.classList.add('fundindo'); frase.classList.add('girando'); }
        if (tEstado > 1.1 && !C.fundiu) {
          C.fundiu = true;
          var R = aneis[1].R, Ef = E * 1.25;
          aneis.forEach(function (A, r) {
            for (var j = 0; j < 9; j++) {
              var p = M.pecas[r * 9 + j], th = A.ang + j * PASSO - VERTICAL + r * PASSO / 3;
              p.K = 70; p.amort = 0.8;
              p.alvo({ x: cx + Math.cos(th) * R, y: cy + Math.sin(th) * R, a: th + VERTICAL, c: R * PASSO / 3 * 1.6 + Ef, e: Ef * 0.96, k: 1.2 }, (r * 9 + j) * 0.012);
            }
          });
          M.pecas[27].alvo({ e: 0, c: 0 });
          var anel = M.pecas[28]; anel.K = 60; anel.amort = 0.9; anel.alvo({ anel: R, e: Ef, k: 1, cor: M.corPrimaria }, 0.5);
          M.pecas.slice(0, 27).forEach(function (p) { p.alvo({ cor: M.corPrimaria }); });
        }
        if (tEstado > 3.2) { M.pecas.slice(0, 27).forEach(function (p) { p.alvo({ e: 0, c: 0 }); }); estado = 'ouro'; tEstado = 0; hen.classList.add('visivel'); }
      } else if (estado === 'ouro') {
        var a = M.pecas[28]; a.anel = a.anel + Math.sin(M.agora * 1.1) * 0.02; // respira
        if (tEstado > 7.5) { estado = 'aurora'; tEstado = 0; sec.classList.add('saindo'); som('aurora'); }
      } else if (estado === 'aurora') {
        // a íris: o anel cresce e traz o dia por dentro
        var diag = Math.hypot(Math.max(cx, M.vw - cx), Math.max(cy, M.vh - cy)) + 40, t = suave(tEstado / 2.2);
        var R0 = aneis[1].R, Rt = lerp(R0, diag + E * 2, t), Ef2 = lerp(E * 1.25, E * 2.4, t), anel2 = M.pecas[28];
        anel2.direto = 1; anel2.alvo({ anel: Rt, e: Ef2 });
        M.iris(cx, cy, Rt - Ef2 / 2 + 0.5);
        if (tEstado > 2.3) {
          estado = 'dia'; anel2.por({ e: 0, anel: 0 }); anel2.direto = 0;
          M.mundoAgora('dia');
          M.ir('iv', 'fluxo');
        }
      }
    };
    C.depois = function () {
      aneis.forEach(function (A, r) {
        A.li.forEach(function (el, j) { var p = M.pecas[r * 9 + j]; rotulo(el, p.x, p.y, p.a, null); });
      });
    };
    C.sair = function () { C.fundiu = false; };
    C.cursorEsc = function (esc) { return estado === 'roda' && anelEm(M.p.x, M.p.y) >= 0 ? 2.2 : esc; };
    return C;
  };

  /* =====================================================================
   * iv — os brancos. O dia. As palavras de Mallarmé, espalhadas pela página dupla, fogem do cursor.
   * Só quando a pessoa para é que elas se juntam: "nada / terá tido lugar / senão o lugar". Parada
   * mais um pouco, a frase vira outra, pelo único termo comum: "tudo, num lugar só."
   * ===================================================================== */
  camaras.iv = function (M) {
    var C = { mundo: 'dia', seguir: 34, seguirFim: 4 };
    var sec = q('#iv'), caixa = q('.brancos', sec), dobra = null;
    var pal = qa('.b', sec).map(function (el) { return { el: el, k: el.getAttribute('data-k'), f: el.getAttribute('data-f'), x: 0, y: 0, vx: 0, vy: 0, r: 0, op: 0, w: 0, h: 0, tam: 0, esp: null, alvo: [null, null] }; });
    var fase = 1, tJunto = 0, tFim = 0, saiu = false, al = aleatorio(3);
    var TAM = { nada: 1, tido: 0.42, senao: 0.3, o: 1, lugar: 1, tudo: 1, num: 0.42, so: 1 };
    C.medir = function () {
      var base = M.movel ? Math.min(52, M.vw * 0.13) : clamp(M.vw * 0.052, 56, 84);
      pal.forEach(function (w) {
        w.tam = base * TAM[w.k];
        w.el.style.fontSize = w.tam.toFixed(1) + 'px'; w.el.style.lineHeight = '1';
        w.el.style.fontWeight = TAM[w.k] < 0.5 ? '300' : '200';
        w.el.style.fontStyle = w.k === 'senao' ? 'italic' : 'normal';
        w.w = larguraTexto(w.el); w.h = w.tam;
      });
      if (!dobra) { dobra = document.createElement('div'); dobra.className = 'dobra'; caixa.appendChild(dobra); }
      var g = function (k) { return pal.filter(function (w) { return w.k === k; })[0]; };
      var L = {}, V = M.vw, H = M.vh;
      if (M.movel) {
        dobra.style.cssText = 'left:16px;right:16px;top:' + (H * 0.5).toFixed(0) + 'px;height:1px;width:auto';
        L.nada = [V * 0.08 + g('nada').w / 2, H * 0.24];
        L.tido = [V * 0.5, H * 0.43];
        L.senao = [V * 0.74, H * 0.56];
        L.o = [V * 0.92 - g('lugar').w - 14 - g('o').w / 2, H * 0.68];
        L.lugar = [V * 0.92 - g('lugar').w / 2, H * 0.68];
        L.tudo = [V * 0.08 + g('tudo').w / 2, H * 0.3];
        L.num = [V * 0.46, H * 0.56];
        L.so = [Math.min(V - 20 - g('so').w / 2, L.lugar[0] + g('lugar').w / 2 + 12 + g('so').w / 2), H * 0.68 + g('lugar').h * 0.95];
      } else {
        dobra.style.cssText = 'left:' + (V / 2).toFixed(0) + 'px;top:' + (M.cabeca + 48) + 'px;bottom:56px;width:1px';
        var l0 = M.margem + M.gutter * 2 + 24, r0 = V - M.margem - M.gutter * 2 - 24;
        L.nada = [l0 + g('nada').w / 2 + 10, H * 0.32];
        L.tido = [V / 2 + 30, H * 0.47];
        L.senao = [V / 2 + (r0 - V / 2) * 0.42, H * 0.57];
        L.lugar = [r0 - g('lugar').w / 2, H * 0.71];
        L.o = [L.lugar[0] - g('lugar').w / 2 - 22 - g('o').w / 2, H * 0.71];
        L.tudo = [l0 + g('tudo').w / 2 + 10, H * 0.4];
        L.num = [V / 2 + (r0 - V / 2) * 0.18, H * 0.58];
        L.so = [L.lugar[0], H * 0.71 + g('lugar').h * 0.98];
      }
      pal.forEach(function (w) {
        var p = L[w.k];
        w.alvo[0] = w.f.indexOf('1') >= 0 ? { x: p[0], y: p[1] } : null;
        w.alvo[1] = w.f.indexOf('2') >= 0 ? { x: p[0], y: p[1] } : null;
        if (!w.esp) espalhar(w);
      });
    };
    function espalhar(w) {
      var l0 = M.movel ? 20 : M.margem + M.gutter * 2, r0 = M.movel ? M.vw - 20 : M.vw - M.margem - M.gutter * 2;
      w.esp = { x: lerp(l0 + w.w / 2, r0 - w.w / 2, al()), y: lerp(M.cabeca + 60 + w.h, M.vh - 90 - w.h, al()), r: (al() - 0.5) * 0.22, f: al() * TAU };
    }
    C.entrar = function () {
      fase = 1; tJunto = 0; tFim = 0; saiu = false;
      M.limparPecas();
      pal.forEach(function (w) { w.esp = null; });
      C.medir();
      pal.forEach(function (w) { w.x = w.esp.x; w.y = w.esp.y; w.vx = w.vy = 0; w.r = w.esp.r; w.op = 0; });
    };
    C.quadro = function (dt) {
      var parado = M.parado || !M.p.ativo, t = M.agora, todos = true;
      pal.forEach(function (w) {
        var alvoF = w.alvo[fase - 1], ativo = !!alvoF;
        var opAlvo = ativo ? 1 : 0;
        w.op += (opAlvo - w.op) * Math.min(1, dt * (opAlvo ? 1.6 : 2.6));
        var tx, ty, tr;
        if (parado && ativo) { tx = alvoF.x; ty = alvoF.y; tr = 0; }
        else {
          var e = w.esp; tx = e.x + Math.sin(t * 0.21 + e.f) * 26; ty = e.y + Math.cos(t * 0.17 + e.f * 1.3) * 18; tr = e.r;
          if (!ativo && alvoF === null && w.alvo[fase === 1 ? 1 : 0]) { /* a que ainda não entrou espera no lugar dela */ var o = w.alvo[fase === 1 ? 1 : 0]; if (fase === 1) { tx = o.x; ty = o.y; tr = 0; } }
        }
        // foge do cursor
        if (M.p.ativo) {
          var dx = w.x - M.p.x, dy = w.y - M.p.y, d = Math.hypot(dx, dy), R = 170 + w.w * 0.3;
          if (d < R && !parado) { var f = (1 - d / R); tx += dx / (d || 1) * f * 160; ty += dy / (d || 1) * f * 160; }
        }
        var K = parado ? 9 : 5, Cc = 2 * Math.sqrt(K) * 0.92;
        w.vx += (K * (tx - w.x) - Cc * w.vx) * dt; w.vy += (K * (ty - w.y) - Cc * w.vy) * dt;
        w.x += w.vx * dt; w.y += w.vy * dt; w.r += (tr - w.r) * Math.min(1, dt * 3);
        if (ativo && (Math.abs(w.x - alvoF.x) > 3 || Math.abs(w.y - alvoF.y) > 3 || w.op < 0.95)) todos = false;
      });
      if (parado && todos) tJunto += dt; else tJunto = 0;
      if (fase === 1 && tJunto > 2.6) { fase = 2; tJunto = 0; som('virada'); }
      else if (fase === 2 && tJunto > 2.4 && !M.concluido) { M.concluir(); som('achado'); }
      if (M.concluido) { tFim += dt; if (tFim > 7 && !saiu && M.atual === C) { saiu = true; M.ir('v', 'fluxo'); } }
      pal.forEach(function (w) {
        w.el.style.opacity = w.op.toFixed(3);
        w.el.style.transform = 'translate3d(' + w.x.toFixed(2) + 'px,' + w.y.toFixed(2) + 'px,0) translate(-50%,-50%) rotate(' + (w.r * 57.2958).toFixed(2) + 'deg)';
      });
    };
    return C;
  };

  /* =====================================================================
   * v — a obra. Três substâncias: o sal (o corpo, a areia: cristais parados), o mercúrio (o espírito,
   * a força lunar: gotas inquietas) e o enxofre (a alma, a força solar e áurea: chamas). Segurar junta
   * as três onde se segura; elas resistem (tremem) e só se ligam se a pessoa insiste; soltar antes as
   * separa de novo (solve). Ligadas por um tempo, viram uma coisa só: a pílula (coagula).
   * As cores dos orbs entram aqui como metais; na liga, a mistura é luz, e a pedra é areia.
   * ===================================================================== */
  camaras.v = function (M) {
    var C = { mundo: 'dia', seguir: 38, seguirFim: 4 };
    var sec = q('#v'), alvoBotao = q('.alvo-obra', sec), rot = { sal: q('[data-s="sal"]', sec), mercurio: q('[data-s="mercurio"]', sec), enxofre: q('[data-s="enxofre"]', sec) };
    var F = 0, segura = false, ponto = null, tCheio = 0, estado = 'obra', tEstado = 0, z = 1, cx = 0, cy = 0, Rt = 200, casas = {}, tFim = 0, saiu = false, teclaSegura = false;
    var GR = { sal: [0, 7], mercurio: [7, 13], enxofre: [13, 18] };
    var tremor = []; for (var i = 0; i < 18; i++) tremor.push({ x: 0, y: 0 });
    C.medir = function () {
      z = clamp(Math.min(M.vw, M.vh) / 820, 0.62, 1.15);
      cx = M.vw / 2; cy = M.movel ? M.vh * 0.5 : M.vh * 0.5;
      Rt = M.movel ? Math.min(M.vw * 0.31, 150) : Math.min(M.vw, M.vh) * 0.25;
      casas.sal = { x: cx, y: cy + Rt * 0.92 };
      casas.mercurio = { x: cx + Math.cos(Math.PI * 7 / 6) * Rt * 1.1, y: cy + Math.sin(Math.PI * 7 / 6) * Rt * 0.92 };
      casas.enxofre = { x: cx + Math.cos(-Math.PI / 6) * Rt * 1.1, y: cy + Math.sin(-Math.PI / 6) * Rt * 0.92 };
      alvoBotao.style.left = (cx - Rt * 1.3) + 'px'; alvoBotao.style.top = (cy - Rt * 1.2) + 'px'; alvoBotao.style.width = (Rt * 2.6) + 'px'; alvoBotao.style.height = (Rt * 2.4) + 'px';
    };
    function cor(nome) { return nome === 'sal' ? M.COR['areia-650'] : nome === 'mercurio' ? M.COR['orb-bpo-conciliacao'] : M.COR['orb-fiscal']; }
    /* a forma de cada substância em volta do centro (ox, oy), com a compressão `cmp` (1 solta, menor junta) */
    function forma(nome, ox, oy, cmp, t) {
      var lista = [];
      if (nome === 'sal') { // cristais: um hexágono de pequenas cápsulas de pé
        lista.push({ x: ox, y: oy, a: VERTICAL, c: 34 * z, e: 21 * z });
        for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 + Math.PI / 6; lista.push({ x: ox + Math.cos(a) * 27 * z * cmp, y: oy + Math.sin(a) * 27 * z * cmp, a: VERTICAL, c: 30 * z, e: 19 * z }); }
      } else if (nome === 'mercurio') { // gotas que não param
        var D = [34, 26, 22, 18, 29, 14];
        for (var j = 0; j < 6; j++) {
          var an = j * TAU / 6 + t * (0.45 + j * 0.13) * (j % 2 ? -1 : 1), rr = (22 + (j % 3) * 9) * z * cmp + Math.sin(t * 1.3 + j) * 4 * z;
          lista.push({ x: ox + Math.cos(an) * rr, y: oy + Math.sin(an) * rr * 0.86, a: 0, c: D[j] * z, e: D[j] * z });
        }
      } else { // chamas: cápsulas de pé, de alturas diferentes, que balançam
        var Hs = [42, 68, 92, 64, 40], base = oy + 40 * z;
        for (var k = 0; k < 5; k++) {
          var h = Hs[k] * z * (1 + Math.sin(t * 2.1 + k * 1.3) * 0.06) * (0.55 + 0.45 * cmp);
          lista.push({ x: ox + (k - 2) * 15 * z * cmp + Math.sin(t * 1.7 + k) * 2.4 * z, y: base - h / 2, a: VERTICAL + Math.sin(t * 1.4 + k * 0.8) * 0.05, c: h, e: 20 * z });
        }
      }
      return lista;
    }
    C.entrar = function () {
      F = 0; segura = false; ponto = null; tCheio = 0; estado = 'obra'; tEstado = 0; tFim = 0; saiu = false;
      Object.keys(rot).forEach(function (k) { rot[k].classList.remove('some'); });
      M.limparPecas(); C.medir();
      ['sal', 'mercurio', 'enxofre'].forEach(function (n, gi) {
        var c = casas[n], fo = forma(n, c.x, c.y, 1, M.agora), de = n === 'sal' ? { x: cx, y: M.vh + 40 } : n === 'mercurio' ? { x: -40, y: c.y } : { x: M.vw + 40, y: c.y };
        for (var i = GR[n][0]; i < GR[n][1]; i++) {
          var p = M.pecas[i], f = fo[i - GR[n][0]];
          p.K = 90; p.amort = 0.7;
          p.por({ x: lerp(de.x, f.x, 0.4), y: lerp(de.y, f.y, 0.4), a: f.a, c: 0, e: 0, k: 3, cor: cor(n) });
          p.alvo({ x: f.x, y: f.y, a: f.a, c: f.c, e: f.e }, 0.3 + gi * 0.35 + (i - GR[n][0]) * 0.05);
        }
      });
    };
    function segurar(sim, x, y) {
      if (estado !== 'obra') return;
      segura = sim;
      if (sim) { ponto = { x: x, y: y }; F = Math.max(F, 0.1); som('obra', true); }
      else som('obra', false);
    }
    C.baixo = function (p) { segurar(true, p.x, p.y); };
    C.move = function (p) { if (segura && ponto) { ponto.x = p.x; ponto.y = p.y; } };
    C.cima = function () { segurar(false); };
    C.tecla = function (e, desce) {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (desce && !teclaSegura) { teclaSegura = true; segurar(true, cx, cy); }
      else if (!desce) { teclaSegura = false; segurar(false); }
    };
    C.quadro = function (dt) {
      tEstado += dt;
      var t = M.agora;
      if (estado === 'obra') {
        if (segura) F = Math.min(1, F + dt / 2.7); else F = Math.max(0, F - dt * 1.1);
        var e = suave(F), alvoP = ponto || { x: cx, y: cy };
        alvoP = { x: clamp(alvoP.x, 80, M.vw - 80), y: clamp(alvoP.y, M.cabeca + 80, M.vh - 90) };
        if (!segura && F <= 0) ponto = null;
        var cmp = 1 - 0.62 * e, tr = Math.sin(Math.PI * clamp(F, 0, 1)) * (F < 1 ? 1 : 0) * 5 * z;
        ['sal', 'mercurio', 'enxofre'].forEach(function (n) {
          var c = casas[n], ox = lerp(c.x, alvoP.x, Math.pow(e, 1.1)), oy = lerp(c.y, alvoP.y, Math.pow(e, 1.1));
          var fo = forma(n, ox, oy, cmp, t), corN = cor(n);
          for (var i = GR[n][0]; i < GR[n][1]; i++) {
            var p = M.pecas[i], f = fo[i - GR[n][0]], tm = tremor[i];
            tm.x += ((Math.random() - 0.5) * 2 * tr - tm.x) * Math.min(1, dt * 18); tm.y += ((Math.random() - 0.5) * 2 * tr - tm.y) * Math.min(1, dt * 18);
            if (p.atraso > 0) continue;
            var mist = F > 0.82 ? (F - 0.82) / 0.18 : 0;
            p.alvo({ x: f.x + tm.x, y: f.y + tm.y, a: f.a, c: f.c, e: f.e, k: 3 + e * 26 * z, cor: mix(corN, M.COR['areia-500'], mist * 0.5) });
          }
        });
        som('obraNivel', F);
        if (F >= 0.999) tCheio += dt; else tCheio = 0;
        if (tCheio > 1.1) { // coagula: as três viram uma, e a uma é a pílula
          estado = 'coagula'; tEstado = 0; segura = false; M.concluir(); som('coagula');
          Object.keys(rot).forEach(function (k) { rot[k].classList.add('some'); });
          var P = pilula(M), px = alvoP.x, py = alvoP.y;
          C.pedra = { x: px, y: py };
          for (var j = 0; j < 18; j++) {
            var pc = M.pecas[j]; pc.K = 120; pc.amort = 0.66;
            if (j === 0) pc.alvo({ x: px, y: py, a: VERTICAL, c: P.Hp, e: P.T, k: 1, cor: M.corPrimaria }, 0.15);
            else pc.alvo({ x: px, y: py + (j % 2 ? -1 : 1) * P.Hp * 0.18, a: VERTICAL, c: P.T * 0.8, e: P.T * 0.6, k: 10, cor: M.corPrimaria }, j * 0.02);
          }
        }
      } else if (estado === 'coagula') {
        if (tEstado > 0.9) for (var j2 = 1; j2 < 18; j2++) M.pecas[j2].alvo({ e: 0, c: 0, k: 1 });
        if (tEstado > 1.6) { M.pecas[0].alvo({ x: cx, y: M.vh * (M.movel ? 0.42 : 0.47) }); }
        if (M.concluido) { tFim += dt; if (tFim > 10 && !saiu && M.atual === C) { saiu = true; M.ir('vi', 'fluxo'); } }
      }
    };
    C.depois = function () {
      ['sal', 'mercurio', 'enxofre'].forEach(function (n) {
        var a = GR[n][0], b = GR[n][1], x = 0, y = 0, ymax = -1e9;
        for (var i = a; i < b; i++) { x += M.pecas[i].x; y += M.pecas[i].y; ymax = Math.max(ymax, M.pecas[i].y + M.pecas[i].c / 2); }
        x /= (b - a); y /= (b - a);
        rotulo(rot[n], x, ymax + 22 * z, 0, null);
      });
    };
    C.cursorEsc = function (esc) { return estado === 'obra' && segura ? 0.6 + (1 - F) * 0.4 : esc; };
    return C;
  };

  /* =====================================================================
   * vi — o inteiro. A pílula sozinha, no lugar exato do I da logo. Um toque e ela vira o selo: o
   * <heild-logo> de verdade aparece por cima, no mesmo pixel (as duas opacas, iguais), e HE e LD se
   * abrem a partir do I. Depois, o colofão: a última estrofe do Hávamál e ves heill.
   * ===================================================================== */
  camaras.vi = function (M) {
    var C = { mundo: 'dia', seguir: 24, seguirFim: 9 };
    var sec = q('#vi'), selo = q('.selo', sec), logo = q('.logo-selo', sec), alvoBotao = q('.alvo-selo', sec), hegel = q('.fala-hegel', sec);
    var G = null, estado = 'pilula', tEstado = 0, resp = 1, clip = 0, tFim = 0;
    function geometria() {
      var r = logo.getBoundingClientRect(), s = r.width / LOGO.W;
      return { x: r.left + LOGO.CX * s, y: r.top + LOGO.CY * s, T: LOGO.PW * s, H: LOGO.PH * s, r: r, s: s };
    }
    C.medir = function () {
      G = geometria();
      sec.style.setProperty('--selo-meia', (G.r.height / 2).toFixed(1) + 'px');
      alvoBotao.style.left = (G.x - G.T) + 'px'; alvoBotao.style.top = (G.y - G.H / 2) + 'px'; alvoBotao.style.width = (G.T * 2) + 'px'; alvoBotao.style.height = G.H + 'px';
      if (estado === 'selo') aplicarClip(1);
    };
    C.entrar = function (de, modo) {
      estado = 'pilula'; tEstado = 0; resp = 1; clip = 0; tFim = 0;
      selo.classList.remove('visivel'); selo.style.clipPath = ''; hegel.classList.remove('saindo');
      C.medir();
      var p = M.pecas[0];
      if (de !== 'v' || modo !== 'fluxo') { M.limparPecas(); p.por({ x: G.x, y: G.y, a: VERTICAL, c: 0, e: 0, k: 1, cor: M.corPrimaria }); }
      for (var i = 1; i < M.pecas.length; i++) M.pecas[i].alvo({ e: 0, c: 0 });
      p.K = 90; p.amort = 0.8; p.direto = 0;
      p.alvo({ x: G.x, y: G.y, a: VERTICAL, c: G.H, e: G.T, k: 1, cor: M.corPrimaria });
    };
    function aplicarClip(f) {
      // o recorte começa no I e se abre até a logo inteira (com folga para a animação centralizar)
      var w = G.r.width, h = G.r.height, ix0 = (LOGO.CX - LOGO.PW / 2) * G.s, ix1 = (LOGO.CX + LOGO.PW / 2) * G.s, iy0 = (LOGO.CY - LOGO.PH / 2) * G.s, iy1 = (LOGO.CY + LOGO.PH / 2) * G.s;
      var e = sai(f), m = -0.12 * w * e;
      var top = lerp(iy0, -0.1 * h, e), bottom = lerp(h - iy1, -0.1 * h, e), left = lerp(ix0, m, e), right = lerp(w - ix1, m, e);
      selo.style.clipPath = 'inset(' + top.toFixed(2) + 'px ' + right.toFixed(2) + 'px ' + bottom.toFixed(2) + 'px ' + left.toFixed(2) + 'px round ' + (e < 0.5 ? (G.T / 2).toFixed(1) + 'px' : '0px') + ')';
    }
    function selar() {
      if (estado !== 'pilula') return;
      estado = 'assenta'; tEstado = 0; som('selo');
    }
    C.baixo = function (p) { if (estado === 'pilula' && Math.abs(p.x - G.x) < G.T * 1.2 && Math.abs(p.y - G.y) < G.H * 0.6) selar(); };
    alvoBotao.addEventListener('click', function (e) { if (e.detail === 0) selar(); });
    C.tecla = function (e, desce) { if (desce && (e.key === 'Enter' || e.key === ' ') && document.activeElement === alvoBotao) { e.preventDefault(); selar(); } };
    logo.addEventListener('click', function () { if (estado === 'selo' && logo.play) logo.play('centralizar'); });
    C.quadro = function (dt) {
      tEstado += dt;
      var p = M.pecas[0];
      if (estado === 'pilula') {
        if (tEstado > 1.4) p.direto = Math.min(1, p.direto + dt * 2); // termina no pixel exato
        var b = Math.sin(M.agora * 1.15) * resp;
        p.alvo({ x: G.x, y: G.y, c: G.H * (1 + 0.006 * b), e: G.T * (1 + 0.012 * b) });
      } else if (estado === 'assenta') {
        resp = 0; p.direto = 1; p.alvo({ x: G.x, y: G.y, c: G.H, e: G.T, a: VERTICAL });
        if (tEstado > 0.12) { // a troca: a logo aparece recortada no I, e a pílula do campo some no mesmo quadro
          aplicarClip(0); selo.classList.add('visivel'); p.por({ e: 0, c: 0 }); p.direto = 0;
          estado = 'abre'; tEstado = 0; hegel.classList.add('saindo');
        }
      } else if (estado === 'abre') {
        clip = Math.min(1, tEstado / 1.1); aplicarClip(clip);
        if (clip >= 1) { estado = 'selo'; M.concluir(); }
      } else if (estado === 'selo') {
        tFim += dt;
      }
    };
    C.cursorEsc = function (esc) { return estado === 'pilula' && G && Math.abs(M.p.x - G.x) < G.T * 1.2 && Math.abs(M.p.y - G.y) < G.H * 0.6 ? 2.6 : esc; };
    return C;
  };

  I.camaras = camaras;
  I.LOGO = LOGO;
})();
