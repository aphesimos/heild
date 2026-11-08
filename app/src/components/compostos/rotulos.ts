import type { StatusTarefa } from '@/dados/tipos'

export const rotuloStatus: Record<StatusTarefa, string> = {
  a_fazer: 'a fazer',
  em_andamento: 'em andamento',
  aguardando_cliente: 'aguard. cliente',
  concluida: 'concluída',
}
