import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArmazenamentoTela } from './config/ArmazenamentoTela'
import { AssinaturaTela } from './config/AssinaturaTela'
import { EscritorioTela } from './config/EscritorioTela'
import { IntegrantesTela } from './config/IntegrantesTela'
import { TemaTela } from './config/TemaTela'
import { UsuariosTela } from './config/UsuariosTela'

const meta: Meta = {
  title: 'Telas/Configurações',
  parameters: { layout: 'fullscreen' },
}
export default meta

const fundo = (n: React.ReactNode) => <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">{n}</div>

export const Escritorio: StoryObj = {
  name: 'Escritório',
  render: () => fundo(<EscritorioTela />),
}
export const Usuarios: StoryObj = {
  name: 'Usuários e setores',
  render: () => fundo(<UsuariosTela />),
}
export const Armazenamento: StoryObj = {
  name: 'Armazenamento',
  render: () => fundo(<ArmazenamentoTela />),
}
export const Tema: StoryObj = {
  name: 'Tema',
  render: () => fundo(<TemaTela />),
}
export const Integrantes: StoryObj = {
  name: 'Integrantes',
  render: () => fundo(<IntegrantesTela />),
}
export const Assinatura: StoryObj = {
  name: 'Assinatura',
  render: () => fundo(<AssinaturaTela />),
}
