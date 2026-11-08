import { CurrencyCircleDollarIcon, SparkleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { Interruptor } from '@/components/ui/formulario'
import { custoHora as custoInicial, custoHoraPacoteBpo, mesesCurtos, rentabilidade, rentabilidadeBpo, rentabilidadePorPacote } from '@/dados/timesheet'
import { empresasBpo } from '@/dados/bpo'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { ProporReajuste } from './acoes'
import { Caixa, CabecalhoTs, Numero, usePacote } from './comum'
import { CustoHora } from './configuracao'
import { Barras, Divergente, Linha12, Pergunta } from './graficos'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/**
 * Timesheet › Rentabilidade (05, 8.4; Administrador): custo do cliente = horas ×
 * custo-hora do escritório + variáveis (agentes, serviços). Margem por cliente
 * em barras divergentes, a evolução de 12 meses com marcos e o reajuste.
 * Cliente sem contrato mostra honorário "não informado", nunca zero.
 */
export function RentabilidadeTela({ papel, clienteNome }: { papel: 'gestor' | 'admin'; clienteNome?: string }) {
  const [custoHora, setCustoHora] = usePersistente('ts.custoHora', custoInicial.valor)
  const [soMedidas, setSoMedidas] = useState(false)
  const [sel, setSel] = useState(clienteNome && rentabilidade.some((r) => r.cliente === clienteNome) ? clienteNome : 'Loja Bela Vista Eireli')
  const [editandoCusto, setEditandoCusto] = useState(false)
  const [reajuste, setReajuste] = useState(false)
  const [cartao, setCartao] = useState<string | null>(null)

  // Só medidas e confirmadas: tira ~12% das horas (as estimadas), como no 05, P12.
  const fator = soMedidas ? 0.88 : 1
  const { pacote, chip } = usePacote()
  const loja = useLoja()
  // O custo-hora é o do escritório (todos os pacotes); o do pacote só com a opção ligada no Timesheet › Configurar.
  const custoBpo = loja.estado.custoPorPacote ? custoHoraPacoteBpo : custoHora
  const bpo = rentabilidadeBpo(empresasBpo.map((e) => ({ nome: e.nome, horasMes: e.horasMes, honorarioBpo: e.honorarioBpo })))
  const base = rentabilidadePorPacote(pacote, bpo)
  const linhas = base.map((r) => {
    const horas = Math.round(r.horas * fator * 10) / 10
    const hBpo = r.porSetor.filter((x) => x.setor === 'BPO').reduce((t, x) => t + x.h, 0) * fator
    const custo = (horas - hBpo) * custoHora + hBpo * custoBpo + r.variaveis
    const margem = r.honorario != null ? r.honorario - custo : undefined
    return { ...r, horas, custo, margem, pct: r.honorario ? Math.round(((margem ?? 0) / r.honorario) * 100) : undefined }
  })
  const comContrato = linhas.filter((l) => l.margem != null)
  const honorarios = comContrato.reduce((s, l) => s + l.honorario!, 0)
  const custoTotal = comContrato.reduce((s, l) => s + l.custo, 0)
  const deficit = comContrato.filter((l) => l.margem! < 0)
  const atual = linhas.find((l) => l.cliente === sel) ?? linhas[0]

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoTs
          titulo="Rentabilidade"
          sub={`Outubro · horas medidas × custo-hora do escritório (todos os pacotes)${loja.estado.custoPorPacote ? `; BPO com o custo-hora do pacote, ${brl(custoHoraPacoteBpo)}` : ''}, contra o honorário do contrato vigente`}
          papel={papel}
        >
          {chip}
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditandoCusto(true)} disabled={papel !== 'admin'}>
            <CurrencyCircleDollarIcon /> Custo-hora: {brl(custoHora)}
          </Button>
        </CabecalhoTs>

        <Caixa>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Numero valor={brl(honorarios)} rotulo="honorários da carteira no mês" />
            <Numero valor={brl(custoTotal)} rotulo="custo medido" />
            <Numero valor={`${Math.round(((honorarios - custoTotal) / honorarios) * 100)}%`.replace('-', '−')} rotulo="margem" />
            <Numero valor={deficit.length} rotulo={deficit.length === 1 ? 'cliente com prejuízo no mês' : 'clientes com prejuízo no mês'} detalhe="margem negativa em 2 dos últimos 3 meses" />
          </div>
          <Interruptor ligado={soMedidas} onMudar={setSoMedidas} rotulo="Só horas medidas e confirmadas" detalhe="Tira as estimadas. A diferença mostra o quanto a captura ainda falha." />
        </Caixa>

        <Caixa>
          <Pergunta acao={<span className="text-muted-foreground text-xs">clique num cliente para ver o detalhe</span>}>Quais clientes dão prejuízo?</Pergunta>
          <Divergente
            dados={[...comContrato].sort((a, b) => a.margem! - b.margem!).map((l) => ({ nome: l.cliente, valor: Math.round(l.margem!), pct: l.pct!, detalhe: `${l.horas} h · hon. ${brl(l.honorario!)}` }))}
            selecionado={sel}
            onSelecionar={setSel}
          />
          {linhas.some((l) => l.margem == null) && (
            <p className="text-muted-foreground text-xs">
              Sem contrato estruturado (honorário não informado):{' '}
              {linhas
                .filter((l) => l.margem == null)
                .map((l) => `${l.cliente}, ${l.horas} h`)
                .join('; ')}
              .
            </p>
          )}
        </Caixa>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Caixa>
            <Pergunta
              acao={
                <Button size="sm" className="rounded-full" onClick={() => setReajuste(true)}>
                  <SparkleIcon /> Propor reajuste
                </Button>
              }
            >
              {sel}: a margem está piorando?
            </Pergunta>
            {atual.serie.length ? (
              <Linha12 valores={atual.serie} rotulos={mesesCurtos} marcos={atual.marcos} />
            ) : (
              <p className="text-muted-foreground py-8 text-center text-sm">{atual.honorario ? 'Sem histórico de margem: o BPO começou neste semestre.' : 'Sem histórico de margem: honorário não informado.'}</p>
            )}
            <p className="text-muted-foreground text-xs">Margem % mês a mês. Pontos em destaque: marcos (reajuste, mudança de regime, faixa estourada, admissões).</p>
            {atual.serie.length > 0 && (
              <div className="grid grid-cols-3 gap-3 border-t pt-3">
                <Numero valor={`${Math.round(atual.serie.reduce((s, v) => s + v, 0) / atual.serie.length)}%`.replace('-', '−')} rotulo="margem média em 12 meses" />
                <Numero valor={`${Math.min(...atual.serie)}%`.replace('-', '−')} rotulo={`pior mês (${mesesCurtos[atual.serie.indexOf(Math.min(...atual.serie))]})`} />
                <Numero valor={`${atual.horas} h`} rotulo="horas medidas em outubro" />
              </div>
            )}
            {cartao && <p className="bg-success/10 rounded-[14px] px-3 py-2 text-sm">{cartao}</p>}
          </Caixa>
          <div className="flex flex-col gap-4">
            <Caixa>
              <Pergunta>De onde vem o custo?</Pergunta>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-sunken/60 rounded-[12px] px-3 py-2">
                  <dt className="text-muted-foreground text-[11px]">Horas × custo-hora</dt>
                  <dd className="font-medium tabular-nums">
                    {atual.horas} h × {brl(custoHora)}
                  </dd>
                </div>
                <div className="bg-sunken/60 rounded-[12px] px-3 py-2">
                  <dt className="text-muted-foreground text-[11px]">Variáveis (agentes, serviços)</dt>
                  <dd className="font-medium tabular-nums">{brl(atual.variaveis)}</dd>
                </div>
                <div className="bg-sunken/60 rounded-[12px] px-3 py-2">
                  <dt className="text-muted-foreground text-[11px]">Custo do mês</dt>
                  <dd className="font-medium tabular-nums">{brl(atual.custo)}</dd>
                </div>
                <div className="bg-sunken/60 rounded-[12px] px-3 py-2">
                  <dt className="text-muted-foreground text-[11px]">Honorário</dt>
                  <dd className="font-medium tabular-nums">{atual.honorario ? brl(atual.honorario) : 'não informado'}</dd>
                </div>
              </dl>
            </Caixa>
            <Caixa>
              <Pergunta>Em que setores foram as horas?</Pergunta>
              <Barras dados={atual.porSetor.map((p) => ({ nome: p.setor, h: p.h }))} />
            </Caixa>
          </div>
        </div>
      </div>

      {editandoCusto && (
        <CustoHora
          onFechar={() => setEditandoCusto(false)}
          onSalvar={(v) => {
            setCustoHora(v)
            setEditandoCusto(false)
          }}
        />
      )}
      {reajuste && (
        <ProporReajuste
          r={atual}
          custoHora={custoHora}
          onFechar={() => setReajuste(false)}
          onCriar={() => {
            setCartao(`Cartão criado para o integrante de Gestão: proposta de reajuste de ${sel}. Você revisa antes de ir ao cliente.`)
            setReajuste(false)
          }}
        />
      )}
    </AreaRolagem>
  )
}
