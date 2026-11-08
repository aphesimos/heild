import { ArrowRightIcon, CalendarCheckIcon, ReceiptIcon, ScalesIcon, TrendUpIcon, WarningIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useLoja, useNavegacao, usePersistente, type Destino } from '@/ambiente/loja'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import {
  contasBancarias,
  contasPagar,
  divergencias as divergenciasIniciais,
  faturasDoCenario,
  fluxoCaixa,
  indicadores,
  inicioProjecao,
  mesesCaixa,
  receitaPorSetor,
  resumoCobranca as cobranca,
  titularEscritorio,
  transacoesConciliar,
} from '@/dados/financeiro'
import { BarrasReais } from './ContratosTela'
import { brl, CabecalhoFin, Caixa, Numero, TituloBloco } from './comum'
import { FluxoMensal, SeloTitular } from './pecas'

function Decisao({ icone, titulo, detalhe, destino, rotulo }: { icone: ReactNode; titulo: string; detalhe: string; destino: Destino; rotulo: string }) {
  const nav = useNavegacao()
  return (
    <li className="flex items-center gap-3 py-2.5 text-sm">
      <span className="bg-sunken text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full">{icone}</span>
      <span className="min-w-0 flex-1">
        <span className="block">{titulo}</span>
        <span className="text-muted-foreground block text-xs">{detalhe}</span>
      </span>
      <Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={() => nav.irPara(destino)}>
        {rotulo} <ArrowRightIcon />
      </Button>
    </li>
  )
}

/**
 * Financeiro › Visão geral (09, 10.2): abre pelo que precisa de decisão (gestão
 * por exceção), com os números do mês, o caixa dos próximos meses, a receita
 * por setor e as vencidas por idade. Cada item leva à aba onde se resolve.
 */
export function VisaoFinTela() {
  const loja = useLoja()
  // Lê a mesma memória da sessão das outras abas: o que foi aprovado, conciliado ou pago lá some daqui.
  const [contas] = usePersistente('fin.pagar', contasPagar)
  const [pendentes] = usePersistente('fin.conc.pendentes', transacoesConciliar)
  const [divergencias] = usePersistente('fin.conc.divergencias', divergenciasIniciais)
  const [faturas] = usePersistente(`fin.faturas.${loja.estado.cenario}`, () => faturasDoCenario(loja.estado.cenario))
  const aAprovar = contas.filter((c) => c.situacao === 'a_aprovar')
  const vencidas = faturas.filter((f) => f.situacao === 'vencida')
  const caixaHoje = contasBancarias.filter((b) => b.saldo > 0).reduce((s, b) => s + b.saldo, 0)
  const loteAprovado = loja.estado.decisoes['fik1'] === 'aprovar'
  const idades = [
    { faixa: 'até 15 dias', valor: vencidas.filter((f) => (f.diasAtraso ?? 0) <= 15).reduce((s, f) => s + f.valor, 0) },
    { faixa: '16 a 30 dias', valor: vencidas.filter((f) => (f.diasAtraso ?? 0) > 15 && (f.diasAtraso ?? 0) <= 30).reduce((s, f) => s + f.valor, 0) },
    { faixa: 'mais de 30 dias', valor: vencidas.filter((f) => (f.diasAtraso ?? 0) > 30).reduce((s, f) => s + f.valor, 0) },
  ]
  const maxIdade = Math.max(1, ...idades.map((i) => i.valor))
  const proximos = {
    meses: mesesCaixa.slice(4, 10),
    entradas: fluxoCaixa.entradas.slice(4, 10),
    saidas: fluxoCaixa.saidas.slice(4, 10),
    inicio: inicioProjecao - 4,
    marcos: fluxoCaixa.marcos.map((m) => ({ ...m, mes: m.mes - 4 })).filter((m) => m.mes >= 0 && m.mes < 6),
  }

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin titulo="Visão geral" status="Separei o que precisa de você hoje; o resto está andando sozinho" sub="Novembro de 2026 · números do escritório; cada item abre a aba onde se resolve">
          <SeloTitular titular={titularEscritorio} />
        </CabecalhoFin>

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Numero valor={brl(indicadores.mrr)} rotulo="receita recorrente" detalhe={`+${indicadores.mrrVar.toLocaleString('pt-BR')}% no mês`} />
            <Numero valor={`${indicadores.inadimplencia.toLocaleString('pt-BR')}%`} rotulo="inadimplência" detalhe={`${vencidas.length} fatura(s) vencida(s)`} />
            <Numero valor={brl(caixaHoje)} rotulo="caixa hoje" detalhe="Inter e Itaú" />
            <Numero valor={brl(aAprovar.reduce((s, c) => s + c.valor, 0))} rotulo="a aprovar" detalhe={`${aAprovar.length} contas`} />
            <Numero valor={`${indicadores.margem.toLocaleString('pt-BR')}%`} rotulo="margem de outubro" />
          </div>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Caixa>
            <TituloBloco descricao="Gestão por exceção: só aparece o que pede uma decisão sua.">Precisa de você</TituloBloco>
            <ul className="divide-border/70 flex flex-col divide-y">
              {!loteAprovado && (
                <Decisao
                  icone={<CalendarCheckIcon className="size-5" />}
                  titulo={`Cobranças de dezembro: ${cobranca.proximoCiclo.clientes} clientes, ${brl(cobranca.proximoCiclo.valor)}`}
                  detalhe={`saem em ${cobranca.proximoCiclo.data} às 06:00, com NFS-e · cartão no chat do Financeiro`}
                  destino={{ modulo: 'inicio', aba: 'time', integrante: 'i-financeiro' }}
                  rotulo="Aprovar"
                />
              )}
              {aAprovar.length > 0 && (
                <Decisao
                  icone={<ReceiptIcon className="size-5" />}
                  titulo={`${aAprovar.length} contas a pagar esperando aprovação`}
                  detalhe={`${aAprovar.filter((c) => c.alerta).length} com alerta de duplicidade ou fornecedor novo`}
                  destino={{ modulo: 'financeiro', aba: 'pagar' }}
                  rotulo="Contas a pagar"
                />
              )}
              <Decisao
                icone={<ScalesIcon className="size-5" />}
                titulo={`${pendentes.length + divergencias.length} lançamentos para conciliar`}
                detalhe={`${divergencias.length} divergências: pagador desconhecido e pagamento com juros`}
                destino={{ modulo: 'financeiro', aba: 'conciliacao' }}
                rotulo="Conciliação"
              />
              {vencidas.map((f) => (
                <Decisao
                  key={f.id}
                  icone={<WarningIcon className="size-5" />}
                  titulo={`${f.cliente}: fatura de ${f.competencia} vencida há ${f.diasAtraso} dias`}
                  detalhe={`${brl(f.valor)} · ${f.etapaRegua ?? 'na régua'}`}
                  destino={{ modulo: 'financeiro', aba: 'cobranca', fatura: f.id }}
                  rotulo="Cobrança"
                />
              ))}
              <Decisao
                icone={<TrendUpIcon className="size-5" />}
                titulo="2 clientes passaram da faixa contratada"
                detalhe="Loja Bela Vista (notas) e Padaria Pão Quente (funcionários): aditivo ou extra"
                destino={{ modulo: 'financeiro', aba: 'contratos' }}
                rotulo="Contratos"
              />
            </ul>
          </Caixa>
          <div className="flex flex-col gap-4">
            <Caixa>
              <TituloBloco>Caixa dos próximos meses</TituloBloco>
              <FluxoMensal d={proximos} altura="h-32" />
            </Caixa>
            <Caixa className="flex-1">
              <TituloBloco>Vencidas por idade</TituloBloco>
              <ul className="flex flex-col gap-2">
                {idades.map((i) => (
                  <li key={i.faixa} className="grid grid-cols-[7rem_minmax(0,1fr)_6rem] items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{i.faixa}</span>
                    <span className="bg-sunken h-2.5 overflow-hidden rounded-full">
                      <span className="block h-full rounded-full" style={{ width: `${(i.valor / maxIdade) * 100}%`, background: 'color-mix(in oklab, var(--foreground) 60%, transparent)' }} />
                    </span>
                    <span className="text-right tabular-nums">{brl(i.valor)}</span>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
        </div>

        <Caixa>
          <TituloBloco descricao="Pelos itens dos contratos vigentes; a mesma conta de Contratos.">Receita por setor</TituloBloco>
          <BarrasReais dados={receitaPorSetor} />
        </Caixa>
      </div>
    </AreaRolagem>
  )
}
