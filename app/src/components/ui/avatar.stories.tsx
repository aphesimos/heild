import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Primitivos/Avatar de pessoa',
  component: Avatar,
  args: { nome: 'Fernanda Lima', tamanho: 'md' },
  argTypes: { tamanho: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
}
export default meta

export const Iniciais: StoryObj<typeof Avatar> = {}

export const Tamanhos: StoryObj<typeof Avatar> = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar nome="João Pereira" tamanho="sm" />
      <Avatar nome="Ana Souza" tamanho="md" />
      <Avatar nome="Beltrano" tamanho="lg" />
    </div>
  ),
}
