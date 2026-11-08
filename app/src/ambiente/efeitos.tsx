import { useLoja } from './loja'
import { integranteDoSetor, useConversaDe } from './fluxos'
import { useSessao } from './sessao'

/**
 * O que cada cartão de aprovação faz no escritório quando a pessoa decide.
 * Aprovar executa (a tarefa anda, o cliente recebe, o evento fica com o nome
 * de quem aprovou); recusar devolve o trabalho a uma pessoa; editar e aprovar
 * vale como aprovar, com a edição registrada.
 */
export function useEfeitosCartao() {
  const loja = useLoja()
  const { usuario } = useSessao()
  const conversaDe = useConversaDe()

  return (cartao: string, decisao: string) => {
    loja.decidir(cartao, decisao)
    const aprovou = decisao !== 'recusar'
    const quem = usuario.nome
    if (!aprovou) {
      loja.registrar(quem, `Recusou o cartão ${cartao}`)
      loja.toast('Recusado. O integrante não executa; a tarefa volta para uma pessoa decidir.')
      return
    }
    const editado = decisao === 'editar_e_aprovar' ? ' (com edição)' : ''
    switch (cartao) {
      case 'k3': {
        // Geral → Fiscal: PGDAS-D do Café Central
        loja.atualizarTarefa('t0', { status: 'concluida', cartaoPendente: false })
        const cv = conversaDe('Café Central ME', 'fiscal', 'João Batista')
        loja.mensagemCrm(cv, {
          tipo: 'mensagem',
          de: 'integrante',
          autor: 'Fiscal',
          setor: 'fiscal',
          canal: 'whatsapp',
          texto: 'Oi, João! O PGDAS-D de outubro do Café Central foi transmitido. O DAS de R$ 1.390,00 vence em 20/11; segue a guia.',
          entrega: 'enviada',
          anexos: [{ nome: 'DAS 10-2026 Café Central.pdf', tipo: 'pdf' }],
        })
        loja.registrar(quem, `Aprovou${editado} a transmissão do PGDAS-D 10/2026 do Café Central ME (FIS-009)`)
        loja.toast('PGDAS-D do Café Central transmitido. A guia foi para o João Batista.', { modulo: 'crm', aba: 'conversas', conversa: cv }, 'Ver a conversa')
        return
      }
      case 'fk1': {
        loja.registrar(quem, `Aprovou${editado} a transmissão do PGDAS-D 10/2026 de 14 clientes (FIS-009)`)
        loja.avisar({ para: [usuario.id], tipo: 'sistema', setor: 'fiscal', titulo: '14 PGDAS-D transmitidos', detalhe: 'as guias saem pela régua de cada cliente; recibos na pasta de cada um', destino: { modulo: 'painel', aba: 'fiscal' } })
        loja.toast('14 declarações transmitidas. As guias saem pela régua de cada cliente.', { modulo: 'painel', aba: 'fiscal' }, 'Ver na aba Fiscal')
        return
      }
      case 'dk1':
      case 'dk0': {
        loja.decidir('dk1', decisao)
        loja.decidir('dk0', decisao)
        loja.atualizarTarefa('t10', { status: 'em_andamento', cartaoPendente: false })
        const dp = integranteDoSetor('dp')
        loja.mensagemTime(dp, {
          autor: { tipo: 'integrante', setor: 'dp' },
          texto: 'Gerei os dois contratos de experiência 45+45 da Metalúrgica Andrade. Falta mandar para assinatura do Rafael Moura e da Juliana Prado.',
          cartoes: [{ tipo: 'documento', id: `doc-ct-${Date.now()}`, nome: 'Contratos de experiência · Metalúrgica Andrade.pdf', especie: 'documento', cliente: 'Metalúrgica Andrade Ltda', competencia: '11/2026' }],
        })
        loja.registrar(quem, `Aprovou${editado} contrato de experiência 45+45 (DP-004 · Metalúrgica Andrade Ltda)`)
        loja.toast('Contratos gerados. O DP deixou os PDFs no chat para enviar à assinatura.', { modulo: 'inicio', aba: 'time', integrante: dp }, 'Ver no Time')
        return
      }
      case 'sk2': {
        loja.atualizarTarefa('t18', { status: 'aguardando_cliente', diasAguardando: 0 })
        const cv = conversaDe('Metalúrgica Andrade Ltda', 'societario', 'Helena Andrade')
        loja.mensagemCrm(cv, {
          tipo: 'mensagem',
          de: 'integrante',
          autor: 'Societário',
          setor: 'societario',
          canal: 'whatsapp',
          texto: 'Oi, Helena! A JUCESP pediu a sua assinatura no instrumento da alteração contratual. Mandei o link de assinatura eletrônica para o seu e-mail; leva 2 minutos.',
          entrega: 'enviada',
        })
        loja.registrar(quem, `Aprovou${editado} o envio para assinatura de Helena Andrade (SOC-031 · Metalúrgica Andrade Ltda)`)
        loja.toast('Pedido de assinatura enviado à Helena Andrade.', { modulo: 'crm', aba: 'conversas', conversa: cv }, 'Ver a conversa')
        return
      }
      case 'fik1': {
        loja.registrar(quem, `Aprovou${editado} as cobranças de dezembro: 142 clientes, R$ 203.120 (FIN-005)`)
        loja.avisar({ para: [usuario.id], tipo: 'sistema', setor: 'financeiro_escritorio', titulo: 'Cobranças de dezembro aprovadas', detalhe: 'saem em 01/12 às 06:00, com NFS-e; a régua acompanha cada uma', destino: { modulo: 'financeiro', aba: 'cobranca' } })
        loja.toast('Cobranças de dezembro aprovadas: saem em 01/12 às 06:00.', { modulo: 'financeiro', aba: 'cobranca' }, 'Ver na Cobrança')
        return
      }
      default:
        loja.registrar(quem, `Aprovou${editado} o cartão ${cartao}`)
        loja.toast('Aprovado. O integrante segue com o trabalho.')
    }
  }
}
