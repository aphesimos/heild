# Cruzamento: painel do Leandro × plano da plataforma

**Data:** 9/11/2026 · **Pedido do Leandro:** "quando cruzar com o levantamento, me fala o que você marcou como 'já temos pronto' e o que ficou faltando".

**O que foi lido.** O código do painel em Google Apps Script (versão 1.23 do painel e 1.7 da Renata), com dados trocados por fictícios: os doze arquivos do projeto principal e os dois projetos à parte (página pública de entregas e coletor de extratos). Do nosso lado: Desenho do Sistema (seções 1, 2 e 5), Plano da Plataforma (DA-01, DA-02, DA-02.1, seção 4 com as prioridades P1/P2/P3 e seção 8 de triagem), subplanos 01 a 10 por busca de termos, a revisão de consistência (00) e as fichas da pesquisa D5 (contábil). A primeira versão deste documento saiu só do código. Depois chegou o **Mapa de construção do Painel** (PDF de 12 páginas, 6/11/2026): o que ele acrescenta ou corrige está na seção 7, com a página citada, e as correções principais já entraram no texto (marcadas "mapa, p. X"). O código não foi copiado para o repositório e nada foi executado.

**Aviso de vocabulário.** "Já temos pronto", do nosso lado, quer dizer **já está planejado** num subplano. A plataforma ainda não tem código: o painel do Leandro roda em produção e o nosso existe no papel. Por isso a tabela usa "JÁ TEMOS PLANEJADO", e não "pronto".

---

## Resumo em 10 linhas

1. O painel do Leandro é muito mais que um checklist: são onze módulos, um agente de atendimento (a Renata) e dois projetos auxiliares, tudo sobre Google Drive, planilha e Gmail.
2. **Já planejado e com cobertura boa:** cadastro e sócios, checklist de documentos do mês, cobrança de pendências, obrigações anuais, ex-clientes, coletor de extratos por e-mail, índice de documentos, certidões automáticas, entregas com prova de abertura, controle de custo da IA e o próprio atendimento por IA.
3. **Parcial:** Kanban por competência, informe financeiro ao cliente, central de alertas, DP lido pela pasta da folha, painel vivo para o cliente e as fases de teste da IA.
4. **Lacuna mais séria:** o controle mensal de distribuição de lucros com a retenção de 10% acima de R$ 50 mil (Lei 15.270/2025). Ele já roda; no nosso plano está como P3 e fase 4.
5. **Também falta:** o fluxo de assinatura do contador com conferência da assinatura dentro do PDF, o relatório de diagnóstico ("raio-X") das pastas na implantação (o mapeamento da árvore já está nas Fundações 7.3) e a leitura viva da Acessórias durante a transição.
6. **O que mais surpreende:** a Renata já tem quase tudo o que o subplano 04 desenha (contato autorizado, escalonamento por setor, "nunca promete prazo", correção do analista vira regra), com fases de simulação e rascunho que nós não escrevemos.
7. As travas da Acessórias (só consulta, CNPJ só do cadastro, setor da pessoa) são o nosso princípio de "ferramentas tipadas e escopo" já aplicado na prática.
8. As regras para descobrir o mês de um documento (nome × pasta × conteúdo) valem ouro e não estão escritas no nosso plano.
9. **Não reaproveitar:** planilha como banco, chave no link do painel, execução com a conta do dono, acesso amplo ao Drive e ao Gmail, links de entrega sem validade.
10. **Migração sugerida:** Drive como espelho e planilhas como carga inicial, com o painel antigo em paralelo por dois fechamentos, módulo por módulo, deixando a Renata e a Acessórias por último.

---

## 1. Inventário do painel do Leandro, por módulo

Cada módulo abaixo diz o que faz, onde guarda os dados e as regras de negócio que estão no código. "Aba" é a aba da planilha base; as que começam com sublinhado ("_") ficam ocultas.

### 1.1 Núcleo: cadastro, configuração e varredura (Código.gs)

- **Faz:** varre a pasta de cada cliente no Drive, lê nomes de arquivos, nomes de pastas e, quando precisa, o conteúdo (PDF e planilhas convertidos), e monta o checklist do mês e das obrigações anuais. Roda três vezes ao dia (7h, 13h e 19h, configurável) e por botão "Atualizar agora".
- **Abas:** Config (parâmetros), Cadastro, Anotações, Resumo, Checklist mensal, Anuais, Arquivos, Alertas, Pendências, Sócios, Equipe, e as ocultas de trabalho (_fila, _res, _conteudo, _painel).
- **Cadastro (colunas):** cliente (nome da pasta), situação, regime, responsável, contas esperadas, "não se aplica", WhatsApp, observação, ID da pasta, e-mail, CNPJ, início no regime, data de saída, código e validade do certificado.
- **Situações:** Ativo, Suspenso, Inativo, Ex-cliente, MEI, Sem movimento, Não acompanhar. **Regimes:** MEI, Simples Nacional, Lucro Presumido, Lucro Real, Imune/Isenta. Sem regime digitado, o sistema infere pelas pastas (tem DEFIS e não ECD/ECF: Simples).
- **Sócios (colunas):** cliente, CNPJ, sócio, participação, administrador, e-mail, telefone, contato principal, última alteração contratual. A Renata acrescenta "tipo de contato" e "pode pedir".
- **Regras de documento:** detecta o tipo (extrato, aplicação, fatura de cartão, recebíveis, planilha financeira), o banco e os meses. O mês vence no **dia 10 do mês seguinte**; o status de cada mês é: ok, recebido fora do Drive, não se aplica, falta, no prazo ou futuro. A cobertura dos extratos dá a fase do cliente: **Completo** (100%), **Parcial** (50% ou mais), **Inicial** (menos de 50%), além de "Sem pasta contábil", "Sem pasta de movimento", "Movimento do ano vazio" e "Sem extratos".
- **Mês de um arquivo:** regras de nome × pasta × conteúdo, detalhadas na seção 3.1.
- **Anotações** mudam o status sem mexer no Drive: Cobrado, Recebido fora do Drive, Não se aplica, Reabrir, Observação, Competência confirmada ou rejeitada, Status Kanban.
- **Obrigações anuais:** Demonstrações, ECD, ECF, DEFIS e Informe de rendimentos do ano anterior, e REINF por trimestre (falta a partir do **dia 15** do mês seguinte ao trimestre). O regime marca o que não se aplica.
- **Manutenção:** pastas incompletas, arquivos repetidos, criar pastas de mês que faltam, distribuir responsáveis, completar contatos.

### 1.2 Interface (Painel.html)

Uma página com as abas Contábil, Fiscal, Departamento Pessoal, Legalização, Manutenção, Certificados, Ex-clientes, Relatórios e Atendimento Vivo. Na Contábil: filtros, "Minha fila" (meus clientes, do maior atraso para o menor), visão em **Tabela** ou **Kanban** (**Pendente, Em andamento, Conferência, Concluído**, por competência, automático ou movido à mão), CSV e "cobrar pendentes por e-mail".

### 1.3 Cobrança de documentos e informe financeiro (Cobranca.gs)

- **Cobrança:** mensagem de WhatsApp a partir de modelo (abre o WhatsApp com o texto pronto) e e-mail com PDF de pendências no padrão visual do escritório. O e-mail sai pela conta dona do script, mas **em nome de quem está logado** (nome, resposta e cópia para a pessoa, assinatura dela). Registra "Cobrado" e a data da última cobrança.
- **Informe financeiro:** lê balancetes e DREs exportados do Contmatic na pasta "Demonstrações" (ano atual e anterior), monta o acumulado do ano com o mês a mês, compara com o histórico e gera um PDF com placar de 0 a 100, "conquistas" e comentário automático em linguagem leiga (o comentário é por regra, não por IA). Antes de enviar, confere: faturamento zerado, lucro maior que o faturamento, outras receitas acima de 20% do faturamento e balancete que não fecha.

### 1.4 Central de alertas (Alertas.gs)

Certificados, obrigações anuais em falta e agenda tributária, nas cores **vermelho** (vencido), **laranja** (até 7 dias) e **amarelo** (até 30 dias). A agenda vem da **Agenda Tributária da LegisWeb**, colada no painel (sem API), cruzada com o regime do cliente por uma tabela de regras e filtrada por uma lista de setores que o escritório não atende. Ex-clientes ficam numa pasta própria e saem dos totais. E-mail diário às 7h.

### 1.5 Departamentos: Fiscal, Pessoal e Legalização (Departamentos.gs e DP.gs)

- **Só leitura** do Drive; rotina às 5h, em lotes.
- **Fiscal:** pastas de cada analista fiscal, por cliente, ano e mês, com uma tabela de itens e prazos (SPED Fiscal e Contribuições, PGDAS-D, DAS, ICMS, PIS/COFINS, IPI, IRPJ/CSLL trimestral, ISS, DCTFWeb MIT, DIFAL, carta de faturamento). Guias "eventuais" (só existem quando há imposto) não contam como falta. Se a agenda da LegisWeb do mês foi importada, vale a data dela quando está a até 12 dias da tabela.
- **Pessoal:** pasta central da folha, por ano e mês, com arquivos de vários clientes misturados, ligados ao cliente pelo CNPJ, pelo nome, pela pasta ou por uma aba "De-para". Itens: 13º, folha e pró-labore (dia 7), FGTS e INSS (20), DCTFWeb (último dia). No **dia 15**, a rotina **move** as pastas da competência anterior para dentro do ano (nunca apaga).
- **Legalização:** pastas por órgão; controla só parcelamentos e certificado (validade lida do nome do arquivo .pfx).

### 1.6 Raio-X dos departamentos (RaioX.gs)

Lê a pasta de cada cliente e mostra quais departamentos existem, como estão organizados, que pastas de órgão há na raiz (PGFN, Junta, Sefaz, Receita, Prefeitura, Bombeiros, Vigilância, conselhos de classe...) e quais padrões de nome se repetem. Grava quatro abas de diagnóstico. Só leitura.

### 1.7 Distribuição de lucros (DL.gs)

- **Faz:** é o controle oficial de distribuição de lucros para a EFD-Reinf desde 08/2026. Lê os extratos já indexados (OFX, PDF, CSV, planilha) às 6h, 12h e 17h e classifica as saídas.
- **Tipos:** **DL** (lucro), **Pró-labore**, **Devolução** (entrada vinda do sócio), **Suspeita** e **Ignorada**.
- **Regras:** saída PIX/TED ao sócio (nome ou CPF) é DL; valor igual ao **líquido do pró-labore lido do holerite** (tolerância de 5 centavos) é pró-labore; fatura, reembolso, saída que não é PIX/TED, familiar com o mesmo sobrenome, CNPJ da própria empresa ou extrato de outra empresa viram "Suspeita". A equipe decide e pode criar regra por favorecido: "sempre DL", "nunca DL", "pró-labore fixo".
- **Limite:** soma por cliente, CPF e mês; acima de **R$ 50 mil**, um e-mail ao responsável com o total, o IRRF de 10% e o vencimento do DARF (último dia útil do mês seguinte, sem feriados).
- **REINF:** marcar o trimestre como enviado (data e protocolo) **trava** as linhas; lançamento novo depois disso vira "Complementar"; exportação do trimestre em CSV com empresa, CNPJ, sócio, CPF, valor, mês e status (mapa, p. 9).
- **Abas:** _dl (23 colunas, com CPF, valor, tipo, status, protocolo, travado, favorecido), _dl_regras e _dl_arq.

### 1.8 Entregas com farol (Entregas.gs e o projeto "Entregas")

- Cada envio (um documento para um contato) é uma linha em _entregas (22 colunas, com canal, destino, arquivo, prazo, status, aberturas, baixado em e falha).
- **Status:** Enviado, Aberto, Falhou, Confirmado, Cancelado. **Farol:** verde (aberto ou confirmado pela equipe), amarelo (enviado e dentro do prazo), vermelho (passou do prazo sem abertura ou e-mail voltou). Prazo padrão: **3 dias úteis** (só fim de semana é descontado).
- De hora em hora, lê os e-mails de "não entregue" e marca a entrega como Falhou.
- **Página pública:** projeto separado, aberto a qualquer pessoa sem login. O link carrega um identificador aleatório; a página mostra o documento, registra a abertura e o download (data e hora, contador de aberturas) e entrega o arquivo (até 30 MB). Link cancelado mostra "indisponível".

### 1.9 Coletor de extratos (projeto separado)

Roda na conta de e-mail da analista contábil às 5h40, 11h40 e 16h40 (antes das leituras de DL). Procura e-mails das últimas 48 horas com anexo, vindos de um e-mail cadastrado do cliente (Cadastro ou Sócios) **ou** com "extrato" ou "movimentação" no assunto (nesse caso tenta achar o nome do cliente no assunto). Ignora notas, boletos, holerites e recibos. Salva na pasta do mês (mês tirado do extrato ou, sem isso, o mês anterior ao e-mail), não duplica e marca o e-mail com um marcador. Registra em _coletor.

### 1.10 Renata, a agente de atendimento (Renata.gs)

- **O que é:** assistente virtual do Departamento Contábil, pela API da Anthropic (modelo configurável, Sonnet por padrão), que atende clientes por WhatsApp e a equipe em "modo interno".
- **Fases:** **simulação** (a equipe faz o papel do cliente; nada é gravado nas pastas), **piloto em rascunho** (o analista cola a mensagem real, a Renata prepara, o analista aprova ou edita e envia pelo WhatsApp com o texto pronto; só empresas da lista do piloto) e **modo interno** (a equipe conversa com ela sobre a carteira toda). Pelo código, **ela não está ligada a uma API de WhatsApp**: o envio é manual, por link que abre o WhatsApp.
- **Ferramentas:** 19 para o cliente (empresa, pendências, buscar e ler arquivos, verificar e pedir assinatura, enviar arquivo, números financeiros, gráfico, relatório, arquivar o que o cliente mandou, escalar, encaminhar a outro setor, Acessórias, ficha, registro, painel vivo e, se ligada, certidão) e 8 internas (panorama de envios, escalonamentos, atendimentos do dia, situação de um cliente, três consultas à Acessórias e o manual do Contmatic).
- **Regras e limites:** só contato autorizado; contato de várias empresas diz qual; busca só na pasta da empresa; CNPJ do arquivo confere; nunca promete prazo, inventa número, recomenda investimento, pede senha ou finge ser pessoa; erro técnico nunca aparece ao cliente. Até 12 voltas de ferramentas por mensagem; teto mensal (US$ 40) e teto do índice de documentos (US$ 5); uso registrado por conversa.
- **Assinatura:** Balanço, DRE, Balancete e relatórios só saem assinados pelo contador. Ela confere a assinatura **dentro do PDF**, manda para a pasta "para assinar", e um gatilho de 10 em 10 minutos acha o assinado e envia sozinho.
- **Aprendizado e fichas:** a correção do analista no rascunho pode virar regra na ficha do cliente ou nas regras gerais. Fichas em Google Docs, com uma seção "uso interno" que nunca vai ao cliente.
- **Índice de documentos:** tipo reconhecido pelo conteúdo por frases fixas; o modelo só entra quando nenhuma bate.
- **Acessórias:** consulta pelo servidor MCP da Acessórias com três travas no código: só consulta; CNPJ só do cadastro; cada pessoa da equipe vê só o próprio setor (folha só para sócio ou financeiro).
- **Certidões:** Infosimples ou Serpro; reaproveita a válida da pasta; teto mensal; **nunca comenta débito** com o cliente e avisa a Legalização.
- **Registros:** abas Conversas, Assinaturas, Escalonamentos, Envios, Atendimentos, Bastidores (entrada e saída de cada ferramenta), Acessórias e Uso da API. Doze cenários de teste prontos.

### 1.11 Utilitários (Sem título.gs)

Um leitor próprio de arquivos ZIP, usado quando o do Google falha (ZIPs do Windows, nomes com acento fora do padrão).

---

## 2. Tabela principal: o painel dele × o nosso plano

Legenda: **PLANEJADO** = JÁ TEMOS PLANEJADO; **PARCIAL**; **FALTA** = FALTA NO PLANO; **SÓ DELE** = ELE FAZ E NÃO PLANEJAMOS COMO PRODUTO.

| Função do painel dele | O que faz | Status | Onde está no nosso plano | O que falta |
| --- | --- | --- | --- | --- |
| Cadastro de clientes | Situação, regime, responsável, contatos, CNPJ, início no regime, saída, certificado | PLANEJADO | Desenho 1.2; Plano 4.1 (P1); 03, 6.1 (ficha e perfil temporal) | Nada de conceito. Levar as situações dele ("Não acompanhar", "Sem movimento") como estados do cliente |
| Sócios e contatos autorizados | Participação, administrador, contato principal, "pode pedir" | PLANEJADO | 03, 6.1 (pessoas e identidades); 04, 5.4 (contatos com papéis) | Campo "pode pedir" (que assuntos o contato pode pedir) a conferir na ficha |
| Checklist de documentos do mês | Varre o Drive, detecta tipo, banco e mês; status por mês; fase Completo/Parcial/Inicial | PLANEJADO | Plano 4.6 (P1); 03, 6.6 (o que deve chegar, triagem e extratos); Desenho 1.4 (Drive como espelho) | As regras para descobrir o mês (nome × pasta × conteúdo, meses futuros, mais de 3 meses a conferir) e as "contas esperadas" por banco não estão escritas |
| Anotações que mudam status | Recebido fora do Drive, não se aplica, reabrir, competência confirmada ou rejeitada | PARCIAL | 03, 4.1 e 6.6 (marcar recebida, confirmar classificação) | "Não se aplica" por item e mês e "reabrir" não aparecem como ações nomeadas |
| Kanban por competência e "Minha fila" | Pendente, Em andamento, Conferência, Concluído; meus clientes por atraso | PARCIAL | 03, 6.6 (etapas do fechamento; clientes por etapa e analista) | Busquei "Kanban" e "quadro" no 03: não há visão em colunas do fechamento; "Minha fila" equivale a filtro por responsável |
| Obrigações anuais | Demonstrações, ECD, ECF, DEFIS, informe, REINF trimestral, "não se aplica" pelo regime | PLANEJADO | Plano 4.2 (P1); 03, 6.2 (calendário do perfil × regras) | Nada; a tabela de regime × obrigação dele serve de teste |
| Cobrança de documentos | WhatsApp por modelo; e-mail com PDF em nome de quem está logado | PLANEJADO | 04, 7.2 (régua de documentos D0, D+3, D+7, D+10, D+15); 03, 4.1 (botão cobrar) | O PDF de pendências com timbre não aparece entre os modelos de documento; "cobrança" no 09 é de honorários, não confundir |
| Informe financeiro ao cliente | PDF com acumulado, placar 0–100, conquistas, comentário leigo, travas de conferência | PARCIAL | Plano 4.6 (P2); 03, 6.6 (relatórios ao cliente) | Leitura do balancete do Contmatic, o placar e as **travas antes de enviar** não estão no plano |
| Central de alertas e e-mail diário | Certificados (30 e 7 dias), obrigações em falta, agenda | PARCIAL | 03, 4.1 (avisos); 04, 7.2 (régua do certificado D-30, D-15, D-5); Desenho 1.7 (notificações) | Nada grave; a escala vermelho/laranja/amarelo pode ser o padrão |
| Agenda tributária da LegisWeb | Colada à mão; obrigação × regime; setores não atendidos | PLANEJADO (de outro jeito) | Plano 4.2; 03, 6.2: o calendário sai da base legal | Não importar LegisWeb. A lista de setores que o escritório não atende vira configuração do escritório |
| Ex-clientes | Pasta própria, data de saída, fora dos totais | PLANEJADO | 03, 8.3 (tela de saída); Plano 4.1 (offboarding, P3) | Nada |
| Manutenção do checklist | Pastas incompletas, repetidos, criar pastas de mês | PLANEJADO | Fundações (duplicata detectada pela impressão digital do arquivo; árvore-modelo de pastas, 7.8) | "Distribuir responsáveis" e "completar contatos" em lote podem virar ações da carteira |
| Fiscal pelas pastas | Itens com prazo (SPED, PGDAS, DAS, ICMS, ISS, MIT...), guias eventuais | PLANEJADO (outra fonte) | 03, 6.2 e 6.4 (comprovação por recibo capturado ou anexado) | Usar a presença do arquivo no Drive como evidência na transição; a tabela de prazos dele vira teste |
| DP pela pasta da folha | Itens com prazo; liga arquivo ao cliente; move pastas no dia 15 | PARCIAL | 03, 6.5 (guias e holerites); Fundações (classificar documento) | Ligar arquivo de vários clientes ao cliente certo (o "De-para"). **Mover pastas no Drive vai contra a nossa regra** (espelho só leitura) |
| Legalização e certificado pelo nome | Parcelamentos; validade do .pfx pelo nome do arquivo | PLANEJADO (melhor) | 03, 6.1 (certificados, legalização); 06 (validade lida do próprio certificado no cofre) | Nada; o truque do nome do arquivo não é necessário com cofre |
| Raio-X dos departamentos | Diagnóstico da árvore de pastas por cliente e órgão (o mapa, p. 5, o chama de "visão consolidada do cliente, a detalhar") | PARCIAL (corrigido) | Fundações 7.3 já propõe o mapeamento da árvore na conexão (pasta com CNPJ vira cliente, ano, competência; o resto vai para mapeamento manual); 03, 11.2 tem a tabela "Árvore do Drive dele" | Falta o **relatório de diagnóstico** antes de ligar (departamentos, órgãos, fora do padrão, pastas sem cliente) e o aviso contínuo do que sai do padrão |
| Distribuição de lucros e IRRF | Classifica saídas, compara com o pró-labore do holerite, soma acima de R$ 50 mil, avisa, trava após o REINF | PARCIAL (muito atrasado) | Plano 4.6 (P3, "simulações"); D5 (CTB-033 a 035); 07 (cálculos 17 e 18, fase 4); 03, 6.6 ("fica para depois", fase 4) | **Controle mensal na fase 1 ou 2**, não fase 4. Classificador, regras por favorecido, trava do REINF e exportação |
| Coletor de extratos por e-mail | Lê a caixa, acha o cliente, salva na pasta do mês | PLANEJADO | 08, 7.x (conector de e-mail, anexos viram documentos); 04, 8.1 (documento recebido) | Regras dele: só remetente cadastrado, ignorar nota e boleto, mês pelo extrato |
| Entregas com farol | Registro de envio, prazo em dias úteis, verde/amarelo/vermelho | PLANEJADO | 06, 5.2 (aberto, baixado, confirmado, com hash); Fundações (estado da entrega); 06, métricas ("guia não aberta a 2 dias do vencimento") | Busquei "bounce", "devolvido", "não entregue": não há detecção de e-mail que voltou; o "prazo combinado" por entrega também não |
| Página pública de entregas | Link sem login; registra abertura e download | PLANEJADO (diferente) | 06, 5.4 (link com validade de 7 dias, máximo 30, senha opcional, acesso registrado) | Nada; o nosso é mais seguro. Manter os links antigos até expirarem (seção 6) |
| Acessórias como fonte | Entregas, alterações, processos, com três travas | PARCIAL | 08 (Acessórias "a substituir", conector de migração usado uma vez) | Leitura contínua enquanto o escritório ainda usa a Acessórias |
| Certidões automáticas | Infosimples/Serpro, reaproveita válida, teto, não comenta débito | PLANEJADO | 08, 5.4 (agregador; teto por conexão); 03, 6.4; 06 (serviço Certidões) | Duas regras dele para levar: reaproveitar certidão válida e nunca explicar débito ao cliente |
| Renata: atendimento ao cliente | WhatsApp com ferramentas, escalonamento por setor, registro | PLANEJADO | 04, 8 (IA no CRM, "o que a IA nunca faz"); 02 (time de agentes); 06 (integrante de Atendimento) | Ligação oficial com o WhatsApp é nossa (04, 3); dele é manual |
| Fases simulação → rascunho → real | Testes com a equipe, lista de clientes do piloto | PARCIAL | 02, 3.3 (promoção de "prepara" para "faz sozinho"); 04, 8.1 (categorias liberadas) | Busquei "simulação", "modo teste": não há modo de simulação nem lista de clientes-piloto para a IA |
| Assinatura do contador | Confere a assinatura no PDF; fila para assinar; envio automático quando volta | FALTA | Só "demonstrações assinadas" no 03, 6.6; 06, 5.5 trata da assinatura do cliente | Fluxo completo: pedido, fila, conferência do assinante no PDF, envio automático |
| Fichas e aprendizado | Ficha por cliente com parte interna; correção vira regra | PLANEJADO | 02, 5 (memória em três camadas); 04, 8.2 (respostas aprovadas, pares antes/depois) | Nada de conceito |
| Índice de documentos por conteúdo | Frases fixas primeiro, IA só de reserva, CNPJ confere | PLANEJADO | Desenho 1.4; Fundações (classificar documento); 04, 8.1 | A conferência "CNPJ do documento = CNPJ do cliente" como trava antes de enviar |
| Painel vivo para o cliente | Página com caixas (faturamento, resultado, impostos...) por pedido | PARCIAL | 06, 5.3 (resumo do mês); 03, 6.6 (relatórios) | Gerar por pedido, com fonte e período em cada número |
| Manual do Contmatic | Procedimentos ditados à Renata; nunca senha | SÓ DELE | Nada específico; 02, 5 (memória do setor) chega perto | Vira recurso genérico: "manual de procedimentos do escritório" por sistema e setor |
| Controle de custo da IA | Teto mensal, preço por token, uso por conversa, cache | PLANEJADO | 02, 12.2 e 13 (custos e loops); 08 (teto por conexão) | Nada |
| Acesso ao painel | Chave no link e lista de e-mails; setor na aba Equipe | PLANEJADO (melhor) | Fundações (contas, papéis, escopo); DA-01 (separação por escritório) | Nada; não reaproveitar o modelo dele |
| Relatórios por departamento | Visão geral, mapa mês a mês | PLANEJADO | 03, 5 (bloco G, relatórios da aba); 03, 2.4 (Gestão consolida) | Nada |
| Fila do analista | Escalonamentos, assinaturas pendentes, rascunhos, envios | PLANEJADO | 02, 9.3 (cartões); Fundações (aprovações); 04, 4.4 e 4.6 (status e SLA) | Nada |
| Leitor de ZIP próprio | Abre ZIP que o Google não abre | SÓ DELE | Não se aplica | Só vira caso de teste: ZIP do Windows com nome acentuado |

**Contagem:** 34 funções; 21 já planejadas (algumas por outra fonte), 10 parciais (entre elas a distribuição de lucros, que está no plano mas na fase errada, e o Raio-X, reclassificado depois do mapa), 1 falta clara (assinatura do contador) e 2 só dele. A lista de decisão para o Enzo está em [Lista_de_Decisao_Painel_do_Leandro.md](Lista_de_Decisao_Painel_do_Leandro.md).

---

## 3. Lições e regras para reaproveitar (e o que não reaproveitar)

### 3.1 Vale reaproveitar como regra de negócio

1. **Regras de competência do documento.** Mês futuro nunca conta; pasta de mês manda quando o arquivo cobre vários meses; mais de três meses vai para "a conferir"; divergência entre nome e pasta vira aviso; a decisão da equipe (confirmar ou rejeitar) fica gravada e vence a leitura automática. Proposta: virar regras do `documento.classificar` no pacote contábil, com testes tirados dos casos dele.
2. **Prazo do cliente para mandar documentos:** dia 10 do mês seguinte, configurável. "No prazo" é diferente de "falta". Isso evita cobrar cedo demais.
3. **Fases do cliente pelo percentual de cobertura** (Completo, Parcial, Inicial) e os estados de estrutura (sem pasta, movimento vazio). São leitura rápida para a carteira.
4. **Colunas do Kanban** (Pendente, Em andamento, Conferência, Concluído), com o status automático que a pessoa pode sobrescrever. Cabe como visão do bloco "Fechamento" na aba Contábil.
5. **Guias eventuais não são pendência.** ICMS, PIS/COFINS, ISS e outras só aparecem quando o arquivo existe. A nossa geração de calendário precisa da mesma distinção (obrigação que pode não existir no mês).
6. **Tabela de prazos por item** (Fiscal e DP), com a tolerância de 12 dias para aceitar a data de uma agenda externa. Serve para testar o nosso calendário derivado da base legal.
7. **Distribuição de lucros:** a ordem das regras da seção 1.7, as regras por favorecido, a soma por CPF e mês, o aviso único, a trava depois do REINF e o "Complementar". É o desenho mais maduro que temos para a ficha CTB-034.
8. **Entregas:** os cinco status, o farol com prazo combinado em dias úteis e a detecção de e-mail devolvido. Somam à nossa prova de entrega.
9. **Travas antes de enviar relatório** (as do informe financeiro), valendo para qualquer relatório que a IA gerar.
10. **Renata: regras de conduta.** Quase todas já estão no 04, 8.4; acrescentam a conferência do CNPJ do arquivo antes de enviar e o "nunca comentar débito de certidão".
11. **Travas da Acessórias:** só consulta, CNPJ só do cadastro, setor da pessoa. É o modelo para qualquer conector que a IA usar.
12. **Fases de implantação da IA:** simulação com a equipe, piloto em rascunho com lista de empresas, depois produção. E os doze cenários de teste da Renata, que viram parte da nossa avaliação.
13. **Correção vira regra, com escopo:** na ficha do cliente ou nas regras gerais, com data e quem corrigiu.
14. **IA como reserva, não como primeira opção.** O índice de documentos usa frases fixas e só chama o modelo quando nada bate, com teto próprio. Mesma ideia do nosso "modelo de classificação" barato.
15. **E-mail em nome de quem está logado** (nome, resposta, cópia e assinatura da pessoa), mesmo saindo de uma conta central. Bate com o nosso remetente do tema por setor.
16. **Lista de setores que o escritório não atende**, para não poluir a agenda. Vira configuração do escritório no pacote contábil.

### 3.2 Contornos do Apps Script: entender, não copiar

Ele contornou limites reais do Google: cada execução para em 4,5 minutos (o limite é 6) e agenda a continuação; clientes são lidos em lotes; o texto de PDF convertido fica guardado e só é relido se o arquivo mudou; chamadas ao Drive e à IA são repetidas até 4 vezes com espera crescente; travas evitam duas rotinas gravando ao mesmo tempo; há tetos de 4.000 itens por cliente e 15 MB por arquivo. Na plataforma, isso vira fila de trabalho e conector do Drive com aviso de mudança (08, 7.8). A lição que fica: a leitura de PDF é o gargalo, e vale guardar o texto extraído.

### 3.3 O que NÃO reaproveitar

- **Planilha como banco de dados.** As abas ocultas com JSON, o "estado" em propriedades do script e a busca de linha por texto. No nosso desenho, os dados ficam no banco e o Drive é só arquivo (Desenho 1.4).
- **Chaves e tokens em propriedades do script**, acessíveis a quem edita o projeto. Nosso lugar é o cofre de credenciais (08).
- **Execução com a conta do dono e acesso amplo** ao Drive, ao Gmail e a todos os drives compartilhados. Nosso conector pede escopo só de arquivos e só lê (08, 7.8).
- **Acesso ao painel por chave no link.** Substituído por login, papéis e separação por escritório (Fundações; DA-01).
- **Mover pastas no Drive do cliente** (rotina do DP no dia 15). Nossa regra é espelho só leitura.
- **Links de entrega sem validade.**
- **Nomes do escritório e IDs fixos no código** (o nome "Requinte", e-mails da equipe, mapa de setores por e-mail). Na plataforma, tudo isso é configuração do escritório (DA-02, regra 1).
- **Importar a agenda colando a página da LegisWeb.** Nosso calendário sai da base legal.
- **Dias úteis sem feriados.** Os prazos dele só descontam fim de semana; o nosso cálculo precisa do calendário de feriados.
- **Verificação de assinatura por nome.** Serve para triagem; não é prova (ver 4.6).

---

## 4. Riscos e pontos de atenção que o código mostra

### 4.1 Acesso ao painel

**O mapa contradiz o código aqui.** O mapa (p. 10) descreve três camadas: login com conta Google do domínio, lista de e-mails e chave no link. Já o manifesto exportado junto com o código diz que o painel é publicado para "qualquer pessoa" e roda com a conta de quem publicou. Pode ser que a publicação real esteja restrita ao domínio e o arquivo exportado não; **vale o Leandro confirmar**. Se valer o manifesto, a proteção é a chave no link. Pelo que o código mostra, a lista de e-mails permitidos só barra quando o e-mail do visitante é conhecido; se o Google não informar o e-mail (o que é comum nesse tipo de publicação), a lista é pulada e vale só a chave. Na prática: quem tiver o link com a chave vê a carteira inteira, com a permissão do dono. Há também uma rota de diagnóstico da distribuição de lucros que devolve dados com a mesma chave. **Sugestão ao Leandro, já hoje:** trocar a chave periodicamente e, se possível, publicar só para o domínio do escritório.

### 4.2 Dados pessoais em planilha (LGPD)

A planilha guarda CPF de sócios, telefones, valores pagos a sócios e as conversas da Renata; a aba "Bastidores" grava a entrada e a saída de cada ferramenta, o que pode incluir trechos de documentos. Não achei rotina que apague conversas antigas. Quem edita a planilha vê tudo. Na plataforma: política por linha, eventos e retenção definida (Fundações; DA-01).

### 4.3 Envio de documentos à Anthropic

A Renata manda à API o conteúdo de documentos dos clientes (balancetes, extratos, holerites) para ler e responder. É uso legítimo, mas exige o contrato de tratamento de dados com o fornecedor e aviso no termo do cliente, o que o nosso pacote jurídico já prevê para a plataforma. Vale o Leandro confirmar se o escritório dele já cobre isso.

### 4.4 E-mail como entrada

O coletor confia no remetente, que pode ser falsificado, e, sem remetente cadastrado, tenta achar o cliente pelo assunto. Um erro grava o extrato de um cliente na pasta de outro, e esse extrato depois alimenta a distribuição de lucros e pode ser enviado pela Renata. O próprio código tem uma defesa (a distribuição de lucros marca "Suspeita" quando o CNPJ do extrato é de outra empresa), mas o arquivo já está na pasta errada. Sugestão: assunto sem remetente cadastrado vai para uma fila de triagem, não direto para a pasta. Além disso, o coletor roda **na conta pessoal da analista**: se ela sair ou trocar a senha, para.

### 4.5 Página pública de entregas e registro de abertura

O identificador do link é aleatório e longo (bom), mas o link não expira, não tem senha e entrega o arquivo a quem o tiver; um link encaminhado continua valendo. O registro guarda data e hora da abertura e do download, sem identificar quem abriu. Hipótese a confirmar com ele: alguns antivírus de e-mail abrem links sozinhos e podem marcar "aberto" sem o cliente ter visto. Para holerite e documento com CPF, o nosso plano já proíbe link de compartilhamento (06, 5.4).

### 4.6 Assinatura conferida só pelo nome

A conferência procura o nome do contador no certificado dentro do PDF; não valida a assinatura criptograficamente (não confere se o documento foi alterado depois de assinado nem se o certificado é válido). Para decidir se envia, funciona; como prova, não. Na plataforma, a conferência deve validar a assinatura de verdade (biblioteca de PAdES, o padrão de assinatura em PDF).

### 4.7 Um escritório só, uma conta só

Não há separação por escritório: uma planilha, IDs fixos, e-mails da equipe e o nome do escritório no código. Tudo depende de uma conta Google com acesso amplo. Isso é normal para uma ferramenta interna, mas significa que nada disso vira produto sem refazer a base, como o Desenho já decidiu.

### 4.8 Dependências de terceiros

Acessórias (servidor MCP com token; o código trata vários formatos de resposta, sinal de interface pouco estável, e o nosso 08 registra "API por token não documentada"); Infosimples e Serpro (custo por consulta; a certidão municipal de SP está "a definir" no próprio código); Anthropic (modelo por nome: se sair de linha, a Renata para); Contmatic (o informe lê o texto do balancete exportado e quebra se o layout mudar); LegisWeb (entrada manual); cotas do Google (tempo, e-mails por dia, chamadas ao Drive).

### 4.9 Injeção de instruções

A Renata lê mensagens e documentos de clientes. As defesas estão no lugar certo, nas ferramentas: empresa exigida, CNPJ do cadastro, pasta da empresa, consulta só de leitura na Acessórias. As regras de texto ("nunca mencione ferramentas") dependem do modelo obedecer. O nosso 02, 12.1 trata o conteúdo externo como dado marcado; vale aplicar o mesmo cuidado na migração.

---

## 5. Perguntas para o Leandro

Cada pergunta traz a nossa hipótese. Basta responder "segue" ou ajustar.

1. **O que a equipe abre primeiro de manhã?** Hipótese: a aba Contábil em "Minha fila"; a Central de alertas fica para quem cuida de certificados e da Legalização.
2. **A Renata já fala com cliente de verdade?** Hipótese: está no piloto em rascunho, com poucas empresas, e o analista cola a mensagem e envia pelo WhatsApp à mão.
3. **A distribuição de lucros no painel já é o controle oficial e o REINF é digitado a partir da exportação?** Hipótese: sim, desde 08/2026, e a planilha antiga ficou só para consulta.
4. **Para clientes do Simples, vocês aplicam a retenção de 10% acima de R$ 50 mil?** Hipótese: o escritório adota uma tese só para todos; na plataforma isso vira uma escolha registrada por cliente, porque as fontes divergem (pesquisa D5).
5. **Vão continuar usando a Acessórias depois que a plataforma entrar?** Hipótese: sim no começo; lemos a Acessórias só para consulta até o nosso calendário mostrar os mesmos prazos, e aí ela sai.
6. **O contador assina com certificado todo balancete, balanço, DRE e relatório que vai ao cliente?** Hipótese: sim, por A1 no PDF ou SafeID no celular, e isso deve virar um fluxo da plataforma.
7. **Quantos clientes ativos e quanto tempo leva uma atualização completa?** Hipótese: algumas centenas de clientes e várias execuções encadeadas por atualização.
8. **O que quebra com mais frequência?** Hipótese: arquivos com nome fora do padrão, PDFs que não convertem e o limite de tempo do Google.
9. **O informe financeiro já vai para cliente?** Hipótese: vai, depois de alguém conferir as travas.
10. **As certidões automáticas estão ligadas?** Hipótese: ainda não; a Renata encaminha à Legalização.
11. **Podemos pôr validade nos links de entrega (por exemplo, 30 dias, com reenvio em um clique) e proibir link para holerite?** Hipótese: sim.
12. **O escritório pode ser o piloto, começando pelo Contábil, com o painel antigo rodando junto por dois fechamentos?** Hipótese: sim.

*Acrescentadas depois do mapa (9/11/2026):*

13. **Você pode separar amostras anonimizadas para os nossos testes?** Por exemplo: extratos de 5 a 10 bancos em OFX, CSV e PDF; o mesmo extrato em PDF e CSV; um extrato com CPF mascarado; pastas fora do padrão; um .zip do Windows. Nomes, CPFs, CNPJs e valores trocados. Hipótese: sim, com o mesmo cuidado do pacote que você já mandou.
14. **Na publicação real, quem consegue abrir o painel?** O mapa (p. 10) diz que só entram contas do domínio do escritório; o arquivo de configuração exportado diz "qualquer pessoa". Hipótese: a publicação real está restrita ao domínio. Se não estiver, vale restringir já.

---

## 6. Plano curto de migração

**Princípio.** Nada é desligado antes de a plataforma mostrar o mesmo resultado com os mesmos dados (paridade, 03, 11.1, etapa 6). O código não vem; vêm os dados, as regras e os textos. O Drive continua sendo o lugar dos arquivos, como o Desenho 1.4 decidiu.

**Agentificação (regra do Enzo, 9/11/2026).** O que migra não é cada rotina fixa nem cada botão, mas a **regra de negócio**, entregue a um integrante do time. As rotinas das 6h, 12h e 17h viram gatilhos: chegou extrato, virou o mês, o prazo está perto. As linhas "suspeita" viram perguntas e cartões de aprovação. As regras que a equipe dele criou à mão viram memória do integrante. A regra de ouro dele (nada sai ao cliente sem aprovação humana) é o padrão da plataforma no início. A paridade, portanto, compara **resultados** (o que falta, o que é lucro, o que vence), não telas. O detalhe item a item está na seção "Como fica agentificado" da [Lista_de_Decisao_Painel_do_Leandro.md](Lista_de_Decisao_Painel_do_Leandro.md).

| Etapa | O que acontece | O que se importa | O que continua no painel antigo |
| --- | --- | --- | --- |
| **0. Preparação** (antes de ligar) | Rodar o Raio-X dele uma última vez e usar o resultado para mapear a árvore de pastas (cliente, ano, competência, tipo; o que é visível ao cliente). Limpar o Cadastro (CNPJ, situação, regime, responsável) e a aba Sócios (CPF). Cadastrar a equipe com os setores. Confirmar os contratos de tratamento de dados | Nada ainda | Tudo |
| **1. Espelho e carga** | Conectar o Drive como espelho só leitura. Carga inicial (Fundações F14) das abas Cadastro, Sócios, Equipe e Anotações (as decisões de competência e de "não se aplica" entram como histórico) | Planilha base; árvore do Drive | Tudo; a plataforma só lê |
| **2. Checklist contábil e alertas** | Aba Contábil com as regras de competência dele. Comparar 5 clientes (03, 11.1) e depois a carteira, por **dois fechamentos** em paralelo. Alertas de certificado pelo cofre | Contas esperadas; validades dos certificados | Fiscal, DP, Legalização, DL, entregas, Renata. Desliga a aba Contábil e a Central de alertas antigas quando houver paridade |
| **3. Cobrança e entregas** | Régua de documentos no CRM; entregas pelo app e por link com validade. Importar o histórico de _entregas como somente leitura | _entregas (histórico) | **A página pública antiga fica no ar só para os links já enviados**, até eles perderem a utilidade (sugestão: 90 dias) |
| **4. Distribuição de lucros** | Ligar o controle mensal (subindo a CTB-034 de fase) com as regras dele. Um trimestre em paralelo até o REINF sair igual | _dl (com status, protocolo e trava), _dl_regras | O controle antigo até o fim do trimestre em paralelo; depois, só consulta |
| **5. Fiscal, DP e Legalização** | Obrigações pela base legal; o arquivo no Drive vale como evidência enquanto a captura oficial não está ligada. O "De-para" do DP vira regra de classificação. A rotina que move pastas não é migrada | Aba De-para; tabela de prazos (como teste) | Leituras antigas dos departamentos até a paridade |
| **6. Atendimento e Acessórias** | A Renata vira o integrante de Atendimento do CRM, com WhatsApp oficial. Importar instruções, regras gerais e fichas como memória do escritório e do cliente; os 12 cenários entram na avaliação. Recomeçar em rascunho com as empresas do piloto. Acessórias como conector só de consulta | Documentos de instruções e regras; fichas; histórico de escalonamentos e atendimentos (somente leitura) | A Renata antiga até a nova passar nos cenários e num mês de rascunho |
| **7. Desligamento** | Coletor de extratos troca pelo conector de e-mail da caixa do setor (não da pessoa). Remover gatilhos, revogar acessos e tokens antigos, trocar a chave do painel, arquivar a planilha como consulta | Registro _coletor (histórico) | Planilha e projetos arquivados, sem gatilhos |

**O que fica até o fim:** a Acessórias (até o nosso calendário provar os mesmos prazos), o Drive como arquivo (sempre), a página pública antiga só para links já enviados e o controle antigo de distribuição de lucros como consulta.

**Ajustes que este cruzamento pede ao plano** (para o coordenador decidir; não foram aplicados):

1. Subir o controle mensal de distribuição de lucros (CTB-034) da fase 4 para a fase 1 ou 2 e de P3 para P1 no Plano 4.6.
2. Criar a ficha do fluxo de assinatura do contador (pedido, fila, conferência criptográfica do assinante, envio automático).
3. Acrescentar ao 08 um conector de leitura contínua da Acessórias para a transição, além do de migração.
4. Acrescentar a ferramenta de diagnóstico da árvore de pastas (Raio-X) à trilha de implantação.
5. Escrever as regras de competência do documento e as "contas esperadas" no 03, 6.6 e na classificação de documentos.
6. Acrescentar ao 06 o farol de prazo por entrega e a detecção de e-mail devolvido.
7. Acrescentar travas de conferência a todo relatório gerado para o cliente.
8. Acrescentar ao 02 e ao 04 o modo de simulação e a lista de clientes-piloto para a IA de atendimento.
9. Avaliar o "manual de procedimentos do escritório" como recurso genérico da plataforma.

---

## 7. O que o Mapa de construção acrescenta ou corrige

O mapa (PDF de 12 páginas, 6/11/2026) descreve a estrutura que o Leandro pensou. Quase tudo confirma o que o código mostrou; abaixo, só o que é novo, o que completa e o que contradiz.

### 7.1 Confirma

- Os cinco princípios: o Drive é a fonte da verdade, a convenção de pastas vem antes do código, a leitura é incremental, nada se apaga sozinho e há uma tela só com várias abas (p. 1).
- O modelo de dados, com a pasta do cliente no Drive como chave de tudo (p. 3 e 4), as rotinas e horários (p. 6) e as cinco perguntas da distribuição de lucros na mesma ordem do código (p. 8).

### 7.2 Completa (não estava claro só pelo código)

| Ponto | O que o mapa diz | Página |
| --- | --- | --- |
| Leitura incremental | Cada arquivo tem uma impressão digital (conteúdo, tamanho, data); só o que mudou é relido. Além da leitura geral, há uma **releitura rápida** só das pastas alteradas, ao meio-dia e à tarde | 1, 6 |
| Padrões de execução | Orçamento de tempo de 4,5 min, fila persistente, "trava leve" de 7 minutos, gravação por linha (nunca apagar a aba para regravar), **versão do leitor** (mudou a regra, tudo é relido aos poucos preservando as decisões da equipe) e **autocorreção** (a rotina repõe linhas importadas que faltam) | 6, 7 |
| Variações de pasta de mês | Aceita MM.AAAA, MM-AAAA, MM e nome do mês; fora disso, "estrutura incompleta". ZIP vira arquivos lógicos; arquivo repetido aparece na ficha | 3 |
| Indicadores do topo | Total de empresas, vencidos, vencendo em 7 e em 30 dias, hora da última e da próxima leitura, agenda importada e "Mais urgentes" | 7 |
| Filtros por fase | Completo, Parcial, A conferir, Pendente, Estrutura incompleta, mais filtros de módulo (por exemplo, "DL pendente REINF"), responsável, "Minha fila" e busca | 8 |
| Bloco de manutenção | Recolhido, com pastas fora do padrão, **pastas sem cliente no Cadastro** e ex-clientes | 8 |
| Leitor de extratos | OFX, CSV, planilha e PDF com OCR; sócio reconhecido por CPF inteiro, **CPF mascarado** ou nome; o mesmo extrato em PDF e CSV não é contado duas vezes; migração da planilha antiga preservando os identificadores | 9 |
| Regra de ouro | Nenhuma integração envia nada ao cliente sozinha: o que sai para fora passa por um clique da equipe; sozinho, só aviso interno | 10 |
| Dados sensíveis | CPF e valores só em abas ocultas; diagnósticos mostram totais, nunca CPF; arquivos temporários de conversão são apagados | 10 |
| Testes | Código testado fora do Google com simulações da planilha e do Drive e com navegador automatizado antes de publicar | 6, 12 |
| Lições para o projeto maior | Validar a estrutura de pastas no cadastro com aviso imediato; banco com transação; preferir OFX/CSV, guardar a versão do leitor e pôr **teto de valor** para pegar erro de leitura; autor e data em toda decisão; CPF e CNPJ sempre como texto e nomes comparados com tolerância a uma letra; validar o valor antes de alertar; testes com amostras anonimizadas; **painel de saúde das rotinas** (última execução, fila, erros por arquivo) | 11, 12 |
| Recomendação final | Para portal do cliente, vários usuários externos ou volume maior: banco de dados, com o Drive só como repositório de arquivos, reaproveitando as regras de leitura. É exatamente o que o Desenho 1.4 decidiu | 12 |

### 7.3 Contradiz ou difere

1. **Acesso ao painel** (p. 10): o mapa diz que só contas do domínio entram; o manifesto exportado diz "qualquer pessoa". Ver 4.1; pergunta ao Leandro.
2. **Raio-X** (p. 5): o mapa o chama de "visão consolidada do cliente, a detalhar"; o código faz um diagnóstico da estrutura de pastas por departamento e órgão. Tratamos pelo código e reclassificamos de "falta" para "parcial", porque as Fundações 7.3 já fazem parte disso.
3. **Exportação do REINF** (p. 9): é um CSV do trimestre, não um formato próprio de digitação, como eu tinha suposto. Já corrigido em 1.7.
4. **"Nenhuma integração envia ao cliente sozinha"** (p. 10): é coerente com o código hoje (Renata em simulação ou rascunho; WhatsApp por link manual). A emissão automática de certidão envia o arquivo dentro da conversa, que no piloto também passa por aprovação. Na nossa plataforma, a regra equivalente é a das categorias liberadas pelo Administrador (04, 8.1).

### 7.4 Efeito na tabela e nas lacunas

- Raio-X passa a **parcial**; a lacuna fica sendo o relatório de diagnóstico e o aviso contínuo do que sai do padrão.
- Entram como itens para decisão: validação da convenção de pastas com aviso imediato, versão do leitor com releitura que preserva decisões, painel de saúde das rotinas (o 08 já tem uma tela parecida, só para conectores), teto de valor contra erro de leitura, dedup de extrato PDF × CSV e CPF mascarado, indicadores do topo e filtros por fase.
- A lista para o Enzo decidir está em [Lista_de_Decisao_Painel_do_Leandro.md](Lista_de_Decisao_Painel_do_Leandro.md).
