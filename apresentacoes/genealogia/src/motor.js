/*
 * Genealogia do inteiro — o motor.
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
  var CAPS = qa('.cap').map(function (el) { return { el: el, id: el.id, palco: q('.palco', el), topo: 0, altura: 0, p: -1 }; });
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
   * [capítulo, p, formação, fusão (fração da escala da formação), cor, opacidade, deriva, cursor]
   * Entre duas chaves, as cápsulas vão de uma formação à outra em cascata; a fusão sobe e desce junto.
   */
  var CHAVES = [
    ['palavra', 0.00, 'palavraFina', 0.03, 'primaria', 1, 0, 1],
    ['palavra', 0.72, 'palavraCheia', 1.4, 'primaria', 1, 0, 1],
    ['partes', 0.10, 'muitos', 0.0, 'primaria', 1, 1, 1.2],
    ['partes', 0.46, 'muitos', 0.0, 'primaria', 1, 1, 1.2],
    ['partes', 0.86, 'pilulaCheia', 1.0, 'primaria', 1, 0, 0],
    ['pilula', 0.06, 'pilulaUnica', 0.3, 'primaria', 1, 0, 0],
    ['pilula', 0.34, 'pilulaUnica', 0.04, 'primaria', 1, 0, 0],
    ['pilula', 0.42, 'contracao', 0.04, 'primaria', 1, 0, 0],
    ['pilula', 0.62, 'grade9', 0.75, 'primaria', 1, 0, 0],
    ['pilula', 0.76, 'grade9', 0.02, 'primaria', 1, 0, 0],
    ['respiro', 0.03, 'grade9', 0.02, 'primaria', 1, 0, 0],
    ['respiro', 0.17, 'marca', 0.95, 'primaria', 1, 0, 0],
    ['respiro', 0.24, 'marca', 0.5, 'primaria', 0, 0, 0],
    ['respiro', 0.45, 'graos', 0.0, 'areia', 0, 1, 0],
    ['respiro', 1.00, 'graos', 0.0, 'areia', 0, 1, 0],
    ['areia', 0.08, 'graos', 0.0, 'areia', 1, 1, 0.6],
    ['areia', 0.42, 'estratos', 0.0, 'areia', 1, 0, 0],
    ['areia', 0.78, 'superficie', 1.0, 'chao', 1, 0, 0],
    ['areia', 1.00, 'superficie', 1.0, 'chao', 1, 0, 0],
    ['grade', 0.16, 'grade', 0.0, 'suave', 1, 0, 1],
    ['grade', 1.00, 'grade', 0.0, 'suave', 1, 0, 1],
    ['luz', 0.10, 'grade', 0.0, 'suave', 0, 0, 0],
    ['inteiro', 0.02, 'muitosFim', 0.0, 'primaria', 0, 1, 0],
    ['inteiro', 0.12, 'muitosFim', 0.0, 'primaria', 1, 1, 0],
    ['inteiro', 0.30, 'pilulaFinal', 1.0, 'primaria', 1, 0, 0],
    ['inteiro', 0.40, 'pilulaFinal', 0.3, 'primaria', 0, 0, 0]
  ];
  /* o cursor em cada formação: raio, força de empurrar, quanto cresce, quanto derrete */
  var CURSOR = {
    palavraFina: { r: 120, f: 1, cresce: 0, k: 12 }, palavraCheia: { r: 120, f: 1, cresce: 0, k: 12 },
    muitos: { r: 170, f: 1.2, cresce: 0, k: 0 }, graos: { r: 150, f: 0.9, cresce: 0, k: 0 },
    grade: { r: 170, f: 0.45, cresce: 2.2, k: 0 }
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
    var lp = q('.cap-respiro heild-logo'), lf = q('.cap-inteiro heild-logo');
    var pil = F.pilulaUnica(figura('pilula'), n);
    var forms = {
      palavraFina: F.palavra(cpal, n, 100, tam),
      palavraCheia: F.palavra(cpal, n, 900, tam),
      muitos: F.muitos(tela, n, evitar('partes'), 23),
      pilulaCheia: F.pilulaCheia(figura('pilula-partes'), n),
      pilulaUnica: pil,
      contracao: F.contracao(figura('pilula'), n),
      grade9: F.grade9(figura('pilula'), n),
      marca: F.marca(noPalco(lp), n),
      graos: F.graos(tela, n),
      estratos: F.estratos(tela, n),
      superficie: F.superficie(tela, n),
      grade: F.grade(tela, n, evitar('grade')),
      muitosFim: F.muitos(tela, n, [], 97),
      pilulaFinal: F.pilulaFinal(noPalco(lf), n)
    };
    campo.formacoes(forms);
    var cot = q('.cotas'); if (cot && pil.mapa) cot.style.setProperty('--S', pil.mapa.S.toFixed(4));
    prontas = true;
  }
  /* em que ponto da linha do tempo a rolagem está */
  function estadoCampo(y, agora) {
    var ys = CHAVES.map(function (k) { var c = CAP[k[0]]; return c.topo + k[1] * Math.max(1, c.altura - vh); });
    var i = 0; while (i < CHAVES.length - 2 && y >= ys[i + 1]) i++;
    var A = CHAVES[i], B = CHAVES[i + 1], t = clamp((y - ys[i]) / Math.max(1, ys[i + 1] - ys[i]), 0, 1);
    var fA = campo.forms[A[2]], fB = campo.forms[B[2]];
    var corA = COR[A[4]], corB = COR[B[4]], ts = suave(t);
    var velK = Math.min(1, Math.abs(M.vel) / 2600) * 0.7;
    var kA = 0.9 + (A[3] + velK) * fA.esc, kB = 0.9 + (B[3] + velK) * fB.esc;
    var dono = t < 0.5 ? A : B, cfg = CURSOR[dono[2]], forcaCursor = lerp(A[7], B[7], ts);
    var vivoPont = agora - ponteiro.t < (ponteiro.toque ? 1400 : 4000) && ponteiro.x > -900;
    var molaK = Math.min(1, 0.12 + (agora - t0campo) / 2600);
    return {
      a: A[2], b: B[2], t: t, kA: kA, kB: kB,
      cor: [lerp(corA[0], corB[0], ts), lerp(corA[1], corB[1], ts), lerp(corA[2], corB[2], ts)],
      opac: lerp(A[5], B[5], ts), deriva: lerp(A[6], B[6], ts), molaK: molaK,
      cursor: cfg && vivoPont && forcaCursor > 0 ? { x: ponteiro.x, y: ponteiro.y, forca: forcaCursor * cfg.f, r: cfg.r, cresce: cfg.cresce } : null,
      kCursor: cfg ? cfg.k : 0,
      pocos: dono[2] === 'grade' && B[5] > 0 ? pocosGrade(agora) : null
    };
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

  /* ---------- 4. o respiro: a rolagem leva o <heild-logo> por contração, divisão, pausa e retorno ---------- */
  var RESPIROS = [
    { forma: 'centralizar', desc: 'nove pontos que voltam a ser uma peça só' },
    { forma: 'ia', desc: 'três cópias do I, em leque, que giram' },
    { forma: 'orbs', desc: 'um orb que se divide como uma célula, em três' }
  ];
  var FASES = [['contracao', 0], ['divisao', 0.14], ['pausa', 0.46], ['retorno', 0.78]];
  var resp = null;
  function iniciarRespiro() {
    var pal = q('.cap-respiro .palco'); if (!pal) return;
    resp = { pal: pal, logo: q('.logo-respiro', pal), fases: {}, desc: q('.legenda-respiro .desc', pal), n: q('.legenda-respiro .n', pal), pontos: qa('.respiros li', pal), chave: '', alvo: undefined };
    qa('.fase', pal).forEach(function (f) {
      var ls = dividirLetras(f, false), meio = (ls.length - 1) / 2;
      ls.forEach(function (l, i) { l.style.setProperty('--d', (i - meio).toFixed(2)); });
      resp.fases[f.getAttribute('data-fase')] = f;
    });
  }
  function quadroRespiro(p, perto) {
    if (!resp) return;
    var dentro = p > 0.26 && p < 0.97, i = -1, fase = '', qf = 0;
    if (dentro) {
      var b = (p - 0.26) / 0.71 * RESPIROS.length; i = Math.min(RESPIROS.length - 1, Math.floor(b)); var lb = b - i;
      for (var k = FASES.length - 1; k >= 0; k--) if (lb >= FASES[k][1]) { fase = FASES[k][0]; var fim = k + 1 < FASES.length ? FASES[k + 1][1] : 1; qf = (lb - FASES[k][1]) / (fim - FASES[k][1]); break; }
    }
    resp.pal.style.setProperty('--q', qf.toFixed(3));
    var chave = i + ':' + fase;
    if (chave !== resp.chave) {
      var antes = resp.chave.split(':')[1];
      if (antes && resp.fases[antes]) { resp.fases[antes].classList.remove('ativa'); resp.fases[antes].classList.add('saindo'); }
      Object.keys(resp.fases).forEach(function (k2) { if (k2 !== antes) resp.fases[k2].classList.remove('saindo'); });
      if (fase && resp.fases[fase]) { resp.fases[fase].classList.remove('saindo'); resp.fases[fase].classList.add('ativa'); }
      var alvo = fase === 'divisao' || fase === 'pausa' ? RESPIROS[i].forma : null;
      if (alvo !== resp.alvo && perto) {
        resp.logo.morph(alvo);
        if (fase === 'divisao') { G.Som.respiro(true); G.Som.nota(i * 2 + 2, 0.7); }
        if (fase === 'retorno') G.Som.respiro(false);
        resp.alvo = alvo;
      }
      if (i >= 0) { resp.n.textContent = String(i + 1); resp.desc.textContent = RESPIROS[i].desc; }
      resp.pontos.forEach(function (li, j) { li.className = j < i ? 'feito' : j === i ? 'agora' : ''; });
      resp.chave = chave;
    }
  }

  /* ---------- 7. a luz: as cores se abrem e se somam; na luz, as presenças ---------- */
  // ordem do matiz, como num espectro; o Assistente (a cor de contraste do tema) fica no meio
  var LUZES = ['--orb-societario', '--orb-bpo-pagar', '--orb-fiscal', '--orb-notas', '--orb-financeiro', '--orb-bpo-receber', '--orb-contabil',
    '--orb-atendimento', '--orb-dp', '--orb-bpo-conciliacao', '--orb-consultor', '--orb-bpo-gerencial', '--orb-assistente'];
  var luz = null;
  function iniciarLuz() {
    var pal = q('.cap-luz .palco'); if (!pal) return;
    var caixaL = q('.luzes', pal), caixaP = q('.presencas', pal);
    luz = { pal: pal, cores: [], orbs: [], t0: performance.now() };
    LUZES.forEach(function (tok, i) {
      var s = document.createElement('span'); s.className = 'luz-cor'; s.style.setProperty('--c', 'var(' + tok + ')'); caixaL.appendChild(s);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'presenca'; b.setAttribute('data-cursor', 'some');
      b.setAttribute('aria-label', i === 12 ? 'Uma presença, da cor clara do tema, no centro' : 'Uma presença, de uma cor só');
      var o = document.createElement('orb-avatar');
      o.setAttribute('size', FINO ? '62' : '44'); o.setAttribute('mode', 'follow'); o.setAttribute('label', 'Presença');
      o.setAttribute('data-cor', tok); if (i === 12) o.setAttribute('data-olho', '--olho-assistente');
      if (parado) o.setAttribute('static', ''); else { o.setAttribute('alive', ''); o.setAttribute('idle-time', String(11 + (i * 7) % 13)); o.setAttribute('emotes', 'shifty cheeky peekaboo'); o.setAttribute('sleep-after', '0'); }
      b.appendChild(o); caixaP.appendChild(b);
      b.addEventListener('click', function () { if (o.poke) o.poke(); G.Som.toque(); G.Som.nota(i, 0.5); });
      luz.cores.push({ el: s, fase: i * 1.37 }); luz.orbs.push({ el: b, orb: o, fase: i * 0.91 });
    });
    colorirOrbs();
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
    var cx = cel ? W * 0.5 : W * 0.64, cy = cel ? Hh * 0.6 : Hh * 0.52, t = parado ? 0 : (agora - luz.t0) / 1000;
    // parado no celular, os dois textos ficam empilhados no alto: a constelação desce para baixo deles
    if (parado && cel) { var tx = q('.texto-luz', luz.pal); if (tx) cy = Math.max(cy, tx.offsetTop + tx.offsetHeight + Hh * 0.2 + 40); }
    var abre = suave(faixa(p, 0.2, 0.36)), fecha = suave(faixa(p, 0.42, 0.56)), presenca = suave(faixa(p, 0.62, 0.82));
    if (parado) { abre = 0; fecha = 0; presenca = 1; }
    var raio = Math.min(W, Hh) * (cel ? 0.36 : 0.34), rx = cel ? W * 0.38 : Math.min(W * 0.27, Hh * 0.46), ry = cel ? Hh * 0.2 : Hh * 0.3;
    var tamBase = Math.min(W, Hh), tam = lerp(lerp(0.62, 0.42, abre * (1 - fecha)), cel ? 0.3 : 0.22, presenca) * tamBase;
    var n = LUZES.length;
    for (var i = 0; i < n; i++) {
      // o espectro: um leque de cores, como depois do prisma
      var ang = (-0.62 + 1.24 * (i / (n - 2))) * Math.PI / 2, ex = i === n - 1 ? cx : cx + Math.sin(ang) * raio * 1.05, ey = i === n - 1 ? cy : cy - Math.cos(ang) * raio * 0.55 + raio * 0.35;
      // a constelação: doze em volta, a clara no meio
      var ca = i / (n - 1) * Math.PI * 2 - Math.PI / 2, px = i === n - 1 ? cx : cx + Math.cos(ca) * rx, py = i === n - 1 ? cy : cy + Math.sin(ca) * ry;
      var flut = parado ? 0 : 1, fx = Math.sin(t * 0.6 + luz.orbs[i].fase) * 7 * flut, fy = Math.cos(t * 0.5 + luz.orbs[i].fase * 1.3) * 6 * flut;
      var lx = lerp(lerp(cx, ex, abre * (1 - fecha)), px, presenca) + fx * presenca, ly = lerp(lerp(cy, ey, abre * (1 - fecha)), py, presenca) + fy * presenca;
      var c = luz.cores[i].el, o = luz.orbs[i].el;
      var op = (i === n - 1 ? 0.5 : 0.62) * clamp(p * 14, 0, 1) * lerp(1, 0.5, presenca);
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
      elos.forEach(function (a) { if (a.getAttribute('href') === '#' + ativo.id) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
      // nunca duas logos na mesma tela: a do topo sai quando a grande está em cena
      topo.classList.toggle('sem-logo', ativo.id === 'respiro' || ativo.id === 'inteiro');
      if (M.ativoAntes) G.Som.nota(CAPS.indexOf(ativo), 0.45);
      M.ativoAntes = ativo;
    }
    // sobre o mundo escuro da luz, o topo e o cursor trocam de tinta
    var lz = CAP.luz, cobreTopo = lz && y + 32 >= lz.topo && y + 32 <= lz.topo + lz.altura;
    topo.classList.toggle('forca-escuro', !!cobreTopo); linhagem.classList.toggle('forca-escuro', !!(lz && meio >= lz.topo && meio <= lz.topo + lz.altura));
    var py = ponteiro.y > -900 ? ponteiro.y : vh / 2;
    raiz.classList.toggle('no-escuro', !!(lz && y + py >= lz.topo && y + py <= lz.topo + lz.altura));
    if (barra) barra.style.setProperty('--prog', clamp(y / Math.max(1, docH - vh), 0, 1).toFixed(4));
  }

  /* ---------- o laço ---------- */
  var raf = 0;
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
        // depois do fim do capítulo o palco solta e sobe: o texto se apaga na primeira metade da subida
        var saida = clamp((y - (c.topo + c.altura - vh)) / (vh * 0.45), 0, 1);
        if (saida !== c.saida) { c.saida = saida; c.palco.style.setProperty('--saida', saida.toFixed(3)); }
      });
      atualizarMoldura(y);
      M.mudou = false;
    }
    G.Som.rolagem(M.vel);
    var perto = function (c) { return y + vh > c.topo - vh * 0.2 && y < c.topo + c.altura + vh * 0.2; };
    if (CAP.partes && perto(CAP.partes)) quadroProximidade(CAP.partes.p);
    if (CAP.respiro) quadroRespiro(CAP.respiro.p, perto(CAP.respiro));
    if (CAP.luz && perto(CAP.luz)) quadroLuz(CAP.luz.p, agora);
    if (CAP.inteiro) quadroFim(CAP.inteiro.p);
    if (campo && prontas) {
      var vivoPont = agora - ponteiro.t < 4200;
      if (mexeu || vivoPont || !campo.assentado || Math.abs(M.vel) > 0) {
        campo.assentado = !campo.quadro(agora, estadoCampo(y, agora));
      }
      campo.governar(dt);
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
        var destino = alvo.id === 'palavra' ? 0 : alvo.topo + (alvo.altura - vh) * 0.12;
        window.scrollTo({ top: destino, behavior: parado ? 'auto' : 'smooth' });
      });
    });
    if (!FINO) { var d = q('.dica-grade'); if (d) d.textContent = 'Toque no chão.'; var dl = q('.dica-luz'); if (dl) dl.textContent = 'Toque num orb.'; }
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
    item('.cap-grade .figura-tela canvas', function (b) { return F.grade(b, 5000, []); }, COR.suave);
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
  G.motor = { medir: medir, CAPS: CAPS, estado: M, campo: function () { return campo; } };
})();
