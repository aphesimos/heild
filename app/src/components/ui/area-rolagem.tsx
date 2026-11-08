import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Área que rola sob o cabeçalho. Toda tela usa esta (ou a classe .area-rolagem),
 * para a passagem entre conteúdo e cabeçalho ser igual no sistema inteiro: ao
 * rolar, o topo do conteúdo esmaece aos poucos; parado no topo, nada é cortado.
 */
export function AreaRolagem({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('area-rolagem min-h-0 overflow-y-auto', className)} {...props} />
}
