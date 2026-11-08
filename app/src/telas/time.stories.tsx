import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import * as exemplo from '@/dados/exemplo'
import type { Integrante } from '@/dados/tipos'
import { TimeTela } from './TimeTela'

const meta: Meta = { title: 'Telas/Time', parameters: { layout: 'fullscreen' } }
export default meta

function Demo({ inicial, limite = exemplo.limiteUsuario, integrantes = exemplo.integrantes }: { inicial: string; limite?: { usado: number; renova: string }; integrantes?: Integrante[] }) {
  const [sel, setSel] = useState(inicial)
  return (
    <div className="from-background to-background-end h-dvh bg-gradient-to-b pt-4">
      <TimeTela nomeUsuario={exemplo.usuario.nome} contexto="Metalúrgica Andrade Ltda" integrantes={integrantes} selecionado={sel} onSelecionar={setSel} conversas={exemplo.conversasPorIntegrante} limite={limite} />
    </div>
  )
}

/** Fiscal trabalhando, com aviso, guia, passagem de trabalho e conversa do CRM. */
export const Normal: StoryObj = { render: () => <Demo inicial="i-fiscal" /> }

/** DP precisa de você: aviso com os três blocos e cartão de aprovação. */
export const PrecisaDeVoce: StoryObj = { name: 'DP precisa de você', render: () => <Demo inicial="i-dp" /> }

/** Integrante sem histórico (criado pelo usuário, em observação). */
export const Vazio: StoryObj = { render: () => <Demo inicial="i-iss" /> }

/** Limite de 5 horas atingido: o chat continua, os trabalhos automáticos esperam. */
export const LimiteAtingido: StoryObj = { name: 'Limite atingido', render: () => <Demo inicial="i-fiscal" limite={{ usado: 100, renova: 'às 13:10' }} /> }

/** Integrante pausado pelo usuário. */
export const Pausado: StoryObj = {
  render: () => <Demo inicial="i-contabil" integrantes={exemplo.integrantes.map((i) => (i.id === 'i-contabil' ? { ...i, situacao: 'pausado' as const } : i))} />,
}
