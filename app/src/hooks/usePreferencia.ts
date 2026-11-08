import { useCallback, useState } from 'react'

/**
 * Preferência do usuário guardada no navegador (ex.: barra lateral aberta).
 * Conveniência local: se o armazenamento falhar, vale o padrão.
 * Em produção vira `usuario.preferencias` (subplano 03).
 */
export function usePreferencia<T>(chave: string, padrao: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const bruto = window.localStorage.getItem(chave)
      return bruto == null ? padrao : (JSON.parse(bruto) as T)
    } catch {
      return padrao
    }
  })
  const definir = useCallback(
    (novo: T | ((v: T) => T)) => {
      setValor((atual) => {
        const proximo = typeof novo === 'function' ? (novo as (v: T) => T)(atual) : novo
        try {
          window.localStorage.setItem(chave, JSON.stringify(proximo))
        } catch {
          /* sem armazenamento: só não lembra */
        }
        return proximo
      })
    },
    [chave],
  )
  return [valor, definir] as const
}
