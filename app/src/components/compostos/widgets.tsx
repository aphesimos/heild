import { useFluxos } from '@/ambiente/fluxos'
import { useNavegacao, type Destino } from '@/ambiente/loja'
import { WarningIcon, ArrowRightIcon, CheckIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { EventoLinhaDoTempo, Indicador, ItemAgenda, Pendencia } from '@/dados/tipos'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { useTamanhoWidget } from '@/components/widgets/widget'

/** Conteúdo de um indicador (KPI): número grande; com espaço, o detalhe em texto. */
export function ConteudoIndicador({ indicador: i }: { indicador: Indicador }) {
  const t = useTamanhoWidget()
  return (
    <div className="flex h-full flex-col justify-end gap-0.5">
      <span className="font-heading text-4xl leading-none font-light tracking-tight tabular-nums baixa:text-3xl">{i.valor}</span>
      {i.detalhe && (
        <span className={cn('text-muted-foreground flex items-center gap-1 text-xs', t === 'P' && 'truncate')}>
          {i.tom === 'atencao' && <WarningIcon className="text-warning size-3.5 shrink-0" aria-label="atenção" />}
          {i.tom === 'bom' && <CheckIcon className="text-success size-3.5 shrink-0" aria-label="bom" />}
          <span className="truncate">{i.detalhe}</span>
        </span>
      )}
    </div>
  )
}

/** Medidor de uma razão contra o total (entregues × obrigações do mês). */
export function Medidor({ rotulo, valor, total }: { rotulo: string; valor: number; total: number }) {
  const pct = Math.round((valor / total) * 100)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span>{rotulo}</span>
        <span className="tabular-nums">
          <strong className="font-medium">{valor}</strong>{' '}
          <span className="text-muted-foreground">
            de {total} · {pct}%
          </span>
        </span>
      </div>
      <div className="bg-sunken h-2 overflow-hidden rounded-full" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={valor} aria-label={rotulo}>
        <div className="bg-foreground/75 h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/** Semana de tarefas e obrigações; cada item mostra o setor em texto ao lado da cor. */
export function CalendarioSemana({ dias, itens, hoje, colunas = 5 }: { dias: { dia: number; rotulo: string }[]; itens: ItemAgenda[]; hoje?: number; colunas?: number }) {
  const { integrante } = useTema()
  const nav = useNavegacao()
  const abaDe = (s: ItemAgenda['setor']) => (s === 'consultor' ? 'consultoria' : s === 'gestao_atendimento' ? 'gestao' : s === 'geral' || s === 'financeiro_escritorio' ? 'obrigacoes' : s)
  return (
    <div className={cn('grid gap-2', colunas === 5 && 'min-w-[540px]')} style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}>
      {dias.map((d) => (
        <div key={d.dia} className="flex min-w-0 flex-col gap-2">
          <div className={cn('flex items-baseline gap-1.5 px-1 text-sm', d.dia === hoje ? 'text-foreground font-medium' : 'text-muted-foreground')}>
            <span>{d.rotulo}</span>
            <span className={cn('tabular-nums', d.dia === hoje && 'bg-primary text-primary-foreground rounded-full px-1.5')}>{d.dia}</span>
          </div>
          {itens
            .filter((i) => i.dia === d.dia)
            .map((i) => {
              const s = integrante(i.setor)
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => nav.irPara({ modulo: 'painel', aba: abaDe(i.setor) })}
                  className={cn('bg-raised hover:bg-raised/70 flex cursor-pointer flex-col gap-0.5 rounded-[14px] px-2.5 py-2 text-left text-xs transition-colors', i.atrasada && 'ring-destructive/60 ring-1')}
                >
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: s.cor }} aria-hidden />
                    <span className="truncate">{s.nome}</span>
                    {i.atrasada && <WarningIcon className="text-destructive ml-auto size-3 shrink-0" aria-label="atrasada" />}
                  </span>
                  <span className="text-foreground line-clamp-2 font-medium">
                    {i.titulo}
                    {i.quantidade ? <span className="text-muted-foreground font-normal"> × {i.quantidade}</span> : null}
                  </span>
                </button>
              )
            })}
        </div>
      ))}
    </div>
  )
}

/** Pendências por cliente (CTB-201), com cobrar. */
export function PendenciasClientes({ itens, onCobrar: cobrarFora }: { itens: Pendencia[]; onCobrar?: (p: Pendencia) => void }) {
  const fluxos = useFluxos()
  const setorDe = (item: string) => (/extrato|balancete/.test(item) ? 'contabil' : /ponto|folha|admiss/.test(item) ? 'dp' : /contrato social|certificado/.test(item) ? 'societario' : 'fiscal')
  const onCobrar = cobrarFora ?? ((p: Pendencia) => fluxos.cobrar({ cliente: p.cliente, setor: setorDe(p.item), texto: '', assunto: p.item }))
  return (
    <ul className="divide-border/70 flex flex-col divide-y">
      {itens.map((p) => (
        <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{p.cliente}</div>
            <div className="text-muted-foreground truncate text-xs">
              {p.item} · há {p.dias} dias · {p.cobrancas} {p.cobrancas === 1 ? 'cobrança' : 'cobranças'}
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => onCobrar?.(p)}>
            <PaperPlaneTiltIcon /> Cobrar
          </Button>
        </li>
      ))}
    </ul>
  )
}

/** Últimos eventos do cliente selecionado. */
export function LinhaDoTempo({ itens }: { itens: EventoLinhaDoTempo[] }) {
  return (
    <ol className="relative flex flex-col gap-4 pl-4">
      <span className="bg-border absolute top-1 bottom-1 left-[3px] w-px" aria-hidden />
      {itens.map((e) => (
        <li key={e.id} className="relative">
          <span className="bg-muted-foreground absolute top-1.5 -left-4 size-[7px] rounded-full" aria-hidden />
          <div className="text-sm">{e.texto}</div>
          <div className="text-muted-foreground text-xs">
            {e.hora} · {e.ator}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function LinkWidget({ children, onClick, destino }: { children: ReactNode; onClick?: () => void; destino?: Destino }) {
  const nav = useNavegacao()
  return (
    <Button size="sm" variant="link" className="text-muted-foreground h-auto px-0" onClick={onClick ?? (destino ? () => nav.irPara(destino) : undefined)}>
      {children} <ArrowRightIcon />
    </Button>
  )
}
