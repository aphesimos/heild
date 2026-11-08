import type { DefWidget } from '@/components/widgets/tipos'
import type { AbaPainel } from '@/dados/painel'
import type { Cliente, Integrante, Tarefa } from '@/dados/tipos'

/** O que cada aba do Painel recebe para montar seus widgets. */
export interface CtxAba {
  aba: AbaPainel
  /** Cliente selecionado; ausente = carteira. */
  cliente?: Cliente
  clientesNaCarteira: number
  tarefas: Tarefa[]
  integrante?: Integrante
}

/** Widgets próprios de uma aba (bloco C do 03, seção 5). O arranjo padrão fica em `padroes.ts`. */
export interface WidgetsAba {
  catalogo: DefWidget[]
}
