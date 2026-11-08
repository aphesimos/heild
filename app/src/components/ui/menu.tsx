import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const Fechar = createContext<() => void>(() => {})

/** Menu de ações sobre um gatilho (Radix Popover). Fecha ao escolher um item. */
export function Menu({ gatilho, children, align = 'start', className }: { gatilho: ReactNode; children: ReactNode; align?: 'start' | 'center' | 'end'; className?: string }) {
  const [aberto, setAberto] = useState(false)
  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>{gatilho}</PopoverTrigger>
      <PopoverContent align={align} className={cn('w-60 p-1', className)}>
        <Fechar.Provider value={() => setAberto(false)}>
          <div role="menu" className="flex flex-col">
            {children}
          </div>
        </Fechar.Provider>
      </PopoverContent>
    </Popover>
  )
}

export function ItemMenu({ icone, children, detalhe, onClick, desabilitado }: { icone?: ReactNode; children: ReactNode; detalhe?: ReactNode; onClick?: () => void; desabilitado?: boolean }) {
  const fechar = useContext(Fechar)
  return (
    <button
      type="button"
      role="menuitem"
      disabled={desabilitado}
      onClick={() => {
        onClick?.()
        fechar()
      }}
      className="hover:bg-accent flex w-full cursor-pointer items-start gap-2.5 rounded-md px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:mt-0.5 [&_svg]:size-4"
    >
      {icone && <span className="text-muted-foreground">{icone}</span>}
      <span className="min-w-0 flex-1">
        <span className="block">{children}</span>
        {detalhe && <span className="text-muted-foreground block text-xs">{detalhe}</span>}
      </span>
    </button>
  )
}

export function RotuloMenu({ children }: { children: ReactNode }) {
  return <div className="text-muted-foreground px-3 pt-2 pb-1 text-[11px] font-medium">{children}</div>
}
