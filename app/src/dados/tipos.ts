import type { EstadoIntegrante } from '@/lib/integrante'
import type { SetorIntegrante } from '@/theme/tipos'

/** Tipos de tela do lab. Espelham as entidades das Fundações só no que a tela usa. */

export interface Cliente {
  id: string
  /** Código interno do escritório (o Figma mostra "420 - Cliente 1"). */
  codigo: string
  nome: string
  documento: string
  regime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real' | 'MEI' | 'Pessoa física'
  situacao?: 'ativo' | 'implantacao' | 'saida'
  /** Serviços contratados (estado por serviço, 10 F5). Sem o campo: só o contábil. */
  servicos?: ('contabil' | 'bpo')[]
}

export interface Integrante {
  id: string
  setor: SetorIntegrante
  /** Tipo (Fundações, 9): padrão de setor, Consultor, Geral ou criado pelo usuário. */
  tipo?: 'geral' | 'consultor' | 'padrao_setor' | 'criado_pelo_usuario'
  /** Nome exibido quando não vem do tema (integrante criado pelo usuário). */
  nome?: string
  /** Cor do orb quando não vem do tema (integrante criado pelo usuário). */
  cor?: string
  /** Setor por extenso, para a lista ("Fiscal e Obrigações"). */
  setorRotulo: string
  /** Função em uma linha (subplano 02, 3.2). */
  funcao: string
  estado: EstadoIntegrante
  /** Resumo de uma linha do que está fazendo, para a lista. */
  resumo?: string
  /** O que está fazendo agora (fila), mostrado acima do campo do chat. */
  fazendoAgora?: string[]
  /** Itens na fila. */
  fila: number
  /** Cartões aguardando decisão do usuário. */
  pendentes: number
  /** Situação (Fundações, 9). Pausado não roda jobs nem gatilhos; o chat responde. */
  situacao?: 'ativo' | 'pausado'
  /** Ainda nos 14 dias de observação (02, 11.1): tudo que faria sozinho vira cartão. */
  emObservacao?: boolean
  /** Sugestões de pedido, para o chat vazio. */
  sugestoes?: string[]
}

export type StatusTarefa = 'a_fazer' | 'em_andamento' | 'aguardando_cliente' | 'concluida'

export interface Responsavel {
  tipo: 'pessoa' | 'integrante'
  nome: string
  setor?: SetorIntegrante
}

export interface Tarefa {
  id: string
  /** ID da atividade do catálogo (ex.: FIS-009). */
  codigo: string
  titulo: string
  cliente: string
  setor: SetorIntegrante
  /** dd/mm */
  prazo: string
  responsavel?: Responsavel
  status: StatusTarefa
  atrasada?: boolean
  diasAguardando?: number
  /** Há um cartão de aprovação pendurado na tarefa. */
  cartaoPendente?: boolean
  /** Conversa do CRM em que o assunto corre. */
  conversa?: string
  /** Nasceu de um pedido do cliente pelo app (06, 4.3). */
  origem?: 'pedido_cliente'
}

/** Aviso do integrante com os três blocos (subplano 02, 3.2; subplano 03, 4.1). */
export interface Aviso {
  id: string
  setor: SetorIntegrante
  quando: string
  fiz?: string
  decisao?: { texto: string; lote?: number; expiraEm?: string }
  informacao?: string
  urgente?: boolean
  /** Cartão do chat que registra esta decisão: decidido lá, o aviso sai da Home e do Assistente. */
  cartaoChat?: string
}

export interface ColunaTabela {
  chave: string
  rotulo: string
  alinhamento?: 'esquerda' | 'direita'
}

export type Cartao =
  | {
      tipo: 'aprovacao'
      id: string
      resumo: string
      argumentos?: { rotulo: string; valor: string }[]
      expiraEm?: string
      lote?: number
    }
  /** Passagem a outro integrante; com `de` e `em`, anima a passagem (orb de quem passa até o de quem recebe). */
  | { tipo: 'encaminhamento'; id: string; para: SetorIntegrante; pedido: string; resposta?: string; de?: SetorIntegrante; em?: number }
  | { tipo: 'tabela'; id: string; titulo: string; colunas: ColunaTabela[]; linhas: Record<string, string>[]; total?: number }
  | { tipo: 'tarefa'; id: string; tarefa: Tarefa }
  /** Aviso com os três blocos (02, 7.4 e 16), dentro do chat do integrante. */
  | { tipo: 'aviso'; id: string; aviso: Aviso }
  /** Documento ou guia (02, 9.3). */
  | { tipo: 'documento'; id: string; nome: string; especie: 'guia' | 'documento'; cliente: string; competencia: string; valor?: string; vencimento?: string; pago?: boolean }
  /** Conversa do CRM (subplano 04). */
  | { tipo: 'conversa_crm'; id: string; conversa?: string; cliente: string; pessoa: string; canal: 'WhatsApp' | 'E-mail' | 'App'; status: 'aberta' | 'aguardando' | 'resolvida'; ultima: string }
  /** Trabalho de um integrante, ao vivo (etapas e progresso) e depois concluído; `uid` aponta o trabalho na loja. */
  | { tipo: 'trabalho'; id: string; uid: string }
  /** Retorno do integrante a quem pediu (o Assistente), com o resultado em uma frase. */
  | { tipo: 'retorno'; id: string; de: SetorIntegrante; texto: string }
  /** Resposta com base legal no modelo do Consultor (07, 3.2): fundamento, cálculo, divergências, grau de segurança. */
  | { tipo: 'resposta_legal'; id: string; resposta: RespostaLegal }
  /** Passagem de trabalho entre integrantes de usuários diferentes (02, 8.4). */
  | {
      tipo: 'passagem'
      id: string
      de: { setor: SetorIntegrante; pessoa: string; dono: string }
      para: { setor: SetorIntegrante; pessoa: string; dono: string }
      assunto: string
      cliente: string
    }

/** Saída do `legal.consultar` mostrada ao usuário (07, 3.2 e 02, 9.3: cartão de citação e de cálculo). */
export interface RespostaLegal {
  /** Afirmações, cada uma ligada a um trecho (t1, t2…) ou a um cálculo. */
  afirmacoes: { texto: string; trecho?: string; calculo?: boolean; grau: 'alto' | 'médio' | 'baixo' }[]
  trechos: { id: string; norma: string; redacao: string; vigenteDe: string; vigenteAte?: string; hierarquia: string; link: string }[]
  calculo?: { titulo: string; resultado: string; formula: string; linhas: [string, string][]; origem: string }
  divergencias: string[]
  lacunas?: string[]
  grau: 'alto' | 'médio' | 'baixo'
  dataConsiderada: string
  dataInferida?: boolean
  versaoBase: string
}

export interface Anexo {
  id: string
  nome: string
  tamanho?: string
}

export interface Mensagem {
  id: string
  autor: { tipo: 'usuario'; nome: string } | { tipo: 'integrante'; setor: SetorIntegrante; nome?: string; cor?: string } | { tipo: 'sistema' }
  hora: string
  texto?: string
  anexos?: Anexo[]
  cartoes?: Cartao[]
  /** Conversa que veio do Geral para o chat do integrante. */
  veioDoGeral?: boolean
  /** Resposta ainda sendo preparada (o integrante está pensando). */
  pendente?: boolean
  /** Resposta nova: o texto aparece sendo escrito antes dos cartões. */
  escrever?: boolean
  /** Quando a escrita começou (ms). Abrir o chat depois mostra o ponto certo, ou o texto pronto, nunca recomeça. */
  escreverDesde?: number
  /** Momento em que entrou na conversa (ordena o que o time escreve no chat do Assistente). */
  em?: number
}

/** Widgets da Visão geral (Home do subplano 03, seção 4). */
export interface Indicador {
  id: string
  rotulo: string
  valor: string
  /** Comparação curta, em texto ("+2 desde ontem"). */
  detalhe?: string
  tom?: 'neutro' | 'atencao' | 'bom'
}

export interface Pendencia {
  id: string
  cliente: string
  item: string
  dias: number
  cobrancas: number
}

export interface EventoLinhaDoTempo {
  id: string
  hora: string
  texto: string
  ator: string
}

export interface ItemAgenda {
  id: string
  dia: number
  codigo: string
  titulo: string
  setor: SetorIntegrante
  /** Obrigação igual em vários clientes, agrupada ("× 14"). */
  quantidade?: number
  atrasada?: boolean
}

/** Limite de uso do plano (botão ao lado do campo do chat, como no Claude). */
export interface LimiteUso {
  id: string
  rotulo: string
  /** Texto curto de quando renova ("13:10", "qua, 04:00"). */
  renova: string
  /** 0 a 100. */
  usado: number
}

/** Conversa do Assistente, guardada por cliente (ou Carteira). */
export interface Conversa {
  id: string
  /** Título: a primeira pergunta, encurtada. */
  titulo: string
  /** Quando foi mexida por último, em texto ("hoje, 09:04", "ontem"). */
  quando: string
  /** Para agrupar no histórico. */
  grupo: 'Hoje' | 'Ontem' | 'Esta semana' | 'Antes'
  mensagens: Mensagem[]
}
