import { Tabs as TabsPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

/**
 * Duas aparências: `pilula` (abas principais, em cima e centralizadas, como no
 * design do usuário) e `linha` (abas internas de um módulo).
 */
export function TabsList({
  className,
  aparencia = 'pilula',
  ...props
}: ComponentProps<typeof TabsPrimitive.List> & { aparencia?: 'pilula' | 'linha' }) {
  return (
    <TabsPrimitive.List
      data-aparencia={aparencia}
      className={cn(
        'group/tabs inline-flex items-center',
        aparencia === 'pilula' && 'bg-muted text-muted-foreground gap-1 rounded-full p-1',
        aparencia === 'linha' && 'text-muted-foreground gap-4 border-b',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        'group-data-[aparencia=pilula]/tabs:h-8 group-data-[aparencia=pilula]/tabs:rounded-full group-data-[aparencia=pilula]/tabs:px-4',
        'group-data-[aparencia=pilula]/tabs:hover:text-foreground',
        'group-data-[aparencia=pilula]/tabs:data-[state=active]:bg-background group-data-[aparencia=pilula]/tabs:data-[state=active]:text-foreground group-data-[aparencia=pilula]/tabs:data-[state=active]:shadow-sm',
        'group-data-[aparencia=linha]/tabs:-mb-px group-data-[aparencia=linha]/tabs:border-b-2 group-data-[aparencia=linha]/tabs:border-transparent group-data-[aparencia=linha]/tabs:py-2',
        'group-data-[aparencia=linha]/tabs:hover:text-foreground',
        'group-data-[aparencia=linha]/tabs:data-[state=active]:border-primary group-data-[aparencia=linha]/tabs:data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('outline-none', className)} {...props} />
}
