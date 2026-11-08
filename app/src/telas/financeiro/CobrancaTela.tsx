import { ArrowsLeftRightIcon, CalendarCheckIcon, CheckCircleIcon, HandshakeIcon, PencilSimpleIcon, PlusIcon, ReceiptIcon, WarningIcon } from '@phosphor-icons/react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import {
  faturasDoCenario,
  nfsePorServico,
  nfseEscritorio,
  politicaInadimplencia,
  provedorCobranca,
  recebimentosSoltos,
  reguaCobranca,
  resumoCobranca,
  rotuloFatura,
  rotuloForma,
  type Fatura,
  type PassoRegua,
  type SituacaoFatura,
} from '@/dados/financeiro'
import { cn } from '@/lib/utils'
import { Pergunta } from '../timesheet/graficos'
import { brl, CabecalhoFin, Caixa, Numero } from './comum'
import { EditarPassoRegua } from './configuracao'

const corSituacao: Record<SituacaoFatura, 'sucesso' | 'destaque' | 'erro' | 'outline'> = { paga: 'sucesso', a_vencer: 'outline', vencida: 'erro', em_acordo: 'destaque', cancelada: 'outline' }

/**
 * Financeiro › Cobrança (GES-001, 003 a 007, 009; FIN-009, 011, 016): o ciclo
 * mensal com NFS-e, as faturas, o que entrou sem cobrança, a inadimplência
 * com acordo e a régua. Gerar e cobrar são do integrante Financeiro com a
 * aprovação de uma pessoa; a baixa é automática pelo provedor.
 */
export function CobrancaTela({ faturaInicial }: { faturaInicial?: string } = {}) {
  const loja = useLoja()
  const faturasIniciais = faturasDoCenario(loja.estado.cenario)
  const [faturas, setFaturas] = usePersistente(`fin.faturas.${loja.estado.cenario}`, faturasIniciais)
  const [filtro, setFiltro] = useState<'todas' | 'abertas' | 'vencidas' | 'pagas' | 'problemas'>('todas')
  const [aberta, setAberta] = useState<Fatura | null>(() => faturasIniciais.find((f) => f.id === faturaInicial) ?? null)
  const [acordo, setAcordo] = useState<Fatura | null>(null)
  const [gerar, setGerar] = useState(false)
  const [gerado, setGerado] = useState(false)
  const [soltos, setSoltos] = usePersistente(`fin.soltos.${loja.estado.cenario}`, recebimentosSoltos)
  const [vincular, setVincular] = useState<(typeof recebimentosSoltos)[number] | null>(null)
  const [regua, setRegua] = usePersistente(`fin.regua.${loja.estado.cenario}`, reguaCobranca)
  const [passoEd, setPassoEd] = useState<PassoRegua | 'novo' | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const lista = faturas.filter((f) =>
    filtro === 'todas' ? true : filtro === 'abertas' ? f.situacao === 'a_vencer' : filtro === 'vencidas' ? f.situacao === 'vencida' || f.situacao === 'em_acordo' : filtro === 'pagas' ? f.situacao === 'paga' : f.nfse === 'erro',
  )
  const inadimplentes = faturas.filter((f) => f.situacao === 'vencida' || f.situacao === 'em_acordo')
  // No escritório só de BPO, o resumo sai das faturas do pacote (a carteira contábil não existe).
  const soma = (xs: Fatura[]) => ({ n: xs.length, valor: xs.reduce((t, f) => t + f.valor, 0) })
  const r =
    loja.estado.cenario === 'bpo_puro'
      ? {
          ...resumoCobranca,
          emitidas: soma(faturasIniciais),
          recebidas: soma(faturasIniciais.filter((f) => f.situacao === 'paga')),
          aVencer: soma(faturasIniciais.filter((f) => f.situacao === 'a_vencer')),
          vencidas: soma(faturasIniciais.filter((f) => f.situacao === 'vencida')),
          proximoCiclo: { ...resumoCobranca.proximoCiclo, clientes: faturasIniciais.length, valor: faturasIniciais.reduce((t, f) => t + f.valor, 0) + 100, extras: 1, decimo: 0 },
        }
      : resumoCobranca
  const atualizar = (f: Fatura) => {
    setFaturas((xs) => xs.map((x) => (x.id === f.id ? f : x)))
    setAberta(null)
  }

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin
          titulo="Cobrança"
          status="Loja Bela Vista com a fatura de novembro vencida; o D+3 cordial sai amanhã"
          sub={`${r.competencia[0].toUpperCase()}${r.competencia.slice(1)} · cobranças do dia 1 com NFS-e · baixa automática pelo ${provedorCobranca.nome.split(' (')[0]}`}
        />

        {aviso && <p className="bg-success/10 rounded-[14px] px-3 py-2 text-sm">{aviso}</p>}

        <Caixa className="ring-foreground/10 ring-1">
          <div className="flex flex-wrap items-center gap-3">
            <CalendarCheckIcon className="size-6 shrink-0" />
            <span className="min-w-0 flex-1 basis-60">
              <span className="block font-medium">{gerado ? `Cobranças de dezembro aprovadas: saem em ${r.proximoCiclo.data} às 06:00` : `Cobranças de dezembro: ${r.proximoCiclo.clientes} clientes, ${brl(r.proximoCiclo.valor)}`}</span>
              <span className="text-muted-foreground block text-sm">
                {r.proximoCiclo.extras} extras e reembolsos · 13º honorário em {r.proximoCiclo.decimo} contratos (cobrado à parte, vence 20/12) · NFS-e junto
              </span>
            </span>
            {!gerado && (
              <Button className="rounded-full" onClick={() => setGerar(true)}>
                Revisar e aprovar
              </Button>
            )}
          </div>
        </Caixa>

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Numero valor={brl(r.emitidas.valor)} rotulo={`emitidas em novembro (${r.emitidas.n})`} />
            <Numero valor={brl(r.recebidas.valor)} rotulo={`recebidas (${r.recebidas.n})`} />
            <Numero valor={brl(r.aVencer.valor)} rotulo={`a vencer (${r.aVencer.n})`} />
            <Numero valor={brl(r.vencidas.valor)} rotulo={`vencidas (${r.vencidas.n})`} />
            <Numero valor={`${r.inadimplencia90.toLocaleString('pt-BR')}%`} rotulo="inadimplência acima de 90 dias" detalhe="da receita dos últimos 12 meses" />
          </div>
        </Caixa>

        <Caixa>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex-1 text-sm font-medium">Faturas</h2>
            <Segmentado
              rotulo="Filtro de faturas"
              valor={filtro}
              onMudar={setFiltro}
              opcoes={[
                { valor: 'todas', rotulo: 'Todas' },
                { valor: 'abertas', rotulo: 'A vencer' },
                { valor: 'vencidas', rotulo: 'Vencidas' },
                { valor: 'pagas', rotulo: 'Pagas' },
                { valor: 'problemas', rotulo: 'Com erro' },
              ]}
            />
          </div>
          <ul className="divide-border/70 flex flex-col divide-y">
            {lista.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setAberta(f)}
                  className="hover:bg-sunken/60 -mx-2 grid w-[calc(100%+1rem)] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-[12px] px-2 py-2.5 text-left text-sm md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_8rem_7rem]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{f.cliente}</span>
                    <span className="text-muted-foreground block text-xs">
                      {f.competencia} · vence {f.vencimento} · {rotuloForma[f.forma]}
                      {f.linhas && ` · ${f.linhas.length} serviços, ${f.notas?.length ?? 1} NFS-e`}
                    </span>
                  </span>
                  <span className="text-muted-foreground col-span-2 row-start-2 truncate text-xs md:col-span-1 md:col-start-2 md:row-start-1">
                    {f.nfse === 'erro' ? (
                      <span className="text-destructive flex items-center gap-1">
                        <WarningIcon className="size-3.5" weight="fill" /> NFS-e recusada
                      </span>
                    ) : (
                      (f.etapaRegua ?? (f.pagaEm ? `paga em ${f.pagaEm}` : `NFS-e ${f.nfse}`))
                    )}
                  </span>
                  <span className="text-right tabular-nums md:col-start-3">{brl(f.valor, true)}</span>
                  <span className="hidden justify-end md:flex">
                    <Badge variant={corSituacao[f.situacao]}>
                      {rotuloFatura[f.situacao]}
                      {f.diasAtraso && f.situacao === 'vencida' ? ` · ${f.diasAtraso} d` : ''}
                    </Badge>
                  </span>
                </button>
              </li>
            ))}
            {lista.length === 0 && <li className="text-muted-foreground py-6 text-center text-sm">Nada aqui.</li>}
          </ul>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <Pergunta>Quem está devendo?</Pergunta>
            <ul className="flex flex-col gap-3">
              {inadimplentes.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{f.cliente}</span>
                    <span className="text-muted-foreground block text-xs">
                      {brl(f.valor, true)} · {f.diasAtraso} dias · {f.etapaRegua}
                    </span>
                  </span>
                  {f.situacao === 'vencida' && (
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setAcordo(f)}>
                      <HandshakeIcon /> Propor acordo
                    </Button>
                  )}
                </li>
              ))}
              <li className="text-muted-foreground text-xs">e mais 5 clientes com até 15 dias, só na régua.</li>
            </ul>
            <p className="text-muted-foreground border-t pt-2 text-xs">
              Política: extras e pedidos novos pausam após {politicaInadimplencia.pausarExtrasApos} dias; suspensão escalonada após {politicaInadimplencia.suspenderApos}. Documentos e obrigações em curso nunca são retidos.
            </p>
          </Caixa>
          <Caixa>
            <Pergunta>O que entrou sem cobrança?</Pergunta>
            {soltos.length === 0 ? (
              <p className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
                <CheckCircleIcon className="text-success size-4" weight="fill" /> Tudo conciliado.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {soltos.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block">
                        <span className="font-medium tabular-nums">{brl(s.valor, true)}</span> · {s.meio} de {s.pagador}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {s.data} · sugestão: {s.sugestao}
                      </span>
                    </span>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setVincular(s)}>
                      <ArrowsLeftRightIcon /> Vincular
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-muted-foreground border-t pt-2 text-xs">Boleto e Pix dão baixa sozinhos. Aqui fica o que chegou por TED, depósito ou valor diferente.</p>
          </Caixa>
        </div>

        <Caixa>
          <Pergunta
            acao={
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => setPassoEd('novo')}>
                <PlusIcon /> Passo
              </Button>
            }
          >
            Como a régua cobra?
          </Pergunta>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[...regua]
              .sort((a, b) => a.dias - b.dias)
              .map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPassoEd(p)}
                    className={cn('bg-raised shadow-cartao hover:ring-foreground/20 flex h-full w-full cursor-pointer flex-col gap-1 rounded-[16px] p-3 text-left text-sm hover:ring-1', !p.ativo && 'opacity-55')}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      {p.quando}
                      <PencilSimpleIcon className="text-muted-foreground ml-auto size-3.5" />
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {p.canal} · tom {p.tom}
                      {!p.ativo && ' · desligado'}
                    </span>
                    <span className="line-clamp-3 text-xs">{p.texto}</span>
                  </button>
                </li>
              ))}
          </ol>
          <p className="text-muted-foreground text-xs">
            Hoje a régua manda 9 mensagens. Quem está em acordo ou contestou sai da régua. Recebendo por {provedorCobranca.nome} · {provedorCobranca.autorizacoesPix} autorizações de Pix Automático · NFS-e pelo{' '}
            {nfseEscritorio.emissor.split(' (')[0]}.
          </p>
        </Caixa>
      </div>

      {gerar && (
        <GerarCobrancas
          onFechar={() => setGerar(false)}
          onAprovar={() => {
            setGerar(false)
            setGerado(true)
          }}
        />
      )}
      {aberta && (
        <DetalheFatura
          f={aberta}
          onFechar={() => setAberta(null)}
          onAtualizar={atualizar}
          onAcordo={() => {
            setAcordo(aberta)
            setAberta(null)
          }}
        />
      )}
      {acordo && (
        <PropostaAcordo
          f={acordo}
          onFechar={() => setAcordo(null)}
          onEnviar={(texto) => {
            setFaturas((xs) => xs.map((x) => (x.id === acordo.id ? { ...x, situacao: 'em_acordo', etapaRegua: texto } : x)))
            setAcordo(null)
            setAviso(`Proposta de acordo enviada a ${acordo.cliente}. A régua pausa até a resposta.`)
          }}
        />
      )}
      {vincular && (
        <Vincular
          r={vincular}
          faturas={faturas.filter((f) => f.situacao !== 'paga')}
          onFechar={() => setVincular(null)}
          onVincular={() => {
            setSoltos((xs) => xs.filter((x) => x.id !== vincular.id))
            setVincular(null)
          }}
        />
      )}
      {passoEd && (
        <EditarPassoRegua
          p={passoEd === 'novo' ? undefined : passoEd}
          onFechar={() => setPassoEd(null)}
          onSalvar={(p) => {
            setRegua((xs) => (xs.some((x) => x.id === p.id) ? xs.map((x) => (x.id === p.id ? p : x)) : [...xs, p]))
            setPassoEd(null)
          }}
          onExcluir={
            passoEd === 'novo'
              ? undefined
              : () => {
                  setRegua((xs) => xs.filter((x) => x.id !== passoEd.id))
                  setPassoEd(null)
                }
          }
        />
      )}
    </AreaRolagem>
  )
}

/** Revisar o ciclo antes de gerar (GES-001, GES-009, FIN-016): o que mudou desde o mês passado. */
function GerarCobrancas({ onFechar, onAprovar }: { onFechar: () => void; onAprovar: () => void }) {
  const [auto, setAuto] = useState(true)
  const [decimo, setDecimo] = useState(true)
  const mudancas = [
    { texto: 'Clínica Sorriso Ltda: 1ª cobrança cheia (entrou em outubro, proporcional)', valor: '+ R$ 1.950,00' },
    { texto: 'Metalúrgica Andrade Ltda: alteração contratual e reembolso da Junta', valor: '+ R$ 1.748,30' },
    { texto: 'Loja Bela Vista Eireli: 48 notas acima da faixa', valor: '+ R$ 336,00' },
    { texto: 'Padaria Pão Quente ME: 2ª parcela do acordo junto', valor: '+ R$ 475,00' },
    { texto: 'Carlos Menezes: sem contrato estruturado, fica fora', valor: '—' },
  ]
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Cobranças de dezembro"
      descricao="O integrante Financeiro montou o ciclo a partir dos contratos vigentes. Gerar e enviar é com a sua aprovação."
      acao="Aprovar ciclo"
      onAcao={onAprovar}
    >
      <dl className="bg-sunken/60 grid grid-cols-2 gap-3 rounded-[14px] p-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground text-xs">Cobranças</dt>
          <dd className="tabular-nums">142</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Total</dt>
          <dd className="tabular-nums">R$ 203.120</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Notas fiscais</dt>
          <dd className="tabular-nums">142</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Custo do provedor</dt>
          <dd className="tabular-nums">R$ 192,40</dd>
        </div>
      </dl>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">O que mudou desde novembro</h3>
        <ul className="divide-border/70 flex flex-col divide-y text-sm">
          {mudancas.map((m) => (
            <li key={m.texto} className="flex items-start gap-3 py-2">
              <span className="min-w-0 flex-1">{m.texto}</span>
              <span className="tabular-nums">{m.valor}</span>
            </li>
          ))}
        </ul>
      </section>
      <Interruptor ligado={decimo} onMudar={setDecimo} rotulo="Gerar o 13º honorário (61 contratos)" detalhe="Cobrança separada, vencimento 20/12; proporcional para quem entrou no ano." />
      <Interruptor ligado={auto} onMudar={setAuto} rotulo="Nos próximos meses, gerar sozinho quando nada mudar" detalhe="Se aparecer contrato novo, extra ou reajuste, volta a pedir revisão." />
    </GavetaFormulario>
  )
}

/** Detalhe da fatura: histórico, 2ª via, registrar pagamento, cancelar ou corrigir (FIN-010, FIN-011). */
function DetalheFatura({ f, onFechar, onAtualizar, onAcordo }: { f: Fatura; onFechar: () => void; onAtualizar: (f: Fatura) => void; onAcordo: () => void }) {
  const [modo, setModo] = useState<'ver' | 'pagamento' | 'corrigir'>(f.nfse === 'erro' ? 'corrigir' : 'ver')
  const [dataPg, setDataPg] = useState('18/11')
  const [meio, setMeio] = useState('TED')
  const [motivo, setMotivo] = useState(f.nfse === 'erro' ? 'Incluir o código do serviço do tomador (ISS retido)' : '')
  const [oQue, setOQue] = useState<'nota' | 'valor' | 'cancelar'>(f.nfse === 'erro' ? 'nota' : 'valor')
  const [segundaVia, setSegundaVia] = useState(false)
  const atualizado = f.valor * (1 + 0.02 + 0.01 * ((f.diasAtraso ?? 0) / 30))
  const acao = modo === 'pagamento' ? 'Registrar pagamento' : modo === 'corrigir' ? (oQue === 'cancelar' ? 'Cancelar fatura e nota' : 'Corrigir e reemitir') : 'Fechar'
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={`${f.cliente} · ${f.competencia}`}
      descricao={`${brl(f.valor, true)} · vence ${f.vencimento} · ${rotuloForma[f.forma]} · ${rotuloFatura[f.situacao]}`}
      acao={acao}
      acaoDesabilitada={modo === 'corrigir' && !motivo.trim()}
      onAcao={() => {
        if (modo === 'ver') return onFechar()
        if (modo === 'pagamento') return onAtualizar({ ...f, situacao: 'paga', pagaEm: dataPg, etapaRegua: undefined, historico: [...f.historico, { quando: dataPg, texto: `Pagamento registrado à mão (${meio})` }] })
        if (oQue === 'cancelar') return onAtualizar({ ...f, situacao: 'cancelada', nfse: 'cancelada', historico: [...f.historico, { quando: '18/11', texto: `Cancelada: ${motivo}` }] })
        onAtualizar({ ...f, nfse: 'emitida', historico: [...f.historico, { quando: '18/11', texto: `Corrigida e reemitida: ${motivo}` }] })
      }}
      secundaria={
        modo !== 'ver' ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setModo('ver')}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      {modo === 'ver' && (
        <>
          {f.linhas && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Uma cobrança, um serviço por linha</h3>
              <ul className="divide-border/70 flex flex-col divide-y text-sm">
                {f.linhas.map((l) => (
                  <li key={l.servico} className="flex gap-2 py-1.5">
                    <span className="min-w-0 flex-1">
                      {l.servico}
                      <span className="text-muted-foreground block text-xs">código de serviço {l.codigo}</span>
                    </span>
                    <span className="tabular-nums">{brl(l.valor, true)}</span>
                  </li>
                ))}
                <li className="flex gap-2 py-1.5 font-medium">
                  <span className="flex-1">Total da cobrança ({rotuloForma[f.forma]})</span>
                  <span className="tabular-nums">{brl(f.valor, true)}</span>
                </li>
              </ul>
              <h3 className="text-sm font-medium">Notas fiscais por serviço</h3>
              <ul className="flex flex-col gap-1.5 text-sm">
                {f.notas?.map((n) => (
                  <li key={n.numero} className="bg-sunken/50 flex gap-2 rounded-[12px] px-3 py-2">
                    <span className="min-w-0 flex-1">
                      NFS-e {n.numero} · {n.servicos.join(' e ')}
                      <span className="text-muted-foreground block text-xs">
                        código {n.codigo} · ISS {n.iss}
                      </span>
                    </span>
                    <span className="tabular-nums">{brl(n.valor, true)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-xs">
                Cada serviço segue a própria tributação. {nfsePorServico.variosItensNaMesmaNota ? 'Uma NFS-e com um item por serviço' : 'Uma NFS-e por serviço'}: regra do {nfsePorServico.regra}.
              </p>
            </section>
          )}
          <ol className="relative flex flex-col gap-3 border-l pl-4">
            {f.historico.map((h, i) => (
              <li key={i} className="text-sm">
                <span className="bg-foreground absolute -left-[4.5px] mt-1.5 size-2 rounded-full" />
                <span className="text-muted-foreground block text-xs">{h.quando}</span>
                {h.texto}
              </li>
            ))}
          </ol>
          {f.etapaRegua && <p className="bg-sunken/60 rounded-[14px] px-3 py-2 text-sm">Régua: {f.etapaRegua}</p>}
          {segundaVia && <p className="bg-success/10 rounded-[14px] px-3 py-2.5 text-sm">2ª via gerada: {brl(atualizado, true)} (com multa de 2% e juros), vence em 3 dias. Enviada pelo WhatsApp ao contato de honorários.</p>}
          {f.situacao !== 'paga' && f.situacao !== 'cancelada' && (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setSegundaVia(true)}>
                <ReceiptIcon /> 2ª via atualizada
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setModo('pagamento')}>
                Registrar pagamento
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setModo('corrigir')}>
                Cancelar ou corrigir
              </Button>
              {f.situacao === 'vencida' && (
                <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={onAcordo}>
                  <HandshakeIcon /> Propor acordo
                </Button>
              )}
            </div>
          )}
        </>
      )}
      {modo === 'pagamento' && (
        <>
          <p className="text-muted-foreground text-sm">Para o que entrou fora do provedor (TED, depósito, dinheiro). Boleto e Pix dão baixa sozinhos.</p>
          <Campo rotulo="Data do pagamento">{(id) => <CampoTexto id={id} valor={dataPg} onMudar={setDataPg} />}</Campo>
          <Campo rotulo="Meio">{(id) => <CampoEscolha id={id} valor={meio} onMudar={setMeio} opcoes={['TED', 'Depósito', 'Dinheiro', 'Pix fora do provedor'].map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
        </>
      )}
      {modo === 'corrigir' && (
        <>
          {f.nfse === 'erro' && (
            <p className="bg-destructive/8 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
              <WarningIcon className="text-destructive mt-0.5 size-4 shrink-0" weight="fill" /> {f.historico[f.historico.length - 1].texto}
            </p>
          )}
          <Campo rotulo="O que fazer">
            {() => (
              <Segmentado
                rotulo="O que fazer"
                valor={oQue}
                onMudar={setOQue}
                opcoes={[
                  { valor: 'nota', rotulo: 'Corrigir a nota' },
                  { valor: 'valor', rotulo: 'Corrigir o valor' },
                  { valor: 'cancelar', rotulo: 'Cancelar' },
                ]}
              />
            )}
          </Campo>
          <Campo rotulo="Motivo" ajuda="Vai para o evento e, no cancelamento, para a prefeitura.">
            {(id) => <CampoArea id={id} linhas={3} valor={motivo} onMudar={setMotivo} />}
          </Campo>
          <p className="text-muted-foreground text-xs">Corrigir cancela a nota e a cobrança anteriores e emite novas no mesmo número de fatura; o cliente recebe as duas com a explicação.</p>
        </>
      )}
    </GavetaFormulario>
  )
}

/** Proposta de acordo (GES-005) dentro da política; fora dela, pede a alçada. */
function PropostaAcordo({ f, onFechar, onEnviar }: { f: Fatura; onFechar: () => void; onEnviar: (resumo: string) => void }) {
  const [parcelas, setParcelas] = useState(2)
  const [desconto, setDesconto] = useState(0)
  const [entrada, setEntrada] = useState(true)
  const [assinatura, setAssinatura] = useState(true)
  const total = f.valor * (1 - desconto / 100)
  const parcela = total / parcelas
  const foraPolitica = desconto > politicaInadimplencia.descontoMaxAcordo || parcelas > politicaInadimplencia.parcelasMax
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Acordo com ${f.cliente}`}
      descricao={`${brl(f.valor, true)} em aberto há ${f.diasAtraso} dias. A proposta vai pelo WhatsApp com o link para aceitar.`}
      acao={foraPolitica ? 'Pedir aprovação' : 'Enviar proposta'}
      onAcao={() => onEnviar(`acordo proposto: ${parcelas}× ${brl(parcela, true)}`)}
    >
      <Campo rotulo={`Parcelas: ${parcelas}`}>{(id) => <input id={id} type="range" min={1} max={12} value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className="accent-foreground w-full" />}</Campo>
      <Campo rotulo={`Desconto: ${desconto}%`} erro={desconto > politicaInadimplencia.descontoMaxAcordo ? `Acima de ${politicaInadimplencia.descontoMaxAcordo}%: vai para ${politicaInadimplencia.alcadaAcordo}.` : undefined}>
        {(id) => <input id={id} type="range" min={0} max={30} value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} className="accent-foreground w-full" />}
      </Campo>
      <Interruptor ligado={entrada} onMudar={setEntrada} rotulo="1ª parcela como entrada, em 3 dias" />
      <Interruptor ligado={assinatura} onMudar={setAssinatura} rotulo="Formalizar com assinatura eletrônica" detalhe="Termo de confissão de dívida com as parcelas." />
      <p className="bg-sunken/60 rounded-[14px] px-3 py-2.5 text-sm">
        {parcelas}× de <strong className="font-medium tabular-nums">{brl(parcela, true)}</strong>
        {desconto > 0 && ` (total ${brl(total, true)})`}. Parcela atrasada desfaz o acordo e volta para a régua.
      </p>
    </GavetaFormulario>
  )
}

/** Vincular um recebimento solto a uma fatura (GES-003). */
function Vincular({ r, faturas, onFechar, onVincular }: { r: (typeof recebimentosSoltos)[number]; faturas: Fatura[]; onFechar: () => void; onVincular: () => void }) {
  const [destino, setDestino] = useState(faturas.find((f) => r.sugestao.startsWith(f.cliente))?.id ?? 'outro')
  const [categoria, setCategoria] = useState('Receita não identificada')
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Vincular recebimento" descricao={`${brl(r.valor, true)} · ${r.meio} de ${r.pagador} em ${r.data}`} acao="Vincular" onAcao={onVincular}>
      <Campo rotulo="É o pagamento de">
        {(id) => (
          <CampoEscolha id={id} valor={destino} onMudar={setDestino} opcoes={[...faturas.map((f) => ({ valor: f.id, rotulo: `${f.cliente} · ${f.competencia} · ${brl(f.valor, true)}` })), { valor: 'outro', rotulo: 'Não é honorário' }]} />
        )}
      </Campo>
      {destino === 'outro' ? (
        <Campo rotulo="Categoria">
          {(id) => <CampoEscolha id={id} valor={categoria} onMudar={setCategoria} opcoes={['Receita não identificada', 'Serviços avulsos', 'Reembolsos de clientes', 'Devolver ao pagador'].map((x) => ({ valor: x, rotulo: x }))} />}
        </Campo>
      ) : (
        <p className="text-muted-foreground text-sm">Se o valor for maior que a fatura, a diferença fica como crédito do cliente e abate a próxima.</p>
      )}
    </GavetaFormulario>
  )
}
