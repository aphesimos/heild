import { ArrowUpRightIcon, CaretDownIcon, CheckIcon, CopyIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { DocumentosProvider } from '@/ambiente/documentos'
import { FluxosProvider } from '@/ambiente/fluxos'
import { cartoesPendentes } from '@/ambiente/integrante-vivo'
import { LojaProvider, NavegacaoProvider } from '@/ambiente/loja'
import { SessaoProvider } from '@/ambiente/sessao'
import { CabecalhoIntegrante } from '@/components/compostos/cabecalho-integrante'
import { Orb } from '@/components/ui/orb'
import * as exemplo from '@/dados/exemplo'
import type { Integrante } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { rotuloDoEstado, type EstadoIntegrante } from '@/lib/integrante'
import { ListaMensagens } from '@/telas/ListaMensagens'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { temaFabrica } from '@/theme/temas'
import type { ModoCor } from '@/theme/tipos'
import { cn } from '@/lib/utils'
import { DemoGuiada } from './DemoGuiada'
import { SecoesBpo } from './SecoesBpo'
import { SecoesContabil } from './SecoesContabil'
import { ReservaAltura } from './Estavel'
import { Luz } from './Luz'
import { BarraRolagem } from './Rolagem'
import { MoldeVisual } from './SecaoProduto'
import { roteiros } from './roteiros'
import { AprovacaoAoVivo, LeiAoVivo, rotulosLei, useVisto } from './Vivos'
import type { HeildLogoElement } from './heild-logo.d.ts'
import { CONTATO, plataformas, type Plataforma } from './paginas'

type Rota = 'inicio' | 'contabil' | 'bpo' | 'contato'
const rotas: Rota[] = ['contabil', 'bpo', 'contato']
const rotaDaHash = (): Rota => {
  const h = window.location.hash.replace('#', '') as Rota
  return rotas.includes(h) ? h : 'inicio'
}
const ir = (r: Rota) => {
  window.location.hash = r === 'inicio' ? '' : r
}
const rolarPara = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
/** Vai a uma seção; se ela não existe nesta página, volta à principal e rola até lá. */
const irSecao = (id: string) => {
  if (document.getElementById(id)) return rolarPara(id)
  ir('inicio')
  window.setTimeout(() => rolarPara(id), 80)
}

/**
 * O site da Heild: a página da empresa, uma por plataforma e a de contato, no
 * mesmo molde (pedido do usuário, 18/11/2026). Claro ou escuro pela
 * preferência da pessoa. As demonstrações usam o produto de verdade.
 */
export function SiteApp() {
  // Tema: a escolha da pessoa (guardada) vale sobre a preferência do sistema.
  const [modo, setModo] = useState<ModoCor>(() => {
    try {
      const salvo = localStorage.getItem('heild-tema')
      if (salvo === 'claro' || salvo === 'escuro') return salvo
    } catch {
      /* sem armazenamento: segue o sistema */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
  })
  const escolheu = useRef(false)
  /** Troca o tema numa onda que nasce no botão e cobre a página (View Transitions); sem suporte, um esmaecer. */
  const trocarModo = (origem?: HTMLElement | null) => {
    const novo: ModoCor = modo === 'escuro' ? 'claro' : 'escuro'
    escolheu.current = true
    try {
      localStorage.setItem('heild-tema', novo)
    } catch {
      /* segue sem guardar */
    }
    const doc = document as Document & { startViewTransition?: (f: () => void) => unknown }
    const parado = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || parado) {
      document.documentElement.classList.add('tema-esmaece')
      setModo(novo)
      window.setTimeout(() => document.documentElement.classList.remove('tema-esmaece'), 450)
      return
    }
    const r = origem?.getBoundingClientRect()
    const x = r ? r.left + r.width / 2 : window.innerWidth - 40
    const y = r ? r.top + r.height / 2 : 32
    const raio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const raiz = document.documentElement
    raiz.style.setProperty('--onda-x', `${x}px`)
    raiz.style.setProperty('--onda-y', `${y}px`)
    raiz.style.setProperty('--onda-r', `${raio}px`)
    raiz.dataset.ondaPara = novo
    // A captura da transição não leva o desfoque do cabeçalho: durante a onda ele fica opaco, e a página não aparece nítida por trás.
    raiz.classList.add('trocando-tema')
    const vt = doc.startViewTransition(() => flushSync(() => setModo(novo))) as { finished?: Promise<void> } | undefined
    const tirar = () => raiz.classList.remove('trocando-tema')
    if (vt?.finished) vt.finished.then(tirar, tirar)
    else window.setTimeout(tirar, 1100)
  }
  const [rota, setRota] = useState<Rota>(rotaDaHash)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const ouvir = (e: MediaQueryListEvent) => !escolheu.current && setModo(e.matches ? 'escuro' : 'claro')
    mq?.addEventListener('change', ouvir)
    const trocar = () => {
      setRota(rotaDaHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', trocar)
    return () => {
      mq?.removeEventListener('change', ouvir)
      window.removeEventListener('hashchange', trocar)
    }
  }, [])
  const plataforma = plataformas.find((p) => p.id === rota)
  // A luz do cursor: cada área marcada (grade de pontos, painéis) sabe onde o cursor está.
  // No toque, a luz nasce onde o dedo encosta, acompanha enquanto ele arrasta e some devagar quando ele sai.
  useEffect(() => {
    const marcar = (e: PointerEvent) => {
      const el = e.target as Element | null
      const alvos = [el?.closest?.('[data-luz]'), el?.closest?.('.grade-pontos')].filter(Boolean) as HTMLElement[]
      for (const alvo of alvos) {
        const r = alvo.getBoundingClientRect()
        alvo.style.setProperty('--mx', `${e.clientX - r.left}px`)
        alvo.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      return alvos
    }
    const tocados = new Set<HTMLElement>()
    const mover = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return void marcar(e)
      if (tocados.size) marcar(e)
    }
    const tocar = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      for (const a of marcar(e)) {
        a.dataset.toque = ''
        tocados.add(a)
      }
    }
    const soltar = () => {
      for (const a of tocados) delete a.dataset.toque
      tocados.clear()
    }
    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('pointerdown', tocar, { passive: true })
    window.addEventListener('pointerup', soltar, { passive: true })
    window.addEventListener('pointercancel', soltar, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerdown', tocar)
      window.removeEventListener('pointerup', soltar)
      window.removeEventListener('pointercancel', soltar)
    }
  }, [])
  return (
    <ThemeProvider tema={temaFabrica} modo={modo}>
      <div className="site bg-background text-foreground min-h-dvh" data-modo={modo} style={{ ['--grade-ponto' as string]: modo === 'escuro' ? '#3a3735' : '#d9d2cc' }}>
        <a href="#conteudo" className="bg-primary text-primary-foreground sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Pular para o conteúdo
        </a>
        <Navegacao rota={rota} modo={modo} onTrocarModo={trocarModo} />
        <BarraRolagem />
        <main id="conteudo" className="pt-16">
          {rota === 'contato' ? <PaginaContato /> : plataforma ? <PaginaPlataforma p={plataforma} /> : <PaginaInicio />}
        </main>
        {rota === 'contato' && <Rodape />}
      </div>
    </ThemeProvider>
  )
}

/* ---------------- peças comuns ---------------- */

const Wrap = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn('wrap mx-auto w-[min(1216px,calc(100%-32px))] sm:w-[min(1216px,calc(100%-48px))]', className)}>{children}</div>

function BotaoDemonstracao({ className }: { className?: string }) {
  return (
    <a href="#contato" className={cn('botao bg-primary text-primary-foreground inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap hover:bg-primary/90', className)}>
      Agendar uma demonstração
    </a>
  )
}

function Logo({ animacao, largura = 104, loop, rotulo }: { animacao?: string; largura?: number; loop?: boolean; rotulo?: string }) {
  return <heild-logo animation={animacao ?? 'none'} loop={loop ? '' : undefined} label={rotulo ?? 'Heild'} style={{ width: largura, color: 'var(--primary)' }} />
}

const linksNav: [string, string][] = [
  ['Como funciona', 'demo'],
  ['O time', 'time'],
  ['Sobre', 'inteiro'],
  ['Perguntas', 'perguntas'],
]

function Navegacao({ rota, modo, onTrocarModo }: { rota: Rota; modo: ModoCor; onTrocarModo: (origem?: HTMLElement | null) => void }) {
  const [rolou, setRolou] = useState(false)
  const [solucoes, setSolucoes] = useState(false)
  const [menu, setMenu] = useState(false)
  const fechar = useRef<number>(0)
  const caixa = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const f = () => setRolou(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && (setSolucoes(false), setMenu(false))
    const fora = (e: PointerEvent) => !caixa.current?.contains(e.target as Node) && setSolucoes(false)
    window.addEventListener('keydown', esc)
    window.addEventListener('pointerdown', fora)
    return () => {
      window.removeEventListener('scroll', f)
      window.removeEventListener('keydown', esc)
      window.removeEventListener('pointerdown', fora)
    }
  }, [])
  useEffect(() => {
    setSolucoes(false)
    setMenu(false)
  }, [rota])
  const abrir = () => (window.clearTimeout(fechar.current), setSolucoes(true))
  const soltar = () => (fechar.current = window.setTimeout(() => setSolucoes(false), 160))
  const link = 'sublinha text-muted-foreground hover:text-foreground cursor-pointer'
  return (
    <header className={cn('cabecalho fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300', menu ? 'border-border bg-background' : rolou ? 'border-border bg-background/85 backdrop-blur-xl' : 'border-transparent')}>
      <Wrap className="flex h-16 items-center gap-8">
        <a href="#" aria-label="Heild, página inicial" className="shrink-0" onClick={() => ir('inicio')}>
          <Logo largura={92} />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm whitespace-nowrap lg:flex">
          <div ref={caixa} className="relative" onPointerEnter={(e) => e.pointerType === 'mouse' && abrir()} onPointerLeave={(e) => e.pointerType === 'mouse' && soltar()}>
            <button type="button" aria-expanded={solucoes} aria-controls="menu-solucoes" onClick={(e) => setSolucoes((v) => (e.detail === 0 || !matchMedia('(hover: hover)').matches ? !v : true))} className={cn('flex cursor-pointer items-center gap-1', solucoes || rota === 'contabil' || rota === 'bpo' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              Soluções <CaretDownIcon className={cn('size-3.5 transition-transform duration-200', solucoes && 'rotate-180')} />
            </button>
            <div id="menu-solucoes" data-aberto={solucoes} className="menu-solucoes absolute top-full -left-5 pt-4">
              <div className="bg-raised shadow-painel flex w-[560px] flex-col gap-1 rounded-[24px] p-2">
                {plataformas.map((p) => (
                  <ItemSolucao key={p.id} p={p} atual={rota === p.id} />
                ))}
                <div className="text-muted-foreground flex items-center justify-between gap-4 px-4 pt-3 pb-2 text-sm">
                  <span>As duas plataformas sobre o mesmo cadastro.</span>
                  <a href="#contato" className="sublinha text-foreground font-medium">
                    Falar com a gente
                  </a>
                </div>
              </div>
            </div>
          </div>
          {linksNav.map(([r, id]) => (
            <button key={id} type="button" onClick={() => irSecao(id)} className={link}>
              {r}
            </button>
          ))}
        </nav>
        <BotaoDemonstracao className="ml-auto h-10 max-[400px]:hidden" />
        {/* O tema é sempre o último à direita: no desktop largo fica no canto, fora da coluna; até 1340 px, logo depois do botão de agendar. */}
        <BotaoTema modo={modo} onTrocar={onTrocarModo} className="-mr-2 -ml-5 hidden lg:max-[1339px]:flex" />
        <button type="button" aria-expanded={menu} aria-controls="menu-movel" aria-label={menu ? 'Fechar o menu' : 'Abrir o menu'} onClick={() => setMenu((v) => !v)} className="botao -mr-2 flex size-11 cursor-pointer items-center justify-center rounded-full max-[400px]:ml-auto lg:hidden">
          {menu ? <XIcon className="size-5" /> : <ListIcon className="size-5" />}
        </button>
      </Wrap>
      {/* No desktop largo, o tema fica no canto superior direito, fora da coluna do cabeçalho. */}
      <BotaoTema modo={modo} onTrocar={onTrocarModo} className="absolute top-3 right-4 hidden min-[1340px]:flex" />
      {menu && (
        <nav id="menu-movel" aria-label="Menu" className="menu-movel border-border border-t lg:hidden">
          <Wrap className="flex flex-col gap-1 py-4">
            <span className="text-muted-foreground px-1 pb-1 text-sm">Soluções</span>
            {plataformas.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="flex h-12 items-center rounded-[14px] px-1 text-lg">
                {p.nome}
              </a>
            ))}
            <div className="bg-border my-2 h-px" />
            {linksNav.map(([r, id]) => (
              <button key={id} type="button" onClick={() => (setMenu(false), irSecao(id))} className="flex h-12 cursor-pointer items-center px-1 text-left text-lg">
                {r}
              </button>
            ))}
            <BotaoTema modo={modo} onTrocar={onTrocarModo} rotulo={modo === 'escuro' ? 'Tema claro' : 'Tema escuro'} className="-ml-2 h-12 w-auto justify-start gap-3 rounded-[14px] pr-3 pl-2 text-lg" />
            <BotaoDemonstracao className="mt-3 h-12 w-full" />
          </Wrap>
        </nav>
      )}
    </header>
  )
}

/** Sol e lua no mesmo desenho: os raios recolhem girando e uma sombra desliza sobre o disco para formar a lua. */
function BotaoTema({ modo, onTrocar, rotulo, className }: { modo: ModoCor; onTrocar: (origem?: HTMLElement | null) => void; rotulo?: string; className?: string }) {
  const escuro = modo === 'escuro'
  // Um id de máscara por botão: o mesmo botão aparece em mais de um lugar (escondido conforme a largura).
  const mascara = `tema-sombra-${useId().replace(/:/g, '')}`
  return (
    <button
      type="button"
      // A onda nasce no ícone, também quando o botão tem rótulo (no menu do celular).
      onClick={(e) => onTrocar(e.currentTarget.querySelector('svg') as unknown as HTMLElement)}
      aria-label={rotulo ? undefined : escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      data-escuro={escuro}
      className={cn('botao-tema text-foreground hover:bg-sunken relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors', className)}
    >
      <svg viewBox="0 0 24 24" className="size-[22px] overflow-visible" aria-hidden>
        <mask id={mascara}>
          <rect x="-4" y="-4" width="32" height="32" fill="#fff" />
          <circle className="tema-sombra" cx="18" cy="6" r="7.5" fill="#000" />
        </mask>
        <circle className="tema-disco" cx="12" cy="12" r="5" fill="currentColor" mask={`url(#${mascara})`} />
        <g className="tema-raios" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            return <line key={i} x1={12 + Math.cos(a) * 8} y1={12 + Math.sin(a) * 8} x2={12 + Math.cos(a) * 10.2} y2={12 + Math.sin(a) * 10.2} />
          })}
        </g>
      </svg>
      {rotulo}
    </button>
  )
}

function ItemSolucao({ p, atual }: { p: Plataforma; atual: boolean }) {
  const logo = useRef<HeildLogoElement>(null)
  return (
    <a href={`#${p.id}`} aria-current={atual ? 'page' : undefined} onPointerEnter={() => logo.current?.follow?.(p.animacao, true)} onPointerLeave={() => logo.current?.follow?.(p.animacao, false)} onFocus={() => logo.current?.follow?.(p.animacao, true)} onBlur={() => logo.current?.follow?.(p.animacao, false)} className="hover:bg-sunken grid grid-cols-[120px_1fr] items-center gap-4 rounded-[18px] p-4 transition-colors">
      <span style={{ color: 'var(--primary)' }}>
        <heild-logo ref={logo} label={p.nome} style={{ width: 110 }} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-base font-medium">{p.nome}</span>
        <span className="text-muted-foreground text-sm leading-snug">{p.resumo}</span>
      </span>
    </a>
  )
}

function Secao({ id, titulo, texto, children, className, grade, extra, visual, seletor }: { id: string; titulo: ReactNode; texto?: ReactNode; children?: ReactNode; className?: string; grade?: boolean; extra?: ReactNode; visual?: ReactNode; seletor?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useVisto(ref, { limiar: 0.15 })
  if (visual)
    return (
      <section id={id} aria-labelledby={`${id}-t`} className={cn('flex min-h-[100svh] scroll-mt-16 flex-col justify-center py-16 lg:py-14', grade && 'grade-pontos', className)}>
        <Wrap>
          <MoldeVisual refRevela={ref} visto={visto} cabeca={<Cabeca id={id} titulo={titulo} texto={texto} />} seletor={seletor} visual={visual}>
            {children}
          </MoldeVisual>
        </Wrap>
      </section>
    )
  return (
    <section id={id} aria-labelledby={`${id}-t`} className={cn('flex min-h-[100svh] scroll-mt-16 flex-col justify-center py-16 lg:py-14', grade && 'grade-pontos', className)}>
      <Wrap>
        <div ref={ref} data-visto={visto} className="revela flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2 id={`${id}-t`} className="font-heading text-3xl font-light tracking-[-0.025em] text-balance sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                {titulo}
              </h2>
              {texto && <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">{texto}</p>}
            </div>
            {extra}
          </div>
          {children}
        </div>
      </Wrap>
    </section>
  )
}

function Cabeca({ id, titulo, texto }: { id: string; titulo: ReactNode; texto?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 id={`${id}-t`} className="font-heading text-3xl font-light tracking-[-0.025em] text-balance sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {titulo}
      </h2>
      {texto && <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">{texto}</p>}
    </div>
  )
}

/** Os componentes do produto fora da demonstração (o time, o cartão de aprovação): a mesma loja, sem trabalho rodando. */
function Vitrine({ children }: { children: ReactNode }) {
  return (
    <SessaoProvider inicial="u1">
      <LojaProvider>
        <NavegacaoProvider value={{ irPara: () => {}, vitrine: 'leitura' }}>
          <FluxosProvider>
            <DocumentosProvider>{children}</DocumentosProvider>
          </FluxosProvider>
        </NavegacaoProvider>
      </LojaProvider>
    </SessaoProvider>
  )
}

/* ---------------- hero e desenho das camadas ---------------- */

export interface Legenda {
  setor: Integrante['setor']
  /** Estado do integrante no cartão: o orb reage do jeito dele (trabalhando, pensando, esperando você, concluído). */
  estado: EstadoIntegrante
  texto: string
}

/**
 * O hero: o título entra saindo do desfoque e, atrás dele, a luz do time (uma
 * cor por integrante) se junta numa faixa só. A legenda conta o que o time
 * acabou de fazer, e a cor de quem fez acende na faixa.
 */
function Hero({ titulo, frase, setores, legendas, topo }: { titulo: string; frase: ReactNode; setores: Integrante['setor'][]; legendas: Legenda[]; topo?: ReactNode }) {
  const aparencia = useAparencia()
  const daSetor = (s: Integrante['setor']) => aparencia(exemplo.integrantes.find((i) => i.setor === s) as Integrante)
  const cores = setores.map((s) => (s === ('destaque' as Integrante['setor']) ? '#4f5bf5' : daSetor(s).cor))
  const [k, setK] = useState(0)
  const n = legendas.length
  useEffect(() => {
    const id = window.setInterval(() => setK((x) => (x + 1) % legendas.length), 3600)
    return () => window.clearInterval(id)
  }, [legendas.length])
  const l = legendas[k]
  return (
    <section className="hero relative isolate -mt-16 overflow-hidden pt-16" aria-labelledby="hero-t">
      <Luz cores={cores} ativa={setores.indexOf(l.setor)} />
      <Wrap className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-7 py-16 text-center">
        {topo}
        <h1 id="hero-t" className="titulo-hero font-heading max-w-5xl text-[44px] leading-[1.02] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-[84px]">
          {titulo.split(' ').map((p, i) => (
            <span key={i} className="palavra" style={{ ['--i' as string]: i }}>
              {p}{' '}
            </span>
          ))}
        </h1>
        <p className="entra-tarde text-foreground/75 max-w-2xl text-lg leading-[1.45] tracking-[-0.01em] text-pretty sm:text-[21px]">{frase}</p>
        <div className="entra-tarde flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={{ animationDelay: '0.9s' }}>
          <BotaoDemonstracao className="h-12 px-6 text-base" />
          <button type="button" onClick={() => rolarPara('demo')} className="sublinha cursor-pointer text-sm font-medium">
            Ver o time trabalhando
          </button>
        </div>
        {/* Os cartões ficam todos montados e trocam por transição: o de agora sobe, o próximo chega por baixo, sem corte. */}
        <div className="entra-tarde relative mt-6 h-11 w-full" style={{ animationDelay: '1.3s' }} aria-live="polite">
          {legendas.map((x, i) => {
            const quem = daSetor(x.setor)
            const pos = i === k ? 'agora' : i === (k - 1 + n) % n ? 'saiu' : 'vem'
            return (
              <span key={i} data-pos={pos} aria-hidden={pos !== 'agora'} className="legenda bg-background/70 shadow-contorno absolute top-0 left-1/2 flex max-w-full items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm whitespace-nowrap backdrop-blur-md">
                <span className="size-7 shrink-0">
                  <Orb cor={quem.cor} corOlhos={quem.corOlhos} tamanho={28} extras={false} cutucavel={false} estado={x.estado} animado={pos === 'agora'} />
                </span>
                <span className="min-w-0 truncate">
                  <span className="font-medium">{quem.nome}</span> <span className="text-muted-foreground">{x.texto}</span>
                </span>
              </span>
            )
          })}
        </div>
      </Wrap>
    </section>
  )
}

/* ---------------- seções ---------------- */

function SecaoDemo({ escolhas, titulo, texto }: { escolhas: Plataforma[]; titulo: ReactNode; texto: ReactNode }) {
  const [atual, setAtual] = useState(escolhas[0].id)
  const [etapa, setEtapa] = useState(0)
  const p = escolhas.find((x) => x.id === atual) ?? escolhas[0]
  const ref = useRef<HTMLDivElement>(null)
  const visto = useVisto(ref, { limiar: 0.15 })
  return (
    <section id="demo" aria-labelledby="demo-t" className="faixa-suave flex min-h-[100svh] scroll-mt-16 flex-col justify-center py-16 lg:py-12">
      <Wrap>
        <MoldeVisual
          refRevela={ref}
          visto={visto}
          cabeca={<Cabeca id="demo" titulo={titulo} texto={texto} />}
          seletor={
            escolhas.length > 1 ? (
              <div role="tablist" aria-label="Plataforma da demonstração" className="bg-sunken inset-shadow-trilho inline-flex w-fit gap-0.5 rounded-full p-[3px]">
                {escolhas.map((x) => (
                  <button
                    key={x.id}
                    role="tab"
                    type="button"
                    aria-selected={x.id === atual}
                    onClick={() => (setAtual(x.id), setEtapa(0))}
                    className={cn('botao cursor-pointer rounded-full px-4 py-1.5 text-sm', x.id === atual ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground hover:text-foreground')}
                  >
                    {x.nome.replace('Heild ', '')}
                  </button>
                ))}
              </div>
            ) : undefined
          }
          visual={
            // key: trocar de plataforma começa uma demonstração nova.
            <div data-luz className="h-[620px] rounded-[28px] lg:h-[min(700px,calc(100svh-112px))]">
              <DemoGuiada key={p.id} roteiro={roteiros[p.id]} setores={p.demo.setores} onEtapa={setEtapa} />
            </div>
          }
        >
          {/* As guias das duas plataformas reservam a mesma altura: trocar de plataforma não mexe a coluna. */}
          <ReservaAltura variantes={escolhas.filter((x) => x.id !== p.id).map((x) => <ListaGuia key={x.id} guia={roteiros[x.id].guia} etapa={0} />)}>
            <ListaGuia guia={roteiros[p.id].guia} etapa={etapa} />
          </ReservaAltura>
        </MoldeVisual>
      </Wrap>
    </section>
  )
}

function ListaGuia({ guia, etapa }: { guia: [string, string][]; etapa: number }) {
  return (
    <ol className="flex flex-col gap-1" aria-label="O caminho da demonstração">
      {guia.map(([t, d], i) => {
        const feito = etapa > i
        const agora = etapa === i
        return (
          <li key={t} aria-current={agora ? 'step' : undefined} className={cn('passo-guia flex gap-4 rounded-[18px] p-3 transition-colors duration-300', agora && 'bg-background shadow-contorno')}>
            <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300', feito ? 'bg-foreground text-background' : agora ? 'bg-primary text-primary-foreground' : 'bg-sunken text-muted-foreground')}>
              {feito ? <CheckIcon className="size-3.5" weight="bold" /> : i + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className={cn('text-base font-medium transition-colors', !feito && !agora && 'text-muted-foreground')}>{t}</span>
              <span className="text-muted-foreground text-sm leading-relaxed">{d}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function SecaoPlataformas({ menos }: { menos?: string }) {
  const lista = plataformas.filter((p) => p.id !== menos)
  return (
    <Secao
      id="plataformas"
      titulo={menos ? 'Conheça as outras plataformas.' : 'Uma Heild para cada operação.'}
      texto={menos ? undefined : 'Cada plataforma tem o seu time e o seu Painel, sobre o mesmo cadastro, os mesmos documentos e o mesmo CRM.'}
      grade
      className="min-h-0 py-24 lg:py-28"
    >
      <div className="flex flex-col gap-3">
        {lista.map((p, i) => (
          <LinhaPlataforma key={p.id} p={p} i={i} />
        ))}
      </div>
    </Secao>
  )
}

/** Toca a forma do I uma vez; se a anterior ainda está tocando, não recomeça (recomeçar no meio corta seco). */
function tocarUmaVez(logo: HeildLogoElement | null, nome: string, tocando: { current: boolean }) {
  if (!logo?.play || tocando.current) return
  tocando.current = true
  const fim = () => void (tocando.current = false)
  Promise.resolve(logo.play(nome)).then(fim, fim)
}

function LinhaPlataforma({ p, i = 0 }: { p: Plataforma; i?: number }) {
  const logo = useRef<HeildLogoElement>(null)
  const linha = useRef<HTMLAnchorElement>(null)
  // Toca toda vez que a plataforma entra na tela ao rolar (não só na primeira): no celular não há hover para chamar a animação.
  const visto = useVisto(linha, { limiar: 0.6, sempre: true })
  const tocando = useRef(false)
  useEffect(() => {
    if (!visto) return
    // Só toca de novo depois que a anterior terminou: sair e voltar rápido não recomeça a animação no meio (sem corte).
    const id = window.setTimeout(() => tocarUmaVez(logo.current, p.animacao, tocando), 300 + i * 400)
    return () => window.clearTimeout(id)
  }, [visto, i, p.animacao])
  return (
    <a
      ref={linha}
      href={`#${p.id}`}
      onPointerEnter={() => logo.current?.follow?.(p.animacao, true)}
      onPointerLeave={() => logo.current?.follow?.(p.animacao, false)}
      onFocus={() => logo.current?.follow?.(p.animacao, true)}
      onBlur={() => logo.current?.follow?.(p.animacao, false)}
      data-luz className="levanta bg-surface shadow-cartao group grid items-center gap-5 rounded-[24px] p-6 sm:grid-cols-[180px_1fr_auto] sm:gap-8 sm:p-8"
    >
      <span className="flex items-center justify-center rounded-[18px] px-2 py-4" style={{ color: 'var(--primary)' }}>
        <heild-logo ref={logo} label={p.nome} style={{ width: 140 }} />
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="font-heading text-2xl font-light tracking-[-0.025em]">{p.nome}</span>
        <span className="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">{p.resumo}</span>
      </span>
      <span className="flex items-center gap-1.5 text-sm font-medium">
        Conhecer <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  )
}

function SecaoTime({ setores, titulo, texto }: { setores: string[]; titulo: ReactNode; texto: ReactNode }) {
  const aparencia = useAparencia()
  const lista = exemplo.integrantes.filter((i) => i.tipo !== 'criado_pelo_usuario' && setores.includes(i.setor))
  const [id, setId] = useState(lista.find((i) => (exemplo.conversasPorIntegrante[i.id] ?? []).length > 0)?.id ?? lista[0].id)
  const atual = lista.find((i) => i.id === id) ?? lista[0]
  // Uma foto do chat: a conversa pronta, inteira, sem tocar de novo. Cada integrante no estado em que está.
  const conversa = useMemo(() => (exemplo.conversasPorIntegrante[atual.id] ?? []).slice(-4), [atual.id])
  return (
    <Secao
      id="time"
      titulo={titulo}
      texto={texto}
      visual={
        <div data-luz className="bg-background shadow-painel flex h-[520px] flex-col gap-4 overflow-hidden rounded-[28px] p-5 sm:h-[min(680px,calc(100svh-120px))] sm:min-h-[460px] sm:p-6">
          <CabecalhoIntegrante nivel="h3" integrante={{ ...atual, fazendoAgora: [], fila: 0, pendentes: cartoesPendentes(exemplo.conversasPorIntegrante[atual.id] ?? [], {}) }} className="bg-surface shadow-contorno rounded-[22px] px-3 py-2.5 sm:px-4" />
          <div key={atual.id} className="area-rolagem-dupla min-h-0 flex-1 overflow-y-auto pr-1">
            {/* A entrada fica por dentro: na própria área de rolagem ela substituiria a animação do esmaecido. */}
            <div className="entra">{conversa.length ? <ListaMensagens mensagens={conversa} /> : <p className="text-muted-foreground text-sm">Ainda sem conversa nesta demonstração.</p>}</div>
          </div>
        </div>
      }
      seletor={
        <div role="tablist" aria-label="Integrantes" className="flex flex-wrap gap-2">
          {lista.map((i) => {
            const t = aparencia(i)
            return (
              <button
                key={i.id}
                role="tab"
                type="button"
                aria-selected={i.id === atual.id}
                title={`${t.nome}: ${rotuloDoEstado[i.estado].toLowerCase()}`}
                onClick={() => setId(i.id)}
                className={cn('botao flex h-11 cursor-pointer items-center gap-2 rounded-full pr-4 pl-1.5 text-sm transition-colors', i.id === atual.id ? 'bg-primary text-primary-foreground' : 'bg-surface shadow-contorno hover:bg-raised')}
              >
                {/* Cada orb com a animação do próprio estado: trabalhando, esperando você, livre, dormindo. */}
                <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={30} extras={false} cutucavel={false} estado={i.estado} animado />
                {t.nome}
                {i.estado === 'precisa_de_voce' && <span className="bg-highlight size-1.5 rounded-full" aria-label=", espera você" />}
              </button>
            )
          })}
        </div>
      }
    >
      {/* A frase de cada integrante reserva a altura da mais longa: trocar de integrante não mexe o título nem o texto da seção. */}
      <ReservaAltura variantes={lista.filter((i) => i.id !== atual.id).map((i) => <FuncaoIntegrante key={i.id} i={i} />)}>
        <FuncaoIntegrante key={atual.id} i={atual} entra />
      </ReservaAltura>
    </Secao>
  )
}

function FuncaoIntegrante({ i, entra }: { i: Integrante; entra?: boolean }) {
  const aparencia = useAparencia()
  return (
    <p className={cn('text-muted-foreground text-base leading-relaxed', entra && 'entra')}>
      <span className="text-foreground font-medium">{aparencia(i).nome}</span>: {i.funcao.charAt(0).toLowerCase() + i.funcao.slice(1)}.
    </p>
  )
}

function SecaoAprovacao() {
  return (
    <Secao
      id="aprovacao"
      titulo="O cartão de aprovação: a IA prepara, uma pessoa decide."
      texto="Transmitir, pagar, assinar e enviar ao cliente sempre passam por um cartão como este, no chat, no Painel ou no celular."
      className="faixa-suave"
      visual={
        <div data-luz className="bg-background rounded-[28px] p-4 sm:p-10">
          <AprovacaoAoVivo />
        </div>
      }
    >
      <Pares
        itens={[
          ['O integrante faz sozinho', 'Ler a caixa postal, conciliar o extrato, montar a guia, cobrar o documento.'],
          ['Passa por você', 'Transmitir a declaração, liberar o pagamento, assinar o contrato, mandar a guia ao cliente.'],
          ['Fica registrado', 'Quem aprovou, quando e o que foi feito depois, na tarefa e no histórico do cliente.'],
        ]}
      />
    </Secao>
  )
}

function Pares({ itens }: { itens: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-5">
      {itens.map(([t, d]) => (
        <div key={t} className="flex flex-col gap-1">
          <dt className="text-base font-medium">{t}</dt>
          <dd className="text-muted-foreground text-base leading-relaxed">{d}</dd>
        </div>
      ))}
    </dl>
  )
}

function SecaoLei() {
  const [k, setK] = useState(0)
  return (
    <Secao id="lei" titulo="O Consultor responde sobre a lei com o artigo e a data." texto="Pergunte como a um colega. A resposta vem pela redação que vale na data do fato, com o trecho citado e o grau de segurança." visual={<LeiAoVivo k={k} />}
      seletor={
        <div role="tablist" aria-label="Pergunta ao Consultor" className="flex flex-wrap gap-2">
          {rotulosLei.map((r, i) => (
            <button
              key={r}
              role="tab"
              type="button"
              aria-selected={k === i}
              onClick={() => setK(i)}
              className={cn('botao h-11 cursor-pointer rounded-full px-4 text-sm transition-colors', k === i ? 'bg-primary text-primary-foreground' : 'bg-surface shadow-contorno hover:bg-raised')}
            >
              <span className="so-largo">{r}</span>
              <span className="so-curto">{['Fator R', 'Sublimite'][i]}</span>
            </button>
          ))}
        </div>
      }
    >
      <Pares
        itens={[
          ['O artigo e a data', 'Cada afirmação aponta para a redação vigente na data considerada, não para a de hoje.'],
          ['O trecho citado', 'O texto da lei vem junto, para conferir em segundos.'],
          ['O grau de segurança', 'Alto, médio ou baixo. Sem base suficiente, ele diz que não encontrou.'],
        ]}
      />
    </Secao>
  )
}

/**
 * O momento da página: as peças da Heild chegam soltas e se encaixam sob a logo,
 * que centraliza. Depois disso continua vivo: as peças flutuam, fogem um pouco do
 * cursor, e passar sobre uma delas transforma o I na forma daquela área.
 */
const pecasInteiro: [string, string][] = [
  ['Painel', 'painel'],
  ['CRM', 'conversa'],
  ['Timesheet', 'tempo'],
  ['Financeiro', 'financeiro'],
  ['BPO', 'bpo'],
  ['Arquivos', 'arquivos'],
  ['App do cliente', 'celular'],
  ['Assistente', 'orb'],
  ['Consultor', 'lupa'],
  ['Integrantes', 'orbs'],
  ['IA e Agentes', 'ia'],
]
function SecaoInteiro() {
  const soltas = [
    [-380, -170, -8],
    [-120, -210, 6],
    [230, -180, -5],
    [410, -40, 9],
    [330, 150, -7],
    [60, 200, 5],
    [-260, 170, 8],
    [-430, 30, -6],
    [-200, -70, 4],
    [190, 40, -9],
    [-470, -110, 7],
  ]
  const [junto, setJunto] = useState(false)
  const [vivo, setVivo] = useState(false)
  const [sobre, setSobre] = useState<number | null>(null)
  const caixa = useRef<HTMLDivElement>(null)
  const logo = useRef<HeildLogoElement>(null)
  const tocandoInteiro = useRef(false)
  const pecas = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setJunto(true)
    const el = caixa.current
    if (!el) return
    // A primeira vez as peças se encaixam; depois disso, voltar à seção ao rolar toca a centralização de novo.
    let primeira = true
    let saiu = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return void (saiu = true)
        if (primeira) {
          primeira = false
          setJunto(true)
          window.setTimeout(() => tocarUmaVez(logo.current, 'centralizar', tocandoInteiro), 500)
          window.setTimeout(() => setVivo(true), 1900)
        } else if (saiu) {
          saiu = false
          setSobre(null)
          window.setTimeout(() => tocarUmaVez(logo.current, 'centralizar', tocandoInteiro), 250)
        }
      },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // Depois do encaixe: cada peça flutua no seu ritmo e se afasta do cursor quando ele chega perto.
  useEffect(() => {
    if (!vivo) return
    const el = caixa.current
    if (!el) return
    let cx = -9999
    let cy = -9999
    const mover = (e: PointerEvent) => {
      cx = e.clientX
      cy = e.clientY
    }
    const sair = () => ((cx = -9999), (cy = -9999))
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', sair)
    const off = pecas.current.map(() => ({ x: 0, y: 0 }))
    const t0 = performance.now()
    let raf = 0
    const quadro = (agora: number) => {
      raf = requestAnimationFrame(quadro)
      const t = (agora - t0) / 1000
      pecas.current.forEach((p, i) => {
        if (!p) return
        const r = p.getBoundingClientRect()
        const dx = r.left + r.width / 2 - off[i].x - cx
        const dy = r.top + r.height / 2 - off[i].y - cy
        const d = Math.hypot(dx, dy)
        const forca = d < 150 ? (1 - d / 150) ** 2 * 18 : 0
        const alvoX = Math.sin(t * 0.9 + i * 1.3) * 3 + (d ? (dx / d) * forca : 0)
        const alvoY = Math.sin(t * 1.2 + i * 2.1) * 5 + (d ? (dy / d) * forca : 0)
        off[i].x += (alvoX - off[i].x) * 0.12
        off[i].y += (alvoY - off[i].y) * 0.12
        p.style.translate = `${off[i].x.toFixed(2)}px ${off[i].y.toFixed(2)}px`
      })
    }
    raf = requestAnimationFrame(quadro)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', sair)
    }
  }, [vivo])
  // A forma do I segue a peça sob o cursor (morph parte do desenho atual: chacoalhar o mouse não corta).
  const passar = (i: number | null) => {
    setSobre(i)
    atual.current = i
    logo.current?.morph?.(i === null ? null : pecasInteiro[i][1])
  }
  // A seleção automática: sem cursor nem toque, uma peça é escolhida ao acaso a cada poucos segundos (nunca a mesma
  // duas vezes seguidas) e o I vira a forma dela. A mão da pessoa pausa o automático, que volta depois de um tempo parado.
  const atual = useRef<number | null>(null)
  const ultimaMao = useRef(0)
  const mao = () => void (ultimaMao.current = performance.now())
  const naTela = useVisto(caixa, { limiar: 0.3, sempre: true })
  useEffect(() => {
    if (!vivo || !naTela || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (performance.now() - ultimaMao.current < 6000) return
      let i = Math.floor(Math.random() * pecasInteiro.length)
      if (i === atual.current) i = (i + 1 + Math.floor(Math.random() * (pecasInteiro.length - 1))) % pecasInteiro.length
      passar(i)
    }, 3600)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vivo, naTela])
  return (
    <Secao
      id="inteiro"
      titulo="Heild, um sistema no lugar de vinte."
      texto="Heild vem do nórdico heild, o inteiro. Prazos, conversas, horas, arquivos, cobrança e o financeiro dos clientes passam a morar no mesmo lugar, sobre o mesmo cadastro."
      grade
    >
      <div ref={caixa} data-visual data-junto={junto} data-vivo={vivo} className="junta flex min-h-[440px] flex-col items-center justify-center gap-10 rounded-[28px] py-16" style={{ color: 'var(--primary)' }}>
        <heild-logo ref={logo} label="Heild" style={{ width: 'min(360px, 64vw)' }} />
        <ul className="flex max-w-2xl flex-wrap justify-center gap-2.5" aria-label="O que a Heild junta" onPointerLeave={(e) => e.pointerType === 'mouse' && (mao(), passar(null))}>
          {pecasInteiro.map(([m], i) => (
            <li
              key={m}
              ref={(n) => void (pecas.current[i] = n)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && vivo && (mao(), passar(i))}
              // No toque, um toque escolhe a peça (e outro toque na mesma volta à pílula): sem precisar segurar.
              onClick={() => vivo && (mao(), passar(sobre === i ? null : i))}
              data-sobre={sobre === i || undefined}
              className="peca rounded-full px-4 py-2 text-sm select-none"
              style={{ ['--dx' as string]: `${soltas[i][0]}px`, ['--dy' as string]: `${soltas[i][1]}px`, ['--r' as string]: `${soltas[i][2]}deg`, ['--i' as string]: i }}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  )
}

function SecaoPerguntas({ itens }: { itens: [string, string][] }) {
  return (
    <Secao id="perguntas" titulo="Perguntas frequentes sobre a Heild." className="faixa-suave min-h-0 justify-start pt-28 pb-24 lg:pt-28 lg:pb-28">
      <div className="divide-border flex flex-col divide-y border-y">
        {itens.map(([q, r]) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium sm:text-lg">
              {q}
              <span aria-hidden className="text-muted-foreground text-xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-relaxed">{r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}

/** O fim de cada página: o fechamento e o rodapé dividem uma tela. */
function Encerramento({ titulo }: { titulo: string }) {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <Fechamento titulo={titulo} />
      <Rodape />
    </div>
  )
}

function Fechamento({ titulo }: { titulo: string }) {
  const aparencia = useAparencia()
  const cores = useMemo(() => (['contabil', 'fiscal', 'dp', 'gestao_atendimento', 'bpo_pagar'] as const).map((s) => aparencia(exemplo.integrantes.find((i) => i.setor === s) as Integrante).cor), [aparencia])
  return (
    <section className="relative isolate flex flex-1 items-center overflow-hidden py-20" aria-labelledby="fecha-t">
      <Luz cores={cores} intensidade={0.7} juntar={false} />
      <Wrap className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="fecha-t" className="font-heading max-w-2xl text-3xl font-light tracking-[-0.025em] text-balance sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
          {titulo}
        </h2>
        <BotaoDemonstracao className="h-12 px-6 text-base" />
      </Wrap>
    </section>
  )
}

function Rodape() {
  return (
    <footer id="contato-rodape" className="border-t py-14">
      <Wrap className="grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-16">
        <div className="flex flex-col gap-3">
          <Logo largura={96} />
          <p className="text-muted-foreground max-w-xs text-sm">O inteiro: todos os sistemas da empresa em um só lugar.</p>
        </div>
        <nav aria-label="Plataformas" className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Plataformas</span>
          {plataformas.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="sublinha text-muted-foreground hover:text-foreground w-fit">
              {p.nome}
            </a>
          ))}
        </nav>
        <nav aria-label="Heild" className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Heild</span>
          <a href="#" onClick={() => ir('inicio')} className="sublinha text-muted-foreground hover:text-foreground w-fit">
            Página inicial
          </a>
          <a href="#contato" className="sublinha text-muted-foreground hover:text-foreground w-fit">
            Agendar uma demonstração
          </a>
        </nav>
      </Wrap>
      <Wrap className="text-muted-foreground mt-12 text-xs">© 2026 Heild</Wrap>
    </footer>
  )
}

/* ---------------- páginas ---------------- */

const perguntasGerais: [string, string][] = [
  [
    'O que é um integrante?',
    'Um membro de IA do time, um por função: Fiscal, DP, Contábil, Societário, Notas, Atendimento e Financeiro, e no BPO Contas a Pagar, Contas a Receber, Conciliação e Gerencial, mais o Assistente, que recebe qualquer pedido, e o Consultor, que responde sobre a lei. Cada um tem o seu chat, a sua fila e a memória do que já fez.',
  ],
  ['A IA transmite, paga ou assina sozinha?', 'Não. O integrante prepara e deixa um cartão; transmitir, pagar, assinar e enviar ao cliente sempre esperam a aprovação de uma pessoa, que fica registrada com o nome dela.'],
  ['Funciona para um escritório só de BPO?', 'Sim. A Heild BPO tem o seu próprio Painel, um integrante para cada função do financeiro (contas a pagar, contas a receber, conciliação e gerencial) e o app do cliente para aprovar os lotes, sem os módulos contábeis.'],
  ['O escritório pode usar a própria marca?', 'Sim. Dentro do sistema e no app do cliente, cada escritório pode mostrar o próprio nome, as cores e as fontes. Sem personalização, aparece a Heild.'],
  [
    'De onde vêm as respostas sobre a lei?',
    'De uma base com a legislação e a redação de cada artigo por data de vigência. Cada afirmação vem com o trecho citado e o grau de segurança; sem base suficiente, a resposta diz que não encontrou.',
  ],
  ['Como começo?', 'Agende uma demonstração. Mostramos a Heild com casos como os do seu escritório e o que muda no dia a dia de cada setor.'],
]

const legendasInicio: Legenda[] = [
  { setor: 'contabil', estado: 'trabalhando', texto: 'está conciliando os 214 lançamentos de outubro da Metalúrgica' },
  { setor: 'fiscal', estado: 'precisa_de_voce', texto: 'deixou as guias de outubro da Metalúrgica para você aprovar' },
  { setor: 'bpo_pagar', estado: 'concluido', texto: 'montou o lote de sexta da Padaria: 4 contas, R$ 8.420' },
  { setor: 'gestao_atendimento', estado: 'trabalhando', texto: 'está avisando o João Batista do lote pelo WhatsApp' },
  { setor: 'consultor', estado: 'pensando', texto: 'está lendo a LC 123 para o fator R da Clínica Sorriso' },
  { setor: 'dp', estado: 'concluido', texto: 'preparou os contratos de experiência da Padaria' },
]

function PaginaInicio() {
  return (
    <>
      <Hero
        titulo="Toda a sua operação num sistema só."
        frase="A Heild junta as ferramentas da sua empresa num lugar só, com um time de integrantes de IA, um para cada área. Eles preparam o trabalho; uma pessoa aprova."
        setores={['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas', 'gestao_atendimento', 'bpo_pagar']}
        legendas={legendasInicio}
      />
      <SecaoDemo
        escolhas={plataformas}
        titulo="O Assistente e o time, trabalhando ao vivo."
        texto="Escolha a plataforma e siga as dicas: um pedido ao Assistente, o time trabalhando em cada chat e o que precisa de você chegando como cartão."
      />
      <SecaoPlataformas />
      <Vitrine>
        <SecaoTime
          setores={['fiscal', 'dp', 'contabil', 'societario', 'notas', 'gestao_atendimento', 'financeiro_escritorio', 'bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial']}
          titulo="Um integrante de IA em cada setor."
          texto="Cada um conhece o trabalho do seu setor, conversa com você no próprio chat e passa o que é de outro setor para quem faz."
        />
        <SecaoAprovacao />
      </Vitrine>
      <SecaoLei />
      <SecaoInteiro />
      <SecaoPerguntas itens={perguntasGerais} />
      <Encerramento titulo="Veja a sua operação inteira num lugar só." />
    </>
  )
}

const textos: Record<Plataforma['id'], { titulo: string; frase: string; demo: string; time: string; luz: Integrante['setor'][]; legendas: Legenda[]; perguntas: [string, string][] }> = {
  contabil: {
    titulo: 'O escritório contábil inteiro, com um time que faz.',
    frase: 'Fiscal, DP, contábil, societário e notas, cada setor com o seu Painel e o seu integrante. Ele prepara, concilia, cobra e responde; você aprova.',
    demo: 'Clique na caixa e siga as dicas: o Contábil fecha a conciliação, passa ao Fiscal, e o fechamento chega com as guias para você aprovar.',
    time: 'Um integrante em cada setor do escritório, com o Consultor para as perguntas sobre a lei.',
    luz: ['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas'],
    legendas: [legendasInicio[0], legendasInicio[1], legendasInicio[4], legendasInicio[5], { setor: 'gestao_atendimento', estado: 'trabalhando', texto: 'está cobrando os documentos de admissão do João Batista' }],
    perguntas: [
      perguntasGerais[0],
      perguntasGerais[1],
      perguntasGerais[4],
      ['O cliente participa?', 'Sim, pelo app do cliente: ele manda documentos, vê as pendências e as guias, aprova o que é dele e conversa com o escritório no mesmo fio do WhatsApp.'],
      perguntasGerais[5],
    ],
  },
  bpo: {
    titulo: 'O financeiro dos seus clientes, num lugar só.',
    frase: 'Contas a pagar, contas a receber, conciliação e gerencial, cada função com o seu integrante. Eles montam, conferem e relatam; o cliente aprova no app, e quem digita nunca confere.',
    demo: 'Clique na caixa e siga as dicas: o Contas a Pagar monta o lote de sexta, confere o fornecedor novo e o Atendimento escreve ao cliente, que responde no WhatsApp.',
    time: 'Um integrante por função do financeiro, como numa equipe de BPO: cada um com a sua fila e a sua memória. O Atendimento fala com o cliente no contato certo.',
    luz: ['bpo_receber', 'bpo_pagar', 'gestao_atendimento', 'bpo_conciliacao', 'bpo_gerencial'],
    legendas: [
      legendasInicio[2],
      legendasInicio[3],
      { setor: 'bpo_conciliacao', estado: 'trabalhando', texto: 'está conciliando outubro do Studio Forma: 59 de 62 casados' },
      { setor: 'bpo_receber', estado: 'trabalhando', texto: 'está emitindo os boletos de convênio de novembro da Clínica Sorriso' },
      { setor: 'bpo_gerencial', estado: 'concluido', texto: 'entregou o relatório financeiro de outubro da Clínica Sorriso' },
      { setor: 'bpo_conciliacao', estado: 'precisa_de_voce', texto: 'separou 3 lançamentos do Studio Forma para você conferir' },
    ],
    perguntas: [
      perguntasGerais[2],
      perguntasGerais[1],
      ['Quem aprova o pagamento?', 'O cliente, no app, dentro da alçada combinada com o escritório. O banco só libera depois da aprovação, e um fornecedor novo é conferido por uma pessoa diferente de quem digitou.'],
      perguntasGerais[3],
      perguntasGerais[5],
    ],
  },
}

function PaginaPlataforma({ p }: { p: Plataforma }) {
  const t = textos[p.id]
  return (
    <>
      <Hero
        titulo={t.titulo}
        frase={t.frase}
        setores={t.luz}
        legendas={t.legendas}
        topo={
          <span className="entra-tarde" style={{ color: 'var(--primary)', animationDelay: '0s' }}>
            <Logo animacao={p.animacao} loop largura={200} rotulo={p.nome} />
          </span>
        }
      />
      {/* A página da plataforma mostra o produto (o Painel, as funções, o que vem junto); o time vem depois. */}
      {p.id === 'contabil' ? <SecoesContabil /> : <SecoesBpo />}
      <SecaoDemo escolhas={[p]} titulo="O Assistente e o time, trabalhando ao vivo." texto={t.demo} />
      <Vitrine>
        <SecaoTime setores={p.demo.setores} titulo="O time desta plataforma." texto={t.time} />
        {p.id === 'contabil' && <SecaoAprovacao />}
      </Vitrine>
      <SecaoPerguntas itens={t.perguntas} />
      <SecaoPlataformas menos={p.id} />
      <Encerramento titulo={`Veja a ${p.nome} no seu escritório.`} />
    </>
  )
}

function PaginaContato() {
  const [enviado, setEnviado] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [copiado, setCopiado] = useState(false)
  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const novo: Record<string, string> = {}
    if (!v('nome')) novo.nome = 'Escreva o seu nome.'
    if (!v('escritorio')) novo.escritorio = 'Escreva o nome do escritório.'
    if (v('preferencia') === 'whatsapp' ? !v('whatsapp') : !/^\S+@\S+\.\S+$/.test(v('email')))
      novo[v('preferencia') === 'whatsapp' ? 'whatsapp' : 'email'] = v('preferencia') === 'whatsapp' ? 'Escreva o WhatsApp para retornarmos por lá.' : 'Escreva um e-mail válido.'
    setErros(novo)
    if (Object.keys(novo).length) return
    const corpo = [
      `Nome: ${v('nome')}`,
      `Escritório: ${v('escritorio')}`,
      `Plataforma: ${v('plataforma')}`,
      `Prefere contato por: ${v('preferencia') === 'whatsapp' ? 'WhatsApp' : 'e-mail'}`,
      `E-mail: ${v('email') || '-'}`,
      `WhatsApp: ${v('whatsapp') || '-'}`,
      '',
      v('mensagem'),
    ].join('\n')
    window.location.href = `mailto:${CONTATO}?subject=${encodeURIComponent('Demonstração da Heild')}&body=${encodeURIComponent(corpo)}`
    setEnviado(true)
  }
  const copiar = () =>
    navigator.clipboard?.writeText(CONTATO).then(
      () => setCopiado(true),
      () => setCopiado(false),
    )
  const campo = 'bg-raised shadow-contorno focus-visible:outline-ring h-11 w-full rounded-[14px] px-3.5 text-sm outline-offset-2 focus-visible:outline-2'
  return (
    <section className="grade-pontos min-h-[calc(100dvh-4rem)] py-16 sm:py-24" aria-labelledby="contato-t">
      <Wrap className="grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-5" data-enter>
          <h1 id="contato-t" className="font-heading text-[44px] leading-[1.05] font-medium tracking-[-0.04em] text-balance sm:text-6xl">
            Agende uma demonstração.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Mostramos a Heild com casos como os do seu escritório. Diga como prefere o contato, por e-mail ou WhatsApp, e retornamos para marcar o horário.</p>
          <div className="flex flex-col gap-1.5 pt-2 text-sm">
            <span className="text-muted-foreground">E-mail</span>
            <span className="flex items-center gap-2">
              <span className="font-medium select-all">{CONTATO}</span>
              <button type="button" onClick={copiar} aria-label="Copiar o e-mail" className="botao text-muted-foreground hover:text-foreground flex size-11 cursor-pointer items-center justify-center rounded-full">
                <CopyIcon className="size-4" />
              </button>
              {copiado && <span className="text-muted-foreground text-xs">copiado</span>}
            </span>
          </div>
        </div>
        <form onSubmit={enviar} noValidate className="bg-surface shadow-painel flex flex-col gap-5 rounded-[28px] p-6 sm:p-8 lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo id="nome" rotulo="Seu nome" erro={erros.nome}>
              <input id="nome" name="nome" autoComplete="name" className={campo} aria-invalid={!!erros.nome} />
            </Campo>
            <Campo id="escritorio" rotulo="Escritório" erro={erros.escritorio}>
              <input id="escritorio" name="escritorio" autoComplete="organization" className={campo} aria-invalid={!!erros.escritorio} />
            </Campo>
            <Campo id="email" rotulo="E-mail" erro={erros.email}>
              <input id="email" name="email" type="email" autoComplete="email" className={campo} aria-invalid={!!erros.email} />
            </Campo>
            <Campo id="whatsapp" rotulo="WhatsApp (opcional)" erro={erros.whatsapp}>
              <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" className={campo} aria-invalid={!!erros.whatsapp} />
            </Campo>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Plataforma de interesse</legend>
            <div className="flex flex-wrap gap-2">
              {[...plataformas.map((p) => p.nome), 'As duas'].map((n, i) => (
                <Escolha key={n} nome="plataforma" valor={n} rotulo={n} padrao={i === 0} />
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Prefere o contato por</legend>
            <div className="flex flex-wrap gap-2">
              <Escolha nome="preferencia" valor="email" rotulo="E-mail" padrao />
              <Escolha nome="preferencia" valor="whatsapp" rotulo="WhatsApp" />
            </div>
          </fieldset>
          <Campo id="mensagem" rotulo="Algo que devemos saber (opcional)">
            <textarea id="mensagem" name="mensagem" rows={3} className={cn(campo, 'h-auto py-3')} placeholder="Quantos clientes, quais setores, o que usa hoje" />
          </Campo>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="botao bg-primary text-primary-foreground h-11 cursor-pointer rounded-full px-5 text-sm font-medium hover:bg-primary/90">
              Pedir a demonstração
            </button>
            {enviado && (
              <p role="status" className="text-muted-foreground text-sm">
                Abrimos o seu e-mail com a mensagem pronta. Se ele não abriu, escreva para {CONTATO}.
              </p>
            )}
          </div>
        </form>
      </Wrap>
    </section>
  )
}

function Campo({ id, rotulo, erro, children }: { id: string; rotulo: string; erro?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </label>
      {children}
      {erro && <span className="text-destructive text-xs">{erro}</span>}
    </div>
  )
}

function Escolha({ nome, valor, rotulo, padrao }: { nome: string; valor: string; rotulo: string; padrao?: boolean }) {
  return (
    <label className="has-[:checked]:bg-primary has-[:checked]:text-primary-foreground bg-raised shadow-contorno flex h-11 cursor-pointer items-center rounded-full px-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
      <input type="radio" name={nome} value={valor} defaultChecked={padrao} className="sr-only" />
      {rotulo}
    </label>
  )
}
