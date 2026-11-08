import { CheckIcon, ClockIcon, UserIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { artefatosSemPessoa, configTs, fmtH, itensConfirmacao, pendenciasPorPessoa, type ItemConfirmacao, estadoInicialConfirmacoes } from '@/dados/timesheet'
import { cn } from '@/lib/utils'
import { AtribuirArtefato, CorrigirItem } from './acoes'
import { Caixa, CabecalhoTs } from './comum'
import { Pergunta } from './graficos'

type Estado = 'pendente' | 'marcado' | 'feito' | 'descartado'

/**
 * Timesheet › Confirmações (05, 5.2 e 8.5): a lista curta do que o sistema não
 * atribuiu sozinho, pré-preenchida, em um clique. Até 8 por dia, válidos por 7
 * dias, nunca texto livre. O Gestor tem um segundo painel: artefatos sem
 * pessoa e a contagem de pendências por pessoa (sem o conteúdo).
 */
export function ConfirmacoesTela({ papel, clienteNome }: { papel: 'colaborador' | 'gestor' | 'admin'; clienteNome?: string }) {
  const [estado, setEstado] = usePersistente<Record<string, Estado>>('ts.conf.estado', estadoInicialConfirmacoes)
  const [resultado, setResultado] = usePersistente<Record<string, string>>('ts.conf.resultado', {})
  const [corrigir, setCorrigir] = useState<ItemConfirmacao | null>(null)
  const [artefatos, setArtefatos] = usePersistente('ts.conf.artefatos', artefatosSemPessoa.map((a) => ({ ...a, atribuido: undefined as string | undefined })))
  const [atribuir, setAtribuir] = useState<string | null>(null)
  const itens = itensConfirmacao.filter((i) => !clienteNome || i.sugestao.cliente === clienteNome || i.alternativa === clienteNome)
  const dias = [...new Set(itens.map((i) => i.dia))]
  const marcados = itens.filter((i) => estado[i.id] === 'marcado')
  const pendentes = itens.filter((i) => estado[i.id] === 'pendente' || estado[i.id] === 'marcado').length
  const gestor = papel !== 'colaborador'

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoTs titulo="Confirmações" sub={`${pendentes} pendentes · leva uns 2 min · o que não for confirmado em 7 dias fica como sem classificação, sem cobrança`} papel={papel} />
        <div className={cn('grid gap-4', gestor && 'lg:grid-cols-[minmax(0,1fr)_20rem]')}>
          <div className="flex min-w-0 flex-col gap-4">
            {dias.map((dia) => (
              <Caixa key={dia}>
                <Pergunta acao={<span className="text-muted-foreground text-xs">máximo de {configTs.itensDia} por dia, os que mais valem o clique</span>}>{dia === 'qua 18/11' ? 'Hoje, qua 18/11' : dia}</Pergunta>
                <ul className="divide-border/70 -mx-2 flex flex-col divide-y">
                  {itens
                    .filter((i) => i.dia === dia)
                    .map((i) => {
                      const e = estado[i.id]
                      const fechado = e === 'feito' || e === 'descartado'
                      return (
                        <li key={i.id} className={cn('flex flex-col gap-2 px-2 py-3 sm:flex-row sm:items-center', fechado && 'opacity-60')}>
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            {!fechado ? (
                              <input
                                type="checkbox"
                                aria-label={`Marcar ${i.inicio}`}
                                className="accent-foreground mt-1 size-4 shrink-0"
                                checked={e === 'marcado'}
                                disabled={!i.sugestao.cliente && !i.sugestao.atividade}
                                onChange={(ev) => setEstado((s) => ({ ...s, [i.id]: ev.target.checked ? 'marcado' : 'pendente' }))}
                              />
                            ) : (
                              <CheckIcon className={cn('mt-1 size-4 shrink-0', e === 'feito' ? 'text-success' : 'text-muted-foreground')} />
                            )}
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2 text-sm">
                                <span className="tabular-nums">
                                  {i.inicio}
                                  {i.fim && `–${i.fim}`}
                                </span>
                                <span>{i.texto}</span>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {fechado ? (e === 'feito' ? `confirmado: ${resultado[i.id] ?? `${i.sugestao.atividade} ${i.sugestao.cliente ?? ''}`}` : 'descartado: não era trabalho') : `pista: ${i.pista}`}
                              </div>
                            </div>
                          </div>
                          {!fechado && (
                            <div className="flex flex-wrap gap-1.5 pl-7 sm:pl-0">
                              {i.sugestao.cliente && (
                                <Button size="sm" variant="secondary" className="h-auto rounded-full py-1 text-left whitespace-normal" onClick={() => setEstado((s) => ({ ...s, [i.id]: 'feito' }))}>
                                  <CheckIcon /> {i.sugestao.atividade.split(' ·')[0]} {i.sugestao.cliente.split(' ')[0]} · {fmtH(i.sugestao.minutos)}
                                </Button>
                              )}
                              {i.alternativa && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full"
                                  onClick={() => {
                                    setResultado((r) => ({ ...r, [i.id]: `${i.sugestao.atividade.split(' ·')[0]} ${i.alternativa}` }))
                                    setEstado((s) => ({ ...s, [i.id]: 'feito' }))
                                  }}
                                >
                                  era {i.alternativa.split(' ')[0]} {i.alternativa.split(' ')[1]}
                                </Button>
                              )}
                              <Button size="sm" variant={i.sugestao.cliente ? 'ghost' : 'outline'} className="rounded-full" onClick={() => setCorrigir(i)}>
                                {i.sugestao.cliente ? (i.tipo === 'conflito' ? 'dividir ou corrigir' : 'corrigir') : 'classificar'}
                              </Button>
                              <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full" onClick={() => setEstado((s) => ({ ...s, [i.id]: 'descartado' }))}>
                                não era trabalho
                              </Button>
                            </div>
                          )}
                        </li>
                      )
                    })}
                </ul>
              </Caixa>
            ))}
            {!itens.length && (
              <Caixa>
                <p className="text-muted-foreground py-6 text-center text-sm">Nada para confirmar{clienteNome ? ` de ${clienteNome}` : ''}.</p>
              </Caixa>
            )}
            {marcados.length > 0 && (
              <div className="bg-surface shadow-painel sticky bottom-3 flex items-center gap-3 rounded-full py-2 pr-2 pl-4 text-sm">
                <span className="flex-1">{marcados.length} marcados com a sugestão</span>
                <Button size="sm" className="rounded-full" onClick={() => setEstado((s) => ({ ...s, ...Object.fromEntries(marcados.map((m) => [m.id, 'feito'])) }))}>
                  <CheckIcon /> Confirmar tudo marcado
                </Button>
              </div>
            )}
          </div>

          {gestor && (
            <div className="flex min-w-0 flex-col gap-4">
              <Caixa>
                <Pergunta>Arquivos sem pessoa</Pergunta>
                <p className="text-muted-foreground -mt-1 text-xs">A nuvem não disse quem salvou. Atribua e a pessoa confirma (“foi você?”).</p>
                <ul className="flex flex-col gap-2.5">
                  {artefatos.map((a) => (
                    <li key={a.id} className="flex flex-col gap-1.5 text-sm">
                      <span>{a.texto}</span>
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <ClockIcon className="size-3.5" /> {a.quando} · {a.atividade}
                      </span>
                      {a.atribuido ? (
                        <Badge variant="sucesso">
                          <UserIcon /> {a.atribuido}, aguardando confirmação
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setAtribuir(a.id)}>
                          Atribuir
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </Caixa>
              <Caixa>
                <Pergunta>Pendências por pessoa</Pergunta>
                <p className="text-muted-foreground -mt-1 text-xs">Só a contagem. O conteúdo é de cada um.</p>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {pendenciasPorPessoa.map((p) => (
                    <li key={p.nome} className="flex justify-between">
                      <span>{p.nome}</span>
                      <span className="tabular-nums">{p.n}</span>
                    </li>
                  ))}
                </ul>
              </Caixa>
              <Caixa>
                <Pergunta>A equipe confirma em dia? (30 dias)</Pergunta>
                <dl className="divide-border/70 flex flex-col divide-y text-sm">
                  {[
                    { rotulo: 'confirmados no mesmo dia', valor: '78%' },
                    { rotulo: 'em até 2 dias', valor: '94%' },
                    { rotulo: 'expiraram em 7 dias (sem cobrança)', valor: '3 · 1h40' },
                  ].map((x) => (
                    <div key={x.rotulo} className="flex justify-between gap-3 py-1.5 first:pt-0 last:pb-0">
                      <dt className="text-muted-foreground">{x.rotulo}</dt>
                      <dd className="tabular-nums">{x.valor}</dd>
                    </div>
                  ))}
                </dl>
              </Caixa>
            </div>
          )}
        </div>
      </div>
      {corrigir && (
        <CorrigirItem
          item={corrigir}
          onFechar={() => setCorrigir(null)}
          onSalvar={(texto) => {
            setResultado((r) => ({ ...r, [corrigir.id]: texto }))
            setEstado((s) => ({ ...s, [corrigir.id]: 'feito' }))
            setCorrigir(null)
          }}
        />
      )}
      {atribuir && (
        <AtribuirArtefato
          texto={artefatos.find((a) => a.id === atribuir)!.texto}
          sugestao={artefatos.find((a) => a.id === atribuir)!.sugestao}
          onFechar={() => setAtribuir(null)}
          onAtribuir={(p) => {
            setArtefatos((xs) => xs.map((x) => (x.id === atribuir ? { ...x, atribuido: p } : x)))
            setAtribuir(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}
