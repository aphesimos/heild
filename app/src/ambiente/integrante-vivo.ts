import type { Trabalho } from './loja'
import type { Integrante, Mensagem, Tarefa } from '@/dados/tipos'

/** Cartões que ainda pedem decisão no chat do integrante (aprovação ou aviso com decisão, sem registro na loja). */
export function cartoesPendentes(mensagens: Mensagem[], decisoes: Record<string, string>) {
  let n = 0
  for (const m of mensagens) {
    if (m.pendente) continue
    for (const c of m.cartoes ?? []) {
      if (decisoes[c.id]) continue
      if (c.tipo === 'aprovacao' || (c.tipo === 'aviso' && c.aviso.decisao)) n++
    }
  }
  return n
}

/** Fila do integrante: o que está fazendo agora e as tarefas do Painel com ele que ainda não terminaram. */
export function filaDe(i: Integrante, trabalhos: Trabalho[], tarefas: Tarefa[]) {
  const rodando = trabalhos.filter((t) => t.situacao === 'rodando' && t.integrante === i.id).length
  if (i.tipo !== 'padrao_setor') return rodando
  const comEle = tarefas.filter((t) => t.setor === i.setor && t.responsavel?.tipo === 'integrante' && t.status !== 'concluida' && t.status !== 'aguardando_cliente').length
  return rodando + comEle
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`

/**
 * O integrante como ele está agora na demonstração (pedido do usuário, 8/11/2026:
 * nada de "foto"). Estado, resumo, fila, cartões pendentes e o "fazendo agora"
 * saem dos trabalhos em andamento, das decisões tomadas e das tarefas. Só o que
 * não é trabalho (dormindo, erro) vem do cadastro.
 */
export function integranteAoVivo(i: Integrante, trabalhos: Trabalho[], mensagens: Mensagem[], decisoes: Record<string, string>, tarefas: Tarefa[]): Integrante {
  const rodando = trabalhos.filter((t) => t.situacao === 'rodando' && t.integrante === i.id)
  const ultimo = trabalhos.filter((t) => t.situacao === 'concluido' && t.integrante === i.id).sort((a, b) => (b.fimEm ?? 0) - (a.fimEm ?? 0))[0]
  const pendentes = cartoesPendentes(mensagens, decisoes)
  const fixo = i.estado === 'dormindo' || i.estado === 'erro'
  const estado: Integrante['estado'] = fixo && !rodando.length ? i.estado : pendentes > 0 ? 'precisa_de_voce' : rodando.length ? 'trabalhando' : 'disponivel'
  const resumo = rodando.length
    ? `Fazendo: ${rodando[0].titulo}${rodando.length > 1 ? ` e mais ${rodando.length - 1}` : ''}`
    : pendentes > 0
      ? `${plural(pendentes, 'cartão', 'cartões')} aguardando você`
      : ultimo
        ? `Terminou: ${ultimo.titulo}`
        : fixo || i.estado === 'disponivel' || i.estado === 'concluido'
          ? i.resumo
          : 'Em dia, sem nada na fila'
  return {
    ...i,
    estado,
    resumo,
    pendentes,
    fila: filaDe(i, trabalhos, tarefas),
    fazendoAgora: rodando.map((t) => `${t.titulo}${t.cliente ? ` · ${t.cliente}` : ''}`),
  }
}
