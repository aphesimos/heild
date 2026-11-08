import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { ArrowCounterClockwiseIcon, CheckIcon, PencilSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { usePreferencia } from '@/hooks/usePreferencia'
import { cn } from '@/lib/utils'
import { dimensoes, tamanhoValido, vao, type DefWidget, type ItemGrade, type TamanhoWidget } from './tipos'
import { Widget } from './widget'

/** Colunas pela largura do contêiner: 2 (celular), 4 (tablet), 6 (comum), 8 (ultrawide). */
function colunasPara(largura: number) {
  if (largura < 520) return 2
  if (largura < 880) return 4
  if (largura < 1400) return 6
  return 8
}

function useColunas() {
  const ref = useRef<HTMLDivElement>(null)
  const [colunas, setColunas] = useState(6)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => setColunas(colunasPara(el.clientWidth))
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, colunas }
}

/** Abre o modo edição com um toque longo (como no celular). */
function useToqueLongo(ativar: () => void, ms = 550) {
  const t = useRef<number | undefined>(undefined)
  const inicio = useRef<{ x: number; y: number } | null>(null)
  const cancelar = () => {
    window.clearTimeout(t.current)
    inicio.current = null
  }
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [role="radio"]')) return
      inicio.current = { x: e.clientX, y: e.clientY }
      t.current = window.setTimeout(ativar, ms)
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (inicio.current && Math.hypot(e.clientX - inicio.current.x, e.clientY - inicio.current.y) > 8) cancelar()
    },
    onPointerUp: cancelar,
    onPointerLeave: cancelar,
  }
}

interface Props {
  /** Chave para guardar o arranjo do usuário (uma por tela). */
  chave: string
  catalogo: DefWidget[]
  padrao: ItemGrade[]
  /** Conteúdo à esquerda da barra de edição (ex.: título da tela). */
  titulo?: ReactNode
  className?: string
}

/**
 * Grade de widgets personalizável. Células de altura fixa e tamanhos fixos
 * (P, M, G, L, XL); `grid-auto-flow: dense` preenche os buracos, então tudo
 * fica alinhado. Modo edição: arrastar para trocar de lugar (mouse, toque,
 * teclado), mudar o tamanho, esconder, adicionar pela galeria, restaurar.
 * O arranjo fica salvo por tela (em produção, `usuario.preferencias`, 03 4.3).
 */
export function GradeWidgets({ chave, catalogo, padrao, titulo, className }: Props) {
  const [salvo, setSalvo] = usePreferencia<ItemGrade[] | null>(`ui-lab:widgets:${chave}`, null)
  // Descarta o que saiu do catálogo e corrige tamanhos que o widget não aceita.
  const itens = (salvo ?? padrao).flatMap((i) => {
    const def = catalogo.find((d) => d.id === i.id)
    return def ? [{ ...i, tamanho: tamanhoValido(def, i.tamanho) }] : []
  })
  const setItens = (f: (xs: ItemGrade[]) => ItemGrade[]) => setSalvo(f(itens))
  const [editando, setEditando] = useState(false)
  const [galeria, setGaleria] = useState(false)
  const [ativo, setAtivo] = useState<string | null>(null)
  const { ref, colunas } = useColunas()
  const reduzir = useReducedMotion()
  const toqueLongo = useToqueLongo(() => setEditando(true))

  useEffect(() => {
    if (!editando) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && !galeria && setEditando(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [editando, galeria])

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const defDe = (id: string) => catalogo.find((d) => d.id === id)!
  const ocultos = catalogo.filter((d) => !itens.some((i) => i.id === d.id))

  // Troca de lugar ao vivo enquanto arrasta; a grade reflui e o motion anima.
  const aoPassar = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setItens((xs) => {
      const de = xs.findIndex((x) => x.id === active.id)
      const para = xs.findIndex((x) => x.id === over.id)
      return de < 0 || para < 0 ? xs : arrayMove(xs, de, para)
    })
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">{titulo}</div>
        {editando ? (
          <>
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setSalvo(null)}>
              <ArrowCounterClockwiseIcon /> Restaurar padrão
            </Button>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setGaleria(true)} disabled={!ocultos.length}>
              <PlusIcon /> Adicionar widget
            </Button>
            <Button size="sm" className="rounded-full" onClick={() => setEditando(false)}>
              <CheckIcon weight="bold" /> Concluir
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full" onClick={() => setEditando(true)}>
            <PencilSimpleIcon /> Editar painel
          </Button>
        )}
      </div>

      {editando && <p className="text-muted-foreground -mt-1 text-xs">Arraste para trocar de lugar · escolha o tamanho no canto · o botão de menos esconde · Esc conclui</p>}

      <DndContext
        sensors={sensores}
        collisionDetection={closestCenter}
        onDragStart={(e: DragStartEvent) => setAtivo(String(e.active.id))}
        onDragOver={aoPassar}
        onDragEnd={(_e: DragEndEvent) => setAtivo(null)}
        onDragCancel={() => setAtivo(null)}
      >
        <SortableContext items={itens.map((i) => i.id)} strategy={() => null}>
          <div
            ref={ref}
            {...(editando ? {} : toqueLongo)}
            className="grid grid-flow-row-dense gap-3 sm:gap-4"
            style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`, gridAutoRows: 'var(--celula-widget)' }}
          >
            {itens.map((item) => (
              <ItemSortavel
                key={item.id}
                item={item}
                def={defDe(item.id)}
                colunas={colunas}
                editando={editando}
                arrastando={ativo === item.id}
                animar={!reduzir}
                onRemover={() => setItens((xs) => xs.filter((x) => x.id !== item.id))}
                onTamanho={(t) => setItens((xs) => xs.map((x) => (x.id === item.id ? { ...x, tamanho: t } : x)))}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={reduzir ? null : undefined}>
          {ativo ? (() => {
            const it = itens.find((i) => i.id === ativo)
            if (!it) return null
            const v = vao(it.tamanho, colunas)
            const el = ref.current
            const vaoPx = el ? parseFloat(getComputedStyle(el).columnGap) || 16 : 16
            const larguraCelula = el ? (el.clientWidth - (colunas - 1) * vaoPx) / colunas : 200
            return (
              <div style={{ width: v.colunas * larguraCelula + (v.colunas - 1) * vaoPx, height: `calc(${v.linhas} * var(--celula-widget) + ${(v.linhas - 1) * vaoPx}px)` }} className="rotate-1">
                <Widget def={defDe(it.id)} tamanho={it.tamanho} className="shadow-2xl" />
              </div>
            )
          })() : null}
        </DragOverlay>
      </DndContext>

      <Sheet open={galeria} onOpenChange={setGaleria}>
        <SheetContent className="gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Adicionar widget</SheetTitle>
            <SheetDescription>Os que estão escondidos nesta tela. Entram no fim; arraste para onde quiser.</SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 overflow-y-auto p-4">
            {ocultos.map((d) => {
              const Icone = d.icone
              return (
                <li key={d.id} className="bg-surface shadow-cartao flex flex-col gap-2 rounded-[18px] p-3">
                  <div className="flex items-center gap-2">
                    {Icone && <Icone weight="duotone" className="text-muted-foreground size-5" />}
                    <span className="flex-1 text-sm font-medium">{d.titulo}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{d.descricao}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tamanhos.map((t) => (
                      <Button
                        key={t}
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setItens((xs) => [...xs, { id: d.id, tamanho: t }])
                          if (ocultos.length === 1) setGaleria(false)
                        }}
                      >
                        <PlusIcon /> {dimensoes[t].rotulo}
                      </Button>
                    ))}
                  </div>
                </li>
              )
            })}
            {!ocultos.length && <p className="text-muted-foreground py-6 text-center text-sm">Todos os widgets já estão na tela.</p>}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ItemSortavel({
  item,
  def,
  colunas,
  editando,
  arrastando,
  animar,
  onRemover,
  onTamanho,
}: {
  item: ItemGrade
  def: DefWidget
  colunas: number
  editando: boolean
  arrastando: boolean
  animar: boolean
  onRemover: () => void
  onTamanho: (t: TamanhoWidget) => void
}) {
  const { setNodeRef, attributes, listeners } = useSortable({ id: item.id, disabled: !editando })
  const v = vao(item.tamanho, colunas)
  return (
    <motion.div
      ref={setNodeRef}
      layout={animar ? 'position' : false}
      transition={{ type: 'spring', stiffness: 520, damping: 42 }}
      className="min-w-0"
      style={{ gridColumn: `span ${v.colunas}`, gridRow: `span ${v.linhas}` }}
    >
      <Widget def={def} tamanho={item.tamanho} editando={editando} arrastando={arrastando} onRemover={onRemover} onTamanho={onTamanho} alca={{ ...attributes, ...listeners }} />
    </motion.div>
  )
}
