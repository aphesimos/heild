import { ArrowFatLinesUpIcon, FileArrowUpIcon, MagnifyingGlassIcon, PlusIcon, ReceiptIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Interruptor, Passos, Segmentado } from '@/components/ui/formulario'
import {
  contratosDoCenario,
  extras as extrasIniciais,
  receitaPorRegime,
  receitaPorSetor,
  restoCarteira,
  rotuloExtra,
  rotuloForma,
  totalContrato,
  type Contrato,
  type Extra,
  type FormaPagamento,
  type Indice,
  type ItemContrato,
} from '@/dados/financeiro'
import { clientes } from '@/dados/exemplo'
import { cn } from '@/lib/utils'
import { Pergunta } from '../timesheet/graficos'
import { brl, CabecalhoFin, Caixa, Numero } from './comum'

const rotuloSituacao: Record<Contrato['situacao'], { texto: string; variant: 'sucesso' | 'destaque' | 'erro' | 'outline' }> = {
  vigente: { texto: 'vigente', variant: 'sucesso' },
  acima_da_faixa: { texto: 'acima da faixa', variant: 'destaque' },
  reajuste_agendado: { texto: 'reajuste em jan', variant: 'outline' },
  sem_contrato: { texto: 'sem contrato', variant: 'erro' },
  em_acordo: { texto: 'em acordo', variant: 'destaque' },
}

/** Barras de valor em reais (uma série, os maiores primeiro). */
export function BarrasReais({ dados }: { dados: { nome: string; h: number }[] }) {
  const max = Math.max(...dados.map((d) => d.h))
  const total = dados.reduce((s, d) => s + d.h, 0)
  return (
    <ul className="flex flex-col gap-2">
      {dados.map((d) => (
        <li key={d.nome} className="grid grid-cols-[minmax(0,9rem)_1fr_minmax(0,7.5rem)] items-center gap-3 text-sm">
          <span className="truncate">{d.nome}</span>
          <span className="h-3 rounded-r-[4px]" style={{ width: `${(d.h / max) * 100}%`, background: 'color-mix(in oklab, var(--foreground) 55%, transparent)' }} title={`${d.nome}: ${brl(d.h)}`} />
          <span className="text-right tabular-nums">
            {brl(d.h)} <span className="text-muted-foreground text-xs">{Math.round((d.h / total) * 100)}%</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Financeiro › Contratos (FIN-001, 002, 016; GES-002, 008, 012, 014, 015):
 * cada contrato como assinatura estruturada e versionada, a receita
 * contratada, quem passou da faixa, os extras e reembolsos a faturar e a
 * campanha anual de reajuste.
 */
export function ContratosTela({ somenteLeitura = false }: { somenteLeitura?: boolean } = {}) {
  const loja = useLoja()
  const [contratos, setContratos] = usePersistente(`fin.contratos.${loja.estado.cenario}`, () => contratosDoCenario(loja.estado.cenario))
  // No só BPO, os extras são os do pacote: o excedente de lançamentos da Loja Bela Vista.
  const [extras, setExtras] = usePersistente(`fin.extras.${loja.estado.cenario}`, () =>
    loja.estado.cenario === 'bpo_puro'
      ? [{ id: 'eb1', cliente: 'Loja Bela Vista Eireli', tipo: 'acima_da_faixa' as const, descricao: '40 lançamentos acima da faixa do BPO em novembro', valor: 100, data: '18/11', origem: 'contagem automática (BPO › Volume)' }]
      : extrasIniciais,
  )
  const [filtro, setFiltro] = useState<'todos' | 'atencao' | 'sem'>('todos')
  const [busca, setBusca] = useState('')
  const [ed, setEd] = useState<Contrato | 'novo' | null>(null)
  const [modal, setModal] = useState<'extra' | 'reajuste' | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  // No escritório só de BPO, a carteira são só as empresas do BPO (sem o resto da carteira contábil).
  const soBpo = loja.estado.cenario === 'bpo_puro'
  const resto = soBpo ? { clientes: 0, receita: 0, semContrato: 0 } : restoCarteira
  const somaVisiveis = contratos.reduce((s, c) => s + totalContrato(c), 0)
  const receita = somaVisiveis + resto.receita
  const semContrato = contratos.filter((c) => c.situacao === 'sem_contrato').length + resto.semContrato
  const porSetor = soBpo ? [{ nome: 'BPO financeiro', h: somaVisiveis }] : receitaPorSetor
  const porRegime = soBpo ? [...new Set(contratos.map((c) => c.regime))].map((r) => ({ nome: r, h: contratos.filter((c) => c.regime === r).reduce((s, c) => s + totalContrato(c), 0) })).sort((a, b) => b.h - a.h) : receitaPorRegime
  const acima = contratos.filter((c) => c.alerta)
  const lista = contratos
    .filter((c) => (filtro === 'todos' ? true : filtro === 'sem' ? c.situacao === 'sem_contrato' : c.situacao !== 'vigente' && c.situacao !== 'sem_contrato'))
    .filter((c) => !busca || c.cliente.toLowerCase().includes(busca.toLowerCase()))

  const salvar = (c: Contrato) => {
    // Um contrato por cliente: criar para quem já tem (ou está "sem contrato") substitui a linha.
    setContratos((xs) => {
      const existente = xs.find((x) => x.id === c.id || x.cliente === c.cliente)
      return existente ? xs.map((x) => (x === existente ? { ...c, id: existente.id } : x)) : [...xs, c]
    })
    setEd(null)
    setAviso(`${c.cliente}: versão ${c.versao} do contrato vale a partir de ${c.vigenteDesde}. O faturamento de 01/12 já usa.`)
  }

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin
          titulo="Contratos"
          status={soBpo ? 'A Loja Bela Vista passou da faixa de lançamentos do BPO; o extra entra na cobrança de dezembro' : '2 clientes passaram da faixa de notas; o extra entra na cobrança de dezembro'}
          sub={`Honorários de ${contratos.length + resto.clientes} clientes · cada mudança vira uma versão nova, a partir de uma competência`}
        >
          {somenteLeitura ? (
            <Badge variant="outline">somente leitura · liberado pelo Administrador</Badge>
          ) : (
            <Button size="sm" className="rounded-full" onClick={() => setEd('novo')}>
              <PlusIcon /> Novo contrato
            </Button>
          )}
        </CabecalhoFin>

        {aviso && <p className="bg-success/10 rounded-[14px] px-3 py-2 text-sm">{aviso}</p>}

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Numero valor={brl(receita)} rotulo="receita contratada por mês" detalhe="+2,1% sobre outubro" />
            <Numero valor={`${contratos.length + resto.clientes - semContrato}`} rotulo="clientes com contrato estruturado" detalhe={`${semContrato} sem contrato: honorário não informado`} />
            <Numero valor={acima.length} rotulo="passaram da faixa contratada" detalhe="notas, funcionários ou filiais acima do contrato" />
            {soBpo ? (
              <Numero valor={contratos.filter((c) => c.dataBase === 'setembro').length} rotulo="reajustes na data-base de setembro" detalhe="IPCA; os contratos do BPO fazem um ano em 09/2027" />
            ) : (
              <Numero valor="24" rotulo="reajustes na data-base de janeiro" detalhe="INPC acumulado: 4,3%" />
            )}
          </div>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Caixa>
            <Pergunta>De onde vem a receita?</Pergunta>
            <h3 className="text-muted-foreground text-xs">Por setor</h3>
            <BarrasReais dados={porSetor} />
            <h3 className="text-muted-foreground mt-1 text-xs">Por regime do cliente</h3>
            <BarrasReais dados={porRegime} />
            <p className="text-muted-foreground text-xs">Pelos itens dos contratos vigentes em novembro; serviços avulsos ficam fora.</p>
          </Caixa>
          <div className="flex flex-col gap-4">
            <Caixa>
              <Pergunta>Quem passou da faixa?</Pergunta>
              <ul className="flex flex-col gap-3">
                {acima.map((c) => (
                  <li key={c.id} className="flex flex-col gap-1.5 text-sm">
                    <span className="flex items-start gap-2">
                      <WarningIcon className="text-warning mt-0.5 size-4 shrink-0" weight="fill" />
                      <span className="min-w-0">
                        <span className="block font-medium">{c.cliente}</span>
                        <span className="text-muted-foreground block text-xs">{c.alerta}</span>
                      </span>
                    </span>
                    <span className={cn('flex flex-wrap gap-1.5 pl-6', somenteLeitura && 'hidden')}>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEd(c)}>
                        Propor aditivo
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('extra')}>
                        Cobrar como extra
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa className="flex-1">
              <Pergunta
                acao={
                  <Button size="sm" className={cn('rounded-full', somenteLeitura && 'hidden')} onClick={() => setModal('reajuste')}>
                    <ArrowFatLinesUpIcon /> Campanha
                  </Button>
                }
              >
                {soBpo ? 'Reajuste de setembro' : 'Reajuste de janeiro'}
              </Pergunta>
              <p className="text-muted-foreground text-sm">
                {soBpo
                  ? `${contratos.length} contratos do BPO com data-base em setembro (IPCA). O primeiro reajuste é em 09/2027; a carta sai com 30 dias de antecedência.`
                  : '24 contratos com data-base em janeiro; INPC acumulado de 4,3%. A carta sai com 30 dias de antecedência: até 01/12.'}
              </p>
              <ul className="grid flex-1 grid-cols-3 gap-2">
                {(soBpo
                  ? [
                      { n: contratos.length - 2, rotulo: 'índice cheio' },
                      { n: 1, rotulo: 'acima do índice (dão prejuízo)' },
                      { n: 1, rotulo: 'renegociar escopo' },
                    ]
                  : [
                      { n: 19, rotulo: 'índice cheio' },
                      { n: 3, rotulo: 'acima do índice (dão prejuízo)' },
                      { n: 2, rotulo: 'renegociar escopo' },
                    ]
                ).map((g) => (
                  <li key={g.rotulo} className="bg-sunken/60 flex flex-col justify-center rounded-[14px] px-3 py-2">
                    <span className="font-heading text-2xl font-light tabular-nums">{g.n}</span>
                    <span className="text-muted-foreground text-xs">{g.rotulo}</span>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
        </div>

        <Caixa>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex-1 text-sm font-medium">Contratos</h2>
            <span className="relative">
              <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input aria-label="Buscar cliente" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar cliente" className="bg-sunken/60 h-8 w-44 rounded-full pr-3 pl-8 text-sm outline-none" />
            </span>
            <Segmentado
              rotulo="Filtro"
              valor={filtro}
              onMudar={setFiltro}
              opcoes={[
                { valor: 'todos', rotulo: 'Todos' },
                { valor: 'atencao', rotulo: 'Pedem atenção' },
                { valor: 'sem', rotulo: 'Sem contrato' },
              ]}
            />
          </div>
          <ul className="divide-border/70 flex flex-col divide-y">
            {lista.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setEd(c)}
                  className="hover:bg-sunken/60 -mx-2 grid w-[calc(100%+1rem)] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-[12px] px-2 py-2.5 text-left text-sm md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_10rem_7.5rem]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{c.cliente}</span>
                    <span className="text-muted-foreground block text-xs">
                      {c.regime}
                      {c.versao > 0 && ` · v${c.versao} desde ${c.vigenteDesde}`}
                    </span>
                  </span>
                  <span className="text-muted-foreground col-span-2 row-start-2 truncate text-xs md:col-span-1 md:col-start-2 md:row-start-1">{c.itens.length ? c.itens.map((i) => i.descricao).join(' · ') : 'honorário não informado'}</span>
                  <span className="text-right md:col-start-3">
                    <span className="block tabular-nums">{c.itens.length ? brl(totalContrato(c)) : '—'}</span>
                    <span className="text-muted-foreground block text-xs">{c.itens.length ? `dia ${c.vencimentoDia} · ${rotuloForma[c.forma]}` : ''}</span>
                  </span>
                  <span className="hidden justify-end md:flex">
                    <Badge variant={rotuloSituacao[c.situacao].variant}>{rotuloSituacao[c.situacao].texto}</Badge>
                  </span>
                </button>
              </li>
            ))}
            <li className="text-muted-foreground py-2.5 text-xs">e mais {restoCarteira.clientes} contratos vigentes…</li>
          </ul>
        </Caixa>

        <Caixa>
          <Pergunta
            acao={
              <Button size="sm" variant="outline" className={cn('rounded-full', somenteLeitura && 'hidden')} onClick={() => setModal('extra')}>
                <PlusIcon /> Registrar extra ou despesa
              </Button>
            }
          >
            O que entra na próxima fatura além do contrato?
          </Pergunta>
          <ul className="divide-border/70 flex flex-col divide-y">
            {extras.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block">
                    {e.descricao} <span className="text-muted-foreground">· {e.cliente}</span>
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    {e.data} · {e.origem}
                    {e.comprovante && ' · comprovante anexado'}
                  </span>
                </span>
                <Badge variant="outline">{rotuloExtra[e.tipo]}</Badge>
                <span className="w-24 text-right tabular-nums">{brl(e.valor, true)}</span>
                <Button size="icon-sm" variant="ghost" className={cn('rounded-full', somenteLeitura && 'hidden')} aria-label={`Tirar ${e.descricao}`} onClick={() => setExtras((xs) => xs.filter((x) => x.id !== e.id))}>
                  <TrashIcon />
                </Button>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-xs">Tudo isso entra na fatura de 01/12, com a NFS-e (reembolso sai sem nota, com o comprovante).</p>
        </Caixa>
      </div>

      {ed && (
        <EditarContrato
          somenteLeitura={somenteLeitura}
          c={ed === 'novo' ? undefined : ed}
          semContrato={clientes.filter((x) => !contratos.some((c) => c.cliente === x.nome && c.itens.length)).map((x) => x.nome)}
          onFechar={() => setEd(null)}
          onSalvar={salvar}
        />
      )}
      {modal === 'extra' && (
        <NovoExtra
          onFechar={() => setModal(null)}
          onSalvar={(e) => {
            setExtras((xs) => [e, ...xs])
            setModal(null)
          }}
        />
      )}
      {modal === 'reajuste' && (
        <CampanhaReajuste
          onFechar={() => setModal(null)}
          onEnviar={(n) => {
            setModal(null)
            setAviso(`Cartas de reajuste agendadas para ${n} clientes em 01/12. As respostas chegam em Conversas; quem pedir para conversar vira tarefa.`)
          }}
        />
      )}
    </AreaRolagem>
  )
}

const itemVazio = (): ItemContrato => ({ id: `i${Date.now()}`, descricao: '', setor: 'Contábil', valor: 0 })

/** Contrato como assinatura estruturada (FIN-001): itens, faixa, vencimento, índice, 13º, retenções. Salvar cria versão nova. */
function EditarContrato({ c, semContrato = [], somenteLeitura = false, onFechar, onSalvar }: { c?: Contrato; semContrato?: string[]; somenteLeitura?: boolean; onFechar: () => void; onSalvar: (c: Contrato) => void }) {
  const inicial = clientes.find((x) => x.nome === semContrato[0]) ?? clientes[0]
  const [d, setD] = useState<Contrato>(
    c ?? {
      id: `ct${Date.now()}`,
      cliente: inicial.nome,
      regime: inicial.regime,
      itens: [itemVazio()],
      vencimentoDia: 10,
      forma: 'boleto',
      indice: 'IPCA',
      dataBase: 'janeiro',
      decimoTerceiro: true,
      centroCusto: 'Carteira Fernanda',
      retencoes: [],
      versao: 0,
      vigenteDesde: '',
      situacao: 'vigente',
    },
  )
  const [desde, setDesde] = useState('12/2026')
  const novo = !c || c.versao === 0
  const total = totalContrato(d)
  const itensOk = d.itens.length > 0 && d.itens.every((i) => i.descricao.trim() && i.valor > 0)
  const mudaItem = (id: string, p: Partial<ItemContrato>) => setD({ ...d, itens: d.itens.map((i) => (i.id === id ? { ...i, ...p } : i)) })
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={novo ? (c ? `Contrato de ${c.cliente}` : 'Novo contrato') : `Contrato de ${d.cliente}`}
      descricao={
        novo ? 'O que o cliente paga, por quê e quando. Vira a base do faturamento, da rentabilidade e do app do cliente.' : `Versão ${d.versao}, desde ${d.vigenteDesde}. Salvar cria a versão ${d.versao + 1}; a anterior fica no histórico.`
      }
      acao={somenteLeitura ? 'Fechar' : novo ? 'Criar contrato' : `Salvar versão ${d.versao + 1}`}
      acaoDesabilitada={!somenteLeitura && !itensOk}
      onAcao={() => (somenteLeitura ? onFechar() : onSalvar({ ...d, versao: d.versao + 1, vigenteDesde: desde, situacao: d.situacao === 'sem_contrato' || d.situacao === 'acima_da_faixa' ? 'vigente' : d.situacao, alerta: undefined }))}
    >
      <fieldset disabled={somenteLeitura} className="contents">
        {!c && (
          <Campo rotulo="Cliente">
            {(id) => (
              <CampoEscolha
                id={id}
                valor={d.cliente}
                onMudar={(v) => setD({ ...d, cliente: v, regime: clientes.find((x) => x.nome === v)?.regime ?? '' })}
                opcoes={clientes.map((x) => ({ valor: x.nome, rotulo: semContrato.includes(x.nome) ? `${x.nome} (sem contrato)` : `${x.nome} (substitui o atual)` }))}
              />
            )}
          </Campo>
        )}
        {d.alerta && (
          <p className="bg-warning/10 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
            <WarningIcon className="text-warning mt-0.5 size-4 shrink-0" weight="fill" /> {d.alerta}. Ajuste a faixa ou o valor do item e mande o aditivo para assinatura.
          </p>
        )}
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Itens</h3>
          {d.itens.map((i, k) => (
            <div key={i.id} className="bg-sunken/50 grid grid-cols-[1fr_auto] gap-2 rounded-[14px] p-3 sm:grid-cols-[minmax(0,1fr)_8rem_7rem_auto]">
              <CampoTexto valor={i.descricao} onMudar={(v) => mudaItem(i.id, { descricao: v })} placeholder="Descrição (ex.: Folha)" aria-label={`Descrição do item ${k + 1}`} />
              <span className="sm:hidden" />
              <CampoEscolha
                rotulo={`Setor do item ${k + 1}`}
                valor={i.setor}
                onMudar={(v) => mudaItem(i.id, { setor: v })}
                opcoes={['Contábil', 'Fiscal', 'DP', 'Societário', 'Consultoria', 'Atendimento'].map((x) => ({ valor: x, rotulo: x }))}
              />
              <CampoTexto valor={i.valor ? String(i.valor) : ''} onMudar={(v) => mudaItem(i.id, { valor: Number(v.replace(/\D/g, '')) || 0 })} placeholder="R$" aria-label={`Valor do item ${k + 1}`} />
              <Button type="button" size="icon-sm" variant="ghost" className="self-center rounded-full" aria-label={`Tirar item ${k + 1}`} onClick={() => setD({ ...d, itens: d.itens.filter((x) => x.id !== i.id) })}>
                <TrashIcon />
              </Button>
              <CampoTexto valor={i.faixa ?? ''} onMudar={(v) => mudaItem(i.id, { faixa: v })} placeholder="Faixa contratada (ex.: até 25 funcionários)" aria-label={`Faixa do item ${k + 1}`} className="col-span-2 sm:col-span-4" />
            </div>
          ))}
          <span className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setD({ ...d, itens: [...d.itens, itemVazio()] })}>
              <PlusIcon /> Item
            </Button>
            <span className="ml-auto text-sm">
              Total: <strong className="font-medium tabular-nums">{brl(total)}</strong>/mês
            </span>
          </span>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Vencimento">
            {(id) => <CampoEscolha id={id} valor={String(d.vencimentoDia)} onMudar={(v) => setD({ ...d, vencimentoDia: Number(v) })} opcoes={[5, 10, 15, 20, 25].map((x) => ({ valor: String(x), rotulo: `dia ${x}` }))} />}
          </Campo>
          <Campo rotulo="Forma">{(id) => <CampoEscolha id={id} valor={d.forma} onMudar={(v) => setD({ ...d, forma: v })} opcoes={(Object.keys(rotuloForma) as FormaPagamento[]).map((x) => ({ valor: x, rotulo: rotuloForma[x] }))} />}</Campo>
          <Campo rotulo="Índice de reajuste">
            {(id) => <CampoEscolha id={id} valor={d.indice} onMudar={(v) => setD({ ...d, indice: v })} opcoes={(['IPCA', 'INPC', 'IGP-M', 'salário mínimo', 'sem reajuste'] as Indice[]).map((x) => ({ valor: x, rotulo: x }))} />}
          </Campo>
          <Campo rotulo="Data-base">
            {(id) => (
              <CampoEscolha
                id={id}
                valor={d.dataBase}
                onMudar={(v) => setD({ ...d, dataBase: v })}
                opcoes={['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', '—'].map((x) => ({ valor: x, rotulo: x }))}
              />
            )}
          </Campo>
        </div>
        <Interruptor ligado={d.decimoTerceiro} onMudar={(v) => setD({ ...d, decimoTerceiro: v })} rotulo="13º honorário em dezembro" detalhe="Proporcional aos meses se o cliente sair no meio do ano." />
        <Campo rotulo="Retenções na nota" ajuda="O líquido cobrado já desconta; o informe anual sai sozinho.">
          {() => <Fichas rotulo="Retenções" valores={d.retencoes} onMudar={(v) => setD({ ...d, retencoes: v })} opcoes={['IRRF 1,5%', 'CSRF 4,65%', 'ISS 2% (tomador)', 'INSS 11%'].map((x) => ({ valor: x, rotulo: x }))} />}
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Centro de custo">
            {(id) => <CampoEscolha id={id} valor={d.centroCusto} onMudar={(v) => setD({ ...d, centroCusto: v })} opcoes={['Carteira Fernanda', 'Carteira João', 'Carteira Ana', 'Carteira Bruno'].map((x) => ({ valor: x, rotulo: x }))} />}
          </Campo>
          <Campo rotulo="Indicado por" ajuda="Gera a comissão da política.">
            {(id) => <CampoTexto id={id} valor={d.indicadoPor ?? ''} onMudar={(v) => setD({ ...d, indicadoPor: v })} placeholder="ninguém" />}
          </Campo>
        </div>
        <Campo rotulo="Vale a partir da competência" ajuda="As faturas já emitidas não mudam.">
          {(id) => <CampoTexto id={id} valor={desde} onMudar={setDesde} />}
        </Campo>
      </fieldset>
    </GavetaFormulario>
  )
}

/** Extra ou despesa adiantada (FIN-002, GES-002). */
function NovoExtra({ onFechar, onSalvar }: { onFechar: () => void; onSalvar: (e: Extra) => void }) {
  const [tipo, setTipo] = useState<Extra['tipo']>('reembolso')
  const [cliente, setCliente] = useState(clientes[0].nome)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [comprovante, setComprovante] = useState(false)
  const v = Number(valor.replace(',', '.'))
  const erroComprovante = tipo === 'reembolso' && !comprovante
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Registrar extra ou despesa"
      descricao="Entra na próxima fatura do cliente. Serviço avulso sai com NFS-e; reembolso, com o comprovante."
      acao="Registrar"
      acaoDesabilitada={!descricao.trim() || !(v > 0) || erroComprovante}
      onAcao={() => onSalvar({ id: `e${Date.now()}`, cliente, tipo, descricao: descricao.trim(), valor: v, data: '18/11', origem: 'registrado por Fernanda Lima', comprovante })}
    >
      <Campo rotulo="Tipo">
        {() => (
          <Segmentado
            rotulo="Tipo"
            valor={tipo}
            onMudar={setTipo}
            opcoes={[
              { valor: 'reembolso', rotulo: 'Despesa adiantada' },
              { valor: 'servico_avulso', rotulo: 'Serviço avulso' },
              { valor: 'acima_da_faixa', rotulo: 'Acima da faixa' },
            ]}
          />
        )}
      </Campo>
      <Campo rotulo="Cliente">{(id) => <CampoEscolha id={id} valor={cliente} onMudar={setCliente} opcoes={clientes.map((x) => ({ valor: x.nome, rotulo: x.nome }))} />}</Campo>
      <Campo rotulo="Descrição">{(id) => <CampoTexto id={id} valor={descricao} onMudar={setDescricao} placeholder={tipo === 'reembolso' ? 'Taxa da Junta, cartório, certidão…' : 'Alteração contratual, IRPF de sócio…'} />}</Campo>
      <Campo rotulo="Valor (R$)">{(id) => <CampoTexto id={id} valor={valor} onMudar={setValor} placeholder="0,00" />}</Campo>
      {tipo === 'reembolso' && (
        <Campo rotulo="Comprovante" erro={erroComprovante ? 'Reembolso precisa do comprovante.' : undefined}>
          {() => (
            <Button type="button" variant="outline" className="w-fit rounded-full" onClick={() => setComprovante(true)}>
              <FileArrowUpIcon /> {comprovante ? 'comprovante.pdf anexado' : 'Anexar'}
            </Button>
          )}
        </Campo>
      )}
    </GavetaFormulario>
  )
}

/** Campanha de reajuste (GES-014): índice, segmentação pelo custo real, carta e envio com antecedência. */
function CampanhaReajuste({ onFechar, onEnviar }: { onFechar: () => void; onEnviar: (n: number) => void }) {
  const passos = ['Índice', 'Segmentar', 'Carta', 'Enviar']
  const [passo, setPasso] = useState(0)
  const [indice, setIndice] = useState<Indice>('INPC')
  const [acima, setAcima] = useState(true)
  const [carta, setCarta] = useState(
    'Olá, {{contato}}. Em janeiro, conforme a cláusula de reajuste do contrato, o honorário passa de {{valor_atual}} para {{valor_novo}} ({{indice}} acumulado de {{percentual}}). Qualquer dúvida, é só responder esta mensagem.',
  )
  const [canal, setCanal] = useState<'whatsapp' | 'email' | 'app'>('email')
  const pct = indice === 'INPC' ? 4.3 : indice === 'IPCA' ? 4.6 : indice === 'IGP-M' ? 3.1 : 7.5
  const grupos = [
    { nome: 'Índice cheio', n: acima ? 19 : 22, detalhe: `${pct.toLocaleString('pt-BR')}% em todos os itens` },
    { nome: 'Acima do índice', n: acima ? 3 : 0, detalhe: 'margem negativa em 2 dos últimos 3 meses (ex.: Padaria Pão Quente, Loja Bela Vista)' },
    { nome: 'Renegociar escopo', n: 2, detalhe: 'passaram da faixa: vira conversa, não carta' },
  ]
  const cartas = grupos[0].n + grupos[1].n
  const ultimo = passo === passos.length - 1
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Campanha de reajuste: janeiro"
      descricao="24 contratos com data-base em janeiro. O integrante Financeiro prepara; nada sai sem você enviar."
      acao={ultimo ? `Agendar ${cartas} cartas` : 'Continuar'}
      onAcao={() => (ultimo ? onEnviar(cartas) : setPasso((p) => p + 1))}
      secundaria={
        passo > 0 ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      <Passos passos={passos} atual={passo} />
      {passo === 0 && (
        <>
          <Campo rotulo="Índice" ajuda="Por padrão, o de cada contrato. Trocar aqui vale só para esta campanha.">
            {(id) => <CampoEscolha id={id} valor={indice} onMudar={setIndice} opcoes={(['INPC', 'IPCA', 'IGP-M', 'salário mínimo'] as Indice[]).map((x) => ({ valor: x, rotulo: x }))} />}
          </Campo>
          <p className="bg-sunken/60 rounded-[14px] px-3 py-2.5 text-sm">
            {indice} acumulado em 12 meses até outubro: <strong className="font-medium">{pct.toLocaleString('pt-BR')}%</strong> (série do Banco Central).
          </p>
        </>
      )}
      {passo === 1 && (
        <>
          <Interruptor ligado={acima} onMudar={setAcima} rotulo="Propor acima do índice para quem dá prejuízo" detalhe="Usa a rentabilidade do Timesheet: horas medidas × custo-hora contra o honorário." />
          <ul className="flex flex-col gap-2">
            {grupos.map((g) => (
              <li key={g.nome} className="bg-sunken/50 flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm">
                <span className="font-heading w-8 text-xl font-light tabular-nums">{g.n}</span>
                <span className="min-w-0">
                  <span className="block font-medium">{g.nome}</span>
                  <span className="text-muted-foreground block text-xs">{g.detalhe}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {passo === 2 && (
        <Campo rotulo="Carta" ajuda="Variáveis: {{contato}}, {{valor_atual}}, {{valor_novo}}, {{indice}}, {{percentual}}. Quem fica acima do índice recebe um parágrafo com o motivo.">
          {(id) => <CampoArea id={id} linhas={7} valor={carta} onMudar={setCarta} />}
        </Campo>
      )}
      {passo === 3 && (
        <>
          <Campo rotulo="Canal">
            {() => (
              <Segmentado
                rotulo="Canal"
                valor={canal}
                onMudar={setCanal}
                opcoes={[
                  { valor: 'email', rotulo: 'E-mail' },
                  { valor: 'whatsapp', rotulo: 'WhatsApp' },
                  { valor: 'app', rotulo: 'App do cliente' },
                ]}
              />
            )}
          </Campo>
          <p className={cn('flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm', 'bg-sunken/60')}>
            <ReceiptIcon className="mt-0.5 size-4 shrink-0" /> {cartas} cartas em 01/12 ao contato com o assunto “honorários”. Os contratos ganham a versão nova a partir de 01/2027 sozinhos; quem responder pedindo conversa sai da lista e
            vira tarefa.
          </p>
        </>
      )}
    </GavetaFormulario>
  )
}
