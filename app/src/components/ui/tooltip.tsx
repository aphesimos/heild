import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider

export function TooltipContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn('bg-foreground text-background z-50 rounded-md px-2.5 py-1.5 text-xs', className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

/** Atalho: <Tooltip conteudo="...">gatilho</Tooltip>. */
export function Tooltip({
  conteudo,
  children,
  lado,
}: {
  conteudo: ReactNode
  children: ReactNode
  lado?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent side={lado}>{conteudo}</TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
