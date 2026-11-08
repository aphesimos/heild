import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { integrantes } from '@/dados/exemplo'
import { CabecalhoIntegrante, FilaIntegrante } from './cabecalho-integrante'
import { ListaIntegrantes } from './lista-integrantes'

const meta: Meta<typeof ListaIntegrantes> = { title: 'Compostos/Integrantes', component: ListaIntegrantes }
export default meta

export const Lista: StoryObj = {
  render: function Render() {
    const [sel, setSel] = useState('i-fiscal')
    return <ListaIntegrantes className="max-w-xs" integrantes={integrantes} selecionado={sel} onSelecionar={(i) => setSel(i.id)} onCriar={() => {}} />
  },
}

export const ColunaDeIcones: StoryObj = {
  name: 'Coluna de ícones',
  render: function Render() {
    const [sel, setSel] = useState('i-geral')
    return <ListaIntegrantes variante="icones" integrantes={integrantes} selecionado={sel} onSelecionar={(i) => setSel(i.id)} onCriar={() => {}} />
  },
}

export const Cabecalho: StoryObj = {
  name: 'Cabeçalho e fila',
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      {integrantes.slice(1).map((i) => (
        <div key={i.id} className="flex flex-col gap-3">
          <CabecalhoIntegrante integrante={i} contexto="Metalúrgica Andrade Ltda" />
          <FilaIntegrante integrante={i} />
        </div>
      ))}
    </div>
  ),
}
