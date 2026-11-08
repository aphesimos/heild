import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

/**
 * Tamanhos fixos de widget, sempre múltiplos da célula da grade (como os
 * widgets do iPhone): P 1×1, M 2×1, G 2×2, L 4×1, XL 4×2 (colunas × linhas).
 */
export type TamanhoWidget = 'P' | 'M' | 'G' | 'L' | 'XL'

export const dimensoes: Record<TamanhoWidget, { colunas: number; linhas: number; rotulo: string }> = {
  P: { colunas: 1, linhas: 1, rotulo: 'Pequeno' },
  M: { colunas: 2, linhas: 1, rotulo: 'Médio' },
  G: { colunas: 2, linhas: 2, rotulo: 'Grande' },
  L: { colunas: 4, linhas: 1, rotulo: 'Largo' },
  XL: { colunas: 4, linhas: 2, rotulo: 'Extra' },
}

/** Definição de um widget do catálogo de uma tela. */
export interface DefWidget {
  id: string
  titulo: string
  /** Uma linha para a galeria ("Adicionar widget"). */
  descricao: string
  icone?: Icon
  /** IDs do mapa, quando o widget é um bloco de aba (03, seção 6). */
  atividades?: string
  /** Tamanhos que fazem sentido para o conteúdo, do menor ao maior. */
  tamanhos: TamanhoWidget[]
  /** Ação no canto do cabeçalho (ex.: "ver todas"). */
  acao?: ReactNode
  /** Conteúdo; recebe o tamanho atual para se adaptar. */
  conteudo: (tamanho: TamanhoWidget) => ReactNode
}

/** Um widget posto na grade: qual e em que tamanho. A ordem do array é a posição. */
export interface ItemGrade {
  id: string
  tamanho: TamanhoWidget
}

/** Tamanho permitido mais próximo (pela área) quando o pedido não está entre os do widget. */
export function tamanhoValido(def: Pick<DefWidget, 'tamanhos'>, pedido: TamanhoWidget): TamanhoWidget {
  if (def.tamanhos.includes(pedido)) return pedido
  const area = (t: TamanhoWidget) => dimensoes[t].colunas * dimensoes[t].linhas
  return [...def.tamanhos].sort((a, b) => Math.abs(area(a) - area(pedido)) - Math.abs(area(b) - area(pedido)) || area(b) - area(a))[0]
}

/**
 * Vão que o widget ocupa numa grade de `colunas`. Quando a grade é mais
 * estreita que o widget (L e XL no celular), ele ganha altura em vez de ficar
 * achatado: L vira 2×2, XL vira 2×4.
 */
export function vao(tamanho: TamanhoWidget, colunas: number) {
  const d = dimensoes[tamanho]
  if (d.colunas <= colunas) return { colunas: d.colunas, linhas: d.linhas }
  return { colunas, linhas: d.linhas * Math.ceil(d.colunas / colunas) }
}
