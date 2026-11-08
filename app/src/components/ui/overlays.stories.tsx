import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoIcon } from '@phosphor-icons/react'
import { Button } from './button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet'
import { Tooltip } from './tooltip'

const meta: Meta = { title: 'Primitivos/Sobreposições' }
export default meta

export const Modal: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cobrar pendências</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar Padaria Pão Quente</DialogTitle>
          <DialogDescription>Envia a mensagem da régua pelo WhatsApp do Contábil. Não dá para desfazer.</DialogDescription>
        </DialogHeader>
        <p className="bg-muted rounded-md p-3 text-sm">
          Olá! Ainda falta a folha de ponto de outubro para fecharmos a competência. Pode enviar pelo app?
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Enviar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Gaveta: StoryObj = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir gaveta</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat · Geral</SheetTitle>
          <SheetDescription>contexto: Metalúrgica Andrade</SheetDescription>
        </SheetHeader>
        <div className="text-muted-foreground p-4 text-sm">Conteúdo da gaveta.</div>
      </SheetContent>
    </Sheet>
  ),
}

export const Dica: StoryObj = {
  render: () => (
    <Tooltip conteudo="Prazo legal 20/11 · interno 18/11">
      <Button variant="ghost" size="icon" aria-label="Prazo">
        <InfoIcon />
      </Button>
    </Tooltip>
  ),
}

export const Balao: StoryObj = {
  name: 'Popover',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtros</Button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">Responsável, status e competência.</PopoverContent>
    </Popover>
  ),
}
