/*
 * Identidade da Heild — o que todas as cenas usam.
 *
 * Cada slide é um objeto { capitulo, titulo, curto, notas, grade, semLogo, semRodape, passos, html(), entrar(el, api) }
 * empilhado em HEILD_MARCA.slides, na ordem em que os arquivos de cenas entram no modelo.
 * `entrar` liga a cena quando o slide chega; os temporizadores, quadros e ouvintes de `api` param sozinhos
 * quando o slide sai (o motor esvazia o slide ao sair e desenha de novo ao voltar).
 *
 * Fonte da verdade: o design system (branch design-system). Nada inventado: os nomes, cores, tempos e medidas
 * vêm de lá, do <heild-logo>, do <orb-avatar> e dos dados de exemplo do protótipo.
 */
(function () {
  'use strict';

  /* ---------- os integrantes (design-system/orbs.md) ---------- */
  // `cor` e `olho` são nomes de tokens: a cor é lida do tema na hora (o Assistente troca no escuro).
  var I = {
    assistente: { nome: 'Assistente', cor: '--orb-assistente', olho: '--olho-assistente', area: 'Todas as áreas', faz: 'Recebe qualquer pedido, divide entre o time e acompanha até o fim.' },
    consultor: { nome: 'Consultor', cor: '--orb-consultor', area: 'Lei e reforma', faz: 'Responde sobre a lei com o artigo, a data e o grau de segurança.' },
    atendimento: { nome: 'Atendimento', cor: '--orb-atendimento', area: 'Todas as áreas', faz: 'Fala com o cliente no WhatsApp, cobra documentos e tria as conversas.' },
    financeiro: { nome: 'Financeiro', cor: '--orb-financeiro', area: 'O financeiro do escritório', faz: 'Prepara as cobranças, os contratos e as contas do próprio escritório.' },
    fiscal: { nome: 'Fiscal', cor: '--orb-fiscal', area: 'Contábil', faz: 'Apura os tributos, gera as guias e prepara as transmissões.' },
    dp: { nome: 'DP', cor: '--orb-dp', area: 'Contábil', faz: 'Prepara admissões, a folha e os envios ao eSocial.' },
    contabil: { nome: 'Contábil', cor: '--orb-contabil', area: 'Contábil', faz: 'Concilia, classifica e fecha o mês com o balancete.' },
    societario: { nome: 'Societário', cor: '--orb-societario', area: 'Contábil', faz: 'Cuida do cadastro na Receita, dos certificados e das exigências da Junta.' },
    notas: { nome: 'Notas', cor: '--orb-notas', area: 'Contábil', faz: 'Captura as notas do mês e confere a tributação.' },
    bpo_pagar: { nome: 'Contas a Pagar', cor: '--orb-bpo-pagar', area: 'BPO', faz: 'Monta os lotes de pagamento e confere fornecedor novo.' },
    bpo_receber: { nome: 'Contas a Receber', cor: '--orb-bpo-receber', area: 'BPO', faz: 'Emite os boletos e acompanha os recebimentos de cada empresa.' },
    bpo_conciliacao: { nome: 'Conciliação', cor: '--orb-bpo-conciliacao', area: 'BPO', faz: 'Concilia o extrato e separa o que precisa de uma pessoa.' },
    bpo_gerencial: { nome: 'Gerencial', cor: '--orb-bpo-gerencial', area: 'BPO', faz: 'Fecha o relatório financeiro do mês de cada empresa.' }
  };
  var ORDEM = ['assistente', 'consultor', 'atendimento', 'financeiro', 'fiscal', 'dp', 'contabil', 'societario', 'notas', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'];
  var GRUPOS = [
    { nome: 'Fixos no topo', ids: ['assistente', 'consultor'] },
    { nome: 'De todas as áreas', ids: ['atendimento', 'financeiro'] },
    { nome: 'Contábil', ids: ['fiscal', 'dp', 'contabil', 'societario', 'notas'] },
    { nome: 'BPO', ids: ['bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'] }
  ];

  /* ---------- as 16 formas do I (design-system/README.md, "As formas") ---------- */
  var FORMAS = [
    { id: 'centralizar', nome: 'Centralizar', forma: 'grade de 9 pontos que volta a ser uma peça só', uso: 'hero, abertura, splash' },
    { id: 'orb', nome: 'Orb', forma: 'o I vira uma esfera com olhos recortados', uso: 'presença do Assistente' },
    { id: 'contabil', nome: 'Contábil', forma: 'três barras crescentes na linha de base', uso: 'fechamento concluído' },
    { id: 'juridico', nome: 'Jurídico', forma: 'o I tomba e vira um sinal de igual', uso: 'jurídico e conformidade' },
    { id: 'bpo', nome: 'BPO', forma: 'duas cápsulas formam um check', uso: 'rotina entregue' },
    { id: 'ia', nome: 'IA', forma: 'três cópias do I em leque, girando 60°', uso: 'o agente começou' },
    { id: 'atendimento', nome: 'Atendimento', forma: 'três pontos pulando em onda', uso: 'alguém digitando' },
    { id: 'financeiro', nome: 'Financeiro', forma: 'um $ em zigue-zague', uso: 'cobrança, pagamentos' },
    { id: 'tempo', nome: 'Tempo', forma: 'ampulheta que vira 180°', uso: 'timesheet, prazos' },
    { id: 'arquivos', nome: 'Arquivos', forma: 'pasta em contorno, com aba', uso: 'documentos' },
    { id: 'conversa', nome: 'Conversa', forma: 'balão de fala com rabicho', uso: 'CRM, conversa' },
    { id: 'celular', nome: 'Celular', forma: 'o aparelho, com um ponto como botão', uso: 'app do cliente' },
    { id: 'painel', nome: 'Painel', forma: 'grade bento: coluna alta, barras e pontos', uso: 'painel, widgets' },
    { id: 'lupa', nome: 'Lupa', forma: 'lente octogonal com cabo, que varre', uso: 'consultor, busca' },
    { id: 'equipe', nome: 'Equipe', forma: 'três pessoas em onda de aceno', uso: 'o time' },
    { id: 'orbs', nome: 'Orbs', forma: 'o orb se divide como uma célula em três', uso: 'os integrantes' }
  ];
  // Quanto HE e LD se afastam, em fração da largura, na forma parada (medido no componente).
  var AFASTA = { centralizar: .075, contabil: .075, juridico: .069, bpo: .083, ia: .079, atendimento: .075, orb: .095, tempo: .075, arquivos: .115, conversa: .115, financeiro: .115, celular: .067, painel: .075, lupa: .088, equipe: .168, orbs: .184 };

  /* ---------- estados do orb (orbs.md) ---------- */
  var REACAO = { disponivel: 'idle', pensando: 'thinking', trabalhando: 'working', precisa_de_voce: 'needs', concluido: 'done', dormindo: 'sleeping', erro: 'error' };
  var ESTADOS = [
    ['disponivel', 'Disponível', 'parado, olhando', 'Sem trabalho agora.'],
    ['pensando', 'Pensando', 'olhos para cima, balanço lento', 'Antes de responder.'],
    ['trabalhando', 'Trabalhando', 'vaga e olha em volta', 'Uma tarefa em andamento, ou escrevendo.'],
    ['precisa_de_voce', 'Precisa de você', 'chama a atenção', 'Deixou um cartão esperando aprovação.'],
    ['concluido', 'Concluído', 'contente', 'Terminou e entregou.'],
    ['dormindo', 'Em pausa', 'olhos fechados', 'Integrante pausado.'],
    ['erro', 'Com erro', 'aflito', 'Algo falhou e precisa de alguém.']
  ];

  /* ---------- utilidades ---------- */
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function q(el, s) { return el.querySelector(s); }
  function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function inOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function outBack(t, s) { return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); }
  function sai(t) { return 1 - Math.pow(1 - t, 3); }

  /* Um orb de integrante. A cor vem do token, lida e aplicada pelo motor (api.colorir). */
  function orb(id, o) {
    o = o || {};
    var it = I[id] || I.assistente;
    return '<orb-avatar data-int="' + h(id) + '" data-cor="' + it.cor + '"' + (it.olho ? ' data-olho="' + it.olho + '"' : '') +
      ' size="' + (o.tamanho || 40) + '"' + (o.reacao ? ' reaction="' + o.reacao + '"' : '') + ' mode="' + (o.modo || 'drift') + '"' +
      (o.extras === false ? ' extras="off"' : '') + (o.estatico ? ' static' : '') + (o.vivo ? ' alive' : '') + (o.gaze ? ' gaze="' + o.gaze + '"' : '') +
      (o.attrs || '') + ' label="' + h(o.rotulo || it.nome) + '"' + (o.classe ? ' class="' + o.classe + '"' : '') + '></orb-avatar>';
  }
  /* O HE da logo fechada (a barra lateral do produto e o ícone da aba): o traçado oficial do componente, nunca texto. */
  function he(alt) {
    return '<svg class="he-marca" viewBox="0 0 489 387" height="' + (alt || 16) + '" width="' + ((alt || 16) * 489 / 387).toFixed(1) + '" role="img" aria-label="Heild"><path fill="currentColor" d="' + window.Heild.paths.HE + '"/></svg>';
  }
  function logo(o) {
    o = o || {};
    return '<heild-logo label="' + h(o.rotulo || 'Heild') + '"' + (o.classe ? ' class="' + o.classe + '"' : '') + (o.estilo ? ' style="' + o.estilo + '"' : '') +
      (o.attrs || '') + '></heild-logo>';
  }
  /* Título com palavras que entram saindo do desfoque (o motor divide). */
  function titulo(t, cls) { return '<h2 class="titulo ' + (cls || '') + '">' + h(t) + '</h2>'; }
  function frase(t, d, cls) { return t ? '<p class="frase ' + (cls || '') + '" data-e style="--d:' + (d == null ? 320 : d) + 'ms">' + h(t) + '</p>' : ''; }
  /* Visual de tamanho fixo, escalado para caber na coluna. */
  function encaixe(w, hh, html, cls) { return '<div class="visual"><div class="encaixe ' + (cls || '') + '" style="--w:' + w + 'px;--h:' + hh + 'px">' + html + '</div></div>'; }
  function icone(nome) {
    var p = {
      x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
      check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      relogio: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
      alerta: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.2M12 16.8v.1"/>'
    }[nome] || '';
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* A logo em loop numa forma. O play() interrompe o loop do atributo, então quando a promessa resolve,
     religa o atributo `animation`. O clique toca a forma na hora. */
  function logoEmLoop(api, el, forma, comClique) {
    var ligar = function () { if (!api.vivo()) return; el.removeAttribute('animation'); el.setAttribute('loop', ''); el.setAttribute('animation', forma); };
    var tocar = function () { var p = el.play(forma); if (p && p.then) p.then(ligar); };
    if (api.parado) return;
    tocar();
    if (comClique !== false) {
      api.ouvir(el, 'click', tocar);
      api.ouvir(el, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tocar(); } });
    }
    api.aoSair(function () { el.removeAttribute('animation'); el.removeAttribute('loop'); if (el.stop) el.stop(); });
  }
  function pararLogo(api, el) { api.aoSair(function () { el.removeAttribute('animation'); el.removeAttribute('loop'); if (el.stop) el.stop(); }); }

  /* A luz da Heild (como no hero e no fechamento do site, app/src/site/Luz.tsx): uma mancha por integrante,
     espalhadas, que se juntam numa faixa em 2,4 s e seguem respirando. Segue o cursor de leve. */
  function luzHtml(ids, cls) {
    return '<div class="luz ' + (cls || '') + '" aria-hidden="true">' + ids.map(function (id) { return '<span class="mancha" style="--c:var(' + I[id].cor + ')"></span>'; }).join('') + '<span class="nucleo"></span></div>';
  }
  function luz(api, el, o) {
    o = o || {};
    var box = q(el, '.luz'); if (!box) return;
    var ms = qa(box, '.mancha'), n = ms.length, t0 = performance.now(), mx = 0, my = 0, px = 0, py = 0;
    api.ouvir(window, 'pointermove', function (e) { var r = box.getBoundingClientRect(); if (!r.width) return; mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; }, { passive: true });
    api.quadro(function (agora) {
      var w = box.offsetWidth, hh = box.offsetHeight, t = api.parado ? 6 : (agora - t0) / 1000;
      var junta = o.juntar === false || api.parado ? 1 : sai(Math.min(1, t / 2.4)), faixa = Math.min(w * .92, o.faixa || 1300);
      px += (mx - px) * .04; py += (my - py) * .04;
      for (var i = 0; i < n; i++) {
        var ang = i / n * Math.PI * 2 + .6, sx = Math.cos(ang) * w * .55, sy = Math.sin(ang) * hh * .55;
        var bx = (n === 1 ? 0 : i / (n - 1) - .5) * faixa;
        var fx = bx + Math.sin(t * .23 + i * 1.7) * w * .05 + px * 60, fy = Math.sin(t * .37 + i * 2.3) * hh * .05 + py * 30;
        var x = sx + (fx - sx) * junta, y = sy + (fy - sy) * junta;
        var s = (.85 + .15 * Math.sin(t * .5 + i * 1.1)) * (.6 + .4 * junta);
        ms[i].style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        ms[i].style.opacity = (Math.min(1, (o.forca || .55) * (.3 + .7 * junta))).toFixed(3);
      }
      return !api.parado;
    });
  }

  /* Contraste WCAG entre duas cores CSS já resolvidas (rgb(...)). */
  function rgb(cor) { var m = String(cor).match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0]; }
  function lum(c) { var a = c.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * a[0] + .7152 * a[1] + .0722 * a[2]; }
  function contraste(a, b) { var la = lum(rgb(a)), lb = lum(rgb(b)); return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05); }
  /* Resolve o valor de uma variável de cor num elemento (para os contrastes e os hex mostrados). */
  function corDe(el, varNome) {
    var s = document.createElement('i'); s.style.color = 'var(' + varNome + ')'; s.style.display = 'none'; el.appendChild(s);
    var c = getComputedStyle(s).color; s.remove(); return c;
  }
  function hex(cor) { var c = rgb(cor); return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function num(v, casas) { return v.toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 }); }

  window.HEILD_MARCA = {
    slides: [],
    I: I, ORDEM: ORDEM, GRUPOS: GRUPOS, FORMAS: FORMAS, AFASTA: AFASTA, REACAO: REACAO, ESTADOS: ESTADOS,
    u: { he: he, h: h, q: q, qa: qa, clamp: clamp, inOut: inOut, outBack: outBack, sai: sai, orb: orb, logo: logo, titulo: titulo, frase: frase, encaixe: encaixe, icone: icone,
      logoEmLoop: logoEmLoop, pararLogo: pararLogo, luzHtml: luzHtml, luz: luz, contraste: contraste, corDe: corDe, hex: hex, rgb: rgb, num: num }
  };
})();
