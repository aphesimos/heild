/*
 * Genealogia do inteiro — o som (opcional, desligado até um clique).
 *
 * Tudo é sintetizado na hora com Web Audio, sem arquivo de áudio:
 *   - areia: um ruído filtrado cujo volume segue a velocidade da rolagem (a matéria escorrendo);
 *   - nota: um toque curto e redondo, numa escala pentatônica, quando a forma muda;
 *   - respiro: um sopro grave que sobe na divisão e desce no retorno;
 *   - toque: um estalo pequeno, quando alguém cutuca um orb.
 * O AudioContext só nasce dentro do clique no botão (regra de autoplay dos navegadores).
 */
(function () {
  'use strict';
  var G = window.Genealogia = window.Genealogia || {};
  var ctx = null, mestre = null, areia = null, ligado = false;
  var ESCALA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

  function criar() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    mestre = ctx.createGain(); mestre.gain.value = 0; mestre.connect(ctx.destination);
    // a areia: ruído rosado aproximado, passa-faixa, com o volume ligado à rolagem
    var dur = 2, buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), d = buf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
    for (var i = 0; i < d.length; i++) { var w = Math.random() * 2 - 1; b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; d[i] = (b0 + b1 + b2 + w * 0.02) * 0.6; }
    var fonte = ctx.createBufferSource(); fonte.buffer = buf; fonte.loop = true;
    var filtro = ctx.createBiquadFilter(); filtro.type = 'bandpass'; filtro.frequency.value = 1400; filtro.Q.value = 0.6;
    var alto = ctx.createBiquadFilter(); alto.type = 'highpass'; alto.frequency.value = 300;
    areia = ctx.createGain(); areia.gain.value = 0;
    fonte.connect(filtro); filtro.connect(alto); alto.connect(areia); areia.connect(mestre); fonte.start();
    areia.filtro = filtro;
    return true;
  }

  var Som = {
    get ligado() { return ligado; },
    alternar: function () {
      if (!ctx && !criar()) return false;
      ligado = !ligado;
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;
      mestre.gain.cancelScheduledValues(t); mestre.gain.setTargetAtTime(ligado ? 0.5 : 0, t, 0.08);
      return ligado;
    },
    /* velocidade da rolagem em px/s */
    rolagem: function (vel) {
      if (!ligado || !areia) return;
      var a = Math.min(1, Math.abs(vel) / 4000), t = ctx.currentTime;
      areia.gain.setTargetAtTime(a * a * 0.22, t, 0.12);
      areia.filtro.frequency.setTargetAtTime(900 + a * 1800, t, 0.2);
    },
    nota: function (grau, forca) {
      if (!ligado) return;
      var t = ctx.currentTime, f = 220 * Math.pow(2, ESCALA[((grau % ESCALA.length) + ESCALA.length) % ESCALA.length] / 12);
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), gn = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f; o2.type = 'triangle'; o2.frequency.value = f * 2;
      var g2 = ctx.createGain(); g2.gain.value = 0.18;
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.16 * (forca || 1), t + 0.012); gn.gain.exponentialRampToValueAtTime(0.0008, t + 1.1);
      o.connect(gn); o2.connect(g2); g2.connect(gn); gn.connect(mestre);
      o.start(t); o2.start(t); o.stop(t + 1.2); o2.stop(t + 1.2);
    },
    respiro: function (abre) {
      if (!ligado) return;
      var t = ctx.currentTime, o = ctx.createOscillator(), gn = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(abre ? 82 : 110, t); o.frequency.exponentialRampToValueAtTime(abre ? 110 : 73, t + 0.9);
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(abre ? 240 : 520, t); lp.frequency.exponentialRampToValueAtTime(abre ? 620 : 200, t + 0.9);
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.07, t + 0.25); gn.gain.exponentialRampToValueAtTime(0.0008, t + 1.3);
      o.connect(lp); lp.connect(gn); gn.connect(mestre); o.start(t); o.stop(t + 1.4);
    },
    toque: function () {
      if (!ligado) return;
      var t = ctx.currentTime, o = ctx.createOscillator(), gn = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(660, t); o.frequency.exponentialRampToValueAtTime(990, t + 0.08);
      gn.gain.setValueAtTime(0.12, t); gn.gain.exponentialRampToValueAtTime(0.0008, t + 0.22);
      o.connect(gn); gn.connect(mestre); o.start(t); o.stop(t + 0.25);
    }
  };
  G.Som = Som;
})();
