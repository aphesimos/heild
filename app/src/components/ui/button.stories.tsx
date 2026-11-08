import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckIcon, PaperclipIcon, XIcon } from '@phosphor-icons/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Primitivos/Botão',
  component: Button,
  args: { children: 'Transmitir' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'link'] },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon', 'icon-sm'] },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Padrao: Story = {}

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primário</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="ghost">Fantasma</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="success">Concluir</Button>
      <Button variant="link">Ver na aba</Button>
    </div>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Pequeno</Button>
      <Button>Médio</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" variant="outline" aria-label="Anexar">
        <PaperclipIcon />
      </Button>
    </div>
  ),
}

export const SimNao: Story = {
  name: 'Sim / não (cartão)',
  render: () => (
    <div className="flex gap-2">
      <Button size="sm">
        <CheckIcon /> Sim
      </Button>
      <Button size="sm" variant="outline">Editar</Button>
      <Button size="sm" variant="ghost">
        <XIcon /> Não
      </Button>
    </div>
  ),
}

export const Desabilitado: Story = { args: { disabled: true } }
