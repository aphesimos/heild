import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { clientes } from '@/dados/exemplo'
import { SeletorCliente, type SelecaoCliente } from './seletor-cliente'

const meta: Meta<typeof SeletorCliente> = { title: 'Compostos/Seletor de cliente', component: SeletorCliente }
export default meta

function Demo({ inicial }: { inicial: SelecaoCliente }) {
  const [sel, setSel] = useState<SelecaoCliente>(inicial)
  return (
    <div className="flex flex-col items-start gap-3">
      <SeletorCliente clientes={clientes} selecionado={sel} onSelecionar={setSel} />
      <span className="text-muted-foreground text-xs">selecionado: {sel ?? 'Todos (carteira)'}</span>
    </div>
  )
}

export const ClienteSelecionado: StoryObj = { render: () => <Demo inicial="c2" /> }
export const Carteira: StoryObj = { name: 'Todos (carteira)', render: () => <Demo inicial={null} /> }
