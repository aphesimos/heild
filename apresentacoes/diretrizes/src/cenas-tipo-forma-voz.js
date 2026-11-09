/* Identidade da Heild — cenas da tipografia, da forma e da voz. */
(function () {
  'use strict';
  var M = window.HEILD_MARCA, S = M.slides, I = M.I, u = M.u;
  var h = u.h, q = u.q, qa = u.qa, orb = u.orb, titulo = u.titulo, frase = u.frase, encaixe = u.encaixe;

  /* ---------------- 23. A família e o peso ---------------- */
  var ALFABETO = 'abcdefghijklmnopqrstuvwxyz0123456789';
  S.push({
    id: 'familia', capitulo: 'Tipografia', curto: 'Uma família, dois cortes', grade: 'nenhuma',
    notas: 'Uma família só, a PP Neue Montreal, em dois cortes: a Neue Montreal para títulos de 24 px para cima e para o nome; a Neue Montreal Text, desenhada para tamanhos pequenos, para toda a interface. Os arquivos são variáveis: um arquivo por estilo cobre todos os pesos. O controle mexe no eixo de peso; a linha de baixo mostra o eixo em onda.',
    html: function () {
      var onda = ALFABETO.split('').map(function (c, i) { return '<span style="--i:' + i + '">' + c + '</span>'; }).join('');
      return '<div class="familia-grade"><div class="cab">' + titulo('Uma família, dois cortes.') +
        frase('A PP Neue Montreal nos títulos e no nome. A Neue Montreal Text, feita para tamanhos pequenos, em toda a interface.', 340) +
        '<label class="controle-peso" data-e style="--d:520ms"><span>Peso</span><input type="range" min="100" max="900" step="1" value="300" aria-label="Peso da fonte"><output class="tnum">300</output></label></div>' +
        '<div class="aa-caixa" data-e="fade" style="--d:200ms"><span class="aa" aria-hidden="true">Aa</span></div>' +
        '<div class="cortes">' +
        '<div class="corte" data-e style="--d:600ms"><p class="rotulo"><span>PP Neue Montreal</span><span>títulos, 100 a 900</span></p><p class="amostra-titulo">Fechamento de outubro</p><p class="amostra-hero">Tudo, num lugar só.</p></div>' +
        '<div class="corte" data-e style="--d:700ms"><p class="rotulo"><span>PP Neue Montreal Text</span><span>interface, 200 a 700</span></p><p class="amostra-texto">Conciliei 41 de 44 lançamentos. Os 3 que sobraram estão na tarefa <span class="codigo">CTB-016</span>.</p><p class="amostra-texto suave">A Text tem mais espaço entre as letras e formas mais abertas: todo texto até 18 px usa ela.</p></div></div>' +
        '<p class="onda" aria-label="O alfabeto, com o peso em onda" data-e style="--d:800ms">' + onda + '</p></div>';
    },
    entrar: function (el, api) {
      var r = q(el, 'input'), o = q(el, 'output'), aa = q(el, '.aa'), ls = qa(el, '.onda span'), mexeu = -1e9, t0 = performance.now();
      function por(v) { v = Math.round(v); aa.style.fontWeight = v; o.textContent = v; r.value = v; }
      api.ouvir(r, 'input', function () { mexeu = performance.now(); por(+r.value); });
      api.ouvir(r, 'keydown', function (e) { e.stopPropagation(); });
      por(300);
      if (api.parado) return;
      api.quadro(function (agora) {
        var t = (agora - t0) / 1000;
        // A onda: o peso viaja pela linha, do leve ao pesado.
        for (var i = 0; i < ls.length; i++) ls[i].style.fontWeight = Math.round(400 + 300 * Math.sin(t * 2.2 - i * 0.32));
        if (agora - mexeu > 5000) por(500 - 400 * Math.cos(t * 0.6));
        return true;
      });
    }
  });

  /* ---------------- 24. A escala ---------------- */
  // Estilos e amostras do tokens.json (design system).
  var ESCALA = [
    ['hero', 'titulo', 72, 76, 500, '-0.04em', 'Tudo, num lugar só.', 'Hero do site e da capa'],
    ['display', 'titulo', 48, 48, 300, '-0.025em', 'No que posso ajudar?', 'Uma frase por tela'],
    ['numero-grande', 'titulo', 36, 40, 300, '0', '41/58', 'O número de um widget'],
    ['titulo-pagina', 'titulo', 30, 36, 300, '-0.025em', 'Hoje', 'Título da tela'],
    ['titulo-secao', 'titulo', 24, 32, 300, '-0.025em', 'Fechamento de outubro', 'Gaveta, seção longa'],
    ['titulo-bloco', 'texto', 18, 28, 600, '0', 'BPO', 'Cabeçalho do chat'],
    ['corpo-grande', 'texto', 16, 24, 400, '0', 'O Contábil terminou a primeira parte.', 'Leitura longa, raro'],
    ['corpo', 'texto', 14, 20, 400, '0', 'Conciliação fechada: 211 de 214 lançamentos casados.', 'O texto da interface'],
    ['rotulo', 'texto', 12, 16, 400, '0', 'contexto: Carteira', 'Metadado, legenda, chip'],
    ['micro', 'texto', 11, 16, 400, '0', '08:32', 'Só a hora da mensagem'],
    ['codigo', 'mono', 12, 16, 400, '0', 'FIN-201', 'Código de tarefa, chave']
  ];
  S.push({
    id: 'escala', capitulo: 'Tipografia', curto: 'A escala', grade: 'nenhuma',
    notas: 'A escala do design system, com as amostras dele. Títulos grandes são leves (300); o hero, na voz da marca para fora, é 500 com -0,04em. A ênfase do texto é 500. Nenhum rótulo em caixa alta, nada abaixo de 11 px (e 11 px só para a hora), e a mono só para dado.',
    html: function () {
      var linhas = ESCALA.map(function (e, i) {
        var fam = e[1] === 'titulo' ? 'var(--font-titulo)' : e[1] === 'mono' ? 'var(--font-mono)' : 'var(--font-texto)';
        return '<div class="degrau" style="--i:' + i + '"><span class="amostra" style="font-family:' + fam + ';font-size:' + e[2] + 'px;line-height:' + e[3] + 'px;font-weight:' + e[4] + ';letter-spacing:' + e[5] + (e[1] === 'titulo' && e[2] >= 30 ? ';font-variant-numeric:tabular-nums' : '') + '">' + h(e[6]) + '</span>' +
          '<span class="meta"><b>' + e[0] + '</b><span class="tnum">' + e[2] + ' / ' + e[3] + ' · ' + e[4] + '</span></span></div>';
      }).join('');
      return '<div class="empilhado"><div class="cab cab-linha cab-escala">' + titulo('Uma escala, leve no alto.') +
        '<ul class="regras-tipo" data-e style="--d:420ms"><li><b>Títulos grandes são leves.</b> De 24 px para cima, peso 300. O hero é a exceção, em 500.</li><li><b>Ênfase é 500.</b> Hierarquia com tamanho, peso e o texto suave.</li><li><b>Caixa normal.</b> Nenhum rótulo em caixa alta, nem sobretítulo.</li><li><b>Nada abaixo de 11 px.</b> E 11 px só para a hora.</li></ul></div>' +
        '<div class="escada">' + linhas + '</div></div>';
    },
    entrar: function (el, api) {
      var ds = qa(el, '.degrau'), k = 0, sobre = false;
      ds.forEach(function (d) { api.ouvir(d, 'pointerenter', function () { sobre = true; ds.forEach(function (x) { x.classList.toggle('foco', x === d); }); }); });
      api.ouvir(q(el, '.escada'), 'pointerleave', function () { sobre = false; });
      if (api.parado) return;
      api.intervalo(function () { if (sobre) return; var d = ds[k++ % ds.length]; ds.forEach(function (x) { x.classList.toggle('foco', x === d); }); }, 1500);
    }
  });

  /* ---------------- 25. Raios e sombras ---------------- */
  var RAIOS = [['raio-painel', '34 px', 'Painel grande'], ['raio-xl', '25,5 px', 'Gaveta, diálogo'], ['raio-campo', '24 px', 'Campo do chat'], ['raio-cartao', '20 px', 'Cartão, widget'], ['raio-lg', '17 px', 'Botão, campo'], ['raio-md', '12,75 px', 'Item de menu'], ['raio-sm', '8,5 px', 'Miniatura'], ['raio-pilula', 'redondo', 'Sugestão, selo']];
  var SOMBRAS = [['sombra-contorno', 'Chip, botão solto'], ['sombra-cartao', 'Cartão e widget'], ['sombra-painel', 'O painel da tela'], ['sombra-md', 'Popover, menu'], ['sombra-lg', 'Gaveta, diálogo']];
  S.push({
    id: 'raios', capitulo: 'Forma', curto: 'Raios e sombras', grade: 'direita',
    notas: 'O raio base é 17 px; os outros saem dele ou são os das peças grandes. Quanto maior a peça, maior o raio, e o de dentro é menor que o de fora. Nenhum canto vivo. As sombras usam a tinta do modo: areia escura no claro, para ficar quente e nunca cinza; preto no escuro, onde quase não aparecem.',
    html: function () {
      var lista = RAIOS.map(function (r) { return '<li data-r="' + r[0] + '"><span class="tnum">' + r[1] + '</span><span class="codigo">' + r[0] + '</span><span class="suave">' + r[2] + '</span></li>'; }).join('');
      var ninho = '<div class="ninho"><div class="n-painel" data-r="raio-painel"><span class="cant">34</span>' +
        '<div class="n-cartao" data-r="raio-cartao"><span class="cant">20</span><div class="n-linha"><span class="n-mini" data-r="raio-sm"></span><span class="n-txt"><b>Guias de outubro</b><i></i></span><span class="n-selo" data-r="raio-pilula">Vence logo</span></div>' +
        '<div class="n-linha"><span class="n-mini" data-r="raio-sm"></span><span class="n-txt"><b>Lote de sexta</b><i></i></span><span class="n-selo" data-r="raio-pilula">Aprovado</span></div>' +
        '<div class="n-botoes"><span class="n-botao" data-r="raio-lg">Editar</span><span class="n-botao primario" data-r="raio-pilula">Aprovar</span></div></div>' +
        '<div class="n-campo" data-r="raio-campo"><span class="cant">24</span>Peça ao Assistente…<span class="n-enviar"></span></div>' +
        '<div class="n-menu" data-r="raio-lg"><span class="cant">17</span><span class="at" data-r="raio-md">Copiar</span><span>Mover para Arquivos</span></div></div></div>';
      var sombras = '<div class="sombras">' + SOMBRAS.map(function (s, i) { return '<div class="sombra-am" style="box-shadow:var(--' + s[0] + ');--d:' + (500 + i * 80) + 'ms" data-e><span class="codigo">' + s[0] + '</span><span class="rotulo">' + s[1] + '</span></div>'; }).join('') + '</div>';
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Quanto maior a peça, maior o raio.') + frase('Nenhum canto vivo. A sombra é quente no claro e quase some no escuro, onde a camada mais clara separa.', 300) + '</div>' +
        '<div class="raios-corpo"><ul class="lista-raios" data-e style="--d:300ms">' + lista + '</ul>' + encaixe(520, 380, ninho) + sombras + '</div></div>';
    },
    entrar: function (el, api) {
      var lis = qa(el, '.lista-raios li'), pecas = qa(el, '.ninho [data-r]'), k = 0, sobre = false;
      function realcar(r) {
        lis.forEach(function (l) { l.classList.toggle('foco', l.dataset.r === r); });
        pecas.forEach(function (p) { p.classList.toggle('foco', p.dataset.r === r); });
      }
      lis.forEach(function (l) { api.ouvir(l, 'pointerenter', function () { sobre = true; realcar(l.dataset.r); }); });
      pecas.forEach(function (p) { api.ouvir(p, 'pointerenter', function (e) { e.stopPropagation(); sobre = true; realcar(p.dataset.r); }); });
      api.ouvir(q(el, '.raios-corpo'), 'pointerleave', function () { sobre = false; });
      if (api.parado) return;
      var ordem = ['raio-painel', 'raio-cartao', 'raio-campo', 'raio-lg', 'raio-md', 'raio-sm', 'raio-pilula'];
      api.intervalo(function () { if (!sobre) realcar(ordem[k++ % ordem.length]); }, 1700);
    }
  });

  /* ---------------- 26. Espaço e a grade de pontos ---------------- */
  var ESPACOS = [[1, 4, 'Ícone e rótulo colados'], [2, 8, 'Entre chips e botões'], [3, 12, 'Dentro de cartão pequeno'], [4, 16, 'Padding de cartão; margem no celular'], [5, 20, 'Padding de painel médio'], [6, 24, 'Padding de painel; a grade de pontos'], [8, 32, 'Entre seções']];
  S.push({
    id: 'espaco', capitulo: 'Forma', curto: 'Espaço e a grade de pontos', grade: 'nenhuma',
    notas: 'O espaço tem base de 4 px. Entre irmãos, o espaço vem de gap. O fundo do site e do material de marca é liso, com uma grade de pontos de 1 px a cada 24 px (espaco-6): a grade é chão, não figura. Passe o cursor sobre a grade.',
    html: function () {
      return '<div class="dividido dividido--meio"><div class="cab">' + titulo('Tudo anda de 4 em 4.') +
        frase('O espaço tem base de 4 px. A grade de pontos, a cada 24, é o chão do material de marca.', 320) + '<ul class="espacos" data-e style="--d:400ms">' + ESPACOS.map(function (e, i) { return '<li style="--v:' + e[1] + 'px;--i:' + i + '"><i></i><span class="tnum">' + e[1] + '</span><span class="codigo">espaco-' + e[0] + '</span><span class="suave">' + e[2] + '</span></li>'; }).join('') + '</ul></div>' +
        '<div class="visual"><div class="campo-grade" data-e="fade" style="--d:200ms"><div class="pontos"></div><div class="pontos-luz"></div>' +
        '<div class="lente" aria-hidden="true"><div class="lente-pontos"></div><div class="lente-cota"><i></i><span class="tnum">24 px</span></div></div>' +
        '<p class="rotulo nota-grade">A grade é chão, não figura: sob texto pequeno, fundo liso.</p></div></div></div>';
    },
    entrar: function (el, api) {
      var c = q(el, '.campo-grade'), x = 0.5, y = 0.5, tx = 0.5, ty = 0.5, mexeu = -1e9, t0 = performance.now();
      api.ouvir(c, 'pointermove', function (e) { var r = c.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; mexeu = performance.now(); });
      api.quadro(function (agora) {
        if (agora - mexeu > 2500 && !api.parado) { var t = (agora - t0) / 1000; tx = 0.5 + 0.32 * Math.sin(t * 0.5); ty = 0.5 + 0.28 * Math.sin(t * 0.37 + 1); }
        x += (tx - x) * 0.08; y += (ty - y) * 0.08;
        c.style.setProperty('--mx', (x * 100).toFixed(2) + '%'); c.style.setProperty('--my', (y * 100).toFixed(2) + '%');
        return !api.parado;
      });
    }
  });

  /* ---------------- 27. Luz, máscara e hachura ---------------- */
  S.push({
    id: 'luzmascara', capitulo: 'Forma', curto: 'Gradiente, máscara e hachura', grade: 'nenhuma',
    notas: 'O gradiente é luz, não cor: sempre vertical, do passo claro para o escuro da mesma camada, na altura cheia do que pinta; o que fica por cima é chapado. A máscara esmaece em 24 px o que rola sob algo fixo. A hachura de 135° marca valor estimado em gráfico: é padrão de dado, não ornamento.',
    html: function () {
      var col = function (modo) {
        return '<div class="grad-modo forca-' + modo + '"><span class="g-col" style="background:var(--gradiente-fundo)"><b>fundo</b></span><span class="g-col" style="background:var(--gradiente-lateral)"><b>lateral</b></span><span class="g-col" style="background:var(--gradiente-rebaixada)"><b>rebaixada</b></span></div>';
      };
      var msgs = [['contabil', 'Conciliei 211 de 214 lançamentos da Metalúrgica.'], ['fiscal', 'As guias de outubro estão prontas para você aprovar.'], ['dp', 'Preparei os contratos de experiência da Padaria.'], ['atendimento', 'O João Batista mandou os documentos de admissão.'], ['bpo_pagar', 'Montei o lote de sexta: 4 contas.'], ['consultor', 'Li a LC 123 para o fator R da Clínica Sorriso.']];
      var rolo = msgs.concat(msgs).map(function (m) { return '<div class="r-msg">' + orb(m[0], { tamanho: 20, estatico: true, extras: false }) + '<span><b>' + h(I[m[0]].nome) + '</b> ' + h(m[1]) + '</span></div>'; }).join('');
      var dias = [['seg', 6.5, 1], ['ter', 7, 0.5], ['qua', 5.5, 2], ['qui', 7.5, 0], ['sex', 4, 2.5]];
      var barras = dias.map(function (d, i) { return '<div class="dia" style="--i:' + i + '"><div class="pilha-h"><i class="est" style="height:' + (d[2] / 9 * 100) + '%"></i><i class="conf" style="height:' + (d[1] / 9 * 100) + '%"></i></div><span>' + d[0] + '</span></div>'; }).join('');
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Gradiente é luz, não cor.') + frase('Sempre vertical, dentro da mesma camada. O que fica por cima é chapado.', 300) + '</div>' +
        '<div class="tres-paineis">' +
        '<div class="painel-lm" data-e style="--d:300ms"><div class="grads">' + col('claro') + col('escuro') + '</div><p class="rotulo-lm"><b>Os três gradientes</b>do passo claro para o escuro da mesma camada</p></div>' +
        '<div class="painel-lm" data-e style="--d:400ms"><div class="mascara-demo"><div class="m-topo">Time agora</div><div class="m-rolo"><div class="m-faixa">' + rolo + '</div></div></div><p class="rotulo-lm"><b>A máscara de esmaecer</b>24 px sob o topo fixo, em qualquer camada</p></div>' +
        '<div class="painel-lm" data-e style="--d:500ms"><div class="grafico-h"><div class="barras-h">' + barras + '</div><div class="leg-h"><span><i class="conf"></i>Confirmadas</span><span><i class="est"></i>Estimadas</span></div></div><p class="rotulo-lm"><b>A hachura de estimado</b>listras a 135°, 4 px de traço e 4 de vão</p></div>' +
        '</div></div>';
    }
  });

  /* ---------------- 28. A voz ---------------- */
  var PARES = [
    ['A conciliação foi processada.', 'Conciliei 41 de 44 lançamentos.', 'O sistema fala como um colega, na primeira pessoa.'],
    ['Job de transmissão executado com sucesso.', 'Deixei a DCTFWeb na fila de transmissão.', 'Termos do ofício, sem jargão de sistema.'],
    ['Clique aqui para prosseguir', 'Aprovar', 'O botão diz o que acontece.', true],
    ['Webhook recebido.', 'A Rita baixou as guias de outubro. O registro está em Arquivos.', 'O aviso diz o que mudou e onde ver.']
  ];
  S.push({
    id: 'voz', capitulo: 'Voz', curto: 'A voz', grade: 'nenhuma',
    notas: 'Português do Brasil, frases curtas, voz ativa. O sistema fala como um colega do escritório: "Conciliei 41 de 44 lançamentos", e não "A conciliação foi processada". Os integrantes dizem o que fizeram e o que falta. O botão diz o que acontece; o aviso diz o que mudou e onde ver. Termos do ofício sem explicação, nada de jargão de sistema nem de marketing, sem emoji, nada inventado.',
    html: function () {
      return '<div class="empilhado"><div class="cab cab-linha">' + titulo('Fala como um colega do escritório.') + '</div>' +
        '<div class="palco-voz"><p class="v-antes"><span class="v-marca">' + u.icone('x') + '</span><span class="v-t1"></span></p>' +
        '<div class="v-depois"><span class="v-marca">' + u.icone('check') + '</span><span class="v-t2"></span></div>' +
        '<p class="v-regra suave"></p><div class="v-pontos" aria-hidden="true">' + PARES.map(function () { return '<i></i>'; }).join('') + '</div></div>' +
        '<div class="chips v-chips" data-e style="--d:500ms"><span class="pilula pilula--contorno">Primeira pessoa</span><span class="pilula pilula--contorno">Frases curtas, voz ativa</span><span class="pilula pilula--contorno">PGDAS-D, fator R, lote</span><span class="pilula pilula--contorno">Sem emoji</span><span class="pilula pilula--contorno">Ícones Phosphor, peso regular</span><span class="pilula pilula--contorno">Nada inventado</span></div></div>';
    },
    entrar: function (el, api) {
      var t1 = q(el, '.v-t1'), t2 = q(el, '.v-t2'), regra = q(el, '.v-regra'), antes = q(el, '.v-antes'), pts = qa(el, '.v-pontos i');
      if (api.parado) {
        var p0 = PARES[0]; t1.textContent = p0[0]; antes.classList.add('riscado'); t2.textContent = p0[1]; regra.textContent = p0[2]; pts[0].classList.add('at');
        return;
      }
      (async function () {
        await api.esperar(700);
        for (var k = 0; ; k++) {
          var p = PARES[k % PARES.length];
          pts.forEach(function (x, i) { x.classList.toggle('at', i === k % PARES.length); });
          antes.classList.remove('riscado'); t1.textContent = p[0]; t2.textContent = ''; t2.className = 'v-t2' + (p[3] ? ' como-botao' : ''); regra.textContent = '';
          await api.esperar(1300);
          antes.classList.add('riscado');
          await api.esperar(500);
          if (p[3]) { t2.textContent = p[1]; await api.esperar(200); } else await api.digitar(t2, p[1], 40);
          regra.textContent = p[2];
          if (api.parado) return;
          await api.esperar(3200);
        }
      })().catch(function () {});
    }
  });
})();
