import type { AbaSegmentada } from '@/components/compostos/abas-segmentadas'

/**
 * Módulos da barra lateral e as abas internas de cada um (subplano 03, 2.0;
 * design do usuário). No Início, o Figma tem Assistente e Time; a Visão geral
 * (a Home do 03, seção 4) entrou como terceira aba.
 */
export type IdModulo = 'inicio' | 'painel' | 'clientes' | 'crm' | 'timesheet' | 'financeiro' | 'arquivos' | 'bpo' | 'config'

export const modulosLaterais: { id: IdModulo; rotulo: string }[] = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'painel', rotulo: 'Painel' },
  // Sem Painel (só BPO, ou escritório só de BPO), o cadastro dos clientes ganha item próprio (10, 2.2).
  { id: 'clientes', rotulo: 'Clientes' },
  { id: 'crm', rotulo: 'CRM' },
  { id: 'arquivos', rotulo: 'Arquivos' },
  { id: 'timesheet', rotulo: 'Timesheet' },
  { id: 'financeiro', rotulo: 'Financeiro' },
  { id: 'bpo', rotulo: 'BPO' },
]

export const moduloConfig = { id: 'config' as const, rotulo: 'Configurações' }

export const abasInternas: Record<IdModulo, AbaSegmentada[]> = {
  inicio: [
    { id: 'assistente', rotulo: 'Assistente' },
    { id: 'time', rotulo: 'Time' },
    { id: 'visao', rotulo: 'Visão geral' },
  ],
  painel: [
    { id: 'societario', rotulo: 'Societário' },
    { id: 'obrigacoes', rotulo: 'Obrigações', contador: 2 },
    { id: 'notas', rotulo: 'Notas' },
    { id: 'fiscal', rotulo: 'Fiscal', contador: 1 },
    { id: 'dp', rotulo: 'DP' },
    { id: 'contabil', rotulo: 'Contábil' },
    { id: 'consultoria', rotulo: 'Consultoria' },
    { id: 'gestao', rotulo: 'Gestão' },
  ],
  clientes: [
    { id: 'cadastro', rotulo: 'Cadastro' },
    { id: 'contatos', rotulo: 'Contatos' },
  ],
  crm: [
    { id: 'conversas', rotulo: 'Conversas', contador: 5 },
    { id: 'leads', rotulo: 'Leads' },
    { id: 'comunicados', rotulo: 'Comunicados' },
    { id: 'numeros', rotulo: 'Números' },
  ],
  timesheet: [
    { id: 'meu', rotulo: 'Meu tempo' },
    { id: 'equipe', rotulo: 'Equipe' },
    { id: 'rentabilidade', rotulo: 'Rentabilidade' },
    { id: 'confirmacoes', rotulo: 'Confirmações', contador: 6 },
  ],
  // Estrutura do subplano 09 (decisão do usuário, 8/11/2026): sete abas.
  financeiro: [
    { id: 'visao', rotulo: 'Visão geral' },
    { id: 'contratos', rotulo: 'Contratos' },
    { id: 'cobranca', rotulo: 'Cobranças' },
    { id: 'pagar', rotulo: 'Contas a pagar' },
    { id: 'conciliacao', rotulo: 'Conciliação' },
    { id: 'caixa', rotulo: 'Fluxo de caixa' },
    { id: 'resultado', rotulo: 'Resultado' },
  ],
  // Pacote BPO Financeiro (subplano 10, 5.2): nove abas, frente financeira.
  bpo: [
    { id: 'visao', rotulo: 'Visão geral' },
    { id: 'carteira', rotulo: 'Carteira' },
    { id: 'fila', rotulo: 'Fila' },
    { id: 'rotinas', rotulo: 'Rotinas' },
    { id: 'aprovacoes', rotulo: 'Aprovações' },
    { id: 'entregas', rotulo: 'Entregas' },
    { id: 'volume', rotulo: 'Volume' },
    { id: 'rentabilidade', rotulo: 'Rentabilidade' },
    { id: 'configuracao', rotulo: 'Configuração' },
  ],
  arquivos: [
    { id: 'pastas', rotulo: 'Pastas' },
    { id: 'recentes', rotulo: 'Recentes' },
  ],
  config: [
    { id: 'escritorio', rotulo: 'Escritório' },
    { id: 'usuarios', rotulo: 'Usuários' },
    { id: 'armazenamento', rotulo: 'Armazenamento' },
    { id: 'tema', rotulo: 'Tema' },
    { id: 'integrantes', rotulo: 'Integrantes' },
    { id: 'assinatura', rotulo: 'Assinatura' },
  ],
}

/** Nome completo das abas do Painel (o controle usa o curto). */
export const nomeCompleto: Record<string, string> = {
  societario: 'Clientes e Societário',
  obrigacoes: 'Obrigações e Prazos',
  notas: 'Notas fiscais',
  dp: 'Trabalhista e DP',
  consultoria: 'Consultoria e Reforma',
  contratos: 'Contratos e honorários',
  numeros: 'Configuração dos números',
  usuarios: 'Usuários e setores',
  fila: 'Fila e pedidos',
  entregas: 'Entregas e SLA',
  volume: 'Volume e faturamento',
}
