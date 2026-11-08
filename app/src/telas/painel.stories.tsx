import type { Meta, StoryObj } from '@storybook/react-vite'
import * as exemplo from '@/dados/exemplo'
import { abasPainel } from '@/dados/painel'
import { PainelTela } from './PainelTela'
import { Plataforma } from './Plataforma'

const meta: Meta = { title: 'Telas/Painel', parameters: { layout: 'fullscreen' } }
export default meta

/** Painel na plataforma, aba Fiscal, cliente do Lucro Presumido. */
export const Fiscal: StoryObj = { render: () => <Plataforma moduloInicial="painel" abaInicial="fiscal" /> }

/** Fiscal com cliente do Simples: aparece o bloco do Simples com sublimite e fator R. */
export const FiscalSimples: StoryObj = { name: 'Fiscal · cliente do Simples', render: () => <Plataforma moduloInicial="painel" abaInicial="fiscal" clienteInicial="c2" /> }

/** Visão de carteira ("Todos"): sem perfil, ações em lote. */
export const Carteira: StoryObj = { name: 'Fiscal · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="fiscal" clienteInicial={null} /> }

const miolo = (abaId: string) => () => (
  <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">
    <PainelTela abaId={abaId} cliente={exemplo.clientes[0]} clientesNaCarteira={exemplo.clientes.length} tarefas={exemplo.tarefas} integrantes={exemplo.integrantes} />
  </div>
)

export const Societario: StoryObj = { name: 'Miolo · Clientes e Societário', render: miolo('societario') }
export const Obrigacoes: StoryObj = { name: 'Miolo · Obrigações e Prazos', render: miolo('obrigacoes') }
export const Notas: StoryObj = { name: 'Miolo · Notas fiscais', render: miolo('notas') }
export const DP: StoryObj = { name: 'Miolo · Trabalhista e DP', render: miolo('dp') }
export const Contabil: StoryObj = { name: 'Miolo · Contábil', render: miolo('contabil') }
export const Consultoria: StoryObj = { name: 'Miolo · Consultoria e Reforma', render: miolo('consultoria') }
export const Gestao: StoryObj = { name: 'Miolo · Gestão', render: miolo('gestao') }

export const TodasAsAbas: StoryObj = {
  name: 'Lista das abas',
  render: () => (
    <ul className="p-6 text-sm">
      {abasPainel.map((a) => (
        <li key={a.id}>
          {a.rotulo} · {a.blocos.length} blocos no subplano · {a.acoes.length} ações
        </li>
      ))}
    </ul>
  ),
}

/** As outras abas em carteira: cada uma troca os widgets por uma visão da carteira (Gestão não muda). */
export const SocietarioCarteira: StoryObj = { name: 'Societário · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="societario" clienteInicial={null} /> }
export const ObrigacoesCarteira: StoryObj = { name: 'Obrigações · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="obrigacoes" clienteInicial={null} /> }
export const NotasCarteira: StoryObj = { name: 'Notas · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="notas" clienteInicial={null} /> }

/** Contábil e DP em carteira: clientes por etapa do fechamento e pela situação da folha. */
export const ContabilCarteira: StoryObj = { name: 'Contábil · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="contabil" clienteInicial={null} /> }
export const DPCarteira: StoryObj = { name: 'DP · carteira', render: () => <Plataforma moduloInicial="painel" abaInicial="dp" clienteInicial={null} /> }

/** Qualquer aba, com cliente ou em carteira (usado pelo teste de buracos da grade). */
export const Variante: StoryObj<{ abaId: string; carteira: boolean; cliente: string }> = {
  args: { abaId: 'fiscal', carteira: false, cliente: 'c1' },
  argTypes: { abaId: { control: 'select', options: abasPainel.map((a) => a.id) }, cliente: { control: 'select', options: exemplo.clientes.map((c) => c.id) } },
  render: ({ abaId, carteira, cliente }) => (
    <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">
      <PainelTela key={`${abaId}-${carteira}-${cliente}`} abaId={abaId} cliente={carteira ? undefined : exemplo.clientes.find((c) => c.id === cliente)} clientesNaCarteira={exemplo.clientes.length} tarefas={exemplo.tarefas} integrantes={exemplo.integrantes} />
    </div>
  ),
}
