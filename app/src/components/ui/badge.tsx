import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium [&_svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        destaque: 'border-transparent bg-warning/15 text-foreground [&_svg]:text-warning',
        sucesso: 'border-transparent bg-success/15 text-foreground [&_svg]:text-success',
        erro: 'border-transparent bg-destructive/15 text-destructive',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
)

export function Badge({ className, variant, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

/** Bolinha de contagem (abas, sino). Zero não mostra nada (subplano 03, 2.3). */
export function Contador({ valor, className }: { valor: number; className?: string }) {
  if (!valor) return null
  return (
    <span
      className={cn(
        'bg-destructive text-destructive-foreground inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold tabular-nums',
        className,
      )}
    >
      {valor > 99 ? '99+' : valor}
    </span>
  )
}
