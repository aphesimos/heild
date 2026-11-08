import { PencilSimpleIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { comissoes, custosVariaveis as custosIniciais, dre, indicadores, orcamento as orcamentoInicial, socios } from '@/dados/financeiro'
import { cn } from '@/lib/utils'
import { Pergunta } from '../timesheet/graficos'
import { brl, CabecalhoFin, Caixa, Numero } from './comum'

const sinal = (v: number) => (v < 0 ? `−${brl(-v)}` : brl(v))

/**
 * Financeiro › Resultado (FIN-006, 007, 008, 012; GES-010, 011): indicadores
 * do escritório, a DRE gerencial por centro de custo com o custo vindo do
 * timesheet, orçado × realizado, a distribuição aos sócios, comissões e os
 * custos variáveis por cliente.
 */
export function ResultadoTela() {
  const [ratear, setRatear] = useState(false)
  const [orcamento, setOrcamento] = usePersistente('fin.res.orcamento', orcamentoInicial)
  const [custos, setCustos] = usePersistente('fin.res.custos', custosIniciais)
  const [modal, setModal] = useState<'orcamento' | 'distribuir' | 'regras' | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const base = dre.map((l) => ({ ...l, resultado: l.receita - l.pessoal - l.operacao - l.rateio }))
  const apoio = base.find((l) => l.centro === 'Atendimento')!
  const produtivos = base.filter((l) => l.centro !== 'Atendimento')
  const receitaProd = produtivos.reduce((s, l) => s + l.receita, 0)
  const linhas = ratear ? produtivos.map((l) => ({ ...l, resultado: l.resultado + apoio.resultado * (l.receita / receitaProd), rateio: l.rateio - apoio.resultado * (l.receita / receitaProd) })) : base
  const tot = linhas.reduce((s, l) => ({ receita: s.receita + l.receita, pessoal: s.pessoal + l.pessoal, operacao: s.operacao + l.operacao, rateio: s.rateio + l.rateio, resultado: s.resultado + l.resultado, horas: s.horas + l.horas }), {
    receita: 0,
    pessoal: 0,
    operacao: 0,
    rateio: 0,
    resultado: 0,
    horas: 0,
  })
  const resultadoMes = base.reduce((s, l) => s + l.resultado, 0)
  const i = indicadores

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin titulo="Resultado" status="Outubro fechado; preparei a DRE e a comparação com o orçamento" sub="Outubro fechado · receita pelos itens dos contratos; custo pela folha, pelo timesheet e pelo rateio" />

        {aviso && <p className="bg-success/10 rounded-[14px] px-3 py-2 text-sm">{aviso}</p>}

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Numero valor={brl(i.mrr)} rotulo="receita recorrente" detalhe={`+${i.mrrVar.toLocaleString('pt-BR')}% no mês`} />
            <Numero valor={i.clientes} rotulo="clientes" detalhe={`${i.entradas} entraram · ${i.saidas} saiu`} />
            <Numero valor={brl(i.ticket)} rotulo="ticket médio" />
            <Numero valor={`${i.inadimplencia.toLocaleString('pt-BR')}%`} rotulo="inadimplência > 90 dias" />
            <Numero valor={`${(Math.round((resultadoMes / tot.receita) * 1000) / 10).toLocaleString('pt-BR')}%`} rotulo="margem do mês" detalhe={sinal(resultadoMes)} />
          </div>
        </Caixa>

        <Caixa>
          <Pergunta acao={<Interruptor ligado={ratear} onMudar={setRatear} rotulo="Ratear o Atendimento nos setores" />}>Que setor dá resultado?</Pergunta>
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full text-sm sm:min-w-[640px]">
              <thead>
                <tr className="text-muted-foreground text-left text-xs">
                  <th className="py-2 font-normal">Centro de custo</th>
                  <th className="py-2 text-right font-normal">Receita</th>
                  <th className="py-2 text-right font-normal">Pessoal</th>
                  <th className="hidden sm:table-cell py-2 text-right font-normal">Operação</th>
                  <th className="hidden sm:table-cell py-2 text-right font-normal">Rateio</th>
                  <th className="py-2 text-right font-normal">Resultado</th>
                  <th className="py-2 text-right font-normal">Margem</th>
                  <th className="hidden sm:table-cell py-2 text-right font-normal">Horas</th>
                </tr>
              </thead>
              <tbody className="divide-border/70 divide-y border-t">
                {linhas.map((l) => (
                  <tr key={l.centro}>
                    <td className="py-2">{l.centro}</td>
                    <td className="py-2 text-right tabular-nums">{brl(l.receita)}</td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">{brl(l.pessoal)}</td>
                    <td className="text-muted-foreground hidden sm:table-cell py-2 text-right tabular-nums">{brl(l.operacao)}</td>
                    <td className="text-muted-foreground hidden sm:table-cell py-2 text-right tabular-nums">{brl(Math.round(l.rateio))}</td>
                    <td className={cn('py-2 text-right font-medium tabular-nums', l.resultado < 0 && 'text-destructive')}>{sinal(Math.round(l.resultado))}</td>
                    <td className={cn('py-2 text-right tabular-nums', l.resultado < 0 && 'text-destructive')}>{`${Math.round((l.resultado / l.receita) * 100)}%`.replace('-', '−')}</td>
                    <td className="text-muted-foreground hidden sm:table-cell py-2 text-right tabular-nums">{l.horas} h</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right tabular-nums">{brl(tot.receita)}</td>
                  <td className="py-2 text-right tabular-nums">{brl(tot.pessoal)}</td>
                  <td className="hidden sm:table-cell py-2 text-right tabular-nums">{brl(tot.operacao)}</td>
                  <td className="hidden sm:table-cell py-2 text-right tabular-nums">{brl(Math.round(tot.rateio))}</td>
                  <td className="py-2 text-right tabular-nums">{sinal(Math.round(tot.resultado))}</td>
                  <td className="py-2 text-right tabular-nums">{Math.round((tot.resultado / tot.receita) * 100)}%</td>
                  <td className="hidden sm:table-cell py-2 text-right tabular-nums">{tot.horas} h</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-xs">
            Pessoal de cada setor pelas horas medidas no Timesheet × custo de cada pessoa; o que não tem hora vai para o rateio pela receita. Atendimento é apoio: a receita própria (plantões avulsos) não cobre o custo, e o que falta é custo
            dos outros setores.
          </p>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <Pergunta
              acao={
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('orcamento')}>
                  <PencilSimpleIcon /> Orçamento
                </Button>
              }
            >
              Estamos dentro do orçamento?
            </Pergunta>
            <ul className="flex flex-col gap-3">
              {orcamento.map((o) => {
                const pct = Math.round(((o.realizado - o.orcado) / o.orcado) * 1000) / 10
                const ruim = o.nome === 'Receita' ? pct < 0 : pct > 0
                return (
                  <li key={o.nome} className="flex flex-col gap-1 text-sm">
                    <span className="flex items-baseline gap-2">
                      <span className="flex-1">{o.nome}</span>
                      <span className="tabular-nums">{brl(o.realizado)}</span>
                      <span className={cn('w-14 text-right text-xs tabular-nums', ruim ? 'text-destructive' : 'text-muted-foreground')}>
                        {pct > 0 ? '+' : pct < 0 ? '−' : ''}
                        {Math.abs(pct).toLocaleString('pt-BR')}%
                      </span>
                    </span>
                    <span className="bg-sunken relative h-2 overflow-hidden rounded-full">
                      <span className={cn('absolute inset-y-0 left-0 rounded-full', ruim ? 'bg-destructive/70' : 'bg-foreground/55')} style={{ width: `${Math.min(100, (o.realizado / Math.max(o.orcado, o.realizado)) * 100)}%` }} />
                      <span className="bg-foreground absolute inset-y-0 w-0.5" style={{ left: `${(o.orcado / Math.max(o.orcado, o.realizado)) * 100}%` }} title={`orçado: ${brl(o.orcado)}`} />
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="text-muted-foreground text-xs">Barra: realizado em outubro. Traço: orçado. Em vermelho, o que saiu pior que o previsto.</p>
          </Caixa>
          <Caixa>
            <Pergunta
              acao={
                <Button size="sm" className="rounded-full" onClick={() => setModal('distribuir')}>
                  <UsersThreeIcon /> Distribuir
                </Button>
              }
            >
              Quanto vai para os sócios?
            </Pergunta>
            <Numero valor={brl(resultadoMes)} rotulo="resultado de outubro" detalhe="antes da reserva e das antecipações" />
            <ul className="divide-border/70 flex flex-col divide-y text-sm">
              {socios.map((s) => (
                <li key={s.nome} className="flex items-center gap-3 py-2">
                  <span className="flex-1">
                    {s.nome} <span className="text-muted-foreground text-xs">· {s.participacao}%</span>
                  </span>
                  <span className="text-muted-foreground text-xs">pró-labore {brl(s.proLabore)}</span>
                  <span className="w-24 text-right tabular-nums">{brl(resultadoMes * 0.8 * (s.participacao / 100))}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">Antecipação de lucros com reserva de 20%. A memória vai para a escrituração e para o IRPF dos sócios.</p>
          </Caixa>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <Pergunta
              acao={
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('regras')}>
                  <PencilSimpleIcon /> Regras
                </Button>
              }
            >
              Comissões do mês
            </Pergunta>
            <ul className="flex flex-col gap-2.5 text-sm">
              {comissoes.map((c) => (
                <li key={c.pessoa} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block">{c.pessoa}</span>
                    <span className="text-muted-foreground block text-xs">
                      {c.base} · {c.regra}
                    </span>
                  </span>
                  <span className="tabular-nums">{brl(c.valor)}</span>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setAviso('Comissões de outubro enviadas para a folha do escritório (Bruno Costa) e para contas a pagar (Sindicato da Indústria).')}>
              Enviar para a folha e contas a pagar
            </Button>
          </Caixa>
          <Caixa>
            <Pergunta>Repassar custos aos clientes?</Pergunta>
            <ul className="flex flex-col gap-3 text-sm">
              {custos.map((c) => (
                <li key={c.cliente} className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      {c.cliente} <span className="tabular-nums">· {brl(c.valor)}</span>
                    </span>
                    <span className="text-muted-foreground block text-xs">{c.itens}</span>
                  </span>
                  <Segmentado
                    rotulo={`Custos de ${c.cliente}`}
                    valor={c.decisao}
                    onMudar={(v) => setCustos((xs) => xs.map((x) => (x.cliente === c.cliente ? { ...x, decisao: v } : x)))}
                    opcoes={[
                      { valor: 'absorver', rotulo: 'Absorver' },
                      { valor: 'repassar', rotulo: 'Repassar' },
                    ]}
                  />
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">Consultas pagas, mensagens e taxas medidas por cliente. Repassar vira extra na próxima fatura, se o contrato prevê.</p>
          </Caixa>
        </div>
      </div>

      {modal === 'orcamento' && (
        <EditarOrcamento
          linhas={orcamento}
          onFechar={() => setModal(null)}
          onSalvar={(l) => {
            setOrcamento(l)
            setModal(null)
          }}
        />
      )}
      {modal === 'distribuir' && (
        <Distribuir
          resultado={resultadoMes}
          onFechar={() => setModal(null)}
          onConfirmar={(t) => {
            setModal(null)
            setAviso(t)
          }}
        />
      )}
      {modal === 'regras' && <RegrasComissao onFechar={() => setModal(null)} />}
    </AreaRolagem>
  )
}

/** Orçamento anual (FIN-007): valores mensais por linha, com o reajuste salarial e as contratações. */
function EditarOrcamento({ linhas, onFechar, onSalvar }: { linhas: typeof orcamentoInicial; onFechar: () => void; onSalvar: (l: typeof orcamentoInicial) => void }) {
  const [d, setD] = useState(linhas.map((l) => ({ ...l, txt: String(l.orcado) })))
  const [ano, setAno] = useState('2026')
  const [reajuste, setReajuste] = useState('5')
  const [contratacoes, setContratacoes] = useState('1')
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Orçamento do escritório"
      descricao="Valor mensal de cada linha. O realizado vem da conciliação; a diferença aparece todo mês."
      acao="Salvar"
      onAcao={() => onSalvar(d.map(({ txt, ...l }) => ({ ...l, orcado: Number(txt.replace(/\D/g, '')) || 0 })))}
    >
      <Campo rotulo="Ano">
        {() => (
          <Segmentado
            rotulo="Ano"
            valor={ano}
            onMudar={setAno}
            opcoes={[
              { valor: '2026', rotulo: '2026' },
              { valor: '2027', rotulo: '2027 (rascunho)' },
            ]}
          />
        )}
      </Campo>
      {d.map((l, k) => (
        <Campo key={l.nome} rotulo={`${l.nome} por mês (R$)`}>
          {(id) => <CampoTexto id={id} valor={l.txt} onMudar={(v) => setD((xs) => xs.map((x, j) => (j === k ? { ...x, txt: v } : x)))} />}
        </Campo>
      ))}
      {ano === '2027' && (
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Reajuste salarial (%)">{(id) => <CampoTexto id={id} valor={reajuste} onMudar={setReajuste} />}</Campo>
          <Campo rotulo="Contratações previstas">{(id) => <CampoTexto id={id} valor={contratacoes} onMudar={setContratacoes} />}</Campo>
        </div>
      )}
    </GavetaFormulario>
  )
}

/** Distribuição de resultado aos sócios (FIN-012). */
function Distribuir({ resultado, onFechar, onConfirmar }: { resultado: number; onFechar: () => void; onConfirmar: (t: string) => void }) {
  const [reserva, setReserva] = useState(20)
  const [regra, setRegra] = useState<'participacao' | 'carteira'>('participacao')
  const distribuivel = resultado * (1 - reserva / 100)
  const parte = (s: (typeof socios)[number]) => (regra === 'participacao' ? s.participacao / 100 : s.nome.startsWith('Fernanda') ? 0.55 : 0.45)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Antecipar lucros de outubro"
      descricao="Gera os lançamentos, os recibos e a memória de cálculo. O pagamento sai no banco, como qualquer conta."
      acao="Gerar antecipação"
      onAcao={() => onConfirmar(`Antecipação de ${brl(distribuivel)} gerada; os pagamentos estão em contas a pagar, para aprovar.`)}
    >
      <Campo rotulo={`Reserva: ${reserva}%`} ajuda="Fica no caixa para 13º, férias e imprevistos.">
        {(id) => <input id={id} type="range" min={0} max={50} step={5} value={reserva} onChange={(e) => setReserva(Number(e.target.value))} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo="Regra">
        {() => (
          <Segmentado
            rotulo="Regra"
            valor={regra}
            onMudar={setRegra}
            opcoes={[
              { valor: 'participacao', rotulo: 'Participação no capital' },
              { valor: 'carteira', rotulo: 'Resultado da carteira' },
            ]}
          />
        )}
      </Campo>
      <ul className="bg-sunken/60 flex flex-col gap-1.5 rounded-[14px] p-3 text-sm">
        {socios.map((s) => (
          <li key={s.nome} className="flex justify-between gap-3">
            <span>{s.nome}</span>
            <span className="tabular-nums">{brl(distribuivel * parte(s))}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground text-xs">Regra por carteira só vale se estiver no contrato social; a apuração anual acerta a diferença.</p>
    </GavetaFormulario>
  )
}

/** Regras de comissão e PLR (FIN-008, GES-012). */
function RegrasComissao({ onFechar }: { onFechar: () => void }) {
  const [venda, setVenda] = useState('50% do 1º honorário recebido')
  const [indicacao, setIndicacao] = useState('5% ao mês por 12 meses')
  const [plr, setPlr] = useState(true)
  const [meta, setMeta] = useState('retenção ≥ 97% e captura do timesheet ≥ 90%')
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Comissões e PLR" descricao="Calculadas sobre o que foi recebido, não sobre o que foi vendido." acao="Salvar" onAcao={onFechar}>
      <Campo rotulo="Venda de cliente novo">
        {(id) => <CampoEscolha id={id} valor={venda} onMudar={setVenda} opcoes={['50% do 1º honorário recebido', '100% do 1º honorário recebido', '10% por 6 meses'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <Campo rotulo="Indicação de parceiro">
        {(id) => <CampoEscolha id={id} valor={indicacao} onMudar={setIndicacao} opcoes={['5% ao mês por 12 meses', '1 honorário único', 'desconto ao cliente indicador'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <Interruptor ligado={plr} onMudar={setPlr} rotulo="PLR semestral" detalhe="Pago na folha do escritório, com as metas medidas pela plataforma." />
      {plr && <Campo rotulo="Metas">{(id) => <CampoTexto id={id} valor={meta} onMudar={setMeta} />}</Campo>}
    </GavetaFormulario>
  )
}
