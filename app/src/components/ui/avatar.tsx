import { Avatar as AvatarPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const tamanhos = { sm: 'size-6 text-[10px]', md: 'size-8 text-xs', lg: 'size-10 text-sm' }

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
}

/** Avatar de pessoa (usuário, colaborador, contato). Integrante do time usa <Orb>. */
export function Avatar({
  nome,
  foto,
  tamanho = 'md',
  className,
}: {
  nome: string
  foto?: string
  tamanho?: keyof typeof tamanhos
  className?: string
}) {
  return (
    <AvatarPrimitive.Root className={cn('relative flex shrink-0 overflow-hidden rounded-full', tamanhos[tamanho], className)}>
      {foto && <AvatarPrimitive.Image className="aspect-square size-full object-cover" src={foto} alt={nome} />}
      <AvatarPrimitive.Fallback className="bg-muted text-foreground flex size-full items-center justify-center font-medium">
        {iniciais(nome)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
