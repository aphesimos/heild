import { CheckIcon, ScalesIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Orb } from '@/components/ui/orb'
import * as exemplo from '@/dados/exemplo'
import { pedidosAssistente } from '@/dados/simulacao'
import type { Integrante, RespostaLegal } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { useMedia } from '@/hooks/useMedia'
import { cn } from '@/lib/utils'
import { ReservaAltura } from './Estavel'

/** Fica true quando o elemento entra na tela (e volta a false quando sai, se `sempre`). */
export function useVisto<T extends Element>(ref: RefObject<T | null>, { limiar = 0.3, sempre = false } = {}) {
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setVisto(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true)
          if (!sempre) io.disconnect()
        } else if (sempre) setVisto(false)
      },
      { threshold: limiar },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, limiar, sempre])
  return visto
}

/** Relógio em ms que corre enquanto `ligado`; recomeça do zero quando `chave` muda. */
export function useRelogio(ligado: boolean, chave: unknown, ate = Infinity) {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    setMs(0)
    if (!ligado) return
    const t0 = performance.now()
    let raf = 0
    const f = () => {
      const v = performance.now() - t0
      setMs(v)
      if (v < ate) raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [ligado, chave, ate])
  return ms
}

const parado = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* ---------------- o cartão de aprovação, sendo aprovado ---------------- */

/**
 * O cartão de aprovação do Fiscal (o mesmo da conversa do produto), mais
 * simples: um cursor chega, aprova, e as 14 transmissões correm. Repete
 * enquanto a seção está na tela; a pessoa também pode aprovar com o clique dela.
 */
export function AprovacaoAoVivo() {
  const aparencia = useAparencia()
  const fiscal = aparencia(exemplo.integrantes.find((i) => i.setor === 'fiscal') as Integrante)
  const caixa = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const visto = useVisto(caixa, { limiar: 0.5, sempre: true })
  const [volta, setVolta] = useState(0)
  const [manual, setManual] = useState<number | null>(null)
  // Tela de toque: nada roda sozinho. O cartão espera o toque em Aprovar e o resultado fica guardado, mesmo saindo da tela.
  const toque = useMedia('(hover: none)')
  const CICLO = 9000
  const ms = useRelogio(visto && !parado() && !toque, volta, 60_000)
  // Aprovado na mão, o ciclo termina o mesmo tempo depois do toque que depois da aprovação automática: as 14 transmissões correm inteiras.
  const fimCiclo = manual !== null ? manual + (CICLO - 2700) : CICLO
  useEffect(() => {
    if (toque) return
    if (ms >= fimCiclo) {
      setManual(null)
      setVolta((v) => v + 1)
    }
  }, [ms, fimCiclo, toque])
  // No toque, as transmissões contam a partir do momento do toque, num relógio próprio que não depende de o cartão estar na tela.
  const [aprovadoEm, setAprovadoEm] = useState<number | null>(null)
  const [agora, setAgora] = useState(0)
  const feitasToque = aprovadoEm === null ? 0 : Math.min(14, Math.floor(Math.max(0, agora - aprovadoEm - 500) / 140))
  useEffect(() => {
    if (aprovadoEm === null || feitasToque >= 14) return
    let raf = 0
    const f = () => {
      setAgora(performance.now())
      raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [aprovadoEm, feitasToque])
  const aprovou = toque ? aprovadoEm !== null : manual !== null || ms >= 2700
  const desde = manual ?? 2700
  const feitas = toque ? feitasToque : aprovou ? Math.min(14, Math.floor(Math.max(0, ms - desde - 500) / 140)) : 0
  const aprovar = () => {
    if (toque) {
      const t0 = performance.now()
      setAgora(t0)
      setAprovadoEm(t0)
    } else setManual(ms)
  }
  const [alvo, setAlvo] = useState({ x: 0, y: 0 })
  // Onde fica o botão, medido de novo sempre que o cartão muda de tamanho (a seção entra animada e a largura muda com a tela).
  useEffect(() => {
    const c = caixa.current
    if (!c) return
    const medir = () => {
      const b = botao.current
      if (!b) return
      const rb = b.getBoundingClientRect()
      const rc = c.getBoundingClientRect()
      setAlvo({ x: rb.left - rc.left + rb.width * 0.55, y: rb.top - rc.top + rb.height * 0.6 })
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(c)
    return () => ro.disconnect()
  }, [visto, volta])
  const fase = manual !== null ? 3 : ms < 1100 ? 0 : ms < 2400 ? 1 : ms < 2700 ? 2 : 3
  // Quem aprovou de verdade não vê mais o cursor da demonstração.
  const cursor = manual !== null || toque ? { x: alvo.x, y: alvo.y, o: 0 } : fase === 0 ? { x: alvo.x + 180, y: alvo.y + 120, o: 0 } : fase === 3 && ms > 4200 ? { x: alvo.x + 140, y: alvo.y + 90, o: 0 } : { x: alvo.x, y: alvo.y, o: 1 }
  const hora = '14:02'
  return (
    <div ref={caixa} className="relative">
      <div className="bg-surface shadow-cartao flex flex-col gap-5 rounded-[24px] p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <Orb cor={fiscal.cor} corOlhos={fiscal.corOlhos} tamanho={32} extras={false} cutucavel={false} estado={aprovou ? 'concluido' : 'precisa_de_voce'} animado />
          <span className="flex flex-col">
            <span className="text-sm font-medium">{fiscal.nome}</span>
            <span className="text-muted-foreground text-xs">{aprovou ? 'transmitindo' : 'pede a sua aprovação · expira em 2 dias'}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading text-2xl font-light tracking-[-0.025em]">Transmitir o PGDAS-D de outubro</span>
          <span className="text-muted-foreground text-sm">14 clientes do Simples Nacional</span>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Competência</dt>
            <dd className="text-base font-medium">10/2026</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Total de DAS</dt>
            <dd className="text-base font-medium tabular-nums">R$ 38.402,15</dd>
          </div>
        </dl>
        <div className="flex min-h-[72px] flex-col justify-center gap-3">
          {aprovou ? (
            <>
              <p className="carimbo text-success flex items-center gap-2 text-sm font-medium">
                <CheckIcon className="size-4" weight="bold" /> Aprovado por {manual !== null || aprovadoEm !== null ? 'você' : 'Ana Souza'} às {hora}
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-sunken h-1.5 flex-1 overflow-hidden rounded-full">
                  <div className="bg-foreground h-full rounded-full transition-[width] duration-150" style={{ width: `${(feitas / 14) * 100}%` }} />
                </div>
                <span className="text-muted-foreground text-right text-xs whitespace-nowrap tabular-nums">{feitas} de 14 transmitidas</span>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <button ref={botao} type="button" onClick={aprovar} className={cn('botao bg-primary text-primary-foreground h-11 cursor-pointer rounded-full px-6 text-sm font-medium transition-transform', !toque && fase === 2 && 'scale-[0.96]', toque && 'pulso')}>
                Aprovar
              </button>
              <span className="text-muted-foreground flex h-11 items-center rounded-full px-4 text-sm">Ver os 14</span>
            </div>
          )}
        </div>
      </div>
      <svg
        aria-hidden
        width="22"
        height="22"
        viewBox="0 0 24 24"
        className="cursor-demo pointer-events-none absolute top-0 left-0 drop-shadow-md"
        style={{ transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${fase === 2 ? 0.86 : 1})`, opacity: cursor.o }}
      >
        <path d="M4 2 L4 19 L8.6 14.6 L11.6 21.4 L14.4 20.2 L11.4 13.6 L18 13.6 Z" fill="var(--foreground)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ---------------- o Consultor respondendo sobre a lei ---------------- */

const perguntasLei = pedidosAssistente
  .filter((p) => p.juridico)
  .map((p) => {
    const c = p.final.cartoes?.find((x) => x.tipo === 'resposta_legal')
    return { pergunta: p.texto, resposta: p.final.texto, legal: (c && c.tipo === 'resposta_legal' ? c.resposta : null) as RespostaLegal | null }
  })
  .filter((x) => x.legal)

export const rotulosLei = ['Fator R da Clínica Sorriso', 'Sublimite da Loja Bela Vista']

/** O chat do Consultor, no formato do chat do integrante: a pergunta, a resposta sendo escrita e o fundamento. */
export function LeiAoVivo({ k }: { k: number }) {
  const aparencia = useAparencia()
  const consultor = aparencia(exemplo.integrantes.find((i) => i.setor === 'consultor') as Integrante)
  const caixa = useRef<HTMLDivElement>(null)
  const visto = useVisto(caixa, { limiar: 0.35 })
  const q = perguntasLei[k] ?? perguntasLei[0]
  const sem = parado()
  const ms = useRelogio(visto && !sem, k, 8000)
  const t = sem ? 99999 : ms
  const cartaoEm = 1500 + Math.min(q.resposta.length * 9, 2600) + 300
  return (
    <div ref={caixa} className="bg-background shadow-painel flex flex-col gap-5 overflow-hidden rounded-[28px] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Orb cor={consultor.cor} corOlhos={consultor.corOlhos} tamanho={40} extras={false} cutucavel={false} estado={t < cartaoEm ? 'pensando' : 'disponivel'} animado />
        <span className="flex flex-col">
          <span className="text-base font-medium">{consultor.nome}</span>
          <span className="text-muted-foreground text-xs">responde pela lei vigente na data do fato</span>
        </span>
      </div>
      {/* A resposta das duas perguntas reserva a altura da maior: trocar de pergunta não muda o painel. */}
      <ReservaAltura variantes={perguntasLei.filter((x) => x !== q).map((x) => <ConversaLei key={x.pergunta} q={x} t={99999} />)}>
        <ConversaLei q={q} t={t} />
      </ReservaAltura>
    </div>
  )
}

/** A conversa com o Consultor no instante `t` (ms): a pergunta, a resposta sendo escrita e o fundamento. */
function ConversaLei({ q, t }: { q: (typeof perguntasLei)[number]; t: number }) {
  const legal = q.legal as RespostaLegal
  const escrita = Math.min(q.resposta.length * 9, 2600)
  const letras = Math.ceil(Math.max(0, Math.min(1, (t - 1500) / escrita)) * q.resposta.length)
  const cartaoEm = 1500 + escrita + 300
  const grau = { alto: 'Segurança alta', médio: 'Segurança média', baixo: 'Segurança baixa' }[legal.grau]
  const trecho = legal.trechos[0]
  return (
    <div className="flex flex-col gap-5">
      {t >= 200 && (
        <div className="entra flex justify-end">
          <p className="bg-sunken max-w-[85%] rounded-[20px] rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed">{q.pergunta}</p>
        </div>
      )}
      {t >= 900 && t < 1500 && (
        <span className="pontos text-muted-foreground entra" aria-label="escrevendo">
          <i />
          <i />
          <i />
        </span>
      )}
      {t >= 1500 && (
        <p className="text-[15px] leading-relaxed">
          {q.resposta.slice(0, letras)}
          {letras < q.resposta.length && <span className="cursor-texto" aria-hidden />}
        </p>
      )}
      {t >= cartaoEm && (
        <div className="entra bg-surface shadow-contorno flex flex-col gap-4 rounded-[20px] p-4 sm:p-5">
          <div className="flex flex-wrap gap-1.5">
            {legal.trechos.map((x, i) => (
              <span key={x.id} className="entra bg-sunken flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs" style={{ animationDelay: `${i * 120}ms` }}>
                <ScalesIcon className="text-muted-foreground size-3.5" />
                {x.norma}
              </span>
            ))}
          </div>
          <blockquote className="border-border entra border-l-2 pl-3 text-sm leading-relaxed" style={{ animationDelay: '300ms' }}>
            <span className="line-clamp-3">“{trecho.redacao}”</span>
            <footer className="text-muted-foreground mt-1.5 text-xs">
              {trecho.norma} · vigente desde {trecho.vigenteDe}
            </footer>
          </blockquote>
          {legal.calculo && (
            <div className="entra flex flex-col gap-0.5 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-4" style={{ animationDelay: '500ms' }}>
              <span className="text-muted-foreground">{legal.calculo.titulo}</span>
              <span className="min-w-0 font-medium sm:text-right">{legal.calculo.resultado}</span>
            </div>
          )}
          <div className="text-muted-foreground entra flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-xs" style={{ animationDelay: '700ms' }}>
            <span className={cn('rounded-full px-2 py-0.5 font-medium', legal.grau === 'alto' ? 'bg-success/15 text-foreground' : 'bg-warning/20 text-foreground')}>{grau}</span>
            <span>Data considerada {legal.dataConsiderada}</span>
            <span>Base {legal.versaoBase}</span>
          </div>
        </div>
      )}
    </div>
  )
}
