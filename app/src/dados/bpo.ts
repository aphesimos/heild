import type { ContaPagar, Titular } from './financeiro'

/**
 * Pacote BPO Financeiro (subplano 10, cenário 1: a Contábil Andrade & Lima
 * comprou o BPO como módulo). O BPO trabalha sobre o espelho do ERP que o
 * cliente já usa (10, 3.0); a plataforma é a fonte da aprovação, da alçada,
 * da fila, do SLA e da trilha. Nenhum pagamento sai sem aprovação humana
 * registrada; pagar e transferir nunca viram automáticos (B3).
 */

export type ModoErp = 'E1' | 'E2' | 'E3'
export type SituacaoSync = 'ok' | 'atrasada' | 'credencial_vencida' | 'arquivo' | 'livro_proprio'
export type CorAudit = 'verde' | 'amarelo' | 'vermelho'
export type ModoPagamento = 'M1' | 'M2' | 'M3'

export const rotuloModoErp: Record<ModoErp, string> = { E1: 'API (leitura e escrita)', E2: 'arquivo (OFX, CSV)', E3: 'livro próprio' }
export const rotuloSync: Record<SituacaoSync, string> = { ok: 'sincronizado', atrasada: 'sincronização atrasada', credencial_vencida: 'credencial vencida', arquivo: 'modo arquivo', livro_proprio: 'livro próprio' }
export const rotuloModoPagamento: Record<ModoPagamento, string> = { M1: 'M1 · o cliente libera no banco', M2: 'M2 · pagamento por API após o cartão', M3: 'M3 · o BPO libera até um teto delegado' }

/** Conta a pagar do BPO: a do Financeiro, com as etapas da segregação (10, 3.5 e 3.8). */
export interface ContaBpo extends ContaPagar {
  digitadoPor: string
  conferidoPor?: string
  lote?: string
}

export interface ItemLote {
  conta: string
  fornecedor: string
  valor: number
  vencimento: string
  marca: string
  alerta?: string
}

/** Lote que vira cartão para o cliente aprovar no app (10, 3.6). */
export interface LoteBpo {
  id: string
  clienteId: string
  titulo: string
  itens: ItemLote[]
  saldo: number
  expira: string
  preparadoPor: string
  conferidoPor: string
  /** Faixa da alçada (10, 3.7): até 2 mil, 2 a 20 mil (1 aprovador), acima de 20 mil (2). */
  aprovadoresNecessarios: number
}

export interface Rotina {
  id: string
  cadencia: 'diária' | 'semanal' | 'mensal'
  nome: string
  feita: boolean
  quando: string
  codigo: string
}

export interface EmpresaBpo {
  clienteId: string
  nome: string
  /** Também cliente contábil (o mesmo cadastro, com cor própria no calendário). */
  contabil: boolean
  erp: { provedor: string; modo: ModoErp; situacao: SituacaoSync; ultima: string; escopo: string }
  audit: { cor: CorAudit; motivos: string[] }
  responsavel: string
  analista: string
  modoPagamento: ModoPagamento
  alcadas: { faixa1: number; faixa2: number; janela: string; aceitoPor: string; vigencia: string }
  bancos: { id: string; nome: string; saldo: number; atualizado: string; via: string }[]
  caixaMinimo: number
  sla: { mes: number; desvios: string[] }
  volume: { lancamentos: number; conciliacoes: number; pagamentos: number; contas: number; faixa: string; limiteFaixa: number }
  honorarioBpo: number
  horasMes: number
  rotinas: Rotina[]
  contas: ContaBpo[]
  transacoes: { id: string; data: string; conta: string; descricao: string; valor: number; sugestao: string; confianca: string }[]
  fluxo: { entradas: number[]; saidas: number[] }
  paraleloAte?: string
}

const rotinasPadrao = (feitasHoje: number): Rotina[] => [
  { id: 'r1', cadencia: 'diária', nome: 'Capturar contas (DDA, e-mail, WhatsApp) e checar duplicidade', feita: feitasHoje > 0, quando: 'hoje', codigo: 'FIN-003' },
  { id: 'r2', cadencia: 'diária', nome: 'Montar a fila de pagamento e pedir a aprovação do cliente', feita: feitasHoje > 1, quando: 'hoje até 11h', codigo: 'FIN-201' },
  { id: 'r3', cadencia: 'diária', nome: 'Baixar e conciliar o extrato', feita: feitasHoje > 2, quando: 'hoje até 17h', codigo: 'FIN-004' },
  { id: 'r4', cadencia: 'semanal', nome: 'Agenda de vencimentos e previsão de caixa', feita: true, quando: 'segunda', codigo: 'FIN-005' },
  { id: 'r5', cadencia: 'mensal', nome: 'Conciliação final, DRE e relatório ao cliente', feita: false, quando: 'até dia 5', codigo: 'FIN-006' },
  { id: 'r6', cadencia: 'mensal', nome: 'Fechamento do mês (entrega à contabilidade)', feita: false, quando: 'até dia 7', codigo: 'BPO-013' },
]

const meses6 = ['set', 'out', 'nov', 'dez', 'jan', 'fev']
export const mesesBpo = meses6
export const inicioProjecaoBpo = 2

export const empresasBpo: EmpresaBpo[] = [
  {
    clienteId: 'c2',
    nome: 'Padaria Pão Quente ME',
    contabil: true,
    erp: { provedor: 'Conta Azul', modo: 'E1', situacao: 'ok', ultima: 'há 12 min', escopo: 'contas a pagar e a receber, lançamentos (leitura e escrita)' },
    audit: { cor: 'amarelo', motivos: ['fornecedor novo no lote de hoje (Gráfica Nova)', 'cartão de R$ 13.940 vence hoje às 17h'] },
    responsavel: 'Marina Teixeira',
    analista: 'Lucas Prado',
    modoPagamento: 'M1',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sex, 9h às 17h', aceitoPor: 'João Batista (sócio)', vigencia: 'até 10/2027' },
    bancos: [
      { id: 'pb1', nome: 'Sicoob (movimento)', saldo: 31_400, atualizado: 'hoje 06:00', via: 'Open Finance' },
      { id: 'pb2', nome: 'Caixa da loja', saldo: 1_820, atualizado: 'ontem 22:00', via: 'lançado no ERP' },
    ],
    caixaMinimo: 15_000,
    sla: { mes: 97, desvios: ['lote de 04/11 enviado 1 h depois da janela'] },
    volume: { lancamentos: 412, conciliacoes: 388, pagamentos: 46, contas: 2, faixa: 'até 500 lançamentos', limiteFaixa: 500 },
    honorarioBpo: 1_450,
    horasMes: 3.5,
    rotinas: rotinasPadrao(2),
    contas: [
      { id: 'pc1', fornecedor: 'Moinho Sul Ltda', categoria: 'Matéria-prima', valor: 4_200, vencimento: '20/11', origem: 'DDA', situacao: 'aprovada', digitadoPor: 'BPO (integrante)', conferidoPor: 'Lucas Prado', lote: 'lt1' },
      { id: 'pc2', fornecedor: 'Aluguel · Imobiliária Vila', categoria: 'Ocupação', valor: 6_800, vencimento: '20/11', origem: 'recorrente', situacao: 'aprovada', digitadoPor: 'BPO (integrante)', conferidoPor: 'Lucas Prado', lote: 'lt1' },
      {
        id: 'pc3',
        fornecedor: 'Gráfica Nova',
        categoria: 'Embalagens',
        valor: 2_940,
        vencimento: '22/11',
        origem: 'e-mail',
        situacao: 'aprovada',
        digitadoPor: 'Lucas Prado',
        conferidoPor: 'Marina Teixeira',
        lote: 'lt1',
        alerta: 'fornecedor novo; conta confirmada por ligação em 18/11 (Lucas, BPO)',
      },
      { id: 'pc4', fornecedor: 'Laticínios Serra', categoria: 'Matéria-prima', valor: 1_760, vencimento: '23/11', origem: 'DDA', situacao: 'a_aprovar', digitadoPor: 'Lucas Prado', alcada: 'até R$ 2 mil: 1 aprovador' },
      { id: 'pc5', fornecedor: 'Enel', categoria: 'Energia', valor: 2_310, vencimento: '24/11', origem: 'DDA', situacao: 'a_aprovar', digitadoPor: 'BPO (integrante)', alcada: 'R$ 2 a 20 mil: analista + gestor' },
    ],
    transacoes: [
      { id: 'pt1', data: '16/11', conta: 'Sicoob', descricao: 'PIX REC CIELO VENDAS', valor: 8_412.5, sugestao: 'Vendas no cartão', confianca: 'alta' },
      { id: 'pt2', data: '16/11', conta: 'Sicoob', descricao: 'PIX ENV M S PANIFICACAO', valor: -380, sugestao: 'Fornecedor eventual?', confianca: 'baixa' },
    ],
    fluxo: { entradas: [88, 92, 95, 118, 90, 91], saidas: [82, 86, 89, 104, 87, 88] },
  },
  {
    clienteId: 'c4',
    nome: 'Clínica Sorriso Ltda',
    contabil: true,
    erp: { provedor: 'Omie', modo: 'E1', situacao: 'ok', ultima: 'há 30 min', escopo: 'contas a pagar (leitura e escrita), lançamentos (leitura)' },
    audit: { cor: 'verde', motivos: ['conciliação em dia', 'todos os cartões aprovados no prazo'] },
    responsavel: 'Marina Teixeira',
    analista: 'Marina Teixeira',
    modoPagamento: 'M2',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sex, 8h às 18h', aceitoPor: 'Dra. Lívia Mendes (sócia)', vigencia: 'até 10/2027' },
    bancos: [{ id: 'cb1', nome: 'Itaú (clínica)', saldo: 64_900, atualizado: 'hoje 06:00', via: 'API do banco' }],
    caixaMinimo: 30_000,
    sla: { mes: 100, desvios: [] },
    volume: { lancamentos: 238, conciliacoes: 238, pagamentos: 31, contas: 1, faixa: 'até 300 lançamentos', limiteFaixa: 300 },
    honorarioBpo: 1_200,
    horasMes: 2.5,
    rotinas: rotinasPadrao(3),
    contas: [
      { id: 'cc1', fornecedor: 'Dental Cremer', categoria: 'Materiais odontológicos', valor: 8_300, vencimento: '21/11', origem: 'e-mail', situacao: 'aprovada', digitadoPor: 'BPO (integrante)', conferidoPor: 'Lucas Prado', lote: 'lt2' },
      {
        id: 'cc2',
        fornecedor: 'Laboratório Prótese Fina',
        categoria: 'Serviços de laboratório',
        valor: 3_150,
        vencimento: '25/11',
        origem: 'DDA',
        situacao: 'a_aprovar',
        digitadoPor: 'Lucas Prado',
        alcada: 'R$ 2 a 20 mil: analista + gestor',
      },
    ],
    transacoes: [{ id: 'ct1', data: '16/11', conta: 'Itaú', descricao: 'TED REC ODONTOPREV', valor: 3_840, sugestao: 'Convênios (NFS-e 155)', confianca: 'alta' }],
    fluxo: { entradas: [81, 87, 89, 92, 90, 94], saidas: [60, 63, 66, 78, 64, 65] },
  },
  {
    clienteId: 'c3',
    nome: 'Loja Bela Vista Eireli',
    contabil: true,
    erp: { provedor: 'Bling', modo: 'E1', situacao: 'atrasada', ultima: 'há 26 h', escopo: 'contas a pagar e a receber (leitura e escrita)' },
    audit: { cor: 'vermelho', motivos: ['sincronização com o Bling parada há 26 h', 'caixa abaixo do mínimo (R$ 8.200 de R$ 12.000)', 'vencido sem aprovação: Confecções Aurora (R$ 5.480)'] },
    responsavel: 'Marina Teixeira',
    analista: 'Lucas Prado',
    modoPagamento: 'M1',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sex, 9h às 16h', aceitoPor: 'Sérgio Prates (titular)', vigencia: 'até 03/2027' },
    bancos: [{ id: 'lb1', nome: 'Banco do Brasil', saldo: 8_200, atualizado: 'ontem 06:00', via: 'Open Finance' }],
    caixaMinimo: 12_000,
    sla: { mes: 88, desvios: ['conciliação de 15/11 atrasou por causa da sincronização', 'cartão de 16/11 expirou sem resposta do cliente'] },
    volume: { lancamentos: 540, conciliacoes: 470, pagamentos: 58, contas: 1, faixa: 'até 500 lançamentos', limiteFaixa: 500 },
    honorarioBpo: 1_380,
    horasMes: 6,
    rotinas: rotinasPadrao(1),
    contas: [
      {
        id: 'lc1',
        fornecedor: 'Confecções Aurora',
        categoria: 'Mercadoria para revenda',
        valor: 5_480,
        vencimento: '16/11',
        origem: 'DDA',
        situacao: 'a_aprovar',
        digitadoPor: 'BPO (integrante)',
        conferidoPor: 'Lucas Prado',
        alerta: 'venceu em 16/11 sem aprovação do cliente: alerta ao responsável e ao titular (nunca execução)',
      },
      { id: 'lc2', fornecedor: 'Shopping Center Vista', categoria: 'Ocupação', valor: 7_900, vencimento: '20/11', origem: 'recorrente', situacao: 'a_aprovar', digitadoPor: 'Lucas Prado', alcada: 'R$ 2 a 20 mil: analista + gestor' },
    ],
    transacoes: [],
    fluxo: { entradas: [205, 199, 207, 240, 196, 200], saidas: [201, 203, 206, 228, 199, 198] },
  },
  {
    clienteId: 'c8',
    nome: 'Mercado Bom Preço Ltda',
    contabil: false,
    erp: { provedor: 'Nibo', modo: 'E2', situacao: 'arquivo', ultima: 'arquivo de hoje 07:40', escopo: 'exportação OFX e CSV (a API do Nibo é restrita)' },
    audit: { cor: 'amarelo', motivos: ['ERP em modo arquivo: 6 baixas para lançar no Nibo à mão', 'lote acima de R$ 20 mil pede 2 aprovadores'] },
    responsavel: 'Marina Teixeira',
    analista: 'Lucas Prado',
    modoPagamento: 'M1',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sáb, 8h às 18h', aceitoPor: 'Rogério Almeida (sócio)', vigencia: 'até 08/2027' },
    bancos: [
      { id: 'mb1', nome: 'Bradesco (movimento)', saldo: 74_300, atualizado: 'hoje 06:00', via: 'Open Finance' },
      { id: 'mb2', nome: 'Inter (fornecedores)', saldo: 22_100, atualizado: 'hoje 06:00', via: 'API do banco' },
    ],
    caixaMinimo: 40_000,
    sla: { mes: 95, desvios: ['baixas no Nibo feitas no dia seguinte (modo arquivo)'] },
    volume: { lancamentos: 1_180, conciliacoes: 1_102, pagamentos: 132, contas: 2, faixa: 'até 1.200 lançamentos', limiteFaixa: 1_200 },
    honorarioBpo: 3_200,
    horasMes: 8,
    rotinas: rotinasPadrao(2),
    contas: [
      {
        id: 'mc1',
        fornecedor: 'Atacadão Distribuidora',
        categoria: 'Mercadoria para revenda',
        valor: 18_400,
        vencimento: '21/11',
        origem: 'DDA',
        situacao: 'aprovada',
        digitadoPor: 'BPO (integrante)',
        conferidoPor: 'Lucas Prado',
        lote: 'lt3',
      },
      {
        id: 'mc2',
        fornecedor: 'Frigorífico Boa Carne',
        categoria: 'Mercadoria para revenda',
        valor: 12_800,
        vencimento: '21/11',
        origem: 'e-mail',
        situacao: 'aprovada',
        digitadoPor: 'Lucas Prado',
        conferidoPor: 'Marina Teixeira',
        lote: 'lt3',
      },
      { id: 'mc3', fornecedor: 'Hortifruti Vale', categoria: 'Mercadoria para revenda', valor: 3_960, vencimento: '22/11', origem: 'WhatsApp', situacao: 'a_aprovar', digitadoPor: 'Lucas Prado', alcada: 'R$ 2 a 20 mil: analista + gestor' },
    ],
    transacoes: [
      { id: 'mt1', data: '16/11', conta: 'Bradesco', descricao: 'REDE CREDITO LOTE 4412', valor: 21_840, sugestao: 'Vendas no cartão', confianca: 'alta' },
      { id: 'mt2', data: '16/11', conta: 'Inter', descricao: 'PIX ENV 12.998.443/0001', valor: -1_250, sugestao: 'Fornecedor sem cadastro?', confianca: 'baixa' },
    ],
    fluxo: { entradas: [410, 418, 425, 498, 412, 415], saidas: [392, 401, 404, 470, 398, 400] },
  },
  {
    clienteId: 'c9',
    nome: 'Studio Forma Arquitetura Ltda',
    contabil: false,
    erp: { provedor: 'sem ERP', modo: 'E3', situacao: 'livro_proprio', ultima: 'nativo', escopo: 'livro próprio na plataforma (plano de contas gerencial)' },
    audit: { cor: 'verde', motivos: ['livro próprio em dia', 'sem pendência com a cliente'] },
    responsavel: 'Marina Teixeira',
    analista: 'Marina Teixeira',
    modoPagamento: 'M1',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sex, 9h às 18h', aceitoPor: 'Beatriz Forma (sócia)', vigencia: 'até 06/2027' },
    bancos: [{ id: 'sb1', nome: 'Nubank PJ', saldo: 46_800, atualizado: 'hoje 06:00', via: 'Open Finance' }],
    caixaMinimo: 20_000,
    sla: { mes: 100, desvios: [] },
    volume: { lancamentos: 96, conciliacoes: 96, pagamentos: 14, contas: 1, faixa: 'até 150 lançamentos', limiteFaixa: 150 },
    honorarioBpo: 890,
    horasMes: 1.5,
    rotinas: rotinasPadrao(3),
    contas: [{ id: 'sc1', fornecedor: 'Autodesk (licenças)', categoria: 'Software', valor: 1_640, vencimento: '25/11', origem: 'e-mail', situacao: 'agendada', digitadoPor: 'BPO (integrante)', conferidoPor: 'Marina Teixeira' }],
    transacoes: [],
    fluxo: { entradas: [52, 61, 58, 64, 55, 57], saidas: [41, 44, 45, 52, 43, 44] },
  },
  {
    clienteId: 'c10',
    nome: 'AutoPeças Rota 9 Ltda',
    contabil: false,
    erp: { provedor: 'Conta Azul', modo: 'E1', situacao: 'credencial_vencida', ultima: 'há 3 dias', escopo: 'contas a pagar e a receber (leitura e escrita)' },
    audit: { cor: 'vermelho', motivos: ['credencial do Conta Azul venceu: o cliente precisa autorizar de novo', 'em paralelo até 30/11: o BPO prepara, o cliente ainda paga'] },
    responsavel: 'Marina Teixeira',
    analista: 'Lucas Prado',
    modoPagamento: 'M1',
    alcadas: { faixa1: 2_000, faixa2: 20_000, janela: 'seg a sex, 8h às 17h', aceitoPor: 'Wagner Lima (sócio)', vigencia: 'até 11/2027' },
    bancos: [{ id: 'ab1', nome: 'Santander', saldo: 19_700, atualizado: 'há 3 dias', via: 'Open Finance' }],
    caixaMinimo: 15_000,
    sla: { mes: 92, desvios: ['espelho parado desde a credencial vencida'] },
    volume: { lancamentos: 0, conciliacoes: 0, pagamentos: 0, contas: 1, faixa: 'em paralelo (não conta)', limiteFaixa: 400 },
    honorarioBpo: 1_100,
    horasMes: 3,
    rotinas: rotinasPadrao(0),
    contas: [
      {
        id: 'ac1',
        fornecedor: 'Distribuidora Freios BR',
        categoria: 'Mercadoria para revenda',
        valor: 9_870,
        vencimento: '22/11',
        origem: 'DDA',
        situacao: 'a_aprovar',
        digitadoPor: 'BPO (integrante)',
        alcada: 'R$ 2 a 20 mil: analista + gestor',
      },
    ],
    transacoes: [],
    fluxo: { entradas: [130, 128, 133, 150, 129, 131], saidas: [124, 126, 129, 141, 125, 127] },
    paraleloAte: '30/11',
  },
]

/** Lotes que viraram cartão para o cliente aprovar (10, 3.6). */
export const lotesBpo: LoteBpo[] = [
  {
    id: 'lt1',
    clienteId: 'c2',
    titulo: 'Pagar 3 contas · vence hoje 17h',
    itens: [
      { conta: 'pc1', fornecedor: 'Moinho Sul Ltda', valor: 4_200, vencimento: '20/11', marca: 'OK (3ª vez, mesma conta)' },
      { conta: 'pc2', fornecedor: 'Aluguel · Imobiliária Vila', valor: 6_800, vencimento: '20/11', marca: 'OK (contrato)' },
      { conta: 'pc3', fornecedor: 'Gráfica Nova', valor: 2_940, vencimento: '22/11', marca: 'conferida', alerta: 'fornecedor novo; conta confirmada por ligação em 18/11 (Lucas, BPO)' },
    ],
    saldo: 31_400,
    expira: 'hoje 17h',
    preparadoPor: 'BPO (integrante) e Lucas Prado',
    conferidoPor: 'Marina Teixeira',
    aprovadoresNecessarios: 1,
  },
  {
    id: 'lt2',
    clienteId: 'c4',
    titulo: 'Pagar 1 conta · vence 21/11',
    itens: [{ conta: 'cc1', fornecedor: 'Dental Cremer', valor: 8_300, vencimento: '21/11', marca: 'OK (fornecedor recorrente)' }],
    saldo: 64_900,
    expira: 'amanhã 12h',
    preparadoPor: 'BPO (integrante)',
    conferidoPor: 'Lucas Prado',
    aprovadoresNecessarios: 1,
  },
  {
    id: 'lt3',
    clienteId: 'c8',
    titulo: 'Pagar 2 fornecedores · vence 11/11',
    itens: [
      { conta: 'mc1', fornecedor: 'Atacadão Distribuidora', valor: 18_400, vencimento: '21/11', marca: 'OK (recorrente)' },
      { conta: 'mc2', fornecedor: 'Frigorífico Boa Carne', valor: 12_800, vencimento: '21/11', marca: 'OK (recorrente)' },
    ],
    saldo: 96_400,
    expira: 'amanhã 12h',
    preparadoPor: 'BPO (integrante) e Lucas Prado',
    conferidoPor: 'Marina Teixeira',
    aprovadoresNecessarios: 2,
  },
]

/** Pedidos dos clientes e itens da fila, com a bola (10, 5.3). */
export const filaBpo = [
  { id: 'fq1', clienteId: 'c2', tipo: 'pagamento', texto: 'Lote de 3 contas (R$ 13.940)', codigo: 'FIN-201', prazo: 'hoje 17h', bola: 'cliente' as const, detalhe: 'cartão no app do João Batista' },
  { id: 'fq2', clienteId: 'c8', tipo: 'pagamento', texto: 'Lote de 2 fornecedores (R$ 31.200, 2 aprovadores)', codigo: 'FIN-201', prazo: 'amanhã 12h', bola: 'cliente' as const, detalhe: 'aprovação reforçada: Rogério e Patrícia' },
  { id: 'fq3', clienteId: 'c8', tipo: 'pedido', texto: '“Pague a Hortifruti Vale amanhã”', codigo: 'FIN-201', prazo: '19/11', bola: 'bpo' as const, detalhe: 'pedido da Patrícia pelo WhatsApp; conta digitada, falta conferir' },
  { id: 'fq4', clienteId: 'c3', tipo: 'pendencia', texto: 'Religar a sincronização do Bling', codigo: 'BPO-009', prazo: 'hoje', bola: 'bpo' as const, detalhe: 'token renovado; aguardando nova leitura' },
  { id: 'fq5', clienteId: 'c10', tipo: 'pendencia', texto: 'Autorizar de novo o Conta Azul', codigo: 'BPO-009', prazo: 'há 3 dias', bola: 'cliente' as const, detalhe: 'link enviado ao Wagner Lima' },
  { id: 'fq6', clienteId: 'c4', tipo: 'pedido', texto: 'Emitir boletos de convênio de novembro', codigo: 'FIN-201', prazo: '25/11', bola: 'bpo' as const, detalhe: 'cobrança pela subconta da clínica' },
  { id: 'fq7', clienteId: 'c8', tipo: 'pendencia', texto: 'Lançar 6 baixas no Nibo (modo arquivo)', codigo: 'FIN-004', prazo: 'hoje', bola: 'bpo' as const, detalhe: 'checklist “lançar no ERP”' },
]

export const corAudit: Record<CorAudit, string> = { verde: 'var(--success)', amarelo: 'var(--warning)', vermelho: 'var(--destructive)' }
export const titularDe = (e: EmpresaBpo): Titular => ({ tipo: 'empresa', clienteId: e.clienteId, nome: e.nome })
export const empresaBpo = (clienteId?: string) => empresasBpo.find((e) => e.clienteId === clienteId)
/** Atalho "abrir no ERP" de cada linha (10, 5.2). */
export const rotuloAbrirErp = (e: EmpresaBpo) => (e.erp.modo === 'E3' ? 'Abrir no livro próprio' : `Abrir no ${e.erp.provedor}`)

/** Quem, no cliente, pode aprovar o lote: até a faixa 2, quem tem alçada para o total; acima, os da aprovação reforçada (10, 3.7). */
export function aprovadoresDe(contatos: { nome: string; alcadaPagamento?: number; reforcada?: boolean }[], total: number, faixa2 = 20_000) {
  return contatos.filter((c) => (total > faixa2 ? c.reforcada && (c.alcadaPagamento ?? 0) > 0 : (c.alcadaPagamento ?? 0) >= total))
}

/**
 * Escalonamento do lote (decidido com base no mercado, 8/11/2026): a janela
 * abre às 9h (por empresa) e o cartão vai ao aprovador; +4 h, lembrete a ele;
 * +8 h (ou na abertura do dia útil seguinte), ao substituto; na véspera do
 * vencimento mais próximo, alerta ao Gestor do BPO e ao sócio; vencido, só
 * alerta e a empresa fica vermelha na auditoria. Nunca paga sozinho.
 */
export interface Escalonamento {
  abertura: string
  lembreteH: number
  substitutoH: number
  aprovador: string
  substituto?: string
  socio: string
}
export const escalonamentoBpo: Record<string, Escalonamento> = {
  c2: { abertura: '09:00', lembreteH: 4, substitutoH: 8, aprovador: 'João Batista', socio: 'João Batista' },
  c3: { abertura: '09:00', lembreteH: 4, substitutoH: 8, aprovador: 'Sérgio Prates', socio: 'Sérgio Prates' },
  c4: { abertura: '08:00', lembreteH: 4, substitutoH: 8, aprovador: 'Dra. Lívia Mendes', socio: 'Dra. Lívia Mendes' },
  c8: { abertura: '09:00', lembreteH: 4, substitutoH: 8, aprovador: 'Patrícia Almeida', substituto: 'Rogério Almeida', socio: 'Rogério Almeida' },
  c9: { abertura: '09:00', lembreteH: 4, substitutoH: 8, aprovador: 'Beatriz Forma', socio: 'Beatriz Forma' },
  c10: { abertura: '09:00', lembreteH: 4, substitutoH: 8, aprovador: 'Wagner Lima', socio: 'Wagner Lima' },
}
const somaHora = (h: string, n: number) => {
  const [a, b] = h.split(':').map(Number)
  const t = a + n
  return t >= 18 ? 'abertura do dia útil seguinte' : `${String(t).padStart(2, '0')}:${String(b).padStart(2, '0')}`
}
/** A cadeia como passos, para a Configuração e para a linha do tempo do cartão do lote. */
export function passosEscalonamento(e: Escalonamento, vespera = 'véspera do vencimento') {
  return [
    { quando: e.abertura, texto: `abre a janela; o cartão vai a ${e.aprovador}` },
    { quando: `+${e.lembreteH} h (${somaHora(e.abertura, e.lembreteH)})`, texto: `lembrete a ${e.aprovador}` },
    { quando: `+${e.substitutoH} h (${somaHora(e.abertura, e.substitutoH)})`, texto: e.substituto ? `vai ao substituto, ${e.substituto}` : 'sem substituto cadastrado: alerta ao Gestor do BPO' },
    { quando: vespera, texto: `alerta ao Gestor do BPO e a ${e.socio} com a lista do que vence` },
    { quando: 'vencido', texto: 'só alerta (Gestor e sócio); nunca paga sozinho; auditoria vermelha: “vencido sem aprovação”' },
  ]
}
