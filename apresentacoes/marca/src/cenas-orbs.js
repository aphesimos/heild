/* Identidade da Heild — cenas dos orbs. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, I = M.I, u = M.u, ORDEM = M.ORDEM, GRUPOS = M.GRUPOS, REACAO = M.REACAO, ESTADOS = M.ESTADOS;
  var h = u.h, q = u.q, qa = u.qa, orb = u.orb, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe;
  var PALAVRA = { disponivel: 'disponível', pensando: 'pensando', trabalhando: 'trabalhando', precisa_de_voce: 'precisa de você', concluido: 'concluído', dormindo: 'em pausa', erro: 'com erro' };
  function token(id) { return I[id].cor.replace(/^--/, ''); }

  /* ---------------- 19. Os treze integrantes ---------------- */
  S.push({
    id: 'time', capitulo: 'Os orbs', curto: 'Os treze integrantes', grade: 'nenhuma',
    notas: 'Cada integrante é um membro de IA do time, com o seu orb de cor. O Assistente é o único sem cor própria: usa o contraste do tema, escuro no claro e claro no escuro. Os orbs seguem o cursor; clique para cutucar. De tempos em tempos, uma onda passa pelo time.',
    html: function () {
      var cols = ORDEM.map(function (id, i) {
        return '<button type="button" class="membro" data-id="' + id + '" style="--i:' + i + '">' + orb(id, { tamanho: 64, modo: 'follow' }) +
          '<span class="m-nome">' + h(I[id].nome) + '</span><span class="m-hex tnum"></span></button>';
      }).join('');
      var grupos = GRUPOS.map(function (g) { return '<span class="g" style="--n:' + g.ids.length + '"><i></i>' + h(g.nome) + '</span>'; }).join('');
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Treze integrantes, uma cor cada.') + frase('A cor do orb é do integrante. O Assistente usa o contraste do tema; os outros, a sua cor nos dois modos.', 320) + '</div>' +
        '<div class="fila-time"><div class="membros">' + cols + '</div><div class="grupos-time" data-e style="--d:900ms">' + grupos + '</div></div>' +
        '<div class="ficha-time" aria-live="polite" data-e style="--d:1100ms"><b class="f-nome">Passe o cursor num orb</b><span class="f-faz">Clique para cutucar.</span></div></div>';
    },
    entrar: function (el, api) {
      var ms = qa(el, '.membro'), fn = q(el, '.f-nome'), ff = q(el, '.f-faz'), mexeu = -1e9;
      function hexes() { ms.forEach(function (m) { q(m, '.m-hex').textContent = u.hex(u.corDe(m, I[m.dataset.id].cor)); }); }
      hexes(); api.aoTema(hexes);
      function mostrar(m) {
        var it = I[m.dataset.id];
        fn.innerHTML = h(it.nome) + ' <span class="suave">· ' + h(it.area) + ' · <span class="codigo">' + token(m.dataset.id) + '</span></span>';
        ff.textContent = it.faz;
      }
      ms.forEach(function (m) {
        var o = q(m, 'orb-avatar');
        api.ouvir(m, 'pointerenter', function () { mexeu = performance.now(); mostrar(m); });
        api.ouvir(m, 'focus', function () { mostrar(m); });
        api.ouvir(m, 'click', function () { mexeu = performance.now(); mostrar(m); if (o.poke) o.poke(); });
      });
      if (api.parado) return;
      // A onda: cada orb dá um pulinho, da esquerda para a direita; e a ficha passa pelo time sozinha.
      var k = 0;
      api.intervalo(function () {
        ms.forEach(function (m, i) { api.depois(i * 80, function () { var o = q(m, 'orb-avatar'); if (o.poke) o.poke(0.55, { react: false }); }); });
      }, 7000);
      api.intervalo(function () { if (performance.now() - mexeu < 6000) return; mostrar(ms[k++ % ms.length]); }, 2400);
    }
  });

  /* ---------------- 20. Os sete estados ---------------- */
  S.push({
    id: 'estadosorb', capitulo: 'Os orbs', curto: 'Os sete estados', grade: 'direita',
    notas: 'O orb reage ao estado do integrante: disponível, pensando, trabalhando, precisa de você, concluído, em pausa e com erro. O estado vem sempre com a palavra também, no cabeçalho do chat e na lista do time, nunca só com a reação. Os pontos coloridos trocam o integrante: são os marcadores dele, a única outra coisa que leva a sua cor.',
    html: function () {
      var lista = ESTADOS.map(function (e, i) { return '<button type="button" class="estado-linha" data-k="' + i + '" aria-pressed="' + (i === 0) + '"><b>' + e[1] + '</b><span>' + e[2] + '</span></button>'; }).join('');
      var marcadores = ORDEM.map(function (id) { return '<button type="button" class="marcador" data-id="' + id + '" style="--c:var(' + I[id].cor + ')" aria-label="' + h(I[id].nome) + '" aria-pressed="' + (id === 'consultor') + '"></button>'; }).join('');
      return '<div class="dividido dividido--meio"><div class="cab">' + titulo('Sete estados, sempre com a palavra.') +
        '<div class="estados-lista" role="group" aria-label="Estados" data-e style="--d:420ms">' + lista + '</div></div>' +
        '<div class="visual"><div class="palco-estado"><div class="orb-grande">' + orb('consultor', { tamanho: 230, modo: 'follow' }) + '</div>' +
        '<p class="leitura-estado"><b class="quem">Consultor</b><span class="suave">·</span><span class="palavra">disponível</span></p><p class="desc-estado suave"></p>' +
        '<div class="marcadores" role="group" aria-label="Integrante">' + marcadores + '</div></div></div></div>';
    },
    entrar: function (el, api) {
      var o = q(el, '.orb-grande orb-avatar'), bs = qa(el, '.estado-linha'), mk = qa(el, '.marcador'), quem = q(el, '.quem'), pal = q(el, '.palavra'), desc = q(el, '.desc-estado'), k = 0, mexeu = -1e9;
      function por(i) {
        k = i; var e = ESTADOS[i];
        o.setAttribute('reaction', REACAO[e[0]]); pal.textContent = PALAVRA[e[0]]; desc.textContent = e[3];
        bs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
      }
      function integrante(id) {
        o.dataset.cor = I[id].cor; if (I[id].olho) o.dataset.olho = I[id].olho; else { delete o.dataset.olho; o.removeAttribute('eye-color'); }
        o.setAttribute('label', I[id].nome); quem.textContent = I[id].nome; api.colorir(el);
        mk.forEach(function (m) { m.setAttribute('aria-pressed', String(m.dataset.id === id)); });
      }
      bs.forEach(function (b, i) { api.ouvir(b, 'click', function () { mexeu = performance.now(); por(i); }); });
      mk.forEach(function (m) { api.ouvir(m, 'click', function () { mexeu = performance.now(); integrante(m.dataset.id); }); });
      api.ouvir(o, 'click', function () { if (o.poke) o.poke(); });
      por(0);
      if (api.parado) return;
      var rodada = 0, giro = ['consultor', 'fiscal', 'bpo_conciliacao', 'assistente', 'societario', 'contabil'];
      api.intervalo(function () {
        if (performance.now() - mexeu < 9000) return;
        var prox = (k + 1) % ESTADOS.length;
        if (prox === 0) integrante(giro[++rodada % giro.length]);
        por(prox);
      }, 2800);
    }
  });

  /* ---------------- 21. Reações e emotes: ele tem vida própria ---------------- */
  var EMOTES = [['yawn', 'Bocejo'], ['shifty', 'Desconfiado'], ['sneeze', 'Espirro'], ['hiccup', 'Soluço'], ['whistle', 'Assobio'], ['cheeky', 'Piscadelas'], ['vibe', 'No ritmo'],
    ['peekaboo', 'Esconde-esconde'], ['boop', 'Toc na tela'], ['derp', 'Vesgo'], ['idea', 'Ideia'], ['fly', 'Mosca'], ['bubble', 'Chiclete']];
  var CUTUCA = { surprised: 'susto', giggle: 'risada', dizzy: 'tonto' };
  S.push({
    id: 'emotes', capitulo: 'Os orbs', curto: 'Reações e emotes', grade: 'centro',
    notas: 'No "No que posso ajudar?", o orb do Assistente fica vivo: parado, faz uma gracinha de vez em quando e cochila se ninguém interage. Ele segue o cursor e reage ao clique: uma cutucada assusta, duas fazem rir, três deixam tonto. Os botões tocam cada gracinha do componente.',
    html: function () {
      return '<div class="dividido dividido--estreito"><div class="cab">' + titulo('Vivo, mas só quando cabe.') +
        frase('No "No que posso ajudar?", o Assistente faz uma gracinha de vez em quando e cochila se ninguém interage. Cutuque.', 360) +
        '<ol class="cutucadas" data-e style="--d:560ms"><li data-r="surprised"><b>1</b>susto</li><li data-r="giggle"><b>2</b>risada</li><li data-r="dizzy"><b>3</b>tonto</li></ol></div>' +
        '<div class="visual"><div class="palco-emotes"><div class="orb-vivo">' + orb('assistente', { tamanho: 210, modo: 'follow', vivo: true, attrs: ' idle-time="5" sleep-after="0"' }) + '</div>' +
        '<p class="agora-emote" aria-live="polite"><span class="suave">Agora:</span> <b class="nome-emote">olhando você</b></p>' +
        '<div class="chips lista-emotes" role="group" aria-label="Gracinhas">' + EMOTES.map(function (e) { return '<button type="button" class="chip" data-e2="' + e[0] + '" aria-pressed="false">' + e[1] + '</button>'; }).join('') + '</div></div></div></div>';
    },
    entrar: function (el, api) {
      var o = q(el, '.orb-vivo orb-avatar'), bs = qa(el, '.lista-emotes .chip'), nome = q(el, '.nome-emote'), cs = qa(el, '.cutucadas li'), tFim = 0;
      var NOMES = {}; EMOTES.forEach(function (e) { NOMES[e[0]] = e[1]; });
      function marcar(n) {
        bs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.e2 === n)); });
        nome.textContent = NOMES[n] ? NOMES[n].toLowerCase() : n === 'doze' ? 'cochilando' : n === 'wake' ? 'acordou' : 'olhando você';
        clearTimeout(tFim); tFim = setTimeout(function () { if (!api.vivo()) return; bs.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); nome.textContent = 'olhando você'; }, 3600);
      }
      api.ouvir(o, 'emote', function (e) { marcar(e.detail && e.detail.name); });
      api.ouvir(o, 'poke', function (e) {
        var r = e.detail && e.detail.reaction;
        cs.forEach(function (c) { c.classList.toggle('agora', c.dataset.r === r); });
        nome.textContent = CUTUCA[r] || 'cutucado';
        clearTimeout(tFim); tFim = setTimeout(function () { if (!api.vivo()) return; cs.forEach(function (c) { c.classList.remove('agora'); }); nome.textContent = 'olhando você'; }, 2600);
      });
      api.ouvir(o, 'click', function () { if (o.poke) o.poke(); });
      bs.forEach(function (b) { api.ouvir(b, 'click', function () { if (o.emote) o.emote(b.dataset.e2); }); });
      api.aoSair(function () { clearTimeout(tFim); });
      if (api.parado) return;
      // Para a gracinha aparecer logo na primeira visita.
      api.depois(1600, function () { if (o.emote) o.emote('idea'); });
    }
  });

  /* ---------------- 22. Onde o orb aparece ---------------- */
  S.push({
    id: 'onde', capitulo: 'Os orbs', curto: 'Onde o orb aparece', grade: 'nenhuma',
    notas: 'O orb aparece no chat do integrante (no cabeçalho e ao lado de cada mensagem), na lista do time e no "No que posso ajudar?" do Assistente. A cor dele aparece no orb e nos marcadores pequenos do mesmo integrante, como o ponto antes do setor no calendário. Nada além disso: o orb nunca vira cor de botão, fundo ou gráfico, e nunca carrega texto por cima.',
    html: function () {
      var cabChat = '<div class="b-cartao b-chat" data-e style="--d:300ms"><div class="cab-chat">' + orb('fiscal', { tamanho: 34, reacao: 'needs' }) + '<div><b class="titulo-bloco">Fiscal</b><span class="rotulo">precisa de você</span></div></div>' +
        '<div class="msg-chat">' + orb('contabil', { tamanho: 26, reacao: 'working', classe: 'orb-msg' }) + '<div><span class="autor">Contábil</span><p class="t-msg"></p></div></div>' +
        '<p class="nota-b">No chat: no cabeçalho e ao lado de cada mensagem</p></div>';
      var listaTime = '<div class="b-cartao b-lista" data-e style="--d:400ms">' + [['assistente', 'trabalhando'], ['consultor', 'pensando'], ['dp', 'concluido'], ['bpo_conciliacao', 'precisa_de_voce'], ['notas', 'trabalhando']].map(function (r) {
        return '<div class="linha-time">' + orb(r[0], { tamanho: 26, reacao: REACAO[r[1]], extras: false }) + '<span class="enfase">' + h(I[r[0]].nome) + '</span><span class="rotulo">' + PALAVRA[r[1]] + '</span></div>';
      }).join('') + '<p class="nota-b">Na lista do time, com a palavra do estado</p></div>';
      var agenda = '<div class="b-cartao b-agenda" data-e style="--d:500ms"><div class="dias"><span>seg 17</span><span>ter 18</span><span>qua 19</span></div>' +
        '<div class="ev"><i style="--c:var(--orb-fiscal)"></i><span>Fiscal</span><b>DCTFWeb</b></div><div class="ev"><i style="--c:var(--orb-dp)"></i><span>DP</span><b>Folha de novembro</b></div><div class="ev"><i style="--c:var(--orb-bpo-pagar)"></i><span>Contas a Pagar</span><b>Lote de sexta</b></div>' +
        '<p class="nota-b">No calendário, só o ponto antes do setor</p></div>';
      var ajuda = '<div class="b-cartao b-ajuda" data-e style="--d:600ms"><div class="pergunta-mini">No que posso ajudar?' + orb('assistente', { tamanho: 40, modo: 'follow' }) + '</div><p class="nota-b">No Início, segue o cursor e reage ao clique</p></div>';
      var regras = '<ul class="regras-orb" data-e style="--d:700ms"><li>A cor do integrante, só no orb e nos marcadores dele.</li><li>O orb nunca carrega texto por cima.</li><li>Olho escuro em orb claro; claro em orb escuro.</li><li>No claro, os orbs claros levam a sombra do orb.</li></ul>';
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('A cor fica no orb.') + regras + '</div>' +
        '<div class="bento-orb">' + cabChat + listaTime + agenda + ajuda + '</div></div>';
    },
    entrar: function (el, api) {
      var t = q(el, '.t-msg'), o = q(el, '.orb-msg');
      qa(el, '.b-ajuda orb-avatar').forEach(function (x) { api.ouvir(x, 'click', function () { if (x.poke) x.poke(); }); });
      (async function () {
        if (!api.parado) await api.esperar(900);
        for (;;) {
          t.textContent = ''; o.setAttribute('reaction', 'working');
          await api.digitar(t, 'Conciliei 41 de 44 lançamentos. Os 3 que sobraram estão na tarefa CTB-016.', 55);
          o.setAttribute('reaction', 'done');
          if (api.parado) return;
          await api.esperar(5200);
        }
      })().catch(function () {});
    }
  });
})();
