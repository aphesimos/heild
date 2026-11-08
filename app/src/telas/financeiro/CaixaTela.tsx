import { BankIcon, FileArrowUpIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { contasBancarias, contasPagar, fluxoCaixa, inicioProjecao, mesesCaixa, planoContas, titularEscritorio, type ContaPagar } from '@/dados/financeiro'
import { Pergunta } from '../timesheet/graficos'
import { brl, CabecalhoFin, Caixa } from './comum'
import { ConectarConta } from './configuracao'
import { FluxoMensal, SaldosContas, SeloTitular, type DadosFluxo } from './pecas'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'

const categorias = planoContas.flatMap((g) => g.categorias)

const dadosFluxo: DadosFluxo = { meses: mesesCaixa, entradas: fluxoCaixa.entradas, saidas: fluxoCaixa.saidas, inicio: inicioProjecao, marcos: fluxoCaixa.marcos }

/** Cenários do simulador "e se" (09, 7.1): mudam as entradas projetadas, em mil por mês. */
const cenarios = [
  { valor: 'base', rotulo: 'Como está', ajuste: 0, texto: 'Contratos vigentes, reajustes agendados, 13º, saídas avisadas e inadimplência de 1,8%.' },
  { valor: 'perde', rotulo: 'Perder 3 clientes', ajuste: -6, texto: 'Saem os 3 maiores com contrato vencendo em março: R$ 6 mil a menos por mês.' },
  { valor: 'ganha', rotulo: '5 clientes novos', ajuste: 7, texto: 'Pelo ticket médio de R$ 1.397, a partir de dezembro.' },
  { valor: 'inad', rotulo: 'Inadimplência 5%', ajuste: -6, texto: 'Se a inadimplência subir de 1,8% para 5% da receita.' },
] as const

/**
 * Financeiro › Fluxo de caixa (FIN-005; 09, 7.1 e 10.5): quanto temos hoje,
 * o realizado e o projetado em 12 meses e o simulador "e se". Contas a pagar
 * e conciliação têm abas próprias.
 */
export function CaixaTela() {
  const loja = useLoja()
  const { usuario } = useSessao()
  const [modal, setModal] = useState<'conta' | null>(null)
  const [bancos, setBancos] = usePersistente('fin.bancos', contasBancarias)
  const [cenario, setCenario] = useState<(typeof cenarios)[number]['valor']>('base')
  const c = cenarios.find((x) => x.valor === cenario)!
  const aPagar30 = contasPagar.filter((x) => x.situacao !== 'paga').reduce((s, x) => s + x.valor, 0)
  const sobra12 = dadosFluxo.entradas.reduce((s, v, i) => s + (i >= inicioProjecao ? v + c.ajuste : 0) - (i >= inicioProjecao ? dadosFluxo.saidas[i] : 0), 0)

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoFin
          titulo="Fluxo de caixa"
          status="Projetei os próximos 7 meses com os contratos, os reajustes e o 13º; dezembro é o mês de folga"
          sub="Saldos de hoje, 18/11 · contas atualizadas 4 vezes ao dia · projeção pelos contratos e pelas contas recorrentes"
        >
          <SeloTitular titular={titularEscritorio} />
        </CabecalhoFin>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <Caixa>
            <Pergunta>Quanto temos?</Pergunta>
            <SaldosContas
              bancos={bancos}
              aPagar30={aPagar30}
              acao={
                usuario.papel === 'administrador' && (
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('conta')}>
                    <BankIcon /> Conectar
                  </Button>
                )
              }
            />
          </Caixa>
          <Caixa>
            <Pergunta>Vai sobrar dinheiro nos próximos meses?</Pergunta>
            <FluxoMensal d={dadosFluxo} ajuste={c.ajuste} />
          </Caixa>
        </div>

        <Caixa>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="flex-1 text-sm font-medium">E se…?</h2>
            <Segmentado rotulo="Cenário" valor={cenario} onMudar={setCenario} opcoes={cenarios.map((x) => ({ valor: x.valor, rotulo: x.rotulo }))} />
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={cenario === 'base'}
              onClick={() => {
                loja.registrar(usuario.nome, `Salvou o cenário de caixa “${c.rotulo}”`)
                loja.toast(`Cenário “${c.rotulo}” salvo; aparece no Resultado como comparação.`)
              }}
            >
              Salvar cenário
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            {c.texto} Sobra projetada de novembro a maio: <strong className="text-foreground font-medium">{brl(sobra12 * 1000)}</strong>.
          </p>
        </Caixa>
      </div>

      {modal === 'conta' && (
        <ConectarConta
          onFechar={() => setModal(null)}
          onConectar={(nome) => {
            setBancos((xs) => [...xs, { id: `b${Date.now()}`, nome, saldo: 12_480, atualizado: 'agora', via: 'Open Finance' }])
            setModal(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

/** Capturar uma conta do escritório (FIN-003): arquivo, código de barras ou à mão. */
export function CapturarConta({ onFechar, onSalvar }: { onFechar: () => void; onSalvar: (c: ContaPagar) => void }) {
  const [como, setComo] = useState<'arquivo' | 'codigo' | 'manual'>('arquivo')
  const [lido, setLido] = useState(false)
  const [fornecedor, setFornecedor] = useState('')
  const [categoria, setCategoria] = useState('Software')
  const [valor, setValor] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [recorrente, setRecorrente] = useState(false)
  const v = Number(valor.replace('.', '').replace(',', '.'))
  const ler = () => {
    setLido(true)
    setFornecedor('CRC-SP · anuidade 2027 (3 contadores)')
    setCategoria('Taxas do CRC')
    setValor('1.926,00')
    setVencimento('31/03')
  }
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Conta a pagar"
      descricao="Boletos do DDA e do e-mail financeiro já chegam sozinhos. Aqui é para o que veio por outro caminho."
      acao="Enviar para aprovação"
      acaoDesabilitada={!fornecedor.trim() || !(v > 0) || !vencimento.trim()}
      onAcao={() =>
        onSalvar({
          id: `cp${Date.now()}`,
          fornecedor: fornecedor.trim(),
          categoria,
          valor: v,
          vencimento,
          origem: recorrente ? 'recorrente' : 'manual',
          situacao: 'a_aprovar',
          alcada: v > 10_000 ? 'acima de R$ 10 mil: Administrador' : 'até R$ 5 mil: Gestor',
        })
      }
    >
      <Campo rotulo="Como">
        {() => (
          <Segmentado
            rotulo="Como"
            valor={como}
            onMudar={setComo}
            opcoes={[
              { valor: 'arquivo', rotulo: 'Boleto ou nota' },
              { valor: 'codigo', rotulo: 'Código de barras' },
              { valor: 'manual', rotulo: 'À mão' },
            ]}
          />
        )}
      </Campo>
      {como === 'arquivo' && (
        <Button type="button" variant="outline" className="w-fit rounded-full" onClick={ler}>
          <FileArrowUpIcon /> {lido ? 'boleto-crc.pdf lido' : 'Enviar arquivo'}
        </Button>
      )}
      {como === 'codigo' && (
        <Campo rotulo="Linha digitável">{(id) => <CampoTexto id={id} valor={lido ? '23793.38128 60000.000003 00000.000400 1 00000000192600' : ''} onMudar={() => ler()} mono placeholder="cole a linha digitável" />}</Campo>
      )}
      <Campo rotulo="Fornecedor e descrição">{(id) => <CampoTexto id={id} valor={fornecedor} onMudar={setFornecedor} />}</Campo>
      <Campo rotulo="Categoria">{(id) => <CampoEscolha id={id} valor={categoria} onMudar={setCategoria} opcoes={categorias.map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Valor (R$)">{(id) => <CampoTexto id={id} valor={valor} onMudar={setValor} placeholder="0,00" />}</Campo>
        <Campo rotulo="Vencimento">{(id) => <CampoTexto id={id} valor={vencimento} onMudar={setVencimento} placeholder="dd/mm" />}</Campo>
      </div>
      <Interruptor ligado={recorrente} onMudar={setRecorrente} rotulo="Repete todo mês" detalhe="Aluguel, software, contador terceirizado: entra sozinha nos próximos meses, sempre para aprovar." />
    </GavetaFormulario>
  )
}
