import { ArrowCounterClockwiseIcon, EyeIcon, PlusIcon, ShieldCheckIcon, TrashIcon, UserPlusIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { BotaoFeito } from '@/ambiente/interface'
import { useState } from 'react'
import { Caixa, TituloBloco } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Segmentado } from '@/components/ui/formulario'
import { rotuloSetor } from '@/dados/crm'
import { convitesPendentes as convIniciais, escritorio, telasSistema, usuariosCfg, type ExcecaoTela, type Papel, type UsuarioCfg, type Vinculo } from '@/dados/configuracoes'
import { clientes } from '@/dados/exemplo'
import { cn } from '@/lib/utils'
import type { SetorIntegrante } from '@/theme/tipos'
import { CabecalhoConfig } from './EscritorioTela'

const setoresEquipe: SetorIntegrante[] = ['societario', 'fiscal', 'notas', 'dp', 'contabil', 'consultor', 'gestao_atendimento', 'financeiro_escritorio', 'bpo_financeiro']
const rotuloPapel: Record<Papel, string> = {
  administrador: 'Administrador',
  gestor: 'Gestor',
  colaborador: 'Colaborador',
}
const nomeSetor = (s: SetorIntegrante) => (s === 'financeiro_escritorio' ? 'Financeiro do escritório' : rotuloSetor[s])

/**
 * Configurações › Usuários e setores (Fundações 2.2 a 2.4, 3): quem entra,
 * com que papel, em que setores (gestão ou execução), com que exceções por
 * tela e, com a carteira ligada, que clientes vê. Convites, bloqueio e
 * "o que Fulano vê?" calculado.
 */
export function UsuariosTela() {
  const [usuarios, setUsuarios] = usePersistente('cfg.usu.usuarios', usuariosCfg)
  const [convites, setConvites] = usePersistente('cfg.usu.convites', convIniciais)
  const [editando, setEditando] = useState<UsuarioCfg | null>(null)
  const [convidando, setConvidando] = useState(false)
  const [vendo, setVendo] = useState<UsuarioCfg | null>(null)
  const [mostrarInativos, setMostrarInativos] = useState(false)
  const visiveis = usuarios.filter((u) => mostrarInativos || u.situacao !== 'desativado')

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig
          titulo="Usuários e setores"
          sub={`${usuarios.filter((u) => u.situacao === 'ativo').length} ativos de 12 no plano · carteira de clientes ${escritorio.carteiraLigada ? 'ligada' : 'desligada'}`}
          acao={
            <Button size="sm" className="rounded-full" onClick={() => setConvidando(true)}>
              <UserPlusIcon /> Convidar
            </Button>
          }
        />
        <Caixa>
          <TituloBloco
            acao={
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setMostrarInativos((v) => !v)}>
                {mostrarInativos ? 'Esconder desativados' : 'Mostrar desativados'}
              </Button>
            }
          >
            Pessoas
          </TituloBloco>
          <ul className="divide-border/70 flex flex-col divide-y">
            {visiveis.map((u) => (
              <li key={u.id} className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3', u.situacao === 'desativado' && 'opacity-60')}>
                <span className="bg-sunken flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  {u.nome
                    .split(' ')
                    .map((x) => x[0])
                    .join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                    {u.nome}
                    <Badge variant={u.papel === 'administrador' ? 'default' : 'outline'}>{rotuloPapel[u.papel]}</Badge>
                    {u.situacao !== 'ativo' && <Badge variant={u.situacao === 'convidado' ? 'destaque' : 'secondary'}>{u.situacao}</Badge>}
                    {u.segundoFator && <ShieldCheckIcon className="text-success size-4" aria-label="segundo fator ligado" />}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {u.papel === 'administrador' ? 'todos os setores' : u.vinculos.map((v) => `${nomeSetor(v.setor)}${v.modo === 'gestao' ? ' (gestão)' : ''}`).join(', ') || 'sem setor'}
                    {u.excecoes.length > 0 && ` · ${u.excecoes.length} ${u.excecoes.length === 1 ? 'exceção' : 'exceções'}`} · {u.ultimoAcesso}
                  </span>
                </span>
                <span className="flex gap-1">
                  {u.papel !== 'administrador' && u.situacao === 'ativo' && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setVendo(u)}>
                      <EyeIcon /> O que vê
                    </Button>
                  )}
                  {u.situacao === 'desativado' ? (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setUsuarios((xs) => xs.map((x) => (x.id === u.id ? { ...x, situacao: 'ativo' } : x)))}>
                      <ArrowCounterClockwiseIcon /> Reativar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditando(u)}>
                      Editar
                    </Button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Caixa>
        {convites.length > 0 && (
          <Caixa>
            <TituloBloco descricao="Convites valem 7 dias. Aceitar cria a conta e grava os setores.">Convites pendentes</TituloBloco>
            <ul className="flex flex-col gap-2">
              {convites.map((c) => (
                <li key={c.email} className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="min-w-0 flex-1">
                    {c.email}{' '}
                    <span className="text-muted-foreground">
                      · {c.papel} · {c.setores} · enviado {c.enviado} · expira {c.expira}
                    </span>
                  </span>
                  <BotaoFeito size="sm" variant="ghost" className="rounded-full" texto={`Convite reenviado para ${c.email}; vale por mais 7 dias.`}>
                    Reenviar
                  </BotaoFeito>
                  <Button size="sm" variant="ghost" className="text-muted-foreground rounded-full" onClick={() => setConvites((xs) => xs.filter((x) => x.email !== c.email))}>
                    <XIcon /> Cancelar
                  </Button>
                </li>
              ))}
            </ul>
          </Caixa>
        )}
      </div>

      {convidando && (
        <Convidar
          existentes={usuarios.map((u) => u.email)}
          onFechar={() => setConvidando(false)}
          onConvidar={(u) => {
            setUsuarios((xs) => [...xs, u])
            setConvites((xs) => [
              ...xs,
              {
                email: u.email,
                papel: u.papel,
                setores: u.vinculos.map((v) => nomeSetor(v.setor)).join(', ') || 'todos',
                enviado: 'agora',
                expira: 'em 7 dias',
              },
            ])
            setConvidando(false)
          }}
        />
      )}
      {editando && (
        <EditarUsuario
          key={editando.id}
          u={editando}
          onFechar={() => setEditando(null)}
          onSalvar={(u) => {
            setUsuarios((xs) => xs.map((x) => (x.id === u.id ? u : x)))
            setEditando(null)
          }}
        />
      )}
      {vendo && <OQueVe u={vendo} onFechar={() => setVendo(null)} />}
    </AreaRolagem>
  )
}

/** Vínculos por setor: sem vínculo, execução ou gestão. */
function EditorVinculos({ vinculos, onMudar }: { vinculos: Vinculo[]; onMudar: (v: Vinculo[]) => void }) {
  const modoDe = (s: SetorIntegrante) => vinculos.find((v) => v.setor === s)?.modo ?? 'nenhum'
  const mudar = (s: SetorIntegrante, m: 'nenhum' | 'execucao' | 'gestao') => onMudar(m === 'nenhum' ? vinculos.filter((v) => v.setor !== s) : [...vinculos.filter((v) => v.setor !== s), { setor: s, modo: m }])
  return (
    <ul className="flex flex-col gap-1.5">
      {setoresEquipe.map((s) => (
        <li key={s} className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>{nomeSetor(s)}</span>
          <Segmentado
            rotulo={`Vínculo com ${nomeSetor(s)}`}
            valor={modoDe(s)}
            onMudar={(m) => mudar(s, m)}
            opcoes={[
              { valor: 'nenhum', rotulo: '—' },
              { valor: 'execucao', rotulo: 'Execução' },
              { valor: 'gestao', rotulo: 'Gestão' },
            ]}
          />
        </li>
      ))}
    </ul>
  )
}

function Convidar({ existentes, onFechar, onConvidar }: { existentes: string[]; onFechar: () => void; onConvidar: (u: UsuarioCfg) => void }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [papel, setPapel] = useState<Papel>('colaborador')
  const [vinculos, setVinculos] = useState<Vinculo[]>([])
  const repetido = existentes.includes(email.trim().toLowerCase())
  const ok = nome.trim() && /^\S+@\S+\.\S+$/.test(email) && !repetido && (papel === 'administrador' || vinculos.length > 0)
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Convidar pessoa"
      descricao="O convite vai por e-mail e vale 7 dias. Administrador não precisa de setores e sempre usa segundo fator."
      acao="Enviar convite"
      acaoDesabilitada={!ok}
      onAcao={() =>
        onConvidar({
          id: `u${Date.now()}`,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          papel,
          situacao: 'convidado',
          vinculos: papel === 'administrador' ? [] : vinculos,
          excecoes: [],
          carteira: [],
          segundoFator: false,
          ultimoAcesso: 'convite enviado agora',
        })
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo rotulo="Nome">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} />}</Campo>
        <Campo rotulo="E-mail" erro={repetido ? 'Já existe uma pessoa com esse e-mail.' : undefined}>
          {(id) => <CampoTexto id={id} tipo="email" valor={email} onMudar={setEmail} />}
        </Campo>
      </div>
      <Campo
        rotulo="Papel"
        ajuda={
          papel === 'gestor' ? 'Gestor aprova, reatribui e vê o timesheet da equipe nos setores em que tem gestão.' : papel === 'administrador' ? 'Vê e configura tudo o que a assinatura libera.' : 'Trabalha nos setores em que tem vínculo.'
        }
      >
        {() => (
          <Segmentado
            rotulo="Papel"
            valor={papel}
            onMudar={setPapel}
            opcoes={(Object.keys(rotuloPapel) as Papel[]).map((p) => ({
              valor: p,
              rotulo: rotuloPapel[p],
            }))}
          />
        )}
      </Campo>
      {papel !== 'administrador' && (
        <Campo rotulo="Setores" ajuda="Gestão libera as ferramentas de gestão do setor; execução, só o trabalho. Uma pessoa pode ter gestão num setor e execução em outro." erro={!vinculos.length ? 'Escolha ao menos um setor.' : undefined}>
          {() => <EditorVinculos vinculos={vinculos} onMudar={setVinculos} />}
        </Campo>
      )}
    </GavetaFormulario>
  )
}

function EditarUsuario({ u, onFechar, onSalvar }: { u: UsuarioCfg; onFechar: () => void; onSalvar: (u: UsuarioCfg) => void }) {
  const [d, setD] = useState(u)
  const [excecao, setExcecao] = useState<ExcecaoTela | null>(null)
  const [desativando, setDesativando] = useState(false)
  const [repasse, setRepasse] = useState('Fernanda Lima')

  if (excecao)
    return (
      <GavetaFormulario
        aberta
        onFechar={() => setExcecao(null)}
        titulo={`Exceção por tela · ${u.nome}`}
        descricao="Muda uma tela inteira, por cima dos setores: liberada aparece até o nível escolhido; bloqueada some mesmo com o setor. O motivo vai para o registro."
        acao="Adicionar exceção"
        acaoDesabilitada={!excecao.motivo.trim()}
        onAcao={() => {
          setD({
            ...d,
            excecoes: [...d.excecoes, { ...excecao, id: `x${Date.now()}` }],
          })
          setExcecao(null)
        }}
      >
        <Campo rotulo="Tela">
          {(id) => (
            <CampoEscolha
              id={id}
              valor={excecao.tela}
              onMudar={(v) => setExcecao({ ...excecao, tela: v })}
              opcoes={telasSistema.map((t) => ({
                valor: t.id,
                rotulo: t.rotulo,
              }))}
            />
          )}
        </Campo>
        <Campo rotulo="Efeito">
          {() => (
            <Segmentado
              rotulo="Efeito"
              valor={excecao.efeito}
              onMudar={(v) => setExcecao({ ...excecao, efeito: v })}
              opcoes={[
                { valor: 'liberar', rotulo: 'Liberar' },
                { valor: 'bloquear', rotulo: 'Bloquear' },
              ]}
            />
          )}
        </Campo>
        {excecao.efeito === 'liberar' && (
          <Campo rotulo="Até o nível" ajuda="Ler: vê sem botões. Rascunhar: prepara sem efeito externo. Executar: envia, conclui, altera.">
            {() => (
              <Segmentado
                rotulo="Nível"
                valor={excecao.nivel ?? 'ler'}
                onMudar={(v) => setExcecao({ ...excecao, nivel: v })}
                opcoes={[
                  { valor: 'ler', rotulo: 'Ler' },
                  { valor: 'rascunhar', rotulo: 'Rascunhar' },
                  { valor: 'executar', rotulo: 'Executar' },
                ]}
              />
            )}
          </Campo>
        )}
        <Campo rotulo="Motivo" erro={!excecao.motivo.trim() ? 'Obrigatório.' : undefined}>
          {(id) => <CampoArea id={id} linhas={2} valor={excecao.motivo} onMudar={(v) => setExcecao({ ...excecao, motivo: v })} />}
        </Campo>
        <Campo rotulo="Vale até (opcional)" ajuda="dd/mm; vazio = sem fim.">
          {(id) => <CampoTexto id={id} valor={excecao.ate ?? ''} onMudar={(v) => setExcecao({ ...excecao, ate: v || undefined })} placeholder="31/12" className="w-32" />}
        </Campo>
      </GavetaFormulario>
    )

  if (desativando)
    return (
      <GavetaFormulario
        aberta
        onFechar={() => setDesativando(false)}
        titulo={`Desativar ${u.nome}`}
        descricao="A pessoa perde o acesso na hora. Nada se apaga: sessões, tarefas feitas e horas continuam (são histórico e custo do cliente)."
        acao="Desativar"
        onAcao={() =>
          onSalvar({
            ...d,
            situacao: 'desativado',
            ultimoAcesso: 'desativada agora',
          })
        }
      >
        <p className="bg-warning/10 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
          <WarningIcon className="text-warning mt-0.5 size-4 shrink-0" />
          <span>Tem 7 tarefas abertas, 2 conversas em atendimento e é responsável padrão de 0 setores. Os integrantes dela pausam.</span>
        </p>
        <Campo rotulo="Repassar tarefas e conversas para" ajuda="As conversas voltam como “nova” se a pessoa escolhida não tiver o setor.">
          {(id) => <CampoEscolha id={id} valor={repasse} onMudar={setRepasse} opcoes={usuariosCfg.filter((x) => x.situacao === 'ativo' && x.id !== u.id).map((x) => ({ valor: x.nome, rotulo: x.nome }))} />}
        </Campo>
      </GavetaFormulario>
    )

  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={u.nome}
      descricao={u.email}
      acao="Salvar"
      onAcao={() => onSalvar(d)}
      secundaria={
        u.papel !== 'administrador' || usuariosCfg.filter((x) => x.papel === 'administrador').length > 1 ? (
          <span className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() =>
                onSalvar({
                  ...d,
                  situacao: d.situacao === 'bloqueado' ? 'ativo' : 'bloqueado',
                })
              }
            >
              {d.situacao === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
            </Button>
            <Button type="button" variant="ghost" className="text-destructive rounded-full" onClick={() => setDesativando(true)}>
              Desativar
            </Button>
          </span>
        ) : undefined
      }
    >
      <Campo rotulo="Papel">
        {() => (
          <Segmentado
            rotulo="Papel"
            valor={d.papel}
            onMudar={(p) => setD({ ...d, papel: p })}
            opcoes={(Object.keys(rotuloPapel) as Papel[]).map((p) => ({
              valor: p,
              rotulo: rotuloPapel[p],
            }))}
          />
        )}
      </Campo>
      {d.papel !== 'administrador' && <Campo rotulo="Setores">{() => <EditorVinculos vinculos={d.vinculos} onMudar={(v) => setD({ ...d, vinculos: v })} />}</Campo>}
      <Campo rotulo="Cargo (opcional)" ajuda="Só para o custo-hora por cargo, se o escritório usar o refinamento. Nunca salário.">
        {(id) => (
          <CampoEscolha
            id={id}
            valor={d.cargo ?? ''}
            onMudar={(v) => setD({ ...d, cargo: v || undefined })}
            opcoes={[
              { valor: '', rotulo: 'sem cargo' },
              ...['Sênior', 'Pleno', 'Júnior'].map((c) => ({
                valor: c,
                rotulo: c,
              })),
            ]}
          />
        )}
      </Campo>
      {d.papel !== 'administrador' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Exceções por tela</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() =>
                setExcecao({
                  id: '',
                  tela: telasSistema[0].id,
                  efeito: 'liberar',
                  nivel: 'ler',
                  motivo: '',
                })
              }
            >
              <PlusIcon /> Exceção
            </Button>
          </div>
          {d.excecoes.length ? (
            d.excecoes.map((x) => (
              <div key={x.id} className="bg-sunken/60 flex items-start gap-2 rounded-[12px] px-3 py-2 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block">
                    {x.efeito === 'liberar' ? `Libera até ${x.nivel}` : 'Bloqueia'}: {telasSistema.find((t) => t.id === x.tela)?.rotulo}
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    {x.motivo}
                    {x.ate && ` · até ${x.ate}`}
                  </span>
                </span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full"
                  aria-label="Tirar exceção"
                  onClick={() =>
                    setD({
                      ...d,
                      excecoes: d.excecoes.filter((y) => y.id !== x.id),
                    })
                  }
                >
                  <TrashIcon />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs">Nenhuma. Os setores decidem.</p>
          )}
        </div>
      )}
      {escritorio.carteiraLigada || d.carteira.length ? (
        <Campo rotulo="Carteira de clientes" ajuda="Com a carteira ligada, a pessoa vê só estes clientes.">
          {() => (
            <div className="flex flex-wrap gap-1.5">
              {clientes.map((c) => {
                const on = d.carteira.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setD({
                        ...d,
                        carteira: on ? d.carteira.filter((x) => x !== c.id) : [...d.carteira, c.id],
                      })
                    }
                    className={cn('cursor-pointer rounded-full border px-3 py-1 text-xs', on ? 'border-foreground/30 bg-raised font-medium' : 'text-muted-foreground')}
                  >
                    {c.nome}
                  </button>
                )
              })}
            </div>
          )}
        </Campo>
      ) : (
        <p className="text-muted-foreground text-xs">Carteira de clientes desligada no escritório: quem tem o setor vê todos os clientes.</p>
      )}
    </GavetaFormulario>
  )
}

/** "O que Fulano vê?" (03, 6.9): o escopo calculado, aba por aba, com a regra que decidiu. */
function OQueVe({ u, onFechar }: { u: UsuarioCfg; onFechar: () => void }) {
  const linhas = telasSistema.map((t) => {
    const ex = u.excecoes.find((x) => x.tela === t.id)
    if (ex)
      return {
        t,
        nivel: ex.efeito === 'bloquear' ? 'não vê' : ex.nivel!,
        regra: `exceção: ${ex.motivo}`,
      }
    const setor = t.id.split('.')[1]
    const map: Record<string, SetorIntegrante> = {
      societario: 'societario',
      fiscal: 'fiscal',
      dp: 'dp',
      contabil: 'contabil',
      gestao: 'gestao_atendimento',
      comunicados: 'gestao_atendimento',
      equipe: 'fiscal',
    }
    const v = u.vinculos.find((x) => x.setor === map[setor])
    if (t.id === 'timesheet.equipe')
      return {
        t,
        nivel: u.vinculos.some((x) => x.modo === 'gestao') ? 'ler' : 'não vê',
        regra: u.vinculos.some((x) => x.modo === 'gestao') ? 'gestão em algum setor' : 'só gestores',
      }
    if (t.id.startsWith('aba.financeiro'))
      return {
        t,
        nivel: 'não vê',
        regra: 'Financeiro do escritório: só Administrador e Gestor do setor',
      }
    return v
      ? {
          t,
          nivel: 'executar',
          regra: `setor ${nomeSetor(v.setor)} (${v.modo === 'gestao' ? 'gestão' : 'execução'})`,
        }
      : { t, nivel: 'não vê', regra: 'sem o setor' }
  })
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={`O que ${u.nome.split(' ')[0]} vê`}
      descricao="Calculado agora, pela mesma regra que o sistema usa em cada ação. Os integrantes dela nunca veem mais do que isto."
      acao="Fechar"
      onAcao={onFechar}
    >
      <ul className="divide-border/70 flex flex-col divide-y">
        {linhas.map((l) => (
          <li key={l.t.id} className="grid grid-cols-[1fr_auto] gap-x-3 py-2 text-sm">
            <span>{l.t.rotulo}</span>
            <Badge variant={l.nivel === 'não vê' ? 'outline' : l.nivel === 'executar' ? 'sucesso' : 'destaque'}>{l.nivel}</Badge>
            <span className="text-muted-foreground col-span-2 text-xs">{l.regra}</span>
          </li>
        ))}
      </ul>
    </GavetaFormulario>
  )
}
