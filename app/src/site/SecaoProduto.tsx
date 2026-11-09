import type { Icon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'
import { ReservaAltura } from './Estavel'
import { PainelMini, type AbaMini } from './PainelMini'
import { useVisto } from './Vivos'

/**
 * Peças comuns das seções que mostram o produto nas páginas de plataforma:
 * a mesma seção do site (texto à esquerda, visual à direita), os pares de
 * título e texto, os números que contam e a seção "o resto já vem junto".
 */

export const Wrap = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn('wrap mx-auto w-[min(1216px,calc(100%-32px))] sm:w-[min(1216px,calc(100%-48px))]', className)}>{children}</div>

export function Secao({ id, titulo, texto, children, visual, className, grade, seletor }: { id: string; titulo: ReactNode; texto?: ReactNode; children?: ReactNode; visual: ReactNode; className?: string; grade?: boolean; seletor?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useVisto(ref, { limiar: 0.15 })
  return (
    <section id={id} aria-labelledby={`${id}-t`} className={cn('flex min-h-[100svh] scroll-mt-16 flex-col justify-center py-16 lg:py-14', grade && 'grade-pontos', className)}>
      <Wrap>
        <MoldeVisual
          refRevela={ref}
          visto={visto}
          seletor={seletor}
          visual={visual}
          cabeca={
            <div className="flex flex-col gap-3">
              <h2 id={`${id}-t`} className="font-heading text-3xl font-light tracking-[-0.025em] text-balance sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                {titulo}
              </h2>
              {texto && <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">{texto}</p>}
            </div>
          }
        >
          {children}
        </MoldeVisual>
      </Wrap>
    </section>
  )
}

/** O seletor colado no cartão (celular): marca quando as opções não cabem, para a ponta esmaecer só aí. */
function SeletorMovel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const lista = ref.current?.querySelector<HTMLElement>('[role="tablist"]')
    if (!lista) return
    const medir = () => lista.toggleAttribute('data-rola', lista.scrollWidth > lista.clientWidth + 1)
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(lista)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="seletor-movel -mb-4 flex min-w-0 justify-center lg:hidden">
      {children}
    </div>
  )
}

/**
 * O molde das seções com visual. No desktop: título, seletor e texto à esquerda
 * (5 colunas), o visual à direita (7). No celular a ordem é a de quem usa: o
 * título, o seletor numa barra que rola de lado colada no cartão, o cartão e,
 * por último, o resto do texto. Assim o que se escolhe fica junto do que muda.
 */
export function MoldeVisual({ refRevela, visto, cabeca, seletor, visual, children }: { refRevela: RefObject<HTMLDivElement | null>; visto: boolean; cabeca: ReactNode; seletor?: ReactNode; visual: ReactNode; children?: ReactNode }) {
  const resto = !!seletor || (children !== undefined && children !== null && children !== false)
  return (
    <div ref={refRevela} data-visto={visto} className="revela grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
      <div className={cn('min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1', resto ? 'lg:self-end' : 'lg:row-span-2 lg:self-center')}>{cabeca}</div>
      {seletor && <SeletorMovel>{seletor}</SeletorMovel>}
      <div data-visual className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
        {visual}
      </div>
      {resto && (
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
          {seletor && <div className="hidden lg:block">{seletor}</div>}
          {children}
        </div>
      )}
    </div>
  )
}

export function Pares({ itens }: { itens: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-5">
      {itens.map(([t, d]) => (
        <div key={t} className="flex flex-col gap-1">
          <dt className="text-base font-medium">{t}</dt>
          <dd className="text-muted-foreground text-base leading-relaxed">{d}</dd>
        </div>
      ))}
    </dl>
  )
}

const parado = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Número que sobe até o valor quando aparece (e quando o valor muda). */
export function Contador({ valor, formato = (n) => n.toLocaleString('pt-BR'), className }: { valor: number; formato?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useVisto(ref, { limiar: 0.4 })
  const [n, setN] = useState(0)
  const de = useRef(0)
  useEffect(() => {
    if (!visto) return
    if (parado()) return setN(valor)
    const inicio = de.current
    const t0 = performance.now()
    const dur = 900
    let raf = 0
    const f = (agora: number) => {
      const p = Math.min(1, (agora - t0) / dur)
      const v = inicio + (valor - inicio) * (1 - (1 - p) ** 3)
      setN(v)
      if (p < 1) raf = requestAnimationFrame(f)
      else de.current = valor
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [visto, valor])
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {formato(Math.round(n))}
    </span>
  )
}

/** Valor em reais; inteiros sem centavos (R$ 13.940), o resto com (R$ 8.412,50). */
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })

export type Tom = 'ok' | 'atencao' | 'erro' | 'neutro'
const corTom: Record<Tom, string> = { ok: 'bg-success', atencao: 'bg-warning', erro: 'bg-destructive', neutro: 'bg-muted-foreground/50' }

/** Ponto de situação; sempre ao lado de um texto (nunca a cor sozinha). */
export function Ponto({ tom, vivo, className }: { tom: Tom; vivo?: boolean; className?: string }) {
  return <span aria-hidden className={cn('relative inline-block size-2 shrink-0 rounded-full', corTom[tom], vivo && 'ponto-vivo', className)} />
}

/* ---------------- o resto do escritório, no mesmo sistema ---------------- */

export interface ItemNaoCore {
  id: string
  nome: string
  icone: Icon
  /** Uma linha: o que o módulo faz. */
  linha: string
  /** A prévia do módulo, com os dados de exemplo. */
  previa: ReactNode
}

/**
 * O que o escritório costuma comprar à parte, junto na Heild: a lista de
 * módulos à esquerda do quadro e a prévia de cada um à direita. Passar o
 * cursor ou clicar troca a prévia.
 */
export function SecaoNaoCore({ id, titulo, texto, itens, pares }: { id: string; titulo: ReactNode; texto: ReactNode; itens: ItemNaoCore[]; pares?: [string, string][] }) {
  const [atual, setAtual] = useState(itens[0].id)
  const item = itens.find((i) => i.id === atual) ?? itens[0]
  return (
    <Secao
      id={id}
      titulo={titulo}
      texto={texto}
      grade
      visual={
        <div data-luz className="bg-background shadow-painel grid gap-3 rounded-[28px] p-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:p-4">
          <div role="tablist" aria-label="Módulos" aria-orientation="vertical" className="sem-barra modulos-nc -mx-1 flex gap-1 overflow-x-auto px-1 sm:mx-0 sm:flex-col sm:overflow-visible sm:px-0">
            {itens.map((i) => {
              const ativo = i.id === item.id
              const Ic = i.icone
              return (
                <button
                  key={i.id}
                  role="tab"
                  type="button"
                  id={`${id}-tab-${i.id}`}
                  aria-selected={ativo}
                  aria-controls={`${id}-previa`}
                  onClick={() => setAtual(i.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setAtual(i.id)}
                  className={cn('modulo-nc flex shrink-0 cursor-pointer items-center gap-3 rounded-[18px] px-3 py-2.5 text-left text-sm transition-colors sm:py-3', ativo ? 'bg-surface shadow-contorno' : 'text-muted-foreground hover:text-foreground')}
                >
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full transition-colors', ativo ? 'bg-primary text-primary-foreground' : 'bg-sunken')}>
                    <Ic className="size-4" weight={ativo ? 'fill' : 'regular'} />
                  </span>
                  <span className={cn('whitespace-nowrap', ativo && 'font-medium')}>{i.nome}</span>
                </button>
              )
            })}
          </div>
          <div id={`${id}-previa`} role="tabpanel" aria-labelledby={`${id}-tab-${item.id}`} className="bg-surface flex min-h-[380px] min-w-0 flex-col gap-4 rounded-[22px] p-4 sm:min-h-[440px] sm:p-5">
            {/* Texto e prévia de todos os módulos na mesma célula (os escondidos só medem): o quadro fica com a altura do maior e nada se mexe ao trocar. */}
            <div className="grid min-h-0 flex-1 grid-cols-1">
              {itens.map((i) =>
                i.id === item.id ? (
                  <div key={i.id} className="flex min-w-0 flex-col gap-4 [grid-area:1/1]">
                    <p className="entra text-muted-foreground text-sm leading-relaxed">{i.linha}</p>
                    <div className="previa-nc min-h-0 flex-1">{i.previa}</div>
                  </div>
                ) : (
                  <div key={'medida-' + i.id} aria-hidden inert className="invisible flex min-w-0 flex-col gap-4 [grid-area:1/1]">
                    <p className="text-sm leading-relaxed">{i.linha}</p>
                    <div>{i.previa}</div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      }
    >
      {pares && <Pares itens={pares} />}
    </Secao>
  )
}

/**
 * A seção do Painel, igual nas duas plataformas: o Painel pequeno com as abas em
 * cima e, ao lado, a lista das abas em que a da vez abre a sua descrição. As duas
 * andam juntas (clicar numa muda a outra).
 */
export function SecaoPainelAbas({ id, titulo, texto, abas, rotulo }: { id: string; titulo: ReactNode; texto: ReactNode; abas: (AbaMini & { linha: string })[]; rotulo: string }) {
  const [aba, setAba] = useState(abas[0].id)
  const atual = abas.find((a) => a.id === aba) ?? abas[0]
  return (
    <Secao id={id} titulo={titulo} texto={texto} visual={<PainelMini abas={abas} aba={aba} onAba={setAba} rotulo={rotulo} />}>
      {/* Cada aba aberta tem uma altura; a lista reserva a da maior, para trocar de aba não mexer a coluna. */}
      <ReservaAltura className="hidden lg:grid" variantes={abas.filter((a) => a.id !== aba).map((a) => <ListaAbas key={a.id} abas={abas} aba={a.id} />)}>
        <ListaAbas abas={abas} aba={aba} onAba={setAba} />
      </ReservaAltura>
      <ReservaAltura className="-mt-4 lg:hidden" variantes={abas.filter((a) => a.id !== aba).map((a) => <LinhaAba key={a.id} a={a} />)}>
        <LinhaAba key={atual.id} a={atual} entra />
      </ReservaAltura>
    </Secao>
  )
}

function LinhaAba({ a, entra }: { a: AbaMini & { linha: string }; entra?: boolean }) {
  return (
    <p className={cn('text-muted-foreground text-base leading-relaxed', entra && 'entra')}>
      <span className="text-foreground font-medium">{a.rotulo}</span>: {a.linha.charAt(0).toLowerCase() + a.linha.slice(1)}
    </p>
  )
}

function ListaAbas({ abas, aba, onAba }: { abas: (AbaMini & { linha: string })[]; aba: string; onAba?: (id: string) => void }) {
  const muitas = abas.length > 6
  return (
    <div aria-label="Abas do Painel" className="flex flex-col gap-0.5">
      {abas.map((a) => {
        const ativo = a.id === aba
        return (
          <button
            key={a.id}
            type="button"
            aria-current={ativo || undefined}
            onClick={() => onAba?.(a.id)}
            className={cn('flex cursor-pointer flex-col gap-0.5 rounded-[18px] px-4 text-left transition-colors', muitas ? 'py-2' : 'py-3', ativo ? 'bg-surface shadow-contorno' : 'hover:bg-surface/60')}
          >
            <span className={cn(muitas ? 'text-sm' : 'text-base', ativo ? 'font-medium' : 'text-muted-foreground')}>{a.rotulo}</span>
            <span data-aberto={ativo} className="setor-linha text-muted-foreground text-sm leading-relaxed">
              <span>{a.linha}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
