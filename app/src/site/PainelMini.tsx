import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, MinusIcon, PencilSimpleIcon, PlusIcon, type Icon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ReservaAltura } from './Estavel'

/**
 * Uma versão pequena do Painel para o site: um quadro limpo, as abas, de dois
 * a quatro widgets por aba com os dados de exemplo e o modo Editar do produto
 * (esconder, trocar o tamanho, arrastar e devolver da galeria). Sem barra
 * lateral, sem cabeçalho de cliente completo: só o que explica a ideia.
 */

/** P ocupa meia largura; G, a largura toda (no celular, os dois ocupam a linha). */
export type TamanhoMini = 'P' | 'G'

export interface WidgetMini {
  id: string
  titulo: string
  icone?: Icon
  tamanhos?: TamanhoMini[]
  conteudo: (t: TamanhoMini) => ReactNode
}

export interface AbaMini {
  id: string
  rotulo: string
  /** Linha abaixo do título do quadro (de quem são os dados). */
  sub: string
  widgets: WidgetMini[]
  /** Arranjo inicial: os que aparecem, na ordem, e o tamanho. Os outros ficam na galeria. */
  padrao: { id: string; tamanho: TamanhoMini }[]
}

interface Props {
  abas: AbaMini[]
  /** Aba controlada de fora (a lista ao lado do quadro anda junto); as abas ficam sempre em cima do quadro. */
  aba?: string
  onAba?: (id: string) => void
  rotulo: string
  className?: string
}

const rotuloTamanho: Record<TamanhoMini, string> = { P: 'Meia largura', G: 'Largura toda' }

export function PainelMini({ abas, aba: abaFora, onAba, rotulo, className }: Props) {
  const [abaDentro, setAbaDentro] = useState(abas[0].id)
  const abaId = abaFora ?? abaDentro
  const aba = abas.find((a) => a.id === abaId) ?? abas[0]
  const [arranjos, setArranjos] = useState<Record<string, AbaMini['padrao']>>({})
  const [editando, setEditando] = useState(false)
  const [tocouEditar, setTocouEditar] = useState(false)
  const arranjo = arranjos[aba.id] ?? aba.padrao
  const mudar = (f: (a: AbaMini['padrao']) => AbaMini['padrao']) => setArranjos((x) => ({ ...x, [aba.id]: f(x[aba.id] ?? aba.padrao) }))
  const ocultos = aba.widgets.filter((w) => !arranjo.some((i) => i.id === w.id))
  const sensores = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const soltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    mudar((a) => arrayMove(a, a.findIndex((i) => i.id === active.id), a.findIndex((i) => i.id === over.id)))
  }
  const trocarAba = (id: string) => {
    setAbaDentro(id)
    onAba?.(id)
  }
  const mexido = !!arranjos[aba.id]

  return (
    <div data-luz className={cn('painel-mini bg-background shadow-painel flex min-w-0 flex-col gap-3 rounded-[28px] p-3 sm:min-h-[500px] sm:p-4', className)} aria-label={rotulo} role="region">
      {(
        <div role="tablist" aria-label="Abas do Painel" className="bg-sunken inset-shadow-trilho sem-barra abas-mini flex gap-0.5 overflow-x-auto rounded-full p-[3px]">
          {abas.map((a) => (
            <button
              key={a.id}
              role="tab"
              type="button"
              aria-selected={a.id === aba.id}
              onClick={() => trocarAba(a.id)}
              className={cn('shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors', a.id === aba.id ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground hover:text-foreground')}
            >
              {a.rotulo}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 px-1 pt-1">
        <div key={aba.id} className="entra flex min-w-0 flex-1 flex-col">
          <h3 className="font-heading truncate text-xl font-light tracking-[-0.02em]">{aba.rotulo}</h3>
          <p className="text-muted-foreground truncate text-sm">{aba.sub}</p>
        </div>
        {editando && mexido && (
          <button type="button" onClick={() => setArranjos((x) => ({ ...x, [aba.id]: aba.padrao }))} className="text-muted-foreground hover:text-foreground sublinha hidden cursor-pointer text-sm sm:inline">
            Voltar ao padrão
          </button>
        )}
        <button
          type="button"
          aria-pressed={editando}
          onClick={() => (setEditando((v) => !v), setTocouEditar(true))}
          className={cn('botao flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm', editando ? 'bg-primary text-primary-foreground' : 'bg-surface shadow-contorno hover:bg-raised', !tocouEditar && 'editar-chama')}
        >
          {editando ? <CheckIcon className="size-4" weight="bold" /> : <PencilSimpleIcon className="size-4" />}
          {editando ? 'Pronto' : 'Editar'}
        </button>
      </div>

      {/* As outras abas medem junto: o quadro tem a altura da aba mais alta e trocar de aba não mexe a seção. */}
      <ReservaAltura variantes={abas.filter((x) => x.id !== aba.id).map((x) => <GradeEstatica key={x.id} aba={x} />)}>
      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={soltar}>
        <SortableContext items={arranjo.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div key={aba.id} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {arranjo.map((item, i) => {
              const def = aba.widgets.find((w) => w.id === item.id)
              if (!def) return null
              return (
                <CaixaMini
                  key={item.id}
                  def={def}
                  tamanho={item.tamanho}
                  i={i}
                  editando={editando}
                  onEsconder={() => mudar((a) => a.filter((x) => x.id !== item.id))}
                  onTamanho={(t) => mudar((a) => a.map((x) => (x.id === item.id ? { ...x, tamanho: t } : x)))}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
      </ReservaAltura>

      {editando && (
        <div className="entra flex flex-wrap items-center gap-2 px-1 pb-1">
          {ocultos.length ? (
            ocultos.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => mudar((a) => [...a, { id: w.id, tamanho: (w.tamanhos ?? ['P', 'G'])[0] }])}
                className="botao bg-surface shadow-contorno hover:bg-raised flex h-9 cursor-pointer items-center gap-1.5 rounded-full pr-3.5 pl-2.5 text-sm"
              >
                <PlusIcon className="size-4" weight="bold" />
                {w.titulo}
              </button>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">Todos os widgets desta aba estão no Painel.</span>
          )}
        </div>
      )}
    </div>
  )
}

/** A aba no arranjo padrão, só para medir (sem arrastar nem editar). */
function GradeEstatica({ aba }: { aba: AbaMini }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {aba.padrao.map((item) => {
        const def = aba.widgets.find((w) => w.id === item.id)
        if (!def) return null
        return (
          <div key={item.id} className={cn('min-w-0', item.tamanho === 'G' && 'sm:col-span-2')}>
            <article className="relative flex h-full min-h-[132px] flex-col gap-3 rounded-[20px] p-4">
              <header className="flex h-5 items-center gap-2">
                <h4 className="text-sm font-medium">{def.titulo}</h4>
              </header>
              <div className="min-h-0 flex-1">{def.conteudo(item.tamanho)}</div>
            </article>
          </div>
        )
      })}
    </div>
  )
}

function CaixaMini({ def, tamanho, i, editando, onEsconder, onTamanho }: { def: WidgetMini; tamanho: TamanhoMini; i: number; editando: boolean; onEsconder: () => void; onTamanho: (t: TamanhoMini) => void }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: def.id, disabled: !editando })
  const Ic = def.icone
  const tamanhos = def.tamanhos ?? ['P', 'G']
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition, ['--i' as string]: i }} className={cn('mini-entra min-w-0', tamanho === 'G' && 'sm:col-span-2', isDragging && 'relative z-20')}>
      <article
        aria-label={def.titulo}
        className={cn(
          'bg-surface shadow-cartao mini-widget relative flex h-full min-h-[132px] flex-col gap-3 rounded-[20px] p-4',
          editando && 'widget-tremendo cursor-grab touch-none select-none active:cursor-grabbing',
          isDragging && 'shadow-painel opacity-90',
        )}
        {...(editando ? { ...attributes, ...listeners } : {})}
      >
        <header className="flex h-5 items-center gap-2">
          {Ic && <Ic weight="duotone" className="text-muted-foreground size-[18px] shrink-0" />}
          <h4 className="min-w-0 truncate text-sm font-medium">{def.titulo}</h4>
        </header>
        <div className={cn('min-h-0 flex-1', editando && 'pointer-events-none')}>{def.conteudo(tamanho)}</div>
        {editando && (
          <>
            <button
              type="button"
              onClick={onEsconder}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Esconder ${def.titulo}`}
              className="bg-foreground text-background shadow-pilula absolute -top-2 -left-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full"
            >
              <MinusIcon weight="bold" className="size-3.5" />
            </button>
            {tamanhos.length > 1 && (
              <div role="radiogroup" aria-label={`Tamanho de ${def.titulo}`} onPointerDown={(e) => e.stopPropagation()} className="bg-raised shadow-pilula absolute top-3 right-3 z-10 hidden gap-0.5 rounded-full p-0.5 sm:flex">
                {tamanhos.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={t === tamanho}
                    aria-label={rotuloTamanho[t]}
                    title={rotuloTamanho[t]}
                    onClick={() => onTamanho(t)}
                    className={cn('flex h-6 w-8 cursor-pointer items-center justify-center rounded-full', t === tamanho ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >
                    <span aria-hidden className={cn('h-2.5 rounded-[3px] border border-current', t === 'P' ? 'w-2.5' : 'w-4')} />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </article>
    </div>
  )
}

/* ---------------- peças de conteúdo dos widgets ---------------- */

/** Linha de lista: texto à esquerda, detalhe à direita. */
export function LinhaMini({ children, detalhe, className }: { children: ReactNode; detalhe?: ReactNode; className?: string }) {
  return (
    <li className={cn('flex min-w-0 items-center gap-2.5 text-sm', className)}>
      <span className="flex min-w-0 flex-1 items-center gap-2.5">{children}</span>
      {detalhe !== undefined && <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{detalhe}</span>}
    </li>
  )
}

/** Barra de progresso que se enche ao aparecer. */
export function BarraMini({ valor, max = 100, tom = 'neutro', i = 0, rotulo }: { valor: number; max?: number; tom?: 'neutro' | 'atencao' | 'erro' | 'ok'; i?: number; rotulo: string }) {
  const p = Math.max(0, Math.min(100, (valor / max) * 100))
  const cor = { neutro: 'bg-foreground/70', atencao: 'bg-warning', erro: 'bg-destructive', ok: 'bg-success' }[tom]
  return (
    <div className="bg-sunken h-1.5 overflow-hidden rounded-full" role="meter" aria-label={rotulo} aria-valuenow={valor} aria-valuemin={0} aria-valuemax={max}>
      <div className={cn('mini-barra h-full rounded-full', cor)} style={{ width: `${p}%`, ['--i' as string]: i }} />
    </div>
  )
}

/** Número grande com legenda. */
export function NumeroMini({ valor, legenda }: { valor: ReactNode; legenda: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-heading text-[32px] leading-none font-light tracking-[-0.03em] tabular-nums">{valor}</span>
      <span className="text-muted-foreground text-xs">{legenda}</span>
    </div>
  )
}
