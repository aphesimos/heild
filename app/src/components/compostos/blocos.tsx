import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Caixa padrão de bloco de tela (mesma camada dos widgets: superfície sobre o fundo). */
export function Caixa({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('bg-surface shadow-cartao flex min-w-0 flex-col gap-3 rounded-[24px] p-4 sm:p-5', className)}>{children}</section>
}

/** Número com rótulo, para faixas de resumo. */
export function Numero({ valor, rotulo, detalhe }: { valor: ReactNode; rotulo: string; detalhe?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="font-heading text-2xl font-light tabular-nums sm:text-3xl">{valor}</span>
      <span className="text-muted-foreground text-xs">{rotulo}</span>
      {detalhe && <span className="text-muted-foreground text-[11px]">{detalhe}</span>}
    </div>
  )
}

/** Título de bloco com ação à direita. */
export function TituloBloco({ children, acao, descricao }: { children: ReactNode; acao?: ReactNode; descricao?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start gap-2">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{children}</h3>
        {descricao && <p className="text-muted-foreground text-xs">{descricao}</p>}
      </div>
      {acao}
    </header>
  )
}

/** Linha de propriedade: rótulo à esquerda, valor à direita. */
export function Propriedade({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 py-2 text-sm first:pt-0 last:pb-0">
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

/** Barra de uso com rótulo (cota, limites). Âmbar a partir de 90%. */
export function BarraUso({ rotulo, usado, total, unidade = '' }: { rotulo: string; usado: number; total: number; unidade?: string }) {
  const pct = Math.min(100, Math.round((usado / total) * 100))
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between gap-3 text-sm">
        <span>{rotulo}</span>
        <span className="tabular-nums">
          {usado.toLocaleString('pt-BR')}
          {unidade}{' '}
          <span className="text-muted-foreground">
            de {total.toLocaleString('pt-BR')}
            {unidade}
          </span>
        </span>
      </div>
      <div className="bg-sunken h-2 overflow-hidden rounded-full" role="meter" aria-valuenow={usado} aria-valuemax={total} aria-label={rotulo}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: pct >= 90 ? 'var(--warning)' : 'color-mix(in oklab, var(--foreground) 65%, transparent)',
          }}
        />
      </div>
    </div>
  )
}
