import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

const meta: Meta<typeof Card> = { title: 'Primitivos/Cartão', component: Card }
export default meta

export const Padrao: StoryObj<typeof Card> = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Indicadores · Fiscal</CardTitle>
        <CardDescription>Novembro de 2026</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">atrasadas 3 · vencem hoje 2 · entregues 41/58</CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">Ver lista</Button>
      </CardFooter>
    </Card>
  ),
}
