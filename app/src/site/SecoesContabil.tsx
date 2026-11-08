import {
  AppWindowIcon,
  BuildingsIcon,
  CertificateIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  CloudArrowDownIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  FilesIcon,
  FolderSimpleIcon,
  HandPointingIcon,
  KeyIcon,
  ListChecksIcon,
  PercentIcon,
  ReceiptIcon,
  ScalesIcon,
  ShieldCheckIcon,
  TimerIcon,
  TrayIcon,
  UserPlusIcon,
  UsersThreeIcon,
  WalletIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { conversasCrm, canaisSetor } from '@/dados/crm'
import { resumoCobranca } from '@/dados/financeiro'
import { abasPainel, contabilDetalhe, dpDetalhe, fiscalDetalhe } from '@/dados/painel'
import { consultoriaDetalhe, notasDetalhe, societarioDetalhe, type Situacao } from '@/dados/painel-abas'
import { mesClientes, resumoDia } from '@/dados/timesheet'
import { cn } from '@/lib/utils'
import { BarraMini, LinhaMini, NumeroMini, type AbaMini } from './PainelMini'
import { ReservaAltura } from './Estavel'
import { Contador, Pares, Ponto, Secao, SecaoNaoCore, SecaoPainelAbas, brl, type ItemNaoCore, type Tom } from './SecaoProduto'

/**
 * As seções da Heild Contábil que mostram o produto: o Painel de cada setor
 * (com os widgets que a pessoa arruma), Notas e XML, o Consultor e a reforma,
 * e o resto do escritório no mesmo sistema. Dados de exemplo do produto
 * (Metalúrgica Andrade, competência 10/2026).
 */
export function SecoesContabil() {
  return (
    <>
      <SecaoPainelContabil />
      <SecaoNotas />
      <SecaoReforma />
      <SecaoNaoCoreContabil />
    </>
  )
}

const tomDe = (s: Situacao): Tom => s
const sub = 'Metalúrgica Andrade Ltda · Lucro Presumido'
const perfil = (id: string) => abasPainel.find((a) => a.id === id)

/* ---------------- 1. O Painel de cada setor ---------------- */

const abasContabil: (AbaMini & { linha: string })[] = [
  {
    id: 'fiscal',
    rotulo: 'Fiscal',
    linha: 'Caixas postais lidas todo dia, a situação fiscal, as guias de enviada a paga e as certidões.',
    sub,
    padrao: [
      { id: 'guias', tamanho: 'G' },
      { id: 'caixa', tamanho: 'P' },
      { id: 'situacao', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'guias',
        titulo: 'Guias e pagamentos',
        icone: ReceiptIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2.5">
            {fiscalDetalhe.guias.slice(0, t === 'G' ? 3 : 2).map((g) => (
              <li key={g.id} className="flex min-w-0 items-center gap-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate">{g.tributo}</span>
                {t === 'G' && <span className="hidden shrink-0 tabular-nums min-[480px]:inline">{g.valor}</span>}
                <Etapas passos={[['enviada', g.enviada], ['lida', g.lida], ['paga', g.paga]]} />
                {t === 'G' && <span className="text-muted-foreground hidden w-20 shrink-0 text-right text-xs min-[480px]:inline">vence {g.vencimento}</span>}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'caixa',
        titulo: 'Caixas postais',
        icone: TrayIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2.5">
            {fiscalDetalhe.caixaPostal.map((c) => (
              <li key={c.id} className="flex min-w-0 flex-col gap-0.5 text-sm">
                <span className="flex items-center gap-2">
                  <Ponto tom={c.tarefa ? 'atencao' : 'ok'} />
                  <span className="truncate">{c.assunto}</span>
                </span>
                <span className="text-muted-foreground pl-4 text-xs">
                  {c.orgao} · {c.ciencia}
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'situacao',
        titulo: 'Situação fiscal',
        icone: ShieldCheckIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {fiscalDetalhe.situacao.map((s) => (
              <LinhaMini key={s.orgao} detalhe={s.atual}>
                <Ponto tom={s.mudou ? 'atencao' : 'ok'} />
                <span className="truncate">{s.orgao}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'certidoes',
        titulo: 'Certidões',
        icone: CertificateIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {fiscalDetalhe.certidoes.map((c) => (
              <LinhaMini key={c.nome} detalhe={c.dias < 0 ? c.validade : `${c.dias} dias`}>
                <Ponto tom={c.dias < 0 ? 'erro' : c.dias < 30 ? 'atencao' : 'ok'} />
                <span className="truncate">{c.nome}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'dp',
    rotulo: 'DP',
    linha: 'Admissões com o prazo do S-2200 contado, as variáveis da folha, o eSocial e as férias.',
    sub: `Metalúrgica Andrade Ltda · ${dpDetalhe.quadro.ativos} empregados`,
    padrao: [
      { id: 'admissoes', tamanho: 'G' },
      { id: 'variaveis', tamanho: 'P' },
      { id: 'esocial', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'admissoes',
        titulo: 'Admissões',
        icone: UserPlusIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-3">
            {dpDetalhe.admissoes.map((a) => (
              <li key={a.id} className="flex min-w-0 flex-col gap-1.5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">
                    {a.nome} <span className="text-muted-foreground">· {a.cargo}</span>
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs">S-2200 {a.prazoS2200}</span>
                </span>
                {t === 'G' ? (
                  <span className="flex gap-1">
                    {a.etapas.map((e) => (
                      <span key={e.rotulo} className={cn('flex-1 truncate rounded-full px-2 py-0.5 text-center text-[11px]', e.feito ? 'bg-foreground text-background' : 'bg-sunken text-muted-foreground')}>
                        {e.rotulo}
                      </span>
                    ))}
                  </span>
                ) : (
                  <BarraMini valor={a.etapas.filter((e) => e.feito).length} max={a.etapas.length} rotulo={`Etapas da admissão de ${a.nome}`} />
                )}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'variaveis',
        titulo: 'Folha de novembro',
        icone: ListChecksIcon,
        conteudo: () => (
          <div className="flex flex-col gap-3">
            <NumeroMini valor={`${dpDetalhe.variaveis.filter((v) => v.recebido).length} de ${dpDetalhe.variaveis.length}`} legenda="variáveis recebidas" />
            <span className="text-muted-foreground text-xs">Falta: {dpDetalhe.variaveis.filter((v) => !v.recebido).map((v) => v.item.toLowerCase()).join(', ')}</span>
          </div>
        ),
      },
      {
        id: 'esocial',
        titulo: 'eSocial',
        icone: CheckCircleIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {dpDetalhe.esocial.map((e) => (
              <LinhaMini key={e.evento} detalhe={e.situacao}>
                <Ponto tom={e.situacao === 'aceito' ? 'ok' : e.situacao === 'rejeitado' ? 'erro' : 'atencao'} />
                <span className="truncate">{e.evento.split(' · ')[0]}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'ferias',
        titulo: 'Férias e afastamentos',
        icone: ClockIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {dpDetalhe.ferias.map((f) => (
              <li key={f.nome} className="flex min-w-0 flex-col text-sm">
                <span className="flex items-center gap-2">
                  <Ponto tom={f.alerta ? 'atencao' : 'neutro'} />
                  {f.nome}
                </span>
                <span className="text-muted-foreground truncate pl-4 text-xs">{f.detalhe}</span>
              </li>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'contabil',
    rotulo: 'Contábil',
    linha: 'O fechamento etapa por etapa: o que deve chegar, a classificação do extrato e as conciliações.',
    sub: `Metalúrgica Andrade Ltda · competência ${contabilDetalhe.competencia}`,
    padrao: [
      { id: 'etapas', tamanho: 'G' },
      { id: 'chegar', tamanho: 'P' },
      { id: 'conciliacoes', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'etapas',
        titulo: 'Fechamento',
        icone: ListChecksIcon,
        conteudo: (t) => (
          <ol className={cn('grid gap-2', t === 'G' ? 'grid-cols-5' : 'grid-cols-1')}>
            {contabilDetalhe.etapas.map((e, i) => (
              <li key={e.id} className={cn('flex min-w-0 gap-2', t === 'G' ? 'flex-col' : 'items-center')}>
                <span className={cn('h-1.5 rounded-full', t === 'G' ? 'w-full' : 'w-6 shrink-0', e.situacao === 'feito' ? 'bg-foreground' : e.situacao === 'andamento' ? 'etapa-andando bg-highlight' : 'bg-sunken')} style={{ ['--i' as string]: i }} />
                <span className="truncate text-sm">{e.rotulo}</span>
                {t === 'G' && <span className="text-muted-foreground line-clamp-2 text-[11px] leading-snug">{e.detalhe}</span>}
              </li>
            ))}
          </ol>
        ),
      },
      {
        id: 'chegar',
        titulo: 'O que deve chegar',
        icone: TrayIcon,
        conteudo: () => (
          <div className="flex flex-col gap-2.5">
            <NumeroMini valor={`${contabilDetalhe.deveChegar.filter((d) => d.chegou).length} de ${contabilDetalhe.deveChegar.length}`} legenda="documentos de outubro" />
            <ul className="flex flex-col gap-1">
              {contabilDetalhe.deveChegar
                .filter((d) => !d.chegou)
                .map((d) => (
                  <LinhaMini key={d.item} detalhe={d.quando.split(' · ')[0]}>
                    <Ponto tom="atencao" />
                    <span className="truncate">{d.item}</span>
                  </LinhaMini>
                ))}
            </ul>
          </div>
        ),
      },
      {
        id: 'conciliacoes',
        titulo: 'Conciliações',
        icone: ScalesIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2">
            {contabilDetalhe.conciliacoes.slice(0, t === 'G' ? 5 : 4).map((c) => (
              <LinhaMini key={c.id} detalhe={c.ok ? 'ok' : c.diferenca}>
                <Ponto tom={c.ok ? 'ok' : 'atencao'} />
                <span className="truncate">{c.conta}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'linhas',
        titulo: 'Classificação do extrato',
        icone: PercentIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {contabilDetalhe.linhas.slice(0, 4).map((l) => (
              <LinhaMini key={l.id} detalhe={l.confianca.toLocaleString('pt-BR')}>
                <Ponto tom={l.confianca < 0.7 ? 'atencao' : 'ok'} />
                <span className="truncate">{l.sugestao}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'societario',
    rotulo: 'Societário',
    linha: 'Certificados, procurações, sócios e os processos na Junta, na prefeitura e nos bombeiros.',
    sub,
    padrao: [
      { id: 'processos', tamanho: 'G' },
      { id: 'certificados', tamanho: 'P' },
      { id: 'acessos', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'processos',
        titulo: 'Legalização e processos',
        icone: BuildingsIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2.5">
            {societarioDetalhe.processos.map((p) => (
              <li key={p.processo} className="flex min-w-0 items-start gap-2.5 text-sm">
                <Ponto tom={tomDe(p.situacao)} className="mt-1.5" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">
                    {p.orgao} <span className="text-muted-foreground">· {p.processo}</span>
                  </span>
                  {t === 'G' && <span className="text-muted-foreground truncate text-xs">{p.etapa}</span>}
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'certificados',
        titulo: 'Certificados',
        icone: CertificateIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2.5">
            {societarioDetalhe.certificados.map((c) => (
              <li key={c.tipo} className="flex flex-col gap-1 text-sm">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate">{c.tipo}</span>
                  <span className={cn('shrink-0 text-xs tabular-nums', c.dias < 30 ? 'text-foreground font-medium' : 'text-muted-foreground')}>{c.dias} dias</span>
                </span>
                <BarraMini valor={Math.min(c.dias, 365)} max={365} tom={c.dias < 30 ? 'atencao' : 'neutro'} rotulo={`Validade do ${c.tipo}`} />
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: 'acessos',
        titulo: 'Acessos e procurações',
        icone: KeyIcon,
        conteudo: (t) => (
          <ul className="flex flex-col gap-2">
            {societarioDetalhe.acessos.slice(0, t === 'G' ? 5 : 4).map((a) => (
              <LinhaMini key={a.orgao} detalhe={a.validade}>
                <Ponto tom={tomDe(a.situacao)} />
                <span className="truncate">{a.orgao}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'pessoas',
        titulo: 'Pessoas e papel no app',
        icone: UsersThreeIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {societarioDetalhe.pessoas.map((p) => (
              <LinhaMini key={p.nome} detalhe={p.app}>
                <span className="truncate">{p.nome}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: 'notas',
    rotulo: 'Notas',
    linha: 'A captura dos XMLs de entrada, serviço e saída, a manifestação e a conferência tributária.',
    sub: `Metalúrgica Andrade Ltda · ${perfil('notas')?.perfil[0].rotulo.toLowerCase()} ${perfil('notas')?.perfil[0].valor}`,
    padrao: [
      { id: 'fluxos', tamanho: 'G' },
      { id: 'manifestacao', tamanho: 'P' },
      { id: 'tributaria', tamanho: 'P' },
    ],
    widgets: [
      {
        id: 'fluxos',
        titulo: `Captura · ${notasDetalhe.competencia}`,
        icone: CloudArrowDownIcon,
        conteudo: (t) =>
          t === 'G' ? (
            <div className="grid grid-cols-3 gap-2">
              {notasDetalhe.fluxos.map((f) => (
                <div key={f.tipo} className="bg-raised flex min-w-0 flex-col gap-1 rounded-[14px] px-3 py-2">
                  <span className="text-muted-foreground truncate text-[11px]">{f.tipo}</span>
                  <Contador valor={f.qtd} className="font-heading text-2xl font-light" />
                </div>
              ))}
            </div>
          ) : (
            <NumeroMini valor={<Contador valor={notasDetalhe.fluxos.reduce((s, f) => s + f.qtd, 0)} />} legenda="XMLs capturados no mês" />
          ),
      },
      {
        id: 'manifestacao',
        titulo: 'Manifestação',
        icone: HandPointingIcon,
        conteudo: () => (
          <div className="flex flex-col gap-2">
            <div className="flex gap-5">
              <NumeroMini valor={notasDetalhe.manifestacao.semCiencia} legenda="sem ciência" />
              <NumeroMini valor={notasDetalhe.manifestacao.semConclusao} legenda="sem conclusão" />
            </div>
            <span className="text-muted-foreground text-xs">{notasDetalhe.manifestacao.prazo}</span>
          </div>
        ),
      },
      {
        id: 'tributaria',
        titulo: 'Conferência tributária',
        icone: PercentIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {notasDetalhe.tributaria.map((n) => (
              <LinhaMini key={n.nota} detalhe={n.tipo}>
                <Ponto tom="atencao" />
                <span className="truncate">{n.nota.split(' · ')[1]}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
      {
        id: 'completude',
        titulo: 'Completude',
        icone: CheckCircleIcon,
        conteudo: () => (
          <ul className="flex flex-col gap-2">
            {notasDetalhe.completude.map((c) => (
              <LinhaMini key={c.item}>
                <Ponto tom={tomDe(c.situacao)} />
                <span className="truncate">{c.item}</span>
              </LinhaMini>
            ))}
          </ul>
        ),
      },
    ],
  },
]

/** Etapas de uma guia: enviada, lida, paga (preenchidas até onde chegou). */
function Etapas({ passos }: { passos: [string, boolean][] }) {
  const feitos = passos.filter(([, f]) => f).length
  return (
    <span className="flex shrink-0 items-center gap-1" aria-label={feitos ? `${passos[feitos - 1][0]}` : 'não enviada'} role="img">
      {passos.map(([r, f]) => (
        <span key={r} title={r} className={cn('size-2 rounded-full', f ? 'bg-foreground' : 'bg-sunken shadow-contorno')} />
      ))}
      <span className="text-muted-foreground ml-1 w-12 text-xs">{feitos ? passos[feitos - 1][0] : 'a enviar'}</span>
    </span>
  )
}

function SecaoPainelContabil() {
  return (
    <SecaoPainelAbas
      id="painel-setores"
      titulo="Um Painel para cada setor do escritório."
      texto="Cada setor abre o cliente pelo que importa para ele. Os blocos são widgets: em Editar, você esconde, troca o tamanho e arrasta. Cada aba guarda o seu arranjo."
      abas={abasContabil}
      rotulo="Painel da Heild Contábil, versão de demonstração"
    />
  )
}

/* ---------------- 2. Notas e XML ---------------- */

function SecaoNotas() {
  const [extra, setExtra] = useState(0)
  const [capturando, setCapturando] = useState(false)
  const [aberta, setAberta] = useState<string | null>(notasDetalhe.tributaria[0].nota)
  const capturar = () => {
    if (capturando || extra) return
    setCapturando(true)
    window.setTimeout(() => (setCapturando(false), setExtra(3)), 1400)
  }
  const total = notasDetalhe.fluxos.reduce((s, f) => s + f.qtd, 0)
  const m = notasDetalhe.manifestacao
  return (
    <Secao
      id="notas-xml"
      titulo="Notas e XML capturados todo dia."
      texto="O integrante Notas lê a SEFAZ e a prefeitura de madrugada, traz os XMLs de entrada, de serviço e de saída, e confere o imposto de cada nota antes do fechamento."
      className="faixa-suave"
      visual={
        <div data-luz className="bg-background shadow-painel flex flex-col gap-4 rounded-[28px] p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex min-w-0 flex-1 basis-full items-center gap-2.5 text-sm min-[480px]:basis-auto">
              <Ponto tom="ok" vivo />
              <span className="min-w-0 truncate">
                {extra ? 'Captura agora · 3 notas novas' : `Última captura ${notasDetalhe.captura[4].valor}`}
              </span>
            </span>
            <button type="button" onClick={capturar} disabled={capturando || !!extra} className="botao bg-surface shadow-contorno hover:bg-raised flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm disabled:cursor-default disabled:opacity-70">
              <CloudArrowDownIcon className={cn('size-4', capturando && 'captura-pulsa')} />
              {capturando ? 'Lendo SEFAZ e prefeitura' : extra ? 'Capturado' : 'Forçar captura'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {notasDetalhe.fluxos.map((f) => (
              <div key={f.tipo} className="bg-surface flex min-w-0 flex-col gap-1.5 rounded-[20px] p-3 sm:p-4">
                <span className="text-muted-foreground text-xs leading-snug whitespace-pre-line sm:text-sm sm:whitespace-normal">{f.tipo.replace(' (', '\n(')}</span>
                <Contador valor={f.qtd} className="font-heading mt-auto text-3xl font-light tracking-[-0.03em] sm:text-4xl" />
                <span className={cn('hidden truncate text-xs sm:block', f.paridade !== f.qtd ? 'text-foreground' : 'text-muted-foreground')}>
                  {f.paridade === f.qtd ? `${f.fonte} · paridade ok` : `a antiga achou ${f.paridade}`}
                </span>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground flex flex-wrap items-baseline gap-x-6 gap-y-1 px-1 text-sm">
            <span>
              <Contador valor={total + extra} className="text-foreground font-medium" /> XMLs em {notasDetalhe.competencia}
            </span>
            <span>
              Manifestação: <span className="text-foreground">{m.semCiencia}</span> sem ciência, <span className="text-foreground">{m.semConclusao}</span> sem conclusão · {m.prazo}
            </span>
          </div>
          {/* Cada nota aberta tem uma altura; a lista reserva a da maior. */}
          <ReservaAltura variantes={notasDetalhe.tributaria.filter((n) => n.nota !== aberta).map((n) => <ConferenciaNotas key={n.nota} aberta={n.nota} />)}>
            <ConferenciaNotas aberta={aberta} onAbrir={setAberta} />
          </ReservaAltura>
        </div>
      }
    >
      <Pares
        itens={[
          ['Captura', 'CNPJs, inscrições, certificado e autXML conferidos todo dia, com a paridade contra a ferramenta antiga durante a troca.'],
          ['Manifestação', 'Resumos sem ciência e notas sem evento conclusivo, com o prazo. O evento conclusivo passa pela sua aprovação.'],
          ['Conferência', 'NCM, CST, CFOP, ST, DIFAL e ISS de cada nota; buracos na sequência e compras que só aparecem no extrato.'],
        ]}
      />
    </Secao>
  )
}

/* ---------------- 3. O Consultor e a reforma ---------------- */

/** O calendário da transição (LC 214/2025), como o Consultor usa para responder pela data do fato. */
const transicao: { ano: string; titulo: string; texto: string }[] = [
  { ano: '2026', titulo: 'Ano de teste', texto: 'CBS e IBS aparecem destacados na nota, com alíquotas de teste. Os tributos de hoje continuam valendo.' },
  { ano: '2027', titulo: 'A CBS entra', texto: 'A CBS substitui o PIS e a Cofins. É quando o preço de venda e o crédito começam a mudar.' },
  { ano: '2029 a 2032', titulo: 'ICMS e ISS diminuem', texto: 'O ICMS e o ISS caem um pouco a cada ano enquanto o IBS sobe, até a troca completa.' },
  { ano: '2033', titulo: 'Só IBS e CBS', texto: 'O ICMS e o ISS deixam de existir. A carga passa a ser a do IVA dual.' },
]

function SecaoReforma() {
  const [k, setK] = useState(1)
  const t = transicao[k]
  const parecer = consultoriaDetalhe.pareceres[0]
  return (
    <Secao
      id="reforma"
      titulo="O Consultor acompanha a reforma tributária por você."
      texto="Ele vigia a legislação, avisa o que muda para cada cliente e responde pela redação que vale na data do fato. O simulador compara a carga de hoje com a de IBS e CBS, ano a ano da transição, com os números da empresa."
      visual={
        <div data-luz className="bg-background shadow-painel flex flex-col gap-4 rounded-[28px] p-4 sm:p-6">
          <div role="tablist" aria-label="Anos da transição" className="grid grid-cols-2 gap-1.5 min-[520px]:grid-cols-4">
            {transicao.map((x, i) => (
              <button
                key={x.ano}
                role="tab"
                type="button"
                aria-selected={i === k}
                onClick={() => setK(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setK(i)}
                className={cn('ano-reforma flex cursor-pointer flex-col items-start gap-2 rounded-[18px] px-3.5 py-3 text-left transition-colors', i === k ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-raised')}
              >
                <span className={cn('h-1 w-full rounded-full', i === k ? 'bg-primary-foreground/40' : 'bg-sunken')}>
                  <span className={cn('block h-full rounded-full', i <= k ? (i === k ? 'bg-primary-foreground' : 'bg-foreground/60') : '')} style={{ width: i <= k ? '100%' : 0, transition: 'width .5s cubic-bezier(.16,1,.3,1)' }} />
                </span>
                <span className="text-sm font-medium tabular-nums">{x.ano}</span>
              </button>
            ))}
          </div>
          {/* Os textos de todos os anos ocupam a mesma célula: a altura não muda ao passar o cursor pelos anos. */}
          <div className="grid px-1">
            {transicao.map((x) =>
              x.ano === t.ano ? (
                <div key={x.ano} className="entra flex flex-col gap-1 [grid-area:1/1]">
                  <span className="font-heading text-2xl font-light tracking-[-0.02em]">{x.titulo}</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{x.texto}</span>
                </div>
              ) : (
                <div key={x.ano} aria-hidden className="invisible flex flex-col gap-1 [grid-area:1/1]">
                  <span className="font-heading text-2xl font-light tracking-[-0.02em]">{x.titulo}</span>
                  <span className="text-sm leading-relaxed">{x.texto}</span>
                </div>
              ),
            )}
          </div>
          <div className="bg-surface flex flex-col gap-1 rounded-[20px] p-2">
            <span className="text-muted-foreground px-3 pt-2 pb-1 text-sm">Avisos do Consultor · Metalúrgica Andrade</span>
            {consultoriaDetalhe.vigilancia.map((v) => (
              <div key={v.aviso} className="aviso-reforma flex items-start gap-3 rounded-[14px] px-3 py-2.5">
                <Ponto tom={tomDe(v.nivel)} className="mt-1.5" />
                <span className="flex min-w-0 flex-col gap-0.5 text-sm">
                  <span>{v.aviso}</span>
                  <span className="text-muted-foreground text-xs">{v.impacto}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="bg-surface flex items-center gap-3 rounded-[20px] p-4">
            <span className="bg-sunken flex size-10 shrink-0 items-center justify-center rounded-full">
              <FileTextIcon className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">Parecer · {parecer.titulo}</span>
              <span className="text-muted-foreground truncate text-xs">
                {parecer.data} · {parecer.base} · {parecer.citacoes} trechos citados
              </span>
            </span>
          </div>
        </div>
      }
    >
      <Pares
        itens={[
          ['Resposta com a fonte', 'O artigo, a data de vigência, o trecho citado e o grau de segurança. Sem base suficiente, ele diz que não encontrou.'],
          ['Vigilância por cliente', 'Norma nova, fator R, sublimite e dividendos: o aviso chega no Painel do cliente que é afetado.'],
          ['Simulador da reforma', 'A carga de hoje contra a carga com IBS e CBS em cada ano da transição, com as notas e o perfil da empresa. O contador revisa cada versão.'],
        ]}
      />
    </Secao>
  )
}

/* ---------------- 4. O resto do escritório ---------------- */

const conversa = conversasCrm[0]
const msgs = conversa.itens.filter((x): x is Extract<typeof x, { tipo: 'mensagem' }> => x.tipo === 'mensagem')
const fiscalNumero = canaisSetor.find((c) => c.setor === 'fiscal')?.numero
const fmtMin = (m: number) => `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`

const itensContabil: ItemNaoCore[] = [
  {
    id: 'crm',
    nome: 'CRM com WhatsApp',
    icone: ChatCircleDotsIcon,
    linha: 'Cada setor com o seu número e uma fila de conversas. O integrante responde o que sabe e passa o resto para uma pessoa.',
    previa: (
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="shrink-0 font-medium whitespace-nowrap">{conversa.pessoa.nome}</span>
          <span className="text-muted-foreground min-w-0 truncate">· {conversa.cliente} · WhatsApp do Fiscal</span>
        </div>
        <div className="flex flex-col gap-2">
          {msgs.slice(0, 4).map((m, i) => {
            const delas = m.de === 'cliente'
            return (
              <div key={m.id} className={cn('bolha-nc max-w-[85%] rounded-[16px] px-3.5 py-2 text-sm leading-relaxed', delas ? 'bg-background shadow-contorno self-start' : 'bg-primary text-primary-foreground self-end')} style={{ ['--i' as string]: i }}>
                {m.texto}
                <span className={cn('mt-0.5 block text-[11px]', delas ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                  {m.de === 'integrante' ? 'Fiscal (integrante) · ' : m.de === 'auto' ? 'resposta automática · ' : ''}
                  {m.hora}
                </span>
              </div>
            )
          })}
        </div>
        <span className="text-muted-foreground mt-auto text-xs">Número do Fiscal: {fiscalNumero}</span>
      </div>
    ),
  },
  {
    id: 'timesheet',
    nome: 'Timesheet',
    icone: TimerIcon,
    linha: 'As horas se registram pelo que a pessoa faz no sistema e no WhatsApp. O resto ela só confirma.',
    previa: (
      <div className="flex h-full flex-col gap-5">
        <div className="flex flex-wrap gap-6">
          <NumeroMini valor={fmtMin(resumoDia.registradas)} legenda="registradas hoje" />
          <NumeroMini valor={fmtMin(resumoDia.automaticas)} legenda="sem ninguém digitar" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">Horas do mês por cliente</span>
          {mesClientes.slice(0, 4).map((c, i) => (
            <div key={c.nome} className="flex flex-col gap-1">
              <span className="flex justify-between gap-2 text-sm">
                <span className="truncate">{c.nome}</span>
                <span className="text-muted-foreground shrink-0 tabular-nums">{c.h.toLocaleString('pt-BR')} h</span>
              </span>
              <BarraMini valor={c.h} max={mesClientes[0].h} i={i} rotulo={`Horas de ${c.nome}`} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'financeiro',
    nome: 'Financeiro do escritório',
    icone: WalletIcon,
    linha: 'Contratos, cobrança dos honorários com régua, contas a pagar, conciliação e o resultado do escritório.',
    previa: (
      <div className="flex h-full flex-col gap-4">
        <span className="text-muted-foreground text-sm">Cobranças de {resumoCobranca.competencia}</span>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['emitidas', resumoCobranca.emitidas],
              ['recebidas', resumoCobranca.recebidas],
              ['a vencer', resumoCobranca.aVencer],
              ['vencidas', resumoCobranca.vencidas],
            ] as const
          ).map(([r, v]) => (
            <div key={r} className="bg-background shadow-contorno flex min-w-0 flex-col gap-1 rounded-[16px] p-3">
              <span className="font-heading text-2xl font-light tabular-nums">
                <Contador valor={v.n} />
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {r} · {brl(v.valor)}
              </span>
            </div>
          ))}
        </div>
        <span className="text-muted-foreground mt-auto text-xs">Inadimplência acima de 90 dias: {resumoCobranca.inadimplencia90.toLocaleString('pt-BR')}%</span>
      </div>
    ),
  },
  {
    id: 'arquivos',
    nome: 'Arquivos',
    icone: FilesIcon,
    linha: 'Cada arquivo tem um lugar só e abre de qualquer menção. O cliente vê o que a pasta permite.',
    previa: (
      <div className="flex h-full flex-col gap-3">
        <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
          <FolderSimpleIcon className="size-4 shrink-0" /> <span className="truncate">Metalúrgica Andrade / Fiscal</span>
        </span>
        <ul className="flex flex-col gap-1.5">
          {perfil('fiscal')?.documentos.map((d, i) => (
            <li key={d.id} className="bolha-nc bg-background shadow-contorno flex min-w-0 items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm" style={{ ['--i' as string]: i }}>
              <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{d.nome}</span>
                <span className="text-muted-foreground truncate text-xs">{d.enviadoPor}</span>
              </span>
              <span className="text-muted-foreground hidden shrink-0 text-xs min-[420px]:inline">{d.visivelNoApp ? 'no app' : 'só escritório'}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'app',
    nome: 'App do cliente',
    icone: AppWindowIcon,
    linha: 'O cliente manda documentos, vê as guias e as pendências, aprova o que é dele e conversa no mesmo fio do WhatsApp.',
    previa: (
      <div className="flex h-full items-start justify-center">
        <div className="bg-background shadow-painel flex w-full max-w-[280px] flex-col gap-3 rounded-[28px] p-4">
          <span className="text-muted-foreground text-xs">Metalúrgica Andrade</span>
          <div className="bg-surface flex flex-col gap-1 rounded-[18px] p-3">
            <span className="text-muted-foreground text-xs">Guia para pagar</span>
            <span className="text-sm font-medium">{fiscalDetalhe.guias[0].tributo} {fiscalDetalhe.guias[0].competencia}</span>
            <span className="font-heading text-2xl font-light tabular-nums">{fiscalDetalhe.guias[0].valor}</span>
            <span className="text-muted-foreground text-xs">vence {fiscalDetalhe.guias[0].vencimento}</span>
          </div>
          <div className="bg-surface flex flex-col gap-2 rounded-[18px] p-3">
            <span className="text-muted-foreground text-xs">O escritório precisa de</span>
            {[perfil('dp')?.pendencias[0].item, perfil('contabil')?.pendencias[0].item].map((p) => (
              <span key={p} className="flex items-start gap-2 text-sm">
                <CircleIcon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
                {p}
              </span>
            ))}
          </div>
          <span className="bg-primary text-primary-foreground flex h-10 items-center justify-center gap-2 rounded-full text-sm font-medium">
            <EnvelopeSimpleIcon className="size-4" /> Enviar documento
          </span>
        </div>
      </div>
    ),
  },
]

function SecaoNaoCoreContabil() {
  return (
    <SecaoNaoCore
      id="tudo-junto"
      titulo="CRM, timesheet, financeiro e arquivos no mesmo sistema."
      texto="O que o escritório costuma assinar à parte já vem junto, sobre o mesmo cadastro de clientes. A conversa do WhatsApp vira tarefa, o tempo gasto nela entra no timesheet e a rentabilidade de cada cliente sai sozinha."
      itens={itensContabil}
      pares={[
        ['Um cadastro só', 'O cliente, os contatos e os documentos são os mesmos no Painel, no CRM, no financeiro e no app.'],
        ['Sem digitar duas vezes', 'A guia anexada no WhatsApp é o mesmo arquivo que está em Arquivos e no app do cliente.'],
      ]}
    />
  )
}


function ConferenciaNotas({ aberta, onAbrir }: { aberta: string | null; onAbrir?: (n: string | null) => void }) {
  return (
    <div className="bg-surface flex flex-col rounded-[20px] p-2">
      <span className="text-muted-foreground px-3 pt-2 pb-1 text-sm">Conferência tributária</span>
      {notasDetalhe.tributaria.map((n) => {
        const ab = aberta === n.nota
        return (
          <button key={n.nota} type="button" aria-expanded={ab} onClick={() => onAbrir?.(ab ? null : n.nota)} className={cn('flex cursor-pointer flex-col gap-1 rounded-[14px] px-3 py-2.5 text-left transition-colors', ab ? 'bg-background shadow-contorno' : 'hover:bg-background/60')}>
            <span className="flex items-center gap-2.5 text-sm">
              <WarningCircleIcon className="text-warning size-4 shrink-0" weight="fill" />
              <span className="min-w-0 flex-1 truncate">{n.nota}</span>
              <span className="text-muted-foreground shrink-0 text-xs">{n.tipo}</span>
            </span>
            <span data-aberto={ab} className="setor-linha text-muted-foreground pl-6.5 text-sm">
              <span>{n.alerta}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
