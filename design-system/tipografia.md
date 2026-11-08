# Tipografia

## As fontes

Uma família só, a **PP Neue Montreal** (Pangram Pangram, versão 2.700), em dois cortes:

| Família | Token | Arquivos | Pesos | Para |
| --- | --- | --- | --- | --- |
| PP Neue Montreal | `titulo` | Roman e Italic, variáveis | 100 a 900 | Títulos, números grandes, o nome da marca |
| PP Neue Montreal Text | `texto` | Roman e Italic, variáveis | 200 a 700 | Todo o texto da interface |

- A Text é desenhada para tamanhos pequenos: tem mais espaço entre letras e formas mais abertas. Por isso todo texto até 18px usa `texto`.
- `titulo` entra de 24px para cima e no nome da marca.
- Os arquivos são variáveis: um arquivo por estilo cobre todos os pesos. Os originais traziam o itálico como eixo do mesmo arquivo; foram separados em Roman e Italic porque o Chrome não liga esse eixo sozinho. A página só baixa o itálico quando algum texto pede.
- Para código e dado há uma terceira família, `mono`, que é a monoespaçada do sistema operacional (`ui-monospace`, SF Mono, Menlo, Consolas). Não há arquivo de fonte para ela. O código de tarefa no produto (FIN-201, CTB-016) já usa a mono.
- Fallback: `ui-sans-serif, system-ui, sans-serif`. Fonte da web com `font-display: swap`.
- Licença de uso web confirmada pelo usuário.

## Escala

**Marca e site**

| Estilo | Tamanho / entrelinha | Peso | Espaçamento | Onde |
| --- | --- | --- | --- | --- |
| `hero` | 72 / 76 | 500 | -0,04em | Título do hero do site e da capa de apresentação. 44px no celular |
| `subtitulo-hero` | 22 / 28 (`texto`) | 400 | -0,01em | A frase sob o hero, em `texto-suave` |
| `codigo` | 12 / 16 (`mono`) | 400 | 0 | Código de tarefa (FIN-201), chave, versão |

O `hero` é a voz da marca para fora: peso 500 e espaçamento bem apertado, como um título de capa. Dentro do produto, os títulos continuam leves (300).


**Títulos (`titulo`)**

| Estilo | Tamanho / entrelinha | Peso | Espaçamento | Onde |
| --- | --- | --- | --- | --- |
| `display` | 48 / 48 | 300 | -0,025em | A pergunta do Assistente vazio, a saudação do login. 36px no celular |
| `numero-grande` | 36 / 40 | 300 | 0 | O número de um widget, com algarismos tabulares |
| `titulo-pagina` | 30 / 36 | 300 | -0,025em | Título da tela. 24px no celular |
| `titulo-secao` | 24 / 32 | 300 | -0,025em | Gaveta, seção longa, estado vazio |
| `titulo-bloco` | 18 / 28 | 600 | 0 | Nome no cabeçalho do chat, título de cartão grande |

**Texto (`texto`)**

| Estilo | Tamanho / entrelinha | Peso | Onde |
| --- | --- | --- | --- |
| `corpo-grande` | 16 / 24 | 400 | Leitura longa fora do chat. Raro |
| `corpo` | 14 / 20 | 400 | O texto da interface |
| `corpo-chat` | 14 / 22,75 | 400 | Mensagem do chat (entrelinha 1,625) |
| `corpo-enfase` | 14 / 20 | 500 | Título de cartão, botão, nome em lista |
| `nome-autor` | 14 / 20 | 600 | Nome de quem fala no chat |
| `rotulo` | 12 / 16 | 400 | Metadado, legenda, chip, cabeçalho de tabela |
| `rotulo-enfase` | 12 / 16 | 500 | Contador, selo |
| `micro` | 11 / 16 | 400 | Só a hora da mensagem |

## Regras

- **Títulos grandes são leves.** De 24px para cima, peso 300 e espaçamento -0,025em. Título grande em negrito não é da marca.
- **Ênfase é 500.** No texto, o peso de ênfase é 500. O 600 aparece só em `nome-autor` e `titulo-bloco`; 700 e acima não são usados na interface.
- **Duas cores de texto.** `texto` e `texto-suave`. Hierarquia se faz com tamanho e peso, não com mais cores.
- **Nada abaixo de 11px**, e 11px só para a hora. Metadado tem 12px.
- **Números que se comparam** (tabelas, valores, horas, porcentagens) usam algarismos tabulares (`font-variant-numeric: tabular-nums`). Valor em reais à direita na coluna.
- **Moeda e data no padrão brasileiro**: R$ 13.940,00; 18/11; 31,2%.
- **Caixa normal.** Só a primeira letra maiúscula em títulos, botões e abas. Nenhum rótulo em caixa alta ou versalete, nem com espaçamento; rótulo é a fonte `texto`, um passo menor.
- **Mono só para dado.** A `mono` mostra código, chave e versão. Usada para parecer técnico, ela é enfeite e não entra.
- **Sem rótulo acima do título.** O título carrega o próprio peso; uma etiqueta pequena em cima dele não é usada.
- **Itálico** só para citação (o retorno de um integrante, um trecho de lei) e para nome de obra. Nunca para ênfase.
- **Linha de leitura** com até cerca de 70 caracteres: o chat fica em uma coluna de 768px, 896px em tela muito larga.
- **Telas grandes**: acima de 2400 × 1300 px a base sobe 12,5% (18px) e toda a escala cresce junto, porque tudo é em rem.
- **Título quebra equilibrado** (`text-wrap: balance`); texto corrido não justifica.
