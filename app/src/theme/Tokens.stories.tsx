import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTema } from './ThemeProvider'
import { tokensDoModo } from './variaveis'

function Amostra({ nome, classe, texto }: { nome: string; classe: string; texto?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 rounded-lg border ${classe}`} />
      <div className="text-xs">
        <div className="font-medium">{nome}</div>
        {texto && <div className="text-muted-foreground">{texto}</div>}
      </div>
    </div>
  )
}

function PaginaTokens() {
  const { tema, modo } = useTema()
  const t = tokensDoModo(tema, modo)
  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">{tema.nome_produto}</h1>
        <p className="text-muted-foreground text-sm">
          Tokens do tema em modo {modo}. Troque o tema e o modo na barra do Storybook.
        </p>
      </header>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Amostra nome="primária" classe="bg-primary" texto={t.primaria} />
        <Amostra nome="fundo" classe="bg-background" texto={t.fundo} />
        <Amostra nome="texto" classe="bg-foreground" texto={t.texto} />
        <Amostra nome="destaque" classe="bg-highlight" texto={t.destaque} />
        <Amostra nome="erro" classe="bg-destructive" texto={t.erro} />
        <Amostra nome="sucesso" classe="bg-success" texto={t.sucesso} />
        <Amostra nome="atenção" classe="bg-warning" texto={t.atencao ?? 'padrão âmbar'} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Camadas</h2>
        <p className="text-muted-foreground text-sm">De baixo para cima. Todo o sistema usa só estas: mudar uma no tema muda todas as telas.</p>
        <div className="from-background to-background-end flex flex-col gap-3 rounded-[24px] bg-gradient-to-b p-4">
          <span className="text-muted-foreground text-xs">fundo · bg-background → bg-background-end</span>
          <div className="from-sunken to-sunken-end rounded-[20px] bg-gradient-to-b p-4">
            <span className="text-muted-foreground text-xs">rebaixada · bg-sunken (trilho das abas, busca, coluna) · {t.rebaixada ?? 'derivada'}</span>
          </div>
          <div className="bg-surface flex flex-col gap-3 rounded-[20px] p-4 shadow-contorno">
            <span className="text-muted-foreground text-xs">superfície · bg-surface (painéis, widgets, área do chat) · {t.superficie ?? 'derivada'}</span>
            <div className="bg-raised rounded-[16px] p-4 shadow-sm">
              <span className="text-muted-foreground text-xs">elevada · bg-raised / bg-card (cartões, campo do chat, aba ativa) · {t.elevada ?? 'derivada'}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Tipografia</h2>
        <p className="text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Título · {t.fonte_titulo.split(',')[0]}
        </p>
        <p>Texto corrido · {t.fonte_texto.split(',')[0]}. O PGDAS-D de outubro está pronto.</p>
        <p className="text-muted-foreground text-sm">Texto suave, para metadados e ajuda.</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Raio · {t.raio_borda}</h2>
        <div className="flex gap-4">
          {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map((r) => (
            <div key={r} className={`bg-muted size-16 border ${r}`} title={r} />
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta = {
  title: 'Tokens/Tema',
  component: PaginaTokens,
}
export default meta

export const Paleta: StoryObj = {}
