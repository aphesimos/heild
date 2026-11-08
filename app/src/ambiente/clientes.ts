import { servicosIniciais, type EstadoServico } from '@/dados/servicos-extras'
import type { SetorIntegrante } from '@/theme/tipos'

/**
 * Cadastro canônico dos clientes do escritório de demonstração: contatos de
 * cada empresa (com os assuntos que recebem, 04 A1), quem responde por cada
 * setor e onde as conversas de cada setor estão no CRM. Todo módulo usa estes
 * nomes; o que não estiver aqui não existe no escritório.
 */

export interface ContatoCliente {
  nome: string
  papel: 'sócio' | 'sócia' | 'financeiro' | 'RH' | 'fiscal da empresa' | 'diretor financeiro' | 'titular'
  whatsapp?: string
  email?: string
  /** Assuntos que recebe (guias, folha, documentos_pendentes, honorarios, societario, comunicados). */
  assuntos: string[]
  /** Usa o app do cliente. */
  app?: boolean
  /** BPO (10, 3.9): até quanto aprova um pagamento, e se entra na aprovação reforçada (2 pessoas). */
  alcadaPagamento?: number
  reforcada?: boolean
}

export interface FichaCliente {
  id: string
  contatos: ContatoCliente[]
  responsaveis: Partial<Record<SetorIntegrante, string>>
  /** Conversa do CRM de cada setor (quando existe). */
  conversas: Partial<Record<SetorIntegrante, string>>
  contrato?: string
  observacao?: string
  /** Serviços extras ligados pelo escritório (06, 8); o que não está aqui fica disponível. */
  servicos?: Partial<Record<string, EstadoServico>>
}

export const fichas: Record<string, FichaCliente> = {
  c1: {
    id: 'c1',
    contatos: [
      { nome: 'Marcos Andrade', papel: 'sócio', email: 'marcos@metalurgicaandrade.com.br', whatsapp: '+55 11 98200-3301', assuntos: ['societario', 'comunicados', 'documentos_pendentes'], app: true },
      { nome: 'Helena Andrade', papel: 'sócia', whatsapp: '+55 11 98555-0199', assuntos: ['folha'], app: true },
      { nome: 'Rita Campos', papel: 'financeiro', whatsapp: '+55 11 98123-4410', email: 'rita@metalurgicaandrade.com.br', assuntos: ['guias', 'honorarios'], app: true },
    ],
    responsaveis: { fiscal: 'Fernanda Lima', notas: 'Rafael Nunes', contabil: 'João Pereira', dp: 'Ana Souza', societario: 'Bruno Costa', consultor: 'Fernanda Lima' },
    conversas: { fiscal: 'cv1', contabil: 'cv4', dp: 'cv8' },
    contrato: 'ct2',
    observacao: 'Filial nova em Sorocaba em estudo (parecer de regime com a Consultoria).',
  },
  c2: {
    id: 'c2',
    contatos: [{ nome: 'João Batista', papel: 'sócio', whatsapp: '+55 11 97440-1022', assuntos: ['guias', 'folha', 'documentos_pendentes', 'honorarios', 'comunicados', 'pagamentos'], app: true, alcadaPagamento: 20_000, reforcada: true }],
    responsaveis: { fiscal: 'Rafael Nunes', contabil: 'João Pereira', dp: 'Ana Souza', bpo_financeiro: 'Lucas Prado' },
    conversas: { dp: 'cv2', fiscal: 'cv9' },
    contrato: 'ct5',
    observacao: 'Em acordo de honorários (2 parcelas). Passou da faixa de funcionários.',
  },
  c3: {
    id: 'c3',
    contatos: [
      { nome: 'Sérgio Prates', papel: 'titular', whatsapp: '+55 11 97333-8820', assuntos: ['guias', 'honorarios', 'societario', 'comunicados', 'pagamentos'], app: true, alcadaPagamento: 20_000, reforcada: true },
      { nome: 'Ana Prates', papel: 'RH', assuntos: ['folha'], app: true },
    ],
    responsaveis: { fiscal: 'Rafael Nunes', notas: 'Rafael Nunes', dp: 'Ana Souza', contabil: 'João Pereira', bpo_financeiro: 'Lucas Prado' },
    conversas: { dp: 'cv3' },
    contrato: 'ct3',
    observacao: 'Acima da faixa de notas há 3 meses: aditivo em discussão.',
  },
  c4: {
    id: 'c4',
    contatos: [
      {
        nome: 'Dra. Lívia Mendes',
        papel: 'sócia',
        whatsapp: '+55 11 99610-5521',
        email: 'livia@clinicasorriso.com.br',
        assuntos: ['guias', 'honorarios', 'documentos_pendentes', 'comunicados', 'pagamentos'],
        app: true,
        alcadaPagamento: 20_000,
        reforcada: true,
      },
    ],
    responsaveis: { contabil: 'João Pereira', fiscal: 'Fernanda Lima', notas: 'Rafael Nunes', bpo_financeiro: 'Marina Teixeira' },
    conversas: { contabil: 'cv7' },
    contrato: 'ct4',
    observacao: 'Em implantação desde outubro.',
  },
  c5: {
    id: 'c5',
    contatos: [
      { nome: 'Paula Reis', papel: 'fiscal da empresa', email: 'paula.reis@rotasul.com.br', assuntos: ['guias', 'documentos_pendentes'] },
      { nome: 'Otávio Rocha', papel: 'diretor financeiro', email: 'otavio.rocha@rotasul.com.br', whatsapp: '+55 11 98777-2010', assuntos: ['honorarios', 'societario', 'comunicados'], app: true },
    ],
    responsaveis: { fiscal: 'Fernanda Lima', contabil: 'João Pereira', dp: 'Ana Souza' },
    conversas: { fiscal: 'cv6' },
    contrato: 'ct1',
  },
  c7: {
    id: 'c7',
    contatos: [{ nome: 'João Batista', papel: 'sócio', whatsapp: '+55 11 97440-1022', assuntos: ['guias', 'folha', 'documentos_pendentes', 'honorarios', 'comunicados'], app: true }],
    responsaveis: { fiscal: 'Rafael Nunes', contabil: 'João Pereira', dp: 'Ana Souza' },
    conversas: {},
    observacao: 'Mesmo sócio da Padaria Pão Quente (João Batista).',
  },
  c8: {
    id: 'c8',
    contatos: [
      { nome: 'Rogério Almeida', papel: 'sócio', whatsapp: '+55 11 98420-1180', email: 'rogerio@bompreco.com.br', assuntos: ['honorarios', 'comunicados', 'pagamentos'], app: true, alcadaPagamento: 50_000, reforcada: true },
      { nome: 'Patrícia Almeida', papel: 'financeiro', whatsapp: '+55 11 98420-1181', email: 'financeiro@bompreco.com.br', assuntos: ['pagamentos', 'documentos_pendentes'], app: true, alcadaPagamento: 20_000, reforcada: true },
    ],
    responsaveis: { bpo_financeiro: 'Lucas Prado' },
    conversas: {},
    observacao: 'Só BPO financeiro. Contabilidade com outro escritório; ERP Nibo, por arquivo.',
  },
  c9: {
    id: 'c9',
    contatos: [
      {
        nome: 'Beatriz Forma',
        papel: 'sócia',
        whatsapp: '+55 11 99330-4410',
        email: 'beatriz@studioforma.arq.br',
        assuntos: ['honorarios', 'comunicados', 'pagamentos', 'documentos_pendentes'],
        app: true,
        alcadaPagamento: 20_000,
        reforcada: true,
      },
    ],
    responsaveis: { bpo_financeiro: 'Marina Teixeira' },
    conversas: {},
    observacao: 'Só BPO financeiro. Sem ERP: livro próprio na plataforma.',
  },
  c10: {
    id: 'c10',
    contatos: [{ nome: 'Wagner Lima', papel: 'sócio', whatsapp: '+55 11 97710-2299', assuntos: ['honorarios', 'comunicados', 'pagamentos', 'documentos_pendentes'], app: true, alcadaPagamento: 20_000, reforcada: true }],
    responsaveis: { bpo_financeiro: 'Lucas Prado' },
    conversas: {},
    observacao: 'Só BPO financeiro, em paralelo até 30/11 (o BPO prepara, o cliente ainda paga).',
  },
  c6: {
    id: 'c6',
    contatos: [{ nome: 'Carlos Menezes', papel: 'titular', whatsapp: '+55 11 99100-4433', assuntos: ['guias', 'honorarios', 'documentos_pendentes'] }],
    responsaveis: { fiscal: 'Rafael Nunes' },
    conversas: {},
    observacao: 'Pessoa física: IRPF e carnê-leão. Sem contrato estruturado.',
  },
}

/** Quem recebe um assunto: o contato com o assunto; sem ninguém, o primeiro sócio (04 A1). */
export function contatoPara(clienteId: string, assunto: string): ContatoCliente | undefined {
  const f = fichas[clienteId]
  if (!f) return undefined
  return f.contatos.find((c) => c.assuntos.includes(assunto)) ?? f.contatos.find((c) => c.papel.startsWith('sóci') || c.papel === 'titular')
}

// Serviços extras já ligados em cada cliente.
for (const [id, sv] of Object.entries(servicosIniciais)) if (fichas[id]) fichas[id].servicos = sv
