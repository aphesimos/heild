import { useSessao } from '@/ambiente/sessao'
import { CheckCircleIcon, DownloadSimpleIcon, FileArrowUpIcon, GoogleChromeLogoIcon, KeyIcon, PlusIcon, PuzzlePieceIcon, SpinnerIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { rotuloSetor } from '@/dados/crm'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { configTs, custoHora as custoInicial, custoHoraPacoteBpo, dominios as dominiosIniciais, mapasDepartamento, mapasResponsavel, type Conector, type Dominio } from '@/dados/timesheet'
import { cn } from '@/lib/utils'
import type { SetorIntegrante } from '@/theme/tipos'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** Passos no topo das gavetas de setup (mesma peça do conectar número do CRM). */
function Passos({ nomes, atual }: { nomes: readonly string[]; atual: number }) {
  return (
    <ol className="flex gap-1.5" aria-label="Passos">
      {nomes.map((p, i) => (
        <li key={p} className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cn('h-1.5 rounded-full', i < atual ? 'bg-success' : i === atual ? 'bg-foreground' : 'bg-sunken')} />
          <span className={cn('truncate text-[11px]', i === atual ? 'font-medium' : 'text-muted-foreground')}>{p}</span>
        </li>
      ))}
    </ol>
  )
}

/** Termo de ciência (05, 10.1): aceito uma vez por pessoa e a cada mudança da lista de coleta. */
export function TermoCiencia({ onFechar, onAceitar }: { onFechar: () => void; onAceitar: () => void }) {
  const [lido, setLido] = useState(false)
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo="Como o seu tempo é registrado" descricao="Termo de ciência do Timesheet · versão de 07/11/2026" acao="Li e aceito" acaoDesabilitada={!lido} onAcao={onAceitar}>
      <div className="flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          <strong className="font-medium">Para quê:</strong> saber quanto cada cliente custa ao escritório e acabar com o apontamento manual de horas. Ninguém precisa mais apontar; você confirma o que o sistema deduziu, e vê os seus dados primeiro.
        </p>
        <div>
          <p className="font-medium">O que é registrado</p>
          <ul className="text-muted-foreground list-disc pl-5">
            <li>As ações na plataforma (abrir tarefa, responder conversa, emitir guia), com hora e cliente.</li>
            <li>Com a extensão: um sinal por minuto de que você está ativo num portal da lista, e o CNPJ do cliente que o portal mostra. A extensão lê a página só para achar esse identificador; o conteúdo não sai do seu navegador.</li>
            <li>Tarefas dos sistemas contábeis conectados e arquivos salvos na pasta do cliente.</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">O que nunca é registrado</p>
          <p className="text-muted-foreground">Tela, teclas, mouse, câmera, microfone, localização, programas abertos, sites fora da lista, formulários, senhas, certificados e mensagens para fins de tempo.</p>
        </div>
        <div>
          <p className="font-medium">Quem vê</p>
          <p className="text-muted-foreground">Você vê tudo o que tem o seu nome. O Gestor vê as horas do setor que gere. Custo e margem, só o Administrador. Não existe ranking de produtividade.</p>
        </div>
        <p className="text-muted-foreground">
          Os sinais brutos ficam 90 dias; as sessões, pelo prazo de guarda do escritório. O Timesheet <strong className="text-foreground font-medium">não substitui o controle de ponto</strong>. Você pode contestar qualquer sessão e pausar a extensão quando quiser, sem aviso a ninguém.
        </p>
      </div>
      <label className="bg-sunken flex cursor-pointer items-start gap-2.5 rounded-[14px] px-3 py-2.5 text-sm">
        <input type="checkbox" className="accent-foreground mt-0.5 size-4" checked={lido} onChange={(e) => setLido(e.target.checked)} />
        Li e entendi como o meu tempo é registrado. O aceite fica guardado com data e hora.
      </label>
    </GavetaFormulario>
  )
}

const passosExt = ['Navegador', 'Instalar', 'Vincular', 'Ciência', 'Pronto'] as const

/** Vincular a extensão (05, 3.6): Chrome ou Edge, loja, vínculo pelo login, ciência. */
export function VincularExtensao({ onFechar, onVincular }: { onFechar: () => void; onVincular: () => void }) {
  const usuarioNome = useSessao().usuario.nome
  const [passo, setPasso] = useState(0)
  const [navegador, setNavegador] = useState<'chrome' | 'edge'>('chrome')
  const [instalada, setInstalada] = useState(false)
  const [vinculando, setVinculando] = useState(false)
  const [vinculada, setVinculada] = useState(false)
  const [ciente, setCiente] = useState(false)
  const ok = [true, instalada, vinculada, ciente, true][passo]
  const ultimo = passo === passosExt.length - 1
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Vincular a extensão"
      descricao="Mantém o tempo contando enquanto você trabalha nos portais e confirma o cliente pelo CNPJ que o portal mostra."
      acao={ultimo ? 'Concluir' : 'Continuar'}
      acaoDesabilitada={!ok}
      onAcao={() => (ultimo ? onVincular() : setPasso((p) => p + 1))}
      secundaria={passo > 0 && !ultimo ? <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>Voltar</Button> : undefined}
    >
      <Passos nomes={passosExt} atual={passo} />
      {passo === 0 && (
        <Campo rotulo="Navegador" ajuda="Firefox e Safari chegam depois.">
          {() => (
            <Segmentado
              rotulo="Navegador"
              valor={navegador}
              onMudar={setNavegador}
              opcoes={[
                { valor: 'chrome', rotulo: 'Chrome' },
                { valor: 'edge', rotulo: 'Edge' },
              ]}
            />
          )}
        </Campo>
      )}
      {passo === 1 && (
        <div className="flex flex-col gap-3 text-sm">
          <p>Abra a loja do {navegador === 'chrome' ? 'Chrome' : 'Edge'}, instale a extensão e volte aqui.</p>
          {instalada ? (
            <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5">
              <CheckCircleIcon weight="fill" className="text-success size-5" /> Extensão encontrada neste navegador.
            </p>
          ) : (
            <Button type="button" className="w-fit rounded-full" onClick={() => setInstalada(true)}>
              {navegador === 'chrome' ? <GoogleChromeLogoIcon /> : <PuzzlePieceIcon />} Abrir a loja
            </Button>
          )}
        </div>
      )}
      {passo === 2 && (
        <div className="flex flex-col gap-3 text-sm">
          <p>A extensão usa o login da plataforma; sem login, não envia nada. Vincular liga a extensão à sua conta neste navegador.</p>
          {vinculada ? (
            <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5">
              <CheckCircleIcon weight="fill" className="text-success size-5" /> Vinculada a {usuarioNome}.
            </p>
          ) : (
            <Button
              type="button"
              className="w-fit rounded-full"
              disabled={vinculando}
              onClick={() => {
                setVinculando(true)
                setTimeout(() => {
                  setVinculando(false)
                  setVinculada(true)
                }, 1200)
              }}
            >
              {vinculando ? <SpinnerIcon className="animate-spin" /> : <KeyIcon />} {vinculando ? 'Vinculando…' : 'Vincular com o meu login'}
            </Button>
          )}
        </div>
      )}
      {passo === 3 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-medium">A extensão só funciona nestes portais:</p>
          <ul className="flex flex-col gap-1.5">
            {dominiosIniciais
              .filter((d) => d.ativo)
              .map((d) => (
                <li key={d.portal} className="bg-sunken/60 rounded-[12px] px-3 py-2">
                  <span className="block">{d.portal}</span>
                  <span className="text-muted-foreground block text-xs">lê: {d.leitura}</span>
                </li>
              ))}
          </ul>
          <p className="text-muted-foreground text-xs">Envia só um sinal por minuto de que você está ativo e o CNPJ do cliente. Nunca: conteúdo, formulários, senhas, certificados, URL completa, outros sites.</p>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" className="accent-foreground mt-0.5 size-4" checked={ciente} onChange={(e) => setCiente(e.target.checked)} />
            Estou ciente. Posso pausar pelo ícone a qualquer momento.
          </label>
        </div>
      )}
      {passo === 4 && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <CheckCircleIcon weight="fill" className="text-success size-5" /> Extensão ativa
          </p>
          <p className="text-muted-foreground">O ícone mostra “ativa neste portal” ou “fora da lista”. Desinstalar não apaga nada do que já foi registrado.</p>
        </div>
      )}
    </GavetaFormulario>
  )
}

/** Pausar a extensão (05, 3.6): direito da pessoa, nunca vira alerta ao Gestor. */
export function PausarExtensao({ onFechar, onPausar }: { onFechar: () => void; onPausar: (ate: string) => void }) {
  const [ate, setAte] = useState<'30' | 'dia' | 'religar'>('30')
  const rot = { '30': 'por 30 min', dia: 'até o fim do dia', religar: 'até eu religar' }
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Pausar a extensão" descricao="Enquanto pausada, nada é enviado. A pausa aparece só no seu Meu tempo; o Gestor não é avisado." acao="Pausar" onAcao={() => onPausar(rot[ate])}>
      <Campo rotulo="Por quanto tempo">
        {() => (
          <Segmentado
            rotulo="Por quanto tempo"
            valor={ate}
            onMudar={setAte}
            opcoes={[
              { valor: '30', rotulo: '30 min' },
              { valor: 'dia', rotulo: 'Até o fim do dia' },
              { valor: 'religar', rotulo: 'Até eu religar' },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

/** Lista de domínios (05, 3.2 e 10.2): todos veem; o Administrador desliga e pede inclusão. */
export function Dominios({ admin, onFechar }: { admin: boolean; onFechar: () => void }) {
  const [lista, setLista] = useState<Dominio[]>(dominiosIniciais)
  const [pedido, setPedido] = useState<{ portal: string; dominio: string; motivo: string } | null>(null)
  const [pedidos, setPedidos] = useState<string[]>([])
  if (pedido)
    return (
      <GavetaFormulario
        aberta
        onFechar={() => setPedido(null)}
        titulo="Pedir inclusão de portal"
        descricao="A lista é mantida pela plataforma e versionada. Inclusões avisam a equipe e pedem nova ciência."
        acao="Enviar pedido"
        acaoDesabilitada={!pedido.portal.trim() || !/\./.test(pedido.dominio)}
        onAcao={() => {
          setPedidos((xs) => [...xs, pedido.portal])
          setPedido(null)
        }}
      >
        <Campo rotulo="Portal">{(id) => <CampoTexto id={id} valor={pedido.portal} onMudar={(v) => setPedido({ ...pedido, portal: v })} placeholder="ex.: Junta Comercial de SP" />}</Campo>
        <Campo rotulo="Domínio">{(id) => <CampoTexto id={id} mono valor={pedido.dominio} onMudar={(v) => setPedido({ ...pedido, dominio: v.trim().toLowerCase() })} placeholder="www.jucesponline.sp.gov.br" />}</Campo>
        <Campo rotulo="Para que serve (opcional)">{(id) => <CampoArea id={id} linhas={3} valor={pedido.motivo} onMudar={(v) => setPedido({ ...pedido, motivo: v })} />}</Campo>
      </GavetaFormulario>
    )
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Portais da extensão"
      descricao="Fora desta lista a extensão não roda. O que ela lê serve só para identificar o cliente."
      acao="Fechar"
      onAcao={onFechar}
      secundaria={
        admin ? (
          <Button type="button" variant="outline" className="rounded-full" onClick={() => setPedido({ portal: '', dominio: '', motivo: '' })}>
            <PlusIcon /> Pedir inclusão
          </Button>
        ) : undefined
      }
    >
      <ul className="flex flex-col gap-2">
        {lista.map((d) => (
          <li key={d.portal} className={cn('bg-sunken/50 flex items-start gap-3 rounded-[14px] px-3 py-2.5', !d.ativo && 'opacity-60')}>
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-medium">{d.portal}</div>
              <code className="text-muted-foreground block truncate text-[11px]">{d.dominio}</code>
              <div className="text-muted-foreground text-xs">
                lê: {d.leitura} · sugere {d.atividade}
              </div>
            </div>
            {admin ? <Interruptor ocultarRotulo rotulo={`Portal ${d.portal}`} ligado={d.ativo} onMudar={(v) => setLista((xs) => xs.map((x) => (x.portal === d.portal ? { ...x, ativo: v } : x)))} /> : <Badge variant={d.ativo ? 'sucesso' : 'outline'}>{d.ativo ? 'ativo' : 'desligado'}</Badge>}
          </li>
        ))}
      </ul>
      {pedidos.length > 0 && <p className="text-muted-foreground text-xs">Pedidos enviados: {pedidos.join(', ')} (em análise pela plataforma).</p>}
    </GavetaFormulario>
  )
}

/** Configurações do módulo (Administrador): inatividade, itens por dia, fechamento, jornada, abertura ao Gestor. */
export function ConfiguracoesModulo({ onFechar }: { onFechar: () => void }) {
  const [c, setC] = usePersistente('ts.cfg.c', { ...configTs, jornadaIni: configTs.jornada.inicio, jornadaFim: configTs.jornada.fim, extensao: true, artefatos: true })
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo="Configurações do Timesheet" descricao="Valem para o escritório inteiro. Mudanças viram evento." acao="Salvar" onAcao={onFechar}>
      <Campo rotulo={`Modo de espera depois de ${c.inatividadeMin} min sem ação`} ajuda="Vale só no Painel com cliente e no CRM, onde o tempo é registrado sozinho; não desloga. Curto demais corta o tempo de quem está no core; longo demais conta tempo parado. De 2 a 5.">
        {(id) => <input id={id} type="range" min={2} max={5} value={c.inatividadeMin} onChange={(e) => setC({ ...c, inatividadeMin: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo={`Até ${c.itensDia} itens de confirmação por dia`} ajuda="Acima disso vira apontamento manual com outro nome. O resto fica como sem classificação. De 4 a 12.">
        {(id) => <input id={id} type="range" min={4} max={12} value={c.itensDia} onChange={(e) => setC({ ...c, itensDia: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo="Horário da lista de confirmações" ajuda="A lista aparece neste horário e na manhã seguinte, no login.">
        {(id) => <CampoTexto id={id} tipo="time" valor={c.fechamento} onMudar={(v) => setC({ ...c, fechamento: v })} className="w-32" />}
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Jornada começa">{(id) => <CampoTexto id={id} tipo="time" valor={c.jornadaIni} onMudar={(v) => setC({ ...c, jornadaIni: v })} />}</Campo>
        <Campo rotulo="Jornada termina">{(id) => <CampoTexto id={id} tipo="time" valor={c.jornadaFim} onMudar={(v) => setC({ ...c, jornadaFim: v })} />}</Campo>
      </div>
      <p className="text-muted-foreground -mt-3 text-xs">Fora da jornada, a sessão é marcada e entra no relatório mensal; nunca vira alerta por ocorrência.</p>
      <Campo rotulo={`Abrir a aba Equipe ao Gestor após ${c.equipeAposSemanas} semanas`} ajuda="Recomendado: cada pessoa vê o próprio tempo antes do Gestor ver o da equipe.">
        {(id) => <CampoEscolha id={id} valor={String(c.equipeAposSemanas)} onMudar={(v) => setC({ ...c, equipeAposSemanas: Number(v) })} opcoes={['0', '1', '2', '3', '4'].map((v) => ({ valor: v, rotulo: v === '0' ? 'Já' : `${v} semanas` }))} />}
      </Campo>
      <Interruptor ligado={c.extensao} onMudar={(v) => setC({ ...c, extensao: v })} rotulo="Extensão de navegador" detalhe="Cada pessoa vincula e dá ciência; sem ciência, fica inerte." />
      <Interruptor ligado={c.artefatos} onMudar={(v) => setC({ ...c, artefatos: v })} rotulo="Inferir por arquivos e guias (artefatos)" detalhe="Arquivo na pasta do cliente vira sessão estimada com a duração padrão." />
      <Interruptor ligado={c.benchmark} onMudar={(v) => setC({ ...c, benchmark: v })} rotulo="Contribuir com o benchmark anonimizado" detalhe="Medianas por atividade, sem nomes nem clientes, para calibrar o catálogo." />
    </GavetaFormulario>
  )
}

/** Exportar (05, 8.1 e 10.3). */
export function Exportar({ gestor, onFechar }: { gestor: boolean; onFechar: () => void }) {
  const [o, setO] = useState<'csv' | 'pdf' | 'meus'>(gestor ? 'csv' : 'meus')
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'competencia'>('mes')
  const [pronto, setPronto] = useState(false)
  const opcoes = [
    ...(gestor
      ? [
          { valor: 'csv' as const, rotulo: 'Sessões filtradas (CSV)' },
          { valor: 'pdf' as const, rotulo: 'Relatório mensal (PDF)' },
        ]
      : []),
    { valor: 'meus' as const, rotulo: 'O que a plataforma sabe sobre mim' },
  ]
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Exportar" descricao="A exportação vira evento e o arquivo fica como documento com hash." acao={pronto ? 'Fechar' : 'Gerar arquivo'} onAcao={() => (pronto ? onFechar() : setPronto(true))}>
      <Campo rotulo="O quê">{() => <Segmentado rotulo="O quê" valor={o} onMudar={setO} opcoes={opcoes} />}</Campo>
      {o !== 'meus' ? (
        <Campo rotulo="Período">
          {() => (
            <Segmentado
              rotulo="Período"
              valor={periodo}
              onMudar={setPeriodo}
              opcoes={[
                { valor: 'semana', rotulo: 'Semana' },
                { valor: 'mes', rotulo: 'Mês' },
                { valor: 'competencia', rotulo: 'Competência' },
              ]}
            />
          )}
        </Campo>
      ) : (
        <p className="text-muted-foreground text-sm">Todas as suas sessões, evidências, pulsos por portal, confirmações, contestações, pausas da extensão e marcas de fora da jornada, em CSV.</p>
      )}
      {pronto && (
        <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm">
          <DownloadSimpleIcon className="size-4" /> {o === 'pdf' ? 'horas-novembro-2026.pdf' : o === 'csv' ? 'sessoes-novembro-2026.csv' : 'meus-dados-timesheet.csv'} pronto para baixar.
        </p>
      )}
    </GavetaFormulario>
  )
}

const cores = ['Alterdata', 'Domínio', 'Questor', 'Contmatic'] as const

/** Conectar um core (05, 4): Alterdata por API; Domínio, Questor e Contmatic por relatório e arquivos. */
export function ConectarCore({ inicial, onFechar, onConectar }: { inicial?: Conector['core']; onFechar: () => void; onConectar: (c: Conector) => void }) {
  const [core, setCore] = useState<Conector['core']>(inicial ?? 'Alterdata')
  const [token, setToken] = useState('')
  const [testando, setTestando] = useState(false)
  const [testado, setTestado] = useState(false)
  const [arquivo, setArquivo] = useState(false)
  const [pasta, setPasta] = useState('Clientes/{cliente}/Contmatic')
  const api = core === 'Alterdata'
  const ok = api ? testado : core === 'Contmatic' ? pasta.length > 3 || arquivo : arquivo
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Conectar sistema contábil"
      descricao="As tarefas do core viram eventos; a equivalência com o catálogo vem depois, na fila “sem equivalente”."
      acao={api ? 'Conectar' : 'Importar'}
      acaoDesabilitada={!ok}
      onAcao={() =>
        onConectar({
          core,
          modo: api ? 'API ePlugin' : core === 'Contmatic' ? 'arquivos na pasta + relatório' : 'relatório importado',
          status: api ? 'conectado' : 'importação',
          detalhe: api ? 'leitura a cada 15 min · primeira leitura agora' : arquivo ? 'relatório importado agora' : `pasta ${pasta}`,
        })
      }
    >
      <Campo rotulo="Sistema">{() => <Segmentado rotulo="Sistema" valor={core} onMudar={(v) => { setCore(v); setTestado(false); setArquivo(false) }} opcoes={cores.map((c) => ({ valor: c, rotulo: c }))} />}</Campo>
      {api ? (
        <>
          <p className="text-muted-foreground text-sm">API do ePlugin (pacote eContador Master). Leitura a cada 15 min e varredura diária dos últimos 7 dias. O token fica no cofre; só o conector o usa.</p>
          <Campo rotulo="Token do escritório" ajuda="No Alterdata: eContador › Integrações › Gerar token.">
            {(id) => <CampoTexto id={id} tipo="password" valor={token} onMudar={(v) => { setToken(v); setTestado(false) }} placeholder="cole o token" />}
          </Campo>
          {testado ? (
            <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm">
              <CheckCircleIcon weight="fill" className="text-success size-5" /> Conexão ok · 412 tarefas encontradas em novembro.
            </p>
          ) : (
            <Button type="button" variant="outline" className="w-fit rounded-full" disabled={token.length < 8 || testando} onClick={() => { setTestando(true); setTimeout(() => { setTestando(false); setTestado(true) }, 1300) }}>
              {testando ? <SpinnerIcon className="animate-spin" /> : null} {testando ? 'Testando…' : 'Testar conexão'}
            </Button>
          )}
        </>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">
            {core === 'Contmatic'
              ? 'Sem API. Três caminhos somados: arquivos que o Phoenix grava na pasta do cliente, o relatório do módulo Gestão do Escritório e a confirmação assistida. A cobertura automática esperada é menor (meta 60%).'
              : `Sem API de saída pública. Enquanto não houver, exporte o relatório de produtividade do ${core === 'Domínio' ? 'Domínio Processos' : 'Tareffa'} (Excel) toda semana e importe aqui.`}
          </p>
          {core === 'Contmatic' && (
            <Campo rotulo="Pasta dos arquivos na nuvem do escritório" ajuda="{cliente} é trocado pela pasta de cada cliente.">
              {(id) => <CampoTexto id={id} mono valor={pasta} onMudar={setPasta} />}
            </Campo>
          )}
          <Button type="button" variant={arquivo ? 'secondary' : 'outline'} className="w-fit rounded-full" onClick={() => setArquivo(true)}>
            <FileArrowUpIcon /> {arquivo ? 'produtividade-semana-16-11.xlsx' : 'Escolher relatório'}
          </Button>
        </>
      )}
    </GavetaFormulario>
  )
}

/** Mapas de equivalência (05, 4.6): departamento → setor e responsável → usuário. */
export function MapasCore({ onFechar }: { onFechar: () => void }) {
  const [deps, setDeps] = usePersistente('ts.cfg.deps', mapasDepartamento)
  const [resps, setResps] = usePersistente('ts.cfg.resps', mapasResponsavel)
  const setores = Object.keys(rotuloSetor) as SetorIntegrante[]
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo="Equivalências do Alterdata" descricao="Confirme uma vez. Vale para o futuro e 90 dias para trás; eventos guardados ganham sessão quando casam." acao="Salvar" onAcao={onFechar}>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Departamento → setor</span>
        {deps.map((d, i) => (
          <div key={d.core} className="grid grid-cols-[1fr_1fr] items-center gap-3 text-sm">
            <span>{d.core}</span>
            <CampoEscolha valor={(d.setor ?? '') as SetorIntegrante | ''} onMudar={(v) => setDeps((xs) => xs.map((x, k) => (k === i ? { ...x, setor: v || undefined } : x)))} opcoes={[{ valor: '' as const, rotulo: 'não é trabalho medido' }, ...setores.map((s) => ({ valor: s, rotulo: rotuloSetor[s]! }))]} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Responsável → pessoa</span>
        {resps.map((r, i) => (
          <div key={r.core} className="grid grid-cols-[1fr_1fr] items-center gap-3 text-sm">
            <code className={cn(!r.usuario && 'text-warning')}>{r.core}</code>
            <CampoEscolha valor={r.usuario ?? ''} onMudar={(v) => setResps((xs) => xs.map((x, k) => (k === i ? { ...x, usuario: v || undefined } : x)))} opcoes={[{ valor: '', rotulo: 'casar depois' }, ...['Fernanda Lima', 'João Pereira', 'Ana Souza', 'Bruno Costa'].map((n) => ({ valor: n, rotulo: n }))]} />
          </div>
        ))}
      </div>
    </GavetaFormulario>
  )
}

/** Custo-hora do escritório (05, 8.4; decisão de 7/11): gastos do mês ÷ horas produtivas. */
export function CustoHora({ onFechar, onSalvar }: { onFechar: () => void; onSalvar: (v: number) => void }) {
  const [modo, setModo] = useState<'gastos' | 'direto'>('gastos')
  const [gastos, setGastos] = useState(custoInicial.gastos.map((g) => ({ ...g, texto: String(g.valor) })))
  const [horas, setHoras] = useState(String(custoInicial.horasProdutivas))
  const [direto, setDireto] = useState(String(custoInicial.valor))
  const [porCargo, setPorCargo] = useState(false)
  const loja = useLoja()
  const total = gastos.reduce((s, g) => s + (Number(g.texto) || 0), 0)
  const calculado = Math.round(total / (Number(horas) || 1))
  const valor = modo === 'gastos' ? calculado : Number(direto) || 0
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo="Custo-hora do escritório" descricao={`Vigência: ${custoInicial.mes}/2026. Só o Administrador vê. É do escritório, não da pessoa nem do cargo.`} acao={`Salvar ${brl(valor)}/h`} acaoDesabilitada={valor <= 0} onAcao={() => onSalvar(valor)}>
      <Campo rotulo="Como calcular">
        {() => (
          <Segmentado
            rotulo="Como calcular"
            valor={modo}
            onMudar={setModo}
            opcoes={[
              { valor: 'gastos', rotulo: 'Pelos gastos do mês' },
              { valor: 'direto', rotulo: 'Informar o valor' },
            ]}
          />
        )}
      </Campo>
      {modo === 'gastos' ? (
        <>
          <div className="flex flex-col gap-2">
            {gastos.map((g, i) => (
              <div key={g.nome} className="grid grid-cols-[1fr_9rem] items-center gap-3 text-sm">
                <span>{g.nome}</span>
                <CampoTexto tipo="number" valor={g.texto} onMudar={(v) => setGastos((xs) => xs.map((x, k) => (k === i ? { ...x, texto: v } : x)))} className="text-right tabular-nums" />
              </div>
            ))}
            <div className="grid grid-cols-[1fr_9rem] gap-3 border-t pt-2 text-sm font-medium">
              <span>Total do mês</span>
              <span className="text-right tabular-nums">{brl(total)}</span>
            </div>
          </div>
          <Campo rotulo="Horas produtivas registradas no mês" ajuda="Vem do Timesheet (humanas, sem as de agente). Ajuste se faltar alguém.">
            {(id) => <CampoTexto id={id} tipo="number" valor={horas} onMudar={setHoras} className="w-32 tabular-nums" />}
          </Campo>
          <p className="bg-sunken rounded-[14px] px-3 py-2.5 text-sm">
            {brl(total)} ÷ {horas} h = <strong className="font-medium">{brl(calculado)} por hora</strong>. Cliente que toma 2 h no mês e paga R$ 500 fica {brl(Math.abs(500 - 2 * calculado))} {500 - 2 * calculado < 0 ? 'abaixo' : 'acima'} da neutralidade.
          </p>
        </>
      ) : (
        <Campo rotulo="Custo por hora" ajuda="Use quando o Financeiro do escritório já calcula.">
          {(id) => <CampoTexto id={id} tipo="number" valor={direto} onMudar={setDireto} className="w-40 tabular-nums" />}
        </Campo>
      )}
      {loja.estado.bpoModulo && (
        <Interruptor
          ligado={loja.estado.custoPorPacote}
          onMudar={loja.ligarCustoPorPacote}
          rotulo="Custo-hora por pacote (opcional)"
          detalhe={`Desligado, o escritório usa um custo-hora só, com todos os pacotes. Ligado, as horas do BPO usam o custo da equipe do pacote (${brl(custoHoraPacoteBpo)}/h). O filtro de pacote funciona nos dois casos.`}
        />
      )}
      <Interruptor ligado={porCargo} onMudar={setPorCargo} rotulo="Refinar por cargo (opcional)" detalhe="Separa sênior de júnior. Nunca por pessoa: o salário individual não entra no sistema." />
      {porCargo && (
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ['Sênior', 1.4],
            ['Pleno', 1],
            ['Júnior', 0.7],
          ].map(([c, f]) => (
            <div key={c as string} className="bg-sunken/60 rounded-[12px] px-3 py-2 text-sm">
              <div className="text-muted-foreground text-xs">{c as string}</div>
              <div className="font-medium tabular-nums">{brl(Math.round(valor * (f as number)))}/h</div>
            </div>
          ))}
        </div>
      )}
    </GavetaFormulario>
  )
}
