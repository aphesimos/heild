/**
 * Serviços extras do app do cliente (06, seção 8 e "ideias extras"). O
 * escritório liga cada um por cliente na ficha (ativo, disponível ou oculto);
 * o cliente só vê o estado e pede ("tenho interesse" vira GES-002). Nada é
 * contratado sem o escritório confirmar.
 */

export type EstadoServico = 'ativo' | 'disponivel' | 'oculto'
/** Área do papel (06, 2.4) que usa o serviço; 'todos' = qualquer papel da empresa. */
export type AreaServico = 'guias' | 'folha' | 'financeiro' | 'societario' | 'todos'

export interface ServicoExtra {
  id: string
  nome: string
  codigo: string
  entrega: string
  exige: string
  cobranca: string
  fase: number
  area: AreaServico
  /** Principal (tabela da seção 8) ou ideia extra (uma linha no plano). */
  grupo: 'principal' | 'ideia'
  /** Rótulo do atalho quando ativo (abre a tela do serviço no app). */
  atalho?: string
}

export const catalogoServicos: ServicoExtra[] = [
  {
    id: 'nfse',
    nome: 'Emissão de NFS-e pelo app',
    codigo: 'NFE-201',
    entrega: 'Emitir, consultar, cancelar e substituir NFS-e; tomadores e serviços cadastrados; a nota entra na apuração na hora',
    exige: 'Certificado A1 no cofre (ou procuração na API nacional, quando liberada)',
    cobranca: 'por nota ou mensal',
    fase: 2,
    area: 'guias',
    grupo: 'principal',
    atalho: 'Emitir nota',
  },
  {
    id: 'consultor',
    nome: 'Consultor da empresa',
    codigo: 'CON-001',
    entrega: 'Perguntas sobre a própria empresa em linguagem simples, com os dados dela; opinião vai ao contador',
    exige: 'Só o serviço; uso com teto mensal',
    cobranca: 'mensal',
    fase: 3,
    area: 'todos',
    grupo: 'principal',
    atalho: 'Consultor',
  },
  {
    id: 'certidoes',
    nome: 'Certidões sob demanda',
    codigo: 'FIS-036',
    entrega: 'Certidões com um toque, renovação antes de vencer e kit para licitação',
    exige: 'Nada da empresa',
    cobranca: 'por certidão ou pacote',
    fase: 1,
    area: 'guias',
    grupo: 'principal',
    atalho: 'Certidões',
  },
  {
    id: 'reforma',
    nome: 'Simulador da reforma tributária',
    codigo: 'CON-302',
    entrega: 'Carga de hoje × carga com IBS/CBS ano a ano da transição, com os números da empresa',
    exige: 'Notas e perfil na plataforma; revisão do contador a cada versão',
    cobranca: 'relatório ou mensal',
    fase: 5,
    area: 'societario',
    grupo: 'principal',
    atalho: 'Reforma tributária',
  },
  {
    id: 'painel_socio',
    nome: 'Painel do sócio',
    codigo: 'CON-303',
    entrega: 'Faturamento, impostos, folha, resultado e limites do Simples, comparados ao mês anterior',
    exige: 'Dados que já estão na plataforma',
    cobranca: 'mensal',
    fase: 4,
    area: 'societario',
    grupo: 'principal',
    atalho: 'Painel do sócio',
  },
  {
    id: 'conciliacao',
    nome: 'Conciliação simplificada',
    codigo: 'CTB-015',
    entrega: 'Extratos pelo Open Finance, lançamentos classificados, caixa do mês e "o que foi isto?" por toque',
    exige: 'Consentimento Open Finance no app',
    cobranca: 'custo do agregador repassado',
    fase: 4,
    area: 'financeiro',
    grupo: 'principal',
    atalho: 'Conciliação',
  },
  {
    id: 'cobranca_clientes',
    nome: 'Cobrança dos seus clientes',
    codigo: 'FIN-201',
    entrega: 'Boletos e Pix para os clientes da empresa, com régua; a baixa entra na conciliação',
    exige: 'Conta no provedor em nome da empresa e termo',
    cobranca: 'tarifa do provedor + margem',
    fase: 5,
    area: 'financeiro',
    grupo: 'principal',
    atalho: 'Cobrar meus clientes',
  },
  {
    id: 'recalculo',
    nome: 'Recálculo de guia vencida',
    codigo: 'FIS-201',
    entrega: 'Guia vencida recalculada com juros e multa, quantas vezes precisar',
    exige: 'Nada',
    cobranca: 'incluso ou pacote',
    fase: 1,
    area: 'guias',
    grupo: 'ideia',
    atalho: 'Recalcular guia',
  },
  {
    id: 'simulador_dp',
    nome: 'Simulador de folha',
    codigo: 'DP-059',
    entrega: 'Quanto custa contratar, aumentar ou desligar alguém, antes de decidir',
    exige: 'Folha na plataforma',
    cobranca: 'mensal',
    fase: 3,
    area: 'folha',
    grupo: 'ideia',
    atalho: 'Simular contratação',
  },
  {
    id: 'relatorio_anual',
    nome: 'Relatório anual "o que fizemos por você"',
    codigo: 'GES-045',
    entrega: 'Resumo do ano: guias, prazos cumpridos, economia e o que vem',
    exige: 'Nada',
    cobranca: 'incluso',
    fase: 2,
    area: 'societario',
    grupo: 'ideia',
    atalho: 'Relatório do ano',
  },
  {
    id: 'agenda_tributaria',
    nome: 'Agenda tributária no celular',
    codigo: 'FIS-001',
    entrega: 'Os vencimentos da empresa no calendário do celular, atualizados sozinhos',
    exige: 'Nada',
    cobranca: 'incluso',
    fase: 1,
    area: 'guias',
    grupo: 'ideia',
    atalho: 'Agenda no calendário',
  },
  {
    id: 'licitacao',
    nome: 'Pacote para licitação',
    codigo: 'SOC-034',
    entrega: 'Certidões, balanço, contrato social e índices num pacote só',
    exige: 'Certidões em dia',
    cobranca: 'por pacote',
    fase: 2,
    area: 'societario',
    grupo: 'ideia',
    atalho: 'Pacote de licitação',
  },
  {
    id: 'certificado_a1',
    nome: 'Certificado A1 pelo escritório',
    codigo: 'SOC-201',
    entrega: 'Compra e emissão guiada do e-CNPJ, com renovação lembrada',
    exige: 'Videoconferência com a certificadora',
    cobranca: 'por certificado',
    fase: 2,
    area: 'societario',
    grupo: 'ideia',
    atalho: 'Comprar certificado',
  },
  {
    id: 'irpf',
    nome: 'IRPF dos sócios',
    codigo: 'PF-004',
    entrega: 'Declaração com checklist que se adapta ao que você tem',
    exige: 'Documentos do ano',
    cobranca: 'à parte, por declaração',
    fase: 2,
    area: 'societario',
    grupo: 'ideia',
    atalho: 'Meu IRPF',
  },
  {
    id: 'conta_digital',
    nome: 'Conta digital e benefícios (parceria)',
    codigo: 'GES-205',
    entrega: 'Conta PJ e benefícios de parceiros, com a comissão do escritório informada',
    exige: 'Abertura com o parceiro',
    cobranca: 'sem custo; o escritório recebe comissão (informada)',
    fase: 4,
    area: 'financeiro',
    grupo: 'ideia',
  },
]

/** Estado inicial por cliente (o que o escritório já ligou). O resto fica "disponível". */
export const servicosIniciais: Record<string, Partial<Record<string, EstadoServico>>> = {
  c1: { consultor: 'ativo', painel_socio: 'ativo', certidoes: 'ativo', recalculo: 'ativo', agenda_tributaria: 'ativo', certificado_a1: 'ativo' },
  c2: { certidoes: 'ativo', recalculo: 'ativo', agenda_tributaria: 'ativo' },
  c3: { simulador_dp: 'ativo', agenda_tributaria: 'ativo' },
  c4: { nfse: 'ativo', consultor: 'ativo', agenda_tributaria: 'ativo' },
  c5: { certidoes: 'ativo', licitacao: 'ativo', painel_socio: 'ativo' },
  c6: { irpf: 'ativo', nfse: 'oculto', cobranca_clientes: 'oculto', conciliacao: 'oculto', simulador_dp: 'oculto', licitacao: 'oculto', certificado_a1: 'oculto', painel_socio: 'oculto', reforma: 'oculto' },
  c7: { recalculo: 'ativo' },
}

export const rotuloEstadoServico: Record<EstadoServico, string> = { ativo: 'ativo', disponivel: 'disponível', oculto: 'oculto' }

/** Cadastro do emissor (o escritório trava a tributação; o cliente só preenche tomador, valor e descrição). */
export const emissorNfse: Record<string, { servicos: { id: string; descricao: string; codigo: string; iss: number }[]; tomadores: { nome: string; doc: string }[]; notas: NotaEmitida[] }> = {
  c4: {
    servicos: [
      { id: 's1', descricao: 'Tratamento odontológico', codigo: '4.12 · odontologia', iss: 2 },
      { id: 's2', descricao: 'Ortodontia (manutenção mensal)', codigo: '4.12 · odontologia', iss: 2 },
      { id: 's3', descricao: 'Clareamento', codigo: '4.12 · odontologia', iss: 2 },
    ],
    tomadores: [
      { nome: 'OdontoPrev S.A.', doc: '58.119.199/0001-51' },
      { nome: 'Amil Dental Ltda', doc: '29.309.127/0001-79' },
      { nome: 'Paciente particular (CPF)', doc: 'informar CPF' },
    ],
    notas: [
      { numero: 155, tomador: 'OdontoPrev S.A.', servico: 'Tratamento odontológico', valor: 3840, data: '03/11', situacao: 'emitida' },
      { numero: 156, tomador: 'Paciente particular (CPF)', servico: 'Clareamento', valor: 900, data: '05/11', situacao: 'emitida' },
      { numero: 157, tomador: 'Amil Dental Ltda', servico: 'Ortodontia (manutenção mensal)', valor: 2210, data: '06/11', situacao: 'emitida' },
    ],
  },
}
const emissorPadrao = {
  servicos: [{ id: 's1', descricao: 'Serviço prestado', codigo: 'conforme cadastro do escritório', iss: 5 }],
  tomadores: [{ nome: 'Cliente (CNPJ ou CPF)', doc: 'informar documento' }],
  notas: [] as NotaEmitida[],
}
export const emissorDe = (clienteId: string) => emissorNfse[clienteId] ?? emissorPadrao

export interface NotaEmitida {
  numero: number
  tomador: string
  servico: string
  valor: number
  data: string
  situacao: 'emitida' | 'cancelada'
  clienteId?: string
}

/** Certidões da empresa (validade em dias a partir de hoje, 18/11). */
export const certidoesDe = (clienteId: string) => [
  { id: 'cnd', nome: 'CND federal (Receita e PGFN)', dias: clienteId === 'c5' ? 12 : 96 },
  { id: 'crf', nome: 'CRF do FGTS', dias: clienteId === 'c2' ? -3 : 21 },
  { id: 'cndt', nome: 'CNDT trabalhista', dias: 140 },
  { id: 'est', nome: 'Certidão estadual (SEFAZ-SP)', dias: 54 },
  { id: 'mun', nome: 'Certidão municipal (São Paulo)', dias: clienteId === 'c4' ? 8 : 70 },
]

/** Painel do sócio: números de 10/2026 (receita 12 meses e DAS iguais ao bloco do Simples no Painel Fiscal). */
export const painelSocioDe: Record<string, { faturamento: number; anterior: number; impostos: number; folha: number; resultado: number; limite?: { usado: number; teto: number } }> = {
  c1: { faturamento: 1_284_300, anterior: 1_190_400, impostos: 162_870, folha: 214_500, resultado: 118_200 },
  c2: { faturamento: 93_400, anterior: 89_900, impostos: 4_812, folha: 31_200, resultado: 11_300, limite: { usado: 1_120_000, teto: 3_600_000 } },
  c3: { faturamento: 206_700, anterior: 214_200, impostos: 2_105, folha: 18_900, resultado: 19_100, limite: { usado: 2_480_000, teto: 3_600_000 } },
  c4: { faturamento: 86_950, anterior: 81_300, impostos: 9_910, folha: 24_400, resultado: 27_800 },
  c5: { faturamento: 3_920_000, anterior: 3_710_000, impostos: 401_200, folha: 690_000, resultado: 244_000 },
  c7: { faturamento: 23_100, anterior: 21_800, impostos: 1_390, folha: 9_800, resultado: 3_200, limite: { usado: 278_000, teto: 3_600_000 } },
}
