import { DesktopIcon, DeviceMobileIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Campo, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { escritorio } from '@/dados/configuracoes'
import { useLoja } from './loja'
import { papelExibido, useSessao } from './sessao'

/**
 * Minha conta (qualquer papel): como os avisos chegam, silêncio pessoal,
 * senha, segundo fator e sessões abertas. O que é do escritório (inatividade,
 * segundo fator obrigatório) aparece travado, com o motivo.
 */
export function MinhaConta({ onFechar }: { onFechar: () => void }) {
  const { usuario, permissoes } = useSessao()
  const loja = useLoja()
  const obrigatorio = escritorio.segundoFator === 'todos' || (escritorio.segundoFator === 'administradores' && usuario.papel === 'administrador')
  const [fator, setFator] = useState(usuario.segundoFator || obrigatorio)
  const [resumo, setResumo] = useState(true)
  const [urgenteWhats, setUrgenteWhats] = useState(usuario.papel !== 'colaborador')
  const [silencio, setSilencio] = useState<'escritorio' | 'proprio'>('escritorio')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const senhaFraca = senhaNova.length > 0 && senhaNova.length < 10
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Minha conta"
      descricao={`${usuario.nome} · ${papelExibido(usuario)} · ${permissoes.resumo}`}
      acao="Salvar"
      acaoDesabilitada={senhaFraca || (senhaNova.length > 0 && !senhaAtual)}
      onAcao={() => {
        loja.toast(senhaNova ? 'Preferências e senha atualizadas. As outras sessões foram encerradas.' : 'Preferências salvas.')
        onFechar()
      }}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">E-mail de acesso</span>
        <span className="bg-sunken/60 rounded-[12px] px-3 py-2.5 text-sm">{usuario.email}</span>
        <span className="text-muted-foreground text-xs">Só o Administrador muda (Configurações › Usuários).</span>
      </div>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Avisos</h3>
        <Interruptor ligado onMudar={() => {}} desabilitado rotulo="No sino do sistema" detalhe="Sempre ligado: é onde tudo fica guardado." />
        <Interruptor ligado={resumo} onMudar={setResumo} rotulo={`Resumo diário por e-mail às ${escritorio.resumoHora}`} detalhe="O que não foi urgente, numa mensagem só." />
        <Interruptor ligado={urgenteWhats} onMudar={setUrgenteWhats} rotulo="Urgente no meu WhatsApp" detalhe="Prazo do dia, cliente insatisfeito, cartão expirando." />
        <Campo rotulo="Silêncio">
          {() => (
            <Segmentado
              rotulo="Silêncio"
              valor={silencio}
              onMudar={setSilencio}
              opcoes={[
                { valor: 'escritorio', rotulo: `O do escritório (${escritorio.silencio.de}–${escritorio.silencio.ate})` },
                { valor: 'proprio', rotulo: 'Meu próprio horário' },
              ]}
            />
          )}
        </Campo>
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Segurança</h3>
        <Interruptor ligado={fator} onMudar={setFator} desabilitado={obrigatorio} rotulo="Segundo fator no login" detalhe={obrigatorio ? 'Obrigatório para administradores neste escritório.' : 'App autenticador; recomendado.'} />
        <Campo rotulo="Senha atual">{(id) => <CampoTexto id={id} tipo="password" valor={senhaAtual} onMudar={setSenhaAtual} />}</Campo>
        <Campo rotulo="Nova senha" erro={senhaFraca ? 'Use 10 caracteres ou mais.' : undefined}>
          {(id) => <CampoTexto id={id} tipo="password" valor={senhaNova} onMudar={setSenhaNova} />}
        </Campo>
      </section>
      <section className="flex flex-col gap-2 text-sm">
        <h3 className="font-medium">Sessões abertas</h3>
        <p className="flex items-center gap-2">
          <DesktopIcon className="size-4" /> Este computador · agora
        </p>
        <p className="text-muted-foreground flex items-center gap-2">
          <DeviceMobileIcon className="size-4" /> Celular · ontem 21:40
        </p>
        <Button type="button" size="sm" variant="outline" className="w-fit rounded-full" onClick={() => loja.toast('Sessão do celular encerrada.')}>
          Encerrar as outras sessões
        </Button>
      </section>
    </GavetaFormulario>
  )
}
