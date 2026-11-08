import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta: Meta<typeof Tabs> = { title: 'Primitivos/Abas', component: Tabs }
export default meta
type Story = StoryObj<typeof Tabs>

export const Pilula: Story = {
  name: 'Pílula (principal)',
  render: () => (
    <Tabs defaultValue="inicio" className="flex flex-col items-center gap-4">
      <TabsList>
        <TabsTrigger value="inicio">Início</TabsTrigger>
        <TabsTrigger value="time">Time</TabsTrigger>
        <TabsTrigger value="painel">Painel</TabsTrigger>
        <TabsTrigger value="crm">CRM</TabsTrigger>
      </TabsList>
      <TabsContent value="inicio" className="text-muted-foreground text-sm">Conteúdo do Início</TabsContent>
      <TabsContent value="time" className="text-muted-foreground text-sm">Conteúdo do Time</TabsContent>
      <TabsContent value="painel" className="text-muted-foreground text-sm">Conteúdo do Painel</TabsContent>
      <TabsContent value="crm" className="text-muted-foreground text-sm">Conteúdo do CRM</TabsContent>
    </Tabs>
  ),
}

export const Linha: Story = {
  name: 'Linha (interna do módulo)',
  render: () => (
    <Tabs defaultValue="fiscal">
      <TabsList aparencia="linha">
        <TabsTrigger value="soc">Clientes e Societário</TabsTrigger>
        <TabsTrigger value="obr">Obrigações e Prazos</TabsTrigger>
        <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
        <TabsTrigger value="dp">Trabalhista e DP</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}
