import { BankIcon, CheckIcon, PencilSimpleIcon, ShieldCheckIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { type DecisaoLote, useLoja } from '@/ambiente/loja'
import { Button } from '@/components/ui/button'
import { CampoArea } from '@/components/ui/formulario'
import { aprovadoresDe, empresaBpo, inicioProjecaoBpo, lotesBpo, mesesBpo, type LoteBpo } from '@/dados/bpo'
import { cn } from '@/lib/utils'
import { FluxoMensal } from '@/telas/financeiro/pecas'
import { Bloco, primeiroNome, TituloTela, type Ctx } from './ClienteApp'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** Lotes desta empresa que ainda esperam alguém. */
export function useLotesAbertos(ctx: Ctx) {
  const loja = useLoja()
  return lotesBpo.filter((l) => l.clienteId === ctx.clienteId && ['aguardando', 'parcial'].includes((loja.estado.bpoLotes[l.id] ?? { situacao: 'aguardando' }).situacao))
}

/**
 * App › Aprovações de pagamento (10, 3.6): o cartão do lote com Aprovar,
 * Editar e aprovar, Recusar. A aprovação fica registrada (quem, quando, o
 * quê); no M1, depois de aprovar, o cliente libera no banco. Nada é pago
 * sem esse passo humano.
 */
export function AprovacoesApp({ ctx }: { ctx: Ctx }) {
  const lotes = lotesBpo.filter((l) => l.clienteId === ctx.clienteId)
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Aprovações de pagamento</TituloTela>
      <p className="text-muted-foreground flex items-start gap-2 text-xs">
        <ShieldCheckIcon className="mt-0.5 size-4 shrink-0" /> O escritório prepara e confere; só você aprova. Nenhum pagamento sai sem a sua aprovação.
      </p>
      {lotes.length === 0 && <p className="text-muted-foreground py-6 text-center text-sm">Nenhum pagamento para aprovar.</p>}
      {lotes.map((l) => (
        <CartaoLoteApp key={l.id} l={l} ctx={ctx} />
      ))}
    </div>
  )
}

function CartaoLoteApp({ l, ctx }: { l: LoteBpo; ctx: Ctx }) {
  const loja = useLoja()
  const e = empresaBpo(ctx.clienteId)
  const s: DecisaoLote = loja.estado.bpoLotes[l.id] ?? { situacao: 'aguardando', aprovacoes: [], removidos: [] }
  const [editando, setEditando] = useState(false)
  const [fora, setFora] = useState<string[]>(s.removidos)
  const [recusando, setRecusando] = useState(false)
  const [motivo, setMotivo] = useState('')
  const itens = l.itens.filter((i) => !(editando ? fora : s.removidos).includes(i.conta))
  const total = itens.reduce((t, i) => t + i.valor, 0)
  const podem = aprovadoresDe(loja.fichaDe(ctx.clienteId)?.contatos ?? [], total, e?.alcadas.faixa2)
  const eu = ctx.contato.nome
  const posso = podem.some((p) => p.nome === eu)
  const jaAprovei = s.aprovacoes.some((a) => a.nome === eu)
  const aberto = s.situacao === 'aguardando' || s.situacao === 'parcial'
  const ator = `${eu} (cliente, app)`
  const avisarEquipe = (titulo: string) =>
    loja.avisar({ para: ['u1', 'u8', 'u9'], tipo: 'cliente', setor: 'bpo_financeiro', titulo, detalhe: `${ctx.clienteNome} · ${l.titulo}`, destino: { modulo: 'bpo', aba: 'aprovacoes', cliente: ctx.clienteId } })

  const aprovar = () => {
    const removidos = editando ? fora : s.removidos
    loja.decidirLote(l.id, { tipo: 'aprovar', nome: eu, removidos })
    const completa = s.aprovacoes.length + 1 >= l.aprovadoresNecessarios
    loja.registrar(ator, `Aprovou ${editando ? 'com edição ' : ''}o lote “${l.titulo}” de ${ctx.clienteNome} (${brl(total)})`)
    avisarEquipe(completa ? `${primeiroNome(eu)} aprovou o lote de ${brl(total)}` : `${primeiroNome(eu)} aprovou; falta a segunda aprovação`)
    setEditando(false)
    ctx.avisarApp(
      completa ? (e?.modoPagamento === 'M1' ? 'Aprovado. Agora libere no seu banco; o escritório confere a baixa.' : 'Aprovado e registrado. O pagamento sai no vencimento.') : 'Aprovação registrada. Falta a segunda pessoa aprovar.',
    )
  }

  return (
    <Bloco titulo={l.titulo}>
      <ul className="flex flex-col gap-2 text-sm">
        {l.itens.map((i) => {
          const tirado = (editando ? fora : s.removidos).includes(i.conta)
          return (
            <li key={i.conta} className="flex items-start gap-2">
              {editando && (
                <input
                  type="checkbox"
                  aria-label={`Manter ${i.fornecedor}`}
                  checked={!tirado}
                  onChange={(ev) => setFora((xs) => (ev.target.checked ? xs.filter((x) => x !== i.conta) : [...xs, i.conta]))}
                  className="accent-foreground mt-0.5 size-4 shrink-0"
                />
              )}
              <span className={cn('min-w-0 flex-1', tirado && 'text-muted-foreground line-through')}>
                <span className="block">{i.fornecedor}</span>
                <span className="text-muted-foreground block text-xs">
                  vence {i.vencimento} · {i.marca}
                </span>
                {i.alerta && (
                  <span className="text-warning-foreground flex items-start gap-1 text-xs">
                    <WarningIcon className="text-warning mt-0.5 size-3.5 shrink-0" weight="fill" /> {i.alerta}
                  </span>
                )}
              </span>
              <span className={cn('tabular-nums', tirado && 'text-muted-foreground line-through')}>{brl(i.valor)}</span>
            </li>
          )
        })}
      </ul>
      <div className="border-border/70 flex items-end gap-2 border-t pt-2 text-sm">
        <span className="flex-1">
          Total <strong className="font-medium tabular-nums">{brl(total)}</strong>
          <span className="text-muted-foreground block text-xs">
            saldo {brl(l.saldo)} · expira {l.expira}
          </span>
        </span>
      </div>
      <p className="text-muted-foreground text-xs">
        Preparado por {l.preparadoPor} · conferido por {l.conferidoPor}
        {l.aprovadoresNecessarios > 1 && ` · acima de ${brl(e?.alcadas.faixa2 ?? 20_000)}: ${podem.map((p) => primeiroNome(p.nome)).join(' e ')} aprovam`}
      </p>

      {aberto && !jaAprovei && posso && !recusando && (
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" className="rounded-full" onClick={aprovar} disabled={itens.length === 0}>
            <CheckIcon /> {editando ? 'Aprovar o que ficou' : 'Aprovar'}
          </Button>
          {!editando && (
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditando(true)}>
              <PencilSimpleIcon /> Editar e aprovar
            </Button>
          )}
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => (editando ? (setEditando(false), setFora(s.removidos)) : setRecusando(true))}>
            {editando ? (
              'Cancelar'
            ) : (
              <>
                <XIcon /> Recusar
              </>
            )}
          </Button>
        </div>
      )}
      {recusando && (
        <div className="flex flex-col gap-2">
          <CampoArea valor={motivo} onMudar={setMotivo} placeholder="Por quê? (ex.: a Gráfica Nova eu pago em dezembro)" linhas={2} />
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={!motivo.trim()}
              onClick={() => {
                loja.decidirLote(l.id, { tipo: 'recusar', nome: eu, motivo: motivo.trim() })
                loja.registrar(ator, `Recusou o lote “${l.titulo}” de ${ctx.clienteNome}: ${motivo.trim()}`)
                avisarEquipe(`${primeiroNome(eu)} recusou o lote`)
                setRecusando(false)
                ctx.avisarApp('Recusado. O escritório refaz o lote com o seu motivo.')
              }}
            >
              Recusar o lote
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setRecusando(false)}>
              Voltar
            </Button>
          </div>
        </div>
      )}
      {aberto && !posso && (
        <p className="text-muted-foreground text-xs">
          Acima da sua alçada ({brl(ctx.contato.alcadaPagamento ?? 0)}): quem aprova é {podem.map((p) => p.nome).join(' ou ') || 'o sócio'}.
        </p>
      )}
      {s.situacao === 'parcial' && jaAprovei && (
        <p className="text-muted-foreground text-xs">
          Você aprovou. Falta{' '}
          {podem
            .filter((p) => !s.aprovacoes.some((a) => a.nome === p.nome))
            .map((p) => primeiroNome(p.nome))
            .join(' ou ')}
          .
        </p>
      )}
      {s.situacao === 'aprovado' && (
        <div className="bg-sunken/60 flex flex-col gap-2 rounded-[14px] p-3 text-sm">
          <span>Aprovado por {s.aprovacoes.map((a) => `${primeiroNome(a.nome)} às ${a.quando}`).join(' e ')}.</span>
          {e?.modoPagamento === 'M1' ? (
            <>
              <span className="text-muted-foreground text-xs">Agora libere o pagamento no seu banco. O escritório confere a baixa no extrato.</span>
              <Button
                size="sm"
                variant="outline"
                className="w-fit rounded-full"
                onClick={() => {
                  loja.decidirLote(l.id, { tipo: 'liberar', nome: eu })
                  loja.registrar(ator, `Liberou no banco o lote “${l.titulo}” de ${ctx.clienteNome}`)
                  avisarEquipe(`${primeiroNome(eu)} liberou o lote no banco`)
                  ctx.avisarApp('Anotado. A conciliação confirma cada baixa.')
                }}
              >
                <BankIcon /> Já liberei no banco
              </Button>
            </>
          ) : (
            <span className="text-muted-foreground text-xs">O pagamento sai no vencimento porque você aprovou; o comprovante chega aqui.</span>
          )}
        </div>
      )}
      {s.situacao === 'liberado' && <p className="text-muted-foreground text-xs">Liberado no banco. O escritório confere as baixas na conciliação.</p>}
      {s.situacao === 'recusado' && <p className="text-muted-foreground text-xs">Recusado: {s.motivo}</p>}
    </Bloco>
  )
}

/** App › Fluxo de caixa (10, 3.4): saldos lidos do banco, próximos pagamentos e a projeção. */
export function CaixaApp({ ctx }: { ctx: Ctx }) {
  const e = empresaBpo(ctx.clienteId)
  if (!e) return null
  const saldo = e.bancos.reduce((s, b) => s + b.saldo, 0)
  const proximas = e.contas.filter((c) => c.situacao !== 'paga')
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Fluxo de caixa</TituloTela>
      <Bloco titulo="Quanto tem hoje">
        <span className="font-heading text-2xl font-light tabular-nums">{brl(saldo)}</span>
        {saldo < e.caixaMinimo && (
          <span className="text-warning-foreground flex items-center gap-1 text-xs">
            <WarningIcon className="text-warning size-3.5" weight="fill" /> abaixo do mínimo combinado ({brl(e.caixaMinimo)})
          </span>
        )}
        <ul className="flex flex-col gap-1 text-sm">
          {e.bancos.map((b) => (
            <li key={b.id} className="flex gap-2">
              <span className="min-w-0 flex-1 truncate">{b.nome}</span>
              <span className="tabular-nums">{brl(b.saldo)}</span>
            </li>
          ))}
        </ul>
        <span className="text-muted-foreground text-xs">lido do banco · {e.bancos[0]?.atualizado}</span>
      </Bloco>
      <Bloco titulo="Próximos pagamentos">
        <ul className="flex flex-col gap-1.5 text-sm">
          {proximas.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span className="min-w-0 flex-1">
                <span className="block truncate">{c.fornecedor}</span>
                <span className="text-muted-foreground block text-xs">vence {c.vencimento}</span>
              </span>
              <span className="tabular-nums">{brl(c.valor)}</span>
            </li>
          ))}
        </ul>
      </Bloco>
      <Bloco titulo="Próximos meses">
        <FluxoMensal altura="h-32" d={{ meses: mesesBpo, entradas: e.fluxo.entradas, saidas: e.fluxo.saidas, inicio: inicioProjecaoBpo, marcos: [{ mes: 3, texto: '13º e férias' }] }} />
      </Bloco>
    </div>
  )
}

/** Proposta de alçadas do escritório: só vale depois do aceite de quem responde pela empresa (10, 3.7). */
export function PropostaAlcadaApp({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const p = loja.estado.bpoAlcadaProposta[ctx.clienteId]
  if (!p || !ctx.contato.reforcada) return null
  const ator = `${ctx.contato.nome} (cliente, app)`
  return (
    <Bloco titulo="O escritório propôs novas alçadas de pagamento">
      <ul className="flex flex-col gap-1 text-sm">
        <li>Até {brl(p.faixa1)}: 1 aprovador</li>
        <li>Até {brl(p.faixa2)}: 1 aprovador com alçada</li>
        <li>Acima de {brl(p.faixa2)}: duas pessoas aprovam</li>
        <li>Janela: {p.janela}</li>
        {Object.entries(p.pessoas)
          .filter(([, v]) => v > 0)
          .map(([n, v]) => (
            <li key={n} className="text-muted-foreground text-xs">
              {n} aprova até {brl(v)}
            </li>
          ))}
      </ul>
      <p className="text-muted-foreground text-xs">Proposta por {p.por}. Nada muda até você aceitar.</p>
      <div className="flex gap-1.5">
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => {
            loja.aceitarAlcada(ctx.clienteId, ctx.contato.nome)
            loja.registrar(ator, `Aceitou as novas alçadas de pagamento de ${ctx.clienteNome}`)
            loja.avisar({
              para: ['u1', 'u8', 'u9'],
              tipo: 'cliente',
              setor: 'bpo_financeiro',
              titulo: `${primeiroNome(ctx.contato.nome)} aceitou as novas alçadas`,
              detalhe: ctx.clienteNome,
              destino: { modulo: 'bpo', aba: 'configuracao', cliente: ctx.clienteId },
            })
            ctx.avisarApp('Alçadas aceitas. Valem a partir do próximo lote.')
          }}
        >
          <CheckIcon /> Aceitar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          onClick={() => {
            loja.proporAlcada(ctx.clienteId, null)
            loja.registrar(ator, `Recusou a proposta de alçadas de ${ctx.clienteNome}`)
            ctx.avisarApp('Proposta recusada. As alçadas de antes continuam valendo.')
          }}
        >
          <XIcon /> Recusar
        </Button>
      </div>
    </Bloco>
  )
}
