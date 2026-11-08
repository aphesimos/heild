import { useCallback, useMemo, useRef, useState } from 'react'
import type { Conversa, Mensagem } from '@/dados/tipos'
import { useEnvioSimulado } from './useConversa'

const AUTOR_GERAL = { setor: 'geral' as const }

const nova = (): Conversa => ({ id: crypto.randomUUID(), titulo: 'Nova conversa', quando: 'agora', grupo: 'Hoje', mensagens: [] })

interface Contexto {
  conversas: Conversa[]
  atual: string
}

const vazia = (c: Conversa) => c.mensagens.length === 0

/**
 * Conversas do Assistente por cliente (proposta, fora do plano):
 * - cada cliente e a Carteira têm a sua sessão; trocar de cliente troca de sessão
 *   sozinho, sem a pessoa escolher conversa numa lista;
 * - ao entrar num cliente abre a conversa mais recente dele (ou uma nova, se `comecarNova`);
 * - nova conversa, limpar a atual e abrir uma anterior pelo histórico do cliente.
 * No lab fica em memória; em produção, Sessão `chat` por usuário e cliente (02, 6.4).
 */
export function useHistorico(chave: string, nomeUsuario: string, semente: Record<string, Conversa[]>, comecarNova: boolean) {
  const [porContexto, setPorContexto] = useState<Record<string, Contexto>>({})
  // O estado inicial de cada cliente é criado uma vez só e guardado aqui;
  // recriá-lo a cada render daria um id novo à conversa vazia e perderia mensagens.
  const iniciais = useRef<Record<string, Contexto>>({})

  const inicial = useCallback(
    (k: string): Contexto => {
      if (!iniciais.current[k]) {
        const conversas = semente[k] ?? []
        if (comecarNova || conversas.length === 0) {
          const c = nova()
          iniciais.current[k] = { conversas: [c, ...conversas], atual: c.id }
        } else {
          iniciais.current[k] = { conversas, atual: conversas[0].id }
        }
      }
      return iniciais.current[k]
    },
    [semente, comecarNova],
  )

  const ctx = porContexto[chave] ?? inicial(chave)
  const atual = ctx.conversas.find((c) => c.id === ctx.atual) ?? ctx.conversas[0]

  /** Altera o contexto `k`, criando-o a partir da semente se ainda não existir. */
  const mudar = useCallback(
    (k: string, f: (c: Contexto) => Contexto) => setPorContexto((todos) => ({ ...todos, [k]: f(todos[k] ?? inicial(k)) })),
    [inicial],
  )

  /** Ao sair de uma conversa nova e vazia, ela é descartada. */
  const descartaAoSair = (c: Contexto, saindo: string): Conversa[] => c.conversas.filter((x) => x.id !== saindo || !(vazia(x) && c.conversas.length > 1))

  const abrir = useCallback(
    (id: string) =>
      mudar(chave, (c) => (id === c.atual ? c : { conversas: descartaAoSair(c, c.atual), atual: id })),
    [chave, mudar],
  )

  const criar = useCallback(
    () =>
      mudar(chave, (c) => {
        const cur = c.conversas.find((x) => x.id === c.atual)
        // Já está numa conversa nova e vazia: não cria outra.
        if (cur && vazia(cur)) return c
        const n = nova()
        return { conversas: [n, ...descartaAoSair(c, c.atual)], atual: n.id }
      }),
    [chave, mudar],
  )

  const limpar = useCallback(
    () => mudar(chave, (c) => ({ ...c, conversas: c.conversas.map((x) => (x.id === c.atual ? { ...x, mensagens: [], titulo: 'Nova conversa', quando: 'agora' } : x)) })),
    [chave, mudar],
  )

  // Atualiza sempre a conversa onde a mensagem foi enviada, mesmo que a pessoa
  // troque de cliente antes de a resposta chegar.
  const idAtual = atual.id
  const atualizar = useCallback(
    (f: (ms: Mensagem[]) => Mensagem[]) =>
      mudar(chave, (c) => ({
        ...c,
        conversas: c.conversas.map((x) => {
          if (x.id !== idAtual) return x
          const mensagens = f(x.mensagens)
          const primeira = mensagens.find((m) => m.autor.tipo === 'usuario')?.texto
          const titulo = x.titulo === 'Nova conversa' && primeira ? (primeira.length > 48 ? `${primeira.slice(0, 46)}…` : primeira) : x.titulo
          return { ...x, mensagens, titulo, quando: 'agora', grupo: 'Hoje' }
        }),
      })),
    [chave, idAtual, mudar],
  )

  const { enviar, pensando } = useEnvioSimulado(AUTOR_GERAL, nomeUsuario, atualizar)

  const historico = useMemo(() => ctx.conversas.filter((c) => !vazia(c) || c.id === ctx.atual), [ctx])

  return { atual, historico, enviar, pensando, abrir, criar, limpar }
}
