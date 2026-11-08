import { EnvelopeSimpleIcon, GearSixIcon, PlusIcon, ReceiptIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { GavetaFormulario } from '@/components/ui/formulario'
import { alcadas, capturaContas, contasPagar as contasIniciais, limiteAprovacao, titularEscritorio, type ContaPagar } from '@/dados/financeiro'
import { brl, CabecalhoFin, Caixa, TituloBloco } from './comum'
import { CapturarConta } from './CaixaTela'
import { Alcadas } from './configuracao'
import { FilaContasPagar, SeloTitular } from './pecas'

/** Até quanto a conta atual aprova (Configurar › Alçadas). */
export function useLimiteAprovacao() {
  const { usuario, permissoes } = useSessao()
  if (usuario.papel === 'administrador') return limiteAprovacao.administrador
  return permissoes.gere.includes('financeiro_escritorio') ? limiteAprovacao.gestor : 0
}

/**
 * Financeiro › Contas a pagar (FIN-003; 09, 6.1 e 10.5): a fila por estado, os
 * vencimentos da semana, as duplicidades e fornecedores novos que o integrante
 * apontou, e a alçada de cada conta. Aprovar agenda no banco; a liberação final
 * é sempre de uma pessoa, com o token do banco. O integrante nunca paga.
 */
export function ContasPagarTela() {
  const loja = useLoja()
  const { usuario } = useSessao()
  const limite = useLimiteAprovacao()
  const [contas, setContas] = usePersistente('fin.pagar', contasIniciais)
  const [modal, setModal] = useState<'capturar' | 'alcadas' | ContaPagar | null>(null)
  const semana = contas.filter((c) => c.situacao !== 'paga' && ['18/11', '19/11', '20/11', '22/11', '23/11', '24/11'].includes(c.vencimento))
  const aAprovar = contas.filter((c) => c.situacao === 'a_aprovar')

  const aprovar = (ids: string[]) => {
    const total = contas.filter((c) => ids.includes(c.id)).reduce((s, c) => s + c.valor, 0)
    setContas((xs) => xs.map((c) => (ids.includes(c.id) ? { ...c, situacao: 'agendada' } : c)))
    loja.registrar(usuario.nome, `Aprovou e agendou ${ids.length} conta(s) a pagar · ${brl(total, true)} (FIN-003)`)
    loja.toast(`${ids.length} ${ids.length === 1 ? 'conta agendada' : 'contas agendadas'} no Itaú. A liberação final sai no banco, com o seu token.`)
  }

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin
          titulo="Contas a pagar"
          status={`Capturei 5 contas novas hoje (DDA e e-mail); ${aAprovar.length} esperam aprovação, 2 com alerta`}
          sub={`${aAprovar.length} a aprovar · ${brl(
            aAprovar.reduce((s, c) => s + c.valor, 0),
            true,
          )} · aprovar agenda; pagar é no banco`}
        >
          <SeloTitular titular={titularEscritorio} />
          <Button size="sm" className="rounded-full" onClick={() => setModal('capturar')}>
            <PlusIcon /> Conta a pagar
          </Button>
        </CabecalhoFin>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Caixa>
            <TituloBloco
              descricao={
                limite === Infinity ? 'Você aprova qualquer valor.' : limite > 0 ? `Você aprova até ${brl(limite)}; acima disso, o cartão vai ao Administrador.` : 'Você vê a fila; aprovar é do Gestor do Financeiro e do Administrador.'
              }
            >
              Fila por estado
            </TituloBloco>
            <FilaContasPagar
              contas={contas}
              limite={limite}
              onAprovar={aprovar}
              onPedir={(c) => {
                if (c.alerta) return setModal(c)
                loja.avisar({
                  para: ['u1'],
                  tipo: 'cartao',
                  setor: 'financeiro_escritorio',
                  titulo: `Aprovar pagamento: ${c.fornecedor}`,
                  detalhe: `${brl(c.valor, true)} · vence ${c.vencimento} · pedido por ${usuario.nome}`,
                  destino: { modulo: 'financeiro', aba: 'pagar' },
                })
                loja.registrar(usuario.nome, `Pediu aprovação de ${c.fornecedor} (${brl(c.valor, true)}) ao Administrador`)
                loja.toast(`Pedido de aprovação enviado ao Administrador: ${c.fornecedor}.`)
              }}
            />
          </Caixa>
          <div className="flex flex-col gap-4">
            <Caixa>
              <TituloBloco>Vencem esta semana</TituloBloco>
              <ul className="flex flex-col gap-1.5">
                {semana.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-11 shrink-0 text-xs tabular-nums">{c.vencimento}</span>
                    <span className="min-w-0 flex-1 truncate">{c.fornecedor}</span>
                    <span className="tabular-nums">{brl(c.valor, true)}</span>
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa>
              <TituloBloco descricao="O integrante lê, classifica e checa duplicidade; você só aprova.">Chegam sozinhas</TituloBloco>
              <ul className="flex flex-col gap-2">
                {capturaContas.map((f) => (
                  <li key={f.fonte} className="flex items-start gap-2 text-sm">
                    {f.fonte.includes('@') ? <EnvelopeSimpleIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" /> : <ReceiptIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{f.fonte}</span>
                      <span className="text-muted-foreground block text-xs">
                        {f.detalhe} · {f.ultima}
                        {f.novas ? ` · ${f.novas} novas` : ''}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa className="flex-1">
              <TituloBloco
                acao={
                  usuario.papel === 'administrador' && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('alcadas')}>
                      <GearSixIcon /> Editar
                    </Button>
                  )
                }
              >
                Alçadas
              </TituloBloco>
              <ul className="flex flex-col gap-1.5 text-sm">
                {alcadas.map((a) => (
                  <li key={a.ate} className="flex gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">{a.ate === 'acima' ? 'acima disso' : `até ${a.ate}`}</span>
                    <span>{a.quem}</span>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
        </div>
      </div>

      {modal === 'capturar' && (
        <CapturarConta
          onFechar={() => setModal(null)}
          onSalvar={(c) => {
            setContas((xs) => [c, ...xs])
            loja.registrar(usuario.nome, `Lançou a conta ${c.fornecedor} (${brl(c.valor, true)})`)
            setModal(null)
          }}
        />
      )}
      {modal === 'alcadas' && <Alcadas onFechar={() => setModal(null)} />}
      {modal && typeof modal === 'object' && (
        <GavetaFormulario
          aberta
          onFechar={() => setModal(null)}
          titulo={`Conferir · ${modal.fornecedor}`}
          descricao={`${brl(modal.valor, true)} · vence ${modal.vencimento} · via ${modal.origem}`}
          acao="É legítima: liberar para aprovar"
          onAcao={() => {
            setContas((xs) => xs.map((c) => (c.id === modal.id ? { ...c, alerta: undefined } : c)))
            loja.registrar(usuario.nome, `Conferiu e liberou ${modal.fornecedor} para aprovação`)
            setModal(null)
          }}
          secundaria={
            <Button
              type="button"
              variant="ghost"
              className="text-destructive rounded-full"
              onClick={() => {
                setContas((xs) => xs.filter((c) => c.id !== modal.id))
                loja.registrar(usuario.nome, `Descartou ${modal.fornecedor} (${modal.alerta})`)
                loja.toast('Conta descartada; o integrante não traz mais este boleto.')
                setModal(null)
              }}
            >
              Descartar
            </Button>
          }
        >
          <p className="bg-warning/10 rounded-[14px] px-3 py-2 text-sm">{modal.alerta}</p>
          <p className="text-muted-foreground text-sm">Fornecedor novo ou boleto parecido com outro é o golpe mais comum em contas a pagar. Confira o CNPJ do beneficiário no boleto antes de liberar.</p>
        </GavetaFormulario>
      )}
    </AreaRolagem>
  )
}
