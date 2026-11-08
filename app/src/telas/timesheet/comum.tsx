import { CurrencyCircleDollarIcon, DownloadSimpleIcon, FileTextIcon, GearSixIcon, GlobeIcon, PlugsConnectedIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { useLoja } from '@/ambiente/loja'
import { Button } from '@/components/ui/button'
import { Segmentado } from '@/components/ui/formulario'
import type { PacoteTs } from '@/dados/timesheet'
import { ItemMenu, Menu, RotuloMenu } from '@/components/ui/menu'
import { ConectarCore, ConfiguracoesModulo, CustoHora, Dominios, Exportar, TermoCiencia } from './configuracao'

export { Caixa, Numero } from '@/components/compostos/blocos'

/**
 * Cabeçalho de cada aba do Timesheet: título, contexto e as ações de topo:
 * exportar para todos; o menu de configuração para Gestor e Administrador.
 */
export function CabecalhoTs({ titulo, sub, papel, children }: { titulo: string; sub: string; papel: 'colaborador' | 'gestor' | 'admin'; children?: ReactNode }) {
  const [aberto, setAberto] = useState<'exportar' | 'config' | 'core' | 'custo' | 'dominios' | 'termo' | null>(null)
  return (
    <header className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{titulo}</h1>
        <p className="text-muted-foreground text-sm">{sub}</p>
      </div>
      {children}
      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setAberto('exportar')}>
        <DownloadSimpleIcon /> Exportar
      </Button>
      {papel !== 'colaborador' && (
        <Menu
          align="end"
          gatilho={
            <Button size="sm" variant="outline" className="rounded-full">
              <GearSixIcon /> Configurar
            </Button>
          }
        >
          <RotuloMenu>Timesheet do escritório</RotuloMenu>
          <ItemMenu icone={<GearSixIcon />} detalhe="inatividade, itens por dia, jornada" onClick={() => setAberto('config')} desabilitado={papel !== 'admin'}>
            Configurações do módulo
          </ItemMenu>
          <ItemMenu icone={<PlugsConnectedIcon />} detalhe="Alterdata, Domínio, Questor, Contmatic" onClick={() => setAberto('core')}>
            Conectar sistema contábil
          </ItemMenu>
          <ItemMenu icone={<CurrencyCircleDollarIcon />} detalhe="gastos do mês ÷ horas produtivas" onClick={() => setAberto('custo')} desabilitado={papel !== 'admin'}>
            Custo-hora do escritório
          </ItemMenu>
          <ItemMenu icone={<GlobeIcon />} detalhe="o que a extensão lê e onde" onClick={() => setAberto('dominios')}>
            Portais da extensão
          </ItemMenu>
          <ItemMenu icone={<FileTextIcon />} detalhe="o texto que cada pessoa aceita" onClick={() => setAberto('termo')}>
            Termo de ciência
          </ItemMenu>
        </Menu>
      )}
      {aberto === 'exportar' && <Exportar gestor={papel !== 'colaborador'} onFechar={() => setAberto(null)} />}
      {aberto === 'config' && <ConfiguracoesModulo onFechar={() => setAberto(null)} />}
      {aberto === 'core' && <ConectarCore onFechar={() => setAberto(null)} onConectar={() => setAberto(null)} />}
      {aberto === 'custo' && <CustoHora onFechar={() => setAberto(null)} onSalvar={() => setAberto(null)} />}
      {aberto === 'dominios' && <Dominios admin={papel === 'admin'} onFechar={() => setAberto(null)} />}
      {aberto === 'termo' && <TermoCiencia onFechar={() => setAberto(null)} onAceitar={() => setAberto(null)} />}
    </header>
  )
}

/**
 * Filtro de pacote (decisão de 8/11/2026): com o BPO ligado, as telas do
 * Timesheet separam horas, custo e margem por pacote sem trocar o custo-hora
 * do escritório. No escritório só de BPO não aparece (tudo é BPO).
 */
export function usePacote() {
  const loja = useLoja()
  const [pacote, setPacote] = useState<PacoteTs>('todos')
  const ativo = loja.estado.bpoModulo && loja.estado.cenario !== 'bpo_puro'
  const chip = ativo ? (
    <Segmentado
      rotulo="Pacote"
      valor={pacote}
      onMudar={setPacote}
      opcoes={[
        { valor: 'todos', rotulo: 'Todos' },
        { valor: 'contabil', rotulo: 'Contábil' },
        { valor: 'bpo', rotulo: 'BPO' },
      ]}
    />
  ) : null
  return { pacote: ativo ? pacote : ('todos' as PacoteTs), chip }
}
