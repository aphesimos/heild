import { BellIcon, CalendarCheckIcon, ChatCircleDotsIcon, CheckIcon, DeviceMobileIcon, EnvelopeSimpleIcon, GearSixIcon, InfoIcon, UserCircleIcon, WhatsappLogoIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { Avatar } from '@/components/ui/avatar'
import { useState, type ReactNode } from 'react'
import { Contador } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { useLoja, useNavegacao, type AvisoSistema, type Destino, type Toast } from './loja'
import { useSessao } from './sessao'

/**
 * Notificações no canto inferior direito, como no WhatsApp Web ou no Discord: a
 * mais nova entra por baixo e empurra as outras para cima. Três desenhos:
 * - mensagem de cliente: a foto, o nome, a empresa e o começo do texto, com o canal;
 * - integrante: o orb no estado dele, o nome e o que fez (ou que precisa de você);
 * - confirmação do sistema: o ícone e o texto.
 */
export function Toasts() {
  const loja = useLoja()
  const nav = useNavegacao()
  const abrir = (t: Toast) => {
    if (t.destino) nav.irPara(t.destino)
    loja.fecharToast(t.id)
  }
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:w-[22.5rem]" aria-live="polite" aria-label="Notificações">
      <AnimatePresence initial={false}>
        {loja.estado.toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="pointer-events-auto w-full"
          >
            <Notificacao t={t} onAbrir={() => abrir(t)} onFechar={() => loja.fecharToast(t.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** "Contábil fechou a conciliação" ao lado do nome Contábil vira "Fechou a conciliação" (o nome já está em cima). */
function semNome(texto: string, nome: ReactNode) {
  if (typeof nome !== 'string') return texto
  const m = texto.match(new RegExp(`^${nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[:,]?\\s+`))
  if (!m) return texto
  const resto = texto.slice(m[0].length)
  return resto.charAt(0).toUpperCase() + resto.slice(1)
}

const rotuloCanal = { whatsapp: 'WhatsApp', email: 'E-mail', app: 'App' } as const
const fraseEstado = { trabalhando: 'começou', concluido: 'terminou', precisa_de_voce: 'precisa de você' } as const

function Notificacao({ t, onAbrir, onFechar }: { t: Toast; onAbrir: () => void; onFechar: () => void }) {
  const { integrante } = useTema()
  const q = t.quem
  const pede = q?.tipo === 'integrante' && q.estado === 'precisa_de_voce'
  let visual: ReactNode
  let nome: ReactNode = null
  let meta: string | null = null
  if (q?.tipo === 'integrante') {
    const i = integrante(q.setor)
    visual = (
      <span className="flex size-10 shrink-0 items-center justify-center">
        <Orb cor={i.cor} corOlhos={i.corOlhos} tamanho={40} estado={q.estado ?? 'concluido'} animado extras={false} cutucavel={false} />
      </span>
    )
    nome = i.nome
    meta = fraseEstado[q.estado ?? 'concluido']
  } else if (q?.tipo === 'contato') {
    const Canal = q.canal === 'whatsapp' ? WhatsappLogoIcon : q.canal === 'email' ? EnvelopeSimpleIcon : DeviceMobileIcon
    visual = (
      <span className="relative flex size-10 shrink-0">
        <Avatar nome={q.nome} tamanho="lg" className="size-10" />
        <span className={cn('ring-raised absolute -right-0.5 -bottom-0.5 flex size-[18px] items-center justify-center rounded-full ring-2', q.canal === 'whatsapp' ? 'bg-[#25d366] text-white' : 'bg-foreground text-background')}>
          <Canal className="size-[11px]" weight="fill" />
        </span>
      </span>
    )
    nome = q.nome
    meta = [q.cliente, rotuloCanal[q.canal]].filter(Boolean).join(' · ')
  } else {
    visual = (
      <span className="bg-sunken flex size-10 shrink-0 items-center justify-center rounded-full">
        <CheckIcon className="size-4" weight="bold" />
      </span>
    )
  }
  return (
    <div
      role={t.destino ? 'button' : undefined}
      tabIndex={t.destino ? 0 : undefined}
      onClick={t.destino ? onAbrir : undefined}
      onKeyDown={(e) => t.destino && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onAbrir())}
      className={cn('bg-raised shadow-campo group relative flex gap-3 rounded-[20px] p-3.5 pr-9 text-sm', t.destino && 'hover:bg-surface cursor-pointer transition-colors')}
    >
      {pede && <span aria-hidden className="bg-highlight absolute top-4 left-0 h-6 w-[3px] rounded-r-full" />}
      {visual}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {nome && (
          <p className="flex min-w-0 items-baseline gap-1.5">
            <span className="max-w-[70%] shrink-0 truncate font-semibold">{nome}</span>
            {meta && <span className={cn('min-w-0 truncate text-xs', pede ? 'text-highlight font-medium' : 'text-muted-foreground')}>{meta}</span>}
            <span className="text-muted-foreground ml-auto shrink-0 text-xs">agora</span>
          </p>
        )}
        <p className={cn('line-clamp-2 leading-snug', nome ? 'text-muted-foreground' : 'text-foreground pt-0.5')}>{semNome(t.texto, q?.tipo === 'integrante' ? nome : null)}</p>
        {t.destino && <span className="mt-1 text-xs font-medium">{t.rotuloDestino ?? 'Abrir'}</span>}
      </div>
      <button
        type="button"
        aria-label="Fechar notificação"
        onClick={(e) => (e.stopPropagation(), onFechar())}
        className="text-muted-foreground hover:text-foreground hover:bg-sunken absolute top-2.5 right-2.5 flex size-6 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  )
}

const iconeTipo = { conversa: ChatCircleDotsIcon, prazo: CalendarCheckIcon, sistema: InfoIcon, cliente: UserCircleIcon, cartao: BellIcon }

/** Avisos visíveis para a conta atual. */
export function useAvisosDaConta() {
  const loja = useLoja()
  const { usuario } = useSessao()
  const meus = loja.estado.avisos.filter((a) => a.para.length === 0 || a.para.includes(usuario.id))
  return { meus, naoLidos: meus.filter((a) => !a.lidoPor.includes(usuario.id)).length }
}

/** Sino do cabeçalho (03, 2.2): avisos da conta, com o link para o item. */
export function CentralAvisos({ onPreferencias }: { onPreferencias?: () => void }) {
  const loja = useLoja()
  const nav = useNavegacao()
  const { usuario } = useSessao()
  const aparencia = useAparencia()
  const { meus, naoLidos } = useAvisosDaConta()
  const [aberto, setAberto] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | 'nao_lidos'>('todos')
  const lista = filtro === 'todos' ? meus : meus.filter((a) => !a.lidoPor.includes(usuario.id))
  const abrir = (a: AvisoSistema) => {
    loja.ler(a.id, usuario.id)
    setAberto(false)
    if (a.destino) nav.irPara(a.destino)
  }
  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative shrink-0 rounded-full" aria-label={`Notificações (${naoLidos})`}>
          <BellIcon weight="duotone" className="size-5" />
          <Contador valor={naoLidos} className="absolute top-1 right-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(26rem,calc(100vw-1.5rem))] p-0">
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <span className="flex-1 text-sm font-medium">Avisos</span>
          <div className="bg-sunken flex rounded-full p-0.5 text-xs">
            {(['todos', 'nao_lidos'] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFiltro(f)} aria-pressed={filtro === f} className={cn('cursor-pointer rounded-full px-2.5 py-1', filtro === f && 'bg-raised shadow-pilula')}>
                {f === 'todos' ? 'Todos' : `Não lidos (${naoLidos})`}
              </button>
            ))}
          </div>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-1">
          {lista.length === 0 && <li className="text-muted-foreground px-4 py-8 text-center text-sm">Nada por aqui.</li>}
          {lista.map((a) => {
            const lido = a.lidoPor.includes(usuario.id)
            const Icone = iconeTipo[a.tipo]
            const t = a.setor ? aparencia({ setor: a.setor }) : null
            return (
              <li key={a.id}>
                <button type="button" onClick={() => abrir(a)} className="hover:bg-sunken/60 flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left">
                  <span className="mt-0.5 shrink-0">{t && a.tipo === 'cartao' ? <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={22} cutucavel={false} extras={false} /> : <Icone className="text-muted-foreground size-5" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm', !lido && 'font-medium')}>{a.titulo}</span>
                    {a.detalhe && <span className="text-muted-foreground block text-xs">{a.detalhe}</span>}
                    <span className="text-muted-foreground block text-[11px]">{a.quando}</span>
                  </span>
                  {!lido && <span className="bg-destructive mt-1.5 size-2 shrink-0 rounded-full" aria-label="não lido" />}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex items-center gap-1 border-t px-2 py-1.5">
          <Button size="sm" variant="ghost" className="rounded-full" disabled={!naoLidos} onClick={() => loja.lerTodos(usuario.id)}>
            <CheckIcon /> Marcar todos como lidos
          </Button>
          {onPreferencias && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto rounded-full"
              onClick={() => {
                setAberto(false)
                onPreferencias()
              }}
            >
              <GearSixIcon /> Preferências
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ---------- Botões de ação simples (registram, avisam e levam ao lugar certo) ---------- */

type PropsBotao = Omit<React.ComponentProps<typeof Button>, 'onClick'>

/** Faz a ação na hora: registra o evento com o nome de quem fez e mostra a confirmação. */
export function BotaoFeito({ texto, destino, rotuloDestino, aoFazer, ...props }: PropsBotao & { texto: string; destino?: Destino; rotuloDestino?: string; aoFazer?: () => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  return (
    <Button
      {...props}
      onClick={() => {
        aoFazer?.()
        loja.registrar(usuario.nome, texto)
        loja.toast(texto, destino, rotuloDestino)
      }}
    />
  )
}

/** Leva a outro ponto do sistema. */
export function BotaoIr({ destino, ...props }: PropsBotao & { destino: Destino }) {
  const nav = useNavegacao()
  return <Button {...props} onClick={() => nav.irPara(destino)} />
}

/** Baixa um arquivo (na demonstração, confirma o download). */
export function BotaoBaixar({ nome, ...props }: PropsBotao & { nome: string }) {
  const loja = useLoja()
  return <Button {...props} onClick={() => loja.toast(`${nome} baixado.`)} />
}

/** Alterna um estado (pausar/retomar, ligar/desligar), com a confirmação de cada lado. */
export function BotaoAlternar({ rotulos, textos, inicial = false, ...props }: Omit<PropsBotao, 'children'> & { rotulos: [ReactNode, ReactNode]; textos: [string, string]; inicial?: boolean }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const [ligado, setLigado] = useState(inicial)
  return (
    <Button
      {...props}
      aria-pressed={ligado}
      onClick={() => {
        const t = ligado ? textos[1] : textos[0]
        setLigado(!ligado)
        loja.registrar(usuario.nome, t)
        loja.toast(t)
      }}
    >
      {ligado ? rotulos[1] : rotulos[0]}
    </Button>
  )
}
