import { CaretLeftIcon, CaretRightIcon, GlobeIcon, PauseIcon, PlayIcon, PuzzlePieceIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmentado } from '@/components/ui/formulario'
import { Orb } from '@/components/ui/orb'
import {
  agenteDia,
  ehBpo,
  extensao,
  fmtH,
  itensConfirmacao,
  limitesIa,
  mesAtividades,
  mesAtividadesBpo,
  mesClientes,
  mesClientesBpo,
  min,
  minhasContestacoes,
  resumoDe,
  rotuloConfianca,
  rotuloOrigem,
  semana,
  sessoesPorUsuario,
  type SessaoTs,
  estadoInicialConfirmacoes,
} from '@/dados/timesheet'
import { useSessao } from '@/ambiente/sessao'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'
import { CorrigirItem, DetalheSessao } from './acoes'
import { Caixa, CabecalhoTs, Numero, usePacote } from './comum'
import { PausarExtensao, Dominios, TermoCiencia, VincularExtensao } from './configuracao'
import { Amostra, Barras, ColunasEmpilhadas, Legenda, LinhaDoDia, Pergunta } from './graficos'

/**
 * Timesheet › Meu tempo (05, 8.2): o próprio tempo, primeiro. Dia com a linha
 * por confiança e a lista de sessões (contestar, confirmar, classificar);
 * semana e mês em gráficos; o agente em série separada; a extensão e as
 * contestações ao lado. Nunca mostra custo, margem, tokens nem colegas.
 */
/** Rótulo do período navegado (hoje é qua 18/11; não há futuro para ver). */
function rotuloPeriodo(vista: 'dia' | 'semana' | 'mes', desvio: number) {
  if (vista === 'dia') {
    const d = new Date(2026, 10, 18 + desvio)
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'numeric' }).replace('.', '')
  }
  if (vista === 'semana') {
    const ini = new Date(2026, 10, 16 + desvio * 7)
    const fim = new Date(2026, 10, 20 + desvio * 7)
    return `${ini.getDate()}/${ini.getMonth() + 1} a ${fim.getDate()}/${fim.getMonth() + 1}`
  }
  return new Date(2026, 10 + desvio, 1).toLocaleDateString('pt-BR', { month: 'long' })
}

export function MeuTempoTela({ papel, clienteNome, termoInicial = true, extensaoInicial = true }: { papel: 'colaborador' | 'gestor' | 'admin'; clienteNome?: string; termoInicial?: boolean; extensaoInicial?: boolean }) {
  const aparencia = useAparencia()
  const [vista, setVista] = useState<'dia' | 'semana' | 'mes'>('dia')
  const [desvio, setDesvio] = useState(0)
  const { usuario } = useSessao()
  const [guardadas, setSessoes] = usePersistente(`ts.sessoes.${usuario.id}`, sessoesPorUsuario[usuario.id] ?? [])
  // A mesma confirmação vale nas duas telas: o que se confirma em Confirmações aparece aqui como confirmado, e vice-versa.
  const [confEstado, setConfEstado] = usePersistente('ts.conf.estado', estadoInicialConfirmacoes)
  const itemPara = (s: SessaoTs) => (usuario.id === 'u1' ? itensConfirmacao.find((i) => i.inicio === s.inicio) : undefined)
  const sessoes = guardadas.map((s) => {
    const it = itemPara(s)
    return it && confEstado[it.id] === 'feito' && s.confianca !== 'confirmada' ? { ...s, confianca: 'confirmada' as const, origem: 'confirmacao' as const } : s
  })
  const confirmarItem = (s: SessaoTs) => {
    const it = itemPara(s)
    if (it) setConfEstado((e) => ({ ...e, [it.id]: 'feito' }))
  }
  const [aberta, setAberta] = useState<SessaoTs | null>(null)
  const [corrigir, setCorrigir] = useState<string | null>(null)
  const [termo, setTermo] = usePersistente(`ts.termo.${usuario.id}`, termoInicial)
  const [vendoTermo, setVendoTermo] = useState(false)
  const [vinculada, setVinculada] = usePersistente(`ts.vinculada.${usuario.id}`, extensaoInicial)
  const [pausa, setPausa] = useState<string | null>(null)
  const [modal, setModal] = useState<'vincular' | 'pausar' | 'dominios' | null>(null)

  const { pacote, chip } = usePacote()
  const doPacote = pacote === 'todos' ? sessoes : sessoes.filter((s) => (pacote === 'bpo') === ehBpo(s.atividade))
  const resumoDia = resumoDe(doPacote)
  const visiveis = clienteNome ? doPacote.filter((s) => s.cliente === clienteNome) : doPacote
  const item = corrigir ? itensConfirmacao.find((i) => i.id === corrigir) : undefined

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoTs titulo="Meu tempo" sub={clienteNome ? `Só ${clienteNome} · troque o cliente no topo para ver tudo` : `${usuario.nome} · o que o sistema registrou; você confirma ou contesta`} papel={papel}>
          {chip}
          <Segmentado
            rotulo="Período"
            valor={vista}
            onMudar={(v) => (setVista(v), setDesvio(0))}
            opcoes={[
              { valor: 'dia', rotulo: 'Dia' },
              { valor: 'semana', rotulo: 'Semana' },
              { valor: 'mes', rotulo: 'Mês' },
            ]}
          />
          <div className="flex items-center gap-1 text-sm">
            <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Período anterior" onClick={() => setDesvio((d) => d - 1)}>
              <CaretLeftIcon />
            </Button>
            <span className="min-w-24 text-center">{rotuloPeriodo(vista, desvio)}</span>
            <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Próximo período" disabled={desvio >= 0} onClick={() => setDesvio((d) => d + 1)}>
              <CaretRightIcon />
            </Button>
          </div>
        </CabecalhoTs>

        {!termo && (
          <div className="bg-warning/10 flex flex-wrap items-center gap-3 rounded-[18px] px-4 py-3 text-sm">
            <ShieldCheckIcon weight="duotone" className="text-warning size-5 shrink-0" />
            <p className="min-w-0 flex-1">
              <strong className="font-medium">Antes de começar:</strong> veja como o seu tempo é registrado. Sem o aceite, a extensão fica parada e os arquivos da nuvem não são atribuídos a você.
            </p>
            <Button size="sm" className="rounded-full" onClick={() => setVendoTermo(true)}>
              Ler e aceitar
            </Button>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-4">
            <Caixa>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Numero valor={fmtH(resumoDia.registradas)} rotulo="registradas hoje" />
                <Numero valor={fmtH(resumoDia.automaticas)} rotulo="automáticas" detalhe={resumoDia.registradas ? `${Math.round((resumoDia.automaticas / resumoDia.registradas) * 100)}% do dia` : 'nada neste pacote hoje'} />
                <Numero valor={fmtH(resumoDia.confirmadas + resumoDia.estimadas)} rotulo="confirmadas e estimadas" />
                <Numero valor={fmtH(resumoDia.sem)} rotulo="sem classificação" />
              </div>
            </Caixa>

            {vista === 'dia' && (
              <Caixa>
                <Pergunta>Onde foi o meu dia?</Pergunta>
                <LinhaDoDia sessoes={visiveis.length ? visiveis : sessoes} onAbrir={setAberta} agente={agenteDia.map((a) => ({ hora: a.hora, minutos: a.maquinaMin, cor: aparencia({ setor: a.setor }).cor, texto: a.texto }))} />
                <Legenda
                  itens={['automatica', 'confirmada', 'estimada', 'sem']}
                  extra={
                    <>
                      <li className="flex items-center gap-1.5">
                        <span className="ring-warning size-3 rounded-[3px] ring-2 ring-inset" /> fora da jornada
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-4 rounded-full" style={{ background: aparencia({ setor: 'fiscal' }).cor }} /> agente (série à parte)
                      </li>
                    </>
                  }
                />
                <ul className="divide-border/70 -mx-2 flex flex-col divide-y">
                  {visiveis.map((s) => {
                    const it = itemPara(s)
                    return (
                      <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-2.5">
                        <button type="button" onClick={() => setAberta(s)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
                          <Amostra c={s.contestacao?.status === 'pendente' ? 'contestada' : s.confianca} />
                          <span className="w-24 shrink-0 text-xs tabular-nums sm:text-sm">
                            {s.inicio}–{s.fim}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm">
                              {s.atividade ? `${s.atividade} ${s.rotulo}` : s.rotulo}
                              {s.cliente && <span className="text-muted-foreground"> · {s.cliente}</span>}
                            </span>
                            <span className="text-muted-foreground block truncate text-xs">
                              {rotuloConfianca[s.confianca]} · {rotuloOrigem[s.origem]}
                              {s.foraJornada && ' · fora da jornada'}
                              {s.contestacao && ` · contestada (${s.contestacao.status === 'pendente' ? 'aguardando o Gestor' : s.contestacao.status})`}
                            </span>
                          </span>
                        </button>
                        {(s.confianca === 'estimada' || s.confianca === 'sem') && it ? (
                          <span className="flex gap-1.5">
                            {s.confianca === 'estimada' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => (setSessoes((xs) => xs.map((x) => (x.id === s.id ? { ...x, confianca: 'confirmada', origem: 'confirmacao' } : x))), confirmarItem(s))}
                              >
                                Confirmar
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setCorrigir(it.id)}>
                              {s.confianca === 'sem' ? 'Classificar' : 'Corrigir'}
                            </Button>
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs tabular-nums">{fmtH(min(s.fim) - min(s.inicio))}</span>
                        )}
                      </li>
                    )
                  })}
                  {!visiveis.length && <li className="text-muted-foreground px-2 py-6 text-center text-sm">Nenhuma sessão de {clienteNome} hoje.</li>}
                </ul>
              </Caixa>
            )}

            {vista === 'semana' && (
              <Caixa>
                <Pergunta>Quantas horas por dia, e quanto foi automático?</Pergunta>
                <ColunasEmpilhadas dados={semana.map((d) => ({ rotulo: d.dia, partes: (['automatica', 'confirmada', 'estimada', 'sem'] as const).map((c) => ({ c, v: d[c] })) }))} onClicar={() => setVista('dia')} />
                <Legenda itens={['automatica', 'confirmada', 'estimada', 'sem']} />
              </Caixa>
            )}

            {vista === 'mes' && (
              <div className="grid gap-4 xl:grid-cols-2">
                <Caixa>
                  <Pergunta>Em que clientes o meu tempo foi?</Pergunta>
                  <Barras dados={pacote === 'bpo' ? mesClientesBpo : pacote === 'todos' ? [...mesClientes, ...mesClientesBpo.filter((b) => !mesClientes.some((m) => m.nome === b.nome))] : mesClientes} destacar={clienteNome} />
                </Caixa>
                <Caixa>
                  <Pergunta>Em que atividades?</Pergunta>
                  <Barras dados={pacote === 'bpo' ? mesAtividadesBpo : pacote === 'todos' ? [...mesAtividades.filter((a) => a.nome !== 'outros'), ...mesAtividadesBpo, ...mesAtividades.filter((a) => a.nome === 'outros')] : mesAtividades} />
                </Caixa>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Caixa>
              <Pergunta acao={vinculada ? <Badge variant={pausa ? 'outline' : 'sucesso'}>{pausa ? `pausada ${pausa}` : 'ativa'}</Badge> : <Badge variant="outline">não vinculada</Badge>}>Extensão</Pergunta>
              {vinculada ? (
                <>
                  <p className="text-muted-foreground text-xs">{extensao.navegador} · sinais de hoje por portal:</p>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {extensao.pulsosHoje.map((p) => (
                      <li key={p.portal} className="flex items-center gap-2">
                        <GlobeIcon className="text-muted-foreground size-4" />
                        <span className="min-w-0 flex-1 truncate">
                          {p.portal} <span className="text-muted-foreground">· {p.cliente}</span>
                        </span>
                        <span className="text-xs tabular-nums">{p.pulsos} min</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {pausa ? (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setPausa(null)}>
                        <PlayIcon /> Religar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setModal('pausar')}>
                        <PauseIcon /> Pausar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('dominios')}>
                      Ver portais
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Pausas: {extensao.pausas.map((p) => `${p.quando} (${p.duracao})`).join(', ')}. Só você vê.</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-sm">Sem a extensão, o tempo para de contar quando você fica no portal sem mexer na plataforma, e o intervalo vira item para confirmar.</p>
                  <Button size="sm" className="w-fit rounded-full" onClick={() => setModal('vincular')} disabled={!termo}>
                    <PuzzlePieceIcon /> Vincular extensão
                  </Button>
                  {!termo && <p className="text-muted-foreground text-xs">Aceite o termo antes.</p>}
                </>
              )}
            </Caixa>

            <Caixa>
              <Pergunta>Minhas contestações</Pergunta>
              <ul className="flex flex-col gap-2 text-sm">
                {[
                  ...sessoes
                    .filter((s) => s.contestacao)
                    .map((s) => ({ quando: 'hoje', sessao: `${s.inicio}–${s.fim} · ${s.atividade ?? ''} ${s.rotulo}`, motivo: s.contestacao!.motivo, status: s.contestacao!.status, decisao: 'aguardando o Gestor' })),
                  ...minhasContestacoes,
                ].map((c) => (
                  <li key={c.sessao} className="flex flex-col">
                    <span>
                      {c.quando} · {c.sessao}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {c.motivo} · <span className={cn(c.status === 'aceita' && 'text-success', c.status === 'recusada' && 'text-destructive')}>{c.status === 'pendente' ? 'aguardando o Gestor' : c.decisao}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa>
              <Pergunta>O que os meus integrantes fizeram hoje?</Pergunta>
              <div className="grid grid-cols-2 gap-4">
                <Numero valor={`${agenteDia.reduce((s, a) => s + a.maquinaMin, 0)} min`} rotulo="de máquina" />
                <Numero
                  valor={`~${agenteDia
                    .reduce((s, a) => s + a.poupadasH, 0)
                    .toFixed(1)
                    .replace('.', ',')} h`}
                  rotulo="poupadas (estimativa)"
                />
                <Numero valor={`${limitesIa.cincoHoras}%`} rotulo="do limite de 5 h" />
                <Numero valor={`${limitesIa.seteDias}%`} rotulo="do limite de 7 dias" />
              </div>
              <ul className="flex flex-col gap-2">
                {agenteDia.map((a) => {
                  const t = aparencia({ setor: a.setor })
                  return (
                    <li key={a.hora} className="flex items-start gap-2.5 text-sm">
                      <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={22} cutucavel={false} extras={false} />
                      <span className="min-w-0 flex-1">
                        {t.nome}: {a.texto}
                        <span className="text-muted-foreground block text-xs tabular-nums">
                          {a.hora} · {a.maquinaMin} min de máquina
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="text-muted-foreground text-xs">Série separada: nunca soma com as suas horas.</p>
            </Caixa>
          </div>
        </div>
      </div>

      {aberta && (
        <DetalheSessao
          s={aberta}
          onFechar={() => setAberta(null)}
          onContestar={(motivo) => {
            setSessoes((xs) => xs.map((x) => (x.id === aberta.id ? { ...x, contestacao: { motivo, status: 'pendente' } } : x)))
            setAberta(null)
          }}
        />
      )}
      {item && (
        <CorrigirItem
          item={item}
          onFechar={() => setCorrigir(null)}
          onSalvar={(texto) => {
            setSessoes((xs) => xs.map((x) => (x.inicio === item.inicio ? { ...x, confianca: 'confirmada', origem: 'confirmacao', rotulo: texto, atividade: undefined, cliente: undefined } : x)))
            setConfEstado((e) => ({ ...e, [item.id]: 'feito' }))
            setCorrigir(null)
          }}
        />
      )}
      {vendoTermo && (
        <TermoCiencia
          onFechar={() => setVendoTermo(false)}
          onAceitar={() => {
            setTermo(true)
            setVendoTermo(false)
          }}
        />
      )}
      {modal === 'vincular' && (
        <VincularExtensao
          onFechar={() => setModal(null)}
          onVincular={() => {
            setVinculada(true)
            setModal(null)
          }}
        />
      )}
      {modal === 'pausar' && (
        <PausarExtensao
          onFechar={() => setModal(null)}
          onPausar={(ate) => {
            setPausa(ate)
            setModal(null)
          }}
        />
      )}
      {modal === 'dominios' && <Dominios admin={false} onFechar={() => setModal(null)} />}
    </AreaRolagem>
  )
}
