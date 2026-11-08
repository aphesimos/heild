import type { SetorIntegrante } from '@/theme/tipos'

/** Dados das Configurações (Fundações 2, 7, 8, 9 e 10; subplano 02). Só o Administrador vê. */

export const escritorio = {
  razaoSocial: 'Contábil Andrade & Lima Ltda',
  nomeFantasia: 'Contábil',
  cnpj: '11.222.333/0001-44',
  crc: 'SP-2SP012345/O-6',
  fuso: 'America/Sao_Paulo',
  inatividadeMin: 3,
  carteiraLigada: false,
  segundoFator: 'administradores' as 'administradores' | 'todos' | 'opcional',
  modoBpo: false,
  resumoHora: '08:00',
  silencio: { de: '19:00', ate: '08:00', fimDeSemana: true },
}

export interface SetorCfg {
  codigo: SetorIntegrante | 'pf' | 'terceiro_setor' | 'nichos' | 'bpo' | 'ciclo_vida'
  nomePadrao: string
  nomeExibido: string
  temEquipe: boolean
  ativo: boolean
  responsavel?: string
  numero?: string
}

export const setoresCfg: SetorCfg[] = [
  { codigo: 'societario', nomePadrao: 'Clientes e Societário', nomeExibido: 'Clientes e Societário', temEquipe: true, ativo: true, responsavel: 'Bruno Costa' },
  { codigo: 'fiscal', nomePadrao: 'Fiscal', nomeExibido: 'Fiscal', temEquipe: true, ativo: true, responsavel: 'Fernanda Lima', numero: '+55 11 93000-0002' },
  { codigo: 'notas', nomePadrao: 'Notas fiscais', nomeExibido: 'Notas fiscais', temEquipe: true, ativo: true, responsavel: 'Fernanda Lima' },
  { codigo: 'dp', nomePadrao: 'Trabalhista e DP', nomeExibido: 'Departamento Pessoal', temEquipe: true, ativo: true, responsavel: 'Ana Souza', numero: '+55 11 93000-0003' },
  { codigo: 'contabil', nomePadrao: 'Contábil', nomeExibido: 'Contábil', temEquipe: true, ativo: true, responsavel: 'João Pereira' },
  { codigo: 'consultor', nomePadrao: 'Consultoria e Reforma', nomeExibido: 'Consultoria e Reforma', temEquipe: true, ativo: true, responsavel: 'Fernanda Lima' },
  { codigo: 'gestao_atendimento', nomePadrao: 'Gestão e Atendimento', nomeExibido: 'Gestão e Atendimento', temEquipe: true, ativo: true, responsavel: 'Bruno Costa', numero: '+55 11 93000-0001' },
  { codigo: 'financeiro_escritorio', nomePadrao: 'Financeiro do escritório', nomeExibido: 'Financeiro do escritório', temEquipe: true, ativo: true, responsavel: 'Fernanda Lima' },
  { codigo: 'bpo_financeiro', nomePadrao: 'BPO Financeiro', nomeExibido: 'BPO Financeiro', temEquipe: true, ativo: true, responsavel: 'Marina Teixeira', numero: '+55 11 93000-0004' },
  { codigo: 'pf', nomePadrao: 'Pessoa física', nomeExibido: 'Pessoa física', temEquipe: false, ativo: true },
  { codigo: 'terceiro_setor', nomePadrao: 'Terceiro setor', nomeExibido: 'Terceiro setor', temEquipe: false, ativo: false },
  { codigo: 'nichos', nomePadrao: 'Nichos', nomeExibido: 'Nichos (saúde, agro)', temEquipe: false, ativo: true },
]

export type Papel = 'administrador' | 'gestor' | 'colaborador'
export type SituacaoUsuario = 'ativo' | 'convidado' | 'bloqueado' | 'desativado'

export interface Vinculo {
  setor: SetorIntegrante
  modo: 'gestao' | 'execucao'
}

export interface ExcecaoTela {
  id: string
  tela: string
  efeito: 'liberar' | 'bloquear'
  nivel?: 'ler' | 'rascunhar' | 'executar'
  motivo: string
  ate?: string
}

export interface UsuarioCfg {
  id: string
  nome: string
  email: string
  papel: Papel
  situacao: SituacaoUsuario
  vinculos: Vinculo[]
  excecoes: ExcecaoTela[]
  carteira: string[]
  segundoFator: boolean
  ultimoAcesso: string
  cargo?: string
}

export const usuariosCfg: UsuarioCfg[] = [
  { id: 'u1', nome: 'Fernanda Lima', email: 'fernanda@contabilandrade.com.br', papel: 'administrador', situacao: 'ativo', vinculos: [], excecoes: [], carteira: [], segundoFator: true, ultimoAcesso: 'agora', cargo: 'Sênior' },
  {
    id: 'u2',
    nome: 'João Pereira',
    email: 'joao@contabilandrade.com.br',
    papel: 'gestor',
    situacao: 'ativo',
    vinculos: [
      { setor: 'contabil', modo: 'gestao' },
      { setor: 'fiscal', modo: 'execucao' },
    ],
    excecoes: [{ id: 'x1', tela: 'aba.financeiro.honorarios', efeito: 'liberar', nivel: 'ler', motivo: 'acompanha a cobrança dos clientes que atende' }],
    carteira: [],
    segundoFator: true,
    ultimoAcesso: 'hoje 09:12',
    cargo: 'Pleno',
  },
  {
    id: 'u3',
    nome: 'Ana Souza',
    email: 'ana@contabilandrade.com.br',
    papel: 'colaborador',
    situacao: 'ativo',
    vinculos: [{ setor: 'dp', modo: 'execucao' }],
    excecoes: [],
    carteira: [],
    segundoFator: false,
    ultimoAcesso: 'hoje 08:40',
    cargo: 'Pleno',
  },
  {
    id: 'u4',
    nome: 'Bruno Costa',
    email: 'bruno@contabilandrade.com.br',
    papel: 'colaborador',
    situacao: 'ativo',
    vinculos: [
      { setor: 'societario', modo: 'execucao' },
      { setor: 'gestao_atendimento', modo: 'execucao' },
    ],
    excecoes: [{ id: 'x2', tela: 'aba.societario.contratos', efeito: 'bloquear', motivo: 'honorários ficam com a sócia', ate: '31/12' }],
    carteira: [],
    segundoFator: false,
    ultimoAcesso: 'ontem 18:02',
    cargo: 'Júnior',
  },
  {
    id: 'u5',
    nome: 'Carla Mendes',
    email: 'carla@contabilandrade.com.br',
    papel: 'colaborador',
    situacao: 'convidado',
    vinculos: [{ setor: 'fiscal', modo: 'execucao' }],
    excecoes: [],
    carteira: [],
    segundoFator: false,
    ultimoAcesso: 'convite enviado há 2 dias',
  },
  {
    id: 'u7',
    nome: 'Rafael Nunes',
    email: 'rafael@contabilandrade.com.br',
    papel: 'colaborador',
    situacao: 'ativo',
    vinculos: [
      { setor: 'fiscal', modo: 'execucao' },
      { setor: 'notas', modo: 'execucao' },
    ],
    excecoes: [],
    carteira: [],
    segundoFator: false,
    ultimoAcesso: 'hoje 08:15',
    cargo: 'Júnior',
  },
  {
    id: 'u8',
    nome: 'Marina Teixeira',
    email: 'marina@contabilandrade.com.br',
    papel: 'gestor',
    situacao: 'ativo',
    vinculos: [{ setor: 'bpo_financeiro', modo: 'gestao' }],
    excecoes: [],
    carteira: [],
    segundoFator: true,
    ultimoAcesso: 'hoje 08:05',
    cargo: 'Sênior',
  },
  {
    id: 'u9',
    nome: 'Lucas Prado',
    email: 'lucas@contabilandrade.com.br',
    papel: 'colaborador',
    situacao: 'ativo',
    vinculos: [{ setor: 'bpo_financeiro', modo: 'execucao' }],
    excecoes: [],
    carteira: [],
    segundoFator: false,
    ultimoAcesso: 'hoje 08:30',
    cargo: 'Júnior',
  },
  { id: 'u6', nome: 'Rodrigo Alves', email: 'rodrigo@contabilandrade.com.br', papel: 'colaborador', situacao: 'desativado', vinculos: [], excecoes: [], carteira: [], segundoFator: false, ultimoAcesso: 'saiu em 09/2026' },
]

/** Telas (agrupamentos de ferramentas) que aceitam exceção (Fundações 2.2 e adendo 14). */
export const telasSistema = [
  { id: 'aba.societario', rotulo: 'Painel › Clientes e Societário' },
  { id: 'aba.societario.contratos', rotulo: 'Painel › Societário › Contratos e honorários' },
  { id: 'aba.fiscal', rotulo: 'Painel › Fiscal' },
  { id: 'aba.fiscal.guias', rotulo: 'Painel › Fiscal › Guias e pagamentos' },
  { id: 'aba.dp', rotulo: 'Painel › Trabalhista e DP' },
  { id: 'aba.contabil', rotulo: 'Painel › Contábil' },
  { id: 'aba.gestao', rotulo: 'Painel › Gestão' },
  { id: 'aba.financeiro.honorarios', rotulo: 'Financeiro › Contratos (honorários)' },
  { id: 'aba.financeiro.cobrancas', rotulo: 'Financeiro › Cobranças' },
  { id: 'aba.financeiro.contas_pagar', rotulo: 'Financeiro › Contas a pagar' },
  { id: 'aba.financeiro.conciliacao', rotulo: 'Financeiro › Conciliação' },
  { id: 'crm.comunicados', rotulo: 'CRM › Comunicados' },
  { id: 'timesheet.equipe', rotulo: 'Timesheet › Equipe' },
]

export const convitesPendentes = [{ email: 'carla@contabilandrade.com.br', papel: 'colaborador', setores: 'Fiscal', enviado: 'há 2 dias', expira: 'em 5 dias' }]

export const subinquilinos = [{ id: 'b1', nome: 'Andrade BPO Financeiro', cnpj: '22.333.444/0001-55', visivelParaMae: true, situacao: 'ativo', clientes: 12 }]

/* ---------- Armazenamento (Fundações 7) ---------- */

export interface ConectorArmazenamento {
  id: string
  nome: string
  tipo: 'google_drive' | 'onedrive_sharepoint' | 'plataforma' | 's3_compativel' | 'webdav' | 'sftp'
  raiz: string
  padrao: boolean
  situacao: 'ativo' | 'somente_leitura' | 'erro_credencial' | 'migrando'
  sincronizacao: string
  arquivos: number
  usadoGb?: number
  cotaGb?: number
}

export const rotuloTipoArmazenamento: Record<ConectorArmazenamento['tipo'], string> = {
  google_drive: 'Google Drive',
  onedrive_sharepoint: 'OneDrive / SharePoint',
  plataforma: 'Armazenamento da plataforma',
  s3_compativel: 'S3 compatível',
  webdav: 'WebDAV',
  sftp: 'SFTP',
}

export const conectoresArmazenamento: ConectorArmazenamento[] = [
  { id: 'a1', nome: 'Plataforma', tipo: 'plataforma', raiz: '/', padrao: true, situacao: 'ativo', sincronizacao: 'nativa', arquivos: 18420, usadoGb: 41.3, cotaGb: 50 },
  { id: 'a2', nome: 'Drive antigo do escritório', tipo: 'google_drive', raiz: 'Meu Drive/Clientes', padrao: false, situacao: 'somente_leitura', sincronizacao: 'notificação da nuvem', arquivos: 96210 },
]

export interface PastaModelo {
  caminho: string
  nivel: number
  visivel: boolean
  areas?: string
  herdada?: boolean
}

/** Árvore-modelo dos clientes (Fundações 7.2 e 7.8). */
export const arvoreModelo: PastaModelo[] = [
  { caminho: '<CNPJ - Nome do cliente>', nivel: 0, visivel: false },
  { caminho: 'permanentes', nivel: 1, visivel: false },
  { caminho: 'contrato social e alterações', nivel: 2, visivel: true, areas: 'sócio' },
  { caminho: 'procurações e certidões', nivel: 2, visivel: false },
  { caminho: '<ano>/<competência>', nivel: 1, visivel: false },
  { caminho: 'trabalho interno', nivel: 2, visivel: false },
  { caminho: 'Entregáveis', nivel: 1, visivel: true, areas: 'conforme a subpasta' },
  { caminho: 'Fiscal (guias, recibos)', nivel: 2, visivel: true, areas: 'sócio, financeiro', herdada: true },
  { caminho: 'Folha (holerites, guias)', nivel: 2, visivel: true, areas: 'sócio, RH', herdada: true },
  { caminho: 'Contábil (balancete, DRE)', nivel: 2, visivel: true, areas: 'sócio, contador interno', herdada: true },
  { caminho: 'BPO financeiro (relatórios, comprovantes)', nivel: 2, visivel: true, areas: 'quem aprova pagamentos', herdada: true },
]

export const destinoPorTipo = [
  { tipo: 'Guia de imposto (DAS, DARF, ISS)', setor: 'Fiscal', pasta: 'Entregáveis/Fiscal' },
  { tipo: 'Holerite e guia da folha', setor: 'DP', pasta: 'Entregáveis/Folha' },
  { tipo: 'Balancete, DRE', setor: 'Contábil', pasta: 'Entregáveis/Contábil' },
  { tipo: 'Recibo de transmissão', setor: 'Fiscal', pasta: '<ano>/<competência>/trabalho interno' },
  { tipo: 'Extrato bancário recebido', setor: 'Contábil', pasta: '<ano>/<competência>/trabalho interno' },
  { tipo: 'Contrato social e alterações', setor: 'Societário', pasta: 'permanentes/contrato social e alterações' },
  { tipo: 'Certidões e procurações', setor: 'Societário', pasta: 'permanentes/procurações e certidões' },
  { tipo: 'SPED e livros entregues', setor: 'Contábil', pasta: 'Entregáveis/Contábil' },
  { tipo: 'Relatório financeiro e comprovantes do BPO', setor: 'BPO Financeiro', pasta: 'Entregáveis/BPO financeiro' },
]

export const pastasSemCasamento = [
  { pasta: 'Meu Drive/Clientes/Padaria (antigo)', sugestao: 'Padaria Pão Quente ME' },
  { pasta: 'Meu Drive/Clientes/_modelos', sugestao: 'ignorar' },
  { pasta: 'Meu Drive/Clientes/Rota Sul 2019', sugestao: 'Transportes Rota Sul S.A.' },
]

/* ---------- Integrantes (Fundações 9; 02) ---------- */

export interface IntegrantePadraoCfg {
  setor: SetorIntegrante
  ligado: boolean
  sozinho: number
  prepara: number
  organiza: number
  instrucoesEscritorio: string
  canal: 'chat' | 'central' | 'whatsapp_do_dono'
}

export const integrantesPadraoCfg: IntegrantePadraoCfg[] = [
  { setor: 'geral', ligado: true, sozinho: 12, prepara: 4, organiza: 6, instrucoesEscritorio: 'Responda sempre citando o cliente pelo código e nome.', canal: 'chat' },
  { setor: 'fiscal', ligado: true, sozinho: 38, prepara: 71, organiza: 9, instrucoesEscritorio: 'DAS vai para o financeiro da empresa, nunca para o sócio.', canal: 'chat' },
  { setor: 'notas', ligado: true, sozinho: 27, prepara: 18, organiza: 5, instrucoesEscritorio: '', canal: 'central' },
  { setor: 'dp', ligado: true, sozinho: 22, prepara: 64, organiza: 11, instrucoesEscritorio: 'Admissão só começa com o ASO em mãos.', canal: 'chat' },
  { setor: 'contabil', ligado: true, sozinho: 31, prepara: 52, organiza: 8, instrucoesEscritorio: '', canal: 'chat' },
  { setor: 'societario', ligado: true, sozinho: 14, prepara: 41, organiza: 10, instrucoesEscritorio: '', canal: 'central' },
  { setor: 'consultor', ligado: true, sozinho: 6, prepara: 22, organiza: 3, instrucoesEscritorio: 'Pareceres sempre com a data da base legal.', canal: 'chat' },
  { setor: 'gestao_atendimento', ligado: true, sozinho: 25, prepara: 38, organiza: 9, instrucoesEscritorio: 'Nunca citar preço a lead.', canal: 'central' },
  { setor: 'financeiro_escritorio', ligado: true, sozinho: 4, prepara: 35, organiza: 4, instrucoesEscritorio: '', canal: 'central' },
  { setor: 'bpo_financeiro', ligado: true, sozinho: 9, prepara: 46, organiza: 7, instrucoesEscritorio: 'Pagar e transferir nunca são automáticos: só com o cartão aprovado pelo cliente.', canal: 'central' },
]

/** Amostra da lista "faz sozinho" do Fiscal (catálogo local). */
export const sozinhoFiscal = [
  { id: 'FIS-005', nome: 'Ler caixas postais e abrir tarefa', ligado: true },
  { id: 'FIS-006', nome: 'Consultar situação fiscal', ligado: true },
  { id: 'FIS-010', nome: 'Emitir e enviar o DAS', ligado: true, promovida: 'promovida por Fernanda em 02/11 (31 cartões, 97% sem edição)' },
  { id: 'FIS-031', nome: 'Registrar guia e enviar ao cliente', ligado: true },
  { id: 'FIS-036', nome: 'Emitir certidões negativas', ligado: true },
  { id: 'FIS-047', nome: 'Avisar atrasos e riscos', ligado: false },
]

export const perguntasPromocao = [{ id: 'pp1', integrante: 'Fiscal', atividade: 'FIS-021 · Emitir DARF de parcelamento', base: '34 cartões, 96% aprovados sem edição', reversivel: true }]

export const limitesUsuario = { tokensMes: '4 mi por usuário', custoMes: 'R$ 180 por usuário', integrantesPorUsuario: 3, jobsForaHorario: 'só com aprovação', concorrencia: 2 }

export const modelosIntegrante = [
  { id: 'mi1', nome: 'Vigia do ISS', autor: 'Fernanda Lima', versao: 2, instancias: 3, setores: 'Fiscal, Notas' },
  { id: 'mi2', nome: 'Cobrador de extrato', autor: 'João Pereira', versao: 1, instancias: 1, setores: 'Contábil' },
  { id: 'mi3', nome: 'Conferente de folha', autor: 'Ana Souza', versao: 3, instancias: 2, setores: 'DP' },
]

export const memoriaParaRevisar = [
  { id: 'me1', setor: 'Fiscal', regra: 'Padaria Pão Quente: DAS vai para o e-mail do contador interno, não do sócio.', origem: 'mensagem de Fernanda em 05/11', escrita: 'Fiscal (integrante)' },
  { id: 'me2', setor: 'DP', regra: 'Metalúrgica: horas extras chegam pelo ponto até o dia 25, nunca por e-mail.', origem: 'cartão aprovado por Ana em 04/11', escrita: 'DP (integrante)' },
  {
    id: 'me3',
    setor: 'Contábil',
    regra: 'Todo Pix acima de R$ 10 mil sem nota vai para conta corrente de sócio.',
    origem: 'correção de João em 03/11',
    escrita: 'Contábil (integrante)',
    alerta: 'regra ampla: vale para todos os clientes do setor',
  },
]

export const criadosPorUsuarios = [{ nome: 'Vigia do ISS', dono: 'Fernanda Lima', setores: 'Fiscal, Notas', situacao: 'em observação · 9 dias', custo: 'R$ 4,10 no mês' }]

/* ---------- Assinatura (Fundações 2.2) ---------- */

export const modulosAssinatura = [
  { id: 'painel', nome: 'Painel', descricao: 'abas dos setores, tarefas, obrigações', contratado: true },
  { id: 'agentes', nome: 'Time de agentes', descricao: 'integrantes por setor, chat, cartões', contratado: true },
  { id: 'crm', nome: 'CRM e multiatendimento', descricao: 'WhatsApp, e-mail, leads, comunicados', contratado: true },
  { id: 'timesheet', nome: 'Timesheet', descricao: 'captura de tempo e rentabilidade', contratado: true },
  { id: 'consultor', nome: 'Consultor', descricao: 'base legal, pareceres com citação', contratado: true },
  { id: 'app_cliente', nome: 'App do cliente', descricao: 'documentos, guias, pedidos, chat', contratado: false },
]

export const planos = [
  { id: 'essencial', nome: 'Essencial', preco: 'R$ 890/mês', usuarios: 5, clientes: 80, gb: 25, tokens: '10 mi' },
  { id: 'escritorio', nome: 'Escritório', preco: 'R$ 1.690/mês', usuarios: 12, clientes: 200, gb: 50, tokens: '30 mi' },
  { id: 'rede', nome: 'Rede', preco: 'R$ 3.400/mês', usuarios: 40, clientes: 600, gb: 200, tokens: '100 mi' },
]

export const assinatura = {
  plano: 'escritorio',
  vigenteDe: '01/03/2026',
  proximaCobranca: '01/12/2026',
  uso: { usuarios: 5, clientes: 142, gb: 41.3, tokens: 21.4 },
  cobranca: { cnpj: '11.222.333/0001-44', email: 'financeiro@contabilandrade.com.br', forma: 'boleto' as 'boleto' | 'cartao' | 'pix' },
  historico: [
    { de: '01/03/2026', plano: 'Escritório', motivo: 'troca de plano (era Essencial)' },
    { de: '01/11/2025', plano: 'Essencial', motivo: 'início' },
  ],
  faturas: [
    { mes: 'novembro', valor: 'R$ 1.690,00', status: 'paga' },
    { mes: 'outubro', valor: 'R$ 1.690,00', status: 'paga' },
    { mes: 'setembro', valor: 'R$ 1.744,20', status: 'paga', obs: 'tokens extras' },
  ],
}

export const versoesTema = [
  { versao: 4, quando: '02/11/2026', por: 'Fernanda Lima', mudanca: 'cor de atenção separada do destaque' },
  { versao: 3, quando: '14/09/2026', por: 'Fernanda Lima', mudanca: 'logotipo novo' },
  { versao: 2, quando: '01/03/2026', por: 'Fernanda Lima', mudanca: 'domínio próprio do painel' },
]
