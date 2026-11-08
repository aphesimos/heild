import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import * as d from '@/dados/exemplo'
import { useTema } from '@/theme/ThemeProvider'
import { useHistorico } from '@/telas/useHistorico'
import { BarraConversa } from './barra-conversa'
import { BotaoLimiteUso } from './limite-uso'
import { OrbMensagem } from './orb-mensagem'

const meta: Meta = { title: 'Compostos/Conversa' }
export default meta

export const Limite: StoryObj = {
  name: 'Limite de uso',
  render: () => (
    <div className="flex items-center gap-6 p-10">
      <BotaoLimiteUso limites={d.limitesUso} plano={d.planoUso.plano} />
      <BotaoLimiteUso limites={[{ id: 'a', rotulo: 'Limite de 5 horas', renova: 'às 13:10', usado: 30 }]} />
      <BotaoLimiteUso limites={[{ id: 'b', rotulo: 'Limite de 5 horas', renova: 'às 13:10', usado: 88 }]} />
      <BotaoLimiteUso limites={[{ id: 'c', rotulo: 'Limite de 5 horas', renova: 'às 13:10', usado: 100 }, { id: 'd', rotulo: 'Semanal', renova: 'qua, 04:00', usado: 62 }]} />
    </div>
  ),
}

function DemoBarra() {
  const c = useHistorico('todos', d.usuario.nome, d.historicoAssistente, false)
  return (
    <div className="max-w-3xl p-6">
      <BarraConversa atual={c.atual} historico={c.historico} contexto="Carteira" onAbrir={c.abrir} onNova={c.criar} onLimpar={c.limpar} />
      <p className="text-muted-foreground px-3 pt-4 text-sm">{c.atual.mensagens.length} mensagens na conversa atual</p>
    </div>
  )
}

export const Barra: StoryObj = { name: 'Barra da conversa', render: () => <DemoBarra /> }

function DemoOrb() {
  const { integrante } = useTema()
  const i = integrante('fiscal')
  const [pendente, setPendente] = useState(false)
  return (
    <div className="flex items-center gap-6 p-10">
      <OrbMensagem cor={i.cor} corOlhos={i.corOlhos} pendente={pendente} tamanho={64} />
      <Button onClick={() => setPendente((p) => !p)}>{pendente ? 'Chegar a resposta' : 'Enviar (começa a pensar)'}</Button>
      <span className="text-muted-foreground max-w-xs text-sm">Pensando: vaga, com partículas. Resposta: feliz por 1,8 s, assenta e congela na mesma pose.</span>
    </div>
  )
}

export const OrbDaMensagem: StoryObj = { name: 'Orb da mensagem (transição)', render: () => <DemoOrb /> }
