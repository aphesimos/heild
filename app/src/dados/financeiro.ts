/**
 * Dados de exemplo do Financeiro do escritório (03, 6.8; atividades FIN e
 * GES-001 a 015). Os honorários dos seis clientes de exemplo batem com os da
 * Rentabilidade do Timesheet; o resto da carteira entra agregado.
 */

export type FormaPagamento = 'boleto' | 'pix' | 'pix_automatico' | 'debito'
export const rotuloForma: Record<FormaPagamento, string> = { boleto: 'Boleto', pix: 'Pix', pix_automatico: 'Pix Automático', debito: 'Débito' }

export type Indice = 'IPCA' | 'INPC' | 'IGP-M' | 'salário mínimo' | 'sem reajuste'

export interface ItemContrato {
  id: string
  descricao: string
  setor: string
  valor: number
  /** Faixa contratada: o que o valor cobre. */
  faixa?: string
}

export interface Contrato {
  id: string
  cliente: string
  regime: string
  itens: ItemContrato[]
  vencimentoDia: number
  forma: FormaPagamento
  indice: Indice
  dataBase: string
  decimoTerceiro: boolean
  centroCusto: string
  retencoes: string[]
  indicadoPor?: string
  versao: number
  vigenteDesde: string
  situacao: 'vigente' | 'acima_da_faixa' | 'reajuste_agendado' | 'sem_contrato' | 'em_acordo'
  /** Por que está acima da faixa. */
  alerta?: string
}

export const contratos: Contrato[] = [
  {
    id: 'ct1',
    cliente: 'Transportes Rota Sul S.A.',
    regime: 'Lucro Real',
    itens: [
      { id: 'i1', descricao: 'Contabilidade e Lucro Real', setor: 'Contábil', valor: 7200, faixa: 'até 3 filiais' },
      { id: 'i2', descricao: 'Fiscal (apurações e SPED)', setor: 'Fiscal', valor: 4100 },
      { id: 'i3', descricao: 'Folha', setor: 'DP', valor: 3500, faixa: 'até 60 funcionários' },
    ],
    vencimentoDia: 20,
    forma: 'pix_automatico',
    indice: 'IPCA',
    dataBase: 'março',
    decimoTerceiro: true,
    centroCusto: 'Carteira Fernanda',
    retencoes: ['IRRF 1,5%', 'CSRF 4,65%'],
    versao: 4,
    vigenteDesde: '03/2026',
    situacao: 'vigente',
  },
  {
    id: 'ct2',
    cliente: 'Metalúrgica Andrade Ltda',
    regime: 'Lucro Presumido',
    itens: [
      { id: 'i1', descricao: 'Contabilidade', setor: 'Contábil', valor: 2900 },
      { id: 'i2', descricao: 'Fiscal', setor: 'Fiscal', valor: 2600, faixa: 'até 150 notas/mês' },
      { id: 'i3', descricao: 'Folha', setor: 'DP', valor: 2000, faixa: 'até 25 funcionários' },
    ],
    vencimentoDia: 20,
    forma: 'boleto',
    indice: 'INPC',
    dataBase: 'janeiro',
    decimoTerceiro: true,
    centroCusto: 'Carteira João',
    retencoes: ['IRRF 1,5%'],
    indicadoPor: 'Sindicato da Indústria',
    versao: 3,
    vigenteDesde: '01/2026',
    situacao: 'reajuste_agendado',
  },
  {
    id: 'ct3',
    cliente: 'Loja Bela Vista Eireli',
    regime: 'Simples Nacional',
    itens: [
      { id: 'ib', descricao: 'BPO financeiro', setor: 'BPO', valor: 1380, faixa: 'até 500 lançamentos' },
      { id: 'i1', descricao: 'Contabilidade e Simples', setor: 'Contábil', valor: 2200 },
      { id: 'i2', descricao: 'Fiscal e notas', setor: 'Fiscal', valor: 1400, faixa: 'até 120 notas/mês' },
      { id: 'i3', descricao: 'Folha', setor: 'DP', valor: 800, faixa: 'até 5 funcionários' },
    ],
    vencimentoDia: 15,
    forma: 'boleto',
    indice: 'IPCA',
    dataBase: 'maio',
    decimoTerceiro: true,
    centroCusto: 'Carteira Fernanda',
    retencoes: [],
    versao: 2,
    vigenteDesde: '05/2025',
    situacao: 'acima_da_faixa',
    alerta: '168 notas/mês nos últimos 3 meses (contrato: até 120)',
  },
  {
    id: 'ct4',
    cliente: 'Clínica Sorriso Ltda',
    regime: 'Lucro Presumido',
    itens: [
      { id: 'ib', descricao: 'BPO financeiro', setor: 'BPO', valor: 1200, faixa: 'até 300 lançamentos' },
      { id: 'i1', descricao: 'Contabilidade', setor: 'Contábil', valor: 2100 },
      { id: 'i2', descricao: 'Fiscal e ISS', setor: 'Fiscal', valor: 1800 },
    ],
    vencimentoDia: 25,
    forma: 'pix',
    indice: 'IPCA',
    dataBase: 'outubro',
    decimoTerceiro: false,
    centroCusto: 'Carteira João',
    retencoes: ['ISS 2% (tomador)'],
    versao: 1,
    vigenteDesde: '10/2026',
    situacao: 'vigente',
  },
  {
    id: 'ct5',
    cliente: 'Padaria Pão Quente ME',
    regime: 'Simples Nacional',
    itens: [
      { id: 'ib', descricao: 'BPO financeiro', setor: 'BPO', valor: 1450, faixa: 'até 500 lançamentos' },
      { id: 'i1', descricao: 'Contabilidade e Simples', setor: 'Contábil', valor: 1100 },
      { id: 'i2', descricao: 'Folha', setor: 'DP', valor: 800, faixa: 'até 6 funcionários' },
    ],
    vencimentoDia: 20,
    forma: 'boleto',
    indice: 'IPCA',
    dataBase: 'fevereiro',
    decimoTerceiro: true,
    centroCusto: 'Carteira Ana',
    retencoes: [],
    versao: 2,
    vigenteDesde: '02/2026',
    situacao: 'em_acordo',
    alerta: '8 funcionários desde out/26 (contrato: até 6)',
  },
  {
    id: 'ct6',
    cliente: 'Carlos Menezes',
    regime: 'Pessoa física',
    itens: [],
    vencimentoDia: 20,
    forma: 'pix',
    indice: 'sem reajuste',
    dataBase: '—',
    decimoTerceiro: false,
    centroCusto: 'Carteira Bruno',
    retencoes: [],
    versao: 0,
    vigenteDesde: '—',
    situacao: 'sem_contrato',
  },
  // Empresas só de BPO (10): contrato com o pacote BPO; a fatura é única por cliente.
  ...(
    [
      ['ctb8', 'Mercado Bom Preço Ltda', 'Simples Nacional', 3200, 'até 1.200 lançamentos'],
      ['ctb9', 'Studio Forma Arquitetura Ltda', 'Lucro Presumido', 890, 'até 150 lançamentos'],
      ['ctb10', 'AutoPeças Rota 9 Ltda', 'Simples Nacional', 1100, 'até 400 lançamentos'],
    ] as const
  ).map(
    ([id, cliente, regime, valor, faixa]): Contrato => ({
      id,
      cliente,
      regime,
      itens: [{ id: 'ib', descricao: 'BPO financeiro', setor: 'BPO', valor, faixa }],
      vencimentoDia: 20,
      forma: 'boleto',
      indice: 'IPCA',
      dataBase: 'setembro',
      decimoTerceiro: false,
      centroCusto: 'BPO Marina',
      retencoes: [],
      versao: 1,
      vigenteDesde: '09/2026',
      situacao: 'vigente',
    }),
  ),
]

/** O resto da carteira (136 clientes) entra só nos totais. */
export const restoCarteira = { clientes: 136, receita: 165_900, semContrato: 4 }

export const totalContrato = (c: Contrato) => c.itens.reduce((s, i) => s + i.valor, 0)

export const receitaPorSetor = [
  { nome: 'Contábil', h: 78_400 },
  { nome: 'Fiscal', h: 56_900 },
  { nome: 'DP', h: 41_300 },
  { nome: 'Societário', h: 9_800 },
  { nome: 'Consultoria', h: 7_600 },
  { nome: 'Atendimento', h: 4_400 },
  { nome: 'BPO financeiro', h: 9_220 },
]

export const receitaPorRegime = [
  { nome: 'Simples Nacional', h: 82_100 },
  { nome: 'Lucro Presumido', h: 68_500 },
  { nome: 'Lucro Real', h: 39_600 },
  { nome: 'Pessoa física e outros', h: 8_200 },
]

/** Extras e reembolsos a faturar (FIN-002, GES-002). */
export interface Extra {
  id: string
  cliente: string
  tipo: 'reembolso' | 'servico_avulso' | 'acima_da_faixa'
  descricao: string
  valor: number
  data: string
  origem: string
  comprovante?: boolean
}

export const extras: Extra[] = [
  { id: 'e1', cliente: 'Metalúrgica Andrade Ltda', tipo: 'reembolso', descricao: 'Taxa da Junta: alteração contratual', valor: 548.3, data: '28/10', origem: 'adiantado por Bruno Costa', comprovante: true },
  { id: 'e2', cliente: 'Metalúrgica Andrade Ltda', tipo: 'servico_avulso', descricao: 'Alteração contratual (entrada de sócio)', valor: 1200, data: '28/10', origem: 'pedido no app, autorizado por Ricardo Andrade' },
  { id: 'e3', cliente: 'Loja Bela Vista Eireli', tipo: 'acima_da_faixa', descricao: '48 notas acima da faixa em outubro', valor: 336, data: '31/10', origem: 'contagem automática (GES-015)' },
  { id: 'e4', cliente: 'Transportes Rota Sul S.A.', tipo: 'reembolso', descricao: 'Certidões estaduais (3 filiais)', valor: 96.9, data: '03/11', origem: 'agregador de certidões', comprovante: true },
  { id: 'e5', cliente: 'Carlos Menezes', tipo: 'servico_avulso', descricao: 'IRPF 2026 retificadora', valor: 450, data: '05/11', origem: 'tabela do escritório' },
]

export const rotuloExtra = { reembolso: 'reembolso', servico_avulso: 'serviço avulso', acima_da_faixa: 'acima da faixa' }

/* ---------- Cobrança ---------- */

export type SituacaoFatura = 'a_vencer' | 'vencida' | 'paga' | 'cancelada' | 'em_acordo'
export const rotuloFatura: Record<SituacaoFatura, string> = { a_vencer: 'a vencer', vencida: 'vencida', paga: 'paga', cancelada: 'cancelada', em_acordo: 'em acordo' }

export interface Fatura {
  id: string
  cliente: string
  competencia: string
  valor: number
  vencimento: string
  forma: FormaPagamento
  situacao: SituacaoFatura
  nfse: 'emitida' | 'pendente' | 'erro' | 'cancelada'
  diasAtraso?: number
  pagaEm?: string
  etapaRegua?: string
  historico: { quando: string; texto: string }[]
  /**
   * Cliente com mais de um serviço (decisão de 8/11/2026): uma cobrança só no
   * mês, com cada serviço numa linha e a nota por serviço (cada um com a
   * própria tributação). Sem o campo: um serviço, uma nota.
   */
  linhas?: LinhaFatura[]
  notas?: NotaServico[]
}

export interface LinhaFatura {
  servico: string
  codigo: string
  valor: number
}
export interface NotaServico {
  numero: string
  servicos: string[]
  codigo: string
  iss: string
  valor: number
}

/** Códigos da lista de serviços (LC 116) e ISS de cada serviço do escritório. */
export const tributacaoServico = {
  contabil: { codigo: '17.19', nome: 'Contabilidade', iss: '2%' },
  bpo: { codigo: '17.02', nome: 'Apoio administrativo (BPO financeiro)', iss: '5%' },
}
/**
 * NFS-e padrão nacional (decisão de 8/11/2026): o layout é o mesmo na federação toda, e é ele
 * que decide. Ainda não está confirmado se uma DPS aceita mais de um serviço (Nota Técnica
 * 007/2026); até lá, uma NFS-e por serviço. A chave liga vários itens na mesma nota.
 */
export const nfsePorServico = { regra: 'layout nacional (a confirmar na NT 007/2026)', variosItensNaMesmaNota: false }

/** Mensalidade do BPO de quem também é cliente contábil (os mesmos valores do contrato). */
const mensalidadeBpo: Record<string, number> = { 'Padaria Pão Quente ME': 1450, 'Loja Bela Vista Eireli': 1380, 'Clínica Sorriso Ltda': 1200 }

/** Fatura única do mês com as linhas por serviço e as notas conforme o município. */
export function comServicos(f: Fatura, bpo = mensalidadeBpo[f.cliente]): Fatura {
  if (!bpo || f.competencia !== 'nov/26' || f.linhas) return f
  const linhas: LinhaFatura[] = [
    { servico: 'Honorário contábil', codigo: tributacaoServico.contabil.codigo, valor: f.valor },
    { servico: 'Mensalidade do BPO financeiro', codigo: tributacaoServico.bpo.codigo, valor: bpo },
  ]
  const n = 1200 + f.id.charCodeAt(1)
  const notas: NotaServico[] = nfsePorServico.variosItensNaMesmaNota
    ? [{ numero: `2026/${n}`, servicos: linhas.map((l) => l.servico), codigo: `${tributacaoServico.contabil.codigo} e ${tributacaoServico.bpo.codigo}`, iss: 'por item', valor: f.valor + bpo }]
    : [
        { numero: `2026/${n}`, servicos: ['Honorário contábil'], codigo: tributacaoServico.contabil.codigo, iss: tributacaoServico.contabil.iss, valor: f.valor },
        { numero: `2026/${n + 1}`, servicos: ['Mensalidade do BPO financeiro'], codigo: tributacaoServico.bpo.codigo, iss: tributacaoServico.bpo.iss, valor: bpo },
      ]
  return {
    ...f,
    valor: f.valor + bpo,
    linhas,
    notas,
    historico: [
      ...f.historico,
      { quando: '01/11 06:11', texto: `Fatura única com 2 serviços; ${notas.length === 2 ? 'duas NFS-e (uma por serviço, regra do layout nacional, a confirmar na NT 007/2026)' : 'uma NFS-e com um item por serviço'}` },
    ],
  }
}

const faturasBase: Fatura[] = [
  {
    id: 'f9',
    cliente: 'Padaria Pão Quente ME',
    competencia: 'nov/26',
    valor: 1_900,
    vencimento: '20/11',
    forma: 'boleto',
    situacao: 'a_vencer',
    nfse: 'emitida',
    historico: [{ quando: '01/11 06:10', texto: 'Cobrança gerada: contabilidade R$ 1.100 + folha R$ 800 (a parcela do acordo vai à parte)' }],
  },
  {
    id: 'f1',
    cliente: 'Transportes Rota Sul S.A.',
    competencia: 'nov/26',
    valor: 14_896.9,
    vencimento: '20/11',
    forma: 'pix_automatico',
    situacao: 'a_vencer',
    nfse: 'emitida',
    historico: [
      { quando: '01/11 06:10', texto: 'Cobrança gerada: honorário R$ 14.800,00 + reembolso de certidões R$ 96,90' },
      { quando: '01/11 06:11', texto: 'NFS-e 2026/1184 emitida, com retenção de IRRF e CSRF' },
      { quando: '01/11 06:12', texto: 'Pix Automático agendado para 20/11' },
    ],
  },
  {
    id: 'f2',
    cliente: 'Metalúrgica Andrade Ltda',
    competencia: 'nov/26',
    valor: 9_248.3,
    vencimento: '20/11',
    forma: 'boleto',
    situacao: 'a_vencer',
    nfse: 'emitida',
    etapaRegua: 'lembrete D-3 enviado em 17/11',
    historico: [
      { quando: '01/11 06:10', texto: 'Cobrança gerada: honorário + alteração contratual + reembolso da Junta' },
      { quando: '01/11 06:11', texto: 'NFS-e 2026/1185 emitida' },
      { quando: '01/11 06:12', texto: 'Boleto enviado pelo WhatsApp ao financeiro (Rita Campos)' },
    ],
  },
  {
    id: 'f3',
    cliente: 'Loja Bela Vista Eireli',
    competencia: 'nov/26',
    valor: 4_736,
    vencimento: '16/11',
    forma: 'boleto',
    situacao: 'vencida',
    nfse: 'emitida',
    diasAtraso: 2,
    etapaRegua: 'D+3 amanhã: aviso cordial pelo WhatsApp',
    historico: [
      { quando: '01/11 06:10', texto: 'Cobrança gerada: honorário + 48 notas acima da faixa' },
      { quando: '13/11 09:00', texto: 'Lembrete D-3 enviado (lido)' },
      { quando: '16/11 09:00', texto: 'Aviso no vencimento enviado (lido)' },
    ],
  },
  {
    id: 'f4',
    cliente: 'Padaria Pão Quente ME',
    competencia: 'out/26',
    valor: 950,
    vencimento: '20/10',
    forma: 'boleto',
    situacao: 'em_acordo',
    nfse: 'emitida',
    diasAtraso: 29,
    etapaRegua: 'acordo: 2 parcelas de R$ 475, a 1ª paga em 11/11',
    historico: [
      { quando: '20/10', texto: 'Vencida sem pagamento' },
      { quando: '30/10', texto: 'D+10: cobrança firme enviada' },
      { quando: '03/11', texto: 'Acordo proposto pelo integrante Financeiro e aprovado por Fernanda Lima' },
      { quando: '11/11', texto: '1ª parcela paga' },
    ],
  },
  {
    id: 'f5',
    cliente: 'Clínica Sorriso Ltda',
    competencia: 'nov/26',
    valor: 3_900,
    vencimento: '25/11',
    forma: 'pix',
    situacao: 'a_vencer',
    nfse: 'erro',
    historico: [
      { quando: '01/11 06:10', texto: 'Cobrança gerada' },
      { quando: '01/11 06:11', texto: 'NFS-e recusada pela prefeitura: ISS retido sem o código do serviço do tomador' },
    ],
  },
  {
    id: 'f6',
    cliente: 'Metalúrgica Andrade Ltda',
    competencia: 'out/26',
    valor: 7_500,
    vencimento: '20/10',
    forma: 'boleto',
    situacao: 'paga',
    nfse: 'emitida',
    pagaEm: '19/10',
    historico: [{ quando: '19/10', texto: 'Pago por boleto; baixa automática' }],
  },
  {
    id: 'f7',
    cliente: 'Transportes Rota Sul S.A.',
    competencia: 'out/26',
    valor: 14_800,
    vencimento: '20/10',
    forma: 'pix_automatico',
    situacao: 'paga',
    nfse: 'emitida',
    pagaEm: '20/10',
    historico: [{ quando: '20/10', texto: 'Pix Automático liquidado; baixa automática' }],
  },
]
export const faturas: Fatura[] = faturasBase.map((f) => comServicos(f))

export const resumoCobranca = {
  competencia: 'novembro',
  emitidas: { n: 141, valor: 201_340 },
  recebidas: { n: 38, valor: 61_220 },
  aVencer: { n: 96, valor: 132_480 },
  vencidas: { n: 7, valor: 7_640 },
  inadimplencia90: 1.8,
  proximoCiclo: { data: '01/12', clientes: 142, valor: 203_120, extras: 9, decimo: 61 },
}

/** Recebimentos sem cobrança correspondente (GES-003). */
export const recebimentosSoltos = [
  { id: 'r1', data: '16/11', valor: 1_900, pagador: 'PAO QUENTE PADARIA ME', meio: 'TED', sugestao: 'Padaria Pão Quente ME · out/26 (acordo, 2ª parcela + adiantamento)' },
  { id: 'r2', data: '14/11', valor: 3_200, pagador: 'R. SILVEIRA', meio: 'Pix', sugestao: 'nenhuma cobrança com esse valor' },
]

/** Régua de cobrança (GES-004). */
export interface PassoRegua {
  id: string
  quando: string
  dias: number
  canal: 'WhatsApp' | 'e-mail' | 'WhatsApp e e-mail' | 'app'
  tom: 'lembrete' | 'cordial' | 'firme' | 'formal'
  texto: string
  ativo: boolean
}

export const reguaCobranca: PassoRegua[] = [
  { id: 'p1', quando: '3 dias antes', dias: -3, canal: 'WhatsApp', tom: 'lembrete', texto: 'Oi {{contato}}, seu honorário de {{competencia}} vence dia {{vencimento}}. Segue o boleto e o Pix.', ativo: true },
  { id: 'p2', quando: 'no vencimento', dias: 0, canal: 'WhatsApp', tom: 'lembrete', texto: 'Hoje vence o honorário de {{competencia}}. Se já pagou, desconsidere.', ativo: true },
  { id: 'p3', quando: '3 dias depois', dias: 3, canal: 'WhatsApp', tom: 'cordial', texto: 'Não identificamos o pagamento de {{competencia}}. Mandamos a 2ª via atualizada.', ativo: true },
  { id: 'p4', quando: '10 dias depois', dias: 10, canal: 'WhatsApp e e-mail', tom: 'firme', texto: 'O honorário de {{competencia}} segue em aberto. Podemos combinar um parcelamento?', ativo: true },
  { id: 'p5', quando: '30 dias depois', dias: 30, canal: 'e-mail', tom: 'formal', texto: 'Notificação formal de débito, com prazo de 10 dias, conforme a cláusula 8 do contrato.', ativo: true },
]

/** Política de inadimplência (FIN-009, GES-006). */
export const politicaInadimplencia = {
  pausarExtrasApos: 30,
  suspenderApos: 60,
  juros: '1% ao mês',
  multa: '2%',
  descontoMaxAcordo: 10,
  parcelasMax: 6,
  alcadaAcordo: 'Administrador',
}

export const provedorCobranca = { nome: 'Banco Inter (API PJ)', conta: 'ag 0001 · cc 1234567-8', boleto: 'R$ 1,90', pix: 'grátis', pixAutomatico: 'R$ 0,90', credito: 'D+0', autorizacoesPix: 41 }

export const nfseEscritorio = { emissor: 'Emissor Nacional (NFS-e padrão nacional)', serie: '2026', ultimo: 1189, certificado: 'e-CNPJ A1 · vence 14/03/2027', envio: 'junto com a cobrança', codigoServico: '17.19 · Contabilidade' }

/* ---------- Caixa ---------- */

export const contasBancarias = [
  { id: 'b1', nome: 'Inter PJ (cobrança)', saldo: 96_420, atualizado: 'há 4 min', via: 'API do banco' },
  { id: 'b2', nome: 'Itaú PJ (pagamentos)', saldo: 58_310, atualizado: 'hoje 06:00', via: 'Open Finance' },
  { id: 'b3', nome: 'Cartão Itaú Empresas', saldo: -6_840, atualizado: 'hoje 06:00', via: 'Open Finance', fatura: 'fecha 25/11' },
]

export const mesesCaixa = ['jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai']
/** Índice do primeiro mês projetado. */
export const inicioProjecao = 5
export const fluxoCaixa = {
  entradas: [182, 186, 188, 190, 193, 201, 264, 196, 199, 214, 206, 208],
  saidas: [151, 149, 156, 158, 161, 163, 214, 170, 166, 168, 171, 169],
  marcos: [
    { mes: 6, texto: '13º dos clientes entra; 13º e férias da equipe saem' },
    { mes: 9, texto: 'reajustes de março (38 contratos)' },
  ],
}

export type SituacaoConta = 'a_aprovar' | 'aprovada' | 'paga' | 'agendada'
export interface ContaPagar {
  id: string
  fornecedor: string
  categoria: string
  valor: number
  vencimento: string
  origem: 'DDA' | 'e-mail' | 'manual' | 'recorrente' | 'WhatsApp'
  situacao: SituacaoConta
  alcada?: string
  /** Alerta do integrante: possível duplicidade ou fornecedor novo (09, 6.1). */
  alerta?: string
  /** Código de barras ou chave Pix lidos na captura. */
  codigo?: string
}

/**
 * Titular do componente financeiro (DA-02.1; 09, 10.6): o mesmo componente de
 * contas a pagar, conciliação, caixa e DRE serve ao escritório e, no BPO, a cada
 * empresa cliente. A tela mostra de quem é o dinheiro.
 */
export type Titular = { tipo: 'escritorio'; nome: string } | { tipo: 'empresa'; clienteId: string; nome: string }
export const titularEscritorio: Titular = { tipo: 'escritorio', nome: 'Contábil Andrade & Lima Ltda' }

export const contasPagar: ContaPagar[] = [
  { id: 'cp1', fornecedor: 'Aluguel · Imobiliária Centro', categoria: 'Ocupação', valor: 9_800, vencimento: '20/11', origem: 'recorrente', situacao: 'agendada' },
  { id: 'cp2', fornecedor: 'Domínio Sistemas', categoria: 'Software', valor: 2_340, vencimento: '22/11', origem: 'DDA', situacao: 'a_aprovar', alcada: 'até R$ 5 mil: Gestor' },
  { id: 'cp3', fornecedor: 'Plataforma (esta assinatura)', categoria: 'Software', valor: 1_690, vencimento: '01/12', origem: 'e-mail', situacao: 'aprovada' },
  { id: 'cp4', fornecedor: 'Certisign: 3 e-CPF', categoria: 'Certificados', valor: 597, vencimento: '24/11', origem: 'e-mail', situacao: 'a_aprovar', alcada: 'até R$ 5 mil: Gestor' },
  { id: 'cp5', fornecedor: 'DAS do escritório (out/26)', categoria: 'Tributos próprios', valor: 11_480, vencimento: '20/11', origem: 'DDA', situacao: 'a_aprovar', alcada: 'acima de R$ 10 mil: Administrador' },
  { id: 'cp6', fornecedor: 'Integra Contador (Serpro)', categoria: 'APIs e serviços', valor: 812.4, vencimento: '18/11', origem: 'DDA', situacao: 'a_aprovar', alcada: 'até R$ 5 mil: Gestor' },
  {
    id: 'cp7',
    fornecedor: 'Domínio Sistemas',
    categoria: 'Software',
    valor: 2_340,
    vencimento: '22/11',
    origem: 'e-mail',
    situacao: 'a_aprovar',
    alcada: 'até R$ 5 mil: Gestor',
    alerta: 'possível duplicidade: mesmo valor e vencimento do boleto do DDA (cp2)',
  },
  {
    id: 'cp8',
    fornecedor: 'Gráfica Rápida Ltda',
    categoria: 'Material de escritório',
    valor: 1_280,
    vencimento: '23/11',
    origem: 'e-mail',
    situacao: 'a_aprovar',
    alcada: 'até R$ 5 mil: Gestor',
    alerta: 'fornecedor novo: confira o CNPJ antes de aprovar',
  },
  { id: 'cp9', fornecedor: 'Folha de outubro (líquido)', categoria: 'Salários e encargos', valor: 78_420, vencimento: '05/11', origem: 'recorrente', situacao: 'paga' },
  { id: 'cp10', fornecedor: 'Energia · Enel', categoria: 'Ocupação', valor: 1_134.7, vencimento: '19/11', origem: 'DDA', situacao: 'agendada' },
]

/** De onde as contas chegam sozinhas (09, 6.1). */
export const capturaContas = [
  { fonte: 'DDA do Itaú', detalhe: 'boletos emitidos contra o CNPJ do escritório', ultima: 'hoje 06:00', novas: 3 },
  { fonte: 'financeiro@contabilandrade.com.br', detalhe: 'boletos e notas que chegam por e-mail', ultima: 'há 20 min', novas: 2 },
  { fonte: 'Recorrentes', detalhe: 'aluguel, folha, assinaturas', ultima: 'geradas no dia 1', novas: 0 },
]

/** Resumo da conciliação de hoje (09, 6.2): o que casou sozinho e por qual regra. */
export const conciliacaoResumo = { periodo: '01/11 a 17/11', lancamentos: 214, automaticos: 197, porRegra: 11, pendentes: 6, saldoBanco: 58_310, saldoSistema: 58_310 }

export const regrasPropostas = [
  { id: 'rg1', padrao: 'GOOGLE *WORKSPACE', categoria: 'Software', vezes: 4, exemplo: '15/11 · R$ 1.062,00' },
  { id: 'rg2', padrao: 'TAR PACOTE SERVICOS', categoria: 'Tarifas bancárias', vezes: 6, exemplo: '16/11 · R$ 89,00' },
]

export const divergencias = [
  { id: 'dv1', texto: 'R$ 1.480 de um pagador desconhecido (PIX REC 12.345.678)', sugestao: 'Metalúrgica Andrade (fatura f1) ou Transportes Rota Sul (f2)?', conta: 'Inter PJ' },
  { id: 'dv2', texto: 'Padaria Pão Quente pagou R$ 2.019,40 por uma fatura de R$ 1.900', sugestao: 'juros e multa de 6 dias: baixar a diferença como receita financeira', conta: 'Inter PJ' },
]

export const consentimentosOpenFinance = [
  { conta: 'Itaú PJ (pagamentos)', vence: '02/12/2026', dias: 25 },
  { conta: 'Cartão Itaú Empresas', vence: '14/03/2027', dias: 127 },
]

export const transacoesConciliar = [
  { id: 't1', data: '16/11', conta: 'Itaú PJ', descricao: 'TAR PACOTE SERVICOS', valor: -89, sugestao: 'Tarifas bancárias', confianca: 'alta' },
  { id: 't2', data: '15/11', conta: 'Cartão Itaú', descricao: 'GOOGLE *WORKSPACE', valor: -1_062, sugestao: 'Software', confianca: 'alta' },
  { id: 't3', data: '15/11', conta: 'Itaú PJ', descricao: 'PIX ENV JOAO P SANTOS', valor: -1_500, sugestao: 'Reembolso a colaborador?', confianca: 'baixa' },
  { id: 't4', data: '14/11', conta: 'Inter PJ', descricao: 'TRANSF ENTRE CONTAS', valor: -40_000, sugestao: 'Transferência entre contas (Inter → Itaú)', confianca: 'alta' },
  { id: 't5', data: '14/11', conta: 'Itaú PJ', descricao: 'PAG BOLETO 03399.12345 CERTISIGN', valor: -597, sugestao: 'Certificados', confianca: 'alta' },
  { id: 't6', data: '13/11', conta: 'Cartão Itaú', descricao: 'UBER *TRIP', valor: -46.9, sugestao: 'Deslocamento?', confianca: 'baixa' },
]

export const planoContas = [
  { grupo: 'Receitas', categorias: ['Honorários mensais', 'Serviços avulsos', '13º honorário', 'Reembolsos de clientes'] },
  { grupo: 'Pessoal', categorias: ['Salários e encargos', 'Pró-labore', 'Benefícios', 'Comissões e PLR'] },
  { grupo: 'Operação', categorias: ['Software', 'APIs e serviços', 'Certificados', 'Ocupação', 'Tarifas bancárias', 'Material de escritório', 'Deslocamento'] },
  { grupo: 'Tributos próprios', categorias: ['DAS', 'ISS fixo', 'Taxas do CRC'] },
]

/** Limite de aprovação de cada pessoa (Configurar › Alçadas); acima disso, o cartão sobe. */
export const limiteAprovacao = { administrador: Infinity, gestor: 5_000 } as const

export const alcadas = [
  { ate: 'R$ 5.000', quem: 'Gestor com o setor Financeiro' },
  { ate: 'R$ 10.000', quem: 'Administrador' },
  { ate: 'acima', quem: 'Administrador + segundo sócio' },
]

/* ---------- Resultado ---------- */

export const indicadores = {
  mrr: 198_400,
  mrrVar: 2.1,
  clientes: 142,
  entradas: 4,
  saidas: 1,
  ticket: 1_397,
  inadimplencia: 1.8,
  margem: 18.6,
}

export interface LinhaDre {
  centro: string
  receita: number
  pessoal: number
  operacao: number
  rateio: number
  horas: number
}

export const dre: LinhaDre[] = [
  { centro: 'Contábil', receita: 78_400, pessoal: 41_200, operacao: 5_100, rateio: 13_900, horas: 412 },
  { centro: 'Fiscal', receita: 56_900, pessoal: 30_800, operacao: 6_300, rateio: 10_400, horas: 338 },
  { centro: 'DP', receita: 41_300, pessoal: 26_900, operacao: 2_800, rateio: 8_100, horas: 296 },
  { centro: 'Societário', receita: 9_800, pessoal: 4_900, operacao: 1_400, rateio: 1_900, horas: 58 },
  { centro: 'Consultoria', receita: 7_600, pessoal: 2_600, operacao: 300, rateio: 1_200, horas: 31 },
  { centro: 'Atendimento', receita: 4_400, pessoal: 7_300, operacao: 1_900, rateio: 1_500, horas: 84 },
]

export const orcamento = [
  { nome: 'Receita', orcado: 196_000, realizado: 198_400 },
  { nome: 'Pessoal', orcado: 112_000, realizado: 113_700 },
  { nome: 'Software e APIs', orcado: 16_500, realizado: 17_800 },
  { nome: 'Ocupação', orcado: 12_000, realizado: 11_640 },
  { nome: 'Tributos próprios', orcado: 11_000, realizado: 11_480 },
]

export const custosVariaveis = [
  { cliente: 'Transportes Rota Sul S.A.', itens: 'Integra Contador 96 consultas · WhatsApp 210 msgs · certidões 9', valor: 210, decisao: 'absorver' as const },
  { cliente: 'Metalúrgica Andrade Ltda', itens: 'Integra 41 · Junta 1 ato · WhatsApp 120', valor: 96, decisao: 'absorver' as const },
  { cliente: 'Padaria Pão Quente ME', itens: 'Integra 18 · WhatsApp 340 msgs', valor: 40, decisao: 'repassar' as const },
]

export const socios = [
  { nome: 'Fernanda Lima', participacao: 60, proLabore: 12_000 },
  { nome: 'João Pereira', participacao: 40, proLabore: 9_000 },
]

export const comissoes = [
  { pessoa: 'Bruno Costa', base: 'receita nova recebida: R$ 3.900 (Clínica Sorriso)', regra: '50% do 1º honorário', valor: 1_950 },
  { pessoa: 'Sindicato da Indústria', base: 'indicação da Metalúrgica Andrade', regra: '5% ao mês por 12 meses', valor: 375 },
  { pessoa: 'Equipe (PLR)', base: 'provisão do 2º semestre: retenção 98%, captura 91%', regra: '1/6 do PLR previsto', valor: 2_400 },
]

export const importacaoOrigens = ['Conexa', 'Omie', 'Conta Azul', 'Nibo', 'Domínio Honorários', 'Planilha (modelo)'] as const

/** Nomes das empresas com o pacote BPO (as mesmas do cadastro). */
const empresasComBpo = ['Padaria Pão Quente ME', 'Loja Bela Vista Eireli', 'Clínica Sorriso Ltda', 'Mercado Bom Preço Ltda', 'Studio Forma Arquitetura Ltda', 'AutoPeças Rota 9 Ltda']

/**
 * Contratos do escritório pelo cenário (10, 2): com contabilidade, a fatura é
 * única (contábil e BPO no mesmo contrato); no escritório só de BPO, só os
 * clientes e o item do BPO.
 */
export function contratosDoCenario(cenario: 'contabil_bpo' | 'bpo_puro'): Contrato[] {
  if (cenario === 'contabil_bpo') return contratos
  return contratos
    .filter((c) => c.itens.some((i) => i.setor === 'BPO'))
    .map((c) => ({
      ...c,
      itens: c.itens.filter((i) => i.setor === 'BPO'),
      centroCusto: 'BPO Marina',
      // A mesma contagem da aba Volume do BPO.
      ...(c.cliente === 'Loja Bela Vista Eireli' ? { situacao: 'acima_da_faixa' as const, alerta: '540 lançamentos em novembro (contrato: até 500)' } : { situacao: 'vigente' as const, alerta: undefined }),
    }))
}

/** Faturas de novembro pelo cenário; no só BPO, uma por empresa com o honorário do pacote. */
export function faturasDoCenario(cenario: 'contabil_bpo' | 'bpo_puro'): Fatura[] {
  if (cenario === 'contabil_bpo') return faturas
  return contratosDoCenario('bpo_puro')
    .filter((c) => empresasComBpo.includes(c.cliente))
    .map((c, i) => {
      const valor = c.itens.reduce((s, x) => s + x.valor, 0)
      const vencida = c.cliente === 'Loja Bela Vista Eireli'
      return {
        id: `fb${i + 1}`,
        cliente: c.cliente,
        competencia: 'nov/26',
        valor,
        vencimento: vencida ? '16/11' : '20/11',
        forma: c.forma,
        situacao: vencida ? 'vencida' : i % 2 ? 'paga' : 'a_vencer',
        nfse: 'emitida',
        ...(vencida ? { diasAtraso: 2, etapaRegua: 'D+3 cordial amanhã' } : {}),
        ...(!vencida && i % 2 ? { pagaEm: '16/11' } : {}),
        historico: [{ quando: '01/11 06:10', texto: `Cobrança gerada: BPO financeiro ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` }],
      } satisfies Fatura
    })
}
