export interface ConfigDemo {
  /** Conta da demonstração. */
  usuario: string
  /** Integrante que começa o pedido. */
  integrante: string
  pedidos?: string[]
  sugestoes?: string[]
  /** Setores do time que aparecem na demonstração. */
  setores: string[]
}

/**
 * As páginas do site da Heild (pedido do usuário, 18/11/2026): a principal, da
 * empresa, e uma por plataforma, todas no mesmo molde. Uma plataforma nova é
 * uma entrada a mais aqui; a lista de plataformas e o rodapé passam a mostrá-la.
 */

export interface Plataforma {
  id: 'contabil' | 'bpo'
  nome: string
  /** Forma do I da logo para esta área (`<heild-logo animation>`). */
  animacao: string
  resumo: string
  demo: ConfigDemo
}

export const plataformas: Plataforma[] = [
  {
    id: 'contabil',
    nome: 'Heild Contábil',
    animacao: 'contabil',
    resumo: 'Fiscal, DP, contábil, societário e notas, com o Painel de cada setor e o integrante que prepara o trabalho dele.',
    demo: {
      usuario: 'u1',
      integrante: 'i-contabil',
      setores: ['consultor', 'fiscal', 'dp', 'contabil', 'societario', 'notas', 'gestao_atendimento'],
      pedidos: ['Feche outubro da Metalúrgica Andrade', 'Prepare a admissão dos 2 funcionários da Padaria', 'A Clínica Sorriso pode usar o fator R em 2027?'],
      sugestoes: ['Quais clientes estão aguardando documento há mais de 5 dias?', 'O que o time fez ontem para a Metalúrgica Andrade?'],
    },
  },
  {
    id: 'bpo',
    nome: 'Heild BPO',
    animacao: 'bpo',
    resumo: 'Contas a pagar, lotes com a aprovação do cliente no app, conciliação e o relatório do mês, para quem faz o financeiro dos clientes.',
    demo: {
      usuario: 'u1',
      integrante: 'i-bpo',
      setores: ['bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial', 'gestao_atendimento'],
      pedidos: ['Monte o lote de pagamentos de sexta da Padaria', 'Concilie outubro do Studio Forma'],
      sugestoes: ['Qual lote vence hoje sem aprovação?', 'Como está o caixa do Mercado Bom Preço?'],
    },
  },
]

export const CONTATO = 'contato@heild.example'
