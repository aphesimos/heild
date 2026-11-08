import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaixaTela } from './financeiro/CaixaTela'
import { CobrancaTela } from './financeiro/CobrancaTela'
import { ContratosTela } from './financeiro/ContratosTela'
import { ResultadoTela } from './financeiro/ResultadoTela'

const meta: Meta = { title: 'Telas/Financeiro', parameters: { layout: 'fullscreen' } }
export default meta

const fundo = (n: React.ReactNode) => <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">{n}</div>

export const Contratos: StoryObj = { name: 'Contratos', render: () => fundo(<ContratosTela />) }
export const Cobranca: StoryObj = { name: 'Cobrança', render: () => fundo(<CobrancaTela />) }
export const Caixa: StoryObj = { name: 'Caixa', render: () => fundo(<CaixaTela />) }
export const Resultado: StoryObj = { name: 'Resultado', render: () => fundo(<ResultadoTela />) }
