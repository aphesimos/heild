import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Avatar } from './avatar'
import { Badge } from './badge'
import { List, ListItem } from './list'

const meta: Meta<typeof List> = { title: 'Primitivos/Lista', component: List }
export default meta

export const Clicavel: StoryObj<typeof List> = {
  render: function Render() {
    const [ativo, setAtivo] = useState('1')
    const itens = [
      { id: '1', nome: 'Fernanda Lima', papel: 'Gestora · Fiscal', status: 'online' },
      { id: '2', nome: 'João Pereira', papel: 'Colaborador · Fiscal, Notas', status: 'em tarefa' },
      { id: '3', nome: 'Ana Souza', papel: 'Colaboradora · DP', status: 'ausente' },
    ]
    return (
      <List className="bg-card max-w-sm rounded-lg border">
        {itens.map((i) => (
          <ListItem
            key={i.id}
            ativo={ativo === i.id}
            onSelecionar={() => setAtivo(i.id)}
            inicio={<Avatar nome={i.nome} />}
            titulo={i.nome}
            descricao={i.papel}
            fim={<Badge variant="outline">{i.status}</Badge>}
          />
        ))}
      </List>
    )
  },
}
