import { createContext, useContext, useLayoutEffect, useMemo, type ReactNode } from 'react'
import type { ModoCor, SetorIntegrante, Tema } from './tipos'
import { tokensDoModo, variaveisCss } from './variaveis'
import { temaFabrica } from './temas'

interface ContextoTema {
  tema: Tema
  modo: ModoCor
  /** Nome e avatar do integrante de um setor, vindos do tema. */
  integrante: (setor: SetorIntegrante) => { nome: string; cor: string; corOlhos?: string }
}

const Contexto = createContext<ContextoTema | null>(null)

interface Props {
  tema?: Tema
  modo?: ModoCor
  children: ReactNode
}

/**
 * Aplica o tema em <html> (e não num contêiner) para que portais — modais,
 * gavetas, tooltips — herdem as mesmas variáveis.
 */
export function ThemeProvider({ tema = temaFabrica, modo = 'claro', children }: Props) {
  const vars = useMemo(() => variaveisCss(tema, modo), [tema, modo])

  useLayoutEffect(() => {
    const raiz = document.documentElement
    for (const [k, v] of Object.entries(vars)) raiz.style.setProperty(k, v)
    raiz.classList.toggle('dark', modo === 'escuro')
    raiz.dataset.tema = tema.id
    document.title = tema.nome_produto
  }, [vars, modo, tema])

  const valor = useMemo<ContextoTema>(
    () => ({
      tema,
      modo,
      integrante: (setor) => {
        const i = tema.integrantes_padrao[setor]
        const a = i?.avatar
        const escuro = modo === 'escuro'
        if (setor === 'geral') {
          // Regra de marca: o orb do Assistente (o integrante mestre) é sempre o
          // contraste direto do tema. Corpo na cor do texto, olhos na cor do fundo:
          // no claro, corpo escuro e olhos claros; no escuro, o inverso. Vale para
          // qualquer escritório (marca branca); os outros integrantes têm cor própria.
          const t = tokensDoModo(tema, modo)
          return { nome: i?.nome ?? 'Geral', cor: t.texto, corOlhos: t.fundo }
        }
        return {
          nome: i?.nome ?? setor,
          cor: (escuro && a?.cor_escuro) || a?.cor || '#f1efe9',
          corOlhos: (escuro && a?.cor_olhos_escuro) || a?.cor_olhos,
        }
      },
    }),
    [tema, modo],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useTema() {
  const c = useContext(Contexto)
  if (!c) throw new Error('useTema precisa estar dentro de <ThemeProvider>')
  return c
}
