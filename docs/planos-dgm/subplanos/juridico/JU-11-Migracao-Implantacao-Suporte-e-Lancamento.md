# Subplano JU-11 · Migração, implantação, suporte e lançamento (pacote Jurídico)

**Versão 0.1 · 9/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Fontes: [Conferência](../../Conferencia_Pacote_Juridico.md) e [Síntese](../../Sintese_Pacote_Juridico.md); pesquisas [J1](../../../pesquisa/juridico/J1-mercado-software-juridico.md), [J2](../../../pesquisa/juridico/J2-elaw.md), [J7](../../../pesquisa/juridico/J7-sgjur.md), [J8](../../../pesquisa/juridico/J8-matriz-de-funcionalidades.md); subplanos JU-01 a JU-05 (em especial as seções 5.5 e 6 do [JU-05](JU-05-Honorarios-Financeiro-e-Preco.md)); [Estudo de Precificação](../../Estudo_de_Precificacao_por_Modulo.md); [Fundações](../01-Fundacoes.md). **[a confirmar]** marca o que nenhuma fonte fechou. Preços e horas são **parâmetros de teste**. Nomes fixos: **Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato** (cláusulas e vigência; o de honorários é *Contrato de honorários*).

**Resumo para quem não é advogado nem engenheiro.** O documento responde a quatro perguntas: como o escritório traz os dados do sistema antigo sem perder um prazo; como aprende o nosso e quando passa a confiar nos alertas; quem atende quando algo dá errado; como lançamos sem que um prazo perdido destrua a reputação. Cinco decisões propostas: (1) o **número CNJ** do processo (20 dígitos) é a chave de toda migração; (2) o sistema antigo fica ligado até a **virada**, e nas primeiras semanas o nosso só calcula prazos **em silêncio** (modo sombra); (3) **não haverá plantão humano de prazo fatal** no lançamento; há monitor automático 24 horas e fila prioritária no horário comercial; (4) o **piloto** é com a advogada da família e 10 a 20 escritórios pequenos, com critérios de saída medidos; (5) vendemos "o que está dentro do preço", não "mais barato", e nunca prometemos "zero perda de prazo".

---

## 1. Escopo e princípios

**Dentro:** migração por sistema de origem; implantação e treinamento; modo sombra e virada; suporte e FAQ jurídica; piloto, lançamento, métricas, posicionamento, canais, vendas cruzadas e reputação; dependências de gente de fora. **Fora:** preço final (JU-12), regras de contagem (JU-03), base de leis (JU-04), telas (JU-02). **Nada é construído agora**; o que não é código (parecer, amostras, planilha-modelo, texto do FAQ) pode andar antes.

### 1.1 Decisões do usuário que governam o texto

| # | Decisão já tomada | Origem |
| --- | --- | --- |
| D1 | Escritórios de 1 a 10 usuários primeiro | Síntese 10 (a) |
| D2 | O BPO fecha antes; o jurídico fica em planos | Síntese 10 (d) |
| D3 | A advogada da família valida os prazos; o contador da família confere aritmética e tributos; **especialista por área só no lançamento** | Síntese 10 (e), JU-04 6.5 |
| D4 | Implantação do solo **grátis em autoatendimento**; assistida R$ 900 (piso R$ 540); piso de qualquer implantação é a **margem zero** | JU-05 8.3, Estudo 8.3 |
| D5 | Suporte: **FAQ, assistente de ajuda (30 perguntas por usuário por mês), equipe**; R$ 12,50 de suporte humano por assento mais R$ 2 de chat | Estudo 6.8.9 e 6.8.10 |
| D6 | **Modo sombra de algumas semanas** e **parecer de advogado especializado** antes de casos reais | Regra unificada 9 |
| D7 | Regras unificadas 1 a 4: Caso restrito, segunda conferência do fatal, margem interna, Domicílio Judicial (ciência nunca delegável; primeira semana com aprovação do gestor) | JU-01 a JU-05 |

### 1.2 Princípios

| # | Princípio | Consequência |
| --- | --- | --- |
| M1 | **Nunca mexemos no sistema de origem**; ele fica ligado até a virada | Sem corte seco |
| M2 | **O número CNJ é a chave** | A lista de números serve a qualquer origem |
| M3 | **Importar é rascunho até alguém confirmar** (Processo "candidato" nunca vira Processo sozinho, JU-01 4.1) | Confirmação em lote |
| M4 | **Prazo importado é recalculado pelo motor**; a advogada confere 100% dos abertos | Nunca copiamos a data de outro sistema |
| M5 | **Sigilo primeiro**: Caso restrito e segredo de justiça entram restritos, com IA desligada | Seção 2.7 |
| M6 | **Nenhum alerta real antes da virada** | Seção 3.3 |
| M7 | **Promessa honesta**: o sistema ajuda, o advogado responde (JR6) | Venda e treino sem "zero perda de prazo" |
| M8 | **O suporte explica o sistema, não aconselha o caso** | Seção 4.1 |
| M9 | **Medir antes de prometer**: horas, custo de captura e chamados são premissas do JU-05 | Seção 5.4 |
| M10 | **A implantação cobra o custo**; solo faz sozinho de graça | Seção 2.8 |

---

## 2. Migração

### 2.1 O que ainda não sabemos

Os relatórios leram só páginas públicas; **ninguém entrou em área logada**. O que cada sistema exporta (formato, campos, limites) **não está verificado** (JU-05 6.2). A primeira tarefa, sem código, é abrir **contas de avaliação** (Astrea 10 dias, Projuris 7, ADVBOX 7, EasyJur 7, eLaw Adv 10) e pedir à advogada da família uma **exportação de amostra**. Os roteiros públicos de Projuris, ADVBOX e EasyJur (ordem: pessoas, processos, tarefas, andamentos; planilhas padronizadas; EasyJur com migração assistida paga) servem só de **referência de ordem, não verificados**.

### 2.2 Por sistema de origem

| Origem | O que se sabe (fonte) | Caminho proposto | Cuidado |
| --- | --- | --- | --- |
| **Astrea** | Maior base declarada (mais de 120 mil, J1); plano grátis de 1 ano com 40 processos; sem API pública, segundo a Aurum [a confirmar]; backup completo sob pedido (trecho de busca, J8 FX-007) [a confirmar] | Backup ou exportação, mais **lista CNJ** | Solos do plano grátis têm pouco histórico; o essencial são os prazos abertos |
| **ADVBOX** | Vende migração assistida; API REST (J8); **"prazo fatal" é a véspera do prazo da lei**, de D0 a D-5 (J8 4.1) | Exportação ou API, mais lista CNJ | **Armadilha de palavra:** o "fatal" de lá é data interna; o nosso é o prazo cuja perda extingue o direito (JU-01, P4). Vira **margem interna**; o prazo legal é recalculado |
| **Projuris ADV** | Start solo R$ 79 e compartilhado R$ 349 (com API); completo com API pública; contratos de honorários com parcelas e êxito (J8) [a confirmar o que exporta] | Exportação ou API; contratos por planilha | Contratos e parcelas abertas (2.5) |
| **Legal One** | Importa planilha; APIs só no Premium (J1, J8) | Planilha ou API, mais lista CNJ | Starter (1 a 4 usuários) é o nosso público |
| **SAJ ADV** | Parece ter virado Projuris ADV [a confirmar] (J8) | Tratar como Projuris até ver a tela | Perguntar o nome no login |
| **eLaw** | **Dois mundos** (J2): Adv (ex-Proadv, solo e pequeno) e Enterprise, Starter e Integration Office (departamentos e bancas); a advogada pode usar **por exigência de cliente corporativo** | Adv: exportação ou lista CNJ. Enterprise: **não migrar o que é do cliente** | Se o escritório lança dados no eLaw **do cliente**, o nosso **convive**; migramos só o que é do escritório |
| **SGJur / SIJUR** | SGJur é novo (termos de outubro de 2026), poucos dados públicos, com "importar carteira" por CNJ (J7); pode ser que o da advogada seja o SIJUR [a confirmar] | Lista CNJ; exportação desconhecida | Confirmar o endereço com ela |
| **Planilhas e pastas** | Origem provável de solos [a confirmar] | **Planilha-modelo nossa** mais lista CNJ | O relatório mostra o rejeitado |
| **Outros** (CPJ-3C, Office.ADV, DataJuri, Themis) | Bancas maiores; DataJuri sem API [a confirmar] | Planilha e lista CNJ | Fora do público inicial |
| **Sistema da advogada da família** | **A descobrir** | **Paciente zero**: exportação de amostra, importação de teste, sombra ao lado do sistema dela | Só após parecer e termo |

**Regra comum:** a **lista de números CNJ é o piso** em toda origem; se a origem exportar mais, melhor.

### 2.3 Ordem de importação

Segue a ordem pedida (pessoas, processos, tarefas, andamentos, honorários, documentos), com duas correções de risco: **prazos abertos entram cedo** e **histórico entra tarde**.

| Passo | O que entra | Por quê | Conferência |
| --- | --- | --- | --- |
| 1 | **Pessoas** (clientes, contatos, correspondentes) | Tudo se pendura nelas; base do conflito de interesses | Duplicados e homônimos |
| 2 | **Casos, Processos e Partes** | O número CNJ amarra o resto | Contagem; dígito; segredo marcado |
| 3 | **Prazos abertos e Audiências** | É o que não pode falhar | **100% recalculado e conferido pela advogada** |
| 4 | Demais **tarefas** | Rotina | Amostra |
| 5 | **Andamentos** (histórico) | Reconstruível pelo CNJ | Amostra |
| 6 | **Honorários**: Contratos de honorários, parcelas, êxitos pendentes | Exige o Caso pronto; êxito é manual (J8) | Soma em centavos igual à origem |
| 7 | **Horas** | Alimenta rentabilidade | Total por mês |
| 8 | **Documentos** | Mais pesado e menos urgente (indexação de R$ 50 a R$ 300, JU-05 6.2) | Contagem de arquivos |

### 2.4 Importar pelo número CNJ, com o conector

**Como funciona (desenho).** O escritório cola uma lista. O sistema (1) confere o dígito verificador (dois dos 20 dígitos são de conferência; norma [a confirmar]); (2) descarta e conta os inválidos; (3) busca capa e movimentos; (4) cria **um Caso com um Processo em rascunho**; (5) pede confirmação **em lote** (cartão "Cadastrar processo", JU-02 5.3). O SGJur faz assim, em lotes de 20 (J7, SG-020).

**O que o conector traz.** No teste de 8/11/2026 no TRT4, o DataJud devolveu número, tribunal, grau, classe, assuntos, órgão julgador, data de ajuizamento, **nível de sigilo**, sistema e **movimentos**; **não traz partes, advogados, teor, peças nem valor da causa** (J4 1.1) [testado em um tribunal; os demais a confirmar]. Logo o número reconstrói **capa e histórico**; **partes, cliente e valor vêm da origem ou de digitação**.

**Três limites.**

1. **Uso comercial do DataJud:** os termos 3.3 e 3.8 o vedam (R1). Até a tratativa pela Res. CNJ 574/2024, a **fonte do enriquecimento é plugável**: DataJud por contrato, fornecedor pago por processo ativo, planilha ou digitação (JU-01 5.5). Custo de consulta única: [a confirmar].
2. **Importar não é monitorar.** Registrar todos é barato; monitorar por fornecedor custa por processo (referência R$ 1,50 por mês, JU-03 6.1). Regra: **importar tudo, monitorar só os ativos**, com o custo avisado antes (custo mais 20%, aprovado no JU-05).
3. **Publicações antigas:** o DJEN dá o que vem **depois da virada**; consulta retroativa [a confirmar]. Prazo antigo não se reconstrói; prazo aberto se importa e se confere.

### 2.5 Mapa de campos

| Conceito na origem | Destino | Regra e cuidado |
| --- | --- | --- |
| Cliente, contato | **Pessoa** com perfil jurídico (JU-01 3.1) | CPF ou CNPJ conferido; fusão registrada |
| Pasta, ação | **Caso** | Área obrigatória; **restrito** se a origem marca sigilo |
| Número do processo | **Processo** | Dígito conferido; sem formato CNJ vai para tratamento manual |
| Partes, advogado contrário | **Parte** (polo, dobro); parte contrária só como dado do Caso (JU-01, P10) | Dobro decidido pelo escritório |
| Procuração | **Mandato** | Sem procuração, avisar |
| Prazo ou compromisso | **Prazo** | **Recalculado**; data antiga só como "valor da origem"; **"fatal" de outro sistema não vira o nosso** |
| Audiência | **Audiência** | Local, link |
| Publicação | **Comunicação** (histórico) | Marcada "importada"; não gera Prazo novo |
| Andamento | **Andamento** | Só inserção (JU-01 4.3) |
| Contrato de honorários, parcelas | **Contrato de honorários**, **Honorário-Jurídico** | **Êxito pendente é manual** (J8) |
| Horas, documentos | Timesheet; Documento do Caso | Mês fechado não se edita; sigilo do Caso vale |

**Planilha-modelo** (solo e origem sem exportação): obrigatórias nome, CPF ou CNPJ, número CNJ, área, responsável; opcionais parte contrária, valor da causa, prazos abertos (data, descrição, tipo), honorário combinado; com linhas fictícias de exemplo.

### 2.6 Validação, conferência e reversão

**Conferência em três níveis**, num **relatório de importação** (importados, rejeitados com motivo, duplicados, restritos): (1) **contagem** por tipo, em centavos para dinheiro; (2) **amostra** humana (tamanho a medir); (3) **prazos abertos 100%**: o motor recalcula, lista divergências com a memória de cálculo e a advogada decide; cada divergência real vira **caso do gabarito** (JU-03 2.9).

**Reversão.** Toda importação é um **lote** (entidade leve: origem, hash dos arquivos, autor, estado, contagens). Como "nada se apaga" (JR8), **reverter é marcar o lote como revertido** e escondê-lo, guardando o histórico. **Até a virada** a reversão é total e sem consequência (nenhum alerta real saiu); **depois**, é arquivar com motivo (Gestor). O sistema antigo nunca foi tocado (M1) e o nosso tem **exportação completa a qualquer hora** (J8 FX-007), o que reduz o medo de trocar.

### 2.7 Sigilo durante a migração

O arquivo de migração é o conjunto mais sensível que o escritório nos entrega (clientes, família, criminal, segredo de justiça). Tudo abaixo **depende do parecer** da regra 9:

1. **Só após contrato, termo de operador e parecer**; antes, só dados fictícios.
2. **Mapeamento sobre dez linhas fictícias**; a importação roda por máquina, sem a equipe ler; **a conferência é do escritório**.
3. Se a equipe precisar ver algo: **sessão de tela com consentimento** (30 minutos, só ver, sem gravação; Fundações 26) e **nunca em Caso restrito** (JU-01 6.2).
4. **Restrito por padrão** o que tem sigilo no DataJud, segredo de justiça na origem ou cliente de sigilo reforçado, **com IA desligada**.
5. **Segredo de justiça não vai a fornecedor** (J4); entra por digitação ou planilha.
6. **Nada importado treina, avalia ou alimenta cache global** (regra 5). IA só após o termo do cliente (JU-04).
7. **Arquivos de origem** cifrados no compartimento do escritório e **apagados após a virada** (hipótese: 30 dias).
8. O **envio do número do Processo a terceiro** é um dos pontos de parecer do JU-03 (6.3); escritório controlador, plataforma operadora [a confirmar].

### 2.8 Custo e horas (JU-05 6.1 e 6.2)

R$ 90 por hora de custo (premissa; R$ 70 a R$ 130) **[a medir no piloto]**:

| | Solo | Pequeno | Médio |
| --- | ---: | ---: | ---: |
| Importação e conferência (2 h mais 1 h por 100 processos) | 2,8 h | 6 h | 12 h |
| Trilha completa | 13,3 h | 29 h | 48 h |
| Tabela da trilha (piso = custo) | R$ 1.800 | R$ 3.900 | R$ 6.500 |
| Migração opcional (histórico, documentos e financeiro) | 5 h | 16 h | 32 h |
| Migração: tabela (R$ 130 por hora) / piso | R$ 650 / R$ 450 | R$ 2.080 / R$ 1.440 | R$ 4.160 / R$ 2.880 |

**O que sobe as horas** (a medir): muitos processos sem número CNJ válido, volume de documentos, êxito pendente, origem sem exportação, Casos restritos. **O que baixa:** planilha limpa, treinamento gravado, conferência automatizada (Estudo 8.3). **Solo:** trilha enxuta de 6 horas assistidas (R$ 540 de piso; R$ 900 de tabela); em autoatendimento, **grátis**. Cobrar o custo continua valendo: sem isso o caixa do primeiro ano não fecha (JU-05 6.3).

---

## 3. Implantação e treinamento

### 3.1 Três trilhas

| Trilha | Para quem | Inclui | Custo |
| --- | --- | --- | --- |
| **Autoatendimento** | Solo, ou quem prefere sozinho | Assistente passo a passo, importador CNJ, planilha-modelo, vídeos curtos, escritório de treino com dados fictícios, FAQ | **Grátis** |
| **Assistida enxuta** | Solo com ajuda | 6 horas: importação conferida e treinamento | R$ 900 (piso R$ 540) |
| **Completa** | 5 ou mais usuários | 29 a 48 horas, com 30 dias de acompanhamento | R$ 3.900 e R$ 6.500 (piso: custo) |

### 3.2 Trilha dos primeiros 30 dias

A trilha usa os **moldes** da plataforma (Fundações 4.8): o sistema gera as tarefas da jornada. Cada semana termina num **marco verificável**.

| Quando | O que acontece | Marco |
| --- | --- | --- |
| **Dia 0** | Contrato, termo de operador, usuários e papéis; **inscrição OAB conferida à mão** (JU-01, P11); tribunais; planilha-modelo; **sistema antigo continua ligado** | Termos assinados |
| **Semana 1** | Cadastro (setores, calendário forense ratificado, modelos de Contrato de honorários); importar pessoas, Casos e Processos; **DJEN ligado por inscrição**; **Domicílio só listando, com aprovação do Gestor** (regra 4); **modo sombra ligado** | Primeira publicação captada e vinculada |
| **Semana 2** | **Prazos abertos importados e conferidos 100%**; margem interna (regra 3); advogado de emergência ou aviso de risco (JU-03, P11); treino 1 | Zero prazo aberto sem dono |
| **Semana 3** | Financeiro (contratos, régua, êxito, partilha); app do cliente e **termo de ciência de IA**; andamento ao cliente por modelo; treino 2 | Primeiro honorário cobrado |
| **Semana 4** | **Revisão da sombra**; **virada** se o critério estiver cumprido; o antigo só se desliga depois | Virada registrada |
| **Dia 30** | Relatório de implantação e checagem de saúde (3.5) | Escritório "implantado" |

O autoatendimento segue o mesmo calendário como checklist na tela Hoje.

### 3.3 Modo sombra e virada

**O que é.** Por algumas semanas, o sistema **calcula e mostra os prazos, mas não alerta nem cria tarefa real** (cada Prazo traz "não confie nesta data"). O escritório trabalha no sistema antigo e **compara lado a lado**. É a decisão D6, para reduzir o risco do item mais difícil e irreversível (JU-03 8.2).

**Dois níveis.** (1) **Portão de lançamento**, antes de qualquer caso real: a advogada da família roda o motor ao lado do sistema dela; hipótese **4 semanas e pelo menos 30 prazos reais comparados**, com **zero divergência sem explicação** [a confirmar]. (2) **Por escritório**, depois do lançamento: **14 dias de sombra** com o sistema antigo ligado; dispensar exige **aviso de risco assinado** (P1).

**Critério da virada** (hipótese): prazos abertos conferidos; divergências explicadas; captura "ok" nas últimas 72 horas (JU-03 3.6); advogado de emergência definido; primeira semana do Domicílio concluída. Na virada liga-se a **escada de alertas** (D-5, D-3, D-1, dia; JU-03 2.5). **O sistema antigo fica mais 14 dias** como rede de segurança [a confirmar].

### 3.4 Treinamento por perfil

| Perfil | O que aprende (45 a 60 minutos; a medir) |
| --- | --- |
| **Advogado** | Hoje; ler intimação; **"ver a conta" antes de confirmar prazo fatal**; cartão de ciência (o que "abrir" faz com o prazo); revisar Peça; Caso restrito |
| **Apoio e estagiário** | Triagem (três saídas), vincular a Processo, prazo avulso, agenda; **o que não pode fazer** (confirmar fatal, dar ciência) |
| **Gestor ou controladoria** | Saúde da captura, conferência diária, ausência, calendário forense |
| **Sócio** | Conflito de interesses, pedir acesso a Caso restrito, financeiro, rentabilidade |

**Formatos:** vídeos curtos, sessão ao vivo, **escritório de treino** com dados fictícios e dicas na tela. **Mensagem obrigatória:** o que o sistema **nunca** faz (ciência, protocolo, confirmar fatal, assinar). Isso ataca a queixa de "promessa diferente do contrato" (J1, evidência fraca).

### 3.5 O que é "implantado" no dia 30

Zero prazo aberto sem dono; Comunicações tratadas dentro de [a confirmar] dias úteis; captura "ok"; Domicílio fora da fase de aprovação por lista; Contrato de honorários ativo (se houver Financeiro); termo de IA registrado ou Caso sem IA; advogado de emergência indicado. O relatório vai ao Gestor e ao sócio.

---

## 4. Suporte do pacote Jurídico

### 4.1 As três camadas no direito

Ordem decidida: **FAQ, assistente, equipe** (D5).

| Camada | O que é | Particularidade jurídica |
| --- | --- | --- |
| **FAQ** | Perguntas curtas, escritas pela equipe, sem IA e sem custo por consulta (Fundações 27, Item de FAQ) | **Revisão da advogada da família** antes de publicar o que toca prazo; cada item termina com "isto explica o sistema, não aconselha o seu caso" |
| **Assistente de ajuda** | Modelo pequeno, só sobre o sistema, 30 perguntas por mês, fora do limite de IA | **Não lê Caso restrito** (JU-01 6.2); pergunta jurídica ("meu prazo está certo?") recebe "isso é com o advogado" e a conta do prazo; não substitui o Consultor jurídico (JU-04) |
| **Equipe** | Chat com pessoas | Dúvida de **contagem** vai para a fila de divergência (4.4) |

### 4.2 Horário e plantão de prazo fatal: decisão

**Proposta: não haverá plantão humano de prazo fatal no lançamento.** Em seu lugar:

1. **Monitor automático 24 horas** (saúde da captura, JU-03 3.6): avisa Administrador, Gestor e sócio; em 72 horas abre a contingência (conferir DJEN e painel à mão).
2. **Escada de alertas** por regra do sistema (push, WhatsApp, e-mail), sem depender do suporte.
3. **Chamado "prazo em risco"** sobe ao topo da fila no horário comercial; meta [a confirmar]: 1 hora útil.
4. **Incidente da plataforma** (captura parada para vários escritórios): equipe técnica, página de status e aviso, também fora do horário em **melhor esforço** [a decidir, P2].

**Horário do chat:** dias úteis, 8h às 18h de Brasília [hipótese]; fora dele o chamado entra na fila e a tela avisa (`fora_do_horario`, Fundações 25).

**Por que não plantão humano:**

- **Promessa errada.** Plantão de "prazo fatal" sugere garantia; a responsabilidade é do advogado (JR6) e a regra é nunca prometer "zero perda de prazo".
- **O suporte não pode agir.** Quem dá ciência, protocola e confirma o fatal é o advogado inscrito (regra 2).
- **O que falha é a captura**, vigiada por máquina, mais rápida e barata que pessoa.
- **Conta (ilustração).** 24 horas por 30 dias são 720 horas; a R$ 90 por hora, **R$ 64.800 por mês**. O suporte do Estudo é R$ 14,66 por assento (R$ 12,50 de atendimento, R$ 2 de chat, R$ 0,16 de assistente). No cenário base do JU-05 (42 escritórios no mês 12; média de 3,5 usuários no mix 50%, 40%, 10%) são cerca de 147 assentos, ou **R$ 2.155 por mês** de suporte inteiro: o plantão custaria **30 vezes** isso. R$ 12,50 equivalem a cerca de 2 horas de atendimento por mês para cada 15 usuários (Estudo 6.8.9).

**Reconsiderar** se o piloto mostrar muitos chamados P1 fora do horário [a confirmar]; seria **complemento pago e opcional**, nunca embutido.

### 4.3 Prioridades

| Prioridade | Exemplo | Primeira resposta (hipótese **[a confirmar]**) |
| --- | --- | --- |
| **P1** | Prazo em risco; captura parada; não consigo dar ciência ou confirmar | 1 hora útil |
| **P2** | Não consigo entrar; importação travada; calendário errado | 4 horas úteis |
| **P3** | Dúvida de uso | 1 dia útil |

O R$ 12,50 é de regime; nos três primeiros meses do jurídico (migração, captura, regras) o uso é maior, e o piloto mede se o "alto" (R$ 25) é o que vale.

### 4.4 Divergência de contagem e "recall" de regra

Chamado "**conta diferente**": (1) a equipe reproduz com a **memória de cálculo** (JU-03 2.6); (2) uma **advogada de referência** (a da família até o lançamento; depois, por horas, custo [a confirmar]) diz quem está certo; (3) se o **sistema errou**, corrige-se a regra (nova versão) e, como cada Prazo guarda a **versão da regra e do calendário**, a plataforma **lista os Prazos calculados com a versão errada** e **avisa cada escritório afetado** por cartão urgente, no mesmo dia [meta a confirmar]; (4) o caso entra no gabarito.

### 4.5 Incidentes e comunicação

**Página de status** pública com a saúde da captura **por fonte e tribunal** (o painel global já a vê, JU-03 3.6). Fonte pública instável (como DJEN e eproc já estiveram, J1) gera **aviso preventivo** ("confira diretamente até nova ordem"). **Pós-incidente:** relato curto, sem culpa, com causa, alcance e correção, em [a confirmar] dias úteis.

### 4.6 Base de ajuda e FAQ jurídica

**Estrutura:** Primeiros passos; Importar meus processos; Prazos (como contamos; "fatal", "final" e margem interna; dobro; recesso); Intimações e captura (atrasada, parada, o que fazer); Domicílio Judicial (por que o sistema não "abre" a citação); Processos e Casos; Honorários; App do cliente; **Segurança e sigilo**; Planos; **Glossário "juridiquês em linguagem simples"**.

**Primeiros itens:** "Por que a data é diferente da do meu sistema antigo?"; "O que é prazo fatal aqui?"; "O que é o modo sombra?"; "A captura está atrasada: o que faço?"; "Posso confiar no prazo?" (resposta fixa: o sistema mostra a conta; o advogado confirma e responde); "Como peço acesso a um Caso restrito?"; "Como exporto tudo?"; "Quem protocola a peça?".

**Manutenção:** revisar os itens afetados a cada nova versão de regra ou calendário; medir com `suporte.faq.abrir` (Fundações 27); transformar as 20 perguntas mais repetidas do piloto em itens; partida de **30 a 40 itens** [premissa]; conteúdo **da plataforma**, igual para todos, **sem dado de cliente**; advogado de ética revisa os itens de publicidade e sigilo no lançamento.

### 4.7 Custo

Sem preço próprio: entra no sistema-base (D5). Duas diferenças a medir: a **fila de divergência** e a **advogada de referência** **não estão no R$ 12,50**; e o **primeiro trimestre** pesa mais que o regime. O piloto mede chamados por assento, por prioridade, e o quanto FAQ e assistente resolvem (Estudo 6.8.10).

---

## 5. Lançamento

### 5.1 Fases e portões

Os meses contam do dia em que o motor passar no gabarito (JU-03 E1) e a captura estiver de pé (E3); **sem datas de calendário**.

| Fase | O que acontece | Portão de saída |
| --- | --- | --- |
| **L0 · Pré-condições** (sem código, já) | Parecer; tratativa com o CNJ; tribunais do piloto; gabarito; amostras de exportação; FAQ em rascunho | Parecer recebido; gabarito validado |
| **L1 · Uso interno** | Sombra com a advogada da família; paciente zero | Portão de 3.3 |
| **L2 · Piloto fechado** | 10 a 20 escritórios; implantação assistida; sombra de 14 dias; 12 semanas de uso real | Critérios de 5.3 |
| **L3 · Lançamento controlado** | Lista de espera; entrada limitada pelas horas de implantação | Métricas de 5.4 estáveis |
| **L4 · Aberto** | Venda livre; módulos de lei conforme o gate por especialista (JU-04 6.4) | n/a |

**Especialista de área só no L3** (D3): o piloto usa módulos com gate interno; antes de vender cada módulo, o especialista confere (JU-04 6.5).

### 5.2 O piloto

**Composição.** A advogada da família e **10 a 20 escritórios de 1 a 10 usuários** (JU-05 5.8, Síntese 6.4). Hipótese: **4 a 6 solos, 5 a 10 pequenos, 1 a 3 médios**. Obrigatório: **um escritório de cada origem principal** (Astrea, ADVBOX, Projuris, planilha, o sistema da família); **dois com sócio único**; áreas das primeiras ondas (Civil, Família, Trabalhista e Previdenciário, Consumidor; J9); **tribunais da advogada e um TRT** (JU-03, P7). Recrutamento: rede da advogada, contadores do Contábil e do contador da família, subseções da OAB [a confirmar]; pelo menos metade **fora da rede dela**.

**Termo de piloto.** Parecer antes; termo de operador; consentimento para medir uso (sem ler Caso); **nenhum Caso no benchmark global**; direito de sair e exportar tudo. **Preço do piloto: decisão do usuário (P4).**

**Custo (teto, sem receita).** Com o mix 50/40/10 do JU-05, são **cerca de 23 horas de implantação por escritório** (0,5 × 13,3 + 0,4 × 29 + 0,1 × 48), ou **R$ 2.075**. Para 10 escritórios: **R$ 20,7 mil**; para 20: **R$ 41,5 mil**. Mais os fixos do pacote (R$ 6 mil por mês, JU-05 5.3) por cerca de 4 meses (4 de sombra e 12 semanas de uso real): **R$ 24 mil**. **Teto: R$ 44,7 mil a R$ 65,5 mil** se tudo for grátis.

### 5.3 Critérios de saída do piloto

Metas **são hipóteses**; o piloto as mede e o usuário decide.

| Área | Critério |
| --- | --- |
| **Prazo** | **Nenhum prazo perdido por falha do sistema**; gabarito a 100%; divergências de sombra explicadas; **recall de regra** testado em simulação |
| **Captura** | Saúde "ok" em pelo menos [a confirmar]% do tempo; nenhuma publicação perdida na conciliação com a segunda fonte; contingência de 72 horas simulada |
| **Sigilo** | Teste de vazamento entre Casos restritos com zero (JU-01 6.5); nenhum Caso no benchmark global; parecer recebido |
| **Migração** | Virada em até 30 dias em [a confirmar]% dos escritórios; horas reais comparadas às de 2.8 |
| **Uso** | Advogados abrem a Hoje em [a confirmar]% dos dias úteis na semana 4 |
| **Suporte** | Chamados por assento e primeira resposta dentro da meta; parcela resolvida por FAQ e assistente |
| **Econômico** | Custo de captura por Processo abaixo do limite do JU-05; uso de IA frente a 50% do teto; adesão à IA frente a 60%; **disposição a pagar** |
| **Satisfação** | "Recomendaria?" no dia 30 e no 90 |

### 5.4 Métricas

Seis grupos: **segurança** (prazos perdidos por falha do sistema, "quase perdidos" do JU-03 E2, prazos sem dono); **ativação** (dias até a primeira publicação captada e até a virada); **uso** (Hoje aberta por dia útil, prazos confirmados por advogado); **suporte** (chamados por assento, P1 fora do horário, resolvidos por FAQ); **qualidade** (divergências de contagem por mil prazos, recalls); **econômico** (mensalidade recorrente, cancelamento, custo de captura por Processo, horas de implantação, adesão à IA).

### 5.5 Posicionamento contra Astrea, ADVBOX e Projuris

**Cautela.** Preço de concorrente vem de **blogs e comparativos, e as fontes divergem** (EasyJur e eLaw Adv têm duas tabelas; o ADVBOX Elite aparece a R$ 1.750 e a R$ 1.800; o Astrea estava em promoção em novembro). Tudo é **[a confirmar]** antes de virar material de venda, com **fonte e data**.

Comparação do JU-05 5.5 (resumida):

| Escritório | Nosso Integrado (Essencial) | Faixa de mercado (J1) | Leitura |
| --- | ---: | --- | --- |
| Solo | R$ 306 (R$ 250) | R$ 79 a R$ 377 | Dentro |
| Pequeno (5) | R$ 623 (R$ 395) | R$ 349 a R$ 499 (Projuris compartilhado, Astrea Smart R$ 439 cheio, ADVBOX R$ 450, EasyJur R$ 499) | **25% acima do topo**; Essencial dentro |
| Médio (10) | R$ 1.073 (R$ 682) | R$ 769 a R$ 990 | 8% acima; Essencial abaixo |

**Mensagem central:** **não somos "o mais barato"**; trazemos **o que o concorrente vende à parte ou não mostra** (JU-05 5.7; J1; J8): (1) **CRM e WhatsApp no mesmo cadastro** do processo, prazo, horas e financeiro; (2) **financeiro de advocacia** (êxito, sucumbência, partilha, repasse, conta de terceiros), que nenhum sistema estudado documenta em público; (3) **saúde da captura**, que nenhum fornecedor lido mostra; (4) **comprovante de tempestividade e memória de cálculo** (só o Legalcloud guarda documento oficial do tribunal); (5) **preço previsível, exportação completa e IA com citação conferida**.

| Concorrente | Fortes (evidência) | Queixas de usuários (evidência **fraca**) | Nosso ângulo |
| --- | --- | --- | --- |
| **Astrea** | Base grande, simplicidade, grátis por 1 ano (40 processos), app; sem CRM nativo nem API pública [a confirmar] | Busca com falha recorrente, suporte, mudanças unilaterais | "Passou de 40 processos e quer CRM e honorário no mesmo lugar, com captura vigiada"; **não competimos com o grátis** |
| **ADVBOX** | Foco em volume; 1.000 processos por R$ 220; CRM; IA à parte (a partir de R$ 200 por mês) | Taxa de ativação; promessa diferente do contrato; falha de notificação | Previsibilidade; **não competimos nos 1.000 processos a R$ 220** (JU-05 5.7) |
| **Projuris ADV** | Marca Softplan; solo R$ 79; WhatsApp com agente; Peticiona; honorários com NFS-e; API | Complexidade inicial; suporte lento | Honestidade: **o protocolo é do advogado**; vantagem em saúde da captura e êxito |

**Cuidados.** A publicidade da advocacia (Provimento 205/2021) vale para advogados, mas nossos textos **não sugerem aval da OAB nem substituição do advogado** (Síntese 7.3; Res. CFOAB 16/26 [a confirmar]). Citar concorrente pelo nome: só com fonte, data e revisão de advogado; propaganda comparativa [a confirmar].

### 5.6 Canais

| Canal | Como | Cuidado |
| --- | --- | --- |
| **OAB** (seccionais, subseções, caixa de assistência) | Oficinas sobre prazo e sigilo; convênios [a confirmar se existem] | Nunca sugerir aval |
| **Contadores do Contábil** | O contador indica o Jurídico aos clientes que são escritórios de advocacia; o contador da família no piloto | **Sem comissão** (as simulações usam 0%) |
| **Comunidade** | Comitê de escritórios do piloto, webinars, depoimentos; a indicação pesa no setor (depoimentos de fornecedores, evidência fraca) | Depoimento autorizado; sem promessa de resultado |
| **Teste de 14 dias em modo sombra** | Inscrição OAB e DJEN público, **sem dado de Caso**; mercado: 7 a 10 dias (J1) [a confirmar] | Aviso "não confie nesta data" |

### 5.7 Vendas cruzadas com o Contábil e o BPO

Regra da plataforma: **um cadastro, um login, uma fatura** (Síntese 2; Fundações 26).

1. **Jurídico mais Contábil no mesmo escritório de advocacia** (lacuna 7 de J1, **hipótese não verificada**): DRE, ISS e retenções, folha.
2. **Contábil para Jurídico:** o contador acompanha o **CNPJ do cliente no Domicílio** (Síntese 2); chegando uma citação, **avisa o cliente para procurar advogado**. O **módulo trabalhista** tem sinergia com o Departamento Pessoal (Síntese 6.1). **Compartilhar Caso entre escritórios** exige sigilo próprio: candidato futuro (SG-028).
3. **BPO financeiro para escritório de advocacia:** possível, mas **o BPO não pode ver o que é sigiloso**. Hipótese: vê **valores e datas**; o **nome do cliente do advogado só com autorização**; conta de terceiros só como registro, sem o BPO mexer em dinheiro (H3 do JU-05). **Parecer** antes de vender [a confirmar].
4. **Ordem:** não vender o Jurídico como segundo produto antes de BPO e Contábil estáveis (D2).

### 5.8 Riscos de reputação: o prazo perdido

Um prazo perdido é irreversível, pessoal para o advogado e público na profissão.

| Cenário | Como evitamos | Como respondemos |
| --- | --- | --- |
| **Conta errada** (regra ou calendário) | Gabarito a 100%, sombra, recontagem independente, versão da regra em cada Prazo | **Recall de regra** (4.4); dossiê da memória de cálculo |
| **Captura parada sem alerta** | Monitor 24 horas, segunda fonte, conciliação diária, contingência de 72 horas | Aviso imediato, recaptura retroativa, relato |
| **Fonte pública fora do ar** | Aviso preventivo, página de status | Comprovante de indisponibilidade guardado (JU-03 2.6) |
| **Alerta visto e ignorado** | Escada, revisor, cobertura de ausência | Registro de quem viu o quê; sem culpa pública |
| **Prazo importado errado** | Conferência 100%; só recálculo | Reversão do lote |
| **Vazamento de sigilo** | Compartimento por Caso, canários, parecer | Plano de incidente com aviso aos afetados e à ANPD no que couber [a confirmar] |
| **IA inventa citação** | Citação conferida, abstenção, revisão registrada (JR5) | Trilha de IA por Peça; bloqueio de protocolo |
| **Promessa exagerada na venda** | Roteiros revisados | Correção por escrito; reembolso por política [a decidir] |

**Se a falha for nossa**, o compromisso mínimo proposto: avisar no mesmo dia; entregar o dossiê; **preparar o rascunho do pedido de devolução de prazo** (já previsto como "prepara, pessoa conclui" no JU-04). Indenização e seguro dependem de **parecer e seguro de responsabilidade civil** (JU-03 6.3) e **não são prometidos** em material de venda.

**Não fazemos no lançamento:** plantão 24 horas; peticionamento automático; robô logado em tribunal; "zero perda de prazo"; migração de departamento jurídico; envio de processo sigiloso a fornecedor.

---

## 6. O que depende de pessoas de fora

| Quem | O que precisamos | Quando | Se não vier |
| --- | --- | --- | --- |
| **Advogada da família** | Validar fluxo e gabarito; confirmar "prazo fatal"; revisar FAQ; ser paciente zero; **dizer qual sistema usa** (custo [a confirmar]) | L0 a L2; depois consultora por horas | Sem gabarito, sem piloto |
| **Contador da família** | Aritmética dos prazos e tributos de honorários; **não é selo jurídico** (JU-04 6.4) | L0 e L1 | Tributo de honorário não é vendido |
| **Advogado de parecer** | Sigilo, LGPD, termos, responsabilidade, seguro, envio do número a terceiro, propaganda (custo [a confirmar]) | **L0, antes de caso real** | Nenhum dado real entra |
| **Especialistas por área** (sete grupos, J9) | Gate e gabarito por módulo de lei (custo [a confirmar]) | Antes de vender cada módulo | Módulo sai como "base mínima" ou não sai |
| **CNJ e tribunais** | Res. 574/2024 (DataJud comercial), DJEN, Domicílio, termos de consulta | L0 | Fornecedor pago só para ativos |
| **Escritórios do piloto** | Tempo, exportações, feedback | L2 | Migração sem validação por origem |
| **Corretor ou seguradora** | Seguro de responsabilidade civil (custo [a confirmar]) | Antes de L3 | Venda sem seguro é decisão do usuário |

**Risco de dependência.** A advogada e o contador da família são **a mesma casa**: a validação **não é independente**. O gate por **especialista de fora** (D3) e o **advogado de parecer** corrigem isso; e o piloto precisa de escritórios **fora** da rede dela.

---

## 7. Ajustes pedidos, ordem de construção e perguntas

### 7.1 Ajustes pedidos a outros documentos

| Documento | Ajuste |
| --- | --- |
| **Fundações (01)** | Entidade **Lote de importação** e eventos `importacao.lote.*`; **Item de FAQ** com `produto = juridico` e etiqueta de revisão por advogado; etiquetas de chamado **"prazo em risco"** e **"conta diferente"**; molde da trilha do Jurídico (4.8); **página de status**; retenção e exclusão dos arquivos de origem |
| **JU-01 (dados)** | Processo e Prazo com `origem = importado`, `lote_id`, `valor_da_origem`, `conferido_por`; Caso restrito por padrão na importação; campo "fatal na origem" separado de `prazo_fatal`; Processo "sem número válido" |
| **JU-02 (painel)** | Telas **Importar** (assistente, planilha, lista CNJ, relatório, reversão) e **Modo sombra** (comparação lado a lado); checklist de 30 dias na Hoje; aba **Suporte** com FAQ jurídico; escritório de treino |
| **JU-03 (prazos)** | Prazo com `modo = sombra`; **recall de regra** por versão; fornecedor proibido para Processo sigiloso; enriquecimento da importação plugável; DJEN retroativo [a confirmar] |
| **JU-04 (motor)** | Suporte e assistente de ajuda não respondem pergunta jurídica; divergências alimentam o gabarito; módulos por fase do piloto |
| **JU-05 (preço)** | Horas por origem (2.8) a medir; **custo do piloto** (5.2); suporte jurídico fora do R$ 12,50; limite de novos escritórios pelas horas de implantação (cenário base: 78 horas por mês) |
| **Estudo de Precificação e JU-12** | Suporte N2 jurídico e piloto como linhas de caixa; premissa de suporte "alto" nos três primeiros meses; receber o posicionamento (5.5) |

### 7.2 Ordem de construção

Depois do BPO (D2). I0 e I1 não são código e podem andar já.

| Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- |
| **I0** | **Sem código:** contas de avaliação; exportação de amostra da advogada; parecer; tratativa com o CNJ; FAQ em rascunho | Nada | Parecer; exportações guardadas |
| **I1** | Planilha-modelo e **mapa de campos** por origem | I0 | Advogada lê o mapa |
| **I2** | **Importador por CNJ** com lote, relatório e reversão | JU-01 Processo; JU-02 T2 | Importação de teste com a amostra da família |
| **I3** | Pessoas, Partes e Mandatos; duplicados e homônimos | I2; conflito (JU-02 T7) | Contagem |
| **I4** | **Prazos abertos** recalculados; **modo sombra** e comparação | JU-03 E1; I3 | Gabarito; sombra da advogada |
| **I5** | Andamentos, honorários, horas e documentos | I2; JU-05 F0 a F2 | Soma das parcelas em centavos |
| **I6** | **Trilha de 30 dias**, treinamento, escritório de treino | I4, I5; Fundações 4.8 | Piloto interno (família) |
| **I7** | **Suporte jurídico:** FAQ, etiquetas, fila de divergência, **recall**, página de status | JU-03 3.6 e 2.6 | Simulação de incidente |
| **I8** | **Piloto fechado** (L2) | I6, I7; parecer; JU-03 E3 | Critérios de 5.3 |
| **I9** | **Lançamento controlado** (L3) e canais | I8; gate por especialista | Métricas de 5.4 |

### 7.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| P1 | Quanto dura o **modo sombra** e ele vale para todo escritório novo? | Portão: 4 semanas e 30 prazos reais, zero divergência sem explicação; por escritório: 14 dias, dispensável só com aviso de risco assinado | "O sistema calcula em silêncio por um mês ao lado do sistema da advogada, e cada escritório novo faz duas semanas disso?" |
| P2 | **Plantão de prazo fatal** com pessoas? | **Não**: monitor 24 horas, escada de alertas, fila prioritária no horário comercial; plantão só como complemento pago, depois de medir | "Não teremos gente de plantão de madrugada; o sistema vigia sozinho e avisa o advogado?" |
| P3 | **Horário e metas** do chat | Dias úteis, 8h às 18h; resposta em 1 hora (P1), 4 horas (P2), 1 dia (P3) | "Atendemos em dias úteis, das 8h às 18h, e o que envolve prazo vai para a frente da fila?" |
| P4 | **Piloto**: tamanho e preço | 10 a 20 escritórios; implantação ao custo ou reduzida; teto de R$ 44,7 mil a R$ 65,5 mil se tudo for grátis | "Começamos com 10 a 20 escritórios, e você decide quanto do custo o piloto cobra?" |
| P5 | **Importar tudo, monitorar só os ativos**? | Sim; processo sigiloso nunca vai a fornecedor | "Trazemos todos os processos, mas pagamos acompanhamento só dos que estão andando?" |
| P6 | O **sistema antigo fica ligado** até a virada e 14 dias depois? | Sim | "Ninguém cancela o antigo antes de confiar no nosso?" |
| P7 | **Arquivos de migração** apagados após a virada? | Sim, em 30 dias, sujeito ao parecer | "Apagamos o que o escritório nos mandou um mês depois de ele passar a usar o sistema?" |
| P8 | **Teste grátis** de 14 dias em modo sombra, sem dado de Caso? | Sim | "O escritório testa duas semanas só com os avisos públicos, sem mandar dado de cliente?" |
| P9 | Posicionamento: "o que está no preço", não "mais barato"? | Sim; concorrente só com fonte, data e revisão de advogado | "Dizemos o que temos a mais, e não que somos mais baratos?" |
| P10 | Canais: OAB e contadores do Contábil primeiro, **sem comissão**? | Sim | "Começamos pela OAB e pelos contadores que já conhecemos, sem pagar comissão?" |
| P11 | Se **o sistema errar um prazo**, o que prometemos? | Aviso no mesmo dia, dossiê e rascunho do pedido de devolução; o resto depende de parecer e seguro | "Se o erro for nosso, avisamos na hora e ajudamos a pedir o prazo de volta; indenização só após o parecer?" |
| P12 | **Advogada de referência** para dúvidas de contagem após o lançamento? | A da família até lá; depois, contratada por horas | "Quando o cliente disser que a conta está diferente, uma advogada nossa confere?" |
| P13 | **Limite de novos escritórios por mês** no lançamento controlado | Só o que as horas de implantação aguentarem (cerca de 4 por mês no cenário base) | "Só aceitamos tantos escritórios novos quanto conseguimos implantar bem?" |

---

## Ressalvas

- **O que cada sistema de origem exporta não foi verificado**; só páginas públicas foram lidas (J1, J7, J8). Os caminhos por origem são hipóteses até testar contas de avaliação e a exportação da advogada.
- **Preços de concorrentes** vêm de blogs e páginas de fornecedores e divergem; avaliações de usuários são poucas e antigas.
- **O sistema da advogada da família não está confirmado** (SGJur, ou o parecido SIJUR, J7); SAJ ADV parece ter virado Projuris ADV (J8).
- **Horas, suporte, tamanho do piloto, metas e prazos de resposta** são premissas sem medição; o piloto existe para medi-las. Os cálculos de plantão e de piloto são **aritmética sobre premissas** do JU-05 e do Estudo, não orçamento.
- O teste do DataJud foi em **um** tribunal (8/11/2026); o uso comercial depende da Res. CNJ 574/2024 e de parecer.
- **Normas** citadas (Provimento 205/2021, Res. CFOAB 16/26, Res. CNJ 574/2024, LGPD) vêm dos relatórios e **não foram lidas em texto oficial**. Responsabilidade, seguro, propaganda comparativa e indenização são **pareceres a obter**.
- **A validação da advogada e do contador da família não é independente**; a conferência por especialista de fora é condição do lançamento.

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].

## Decisão do usuário (9/11/2026, terceira rodada)

**Piloto de 1 a 5 escritórios** (advogados que o Enzo conhece; a advogada da família tem um escritório grande), no lugar de 10 a 20; os escritórios talvez paguem um valor simbólico. O custo cai em proporção e passa a separar **dinheiro de caixa** do **valor do tempo da equipe** (números no JU-12 v0.3). Os critérios de saída e as métricas seguem os mesmos, com amostra menor.
