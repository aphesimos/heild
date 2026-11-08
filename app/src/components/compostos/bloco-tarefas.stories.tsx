import type { Meta, StoryObj } from '@storybook/react-vite'
import { tarefas } from '@/dados/exemplo'
import { BlocoTarefas } from './bloco-tarefas'
import { CartaoTarefa } from './cartao-tarefa'

const meta: Meta<typeof BlocoTarefas> = { title: 'Compostos/Tarefas', component: BlocoTarefas }
export default meta
type Story = StoryObj<typeof BlocoTarefas>

export const BlocoCarteira: Story = { name: 'Bloco · carteira', args: { setor: 'Fiscal', tarefas } }
export const BlocoCliente: Story = {
  name: 'Bloco · um cliente',
  args: { setor: 'Fiscal', cliente: 'Metalúrgica Andrade Ltda', tarefas: tarefas.filter((t) => t.cliente.startsWith('Metalúrgica')) },
}
export const BlocoVazio: Story = { name: 'Bloco · vazio', args: { setor: 'Trabalhista e DP', cliente: 'Clínica Sorriso Ltda', tarefas: [] } }

export const Cartoes: StoryObj = {
  name: 'Cartão de tarefa',
  render: () => (
    <div className="grid max-w-3xl gap-3 md:grid-cols-2">
      {tarefas.map((t) => (
        <CartaoTarefa key={t.id} tarefa={t} />
      ))}
    </div>
  ),
}
