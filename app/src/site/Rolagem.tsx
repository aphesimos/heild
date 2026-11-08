import { useEffect, useRef, useState } from 'react'

/**
 * A barra de rolagem do site: uma pílula, como o I da logo, que desliza pela
 * borda direita, aparece ao rolar (ou com o cursor perto da borda) e some quando
 * a página fica parada. Dá para arrastar. A barra nativa fica escondida (site.css).
 */
export function BarraRolagem() {
  const pilula = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const sumir = useRef(0)
  const arraste = useRef<{ y: number; topo: number } | null>(null)

  useEffect(() => {
    const el = pilula.current
    if (!el) return
    let raf = 0
    const posicionar = () => {
      raf = 0
      const doc = document.documentElement
      const vh = window.innerHeight
      const total = doc.scrollHeight
      if (total <= vh + 1) return void (el.style.opacity = '0')
      const altura = Math.max(48, (vh / total) * vh * 0.9)
      const curso = vh - altura - 16
      const p = window.scrollY / (total - vh)
      el.style.height = `${altura}px`
      el.style.transform = `translateY(${8 + p * curso}px)`
      el.style.opacity = ''
    }
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(posicionar)
    }
    const acordar = () => {
      setVisivel(true)
      window.clearTimeout(sumir.current)
      sumir.current = window.setTimeout(() => !arraste.current && setVisivel(false), 1200)
    }
    const rolou = () => (pedir(), acordar())
    const perto = (e: PointerEvent) => window.innerWidth - e.clientX < 28 && acordar()
    posicionar()
    window.addEventListener('scroll', rolou, { passive: true })
    window.addEventListener('resize', pedir)
    window.addEventListener('pointermove', perto, { passive: true })
    const ro = new ResizeObserver(pedir)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', rolou)
      window.removeEventListener('resize', pedir)
      window.removeEventListener('pointermove', perto)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  // Arrastar a pílula rola a página na mesma proporção.
  const comecar = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    arraste.current = { y: e.clientY, topo: window.scrollY }
    setArrastando(true)
  }
  const mover = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arraste.current
    if (!a) return
    const doc = document.documentElement
    const vh = window.innerHeight
    const altura = pilula.current?.offsetHeight ?? 48
    const curso = vh - altura - 16
    window.scrollTo({ top: a.topo + ((e.clientY - a.y) / curso) * (doc.scrollHeight - vh) })
  }
  const soltar = () => {
    arraste.current = null
    setArrastando(false)
    window.clearTimeout(sumir.current)
    sumir.current = window.setTimeout(() => setVisivel(false), 1200)
  }

  return (
    <div className="barra-rolagem" aria-hidden>
      <div ref={pilula} data-visivel={visivel || arrastando} data-arrastando={arrastando} className="pilula-rolagem" onPointerDown={comecar} onPointerMove={mover} onPointerUp={soltar} onPointerCancel={soltar} />
    </div>
  )
}
