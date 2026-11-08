# UI lab: estado e planejamento

Documento de passagem para a sessão mãe. O usuário passou a falar direto com a
sessão do UI lab; aqui fica o que foi feito, o que ele decidiu e o que muda nos
subplanos. Atualizado a cada etapa.

- **Branch:** `claude/ui-lab` (commits como sundenlast, sem co-autoria).
- **Página publicada (privada, do usuário):** https://claude.ai/artifact/AxKnVW13LqanR7jcRPR65f. Republicada no mesmo link a cada mudança; o usuário vê sem `git pull`.
- **Como rodar local:** `cd ui-lab && npm install && npm run dev` (Storybook, porta 6006) ou `npm run app` (porta 5173). Node 22.12 ou mais novo.
- **Detalhe técnico de cada decisão:** `ui-lab/README.md`.

## Feito

| Etapa | O que tem |
| --- | --- |
| Base | Vite + React 19 + TypeScript, Tailwind 4 com tokens em variáveis CSS, Storybook 10, Radix (sem estilo) + estilo próprio, Motion, ícones Phosphor |
| Marca branca | Tema por escritório; quatro camadas de cor (fundo, rebaixada, superfície, elevada), sombras nomeadas, token de atenção separado do destaque; tema de fábrica = o Figma do usuário numa escala de areia de um matiz só; dois temas de exemplo |
| Fonte | PP Neue Montreal (títulos) e Neue Montreal Text (texto), quatro arquivos variáveis (romano e itálico) |
| Orbs | `<orb-avatar>` 1.3 (canvas) do usuário; regra de quando animar (o grupo inteiro anima se um orb sai do padrão); "vivo" só nos orbs grandes; espelho do chat aberto no cabeçalho e na lista; transição suave do "pensando" ao "respondeu"; orb do Assistente sempre em contraste com o tema |
| Estrutura | Barra lateral expansível com os módulos (Início, Painel, CRM, Arquivos, Timesheet, Financeiro, BPO; Suporte e Configurações no pé), abas internas centralizadas em cima, cliente à direita; responsivo de 390 px a ultrawide 3440 px e telas baixas |
| Início · Assistente | Chat Geral grande, conversas por cliente com histórico, nova conversa e limpar, ditado por voz, botão de limite de uso, avisos básicos abaixo |
| Início · Time | Lista com fixos e urgência, cabeçalho com fila, pendentes, limite e menu, cartões (aviso, aprovação, tarefa, documento, CRM, passagem), estados vazio, pausado e limite atingido, fluxo de novo integrante |
| Widgets | Grade personalizável com uma caixa única para todo widget: tamanhos fixos (P, M, G, L, XL), arrastar, mudar tamanho, esconder, galeria para adicionar, restaurar padrão; arranjo salvo por tela; responsiva de 2 a 8 colunas |
| Início · Visão geral | A Home do 03, seção 4, na grade de widgets: indicadores, medidor, calendário da semana, avisos, pendências por cliente, linha do tempo, "Time agora" |
| Painel | Anatomia A–G do 03, seção 5, nas oito abas; cabeçalho fixo e o resto em widgets; **as oito abas desenhadas** com os blocos da seção 6, cada uma com visão de cliente e de carteira (Gestão igual nas duas) |
| Rolagem | Esmaecido suave do topo em toda área que rola sob o cabeçalho |
| CRM | As quatro abas do 04: Conversas (caixa completa com histórico unificado, ações e lateral), Leads (quadro com arrastar e fechar contrato), Comunicados (novo comunicado e réguas), Números |
| Timesheet | As quatro abas do 05 (Meu tempo, Confirmações, Equipe, Rentabilidade) com gráficos por pergunta e todos os pop-ups de setup e configuração no kit |
| Configurações | As seis abas (Escritório, Usuários e setores, Armazenamento, Tema, Integrantes, Assinatura) com todos os cadastros e fluxos em gaveta |
| Financeiro (09) | As sete abas do 09 (Visão geral, Contratos, Cobranças, Contas a pagar, Conciliação, Fluxo de caixa, Resultado) com todos os fluxos e as configurações do módulo no kit; peças com titular (escritório ou empresa do BPO) |
| Escritório vivo | A página publicada é um escritório de demonstração (Contábil Andrade & Lima): login com segundo fator, sete contas com permissões próprias (03 3.1, 04 10.1, 05 8.1), um estado compartilhado (tarefas, conversas, avisos, decisões) e botões que levam de um módulo ao outro. O mesmo fato aparece igual no CRM, no Time, nas tarefas, no Timesheet e no Painel. Sino com avisos por conta. Varredura de todos os botões em `scripts/varrer.cjs` |
| Revisão de regras | `REVISAO.md`: quem vê o quê, o que a IA pode fazer, contradições de dados corrigidas e o que não tinha configuração |
| App do cliente (06) | Web instalável num aparelho, alternável no painel "Demonstração". Entrada por código (WhatsApp ou e-mail), seletor de empresa (João Batista: Padaria e Café Central), papel define as áreas (06 2.4). Início, Documentos, Pendências, Conversa por setor, Pedidos, Financeiro, Empresa (certificado com termo), Agenda e Serviços. Tudo grava na mesma loja: o envio vira mensagem no CRM, a tarefa volta a andar e o responsável recebe aviso; o pedido vira tarefa com origem "pedido do cliente". Todos os serviços extras do 06 §8 (sete principais e oito ideias) visíveis com estado por cliente, ligados pelo escritório na ficha; os ativos funcionam (emissão de NFS-e, Consultor, certidões etc.). Botão "Resetar o ambiente" volta tudo à configuração original |
| Arquivos e documentos (Fundações 7) | Módulo Arquivos com a árvore do Armazenamento por cliente, espelhando os conectores; visualizador com a marca do escritório aberto de qualquer menção (Time, Painel, CRM, Arquivos, app); registro de entrega compartilhado com o app |
| Integrante Financeiro | Orb e chat próprios (cobranças de dezembro para aprovar, régua da Loja Bela Vista); cartão no topo das abas do Financeiro, como nas abas do Painel |
| Suporte da plataforma | Entrada "Suporte" no pé da barra lateral para toda conta: Ajuda do sistema (assistente barato, só sobre o sistema, 30 perguntas no mês, fora do limite de IA), Falar com a equipe (fila, fora do horário) e histórico |
| BPO Financeiro (10) | Módulo lateral com as nove abas, setor e contas do 10 5.4, seis empresas, quatro integrantes do BPO (Contas a Pagar, Contas a Receber, Conciliação, Gerencial), aprovação do cliente no app por alçada. Detalhe na seção "BPO" abaixo |

## Decisões do usuário nesta sessão (7/11/2026)

1. **Estrutura do Figma é a base:** barra lateral com módulos e abas internas em cima, centralizadas. Coincide com o 03, seção 2.0.
2. **Início com três abas:** Assistente (chat), Time (chat dos integrantes) e Visão geral (widgets da Home). Avisos básicos ficam abaixo do chat; os completos, na Visão geral.
3. **Kit:** manter Radix + estilo próprio; React Aria fica anotado para quando calendário e tabelas forem desenhados. Aval dado.
4. **Ditado entra;** conversa por voz vai para o backlog. O botão de ajustes do campo do chat sai.
5. **Ícones** só ícones, sem círculo atrás, e mais bonitos (Phosphor). Logotipo solto no topo da barra: do sistema por padrão, do escritório na marca branca.
6. **Barra lateral abre e fecha,** com animação e texto, porque só ícones não situam as pessoas.
7. **Responsivo de verdade:** 21:9, 16:10, resoluções baixas, celular.
8. **Barra de rolagem própria** do sistema, no UI kit.
9. **Botão de limite de uso** ao lado do campo do chat, como o do Claude (anel; dica ao passar o mouse; painel ao clicar).
10. **Cores padronizadas:** variáveis únicas de fundo, superfície, texto e destaque reutilizadas no sistema todo, para que mexer em uma mexa em tudo na marca branca. O tom areia do Figma foi escolhido de propósito.
11. **Orbs:** no "No que posso ajudar?" e no título do chat do integrante, seguem o cursor e reagem ao clique; nas mensagens, 100% parados; enquanto o agente pensa, animados com transição de estado e volta suave ao parado; nas listas dos chats, vagando com partículas e sem clique. O orb do Assistente é sempre o contraste direto do tema (corpo na cor do texto, olhos na do fundo), regra de marca; os demais têm cor própria.
12. **Conversas por cliente:** cada cliente e a Carteira têm uma sessão base, que troca sozinha quando o cliente muda; nova conversa, limpar e histórico do cliente. Conversa temporária foi descartada.
13. **Cartão de aprovação:** Aprovar / Editar e aprovar / Recusar, como nas Fundações 6.4.
14. **Widgets personalizáveis:** tamanhos fixos e alinhados (como os do celular), uma caixa única reutilizada em todos, grade responsiva; o usuário arrasta, muda o tamanho, esconde e põe em cima o que importa. Vale para a Visão geral e para todas as abas do Painel.
15. **Cabeçalho sem corte seco:** ao rolar, o conteúdo esmaece suavemente sob o cabeçalho, em todas as telas atuais e futuras.
16. **Tamanhos com lógica e arranjo sem buracos:** cada widget só oferece os tamanhos em que o conteúdo cabe inteiro, testados um a um; o arranjo padrão de cada aba fecha a grade sem espaços vazios (assimétrico é melhor que esburacado).
17. **Chat vazio do integrante igual ao do Assistente:** o orb segue o cursor e reage ao clique, centralizado, e mostra o estado real do integrante (dorme só quando está em espera).
18. **Sem seletor de cliente no CRM:** Conversas filtra por cliente na própria lista; Leads e Números são do escritório; Comunicados escolhe os destinatários (todos, segmento ou clientes a dedo).
19. **Balões de mensagem com raio fixo e mais respiro**, independentes do raio do tema.
20. **Tudo que é configurável tem cadastro:** mesmo padrão de gaveta de formulário em todo o sistema, com validação na hora. No CRM: números, modelos, mensagens automáticas, horário, feriados, SLA, etiquetas, respostas rápidas, lead manual e réguas.
21. **Quadros e colunas sobre painel de superfície**, nunca a camada rebaixada translúcida direto no fundo (some em temas escuros).
22. **Telas novas já nascem com todos os pop-ups de setup e configuração**, no kit de formulário, não só com a tela principal.
23. **Configurações sem seletor de cliente:** valem para o escritório inteiro.
24. **Financeiro sem seletor de cliente:** é o financeiro do escritório; as listas filtram por cliente.

### Decisões de 7 e 8/11/2026 que estavam só na conversa

25. **Login no padrão do sistema:** a tela de entrada usa a sigla da marca, a escala de títulos e os cartões do kit (não um desenho à parte).
26. **Painel "Demonstração" fechável** (Ctrl+Shift+D) e com "Resetar o ambiente", que volta sessão, loja, preferências e tema ao original.
27. **Serviços extras do app todos visíveis** (os possíveis, inclusive emissão de NFS-e), com estado por cliente que o escritório liga na ficha.
28. **Orbs:** com estado fora do padrão, animados (vagando, sem seguir o cursor). Se todos estão no padrão, ficam parados; se um diverge, o grupo inteiro anima. Partículas nunca cortadas.
29. **Orb "vivo" só nos grandes** (o "No que posso ajudar?" e o chat vazio do integrante, ativo ou pausado); gracinhas aleatórias entre 20 e 40 s. O orb do chat aberto se espelha no cabeçalho e na lista lateral (o grande e o do cabeçalho reagem juntos).
30. **Botões do Assistente fora do campo:** anel de limite e "?" do lado de fora, centralizados na altura da barra, 40 px, superfície com sombra do campo.
31. **Selo "contando tempo" só com ícone**; o seletor de cliente nunca encolhe abaixo de 17rem.
32. **Integrante Financeiro com orb próprio**, e as telas do Financeiro desenhadas com o cartão dele no topo.
33. **Arquivos como módulo lateral** e um visualizador com a marca do escritório: toda menção a documento (Time, Painel, CRM, Arquivos, app) abre o mesmo arquivo.
34. **Inatividade vira modo de espera**, só onde o tempo conta sozinho (ver "O que muda nos subplanos").

## O que muda nos subplanos (para a sessão mãe incorporar)

- **Fundações 2.1, item 1, e 5.4 (inatividade):** o desligamento por inatividade não bloqueia nem desloga. Vale só nas telas que registram tempo sozinhas (Painel com cliente aberto e CRM, exceto Números): sem ação por `inatividade_min`, a tela entra em modo de espera, a sessão de trabalho encerra no último evento e “Continuar” abre sessão nova sem pedir senha. Início (mesmo com cliente: lá só conta o que a IA faz, como sessão do integrante), Painel na carteira, Timesheet, Financeiro e Configurações não contam tempo e não entram em espera. A linha “Inatividade” dos testes (seção 15) passa a esperar “espera, sem nova autenticação”. Decisão do usuário em 7/11/2026.

| Onde | Mudança |
| --- | --- |
| 03, seção 2.0 | Abas internas em cima, centralizadas (controle segmentado); barra lateral expansível; cliente e sino no canto direito |
| 03, seção 4 | A Home vira a aba "Visão geral" do Início; o Início abre no Assistente |
| 02, seção 9 | Aba "Time" do Início: chat dos integrantes com a lista à esquerda; conversas do Geral por cliente (sessão base por cliente, histórico, nova, limpar). **Proposta fora do plano; precisa entrar.** |
| 02, seção 9 | Regra dos orbs (item 11 acima) e a transição do pensando ao respondido |
| 02, seção 16 / Fundações 2.2 | Botão de limite de uso no chat do Assistente; % da janela de 5 h e de 7 dias |
| Fundações, seção 10 (tema) | Tokens opcionais novos: `superficie`, `elevada`, `rebaixada` e `rebaixada_fim`, `atencao`, `fundo_fim`, `lateral` e `lateral_fim`; avatar do integrante com cor própria no escuro; o avatar do Geral não é configurável (é o contraste do tema) |
| Desenho, 1.9 (marca branca) | Cor de estado (atenção, erro, sucesso) separada da cor de destaque da marca |
| 04, 4.1 e 03, 6.10 | A "visão do cliente" no CRM é o filtro da própria lista de Conversas, não o seletor do topo (que some no CRM) |
| 04, 7.1 | Comunicado escolhe os destinatários: todos os clientes, segmento do perfil ou clientes escolhidos |
| 04, 4.2 | Na conversa, o campo alterna "Responder" e "Nota interna" (em vez de dois botões); a lateral vira gaveta em telas abaixo de 1536 px |
| 05, 8 | Confiança codificada num tom só em degraus mais textura (vale para qualquer marca branca); termo de ciência e vínculo da extensão como fluxos em gaveta; registrar ausência na Equipe para a capacidade |
| Novo | Ditado no campo do chat (transcrição no servidor em produção); conversa por voz no backlog |
| Fundações 9 / 02, 3.3 | Configurações › Integrantes: lista "faz sozinho" por setor (vem cheia, só se tira), pergunta de promoção, memória do escritório a revisar e modelos publicados numa tela só |
| Fundações 10 | Prévia do tema aplicada só a um recorte da tela, antes de publicar; verificação de contraste por modo |
| 06 (saída) | Encerrar a assinatura na aba Assinatura, com confirmação digitada, exportação e 90 dias de leitura |
| 03, 6.8 e 09 | Financeiro do escritório é módulo lateral com as sete abas do 09 (decisão do usuário, 8/11/2026); as peças (contas a pagar, conciliação, caixa) recebem um titular e servem também ao BPO |
| 03, 6.8 / GES-014 | Campanha de reajuste usa a rentabilidade do Timesheet para propor acima do índice a quem dá prejuízo |
| 03, seções 4 e 5 | Home e abas do Painel em grade de widgets personalizável; o arranjo por usuário e por tela vai em `usuario.preferencias` (03, 4.3), separado para cliente e carteira nas abas |
| 03, seção 6 | Cada aba ganha uma visão de carteira própria (ex.: certificados a vencer, semana por cliente, captura por cliente) |
| Fundações 7 | Arquivos como módulo lateral; um índice único de documentos; visualizador na marca do escritório; subpasta Entregáveis/BPO financeiro na árvore-modelo |
| Novo (plataforma) | Suporte: chat com a equipe da plataforma e assistente de ajuda com limite próprio de 30 perguntas por mês, fora do limite de IA do plano |

## Respostas à sessão mãe (8/11/2026)

**1. Financeiro.** Respondida pelo usuário: o plano adota as sete abas do 09. Feito (Visão geral, Contas a pagar e Conciliação novas; Caixa virou Fluxo de caixa).

**2. Reagrupamentos que o 03 deve refletir.**
- **Início** tem três abas: Assistente (abre aqui), Time e Visão geral (a Home do 03, seção 4).
- **Painel** tem oito abas: Societário, Obrigações, Notas, Fiscal, DP, Contábil, Consultoria, Gestão. **Obrigações** é aba própria: com cliente, a agenda de todas as áreas dele; na carteira, a semana por cliente. Itens da agenda sem setor contábil (geral, Financeiro) caem nela. Gestão é igual com e sem cliente. Toda aba tem a sua visão de carteira.
- O **Painel só existe para quem tem setor contábil** (quem é só do BPO não o vê).
- **Financeiro, Arquivos e BPO** são módulos laterais, não abas do Painel.
- **Seletor de cliente por módulo:** some no CRM, no Financeiro e em Configurações; no BPO lista só as empresas de BPO; no Painel, só as da contabilidade.

**3. Decisões com o usuário que não estavam no PLANO.md nem no README.** Estavam só na conversa e agora estão nos itens 25 a 34 das decisões acima (login no padrão, painel Demonstração com reset, serviços extras visíveis, regras dos orbs em grupo, orb vivo e espelho, botões do Assistente, selo de tempo, integrante Financeiro, Arquivos e visualizador, modo de espera).

**4. O que o wireframe não prova e o plano precisa decidir.**
- **Auditoria do BPO:** a cor de cada empresa vem de motivos fixos de exemplo. Faltam os critérios e os pesos (sincronização, caixa mínimo, vencido sem aprovação, fornecedor novo, modo arquivo) e de quanto em quanto tempo recalcula.
- **Espelho do ERP:** frequência de leitura, quem guarda a credencial, o que fazer quando o ERP não aceita escrita (Nibo e Granatum: a baixa manual conta no SLA?).
- **Lote:** janela fixa (ex.: 9h) ou contínua; o que acontece quando o cartão expira (o wireframe só alerta, nunca paga; falta a cadeia de escalonamento).
- **Alçada:** se a da pessoa e a da empresa divergem, qual vale; delegação quando um dos dois da aprovação reforçada está ausente.
- **M2 e M3:** contrato e responsabilidade do teto delegado; o M3 está só como pedido de aceite.
- **Faturamento do BPO:** honorário e excedente na mesma fatura da contabilidade ou separados (o wireframe manda o excedente para a fatura do escritório).
- **Timesheet no BPO:** as horas do BPO entram como sessões do pacote; a rentabilidade usa um custo-hora fixo. Falta decidir se o custo-hora é por pacote.
- **Mesmo contato, dois pacotes:** o João Batista é sócio na contabilidade e aprovador no BPO pelo mesmo app; falta decidir se o papel pode ser diferente por pacote.
- **Suporte:** a equipe da plataforma não vê dados de clientes; como ela diagnostica um problema (consentimento para ver a tela?).
- **Estado em memória:** a demonstração recomeça ao recarregar; persistência, tempo real entre aparelhos e offline do app não são provados aqui.
- **Blocos do Painel por cliente:** os blocos específicos de cada aba têm os números da Metalúrgica Andrade para todos os clientes.

## BPO

### Time do BPO: um integrante por função (decisão do usuário, 8/11/2026)

- **Por quê:** o integrante BPO único cobria quase as nove abas, contra a ideia do time (escopo estreito, memória e fila próprias). BPO financeiro que cresce se divide por função e segrega quem lança de quem confere.
- **Integrantes:** Contas a Pagar (captura, fornecedor, lote, alçada), Contas a Receber (boletos, cobrança, baixa), Conciliação (extrato, espelho do ERP, sincronização), Gerencial (previsão de caixa, DRE, relatório do mês, fechamento) e o Atendimento.
- **No sistema:** setores de integrante `bpo_pagar`, `bpo_receber`, `bpo_conciliacao`, `bpo_gerencial`; quem é do setor do escritório BPO Financeiro vê os quatro. Cada aba do módulo mostra o integrante da função (Fila e Aprovações: Contas a Pagar; Visão geral, Carteira e Rotinas: Conciliação; Entregas, Volume e Rentabilidade: Gerencial).
- **Aberto:** Contas a Receber ainda tem pouco exemplo (os boletos de convênio da Clínica); falta um fluxo simulado dele.

### Decisões do usuário de 8/11/2026 aplicadas

1. **Fatura do cliente com BPO e contabilidade** (substitui o "um boleto e uma NFS-e"):
   - Uma cobrança só por mês, com cada serviço numa linha (honorário contábil, mensalidade do BPO, excedente).
   - A nota sai por serviço, cada um com a própria tributação (17.19 com ISS de 2%; 17.02 com ISS de 5%).
   - **Quem decide é o layout nacional da NFS-e** (o mesmo na federação toda; segunda rodada de 8/11). Não está confirmado se uma DPS aceita mais de um serviço (NT 007/2026), então o padrão é uma NFS-e por serviço. A chave `nfsePorServico.variosItensNaMesmaNota` liga uma nota com vários itens quando isso for confirmado.
   - Onde aparece:
     - Financeiro › Cobranças: a lista diz "2 serviços, 2 NFS-e"; o detalhe mostra as linhas e as notas.
     - BPO › Volume e faturamento: a linha de cada empresa diz como ela é faturada.
     - App › Financeiro: as linhas, com a NFS-e de cada uma.
2. **Mesmo contato, dois pacotes:**
   - Um só app e um só login. O papel e as áreas valem por serviço contratado e aparecem somados na mesma tela.
   - Conferido para a Padaria (João Batista): o Início mostra junto as pendências da contabilidade, os pagamentos do BPO e a proposta de alçada; a fatura vem com as duas linhas.
   - Loja (Sérgio) e Clínica (Dra. Lívia) seguem a mesma regra.
3. **Suporte:**
   - **Diagnóstico pela Ajuda:**
     - Mostra o estado "Olhando as suas configurações (somente leitura)", com o que está lendo e o que não lê (o que a conta da pessoa não vê).
     - Depois mostra o que achou e um cartão de correção proposta: Aprovar ou Recusar. Nada muda sem a aprovação, e tudo fica registrado.
   - **Compartilhamento de tela, pela equipe:**
     - Pedido prévio, com Deixar ver por 30 min ou Recusar. A equipe só vê, não clica.
     - Enquanto dura, um indicador fixo na tela com Encerrar.
     - O que aconteceu entra na conversa e no Histórico.
4. **Hipóteses adotadas no BPO:**
   - **BPO de uma pessoa:** a conferência fica com a Gestora do escritório ou, na falta, com o cliente na aprovação (botão "Cliente confere"; Clínica e Studio Forma).
   - **Quem altera a alçada de uma empresa** não confere nem aprova pagamento nela; o motivo aparece na linha.
   - **A alteração de alçada** vira proposta, que só vale depois do aceite do cliente no app (cartão "O escritório propôs novas alçadas", com Aceitar ou Recusar).
   - **Alçada:** entre a da pessoa e a da empresa, vale a menor.
   - **Escalonamento do lote:** às 9h; sem resposta em 4 h, lembrete; na véspera, alerta ao responsável e ao titular; vencido, só alerta.
   - **M3** fica fora da primeira versão (desligado na Configuração).
   - **Custo-hora:** ver a segunda rodada abaixo (continua um só, do escritório).

### Decisões do usuário de 8/11/2026, segunda rodada

1. **NFS-e:** "o layout nacional decide" (ver o item 1 acima). O texto da tela diz "regra do layout nacional (a confirmar na NT 007/2026)".
2. **Custo-hora:** continua um só, do escritório, com todos os pacotes.
   - O **BPO virou filtro** em Meu tempo, Equipe e Rentabilidade do Timesheet: "Pacote: Todos | Contábil | BPO". Mostra horas, custo e margem do BPO sem trocar o custo-hora. Em Todos, o cliente com os dois pacotes soma horas e honorários.
   - O **custo-hora por pacote** é extra opcional, desligado por padrão, em Timesheet › Custo-hora. Ligado, as horas do BPO usam o custo da equipe do pacote.
   - A aba Rentabilidade do BPO usa o custo-hora do escritório e leva ao Timesheet com o filtro.
   - **Ajuste nas horas de exemplo do BPO:** as horas mensais caíram. O integrante faz a captura e a conciliação; as pessoas conferem e tratam exceções. Com o custo-hora do escritório (R$ 300), a Loja Bela Vista continua no prejuízo (retrabalho do Bling) e as outras ficam no positivo.
3. **Escalonamento do lote:**
   - A cadeia: janela às 9h (por empresa), cartão ao aprovador; +4 h, lembrete; +8 h ou na abertura do dia útil seguinte, ao substituto cadastrado; na véspera do vencimento mais próximo, alerta ao Gestor do BPO e ao sócio; vencido, só alerta, nunca paga, e a auditoria fica vermelha com "vencido sem aprovação".
   - Na Configuração do BPO aparece como bloco próprio, com abertura, prazos e substituto editáveis por empresa.
   - No cartão do lote aparece como linha do tempo ("Se ninguém responder"), que para quando o cliente responde.
4. **Suporte:**
   - **Perguntas frequentes** por módulo, com busca, antes do assistente (FAQ → assistente → equipe). Não contam no limite. Sem resposta na busca, a pergunta vai ao assistente.
   - **Premissas mantidas:** no máximo 5 leituras por pergunta no diagnóstico (a tela mostra "3 de 5 leituras"), tela compartilhada por até 30 minutos e sem gravação.
5. Custo do diagnóstico e tela do suporte: aprovados.

### A barra lateral da Marina (pergunta de 8/11/2026)

**O que o print mostra:** Marina Teixeira, Gestora só do setor BPO Financeiro, no cenário B (a Contábil Andrade & Lima com o BPO como módulo). A barra tinha Início, CRM, Arquivos, Timesheet e BPO.
- **Sem Financeiro: correto.** Pelas regras de permissão (09, 10.6), o Financeiro do escritório só aparece para o Administrador e para o Gestor com o setor Financeiro. A Marina não tem o setor. O item existe nos dois cenários.
- **Sem Painel: correto** (ela não tem setor contábil). Mas faltava onde ver o cadastro dos clientes. **Mudou:** quem não tem Painel ganha o item **Clientes** no lugar dele, com Cadastro (pacotes de cada cliente, quem atende, ERP, ficha) e Contatos (canal, app, alçada de pagamento). No cenário B, ela vê só os clientes do pacote dela. É o mesmo cadastro do Painel › Societário, sem duplicar.
- **Simetria adotada:** [Painel | BPO] é o trabalho do pacote para o cliente; Financeiro é o da própria empresa (titular escritório); Clientes aparece quando não há Painel. Dentro do BPO, as peças financeiras têm titular empresa cliente.

**Cenário "Só BPO" na demonstração (C1):** o painel Demonstração tem agora "Cenário do escritório: Contábil com BPO / Só BPO".
- **No Só BPO:**
  - não há Painel, e Clientes ocupa o lugar dele para todas as contas;
  - os seletores e listas mostram só as empresas de BPO;
  - os integrantes contábeis saem do Time;
  - a Assinatura mostra o BPO como pacote principal.
- **Fernanda (Administradora) no Só BPO:**
  - vê Início, Clientes, CRM, Arquivos, Timesheet, Financeiro (sete abas, titular escritório), BPO e Configurações;
  - nos Contratos e nas Cobranças, só as seis empresas, com o honorário do BPO;
  - a Loja Bela Vista aparece acima da faixa de lançamentos, a mesma contagem da aba Volume.

**Faturamento:**
- No cenário B, o BPO entrou como item do contrato das empresas que têm os dois pacotes (Padaria, Loja, Clínica). A cobrança é uma só, com os serviços em linhas e a nota por serviço (ver as decisões acima). As empresas só de BPO têm contrato próprio.
- A aba Volume do BPO tem "Faturar no Financeiro" (abre Cobranças), e o excedente vai como extra na fatura única de dezembro.
- **Limitação:** no Só BPO, a Visão geral, o Fluxo de caixa e o Resultado do Financeiro continuam com os números de exemplo do escritório contábil.


**O que foi feito** (módulo lateral do cenário B, frente financeira; detalhe técnico no README):
- Item "BPO" entre Financeiro e Configurações, só com o setor BPO Financeiro e com o módulo ligado em Configurações › Assinatura (bloco "Módulos extras", sem preço).
- Nove abas: Visão geral, Carteira, Fila e pedidos, Rotinas, Aprovações, Entregas e SLA, Volume e faturamento, Rentabilidade e capacidade, Configuração.
- Peças do Financeiro reaproveitadas com titular empresa e o selo do titular na tela; "Abrir no ERP" em cada linha.
- Escritório de demonstração: setor BPO (Marina Teixeira, Gestora; Lucas Prado, Colaborador), integrantes do BPO no Time (um por função), seis empresas (Padaria, Clínica e Loja também contábeis; Mercado Bom Preço, Studio Forma e AutoPeças Rota 9 só de BPO), tarefas do setor, relatório do mês em Arquivos.
- App do cliente: "Pagamentos para aprovar" no Início e, em Mais, Aprovações de pagamento e Fluxo de caixa, só para quem tem alçada de pagamento.

**O que muda no 10:**

| Onde | Mudança |
| --- | --- |
| 5.2 (abas) | Nove abas não cabem com o nome inteiro: a aba mostra o nome curto (Fila, Entregas, Volume, Rentabilidade) e o título da tela, o completo |
| 5.1 e 5.2 | Visão geral abre por "Precisa de decisão" (vermelho antes de amarelo, seis primeiros e "mostrar todas"); com uma empresa escolhida, mostra auditoria, caixa e fluxo dela. Auditoria com cor e rótulo ("em dia", "atenção", "agir hoje"), nunca só cor |
| 5.2 (Carteira) | Cada empresa mostra ERP e sincronização (sincronizado, atrasada, credencial vencida, modo arquivo, livro próprio), caixa contra o mínimo, lotes com o cliente, fila e SLA |
| 3.5 e 3.8 | Conferência interna antes do lote: quem digitou não confere (botão desligado com o motivo); a conta conferida vai para o próximo lote |
| 3.6 e 3.7 | Faixa 1 (até R$ 2 mil, 1 aprovador), faixa 2 (até R$ 20 mil, quem tem alçada para o total), acima: aprovação reforçada com duas pessoas marcadas na ficha. Alçada da pessoa fica no contato da ficha (o mesmo do CRM e do app). Mudança de alçada vai para o aceite do cliente no app |
| 3.6 | Cartão do app: Aprovar, Editar e aprovar (tirar contas do lote), Recusar com motivo. Registra quem e quando; avisa a equipe no sino. No M1, depois de aprovar, "Já liberei no banco" |
| B3 | Invariante na tela de Aprovações e no app: nenhum pagamento sem aprovação humana registrada; vencido sem aprovação só gera alerta |
| 3.0 e 5.2 (Configuração) | Por empresa: ERP e modo (Conta Azul, Omie, Bling por API; Nibo, Granatum por arquivo; sem ERP, livro próprio), escopo da credencial, religar ou pedir nova autorização, bancos por Open Finance, modo de pagamento M1/M2/M3 (M3 só com teto delegado aceito), alçadas e janela |
| 2 (cruzamentos) | Seletor de cliente por pacote; empresa só de BPO não recebe documentos nem áreas da contabilidade no app; calendário único com uma cor por pacote (obrigações e rotinas do BPO juntas) |
| 4.2 | Excedente de lançamentos acima da faixa vira extra na fatura do escritório, com o ok de uma pessoa |
| 5.4 | Colaborador: seis abas (sem Volume, Rentabilidade e Configuração). Gestor do BPO: oito, edita a Configuração, sem margem. Administrador: nove. Gestor do BPO que também gere Gestão ou Financeiro vê Rentabilidade |
| Fundações 7 | Subpasta "Entregáveis/BPO financeiro" na árvore-modelo, visível a quem aprova pagamentos |

## QA e demonstração viva (8/11/2026)

- **QA de layout:**
  - Todas as telas de conteúdo têm agora o mesmo contêiner e o mesmo topo; Configurações, Configuração do BPO, Tema e Visão geral estavam fora. A medição está em `scripts/geometria-abas.cjs`.
  - Abas e pílulas reservam a largura do negrito: trocar de aba não empurra as vizinhas.
  - Não há estouro horizontal em 390 px nem em 1280 px (`scripts/estouro-horizontal.cjs`).
- **Orb sem piscar ao trocar de aba:** guarda fase, olhar, expressão e sono ao sair; o próximo retoma e desenha já no primeiro quadro. Nenhum orb roda fora da tela.
- **Sessão dinâmica:** o que se faz fica feito até sair do sistema, e as telas que leem a mesma informação reagem.
- **Trabalho simulado:** os integrantes fazem o que se pede, com tempos realistas (pensar, etapas, passagem animada, mensagem ao cliente entregue e lida, cliente digitando). O detalhe está no README, seção "Demonstração viva".
- **Assistente que acompanha (8/11/2026):** o pedido ao time mostra no chat do Assistente cada parte: pedido, trabalho do integrante (que fica concluído ali), retorno ao Assistente, passagem ao próximo e o fechamento com os dados que importam. Proposta para o 02, 9.1: o Geral não só encaminha; ele acompanha o pedido até o fim na mesma conversa e fecha com o resultado.
- **Perguntas sobre a lei no Assistente:** duas, com o raciocínio da cascata em etapas e a resposta no modelo de `legal.consultar` (07, 3.2). O texto legal citado é o da LC 123/2006 (arts. 13-A, 16 § 2º, 18 §§ 5º-J e 5º-M, 20 §§ 1º e 1º-A), com reticências onde foi cortado.
- **Integrantes sem "foto":** estado, fila, cartões pendentes e "fazendo agora" saem da sessão; o time já abre trabalhando, em rotinas que terminam. Aviso de algo que a pessoa já está vendo não vira toast.

## Próximos passos

1. Escritório responde no CRM e o cliente vê no app em tempo real (já funciona pela loja); falta push e o estado offline do PWA.
2. Calendário completo da Home (dia, semana, mês, arrastar para reprogramar o prazo interno); quando chegar, avaliar a troca para React Aria.
3. Roteamento por URL (aba + cliente), pedido no 03, seção 2.3.

## Backlog

- Conversa por voz.
- Transcrição do ditado no servidor.
- Logotipo do sistema (branding, a cargo do usuário).

## Pendências com o usuário

- Licença da fonte para uso web: confirmada pelo usuário.
- ~~Arranjo padrão dos widgets, as oito abas do Painel e o Timesheet~~: **aprovados** pelo usuário em 8/11/2026 ("parecem bons, pode fechar").
- Revisar o módulo BPO e as aprovações no app do cliente.
