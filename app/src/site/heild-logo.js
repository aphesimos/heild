/* @ds-bundle: {"format":4,"namespace":"Heild","components":[{"name":"HeildLogo"}]} */
/*
 * Heild — <heild-logo>: o wordmark HEILD com o I animado.
 * Web Component sem dependências. Carregue este arquivo uma vez e use <heild-logo> em qualquer HTML.
 * React: window.Heild.HeildLogo. Respeita prefers-reduced-motion (fica estático).
 * morph(nome): leva o I, de onde ele estiver desenhado, até outra forma (ou de volta à pílula) por
 * molas por cápsula; pode ser chamado a qualquer momento, quantas vezes for, sem corte.
 * follow(nome, ligado): atalho de morph para estados (ex.: hover); desligar só volta se for a forma atual.
 * Formas (window.Heild.animations): centralizar (grade 3x3), contabil (barras), juridico (=), bpo (check),
 * ia (asterisco que gira), atendimento (3 pontos que pulam), orb (o I vira a esfera), financeiro ($),
 * tempo (ampulheta que vira), arquivos (pasta), conversa (balão de fala), celular (aparelho com botão),
 * painel (grade bento), lupa (lente com cabo, varre), equipe (três pessoas que acenam) e orbs (o I vira o orb,
 * que se divide como uma célula em três orbs com olhos e vida própria; na volta elas se fundem de novo).
 * No morph, orb e orbs abrem os olhos ao chegar e os mantêm em loop enquanto forem o alvo; ao sair, os olhos
 * fecham antes de recolher e as filhas voltam a se fundir.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  /* ---------- geometria do wordmark (idle.svg, viewBox 0 0 1259 387) ---------- */
  var HE = 'M54.5 163.805H231V14.3047H483.5V61.3047H285.5V163.305H459.5V210.805H285.5V324.805H489V371.805H231V210.805H54.5V371.805H0V14.3047H54.5V163.805Z';
  var LD = 'M834.187 324.805H963.888V14.3047H1099.39C1132.39 14.3047 1160.89 21.3047 1184.89 35.3047C1208.89 48.9714 1227.22 69.3047 1239.89 96.3047C1252.55 122.971 1258.89 155.305 1258.89 193.305C1258.89 231.305 1252.55 263.638 1239.89 290.305C1227.55 316.971 1209.55 337.305 1185.89 351.305C1162.22 364.971 1133.89 371.805 1100.89 371.805H779.687V14.3047H834.187V324.805ZM1018.39 324.805H1097.39C1123.72 324.805 1144.55 318.971 1159.89 307.305C1175.55 295.305 1186.39 279.638 1192.39 260.305C1198.72 240.971 1201.89 218.638 1201.89 193.305C1201.89 153.971 1194.05 122.138 1178.39 97.8047C1162.72 73.4714 1135.72 61.3047 1097.39 61.3047H1018.39V324.805Z';
  var CX = 634.344, CY = 193.055, H = 386.111, PW = 147.297;
  var U = 96, G = 24, STEP = U + G;
  var PILL = { x: CX, y: CY, T: PW, L: H, r: 0 };

  /* ---------- tempos do sistema de movimento (ms) ---------- */
  var REST_GAP = 1300, OUT = 1000, BACK = 900, ANTICIPATE = 140, STAGGER = 55;

  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var inOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var outBack = function (t, s) { return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var lerpCap = function (a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), T: lerp(a.T, b.T, t), L: lerp(a.L, b.L, t), r: lerp(a.r, b.r, t) }; };
  var cap = function (x, y, T, L, r) { return { x: x, y: y, T: T, L: L, r: r || 0 }; };
  var norm = function (r) { while (r > 90) r -= 180; while (r <= -90) r += 180; return r; };
  function seg(ax, ay, bx, by) {
    var vx = bx - ax, vy = by - ay;
    return cap((ax + bx) / 2, (ay + by) / 2, U, Math.hypot(vx, vy) + U, norm(Math.atan2(-vx, vy) * 180 / Math.PI));
  }
  function grid9() { var a = []; for (var j = -1; j <= 1; j++) for (var i = -1; i <= 1; i++) a.push(cap(CX + i * STEP, CY + j * STEP, U, U)); return a; }
  /* atalhos relativos ao centro do I: s(ax, ay, bx, by) é um traço; R é o maior deslocamento vertical de um traço (encosta em 0 e em H) */
  var R = H / 2 - U / 2;
  function s(ax, ay, bx, by) { return seg(CX + ax, CY + ay, CX + bx, CY + by); }
  function copy(c) { var o = {}; for (var k in c) o[k] = c[k]; return o; }
  /* gira a forma inteira `deg` graus em torno do centro, encolhendo só o desenho (a espessura fica 96)
     para caber na mesma caixa da forma parada: nunca passa da altura das letras nem empurra mais as letras */
  function turn(base, deg) {
    var ends = function (c, a) { var h = (c.L - c.T) / 2, t = (c.r + a) * Math.PI / 180, dx = c.x - CX, dy = c.y - CY, ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
      var mx = dx * ca - dy * sa, my = dx * sa + dy * ca, ex = -Math.sin(t) * h, ey = Math.cos(t) * h; return [mx, my, ex, ey]; };
    var box = function (a) { var bx = 0, by = 0; base.forEach(function (c) { var e = ends(c, a); bx = Math.max(bx, Math.abs(e[0]) + Math.abs(e[2])); by = Math.max(by, Math.abs(e[1]) + Math.abs(e[3])); }); return [bx, by]; };
    var b0 = box(0), b = box(deg), k = Math.min(1, b0[0] / b[0], b0[1] / b[1]);
    return base.map(function (c) { var e = ends(c, deg), o = copy(c); o.x = CX + e[0] * k; o.y = CY + e[1] * k; o.L = (c.L - c.T) * k + c.T; o.r = c.r + deg; return o; });
  }
  var AMP = [s(-120, -R, 120, -R), s(-120, R, 120, R), s(-120, -R, 120, R), s(120, -R, -120, R)];
  /* lupa: lente octogonal (8 traços, quase um anel) e cabo a 45 graus */
  var LUPA = (function () { var a = [], c = -36, ap = 100, rv = ap / Math.cos(Math.PI / 8);
    for (var k = 0; k < 8; k++) { var t0 = (22.5 + 45 * k) * Math.PI / 180, t1 = (67.5 + 45 * k) * Math.PI / 180;
      a.push(s(c + rv * Math.cos(t0), c + rv * Math.sin(t0), c + rv * Math.cos(t1), c + rv * Math.sin(t1))); }
    a.push(s(c + ap * Math.SQRT1_2, c + ap * Math.SQRT1_2, 128, 128)); return a; })();
  /* equipe: três pessoas (cabeça + ombros), a do meio um pouco à frente e acima */
  var EQ = [cap(CX, CY - 110, U, U), cap(CX, CY + 10, U, 190, 90), cap(CX - 200, CY - 10, U, U), cap(CX - 200, CY + 110, U, 170, 90), cap(CX + 200, CY - 10, U, U), cap(CX + 200, CY + 110, U, 170, 90)];

  /* mitose dos orbs. Mãe = o orb (H×H). Fase 1: a mãe estica em amendoim, estrangula e solta A e M2;
     fase 2 (em cascata): M2 faz o mesmo e solta B e C. Em cada fase as duas filhas partem do mesmo círculo:
     a distância cresce devagar até o estrangulamento (com o goo, o pescoço afina) e então estala para fora
     com um leve passar do ponto; o tamanho encolhe junto. u: 0 (mãe inteira) .. 1 (três filhas soltas). */
  var MIT_M = cap(CX, CY, H, H), MIT_A = cap(CX - 190, CY + 25, 230, 230), MIT_M2 = cap(CX + 120, CY, 250, 250),
    MIT_B = cap(CX + 75, CY - 70, 170, 170), MIT_C = cap(CX + 230, CY + 75, 150, 150);
  var ORBS_DIV = 1600, ORBS_FUSE = 1200, ORBS_HOLD = 5400;
  function mitK(t) { return t < .7 ? .76 * inOut(t / .7) : .76 + .24 * outBack((t - .7) / .3, 1.4); }
  function mitMix(P, Q, t) { var k = mitK(t), z = inOut(t); return cap(lerp(P.x, Q.x, k), lerp(P.y, Q.y, k), lerp(P.T, Q.T, z), lerp(P.L, Q.L, z)); }
  function mitose(u) {
    var t1 = clamp(u / .58), t2 = clamp((u - .42) / .58), a = mitMix(MIT_M, MIT_A, t1), m2 = mitMix(MIT_M, MIT_M2, t1);
    return [a, mitMix(m2, MIT_B, t2), mitMix(m2, MIT_C, t2)];
  }
  /* goo da mitose: forte enquanto alguma fase está no meio (é ele que desenha o amendoim e o pescoço) */
  function mitGoo(u) {
    var g = function (t) { return t <= 0 || t >= 1 ? 0 : Math.min(1, t / .08, (1 - t) / .12); };
    return 18 * Math.max(g(clamp(u / .58)), g(clamp((u - .42) / .58)));
  }
  /* no play(): divide, vive, funde de volta (u volta a 0 e a mãe vira o I no BACK) */
  function orbsU(p) { var ms = p * ORBS_HOLD; return ms < ORBS_DIV ? ms / ORBS_DIV : ms > ORBS_HOLD - ORBS_FUSE ? (ORBS_HOLD - ms) / ORBS_FUSE : 1; }

  /* ---------- uma forma por tema: só cápsulas e círculos de 96 ---------- */
  var ANIMS = {
    centralizar: { label: 'Centralizar', caps: grid9(), order: [4, 1, 3, 5, 7, 0, 2, 6, 8], hold: 1900 },
    contabil: { label: 'Contábil', caps: [cap(CX - STEP, H - 87, U, 174), cap(CX, H - 135, U, 270), cap(CX + STEP, CY, U, H)], order: [2, 1, 0] },
    juridico: { label: 'Jurídico', caps: [cap(CX, CY - (U / 2 + G), U, 320, 90), cap(CX, CY + (U / 2 + G), U, 320, 90)], order: [0, 1] },
    bpo: { label: 'BPO', caps: [seg(CX - 120, CY + 10, CX - 30, CY + 100), seg(CX - 30, CY + 100, CX + 130, CY - 110)], order: [1, 0] },
    ia: { label: 'IA agêntica', caps: [cap(CX, CY, U, H, 0), cap(CX, CY, U, H, 60), cap(CX, CY, U, H, -60)], order: [0, 1, 2], hold: 2000,
      holdFx: function (c, i, p) { var o = {}; for (var k in c) o[k] = c[k]; o.r = c.r + 60 * inOut(clamp((p - .15) / .7)); return o; } },
    atendimento: { label: 'Atendimento', caps: [cap(CX - STEP, CY, U, U), cap(CX, CY, U, U), cap(CX + STEP, CY, U, U)], order: [1, 0, 2], hold: 2300,
      holdFx: function (c, i, p, ms) { var o = {}; for (var k in c) o[k] = c[k]; o.y = c.y - 46 * Math.sin(Math.PI * p) * Math.max(0, Math.sin(ms / 640 * Math.PI * 2 - i * .9)); return o; } },
    orb: { label: 'Orb', caps: [cap(CX, CY, H, H)], order: [0], hold: 3700, orb: true, eyes: [{ ci: 0, life: lifeOrb }] },
    tempo: { label: 'Tempo', caps: AMP, order: [2, 3, 0, 1], hold: 2200,
      holdFx: function (c, i, p) { return turn(AMP, 180 * inOut(clamp((p - .2) / .6)))[i]; } },
    arquivos: { label: 'Arquivos', caps: [s(-170, -R, -170, R), s(-170, R, 170, R), s(170, R, 170, -R + 72), s(170, -R + 72, -10, -R + 72), s(-10, -R + 72, -60, -R), s(-60, -R, -170, -R)], order: [0, 1, 5, 2, 4, 3] },
    conversa: { label: 'Conversa', caps: [s(-170, -R, 170, -R), s(170, -R, 170, 30), s(170, 30, -170, 30), s(-170, 30, -170, -R), s(-80, 30, -130, R)], order: [0, 1, 3, 2, 4] },
    financeiro: { label: 'Financeiro', caps: [cap(CX, CY, U, H), s(-170, -95, 170, -95), s(-170, -95, 170, 95), s(-170, 95, 170, 95)], order: [0, 2, 1, 3] },
    celular: { label: 'Celular', caps: [s(-110, -R, -110, R), s(110, -R, 110, R), s(-110, -R, 110, -R), cap(CX, CY + R, U, U)], order: [2, 0, 1, 3] },
    painel: { label: 'Painel', caps: [cap(CX - STEP, CY, U, 2 * STEP + U), cap(CX + STEP / 2, CY - STEP, U, STEP + U, 90), cap(CX, CY + STEP / 2, U, STEP + U), cap(CX + STEP, CY, U, U), cap(CX + STEP, CY + STEP, U, U)], order: [0, 1, 2, 3, 4] },
    lupa: { label: 'Lupa', caps: LUPA, order: [8, 0, 1, 7, 2, 6, 3, 5, 4], hold: 2200,
      holdFx: function (c, i, p, ms) { var o = copy(c), e = Math.sin(Math.PI * p), w = ms / 1500 * Math.PI * 2; o.x = c.x + 10 * Math.sin(w) * e; o.y = c.y + 6 * (1 - Math.cos(w)) * e; return o; } },
    equipe: { label: 'Equipe', caps: EQ, order: [0, 1, 2, 4, 3, 5], hold: 2200,
      holdFx: function (c, i, p, ms) { var o = copy(c), who = [1, 1, 0, 0, 2, 2][i]; o.y = c.y - 14 * Math.sin(Math.PI * p) * Math.max(0, Math.sin(ms / 700 * Math.PI * 2 - who * 1.1)); return o; } },
    /* orbs: o I vira o orb e se divide como uma célula (1 → 2 → 3); cada filha ganha vida própria nos olhos
       (errante, giro de 360°, deriva) e na volta elas se fundem de novo na mãe, que vira o I */
    orbs: { label: 'Orbs', caps: [MIT_M, MIT_M, MIT_M], order: [0, 1, 2], hold: ORBS_HOLD, split: mitose, eyeWin: [ORBS_DIV, ORBS_HOLD - ORBS_FUSE],
      holdFx: function (c, i, p) { return mitose(orbsU(p))[i]; },
      eyes: [{ ci: 0, life: lifeWander }, { ci: 1, life: lifeSpin }, { ci: 2, life: lifeDrift }] }
  };
  var CYCLE_ORDER = ['centralizar', 'orb', 'contabil', 'juridico', 'bpo', 'ia', 'atendimento'];
  Object.keys(ANIMS).forEach(function (k) {
    var a = ANIMS[k], m = 0;
    a.hold = a.hold || 1600;
    a.rank = []; a.order.forEach(function (ci, n) { a.rank[ci] = n; });
    a.eyeCaps = a.split ? a.split(1) : a.caps; // onde os olhos ficam quando a forma está completa
    a.eyeCaps.forEach(function (c) { var ext = Math.abs(Math.sin(c.r * Math.PI / 180)) * (c.L - c.T) / 2 + c.T / 2; m = Math.max(m, Math.abs(c.x - CX) + ext); });
    a.shift = Math.max(0, m - PW / 2);
    a.endHold = a.caps.map(function (c, i) { var e = a.holdFx ? a.holdFx(c, i, 1, a.hold) : c, o = {}; for (var k2 in e) o[k2] = e[k2]; o.r = norm(o.r); return o; });
  });

  /* ---------- morph: transição genérica entre formas ----------
     Em vez de uma animação para cada par de formas, as 9 cápsulas viram molas (x, y, T, L, r) que só
     trocam de alvo. Trocar de alvo nunca salta: posição e velocidade continuam de onde estão.
     A transição segue a linguagem da marca: primeiro todas recolhem rumo à pílula com o leve squash
     da antecipação (o I é a casa), depois se abrem na ordem de stagger da forma nova, e o
     amortecimento abaixo do crítico dá o mesmo "passar do ponto" do outBack. O goo acompanha a
     velocidade, então só aparece na travessia. Cápsulas que sobram não somem: fundem-se na cápsula
     mais próxima da forma nova (e nascem dela na volta); a rotação usa o caminho mais curto (mod 180),
     então nada gira meia volta. Uma rajada de chamadas (mouse chacoalhando) reaproveita a mesma
     janela de recolhimento, então o I pulsa perto do centro e abre na última forma pedida. */
  var MK = 150, MC = 2 * Math.sqrt(MK) * .58, GATHER = 160, SUB = 1 / 240;
  var SQ = { x: CX, y: CY, T: PW * 1.07, L: H * .95, r: 0 };
  function capOf(o) { return { x: o.x, y: o.y, T: o.T, L: o.L, r: o.r }; }

  /* ---------- orb: a mesma matemática do <orb-avatar> (github.com/sundenlast/orb) ---------- */
  var TAU = Math.PI * 2, FACE = 1.6, EX = .125, EY = .15;
  function superE(cx, cy, w, h, n) { var p = []; for (var i = 0; i < 56; i++) { var t = i / 56 * TAU, c = Math.cos(t), s = Math.sin(t);
    p.push([cx + w / 2 * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), cy + h / 2 * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]); } return p; }
  var EYES = [-1, 1].map(function (s) { return { c: [s * EX, EY], pts: superE(s * EX, EY, .125, .25, 2.4) }; });
  function frame(yaw, pitch) {
    var cp = Math.cos(pitch), f = [Math.sin(yaw) * cp, -Math.sin(pitch), Math.cos(yaw) * cp];
    var rl = Math.hypot(f[2], f[0]) || 1, r = [f[2] / rl, 0, -f[0] / rl];
    var u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    return { f: f, r: r, u: u };
  }
  function proj(a, b, Fr) {
    var rho = Math.sqrt(a * a + b * b), f = Fr.f, r = Fr.r, u = Fr.u, x, y, z;
    if (rho < 1e-6) { x = f[0]; y = f[1]; z = f[2]; }
    else { var s = Math.sin(rho) / rho, c = Math.cos(rho), ra = a * s, rb = b * s;
      x = f[0] * c + r[0] * ra + u[0] * rb; y = f[1] * c + r[1] * ra + u[1] * rb; z = f[2] * c + r[2] * ra + u[2] * rb; }
    if (z < 0) { var k = Math.sqrt(x * x + y * y) || 1; x /= k; y /= k; }
    return [x, y, z];
  }
  function radius(x, th) { return 1 + x[0] * Math.cos(2 * th) + x[1] * Math.sin(2 * th) + x[2] * Math.cos(3 * th) + x[3] * Math.sin(3 * th) + x[4] * Math.cos(4 * th) + x[5] * Math.sin(4 * th); }
  var ORB_REST = [.32, .26];
  var ORB_LOOK = [[0, ORB_REST], [650, [-.74, .22]], [1850, [.7, -.3]], [2950, ORB_REST]];
  var ORB_BLINKS = [420, 1500, 2600], ORB_P = 3700; // ORB_P: o ciclo do olhar em loop (começa e termina no repouso)
  /* olhar: mola de yaw/pitch rumo ao ponto da linha do tempo `t`; `sg` espelha o lado */
  function lookStep(st, t, dt, sg) {
    var tg = ORB_LOOK[0][1]; ORB_LOOK.forEach(function (l) { if (t >= l[0]) tg = l[1]; });
    var n = Math.ceil(dt * 120), h = n ? dt / n : 0;
    for (var k = 0; k < n; k++) {
      st.vy += (sg * tg[0] - st.yaw) * 95 * h; st.vy *= Math.exp(-11 * h); st.yaw += st.vy * h;
      st.vp += (tg[1] - st.pitch) * 95 * h; st.vp *= Math.exp(-11 * h); st.pitch += st.vp * h;
    }
  }
  function lookTo(st, tg, dt) {
    var n = Math.ceil(dt * 120), h = n ? dt / n : 0;
    for (var k = 0; k < n; k++) {
      st.vy += (tg[0] - st.yaw) * 95 * h; st.vy *= Math.exp(-11 * h); st.yaw += st.vy * h;
      st.vp += (tg[1] - st.pitch) * 95 * h; st.vp *= Math.exp(-11 * h); st.pitch += st.vp * h;
    }
  }
  function blinkEvery(t, period, offs) { var tm = t % period, sq = 1; offs.forEach(function (b) { var q = (tm - b) / 150; if (q >= 0 && q < 1) sq = 1 - Math.sin(q * Math.PI) * .94; }); return sq; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function init(st, sg) { if (st.yaw === undefined) { var r = lookRest(sg); for (var k in r) st[k] = r[k]; } }
  /* vidas dos olhos: (estado, ms desde que abriram, dt) → { yaw, pitch, sq (abertura), es (tamanho) }.
     Todas são contínuas no tempo, então o loop nunca salta. */
  function lifeOrb(st, t, dt) { init(st, 1); var tc = t % ORB_P; lookStep(st, tc, dt, 1); return { yaw: st.yaw, pitch: st.pitch, sq: blink(tc), es: 1 }; }
  // errante: alvo novo a cada 1,25 s, por mola; os olhos crescem um pouco quando ela "vê" o alvo
  function lifeWander(st, t, dt) {
    init(st, -1); var n = Math.floor(t / 1250);
    lookTo(st, [(hash(n) - .5) * 1.5, (hash(n + 50) - .5) * .7], dt);
    return { yaw: st.yaw, pitch: st.pitch, sq: blinkEvery(t, 3300, [900, 2600, 2780]), es: 1 + (hash(n + 9) > .4 ? .22 : .06) * Math.sin(Math.PI * clamp((t - n * 1250) / 520)) };
  }
  // giro: a cada 4,8 s o olhar dá a volta inteira no corpo (some atrás e volta pelo outro lado)
  function lifeSpin(st, t) {
    var k = inOut(clamp((t % 4800 - 1500) / 1500));
    return { yaw: .3 + TAU * k, pitch: .2 - .14 * Math.sin(Math.PI * k), sq: blinkEvery(t, 4300, [500, 3700]), es: 1 };
  }
  // deriva: olhar lento e contínuo, em dois ritmos que não se repetem juntos, e olhos que respiram
  function lifeDrift(st, t) {
    return { yaw: -.25 + .55 * Math.sin(TAU * t / 6300), pitch: .08 + .26 * Math.sin(TAU * t / 4700 + 1.3), sq: blinkEvery(t, 3900, [2000, 3550]), es: 1 + .12 * Math.sin(TAU * t / 2700) };
  }
  function lookRest(sg) { return { yaw: sg * ORB_REST[0], pitch: ORB_REST[1], vy: 0, vp: 0 }; }
  function blink(t) { var sq = 1; ORB_BLINKS.forEach(function (b) { var q = (t - b) / 150; if (q >= 0 && q < 1) sq = 1 - Math.sin(q * Math.PI) * .94; }); return sq; }
  /* gelatina: integra as 6 harmônicas do contorno (impulso dado por jellyKick) */
  function jellyStep(st, dt) {
    var n = Math.ceil(dt * 120), h = n ? dt / n : 0, w = lerp(26, 15, .6), D = lerp(11, 3.6, .6), i, k, kk;
    for (k = 0; k < n; k++) for (i = 0; i < 6; i++) { kk = i > 1 ? w * 1.35 : w; st.jv[i] += (-kk * kk * st.jx[i] - D * st.jv[i]) * h; st.jx[i] = Math.max(-.3, Math.min(.3, st.jx[i] + st.jv[i] * h)); }
    var e = 0; for (i = 0; i < 6; i++) e += Math.abs(st.jx[i]) + Math.abs(st.jv[i]) * .02;
    return e;
  }
  function jellyKick(st) { st.jx = [0, 0, 0, 0, 0, 0]; st.jv = [2.2 * .6 * 1.4, 0, .5, 0, 0, -.4]; } // impulso de chegada (jelly 0.6)
  /* contorno deformado do orb de centro (cx, cy) e raio R; o fundo continua apoiado na base */
  function jellyBody(cx, cy, R, x) {
    var P = function (u, v) { return (cx + u * R).toFixed(2) + ' ' + (cy + v * R).toFixed(2); };
    var rr = [], maxY = -9, th, d = '', i;
    for (i = 0; i < 72; i++) { th = i / 72 * TAU; var r0 = radius(x, th); rr.push(r0); maxY = Math.max(maxY, Math.sin(th) * r0); }
    var shift = 1 - maxY, flat = Math.max(0, Math.min(.25, x[0])) * .9, fy = 1 - flat;
    for (i = 0; i < 72; i++) { th = i / 72 * TAU; var py = Math.sin(th) * rr[i] + shift; if (flat > 0 && py > fy) py = fy + (py - fy) * .25; d += (i ? 'L' : 'M') + P(Math.cos(th) * rr[i], py); }
    return { d: d + 'Z', warp: { sh: shift, x: x } };
  }
  /* os dois olhos recortados de um orb de centro (cx, cy) e raio R: [[d, visibilidade], [d, visibilidade]] */
  function eyePaths(cx, cy, R, yaw, pitch, sq, warp, es) {
    es = es || 1;
    var Fr = frame(yaw, pitch), P = function (u, v) { return (cx + u * R).toFixed(2) + ' ' + (cy + v * R).toFixed(2); };
    return EYES.map(function (ft) {
      var vis = clamp((proj(ft.c[0] * FACE, ft.c[1] * FACE, Fr)[2] + .12) / .22), ey = ft.c[1], d = '';
      ft.pts.forEach(function (q, k) {
        var p = proj((ft.c[0] + (q[0] - ft.c[0]) * es) * FACE, (ey + (q[1] - ey) * sq * es) * FACE, Fr), X = p[0], Y = p[1] + (warp ? warp.sh : 0);
        if (warp && warp.x) { var r1 = radius(warp.x, Math.atan2(p[1], p[0])); X = p[0] * r1; Y = p[1] * r1 + warp.sh; }
        d += (k ? 'L' : 'M') + P(X, Y);
      });
      return [d + 'Z', vis];
    });
  }

  /* ---------- o elemento ---------- */
  var NS = 'http://www.w3.org/2000/svg', uid = 0, live = new Set(), raf = 0;
  var RMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function tick(now) {
    live.forEach(function (el) { el._frame(now); });
    raf = live.size ? requestAnimationFrame(tick) : 0;
  }
  function wake() { if (!raf && live.size) raf = requestAnimationFrame(tick); }

  var Base = typeof HTMLElement !== 'undefined' ? HTMLElement : function () {};
  class HeildLogoElement extends Base {
    static get observedAttributes() { return ['animation', 'loop', 'label']; }
    constructor() {
      super();
      this._id = 'heild' + (++uid);
      this._anim = null; this._t0 = 0; this._cycleIdx = 0; this._resolve = null; this._built = false;
    }
    connectedCallback() {
      if (!this._built) this._build();
      this._sync(true);
    }
    disconnectedCallback() { live.delete(this); }
    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === 'label') this._svg.setAttribute('aria-label', this.getAttribute('label') || 'Heild');
      else this._sync(true);
    }
    get animation() { return this.getAttribute('animation') || 'none'; }
    set animation(v) { this.setAttribute('animation', v); }

    /* Toca uma animação uma vez (ou a do atributo). Resolve quando o I volta ao repouso. */
    play(name) {
      var self = this;
      if (!this._built) this._build();
      var n = name || this.animation;
      if (n === 'cycle') n = CYCLE_ORDER[this._cycleIdx++ % CYCLE_ORDER.length];
      if (!ANIMS[n] || RMQ.matches) return Promise.resolve(this);
      if (this._resolve) this._resolve(this);
      this._start(n, performance.now(), true);
      return new Promise(function (res) { self._resolve = res; });
    }
    stop() { this._anim = null; this._m = null; this._st = null; live.delete(this); this._rest(); return this; }

    /* Leva o I até a forma `name` (sem nome, ou nome desconhecido: volta à pílula), partindo do que
       está desenhado agora: no meio de outra transição, de um play() ou do efeito de repouso. */
    morph(name) {
      if (!this._built) this._build();
      var a = ANIMS[name]; if (!a) { a = null; name = null; }
      if (this._anim) { this._anim = null; if (this._resolve) { var res = this._resolve; this._resolve = null; res(this); } }
      if (RMQ.matches) { // movimento reduzido: vai direto, estático
        this._m = null; this._st = name; live.delete(this);
        if (a) {
          this._draw(a.eyeCaps, a.shift, 0); this._orbOff();
          if (a.eyes) { var ps = []; a.eyes.forEach(function (e) { var c = a.eyeCaps[e.ci], o = e.life({}, 0, 0); ps = ps.concat(eyePaths(c.x, c.y, c.T / 2, o.yaw, o.pitch, 1, null, o.es)); }); this._setEyes(ps); }
        } else this._rest();
        return this;
      }
      var now = performance.now(), m = this._m || (this._m = this._morphInit(now));
      if (!live.has(this)) m.t = now;
      live.add(this); wake();
      if (m.name === name) return this;
      var prev = ANIMS[m.name], caps = a ? a.caps : [PILL], order = a ? a.order : [0], S = m.s, j, d;
      // o alvo atual de cada cápsula vira o "de onde vinha" antes de soltá-la para o novo
      var pre = S.map(function (s) { return capOf(this._slotGoal(s, m, prev, now)); }, this);
      var oldRank = S.map(function (s) { return prev ? prev.rank[s.ci] : 0; }), Kp = prev ? prev.caps.length : 1;
      // cada cápsula da forma nova (na ordem de stagger) pega a mola livre mais próxima...
      var free = S.map(function () { return true; }), owner = [];
      order.forEach(function (ci) {
        var c = caps[ci], best = -1, bd = Infinity;
        for (j = 0; j < S.length; j++) if (free[j]) { d = Math.hypot(S[j].p[0] - c.x, S[j].p[1] - c.y); if (d < bd) { bd = d; best = j; } }
        free[best] = false; owner[ci] = best; S[best].ci = ci;
      });
      // ...e as que sobram se fundem na cápsula mais próxima da forma nova
      S.forEach(function (s, j2) {
        if (!free[j2]) { s.host = j2; return; }
        var bi = 0, bd2 = Infinity;
        caps.forEach(function (c, ci) { var d2 = Math.hypot(s.p[0] - c.x, s.p[1] - c.y); if (d2 < bd2) { bd2 = d2; bi = ci; } });
        s.ci = bi; s.host = owner[bi];
      });
      if (a) {
        // rajada de chamadas dentro da janela de recolhimento reaproveita a mesma janela
        if (now - m.g0 >= GATHER) m.g0 = now;
        S.forEach(function (s) { s.pre = SQ; s.rel = m.g0 + GATHER + a.rank[s.ci] * STAGGER; });
      } else {
        // volta à pílula como no BACK: mantém o rumo e solta em ordem inversa, de 40 em 40 ms
        S.forEach(function (s, j3) { s.pre = pre[j3]; s.rel = now + (Kp - 1 - oldRank[j3]) * 40; });
      }
      if (prev && prev.split && m.su > 0) m.fuseT = now; // as filhas voltam para a mãe: goo para o pescoço se formar
      m.name = name; m.fx = 0; m.ms = 0; m.su = 0; m.suGo = false;
      return this;
    }
    /* Segue um estado: ligado leva o I à forma `name`; desligado volta à pílula só se `name` for o alvo atual
       (trocar de uma forma para outra, em qualquer ordem de chamadas, nunca passa por um corte). */
    follow(name, on) {
      if (on) return this.morph(name);
      var cur = this._m ? this._m.name : this._st;
      if (cur && cur === name) this.morph(null);
      return this;
    }
    _morphInit(now) {
      var last = (this._last || [PILL]).filter(Boolean), s = [];
      if (!last.length) last = [PILL];
      for (var j = 0; j < this._rs.length; j++) {
        var c = last[j % last.length];
        s.push({ p: [c.x, c.y, c.T, c.L, c.r], v: [0, 0, 0, 0, 0], ci: 0, host: j, pre: capOf(c), rel: 0 });
      }
      // eo: abertura dos olhos (0..1); eyeA/eyeSlots: de qual forma e de quais molas são os olhos desenhados
      return { name: undefined, s: s, t: now, g0: -1e9, fx: 0, ms: 0, ls: this._lastL || 0, lv: 0, goo: 0, eo: 0, eyeA: null, eyeSlots: null, et: 0, lk: null, jel: null, su: 0, suGo: false, fuseT: -1e9 };
    }
    _slotGoal(s, m, a, now) {
      if (now < s.rel) return s.pre;
      if (a && a.split) return a.split(m.su)[s.ci];
      var c = a ? a.caps[s.ci] : PILL;
      return a && a.holdFx && m.fx > 0 ? a.holdFx(c, s.ci, m.fx, m.ms) : c;
    }
    _morphFrame(now) {
      var m = this._m, a = ANIMS[m.name], S = m.s;
      var dt = Math.min(1 / 30, Math.max(0, (now - m.t) / 1000)); m.t = now;
      var n = Math.ceil(dt / SUB), h = n ? dt / n : 0, g = [0, 0, 0, 0, 0];
      var err = 0, vel = 0, spd = 0, all = true, j, d, k;
      for (j = 0; j < S.length; j++) {
        var s = S[j], tg = this._slotGoal(s, m, a, now), p = s.p, v = s.v;
        if (now < s.rel) all = false;
        g[0] = tg.x; g[1] = tg.y; g[2] = tg.T; g[3] = tg.L; g[4] = p[4] + norm(tg.r - p[4]); // rotação pelo caminho curto
        for (d = 0; d < 5; d++) {
          for (k = 0; k < n; k++) { v[d] += (MK * (g[d] - p[d]) - MC * v[d]) * h; p[d] += v[d] * h; }
          err = Math.max(err, Math.abs(g[d] - p[d])); vel = Math.max(vel, Math.abs(v[d]));
        }
        spd += Math.hypot(v[0], v[1]) + Math.abs(v[3]) * .5;
        s.g = g.slice();
      }
      // as letras só fecham quando o I já recolheu: o alvo delas nunca é menor que a largura desenhada agora
      var lt = a ? a.shift : 0, wx = 0;
      S.forEach(function (s4) { var q = s4.p, T4 = Math.min(q[2], H), L4 = Math.max(T4, Math.min(q[3], H)); wx = Math.max(wx, Math.abs(q[0] - CX) + Math.abs(Math.sin(q[4] * Math.PI / 180)) * (L4 - T4) / 2 + T4 / 2); });
      lt = Math.max(lt, wx - PW / 2);
      for (k = 0; k < n; k++) { m.lv += (MK * (lt - m.ls) - MC * m.lv) * h; m.ls += m.lv * h; }
      // efeito de repouso da forma (girar, balançar) entra depois de chegar
      if (a && a.holdFx && all && err < 10) m.fx = clamp(m.fx + dt * 1000 / a.hold);
      if (m.fx > 0) m.ms += dt * 1000;
      // mitose: começa quando a mãe chegou e corre sozinha até soltar as três filhas
      if (a && a.split) { if (!m.suGo && all && err < 30) m.suGo = true; if (m.suGo) m.su = Math.min(1, m.su + dt * 1000 / ORBS_DIV); }
      var gooT = Math.max(Math.min(11, spd / S.length / 110), a && a.split ? mitGoo(m.su) : 0, 16 * clamp(1 - (now - m.fuseT) / 700));
      m.goo += (gooT - m.goo) * Math.min(1, dt * 12);
      // forma com olhos não "termina": o olhar e a piscada seguem em loop enquanto ela for o alvo
      var done = all && err < .05 && vel < .5 && Math.abs(lt - m.ls) < .05 && Math.abs(m.lv) < .5 && (!a || !a.holdFx || m.fx >= 1) && (!a || !a.eyes) && !m.eo;
      if (done) {
        if (!a) { this._m = null; live.delete(this); this._rest(); return; }
        S.forEach(function (s2) { for (var d2 = 0; d2 < 5; d2++) { s2.p[d2] = s2.g[d2]; s2.v[d2] = 0; } });
        m.ls = lt; m.lv = 0; m.goo = 0; live.delete(this);
      }
      var caps = S.map(function (s3, j3) {
        var o = s3.p, hp = S[s3.host].p;
        // a que está fundida e coincide com a anfitriã não é desenhada (evita borda dobrada)
        if (s3.host !== j3 && Math.abs(o[0] - hp[0]) < .75 && Math.abs(o[1] - hp[1]) < .75 && Math.abs(o[2] - hp[2]) < .75 &&
            Math.abs(o[3] - hp[3]) < .75 && Math.abs(norm(o[4] - hp[4])) < .5) return null;
        // nenhuma medida passa da altura das letras (a mola passaria do ponto e o orb/pílula cresceria além dela)
        var T = Math.min(o[2], H), L = Math.min(o[3], H), ext = Math.min(H / 2, Math.abs(Math.cos(o[4] * Math.PI / 180)) * Math.max(0, L - T) / 2 + T / 2);
        return { x: o[0], y: Math.max(ext, Math.min(H - ext, o[1])), T: T, L: L, r: o[4] }; // e nada sai da faixa 0..H
      });
      var drawn = this._morphEyes(m, a, caps, dt, err, all);
      this._draw(drawn, m.ls, m.goo);
      this._last = caps;
    }
    /* Olhos (e gelatina do orb grande) no morph. Os olhos só abrem depois que a forma chegou; ao trocar de alvo
       fecham em ~120 ms enquanto as molas já recolhem, e só reabrem (noutra forma) depois de fechados. Cada olho
       segue a mola da sua cápsula e some sozinho se ela deixar de ser um círculo do tamanho certo. */
    _morphEyes(m, a, caps, dt, err, all) {
      var S = m.s, want = !!(a && a.eyes && all && err < 30 && (!a.split || m.su >= 1)), drawn = caps, slotOf = function (ci) {
        for (var j = 0; j < S.length; j++) if (S[j].ci === ci && S[j].host === j) return j;
        return -1;
      };
      if (want && m.eyeA !== m.name) {
        if (m.eo > 0) want = false;
        else { m.eyeA = m.name; m.et = 0; m.lk = a.eyes.map(function () { return {}; }); m.jel = null; if (a.orb) { m.jel = {}; jellyKick(m.jel); } }
      }
      if (want) m.eyeSlots = a.eyes.map(function (e) { return slotOf(e.ci); });
      m.eo = want ? Math.min(1, m.eo + dt / .26) : Math.max(0, m.eo - dt / .12);
      var E = ANIMS[m.eyeA], out = [], body = '';
      if (m.eo > 0 && E && m.eyeSlots) {
        m.et += dt * 1000;
        if (m.jel && !want) { var f = Math.exp(-dt * 40); for (var q = 0; q < 6; q++) { m.jel.jx[q] *= f; m.jel.jv[q] *= f; } } // ao sair, a gelatina assenta já
        var energy = m.jel ? jellyStep(m.jel, dt) : 0;
        E.eyes.forEach(function (e, i) {
          var j = m.eyeSlots[i], c = j < 0 ? null : caps[j], g = E.eyeCaps[e.ci], o = e.life(m.lk[i], m.et, dt);
          if (!c) return;
          var r = Math.min(c.T, c.L) / 2, round = clamp(1 - Math.abs(c.L - c.T) / c.T / .14), size = clamp((2 * r / g.T - .78) / .17);
          var sq = o.sq * inOut(m.eo) * round * size, warp = null;
          // orb grande: enquanto a gelatina mexe, o contorno deformado substitui o retângulo (com os olhos acompanhando)
          if (m.jel && energy > 2e-4 && round * size > .99) {
            var b = jellyBody(c.x, c.y, r, m.jel.jx); body = b.d; warp = b.warp;
            if (drawn === caps) drawn = caps.slice();
            drawn[j] = null;
          }
          if (sq < .06) return;
          eyePaths(c.x, c.y, r, o.yaw, o.pitch, Math.max(.05, sq), warp, o.es).forEach(function (q) { out.push(q); });
        });
      }
      if (!m.eo) m.jel = null;
      this._body.setAttribute('d', body);
      this._setEyes(out);
      return drawn;
    }

    _build() {
      this._built = true;
      var root = this.attachShadow ? this.attachShadow({ mode: 'open' }) : this;
      var id = this._id, a = '';
      for (var i = 0; i < 9; i++) a += '<rect></rect>';
      var eyes = ''; for (i = 0; i < 6; i++) eyes += '<path class="eye" fill="black" d=""></path>'; // 2 por orb, até 3 orbs
      root.innerHTML =
        '<style>:host{display:inline-block;width:160px;line-height:0;color:inherit}svg{width:100%;height:auto;display:block;overflow:visible}</style>' +
        '<svg viewBox="0 0 1259 387" role="img" aria-label="' + (this.getAttribute('label') || 'Heild').replace(/"/g, '&quot;') + '">' +
        '<defs><filter id="' + id + 'g" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="0"></feGaussianBlur>' +
        '<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"></feColorMatrix></filter>' +
        '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="-400" y="-200" width="2100" height="800">' +
        '<rect x="-400" y="-200" width="2100" height="800" fill="white"></rect>' +
        eyes + '</mask></defs>' +
        '<path class="he" fill="currentColor" d="' + HE + '"></path>' +
        '<path class="ld" fill="currentColor" fill-rule="evenodd" d="' + LD + '"></path>' +
        '<g class="i" fill="currentColor" mask="url(#' + id + 'm)">' + a + '<path class="body" d=""></path></g></svg>';
      this._svg = root.querySelector('svg');
      this._he = root.querySelector('.he'); this._ld = root.querySelector('.ld');
      this._g = root.querySelector('g.i'); this._blur = root.querySelector('feGaussianBlur');
      this._rs = Array.prototype.slice.call(root.querySelectorAll('g.i rect'));
      this._eyes = Array.prototype.slice.call(root.querySelectorAll('path.eye'));
      this._body = root.querySelector('path.body');
      this._rest();
    }
    _sync() {
      var n = this.animation;
      if (n === 'none' || RMQ.matches || !(ANIMS[n] || n === 'cycle')) { this.stop(); return; }
      if (n === 'cycle') n = CYCLE_ORDER[this._cycleIdx++ % CYCLE_ORDER.length];
      // sem loop: toca uma vez ao aparecer; com loop: repete com uma pausa no repouso
      this._start(n, performance.now() + (this.hasAttribute('loop') ? REST_GAP : 400), false);
    }
    _start(n, t0, once) {
      this._m = null; this._st = null;
      this._anim = n; this._t0 = t0; this._once = once; this._orb = { last: -1 };
      live.add(this); wake();
    }
    _rest() {
      this._draw([PILL], 0, 0);
      this._orbOff();
    }
    _draw(caps, letters, goo) {
      this._last = caps; this._lastL = letters; // o que está na tela: ponto de partida de um morph
      this._he.setAttribute('transform', 'translate(' + (-letters).toFixed(2) + ' 0)');
      this._ld.setAttribute('transform', 'translate(' + letters.toFixed(2) + ' 0)');
      if (goo > .4) { this._blur.setAttribute('stdDeviation', goo.toFixed(2)); this._g.setAttribute('filter', 'url(#' + this._id + 'g)'); }
      else this._g.removeAttribute('filter');
      for (var i = 0; i < this._rs.length; i++) {
        var r = this._rs[i], c = caps[i];
        if (!c) { r.setAttribute('width', '0'); r.setAttribute('height', '0'); continue; }
        var T = Math.max(1, c.T), L = Math.max(T, c.L);
        r.setAttribute('x', (-T / 2).toFixed(2)); r.setAttribute('y', (-L / 2).toFixed(2));
        r.setAttribute('width', T.toFixed(2)); r.setAttribute('height', L.toFixed(2)); r.setAttribute('rx', (T / 2).toFixed(2));
        r.setAttribute('transform', 'translate(' + c.x.toFixed(2) + ' ' + c.y.toFixed(2) + ') rotate(' + c.r.toFixed(2) + ')');
      }
    }
    _frame(now) {
      if (this._m) { this._morphFrame(now); return; }
      var a = ANIMS[this._anim]; if (!a) { live.delete(this); return; }
      var t = now - this._t0, K = a.caps.length, total = OUT + a.hold + BACK;
      if (t < 0) { this._rest(); return; }
      if (t >= total) {
        this._rest();
        if (this._resolve) { var res = this._resolve; this._resolve = null; res(this); }
        if (!this._once && this.hasAttribute('loop')) {
          var n = this.animation === 'cycle' ? CYCLE_ORDER[this._cycleIdx++ % CYCLE_ORDER.length] : this._anim;
          this._start(n, now + REST_GAP, false);
        } else { this._anim = null; live.delete(this); }
        return;
      }
      var pill = a.caps.map(function () { return PILL; });
      if (t < OUT) {
        var k = inOut(clamp(t / 160)), sq = { x: CX, y: CY, T: PW * (1 + .07 * k), L: H * (1 - .05 * k), r: 0 };
        var span = OUT - ANTICIPATE - (K - 1) * STAGGER;
        var caps = a.caps.map(function (c, i) { return lerpCap(sq, c, outBack(clamp((t - ANTICIPATE - a.rank[i] * STAGGER) / span), 1.25)); });
        this._draw(caps, a.shift * inOut(clamp((t - 90) / 720)), 11 * Math.sin(Math.PI * clamp((t - ANTICIPATE) / (OUT - ANTICIPATE))));
        this._orbOff();
      } else if (t < OUT + a.hold) {
        var ms = t - OUT, p = ms / a.hold;
        if (a.orb) { this._draw([{ x: CX, y: CY, T: 1, L: 1, r: 0 }], a.shift, 0); this._last = [cap(CX, CY, H, H)]; this._orbFrame(ms, a.hold); return; }
        var capsH = a.holdFx ? a.caps.map(function (c, i) { return a.holdFx(c, i, p, ms); }) : a.caps;
        this._draw(capsH, a.shift, a.split ? mitGoo(orbsU(p)) : 0);
        if (a.eyes) this._eyesHold(a, capsH, ms, a.hold);
      } else {
        var mb = t - OUT - a.hold, spanB = BACK - (K - 1) * 40;
        var capsB = a.endHold.map(function (c, i) { return lerpCap(c, PILL, outBack(clamp((mb - (K - 1 - a.rank[i]) * 40) / spanB), 1.1)); });
        this._draw(capsB, a.shift * (1 - outBack(clamp((mb - 140) / (BACK - 140)), .9)), 11 * Math.sin(Math.PI * clamp(mb / (BACK * .8))));
        this._orbOff();
      }
      void pill;
    }
    _orbOff() {
      if (!this._body) return;
      this._body.setAttribute('d', '');
      this._eyes.forEach(function (e) { e.setAttribute('d', ''); });
      if (this._orb) this._orb.last = -1;
      this._es = null;
    }
    _setEyes(ps) {
      for (var i = 0; i < this._eyes.length; i++) { var e = this._eyes[i], q = ps[i]; e.setAttribute('d', q ? q[0] : ''); if (q) e.setAttribute('fill-opacity', q[1].toFixed(3)); }
    }
    _orbFrame(ms, hold) {
      var st = this._orb, R = H / 2;
      var P = function (x, y) { return (CX + x * R).toFixed(2) + ' ' + (CY + y * R).toFixed(2); };
      if (st.last < 0 || ms < st.last) { var r0 = lookRest(1); for (var k in r0) st[k] = r0[k]; jellyKick(st); st.last = ms; }
      var dt = Math.min(.1, (ms - st.last) / 1000); st.last = ms;
      lookStep(st, ms, dt, 1);
      var energy = jellyStep(st, dt), warp;
      var sq = blink(ms);
      sq *= .05 + .95 * inOut(clamp((ms - 60) / 200));
      sq *= 1 - .95 * inOut(clamp((ms - (hold - 430)) / 190));
      sq = Math.max(.05, sq);
      var shut = ms > hold - 240 || ms < 60;
      if (energy <= 2e-4) { this._body.setAttribute('d', 'M' + P(-1, 0) + 'A' + R + ' ' + R + ' 0 1 0 ' + P(1, 0) + 'A' + R + ' ' + R + ' 0 1 0 ' + P(-1, 0) + 'Z'); warp = { sh: 0 }; }
      else { var b = jellyBody(CX, CY, R, st.jx); this._body.setAttribute('d', b.d); warp = b.warp; }
      this._setEyes(shut ? [] : eyePaths(CX, CY, R, st.yaw, st.pitch, sq, warp));
    }
    /* olhos das formas com orbs pequenos no play(): abrem na janela eyeWin (depois da divisão) e fecham antes da fusão */
    _eyesHold(a, caps, ms, hold) {
      var lo = a.eyeWin ? a.eyeWin[0] : 0, hi = a.eyeWin ? a.eyeWin[1] : hold, st = this._es, t = ms - lo, out = [];
      if (!st || ms < st.last) st = this._es = { last: ms, lk: a.eyes.map(function () { return {}; }) };
      var dt = Math.min(.1, (ms - st.last) / 1000); st.last = ms;
      if (t < 60 || ms > hi - 240) { this._setEyes([]); return; }
      var env = (.05 + .95 * inOut(clamp((t - 60) / 200))) * (1 - .95 * inOut(clamp((ms - (hi - 430)) / 190)));
      a.eyes.forEach(function (e, i) {
        var o = e.life(st.lk[i], t, dt), c = caps[e.ci];
        eyePaths(c.x, c.y, c.T / 2, o.yaw, o.pitch, Math.max(.05, o.sq * env), null, o.es).forEach(function (q) { out.push(q); });
      });
      this._setEyes(out);
    }
  }

  function define() {
    if (window.customElements && !customElements.get('heild-logo')) customElements.define('heild-logo', HeildLogoElement);
  }
  define();

  /* React: <Heild.HeildLogo animation="orb" loop /> renderiza <heild-logo>. */
  function HeildLogo(props) {
    var R = window.React;
    if (!R) throw new Error('Heild.HeildLogo precisa de window.React; sem React, use <heild-logo>.');
    props = props || {};
    var attrs = { animation: props.animation || 'none', label: props.label, className: props.className, style: props.style, ref: props.innerRef };
    if (props.loop) attrs.loop = '';
    return R.createElement('heild-logo', attrs);
  }

  window.Heild = {
    HeildLogo: HeildLogo,
    HeildLogoElement: HeildLogoElement,
    define: define,
    animations: Object.keys(ANIMS),
    cycle: CYCLE_ORDER.slice(),
    paths: { HE: HE, LD: LD, viewBox: '0 0 1259 387', pill: { cx: CX, cy: CY, width: PW, height: H } }
  };
})();
