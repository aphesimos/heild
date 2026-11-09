/*
 * Genealogia do inteiro — o campo de cápsulas.
 *
 * Um canvas fixo atrás da página, com milhares de cápsulas que seguem as formações por molas.
 * A fusão líquida é a mesma ideia do <heild-logo> (desfoque + limiar de alfa), feita na GPU como
 * metaballs: cada cápsula soma um campo de influência numa textura (passo 1, mistura aditiva) e um
 * segundo passo corta o campo num limiar, com antisserrilhado. Com influência mínima, as cápsulas
 * aparecem nítidas e separadas; com influência grande, as vizinhas se fundem num corpo só.
 * Como na logo, a fusão acompanha a velocidade: rolar rápido derrete a matéria, parar a assenta.
 *
 * Sem WebGL2, um desenho em 2D faz o mesmo sem a fusão. Com movimento reduzido, nada disso roda:
 * o motor desenha cada formação parada, com desenharEstatico.
 *
 * Desempenho: as molas rodam na CPU (poucos milhares, sem alocar memória por quadro) e o buffer de
 * instâncias sobe inteiro a cada quadro; o desenho para quando tudo assenta e nada vive em volta.
 */
(function () {
  'use strict';
  var G = window.Genealogia = window.Genealogia || {};
  var PASSO = G.PASSO;
  var LIMIAR = 0.5;

  /* ---------- shaders ---------- */
  var VS_CAP = '#version 300 es\n' +
    'precision highp float;\n' +
    'layout(location=0) in vec2 aCanto;\n' +
    'layout(location=1) in vec4 aCap;\n' +   // x, y, a, c
    'layout(location=2) in vec2 aCap2;\n' +  // e, k (influência em px)
    'uniform vec2 uTela;\n' +
    'out vec2 vLocal;\n' +
    'flat out vec3 vMed;\n' +
    'void main() {\n' +
    '  float e = aCap2.x, k = max(aCap2.y, 0.9);\n' +
    '  if (e < 0.35) { gl_Position = vec4(3.0, 3.0, 3.0, 1.0); vLocal = vec2(0.0); vMed = vec3(0.0, 0.0, 1.0); return; }\n' +
    '  float r = e * 0.5, meia = max(aCap.w * 0.5 - r, 0.0);\n' +
    '  vec2 l = aCanto * vec2(r + k, meia + r + k);\n' +
    '  float s = sin(aCap.z), c = cos(aCap.z);\n' +
    '  vec2 p = aCap.xy + l.x * vec2(c, s) + l.y * vec2(s, -c);\n' +
    '  vLocal = l; vMed = vec3(meia, r, k);\n' +
    '  vec2 q = p / uTela * 2.0 - 1.0;\n' +
    '  gl_Position = vec4(q.x, -q.y, 0.0, 1.0);\n' +
    '}\n';
  var FS_CAP = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 vLocal;\n' +
    'flat in vec3 vMed;\n' +
    'uniform float uLimiar;\n' +
    'out vec4 cor;\n' +
    'void main() {\n' +
    '  float d = length(vec2(vLocal.x, max(abs(vLocal.y) - vMed.x, 0.0)));\n' +
    '  float u = (d - vMed.y) / vMed.z;\n' +
    '  if (u >= 1.0) discard;\n' +
    '  float f;\n' +
    '  if (u > 0.0) { float q = 1.0 - u; f = uLimiar * q * q; }\n' +
    '  else f = uLimiar + (1.0 - uLimiar) * clamp((vMed.y - d) / max(vMed.y, 1.0), 0.0, 1.0);\n' +
    '  cor = vec4(f, 0.0, 0.0, 1.0);\n' +
    '}\n';
  var VS_TELA = '#version 300 es\n' +
    'out vec2 vUv;\n' +
    'void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); vUv = p; gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }\n';
  var FS_TELA = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 vUv;\n' +
    'uniform sampler2D uCampo;\n' +
    'uniform float uLimiar, uOpac;\n' +
    'uniform vec3 uCor;\n' +
    'out vec4 cor;\n' +
    'void main() {\n' +
    '  float f = texture(uCampo, vUv).r;\n' +
    '  float w = max(fwidth(f) * 0.75, 0.003);\n' +
    '  float a = smoothstep(uLimiar - w, uLimiar + w, f) * uOpac;\n' +
    '  cor = vec4(uCor * a, a);\n' +
    '}\n';

  function compilar(gl, vs, fs) {
    var p = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(function (s) {
      var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  function suave(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function meiaVolta(d) { while (d > Math.PI / 2) d -= Math.PI; while (d < -Math.PI / 2) d += Math.PI; return d; }

  /*
   * Campo(canvas, n): cria o campo. Métodos:
   *   formacoes(mapa)        { nome: { f: Float32Array, esc: px } }
   *   quadro(agora, estado)  estado: { a, b, t, kA, kB (influência em px), cor [r,g,b 0..1], opac, deriva, cursor {x,y,forca}, pocos [{x,y,r,f}], vel }
   *   redimensionar(w, h, dpr), destruir()
   */
  function Campo(canvas, n) {
    this.canvas = canvas; this.n = n;
    this.p = new Float32Array(n * 5); this.v = new Float32Array(n * 5);
    this.inst = new Float32Array(n * 6); this.ultimaOpac = 1;
    this.forms = {}; this.iniciado = false; this.ultimo = 0; this.forcar = true;
    this.K = 170; this.C = 2 * Math.sqrt(170) * 0.62; this.kAtual = 1;
    this.custo = 0; this.qualidade = 0; // 0 cheia; 1 e 2 mais leves (o governador ajusta)
    this.gl = null;
    try { this._iniciarGL(); } catch (e) { this.gl = null; }
    if (!this.gl) this.ctx = canvas.getContext('2d');
  }
  Campo.prototype._iniciarGL = function () {
    var gl = this.canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) return;
    this.gl = gl;
    this.pCap = compilar(gl, VS_CAP, FS_CAP); this.pTela = compilar(gl, VS_TELA, FS_TELA);
    this.uTela = gl.getUniformLocation(this.pCap, 'uTela'); this.uLimiar1 = gl.getUniformLocation(this.pCap, 'uLimiar');
    this.uCampo = gl.getUniformLocation(this.pTela, 'uCampo'); this.uLimiar2 = gl.getUniformLocation(this.pTela, 'uLimiar');
    this.uOpac = gl.getUniformLocation(this.pTela, 'uOpac'); this.uCor = gl.getUniformLocation(this.pTela, 'uCor');
    this.vao = gl.createVertexArray(); gl.bindVertexArray(this.vao);
    var canto = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, canto);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.bInst = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.bInst);
    gl.bufferData(gl.ARRAY_BUFFER, this.inst.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 0); gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16); gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);
    this.vaoTela = gl.createVertexArray();
    this.tex = gl.createTexture(); this.fbo = gl.createFramebuffer();
    var self = this;
    this.canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self.perdido = true; });
    this.canvas.addEventListener('webglcontextrestored', function () { self.perdido = false; try { self._iniciarGL(); self.redimensionar(self.w, self.h, self.dpr); } catch (er) { /* fica sem desenhar */ } });
  };
  Campo.prototype.redimensionar = function (w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    var q = [1, 0.8, 0.62][this.qualidade];
    var dc = Math.min(dpr, this.qualidade ? 1.5 : 2) * (this.qualidade === 2 ? 0.85 : 1);
    this.canvas.width = Math.max(1, Math.round(w * dc)); this.canvas.height = Math.max(1, Math.round(h * dc));
    if (this.gl) {
      var gl = this.gl, ec = Math.min(dpr, 1.5) * q;
      this.fw = Math.max(1, Math.round(w * ec)); this.fh = Math.max(1, Math.round(h * ec));
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.fw, this.fh, 0, gl.RED, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else if (this.ctx) {
      this.ctx.setTransform(dc, 0, 0, dc, 0, 0);
    }
    this.dc = dc; this.forcar = true;
  };
  Campo.prototype.formacoes = function (mapa) { this.forms = mapa; this.forcar = true; };
  /* começa espalhado e guardado, para a abertura: as cápsulas nascem e voam até a primeira formação */
  Campo.prototype.espalhar = function (w, h) {
    var al = G.aleatorio(5);
    for (var i = 0; i < this.n; i++) { var o = i * 5; this.p[o] = al() * w; this.p[o + 1] = al() * h; this.p[o + 2] = (al() - 0.5) * 3; this.p[o + 3] = 0; this.p[o + 4] = 0; }
    this.iniciado = true;
  };

  /* um quadro: calcula os alvos, anda as molas e desenha (ou não, se nada mudou) */
  Campo.prototype.quadro = function (agora, E) {
    var A = this.forms[E.a], B = this.forms[E.b];
    if (!A || !B || this.perdido) return false;
    var dt = Math.min(1 / 30, Math.max(0.001, (agora - (this.ultimo || agora - 16)) / 1000)); this.ultimo = agora;
    var n = this.n, fa = A.f, fb = B.f, p = this.p, v = this.v, inst = this.inst;
    if (!this.iniciado) { for (var z = 0; z < n; z++) for (var d0 = 0; d0 < 5; d0++) p[z * 5 + d0] = fa[z * PASSO + d0]; this.iniciado = true; }
    var t = E.t, K = this.K * (E.molaK || 1), C = this.C * Math.sqrt(E.molaK || 1);
    var sub = Math.max(1, Math.ceil(dt * 120)), h = dt / sub;
    var cur = E.cursor, cf = cur && cur.forca > 0 ? cur.forca : 0, cR = cur ? cur.r || 130 : 130, cR2 = cR * cR;
    var pocos = E.pocos || [], deriva = E.deriva || 0, tempo = agora / 1000;
    var kBase = E.kA + (E.kB - E.kA) * t;
    var maxV = 0, maxErr = 0;
    var g = [0, 0, 0, 0, 0];
    for (var i = 0; i < n; i++) {
      var o = i * PASSO, q = i * 5;
      // cascata: cada cápsula sai um pouco depois da vizinha anterior (a ordem é espacial)
      var ti = suave(Math.min(1, Math.max(0, (t - (i / n) * 0.3) / 0.7)));
      var ea = fa[o + 4], eb = fb[o + 4];
      g[0] = fa[o] + (fb[o] - fa[o]) * ti;
      g[1] = fa[o + 1] + (fb[o + 1] - fa[o + 1]) * ti;
      g[2] = fa[o + 2] + meiaVolta(fb[o + 2] - fa[o + 2]) * ti;
      g[3] = fa[o + 3] + (fb[o + 3] - fa[o + 3]) * ti;
      g[4] = ea + (eb - ea) * ti;
      // deriva: grupos que flutuam devagar, cada um no seu ritmo
      if (deriva) {
        var gr = ti < 0.5 ? fa[o + 5] : fb[o + 5];
        if (gr >= 0) { g[0] += Math.sin(tempo * 0.31 + gr * 1.7) * deriva * 14; g[1] += Math.cos(tempo * 0.23 + gr * 2.3) * deriva * 12; g[2] += Math.sin(tempo * 0.17 + gr) * deriva * 0.25; }
      }
      // poços: a grade de pontos se afasta e cresce em volta de cada ponto vivo
      var kLocal = kBase;
      for (var j = 0; j < pocos.length; j++) {
        var P = pocos[j], dx = g[0] - P.x, dy = g[1] - P.y, d2 = dx * dx + dy * dy, R = P.r;
        if (d2 < R * R) { var dd = Math.sqrt(d2) || 1, w = 1 - dd / R; w *= w; g[0] += dx / dd * w * P.f; g[1] += dy / dd * w * P.f; g[3] *= 1 + w * P.cresce; g[4] *= 1 + w * P.cresce; }
      }
      // cursor: afasta e derrete as cápsulas em volta
      if (cf) {
        var cx = g[0] - cur.x, cy = g[1] - cur.y, c2 = cx * cx + cy * cy;
        if (c2 < cR2) { var cd = Math.sqrt(c2) || 1, cw = 1 - cd / cR; cw *= cw; g[0] += cx / cd * cw * cf * 46; g[1] += cy / cd * cw * cf * 46; kLocal += cw * cf * (E.kCursor || 10); if (cur.cresce) { g[3] *= 1 + cw * cur.cresce; g[4] *= 1 + cw * cur.cresce; } }
      }
      g[2] = p[q + 2] + meiaVolta(g[2] - p[q + 2]);
      for (var d = 0; d < 5; d++) {
        var pv = p[q + d], vv = v[q + d], gd = g[d];
        for (var s = 0; s < sub; s++) { vv += (K * (gd - pv) - C * vv) * h; pv += vv * h; }
        p[q + d] = pv; v[q + d] = vv;
        var av = vv < 0 ? -vv : vv; if (av > maxV) maxV = av;
        var er = gd - pv; if (er < 0) er = -er; if (er > maxErr) maxErr = er;
      }
      var oi = i * 6;
      inst[oi] = p[q]; inst[oi + 1] = p[q + 1]; inst[oi + 2] = p[q + 2];
      inst[oi + 3] = Math.max(p[q + 3], p[q + 4], 0); inst[oi + 4] = Math.max(0, p[q + 4]); inst[oi + 5] = kLocal;
    }
    // a fusão acompanha a velocidade: rolar rápido derrete a matéria
    var vivo = maxV > 0.6 || maxErr > 0.4 || deriva > 0 || pocos.length > 0 || cf > 0;
    var chave = E.a + E.b + t.toFixed(4) + kBase.toFixed(2) + E.opac.toFixed(3) + E.cor.join(',');
    // invisível e já limpo: não desenha (as molas seguem andando para estarem prontas)
    var oculto = E.opac <= 0.002 && this.ultimaOpac <= 0.002;
    if (oculto && !this.forcar) { this.ultimaChave = chave; return false; }
    if (!vivo && !this.forcar && chave === this.ultimaChave) return false;
    this.ultimaChave = chave; this.forcar = false; this.ultimaOpac = E.opac;
    this._desenhar(E);
    this.desenhou = true;
    return true;
  };
  /* governador de qualidade, pelo intervalo real entre quadros em que o campo desenhou (pega a GPU
     também, não só o tempo da CPU): se a média passa de 22 ms por 90 quadros, baixa a resolução do
     campo e da tela, até dois degraus */
  Campo.prototype.governar = function (dtQuadro) {
    if (!this.desenhou) return; this.desenhou = false;
    this.custo = this.custo ? this.custo * 0.95 + dtQuadro * 0.05 : dtQuadro; this.amostras = (this.amostras || 0) + 1;
    if (this.amostras > 90 && this.custo > 22 && this.qualidade < 2) {
      this.qualidade++; this.amostras = 0; this.custo = 0; this.redimensionar(this.w, this.h, this.dpr);
    }
  };
  Campo.prototype._desenhar = function (E) {
    var gl = this.gl, n = this.n;
    if (gl) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bInst); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.inst);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo); gl.viewport(0, 0, this.fw, this.fh);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (E.opac > 0.002) {
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(this.pCap); gl.uniform2f(this.uTela, this.w, this.h); gl.uniform1f(this.uLimiar1, LIMIAR);
        gl.bindVertexArray(this.vao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
        gl.disable(gl.BLEND);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      if (E.opac > 0.002) {
        gl.useProgram(this.pTela); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform1i(this.uCampo, 0); gl.uniform1f(this.uLimiar2, LIMIAR); gl.uniform1f(this.uOpac, E.opac);
        gl.uniform3f(this.uCor, E.cor[0], E.cor[1], E.cor[2]);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindVertexArray(this.vaoTela); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disable(gl.BLEND);
      }
      gl.bindVertexArray(null);
    } else if (this.ctx) {
      var ctx = this.ctx; ctx.clearRect(0, 0, this.w, this.h);
      if (E.opac > 0.002) desenhar2D(ctx, this.inst, n, 6, E.cor, E.opac);
    }
  };
  Campo.prototype.destruir = function () { var gl = this.gl; if (gl && gl.getExtension('WEBGL_lose_context')) gl.getExtension('WEBGL_lose_context').loseContext(); };

  /* desenho em 2D, sem fusão: um traço de ponta redonda por cápsula (agrupado por espessura) */
  function desenhar2D(ctx, dados, n, passo, cor, opac) {
    var baldes = {};
    for (var i = 0; i < n; i++) {
      var o = i * passo, e = dados[o + 4]; // nas instâncias e nas formações, c e e ficam nas posições 3 e 4
      if (e < 0.5) continue;
      var k = Math.round(e * 2) / 2; (baldes[k] || (baldes[k] = [])).push(o);
    }
    ctx.save();
    ctx.globalAlpha = opac; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(' + Math.round(cor[0] * 255) + ',' + Math.round(cor[1] * 255) + ',' + Math.round(cor[2] * 255) + ')';
    Object.keys(baldes).forEach(function (k) {
      ctx.lineWidth = +k; ctx.beginPath();
      baldes[k].forEach(function (o) {
        var x = dados[o], y = dados[o + 1], a = dados[o + 2], c = Math.max(dados[o + 3], dados[o + 4]), hh = Math.max(0.01, (c - dados[o + 4]) / 2);
        var sx = Math.sin(a) * hh, sy = -Math.cos(a) * hh;
        ctx.moveTo(x - sx, y - sy); ctx.lineTo(x + sx, y + sy);
      });
      ctx.stroke();
    });
    ctx.restore();
  }

  /* uma formação parada num canvas (movimento reduzido): `f` está em px da caixa do canvas */
  function desenharEstatico(canvas, f, cor) {
    var r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, r.width, r.height);
    desenhar2D(ctx, f, f.length / PASSO, PASSO, cor, 1);
  }

  G.Campo = Campo;
  G.desenharEstatico = desenharEstatico;
})();
