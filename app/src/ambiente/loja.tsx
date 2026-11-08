import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { conversasCrm, type ConversaCrm, type ItemConversa, type StatusConversa } from '@/dados/crm'
import { documentosBase, type Documento } from '@/dados/arquivos'
import { emissorDe, type NotaEmitida } from '@/dados/servicos-extras'
import * as exemplo from '@/dados/exemplo'
import type { Cartao, Mensagem, Tarefa } from '@/dados/tipos'
import { fichas, type FichaCliente } from './clientes'
import { type ContaBpo, lotesBpo } from '@/dados/bpo'
import { duracaoEscrita } from '@/lib/escrita'
import { fluxos as catalogoFluxos, nomeDoSetor, rotinas, type FluxoSimulado, type PedidoAssistente } from '@/dados/simulacao'
import type { SetorIntegrante } from '@/theme/tipos'

/**
 * Loja do escritório de demonstração: o que as ações mudam e que outros
 * módulos precisam enxergar (a mensagem enviada aparece na conversa do CRM,
 * o documento preparado aparece no chat do integrante, a tarefa concluída sai
 * da fila do Painel, o aviso chega no sino de quem deve receber).
 */

export type IdModulo = 'inicio' | 'painel' | 'clientes' | 'crm' | 'timesheet' | 'financeiro' | 'arquivos' | 'bpo' | 'config'
/** Cenário da demonstração (10, 2): contabilidade com o BPO como módulo, ou escritório só de BPO. */
export type Cenario = 'contabil_bpo' | 'bpo_puro'

/** Para onde um link leva: módulo, aba e o item exato. */
export interface Destino {
  modulo: IdModulo
  aba?: string
  conversa?: string
  integrante?: string
  /** Arquivos: pasta a abrir (cliente + caminho). */
  pasta?: { clienteId?: string; caminho: string[] }
  /** Seleciona o cliente no topo (ou `null` para a carteira). */
  cliente?: string | null
  fatura?: string
  /** Abre a ficha da tarefa por cima de onde estiver. */
  tarefa?: string
}

/** Quem a notificação traz: um integrante (orb no estado dele) ou um contato do cliente (foto, canal). */
export type QuemToast =
  | { tipo: 'integrante'; setor: SetorIntegrante; estado?: 'trabalhando' | 'concluido' | 'precisa_de_voce' }
  | { tipo: 'contato'; nome: string; cliente?: string; canal: 'whatsapp' | 'email' | 'app' }

export interface Toast {
  id: string
  texto: string
  destino?: Destino
  rotuloDestino?: string
  /** Sem `quem`, é uma confirmação do sistema (ícone, sem pessoa). */
  quem?: QuemToast
  /** Hora em que chegou (a notificação mostra "agora" e depois a hora). */
  em?: number
}

export interface AvisoSistema {
  id: string
  /** Ids de usuário; vazio = todos. */
  para: string[]
  titulo: string
  detalhe?: string
  quando: string
  setor?: SetorIntegrante
  tipo: 'cartao' | 'conversa' | 'prazo' | 'sistema' | 'cliente'
  lidoPor: string[]
  destino?: Destino
}

export interface Evento {
  id: string
  quando: string
  ator: string
  texto: string
}

interface Estado {
  toasts: Toast[]
  avisos: AvisoSistema[]
  eventos: Evento[]
  crmExtras: Record<string, ItemConversa[]>
  crmStatus: Record<string, StatusConversa>
  crmNovas: ConversaCrm[]
  /** Conversa inteira regravada pela tela do CRM (assumir, responder, status). */
  crmOverride: Record<string, ConversaCrm>
  tarefasPatch: Record<string, Partial<Tarefa>>
  tarefasNovas: Tarefa[]
  timeExtras: Record<string, Mensagem[]>
  /** Decisões tomadas nos cartões de aprovação (sobrevivem à troca de tela). */
  decisoes: Record<string, string>
  /** NFS-e emitidas pelo app do cliente (serviço NFE-201), por cliente. */
  notasEmitidas: NotaEmitida[]
  /** Documentos novos (app, conversas, integrantes, equipe) e ajustes nos existentes (Fundações 4.11). */
  documentosNovos: Documento[]
  documentosPatch: Record<string, Partial<Documento>>
  /** Fichas de cliente editadas (contatos por assunto, responsáveis). */
  fichasEditadas: Record<string, FichaCliente>
  /** Módulo BPO ligado na assinatura (Configurações › Assinatura). */
  bpoModulo: boolean
  cenario: Cenario
  /** Timesheet › Configurar: custo-hora por pacote (extra opcional, desligado por padrão). */
  custoPorPacote: boolean
  /** Estado das telas que precisa sobreviver à troca de aba (ver usePersistente). */
  memoria: Record<string, unknown>
  /** Trabalho simulado dos integrantes (ver src/dados/simulacao.ts). */
  trabalhos: Trabalho[]
  /** Quem está digitando em cada conversa do CRM (o cliente antes de responder). */
  digitando: Record<string, string>
  /** O que o time escreve no chat do Assistente enquanto faz um pedido (por id da conversa). */
  assistente: Record<string, Mensagem[]>
  /** Alçadas do BPO propostas pelo escritório, à espera do aceite do cliente no app (10, 3.7). */
  bpoAlcadaProposta: Record<string, PropostaAlcada>
  /** Alçadas aceitas pelo cliente (valem no lugar das do cadastro). */
  bpoAlcadas: Record<string, { faixa1: number; faixa2: number; janela: string; aceitoPor: string; alteradaPor: string }>
  /** Decisões nos lotes de pagamento do BPO (cartão de aprovação no app do cliente). */
  bpoLotes: Record<string, DecisaoLote>
  bpoContas: Record<string, Partial<ContaBpo>>
}

export interface PropostaAlcada {
  faixa1: number
  faixa2: number
  janela: string
  pessoas: Record<string, number>
  /** Quem propôs: não confere nem aprova pagamento nesta empresa. */
  por: string
  quando: string
}

/** Um fluxo simulado em andamento ou concluído, com o momento em que começou (o progresso sai do relógio). */
export interface Trabalho extends FluxoSimulado {
  uid: string
  inicioEm: number
  situacao: 'rodando' | 'concluido'
  tarefaId?: string
  /** Conversa do Assistente que pediu: o trabalho aparece lá, com retorno e passagens. */
  origem?: string
  /** Rotina do integrante (ninguém pediu): avisa no sino, sem toast. */
  silencioso?: boolean
  fimEm?: number
}

/** O que a pessoa está olhando agora: o aviso de algo que ela já vê nasce lido e sem toast. */
export interface Vista {
  modulo?: string
  aba?: string
  integrante?: string
  conversa?: string
  usuario?: string
}
export const duracaoTrabalho = (t: Trabalho) => t.etapas.length * t.seg * 1000

/** Aprovação humana registrada (10, B3): quem, quando e o que aprovou. Pagar nunca é automático. */
export interface DecisaoLote {
  situacao: 'aguardando' | 'parcial' | 'aprovado' | 'recusado' | 'liberado'
  aprovacoes: { nome: string; quando: string }[]
  removidos: string[]
  motivo?: string
}

type Acao =
  | { t: 'toast'; toast: Toast }
  | { t: 'fecharToast'; id: string }
  | { t: 'avisar'; aviso: AvisoSistema }
  | { t: 'ler'; id: string; usuario: string }
  | { t: 'lerTodos'; usuario: string }
  | { t: 'evento'; evento: Evento }
  | { t: 'crmItem'; conversa: string; item: ItemConversa }
  | { t: 'crmStatus'; conversa: string; status: StatusConversa }
  | { t: 'crmNova'; conversa: ConversaCrm }
  | { t: 'crmSalvar'; conversa: ConversaCrm }
  | { t: 'tarefa'; id: string; patch: Partial<Tarefa> }
  | { t: 'tarefaNova'; tarefa: Tarefa }
  | { t: 'timeMsg'; integrante: string; msg: Mensagem }
  | { t: 'decidir'; cartao: string; decisao: string }
  | { t: 'ficha'; ficha: FichaCliente }
  | { t: 'nota'; nota: NotaEmitida }
  | { t: 'cancelarNota'; clienteId: string; numero: number }
  | { t: 'documento'; documento: Documento }
  | { t: 'documentoPatch'; id: string; patch: Partial<Documento> }
  | { t: 'bpoModulo'; ligado: boolean }
  | { t: 'cenario'; cenario: Cenario }
  | { t: 'custoPorPacote'; ligado: boolean }
  | { t: 'memoria'; chave: string; inicial: unknown; valor: unknown }
  | { t: 'trabalho'; trabalho: Trabalho }
  | { t: 'crmItemPatch'; conversa: string; id: string; patch: Record<string, unknown> }
  | { t: 'digitando'; conversa: string; quem: string | null }
  | { t: 'trabalhoFim'; uid: string }
  | { t: 'timeMsgPatch'; integrante: string; id: string; patch: Partial<Mensagem> }
  | { t: 'assistMsg'; conversa: string; msg: Mensagem }
  | { t: 'assistMsgPatch'; conversa: string; id: string; patch: Partial<Mensagem> }
  | { t: 'alcadaProposta'; clienteId: string; proposta: PropostaAlcada | null }
  | { t: 'alcadaAceita'; clienteId: string; alcadas: { faixa1: number; faixa2: number; janela: string; aceitoPor: string; alteradaPor: string } }
  | { t: 'bpoLote'; id: string; decisao: DecisaoLote }
  | { t: 'bpoConta'; id: string; patch: Partial<ContaBpo> }
  | { t: 'reiniciar' }

const hora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const novoId = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

function inicial(avisos: AvisoSistema[], semRotinas?: boolean): Estado {
  return {
    toasts: [],
    avisos,
    eventos: [],
    crmExtras: {},
    crmStatus: {},
    crmNovas: [],
    crmOverride: {},
    tarefasPatch: {},
    tarefasNovas: [],
    timeExtras: {},
    decisoes: {},
    fichasEditadas: {},
    notasEmitidas: [],
    documentosNovos: [],
    documentosPatch: {},
    bpoModulo: true,
    cenario: 'contabil_bpo',
    custoPorPacote: false,
    memoria: {},
    // O time já está trabalhando quando a demonstração abre (rotinas que andam e terminam).
    trabalhos: semRotinas ? [] : rotinas.map(({ feitoSeg, ...r }) => ({ ...r, uid: `rot-${r.id}`, inicioEm: Date.now() - feitoSeg * 1000, situacao: 'rodando' as const, silencioso: true })),
    digitando: {},
    assistente: {},
    bpoAlcadaProposta: {},
    bpoAlcadas: {},
    bpoLotes: {},
    bpoContas: {},
  }
}

function reduzir(s: Estado, a: Acao): Estado {
  switch (a.t) {
    case 'toast':
      return { ...s, toasts: [...s.toasts.slice(-2), a.toast] }
    case 'fecharToast':
      return { ...s, toasts: s.toasts.filter((x) => x.id !== a.id) }
    case 'avisar':
      return { ...s, avisos: [a.aviso, ...s.avisos] }
    case 'ler':
      return { ...s, avisos: s.avisos.map((x) => (x.id === a.id && !x.lidoPor.includes(a.usuario) ? { ...x, lidoPor: [...x.lidoPor, a.usuario] } : x)) }
    case 'lerTodos':
      return { ...s, avisos: s.avisos.map((x) => (x.lidoPor.includes(a.usuario) ? x : { ...x, lidoPor: [...x.lidoPor, a.usuario] })) }
    case 'evento':
      return { ...s, eventos: [a.evento, ...s.eventos] }
    case 'crmItem':
      return { ...s, crmExtras: { ...s.crmExtras, [a.conversa]: [...(s.crmExtras[a.conversa] ?? []), a.item] } }
    case 'crmStatus':
      return { ...s, crmStatus: { ...s.crmStatus, [a.conversa]: a.status } }
    case 'crmSalvar': {
      const { [a.conversa.id]: _fora, ...extras } = s.crmExtras
      void _fora
      return { ...s, crmOverride: { ...s.crmOverride, [a.conversa.id]: a.conversa }, crmExtras: extras, crmStatus: { ...s.crmStatus, [a.conversa.id]: a.conversa.status } }
    }
    case 'crmNova':
      return { ...s, crmNovas: [a.conversa, ...s.crmNovas] }
    case 'tarefa':
      return { ...s, tarefasPatch: { ...s.tarefasPatch, [a.id]: { ...s.tarefasPatch[a.id], ...a.patch } } }
    case 'tarefaNova':
      return { ...s, tarefasNovas: [a.tarefa, ...s.tarefasNovas] }
    case 'timeMsg':
      return { ...s, timeExtras: { ...s.timeExtras, [a.integrante]: [...(s.timeExtras[a.integrante] ?? []), a.msg] } }
    case 'ficha':
      return { ...s, fichasEditadas: { ...s.fichasEditadas, [a.ficha.id]: a.ficha } }
    case 'decidir':
      return { ...s, decisoes: { ...s.decisoes, [a.cartao]: a.decisao } }
    case 'nota':
      return { ...s, notasEmitidas: [a.nota, ...s.notasEmitidas] }
    case 'cancelarNota':
      return {
        ...s,
        notasEmitidas: s.notasEmitidas.some((n) => n.clienteId === a.clienteId && n.numero === a.numero)
          ? s.notasEmitidas.map((n) => (n.clienteId === a.clienteId && n.numero === a.numero ? { ...n, situacao: 'cancelada' } : n))
          : [{ ...(emissorDe(a.clienteId).notas.find((n) => n.numero === a.numero) as NotaEmitida), clienteId: a.clienteId, situacao: 'cancelada' }, ...s.notasEmitidas],
      }
    case 'documento':
      return { ...s, documentosNovos: [a.documento, ...s.documentosNovos] }
    case 'documentoPatch':
      return { ...s, documentosPatch: { ...s.documentosPatch, [a.id]: { ...s.documentosPatch[a.id], ...a.patch } } }
    case 'bpoModulo':
      return { ...s, bpoModulo: a.ligado }
    case 'cenario':
      return { ...s, cenario: a.cenario }
    case 'custoPorPacote':
      return { ...s, custoPorPacote: a.ligado }
    case 'trabalho':
      return { ...s, trabalhos: [...s.trabalhos, a.trabalho] }
    case 'crmItemPatch':
      return { ...s, crmExtras: { ...s.crmExtras, [a.conversa]: (s.crmExtras[a.conversa] ?? []).map((i) => (i.tipo !== 'dia' && 'id' in i && i.id === a.id ? ({ ...i, ...a.patch } as ItemConversa) : i)) } }
    case 'digitando': {
      const d = { ...s.digitando }
      if (a.quem) d[a.conversa] = a.quem
      else delete d[a.conversa]
      return { ...s, digitando: d }
    }
    case 'trabalhoFim':
      return { ...s, trabalhos: s.trabalhos.map((t) => (t.uid === a.uid ? { ...t, situacao: 'concluido', fimEm: Date.now() } : t)) }
    case 'assistMsg':
      return { ...s, assistente: { ...s.assistente, [a.conversa]: [...(s.assistente[a.conversa] ?? []), a.msg] } }
    case 'assistMsgPatch':
      return { ...s, assistente: { ...s.assistente, [a.conversa]: (s.assistente[a.conversa] ?? []).map((m) => (m.id === a.id ? { ...m, ...a.patch } : m)) } }
    case 'timeMsgPatch':
      return { ...s, timeExtras: { ...s.timeExtras, [a.integrante]: (s.timeExtras[a.integrante] ?? []).map((m) => (m.id === a.id ? { ...m, ...a.patch } : m)) } }
    case 'memoria': {
      const antes = a.chave in s.memoria ? s.memoria[a.chave] : a.inicial
      const depois = typeof a.valor === 'function' ? (a.valor as (x: unknown) => unknown)(antes) : a.valor
      return { ...s, memoria: { ...s.memoria, [a.chave]: depois } }
    }
    case 'alcadaProposta': {
      const resto = { ...s.bpoAlcadaProposta }
      if (a.proposta) resto[a.clienteId] = a.proposta
      else delete resto[a.clienteId]
      return { ...s, bpoAlcadaProposta: resto }
    }
    case 'alcadaAceita':
      return { ...s, bpoAlcadas: { ...s.bpoAlcadas, [a.clienteId]: a.alcadas } }
    case 'bpoLote':
      return { ...s, bpoLotes: { ...s.bpoLotes, [a.id]: a.decisao } }
    case 'bpoConta':
      return { ...s, bpoContas: { ...s.bpoContas, [a.id]: { ...s.bpoContas[a.id], ...a.patch } } }
    case 'reiniciar':
      return inicial(avisosIniciais)
  }
}

interface Loja {
  estado: Estado
  /** Conversas do CRM com o que as ações acrescentaram. */
  conversas: ConversaCrm[]
  /** Tarefas com os estados mudados pelas ações. */
  tarefas: Tarefa[]
  /** Conversas de cada integrante no Time, com as mensagens novas. */
  conversasTime: Record<string, Mensagem[]>
  toast: (texto: string, destino?: Destino, rotuloDestino?: string, quem?: QuemToast) => void
  fecharToast: (id: string) => void
  avisar: (a: Omit<AvisoSistema, 'id' | 'quando' | 'lidoPor'>) => void
  ler: (id: string, usuario: string) => void
  lerTodos: (usuario: string) => void
  registrar: (ator: string, texto: string) => void
  mensagemCrm: (conversa: string, item: Omit<Extract<ItemConversa, { tipo: 'mensagem' }>, 'id' | 'hora'> | Omit<Extract<ItemConversa, { tipo: 'nota' }>, 'id' | 'hora'>) => void
  statusConversa: (conversa: string, status: StatusConversa) => void
  novaConversa: (c: ConversaCrm) => void
  salvarConversa: (c: ConversaCrm) => void
  atualizarTarefa: (id: string, patch: Partial<Tarefa>) => void
  criarTarefa: (t: Omit<Tarefa, 'id'>) => string
  mensagemTime: (integrante: string, msg: Omit<Mensagem, 'id' | 'hora'>) => void
  decidir: (cartao: string, decisao: string) => void
  fichaDe: (clienteId?: string) => FichaCliente | undefined
  salvarFicha: (f: FichaCliente) => void
  emitirNota: (n: NotaEmitida) => void
  cancelarNota: (clienteId: string, numero: number) => void
  /** Notas do cliente: as do cadastro mais as emitidas e canceladas pelo app. */
  notasDe: (clienteId: string) => NotaEmitida[]
  /** Todos os documentos (índice + novos, com os ajustes). */
  documentos: Documento[]
  adicionarDocumento: (d: Omit<Documento, 'id' | 'hash' | 'versao'> & Partial<Pick<Documento, 'versao'>>) => Documento
  ajustarDocumento: (id: string, patch: Partial<Documento>) => void
  /** Liga ou desliga o módulo BPO da assinatura. */
  ligarBpo: (ligado: boolean) => void
  definirCenario: (c: Cenario) => void
  ligarCustoPorPacote: (v: boolean) => void
  /** Grava um valor de tela na sessão (usePersistente). */
  lembrar: (chave: string, inicial: unknown, valor: unknown) => void
  /** Põe um integrante para "fazer" um fluxo simulado (etapas, aviso ao terminar, passagens). */
  iniciarTrabalho: (f: FluxoSimulado, opcoes?: { tarefaId?: string; origem?: string; final?: PedidoAssistente['final'] }) => void
  /** Informa o que a pessoa está olhando (avisos do que ela já vê não viram toast). */
  definirVista: (v: Vista) => void
  /** Trabalho em andamento de um integrante (ou de uma tarefa). */
  trabalhoDe: (filtro: { integrante?: string; tarefaId?: string }) => Trabalho | undefined
  /** Grava ou ajusta uma mensagem no chat do integrante (com id próprio, para a resposta "pensando" virar texto). */
  mensagemTimeComId: (integrante: string, msg: Mensagem) => void
  ajustarMensagemTime: (integrante: string, id: string, patch: Partial<Mensagem>) => void
  /** Mostra (ou tira) "fulano está digitando" numa conversa do CRM. */
  digitar: (conversa: string, quem: string | null) => void
  proporAlcada: (clienteId: string, p: Omit<PropostaAlcada, 'quando'> | null) => void
  aceitarAlcada: (clienteId: string, quem: string) => void
  /** Registra a aprovação (ou recusa) de um lote; o lote só fica aprovado com o número de aprovadores da alçada. */
  decidirLote: (id: string, acao: { tipo: 'aprovar'; nome: string; removidos?: string[] } | { tipo: 'recusar'; nome: string; motivo: string } | { tipo: 'liberar'; nome: string }) => void
  ajustarContaBpo: (id: string, patch: Partial<ContaBpo>) => void
  reiniciar: () => void
}

const Ctx = createContext<Loja | null>(null)

/** Avisos com que o escritório amanhece (cada um para quem deve receber). */
export const avisosIniciais: AvisoSistema[] = [
  {
    id: 'av1',
    para: ['u1'],
    tipo: 'cartao',
    setor: 'fiscal',
    titulo: 'Fiscal: PGDAS-D de 14 clientes pronto para transmitir',
    detalhe: 'R$ 38.402,15 em DAS · a aprovação expira em 2 dias',
    quando: '09:32',
    lidoPor: [],
    destino: { modulo: 'inicio', aba: 'time', integrante: 'i-fiscal' },
  },
  {
    id: 'av2',
    para: ['u1', 'u7'],
    tipo: 'conversa',
    setor: 'fiscal',
    titulo: 'Rita Campos (Metalúrgica Andrade) perguntou do ISS',
    detalhe: 'WhatsApp · primeira resposta vence em 18 min',
    quando: '09:30',
    lidoPor: [],
    destino: { modulo: 'crm', aba: 'conversas', conversa: 'cv1' },
  },
  {
    id: 'av3',
    para: ['u1', 'u3'],
    tipo: 'cliente',
    setor: 'dp',
    titulo: 'Padaria Pão Quente contratou dois funcionários',
    detalhe: 'áudio de João Batista · o integrante DP já abriu a admissão',
    quando: '08:55',
    lidoPor: [],
    destino: { modulo: 'crm', aba: 'conversas', conversa: 'cv2' },
  },
  {
    id: 'av4',
    para: ['u1', 'u4'],
    tipo: 'prazo',
    setor: 'societario',
    titulo: 'Exigência da JUCESP vence em 14 dias',
    detalhe: 'Metalúrgica Andrade · alteração contratual',
    quando: 'ontem',
    lidoPor: ['u1'],
    destino: { modulo: 'painel', aba: 'societario', tarefa: 't18' },
  },
  {
    id: 'av5',
    para: ['u2'],
    tipo: 'conversa',
    setor: 'contabil',
    titulo: 'Dra. Lívia (Clínica Sorriso) aguarda o balanço de abertura',
    detalhe: 'conversa parada em "aguardando interno" desde ontem',
    quando: 'ontem',
    lidoPor: [],
    destino: { modulo: 'crm', aba: 'conversas', conversa: 'cv7' },
  },
  { id: 'av6', para: ['u1', 'u2'], tipo: 'sistema', titulo: '6 itens do Timesheet esperam confirmação', detalhe: 'leva uns 2 minutos', quando: '08:00', lidoPor: [], destino: { modulo: 'timesheet', aba: 'confirmacoes' } },
  {
    id: 'av7',
    para: ['u1'],
    tipo: 'sistema',
    titulo: 'Loja Bela Vista: fatura de novembro venceu há 2 dias',
    detalhe: 'a régua manda o aviso cordial amanhã',
    quando: '07:00',
    lidoPor: [],
    destino: { modulo: 'financeiro', aba: 'cobranca', fatura: 'f3' },
  },
  {
    id: 'av8',
    para: ['u3'],
    tipo: 'cartao',
    setor: 'dp',
    titulo: 'DP: contrato de experiência de Rafael Moura pronto',
    detalhe: 'Metalúrgica Andrade · revisar e mandar para assinatura',
    quando: '09:10',
    lidoPor: [],
    destino: { modulo: 'inicio', aba: 'time', integrante: 'i-dp' },
  },
  {
    id: 'av9',
    para: ['u7'],
    tipo: 'prazo',
    setor: 'notas',
    titulo: 'Certificado da Clínica Sorriso vence em 3 dias',
    detalhe: 'sem ele, a captura de notas para',
    quando: '08:00',
    lidoPor: [],
    destino: { modulo: 'painel', aba: 'notas', tarefa: 't8' },
  },
]

/** `semRotinas`: sem o trabalho de fundo do time (a demonstração do site mostra só o pedido da pessoa). */
export function LojaProvider({ children, semRotinas }: { children: ReactNode; semRotinas?: boolean }) {
  const [estado, despachar] = useReducer(reduzir, semRotinas, (sem?: boolean) => inicial(avisosIniciais, sem))

  const toast = useCallback((texto: string, destino?: Destino, rotuloDestino?: string, quem?: QuemToast) => {
    const id = novoId('t')
    despachar({ t: 'toast', toast: { id, texto, destino, rotuloDestino, quem, em: Date.now() } })
    // Quem traz pessoa (integrante, cliente) fica um pouco mais: é para ler.
    setTimeout(() => despachar({ t: 'fecharToast', id }), quem ? 8000 : 6000)
  }, [])

  /* ---------- Motor do trabalho simulado ---------- */
  // Nada é instantâneo: o integrante pensa antes de falar, a passagem leva um tempo, a mensagem ao cliente
  // passa por enviada, entregue e lida, e o cliente aparece digitando antes de responder.
  const PENSA = 1500
  const depois = (ms: number, f: () => void) => window.setTimeout(f, ms)
  const tarefasRef = useRef<Tarefa[]>([])
  const vistaRef = useRef<Vista>({})
  const definirVista = useCallback((v: Vista) => {
    vistaRef.current = v
  }, [])
  /** Fechamento de cada pedido do Assistente (o que ele diz quando o último integrante devolve). */
  const finaisRef = useRef<Record<string, PedidoAssistente['final']>>({})
  const vendoIntegrante = (id: string) => vistaRef.current.modulo === 'inicio' && vistaRef.current.aba === 'time' && vistaRef.current.integrante === id
  const vendoAssistente = () => vistaRef.current.modulo === 'inicio' && vistaRef.current.aba === 'assistente'
  const vendoConversa = (c: string) => vistaRef.current.modulo === 'crm' && vistaRef.current.conversa === c
  /** Sino e toast. Quem já está vendo a coisa não recebe toast, e o aviso nasce lido para essa pessoa. */
  const notificar = (aviso: Omit<AvisoSistema, 'id' | 'quando' | 'lidoPor'>, olhando: boolean, toastTexto?: string, rotulo?: string, quem?: QuemToast) => {
    const u = vistaRef.current.usuario
    despachar({ t: 'avisar', aviso: { ...aviso, id: novoId('av'), quando: hora(), lidoPor: olhando && u ? [u] : [] } })
    if (!olhando && toastTexto) toast(toastTexto, aviso.destino, rotulo, quem)
  }
  const falar = useCallback((integrante: string, setor: SetorIntegrante, texto: string, cartoes?: Cartao[], ms = PENSA, aoTerminar?: () => void) => {
    const id = novoId('mt')
    despachar({ t: 'timeMsg', integrante, msg: { id, autor: { tipo: 'integrante', setor }, hora: hora(), pendente: true } })
    depois(ms, () => {
      despachar({ t: 'timeMsgPatch', integrante, id, patch: { pendente: false, escrever: true, escreverDesde: Date.now(), hora: hora(), texto, cartoes } })
      // Os efeitos (aviso, CRM, passagem) só vêm quando ele termina de escrever.
      if (aoTerminar) depois(duracaoEscrita(texto) + 250, aoTerminar)
    })
  }, [])
  /** Mensagem no chat do Assistente (de um integrante, ou do próprio Assistente). */
  const noAssistente = (conversa: string, msg: Omit<Mensagem, 'id' | 'hora' | 'em'>) => {
    const id = novoId('ma')
    despachar({ t: 'assistMsg', conversa, msg: { ...msg, id, hora: hora(), em: Date.now() } })
    return id
  }
  /** O Assistente pensa, escreve e só depois mostra os cartões; `aoTerminar` vem quando ele termina de escrever. */
  const assistenteFala = (conversa: string, texto: string, cartoes?: (em: number) => Cartao[], aoTerminar?: () => void) => {
    const id = noAssistente(conversa, { autor: { tipo: 'integrante', setor: 'geral' }, pendente: true })
    depois(PENSA, () => {
      const cartoesProntos = cartoes?.(Date.now() + duracaoEscrita(texto) + 200)
      despachar({ t: 'assistMsgPatch', conversa, id, patch: { pendente: false, escrever: true, escreverDesde: Date.now(), hora: hora(), texto, cartoes: cartoesProntos } })
      if (aoTerminar) depois(duracaoEscrita(texto) + 250, aoTerminar)
    })
  }
  const iniciarTrabalho = useCallback(
    (f: FluxoSimulado, opcoes?: { tarefaId?: string; origem?: string; final?: PedidoAssistente['final'] }) => {
      falar(f.integrante, f.setor, f.inicio)
      if (opcoes?.tarefaId) despachar({ t: 'tarefa', id: opcoes.tarefaId, patch: { status: 'em_andamento' } })
      if (opcoes?.origem && opcoes.final) finaisRef.current[opcoes.origem] = opcoes.final
      const uid = novoId('tr')
      // O progresso começa depois que ele respondeu (o relógio do trabalho já nasce adiantado).
      despachar({ t: 'trabalho', trabalho: { ...f, uid, inicioEm: Date.now() + PENSA + duracaoEscrita(f.inicio) + 300, situacao: 'rodando', tarefaId: opcoes?.tarefaId, origem: opcoes?.origem } })
      // Pedido do Assistente: o cartão do trabalho aparece no chat dele, anda e fica concluído ali.
      if (opcoes?.origem) noAssistente(opcoes.origem, { autor: { tipo: 'integrante', setor: f.setor }, cartoes: [{ tipo: 'trabalho', id: `c${uid}`, uid }] })
      despachar({ t: 'evento', evento: { id: novoId('e'), quando: hora(), ator: f.integrante, texto: `Começou: ${f.titulo}${f.cliente ? ` · ${f.cliente}` : ''}` } })
    },
    [falar],
  )
  /** Passagem animada: o cartão aparece no chat de quem passa e o outro começa depois de um instante. */
  const passarAdiante = (de: Trabalho, f: FluxoSimulado) => {
    despachar({
      t: 'timeMsg',
      integrante: de.integrante,
      msg: { id: novoId('mt'), autor: { tipo: 'integrante', setor: de.setor }, hora: hora(), cartoes: [{ tipo: 'encaminhamento', id: novoId('enc'), de: de.setor, para: f.setor, pedido: f.titulo, em: Date.now() }] },
    })
    depois(2000, () => iniciarTrabalho(f, { origem: de.origem }))
  }
  const passagemNoAssistente =
    (de: SetorIntegrante, f: FluxoSimulado) =>
    (em: number): Cartao[] => [{ tipo: 'encaminhamento', id: novoId('enc'), de, para: f.setor, pedido: f.titulo, em }]
  const enviarAoCliente = useCallback(
    (t: Trabalho, crm: NonNullable<Trabalho['fim']['crm']>) => {
      const id = novoId('m')
      despachar({ t: 'crmItem', conversa: crm.conversa, item: { tipo: 'mensagem', id, hora: hora(), de: 'integrante', setor: t.setor, canal: 'whatsapp', texto: crm.texto, entrega: 'enviada' } as ItemConversa })
      depois(1400, () => despachar({ t: 'crmItemPatch', conversa: crm.conversa, id, patch: { entrega: 'entregue' } }))
      depois(4200, () => despachar({ t: 'crmItemPatch', conversa: crm.conversa, id, patch: { entrega: 'lida' } }))
      const r = crm.resposta
      if (!r) return
      const começa = 4200 + r.depoisDeSeg * 1000
      depois(começa, () => despachar({ t: 'digitando', conversa: crm.conversa, quem: r.autor }))
      depois(começa + r.digitarSeg * 1000, () => {
        despachar({ t: 'digitando', conversa: crm.conversa, quem: null })
        despachar({ t: 'crmItem', conversa: crm.conversa, item: { tipo: 'mensagem', id: novoId('m'), hora: hora(), de: 'cliente', autor: r.autor, canal: 'whatsapp', texto: r.texto } as ItemConversa })
        despachar({ t: 'crmStatus', conversa: crm.conversa, status: 'em_atendimento' })
        const destino: Destino = { modulo: 'crm', aba: 'conversas', conversa: crm.conversa }
        const conversaCrm = conversasCrm.find((x) => x.id === crm.conversa)
        notificar({ para: [], tipo: 'conversa', setor: t.setor, titulo: `${r.autor} respondeu`, detalhe: r.texto.slice(0, 80), destino }, vendoConversa(crm.conversa), r.texto, 'Responder', {
          tipo: 'contato',
          nome: r.autor,
          cliente: conversaCrm?.cliente ?? t.cliente,
          canal: 'whatsapp',
        })
        const prox = r.fluxo ? catalogoFluxos[r.fluxo] : undefined
        if (t.origem) {
          const conv = t.origem
          if (prox) assistenteFala(conv, `${r.autor} respondeu: “${r.texto}” Passei de volta ao ${nomeDoSetor(prox.setor)}.`, passagemNoAssistente(t.setor, prox), () => passarAdiante(t, prox))
          else {
            const c = conversasCrm.find((x) => x.id === crm.conversa)
            assistenteFala(conv, `${r.autor} já respondeu: “${r.texto}”`, () => [
              { tipo: 'conversa_crm', id: novoId('cc'), conversa: crm.conversa, cliente: c?.cliente ?? t.cliente ?? '', pessoa: r.autor, canal: 'WhatsApp', status: 'aberta', ultima: r.texto },
            ])
          }
        } else if (prox) passarAdiante(t, prox)
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast],
  )
  const concluirTrabalho = useCallback(
    (t: Trabalho) => {
      const fim = t.fim
      despachar({ t: 'trabalhoFim', uid: t.uid })
      const cartoes: Cartao[] = [...(fim.cartoes ?? [])]
      let novaId: string | undefined
      if (fim.tarefaNova) {
        novaId = novoId('tk')
        cartoes.push({ tipo: 'tarefa', id: `c${novaId}`, tarefa: { ...fim.tarefaNova, id: novaId } })
      }
      // Ele escreve o resultado (pensando) antes de entregar; os efeitos vêm junto com a mensagem.
      falar(t.integrante, t.setor, fim.texto, cartoes.length ? cartoes : undefined, 1800, () => {
        if (novaId && fim.tarefaNova) despachar({ t: 'tarefaNova', tarefa: { ...fim.tarefaNova, id: novaId } })
        if (t.tarefaId && fim.tarefaStatus) despachar({ t: 'tarefa', id: t.tarefaId, patch: { status: fim.tarefaStatus, atrasada: fim.tarefaStatus === 'concluida' ? false : undefined } })
        if (fim.tarefaPorCodigo) {
          const alvo = tarefasRef.current.find((x) => x.codigo === fim.tarefaPorCodigo!.codigo && (!t.cliente || x.cliente === t.cliente))
          if (alvo) despachar({ t: 'tarefa', id: alvo.id, patch: { status: fim.tarefaPorCodigo.status, atrasada: false } })
        }
        const destino: Destino = { modulo: 'inicio', aba: 'time', integrante: t.integrante }
        // Quem está no chat do integrante (ou acompanhando o pedido no Assistente) já vê: sem toast.
        const olhando = vendoIntegrante(t.integrante) || (!!t.origem && vendoAssistente())
        const pedeVoce = cartoes.some((c) => c.tipo === 'aprovacao')
        if (fim.aviso)
          notificar({ para: [], tipo: 'sistema', setor: t.setor, titulo: fim.aviso, detalhe: t.cliente, destino }, olhando, t.silencioso ? undefined : fim.aviso, pedeVoce ? 'Decidir' : 'Ver no Time', {
            tipo: 'integrante',
            setor: t.setor,
            estado: pedeVoce ? 'precisa_de_voce' : 'concluido',
          })
        despachar({ t: 'evento', evento: { id: novoId('e'), quando: hora(), ator: t.integrante, texto: `Terminou: ${t.titulo}` } })
        if (fim.crm) depois(800, () => enviarAoCliente(t, fim.crm!))
        const proximos = (fim.depois ?? []).map((id) => catalogoFluxos[id]).filter(Boolean)
        if (!t.origem) {
          for (const f of proximos) depois(1200, () => passarAdiante(t, f))
          return
        }
        // Pedido do Assistente: o integrante devolve, o Assistente conta ao usuário e passa adiante ou fecha.
        const conv = t.origem
        depois(500, () => noAssistente(conv, { autor: { tipo: 'integrante', setor: t.setor }, cartoes: [{ tipo: 'retorno', id: novoId('rt'), de: t.setor, texto: fim.retorno ?? fim.texto }] }))
        if (proximos.length) {
          const f = proximos[0]
          const texto = fim.paraAssistente ?? `O ${nomeDoSetor(t.setor)} terminou: ${t.titulo.toLowerCase()}. Agora o ${nomeDoSetor(f.setor)} segue com ${f.titulo.toLowerCase()}.`
          depois(1300, () => assistenteFala(conv, texto, passagemNoAssistente(t.setor, f), () => passarAdiante(t, f)))
        } else if (fim.crm?.resposta?.fluxo) {
          depois(1300, () => assistenteFala(conv, `O ${nomeDoSetor(t.setor)} mandou a pergunta a ${fim.crm!.resposta!.autor} pelo WhatsApp. Quando a resposta chegar, o trabalho segue sozinho.`))
        } else {
          const final = finaisRef.current[conv]
          depois(1300, () => assistenteFala(conv, final?.texto ?? `Pronto: ${t.titulo}.`, () => final?.cartoes ?? fim.cartoes ?? []))
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast, falar, enviarAoCliente],
  )
  const rodando = estado.trabalhos.filter((t) => t.situacao === 'rodando')
  const chaveRodando = rodando.map((t) => t.uid).join(',')
  const rodandoRef = useRef(rodando)
  rodandoRef.current = rodando
  useEffect(() => {
    if (!chaveRodando) return
    const id = window.setInterval(() => {
      for (const t of rodandoRef.current) if (Date.now() - t.inicioEm >= duracaoTrabalho(t)) concluirTrabalho(t)
    }, 400)
    return () => window.clearInterval(id)
  }, [chaveRodando, concluirTrabalho])

  const valor = useMemo<Loja>(() => {
    const conversas = [...estado.crmNovas, ...conversasCrm].map((c0) => {
      const c = estado.crmOverride[c0.id] ?? c0
      const extras = estado.crmExtras[c.id] ?? []
      const ultima = [...extras].reverse().find((x) => x.tipo === 'mensagem') as Extract<ItemConversa, { tipo: 'mensagem' }> | undefined
      return extras.length || estado.crmStatus[c.id]
        ? { ...c, itens: [...c.itens, ...extras], status: estado.crmStatus[c.id] ?? c.status, previa: ultima?.texto ? `${ultima.autor ?? ''}${ultima.autor ? ': ' : ''}${ultima.texto}` : c.previa }
        : c
    })
    const tarefas = [...estado.tarefasNovas, ...exemplo.tarefas].map((t) => (estado.tarefasPatch[t.id] ? { ...t, ...estado.tarefasPatch[t.id] } : t))
    const conversasTime: Record<string, Mensagem[]> = { ...exemplo.conversasPorIntegrante }
    for (const [k, v] of Object.entries(estado.timeExtras)) conversasTime[k] = [...(conversasTime[k] ?? []), ...v]
    return {
      estado,
      conversas,
      tarefas,
      conversasTime,
      toast,
      fecharToast: (id) => despachar({ t: 'fecharToast', id }),
      avisar: (a) => despachar({ t: 'avisar', aviso: { ...a, id: novoId('av'), quando: hora(), lidoPor: [] } }),
      ler: (id, usuario) => despachar({ t: 'ler', id, usuario }),
      lerTodos: (usuario) => despachar({ t: 'lerTodos', usuario }),
      registrar: (ator, texto) => despachar({ t: 'evento', evento: { id: novoId('e'), quando: hora(), ator, texto } }),
      mensagemCrm: (conversa, item) => despachar({ t: 'crmItem', conversa, item: { ...item, id: novoId('m'), hora: hora() } as ItemConversa }),
      statusConversa: (conversa, status) => despachar({ t: 'crmStatus', conversa, status }),
      novaConversa: (c) => despachar({ t: 'crmNova', conversa: c }),
      salvarConversa: (c) => despachar({ t: 'crmSalvar', conversa: c }),
      atualizarTarefa: (id, patch) => despachar({ t: 'tarefa', id, patch }),
      criarTarefa: (t) => {
        const id = novoId('tk')
        despachar({ t: 'tarefaNova', tarefa: { ...t, id } })
        return id
      },
      mensagemTime: (integrante, msg) => despachar({ t: 'timeMsg', integrante, msg: { ...msg, id: novoId('mt'), hora: hora() } }),
      decidir: (cartao, decisao) => despachar({ t: 'decidir', cartao, decisao }),
      fichaDe: (id) => (id ? (estado.fichasEditadas[id] ?? fichas[id]) : undefined),
      salvarFicha: (f) => despachar({ t: 'ficha', ficha: f }),
      emitirNota: (n) => despachar({ t: 'nota', nota: n }),
      cancelarNota: (clienteId, numero) => despachar({ t: 'cancelarNota', clienteId, numero }),
      notasDe: (clienteId) => {
        const daLoja = estado.notasEmitidas.filter((n) => n.clienteId === clienteId)
        const base = emissorDe(clienteId).notas.filter((n) => !daLoja.some((x) => x.numero === n.numero))
        return [...daLoja, ...base].sort((a, b) => b.numero - a.numero)
      },
      documentos: [...estado.documentosNovos, ...documentosBase()].map((d) => (estado.documentosPatch[d.id] ? { ...d, ...estado.documentosPatch[d.id] } : d)),
      adicionarDocumento: (d) => {
        const doc: Documento = { versao: 1, ...d, id: novoId('docn'), hash: Math.random().toString(16).slice(2, 14) }
        despachar({ t: 'documento', documento: doc })
        return doc
      },
      ajustarDocumento: (id, patch) => despachar({ t: 'documentoPatch', id, patch }),
      ligarBpo: (ligado) => despachar({ t: 'bpoModulo', ligado }),
      definirCenario: (cenario) => despachar({ t: 'cenario', cenario }),
      ligarCustoPorPacote: (ligado) => despachar({ t: 'custoPorPacote', ligado }),
      lembrar: (chave, inicial, valor) => despachar({ t: 'memoria', chave, inicial, valor }),
      iniciarTrabalho: (f, opcoes) => iniciarTrabalho(f, opcoes),
      definirVista,
      trabalhoDe: ({ integrante, tarefaId }) => estado.trabalhos.find((t) => t.situacao === 'rodando' && (integrante ? t.integrante === integrante : true) && (tarefaId ? t.tarefaId === tarefaId : true)),
      mensagemTimeComId: (integrante, msg) => despachar({ t: 'timeMsg', integrante, msg }),
      ajustarMensagemTime: (integrante, id, patch) => despachar({ t: 'timeMsgPatch', integrante, id, patch }),
      digitar: (conversa, quem) => despachar({ t: 'digitando', conversa, quem }),
      proporAlcada: (clienteId, p) => despachar({ t: 'alcadaProposta', clienteId, proposta: p && { ...p, quando: hora() } }),
      aceitarAlcada: (clienteId, quem) => {
        const p = estado.bpoAlcadaProposta[clienteId]
        if (!p) return
        const f = estado.fichasEditadas[clienteId] ?? fichas[clienteId]
        if (f) despachar({ t: 'ficha', ficha: { ...f, contatos: f.contatos.map((c) => (p.pessoas[c.nome] !== undefined ? { ...c, alcadaPagamento: p.pessoas[c.nome] || undefined } : c)) } })
        despachar({ t: 'alcadaAceita', clienteId, alcadas: { faixa1: p.faixa1, faixa2: p.faixa2, janela: p.janela, aceitoPor: quem, alteradaPor: p.por } })
        despachar({ t: 'alcadaProposta', clienteId, proposta: null })
      },
      decidirLote: (id, acao) => {
        const lote = lotesBpo.find((l) => l.id === id)
        const atual: DecisaoLote = estado.bpoLotes[id] ?? { situacao: 'parcial', aprovacoes: [], removidos: [] }
        if (acao.tipo === 'recusar') return despachar({ t: 'bpoLote', id, decisao: { ...atual, situacao: 'recusado', motivo: acao.motivo, aprovacoes: [...atual.aprovacoes, { nome: acao.nome, quando: hora() }] } })
        if (acao.tipo === 'liberar') return despachar({ t: 'bpoLote', id, decisao: { ...atual, situacao: 'liberado' } })
        if (atual.aprovacoes.some((x) => x.nome === acao.nome)) return
        const aprovacoes = [...atual.aprovacoes, { nome: acao.nome, quando: hora() }]
        const removidos = acao.removidos ?? atual.removidos
        despachar({ t: 'bpoLote', id, decisao: { situacao: aprovacoes.length >= (lote?.aprovadoresNecessarios ?? 1) ? 'aprovado' : 'parcial', aprovacoes, removidos } })
      },
      ajustarContaBpo: (id, patch) => despachar({ t: 'bpoConta', id, patch }),
      reiniciar: () => despachar({ t: 'reiniciar' }),
    }
  }, [estado, toast])

  tarefasRef.current = valor.tarefas
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

/** Loja do escritório. Fora do provider (stories isoladas), devolve uma loja inerte com os dados de exemplo. */
export function useLoja(): Loja {
  const l = useContext(Ctx)
  if (l) return l
  const nada = () => {}
  return {
    estado: inicial(avisosIniciais),
    conversas: conversasCrm,
    tarefas: exemplo.tarefas,
    conversasTime: exemplo.conversasPorIntegrante,
    toast: nada,
    fecharToast: nada,
    avisar: nada,
    ler: nada,
    lerTodos: nada,
    registrar: nada,
    mensagemCrm: nada,
    statusConversa: nada,
    novaConversa: nada,
    salvarConversa: nada,
    atualizarTarefa: nada,
    criarTarefa: () => '',
    mensagemTime: nada,
    decidir: nada,
    fichaDe: (id) => (id ? fichas[id] : undefined),
    salvarFicha: nada,
    emitirNota: nada,
    cancelarNota: nada,
    notasDe: (id) => emissorDe(id).notas,
    documentos: documentosBase(),
    adicionarDocumento: (d) => ({ versao: 1, ...d, id: 'x', hash: '' }) as Documento,
    ajustarDocumento: nada,
    ligarBpo: nada,
    definirCenario: nada,
    ligarCustoPorPacote: nada,
    lembrar: nada,
    iniciarTrabalho: nada,
    definirVista: nada,
    trabalhoDe: () => undefined,
    mensagemTimeComId: nada,
    ajustarMensagemTime: nada,
    digitar: nada,
    proporAlcada: nada,
    aceitarAlcada: nada,
    decidirLote: nada,
    ajustarContaBpo: nada,
    reiniciar: nada,
  }
}

/* ---------- Navegação entre módulos ---------- */

interface Navegacao {
  irPara: (d: Destino) => void
  /** Vitrine (o site): só o Início existe; cartões e cabeçalhos escondem o que levaria para fora. */
  vitrine?: boolean | 'leitura'
}

const NavCtx = createContext<Navegacao>({ irPara: () => {} })
export const NavegacaoProvider = NavCtx.Provider
export const useNavegacao = () => useContext(NavCtx)

/** Usa a loja de fora quando existe; senão cria uma (stories da Plataforma). */
export function LojaOpcional({ children }: { children: ReactNode }) {
  const l = useContext(Ctx)
  return l ? <>{children}</> : <LojaProvider>{children}</LojaProvider>
}

/**
 * useState que sobrevive à troca de aba durante a demonstração: o valor fica
 * na loja do escritório (memória da sessão), não no componente. Sair e voltar
 * da tela, ou abrir outra que leia a mesma chave, mostra o que foi feito.
 * "Resetar o ambiente" limpa. Sem backend: dura enquanto a página estiver aberta.
 */
export function usePersistente<T>(chave: string, inicial: T | (() => T)): [T, (v: T | ((x: T) => T)) => void] {
  const l = useContext(Ctx)
  const [local, setLocal] = useState(inicial)
  const base = useRef<T | null>(null)
  if (base.current === null) base.current = typeof inicial === 'function' ? (inicial as () => T)() : inicial
  if (!l) return [local, setLocal]
  const valor = (chave in l.estado.memoria ? l.estado.memoria[chave] : base.current) as T
  return [valor, (v) => l.lembrar(chave, base.current, v)]
}
