/* Identidade da Heild — cenas da cor. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, u = M.u;
  var h = u.h, q = u.q, qa = u.qa, orb = u.orb, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe;

  /* ---------------- 13. A areia: a escala de ponta a ponta ---------------- */
  // Passos e usos do tokens.json (design system).
  var PASSOS = [[50, 'Fundo e elevada no claro'], [100, 'Superfície no claro; texto e primária no escuro'], [150, 'Topo da lateral no claro'], [200, 'Rebaixada no claro'], [300, 'Borda e fim dos gradientes no claro'],
    [400, 'Fim da lateral no claro; texto suave no escuro'], [500, 'Ilustração, gráficos e a hachura de estimado'], [600, 'Passo intermediário'], [650, 'Texto suave no claro'], [700, 'Passo intermediário'],
    [800, 'Elevada e borda no escuro'], [850, 'Texto no claro; superfície no escuro'], [900, 'Primária no claro; fundo no escuro'], [925, 'Rebaixada no escuro'], [950, 'Fim dos gradientes no escuro']];
  S.push({
    id: 'areia', capitulo: 'Cor', curto: 'A areia', grade: 'nenhuma', semRodape: true,
    notas: 'Todo neutro sai de uma escala só: a areia, de 50 a 950, em OKLCH, num matiz só (63). A interface é feita de camadas dela. Um cinza frio não pertence à Heild. Passe o cursor num passo para ver o token, o valor e onde ele entra.',
    html: function () {
      return '<div class="cab cab-linha cab-areia">' + titulo('Todo neutro sai de uma escala só.') + frase('A areia vai do 50 ao 950, quente, num matiz só. Um cinza frio não pertence à Heild.', 360) + '</div>' +
        '<div class="faixas-areia" role="group" aria-label="A escala de areia">' + PASSOS.map(function (p, i) {
          return '<button type="button" class="faixa' + (p[0] >= 500 ? ' escura' : '') + '" style="--c:var(--areia-' + p[0] + ');--i:' + i + '" data-p="' + p[0] + '" aria-label="areia-' + p[0] + ': ' + h(p[1]) + '">' +
            '<span class="info"><b>areia-' + p[0] + '</b><span class="hex tnum"></span><span class="uso">' + h(p[1]) + '</span></span><span class="num tnum">' + p[0] + '</span></button>';
        }).join('') + '</div>';
    },
    entrar: function (el, api) {
      var fs = qa(el, '.faixa'), mexeu = -1e9;
      fs.forEach(function (f) { q(f, '.hex').textContent = u.hex(u.corDe(f, '--areia-' + f.dataset.p)); });
      function abrir(f) { fs.forEach(function (x) { x.classList.toggle('aberta', x === f); }); }
      fs.forEach(function (f) {
        api.ouvir(f, 'pointerenter', function () { mexeu = performance.now(); abrir(f); });
        api.ouvir(f, 'focus', function () { mexeu = performance.now(); abrir(f); });
      });
      api.ouvir(q(el, '.faixas-areia'), 'pointerleave', function () { mexeu = performance.now() - 4000; });
      var ordem = [11, 4, 12, 1, 6, 14, 3, 10, 0, 8], k = 0;
      api.depois(api.parado ? 0 : 1500, function () { abrir(fs[8]); });
      if (api.parado) return;
      api.intervalo(function () { if (performance.now() - mexeu < 6000) return; abrir(fs[ordem[k++ % ordem.length]]); }, 2200);
    }
  });

  /* ---------------- 14. As camadas nos dois modos ---------------- */
  function pilhaCamadas(modo) {
    var claro = modo === 'claro';
    var rot = claro ? [['elevada · rebaixada', 'areia 50 · 200 → 300'], ['superfície', 'areia 100'], ['fundo · lateral', 'areia 50 → 300 · 150 → 400']]
      : [['elevada · rebaixada', 'areia 800 · 925 → 950'], ['superfície', 'areia 850'], ['fundo · lateral', 'areia 900 → 950 · 850 → 925']];
    return '<div class="lado-camadas forca-' + modo + '"><p class="modo-nome">' + (claro ? 'Claro' : 'Escuro') + '</p>' +
      '<div class="iso">' +
      '<div class="iso-plano p0" style="--z:0"><div class="pl-fundo"><div class="pl-lateral"></div></div></div>' +
      '<div class="iso-plano p1" style="--z:1"><div class="pl-superficie"></div></div>' +
      '<div class="iso-plano p2" style="--z:2"><div class="pl-trilho"><i></i></div><div class="pl-campo"><i></i></div></div>' +
      '</div>' +
      '<ul class="rotulos-camadas">' + rot.map(function (r, i) { return '<li style="--z:' + (2 - i) + '"><b>' + r[0] + '</b><span class="tnum">' + r[1] + '</span></li>'; }).join('') + '</ul></div>';
  }
  S.push({
    id: 'camadascor', capitulo: 'Cor', curto: 'As camadas nos dois modos', grade: 'nenhuma',
    notas: 'A tela se monta em camadas de areia, cada uma com um passo no claro e outro no escuro: fundo embaixo, superfície por cima, elevada no topo; rebaixada afunda dentro de uma superfície. No escuro, a camada que sobe fica mais clara. Os planos se separam e descem até virar uma tela só.',
    html: function () {
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Camadas de areia, nos dois modos.') + frase('Fundo embaixo, superfície por cima, elevada no topo. No escuro, o que sobe fica mais claro, nunca mais escuro.', 340) + '</div>' +
        '<div class="dois-modos" data-e="zoom" style="--d:200ms">' + pilhaCamadas('claro') + pilhaCamadas('escuro') + '</div></div>';
    },
    entrar: function (el, api) {
      var c = q(el, '.dois-modos');
      if (api.parado) return;
      api.depois(300, function () { c.classList.add('separado'); });
      api.intervalo(function () { c.classList.toggle('separado'); }, 3600);
    }
  });

  /* ---------------- 15. O destaque índigo ---------------- */
  S.push({
    id: 'destaque', capitulo: 'Cor', curto: 'O destaque', grade: 'cheia',
    notas: 'O índigo é a única cor de marca fora da areia, sempre em pontos pequenos: a barra de limite de IA, o ponto de novidade, o marcador de seleção, o progresso de uma etapa. Como texto, a versão de texto, que passa 4,5:1 nos dois modos. Nunca em área grande, em gradiente ou junto de uma cor de orb.',
    html: function () {
      return '<div class="campo-destaque">' +
        '<div class="vinheta v-limite" data-k="0"><p class="rotulo">Limite de IA da janela de 5 horas</p><div class="barra-ia"><i></i></div><p class="rotulo tnum">62% usado</p></div>' +
        '<div class="vinheta v-novo" data-k="1"><span class="corpo">Avisos</span><span class="ponto-novo" aria-label="novo"></span></div>' +
        '<div class="vinheta v-sel" data-k="2"><p class="item-sel sel"><i></i>Metalúrgica Andrade</p><p class="item-sel"><i></i>Padaria Pão Quente</p><p class="item-sel"><i></i>Clínica Sorriso</p></div>' +
        '<div class="vinheta v-etapa" data-k="3"><p class="rotulo">Etapa 2 de 4</p><div class="etapas"><i class="feita"></i><i class="atual"></i><i></i><i></i></div></div>' +
        '<div class="vinheta v-link" data-k="4"><p class="corpo">Deixei as guias na fila. <a class="link-destaque" href="#" tabindex="-1">Ver o cartão</a></p></div>' +
        '<i class="ponto-viajante" aria-hidden="true"></i></div>' +
        '<div class="cab cab-destaque">' + titulo('Um destaque, em pontos pequenos.') +
        frase('O índigo é a única cor de marca fora da areia. Nunca em área grande, em gradiente ou junto de uma cor de orb.', 340) + '</div>';
    },
    entrar: function (el, api) {
      var vs = qa(el, '.vinheta'), dot = q(el, '.ponto-viajante'), campo = q(el, '.campo-destaque'), k = -1;
      var alvos = ['.barra-ia i', '.ponto-novo', '.item-sel.sel i', '.etapas .atual', '.link-destaque'];
      function centro(sel) {
        var a = q(el, sel), r = a.getBoundingClientRect(), rc = campo.getBoundingClientRect(), s = rc.width / campo.offsetWidth || 1;
        var w = r.width / s, hh = r.height / s;
        return [(r.left - rc.left) / s + (sel === '.barra-ia i' ? w : w / 2), (r.top - rc.top) / s + hh / 2];
      }
      function acender(i) {
        k = i; vs.forEach(function (v, j) { v.classList.toggle('acesa', j === i); });
        var p = centro(alvos[i]); dot.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px)';
      }
      if (api.parado) { vs.forEach(function (v) { v.classList.add('acesa'); }); dot.hidden = true; return; }
      api.depois(700, function () { acender(0); });
      api.intervalo(function () { acender((k + 1) % vs.length); }, 2000);
      api.aoEscala(function () { if (k >= 0) acender(k); });
    }
  });

  /* ---------------- 16. Estados com palavra ---------------- */
  var LINHAS = [
    ['Conciliação de outubro', 'Metalúrgica Andrade', [['sucesso', 'Conciliado', 'check'], ['atencao', 'Pede decisão', 'alerta'], ['sucesso', 'Aprovado', 'check']]],
    ['Extrato do Itaú', 'Metalúrgica Andrade', [['atencao', 'Aguard. cliente', 'relogio'], ['sucesso', 'Recebido', 'check'], ['atencao', 'Vence logo', 'relogio']]],
    ['Envio ao eSocial', 'Padaria Pão Quente', [['erro', 'Falhou', 'alerta'], ['atencao', 'Vence logo', 'relogio'], ['sucesso', 'Concluído', 'check']]]
  ];
  S.push({
    id: 'estados', capitulo: 'Cor', curto: 'Estados com palavra', grade: 'direita',
    notas: 'Erro, sucesso e atenção vão sempre com a palavra ou o ícone, nunca só com a cor. O selo tem o fundo do estado a 15%, o texto em texto e o ícone na cor do estado. O botão simula como vê quem não distingue vermelho e verde: os pontos sozinhos se confundem; os selos continuam claros.',
    html: function () {
      var linha = function (l, i, soCor) {
        var e = l[2][0];
        return '<div class="linha-estado" data-i="' + i + '"><div class="lt"><b>' + h(l[0]) + '</b><span>' + h(l[1]) + '</span></div>' +
          (soCor ? '<span class="so-ponto" data-tipo="' + e[0] + '" aria-hidden="true"></span>' : '<span class="caixa-selo"><span class="selo selo--' + e[0] + '">' + u.icone(e[2]) + '<span class="txt">' + h(e[1]) + '</span></span></span>') + '</div>';
      };
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Estado com palavra, sempre.') +
        frase('Erro, sucesso e atenção vão sempre com a palavra ou o ícone. Só a cor não basta.', 360) +
        '<button type="button" class="chip simular" aria-pressed="false" data-e style="--d:600ms">Ver como quem não distingue vermelho e verde</button></div>' +
        '<div class="visual"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="deuteranopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter></svg>' +
        '<div class="comparacao" data-e="zoom" style="--d:250ms"><div class="col-estado errado"><p class="rotulo-col">' + u.icone('x') + 'Só a cor</p>' + LINHAS.map(function (l, i) { return linha(l, i, true); }).join('') + '</div>' +
        '<div class="col-estado certo"><p class="rotulo-col">' + u.icone('check') + 'Com palavra e ícone</p>' + LINHAS.map(function (l, i) { return linha(l, i, false); }).join('') + '</div></div></div></div>';
    },
    entrar: function (el, api) {
      var b = q(el, '.simular'), comp = q(el, '.comparacao'), mexeu = -1e9, fase = 0;
      function simular(on) { b.setAttribute('aria-pressed', String(on)); comp.classList.toggle('simulado', on); }
      api.ouvir(b, 'click', function () { mexeu = performance.now(); simular(b.getAttribute('aria-pressed') !== 'true'); });
      if (api.parado) return;
      // Os estados mudam com o tempo; o selo troca a palavra numa caixa de largura fixa (nada se move).
      api.intervalo(function () {
        fase++;
        LINHAS.forEach(function (l, i) {
          var e = l[2][fase % l[2].length], ponto = q(el, '.errado [data-i="' + i + '"] .so-ponto'), selo = q(el, '.certo [data-i="' + i + '"] .selo');
          ponto.dataset.tipo = e[0];
          selo.className = 'selo selo--' + e[0]; selo.innerHTML = u.icone(e[2]) + '<span class="txt">' + h(e[1]) + '</span>';
        });
        if (performance.now() - mexeu > 9000 && fase % 2 === 0) simular(!comp.classList.contains('simulado'));
      }, 2600);
    }
  });

  /* ---------------- 17. Contraste conferido ---------------- */
  var TEXTOS = [['--texto', 'texto'], ['--texto-suave', 'texto-suave'], ['--destaque-texto', 'destaque-texto'], ['--sucesso-texto', 'sucesso-texto'], ['--atencao-texto', 'atencao-texto'], ['--erro-texto', 'erro-texto']];
  var CAMADAS = [['--fundo', 'fundo'], ['--superficie', 'superfície'], ['--elevada', 'elevada'], ['--rebaixada', 'rebaixada']];
  S.push({
    id: 'contraste', capitulo: 'Cor', curto: 'O contraste conferido', grade: 'nenhuma',
    notas: 'O contraste de cada cor de texto sobre cada camada, calculado aqui mesmo, com a fórmula do WCAG, a partir dos tokens. A meta é 4,5:1 para texto. Troque entre claro e escuro: os dois modos passam.',
    html: function () {
      var cab = '<div class="mc-cab"><span></span>' + CAMADAS.map(function (c) { return '<span>' + c[1] + '</span>'; }).join('') + '</div>';
      var linhas = TEXTOS.map(function (t, i) {
        return '<div class="mc-linha" style="--i:' + i + '"><span class="mc-nome">' + t[1] + '</span>' + CAMADAS.map(function (c) {
          return '<span class="mc-cel" style="background:var(' + c[0] + ')" data-t="' + t[0] + '" data-c="' + c[0] + '"><span class="aa" style="color:var(' + t[0] + ')">Aa</span><span class="razao tnum">—</span><span class="ok"></span></span>';
        }).join('') + '</div>';
      }).join('');
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Contraste conferido.') +
        frase('Cada cor de texto sobre cada camada, calculada aqui com a fórmula do WCAG, a partir dos tokens. A meta é 4,5:1.', 360) +
        '<div class="abas-modo" role="tablist" aria-label="Modo" data-e style="--d:600ms"><button type="button" role="tab" data-m="claro" aria-selected="false">Claro</button><button type="button" role="tab" data-m="escuro" aria-selected="false">Escuro</button></div></div>' +
        '<div class="visual"><div class="matriz" data-e="zoom" style="--d:250ms">' + cab + linhas + '</div></div></div>';
    },
    entrar: function (el, api) {
      var mat = q(el, '.matriz'), abas = qa(el, '.abas-modo button'), modo = api.escuro() ? 'escuro' : 'claro', mexeu = -1e9;
      function calcular(animar) {
        mat.classList.toggle('forca-claro', modo === 'claro'); mat.classList.toggle('forca-escuro', modo === 'escuro');
        abas.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.m === modo)); });
        qa(mat, '.mc-cel').forEach(function (c, i) {
          var r = u.contraste(u.corDe(c, c.dataset.t), u.corDe(c, c.dataset.c)), passa = r >= 4.5;
          var ok = q(c, '.ok'), rz = q(c, '.razao');
          ok.innerHTML = u.icone(passa ? 'check' : 'x') + '<span>' + (passa ? 'passa' : 'não passa') + '</span>'; c.classList.toggle('reprova', !passa);
          if (!animar || api.parado) { rz.textContent = u.num(r, 1) + ':1'; return; }
          var t0 = performance.now() + i * 25;
          api.quadro(function (agora) { var f = Math.max(0, Math.min(1, (agora - t0) / 700)); rz.textContent = u.num(1 + (r - 1) * u.sai(f), 1) + ':1'; return f < 1; });
        });
      }
      abas.forEach(function (b) { api.ouvir(b, 'click', function () { mexeu = performance.now(); modo = b.dataset.m; calcular(true); }); });
      api.aoTema(function () { if (performance.now() - mexeu > 2000) { modo = api.escuro() ? 'escuro' : 'claro'; calcular(false); } });
      api.depois(api.parado ? 0 : 500, function () { calcular(true); });
      if (api.parado) return;
      api.intervalo(function () { if (performance.now() - mexeu < 10000) return; modo = modo === 'claro' ? 'escuro' : 'claro'; calcular(true); }, 6000);
    }
  });

  /* ---------------- 18. Claro e escuro: o comparador de tela cheia ---------------- */
  function telaInicio() {
    return '<div class="tela-inicio"><div class="ti-lat"><span class="ti-sig">' + u.he(15) + '</span><i class="at"></i><i></i><i></i><i></i><i></i><span class="ti-pe"></span></div>' +
      '<div class="ti-cont"><div class="ti-abas"><span class="at">Assistente</span><span>Time</span><span>Visão geral</span></div>' +
      '<div class="ti-pergunta">No que posso ajudar?' + orb('assistente', { tamanho: 46, modo: 'follow' }) + '</div>' +
      '<div class="ti-sug"><span>Feche outubro da Metalúrgica Andrade</span><span>Quem está aguardando documento?</span></div>' +
      '<div class="ti-campo"><span>Peça ao Assistente…</span><div class="ti-acoes"><span class="mais"></span><span class="enviar"></span></div></div>' +
      '<div class="ti-limite"><span>Limite de IA</span><div class="barra-ia"><i></i></div></div></div></div>';
  }
  function ladoCE(modo, aria) {
    return '<div class="lado-ce forca-' + modo + '"' + (aria ? '' : ' aria-hidden="true"') + '><div class="ce-grade"></div><div class="ce-conteudo"><div class="cab">' +
      '<h2 class="titulo t-ce">Claro e escuro valem o mesmo.</h2>' +
      '<p class="frase">Cada camada tem o seu passo de areia em cada modo. O produto oferece os dois; o site e as apresentações seguem a preferência de quem vê.</p>' +
      '<p class="rotulo">Arraste a divisória.</p></div><div class="ce-tela">' + telaInicio() + '</div></div></div>';
  }
  S.push({
    id: 'claroescuro', capitulo: 'Cor', curto: 'Claro e escuro', grade: 'nenhuma', semRodape: true,
    notas: 'Claro e escuro valem o mesmo: cada camada tem o seu passo de areia em cada modo, desenhados com o mesmo cuidado. Arraste a divisória para comparar a mesma tela, o mesmo título e o mesmo orb nos dois modos.',
    html: function () {
      return '<div class="comparador-cheio" data-arrasta data-e="fade">' + ladoCE('claro', true) + ladoCE('escuro', false) +
        '<span class="marca-modo m-claro forca-claro">Claro</span><span class="marca-modo m-escuro forca-escuro">Escuro</span>' +
        '<button type="button" class="alca-ce" role="slider" aria-label="Divisória entre claro e escuro" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60"><span aria-hidden="true"></span></button></div>';
    },
    entrar: function (el, api) {
      var c = q(el, '.comparador-cheio'), alca = q(el, '.alca-ce'), v = 92, mexeu = false;
      function por(x) { v = Math.max(3, Math.min(97, x)); c.style.setProperty('--corte', v + '%'); alca.setAttribute('aria-valuenow', Math.round(v)); }
      por(api.parado ? 52 : 94);
      var t0 = performance.now();
      if (!api.parado) api.quadro(function (agora) {
        if (mexeu) return false;
        var ms = agora - t0 - 900; if (ms < 0) return true;
        if (ms < 1600) { por(94 - 42 * u.sai(ms / 1600)); return true; }
        por(52 - 30 * Math.sin((ms - 1600) / 1000 * Math.PI * 2 / 9));
        return true;
      });
      var arrastando = false;
      function mover(e) { var r = c.getBoundingClientRect(); por((e.clientX - r.left) / r.width * 100); }
      api.ouvir(c, 'pointerdown', function (e) { if (e.target.closest('orb-avatar')) return; mexeu = arrastando = true; c.setPointerCapture(e.pointerId); mover(e); });
      api.ouvir(c, 'pointermove', function (e) { if (arrastando) mover(e); });
      api.ouvir(c, 'pointerup', function () { arrastando = false; });
      api.ouvir(alca, 'keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); mexeu = true; por(v + (e.key === 'ArrowLeft' ? -4 : 4)); } });
    }
  });
})();
