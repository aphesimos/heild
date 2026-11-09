/*
 * Diretrizes da marca Heild — o motor.
 *
 * Um laço só (requestAnimationFrame) faz tudo:
 *   1. lê a rolagem uma vez por quadro e calcula o progresso de cada capítulo (--p, 0 a 1);
 *      se o navegador não tem animation-timeline, escreve --p no capítulo (o CSS faz o resto);
 *   2. escolhe as duas formações do campo entre as quais a rolagem está e passa ao campo;
 *   3. roda o que cada capítulo tem de vivo (o respiro da logo, a luz e as presenças, o fim);
 *   4. cuida do topo, da linhagem, do tema, do som e do toque.
 * Com movimento reduzido, nada roda: cada figura é desenhada parada uma vez.
 *
 * Para portar ao site (React): CHAVES é dado puro; `capitulos` vira um hook por seção; o campo e
 * as formações são módulos sem dependência de framework.
 */
(function () {
  'use strict';
  var G = window.Genealogia;
  var raiz = document.documentElement;
  var RMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DMQ = window.matchMedia('(prefers-color-scheme: dark)');
  var parado = RMQ.matches;
  var TIMELINE = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  var FINO = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (parado) raiz.classList.add('parado');

  function q(s, el) { return (el || document).querySelector(s); }
  function qa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function suave(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function faixa(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------- os capítulos ---------- */
  var CAPS = qa('.cap').map(function (el) { return { el: el, id: el.id, palco: q('.palco', el), fluxo: el.classList.contains('cap-fluxo'), topo: 0, altura: 0, p: -1 }; });
  var CAP = {}; CAPS.forEach(function (c) { CAP[c.id] = c; });
  var vw = 0, vh = 0, dpr = 1, docH = 0;
  var M = { y: -1, vel: 0, tAnt: 0, yAnt: 0, ativo: null, mudou: true };

  /* retângulo de um elemento no palco preso (coordenadas da tela quando o capítulo está fixo) */
  function noPalco(el) {
    var cap = el.closest('.cap'), pal = q('.palco', cap), r = el.getBoundingClientRect(), rp = pal.getBoundingClientRect();
    return { x: r.left - rp.left, y: r.top - rp.top, w: r.width, h: r.height };
  }
  function figura(nome) { var el = q('[data-figura="' + nome + '"]'); return el ? noPalco(el) : { x: 0, y: 0, w: vw, h: vh }; }
  function evitar(capId) {
    var r = qa('#' + capId + ' [data-evitar]').map(noPalco);
    r.push({ x: 0, y: 0, w: vw, h: parseFloat(getComputedStyle(raiz).getPropertyValue('--topo-h')) || 64 });
    // a linhagem, à direita: as cápsulas não passam por baixo dos pontos
    var ln = q('.linhagem'); if (ln && ln.offsetParent !== null) { var rl = ln.getBoundingClientRect(); r.push({ x: rl.left - 160, y: rl.top, w: vw - rl.left + 160, h: rl.height }); }
    return r;
  }

  function medir() {
    vw = window.innerWidth; vh = window.innerHeight; dpr = window.devicePixelRatio || 1;
    var y = window.scrollY;
    CAPS.forEach(function (c) { var r = c.el.getBoundingClientRect(); c.topo = r.top + y; c.altura = r.height; });
    docH = document.documentElement.scrollHeight;
    M.mudou = true;
  }

  /* ---------- as cores dos tokens (relidas ao trocar o tema) ---------- */
  var COR = {};
  function rgb(cor) { var m = String(cor).match(/[\d.]+/g); return m ? [m[0] / 255, m[1] / 255, m[2] / 255] : [0, 0, 0]; }
  function lerCor(el, nome) { var s = document.createElement('i'); s.style.color = 'var(' + nome + ')'; s.style.display = 'none'; el.appendChild(s); var c = getComputedStyle(s).color; s.remove(); return c; }
  function lerCores() {
    COR.primaria = rgb(lerCor(document.body, '--primaria'));
    COR.suave = rgb(lerCor(document.body, '--texto-suave'));
    COR.areia = rgb(lerCor(document.body, '--areia-500')); // areia-500: o passo da escala reservado para ilustração
    COR.chao = rgb(lerCor(document.body, '--borda')); // o chão assentado: o tom da borda (areia 300 no claro, 800 no escuro)
  }

  /*
   * ---------- a linha do tempo do campo ----------
   * [capítulo, p, formação, fusão (fração da escala da formação), cor, opacidade, deriva, cursor, vida]
   * Entre duas chaves, as cápsulas vão de uma formação à outra em cascata; no meio de toda troca de forma
   * elas se fundem como líquido (como na divisão da logo) e assentam no fim. `vida` mantém o que assentou
   * respirando: pulsação, pescoços entre vizinhas e o cursor.
   * Nas duas passagens para o <heild-logo> (o respiro e o fim), o campo termina numa cápsula só, lisa, no
   * pixel exato do I do componente; o componente aparece por cima de uma vez (as duas opacas, iguais) e o
   * campo some logo depois. HE e LD entram por máscara a partir do I. O campo nunca desenha o wordmark.
   */
  var CHAVES = [
    ['nome', 0.00, 'palavraFina', 0.03, 'primaria', 1, 0, 1, 1],
    ['nome', 0.72, 'palavraCheia', 1.4, 'primaria', 1, 0, 1, 1],
    ['ideia', 0.10, 'muitos', 0.0, 'primaria', 1, 1, 1.2, 1],
    ['ideia', 0.46, 'muitos', 0.0, 'primaria', 1, 1, 1.2, 1],
    ['ideia', 0.80, 'pilulaCheia', 1.0, 'primaria', 1, 0, 1, 0.4],
    ['ideia', 0.95, 'pilulaUnica', 0.1, 'primaria', 1, 0, 1, 1],     // as partes fundidas viram uma peça só, lisa
    ['logo', 0.00, 'pilulaUnica', 0.02, 'primaria', 1, 0, 0, 0.6],
    ['logo', 0.12, 'pilulaLogoA', 0.0, 'primaria', 1, 0, 0, 0],      // a pílula desliza até o I do <heild-logo> da logo
    ['logo', 0.137, 'pilulaLogoA', 0.0, 'primaria', 1, 0, 0, 0],
    ['logo', 0.1375, 'pilulaLogoA', 0.0, 'primaria', 0, 0, 0, 0],    // e o componente toma o lugar, no mesmo pixel
    ['material', 0.00, 'pilulaUnica', 0.04, 'primaria', 0, 0, 0, 0],
    ['material', 0.06, 'pilulaUnica', 0.04, 'primaria', 1, 0, 1, 1],
    ['material', 0.30, 'pilulaUnica', 0.02, 'primaria', 1, 0, 1, 1],
    ['material', 0.38, 'contracao', 0.02, 'primaria', 1, 0, 1, 1],
    ['material', 0.56, 'grade9', 0.02, 'primaria', 1, 0, 1, 1],
    ['material', 0.64, 'grade9', 0.02, 'primaria', 1, 0, 1, 1],
    ['material', 0.93, 'pilulaUnica', 0.02, 'primaria', 1, 0, 1, 1], // entre 0,64 e 0,93: o ciclo próprio (cicloPilula), que termina na pílula
    ['tempos', 0.00, 'pilulaUnica', 0.02, 'primaria', 1, 0, 0, 0.6],
    ['tempos', 0.12, 'pilulaLogo', 0.0, 'primaria', 1, 0, 0, 0],
    ['tempos', 0.137, 'pilulaLogo', 0.0, 'primaria', 1, 0, 0, 0],
    ['tempos', 0.1375, 'pilulaLogo', 0.0, 'primaria', 0, 0, 0, 0],
    ['cor', 0.00, 'graos', 0.0, 'areia', 0, 1, 0, 0],
    ['cor', 0.08, 'graos', 0.0, 'areia', 1, 1, 0.6, 1],
    ['cor', 0.42, 'estratos', 0.0, 'areia', 1, 0, 0, 1],
    ['cor', 0.78, 'superficie', 1.0, 'chao', 1, 0, 0, 1],
    ['cor', 1.00, 'superficie', 1.0, 'chao', 1, 0, 0, 1],
    ['cores', 0.00, 'superficie', 1.0, 'chao', 0, 0, 0, 0],         // o chão se apaga onde está, enquanto a seção de leitura chega
    ['grade', 0.00, 'grade', 0.0, 'suave', 0, 0, 0, 0],
    ['grade', 0.12, 'grade', 0.0, 'suave', 1, 0, 1, 1],              // a grade acende nos próprios pontos, em volta do texto
    ['grade', 1.00, 'grade', 0.0, 'suave', 1, 0, 1, 1],
    ['forma', 0.00, 'grade', 0.0, 'suave', 0, 0, 0, 0],
    ['fecho', 0.02, 'muitosFim', 0.0, 'primaria', 0, 1, 0, 0],
    ['fecho', 0.12, 'muitosFim', 0.0, 'primaria', 1, 1, 0, 1],
    ['fecho', 0.22, 'pilulaFinal', 1.0, 'primaria', 1, 0, 0, 0],
    ['fecho', 0.30, 'pilulaFinal', 0.0, 'primaria', 1, 0, 0, 0],
    ['fecho', 0.322, 'pilulaFinal', 0.0, 'primaria', 1, 0, 0, 0],
    ['fecho', 0.3225, 'pilulaFinal', 0.0, 'primaria', 0, 0, 0, 0]
  ];
  /* formações que terminam no <heild-logo>: no fim da passagem a cápsula vai exata, sem mola */
  var EXATAS = { pilulaLogoA: 1, pilulaLogo: 1, pilulaFinal: 1 };
  /* o cursor em cada formação: raio, força (positiva afasta, negativa atrai), quanto cresce, quanto derrete */
  var CURSOR = {
    palavraFina: { r: 120, f: 1, cresce: 0, k: 12 }, palavraCheia: { r: 120, f: 1, cresce: 0, k: 12 },
    muitos: { r: 170, f: 1.2, cresce: 0, k: 0 }, graos: { r: 150, f: 0.9, cresce: 0, k: 0 },
    grade: { r: 170, f: 0.45, cresce: 2.2, k: 0 },
    // as peças grandes se inclinam para o cursor, fundem com a vizinha e soltam quando ele sai
    pilulaCheia: { r: 260, f: -0.45, cresce: 0.05, k: 30 }, pilulaUnica: { r: 280, f: -0.5, cresce: 0.05, k: 46 },
    contracao: { r: 280, f: -0.5, cresce: 0.05, k: 46 }, grade9: { r: 240, f: -0.55, cresce: 0.07, k: 52 }
  };

  /* ---------- o campo ---------- */
  var canvas = q('#campo'), campo = null, prontas = false, t0campo = 0;
  var ponteiro = { x: -999, y: -999, t: -1e9, toque: false };

  function criarCampo() {
    if (parado || !canvas) return;
    var area = Math.max(window.screen.width * window.screen.height, vw * vh);
    var n = clamp(Math.ceil(Math.sqrt(area) * Math.sqrt(area) / 576), 900, 3600);
    if (!FINO) n = Math.min(n, 1600);
    if ((navigator.hardwareConcurrency || 8) <= 4) n = Math.min(n, 1400);
    campo = new G.Campo(canvas, n);
    campo.redimensionar(vw, vh, dpr);
    campo.espalhar(vw, vh);
  }
  function gerarFormacoes() {
    if (!campo) return;
    var n = campo.n, F = G.F, tela = { x: 0, y: 0, w: vw, h: vh };
    var cpal = figura('palavra'), tam = F.tamanhoPalavra(cpal);
    var la = q('.cap-logo heild-logo'), lp = q('.cap-respiro heild-logo'), lf = q('.cap-inteiro heild-logo');
    var pil = F.pilulaUnica(figura('pilula'), n);
    var forms = {
      palavraFina: F.palavra(cpal, n, 100, tam),
      palavraCheia: F.palavra(cpal, n, 900, tam),
      muitos: F.muitos(tela, n, evitar('ideia'), 23),
      pilulaCheia: F.pilulaCheia(figura('pilula-partes'), n),
      pilulaUnica: pil,
      contracao: F.contracao(figura('pilula'), n),
      grade9: F.grade9(figura('pilula'), n),
      pilulaLogoA: F.pilulaNoLogo(noPalco(la), n),
      pilulaLogo: F.pilulaNoLogo(noPalco(lp), n),
      graos: F.graos(tela, n),
      estratos: F.estratos(tela, n),
      superficie: F.superficie(tela, n),
      grade: F.grade(tela, n, evitar('grade')),
      muitosFim: F.muitos(tela, n, [], 97),
      pilulaFinal: F.pilulaNoLogo(noPalco(lf), n)
    };
    // a cápsula que vira a pílula final (índice n/2) já começa de pé: cresce e desliza, sem girar
    forms.muitosFim.f[Math.floor(n / 2) * G.PASSO + 2] = 0;
    Object.keys(forms).forEach(function (k) { forms[k].pares = paresVizinhos(forms[k].f, n); forms[k].grande = poucasGrandes(forms[k].f, n); });
    campo.formacoes(forms);
    var cot = q('.cotas'); if (cot && pil.mapa) cot.style.setProperty('--S', pil.mapa.S.toFixed(4));
    prontas = true;
  }
  /* pares de peças grandes vizinhas (a grade de 9): é entre elas que os pescoços se formam */
  function paresVizinhos(f, n) {
    var P = G.PASSO, gr = [], pares = [];
    for (var i = 0; i < n; i++) if (f[i * P + 4] > 14) gr.push(i);
    if (gr.length < 2 || gr.length > 40) return null;
    for (var a = 0; a < gr.length; a++) for (var b = a + 1; b < gr.length; b++) {
      var ia = gr[a] * P, ib = gr[b] * P, d = Math.hypot(f[ia] - f[ib], f[ia + 1] - f[ib + 1]);
      if (d < 1.45 * Math.max(f[ia + 4], f[ib + 4])) pares.push([gr[a], gr[b]]);
    }
    return pares.length ? pares : null;
  }
  /* formação de peças grandes (de 1 a 40 cápsulas visíveis com mais de 14 px) */
  function poucasGrandes(f, n) {
    var P = G.PASSO, k = 0, vis = 0;
    for (var i = 0; i < n; i++) { var e = f[i * P + 4]; if (e > 0.35) vis++; if (e > 14) k++; }
    return k >= 1 && vis <= 40;
  }
  function sorteio(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  /* dois pescoços por vez, em ritmos desencontrados: um par se procura, se funde e se solta em 1,7 s */
  function pescocos(form, agora) {
    var P = form && form.pares; if (!P) return null;
    var T = agora / 1000, out = [];
    [0, 0.5].forEach(function (off) {
      var c = T / 1.7 + off, k = Math.floor(c), fr = c - k, w = Math.pow(Math.sin(Math.PI * fr), 2);
      var par = P[Math.floor(sorteio(k * 7.31 + off * 13) * P.length)];
      out.push([par[0], par[1], w]);
    });
    return out;
  }
  /*
   * O ciclo próprio da pílula, enquanto o capítulo está na tela (não só pela rolagem): a grade vive (pulsa,
   * forma pescoços), volta a ser a pílula, a pílula se contrai e se divide de novo, em loop. Os tempos são os
   * do sistema de movimento: retorno 900 ms, contração 160 ms, divisão 1000 ms.
   */
  var CICLO_PILULA = [['grade9', 'grade9', 2600], ['grade9', 'pilulaUnica', 900], ['pilulaUnica', 'pilulaUnica', 1300], ['pilulaUnica', 'contracao', 160], ['contracao', 'grade9', 1000]];
  var CICLO_T = CICLO_PILULA.reduce(function (s2, f2) { return s2 + f2[2]; }, 0);
  function cicloPilula(agora, encerrar) {
    var c = M.cic || (M.cic = { k: 0, t0: agora });
    // perto do fim do capítulo o ciclo encerra: não se divide de novo e para na pílula
    for (var guarda = 0; guarda < 6 && agora - c.t0 >= CICLO_PILULA[c.k][2]; guarda++) {
      var prox = (c.k + 1) % CICLO_PILULA.length;
      if (encerrar && c.k === 2) { c.t0 = agora - CICLO_PILULA[2][2]; break; }
      c.t0 += CICLO_PILULA[c.k][2]; c.k = prox;
      if (agora - c.t0 > 4 * CICLO_T) c.t0 = agora; // voltou de outra aba: recomeça
    }
    if (encerrar && c.k === 0) { c.k = 1; c.t0 = agora; }
    var f = CICLO_PILULA[c.k];
    return { a: f[0], b: f[1], t: clamp((agora - c.t0) / f[2], 0, 1) };
  }
  /* em que ponto da linha do tempo a rolagem está */
  function estadoCampo(y, agora) {
    var ys = CHAVES.map(function (k) { var c = CAP[k[0]]; return c.topo + k[1] * Math.max(1, c.altura - vh); });
    var i = 0; while (i < CHAVES.length - 2 && y >= ys[i + 1]) i++;
    var A = CHAVES[i], B = CHAVES[i + 1], t = clamp((y - ys[i]) / Math.max(1, ys[i + 1] - ys[i]), 0, 1);
    var na = A[2], nb = B[2];
    // o trecho entre 0,64 e 0,93 da pílula roda o ciclo próprio
    if (A[0] === 'material' && A[1] === 0.64) { var cc = cicloPilula(agora, CAP.material.p > 0.88); na = cc.a; nb = cc.b; t = cc.t; }
    else M.cic = null;
    var fA = campo.forms[na], fB = campo.forms[nb];
    var corA = COR[A[4]], corB = COR[B[4]], ts = suave(t);
    var velK = Math.min(1, Math.abs(M.vel) / 2600) * 0.7;
    // troca entre peças grandes (a pílula, a contração, a grade de 9) passa por um meio líquido, como a
    // divisão da logo; entre formações de muitas cápsulas, não (viraria mancha)
    var ponte = na !== nb && fA.grande && fB.grande ? Math.sin(Math.PI * clamp(t, 0, 1)) * 0.5 : 0;
    var kA = (A[3] + velK) * fA.esc, kB = (B[3] + velK) * fB.esc;
    // a fusão se desfaz cedo quando as partes se separam e chega tarde quando elas se juntam; quando o
    // destino é uma peça lisa (a pílula, a grade), a fusão segura até a peça estar formada
    var curva = fB.grande && !fA.grande ? t * t * t : kB < kA ? 1 - Math.pow(1 - t, 3) : t * t;
    var kMix = kA + (kB - kA) * curva;
    var exata = EXATAS[nb] ? (na === nb ? 1 : clamp((t - 0.5) / 0.42, 0, 1)) : 0;
    // invisível nos dois lados: as cápsulas vão direto para o lugar (ninguém vê, e nada chega atrasado)
    if (A[5] === 0 && B[5] === 0) exata = 1;
    kMix = 0.9 + (kMix + ponte * Math.max(fA.esc, fB.esc)) * (1 - exata);
    kA = kB = kMix;
    var dono = t < 0.5 ? na : nb, cfg = CURSOR[dono], forcaCursor = lerp(A[7], B[7], ts);
    var vivoPont = agora - ponteiro.t < (ponteiro.toque ? 1400 : 4000) && ponteiro.x > -900;
    var molaK = Math.min(1, 0.12 + (agora - t0campo) / 2600), vida = lerp(A[8], B[8], ts) * (1 - exata);
    atualizarCotas(dono, na, nb, t);
    return {
      a: na, b: nb, t: t, kA: kA, kB: kB,
      cor: [lerp(corA[0], corB[0], ts), lerp(corA[1], corB[1], ts), lerp(corA[2], corB[2], ts)],
      opac: lerp(A[5], B[5], ts), deriva: lerp(A[6], B[6], ts), molaK: molaK, vida: vida, direto: exata,
      cursor: cfg && vivoPont && forcaCursor > 0 && !exata ? { x: ponteiro.x, y: ponteiro.y, forca: forcaCursor * cfg.f, r: cfg.r, cresce: cfg.cresce } : null,
      kCursor: cfg ? cfg.k : 0,
      pescocos: vida > 0.3 ? pescocos(campo.forms[dono], agora) : null,
      pocos: dono === 'grade' && B[5] > 0 ? pocosGrade(agora) : null
    };
  }
  /* as cotas da pílula seguem o que o campo mostra (a pílula ou a grade), também no ciclo próprio */
  var cotas = null, cotaAtual = '';
  function atualizarCotas(dono, na, nb, t) {
    if (!cotas) cotas = q('.cotas'); if (!cotas || !CAP.material) return;
    var c = CAP.material, y = M.y, pinado = y >= c.topo && y <= c.topo + c.altura - vh;
    var v = '';
    if (pinado) {
      var parada = na === nb || t < 0.08 || t > 0.92, forma = t < 0.5 ? na : nb;
      if (parada && (forma === 'pilulaUnica')) v = 'pilula';
      if (parada && forma === 'grade9') v = 'grade';
    }
    if (v !== cotaAtual) { cotaAtual = v; cotas.setAttribute('data-cota', v); }
  }
  /* o chão respira sozinho: um ponto invisível passeia devagar pela grade e a afasta, mesmo sem cursor */
  function pocosGrade(agora) {
    var t = agora / 1000, cel = vw < 720;
    return [{ x: vw * (cel ? 0.5 : 0.62) + Math.sin(t * 0.21) * vw * (cel ? 0.3 : 0.24), y: vh * 0.55 + Math.sin(t * 0.37 + 1) * vh * 0.26, r: Math.min(vw, vh) * 0.3, f: 22, cresce: 1.2 }];
  }

  /* ---------- 2. a parte e o todo: o peso da frase sob o cursor ---------- */
  function dividirLetras(el, comPalavras) {
    var texto = el.textContent.trim(); el.setAttribute('aria-label', texto);
    var html = texto.split(' ').map(function (p) {
      var l = Array.prototype.map.call(p, function (ch) { return '<span class="letra" aria-hidden="true">' + ch + '</span>'; }).join('');
      return comPalavras ? '<span class="palavra" aria-hidden="true" style="white-space:nowrap">' + l + '</span>' : l;
    }).join(comPalavras ? ' ' : '<span class="letra" aria-hidden="true">&nbsp;</span>');
    el.innerHTML = html;
    return qa('.letra', el);
  }
  var prox = null;
  function iniciarProximidade() {
    var el = q('[data-proximidade]'); if (!el || !FINO || parado) return;
    var linhas = qa('.linha', el), letras = [];
    if (linhas.length) linhas.forEach(function (ln) { letras = letras.concat(dividirLetras(ln, true)); ln.removeAttribute('aria-label'); });
    else letras = dividirLetras(el, true);
    el.setAttribute('aria-label', el.getAttribute('aria-label') || el.textContent.trim());
    prox = { el: el, letras: letras, centros: null, ativo: false };
    window.addEventListener('resize', function () { prox.centros = null; }, { passive: true });
  }
  function medirCentros() {
    // Posição de cada letra relativa ao título, medida com todas no mesmo peso.
    prox.letras.forEach(function (l) { l.style.fontWeight = ''; });
    var base = prox.el.getBoundingClientRect();
    prox.centros = prox.letras.map(function (l) { var r = l.getBoundingClientRect(); return [r.left + r.width / 2 - base.left, r.top + r.height / 2 - base.top]; });
    prox.pesoMedido = getComputedStyle(prox.el).fontWeight;
  }
  function quadroProximidade(p) {
    if (!prox) return;
    var vivo = performance.now() - ponteiro.t < 2500 && p > 0.6;
    if (!vivo) { if (prox.ativo) { prox.letras.forEach(function (l) { l.style.fontWeight = ''; }); prox.ativo = false; prox.centros = null; } return; }
    var base = 100 + 800 * clamp((p - 0.6) / 0.3, 0, 1);
    if (!prox.centros || Math.abs(parseFloat(prox.pesoMedido) - base) > 60) medirCentros();
    var r = prox.el.getBoundingClientRect();
    prox.letras.forEach(function (l, i) {
      var c = prox.centros[i], d = Math.hypot(r.left + c[0] - ponteiro.x, r.top + c[1] - ponteiro.y), w = Math.max(0, 1 - d / 240);
      l.style.fontWeight = Math.round(base + (900 - base) * w * w * (3 - 2 * w));
    });
    prox.ativo = true;
  }

  /*
   * ---------- 4. o respiro: o <heild-logo> respira sozinho, e a palavra da fase acompanha a logo ----------
   * Enquanto o capítulo está preso, a logo toca play() em loop, com os tempos do próprio componente
   * (contração 160 ms, divisão 1000 ms, a pausa da forma, retorno 900 ms) e 1,1 s de repouso entre um
   * respiro e outro. A rolagem só escolhe a forma do próximo respiro (nunca corta um no meio).
   * A palavra lê o estado do componente (_anim, _t0 e _lastL, o afastamento real de HE e LD) a cada quadro:
   *   contração  começa no repouso, como quem toma ar, e pesa até 900 na contração de verdade;
   *   divisão    perde peso enquanto as letras da logo se afastam;
   *   pausa      fina, e respira num leve vaivém de peso no ritmo da pausa;
   *   retorno    ganha peso enquanto HE e LD voltam.
   * O espaçamento das letras segue _lastL. A troca de palavra é uma passagem no tempo, com easing: a
   * seguinte sobe enquanto a anterior sai.
   */
  var RESPIROS = [
    // pausa e afastamento máximo de HE e LD (unidades do viewBox) vêm das formas do componente
    { forma: 'centralizar', desc: 'Centralizar: grade de 9 pontos que volta a ser uma peça só. Pausa de 1900 ms.', pausa: 1900, afasta: 94 },
    { forma: 'ia', desc: 'IA: três cópias do I em leque que giram 60°. Pausa de 2000 ms.', pausa: 2000, afasta: 100 },
    // orbs: no componente, a mitose em três ocupa os primeiros 1600 ms da pausa e a fusão os últimos 1200 ms
    // (ORBS_DIV e ORBS_FUSE): a palavra diz divisão e retorno quando é isso que se vê
    { forma: 'orbs', desc: 'Orbs: o orb se divide como uma célula em três e, na volta, se funde.', pausa: 5400, afasta: 232, divideNaPausa: 1600, juntaNaPausa: 1200 }
  ];
  var CONTRAI = 160, DIVIDE = 1000, VOLTA = 900, REPOUSO = 1100, ANTECIPA = 900;
  var NOMES_FASE = ['contracao', 'divisao', 'pausa', 'retorno'];
  var resp = null;
  function iniciarRespiro() {
    var pal = q('.cap-respiro .palco'); if (!pal) return;
    resp = { pal: pal, logo: q('.logo-respiro', pal), fases: {}, pres: {}, dir: {}, desc: q('.legenda-respiro .desc', pal), n: q('.legenda-respiro .n', pal),
      pontos: qa('.respiros li', pal), tocando: false, proxima: 0, atual: null, faseAntes: '', tAnt: 0,
      linhas: qa('.tabela-tempos li', pal.closest('.cap')), linhaAtual: '' };
    qa('.fase', pal).forEach(function (f) { var k = f.getAttribute('data-fase'); resp.fases[k] = f; resp.pres[k] = 0; resp.dir[k] = 1; });
  }
  /* a fase em que a logo está agora, lida do próprio componente */
  function faseDaLogo(agora) {
    var l = resp.logo, R = resp.atual;
    if (l._anim && R && l._anim === R.forma) {
      var t = agora - l._t0;
      var fimDiv = DIVIDE + (R.divideNaPausa || 0), iniVolta = DIVIDE + R.pausa - (R.juntaNaPausa || 0), fim = DIVIDE + R.pausa + VOLTA;
      if (t >= 0 && t < CONTRAI) return { fase: 'contracao', q: 1 };
      if (t >= CONTRAI && t < fimDiv) return { fase: 'divisao', q: (t - CONTRAI) / (fimDiv - CONTRAI) };
      if (t >= fimDiv && t < iniVolta) return { fase: 'pausa', q: (t - fimDiv) / (iniVolta - fimDiv) };
      if (t >= iniVolta && t < fim) return { fase: 'retorno', q: (t - iniVolta) / (fim - iniVolta) };
    }
    // repouso: se outro respiro vem aí, é a contração começando (a logo toma ar)
    if (resp.zona >= 0 && !resp.tocando && resp.proxima - agora < ANTECIPA) return { fase: 'contracao', q: clamp(1 - (resp.proxima - agora) / ANTECIPA, 0, 1) };
    return { fase: '', q: 0 };
  }
  function quadroRespiro(p, perto, agora) {
    if (!resp) return;
    var zona = p > 0.26 && p < 0.97 ? Math.min(RESPIROS.length - 1, Math.floor((p - 0.26) / 0.71 * RESPIROS.length)) : -1;
    if (zona >= 0 && resp.zona < 0 && !resp.tocando) resp.proxima = agora + 700; // ao chegar, toma ar antes do primeiro
    resp.zona = zona;
    // o loop: um respiro de cada vez; o seguinte usa a forma da zona em que a rolagem estiver
    if (perto && zona >= 0 && !resp.tocando && agora >= resp.proxima) {
      var R = RESPIROS[zona], self = resp;
      resp.atual = R; resp.tocando = true;
      var pr = resp.logo.play(R.forma);
      if (pr && pr.then) pr.then(function () { self.tocando = false; self.proxima = performance.now() + REPOUSO; });
      resp.n.textContent = String(zona + 1); resp.desc.textContent = R.desc;
      resp.pontos.forEach(function (li, j) { li.className = j < zona ? 'feito' : j === zona ? 'agora' : ''; });
    }
    // longe, ou de volta acima da máscara de entrada: o respiro para (a logo volta à pílula, como o campo a deixou)
    if ((!perto || p < 0.2) && resp.tocando) { resp.logo.stop(); resp.tocando = false; }
    if (!perto) return;
    var dt = Math.min(0.05, Math.max(0, (agora - (resp.tAnt || agora)) / 1000)); resp.tAnt = agora;
    var F = faseDaLogo(agora), afasta = resp.atual ? resp.atual.afasta : 100;
    var abre = clamp((resp.logo._lastL || 0) / afasta, 0, 1); // 0 com a pílula fechada, 1 com HE e LD afastados ao máximo
    // a tabela dos tempos acende a linha da fase real (e a da fusão, que acontece na divisão e no retorno)
    var linha = F.fase || (zona >= 0 && !resp.tocando ? 'repouso' : '');
    if (linha !== resp.linhaAtual) {
      resp.linhaAtual = linha;
      resp.linhas.forEach(function (li) { var f = li.getAttribute('data-fase'); li.classList.toggle('agora', f === linha || (f === 'fusao' && (linha === 'divisao' || linha === 'retorno'))); });
    }
    if (F.fase !== resp.faseAntes) {
      if (F.fase === 'divisao') { G.Som.respiro(true); G.Som.nota(RESPIROS.indexOf(resp.atual) * 2 + 2, 0.6); }
      if (F.fase === 'retorno') G.Som.respiro(false);
      resp.faseAntes = F.fase;
    }
    var s = function (x) { return x * x * (3 - 2 * x); }, tt = agora / 1000;
    var peso = {
      contracao: 300 + 600 * s(F.fase === 'contracao' ? F.q : 1),
      divisao: 900 - 650 * s(F.fase === 'divisao' ? F.q : 1),
      pausa: 210 + 70 * Math.sin(tt * Math.PI * 2 / 1.8),
      retorno: 230 + 220 * s(F.fase === 'retorno' ? F.q : 0)
    };
    var k = 1 - Math.exp(-dt / 0.13);
    NOMES_FASE.forEach(function (nome) {
      var alvo = nome === F.fase ? 1 : 0, el = resp.fases[nome];
      if (alvo !== (resp.dir[nome] > 0 ? 1 : 0)) resp.dir[nome] = alvo ? 1 : -1;
      resp.pres[nome] += (alvo - resp.pres[nome]) * k;
      var pv = resp.pres[nome];
      if (pv < 0.002 && !alvo) { if (el.style.opacity !== '0') el.style.opacity = '0'; return; }
      var e = s(clamp(pv, 0, 1)), entra = resp.dir[nome] > 0;
      // entra subindo de baixo; a que sai sobe e se apaga mais depressa, para as duas não se encavalarem
      el.style.opacity = (entra ? e : Math.pow(e, 2.6)).toFixed(3);
      el.style.transform = 'translate3d(0,' + ((1 - e) * (entra ? 0.42 : -0.5)).toFixed(3) + 'em,0)';
      el.style.fontWeight = Math.round(peso[nome]);
      el.style.letterSpacing = (-0.045 + 0.13 * abre).toFixed(4) + 'em';
    });
  }

  /*
   * ---------- os orbs: a luz do time e os treze integrantes ----------
   * A luz é o único gradiente de cor da marca (como no hero do site): uma mancha por integrante, espalhadas,
   * que se juntam numa faixa. Depois a faixa vira os treze orbs, em roda, com o Assistente no meio. Passar o
   * cursor, focar ou tocar num orb diz quem é; os sete estados mudam a reação de todos, sempre com a palavra.
   * Um mundo escuro nos dois temas: a soma das luzes só se vê no escuro.
   */
  // ordem em roda: pelo matiz; o Assistente (a cor de contraste do tema) fica no meio
  var RODA = ['societario', 'bpo_pagar', 'fiscal', 'notas', 'financeiro', 'bpo_receber', 'contabil', 'atendimento', 'dp', 'bpo_conciliacao', 'consultor', 'bpo_gerencial', 'assistente'];
  var luz = null;
  function iniciarLuz() {
    var pal = q('.cap-luz .palco'); if (!pal) return;
    var caixaL = q('.luzes', pal), caixaP = q('.presencas', pal), leg = q('.legenda-time', pal);
    luz = { pal: pal, cores: [], orbs: [], t0: performance.now(), leg: leg, estado: 'disponivel' };
    RODA.forEach(function (id, i) {
      var it = G.porId[id];
      var s2 = document.createElement('span'); s2.className = 'luz-cor'; s2.style.setProperty('--c', 'var(' + it.cor + ')'); caixaL.appendChild(s2);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'presenca'; b.setAttribute('data-cursor', 'anel');
      b.setAttribute('aria-label', it.nome + ': ' + it.faz);
      var o = document.createElement('orb-avatar');
      o.setAttribute('size', FINO ? '62' : '44'); o.setAttribute('mode', 'follow'); o.setAttribute('label', it.nome);
      o.setAttribute('data-cor', it.cor); if (it.olho) o.setAttribute('data-olho', it.olho);
      if (parado) o.setAttribute('static', ''); else { o.setAttribute('alive', ''); o.setAttribute('idle-time', String(11 + (i * 7) % 13)); o.setAttribute('emotes', 'shifty cheeky peekaboo'); o.setAttribute('sleep-after', '0'); }
      b.appendChild(o); caixaP.appendChild(b);
      var dizer = function () { legenda(it); };
      b.addEventListener('click', function () { if (o.poke) o.poke(); G.Som.toque(); G.Som.nota(i, 0.5); dizer(); });
      b.addEventListener('pointerenter', dizer); b.addEventListener('focus', dizer);
      luz.cores.push({ el: s2, fase: i * 1.37 }); luz.orbs.push({ el: b, orb: o, fase: i * 0.91 });
    });
    // os sete estados: cada um muda a reação de todos, e a palavra fica marcada
    var chips = q('.chips-estados', pal);
    if (chips) G.ESTADOS.forEach(function (e) {
      var c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = e.nome;
      c.setAttribute('aria-pressed', e.id === luz.estado ? 'true' : 'false');
      c.addEventListener('click', function () {
        luz.estado = e.id;
        qa('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        luz.orbs.forEach(function (ob) { if (ob.orb.react) ob.orb.react(e.reacao); else ob.orb.setAttribute('reaction', e.reacao); });
        if (luz.leg) { q('.quem', luz.leg).textContent = e.nome; q('.token', luz.leg).textContent = e.faz; q('.faz', luz.leg).textContent = e.quando; }
        G.Som.nota(G.ESTADOS.indexOf(e) + 2, 0.5);
      });
      chips.appendChild(c);
    });
    legenda(G.porId.assistente);
    colorirOrbs();
  }
  function legenda(it) {
    if (!luz || !luz.leg) return;
    q('.quem', luz.leg).textContent = it.nome; q('.token', luz.leg).textContent = it.cor.replace(/^--/, ''); q('.faz', luz.leg).textContent = it.faz;
  }
  function colorirOrbs() {
    qa('orb-avatar[data-cor]').forEach(function (o) {
      var cs = getComputedStyle(o), c = cs.getPropertyValue(o.getAttribute('data-cor')).trim();
      if (c && o.getAttribute('color') !== c) o.setAttribute('color', c);
      var olho = o.getAttribute('data-olho');
      if (olho) { var e = cs.getPropertyValue(olho).trim(); if (e && o.getAttribute('eye-color') !== e) o.setAttribute('eye-color', e); }
    });
  }
  function quadroLuz(p, agora) {
    if (!luz) return;
    var W = luz.pal.clientWidth, Hh = luz.pal.clientHeight, cel = W < 720;
    var cx = cel ? W * 0.5 : W * 0.66, cy = cel ? Hh * 0.6 : Hh * 0.52, t = parado ? 0 : (agora - luz.t0) / 1000;
    // espalhadas → faixa (0,18 a 0,42) → treze orbs em roda (0,62 a 0,82)
    var junta = suave(faixa(p, 0.16, 0.42)), presenca = suave(faixa(p, 0.62, 0.82));
    if (parado) { junta = 1; presenca = 1; }
    if (parado && cel) { var tx = q('.texto-luz', luz.pal); if (tx) cy = Math.max(cy, tx.offsetTop + tx.offsetHeight + Hh * 0.2 + 40); }
    var rx = cel ? W * 0.38 : Math.min(W * 0.2, Hh * 0.42), ry = cel ? Hh * 0.2 : Hh * 0.3, faixaL = Math.min(W * (cel ? 0.9 : 0.62), 1100);
    var base = Math.min(W, Hh), tam = lerp(lerp(0.4, 0.36, junta), cel ? 0.3 : 0.22, presenca) * base;
    var n = RODA.length;
    for (var i = 0; i < n; i++) {
      // espalhadas pela tela, numa elipse larga
      // (no desktop, a elipse fica à direita do texto: a luz não passa por baixo do título)
      var ang = i / n * Math.PI * 2 + 0.6, sx = cx + Math.cos(ang) * W * (cel ? 0.42 : 0.24), sy = cy + Math.sin(ang) * Hh * (cel ? 0.42 : 0.36);
      // a faixa, como no hero do site; a do Assistente fica no meio
      var bx = cx + ((i === n - 1 ? (n - 2) / 2 : i) / (n - 2) - 0.5) * faixaL, by = cy;
      // a roda: doze em volta, a clara no meio
      var ca = i / (n - 1) * Math.PI * 2 - Math.PI / 2, px = i === n - 1 ? cx : cx + Math.cos(ca) * rx, py = i === n - 1 ? cy : cy + Math.sin(ca) * ry;
      var flut = parado ? 0 : 1, fx = Math.sin(t * 0.6 + luz.orbs[i].fase) * 7 * flut, fy = Math.cos(t * 0.5 + luz.orbs[i].fase * 1.3) * 6 * flut;
      var lx = lerp(lerp(sx, bx, junta), px, presenca) + fx, ly = lerp(lerp(sy, by, junta), py, presenca) + fy * (0.4 + presenca);
      var c = luz.cores[i].el, o = luz.orbs[i].el;
      var op = (i === n - 1 ? 0.45 : 0.6) * clamp(p * 14, 0, 1) * lerp(1, 0.5, presenca);
      c.style.transform = 'translate3d(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px,0)';
      c.style.setProperty('--tam', tam.toFixed(0) + 'px'); c.style.opacity = op.toFixed(3);
      var s = o.offsetWidth || 62;
      o.style.transform = 'translate3d(' + (lx - s / 2).toFixed(1) + 'px,' + (ly - s / 2).toFixed(1) + 'px,0) scale(' + lerp(0.4, 1, presenca).toFixed(3) + ')';
      o.style.opacity = presenca.toFixed(3);
      o.style.pointerEvents = presenca > 0.6 ? 'auto' : 'none';
      o.tabIndex = presenca > 0.6 ? 0 : -1;
    }
  }

  /* ---------- 8. o inteiro: a pílula vira a logo, e a logo respira ---------- */
  var fim = null, CICLO = ['centralizar', 'orbs', 'orb', 'ia', 'atendimento'];
  function iniciarFim() {
    var l = q('.logo-fim'); if (!l) return;
    fim = { logo: l, tocou: false, k: 0 };
    var tocar = function () { if (parado) return; var f = CICLO[fim.k++ % CICLO.length]; l.play(f); G.Som.nota(fim.k + 3, 0.7); };
    l.addEventListener('click', tocar);
    l.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tocar(); } });
    fim.tocar = tocar;
  }
  function quadroFim(p) {
    if (!fim || parado) return;
    if (p > 0.44 && !fim.tocou) { fim.tocou = true; fim.k = 0; fim.tocar(); }
    if (p < 0.2) fim.tocou = false;
  }

  /* ---------- o topo, a linhagem e o progresso ---------- */
  var topo = q('.topo'), linhagem = q('.linhagem'), elos = qa('.linhagem a'), barra = q('.progresso');
  function atualizarMoldura(y) {
    var meio = y + vh * 0.5, ativo = CAPS[0];
    CAPS.forEach(function (c) { if (meio >= c.topo) ativo = c; });
    if (ativo !== M.ativo) {
      M.ativo = ativo;
      elos.forEach(function (a) { if ((' ' + a.getAttribute('data-grupo') + ' ').indexOf(' ' + ativo.id + ' ') >= 0) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
      // nunca duas logos animando na mesma tela: a do topo sai quando a grande está em cena
      topo.classList.toggle('sem-logo', ['logo', 'tempos', 'formas', 'fecho'].indexOf(ativo.id) >= 0);
      if (M.ativoAntes) G.Som.nota(CAPS.indexOf(ativo), 0.45);
      M.ativoAntes = ativo;
    }
    // sobre uma seção de leitura, o topo fica sólido, com a borda embaixo (marca-e-site: a barra fixa não cobre o conteúdo)
    var sobTopo = null; CAPS.forEach(function (c) { if (y + 40 >= c.topo) sobTopo = c; });
    topo.classList.toggle('solido', !!(sobTopo && sobTopo.fluxo));
    // sobre o mundo escuro da luz, o topo e o cursor trocam de tinta
    var lz = CAP.orbs, cobreTopo = lz && y + 32 >= lz.topo && y + 32 <= lz.topo + lz.altura;
    topo.classList.toggle('forca-escuro', !!cobreTopo); linhagem.classList.toggle('forca-escuro', !!(lz && meio >= lz.topo && meio <= lz.topo + lz.altura));
    var py = ponteiro.y > -900 ? ponteiro.y : vh / 2;
    raiz.classList.toggle('no-escuro', !!(lz && y + py >= lz.topo && y + py <= lz.topo + lz.altura));
    if (barra) barra.style.setProperty('--prog', clamp(y / Math.max(1, docH - vh), 0, 1).toFixed(4));
  }

  /* ---------- o laço ---------- */
  var raf = 0, ganchos = [];
  function quadro(agora) {
    raf = requestAnimationFrame(quadro);
    var y = window.scrollY, dt = Math.max(1, agora - (M.tAnt || agora - 16));
    var inst = (y - M.yAnt) / dt * 1000; M.vel = M.vel * 0.82 + inst * 0.18; M.yAnt = y; M.tAnt = agora;
    if (Math.abs(M.vel) < 1) M.vel = 0;
    var mexeu = y !== M.y || M.mudou;
    if (mexeu) {
      M.y = y;
      CAPS.forEach(function (c) {
        var p = clamp((y - c.topo) / Math.max(1, c.altura - vh), 0, 1);
        if (p !== c.p) { c.p = p; if (!TIMELINE) c.el.style.setProperty('--p', p.toFixed(4)); }
        // depois do fim do capítulo o palco solta e sobe: o texto se apaga no primeiro quarto da subida, antes de passar sob o topo
        var saida = c.fluxo ? 0 : clamp((y - (c.topo + c.altura - vh)) / (vh * 0.25), 0, 1);
        if (saida !== c.saida) { c.saida = saida; c.palco.style.setProperty('--saida', saida.toFixed(3)); }
      });
      atualizarMoldura(y);
      M.mudou = false;
    }
    G.Som.rolagem(M.vel);
    var perto = function (c) { return y + vh > c.topo - vh * 0.2 && y < c.topo + c.altura + vh * 0.2; };
    if (CAP.ideia && perto(CAP.ideia)) quadroProximidade(CAP.ideia.p);
    if (CAP.tempos) quadroRespiro(CAP.tempos.p, perto(CAP.tempos), agora);
    if (CAP.orbs && perto(CAP.orbs)) quadroLuz(CAP.orbs.p, agora);
    if (CAP.fecho) quadroFim(CAP.fecho.p);
    for (var gi = 0; gi < ganchos.length; gi++) ganchos[gi](agora, y, perto);
    if (campo && prontas) {
      var vivoPont = agora - ponteiro.t < 4200;
      if (mexeu || vivoPont || !campo.assentado || Math.abs(M.vel) > 0) {
        campo.assentado = !campo.quadro(agora, estadoCampo(y, agora));
      }
      campo.governar(dt, agora);
    }
  }

  /* ---------- tema, som, toque ---------- */
  function escuroAgora() { var t = raiz.getAttribute('data-theme'); return t ? t === 'dark' : DMQ.matches; }
  function aoTrocarTema() {
    lerCores(); colorirOrbs();
    if (campo) { campo.forcar = true; campo.assentado = false; }
    if (parado) desenharEstaticos();
  }
  function ligarControles() {
    q('[data-acao="tema"]').addEventListener('click', function () {
      raiz.setAttribute('data-theme', escuroAgora() ? 'light' : 'dark');
      requestAnimationFrame(aoTrocarTema);
    });
    var bs = q('[data-acao="som"]');
    bs.addEventListener('click', function () {
      var on = G.Som.alternar();
      bs.setAttribute('aria-pressed', on ? 'true' : 'false'); bs.setAttribute('aria-label', on ? 'Desligar o som' : 'Ligar o som');
      if (on) G.Som.nota(4, 0.6);
    });
    if (DMQ.addEventListener) DMQ.addEventListener('change', function () { requestAnimationFrame(aoTrocarTema); });
    var mover = function (e) { ponteiro.x = e.clientX; ponteiro.y = e.clientY; ponteiro.t = performance.now(); ponteiro.toque = e.pointerType !== 'mouse'; if (campo) campo.assentado = false; };
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('pointerdown', mover, { passive: true });
    document.addEventListener('pointerleave', function () { ponteiro.t = -1e9; });
    // a linhagem e os links internos rolam até o começo do capítulo
    qa('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var alvo = CAP[a.getAttribute('href').slice(1)]; if (!alvo) return;
        e.preventDefault();
        var destino = alvo.id === 'nome' ? 0 : alvo.fluxo ? alvo.topo : alvo.topo + (alvo.altura - vh) * 0.12;
        window.scrollTo({ top: destino, behavior: parado ? 'auto' : 'smooth' });
      });
    });
    if (!FINO) { var d = q('.dica-grade'); if (d) d.textContent = 'Toque no chão.'; }
  }

  /* ---------- movimento reduzido: cada figura parada, desenhada uma vez ---------- */
  function desenharEstaticos() {
    lerCores();
    var F = G.F, cor = COR.primaria;
    var item = function (sel, gerar, c) {
      var cv = q(sel); if (!cv) return;
      var r = cv.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
      var res = gerar({ x: 0, y: 0, w: r.width, h: r.height });
      G.desenharEstatico(cv, res.f, c || cor);
      return res;
    };
    item('.figura-palavra canvas', function (b) { return F.palavra(b, 1800, 900); });
    item('.cap-partes .figura-pilula canvas', function (b) { return F.pilulaCheia(b, 1400); });
    var g9 = item('.cap-pilula .figura-pilula canvas', function (b) { return F.grade9(b, 40); });
    var cot = q('.cotas'); if (cot && g9 && g9.mapa) cot.style.setProperty('--S', g9.mapa.S.toFixed(4));
    // parada, a grade também abre uma área lisa sob o texto
    var cvg = q('.cap-grade .figura-tela canvas'), txg = q('.cap-grade .texto-grade'), ev = [];
    if (cvg && txg) { var rc = cvg.getBoundingClientRect(), rt = txg.getBoundingClientRect(); ev.push({ x: rt.left - rc.left, y: rt.top - rc.top, w: rt.width, h: rt.height }); }
    item('.cap-grade .figura-tela canvas', function (b) { return F.grade(b, 5000, ev); }, COR.suave);
    // o respiro: as três formas paradas
    var box = q('.estatico-respiros');
    if (box && !box.children.length) {
      RESPIROS.forEach(function (r, i) {
        var fig = document.createElement('figure');
        fig.innerHTML = '<heild-logo label="Heild, ' + (i + 1) + 'º respiro"></heild-logo><figcaption>' + r.desc + '</figcaption>';
        box.appendChild(fig);
        var l = q('heild-logo', fig); requestAnimationFrame(function () { if (l.morph) l.morph(r.forma); });
      });
    }
    if (luz) quadroLuz(1, 0);
  }

  /* ---------- começo ---------- */
  function iniciar() {
    medir(); lerCores();
    iniciarProximidade(); iniciarRespiro(); iniciarLuz(); iniciarFim(); ligarControles();
    if (parado) {
      var fontesP = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fontesP.then(function () { medir(); desenharEstaticos(); });
      var tm = 0; window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(function () { medir(); desenharEstaticos(); }, 200); });
      CAPS.forEach(function (c) { c.p = 1; });
      atualizarMoldura(window.scrollY);
      window.addEventListener('scroll', function () { medir(); atualizarMoldura(window.scrollY); }, { passive: true });
      return;
    }
    criarCampo(); t0campo = performance.now();
    var fontes = document.fonts ? Promise.all([
      document.fonts.load('italic 100 100px "PP Neue Montreal"'), document.fonts.load('italic 900 100px "PP Neue Montreal"'), document.fonts.ready
    ]) : Promise.resolve();
    Promise.race([fontes, new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
      medir(); gerarFormacoes(); t0campo = performance.now();
    });
    var tm2 = 0, ultW = vw, ultH = vh;
    window.addEventListener('resize', function () {
      clearTimeout(tm2);
      tm2 = setTimeout(function () {
        var w = window.innerWidth, h = window.innerHeight;
        medir();
        // a barra do navegador do celular sobe e desce: só refaz o campo se a tela mudou de verdade
        if (w !== ultW || Math.abs(h - ultH) > 140) { ultW = w; ultH = h; if (campo) { campo.redimensionar(vw, vh, dpr); gerarFormacoes(); campo.assentado = false; } }
      }, 160);
    });
    if (window.ResizeObserver) new ResizeObserver(function () { medir(); }).observe(document.querySelector('.peca'));
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { M.tAnt = 0; if (campo) campo.ultimo = 0; } });
    raf = requestAnimationFrame(quadro);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  /* para o script da página (diretrizes.js): o mesmo laço, os capítulos, o ponteiro e o modo parado */
  G.motor = { medir: medir, CAPS: CAPS, CAP: CAP, estado: M, ponteiro: ponteiro, parado: parado, fino: FINO, campo: function () { return campo; },
    aoQuadro: function (fn) { ganchos.push(fn); }, colorirOrbs: function () { colorirOrbs(); } };
})();
