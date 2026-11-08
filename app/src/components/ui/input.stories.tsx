import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input, Label, Textarea } from './input'

const meta: Meta<typeof Input> = { title: 'Primitivos/Campo', component: Input }
export default meta
type Story = StoryObj<typeof Input>

export const Texto: Story = { args: { placeholder: 'CNPJ ou razão social' } }

export const ComRotulo: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="comp">Competência</Label>
      <Input id="comp" defaultValue="2026-10" />
    </div>
  ),
}

export const Invalido: Story = { args: { 'aria-invalid': true, defaultValue: '00.000.000/0000-00' } }

export const AreaDeTexto: Story = {
  render: () => <Textarea className="max-w-md" placeholder="Observação para o cliente" />,
}
