import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Reserva a altura da maior variante: o conteúdo de verdade e as outras versões
 * possíveis (outra aba, outro integrante, outro item aberto) ocupam a mesma
 * célula, e as outras ficam invisíveis, só medindo. Assim trocar de seleção ou
 * passar o cursor nunca muda a altura da seção nem move o que está em volta.
 * Regra do site: todo conteúdo que troca por seleção passa por aqui.
 */
export function ReservaAltura({ children, variantes, className }: { children: ReactNode; variantes: ReactNode[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1', className)}>
      <div className="min-w-0 [grid-area:1/1]">{children}</div>
      {variantes.map((v, i) => (
        <div key={i} aria-hidden inert className="pointer-events-none invisible min-w-0 [grid-area:1/1]">
          {v}
        </div>
      ))}
    </div>
  )
}
