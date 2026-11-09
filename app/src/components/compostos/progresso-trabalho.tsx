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
 *
 * É um cartão só, do começo ao fim: quando termina, o orb passa ao estado de
 * concluído, os textos trocam com um esmaecer, a barra fica verde e as etapas
 * ganham o check. Nada muda de tamanho nem de lugar.
 */
export function ProgressoTrabalho({ trabalho: t, compacto, className }: { trabalho: Trabalho; compacto?: boolean; className?: string }) {
  const aparencia = useAparencia()
  const [agora, setAgora] = useState(Date.now())
  const concluido = t.situacao === 'concluido'
  useEffect(() => {
    if (concluido) return
    const id = window.setInterval(() => setAgora(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [concluido])
  const dur = duracaoTrabalho(t)
  const preparando = !concluido && agora < t.inicioEm
  const pct = concluido ? 1 : Math.max(0, Math.min(1, (agora - t.inicioEm) / dur))
  const atual = concluido ? t.etapas.length : preparando ? -1 : Math.min(t.etapas.length - 1, Math.floor((agora - t.inicioEm) / (t.seg * 1000)))
  const quem = integrantes.find((i) => i.id === t.integrante)
  const ap = quem ? aparencia(quem) : undefined
  const nome = ap?.nome ?? 'Integrante'
  const fim = t.fimEm ? new Date(t.fimEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
  const cliente = t.cliente ? `${t.cliente} · ` : ''
  return (
    <div role="status" aria-live="polite" data-concluido={concluido || undefined} className={cn('bg-surface shadow-cartao flex flex-col gap-3 rounded-[20px] p-4', className)}>
      <div className="flex items-center gap-3">
        {ap && <Orb cor={ap.cor} corOlhos={ap.corOlhos} estado={concluido ? 'concluido' : 'trabalhando'} tamanho={compacto ? 28 : 36} animado modo="drift" extras={false} cutucavel={false} />}
        <div className="min-w-0 flex-1">
          <Troca ligado={concluido} className="text-sm font-medium" antes={`${nome} está fazendo: ${t.titulo}`} depois={`${nome} fez: ${t.titulo}`} />
          <Troca
            ligado={concluido}
            className="text-muted-foreground text-xs"
            antes={cliente + (preparando ? 'preparando…' : pct >= 1 ? 'escrevendo o resultado…' : `etapa ${atual + 1} de ${t.etapas.length}`)}
            depois={`${cliente}${t.etapas.length} de ${t.etapas.length} etapas${fim ? ` · concluído às ${fim}` : ''}`}
          />
        </div>
        <span className="grid shrink-0 justify-items-end text-xs">
          <span className={cn('text-muted-foreground tabular-nums transition-opacity duration-300 [grid-area:1/1]', concluido && 'opacity-0')}>{Math.round(pct * 100)}%</span>
          <span className={cn('text-success flex items-center gap-1 font-medium transition-[opacity,translate] duration-500 [grid-area:1/1]', concluido ? 'opacity-100' : 'translate-y-1 opacity-0')}>
            <CheckIcon className="size-4" weight="bold" /> Concluído
          </span>
        </span>
      </div>
      <div className="bg-sunken h-1.5 overflow-hidden rounded-full">
        <div className={cn('h-full rounded-full transition-[width,background-color] ease-linear', concluido ? 'bg-success/70 duration-500' : 'bg-foreground/70 duration-200')} style={{ width: `${pct * 100}%` }} />
      </div>
      {!compacto && (
        <ol className="flex flex-col gap-1.5 text-sm">
          {t.etapas.map((e, i) => (
            <li key={e} className={cn('flex items-center gap-2 transition-colors duration-300', i > atual && 'text-muted-foreground/60', i < atual && 'text-muted-foreground')}>
              <span className="grid size-4 shrink-0 place-items-center">
                {i < atual ? (
                  <CheckIcon className="text-success entra-check size-4" weight="bold" />
                ) : i === atual ? (
                  <span className="border-foreground/30 border-t-foreground size-3.5 animate-spin rounded-full border-2" />
                ) : (
                  <span className="bg-foreground/20 size-1.5 rounded-full" />
                )}
              </span>
              {e}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/** Dois textos na mesma célula: troca de um para o outro com um esmaecer, sem mudar a altura da linha. */
function Troca({ ligado, antes, depois, className }: { ligado: boolean; antes: string; depois: string; className?: string }) {
  return (
    <div className={cn('grid', className)}>
      <span aria-hidden={ligado || undefined} className={cn('truncate transition-[opacity,translate] duration-300 [grid-area:1/1]', ligado && '-translate-y-1 opacity-0')}>
        {antes}
      </span>
      <span aria-hidden={!ligado || undefined} className={cn('truncate transition-[opacity,translate] delay-100 duration-400 [grid-area:1/1]', !ligado && 'translate-y-1 opacity-0')}>
        {depois}
      </span>
    </div>
  )
}
