import {
  AppWindowIcon,
  ArrowsLeftRightIcon,
  BankIcon,
  CalendarCheckIcon,
  ChartBarIcon,
  ChatCircleDotsIcon,
  CheckIcon,
  CoinsIcon,
  FileTextIcon,
  FilesIcon,
  FolderSimpleIcon,
  GaugeIcon,
  GearSixIcon,
  ListChecksIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  StackIcon,
  TimerIcon,
  TrayIcon,
  UserSwitchIcon,
  WalletIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { empresasBpo, escalonamentoBpo, filaBpo, lotesBpo, passosEscalonamento, rotuloModoErp, rotuloModoPagamento, rotuloSync, type CorAudit, type EmpresaBpo } from '@/dados/bpo'
import { cn } from '@/lib/utils'
import { BarraMini, LinhaMini, NumeroMini, type AbaMini } from './PainelMini'
import { ReservaAltura } from './Estavel'
import { Contador, Pares, Ponto, Secao, SecaoNaoCore, SecaoPainelAbas, brl, type ItemNaoCore, type Tom } from './SecaoProduto'
import { useVisto } from './Vivos'

/**
 * As seções da Heild BPO que mostram o produto: o Painel do BPO aba por aba,
 * a aprovação do cliente pela alçada, a conciliação com o relatório do mês e
 * o resto do escritório no mesmo sistema. Dados de exemplo do pacote BPO.
 */
export function SecoesBpo() {
  return (
    <>
      <SecaoPainelBpo />
      <SecaoAprovacaoBpo />
      <SecaoConciliacaoBpo />
      <SecaoNaoCoreBpo />
    </>
  )
}

const tomAudit: Record<CorAudit, Tom> = { verde: 'ok', amarelo: 'atencao', vermelho: 'erro' }
const rotuloAudit: Record<CorAudit, string> = { verde: 'em dia', amarelo: 'atenção', vermelho: 'agir hoje' }
const empresa = (id: string) => empresasBpo.find((e) => e.clienteId === id) as EmpresaBpo
const curto = (nome: string) => nome.replace(/ (Ltda|ME|Eireli|S\.A\.)$/, '')
const padaria = empresa('c2')
const totalLote = (id: string) => lotesBpo.find((l) => l.id === id)?.itens.reduce((s, i) => s + i.valor, 0) ?? 0
const ordemAudit: CorAudit[] = ['vermelho', 'amarelo', 'verde']
const carteiraSub = `Carteira · ${empresasBpo.length} empresas`

/* ---------------- 1. O Painel do BPO ---------------- */

const abasBpo: (AbaMini & { linha: string })[] = [
  {
    id: 'visao',
    rotulo: 'Visão geral',
    linha: 'Abre pelo que precisa de decisão hoje, com o semáforo da auditoria contínua de cada empresa.',
    sub: carteiraSub,
    padrao: [
      { id: 'excecoes', tamanho: 'G' },
      { id: 'semaforo', tamanho: 'P' },
      { id: 'lotes', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'excecoes',
        titulo: 'Precisa de decisão hoje',
        icone: WarningCircleIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2.5">
            {[...empresasBpo]
              .filter((e) => e.audit.cor !== 'verde')
              .sort((a, b) => ordemAudit.indexOf(a.audit.cor) - ordemAudit.indexOf(b.audit.cor))
              .slice(0, t === 'G' ? 3 : 2)
              .map((e) => (
                <li key={e.clienteId} className="flex min-w-0 items-start gap-2.5 text-sm">
                  <Ponto tom={tomAudit[e.audit.cor]} className="mt-1.5" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{curto(e.nome)}</span>
                    <span className="text-muted-foreground truncate text-xs">{e.audit.motivos[0]}</span>
                  </span>
                </li>
              ))}
          </ul>
        ),
      },
      {
        id: 'semaforo',
        titulo: 'Auditoria contínua',
        icone: ShieldCheckIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {ordemAudit.map((c) => (
              <LinhaMini key={c} detalhe={empresasBpo.filter((e) => e.audit.cor === c).length}>
                <Ponto tom={tomAudit[c]} />
                {rotuloAudit[c]}
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'lotes',
        titulo: 'Lotes no app do cliente',
        icone: StackIcon,
        conteudo: () => <NumeroMini valor={<Contador valor={lotesBpo.reduce((s, l) => s + l.itens.reduce((x, i) => x + i.valor, 0), 0)} formato={brl} />} legenda={`${lotesBpo.length} lotes esperando aprovação`} />,
      },
      {
        id: 'caixa',
        titulo: 'Caixa contra o mínimo',
        icone: BankIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2.5">
            {empresasBpo.slice(0, 4).map((e, i) => {
              const saldo = e.bancos.reduce((s, b) => s + b.saldo, 0)
              return (
                <li key={e.clienteId} className="flex flex-col gap-1 text-sm">
                  <span className="flex justify-between gap-2">
                    <span className="truncate">{curto(e.nome)}</span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{brl(saldo)}</span>
                  </span>
                  <BarraMini valor={saldo} max={e.caixaMinimo * 3} tom={saldo < e.caixaMinimo ? 'erro' : 'neutro'} i={i} rotulo={`Caixa de ${e.nome}`} />
                </li>
              )
            })}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'carteira',
    rotulo: 'Carteira',
    linha: 'Cada empresa com o ERP que já usa: a Heild lê o espelho, e a aprovação e a trilha ficam aqui.',
    sub: carteiraSub,
    padrao: [
      { id: 'empresas', tamanho: 'G' },
      { id: 'erps', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'empresas',
        titulo: 'Empresas',
        icone: StackIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2">
            {empresasBpo.slice(0, t === 'G' ? 6 : 4).map((e) => (
              <LinhaMini key={e.clienteId} detalhe={t === 'G' ? `${e.erp.provedor} · ${rotuloSync[e.erp.situacao]}` : e.erp.provedor}>
                <Ponto tom={tomAudit[e.audit.cor]} />
                <span className="truncate">{curto(e.nome)}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'erps',
        titulo: 'Como a Heild lê o ERP',
        icone: ArrowsLeftRightIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {(['E1', 'E2', 'E3'] as const).map((m) => (
              <LinhaMini key={m} detalhe={empresasBpo.filter((e) => e.erp.modo === m).length}>
                <span className="truncate">{rotuloModoErp[m]}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'responsaveis',
        titulo: 'Responsáveis',
        icone: UserSwitchIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {empresasBpo.slice(0, 4).map((e) => (
              <LinhaMini key={e.clienteId} detalhe={e.analista}>
                <span className="truncate">{curto(e.nome)}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'fila',
    rotulo: 'Fila',
    linha: 'Os pedidos dos clientes pelo app, WhatsApp e e-mail e as pendências da operação, com a bola de cada um.',
    sub: carteiraSub,
    padrao: [
      { id: 'pedidos', tamanho: 'G' },
      { id: 'bola', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'pedidos',
        titulo: 'Fila e pedidos',
        icone: TrayIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2.5">
            {filaBpo.slice(0, t === 'G' ? 4 : 3).map((f) => (
              <li key={f.id} className="flex min-w-0 items-start gap-2.5 text-sm">
                <span className={cn('mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px]', f.bola === 'bpo' ? 'bg-foreground text-background' : 'bg-sunken text-muted-foreground')}>{f.bola === 'bpo' ? 'conosco' : 'com o cliente'}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{f.texto}</span>
                  {t === 'G' && <span className="text-muted-foreground truncate text-xs">{f.detalhe}</span>}
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'bola',
        titulo: 'Com quem está',
        icone: UserSwitchIcon,
        conteudo: () => (
          <div className="flex gap-6">
            <NumeroMini valor={filaBpo.filter((f) => f.bola === 'bpo').length} legenda="conosco" />
            <NumeroMini valor={filaBpo.filter((f) => f.bola === 'cliente').length} legenda="com o cliente" />
          </div>
        ),
      },
    ],
  },
  {
    id: 'rotinas',
    rotulo: 'Rotinas',
    linha: 'O checklist diário, semanal e mensal de cada empresa e o calendário único com as obrigações da contabilidade.',
    sub: `${padaria.nome} · hoje`,
    padrao: [
      { id: 'checklist', tamanho: 'G' },
      { id: 'feitas', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'checklist',
        titulo: 'Checklist',
        icone: ListChecksIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2">
            {padaria.rotinas.slice(0, t === 'G' ? 6 : 4).map((r) => (
              <LinhaMini key={r.id} detalhe={t === 'G' ? `${r.cadencia} · ${r.quando}` : r.quando}>
                <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full', r.feita ? 'bg-foreground text-background' : 'shadow-contorno')}>{r.feita && <CheckIcon className="size-2.5" weight="bold" />}</span>
                <span className={cn('truncate', r.feita && 'text-muted-foreground')}>{r.nome}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'feitas',
        titulo: 'Hoje',
        icone: CalendarCheckIcon,
        conteudo: () => {
          const diarias = padaria.rotinas.filter((r) => r.cadencia === 'diária')
          return (
            <div className="flex flex-col gap-3">
              <NumeroMini valor={`${diarias.filter((r) => r.feita).length} de ${diarias.length}`} legenda="rotinas diárias feitas" />
              <BarraMini valor={diarias.filter((r) => r.feita).length} max={diarias.length} rotulo="Rotinas diárias feitas" />
            </div>
          )
        },
      },
    ],
  },
  {
    id: 'aprovacoes',
    rotulo: 'Aprovações',
    linha: 'Primeiro a conferência interna, em que quem digita não confere; depois os lotes que viraram cartão no app do cliente.',
    sub: `${padaria.nome} · lote de hoje`,
    padrao: [
      { id: 'lote', tamanho: 'G' },
      { id: 'segregacao', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'lote',
        titulo: lotesBpo[0].titulo,
        icone: StackIcon,
        conteudo: (t) => (
          <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-1.5">
              {lotesBpo[0].itens.map((i) => (
                <LinhaMini key={i.conta} detalhe={brl(i.valor)}>
                  <Ponto tom={i.alerta ? 'atencao' : 'ok'} />
                  <span className="truncate">{i.fornecedor}</span>
                </LinhaMini>
              ))}
            </ul>
            {t === 'G' && <span className="text-muted-foreground truncate text-xs">Saldo {brl(lotesBpo[0].saldo)} · expira {lotesBpo[0].expira}</span>}
          </div>
        ),
      },
      {
        id: 'segregacao',
        titulo: 'Quem digita não confere',
        icone: SealCheckIcon,
        conteudo: () => {
          const c = padaria.contas.find((x) => x.id === 'pc3')
          return (
            <ul className="flex flex-col gap-2 text-sm">
              <LinhaMini detalhe={c?.digitadoPor}>digitou</LinhaMini>
              <LinhaMini detalhe={c?.conferidoPor}>conferiu</LinhaMini>
              <li className="text-muted-foreground truncate text-xs">{c?.fornecedor} · fornecedor novo</li>
            </ul>
          )
        },
      },
    ],
  },
  {
    id: 'entregas',
    rotulo: 'Entregas',
    linha: 'O que foi entregue a cada empresa no mês, o relatório e o fechamento à contabilidade, contra o SLA combinado.',
    sub: 'Outubro fechado e novembro em curso',
    padrao: [
      { id: 'sla', tamanho: 'G' },
      { id: 'media', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'sla',
        titulo: 'SLA por empresa',
        icone: GaugeIcon,
        conteudo: (t) => (
          <ul className={cn('grid gap-x-5 gap-y-2.5', t === 'G' && 'sm:grid-cols-2')}>
            {empresasBpo.map((e, i) => (
              <li key={e.clienteId} className="flex flex-col gap-1 text-sm">
                <span className="flex justify-between gap-2">
                  <span className="truncate">{curto(e.nome)}</span>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{e.sla.mes}%</span>
                </span>
                <BarraMini valor={e.sla.mes} tom={e.sla.mes < 90 ? 'erro' : 'neutro'} i={i} rotulo={`SLA de ${e.nome}`} />
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'media',
        titulo: 'SLA médio',
        icone: CalendarCheckIcon,
        conteudo: () => <NumeroMini valor={`${Math.round(empresasBpo.reduce((s, e) => s + e.sla.mes, 0) / empresasBpo.length)}%`} legenda={`${empresasBpo.reduce((s, e) => s + e.sla.desvios.length, 0)} desvios no mês`} />,
      },
    ],
  },
  {
    id: 'volume',
    rotulo: 'Volume',
    linha: 'Lançamentos do mês contra a faixa contratada. O que passa vira extra no Financeiro do escritório, com o seu ok.',
    sub: 'Novembro até hoje',
    padrao: [{ id: 'faixas', tamanho: 'G' }],
    widgets: [
      {
        id: 'faixas',
        titulo: 'Lançamentos contra a faixa',
        icone: ChartBarIcon,
        conteudo: (t) => (
          <ul className={cn('grid gap-x-5 gap-y-2.5', t === 'G' && 'sm:grid-cols-2')}>
            {empresasBpo
              .filter((e) => e.volume.lancamentos > 0)
              .map((e, i) => {
                const passou = e.volume.lancamentos > e.volume.limiteFaixa
                return (
                  <li key={e.clienteId} className="flex flex-col gap-1 text-sm">
                    <span className="flex justify-between gap-2">
                      <span className="truncate">{curto(e.nome)}</span>
                      <span className={cn('shrink-0 text-xs tabular-nums', passou ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                        {e.volume.lancamentos.toLocaleString('pt-BR')} de {e.volume.limiteFaixa.toLocaleString('pt-BR')}
                      </span>
                    </span>
                    <BarraMini valor={e.volume.lancamentos} max={e.volume.limiteFaixa} tom={passou ? 'atencao' : 'neutro'} i={i} rotulo={`Volume de ${e.nome}`} />
                  </li>
                )
              })}
          </ul>
        ),
      },
      {
        id: 'pagamentos',
        titulo: 'Pagamentos no mês',
        icone: CoinsIcon,
        conteudo: () => <NumeroMini valor={<Contador valor={empresasBpo.reduce((s, e) => s + e.volume.pagamentos, 0)} />} legenda="pagamentos feitos pela carteira" />,
      },
    ],
  },
  {
    id: 'rentabilidade',
    rotulo: 'Rentabilidade',
    linha: 'As horas do Timesheet contra o honorário de cada empresa, e a carga de cada analista contra a capacidade.',
    sub: carteiraSub,
    padrao: [{ id: 'hora', tamanho: 'G' }],
    widgets: [
      {
        id: 'hora',
        titulo: 'Honorário por hora',
        icone: TimerIcon,
        conteudo: (t) => {
          const lista = empresasBpo.map((e) => ({ e, porHora: Math.round(e.honorarioBpo / e.horasMes) })).sort((a, b) => b.porHora - a.porHora)
          return (
            <ul className={cn('grid gap-x-5 gap-y-2.5', t === 'G' && 'sm:grid-cols-2')}>
              {lista.map(({ e, porHora }, i) => (
                <li key={e.clienteId} className="flex flex-col gap-1 text-sm">
                  <span className="flex justify-between gap-2">
                    <span className="truncate">{curto(e.nome)}</span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {brl(e.honorarioBpo)} · {e.horasMes.toLocaleString('pt-BR')} h
                    </span>
                  </span>
                  <BarraMini valor={porHora} max={lista[0].porHora} i={i} rotulo={`${brl(porHora)} por hora em ${e.nome}`} />
                </li>
              ))}
            </ul>
          )
        },
      },
    ],
  },
  {
    id: 'configuracao',
    rotulo: 'Configuração',
    linha: 'Por empresa: o ERP e o modo, as contas bancárias, o modo de pagamento, as alçadas e a janela de aprovação.',
    sub: padaria.nome,
    padrao: [
      { id: 'alcadas', tamanho: 'P' },
      { id: 'janela', tamanho: 'P' },
      { id: 'erp', tamanho: 'G' },
    ],
    widgets: [
      {
        id: 'alcadas',
        titulo: 'Alçadas de pagamento',
        icone: ShieldCheckIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            <LinhaMini detalhe="1 aprovador">até {brl(padaria.alcadas.faixa2)}</LinhaMini>
            <LinhaMini detalhe="2 aprovadores">acima de {brl(padaria.alcadas.faixa2)}</LinhaMini>
            <li className="text-muted-foreground truncate text-xs">aceito por {padaria.alcadas.aceitoPor}</li>
          </ul>
        ),
      },
      {
        id: 'janela',
        titulo: 'Janela de aprovação',
        icone: CalendarCheckIcon,
        conteudo: () => (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm">{padaria.alcadas.janela}</span>
            <span className="text-muted-foreground text-xs">lembrete em 4 h, substituto em 8 h</span>
          </div>
        ),
      },
      {
        id: 'erp',
        titulo: 'ERP e pagamento',
        icone: GearSixIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            <LinhaMini detalhe={rotuloModoErp[padaria.erp.modo]}>{padaria.erp.provedor}</LinhaMini>
            <LinhaMini detalhe={rotuloModoPagamento[padaria.modoPagamento].split(' · ')[1]}>Modo de pagamento</LinhaMini>
            {padaria.bancos.map((b) => (
              <LinhaMini key={b.id} detalhe={b.via}>
                {b.nome}
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
]

function SecaoPainelBpo() {
  return (
    <SecaoPainelAbas
      id="painel-bpo"
      titulo="O Painel do BPO, da fila ao fechamento do mês."
      texto="Nove abas sobre o ERP que cada cliente já usa. A Heild lê o espelho e guarda a aprovação, a fila, o SLA e a trilha. Em Editar, cada pessoa arruma os widgets do seu jeito."
      abas={abasBpo}
      rotulo="Painel da Heild BPO, versão de demonstração"
    />
  )
}

/* ---------------- 2. A aprovação do cliente ---------------- */

const lotesDemo = lotesBpo.map((l) => {
  const e = empresa(l.clienteId)
  const esc = escalonamentoBpo[l.clienteId]
  const aprovadores = l.aprovadoresNecessarios > 1 && esc?.substituto ? [esc.aprovador, esc.substituto] : [esc?.aprovador ?? e.alcadas.aceitoPor.split(' (')[0]]
  return { l, e, esc, aprovadores, total: totalLote(l.id) }
})

function SecaoAprovacaoBpo() {
  const [k, setK] = useState(0)
  const [aprovados, setAprovados] = useState<Record<string, number>>({})
  const { l, e, esc, aprovadores } = lotesDemo[k]
  const feitos = aprovados[l.id] ?? 0
  const aprovar = () => setAprovados((x) => ({ ...x, [l.id]: Math.min(aprovadores.length, (x[l.id] ?? 0) + 1) }))
  const passos = esc ? passosEscalonamento(esc) : []
  return (
    <Secao
      id="aprovacao-bpo"
      titulo="A aprovação do cliente, dentro da alçada."
      texto="O Contas a Pagar monta o lote e uma pessoa confere. O lote vira um cartão no app do cliente: dentro da alçada, aprova quem tem alçada para o total; acima dela, dois aprovadores. Nada é pago sem o registro de quem aprovou."
      className="faixa-suave"
      visual={
        <div data-luz className="bg-background shadow-painel grid items-center gap-6 rounded-[28px] p-4 sm:p-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <div className="bg-surface shadow-cartao mx-auto flex w-full max-w-[300px] flex-col gap-3 rounded-[32px] p-3">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-muted-foreground text-xs">{curto(e.nome)}</span>
              <span className="text-muted-foreground text-xs">app do cliente</span>
            </div>
            {/* Cada lote tem um número de contas; o cartão reserva a altura do maior, para trocar de lote não mexer a seção. */}
            <ReservaAltura variantes={lotesDemo.filter((x) => x.l.id !== l.id).map((x) => <CartaoLote key={x.l.id} d={x} feitos={0} />)}>
              <CartaoLote key={l.id} d={lotesDemo[k]} feitos={feitos} onAprovar={aprovar} />
            </ReservaAltura>
          </div>
          <ReservaAltura variantes={lotesDemo.filter((x) => x.l.id !== l.id && x.esc).map((x) => <PassosEscalonamento key={x.l.id} passos={passosEscalonamento(x.esc!)} />)}>
            <PassosEscalonamento key={l.id} passos={passos} />
          </ReservaAltura>
        </div>
      }
    >
      <div role="tablist" aria-label="Lote de exemplo" className="flex flex-wrap gap-2">
        {lotesDemo.map((x, i) => (
          <button
            key={x.l.id}
            role="tab"
            type="button"
            aria-selected={k === i}
            onClick={() => setK(i)}
            className={cn('botao flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm transition-colors', k === i ? 'bg-primary text-primary-foreground' : 'bg-background shadow-contorno hover:bg-raised')}
          >
            {curto(x.e.nome)} <span className={cn('tabular-nums', k === i ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{brl(x.total)}</span>
          </button>
        ))}
      </div>
      <Pares
        itens={[
          ['A alçada é da empresa', 'Faixas, aprovadores e janela combinados com cada cliente, aceitos por ele e com vigência.'],
          ['Se ninguém responder', 'Lembrete, substituto e alerta ao gestor e ao sócio na véspera. Vencido, só alerta: nunca paga sozinho.'],
        ]}
      />
    </Secao>
  )
}

/* ---------------- 3. Conciliação e relatório do mês ---------------- */

const transacoes = empresasBpo.flatMap((e) => e.transacoes.map((t) => ({ ...t, empresa: curto(e.nome) })))

function SecaoConciliacaoBpo() {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useVisto(ref, { limiar: 0.35 })
  const [n, setN] = useState(0)
  const [aberta, setAberta] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
  useEffect(() => {
    if (!visto) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setN(transacoes.length)
    let i = 0
    const id = window.setInterval(() => {
      i++
      setN(i)
      if (i >= transacoes.length) window.clearInterval(id)
    }, 650)
    return () => window.clearInterval(id)
  }, [visto])
  const casados = transacoes.slice(0, n).filter((t) => t.confianca === 'alta').length
  const conferir = transacoes.slice(0, n).filter((t) => t.confianca !== 'alta').length
  return (
    <Secao
      id="conciliacao-bpo"
      titulo="Conciliação todo dia e o relatório do mês no app."
      texto="O time do BPO divide o trabalho em cinco: Contas a Pagar, Contas a Receber, Conciliação, Gerencial e Atendimento. O extrato chega pelo Open Finance, a Conciliação casa o que tem certeza e separa o resto para uma pessoa."
      visual={
        <div ref={ref} data-luz className="bg-background shadow-painel flex flex-col gap-4 rounded-[28px] p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-1 text-sm">
            <span className="text-muted-foreground">
              Extratos de 16/11 · <span className="text-foreground tabular-nums">{casados}</span> casados · <span className="text-foreground tabular-nums">{conferir}</span> para conferir
            </span>
          </div>
          {/* Abrir um lançamento para conferir não muda a altura: a lista reserva a do maior aberto. */}
          <ReservaAltura variantes={transacoes.filter((t) => t.confianca !== 'alta' && t.id !== aberta).map((t) => <ListaExtrato key={t.id} n={transacoes.length} aberta={t.id} />)}>
            <ListaExtrato n={n} aberta={aberta} onAbrir={setAberta} />
          </ReservaAltura>
          <div className="bg-surface flex flex-wrap items-center gap-3 rounded-[20px] p-4">
            <span className="bg-sunken flex size-10 shrink-0 items-center justify-center rounded-full">
              <FileTextIcon className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium">Relatório de outubro · {curto(padaria.nome)}</span>
              <span className="text-muted-foreground text-xs">{enviado ? 'No app do cliente e em Arquivos › Entregáveis' : 'DRE, caixa e pendências · fechamento à contabilidade até dia 7'}</span>
            </span>
            {enviado ? (
              <span className="carimbo bg-success/15 text-foreground flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm">
                <CheckIcon className="text-success size-4" weight="bold" /> no app
              </span>
            ) : (
              <button type="button" onClick={() => setEnviado(true)} className="botao bg-primary text-primary-foreground h-9 cursor-pointer rounded-full px-4 text-sm font-medium">
                Enviar ao cliente
              </button>
            )}
          </div>
        </div>
      }
    >
      <Pares
        itens={[
          ['Conciliação', 'Casa o extrato com as contas pagas e recebidas. O que não tem certeza vai para conferência, nunca para o lixo.'],
          ['Gerencial', 'Fecha o mês: DRE, fluxo de caixa e pendências num relatório que o cliente abre no app.'],
          ['Fechamento à contabilidade', 'Até o dia 7, o mês vai ao setor Contábil do escritório ou ao contador da empresa.'],
        ]}
      />
    </Secao>
  )
}

/* ---------------- 4. O resto do escritório ---------------- */

const pedido = filaBpo.find((f) => f.id === 'fq3')
const mercado = empresa('c8')
const loja = empresa('c3')
const contaHorti = mercado.contas.find((c) => c.fornecedor === 'Hortifruti Vale')

const itensBpo: ItemNaoCore[] = [
  {
    id: 'crm',
    nome: 'CRM com WhatsApp',
    icone: ChatCircleDotsIcon,
    linha: 'O cliente escreve no WhatsApp; o Atendimento responde e o pedido entra na fila do BPO com a bola certa.',
    previa: (
      <div className="flex h-full flex-col gap-3">
        <span className="text-muted-foreground text-sm">{curto(mercado.nome)} · WhatsApp</span>
        <div className="bolha-nc bg-background shadow-contorno max-w-[85%] self-start rounded-[16px] px-3.5 py-2 text-sm" style={{ ['--i' as string]: 0 }}>
          {pedido?.texto.replace(/[“”]/g, '')}
          <span className="text-muted-foreground mt-0.5 block text-[11px]">Patrícia Almeida</span>
        </div>
        <div className="bolha-nc bg-surface shadow-cartao flex flex-col gap-1 rounded-[16px] p-3 text-sm" style={{ ['--i' as string]: 1 }}>
          <span className="flex items-center gap-2">
            <TrayIcon className="text-muted-foreground size-4" /> Entrou na fila · prazo {pedido?.prazo}
          </span>
          <span className="text-muted-foreground text-xs">{pedido?.detalhe}</span>
        </div>
        {contaHorti && (
          <div className="bolha-nc bg-background shadow-contorno flex flex-col gap-1 rounded-[16px] p-3 text-sm" style={{ ['--i' as string]: 2 }}>
            <span className="flex justify-between gap-2">
              <span className="truncate">{contaHorti.fornecedor}</span>
              <span className="shrink-0 tabular-nums">{brl(contaHorti.valor)}</span>
            </span>
            <span className="text-muted-foreground text-xs">
              vence {contaHorti.vencimento} · digitada por {contaHorti.digitadoPor} · a conferir por outra pessoa
            </span>
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'timesheet',
    nome: 'Timesheet',
    icone: TimerIcon,
    linha: 'As horas de cada empresa se registram sozinhas e vão direto para a rentabilidade do BPO.',
    previa: (
      <div className="flex h-full flex-col gap-2.5">
        <span className="text-muted-foreground text-sm">Horas no mês por empresa</span>
        {[...empresasBpo]
          .sort((a, b) => b.horasMes - a.horasMes)
          .slice(0, 5)
          .map((e, i, xs) => (
            <div key={e.clienteId} className="flex flex-col gap-1">
              <span className="flex justify-between gap-2 text-sm">
                <span className="truncate">{curto(e.nome)}</span>
                <span className="text-muted-foreground shrink-0 tabular-nums">{e.horasMes.toLocaleString('pt-BR')} h</span>
              </span>
              <BarraMini valor={e.horasMes} max={xs[0].horasMes} i={i} rotulo={`Horas de ${e.nome}`} />
            </div>
          ))}
      </div>
    ),
  },
  {
    id: 'financeiro',
    nome: 'Financeiro do escritório',
    icone: WalletIcon,
    linha: 'O honorário de cada empresa é cobrado com régua, e o volume acima da faixa vira extra na fatura do mês.',
    previa: (
      <div className="flex h-full flex-col gap-3">
        <div className="bg-background shadow-contorno flex flex-col gap-1 rounded-[16px] p-4">
          <span className="text-muted-foreground text-xs">{curto(loja.nome)} · novembro</span>
          <span className="text-sm">
            {loja.volume.lancamentos} lançamentos na faixa de {loja.volume.limiteFaixa}
          </span>
          <span className="text-muted-foreground text-xs">{loja.volume.lancamentos - loja.volume.limiteFaixa} acima: extra na fatura, depois do seu ok</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {empresasBpo.slice(0, 4).map((e) => (
            <LinhaMini key={e.clienteId} detalhe={`${brl(e.honorarioBpo)}/mês`}>
              <span className="truncate">{curto(e.nome)}</span>
            </LinhaMini>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'arquivos',
    nome: 'Arquivos',
    icone: FilesIcon,
    linha: 'Relatórios e comprovantes ficam na pasta da empresa, em Entregáveis. O que vai ao cliente aparece no app.',
    previa: (
      <div className="flex h-full flex-col gap-3">
        <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
          <FolderSimpleIcon className="size-4 shrink-0" /> <span className="truncate">Studio Forma / Entregáveis / BPO financeiro</span>
        </span>
        <ul className="flex flex-col gap-1.5">
          {[
            ['Relatório financeiro 10-2026.pdf', 'BPO (integrante) · 05/11/2026 · no app'],
            ['Contrato de BPO financeiro.pdf', 'Marina Teixeira · 01/09/2026'],
          ].map(([d, q], i) => (
            <li key={d} className="bolha-nc bg-background shadow-contorno flex min-w-0 items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm" style={{ ['--i' as string]: i }}>
              <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{d}</span>
                <span className="text-muted-foreground truncate text-xs">{q}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'app',
    nome: 'App do cliente',
    icone: AppWindowIcon,
    linha: 'O cliente aprova os lotes, manda contas e comprovantes, responde o que foi cada lançamento e abre o relatório.',
    previa: (
      <div className="flex h-full items-start justify-center">
        <div className="bg-background shadow-painel flex w-full max-w-[280px] flex-col gap-2 rounded-[28px] p-4">
          <span className="text-muted-foreground text-xs">{curto(padaria.nome)}</span>
          {[
            ['Lote para aprovar', `${brl(totalLote('lt1'))} · ${lotesBpo[0].expira}`],
            ['O que foi isto?', `${brl(380)} · PIX ENV M S PANIFICACAO`],
            ['Relatório de outubro', 'DRE, caixa e pendências'],
          ].map(([t, d], i) => (
            <div key={t} className="bolha-nc bg-surface flex flex-col gap-0.5 rounded-[16px] p-3" style={{ ['--i' as string]: i }}>
              <span className="text-sm font-medium">{t}</span>
              <span className="text-muted-foreground truncate text-xs">{d}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function SecaoNaoCoreBpo() {
  return (
    <SecaoNaoCore
      id="tudo-junto-bpo"
      titulo="Para o BPO, o resto do escritório também vem junto."
      texto="CRM com WhatsApp, timesheet, financeiro, arquivos e o app do cliente, sobre o mesmo cadastro. A empresa que também é cliente contábil tem uma ficha só e um calendário com as duas frentes."
      itens={itensBpo}
    />
  )
}

function ListaExtrato({ n, aberta, onAbrir }: { n: number; aberta: string | null; onAbrir?: (id: string | null) => void }) {
  return (
    <ul className="bg-surface flex flex-col gap-1 rounded-[20px] p-2">
      {transacoes.map((t, i) => {
        const lida = i < n
        const alta = t.confianca === 'alta'
        const ab = aberta === t.id
        return (
          <li key={t.id}>
            <button type="button" disabled={alta || !lida} aria-expanded={!alta ? ab : undefined} onClick={() => onAbrir?.(ab ? null : t.id)} className={cn('flex w-full flex-col gap-1 rounded-[14px] px-3 py-2.5 text-left transition-colors', !alta && lida && 'cursor-pointer hover:bg-background/60', ab && 'bg-background shadow-contorno')}>
              <span className="flex min-w-0 items-center gap-3 text-sm">
                <span className={cn('flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300', !lida ? 'shadow-contorno' : alta ? 'bg-success text-success-foreground' : 'bg-warning/20 text-foreground')}>
                  {lida && (alta ? <CheckIcon className="carimbo size-3" weight="bold" /> : <span className="carimbo text-[11px] font-medium">?</span>)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{t.descricao}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {t.empresa} · {lida ? t.sugestao : 'lendo'}
                  </span>
                </span>
                <span className={cn('shrink-0 text-sm tabular-nums', t.valor < 0 && 'text-muted-foreground')}>{brl(t.valor)}</span>
              </span>
              {!alta && (
                <span data-aberto={ab} className="setor-linha text-muted-foreground pl-8 text-sm">
                  <span>O Atendimento pergunta ao cliente no app: o que foi isto? A resposta classifica o lançamento.</span>
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function CartaoLote({ d, feitos, onAprovar }: { d: (typeof lotesDemo)[number]; feitos: number; onAprovar?: () => void }) {
  const { l, e, aprovadores, total } = d
  const completo = feitos >= aprovadores.length
  return (
    <div className="entra bg-background flex flex-col gap-3 rounded-[24px] p-4">
      <span className="text-sm font-medium">{l.titulo}</span>
      <ul className="flex flex-col gap-2">
        {l.itens.map((i) => (
          <li key={i.conta} className="flex flex-col text-sm">
            <span className="flex justify-between gap-2">
              <span className="truncate">{i.fornecedor}</span>
              <span className="shrink-0 tabular-nums">{brl(i.valor)}</span>
            </span>
            <span className={cn('text-xs leading-snug', i.alerta ? 'text-foreground' : 'text-muted-foreground')}>{i.alerta ? 'fornecedor novo, conta confirmada por ligação' : i.marca}</span>
          </li>
        ))}
      </ul>
      <div className="border-border flex items-baseline justify-between border-t pt-3">
        <span className="text-muted-foreground text-xs">Total · saldo {brl(l.saldo)}</span>
        <span className="font-heading text-2xl font-light tabular-nums">{brl(total)}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {aprovadores.map((a, i) => (
          <span key={a} className="flex items-center gap-2 text-sm">
            <span className={cn('flex size-5 items-center justify-center rounded-full transition-colors duration-300', i < feitos ? 'bg-success text-success-foreground' : 'shadow-contorno')}>{i < feitos && <CheckIcon className="carimbo size-3" weight="bold" />}</span>
            <span className={cn(i < feitos ? '' : 'text-muted-foreground')}>
              {a}
              {i < feitos ? ' aprovou' : ''}
            </span>
          </span>
        ))}
      </div>
      {completo ? (
        <span className="carimbo bg-sunken flex min-h-10 items-center justify-center rounded-full px-3 text-center text-xs leading-snug">{e.modoPagamento === 'M1' ? 'Aprovado. O cliente libera no banco.' : e.modoPagamento === 'M2' ? 'Aprovado. O pagamento sai por API.' : 'Aprovado.'}</span>
      ) : (
        <button type="button" onClick={onAprovar} className="botao pulso bg-primary text-primary-foreground h-10 cursor-pointer rounded-full text-sm font-medium">
          {aprovadores.length > 1 ? `Aprovar como ${aprovadores[feitos]}` : 'Aprovar'}
        </button>
      )}
    </div>
  )
}

function PassosEscalonamento({ passos }: { passos: ReturnType<typeof passosEscalonamento> }) {
  return (
    <ol className="entra flex flex-col gap-3" aria-label="Se ninguém responder">
      {passos.map((p, i) => (
        <li key={p.quando} className="flex gap-3 text-sm">
          <span className={cn('mt-1 size-2 shrink-0 rounded-full', i === 0 ? 'bg-foreground' : i === passos.length - 1 ? 'bg-destructive' : 'bg-muted-foreground/50')} />
          <span className="flex min-w-0 flex-col">
            <span className="font-medium">{p.quando}</span>
            <span className="text-muted-foreground leading-relaxed">{p.texto}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
