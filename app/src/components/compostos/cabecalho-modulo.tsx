import { BellIcon, ListIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Contador } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Linha de cima de toda tela: abas internas no centro, sino e cliente à direita
 * (design do usuário; sino do 03, 2.2). Em tela estreita vira duas linhas:
 * menu, sino e cliente em cima; abas embaixo, rolando na horizontal.
 */
export function CabecalhoModulo({
  abas,
  cliente,
  naoLidas = 0,
  sino,
  onAbrirMenu,
  className,
}: {
  abas?: ReactNode
  cliente?: ReactNode
  naoLidas?: number
  /** Sino com a central de avisos; sem ele, um sino simples com o contador. */
  sino?: ReactNode
  /** Só em tela estreita, onde a barra lateral fica escondida. */
  onAbrirMenu?: () => void
  className?: string
}) {
  return (
    <header
      className={cn(
        'grid shrink-0 grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 px-3 pt-3 pb-2 sm:px-5',
        'md:h-16 md:grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(17rem,1fr)] md:gap-x-3 md:py-0 baixa:md:h-14',
        className,
      )}
    >
      <div className="flex items-center">
        {onAbrirMenu && (
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Abrir menu" onClick={onAbrirMenu}>
            <ListIcon weight="bold" className="size-5" />
          </Button>
        )}
      </div>
      <div className="col-span-2 row-start-2 flex min-w-0 justify-center md:col-span-1 md:col-start-2 md:row-start-1">{abas}</div>
      <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-1 md:col-start-3">
        {sino ?? (
          <Button variant="ghost" size="icon" className="relative shrink-0 rounded-full" aria-label={`Notificações (${naoLidas})`}>
            <BellIcon weight="duotone" className="size-5" />
            <Contador valor={naoLidas} className="absolute top-1 right-1" />
          </Button>
        )}
        {cliente}
      </div>
    </header>
  )
}
