import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useFluxos } from '@/ambiente/fluxos'
import { Button } from '@/components/ui/button'
import type { SetorIntegrante } from '@/theme/tipos'
import { Orb } from '@/components/ui/orb'
import type { StatusTarefa, Tarefa } from '@/dados/tipos'
import { cn } from '@/lib/utils'
import { ResponsavelTarefa, StatusTarefaBadge } from './cartao-tarefa'
import { rotuloStatus } from './rotulos'

type FiltroStatus = 'abertas' | StatusTarefa | 'todas'

interface Props {
  setor: string
  /** Nome do cliente selecionado; ausente = carteira. */
  cliente?: string
  tarefas: Tarefa[]
  onAbrir?: (t: Tarefa) => void
  onNova?: () => void
  className?: string
  /** Dentro de um widget: sem casca, título e recolher (a caixa do widget já dá isso). */
  semCasca?: boolean
}

const opcoesStatus: { valor: FiltroStatus; rotulo: string }[] = [
  { valor: 'abertas', rotulo: 'abertas' },
  { valor: 'a_fazer', rotulo: rotuloStatus.a_fazer },
  { valor: 'em_andamento', rotulo: rotuloStatus.em_andamento },
  { valor: 'aguardando_cliente', rotulo: rotuloStatus.aguardando_cliente },
  { valor: 'concluida', rotulo: rotuloStatus.concluida },
  { valor: 'todas', rotulo: 'todas' },
]

/** Bloco fixo "Tarefas deste setor", igual em todas as abas (subplano 03, 2.4). */
export function BlocoTarefas({ setor, cliente, tarefas, onAbrir: abrirFora, onNova: novaFora, className, semCasca, setorId }: Props & { setorId?: SetorIntegrante }) {
  const fluxos = useFluxos()
  const onAbrir = abrirFora ?? ((t: Tarefa) => fluxos.abrirTarefa(t.id))
  const onNova = novaFora ?? (() => fluxos.novaTarefa({ cliente, setor: setorId ?? tarefas[0]?.setor ?? 'fiscal' }))
  const [aberto, setAberto] = useState(true)
  const [status, setStatus] = useState<FiltroStatus>('abertas')
  const [responsavel, setResponsavel] = useState('todos')

  const responsaveis = useMemo(() => Array.from(new Set(tarefas.map((t) => t.responsavel?.nome).filter(Boolean))) as string[], [tarefas])

  const visiveis = tarefas.filter((t) => {
    if (status === 'abertas' && t.status === 'concluida') return false
    if (status !== 'abertas' && status !== 'todas' && t.status !== status) return false
    if (responsavel !== 'todos' && t.responsavel?.nome !== responsavel) return false
    return true
  })

  return (
    <section className={cn('@container', !semCasca && 'bg-card rounded-xl border', className)}>
      <header className={cn('flex flex-wrap items-center gap-2', semCasca ? 'pb-1.5' : 'border-b px-4 py-3')}>
        {!semCasca && (
          <button type="button" onClick={() => setAberto((v) => !v)} className="flex cursor-pointer items-center gap-2 text-sm font-semibold" aria-expanded={aberto}>
            <CaretDownIcon className={cn('size-4 transition-transform', !aberto && '-rotate-90')} />
            Tarefas deste setor
            <span className="text-muted-foreground font-normal">
              · {setor} · {cliente ?? 'Carteira'}
            </span>
          </button>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Filtro compacto={semCasca} rotulo="Responsável" valor={responsavel} onChange={setResponsavel} opcoes={[{ valor: 'todos', rotulo: 'todos' }, ...responsaveis.map((r) => ({ valor: r, rotulo: r }))]} />
          <Filtro compacto={semCasca} rotulo="Status" valor={status} onChange={(v) => setStatus(v as FiltroStatus)} opcoes={opcoesStatus} />
          {semCasca ? (
            <Button size="icon-sm" variant="outline" onClick={onNova} aria-label="Nova tarefa" title="Nova tarefa">
              <PlusIcon />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onNova}>
              <PlusIcon /> Nova
            </Button>
          )}
        </div>
      </header>
      {(aberto || semCasca) && (
        <ul className={cn('divide-y', semCasca && '-mx-2')}>
          {visiveis.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onAbrir?.(t)}
                className={cn(
                  'hover:bg-accent/60 grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-2.5 text-left @2xl:grid-cols-[minmax(0,1fr)_5rem_4.5rem_11rem_9.5rem]',
                  semCasca ? 'rounded-[12px] px-2' : 'px-4',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{t.titulo}</span>
                  {!cliente && <span className="text-muted-foreground block truncate text-xs">{t.cliente}</span>}
                </span>
                <span className="text-muted-foreground hidden font-mono text-xs @2xl:block">{t.codigo}</span>
                <span className={cn('hidden text-xs @2xl:block', t.atrasada ? 'text-destructive font-medium' : 'text-muted-foreground')}>{t.prazo}</span>
                <span className="hidden @2xl:block">
                  <ResponsavelTarefa responsavel={t.responsavel} />
                </span>
                <span className="flex items-center justify-end gap-2">
                  {t.cartaoPendente && <Orb reacao="needs" tamanho={16} extras={false} cutucavel={false} cor="var(--warning)" rotulo="Cartão pendente" />}
                  <StatusTarefaBadge tarefa={t} />
                </span>
              </button>
            </li>
          ))}
          {visiveis.length === 0 && (
            <li className="text-muted-foreground px-4 py-8 text-center text-sm">
              Nenhuma tarefa {status === 'abertas' ? 'aberta ' : ''}deste setor para {cliente ?? 'a carteira'}.
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

function Filtro({ rotulo, valor, onChange, opcoes, compacto }: { rotulo: string; valor: string; onChange: (v: string) => void; opcoes: { valor: string; rotulo: string }[]; compacto?: boolean }) {
  return (
    <label className={cn('hover:bg-accent relative flex h-8 items-center gap-1 rounded-md border px-2 text-xs', compacto && 'h-7')}>
      <span className={cn('text-muted-foreground', compacto && 'sr-only')}>{rotulo}:</span>
      <select value={valor} onChange={(e) => onChange(e.target.value)} className="cursor-pointer appearance-none bg-transparent pr-4 font-medium outline-none">
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      <CaretDownIcon className="text-muted-foreground pointer-events-none absolute right-1.5 size-3" />
    </label>
  )
}
