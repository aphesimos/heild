import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet'

/**
 * Kit de formulário do sistema: a gaveta de cadastro e edição e os campos.
 * Todo cadastro (modelo, etiqueta, horário, lead, régua…) usa estas peças, para
 * que criar e editar tenha sempre a mesma cara: gaveta à direita, campos com
 * rótulo e ajuda, rodapé fixo com Cancelar e a ação principal.
 */
export function GavetaFormulario({
  aberta,
  onFechar,
  titulo,
  descricao,
  children,
  acao,
  onAcao,
  acaoDesabilitada,
  secundaria,
  largura = 'md',
}: {
  aberta: boolean
  onFechar: () => void
  titulo: string
  descricao?: string
  children: ReactNode
  /** Rótulo da ação principal ("Salvar", "Enviar à Meta"). */
  acao: string
  onAcao: () => void
  acaoDesabilitada?: boolean
  /** Ação à esquerda do rodapé (ex.: "Excluir", "Arquivar"). */
  secundaria?: ReactNode
  largura?: 'md' | 'lg'
}) {
  return (
    <Sheet open={aberta} onOpenChange={(v) => !v && onFechar()}>
      {/* Abre com o foco na gaveta, não no primeiro campo (senão o valor aparece todo selecionado). */}
      <SheetContent
        className={cn('gap-0', largura === 'lg' ? 'sm:max-w-xl' : 'sm:max-w-md')}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement | null)?.focus()
        }}
      >
        <SheetHeader>
          <SheetTitle>{titulo}</SheetTitle>
          {descricao && <SheetDescription>{descricao}</SheetDescription>}
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            if (!acaoDesabilitada) onAcao()
          }}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">{children}</div>
          <footer className="flex items-center gap-2 border-t p-3">
            {secundaria}
            <Button type="button" variant="ghost" className="ml-auto rounded-full" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit" className="rounded-full" disabled={acaoDesabilitada}>
              {acao}
            </Button>
          </footer>
        </form>
      </SheetContent>
    </Sheet>
  )
}

/** Um campo: rótulo, controle e ajuda (ou erro). */
export function Campo({ rotulo, ajuda, erro, children, className }: { rotulo: string; ajuda?: ReactNode; erro?: string; children: (id: string) => ReactNode; className?: string }) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </label>
      {children(id)}
      {erro ? <p className="text-destructive text-xs">{erro}</p> : ajuda ? <p className="text-muted-foreground text-xs">{ajuda}</p> : null}
    </div>
  )
}

const baseControle = 'bg-raised shadow-contorno placeholder:text-muted-foreground w-full rounded-[12px] px-3 text-sm outline-none focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:opacity-50'

export function CampoTexto({
  id,
  valor,
  onMudar,
  placeholder,
  tipo = 'text',
  mono,
  className,
  ...resto
}: {
  id?: string
  valor: string
  onMudar: (v: string) => void
  placeholder?: string
  tipo?: string
  mono?: boolean
  className?: string
  min?: number
  max?: number
  'aria-label'?: string
}) {
  return <input id={id} type={tipo} value={valor} onChange={(e) => onMudar(e.target.value)} placeholder={placeholder} className={cn(baseControle, 'h-10', mono && 'font-mono', className)} {...resto} />
}

export function CampoArea({ id, valor, onMudar, placeholder, linhas = 4 }: { id?: string; valor: string; onMudar: (v: string) => void; placeholder?: string; linhas?: number }) {
  return <textarea id={id} value={valor} onChange={(e) => onMudar(e.target.value)} placeholder={placeholder} rows={linhas} className={cn(baseControle, 'resize-y py-2.5 leading-relaxed')} />
}

export function CampoEscolha<T extends string>({
  id,
  valor,
  onMudar,
  opcoes,
  rotulo,
}: {
  id?: string
  valor: T
  onMudar: (v: T) => void
  opcoes: { valor: T; rotulo: string }[]
  /** Rótulo acessível quando não há Campo em volta. */ rotulo?: string
}) {
  return (
    <span className="relative">
      <select id={id} aria-label={rotulo} value={valor} onChange={(e) => onMudar(e.target.value as T)} className={cn(baseControle, 'h-10 cursor-pointer appearance-none pr-9')}>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      <CaretDownIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </span>
  )
}

/** Escolha única em pílulas (poucas opções). */
export function Segmentado<T extends string>({ valor, onMudar, opcoes, rotulo }: { valor: T; onMudar: (v: T) => void; opcoes: { valor: T; rotulo: string }[]; rotulo: string }) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="bg-sunken flex w-fit flex-wrap rounded-full p-0.5 text-xs">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          onClick={() => onMudar(o.valor)}
          className={cn('grid cursor-pointer rounded-full px-3 py-1.5', valor === o.valor ? 'bg-raised shadow-pilula' : 'text-muted-foreground hover:text-foreground')}
        >
          {/* Reserva a largura do negrito: escolher uma opção não empurra as outras. */}
          <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
            {o.rotulo}
          </span>
          <span className={cn('col-start-1 row-start-1 text-center', valor === o.valor && 'font-medium')}>{o.rotulo}</span>
        </button>
      ))}
    </div>
  )
}

/** Escolha múltipla em fichas (setores, dias da semana, números). */
export function Fichas<T extends string>({ valores, onMudar, opcoes, rotulo }: { valores: T[]; onMudar: (v: T[]) => void; opcoes: { valor: T; rotulo: string }[]; rotulo: string }) {
  return (
    <div role="group" aria-label={rotulo} className="flex flex-wrap gap-1.5">
      {opcoes.map((o) => {
        const ativo = valores.includes(o.valor)
        return (
          <button
            key={o.valor}
            type="button"
            aria-pressed={ativo}
            onClick={() => onMudar(ativo ? valores.filter((v) => v !== o.valor) : [...valores, o.valor])}
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors',
              ativo ? 'border-foreground/30 bg-raised text-foreground font-medium' : 'text-muted-foreground border-border hover:text-foreground',
            )}
          >
            {ativo && <CheckIcon weight="bold" className="size-3" />}
            {o.rotulo}
          </button>
        )
      })}
    </div>
  )
}

/** Liga/desliga com rótulo e detalhe. */
export function Interruptor({ ligado, onMudar, rotulo, detalhe, desabilitado, ocultarRotulo }: { ligado: boolean; onMudar: (v: boolean) => void; rotulo: string; detalhe?: ReactNode; desabilitado?: boolean; ocultarRotulo?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3', desabilitado && 'cursor-not-allowed opacity-60')}>
      <span className={cn('min-w-0 flex-1', ocultarRotulo && 'sr-only')}>
        <span className="block text-sm">{rotulo}</span>
        {detalhe && <span className="text-muted-foreground block text-xs">{detalhe}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-label={rotulo}
        disabled={desabilitado}
        onClick={() => onMudar(!ligado)}
        className={cn('relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed', ligado ? 'bg-foreground' : 'bg-sunken shadow-contorno')}
      >
        <span className={cn('bg-background shadow-pilula absolute top-0.5 size-5 rounded-full transition-all', ligado ? 'left-[18px]' : 'left-0.5')} />
      </button>
    </label>
  )
}

/** Cabeçalho de seção de configuração com o botão de adicionar. */
export function CabecalhoSecao({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-medium">{titulo}</h3>
        {descricao && <p className="text-muted-foreground text-sm">{descricao}</p>}
      </div>
      {acao}
    </header>
  )
}

/** Passos de um fluxo em gaveta (conectar, importar, reajustar): barras com o nome de cada etapa. */
export function Passos({ passos, atual }: { passos: string[]; atual: number }) {
  return (
    <ol className="flex gap-1.5" aria-label="Passos">
      {passos.map((p, i) => (
        <li key={p} className="flex min-w-0 flex-1 flex-col gap-1" aria-current={i === atual ? 'step' : undefined}>
          <span className={cn('h-1.5 rounded-full', i < atual ? 'bg-success' : i === atual ? 'bg-foreground' : 'bg-sunken')} />
          <span className={cn('truncate text-[11px]', i === atual ? 'font-medium' : 'text-muted-foreground')}>{p}</span>
        </li>
      ))}
    </ol>
  )
}

/** Texto que fica em negrito quando ativo sem mudar de largura (pílulas e abas não "pulam"). */
export function TextoFixo({ children, ativo }: { children: ReactNode; ativo: boolean }) {
  return (
    <span className="inline-grid">
      <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
        {children}
      </span>
      <span className={cn('col-start-1 row-start-1 text-center', ativo && 'font-medium')}>{children}</span>
    </span>
  )
}
