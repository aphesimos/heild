import { integrantes } from '@/dados/exemplo'
import { fluxoDaTarefa } from '@/dados/simulacao'
import type { Tarefa } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { useLoja } from './loja'

/**
 * "Pedir ao integrante" numa tarefa (demonstração): o integrante padrão do setor
 * começa a fazer, com etapas, e avisa ao terminar. Devolve o nome dele, se já
 * está fazendo esta tarefa e a ação.
 */
export function usePedirIntegrante() {
  const loja = useLoja()
  const aparencia = useAparencia()
  return (t: Tarefa) => {
    const quem = integrantes.find((i) => i.setor === t.setor && i.tipo !== 'criado_pelo_usuario')
    if (!quem || t.status === 'concluida') return undefined
    const nome = aparencia(quem).nome
    const fazendo = !!loja.trabalhoDe({ tarefaId: t.id })
    return {
      nome,
      fazendo,
      pedir: () => {
        loja.iniciarTrabalho(fluxoDaTarefa(t, quem.id, nome), { tarefaId: t.id })
        loja.toast(`Começou ${t.codigo} · ${t.cliente}.`, { modulo: 'inicio', aba: 'time', integrante: quem.id }, 'Acompanhar', { tipo: 'integrante', setor: quem.setor, estado: 'trabalhando' })
      },
    }
  }
}
