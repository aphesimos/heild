import { BrainIcon, CheckIcon, LockSimpleIcon, PencilSimpleIcon, ShareNetworkIcon, TrashIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { BotaoAlternar, BotaoIr } from '@/ambiente/interface'
import { useState } from 'react'
import { Caixa, Propriedade, TituloBloco } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { Orb } from '@/components/ui/orb'
import { criadosPorUsuarios, integrantesPadraoCfg, limitesUsuario as limitesIniciais, memoriaParaRevisar, modelosIntegrante as modelosIniciais, perguntasPromocao, sozinhoFiscal, type IntegrantePadraoCfg } from '@/dados/configuracoes'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'
import { CabecalhoConfig } from './EscritorioTela'

const nomeCanal = {
  chat: 'no chat',
  central: 'na central de avisos',
  whatsapp_do_dono: 'no WhatsApp do dono',
}

/**
 * Configurações › Integrantes (Fundações 9; subplano 02): o time padrão por
 * setor (ligar, instruções do escritório, canal de aviso), a lista "faz
 * sozinho" de cada setor (vem cheia; o Administrador só tira), perguntas de
 * promoção, limites por usuário, modelos publicados, memória do escritório a
 * revisar e os integrantes criados pelas pessoas.
 */
export function IntegrantesTela() {
  const aparencia = useAparencia()
  const [padrao, setPadrao] = usePersistente('cfg.int.padrao', integrantesPadraoCfg)
  const [ed, setEd] = useState<IntegrantePadraoCfg | null>(null)
  const [sozinho, setSozinho] = useState<IntegrantePadraoCfg | null>(null)
  const [perguntas, setPerguntas] = usePersistente('cfg.int.perguntas', 
    perguntasPromocao.map((p) => ({
      ...p,
      decisao: undefined as string | undefined,
    })),
  )
  const [limites, setLimites] = usePersistente('cfg.int.limites', limitesIniciais)
  const [editandoLimites, setEditandoLimites] = useState(false)
  const [modelos, setModelos] = usePersistente('cfg.int.modelos', modelosIniciais)
  const [publicando, setPublicando] = useState(false)
  const [memoria, setMemoria] = usePersistente('cfg.int.memoria', 
    memoriaParaRevisar.map((m) => ({
      ...m,
      decisao: undefined as string | undefined,
    })),
  )

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig titulo="Integrantes" sub="O time de agentes do escritório. Um integrante nunca vê nem faz mais do que a pessoa dona dele." />

        {perguntas.some((p) => !p.decisao) && (
          <Caixa className="ring-warning/40 ring-1">
            <TituloBloco descricao="Quando um integrante acerta sempre numa atividade reversível, ele pergunta uma vez. Um sim vale para sempre no escritório; um não silencia por 90 dias.">Perguntas para você</TituloBloco>
            {perguntas
              .filter((p) => !p.decisao)
              .map((p) => {
                const t = aparencia({ setor: 'fiscal' })
                return (
                  <div key={p.id} className="flex flex-wrap items-center gap-3">
                    <Orb cor={t.cor} corOlhos={t.corOlhos} estado="precisa_de_voce" tamanho={32} cutucavel={false} extras={false} />
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block">
                        {p.integrante}: posso passar a fazer <strong className="font-medium">{p.atividade}</strong> sozinho?
                      </span>
                      <span className="text-muted-foreground block text-xs">{p.base} · reversível · você pode rebaixar a qualquer momento</span>
                    </span>
                    <Button size="sm" className="rounded-full" onClick={() => setPerguntas((xs) => xs.map((x) => (x.id === p.id ? { ...x, decisao: 'sim' } : x)))}>
                      <CheckIcon /> Sim
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setPerguntas((xs) => xs.map((x) => (x.id === p.id ? { ...x, decisao: 'não' } : x)))}>
                      Agora não
                    </Button>
                  </div>
                )
              })}
          </Caixa>
        )}

        <Caixa>
          <TituloBloco descricao="Cada pessoa com o setor tem o seu, com memória e fila próprias. Desligar pausa os de todos.">Time padrão por setor</TituloBloco>
          <ul className="divide-border/70 flex flex-col divide-y">
            {padrao.map((p) => {
              const t = aparencia({ setor: p.setor })
              return (
                <li key={p.setor} className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5', !p.ligado && 'opacity-60')}>
                  <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={30} cutucavel={false} extras={false} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{t.nome}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      faz sozinho {p.sozinho} · prepara {p.prepara} · organiza {p.organiza} · avisa {nomeCanal[p.canal]}
                      {p.instrucoesEscritorio && ` · “${p.instrucoesEscritorio}”`}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    {p.setor !== 'geral' && (
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setSozinho(p)}>
                        Faz sozinho
                      </Button>
                    )}
                    <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Editar ${t.nome}`} onClick={() => setEd(p)}>
                      <PencilSimpleIcon />
                    </Button>
                    <Interruptor ocultarRotulo rotulo={`${t.nome} ligado`} ligado={p.ligado} onMudar={(v) => setPadrao((xs) => xs.map((x) => (x.setor === p.setor ? { ...x, ligado: v } : x)))} desabilitado={p.setor === 'geral'} />
                  </span>
                </li>
              )
            })}
          </ul>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <TituloBloco
              acao={
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setEditandoLimites(true)}>
                  <PencilSimpleIcon /> Editar
                </Button>
              }
              descricao="Tetos por pessoa; o integrante para e avisa ao chegar."
            >
              Limites
            </TituloBloco>
            <dl className="divide-border/70 flex flex-col divide-y">
              <Propriedade rotulo="Uso de IA por mês">{limites.tokensMes}</Propriedade>
              <Propriedade rotulo="Custo por mês">{limites.custoMes}</Propriedade>
              <Propriedade rotulo="Integrantes próprios">até {limites.integrantesPorUsuario} por pessoa</Propriedade>
              <Propriedade rotulo="Tarefas em paralelo">{limites.concorrencia} por integrante</Propriedade>
              <Propriedade rotulo="Jobs fora do horário">{limites.jobsForaHorario}</Propriedade>
            </dl>
          </Caixa>
          <Caixa>
            <TituloBloco
              acao={
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setPublicando(true)}>
                  <ShareNetworkIcon /> Publicar modelo
                </Button>
              }
              descricao="Um integrante bem ajustado vira modelo para os outros. Não leva memória, clientes nem credenciais."
            >
              Modelos do escritório
            </TituloBloco>
            <ul className="flex flex-col gap-2 text-sm">
              {modelos.map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      {m.nome} <span className="text-muted-foreground text-xs">v{m.versao}</span>
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      {m.setores} · de {m.autor} · {m.instancias} {m.instancias === 1 ? 'pessoa usa' : 'pessoas usam'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Caixa>
        </div>

        <Caixa>
          <TituloBloco descricao="O que os integrantes aprenderam e vale para todos do setor. Já está valendo; você confirma ou apaga.">Memória do escritório para revisar</TituloBloco>
          <ul className="divide-border/70 flex flex-col divide-y">
            {memoria.map((m) => (
              <li key={m.id} className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5', m.decisao && 'opacity-60')}>
                <BrainIcon className="text-muted-foreground size-5 shrink-0" />
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block">{m.regra}</span>
                  <span className="text-muted-foreground block text-xs">
                    {m.setor} · {m.escrita} · origem: {m.origem}
                  </span>
                  {m.alerta && (
                    <span className="text-warning flex items-center gap-1 text-xs">
                      <WarningIcon className="size-3.5" /> {m.alerta}
                    </span>
                  )}
                </span>
                {m.decisao ? (
                  <Badge variant={m.decisao === 'confirmada' ? 'sucesso' : 'outline'}>{m.decisao}</Badge>
                ) : (
                  <span className="flex gap-1">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setMemoria((xs) => xs.map((x) => (x.id === m.id ? { ...x, decisao: 'confirmada' } : x)))}>
                      <CheckIcon /> Confirmar
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setMemoria((xs) => xs.map((x) => (x.id === m.id ? { ...x, decisao: 'apagada' } : x)))}>
                      <TrashIcon /> Apagar
                    </Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Caixa>

        <Caixa>
          <TituloBloco descricao="Criados por cada pessoa no Time. Novos ficam 14 dias em observação: o que fariam sozinhos vira cartão.">Criados pelas pessoas</TituloBloco>
          <ul className="flex flex-col gap-2 text-sm">
            {criadosPorUsuarios.map((c) => (
              <li key={c.nome} className="flex flex-wrap items-center gap-3">
                <span className="min-w-0 flex-1">
                  {c.nome}{' '}
                  <span className="text-muted-foreground">
                    · de {c.dono} · {c.setores} · {c.situacao} · {c.custo}
                  </span>
                </span>
                <BotaoIr size="sm" variant="ghost" className="rounded-full" destino={{ modulo: 'timesheet', aba: 'equipe' }}>
                  Ver sessões
                </BotaoIr>
                <BotaoAlternar size="sm" variant="ghost" className="rounded-full" rotulos={['Pausar', 'Retomar']} textos={[`${c.nome} pausado: não roda jobs nem gatilhos; o chat continua respondendo.`, `${c.nome} retomado.`]} />
              </li>
            ))}
          </ul>
        </Caixa>
      </div>

      {ed && (
        <EditarPadrao
          p={ed}
          onFechar={() => setEd(null)}
          onSalvar={(n) => {
            setPadrao((xs) => xs.map((x) => (x.setor === n.setor ? n : x)))
            setEd(null)
          }}
        />
      )}
      {sozinho && <FazSozinho p={sozinho} onFechar={() => setSozinho(null)} />}
      {editandoLimites && (
        <EditarLimites
          l={limites}
          onFechar={() => setEditandoLimites(false)}
          onSalvar={(l) => {
            setLimites(l)
            setEditandoLimites(false)
          }}
        />
      )}
      {publicando && (
        <PublicarModelo
          onFechar={() => setPublicando(false)}
          onPublicar={(nome, setores) => {
            setModelos((xs) => [
              ...xs,
              {
                id: `mi${Date.now()}`,
                nome,
                autor: 'Fernanda Lima',
                versao: 1,
                instancias: 0,
                setores,
              },
            ])
            setPublicando(false)
          }}
        />
      )}
    </AreaRolagem>
  )
}

function EditarPadrao({ p, onFechar, onSalvar }: { p: IntegrantePadraoCfg; onFechar: () => void; onSalvar: (p: IntegrantePadraoCfg) => void }) {
  const aparencia = useAparencia()
  const t = aparencia({ setor: p.setor })
  const [d, setD] = useState(p)
  const [travar, setTravar] = useState(false)
  return (
    <GavetaFormulario aberta largura="lg" onFechar={onFechar} titulo={t.nome} descricao="Nome e cor ficam no Tema. Aqui: o que todos os integrantes deste setor seguem no escritório." acao="Salvar" onAcao={() => onSalvar(d)}>
      <div className="bg-sunken/60 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-xs">
        <LockSimpleIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <span>
          <span className="block font-medium">Parte fixa (da plataforma)</span>
          <span className="text-muted-foreground">O que o integrante do setor faz por padrão, em que ordem e o que nunca faz: transmitir, pagar e assinar sempre passam por uma pessoa.</span>
        </span>
      </div>
      <Campo rotulo="Regras do escritório para este setor" ajuda="Vale para todos os integrantes do setor, antes das instruções de cada pessoa.">
        {(id) => <CampoArea id={id} linhas={4} valor={d.instrucoesEscritorio} onMudar={(v) => setD({ ...d, instrucoesEscritorio: v })} />}
      </Campo>
      <Interruptor ligado={travar} onMudar={setTravar} rotulo="Travar estas regras" detalhe="As pessoas não conseguem contradizê-las nas instruções do próprio integrante." />
      <Campo rotulo="Onde avisa">
        {() => (
          <Segmentado
            rotulo="Canal"
            valor={d.canal}
            onMudar={(v) => setD({ ...d, canal: v })}
            opcoes={[
              { valor: 'chat', rotulo: 'Chat' },
              { valor: 'central', rotulo: 'Central de avisos' },
              { valor: 'whatsapp_do_dono', rotulo: 'WhatsApp do dono' },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

/** Lista "faz sozinho" (Fundações 3.3; 02, 3.3): vem cheia com o que o mapa marca; o Administrador só tira. */
function FazSozinho({ p, onFechar }: { p: IntegrantePadraoCfg; onFechar: () => void }) {
  const aparencia = useAparencia()
  const [lista, setLista] = usePersistente('cfg.int.lista', sozinhoFiscal)
  const [busca, setBusca] = useState('')
  const t = aparencia({ setor: p.setor })
  const visiveis = lista.filter((a) => !busca || `${a.id} ${a.nome}`.toLowerCase().includes(busca.toLowerCase()))
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={`${t.nome}: o que faz sozinho`}
      descricao={`${p.sozinho} atividades vieram ligadas pelo mapa. As que transmitem, pagam ou assinam nunca entram aqui: nelas o integrante prepara e uma pessoa conclui.`}
      acao="Salvar"
      onAcao={onFechar}
    >
      <CampoTexto valor={busca} onMudar={setBusca} placeholder="Buscar atividade (FIS-010, DAS…)" />
      <ul className="divide-border/70 flex flex-col divide-y">
        {visiveis.map((a) => (
          <li key={a.id} className="flex items-start gap-3 py-2.5">
            <span className="min-w-0 flex-1 text-sm">
              <span className="block">
                <code className="text-muted-foreground mr-1.5 text-xs">{a.id}</code>
                {a.nome}
              </span>
              {a.promovida && <span className="text-muted-foreground block text-xs">{a.promovida}</span>}
              {!a.ligado && <span className="text-muted-foreground block text-xs">tirada da lista: o integrante prepara e entrega o cartão</span>}
            </span>
            <Interruptor ocultarRotulo rotulo={`${a.id} sozinho`} ligado={a.ligado} onMudar={(v) => setLista((xs) => xs.map((x) => (x.id === a.id ? { ...x, ligado: v } : x)))} />
          </li>
        ))}
        <li className="text-muted-foreground py-2.5 text-xs">e mais {p.sozinho - lista.length} atividades ligadas…</li>
      </ul>
    </GavetaFormulario>
  )
}

function EditarLimites({ l, onFechar, onSalvar }: { l: typeof limitesIniciais; onFechar: () => void; onSalvar: (l: typeof limitesIniciais) => void }) {
  const [d, setD] = useState(l)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Limites dos integrantes"
      descricao="Por pessoa, somando os integrantes dela. A pessoa vê só a porcentagem; tokens e custo, só Gestor e Administrador."
      acao="Salvar"
      onAcao={() => onSalvar(d)}
    >
      <Campo rotulo="Uso de IA por mês">
        {(id) => (
          <CampoEscolha id={id} valor={d.tokensMes} onMudar={(v) => setD({ ...d, tokensMes: v })} opcoes={['2 mi por usuário', '4 mi por usuário', '8 mi por usuário', 'sem teto (dentro do plano)'].map((x) => ({ valor: x, rotulo: x }))} />
        )}
      </Campo>
      <Campo rotulo="Custo por mês">
        {(id) => <CampoEscolha id={id} valor={d.custoMes} onMudar={(v) => setD({ ...d, custoMes: v })} opcoes={['R$ 90 por usuário', 'R$ 180 por usuário', 'R$ 360 por usuário'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <Campo rotulo={`Integrantes próprios por pessoa: ${d.integrantesPorUsuario}`}>
        {(id) => <input id={id} type="range" min={0} max={8} value={d.integrantesPorUsuario} onChange={(e) => setD({ ...d, integrantesPorUsuario: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo={`Tarefas em paralelo por integrante: ${d.concorrencia}`}>
        {(id) => <input id={id} type="range" min={1} max={4} value={d.concorrencia} onChange={(e) => setD({ ...d, concorrencia: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo="Jobs fora do horário do escritório">
        {() => (
          <Segmentado
            rotulo="Jobs fora do horário"
            valor={d.jobsForaHorario}
            onMudar={(v) => setD({ ...d, jobsForaHorario: v })}
            opcoes={[
              { valor: 'só com aprovação', rotulo: 'Só com aprovação' },
              { valor: 'liberado', rotulo: 'Liberado' },
              { valor: 'nunca', rotulo: 'Nunca' },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

function PublicarModelo({ onFechar, onPublicar }: { onFechar: () => void; onPublicar: (nome: string, setores: string) => void }) {
  const [origem, setOrigem] = useState('Vigia do ISS (Fernanda Lima)')
  const [nome, setNome] = useState('Vigia do ISS')
  const [copia, setCopia] = useState(['persona', 'instruções', 'setores', 'ferramentas', 'gatilhos'])
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Publicar modelo de integrante"
      descricao="Outra pessoa instancia e o escopo é recalculado para ela. Versionado: quem usa decide se atualiza."
      acao="Publicar"
      acaoDesabilitada={!nome.trim()}
      onAcao={() => onPublicar(nome.trim(), 'Fiscal, Notas')}
    >
      <Campo rotulo="A partir de">{(id) => <CampoEscolha id={id} valor={origem} onMudar={setOrigem} opcoes={['Vigia do ISS (Fernanda Lima)', 'Fiscal de João Pereira'].map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
      <Campo rotulo="Nome do modelo">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} />}</Campo>
      <Campo rotulo="Copia" ajuda="Nunca copia memória, clientes, credenciais nem limites.">
        {() => <Fichas rotulo="Copia" valores={copia} onMudar={setCopia} opcoes={['persona', 'instruções', 'setores', 'ferramentas', 'gatilhos'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <XIcon className="size-3.5" /> memória · clientes · credenciais · limites
      </p>
    </GavetaFormulario>
  )
}
