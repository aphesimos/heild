import { ArrowBendDownRightIcon, FileTextIcon } from '@phosphor-icons/react'
import type { Mensagem } from '@/dados/tipos'
import { duracaoEscrita, useEscritaTexto } from '@/lib/escrita'
import { cn } from '@/lib/utils'
import { useAparencia } from '@/hooks/useAparencia'
import { CartaoChat, type AcoesCartao } from './cartoes-chat'
import { OrbMensagem } from './orb-mensagem'

/**
 * Uma mensagem do chat no estilo dos assistentes de chat: a do usuário em bolha à
 * direita; a do integrante sem bolha, com o orb e os cartões abaixo.
 */
export function BolhaChat({ mensagem, acoes, className }: { mensagem: Mensagem; acoes?: AcoesCartao; className?: string }) {
  const aparencia = useAparencia()
  const { autor } = mensagem

  if (autor.tipo === 'sistema' && mensagem.cartoes?.length) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {mensagem.cartoes.map((c) => (
          <CartaoChat key={c.id} cartao={c} acoes={acoes} />
        ))}
        <span className="text-muted-foreground text-center text-[11px]">{mensagem.hora}</span>
      </div>
    )
  }

  if (autor.tipo === 'sistema') {
    return (
      <div className={cn('text-muted-foreground flex items-center gap-3 py-1 text-xs', className)}>
        <span className="bg-border h-px flex-1" />
        <span>
          {mensagem.texto} · {mensagem.hora}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>
    )
  }

  if (autor.tipo === 'usuario') {
    return (
      <div className={cn('flex flex-col items-end gap-1', className)}>
        {mensagem.veioDoGeral && (
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <ArrowBendDownRightIcon className="size-3" /> veio do Geral
          </span>
        )}
        <div className="bg-secondary text-secondary-foreground max-w-[80%] rounded-[18px] rounded-br-[6px] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">{mensagem.texto}</div>
        {mensagem.anexos && mensagem.anexos.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5">
            {mensagem.anexos.map((a) => (
              <span key={a.id} className="bg-card flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs">
                <FileTextIcon className="text-muted-foreground size-3.5" /> {a.nome}
              </span>
            ))}
          </div>
        )}
        <span className="text-muted-foreground text-[11px]">{mensagem.hora}</span>
      </div>
    )
  }

  const i = aparencia(autor)
  return <BolhaIntegrante mensagem={mensagem} acoes={acoes} className={className} nome={i.nome} cor={i.cor} corOlhos={i.corOlhos} />
}

/** Resposta do integrante: pensando, depois o texto sendo escrito (com cursor) e, no fim, os cartões. */
function BolhaIntegrante({ mensagem, acoes, className, nome, cor, corOlhos }: { mensagem: Mensagem; acoes?: AcoesCartao; className?: string; nome: string; cor: string; corOlhos?: string }) {
  const { visivel, escrevendo } = useEscrita(mensagem)
  const i = { nome, cor, corOlhos }
  return (
    <div className={cn('flex gap-3', className)}>
      <OrbMensagem cor={i.cor} corOlhos={i.corOlhos} pendente={mensagem.pendente || escrevendo} className="mt-0.5 self-start" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{i.nome}</span>
          <span className="text-muted-foreground text-[11px]">{mensagem.hora}</span>
        </div>
        {mensagem.pendente && (
          <p className="text-muted-foreground flex items-center gap-1 text-sm" aria-live="polite">
            pensando
            <span className="flex gap-0.5" aria-hidden>
              {[0, 1, 2].map((n) => (
                <span key={n} className="bg-muted-foreground size-1 animate-bounce rounded-full" style={{ animationDelay: `${n * 120}ms` }} />
              ))}
            </span>
          </p>
        )}
        {mensagem.texto && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {visivel}
            {escrevendo && <span aria-hidden className="bg-foreground/70 ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse" />}
          </p>
        )}
        {!escrevendo &&
          mensagem.cartoes?.map((c) => (
            <div key={c.id} className={recente(mensagem) ? 'surgir' : undefined}>
              <CartaoChat cartao={c} acoes={acoes} />
            </div>
          ))}
      </div>
    </div>
  )
}

function useEscrita(m: Mensagem) {
  return useEscritaTexto(m.id, m.texto ?? '', !!m.escrever && !m.pendente, m.escreverDesde)
}
/** A mensagem acabou de chegar? Só aí os cartões entram animados; aberta depois, já está no lugar. */
const recente = (m: Mensagem) => m.escreverDesde === undefined || Date.now() - m.escreverDesde < duracaoEscrita(m.texto) + 1500
