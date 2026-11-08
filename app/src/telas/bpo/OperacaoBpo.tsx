import { BellRingingIcon, CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmentado } from '@/components/ui/formulario'
import { Tooltip } from '@/components/ui/tooltip'
import { empresaBpo, empresasBpo, filaBpo, titularDe, type EmpresaBpo } from '@/dados/bpo'
import { agenda, diasSemana } from '@/dados/exemplo'
import { useTema } from '@/theme/ThemeProvider'
import { cn } from '@/lib/utils'
import { PendentesConciliacao, SeloTitular } from '../financeiro/pecas'
import { BotaoErp, CabecalhoBpo, PaginaBpo, Caixa, SeloErp, TituloBloco, useAbrirErp, type PropsBpo } from './comum'

type Bola = 'todas' | 'bpo' | 'cliente'

/**
 * BPO › Fila e pedidos (10, 5.3): pedidos dos clientes (app, WhatsApp, e-mail)
 * e pendências da operação, com a bola de cada um (conosco ou com o cliente).
 */
export function FilaBpoTela({ empresa }: PropsBpo) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const [bola, setBola] = useState<Bola>('todas')
  const [feitos, setFeitos] = usePersistente<string[]>('bpo.op.feitos', [])
  const base = filaBpo.filter((f) => (!empresa || f.clienteId === empresa.clienteId) && !feitos.includes(f.id))
  const lista = base.filter((f) => bola === 'todas' || f.bola === bola)
  return (
    <PaginaBpo>
      <CabecalhoBpo
        titulo="Fila e pedidos"
        sub={empresa ? `${empresa.nome} · pedidos pelo app, WhatsApp e e-mail viram item com prazo` : 'Pedidos dos clientes e pendências da operação, pelo prazo'}
        status={`${base.filter((f) => f.bola === 'bpo').length} conosco, ${base.filter((f) => f.bola === 'cliente').length} com os clientes`}
      >
        {empresa && <SeloTitular titular={titularDe(empresa)} />}
      </CabecalhoBpo>
      <Caixa>
        <Segmentado
          rotulo="Com quem está a bola"
          valor={bola}
          onMudar={setBola}
          opcoes={[
            { valor: 'todas', rotulo: `Todos (${base.length})` },
            { valor: 'bpo', rotulo: 'Conosco' },
            { valor: 'cliente', rotulo: 'Com o cliente' },
          ]}
        />
        {lista.length === 0 && <p className="text-muted-foreground py-4 text-sm">Nada aqui.</p>}
        <ul className="divide-border/70 flex flex-col divide-y">
          {lista.map((f) => {
            const e = empresaBpo(f.clienteId) as EmpresaBpo
            return (
              <li key={f.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="min-w-0 flex-1 basis-64">
                  <span className="block">{f.texto}</span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {!empresa && `${e.nome} · `}
                    {f.codigo} · {f.detalhe}
                  </span>
                </span>
                <Badge variant={f.bola === 'cliente' ? 'outline' : 'destaque'}>{f.bola === 'cliente' ? 'com o cliente' : 'conosco'}</Badge>
                <span className="text-muted-foreground w-20 text-right text-xs">{f.prazo}</span>
                {f.bola === 'bpo' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setFeitos((xs) => [...xs, f.id])
                      loja.registrar(usuario.nome, `BPO · ${e.nome}: ${f.texto} (resolvido)`)
                      loja.toast(`Resolvido: ${f.texto}`)
                    }}
                  >
                    <CheckIcon /> Resolvido
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => (loja.registrar(usuario.nome, `BPO · lembrete ao cliente ${e.nome}: ${f.texto}`), loja.toast(`Lembrete enviado pelo app e WhatsApp: ${f.texto}`))}
                  >
                    <BellRingingIcon /> Lembrar
                  </Button>
                )}
                <BotaoErp e={e} oque={f.texto} />
              </li>
            )
          })}
        </ul>
      </Caixa>
    </PaginaBpo>
  )
}

const categoriasBpo = ['Vendas no cartão', 'Mercadoria para revenda', 'Matéria-prima', 'Fornecedor eventual', 'Ocupação', 'Energia', 'Software', 'Tarifas bancárias', 'Retirada dos sócios']

/**
 * BPO › Rotinas (10, 3.3): o checklist diário, semanal e mensal de cada
 * empresa, a conciliação do dia e o calendário único da empresa, com uma cor
 * por pacote (as obrigações da contabilidade e as rotinas do BPO juntas).
 */
export function RotinasBpoTela({ empresa, onEscolher }: PropsBpo) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const { integrante } = useTema()
  const abrir = useAbrirErp()
  const [marcadas, setMarcadas] = usePersistente<Record<string, boolean>>('bpo.op.marcadas', {})
  const [transacoes, setTransacoes] = usePersistente<Record<string, EmpresaBpo['transacoes']>>('bpo.op.transacoes', {})
  const lista = empresa ? [empresa] : empresasBpo
  const feita = (e: EmpresaBpo, id: string) => marcadas[`${e.clienteId}-${id}`] ?? e.rotinas.find((r) => r.id === id)?.feita
  const corContabil = integrante('contabil').cor
  const corBpo = integrante('bpo_financeiro').cor
  const pendentes = (e: EmpresaBpo) => transacoes[e.clienteId] ?? e.transacoes

  return (
    <PaginaBpo>
      <CabecalhoBpo integrante="i-bpo-conciliacao" titulo="Rotinas" sub={empresa ? `${empresa.nome} · checklist do dia, conciliação e calendário` : 'O dia de cada empresa: o que já foi feito e o que falta'}>
        {empresa && (
          <>
            <SeloTitular titular={titularDe(empresa)} />
            <SeloErp e={empresa} />
          </>
        )}
      </CabecalhoBpo>

      {empresa && (
        <Caixa>
          <TituloBloco descricao="Obrigações da contabilidade e rotinas do BPO no mesmo calendário, com uma cor por pacote.">Calendário da empresa</TituloBloco>
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {empresa.contabil && (
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: corContabil }} /> contabilidade
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: corBpo }} /> BPO financeiro
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {diasSemana.map((d, i) => {
              const itens = [
                ...(empresa.contabil ? agenda.filter((a) => a.dia === d.dia && ['fiscal', 'dp', 'contabil'].includes(a.setor)).map((a) => ({ id: a.id, t: a.titulo, cor: corContabil, c: a.codigo })) : []),
                { id: `b-pg-${d.dia}`, t: 'Lote de pagamento', cor: corBpo, c: 'FIN-201' },
                { id: `b-cc-${d.dia}`, t: 'Conciliação', cor: corBpo, c: 'FIN-004' },
                ...(i === 0 ? [{ id: 'b-prev', t: 'Previsão de caixa', cor: corBpo, c: 'FIN-005' }] : []),
              ]
              return (
                <div key={d.dia} className={cn('bg-sunken/50 flex min-w-0 flex-col gap-1 rounded-[12px] p-1.5', d.dia === 18 && 'ring-foreground/20 ring-1')}>
                  <span className="text-muted-foreground px-0.5 text-[11px]">
                    {d.rotulo} {d.dia}
                  </span>
                  {itens.map((x) => (
                    <Tooltip key={x.id} conteudo={`${x.c} · ${x.t}`}>
                      <span className="bg-surface flex min-w-0 items-center gap-1 rounded-[6px] px-1 py-0.5 text-[11px]">
                        <span className="size-1.5 shrink-0 rounded-full" style={{ background: x.cor }} />
                        <span className="truncate">{x.t}</span>
                      </span>
                    </Tooltip>
                  ))}
                </div>
              )
            })}
          </div>
        </Caixa>
      )}

      <div className={cn('grid gap-4', !empresa && 'md:grid-cols-2 xl:grid-cols-3')}>
        {empresa && (
          <Caixa>
            <TituloBloco descricao="O extrato do dia contra o espelho do ERP; confirmar ensina o integrante.">Conciliação do dia</TituloBloco>
            <PendentesConciliacao
              transacoes={pendentes(empresa)}
              categorias={categoriasBpo}
              onConfirmar={(id, cat) => {
                const t = pendentes(empresa).find((x) => x.id === id)
                setTransacoes((m) => ({ ...m, [empresa.clienteId]: pendentes(empresa).filter((x) => x.id !== id) }))
                loja.registrar(usuario.nome, `BPO · ${empresa.nome}: conciliou ${t?.descricao} como ${cat}`)
              }}
              onAceitarSeguras={() => {
                setTransacoes((m) => ({ ...m, [empresa.clienteId]: pendentes(empresa).filter((x) => x.confianca !== 'alta') }))
                loja.toast('Sugestões seguras aceitas; o espelho do ERP recebe as baixas')
              }}
              abrirExterno={{ rotulo: empresa.erp.modo === 'E3' ? 'Abrir no livro próprio' : `Abrir no ${empresa.erp.provedor}`, onAbrir: (t) => abrir(empresa, t.descricao) }}
            />
          </Caixa>
        )}
        {lista.map((e) => {
          const feitas = e.rotinas.filter((r) => feita(e, r.id)).length
          return (
            <Caixa key={e.clienteId}>
              <TituloBloco
                descricao={`${feitas} de ${e.rotinas.length} feitas · ${e.analista}`}
                acao={
                  !empresa && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onEscolher(e.clienteId, 'rotinas')}>
                      Abrir
                    </Button>
                  )
                }
              >
                {empresa ? 'Checklist' : e.nome}
              </TituloBloco>
              <ul className={cn('flex flex-col gap-1', empresa && 'sm:grid sm:grid-cols-2')}>
                {e.rotinas.map((r) => (
                  <li key={r.id}>
                    <label className="hover:bg-raised/50 flex cursor-pointer items-start gap-2.5 rounded-[10px] px-1.5 py-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={!!feita(e, r.id)}
                        onChange={(ev) => {
                          setMarcadas((m) => ({ ...m, [`${e.clienteId}-${r.id}`]: ev.target.checked }))
                          if (ev.target.checked) loja.registrar(usuario.nome, `BPO · ${e.nome}: ${r.nome} (${r.codigo})`)
                        }}
                        className="accent-foreground mt-0.5 size-4 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block', feita(e, r.id) && 'text-muted-foreground line-through')}>{r.nome}</span>
                        <span className="text-muted-foreground block text-xs">
                          {r.cadencia} · {r.quando} · {r.codigo}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </Caixa>
          )
        })}
      </div>
    </PaginaBpo>
  )
}
