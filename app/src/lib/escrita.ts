import { useEffect, useState } from 'react'

/**
 * Ritmo da escrita simulada (pedido do usuário, 8/11/2026): a resposta do
 * integrante aparece sendo escrita, como numa IA de verdade, e não de uma vez.
 * Cerca de 55 caracteres por segundo, com teto para textos longos.
 */
export const CARACTERES_POR_SEGUNDO = 55
export const duracaoEscrita = (texto?: string) => (texto ? Math.min(7000, Math.max(500, (texto.length / CARACTERES_POR_SEGUNDO) * 1000)) : 0)

/** Quando cada mensagem começou a ser escrita (sobrevive à troca de aba: voltar no meio mostra o ponto certo). */
const inicioPorMensagem = new Map<string, number>()
export function inicioEscrita(id: string, desde?: number) {
  if (desde !== undefined) return desde
  let t = inicioPorMensagem.get(id)
  if (t === undefined) {
    t = Date.now()
    inicioPorMensagem.set(id, t)
  }
  return t
}

/** Texto aparecendo palavra por palavra no ritmo de duracaoEscrita (ativo só para resposta nova). */
export function useEscritaTexto(id: string, texto: string, ativo: boolean, desde?: number) {
  const inicio = ativo && texto ? inicioEscrita(id, desde) : 0
  const dur = duracaoEscrita(texto)
  const [agora, setAgora] = useState(Date.now())
  const escrevendo = ativo && !!texto && agora < inicio + dur
  useEffect(() => {
    if (!escrevendo) return
    const t = window.setInterval(() => setAgora(Date.now()), 40)
    return () => window.clearInterval(t)
  }, [escrevendo])
  if (!escrevendo) return { visivel: texto, escrevendo: false }
  const alvo = Math.floor((texto.length * (agora - inicio)) / dur)
  return { visivel: texto.slice(0, Math.max(0, texto.lastIndexOf(' ', alvo))), escrevendo: true }
}
