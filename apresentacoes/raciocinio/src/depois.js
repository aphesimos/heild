/*
 * O raciocínio do Consultor — depois do motor.
 * O motor da apresentação de produto põe "Apresentação da {versão}" no título da aba. Aqui o título vira o
 * desta apresentação, também quando a pessoa troca de versão.
 */
(function () {
  'use strict';
  var BASE = 'O raciocínio do Consultor · Heild';
  var el = document.querySelector('title');
  function acertar() {
    var t = document.title, alvo = /Curta$/.test(t) ? BASE + ' · versão curta' : BASE;
    if (t !== alvo) document.title = alvo;
  }
  acertar();
  if (el && window.MutationObserver) new MutationObserver(acertar).observe(el, { childList: true, characterData: true, subtree: true });
})();
