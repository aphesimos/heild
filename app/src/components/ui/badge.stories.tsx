import type { Meta, StoryObj } from '@storybook/react-vite'
import { WarningIcon, CheckIcon, ClockIcon } from '@phosphor-icons/react'
import { Badge, Contador } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Primitivos/Badge',
  component: Badge,
  args: { children: 'em andamento' },
  argTypes: { variant: { control: 'select', options: ['default', 'secondary', 'outline', 'destaque', 'sucesso', 'erro'] } },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Padrao: Story = {}

export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">a fazer</Badge>
      <Badge>em andamento</Badge>
      <Badge variant="destaque">
        <ClockIcon /> aguard. cliente (3 d)
      </Badge>
      <Badge variant="erro">
        <WarningIcon /> atrasada
      </Badge>
      <Badge variant="sucesso">
        <CheckIcon /> concluída
      </Badge>
      <Badge variant="secondary">FIS-009</Badge>
    </div>
  ),
}

export const Contadores: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Contador valor={3} />
      <Contador valor={42} />
      <Contador valor={150} />
      <span className="text-muted-foreground text-xs">(zero não aparece:)</span>
      <Contador valor={0} />
    </div>
  ),
}
