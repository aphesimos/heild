import { createContext, useContext, useState } from 'react'
import { useDocumentos } from '@/ambiente/documentos'
import { integranteDoSetor, useFluxos } from '@/ambiente/fluxos'
import { useLoja } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Campo, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import type { SetorIntegrante } from '@/theme/tipos'
import { ArrowRightIcon, CheckIcon, ClockCounterClockwiseIcon, DownloadSimpleIcon, EyeIcon, EyeSlashIcon, FileTextIcon, LightningIcon, PaperPlaneTiltIcon, PencilSimpleLineIcon, ShieldCheckIcon, WarningIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { Tooltip } from '@/components/ui/tooltip'
import { chaveNome } from '@/dados/arquivos'
import * as exemplo from '@/dados/exemplo'
import type { AcaoCfg, CampoPerfil, DocumentoAba, NivelAcao, PendenciaSetor } from '@/dados/painel'
import type { Integrante } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'

/** Cliente e setor da aba aberta: os botões dos widgets agem sobre eles. */
export const AbaCtx = createContext<{ cliente?: string; setor: SetorIntegrante }>({ setor: 'fiscal' })

/**
 * A. Cabeçalho da aba: perfil vigente que importa ao setor, vigência com
 * histórico, faixa de aviso e o integrante do setor com o que está fazendo
 * para o cliente e "falar com".
 */
export function CabecalhoAba({
  titulo,
  cliente,
  perfil,
  vigencia,
  faixa,
  integrante,
  statusIntegrante,
  onFalar,
  onFicha,
}: {
  titulo: string
  cliente?: string
  perfil: CampoPerfil[]
  vigencia: string
  faixa?: string
  integrante?: Integrante
  statusIntegrante: string
  onFalar?: () => void
  /** Abre a ficha do cliente (contatos por assunto, responsáveis). */
  onFicha?: () => void
}) {
  const aparencia = useAparencia()
  const t = integrante ? aparencia(integrante) : undefined
  const [historico, setHistorico] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{titulo}</h1>
          <p className="text-muted-foreground text-sm">{cliente ?? 'Carteira · todos os clientes'}</p>
          {cliente ? (
            <dl className="mt-3 flex flex-wrap gap-2">
              {perfil.map((c) => (
                <div key={c.rotulo} className={cn('bg-surface shadow-contorno rounded-[14px] px-3 py-2', c.alerta && 'ring-warning/50 ring-1')}>
                  <dt className="text-muted-foreground text-[11px]">{c.rotulo}</dt>
                  <dd className="flex items-center gap-1 text-sm font-medium">
                    {c.alerta && <WarningIcon weight="fill" className="text-warning size-3.5" aria-label="atenção" />}
                    {c.valor}
                  </dd>
                </div>
              ))}
              <button type="button" onClick={() => setHistorico(true)} className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 self-end px-1 pb-2 text-xs">
                <ClockCounterClockwiseIcon className="size-3.5" /> {vigencia} · histórico
              </button>
              {onFicha && (
                <button type="button" onClick={onFicha} className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 self-end px-1 pb-2 text-xs underline-offset-2 hover:underline">
                  ficha do cliente
                </button>
              )}
            </dl>
          ) : (
            <p className="text-muted-foreground mt-2 text-xs">Escolha um cliente no seletor para ver o perfil; aqui a visão é da carteira.</p>
          )}
        </div>
        {t && integrante && (
          <div className="bg-surface shadow-cartao flex min-h-19 w-full items-center gap-3 rounded-[20px] p-3 lg:w-80">
            <Orb cor={t.cor} corOlhos={t.corOlhos} estado={integrante.estado} tamanho={40} animado modo="wander" cutucavel={false} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{t.nome}</div>
              <p className="text-muted-foreground line-clamp-2 text-xs">{statusIntegrante}</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={onFalar}>
              Falar
            </Button>
          </div>
        )}
      </div>
      {historico && (
        <GavetaFormulario
          aberta
          onFechar={() => setHistorico(false)}
          titulo={`Histórico do perfil · ${titulo}`}
          descricao={`${cliente ?? ''}. Cada mudança cria uma versão com data de início; documentos guardam a versão com que saíram.`}
          acao="Fechar"
          onAcao={() => setHistorico(false)}
        >
          <ol className="relative flex flex-col gap-3 border-l pl-4 text-sm">
            {[
              { v: 'v3', quando: vigencia.replace('perfil vigente desde ', 'desde '), texto: perfil.map((c) => `${c.rotulo}: ${c.valor}`).join(' · '), atual: true },
              { v: 'v2', quando: 'de 01/03/2025 a 31/12/2025', texto: 'mudança de endereço (alteração contratual registrada na JUCESP)' },
              { v: 'v1', quando: 'de 12/08/2021 a 28/02/2025', texto: 'cadastro inicial, trazido da Receita na implantação' },
            ].map((x) => (
              <li key={x.v}>
                <span className="bg-foreground absolute -left-[4.5px] mt-1.5 size-2 rounded-full" />
                <span className="text-muted-foreground block text-xs">
                  {x.v} · {x.quando} {x.atual && '· vigente'}
                </span>
                {x.texto}
              </li>
            ))}
          </ol>
        </GavetaFormulario>
      )}
      {faixa && (
        <div className="bg-warning/10 flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm">
          <WarningIcon className="text-warning size-4 shrink-0" /> {faixa}
        </div>
      )}
    </div>
  )
}

/** B. Pendências do setor: do cliente e de terceiros, com cobrar e marcar recebida. */
export function PendenciasAba({ itens: todos, compacto }: { itens: PendenciaSetor[]; compacto?: boolean }) {
  const ctx = useContext(AbaCtx)
  const fluxos = useFluxos()
  const loja = useLoja()
  const { usuario } = useSessao()
  const [recebidas, setRecebidas] = useState<string[]>([])
  const itens = todos.filter((p) => !recebidas.includes(p.id))
  const cobrar = (p: PendenciaSetor) => ctx.cliente && fluxos.cobrar({ cliente: ctx.cliente, setor: ctx.setor, texto: '', assunto: p.item.toLowerCase(), tarefa: p.id.startsWith('t') ? p.id : undefined })
  const receber = (p: PendenciaSetor) => {
    setRecebidas((xs) => [...xs, p.id])
    if (p.id.startsWith('t')) loja.atualizarTarefa(p.id, { status: 'em_andamento' })
    loja.registrar(usuario.nome, `Marcou como recebida: ${p.item}${ctx.cliente ? ` (${ctx.cliente})` : ''}`)
    loja.toast(`${p.item}: recebida. A tarefa volta a andar.`)
  }
  if (!itens.length) return <p className="text-muted-foreground py-2 text-sm">Nenhuma pendência deste setor.</p>
  if (compacto)
    return (
      <ul className="flex flex-col gap-1">
        {itens.slice(0, 2).map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{p.item}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {p.orgao ? `aguardando ${p.orgao}` : 'aguardando cliente'} · {p.desde}
              </span>
            </span>
            {!p.orgao && (
              <Tooltip conteudo="Cobrar">
                <Button size="icon-sm" variant="outline" className="rounded-full" aria-label={`Cobrar ${p.item}`} onClick={() => cobrar(p)}>
                  <PaperPlaneTiltIcon />
                </Button>
              </Tooltip>
            )}
            <Tooltip conteudo="Marcar recebida">
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Marcar ${p.item} como recebida`} onClick={() => receber(p)}>
                <CheckIcon />
              </Button>
            </Tooltip>
          </li>
        ))}
        {itens.length > 2 && <li className="text-muted-foreground text-xs">e mais {itens.length - 2}</li>}
      </ul>
    )
  return (
    <ul className="divide-border/70 flex flex-col divide-y">
      {itens.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <div className="text-sm">{p.item}</div>
            <div className="text-muted-foreground text-xs">
              {p.orgao ? `aguardando ${p.orgao}` : 'aguardando cliente'} · {p.desde}
              {!p.orgao && ` · ${p.cobrancas} ${p.cobrancas === 1 ? 'cobrança' : 'cobranças'}`}
            </div>
          </div>
          {!p.orgao && (
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => cobrar(p)}>
              <PaperPlaneTiltIcon /> Cobrar
            </Button>
          )}
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => receber(p)}>
            <CheckIcon /> Recebida
          </Button>
        </li>
      ))}
    </ul>
  )
}

/** D. Documentos da aba, com a marca "visível no app" e a pasta de origem. */
export function DocumentosAba({ itens, compacto, limite }: { itens: DocumentoAba[]; compacto?: boolean; limite?: number }) {
  const ctx = useContext(AbaCtx)
  const fluxos = useFluxos()
  const docs = useDocumentos()
  const loja = useLoja()
  const enviar = (d: DocumentoAba) => ctx.cliente && fluxos.enviar({ cliente: ctx.cliente, setor: ctx.setor, texto: '', anexo: d.nome, assunto: d.nome })
  const clienteId = exemplo.clientes.find((c) => c.nome === ctx.cliente)?.id
  /** Abre o mesmo arquivo que está em Arquivos, no visualizador com a marca do escritório. */
  const abrir = (d: DocumentoAba) => docs.abrir(d.nome, { clienteId, setor: ctx.setor })
  /** Pasta real do arquivo na árvore (a mesma do módulo Arquivos). */
  const pastaReal = (d: DocumentoAba) => {
    const achado = loja.documentos.find((x) => x.clienteId === clienteId && chaveNome(x.nome) === chaveNome(d.nome))
    return achado ? achado.pasta.join(' / ') : d.pasta
  }
  if (!itens.length) return <p className="text-muted-foreground py-2 text-sm">Nenhum documento desta aba.</p>
  if (compacto)
    return (
      <ul className="divide-border/70 flex flex-col divide-y">
        {itens.slice(0, limite).map((d) => (
          <li key={d.id} className="hover:bg-sunken/50 -mx-1 flex cursor-pointer items-center gap-2.5 rounded-[8px] px-1 py-1.5 first:pt-0 last:pb-0" onClick={() => abrir(d)}>
            <FileTextIcon weight="duotone" className="text-muted-foreground size-5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{d.nome}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {d.competencia} · {d.origem} · {d.enviadoPor}
              </span>
            </span>
            <Tooltip conteudo={`${d.visivelNoApp ? 'Visível' : 'Oculto'} no app · pasta ${pastaReal(d)}`}>
              {d.visivelNoApp ? <EyeIcon className="size-4 shrink-0" aria-label="visível no app" /> : <EyeSlashIcon className="text-muted-foreground size-4 shrink-0" aria-label="oculto no app" />}
            </Tooltip>
          </li>
        ))}
        {limite && itens.length > limite && <li className="text-muted-foreground pt-1 text-xs">e mais {itens.length - limite}</li>}
      </ul>
    )
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-muted-foreground text-left text-xs">
            <th className="py-1.5 pr-3 font-medium">Documento</th>
            <th className="py-1.5 pr-3 font-medium">Competência</th>
            <th className="py-1.5 pr-3 font-medium">Origem</th>
            <th className="py-1.5 pr-3 font-medium">No app do cliente</th>
            <th className="py-1.5" />
          </tr>
        </thead>
        <tbody className="divide-border/70 divide-y">
          {itens.map((d) => (
            <tr key={d.id}>
              <td className="py-2 pr-3">
                <div className="flex items-center gap-2">
                  <FileTextIcon weight="duotone" className="text-muted-foreground size-5 shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate">{d.nome}</div>
                    <div className="text-muted-foreground text-[11px]">
                      {d.tipo} · <code>{d.hash}</code>
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-2 pr-3 tabular-nums">{d.competencia}</td>
              <td className="py-2 pr-3">
                <div>{d.origem}</div>
                <div className="text-muted-foreground text-[11px]">{d.enviadoPor}</div>
              </td>
              <td className="py-2 pr-3">
                <Tooltip conteudo={`Pasta: ${pastaReal(d)}`}>
                  <span className="flex w-fit items-center gap-1.5 text-xs">
                    {d.visivelNoApp ? <EyeIcon className="size-4" /> : <EyeSlashIcon className="text-muted-foreground size-4" />}
                    {d.visivelNoApp ? 'visível' : 'oculto'}
                  </span>
                </Tooltip>
              </td>
              <td className="py-2 text-right whitespace-nowrap">
                <Button size="sm" variant="ghost" onClick={() => abrir(d)}>
                  Abrir
                </Button>
                <Button size="sm" variant="ghost" onClick={() => enviar(d)}>
                  Enviar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const iconeNivel: Record<NivelAcao, ReactNode> = {
  preparar: <PencilSimpleLineIcon />,
  'executar com aprovação': <ShieldCheckIcon />,
  executar: <LightningIcon />,
}

/**
 * E. Ações: o rótulo traz o nível do contrato, sem exceção (03, 5).
 * Com pré-requisito faltando, o botão vira "falta X".
 */
export function AcoesAba({ itens, carteira }: { itens: AcaoCfg[]; carteira?: number }) {
  const ctx = useContext(AbaCtx)
  const fluxos = useFluxos()
  const loja = useLoja()
  const { usuario } = useSessao()
  const executar = (a: AcaoCfg) => {
    const alvo = ctx.cliente ?? `${carteira ?? 0} clientes da carteira`
    if (a.nivel === 'preparar') return fluxos.preparar({ cliente: ctx.cliente ?? 'Carteira', setor: ctx.setor, documento: a.rotulo })
    if (a.nivel === 'executar com aprovação') {
      const integrante = integranteDoSetor(ctx.setor)
      loja.mensagemTime(integrante, {
        autor: { tipo: 'integrante', setor: ctx.setor },
        texto: `Preparei “${a.rotulo}” para ${alvo}. Confere e aprova para eu executar.`,
        cartoes: [
          {
            tipo: 'aprovacao',
            id: `ap-${Date.now()}`,
            resumo: `${a.rotulo} · ${alvo}`,
            argumentos: [
              { rotulo: 'Pedido por', valor: usuario.nome },
              { rotulo: 'Nível', valor: a.nivel },
            ],
            expiraEm: 'expira em 24 h',
          },
        ],
      })
      loja.registrar(usuario.nome, `Pediu “${a.rotulo}” (${alvo}); aguardando aprovação`)
      return loja.toast(`O integrante preparou “${a.rotulo}” e pediu sua aprovação.`, { modulo: 'inicio', aba: 'time', integrante }, 'Aprovar no Time')
    }
    loja.registrar(usuario.nome, `Executou “${a.rotulo}” (${alvo})`)
    loja.toast(`“${a.rotulo}” feito para ${alvo}.`)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {itens.map((a) =>
        a.falta ? (
          <Tooltip key={a.rotulo} conteudo={`${a.rotulo}: falta ${a.falta}`}>
            <span>
              <Button size="sm" variant="outline" disabled className="rounded-full">
                <WarningIcon /> falta {a.falta}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button key={a.rotulo} size="sm" variant={a.nivel === 'preparar' ? 'outline' : 'secondary'} className="h-auto flex-col items-start gap-0 rounded-[14px] py-1.5 text-left" onClick={() => executar(a)}>
            <span className="flex items-center gap-1.5 text-[13px]">
              {iconeNivel[a.nivel]} {a.rotulo}
              {carteira ? <span className="text-muted-foreground">· {carteira} clientes</span> : null}
            </span>
            <span className="text-muted-foreground text-[11px] font-normal">{a.nivel}</span>
          </Button>
        ),
      )}
    </div>
  )
}

/** G. Relatórios da aba: gerar, exportar (CSV, PDF com o tema), agendar. */
export function RelatoriosAba({ itens, compacto }: { itens: string[]; compacto?: boolean }) {
  const fluxos = useFluxos()
  const [gerar, setGerar] = useState<string | null>(null)
  const gaveta = gerar && <GerarRelatorio nome={gerar} onFechar={() => setGerar(null)} onGerar={(f) => (fluxos.feito(`${gerar} gerado (${f}).`), fluxos.baixar(`${gerar}.${f}`), setGerar(null))} />
  if (compacto)
    return (
      <ul className="-mx-2 flex flex-col">
        {gaveta}
        {itens.slice(0, 3).map((r) => (
          <li key={r} className="hover:bg-sunken flex h-7 items-center gap-1 rounded-[10px] px-2 text-sm">
            <span className="min-w-0 flex-1 truncate">{r}</span>
            <Button size="icon-sm" variant="ghost" className="size-6" aria-label={`Exportar ${r}`} onClick={() => fluxos.baixar(`${r}.csv`)}>
              <DownloadSimpleIcon />
            </Button>
            <Button size="icon-sm" variant="ghost" className="size-6" aria-label={`Gerar ${r}`} onClick={() => setGerar(r)}>
              <ArrowRightIcon />
            </Button>
          </li>
        ))}
      </ul>
    )
  return (
    <ul className="flex flex-col gap-1">
      {gaveta}
      {itens.map((r) => (
        <li key={r} className="hover:bg-sunken flex items-center gap-2 rounded-[12px] px-2 py-1.5 text-sm">
          <span className="flex-1">{r}</span>
          <Tooltip conteudo="Exportar CSV ou PDF">
            <Button size="icon-sm" variant="ghost" aria-label={`Exportar ${r}`} onClick={() => fluxos.baixar(`${r}.csv`)}>
              <DownloadSimpleIcon />
            </Button>
          </Tooltip>
          <Button size="sm" variant="ghost" onClick={() => setGerar(r)}>
            Gerar <ArrowRightIcon />
          </Button>
        </li>
      ))}
    </ul>
  )
}

/** Gerar relatório: período, formato e agendamento mensal. */
function GerarRelatorio({ nome, onFechar, onGerar }: { nome: string; onFechar: () => void; onGerar: (formato: string) => void }) {
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano'>('mes')
  const [formato, setFormato] = useState<'pdf' | 'csv'>('pdf')
  const [agendar, setAgendar] = useState(false)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={nome} descricao="O PDF sai com o tema do escritório; o CSV, com uma linha por cliente." acao="Gerar" onAcao={() => onGerar(formato)}>
      <Campo rotulo="Período">
        {() => (
          <Segmentado
            rotulo="Período"
            valor={periodo}
            onMudar={setPeriodo}
            opcoes={[
              { valor: 'mes', rotulo: 'Outubro' },
              { valor: 'trimestre', rotulo: '3º trimestre' },
              { valor: 'ano', rotulo: '2026' },
            ]}
          />
        )}
      </Campo>
      <Campo rotulo="Formato">
        {() => (
          <Segmentado
            rotulo="Formato"
            valor={formato}
            onMudar={setFormato}
            opcoes={[
              { valor: 'pdf', rotulo: 'PDF' },
              { valor: 'csv', rotulo: 'CSV' },
            ]}
          />
        )}
      </Campo>
      <Interruptor ligado={agendar} onMudar={setAgendar} rotulo="Gerar todo mês, no dia 1" detalhe="Chega no seu e-mail e fica na pasta do escritório." />
    </GavetaFormulario>
  )
}

/** Medidor de sublimite (Simples): barra com o teto, alerta perto do limite. */
export function MedidorSublimite({ usado, teto, rotulo, semAviso }: { usado: number; teto: number; rotulo: string; semAviso?: boolean }) {
  const pct = Math.round((usado / teto) * 100)
  const perto = pct >= 80
  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{rotulo}</span>
        <span className="tabular-nums">
          <strong className="font-medium">{fmt(usado)}</strong>{' '}
          <span className="text-muted-foreground">
            de {fmt(teto)} · {pct}%
          </span>
        </span>
      </div>
      <div className="bg-sunken h-2 overflow-hidden rounded-full" role="meter" aria-valuemin={0} aria-valuemax={teto} aria-valuenow={usado} aria-label={rotulo}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: perto ? 'var(--warning)' : 'color-mix(in oklab, var(--foreground) 70%, transparent)' }} />
      </div>
      {perto && !semAviso && (
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <WarningIcon className="text-warning size-3.5" /> Acima de 80% do sublimite: o Consultor acompanha a projeção do ano.
        </p>
      )}
    </div>
  )
}

/** Selo de etapa feita ou não (enviada, lida, paga; dados, documentos, ASO...). */
export function Selo({ feito, alerta, children }: { feito: boolean; alerta?: boolean; children: ReactNode }) {
  return (
    <span className={cn('flex w-fit items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] whitespace-nowrap', feito ? 'bg-success/15' : alerta ? 'bg-warning/15 text-foreground' : 'bg-sunken text-muted-foreground')}>
      {feito && <CheckIcon weight="bold" className="text-success size-3" />}
      {!feito && alerta && <WarningIcon weight="fill" className="text-warning size-3" />}
      {children}
    </span>
  )
}

/** Contagem regressiva de prazo legal (S-2200, rescisão): fica vermelha a 3 dias ou menos. */
export function Contagem({ dias, rotulo }: { dias: number; rotulo: string }) {
  const urgente = dias <= 3
  return (
    <span className={cn('flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums whitespace-nowrap', urgente ? 'bg-destructive/12 text-destructive' : 'bg-sunken')}>
      <ClockCounterClockwiseIcon className="size-3.5 -scale-x-100" />
      {dias === 0 ? 'vence hoje' : `${dias} ${dias === 1 ? 'dia' : 'dias'}`} · {rotulo}
    </span>
  )
}

/** Confiança da classificação automática; abaixo de 0,7 vem marcada (03, 6.6). */
export function Confianca({ valor }: { valor: number }) {
  const baixa = valor < 0.7
  return (
    <Tooltip conteudo={baixa ? 'Confiança baixa: confira antes de aceitar' : 'Confiança alta'}>
      <span className="flex items-center gap-1.5">
        <span className="bg-sunken h-1.5 w-12 overflow-hidden rounded-full" aria-hidden>
          <span className="block h-full rounded-full" style={{ width: `${valor * 100}%`, background: baixa ? 'var(--warning)' : 'color-mix(in oklab, var(--foreground) 60%, transparent)' }} />
        </span>
        <span className={cn('text-xs tabular-nums', baixa && 'font-medium')}>{valor.toFixed(2).replace('.', ',')}</span>
      </span>
    </Tooltip>
  )
}

export type AcaoAba =
  | { tipo: 'cobrar'; assunto: string }
  | { tipo: 'tarefa'; codigo: string; titulo: string }
  | { tipo: 'preparar'; documento: string }
  | { tipo: 'transmitir'; documento: string; orgao: string; valor?: string }
  | { tipo: 'aprovacao'; resumo: string }
  | { tipo: 'feito'; texto: string }

/** Botão de um widget do Painel: age sobre o cliente e o setor da aba aberta. */
export function BotaoAba({ acao, ...props }: Omit<React.ComponentProps<typeof Button>, 'onClick'> & { acao: AcaoAba }) {
  const ctx = useContext(AbaCtx)
  const fluxos = useFluxos()
  const loja = useLoja()
  const { usuario } = useSessao()
  const cliente = ctx.cliente ?? 'Carteira'
  const fazer = () => {
    switch (acao.tipo) {
      case 'cobrar':
        if (!ctx.cliente) return loja.toast('Escolha um cliente no seletor para cobrar; na carteira, a régua cobra cada um.')
        return fluxos.cobrar({ cliente: ctx.cliente, setor: ctx.setor, texto: '', assunto: acao.assunto })
      case 'tarefa': {
        const existente = loja.tarefas.find((t) => t.codigo === acao.codigo && (!ctx.cliente || t.cliente === ctx.cliente) && t.status !== 'concluida')
        if (existente) return fluxos.abrirTarefa(existente.id)
        const id = loja.criarTarefa({ codigo: acao.codigo, titulo: acao.titulo, cliente, setor: ctx.setor, prazo: '20/11', status: 'a_fazer', responsavel: { tipo: 'pessoa', nome: usuario.nome } })
        loja.registrar(usuario.nome, `Abriu a tarefa ${acao.codigo} · ${cliente}`)
        return fluxos.abrirTarefa(id)
      }
      case 'preparar':
        return fluxos.preparar({ cliente, setor: ctx.setor, documento: acao.documento })
      case 'transmitir':
        return fluxos.transmitir({ cliente, setor: ctx.setor, documento: acao.documento, orgao: acao.orgao, valor: acao.valor })
      case 'aprovacao': {
        const integrante = integranteDoSetor(ctx.setor)
        loja.mensagemTime(integrante, {
          autor: { tipo: 'integrante', setor: ctx.setor },
          texto: `Preparei para ${cliente}. Confere e aprova para eu executar.`,
          cartoes: [{ tipo: 'aprovacao', id: `ap-${Date.now()}`, resumo: `${acao.resumo} · ${cliente}`, argumentos: [{ rotulo: 'Pedido por', valor: usuario.nome }], expiraEm: 'expira em 24 h' }],
        })
        loja.registrar(usuario.nome, `Pediu “${acao.resumo}” (${cliente})`)
        return loja.toast(`O integrante preparou “${acao.resumo}” e pediu sua aprovação.`, { modulo: 'inicio', aba: 'time', integrante }, 'Aprovar no Time')
      }
      case 'feito':
        loja.registrar(usuario.nome, acao.texto)
        return loja.toast(acao.texto)
    }
  }
  return <Button {...props} onClick={fazer} />
}
