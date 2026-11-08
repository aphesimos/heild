import { BroomIcon, CaretDownIcon, CheckIcon, NotePencilIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip } from '@/components/ui/tooltip'
import type { Conversa } from '@/dados/tipos'
import { cn } from '@/lib/utils'

interface Props {
  atual: Conversa
  historico: Conversa[]
  /** Nome do cliente (ou "Carteira"), para o título do histórico. */
  contexto: string
  onAbrir: (id: string) => void
  onNova: () => void
  onLimpar: () => void
  className?: string
}

const ordemGrupos: Conversa['grupo'][] = ['Hoje', 'Ontem', 'Esta semana', 'Antes']

/**
 * Barra da conversa do Assistente: título com o histórico do cliente,
 * nova conversa e limpar (com confirmação). A sessão troca sozinha com o cliente.
 */
export function BarraConversa({ atual, historico, contexto, onAbrir, onNova, onLimpar, className }: Props) {
  const [abertoHist, setAbertoHist] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const temMensagens = atual.mensagens.length > 0

  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <Popover open={abertoHist} onOpenChange={setAbertoHist}>
        <PopoverTrigger asChild>
          <button type="button" className="hover:bg-raised/70 flex min-w-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors">
            <span className="truncate">{atual.titulo}</span>
            <CaretDownIcon className="text-muted-foreground size-3.5 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-1">
          <div className="text-muted-foreground px-3 pt-2 pb-1 text-xs">Conversas · {contexto}</div>
          <div className="max-h-80 overflow-y-auto">
            {ordemGrupos.map((g) => {
              const itens = historico.filter((c) => c.grupo === g)
              if (!itens.length) return null
              return (
                <div key={g} className="py-1">
                  <div className="text-muted-foreground px-3 py-1 text-[11px] font-medium tracking-wide uppercase">{g}</div>
                  {itens.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onAbrir(c.id)
                        setAbertoHist(false)
                      }}
                      className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{c.titulo}</span>
                        <span className="text-muted-foreground block text-xs">
                          {c.quando} · {c.mensagens.length} {c.mensagens.length === 1 ? 'mensagem' : 'mensagens'}
                        </span>
                      </span>
                      {c.id === atual.id && <CheckIcon className="size-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              )
            })}
            {historico.length === 0 && <p className="text-muted-foreground px-3 py-4 text-sm">Nenhuma conversa com este cliente ainda.</p>}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex shrink-0 items-center gap-0.5">
        <Tooltip conteudo="Limpar esta conversa">
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Limpar esta conversa" disabled={!temMensagens} onClick={() => setConfirmar(true)}>
            <BroomIcon className="size-[18px]" />
          </Button>
        </Tooltip>
        <Tooltip conteudo="Nova conversa">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onNova}>
            <NotePencilIcon className="size-[18px]" />
            <span className="hidden sm:inline">Nova conversa</span>
          </Button>
        </Tooltip>
      </div>

      <Dialog open={confirmar} onOpenChange={setConfirmar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar esta conversa?</DialogTitle>
            <DialogDescription>As mensagens desta conversa somem. Cartões de aprovação que estavam nela continuam na Visão geral e no chat do integrante.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onLimpar()
                setConfirmar(false)
              }}
            >
              Limpar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
