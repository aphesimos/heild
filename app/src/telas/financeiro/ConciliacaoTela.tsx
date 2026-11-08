import { ArrowsClockwiseIcon, BankIcon, CheckIcon, FileArrowUpIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { conciliacaoResumo, consentimentosOpenFinance, divergencias as divergenciasIniciais, planoContas, regrasPropostas, titularEscritorio, transacoesConciliar } from '@/dados/financeiro'
import { brl, CabecalhoFin, Caixa, Numero, TituloBloco } from './comum'
import { ConectarConta } from './configuracao'
import { PendentesConciliacao, SeloTitular } from './pecas'

const categorias = planoContas.flatMap((g) => g.categorias)

/**
 * Financeiro › Conciliação (FIN-004; 09, 6.2 e 10.5): o integrante casa sozinho
 * o que bate com cobrança, conta agendada, transferência ou regra aprovada; para
 * a pessoa sobra o que precisa de juízo: valor diferente, pagador desconhecido,
 * lançamento sem documento, divergência de saldo. Regra nova só vale aprovada.
 */
export function ConciliacaoTela() {
  const loja = useLoja()
  const { usuario } = useSessao()
  const [pendentes, setPendentes] = usePersistente('fin.conc.pendentes', transacoesConciliar)
  const [regras, setRegras] = usePersistente('fin.conc.regras', regrasPropostas)
  const [divergencias, setDivergencias] = usePersistente('fin.conc.divergencias', divergenciasIniciais)
  const [conectar, setConectar] = useState(false)
  const r = conciliacaoResumo
  const feito = (texto: string) => {
    loja.registrar(usuario.nome, texto)
    loja.toast(texto)
  }

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin
          titulo="Conciliação"
          status={`Concilei ${r.automaticos} de ${r.lancamentos} lançamentos sozinho; ${pendentes.length + divergencias.length} precisam de você`}
          sub={`${r.periodo} · Inter por API, Itaú e cartão por Open Finance · atualizado 4 vezes ao dia`}
        >
          <SeloTitular titular={titularEscritorio} />
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => feito('Extrato OFX importado: 38 lançamentos, 36 casados')}>
            <FileArrowUpIcon /> Importar OFX ou CNAB
          </Button>
        </CabecalhoFin>

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Numero valor={`${Math.round((r.automaticos / r.lancamentos) * 100)}%`} rotulo="casados sozinhos" detalhe={`${r.automaticos} de ${r.lancamentos}`} />
            <Numero valor={r.porRegra} rotulo="por regra aprovada" />
            <Numero valor={pendentes.length} rotulo="sem categoria" />
            <Numero valor={divergencias.length} rotulo="divergências" />
            <Numero valor={r.saldoBanco === r.saldoSistema ? 'bate' : 'difere'} rotulo="saldo banco × sistema" detalhe={`Itaú ${brl(r.saldoBanco)}`} />
          </div>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <Caixa>
              <TituloBloco descricao="A sugestão vem do histórico e do plano de contas; confirmar ensina o integrante.">Sem categoria</TituloBloco>
              <PendentesConciliacao
                transacoes={pendentes}
                categorias={categorias}
                onConfirmar={(id, cat) => {
                  const t = pendentes.find((x) => x.id === id)
                  setPendentes((xs) => xs.filter((x) => x.id !== id))
                  loja.registrar(usuario.nome, `Conciliou ${t?.descricao} como ${cat}`)
                }}
                onAceitarSeguras={() => {
                  const n = pendentes.filter((t) => t.confianca === 'alta').length
                  setPendentes((xs) => xs.filter((t) => t.confianca !== 'alta'))
                  feito(`${n} lançamentos conciliados pelas sugestões seguras`)
                }}
              />
            </Caixa>
            <Caixa className="flex-1">
              <TituloBloco descricao="Cada uma é um cartão simples: o integrante diz o que acha e você decide.">Divergências</TituloBloco>
              {divergencias.length === 0 && <p className="text-muted-foreground py-2 text-sm">Nenhuma divergência.</p>}
              <ul className="flex flex-col gap-2">
                {divergencias.map((d) => (
                  <li key={d.id} className="bg-sunken/50 flex flex-col gap-2 rounded-[14px] p-3 text-sm">
                    <span>{d.texto}</span>
                    <span className="text-muted-foreground text-xs">
                      {d.conta} · sugestão: {d.sugestao}
                    </span>
                    <span className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          setDivergencias((xs) => xs.filter((x) => x.id !== d.id))
                          feito(`Divergência resolvida pela sugestão: ${d.sugestao}`)
                        }}
                      >
                        <CheckIcon /> Seguir a sugestão
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                        onClick={() => {
                          setDivergencias((xs) => xs.filter((x) => x.id !== d.id))
                          feito('Divergência virou tarefa para o Financeiro investigar')
                        }}
                      >
                        Investigar depois
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
          <div className="flex flex-col gap-4">
            <Caixa>
              <TituloBloco descricao="Padrão que se repete vira regra; só vale depois de aprovada.">Regras propostas</TituloBloco>
              {regras.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma regra nova.</p>}
              <ul className="flex flex-col gap-2">
                {regras.map((g) => (
                  <li key={g.id} className="flex flex-col gap-1.5 text-sm">
                    <span className="font-mono text-xs">{g.padrao}</span>
                    <span className="text-muted-foreground text-xs">
                      → {g.categoria} · {g.vezes} vezes · {g.exemplo}
                    </span>
                    <span className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setRegras((xs) => xs.filter((x) => x.id !== g.id))
                          feito(`Regra aprovada: ${g.padrao} → ${g.categoria}`)
                        }}
                      >
                        Aprovar regra
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setRegras((xs) => xs.filter((x) => x.id !== g.id))}>
                        Agora não
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
            <Caixa className="flex-1">
              <TituloBloco
                acao={
                  usuario.papel === 'administrador' && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConectar(true)}>
                      <BankIcon /> Conectar
                    </Button>
                  )
                }
                descricao="O consentimento que vence vira tarefa 30 dias antes."
              >
                Open Finance
              </TituloBloco>
              <ul className="flex flex-col gap-2">
                {consentimentosOpenFinance.map((c) => (
                  <li key={c.conta} className="flex items-center gap-2 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{c.conta}</span>
                      <span className={c.dias <= 30 ? 'text-warning-foreground block text-xs' : 'text-muted-foreground block text-xs'}>
                        consentimento até {c.vence} ({c.dias} dias)
                      </span>
                    </span>
                    {c.dias <= 30 && (
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => feito(`Pedido de renovação do consentimento enviado: ${c.conta}`)}>
                        <ArrowsClockwiseIcon /> Renovar
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
        </div>
      </div>
      {conectar && <ConectarConta onFechar={() => setConectar(false)} onConectar={(n) => (setConectar(false), feito(`Conta conectada: ${n}`))} />}
    </AreaRolagem>
  )
}
