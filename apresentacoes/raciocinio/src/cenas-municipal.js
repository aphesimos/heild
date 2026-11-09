/*
 * O raciocínio do Consultor — a base municipal: municipal, cobertura, revisaoia, limite, blocos.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;

  /* ---------------- municipal: as três esferas e o funil dos diários de SC ---------------- */
  T.municipal = {
    html: function (d) {
      var esf = d.esferas.map(function (e, i) {
        return '<li data-e style="--d:' + (300 + i * 120) + 'ms" class="esf esf-' + i + '"><b>' + h(e[0]) + '</b><span>' + h(e[1]) + '</span><span class="pilula pilula--contorno">' + h(e[2]) + '</span></li>';
      }).join('');
      var larg = [100, 62, 30];
      var fun = d.funil.map(function (f, i) {
        return '<li class="fun-l" style="--l:' + larg[i] + '%"><span class="fun-b"><b class="tnum fun-n" data-n="' + f[0] + '">0</b></span><span class="fun-t">' + h(f[1]) + '</span></li>';
      }).join('');
      var formas = d.formas.map(function (f) { return '<li><b class="tnum">' + h(f[0]) + '</b><span>' + h(f[1]) + '</span></li>'; }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 540, '<div class="munic" data-e="zoom" style="--d:250ms">' +
        '<ul class="esferas">' + esf + '</ul>' +
        '<div class="funil-box"><ul class="funil">' + fun + '</ul><div class="gotas" aria-hidden="true"></div></div>' +
        '<ul class="formas">' + formas + '</ul><p class="rotulo munic-fonte">' + h(d.fonte) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ns = qa(el, '.fun-n'), gotas = q(el, '.gotas');
      function contar() { return Promise.all(ns.map(function (n, i) { return api.esperar(i * 350).then(function () { return R.contar(api, n, +n.dataset.n, 1300); }); })); }
      if (api.parado) { contar(); return; }
      // Gotas descem pelo funil; a maioria some no caminho, poucas chegam ao fim.
      var vivas = [], t0 = performance.now(), prox = 0;
      api.quadro(function (agora) {
        if (agora > prox) {
          prox = agora + 220;
          var g = document.createElement('i'); g.className = 'gota';
          var fica = Math.random(); g.dataset.fim = fica < 0.08 ? 3 : fica < 0.3 ? 2 : 1;
          g.style.left = (8 + Math.random() * 84) + '%';
          gotas.appendChild(g); vivas.push({ el: g, t: agora, x: parseFloat(g.style.left) });
        }
        vivas = vivas.filter(function (v) {
          var u = (agora - v.t) / 2600, fim = +v.el.dataset.fim, alt = gotas.clientHeight;
          if (u >= fim / 3 || u >= 1) { v.el.remove(); return false; }
          var larg = u < 1 / 3 ? 1 : u < 2 / 3 ? 0.62 : 0.3, x = 50 + (v.x - 50) * larg;
          v.el.style.transform = 'translate(' + (x / 100 * gotas.clientWidth).toFixed(1) + 'px,' + (u * alt).toFixed(1) + 'px)';
          v.el.style.opacity = Math.min(1, (fim / 3 - u) * 12).toFixed(2);
          return true;
        });
        return true;
      });
      R.laco(async function () { ns.forEach(function (n) { n.textContent = '0'; }); await api.esperar(600); await contar(); await api.esperar(9000); });
      api.aoSair(function () { gotas.innerHTML = ''; });
    }
  };

  /* ---------------- cobertura: os cinco níveis e o texto aprovado de cada um ---------------- */
  T.cobertura = {
    html: function (d) {
      var degraus = d.niveis.map(function (n, i) {
        return '<button type="button" class="degrau" data-i="' + i + '" style="--k:' + i + '" aria-pressed="false"><b>' + h(n.id) + '</b><span>' + h(n.nome) + '</span></button>';
      }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(640, 520, '<div class="cobert" data-e="zoom" style="--d:250ms">' +
        '<div class="escada" role="group" aria-label="Níveis de cobertura">' + degraus + '</div>' +
        '<section class="cartao-cob"><header>' + R.orb('consultor', { tamanho: 28, estatico: true, extras: false }) + '<b>ISS · <span class="var">ente</span></b><span class="cob-rot"></span></header>' +
          '<p class="cob-texto"></p><p class="rotulo cob-rod">Cobertura local: <span class="var">ente</span>, ISS: <span class="cob-curto"></span> · <u>Reportar</u></p></section>' +
        '<p class="cob-nfse">' + h(d.nfse) + '</p><p class="rotulo cob-aprov">Textos aprovados pelo dono em 9/11/2026. Os nomes em destaque são as variáveis.</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ds = qa(el, '.degrau'), tx = q(el, '.cob-texto'), rot = q(el, '.cob-rot'), curto = q(el, '.cob-curto'), i = 0, mexeu = -1e9;
      function por(k) {
        i = k; var n = d.niveis[k];
        ds.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); b.classList.toggle('abaixo', j < k); });
        rot.innerHTML = R.selo(k >= 3 ? 'sucesso' : k === 2 ? 'atencao' : 'neutro', n.id + ' · ' + n.nome);
        curto.textContent = n.nome;
        tx.innerHTML = n.texto.map(function (p) { return p[0] === 'v' ? '<span class="var">' + h(p[1]) + '</span>' : p[0] === 'b' ? '<b>' + h(p[1]) + '</b>' : h(p[1]); }).join('');
      }
      ds.forEach(function (b, k) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(k); }); });
      por(0);
      if (api.parado) return;
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; por((i + 1) % d.niveis.length); }, 3800);
    }
  };

  /* ---------------- revisaoia: o caminho de um ato pela revisão de três famílias ---------------- */
  var POS = {
    ato: [80, 82], a: [262, 36], b: [262, 128], cmp: [446, 82], evi: [618, 82], rec: [800, 22], val: [980, 82],
    rev: [980, 238], con: [760, 238], ouro: [540, 238], cert: [250, 238]
  };
  var FIOS = {
    'ato>a': 'M150 82 C 190 82, 170 36, 192 36', 'ato>b': 'M150 82 C 190 82, 170 128, 192 128',
    'a>cmp': 'M332 36 C 360 36, 352 82, 376 82', 'b>cmp': 'M332 128 C 360 128, 352 82, 376 82',
    'cmp>evi': 'M516 82 L548 82', 'evi>val': 'M688 82 L910 82', 'evi>rec': 'M688 82 C 712 82, 708 22, 730 22', 'rec>val': 'M870 22 C 892 22, 888 82, 910 82',
    'val>rev': 'M980 108 L980 212', 'rev>con': 'M910 238 L830 238', 'con>ouro': 'M690 238 L610 238', 'ouro>cert': 'M470 238 L352 238',
    'rev>cert': 'M980 264 C 980 320, 300 320, 280 268'
  };
  T.revisaoia = {
    html: function (d) {
      var nos = d.nos.map(function (n) {
        var p = POS[n.id];
        return '<div class="no-r no-' + n.id + '" data-id="' + n.id + '" style="left:' + p[0] + 'px;top:' + (p[1] + 16) + 'px"><b>' + h(n.nome) + '</b><span>' + h(n.quem) + '</span></div>';
      }).join('');
      var fios = Object.keys(FIOS).map(function (k) { return '<path class="fio-r' + (k === 'rev>cert' ? ' desvio' : '') + '" data-k="' + k + '" d="' + FIOS[k] + '"/>'; }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(1152, 420, '<div class="revia">' +
        '<svg class="fios-r" viewBox="0 -16 1152 346" aria-hidden="true">' + fios + '<text class="as-cegas" x="262" y="88" text-anchor="middle">às cegas</text></svg>' + nos +
        '<div class="no-r no-cert" data-id="cert" style="left:' + POS.cert[0] + 'px;top:' + (POS.cert[1] + 16) + 'px"><span class="rotulo">Certeza</span><span class="cert-selo"></span></div>' +
        '<div class="rodada"><p class="rod-t"><span class="rotulo">Rodada <span class="tnum rod-n">1</span> de 3</span><b class="rod-tit"></b></p><p class="rod-tx"></p></div>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var svg = q(el, '.fios-r'), nos = {}, fios = {}, tit = q(el, '.rod-tit'), tx = q(el, '.rod-tx'), rn = q(el, '.rod-n'), selo = q(el, '.cert-selo');
      qa(el, '.no-r').forEach(function (n) { nos[n.dataset.id] = n; });
      qa(el, '.fio-r').forEach(function (f) { fios[f.dataset.k] = f; });
      var SELO = { alta: ['sucesso', 'certeza alta'], 'média': ['atencao', 'certeza média'], baixa: ['erro', 'certeza baixa'] };
      function zerar() { Object.keys(nos).forEach(function (k) { nos[k].classList.remove('on', 'feito'); }); Object.keys(fios).forEach(function (k) { fios[k].classList.remove('on'); }); selo.innerHTML = ''; }
      function marcar(id) { if (nos[id]) { nos[id].classList.add('on'); } }
      function por(r, k) { rn.textContent = k + 1; tit.textContent = r.titulo; tx.textContent = r.texto; }
      if (api.parado) { var r0 = d.rodadas[1]; por(r0, 1); r0.caminho.forEach(function (id) { if (id === 'ab') { marcar('a'); marcar('b'); } else marcar(id); }); selo.innerHTML = R.selo(SELO[r0.certeza][0], SELO[r0.certeza][1]); return; }
      var k = 0;
      R.laco(async function () {
        var r = d.rodadas[k % d.rodadas.length]; zerar(); por(r, k % d.rodadas.length); k++;
        await api.esperar(700); marcar('ato');
        var prev = 'ato';
        for (var i = 1; i < r.caminho.length; i++) {
          var id = r.caminho[i];
          if (id === 'ab') {
            fios['ato>a'].classList.add('on'); fios['ato>b'].classList.add('on');
            await Promise.all([R.viajar(api, svg, fios['ato>a'], 800), R.viajar(api, svg, fios['ato>b'], 800)]);
            marcar('a'); marcar('b'); await api.esperar(500);
            prev = 'ab'; continue;
          }
          if (prev === 'ab') {
            fios['a>cmp'].classList.add('on'); fios['b>cmp'].classList.add('on');
            await Promise.all([R.viajar(api, svg, fios['a>cmp'], 700), R.viajar(api, svg, fios['b>cmp'], 700)]);
          } else {
            var f = fios[prev + '>' + id]; f.classList.add('on'); await R.viajar(api, svg, f, prev === 'evi' && id === 'val' ? 1000 : 700);
          }
          marcar(id); prev = id;
          await api.esperar(id === 'rec' || id === 'rev' ? 700 : 380);
        }
        var fim = prev + '>cert', ff = fios[fim] || fios['rev>cert'];
        ff.classList.add('on'); await R.viajar(api, svg, ff, prev === 'rev' ? 1300 : 700);
        selo.innerHTML = R.selo(SELO[r.certeza][0], SELO[r.certeza][1]); nos.cert.classList.add('on');
        await api.esperar(4200);
      });
    }
  };

  /* ---------------- limite: as travas como fatias de queijo; poucos erros atravessam todas ---------------- */
  var BURACOS = [[0.18, 0.62], [0.42, 0.8], [0.3, 0.58], [0.66, 0.2], [0.5], [0.36, 0.72], [0.56]];
  T.limite = {
    html: function (d) {
      var X0 = 70, PASSO = 78, H0 = 40, H1 = 360, ALT = 0.11;
      var fatias = d.travas.map(function (t, i) {
        var x = X0 + i * PASSO, bs = BURACOS[i].slice().sort(), y = H0, seg = '';
        bs.forEach(function (b) { var yc = H0 + b * (H1 - H0), ya = yc - ALT * (H1 - H0) / 2; seg += '<rect x="' + (x - 13) + '" y="' + y.toFixed(1) + '" width="26" height="' + Math.max(0, ya - y).toFixed(1) + '" rx="8"/>'; y = ya + ALT * (H1 - H0); });
        seg += '<rect x="' + (x - 13) + '" y="' + y.toFixed(1) + '" width="26" height="' + (H1 - y).toFixed(1) + '" rx="8"/>';
        return '<g class="fatia" data-i="' + i + '">' + seg + '</g>';
      }).join('');
      var rots = d.travas.map(function (t, i) { return '<span style="left:' + (X0 + i * PASSO) + 'px">' + h(t) + '</span>'; }).join('');
      return '<div class="dividido">' + R.cab(d, '<div class="lim-num" data-e style="--d:600ms"><b>' + h(d.numero) + '</b><span>' + h(d.numeroTexto) + '</span></div>') +
        R.encaixe(640, 480, '<div class="limite" data-e="zoom" style="--d:250ms"><svg class="lim-svg" viewBox="0 0 640 400" aria-hidden="true">' + fatias + '<g class="erros"></g></svg>' +
        '<div class="lim-rots">' + rots + '</div><p class="rotulo lim-leg">Cada ponto é um erro possível. Cada trava pega alguns; nenhuma pega todos.</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var X0 = 70, PASSO = 78, H0 = 40, H1 = 360, ALT = 0.11, g = q(el, '.erros'), vivos = [], prox = 0, sem = 1;
      if (api.parado) return;
      function rnd() { var x = Math.sin(sem++ * 9301 + 49297) * 233280; return x - Math.floor(x); }
      function passa(i, y) { return BURACOS[i].some(function (b) { var yc = H0 + b * (H1 - H0); return Math.abs(y - yc) < ALT * (H1 - H0) / 2 - 4; }); }
      api.quadro(function (agora) {
        if (agora > prox) {
          prox = agora + 260;
          // Escolhe a altura: uma parte mira num buraco da primeira trava, para alguns irem longe.
          var y = rnd() < 0.55 ? H0 + BURACOS[0][Math.floor(rnd() * 2)] * (H1 - H0) + (rnd() - 0.5) * 18 : H0 + 10 + rnd() * (H1 - H0 - 20);
          var c = R.svg('circle', { r: 4, cx: 10, cy: y.toFixed(1), 'class': 'erro-p' }, g);
          vivos.push({ c: c, y: y, x: 10, vy: 0, parou: -1, t: agora });
        }
        vivos = vivos.filter(function (v) {
          if (v.parou >= 0) { var u = (agora - v.parou) / 700; v.c.style.opacity = (1 - u).toFixed(2); v.c.setAttribute('r', (4 + u * 6).toFixed(1)); if (u >= 1) { v.c.remove(); return false; } return true; }
          v.x += 2.1;
          // Entre as travas, o ponto busca um pouco o buraco seguinte (o erro "procura" a brecha).
          var prox2 = Math.floor((v.x - X0 + 13) / PASSO) + 1;
          if (prox2 >= 0 && prox2 < BURACOS.length && rnd() < 0.5) { var alvo = H0 + BURACOS[prox2][0] * (H1 - H0); v.y += (alvo - v.y) * 0.004; }
          var i = Math.round((v.x - X0) / PASSO), xi = X0 + i * PASSO;
          if (i >= 0 && i < BURACOS.length && Math.abs(v.x - xi) < 13 && !passa(i, v.y)) { v.parou = agora; v.c.classList.add('pego'); return true; }
          v.c.setAttribute('cx', v.x.toFixed(1)); v.c.setAttribute('cy', v.y.toFixed(1));
          if (v.x > 640) { v.c.remove(); return false; }
          return true;
        });
        return true;
      });
    }
  };

  /* ---------------- blocos: escolha um pacote e veja os blocos que ele usa ---------------- */
  T.blocos = {
    html: function (d) {
      var ps = d.pacotes.map(function (p, i) { return '<button type="button" class="pacote" data-i="' + i + '" aria-pressed="false">' + h(p[1]) + '</button>'; }).join('');
      var bs = d.blocos.map(function (b, i) { return '<li class="bloco" data-i="' + i + '"><span class="codigo">' + h(b[0]) + '</span><b>' + h(b[1]) + '</b></li>'; }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(1152, 410, '<div class="blocos-box">' +
        '<div class="pacotes" role="group" aria-label="Pacotes">' + ps + '</div>' +
        '<ol class="blocos">' + bs + '</ol>' +
        '<div class="legenda-b"><span><i class="lg-i"></i>Inteiro: o bloco todo, com os avisos de mudança</span><span><i class="lg-f"></i>Fatia: só os dispositivos que o pacote cita</span><span class="conta-b tnum"></span></div>' +
        '<p class="rod-b">' + h(d.rodape) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ps = qa(el, '.pacote'), bs = qa(el, '.bloco'), conta = q(el, '.conta-b'), i = 0, mexeu = -1e9;
      function por(k) {
        i = k; var ni = 0, nf = 0;
        ps.forEach(function (p, j) { p.setAttribute('aria-pressed', String(j === k)); });
        d.blocos.forEach(function (b, j) { var c = b[2].charAt(k); bs[j].classList.toggle('inteiro', c === 'I'); bs[j].classList.toggle('fatia', c === 'F'); bs[j].classList.toggle('fora', c === '.'); if (c === 'I') ni++; if (c === 'F') nf++; });
        conta.textContent = d.pacotes[k][1] + ': ' + ni + ' inteiros, ' + nf + ' fatias';
      }
      ps.forEach(function (p, k) { api.ouvir(p, 'click', function () { mexeu = performance.now(); por(k); }); });
      por(0);
      if (api.parado) return;
      api.intervalo(function () { if (performance.now() - mexeu < 9000) return; por((i + 1) % ps.length); }, 3200);
    }
  };
})();
