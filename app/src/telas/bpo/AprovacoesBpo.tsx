import { BellRingingIcon, CheckIcon, HandPalmIcon, ShieldCheckIcon, WarningIcon } from '@phosphor-icons/react'
import { useLoja } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { aprovadoresDe, empresaBpo, empresasBpo, escalonamentoBpo, passosEscalonamento, lotesBpo, rotuloModoPagamento, titularDe, type EmpresaBpo, type LoteBpo } from '@/dados/bpo'
import { SeloTitular } from '../financeiro/pecas'
import { BotaoErp, brl, CabecalhoBpo, PaginaBpo, Caixa, TituloBloco, useContasBpo, useLotes, type PropsBpo } from './comum'

/**
 * BPO › Aprovações (10, 3.5 a 3.8): primeiro a conferência interna (quem digita
 * não confere), depois os lotes que viraram cartão no app do cliente. A
 * plataforma registra quem aprovou e quando; pagar e transferir nunca saem
 * sozinhos. No M1, o cliente libera no banco depois de aprovar.
 */
export function AprovacoesBpoTela({ empresa }: PropsBpo) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const contasDe = useContasBpo()
  const lote = useLotes()
  const lista = empresa ? [empresa] : empresasBpo
  const aConferir = lista.flatMap((e) =>
    contasDe(e)
      .filter((c) => c.situacao === 'a_aprovar' && !c.lote)
      .map((c) => ({ e, c })),
  )
  const lotes = lotesBpo.filter((l) => lista.some((e) => e.clienteId === l.clienteId))

  return (
    <PaginaBpo>
      <CabecalhoBpo
        titulo="Aprovações"
        sub={empresa ? `${empresa.nome} · ${rotuloModoPagamento[empresa.modoPagamento]}` : 'Conferência interna e lotes com os clientes'}
        status={(() => {
          const n = lotes.filter((l) => ['aguardando', 'parcial'].includes(lote(l.id).situacao)).length
          return `${aConferir.filter(({ c }) => !c.conferidoPor).length} para conferir; ${n === 1 ? '1 lote' : `${n} lotes`} com ${n === 1 && empresa ? 'o cliente' : 'os clientes'}`
        })()}
      >
        {empresa && <SeloTitular titular={titularDe(empresa)} />}
      </CabecalhoBpo>

      <p className="bg-sunken/60 text-muted-foreground flex items-start gap-2 rounded-[16px] px-4 py-3 text-sm">
        <ShieldCheckIcon className="text-foreground mt-0.5 size-5 shrink-0" weight="duotone" />
        <span>
          <span className="text-foreground">Nenhum pagamento sai sem uma aprovação humana registrada.</span> Pagar e transferir nunca viram automáticos: o integrante prepara, a equipe confere e o cliente aprova no app.
        </span>
      </p>

      <Caixa>
        <TituloBloco descricao="Quem digitou a conta não confere; de R$ 2 mil a R$ 20 mil, analista e gestor.">Para conferir</TituloBloco>
        {aConferir.length === 0 && <p className="text-muted-foreground py-2 text-sm">Tudo conferido.</p>}
        <ul className="divide-border/70 flex flex-col divide-y">
          {aConferir.map(({ e, c }) => {
            // Segregação (10, 3.8): quem digitou não confere; quem alterou a alçada da empresa também não;
            // no BPO de uma pessoa, confere o Gestor do escritório ou, na falta, o cliente na aprovação.
            const alterou = loja.estado.bpoAlcadaProposta[e.clienteId]?.por === usuario.nome || loja.estado.bpoAlcadas[e.clienteId]?.alteradaPor === usuario.nome
            const sozinho = e.analista === e.responsavel && usuario.nome === e.analista
            const motivo =
              c.digitadoPor === usuario.nome
                ? 'Você digitou esta conta: outra pessoa confere (segregação de funções).'
                : alterou
                  ? 'Você alterou as alçadas desta empresa: não confere nem aprova pagamentos nela.'
                  : sozinho
                    ? `BPO de uma pessoa: confere a Gestora do escritório (Fernanda Lima) ou, na falta, o cliente na aprovação.`
                    : ''
            const mesma = !!motivo
            return (
              <li key={c.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1 basis-60">
                  <span className="block truncate">
                    {c.fornecedor}
                    {!empresa && <span className="text-muted-foreground"> · {e.nome}</span>}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    vence {c.vencimento} · via {c.origem} · digitou {c.digitadoPor}
                    {c.conferidoPor && ` · conferiu ${c.conferidoPor}`}
                  </span>
                  {motivo && !c.conferidoPor && <span className="text-muted-foreground block text-xs">{motivo}</span>}
                  {c.alerta && (
                    <span className="text-warning-foreground flex items-center gap-1 text-xs">
                      <WarningIcon className="text-warning size-3.5" weight="fill" /> {c.alerta}
                    </span>
                  )}
                </span>
                <span className="w-24 text-right tabular-nums">{brl(c.valor, true)}</span>
                {c.conferidoPor ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      loja.ajustarContaBpo(c.id, { lote: 'proximo' })
                      loja.registrar(usuario.nome, `BPO · ${e.nome}: ${c.fornecedor} vai no próximo lote`)
                      loja.toast(`${c.fornecedor} entra no lote de amanhã às 9h, para o cliente aprovar`)
                    }}
                  >
                    Pôr no próximo lote
                  </Button>
                ) : (
                  <Tooltip conteudo={motivo || 'Confere fornecedor, valor, vencimento e dados bancários contra o documento.'}>
                    <span>
                      <Button
                        size="sm"
                        className="rounded-full"
                        disabled={mesma}
                        onClick={() => {
                          loja.ajustarContaBpo(c.id, { conferidoPor: usuario.nome })
                          loja.registrar(usuario.nome, `BPO · ${e.nome}: conferiu ${c.fornecedor} (${brl(c.valor, true)})`)
                        }}
                      >
                        <CheckIcon /> Conferir
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {!c.conferidoPor && sozinho && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      loja.ajustarContaBpo(c.id, { conferidoPor: 'o cliente, na aprovação' })
                      loja.registrar(usuario.nome, `BPO · ${e.nome}: ${c.fornecedor} vai ao cliente conferir na aprovação (BPO de uma pessoa)`)
                    }}
                  >
                    Cliente confere
                  </Button>
                )}
                <BotaoErp e={e} oque={`a conta ${c.fornecedor}`} />
              </li>
            )
          })}
        </ul>
      </Caixa>

      <div className={lotes.length >= 3 ? 'grid gap-4 lg:grid-cols-2 xl:grid-cols-3' : lotes.length === 2 ? 'grid gap-4 lg:grid-cols-2' : 'grid gap-4'}>
        {lotes.map((l) => (
          <CartaoLote key={l.id} l={l} e={empresaBpo(l.clienteId) as EmpresaBpo} mostrarEmpresa={!empresa} />
        ))}
      </div>
    </PaginaBpo>
  )
}

function CartaoLote({ l, e, mostrarEmpresa }: { l: LoteBpo; e: EmpresaBpo; mostrarEmpresa: boolean }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const s = useLotes()(l.id)
  const itens = l.itens.filter((i) => !s.removidos.includes(i.conta))
  const total = itens.reduce((t, i) => t + i.valor, 0)
  const ficha = loja.fichaDe(e.clienteId)
  const podem = aprovadoresDe(ficha?.contatos ?? [], total)
  const rotulo = {
    aguardando: `aguardando ${podem.map((p) => p.nome.split(' ')[0]).join(l.aprovadoresNecessarios > 1 ? ' e ' : ' ou ')}`,
    parcial: `${s.aprovacoes.length} de ${l.aprovadoresNecessarios} aprovações`,
    aprovado: e.modoPagamento === 'M1' ? 'aprovado · o cliente libera no banco' : 'aprovado · agendado após o cartão',
    liberado: 'liberado no banco',
    recusado: 'recusado',
  }[s.situacao]
  return (
    <Caixa>
      <TituloBloco descricao={`${mostrarEmpresa ? `${e.nome} · ` : ''}expira ${l.expira}`}>{l.titulo}</TituloBloco>
      <Badge className="w-fit" variant={s.situacao === 'recusado' ? 'erro' : s.situacao === 'aprovado' || s.situacao === 'liberado' ? 'sucesso' : 'destaque'}>
        {rotulo}
      </Badge>
      <ul className="flex flex-col gap-1.5 text-sm">
        {l.itens.map((i) => (
          <li key={i.conta} className={s.removidos.includes(i.conta) ? 'text-muted-foreground flex gap-2 line-through' : 'flex gap-2'}>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{i.fornecedor}</span>
              <span className="text-muted-foreground block text-xs">
                vence {i.vencimento} · {i.marca}
              </span>
              {i.alerta && (
                <span className="text-warning-foreground flex items-start gap-1 text-xs">
                  <WarningIcon className="text-warning mt-0.5 size-3.5 shrink-0" weight="fill" /> {i.alerta}
                </span>
              )}
            </span>
            <span className="tabular-nums">{brl(i.valor)}</span>
          </li>
        ))}
      </ul>
      <div className="border-border/70 flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
        <span className="flex-1">
          Total <span className="tabular-nums">{brl(total)}</span>
          <span className="text-muted-foreground block text-xs">
            saldo {brl(l.saldo)} · {l.aprovadoresNecessarios > 1 ? 'aprovação reforçada (2 pessoas)' : '1 aprovador'}
          </span>
          <span className="text-muted-foreground block text-xs">
            preparou {l.preparadoPor} · conferiu {l.conferidoPor}
          </span>
        </span>
        {(s.situacao === 'aguardando' || s.situacao === 'parcial') && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => (loja.registrar(usuario.nome, `BPO · lembrete do lote ${l.titulo} a ${e.nome}`), loja.toast(`Lembrete enviado a ${podem.map((p) => p.nome).join(' e ')} pelo app e WhatsApp`))}
          >
            <BellRingingIcon /> Lembrar
          </Button>
        )}
        {s.situacao === 'recusado' && (
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => loja.toast('Lote volta para a fila; o integrante refaz com o motivo do cliente')}>
            <HandPalmIcon /> Refazer
          </Button>
        )}
      </div>
      <LinhaEscalonamento l={l} parado={s.situacao !== 'aguardando' && s.situacao !== 'parcial'} />
      {s.aprovacoes.length > 0 && (
        <ul className="text-muted-foreground flex flex-col gap-0.5 text-xs">
          {s.aprovacoes.map((a) => (
            <li key={a.nome}>
              {s.situacao === 'recusado' ? 'Recusado' : 'Aprovado'} por {a.nome} às {a.quando} no app
              {s.removidos.length > 0 && s.situacao !== 'recusado' && ` (editou: tirou ${s.removidos.length})`}
            </li>
          ))}
          {s.motivo && <li>Motivo: {s.motivo}</li>}
          {s.situacao === 'liberado' && <li>Liberado no banco pelo cliente; a conciliação confirma a baixa no {e.erp.provedor}.</li>}
        </ul>
      )}
    </Caixa>
  )
}

/** Linha do tempo do escalonamento no cartão do lote (o que já aconteceu e o que vem se ninguém responder). */
function LinhaEscalonamento({ l, parado }: { l: LoteBpo; parado: boolean }) {
  const esc = escalonamentoBpo[l.clienteId]
  if (!esc) return null
  const proximo = [...l.itens].sort((a, b) => a.vencimento.split('/').reverse().join('').localeCompare(b.vencimento.split('/').reverse().join('')))[0]
  const [d, m] = proximo.vencimento.split('/').map(Number)
  const vespera = `véspera (${String(d - 1).padStart(2, '0')}/${String(m).padStart(2, '0')})`
  const passos = passosEscalonamento(esc, vespera)
  return (
    <details className="text-xs">
      <summary className="text-muted-foreground cursor-pointer select-none">{parado ? 'Escalonamento parou: o cliente respondeu' : 'Se ninguém responder (escalonamento)'}</summary>
      <ol className="mt-2 flex flex-col gap-1.5 border-l pl-3">
        {passos.map((p, i) => (
          <li key={i} className={i === 0 || parado ? 'text-muted-foreground' : undefined}>
            <span className="font-medium">{p.quando}</span> · {p.texto}
            {i === 0 && ' (feito)'}
          </li>
        ))}
      </ol>
    </details>
  )
}
