import { contabilDe, dpDe, fiscalDe, type CampoPerfil } from './painel'
import { notasDe, societarioDe } from './painel-abas'
import { fichas } from '@/ambiente/clientes'

/** O que muda de um cliente para outro no cabeçalho das abas do Painel. */
const fixos: Record<string, { uf: string; municipio: string; sindicato: string; dataBase: string; ponto: string; natureza: string; contas: string }> = {
  c2: { uf: 'SP', municipio: 'São Paulo', sindicato: 'Padeiros de SP', dataBase: 'maio', ponto: 'cartão', natureza: 'Microempresa (LTDA)', contas: '1 (Bradesco)' },
  c3: { uf: 'SP', municipio: 'São Paulo', sindicato: 'Comerciários de SP', dataBase: 'setembro', ponto: 'app', natureza: 'EIRELI', contas: '1 (Itaú)' },
  c4: { uf: 'SP', municipio: 'São Paulo', sindicato: 'Saúde de SP', dataBase: 'março', ponto: 'em implantação', natureza: 'Sociedade limitada', contas: '2 (Itaú, Santander)' },
  c5: { uf: 'RS', municipio: 'Porto Alegre', sindicato: 'Rodoviários do RS', dataBase: 'maio', ponto: 'REP-A', natureza: 'Sociedade anônima', contas: '4 (BB, Banrisul, Itaú, Sicredi)' },
  c6: { uf: 'SP', municipio: 'São Paulo', sindicato: '—', dataBase: '—', ponto: '—', natureza: 'Pessoa física', contas: '—' },
  c7: { uf: 'SP', municipio: 'São Paulo', sindicato: 'Hotelaria e gastronomia SP', dataBase: 'julho', ponto: 'cartão', natureza: 'Microempresa (LTDA)', contas: '1 (Sicoob)' },
}

/** Troca, no perfil de exemplo da aba, os campos que dependem do cliente selecionado. */
export function perfilDoCliente(perfil: CampoPerfil[], clienteId: string, regime: string): CampoPerfil[] {
  if (clienteId === 'c1') return perfil.map((c) => (c.rotulo === 'Regime' ? { ...c, valor: regime } : c))
  const f = fixos[clienteId]
  const fis = fiscalDe(clienteId)
  const dp = dpDe(clienteId)
  const soc = societarioDe(clienteId)
  const ctb = contabilDe(clienteId)
  const nfe = notasDe(clienteId)
  const cert = soc.certificados[0]
  const socios = fichas[clienteId]?.contatos.filter((x) => x.papel.startsWith('sóci') || x.papel === 'titular').length ?? 0
  const debito = fis.situacao.find((x) => x.mudou)
  const valor: Record<string, CampoPerfil | undefined> = {
    Regime: { rotulo: 'Regime', valor: regime },
    UF: { rotulo: 'UF', valor: `${f.uf}${f.natureza === 'Pessoa física' ? '' : ' · IE ativa'}` },
    'Inscrição municipal': { rotulo: 'Inscrição municipal', valor: f.municipio },
    'Situação fiscal': debito ? { rotulo: 'Situação fiscal', valor: debito.atual, alerta: true } : { rotulo: 'Situação fiscal', valor: 'regular' },
    'Empregados ativos': { rotulo: 'Empregados ativos', valor: String(dp.quadro.ativos) },
    Sindicato: { rotulo: 'Sindicato', valor: f.sindicato },
    'Data-base': { rotulo: 'Data-base', valor: f.dataBase },
    Ponto: { rotulo: 'Ponto', valor: dp.quadro.ponto },
    Natureza: { rotulo: 'Natureza', valor: f.natureza },
    Sócios: { rotulo: 'Sócios', valor: String(socios) },
    'Certificado A1': cert ? { rotulo: 'Certificado', valor: `${cert.tipo} · vence em ${cert.dias} dias`, alerta: cert.dias < 30 } : { rotulo: 'Certificado', valor: 'não tem' },
    'Contas bancárias': { rotulo: 'Contas bancárias', valor: f.contas },
    Etapa: { rotulo: 'Etapa', valor: ctb.etapas.find((e) => e.situacao !== 'feito')?.rotulo.toLowerCase() ?? 'fechado' },
    'Fora do padrão': { rotulo: 'Fora do padrão', valor: String(ctb.linhas.filter((l) => l.confianca < 0.7).length) },
    Captura: { rotulo: 'Captura', valor: nfe.captura.find((x) => x.item === 'Última captura')?.valor ?? 'sem captura' },
    'XMLs 10/2026': { rotulo: 'XMLs 10/2026', valor: String(nfe.fluxos.reduce((s, x) => s + x.qtd, 0)) },
    Divergências: { rotulo: 'Divergências', valor: String(nfe.tributaria.length) },
    NSU: undefined,
  }
  return perfil.flatMap((c) => (c.rotulo in valor ? (valor[c.rotulo] ? [valor[c.rotulo]!] : []) : [c]))
}
