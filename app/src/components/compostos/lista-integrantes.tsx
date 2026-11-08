import { EyeIcon, MagnifyingGlassIcon, PauseIcon, PlusIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Contador } from '@/components/ui/badge'
import { Orb } from '@/components/ui/orb'
import { Tooltip } from '@/components/ui/tooltip'
import type { Integrante } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { rotuloDoEstado, type EstadoIntegrante } from '@/lib/integrante'
import { cn } from '@/lib/utils'

interface Props {
  integrantes: Integrante[]
  selecionado?: string
  onSelecionar?: (i: Integrante) => void
  onCriar?: () => void
  /**
   * `coluna`: a coluna da aba Time (Figma), com busca, fixos no topo e resumo.
   * `completa`: orb, nome, estado. `icones`: só orbs (gaveta do chat, faixa no celular).
   */
  variante?: 'completa' | 'icones' | 'coluna'
  /** Só para `icones`: coluna (padrão) ou faixa horizontal com rolagem. */
  orientacao?: 'vertical' | 'horizontal'
  className?: string
}

/** Peso na ordenação: quem precisa de você primeiro, depois quem trabalha. */
const pesoEstado: Record<EstadoIntegrante, number> = { precisa_de_voce: 0, erro: 1, trabalhando: 2, pensando: 2, concluido: 3, disponivel: 4, dormindo: 5 }

const fixo = (i: Integrante) => i.tipo === 'geral' || i.tipo === 'consultor'

/** Ordem da lista: Geral e Consultor fixos no topo; o resto por urgência e pendências. */
export function ordenarIntegrantes(lista: Integrante[]) {
  const fixos = lista.filter(fixo).sort((a, b) => (a.tipo === 'geral' ? -1 : b.tipo === 'geral' ? 1 : 0))
  const outros = lista.filter((i) => !fixo(i)).sort((a, b) => pesoEstado[a.estado] - pesoEstado[b.estado] || b.pendentes - a.pendentes)
  return { fixos, outros }
}

/**
 * Lista de integrantes do time. Os orbs ficam vivos (vagando, com partículas) e
 * não reagem a clique: o clique é para abrir o chat.
 */
export function ListaIntegrantes({ integrantes, selecionado, onSelecionar, onCriar, variante = 'completa', orientacao = 'vertical', className }: Props) {
  const aparencia = useAparencia()
  const [busca, setBusca] = useState('')
  const { fixos, outros } = useMemo(() => ordenarIntegrantes(integrantes), [integrantes])

  if (variante === 'coluna') {
    const q = busca.trim().toLowerCase()
    const casa = (it: Integrante) => !q || [aparencia(it).nome, it.funcao, it.setorRotulo].some((t) => t.toLowerCase().includes(q))
    const f = fixos.filter(casa)
    const o = outros.filter(casa)
    return (
      <div className={cn('from-sunken to-sunken-end flex flex-col gap-3 bg-gradient-to-b p-4 xl:p-5', className)}>
        <label className="bg-raised/80 focus-within:bg-raised shadow-contorno flex h-12 shrink-0 items-center gap-3 rounded-[17px] px-3">
          <MagnifyingGlassIcon className="text-foreground/70 size-5" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar integrante"
            className="placeholder:text-foreground/60 w-full bg-transparent text-[15px] outline-none"
          />
        </label>
        <div className="area-rolagem-dupla -mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1 py-1">
          {f.map((it) => (
            <ItemColuna key={it.id} it={it} ativo={it.id === selecionado} onClick={() => onSelecionar?.(it)} />
          ))}
          {f.length > 0 && o.length > 0 && <span className="bg-foreground/10 mx-2 my-1.5 h-px shrink-0" />}
          {o.map((it) => (
            <ItemColuna key={it.id} it={it} ativo={it.id === selecionado} onClick={() => onSelecionar?.(it)} />
          ))}
          {f.length + o.length === 0 && <p className="text-foreground/70 px-2 py-6 text-center text-sm">Nenhum integrante encontrado</p>}
        </div>
        {onCriar && (
          <button type="button" onClick={onCriar} className="text-foreground/70 hover:text-foreground hover:bg-raised/50 flex shrink-0 cursor-pointer items-center gap-3 rounded-[20px] px-2 py-2 text-left text-sm transition-colors">
            <span className="border-foreground/30 flex size-12 shrink-0 items-center justify-center rounded-full border border-dashed">
              <PlusIcon className="size-5" />
            </span>
            Novo integrante
          </button>
        )}
      </div>
    )
  }

  const todos = [...fixos, ...outros]

  if (variante === 'icones') {
    return (
      <nav
        aria-label="Integrantes"
        className={cn('flex items-center gap-3', orientacao === 'horizontal' ? 'sem-barra flex-row overflow-x-auto' : 'flex-col', className)}
      >
        {todos.map((it) => {
          const t = aparencia(it)
          const ativo = it.id === selecionado
          return (
            <Tooltip key={it.id} conteudo={`${t.nome} · ${rotuloDoEstado[it.estado]}`} lado={orientacao === 'horizontal' ? 'bottom' : 'left'}>
              <button
                type="button"
                aria-label={t.nome}
                aria-current={ativo || undefined}
                onClick={() => onSelecionar?.(it)}
                className={cn('relative shrink-0 cursor-pointer rounded-full p-1 transition', ativo ? 'ring-primary ring-2' : 'hover:bg-accent')}
              >
                <Orb cor={t.cor} corOlhos={t.corOlhos} estado={it.estado} tamanho={36} cutucavel={false} animado modo="wander" espelho={{ id: it.id, papel: 'lateral' }} />
                <Contador valor={it.pendentes} className="absolute -top-0.5 -right-0.5" />
              </button>
            </Tooltip>
          )
        })}
        {onCriar && (
          <Tooltip conteudo="Novo integrante" lado={orientacao === 'horizontal' ? 'bottom' : 'left'}>
            <button type="button" onClick={onCriar} aria-label="Novo integrante" className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed">
              <PlusIcon className="size-4" />
            </button>
          </Tooltip>
        )}
      </nav>
    )
  }

  return (
    <nav aria-label="Integrantes" className={cn('flex flex-col gap-1', className)}>
      {todos.map((it) => {
        const t = aparencia(it)
        const ativo = it.id === selecionado
        return (
          <button
            key={it.id}
            type="button"
            aria-current={ativo || undefined}
            onClick={() => onSelecionar?.(it)}
            className={cn('flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', ativo ? 'bg-accent' : 'hover:bg-accent/60')}
          >
            <Orb cor={t.cor} corOlhos={t.corOlhos} estado={it.estado} tamanho={36} cutucavel={false} animado modo="wander" espelho={{ id: it.id, papel: 'lateral' }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{t.nome}</span>
              <span className={cn('block truncate text-xs', it.estado === 'precisa_de_voce' ? 'text-foreground' : 'text-muted-foreground')}>{rotuloDoEstado[it.estado]}</span>
            </span>
            <Contador valor={it.pendentes} />
          </button>
        )
      })}
      {onCriar && (
        <button type="button" onClick={onCriar} className="text-muted-foreground hover:bg-accent/60 hover:text-foreground flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm">
          <span className="flex size-9 items-center justify-center rounded-full border border-dashed">
            <PlusIcon className="size-4" />
          </span>
          Novo integrante
        </button>
      )}
    </nav>
  )
}

/** Item da coluna: orb, nome, setor, resumo de uma linha e pendências. */
function ItemColuna({ it, ativo, onClick }: { it: Integrante; ativo: boolean; onClick: () => void }) {
  const aparencia = useAparencia()
  const t = aparencia(it)
  const pausado = it.situacao === 'pausado'
  return (
    <button
      type="button"
      aria-current={ativo || undefined}
      onClick={onClick}
      className={cn('flex shrink-0 cursor-pointer items-center gap-3 rounded-[20px] px-2 py-2 text-left transition-colors', ativo ? 'bg-raised shadow-sm' : 'hover:bg-raised/50')}
    >
      <span className={cn('relative', pausado && 'opacity-50 grayscale')}>
        <Orb cor={t.cor} corOlhos={t.corOlhos} estado={pausado ? 'dormindo' : it.estado} tamanho={48} cutucavel={false} animado modo="wander" espelho={{ id: it.id, papel: 'lateral' }} />
        <Contador valor={it.pendentes} className="absolute -top-0.5 -right-0.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-medium">{t.nome}</span>
          {pausado && <PauseIcon weight="fill" className="text-muted-foreground size-3.5 shrink-0" aria-label="pausado" />}
          {it.emObservacao && <EyeIcon weight="duotone" className="text-muted-foreground size-3.5 shrink-0" aria-label="em observação" />}
        </span>
        <span className="text-foreground/60 block truncate text-xs">{it.setorRotulo}</span>
        <span className={cn('block truncate text-xs', it.estado === 'precisa_de_voce' && !pausado ? 'text-foreground font-medium' : 'text-foreground/75')}>
          {pausado ? 'Pausado · o chat responde' : (it.resumo ?? rotuloDoEstado[it.estado])}
        </span>
      </span>
    </button>
  )
}
