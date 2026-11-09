/*
 * Do inteiro — o som (opcional, desligado até alguém pedir no cabeçalho).
 *
 * Tudo sintetizado na hora com Web Audio, sem arquivo:
 *   - um bordão grave na noite (fólios i a iii), mais claro e mais baixo no dia (v e vi);
 *   - a raspagem: um ruído filtrado que segue a velocidade do cursor no palimpsesto;
 *   - cada estrato achado: um toque que desce; cada par que se liga: dois tons que viram um;
 *   - a roda: um tique a cada casa; a aurora: um acorde que abre;
 *   - a obra: três tons, sal, mercúrio e enxofre, que começam dissonantes e, quanto mais a pessoa
 *     insiste, mais se afinam, até a consonância (o que soa à parte e o que soa junto, Heráclito B10);
 *   - o selo: um sino.
 * No fólio iv, o dos brancos, o silêncio é o estado: tudo se cala, mesmo com o som ligado.
 * O AudioContext só nasce dentro do clique no botão (regra de autoplay dos navegadores).
 */
(function () {
  'use strict';
  var I = window.Inteiro = window.Inteiro || {};
  var ctx = null, mestre = null, ligado = false, folio = 'limiar', bordao = null, raspa = null, trio = null;

  function criar() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    mestre = ctx.createGain(); mestre.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    mestre.connect(comp); comp.connect(ctx.destination);
    // o bordão: três senos, num passa-baixa
    bordao = { g: ctx.createGain(), lp: ctx.createBiquadFilter(), osc: [] };
    bordao.g.gain.value = 0; bordao.lp.type = 'lowpass'; bordao.lp.frequency.value = 380;
    [55, 82.41, 110.6].forEach(function (f, i) { var o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f; var g = ctx.createGain(); g.gain.value = i === 2 ? 0.25 : 0.5; o.connect(g); g.connect(bordao.lp); o.start(); bordao.osc.push(o); });
    bordao.lp.connect(bordao.g); bordao.g.connect(mestre);
    // a raspagem: ruído rosado aproximado, num passa-faixa
    var dur = 2, buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), d = buf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
    for (var i = 0; i < d.length; i++) { var w = Math.random() * 2 - 1; b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; d[i] = (b0 + b1 + b2 + w * 0.02) * 0.6; }
    var fonte = ctx.createBufferSource(); fonte.buffer = buf; fonte.loop = true;
    raspa = { g: ctx.createGain(), f: ctx.createBiquadFilter() };
    raspa.f.type = 'bandpass'; raspa.f.frequency.value = 1600; raspa.f.Q.value = 0.8; raspa.g.gain.value = 0;
    fonte.connect(raspa.f); raspa.f.connect(raspa.g); raspa.g.connect(mestre); fonte.start();
    // a obra: três tons
    trio = { g: ctx.createGain(), osc: [], base: [110, 164.81, 220], desvio: [-1.6, 1.1, 1.4] };
    trio.g.gain.value = 0;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    trio.base.forEach(function (f, i) { var o = ctx.createOscillator(); o.type = i === 1 ? 'triangle' : 'sine'; o.frequency.value = f; var g = ctx.createGain(); g.gain.value = [0.5, 0.32, 0.36][i]; o.connect(g); g.connect(lp); o.start(); trio.osc.push(o); });
    lp.connect(trio.g); trio.g.connect(mestre);
    return true;
  }
  function calado() { return !ligado || !ctx || folio === 'iv'; }
  function alvo(param, v, tc) { if (!ctx) return; param.cancelScheduledValues(ctx.currentTime); param.setTargetAtTime(v, ctx.currentTime, tc || 0.2); }
  function ajustarBordao() {
    if (!bordao) return;
    var noite = folio === 'limiar' || folio === 'i' || folio === 'ii' || folio === 'iii';
    var v = calado() ? 0 : noite ? 0.06 : 0.025;
    alvo(bordao.g.gain, v, folio === 'iv' ? 0.6 : 1.2);
    var mult = noite ? 1 : 2;
    bordao.osc.forEach(function (o, i) { alvo(o.frequency, [55, 82.41, 110.6][i] * mult, 1.5); });
  }
  function toque(f, dur, vol, tipo, atraso) {
    if (calado()) return;
    var t = ctx.currentTime + (atraso || 0), o = ctx.createOscillator(), g = ctx.createGain(), o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o.type = tipo || 'sine'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2.01; g2.gain.value = 0.16;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(mestre);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }

  I.Som = {
    get ligado() { return ligado; },
    alternar: function () {
      if (!ctx && !criar()) return false;
      ligado = !ligado;
      if (ctx.state === 'suspended') ctx.resume();
      alvo(mestre.gain, ligado ? 0.6 : 0, 0.1);
      ajustarBordao();
      return ligado;
    },
    acordar: function () { if (ctx && ctx.state === 'suspended' && ligado) ctx.resume(); },
    pausar: function (sim) { if (!ctx) return; if (sim) ctx.suspend(); else if (ligado) ctx.resume(); },
    desligar: function () { if (ctx) { alvo(mestre.gain, 0, 0.05); ligado = false; } },
    folio: function (id) {
      folio = id; ajustarBordao();
      if (trio && id !== 'v') alvo(trio.g.gain, 0, 0.3);
      if (raspa && id !== 'i') alvo(raspa.g.gain, 0, 0.1);
    },
    solve: function () { toque(220, 1.4, 0.12); toque(330, 1.2, 0.08, 'sine', 0.06); },
    raspa: function (vel) {
      if (calado() || !raspa) return;
      var a = Math.min(1, vel / 2600);
      alvo(raspa.g.gain, a * a * 0.2, 0.05); alvo(raspa.f.frequency, 900 + a * 2200, 0.1);
      clearTimeout(this._r); this._r = setTimeout(function () { if (raspa) alvo(raspa.g.gain, 0, 0.12); }, 90);
    },
    estrato: function (j) { toque(440 * Math.pow(2, -j * 5 / 12), 1.6, 0.1); },
    achado: function () { [220, 277.18, 329.63, 440].forEach(function (f, i) { toque(f, 2.4, 0.07, 'sine', i * 0.09); }); },
    toque: function () { toque(660, 0.18, 0.05); },
    liga: function (j) {
      if (calado()) return;
      var t = ctx.currentTime, f = 196 * Math.pow(2, [0, 2, 4, 7, 9][j % 5] / 12);
      [f * 1.06, f * 0.94].forEach(function (f0) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.5);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0006, t + 1.6);
        o.connect(g); g.connect(mestre); o.start(t); o.stop(t + 1.7);
      });
    },
    tique: function (r) {
      if (calado()) return;
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = [1320, 990, 740][r || 0];
      g.gain.setValueAtTime(0.035, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.07);
      o.connect(g); g.connect(mestre); o.start(t); o.stop(t + 0.08);
    },
    aurora: function () { [110, 164.81, 220, 277.18, 329.63, 493.88].forEach(function (f, i) { toque(f, 3.6, 0.05, 'sine', i * 0.12); }); },
    virada: function () {},
    obra: function (sim) { if (!trio || calado()) return; alvo(trio.g.gain, sim ? 0.07 : 0, sim ? 0.3 : 0.5); },
    obraNivel: function (F) {
      if (!trio || calado()) return;
      trio.osc.forEach(function (o, i) { alvo(o.frequency, trio.base[i] * Math.pow(2, trio.desvio[i] * (1 - F) / 12), 0.08); });
    },
    coagula: function () { if (trio) alvo(trio.g.gain, 0, 0.6); toque(220, 3.2, 0.12); toque(440, 2.6, 0.06, 'sine', 0.02); },
    selo: function () { toque(110, 1.2, 0.1, 'triangle'); toque(330, 2.8, 0.07, 'sine', 0.05); }
  };
})();
