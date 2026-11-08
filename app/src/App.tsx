import { useState } from 'react'
import { LojaProvider } from '@/ambiente/loja'
import { PainelLab, type Visao } from '@/ambiente/PainelLab'
import { SessaoProvider, useSessaoBruta } from '@/ambiente/sessao'
import { LoginTela } from '@/telas/LoginTela'
import { Plataforma } from '@/telas/Plataforma'
import { MolduraCliente } from '@/cliente/MolduraCliente'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { temas } from '@/theme/temas'
import type { ModoCor } from '@/theme/tipos'

/**
 * `npm run app` e a página publicada: o escritório de demonstração inteiro.
 * Começa no login; cada conta vê o sistema com as próprias permissões.
 */
export default function App() {
  const [temaId, setTemaId] = useState(temas[0].id)
  const [modo, setModo] = useState<ModoCor>(() => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'))
  const [visao, setVisao] = useState<Visao>('escritorio')
  const [pessoaApp, setPessoaApp] = useState<string | null>(null)
  const [geracao, setGeracao] = useState(0)
  /** Volta o ambiente inteiro à configuração original: dados, conta, app, tema e preferências guardadas. */
  const reiniciarTudo = () => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith('ui-lab:'))
        .forEach((k) => window.localStorage.removeItem(k))
    } catch {
      /* sem armazenamento */
    }
    setVisao('escritorio')
    setPessoaApp(null)
    setTemaId(temas[0].id)
    setGeracao((g) => g + 1)
  }
  const tema = temas.find((t) => t.id === temaId) ?? temas[0]

  return (
    <ThemeProvider tema={tema} modo={modo}>
      <SessaoProvider key={geracao}>
        <LojaProvider>
          {visao === 'escritorio' ? <Escritorio onAlternarModo={() => setModo((m) => (m === 'claro' ? 'escuro' : 'claro'))} /> : <MolduraCliente pessoa={pessoaApp} onPessoa={setPessoaApp} onEscritorio={() => setVisao('escritorio')} />}
          <PainelLab temaId={temaId} onTema={setTemaId} modo={modo} onModo={setModo} visao={visao} onVisao={setVisao} pessoaApp={pessoaApp} onPessoaApp={setPessoaApp} onReiniciar={reiniciarTudo} />
        </LojaProvider>
      </SessaoProvider>
    </ThemeProvider>
  )
}

function Escritorio({ onAlternarModo }: { onAlternarModo: () => void }) {
  const sessao = useSessaoBruta()!
  if (!sessao.usuario) return <LoginTela onEntrar={sessao.entrar} />
  return <Plataforma key={sessao.usuario.id} clienteInicial={null} onAlternarModo={onAlternarModo} />
}
