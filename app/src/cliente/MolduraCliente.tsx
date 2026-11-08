import { ArrowSquareOutIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoja } from '@/ambiente/loja'
import { Button } from '@/components/ui/button'
import { ClienteApp } from './ClienteApp'

/**
 * Visão "App do cliente" do wireframe: o webapp instalável num aparelho, e ao
 * lado o que chega ao escritório (o mesmo registro de eventos da plataforma).
 */
export function MolduraCliente({ pessoa, onPessoa, onEscritorio }: { pessoa: string | null; onPessoa: (n: string | null) => void; onEscritorio: () => void }) {
  const loja = useLoja()
  const [instalar, setInstalar] = useState(false)
  const doApp = loja.estado.eventos.filter((e) => e.ator.includes('(cliente, app)')).slice(0, 8)
  return (
    <div className="bg-background flex min-h-svh flex-wrap items-center justify-center gap-8 px-4 py-8">
      <div className="relative h-[min(780px,calc(100svh-4rem))] bg-[#1d1b19] ring-1 ring-white/10 w-[min(390px,100%)] shrink-0 rounded-[48px] p-2.5 shadow-2xl">
        <div className="bg-background text-foreground relative h-full overflow-hidden rounded-[40px]">
          <div className="absolute top-2 left-1/2 z-40 h-6 w-28 bg-[#1d1b19] -translate-x-1/2 rounded-full" aria-hidden />
          <div className="h-full pt-7">
            <ClienteApp pessoa={pessoa} onEntrar={onPessoa} onSair={() => onPessoa(null)} />
          </div>
        </div>
      </div>
      <aside className="flex w-[min(22rem,100%)] flex-col gap-3">
        <div>
          <p className="text-lg font-light tracking-tight">App do cliente</p>
          <p className="text-muted-foreground text-sm">
            Web instalável (PWA): abre pelo link do convite e vira ícone na tela do celular. Usa os mesmos dados do escritório: o que a pessoa faz aqui chega na conversa do CRM, na tarefa e no sino de quem responde.
          </p>
        </div>
        <Button variant="outline" className="w-fit rounded-full" onClick={() => setInstalar(!instalar)}>
          <DownloadSimpleIcon /> Instalar no celular
        </Button>
        {instalar && <p className="bg-sunken rounded-[14px] px-3 py-2 text-sm">No celular: abrir app.contabilandrade.com.br, entrar com o código e tocar em “Adicionar à tela inicial”. Na demonstração, o app roda no aparelho ao lado.</p>}
        <section className="bg-surface shadow-cartao flex flex-col gap-2 rounded-[20px] p-4">
          <p className="text-sm font-medium">Chegou ao escritório</p>
          {doApp.length === 0 && <p className="text-muted-foreground text-sm">Nada ainda. Envie uma pendência, abra um pedido ou escreva na conversa.</p>}
          {doApp.map((e) => (
            <p key={e.id} className="text-sm">
              <span className="text-muted-foreground text-xs">{e.quando} · </span>
              {e.texto}
            </p>
          ))}
          <Button size="sm" className="w-fit rounded-full" onClick={onEscritorio}>
            <ArrowSquareOutIcon /> Ver no painel do escritório
          </Button>
        </section>
      </aside>
    </div>
  )
}
