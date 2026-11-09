/*
 * O raciocínio do Consultor — a confiança: verificador, abstencao, divergencia, responsabilidade.
 */
(function () {
  'use strict';
  var R = window.RAC, T = window.HEILD_TIPOS, h = R.h, q = R.q, qa = R.qa;
  var PORTOES = ['Existe?', 'Valia na data?', 'Diz isso?'];

  /* ---------------- verificador: cada afirmação passa por três perguntas ---------------- */
  T.verificador = {
    html: function (d) {
      var linhas = d.afirmacoes.map(function (a, i) {
        return '<li class="afirm" data-i="' + i + '"><div class="af-t"><span class="txt">' + h(a.texto) + '</span><span class="rotulo">' + h(a.norma) + '</span></div>' +
          PORTOES.map(function (p, k) { return '<span class="portao" data-k="' + k + '"><span class="m"></span><span class="pal"></span></span>'; }).join('') +
          '<span class="saida-af"></span></li>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(1152, 410, '<div class="verif">' +
        '<p class="rotulo verif-ctx">' + h(d.contexto) + '</p>' +
        '<div class="verif-cab"><span>Afirmação do rascunho</span>' + PORTOES.map(function (p) { return '<span>' + h(p) + '</span>'; }).join('') + '<span>Saída</span></div>' +
        '<ol class="afirms">' + linhas + '</ol>' +
        '<div class="verif-trecho"><span class="rotulo">Trecho conferido</span><p class="t-trecho"></p></div>' +
        '<p class="verif-fato">' + h(d.fato) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var lis = qa(el, '.afirm'), trecho = q(el, '.t-trecho');
      function marcar(li, k, v) {
        var p = qa(li, '.portao')[k];
        p.classList.remove('sim', 'nao', 'nada');
        p.classList.add(v === 1 ? 'sim' : v === 0 ? 'nao' : 'nada');
        q(p, '.m').innerHTML = R.marca(v === 1 ? 'sim' : v === 0 ? 'nao' : 'nada');
        q(p, '.pal').textContent = v === 1 ? 'sim' : v === 0 ? 'não' : '—';
      }
      function sair(li, a) {
        var ok = a.r.every(function (v) { return v === 1; });
        q(li, '.saida-af').innerHTML = ok ? R.selo('sucesso', a.calculo ? 'mantida · cálculo' : 'mantida') : R.selo('erro', 'removida') + '<span class="motivo">' + h(a.motivo || '') + '</span>';
        li.classList.toggle('removida', !ok); li.classList.add('decidida');
      }
      function zerar() { lis.forEach(function (li) { li.className = 'afirm'; qa(li, '.portao').forEach(function (p) { p.className = 'portao'; q(p, '.m').innerHTML = ''; q(p, '.pal').textContent = ''; }); q(li, '.saida-af').innerHTML = ''; }); trecho.textContent = ''; }
      if (api.parado) { d.afirmacoes.forEach(function (a, i) { a.r.forEach(function (v, k) { marcar(lis[i], k, v); }); sair(lis[i], a); }); trecho.textContent = d.afirmacoes[1].trecho; return; }
      R.laco(async function () {
        zerar(); await api.esperar(900);
        for (var i = 0; i < lis.length; i++) {
          var a = d.afirmacoes[i];
          lis.forEach(function (x) { x.classList.remove('atual'); }); lis[i].classList.add('atual');
          trecho.textContent = a.trecho;
          for (var k = 0; k < 3; k++) { await api.esperar(520); marcar(lis[i], k, a.r[k]); }
          await api.esperar(420); sair(lis[i], a);
          await api.esperar(a.r.every(function (v) { return v === 1; }) ? 700 : 2200);
        }
        lis.forEach(function (x) { x.classList.remove('atual'); });
        await api.esperar(6000);
      });
    }
  };

  /* ---------------- abstencao: o cartão de abstenção, um tipo por vez ---------------- */
  T.abstencao = {
    html: function (d) {
      var abas = d.tipos.map(function (t, i) { return '<button type="button" class="aba-abs" data-i="' + i + '" aria-pressed="false">' + h(t.nome) + '</button>'; }).join('');
      return '<div class="dividido">' + R.cab(d) + R.encaixe(620, 520, '<div class="abst" data-e="zoom" style="--d:250ms">' +
        '<div class="abas-abs" role="group" aria-label="Tipos de abstenção">' + abas + '</div>' +
        '<section class="cartao-abs"><header>' + R.orb('consultor', { tamanho: 32 }) + '<b>Consultor</b><span class="rotulo est">pensando</span></header>' +
          '<p class="t-abs"></p><div class="pesq"><p class="rotulo">O que pesquisei</p><ul></ul></div>' +
          '<div class="acoes-abs"><span class="botao botao--fantasma botao--pequeno">Buscar nas fontes oficiais</span><span class="botao botao--fantasma botao--pequeno">Passar ao responsável</span></div></section>' +
        '<p class="abs-fato">' + h(d.fato) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var abas = qa(el, '.aba-abs'), t = q(el, '.t-abs'), ul = q(el, '.pesq ul'), o = q(el, '.cartao-abs orb-avatar'), est = q(el, '.cartao-abs .est'), i = 0, mexeu = -1e9, vez = 0;
      async function por(k, digitar) {
        var minha = ++vez; i = k;
        abas.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); });
        ul.innerHTML = ''; t.textContent = '';
        o.setAttribute('reaction', 'thinking'); est.textContent = 'pesquisando';
        if (digitar && !api.parado) { await api.esperar(900); if (minha !== vez) return; o.setAttribute('reaction', 'working'); est.textContent = 'respondendo'; await api.digitar(t, d.tipos[k].texto, 50); }
        else t.textContent = d.tipos[k].texto;
        if (minha !== vez) return;
        ul.innerHTML = d.tipos[k].pesquisei.map(function (p) { return '<li>' + h(p) + '</li>'; }).join('');
        o.setAttribute('reaction', 'idle'); est.textContent = 'não encontrou base';
      }
      abas.forEach(function (b, k) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(k, false); }); });
      if (api.parado) { por(0, false); return; }
      R.laco(async function () {
        if (performance.now() - mexeu > 9000) await por(i, true);
        await api.esperar(4200);
        if (performance.now() - mexeu > 9000) i = (i + 1) % d.tipos.length;
      });
    }
  };

  /* ---------------- divergencia: as posições aparecem e convergem para "mostro e não escolho" ---------------- */
  T.divergencia = {
    html: function (d) {
      var cards = d.posicoes.map(function (p, i) {
        return '<article class="pos aparece" data-i="' + i + '"><b>' + h(p.titulo) + '</b><span class="rotulo">' + h(p.data) + '</span><p>' + h(p.texto) + '</p>' +
          '<div class="selos">' + p.selos.map(function (s) { return R.selo(s[0], s[1]); }).join('') + '</div></article>';
      }).join('');
      var fios = [126, 380, 634].map(function (x, i) { return '<path class="fio-d" data-i="' + i + '" d="M' + x + ' 0 C ' + x + ' 40, 380 30, 380 70"/>'; }).join('');
      return '<div class="dividido dividido--estreito">' + R.cab(d) + R.encaixe(760, 560, '<div class="diverg" data-e="zoom" style="--d:250ms">' +
        '<p class="div-perg"><span class="rotulo">Pergunta</span>' + h(d.pergunta) + '</p>' +
        '<div class="posicoes">' + cards + '</div>' +
        '<svg class="fios-d" viewBox="0 0 760 72" aria-hidden="true">' + fios + '</svg>' +
        '<section class="div-fecho aparece">' + R.orb('consultor', { tamanho: 30 }) + '<div><span class="autor">Consultor</span><p class="t-fecho"></p>' + R.selo('neutro', 'abstenção: divergência sem tese vinculante') + '</div></section>' +
        '</div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var pos = qa(el, '.pos'), fios = qa(el, '.fio-d'), fecho = q(el, '.div-fecho'), t = q(el, '.t-fecho'), o = q(el, '.div-fecho orb-avatar');
      fios.forEach(function (f) { var L = f.getTotalLength(); f.style.strokeDasharray = L; f.style.strokeDashoffset = L; });
      function final() { pos.forEach(function (p) { p.classList.add('on'); }); fios.forEach(function (f) { f.style.strokeDashoffset = 0; }); fecho.classList.add('on'); t.textContent = d.fecho; }
      if (api.parado) { final(); return; }
      R.laco(async function () {
        pos.forEach(function (p) { p.classList.remove('on'); }); fios.forEach(function (f) { f.classList.remove('on'); f.style.strokeDashoffset = f.getTotalLength(); }); fecho.classList.remove('on'); t.textContent = '';
        await api.esperar(800);
        for (var i = 0; i < pos.length; i++) { pos[i].classList.add('on'); await api.esperar(1500); }
        fios.forEach(function (f) { f.classList.add('on'); f.style.strokeDashoffset = 0; });
        await api.esperar(1000);
        fecho.classList.add('on'); o.setAttribute('reaction', 'working');
        await api.digitar(t, d.fecho, 50);
        o.setAttribute('reaction', 'idle');
        await api.esperar(7000);
      });
    }
  };

  /* ---------------- responsabilidade: o que a OAB recomenda e como o desenho responde ---------------- */
  T.responsabilidade = {
    html: function (d) {
      var ret = R.retrato(), W = ret ? 480 : 1152, H = ret ? 900 : 380;
      var linhas = d.linhas.map(function (l, i) {
        return '<li class="resp-l" data-i="' + i + '"><div class="oab"><span class="item tnum">' + h(l[0]) + '</span><span>' + h(l[1]) + '</span></div>' +
          '<svg class="liga-r" viewBox="0 0 80 20" aria-hidden="true"><path class="liga-base" d="M2 10 H78"/><path class="liga-cheia" d="M2 10 H78"/></svg>' +
          '<div class="heild-r">' + h(l[2]) + '</div></li>';
      }).join('');
      return '<div class="empilhado">' + R.cab(d, '', true) + R.encaixe(W, H, '<div class="respons">' +
        '<div class="resp-cab"><span>Recomendação 001/2024 do CFOAB</span><span></span><span>Como a Heild responde</span></div>' +
        '<ol class="resp-ls">' + linhas + '</ol><p class="resp-rod">' + h(d.rodape) + '</p></div>') + '</div>';
    },
    entrar: function (el, d, api) {
      var ls = qa(el, '.resp-l'), cheias = qa(el, '.liga-cheia');
      cheias.forEach(function (c) { c.style.strokeDasharray = 76; c.style.strokeDashoffset = 76; });
      if (api.parado) { ls.forEach(function (l) { l.classList.add('on'); }); cheias.forEach(function (c) { c.style.strokeDashoffset = 0; }); return; }
      R.laco(async function () {
        ls.forEach(function (l) { l.classList.remove('on'); }); cheias.forEach(function (c) { c.style.transition = 'none'; c.style.strokeDashoffset = 76; });
        await api.esperar(900);
        for (var i = 0; i < ls.length; i++) { cheias[i].style.transition = ''; cheias[i].style.strokeDashoffset = 0; await api.esperar(500); ls[i].classList.add('on'); await api.esperar(1300); }
        await api.esperar(7000);
      });
    }
  };
})();
