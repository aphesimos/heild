import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Lista simples com divisórias. Base de listas de tarefas, clientes e integrantes. */
export function List({ className, ...props }: ComponentProps<'ul'>) {
  return <ul role="list" className={cn('divide-y', className)} {...props} />
}

export function ListItem({
  className,
  inicio,
  fim,
  titulo,
  descricao,
  ativo,
  onSelecionar,
  ...props
}: Omit<ComponentProps<'li'>, 'title' | 'onSelect'> & {
  inicio?: ReactNode
  fim?: ReactNode
  titulo: ReactNode
  descricao?: ReactNode
  ativo?: boolean
  /** Torna o item clicável (renderiza um botão). */
  onSelecionar?: () => void
}) {
  const conteudo = (
    <>
      {inicio && <div className="shrink-0">{inicio}</div>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{titulo}</div>
        {descricao && <div className="text-muted-foreground truncate text-xs">{descricao}</div>}
      </div>
      {fim && <div className="shrink-0">{fim}</div>}
    </>
  )
  return (
    <li className={cn('list-none', className)} {...props}>
      {onSelecionar ? (
        <button
          type="button"
          onClick={onSelecionar}
          aria-current={ativo || undefined}
          className={cn(
            'hover:bg-accent flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors',
            ativo && 'bg-accent',
          )}
        >
          {conteudo}
        </button>
      ) : (
        <div className="flex items-center gap-3 px-3 py-2.5">{conteudo}</div>
      )}
    </li>
  )
}
