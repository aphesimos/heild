import { useEffect, useRef, useState } from 'react'
import { Orb, type OrbProps } from '@/components/ui/orb'

type Fase = 'pensando' | 'respondeu' | 'assentando' | 'parado'

const DURACAO_RESPONDEU = 1800
const DURACAO_ASSENTANDO = 900

/**
 * Orb ao lado de uma mensagem do integrante.
 * - Mensagem antiga: parado, 100% estático.
 * - Enquanto a resposta é preparada: animado, vagando, pensando, com partículas.
 * - Quando a resposta chega: fica feliz por um instante, volta ao normal e para.
 *   O orb é o mesmo elemento do começo ao fim, então a troca é contínua:
 *   o componente faz a transição entre reações e só congela depois de assentar.
 */
export function OrbMensagem({ cor, corOlhos, pendente, tamanho = 28, className }: { cor: string; corOlhos?: string; pendente?: boolean; tamanho?: number; className?: string }) {
  const [fase, setFase] = useState<Fase>(pendente ? 'pensando' : 'parado')
  const anterior = useRef(pendente)

  useEffect(() => {
    const estavaPendente = anterior.current
    anterior.current = pendente
    if (pendente) {
      setFase('pensando')
      return
    }
    if (!estavaPendente) return
    setFase('respondeu')
    const t1 = window.setTimeout(() => setFase('assentando'), DURACAO_RESPONDEU)
    const t2 = window.setTimeout(() => setFase('parado'), DURACAO_RESPONDEU + DURACAO_ASSENTANDO)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pendente])

  const porFase: Record<Fase, Pick<OrbProps, 'reacao' | 'animado' | 'modo' | 'extras'>> = {
    pensando: { reacao: 'thinking', animado: true, modo: 'wander', extras: true },
    respondeu: { reacao: 'done', animado: true, modo: 'drift', extras: true },
    assentando: { reacao: 'idle', animado: true, modo: 'fixed', extras: false },
    parado: { reacao: 'idle', animado: false, modo: 'fixed', extras: false },
  }
  const props = porFase[fase]

  return <Orb cor={cor} corOlhos={corOlhos} tamanho={tamanho} cutucavel={false} rotulo={fase === 'pensando' ? 'Pensando' : undefined} className={className} {...props} />
}
