import { CheckIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { duracaoTrabalho, type Trabalho } from '@/ambiente/loja'
import { Orb } from '@/components/ui/orb'
import { useAparencia } from '@/hooks/useAparencia'
import { integrantes } from '@/dados/exemplo'
import { cn } from '@/lib/utils'

/**
 * O integrante "fazendo" (trabalho simulado da demonstração): as etapas com o
 * que já foi feito, a atual animada e a barra de progresso. O progresso sai do
 * relógio, então trocar de aba e voltar mostra o ponto certo.
 */
/** Depois de pronto, o cartão fica no chat como registro: quem fez, o quê e quando terminou. */
function TrabalhoConcluido({ trabalho: t, className }: { trabalho: Trabalho; className?: string }) {
  const aparencia = useAparencia()
  const quem = integrantes.find((i) => i.id === t.integrante)
  const ap = quem ? aparencia(quem) : undefined
  const fim = t.fimEm ? new Date(t.fimEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <div role="status" className={cn('bg-surface shadow-cartao flex flex-col gap-3 rounded-[20px] p-4', className)}>
      <div className="flex items-center gap-3">
        {ap && <Orb cor={ap.cor} corOlhos={ap.corOlhos} estado="concluido" tamanho={28} extras={false} cutucavel={false} />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {ap?.nome ?? 'Integrante'} fez: {t.titulo}
          </div>
          <div className="text-muted-foreground truncate text-xs">
            {t.cliente ? `${t.cliente} · ` : ''}
            {t.etapas.length} de {t.etapas.length} etapas{fim ? ` · concluído às ${fim}` : ''}
          </div>
        </div>
        <span className="text-success flex items-center gap-1 text-xs font-medium">
          <CheckIcon className="size-4" weight="bold" /> Concluído
        </span>
      </div>
      <div className="bg-success/70 h-1.5 rounded-full" />
      <details className="group text-sm">
        <summary className="text-muted-foreground hover:text-foreground w-fit cursor-pointer list-none text-xs underline-offset-4 hover:underline">
          <span className="group-open:hidden">ver as etapas</span>
          <span className="hidden group-open:inline">esconder as etapas</span>
        </summary>
        <ol className="text-muted-foreground mt-2 flex flex-col gap-1.5">
          {t.etapas.map((e) => (
            <li key={e} className="flex items-center gap-2">
              <CheckIcon className="text-success size-4 shrink-0" weight="bold" />
              {e}
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}

export function ProgressoTrabalho({ trabalho: t, compacto, className }: { trabalho: Trabalho; compacto?: boolean; className?: string }) {
  const aparencia = useAparencia()
  const [agora, setAgora] = useState(Date.now())
  const concluido = t.situacao === 'concluido'
  useEffect(() => {
    if (concluido) return
    const id = window.setInterval(() => setAgora(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [concluido])
  if (concluido) return <TrabalhoConcluido trabalho={t} className={className} />
  const dur = duracaoTrabalho(t)
  const preparando = agora < t.inicioEm
  const pct = Math.max(0, Math.min(1, (agora - t.inicioEm) / dur))
  const atual = preparando ? -1 : Math.min(t.etapas.length - 1, Math.floor((agora - t.inicioEm) / (t.seg * 1000)))
  const quem = integrantes.find((i) => i.id === t.integrante)
  const ap = quem ? aparencia(quem) : undefined
  return (
    <div role="status" aria-live="polite" className={cn('bg-surface shadow-cartao flex flex-col gap-3 rounded-[20px] p-4', className)}>
      <div className="flex items-center gap-3">
        {ap && <Orb cor={ap.cor} corOlhos={ap.corOlhos} estado="trabalhando" tamanho={compacto ? 28 : 36} animado modo="drift" cutucavel={false} />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {ap?.nome ?? 'Integrante'} está fazendo: {t.titulo}
          </div>
          <div className="text-muted-foreground truncate text-xs">
            {t.cliente ? `${t.cliente} · ` : ''}
            {preparando ? 'preparando…' : pct >= 1 ? 'escrevendo o resultado…' : `etapa ${atual + 1} de ${t.etapas.length}`}
          </div>
        </div>
        <span className="text-muted-foreground text-xs tabular-nums">{Math.round(pct * 100)}%</span>
      </div>
      <div className="bg-sunken h-1.5 overflow-hidden rounded-full">
        <div className="bg-foreground/70 h-full rounded-full transition-[width] duration-200 ease-linear" style={{ width: `${pct * 100}%` }} />
      </div>
      {!compacto && (
        <ol className="flex flex-col gap-1.5 text-sm">
          {t.etapas.map((e, i) => (
            <li key={e} className={cn('flex items-center gap-2', i > atual && 'text-muted-foreground/60', i < atual && 'text-muted-foreground')}>
              {i < atual ? (
                <CheckIcon className="text-success size-4 shrink-0" weight="bold" />
              ) : i === atual ? (
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <span className="border-foreground/30 border-t-foreground size-3.5 animate-spin rounded-full border-2" />
                </span>
              ) : (
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <span className="bg-foreground/20 size-1.5 rounded-full" />
                </span>
              )}
              {e}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
