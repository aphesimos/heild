# UI lab

> **Neste repositório:** o branch `prototipo` guarda o sistema wireframe interativo
> (as telas, a loja de dados de exemplo, os fluxos e os integrantes). O site mora no
> branch `site`, que nasce deste e acrescenta `src/site/`. A marca (cores, fontes,
> logo) é decidida no branch `design-system` e trazida para `src/theme/`.

Laboratório de componentes da plataforma do escritório: cada componente isolado
e as telas montadas, com dados de exemplo fictícios, no **Storybook**.

## Como rodar

```bash
cd app
npm install
npm run dev          # Storybook em http://localhost:6006
npm run app          # a plataforma montada, fora do Storybook (Vite)
npm run typecheck    # TypeScript
npm run build-storybook
npm run site         # o site e as landing pages (Vite, site.html)
npm run build:site   # build estático do site
```

No Storybook, a barra de cima tem dois seletores: **Tema** (o escritório, marca
branca) e **Modo** (claro ou escuro). Toda story responde aos dois. No `npm run
app`, o modo fica no botão da barra e o tema num seletor no canto inferior esquerdo.

## Stack e por quê

| Peça | Escolha | Razão |
| --- | --- | --- |
| Base | Vite + React 19 + TypeScript | Sugerido; React 19 passa props para Web Components direto, o que simplifica o `<orb-avatar>`. |
| Estilo | Tailwind CSS 4 com tokens em variáveis CSS | O tema do escritório vira variáveis em `<html>`; o Tailwind só as expõe como classes. Nenhuma cor fixa nos componentes. |
| Primitivos | **Radix** (sem estilo), no formato do shadcn/ui, em `src/components/ui` | Radix cuida de foco, teclado e leitores de tela; a aparência é toda nossa, desenhada a partir do Figma e lida dos tokens. Ver "Kit de componentes" abaixo. |
| Animação | **Motion** (`motion/react`) | Pílula que desliza nas abas e no módulo ativo da barra lateral; base para as microinterações. |
| Fonte | **PP Neue Montreal** (v2.700): a versão normal nos títulos e a **Text** (desenhada para tamanhos pequenos) no texto corrido | Quatro arquivos variáveis em `src/assets/fontes/pp-neue-montreal`: romano e itálico de cada versão, cada um com todos os pesos (100–900 e 200–700). Os originais traziam o itálico como eixo no mesmo arquivo, mas o Chrome não liga esse eixo sozinho, então foram separados com a fontTools; a página só baixa o itálico quando algum texto pede. Dos 23 arquivos recebidos, as estáticas eram redundantes e a PP Frama não é usada no design (ficam no histórico, commit `dc34098`). Para conferir arquivos de fonte: `scripts/inspecionar_fontes.py <pasta>`. |
| Laboratório | Storybook 10 (addons docs e a11y) | Uma story por componente e por tela; a aba Accessibility aponta contraste e rótulos. |
| Ícones | **Phosphor** (`@phosphor-icons/react`) | Desenho mais refinado e seis pesos. Nos módulos: duotone quando inativo, preenchido quando ativo. Substituiu o lucide em todo o lab. O `components.json` do shadcn ainda diz `lucide`: componente novo vindo do CLI precisa trocar o ícone. |
| Orb | `<orb-avatar>` de [sundenlast/orb](https://github.com/sundenlast/orb), versão 1.1 (canvas, regulador de qualidade automático), copiado em `src/vendor/orb-avatar` (commit `23077a3`) | A instalação por `npm install github:sundenlast/orb` foi bloqueada no ambiente em que o lab foi montado; a tarefa previa copiar o arquivo. Para trocar pelo pacote: `npm install github:sundenlast/orb` e mudar o import em `src/components/ui/orb.tsx` para `import 'orb-avatar'`. |

O init do Storybook traz Vitest, Playwright e Chromatic; foram retirados para
manter o lab leve. Dá para voltar com `npx storybook add @storybook/addon-vitest`.

## Kit de componentes

O ar "genérico" que se associa ao shadcn/ui vem do tema padrão dele (cinza, borda fina,
raio médio), não da base. Aqui a base é o **Radix sem estilo** e o visual vem do Figma:
degradê quente, pílulas, raios grandes, grotesca leve, orbs. Trocar de kit não mudaria
a cara; o que muda a cara é o design, e ele já é próprio.

Alternativas avaliadas, caso se queira trocar a camada de primitivos:

| Opção | O que é | Quando valeria |
| --- | --- | --- |
| **React Aria Components** (Adobe) | Primitivos sem estilo com a melhor acessibilidade e internacionalização do mercado (datas, números, pt-BR) | Se calendário, seleção de datas e tabelas complexas ficarem centrais. É a troca que eu faria se fosse trocar. |
| **Base UI** (time do MUI e ex-Radix) | Primitivos sem estilo, sucessor espiritual do Radix | Se o Radix parar de evoluir. |
| **HeroUI**, **Mantine** | Kits completos, já estilizados | Pouco indicados aqui: o estilo deles brigaria com o Figma e com a marca branca. |
| **Magic UI**, **Aceternity** | Blocos animados para sites | Para uma página de apresentação, não para o painel. |

Decisão no lab: mantém Radix + estilo próprio + Motion; a troca para React Aria fica
anotada para quando o calendário e as tabelas forem desenhados.

## Tema de marca branca

```
Tema (src/theme/temas.ts)                       subplano 01, seção 10
  └─ tokens: primaria, fundo, texto, destaque, erro, sucesso,
             fonte_titulo, fonte_texto, raio_borda  (+ modo_escuro)
        │
        ▼  ThemeProvider → variaveisCss()      src/theme/variaveis.ts
  variáveis CSS em <html>: --primary, --background, --foreground, --highlight,
  --destructive, --success, --card, --muted, --border, --radius, --font-*
        │
        ▼  @theme inline                       src/index.css
  classes Tailwind: bg-primary, text-muted-foreground, border-border, rounded-lg...
```

- Os componentes só usam essas classes. Trocar de escritório é trocar o objeto `Tema`.
- Superfície, borda e texto suave **derivam** de `fundo` e `texto` (com `color-mix`), porque a lista mínima das Fundações não os tem. O tema pode fixá-los se quiser (`superficie`, `borda`, `texto_suave`).
- O texto sobre a cor primária é calculado pelo contraste (claro ou escuro), a menos que o tema diga `texto_sobre_primaria`.
- Os nomes das variáveis seguem os do shadcn/ui, para que `npx shadcn add <componente>` funcione sem adaptação (há um `components.json`).
- **Nomes e cores dos integrantes vêm do tema** (`integrantes_padrao`: setor → `{nome, avatar}`). No lab o avatar é a cor do orb; em produção, `avatar_ref`.
- **Camadas** (todas as telas usam só estas; trocar uma no tema troca o sistema inteiro):

  | Camada | Token do tema | Classe | Onde |
  | --- | --- | --- | --- |
  | fundo | `fundo` → `fundo_fim` | `bg-background` → `bg-background-end` | página (degradê) |
  | rebaixada | `rebaixada` → `rebaixada_fim` | `bg-sunken` | trilho das abas, busca, coluna de integrantes, bolha do usuário, trilho de barras |
  | superfície | `superficie` | `bg-surface` | painéis grandes: área do chat, widgets, blocos |
  | elevada | `elevada` | `bg-raised` (= `bg-card`) | cartões, campo do chat, aba ativa, menus |
  | barra lateral | `lateral` → `lateral_fim` | `bg-sidebar` | barra dos módulos |

  Sem os opcionais, cada camada deriva de `fundo` e `texto`. Proibido no código das telas: transparência solta de cor (`bg-card/45`, `bg-foreground/12`) e sombra escrita à mão; use a camada e a sombra nomeada.
- **Escala de areia** (tema de fábrica, `areia` em `src/theme/temas.ts`): um matiz só (OKLCH h 63), de 50 a 950, que passa exatamente pelas duas cores do Figma (300 = `#d9d2cc`, 650 = `#696665`). Todas as cores neutras do claro e do escuro saem dela; a tabela de qual camada usa qual passo está no comentário do tema. Para outro escritório, basta gerar outra escala no matiz da marca e apontar as mesmas camadas.
- **Atenção** (`atencao` → `--warning`, classe `text-warning`/`bg-warning`): cor de estado para falta, urgente, perto do limite e pede decisão, separada do destaque da marca (no tema Contábil o destaque é azul). Âmbar por padrão.
- **Sombras** nomeadas, na tinta do tema (`--shadow-ink`: o texto no claro, preto no escuro): `shadow-contorno`, `shadow-cartao`, `shadow-painel`, `shadow-campo`, `shadow-pilula`, `inset-shadow-trilho`, e as padrão `shadow-sm` a `shadow-2xl` redefinidas.
- Avatar do integrante pode ter cor própria no escuro (`cor_escuro`), porque o orb preto do Assistente sumiria no fundo escuro.
- Três temas de exemplo: **tema de fábrica = o visual do Figma** (FG `#696665`, degradê de branco a `#d9d2cc`, coluna de `#c0c0c0` a `#96928f`, o Geral se chama "Assistente" e tem orb preto), Horizonte Contábil e Verde Campo Assessoria (este renomeia o DP para "Pessoal", para provar que o nome vem do tema).

## Estrutura das telas (do Figma)

```
┌────┬──────────────────────────────────────────────────────────────┐
│ ▣  │        [ Assistente | Time ● | Visão geral ]     🔔  420 - Cliente ⌄ │
│ ⌂  │                                                              │
│ ▦  │                No que posso ajudar?  (orb)                   │
│ 💬 │                sugestões · avisos do time em uma linha        │
│ ⏱  │                                                              │
│ $  │        ┌────────────────────────────────────────┐  ◌         │
│────│        │ +  ⚙                         🎤  (voz) │  ?         │
│ 👤 │        └────────────────────────────────────────┘            │
│ ⚙  │                                                              │
└────┴──────────────────────────────────────────────────────────────┘
```

- **Barra lateral**: logotipo solto no topo, sem moldura (do sistema por padrão; do escritório na marca branca; sem logotipo, a sigla do tema), módulos com ícones soltos de 26px (sem círculo; o ativo fica preenchido, com um traço na borda) (Início, Painel, CRM, Arquivos, Timesheet, Financeiro, BPO), divisória, conta (menu com modo claro/escuro) e Configurações no pé. **Abre e fecha com animação**: fechada mostra só os ícones (nome no tooltip); aberta mostra os nomes. Botão "Recolher/Expandir" no pé e atalho Ctrl+B (Cmd+B).
- **Cabeçalho**: abas internas do módulo como controle segmentado, centralizado; sino e cliente (código - nome) à direita.
- **Início**: Assistente (chat Geral) · Time (painel com coluna de integrantes e chat) · Visão geral (widgets).
- **Demais módulos**: as mesmas abas segmentadas em cima, os lugares da aba, o bloco de tarefas e a gaveta do chat.

## Responsividade

Testado em 3440×1440 e 2560×1080 (21:9), 1920×1200 e 1440×900 (16:10), 1366×768,
1280×1024 (5:4), 1024×768, 800×600 e 390×844 (celular), sem rolagem horizontal da página.

| Largura | Barra lateral | Cabeçalho | Telas |
| --- | --- | --- | --- |
| ≥ 1800px (ultrawide) | aberta empurra o conteúdo; a escolha fica lembrada | uma linha | Visão geral em três colunas; chat até 56rem |
| 1280 a 1799px | igual | uma linha | Visão geral em duas colunas |
| 768 a 1279px | fechada ocupa 76px; aberta passa por cima, com véu, e fecha ao navegar | uma linha, nomes do cliente encurtados | coluna do Time mais estreita |
| < 768px | escondida; abre como gaveta pelo botão de menu | duas linhas: menu, sino e código do cliente; abas embaixo, rolando | Time vira faixa de orbs em cima do chat; calendário rola na horizontal |

Altura: abaixo de 760px (variante `baixa:`) o Início encolhe o título, mostra menos
sugestões e só o primeiro aviso; indicadores e cabeçalho ficam mais baixos. Em
monitores com 2400px de largura e 1300px de altura ou mais, a base de fonte sobe
12,5% (tudo em rem), para a interface não ficar miúda.

Variantes próprias em `src/index.css`: `baixa:` (max-height 760px) e `ultra:` (min-width 1800px).

## Árvore de componentes

```
tokens  (src/theme)
  Tema, ThemeProvider, useTema, variaveisCss          story: Tokens/Tema

primitivos  (src/components/ui)
  Button, Input/Textarea/Label, Badge/Contador, Card, Tabs, Dialog, Sheet,
  Tooltip, Popover, Avatar, List, Separator           Primitivos/*
  Orb ............... <orb-avatar> tipado; estado → reação  Primitivos/Orb

compostos  (src/components/compostos)
  BarraLateral ...... módulos em círculos, conta, configurações   Compostos/Estrutura
  AbasSegmentadas ... abas internas com pílula deslizante
  CabecalhoModulo ... abas no centro, sino e cliente à direita
  SeletorCliente .... "420 - Nome", busca por código/nome/CNPJ, "Todos"  Compostos/Seletor de cliente
  CampoChat ......... texto; anexar; ditar (pt-BR) e enviar        Compostos/Chat
  BolhaChat, CartaoAprovacao, CartaoEncaminhamento, CartaoTabela, CartaoChat
  ListaIntegrantes .. variantes "coluna" (Figma), "completa", "ícones"  Compostos/Integrantes
  CabecalhoIntegrante (fila, pendentes, limite, menu), FilaIntegrante   Compostos/Time
  NovoIntegrante .... descrever → proposta → revisar → ativar
  CartaoDocumento, CartaoConversaCrm, CartaoPassagem; aviso embutido no chat
  AvisoIntegrante ... fiz / decisão / informação + sim/editar/não   Compostos/Aviso do integrante
  AvisoCompacto ..... aviso em uma linha (abaixo do chat)          Compostos/Widgets
  Indicadores, Medidor, CalendarioSemana, PendenciasClientes, LinhaDoTempo, Widget
  BlocoTarefas, CartaoTarefa                                        Compostos/Tarefas
  BotoesDecisao

painel  (src/components/compostos/painel-aba.tsx)
  CabecalhoAba, PendenciasAba, DocumentosAba, AcoesAba, RelatoriosAba,
  BlocoAba, MedidorSublimite, Selo, Contagem, Confianca  Compostos/Painel (anatomia da aba)

telas  (src/telas)
  Plataforma ........ tudo montado, navegação funcionando           Telas/Plataforma
  Moldura ........... fundo, barra lateral, cabeçalho
  AssistenteTela, TimeTela (normal, vazio, pausado, limite atingido), VisaoGeralTela, ModuloTela   Telas/Time
  PainelTela ........ anatomia A–G por aba; Fiscal desenhada        Telas/Painel
  ListaMensagens, useConversa (respostas simuladas, sem modelo)
```

`src/dados` tem os tipos de tela e os dados de exemplo (clientes, CNPJs e pessoas
fictícios; textos tirados dos exemplos dos subplanos 02 e 03).

## Regra dos orbs

**Orb do Assistente (o integrante mestre): sempre o contraste direto do tema.** O corpo usa a
cor do texto e os olhos a cor do fundo; no claro, corpo escuro e olhos claros; no escuro, o
inverso. A cor é calculada do tema em qualquer escritório (marca branca); nunca é escolhida à
mão. Os outros integrantes têm cor própria, igual em todos os temas.

| Onde | Comportamento |
| --- | --- |
| Assistente, "No que posso ajudar?" | segue o cursor; reage ao clique; **modo alive** (orb-avatar 1.3): sozinho, faz gracinhas de vez em quando e cochila se ninguém interage |
| Título do chat do integrante aberto | segue o cursor; reage ao clique |
| Chat do integrante ainda vazio (orb grande, ativo ou em espera) | segue o cursor; **modo alive**; o integrante em espera começa cochilando e acorda com o cursor perto |
| Qualquer outro lugar | sem modo alive (só onde o orb é grande e tem espaço) |
| Ritmo das gracinhas | o sorteio da biblioteca fica desligado; cada próxima sai entre 20 e 40 s, sem padrão, só em idle, acordado e com a aba visível; cochila depois de 3 min sem interação |
| Espelho do chat aberto (`EspelhoOrbs`) | o orb do chat aberto repassa o que faz para as cópias do mesmo integrante: o grande (chat vazio) → cabeçalho e lista lateral (gracinhas, cochilo, acordar, cutucadas); o do cabeçalho → o grande (quando existe) e a lista lateral (cutucadas). Chat fechado ou outro integrante aberto: as cópias ficam como estavam, sem reagir |
| Integrantes nas listas dos chats (coluna do Time, faixa no celular, gaveta) | animados, vagando, com partículas; sem reação ao clique (o clique abre o chat) |
| Ao lado de cada mensagem | 100% parado |
| Resposta sendo preparada | o orb da mensagem pensa (vagando, partículas); quando a resposta chega fica feliz por 1,8 s, assenta (0,9 s) e congela na mesma pose, sem corte (`OrbMensagem`) |
| Avisos, tarefas, aba "Time", widgets, sino, CRM | **animados, vagando (drift), sem seguir o cursor, sempre que o orb está fora do estado padrão ou quando o grupo em que aparece (`GrupoOrbs`: lista de avisos, "Time agora") tem algum orb divergente**, e aí todo o grupo anima, inclusive os que estão no padrão. Parados só quando todos estão no padrão |

`<Orb>` decide sozinho: animado em drift fora do padrão ou num `GrupoOrbs` divergente; parado quando ele e o grupo estão no padrão. `animado={false}` força parado (orb de mensagem antiga) e `animado` força animado. A resposta nasce como mensagem
"pendente" no instante do envio, e o mesmo orb segue até o fim: é isso que deixa
a transição contínua.

Desempenho (CPU limitada a 1/6, 1920×1080), com os orbs 1.1 em canvas: as três
telas do Início a 60 quadros por segundo; no Time, script dos orbs em 0,6 s a cada
4 s (era 2,35 s na 1.0 em SVG, e a tela rodava a 14 quadros antes de tirar o
`backdrop-blur`). Como o orb agora desenha em canvas, cores como `var(--highlight)`
são resolvidas pelo componente só quando o atributo muda; o `<Orb>` reaplica as
cores ao trocar de tema ou de modo.

## Estados do integrante → reação do orb

| Estado | Reação | Onde aparece |
| --- | --- | --- |
| disponível | `idle` | lista, cabeçalho |
| trabalhando | `working` | lista; fila "fazendo agora" com spinner |
| pensando | `thinking` | enquanto responde no chat |
| precisa de você | `needs` | cartão pendente; aviso com decisão |
| concluído | `done` | aviso decidido |
| em pausa | `sleeping` | — |
| com erro | `error` | — |

Em listas, os orbs vão com `extras={false}`; nas mensagens e linhas de tarefa,
`estatico` (um quadro), como o README do orb recomenda para muitos orbs na tela.

## Decisões e diferenças em relação aos documentos

1. **A estrutura é a do Figma do usuário** (rodada 2): barra lateral com os módulos e abas internas em cima, centralizadas. Isso coincide com o subplano 03, 2.0. A primeira versão do lab tinha posto os módulos como abas em cima; foi refeita.
2. **"Time" é aba interna do Início**, ao lado de "Assistente", como no Figma. O 2.0 não tinha esse item; o chat dos integrantes continua também na gaveta dos demais módulos, abrindo no Geral (03, 2.5).
3. **Início tem três abas**: Assistente (chat Geral grande, decisão 14 do Desenho), Time, e **Visão geral**, que é a Home do 03, seção 4, como widgets: indicadores, calendário da semana com medidor do mês, avisos completos, pendências por cliente, linha do tempo. No Assistente ficam só os avisos básicos, uma linha cada, abaixo do título; o aviso completo (fiz / decisão / informação) mora na Visão geral. Decidido pelo lab a pedido do usuário ("a seu critério").
4. **O Geral aparece como "Assistente"** no tema de fábrica, como no Figma. É só o nome do tema; outro escritório pode chamar de "Geral".
5. **Campo do chat**: o **ditado entra** (decisão do usuário) e funciona no lab com o reconhecimento de fala do navegador em pt-BR (Chrome, Edge, Safari): o texto cai no campo para a pessoa revisar antes de enviar. Em produção a transcrição deve ir para o servidor, para funcionar igual em todo navegador (o Firefox não tem o recurso). O botão de **ajustes saiu** (veio junto com o componente do Figma, sem função). O círculo azul ao lado do campo é o indicador "time trabalhando" e o "?" é a ajuda.
6. **Cartão com sim / editar / não** (02, 9.3); `BotoesDecisao` tem `semEditar`.
7. Os círculos da barra lateral do Figma não tinham ícone; usei Phosphor (casa, quadrados, balões, cronômetro, carteira, engrenagem). O primeiro círculo do pé (o avatar) virou o menu da conta; o último, Configurações. O quadrado do topo é o logotipo.
8. Os ícones e o fundo do Figma foram refeitos com CSS e lucide em vez de baixar os vetores: o fundo é um degradê simples e os ícones têm equivalentes diretos. Os orbs do Figma são o próprio `<orb-avatar>`.
9. Sem roteamento por URL (03, 2.3 pede aba + cliente na URL); entra quando o lab virar o app. No celular, a navegação é a gaveta da barra lateral em vez do menu inferior do 03, 2.6; dá para trocar depois se o uso no celular pedir.

## Aba Time

- **Lista** (coluna; no celular, faixa de orbs): busca; Assistente e Consultor fixos no topo; os demais por urgência (precisa de você, erro, trabalhando, concluído, disponível, em espera) e pendências; cada item com orb vivo, nome, setor, uma linha do que está fazendo e contador; pausado e em observação marcados; "Novo integrante" no fim.
- **Cabeçalho**: orb grande (segue o cursor, reage ao clique), nome, estado, "em observação", setor e função, fila, cartões pendentes, porcentagem do limite de 5 horas do usuário (barra discreta; % e não tokens, 02 seção 16) e menu: pausar ou retomar, ver memória, configurar, histórico do mês passado. No celular, só orb, nome e estado.
- **Cartões** no chat: aviso (fiz / decisão / informação), aprovação (resumo humano, argumentos, **Aprovar / Editar e aprovar / Recusar**, expiração; Fundações 6.4), tarefa, documento ou guia, conversa do CRM, encaminhamento, tabela e **passagem de trabalho** entre integrantes de usuários diferentes ("Fiscal (de Fernanda) passou X da Padaria para DP (de Ana Souza)", 02 seção 8.4).
- **Estados**: sem histórico (quem ele é e sugestões de pedido), pausado (faixa com "Retomar"), limite atingido ("Cheguei ao limite desta janela. O chat continua; os trabalhos automáticos esperam").
- **Novo integrante** (02 seção 11): descrever → proposta (nome, cor do orb, função, setores, ferramentas só entre as do usuário, com as demais marcadas "você não tem isso; removido", gatilhos) → revisar → ativar, com o aviso dos 14 dias de observação. No lab, a proposta é de exemplo; em produção vem de `integrante.propor`.
- Conversas guardadas por integrante (não por setor), porque um integrante criado pelo usuário pode ser do mesmo setor de um padrão.

## Widgets (grade personalizável)

Toda tela de cartões (Visão geral e as oito abas do Painel) usa a mesma grade e a mesma
caixa, em `src/components/widgets/`:

- **`Widget`**: a caixa única. Superfície, raio de 24 px, respiro, cabeçalho com ícone,
  título, IDs do mapa (`atividades`) e ação. O conteúdo recebe o tamanho atual
  (`conteudo(tamanho)` ou `useTamanhoWidget()`) para se adaptar; dentro dele, container
  queries (`@sm:`, `@2xl:`) respondem à largura da caixa, não da janela.
- **Tamanhos fixos**, múltiplos da célula (como os widgets do celular): P 1×1, M 2×1,
  G 2×2, L 4×1, XL 4×2. A célula tem 156 px de altura (136 em telas baixas).
- **`GradeWidgets`**: colunas pela largura do contêiner (2 no celular, 4 no tablet, 6 no
  comum, 8 no ultrawide) e `grid-auto-flow: dense`, que preenche os buracos. Modo edição
  (botão "Editar painel" ou toque longo): os widgets tremem, arrastam (mouse, toque e
  teclado), trocam de tamanho no canto, somem pelo botão de menos e voltam pela galeria
  "Adicionar widget"; "Restaurar padrão" desfaz tudo. Esc conclui.
- O arranjo fica salvo por tela (`ui-lab:widgets:<chave>`; em produção,
  `usuario.preferencias`, 03, 4.3). Cada aba do Painel guarda dois arranjos: com cliente
  e em carteira, porque os widgets mudam entre um e outro.
- **Cada tamanho precisa fazer sentido para o widget.** Um widget só oferece os tamanhos
  em que o conteúdo cabe inteiro; o menor costuma ser um resumo (número, barra) e o
  maior, a lista ou a tabela. O Largo (4×1) tem só ~88 px de conteúdo: serve para faixas
  (etapas, ciclo de vida, captura por fonte), nunca para listas ou tabelas. Um tamanho
  salvo que o widget não aceita vira o permitido mais próximo.
- **Conferir:** a story "Widgets/Todos os tamanhos" mostra cada widget em cada tamanho,
  com a largura real de coluna. O teste `medir.cjs` (no scratchpad da sessão) aponta corte
  e caixa vazia em todos eles.
- **No celular** (2 colunas), Largo e Extra ganham altura em vez de ficarem achatados:
  viram 2×2 e 2×4.
- **Arranjo padrão sem buracos:** os padrões do Painel ficam em `telas/painel/padroes.ts`,
  um por aba e variante (com cliente, carteira, cliente do Simples na Fiscal). Foram
  calculados simulando o `grid-auto-flow: dense` em 6 colunas, para fechar a grade sem
  espaço vazio, e conferidos na tela real em 6, 4 e 2 colunas. Assimétrico de propósito.
- Para criar um widget: um `DefWidget` (`id`, `titulo`, `descricao` para a galeria,
  `icone`, `tamanhos` que fazem sentido, `conteudo`) no catálogo da tela, e um item no
  arranjo padrão.

## Área de rolagem

Toda área que rola sob o cabeçalho usa a classe `.area-rolagem` (ou `<AreaRolagem>`): ao
rolar, o topo do conteúdo esmaece aos poucos (máscara guiada pela própria rolagem, sem
desfoque, que pesa); parada no topo, nada é cortado. Tela nova que rola: use a classe.

## Painel

Oito abas internas (Clientes e Societário, Obrigações e Prazos, Notas fiscais, Fiscal,
Trabalhista e DP, Contábil, Consultoria e Reforma, Gestão), todas com a anatomia do
subplano 03, seção 5. O cabeçalho (A) fica fixo; o resto vira widgets na grade, na ordem
da anatomia por padrão:

| Parte | Onde | O que mostra |
| --- | --- | --- |
| A | `CabecalhoAba` | perfil vigente que importa ao setor (o regime vem do cliente), vigência com histórico, faixa de aviso, integrante do setor e "Falar" |
| B, E, F, D, G | `telas/painel/comuns.tsx` | pendências (cobrar, recebida), ações (nível no rótulo; "falta X"; "N clientes" na carteira), tarefas do setor, documentos (origem, hash, visível no app), relatórios |
| C | `telas/painel/<aba>.tsx` | os blocos da seção 6 de cada aba, como widgets |

Blocos de cada aba (com cliente · em carteira):

- **Societário:** ciclo de vida, certificados, ficha com versões e divergência Receita × cadastro, pessoas e opt-in, contrato e honorário, acessos e procurações, processos · certificados a vencer, clientes por estado.
- **Obrigações:** calendário do cliente (legal, interno, status, recibo), atrasos e riscos com multa estimada, pré-requisitos da semana, comprovação, regras por UF e prorrogações · a semana por cliente.
- **Notas:** captura do mês por fonte com paridade, configuração de captura, manifestação, completude, conferência tributária, envio ao core · captura de cada cliente.
- **Fiscal:** Simples (só cliente do Simples), caixas postais, guias (enviada, lida, paga), situação fiscal, certidões · guias da carteira.
- **DP:** admissões com contagem do S-2200, quadro, folha, eSocial, férias com risco de dobra, rescisões · folha de cada cliente.
- **Contábil:** fechamento em cinco etapas, o que deve chegar, classificação com confiança, conciliação · clientes por etapa e analista.
- **Consultoria:** perguntas técnicas (rascunho revisado por pessoa), vigilância do Consultor, pareceres, simulações (fase 4) · perguntas e avisos por cliente.
- **Gestão** (igual com ou sem cliente): produtividade e atrasos, governança da IA, equipe e carga, permissões calculadas, plano de migração.

Dados: `src/dados/painel.ts` (configuração das abas, Fiscal, Contábil, DP) e
`src/dados/painel-abas.ts` (as outras cinco).

## CRM

Quatro abas (subplano 04), em `src/telas/crm/` com os dados em `src/dados/crm.ts`:

- **Conversas** (04, 4): a caixa de todos os canais num painel como o do Time. À
  esquerda, as visões Sem responsável · Minhas · Do setor · Todas, a busca (inclui
  transcrição de áudio) e a lista ordenada pelo prazo de resposta (estourado em vermelho;
  pausado e resolvido no fim). No meio, a conversa: ações (assumir, repassar, transferir,
  aguardando cliente ou interno, resolver; no "mais": virar tarefa, etiquetar urgente,
  lembrete, resumir, ligar a cliente, bloquear), resumo gerado no topo e o histórico
  unificado com o canal de cada mensagem: do cliente à esquerda, do escritório à direita,
  mensagem automática com o modelo, resposta do integrante com o orb parado, nota interna
  (nunca sai), áudio com transcrição, anexos, status de entrega, cartões e marcos. O campo
  alterna Responder e Nota interna, escolhe o canal, tem respostas rápidas ("/") e "tom";
  fora da janela de 24 h do WhatsApp só aceita modelo aprovado. Transferir deixa a origem
  só leitura, com o aviso. À direita, o cadastro (cliente, quem escreve e opt-in, tarefas,
  pendências com cobrar, histórico); abaixo de 1536 px vira gaveta. O filtro por cliente
  fica na própria lista (funil ao lado da busca, chip removível) e abre com o cliente que
  vinha selecionado no resto do sistema. No celular, lista e conversa se alternam.
- **Sem seletor de cliente no topo do CRM:** Conversas filtra na lista; Leads e Números são
  do escritório; Comunicados escolhe os destinatários no envio (todos, segmento ou
  clientes escolhidos).
- **Leads** (04, 6): quadro Lead · Qualificado · Proposta · Contrato · Implantação ·
  Perdido, com arrastar (mouse, toque, teclado). Implantação só por "Fechar contrato", que
  mostra o que acontece de uma vez (cria o cliente, liga conversas, convite do app,
  trilha). Detalhe em gaveta com a próxima ação e o nível; perdido pede motivo. Vista de
  métricas do funil.
- **Comunicados** (04, 7): os enviados com entregues, lidas, respostas e falhas (reenvio
  por e-mail); o novo comunicado com "para quem" (todos os clientes, segmento do perfil ou clientes
  escolhidos), contagem de opt-in, modelo aprovado, canal,
  agendamento, três exemplos e envio com aprovação. Abaixo, as seis réguas com etapas e
  liga/desliga (Honorários espera o Financeiro).
- **Números** (04, 3.2): um número por setor com equipe, o principal no Gestão e
  Atendimento, saúde da conexão e e-mail; abaixo, modelos com status na Meta, horário,
  SLA, etiquetas, respostas rápidas e o aviso do modo experimental.

`components/ui/menu.tsx` é o menu de ações reutilizável (Popover que fecha ao escolher).

### Cadastros (kit de formulário)

Todo item configurável se cadastra e edita do mesmo jeito: `components/ui/formulario.tsx`
traz a `GavetaFormulario` (gaveta à direita, rodapé fixo com Cancelar e a ação principal,
ação secundária à esquerda para apagar ou salvar rascunho) e os campos (`Campo` com rótulo,
ajuda e erro; `CampoTexto`, `CampoArea`, `CampoEscolha`, `Segmentado`, `Fichas`,
`Interruptor`, `CabecalhoSecao`). Validação na hora: a ação principal fica desabilitada
enquanto falta algo, e o erro aparece sob o campo.

No CRM já usam o kit:

- **Números:** conectar número (setor → janela da Meta → coexistência → nome exibido e
  e-mail → pronto), detalhes do número (nome, e-mail, principal, mensagens automáticas,
  verificar saúde) e ligar o modo experimental (aceite por escrito).
- **Modelos:** criar, editar e enviar à Meta; nome normalizado no formato da Meta;
  variáveis do sistema inseridas por toque, com erro para variável desconhecida; até 3
  botões; números em que vale; prévia com dados de exemplo; rejeitado mostra o motivo;
  editar aprovado cria nova versão.
- **Mensagens automáticas** (texto, liga/desliga, minutos de espera), **Horário** (dias,
  abre/fecha, intervalo, plantão), **Feriados**, **Prazos de resposta** (por setor e regra
  por etiqueta), **Etiquetas** (cor, tipo, setor ou atividade do timesheet) e **Respostas
  rápidas** (atalho, texto, setor).
- **Leads:** "+ Lead" manual (indicação, Instagram…). **Comunicados:** nova régua e edição
  das etapas (dia relativo, texto, para quem), parada, horário e escalonamento.

O quadro de Leads é um painel de superfície (como a caixa de Conversas) com as etapas em
faixas divididas por linhas e os cartões na camada elevada: as camadas fundo → superfície
→ elevada separam bem em qualquer tema; a rebaixada translúcida sobre o fundo, não.

## Timesheet

Quatro abas (subplano 05), em `src/telas/timesheet/` com os dados em `src/dados/timesheet.ts`.
O cliente selecionado no topo filtra as quatro.

- **Meu tempo** (05, 8.2): resumo do dia, "Onde foi o meu dia?" (linha do tempo por
  confiança, com o agente numa faixa à parte e fora da jornada contornado), a lista de
  sessões (abrir mostra as evidências; contestar com motivo em lista; confirmar e
  classificar o que é estimado ou sem classificação), semana e mês em gráficos, o que os
  integrantes fizeram (máquina, horas poupadas, % do limite), a extensão (sinais por
  portal, pausar, portais) e as minhas contestações. Primeiro acesso: faixa para ler e
  aceitar o termo; vincular extensão só depois.
- **Confirmações** (05, 5.2 e 8.5): a lista curta por dia, pré-preenchida, com a sugestão
  em um clique, "era o outro cliente" no conflito, corrigir ou dividir, "não era trabalho"
  e "confirmar tudo marcado". Para o Gestor: arquivos sem pessoa (atribuir) e a contagem de
  pendências por pessoa, sem o conteúdo.
- **Equipe** (05, 8.3): horas por pessoa e confiança, onde o tempo foi (cliente, atividade,
  origem), a captura semana a semana, capacidade com ausências, contestações a decidir,
  diagnóstico de cobertura, fila "sem equivalente" do core, sistemas conectados, atividades
  mal capturadas, calibração do catálogo, agentes (máquina, custo, poupadas, aprovação) e
  fora da jornada agregado.
- **Rentabilidade** (05, 8.4): custo = horas × custo-hora do escritório + variáveis; margem
  por cliente em barras divergentes, alternador "só medidas e confirmadas", evolução de 12
  meses com marcos, de onde vem o custo e propor reajuste.

**Gráficos** (`telas/timesheet/graficos.tsx`): um por pergunta, com a pergunta como título.
A confiança usa um tom só (a cor do texto do tema) em degraus (automática escura,
confirmada média, estimada clara listrada, sem classificação tracejada), para funcionar em
qualquer marca branca e não depender só de cor; o agente é sempre série separada; margem
positiva e negativa levam sinal e rótulo, além da cor.

**Pop-ups, todos com o kit de formulário:** termo de ciência; vincular extensão (navegador,
loja, vínculo pelo login, ciência com a lista de portais, pronto); pausar extensão; portais
da extensão (o Administrador desliga e pede inclusão); detalhe e contestação de sessão;
corrigir, classificar como interno ou dividir entre dois clientes; decidir contestação;
atribuir arquivo sem pessoa; registrar ausência; adotar a calibração; conectar sistema
contábil (Alterdata por token com teste; Domínio, Questor e Contmatic por relatório e
pasta); equivalências departamento → setor e responsável → pessoa; custo-hora do escritório
(pelos gastos do mês ou valor direto, com refinamento opcional por cargo); propor reajuste;
configurações do módulo (inatividade, itens por dia, horário da lista, jornada, abertura da
Equipe ao Gestor, extensão, artefatos, benchmark); exportar.

## Financeiro

Sete abas, na estrutura do subplano 09 (decisão do usuário em 8/11/2026): Visão geral ·
Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado. Contas a
pagar, conciliação, saldos e fluxo são peças com **titular** (`src/telas/financeiro/pecas.tsx`):
as mesmas servem ao caixa do escritório e, no BPO, ao de cada empresa cliente; a tela mostra o
selo do titular. A Visão geral abre pelo que precisa de decisão. Aprovar uma conta agenda no
banco; a liberação final é sempre de uma pessoa. Alçada pela conta (Gestor até R$ 5 mil,
Administrador acima); Colaborador só por exceção e nunca no Resultado.

Antes eram quatro abas (03, 6.8; atividades FIN e GES-001 a 015), em `src/telas/financeiro/` com os
dados em `src/dados/financeiro.ts`. Sem seletor de cliente no topo: é o financeiro do
escritório, e as listas filtram por cliente. Os honorários dos clientes de exemplo batem com
os da Rentabilidade do Timesheet.

- **Contratos** (FIN-001, 002, 016; GES-002, 008, 012, 014, 015): receita contratada por
  setor e por regime, quem passou da faixa (propor aditivo ou cobrar como extra), contratos
  como assinatura estruturada e versionada (itens com faixa, vencimento, forma, índice e
  data-base, 13º, retenções, centro de custo, indicação; salvar cria versão nova a partir de
  uma competência; um contrato por cliente), extras e reembolsos a faturar (reembolso exige
  comprovante) e a campanha de reajuste em passos (índice, segmentar pelo custo real,
  carta, envio).
- **Cobrança** (GES-001, 003 a 007, 009; FIN-009, 011): o ciclo do mês para revisar e
  aprovar (o que mudou desde o mês anterior, 13º, gerar sozinho quando nada mudar), faturas
  com filtro e detalhe (histórico, 2ª via atualizada, registrar pagamento fora do provedor,
  corrigir nota ou valor, cancelar), quem está devendo com proposta de acordo (fora da
  política pede alçada), recebimentos sem cobrança para vincular e a régua editável.
- **Caixa** (FIN-003, 004, 005): saldos por conta, entradas e saídas de 12 meses com o
  projetado listrado (mesma linguagem do "estimado" do Timesheet) e marcos, contas a pagar
  com alçada e aprovação em lote (a liberação final é no banco), conciliação com sugestão e
  aceite em lote das seguras, capturar conta por arquivo, código de barras ou à mão.
- **Resultado** (FIN-006, 007, 008, 012; GES-010, 011): indicadores, DRE gerencial por
  centro de custo com o custo vindo do Timesheet (e a opção de ratear o Atendimento),
  orçado × realizado, antecipação de lucros aos sócios, comissões e custos variáveis por
  cliente (absorver ou repassar).

**Configurar** (menu no topo de cada aba, tudo no kit): provedor de cobrança em passos
(trocar sem perder as autorizações de Pix Automático), NFS-e do escritório, política de
inadimplência (nunca reter documento), conectar conta por Open Finance, plano de contas,
alçadas de aprovação e trazer o financeiro atual (Conexa, Omie, Conta Azul, Nibo, Domínio
Honorários, planilha) com data de virada. O kit ganhou `Passos` (barra de etapas dos fluxos)
e rótulo acessível em `CampoEscolha` e `CampoTexto` sem `Campo` em volta.

## Configurações

Seis abas (Fundações 2, 7, 9 e 10; subplanos 02 e 06), em `src/telas/config/` com os dados
em `src/dados/configuracoes.ts`. Sem seletor de cliente: tudo vale para o escritório. Blocos
comuns (`Caixa`, `Numero`, `TituloBloco`, `Propriedade`, `BarraUso`) em
`components/compostos/blocos.tsx`, reaproveitados pelo Timesheet.

- **Escritório:** dados cadastrais, regras de acesso (inatividade, segundo fator, carteira de
  clientes; ligar a carteira avisa quem fica sem cliente), setores (fixos: renomear a
  exibição, desativar, responsável e número padrão), setores do perfil, notificações
  (resumo diário, silêncio) e modo BPO com subinquilinos.
- **Usuários e setores:** pessoas com papel e vínculo por setor (Execução ou Gestão),
  convidar, editar (cargo, exceções por tela, carteira, bloquear, desativar com repasse do
  que é dela), "o que vê" calculado e convites pendentes.
- **Armazenamento:** conectores com cota, tornar padrão, conectar nuvem em passos (tipo,
  autorizar, raiz, casar pastas com clientes, pronto), migrar, árvore-modelo com o que o
  cliente vê (marcar uma pasta vale para as filhas), destino por tipo de documento e pastas
  do Drive antigo sem cliente.
- **Tema:** identidade, cores por modo com verificação de contraste, tipografia e raio,
  prévia ao vivo só no recorte (variáveis aplicadas ao contêiner), integrantes padrão (nome
  e cor), domínios com verificação de DNS, remetente de e-mail (SPF/DKIM), modelos de texto,
  versões e publicar.
- **Integrantes:** perguntas de promoção (sim vale para sempre; não silencia 90 dias), time
  padrão por setor (ligar, regras do escritório com trava, canal de aviso), lista "faz
  sozinho" de cada setor (vem cheia; o Administrador só tira), limites por pessoa, modelos
  publicados (não copiam memória, clientes nem credenciais), memória do escritório a revisar
  e integrantes criados pelas pessoas.
- **Assinatura:** módulos (adicionar), uso do plano em barras, cobrança, faturas e
  histórico, trocar plano (bloqueia se o uso já passa do plano menor) e encerrar com
  confirmação digitada (exportação completa e 90 dias em modo leitura).

## Conversas do Assistente (proposta, fora do plano)

- **Cada cliente e a Carteira têm a sua sessão base**: diferente do ChatGPT e do Claude, em que a pessoa troca de conversa numa lista, aqui a sessão troca sozinha quando o cliente muda (abre a conversa mais recente daquele cliente).
- **Nova conversa** começa outra no mesmo cliente; a anterior fica no **histórico**, que abre no título da conversa, agrupado por Hoje, Ontem, Esta semana, Antes.
- **Limpar** apaga as mensagens da conversa atual, com confirmação.
- No lab, tudo em memória. Em produção, cada conversa é uma Sessão `chat` do usuário com o Geral, por cliente (02, 6.4); cartões de aprovação continuam valendo fora dela (Visão geral, chat do integrante), então limpar a conversa não apaga decisões pendentes.

## Limite de uso

Anel ao lado do campo do Assistente, como o do Claude: mostra o limite mais
consumido do plano de IA do escritório; ao passar o mouse, "74% do limite de 5
horas · renova às 13:10"; ao clicar, todos os limites com barra. Azul até 94%,
vermelho a partir de 95%. Fica fora do campo, à direita, com a ajuda logo abaixo: os dois centrados na altura do campo, no mesmo tamanho (40 px) e com a mesma superfície e sombra do campo (`bg-card`, `shadow-campo`). Abaixo de 1024 px, sem margem, os dois entram na barra de ações do campo.
Os limites e o plano são de exemplo; falta definir no Desenho quais limites existem.

## Escritório de demonstração (`npm run app` e a página publicada)

- `src/ambiente/`: `sessao` (contas e `permissoesDe`), `loja` (estado compartilhado com `useReducer`: avisos, eventos, mensagens do CRM e do Time, tarefas, decisões, fichas), `fluxos` (gavetas comuns: ficha da tarefa, cobrar, preparar, transmitir, ficha do cliente), `efeitos` (o que cada cartão de aprovação faz), `interface` (toasts, sino, botões de ação), `clientes` (fichas: contatos por assunto e responsáveis por setor), `PainelLab` (controles do wireframe: entrar como, visão escritório ou app, tema, recomeçar).
- Navegação por `Destino` (`{ modulo, aba, conversa, integrante, cliente, fatura, tarefa }`): todo link entre módulos usa `useNavegacao().irPara`.
- Testes de ponta a ponta em `scripts/` (Playwright contra o build): `varrer.cjs` clica em todo botão de cada aba e acusa os que não mudam nada; `vaos.cjs` procura buracos na grade; `app-cliente.cjs` faz o cliente enviar, conversar e pedir pelo app e confere o aviso e a mensagem do lado do escritório.

## Arquivos e visualizador de documentos

- **Módulo Arquivos** (`src/telas/ArquivosTela.tsx`): o "servidor" do escritório. Uma árvore só, a da árvore-modelo do Armazenamento (`<CNPJ - Nome>/permanentes`, `<ano>/<competência>/trabalho interno`, `Entregáveis/Fiscal|Folha|Contábil`, `_escritorio` para o Administrador), espelhando os conectores (plataforma; Drive antigo em somente leitura). Busca em todas as pastas, Recentes (o que chegou por último, de qualquer origem), enviar arquivo e nova pasta. A estrutura se configura em Configurações › Armazenamento, que tem o atalho "Ver os arquivos".
- **Índice** (`src/dados/arquivos.ts`): gerado dos mesmos dados das outras telas (guias da central de guias, folha do DP, balancetes, contratos do Financeiro, documentos das abas do Painel, anexos do CRM). Um documento existe uma vez só: o mesmo nome normalizado no mesmo cliente é o mesmo arquivo. A visibilidade ao cliente vem da pasta (Fundações 7.8) e pode ser forçada por arquivo. Documentos novos (app, conversas, integrantes, equipe) entram na loja (`documentosNovos`).
- **Visualizador** (`src/components/compostos/visualizador-documento.tsx`, `src/ambiente/documentos.tsx`): toda menção abre o mesmo arquivo, sempre com a marca do tema do escritório (nunca na interface do Drive ou do servidor): cartão de documento no Time, documentos das abas do Painel, anexos do CRM, lista de Arquivos. Mostra a folha, a pasta real (a trilha leva a Arquivos), onde os bytes estão, versão, impressão digital, visibilidade no app e o registro de entrega. No app do cliente, a mesma folha abre dentro do app, e abrir ou baixar entra no registro que o escritório vê.

## Suporte da plataforma

`src/ambiente/suporte.tsx`. Entrada "Suporte" no pé da barra lateral, para toda conta (e no "?" do Assistente). É da plataforma, não de um pacote: a equipe da plataforma não vê dados de clientes. Três seções:

- **Ajuda do sistema**: assistente barato que só responde sobre o sistema e as configurações, sempre com o botão para a tela certa. Limite de 30 perguntas por mês, com contador; não consome o limite de IA do plano e vale para quem não tem plano de IA. Pergunta contábil vai para o Assistente; pergunta sem resposta, e o limite atingido, passam para a equipe.
- **Falar com a equipe**: horário (seg a sex, 8h às 20h), fila com a espera, atendente entrando, "resolveu?" com avaliação; fora do horário, a mensagem fica para o dia seguinte (o painel Demonstração alterna o horário).
- **Histórico**: as conversas encerradas com a transcrição.

## Registro de tempo e modo de espera

`src/ambiente/espera.tsx`. Conta tempo só no Painel com cliente e no CRM (menos Números); o cabeçalho mostra o selo “contando tempo”. Sem clique, tecla, rolagem ou digitação por `inatividade_min` (3), a área de trabalho fica coberta por “Em espera”: o tempo para no último evento e a sessão segue aberta (não desloga). Início, Painel na carteira, Timesheet, Financeiro e Configurações não contam e não entram em espera. No painel Demonstração, “Simular 3 min parado” dispara a espera na hora.

## App do cliente (06)

`src/cliente/ClienteApp.tsx` dentro de `MolduraCliente.tsx` (aparelho de 390 px e, ao lado, "Chegou ao escritório" com os eventos do app). Quem entra são os contatos com `app: true` nas fichas; uma pessoa com várias empresas troca no topo. O papel (06 2.4) define as áreas: sócio vê tudo; financeiro, guias, documentos e honorários; RH, só folha. As pendências são as tarefas `aguardando_cliente` dos setores visíveis, descritas pelo que mandar (não pelo nome interno da tarefa). Serviços extras (06, 8 e as "ideias extras"): catálogo em `src/dados/servicos-extras.ts`, estado por cliente na ficha (`servicos`: ativo, disponível, oculto), que o escritório edita na ficha do cliente. O app lista todos os não ocultos; os ativos têm tela própria em `src/cliente/servicos.tsx` (emissor de NFS-e com tributação travada, Consultor da empresa, certidões, painel do sócio, simulador de folha, IRPF, recálculo de guia, agenda tributária, pacote de licitação, compra do A1, simulador da reforma, conciliação, cobrança dos clientes, relatório anual, conta digital). NFS-e emitidas e canceladas ficam na loja (`notasEmitidas`) e avisam o responsável de Notas e o integrante no Time.

**Resetar o ambiente** (painel Demonstração): remonta sessão e loja, limpa as preferências `ui-lab:*` do navegador, volta ao tema padrão e ao login.

Telas internas usam folhas dentro do aparelho, não as gavetas Radix, para não sair da moldura.

## BPO Financeiro (10)

`src/telas/bpo/`, dados em `src/dados/bpo.ts`. Item "BPO" na lateral entre Financeiro e Configurações, só para quem tem o setor BPO Financeiro e com o módulo ligado em Configurações › Assinatura (módulos extras, sem preço). Nove abas: Visão geral (abre pelo que precisa de decisão, com o semáforo da auditoria), Carteira (ERP e estado da sincronização de cada empresa), Fila (pedidos e pendências com a bola), Rotinas (checklist, conciliação do dia e calendário único com uma cor por pacote), Aprovações (conferência interna e os lotes com o cliente), Entregas, Volume, Rentabilidade (Administrador) e Configuração (Gestor do BPO e Administrador). O seletor mostra só as empresas de BPO; no Painel, só as da contabilidade.

- **Peças do Financeiro reaproveitadas** com titular empresa (`SeloTitular`, `SaldosContas`, `FluxoMensal`, `PendentesConciliacao`) e o atalho "Abrir no ERP" em cada linha (Conta Azul, Omie e Bling por API; Nibo por arquivo; livro próprio sem ERP).
- **Segregação**: quem digitou a conta não confere (o botão fica desligado, com o motivo).
- **Aprovação humana registrada**: o lote vira cartão no app do cliente (Aprovar, Editar e aprovar, Recusar). Até a faixa 2 aprova quem tem alçada para o total; acima, as duas pessoas da aprovação reforçada. No M1 o cliente libera no banco depois de aprovar ("Já liberei no banco"). Pagar e transferir nunca são automáticos. A decisão fica na loja (`bpoLotes`) e chega ao escritório (aviso, registro).
- **App do cliente**: quem tem alçada de pagamento vê "Pagamentos para aprovar" no Início e, em Mais, Aprovações de pagamento e Fluxo de caixa. A empresa só de BPO não tem as áreas da contabilidade.
- **Demonstração**: setor BPO Financeiro (Marina Teixeira, Gestora; Lucas Prado, Colaborador), integrantes do BPO no Time (Contas a Pagar, Contas a Receber, Conciliação e Gerencial, mais o Atendimento), seis empresas (Padaria, Clínica e Loja também na contabilidade; Mercado Bom Preço, Studio Forma e AutoPeças Rota 9 só de BPO), tarefas do setor e o relatório do mês em Arquivos › Entregáveis › BPO financeiro.

## Demonstração viva (sessão, trabalho simulado)

- **O que se faz fica feito** (`usePersistente` em `src/ambiente/loja.tsx`): o estado das telas mora na loja do escritório. Aprovar, confirmar, conciliar, resolver, cadastrar e editar sobrevivem à troca de aba e valem nas telas que leem a mesma chave (Confirmações e Meu tempo; Contas a pagar, Conciliação e Visão geral do Financeiro; Fila e Carteira do BPO; Cobranças e o app). O chat dos integrantes também mora na loja. "Resetar o ambiente" limpa tudo.
- **Trabalho simulado** (`src/dados/simulacao.ts` e o motor na loja): "Pedir ao integrante" no cartão e na ficha da tarefa, as sugestões de cada integrante e os pedidos "Peça ao time" do Assistente viram trabalho. Nada é instantâneo:
  - o integrante pensa antes de falar;
  - o progresso mostra as etapas (o relógio continua com a aba fechada);
  - ele escreve o resultado antes de entregar, com cartão, tarefa, aviso no sino e toast;
  - a passagem para outro integrante é animada (de orb a orb);
  - toda resposta de integrante, do Assistente e da Ajuda do sistema aparece sendo escrita, palavra por palavra, com cursor; os cartões e botões surgem quando o texto termina (`src/lib/escrita.ts`, cerca de 55 caracteres por segundo);
  - a atendente do suporte aparece digitando antes de cada mensagem, e o "integrante sugere" do CRM escreve no campo aos poucos;
  - a mensagem ao cliente no CRM passa por enviada, entregue e lida;
  - o cliente aparece digitando antes de responder, e a resposta pode destravar o próximo passo.
- **Exemplo completo:** a CTB-016 (Contábil classifica, passa ao Atendimento, a Rita responde no WhatsApp, o Contábil fecha a tarefa).
- **No CRM:**
  - "integrante sugere" escreve a resposta no campo, para revisar;
  - quando você envia uma mensagem, o cliente responde uma vez por conversa, digitando antes.
- **O Assistente acompanha o pedido no próprio chat** (pedidos "Peça ao time"):
  1. ele responde e passa ao primeiro integrante (passagem animada);
  2. o cartão do trabalho aparece, anda pelas etapas e fica no chat como "Concluído", com a hora;
  3. o integrante devolve o resultado ao Assistente (cartão de retorno);
  4. o Assistente conta o que foi feito e passa ao próximo, se houver, e o ciclo se repete;
  5. no fim, ele fecha com o resultado e o que vale a pena ver: a tabela do fechamento, o documento, o cartão de aprovação (o mesmo do chat do integrante; decidir em um vale no outro).
  Quando o fluxo depende do cliente, ele avisa que mandou a pergunta e conta quando a resposta chega.
- **Perguntas sobre a lei** ("Pergunte sobre a lei", no Assistente, e as sugestões do Consultor): o Consultor percorre a cascata em etapas (entender a pergunta e a data do fato, ler o perfil do cliente, buscar só o que vale na data, calcular, conferir cada afirmação contra o texto). A resposta segue o modelo de `legal.consultar` (07, 3.2): resposta direta no texto; depois, no cartão, o fundamento (cada afirmação ligada ao dispositivo), os trechos citados com hierarquia, vigência e link, o cálculo com a origem dos números, divergências, ressalvas, grau de segurança, data considerada e versão da base. São duas: fator R da Clínica Sorriso em 2027 (grau alto) e sublimite da Loja Bela Vista em 2026 (grau médio, por ser projeção).
- **Nada de "foto" nos integrantes** (`src/ambiente/integrante-vivo.ts`):
  - estado, resumo, fila e cartões pendentes saem da sessão: decidiu o cartão, o contador baixa e o "Precisa de você" some;
  - a faixa acima do campo mostra os cartões que ainda esperam decisão nesta conversa e leva ao primeiro;
  - a fila conta o que ele está fazendo e as tarefas do Painel com ele;
  - quando a demonstração abre, o time já está trabalhando: as rotinas (DCTFWeb, DTE, notas de entrada, cadastro na Receita, triagem, conciliação do BPO) andam, terminam com o resultado no chat e um aviso no sino, e o integrante fica disponível;
  - o aviso da Visão geral cuja decisão foi tomada no chat sai da Visão geral.
- **Aviso de quem já está vendo:** se você está no chat do integrante (ou acompanhando o pedido no Assistente, ou na conversa do CRM) quando ele termina, não aparece toast e o aviso já nasce lido.

## Backlog

- **Conversa por voz** (o botão de ondas do Figma): falar e ouvir a resposta, sem digitar. Fica para depois do ditado.
- Transcrição do ditado no servidor, igual em todo navegador.
- Logotipo do sistema (branding).

## Pendências com o usuário

- Licença da PP Neue Montreal para uso web: confirmada pelo usuário.
