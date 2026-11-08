import { useCallback, useEffect, useRef, useState } from 'react'
import type { Anexo, Cartao, Mensagem } from '@/dados/tipos'

export const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function respostaDeExemplo(anexos: Anexo[]) {
  return anexos.length
    ? `Recebi ${anexos.length === 1 ? 'o arquivo' : `os ${anexos.length} arquivos`}. No laboratório as respostas são de exemplo; aqui viria o resultado das ferramentas.`
    : 'No laboratório as respostas são de exemplo. Aqui viria a resposta do integrante, com cartões quando houver dados ou ação.'
}

/**
 * Envia a mensagem do usuário e, logo em seguida, cria a resposta do integrante
 * como "pendente" (o orb pensa). Depois de um instante, a mesma mensagem recebe
 * o texto. Ser a mesma mensagem é o que deixa a transição do orb contínua.
 * Não há modelo nem ferramenta por trás.
 */
type AutorIntegrante = Extract<Mensagem['autor'], { tipo: 'integrante' }>

export function useEnvioSimulado(autor: Omit<AutorIntegrante, 'tipo'>, nomeUsuario: string, atualizar: (f: (ms: Mensagem[]) => Mensagem[]) => void) {
  const timer = useRef<number | undefined>(undefined)
  const [pensando, setPensando] = useState(false)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const enviar = useCallback(
    (texto: string, anexos: Anexo[], resposta?: { texto: string; cartoes?: Cartao[] }) => {
      const id = crypto.randomUUID()
      const idResposta = `${id}-r`
      atualizar((ms) => [
        ...ms,
        { id, autor: { tipo: 'usuario', nome: nomeUsuario }, hora: agora(), texto, anexos, em: Date.now() },
        { id: idResposta, autor: { tipo: 'integrante', ...autor }, hora: agora(), pendente: true, em: Date.now() + 1 },
      ])
      setPensando(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setPensando(false)
        atualizar((ms) => ms.map((m) => (m.id === idResposta ? { ...m, pendente: false, escrever: true, escreverDesde: Date.now(), hora: agora(), texto: resposta?.texto ?? respostaDeExemplo(anexos), cartoes: resposta?.cartoes } : m)))
      }, 2200)
    },
    [autor, nomeUsuario, atualizar],
  )
  return { enviar, pensando }
}

/** Conversa simples (chat de um integrante): guarda as mensagens e simula a resposta. */
export function useConversa(autor: Omit<AutorIntegrante, 'tipo'>, inicial: Mensagem[], nomeUsuario: string) {
  const [mensagens, setMensagens] = useState(inicial)
  const { enviar, pensando } = useEnvioSimulado(autor, nomeUsuario, setMensagens)
  return { mensagens, enviar, pensando }
}
