import { WarningIcon, CheckIcon, ClockIcon, PlayIcon, SparkleIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import type { Responsavel, Tarefa } from '@/dados/tipos'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { rotuloStatus } from './rotulos'

export function StatusTarefaBadge({ tarefa }: { tarefa: Tarefa }) {
  if (tarefa.atrasada)
    return (
      <Badge variant="erro">
        <WarningIcon /> atrasada
      </Badge>
    )
  if (tarefa.status === 'aguardando_cliente')
    return (
      <Badge variant="destaque">
        <ClockIcon /> {rotuloStatus.aguardando_cliente}
        {tarefa.diasAguardando ? ` (${tarefa.diasAguardando} d)` : ''}
      </Badge>
    )
  if (tarefa.status === 'concluida')
    return (
      <Badge variant="sucesso">
        <CheckIcon /> concluída
      </Badge>
    )
  return <Badge variant={tarefa.status === 'em_andamento' ? 'default' : 'outline'}>{rotuloStatus[tarefa.status]}</Badge>
}

export function ResponsavelTarefa({ responsavel }: { responsavel?: Responsavel }) {
  const { integrante } = useTema()
  if (!responsavel) return <span className="text-muted-foreground text-xs">sem responsável</span>
  if (responsavel.tipo === 'integrante' && responsavel.setor) {
    const i = integrante(responsavel.setor)
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <Orb cor={i.cor} corOlhos={i.corOlhos} tamanho={18} extras={false} cutucavel={false} />
        {i.nome} <span className="text-muted-foreground">(integrante)</span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <Avatar nome={responsavel.nome} tamanho="sm" className="size-5" />
      {responsavel.nome}
    </span>
  )
}

/** Cartão de tarefa: usado no chat (cartão "Tarefa", 02 9.3) e em listas soltas. */
export function CartaoTarefa({
  tarefa,
  onAbrir,
  onIniciar,
  pedir,
  className,
}: {
  tarefa: Tarefa
  onAbrir?: () => void
  onIniciar?: () => void
  /** Pedir ao integrante do setor (trabalho simulado). */ pedir?: { nome: string; fazendo: boolean; pedir: () => void }
  className?: string
}) {
  return (
    <div className={cn('bg-card flex flex-col gap-3 rounded-xl border p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
            <span className="font-mono">{tarefa.codigo}</span>·<span className="truncate">{tarefa.cliente}</span>
          </div>
          <div className="text-sm font-medium">{tarefa.titulo}</div>
        </div>
        <StatusTarefaBadge tarefa={tarefa} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-xs">prazo {tarefa.prazo}</span>
          <ResponsavelTarefa responsavel={tarefa.responsavel} />
        </div>
        <div className="flex gap-1">
          {pedir &&
            (pedir.fazendo ? (
              <Button size="sm" variant="outline" disabled>
                <span className="border-foreground/30 border-t-foreground size-3.5 animate-spin rounded-full border-2" /> {pedir.nome} fazendo
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={pedir.pedir}>
                <SparkleIcon /> {tarefa.status === 'aguardando_cliente' ? `${pedir.nome} cobra` : `Pedir ao ${pedir.nome}`}
              </Button>
            ))}
          {onIniciar && tarefa.status === 'a_fazer' && !pedir?.fazendo && (
            <Button size="sm" variant="ghost" onClick={onIniciar}>
              <PlayIcon /> Eu faço
            </Button>
          )}
          {onAbrir && (
            <Button size="sm" variant="ghost" onClick={onAbrir}>
              Abrir
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
