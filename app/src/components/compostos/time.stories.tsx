import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import * as d from '@/dados/exemplo'
import type { Cartao } from '@/dados/tipos'
import { CabecalhoIntegrante } from './cabecalho-integrante'
import { CartaoChat } from './cartoes-chat'
import { ListaIntegrantes } from './lista-integrantes'
import { NovoIntegrante } from './novo-integrante'

const meta: Meta = { title: 'Compostos/Time' }
export default meta

export const Coluna: StoryObj = {
  name: 'Lista de integrantes (coluna)',
  render: function Render() {
    const [sel, setSel] = useState('i-dp')
    return (
      <div className="h-[640px] w-80 overflow-hidden rounded-[24px]">
        <ListaIntegrantes variante="coluna" className="h-full" integrantes={d.integrantes} selecionado={sel} onSelecionar={(i) => setSel(i.id)} onCriar={() => {}} />
      </div>
    )
  },
}

export const Faixa: StoryObj = {
  name: 'Faixa de orbs (celular)',
  render: () => <ListaIntegrantes variante="icones" orientacao="horizontal" className="max-w-sm" integrantes={d.integrantes} selecionado="i-fiscal" onCriar={() => {}} />,
}

export const Cabecalho: StoryObj = {
  name: 'Cabeçalho do integrante',
  render: () => (
    <div className="flex max-w-3xl flex-col gap-8">
      {d.integrantes.slice(2).map((i) => (
        <CabecalhoIntegrante key={i.id} integrante={i} contexto="Metalúrgica Andrade Ltda" limite={d.limiteUsuario} />
      ))}
      <CabecalhoIntegrante integrante={{ ...d.integrantes[4], situacao: 'pausado' }} limite={{ usado: 100, renova: 'às 13:10' }} />
    </div>
  ),
}

const cartoes = Object.values(d.conversasPorIntegrante).flat().flatMap((m) => m.cartoes ?? [])
const porTipo = (t: Cartao['tipo']) => cartoes.find((c) => c.tipo === t)!

export const CartaoAviso: StoryObj = { name: 'Cartão · aviso (fiz / decisão / informação)', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('aviso')} /></div> }
export const CartaoAprovacao: StoryObj = { name: 'Cartão · aprovação', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('aprovacao')} /></div> }
export const CartaoDocumento: StoryObj = { name: 'Cartão · documento ou guia', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('documento')} /></div> }
export const CartaoCrm: StoryObj = { name: 'Cartão · conversa do CRM', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('conversa_crm')} /></div> }
export const CartaoPassagem: StoryObj = { name: 'Passagem de trabalho', render: () => <div className="max-w-2xl"><CartaoChat cartao={porTipo('passagem')} /></div> }
export const CartaoTarefa: StoryObj = { name: 'Cartão · tarefa', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('tarefa')} /></div> }

export const Novo: StoryObj = {
  name: 'Novo integrante',
  render: function Render() {
    const [aberto, setAberto] = useState(true)
    return (
      <>
        <Button onClick={() => setAberto(true)}>Novo integrante</Button>
        <NovoIntegrante aberto={aberto} onFechar={() => setAberto(false)} />
      </>
    )
  },
}
