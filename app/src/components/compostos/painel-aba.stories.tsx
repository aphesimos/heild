import type { Meta, StoryObj } from '@storybook/react-vite'
import * as d from '@/dados/exemplo'
import { abasPainel } from '@/dados/painel'
import { dimensoes, type TamanhoWidget } from '@/components/widgets/tipos'
import { Widget } from '@/components/widgets/widget'
import { widgetsComuns } from '@/telas/painel/comuns'
import { CabecalhoAba, MedidorSublimite } from './painel-aba'

const meta: Meta = { title: 'Compostos/Painel (anatomia da aba)' }
export default meta

const fiscal = abasPainel.find((a) => a.id === 'fiscal')!

export const Cabecalho: StoryObj = {
  name: 'A · Cabeçalho',
  render: () => (
    <CabecalhoAba titulo={fiscal.rotulo} cliente="420 - Metalúrgica Andrade Ltda · Lucro Presumido" perfil={fiscal.perfil} vigencia={fiscal.vigencia} integrante={d.integrantes.find((i) => i.id === 'i-fiscal')} statusIntegrante={fiscal.statusIntegrante} faixa="Divergência com a Receita: endereço diferente do cadastro. Versionar com os dados da Receita?" />
  ),
}
const ctx = (carteira = false) => ({ aba: fiscal, cliente: carteira ? undefined : d.clientes[0], clientesNaCarteira: 6, tarefas: d.tarefas, integrante: d.integrantes.find((i) => i.id === 'i-fiscal') })
const comum = (id: string, tamanho: TamanhoWidget, carteira = false) => () => {
  const def = widgetsComuns(ctx(carteira)).find((w) => w.id === id)!
  const dim = dimensoes[tamanho]
  return (
    <div style={{ width: dim.colunas * 180 + (dim.colunas - 1) * 16, height: `calc(${dim.linhas} * var(--celula-widget) + ${(dim.linhas - 1) * 16}px)` }}>
      <Widget def={def} tamanho={tamanho} />
    </div>
  )
}

export const Pendencias: StoryObj = { name: 'B · Pendências', render: comum('pendencias', 'G') }
export const Documentos: StoryObj = { name: 'D · Documentos', render: comum('documentos', 'XL') }
export const Acoes: StoryObj = { name: 'E · Ações (nível no rótulo)', render: comum('acoes', 'G') }
export const AcoesCarteira: StoryObj = { name: 'E · Ações em carteira', render: comum('acoes', 'L', true) }
export const Tarefas: StoryObj = { name: 'F · Tarefas deste setor', render: comum('tarefas', 'XL') }
export const Relatorios: StoryObj = { name: 'G · Relatórios', render: comum('relatorios', 'G') }
export const Sublimite: StoryObj = {
  name: 'Medidor de sublimite',
  render: () => (
    <div className="flex max-w-xl flex-col gap-6">
      <MedidorSublimite rotulo="Receita 12 meses × sublimite" usado={1800000} teto={3600000} />
      <MedidorSublimite rotulo="Receita 12 meses × sublimite" usado={3240000} teto={3600000} />
    </div>
  ),
}
