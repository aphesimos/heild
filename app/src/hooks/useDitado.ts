import { useCallback, useEffect, useRef, useState } from 'react'

/* Tipos mínimos da Web Speech API, que o TypeScript não traz no DOM padrão. */
interface ResultadoFala {
  readonly isFinal: boolean
  readonly 0: { transcript: string }
}
interface EventoFala {
  readonly resultIndex: number
  readonly results: ArrayLike<ResultadoFala>
}
interface Reconhecedor {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((e: EventoFala) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}
type ConstrutorReconhecedor = new () => Reconhecedor

function construtor(): ConstrutorReconhecedor | undefined {
  const w = window as unknown as { SpeechRecognition?: ConstrutorReconhecedor; webkitSpeechRecognition?: ConstrutorReconhecedor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/**
 * Ditado no campo do chat, com o reconhecimento de fala do navegador (pt-BR).
 * No lab basta para testar a experiência; em produção a transcrição vai para o
 * servidor, para funcionar igual em todo navegador (ver README, backlog).
 */
export function useDitado(onFinal: (texto: string) => void) {
  const [suportado] = useState(() => typeof window !== 'undefined' && !!construtor())
  const [ouvindo, setOuvindo] = useState(false)
  const [parcial, setParcial] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const rec = useRef<Reconhecedor | null>(null)
  const final = useRef(onFinal)
  final.current = onFinal

  useEffect(() => () => rec.current?.stop(), [])

  const parar = useCallback(() => rec.current?.stop(), [])

  const iniciar = useCallback(() => {
    const C = construtor()
    if (!C) return
    const r = new C()
    r.lang = 'pt-BR'
    r.continuous = true
    r.interimResults = true
    r.onresult = (e) => {
      let interino = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) final.current(res[0].transcript.trim())
        else interino += res[0].transcript
      }
      setParcial(interino)
    }
    r.onerror = (e) => setErro(e.error === 'not-allowed' ? 'Permita o microfone para ditar.' : 'Não consegui ouvir. Tente de novo.')
    r.onend = () => {
      setOuvindo(false)
      setParcial('')
    }
    rec.current = r
    setErro(null)
    setOuvindo(true)
    r.start()
  }, [])

  return { suportado, ouvindo, parcial, erro, iniciar, parar }
}
