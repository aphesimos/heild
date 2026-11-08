import { useContext } from 'react'
import { clientePorNome, useFluxos } from '@/ambiente/fluxos'
import { useLoja } from '@/ambiente/loja'
import { AbaCtx } from '@/components/compostos/painel-aba'
import { Button } from '@/components/ui/button'
import { BotaoAba } from '@/components/compostos/painel-aba'
import { ArrowsClockwiseIcon, BuildingsIcon, CertificateIcon, ClockCounterClockwiseIcon, HandshakeIcon, IdentificationCardIcon, KeyIcon, StampIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import { societarioDe } from '@/dados/painel-abas'

// Dados da aba do cliente aberto; a função da aba troca antes de os widgets renderizarem.
let d = societarioDe()
import { cn } from '@/lib/utils'
import { Dias, IconeSituacao, Linha, Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/**
 * Clientes e Societário (03, 6.1): quem é o cliente e o que vale para ele.
 * Ficha com versões, pessoas, acessos, certificados, contrato, processos e
 * ciclo de vida. Em carteira: certificados a vencer e clientes por estado.
 */
export function widgetsSocietario({ cliente }: CtxAba): WidgetsAba {
  d = societarioDe(cliente?.id)
  if (!cliente)
    return {
      catalogo: [certificadosCarteira, estadosCarteira],
    }
  return {
    catalogo: [ficha, pessoas, acessos, certificados, contrato, processos, ciclo],
  }
}

const ficha: DefWidget = {
  id: 'ficha',
  titulo: 'Ficha e perfil temporal',
  atividades: 'SOC-001, 002, 003, 034',
  descricao: 'Versão vigente, linha de versões e divergência com a Receita',
  icone: ClockCounterClockwiseIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <div className="flex flex-col gap-3">
      {d.divergencia ? (
        <div className="bg-warning/10 flex items-start gap-2 rounded-[14px] px-3 py-2 text-sm">
          <IconeSituacao s="atencao" className="mt-0.5" />
          <span className="min-w-0 flex-1">
            <span className="block">Receita × cadastro: {d.divergencia.campo}</span>
            <span className="text-muted-foreground block text-xs">
              Receita {d.divergencia.receita} · aqui {d.divergencia.cadastro}
            </span>
          </span>
          {t !== 'M' && (
            <BotaoAba acao={{ tipo: 'aprovacao', resumo: 'Versionar o perfil com os dados da Receita' }} size="sm" variant="ghost">
              Versionar
            </BotaoAba>
          )}
        </div>
      ) : (
        <div className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm">
          <IconeSituacao s="ok" /> Cadastro igual ao da Receita (conferido hoje às 06:10)
        </div>
      )}
      {t !== 'M' && (
        <ol className="border-border relative flex flex-col gap-2.5 border-l pl-4">
          {d.versoes.map((v) => (
            <li key={v.desde} className="relative">
              <span className={cn('absolute top-1.5 -left-[21px] size-2.5 rounded-full', v.atual ? 'bg-foreground' : 'bg-sunken ring-border ring-1')} />
              <span className="block text-sm">
                {v.motivo} {v.atual && <Badge variant="outline">vigente</Badge>}
              </span>
              <span className="text-muted-foreground block text-xs">desde {v.desde}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  ),
}

/** Contatos do cliente selecionado (os mesmos da ficha, da cobrança e do CRM). */
function PessoasDoCliente({ t }: { t: string }) {
  const ctx = useContext(AbaCtx)
  const loja = useLoja()
  const fluxos = useFluxos()
  const cliente = clientePorNome(ctx.cliente)
  const contatos = loja.fichaDe(cliente?.id)?.contatos ?? []
  if (!cliente) return <p className="text-muted-foreground py-2 text-sm">Escolha um cliente para ver as pessoas.</p>
  return (
    <div className="flex flex-col gap-2">
      <ul className={cn('divide-border/70 grid divide-y', t === 'XL' && 'grid-cols-2 gap-x-6 divide-y-0')}>
        {contatos.map((p) => (
          <Linha
            key={p.nome}
            className="py-2 first:pt-0"
            inicio={
              <span className="bg-sunken text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {p.nome
                  .replace('Dra. ', '')
                  .split(' ')
                  .map((x) => x[0])
                  .join('')}
              </span>
            }
            titulo={p.nome}
            detalhe={`${p.papel} · recebe ${p.assuntos.join(', ').replace('documentos_pendentes', 'documentos').replace('honorarios', 'honorários').replace('societario', 'societário') || 'nada'}`}
            fim={
              <span className="flex flex-col items-end gap-0.5 text-[11px]">
                <span>{p.app ? 'usa o app' : 'sem app'}</span>
                {!p.whatsapp && <span className="text-muted-foreground">sem WhatsApp</span>}
              </span>
            }
          />
        ))}
      </ul>
      <Button size="sm" variant="ghost" className="w-fit rounded-full" onClick={() => fluxos.fichaCliente(cliente.id)}>
        Editar na ficha do cliente
      </Button>
    </div>
  )
}

const pessoas: DefWidget = {
  id: 'pessoas',
  titulo: 'Pessoas e identidades',
  atividades: 'SOC-004, GES-041',
  descricao: 'Sócios, contatos por assunto, papel no app e opt-in',
  icone: IdentificationCardIcon,
  tamanhos: ['G', 'XL'],
  conteudo: (t) => <PessoasDoCliente t={t} />,
}

const acessos: DefWidget = {
  id: 'acessos',
  titulo: 'Acessos e procurações',
  atividades: 'SOC-011 a 014, PF-002',
  descricao: 'Órgão, serviço, validade e situação',
  icone: KeyIcon,
  tamanhos: ['M', 'XL'],
  conteudo: (t) =>
    t === 'M' ? (
      <div className="flex h-full items-end justify-between gap-3">
        <Numero valor={`${d.acessos.filter((a) => a.situacao === 'ok').length}/${d.acessos.length}`} legenda="acessos em dia" />
        <span className="text-muted-foreground pb-0.5 text-right text-xs">
          falta:{' '}
          {d.acessos
            .filter((a) => a.situacao !== 'ok')
            .map((a) => a.orgao)
            .join(', ')}
        </span>
      </div>
    ) : (
      <Tabela colunas={[{ rotulo: '' }, { rotulo: 'Órgão' }, { rotulo: 'Serviço' }, { rotulo: 'Validade' }]} minimo={440}>
        {d.acessos.map((a) => (
          <tr key={a.orgao}>
            <td className="w-6 py-1.5">
              <IconeSituacao s={a.situacao} />
            </td>
            <td className="py-1.5 pr-2">{a.orgao}</td>
            <td className="text-muted-foreground py-1.5 pr-2">{a.servico}</td>
            <td className="py-1.5 tabular-nums">{a.validade}</td>
          </tr>
        ))}
      </Tabela>
    ),
}

const certificados: DefWidget = {
  id: 'certificados',
  titulo: 'Certificados',
  atividades: 'SOC-008, 009, 010',
  descricao: 'Tipo, validade e onde é usado; o arquivo nunca aparece',
  icone: CertificateIcon,
  tamanhos: ['P', 'M', 'G'],
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.certificados[0].dias} legenda={`dias · ${d.certificados[0].tipo}`} alerta={d.certificados[0].dias <= 30} />
    ) : (
      <ul className="divide-border/70 flex flex-col divide-y">
        {d.certificados.length === 0 && <li className="text-muted-foreground py-2 text-sm">Sem certificado digital cadastrado.</li>}
        {d.certificados.map((c) => (
          <Linha key={c.tipo} titulo={c.tipo} detalhe={t === 'G' ? `${c.titular} · ${c.usos}` : c.validade} fim={<Dias dias={c.dias} />} />
        ))}
        {t === 'G' && (
          <li className="pt-2">
            <BotaoAba acao={{ tipo: 'feito', texto: 'Pedido de renovação do certificado A1 enviado ao app do cliente; a tarefa SOC-009 acompanha.' }} size="sm" variant="outline" className="rounded-full">
              <ArrowsClockwiseIcon /> Pedir renovação pelo app
            </BotaoAba>
          </li>
        )}
      </ul>
    ),
}

const contrato: DefWidget = {
  id: 'contrato',
  titulo: 'Contrato e honorários',
  atividades: 'SOC-015, 016, 019, 020',
  descricao: 'Proposta, contrato, termo LGPD e honorário',
  icone: HandshakeIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <div className={cn('flex h-full flex-col gap-3', t === 'M' && 'justify-end')}>
      <div>
        <span className="font-heading text-2xl font-light tabular-nums">{d.contrato.honorario}</span>
        <span className="text-muted-foreground block text-xs">
          vence {d.contrato.vencimento} · reajuste {d.contrato.reajuste}
        </span>
      </div>
      {t === 'G' && (
        <ul className="flex flex-col gap-1 text-sm">
          {[
            ['Proposta', d.contrato.proposta],
            ['Contrato', d.contrato.contrato],
            ['Termo LGPD', d.contrato.lgpd],
          ].map(([r, v]) => (
            <li key={r} className="flex items-center gap-2">
              <IconeSituacao s="ok" />
              <span className="flex-1">{r}</span>
              <span className="text-muted-foreground text-xs">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}

const processos: DefWidget = {
  id: 'processos',
  titulo: 'Legalização e processos',
  atividades: 'SOC-025 a 043',
  descricao: 'Processos por órgão, exigências, licenças e atas',
  icone: StampIcon,
  tamanhos: ['G', 'XL'],
  conteudo: () => (
    <ul className="flex flex-col gap-2">
      {d.processos.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhum processo aberto em órgão.</li>}
      {d.processos.map((p) => (
        <li key={p.processo} className={cn('flex items-start gap-3 rounded-[14px] px-3 py-2', p.situacao === 'atencao' ? 'bg-warning/10' : 'bg-raised')}>
          <IconeSituacao s={p.situacao} className="mt-0.5" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm">{p.processo}</span>
            <span className="text-muted-foreground block text-xs">
              {p.orgao} · {p.etapa} · {p.prazo}
            </span>
          </span>
        </li>
      ))}
    </ul>
  ),
}

const ciclo: DefWidget = {
  id: 'ciclo',
  titulo: 'Ciclo de vida',
  atividades: 'CIC-001 a 010',
  descricao: 'Estado do cliente e os marcos de entrada e saída',
  icone: BuildingsIcon,
  tamanhos: ['M', 'L', 'XL'],
  conteudo: (t) => (
    <div className="flex h-full flex-col justify-between gap-2">
      <ol className="flex items-center gap-1.5">
        {d.ciclo.estados.map((e, i) => (
          <li key={e} className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={cn('h-1.5 rounded-full', i < d.ciclo.atual ? 'bg-success' : i === d.ciclo.atual ? 'bg-foreground' : 'bg-sunken')} />
            {t !== 'M' && <span className={cn('truncate text-xs', i === d.ciclo.atual ? 'font-medium' : 'text-muted-foreground')}>{e}</span>}
          </li>
        ))}
      </ol>
      {t === 'M' ? (
        <span className="text-sm">
          Estado: <strong className="font-medium">{d.ciclo.estados[d.ciclo.atual]}</strong>
        </span>
      ) : (
        <p className="text-muted-foreground truncate text-xs">{d.ciclo.marcos.join(' · ')}</p>
      )}
    </div>
  ),
}

const certificadosCarteira: DefWidget = {
  id: 'carteira-certificados',
  titulo: 'Certificados a vencer',
  atividades: 'SOC-009',
  descricao: 'Certificados da carteira pela validade',
  icone: CertificateIcon,
  tamanhos: ['G', 'XL'],
  conteudo: () => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {[...d.carteira.certificados]
        .sort((a, b) => a.dias - b.dias)
        .map((c) => (
          <Linha key={c.cliente} titulo={c.cliente} detalhe={c.tipo} fim={<Dias dias={c.dias} />} />
        ))}
    </ul>
  ),
}

const estadosCarteira: DefWidget = {
  id: 'carteira-estados',
  titulo: 'Clientes por estado',
  atividades: 'CIC-001',
  descricao: 'Quantos clientes em cada estado do ciclo de vida',
  icone: BuildingsIcon,
  tamanhos: ['M', 'G'],
  conteudo: () => (
    <div className="grid h-full grid-cols-4 items-end gap-2">
      {d.carteira.estados.map((e) => (
        <div key={e.estado} className="flex min-w-0 flex-col">
          <span className="font-heading text-2xl font-light tabular-nums">{e.n}</span>
          <span className="text-muted-foreground truncate text-[11px]">{e.estado}</span>
        </div>
      ))}
    </div>
  ),
}
