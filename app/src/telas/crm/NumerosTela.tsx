import { ChatTextIcon, CheckCircleIcon, ClockIcon, EnvelopeSimpleIcon, GearSixIcon, LightningIcon, PencilSimpleIcon, PlusIcon, RobotIcon, SealCheckIcon, TagIcon, TimerIcon, WarningIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState, type ReactNode } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { canaisSetor, empresaMeta, rotuloSetor, type CanalSetor } from '@/dados/crm'
import { cn } from '@/lib/utils'
import type { SetorIntegrante } from '@/theme/tipos'
import { Horario, MensagensAutomaticas, Sla } from './config/Atendimento'
import { Etiquetas, RespostasRapidas } from './config/Listas'
import { Modelos } from './config/Modelos'
import { ConectarNumero, DetalhesNumero, LigarExperimental } from './config/Numero'

type Secao = 'modelos' | 'automaticas' | 'horario' | 'sla' | 'etiquetas' | 'respostas'

const secoes: [Secao, string, ReactNode][] = [
  ['modelos', 'Modelos', <ChatTextIcon key="m" />],
  ['automaticas', 'Mensagens automáticas', <RobotIcon key="a" />],
  ['horario', 'Horário', <ClockIcon key="h" />],
  ['sla', 'Prazos de resposta', <TimerIcon key="s" />],
  ['etiquetas', 'Etiquetas', <TagIcon key="e" />],
  ['respostas', 'Respostas rápidas', <LightningIcon key="r" />],
]

/**
 * CRM › Configuração dos números (04, 3.2): um número de WhatsApp por setor
 * com equipe (o do Gestão e Atendimento é o principal), a caixa de e-mail de
 * cada um, a saúde da conexão e os cadastros do atendimento. Tudo se cadastra
 * e edita na gaveta de formulário. Só o Administrador muda.
 */
export function NumerosTela() {
  const [canais, setCanais] = usePersistente('crm.canais', canaisSetor)
  const [secao, setSecao] = useState<Secao>('modelos')
  const [conectar, setConectar] = useState<{ setor?: SetorIntegrante } | null>(null)
  const [detalhe, setDetalhe] = useState<CanalSetor | null>(null)
  const [experimental, setExperimental] = useState(false)
  const livres = canais.filter((c) => !c.numero).map((c) => c.setor)
  const comNumero = canais.filter((c) => c.numero)

  return (
    <AreaRolagem className="h-full px-3 pb-8 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pt-1 ultra:max-w-[1600px]">
        <header className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Configuração dos números</h1>
            <p className="text-muted-foreground text-sm">Só o Administrador muda. Conexão oficial com o WhatsApp (coexistência): o número continua no app do celular.</p>
          </div>
          {livres.length > 0 && (
            <Button size="sm" className="rounded-full" onClick={() => setConectar({})}>
              <PlusIcon /> Conectar número
            </Button>
          )}
        </header>

        <div className="bg-surface shadow-cartao flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[20px] px-4 py-3 text-sm">
          <span className="flex items-center gap-2">
            <SealCheckIcon weight="fill" className="text-success size-5" /> Empresa verificada na Meta
          </span>
          <span>
            Limite atual: <strong className="font-medium">{empresaMeta.limite}</strong>
          </span>
          <span>
            Qualidade: <strong className="font-medium">{empresaMeta.qualidade}</strong>
          </span>
          <span className="text-muted-foreground text-xs">próximo degrau: {empresaMeta.proximoLimite}</span>
        </div>

        <section className="bg-surface shadow-cartao overflow-hidden rounded-[24px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="px-4 py-2.5 font-medium">Setor</th>
                  <th className="px-2 py-2.5 font-medium">WhatsApp</th>
                  <th className="px-2 py-2.5 font-medium">Conexão</th>
                  <th className="px-2 py-2.5 font-medium">Saúde</th>
                  <th className="px-2 py-2.5 font-medium">E-mail</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-border/70 divide-y">
                {canais.map((c) => (
                  <tr key={c.setor} className={cn(c.status === 'atencao' && 'bg-warning/5')}>
                    <td className="px-4 py-3 font-medium">{rotuloSetor[c.setor]}</td>
                    <td className="px-2 py-3">
                      {c.numero ? (
                        <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums">
                          <WhatsappLogoIcon className="text-muted-foreground size-4" /> {c.numero}
                          {c.principal && <Badge variant="outline">principal</Badge>}
                          {c.experimental && <Badge variant="erro">experimental</Badge>}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">usa o principal</span>
                      )}
                    </td>
                    <td className="text-muted-foreground px-2 py-3">{c.conexao ?? '·'}</td>
                    <td className="px-2 py-3">
                      {c.status === 'sem número' ? (
                        <span className="text-muted-foreground">·</span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {c.status === 'ativo' ? <CheckCircleIcon weight="fill" className="text-success size-4 shrink-0" /> : <WarningIcon weight="fill" className="text-warning size-4 shrink-0" />}
                          {c.statusTexto}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      {c.email ? (
                        <span className="flex items-center gap-1.5">
                          <EnvelopeSimpleIcon className="text-muted-foreground size-4" /> {c.email}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">·</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.numero ? (
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setDetalhe(c)}>
                          <GearSixIcon /> Detalhes
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => setConectar({ setor: c.setor })}>
                          <PlusIcon /> Número
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Cadastros do atendimento">
            {secoes.map(([id, r, ic]) => (
              <Button key={id} role="tab" aria-selected={secao === id} size="sm" variant={secao === id ? 'secondary' : 'ghost'} className="shrink-0 rounded-full" onClick={() => setSecao(id)}>
                {ic} {r}
              </Button>
            ))}
          </div>
          <div className="bg-surface shadow-cartao rounded-[24px] p-4 sm:p-5">
            {secao === 'modelos' && <Modelos />}
            {secao === 'automaticas' && <MensagensAutomaticas />}
            {secao === 'horario' && <Horario />}
            {secao === 'sla' && <Sla />}
            {secao === 'etiquetas' && <Etiquetas />}
            {secao === 'respostas' && <RespostasRapidas />}
          </div>
        </section>

        <section className="border-warning/40 flex flex-col gap-2 rounded-[24px] border border-dashed p-4 text-sm">
          <h2 className="flex items-center gap-2 font-medium">
            <WarningIcon className="text-warning size-4" /> Modo experimental (não oficial)
          </h2>
          <p className="text-muted-foreground">
            Por número, só com aviso aceito por escrito: risco de banimento sem aviso e sem opt-in auditável. Nunca envia fora da janela de 24 h nem comunicado. A migração para a conexão oficial é um clique e mantém o histórico.
          </p>
          <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setExperimental(true)}>
            <PencilSimpleIcon /> Ligar em um número
          </Button>
        </section>
      </div>

      {conectar && (
        <ConectarNumero
          setorInicial={conectar.setor}
          setoresLivres={livres}
          onFechar={() => setConectar(null)}
          onConectar={(c) => {
            setCanais((xs) => xs.map((x) => (x.setor === c.setor ? c : x)))
            setConectar(null)
          }}
        />
      )}
      {detalhe && (
        <DetalhesNumero
          key={detalhe.setor}
          canal={detalhe}
          onFechar={() => setDetalhe(null)}
          onSalvar={(c) => {
            setCanais((xs) => xs.map((x) => (x.setor === c.setor ? c : c.principal ? { ...x, principal: false } : x)))
            setDetalhe(null)
          }}
        />
      )}
      {experimental && (
        <LigarExperimental
          numeros={comNumero}
          onFechar={() => setExperimental(false)}
          onLigar={(s) => {
            setCanais((xs) => xs.map((x) => (x.setor === s ? { ...x, experimental: true, conexao: 'não oficial (experimental)' } : x)))
            setExperimental(false)
          }}
        />
      )}
    </AreaRolagem>
  )
}
