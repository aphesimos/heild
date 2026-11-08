import { ArrowRightIcon } from '@phosphor-icons/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip } from '@/components/ui/tooltip'
import type { LimiteUso } from '@/dados/tipos'
import { cn } from '@/lib/utils'

/** Faixa de alerta: até 79% normal, 80 a 94% atenção, 95% ou mais esgotando. */
function tom(usado: number) {
  return usado >= 95 ? 'esgotado' : usado >= 80 ? 'atencao' : 'normal'
}

const corTraco = { normal: 'var(--highlight)', atencao: 'var(--highlight)', esgotado: 'var(--destructive)' }

/** Anel de progresso com o limite mais consumido. */
function Anel({ usado, tamanho = 20 }: { usado: number; tamanho?: number }) {
  const r = (tamanho - 4) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`} className="-rotate-90" aria-hidden>
      <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke="var(--sunken-end)" strokeWidth={2.5} />
      <circle
        cx={tamanho / 2}
        cy={tamanho / 2}
        r={r}
        fill="none"
        stroke={corTraco[tom(usado)]}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(usado, 100) / 100)}
        className="transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  )
}

/**
 * Botão de limite de uso do plano, ao lado do campo do chat (referência: o do
 * Claude). Anel com o limite mais consumido; ao passar o mouse, o resumo;
 * ao clicar, todos os limites com barra e quando renovam.
 */
export function BotaoLimiteUso({ limites, plano, onVerTudo, className, tamanhoAnel }: { limites: LimiteUso[]; plano?: string; onVerTudo?: () => void; className?: string; tamanhoAnel?: number }) {
  const maior = limites.reduce((a, b) => (b.usado > a.usado ? b : a), limites[0])
  if (!maior) return null
  return (
    <Popover>
      <Tooltip
        lado="top"
        conteudo={
          <span className="flex flex-col">
            <span>
              {maior.usado}% do {maior.rotulo.toLowerCase()}
            </span>
            <span className="opacity-70">Renova {maior.renova}</span>
          </span>
        }
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Limites de uso: ${maior.usado}% do ${maior.rotulo.toLowerCase()}`}
            className={cn('hover:bg-raised flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors', className)}
          >
            <Anel usado={maior.usado} tamanho={tamanhoAnel} />
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent side="top" align="end" className="w-80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Limites de uso{plano ? ` · ${plano}` : ''}</span>
          <button type="button" onClick={onVerTudo} className="hover:text-foreground text-muted-foreground flex cursor-pointer items-center gap-1 text-sm">
            Ver tudo <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {limites.map((l) => (
            <li key={l.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate">{l.rotulo}</span>
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                  Renova {l.renova} · <span className="text-foreground">{l.usado}%</span>
                </span>
              </div>
              <div className="bg-sunken h-1.5 overflow-hidden rounded-full" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={l.usado} aria-label={l.rotulo}>
                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(l.usado, 100)}%`, background: corTraco[tom(l.usado)] }} />
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
