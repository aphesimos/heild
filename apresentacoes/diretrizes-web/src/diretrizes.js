/*
 * Diretrizes da marca Heild — o conteúdo vivo da página.
 *
 * LINK_FILOSOFIA: o endereço da outra aba, a peça sobre a ideia da marca ("o inteiro"), na versão publicada
 * no claude.ai. Com '#', os links aparecem mas não levam a lugar nenhum.
 * window.HEILD_LINKS, quando existe, vale antes: é o que o build põe nas páginas do site (build.py --site),
 * com endereços relativos: { inicio: './', diretrizes: 'diretrizes.html', inteiro: 'inteiro.html' }. Com ele,
 * a logo do topo leva à página inicial do site.
 */
var LINK_FILOSOFIA = 'https://claude.ai/artifact/Ac3gktJEVzTg6oL1AuTMPH';

(function () {
  'use strict';
  var G = window.Genealogia, M = G.motor;
  var parado = M.parado;
  function q(s, el) { return (el || document).querySelector(s); }
  function qa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function h(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v, casas) { return v.toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 }); }
  var P = window.Heild && window.Heild.paths;

  /* ---------- a outra aba e, no site, a página inicial ---------- */
  var LINKS = window.HEILD_LINKS || {};
  var filosofia = LINKS.inteiro || LINK_FILOSOFIA;
  qa('[data-link-filosofia]').forEach(function (a) {
    a.setAttribute('href', filosofia);
    a.addEventListener('click', function (e) { if (filosofia === '#') e.preventDefault(); });
  });
  if (LINKS.inicio) {
    var logoTopo = q('.topo-logo');
    if (logoTopo) { logoTopo.setAttribute('href', LINKS.inicio); logoTopo.setAttribute('aria-label', 'Heild, página inicial'); }
    qa('[data-link-inicio]').forEach(function (a) { a.setAttribute('href', LINKS.inicio); a.hidden = false; });
  }

  /* ---------- os traçados oficiais onde a página desenha o HE (ícone da aba, barra do produto) ---------- */
  if (P) qa('path[data-traco="HE"]').forEach(function (p) { p.setAttribute('d', P.HE); });

  /* ---------- aparecer ao entrar na tela (seções de leitura) ---------- */
  var revelas = qa('.revela');
  if (parado || !('IntersectionObserver' in window)) revelas.forEach(function (el) { el.classList.add('visivel'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    revelas.forEach(function (el) { io.observe(el); });
  }
  /* está na tela agora? (para só animar o que se vê) */
  function naTela(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }

  /* ---------- cores lidas do tema ---------- */
  function corDe(el, nome) { var s = document.createElement('i'); s.style.color = 'var(' + nome + ')'; s.style.display = 'none'; el.appendChild(s); var c = getComputedStyle(s).color; s.remove(); return c; }
  function rgb(c) { var m = String(c).match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0]; }
  function hex(c) { return '#' + rgb(c).map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function lum(c) { var a = rgb(c).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
  function contraste(a, b) { var la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }

  /* ---------- a logo: a construção e a área de proteção que acompanha ---------- */
  (function () {
    var cap = q('#logo'); if (!cap) return;
    var l = q('.logo-construcao', cap), svg = q('.anot-logo', cap), area = q('.area', svg), me = q('.modulo-e', svg), md = q('.modulo-d', svg), rot = q('.rot-area', svg), caixa = q('.logo-caixa-construcao', cap);
    var X = 147.297, ultimo = -1, tocando = false, proximo = 0, formas = ['orb', 'centralizar', 'bpo', 'contabil'], k = 0;
    function escala() { var w = caixa.getBoundingClientRect().width; if (w) svg.style.setProperty('--S', (w / 1259).toFixed(4)); }
    escala(); addEventListener('resize', escala);
    M.aoQuadro(function (agora, y, perto) {
      var c = M.CAP.logo; if (!perto(c)) { if (tocando && l.stop) { l.stop(); tocando = false; } return; }
      // a área de proteção é contêiner da logo: lê, a cada quadro, quanto HE e LD se afastaram e abre junto
      var s = typeof l._lastL === 'number' ? l._lastL : 0;
      if (Math.abs(s - ultimo) > 0.05) {
        ultimo = s;
        area.setAttribute('x', (-X - s).toFixed(2)); area.setAttribute('width', (1259 + 2 * X + 2 * s).toFixed(2));
        me.setAttribute('x', (-X - s).toFixed(2)); md.setAttribute('x', (1259 + s).toFixed(2)); rot.setAttribute('x', (1259 + X + s).toFixed(2));
      }
      // na parte da área de proteção, a logo toca uma forma de tempos em tempos (uma de cada vez)
      var naProtecao = c.p > 0.5 && c.p < 0.95;
      if (!parado && naProtecao && !tocando && agora > proximo) {
        tocando = true; var pr = l.play(formas[k++ % formas.length]);
        (pr && pr.then ? pr : Promise.resolve()).then(function () { tocando = false; proximo = performance.now() + 1400; });
      }
      if (!naProtecao && tocando && c.p < 0.45 && l.stop) { l.stop(); tocando = false; }
    });
  })();

  /* ---------- o que não fazer: passar o cursor corrige ---------- */
  (function () {
    var cs = qa('.erro-cartao:not(.certo)'); if (!cs.length) return;
    var sobre = null;
    function pintar(on) {
      var l = q('[data-erro="colorir"] heild-logo'), g = l && l.shadowRoot && l.shadowRoot.querySelector('g.i');
      if (g) g.setAttribute('fill', on ? getComputedStyle(l).getPropertyValue('--destaque').trim() : 'currentColor');
    }
    function corrigir(c, on) { c.classList.toggle('corrigido', on); if (c.dataset.erro === 'colorir') pintar(!on); }
    requestAnimationFrame(function () { pintar(true); });
    cs.forEach(function (c) {
      c.addEventListener('pointerenter', function () { sobre = c; corrigir(c, true); });
      c.addEventListener('pointerleave', function () { sobre = null; corrigir(c, false); });
      // no toque não há hover: o toque alterna; com o mouse, o hover já corrige e o clique não desfaz
      var tipo = 'mouse';
      c.addEventListener('pointerdown', function (e) { tipo = e.pointerType; });
      c.addEventListener('click', function () { if (tipo === 'mouse') return; var on = !c.classList.contains('corrigido'); sobre = on ? c : null; corrigir(c, on); });
    });
    if (parado) return;
    var i = 0;
    setInterval(function () {
      if (sobre || !naTela(cs[0])) return;
      var c = cs[i++ % cs.length]; corrigir(c, true);
      setTimeout(function () { if (sobre !== c) corrigir(c, false); }, 1500);
    }, 2400);
  })();

  /* ---------- as formas: uma logo, dezesseis formas, molas ---------- */
  (function () {
    var cap = q('#formas'); if (!cap) return;
    var l = q('.logo-formas', cap), box = q('.chips-formas', cap), nome = q('.nome-forma', cap), desc = q('.forma-desc', cap), uso = q('.forma-uso', cap);
    var atual = -1, mexeu = -1e9, proximo = 0;
    function ir(i, doUsuario) {
      atual = i; var f = G.FORMAS[i];
      l.morph(f.id);
      qa('.chip', box).forEach(function (c, j) { c.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      nome.textContent = f.nome; desc.textContent = f.forma; uso.textContent = 'Quando usar: ' + f.uso + '.';
      if (doUsuario) { mexeu = performance.now(); G.Som.nota(i, 0.4); }
    }
    G.FORMAS.forEach(function (f, i) {
      var c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = f.nome; c.setAttribute('aria-pressed', 'false');
      c.addEventListener('pointerenter', function () { ir(i, true); });
      c.addEventListener('focus', function () { ir(i, true); });
      c.addEventListener('click', function () { ir(i, true); });
      box.appendChild(c);
    });
    ir(0);
    if (parado) return;
    // sozinha, quando ninguém mexe, a logo passa pelas formas, uma de cada vez
    M.aoQuadro(function (agora, y, perto) {
      var c = M.CAP.formas; if (!perto(c) || c.p <= 0.02 || c.p >= 0.99) return;
      if (agora - mexeu < 5000) { proximo = agora + 2600; return; }
      if (agora > proximo) { ir((atual + 1) % G.FORMAS.length); proximo = agora + 2600; }
    });
  })();

  /* ---------- a cor: a escala, as camadas nos dois modos e o contraste ---------- */
  function montarCores() {
    var esc = q('.escala');
    if (esc) {
      esc.innerHTML = G.ESCALA.map(function (p) { return '<li style="--c:var(--areia-' + p + ')"><i></i><b>' + p + '</b><span class="hex"></span></li>'; }).join('');
      qa('li', esc).forEach(function (li, i) { q('.hex', li).textContent = hex(corDe(li, '--areia-' + G.ESCALA[i])); });
    }
    qa('.modos .modo').forEach(function (m) {
      var escuro = m.dataset.modo === 'escuro';
      q('.camadas-demo', m).innerHTML =
        '<div class="cd-fundo"><span class="cd-rot">fundo <i>' + (escuro ? '900 → 950' : '50 → 300') + '</i></span>' +
        '<div class="cd-sup"><span class="cd-rot">superfície <i>' + (escuro ? '850' : '100') + '</i></span>' +
        '<div class="cd-elev"><span class="cd-rot">elevada <i>' + (escuro ? '800' : '50') + '</i></span><p class="cd-texto">Texto <span>e texto suave</span></p></div></div>' +
        '<div class="cd-reb"><span class="cd-rot">rebaixada <i>' + (escuro ? '925 → 950' : '200 → 300') + '</i></span></div></div>';
    });
    var ct = q('.contrastes');
    if (ct) {
      var html = '';
      [['claro', 'forca-claro'], ['escuro', 'forca-escuro']].forEach(function (md) {
        var caixa = document.createElement('div'); caixa.className = md[1]; caixa.style.display = 'none'; document.body.appendChild(caixa);
        html += '<table class="tabela-contraste ' + md[1] + '"><caption>' + (md[0] === 'claro' ? 'Claro' : 'Escuro') + '</caption><thead><tr><th scope="col"></th>' +
          G.CAMADAS_CONTRASTE.map(function (c) { return '<th scope="col">' + c[1] + '</th>'; }).join('') + '</tr></thead><tbody>' +
          G.CONTRASTES.map(function (t) {
            return '<tr><th scope="row">' + t.nome + '</th>' + G.CAMADAS_CONTRASTE.map(function (c) {
              var r = contraste(corDe(caixa, t.texto), corDe(caixa, c[0])), ok = r >= 4.5;
              return '<td style="background:var(' + c[0] + ');color:var(' + t.texto + ')"><span class="razao">' + num(r, 1) + ':1</span><span class="veredito">' + (ok ? 'passa' : 'não passa') + '</span></td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table>';
        caixa.remove();
      });
      ct.innerHTML = html;
    }
  }

  /* ---------- os orbs na prática: os sete estados, cada um com a palavra ---------- */
  (function () {
    var ul = q('.estados-lista'); if (!ul) return;
    ul.innerHTML = G.ESTADOS.map(function (e) {
      return '<li><orb-avatar size="40" mode="fixed" extras="off" data-cor="--orb-consultor" reaction="' + e.reacao + '"' + (parado ? ' static' : '') + ' label="' + h(e.nome) + '"></orb-avatar>' +
        '<span class="e-nome">' + h(e.nome) + '</span><span class="e-faz">' + h(e.faz) + '</span><span class="e-quando">' + h(e.quando) + '</span></li>';
    }).join('');
    M.colorirOrbs();
  })();

  /* ---------- a tipografia: os espécimes e a escala ---------- */
  (function () {
    var ol = q('.escala-tipo');
    if (ol) ol.innerHTML = G.ESCALA_TIPO.map(function (e) {
      var fam = e[1] === 'titulo' ? 'var(--font-titulo)' : e[1] === 'mono' ? 'var(--font-mono)' : 'var(--font-texto)';
      var tab = /^[\d/:]+$/.test(e[6]) ? 'font-variant-numeric:tabular-nums;' : '';
      return '<li><p class="et-amostra" style="font-family:' + fam + ';font-size:' + e[2] + 'px;line-height:' + e[3] + 'px;font-weight:' + e[4] + ';letter-spacing:' + e[5] + ';' + tab + '">' + h(e[6]) + '</p>' +
        '<p class="et-meta"><b>' + h(e[0]) + '</b><span>' + e[2] + '/' + e[3] + ' · ' + e[4] + (e[5] !== '0' ? ' · ' + e[5].replace('.', ',') : '') + '</span><span>' + h(e[7]) + '</span></p></li>';
    }).join('');
    var esp = qa('[data-proximidade-peso]');
    if (parado || !esp.length) return;
    M.aoQuadro(function (agora) {
      esp.forEach(function (el, j) {
        if (!naTela(el)) return;
        var faixa = el.getAttribute('data-proximidade-peso').split(',').map(Number), ls = qa('.letra', el), pt = M.ponteiro, vivo = agora - pt.t < 2500;
        ls.forEach(function (l, i) {
          var w;
          if (vivo) { var r = l.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - pt.x, r.top + r.height / 2 - pt.y), k = Math.max(0, 1 - d / 320); w = faixa[0] + (faixa[1] - faixa[0]) * k * k * (3 - 2 * k); }
          else w = faixa[0] + (faixa[1] - faixa[0]) * (0.5 + 0.5 * Math.sin(agora / 1000 * 1.1 + i * 1.3 + j));
          l.style.fontWeight = Math.round(w);
        });
      });
    });
  })();

  /* ---------- a forma: raios, sombras, espaço ---------- */
  (function () {
    var r = q('.raios');
    // A forma de amostra fica separada do rótulo: o texto nunca encosta na curva do canto.
    if (r) r.innerHTML = G.RAIOS.map(function (x, i) { return '<figure class="raio" style="--r:var(' + x[0] + ');--i:' + i + '"><div class="area-raio"><div class="forma-raio' + (x[0] === '--raio-pilula' ? ' pilula' : '') + '"></div></div><figcaption><b>' + x[0].slice(2) + '</b><span>' + x[1] + ' · ' + x[2] + '</span></figcaption></figure>'; }).join('');
    var s = q('.sombras');
    if (s) s.innerHTML = G.SOMBRAS.map(function (x) { return '<div class="sombra" style="--s:var(' + x[0] + ')"><b>' + x[0].slice(2) + '</b><span>' + x[1] + '</span></div>'; }).join('');
    var e = q('.espacos');
    if (e) e.innerHTML = G.ESPACOS.map(function (x) { return '<li><i style="--w:' + x[1] + 'px"></i><b>espaco-' + x[0] + '</b><span class="px">' + x[1] + ' px</span><span>' + h(x[2]) + '</span></li>'; }).join('');
  })();

  /* ---------- a voz: as falas aparecem sendo escritas, a cerca de 55 caracteres por segundo ---------- */
  (function () {
    var box = q('.falas'); if (!box) return;
    box.innerHTML = G.FALAS.map(function (f) {
      var it = G.porId[f[0]];
      return '<div class="fala"><orb-avatar size="32" mode="drift" extras="off" data-cor="' + it.cor + '"' + (it.olho ? ' data-olho="' + it.olho + '"' : '') + (parado ? ' static' : '') + ' label="' + h(it.nome) + '"></orb-avatar>' +
        '<p><b>' + h(it.nome) + '</b><span class="fala-texto" data-texto="' + h(f[1]) + '">' + h(f[1]) + '</span></p></div>';
    }).join('');
    M.colorirOrbs();
    if (parado) return;
    var spans = qa('.fala-texto', box), i = 0, c = 0, ultimo = 0, pausa = 0;
    spans.forEach(function (s) { s.textContent = ''; s.classList.add('escrevendo'); });
    M.aoQuadro(function (agora) {
      if (!naTela(box)) return;
      if (agora < pausa) return;
      var s = spans[i], txt = s.getAttribute('data-texto');
      if (!ultimo) ultimo = agora;
      var n = Math.floor((agora - ultimo) / (1000 / 55));
      if (n > 0) { c = Math.min(txt.length, c + n); ultimo = agora; s.textContent = txt.slice(0, c); }
      if (c >= txt.length) {
        s.classList.remove('escrevendo'); i++; c = 0; ultimo = 0; pausa = agora + 700;
        if (i >= spans.length) { i = 0; pausa = agora + 4200; setTimeout(function () { spans.forEach(function (x) { x.textContent = ''; x.classList.add('escrevendo'); }); }, 4000); }
      }
    });
  })();

  /* ---------- a aplicação no produto: o orb pequeno do integrante usa a cor dele ---------- */
  qa('.mini-orb[data-cor]').forEach(function (o) { o.style.setProperty('--c', 'var(' + o.getAttribute('data-cor') + ')'); });

  montarCores();
  /* trocou o tema: as cores escritas (hexadecimais, contrastes) são relidas */
  var raiz = document.documentElement;
  new MutationObserver(function () { requestAnimationFrame(montarCores); }).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) { var dm = matchMedia('(prefers-color-scheme: dark)'); if (dm.addEventListener) dm.addEventListener('change', function () { requestAnimationFrame(montarCores); }); }
})();
