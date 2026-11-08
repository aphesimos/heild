import { useCallback } from 'react'
import type { Integrante } from '@/dados/tipos'
import { useTema } from '@/theme/ThemeProvider'

/**
 * Nome e cores do orb de um integrante. Os padrão vêm do tema (e o Geral é
 * sempre o contraste do tema); o criado pelo usuário traz nome e cor próprios.
 */
export function useAparencia() {
  const { integrante } = useTema()
  return useCallback(
    (it: Pick<Integrante, 'setor' | 'nome' | 'cor'>) => {
      const t = integrante(it.setor)
      return { nome: it.nome ?? t.nome, cor: it.cor ?? t.cor, corOlhos: it.cor ? undefined : t.corOlhos }
    },
    [integrante],
  )
}
