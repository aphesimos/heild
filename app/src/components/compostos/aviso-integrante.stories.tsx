import type { Meta, StoryObj } from '@storybook/react-vite'
import { avisos } from '@/dados/exemplo'
import { AvisoIntegrante } from './aviso-integrante'

const meta: Meta<typeof AvisoIntegrante> = { title: 'Compostos/Aviso do integrante', component: AvisoIntegrante, decorators: [(S) => <div className="max-w-lg"><S /></div>] }
export default meta
type Story = StoryObj<typeof AvisoIntegrante>

export const FizDecisaoInformacao: Story = { name: 'Fiz + decisão em lote + informação', args: { aviso: avisos[0] } }
export const DecisaoUrgente: Story = { name: 'Decisão urgente', args: { aviso: avisos[1] } }
export const SoInformacao: Story = { name: 'Só informação', args: { aviso: avisos[2] } }
export const Lista: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      {avisos.map((a) => (
        <AvisoIntegrante key={a.id} aviso={a} />
      ))}
    </div>
  ),
}
