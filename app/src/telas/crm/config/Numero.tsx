import { CheckCircleIcon, CheckIcon, DeviceMobileIcon, ShieldWarningIcon, SpinnerIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import { BotaoFeito } from '@/ambiente/interface'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor } from '@/components/ui/formulario'
import { rotuloSetor, type CanalSetor } from '@/dados/crm'
import { cn } from '@/lib/utils'
import type { SetorIntegrante } from '@/theme/tipos'

const passos = ['Setor', 'Conectar com a Meta', 'Coexistência', 'Como aparece', 'Pronto'] as const

/**
 * Conectar um número a um setor (04, 3.2): Embedded Signup da Meta com
 * coexistência (o número continua no app do celular). No lab, a janela da Meta
 * é simulada; em produção ela abre por cima e devolve o número verificado.
 */
export function ConectarNumero({ setorInicial, setoresLivres, onFechar, onConectar }: { setorInicial?: SetorIntegrante; setoresLivres: SetorIntegrante[]; onFechar: () => void; onConectar: (c: CanalSetor) => void }) {
  const [passo, setPasso] = useState(0)
  const [setor, setSetor] = useState<SetorIntegrante>(setorInicial ?? setoresLivres[0])
  const [conectando, setConectando] = useState(false)
  const [numero, setNumero] = useState('')
  const [coexistencia, setCoexistencia] = useState(true)
  const [nomeExibido, setNomeExibido] = useState(`Contábil · ${rotuloSetor[setorInicial ?? setoresLivres[0]]}`)
  const [email, setEmail] = useState(`${(setorInicial ?? setoresLivres[0]) === 'contabil' ? 'contabil' : (setorInicial ?? setoresLivres[0])}@`)

  const abrirMeta = () => {
    setConectando(true)
    setTimeout(() => {
      setNumero('+55 11 93000-0004')
      setConectando(false)
    }, 1600)
  }

  const podeAvancar = [true, !!numero, true, nomeExibido.trim().length > 2, true][passo]
  const ultimo = passo === passos.length - 1

  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Conectar número"
      descricao="Conexão oficial com o WhatsApp. Só o Administrador conecta."
      acao={ultimo ? 'Concluir' : 'Continuar'}
      acaoDesabilitada={!podeAvancar}
      onAcao={() => {
        if (!ultimo) return setPasso((p) => p + 1)
        onConectar({ setor, numero, conexao: coexistencia ? 'Cloud API · coexistência' : 'Cloud API', status: 'ativo', statusTexto: 'conectado agora · qualidade a medir', email: email.length > 1 ? email : undefined })
      }}
      secundaria={
        passo > 0 && !ultimo ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      <ol className="flex gap-1.5" aria-label="Passos">
        {passos.map((p, i) => (
          <li key={p} className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={cn('h-1.5 rounded-full', i < passo ? 'bg-success' : i === passo ? 'bg-foreground' : 'bg-sunken')} />
            <span className={cn('truncate text-[11px]', i === passo ? 'font-medium' : 'text-muted-foreground')}>{p}</span>
          </li>
        ))}
      </ol>

      {passo === 0 && (
        <Campo rotulo="Para qual setor" ajuda="Hoje esse setor usa o número principal. Com número próprio, os clientes falam direto com ele; transferir para ele passa a trocar de número.">
          {(id) => (
            <CampoEscolha
              id={id}
              valor={setor}
              onMudar={(v) => {
                setSetor(v)
                setNomeExibido(`Contábil · ${rotuloSetor[v]}`)
              }}
              opcoes={setoresLivres.map((s) => ({ valor: s, rotulo: rotuloSetor[s]! }))}
            />
          )}
        </Campo>
      )}

      {passo === 1 && (
        <div className="flex flex-col gap-3 text-sm">
          <p>Abre a janela da Meta. Lá você entra com a conta do Facebook da empresa, escolhe o portfólio verificado e confirma o número com o código por SMS.</p>
          {numero ? (
            <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5">
              <CheckCircleIcon weight="fill" className="text-success size-5" /> Número verificado: <strong className="font-medium tabular-nums">{numero}</strong>
            </p>
          ) : (
            <Button type="button" className="w-fit rounded-full" onClick={abrirMeta} disabled={conectando}>
              {conectando ? <SpinnerIcon className="animate-spin" /> : <WhatsappLogoIcon />} {conectando ? 'Aguardando a Meta…' : 'Abrir conexão da Meta'}
            </Button>
          )}
        </div>
      )}

      {passo === 2 && (
        <div className="flex flex-col gap-4 text-sm">
          <Interruptor
            ligado={coexistencia}
            onMudar={setCoexistencia}
            rotulo="Manter o número no app do celular (coexistência)"
            detalhe="A equipe pode seguir usando o WhatsApp Business no celular; tudo aparece também no CRM. A Meta pede abrir o app a cada 14 dias: o sistema avisa antes."
          />
          <p className="bg-sunken flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-xs">
            <DeviceMobileIcon className="mt-0.5 size-4 shrink-0" />
            {coexistencia ? 'O histórico dos últimos 6 meses do app entra no CRM. Grupos não são sincronizados.' : 'Sem coexistência o número sai do app do celular e passa a existir só no CRM.'}
          </p>
        </div>
      )}

      {passo === 3 && (
        <>
          <Campo rotulo="Nome exibido no WhatsApp" ajuda="A Meta revisa o nome; precisa ter relação com o escritório.">
            {(id) => <CampoTexto id={id} valor={nomeExibido} onMudar={setNomeExibido} />}
          </Campo>
          <Campo rotulo="Caixa de e-mail do setor (opcional)" ajuda="Conversas por e-mail deste setor entram na mesma caixa.">
            {(id) => <CampoTexto id={id} valor={email} onMudar={setEmail} placeholder="contabil@" />}
          </Campo>
          <p className="text-muted-foreground text-xs">Foto, horário e mensagens automáticas seguem o padrão do escritório e podem ser trocados nos detalhes do número.</p>
        </>
      )}

      {passo === 4 && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <CheckIcon weight="bold" className="text-success size-5" /> {rotuloSetor[setor]} com número próprio
          </p>
          <ul className="text-muted-foreground list-disc pl-5 text-xs">
            <li>
              {numero} · {coexistencia ? 'coexistência ligada' : 'só no CRM'}
            </li>
            <li>Nome exibido: {nomeExibido} (em revisão pela Meta)</li>
            <li>Conversas abertas do {rotuloSetor[setor]} no número principal continuam lá até resolver; as novas chegam no número novo.</li>
            <li>Os modelos aprovados passam a valer também neste número.</li>
          </ul>
        </div>
      )}
    </GavetaFormulario>
  )
}

/** Detalhes de um número conectado: nome exibido, mensagem automática, saúde, migrar. */
export function DetalhesNumero({ canal, onFechar, onSalvar }: { canal: CanalSetor; onFechar: () => void; onSalvar: (c: CanalSetor) => void }) {
  const [c, setC] = useState(canal)
  const [nome, setNome] = useState(`Contábil · ${rotuloSetor[canal.setor]}`)
  const [automatica, setAutomatica] = useState(true)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={`${rotuloSetor[c.setor]} · ${c.numero}`} descricao={c.conexao} acao="Salvar" onAcao={() => onSalvar(c)}>
      <div className={cn('flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm', c.status === 'atencao' ? 'bg-warning/10' : 'bg-success/10')}>
        {c.status === 'atencao' ? <ShieldWarningIcon className="text-warning mt-0.5 size-4 shrink-0" /> : <CheckCircleIcon weight="fill" className="text-success mt-0.5 size-4 shrink-0" />}
        <span>{c.statusTexto}</span>
      </div>
      <Campo rotulo="Nome exibido">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} />}</Campo>
      <Campo rotulo="Caixa de e-mail">{(id) => <CampoTexto id={id} valor={c.email ?? ''} onMudar={(v) => setC({ ...c, email: v || undefined })} />}</Campo>
      <Interruptor ligado={!!c.principal} onMudar={(v) => setC({ ...c, principal: v })} rotulo="Número principal" detalhe="Recebe leads e o site; setores sem número usam este. Só um número é principal." desabilitado={c.principal} />
      <Interruptor ligado={automatica} onMudar={setAutomatica} rotulo="Mensagens automáticas neste número" detalhe="Espera, fora do horário, feriado e transferência (textos em Mensagens automáticas)." />
      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setC({ ...c, status: 'ativo', statusTexto: 'verificado agora · qualidade alta' })}>
          Verificar saúde
        </Button>
        <BotaoFeito type="button" size="sm" variant="ghost" className="rounded-full" texto="Migração de provedor pedida: o número segue ativo durante a troca e o passo a passo chega por e-mail.">
          Migrar de provedor
        </BotaoFeito>
      </div>
    </GavetaFormulario>
  )
}

/** Ligar o modo não oficial num número: só com o aviso aceito por escrito (04, 3.5). */
export function LigarExperimental({ numeros, onFechar, onLigar }: { numeros: CanalSetor[]; onFechar: () => void; onLigar: (setor: SetorIntegrante) => void }) {
  const [setor, setSetor] = useState<SetorIntegrante>(numeros[0]?.setor)
  const [texto, setTexto] = useState('')
  const ok = texto.trim().toUpperCase() === 'ENTENDO OS RISCOS'
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Ligar modo experimental"
      descricao="Conexão não oficial (via app). Existe para testar antes de pagar a Meta, não como padrão."
      acao="Ligar neste número"
      acaoDesabilitada={!ok || !setor}
      onAcao={() => onLigar(setor)}
    >
      <ul className="bg-destructive/8 flex list-disc flex-col gap-1 rounded-[14px] py-3 pr-3 pl-7 text-sm">
        <li>O número pode ser banido pela Meta sem aviso.</li>
        <li>Viola os termos do WhatsApp; não há opt-in auditável.</li>
        <li>Nunca envia fora da janela de 24 h nem comunicado.</li>
        <li>Aparece como “experimental” em todas as listas. O histórico fica no CRM e a migração para a conexão oficial é um clique.</li>
      </ul>
      <Campo rotulo="Número">{(id) => <CampoEscolha id={id} valor={setor} onMudar={setSetor} opcoes={numeros.map((n) => ({ valor: n.setor, rotulo: `${rotuloSetor[n.setor]} · ${n.numero}` }))} />}</Campo>
      <Campo rotulo='Para confirmar, escreva "ENTENDO OS RISCOS"' ajuda="O aceite fica registrado com seu nome, data e hora.">
        {(id) => <CampoTexto id={id} valor={texto} onMudar={setTexto} />}
      </Campo>
    </GavetaFormulario>
  )
}
