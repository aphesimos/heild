import type { Decorator, Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import { temas } from '../src/theme/temas'
import type { ModoCor } from '../src/theme/tipos'
import '../src/index.css'

/** Troca de tema do escritório e de modo claro/escuro pela barra do Storybook. */
const comTema: Decorator = (Story, ctx) => {
  const tema = temas.find((t) => t.id === ctx.globals.tema) ?? temas[0]
  const modo = (ctx.globals.modo as ModoCor) ?? 'claro'
  return (
    <ThemeProvider tema={tema} modo={modo}>
      <Story />
    </ThemeProvider>
  )
}

const preview: Preview = {
  decorators: [comTema],
  globalTypes: {
    tema: {
      description: 'Tema do escritório (marca branca)',
      toolbar: {
        title: 'Tema',
        icon: 'paintbrush',
        items: temas.map((t) => ({ value: t.id, title: t.nome_produto })),
        dynamicTitle: true,
      },
    },
    modo: {
      description: 'Claro ou escuro',
      toolbar: {
        title: 'Modo',
        icon: 'mirror',
        items: [
          { value: 'claro', title: 'Claro', icon: 'sun' },
          { value: 'escuro', title: 'Escuro', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { tema: temas[0].id, modo: 'claro' },
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color|cor)$/i, date: /Date$/i } },
    options: {
      storySort: { order: ['Introdução', 'Tokens', 'Primitivos', 'Compostos', 'Telas'] },
    },
    a11y: { test: 'todo' },
  },
}

export default preview
