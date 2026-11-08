import { useSyncExternalStore } from 'react'

/** Verdadeiro enquanto a media query casar. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', avisar)
      return () => m.removeEventListener('change', avisar)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Como a barra lateral se comporta na largura atual:
 * - `fixa` (>= 1280px): aberta empurra o conteúdo;
 * - `sobreposta` (768 a 1279px): recolhida ocupa espaço, aberta passa por cima;
 * - `gaveta` (< 768px): escondida; abre por cima a partir do botão de menu.
 */
export type ModoLateral = 'fixa' | 'sobreposta' | 'gaveta'

export function useModoLateral(): ModoLateral {
  const larga = useMedia('(min-width: 1280px)')
  const media = useMedia('(min-width: 768px)')
  return larga ? 'fixa' : media ? 'sobreposta' : 'gaveta'
}
