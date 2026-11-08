import { CheckIcon, PlugsConnectedIcon, PlusIcon, WarningIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CampoEscolha, Segmentado } from '@/components/ui/formulario'
import { Orb } from '@/components/ui/orb'
import {
  agentesEquipe,
  ausencias as ausenciasIniciais,
  calibracao as calIniciais,
  capturaSemanal,
  conectores as conIniciais,
  contestacoesADecidir,
  diagnosticoCobertura,
  equipeTs as equipeBase,
  equipeBpoTs,
  filaSemEquivalente,
  foraJornada,
  ondeFoi as ondeFoiBase,
  ondeFoiBpo,
  porAtividadeEstimada,
  type Conector,
} from '@/dados/timesheet'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'
import { AdotarCalibracao, DecidirContestacao, RegistrarAusencia } from './acoes'
import { Caixa, CabecalhoTs, Numero, usePacote } from './comum'
import { ConectarCore, MapasCore } from './configuracao'
import { Barras, Capacidade, ColunasEmpilhadas, Legenda, LinhasEmpilhadas, Pergunta } from './graficos'

/**
 * Timesheet › Equipe (05, 8.3; Gestor e Administrador): horas do setor por
 * pessoa e por confiança, onde foi o tempo, a captura semana a semana,
 * capacidade, diagnóstico de cobertura, contestações a decidir, agentes,
 * calibração, fila "sem equivalente", conectores e fora da jornada. Custo-hora
 * não aparece aqui.
 */
export function EquipeTela({ papel, clienteNome }: { papel: 'gestor' | 'admin'; clienteNome?: string }) {
  const aparencia = useAparencia()
  const [setor, setSetor] = useState('Fiscal')
  const [onde, setOnde] = useState<'cliente' | 'atividade' | 'origem'>('cliente')
  const [contestacoes, setContestacoes] = usePersistente('ts.equipe.contestacoes', contestacoesADecidir.map((c) => ({ ...c, decisao: undefined as string | undefined })))
  const [decidindo, setDecidindo] = useState<string | null>(null)
  const [ausencias, setAusencias] = usePersistente('ts.equipe.ausencias', ausenciasIniciais)
  const [registrando, setRegistrando] = useState(false)
  const [cal, setCal] = usePersistente('ts.equipe.cal', calIniciais)
  const [calibrando, setCalibrando] = useState<number | null>(null)
  const [fila, setFila] = usePersistente('ts.equipe.fila', filaSemEquivalente.map((f) => ({ ...f, resolvido: undefined as string | undefined })))
  const [conectores, setConectores] = usePersistente('ts.equipe.conectores', conIniciais)
  const [conectando, setConectando] = useState<Conector['core'] | null | undefined>(undefined)
  const [mapas, setMapas] = useState(false)

  const { pacote, chip } = usePacote()
  const equipeTs = pacote === 'bpo' ? equipeBpoTs : pacote === 'todos' ? [...equipeBase, ...equipeBpoTs] : equipeBase
  const ondeFoi = pacote === 'bpo' ? ondeFoiBpo : ondeFoiBase
  const total = equipeTs.reduce((s, p) => s + p.automatica + p.confirmada + p.estimada, 0)
  const auto = equipeTs.reduce((s, p) => s + p.automatica, 0)
  const sem = equipeTs.reduce((s, p) => s + p.sem, 0)
  const disponivel = equipeTs.reduce((s, p) => s + p.disponivel, 0)
  const decidir = contestacoes.find((c) => c.id === decidindo)

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoTs titulo="Equipe" sub={`Novembro · os setores que você gere${clienteNome ? ` · horas de ${clienteNome} destacadas` : ''}`} papel={papel}>
          {chip}
          <span className="w-40">
            <CampoEscolha valor={setor} onMudar={setSetor} opcoes={['Fiscal', 'Contábil', 'DP', 'Notas', 'Todos os meus setores'].map((s) => ({ valor: s, rotulo: s }))} />
          </span>
        </CabecalhoTs>

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Numero valor={`${total} h`} rotulo="registradas" />
            <Numero valor={`${Math.round((auto / (total + sem)) * 100)}%`} rotulo="cobertura automática" detalhe="meta do escritório: 80%" />
            <Numero valor="86%" rotulo="itens confirmados" />
            <Numero valor={`${Math.round((sem / (total + sem)) * 100)}%`} rotulo="sem classificação" />
            <Numero valor={`${Math.round((total / disponivel) * 100)}%`} rotulo="da capacidade" detalhe={`${total} de ${disponivel} h · agentes 18h45 de máquina`} />
          </div>
        </Caixa>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <Caixa>
              <Pergunta>Quanto cada pessoa registrou, e quanto foi automático?</Pergunta>
              <LinhasEmpilhadas dados={equipeTs.map((p) => ({ rotulo: p.nome, partes: (['automatica', 'confirmada', 'estimada'] as const).map((c) => ({ c, v: p[c] })) }))} />
              <Legenda itens={['automatica', 'confirmada', 'estimada']} />
            </Caixa>
            <Caixa>
              <Pergunta>A captura está melhorando? (% das horas por semana)</Pergunta>
              <ColunasEmpilhadas unidade="%" altura={120} dados={capturaSemanal.map((s) => ({ rotulo: s.semana, partes: (['automatica', 'confirmada', 'estimada'] as const).map((c) => ({ c, v: s[c] })) }))} />
              <Legenda itens={['automatica', 'confirmada', 'estimada']} />
            </Caixa>
            <Caixa>
              <Pergunta>Por que a cobertura não é maior?</Pergunta>
              <ul className="flex flex-col gap-2 text-sm">
                {diagnosticoCobertura.map((d) => (
                  <li key={d.item} className="flex items-start gap-2">
                    <WarningIcon weight={d.impacto === 'alto' ? 'fill' : 'regular'} className="text-warning mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0 flex-1">{d.item}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">{d.impacto}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-xs">É diagnóstico da captura, não falta das pessoas.</p>
            </Caixa>
            <Caixa>
              <Pergunta>Que tarefas do core não entram? (sem equivalente)</Pergunta>
              <ul className="divide-border/70 -mx-2 flex flex-col divide-y">
                {fila.map((f) => (
                  <li key={f.id} className="flex flex-col gap-1.5 px-2 py-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate">
                        “{f.nome}” <span className="text-muted-foreground">· {f.departamento}</span>
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">{f.ocorrencias}× no mês</span>
                    </div>
                    {f.resolvido ? (
                      <Badge variant="sucesso">
                        <CheckIcon /> {f.resolvido} · vale 90 dias para trás
                      </Badge>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {f.sugestoes.map((s, k) => (
                          <Button key={s} size="sm" variant={k === 0 ? 'secondary' : 'ghost'} className="h-7 rounded-full px-2.5 text-xs" onClick={() => setFila((xs) => xs.map((x) => (x.id === f.id ? { ...x, resolvido: s } : x)))}>
                            é {s.split(' ·')[0]}
                          </Button>
                        ))}
                        <Button size="sm" variant="ghost" className="text-muted-foreground h-7 rounded-full px-2.5 text-xs" onClick={() => setFila((xs) => xs.map((x) => (x.id === f.id ? { ...x, resolvido: 'não é trabalho medido' } : x)))}>
                          não é trabalho medido
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-xs">Mais 23 tipos com menos de 3 ocorrências.</p>
            </Caixa>
            <Caixa>
              <Pergunta>Que atividades a captura não enxerga?</Pergunta>
              <ul className="flex flex-col gap-2 text-sm">
                {porAtividadeEstimada.map((a) => (
                  <li key={a.atividade} className="grid grid-cols-[1fr_6rem_3rem] items-center gap-3">
                    <span className="truncate">{a.atividade}</span>
                    <span className="bg-sunken h-2 rounded-full">
                      <span className="block h-full rounded-full" style={{ width: `${a.estimada}%`, background: 'color-mix(in oklab, var(--foreground) 45%, transparent)' }} />
                    </span>
                    <span className="text-right text-xs tabular-nums">{a.estimada}%</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-xs">% de horas estimadas por atividade (n sessões no mês).</p>
            </Caixa>
            <Caixa>
              <Pergunta>O que os integrantes fizeram, custaram e pouparam?</Pergunta>
              <div className="-mx-1 overflow-x-auto px-1">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-left text-xs">
                      <th className="pb-1.5 font-medium">Integrante</th>
                      <th className="pb-1.5 font-medium">Dono</th>
                      <th className="pb-1.5 text-right font-medium">Máquina</th>
                      <th className="pb-1.5 text-right font-medium">Custo</th>
                      <th className="pb-1.5 text-right font-medium">Poupadas (estim.)</th>
                      <th className="pb-1.5 text-right font-medium">Aprovação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/70 divide-y">
                    {agentesEquipe.map((a) => {
                      const t = aparencia({ setor: a.setor })
                      return (
                        <tr key={a.integrante}>
                          <td className="py-2 pr-2">
                            <span className="flex items-center gap-2">
                              <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={20} cutucavel={false} extras={false} /> {t.nome}
                            </span>
                          </td>
                          <td className="text-muted-foreground py-2 pr-2">{a.dono}</td>
                          <td className="py-2 pr-2 text-right tabular-nums">{a.maquina}</td>
                          <td className="py-2 pr-2 text-right tabular-nums">{a.custo}</td>
                          <td className="py-2 pr-2 text-right tabular-nums">{a.poupadas.toString().replace('.', ',')} h</td>
                          <td className="py-2 text-right tabular-nums">{a.aprovacao}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground text-xs">Série separada: nunca soma com as horas humanas. Aprovação = cartões aprovados sem edição.</p>
            </Caixa>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <Caixa>
              <Pergunta
                acao={
                  <Segmentado
                    rotulo="Agrupar por"
                    valor={onde}
                    onMudar={setOnde}
                    opcoes={[
                      { valor: 'cliente', rotulo: 'cliente' },
                      { valor: 'atividade', rotulo: 'atividade' },
                      { valor: 'origem', rotulo: 'origem' },
                    ]}
                  />
                }
              >
                Onde o tempo do setor foi?
              </Pergunta>
              <Barras dados={ondeFoi[onde]} destacar={onde === 'cliente' ? clienteNome : undefined} />
            </Caixa>
            <Caixa>
              <Pergunta
                acao={
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setRegistrando(true)}>
                    <PlusIcon /> Ausência
                  </Button>
                }
              >
                Quem está acima ou abaixo da capacidade?
              </Pergunta>
              <Capacidade dados={equipeTs.map((p) => ({ nome: p.nome, usadas: p.automatica + p.confirmada + p.estimada, disponivel: p.disponivel, ausencia: p.ausencia }))} />
              <p className="text-muted-foreground text-xs">Faixa verde: 85 a 100%. Ausências: {ausencias.map((a) => `${a.pessoa} (${a.tipo}, ${a.de} a ${a.ate})`).join('; ')}. Previsão das próximas 2 semanas pelas tarefas abertas: 94%.</p>
            </Caixa>
            <Caixa>
              <Pergunta acao={<Badge variant={contestacoes.some((c) => !c.decisao) ? 'destaque' : 'sucesso'}>{contestacoes.filter((c) => !c.decisao).length} a decidir</Badge>}>Contestações</Pergunta>
              <ul className="divide-border/70 -mx-2 flex flex-col divide-y">
                {contestacoes.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {c.pessoa} · {c.motivo} → {c.correcao}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">{c.sessao}</span>
                    </span>
                    {c.decisao ? (
                      <Badge variant={c.decisao.startsWith('aceita') ? 'sucesso' : 'outline'}>{c.decisao}</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setDecidindo(c.id)}>
                        Decidir
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa>
              <Pergunta
                acao={
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConectando(null)}>
                    <PlugsConnectedIcon /> Conectar
                  </Button>
                }
              >
                Sistemas contábeis conectados
              </Pergunta>
              <ul className="flex flex-col gap-2.5">
                {conectores.map((c) => (
                  <li key={c.core} className="flex items-start gap-3 text-sm">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', c.status === 'conectado' ? 'bg-success' : c.status === 'importação' ? 'bg-warning' : 'bg-sunken ring-border ring-1')} />
                    <span className="min-w-0 flex-1">
                      <span className="block">
                        {c.core} <span className="text-muted-foreground">· {c.modo}</span>
                      </span>
                      <span className="text-muted-foreground block text-xs">{c.status === 'não conectado' ? 'não conectado' : c.detalhe}</span>
                    </span>
                    {c.status === 'conectado' ? (
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setMapas(true)}>
                        Equivalências
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setConectando(c.core)}>
                        {c.status === 'importação' ? 'Importar' : 'Conectar'}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa>
              <Pergunta>O padrão do catálogo está certo?</Pergunta>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-left text-xs">
                    <th className="pb-1.5 font-medium">Atividade</th>
                    <th className="pb-1.5 text-right font-medium">Catálogo</th>
                    <th className="pb-1.5 text-right font-medium">Medido</th>
                    <th className="pb-1.5 text-right font-medium">n</th>
                    <th />
                  </tr>
                </thead>
                <tbody className="divide-border/70 divide-y">
                  {cal.map((c, i) => (
                    <tr key={c.atividade}>
                      <td className="py-2 pr-2">{c.atividade}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">{c.catalogoMin} min</td>
                      <td className={cn('py-2 pr-2 text-right tabular-nums', Math.abs(c.medianaMin - c.catalogoMin) / c.catalogoMin > 0.3 && 'font-medium')}>{c.medianaMin} min</td>
                      <td className="text-muted-foreground py-2 pr-2 text-right tabular-nums">{c.n}</td>
                      <td className="py-2 text-right">
                        {c.adotada ? (
                          <Badge variant="sucesso">adotado</Badge>
                        ) : (
                          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setCalibrando(i)}>
                            Adotar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Caixa>
            <Caixa>
              <Pergunta>Houve trabalho fora da jornada?</Pergunta>
              <ul className="flex flex-col gap-1.5 text-sm">
                {foraJornada.map((f) => (
                  <li key={f.nome} className="flex justify-between gap-3">
                    <span>{f.nome}</span>
                    <span className="text-muted-foreground tabular-nums">{f.horas ? `${f.horas.toString().replace('.', ',')} h em ${f.ocorrencias} ${f.ocorrencias === 1 ? 'vez' : 'vezes'}` : '—'}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-2 text-sm">
                <span className="text-muted-foreground block text-xs">Integrantes fora do horário do escritório</span>
                <span className="flex justify-between gap-3">
                  <span>14 jobs aprovados</span>
                  <span className="text-muted-foreground tabular-nums">2h10 de máquina</span>
                </span>
                <span className="flex justify-between gap-3">
                  <span>2 pedidos recusados</span>
                  <span className="text-muted-foreground">limite: só com aprovação</span>
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Agregado do mês, para tratar a política (GES-053), não a pessoa. Não substitui o ponto.</p>
            </Caixa>
          </div>
        </div>
      </div>

      {decidir && (
        <DecidirContestacao
          c={decidir}
          onFechar={() => setDecidindo(null)}
          onDecidir={(aceita, motivo) => {
            setContestacoes((xs) => xs.map((x) => (x.id === decidir.id ? { ...x, decisao: aceita ? 'aceita' : `recusada: ${motivo}` } : x)))
            setDecidindo(null)
          }}
        />
      )}
      {registrando && (
        <RegistrarAusencia
          onFechar={() => setRegistrando(false)}
          onSalvar={(a) => {
            setAusencias((xs) => [...xs, a])
            setRegistrando(false)
          }}
        />
      )}
      {calibrando != null && (
        <AdotarCalibracao
          linha={cal[calibrando]}
          onFechar={() => setCalibrando(null)}
          onAdotar={(m) => {
            setCal((xs) => xs.map((x, i) => (i === calibrando ? { ...x, adotada: true, catalogoMin: m } : x)))
            setCalibrando(null)
          }}
        />
      )}
      {conectando !== undefined && (
        <ConectarCore
          inicial={conectando ?? undefined}
          onFechar={() => setConectando(undefined)}
          onConectar={(c) => {
            setConectores((xs) => (xs.some((x) => x.core === c.core) ? xs.map((x) => (x.core === c.core ? c : x)) : [...xs, c]))
            setConectando(undefined)
          }}
        />
      )}
      {mapas && <MapasCore onFechar={() => setMapas(false)} />}
    </AreaRolagem>
  )
}
