import type { OrbReaction } from '@/vendor/orb-avatar/orb-avatar'

/**
 * Estado de trabalho de um integrante do time (subplano 02, seções 4 e 9.2).
 * Cada estado mapeia para uma reação do orb.
 */
export type EstadoIntegrante =
  | 'disponivel'
  | 'trabalhando'
  | 'pensando'
  | 'precisa_de_voce'
  | 'concluido'
  | 'dormindo'
  | 'erro'

export const reacaoDoEstado: Record<EstadoIntegrante, OrbReaction> = {
  disponivel: 'idle',
  trabalhando: 'working',
  pensando: 'thinking',
  precisa_de_voce: 'needs',
  concluido: 'done',
  dormindo: 'sleeping',
  erro: 'error',
}

export const rotuloDoEstado: Record<EstadoIntegrante, string> = {
  disponivel: 'Disponível',
  trabalhando: 'Trabalhando',
  pensando: 'Pensando',
  precisa_de_voce: 'Precisa de você',
  concluido: 'Concluído',
  dormindo: 'Em espera',
  erro: 'Com erro',
}

export const estados = Object.keys(reacaoDoEstado) as EstadoIntegrante[]
