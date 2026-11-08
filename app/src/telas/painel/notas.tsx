import { BotaoAba } from '@/components/compostos/painel-aba'
import { CloudArrowDownIcon, GearSixIcon, HandPointingIcon, MagnifyingGlassIcon, PackageIcon, PercentIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import { notasDe } from '@/dados/painel-abas'

// Dados da aba do cliente aberto; a função da aba troca antes de os widgets renderizarem.
let d = notasDe()
import { cn } from '@/lib/utils'
import { IconeSituacao, Linha, Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/**
 * Notas fiscais (03, 6.3): captura, manifestação, completude, conferência
 * tributária e envio ao core. Em carteira: a captura de cada cliente.
 */
export function widgetsNotas({ cliente }: CtxAba): WidgetsAba {
  d = notasDe(cliente?.id)
  if (!cliente)
    return {
      catalogo: [capturaCarteira, manifestacao],
    }
  return {
    catalogo: [fluxos, configuracao, manifestacao, completude, tributaria, lotes],
  }
}

const configuracao: DefWidget = {
  id: 'configuracao',
  titulo: 'Configuração de captura',
  atividades: 'NFE-001, 003, 503, 504',
  descricao: 'CNPJs, inscrições, certificado, autXML e a situação diária',
  icone: GearSixIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="flex flex-col gap-1.5">
      {(t === 'M' ? d.captura.filter((c) => c.situacao !== 'ok').concat(d.captura.slice(-1)) : d.captura).map((c) => (
        <li key={c.item} className="flex items-center gap-2.5 text-sm">
          <IconeSituacao s={c.situacao} />
          <span className="min-w-0 flex-1 truncate">{c.item}</span>
          <span className="text-muted-foreground shrink-0 text-xs">{c.valor}</span>
        </li>
      ))}
    </ul>
  ),
}

const fluxos: DefWidget = {
  id: 'fluxos',
  titulo: `Captura · ${d.competencia}`,
  atividades: 'NFE-004 a 013',
  descricao: 'Entradas, serviços e saídas por fonte, com a paridade da ferramenta antiga',
  icone: CloudArrowDownIcon,
  tamanhos: ['M', 'L', 'XL'],
  acao: (
    <BotaoAba acao={{ tipo: 'feito', texto: 'Captura forçada: o integrante Notas leu SEFAZ e prefeitura agora e trouxe 3 notas novas.' }} size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs">
      Forçar captura
    </BotaoAba>
  ),
  conteudo: (t) =>
    t === 'M' ? (
      <Numero valor={d.fluxos.reduce((s, f) => s + f.qtd, 0)} legenda="XMLs capturados no mês" />
    ) : (
      <div className="grid h-full grid-cols-3 gap-2">
        {d.fluxos.map((f) => (
          <div key={f.tipo} className="bg-raised flex min-w-0 flex-col justify-between rounded-[14px] px-3 py-2">
            <span className="text-muted-foreground truncate text-[11px]">{f.tipo}</span>
            <span className="font-heading text-2xl font-light tabular-nums">{f.qtd}</span>
            <span className={cn('truncate text-[11px]', f.paridade !== f.qtd ? 'text-warning font-medium' : 'text-muted-foreground')}>{f.paridade === f.qtd ? `${f.fonte} · paridade ok` : `antiga achou ${f.paridade}`}</span>
          </div>
        ))}
      </div>
    ),
}

const manifestacao: DefWidget = {
  id: 'manifestacao',
  titulo: 'Manifestação',
  atividades: 'NFE-014, 015, 016',
  descricao: 'Resumos sem ciência e notas sem evento conclusivo',
  icone: HandPointingIcon,
  tamanhos: ['P', 'M', 'G'],
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.manifestacao.semConclusao} legenda="sem conclusão" alerta />
    ) : (
      <div className="flex h-full flex-col justify-end gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-light tabular-nums">{d.manifestacao.semCiencia}</span>
            <span className="text-muted-foreground text-[11px]">resumos sem ciência</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-warning text-2xl font-light tabular-nums">{d.manifestacao.semConclusao}</span>
            <span className="text-muted-foreground text-[11px]">{d.manifestacao.prazo}</span>
          </div>
        </div>
        {t === 'G' && (
          <BotaoAba acao={{ tipo: 'aprovacao', resumo: 'Manifestar ciência das notas sem conclusão' }} size="sm" variant="outline" className="w-fit rounded-full">
            Manifestar · executar com aprovação
          </BotaoAba>
        )}
      </div>
    ),
}

const completude: DefWidget = {
  id: 'completude',
  titulo: 'Completude e conferência',
  atividades: 'NFE-020 a 035',
  descricao: 'Buracos de sequência, compras sem XML, receita × declarada',
  icone: MagnifyingGlassIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {d.completude.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nada a conferir.</li>}
      {(t === 'M' ? d.completude.filter((c) => c.situacao !== 'ok') : d.completude).map((c) => (
        <Linha key={c.item} inicio={<IconeSituacao s={c.situacao} />} titulo={c.item} detalhe={c.valor} />
      ))}
    </ul>
  ),
}

const tributaria: DefWidget = {
  id: 'tributaria',
  titulo: 'Conferência tributária',
  atividades: 'NFE-023 a 027',
  descricao: 'NCM, CST, CFOP, ST, DIFAL e ISS nas notas do mês',
  icone: PercentIcon,
  tamanhos: ['P', 'G', 'XL'],
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.tributaria.length} legenda="divergências" alerta />
    ) : (
      <ul className="divide-border/70 flex flex-col divide-y">
        {d.tributaria.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhuma divergência tributária nas notas.</li>}
        {d.tributaria.map((x) => (
          <Linha
            key={x.nota}
            inicio={
              <Badge variant="outline" className="w-14 justify-center">
                {x.tipo}
              </Badge>
            }
            titulo={x.alerta}
            detalhe={x.nota}
            fim={
              t !== 'G' ? (
                <BotaoAba acao={{ tipo: 'tarefa', codigo: 'NFE-025', titulo: x.alerta }} size="sm" variant="ghost">
                  Abrir tarefa
                </BotaoAba>
              ) : undefined
            }
          />
        ))}
      </ul>
    ),
}

const lotes: DefWidget = {
  id: 'lotes',
  titulo: 'Envio ao core e guarda',
  atividades: 'NFE-033, 034, 036',
  descricao: 'Lotes por competência, erros e pacote de guarda',
  icone: PackageIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {d.lotes.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhum lote para enviar.</li>}
      {(t === 'M' ? d.lotes.filter((l) => l.erros) : d.lotes).map((l) => (
        <Linha
          key={l.lote}
          inicio={<IconeSituacao s={l.erros ? 'erro' : 'ok'} />}
          titulo={l.lote}
          detalhe={l.situacao}
          fim={
            l.erros && t === 'G' ? (
              <BotaoAba acao={{ tipo: 'feito', texto: `Lote ${l.lote} reenviado ao sistema contábil.` }} size="sm" variant="ghost">
                Reenviar
              </BotaoAba>
            ) : undefined
          }
        />
      ))}
    </ul>
  ),
}

const capturaCarteira: DefWidget = {
  id: 'carteira-captura',
  titulo: 'Captura da carteira',
  atividades: 'NFE-503',
  descricao: 'Última captura e volume de cada cliente',
  icone: CloudArrowDownIcon,
  tamanhos: ['XL'],
  conteudo: () => (
    <Tabela colunas={[{ rotulo: '' }, { rotulo: 'Cliente' }, { rotulo: 'Última captura' }, { rotulo: 'Entradas', direita: true }, { rotulo: 'Saídas', direita: true }]} minimo={520}>
      {d.carteira.map((c) => (
        <tr key={c.cliente}>
          <td className="w-6 py-2">
            <IconeSituacao s={c.situacao} />
          </td>
          <td className="py-2 pr-2">{c.cliente}</td>
          <td className={cn('py-2 pr-2', c.situacao === 'ok' ? 'text-muted-foreground' : 'font-medium')}>{c.ultima}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.entradas.toLocaleString('pt-BR')}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.saidas.toLocaleString('pt-BR')}</td>
        </tr>
      ))}
    </Tabela>
  ),
}
