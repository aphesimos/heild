import { ArrowClockwiseIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DocumentosProvider } from '@/ambiente/documentos'
import { FluxosProvider } from '@/ambiente/fluxos'
import { cartoesPendentes, integranteAoVivo } from '@/ambiente/integrante-vivo'
import { LojaProvider, NavegacaoProvider, useLoja, type Destino } from '@/ambiente/loja'
import { SessaoProvider, useSessao } from '@/ambiente/sessao'
import { CabecalhoIntegrante } from '@/components/compostos/cabecalho-integrante'
import type { AcoesCartao } from '@/components/compostos/cartoes-chat'
import { Orb } from '@/components/ui/orb'
import * as exemplo from '@/dados/exemplo'
import { pedidosAssistente } from '@/dados/simulacao'
import { useAparencia } from '@/hooks/useAparencia'
import { useMedia } from '@/hooks/useMedia'
import { cn } from '@/lib/utils'
import { ListaMensagens } from '@/telas/ListaMensagens'
import { mensagensComTime, pedirAoTime } from '@/telas/pedidoAoTime'
import { useHistorico } from '@/telas/useHistorico'
import { useTema } from '@/theme/ThemeProvider'
import type { Roteiro } from './roteiros'

/*
 * A demonstração da landing: o produto de verdade por baixo (a mesma loja, os
 * mesmos fluxos, o pensar, a escrita, os cartões de trabalho, retorno e
 * passagem, o orb que segue o cursor), com uma moldura limpa por cima. Sem campo
 * livre: a caixa escreve o pedido e as dicas, lidas do estado do time, levam pelo
 * caminho inteiro.
 */

type Aba = 'assistente' | 'time'

export function DemoGuiada({ roteiro, setores, onEtapa }: { roteiro: Roteiro; setores: string[]; onEtapa?: (n: number) => void }) {
  const [volta, setVolta] = useState(0)
  return (
    <SessaoProvider inicial="u1" key={volta}>
      <LojaProvider semRotinas>
        <Moldura roteiro={roteiro} setores={setores} onEtapa={onEtapa} onRecomecar={() => setVolta((v) => v + 1)} />
      </LojaProvider>
    </SessaoProvider>
  )
}

interface PropsQuadro {
  roteiro: Roteiro
  setores: string[]
  onEtapa?: (n: number) => void
  onRecomecar: () => void
}

function Moldura(props: PropsQuadro) {
  const [aba, setAba] = useState<Aba>('assistente')
  const [sel, setSel] = useState(props.roteiro.cadeia[0])
  // Dentro da demonstração os links só trocam de aba ou de integrante.
  const nav = useMemo(
    () => ({
      irPara: (d: Destino) => {
        if (d.modulo !== 'inicio') return
        if (d.integrante) setSel(d.integrante)
        if (d.aba === 'time' || d.aba === 'assistente') setAba(d.aba)
      },
      vitrine: true,
    }),
    [],
  )
  return (
    <NavegacaoProvider value={nav}>
      <FluxosProvider>
        <DocumentosProvider>
          <Quadro {...props} aba={aba} setAba={setAba} sel={sel} setSel={setSel} />
        </DocumentosProvider>
      </FluxosProvider>
    </NavegacaoProvider>
  )
}

function Quadro({ roteiro, setores, onEtapa, onRecomecar, aba, setAba, sel, setSel }: PropsQuadro & { aba: Aba; setAba: (a: Aba) => void; sel: string; setSel: (id: string) => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const { integrante: doTema } = useTema()
  const geral = doTema('geral')
  const aparencia = useAparencia()
  const largo = useMedia('(min-width: 640px)')
  const pedido = pedidosAssistente.find((p) => p.texto === roteiro.pedido)!
  const { atual, enviar } = useHistorico('demo', usuario.nome, exemplo.historicoAssistente, true)
  const mensagensAssist = mensagensComTime(atual.mensagens, loja.estado.assistente[atual.id])

  // O time da demonstração: só o que aconteceu aqui (sem o histórico de exemplo), com o estado vivo de cada um.
  const extras = loja.estado.timeExtras
  const time = useMemo(() => {
    const base = exemplo.integrantes.filter((i) => i.tipo !== 'criado_pelo_usuario' && setores.includes(i.setor) && i.setor !== 'consultor')
    const ordem = [...roteiro.cadeia.map((id) => base.find((i) => i.id === id)!), ...base.filter((i) => !roteiro.cadeia.includes(i.id))]
    return ordem.map((i) => integranteAoVivo(i, loja.estado.trabalhos, extras[i.id] ?? [], loja.estado.decisoes, loja.tarefas))
  }, [setores, roteiro.cadeia, loja.estado.trabalhos, extras, loja.estado.decisoes, loja.tarefas])
  const iSel = time.find((i) => i.id === sel) ?? time[0]

  const definirVista = loja.definirVista
  useEffect(() => definirVista({ modulo: 'inicio', aba, integrante: sel, usuario: usuario.id }), [definirVista, aba, sel, usuario.id])

  // A caixa: o pedido se escreve letra a letra e vai pelo mesmo caminho do Assistente do produto.
  const [letras, setLetras] = useState<number | null>(null)
  const enviado = mensagensAssist.length > 0
  useEffect(() => {
    if (letras === null || enviado) return
    if (letras >= pedido.texto.length) {
      const id = window.setTimeout(() => pedirAoTime(pedido, atual.id, enviar, loja), 350)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setLetras(letras + 1), 34)
    return () => window.clearTimeout(id)
  }, [letras, enviado, pedido, atual.id, enviar, loja])

  // O estado do caminho, lido da loja.
  const trabalhos = loja.estado.trabalhos.filter((t) => t.origem === atual.id)
  const rodando = trabalhos.find((t) => t.situacao === 'rodando')
  const concluidos = new Set(trabalhos.filter((t) => t.situacao === 'concluido').map((t) => t.integrante))
  const timeTerminou = roteiro.cadeia.every((id) => concluidos.has(id))
  const pendentesAssist = cartoesPendentes(mensagensAssist, loja.estado.decisoes)
  const pendenteDe = (id: string) => cartoesPendentes(extras[id] ?? [], loja.estado.decisoes)
  const espera = roteiro.espera
  const aprovado = espera.tipo === 'aprovacao' && !!loja.estado.decisoes[espera.cartao]
  const cartaoEsperando = espera.tipo === 'aprovacao' && !aprovado && (pendenteDe(espera.integrante) > 0 || pendentesAssist > 0)
  const clienteRespondeu = espera.tipo === 'cliente' && mensagensAssist.some((m) => !m.pendente && m.cartoes?.some((c) => c.tipo === 'conversa_crm'))
  const finalChegou = mensagensAssist.some((m) => !m.pendente && m.texto === pedido.final.texto)
  const esperaFeita = espera.tipo === 'aprovacao' ? aprovado : clienteRespondeu
  const [viuResumo, setViuResumo] = useState(false)
  useEffect(() => {
    if (aba !== 'assistente' || !finalChegou || !esperaFeita) return
    const id = window.setTimeout(() => setViuResumo(true), 2500)
    return () => window.clearTimeout(id)
  }, [aba, finalChegou, esperaFeita])

  const etapa = !enviado ? 0 : !timeTerminou ? 1 : !esperaFeita ? 2 : !viuResumo ? 3 : 4
  useEffect(() => onEtapa?.(etapa), [etapa, onEtapa])

  // Dicas: uma por vez, no próximo lugar a clicar.
  const nomeDe = (id: string) => { const i = time.find((x) => x.id === id); return i ? aparencia(i).nome : '' }
  // Artigo pelo nome do integrante: a Conciliação, o Fiscal, o Contas a Pagar.
  const art = (id: string, maiuscula = false) => { const a = nomeDe(id) === 'Conciliação' ? 'a' : 'o'; return maiuscula ? a.toUpperCase() : a }
  const dica: { alvo: string; texto: string } | null = (() => {
    if (letras === null) return { alvo: 'campo', texto: 'Clique aqui para pedir' }
    if (rodando) {
      if (aba === 'assistente') return { alvo: 'aba-time', texto: `${art(rodando.integrante, true)} ${nomeDe(rodando.integrante)} começou. Veja no Time` }
      if (sel !== rodando.integrante) return { alvo: `chip-${rodando.integrante}`, texto: `Agora é ${art(rodando.integrante)} ${nomeDe(rodando.integrante)}` }
      return null
    }
    if (cartaoEsperando && espera.tipo === 'aprovacao') {
      if (aba === 'time' && sel !== espera.integrante && pendenteDe(espera.integrante) > 0) return { alvo: `chip-${espera.integrante}`, texto: `${art(espera.integrante, true)} ${nomeDe(espera.integrante)} espera você` }
      if ((aba === 'time' && sel === espera.integrante) || (aba === 'assistente' && pendentesAssist > 0)) return { alvo: 'aprovar', texto: 'Isto passa por você: aprove' }
      return null
    }
    if (timeTerminou && aba === 'time' && finalChegou) return { alvo: 'aba-assistente', texto: espera.tipo === 'cliente' && !clienteRespondeu ? 'A resposta do cliente chega no Assistente' : 'O resumo chegou no Assistente' }
    return null
  })()

  const acoes: AcoesCartao = {
    onAbrirIntegrante: (setor) => {
      const alvo = time.find((i) => i.setor === setor)
      if (alvo) setSel(alvo.id)
      setAba('time')
    },
    onVerNaAba: () => {},
  }
  const chatSel = extras[iSel.id] ?? []

  // A dica de aprovar aponta para o botão Aprovar do cartão, onde quer que ele esteja na conversa.
  const raiz = useRef<HTMLDivElement>(null)
  const [alvoAprovar, setAlvoAprovar] = useState<{ x: number; y: number } | null>(null)
  const apontaAprovar = dica?.alvo === 'aprovar'
  useLayoutEffect(() => {
    if (!apontaAprovar) return setAlvoAprovar(null)
    let raf = 0
    const medir = () => {
      raf = requestAnimationFrame(medir)
      const r = raiz.current
      const b = r?.querySelector<HTMLElement>('[data-cartao-pendente] button')
      const area = r?.querySelector<HTMLElement>('.area-rolagem-dupla')
      if (!r || !b || !area) return setAlvoAprovar((v) => (v ? null : v))
      const rr = r.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const ra = area.getBoundingClientRect()
      const visivel = rb.top >= ra.top + 30 && rb.bottom <= ra.bottom
      const novo = visivel ? { x: Math.round(rb.left - rr.left + rb.width / 2), y: Math.round(rb.top - rr.top) } : null
      setAlvoAprovar((v) => (v?.x === novo?.x && v?.y === novo?.y ? v : novo))
    }
    medir()
    return () => cancelAnimationFrame(raf)
  }, [apontaAprovar])
  // A dica de um chip do time: medida e desenhada fora da fila (que rola de lado e cortaria a dica).
  const filaTime = useRef<HTMLDivElement>(null)
  const chipDica = dica?.alvo.startsWith('chip-') ? dica.alvo.slice(5) : null
  const [alvoChip, setAlvoChip] = useState<{ x: number; y: number } | null>(null)
  useLayoutEffect(() => {
    if (!chipDica || aba !== 'time') return setAlvoChip(null)
    const fila = filaTime.current
    const chip = fila?.querySelector<HTMLElement>(`[data-chip="${chipDica}"]`)
    if (fila && chip) fila.scrollTo({ left: chip.offsetLeft - fila.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
    let raf = 0
    const medir = () => {
      raf = requestAnimationFrame(medir)
      const r = raiz.current
      const c = r?.querySelector<HTMLElement>(`[data-chip="${chipDica}"]`)
      if (!r || !c) return setAlvoChip((v) => (v ? null : v))
      const rr = r.getBoundingClientRect()
      const rc = c.getBoundingClientRect()
      const x = Math.round(Math.min(rr.width - 96, Math.max(96, rc.left - rr.left + rc.width / 2)))
      const novo = { x, y: Math.round(rc.bottom - rr.top) }
      setAlvoChip((v) => (v?.x === novo.x && v?.y === novo.y ? v : novo))
    }
    medir()
    return () => cancelAnimationFrame(raf)
  }, [chipDica, aba])
  const algumPendente = time.some((i) => pendenteDe(i.id) > 0)

  return (
    <div ref={raiz} data-dica={dica?.alvo} className="demo-guiada bg-background from-background to-background-end shadow-painel relative flex h-full flex-col overflow-hidden rounded-[28px] bg-gradient-to-b">
      <div className="flex shrink-0 items-center justify-center px-4 pt-4 pb-2">
        <div role="tablist" aria-label="Demonstração" className="bg-sunken inset-shadow-trilho relative inline-flex gap-0.5 rounded-full p-[3px]">
          {(['assistente', 'time'] as const).map((id) => (
            <Alvo key={id} dica={dica?.alvo === `aba-${id}` ? dica.texto : undefined} lado="abaixo">
              <button
                role="tab"
                type="button"
                aria-selected={aba === id}
                onClick={() => setAba(id)}
                className={cn('botao relative cursor-pointer rounded-full px-5 py-1.5 text-sm', aba === id ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground hover:text-foreground', dica?.alvo === `aba-${id}` && 'pulso')}
              >
                {id === 'assistente' ? 'Assistente' : 'Time'}
                {id === 'time' && algumPendente && <span className="bg-highlight absolute top-1 right-1.5 size-1.5 rounded-full" aria-label="cartão esperando você" />}
              </button>
            </Alvo>
          ))}
        </div>
      </div>

      {aba === 'time' && (
        <div className="flex shrink-0 flex-col gap-2 pt-1 pb-2">
          {/* A fila do time: rola de lado no celular (a dica do chip é desenhada fora dela, para não ser cortada). */}
          <div ref={filaTime} role="tablist" aria-label="Integrantes" className="sem-barra fila-time flex items-center gap-1.5 overflow-x-auto px-4 py-0.5 sm:flex-wrap sm:overflow-visible sm:px-6">
            {time.map((i) => {
              const doPedido = roteiro.cadeia.includes(i.id)
              const alvo = `chip-${i.id}`
              return (
                <button
                  key={i.id}
                  role="tab"
                  type="button"
                  data-chip={i.id}
                  aria-selected={sel === i.id}
                  aria-label={doPedido ? undefined : i.nome}
                  title={doPedido ? undefined : i.nome}
                  onClick={() => setSel(i.id)}
                  className={cn(
                    'botao relative flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full text-sm whitespace-nowrap transition-colors',
                    doPedido ? 'pr-3.5 pl-1' : 'px-1',
                    sel === i.id ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground hover:text-foreground',
                    dica?.alvo === alvo && 'pulso',
                  )}
                >
                  <Orb cor={aparencia(i).cor} corOlhos={aparencia(i).corOlhos} tamanho={30} extras={false} cutucavel={false} estado={i.estado} />
                  {doPedido && aparencia(i).nome}
                  {pendenteDe(i.id) > 0 && <span className="bg-highlight size-1.5 rounded-full" aria-label=", espera você" />}
                </button>
              )
            })}
          </div>
          {/* O cabeçalho do integrante é uma faixa própria: separa a escolha (acima) da conversa (abaixo). */}
          <div className="px-4 sm:px-6">
            <CabecalhoIntegrante nivel="h3" integrante={iSel} className="bg-surface shadow-contorno rounded-[22px] px-3 py-2.5 sm:px-4" />
          </div>
        </div>
      )}

      <div className="area-rolagem-dupla relative min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
        {aba === 'assistente' ? (
          enviado ? (
            <ListaMensagens className="pt-4 pb-6" mensagens={mensagensAssist} acoes={acoes} />
          ) : (
            <div className="flex min-h-full flex-col items-center justify-center py-8">
              <h3 className="text-muted-foreground flex items-center gap-3 text-center text-3xl font-light tracking-tight sm:gap-4 sm:text-4xl">
                No que posso ajudar?
                {/* O orb principal do produto: segue o cursor e reage ao clique. */}
                <Orb cor={geral.cor} corOlhos={geral.corOlhos} reacao="idle" tamanho={largo ? 64 : 48} modo="follow" animado vivo />
              </h3>
            </div>
          )
        ) : chatSel.length ? (
          <ListaMensagens key={iSel.id} className="pt-4 pb-6" mensagens={chatSel} acoes={acoes} />
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center gap-3 px-6 py-8 text-center">
            <Orb cor={aparencia(iSel).cor} corOlhos={aparencia(iSel).corOlhos} tamanho={56} estado={iSel.estado} cutucavel={false} />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">{roteiro.cadeia.includes(iSel.id) ? `${aparencia(iSel).nome} começa quando chegar a vez dele.` : `Este pedido não passa pelo ${aparencia(iSel).nome}.`}</p>
          </div>
        )}
      </div>

      {chipDica && alvoChip && (
        <div className="pointer-events-none absolute z-20 h-0 w-0" style={{ left: alvoChip.x, top: alvoChip.y }}>
          <span role="status" data-lado="abaixo" className="dica bg-foreground text-background absolute top-full left-0 mt-2.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
            {dica?.texto}
          </span>
        </div>
      )}

      {apontaAprovar && alvoAprovar && (
        <div className="pointer-events-none absolute z-20 h-0 w-0" style={{ left: alvoAprovar.x, top: alvoAprovar.y }}>
          <span role="status" data-lado="acima" className="dica bg-foreground text-background absolute bottom-full left-0 mb-2.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
            {dica?.texto}
          </span>
        </div>
      )}

      <div className="shrink-0 px-4 pt-1 pb-4 sm:px-6">
        {etapa === 4 ? (
          <button type="button" onClick={onRecomecar} className="botao bg-sunken text-foreground hover:bg-raised flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium">
            <ArrowClockwiseIcon className="size-4" /> Ver de novo
          </button>
        ) : (
          <Alvo dica={dica?.alvo === 'campo' ? dica.texto : undefined} lado="acima" className="w-full">
            <button
              type="button"
              onClick={() => letras === null && setLetras(0)}
              disabled={letras !== null}
              aria-label={letras === null ? `Pedir ao Assistente: ${pedido.texto}` : undefined}
              className={cn('bg-card shadow-campo flex h-12 w-full items-center gap-3 rounded-full pr-1.5 pl-5 text-left text-sm', letras === null ? 'pulso cursor-pointer' : 'cursor-default')}
            >
              <span className={cn('min-w-0 flex-1 truncate', letras === null || enviado ? 'text-muted-foreground' : 'text-foreground')}>
                {letras === null ? (
                  pedido.texto
                ) : enviado ? (
                  `Pergunte ao ${geral.nome} ou peça uma ação`
                ) : (
                  <>
                    {pedido.texto.slice(0, letras)}
                    <span className="cursor-texto" aria-hidden />
                  </>
                )}
              </span>
              <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full transition-colors', !enviado && letras !== null && letras >= pedido.texto.length ? 'bg-primary text-primary-foreground' : 'bg-sunken text-muted-foreground')}>
                <ArrowUpIcon className="size-4" />
              </span>
            </button>
          </Alvo>
        )}
      </div>
    </div>
  )
}

function Alvo({ dica, lado, className, children }: { dica?: string; lado: 'acima' | 'abaixo'; className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {dica && (
        <span role="status" className={cn('dica bg-foreground text-background pointer-events-none absolute left-1/2 z-20 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap', lado === 'acima' ? 'bottom-full mb-2.5' : 'top-full mt-2.5')} data-lado={lado}>
          {dica}
        </span>
      )}
    </div>
  )
}
