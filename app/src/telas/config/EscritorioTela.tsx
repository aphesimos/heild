import { BuildingsIcon, PencilSimpleIcon, PlusIcon, WarningIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { Caixa, Propriedade, TituloBloco } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { escritorio as inicial, setoresCfg, subinquilinos as subIniciais, usuariosCfg, type SetorCfg } from '@/dados/configuracoes'
import { cn } from '@/lib/utils'

const pessoas = usuariosCfg.filter((u) => u.situacao === 'ativo').map((u) => u.nome)

/** Cabeçalho comum das abas de Configurações. */
export function CabecalhoConfig({ titulo, sub, acao }: { titulo: string; sub: string; acao?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{titulo}</h1>
        <p className="text-muted-foreground text-sm">{sub}</p>
      </div>
      {acao}
    </header>
  )
}

/**
 * Configurações › Escritório (Fundações 2.2, 4.1, 8): dados do escritório,
 * setores fixos (só renomear a exibição, desativar e escolher o responsável
 * padrão), regras de acesso, notificações padrão e subinquilinos (BPO).
 */
export function EscritorioTela() {
  const [e, setE] = usePersistente('cfg.esc.e', inicial)
  const [setores, setSetores] = usePersistente('cfg.esc.setores', setoresCfg)
  const [subs, setSubs] = usePersistente('cfg.esc.subs', subIniciais)
  const [modal, setModal] = useState<'dados' | 'regras' | 'notificacoes' | 'sub' | 'carteira' | null>(null)
  const [setorEd, setSetorEd] = useState<SetorCfg | null>(null)
  const comEquipe = setores.filter((s) => s.temEquipe)
  const perfil = setores.filter((s) => !s.temEquipe)

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig titulo="Escritório" sub="Só o Administrador muda. Toda mudança vira evento." />

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <TituloBloco acao={<EditarBotao onClick={() => setModal('dados')} />}>Dados</TituloBloco>
            <dl className="divide-border/70 flex flex-col divide-y">
              <Propriedade rotulo="Razão social">{e.razaoSocial}</Propriedade>
              <Propriedade rotulo="Nome fantasia">{e.nomeFantasia}</Propriedade>
              <Propriedade rotulo="CNPJ">{e.cnpj}</Propriedade>
              <Propriedade rotulo="CRC">{e.crc}</Propriedade>
              <Propriedade rotulo="Fuso horário">{e.fuso.replace('America/', '').replace('_', ' ')}</Propriedade>
            </dl>
          </Caixa>
          <Caixa>
            <TituloBloco acao={<EditarBotao onClick={() => setModal('regras')} />}>Regras de acesso</TituloBloco>
            <dl className="divide-border/70 flex flex-col divide-y">
              <Propriedade rotulo="Inatividade">espera depois de {e.inatividadeMin} min sem ação no Painel e no CRM (não desloga)</Propriedade>
              <Propriedade rotulo="Segundo fator">{e.segundoFator === 'administradores' ? 'obrigatório para administradores' : e.segundoFator === 'todos' ? 'obrigatório para todos' : 'opcional'}</Propriedade>
              <Propriedade rotulo="Carteira de clientes">
                <span className="flex flex-wrap items-center gap-2">
                  {e.carteiraLigada ? 'ligada: cada pessoa vê só os clientes da carteira' : 'desligada: quem tem o setor vê todos os clientes'}
                  <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs" onClick={() => (e.carteiraLigada ? setE({ ...e, carteiraLigada: false }) : setModal('carteira'))}>
                    {e.carteiraLigada ? 'Desligar carteira' : 'Ligar carteira'}
                  </Button>
                </span>
              </Propriedade>
            </dl>
          </Caixa>
        </div>

        <Caixa>
          <TituloBloco descricao="Os setores são fixos e seguem as abas do sistema. Dá para renomear a exibição, desativar um setor que o escritório não atende e escolher quem responde por ele quando o cliente não tem responsável próprio.">
            Setores
          </TituloBloco>
          <ul className="divide-border/70 flex flex-col divide-y">
            {comEquipe.map((s) => (
              <li key={s.codigo}>
                <button
                  type="button"
                  onClick={() => setSetorEd(s)}
                  className={cn(
                    'hover:bg-sunken/60 -mx-2 grid w-[calc(100%+1rem)] cursor-pointer grid-cols-[1fr_auto] items-center gap-x-3 gap-y-0.5 rounded-[12px] px-2 py-2.5 text-left text-sm sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]',
                    !s.ativo && 'opacity-60',
                  )}
                >
                  <span className="font-medium">
                    {s.nomeExibido}
                    {s.nomeExibido !== s.nomePadrao && <span className="text-muted-foreground block text-xs font-normal">padrão: {s.nomePadrao}</span>}
                  </span>
                  <span className="text-muted-foreground col-span-2 row-start-2 text-xs sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:text-sm">
                    responsável padrão: {s.responsavel ?? '—'}
                    {s.numero ? ` · WhatsApp ${s.numero}` : ' · usa o número principal'}
                  </span>
                  <span className="flex items-center gap-2">
                    {!s.ativo && <Badge variant="outline">desativado</Badge>}
                    <PencilSimpleIcon className="text-muted-foreground size-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t pt-3">
            <span className="text-muted-foreground text-xs">Setores de perfil (sem equipe; mudam o que as abas mostram para clientes desse tipo):</span>
            <div className="flex flex-wrap gap-2">
              {perfil.map((s) => (
                <button
                  key={s.codigo}
                  type="button"
                  onClick={() => setSetores((xs) => xs.map((x) => (x.codigo === s.codigo ? { ...x, ativo: !x.ativo } : x)))}
                  aria-pressed={s.ativo}
                  className={cn('cursor-pointer rounded-full border px-3 py-1 text-xs', s.ativo ? 'border-foreground/30 bg-raised font-medium' : 'text-muted-foreground')}
                >
                  {s.nomeExibido} {s.ativo ? '· ligado' : '· desligado'}
                </button>
              ))}
            </div>
          </div>
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <TituloBloco acao={<EditarBotao onClick={() => setModal('notificacoes')} />} descricao="Padrão para quem não mudou as próprias preferências.">
              Notificações
            </TituloBloco>
            <dl className="divide-border/70 flex flex-col divide-y">
              <Propriedade rotulo="Resumo diário">às {e.resumoHora}, com o que não foi urgente</Propriedade>
              <Propriedade rotulo="Silêncio">
                {e.silencio.de} às {e.silencio.ate}
                {e.silencio.fimDeSemana ? ' e fins de semana' : ''} (urgente fura o silêncio)
              </Propriedade>
            </dl>
          </Caixa>
          <Caixa>
            <TituloBloco
              acao={
                e.modoBpo ? (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setModal('sub')}>
                    <PlusIcon /> Subinquilino
                  </Button>
                ) : undefined
              }
              descricao="Para quem atende outras empresas com marca, clientes e administradores próprios."
            >
              Modo BPO
            </TituloBloco>
            <Interruptor ligado={e.modoBpo} onMudar={(v) => setE({ ...e, modoBpo: v })} rotulo="Permitir subinquilinos" detalhe="Cada um tem assinatura e tema próprios; a mãe só vê o que o subinquilino deixar." />
            {e.modoBpo && (
              <ul className="flex flex-col gap-2">
                {subs.map((s) => (
                  <li key={s.id} className="bg-sunken/60 flex items-center gap-3 rounded-[12px] px-3 py-2 text-sm">
                    <BuildingsIcon className="text-muted-foreground size-5" />
                    <span className="min-w-0 flex-1">
                      <span className="block">{s.nome}</span>
                      <span className="text-muted-foreground block text-xs">
                        {s.cnpj} · {s.clientes} clientes · {s.visivelParaMae ? 'visível para a mãe' : 'privado'}
                      </span>
                    </span>
                    <Badge variant="sucesso">{s.situacao}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Caixa>
        </div>
      </div>

      {modal === 'dados' && (
        <EditarDados
          e={e}
          onFechar={() => setModal(null)}
          onSalvar={(n) => {
            setE(n)
            setModal(null)
          }}
        />
      )}
      {modal === 'regras' && (
        <EditarRegras
          e={e}
          onFechar={() => setModal(null)}
          onSalvar={(n) => {
            setE(n)
            setModal(null)
          }}
        />
      )}
      {modal === 'notificacoes' && (
        <EditarNotificacoes
          e={e}
          onFechar={() => setModal(null)}
          onSalvar={(n) => {
            setE(n)
            setModal(null)
          }}
        />
      )}
      {modal === 'carteira' && (
        <GavetaFormulario
          aberta
          onFechar={() => setModal(null)}
          titulo="Ligar a carteira de clientes"
          descricao="Com a carteira ligada, cada Colaborador vê só os clientes atribuídos a ele (no setor ou em todos)."
          acao="Ligar carteira"
          onAcao={() => {
            setE({ ...e, carteiraLigada: true })
            setModal(null)
          }}
        >
          <p className="bg-warning/10 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
            <WarningIcon className="text-warning mt-0.5 size-4 shrink-0" />
            <span>
              <strong className="font-medium">3 colaboradores ainda não têm carteira</strong> (Ana Souza, Bruno Costa, Carla Mendes). Ao ligar, eles deixam de ver qualquer cliente até você atribuir. Administradores e Gestores continuam
              vendo tudo dos seus setores.
            </span>
          </p>
          <p className="text-muted-foreground text-sm">Monte as carteiras em Usuários e setores, em cada pessoa. Conversas de lead e de número desconhecido continuam visíveis para quem atende o setor.</p>
        </GavetaFormulario>
      )}
      {modal === 'sub' && (
        <NovoSubinquilino
          onFechar={() => setModal(null)}
          onCriar={(s) => {
            setSubs((xs) => [...xs, s])
            setModal(null)
          }}
        />
      )}
      {setorEd && (
        <EditarSetor
          s={setorEd}
          onFechar={() => setSetorEd(null)}
          onSalvar={(n) => {
            setSetores((xs) => xs.map((x) => (x.codigo === n.codigo ? n : x)))
            setSetorEd(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

function EditarBotao({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="ghost" className="rounded-full" onClick={onClick}>
      <PencilSimpleIcon /> Editar
    </Button>
  )
}

type Esc = typeof inicial

function EditarDados({ e, onFechar, onSalvar }: { e: Esc; onFechar: () => void; onSalvar: (e: Esc) => void }) {
  const [d, setD] = useState(e)
  const cnpjOk = d.cnpj.replace(/\D/g, '').length === 14
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Dados do escritório"
      descricao="O nome que aparece para clientes e equipe é o do tema (aba Tema)."
      acao="Salvar"
      acaoDesabilitada={!d.razaoSocial.trim() || !cnpjOk}
      onAcao={() => onSalvar(d)}
    >
      <Campo rotulo="Razão social">{(id) => <CampoTexto id={id} valor={d.razaoSocial} onMudar={(v) => setD({ ...d, razaoSocial: v })} />}</Campo>
      <Campo rotulo="Nome fantasia">{(id) => <CampoTexto id={id} valor={d.nomeFantasia} onMudar={(v) => setD({ ...d, nomeFantasia: v })} />}</Campo>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo rotulo="CNPJ" erro={!cnpjOk ? 'CNPJ com 14 dígitos.' : undefined}>
          {(id) => <CampoTexto id={id} valor={d.cnpj} onMudar={(v) => setD({ ...d, cnpj: v })} />}
        </Campo>
        <Campo rotulo="CRC (opcional)">{(id) => <CampoTexto id={id} valor={d.crc} onMudar={(v) => setD({ ...d, crc: v })} />}</Campo>
      </div>
      <Campo rotulo="Fuso horário" ajuda="Vale para prazos, resumo diário e jornada.">
        {(id) => (
          <CampoEscolha
            id={id}
            valor={d.fuso}
            onMudar={(v) => setD({ ...d, fuso: v })}
            opcoes={['America/Sao_Paulo', 'America/Manaus', 'America/Cuiaba', 'America/Recife', 'America/Noronha'].map((f) => ({
              valor: f,
              rotulo: f.replace('America/', '').replace('_', ' '),
            }))}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

function EditarRegras({ e, onFechar, onSalvar }: { e: Esc; onFechar: () => void; onSalvar: (e: Esc) => void }) {
  const [d, setD] = useState(e)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Regras de acesso" acao="Salvar" onAcao={() => onSalvar(d)}>
      <Campo
        rotulo={`Modo de espera depois de ${d.inatividadeMin} min sem ação`}
        ajuda="Só nas telas que registram tempo (Painel com cliente e CRM): para o contador no último evento e cobre a tela, sem deslogar. Início, Timesheet, Financeiro e Configurações não contam tempo. Mexer o mouse não conta como ação. De 2 a 5."
      >
        {(id) => <input id={id} type="range" min={2} max={5} value={d.inatividadeMin} onChange={(ev) => setD({ ...d, inatividadeMin: Number(ev.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo="Segundo fator de autenticação" ajuda="Para administradores é sempre obrigatório.">
        {() => (
          <Segmentado
            rotulo="Segundo fator"
            valor={d.segundoFator}
            onMudar={(v) => setD({ ...d, segundoFator: v })}
            opcoes={[
              { valor: 'administradores', rotulo: 'Só administradores' },
              { valor: 'todos', rotulo: 'Todos' },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

function EditarNotificacoes({ e, onFechar, onSalvar }: { e: Esc; onFechar: () => void; onSalvar: (e: Esc) => void }) {
  const [d, setD] = useState(e)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Notificações padrão"
      descricao="Cada pessoa pode mudar as próprias. Urgente vai a todos os canais e fura o silêncio; alta respeita o silêncio; normal vai para o resumo."
      acao="Salvar"
      onAcao={() => onSalvar(d)}
    >
      <Campo rotulo="Hora do resumo diário">{(id) => <CampoTexto id={id} tipo="time" valor={d.resumoHora} onMudar={(v) => setD({ ...d, resumoHora: v })} className="w-32" />}</Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Silêncio de">{(id) => <CampoTexto id={id} tipo="time" valor={d.silencio.de} onMudar={(v) => setD({ ...d, silencio: { ...d.silencio, de: v } })} />}</Campo>
        <Campo rotulo="até">{(id) => <CampoTexto id={id} tipo="time" valor={d.silencio.ate} onMudar={(v) => setD({ ...d, silencio: { ...d.silencio, ate: v } })} />}</Campo>
      </div>
      <Interruptor ligado={d.silencio.fimDeSemana} onMudar={(v) => setD({ ...d, silencio: { ...d.silencio, fimDeSemana: v } })} rotulo="Silêncio também nos fins de semana" />
    </GavetaFormulario>
  )
}

function EditarSetor({ s, onFechar, onSalvar }: { s: SetorCfg; onFechar: () => void; onSalvar: (s: SetorCfg) => void }) {
  const [d, setD] = useState(s)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={s.nomePadrao}
      descricao="O setor não se apaga nem se funde: a tela é a mesma em todo escritório. Quem cuida de dois setores recebe os dois em Usuários."
      acao="Salvar"
      acaoDesabilitada={!d.nomeExibido.trim()}
      onAcao={() => onSalvar(d)}
    >
      <Campo rotulo="Nome exibido" ajuda="Como a aba aparece para a equipe e o setor para o cliente.">
        {(id) => <CampoTexto id={id} valor={d.nomeExibido} onMudar={(v) => setD({ ...d, nomeExibido: v })} />}
      </Campo>
      <Campo rotulo="Responsável padrão" ajuda="Recebe o trabalho do setor (e o do integrante) quando o cliente não tem responsável próprio. A mesma pessoa pode responder por vários setores.">
        {(id) => <CampoEscolha id={id} valor={d.responsavel ?? pessoas[0]} onMudar={(v) => setD({ ...d, responsavel: v })} opcoes={pessoas.map((p) => ({ valor: p, rotulo: p }))} />}
      </Campo>
      <Interruptor ligado={d.ativo} onMudar={(v) => setD({ ...d, ativo: v })} rotulo="Setor ativo" detalhe={d.ativo ? 'Aparece nas abas e no time.' : 'A aba some, o integrante pausa; nada se apaga e dá para religar.'} />
      <p className="text-muted-foreground text-xs">Número de WhatsApp do setor: em CRM › Números.</p>
    </GavetaFormulario>
  )
}

function NovoSubinquilino({ onFechar, onCriar }: { onFechar: () => void; onCriar: (s: (typeof subIniciais)[number]) => void }) {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [admin, setAdmin] = useState('')
  const [visivel, setVisivel] = useState(true)
  const ok = nome.trim() && cnpj.replace(/\D/g, '').length === 14 && /@/.test(admin)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Novo subinquilino"
      descricao="Ganha assinatura própria e tema próprio (herda o seu até definir). O administrador dele recebe o convite."
      acao="Criar e convidar"
      acaoDesabilitada={!ok}
      onAcao={() =>
        onCriar({
          id: `b${Date.now()}`,
          nome,
          cnpj,
          visivelParaMae: visivel,
          situacao: 'ativo',
          clientes: 0,
        })
      }
    >
      <Campo rotulo="Razão social">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} />}</Campo>
      <Campo rotulo="CNPJ">{(id) => <CampoTexto id={id} valor={cnpj} onMudar={setCnpj} />}</Campo>
      <Campo rotulo="E-mail do administrador do subinquilino">{(id) => <CampoTexto id={id} tipo="email" valor={admin} onMudar={setAdmin} />}</Campo>
      <Interruptor ligado={visivel} onMudar={setVisivel} rotulo="Visível para o escritório-mãe" detalhe="Desligado, você não vê clientes nem dados dele; só a assinatura." />
    </GavetaFormulario>
  )
}
