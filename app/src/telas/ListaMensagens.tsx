import { useEffect, useRef } from 'react'
import { BolhaChat } from '@/components/compostos/bolha-chat'
import type { AcoesCartao } from '@/components/compostos/cartoes-chat'
import type { Mensagem } from '@/dados/tipos'
import { cn } from '@/lib/utils'

/** Mensagens com rolagem automática para o fim (inclusive quando a resposta pendente chega). */
export function ListaMensagens({ mensagens, acoes, className }: { mensagens: Mensagem[]; acoes?: AcoesCartao; className?: string }) {
  const fim = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLDivElement>(null)
  // Rola só a área da conversa, nunca a página em volta (na landing a demonstração fica no meio da página).
  const area = () => {
    let el = lista.current?.parentElement ?? null
    while (el && !/(auto|scroll)/.test(getComputedStyle(el).overflowY)) el = el.parentElement
    return el
  }

  useEffect(() => {
    const a = area()
    if (a) a.scrollTo({ top: a.scrollHeight, behavior: 'smooth' })
  }, [mensagens])

  // Enquanto a resposta é escrita, a lista cresce: acompanha o fim, se a pessoa já estava lá embaixo.
  useEffect(() => {
    const el = lista.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const a = area()
      if (a && a.scrollHeight - a.scrollTop - a.clientHeight < 160) a.scrollTop = a.scrollHeight
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={lista} className={cn('flex flex-col gap-6', className)} aria-live="polite">
      {mensagens.map((m) => (
        <BolhaChat key={m.id} mensagem={m} acoes={acoes} />
      ))}
      <div ref={fim} />
    </div>
  )
}
