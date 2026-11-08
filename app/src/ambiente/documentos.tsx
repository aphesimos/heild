import { createContext, useContext, useState, type ReactNode } from 'react'
import { VisualizadorDocumento } from '@/components/compostos/visualizador-documento'
import { chaveNome, pastaPeloTipo, tipoPeloNome, type Documento, type OrigemDocumento } from '@/dados/arquivos'
import * as exemplo from '@/dados/exemplo'
import type { SetorIntegrante } from '@/theme/tipos'
import { useFluxos } from './fluxos'
import { useLoja, useNavegacao } from './loja'
import { useSessao } from './sessao'

export interface ContextoMencao {
  clienteId?: string
  clienteNome?: string
  setor?: SetorIntegrante
  /** Se o documento ainda não está no índice, de onde ele veio. */
  origem?: OrigemDocumento
  por?: string
}

interface ApiDocumentos {
  /** Abre o documento citado pelo nome (cartão, anexo, lista); se não estiver no índice, entra nele. */
  abrir: (nome: string, ctx?: ContextoMencao) => void
  abrirDoc: (d: Documento) => void
  /** Acha (ou registra) o documento citado, sem abrir. */
  resolver: (nome: string, ctx?: ContextoMencao) => Documento
}

const Ctx = createContext<ApiDocumentos | null>(null)

/**
 * Toda menção a um documento abre o mesmo arquivo, no visualizador com a marca
 * do escritório, e a pasta dele leva ao módulo Arquivos.
 */
export function DocumentosProvider({ children }: { children: ReactNode }) {
  const loja = useLoja()
  const nav = useNavegacao()
  const fluxos = useFluxos()
  const { usuario, permissoes } = useSessao()
  const [abertoId, setAbertoId] = useState<string | null>(null)
  const [recemCriado, setRecemCriado] = useState<Documento | null>(null)

  const resolver = (nome: string, ctx: ContextoMencao = {}) => {
    const clienteId = ctx.clienteId ?? exemplo.clientes.find((c) => c.nome === ctx.clienteNome)?.id
    const chave = chaveNome(nome)
    const candidatos = loja.documentos.filter((d) => chaveNome(d.nome) === chave)
    const achado = candidatos.find((d) => !clienteId || d.clienteId === clienteId) ?? (clienteId ? undefined : candidatos[0])
    if (achado) return achado
    const tipo = tipoPeloNome(nome)
    return loja.adicionarDocumento({
      nome: /\.\w{2,4}$/.test(nome) ? nome : `${nome}.pdf`,
      clienteId,
      pasta: pastaPeloTipo(tipo),
      tipo,
      origem: ctx.origem ?? 'conversa',
      conector: 'a1',
      tamanho: '140 KB',
      quando: 'hoje',
      por: ctx.por ?? usuario.nome,
    })
  }

  const api: ApiDocumentos = {
    resolver,
    abrir: (nome, ctx) => {
      const d = resolver(nome, ctx)
      setRecemCriado(d)
      setAbertoId(d.id)
    },
    abrirDoc: (d) => {
      setRecemCriado(d)
      setAbertoId(d.id)
    },
  }

  const aberto = abertoId ? (loja.documentos.find((d) => d.id === abertoId) ?? (recemCriado?.id === abertoId ? recemCriado : null)) : null
  const cliente = exemplo.clientes.find((c) => c.id === aberto?.clienteId)
  const podeForcar = usuario.papel !== 'colaborador'

  return (
    <Ctx.Provider value={api}>
      {children}
      {aberto && (
        <VisualizadorDocumento
          d={aberto}
          onFechar={() => setAbertoId(null)}
          acoes={{
            onBaixar: () => {
              loja.registrar(usuario.nome, `Baixou ${aberto.nome}${cliente ? ` (${cliente.nome})` : ''}`)
              loja.toast(`${aberto.nome} baixado.`)
            },
            onEnviar: cliente
              ? () => {
                  setAbertoId(null)
                  fluxos.enviar({ cliente: cliente.nome, setor: permissoes.setores[0] ?? 'fiscal', texto: '', anexo: aberto.nome, assunto: aberto.nome.replace(/\.\w+$/, '') })
                }
              : undefined,
            onAbrirPasta: (caminho) => {
              setAbertoId(null)
              nav.irPara({ modulo: 'arquivos', aba: 'pastas', pasta: { clienteId: aberto.clienteId, caminho } })
            },
            onForcarVisivel: podeForcar
              ? (v) => {
                  loja.ajustarDocumento(aberto.id, { forcarVisivel: v })
                  loja.registrar(usuario.nome, `${v === undefined ? 'Voltou à visibilidade da pasta' : v ? 'Mostrou ao cliente' : 'Ocultou do cliente'}: ${aberto.nome}`)
                }
              : undefined,
            onCopiarLink: () => loja.toast('Link interno copiado: abre este documento para quem tem acesso ao cliente.'),
          }}
        />
      )}
    </Ctx.Provider>
  )
}

const nada: ApiDocumentos = { abrir: () => {}, abrirDoc: () => {}, resolver: (nome) => ({ id: 'x', nome, pasta: [], tipo: 'outro', origem: 'conversa', conector: 'a1', tamanho: '', quando: '', por: '', versao: 1, hash: '' }) }
export const useDocumentos = () => useContext(Ctx) ?? nada
