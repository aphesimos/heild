import type { Meta, StoryObj } from '@storybook/react-vite'
import { conversaFiscal, conversaGeral } from '@/dados/exemplo'
import type { Cartao } from '@/dados/tipos'
import { BolhaChat } from './bolha-chat'
import { CampoChat } from './campo-chat'
import { CartaoChat } from './cartoes-chat'

const meta: Meta = { title: 'Compostos/Chat' }
export default meta

const todosCartoes = [...conversaGeral, ...conversaFiscal].flatMap((m) => m.cartoes ?? [])
const porTipo = (t: Cartao['tipo']) => todosCartoes.find((c) => c.tipo === t)!

export const Conversa: StoryObj = {
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {conversaGeral.map((m) => (
        <BolhaChat key={m.id} mensagem={m} />
      ))}
    </div>
  ),
}

export const ConversaIntegrante: StoryObj = {
  name: 'Conversa do integrante',
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {conversaFiscal.map((m) => (
        <BolhaChat key={m.id} mensagem={m} />
      ))}
    </div>
  ),
}

export const CartaoAprovacao: StoryObj = { name: 'Cartão · aprovação', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('aprovacao')} /></div> }
export const CartaoEncaminhamento: StoryObj = { name: 'Cartão · encaminhamento', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('encaminhamento')} /></div> }
export const CartaoTabela: StoryObj = { name: 'Cartão · tabela', render: () => <div className="max-w-2xl"><CartaoChat cartao={porTipo('tabela')} /></div> }
export const CartaoTarefa: StoryObj = { name: 'Cartão · tarefa', render: () => <div className="max-w-lg"><CartaoChat cartao={porTipo('tarefa')} /></div> }

export const Campo: StoryObj = {
  name: 'Campo com anexos',
  render: () => (
    <div className="mx-auto max-w-3xl">
      <CampoChat contexto="contexto: Metalúrgica Andrade Ltda" onEnviar={(t, a) => alert(`${t}\n${a.map((x) => x.nome).join(', ')}`)} />
    </div>
  ),
}
