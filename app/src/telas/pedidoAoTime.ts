import type { useLoja } from '@/ambiente/loja'
import { fluxos, type PedidoAssistente } from '@/dados/simulacao'
import type { Anexo, Cartao, Mensagem } from '@/dados/tipos'
import { duracaoEscrita } from '@/lib/escrita'

type Enviar = (texto: string, anexos: Anexo[], resposta?: { texto: string; cartoes?: Cartao[] }) => void

/**
 * Pedido ao time (demonstração): o Assistente responde pensando (2,2 s), a passagem
 * anima e só então cada integrante começa. Usado pelo Assistente do produto e pela
 * demonstração da landing, para os dois seguirem as mesmas regras e tempos.
 */
export function pedirAoTime(pedido: PedidoAssistente, conversaId: string, enviar: Enviar, loja: ReturnType<typeof useLoja>) {
  const cartoes: Cartao[] = pedido.fluxos.map((id) => ({
    tipo: 'encaminhamento',
    id: `enc-${id}-${Date.now()}`,
    de: 'geral',
    para: fluxos[id].setor,
    pedido: fluxos[id].titulo,
    em: Date.now() + 2200 + duracaoEscrita(pedido.resposta) + 300,
  }))
  enviar(pedido.texto, [], { texto: pedido.resposta, cartoes })
  window.setTimeout(() => pedido.fluxos.forEach((id) => loja.iniciarTrabalho(fluxos[id], { origem: conversaId, final: pedido.final })), 2200 + duracaoEscrita(pedido.resposta) + 2100)
}

/** As mensagens da conversa do Assistente com o que o time escreveu nela, em ordem. */
export function mensagensComTime(proprias: Mensagem[], doTime: Mensagem[] | undefined) {
  return doTime?.length
    ? [...proprias, ...doTime]
        .map((m, i) => ({ m, i }))
        .sort((a, b) => (a.m.em ?? 0) - (b.m.em ?? 0) || a.i - b.i)
        .map((x) => x.m)
    : proprias
}
