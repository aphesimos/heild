import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatsCircle, GearSix, House, SquaresFour, Timer, Wallet } from '@phosphor-icons/react'
import { useState } from 'react'
import { Orb } from '@/components/ui/orb'
import { clientes, usuario } from '@/dados/exemplo'
import { AbasSegmentadas } from './abas-segmentadas'
import { BarraLateral } from './barra-lateral'
import { CabecalhoModulo } from './cabecalho-modulo'
import { SeletorCliente, type SelecaoCliente } from './seletor-cliente'

const meta: Meta = { title: 'Compostos/Estrutura' }
export default meta

export const Abas: StoryObj = {
  name: 'Abas segmentadas',
  render: function Render() {
    const [a, setA] = useState('assistente')
    const [b, setB] = useState('fiscal')
    return (
      <div className="flex flex-col items-center gap-6 p-6">
        <AbasSegmentadas
          abas={[
            { id: 'assistente', rotulo: 'Assistente' },
            { id: 'time', rotulo: 'Time', adorno: <Orb estado="concluido" cor="#4fc9a8" tamanho={16} extras={false} cutucavel={false} />, contador: 3 },
            { id: 'visao', rotulo: 'Visão geral' },
          ]}
          ativa={a}
          onTrocar={setA}
        />
        <AbasSegmentadas
          abas={['Societário', 'Obrigações', 'Notas', 'Fiscal', 'DP', 'Contábil'].map((r) => ({ id: r.toLowerCase(), rotulo: r }))}
          ativa={b}
          onTrocar={setB}
        />
      </div>
    )
  },
}

export const Lateral: StoryObj = {
  name: 'Barra lateral',
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [m, setM] = useState('inicio')
    const [aberta, setAberta] = useState(true)
    return (
      <div className="h-[640px]">
        <BarraLateral
          aberta={aberta}
          onAlternar={() => setAberta((v) => !v)}
          itens={[
            { id: 'inicio', rotulo: 'Início', Icone: House },
            { id: 'painel', rotulo: 'Painel', Icone: SquaresFour, contador: 3 },
            { id: 'crm', rotulo: 'CRM', Icone: ChatsCircle },
            { id: 'timesheet', rotulo: 'Timesheet', Icone: Timer },
            { id: 'financeiro', rotulo: 'Financeiro', Icone: Wallet },
          ]}
          configuracoes={{ id: 'config', rotulo: 'Configurações', Icone: GearSix }}
          ativo={m}
          onTrocar={setM}
          usuario={usuario}
          onAlternarModo={() => {}}
        />
      </div>
    )
  },
}

export const Cabecalho: StoryObj = {
  name: 'Cabeçalho do módulo',
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [a, setA] = useState('assistente')
    const [c, setC] = useState<SelecaoCliente>('c1')
    return (
      <CabecalhoModulo
        naoLidas={3}
        abas={<AbasSegmentadas abas={[{ id: 'assistente', rotulo: 'Assistente' }, { id: 'time', rotulo: 'Time' }, { id: 'visao', rotulo: 'Visão geral' }]} ativa={a} onTrocar={setA} />}
        cliente={<SeletorCliente clientes={clientes} selecionado={c} onSelecionar={setC} />}
      />
    )
  },
}
