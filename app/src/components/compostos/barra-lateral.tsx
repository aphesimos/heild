import { CaretDoubleLeft, CaretDoubleRight, LifebuoyIcon, Moon, SignOut, Sun, UserGear, type Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Contador } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { ehHeild, logosDoModo, Marca, MarcaHeild } from './marca'

export interface ItemLateral {
  id: string
  rotulo: string
  /** Ícone Phosphor: duotone quando inativo, preenchido quando ativo. */
  Icone: Icon
  contador?: number
}

interface Props {
  itens: ItemLateral[]
  ativo: string
  onTrocar: (id: string) => void
  usuario: { nome: string; papel: string; setores: string[] }
  /** Configurações, no pé da barra (só Administrador, 03 2.0). */
  configuracoes?: ItemLateral
  aberta: boolean
  onAlternar: () => void
  onAlternarModo?: () => void
  /** Abre as preferências da própria conta (avisos, senha, segundo fator). */
  onMinhaConta?: () => void
  onSair?: () => void
  /** Suporte da plataforma (para toda conta). */
  onSuporte?: () => void
  className?: string
}

export const LARGURA_FECHADA = 76
export const LARGURA_ABERTA = 248

const mola = { type: 'spring', stiffness: 420, damping: 40 } as const

/**
 * Barra lateral dos módulos (design do usuário; 03, 2.0). Fechada mostra só os
 * ícones; aberta mostra os nomes, com animação. Quem decide se empurra o
 * conteúdo ou passa por cima é a Moldura, pela largura da tela.
 */
export function BarraLateral({ itens, ativo, onTrocar, usuario, configuracoes, aberta, onAlternar, onAlternarModo, onMinhaConta, onSair, onSuporte, className }: Props) {
  const { modo } = useTema()
  const Alternar = aberta ? CaretDoubleLeft : CaretDoubleRight

  return (
    <motion.nav
      aria-label="Módulos"
      initial={false}
      animate={{ width: aberta ? LARGURA_ABERTA : LARGURA_FECHADA }}
      transition={mola}
      className={cn('from-sidebar to-sidebar-end flex h-full flex-col overflow-hidden bg-gradient-to-b py-4', className)}
    >
      {/*
        Marca, solta, sem moldura. Heild: HEILD aberta e HE fechada, com a troca
        animada. Marca branca: a logo completa do escritório aberta e o logotipo
        dele fechada, sem animação.
      */}
      <div className="flex h-12 shrink-0 items-center px-[16px]">
        <Marca aberta={aberta} />
      </div>

      <ul className="mt-6 flex flex-col gap-1 px-[16px]">
        {itens.map((it) => (
          <li key={it.id}>
            <ItemModulo item={it} ativo={it.id === ativo} aberta={aberta} onClick={() => onTrocar(it.id)} />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-1.5 px-[16px]">
        {onSuporte && (
          <ItemAcao aberta={aberta} rotulo="Suporte" onClick={onSuporte}>
            <LifebuoyIcon className="size-[18px]" />
          </ItemAcao>
        )}
        <ItemAcao aberta={aberta} rotulo={aberta ? 'Recolher' : 'Expandir'} onClick={onAlternar} atalho="Ctrl+B" expande>
          <Alternar className="size-[18px]" />
        </ItemAcao>
        <span className="bg-muted-foreground/40 my-1 h-px" />
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" aria-label="Conta" className="hover:bg-raised/50 flex h-11 cursor-pointer items-center gap-2.5 rounded-full text-left transition-colors">
              <Avatar nome={usuario.nome} tamanho="lg" className="ring-background size-11 ring-2" />
              <Rotulo aberta={aberta} className="leading-tight">
                <span className="block truncate text-sm font-medium">{usuario.nome}</span>
                <span className="text-muted-foreground block truncate text-xs">{usuario.papel}</span>
              </Rotulo>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-60 p-1">
            <div className="px-3 py-2">
              <div className="text-sm font-medium">{usuario.nome}</div>
              <div className="text-muted-foreground text-xs">
                {usuario.papel} · {usuario.setores.join(', ')}
              </div>
            </div>
            {onAlternarModo && (
              <ItemMenu onClick={onAlternarModo} icone={modo === 'escuro' ? <Sun /> : <Moon />}>
                {modo === 'escuro' ? 'Modo claro' : 'Modo escuro'}
              </ItemMenu>
            )}
            {onMinhaConta && (
              <ItemMenu onClick={onMinhaConta} icone={<UserGear />}>
                Minha conta
              </ItemMenu>
            )}
            <ItemMenu onClick={onSair} icone={<SignOut />}>
              Sair
            </ItemMenu>
          </PopoverContent>
        </Popover>
        {configuracoes && <ItemModulo item={configuracoes} ativo={configuracoes.id === ativo} aberta={aberta} onClick={() => onTrocar(configuracoes.id)} />}
      </div>
    </motion.nav>
  )
}

/** Texto que aparece com a barra aberta. */
function Rotulo({ aberta, children, className }: { aberta: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {aberta && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.06, duration: 0.18 } }}
          exit={{ opacity: 0, x: -6, transition: { duration: 0.1 } }}
          className={cn('min-w-0 flex-1 truncate whitespace-nowrap', className)}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function ItemModulo({ item, ativo, aberta, onClick }: { item: ItemLateral; ativo: boolean; aberta: boolean; onClick: () => void }) {
  const { Icone } = item
  const botao = (
    <button
      type="button"
      onClick={onClick}
      aria-label={aberta ? undefined : item.rotulo}
      aria-current={ativo ? 'page' : undefined}
      className={cn(
        'group relative flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-[14px] text-left transition-colors',
        ativo ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        aberta && !ativo && 'hover:bg-raised/50',
      )}
    >
      {/* Ativo: traço na borda da barra; aberta, também o fundo da linha. */}
      {ativo && <motion.span layoutId="lateral-traco" transition={mola} className="bg-foreground absolute top-2.5 -left-4 h-6 w-[3px] rounded-r-full" />}
      {ativo && aberta && <motion.span layoutId="lateral-fundo" transition={mola} className="bg-raised absolute inset-0 rounded-[14px] shadow-cartao" />}
      <span className="relative flex size-11 shrink-0 items-center justify-center">
        <Icone weight={ativo ? 'fill' : 'duotone'} className="size-[26px] transition-transform group-hover:scale-105" />
        <Contador valor={item.contador ?? 0} className="absolute top-0.5 right-0.5" />
      </span>
      <Rotulo aberta={aberta} className={cn('relative text-[15px]', ativo && 'font-medium')}>
        {item.rotulo}
      </Rotulo>
    </button>
  )
  return aberta ? (
    botao
  ) : (
    <Tooltip conteudo={item.rotulo} lado="right">
      {botao}
    </Tooltip>
  )
}

function ItemAcao({ aberta, rotulo, onClick, atalho, expande, children }: { aberta: boolean; rotulo: string; onClick: () => void; atalho?: string; /** Controla a abertura da barra (Recolher/Expandir). */ expande?: boolean; children: ReactNode }) {
  const botao = (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      aria-expanded={expande ? aberta : undefined}
      className="text-muted-foreground hover:text-foreground hover:bg-raised/50 flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[14px] text-left transition-colors"
    >
      <span className="flex size-11 shrink-0 items-center justify-center">{children}</span>
      <Rotulo aberta={aberta} className="text-xs">
        {rotulo}
        {atalho && <kbd className="text-muted-foreground/80 ml-2 font-sans">{atalho}</kbd>}
      </Rotulo>
    </button>
  )
  return aberta ? (
    botao
  ) : (
    <Tooltip conteudo={`${rotulo}${atalho ? ` (${atalho})` : ''}`} lado="right">
      {botao}
    </Tooltip>
  )
}

function ItemMenu({ icone, children, onClick }: { icone: ReactNode; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm [&_svg]:size-4">
      <span className="text-muted-foreground">{icone}</span>
      {children}
    </button>
  )
}

/** Marca curta do sistema (o HE da Heild, ou o logotipo/sigla do escritório), num quadrado de 44 px. */
export function SiglaMarca() {
  const { tema, modo } = useTema()
  const { logotipo } = logosDoModo(tema, modo)
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center">
      {ehHeild(tema) ? (
        <MarcaHeild aberta={false} />
      ) : logotipo ? (
        <img src={logotipo} alt={tema.nome_produto} className="max-h-9 w-auto max-w-11 object-contain" />
      ) : (
        <span className="text-foreground text-[26px] leading-none font-semibold tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }} aria-label={tema.nome_produto}>
          {tema.sigla}
        </span>
      )}
    </span>
  )
}
