import { fichas } from '@/ambiente/clientes'
import type { SetorIntegrante } from '@/theme/tipos'

/**
 * Dados do CRM (subplano 04). Fictícios, coerentes com o resto do lab:
 * Fernanda Lima (Gestora; Fiscal, Notas, DP, Contábil) é quem está logada.
 */

export type CanalCrm = 'whatsapp' | 'email' | 'app'
export type StatusConversa = 'nova' | 'em_atendimento' | 'aguardando_cliente' | 'aguardando_interno' | 'resolvida'
export type Entrega = 'enviada' | 'entregue' | 'lida' | 'falhou'

export const rotuloSetor: Partial<Record<SetorIntegrante, string>> = {
  gestao_atendimento: 'Gestão e Atendimento',
  fiscal: 'Fiscal',
  notas: 'Notas',
  dp: 'DP',
  contabil: 'Contábil',
  societario: 'Societário',
  consultor: 'Consultoria',
  bpo_financeiro: 'BPO Financeiro',
}

export const rotuloStatus: Record<StatusConversa, string> = {
  nova: 'nova',
  em_atendimento: 'em atendimento',
  aguardando_cliente: 'aguardando cliente',
  aguardando_interno: 'aguardando interno',
  resolvida: 'resolvida',
}

export const rotuloCanal: Record<CanalCrm, string> = { whatsapp: 'WhatsApp', email: 'E-mail', app: 'App' }

/** Um item do histórico unificado da conversa (04, 4.2). */
export type ItemConversa =
  | { tipo: 'dia'; texto: string }
  | {
      tipo: 'mensagem'
      id: string
      /** cliente; atendente (pessoa do escritório); integrante (IA, nome do tema); auto (mensagem automática por modelo). */
      de: 'cliente' | 'atendente' | 'integrante' | 'auto'
      autor?: string
      /** Setor do integrante, para a cor do orb. */
      setor?: SetorIntegrante
      hora: string
      canal: CanalCrm
      texto?: string
      assunto?: string
      anexos?: { nome: string; tipo: string }[]
      audio?: { duracao: string; transcricao: string }
      entrega?: Entrega
      /** Botões da mensagem automática (triagem do lead); `escolhido` marca o que a pessoa tocou. */
      botoes?: { rotulo: string; escolhido?: boolean }[]
      /** Apagada ou editada pelo cliente: guarda a versão anterior (GES-203). */
      apagada?: boolean
      modelo?: string
    }
  | { tipo: 'nota'; id: string; autor: string; hora: string; texto: string }
  | { tipo: 'marco'; id: string; hora: string; texto: string }
  | {
      tipo: 'cartao'
      id: string
      hora: string
      setor: SetorIntegrante
      titulo: string
      detalhe: string
      acoes: [string, string]
      decidido?: string
    }

export interface ConversaCrm {
  id: string
  clienteId?: string
  /** Nome da empresa; ausente = lead ou desconhecido. */
  cliente?: string
  lead?: boolean
  pessoa: { nome: string; papel: string; contato: string }
  setor: SetorIntegrante
  status: StatusConversa
  canal: CanalCrm
  responsavel?: string
  /** Minutos até estourar a primeira resposta (negativo = estourado); nulo = SLA pausado. */
  prazoMin: number | null
  /** Texto do prazo quando pausado ou resolvido ("amanhã", "ontem"). */
  prazoTexto?: string
  etiquetas: string[]
  previa: string
  naoLidas?: number
  resumo?: string
  /** Cliente escreveu há menos de 24 h (WhatsApp): texto livre liberado. */
  janelaAberta: boolean
  clienteInferido?: boolean
  /** Tarefa que segura a conversa em "aguardando interno". */
  tarefaAguardada?: string
  /** Transferida a outro setor: a origem fica só leitura (04, 4.3). */
  transferidaPara?: string
  itens: ItemConversa[]
}

export const usuarioCrm = { nome: 'Fernanda Lima', setores: ['fiscal', 'notas', 'dp', 'contabil', 'gestao_atendimento'] as SetorIntegrante[] }

export const equipeCrm = [
  { nome: 'Fernanda Lima', setores: ['fiscal', 'notas', 'dp', 'contabil', 'gestao_atendimento'] },
  { nome: 'João Pereira', setores: ['contabil', 'fiscal'] },
  { nome: 'Ana Souza', setores: ['dp'] },
  { nome: 'Bruno Costa', setores: ['societario', 'gestao_atendimento'] },
]

export const conversasCrm: ConversaCrm[] = [
  {
    id: 'cv1',
    clienteId: 'c1',
    cliente: 'Metalúrgica Andrade Ltda',
    pessoa: { nome: 'Rita Campos', papel: 'financeiro', contato: '+55 11 98123-4410' },
    setor: 'fiscal',
    status: 'nova',
    canal: 'whatsapp',
    prazoMin: 12,
    etiquetas: ['guia'],
    previa: 'E a do ISS, sai quando?',
    naoLidas: 2,
    resumo: 'Pediu a guia de PIS/COFINS de outubro (o integrante enviou, lida) e agora pergunta pela do ISS, que ainda não foi emitida.',
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'hoje · WhatsApp' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', autor: 'Rita', hora: '09:12', canal: 'whatsapp', texto: 'Bom dia! A guia do PIS/COFINS de outubro já saiu?' },
      { tipo: 'mensagem', id: 'm2', de: 'auto', hora: '09:12', canal: 'whatsapp', texto: 'Olá, Rita! Já vamos atendê-la.', modelo: 'ja_vamos_atender' },
      {
        tipo: 'mensagem',
        id: 'm3',
        de: 'integrante',
        autor: 'Fiscal',
        setor: 'fiscal',
        hora: '09:13',
        canal: 'whatsapp',
        texto: 'Saiu sim, Rita. PIS/COFINS 10/2026: R$ 18.204,11, vence em 25/11. Segue a guia.',
        anexos: [{ nome: 'PIS-COFINS-10-2026.pdf', tipo: 'guia' }],
        entrega: 'lida',
      },
      { tipo: 'mensagem', id: 'm4', de: 'cliente', autor: 'Rita', hora: '09:31', canal: 'whatsapp', texto: 'Obrigada! E a do ISS, sai quando?' },
      { tipo: 'nota', id: 'n1', autor: 'Fiscal (integrante)', hora: '09:31', texto: 'ISS 10/2026 ainda não foi apurado (tarefa FIS-022 a fazer). Prazo não é comigo: deixei para uma pessoa responder.' },
    ],
  },
  {
    id: 'cv2',
    clienteId: 'c2',
    cliente: 'Padaria Pão Quente ME',
    pessoa: { nome: 'João Batista', papel: 'sócio', contato: '+55 11 97440-1022' },
    setor: 'dp',
    status: 'nova',
    canal: 'whatsapp',
    prazoMin: 40,
    etiquetas: ['admissão'],
    previa: '🎤 áudio 0:48 · "contratei dois funcionários semana passada…"',
    naoLidas: 1,
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'hoje · WhatsApp' },
      {
        tipo: 'mensagem',
        id: 'm1',
        de: 'cliente',
        autor: 'João',
        hora: '08:47',
        canal: 'whatsapp',
        audio: { duracao: '0:48', transcricao: 'Oi, bom dia. É o João da padaria. Seguinte, contratei dois funcionários semana passada, um padeiro e uma atendente, começam segunda. O que vocês precisam de mim?' },
      },
      { tipo: 'mensagem', id: 'm2', de: 'auto', hora: '08:49', canal: 'whatsapp', texto: 'Olá, João! Já vamos atendê-lo.', modelo: 'ja_vamos_atender' },
      {
        tipo: 'cartao',
        id: 'k1',
        hora: '08:49',
        setor: 'dp',
        titulo: 'Abrir 2 admissões (DP-001)',
        detalhe: 'Padeiro e atendente, início segunda 23/11. S-2200 até domingo 22/11. Pedir ao João: RG, CPF, CTPS digital, comprovante de endereço e ASO de cada um.',
        acoes: ['Criar tarefas', 'Agora não'],
      },
    ],
  },
  {
    id: 'cv3',
    clienteId: 'c3',
    cliente: 'Loja Bela Vista Eireli',
    pessoa: { nome: 'Ana Prates', papel: 'RH', contato: 'app' },
    setor: 'dp',
    status: 'em_atendimento',
    canal: 'app',
    responsavel: 'Ana Souza',
    prazoMin: 130,
    etiquetas: ['ponto'],
    previa: 'Ana Souza: Recebi, obrigada. Fecho a folha amanhã.',
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'hoje · app' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', autor: 'Ana Prates', hora: '10:02', canal: 'app', texto: 'Segue o ponto de outubro.', anexos: [{ nome: 'ponto-outubro.pdf', tipo: 'ponto' }] },
      { tipo: 'marco', id: 'x1', hora: '10:05', texto: 'Ana Souza assumiu' },
      { tipo: 'mensagem', id: 'm2', de: 'atendente', autor: 'Ana Souza', hora: '10:06', canal: 'app', texto: 'Recebi, obrigada. Fecho a folha amanhã.', entrega: 'lida' },
    ],
  },
  {
    id: 'cv4',
    clienteId: 'c1',
    cliente: 'Metalúrgica Andrade Ltda',
    pessoa: { nome: 'Marcos Andrade', papel: 'sócio', contato: 'marcos@metalurgicaandrade.com.br' },
    setor: 'contabil',
    status: 'aguardando_cliente',
    canal: 'email',
    responsavel: 'Fernanda Lima',
    prazoMin: null,
    prazoTexto: 'até amanhã',
    etiquetas: ['extrato'],
    previa: 'Fernanda: Marcos, falta só o extrato do Inter de outubro…',
    janelaAberta: false,
    itens: [
      { tipo: 'dia', texto: '12/11 · e-mail' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', autor: 'Marcos', hora: '16:20', canal: 'email', assunto: 'Extratos de outubro', texto: 'Fernanda, mandei os do Itaú e do BB pelo app. O do Inter eu vejo amanhã.' },
      { tipo: 'marco', id: 'x1', hora: '16:40', texto: 'Fernanda Lima assumiu' },
      {
        tipo: 'mensagem',
        id: 'm2',
        de: 'atendente',
        autor: 'Fernanda Lima',
        hora: '16:42',
        canal: 'email',
        assunto: 'Re: Extratos de outubro',
        texto: 'Marcos, recebi os dois, obrigada. Falta só o extrato do Inter de outubro para fechar a competência.',
        entrega: 'entregue',
      },
      { tipo: 'marco', id: 'x2', hora: '16:42', texto: 'Aguardando cliente até 19/11 · régua de documentos na etapa 2 de 5' },
    ],
  },
  {
    id: 'cv5',
    lead: true,
    pessoa: { nome: 'Desconhecido', papel: 'lead · site', contato: '+55 11 98877-1234' },
    setor: 'gestao_atendimento',
    status: 'nova',
    canal: 'whatsapp',
    prazoMin: -6,
    etiquetas: ['comercial'],
    previa: 'Abri uma cafeteria e preciso de contador',
    naoLidas: 3,
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'hoje · WhatsApp' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', hora: '10:51', canal: 'whatsapp', texto: 'Oi, vi o site de vocês. Quanto custa a contabilidade?' },
      {
        tipo: 'mensagem',
        id: 'm2',
        de: 'auto',
        hora: '10:51',
        canal: 'whatsapp',
        texto: 'Olá! Aqui é o atendimento do Contábil. Você já é cliente?',
        modelo: 'boas_vindas_lead',
        botoes: [{ rotulo: 'Sou cliente' }, { rotulo: 'Quero conhecer os serviços', escolhido: true }, { rotulo: 'Outro assunto' }],
      },
      { tipo: 'mensagem', id: 'm3', de: 'cliente', hora: '10:52', canal: 'whatsapp', texto: 'Abri uma cafeteria e preciso de contador' },
      {
        tipo: 'mensagem',
        id: 'm4',
        de: 'integrante',
        autor: 'Atendimento',
        setor: 'gestao_atendimento',
        hora: '10:52',
        canal: 'whatsapp',
        texto: 'Que bom! Para eu passar ao responsável já com o essencial: a cafeteria já tem CNPJ? Qual o regime (MEI, Simples)? Tem funcionários? Hoje alguém cuida da contabilidade?',
        entrega: 'lida',
      },
      { tipo: 'nota', id: 'n1', autor: 'Atendimento (integrante)', hora: '10:52', texto: 'Perguntou preço: não informo valores a lead (04, 6.2). Qualificação iniciada; lead criado no quadro com origem site.' },
    ],
  },
  {
    id: 'cv6',
    clienteId: 'c5',
    cliente: 'Transportes Rota Sul S.A.',
    pessoa: { nome: 'Paula Reis', papel: 'fiscal da empresa', contato: 'paula.reis@rotasul.com.br' },
    setor: 'fiscal',
    status: 'em_atendimento',
    canal: 'email',
    responsavel: 'Fernanda Lima',
    prazoMin: 25,
    etiquetas: ['intimação', 'urgente'],
    previa: 'Recebemos uma intimação da SEFAZ sobre o CT-e…',
    naoLidas: 1,
    janelaAberta: false,
    itens: [
      { tipo: 'dia', texto: 'hoje · e-mail' },
      {
        tipo: 'mensagem',
        id: 'm1',
        de: 'cliente',
        autor: 'Paula',
        hora: '09:40',
        canal: 'email',
        assunto: 'Intimação SEFAZ · CT-e de setembro',
        texto: 'Bom dia. Recebemos uma intimação da SEFAZ sobre o CT-e de setembro, prazo de 10 dias. Segue o arquivo. Vocês conseguem ver?',
        anexos: [{ nome: 'intimacao-sefaz-0912.pdf', tipo: 'intimação' }],
      },
      { tipo: 'marco', id: 'x1', hora: '09:44', texto: 'Fernanda Lima assumiu · etiqueta "urgente" encurtou o prazo para 30 min' },
      { tipo: 'nota', id: 'n1', autor: 'Fernanda Lima', hora: '09:46', texto: '@João Pereira consegue olhar o CT-e 0912 hoje? Abro tarefa FIS-038.' },
    ],
  },
  {
    id: 'cv7',
    clienteId: 'c4',
    cliente: 'Clínica Sorriso Ltda',
    pessoa: { nome: 'Dra. Lívia Mendes', papel: 'sócia', contato: '+55 11 99610-5521' },
    setor: 'contabil',
    status: 'aguardando_interno',
    canal: 'whatsapp',
    responsavel: 'João Pereira',
    prazoMin: null,
    prazoTexto: 'com tarefa',
    etiquetas: ['implantação'],
    previa: 'João: Lívia, estou conferindo o balanço de abertura…',
    janelaAberta: false,
    tarefaAguardada: 'CTB-047 · Conferir balanço de abertura',
    itens: [
      { tipo: 'dia', texto: '16/11 · WhatsApp' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', autor: 'Lívia', hora: '18:03', canal: 'whatsapp', texto: 'João, o balanço que o contador antigo mandou está certo? Ele disse que estava tudo fechado.' },
      { tipo: 'marco', id: 'x1', hora: '18:20', texto: 'João Pereira assumiu' },
      { tipo: 'mensagem', id: 'm2', de: 'atendente', autor: 'João Pereira', hora: '18:22', canal: 'whatsapp', texto: 'Lívia, estou conferindo o balanço de abertura e te dou um retorno até sexta.', entrega: 'lida' },
      { tipo: 'marco', id: 'x2', hora: '18:22', texto: 'Aguardando interno · tarefa CTB-047' },
    ],
  },
  {
    id: 'cv8',
    clienteId: 'c1',
    cliente: 'Metalúrgica Andrade Ltda',
    pessoa: { nome: 'Helena Andrade', papel: 'sócia', contato: '+55 11 98555-0199' },
    setor: 'dp',
    status: 'resolvida',
    canal: 'whatsapp',
    responsavel: 'Ana Souza',
    prazoMin: null,
    prazoTexto: 'ontem',
    etiquetas: ['férias'],
    previa: 'Helena: Perfeito, obrigada!',
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'ontem · WhatsApp' },
      { tipo: 'mensagem', id: 'm1', de: 'cliente', autor: 'Helena', hora: '14:10', canal: 'whatsapp', texto: 'As férias do Carlos podem ser em dezembro?' },
      { tipo: 'marco', id: 'x1', hora: '14:12', texto: 'Ana Souza assumiu' },
      { tipo: 'mensagem', id: 'm2', de: 'atendente', autor: 'Ana Souza', hora: '14:15', canal: 'whatsapp', texto: 'Podem sim, e é bom: o período dele vence em 28/12. Programo de 01 a 30/12?', entrega: 'lida' },
      { tipo: 'mensagem', id: 'm3', de: 'cliente', autor: 'Helena', hora: '14:20', canal: 'whatsapp', texto: 'Perfeito, obrigada!' },
      { tipo: 'marco', id: 'x2', hora: '14:21', texto: 'Ana Souza resolveu · pesquisa de satisfação: 5' },
    ],
  },
  {
    id: 'cv9',
    clienteId: 'c2',
    cliente: 'Padaria Pão Quente ME',
    pessoa: { nome: 'João Batista', papel: 'sócio', contato: '+55 11 97440-1022' },
    setor: 'fiscal',
    status: 'aguardando_cliente',
    canal: 'whatsapp',
    responsavel: 'Rafael Nunes',
    prazoMin: null,
    prazoTexto: 'aguardando cliente',
    etiquetas: ['documento pendente'],
    previa: 'João: Mando as notas de outubro até amanhã.',
    resumo: 'PGDAS-D de outubro parado: receita declarada R$ 3.120 abaixo das notas emitidas. Cliente vai mandar as notas canceladas.',
    janelaAberta: true,
    itens: [
      { tipo: 'dia', texto: 'Hoje · WhatsApp' },
      {
        tipo: 'mensagem',
        id: 'm1',
        de: 'integrante',
        autor: 'Fiscal',
        setor: 'fiscal',
        hora: '09:50',
        canal: 'whatsapp',
        texto: 'Oi, João! No PGDAS-D de outubro da Padaria, a receita ficou R$ 3.120 abaixo das notas emitidas. Teve nota cancelada ou devolvida? Se puder, mande as notas de outubro por aqui.',
        entrega: 'lida',
      },
      { tipo: 'mensagem', id: 'm2', de: 'cliente', autor: 'João', hora: '10:01', canal: 'whatsapp', texto: 'Teve sim, duas canceladas. Mando as notas de outubro até amanhã.' },
      { tipo: 'marco', id: 'x1', hora: '10:02', texto: 'Aguardando cliente · tarefa FIS-009 da Padaria segue parada' },
    ],
  },
]

/** Cadastro projetado na lateral da conversa (04, 4.2). */
export const lateralCliente: Record<string, { perfil: string; responsavel: Partial<Record<SetorIntegrante, string>>; outrasEmpresas?: string[]; pendencias: string[]; historico: number; outrosSetores: number }> = {
  c1: { perfil: 'Lucro Presumido · SP · 38 empregados', responsavel: fichas.c1.responsaveis, pendencias: ['Extrato Inter 10/2026 · 6 dias', 'Comprovantes da diretoria · 3 dias'], historico: 14, outrosSetores: 3 },
  c2: { perfil: 'Simples Nacional · SP · 8 empregados', responsavel: fichas.c2.responsaveis, outrasEmpresas: ['Café Central ME'], pendencias: ['Notas de outubro · 1 dia', 'Documentos das 2 admissões'], historico: 6, outrosSetores: 1 },
  c3: { perfil: 'Simples Nacional · SP · 4 empregados', responsavel: fichas.c3.responsaveis, pendencias: [], historico: 9, outrosSetores: 2 },
  c4: { perfil: 'Lucro Presumido · SP · em implantação', responsavel: fichas.c4.responsaveis, pendencias: ['Balancete do contador anterior'], historico: 2, outrosSetores: 0 },
  c5: { perfil: 'Lucro Real · RS · 112 empregados', responsavel: fichas.c5.responsaveis, pendencias: [], historico: 31, outrosSetores: 5 },
  c7: { perfil: 'Simples Nacional · SP · 3 empregados', responsavel: fichas.c7.responsaveis, outrasEmpresas: ['Padaria Pão Quente ME'], pendencias: [], historico: 3, outrosSetores: 0 },
}

export interface RespostaRapida {
  id: string
  atalho: string
  texto: string
  /** Setor em que aparece; ausente = todos. */
  setor?: SetorIntegrante
}

export const respostasRapidas: RespostaRapida[] = [
  { id: 'rr1', atalho: '/recebido', texto: 'Recebido, obrigado! Já estamos cuidando.' },
  { id: 'rr2', atalho: '/prazo', texto: 'Vou confirmar com o responsável e já te passo o prazo.' },
  { id: 'rr3', atalho: '/docs', texto: 'Para seguir, precisamos de: ' },
  { id: 'rr4', atalho: '/app', texto: 'Você pode mandar pelo app, na aba Documentos: fica tudo organizado por mês.' },
  { id: 'rr5', atalho: '/ponto', texto: 'O ponto fecha dia 25. Pode mandar a planilha ou a foto do relógio por aqui.', setor: 'dp' },
]

export const modelosForaDaJanela = [
  { nome: 'documento_faltando', texto: 'Olá, {nome}! Para fechar {competencia}, ainda falta: {lista}. Pode enviar por aqui ou pelo app.' },
  { nome: 'retorno_atendimento', texto: 'Olá, {nome}! Temos um retorno sobre o seu pedido. Responda esta mensagem para continuarmos.' },
]

/* ---------- Leads (04, 6) ---------- */

export type EtapaLead = 'lead' | 'qualificado' | 'proposta' | 'contrato' | 'implantacao' | 'perdido'

export const etapasLead: { id: EtapaLead; rotulo: string }[] = [
  { id: 'lead', rotulo: 'Lead' },
  { id: 'qualificado', rotulo: 'Qualificado' },
  { id: 'proposta', rotulo: 'Proposta' },
  { id: 'contrato', rotulo: 'Contrato' },
  { id: 'implantacao', rotulo: 'Implantação' },
  { id: 'perdido', rotulo: 'Perdido' },
]

export interface Lead {
  id: string
  nome: string
  contato: string
  origem: 'whatsapp' | 'site' | 'indicação' | 'instagram'
  etapa: EtapaLead
  responsavel?: string
  /** Resumo da qualificação (regime, porte, dor, contabilidade atual). */
  qualificacao?: string
  servicos?: string[]
  valor?: string
  /** Próxima ação ou situação da etapa. */
  proxima?: string
  /** Minutos para a primeira resposta (lead: 15 min); negativo = estourado. */
  prazoMin?: number
  motivoPerda?: string
  trilha?: { feitos: number; total: number }
  conversaId?: string
  desde: string
}

export const leads: Lead[] = [
  { id: 'l1', nome: '+55 11 98877-1234', contato: 'WhatsApp', origem: 'site', etapa: 'lead', prazoMin: -6, proxima: 'qualificação em andamento pelo integrante', conversaId: 'cv5', desde: 'há 12 min' },
  { id: 'l2', nome: 'Studio Pilates Leve', contato: 'Camila · WhatsApp', origem: 'instagram', etapa: 'lead', prazoMin: 9, proxima: 'aguardando resposta da triagem', desde: 'há 6 min' },
  { id: 'l3', nome: 'Gráfica Ponto Certo', contato: 'Rui · indicação da Padaria Pão Quente', origem: 'indicação', etapa: 'lead', responsavel: 'Bruno Costa', proxima: 'ligar amanhã 10h', desde: 'há 2 dias' },
  {
    id: 'l4',
    nome: 'Cafeteria Grão Fino',
    contato: 'Carla · WhatsApp',
    origem: 'whatsapp',
    etapa: 'qualificado',
    responsavel: 'Bruno Costa',
    qualificacao: 'Simples · 3 funcionários · troca de contador',
    servicos: ['Fiscal', 'DP', 'Contábil'],
    proxima: 'montar proposta · 1 dia',
    desde: 'há 4 dias',
  },
  {
    id: 'l5',
    nome: 'Oficina Roda Viva',
    contato: 'Sérgio · site',
    origem: 'site',
    etapa: 'qualificado',
    responsavel: 'Fernanda Lima',
    qualificacao: 'Lucro Presumido · 12 funcionários · abrir filial',
    servicos: ['Fiscal', 'DP', 'Contábil', 'Societário'],
    proxima: 'reunião quinta 15h',
    desde: 'há 6 dias',
  },
  {
    id: 'l6',
    nome: 'Clínica Mais Saúde',
    contato: 'Dr. Paulo · indicação',
    origem: 'indicação',
    etapa: 'proposta',
    responsavel: 'Fernanda Lima',
    qualificacao: 'Lucro Presumido · 7 funcionários',
    servicos: ['Fiscal', 'DP', 'Contábil'],
    valor: 'R$ 2.800/mês',
    proxima: 'enviada há 3 dias · vista ontem',
    desde: 'há 12 dias',
  },
  {
    id: 'l7',
    nome: 'Mercadinho Bom Preço',
    contato: 'Neusa · WhatsApp',
    origem: 'whatsapp',
    etapa: 'proposta',
    responsavel: 'Bruno Costa',
    qualificacao: 'Simples · 5 funcionários',
    servicos: ['Fiscal', 'DP'],
    valor: 'R$ 1.450/mês',
    proxima: 'follow-up hoje',
    desde: 'há 9 dias',
  },
  {
    id: 'l8',
    nome: 'Auto Peças Norte',
    contato: 'Edu · site',
    origem: 'site',
    etapa: 'contrato',
    responsavel: 'Fernanda Lima',
    valor: 'R$ 3.200/mês',
    servicos: ['Fiscal', 'DP', 'Contábil'],
    proxima: 'assinatura pendente · 1 de 2',
    desde: 'há 20 dias',
  },
  {
    id: 'l9',
    nome: 'Clínica Sorriso Ltda',
    contato: 'Dra. Lívia',
    origem: 'indicação',
    etapa: 'implantacao',
    responsavel: 'João Pereira',
    valor: 'R$ 3.900/mês',
    trilha: { feitos: 4, total: 9 },
    proxima: 'balanço de abertura em conferência',
    desde: 'há 1 mês',
  },
  { id: 'l10', nome: 'Bar do Jorge', contato: 'Jorge', origem: 'whatsapp', etapa: 'perdido', motivoPerda: 'preço', desde: 'há 8 dias' },
  { id: 'l11', nome: 'Pet Shop Amigo', contato: 'Lia', origem: 'instagram', etapa: 'perdido', motivoPerda: 'sem contato', desde: 'há 14 dias' },
]

export const metricasLeads = {
  porOrigem: [
    { origem: 'WhatsApp', n: 9 },
    { origem: 'Site', n: 7 },
    { origem: 'Indicação', n: 5 },
    { origem: 'Instagram', n: 3 },
  ],
  conversao: [
    { etapa: 'Lead', n: 24 },
    { etapa: 'Qualificado', n: 13 },
    { etapa: 'Proposta', n: 8 },
    { etapa: 'Contrato', n: 4 },
  ],
  primeiraResposta: '11 min',
  fechadoMes: 'R$ 7.100/mês',
  motivosPerda: [
    { motivo: 'preço', n: 3 },
    { motivo: 'sem contato', n: 2 },
    { motivo: 'escolheu outro', n: 1 },
  ],
}

/* ---------- Comunicados e réguas (04, 7) ---------- */

export interface Comunicado {
  id: string
  titulo: string
  segmento: string
  modelo: string
  canal: string
  quando: string
  status: 'enviado' | 'agendado' | 'rascunho' | 'em aprovação'
  destinatarios: number
  entregues?: number
  lidas?: number
  respostas?: number
  falhas?: number
}

export const comunicados: Comunicado[] = [
  {
    id: 'co1',
    titulo: 'PGDAS-D de novembro',
    segmento: 'Simples · SP · setor Fiscal',
    modelo: 'prazo_pgdas_novembro',
    canal: 'WhatsApp + e-mail',
    quando: '10/11 09:00',
    status: 'enviado',
    destinatarios: 97,
    entregues: 94,
    lidas: 81,
    respostas: 12,
    falhas: 3,
  },
  { id: 'co2', titulo: 'Boletim de novembro', segmento: 'Todos os clientes ativos', modelo: 'boletim', canal: 'e-mail', quando: '03/11 08:00', status: 'enviado', destinatarios: 142, entregues: 140, lidas: 77, respostas: 4, falhas: 2 },
  { id: 'co3', titulo: '13º salário: prazos e documentos', segmento: 'Clientes com empregados', modelo: 'decimo_terceiro', canal: 'WhatsApp + e-mail', quando: '20/11 09:00', status: 'agendado', destinatarios: 63 },
  { id: 'co4', titulo: 'Reforma: o que muda em 2027', segmento: 'Lucro Presumido e Real', modelo: 'reforma_2027', canal: 'WhatsApp', quando: '—', status: 'em aprovação', destinatarios: 31 },
]

export interface Regua {
  id: string
  nome: string
  dispara: string
  etapas: string[]
  paraQuando: string
  ativa: boolean
  emCurso: number
  atividades: string
}

export const reguas: Regua[] = [
  {
    id: 'r1',
    nome: 'Documentos da competência',
    dispara: 'dia 1 e tarefa aguardando cliente',
    etapas: ['D0 lista', 'D+3 lembrete', 'D+7 só o que falta', 'D+10 ao sócio', 'D+15 Gestor'],
    paraQuando: 'documento recebido',
    ativa: true,
    emCurso: 18,
    atividades: 'CTB-003, NFE-038, DP-009',
  },
  { id: 'r2', nome: 'Guia a pagar', dispara: 'guia registrada', etapas: ['D-3 com a guia', 'D0', 'D+2 em aberto'], paraQuando: 'pago ou "paguei"', ativa: true, emCurso: 41, atividades: 'FIS-010, 032, DP-021' },
  { id: 'r3', nome: 'Certificado e cadastros', dispara: 'vence em 30 dias', etapas: ['D-30', 'D-15', 'D-5'], paraQuando: 'novo arquivo no cofre', ativa: true, emCurso: 4, atividades: 'SOC-009, 036' },
  { id: 'r4', nome: 'Prazo do cliente', dispara: 'tarefa com prazo legal', etapas: ['D-5', 'D-2', 'D-1 com a consequência'], paraQuando: 'resposta', ativa: true, emCurso: 6, atividades: 'DP-007, 012, 024' },
  { id: 'r5', nome: 'Lead sem resposta', dispara: 'último contato', etapas: ['D+3', 'D+7', 'perdido em D+14'], paraQuando: 'resposta', ativa: true, emCurso: 2, atividades: 'GES-042' },
  { id: 'r6', nome: 'Honorários', dispara: 'fase 3 (Financeiro)', etapas: ['D-5', 'D0', 'D+3', 'D+10', 'D+20 Gestor'], paraQuando: 'baixa do pagamento', ativa: false, emCurso: 0, atividades: 'GES-004' },
]

/** Segmento de exemplo do "Novo comunicado". */
export const segmentoExemplo = {
  filtros: ['regime = Simples', 'UF = SP', 'setor = Fiscal', 'perfil ≠ MEI'],
  clientes: 84,
  pessoas: 97,
  optIn: 91,
  modelo: 'prazo_pgdas_novembro',
  texto: 'Olá {nome}, o PGDAS-D de {competencia} vence {data}. Se faltar algo, a gente avisa por aqui.',
  exemplos: [
    { nome: 'Rita', competencia: '11/2026', data: '20/12' },
    { nome: 'João', competencia: '11/2026', data: '20/12' },
    { nome: 'Ana', competencia: '11/2026', data: '20/12' },
  ],
}

/* ---------- Configuração dos números (04, 3.2) ---------- */

export interface CanalSetor {
  setor: SetorIntegrante
  numero?: string
  principal?: boolean
  conexao?: string
  status: 'ativo' | 'atencao' | 'sem número'
  statusTexto: string
  email?: string
  experimental?: boolean
}

export const canaisSetor: CanalSetor[] = [
  { setor: 'gestao_atendimento', numero: '+55 11 93000-0001', principal: true, conexao: 'Cloud API · coexistência', status: 'ativo', statusTexto: 'app ok · qualidade alta', email: 'contato@' },
  { setor: 'fiscal', numero: '+55 11 93000-0002', conexao: 'Cloud API', status: 'ativo', statusTexto: 'qualidade alta', email: 'fiscal@' },
  { setor: 'dp', numero: '+55 11 93000-0003', conexao: 'Cloud API · coexistência', status: 'atencao', statusTexto: 'abrir o app em 2 dias (a Meta pede a cada 14)', email: 'dp@' },
  { setor: 'contabil', status: 'sem número', statusTexto: 'usa o principal', email: 'contabil@' },
  { setor: 'notas', status: 'sem número', statusTexto: 'usa o principal' },
  { setor: 'societario', status: 'sem número', statusTexto: 'usa o principal' },
  { setor: 'consultor', status: 'sem número', statusTexto: 'usa o principal' },
]

export const empresaMeta = { verificada: true, limite: '2.000 conversas / 24 h', qualidade: 'alta', proximoLimite: '10 mil com qualidade alta por 7 dias' }

/* ---------- Cadastros da Configuração dos números (04, 3.2 e 3.3) ---------- */

export type StatusModelo = 'rascunho' | 'em aprovação' | 'aprovado' | 'rejeitado' | 'pausado'

/** Modelo de mensagem (template da Meta), por escritório (04, 3.3; GES-029). */
export interface ModeloMensagem {
  id: string
  nome: string
  categoria: 'utilidade' | 'marketing'
  idioma: 'pt_BR'
  texto: string
  botoes: string[]
  /** Setores cujos números usam o modelo. */
  setores: SetorIntegrante[]
  status: StatusModelo
  motivo?: string
  versao: number
  /** Evento do sistema que usa o modelo por padrão (guia emitida, documento faltando…). */
  evento?: string
}

/** Variáveis do sistema que um modelo pode usar, com um exemplo para a prévia. */
export const variaveisModelo: { nome: string; exemplo: string; descricao: string }[] = [
  { nome: 'nome', exemplo: 'Rita', descricao: 'primeiro nome de quem recebe' },
  { nome: 'empresa', exemplo: 'Metalúrgica Andrade', descricao: 'nome do cliente' },
  { nome: 'competencia', exemplo: '10/2026', descricao: 'mês de referência' },
  { nome: 'data', exemplo: '20/11', descricao: 'vencimento ou prazo' },
  { nome: 'valor', exemplo: 'R$ 18.204,11', descricao: 'valor da guia' },
  { nome: 'lista', exemplo: 'extrato do Inter', descricao: 'o que falta, em lista' },
  { nome: 'setor', exemplo: 'Fiscal', descricao: 'nome exibido do setor' },
  { nome: 'escritorio', exemplo: 'Contábil', descricao: 'nome do escritório (tema)' },
]

export const modelosMensagem: ModeloMensagem[] = [
  {
    id: 'mm1',
    nome: 'ja_vamos_atender',
    categoria: 'utilidade',
    idioma: 'pt_BR',
    texto: 'Olá, {nome}! Já vamos atendê-la.',
    botoes: [],
    setores: ['gestao_atendimento', 'fiscal', 'dp'],
    status: 'aprovado',
    versao: 1,
    evento: 'conversa nova sem responsável em 2 min',
  },
  {
    id: 'mm2',
    nome: 'documento_faltando',
    categoria: 'utilidade',
    idioma: 'pt_BR',
    texto: 'Olá, {nome}! Para fechar {competencia} da {empresa}, ainda falta: {lista}. Pode enviar por aqui ou pelo app.',
    botoes: ['Já enviei'],
    setores: ['gestao_atendimento', 'fiscal', 'dp'],
    status: 'aprovado',
    versao: 2,
    evento: 'régua de documentos',
  },
  {
    id: 'mm3',
    nome: 'guia_emitida',
    categoria: 'utilidade',
    idioma: 'pt_BR',
    texto: '{nome}, a guia de {competencia} está pronta: {valor}, vence em {data}.',
    botoes: ['Recebi'],
    setores: ['fiscal', 'dp'],
    status: 'aprovado',
    versao: 1,
    evento: 'guia registrada',
  },
  {
    id: 'mm4',
    nome: 'boas_vindas_lead',
    categoria: 'marketing',
    idioma: 'pt_BR',
    texto: 'Olá! Aqui é o atendimento do {escritorio}. Você já é cliente?',
    botoes: ['Sou cliente', 'Quero conhecer os serviços', 'Outro assunto'],
    setores: ['gestao_atendimento'],
    status: 'aprovado',
    versao: 1,
    evento: 'número desconhecido',
  },
  {
    id: 'mm5',
    nome: 'prazo_pgdas_novembro',
    categoria: 'utilidade',
    idioma: 'pt_BR',
    texto: 'Olá {nome}, o PGDAS-D de {competencia} vence {data}. Se faltar algo, a gente avisa por aqui.',
    botoes: [],
    setores: ['fiscal'],
    status: 'aprovado',
    versao: 1,
  },
  {
    id: 'mm6',
    nome: 'reforma_2027',
    categoria: 'marketing',
    idioma: 'pt_BR',
    texto: '{nome}, preparamos um resumo do que muda para a {empresa} com a Reforma em 2027. Quer receber?',
    botoes: ['Quero receber'],
    setores: ['gestao_atendimento'],
    status: 'em aprovação',
    versao: 1,
  },
  {
    id: 'mm7',
    nome: 'satisfacao',
    categoria: 'utilidade',
    idioma: 'pt_BR',
    texto: '{nome}, como foi o atendimento do {setor}? De 1 a 5:',
    botoes: ['1', '2', '3', '4', '5'],
    setores: ['gestao_atendimento', 'fiscal', 'dp'],
    status: 'rejeitado',
    motivo: 'Mais de 3 botões de resposta rápida. Use uma lista ou reduza para 3.',
    versao: 1,
    evento: 'conversa resolvida',
  },
]

export const diasSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const
export type DiaSemana = (typeof diasSemana)[number]

export interface HorarioSetor {
  setor: SetorIntegrante
  dias: DiaSemana[]
  inicio: string
  fim: string
  intervalo?: [string, string]
  /** Plantão: quem recebe as urgentes fora do horário. */
  plantao?: string
}

export const horarios: HorarioSetor[] = [
  { setor: 'gestao_atendimento', dias: ['seg', 'ter', 'qua', 'qui', 'sex'], inicio: '08:00', fim: '18:00', intervalo: ['12:00', '13:00'] },
  { setor: 'fiscal', dias: ['seg', 'ter', 'qua', 'qui', 'sex'], inicio: '08:00', fim: '18:00', intervalo: ['12:00', '13:00'], plantao: 'Fernanda Lima' },
  { setor: 'dp', dias: ['seg', 'ter', 'qua', 'qui', 'sex'], inicio: '08:00', fim: '17:00', intervalo: ['12:00', '13:00'] },
  { setor: 'contabil', dias: ['seg', 'ter', 'qua', 'qui', 'sex'], inicio: '09:00', fim: '18:00' },
]

export const feriados = [
  { data: '20/11', nome: 'Consciência Negra' },
  { data: '24/12', nome: 'Véspera de Natal (meio período)' },
  { data: '25/12', nome: 'Natal' },
]

export interface RegraSla {
  id: string
  onde: string
  /** Primeira resposta humana, em minutos úteis. */
  respostaMin: number
  /** Resolução, em dias úteis; nulo = não se aplica (lead vira etapa do funil). */
  resolucaoDias: number | null
  tipo: 'setor' | 'etiqueta' | 'lead'
}

export const regrasSla: RegraSla[] = [
  { id: 's1', onde: 'Padrão (Fiscal, DP, Contábil, Notas, Societário, Atendimento)', respostaMin: 60, resolucaoDias: 2, tipo: 'setor' },
  { id: 's2', onde: 'Consultoria (dúvida técnica)', respostaMin: 240, resolucaoDias: 5, tipo: 'setor' },
  { id: 's3', onde: 'Lead', respostaMin: 15, resolucaoDias: null, tipo: 'lead' },
  { id: 's4', onde: 'Etiqueta #urgente', respostaMin: 30, resolucaoDias: 1, tipo: 'etiqueta' },
]

export const coresEtiqueta = ['#d9534f', '#e8a33d', '#4f9d69', '#3d7fe8', '#8a5cf6', '#e86a8a', '#696663'] as const

export interface EtiquetaCrm {
  id: string
  nome: string
  cor: string
  tipo: 'assunto' | 'tipo de atendimento'
  /** Atividade do timesheet, para etiqueta de tipo (04, 9.1). */
  atividade?: string
  setor?: SetorIntegrante
}

export const atividadesAtendimento = [
  { id: 'GES-025', rotulo: 'GES-025 · atendimento operacional' },
  { id: 'GES-027', rotulo: 'GES-027 · e-mail' },
  { id: 'CON-001', rotulo: 'CON-001 · dúvida técnica' },
  { id: 'GES-042', rotulo: 'GES-042 · comercial' },
  { id: 'GES-033', rotulo: 'GES-033 · ligação' },
  { id: 'GES-026', rotulo: 'GES-026 · documento' },
]

export const etiquetasCrm: EtiquetaCrm[] = [
  { id: 'e1', nome: 'guia', cor: '#3d7fe8', tipo: 'assunto', setor: 'fiscal' },
  { id: 'e2', nome: 'extrato', cor: '#4f9d69', tipo: 'assunto', setor: 'contabil' },
  { id: 'e3', nome: 'admissão', cor: '#8a5cf6', tipo: 'assunto', setor: 'dp' },
  { id: 'e4', nome: 'intimação', cor: '#e8a33d', tipo: 'assunto', setor: 'fiscal' },
  { id: 'e5', nome: 'urgente', cor: '#d9534f', tipo: 'assunto' },
  { id: 'e6', nome: 'operacional', cor: '#696663', tipo: 'tipo de atendimento', atividade: 'GES-025' },
  { id: 'e7', nome: 'dúvida técnica', cor: '#696663', tipo: 'tipo de atendimento', atividade: 'CON-001' },
  { id: 'e8', nome: 'comercial', cor: '#e86a8a', tipo: 'tipo de atendimento', atividade: 'GES-042' },
]

/** Mensagens automáticas (04, 4.5): textos do tema por momento. */
export interface MensagemAutomatica {
  id: string
  momento: string
  quando: string
  texto: string
  ligada: boolean
  modelo: string
}

export const mensagensAutomaticas: MensagemAutomatica[] = [
  { id: 'ma1', momento: 'Espera', quando: 'conversa nova, ninguém assumiu em {espera} min', texto: 'Olá, {nome}! Já vamos atendê-la.', ligada: true, modelo: 'ja_vamos_atender' },
  {
    id: 'ma2',
    momento: 'Fora do horário',
    quando: 'mensagem fora do horário do setor',
    texto: 'Nosso horário é {horario}. O que for de status eu resolvo agora; o resto fica para o primeiro horário.',
    ligada: true,
    modelo: 'fora_de_horario',
  },
  { id: 'ma3', momento: 'Feriado', quando: 'dia do calendário de feriados', texto: 'Hoje é feriado. Voltamos em {retorno}; o que for de status eu resolvo agora.', ligada: true, modelo: 'feriado' },
  { id: 'ma4', momento: 'Transferência', quando: 'conversa transferida a outro setor', texto: 'Seu assunto passou ao {setor}. A partir de agora, eles falam com você por aqui.', ligada: true, modelo: 'transferencia' },
  { id: 'ma5', momento: 'Pesquisa de satisfação', quando: 'conversa resolvida (uma por pessoa a cada 30 dias)', texto: '{nome}, como foi o atendimento? De 1 a 5.', ligada: false, modelo: 'satisfacao' },
]
