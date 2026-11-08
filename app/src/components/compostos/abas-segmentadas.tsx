import { motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { Contador } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface AbaSegmentada {
  id: string
  rotulo: string
  /** Algo ao lado do rótulo; no Figma, o orb de estado na aba "Time". */
  adorno?: ReactNode
  contador?: number
}

interface Props {
  abas: AbaSegmentada[]
  ativa: string
  onTrocar: (id: string) => void
  rotulo?: string
  className?: string
}

/**
 * Abas internas do módulo como controle segmentado, em cima e centralizado
 * (design do usuário). A pílula branca desliza até a aba ativa.
 */
export function AbasSegmentadas({ abas, ativa, onTrocar, rotulo = 'Abas', className }: Props) {
  const grupo = useId()
  return (
    <div
      role="tablist"
      aria-label={rotulo}
      className={cn(
        'bg-sunken inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-[3px] inset-shadow-trilho sem-barra',
        className,
      )}
      onKeyDown={(e) => {
        const i = abas.findIndex((a) => a.id === ativa)
        if (e.key === 'ArrowRight') onTrocar(abas[(i + 1) % abas.length].id)
        if (e.key === 'ArrowLeft') onTrocar(abas[(i - 1 + abas.length) % abas.length].id)
      }}
    >
      {abas.map((a) => {
        const sel = a.id === ativa
        return (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={sel}
            tabIndex={sel ? 0 : -1}
            onClick={() => onTrocar(a.id)}
            className={cn(
              'relative flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors sm:px-5 lg:min-w-28 2xl:min-w-32',
              sel ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {sel && (
              <motion.span
                layoutId={`aba-${grupo}`}
                className="bg-raised absolute inset-0 rounded-full shadow-pilula"
                transition={{ type: 'spring', stiffness: 480, damping: 36 }}
              />
            )}
            {/* A largura é sempre a do texto em negrito: trocar de aba não empurra as vizinhas. */}
            <span className="relative grid">
              <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
                {a.rotulo}
              </span>
              <span className={cn('col-start-1 row-start-1 text-center', sel && 'font-medium')}>{a.rotulo}</span>
            </span>
            {a.adorno && <span className="relative flex">{a.adorno}</span>}
            <Contador valor={a.contador ?? 0} className="relative" />
          </button>
        )
      })}
    </div>
  )
}
