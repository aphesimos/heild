import { Dialog as SheetPrimitive } from 'radix-ui'
import { XIcon } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Gaveta lateral (ex.: gaveta do chat, subplano 03, 2.5). */
export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close

export function SheetContent({
  className,
  children,
  lado = 'direita',
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & { lado?: 'direita' | 'esquerda' }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
      <SheetPrimitive.Content
        className={cn(
          'bg-popover text-popover-foreground fixed inset-y-0 z-50 flex w-full flex-col gap-4 border-l shadow-lg sm:max-w-md',
          lado === 'direita' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="text-muted-foreground hover:text-foreground absolute top-4 right-4 cursor-pointer rounded-sm">
          <XIcon className="size-4" />
          <span className="sr-only">Fechar</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1 border-b p-4 pr-10', className)} {...props} />
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn('font-semibold', className)} {...props} />
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn('text-muted-foreground text-sm', className)} {...props} />
}
