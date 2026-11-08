# Orbs

O orb é o rosto de cada integrante de IA: uma esfera da cor do integrante, com dois olhos em cápsula, que reage ao que ele está fazendo. No produto é o único elemento sempre animado. O desenho e a física vêm do componente `<orb-avatar>` (github.com/sundenlast/orb), o mesmo que a logo usa na forma `orb`.

## Os integrantes e as cores

| Integrante | Área | Token | Cor |
|---|---|---|---|
| Assistente | todas | `orb-assistente` | contraste do tema (`areia-850` no claro, `areia-100` no escuro) |
| Consultor | lei e reforma | `orb-consultor` | #6e5cf2 |
| Fiscal | contábil | `orb-fiscal` | #f7a335 |
| DP | contábil | `orb-dp` | #3d86f7 |
| Contábil | contábil | `orb-contabil` | #4fc9a8 |
| Societário | contábil | `orb-societario` | #e86a8a |
| Notas | contábil | `orb-notas` | #f2d04b |
| Atendimento | todas | `orb-atendimento` | #5bc0eb |
| Financeiro | o financeiro da própria empresa | `orb-financeiro` | #9bc53d |
| Contas a Pagar | BPO | `orb-bpo-pagar` | #f08a5d |
| Contas a Receber | BPO | `orb-bpo-receber` | #4cb782 |
| Conciliação | BPO | `orb-bpo-conciliacao` | #7c8cf8 |
| Gerencial | BPO | `orb-bpo-gerencial` | #c46fd6 |

- O Assistente recebe qualquer pedido e divide entre os outros; o Consultor responde sobre a lei com o artigo, a data e o grau de segurança.
- No BPO, cada função tem o seu integrante, como numa equipe de BPO que segrega quem lança de quem confere (decisão de 8/11/2026). `orb-bpo` continua como a cor do setor BPO Financeiro nos marcadores do setor.
- Integrante criado pelo usuário escolhe a cor numa paleta curta; a cor nova difere em claridade das que já estão na tela, não só no matiz.

## Estados

O orb reage ao estado do integrante. O estado vem sempre com palavra também (no cabeçalho do chat, na lista do time), nunca só com a reação.

| Estado | O que o orb faz | Quando |
|---|---|---|
| `disponivel` | parado, olhando | sem trabalho agora |
| `pensando` | olhos para cima, balanço lento | antes de responder (1,5 s; 2,2 s quando responde a uma pergunta) |
| `trabalhando` | vaga e olha em volta | uma tarefa em andamento, ou enquanto escreve |
| `precisa_de_voce` | chama a atenção | deixou um cartão esperando aprovação |
| `concluido` | contente | terminou e entregou |
| `dormindo` | olhos fechados | integrante pausado |
| `erro` | aflito | algo falhou e precisa de alguém |

## Onde o orb aparece

- No chat do integrante (cabeçalho e ao lado de cada mensagem), na lista do time, no cabeçalho das abas do Painel e do BPO (o integrante da função da aba) e no "No que posso ajudar?" do Assistente, onde ele segue o cursor e reage ao clique.
- A cor do orb aparece no orb e nos marcadores pequenos do mesmo integrante. Nada além disso: o orb nunca vira cor de botão, fundo ou gráfico.
- O orb nunca carrega texto por cima. O olho é escuro em orb claro e claro em orb escuro.
- No claro, os orbs claros (Notas, Fiscal, Contábil, Atendimento, Financeiro) dependem da `sombra-orb` para não sumir no fundo. Não tire a sombra.

## Regras de movimento

- O texto de um integrante aparece sendo escrito, cerca de 55 caracteres por segundo. Abrir o chat depois mostra o texto pronto (ou no ponto em que estava), nunca recomeça.
- Passagem entre integrantes: o cartão de passagem mostra o pedido saindo de um orb e chegando no outro.
- Com movimento reduzido ligado no sistema, o orb fica parado.
