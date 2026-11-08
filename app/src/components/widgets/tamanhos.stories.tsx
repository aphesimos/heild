import type { Meta, StoryObj } from '@storybook/react-vite'
import * as exemplo from '@/dados/exemplo'
import { abasPainel } from '@/dados/painel'
import { gradePainel } from '@/telas/PainelTela'
import { catalogoVisaoGeral } from '@/telas/VisaoGeralTela'
import { dimensoes, type DefWidget } from './tipos'
import { Widget } from './widget'

/**
 * Cada widget em cada tamanho que ele aceita, com a largura real de coluna do
 * Painel no computador (grade de 6 colunas em 1152 px: célula de 178 px, vão
 * de 16 px). Serve para conferir à vista e para o teste automático de corte.
 */
const meta: Meta = { title: 'Widgets/Todos os tamanhos', parameters: { layout: 'fullscreen' } }
export default meta

const CELULA = 178
const VAO = 16

function Catalogo({ defs }: { defs: DefWidget[] }) {
  return (
    <div className="from-background to-background-end flex min-h-dvh flex-col gap-8 bg-gradient-to-b p-6">
      {defs.map((def) => (
        <section key={def.id} className="flex flex-col gap-2">
          <h2 className="text-muted-foreground text-xs">
            {def.titulo} · <code>{def.id}</code>
          </h2>
          <div className="flex flex-wrap items-start gap-4">
            {def.tamanhos.map((t) => {
              const d = dimensoes[t]
              return (
                <div key={t} className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-[11px]">
                    {t} · {d.rotulo}
                  </span>
                  <div data-medida={`${def.id}:${t}`} style={{ width: d.colunas * CELULA + (d.colunas - 1) * VAO, height: `calc(${d.linhas} * var(--celula-widget) + ${(d.linhas - 1) * VAO}px)` }}>
                    <Widget def={def} tamanho={t} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

const dadosVisao = {
  indicadores: exemplo.indicadores,
  progressoMes: exemplo.progressoMes,
  avisos: exemplo.avisos,
  dias: exemplo.diasSemana,
  agenda: exemplo.agenda,
  hoje: 18,
  pendencias: exemplo.pendencias,
  linhaDoTempo: exemplo.linhaDoTempo,
  integrantes: exemplo.integrantes,
}

export const VisaoGeral: StoryObj = { name: 'Visão geral', render: () => <Catalogo defs={catalogoVisaoGeral(dadosVisao, exemplo.clientes[0].nome)} /> }

const aba = (id: string, carteira = false) => () => {
  const a = abasPainel.find((x) => x.id === id)!
  const { catalogo } = gradePainel({
    aba: a,
    cliente: carteira ? undefined : id === 'fiscal' ? exemplo.clientes[1] : exemplo.clientes[0],
    clientesNaCarteira: exemplo.clientes.length,
    tarefas: exemplo.tarefas,
    integrante: exemplo.integrantes.find((i) => i.setor === a.setor),
  })
  return <Catalogo defs={catalogo} />
}

export const Societario: StoryObj = { name: 'Painel · Societário', render: aba('societario') }
export const Obrigacoes: StoryObj = { name: 'Painel · Obrigações', render: aba('obrigacoes') }
export const Notas: StoryObj = { name: 'Painel · Notas', render: aba('notas') }
export const Fiscal: StoryObj = { name: 'Painel · Fiscal (Simples)', render: aba('fiscal') }
export const DP: StoryObj = { name: 'Painel · DP', render: aba('dp') }
export const Contabil: StoryObj = { name: 'Painel · Contábil', render: aba('contabil') }
export const Consultoria: StoryObj = { name: 'Painel · Consultoria', render: aba('consultoria') }
export const Gestao: StoryObj = { name: 'Painel · Gestão', render: aba('gestao') }
export const Carteiras: StoryObj = {
  name: 'Painel · visões de carteira',
  render: () => {
    const defs = ['societario', 'obrigacoes', 'notas', 'fiscal', 'dp', 'contabil', 'consultoria'].flatMap((id) => {
      const a = abasPainel.find((x) => x.id === id)!
      return gradePainel({ aba: a, clientesNaCarteira: 6, tarefas: exemplo.tarefas }).catalogo.filter((w) => w.id.startsWith('carteira-') || ['acoes', 'guias', 'riscos', 'prerequisitos', 'prorrogacoes', 'manifestacao'].includes(w.id)).map((w) => ({ ...w, id: `${id}/${w.id}` }))
    })
    return <Catalogo defs={defs} />
  },
}
