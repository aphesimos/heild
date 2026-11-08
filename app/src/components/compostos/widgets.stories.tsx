import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartBarIcon, ClockCounterClockwiseIcon, PaperPlaneTiltIcon } from '@phosphor-icons/react'
import * as d from '@/dados/exemplo'
import { GradeWidgets } from '@/components/widgets/grade'
import { dimensoes, type DefWidget, type TamanhoWidget } from '@/components/widgets/tipos'
import { Widget } from '@/components/widgets/widget'
import { AvisoCompacto } from './aviso-compacto'
import { CalendarioSemana, ConteudoIndicador, LinhaDoTempo, PendenciasClientes } from './widgets'

const meta: Meta = {
  title: 'Compostos/Widgets',
  decorators: [(S) => <div className="from-background to-background-end min-h-dvh bg-gradient-to-b p-6"><S /></div>],
  parameters: { layout: 'fullscreen' },
}
export default meta

const kpi: DefWidget = { id: 'k', titulo: d.indicadores[0].rotulo, descricao: '', icone: ChartBarIcon, tamanhos: ['P', 'M'], conteudo: () => <ConteudoIndicador indicador={d.indicadores[0]} /> }
const linha: DefWidget = { id: 'l', titulo: 'Linha do tempo', descricao: '', icone: ClockCounterClockwiseIcon, tamanhos: ['G', 'L'], conteudo: () => <LinhaDoTempo itens={d.linhaDoTempo} /> }

/** Os cinco tamanhos, na mesma célula de 156 px: P 1×1, M 2×1, G 2×2, L 4×1, XL 4×2. */
export const Tamanhos: StoryObj = {
  render: () => (
    <div className="grid grid-flow-row-dense grid-cols-6 gap-4" style={{ gridAutoRows: 'var(--celula-widget)' }}>
      {(['P', 'M', 'G', 'L', 'XL'] as TamanhoWidget[]).map((t) => (
        <div key={t} style={{ gridColumn: `span ${dimensoes[t].colunas}`, gridRow: `span ${dimensoes[t].linhas}` }}>
          <Widget def={{ ...linha, titulo: `${t} · ${dimensoes[t].rotulo}` }} tamanho={t} />
        </div>
      ))}
    </div>
  ),
}

export const ModoEdicao: StoryObj = {
  name: 'Modo edição (uma caixa)',
  render: () => (
    <div className="grid grid-cols-6 gap-4" style={{ gridAutoRows: 'var(--celula-widget)' }}>
      <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
        <Widget def={linha} tamanho="G" editando />
      </div>
      <div>
        <Widget def={kpi} tamanho="P" editando />
      </div>
    </div>
  ),
}

/** Grade completa personalizável: clique em "Editar painel" (ou segure um widget). */
export const Grade: StoryObj = {
  render: () => (
    <GradeWidgets
      chave="story-grade"
      titulo={<h2 className="text-xl font-light">Grade de exemplo</h2>}
      catalogo={[
        ...d.indicadores.map<DefWidget>((i) => ({ id: i.id, titulo: i.rotulo, descricao: i.rotulo, icone: ChartBarIcon, tamanhos: ['P', 'M'], conteudo: () => <ConteudoIndicador indicador={i} /> })),
        { id: 'cal', titulo: 'Calendário da semana', descricao: 'Semana', tamanhos: ['G', 'XL'], conteudo: () => <CalendarioSemana dias={d.diasSemana} itens={d.agenda} hoje={18} /> },
        { id: 'pend', titulo: 'Pendências por cliente', descricao: 'Pendências', icone: PaperPlaneTiltIcon, tamanhos: ['G', 'L'], conteudo: () => <PendenciasClientes itens={d.pendencias} /> },
        { id: 'av', titulo: 'Avisos', descricao: 'Avisos', tamanhos: ['G'], conteudo: () => <div className="flex flex-col gap-2">{d.avisos.map((a) => <AvisoCompacto key={a.id} aviso={a} />)}</div> },
        linha,
      ]}
      padrao={[
        { id: 'i1', tamanho: 'P' },
        { id: 'i2', tamanho: 'P' },
        { id: 'i3', tamanho: 'M' },
        { id: 'cal', tamanho: 'XL' },
        { id: 'pend', tamanho: 'G' },
        { id: 'av', tamanho: 'G' },
        { id: 'l', tamanho: 'G' },
      ]}
    />
  ),
}
