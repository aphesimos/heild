/*
 * O raciocínio do Consultor — abertura, o problema e a ideia:
 * tresareas, linhatempo, duelo, fatos, armadilhas, quatrocamadas.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;

  /* ---------------- tresareas: a mesma pergunta antes e depois da mudança, nas três áreas ---------------- */
  T.tresareas = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 400;
      function resp(lado, r) {
        return '<div class="resp resp-' + lado + '"><b class="quando">' + h(r.quando) + '</b><p class="resp-t">' + h(r.resposta) + '</p><p class="fonte">' + h(r.fonte) + '</p></div>';
      }
      var cards = d.areas.map(function (a, i) {
        return '<article class="area" data-e style="--d:' + (380 + i * 140) + 'ms"><p class="rotulo">' + h(a.area) + '</p>' +
          '<p class="area-perg">' + h(a.pergunta) + '</p>' +
          '<div class="mini-tempo" aria-hidden="true"><i class="trilho"></i><i class="corte"></i><span class="corte-rot tnum">' + h(a.corte) + '</span><i class="cursor-data"></i></div>' +
          '<div class="area-resps">' + resp('antes', a.antes) + resp('depois', a.depois) + '</div></article>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<div class="areas">' + cards + '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var cards = qa(el, '.area'), lado = cards.map(function () { return 0; }), k = 0;
      if (api.parado) return;
      api.depois(1500, function () {
        api.intervalo(function () { var i = k % cards.length; lado[i] = 1 - lado[i]; cards[i].classList.toggle('depois', !!lado[i]); k++; }, 1500);
      });
    }
  };

  /* ---------------- linhatempo: arraste a data do fato e o texto do dispositivo muda ---------------- */
  T.linhatempo = {
    html: function (d) {
      var W = 760, X0 = 34, X1 = W - 34, t0 = R.dia(d.de), t1 = R.dia(d.ate);
      function x(s) { return X0 + (R.dia(s) - t0) / (t1 - t0) * (X1 - X0); }
      var eixo = '<line class="lt-base" x1="' + X0 + '" y1="44" x2="' + X1 + '" y2="44"/>';
      d.versoes.forEach(function (v, i) {
        var xa = x(v.de), xb = v.ate ? x(v.ate) : X1;
        eixo += '<line class="lt-seg lt-seg' + i + '" x1="' + xa.toFixed(1) + '" y1="44" x2="' + xb.toFixed(1) + '" y2="44"/>' +
          '<text class="lt-segrot" x="' + ((xa + xb) / 2).toFixed(1) + '" y="26" text-anchor="middle">' + h(v.fonte.match(/(Lei|LC) [\d./]+/)[0]) + '</text>';
      });
      for (var a = 2000; a <= 2025; a += 5) {
        var xa2 = x(a + '-01-01');
        eixo += '<line class="lt-tick" x1="' + xa2.toFixed(1) + '" y1="49" x2="' + xa2.toFixed(1) + '" y2="55"/><text class="lt-ano" x="' + xa2.toFixed(1) + '" y="70" text-anchor="middle">' + a + '</text>';
      }
      var xc = x(d.versoes[1].de);
      eixo += '<line class="lt-corte" x1="' + xc.toFixed(1) + '" y1="12" x2="' + xc.toFixed(1) + '" y2="128"/>';
      var xm = x(d.marco.data);
      eixo += '<g class="lt-marco"><rect x="' + (xm - 5).toFixed(1) + '" y="39" width="10" height="10" rx="2" transform="rotate(45 ' + xm.toFixed(1) + ' 44)"/><text x="' + xm.toFixed(1) + '" y="92" text-anchor="end">' + h(d.marco.rotulo) + ' · 25/11/2024</text></g>';
      var f = d.faixa, xf0 = x(f.de), xfc = x(f.corte), xf1 = x(f.ate);
      eixo += '<g class="lt-faixa"><rect class="pago" x="' + xf0.toFixed(1) + '" y="104" width="' + (xfc - xf0).toFixed(1) + '" height="10" rx="5"/>' +
        '<rect class="nao-pago" x="' + xfc.toFixed(1) + '" y="104" width="' + Math.max(6, xf1 - xfc).toFixed(1) + '" height="10" rx="5"/>' +
        '<text x="' + (xf0 - 8).toFixed(1) + '" y="113" text-anchor="end">' + h(f.rotulo) + '</text>' +
        '<text class="mini" x="' + ((xf0 + xfc) / 2).toFixed(1) + '" y="132" text-anchor="middle">' + h(f.antes) + ' até 10/11/2017</text></g>';
      eixo += '<g class="lt-alca"><line x1="0" y1="30" x2="0" y2="58"/><circle r="10" cy="44"/><circle class="miolo" r="3.5" cy="44"/></g>';
      var textos = '<p class="lt-t" data-v="-1">' + h(d.vazio) + '</p>' + d.versoes.map(function (v, i) { return '<p class="lt-t" data-v="' + i + '">' + h(v.texto) + '</p>'; }).join('');
      return '<div class="dividido dividido--estreito">' + R.cab(d, R.rotulo('Arraste o marcador na linha do tempo.', 640)) +
        R.encaixe(W, 540, '<div class="lt" data-e="zoom" style="--d:250ms">' +
          '<div class="lt-topo"><b>' + h(d.norma) + '</b><span class="codigo">' + h(d.urn) + '</span></div>' +
          '<div class="lt-cartao"><div class="lt-l1"><span class="rotulo">Data do fato</span><b class="lt-dia tnum">—</b><span class="lt-selo"></span></div>' +
          '<div class="lt-textos">' + textos + '</div><p class="rotulo lt-fonte"></p></div>' +
          '<svg class="lt-eixo" viewBox="0 0 ' + W + ' 140" role="slider" tabindex="0" aria-label="Data do fato" aria-valuetext="">' + eixo + '</svg>' +
          '<p class="lt-nota"><b>' + h(d.marco.rotulo) + '.</b> ' + h(d.marco.texto) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var W = 760, X0 = 34, X1 = W - 34, t0 = R.dia(d.de), t1 = R.dia(d.ate), svg = q(el, '.lt-eixo');
      var alca = q(el, '.lt-alca'), dia = q(el, '.lt-dia'), selo = q(el, '.lt-selo'), fonte = q(el, '.lt-fonte'), ts = qa(el, '.lt-t');
      var atual = null, data = R.dia('2016-03-15'), mexeu = -1e9;
      var lim = d.versoes.map(function (v) { return [R.dia(v.de), v.ate ? R.dia(v.ate) + 864e5 - 1 : Infinity]; });
      function xDe(ms) { return X0 + (ms - t0) / (t1 - t0) * (X1 - X0); }
      function por(ms) {
        data = Math.max(t0, Math.min(t1, ms));
        alca.setAttribute('transform', 'translate(' + xDe(data).toFixed(1) + ' 0)');
        dia.textContent = R.fmt(data);
        svg.setAttribute('aria-valuetext', R.fmt(data));
        var v = -1; lim.forEach(function (l, i) { if (data >= l[0] && data <= l[1]) v = i; });
        if (v !== atual) {
          atual = v;
          ts.forEach(function (t) { t.classList.toggle('on', +t.dataset.v === v); });
          selo.innerHTML = v < 0 ? R.selo('neutro', 'ainda não existia') : R.selo('sucesso', 'vigente nesta data');
          fonte.textContent = v < 0 ? 'CLT, art. 58: sem o § 2º' : d.versoes[v].fonte;
          el.querySelector('.lt').dataset.v = v;
        }
      }
      por(data);
      // Arrastar e teclado.
      function dataDoPonto(e) { var r = svg.getBoundingClientRect(), xx = (e.clientX - r.left) / r.width * W; return t0 + (xx - X0) / (X1 - X0) * (t1 - t0); }
      var arrastando = false;
      api.ouvir(svg, 'pointerdown', function (e) { arrastando = true; mexeu = performance.now(); svg.setPointerCapture(e.pointerId); por(dataDoPonto(e)); });
      api.ouvir(svg, 'pointermove', function (e) { if (arrastando) { mexeu = performance.now(); por(dataDoPonto(e)); } });
      api.ouvir(svg, 'pointerup', function () { arrastando = false; mexeu = performance.now(); });
      api.ouvir(svg, 'keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault(); e.stopPropagation(); mexeu = performance.now();
        por(data + (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 365 : 30) * 864e5);
      });
      if (api.parado) return;
      // Sozinho: o marcador vai e volta devagar, de 2000 a 2026, e para um pouco quando cruza uma mudança.
      var a0 = R.dia('2000-03-01'), a1 = R.dia('2026-06-01'), fase = 0.25, ultimo = performance.now();
      api.quadro(function (agora) {
        var dt = Math.min(64, agora - ultimo); ultimo = agora;
        if (agora - mexeu < 8000) { fase = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * (data - a0) / (a1 - a0)))) / (Math.PI * 2); return true; }
        fase += dt / 26000;
        por(a0 + (a1 - a0) * (0.5 - 0.5 * Math.cos(fase * Math.PI * 2)));
        return true;
      });
    }
  };

  /* ---------------- duelo: a mesma pergunta, a IA comum e o Consultor ---------------- */
  T.duelo = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 444, c = d.consultor;
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<div class="duelo">' +
        '<div class="duelo-perg"><span class="rotulo">' + h(d.exemplo) + '</span><p><span class="t-perg"></span></p></div>' +
        '<div class="duelo-lados">' +
          '<section class="lado-comum"><header><span class="ico-comum" aria-hidden="true"></span><b>IA comum</b><span class="rotulo">resposta ilustrativa</span></header>' +
            '<p class="t-comum"></p><ul class="marcas">' + d.comum.marcas.map(function (m) { return '<li>' + R.marca('nao') + '<span>' + h(m) + '</span></li>'; }).join('') + '</ul></section>' +
          '<section class="lado-cons"><header>' + R.orb('consultor', { tamanho: 28 }) + '<b>Consultor</b><span class="rotulo est">pensando</span></header>' +
            '<p class="t-cons"></p><div class="cits">' + c.citacoes.map(function (x) { return R.citacao(x, 'aparece'); }).join('') + '</div>' +
            '<div class="rod aparece">' + R.selo('sucesso', c.grau) + '<span>' + h(c.rodape) + '</span></div></section>' +
        '</div></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var tp = q(el, '.t-perg'), tc = q(el, '.t-comum'), tk = q(el, '.t-cons'), marcas = qa(el, '.marcas li'), partes = qa(el, '.lado-cons .aparece');
      var o = q(el, '.lado-cons orb-avatar'), est = q(el, '.lado-cons .est'), comum = q(el, '.lado-comum');
      var errado = 'exige idade mínima de 65 anos para homens';
      function marcarErro() { var t = d.comum.texto, i = t.indexOf(errado); tc.innerHTML = h(t.slice(0, i)) + '<span class="trecho-errado">' + h(errado) + '</span>' + h(t.slice(i + errado.length)); }
      function final() {
        tp.textContent = d.pergunta; marcarErro(); tk.textContent = d.consultor.texto;
        marcas.forEach(function (m) { m.classList.add('on'); }); partes.forEach(function (p) { p.classList.add('on'); }); comum.classList.add('conferida');
        o.setAttribute('reaction', 'done'); est.textContent = 'respondeu';
      }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        tp.textContent = ''; tc.textContent = ''; tk.textContent = ''; comum.classList.remove('conferida');
        marcas.forEach(function (m) { m.classList.remove('on'); }); partes.forEach(function (p) { p.classList.remove('on'); });
        o.setAttribute('reaction', 'idle'); est.textContent = 'disponível';
        await api.esperar(700);
        await api.digitar(tp, d.pergunta, 34);
        await api.esperar(400);
        o.setAttribute('reaction', 'thinking'); est.textContent = 'procurando a regra da data';
        var esq = (async function () { await api.esperar(500); await api.digitar(tc, d.comum.texto, 50); })();
        var dir = (async function () {
          await api.esperar(2400); o.setAttribute('reaction', 'working'); est.textContent = 'respondendo';
          await api.digitar(tk, d.consultor.texto, 55);
          for (var i = 0; i < partes.length; i++) { await api.esperar(380); partes[i].classList.add('on'); }
          o.setAttribute('reaction', 'done'); est.textContent = 'respondeu';
        })();
        await esq;
        await api.esperar(900);
        comum.classList.add('conferida'); marcarErro();
        for (var k = 0; k < marcas.length; k++) { await api.esperar(500); marcas[k].classList.add('on'); }
        await dir;
        await api.esperar(7500);
      });
    }
  };

  /* ---------------- fatos: números com fonte, que contam de novo de tempos em tempos ---------------- */
  T.fatos = {
    html: function (d) {
      var itens = d.itens.map(function (it, i) {
        var n = it.ate ? '<span class="n-a tnum">0</span>% a <span class="n-b tnum">0</span>%' : '<span class="n-a tnum">0</span>' + h(it.sufixo || '');
        return '<li data-e style="--d:' + (360 + i * 160) + 'ms"><b class="numero">' + n + '</b><span class="t">' + h(it.texto) + '</span><span class="f">' + h(it.fonte) + '</span></li>';
      }).join('');
      return '<div class="dividido">' + R.cab(d, '<p class="nota-oab" data-e style="--d:700ms">' + h(d.nota) + '</p>') +
        R.encaixe(620, 500, '<ul class="fatos-lista">' + itens + '</ul>') + '</div>';
    },
    entrar: function (el, d, api) {
      var lis = qa(el, '.fatos-lista li');
      function rodar() {
        return Promise.all(d.itens.map(function (it, i) {
          var a = q(lis[i], '.n-a'), b = q(lis[i], '.n-b');
          return api.esperar(i * 260).then(function () {
            return Promise.all([R.contar(api, a, it.numero, 1500), b ? R.contar(api, b, it.ate, 1700) : null]);
          });
        }));
      }
      if (api.parado) { rodar(); return; }
      R.laco(async function () { await api.esperar(500); await rodar(); await api.esperar(9000); });
    }
  };

  /* ---------------- armadilhas: cinco cartões com um desenho que se repete ---------------- */
  var DESENHO = {
    versoes: '<svg viewBox="0 0 180 90"><g class="paginas"><rect class="pg pg3" x="62" y="10" width="56" height="70" rx="6"/><rect class="pg pg2" x="62" y="10" width="56" height="70" rx="6"/><rect class="pg pg1" x="62" y="10" width="56" height="70" rx="6"/></g>' +
      '<g class="linhas-pg"><line x1="72" y1="28" x2="108" y2="28"/><line x1="72" y1="40" x2="104" y2="40"/><line x1="72" y1="52" x2="108" y2="52"/></g></svg>',
    revogacao: '<svg viewBox="0 0 180 90"><line class="l" x1="40" y1="28" x2="140" y2="28"/><line class="l" x1="40" y1="44" x2="128" y2="44"/><line class="l" x1="40" y1="60" x2="136" y2="60"/><line class="risco" x1="34" y1="44" x2="146" y2="44"/></svg>',
    remissao: '<svg viewBox="0 0 180 90"><rect class="doc" x="18" y="22" width="44" height="52" rx="6"/><rect class="doc" x="118" y="16" width="44" height="52" rx="6"/>' +
      '<path class="fio" id="rm-p" d="M62 40 C 90 6, 100 6, 118 34"/><g class="corre"><rect x="-8" y="-4" width="16" height="8" rx="4"><animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto" path="M62 40 C 90 6, 100 6, 118 34"/></rect></g></svg>',
    vocabulario: '<svg viewBox="0 0 180 90"><rect class="pil" x="6" y="16" width="92" height="24" rx="12"/><text x="52" y="32" text-anchor="middle">faturamento</text>' +
      '<rect class="pil" x="80" y="52" width="94" height="24" rx="12"/><text x="127" y="68" text-anchor="middle">receita bruta</text><path class="liga" d="M52 40 C 52 50, 127 42, 127 52"/></svg>',
    chute: '<svg viewBox="0 0 180 90"><text x="10" y="30">chute</text><rect class="trilho" x="62" y="20" width="108" height="12" rx="6"/><rect class="barra-chute" x="62" y="20" width="108" height="12" rx="6"/>' +
      '<text x="10" y="64">não sei</text><rect class="trilho" x="62" y="54" width="108" height="12" rx="6"/><text class="zero" x="170" y="64" text-anchor="end">0 ponto</text></svg>'
  };
  T.armadilhas = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 320;
      var cards = d.itens.map(function (it, i) {
        return '<li class="armadilha a-' + it.id + '" data-e style="--d:' + (380 + i * 120) + 'ms"><div class="desenho" aria-hidden="true">' + DESENHO[it.id] + '</div>' +
          '<b>' + h(it.nome) + '</b><span>' + h(it.texto) + '</span></li>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<ol class="armadilhas">' + cards + '</ol>') + '</div>';
    },
    entrar: function (el, d, api) {
      if (api.parado) qa(el, 'animateMotion').forEach(function (a) { a.remove(); });
    }
  };

  /* ---------------- quatrocamadas: as quatro camadas e o caminho de uma pergunta ---------------- */
  var CAIXAS = [
    { id: 'cons', x: 250, y: 36, w: 260, h: 112, nome: 'Consultor', sub: 'entende, pesquisa, confere e responde', orb: true },
    { id: 'base', x: 30, y: 246, w: 300, h: 112, nome: 'Base legal no tempo', sub: 'cada dispositivo, todas as redações, o grafo' },
    { id: 'viva', x: 430, y: 246, w: 300, h: 112, nome: 'Busca ao vivo', sub: 'fontes oficiais; sai marcada "ainda não validada"' },
    { id: 'melh', x: 130, y: 432, w: 500, h: 84, nome: 'Melhoria contínua, fora da produção', sub: 'correções, benchmark, laço de melhoria, revisão humana' },
    { id: 'perg', x: 26, y: 74, w: 168, h: 40, nome: 'Pergunta com data', pilula: true },
    { id: 'resp', x: 566, y: 74, w: 168, h: 40, nome: 'Resposta com citação', pilula: true }
  ];
  var CAMINHOS = [
    { de: 'perg', para: 'cons', d: 'M194 94 L250 94', txt: 'A pergunta chega com a data do fato.' },
    { de: 'cons', para: 'base', d: 'M300 148 C 300 200, 190 200, 190 246', txt: 'O Consultor consulta a base na data do fato.' },
    { de: 'base', para: 'cons', d: 'M230 246 C 230 196, 352 196, 352 148', txt: 'Volta só a redação vigente naquele dia, com o identificador do trecho.' },
    { de: 'cons', para: 'resp', d: 'M510 94 L566 94', txt: 'Responde com o trecho citado, ou diz que não encontrou.' },
    { de: 'viva', para: 'base', d: 'M430 302 L330 302', txt: 'Norma de hoje cedo: a busca ao vivo traz das fontes oficiais, marcada, e põe na fila de ingestão.' },
    { de: 'cons', para: 'melh', d: 'M510 124 C 752 124, 752 474, 630 474', txt: 'As respostas avaliadas descem para a melhoria, fora da produção.' },
    { de: 'melh', para: 'cons', d: 'M130 474 C 6 474, 6 124, 250 124', txt: 'Só volta ao ar a versão que vence a prova e que uma pessoa aprova.' }
  ];
  T.quatrocamadas = {
    html: function (d) {
      var fios = CAMINHOS.map(function (c, i) { return '<path class="fio-base" d="' + c.d + '"/><path class="fio-cheio" data-i="' + i + '" d="' + c.d + '"/>'; }).join('');
      var caixas = CAIXAS.map(function (c) {
        return '<div class="cx cx-' + c.id + (c.pilula ? ' cx-pilula' : '') + '" data-id="' + c.id + '" style="left:' + c.x + 'px;top:' + c.y + 'px;width:' + c.w + 'px;height:' + c.h + 'px">' +
          (c.orb ? R.orb('consultor', { tamanho: 36, modo: 'follow' }) : '') + '<div><b>' + h(c.nome) + '</b>' + (c.sub ? '<span>' + h(c.sub) + '</span>' : '') + '</div></div>';
      }).join('');
      return '<div class="dividido dividido--estreito">' + R.cab(d) + R.encaixe(760, 600, '<div class="camadas4" data-e="zoom" style="--d:250ms">' +
        '<svg class="fios4" viewBox="0 0 760 540" aria-hidden="true">' + fios + '</svg>' + caixas +
        '<p class="legenda4" aria-live="polite"><span class="n tnum">1</span><span class="t"></span></p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var svg = q(el, '.fios4'), cheios = qa(el, '.fio-cheio'), cx = {}, leg = q(el, '.legenda4 .t'), n = q(el, '.legenda4 .n');
      qa(el, '.cx').forEach(function (c) { cx[c.dataset.id] = c; });
      cheios.forEach(function (c) { var L = c.getTotalLength(); c.style.strokeDasharray = L; c.style.strokeDashoffset = L; });
      function acender(id) { Object.keys(cx).forEach(function (k) { cx[k].classList.toggle('ativo', k === id); }); }
      if (api.parado) { leg.textContent = CAMINHOS[1].txt; acender('base'); return; }
      R.laco(async function () {
        for (var i = 0; i < CAMINHOS.length; i++) {
          var c = CAMINHOS[i];
          n.textContent = i + 1; leg.textContent = c.txt; acender(c.de);
          cheios.forEach(function (x) { x.classList.remove('on'); x.style.strokeDashoffset = x.getTotalLength(); });
          cheios[i].classList.add('on');
          await api.esperar(500);
          await R.viajar(api, svg, cheios[i], 1500, { cheio: cheios[i] });
          acender(c.para);
          await api.esperar(1900);
        }
        await api.esperar(800);
      });
    }
  };
})();
