import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { LARGURA_ABERTA, LARGURA_FECHADA } from '@/components/compostos/barra-lateral'
import { useModoLateral, type ModoLateral } from '@/hooks/useMedia'
import { usePreferencia } from '@/hooks/usePreferencia'
import { cn } from '@/lib/utils'

export interface EstadoLateral {
  aberta: boolean
  onAlternar: () => void
  /** Chame ao navegar: fecha a barra quando ela está por cima do conteúdo. */
  aoNavegar: () => void
  modo: ModoLateral
}

interface Props {
  lateral: (estado: EstadoLateral) => ReactNode
  /** `onAbrirMenu` só vem em tela estreita, onde a barra fica escondida. */
  cabecalho: (p: { onAbrirMenu?: () => void }) => ReactNode
  children: ReactNode
  className?: string
}

/**
 * Casco de toda tela: fundo em degradê, barra lateral, cabeçalho e conteúdo.
 * - tela larga (>= 1280px): a barra aberta empurra o conteúdo e a escolha é lembrada;
 * - média (768 a 1279px): fechada ocupa 76px; aberta passa por cima, com véu;
 * - estreita (< 768px): escondida; o botão de menu do cabeçalho abre como gaveta.
 * Ctrl+B (ou Cmd+B) abre e fecha; Esc fecha quando está por cima.
 */
export function Moldura({ lateral, cabecalho, children, className }: Props) {
  const modo = useModoLateral()
  const [preferida, setPreferida] = usePreferencia('ui-lab:lateral-aberta', true)
  const [temporaria, setTemporaria] = useState(false)
  const [modoAnterior, setModoAnterior] = useState(modo)

  // Trocou de faixa de largura: a abertura temporária não vale mais.
  if (modo !== modoAnterior) {
    setModoAnterior(modo)
    setTemporaria(false)
  }

  const aberta = modo === 'fixa' ? preferida : temporaria
  const porCima = modo !== 'fixa' && aberta
  const alternar = () => (modo === 'fixa' ? setPreferida((v) => !v) : setTemporaria((v) => !v))
  const fechar = () => setTemporaria(false)

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        if (modo === 'fixa') setPreferida((v) => !v)
        else setTemporaria((v) => !v)
      }
      if (e.key === 'Escape') setTemporaria(false)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [modo, setPreferida])

  const reservado = modo === 'fixa' ? (aberta ? LARGURA_ABERTA : LARGURA_FECHADA) : modo === 'sobreposta' ? LARGURA_FECHADA : 0
  const estado: EstadoLateral = { aberta, onAlternar: alternar, aoNavegar: () => modo !== 'fixa' && fechar(), modo }

  return (
    <div className={cn('from-background to-background-end text-foreground flex h-dvh overflow-hidden bg-gradient-to-b', className)}>
      <motion.div initial={false} animate={{ width: reservado }} transition={{ type: 'spring', stiffness: 420, damping: 40 }} className="relative z-40 shrink-0">
        {modo === 'gaveta' ? (
          <AnimatePresence>
            {aberta && (
              <motion.div
                key="gaveta"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 420, damping: 40 }}
                className="absolute inset-y-0 left-0 shadow-2xl"
              >
                {lateral(estado)}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className={cn('absolute inset-y-0 left-0 transition-shadow', porCima && 'shadow-2xl')}>{lateral(estado)}</div>
        )}
      </motion.div>

      <AnimatePresence>
        {porCima && (
          <motion.div
            key="veu"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fechar}
            className="fixed inset-0 z-30 bg-black/25"
          />
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {cabecalho({ onAbrirMenu: modo === 'gaveta' ? alternar : undefined })}
        <main className="relative min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
