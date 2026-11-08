import { CheckIcon, MinusIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import type { Situacao } from '@/dados/painel-abas'
import { cn } from '@/lib/utils'

/** Tabela compacta dos widgets do Painel: rola de lado dentro da caixa quando não cabe. */
export function Tabela({ colunas, minimo = 480, children }: { colunas: { rotulo: string; direita?: boolean; centro?: boolean }[]; minimo?: number; children: ReactNode }) {
  return (
    <div className="-mx-1 h-full overflow-x-auto px-1">
      <table className="w-full text-sm" style={{ minWidth: minimo }}>
        <thead className="bg-surface sticky top-0">
          <tr className="text-muted-foreground text-left text-xs">
            {colunas.map((c, i) => (
              <th key={i} className={cn('py-1 pr-2 font-medium', c.direita && 'text-right', c.centro && 'text-center')}>
                {c.rotulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border/70 divide-y">{children}</tbody>
      </table>
    </div>
  )
}

/** Linha de lista dos widgets: ícone/selo à esquerda, texto, ação à direita. */
export function Linha({ inicio, titulo, detalhe, fim, className }: { inicio?: ReactNode; titulo: ReactNode; detalhe?: ReactNode; fim?: ReactNode; className?: string }) {
  return (
    <li className={cn('flex items-center gap-3 py-2 first:pt-0 last:pb-0', className)}>
      {inicio}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{titulo}</span>
        {detalhe && <span className="text-muted-foreground block truncate text-xs">{detalhe}</span>}
      </span>
      {fim}
    </li>
  )
}

/** Número grande com legenda, para widgets pequenos. */
export function Numero({ valor, legenda, alerta }: { valor: ReactNode; legenda: ReactNode; alerta?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-end">
      <span className={cn('font-heading text-4xl font-light tabular-nums', alerta && 'text-warning')}>{valor}</span>
      <span className="text-muted-foreground text-xs">{legenda}</span>
    </div>
  )
}

/** Ícone de situação (ok, atenção, erro, neutro), igual em todas as abas. */
export function IconeSituacao({ s, className }: { s: Situacao; className?: string }) {
  const c = cn('size-4 shrink-0', className)
  if (s === 'ok') return <CheckIcon weight="bold" className={cn(c, 'text-success')} aria-label="ok" />
  if (s === 'atencao') return <WarningIcon weight="fill" className={cn(c, 'text-warning')} aria-label="atenção" />
  if (s === 'erro') return <XCircleIcon weight="fill" className={cn(c, 'text-destructive')} aria-label="erro" />
  return <MinusIcon className={cn(c, 'text-muted-foreground')} aria-label="sem prazo" />
}

/** Dias até vencer: vermelho vencido, âmbar até 30 dias. */
export function Dias({ dias }: { dias: number }) {
  return (
    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap tabular-nums', dias < 0 ? 'bg-destructive/12 text-destructive' : dias <= 30 ? 'bg-warning/15' : 'bg-sunken text-muted-foreground')}>
      {dias < 0 ? `vencido há ${-dias} ${dias === -1 ? 'dia' : 'dias'}` : `${dias} dias`}
    </span>
  )
}
