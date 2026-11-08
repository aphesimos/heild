import { createContext, useContext, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import '@/vendor/orb-avatar/orb-avatar.js'
import type { OrbAvatar, OrbMode, OrbReaction } from '@/vendor/orb-avatar/orb-avatar'
import { reacaoDoEstado, rotuloDoEstado, type EstadoIntegrante } from '@/lib/integrante'
import { useTema } from '@/theme/ThemeProvider'
import { cn } from '@/lib/utils'

export interface OrbProps {
  /** Estado do integrante; vira a reação do orb. Ignorado se `reacao` vier. */
  estado?: EstadoIntegrante
  /** Reação direta do orb, para casos fora dos estados (ex.: "happy" ao saudar). */
  reacao?: OrbReaction
  /** Cor do corpo. Vem do tema do escritório (integrantes_padrao), nunca fixa. */
  cor?: string
  corOlhos?: string
  /** Diâmetro em px. */
  tamanho?: number
  /** Para onde o orb olha. `fixed` desliga os movimentos. */
  modo?: OrbMode
  /** Direção "yaw pitch" em graus. */
  olhar?: string
  /**
   * Anima o orb. Sem valor: animado, vagando (drift, sem seguir o cursor), em
   * qualquer estado fora do padrão ou quando está num `GrupoOrbs` em que algum
   * orb diverge; parado só quando ele e o grupo estão todos no padrão. `false` força parado (ex.: o orb ao
   * lado de uma mensagem antiga); `true` força animado.
   */
  animado?: boolean
  /**
   * Modo "alive" (orb-avatar 1.3): parado em idle, faz gracinhas sozinho de vez em
   * quando (bocejo, espirro, assobio...) e cochila se ninguém interage. Só onde o
   * orb é grande e tem espaço: o "No que posso ajudar?" e o chat vazio do integrante.
   */
  vivo?: boolean
  /** Participa do espelho do chat aberto (ver `EspelhoOrbs`). */
  espelho?: { id: string; papel: PapelEspelho }
  /** Brilhos, zzz, anel de "precisa de você". */
  extras?: boolean
  sombra?: boolean
  /** Reage ao clique com o "poke" do componente. */
  cutucavel?: boolean
  /** Nome acessível; padrão: rótulo do estado. */
  rotulo?: string
  /** Chave da memória entre telas (padrão: cor, tamanho e quem é). */
  memoria?: string
  className?: string
  onClick?: () => void
}

/**
 * Grupo de orbs mostrados juntos (lista de avisos, "Time agora"...). Se algum
 * estiver fora do estado padrão, todos animam, inclusive os que estão no
 * padrão; só quando todos estão no padrão o grupo fica parado.
 */
const GrupoCtx = createContext(false)

/**
 * Espelho do chat aberto: o orb do chat (o grande, no chat vazio, ou o do
 * cabeçalho) repassa o que faz (gracinhas, cochilo, acordar, cutucadas) para
 * as cópias do mesmo integrante. Grande → cabeçalho e lista lateral;
 * cabeçalho → o grande (quando o chat está vazio) e a lista lateral. Só vale para o chat aberto: com o chat
 * fechado ou noutro integrante, as cópias ficam como estavam, sem reagir.
 */
export type PapelEspelho = 'grande' | 'cabecalho' | 'lateral'
const EspelhoCtx = createContext<{ aberto: string | null; dormeVivo: boolean }>({ aberto: null, dormeVivo: false })
export function EspelhoOrbs({ aberto, dormeVivo, children }: { aberto: string | null; dormeVivo: boolean; children: ReactNode }) {
  return <EspelhoCtx.Provider value={{ aberto, dormeVivo }}>{children}</EspelhoCtx.Provider>
}
const EVENTO_ESPELHO = 'orb-espelho'
const alvos: Record<PapelEspelho, PapelEspelho[]> = { grande: ['cabecalho', 'lateral'], cabecalho: ['grande', 'lateral'], lateral: [] }
type ComEspelho = OrbAvatar & { _espelhando?: boolean }

/*
 * Memória dos orbs (pedido do usuário, 8/11/2026): ao trocar de aba, o orb
 * desmonta e outro igual monta na tela nova. Sem memória ele nascia com outra
 * fase de balanço, outro olhar e a expressão "idle" morfando para o estado,
 * o que dava um leve piscar. Aqui o orb guarda o próprio estado interno ao sair
 * e o seguinte, com a mesma chave, retoma de onde parou, já desenhado no
 * primeiro quadro. Só os orbs na tela existem; a memória é um objeto pequeno.
 */
const CAMPOS_MEMORIA = ['_ph', '_yaw', '_pitch', '_roll', '_vy', '_vp', '_vr', '_wTarget', '_wNext', '_expr', '_asleep', '_override', '_overrideAt', '_overrideUntil', '_nextEmote', '_lastAttn', '_lastEmote', '_nextBlink', '_pokes'] as const
const memoriaOrbs = new Map<string, Record<string, unknown>>()
type Interno = OrbAvatar & Record<string, unknown> & { _update?: (dt: number, t: number) => void; _resized?: (w: number) => void; _jx: number[]; _jv: number[] }

function guardar(el: Interno, chave: string) {
  const m: Record<string, unknown> = {}
  for (const c of CAMPOS_MEMORIA) m[c] = el[c]
  m._jx = [...el._jx]
  m._jv = [...el._jv]
  memoriaOrbs.set(chave, m)
}
function retomar(el: Interno, chave: string, tamanho: number) {
  const m = memoriaOrbs.get(chave)
  // Desenha já no tamanho certo (sem esperar o ResizeObserver, que deixava um quadro vazio).
  el._resized?.(tamanho)
  if (m) {
    // Só retoma a expressão se for a mesma reação de agora; se o estado mudou, deixa o orb morfar.
    const mesmaFace = m._expr === el.reaction || (m._asleep && el.reaction === 'idle')
    for (const c of CAMPOS_MEMORIA) if (c !== '_expr' || mesmaFace) el[c] = m[c]
    el._jx = [...(m._jx as number[])]
    el._jv = [...(m._jv as number[])]
    el._init = true
    el._tp = 1
    el._cur = null
    if (!mesmaFace) {
      el._override = null
      el._asleep = false
    }
  }
  el._update?.(0, performance.now() / 1000)
}
export function GrupoOrbs({ divergente, children }: { divergente: boolean; children: ReactNode }) {
  return <GrupoCtx.Provider value={divergente}>{children}</GrupoCtx.Provider>
}

/**
 * Avatar animado de integrante do time, sobre o Web Component <orb-avatar> 1.3
 * (github.com/sundenlast/orb, copiado em src/vendor/orb-avatar). Desenha em
 * canvas, com regulador de qualidade automático (OrbAvatar.quality = 'auto').
 */
export function Orb({
  estado = 'disponivel',
  reacao,
  cor = 'var(--card)',
  corOlhos,
  tamanho = 40,
  modo = 'drift',
  olhar,
  animado,
  vivo = false,
  espelho,
  extras = true,
  sombra,
  cutucavel = true,
  rotulo,
  memoria,
  className,
  onClick,
}: OrbProps) {
  const ref = useRef<OrbAvatar>(null)
  // A mesma figura (cor, tamanho, quem é) é o mesmo orb de uma tela para a outra.
  const chave = memoria ?? [cor, corOlhos, tamanho, rotulo ?? estado, espelho?.papel].join('|')
  useLayoutEffect(() => {
    const el = ref.current as Interno | null
    if (!el) return
    retomar(el, chave, tamanho)
    return () => guardar(el, chave)
  }, [chave, tamanho])
  const { tema, modo: modoCor } = useTema()
  const bruta = reacao ?? reacaoDoEstado[estado]
  const espelhoCtx = useContext(EspelhoCtx)
  const noChatAberto = !!espelho && espelho.id === espelhoCtx.aberto
  // Vivo e dormindo: fica em idle e cochila de verdade (sleep()), para acordar com o cursor e fazer gracinhas.
  // As cópias do chat aberto fazem o mesmo, para acompanhar o orb grande quando ele acorda.
  const dormeVivo = bruta === 'sleeping' && (vivo || (noChatAberto && espelhoCtx.dormeVivo && espelho?.papel !== 'grande'))
  const reaction = dormeVivo ? 'idle' : bruta
  // Estado fora do padrão anima sozinho, sempre em drift (seguir o cursor é mais pesado).
  const grupoDivergente = useContext(GrupoCtx)
  const automatico = animado === undefined && (reaction !== 'idle' || grupoDivergente)
  const anima = animado ?? (reaction !== 'idle' || grupoDivergente)
  const modoFinal = automatico && modo === 'follow' ? 'drift' : modo
  // Animado por regra, mostra as partículas do estado (zzz, brilhos, anel); parado, nunca.
  const extrasFinal = automatico || extras

  // O orb desenha em canvas e resolve cores como var(--highlight) só quando o
  // atributo muda. Ao trocar de tema ou de modo, reaplica as cores.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setAttribute('color', cor)
    if (corOlhos) el.setAttribute('eye-color', corOlhos)
  }, [tema.id, modoCor, cor, corOlhos])

  // Atributos booleanos do componente, mantidos explícitos.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.toggleAttribute('static', !anima)
    el.toggleAttribute('shadow', !!sombra)
    el.toggleAttribute('alive', vivo && anima)
    if (vivo) {
      el.setAttribute('idle-time', '100000')
      el.setAttribute('sleep-after', '180')
    }
  }, [anima, sombra, vivo])

  useEffect(() => {
    if (dormeVivo) ref.current?.sleep?.()
  }, [dormeVivo])

  // Gracinhas do modo vivo: o sorteio interno (média de 8 s) é desligado com idle-time alto, e
  // aqui cada próxima gracinha sai entre 20 e 40 s, sem padrão. Só em idle, acordado e com a aba visível.
  useEffect(() => {
    const el = ref.current
    if (!el || !vivo || !anima) return
    let t = 0
    const proxima = () => {
      t = window.setTimeout(
        () => {
          const lista = (window.OrbAvatar?.emotes ?? []).filter((n: string) => n !== 'doze' && n !== 'wake')
          if (lista.length && el.reaction === 'idle' && !el.asleep && document.visibilityState === 'visible') el.emote(lista[Math.floor(Math.random() * lista.length)])
          proxima()
        },
        20_000 + Math.random() * 20_000,
      )
    }
    proxima()
    return () => window.clearTimeout(t)
  }, [vivo, anima])

  // Espelho: quem é fonte repassa; quem é cópia reproduz (sem repassar de novo).
  useEffect(() => {
    const el = ref.current as ComEspelho | null
    if (!el || !espelho || !noChatAberto) return
    const { id, papel } = espelho
    const repassar = (tipo: 'emote' | 'poke') => (e: Event) => {
      if (el._espelhando) return
      const nome = (e as CustomEvent<{ name?: string }>).detail?.name
      window.dispatchEvent(new CustomEvent(EVENTO_ESPELHO, { detail: { id, origem: papel, tipo, nome } }))
    }
    const emote = repassar('emote')
    const poke = repassar('poke')
    if (papel === 'grande') el.addEventListener('emote', emote)
    if (papel !== 'lateral') el.addEventListener('poke', poke)
    const receber = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; origem: PapelEspelho; tipo: 'emote' | 'poke'; nome?: string }>).detail
      if (d.id !== id || !alvos[d.origem].includes(papel)) return
      el._espelhando = true
      try {
        if (d.tipo === 'poke') el.poke(1)
        else if (d.nome === 'doze') {
          if (!el.asleep) el.sleep()
        } else if (d.nome === 'wake') {
          if (el.asleep) el.wakeUp()
          else el.emote('wake')
        } else if (d.nome) el.emote(d.nome)
      } finally {
        el._espelhando = false
      }
    }
    window.addEventListener(EVENTO_ESPELHO, receber)
    return () => {
      el.removeEventListener('emote', emote)
      el.removeEventListener('poke', poke)
      window.removeEventListener(EVENTO_ESPELHO, receber)
    }
  }, [espelho?.id, espelho?.papel, noChatAberto])

  return (
    <orb-avatar
      ref={ref}
      reaction={reaction}
      color={cor}
      eye-color={corOlhos}
      size={tamanho}
      mode={modoFinal}
      gaze={olhar}
      extras={extrasFinal ? 'on' : 'off'}
      label={rotulo ?? rotuloDoEstado[estado]}
      static={!anima}
      data-espelho={espelho ? `${espelho.id}:${espelho.papel}` : undefined}
      className={cn('inline-block shrink-0 text-muted-foreground select-none', ((cutucavel && anima) || onClick) && 'cursor-pointer', className)}
      onMouseDown={(e) => {
        if (e.detail > 1) e.preventDefault()
      }}
      onClick={() => {
        if (cutucavel && anima) ref.current?.poke()
        onClick?.()
      }}
    />
  )
}
