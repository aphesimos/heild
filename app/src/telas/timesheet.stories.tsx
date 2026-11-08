import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeuTempoTela } from './timesheet/MeuTempoTela'

const meta: Meta = { title: 'Telas/Timesheet', parameters: { layout: 'fullscreen' } }
export default meta

const fundo = (n: React.ReactNode) => <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">{n}</div>

/** Primeiro acesso de um Colaborador: termo ainda não aceito, extensão não vinculada, sem menu de configuração. */
export const PrimeiroAcesso: StoryObj = { name: 'Meu tempo · primeiro acesso (Colaborador)', render: () => fundo(<MeuTempoTela papel="colaborador" termoInicial={false} extensaoInicial={false} />) }

/** Filtrado por um cliente (seletor do topo). */
export const UmCliente: StoryObj = { name: 'Meu tempo · um cliente', render: () => fundo(<MeuTempoTela papel="gestor" clienteNome="Metalúrgica Andrade Ltda" />) }
