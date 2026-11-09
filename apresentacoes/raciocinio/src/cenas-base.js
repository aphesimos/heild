/*
 * O raciocínio do Consultor — a base no tempo: dispositivo, consolidacao, tresdatas, grafo.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;

  /* ---------------- dispositivo: a árvore do artigo e as redações de cada dispositivo ---------------- */
  T.dispositivo = {
    html: function (d) {
      var nos = d.nos.map(function (n) {
        return '<button type="button" class="no-disp' + (n.revogado ? ' revogado' : '') + '" data-id="' + n.id + '"><b>' + h(n.rotulo) + '</b><span>' + h(n.texto) + '</span></button>';
      }).join('');
      return '<div class="dividido">' + R.cab(d, R.rotulo('Toque num dispositivo para ver as redações.', 640)) + R.encaixe(640, 540,
        '<div class="disp" data-e="zoom" style="--d:250ms">' +
          '<div class="disp-comum"><p class="rotulo">O jeito comum: blocos de tamanho fixo</p><div class="blocos-texto"><p>Art. 58. A duração normal do trabalho, para os empregados em qualquer atividade privada, não excederá de 8 (oito) horas diárias, desde que não seja fixado expressamente outro limite. § 1º Não serão descontadas nem computadas como jornada extraordinária as variações de horário no registro de ponto não excedentes de cinco minutos, observado o limite máximo de dez minutos diários. § 2º O tempo despendido pelo empregado desde a sua residência até a efetiva ocupação do posto de trabalho…</p><i class="corte-bloco c1"></i><i class="corte-bloco c2"></i></div></div>' +
          '<div class="disp-heild"><div class="arvore"><p class="rotulo">O jeito da Heild: o dispositivo</p><div class="raiz"><b>CLT, art. 58</b></div>' + nos + '</div>' +
          '<div class="disp-det"><p class="codigo urn-det"></p><div class="redacoes"></div></div></div>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var bs = qa(el, '.no-disp'), urn = q(el, '.urn-det'), red = q(el, '.redacoes'), ordem = ['p2', 'p3', 'p1', 'caput'], k = 0, mexeu = -1e9;
      function por(id) {
        var n = d.nos.find(function (x) { return x.id === id; });
        bs.forEach(function (b) { b.classList.toggle('sel', b.dataset.id === id); });
        urn.textContent = d.urnBase + n.sufixo;
        red.innerHTML = '<p class="rotulo">Redações de ' + h(n.rotulo) + '</p>' + n.redacoes.map(function (r, i) {
          return '<div class="redacao' + (r.revoga ? ' revoga' : '') + '" style="--k:' + i + '"><span class="periodo tnum">' + (r.revoga ? 'desde ' + h(r.de) : h(r.de) + ' a ' + h(r.ate)) + '</span><span class="por">' + h(r.norma) + '</span></div>';
        }).join('');
      }
      bs.forEach(function (b) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(b.dataset.id); }); });
      por('p2');
      if (api.parado) return;
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; k = (k + 1) % ordem.length; por(ordem[k]); }, 3400);
    }
  };

  /* ---------------- consolidacao: eventos aplicados por código viram a linha do tempo ---------------- */
  T.consolidacao = {
    html: function (d) {
      var X0 = 760, X1 = 1130, t0 = R.dia('2000-01-01'), t1 = R.dia('2026-11-09');
      function x(s) { return X0 + (R.dia(s) - t0) / (t1 - t0) * (X1 - X0); }
      var evs = d.eventos.map(function (e, i) {
        return '<div class="evento" data-i="' + i + '" style="top:' + (14 + i * 74) + 'px"><span class="rotulo tnum">' + h(e.rotulo) + '</span><b>' + h(e.norma) + '</b><span>' + h(e.acao) + '</span></div>';
      }).join('');
      var barras = d.barras.map(function (b, i) {
        return '<div class="trilho-b" style="top:' + (20 + i * 66) + 'px"><span class="rot-b">' + h(b.rotulo) + '</span><i class="barra-b" data-id="' + b.id + '" style="left:' + (x(b.de) - X0).toFixed(1) + 'px"></i></div>';
      }).join('');
      var anos = [2000, 2005, 2010, 2015, 2020, 2025].map(function (a) { return '<span style="left:' + (x(a + '-01-01') - X0).toFixed(1) + 'px">' + a + '</span>'; }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(1152, 400, '<div class="consol">' +
        '<svg class="consol-fios" viewBox="0 0 1152 330" aria-hidden="true"></svg>' + evs +
        '<div class="consolidador"><b>Consolidador</b><span>código · aplica em ordem de eficácia</span><span class="giro"></span></div>' +
        '<div class="linhas-b" style="left:' + X0 + 'px;width:' + (X1 - X0) + 'px">' + barras + '<div class="anos-b">' + anos + '</div></div>' +
        '<p class="estudo">' + h(d.estudo) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var X0 = 760, X1 = 1130, t0 = R.dia('2000-01-01'), t1 = R.dia('2026-11-09');
      function x(ms) { return (ms - t0) / (t1 - t0) * (X1 - X0); }
      var svg = q(el, '.consol-fios'), evs = qa(el, '.evento'), cons = q(el, '.consolidador'), barras = {};
      qa(el, '.barra-b').forEach(function (b) { barras[b.dataset.id] = b; });
      var ini = {}; d.barras.forEach(function (b, i) { ini[b.id] = { de: R.dia(b.de), y: 49 + i * 66 }; });
      function zerar() { Object.keys(barras).forEach(function (k) { barras[k].style.width = '0px'; barras[k].classList.remove('fechada', 'viva'); }); evs.forEach(function (e) { e.classList.remove('ativo', 'feito'); }); }
      function abrir(id) { barras[id].classList.add('viva'); barras[id].style.width = (X1 - X0 - x(ini[id].de)).toFixed(1) + 'px'; }
      function fechar(id, ate) { barras[id].classList.add('fechada'); barras[id].classList.remove('viva'); barras[id].style.width = Math.max(4, x(ate) - x(ini[id].de)).toFixed(1) + 'px'; }
      if (api.parado) {
        d.eventos.forEach(function (e) { (e.alvo || []).forEach(abrir); (e.fecha || []).forEach(function (id) { fechar(id, R.dia(e.data) - 864e5); }); });
        evs.forEach(function (e) { e.classList.add('feito'); }); return;
      }
      R.laco(async function () {
        zerar(); await api.esperar(900);
        for (var i = 0; i < d.eventos.length; i++) {
          var e = d.eventos[i], ye = 14 + i * 74 + 30;
          evs[i].classList.add('ativo');
          await R.viajar(api, svg, 'M384 ' + ye + ' C 430 ' + ye + ', 420 165, 466 165', 900);
          cons.classList.add('trabalhando'); await api.esperar(650); cons.classList.remove('trabalhando');
          var alvos = (e.alvo || []).concat(e.fecha || []), alvoY = ini[alvos[0]].y, alvoX = X0 + Math.max(0, x(Math.min(ini[alvos[0]].de, R.dia(e.data))));
          await R.viajar(api, svg, 'M686 165 C 730 165, ' + (alvoX - 60) + ' ' + alvoY + ', ' + alvoX.toFixed(1) + ' ' + alvoY, 900);
          (e.alvo || []).forEach(abrir);
          (e.fecha || []).forEach(function (id) { fechar(id, R.dia(e.data) - 864e5); });
          evs[i].classList.remove('ativo'); evs[i].classList.add('feito');
          await api.esperar(700);
        }
        await api.esperar(5500);
      });
    }
  };

  /* ---------------- tresdatas: fato, ato e hoje, cada um escolhendo a sua norma ---------------- */
  T.tresdatas = {
    html: function (d) {
      var X0 = 14, X1 = 506, t0 = R.dia(d.de), t1 = R.dia(d.ate);
      function x(s) { return X0 + (R.dia(s) - t0) / (t1 - t0) * (X1 - X0); }
      var anos = '';
      for (var a = 2014; a <= 2026; a += 2) anos += '<line class="td-tick" x1="' + x(a + '-01-01').toFixed(1) + '" y1="34" x2="' + x(a + '-01-01').toFixed(1) + '" y2="40"/><text class="td-ano" x="' + x(a + '-01-01').toFixed(1) + '" y="56" text-anchor="middle">' + a + '</text>';
      var faixas = d.faixas.map(function (f, i) {
        var corte = f.corte ? '<line class="td-corte" x1="' + x(f.corte).toFixed(1) + '" y1="8" x2="' + x(f.corte).toFixed(1) + '" y2="44"/><text class="td-corte-rot" x="' + (x(f.corte) + 6).toFixed(1) + '" y="16">' + R.fmt(R.dia(f.corte)) + '</text>' : '';
        var lados = (f.antes ? '<div class="td-r td-antes"><b>' + h(f.antes.norma) + '</b><span>' + h(f.antes.texto) + '</span></div>' : '') +
          '<div class="td-r td-depois' + (f.antes ? '' : ' fixo') + '"><b>' + h(f.depois.norma) + '</b><span>' + h(f.depois.texto) + '</span></div>';
        return '<div class="td-faixa" data-i="' + i + '" data-e style="--d:' + (360 + i * 160) + 'ms"><div class="td-nome"><b>' + h(f.nome) + '</b><span class="rotulo">' + h(f.rege) + '</span></div>' +
          '<svg class="td-eixo" viewBox="0 0 520 62" aria-hidden="true"><line class="td-base" x1="' + X0 + '" y1="37" x2="' + X1 + '" y2="37"/>' + anos + corte +
          '<g class="td-alca"><circle r="8" cy="37"/><circle class="miolo" r="3" cy="37"/><text class="td-data" y="25" text-anchor="middle"></text></g></svg>' +
          '<div class="td-rs">' + lados + '</div></div>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(1152, 400, '<div class="tres-datas">' + faixas +
        '<p class="td-rod">' + R.marca('nada') + '<span>' + h(d.rodape) + '</span></p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var X0 = 14, X1 = 506, t0 = R.dia(d.de), t1 = R.dia(d.ate);
      function x(ms) { return X0 + (ms - t0) / (t1 - t0) * (X1 - X0); }
      var fs = qa(el, '.td-faixa');
      function por(i, ms) {
        var f = d.faixas[i], el2 = fs[i], g = q(el2, '.td-alca');
        g.setAttribute('transform', 'translate(' + x(ms).toFixed(1) + ' 0)');
        q(g, '.td-data').textContent = R.fmt(ms);
        el2.classList.toggle('depois', !f.corte || ms >= R.dia(f.corte));
      }
      d.faixas.forEach(function (f, i) { por(i, R.dia(f.fixo || f.vai[0])); });
      if (api.parado) return;
      d.faixas.forEach(function (f, i) {
        if (!f.vai) return;
        var a = R.dia(f.vai[0]), b = R.dia(f.vai[1]);
        R.laco(async function () {
          await api.esperar(1600 + i * 900);
          await mover(i, a, b); await api.esperar(2600); await mover(i, b, a); await api.esperar(1800 - i * 900 + 900);
        });
      });
      function mover(i, de, para) {
        return new Promise(function (res) {
          var t = performance.now();
          api.quadro(function (agora) { var u = Math.min(1, (agora - t) / 1500); por(i, de + (para - de) * R.inOut(u)); if (u >= 1) { res(); return false; } return true; });
        });
      }
    }
  };

  /* ---------------- grafo: a relevância se espalha a partir dos artigos achados ---------------- */
  var PONTOS = { ctn38: 1, leim: 0.95, lc227: 0.82, tema: 0.8, cf156: 0.55, dec: 0.5, ctn148: 0.46, iptu: 0.12 };
  var ONDAS = [
    [['ctn38', 'lc227'], ['ctn38', 'tema'], ['leim', 'cf156'], ['leim', 'dec']],
    [['tema', 'ctn148'], ['dec', 'iptu']]
  ];
  T.grafo = {
    html: function (d) {
      var pos = {}; d.nos.forEach(function (n) { pos[n.id] = n; });
      var arestas = d.arestas.map(function (a) {
        var A = pos[a[0]], B = pos[a[1]], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
        return '<path class="aresta" data-a="' + a[0] + '" data-b="' + a[1] + '" d="M' + A.x + ' ' + A.y + ' L' + B.x + ' ' + B.y + '"/><text class="aresta-rot" x="' + mx + '" y="' + (my - 6) + '" text-anchor="middle">' + h(a[2]) + '</text>';
      }).join('');
      var nos = d.nos.map(function (n) {
        return '<div class="no-g' + (n.semente ? ' semente' : '') + (n.longe ? ' longe' : '') + '" data-id="' + n.id + '" style="left:' + n.x + 'px;top:' + n.y + 'px"><b>' + h(n.rotulo) + '</b><span>' + h(n.sub) + '</span><i class="medidor"><i></i></i></div>';
      }).join('');
      var fatos = d.fatos.map(function (f) { return '<li>' + h(f) + '</li>'; }).join('');
      return '<div class="dividido dividido--estreito">' + R.cab(d) + R.encaixe(760, 560, '<div class="grafo" data-e="zoom" style="--d:250ms">' +
        '<p class="grafo-perg"><span class="rotulo">A pergunta</span>' + h(d.pergunta) + '</p>' +
        '<div class="rede-g"><svg class="arestas" viewBox="0 0 720 430" aria-hidden="true">' + arestas + '</svg>' + nos + '</div>' +
        '<ul class="grafo-fatos">' + fatos + '</ul></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var svg = q(el, '.arestas'), nos = {};
      qa(el, '.no-g').forEach(function (n) { nos[n.dataset.id] = n; });
      function nivel(id, v) { q(nos[id], '.medidor i').style.transform = 'scaleX(' + v.toFixed(3) + ')'; nos[id].classList.toggle('aceso', v > 0.4); }
      function caminho(a, b) { var p = q(svg, 'path[data-a="' + a + '"][data-b="' + b + '"]') || q(svg, 'path[data-a="' + b + '"][data-b="' + a + '"]'); return p; }
      function zerar() { Object.keys(nos).forEach(function (id) { nivel(id, 0); nos[id].classList.remove('on', 'aceso'); }); qa(svg, '.aresta').forEach(function (p) { p.classList.remove('on'); }); }
      if (api.parado) { Object.keys(PONTOS).forEach(function (id) { nivel(id, PONTOS[id]); }); return; }
      R.laco(async function () {
        zerar(); await api.esperar(900);
        ['ctn38', 'leim'].forEach(function (id) { nos[id].classList.add('on'); nivel(id, PONTOS[id]); });
        await api.esperar(1100);
        for (var o = 0; o < ONDAS.length; o++) {
          await Promise.all(ONDAS[o].map(function (par) {
            var p = caminho(par[0], par[1]), A = d.nos.find(function (n) { return n.id === par[0]; }), B = d.nos.find(function (n) { return n.id === par[1]; });
            p.classList.add('on');
            return R.viajar(api, svg, 'M' + A.x + ' ' + A.y + ' L' + B.x + ' ' + B.y, 1300).then(function () { nivel(par[1], PONTOS[par[1]]); });
          }));
          await api.esperar(500);
        }
        await api.esperar(5200);
      });
    }
  };
})();
