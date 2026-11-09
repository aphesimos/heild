import { BriefcaseIcon, BuildingsIcon, CheckIcon, CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useMemo, useState, type ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Cliente } from '@/dados/tipos'
import { cn } from '@/lib/utils'

/** `null` = modo "Todos" (visão de carteira). */
export type SelecaoCliente = string | null

interface Props {
  clientes: Cliente[]
  selecionado: SelecaoCliente
  onSelecionar: (id: SelecaoCliente) => void
  className?: string
}

/** Seletor do cliente em contexto (subplano 03, seção 3): busca, "Todos" e lista. */
export function SeletorCliente({ clientes, selecionado, onSelecionar, className }: Props) {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const atual = clientes.find((c) => c.id === selecionado)

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return clientes
    const digitos = q.replace(/\D/g, '')
    return clientes.filter((c) => c.nome.toLowerCase().includes(q) || c.codigo.startsWith(q) || (digitos !== '' && c.documento.replace(/\D/g, '').includes(digitos)))
  }, [busca, clientes])

  const escolher = (id: SelecaoCliente) => {
    onSelecionar(id)
    setAberto(false)
    setBusca('')
  }

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'hover:bg-raised/60 font-heading flex h-10 max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-full px-3 text-base font-light tracking-tight transition-colors sm:text-lg 2xl:text-xl',
            className,
          )}
        >
          <span className="truncate">
            {atual ? (
              <>
                {atual.codigo}
                <span className="hidden sm:inline"> - {atual.nome}</span>
              </>
            ) : (
              `Carteira · ${clientes.length}`
            )}
          </span>
          <CaretDownIcon className="text-muted-foreground size-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(20rem,calc(100vw-1.5rem))] p-0">
        <div className="flex items-center gap-2 border-b px-3">
          <MagnifyingGlassIcon className="text-muted-foreground size-4" />
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Código, nome ou CNPJ/CPF"
            className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <ul role="listbox" className="area-rolagem-dupla max-h-72 overflow-y-auto p-1">
          {!busca && (
            <Opcao ativo={selecionado === null} onClick={() => escolher(null)} titulo="Todos" descricao="Visão de carteira" icone={<BriefcaseIcon />} />
          )}
          {filtrados.map((c) => (
            <Opcao
              key={c.id}
              ativo={c.id === selecionado}
              onClick={() => escolher(c.id)}
              titulo={`${c.codigo} - ${c.nome}`}
              descricao={`${c.documento} · ${c.regime}${c.situacao === 'implantacao' ? ' · em implantação' : ''}`}
              icone={<BuildingsIcon />}
            />
          ))}
          {filtrados.length === 0 && <li className="text-muted-foreground px-3 py-6 text-center text-sm">Nenhum cliente encontrado</li>}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

function Opcao({ ativo, onClick, titulo, descricao, icone }: { ativo: boolean; onClick: () => void; titulo: string; descricao: string; icone: ReactNode }) {
  return (
    <li role="option" aria-selected={ativo}>
      <button type="button" onClick={onClick} className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left">
        <span className="text-muted-foreground [&_svg]:size-4">{icone}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{titulo}</span>
          <span className="text-muted-foreground block truncate text-xs">{descricao}</span>
        </span>
        {ativo && <CheckIcon className="size-4" />}
      </button>
    </li>
  )
}
