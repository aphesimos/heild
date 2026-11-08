# Cores

## Camadas

A tela se monta em camadas de areia. Cada camada tem um passo no claro e outro no escuro. No código, cada uma vira uma variável CSS.

| Camada | Claro | Escuro | Variável no código | Onde |
| --- | --- | --- | --- | --- |
| `fundo` → `fundo-fim` | areia 50 → 300 | areia 900 → 950 | `--background`, `--background-end` | Fundo da página, sempre em gradiente |
| `lateral` → `lateral-fim` | 150 → 400 | 850 → 925 | `--sidebar`, `--sidebar-end` | Barra lateral, em gradiente |
| `rebaixada` → `rebaixada-fim` | 200 → 300 | 925 → 950 | `--sunken`, `--sunken-end` | Trilhos, faixas, citações, coluna de integrantes |
| `superficie` | 100 | 850 | `--surface` | Painéis e cartões |
| `elevada` | 50 | 800 | `--raised`, `--card`, `--popover` | Campo, menu, popover, cartão dentro de painel |
| `borda` | 300 | 800 | `--border`, `--input` | Divisórias de 1px |
| `texto-suave` | 650 | 400 | `--muted-foreground` | Texto secundário |
| `texto` | 850 | 100 | `--foreground` | Texto principal |
| `primaria` | 900 | 100 | `--primary` | Botão principal, aba ativa |

Regras:

- Empilhe na ordem: `fundo` embaixo, `superficie` por cima e `elevada` no topo. `rebaixada` afunda dentro de uma superfície (o trilho das abas, a faixa acima do campo do chat).
- Cartão sobre cartão sobe uma camada: um cartão dentro de um painel em `superficie` é `elevada`.
- No escuro, a camada que sobe fica mais clara (`superficie` 850, `elevada` 800). Nunca escureça para "elevar" no escuro.
- Use `borda` só para dividir dentro da mesma camada (linhas de tabela, cabeçalho de painel). Entre camadas, a diferença de tom e a sombra já separam.

## Texto

- `texto` sobre qualquer camada, nos dois modos (11:1 ou mais).
- `texto-suave` para hora, legenda, metadado e placeholder. Passa em `fundo`, `superficie`, `elevada` e `rebaixada` (4,6:1 ou mais). No claro, não use sobre `fundo-fim` (3,8:1) nem `lateral-fim` (2,85:1): o pé da barra lateral e a base da página levam `texto`.
- Dentro de `primaria`, use `texto-sobre-primaria`.
- Hierarquia de texto se faz com tamanho, peso e `texto-suave`. Não use opacidade solta (`texto` a 60%) nem uma terceira cor de texto.

## Destaque

- `destaque` (#4f5bf5) é a única cor de marca fora da areia.
- Use em preenchimentos pequenos: a barra de limite de IA, o ponto de "novo", o marcador de seleção, o progresso de uma etapa.
- Como texto ou link, use `destaque-texto`. O original reprova como texto no escuro (2,8:1); a proposta passa a 4,5:1 ou mais nos dois modos.
- Nunca em área grande, em gradiente ou junto de uma cor de orb para formar uma paleta.

## Estados

| Estado | Preenchimento e ícone | Texto | Quando |
| --- | --- | --- | --- |
| Erro | `erro` | `erro-texto` | Recusado, falhou, inválido, atrasado |
| Sucesso | `sucesso` | `sucesso-texto` | Concluído, aprovado, conciliado |
| Atenção | `atencao` | `atencao-texto` | Vence logo, aguardando cliente, pede decisão |

- O estado vai sempre com palavra ou ícone, nunca só com a cor ("Concluído" com o check, "aguard. cliente" com o relógio).
- Selo de estado: fundo do estado a 15% sobre a camada, texto em `texto` e ícone na cor do estado.
- Contorno de cartão que pede decisão: `atencao` a 60%.
- Texto sobre `sucesso` cheio: `texto-sobre-sucesso` (areia escura). O sistema hoje põe branco, que reprova (3,36:1).

## Orbs dos integrantes

| Integrante | Token | Cor |
| --- | --- | --- |
| Assistente | `orb-assistente` | contraste do tema (areia 850 no claro, 100 no escuro) |
| Fiscal | `orb-fiscal` | #f7a335 |
| DP | `orb-dp` | #3d86f7 |
| Contábil | `orb-contabil` | #4fc9a8 |
| Consultor | `orb-consultor` | #6e5cf2 |
| Societário | `orb-societario` | #e86a8a |
| Notas | `orb-notas` | #f2d04b |
| Atendimento | `orb-atendimento` | #5bc0eb |
| Financeiro | `orb-financeiro` | #9bc53d |
| Contas a Pagar (BPO) | `orb-bpo-pagar` | #f08a5d |
| Contas a Receber (BPO) | `orb-bpo-receber` | #4cb782 |
| Conciliação (BPO) | `orb-bpo-conciliacao` | #7c8cf8 |
| Gerencial (BPO) | `orb-bpo-gerencial` | #c46fd6 |

- `orb-bpo` (#f08a5d) fica como a cor do setor BPO Financeiro nos marcadores do setor; os integrantes do BPO usam as cores das funções (decisão de 8/11/2026). Detalhes em `orbs.md`.
- A cor do orb aparece no orb e nos marcadores pequenos do mesmo integrante: o ponto antes do setor no calendário, a linha do avatar na lista. Nada além disso.
- O orb nunca carrega texto por cima. O olho do orb é escuro em orb claro e claro em orb escuro.
- No claro, os orbs claros (Notas a 1,5:1 e Fiscal, Contábil, Atendimento e Financeiro perto de 2:1) dependem da `sombra-orb` para não sumir. Não tire a sombra.
- Integrante criado pelo usuário escolhe a cor numa paleta curta. A cor nova precisa diferir em claridade das que já estão na tela, não só no matiz.

## Foco

- Anel de 2px, afastado 2px do elemento, em `anel-foco`. Sólido, a 3:1 ou mais sobre as camadas dos dois modos.
- Só aparece no foco por teclado (`:focus-visible`).

## Contraste conferido

- Passam: `texto` em todas as camadas (11:1 ou mais); `texto-suave` em fundo, superfície, elevada e rebaixada; os três `*-texto` de estado e o `destaque-texto` (4,5:1 ou mais nos dois modos); `texto-sobre-primaria`, `texto-sobre-destaque` e `texto-sobre-erro`.
- Valores do sistema que reprovam como texto, mantidos como estão e com a proposta ao lado: `sucesso` no claro (3,1:1), `atencao` no claro (3,4:1), `destaque` e `erro` no escuro (2,8:1), branco sobre `sucesso` (3,36:1).
