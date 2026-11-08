import { ArrowSquareOutIcon, BankIcon, BuildingsIcon, CheckIcon, WarningIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CampoEscolha, Segmentado } from '@/components/ui/formulario'
import { Tooltip } from '@/components/ui/tooltip'
import type { ContaPagar, Titular } from '@/dados/financeiro'
import { cn } from '@/lib/utils'
import { brl } from './comum'

/*
 * Peças do financeiro com titular (DA-02.1): as mesmas para o caixa do
 * escritório e, no BPO, para o de cada empresa cliente. Nenhuma delas paga:
 * aprovar agenda, e a liberação final é sempre de uma pessoa, no banco.
 */

/** De quem é o dinheiro desta tela. */
export function SeloTitular({ titular, className }: { titular: Titular; className?: string }) {
  return (
    <span className={cn('bg-sunken text-muted-foreground inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs', className)} title="Titular dos dados financeiros desta tela">
      <BuildingsIcon className="size-3.5 shrink-0" />
      <span className="truncate">
        titular: <span className="text-foreground">{titular.nome}</span> · {titular.tipo === 'escritorio' ? 'escritório' : 'empresa do BPO'}
      </span>
    </span>
  )
}

export interface ContaBancaria {
  id: string
  nome: string
  saldo: number
  atualizado: string
  via: string
  fatura?: string
}

/** Quanto temos? Saldos das contas conectadas. */
export function SaldosContas({ bancos, aPagar30, acao }: { bancos: ContaBancaria[]; aPagar30: number; acao?: ReactNode }) {
  const disponivel = bancos.filter((b) => b.saldo > 0).reduce((s, b) => s + b.saldo, 0)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-2">
        <span className="flex flex-1 flex-col">
          <span className="font-heading text-2xl font-light tabular-nums sm:text-3xl">{brl(disponivel)}</span>
          <span className="text-muted-foreground text-xs">disponível nas contas · {brl(aPagar30)} a pagar nos próximos 30 dias</span>
        </span>
        {acao}
      </div>
      <ul className="divide-border/70 flex flex-col divide-y">
        {bancos.map((b) => (
          <li key={b.id} className="flex items-center gap-3 py-2 text-sm">
            <BankIcon className="text-muted-foreground size-5 shrink-0" weight="duotone" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{b.nome}</span>
              <span className="text-muted-foreground block text-xs">
                {b.via} · {b.atualizado}
                {b.fatura && ` · ${b.fatura}`}
              </span>
            </span>
            <span className={cn('tabular-nums', b.saldo < 0 && 'text-destructive')}>{brl(b.saldo).replace('-', '−')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Listras para o que é projetado (mesma linguagem da confiança "estimada" do Timesheet). */
const listras = (cor: string) => `repeating-linear-gradient(135deg, ${cor} 0 3px, transparent 3px 6px)`

export interface DadosFluxo {
  meses: string[]
  entradas: number[]
  saidas: number[]
  /** Índice do primeiro mês projetado. */
  inicio: number
  marcos: { mes: number; texto: string }[]
}

/** Entradas e saídas por mês, em milhares; meses projetados listrados. Um eixo só. */
export function FluxoMensal({ d, altura = 'h-44', ajuste = 0 }: { d: DadosFluxo; altura?: string; /** Simulação: soma (em mil) às entradas projetadas. */ ajuste?: number }) {
  const entradas = d.entradas.map((v, i) => (i >= d.inicio ? Math.max(0, v + ajuste) : v))
  const max = Math.max(...entradas, ...d.saidas)
  const corE = 'color-mix(in oklab, var(--foreground) 72%, transparent)'
  const corS = 'color-mix(in oklab, var(--foreground) 30%, transparent)'
  return (
    <div className="flex flex-col gap-2">
      <div className={cn('flex items-end gap-1.5 sm:gap-3', altura)} role="img" aria-label={`Entradas e saídas por mês, em mil reais: ${d.meses.map((m, i) => `${m} ${entradas[i]} e ${d.saidas[i]}`).join('; ')}`}>
        {d.meses.map((m, i) => {
          const proj = i >= d.inicio
          const marco = d.marcos.find((x) => x.mes === i)
          return (
            <Tooltip key={m} conteudo={`${m}${proj ? ' (projetado)' : ''}: entram R$ ${entradas[i]} mil, saem R$ ${d.saidas[i]} mil, sobra R$ ${entradas[i] - d.saidas[i]} mil${marco ? ` · ${marco.texto}` : ''}`}>
              <span className="relative flex h-full flex-1 items-end justify-center gap-[2px]">
                {marco && <span className="bg-warning absolute -top-1 size-2 rounded-full ring-2 ring-[var(--surface)]" />}
                <span className="w-full max-w-4 rounded-t-[4px]" style={{ height: `${(entradas[i] / max) * 100}%`, background: proj ? listras(corE) : corE, boxShadow: proj ? `inset 0 0 0 1px ${corE}` : undefined }} />
                <span className="w-full max-w-4 rounded-t-[4px]" style={{ height: `${(d.saidas[i] / max) * 100}%`, background: proj ? listras(corS) : corS, boxShadow: proj ? `inset 0 0 0 1px ${corS}` : undefined }} />
              </span>
            </Tooltip>
          )
        })}
      </div>
      <div className="text-muted-foreground flex gap-1.5 text-[11px] sm:gap-3">
        {d.meses.map((m, i) => (
          <span key={m} className={cn('flex-1 text-center', i === d.inicio && 'text-foreground font-medium')}>
            {m}
          </span>
        ))}
      </div>
      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px]" style={{ background: corE }} /> entradas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px]" style={{ background: corS }} /> saídas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px]" style={{ background: listras(corE), boxShadow: `inset 0 0 0 1px ${corE}` }} /> projetado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-warning size-2 rounded-full" /> marco
        </span>
      </div>
    </div>
  )
}

const rotuloConta: Record<ContaPagar['situacao'], string> = { a_aprovar: 'a aprovar', aprovada: 'aprovada', agendada: 'agendada no banco', paga: 'paga' }
type FiltroConta = 'todas' | ContaPagar['situacao']

/**
 * Fila de contas a pagar por estado, com a alçada de cada uma (09, 6.1).
 * Quem não tem alçada para o valor vê "pedir aprovação" no lugar de aprovar.
 */
export function FilaContasPagar({
  contas,
  limite,
  onAprovar,
  onPedir,
  abrirExterno,
}: {
  contas: ContaPagar[]
  /** Até quanto esta pessoa aprova. */
  limite: number
  onAprovar: (ids: string[]) => void
  /** Acima do limite: manda o cartão para quem pode (Administrador ou, no BPO, o cliente). */
  onPedir: (c: ContaPagar) => void
  /** BPO: "abrir no ERP" do cliente. */
  abrirExterno?: { rotulo: string; onAbrir: (c: ContaPagar) => void }
}) {
  const [filtro, setFiltro] = useState<FiltroConta>('a_aprovar')
  const [marcadas, setMarcadas] = useState<string[]>([])
  const lista = contas.filter((c) => filtro === 'todas' || c.situacao === filtro)
  const aprovaveis = lista.filter((c) => c.situacao === 'a_aprovar' && c.valor <= limite && !c.alerta)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmentado
          rotulo="Estado das contas"
          valor={filtro}
          onMudar={(v) => {
            setFiltro(v)
            setMarcadas([])
          }}
          opcoes={[
            { valor: 'a_aprovar', rotulo: `A aprovar (${contas.filter((c) => c.situacao === 'a_aprovar').length})` },
            { valor: 'agendada', rotulo: 'Agendadas' },
            { valor: 'paga', rotulo: 'Pagas' },
            { valor: 'todas', rotulo: 'Todas' },
          ]}
        />
        <span className="flex-1" />
        {marcadas.length > 0 ? (
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              onAprovar(marcadas)
              setMarcadas([])
            }}
          >
            <CheckIcon /> Aprovar e agendar {marcadas.length}
          </Button>
        ) : (
          aprovaveis.length > 0 && (
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setMarcadas(aprovaveis.map((c) => c.id))}>
              Marcar as {aprovaveis.length} dentro da sua alçada
            </Button>
          )
        )}
      </div>
      {lista.length === 0 && <p className="text-muted-foreground py-4 text-sm">Nada neste estado.</p>}
      <ul className="divide-border/70 flex flex-col divide-y">
        {lista.map((c) => {
          const acima = c.valor > limite
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <input
                type="checkbox"
                aria-label={`Marcar ${c.fornecedor}`}
                disabled={c.situacao !== 'a_aprovar' || acima || !!c.alerta}
                checked={marcadas.includes(c.id)}
                onChange={(e) => setMarcadas((xs) => (e.target.checked ? [...xs, c.id] : xs.filter((x) => x !== c.id)))}
                className="accent-foreground size-4 shrink-0 cursor-pointer disabled:cursor-default disabled:opacity-30"
              />
              <span className="min-w-0 flex-1 basis-56">
                <span className="block truncate">{c.fornecedor}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {c.categoria} · vence {c.vencimento} · via {c.origem}
                  {c.alcada && c.situacao === 'a_aprovar' && ` · ${c.alcada}`}
                </span>
                {c.alerta && (
                  <span className="text-warning-foreground flex items-center gap-1 text-xs">
                    <WarningIcon className="text-warning size-3.5" weight="fill" /> {c.alerta}
                  </span>
                )}
              </span>
              <Badge variant={c.situacao === 'a_aprovar' ? 'destaque' : c.situacao === 'paga' ? 'sucesso' : 'outline'} className="hidden sm:inline-flex">
                {rotuloConta[c.situacao]}
              </Badge>
              <span className="w-24 text-right tabular-nums">{brl(c.valor, true)}</span>
              {c.situacao === 'a_aprovar' && (acima || c.alerta) && (
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onPedir(c)}>
                  {c.alerta ? 'Conferir' : 'Pedir aprovação'}
                </Button>
              )}
              {abrirExterno && (
                <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`${abrirExterno.rotulo}: ${c.fornecedor}`} title={abrirExterno.rotulo} onClick={() => abrirExterno.onAbrir(c)}>
                  <ArrowSquareOutIcon />
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export interface Transacao {
  id: string
  data: string
  conta: string
  descricao: string
  valor: number
  sugestao: string
  confianca: string
}

/** O que sobrou da conciliação automática, com a sugestão do integrante (09, 6.2). */
export function PendentesConciliacao({
  transacoes,
  categorias,
  onConfirmar,
  onAceitarSeguras,
  abrirExterno,
}: {
  transacoes: Transacao[]
  categorias: string[]
  onConfirmar: (id: string, categoria: string) => void
  onAceitarSeguras: () => void
  abrirExterno?: { rotulo: string; onAbrir: (t: Transacao) => void }
}) {
  const [escolha, setEscolha] = useState<Record<string, string>>({})
  return (
    <div className="flex flex-col gap-2">
      {transacoes.some((t) => t.confianca === 'alta') && (
        <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={onAceitarSeguras}>
          <CheckIcon /> Aceitar as sugestões seguras ({transacoes.filter((t) => t.confianca === 'alta').length})
        </Button>
      )}
      {transacoes.length === 0 ? (
        <p className="text-muted-foreground py-4 text-sm">Tudo conciliado até hoje.</p>
      ) : (
        <ul className="divide-border/70 flex flex-col divide-y">
          {transacoes.map((t) => (
            <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-2.5 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)_7rem_auto]">
              <span className="min-w-0">
                <span className="block truncate font-mono text-xs">{t.descricao}</span>
                <span className="text-muted-foreground block text-xs">
                  {t.data} · {t.conta}
                  {t.confianca === 'baixa' && ' · sugestão incerta'}
                </span>
              </span>
              <span className="text-right tabular-nums md:order-3">{brl(t.valor, true).replace('-', '−')}</span>
              <span className="col-span-2 md:order-2 md:col-span-1">
                <CampoEscolha
                  rotulo={`Categoria de ${t.descricao}`}
                  valor={escolha[t.id] ?? t.sugestao}
                  onMudar={(v) => setEscolha((x) => ({ ...x, [t.id]: v }))}
                  opcoes={[...new Set([t.sugestao, ...categorias])].map((x) => ({ valor: x, rotulo: x }))}
                />
              </span>
              <span className="col-start-2 row-start-1 flex justify-end gap-1 md:order-4 md:col-start-auto md:row-start-auto">
                {abrirExterno && (
                  <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`${abrirExterno.rotulo}: ${t.descricao}`} title={abrirExterno.rotulo} onClick={() => abrirExterno.onAbrir(t)}>
                    <ArrowSquareOutIcon />
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onConfirmar(t.id, escolha[t.id] ?? t.sugestao)}>
                  <CheckIcon /> Ok
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
