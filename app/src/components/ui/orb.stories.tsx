import type { Meta, StoryObj } from '@storybook/react-vite'
import { estados, reacaoDoEstado, rotuloDoEstado } from '@/lib/integrante'
import { useTema } from '@/theme/ThemeProvider'
import type { SetorIntegrante } from '@/theme/tipos'
import { Orb } from './orb'

const meta: Meta<typeof Orb> = {
  title: 'Primitivos/Orb',
  component: Orb,
  args: { estado: 'disponivel', cor: '#f7a335', tamanho: 72, modo: 'drift', extras: true, cutucavel: true, animado: true },
  argTypes: {
    estado: { control: 'select', options: estados },
    modo: { control: 'inline-radio', options: ['drift', 'follow', 'wander', 'fixed'] },
    cor: { control: 'color' },
    corOlhos: { control: 'color' },
    tamanho: { control: { type: 'range', min: 16, max: 160, step: 4 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Avatar do integrante sobre o `<orb-avatar>`. O estado do integrante vira a reação do orb; clique para cutucar.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Orb>

export const Playground: Story = {}

function Estado({ estado }: { estado: (typeof estados)[number] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Orb estado={estado} cor="#f7a335" tamanho={72} animado />
      <div className="text-center text-xs">
        <div className="font-medium">{rotuloDoEstado[estado]}</div>
        <code className="text-muted-foreground">{reacaoDoEstado[estado]}</code>
      </div>
    </div>
  )
}

export const Estados: Story = {
  name: 'Estados do integrante',
  render: () => (
    <div className="flex flex-wrap gap-10 p-6">
      {estados.map((e) => (
        <Estado key={e} estado={e} />
      ))}
    </div>
  ),
}

export const Disponivel: Story = { args: { estado: 'disponivel' } }
export const Trabalhando: Story = { args: { estado: 'trabalhando' } }
export const Pensando: Story = { args: { estado: 'pensando' } }
export const PrecisaDeVoce: Story = { name: 'Precisa de você', args: { estado: 'precisa_de_voce' } }
export const Concluido: Story = { args: { estado: 'concluido' } }
export const Dormindo: Story = { name: 'Em pausa', args: { estado: 'dormindo' } }
export const Erro: Story = { args: { estado: 'erro' } }

const todasReacoes = ['idle', 'happy', 'thinking', 'working', 'done', 'needs', 'sleeping', 'error', 'love', 'sad', 'wink']

export const TodasAsReacoes: Story = {
  name: 'Todas as reações do componente',
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      {todasReacoes.map((r) => (
        <div key={r} className="flex flex-col items-center gap-2">
          <Orb reacao={r} cor="#6e5cf2" tamanho={56} rotulo={r} animado />
          <code className="text-muted-foreground text-xs">{r}</code>
        </div>
      ))}
    </div>
  ),
}

function TimeDoTema() {
  const { integrante } = useTema()
  const setores: SetorIntegrante[] = ['geral', 'fiscal', 'dp', 'contabil', 'consultor', 'societario', 'notas', 'gestao_atendimento']
  return (
    <div className="flex flex-wrap gap-8 p-6">
      {setores.map((s) => {
        const i = integrante(s)
        return (
          <div key={s} className="flex flex-col items-center gap-2">
            <Orb cor={i.cor} corOlhos={i.corOlhos} tamanho={56} modo="follow" animado />
            <span className="text-xs font-medium">{i.nome}</span>
          </div>
        )
      })}
    </div>
  )
}

export const CoresDoTema: Story = {
  name: 'Cores vindas do tema',
  render: () => <TimeDoTema />,
  parameters: { docs: { description: { story: 'Troque o tema na barra: nomes e cores dos integrantes vêm de `integrantes_padrao`.' } } },
}

export const Modos: Story = {
  render: () => (
    <div className="flex gap-10 p-6">
      {(['drift', 'follow', 'wander', 'fixed'] as const).map((m) => (
        <div key={m} className="flex flex-col items-center gap-2">
          <Orb modo={m} cor="#4fc9a8" tamanho={64} animado />
          <code className="text-muted-foreground text-xs">{m}</code>
        </div>
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-end gap-6 p-6">
      {[20, 28, 40, 64, 96].map((t) => (
        <Orb key={t} tamanho={t} cor="#3d86f7" animado />
      ))}
    </div>
  ),
}

export const ListaEstatica: Story = {
  name: 'Parado (padrão em listas)',
  render: () => (
    <div className="flex flex-wrap gap-2 p-2">
      {Array.from({ length: 24 }, (_, i) => (
        <Orb key={i} extras={false} tamanho={28} cor={i % 2 ? '#f7a335' : '#4fc9a8'} estado={estados[i % estados.length]} />
      ))}
    </div>
  ),
}
