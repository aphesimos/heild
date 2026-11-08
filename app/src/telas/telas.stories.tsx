import type { Meta, StoryObj } from '@storybook/react-vite'
import * as exemplo from '@/dados/exemplo'
import { AssistenteTela } from './AssistenteTela'
import { Plataforma } from './Plataforma'
import { TimeTela } from './TimeTela'
import { useHistorico } from './useHistorico'
import { VisaoGeralTela } from './VisaoGeralTela'

const meta: Meta<typeof Plataforma> = {
  title: 'Telas/Plataforma',
  component: Plataforma,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Plataforma>

export const Navegacao: Story = { name: 'Navegação completa' }
export const Assistente: Story = { name: 'Início · Assistente (vazio)' }
export const AssistenteConversa: Story = { name: 'Início · Assistente (conversa)', args: { comConversa: true } }
export const Time: Story = { name: 'Início · Time', args: { abaInicial: 'time', integranteInicial: 'i-fiscal' } }
export const TimeDP: Story = { name: 'Início · Time (DP precisa de você)', args: { abaInicial: 'time', integranteInicial: 'i-dp' } }
export const VisaoGeral: Story = { name: 'Início · Visão geral', args: { abaInicial: 'visao' } }
export const PainelFiscal: Story = { name: 'Painel · Fiscal', args: { moduloInicial: 'painel' } }
export const CRM: Story = { name: 'CRM · Conversas (carteira)', args: { moduloInicial: 'crm', clienteInicial: null } }
export const CRMCliente: Story = { name: 'CRM · Conversas de um cliente', args: { moduloInicial: 'crm' } }
export const CRMLeads: Story = { name: 'CRM · Leads', args: { moduloInicial: 'crm', abaInicial: 'leads' } }
export const CRMComunicados: Story = { name: 'CRM · Comunicados', args: { moduloInicial: 'crm', abaInicial: 'comunicados' } }
export const TimesheetMeuTempo: Story = { name: 'Timesheet · Meu tempo', args: { moduloInicial: 'timesheet', clienteInicial: null } }
export const TimesheetEquipe: Story = { name: 'Timesheet · Equipe', args: { moduloInicial: 'timesheet', abaInicial: 'equipe', clienteInicial: null } }
export const TimesheetRentabilidade: Story = { name: 'Timesheet · Rentabilidade', args: { moduloInicial: 'timesheet', abaInicial: 'rentabilidade', clienteInicial: null } }
export const TimesheetConfirmacoes: Story = { name: 'Timesheet · Confirmações', args: { moduloInicial: 'timesheet', abaInicial: 'confirmacoes', clienteInicial: null } }
export const FinanceiroContratos: Story = { name: 'Financeiro · Contratos', args: { moduloInicial: 'financeiro', clienteInicial: null } }
export const FinanceiroCobranca: Story = { name: 'Financeiro · Cobrança', args: { moduloInicial: 'financeiro', abaInicial: 'cobranca', clienteInicial: null } }
export const Configuracoes: Story = { name: 'Configurações · Escritório', args: { moduloInicial: 'config', clienteInicial: null } }
export const CRMNumeros: Story = { name: 'CRM · Configuração dos números', args: { moduloInicial: 'crm', abaInicial: 'numeros' } }

/** Miolos sem a moldura, para testar cada tela isolada. */
function MioloAssistente() {
  const conversa = useHistorico('todos', exemplo.usuario.nome, exemplo.historicoAssistente, false)
  return (
    <AssistenteTela
      contexto="Carteira"
      conversa={conversa}
      sugestoes={exemplo.sugestoesGeral}
      avisos={exemplo.avisos}
      limites={exemplo.limitesUso}
      plano={exemplo.planoUso.plano}
    />
  )
}

export const SoAssistente: StoryObj = {
  name: 'Miolo · Assistente',
  render: () => (
    <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-3">
      <MioloAssistente />
    </div>
  ),
}

export const SoTime: StoryObj = {
  name: 'Miolo · Time',
  render: () => (
    <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">
      <TimeTela nomeUsuario={exemplo.usuario.nome} contexto="Metalúrgica Andrade Ltda" integrantes={exemplo.integrantes} selecionado="i-consultor" onSelecionar={() => {}} conversas={exemplo.conversasPorIntegrante} />
    </div>
  ),
}

export const SoVisaoGeral: StoryObj = {
  name: 'Miolo · Visão geral',
  render: () => (
    <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">
      <VisaoGeralTela
        contexto="Metalúrgica Andrade Ltda"
        dados={{ indicadores: exemplo.indicadores, progressoMes: exemplo.progressoMes, avisos: exemplo.avisos, dias: exemplo.diasSemana, agenda: exemplo.agenda, hoje: 18, pendencias: exemplo.pendencias, linhaDoTempo: exemplo.linhaDoTempo }}
      />
    </div>
  ),
}
