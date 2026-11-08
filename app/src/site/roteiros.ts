/**
 * Roteiro da demonstração guiada da landing. O trabalho em si é o do produto
 * (mesmo motor, mesmos fluxos, tempos e cartões); o roteiro só diz qual pedido a
 * caixa escreve, quem trabalha nele, em ordem, e o que conta como cada passo do guia.
 */
export interface Roteiro {
  /** Texto de `pedidosAssistente` que a caixa escreve. */
  pedido: string
  /** Integrantes que trabalham no pedido, em ordem (para as dicas e o Time). */
  cadeia: string[]
  /** O que espera a pessoa: um cartão de aprovação (id) ou a resposta do cliente. */
  espera: { tipo: 'aprovacao'; cartao: string; integrante: string } | { tipo: 'cliente'; quem: string }
  guia: [string, string][]
}

export const roteiros: Record<'contabil' | 'bpo', Roteiro> = {
  contabil: {
    pedido: 'Feche outubro da Metalúrgica Andrade',
    cadeia: ['i-contabil', 'i-fiscal'],
    espera: { tipo: 'aprovacao', cartao: 'sim-fis1', integrante: 'i-fiscal' },
    guia: [
      ['Peça ao Assistente', 'Clique na caixa: o pedido se escreve sozinho.'],
      ['Veja o time trabalhar', 'O Contábil concilia e passa ao Fiscal, cada um no próprio chat.'],
      ['Aprove o que é seu', 'Enviar as guias ao cliente espera você.'],
      ['Receba o resumo', 'O Assistente junta tudo com os números.'],
    ],
  },
  bpo: {
    pedido: 'Monte o lote de pagamentos de sexta da Padaria',
    cadeia: ['i-bpo', 'i-atendimento'],
    espera: { tipo: 'cliente', quem: 'João Batista' },
    guia: [
      ['Peça ao Assistente', 'Clique na caixa: o pedido se escreve sozinho.'],
      ['Veja o time trabalhar', 'O Contas a Pagar monta o lote e passa ao Atendimento, que avisa o cliente.'],
      ['Veja o cliente responder', 'O João responde no WhatsApp e aprova o lote no app.'],
      ['Receba o resumo', 'O Assistente junta tudo com os números.'],
    ],
  },
}
