/*
 * Do inteiro — o campo: a matéria da peça.
 *
 * Um canvas WebGL2 fixo atrás do texto, que desenha duas coisas:
 *
 * 1. As peças: cápsulas e anéis (o material da logo), até 48 por quadro, num campo de influência
 *    calculado por pixel. Cada peça soma ao campo uma rampa que vale 0,5 exatamente na sua borda;
 *    longe das outras, a peça aparece nítida e sozinha; perto, as caudas se somam e as vizinhas se
 *    fundem como líquido (a mesma ideia do <heild-logo>: desfoque + limiar). Como a rampa tem a mesma
 *    inclinação dos dois lados da borda, o limiar com fwidth dá antisserrilhado de cobertura, como um
 *    SVG, na densidade cheia do aparelho. Cada peça tem cor própria; onde as peças se fundem, a cor é
 *    a média pesada pelo campo (é assim que as cores dos orbs se misturam como luz na obra).
 *
 * 2. O palimpsesto (fólio i): seis camadas de texto, cada uma numa textura do tamanho exato do canvas,
 *    e um campo de profundidade (uma grade pequena, na CPU) que o gesto de raspar aprofunda. O shader
 *    escolhe a camada pela profundidade, com borda irregular de pergaminho e antisserrilhado.
 *
 * Sem WebGL2, um desenho em 2D faz as peças sem a fusão (e o palimpsesto como camadas recortadas).
 * Desempenho: o quadro só pinta dentro da caixa das peças (scissor); um governador baixa a densidade
 * se o aparelho não dá conta (?qualidade=cheia trava a densidade cheia, para conferir as bordas).
 */
(function () {
  'use strict';
  var I = window.Inteiro = window.Inteiro || {};
  var MAX = 48, LIM = 0.5, NC = 6; // NC: número de camadas do palimpsesto

  var VS = '#version 300 es\n' +
    'void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }\n';

  var FS_PECAS = '#version 300 es\n' +
    'precision highp float;\n' +
    'uniform vec4 uA[' + MAX + '];\n' +   // cápsula: x, y, vx, vy (meio segmento) | anel: x, y, R, 0
    'uniform vec4 uB[' + MAX + '];\n' +   // r (meia espessura), k (influência), tipo (0 cápsula, 1 anel), 0
    'uniform vec4 uC[' + MAX + '];\n' +   // cor r, g, b, peso
    'uniform int uN;\n' +
    'uniform float uAlt, uOpac;\n' +
    'out vec4 cor;\n' +
    'void main() {\n' +
    '  vec2 p = vec2(gl_FragCoord.x, uAlt - gl_FragCoord.y);\n' +
    '  float F = 0.0, W = 0.0; vec3 C = vec3(0.0);\n' +
    '  for (int i = 0; i < ' + MAX + '; i++) {\n' +
    '    if (i >= uN) break;\n' +
    '    vec4 a = uA[i], b = uB[i];\n' +
    '    float d, m = b.x + b.y;\n' +
    // fora da caixa da peça (com a cauda), nada a somar: sai cedo (a maior parte dos pixels, na maior parte das peças)
    '    if (b.z > 0.5) { d = abs(length(p - a.xy) - a.z) - b.x; }\n' +
    '    else { vec2 dp = abs(p - a.xy); if (dp.x > abs(a.z) + m || dp.y > abs(a.w) + m) continue;\n' +
    '      vec2 q = p - (a.xy - a.zw), v = 2.0 * a.zw; float t = clamp(dot(q, v) / max(dot(v, v), 1e-6), 0.0, 1.0); d = length(q - v * t) - b.x; }\n' +
    '    float u = d / b.y;\n' +
    '    if (u >= 1.0) continue;\n' +
    // fora: a cauda (é ela que funde as vizinhas); dentro: a mesma inclinação, até 1
    '    float f = u > 0.0 ? ' + LIM.toFixed(2) + ' * (1.0 - u) * (1.0 - u) : min(1.0, ' + LIM.toFixed(2) + ' * (1.0 - 2.0 * u));\n' +
    '    F += f;\n' +
    '    float w = f * f * f * f * uC[i].a; C += uC[i].rgb * w; W += w;\n' +
    '  }\n' +
    '  float aa = max(fwidth(F) * 0.55, 0.0015);\n' +
    '  float al = smoothstep(' + LIM.toFixed(2) + ' - aa, ' + LIM.toFixed(2) + ' + aa, F) * uOpac;\n' +
    '  vec3 c = W > 0.0 ? C / W : vec3(0.0);\n' +
    '  cor = vec4(c * al, al);\n' +
    '}\n';

  var FS_PAL = '#version 300 es\n' +
    'precision highp float;\n' +
    'uniform sampler2D uProf, uT0, uT1, uT2, uT3, uT4, uT5, uRuido;\n' +
    'uniform vec2 uTela, uEscProf;\n' +       // tamanho do canvas (px) e escala da grade de profundidade
    'uniform vec4 uPapel[' + NC + '];\n' +     // cor do pergaminho de cada camada (pré-multiplicada)
    'uniform vec3 uTinta[' + NC + '];\n' +
    'uniform float uOpac, uSemente;\n' +
    'out vec4 cor;\n' +
    // ruído de valor: uma textura pequena de acaso, lida com filtro linear (barato, inclusive sem GPU)
    'float ruido(vec2 p) { return texture(uRuido, (p + 0.5) / 256.0).r; }\n' +
    'vec4 camada(int j, float cob) {\n' +
    '  vec4 pp = uPapel[j];\n' +
    '  return mix(vec4(pp.rgb * pp.a, pp.a), vec4(uTinta[j], 1.0), cob);\n' +
    '}\n' +
    'void main() {\n' +
    '  vec2 fc = gl_FragCoord.xy;\n' +
    '  vec2 uv = vec2(fc.x / uTela.x, 1.0 - fc.y / uTela.y);\n' +
    '  ivec2 tx = ivec2(int(fc.x), int(uTela.y - fc.y));\n' +
    '  float D = texture(uProf, uv * uEscProf).r * ' + NC.toFixed(1) + ';\n' +
    // a borda raspada: fibras do pergaminho (ruído em duas escalas), só onde já se raspou
    '  vec2 q = vec2(fc.x, uTela.y - fc.y) / uTela.y * 90.0 + uSemente;\n' +
    '  float n = ruido(q) * 0.62 + ruido(q * 3.7) * 0.38;\n' +
    '  D += (n - 0.5) * 0.9 * smoothstep(0.02, 0.7, D);\n' +
    '  float aa = max(fwidth(D) * 0.6, 1e-4);\n' +
    '  vec4 c = camada(0, texelFetch(uT0, tx, 0).r);\n' +
    '  float s1 = smoothstep(1.0 - aa, 1.0 + aa, D); if (s1 > 0.0) c = mix(c, camada(1, texelFetch(uT1, tx, 0).r), s1);\n' +
    '  float s2 = smoothstep(2.0 - aa, 2.0 + aa, D); if (s2 > 0.0) c = mix(c, camada(2, texelFetch(uT2, tx, 0).r), s2);\n' +
    '  float s3 = smoothstep(3.0 - aa, 3.0 + aa, D); if (s3 > 0.0) c = mix(c, camada(3, texelFetch(uT3, tx, 0).r), s3);\n' +
    '  float s4 = smoothstep(4.0 - aa, 4.0 + aa, D); if (s4 > 0.0) c = mix(c, camada(4, texelFetch(uT4, tx, 0).r), s4);\n' +
    '  float s5 = smoothstep(5.0 - aa, 5.0 + aa, D); if (s5 > 0.0) c = mix(c, camada(5, texelFetch(uT5, tx, 0).r), s5);\n' +
    '  cor = c * uOpac;\n' +
    '}\n';

  function compilar(gl, fs) {
    var p = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]].forEach(function (s) {
      var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  function Campo(canvas) {
    this.canvas = canvas;
    this.A = new Float32Array(MAX * 4); this.B = new Float32Array(MAX * 4); this.C = new Float32Array(MAX * 4);
    this.qualidade = 0; this.travado = /[?&]qualidade=cheia/.test(location.search);
    this.custo = 0; this.amostras = 0; this.nascido = 0;
    this.gl = null;
    try { this._iniciar(); } catch (e) { this.gl = null; if (window.console) console.warn('campo: sem WebGL2', e); }
    if (!this.gl) this.ctx = canvas.getContext('2d');
  }
  Campo.prototype._iniciar = function () {
    var gl = this.canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
    if (!gl) return;
    this.gl = gl;
    this.pP = compilar(gl, FS_PECAS); this.pL = compilar(gl, FS_PAL);
    var u = function (p, n) { return gl.getUniformLocation(p, n); };
    this.uP = { A: u(this.pP, 'uA'), B: u(this.pP, 'uB'), C: u(this.pP, 'uC'), N: u(this.pP, 'uN'), alt: u(this.pP, 'uAlt'), opac: u(this.pP, 'uOpac') };
    this.texRuido = gl.createTexture();
    var acaso = new Uint8Array(256 * 256), sem = 1234567;
    for (var ai = 0; ai < acaso.length; ai++) { sem ^= sem << 13; sem >>>= 0; sem ^= sem >>> 17; sem ^= sem << 5; sem >>>= 0; acaso[ai] = sem & 255; }
    gl.bindTexture(gl.TEXTURE_2D, this.texRuido); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 256, 256, 0, gl.RED, gl.UNSIGNED_BYTE, acaso);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    this.uL = { ruido: u(this.pL, 'uRuido'), prof: u(this.pL, 'uProf'), tela: u(this.pL, 'uTela'), esc: u(this.pL, 'uEscProf'), papel: u(this.pL, 'uPapel'), tinta: u(this.pL, 'uTinta'), opac: u(this.pL, 'uOpac'), semente: u(this.pL, 'uSemente'), t: [] };
    for (var i = 0; i < NC; i++) this.uL.t.push(u(this.pL, 'uT' + i));
    this.vao = gl.createVertexArray();
    var self = this;
    this.canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self.perdido = true; });
    this.canvas.addEventListener('webglcontextrestored', function () {
      self.perdido = false;
      try { self._iniciar(); self.texturas = null; self.texProf = null; self.redimensionar(self.w, self.h, self.dpr); if (self.aoRestaurar) self.aoRestaurar(); } catch (er) { /* fica sem desenhar */ }
    });
  };

  /* densidade: cheia (a do aparelho, até 3x); se o governador pedir, 3/4 dela, depois metade, depois 1x */
  Campo.prototype.redimensionar = function (w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    var d0 = Math.min(dpr, 3), dc = [d0, Math.max(1, d0 * 0.75), Math.max(1, d0 * 0.5), 1][this.qualidade];
    this.dc = dc;
    this.canvas.width = Math.max(1, Math.round(w * dc)); this.canvas.height = Math.max(1, Math.round(h * dc)); this.versao = (this.versao || 0) + 1;
    if (this.ctx) this.ctx.setTransform(dc, 0, 0, dc, 0, 0);
    if (this.aoRedimensionar) this.aoRedimensionar();
  };
  Campo.prototype.limpar = function () {
    var gl = this.gl;
    if (gl) { gl.viewport(0, 0, this.canvas.width, this.canvas.height); gl.disable(gl.SCISSOR_TEST); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    else if (this.ctx) this.ctx.clearRect(0, 0, this.w, this.h);
  };

  /*
   * pecas(lista, opac): desenha as peças visíveis. Cada peça: { x, y, a (ângulo do eixo, 0 = deitada),
   * c (comprimento com as pontas), e (espessura), k (influência em px), cor [r, g, b], anel: R (opcional) }
   */
  Campo.prototype.pecas = function (lista, opac) {
    if (this.perdido) return;
    var dc = this.dc, vis = [], cx0 = [], cy0 = [], cx1 = [], cy1 = [];
    for (var i = 0; i < lista.length && vis.length < MAX; i++) {
      var p = lista[i];
      if (!(p.e > 0.35)) continue;
      var r = p.e / 2, k = Math.max(p.k || 1, 0.8), ex, ey;
      if (p.anel) { ex = ey = p.anel + r + k; }
      else { var hm = Math.max(0, (p.c - p.e) / 2); ex = Math.abs(Math.cos(p.a) * hm) + r + k; ey = Math.abs(Math.sin(p.a) * hm) + r + k; }
      vis.push(p); cx0.push(p.x - ex - 2); cx1.push(p.x + ex + 2); cy0.push(p.y - ey - 2); cy1.push(p.y + ey + 2);
    }
    if (!vis.length) return;
    if (!this.gl) { if (this.ctx) desenhar2D(this.ctx, vis, opac == null ? 1 : opac); return; }
    /* grupos: peças cujas caixas (com a cauda) não se tocam não podem se fundir; cada grupo vai num
       passe só dele, recortado na sua caixa. O resultado é idêntico, e a área pintada é bem menor. */
    var n = vis.length, pai = [];
    for (i = 0; i < n; i++) pai.push(i);
    var raiz = function (a) { while (pai[a] !== a) { pai[a] = pai[pai[a]]; a = pai[a]; } return a; };
    for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      if (cx0[i] < cx1[j] && cx0[j] < cx1[i] && cy0[i] < cy1[j] && cy0[j] < cy1[i]) { var a = raiz(i), b = raiz(j); if (a !== b) pai[a] = b; }
    }
    var grupos = {};
    for (i = 0; i < n; i++) { var g = raiz(i); (grupos[g] || (grupos[g] = [])).push(i); }
    var gl = this.gl, W = this.canvas.width, H = this.canvas.height, A = this.A, B = this.B, C = this.C;
    gl.viewport(0, 0, W, H);
    gl.useProgram(this.pP);
    gl.uniform1f(this.uP.alt, H); gl.uniform1f(this.uP.opac, opac == null ? 1 : opac);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST); gl.bindVertexArray(this.vao);
    for (var chave in grupos) {
      var idx = grupos[chave], x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (var m = 0; m < idx.length; m++) {
        var q = idx[m], pc = vis[q], o = m * 4, rr = pc.e / 2, kk = Math.max(pc.k || 1, 0.8);
        x0 = Math.min(x0, cx0[q]); x1 = Math.max(x1, cx1[q]); y0 = Math.min(y0, cy0[q]); y1 = Math.max(y1, cy1[q]);
        if (pc.anel) { A[o] = pc.x * dc; A[o + 1] = pc.y * dc; A[o + 2] = pc.anel * dc; A[o + 3] = 0; B[o + 2] = 1; }
        else { var h2 = Math.max(0, (pc.c - pc.e) / 2); A[o] = pc.x * dc; A[o + 1] = pc.y * dc; A[o + 2] = Math.cos(pc.a) * h2 * dc; A[o + 3] = Math.sin(pc.a) * h2 * dc; B[o + 2] = 0; }
        B[o] = rr * dc; B[o + 1] = kk * dc; B[o + 3] = 0;
        var cor = pc.cor || [0, 0, 0]; C[o] = cor[0]; C[o + 1] = cor[1]; C[o + 2] = cor[2]; C[o + 3] = pc.peso == null ? 1 : pc.peso;
      }
      var sx0 = Math.max(0, Math.floor(x0 * dc)), sx1 = Math.min(W, Math.ceil(x1 * dc)), sy0 = Math.max(0, Math.floor(y0 * dc)), sy1 = Math.min(H, Math.ceil(y1 * dc));
      if (sx1 <= sx0 || sy1 <= sy0) continue;
      gl.scissor(sx0, H - sy1, sx1 - sx0, sy1 - sy0);
      gl.uniform4fv(this.uP.A, A.subarray(0, idx.length * 4)); gl.uniform4fv(this.uP.B, B.subarray(0, idx.length * 4)); gl.uniform4fv(this.uP.C, C.subarray(0, idx.length * 4));
      gl.uniform1i(this.uP.N, idx.length);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST);
  };

  /* ---------- o palimpsesto ---------- */
  /* camadas(canvases): seis canvases do tamanho do campo, com o texto branco sobre preto (cobertura) */
  Campo.prototype.camadas = function (canvases) {
    this.fontesPal = canvases; this.versao = (this.versao || 0) + 1;
    var gl = this.gl; if (!gl) return;
    if (!this.texturas) { this.texturas = []; for (var i = 0; i < NC; i++) this.texturas.push(gl.createTexture()); }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    for (var j = 0; j < NC; j++) {
      gl.bindTexture(gl.TEXTURE_2D, this.texturas[j]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, canvases[j]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
  };
  /* profundidade(dados, colunas, linhas, celula): a grade de profundidade (0 a 1 = 0 a 6 camadas) */
  Campo.prototype.profundidade = function (bytes, cols, lins, cel) {
    this.prof = { bytes: bytes, cols: cols, lins: lins, cel: cel }; this.versao = (this.versao || 0) + 1;
    var gl = this.gl; if (!gl) return;
    if (!this.texProf) this.texProf = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texProf);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    if (this.texProfTam !== cols + 'x' + lins) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, cols, lins, 0, gl.RED, gl.UNSIGNED_BYTE, bytes);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.texProfTam = cols + 'x' + lins;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, cols, lins, gl.RED, gl.UNSIGNED_BYTE, bytes);
    }
  };
  /* palimpsesto(papel[6][r,g,b,a], tinta[6][r,g,b], opac) */
  Campo.prototype.palimpsesto = function (papel, tinta, opac) {
    if (this.perdido || opac <= 0.002 || !this.prof) return;
    var gl = this.gl;
    if (!gl) { desenharPal2D(this, papel, tinta, opac); return; }
    if (!this.texturas || !this.texProf) return;
    var W = this.canvas.width, H = this.canvas.height, P = new Float32Array(NC * 4), T = new Float32Array(NC * 3);
    for (var j = 0; j < NC; j++) { P.set([papel[j][0], papel[j][1], papel[j][2], papel[j][3]], j * 4); T.set(tinta[j], j * 3); }
    gl.viewport(0, 0, W, H); gl.disable(gl.SCISSOR_TEST);
    gl.useProgram(this.pL);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.texProf); gl.uniform1i(this.uL.prof, 0);
    for (var i = 0; i < NC; i++) { gl.activeTexture(gl.TEXTURE1 + i); gl.bindTexture(gl.TEXTURE_2D, this.texturas[i]); gl.uniform1i(this.uL.t[i], 1 + i); }
    gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, this.texRuido); gl.uniform1i(this.uL.ruido, 7);
    gl.uniform2f(this.uL.tela, W, H);
    var pr = this.prof;
    gl.uniform2f(this.uL.esc, this.w / (pr.cols * pr.cel), this.h / (pr.lins * pr.cel));
    gl.uniform4fv(this.uL.papel, P); gl.uniform3fv(this.uL.tinta, T);
    gl.uniform1f(this.uL.opac, opac); gl.uniform1f(this.uL.semente, 17.3);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(this.vao); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0);
  };

  /* governador: pelo intervalo real entre quadros; depois de 4 s, se a média passa de 30 ms, baixa a densidade */
  Campo.prototype.governar = function (dt, agora) {
    if (this.travado) return;
    if (!this.nascido) this.nascido = agora;
    if (agora - this.nascido < 4000 || dt > 250) return;
    this.custo = this.custo ? this.custo * 0.95 + dt * 0.05 : dt; this.amostras++;
    if (this.amostras > 60 && this.custo > 30 && this.qualidade < 3) {
      this.qualidade++; this.amostras = 0; this.custo = 0; this.redimensionar(this.w, this.h, this.dpr);
      if (this.aoDensidade) this.aoDensidade();
    }
  };

  /* ---------- sem WebGL2 ---------- */
  function rgb(c, a) { return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + (a == null ? 1 : a) + ')'; }
  function desenhar2D(ctx, lista, opac) {
    ctx.save(); ctx.globalAlpha = opac; ctx.lineCap = 'round';
    lista.forEach(function (p) {
      if (!(p.e > 0.35)) return;
      ctx.strokeStyle = rgb(p.cor || [0, 0, 0]); ctx.lineWidth = p.e;
      ctx.beginPath();
      if (p.anel) ctx.arc(p.x, p.y, p.anel, 0, Math.PI * 2);
      else { var hm = Math.max(0.01, (p.c - p.e) / 2), ca = Math.cos(p.a) * hm, sa = Math.sin(p.a) * hm; ctx.moveTo(p.x - ca, p.y - sa); ctx.lineTo(p.x + ca, p.y + sa); }
      ctx.stroke();
    });
    ctx.restore();
  }
  function desenharPal2D(campo, papel, tinta, opac) {
    var ctx = campo.ctx, pr = campo.prof, fontes = campo.fontesPal; if (!ctx || !pr || !fontes) return;
    // camada 0 inteira; as outras recortadas pelas células com profundidade suficiente
    ctx.save(); ctx.globalAlpha = opac;
    for (var j = 0; j < NC; j++) {
      ctx.save();
      if (j > 0) {
        ctx.beginPath();
        for (var y = 0; y < pr.lins; y++) for (var x = 0; x < pr.cols; x++) if (pr.bytes[y * pr.cols + x] / 255 * NC >= j) ctx.rect(x * pr.cel, y * pr.cel, pr.cel + 0.5, pr.cel + 0.5);
        ctx.clip();
        ctx.fillStyle = rgb(papel[j], 1); ctx.fillRect(0, 0, campo.w, campo.h);
      }
      if (!fontes[j].tinta2d) fontes[j].tinta2d = tingir(fontes[j], tinta[j]);
      ctx.drawImage(fontes[j].tinta2d, 0, 0, campo.w, campo.h);
      ctx.restore();
    }
    ctx.restore();
  }
  function tingir(fonte, cor) {
    var c = document.createElement('canvas'); c.width = fonte.width; c.height = fonte.height;
    var g = c.getContext('2d'); g.drawImage(fonte, 0, 0);
    var d = g.getImageData(0, 0, c.width, c.height), px = d.data;
    for (var i = 0; i < px.length; i += 4) { var a = px[i]; px[i] = cor[0] * 255; px[i + 1] = cor[1] * 255; px[i + 2] = cor[2] * 255; px[i + 3] = a; }
    g.putImageData(d, 0, 0); return c;
  }

  I.Campo = Campo;
  I.NC = NC;
  I.MAXPECAS = MAX;
})();
