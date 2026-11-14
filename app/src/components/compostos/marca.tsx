import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import type { ModoCor, Tema } from '@/theme/tipos'

/*
 * A marca do sistema em dois desenhos:
 * - Heild: o wordmark HEILD (os mesmos traçados do <heild-logo> do design system).
 *   Fechado, só o HE; ao abrir, o I nasce como pílula entre as letras e o LD
 *   desliza para o lugar. Ao fechar, os dois recolhem de volta para o HE.
 * - Marca branca: a logo completa do escritório (ou logotipo e nome) aberta e o
 *   logotipo dele fechado, trocados sem animação.
 */

const HE = 'M54.5 163.805H231V14.3047H483.5V61.3047H285.5V163.305H459.5V210.805H285.5V324.805H489V371.805H231V210.805H54.5V371.805H0V14.3047H54.5V163.805Z'
const LD =
  'M834.187 324.805H963.888V14.3047H1099.39C1132.39 14.3047 1160.89 21.3047 1184.89 35.3047C1208.89 48.9714 1227.22 69.3047 1239.89 96.3047C1252.55 122.971 1258.89 155.305 1258.89 193.305C1258.89 231.305 1252.55 263.638 1239.89 290.305C1227.55 316.971 1209.55 337.305 1185.89 351.305C1162.22 364.971 1133.89 371.805 1100.89 371.805H779.687V14.3047H834.187V324.805ZM1018.39 324.805H1097.39C1123.72 324.805 1144.55 318.971 1159.89 307.305C1175.55 295.305 1186.39 279.638 1192.39 260.305C1198.72 240.971 1201.89 218.638 1201.89 193.305C1201.89 153.971 1194.05 122.138 1178.39 97.8047C1162.72 73.4714 1135.72 61.3047 1097.39 61.3047H1018.39V324.805Z'
/** Pílula do I (centro 634.344, 193.055; 147.297 × 386.111). */
const PILULA = { x: 634.344 - 147.297 / 2, y: 0, w: 147.297, h: 386.111 }
/** Largura do HE e do wordmark inteiro, nas unidades do viewBox (altura 387). */
const LARGURA_HE = 489
const LARGURA = 1259
const ALTURA = 387

export const ehHeild = (tema: Tema) => tema.marca === 'heild'

/** Logotipo e logo completa do modo atual: no escuro, as versões em negativo, se o tema tiver. */
export function logosDoModo(tema: Tema, modo: ModoCor) {
  const escuro = modo === 'escuro'
  return {
    logotipo: (escuro && tema.logotipo_ref_escuro) || tema.logotipo_ref,
    completa: (escuro && tema.logo_completa_ref_escuro) || tema.logo_completa_ref,
  }
}

/** O wordmark da Heild. `aberta` falso mostra só o HE; trocar anima HE ⇄ HEILD. */
export function MarcaHeild({ aberta = true, altura = 26, className }: { aberta?: boolean; altura?: number; className?: string }) {
  const k = altura / ALTURA
  return (
    <span
      role="img"
      aria-label="Heild"
      data-aberta={aberta}
      className={cn('marca-heild text-foreground block shrink-0 overflow-hidden', className)}
      style={{ height: altura, width: Math.ceil((aberta ? LARGURA : LARGURA_HE) * k) }}
    >
      <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} width={Math.ceil(LARGURA * k)} height={altura} aria-hidden className="block overflow-visible">
        <path d={HE} fill="currentColor" />
        <rect className="marca-i" x={PILULA.x} y={PILULA.y} width={PILULA.w} height={PILULA.h} rx={PILULA.w / 2} fill="currentColor" />
        <path className="marca-ld" d={LD} fill="currentColor" />
      </svg>
    </span>
  )
}

/** Logotipo da marca branca (imagem ou sigla) num quadrado de 44 px. */
function Logotipo({ tema, modo }: { tema: Tema; modo: ModoCor }) {
  const { logotipo } = logosDoModo(tema, modo)
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center">
      {logotipo ? (
        <img src={logotipo} alt={tema.nome_produto} className="max-h-9 w-auto max-w-11 object-contain" />
      ) : (
        <span className="text-foreground text-[26px] leading-none font-semibold tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }} aria-label={tema.nome_produto}>
          {tema.sigla}
        </span>
      )}
    </span>
  )
}

/**
 * A marca do sistema onde ela aparece (barra lateral, login, app do cliente,
 * documentos). `aberta` falso é a versão curta: o HE da Heild, o logotipo do escritório.
 */
export function Marca({ aberta = true, className }: { aberta?: boolean; className?: string }) {
  const { tema, modo } = useTema()
  const { completa } = logosDoModo(tema, modo)
  if (ehHeild(tema)) {
    // O HE fica centrado na coluna de 44 px da barra fechada; aberta, o wordmark segue dali.
    return (
      <span className={cn('flex h-11 shrink-0 items-center pl-[6px]', className)}>
        <MarcaHeild aberta={aberta} />
      </span>
    )
  }
  if (aberta && completa) {
    return (
      <span className={cn('flex h-11 shrink-0 items-center', className)}>
        <img src={completa} alt={tema.nome_produto} className="max-h-9 w-auto max-w-[200px] object-contain" />
      </span>
    )
  }
  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Logotipo tema={tema} modo={modo} />
      {aberta && <span className="truncate text-base font-medium tracking-tight whitespace-nowrap">{tema.nome_produto}</span>}
    </span>
  )
}
