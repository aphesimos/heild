import { CaretRightIcon } from '@phosphor-icons/react'
import { Orb } from '@/components/ui/orb'
import type { Aviso } from '@/dados/tipos'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'

/**
 * Aviso em uma linha, para ficar abaixo do chat do Assistente sem disputar
 * atenção com ele. O aviso completo (fiz / decisão / informação) fica na Visão geral.
 */
export function AvisoCompacto({ aviso, onAbrir, className }: { aviso: Aviso; onAbrir?: () => void; className?: string }) {
  const { integrante } = useTema()
  const i = integrante(aviso.setor)
  const texto = aviso.decisao?.texto ?? aviso.fiz ?? aviso.informacao ?? ''
  return (
    <button
      type="button"
      onClick={onAbrir}
      className={cn(
        'bg-surface hover:bg-raised flex w-full cursor-pointer items-center gap-3 rounded-[18px] px-3 py-2.5 text-left shadow-contorno transition-colors',
        className,
      )}
    >
      <Orb cor={i.cor} corOlhos={i.corOlhos} estado={aviso.decisao ? 'precisa_de_voce' : 'disponivel'} tamanho={26} extras={false} cutucavel={false} />
      <span className="min-w-0 flex-1">
        <span className="text-muted-foreground block text-xs">
          {i.nome} · {aviso.quando}
          {aviso.decisao && <span className="text-foreground font-medium"> · pede decisão</span>}
        </span>
        <span className="block truncate text-sm">{texto}</span>
      </span>
      <CaretRightIcon className="text-muted-foreground size-4 shrink-0" />
    </button>
  )
}
