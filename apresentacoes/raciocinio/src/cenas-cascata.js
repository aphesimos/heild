/*
 * O raciocínio do Consultor — a cascata: cascata, entender, vigencia, hibrida, revisor, calculo, modos.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;

  /* ---------------- cascata: a pergunta desce as etapas e a resposta se monta ao lado ---------------- */
  T.cascata = {
    html: function (d) {
      var RY0 = 100, PASSO = 36;
      var etapas = d.etapas.map(function (e, i) {
        return '<li class="etapa-c" style="top:' + (RY0 + i * PASSO - 15) + 'px"><span class="n tnum">' + (i + 1) + '</span><b>' + h(e.nome) + '</b><span class="quem">' + h(e.quem) + '</span><span class="saida">' + h(e.saida) + '</span></li>';
      }).join('');
      var pontos = d.etapas.map(function (e, i) { return '<circle class="ponto-c" data-i="' + i + '" cx="18" cy="' + (RY0 + i * PASSO) + '" r="5"/>'; }).join('');
      var cits = d.citacoes.map(function (c) { return '<li class="aparece"><b>' + h(c.norma) + '</b><span>' + h(c.vig) + '</span></li>'; }).join('');
      var ret = R.retrato();
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(ret ? 700 : 1152, ret ? 880 : 430, '<div class="cascata">' +
        '<div class="casc-perg"><span class="rotulo">Pergunta</span><p><span class="t-perg"></span></p></div>' +
        '<svg class="casc-trilho" viewBox="0 0 40 430" aria-hidden="true"><line class="trilho-c" x1="18" y1="' + RY0 + '" x2="18" y2="' + (RY0 + (d.etapas.length - 1) * PASSO) + '"/>' + pontos + '</svg>' +
        '<ol class="etapas-c">' + etapas + '</ol>' +
        '<section class="casc-resp"><header>' + R.orb('consultor', { tamanho: 30 }) + '<b>Consultor</b><span class="rotulo est">disponível</span></header>' +
          '<p class="t-resp"></p><ul class="casc-cits">' + cits + '</ul><div class="aparece casc-grau">' + R.selo('sucesso', 'Segurança alta') + '<span>fator R de 31,2% pelo motor de cálculo</span></div></section>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var RY0 = 100, PASSO = 36;
      var svg = q(el, '.casc-trilho'), lis = qa(el, '.etapa-c'), pts = qa(el, '.ponto-c'), tp = q(el, '.t-perg'), tr = q(el, '.t-resp');
      var o = q(el, '.casc-resp orb-avatar'), est = q(el, '.casc-resp .est'), cits = qa(el, '.casc-cits .aparece'), grau = q(el, '.casc-grau');
      function zerar() {
        tp.textContent = ''; tr.textContent = ''; lis.forEach(function (l) { l.classList.remove('ativo', 'feito'); }); pts.forEach(function (p) { p.classList.remove('on'); });
        cits.forEach(function (c) { c.classList.remove('on'); }); grau.classList.remove('on'); o.setAttribute('reaction', 'idle'); est.textContent = 'disponível';
      }
      if (api.parado) {
        tp.textContent = d.pergunta; tr.textContent = d.resposta; lis.forEach(function (l) { l.classList.add('feito'); }); pts.forEach(function (p) { p.classList.add('on'); });
        cits.forEach(function (c) { c.classList.add('on'); }); grau.classList.add('on'); return;
      }
      R.laco(async function () {
        zerar(); await api.esperar(700);
        await api.digitar(tp, d.pergunta, 36);
        o.setAttribute('reaction', 'thinking'); est.textContent = 'pesquisando';
        for (var i = 0; i < lis.length; i++) {
          var y0 = i === 0 ? 74 : RY0 + (i - 1) * PASSO, y1 = RY0 + i * PASSO;
          await R.viajar(api, svg, 'M18 ' + y0 + ' L18 ' + y1, i === 0 ? 600 : 520);
          if (i > 0) { lis[i - 1].classList.remove('ativo'); lis[i - 1].classList.add('feito'); }
          lis[i].classList.add('ativo'); pts[i].classList.add('on');
          if (i === 6) { o.setAttribute('reaction', 'working'); est.textContent = 'respondendo'; await api.digitar(tr, d.resposta, 60); }
          else if (i === 7) { for (var k = 0; k < cits.length; k++) { await api.esperar(320); cits[k].classList.add('on'); } }
          else if (i === 8) { grau.classList.add('on'); o.setAttribute('reaction', 'done'); est.textContent = 'respondeu'; }
          await api.esperar(i < 6 ? 760 : 520);
        }
        lis[lis.length - 1].classList.remove('ativo'); lis[lis.length - 1].classList.add('feito');
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- entender: o que sai da pergunta e a pergunta de volta ---------------- */
  T.entender = {
    html: function (d) {
      var chips = d.chips.map(function (c) {
        return '<li class="chip-e' + (c.falta ? ' falta' : '') + '"><span class="rotulo">' + h(c.rotulo) + '</span><b>' + h(c.valor) + '</b></li>';
      }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(620, 520, '<div class="entender">' +
        '<div class="bolha eu b1"><span class="t-b1"></span></div>' +
        '<ul class="chips-e">' + chips + '</ul>' +
        '<div class="fala-c b2">' + R.orb('consultor', { tamanho: 26 }) + '<div><span class="autor">Consultor</span><p class="t-b2"></p></div></div>' +
        '<div class="bolha eu b3"><span class="t-b3"></span></div>' +
        '<div class="fala-c b4">' + R.orb('consultor', { tamanho: 26, estatico: true, extras: false }) + '<div><span class="autor">Consultor</span><p class="t-b4"></p></div></div>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var b = {}; ['b1', 'b2', 'b3', 'b4'].forEach(function (k) { b[k] = q(el, '.' + k); });
      var t1 = q(el, '.t-b1'), t2 = q(el, '.t-b2'), t3 = q(el, '.t-b3'), t4 = q(el, '.t-b4'), chips = qa(el, '.chip-e'), o = q(el, '.b2 orb-avatar');
      function final() { t1.textContent = d.pergunta; t2.textContent = d.volta; t3.textContent = d.resposta; t4.textContent = d.final; Object.keys(b).forEach(function (k) { b[k].classList.add('on'); }); chips.forEach(function (c) { c.classList.add('on'); }); }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        Object.keys(b).forEach(function (k) { b[k].classList.remove('on'); }); chips.forEach(function (c) { c.classList.remove('on'); });
        t1.textContent = t2.textContent = t3.textContent = t4.textContent = '';
        await api.esperar(600);
        b.b1.classList.add('on'); await api.digitar(t1, d.pergunta, 36);
        await api.esperar(400);
        for (var i = 0; i < chips.length; i++) { await api.esperar(i === chips.length - 1 ? 700 : 380); chips[i].classList.add('on'); }
        await api.esperar(700);
        b.b2.classList.add('on'); o.setAttribute('reaction', 'needs'); await api.digitar(t2, d.volta, 55);
        await api.esperar(1400);
        b.b3.classList.add('on'); await api.digitar(t3, d.resposta, 30);
        await api.esperar(600);
        o.setAttribute('reaction', 'working');
        b.b4.classList.add('on'); await api.digitar(t4, d.final, 55);
        o.setAttribute('reaction', 'done');
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- vigencia: uma linha de data passa pelas redações e só o que valia atravessa ---------------- */
  T.vigencia = {
    html: function (d) {
      var X0 = 250, X1 = 600, t0 = R.dia(d.de), t1 = R.dia(d.ate);
      function x(s) { return X0 + (R.dia(s) - t0) / (t1 - t0) * (X1 - X0); }
      var linhas = d.barras.map(function (b, i) {
        var y = 92 + i * 46, xa = x(b.de), xb = b.ate ? x(b.ate) : X1;
        return '<g class="vg-linha" data-i="' + i + '"><text class="vg-rot" x="' + (X0 - 14) + '" y="' + (y + 4) + '" text-anchor="end">' + h(b.rotulo) + '</text>' +
          '<rect class="vg-barra' + (b.ate ? '' : ' aberta') + '" x="' + xa.toFixed(1) + '" y="' + (y - 7) + '" width="' + (xb - xa).toFixed(1) + '" height="14" rx="7"/></g>';
      }).join('');
      var anos = '';
      for (var a = 2014; a <= 2026; a += 2) anos += '<text class="vg-ano" x="' + x(a + '-01-01').toFixed(1) + '" y="436" text-anchor="middle">' + a + '</text><line class="vg-tick" x1="' + x(a + '-01-01').toFixed(1) + '" y1="416" x2="' + x(a + '-01-01').toFixed(1) + '" y2="422"/>';
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 470, '<div class="vigencia" data-e="zoom" style="--d:250ms">' +
        '<div class="vg-topo"><span class="rotulo">' + h(d.norma) + '</span><span class="vg-leitura"><span class="rotulo">Data do fato</span><b class="vg-dia tnum">—</b></span><span class="vg-conta tnum"></span></div>' +
        '<svg class="vg-svg" viewBox="0 0 640 450"><line class="vg-base" x1="' + X0 + '" y1="416" x2="' + X1 + '" y2="416"/>' + anos + linhas +
        '<g class="vg-alca"><line x1="0" y1="62" x2="0" y2="416"/><circle r="9" cy="58"/><circle class="miolo" r="3.2" cy="58"/></g></svg></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var X0 = 250, X1 = 600, t0 = R.dia(d.de), t1 = R.dia(d.ate), svg = q(el, '.vg-svg'), alca = q(el, '.vg-alca'), dia = q(el, '.vg-dia'), conta = q(el, '.vg-conta');
      var linhas = qa(el, '.vg-linha'), data = R.dia(d.paradas[0]), mexeu = -1e9;
      function x(ms) { return X0 + (ms - t0) / (t1 - t0) * (X1 - X0); }
      function por(ms) {
        data = Math.max(t0, Math.min(t1 - 864e5, ms)); alca.setAttribute('transform', 'translate(' + x(data).toFixed(1) + ' 0)'); dia.textContent = R.fmt(data);
        var n = 0;
        d.barras.forEach(function (b, i) { var ok = data >= R.dia(b.de) && (!b.ate || data <= R.dia(b.ate) + 864e5 - 1); linhas[i].classList.toggle('passa', ok); if (ok) n++; });
        conta.textContent = n + ' de ' + d.barras.length + ' passam';
      }
      por(data);
      function dataDoPonto(e) { var r = svg.getBoundingClientRect(); return t0 + ((e.clientX - r.left) / r.width * 640 - X0) / (X1 - X0) * (t1 - t0); }
      var arr = false;
      api.ouvir(svg, 'pointerdown', function (e) { arr = true; mexeu = performance.now(); svg.setPointerCapture(e.pointerId); por(dataDoPonto(e)); });
      api.ouvir(svg, 'pointermove', function (e) { if (arr) { mexeu = performance.now(); por(dataDoPonto(e)); } });
      api.ouvir(svg, 'pointerup', function () { arr = false; });
      if (api.parado) return;
      var k = 0;
      R.laco(async function () {
        await api.esperar(2600);
        if (performance.now() - mexeu < 8000) return;
        var de = data, para = R.dia(d.paradas[(++k) % d.paradas.length]);
        await new Promise(function (res) { var t = performance.now(); api.quadro(function (agora) { var u = Math.min(1, (agora - t) / 1500); por(de + (para - de) * R.inOut(u)); if (u >= 1) { res(); return false; } return true; }); });
      });
    }
  };

  /* ---------------- hibrida: duas listas que viram uma ---------------- */
  T.hibrida = {
    html: function (d) {
      function lista(cls, titulo, itens) {
        return '<div class="lista-h ' + cls + '"><p class="rotulo">' + h(titulo) + '</p><ol>' + itens.map(function (t, i) { return '<li><span class="n tnum">' + (i + 1) + '</span><span class="t">' + h(t) + '</span></li>'; }).join('') + '</ol></div>';
      }
      var fund = '<div class="lista-h fund"><p class="rotulo">Lista fundida, pela posição em cada uma</p><ol>' + d.fundida.map(function (t, i) { return '<li><span class="n tnum">' + (i + 1) + '</span><span class="t">' + h(t) + '</span></li>'; }).join('') + '</ol></div>';
      var ret = R.retrato();
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(ret ? 600 : 1152, ret ? 860 : 400, '<div class="hibrida">' +
        '<p class="h-perg"><span class="rotulo">Pergunta</span><span class="t-perg"></span></p>' +
        lista('pal', 'Palavras exatas · BM25', d.palavras) + lista('sig', 'Significado · multivetorial', d.significado) + fund +
        '<ul class="h-fatos">' + d.fatos.map(function (f) { return '<li>' + h(f) + '</li>'; }).join('') + '</ul></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var cont = q(el, '.hibrida'), tp = q(el, '.t-perg'), pal = qa(el, '.pal li'), sig = qa(el, '.sig li'), fund = qa(el, '.fund li');
      function chave(t) { return t.split(' · ')[0]; }
      function centro(li) { var r = li.getBoundingClientRect(), rc = cont.getBoundingClientRect(), k = rc.width / cont.offsetWidth || 1; return [(r.left - rc.left + r.width / 2) / k, (r.top - rc.top + r.height / 2) / k]; }
      function final() { tp.textContent = d.pergunta; pal.concat(sig, fund).forEach(function (l) { l.classList.add('on'); }); }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        tp.textContent = ''; pal.concat(sig, fund).forEach(function (l) { l.classList.remove('on', 'usado'); });
        await api.esperar(600); await api.digitar(tp, d.pergunta, 38); await api.esperar(300);
        for (var i = 0; i < 4; i++) { pal[i].classList.add('on'); sig[i].classList.add('on'); await api.esperar(240); }
        await api.esperar(700);
        for (var f = 0; f < fund.length; f++) {
          var alvo = d.fundida[f], fontes = pal.concat(sig).filter(function (li) { return chave(q(li, '.t').textContent) === alvo; });
          await Promise.all(fontes.map(function (li) { li.classList.add('usado'); return R.levar(api, cont, q(li, '.t'), centro(li), centro(fund[f]), 950, 30); }));
          fund[f].classList.add('on');
          await api.esperar(200);
        }
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- revisor: 50 candidatos, poucos ficam, cada um com o motivo ---------------- */
  T.revisor = {
    html: function (d) {
      var cards = '';
      for (var i = 0; i < 50; i++) cards += '<i class="cand" data-i="' + i + '"></i>';
      function linha(r, cls) { return '<li class="' + cls + '"><b>' + h(r[0]) + '</b><span>' + h(r[1]) + '</span></li>'; }
      return '<div class="dividido dividido--estreito">' + R.cab(d) + R.encaixe(760, 540, '<div class="revisor" data-e="zoom" style="--d:250ms">' +
        '<div class="cands-box"><p class="rotulo"><span class="tnum cont-c">50</span> candidatos</p><div class="cands">' + cards + '</div></div>' +
        '<div class="decisoes"><p class="rotulo">Ficam, com o motivo</p><ul class="ficam">' + d.ficam.map(function (r) { return linha(r, 'fica'); }).join('') + '</ul>' +
        '<p class="rotulo">Saem, com o motivo</p><ul class="saem">' + d.saem.map(function (r) { return linha(r, 'sai'); }).join('') + '</ul></div>' +
        '<p class="rev-fato">' + h(d.fato) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var cont = q(el, '.revisor'), cands = qa(el, '.cand'), ficam = qa(el, '.fica'), saem = qa(el, '.sai'), cont2 = q(el, '.cont-c');
      var FICA = [7, 19, 26, 41], SAI = [3, 30, 46];
      function centro(n) { var r = n.getBoundingClientRect(), rc = cont.getBoundingClientRect(), k = rc.width / cont.offsetWidth || 1; return [(r.left - rc.left + r.width / 2) / k, (r.top - rc.top + r.height / 2) / k]; }
      function final() { cands.forEach(function (c, i) { c.classList.add(FICA.indexOf(i) >= 0 ? 'fica' : 'lido'); }); ficam.concat(saem).forEach(function (l) { l.classList.add('on'); }); cont2.textContent = FICA.length; }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        cands.forEach(function (c) { c.className = 'cand'; }); ficam.concat(saem).forEach(function (l) { l.classList.remove('on'); }); cont2.textContent = '50';
        await api.esperar(900);
        var restam = 50;
        for (var i = 0; i < cands.length; i++) {
          cands[i].classList.add('lendo');
          await api.esperar(FICA.indexOf(i) >= 0 || SAI.indexOf(i) >= 0 ? 260 : 70);
          cands[i].classList.remove('lendo');
          var f = FICA.indexOf(i), s = SAI.indexOf(i);
          if (f >= 0) { cands[i].classList.add('fica'); await R.levar(api, cont, q(ficam[f], 'b'), centro(cands[i]), centro(q(ficam[f], 'b')), 800, 50); ficam[f].classList.add('on'); }
          else { cands[i].classList.add('lido'); restam--; cont2.textContent = restam; if (s >= 0) { saem[s].classList.add('on'); await api.esperar(300); } }
        }
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- calculo: as entradas entram na função, os passos saem com a origem ---------------- */
  T.calculo = {
    html: function (d) {
      var ent = d.entradas.map(function (e) { return '<li class="aparece"><span>' + h(e[0]) + '</span><b class="tnum">' + h(e[1]) + '</b><i class="origem">' + h(e[2]) + '</i></li>'; }).join('');
      var pas = d.passos.map(function (p) { return '<li class="aparece"><span class="rotulo">' + h(p[0]) + '</span><b class="tnum">' + h(p[1]) + '</b></li>'; }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 520, '<div class="calculo" data-e="zoom" style="--d:250ms">' +
        '<div class="fn"><p class="codigo fn-nome">' + h(d.funcao) + '(entradas, data: 03/2019)</p><ul class="fn-ent">' + ent + '</ul><span class="fn-giro giro"></span><ul class="fn-pas">' + pas + '</ul></div>' +
        '<div class="sem-origem"><p class="rotulo">Número sem origem não sai</p><p class="so-frase"><span class="t-so"></span> <span class="so-subst">(valor não conferido)</span></p></div>' +
        '<p class="calc-prazo"><span class="pilula pilula--contorno">Jurídico</span><span>' + h(d.prazo) + '</span></p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ents = qa(el, '.fn-ent .aparece'), pas = qa(el, '.fn-pas .aparece'), giro = q(el, '.fn-giro'), so = q(el, '.sem-origem'), tso = q(el, '.t-so');
      function final() { ents.concat(pas).forEach(function (x) { x.classList.add('on'); }); tso.textContent = d.frase_sem; so.classList.add('riscado'); }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        ents.concat(pas).forEach(function (x) { x.classList.remove('on'); }); so.classList.remove('riscado'); tso.textContent = ''; giro.classList.remove('on');
        await api.esperar(700);
        for (var i = 0; i < ents.length; i++) { ents[i].classList.add('on'); await api.esperar(600); }
        giro.classList.add('on'); await api.esperar(1100); giro.classList.remove('on');
        for (var k = 0; k < pas.length; k++) { pas[k].classList.add('on'); await api.esperar(650); }
        await api.esperar(900);
        await api.digitar(tso, d.frase_sem, 40);
        await api.esperar(900); so.classList.add('riscado');
        await R.segurar(api, el);
      });
    }
  };

  /* ---------------- modos: os modos do Consultor, um em foco por vez ---------------- */
  T.modos = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 380;
      var cards = d.itens.map(function (m, i) { return '<li class="modo" data-e style="--d:' + (360 + i * 90) + 'ms"><b>' + h(m[0]) + '</b><span>' + h(m[1]) + '</span></li>'; }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<div class="modos-box"><ul class="modos">' + cards + '</ul>' +
        '<p class="nunca">' + R.orb('consultor', { tamanho: 24, estatico: true, extras: false }) + '<span>' + h(d.nunca) + '</span></p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ms = qa(el, '.modo'), i = 0, mexeu = -1e9;
      function por(k) { i = k; ms.forEach(function (m, j) { m.classList.toggle('foco', j === k); }); }
      ms.forEach(function (m, k) { api.ouvir(m, 'pointerenter', function () { mexeu = performance.now(); por(k); }); });
      if (api.parado) return;
      api.depois(1400, function () { por(0); });
      api.intervalo(function () { if (performance.now() - mexeu < 7000) return; por((i + 1) % ms.length); }, 7000);
    }
  };
})();
