import { ArrowsClockwiseIcon, BankIcon, DownloadSimpleIcon, GavelIcon, GearSixIcon, ListBulletsIcon, ReceiptIcon, ScalesIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { useNavegacao } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { integrantes } from '@/dados/exemplo'
import { useAparencia } from '@/hooks/useAparencia'
import { ItemMenu, Menu, RotuloMenu } from '@/components/ui/menu'
import { Alcadas, ConectarConta, ConectarProvedor, ConfigNfse, ExportarFin, ImportarFinanceiro, PlanoContas, PoliticaInadimplencia } from './configuracao'

export { Caixa, Numero, Propriedade, TituloBloco } from '@/components/compostos/blocos'

/** Real sem centavos (totais) ou com centavos (faturas). */
export const brl = (v: number, centavos = false) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: centavos ? 2 : 0, maximumFractionDigits: centavos ? 2 : 0 })
/** Milhares compactos para eixos: R$ 198 mil. */
export const mil = (v: number) => `R$ ${Math.round(v / 1000).toLocaleString('pt-BR')} mil`

/**
 * Cabeçalho das abas do Financeiro: título, contexto, ações da aba e o menu de
 * configuração do módulo (só Administrador e Gestor com o setor chegam aqui).
 */
export function CabecalhoFin({ titulo, sub, status, children }: { titulo: string; sub: string; /** O que o integrante Financeiro está fazendo nesta aba. */ status?: string; children?: ReactNode }) {
  const [aberto, setAberto] = useState<'provedor' | 'nfse' | 'politica' | 'conta' | 'plano' | 'alcadas' | 'importar' | 'exportar' | null>(null)
  const nav = useNavegacao()
  const aparencia = useAparencia()
  const fin = integrantes.find((i) => i.setor === 'financeiro_escritorio')
  // Quem lê o Financeiro por exceção (sem o setor) não tem o integrante no próprio Time.
  const { usuario, permissoes } = useSessao()
  const temIntegrante = usuario.papel === 'administrador' || permissoes.setores.includes('financeiro_escritorio')
  const t = fin ? aparencia(fin) : undefined
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{titulo}</h1>
        <p className="text-muted-foreground text-sm">{sub}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {children}
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setAberto('exportar')}>
            <DownloadSimpleIcon /> Exportar
          </Button>
          <Menu
            align="end"
            gatilho={
              <Button size="sm" variant="outline" className="rounded-full">
                <GearSixIcon /> Configurar
              </Button>
            }
          >
            <RotuloMenu>Receber</RotuloMenu>
            <ItemMenu icone={<ArrowsClockwiseIcon />} detalhe="Banco Inter · boleto, Pix, Pix Automático" onClick={() => setAberto('provedor')}>
              Provedor de cobrança
            </ItemMenu>
            <ItemMenu icone={<ReceiptIcon />} detalhe="Emissor Nacional · com a cobrança" onClick={() => setAberto('nfse')}>
              NFS-e do escritório
            </ItemMenu>
            <ItemMenu icone={<GavelIcon />} detalhe="juros, acordo, suspensão" onClick={() => setAberto('politica')}>
              Política de inadimplência
            </ItemMenu>
            <RotuloMenu>Pagar e conciliar</RotuloMenu>
            <ItemMenu icone={<BankIcon />} detalhe="Open Finance, só leitura" onClick={() => setAberto('conta')}>
              Conectar conta
            </ItemMenu>
            <ItemMenu icone={<ListBulletsIcon />} detalhe="categorias da conciliação e da DRE" onClick={() => setAberto('plano')}>
              Plano de contas
            </ItemMenu>
            <ItemMenu icone={<ScalesIcon />} detalhe="quem aprova cada conta" onClick={() => setAberto('alcadas')}>
              Alçadas de aprovação
            </ItemMenu>
            <RotuloMenu>Implantação</RotuloMenu>
            <ItemMenu icone={<UploadSimpleIcon />} detalhe="Conexa, Omie, Conta Azul, Nibo, planilha" onClick={() => setAberto('importar')}>
              Trazer o financeiro atual
            </ItemMenu>
          </Menu>
        </div>
      </div>
      {/* O integrante do setor, como nas abas do Painel: o que está fazendo aqui e "Falar". */}
      {fin && t && (
        <div className="bg-surface shadow-cartao flex min-h-19 w-full items-center gap-3 rounded-[20px] p-3 lg:w-80">
          <Orb cor={t.cor} corOlhos={t.corOlhos} estado={fin.estado} tamanho={40} animado modo="wander" cutucavel={false} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{t.nome}</div>
            <p className="text-muted-foreground line-clamp-2 text-xs">{status ?? fin.resumo}</p>
          </div>
          {temIntegrante && (
            <Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={() => nav.irPara({ modulo: 'inicio', aba: 'time', integrante: fin.id })}>
              Falar
            </Button>
          )}
        </div>
      )}
      {aberto === 'provedor' && <ConectarProvedor troca onFechar={() => setAberto(null)} />}
      {aberto === 'nfse' && <ConfigNfse onFechar={() => setAberto(null)} />}
      {aberto === 'politica' && <PoliticaInadimplencia onFechar={() => setAberto(null)} />}
      {aberto === 'conta' && <ConectarConta onFechar={() => setAberto(null)} onConectar={() => setAberto(null)} />}
      {aberto === 'plano' && <PlanoContas onFechar={() => setAberto(null)} />}
      {aberto === 'alcadas' && <Alcadas onFechar={() => setAberto(null)} />}
      {aberto === 'importar' && <ImportarFinanceiro onFechar={() => setAberto(null)} />}
      {aberto === 'exportar' && <ExportarFin onFechar={() => setAberto(null)} />}
    </header>
  )
}
