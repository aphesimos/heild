import { useEffect, useRef } from 'react'

/**
 * A luz da Heild: uma mancha de cor por integrante. No começo elas estão
 * espalhadas; em dois segundos se juntam numa faixa de luz atrás do título (o
 * inteiro, "tudo num lugar só") e seguem respirando. A cor do integrante da
 * legenda acende mais. Só transform e opacity mudam por quadro: as manchas são
 * gradientes radiais, sem filtro de desfoque.
 */
export function Luz({ cores, ativa = -1, intensidade = 1, juntar = true, className }: { cores: string[]; ativa?: number; intensidade?: number; juntar?: boolean; className?: string }) {
  const caixa = useRef<HTMLDivElement>(null)
  const manchas = useRef<(HTMLSpanElement | null)[]>([])
  const ativaRef = useRef(ativa)
  ativaRef.current = ativa

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const parado = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const n = cores.length
    const brilho = cores.map(() => 0)
    let mx = 0
    let my = 0
    let px = 0
    let py = 0
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx = (e.clientX - r.left) / r.width - 0.5
      my = (e.clientY - r.top) / r.height - 0.5
    }
    window.addEventListener('pointermove', mover, { passive: true })
    let visivel = true
    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting))
    io.observe(el)
    const t0 = performance.now()
    let raf = 0
    let forca = 1
    let quadros = 0
    const quadro = (agora: number) => {
      raf = requestAnimationFrame(quadro)
      if (!visivel) return
      if (quadros++ % 30 === 0) forca = parseFloat(getComputedStyle(el).getPropertyValue('--luz-forca')) || 1
      const w = el.clientWidth
      const h = el.clientHeight
      const t = parado ? 4 : (agora - t0) / 1000
      const junta = !juntar || parado ? 1 : 1 - Math.pow(1 - Math.min(1, t / 2.4), 3)
      px += (mx - px) * 0.04
      py += (my - py) * 0.04
      const faixa = Math.min(w * 0.92, 1300)
      for (let i = 0; i < n; i++) {
        const m = manchas.current[i]
        if (!m) continue
        const ang = (i / n) * Math.PI * 2 + 0.6
        const sx = Math.cos(ang) * w * 0.55
        const sy = Math.sin(ang) * h * 0.55
        const bx = (n === 1 ? 0 : i / (n - 1) - 0.5) * faixa
        const deriva = parado ? 0 : 1
        const fx = bx + Math.sin(t * 0.23 + i * 1.7) * w * 0.05 * deriva + px * 60
        const fy = Math.sin(t * 0.37 + i * 2.3) * h * 0.05 * deriva + py * 30
        const x = sx + (fx - sx) * junta
        const y = sy + (fy - sy) * junta
        brilho[i] += ((ativaRef.current === i ? 1 : 0) - brilho[i]) * 0.05
        const s = (0.85 + 0.15 * Math.sin(t * 0.5 + i * 1.1) * deriva) * (1 + brilho[i] * 0.3) * (0.6 + 0.4 * junta)
        m.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`
        m.style.opacity = String(Math.min(1, (0.55 + brilho[i] * 0.45) * intensidade * forca * (0.3 + 0.7 * junta)))
      }
      if (parado) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(quadro)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', mover)
    }
    // A chave é o texto das cores: uma lista nova com as mesmas cores não reinicia a luz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cores.join('|'), intensidade, juntar])

  return (
    <div ref={caixa} className={'luz pointer-events-none absolute inset-0 overflow-hidden ' + (className ?? '')} aria-hidden>
      {cores.map((c, i) => (
        <span key={i} ref={(n) => void (manchas.current[i] = n)} className="mancha" style={{ ['--c' as string]: c }} />
      ))}
      <span className="nucleo" />
    </div>
  )
}
