/**
 * Esmaecido das áreas de rolagem onde o navegador não tem animação guiada por
 * rolagem (o Safari de alguns iPhones, por exemplo). Regra do design system:
 * conteúdo que rola nunca some atrás de uma borda sólida. Nesses navegadores, a
 * própria página mede a rolagem de cada `.area-rolagem` e `.area-rolagem-dupla`
 * e passa as alturas do esmaecido para o CSS (--esmaecer-js-topo e
 * --esmaecer-js-fim): o topo esmaece quando há conteúdo acima, o fim quando há
 * conteúdo abaixo. Com suporte nativo, não faz nada.
 */
const SELETOR = '.area-rolagem, .area-rolagem-dupla'
const MAX = 44
const FAIXA = 60

function medir(el: HTMLElement) {
  const acima = el.scrollTop
  const abaixo = el.scrollHeight - el.clientHeight - el.scrollTop
  el.style.setProperty('--esmaecer-js-topo', `${(Math.min(Math.max(acima, 0), FAIXA) / FAIXA) * MAX}px`)
  el.style.setProperty('--esmaecer-js-fim', `${(Math.min(Math.max(abaixo, 0), FAIXA) / FAIXA) * MAX}px`)
}

export function instalarEsmaecerRolagem() {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return
  if (CSS.supports('animation-timeline: scroll()')) return
  // Rolar: mede só a área que rolou.
  document.addEventListener(
    'scroll',
    (e) => {
      const el = e.target
      if (el instanceof HTMLElement && el.matches(SELETOR)) medir(el)
    },
    { capture: true, passive: true },
  )
  // Conteúdo que chega ou muda de tamanho (mensagens novas, troca de aba): mede todas, com folga.
  const todas = () => document.querySelectorAll<HTMLElement>(SELETOR).forEach(medir)
  let pendente = 0
  const agendar = () => {
    if (pendente) return
    pendente = window.setTimeout(() => {
      pendente = 0
      todas()
    }, 120)
  }
  new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true, characterData: true })
  window.addEventListener('resize', agendar, { passive: true })
  agendar()
}
