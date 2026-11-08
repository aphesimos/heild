import { ArrowsOutCardinalIcon, MinusIcon } from '@phosphor-icons/react'
import { createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { dimensoes, type DefWidget, type TamanhoWidget } from './tipos'

const ContextoTamanho = createContext<TamanhoWidget>('M')

/** Tamanho do widget em que o componente está; para o conteúdo se adaptar. */
export function useTamanhoWidget() {
  return useContext(ContextoTamanho)
}

/** Verdadeiro se o tamanho atual é pelo menos tão largo/alto quanto o pedido. */
export function cabe(tamanho: TamanhoWidget, { colunas = 1, linhas = 1 }: { colunas?: number; linhas?: number }) {
  const d = dimensoes[tamanho]
  return d.colunas >= colunas && d.linhas >= linhas
}

interface Props {
  def: DefWidget
  tamanho: TamanhoWidget
  editando?: boolean
  arrastando?: boolean
  onRemover?: () => void
  onTamanho?: (t: TamanhoWidget) => void
  className?: string
  /** Alça de arraste (atributos e eventos do dnd-kit), aplicada ao widget inteiro no modo edição. */
  alca?: Record<string, unknown>
}

/**
 * A caixa de todo widget: mesma superfície, raio, respiro e cabeçalho.
 * No modo edição treme levemente, ganha o botão de esconder e a escolha de tamanho.
 */
export function Widget({ def, tamanho, editando, arrastando, onRemover, onTamanho, className, alca }: Props) {
  const Icone = def.icone
  return (
    <ContextoTamanho.Provider value={tamanho}>
      <article
        aria-label={def.titulo}
        className={cn(
          'bg-surface shadow-cartao relative flex h-full min-h-0 flex-col gap-3 rounded-[24px] p-4 transition-shadow',
          editando && 'widget-tremendo cursor-grab touch-none select-none active:cursor-grabbing',
          arrastando && 'opacity-40',
          className,
        )}
        {...(editando ? alca : {})}
      >
        <header className="flex h-6 shrink-0 items-center gap-2">
          {Icone && <Icone weight="duotone" className="text-muted-foreground size-[18px] shrink-0" />}
          <h3 className="min-w-0 truncate text-sm font-medium">{def.titulo}</h3>
          <span className="min-w-0 flex-1 truncate">
            {def.atividades && tamanho !== 'P' && !editando && <code className="text-muted-foreground hidden text-[11px] sm:inline">{def.atividades}</code>}
          </span>
          {!editando && def.acao}
          {editando && <ArrowsOutCardinalIcon className="text-muted-foreground size-4" aria-hidden />}
        </header>
        <div className={cn('@container min-h-0 flex-1 overflow-auto', editando && 'pointer-events-none')}>{def.conteudo(tamanho)}</div>

        {editando && (
          <>
            <button
              type="button"
              onClick={onRemover}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Esconder ${def.titulo}`}
              className="bg-foreground text-background shadow-pilula absolute -top-2 -left-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full"
            >
              <MinusIcon weight="bold" className="size-3.5" />
            </button>
            {def.tamanhos.length > 1 && (
              <div
                className="bg-raised shadow-pilula absolute right-3 bottom-3 z-10 flex gap-0.5 rounded-full p-0.5"
                onPointerDown={(e) => e.stopPropagation()}
                role="radiogroup"
                aria-label={`Tamanho de ${def.titulo}`}
              >
                {def.tamanhos.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={t === tamanho}
                    title={dimensoes[t].rotulo}
                    onClick={() => onTamanho?.(t)}
                    className={cn('h-6 min-w-7 cursor-pointer rounded-full px-1.5 text-[11px] font-medium', t === tamanho ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </article>
    </ContextoTamanho.Provider>
  )
}

/** Estado vazio padrão de conteúdo de widget. */
export function VazioWidget({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground flex h-full items-center justify-center px-2 text-center text-sm">{children}</p>
}
