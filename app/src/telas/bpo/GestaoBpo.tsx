import { ArrowSquareOutIcon, FileTextIcon, PlusIcon } from '@phosphor-icons/react'
import { useLoja, useNavegacao, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { BarraUso } from '@/components/compostos/blocos'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { empresasBpo, type EmpresaBpo } from '@/dados/bpo'
import { tributacaoServico } from '@/dados/financeiro'
import { custoHora as custoEscritorio, custoHoraPacoteBpo } from '@/dados/timesheet'
import { cn } from '@/lib/utils'
import { brl, CabecalhoBpo, PaginaBpo, Caixa, Numero, TituloBloco, type PropsBpo } from './comum'

const capacidade: Record<string, number> = { 'Lucas Prado': 40, 'Marina Teixeira': 30 }

/**
 * BPO › Entregas e SLA (10, 5.5): o que foi entregue a cada empresa no mês
 * (relatório, fechamento à contabilidade) e o SLA combinado, com os desvios.
 */
export function EntregasBpoTela({ empresa }: PropsBpo) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const [enviados, setEnviados] = usePersistente<string[]>('bpo.enviados', [])
  const lista = empresa ? [empresa] : empresasBpo
  return (
    <PaginaBpo>
      <CabecalhoBpo integrante="i-bpo-gerencial" titulo="Entregas e SLA" sub="Outubro fechado e novembro em curso · SLA é o combinado no contrato de cada empresa" />
      <Caixa>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Numero valor={`${Math.round(lista.reduce((s, e) => s + e.sla.mes, 0) / lista.length)}%`} rotulo="SLA médio" />
          <Numero valor={lista.reduce((s, e) => s + e.sla.desvios.length, 0)} rotulo="desvios no mês" />
          <Numero valor={lista.filter((e) => enviados.includes(e.clienteId) || e.clienteId === 'c4').length} rotulo="relatórios de outubro enviados" detalhe={`de ${lista.length}`} />
          <Numero valor={lista.filter((e) => e.contabil).length} rotulo="fechamentos para o Contábil" detalhe="os outros vão ao contador da empresa" />
        </div>
      </Caixa>
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((e) => {
          const relatorio = enviados.includes(e.clienteId) || e.clienteId === 'c4'
          return (
            <Caixa key={e.clienteId}>
              <TituloBloco descricao={`SLA ${e.sla.mes}% · ${e.responsavel}`}>{e.nome}</TituloBloco>
              <div className="bg-sunken h-2 overflow-hidden rounded-full" role="meter" aria-label="SLA no prazo" aria-valuenow={e.sla.mes} aria-valuemax={100}>
                <div className={cn('h-full rounded-full', e.sla.mes < 90 ? 'bg-destructive' : 'bg-foreground/70')} style={{ width: `${e.sla.mes}%` }} />
              </div>
              <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
                {e.sla.desvios.length === 0 && <li>sem desvios no mês</li>}
                {e.sla.desvios.map((d) => (
                  <li key={d}>desvio: {d}</li>
                ))}
              </ul>
              <ul className="divide-border/70 flex flex-col divide-y text-sm">
                <li className="flex items-center gap-2 py-2">
                  <FileTextIcon className="text-muted-foreground size-4" />
                  <span className="flex-1">Relatório de outubro (DRE, caixa, pendências)</span>
                  {relatorio ? (
                    <Badge variant="sucesso">no app</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setEnviados((xs) => [...xs, e.clienteId])
                        loja.registrar(usuario.nome, `BPO · relatório de outubro enviado a ${e.nome}`)
                        loja.toast(`Relatório de outubro no app de ${e.nome} e em Arquivos › Entregáveis`)
                      }}
                    >
                      Enviar
                    </Button>
                  )}
                </li>
                <li className="flex items-center gap-2 py-2">
                  <FileTextIcon className="text-muted-foreground size-4" />
                  <span className="flex-1">{e.contabil ? 'Fechamento ao setor Contábil (BPO-013)' : 'Fechamento ao contador da empresa (BPO-013)'}</span>
                  <span className="text-muted-foreground text-xs">até dia 7</span>
                </li>
              </ul>
            </Caixa>
          )
        })}
      </div>
    </PaginaBpo>
  )
}

/**
 * BPO › Volume e faturamento (10, 4.2): lançamentos do mês contra a faixa
 * contratada; o que passa vira extra no Financeiro do escritório.
 */
export function VolumeBpoTela({ empresa }: PropsBpo) {
  const loja = useLoja()
  const nav = useNavegacao()
  const { usuario, permissoes } = useSessao()
  const [lancados, setLancados] = usePersistente<string[]>('bpo.lancados', [])
  const lista = empresa ? [empresa] : empresasBpo
  const acima = (e: EmpresaBpo) => Math.max(0, e.volume.lancamentos - e.volume.limiteFaixa)
  return (
    <PaginaBpo>
      <CabecalhoBpo integrante="i-bpo-gerencial" titulo="Volume e faturamento" sub="Novembro até hoje · a contagem é automática e o extra precisa do seu ok">
        {permissoes.modulos.includes('financeiro') && (
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => nav.irPara({ modulo: 'financeiro', aba: 'cobranca' })}>
            <ArrowSquareOutIcon /> Faturar no Financeiro
          </Button>
        )}
        <span className="text-muted-foreground text-xs">
          {loja.estado.cenario === 'bpo_puro' ? 'O honorário do BPO sai na fatura do escritório, titular escritório.' : 'Fatura única: um pagamento só, com cada serviço numa linha e a nota fiscal por serviço.'}
        </span>
      </CabecalhoBpo>
      <Caixa>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Numero valor={lista.reduce((s, e) => s + e.volume.lancamentos, 0).toLocaleString('pt-BR')} rotulo="lançamentos" />
          <Numero valor={lista.reduce((s, e) => s + e.volume.pagamentos, 0)} rotulo="pagamentos preparados" />
          <Numero valor={brl(lista.reduce((s, e) => s + e.honorarioBpo, 0))} rotulo="honorário BPO no mês" />
          <Numero valor={lista.filter((e) => acima(e) > 0).length} rotulo="acima da faixa" />
        </div>
      </Caixa>
      <Caixa className="gap-0 p-0 sm:p-0">
        <ul className="divide-border/70 flex flex-col divide-y">
          {lista.map((e) => (
            <li key={e.clienteId} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-5">
              <span className="min-w-0 flex-1 basis-56">
                <span className="block truncate text-sm font-medium">{e.nome}</span>
                <span className="text-muted-foreground block text-xs">
                  {e.volume.faixa} · {e.volume.contas} conta{e.volume.contas > 1 ? 's' : ''} · {e.volume.conciliacoes} conciliações
                </span>
                <span className="text-muted-foreground block text-xs">
                  {e.contabil && loja.estado.cenario !== 'bpo_puro'
                    ? `Fatura única: honorário contábil + BPO${acima(e) > 0 ? ' + excedente' : ''}, cada um na sua linha · NFS-e por serviço (${tributacaoServico.contabil.codigo} e ${tributacaoServico.bpo.codigo})`
                    : `Fatura do BPO${acima(e) > 0 ? ' com a linha do excedente' : ''} · NFS-e ${tributacaoServico.bpo.codigo}`}
                </span>
              </span>
              <span className="w-full sm:w-56">
                <BarraUso rotulo="Lançamentos" usado={e.volume.lancamentos} total={e.volume.limiteFaixa} />
              </span>
              <span className="w-24 text-right text-sm tabular-nums">{brl(e.honorarioBpo)}</span>
              <span className="flex w-40 justify-end">
                {acima(e) > 0 &&
                  (lancados.includes(e.clienteId) ? (
                    <Badge variant="sucesso">extra lançado</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setLancados((xs) => [...xs, e.clienteId])
                        loja.registrar(usuario.nome, `BPO · ${acima(e)} lançamentos acima da faixa de ${e.nome} lançados como extra`)
                        loja.toast(`${acima(e)} lançamentos acima da faixa (${brl(acima(e) * 2.5)}) vão na fatura única de dezembro`, { modulo: 'financeiro', aba: 'cobranca' }, 'Ver em Cobranças')
                      }}
                    >
                      <PlusIcon /> Extra de {brl(acima(e) * 2.5)}
                    </Button>
                  ))}
              </span>
            </li>
          ))}
        </ul>
      </Caixa>
    </PaginaBpo>
  )
}

/**
 * BPO › Rentabilidade e capacidade (10, 5.4): só Administrador (e Gestor com
 * Gestão ou Financeiro). Horas do Timesheet contra o honorário, e a carga de
 * cada analista contra a capacidade.
 */
export function RentabilidadeBpoTela({ empresa }: PropsBpo) {
  const loja = useLoja()
  const nav = useNavegacao()
  // Um custo-hora só, do escritório (todos os pacotes); o do pacote é opção do Timesheet (decisão de 8/11/2026).
  const custoHora = loja.estado.custoPorPacote ? custoHoraPacoteBpo : custoEscritorio.valor
  const lista = empresa ? [empresa] : empresasBpo
  const margem = (e: EmpresaBpo) => Math.round(((e.honorarioBpo - e.horasMes * custoHora) / e.honorarioBpo) * 100)
  const pessoas = Object.keys(capacidade).map((p) => ({ nome: p, horas: empresasBpo.filter((e) => e.analista === p).reduce((s, e) => s + e.horasMes, 0) }))
  return (
    <PaginaBpo>
      <CabecalhoBpo
        integrante="i-bpo-gerencial"
        titulo="Rentabilidade e capacidade"
        sub={`Horas do Timesheet de novembro · ${loja.estado.custoPorPacote ? `custo-hora do pacote BPO, ${brl(custoHora)}` : `custo-hora do escritório, ${brl(custoHora)} (todos os pacotes)`}`}
      >
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => nav.irPara({ modulo: 'timesheet', aba: 'rentabilidade' })}>
          <ArrowSquareOutIcon /> Ver no Timesheet (filtro BPO)
        </Button>
      </CabecalhoBpo>
      {!loja.estado.custoPorPacote && (
        <p className="bg-sunken/60 text-muted-foreground rounded-[14px] px-4 py-2.5 text-sm">
          No custo-hora do escritório, que inclui a equipe contábil, o BPO aparece com margem menor. Para ver com o custo da equipe do BPO, ligue “Custo-hora por pacote (opcional)” em Timesheet › Configurar › Custo-hora.
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Caixa className="gap-0">
          <TituloBloco descricao="Honorário do BPO menos as horas da equipe.">Margem por empresa</TituloBloco>
          <ul className="divide-border/70 mt-2 flex flex-col divide-y">
            {lista.map((e) => (
              <li key={e.clienteId} className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem_3.5rem] items-center gap-3 py-2.5 text-sm">
                <span className="truncate">{e.nome}</span>
                <span className="text-muted-foreground text-right text-xs tabular-nums">{e.horasMes.toLocaleString('pt-BR')} h</span>
                <span className="text-muted-foreground text-right text-xs tabular-nums">{brl(e.honorarioBpo / Math.max(e.horasMes, 1))}/h</span>
                <span className={cn('text-right tabular-nums', margem(e) < 20 && 'text-destructive')}>{margem(e)}%</span>
              </li>
            ))}
          </ul>
        </Caixa>
        <Caixa>
          <TituloBloco descricao="Horas de BPO no mês contra o que cada pessoa tem para o pacote.">Capacidade</TituloBloco>
          {pessoas.map((p) => (
            <BarraUso key={p.nome} rotulo={p.nome} usado={p.horas} total={capacidade[p.nome]} unidade=" h" />
          ))}
          <p className="text-muted-foreground text-xs">
            A Loja Bela Vista consome 6 h e dá prejuízo: a sincronização parada gerou retrabalho. Vale rever a faixa no aditivo. O integrante faz a captura e a conciliação; as horas são de conferência, exceções e cliente.
          </p>
        </Caixa>
      </div>
    </PaginaBpo>
  )
}
