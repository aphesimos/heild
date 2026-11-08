import type { ItemGrade, TamanhoWidget } from '@/components/widgets/tipos'

/**
 * Arranjo padrão de cada aba do Painel (com cliente e em carteira). Feito para
 * fechar a grade de 6 colunas sem buracos (a ordem já conta com o
 * `grid-auto-flow: dense`), na ordem de importância do setor, com tamanhos
 * que cabem o conteúdo de exemplo. Assimétrico de propósito.
 */
const a = (lista: string): ItemGrade[] =>
  lista
    .trim()
    .split(/\s+/)
    .map((x) => {
      const [id, tamanho] = x.split(':')
      return { id, tamanho: tamanho as TamanhoWidget }
    })

export const padroes: Record<string, ItemGrade[]> = {
  societario: a('ciclo:L pendencias:M certificados:M ficha:G pessoas:G acoes:G contrato:M acessos:M processos:G documentos:M tarefas:G relatorios:M'),
  obrigacoes: a('calendario:XL riscos:G pendencias:M prerequisitos:G acoes:G comprovacao:M prorrogacoes:G tarefas:G documentos:M relatorios:M'),
  notas: a('fluxos:L manifestacao:M tributaria:G completude:G configuracao:G pendencias:M acoes:G lotes:G tarefas:G documentos:M relatorios:M'),
  'fiscal-simples': a('simples:M caixas:G pendencias:G guias:XL situacao:M certidoes:M acoes:G tarefas:G documentos:G relatorios:M'),
  fiscal: a('caixas:G pendencias:G situacao:M certidoes:M guias:XL acoes:G tarefas:G documentos:G relatorios:G'),
  dp: a('admissoes:XL quadro:M rescisoes:M pendencias:M folha:G esocial:G ferias:M acoes:G tarefas:G documentos:M relatorios:M'),
  contabil: a('fechamento:L deve-chegar:G pendencias:M documentos:M classificacao:XL conciliacao:G acoes:G tarefas:G relatorios:G'),
  consultoria: a('perguntas:XL vigilancia:G pareceres:G acoes:G simulacoes:M tarefas:G documentos:M relatorios:M'),
  gestao: a('produtividade:G ia:G equipe:M permissoes:XL migracao:XL acoes:G tarefas:G relatorios:M'),
  'societario-carteira': a('carteira-certificados:XL carteira-estados:G acoes:G tarefas:G relatorios:G'),
  'obrigacoes-carteira': a('carteira-semana:XL riscos:M prerequisitos:M prorrogacoes:M acoes:G tarefas:G relatorios:M'),
  'notas-carteira': a('carteira-captura:XL manifestacao:M acoes:G tarefas:XL relatorios:M'),
  'fiscal-carteira': a('guias:M caixas:G situacao:M certidoes:M acoes:G tarefas:XL relatorios:M'),
  'dp-carteira': a('carteira-folha:XL acoes:G tarefas:XL relatorios:G'),
  'contabil-carteira': a('carteira-fechamento:XL acoes:G tarefas:XL relatorios:G'),
  'consultoria-carteira': a('carteira-consultoria:XL acoes:G tarefas:XL relatorios:G'),
}

/** Chave do arranjo: a Gestão é igual com ou sem cliente; a Fiscal muda para cliente do Simples. */
export function chavePadrao(abaId: string, carteira: boolean, simples: boolean) {
  if (abaId === 'gestao') return 'gestao'
  if (carteira) return `${abaId}-carteira`
  if (abaId === 'fiscal' && simples) return 'fiscal-simples'
  return abaId
}
