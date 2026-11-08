import type { SetorIntegrante } from '@/theme/tipos'

/**
 * Dados do Timesheet (subplano 05). Fictícios, coerentes com o resto do lab:
 * Fernanda Lima (Gestora) é quem está logada; quarta, 18/11/2026.
 */

export type Confianca = 'automatica' | 'confirmada' | 'estimada' | 'sem' | 'contestada'
export type Origem = 'plataforma' | 'core' | 'extensao' | 'artefato' | 'confirmacao' | 'crm'

export const rotuloConfianca: Record<Confianca, string> = {
  automatica: 'automática',
  confirmada: 'confirmada',
  estimada: 'estimada',
  sem: 'sem classificação',
  contestada: 'contestada',
}

export const rotuloOrigem: Record<Origem, string> = {
  plataforma: 'tarefa aberta',
  core: 'core',
  extensao: 'extensão',
  artefato: 'artefato',
  confirmacao: 'confirmação',
  crm: 'conversa no CRM',
}

export interface SessaoTs {
  id: string
  inicio: string
  fim: string
  atividade?: string
  rotulo: string
  cliente?: string
  confianca: Confianca
  origem: Origem
  evidencias: string[]
  foraJornada?: boolean
  contestacao?: { motivo: string; status: 'pendente' | 'aceita' | 'recusada'; decisao?: string }
}

/** Minutos desde 0h. */
export const min = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
export const fmtH = (m: number) => {
  const h = Math.floor(m / 60)
  const r = Math.round(m % 60)
  return h ? `${h}h${r ? String(r).padStart(2, '0') : ''}` : `${r} min`
}

export const sessoesDia: SessaoTs[] = [
  {
    id: 's1',
    inicio: '08:02',
    fim: '10:10',
    atividade: 'FIS-019',
    rotulo: 'DCTFWeb',
    cliente: 'Metalúrgica Andrade Ltda',
    confianca: 'automatica',
    origem: 'plataforma',
    evidencias: ['tarefa FIS-019 aberta às 08:02', '74 pulsos no e-CAC com o CNPJ da Metalúrgica', 'recibo de transmissão às 10:08'],
  },
  { id: 's2', inicio: '10:10', fim: '10:45', rotulo: 'sem registro', cliente: 'Metalúrgica Andrade Ltda', confianca: 'estimada', origem: 'confirmacao', evidencias: ['35 min sem evento', 'antes e depois: FIS-019 Metalúrgica'] },
  {
    id: 's3',
    inicio: '10:45',
    fim: '12:00',
    atividade: 'FIS-009',
    rotulo: 'PGDAS-D',
    cliente: 'Padaria Pão Quente ME',
    confianca: 'automatica',
    origem: 'plataforma',
    evidencias: ['tarefa FIS-009 aberta', 'pulsos no portal do Simples com o CNPJ da Padaria'],
  },
  {
    id: 's4',
    inicio: '13:05',
    fim: '13:50',
    atividade: 'FIS-010',
    rotulo: 'DAS emitido',
    cliente: 'Loja Bela Vista Eireli',
    confianca: 'estimada',
    origem: 'artefato',
    evidencias: ['guia DAS 10/2026 registrada às 13:30', 'duração padrão do cliente: 15 min, aparada à sessão vizinha'],
  },
  {
    id: 's5',
    inicio: '14:30',
    fim: '15:15',
    atividade: 'GES-025',
    rotulo: 'Atendimento',
    cliente: 'Transportes Rota Sul S.A.',
    confianca: 'automatica',
    origem: 'crm',
    evidencias: ['assumiu a conversa da intimação às 14:30', 'última mensagem às 15:15', 'etiqueta "intimação"'],
  },
  {
    id: 's6',
    inicio: '15:15',
    fim: '17:30',
    atividade: 'FIS-004',
    rotulo: 'Conferência',
    cliente: 'Metalúrgica Andrade Ltda',
    confianca: 'confirmada',
    origem: 'core',
    evidencias: ['tarefa FIS-004 aberta às 15:15', 'Alterdata: "Conferência fiscal" concluída às 17:24 (vira evidência, não sessão nova)'],
  },
  { id: 's7', inicio: '17:30', fim: '18:00', rotulo: 'sem classificação', confianca: 'sem', origem: 'confirmacao', evidencias: ['30 min sem evento e sem pista'] },
  { id: 's8', inicio: '20:40', fim: '21:05', atividade: 'GES-025', rotulo: 'Atendimento', cliente: 'Padaria Pão Quente ME', confianca: 'automatica', origem: 'crm', evidencias: ['respondeu João pelo WhatsApp'], foraJornada: true },
]

export const resumoDia = { registradas: 440, automaticas: 350, confirmadas: 60, estimadas: 80, sem: 30 }

/** Semana: minutos por dia e confiança. */
export const semana = [
  { dia: 'seg 16', automatica: 360, confirmada: 20, estimada: 50, sem: 10 },
  { dia: 'ter 17', automatica: 300, confirmada: 70, estimada: 40, sem: 45 },
  { dia: 'qua 18', automatica: 350, confirmada: 60, estimada: 80, sem: 30 },
  { dia: 'qui 19', automatica: 0, confirmada: 0, estimada: 0, sem: 0 },
  { dia: 'sex 20', automatica: 0, confirmada: 0, estimada: 0, sem: 0 },
]

/** Mês: horas por cliente e por atividade (10 maiores + outros). */
export const mesClientes = [
  { nome: 'Metalúrgica Andrade Ltda', h: 41.5 },
  { nome: 'Transportes Rota Sul S.A.', h: 28 },
  { nome: 'Padaria Pão Quente ME', h: 14.5 },
  { nome: 'Loja Bela Vista Eireli', h: 9 },
  { nome: 'Clínica Sorriso Ltda', h: 7.5 },
  { nome: 'Carlos Menezes', h: 2 },
  { nome: 'Interno', h: 11 },
]
export const mesAtividades = [
  { nome: 'FIS-019 · DCTFWeb', h: 18 },
  { nome: 'FIS-004 · Conferência', h: 16.5 },
  { nome: 'GES-025 · Atendimento', h: 14 },
  { nome: 'FIS-009 · PGDAS-D', h: 12 },
  { nome: 'CTB-015 · Conciliação', h: 10 },
  { nome: 'FIS-038 · Intimação', h: 8 },
  { nome: 'outros', h: 35 },
]

export const agenteDia = [
  { setor: 'fiscal' as SetorIntegrante, hora: '09:30', texto: 'Preparou o PGDAS-D de 14 clientes do Simples', maquinaMin: 31, poupadasH: 1.6 },
  { setor: 'contabil' as SetorIntegrante, hora: '11:10', texto: 'Classificou 412 linhas do extrato da Metalúrgica', maquinaMin: 12, poupadasH: 0.5 },
  { setor: 'fiscal' as SetorIntegrante, hora: '15:40', texto: 'Leu 6 caixas postais e abriu 1 tarefa', maquinaMin: 5, poupadasH: 0.2 },
]
export const limitesIa = { cincoHoras: 38, seteDias: 21 }

export const extensao = {
  vinculada: true,
  navegador: 'Chrome',
  pulsosHoje: [
    { portal: 'e-CAC', pulsos: 74, cliente: 'Metalúrgica Andrade Ltda' },
    { portal: 'Simples Nacional', pulsos: 41, cliente: 'Padaria Pão Quente ME' },
    { portal: 'eSocial', pulsos: 6, cliente: '—' },
  ],
  pausas: [{ quando: 'ontem 12:00', duracao: '30 min' }],
}

export interface Dominio {
  portal: string
  dominio: string
  leitura: string
  atividade: string
  ativo: boolean
}

export const dominios: Dominio[] = [
  { portal: 'e-CAC (DCTFWeb, EFD-Reinf)', dominio: 'cav.receita.fazenda.gov.br', leitura: 'elemento de identificação ("procurador de")', atividade: 'FIS-005, 006, 019, 020', ativo: true },
  { portal: 'Simples Nacional', dominio: 'www8.receita.fazenda.gov.br', leitura: 'título ou elemento de identificação', atividade: 'FIS-009, 010, 016', ativo: true },
  { portal: 'eSocial e FGTS Digital', dominio: 'login.esocial.gov.br, fgtsdigital.sistema.gov.br', leitura: 'elemento de identificação (empregador)', atividade: 'DP-016, 006, 018', ativo: true },
  { portal: 'SEFAZ (SP, MG, PR, SC, RS) e DTEs', dominio: 'portal.fazenda.sp.gov.br e outros', leitura: 'IE ou CNPJ na URL ou no título', atividade: 'FIS-024, 026', ativo: true },
  { portal: 'NFS-e nacional e municipais', dominio: 'www.nfse.gov.br e lista municipal', leitura: 'CNPJ ou inscrição na URL ou no título', atividade: 'NFE-008, FIS-028', ativo: true },
  { portal: 'Onvio e Domínio web', dominio: 'onvio.com.br', leitura: 'empresa no título ou na URL', atividade: 'a da tarefa aberta', ativo: false },
]

export const minhasContestacoes = [{ quando: '16/11', sessao: '14:00–15:30 · CTB-015 · Metalúrgica', motivo: 'cliente errado (era a Clínica Sorriso)', status: 'aceita' as const, decisao: 'Fernanda: aceita, sessão corrigida' }]

/* ---------- Confirmações (05, 5.2) ---------- */

export interface ItemConfirmacao {
  id: string
  dia: string
  inicio: string
  fim?: string
  texto: string
  pista: string
  sugestao: { atividade: string; cliente?: string; minutos: number }
  tipo: 'buraco' | 'portal' | 'artefato' | 'conflito' | 'sem_pista'
  alternativa?: string
}

export const itensConfirmacao: ItemConfirmacao[] = [
  {
    id: 'c1',
    dia: 'qua 18/11',
    inicio: '10:10',
    fim: '10:45',
    texto: '35 min sem registro',
    pista: 'antes e depois: FIS-019 Metalúrgica',
    sugestao: { atividade: 'FIS-019 · DCTFWeb', cliente: 'Metalúrgica Andrade Ltda', minutos: 35 },
    tipo: 'buraco',
  },
  {
    id: 'c2',
    dia: 'qua 18/11',
    inicio: '11:20',
    fim: '11:50',
    texto: 'e-CAC com o CNPJ da Padaria, sem tarefa aberta',
    pista: 'extensão · 28 pulsos',
    sugestao: { atividade: 'FIS-005 · Caixa postal', cliente: 'Padaria Pão Quente ME', minutos: 30 },
    tipo: 'portal',
  },
  {
    id: 'c3',
    dia: 'qua 18/11',
    inicio: '13:30',
    texto: 'Guia DAS da Loja Bela Vista emitida',
    pista: 'artefato · padrão do cliente 15 min',
    sugestao: { atividade: 'FIS-010 · DAS', cliente: 'Loja Bela Vista Eireli', minutos: 15 },
    tipo: 'artefato',
  },
  {
    id: 'c4',
    dia: 'qua 18/11',
    inicio: '15:10',
    fim: '16:40',
    texto: 'Tarefa CTB-015 da Metalúrgica aberta; o portal mostrou a Clínica Sorriso',
    pista: 'conflito tarefa × extensão',
    sugestao: { atividade: 'CTB-015 · Conciliação', cliente: 'Metalúrgica Andrade Ltda', minutos: 90 },
    tipo: 'conflito',
    alternativa: 'Clínica Sorriso Ltda',
  },
  { id: 'c5', dia: 'qua 18/11', inicio: '17:30', fim: '18:00', texto: 'Sem registro e sem pista', pista: '—', sugestao: { atividade: '', minutos: 30 }, tipo: 'sem_pista' },
  {
    id: 'c6',
    dia: 'ter 17/11',
    inicio: '16:00',
    fim: '16:45',
    texto: '45 min sem registro',
    pista: 'antes: GES-025 Rota Sul',
    sugestao: { atividade: 'GES-025 · Atendimento', cliente: 'Transportes Rota Sul S.A.', minutos: 45 },
    tipo: 'buraco',
  },
]

export const atividadesTs = [
  'FIS-004 · Conferência',
  'FIS-005 · Caixa postal',
  'FIS-009 · PGDAS-D',
  'FIS-010 · DAS',
  'FIS-019 · DCTFWeb',
  'FIS-038 · Intimação',
  'CTB-015 · Conciliação',
  'CTB-031 · Balancete',
  'DP-011 · Folha',
  'GES-025 · Atendimento',
]
export const atividadesInternas = ['Reunião interna', 'Treinamento', 'Administrativo']

export const artefatosSemPessoa = [
  { id: 'a1', quando: 'ter 17/11 16:12', texto: 'SPED EFD-Contribuições da Transportes Rota Sul salvo na pasta', atividade: 'FIS-023', sugestao: 'Fernanda Lima' },
  { id: 'a2', quando: 'qua 18/11 09:40', texto: 'Holerites de outubro da Loja Bela Vista na pasta', atividade: 'DP-019', sugestao: 'Ana Souza' },
]
export const pendenciasPorPessoa = [
  { nome: 'Fernanda Lima', n: 6 },
  { nome: 'João Pereira', n: 3 },
  { nome: 'Ana Souza', n: 1 },
  { nome: 'Bruno Costa', n: 0 },
]

/* ---------- Equipe (05, 8.3) ---------- */

export const equipeTs = [
  { nome: 'Fernanda Lima', automatica: 118, confirmada: 22, estimada: 12, sem: 6, disponivel: 168, ausencia: 0 },
  { nome: 'João Pereira', automatica: 101, confirmada: 26, estimada: 22, sem: 11, disponivel: 168, ausencia: 0 },
  { nome: 'Ana Souza', automatica: 95, confirmada: 14, estimada: 9, sem: 4, disponivel: 136, ausencia: 32 },
  { nome: 'Bruno Costa', automatica: 82, confirmada: 18, estimada: 31, sem: 14, disponivel: 168, ausencia: 0 },
]

export const capturaSemanal = [
  { semana: 'out 26', automatica: 64, confirmada: 14, estimada: 18 },
  { semana: 'nov 2', automatica: 68, confirmada: 13, estimada: 15 },
  { semana: 'nov 9', automatica: 70, confirmada: 12, estimada: 14 },
  { semana: 'nov 16', automatica: 73, confirmada: 13, estimada: 10 },
]

export const ondeFoi = {
  cliente: [
    { nome: 'Transportes Rota Sul S.A.', h: 168 },
    { nome: 'Metalúrgica Andrade Ltda', h: 142 },
    { nome: 'Padaria Pão Quente ME', h: 74 },
    { nome: 'Loja Bela Vista Eireli', h: 61 },
    { nome: 'Clínica Sorriso Ltda', h: 58 },
    { nome: 'Interno', h: 46 },
    { nome: 'outros', h: 63 },
  ],
  atividade: [
    { nome: 'GES-025 · Atendimento', h: 96 },
    { nome: 'FIS-019 · DCTFWeb', h: 74 },
    { nome: 'CTB-015 · Conciliação', h: 71 },
    { nome: 'DP-011 · Folha', h: 66 },
    { nome: 'FIS-009 · PGDAS-D', h: 52 },
    { nome: 'outros', h: 253 },
  ],
  origem: [
    { nome: 'tarefa aberta', h: 302 },
    { nome: 'conversa no CRM', h: 96 },
    { nome: 'core', h: 71 },
    { nome: 'extensão', h: 49 },
    { nome: 'artefato', h: 42 },
    { nome: 'confirmação', h: 52 },
  ],
}

export const porAtividadeEstimada = [
  { atividade: 'CTB-031 · Balancete', estimada: 62, n: 18 },
  { atividade: 'DP-019 · Holerites', estimada: 54, n: 22 },
  { atividade: 'FIS-023 · SPED', estimada: 41, n: 9 },
  { atividade: 'FIS-010 · DAS', estimada: 33, n: 41 },
]

export interface LinhaCalibracao {
  atividade: string
  catalogoMin: number
  medianaMin: number
  n: number
  adotada?: boolean
}
export const calibracao: LinhaCalibracao[] = [
  { atividade: 'FIS-019 · DCTFWeb', catalogoMin: 9, medianaMin: 22, n: 63 },
  { atividade: 'FIS-009 · PGDAS-D', catalogoMin: 15, medianaMin: 13, n: 48 },
  { atividade: 'CTB-015 · Conciliação', catalogoMin: 48, medianaMin: 71, n: 31 },
  { atividade: 'DP-011 · Folha', catalogoMin: 12, medianaMin: 19, n: 27 },
]

export interface Contestacao {
  id: string
  pessoa: string
  sessao: string
  motivo: string
  correcao: string
  nota?: string
  evidencias: string[]
}
export const contestacoesADecidir: Contestacao[] = [
  {
    id: 'k1',
    pessoa: 'João Pereira',
    sessao: 'seg 16/11 · 09:00–11:20 · CTB-015 · Metalúrgica',
    motivo: 'cliente errado',
    correcao: 'Clínica Sorriso Ltda',
    nota: 'Estava com a tarefa da Metalúrgica aberta, mas conciliei a Clínica.',
    evidencias: ['tarefa CTB-015 Metalúrgica aberta às 09:00', 'nenhum artefato da Metalúrgica no intervalo', '2 documentos da Clínica classificados às 10:40'],
  },
  {
    id: 'k2',
    pessoa: 'Bruno Costa',
    sessao: 'ter 17/11 · 14:00–17:00 · SOC-031 · Metalúrgica',
    motivo: 'tempo errado',
    correcao: '14:00–15:10',
    evidencias: ['tarefa aberta às 14:00', 'último evento às 15:08', 'pulsos até 17:00 sem entrada (tela aberta)'],
  },
  { id: 'k3', pessoa: 'Ana Souza', sessao: 'qua 18/11 · 08:10–08:40 · DP-011 · Loja Bela Vista', motivo: 'não era trabalho', correcao: 'descartar', evidencias: ['tarefa aberta às 08:10 sem ação'] },
]

export const agentesEquipe = [
  { integrante: 'Fiscal', setor: 'fiscal' as SetorIntegrante, dono: 'Fernanda Lima', maquina: '6h10', custo: 'R$ 148,20', passos: 1840, poupadas: 31.5, aprovacao: 88 },
  { integrante: 'Contábil', setor: 'contabil' as SetorIntegrante, dono: 'João Pereira', maquina: '4h05', custo: 'R$ 96,70', passos: 1210, poupadas: 18.2, aprovacao: 84 },
  { integrante: 'DP', setor: 'dp' as SetorIntegrante, dono: 'Ana Souza', maquina: '2h50', custo: 'R$ 71,40', passos: 760, poupadas: 12.6, aprovacao: 91 },
  { integrante: 'Atendimento', setor: 'gestao_atendimento' as SetorIntegrante, dono: 'Bruno Costa', maquina: '5h40', custo: 'R$ 96,50', passos: 2210, poupadas: 22.4, aprovacao: 79 },
]

export const filaSemEquivalente = [
  { id: 'q1', core: 'Alterdata', nome: 'Apuração mensal ICMS/ST', departamento: 'Fiscal', ocorrencias: 34, sugestoes: ['FIS-024 · Apuração ICMS', 'FIS-021 · DARF', 'FIS-004 · Conferência'] },
  { id: 'q2', core: 'Alterdata', nome: 'Folha mensal', departamento: 'Pessoal', ocorrencias: 21, sugestoes: ['DP-011 · Folha', 'DP-012 · Resumo da folha', 'DP-019 · Holerites'] },
  { id: 'q3', core: 'Alterdata', nome: 'Envio de balancete', departamento: 'Contábil', ocorrencias: 12, sugestoes: ['CTB-031 · Balancete', 'CTB-028 · Relatório ao cliente', 'CTB-017 · Envio ao core'] },
  { id: 'q4', core: 'Alterdata', nome: 'Café com cliente', departamento: 'Diretoria', ocorrencias: 3, sugestoes: ['GES-045 · Reunião', 'GES-033 · Ligação', 'GES-025 · Atendimento'] },
]

export const foraJornada = [
  { nome: 'Fernanda Lima', horas: 4.5, ocorrencias: 6 },
  { nome: 'João Pereira', horas: 1.2, ocorrencias: 2 },
  { nome: 'Ana Souza', horas: 0, ocorrencias: 0 },
  { nome: 'Bruno Costa', horas: 0.5, ocorrencias: 1 },
]

export const diagnosticoCobertura = [
  { item: 'Bruno Costa sem a extensão vinculada', impacto: 'alto' },
  { item: '27 tipos de tarefa do Alterdata sem equivalente', impacto: 'alto' },
  { item: '9 tarefas concluídas sem sessão no mês (fez e só marcou)', impacto: 'médio' },
  { item: 'CTB-031 e DP-019 com mais de 50% estimado', impacto: 'médio' },
]

export interface Conector {
  core: 'Alterdata' | 'Domínio' | 'Questor' | 'Contmatic'
  modo: string
  status: 'conectado' | 'importação' | 'não conectado'
  detalhe: string
}
export const conectores: Conector[] = [
  { core: 'Alterdata', modo: 'API ePlugin', status: 'conectado', detalhe: 'leitura a cada 15 min · última 10:45 · 412 tarefas no mês' },
  { core: 'Domínio', modo: 'relatório do Processos (Excel)', status: 'importação', detalhe: 'último relatório: semana de 09/11' },
  { core: 'Contmatic', modo: 'arquivos na pasta + relatório', status: 'não conectado', detalhe: '—' },
]

export const mapasDepartamento = [
  { core: 'Pessoal', setor: 'dp' as SetorIntegrante },
  { core: 'Fiscal', setor: 'fiscal' as SetorIntegrante },
  { core: 'Contábil', setor: 'contabil' as SetorIntegrante },
  { core: 'Legalização', setor: 'societario' as SetorIntegrante },
  { core: 'Diretoria', setor: undefined },
]
export const mapasResponsavel = [
  { core: 'fernanda.lima', usuario: 'Fernanda Lima' },
  { core: 'joao.p', usuario: 'João Pereira' },
  { core: 'ana.souza', usuario: 'Ana Souza' },
  { core: 'estagiario01', usuario: undefined },
]

/* ---------- Rentabilidade (05, 8.4) ---------- */

export const custoHora = {
  valor: 300,
  mes: 'outubro',
  gastos: [
    { nome: 'Folha e encargos', valor: 142000 },
    { nome: 'Pró-labore', valor: 36000 },
    { nome: 'Aluguel e condomínio', valor: 14500 },
    { nome: 'Sistemas e assinaturas', valor: 9800 },
    { nome: 'Impostos do escritório', valor: 18700 },
    { nome: 'Outros', valor: 6000 },
  ],
  horasProdutivas: 757,
}

export interface Rentabilidade {
  cliente: string
  horas: number
  honorario?: number
  variaveis: number
  serie: number[]
  marcos?: { mes: number; texto: string }[]
  porSetor: { setor: string; h: number }[]
}

export const rentabilidade: Rentabilidade[] = [
  {
    cliente: 'Transportes Rota Sul S.A.',
    horas: 36,
    honorario: 14800,
    variaveis: 210,
    serie: [32, 30, 31, 29, 28, 27, 25, 24, 26, 25, 26, 26],
    marcos: [{ mes: 6, texto: 'filial nova' }],
    porSetor: [
      { setor: 'Fiscal', h: 15 },
      { setor: 'DP', h: 12 },
      { setor: 'Contábil', h: 9 },
    ],
  },
  {
    cliente: 'Metalúrgica Andrade Ltda',
    horas: 18,
    honorario: 7500,
    variaveis: 96,
    serie: [-12, -8, -5, 4, 9, 12, 16, 19, 22, 24, 26, 27],
    marcos: [
      { mes: 2, texto: 'reajuste' },
      { mes: 9, texto: 'Lucro Presumido' },
    ],
    porSetor: [
      { setor: 'Fiscal', h: 8 },
      { setor: 'Contábil', h: 6 },
      { setor: 'DP', h: 4 },
    ],
  },
  {
    cliente: 'Clínica Sorriso Ltda',
    horas: 9,
    honorario: 3900,
    variaveis: 30,
    serie: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 30],
    marcos: [{ mes: 10, texto: 'entrada' }],
    porSetor: [
      { setor: 'Contábil', h: 6 },
      { setor: 'Societário', h: 3 },
    ],
  },
  {
    cliente: 'Padaria Pão Quente ME',
    horas: 8,
    honorario: 1900,
    variaveis: 40,
    serie: [8, 6, 4, 2, 1, -2, -5, -8, -10, -12, -15, -28],
    marcos: [{ mes: 11, texto: '2 admissões' }],
    porSetor: [
      { setor: 'DP', h: 5 },
      { setor: 'Fiscal', h: 3 },
    ],
  },
  {
    cliente: 'Loja Bela Vista Eireli',
    horas: 17,
    honorario: 4400,
    variaveis: 25,
    serie: [10, 8, 6, 3, 0, -4, -8, -10, -12, -14, -16, -17],
    marcos: [{ mes: 4, texto: 'faixa estourada' }],
    porSetor: [
      { setor: 'DP', h: 9 },
      { setor: 'Fiscal', h: 5 },
      { setor: 'Contábil', h: 3 },
    ],
  },
  { cliente: 'Carlos Menezes', horas: 2, variaveis: 0, serie: [], porSetor: [{ setor: 'Fiscal', h: 2 }] },
]

export const mesesCurtos = ['nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out']

export const configTs = { inatividadeMin: 3, itensDia: 8, fechamento: '18:00', jornada: { inicio: '08:00', fim: '18:00', dias: 'seg a sex' }, equipeAposSemanas: 2, benchmark: false }

export const ausencias = [{ pessoa: 'Ana Souza', tipo: 'férias', de: '03/11', ate: '07/11' }]

/**
 * O dia de cada pessoa (qua 18/11), ligado às tarefas e conversas dela. O da
 * Fernanda é `sessoesDia`; os demais seguem as tarefas que cada um tem no Painel.
 */
const s = (id: string, inicio: string, fim: string, atividade: string | undefined, rotulo: string, cliente: string | undefined, confianca: Confianca, origem: Origem, evidencias: string[], foraJornada?: boolean): SessaoTs => ({
  id,
  inicio,
  fim,
  atividade,
  rotulo,
  cliente,
  confianca,
  origem,
  evidencias,
  foraJornada,
})

export const sessoesPorUsuario: Record<string, SessaoTs[]> = {
  u1: [
    ...sessoesDia.filter((x) => x.id !== 's8'),
    {
      id: 'sb1',
      inicio: '18:00',
      fim: '18:25',
      atividade: 'FIN-201',
      rotulo: 'Conferir o lote da Clínica (BPO de uma pessoa)',
      cliente: 'Clínica Sorriso Ltda',
      confianca: 'automatica',
      origem: 'plataforma',
      evidencias: ['abriu Aprovações do BPO', 'conferiu 1 conta'],
    },
    ...sessoesDia.filter((x) => x.id === 's8'),
  ],
  // BPO (10): as sessões do pacote também vêm da plataforma (tarefas e telas do BPO).
  u8: [
    s('m1', '08:30', '09:20', 'FIN-201', 'Conferir lotes (Padaria e Mercado)', 'Padaria Pão Quente ME', 'automatica', 'plataforma', ['abriu Aprovações do BPO', 'conferiu Gráfica Nova e Frigorífico']),
    s('m2', '09:20', '10:40', 'BPO-009', 'Religar o Bling', 'Loja Bela Vista Eireli', 'automatica', 'plataforma', ['tarefa BPO-009 aberta', 'Configuração do BPO › ERP']),
    s('m3', '10:40', '12:00', 'FIN-006', 'Relatório de outubro', 'Studio Forma Arquitetura Ltda', 'confirmada', 'plataforma', ['relatório gerado e enviado ao app']),
    s('m4', '13:00', '14:10', 'FIN-004', 'Conciliação', 'Clínica Sorriso Ltda', 'automatica', 'plataforma', ['conciliou 11 lançamentos']),
  ],
  u9: [
    s('l1', '08:10', '10:30', 'FIN-003', 'Captura de contas', 'Mercado Bom Preço Ltda', 'automatica', 'plataforma', ['digitou 6 contas', 'confirmou a Gráfica Nova por ligação (Padaria)']),
    s('l2', '10:30', '12:00', 'FIN-004', 'Baixas no Nibo (modo arquivo)', 'Mercado Bom Preço Ltda', 'estimada', 'confirmacao', ['checklist “lançar no ERP”']),
    s('l3', '13:00', '14:00', 'FIN-201', 'Pedido da Patrícia (WhatsApp)', 'Mercado Bom Preço Ltda', 'automatica', 'crm', ['respondeu a Patrícia no CRM']),
  ],
  u2: [
    s('j1', '08:15', '09:40', 'CTB-047', 'Balanço de abertura', 'Clínica Sorriso Ltda', 'automatica', 'plataforma', ['tarefa CTB-047 aberta às 08:15', 'balancete do contador anterior aberto']),
    s('j2', '09:40', '10:05', 'GES-025', 'Atendimento', 'Clínica Sorriso Ltda', 'automatica', 'crm', ['respondeu a Dra. Lívia no CRM às 09:52']),
    s('j3', '10:05', '11:50', 'FIS-038', 'Intimação SEFAZ', 'Transportes Rota Sul S.A.', 'automatica', 'plataforma', ['tarefa FIS-038 aberta', 'portal da SEFAZ-RS · 41 pulsos']),
    s('j4', '13:10', '13:40', undefined, 'sem registro', 'Transportes Rota Sul S.A.', 'estimada', 'confirmacao', ['30 min sem evento', 'antes e depois: FIS-038 Rota Sul']),
    s('j5', '13:40', '16:30', 'CTB-015', 'Conciliação', 'Metalúrgica Andrade Ltda', 'confirmada', 'core', ['Alterdata: tarefa “Conciliação mensal” concluída às 16:28']),
    s('j6', '16:30', '17:45', 'FIS-005', 'Caixa postal e-CAC', 'Transportes Rota Sul S.A.', 'automatica', 'extensao', ['e-CAC com o CNPJ da Rota Sul · 22 pulsos']),
  ],
  u3: [
    s('a1', '08:05', '09:30', 'DP-004', 'Contrato de experiência', 'Metalúrgica Andrade Ltda', 'automatica', 'plataforma', ['tarefa DP-004 aberta', 'cartão do DP revisado']),
    s('a2', '09:30', '10:20', 'DP-001', 'Admissão (áudio)', 'Padaria Pão Quente ME', 'automatica', 'crm', ['assumiu a conversa do áudio de João Batista']),
    s('a3', '10:20', '12:00', 'DP-014', 'Ponto de outubro', 'Loja Bela Vista Eireli', 'confirmada', 'confirmacao', ['ponto recebido de Ana Prates pelo app às 10:12']),
    s('a4', '13:00', '15:40', 'DP-027', 'Rescisão', 'Metalúrgica Andrade Ltda', 'automatica', 'extensao', ['eSocial · 64 pulsos', 'tarefa DP-027 aberta']),
    s('a5', '15:40', '16:10', undefined, 'sem classificação', undefined, 'sem', 'confirmacao', ['30 min sem evento e sem pista']),
    s('a6', '16:10', '17:50', 'DP-043', 'S-2230 Carlos Lima', 'Metalúrgica Andrade Ltda', 'estimada', 'artefato', ['S-2230 corrigido salvo às 17:41']),
  ],
  u4: [
    s('b1', '08:30', '10:15', 'SOC-031', 'Exigência JUCESP', 'Metalúrgica Andrade Ltda', 'automatica', 'extensao', ['portal da JUCESP · 37 pulsos', 'tarefa SOC-031 aberta']),
    s('b2', '10:15', '11:00', 'GES-024', 'Lead da cafeteria', undefined, 'automatica', 'crm', ['assumiu a conversa do lead às 10:16']),
    s('b3', '11:00', '12:10', 'SOC-009', 'Certificado A1', 'Metalúrgica Andrade Ltda', 'estimada', 'confirmacao', ['pedido de renovação aberto às 11:05']),
    s('b4', '13:20', '17:30', 'GES-025', 'Atendimento', undefined, 'automatica', 'crm', ['14 conversas atendidas na fila do setor']),
  ],
  u7: [
    s('r1', '08:15', '09:50', 'FIS-009', 'PGDAS-D (divergência)', 'Padaria Pão Quente ME', 'automatica', 'plataforma', ['tarefa FIS-009 aberta', 'comparou receita × notas']),
    s('r2', '09:50', '10:10', 'GES-025', 'Atendimento', 'Padaria Pão Quente ME', 'automatica', 'crm', ['conversa fiscal com João Batista']),
    s('r3', '10:10', '12:00', 'NFE-021', 'XML sem nota', 'Metalúrgica Andrade Ltda', 'confirmada', 'confirmacao', ['3 compras sem XML pedidas ao fornecedor']),
    s('r4', '13:00', '14:30', 'NFE-503', 'Certificado da captura', 'Clínica Sorriso Ltda', 'estimada', 'artefato', ['pedido de certificado salvo às 14:22']),
    s('r5', '14:30', '17:40', 'FIS-010', 'DAS da carteira', undefined, 'automatica', 'plataforma', ['12 guias DAS registradas']),
  ],
}

/** Resumo do dia a partir das sessões. */
export function resumoDe(sessoes: SessaoTs[]) {
  const dur = (x: SessaoTs) => min(x.fim) - min(x.inicio)
  const soma = (f: (x: SessaoTs) => boolean) => sessoes.filter(f).reduce((t, x) => t + dur(x), 0)
  return {
    registradas: soma(() => true),
    automaticas: soma((x) => x.confianca === 'automatica'),
    confirmadas: soma((x) => x.confianca === 'confirmada'),
    estimadas: soma((x) => x.confianca === 'estimada'),
    sem: soma((x) => x.confianca === 'sem'),
  }
}

/* ---------- Pacote como filtro (decisão de 8/11/2026) ---------- */

/**
 * O custo-hora continua um só, do escritório, com todos os pacotes. O BPO
 * entra como filtro nas telas do Timesheet (Meu tempo, Equipe, Rentabilidade)
 * para ver horas, custo e margem separados. Custo-hora por pacote é extra
 * opcional (Timesheet › Configurar), desligado por padrão.
 */
export type PacoteTs = 'todos' | 'contabil' | 'bpo'
export const custoHoraPacoteBpo = 85
/** Atividades do catálogo que são do pacote BPO. */
export const ehBpo = (atividade?: string) => !!atividade && /^(FIN|BPO)-/.test(atividade)

export const mesClientesBpo = [
  { nome: 'Clínica Sorriso Ltda', h: 1.5 },
  { nome: 'Studio Forma Arquitetura Ltda', h: 0.5 },
]
export const mesAtividadesBpo = [
  { nome: 'FIN-201 · Lote de pagamento', h: 1.5 },
  { nome: 'BPO-013 · Fechamento', h: 0.5 },
]

export const equipeBpoTs = [
  // Horas de BPO no mês (a captura e a conciliação são do integrante; as pessoas conferem e tratam exceções).
  { nome: 'Marina Teixeira', automatica: 3, confirmada: 1, estimada: 0, sem: 0, disponivel: 30, ausencia: 0 },
  { nome: 'Lucas Prado', automatica: 16, confirmada: 2, estimada: 2.5, sem: 1, disponivel: 40, ausencia: 0 },
]

export const ondeFoiBpo = {
  cliente: [
    { nome: 'Mercado Bom Preço Ltda', h: 8 },
    { nome: 'Loja Bela Vista Eireli', h: 6 },
    { nome: 'Padaria Pão Quente ME', h: 3.5 },
    { nome: 'AutoPeças Rota 9 Ltda', h: 3 },
    { nome: 'Clínica Sorriso Ltda', h: 2.5 },
    { nome: 'Studio Forma Arquitetura Ltda', h: 1.5 },
  ],
  atividade: [
    { nome: 'FIN-201 · Conferência e lotes', h: 8 },
    { nome: 'FIN-004 · Exceções da conciliação', h: 6 },
    { nome: 'BPO-009 · ERP e credenciais', h: 4.5 },
    { nome: 'FIN-006 · Relatório do mês', h: 3 },
    { nome: 'FIN-003 · Captura (o que o integrante não leu)', h: 3 },
  ],
  origem: [
    { nome: 'tarefa aberta', h: 12 },
    { nome: 'plataforma (BPO)', h: 7 },
    { nome: 'conversa no CRM', h: 3.5 },
    { nome: 'confirmação', h: 2 },
  ],
}

/** Linhas de rentabilidade do BPO (as mesmas horas e honorários do módulo BPO). */
export function rentabilidadeBpo(empresas: { nome: string; horasMes: number; honorarioBpo: number }[]): Rentabilidade[] {
  return empresas.map((e) => ({ cliente: e.nome, horas: e.horasMes, honorario: e.honorarioBpo, variaveis: 0, serie: [], porSetor: [{ setor: 'BPO', h: e.horasMes }] }))
}

/** Rentabilidade pelo pacote: contábil, BPO, ou os dois somados por cliente. */
export function rentabilidadePorPacote(p: PacoteTs, bpo: Rentabilidade[]): Rentabilidade[] {
  if (p === 'contabil') return rentabilidade
  if (p === 'bpo') return bpo
  const juntos = rentabilidade.map((r) => {
    const b = bpo.find((x) => x.cliente === r.cliente)
    return b ? { ...r, horas: r.horas + b.horas, honorario: (r.honorario ?? 0) + (b.honorario ?? 0), porSetor: [...r.porSetor, ...b.porSetor] } : r
  })
  return [...juntos, ...bpo.filter((b) => !rentabilidade.some((r) => r.cliente === b.cliente))]
}

/** Estado inicial das confirmações (o mesmo em Confirmações e em Meu tempo, que leem a mesma memória da sessão). */
export const estadoInicialConfirmacoes = (): Record<string, 'pendente' | 'marcado' | 'feito' | 'descartado'> => Object.fromEntries(itensConfirmacao.map((i) => [i.id, i.tipo === 'sem_pista' ? 'pendente' : 'marcado']))
