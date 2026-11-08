import { BrainIcon, ClockCounterClockwiseIcon, DotsThreeIcon, EyeIcon, GearSixIcon, PauseIcon, PlayIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip } from '@/components/ui/tooltip'
import type { Integrante } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { useMedia } from '@/hooks/useMedia'
import { rotuloDoEstado } from '@/lib/integrante'
import { cn } from '@/lib/utils'

interface Props {
  integrante: Integrante
  contexto?: string
  /** Porcentagem usada do limite de 5 horas do usuário (02, 16: % e não tokens). */
  limite?: { usado: number; renova: string }
  onPausar?: () => void
  onVerMemoria?: () => void
  onConfigurar?: () => void
  onHistorico?: () => void
  /** Nível do título (h2 no chat; h3 quando o cabeçalho vive dentro de outra seção, como na landing). */
  nivel?: 'h2' | 'h3'
  className?: string
}

/**
 * Cabeçalho do chat do integrante: orb grande (segue o cursor, reage ao clique),
 * nome, setor, estado, fila, cartões pendentes, limite de IA e menu.
 * No celular encolhe para orb, nome e estado.
 */
export function CabecalhoIntegrante({ integrante: it, contexto, limite, onPausar, onVerMemoria, onConfigurar, onHistorico, nivel = 'h2', className }: Props) {
  const Titulo = nivel
  const aparencia = useAparencia()
  const t = aparencia(it)
  const pausado = it.situacao === 'pausado'
  const tomLimite = limite && limite.usado >= 95 ? 'var(--destructive)' : 'var(--highlight)'
  const [menu, setMenu] = useState(false)
  const largo = useMedia('(min-width: 640px)')
  /** Fecha o menu e executa a opção escolhida. */
  const escolher = (f?: () => void) => () => {
    setMenu(false)
    f?.()
  }
  return (
    <header className={cn('flex items-center gap-3 sm:gap-4', className)}>
      <span className={cn('shrink-0', pausado && 'opacity-60 grayscale')}>
        <Orb cor={t.cor} corOlhos={t.corOlhos} estado={pausado ? 'dormindo' : it.estado} tamanho={largo ? 52 : 40} modo="follow" animado sombra espelho={{ id: it.id, papel: 'cabecalho' }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Titulo className="truncate text-lg font-semibold">{t.nome}</Titulo>
          <Badge variant={pausado ? 'outline' : it.estado === 'precisa_de_voce' ? 'destaque' : it.estado === 'erro' ? 'erro' : 'secondary'}>{pausado ? 'Pausado' : rotuloDoEstado[it.estado]}</Badge>
          {it.emObservacao && (
            <Tooltip conteudo="Nos primeiros 14 dias, tudo o que ele faria sozinho vira cartão para você aprovar.">
              <Badge variant="outline">
                <EyeIcon /> em observação
              </Badge>
            </Tooltip>
          )}
        </div>
        <p className="text-muted-foreground hidden truncate text-sm sm:block">
          {it.setorRotulo} · {it.funcao}
        </p>
        <div className="text-muted-foreground mt-0.5 hidden flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:flex">
          <Tooltip conteudo="O que está fazendo agora e as tarefas do Painel com ele que ainda não terminaram">
            <span>
              <Meta icone={<SpinnerGapIcon className={cn(it.estado === 'trabalhando' && 'animate-spin')} />}>
                fila: {it.fila} {it.fila === 1 ? 'item' : 'itens'}
              </Meta>
            </span>
          </Tooltip>
          <span className={cn(it.pendentes > 0 && 'text-foreground font-medium')}>
            {it.pendentes} {it.pendentes === 1 ? 'cartão pendente' : 'cartões pendentes'}
          </span>
          {contexto && <span>contexto: {contexto}</span>}
          {limite && (
            <Tooltip conteudo={`Você usou ${limite.usado}% do seu limite de 5 horas · renova ${limite.renova}`}>
              <span className="flex items-center gap-1.5">
                limite de IA
                <span className="bg-sunken h-1 w-16 overflow-hidden rounded-full" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={limite.usado} aria-label="Limite de IA de 5 horas">
                  <span className="block h-full rounded-full" style={{ width: `${Math.min(limite.usado, 100)}%`, background: tomLimite }} />
                </span>
                <span className="tabular-nums">{limite.usado}%</span>
              </span>
            </Tooltip>
          )}
        </div>
      </div>
      {(onPausar || onVerMemoria || onConfigurar || onHistorico) && (
      <Popover open={menu} onOpenChange={setMenu}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full" aria-label="Mais opções do integrante">
            <DotsThreeIcon weight="bold" className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 p-1">
          {it.tipo !== 'geral' && (
            <ItemMenu icone={pausado ? <PlayIcon /> : <PauseIcon />} onClick={escolher(onPausar)}>
              {pausado ? 'Retomar' : 'Pausar'}
              <span className="text-muted-foreground block text-xs">{pausado ? 'volta a rodar jobs e gatilhos' : 'para jobs e gatilhos; o chat responde'}</span>
            </ItemMenu>
          )}
          <ItemMenu icone={<BrainIcon />} onClick={escolher(onVerMemoria)}>
            Ver memória
          </ItemMenu>
          <ItemMenu icone={<GearSixIcon />} onClick={escolher(onConfigurar)}>
            Configurar
          </ItemMenu>
          <ItemMenu icone={<ClockCounterClockwiseIcon />} onClick={escolher(onHistorico)}>
            Histórico do mês passado
          </ItemMenu>
        </PopoverContent>
      </Popover>
      )}
    </header>
  )
}

function Meta({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 [&_svg]:size-3.5">
      {icone}
      {children}
    </span>
  )
}

function ItemMenu({ icone, children, onClick }: { icone: ReactNode; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="hover:bg-accent flex w-full cursor-pointer items-start gap-2.5 rounded-md px-3 py-2 text-left text-sm [&_svg]:mt-0.5 [&_svg]:size-4">
      <span className="text-muted-foreground">{icone}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  )
}

/**
 * Faixa acima do campo do chat (02, 9.2): os cartões que ainda pedem decisão
 * nesta conversa. Conta ao vivo (decidiu, baixa) e leva ao primeiro deles. O
 * que o integrante está fazendo aparece no próprio chat, com as etapas.
 */
export function FilaIntegrante({ integrante: it, className }: { integrante: Integrante; className?: string }) {
  if (!it.pendentes) return null
  const irAoPrimeiro = () => document.querySelector('[data-cartao-pendente]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return (
    <div className={cn('bg-sunken flex items-center gap-3 rounded-xl px-3 py-2 text-xs', className)}>
      <span className="text-muted-foreground min-w-0 flex-1 truncate">{it.pendentes === 1 ? 'Um cartão nesta conversa espera sua decisão.' : `${it.pendentes} cartões nesta conversa esperam sua decisão.`}</span>
      <button type="button" onClick={irAoPrimeiro} className="shrink-0 cursor-pointer font-medium underline-offset-4 hover:underline">
        Ver {it.pendentes === 1 ? 'o cartão' : 'o primeiro'}
      </button>
    </div>
  )
}
