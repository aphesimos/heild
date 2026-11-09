/*
 * O tema da Heild em JavaScript puro: o mesmo botão e a mesma onda do site.
 *
 * De onde veio: do branch `site`, arquivo app/src/site/SiteApp.tsx, traduzido de React para JS sem dependência.
 *   - `SiteApp` (o estado do tema): a escolha da pessoa, guardada em localStorage na chave 'heild-tema' com
 *     'claro' ou 'escuro', vale sobre a preferência do sistema. Sem escolha nesta visita, uma mudança no
 *     sistema troca o tema (no site, o ref `escolheu`).
 *   - `trocarModo`: a troca numa onda que nasce no ícone e cobre a página (View Transitions, com --onda-x,
 *     --onda-y, --onda-r e data-onda-para na raiz e a classe trocando-tema durante a onda). Sem suporte, ou
 *     com movimento reduzido, as cores esmaecem: a classe tema-esmaece fica 450 ms.
 *   - `BotaoTema`: o sol e a lua no mesmo desenho (o disco, a sombra que desliza na máscara e os oito raios),
 *     com data-escuro e o mesmo rótulo. A onda nasce no ícone, não no botão.
 * O CSS da onda e do ícone veio de app/src/site/tema.css e está ao lado, em tema.css.
 * Mudou no site? Traga a mudança para cá; os dois têm de continuar iguais.
 *
 * A única diferença: no site o React aplica o modo com a classe .dark e as variáveis do ThemeProvider; aqui
 * ele vai para data-theme na raiz ("light" ou "dark"), que é como os tokens das apresentações mudam
 * (tokens.css). Sem escolha guardada, a raiz fica sem o atributo e os tokens seguem prefers-color-scheme
 * (ou o tema que a página hospedeira puser, como no claude.ai).
 *
 * Como usar numa apresentação:
 *   - carregue este arquivo logo depois do <style>, antes do conteúdo: o tema guardado vale antes da
 *     primeira pintura, sem piscar;
 *   - no lugar do botão, ponha <button type="button" class="botao-tema" data-tema-botao></button>; o desenho
 *     entra quando o navegador lê o botão, também antes da primeira pintura;
 *   - cada troca avisa a página na hora, dentro da transição, com o evento 'heild-tema' em document
 *     (detail.modo: 'claro' ou 'escuro'): quem desenha em canvas relê as cores ali, e a onda já leva o
 *     desenho novo.
 */
(function () {
  'use strict';
  var CHAVE = 'heild-tema';
  var raiz = document.documentElement;
  var DMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var RMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var escolheu = false;

  function lerGuardado() {
    try {
      var salvo = localStorage.getItem(CHAVE);
      if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch (e) { /* sem armazenamento: segue o sistema */ }
    return null;
  }
  function guardar(modo) {
    try { localStorage.setItem(CHAVE, modo); } catch (e) { /* segue sem guardar */ }
  }
  function modoAtual() {
    var t = raiz.getAttribute('data-theme');
    if (t === 'dark') return 'escuro';
    if (t === 'light') return 'claro';
    return DMQ && DMQ.matches ? 'escuro' : 'claro';
  }

  /* o tema guardado, já: este arquivo roda antes do conteúdo */
  var guardado = lerGuardado();
  if (guardado) raiz.setAttribute('data-theme', guardado === 'escuro' ? 'dark' : 'light');

  /* ---------- o botão (BotaoTema) ---------- */
  var botoes = [], contagem = 0;
  function desenhar(botao) {
    // Um id de máscara por botão, como o useId do site.
    var mascara = 'tema-sombra-' + (++contagem), raios = '';
    for (var i = 0; i < 8; i++) {
      var a = (i * Math.PI) / 4;
      raios += '<line x1="' + (12 + Math.cos(a) * 8) + '" y1="' + (12 + Math.sin(a) * 8) + '" x2="' + (12 + Math.cos(a) * 10.2) + '" y2="' + (12 + Math.sin(a) * 10.2) + '"></line>';
    }
    botao.insertAdjacentHTML('afterbegin',
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<mask id="' + mascara + '">' +
          '<rect x="-4" y="-4" width="32" height="32" fill="#fff"></rect>' +
          '<circle class="tema-sombra" cx="18" cy="6" r="7.5" fill="#000"></circle>' +
        '</mask>' +
        '<circle class="tema-disco" cx="12" cy="12" r="5" fill="currentColor" mask="url(#' + mascara + ')"></circle>' +
        '<g class="tema-raios" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' + raios + '</g>' +
      '</svg>');
  }
  function marcar(botao) {
    var escuro = modoAtual() === 'escuro';
    botao.setAttribute('data-escuro', escuro ? 'true' : 'false');
    // Com rótulo visível, o botão não leva aria-label (no site, o botão do menu do celular).
    if (!botao.textContent.trim()) botao.setAttribute('aria-label', escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
  }
  function marcarTodos() { for (var i = 0; i < botoes.length; i++) marcar(botoes[i]); }
  function ligar(botao) {
    if (botoes.indexOf(botao) >= 0) return;
    botoes.push(botao);
    if (!botao.querySelector('svg')) desenhar(botao);
    marcar(botao);
    // A onda nasce no ícone, também quando o botão tem rótulo.
    botao.addEventListener('click', function () { trocar(botao.querySelector('svg')); });
  }
  function ligarTodos() {
    var bs = document.querySelectorAll('[data-tema-botao]');
    for (var i = 0; i < bs.length; i++) ligar(bs[i]);
  }

  /* ---------- a troca (trocarModo) ---------- */
  function avisar(modo) {
    marcarTodos();
    var ev;
    try { ev = new CustomEvent('heild-tema', { detail: { modo: modo } }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('heild-tema', false, false, { modo: modo }); }
    document.dispatchEvent(ev);
  }
  function aplicar(modo) {
    raiz.setAttribute('data-theme', modo === 'escuro' ? 'dark' : 'light');
    avisar(modo);
  }
  /** Troca o tema numa onda que nasce em `origem` e cobre a página (View Transitions); sem suporte, um esmaecer. */
  function trocar(origem) {
    var novo = modoAtual() === 'escuro' ? 'claro' : 'escuro';
    escolheu = true;
    guardar(novo);
    var parado = RMQ && RMQ.matches;
    if (!document.startViewTransition || parado) {
      raiz.classList.add('tema-esmaece');
      aplicar(novo);
      window.setTimeout(function () { raiz.classList.remove('tema-esmaece'); }, 450);
      return;
    }
    var r = origem && origem.getBoundingClientRect ? origem.getBoundingClientRect() : null;
    var x = r ? r.left + r.width / 2 : window.innerWidth - 40;
    var y = r ? r.top + r.height / 2 : 32;
    var raio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    raiz.style.setProperty('--onda-x', x + 'px');
    raiz.style.setProperty('--onda-y', y + 'px');
    raiz.style.setProperty('--onda-r', raio + 'px');
    raiz.dataset.ondaPara = novo;
    // A captura da transição não leva desfoque (backdrop-filter): durante a onda, o que o usa fica opaco.
    raiz.classList.add('trocando-tema');
    var vt = document.startViewTransition(function () { aplicar(novo); });
    var tirar = function () { raiz.classList.remove('trocando-tema'); };
    if (vt && vt.finished) vt.finished.then(tirar, tirar);
    else window.setTimeout(tirar, 1100);
  }

  /* sem escolha nesta visita, o tema acompanha o sistema */
  if (DMQ) {
    var ouvir = function (e) {
      if (escolheu) return;
      var modo = e.matches ? 'escuro' : 'claro';
      // com o atributo (a escolha de outra visita), troca como o site; sem ele, os tokens já seguem o sistema
      if (raiz.hasAttribute('data-theme')) aplicar(modo);
      else avisar(modo);
    };
    if (DMQ.addEventListener) DMQ.addEventListener('change', ouvir);
    else if (DMQ.addListener) DMQ.addListener(ouvir);
  }
  /* alguém de fora mudou data-theme (a página hospedeira, por exemplo): o ícone acompanha */
  if (window.MutationObserver) new MutationObserver(marcarTodos).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });

  /* o botão é ligado assim que o navegador o lê (antes da primeira pintura) e de novo no fim, por garantia */
  if (document.readyState === 'loading' && window.MutationObserver) {
    var leitura = new MutationObserver(ligarTodos);
    leitura.observe(raiz, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function () { leitura.disconnect(); ligarTodos(); });
  } else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ligarTodos);
  else ligarTodos();

  window.HeildTema = { modo: modoAtual, trocar: trocar, ligar: ligar };
})();
