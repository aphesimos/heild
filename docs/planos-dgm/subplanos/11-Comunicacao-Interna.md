# Subplano 11 · Comunicação interna

**Versão 0.1 · 14/11/2026 · desenho; nada é desenvolvido agora.** Pedido do Enzo: "o sistema deve conter comunicação interna pessoal, intra-setor e geral, quase como um Microsoft Teams, e não deve haver possibilidade de exclusão de mensagens." Faz parte da **plataforma comum** (DA-02): vale para todo pacote de área (Contábil, BPO, Jurídico) e para todo escritório, sem módulo extra.

## 1. Escopo e princípios

**Dentro:** conversas entre pessoas da equipe do mesmo escritório:
- conversa pessoal (uma pessoa com outra);
- grupo pequeno, criado por qualquer pessoa;
- canal do setor (um por setor ativo: Societário, Fiscal, DP, Contábil, Gestão e Atendimento...);
- canal geral do escritório.

Inclui também: menção a pessoas e a integrantes, respostas em fio (thread), anexos, busca, aviso de leitura e presença.

**Fora (v1):** chamada de voz ou vídeo própria (na v1, só um link de reunião do escritório colado na conversa); conversa com o cliente (isso é o CRM, subplano 04); conversa entre escritórios diferentes (no BPO entre escritórios, o convidado não entra na comunicação interna).

| Princípio | Consequência |
| --- | --- |
| **Nada se apaga** | Não existe botão de excluir mensagem, para ninguém, nem para o Administrador. Editar cria uma nova versão; a mensagem mostra "editada" e o histórico de versões fica visível para quem participa da conversa. Anexo enviado também não se apaga. |
| **É registro do escritório** | As conversas pertencem ao escritório, não à pessoa. Quem sai da equipe perde o acesso, e o histórico continua. |
| **Separada do cliente** | Nada da comunicação interna aparece no app do cliente nem no CRM. Para mandar algo ao cliente, a pessoa usa o CRM ou o envio do Painel. |
| **Respeita o sigilo** | Num Caso restrito (pacote Jurídico) ou num cliente restrito, só quem tem acesso vê o que foi ligado a ele; o link de um cliente ou tarefa só abre para quem tem permissão. |
| **Agentificada, com pessoa no comando** | Os integrantes entram quando são chamados ou por gatilho combinado; nunca mandam mensagem a cliente por aqui. |

## 2. Tipos de conversa

| Tipo | Quem participa | Quem cria | Observação |
| --- | --- | --- | --- |
| **Pessoal** | Duas pessoas | Qualquer uma | Fechada; ninguém mais lê, salvo a regra de auditoria (seção 5) |
| **Grupo** | Pessoas escolhidas | Qualquer pessoa | Nome e participantes editáveis; a entrada e a saída de cada um ficam registradas |
| **Canal do setor** | Todas as pessoas com aquele setor | Automático, quando o setor é ligado | Entra e sai sozinho conforme o setor da pessoa muda; o integrante do setor vê o canal |
| **Canal geral** | Toda a equipe do escritório | Automático | Avisos da gestão, recados de todos; o Gestor pode fixar mensagens no topo |

## 3. Recursos

- **Mensagem com ligação:** citar um cliente, uma tarefa, uma obrigação ou um documento abre um cartão clicável (respeitando a permissão de quem lê).
- **Transformar em tarefa:** qualquer mensagem pode virar tarefa no Painel, com o link de volta para a conversa (como já se faz a partir das conversas do CRM).
- **Menção:** `@pessoa`, `@setor` (avisa todos do setor) e `@integrante` (chama o integrante para responder ou preparar algo; a resposta dele aparece no fio, marcada como de IA).
- **Anexos:** vão para Arquivos, no índice único, com a origem "comunicação interna"; também não se apagam.
- **Busca:** por texto, pessoa, cliente e período, só no que a pessoa pode ver.
- **Leitura e presença:** "visto por" em grupos e canais; presença (disponível, ausente, em modo de espera) ligada ao modo de espera já definido.
- **Avisos:** no sistema e no celular (web instalável), com horário de silêncio escolhido pela pessoa.
- **Áudio:** pode gravar áudio; a transcrição usa a mesma ferramenta do CRM e conta no limite de IA da pessoa.

## 4. Os integrantes na comunicação interna

| O que fazem | Classe |
| --- | --- |
| Responder quando chamados por `@integrante` (ex.: "@Fiscal, quais clientes ainda não mandaram o extrato?") | Faz sozinho (só leitura e resposta) |
| Postar no canal do setor o resumo da manhã: vencimentos do dia, cartões esperando aprovação | Faz sozinho, se o escritório ligar o gatilho |
| Propor uma tarefa a partir de uma conversa ("parece um pedido: criar tarefa?") | Prepara; a pessoa confirma |
| Resumir um fio longo para quem chegou depois | Faz sozinho, quando pedido |

Os integrantes **não leem conversas pessoais**, a não ser que um dos dois o chame ali. O integrante do setor lê o canal do setor só para responder quando é chamado e para os gatilhos ligados.

## 5. Guarda, auditoria e LGPD

- **Guarda:** enquanto o escritório for cliente, e depois pelo prazo de guarda definido nas Fundações; no fim do contrato, o escritório recebe a exportação completa.
- **Auditoria:** o Administrador não lê conversas pessoais no dia a dia. Em caso de investigação interna, a abertura de uma conversa pessoal exige motivo escrito, fica registrada e os participantes são avisados (mesma lógica do acesso a Caso restrito no Jurídico).
- **LGPD:** a base é o legítimo interesse do escritório e o registro da operação; o aviso de que "mensagens não podem ser apagadas" aparece no primeiro uso e no termo de uso da equipe. Pedido de titular (por exemplo, um ex-funcionário) é atendido com exportação e, onde a lei exigir, com anonimização do nome no perfil, sem apagar o conteúdo que é registro do escritório. **[a confirmar com revisão jurídica]** A regra "nada se apaga" pode conflitar com pedido de eliminação de dado pessoal; a hipótese é que a guarda como registro do escritório justifica manter, mas isso precisa ser conferido.
- **Dado sensível:** a pessoa é avisada se colar algo com cara de documento pessoal (CPF, holerite) num canal amplo; o sistema sugere mover para a tarefa do cliente.

## 6. Onde mora na tela

Item próprio na barra lateral, **Conversas internas** (nome provisório; separado do CRM, que é a conversa com clientes), com três grupos: Pessoais e grupos, Setores, Geral. O ícone mostra o número de não lidas. Uma janela pequena de conversa pode ficar aberta sobre qualquer tela.

## 7. Custo e preço

Incluída na plataforma, sem preço próprio. Custo: armazenamento das mensagens e anexos, servidor de tempo real e avisos por celular. Premissa de teste: **R$ 0,20 a R$ 1,00 por usuário por mês** **[a medir]**; as chamadas a integrantes contam no limite de IA de quem chama. Entra no Estudo de Precificação como linha do Painel (núcleo).

## 8. Ajustes pedidos, ordem de construção e perguntas

### 8.1 Ajustes pedidos a outros documentos

| Documento | Ajuste |
| --- | --- |
| 01 Fundações | Entidades Conversa interna, Mensagem (com versões), Participação; regra "sem exclusão" no modelo de dados; eventos `mensagem.criada` e `mensagem.editada`; teste de vazamento entre escritórios e de sigilo |
| 02 Time de agentes | Integrante chamado por menção; gatilho do resumo da manhã no canal do setor; integrante não lê conversa pessoal |
| 03 Painel | Ação "virar tarefa" e o link de volta; cartão de cliente, tarefa e obrigação nas mensagens |
| 04 CRM | Separação clara: CRM é cliente; comunicação interna é equipe. A transcrição de áudio é a mesma ferramenta |
| Estudo de Precificação | Linha de custo da comunicação interna no Painel (premissa acima) |
| Protótipo (repositório Heild, branch `prototipo`) | Item na barra lateral e as três seções |

### 8.2 Ordem de construção

| Etapa | Entrega | Depende de |
| --- | --- | --- |
| CI-1 | Conversa pessoal e canal geral, texto e anexos, sem exclusão, editar com histórico | Fundações (contas, setores, Arquivos) |
| CI-2 | Canais de setor automáticos, grupos, menções, busca, aviso de leitura | CI-1 |
| CI-3 | Integrantes por menção, "virar tarefa", resumo da manhã | CI-2; Time de agentes |
| CI-4 | Áudio com transcrição, avisos no celular, janela flutuante | CI-2 |

### 8.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | Pode editar uma mensagem? | Sim, com "editada" e histórico visível | "Corrigir um erro de digitação pode, mas a versão antiga fica guardada?" |
| 2 | O Administrador pode ler conversas pessoais? | Só com motivo escrito, registro e aviso aos participantes | "O dono só abre uma conversa particular em caso sério, e todos ficam sabendo?" |
| 3 | Grupos podem ser criados por qualquer pessoa? | Sim | "Qualquer um pode criar um grupo com colegas?" |
| 4 | Chamada de vídeo própria? | Não na v1; só link de reunião | "Por enquanto, reunião por vídeo continua no Meet ou Teams, com o link na conversa?" |
| 5 | Mensagem pode ser fixada no canal geral? | Sim, pelo Gestor | "O gestor pode deixar um aviso fixo no topo?" |
| 6 | O integrante pode postar sozinho no canal do setor? | Só o resumo da manhã, se o escritório ligar | "O integrante pode mandar o resumo do dia no canal do setor?" |

## Ressalvas

Nada aqui foi medido. O custo por usuário é premissa. A compatibilidade da regra "nada se apaga" com a LGPD está marcada para revisão jurídica.
