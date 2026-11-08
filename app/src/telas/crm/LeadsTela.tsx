import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { usePersistente } from '@/ambiente/loja'
import { ChatCircleTextIcon, CheckIcon, FileTextIcon, HandshakeIcon, PlusIcon, SignatureIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ItemMenu, Menu } from '@/components/ui/menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Campo, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Segmentado, TextoFixo } from '@/components/ui/formulario'
import { etapasLead, metricasLeads, type EtapaLead, type Lead } from '@/dados/crm'
import { cn } from '@/lib/utils'

/**
 * CRM › Leads (04, 6): o funil como quadro, do primeiro contato à
 * implantação. Arrastar muda a etapa; "Fechar contrato" é um ato só (cria o
 * cliente, converte a pessoa, convida para o app e abre a trilha). Métricas
 * do funil na outra vista.
 */
export function LeadsTela({ leads: iniciais, onAbrirConversa }: { leads: Lead[]; onAbrirConversa?: (id: string) => void }) {
  const [leads, setLeads] = usePersistente('crm.leads', iniciais)
  const [vista, setVista] = useState<'quadro' | 'metricas'>('quadro')
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [abertoId, setAbertoId] = useState<string | null>(null)
  const [novo, setNovo] = useState(false)
  const aberto = leads.find((l) => l.id === abertoId)
  const sensores = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }), useSensor(KeyboardSensor))

  const mover = (id: string, etapa: EtapaLead, extra: Partial<Lead> = {}) => setLeads((xs) => xs.map((l) => (l.id === id ? { ...l, etapa, ...extra } : l)))

  const aoSoltar = (e: DragEndEvent) => {
    setArrastando(null)
    const destino = e.over?.id as EtapaLead | undefined
    if (!destino) return
    const id = String(e.active.id)
    // Implantação só por "Fechar contrato" (cria o cliente); Perdido pede motivo.
    if (destino === 'implantacao') return setAbertoId(id)
    mover(id, destino, destino === 'perdido' ? { motivoPerda: 'a definir' } : {})
  }

  return (
    <div className="flex h-full flex-col gap-3 px-3 pb-3 sm:px-5 sm:pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-sunken flex rounded-full p-0.5 text-xs">
          {(['quadro', 'metricas'] as const).map((v) => (
            <button key={v} type="button" onClick={() => setVista(v)} className={cn('cursor-pointer rounded-full px-3 py-1.5', vista === v ? 'bg-raised shadow-pilula' : 'text-muted-foreground')}>
              <TextoFixo ativo={vista === v}>{v === 'quadro' ? 'Quadro' : 'Métricas'}</TextoFixo>
            </button>
          ))}
        </div>
        <span className="text-muted-foreground text-xs">Lead conversa só pelo WhatsApp; o quadro é a outra face da conversa. A IA nunca cita preço.</span>
        <Button size="sm" variant="outline" className="ml-auto rounded-full" onClick={() => setNovo(true)}>
          <PlusIcon /> Lead
        </Button>
      </div>

      {vista === 'quadro' ? (
        <DndContext sensors={sensores} onDragStart={(e) => setArrastando(String(e.active.id))} onDragEnd={aoSoltar} onDragCancel={() => setArrastando(null)}>
          {/* O quadro é um painel de superfície (como a caixa de Conversas); as etapas são faixas divididas por linhas e os cartões ficam na camada elevada. */}
          <div className="bg-surface shadow-painel divide-border/70 flex min-h-0 flex-1 divide-x overflow-x-auto rounded-[24px] sm:rounded-[34px]">
            {etapasLead.map((et) => (
              <Coluna key={et.id} id={et.id} rotulo={et.rotulo} itens={leads.filter((l) => l.etapa === et.id)} onAbrir={setAbertoId} arrastando={arrastando} />
            ))}
          </div>
          <DragOverlay>{arrastando ? <CartaoLead lead={leads.find((l) => l.id === arrastando)!} className="shadow-2xl rotate-1" /> : null}</DragOverlay>
        </DndContext>
      ) : (
        <Metricas />
      )}

      {novo && (
        <NovoLead
          onFechar={() => setNovo(false)}
          onCriar={(l) => {
            setLeads((xs) => [l, ...xs])
            setNovo(false)
          }}
        />
      )}

      <Sheet open={!!aberto} onOpenChange={(v) => !v && setAbertoId(null)}>
        <SheetContent className="gap-0 sm:max-w-md">
          {aberto && <DetalheLead lead={aberto} onMover={(etapa, extra) => mover(aberto.id, etapa, extra)} onAbrirConversa={aberto.conversaId ? () => onAbrirConversa?.(aberto.conversaId!) : undefined} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function Coluna({ id, rotulo, itens, onAbrir, arrastando }: { id: EtapaLead; rotulo: string; itens: Lead[]; onAbrir: (id: string) => void; arrastando: string | null }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <section ref={setNodeRef} aria-label={rotulo} className={cn('flex w-64 shrink-0 flex-col transition-colors lg:w-auto lg:min-w-52 lg:flex-1', isOver && 'bg-sunken/70', id === 'perdido' && 'bg-sunken/30')}>
      <header className="flex items-center gap-2 px-4 pt-4 pb-3">
        <h3 className="text-sm font-medium">{rotulo}</h3>
        <span className="bg-sunken text-muted-foreground rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums">{itens.length}</span>
        {id === 'perdido' && <span className="text-muted-foreground ml-auto text-[11px]">no mês</span>}
      </header>
      <AreaRolagem className="flex-1 px-3 pb-3">
        <ul className="flex flex-col gap-2.5">
          {itens.map((l) => (
            <li key={l.id}>
              <Arrastavel id={l.id} escondido={arrastando === l.id}>
                <CartaoLead lead={l} onClick={() => onAbrir(l.id)} />
              </Arrastavel>
            </li>
          ))}
          {!itens.length && <li className="text-muted-foreground border-border rounded-[16px] border border-dashed px-3 py-6 text-center text-xs">Solte aqui</li>}
        </ul>
      </AreaRolagem>
    </section>
  )
}

function Arrastavel({ id, escondido, children }: { id: string; escondido: boolean; children: ReactNode }) {
  const { setNodeRef, attributes, listeners } = useDraggable({ id })
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className={cn('touch-none', escondido && 'opacity-30')}>
      {children}
    </div>
  )
}

function CartaoLead({ lead: l, onClick, className }: { lead: Lead; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn('bg-raised shadow-cartao flex w-full cursor-pointer flex-col gap-1.5 rounded-[16px] p-3 text-left', className)}>
      <span className="flex items-start gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{l.nome}</span>
        {l.prazoMin != null && (
          <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums', l.prazoMin < 0 ? 'bg-destructive/12 text-destructive' : 'bg-warning/15')}>
            {l.prazoMin < 0 ? `−${-l.prazoMin} min` : `${l.prazoMin} min`}
          </span>
        )}
      </span>
      <span className="text-muted-foreground truncate text-xs">{l.contato.toLowerCase().includes(l.origem) ? l.contato : `${l.contato} · ${l.origem}`}</span>
      {l.qualificacao && <span className="truncate text-xs">{l.qualificacao}</span>}
      {l.valor && <span className="font-heading text-base font-light tabular-nums">{l.valor}</span>}
      {l.trilha && (
        <span className="flex items-center gap-2 text-[11px]">
          <span className="bg-sunken h-1.5 flex-1 overflow-hidden rounded-full">
            <span className="bg-success block h-full rounded-full" style={{ width: `${(l.trilha.feitos / l.trilha.total) * 100}%` }} />
          </span>
          trilha {l.trilha.feitos}/{l.trilha.total}
        </span>
      )}
      {l.motivoPerda && <Badge variant="outline">{l.motivoPerda}</Badge>}
      <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
        <span className="min-w-0 flex-1 truncate">{l.proxima ?? l.desde}</span>
        {l.responsavel && <span className="shrink-0">{l.responsavel.split(' ')[0]}</span>}
      </span>
    </button>
  )
}

function DetalheLead({ lead: l, onMover, onAbrirConversa }: { lead: Lead; onMover: (e: EtapaLead, extra?: Partial<Lead>) => void; onAbrirConversa?: () => void }) {
  const [confirmando, setConfirmando] = useState(false)
  const etapa = etapasLead.find((e) => e.id === l.etapa)!
  return (
    <>
      <SheetHeader>
        <SheetTitle>{l.nome}</SheetTitle>
        <SheetDescription>
          {etapa.rotulo} · {l.origem} · desde {l.desde.replace('há ', 'há ')}
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4 overflow-y-auto p-4 text-sm">
        <ol className="flex gap-1" aria-label="Etapas">
          {etapasLead
            .filter((e) => e.id !== 'perdido')
            .map((e, i, arr) => {
              const atual = arr.findIndex((x) => x.id === l.etapa)
              return <li key={e.id} title={e.rotulo} className={cn('h-1.5 flex-1 rounded-full', l.etapa === 'perdido' ? 'bg-sunken' : i < atual ? 'bg-success' : i === atual ? 'bg-foreground' : 'bg-sunken')} />
            })}
        </ol>
        <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1.5">
          <dt className="text-muted-foreground">Contato</dt>
          <dd>{l.contato}</dd>
          <dt className="text-muted-foreground">Responsável</dt>
          <dd>{l.responsavel ?? <span className="text-warning">sem responsável</span>}</dd>
          <dt className="text-muted-foreground">Qualificação</dt>
          <dd>{l.qualificacao ?? 'regime, porte, serviços e contabilidade atual: o integrante pergunta'}</dd>
          {l.servicos && (
            <>
              <dt className="text-muted-foreground">Serviços</dt>
              <dd className="flex flex-wrap gap-1">
                {l.servicos.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </dd>
            </>
          )}
          {l.valor && (
            <>
              <dt className="text-muted-foreground">Proposta</dt>
              <dd className="tabular-nums">{l.valor}</dd>
            </>
          )}
          {l.proxima && (
            <>
              <dt className="text-muted-foreground">Próximo passo</dt>
              <dd>{l.proxima}</dd>
            </>
          )}
        </dl>

        {onAbrirConversa && (
          <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={onAbrirConversa}>
            <ChatCircleTextIcon /> Abrir a conversa
          </Button>
        )}

        <div className="flex flex-col gap-2 border-t pt-4">
          <h3 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">Próxima ação</h3>
          {l.etapa === 'lead' && <Acao icone={<CheckIcon />} titulo="Marcar como qualificado" nivel="executar" onClick={() => onMover('qualificado', { proxima: 'montar proposta' })} />}
          {l.etapa === 'qualificado' && (
            <Acao
              icone={<FileTextIcon />}
              titulo="Gerar proposta"
              nivel="preparar · a IA rascunha da qualificação e da tabela; sai sempre por pessoa"
              onClick={() => onMover('proposta', { valor: l.valor ?? 'R$ 2.400/mês', proxima: 'rascunho aguardando sua revisão' })}
            />
          )}
          {l.etapa === 'proposta' && <Acao icone={<SignatureIcon />} titulo="Aceite recebido: gerar contrato" nivel="preparar · assinatura por fornecedor externo" onClick={() => onMover('contrato', { proxima: 'assinatura pendente' })} />}
          {l.etapa === 'contrato' &&
            (confirmando ? (
              <div className="bg-sunken flex flex-col gap-2 rounded-[16px] p-3">
                <p className="font-medium">Fechar contrato faz, de uma vez:</p>
                <ul className="text-muted-foreground list-disc pl-4 text-xs">
                  <li>cria o cliente "{l.nome}" em implantação, com a primeira versão do perfil</li>
                  <li>liga conversas e documentos do lead ao cliente</li>
                  <li>converte a pessoa em sócio e envia o convite do app</li>
                  <li>abre a trilha de implantação (Societário e Atendimento)</li>
                </ul>
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => onMover('implantacao', { trilha: { feitos: 0, total: 9 }, proxima: 'trilha aberta agora' })}>
                    <HandshakeIcon /> Fechar contrato
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConfirmando(false)}>
                    Voltar
                  </Button>
                </div>
              </div>
            ) : (
              <Acao icone={<HandshakeIcon />} titulo="Contrato assinado: fechar" nivel="executar com aprovação · irreversível" onClick={() => setConfirmando(true)} />
            ))}
          {l.etapa === 'implantacao' && <p className="text-muted-foreground text-xs">A trilha segue no Painel (Societário). Concluída, o cliente vira ativo.</p>}
          {l.etapa === 'perdido' ? (
            <Acao icone={<CheckIcon />} titulo="Reabrir lead" nivel="executar" onClick={() => onMover('lead', { motivoPerda: undefined })} />
          ) : (
            l.etapa !== 'implantacao' && (
              <Menu
                gatilho={
                  <Button size="sm" variant="ghost" className="text-muted-foreground w-fit rounded-full">
                    <XCircleIcon /> Marcar como perdido
                  </Button>
                }
              >
                {['preço', 'sem contato', 'escolheu outro', 'fora do perfil'].map((m) => (
                  <ItemMenu key={m} onClick={() => onMover('perdido', { motivoPerda: m, prazoMin: undefined })}>
                    {m}
                  </ItemMenu>
                ))}
              </Menu>
            )
          )}
          <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
            <WarningIcon className="mt-0.5 size-3.5 shrink-0" /> Lead perdido fica guardado para campanhas futuras; o conteúdo das conversas some em 12 meses.
          </p>
        </div>
      </div>
    </>
  )
}

function Acao({ icone, titulo, nivel, onClick }: { icone: ReactNode; titulo: string; nivel: string; onClick: () => void }) {
  return (
    <Button variant="secondary" className="h-auto w-full justify-start gap-2.5 rounded-[14px] py-2 text-left whitespace-normal" onClick={onClick}>
      {icone}
      <span className="flex flex-col">
        <span className="text-sm">{titulo}</span>
        <span className="text-muted-foreground text-[11px] font-normal">{nivel}</span>
      </span>
    </Button>
  )
}

function Metricas() {
  const m = metricasLeads
  const topo = m.conversao[0].n
  return (
    <AreaRolagem className="min-h-0 flex-1">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Caixa titulo="Primeira resposta ao lead">
          <span className="font-heading text-4xl font-light tabular-nums">{m.primeiraResposta}</span>
          <span className="text-muted-foreground text-xs">média do mês · meta 15 min</span>
        </Caixa>
        <Caixa titulo="Honorário fechado no mês">
          <span className="font-heading text-4xl font-light tabular-nums">{m.fechadoMes}</span>
          <span className="text-muted-foreground text-xs">2 contratos</span>
        </Caixa>
        <Caixa titulo="Leads por origem">
          <ul className="flex flex-col gap-1.5">
            {m.porOrigem.map((o) => (
              <li key={o.origem} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2 text-sm">
                <span>{o.origem}</span>
                <span className="bg-sunken h-2 overflow-hidden rounded-full">
                  <span className="bg-foreground/60 block h-full rounded-full" style={{ width: `${(o.n / m.porOrigem[0].n) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">{o.n}</span>
              </li>
            ))}
          </ul>
        </Caixa>
        <Caixa titulo="Motivos de perda">
          <ul className="flex flex-col gap-1 text-sm">
            {m.motivosPerda.map((x) => (
              <li key={x.motivo} className="flex justify-between">
                <span>{x.motivo}</span>
                <span className="tabular-nums">{x.n}</span>
              </li>
            ))}
          </ul>
        </Caixa>
        <Caixa titulo="Conversão por etapa" className="md:col-span-2 xl:col-span-4">
          <ol className="flex flex-col gap-2">
            {m.conversao.map((c, i) => (
              <li key={c.etapa} className="grid grid-cols-[6.5rem_1fr_6rem] items-center gap-3 text-sm">
                <span>{c.etapa}</span>
                <span className="bg-sunken h-6 overflow-hidden rounded-[8px]">
                  <span className="bg-foreground/70 block h-full rounded-[8px]" style={{ width: `${(c.n / topo) * 100}%` }} />
                </span>
                <span className="text-muted-foreground text-right text-xs tabular-nums">
                  {c.n}
                  {i > 0 && ` · ${Math.round((c.n / m.conversao[i - 1].n) * 100)}%`}
                </span>
              </li>
            ))}
          </ol>
        </Caixa>
      </div>
    </AreaRolagem>
  )
}

function Caixa({ titulo, children, className }: { titulo: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('bg-surface shadow-cartao flex flex-col gap-2 rounded-[24px] p-4', className)}>
      <h3 className="text-sm font-medium">{titulo}</h3>
      {children}
    </section>
  )
}

/** Lead manual (04, 6.1): indicação, Instagram, evento. O WhatsApp cria sozinho. */
function NovoLead({ onFechar, onCriar }: { onFechar: () => void; onCriar: (l: Lead) => void }) {
  const [nome, setNome] = useState('')
  const [pessoa, setPessoa] = useState('')
  const [telefone, setTelefone] = useState('')
  const [origem, setOrigem] = useState<Lead['origem']>('indicação')
  const [indicadoPor, setIndicadoPor] = useState('')
  const [responsavel, setResponsavel] = useState('Bruno Costa')
  const [servicos, setServicos] = useState<string[]>([])
  const [proxima, setProxima] = useState('')
  const telefoneOk = telefone.replace(/\D/g, '').length >= 10
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Novo lead"
      descricao="Lead que não chegou pelo WhatsApp. A primeira conversa sai pelo número principal, com o modelo de boas-vindas."
      acao="Criar lead"
      acaoDesabilitada={!nome.trim() || !telefoneOk}
      onAcao={() =>
        onCriar({
          id: `l${Date.now()}`,
          nome: nome.trim(),
          contato: `${pessoa || 'contato'}${origem === 'indicação' && indicadoPor ? ` · indicação de ${indicadoPor}` : ''}`,
          origem,
          etapa: 'lead',
          responsavel,
          servicos: servicos.length ? servicos : undefined,
          proxima: proxima || 'primeiro contato',
          desde: 'agora',
        })
      }
    >
      <Campo rotulo="Empresa ou nome">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} placeholder="ex.: Padaria Trigo Bom" />}</Campo>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo rotulo="Pessoa de contato">{(id) => <CampoTexto id={id} valor={pessoa} onMudar={setPessoa} placeholder="ex.: Marta" />}</Campo>
        <Campo rotulo="WhatsApp" erro={telefone && !telefoneOk ? 'Número incompleto.' : undefined}>
          {(id) => <CampoTexto id={id} tipo="tel" valor={telefone} onMudar={setTelefone} placeholder="+55 11 9…" />}
        </Campo>
      </div>
      <Campo rotulo="Origem">
        {() => (
          <Segmentado
            rotulo="Origem"
            valor={origem}
            onMudar={setOrigem}
            opcoes={[
              { valor: 'indicação', rotulo: 'Indicação' },
              { valor: 'instagram', rotulo: 'Instagram' },
              { valor: 'site', rotulo: 'Site' },
              { valor: 'whatsapp', rotulo: 'WhatsApp' },
            ]}
          />
        )}
      </Campo>
      {origem === 'indicação' && (
        <Campo rotulo="Indicado por" ajuda="Cliente ou parceiro; entra nas métricas de origem.">
          {(id) => <CampoTexto id={id} valor={indicadoPor} onMudar={setIndicadoPor} placeholder="ex.: Padaria Pão Quente" />}
        </Campo>
      )}
      <Campo rotulo="Responsável">{(id) => <CampoEscolha id={id} valor={responsavel} onMudar={setResponsavel} opcoes={['Bruno Costa', 'Fernanda Lima', 'João Pereira'].map((n) => ({ valor: n, rotulo: n }))} />}</Campo>
      <Campo rotulo="Serviços de interesse">{() => <Fichas rotulo="Serviços" valores={servicos} onMudar={setServicos} opcoes={['Fiscal', 'DP', 'Contábil', 'Societário', 'Consultoria'].map((s) => ({ valor: s, rotulo: s }))} />}</Campo>
      <Campo rotulo="Próximo passo (opcional)">{(id) => <CampoTexto id={id} valor={proxima} onMudar={setProxima} placeholder="ex.: ligar quinta 10h" />}</Campo>
    </GavetaFormulario>
  )
}
