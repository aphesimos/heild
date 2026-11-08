import { BotaoAba } from '@/components/compostos/painel-aba'
import { BinocularsIcon, ChatsCircleIcon, FlaskIcon, ScrollIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import { VazioWidget } from '@/components/widgets/widget'
import { consultoriaDetalhe as d } from '@/dados/painel-abas'
import { cn } from '@/lib/utils'
import { IconeSituacao, Linha, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/**
 * Consultoria e Reforma (03, 6.7): perguntas técnicas com rascunho sempre
 * revisado por uma pessoa, pareceres com citação e versão da base, e a
 * vigilância do Consultor. Simulações ficam para a fase 4.
 */
export function widgetsConsultoria({ cliente }: CtxAba): WidgetsAba {
  if (!cliente)
    return {
      catalogo: [carteira, simulacoes],
    }
  return {
    catalogo: [perguntas, vigilancia, pareceres, simulacoes],
  }
}

const perguntas: DefWidget = {
  id: 'perguntas',
  titulo: 'Perguntas técnicas',
  atividades: 'CON-001, 002',
  descricao: 'Por canal e status; o rascunho do Consultor sempre passa por uma pessoa',
  icone: ChatsCircleIcon,
  tamanhos: ['G', 'XL'],
  conteudo: () => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {d.perguntas.map((q) => (
        <Linha
          key={q.id}
          titulo={q.pergunta}
          detalhe={`${q.quem} · ${q.canal} · ${q.quando}`}
          fim={
            q.status === 'rascunho pronto' ? (
              <BotaoAba acao={{ tipo: 'tarefa', codigo: 'CON-008', titulo: q.pergunta }} size="sm" variant="outline" className="rounded-full">
                Revisar rascunho
              </BotaoAba>
            ) : (
              <Badge variant="outline">{q.status}</Badge>
            )
          }
        />
      ))}
    </ul>
  ),
}

const pareceres: DefWidget = {
  id: 'pareceres',
  titulo: 'Pareceres do cliente',
  atividades: 'CON-002',
  descricao: 'Enviados, com citações, data e versão da base legal',
  icone: ScrollIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {d.pareceres.slice(0, t === 'M' ? 1 : 3).map((p) => (
        <Linha key={p.titulo} titulo={p.titulo} detalhe={`${p.data} · ${p.base} · ${p.citacoes} citações`} />
      ))}
    </ul>
  ),
}

const vigilancia: DefWidget = {
  id: 'vigilancia',
  titulo: 'Vigilância e enquadramento',
  atividades: 'CON-004, 010',
  descricao: 'Avisos do Consultor: norma nova, Reforma, limites do regime',
  icone: BinocularsIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="flex flex-col gap-2">
      {(t === 'M' ? d.vigilancia.filter((v) => v.nivel !== 'ok').slice(0, 1) : d.vigilancia).map((v) => (
        <li key={v.aviso} className={cn('flex items-start gap-2.5 rounded-[14px] px-3 py-2', v.nivel === 'atencao' ? 'bg-warning/10' : 'bg-raised')}>
          <IconeSituacao s={v.nivel} className="mt-0.5" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm">{v.aviso}</span>
            <span className="text-muted-foreground block text-xs">{v.impacto}</span>
          </span>
        </li>
      ))}
    </ul>
  ),
}

const simulacoes: DefWidget = {
  id: 'simulacoes',
  titulo: 'Simulações',
  atividades: 'fase 4',
  descricao: 'Comparar regimes e cenários da Reforma (fase 4)',
  icone: FlaskIcon,
  tamanhos: ['P', 'M'],
  conteudo: () => <VazioWidget>Chega na fase 4.</VazioWidget>,
}

const carteira: DefWidget = {
  id: 'carteira-consultoria',
  titulo: 'Consultoria na carteira',
  atividades: 'CON-001, 004',
  descricao: 'Perguntas abertas e avisos do Consultor por cliente',
  icone: ChatsCircleIcon,
  tamanhos: ['G', 'XL'],
  conteudo: () => (
    <Tabela colunas={[{ rotulo: 'Cliente' }, { rotulo: 'Perguntas abertas', direita: true }, { rotulo: 'Avisos', direita: true }]} minimo={300}>
      {d.carteira.map((c) => (
        <tr key={c.cliente}>
          <td className="py-2 pr-2">{c.cliente}</td>
          <td className={cn('py-2 pr-2 text-right tabular-nums', c.abertas > 0 && 'font-medium')}>{c.abertas || '·'}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.avisos || '·'}</td>
        </tr>
      ))}
    </Tabela>
  ),
}
