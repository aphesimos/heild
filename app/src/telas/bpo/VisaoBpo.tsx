import { ArrowRightIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { corAudit, empresasBpo, filaBpo, inicioProjecaoBpo, lotesBpo, mesesBpo, rotuloModoPagamento, titularDe, type EmpresaBpo } from '@/dados/bpo'
import { cn } from '@/lib/utils'
import { FluxoMensal, SaldosContas, SeloTitular } from '../financeiro/pecas'
import { BotaoErp, brl, CabecalhoBpo, PaginaBpo, Caixa, Numero, SeloAudit, SeloErp, TituloBloco, useContasBpo, useLotes, type PropsBpo } from './comum'

interface Decisao {
  id: string
  cor: 'vermelho' | 'amarelo'
  texto: string
  detalhe: string
  empresa: string
  aba: string
  rotulo: string
}

/** O que precisa de decisão hoje, da mais urgente para a menos (gestão por exceção, 10, 5.1). */
function useDecisoes(lista: EmpresaBpo[]): Decisao[] {
  const lote = useLotes()
  const contas = useContasBpo()
  const { permissoes } = useSessao()
  const ds: Decisao[] = []
  for (const e of lista) {
    if (e.erp.situacao === 'credencial_vencida' || e.erp.situacao === 'atrasada')
      ds.push({
        id: `erp-${e.clienteId}`,
        cor: 'vermelho',
        texto: e.erp.situacao === 'atrasada' ? `${e.erp.provedor} sem sincronizar ${e.erp.ultima}` : `Credencial do ${e.erp.provedor} vencida`,
        detalhe: e.nome,
        empresa: e.clienteId,
        aba: permissoes.abas.bpo?.includes('configuracao') ? 'configuracao' : 'fila',
        rotulo: 'Resolver',
      })
    for (const c of contas(e)) {
      if (c.alerta && c.situacao === 'a_aprovar' && c.alerta.startsWith('venceu'))
        ds.push({ id: `venc-${c.id}`, cor: 'vermelho', texto: `${c.fornecedor} venceu sem aprovação`, detalhe: `${e.nome} · ${brl(c.valor)} · o sistema avisa, nunca paga`, empresa: e.clienteId, aba: 'aprovacoes', rotulo: 'Ver' })
    }
    const caixa = e.bancos.reduce((s, b) => s + b.saldo, 0)
    if (caixa < e.caixaMinimo) ds.push({ id: `cx-${e.clienteId}`, cor: 'vermelho', texto: `Caixa abaixo do mínimo (${brl(caixa)} de ${brl(e.caixaMinimo)})`, detalhe: e.nome, empresa: e.clienteId, aba: 'visao', rotulo: 'Abrir' })
    for (const l of lotesBpo.filter((x) => x.clienteId === e.clienteId)) {
      const s = lote(l.id)
      if (s.situacao === 'aguardando' || s.situacao === 'parcial')
        ds.push({
          id: `lt-${l.id}`,
          cor: 'amarelo',
          texto: `Lote de ${brl(l.itens.reduce((t, i) => t + i.valor, 0))} com o cliente`,
          detalhe: `${e.nome} · expira ${l.expira}${s.situacao === 'parcial' ? ` · ${s.aprovacoes.length} de ${l.aprovadoresNecessarios} aprovações` : ''}`,
          empresa: e.clienteId,
          aba: 'aprovacoes',
          rotulo: 'Ver',
        })
      if (s.situacao === 'recusado') ds.push({ id: `rc-${l.id}`, cor: 'vermelho', texto: 'Lote recusado pelo cliente', detalhe: `${e.nome} · ${s.motivo ?? ''}`, empresa: e.clienteId, aba: 'aprovacoes', rotulo: 'Ver' })
    }
    const aConferir = contas(e).filter((c) => c.situacao === 'a_aprovar' && !c.conferidoPor)
    if (aConferir.length)
      ds.push({
        id: `cf-${e.clienteId}`,
        cor: 'amarelo',
        texto: `${aConferir.length} conta${aConferir.length > 1 ? 's' : ''} para conferir`,
        detalhe: `${e.nome} · quem digitou não confere`,
        empresa: e.clienteId,
        aba: 'aprovacoes',
        rotulo: 'Conferir',
      })
  }
  return ds.sort((a, b) => (a.cor === b.cor ? 0 : a.cor === 'vermelho' ? -1 : 1))
}

/**
 * BPO › Visão geral: abre pelo que precisa de decisão (exceções da carteira ou
 * da empresa escolhida), com os números e o semáforo da auditoria contínua.
 */
export function VisaoBpoTela({ empresa, onEscolher }: PropsBpo) {
  const lista = empresa ? [empresa] : empresasBpo
  const decisoes = useDecisoes(lista)
  const [todas, setTodas] = useState(false)
  const visiveis = todas || empresa ? decisoes : decisoes.slice(0, 6)
  const lote = useLotes()
  const contas = useContasBpo()
  const aguardando = lotesBpo.filter((l) => lista.some((e) => e.clienteId === l.clienteId) && ['aguardando', 'parcial'].includes(lote(l.id).situacao))
  const sla = Math.round(lista.reduce((s, e) => s + e.sla.mes, 0) / lista.length)
  const contagem = { verde: 0, amarelo: 0, vermelho: 0 }
  for (const e of lista) contagem[e.audit.cor]++

  return (
    <PaginaBpo>
      <CabecalhoBpo
        integrante="i-bpo-conciliacao"
        titulo={empresa ? empresa.nome : 'BPO Financeiro'}
        sub={
          empresa
            ? `${empresa.contabil ? 'Cliente contábil e de BPO' : 'Só BPO'} · ${rotuloModoPagamento[empresa.modoPagamento]} · responsável ${empresa.responsavel}`
            : `${empresasBpo.length} empresas na carteira · ${empresasBpo.filter((e) => e.contabil).length} também na contabilidade`
        }
        status={decisoes.length ? `${decisoes.length} ${decisoes.length > 1 ? 'coisas precisam' : 'coisa precisa'} de decisão; o resto segue nas rotinas` : undefined}
      >
        {empresa && (
          <>
            <SeloTitular titular={titularDe(empresa)} />
            <SeloErp e={empresa} />
            <BotaoErp e={empresa} oque="o painel da empresa" rotulo />
          </>
        )}
      </CabecalhoBpo>

      <Caixa>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Numero valor={decisoes.length} rotulo="precisam de decisão" detalhe={`${decisoes.filter((d) => d.cor === 'vermelho').length} para hoje`} />
          <Numero valor={aguardando.length} rotulo="lotes com o cliente" detalhe={brl(aguardando.reduce((s, l) => s + l.itens.reduce((t, i) => t + i.valor, 0), 0))} />
          <Numero valor={`${sla}%`} rotulo="SLA do mês" detalhe="no prazo combinado" />
          <Numero
            valor={
              <span className="flex items-center gap-3 text-xl sm:text-2xl">
                {(['verde', 'amarelo', 'vermelho'] as const).map((c) => (
                  <span key={c} className="flex items-center gap-1">
                    <span className="size-2.5 rounded-full" style={{ background: corAudit[c] }} />
                    {contagem[c]}
                  </span>
                ))}
              </span>
            }
            rotulo="auditoria contínua"
            detalhe="em dia · atenção · agir hoje"
          />
        </div>
      </Caixa>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Caixa>
          <TituloBloco descricao="Só o que pede uma pessoa; captura, conciliação e lembretes o integrante faz sozinho.">Precisa de decisão</TituloBloco>
          {decisoes.length === 0 && (
            <p className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
              <CheckCircleIcon className="text-success size-5" weight="fill" /> Nada pendente. As rotinas seguem.
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {visiveis.map((d) => (
              <li key={d.id} className="bg-sunken/50 flex items-center gap-3 rounded-[14px] p-3 text-sm">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: corAudit[d.cor] }} aria-label={d.cor === 'vermelho' ? 'agir hoje' : 'atenção'} />
                <span className="min-w-0 flex-1">
                  <span className="block">{d.texto}</span>
                  <span className="text-muted-foreground block truncate text-xs">{d.detalhe}</span>
                </span>
                <Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={() => onEscolher(d.empresa, d.aba)}>
                  {d.rotulo} <ArrowRightIcon />
                </Button>
              </li>
            ))}
          </ul>
          {visiveis.length < decisoes.length && (
            <Button size="sm" variant="ghost" className="w-fit rounded-full" onClick={() => setTodas(true)}>
              Mostrar todas ({decisoes.length})
            </Button>
          )}
        </Caixa>
        {empresa ? (
          <Caixa>
            <TituloBloco descricao="Por que a empresa está nesta cor.">Auditoria contínua</TituloBloco>
            <div className="flex flex-wrap items-center gap-2">
              <SeloAudit e={empresa} />
              {empresa.paraleloAte && <Badge variant="destaque">em paralelo até {empresa.paraleloAte}</Badge>}
            </div>
            <ul className="flex flex-col gap-1.5 text-sm">
              {empresa.audit.motivos.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="bg-muted-foreground mt-2 size-1 shrink-0 rounded-full" />
                  {m}
                </li>
              ))}
            </ul>
          </Caixa>
        ) : (
          <Caixa>
            <TituloBloco descricao="Ordenada pela auditoria: quem pede atenção primeiro.">Carteira</TituloBloco>
            <ul className="divide-border/70 flex flex-col divide-y">
              {[...empresasBpo]
                .sort((a, b) => ['vermelho', 'amarelo', 'verde'].indexOf(a.audit.cor) - ['vermelho', 'amarelo', 'verde'].indexOf(b.audit.cor))
                .map((e) => (
                  <li key={e.clienteId}>
                    <button type="button" onClick={() => onEscolher(e.clienteId)} className="hover:bg-raised/60 -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-[12px] px-2 py-2 text-left text-sm">
                      <SeloAudit e={e} compacto />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{e.nome}</span>
                        <span className="text-muted-foreground block truncate text-xs">{e.audit.motivos[0]}</span>
                      </span>
                      <span className="text-muted-foreground hidden text-xs sm:inline">{e.erp.provedor}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </Caixa>
        )}
      </div>

      {empresa && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Caixa>
            <TituloBloco descricao="Em mil reais; dois meses de histórico e quatro projetados.">Fluxo de caixa</TituloBloco>
            <FluxoMensal d={{ meses: mesesBpo, entradas: empresa.fluxo.entradas, saidas: empresa.fluxo.saidas, inicio: inicioProjecaoBpo, marcos: [{ mes: 3, texto: '13º e férias' }] }} />
          </Caixa>
          <Caixa>
            <TituloBloco descricao="Saldos lidos do banco; contas do espelho do ERP.">Caixa da empresa</TituloBloco>
            <SaldosContas
              bancos={empresa.bancos}
              aPagar30={contas(empresa)
                .filter((c) => c.situacao !== 'paga')
                .reduce((s, c) => s + c.valor, 0)}
            />
          </Caixa>
        </div>
      )}
    </PaginaBpo>
  )
}

/**
 * BPO › Carteira: as empresas com ERP e sincronização, auditoria, responsável,
 * caixa contra o mínimo, lotes e pedidos abertos. A linha abre a empresa.
 */
export function CarteiraBpoTela({ empresa, onEscolher }: PropsBpo) {
  const lote = useLotes()
  // Os itens resolvidos na Fila saem da contagem (mesma memória da sessão).
  const [feitos] = usePersistente<string[]>('bpo.op.feitos', [])
  return (
    <PaginaBpo>
      <CabecalhoBpo integrante="i-bpo-conciliacao" titulo="Carteira" sub="Cada empresa com o ERP que já usa: a plataforma lê o espelho, a aprovação e a trilha ficam aqui" />
      <Caixa className="gap-0 p-0 sm:p-0">
        <ul className="divide-border/70 flex flex-col divide-y">
          {empresasBpo.map((e) => {
            const caixa = e.bancos.reduce((s, b) => s + b.saldo, 0)
            const abertos = lotesBpo.filter((l) => l.clienteId === e.clienteId && ['aguardando', 'parcial'].includes(lote(l.id).situacao)).length
            const pedidos = filaBpo.filter((f) => f.clienteId === e.clienteId && !feitos.includes(f.id)).length
            return (
              <li key={e.clienteId} className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5', empresa?.clienteId === e.clienteId && 'bg-raised/50')}>
                <button type="button" onClick={() => onEscolher(e.clienteId, 'visao')} className="min-w-0 flex-1 basis-64 cursor-pointer text-left">
                  <span className="flex items-center gap-2">
                    <SeloAudit e={e} compacto />
                    <span className="truncate text-sm font-medium">{e.nome}</span>
                    {e.contabil && (
                      <Badge variant="outline" className="hidden sm:inline-flex">
                        também contábil
                      </Badge>
                    )}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                    {e.responsavel === e.analista ? e.responsavel : `${e.analista} faz · ${e.responsavel} confere`} · {e.audit.motivos[0]}
                  </span>
                </button>
                <SeloErp e={e} />
                <span className="w-32 text-right text-sm tabular-nums">
                  <span className={caixa < e.caixaMinimo ? 'text-destructive' : undefined}>{brl(caixa)}</span>
                  <span className="text-muted-foreground block text-[11px]">mínimo {brl(e.caixaMinimo)}</span>
                </span>
                <span className="text-muted-foreground w-32 text-xs">
                  {abertos === 0 ? 'nenhum lote' : `${abertos} lote${abertos === 1 ? '' : 's'}`} com o cliente
                  <span className="block">
                    {pedidos} na fila · SLA {e.sla.mes}%
                  </span>
                </span>
                <BotaoErp e={e} oque={`a empresa ${e.nome}`} />
              </li>
            )
          })}
        </ul>
      </Caixa>
    </PaginaBpo>
  )
}
