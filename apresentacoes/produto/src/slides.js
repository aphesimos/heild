/*
 * Apresentação da Heild — os tipos de slide.
 *
 * Cada tipo recebe os dados de um slide (dados.js) e devolve o HTML; `entrar` liga a cena quando o slide
 * chega (e de novo ao repetir), `passo` responde aos passos da fala e `sair` não precisa limpar nada:
 * os temporizadores e quadros de `api` param sozinhos quando o slide sai.
 */
(function () {
  'use strict';
  var D = window.HEILD_APRESENTACAO;
  var I = D.integrantes;

  var REACAO = { disponivel: 'idle', pensando: 'thinking', trabalhando: 'working', precisa_de_voce: 'needs', concluido: 'done', dormindo: 'sleeping', erro: 'error' };
  var ESTADO_PALAVRA = { disponivel: 'disponível', pensando: 'pensando', trabalhando: 'trabalhando', precisa_de_voce: 'precisa de você', concluido: 'concluído', dormindo: 'em pausa', erro: 'com erro' };

  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function orb(id, o) {
    o = o || {};
    var it = I[id] || I.assistente;
    return '<orb-avatar data-int="' + h(id) + '" data-cor="' + it.cor + '"' + (it.olho ? ' data-olho="' + it.olho + '"' : '') +
      ' size="' + (o.tamanho || 40) + '"' + (o.reacao ? ' reaction="' + o.reacao + '"' : '') + ' mode="' + (o.modo || 'drift') + '"' +
      (o.extras === false ? ' extras="off"' : '') + (o.estatico ? ' static' : '') + (o.vivo ? ' alive' : '') + (o.gaze ? ' gaze="' + o.gaze + '"' : '') +
      ' label="' + h(it.nome) + '"></orb-avatar>';
  }
  function titulo(t, largo) { return '<h2 class="titulo' + (largo ? ' titulo--largo' : '') + '">' + h(t) + '</h2>'; }
  function frase(t, d) { return t ? '<p class="frase" data-e style="--d:' + (d || 320) + 'ms">' + h(t) + '</p>' : ''; }
  function cab(d, extra, largo) { return '<div class="cab">' + titulo(d.titulo, largo) + frase(d.frase) + (extra || '') + '</div>'; }
  function encaixe(w, hgt, html, cls) { return '<div class="visual"><div class="encaixe ' + (cls || '') + '" style="--w:' + w + 'px;--h:' + hgt + 'px">' + html + '</div></div>'; }
  function semente(n) { var x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
  function seloHtml(tipo, texto) { return '<span class="selo' + (tipo && tipo !== 'neutro' ? ' selo--' + tipo : '') + '">' + h(texto) + '</span>'; }
  function q(el, s) { return el.querySelector(s); }
  function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
  function plano(lista) { return lista.reduce(function (a, g) { return a.concat(g.ids); }, []); }
  /* A logo em loop numa forma. O clique toca a forma na hora; quando ela volta à pílula, o loop recomeça. */
  function logoEmLoop(api, logo, forma, comClique) {
    var ligar = function () { if (!api.vivo()) return; logo.removeAttribute('animation'); logo.setAttribute('loop', ''); logo.setAttribute('animation', forma); };
    var tocar = function () { var p = logo.play(forma); if (p && p.then) p.then(ligar); };
    tocar();
    if (comClique !== false) {
      api.ouvir(logo, 'click', tocar);
      api.ouvir(logo, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tocar(); } });
    }
    api.aoSair(function () { logo.removeAttribute('animation'); logo.removeAttribute('loop'); if (logo.stop) logo.stop(); });
  }

  /* A luz da Heild: uma mancha por integrante, espalhadas, que se juntam numa faixa e seguem respirando. */
  function luzHtml(ids) { return '<div class="luz" aria-hidden="true">' + (ids || []).map(function (id) { return '<span style="--c:var(' + I[id].cor + ')"></span>'; }).join('') + '</div>'; }
  function luz(api, el) {
    var box = q(el, '.luz'); if (!box) return;
    var ms = qa(box, 'span'), n = ms.length, t0 = performance.now();
    api.quadro(function (agora) {
      var w = box.clientWidth, hh = box.clientHeight, t = api.parado ? 6 : (agora - t0) / 1000;
      var junta = 1 - Math.pow(1 - Math.min(1, t / 2.4), 3), faixa = Math.min(w * 0.9, 1100);
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2 + 0.6, sx = Math.cos(ang) * w * 0.55, sy = Math.sin(ang) * hh * 0.55;
        var bx = (n === 1 ? 0 : i / (n - 1) - 0.5) * faixa;
        var fx = bx + Math.sin(t * 0.23 + i * 1.7) * w * 0.04, fy = Math.sin(t * 0.37 + i * 2.3) * hh * 0.06;
        var x = sx + (fx - sx) * junta, y = sy + (fy - sy) * junta;
        var s = (0.85 + 0.15 * Math.sin(t * 0.5 + i * 1.1)) * (0.6 + 0.4 * junta);
        ms[i].style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        ms[i].style.opacity = (0.42 * (0.3 + 0.7 * junta)).toFixed(3);
      }
      return !api.parado;
    });
  }

  var T = {};

  /* ---------------- capa ---------------- */
  T.capa = {
    grade: 'toda', semLogo: true, semRodape: true,
    html: function () { return '<div class="centralizado"><heild-logo label="Heild" data-e="zoom"></heild-logo></div>'; },
    entrar: function (el, d, api) {
      var logo = q(el, 'heild-logo');
      logo.setAttribute('loop', '');
      logo.setAttribute('animation', d.forma || 'centralizar');
      api.aoSair(function () { logo.removeAttribute('animation'); logo.removeAttribute('loop'); logo.stop && logo.stop(); });
    }
  };

  /* ---------------- abertura (o hero) ---------------- */
  T.abertura = {
    grade: 'nenhuma',
    html: function (d) {
      var l = d.legendas && d.legendas[0];
      return luzHtml(d.luz) + '<div class="centralizado">' + titulo(d.titulo) + frase(d.frase, 380) +
        (l ? '<div class="legenda" data-e style="--d:700ms"><span class="troca">' + orb(l.quem, { tamanho: 32, reacao: REACAO[l.estado] }) +
          '<span><span class="quem">' + h(I[l.quem].nome) + '</span> <span class="txt">' + h(l.texto) + '</span></span></span></div>' : '') + '</div>';
    },
    entrar: function (el, d, api) {
      luz(api, el);
      var ls = d.legendas || []; if (ls.length < 2) return;
      var troca = q(el, '.troca'), o = q(el, '.legenda orb-avatar'), quem = q(el, '.quem'), txt = q(el, '.txt'), i = 0;
      api.intervalo(function () {
        troca.classList.add('sai');
        api.depois(420, function () {
          i = (i + 1) % ls.length; var l = ls[i];
          o.dataset.cor = I[l.quem].cor; api.colorir(o); o.setAttribute('reaction', REACAO[l.estado] || 'idle');
          quem.textContent = I[l.quem].nome; txt.textContent = l.texto;
          troca.classList.remove('sai');
        });
      }, 3800);
    }
  };

  /* ---------------- nome ---------------- */
  T.nome = {
    html: function () {
      return '<div class="dividido">' + cab({ titulo: 'Heild quer dizer o inteiro.', frase: 'Do islandês: o todo, sem partes separadas, com raiz no nórdico antigo heill, inteiro. É o que o sistema faz com as ferramentas de uma empresa.' }) +
        '<div class="visual"><div class="definicao" data-e="dir" style="--d:300ms">' +
        '<div class="verbete">heild</div><p class="rotulo">islandês · raiz no nórdico antigo heill</p>' +
        '<ol class="acepcoes"><li><span>1</span><span>o inteiro</span></li><li><span>2</span><span>o todo, sem partes separadas</span></li></ol>' +
        '<heild-logo label="Heild" style="margin-top:28px" tabindex="0" role="button" aria-label="Tocar a forma centralizar"></heild-logo>' +
        '<p class="rotulo">Na forma centralizar, a grade de nove pontos volta a ser uma peça só.</p></div></div></div>';
    },
    entrar: function (el, d, api) {
      var logo = q(el, 'heild-logo');
      api.depois(1100, function () { logoEmLoop(api, logo, 'centralizar'); });
    }
  };

  /* ---------------- problema: as peças soltas que viram uma só ---------------- */
  T.problema = {
    passos: 1,
    html: function (d) {
      var W = 640, H = 470, cols = 4, fs = d.ferramentas || [], rows = Math.ceil(fs.length / cols);
      var pecas = fs.map(function (f, k) {
        var c = k % cols, r = Math.floor(k / cols);
        var x = (c + 0.5) * (W / cols) + (semente(k + 1) - 0.5) * 56 + (r % 2 ? 22 : -22);
        var y = (r + 0.5) * (H / rows) + (semente(k + 40) - 0.5) * 30;
        var rot = (semente(k + 80) - 0.5) * 12;
        return '<span class="peca" style="--x:' + x.toFixed(0) + 'px;--y:' + y.toFixed(0) + 'px;--r:' + rot.toFixed(1) + 'deg;--cx:' + (W / 2 - x).toFixed(0) + 'px;--cy:' + (H / 2 - y).toFixed(0) + 'px;--k:' + k + ';--t:' + (2.6 + semente(k + 7) * 2.4).toFixed(2) + 's"><span class="pilula">' + h(f) + '</span></span>';
      }).join('');
      return '<div class="dividido">' + cab(d, '<p class="titulo-pagina" data-passo="1">Tudo, num lugar só.</p>') +
        encaixe(W, H, '<div class="nuvem" role="button" tabindex="0" aria-label="Juntar as ferramentas">' + pecas + '<heild-logo class="junta-logo" label="Heild"></heild-logo></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var n = q(el, '.nuvem');
      api.ouvir(n, 'click', function () { api.avancar(); });
    },
    passo: function (el, p, api) {
      var n = q(el, '.nuvem'), logo = q(el, '.junta-logo');
      if (p >= 1) { n.classList.add('junta'); api.depois(1400, function () { if (n.classList.contains('junta')) logoEmLoop(api, logo, 'centralizar', false); }); }
      else { n.classList.remove('junta'); logo.removeAttribute('animation'); logo.removeAttribute('loop'); if (logo.stop) logo.stop(); }
    }
  };

  /* ---------------- camadas: os planos descem e viram um só ---------------- */
  T.camadas = {
    html: function (d) {
      var ps = d.planos || [], n = ps.length, top = 64, passo = 58, yb = top + n * passo;
      var planos = ps.map(function (nome, i) {
        return '<div class="plano" style="--y:' + (top + i * passo) + 'px;--atraso:' + (i * 90) + 'ms;--atraso-j:' + ((n - i) * 80) + 'ms"><div class="placa"></div>' +
          '<span class="etiqueta' + (i % 2 ? ' esq' : '') + '"><span class="pilula">' + h(nome) + '</span></span></div>';
      }).join('');
      var base = '<div class="plano base" style="--y:' + yb + 'px;--atraso:' + (n * 90) + 'ms"><div class="placa"></div></div>';
      return '<div class="dividido">' + cab(d, '<p class="rotulo" data-e style="--d:600ms">Clique no desenho para separar e juntar de novo.</p>') +
        encaixe(620, 560, '<div class="pilha inicio" style="--yb:' + yb + 'px" role="button" tabindex="0" aria-label="Separar e juntar as camadas">' +
          '<div class="fio" style="top:' + top + 'px;height:' + (yb - top) + 'px"></div>' + base + planos +
          '<div class="base-orb" style="top:' + (yb - 18) + 'px">' + orb(d.orb || 'assistente', { tamanho: 56, reacao: 'working' }) + '</div>' +
          '<p class="rotulo rotulo-base" style="top:' + (yb + 100) + 'px">Uma superfície só, sobre o mesmo cadastro</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var p = q(el, '.pilha');
      p.classList.add('inicio'); p.classList.remove('junto');
      api.depois(80, function () { p.classList.remove('inicio'); });
      var mexeu = 0;
      api.depois(2200, function () {
        p.classList.add('junto');
        api.intervalo(function () { if (performance.now() - mexeu < 8000) return; p.classList.toggle('junto'); }, 4600);
      });
      api.ouvir(p, 'click', function () { mexeu = performance.now(); p.classList.toggle('junto'); });
      api.ouvir(p, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); mexeu = performance.now(); p.classList.toggle('junto'); } });
    },
    sair: function (el) { var p = q(el, '.pilha'); p.classList.add('inicio'); p.classList.remove('junto'); }
  };

  /* ---------------- logo: a construção ---------------- */
  T.logo = {
    html: function () {
      // A logo tem 520 de largura em (120, 155) dentro de 760 × 470: sobra espaço para HE e LD se afastarem
      // (até ~9% da largura para cada lado) sem a área livre sair do desenho.
      var L = 520, LX = 120, LY = 155, k = L / 1259, X = function (v) { return (LX + v * k).toFixed(1); }, Y = function (v) { return (LY + v * k).toFixed(1); };
      var pw = 147.3 * k;
      var anot =
        '<svg class="anot" viewBox="0 0 760 470" aria-hidden="true">' +
        '<rect class="area traco-area" data-x="' + (LX - pw).toFixed(1) + '" data-w="' + (L + 2 * pw).toFixed(1) + '" x="' + (LX - pw).toFixed(1) + '" y="' + (LY - pw).toFixed(1) + '" width="' + (L + 2 * pw).toFixed(1) + '" height="' + (387 * k + 2 * pw).toFixed(1) + '" rx="6" fill="none" style="stroke:var(--texto-suave);stroke-width:1.2"/>' +
        '<text class="t2 rot-area traco-area" data-x="' + (LX + L + pw).toFixed(1) + '" x="' + (LX + L + pw).toFixed(1) + '" y="' + (LY - pw - 8).toFixed(1) + '" text-anchor="end">área livre: a largura da pílula</text>' +
        '<g data-lado="he"><line class="traco" style="--l:110;--d:500ms" x1="' + X(258) + '" y1="' + Y(10) + '" x2="' + X(258) + '" y2="44"/><circle class="aparece" style="--d:500ms" cx="' + X(258) + '" cy="' + Y(10) + '" r="3"/>' +
        '<text class="aparece" style="--d:900ms" x="' + X(258) + '" y="32" text-anchor="middle">H e E dividem a haste</text></g>' +
        '<line class="traco" style="--l:110;--d:900ms" x1="' + X(634.3) + '" y1="' + Y(0) + '" x2="' + X(634.3) + '" y2="44"/><circle class="aparece" style="--d:900ms" cx="' + X(634.3) + '" cy="' + Y(0) + '" r="3"/>' +
        '<text class="aparece" style="--d:1300ms" x="' + X(634.3) + '" y="32" text-anchor="middle">O I fica sozinho: a pílula</text>' +
        '<g data-lado="ld"><line class="traco" style="--l:140;--d:1300ms" x1="' + X(900) + '" y1="' + Y(348) + '" x2="' + X(900) + '" y2="436"/><circle class="aparece" style="--d:1300ms" cx="' + X(900) + '" cy="' + Y(348) + '" r="3"/>' +
        '<text class="aparece" style="--d:1700ms" x="' + X(900) + '" y="456" text-anchor="middle">L e D dividem a base</text></g>' +
        '</svg>';
      var regras = '<ul class="regras">' + [
        ['Uma cor só', 'A primária sobre o fundo. Sem gradiente, sombra ou segunda cor, nem no I.'],
        ['Área livre', 'Em volta, pelo menos a largura da pílula: cerca de 12% da logo. Quando ela anima, a área acompanha.'],
        ['72 px no mínimo', 'Abaixo disso, só a pílula, como ícone.'],
        ['Não faça', 'Esticar, inclinar, colorir o I ou trocar a pílula por um I comum.']
      ].map(function (r, i) { return '<li data-e style="--d:' + (500 + i * 90) + 'ms">' + h(r[0]) + '<span>' + h(r[1]) + '</span></li>'; }).join('') + '</ul>';
      return '<div class="dividido dividido--estreito">' + cab({ titulo: 'A pílula é a marca.' }, regras) +
        encaixe(760, 470, '<div class="construcao">' + anot + '<heild-logo label="Heild" tabindex="0" role="button" aria-label="Tocar a forma orb"></heild-logo></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var logo = q(el, 'heild-logo'), svg = q(el, 'svg.anot'), k = 520 / 1259;
      var area = q(svg, 'rect.area'), rot = q(svg, '.rot-area'), he = q(svg, '[data-lado="he"]'), ld = q(svg, '[data-lado="ld"]');
      var ax = +area.dataset.x, aw = +area.dataset.w, rx = +rot.dataset.x, ultimo = -1;
      // A área livre é um contêiner da logo: lê, a cada quadro, quanto HE e LD se afastaram e acompanha.
      api.quadro(function () {
        var s = (typeof logo._lastL === 'number' ? logo._lastL : 0) * k;
        if (Math.abs(s - ultimo) > 0.05) {
          ultimo = s;
          area.setAttribute('x', (ax - s).toFixed(2)); area.setAttribute('width', (aw + 2 * s).toFixed(2));
          rot.setAttribute('x', (rx + s).toFixed(2));
          he.setAttribute('transform', 'translate(' + (-s).toFixed(2) + ' 0)'); ld.setAttribute('transform', 'translate(' + s.toFixed(2) + ' 0)');
        }
        return true;
      });
      // A logo toca o orb e descansa como pílula um tempo, para a construção ser lida; o clique toca na hora.
      var tocando = false;
      function tocar() { if (tocando) return; tocando = true; var p = logo.play('orb'); (p && p.then ? p : Promise.resolve()).then(function () { tocando = false; }); }
      api.depois(2800, tocar);
      api.intervalo(tocar, 9000);
      api.ouvir(logo, 'click', function () { tocando = false; tocar(); });
      api.ouvir(logo, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tocando = false; tocar(); } });
    }
  };

  /* ---------------- formas: a vitrine do I ---------------- */
  T.formas = {
    html: function (d) {
      var bs = D.formas.map(function (f) { return '<button type="button" data-forma="' + f.id + '" aria-pressed="false">' + h(f.nome) + '</button>'; }).join('');
      return '<div class="empilhado">' + cab({ titulo: 'O I se transforma em cada coisa.', frase: 'Grade, orb, barras, check, balão de fala. Uma forma por momento, e ela sempre volta a ser a pílula.' }, '', true) +
        '<div class="vitrine" data-e style="--d:400ms"><heild-logo label="Heild"></heild-logo>' +
        '<div class="legenda-forma" aria-live="polite"><b>Passe o cursor numa forma</b><span>ou deixe a vitrine passar sozinha</span></div>' +
        '<div class="grade-formas" role="group" aria-label="As formas do I">' + bs + '</div></div></div>';
    },
    entrar: function (el, d, api) {
      var logo = q(el, 'heild-logo'), leg = q(el, '.legenda-forma'), grade = q(el, '.grade-formas'), bs = qa(el, '.grade-formas button');
      var fs = D.formas, idx = Math.max(0, fs.findIndex(function (f) { return f.id === (d.destaque || 'centralizar'); })), mexeu = 0;
      function mostrar(id) {
        var f = fs.find(function (x) { return x.id === id; }); if (!f) return;
        logo.morph(id);
        bs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.forma === id)); });
        leg.innerHTML = '<b>' + h(f.nome) + '</b><span>' + h(f.forma) + ' · ' + h(f.uso) + '</span>';
      }
      bs.forEach(function (b, i) {
        var ir = function () { mexeu = performance.now(); idx = i; mostrar(b.dataset.forma); };
        api.ouvir(b, 'pointerenter', ir); api.ouvir(b, 'focus', ir); api.ouvir(b, 'click', ir);
      });
      api.ouvir(grade, 'pointerleave', function () { mexeu = performance.now(); });
      api.depois(900, function () { mostrar(fs[idx].id); });
      api.intervalo(function () {
        if (performance.now() - mexeu < 7000) return;
        idx = (idx + 1) % fs.length; mostrar(fs[idx].id);
      }, 3200);
      api.aoSair(function () { logo.morph(null); });
    }
  };

  /* ---------------- movimento: a linha do tempo ---------------- */
  T.movimento = {
    html: function () {
      var regras = '<ul class="regras-mov">' + [
        ['Material', 'Só cápsulas e círculos com as pontas redondas.'],
        ['Limite', 'A forma nunca passa da altura das letras.'],
        ['Espaço', 'HE e LD se afastam na medida exata da forma.'],
        ['Ritmo', 'Contração, cascata, pausa e retorno com assentamento.']
      ].map(function (r, i) { return '<li data-e style="--d:' + (500 + i * 90) + 'ms"><b>' + r[0] + '</b>' + r[1] + '</li>'; }).join('') + '</ul>';
      return '<div class="dividido">' + cab({ titulo: 'Contração, divisão, pausa, retorno.', frase: 'O I engorda um pouco, se divide em cápsulas em cascata, segura a forma e volta com um leve assentamento.' }, regras) +
        encaixe(660, 420, '<div style="display:flex;flex-direction:column;align-items:center;gap:30px"><heild-logo class="logo-mov" label="Heild"></heild-logo>' +
          '<div class="trilha"><div class="fases"><div class="fase" data-f="0"></div><div class="fase" data-f="1"></div><div class="fase" data-f="2"></div></div><span class="cabeca-leitura"></span>' +
          '<div class="marcas"><span>0 s</span><span class="nome-forma"></span><span class="total"></span></div></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var logo = q(el, 'heild-logo'), fases = qa(el, '.fase'), cab = q(el, '.cabeca-leitura'), trilha = q(el, '.trilha');
      var nomeF = q(el, '.nome-forma'), total = q(el, '.total');
      var seq = [['contabil', 'Contábil', 1600], ['bpo', 'BPO', 1600], ['tempo', 'Tempo', 2200], ['financeiro', 'Financeiro', 1600]], k = 0;
      var nomes = ['Contração e divisão', 'Pausa', 'Retorno'];
      function ms(v) { return v.toLocaleString('pt-BR') + ' ms'; }
      function rodar() {
        var s = seq[k++ % seq.length], dur = [1000, s[2], 900], tot = dur[0] + dur[1] + dur[2];
        fases.forEach(function (f, i) { f.style.setProperty('--ms', dur[i]); f.innerHTML = '<span style="text-align:center;line-height:14px">' + nomes[i] + '<br><span class="suave">' + ms(dur[i]) + '</span></span>'; });
        nomeF.textContent = 'forma ' + s[1]; total.textContent = (tot / 1000).toLocaleString('pt-BR') + ' s';
        var t0 = performance.now();
        logo.play(s[0]);
        api.quadro(function (agora) {
          var t = Math.min(tot, agora - t0), W = trilha.clientWidth;
          cab.style.setProperty('--x', (t / tot * W).toFixed(1) + 'px');
          var f = t < dur[0] ? 0 : t < dur[0] + dur[1] ? 1 : 2;
          fases.forEach(function (x, i) { x.classList.toggle('atual', i === f); });
          if (t >= tot) { api.depois(1300, rodar); return false; }
          return true;
        });
      }
      api.depois(700, rodar);
    }
  };

  /* ---------------- areia: a escala ---------------- */
  var PASSOS = [[50, 'fundo e elevada no claro'], [100, 'superfície no claro; texto e primária no escuro'], [150, 'lateral no claro'], [200, 'rebaixada no claro'], [300, 'borda e fim do fundo no claro'], [400, 'fim da lateral no claro; texto suave no escuro'], [500, 'listras do valor estimado'], [600, 'passo intermediário'], [650, 'texto suave no claro'], [700, 'passo intermediário'], [800, 'elevada e borda no escuro'], [850, 'texto no claro; superfície no escuro'], [900, 'primária no claro; fundo no escuro'], [925, 'rebaixada no escuro'], [950, 'fim do fundo no escuro']];
  T.areia = {
    html: function () {
      var am = PASSOS.map(function (p, i) { return '<button type="button" class="amostra" style="--c:var(--areia-' + p[0] + ');--i:' + i + '" data-p="' + p[0] + '" aria-label="areia-' + p[0] + '"></button>'; }).join('');
      var usos = '<ul class="camadas-uso" data-e style="--d:700ms">' + [['--fundo', 'fundo', '50 · escuro 900'], ['--superficie', 'superfície', '100 · escuro 850'], ['--elevada', 'elevada', '50 · escuro 800'], ['--rebaixada', 'rebaixada', '200 · escuro 925']]
        .map(function (u) { return '<li><i style="--c:var(' + u[0] + ')"></i><span>' + u[1] + '</span><span class="suave">claro ' + u[2] + '</span></li>'; }).join('') + '</ul>';
      return '<div class="dividido">' + cab({ titulo: 'Todo neutro sai de uma escala só.', frase: 'A areia vai do 50 ao 950, quente, num matiz só. A interface é feita de camadas dela; um cinza frio não pertence à Heild.' },
        usos + '<p class="destaque-linha" data-e style="--d:820ms"><i></i>Um destaque, o índigo, em pontos pequenos.</p>') +
        '<div class="visual"><div style="display:flex;flex-direction:column;align-items:center"><div class="escala" role="group" aria-label="A escala de areia">' + am + '</div>' +
        '<div class="leitura" aria-live="polite"><b>areia</b><span>passe o cursor num passo</span></div></div></div></div>';
    },
    entrar: function (el, d, api) {
      var bs = qa(el, '.amostra'), lb = q(el, '.leitura b'), ls = q(el, '.leitura span');
      function mostrar(b) {
        bs.forEach(function (x) { x.classList.toggle('sel', x === b); });
        var p = PASSOS.find(function (x) { return String(x[0]) === b.dataset.p; });
        var hex = getComputedStyle(b).getPropertyValue('--c').trim() || getComputedStyle(document.documentElement).getPropertyValue('--areia-' + p[0]).trim();
        lb.textContent = 'areia-' + p[0]; ls.textContent = hex + ' · ' + p[1];
      }
      bs.forEach(function (b) { api.ouvir(b, 'pointerenter', function () { mostrar(b); }); api.ouvir(b, 'focus', function () { mostrar(b); }); api.ouvir(b, 'click', function () { mostrar(b); }); });
      var i = 0; api.intervalo(function () { if (el.matches(':hover')) return; mostrar(bs[[0, 2, 3, 4, 8, 11, 12, 14][i++ % 8]]); }, 2200);
    }
  };

  /* ---------------- claro e escuro ---------------- */
  function telaMini() {
    return '<div class="tela-mini"><div class="lat"><span class="sig">HE</span><i class="at"></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="cont"><div class="abas"><span class="at">Assistente</span><span>Time</span><span>Visão geral</span></div>' +
      '<div class="pergunta">No que posso ajudar?' + orb('assistente', { tamanho: 40, modo: 'follow' }) + '</div>' +
      '<div class="sugestoes"><span>Feche outubro da Metalúrgica Andrade</span><span>Quem está aguardando documento?</span></div>' +
      '<div class="campo"><span>Peça ao Assistente…</span><div class="acoes"><span class="mais"></span><span class="enviar"></span></div></div></div></div>';
  }
  T.claroescuro = {
    html: function () {
      return '<div class="dividido dividido--estreito">' + cab({ titulo: 'Claro e escuro valem o mesmo.', frase: 'Cada camada tem o seu passo de areia em cada modo. No escuro, o que sobe fica mais claro, nunca mais escuro.' },
        '<p class="rotulo" data-e style="--d:600ms">Arraste a divisória para comparar.</p>') +
        encaixe(780, 450, '<div class="comparador"><div class="lado forca-claro">' + telaMini() + '</div><div class="lado lado-escuro forca-escuro">' + telaMini() + '</div>' +
          '<div class="marcas-modo"><span class="pilula forca-claro" style="background:var(--elevada);color:var(--texto)">Claro</span><span class="pilula forca-escuro" style="background:var(--elevada);color:var(--texto)">Escuro</span></div>' +
          '<button type="button" class="alca" role="slider" aria-label="Divisória entre claro e escuro" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span aria-hidden="true">‹ ›</span></button></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var c = q(el, '.comparador'), alca = q(el, '.alca'), v = 88, mexeu = false;
      function por(x) { v = Math.max(4, Math.min(96, x)); c.style.setProperty('--corte', v + '%'); alca.setAttribute('aria-valuenow', Math.round(v)); }
      por(88);
      var t0 = performance.now();
      api.quadro(function (agora) {
        if (mexeu) return false;
        var ms = agora - t0 - 700; if (ms < 0) return true;
        if (ms < 1400) { var t = ms / 1400; por(88 - 38 * (1 - Math.pow(1 - t, 3))); return true; }
        por(50 - 24 * Math.sin((ms - 1400) / 1000 * Math.PI * 2 / 7));
        return true;
      });
      var arrastando = false;
      function mover(e) { var r = c.getBoundingClientRect(); por((e.clientX - r.left) / r.width * 100); }
      api.ouvir(c, 'pointerdown', function (e) { mexeu = arrastando = true; c.setPointerCapture(e.pointerId); mover(e); });
      api.ouvir(c, 'pointermove', function (e) { if (arrastando) mover(e); });
      api.ouvir(c, 'pointerup', function () { arrastando = false; });
      api.ouvir(alca, 'keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); mexeu = true; por(v + (e.key === 'ArrowLeft' ? -5 : 5)); } });
    }
  };

  /* ---------------- tipografia ---------------- */
  T.tipografia = {
    html: function () {
      var regras = '<ul class="regras" style="display:flex;flex-direction:column;gap:12px;margin:0;padding:0;list-style:none">' + [
        ['Títulos grandes são leves.', 'De 24 px para cima, peso 300. O hero do site e da apresentação é a exceção, em 500.'],
        ['Ênfase é 500.', 'Hierarquia com tamanho, peso e o texto suave, não com mais cores.'],
        ['Caixa normal.', 'Nenhum rótulo em caixa alta. A mono só para dado, como CTB-016.']
      ].map(function (r, i) { return '<li data-e style="--d:' + (500 + i * 90) + 'ms;display:flex;flex-direction:column;gap:2px;font-size:16px;line-height:24px">' + r[0] + '<span class="suave" style="font-size:14px;line-height:20px">' + r[1] + '</span></li>'; }).join('') + '</ul>';
      return '<div class="dividido dividido--meio">' + cab({ titulo: 'Uma família, dois cortes.', frase: 'A PP Neue Montreal nos títulos e a Neue Montreal Text, feita para tamanhos pequenos, em toda a interface.' }, regras) +
        encaixe(540, 560, '<div style="display:flex;flex-direction:column;gap:18px"><div class="especime"><div class="aa" aria-hidden="true">Aa</div>' +
          '<label class="peso"><span>Peso</span><input type="range" id="peso-titulo" min="100" max="900" step="10" value="300"><output for="peso-titulo">300</output></label></div>' +
          '<div class="cortes"><div class="cartao corte"><p class="rotulo"><span>PP Neue Montreal · títulos</span><span>300 no produto · 500 no hero</span></p><p class="amostra-titulo">Fechamento de outubro</p><p class="amostra-hero">Tudo, num lugar só.</p></div>' +
          '<div class="cartao corte"><p class="rotulo"><span>PP Neue Montreal Text · interface</span><span>14 px · 400 e 500</span></p><p class="amostra-texto">Conciliei 41 de 44 lançamentos. Os 3 que sobraram estão na tarefa <span class="codigo">CTB-016</span>.</p></div></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var r = q(el, 'input'), o = q(el, 'output'), aa = q(el, '.aa'), mexeu = false;
      function por(v) { aa.style.setProperty('--peso', v); o.textContent = v; r.value = v; }
      api.ouvir(r, 'input', function () { mexeu = true; por(r.value); });
      api.ouvir(r, 'keydown', function (e) { e.stopPropagation(); });
      var vals = [300, 500, 200, 700, 400, 300], i = 0;
      api.intervalo(function () { if (!mexeu) por(vals[i++ % vals.length]); }, 1600);
    }
  };

  /* ---------------- voz ---------------- */
  T.voz = {
    html: function () {
      return '<div class="dividido">' + cab({ titulo: 'Fala como um colega do escritório.', frase: 'Frases curtas, voz ativa e os termos do ofício sem explicação. Os integrantes dizem o que fizeram e o que falta.' },
        '<div class="pilulas" data-e style="--d:600ms"><span class="pilula">Primeira pessoa</span><span class="pilula">O botão diz o que acontece: Aprovar</span><span class="pilula">PGDAS-D, fator R, lote</span><span class="pilula">Sem emoji</span></div>') +
        '<div class="visual"><div class="falas"><p class="antes" data-e style="--d:400ms">A conciliação foi processada.</p><p class="depois" aria-live="polite"></p>' +
        '<div class="cartao msg" data-e style="--d:900ms">' + orb('fiscal', { tamanho: 32, reacao: 'working' }) + '<div><span class="autor">Fiscal</span><p class="texto-msg"></p></div></div></div></div></div>';
    },
    entrar: function (el, d, api) {
      var dep = q(el, '.depois'), msg = q(el, '.texto-msg'), o = q(el, '.msg orb-avatar');
      (async function () {
        await api.esperar(1200);
        for (;;) {
          dep.textContent = ''; msg.textContent = ''; o.setAttribute('reaction', 'working');
          await api.digitar(dep, 'Conciliei 41 de 44 lançamentos.', 30);
          await api.esperar(500);
          await api.digitar(msg, 'Conferi as DCTFWeb de outubro dos 6 clientes. Cinco batem com a folha; a da Rota Sul tem R$ 312,40 a menos de INSS. Corrigi o rascunho e deixei na fila de transmissão.', 55);
          o.setAttribute('reaction', 'done');
          await api.esperar(5000);
        }
      })().catch(function () {});
    }
  };

  /* ---------------- time ---------------- */
  // O estado de cada um quando o slide abre: os mesmos da demonstração do protótipo.
  var ESTADO_TIME = { assistente: 'trabalhando', consultor: 'pensando', fiscal: 'precisa_de_voce', dp: 'concluido', contabil: 'trabalhando', societario: 'precisa_de_voce', notas: 'trabalhando',
    atendimento: 'trabalhando', financeiro: 'pensando', bpo_pagar: 'concluido', bpo_receber: 'trabalhando', bpo_conciliacao: 'precisa_de_voce', bpo_gerencial: 'concluido' };
  // Para onde cada estado vai quando o integrante passa para a próxima coisa.
  var PROXIMO = { trabalhando: 'concluido', concluido: 'disponivel', disponivel: 'pensando', pensando: 'trabalhando', precisa_de_voce: 'trabalhando' };
  T.time = {
    html: function (d) {
      var gs = (d.grupos || []).map(function (g, gi) {
        return '<div class="grupo" data-e style="--d:' + (300 + gi * 160) + 'ms"><p class="rotulo">' + h(g.nome) + '</p><div class="linha-orbs">' +
          g.ids.map(function (id) { var e = ESTADO_TIME[id] || 'disponivel'; return '<button type="button" class="integrante" data-id="' + id + '" data-estado="' + e + '">' + orb(id, { tamanho: 52, modo: 'follow', reacao: REACAO[e] }) + '<span class="nome">' + h(I[id].nome) + '</span><span class="estado-int">' + h(ESTADO_PALAVRA[e]) + '</span></button>'; }).join('') + '</div></div>';
      }).join('');
      return '<div class="dividido dividido--estreito">' + cab(d, '<div class="ficha" aria-live="polite" data-e style="--d:600ms"><b>Passe o cursor num orb</b><span>Clique para cutucar.</span></div>') +
        '<div class="visual"><div class="grupos">' + gs + '</div></div></div>';
    },
    entrar: function (el, d, api) {
      var ficha = q(el, '.ficha'), bs = qa(el, '.integrante'), sobre = null;
      function mostrar(b) {
        sobre = b; var it = I[b.dataset.id];
        ficha.innerHTML = '<b>' + h(it.nome) + ' · <span class="suave" style="font-size:24px">' + h(ESTADO_PALAVRA[b.dataset.estado]) + '</span></b><span>' + h(it.faz) + '</span>';
      }
      function mudar(b, e) {
        b.dataset.estado = e; q(b, 'orb-avatar').setAttribute('reaction', REACAO[e]); q(b, '.estado-int').textContent = ESTADO_PALAVRA[e];
        if (sobre === b) mostrar(b);
      }
      bs.forEach(function (b) {
        var o = q(b, 'orb-avatar');
        api.ouvir(b, 'pointerenter', function () { mostrar(b); }); api.ouvir(b, 'focus', function () { mostrar(b); });
        api.ouvir(b, 'click', function () { mostrar(b); if (o.poke) o.poke(); });
      });
      // O time segue trabalhando: a cada pouco, um integrante passa para a próxima coisa.
      var ultimo = -1;
      api.intervalo(function () {
        var k; do { k = Math.floor(Math.random() * bs.length); } while (bs.length > 1 && k === ultimo);
        ultimo = k; mudar(bs[k], PROXIMO[bs[k].dataset.estado] || 'trabalhando');
      }, 2600);
    }
  };

  /* ---------------- orb: os estados ---------------- */
  var ESTADOS = [
    ['disponivel', 'Disponível', 'Parado, olhando. Sem trabalho agora.'],
    ['pensando', 'Pensando', 'Olhos para cima, antes de responder.'],
    ['trabalhando', 'Trabalhando', 'Vaga e olha em volta: uma tarefa em andamento.'],
    ['precisa_de_voce', 'Precisa de você', 'Chama a atenção: deixou um cartão esperando.'],
    ['concluido', 'Concluído', 'Contente: terminou e entregou.'],
    ['dormindo', 'Em pausa', 'Olhos fechados: integrante pausado.'],
    ['erro', 'Com erro', 'Aflito: algo falhou e precisa de alguém.']
  ];
  T.orb = {
    html: function (d) {
      var it = I[d.quem] || I.contabil;
      var bs = '<div class="estados" role="group" aria-label="Estados do integrante" data-e style="--d:500ms">' + ESTADOS.map(function (e, i) {
        return '<button type="button" data-estado="' + e[0] + '" aria-pressed="' + (i === 0) + '">' + e[1] + '</button>';
      }).join('') + '</div>';
      return '<div class="dividido">' + cab({ titulo: 'O orb mostra o que ele está fazendo.', frase: 'É o rosto de cada integrante e o único movimento contínuo do produto. O estado vem sempre com a palavra, nunca só com a reação.' }, bs) +
        '<div class="visual"><div class="palco-orb">' + orb(d.quem || 'contabil', { tamanho: 240, modo: 'follow' }) +
        '<p class="rotulo-estado"><b class="enfase">' + h(it.nome) + '</b><span class="suave">·</span><span class="palavra">disponível</span></p><p class="descricao-estado suave"></p></div></div></div>';
    },
    entrar: function (el, d, api) {
      var o = q(el, '.palco-orb > orb-avatar'), bs = qa(el, '.estados button'), pal = q(el, '.palavra'), desc = q(el, '.descricao-estado'), i = 0, mexeu = 0;
      function por(k) {
        i = k; var e = ESTADOS[k];
        o.setAttribute('reaction', REACAO[e[0]]); pal.textContent = ESTADO_PALAVRA[e[0]]; desc.textContent = e[2];
        bs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); });
      }
      bs.forEach(function (b, k) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(k); }); });
      api.ouvir(o, 'click', function () { o.poke && o.poke(); });
      por(0);
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; por((i + 1) % ESTADOS.length); }, 3000);
    }
  };

  /* ---------------- passagem: o pedido que anda de orb em orb ---------------- */
  T.passagem = {
    html: function (d) {
      var elos = ['assistente'].concat(d.cadeia.map(function (c) { return c.quem; }));
      var cadeia = '<div class="cadeia" style="--n:' + elos.length + '">' + elos.map(function (id, i) {
        return '<div class="elo" data-i="' + i + '">' + orb(id, { tamanho: 56 }) + '<div><div class="nome">' + h(I[id].nome) + '</div><div class="estado">disponível</div></div></div>';
      }).join('') + '</div>';
      return '<div class="dividido dividido--estreito">' + cab({ titulo: 'Um pedido, o time inteiro.', frase: 'O Assistente recebe, divide e acompanha. Cada integrante faz a sua parte e passa adiante; o que tem efeito fora volta como cartão.' },
        '<button type="button" class="botao botao--fantasma botao--pequeno repetir-cena" data-e style="--d:700ms;align-self:flex-start">Repetir a cena</button>') +
        encaixe(740, 480, '<div class="cena">' + cadeia + '<div class="conversa"><div class="rolo" aria-live="polite"></div><div class="campo-pedido"><span class="texto-campo suave">Peça ao Assistente…</span><span class="enviar"></span></div></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var rolo = q(el, '.rolo'), campo = q(el, '.texto-campo'), elos = qa(el, '.elo'), cadeia = q(el, '.cadeia');
      api.ouvir(q(el, '.repetir-cena'), 'click', function () { api.repetir(); });
      rolo.innerHTML = ''; campo.textContent = 'Peça ao Assistente…'; campo.classList.add('suave');
      elos.forEach(function (e) { estado(e, 'disponivel'); });
      function estado(e, est, txt) { q(e, 'orb-avatar').setAttribute('reaction', REACAO[est]); q(e, '.estado').textContent = txt || ESTADO_PALAVRA[est]; }
      function add(html) { var w = document.createElement('div'); w.className = 'entra-msg'; w.innerHTML = html; rolo.appendChild(w); api.colorir(w); while (rolo.children.length > 8) rolo.removeChild(rolo.firstChild); return w; }
      function fala(id, extra) { return add('<div class="fala">' + orb(id, { tamanho: 26, estatico: true, extras: false }) + '<div><span class="autor">' + h(I[id].nome) + '</span><span class="t"></span>' + (extra || '') + '</div></div>'); }
      /* A passagem: um fio pontilhado liga os orbs; na vez de passar, uma cápsula (o material da logo) sai da
         borda de um orb, anda pelo fio em 1,6 s com um rastro curto e deixa o fio preenchido atrás de si. */
      var NS = 'http://www.w3.org/2000/svg', fios = document.createElementNS(NS, 'svg'), trechos = [];
      fios.setAttribute('class', 'fios-cadeia'); fios.setAttribute('aria-hidden', 'true'); cadeia.insertBefore(fios, cadeia.firstChild);
      function local(o) { var r = o.getBoundingClientRect(), rc = cadeia.getBoundingClientRect(), k = rc.width / cadeia.offsetWidth || 1; return { x: (r.left - rc.left + r.width / 2) / k, y: (r.top - rc.top + r.height / 2) / k, r: r.width / 2 / k }; }
      function desenharFios() {
        var w = cadeia.offsetWidth, hh = cadeia.offsetHeight;
        fios.setAttribute('viewBox', '0 0 ' + w + ' ' + hh); fios.setAttribute('width', w); fios.setAttribute('height', hh);
        fios.innerHTML = ''; trechos = [];
        for (var i = 0; i < elos.length - 1; i++) {
          var A = local(q(elos[i], 'orb-avatar')), B = local(q(elos[i + 1], 'orb-avatar'));
          var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
          var x1 = A.x + ux * (A.r + 8), y1 = A.y + uy * (A.r + 8), x2 = B.x - ux * (B.r + 8), y2 = B.y - uy * (B.r + 8), len = Math.hypot(x2 - x1, y2 - y1);
          var base = document.createElementNS(NS, 'line'), cheio = document.createElementNS(NS, 'line');
          [base, cheio].forEach(function (l) { l.setAttribute('x1', x1.toFixed(1)); l.setAttribute('y1', y1.toFixed(1)); l.setAttribute('x2', x2.toFixed(1)); l.setAttribute('y2', y2.toFixed(1)); fios.appendChild(l); });
          base.setAttribute('class', 'fio-base'); cheio.setAttribute('class', 'fio-cheio');
          cheio.style.strokeDasharray = len.toFixed(1); cheio.style.strokeDashoffset = len.toFixed(1);
          trechos.push({ x1: x1, y1: y1, x2: x2, y2: y2, len: len, ang: Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, cheio: cheio });
        }
      }
      function viajar(a, b) {
        var t = trechos[a], oa = q(elos[a], 'orb-avatar'), ob = q(elos[b], 'orb-avatar');
        if (!t) return api.esperar(1600);
        if (oa.poke) oa.poke(0.45, { react: false });
        if (api.parado) { t.cheio.style.strokeDashoffset = '0'; return api.esperar(300); }
        var g = document.createElementNS(NS, 'g'), rastro = [];
        for (var k = 3; k >= 1; k--) { var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', (3.2 - k * 0.6).toFixed(1)); c.setAttribute('class', 'rastro'); g.appendChild(c); rastro.push([c, k]); }
        var ficha = document.createElementNS(NS, 'rect');
        ficha.setAttribute('x', '-9'); ficha.setAttribute('y', '-4.5'); ficha.setAttribute('width', '18'); ficha.setAttribute('height', '9'); ficha.setAttribute('rx', '4.5'); ficha.setAttribute('class', 'ficha-viagem');
        g.appendChild(ficha); fios.appendChild(g);
        var ease = function (x) { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
        var ponto = function (e) { return [t.x1 + (t.x2 - t.x1) * e, t.y1 + (t.y2 - t.y1) * e]; };
        return new Promise(function (res) {
          var t0 = performance.now(), D = 1600;
          api.quadro(function (agora) {
            var u = Math.min(1, (agora - t0) / D), e = ease(u), p = ponto(e);
            var esc = 0.7 + 0.3 * Math.sin(Math.PI * u), alfa = Math.min(1, u * 8, (1 - u) * 8);
            ficha.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + t.ang.toFixed(1) + ') scale(' + esc.toFixed(3) + ' 1)');
            ficha.style.opacity = alfa.toFixed(3);
            rastro.forEach(function (r) { var q2 = ponto(ease(u - r[1] * 0.035)); r[0].setAttribute('cx', q2[0].toFixed(1)); r[0].setAttribute('cy', q2[1].toFixed(1)); r[0].style.opacity = (alfa * (0.5 - r[1] * 0.12)).toFixed(3); });
            t.cheio.style.strokeDashoffset = (t.len * (1 - e)).toFixed(1);
            if (u >= 1) { g.remove(); if (ob.poke) ob.poke(0.7, { react: false }); res(); return false; }
            return true;
          });
        });
      }
      var e0 = elos[0];
      (async function () {
       for (;;) {
        rolo.innerHTML = ''; campo.textContent = 'Peça ao Assistente…'; campo.classList.add('suave');
        elos.forEach(function (e) { estado(e, 'disponivel'); });
        await api.esperar(900);
        desenharFios();
        campo.classList.remove('suave'); campo.textContent = '';
        await api.digitar(campo, d.pedido, 32, true);
        await api.esperar(350);
        campo.textContent = 'Peça ao Assistente…'; campo.classList.add('suave');
        add('<div class="bolha">' + h(d.pedido) + '</div>');
        estado(e0, 'pensando');
        await api.esperar(1500);
        estado(e0, 'trabalhando', 'acompanhando');
        await api.digitar(q(fala('assistente'), '.t'), ' ' + d.resposta, 55);
        for (var i = 0; i < d.cadeia.length; i++) {
          var c = d.cadeia[i], de = i === 0 ? 0 : i, elo = elos[i + 1];
          add('<div class="passagem-cartao">' + orb(i === 0 ? 'assistente' : d.cadeia[i - 1].quem, { tamanho: 18, estatico: true, extras: false }) + '<span>' + h(I[i === 0 ? 'assistente' : d.cadeia[i - 1].quem].nome) + ' passou a ' + h(I[c.quem].nome) + ': ' + h(c.tarefa) + '</span></div>');
          if (i > 0) estado(elos[i], 'concluido');
          await viajar(de, i + 1);
          estado(elo, 'trabalhando');
          var f = fala(c.quem, '<div class="etapa"><span class="giro"></span><span class="et"></span></div>'), et = q(f, '.et');
          for (var k = 0; k < c.etapas.length; k++) { et.textContent = c.etapas[k]; q(elo, '.estado').textContent = c.etapas[k]; await api.esperar(1050); }
          q(f, '.etapa').remove();
          await api.digitar(q(f, '.t'), ' ' + c.fim, 55);
          estado(elo, 'concluido');
        }
        var ult = d.cadeia[d.cadeia.length - 1].quem, eloCartao = elos[d.cadeia.findIndex(function (c) { return c.quem === d.cartao.quem; }) + 1] || elos[elos.length - 1];
        await api.esperar(400);
        var fim = fala('assistente');
        await api.digitar(q(fim, '.t'), ' ' + d.final, 55);
        if (d.tabela) add('<table class="mini-tabela">' + d.tabela.map(function (r) { return '<tr><td>' + h(r[0]) + '</td><td>' + h(r[1]) + '</td></tr>'; }).join('') + '</table>');
        await api.esperar(300);
        add('<div class="cartao-aprovar"><div style="display:flex;align-items:center;gap:8px">' + orb(d.cartao.quem, { tamanho: 20, estatico: true, extras: false }) + '<span class="t">' + h(d.cartao.titulo) + '</span></div><dl>' +
          d.cartao.campos.map(function (c) { return '<dt>' + h(c[0]) + '</dt><dd>' + h(c[1]) + '</dd>'; }).join('') + '</dl>' +
          '<div style="display:flex;gap:8px;align-items:center">' + (d.cartao.selo ? seloHtml('atencao', d.cartao.selo) : '<span class="botao botao--pequeno">Aprovar</span><span class="botao botao--pequeno botao--fantasma">Editar e aprovar</span>') + '</div></div>');
        estado(eloCartao, 'precisa_de_voce'); estado(e0, 'concluido', 'acompanhou até o fim');
        await api.esperar(7000);
       }
      })().catch(function () {});
    }
  };

  /* ---------------- aprovação ---------------- */
  T.aprovacao = {
    html: function (d) {
      var sempre = '<ul class="sempre">' + ['Transmitir', 'Pagar', 'Assinar', 'Enviar ao cliente'].map(function (s, i) { return '<li data-e style="--d:' + (550 + i * 80) + 'ms">' + s + '</li>'; }).join('') + '</ul>';
      return '<div class="dividido">' + cab({ titulo: 'A IA prepara. Uma pessoa aprova.', frase: 'Sempre por um cartão, no chat, no Painel ou no celular. A aprovação fica registrada com o nome de quem aprovou.' }, sempre) +
        encaixe(580, 440, '<div class="cartao-grande" data-e="zoom" style="--d:300ms"><div class="quem">' + orb(d.quem, { tamanho: 36, reacao: 'needs' }) +
          '<div><b>' + h(I[d.quem].nome) + '</b><span class="estado-c">' + h(d.estado) + '</span></div></div>' +
          '<div class="o-que"><b>' + h(d.titulo) + '</b><span>' + h(d.sub) + '</span></div>' +
          '<dl>' + d.campos.map(function (c) { return '<div><dt>' + h(c[0]) + '</dt><dd>' + h(c[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<div class="decisao"></div></div>' +
          '<svg class="cursor-demo" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2 L4 19 L8.6 14.6 L11.6 21.4 L14.4 20.2 L11.4 13.6 L18 13.6 Z" fill="var(--texto)" stroke="var(--fundo)" stroke-width="1.5" stroke-linejoin="round"/></svg>') + '</div>';
    },
    entrar: function (el, d, api) {
      var dec = q(el, '.decisao'), o = q(el, '.quem orb-avatar'), est = q(el, '.estado-c'), cur = q(el, '.cursor-demo'), cartao = q(el, '.cartao-grande');
      var manual = false;
      function inicio() {
        o.setAttribute('reaction', 'needs'); est.textContent = d.estado;
        dec.innerHTML = '<div class="botoes"><button type="button" class="botao b-aprovar">Aprovar</button><button type="button" class="botao botao--fantasma">Editar e aprovar</button><button type="button" class="botao botao--fantasma">Recusar</button></div>';
        var b = q(dec, '.b-aprovar');
        api.ouvir(b, 'click', function () { manual = true; cur.style.opacity = '0'; aprovar('você'); });
        qa(dec, '.botao--fantasma').forEach(function (x) { api.ouvir(x, 'click', function () { x.textContent = 'Na demonstração, só Aprovar'; }); });
        return b;
      }
      function aprovar(quem) {
        o.setAttribute('reaction', 'done'); est.textContent = d.depois.tipo === 'progresso' ? 'transmitindo' : 'aprovado';
        dec.innerHTML = '<p class="carimbo"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Aprovado por ' + h(quem) + ' às 14:02</p>' +
          (d.depois.tipo === 'progresso' ? '<div class="barra"><span class="trilho"><i></i></span><span class="cont">0 de ' + d.depois.total + ' ' + h(d.depois.rotulo) + '</span></div>' : '<p class="corpo suave">' + h(d.depois.texto) + '</p>');
        if (d.depois.tipo === 'progresso') {
          var i = 0, bar = q(dec, '.trilho i'), cont = q(dec, '.cont');
          api.depois(500, function passo() { i++; bar.style.setProperty('--v', (i / d.depois.total * 100) + '%'); cont.textContent = i + ' de ' + d.depois.total + ' ' + d.depois.rotulo; if (i < d.depois.total) api.depois(140, passo); });
        }
        if (!manual) api.depois(5200, ciclo);
      }
      function ciclo() {
        var b = inicio();
        if (api.parado) return;
        var enc = el.querySelector('.encaixe'), x = 0, y = 0;
        function medir() { var base = enc.getBoundingClientRect(), rb = b.getBoundingClientRect(), k = base.width / enc.offsetWidth || 1; x = (rb.left - base.left) / k + rb.width / k * 0.55; y = (rb.top - base.top) / k + rb.height / k * 0.6; }
        api.depois(700, function () { if (manual) return; medir(); cur.style.transition = 'none'; cur.style.opacity = '0'; cur.style.transform = 'translate(' + (x + 170) + 'px,' + (y + 110) + 'px)'; void cur.offsetWidth; cur.style.transition = ''; });
        api.depois(1100, function () { if (manual) return; medir(); cur.style.opacity = '1'; cur.style.transform = 'translate(' + x + 'px,' + y + 'px)'; });
        api.depois(2400, function () { if (!manual) b.classList.add('apertado'); });
        api.depois(2700, function () { if (manual) return; aprovar(d.aprovador); api.depois(900, function () { cur.style.opacity = '0'; }); });
      }
      ciclo();
    }
  };

  /* ---------------- lei ---------------- */
  T.lei = {
    html: function (d) {
      return '<div class="dividido">' + cab(d, d.outra ? '<a class="link-outra" data-e style="--d:700ms" href="' + h(d.outra.href) + '" target="_blank" rel="noopener">' + h(d.outra.texto) + '</a>' : '') +
        encaixe(600, 490, '<div class="consulta"><div class="pergunta"><span class="t-perg"></span></div>' +
          '<div class="resposta aparece r-cartao"><div class="quem">' + orb('consultor', { tamanho: 36 }) + '<b>Consultor</b><span class="suave est-lei">pensando</span></div><p class="t-resp"></p>' +
          '<blockquote class="aparece r-trecho">' + h(d.trecho) + '</blockquote>' +
          '<div class="norma aparece r-norma"><b>' + h(d.norma) + '</b><span class="suave">' + h(d.vigencia) + ' · ' + h(d.hierarquia) + '</span></div>' +
          '<div class="rodape-lei aparece r-rod">' + seloHtml('sucesso', d.grau) + '<span>' + h(d.calculo) + '</span></div></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var tp = q(el, '.t-perg'), tr = q(el, '.t-resp'), o = q(el, '.resposta orb-avatar'), est = q(el, '.est-lei');
      var partes = qa(el, '.aparece');
      (async function () {
       for (;;) {
        partes.forEach(function (p) { p.classList.remove('on'); });
        tp.textContent = ''; tr.textContent = ''; o.setAttribute('reaction', 'thinking'); est.textContent = 'pensando';
        await api.esperar(800);
        await api.digitar(tp, d.pergunta, 32, true);
        await api.esperar(300);
        q(el, '.r-cartao').classList.add('on');
        await api.esperar(2200);
        o.setAttribute('reaction', 'working'); est.textContent = 'respondendo';
        await api.digitar(tr, d.resposta, 55);
        o.setAttribute('reaction', 'idle'); est.textContent = 'respondeu';
        for (var k of ['.r-trecho', '.r-norma', '.r-rod']) { await api.esperar(260); q(el, k).classList.add('on'); }
        await api.esperar(7000);
       }
      })().catch(function () {});
    }
  };

  /* ---------------- módulos ---------------- */
  T.modulos = {
    html: function (d) {
      var its = d.itens || [];
      return '<div class="empilhado">' + cab(d, '', true) + '<div class="vitrine-mod" data-e style="--d:400ms"><heild-logo label="Heild"></heild-logo>' +
        '<div class="lista-mod" style="--col:' + Math.ceil(its.length / 2) + '" role="group" aria-label="Os módulos">' + its.map(function (m) {
          return '<button type="button" class="mod" data-forma="' + m[1] + '" aria-pressed="false"><b>' + h(m[0]) + '</b><span>' + h(m[2]) + '</span></button>';
        }).join('') + '</div></div></div>';
    },
    entrar: function (el, d, api) { vitrineMorph(el, api, '.mod'); }
  };
  function vitrineMorph(el, api, sel) {
    var logo = q(el, 'heild-logo'), bs = qa(el, sel), mexeu = 0, i = -1;
    function por(k) { i = k; bs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); }); logo.morph(k < 0 ? null : bs[k].dataset.forma); }
    bs.forEach(function (b, k) {
      var ir = function () { mexeu = performance.now(); por(k); };
      api.ouvir(b, 'pointerenter', ir); api.ouvir(b, 'focus', ir); api.ouvir(b, 'click', ir);
    });
    api.depois(1000, function () { por(0); });
    api.intervalo(function () { if (performance.now() - mexeu < 7000) return; por((i + 1) % bs.length); }, 3000);
    api.aoSair(function () { logo.morph(null); });
  }

  /* ---------------- tela: uma tela do produto, com abas ---------------- */
  T.tela = {
    html: function (d) {
      var abas = d.abas || [];
      return '<div class="dividido dividido--estreito">' + cab(d, '<p class="rotulo" data-e style="--d:600ms">Troque de aba para ver cada setor.</p>') +
        encaixe(720, 470, '<div class="tela" data-e="zoom" style="--d:250ms"><div class="abas-tela" role="tablist">' + abas.map(function (a, i) {
          return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + h(a.nome) + '</button>';
        }).join('') + '</div><div class="corpo-tela" role="tabpanel"></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var corpo = q(el, '.corpo-tela'), bs = qa(el, '.abas-tela button'), i = 0, mexeu = 0;
      function por(k) {
        i = k; var a = d.abas[k];
        bs.forEach(function (b, j) { b.setAttribute('aria-selected', String(j === k)); });
        corpo.innerHTML = '<div class="cab-tela"><div><div class="t">' + h(a.nome) + '</div><div class="s">' + a.linhas.length + ' itens · ' + h(I[a.quem].nome) + ' ' + h(ESTADO_PALAVRA[a.estado] || '') + '</div></div>' +
          '<div class="fala-integrante"><span>' + h(a.fala) + '</span>' + orb(a.quem, { tamanho: 34, reacao: REACAO[a.estado] }) + '</div></div>' +
          '<div class="linhas">' + a.linhas.map(function (l, k2) {
            return '<div class="linha" style="--k:' + k2 + '"><div><div class="t">' + h(l[0]) + '</div>' + (l[1] ? '<div class="s">' + h(l[1]) + '</div>' : '') + '</div>' + seloHtml(l[2], l[3]) + '<div class="v">' + h(l[4]) + '</div></div>';
          }).join('') + '</div>';
        api.colorir(corpo);
      }
      bs.forEach(function (b, k) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(k); }); });
      por(0);
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; por((i + 1) % d.abas.length); }, 4200);
    }
  };

  /* ---------------- conversa (CRM) ---------------- */
  T.conversa = {
    html: function (d) {
      var funil = d.funil ? '<div><p class="rotulo" style="margin-bottom:6px">Leads · ' + h(d.funil.rotulo) + '</p><div class="funil">' + d.funil.etapas.map(function (e, i) { return '<span data-i="' + i + '"' + (i === d.funil.de ? ' class="at"' : '') + '>' + h(e) + '</span>'; }).join('') + '</div></div>' : '';
      return '<div class="dividido dividido--estreito">' + cab(d) +
        encaixe(740, 460, '<div class="crm"><div class="fio-conversa"><div class="topo-conversa"><div><b>' + h(d.contato) + '</b><div class="rotulo">' + h(d.empresa) + '</div></div><span class="selo">' + h(d.canal) + '</span></div><div class="mensagens" aria-live="polite"></div></div>' +
          '<div class="ficha-cli"><b>Ficha</b><dl>' + (d.ficha || []).map(function (f) { return '<div><dt>' + h(f[0]) + '</dt><dd>' + h(f[1]) + '</dd></div>'; }).join('') + '</dl>' + funil + '</div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var box = q(el, '.mensagens');
      var funil = qa(el, '.funil span');
      (async function () {
       for (;;) {
        box.innerHTML = '';
        if (d.funil) funil.forEach(function (s, i) { s.classList.toggle('at', i === d.funil.de); });
        await api.esperar(700);
        for (var i = 0; i < d.mensagens.length; i++) {
          var m = d.mensagens[i];
          var dig = document.createElement('div'); dig.className = 'digitando' + (m.de === 'escritorio' ? '' : ''); dig.style.alignSelf = m.de === 'escritorio' ? 'flex-end' : 'flex-start'; dig.innerHTML = '<i></i><i></i><i></i>';
          box.appendChild(dig);
          await api.esperar(m.de === 'escritorio' ? 1600 : 1100);
          dig.remove();
          var w = document.createElement('div'); w.className = (m.de === 'escritorio' ? 'msg-esc' : 'msg-cli') + ' entra-msg';
          w.innerHTML = h(m.texto) + (m.anexo ? '<div class="anexo"><i></i>' + h(m.anexo) + '</div>' : '') + '<small>' + (m.quem ? h(I[m.quem].nome) + ' · ' : '') + h(m.hora) + '</small>';
          box.appendChild(w);
          await api.esperar(900);
        }
        if (d.funil) { await api.esperar(600); funil.forEach(function (s, i) { s.classList.toggle('at', i === d.funil.para); }); }
        await api.esperar(5500);
       }
      })().catch(function () {});
    }
  };

  /* ---------------- timesheet ---------------- */
  T.timesheet = {
    html: function () {
      // De 8h a 18h. Blocos [início em h, fim em h, confiança, cliente]
      var voce = [[8.5, 10, 'auto', 'Metalúrgica'], [10, 10.7, 'conf', 'Padaria'], [10.7, 11.6, 'est', 'Clínica'], [13, 14.5, 'auto', 'Metalúrgica'], [14.5, 15, 'sem', ''], [15, 16.8, 'conf', 'Loja Bela Vista'], [16.8, 17.6, 'est', 'Padaria']];
      var ia = [[8, 8.4], [9.1, 9.5], [10.2, 11.3], [12, 12.3], [13.4, 14.2], [15.5, 15.8], [16.4, 17.2]];
      var pct = function (v) { return ((v - 8) / 10 * 100).toFixed(2) + '%'; };
      var bl = function (b, k, cls) { return '<span class="bloco ' + cls + '" title="' + h(b[3] || '') + '" style="--de:' + pct(b[0]) + ';--dur:' + ((b[1] - b[0]) / 10 * 100).toFixed(2) + '%;--k:' + k + '"></span>'; };
      var horas = [8, 10, 12, 14, 16, 18].map(function (x) { return '<span>' + x + 'h</span>'; }).join('');
      return '<div class="dividido dividido--estreito">' + cab({ titulo: 'O tempo se registra sozinho.', frase: 'A plataforma, os sistemas contábeis e a extensão contam o tempo de cada tarefa. A pessoa só confirma o que ficou estimado.' }) +
        encaixe(720, 440, '<div class="cartao dia" data-e="zoom" style="--d:250ms"><div class="t">Onde foi o meu dia?</div>' +
          '<div class="faixas"><div class="faixa"><span>Você</span><div class="trilho-dia">' + voce.map(function (b, k) { return bl(b, k, b[2]); }).join('') + '</div></div>' +
          '<div class="faixa"><span>Integrantes</span><div class="trilho-dia">' + ia.map(function (b, k) { return bl(b, k + 3, 'ia'); }).join('') + '</div></div>' +
          '<div class="horas"><span></span><div>' + horas + '</div></div></div>' +
          '<div class="legenda-conf"><span><i style="background:var(--texto)"></i>Automática</span><span><i style="background:var(--texto-suave)"></i>Confirmada</span><span><i style="background:var(--listras-estimado);box-shadow:inset 0 0 0 1px var(--areia-500)"></i>Estimada</span><span><i style="outline:1.5px dashed var(--texto-suave);outline-offset:-1.5px"></i>Sem classificação</span><span><i style="background:color-mix(in srgb,var(--texto) 30%,transparent)"></i>Integrantes, à parte</span></div>' +
          '<div class="conta"><span>Custo-hora do escritório</span><span class="r">R$ 300,00</span><span>Horas no mês com o cliente</span><span class="r">2 h</span><span>Custo</span><span class="r">R$ 600,00</span><span>Honorário</span><span class="r">R$ 500,00</span><span class="total">Abaixo da neutralidade</span><span class="r total">−R$ 100,00</span></div>' +
          '<p class="rotulo">Rentabilidade: o exemplo do plano, com o custo-hora único do escritório.</p></div>') + '</div>';
    }
  };

  /* ---------------- app do cliente ---------------- */
  T.app = {
    html: function (d) {
      return '<div class="dividido">' + cab(d, '<p class="rotulo" data-e style="--d:600ms">Toque nos botões do aparelho.</p>') +
        encaixe(660, 600, '<div class="lado-a-lado"><div class="aparelho"><div class="tela-app"><div class="topo-app"><span>' + h(d.empresa) + '</span><span>14:10</span></div><div class="ola">' + h(d.ola) + '</div>' +
          d.itens.map(function (it, i) {
            return '<div class="item-app"><b>' + h(it.titulo) + '</b>' + (it.sub ? '<span class="s">' + h(it.sub) + '</span>' : '') +
              (it.linhas || []).map(function (l) { return '<div class="linha-v"><span class="s">' + h(l[0]) + '</span><span>' + h(l[1]) + '</span></div>'; }).join('') +
              '<button type="button" class="botao" data-i="' + i + '">' + h(it.acao) + '</button></div>';
          }).join('') + '</div></div>' +
          '<div class="eventos"><p class="rotulo">Chegou ao escritório</p><p class="vazio">Nada ainda. O que o cliente faz no app aparece aqui.</p></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ev = q(el, '.eventos'), vazio = q(el, '.vazio'), feitos = {}, tocou = false;
      var bs = qa(el, '.tela-app .botao');
      function zerar() {
        feitos = {}; qa(ev, '.evento').forEach(function (e) { e.remove(); }); vazio.hidden = false;
        bs.forEach(function (b, i) { b.disabled = false; b.textContent = d.itens[i].acao; b.classList.remove('botao--fantasma', 'apertado'); });
      }
      function fazer(i) {
        if (feitos[i]) return; feitos[i] = true;
        var it = d.itens[i]; vazio.hidden = true;
        bs[i].textContent = 'Feito'; bs[i].disabled = true; bs[i].classList.add('botao--fantasma');
        var w = document.createElement('div'); w.className = 'evento';
        w.innerHTML = orb('assistente', { tamanho: 24, estatico: true, extras: false }) + '<div>' + h(it.evento[0]) + '<small>' + h(it.evento[1]) + ' · agora</small></div>';
        ev.appendChild(w); api.colorir(w);
      }
      bs.forEach(function (b, i) { api.ouvir(b, 'click', function () { tocou = true; fazer(i); }); });
      zerar();
      (async function () {
        await api.esperar(3200);
        for (;;) {
          for (var i = 0; i < bs.length; i++) {
            if (tocou) return;
            bs[i].classList.add('apertado'); await api.esperar(260); bs[i].classList.remove('apertado');
            if (tocou) return;
            fazer(i); await api.esperar(2600);
          }
          await api.esperar(3200);
          if (tocou) return;
          zerar(); await api.esperar(1600);
        }
      })().catch(function () {});
    }
  };

  /* ---------------- regras e princípios ---------------- */
  T.regras = {
    grade: 'nenhuma',
    html: function (d) {
      return '<div class="empilhado">' + cab(d, '', true) + '<ol class="lista-regras">' + d.itens.map(function (r, i) {
        return '<li data-e style="--d:' + (380 + i * 140) + 'ms"><span class="n">' + (i + 1) + '</span><span class="r"><b>' + h(r[0]) + '</b><span>' + h(r[1]) + '</span></span></li>';
      }).join('') + '</ol></div>';
    }
  };

  /* ---------------- outra plataforma, por cima ---------------- */
  T.outra = {
    html: function (d) {
      var p = D.plataformas[d.plataforma], ch = p.chamada || { titulo: p.nome, frase: p.resumo, itens: [] };
      var ids = plano(p.time).filter(function (id) { return id !== 'assistente' && id !== 'consultor'; });
      return '<div class="dividido dividido--meio">' + cab({ titulo: ch.titulo, frase: ch.frase }, '<ul class="itens-outra" data-e style="--d:560ms">' + ch.itens.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul>') +
        encaixe(520, 440, '<div class="plat" data-e="zoom" style="--d:300ms"><heild-logo class="logo-outra" label="Heild" tabindex="0" role="button" aria-label="Tocar a forma"></heild-logo><b>' + h(p.nome) + '</b><p>' + h(p.resumo) + '</p>' +
          '<div class="orbs-linha">' + ids.map(function (id) { return orb(id, { tamanho: 34, modo: 'follow' }); }).join('') + '<span class="rotulo">' + ids.map(function (id) { return I[id].nome; }).join(', ') + '</span></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var p = D.plataformas[d.plataforma], logo = q(el, 'heild-logo');
      api.depois(1100, function () { logoEmLoop(api, logo, p.forma); });
    }
  };

  /* ---------------- plataformas ---------------- */
  T.plataformas = {
    html: function (d) {
      var ps = Object.keys(D.plataformas).map(function (k) { return D.plataformas[k]; });
      return '<div class="empilhado">' + cab(d, '', true) + '<div style="display:flex;flex-direction:column;align-items:center;gap:22px;--d:400ms" data-e><heild-logo class="logo-plat" label="Heild"></heild-logo>' +
        '<div class="lista-plat" style="--col:' + Math.min(3, ps.length) + '">' + ps.map(function (p) {
          var ids = plano(p.time).filter(function (id) { return id !== 'assistente' && id !== 'consultor'; });
          return '<button type="button" class="plat" data-forma="' + p.forma + '" aria-pressed="false"><b>' + h(p.nome) + '</b><p>' + h(p.resumo) + '</p><div class="orbs-linha">' + ids.map(function (id) { return orb(id, { tamanho: 28, extras: false, estatico: true }); }).join('') + '</div><span class="rotulo">Versão própria desta apresentação: #' + p.id + '</span></button>';
        }).join('') + '</div></div></div>';
    },
    entrar: function (el, d, api) { vitrineMorph(el, api, '.plat'); }
  };

  /* ---------------- um sistema, um fato ---------------- */
  T.umfato = {
    html: function (d) {
      var W = 720, H = 460, cx = W / 2, cy = H / 2, n = d.destinos.length, rx = 262, ry = 172;
      var nos = '', fios = '';
      d.destinos.forEach(function (x, i) {
        var a = -Math.PI / 2 + i / n * Math.PI * 2, nx = cx + Math.cos(a) * rx, ny = cy + Math.sin(a) * ry;
        var mx = (cx + nx) / 2 + Math.sin(a) * 30, my = (cy + ny) / 2 - Math.cos(a) * 30;
        fios += '<path d="M' + cx + ' ' + cy + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1) + '"/>';
        nos += '<div class="no" style="left:' + nx.toFixed(1) + 'px;top:' + ny.toFixed(1) + 'px"><b><span class="ponto" style="color:var(--texto-suave)"></span>' + h(x[0]) + '</b><span>' + h(x[1]) + '</span></div>';
      });
      return '<div class="dividido dividido--estreito">' + cab(d, '<button type="button" class="botao botao--fantasma botao--pequeno repetir-cena" data-e style="--d:700ms;align-self:flex-start">Repetir</button>') +
        encaixe(W, H, '<div class="rede"><svg class="fios" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + fios + '<g class="pulsos"></g></svg>' +
          '<div class="no-centro" data-e="zoom" style="--d:300ms">' + orb('assistente', { tamanho: 28, extras: false, estatico: true }) + '<b>' + h(d.evento) + '</b><span>' + h(d.sub) + '</span></div>' + nos + '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ps = qa(el, '.fios path'), nos = qa(el, '.no'), g = q(el, '.pulsos');
      api.ouvir(q(el, '.repetir-cena'), 'click', function () { api.repetir(); });
      g.innerHTML = '';
      var NS = 'http://www.w3.org/2000/svg';
      var cs = ps.map(function () { var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '4'); c.style.opacity = '0'; g.appendChild(c); return c; });
      var t0 = performance.now() + 1100;
      function apagar() { nos.forEach(function (n) { n.classList.remove('aceso'); }); ps.forEach(function (p) { p.classList.remove('aceso'); }); }
      apagar();
      api.quadro(function (agora) {
        if (agora - t0 > ps.length * 140 + 950 + 4200) { apagar(); t0 = agora + 700; }
        var todos = true;
        ps.forEach(function (p, i) {
          var t = (agora - t0 - i * 140) / 950;
          if (t < 0) { todos = false; return; }
          if (t >= 1) { cs[i].style.opacity = '0'; if (!nos[i].classList.contains('aceso')) { nos[i].classList.add('aceso'); p.classList.add('aceso'); } return; }
          todos = false;
          var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, L = p.getTotalLength(), pt = p.getPointAtLength(e * L);
          cs[i].setAttribute('cx', pt.x.toFixed(1)); cs[i].setAttribute('cy', pt.y.toFixed(1)); cs[i].style.opacity = '1';
        });
        return true;
      });
    }
  };

  /* ---------------- conectores ---------------- */
  T.conectores = {
    html: function (d) {
      var aneis = d.aneis || [], raios = [150, 252], tempos = [140, 200];
      var orb2 = aneis.map(function (itens, k) {
        var r = raios[k] || 150 + k * 100, t = tempos[k] || 160;
        return '<div class="anel" style="width:' + (2 * r) + 'px;height:' + (2 * r) + 'px"></div><div class="giro-anel" style="--t:' + t + 's;animation-direction:' + (k % 2 ? 'reverse' : 'normal') + '">' +
          itens.map(function (x, i) { return '<span class="no-con" style="--a:' + (i / itens.length * 360 + k * 17).toFixed(1) + 'deg;--raio:' + r + 'px"><span class="pilula" style="--t:' + t + 's;animation-direction:' + (k % 2 ? 'normal' : 'reverse') + '">' + h(x) + '</span></span>'; }).join('') + '</div>';
      }).join('');
      var grupos = '<ul class="grupos-con">' + (d.grupos || []).map(function (g, i) { return '<li data-e style="--d:' + (500 + i * 90) + 'ms">' + h(g[0]) + '<span>' + h(g[1]) + '</span></li>'; }).join('') + '</ul>';
      return '<div class="dividido dividido--meio">' + cab(d, grupos) + encaixe(600, 560, '<div class="orbita" data-e="zoom" style="--d:250ms;height:560px">' + orb2 + '<heild-logo class="centro-con" label="Heild"></heild-logo></div>') + '</div>';
    }
  };

  /* ---------------- marca branca ---------------- */
  function luminancia(hex) { var c = hex.replace('#', ''), r = parseInt(c.substr(0, 2), 16) / 255, g = parseInt(c.substr(2, 2), 16) / 255, b = parseInt(c.substr(4, 2), 16) / 255; return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  T.marcabranca = {
    html: function (d) {
      var bs = '<div class="amostras" role="group" aria-label="Temas de exemplo" data-e style="--d:560ms">' + d.temas.map(function (t, i) {
        return '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '" style="--c:' + t.claro.primaria + '"><i></i>' + h(t.rotulo) + '</button>';
      }).join('') + '</div>';
      return '<div class="dividido dividido--estreito">' + cab(d, bs) +
        encaixe(680, 420, '<div class="app-tema" data-e="zoom" style="--d:250ms"><div class="lat"><span class="sig">HE</span><i></i><i></i><i></i><i></i></div><div class="cont">' +
          '<div class="topo"><span class="nome-prod">Heild</span><span class="novo" aria-label="novo"></span></div>' +
          '<div class="bloco-tema"><span class="h">Hoje</span>' +
          '<div class="linha-int"><orb-avatar class="orb-dp" size="30" reaction="done" label="DP"></orb-avatar><div><b class="nome-dp">DP</b> preparou os contratos de experiência da Padaria<small>há 2 min</small></div></div>' +
          '<div class="linha-int"><orb-avatar class="orb-fiscal" size="30" reaction="needs" label="Fiscal"></orb-avatar><div><b>Fiscal</b> deixou as guias da Metalúrgica para você aprovar<small>expira em 2 dias</small></div></div>' +
          '<span class="acao">Aprovar</span></div><div><p style="margin:0 0 6px;font-size:12px;opacity:.72">Limite de IA da janela de 5 horas</p><div class="barra-ia"><i></i></div></div></div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var app = q(el, '.app-tema'), bs = qa(el, '.amostras button'), i = 0, mexeu = 0;
      function por(k) {
        i = k; var t = d.temas[k], escuro = api.escuro(), m = escuro ? t.escuro : t.claro;
        bs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); });
        app.style.setProperty('--m-fundo', m.fundo); app.style.setProperty('--m-texto', m.texto); app.style.setProperty('--m-primaria', m.primaria);
        app.style.setProperty('--m-destaque', m.destaque); app.style.setProperty('--m-sobre', luminancia(m.primaria) > 0.5 ? '#0b0b0f' : '#ffffff');
        app.style.setProperty('--m-fonte-titulo', t.titulo); app.style.setProperty('--m-fonte-texto', t.texto); app.style.setProperty('--m-raio', t.raio);
        q(app, '.sig').textContent = t.sigla; q(app, '.nome-prod').textContent = t.nome; q(app, '.nome-dp').textContent = t.dp;
        q(app, '.orb-dp').setAttribute('color', t.dpCor); q(app, '.orb-dp').setAttribute('label', t.dp);
        q(app, '.orb-fiscal').setAttribute('color', getComputedStyle(document.documentElement).getPropertyValue('--orb-fiscal').trim());
      }
      bs.forEach(function (b, k) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(k); }); });
      api.aoTema(function () { por(i); });
      por(0);
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; por((i + 1) % d.temas.length); }, 3400);
    }
  };

  /* ---------------- fecho ---------------- */
  T.fecho = {
    grade: 'nenhuma', semLogo: true,
    html: function (d) { return luzHtml(d.luz) + '<div class="centralizado"><heild-logo label="Heild" data-e="zoom"></heild-logo>' + titulo(d.titulo) + '</div>'; },
    entrar: function (el, d, api) {
      luz(api, el);
      var logo = q(el, 'heild-logo');
      logo.setAttribute('loop', ''); logo.setAttribute('animation', d.forma || 'orbs');
      api.aoSair(function () { logo.removeAttribute('animation'); logo.removeAttribute('loop'); logo.stop && logo.stop(); });
    }
  };

  window.HEILD_TIPOS = T;
  window.HEILD_UTIL = { h: h, orb: orb };
})();
