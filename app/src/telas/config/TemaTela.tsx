import { CheckCircleIcon, ClockCounterClockwiseIcon, GlobeIcon, ImageIcon, PencilSimpleIcon, SpinnerIcon, WarningIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { BotaoFeito } from '@/ambiente/interface'
import { useState, type CSSProperties } from 'react'
import { Caixa, Propriedade, TituloBloco } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Segmentado } from '@/components/ui/formulario'
import { Orb } from '@/components/ui/orb'
import { versoesTema as versoesIniciais } from '@/dados/configuracoes'
import { rotuloSetor } from '@/dados/crm'
import { useTema } from '@/theme/ThemeProvider'
import type { ModoCor, SetorIntegrante, Tema, TokensTema } from '@/theme/tipos'
import { textoSobre, tokensDoModo, variaveisCss } from '@/theme/variaveis'
import { CabecalhoConfig } from './EscritorioTela'

/** Contraste WCAG entre duas cores hex. */
function contraste(a: string, b: string) {
  const lum = (h: string) => {
    const m = h.replace('#', '').match(/.{2}/g)
    if (!m || m.length < 3) return 0.5
    const [r, g, bl] = m.slice(0, 3).map((x) => {
      const c = parseInt(x, 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const fontes = [
  {
    valor: '"PP Neue Montreal", ui-sans-serif, system-ui, sans-serif',
    rotulo: 'PP Neue Montreal',
  },
  {
    valor: 'ui-sans-serif, system-ui, sans-serif',
    rotulo: 'Sistema (sem serifa)',
  },
  {
    valor: 'ui-rounded, ui-sans-serif, system-ui, sans-serif',
    rotulo: 'Arredondada',
  },
  { valor: 'ui-serif, Georgia, serif', rotulo: 'Com serifa' },
]

const camposCor: { chave: keyof TokensTema; rotulo: string; ajuda: string }[] = [
  {
    chave: 'primaria',
    rotulo: 'Primária',
    ajuda: 'botões principais, seleção',
  },
  { chave: 'fundo', rotulo: 'Fundo', ajuda: 'a página' },
  { chave: 'texto', rotulo: 'Texto', ajuda: 'e o orb do Assistente' },
  {
    chave: 'destaque',
    rotulo: 'Destaque da marca',
    ajuda: 'detalhes de identidade',
  },
  { chave: 'atencao', rotulo: 'Atenção', ajuda: 'prazo, falta, urgente' },
  { chave: 'erro', rotulo: 'Erro', ajuda: 'atraso, rejeição' },
  { chave: 'sucesso', rotulo: 'Sucesso', ajuda: 'feito, pago, aprovado' },
]

const modelosTexto = [
  {
    chave: 'assinatura_email',
    grupo: 'Documentos',
    texto: '{pessoa} · {setor} · {escritorio} · {telefone}',
  },
  {
    chave: 'saudacao',
    grupo: 'Atendimento',
    texto: 'Olá, {nome}! Aqui é o {escritorio}.',
  },
  {
    chave: 'convite_app',
    grupo: 'App do cliente',
    texto: '{nome}, a {empresa} agora acompanha tudo com o {escritorio} pelo app. Toque para entrar: {link}',
  },
  {
    chave: 'tudo_em_dia',
    grupo: 'App do cliente',
    texto: 'Tudo em dia por aqui. Nada pendente com você este mês.',
  },
  {
    chave: 'termo_timesheet',
    grupo: 'Equipe',
    texto: 'Registramos o tempo de trabalho por cliente para saber quanto cada um custa e acabar com o apontamento manual…',
  },
  {
    chave: 'timesheet_apresentacao',
    grupo: 'Equipe',
    texto: 'Ninguém precisa mais apontar horas; vocês confirmam o que o sistema deduziu, e cada um vê os próprios dados primeiro.',
  },
  {
    chave: 'rodape_email',
    grupo: 'Documentos',
    texto: '{escritorio} · CRC {crc} · {telefone}',
  },
  {
    chave: 'cabecalho_relatorio',
    grupo: 'Documentos',
    texto: '{escritorio} · relatório de {competencia} · {empresa}',
  },
]

/**
 * Configurações › Tema (Fundações 10): a marca branca. Identidade, cores do
 * claro e do escuro com prévia ao vivo e checagem de contraste, tipografia e
 * raio, domínios e remetente com verificação, integrantes padrão, modelos de
 * texto e versões (publicar cria nova versão; documentos guardam a versão).
 */
export function TemaTela() {
  const { tema } = useTema()
  const [r, setR] = useState<Tema>(() => JSON.parse(JSON.stringify(tema)))
  const [modo, setModo] = useState<ModoCor>('claro')
  const [versoes, setVersoes] = usePersistente('cfg.tema.versoes', versoesIniciais)
  const [modal, setModal] = useState<'publicar' | 'dominio' | 'email' | 'logo' | null>(null)
  const [integranteEd, setIntegranteEd] = useState<SetorIntegrante | null>(null)
  const [modeloEd, setModeloEd] = useState<string | null>(null)
  const [modelos, setModelos] = usePersistente('cfg.tema.modelos', modelosTexto)
  const [dominios, setDominios] = usePersistente('cfg.tema.dominios', {
    painel: { host: 'painel.contabilandrade.com.br', ok: true },
    app: { host: 'app.contabilandrade.com.br', ok: false },
  })
  const [remetente, setRemetente] = usePersistente('cfg.tema.remetente', {
    nome: 'Contábil Andrade & Lima',
    email: 'atendimento@contabilandrade.com.br',
    ok: true,
  })
  const alterado = JSON.stringify(r) !== JSON.stringify(tema)
  const t = tokensDoModo(r, modo)

  const setToken = (k: keyof TokensTema, v: string) => setR((x) => (modo === 'claro' ? { ...x, tokens: { ...x.tokens, [k]: v } } : { ...x, modo_escuro: { ...x.modo_escuro, [k]: v } }))

  const cTexto = contraste(t.texto, t.fundo)
  const cPrim = contraste(t.primaria, t.texto_sobre_primaria ?? textoSobre(t.primaria))
  const setores = (Object.keys(r.integrantes_padrao) as SetorIntegrante[]).filter((s) => s !== 'geral')

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig
          titulo="Tema"
          sub={`Versão ${versoes[0].versao} publicada · o tema de fábrica é só o ponto de partida e nunca aparece para o cliente`}
          acao={
            <Button size="sm" className="rounded-full" disabled={!alterado} onClick={() => setModal('publicar')}>
              Publicar versão {versoes[0].versao + 1}
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <Caixa>
              <TituloBloco>Identidade</TituloBloco>
              <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                <Campo rotulo="Nome do produto" ajuda="Título do painel e do app.">
                  {(id) => <CampoTexto id={id} valor={r.nome_produto} onMudar={(v) => setR({ ...r, nome_produto: v })} />}
                </Campo>
                <Campo rotulo="Sigla">{(id) => <CampoTexto id={id} valor={r.sigla} onMudar={(v) => setR({ ...r, sigla: v.slice(0, 3).toUpperCase() })} />}</Campo>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-sunken flex size-14 items-center justify-center rounded-[14px] text-xl font-semibold">{r.sigla}</span>
                <span className="text-muted-foreground min-w-0 flex-1 text-xs">Logotipo, ícone do app e favicon. Sem logotipo, usamos a sigla.</span>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setModal('logo')}>
                  <ImageIcon /> Enviar
                </Button>
              </div>
            </Caixa>

            <Caixa>
              <TituloBloco
                acao={
                  <Segmentado
                    rotulo="Modo"
                    valor={modo}
                    onMudar={setModo}
                    opcoes={[
                      { valor: 'claro', rotulo: 'Claro' },
                      { valor: 'escuro', rotulo: 'Escuro' },
                    ]}
                  />
                }
                descricao="As camadas (superfície, elevada, rebaixada) saem do fundo e do texto; dá para ajustar uma a uma depois."
              >
                Cores
              </TituloBloco>
              <ul className="grid gap-2 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
                {camposCor.map((c) => {
                  const valor = (t[c.chave] as string) || '#999999'
                  return (
                    <li key={c.chave}>
                      <label className="bg-sunken/50 flex cursor-pointer items-center gap-3 rounded-[12px] px-2.5 py-2">
                        <input
                          type="color"
                          value={valor.length === 7 ? valor : '#999999'}
                          onChange={(e) => setToken(c.chave, e.target.value)}
                          className="size-8 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0"
                          aria-label={c.rotulo}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm">{c.rotulo}</span>
                          <span className="text-muted-foreground block truncate text-[11px]">
                            {valor} · {c.ajuda}
                          </span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-col gap-1 text-xs">
                <span className={cTexto >= 4.5 ? 'text-muted-foreground' : 'text-destructive'}>
                  {cTexto >= 4.5 ? <CheckCircleIcon className="text-success mr-1 inline size-3.5" /> : <WarningIcon className="mr-1 inline size-3.5" />}
                  Texto sobre o fundo: {cTexto.toFixed(1).replace('.', ',')}:1 {cTexto >= 4.5 ? '(legível)' : '(abaixo de 4,5:1: difícil de ler)'}
                </span>
                <span className={cPrim >= 4.5 ? 'text-muted-foreground' : 'text-warning'}>
                  {cPrim >= 4.5 ? <CheckCircleIcon className="text-success mr-1 inline size-3.5" /> : <WarningIcon className="mr-1 inline size-3.5" />}
                  Texto do botão sobre a primária: {cPrim.toFixed(1).replace('.', ',')}:1
                </span>
              </div>
            </Caixa>
            <Caixa>
              <TituloBloco
                acao={
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('dominio')}>
                    <PencilSimpleIcon /> Editar
                  </Button>
                }
                descricao="O tema é carregado pelo endereço, antes do login."
              >
                Domínios
              </TituloBloco>
              <dl className="divide-border/70 flex flex-col divide-y">
                {(['painel', 'app'] as const).map((k) => (
                  <Propriedade key={k} rotulo={k === 'painel' ? 'Painel da equipe' : 'App do cliente'}>
                    <span className="flex flex-wrap items-center gap-2">
                      <code className="min-w-0 text-xs break-all">{dominios[k].host}</code>
                      {dominios[k].ok ? <Badge variant="sucesso">verificado</Badge> : <Badge variant="destaque">aguardando DNS</Badge>}
                    </span>
                  </Propriedade>
                ))}
              </dl>
            </Caixa>
            <Caixa>
              <TituloBloco
                acao={
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('email')}>
                    <PencilSimpleIcon /> Editar
                  </Button>
                }
              >
                Remetente de e-mail e WhatsApp
              </TituloBloco>
              <dl className="divide-border/70 flex flex-col divide-y">
                <Propriedade rotulo="E-mail">
                  {remetente.nome} &lt;{remetente.email}&gt; {remetente.ok && <Badge variant="sucesso">domínio verificado</Badge>}
                </Propriedade>
                <Propriedade rotulo="Nome no WhatsApp">por número, em CRM › Números</Propriedade>
              </dl>
            </Caixa>
            <Caixa>
              <TituloBloco descricao="Cada documento gerado guarda a versão do tema com que saiu.">Versões</TituloBloco>
              <ul className="flex flex-col gap-2 text-sm">
                {versoes.map((v, i) => (
                  <li key={v.versao} className="flex items-start gap-3">
                    <ClockCounterClockwiseIcon className="text-muted-foreground mt-0.5 size-4" />
                    <span className="min-w-0 flex-1">
                      <span className="block">
                        v{v.versao} · {v.mudanca} {i === 0 && <Badge variant="sucesso">em uso</Badge>}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {v.quando} · {v.por}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Previa tema={r} modo={modo} />
            <Caixa>
              <TituloBloco descricao="Nome e cor do orb de cada setor. Cada pessoa pode dar outro nome ao seu. O Assistente é sempre o contraste do tema.">Integrantes padrão</TituloBloco>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {setores.map((s) => {
                  const i = r.integrantes_padrao[s]!
                  return (
                    <li key={s}>
                      <button type="button" onClick={() => setIntegranteEd(s)} className="bg-sunken/50 hover:bg-sunken flex w-full cursor-pointer items-center gap-2 rounded-[12px] px-2.5 py-2 text-left">
                        <Orb cor={(modo === 'escuro' && i.avatar.cor_escuro) || i.avatar.cor} corOlhos={i.avatar.cor_olhos} tamanho={26} cutucavel={false} extras={false} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{i.nome}</span>
                          <span className="text-muted-foreground block truncate text-[11px]">{rotuloSetor[s] ?? (s === 'financeiro_escritorio' ? 'Financeiro' : s)}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Caixa>
            <Caixa>
              <TituloBloco>Tipografia e forma</TituloBloco>
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo rotulo="Títulos">
                  {(id) => (
                    <CampoEscolha id={id} valor={fontes.some((f) => f.valor === r.tokens.fonte_titulo) ? r.tokens.fonte_titulo : fontes[1].valor} onMudar={(v) => setR({ ...r, tokens: { ...r.tokens, fonte_titulo: v } })} opcoes={fontes} />
                  )}
                </Campo>
                <Campo rotulo="Texto">
                  {(id) => (
                    <CampoEscolha id={id} valor={fontes.some((f) => f.valor === r.tokens.fonte_texto) ? r.tokens.fonte_texto : fontes[1].valor} onMudar={(v) => setR({ ...r, tokens: { ...r.tokens, fonte_texto: v } })} opcoes={fontes} />
                  )}
                </Campo>
              </div>
              <Campo rotulo={`Arredondamento: ${r.tokens.raio_borda}`}>
                {(id) => (
                  <input
                    id={id}
                    type="range"
                    min={0}
                    max={24}
                    value={parseFloat(r.tokens.raio_borda) * (r.tokens.raio_borda.endsWith('rem') ? 16 : 1)}
                    onChange={(e) =>
                      setR({
                        ...r,
                        tokens: {
                          ...r.tokens,
                          raio_borda: `${Number(e.target.value) / 16}rem`,
                        },
                      })
                    }
                    className="accent-foreground w-full"
                  />
                )}
              </Campo>
            </Caixa>
            <Caixa className="flex-1">
              <TituloBloco descricao="Textos com variáveis entre chaves. Os do atendimento ficam em CRM › Números › Mensagens automáticas.">Modelos de texto</TituloBloco>
              <ul className="divide-border/70 flex flex-col divide-y">
                {modelos.map((m) => (
                  <li key={m.chave}>
                    <button type="button" onClick={() => setModeloEd(m.chave)} className="hover:bg-sunken/60 -mx-2 flex w-[calc(100%+1rem)] cursor-pointer flex-col rounded-[10px] px-2 py-2 text-left">
                      <span className="flex items-center gap-2 text-sm">
                        <code>{m.chave}</code> <span className="text-muted-foreground text-xs">{m.grupo}</span>
                      </span>
                      <span className="text-muted-foreground truncate text-xs">{m.texto}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Caixa>
          </div>
        </div>
      </div>

      {modal === 'publicar' && (
        <Publicar
          versao={versoes[0].versao + 1}
          onFechar={() => setModal(null)}
          onPublicar={(mudanca) => {
            setVersoes((xs) => [
              {
                versao: xs[0].versao + 1,
                quando: 'agora',
                por: 'Fernanda Lima',
                mudanca,
              },
              ...xs,
            ])
            setModal(null)
          }}
        />
      )}
      {modal === 'logo' && (
        <GavetaFormulario aberta onFechar={() => setModal(null)} titulo="Logotipo e ícones" descricao="Viram documentos do escritório. O ícone do app e o favicon saem do ícone." acao="Salvar" onAcao={() => setModal(null)}>
          {['Logotipo (SVG ou PNG, fundo transparente)', 'Ícone quadrado (512 px)', 'Logotipo para o modo escuro (opcional)'].map((x) => (
            <div key={x} className="border-border flex items-center gap-3 rounded-[14px] border border-dashed px-3 py-4 text-sm">
              <ImageIcon className="text-muted-foreground size-6" />
              <span className="flex-1">{x}</span>
              <BotaoFeito type="button" size="sm" variant="outline" className="rounded-full" texto={`${x.split(' (')[0]}: arquivo carregado. Entra na próxima versão do tema.`}>
                Escolher arquivo
              </BotaoFeito>
            </div>
          ))}
        </GavetaFormulario>
      )}
      {modal === 'dominio' && (
        <Dominios
          inicial={dominios}
          onFechar={() => setModal(null)}
          onSalvar={(d) => {
            setDominios(d)
            setModal(null)
          }}
        />
      )}
      {modal === 'email' && (
        <Remetente
          inicial={remetente}
          onFechar={() => setModal(null)}
          onSalvar={(d) => {
            setRemetente(d)
            setModal(null)
          }}
        />
      )}
      {integranteEd && (
        <EditarIntegrantePadrao
          setor={integranteEd}
          tema={r}
          onFechar={() => setIntegranteEd(null)}
          onSalvar={(nome, cor) => {
            setR((x) => ({
              ...x,
              integrantes_padrao: {
                ...x.integrantes_padrao,
                [integranteEd]: {
                  nome,
                  avatar: {
                    ...x.integrantes_padrao[integranteEd]!.avatar,
                    cor,
                  },
                },
              },
            }))
            setIntegranteEd(null)
          }}
        />
      )}
      {modeloEd && (
        <EditarModeloTexto
          m={modelos.find((m) => m.chave === modeloEd)!}
          onFechar={() => setModeloEd(null)}
          onSalvar={(texto) => {
            setModelos((xs) => xs.map((x) => (x.chave === modeloEd ? { ...x, texto } : x)))
            setModeloEd(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

/** Prévia ao vivo: as variáveis do rascunho aplicadas só neste recorte. */
function Previa({ tema, modo }: { tema: Tema; modo: ModoCor }) {
  const vars = variaveisCss(tema, modo) as CSSProperties
  return (
    <section aria-label="Prévia do tema" style={vars} className={modo === 'escuro' ? 'dark' : undefined}>
      <div className="from-background to-background-end text-foreground overflow-hidden rounded-[24px] bg-gradient-to-b p-3 shadow-cartao" style={{ fontFamily: tema.tokens.fonte_texto }}>
        <div className="flex gap-3">
          <div className="from-sidebar to-sidebar-end hidden w-28 shrink-0 flex-col gap-1 rounded-[16px] bg-gradient-to-b p-2 text-[11px] sm:flex">
            <span className="mb-1 px-1.5 text-base font-semibold">{tema.sigla}</span>
            {['Início', 'Painel', 'CRM', 'Timesheet'].map((m, i) => (
              <span key={m} className={i === 1 ? 'bg-raised rounded-[8px] px-1.5 py-1 font-medium' : 'text-muted-foreground px-1.5 py-1'}>
                {m}
              </span>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="bg-sunken flex w-fit gap-0.5 rounded-full p-0.5 text-[11px]">
              <span className="bg-raised rounded-full px-2.5 py-1 font-medium">Fiscal</span>
              <span className="text-muted-foreground px-2.5 py-1">DP</span>
              <span className="text-muted-foreground px-2.5 py-1">Contábil</span>
            </div>
            <h4 className="text-xl font-light" style={{ fontFamily: tema.tokens.fonte_titulo }}>
              {tema.nome_produto}
            </h4>
            <div className="bg-surface shadow-cartao flex flex-col gap-2 p-3" style={{ borderRadius: `calc(${tema.tokens.raio_borda} * 1.6)` }}>
              <span className="text-sm font-medium">Guias de outubro</span>
              <span className="text-muted-foreground text-xs">3 enviadas · 1 vence hoje</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-success/15 rounded-full px-2 py-0.5 text-[11px]">paga</span>
                <span className="bg-warning/15 rounded-full px-2 py-0.5 text-[11px]">vence hoje</span>
                <span className="bg-destructive/15 text-destructive rounded-full px-2 py-0.5 text-[11px]">atrasada</span>
                <span className="bg-highlight/20 rounded-full px-2 py-0.5 text-[11px]">destaque</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium" style={{ borderRadius: tema.tokens.raio_borda }}>
                  Enviar ao cliente
                </span>
                <span className="bg-raised shadow-contorno px-3 py-1.5 text-xs" style={{ borderRadius: tema.tokens.raio_borda }}>
                  Ver guia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Publicar({ versao, onFechar, onPublicar }: { versao: number; onFechar: () => void; onPublicar: (m: string) => void }) {
  const [m, setM] = useState('')
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Publicar versão ${versao}`}
      descricao="Vale na hora para a equipe e para o app dos clientes. A versão anterior fica guardada e os documentos já gerados não mudam."
      acao="Publicar"
      acaoDesabilitada={!m.trim()}
      onAcao={() => onPublicar(m.trim())}
    >
      <Campo rotulo="O que mudou" ajuda="Aparece no histórico de versões.">
        {(id) => <CampoArea id={id} linhas={2} valor={m} onMudar={setM} />}
      </Campo>
    </GavetaFormulario>
  )
}

type Dom = {
  painel: { host: string; ok: boolean }
  app: { host: string; ok: boolean }
}

function Dominios({ inicial, onFechar, onSalvar }: { inicial: Dom; onFechar: () => void; onSalvar: (d: Dom) => void }) {
  const [d, setD] = useState(inicial)
  const [verificando, setVerificando] = useState<string | null>(null)
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo="Domínios" descricao="Crie o registro CNAME no seu provedor de DNS e verifique. Leva de minutos a algumas horas." acao="Salvar" onAcao={() => onSalvar(d)}>
      {(['painel', 'app'] as const).map((k) => (
        <div key={k} className="flex flex-col gap-2">
          <Campo rotulo={k === 'painel' ? 'Painel da equipe' : 'App do cliente'}>
            {(id) => (
              <CampoTexto
                id={id}
                mono
                valor={d[k].host}
                onMudar={(v) =>
                  setD({
                    ...d,
                    [k]: { host: v.trim().toLowerCase(), ok: false },
                  })
                }
              />
            )}
          </Campo>
          <div className="bg-sunken/60 rounded-[12px] px-3 py-2 font-mono text-[11px]">
            {d[k].host.split('.')[0]} CNAME {k}.plataforma-contabil.com.br
          </div>
          {d[k].ok ? (
            <span className="text-success flex items-center gap-1.5 text-sm">
              <CheckCircleIcon weight="fill" className="size-4" /> Verificado · certificado HTTPS emitido
            </span>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit rounded-full"
              disabled={verificando === k}
              onClick={() => {
                setVerificando(k)
                setTimeout(() => {
                  setVerificando(null)
                  setD((x) => ({ ...x, [k]: { ...x[k], ok: true } }))
                }, 1300)
              }}
            >
              {verificando === k ? <SpinnerIcon className="animate-spin" /> : <GlobeIcon />} {verificando === k ? 'Verificando…' : 'Verificar DNS'}
            </Button>
          )}
        </div>
      ))}
    </GavetaFormulario>
  )
}

type Rem = { nome: string; email: string; ok: boolean }

function Remetente({ inicial, onFechar, onSalvar }: { inicial: Rem; onFechar: () => void; onSalvar: (r: Rem) => void }) {
  const [r, setR] = useState(inicial)
  const dominio = r.email.split('@')[1] ?? ''
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Remetente de e-mail"
      descricao="Os e-mails do sistema (convites, comunicados, resumos) saem com este nome e endereço."
      acao="Salvar"
      acaoDesabilitada={!/^\S+@\S+\.\S+$/.test(r.email)}
      onAcao={() => onSalvar(r)}
    >
      <Campo rotulo="Nome do remetente">{(id) => <CampoTexto id={id} valor={r.nome} onMudar={(v) => setR({ ...r, nome: v })} />}</Campo>
      <Campo rotulo="Endereço">
        {(id) => (
          <CampoTexto
            id={id}
            tipo="email"
            valor={r.email}
            onMudar={(v) =>
              setR({
                ...r,
                email: v,
                ok: v.split('@')[1] === inicial.email.split('@')[1] && inicial.ok,
              })
            }
          />
        )}
      </Campo>
      <div className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Registros para {dominio || 'o domínio'}</span>
        {['SPF  TXT  v=spf1 include:mail.plataforma-contabil.com.br ~all', 'DKIM CNAME pc._domainkey → dkim.plataforma-contabil.com.br'].map((x) => (
          <code key={x} className="bg-sunken/60 rounded-[10px] px-3 py-1.5 text-[11px]">
            {x}
          </code>
        ))}
        {r.ok ? (
          <span className="text-success flex items-center gap-1.5">
            <CheckCircleIcon weight="fill" className="size-4" /> Domínio verificado
          </span>
        ) : (
          <Button type="button" size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setR({ ...r, ok: true })}>
            Verificar domínio
          </Button>
        )}
      </div>
    </GavetaFormulario>
  )
}

function EditarIntegrantePadrao({ setor, tema, onFechar, onSalvar }: { setor: SetorIntegrante; tema: Tema; onFechar: () => void; onSalvar: (nome: string, cor: string) => void }) {
  const i = tema.integrantes_padrao[setor]!
  const [nome, setNome] = useState(i.nome)
  const [cor, setCor] = useState(i.avatar.cor)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Integrante do ${rotuloSetor[setor] ?? setor}`}
      descricao="Vale para todos do escritório que não deram outro nome ao seu."
      acao="Salvar"
      acaoDesabilitada={!nome.trim()}
      onAcao={() => onSalvar(nome.trim(), cor)}
    >
      <div className="flex justify-center py-2">
        <Orb cor={cor} corOlhos={i.avatar.cor_olhos} tamanho={72} animado modo="follow" />
      </div>
      <Campo rotulo="Nome">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} />}</Campo>
      <Campo rotulo="Cor do orb" ajuda="No escuro, se a cor sumir no fundo, defina uma variação nas cores do modo escuro.">
        {(id) => <input id={id} type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="h-10 w-20 cursor-pointer rounded-md border-0 bg-transparent p-0" />}
      </Campo>
    </GavetaFormulario>
  )
}

function EditarModeloTexto({ m, onFechar, onSalvar }: { m: (typeof modelosTexto)[number]; onFechar: () => void; onSalvar: (t: string) => void }) {
  const [texto, setTexto] = useState(m.texto)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={m.chave} descricao={`Grupo: ${m.grupo}. Mudar um texto publica com a próxima versão do tema.`} acao="Salvar" acaoDesabilitada={!texto.trim()} onAcao={() => onSalvar(texto)}>
      <Campo rotulo="Texto" ajuda="Variáveis: {nome}, {empresa}, {escritorio}, {competencia}, {link}, {crc}, {telefone}.">
        {(id) => <CampoArea id={id} linhas={5} valor={texto} onMudar={setTexto} />}
      </Campo>
    </GavetaFormulario>
  )
}
