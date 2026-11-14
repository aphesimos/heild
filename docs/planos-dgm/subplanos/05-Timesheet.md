# Subplano 05 · Timesheet

**Versão 0.1 · 7/11/2026 · documento de desenho funcional, anterior a design visual e stack.**

Detalha a seção 4 do [Desenho do Sistema](../Desenho_do_Sistema.md) (v0.3) e as decisões 10 a 12 da seção 10. Constrói sobre as [Fundações](01-Fundacoes.md) (2.5, 4.6, 4.8, 5, 6, adendos 13 a 15), o [Time de agentes](02-Time-de-Agentes.md) (4.7, 12.2, 13, 14), o [Painel](03-Painel.md) (2.0, 6.11, 7.3) e o [CRM](04-CRM.md) (9). Referências: pesquisa [S2](../../pesquisa/plataforma/S2-captura-de-tempo.md), cores em [B6](../../pesquisa/plataforma/B6-cores-e-ferramentas.md) e [V3](../../pesquisa/plataforma/V3-mercado-core.md), IDs do [atividades.json](../../pesquisa/plataforma/atividades.json).

Convenções: "sessão" é a sessão de trabalho das Fundações 5.4; "pessoa" é usuário humano; "integrante" é agente; horas em decimal. O que está aberto vai para 12.3 com a hipótese adotada.

---

## 1. Escopo e princípios

### 1.1 O que o Timesheet entrega

1. As **cinco fontes** de tempo (seção 2) e a captura externa que as Fundações não cobrem: extensão de navegador, conectores dos cores, inferência por artefato, confirmação assistida.
2. A **normalização dos cores**: equivalência com o catálogo, fila "sem equivalente", dedupe com a plataforma (seção 4).
3. A **tela**: item lateral Timesheet com as abas Meu tempo, Equipe, Rentabilidade, Confirmações (seção 8).
4. A **análise**: indicadores, rentabilidade por cliente, capacidade, horas poupadas pelos integrantes (seções 7 e 9).
5. A **governança**: termo, lista de domínios, retenção, contestação (10) e qualidade dos dados (11).

Atividades cobertas: GES-047 (captura pela plataforma, fase 0), GES-048 (cores, fase 2), GES-050 (reuniões, fase 3), GES-051 (revisão do dia, fase 3), GES-052 e 053 (ponto e fora da jornada), GES-054 (LGPD, fase 0), GES-055 (custo-hora), GES-056 (tempo da IA, fase 0), GES-013 a 016, 102, 402 a 404 (rentabilidade, produtividade, capacidade, precificação). GES-049 (agente de desktop) está descartada.

### 1.2 O que vem das Fundações

| Já existe (F6) | Este subplano acrescenta |
| --- | --- |
| Sessão de trabalho com origem, confiança, evidências, corte, contestação; regras 1 a 9 de 5.4; reconstrução determinística | Os produtores das origens `extensao`, `core`, `artefato`, `confirmacao`; casos de borda (6); refinamentos (12.2) |
| `tarefa.iniciar`, `.pausar`, `.concluir_por_evidencia`, `tela.navegar`; `timesheet.listar_sessoes`, `.confirmar`, `.contestar`, `.decidir_contestacao`, `.reconstruir` | A tela que os chama; ferramentas novas (12.2) |
| Tabela de equivalência (5.6), `catalogo.configurar_atividade` | O conector por core, a fila, a sugestão automática |
| Sessão de integrante com custo (9, adendo 13) | A série separada e as horas poupadas |
| Inatividade (2.5) com `atividade.pulso` previsto; `horas_100` e `horas_padrao_cliente` (4.6) | O produtor do pulso; a estimativa por artefato e a calibração |

### 1.3 Regras herdadas

| # | Regra | De onde | Consequência |
| --- | --- | --- | --- |
| H1 | Abrir a tarefa inicia o tempo, sem clique a mais | Desenho 10; Painel 7.3 | A tarefa aberta é a primeira pista de cliente e atividade para toda fonte externa |
| H2 | Sessão de menos de 60 s sem ação é descartada | Painel 7.3 | Vale para toda origem |
| H3 | Inatividade de 2 a 5 min coloca a tela em modo de espera (sem logout, só onde o tempo é registrado sozinho); a sessão encerra no último evento | Desenho 4.4; Fundações 2.5 | A extensão existe para não cortar o tempo no portal |
| H4 | Colaborador vê e contesta o próprio tempo; o Gestor decide | Desenho 10 | Aba Meu tempo |
| H5 | Trabalho de integrante em série separada | Desenho 10 | Nunca soma com horas humanas |
| H6 | Colaborador vê a porcentagem do próprio limite de IA; tokens e custo só para Gestor e Administrador | Fundações adendo 14 | Meu tempo mostra o percentual |
| H7 | Nada se apaga; correção é evento novo | Fundações R7 | Confirmar e contestar criam sessão nova com `substituida_por` |
| H8 | Conteúdo externo é dado; tudo passa por ferramenta tipada | Fundações R5, R1 | Título de página, nome de tarefa do core e de arquivo nunca viram instrução; extensão e conectores chamam ferramentas |

### 1.4 O que foi descartado e por quê

**Coletor Windows de título de janela** (GES-049, S2 opção b), descartado em 7/11/2026 (Desenho 4.4): o título do core nem sempre diz a empresa aberta, e "esteve no Domínio das 10h às 11h" sem cliente não serve; instalador, antivírus e atualização custam mais do que a cobertura que trazem; é a parte mais parecida com vigilância e a mais pesada na LGPD. A atribuição vem da tarefa aberta (H1); trabalho no core sem tarefa aberta e sem sinal da extensão entra como estimado, para confirmação.

**Licenciar TimeCamp ou WiseTime** (S2, item 6): coletores de janela com outro nome. **Apontamento manual livre**: não existe em tela alguma.

---

## 2. As cinco fontes, em detalhe

| # | Fonte (origem) | O que captura | Cliente e atividade | Confiança | Se falha | Privacidade |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Eventos da plataforma** (`plataforma`) | Toda ferramenta, `tela.navegar`, atendimento no CRM, ação de integrante | Da tarefa aberta; sem tarefa, `campo_cliente` e `atividade_padrao` da ferramenta; na conversa, a etiqueta (CRM 9.1) | `automatica` | Não falha; o que falta é cobertura | Metadados de ação, sem conteúdo |
| 2 | **APIs dos cores** (`core`) | Tarefas do módulo de processos: nome, empresa, departamento, responsável, status, prazos, conclusão, horas apontadas quando existem | Pela equivalência (4) | `confirmada` quando casa com sessão da plataforma; `estimada` quando não | Sem token ou sem equivalente: evento guardado, sem sessão, até o Gestor classificar | Metadados de tarefa que o escritório já tem |
| 3 | **Extensão de navegador** (`extensao`) | Pulso de atividade na aba ativa em domínio da lista; CNPJ detectado | Tarefa aberta; senão CNPJ da URL, do título ou do elemento de identificação; senão cliente selecionado | Pulso não cria sessão; confirma a tarefa aberta ou vira candidato de confirmação | Sem extensão: a sessão corta por inatividade e o tempo no portal fica para 4 ou 5 | Lista fixa de domínios; envia só o pulso e o identificador do cliente, nunca conteúdo, formulário, senha ou URL fora da lista (3) |
| 4 | **Inferência por artefato** (`artefato`) | Arquivo do core na pasta do cliente, guia, SPED ou recibo, e-mail enviado, documento registrado | Cliente do artefato; atividade pelo tipo | `estimada`, duração `horas_100 / 100` ou `horas_padrao_cliente` | Artefato sem cliente vai para "sem classificação" | Só metadados do índice |
| 5 | **Confirmação assistida** (`confirmacao`) | Intervalos sem sessão, pulsos sem tarefa, artefatos ambíguos, conflitos de cliente | Pré-preenchido com o mais provável; a pessoa confirma, corrige ou descarta | `confirmada` | Não confirmado em 7 dias: "sem classificação" para sempre | A pessoa vê só o próprio dia; nunca texto livre obrigatório |

No mesmo intervalo da mesma pessoa, vale 1 > 2 > 3 > 4 > 5 para **duração** e a mais específica para **cliente** (tarefa > CNPJ detectado > cliente do artefato > cliente selecionado). Fonte inferior nunca sobrescreve superior: confirma (vira evidência) ou abre item de confirmação quando discorda.

---

## 3. Extensão de navegador

### 3.1 Para que serve

Três coisas, nesta ordem de valor: **manter a sessão viva** enquanto a pessoa trabalha num portal (H3); **confirmar ou corrigir o cliente** da tarefa aberta pelo CNPJ que o portal mostra; **gerar candidatos** de confirmação quando há trabalho em portal sem tarefa aberta. Não registra tempo por si, lê a página só para identificar o cliente e não envia conteúdo (3.3), não roda fora da lista.

### 3.2 Domínios da primeira versão

A lista é **dado versionado pela plataforma**, não código: o Administrador a vê, desliga domínios e pede inclusões. Domínios exatos se conferem na implementação.

| Portal | Domínio principal (a conferir) | Onde o cliente aparece | Atividade sugerida sem tarefa |
| --- | --- | --- | --- |
| e-CAC, com DCTFWeb e EFD-Reinf | `cav.receita.fazenda.gov.br` | Elemento de identificação ("procurador de"); não está na URL nem no título | FIS-005, FIS-006, FIS-019, FIS-020 pelo caminho |
| Simples Nacional (PGDAS-D, DAS, DEFIS, SIMEI) | `www8.receita.fazenda.gov.br` | Título ou elemento de identificação após a troca de perfil | FIS-009, FIS-010, FIS-016 |
| eSocial web e FGTS Digital | `login.esocial.gov.br`, `www.esocial.gov.br`, `fgtsdigital.sistema.gov.br` | Elemento de identificação | DP-016, DP-006, DP-018 |
| SEFAZ de SP, MG, PR, SC, RS e seus DTEs | `portal.fazenda.sp.gov.br`, `www.fazenda.mg.gov.br`, `www.fazenda.pr.gov.br`, `www.sef.sc.gov.br`, `www.sefaz.rs.gov.br` e subdomínios | IE ou CNPJ na URL (frequente) ou no título; DTE pelo elemento | FIS-024; FIS-026 (DTE) |
| NFS-e nacional e portais municipais | `www.nfse.gov.br`; lista por município mantida pela plataforma | CNPJ ou inscrição municipal na URL, no título ou no elemento | NFE-008, FIS-028 |
| Onvio e Domínio web | `onvio.com.br` e o domínio do escritório na nuvem da TR | Empresa no título ou na URL | A da tarefa aberta; sem tarefa, confirmação |

Fora da lista: Junta Comercial, Redesim, bancos, Gov.br, qualquer outro site. Entram depois, por pedido, pela lista versionada.

### 3.3 Como infere o cliente

Ordem de prioridade; a primeira que responde vence, as seguintes confirmam ou geram conflito:

1. **Tarefa aberta** (H1), lida da plataforma por `timesheet.contexto_atual` (12.2).
2. **CNPJ ou IE na URL**, normalizado (CNPJ alfanumérico aceito) e resolvido por `identidade.resolver` estendida a CNPJ.
3. **CNPJ no título da aba**.
4. **Leitura da página para identificar o cliente**: decisão de 7/11/2026, a extensão **pode ler o conteúdo da página** nos domínios da lista, para achar o CNPJ, a razão social ou a inscrição que identificam o cliente (no e-CAC, o cabeçalho que diz de quem a pessoa é procuradora; no eSocial, o empregador selecionado). A leitura é local, só para identificar; a extensão envia à plataforma apenas o identificador encontrado e o pulso, nunca o conteúdo. Continua fora: campos de formulário, senhas, certificados, documentos abertos. O termo de ciência diz isso em uma frase.
5. **Cliente selecionado no painel**: confiança baixa, sempre vai para confirmação.

CNPJ que **discorda** da tarefa aberta: a sessão continua na tarefa e um item "cliente diferente do portal" entra na fila com as duas opções. CNPJ do próprio escritório (GES-061) ou de lead: sessão interna ou de lead.

### 3.4 O pulso de atividade

`atividade.pulso` é enviado quando a aba ativa está em domínio da lista, a janela tem foco e houve entrada do usuário (tecla ou clique, como **booleano**) nos últimos 60 s. Um por minuto, no máximo; sem entrada, nenhum.

| Campo | Conteúdo |
| --- | --- |
| usuario_id, sessao_auth_id | Sem login na plataforma, nada é enviado |
| portal | Nome da lista (`ecac`, `esocial`, `sefaz_sp`); nunca a URL |
| cnpj_detectado, metodo_deteccao | Se houver; url, titulo, identificacao, nenhum |
| em | Relógio do servidor |

O pulso adia o modo de espera (Fundações 2.5), estende a sessão da tarefa aberta (fim = último pulso ou evento) e confirma o cliente quando o CNPJ casa. **Não** abre sessão (Fundações 5.4, regra 3) e não conta como ação para os 60 s (H2). Sequência de pulsos **sem tarefa aberta** com CNPJ vira um **trecho de portal**: candidato de confirmação com cliente pré-preenchido, atividade sugerida pelo portal e duração do primeiro ao último pulso (5 min sem pulso fecham o trecho). Pedido A1.

### 3.5 O que nunca captura

Conteúdo de página além do identificador do cliente (3.3), campos de formulário, senhas, certificado digital (o navegador não expõe a extensões o certificado escolhido), URL completa, histórico, abas inativas, sites fora da lista, teclas, mouse, capturas de tela. Sem permissão de rede para outro destino além do domínio do escritório na plataforma; em disco, só um buffer de pulsos de até 24 h para falha de rede.

### 3.6 Instalação e consentimento

- **Chrome e Edge** (Manifest V3); Firefox e Safari depois.
- O Administrador liga a extensão para o escritório; cada pessoa instala pela loja e **vincula ao fazer login**; o vínculo mostra a lista de domínios e o que será enviado e pede ciência (10.1). Sem ciência, fica inerte.
- A pessoa **pausa** pelo ícone (30 min, até o fim do dia, até religar). A pausa é evento `extensao.pausar`, aparece no próprio Meu tempo e nunca como alerta ao Gestor: pausar é direito. O ícone indica "ativa neste portal" ou "fora da lista". Desinstalar não apaga nada.

### 3.7 Sem a extensão

Tudo funciona, com menos cobertura: a pessoa abre a tarefa, vai ao portal, a sessão corta por inatividade no último evento (a tela entra em espera). Ao voltar, "você estava em FIS-019 Empresa X; continuar?" e uma sessão nova começa, sem pedir senha; o intervalo vira item de confirmação pré-preenchido com a mesma tarefa. Para quem passa o dia no core desktop, a extensão não ajuda de qualquer forma: valem as fontes 2, 4 e 5.

---

## 4. Conectores dos cores

### 4.1 Contrato único

Um conector tem uma interface só: **listar tarefas alteradas desde um instante**, com os campos abaixo e `id_externo` estável. Cada core é um adaptador (B6, 2.5). O resultado vira eventos `core.tarefa.<status>` com `ator_tipo = core` (Fundações 5.6).

| Campo mínimo | Por quê |
| --- | --- |
| id_externo | Dedupe e correção |
| empresa (CNPJ), departamento, responsável (e-mail ou login) | → cliente, setor, usuário |
| tipo ou código da tarefa; competência | → atividade; ligação com a tarefa de obrigação |
| status com **data-hora de cada mudança** | Fim da sessão; a conclusão é a evidência |
| início real e horas apontadas, quando existirem | Duração sem estimativa |
| anexos (ids) | Artefatos (5) |

### 4.2 Alterdata (ePlugin)

Confirmado (V3 I-02): `GET /api/v1/integracao/historico-tarefas?dataInicial=&dataFinal=`, token Bearer do escritório, pacote eContador Master.

| Campo | Uso |
| --- | --- |
| nome | → `core_tipo_tarefa`; base da sugestão de equivalência |
| empresa, departamento, responsavel | → mapas de 4.6 |
| status (A fazer, Concluído, Atrasada, Risco de multas, Enviado) | `Concluído` e `Enviado` geram `core.tarefa.concluir`; os demais não geram sessão |
| dataConclusao; prazoEntrega, prazoLegal | Fim da sessão estimada e evidência; ligação com a tarefa de obrigação (competência e atividade) |
| início e horas: ausentes | Duração sempre `padrao` até a Alterdata expor os dois |

Leitura a cada 15 min para o dia corrente e varredura diária dos últimos 7 dias. `id_externo`: o id da API; senão hash de (nome, empresa, responsavel, prazoLegal). Limite de chamadas: perguntar (V3 4.1). O token fica no cofre e só o conector o usa.

### 4.3 Domínio / Onvio (a negociar)

Sem API de saída pública (V3 I-01). O Domínio Processos tem o que falta ("tempo de produção de cada tarefa", conclusão automática ao fechar a rotina). Pedir à Thomson Reuters, em ordem: (1) leitura de tarefas do Processos com os campos de 4.1, inclusive **início real** e **tempo de produção**; (2) consulta "alterado desde" ou webhook; (3) usuário por e-mail; (4) anexos por id; (5) código estável de departamento e de tipo de processo.

Enquanto não houver: o escritório exporta o relatório de produtividade do Processos (Excel) por semana e a plataforma o importa por `core.importar_relatorio` (12.2) como eventos `core.*` com `confianca_duracao = apontada` quando há tempo, `padrao` quando não.

### 4.4 Questor

O SYN é API de **entrada** (B6 2.1); saída do Tareffa não foi encontrada. Tratamento igual ao Domínio sem API; negociar leitura do Tareffa junto com o acesso de entrada.

### 4.5 Contmatic (sem API)

Nenhuma API pública (V3 I-03). Três caminhos somados:

| Caminho | O que dá | Confiança |
| --- | --- | --- |
| **Artefatos de arquivo**: o Phoenix grava guias, SPED, relatórios e recibos em pastas; o conector de armazenamento (Fundações 7) indexa a pasta do cliente e cada arquivo novo é um artefato | Que a tarefa foi feita, para qual cliente, quando, por quem (quando a nuvem informa) | `estimada` |
| **Relatório do módulo Gestão do Escritório** (planos Avançado e Elite), por `core.importar_relatorio` | Tarefas, responsável, status, datas | `estimada` ou `apontada` |
| **Confirmação assistida** com a tarefa aberta no painel | O tempo real | `confirmada` |

A cobertura esperada é menor (11.1) e a implantação diz isso antes de contratar.

### 4.6 Tabelas de equivalência

Uma por escritório e por core, em Gestão › Catálogo local (Painel 6.9), por `catalogo.configurar_atividade`.

| Mapa | Chave | Preenchimento | Quando falha |
| --- | --- | --- | --- |
| departamento → setor | Nome no core | Sugestão por nome ("Pessoal" → DP; "Legalização" → Societário); o Administrador confirma uma vez | "A classificar"; eventos guardados |
| responsável → usuário | E-mail; senão nome | Automático por e-mail; senão lista para casar | Evento com `usuario_dono_id` nulo; sessão nasce quando casar, retroativa |
| empresa → cliente | CNPJ ou CPF | Automático pelo cadastro único; empresa sem cliente vira sugestão "importar" | Sem sessão |
| tarefa do core → atividade | `core_tipo_tarefa` | Três sugestões por similaridade de nome e departamento; o Gestor escolhe; vale para o futuro e 90 dias para trás | Fila "sem equivalente" |

**Fila "sem equivalente"**: por core, nome da tarefa, departamento, ocorrências no mês, três sugestões, botões "é esta" e "não é trabalho medido". Ordenada por ocorrências; contagem na aba Equipe e aviso ao Gestor na implantação. Exemplos: "DCTFWeb mensal" → FIS-019; "Folha de pagamento" → DP-011; "Conciliação bancária" → CTB-015; "Balancete" → CTB-031; "PGDAS" → FIS-009.

### 4.7 Quando o core e a plataforma registram a mesma coisa

Chave de dedupe: **(usuário, cliente, atividade, janela)**.

| Situação | Resultado |
| --- | --- |
| Sessão da plataforma da mesma pessoa, cliente e atividade, encerrada até **4 h** antes ou depois da conclusão no core, no mesmo dia útil | O evento do core vira **evidência**; `confianca = confirmada`; nenhuma sessão nova |
| Mesma pessoa e cliente, atividade diferente | Evidência; item de confirmação só se o setor for outro; mesma subárea, confirma sem perguntar |
| Sem sessão da plataforma | Sessão `estimada` com fim na conclusão do core; duração `apontada` se o core trouxe horas; `medida` só se o intervalo entre início e conclusão no core for menor que um dia útil; senão `padrao` |
| Core com horas apontadas e plataforma com medida | A medida vale; diferença acima de 50% vira alerta de qualidade (11.3) |
| Tarefa da plataforma e do core com mesma competência, cliente e atividade | A conclusão no core fecha a da plataforma por evidência (Painel 7.6) quando a atividade é "faz sozinho" ou o Gestor ligou isso |
| Mesmo `id_externo` reentregue | Ignorado (Fundações 5.3) |

O refinamento de `confianca_duracao = medida` é o pedido A2.

---

## 5. Inferência por artefato e confirmação assistida

### 5.1 Catálogo de artefatos

Artefato é um evento que prova que um trabalho aconteceu, com cliente e hora, sem duração. Todos já são eventos das Fundações; aqui está a leitura deles.

| Artefato | Evento | Pessoa | Atividade sugerida |
| --- | --- | --- | --- |
| Arquivo do core na pasta do cliente | `documento.registrar` (origem nuvem) | Quem salvou, se a nuvem informa; senão responsável do cliente no setor | Pelo tipo: guia → FIS-031 ou DP-020; EFD ou ECD → FIS-023; balancete ou DRE → CTB-031; holerite → DP-019; resumo da folha → DP-012 |
| Guia emitida | `guia.emitir` | Ator | FIS-010 (DAS), FIS-021 (DARF), FIS-028 (ISS), DP-018 (GFD) |
| Recibo de transmissão | `obrigacao.transmitir` | Ator | A da obrigação: FIS-009, FIS-019, FIS-020, DP-016, FIS-013 |
| E-mail enviado | `mensagem.enviar` (canal e-mail) | Remetente | GES-027 ou a etiqueta da conversa |
| Documento classificado por pessoa | `documento.classificar` | Quem classificou | GES-026 |
| Certidão emitida; lançamentos exportados ao core | `certidao.emitir`; `core.exportar` | Ator | FIS-006 ou FIS-027; CTB-017 |

Regras:

1. Artefato com **sessão ativa** da mesma pessoa e cliente: evidência; não cria nada. Com sessão ativa de outro cliente: evidência mais item "cliente diferente".
2. Artefato **sem sessão**: sessão `estimada` centrada no horário (Fundações 5.4, regra 6), com a duração padrão, **aparada** para não invadir sessões vizinhas nem passar do horário de trabalho.
3. Vários artefatos da mesma pessoa, cliente e atividade em até **2 h**: uma sessão, do primeiro ao último mais meia duração padrão de cada lado, no máximo 2 × padrão.
4. Artefato gerado por **integrante ou sistema**: sessão de integrante (7), nunca estimativa humana.
5. Artefato sem pessoa identificável: nenhuma sessão; item de confirmação ao responsável do cliente no setor ("foi você?").

Duração padrão: `horas_100 / 100`, a hora média mensal de um cliente naquela atividade (Fundações 4.6). FIS-019 (15 h por 100 clientes) → 9 min; FIS-009 (25) → 15 min; CTB-015 (80) → 48 min; FIS-004 (40) → 24 min; DP-011 (20) → 12 min. `horas_padrao_cliente` sobrescreve quando a calibração (11.2) calculou outro valor; não é informada pelo escritório nem fica no perfil do cliente (P4).

### 5.2 Confirmação assistida (GES-051)

Uma **lista diária**, não um formulário. Aparece ao fim do dia (horário de fechamento do escritório, padrão 18h, pela central como `normal`) e na manhã seguinte, no login, como cartão na Home e na aba Confirmações. Quem não abre não é cobrado.

```
┌─ Confirmações · ontem, qui 6/11 · 5 itens · ~2 min ───────────────────────────┐
│ 10:05–10:45  40 min sem registro. Antes e depois: FIS-019 Empresa X.          │
│              [✓ era FIS-019 Empresa X]  [corrigir ▾]  [não era trabalho]       │
│ 11:20–11:50  e-CAC com CNPJ da Padaria Y (extensão), sem tarefa aberta.        │
│              [✓ FIS-005 Padaria Y]  [corrigir ▾]  [descartar]                  │
│ 14:30        Guia DAS da Empresa Z emitida; estimado 15 min (FIS-010).         │
│              [✓ confirmar 15 min]  [ajustar tempo ▾]  [descartar]              │
│ 15:10–16:40  Tarefa CTB-015 Empresa X aberta; portal mostrou Empresa W.        │
│              [✓ Empresa X]  [era Empresa W]  [dividir ▾]                        │
│ 17:00–17:50  Sem registro. Sem pista.                                          │
│              [cliente ▾] [atividade ▾]  [interno ▾]  [não era trabalho]        │
│                                                        [confirmar tudo marcado] │
└────────────────────────────────────────────────────────────────────────────────┘
```

Pré-preenchimento, por ordem de pista: tarefa aberta antes e depois do intervalo (se a mesma, probabilidade alta); CNPJ dos pulsos; cliente do artefato; conversa em atendimento no intervalo; cliente selecionado; responsável habitual do cliente no setor. "Corrigir" abre cliente, atividade, início e fim, todos em lista; nunca texto livre. "Interno" oferece reunião, treinamento, administrativo (pedido A3). "Não era trabalho" descarta sem explicação. Cada confirmação chama `timesheet.confirmar`; "confirmar tudo marcado" chama `timesheet.confirmar_lote` (12.2).

### 5.3 Limites para não virar apontamento disfarçado

| Limite | Padrão | Por quê |
| --- | --- | --- |
| Itens por dia por pessoa | **8** (ajustável de 4 a 12) | Acima disso é apontamento manual com outro nome |
| Ordem | Duração × probabilidade de acerto | Os 8 que mais valem o clique |
| O que sobra | "Sem classificação", visível em Meu tempo, sem pedir nada | Conta como lacuna na cobertura |
| Intervalo mínimo | 10 min | Buracos curtos são pausa natural |
| Validade | 7 dias; depois "sem classificação" definitivo | Memória de uma semana não vale o registro |
| Tempo da pessoa | < 3 min por dia (GES-051 estima 2 a 5); acima de 5 min por 2 semanas, o Gestor é avisado de que a captura está ruim | Medido entre abrir e fechar a lista |
| Texto livre | Nunca obrigatório; nota opcional só na contestação | Evita o relato |

Escritório com mais de 30% das horas por confirmação num mês tem problema de cobertura (extensão desligada, core sem equivalência, tarefas não abertas); a aba Equipe mostra isso como diagnóstico, não como falta da pessoa.

---

## 6. Regras de sessão aplicadas

Referência: Fundações 5.4, regras 1 a 9. Os casos de borda:

| Caso | O que acontece | Base |
| --- | --- | --- |
| **Troca de tarefa** | `tarefa.iniciar(B)` gera `tarefa.pausar(A)`; a sessão de A encerra no iniciar de B; a tela avisa; A volta a `em_andamento` sem dono aberto | Fundações adendo 14 |
| **Pausa explícita** (botão no cabeçalho) | `tarefa.pausar` pela pessoa; sessão encerra no clique; retomar é abrir de novo, sem a regra dos 60 s | Pedido A4 |
| **Inatividade sem pulso** | Modo de espera (sem logout); sessão encerra no último evento; ao voltar, "você estava em A; continuar?"; intervalo acima de 10 min vira item de confirmação | Fundações 2.5, 5.4 |
| **Inatividade com pulso** | Pulsos adiam o modo de espera; sessão se estende até o último pulso | 3.4 |
| **Atendimento no CRM com tarefa aberta, mesmo cliente** | Sessão da conversa sobreposta; a com tarefa vence; a etiqueta vira evidência | Fundações 5.4, regra 4 |
| **Atendimento no CRM com tarefa aberta, outro cliente** | A sessão da conversa, delimitada por eventos próprios (assumir → último evento), **corta a da tarefa nesse intervalo**; a tarefa continua depois. No intervalo há eventos da conversa e nenhum da tarefa; especificidade não decide entre clientes diferentes | Pedido A5 |
| **Reunião de calendário** (GES-050, fase 3) | Conector de calendário lê eventos com participante ligado a cliente e cria sessão `estimada` com a duração da reunião, GES-033 ou GES-045, para as pessoas do escritório presentes; tarefa "reunião com X" aberta torna a reunião evidência | Fundações 5.4, regra 6 |
| **Trabalho fora do horário** | Registra igual; marca `fora_da_jornada` pela política de GES-053; a pessoa vê; o Gestor vê relatório mensal agregado, nunca alerta por ocorrência; o termo diz que o timesheet não substitui o ponto | GES-052, 053 |
| **Duas pessoas na mesma tarefa** | A segunda vê "aberta por Fulano" e, ao confirmar, ganha sessão própria sem tirar a dele; `aberta_por_usuario_id` segue único; o cabeçalho mostra os dois; qualquer um conclui | Pedido A6 |
| **Tarefa de outro cliente aberta por engano** | "Não era esta" no cabeçalho: encerra e, se houve ação, abre "corrigir"; a original fica com `substituida_por`; abaixo de 60 s sem ação, descartada sozinha | H2, H7 |
| **Menos de 60 s sem ação** | Descartada; o evento `tarefa.iniciar` fica | Painel 7.3 |
| **Tarefa interna** | `cliente_id` nulo, atividade interna; entra em capacidade, não em rentabilidade | Fundações 5.4, regra 5 |
| **Sessão atravessa a meia-noite** | Cortada em duas, mesma evidência | Convenção |
| **Evento do core chega dias depois** | Reconstrução reprocessa o dia; confirmadas não mudam; estimadas podem virar confirmadas | Fundações 5.4 |

---

## 7. Trabalho dos integrantes como série separada

### 7.1 Sessão de integrante

Toda sessão de integrante (Fundações 9; 02, 4) vira sessão de trabalho com `ator_tipo = integrante`, `usuario_dono_id`, cliente e atividade da tarefa ou do evento que a acordou, e `custo`: tokens de entrada, saída e cache, classe do modelo, centavos ao preço vigente sem nomear provedor (02, 12.2), segundos de máquina, passos. Só os segundos de máquina são visíveis ao Colaborador. Um job sobre a carteira vira uma sessão por cliente tocado, com rateio do custo pelas ferramentas chamadas por cliente (pedido A12). Não há inatividade nem sobreposição.

### 7.2 Horas poupadas (GES-056)

Estimativa do tempo humano que a atividade levaria sem o integrante:

| Situação | Horas poupadas |
| --- | --- |
| Integrante **concluiu sozinho** (`tarefa.concluir` por integrante, ou por evidência com preparação dele e sem sessão humana) | `horas_100 / 100` (ou `horas_padrao_cliente`; ou a mediana medida de humanos na atividade, quando houver 20 sessões, 11.2) |
| Integrante **preparou, pessoa concluiu** | Estimativa humana menos o tempo humano medido na mesma tarefa; nunca negativo |
| Integrante só **avisou ou organizou** | Zero |
| Resposta no CRM resolvida sem pessoa | `horas_100 / 100` de GES-025 ou da etiqueta |

A unidade é hora, para caber ao lado das horas humanas; nunca se soma: "horas humanas 31 h · trabalho de agente 2,4 h de máquina · horas poupadas est. 6,1 h".

### 7.3 Como aparece

Em todo gráfico de horas o integrante é **série separada**, cor própria do tema, rótulo "agente", eixo próprio quando a escala difere. O Colaborador vê, em Meu tempo, o tempo de máquina dos seus integrantes, as horas poupadas e a **porcentagem do próprio limite** de 5 h e de 7 dias (H6); não vê tokens nem centavos. O Gestor vê, em Equipe, por integrante e dono: tempo de máquina, custo, passos, horas poupadas, aprovação sem edição (02, 14.1). Em Rentabilidade, o custo em centavos dos integrantes entra como **custo variável do cliente** (GES-010), somado ao custo humano, não às horas.

---

## 8. A tela

### 8.1 Esqueleto

Item lateral **Timesheet** (Painel 2.0), abas internas **Meu tempo · Equipe · Rentabilidade · Confirmações**. Colaborador vê Meu tempo e Confirmações; Gestor vê as quatro, para os setores que gere; Administrador vê tudo. O cliente selecionado filtra as quatro abas; "Todos" mostra a carteira.

**Filtros comuns** (Equipe e Rentabilidade): setor, cliente ou grupo, atividade (subárea e ID), pessoa ou integrante, período (dia, semana, mês, competência, intervalo), confiança, origem. Persistem por aba (`usuario.preferencias.filtros_por_aba`).

**Gráficos**: **um gráfico por pergunta**. O título é a pergunta, uma série por resposta, clicar leva à lista de sessões. O que não responde a uma pergunta é tabela.

**Exportação**: CSV das sessões filtradas (`relatorio.gerar`), PDF do relatório mensal (9.3) e, para o Administrador, exportação anonimizada para o benchmark (02, 14.2).

### 8.2 Meu tempo

```
┌─ Timesheet · Meu tempo · [dia] [semana] [mês] · ◂ qui 6/11 ▸ ─────────────────────┐
│ Hoje 7h20 registradas · 5h50 automáticas · 1h00 confirmadas · 0h30 sem classif.    │
│ Agente: 48 min de máquina · ~2,3 h poupadas · limite 5 h: 38% · 7 dias: 21%        │
│                                                                                     │
│ 08 ─┬─ 09 ─┬─ 10 ─┬─ 11 ─┬─ 12 ─┬─ 13 ─┬─ 14 ─┬─ 15 ─┬─ 16 ─┬─ 17 ─┬─ 18         │
│  ████████████▒▒▒▒░░░░████████████      ████████▓▓▓▓▓▓▓▓████████░░░░░░             │
│  FIS-019 X   est. ?   FIS-009 Y        CTB-015 X  GES-025 Z  FIS-004 X  sem cl.    │
│  ■ automática ▒ estimada ░ sem classificação ▓ atendimento (CRM)                   │
│                                                                                     │
│ 08:02–10:10  FIS-019 DCTFWeb · Empresa X · automática · tarefa + e-CAC    [contestar] │
│ 10:10–10:45  estimado · Empresa X? · 35 min sem registro        [confirmar] [corrigir] │
│ 10:45–12:00  FIS-009 PGDAS-D · Padaria Y · automática · tarefa + Simples  [contestar] │
│ 14:30–15:15  GES-025 Atendimento · Empresa Z · automática · conversa #4411 [contestar] │
│ 15:15–17:30  FIS-004 Conferência · Empresa X · automática · core confirmou  [ver]    │
│ 17:30–18:00  sem classificação                                           [classificar] │
│ Agente (João, Fiscal): 09:30 preparou PGDAS-D de 14 clientes · 31 min máquina        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Dados e gráfico | Ações |
| --- | --- | --- |
| Dia | Linha do tempo com blocos por confiança; atendimento e agente marcados | Clicar abre a sessão com evidências (eventos, pulsos por portal, artefatos) |
| Semana | "Quantas horas por dia, e quanto foi automático?" (barras empilhadas por confiança) | Clicar no dia |
| Mês | "Em que clientes meu tempo foi?" e "em que atividades?" (barras horizontais, 10 maiores + outros) | Filtra a lista |
| Lista de sessões | Início, fim, atividade, cliente, confiança, origem, evidências | **Contestar** (motivo em lista: cliente errado, atividade errada, tempo errado, não era trabalho; nota opcional) → `timesheet.contestar`; confirmar e corrigir (5.2) |
| Agente | Sessões dos próprios integrantes, tempo de máquina, horas poupadas, percentual do limite | Abrir o chat do integrante |
| Contestações e extensão | As minhas contestações com a decisão do Gestor; estado da extensão e pulsos do dia por portal | Ver; pausar; ver a lista de domínios |

O Colaborador **nunca vê**: custo-hora, honorário, margem, tokens, centavos, horas de colegas, contestações de outros. Vê o próprio "fora da jornada" marcado, sem juízo.

### 8.3 Equipe (Gestor e Administrador)

```
┌─ Timesheet · Equipe · Fiscal ▾ · novembro ▾ · [pessoa ▾] [cliente ▾] [atividade ▾] ─┐
│ 612 h registradas · cobertura automática 71% · confirmação 86% · sem classif. 6%     │
│ Capacidade: 4 pessoas × 168 h = 672 h · usadas 612 h (91%) · agentes 19 h máquina    │
│ "Quanto cada pessoa registrou, e quanto foi automático?"   (barras empilhadas)        │
│ Ana   ████████████████████▒▒▒▒░░ 158 h   Bruno ██████████████████▒▒░ 149 h           │
│ "Onde o tempo do setor foi?"  por cliente ▾ | por atividade | por origem               │
│ "Automático × estimado × confirmado, por semana"  (área empilhada)                    │
│ Tabela por pessoa · Contestações a decidir (3) · Fila "sem equivalente" (27 tipos)    │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

| Bloco | Pergunta | Gráfico ou tabela |
| --- | --- | --- |
| Pessoas, Onde foi, Captura | As três do wireframe | Barras empilhadas por confiança; barras horizontais com alternador cliente / atividade / origem; área empilhada por semana |
| Capacidade (GES-403) | Quem está acima ou abaixo da capacidade? | Barra por pessoa: disponível (jornada × dias úteis − ausências) × registrada; faixa 85 a 100%; previsão de 2 semanas pelas tarefas abertas × padrão |
| Por atividade | Que atividades a captura não enxerga? | Tabela ordenada por % estimada |
| Calibração (11.2) | O padrão do catálogo está certo? | Tabela: atividade, `horas_100 / 100`, mediana medida, n, diferença; "adotar a mediana" |
| Contestações | O que decidir? | Lista com evidências; aceitar (vira confirmada com a correção) ou recusar (motivo em lista) → `timesheet.decidir_contestacao` |
| Agentes | O que os integrantes fizeram, custaram e pouparam? | Tabela por integrante e dono |
| Fila sem equivalente | Que tarefas do core não entram? | Contagem e link para Gestão › Catálogo local |
| Fora da jornada (GES-053) | Houve trabalho fora da política? | Relatório mensal agregado |

O Gestor vê só os setores que gere; pessoa com dois setores aparece nos dois com as horas de cada. Custo-hora não aparece aqui.

### 8.4 Rentabilidade (Administrador; Gestor com o setor Gestão ou Financeiro)

```
┌─ Timesheet · Rentabilidade · outubro ▾ · [setor ▾] [grupo ▾] · Pacote: Contábil | BPO | Todos · custo-hora do escritório: R$ 300 ─┐
│ Carteira: honorários R$ 184 mil · custo medido R$ 121 mil · margem 34% · 11 deficitários │
│ "Quais clientes dão prejuízo?"  (barras divergentes de margem, ordenadas)                 │
│ Empresa W   ◀━━━━━━━━ −R$ 2.100 (−48%)   41 h · hon. R$ 4.400                            │
│ Empresa X   ━━━━━━▶ +R$ 3.900 (+52%)     41 h · hon. R$ 7.500                            │
│ Cliente selecionado: Empresa W · "A margem está piorando?" (linha de 12 meses, marcos:    │
│  reajuste, mudança de regime, faixa estourada GES-015) · horas por setor e atividade ·    │
│  custo do escritório · variáveis (GES-010, agentes) · contrato (FIN-001) · [propor reajuste] │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Definição | Fonte |
| --- | --- | --- |
| Custo do cliente no mês | **horas do cliente × custo-hora do escritório** + custos variáveis (serviços pagos, GES-010; integrantes em centavos). Decisão de 7/11/2026: o custo-hora é **do escritório**, não do cargo nem da pessoa: todos os gastos do mês (folha, encargos, aluguel, sistemas, impostos, pró-labore) divididos pelas horas produtivas registradas no mês. Exemplo do usuário: escritório que custa R$ 300 por hora; cliente que toma 2 horas por mês e paga R$ 500 está R$ 100 abaixo da neutralidade. O custo-hora é **um só, do escritório, e inclui todos os pacotes** (contábil e BPO). O **custo-hora por pacote é só um extra opcional**, **desligado por padrão** (8/11/2026); o **BPO é um filtro** (chip "Pacote: Contábil \| BPO \| Todos"), não um custo-hora separado. O custo-hora por cargo fica como refinamento opcional, para quem quiser separar sênior de júnior | Sessões; `custo_hora` do escritório, por cargo opcional (GES-055, pedido A7) |
| Honorário do mês | Itens recorrentes do contrato vigente na competência + extras (FIN-001, GES-002) | Perfil versionado; Financeiro |
| Margem | Honorário − custo, em R$ e em % | Cálculo |
| Deficitário | Margem negativa em 2 dos últimos 3 meses | Cálculo |
| Estimadas | Incluídas e marcadas; alternador "só medidas e confirmadas" (P12) | Confiança |
| Ligações | GES-013, 014 (reajuste), 015 (faixa contratada), 102 (estimar cliente novo), 402 (precificar proposta), 404 (orçar horas e avisar estouro), FIN-006 (DRE por centro de custo) | Botões levam ao Financeiro ou ao cartão do integrante de Gestão |

Cliente sem contrato estruturado mostra honorário "não informado" e margem em branco, nunca zero. Grupo econômico soma os clientes.

### 8.5 Confirmações

A fila de 5.2 para a pessoa logada, por dia, com os últimos 7 dias e o contador de pendências no item lateral. O Gestor tem um segundo painel: artefatos **sem pessoa** (5.1, regra 5) a atribuir, e contagem de pendências por pessoa do setor, sem o conteúdo.

---

## 9. Indicadores e relatórios

### 9.1 Métricas

Todas saem das sessões e dos eventos; nenhuma tabela própria.

| Métrica | Definição exata | Onde |
| --- | --- | --- |
| **Horas registradas** | Σ duração das sessões humanas com `confianca ≠ contestada` (contestação aceita vira confirmada; recusada volta à original) | Meu tempo; Equipe; Home |
| **Horas automáticas** | Σ sessões `automatica` ou `confirmada` com origem `plataforma`, `core` ou `extensao` e duração vinda de evento, não de padrão | Equipe |
| **Cobertura automática** | Horas automáticas ÷ (horas registradas + horas sem classificação) | Equipe; Gestão |
| **Horas estimadas** | Σ sessões `estimada` não substituídas | Equipe |
| **Horas sem classificação** | Σ intervalos de 10 min ou mais, dentro da jornada, sem sessão nem confirmação, mais itens expirados | Meu tempo; Equipe |
| **Taxa de confirmação** | Itens confirmados ou corrigidos ÷ apresentados, nos 7 dias de validade | Equipe |
| **Tempo de confirmação por dia** | Mediana entre abrir e fechar a lista, por pessoa | Equipe |
| **Taxa de contestação** | Contestadas ÷ (automáticas + estimadas); e a parte aceita | Equipe; 11.3 |
| **Horas por cliente** | Σ horas registradas por `cliente_id` (grupo soma); quebra por setor e atividade | Rentabilidade; abas do Painel |
| **Custo e margem por cliente** | 8.4 | Rentabilidade |
| **Capacidade usada** | Horas registradas ÷ horas disponíveis (jornada × dias úteis − ausências) | Equipe |
| **Carga prevista** (GES-403) | Σ (tarefas a fazer com prazo no período × padrão ou mediana) ÷ horas disponíveis | Equipe; Home do Gestor |
| **Horas poupadas**, **tempo de máquina**, **custo de agentes por cliente** | 7.2; Σ segundos de máquina; Σ centavos por cliente | Meu tempo; Equipe; Rentabilidade |
| **Fora da jornada** | Σ horas com `fora_da_jornada` | Meu tempo; relatório mensal |
| **Desvio padrão × medido** | Por atividade: mediana medida ÷ (`horas_100 / 100`) | Equipe |

`indicador.listar` (Painel) recebe daqui: horas da semana com a parte estimada (Home do Colaborador), horas do setor por pessoa e carga prevista (Home do Gestor), horas por cliente no mês (cabeçalho do cliente), confirmações pendentes (cartão na Home).

### 9.2 Relatórios que a Gestão consolida (Painel 6.9)

| Relatório | Conteúdo | Quando |
| --- | --- | --- |
| **Horas do mês** | Por setor, pessoa, cliente, atividade; confiança; comparação com o mês anterior | Mensal, PDF e CSV |
| **Rentabilidade da carteira** | Ranking de margem; deficitários; evolução; reajustes (GES-014) e clientes fora da faixa (GES-015) | Mensal |
| **Capacidade e carga** | Usada por pessoa e setor; prevista para 4 semanas; férias e substitutos (GES-018) | Semanal |
| **Qualidade da captura** | Cobertura, estimadas, confirmação, contestação, tempo de confirmação, fila sem equivalente, extensão (pessoas sem, pausas) | Mensal |
| **Trabalho dos integrantes** | Máquina, custo, horas poupadas, aprovação sem edição (GES-056; 02, 14.1); custo por resultado para a DGM | Mensal |
| **Exceções de jornada** | Fora da jornada por pessoa, agregado; divergências com o ponto quando conectado (GES-052) | Mensal, só Administrador |

---

## 10. Privacidade e aceitação

### 10.1 Termo de ciência

Modelo entregue com o produto (GES-054), editável no tema, aceito uma vez por pessoa no primeiro login após a ativação do módulo e a cada mudança da lista de coleta. Diz, em linguagem simples: a finalidade (saber quanto cada cliente custa e tirar o apontamento manual); o que é coletado; o que nunca é coletado (10.4); quem vê o quê; retenção; que o registro mede esforço por cliente e **não substitui o controle de ponto** (GES-052); como contestar; que a extensão pode ser pausada. O aceite é evento. Sem aceite, a pessoa usa a plataforma (a fonte 1 é inerente ao sistema), mas a extensão fica inerte e os artefatos de nuvem não são atribuídos a ela.

Base legal, teste de balanceamento e relatório de impacto são do escritório (GES-054); a plataforma entrega modelos e a tela de transparência. Decisão de 7/11/2026: **não há revisão por advogado antes do piloto**; o que precisa existir é o termo simples de ciência, aceito no primeiro login, dizendo que o tempo de trabalho é registrado, o que é coletado e para quê. O escritório que quiser revisão jurídica faz por conta própria.

### 10.2 Lista de domínios

Visível a toda pessoa em Meu tempo › Extensão e em Configurações: portal, domínio, o que é lido (URL, título, elemento de identificação), atividade sugerida. Mudanças geram evento e aviso à equipe. Não há lista de apps: sem coletor, a plataforma não sabe que programas a pessoa usa.

### 10.3 O que o Colaborador vê sobre si

Tudo o que o timesheet guarda com o nome dele: sessões, evidências (eventos, pulsos por portal e horário, artefatos), confirmações, contestações e decisões, pausas da extensão, marcas de fora da jornada. A tela "o que a plataforma sabe sobre você" (GES-054) lista e exporta em CSV (`timesheet.exportar_proprio`, pedido A8).

### 10.4 O que o sistema nunca faz

Captura de tela; teclas; conteúdo de página (além do identificador do cliente, 3.3), formulário ou mensagem para fins de tempo; URL fora da lista; histórico; mouse; câmera, microfone, localização; programas abertos; coleta com a sessão da plataforma encerrada; alerta ao Gestor por pausa da extensão ou por ocorrência isolada fora da jornada; ranking de "produtividade" por pessoa (horas registradas não são produtividade; GES-016 mede entregas e atrasos).

### 10.5 Retenção

| Dado | Retenção | Depois |
| --- | --- | --- |
| Pulsos brutos | 90 dias | Agregados por dia, portal e cliente; o bruto é removido pela rotina de retenção (Fundações 5.2) |
| Sessões de trabalho | Prazo de guarda do escritório (mínimo 5 anos, Fundações P5) | Arquivo frio |
| Itens de confirmação não respondidos | 7 dias | Só a marca "sem classificação" |
| Buffer local da extensão | 24 h | Apagado ao enviar |
| Pessoa desligada | Sessões ficam (são custo do cliente); nome vira hash após o prazo de guarda trabalhista; antes, só o Administrador vê | Anonimização (Fundações adendo 15) |

### 10.6 Comunicação à equipe

Modelo de comunicado no tema (`modelos_texto.timesheet_apresentacao`, pedido A9), enviado pela central ao ativar o módulo, com os pontos do termo e a frase que importa: "ninguém precisa mais apontar horas; vocês confirmam o que o sistema deduziu, e cada um vê os próprios dados primeiro". Recomendação escrita na implantação: mostrar Meu tempo a cada pessoa por duas semanas antes de abrir Equipe ao Gestor (Plano 5.3).

---

## 11. Qualidade dos dados

### 11.1 Cobertura

Cobertura automática (9.1) é a métrica-mãe. Metas em 3 meses, a validar no piloto (S2 estima 10% a 20% de confirmação):

| Escritório | Cobertura automática | Confirmação |
| --- | --- | --- |
| Alterdata com ePlugin e extensão | ≥ 80% | ≤ 15% |
| Domínio sem API, com extensão | ≥ 70% | ≤ 25% |
| Contmatic, com extensão | ≥ 60% | ≤ 35% |
| Sem extensão | 15 pontos a menos | |

Diagnóstico quando cai, na ordem da aba Equipe: pessoas sem extensão ou com ela pausada; tarefas do core sem equivalente; `tarefa.concluir` sem sessão (fez e só marcou); atividades com mais de 50% de estimativa; `inatividade_min` baixo demais (esperas por hora, Painel 12).

### 11.2 Calibrar `horas_100`

`horas_100` é estimativa de levantamento, não medição. Calibração por escritório e atividade:

1. A cada mês, para atividade com **20 ou mais sessões medidas** (automáticas, duração de evento, não contestadas), mediana e p90 por sessão e por tarefa.
2. **A hora padrão por cliente não é informada pelo escritório: é descoberta pelo timesheet** (decisão de 7/11/2026). Para cada cliente e atividade, o sistema calcula a mediana das sessões medidas (automáticas e confirmadas) dos últimos 6 meses; com 5 ou mais sessões medidas, essa mediana passa a ser a duração padrão das estimativas daquele cliente; com menos, vale a mediana do escritório para a atividade; sem nada, o catálogo (`horas_100 / 100`). A aba Equipe mostra catálogo × escritório × cliente para o Gestor conferir; ele pode corrigir um valor, mas o padrão é o calculado. Não existe campo "hora padrão" no perfil do cliente.
3. Atividades "por evento" (DP-005, admissão) têm `horas_100` mensal por 100 clientes, não por ocorrência; a calibração converte para **por ocorrência** e passa a usar essa unidade na estimativa por artefato. Pedido A10: `horas_padrao_cliente` ganha `unidade`.
4. Agregado anonimizado entre escritórios alimenta a versão seguinte do catálogo, **sem opt-in do escritório**, pela mesma regra da melhoria contínua do 07 (anonimização por regra; termo de uso da plataforma).

Soma do catálogo hoje: **3.119 h por mês por 100 clientes** (589 atividades): Contábil 486 h, Gestão e Atendimento 443 h, Fiscal 437 h, Nichos 312 h, DP 306 h, Notas 301 h, Consultoria 243 h, BPO 207 h, Societário 150 h, Financeiro 90 h, PF 75 h, Terceiro setor 44 h, Ciclo de vida 27 h. Por fase: 0 → 110 h; 1 → 1.108 h; 2 → 821 h; 3 → 224 h; 4 → 416 h; 5 → 441 h. Por etapa: manutenção 2.924 h, entrada 746 h, desligamento 267 h. Um escritório de 100 clientes com 4 pessoas tem cerca de 670 h por mês: o catálogo inteiro não cabe; a calibração olha só as atividades ligadas no catálogo local.

### 11.3 Sessões anômalas

Detecção determinística diária, por job sem modelo (02, 4.2); alerta de qualidade ao Gestor, nunca item para a pessoa, salvo onde indicado.

| Anomalia | Regra | Ação |
| --- | --- | --- |
| Sessão longa | > 4 h sem evento de ferramenta (só pulsos), ou > 6 h | Item de confirmação para a pessoa ("confirma 6 h em FIS-004 Empresa X?") |
| Dia longo | > 12 h registradas | Alerta ao Gestor; a pessoa vê a marca |
| Cliente errado | CNPJ dos pulsos ≠ cliente da tarefa por mais de 50% da sessão | Item de confirmação (3.3) |
| Estimativa acumulada | > 3 h estimadas no dia para a mesma pessoa | Alerta de cobertura |
| Core discorda | Horas apontadas > 1,5 × medidas, ou o inverso | Alerta de calibração; nenhuma sessão muda |
| Confirmação em massa | 100% dos itens em menos de 20 s por 5 dias | Amostra de 5 itens para o Gestor conferir |
| Contestação recorrente | Mesma atividade ou fonte contestada 5 vezes no mês | Diagnóstico da fonte |

### 11.4 Reconstrução a partir dos eventos

`timesheet.reconstruir(periodo)` relê os eventos e refaz as sessões (Fundações 5.4 e 11). Este subplano acrescenta ao teste as sequências: pulsos com CNPJ sem tarefa (trecho de portal); pulsos divergentes da tarefa; evento do core 3 h após a sessão (confirma) e 2 dias após (estimada nova); artefatos múltiplos em 2 h (uma sessão); conversa de outro cliente no meio da tarefa (corte); segunda pessoa na mesma tarefa; sessão atravessando a meia-noite; confirmação seguida de reconstrução (a confirmada permanece). Reexecutar com os mesmos eventos produz as mesmas sessões, exceto os ids.

---

## 12. Ordem de construção, ajustes e perguntas

### 12.1 Etapas sobre as Fundações (F6 pronta)

| # | Etapa | Depende de | Entrega |
| --- | --- | --- | --- |
| T1 | Meu tempo mínimo | F6, P3 (Painel) | Linha do dia, lista de sessões, contestar; indicador na Home |
| T2 | Confirmação assistida | T1 | Produtor de itens, limites, aba Confirmações, cartão na Home, `timesheet.confirmar_lote` |
| T3 | Artefatos | F7, T2 | Catálogo de artefatos; sessões estimadas; agrupamento em 2 h |
| T4 | Extensão | F2, T1 | Chrome e Edge; lista versionada; pulso; detecção por URL e título; pausa; vínculo e ciência; `timesheet.contexto_atual` |
| T5 | Alterdata | F13, T3 | Adaptador ePlugin; sugestão de equivalência; fila; dedupe de 4.7 |
| T6 | Equipe | T1 a T5 | Gráficos, capacidade, contestações, qualidade da captura, agentes |
| T7 | Série de integrantes | F10; 02 E1 a E4 | Sessões com custo; horas poupadas; percentual do limite |
| T8 | Rentabilidade | T6, FIN-001, custo-hora do escritório | Margem, deficitários, evolução, ligações |
| T9 | Relatório importado e Contmatic | T5 | `core.importar_relatorio`; adaptador de arquivo; orientação de implantação |
| T10 | Calibração e anomalias | T6, 3 meses de dados | Mediana × padrão, adoção, job de anomalias, unidade por ocorrência |
| T11 | Elemento de identificação, portais municipais, calendário, Domínio por API | T4, T4, contrato TR, conector de calendário | Seletores por portal; lista municipal; GES-050; adaptador Domínio Processos |

T1 e T2 formam o módulo usável; T4 é o que mais muda a cobertura; T5 anda em paralelo desde F13.

### 12.2 Ajustes pedidos às Fundações, ao 02, 03 ou 04

| # | Onde | Pedido | Por quê |
| --- | --- | --- | --- |
| A1 | Fundações 5.4, regra 3 | `atividade.pulso` ganha `portal`, `cnpj_detectado`, `metodo_deteccao`; pulsos com CNPJ e sem tarefa viram **trecho de portal** (candidato de confirmação, nunca sessão) | 3.4 |
| A2 | Fundações 5.6 | `confianca_duracao = medida` só com intervalo entre início e conclusão no core menor que um dia útil; senão `padrao` | 4.7 |
| A3 | Catálogo (4.6) | Três atividades internas de Gestão: reunião interna, treinamento (ou GES-022), administrativo; hoje não há IDs | 5.2 |
| A4 | Ferramentas (6.5) | `tarefa.pausar` exposta à pessoa; retomada sem a regra dos 60 s | 6 |
| A5 | Fundações 5.4, regra 4 | Sobreposição entre clientes **diferentes**: vence a sessão com eventos no intervalo; especificidade decide só no mesmo cliente | 6 |
| A6 | Tarefa (4.8) | `tarefa.iniciar` por segunda pessoa cria sessão própria sem trocar o dono aberto | 6 |
| A7 | Entidade nova | `custo_hora` **do escritório** com vigência mensal (gastos totais do mês ÷ horas produtivas; o Administrador informa os gastos ou o valor direto na v1; a partir da fase 3b o custo-hora é proposto pelo Financeiro (`custo_hora.propor`) a partir dos custos; pode vir do Financeiro do escritório, FIN); `custo_hora.definir` (Administrador); custo por cargo como refinamento opcional (`cargo_id` no usuário); **custo-hora por pacote como extra opcional, desligado por padrão** (`custo_hora.por_pacote`, 8/11/2026) | 8.4 |
| A8 | Ferramentas | `timesheet.contexto_atual`, `.confirmar_lote`, `.exportar_proprio`, `.calibrar`; `core.importar_relatorio` (Gestor); `extensao.vincular`, `.pausar`; `identidade.resolver` aceita CNPJ e IE | 3, 5, 10, 11 |
| A9 | Tema (10) | `modelos_texto` ganha `timesheet_apresentacao` e `termo_timesheet`; lista de domínios como dado versionado com desligamento por escritório | 10 |
| A10 | Configuração local (4.6) | `horas_padrao_cliente` ganha `unidade` (mes_cliente, ocorrencia) e `origem` (escritorio, calibracao, catalogo) | 11.2 |
| A11 | Eventos (5.7) e Sessão (5.4) | Eventos `atividade.pulso`, `extensao.vincular`, `extensao.pausar`, `timesheet.item_confirmacao.criar`, `timesheet.anomalia`, `timesheet.calibracao.sugerir`, `core.importar_relatorio`, `custo_hora.definir`; campos `fora_da_jornada`, `anomalia`, `portal`, `duracao_origem` (evento, apontada, padrao, confirmada) na sessão | 6, 9, 11 |
| A12 | 02 (4.6) | Job sobre a carteira grava, por cliente, a contagem de ferramentas chamadas, para o rateio em sessões por cliente | 7.1 |
| A13 | 03 (7.3) | Botões "pausar" e "não era esta" no cabeçalho da tarefa; Home do Gestor recebe carga prevista; bloco Equipe de Gestão aponta para Timesheet › Equipe | 6, 9 |
| A14 | 04 (9.1) | Conversa de outro cliente com tarefa aberta corta a tarefa no intervalo (A5) | 6 |
| A15 | Testes (11) | As sequências de 11.4 entram no teste de reconstrução | 11.4 |

### 12.3 Perguntas para aval

| # | Pergunta | Hipótese adotada | Em outras palavras |
| --- | --- | --- | --- |
| P1 | `inatividade_min` padrão: 3 min? | **Respondido (segue a hipótese):** 3 min, ajustável de 2 a 5 | A tela entra em espera depois de uns minutos parada (sem deslogar). Curto demais corta o tempo de quem está no core; longo demais conta tempo parado. Três minutos é o meio-termo. |
| P2 | A extensão pode ler **um elemento fixo** da página (o CNPJ representado no e-CAC e no eSocial), já que esses portais não o mostram na URL nem no título? | **Respondido:** sim, e pode ler a página inteira para identificar o cliente; envia só o identificador e o pulso (3, regra 4); só nos domínios da lista, com a regra visível na lista e no termo | Nos portais mais usados, a empresa aberta só aparece dentro da página. Ler só esse pedacinho identifica o cliente com segurança; não ler significa perguntar à pessoa mais vezes. É a única leitura de conteúdo do sistema e precisa estar no termo. |
| P3 | Máximo de itens de confirmação por dia: 8? | **Respondido (segue a hipótese; ver 12.4):** 8, ajustável de 4 a 12 | Lista longa de "confirme em um clique" vira apontamento manual com outro nome. Oito cabem em dois ou três minutos; o resto aparece como lacuna para o gestor, não como culpa da pessoa. |
| P4 | Hora padrão de cliente grande fica no perfil versionado, sobrescrevendo a da atividade? | **Respondido:** não. A hora padrão por cliente é calculada pelo próprio timesheet, não informada (11.2); não há campo no perfil | Um cliente com 300 notas leva mais tempo que um com 10. O escritório diz "para este cliente a conciliação leva 2 h" e as estimativas usam isso. |
| P5 | Termo e base legal passam pelo advogado do grupo **antes** do piloto? | **Respondido:** não passa por advogado; basta o termo simples de ciência (10.1); o piloto não ativa extensão nem artefatos de nuvem sem o termo aceito | Registrar o tempo da equipe é monitoramento e a lei de dados pede finalidade clara e aviso. Começar sem isso cria risco jurídico e desconfiança; esperar atrasa o piloto algumas semanas. |
| P6 | O Colaborador vê as **horas poupadas** pelos seus integrantes, ou só o tempo de máquina? | **Respondido (segue a hipótese):** Vê as duas; não vê custo | "Horas poupadas" estima quanto trabalho a IA tirou da mesa da pessoa. Mostrar motiva e explica o limite; esconder evita a sensação de que o agente é avaliado contra a pessoa. |
| P7 | Custo-hora é por **cargo**, nunca por pessoa, e só o Administrador vê o valor? | **Respondido: custo-hora do escritório (gastos totais do mês ÷ horas produtivas), não por cargo nem por pessoa; por cargo é refinamento opcional (8.4; GES-055).** | Para saber se um cliente dá lucro, o sistema multiplica horas pelo custo da hora de quem trabalhou. Usar o custo do cargo, não o salário de cada um, protege o dado salarial e dá margem quase igual. |
| P8 | Dedupe core × plataforma com janela de 4 h no mesmo dia útil? | **Respondido (segue a hipótese; ver 12.4):** Sim | Quando o core e a plataforma dizem que a mesma pessoa fez a mesma coisa para o mesmo cliente com poucas horas de diferença, é a mesma coisa e não conta duas vezes. Janela maior arrisca juntar dois trabalhos; menor arrisca contar dobrado. |
| P9 | Trabalho fora da jornada é **marcado** e relatado por mês, sem alerta por ocorrência? | **Respondido (segue a hipótese; ver 12.4):** Sim; política por escritório (GES-053); nada se apaga | Se alguém responde um cliente às 22h, o sistema registra, mas não avisa o chefe na hora; o gestor vê um resumo mensal para tratar a política, não a pessoa. O registro pode virar prova de hora extra, e o escritório precisa saber disso. |
| P10 | Pulsos brutos ficam 90 dias e depois só totais por dia? | **Respondido (segue a hipótese; ver 12.4):** Sim | Os sinais de "ainda ativo no portal" valem por poucas semanas, para corrigir e contestar. Guardar menos protege a pessoa; guardar mais não ajuda ninguém. |
| P11 | Escritório Contmatic entra no piloto com a cobertura menor avisada, ou espera a negociação? | **Respondido:** entra, com a cobertura menor avisada; como funciona sem parceria está em 4.5 e 12.4. Entra, com a meta de 60% escrita na implantação | Sem conexão com o Contmatic, mais trabalho cai na lista de confirmar. Avisar antes evita frustração; esperar a negociação pode levar meses. |
| P12 | Rentabilidade inclui horas **estimadas** no custo, com alternador para ver só as medidas? | **Respondido (segue a hipótese):** Sim | Tirar as estimativas subestima o custo dos clientes cujo trabalho é feito fora da plataforma; incluí-las pode inflar. Mostrar as duas visões deixa o gestor decidir, e a diferença mede o quanto a captura ainda falha. |

### 12.4 Perguntas reformuladas e a resposta sobre o Contmatic

**Como o Contmatic funciona sem parceria (P11).** O Contmatic não tem API, então o sistema não consegue perguntar a ele "o que fulano fez hoje". O que funciona mesmo assim, sem nenhuma negociação:

1. **A tarefa aberta no painel** (fonte 1): a pessoa abre "Apurar ICMS da Empresa X" no nosso painel, vai ao Contmatic, faz, volta e conclui. O tempo conta para a tarefa certa. É a fonte principal em qualquer core e não depende do Contmatic.
2. **Os arquivos que o Contmatic gera** (fonte 4): guias, SPED, relatórios e recibos que ele grava na pasta do cliente. O conector de armazenamento vê o arquivo novo e registra "atividade X feita para o cliente Y às 15h", com a duração padrão. Serve de prova e de preenchimento quando a pessoa esqueceu de abrir a tarefa.
3. **O relatório de tarefas do próprio Contmatic**, quando o plano do escritório tem o módulo de gestão: exportado como arquivo e importado pela plataforma, de tempos em tempos.
4. **A confirmação em um clique** (fonte 5) para o que sobrou.

O que se perde sem a parceria é só o "quem e quando, minuto a minuto" que a API do Alterdata dá. Por isso a cobertura automática esperada é menor e mais itens caem na lista de confirmação, e a implantação avisa isso ao escritório antes de contratar.

**P3, em outras palavras.** No fim do dia, o sistema monta uma lista do tempo que não conseguiu atribuir sozinho e pede para a pessoa confirmar em um clique ("das 10h às 10h40 você estava na Empresa X apurando ICMS?"). Se essa lista for longa, vira apontamento manual com outro nome, e as pessoas param de responder. A proposta é limitar a 8 itens por dia: os mais prováveis entram na lista; o resto fica registrado como "tempo sem classificação" na visão do Gestor, como lacuna de captura do sistema, não como falha da pessoa. Hipótese: 8.

**P7, em outras palavras (respondido: o custo-hora é do escritório como um todo; ver 8.4).** Para calcular quanto cada cliente custa ao escritório, o sistema multiplica horas por um custo por hora de quem trabalhou. A dúvida é de onde vem esse custo. Opção da hipótese: um custo por **cargo** (ex.: "analista fiscal: R$ X por hora"), que o Administrador informa uma vez e só ele vê. A alternativa seria usar o salário de cada pessoa, que dá uma margem um pouco mais exata, mas exige guardar o salário individual no sistema e expõe esse dado nos relatórios. Por cargo protege o salário e a diferença no resultado é pequena.

**P8, em outras palavras.** Quando o escritório usa o Alterdata, a mesma tarefa pode aparecer duas vezes: uma vez pelo nosso painel (a pessoa abriu a tarefa) e outra pela API do Alterdata (ele registrou a tarefa lá). O sistema precisa perceber que é a mesma coisa e contar uma vez só. A regra proposta: mesma pessoa, mesmo cliente, mesma atividade, no mesmo dia útil e com menos de 4 horas de diferença = mesma tarefa. Janela maior juntaria trabalhos diferentes; menor contaria em dobro. Hipótese: 4 horas.

**P9, em outras palavras.** O timesheet vai registrar trabalho feito fora do horário (à noite, fim de semana). Isso pode virar prova de hora extra numa discussão trabalhista, então o escritório precisa saber que acontece. A dúvida é se o sistema avisa o Gestor a cada ocorrência ou só mostra um total mensal no relatório. Hipótese: só o relatório mensal, marcando as sessões fora da jornada; alertar na hora pareceria vigilância.

**P10, em outras palavras.** A extensão manda um sinal por minuto dizendo "a pessoa está ativa neste portal, neste cliente" (o pulso). Esses sinais brutos servem para corrigir e contestar sessões nas primeiras semanas; depois disso ninguém olha. A proposta é guardar os sinais por 90 dias e, depois, manter só os totais por dia, pessoa e cliente. Guardar para sempre só acumula dado pessoal sem uso.

## 13. Adendo: ajustes recebidos do subplano 06 (7/11/2026)

- Eventos de pessoa do cliente nunca viram sessão de trabalho; o tempo do Colaborador na validação do que o cliente enviou (GES-405) conta pela tarefa aberta.

## 14. Adendo: ajustes recebidos do subplano 08 (7/11/2026)

- O contrato único dos cores ganha `core.empresas.listar`, `core.documentos.listar`, `core.certidoes.listar` e as escritas do 08, seção 6.1; `core.importar_relatorio` é o adaptador de arquivo.

## 15. Adendo: ajustes recebidos do subplano 09 (7/11/2026)

- A Rentabilidade lê o honorário do mês de `contrato.honorario_na_competencia`; margem sobre o contratado e sobre o recebido; o custo-hora do escritório é proposto pelo Financeiro (`custo_hora.propor`) a partir dos custos; a distribuição de lucros fica fora, pró-labore e folha entram; a marca `entra_no_custo_hora` é por conta do plano de contas.

## 16. Adendo: decisões do UI lab (8/11/2026)

Decisões do usuário no UI lab (7/11/2026). Inatividade (H3, 3.4, 3.7, 6, 11.1 e P1) já corrigida no corpo: modo de espera, sem logout, só onde o tempo é registrado sozinho; o Timesheet em si **não conta tempo e não entra em espera**. Aqui o que se acrescenta.

- **Confiança** codificada num **tom só, em degraus, mais textura** (automática, estimada, confirmada, sem classificação); vale para qualquer marca branca (8.2 já usa glifos de textura).
- **Termo de ciência** (10.1) e **vínculo da extensão** (3.6) são fluxos em gaveta, no mesmo padrão das demais configurações.
- **Registrar ausência na aba Equipe** (férias, licença, atestado): entra no cálculo de capacidade (horas disponíveis × horas registradas, 8.3) e alimenta o substituto das férias (Painel 6.9). Entidade pedida às Fundações: `ausencia` (pessoa, início, fim, motivo, registrada_por).
- **Rótulos:** a coluna "Horas poupadas" mostra "31,5 h" com **"(estim.)"** no título (o til lia como sinal de menos); "Meu tempo" mostra o **% do limite** de IA, nunca tokens nem custo (custo só na Equipe).
- **Configurações do módulo em gaveta:** jornada, inatividade (`inatividade_min`), itens por dia de confirmação, custo-hora, portais da extensão e sistemas contábeis.
- **Quem vê** (conferido): Colaborador, Meu tempo e Confirmações; Gestor, também a Equipe dos setores que gere; Rentabilidade (fase 3) só Administrador e Gestor com Gestão ou Financeiro.
- **Ordem das abas:** o wireframe põe Confirmações antes de Equipe e Rentabilidade; é a pendência U5 do Painel (adendo 20), a escolher.

## 17. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seção 7 e 11.2 (A11).

- **Custo-hora do escritório** usa **só atividades e custos com `titular = escritorio`** (F3): o dinheiro e os custos da empresa BPO (titular `empresa`) nunca entram no gasto. **Corrigido em 8/11/2026 (adendo 19):** as **horas da equipe do próprio escritório no BPO entram**, no numerador (gastos) e no divisor (horas produtivas); o custo-hora é **um só e inclui todos os pacotes**, e o cálculo **por departamento** ou **por pacote** é só um extra opcional, desligado por padrão.
- **Novas dimensões** de filtro e de relatório: **contratante** (subinquilino, no modo BPO) e **frente** (financeira ou entre escritórios), além de setor, cliente e atividade. O catálogo de atividades usado é a **união** dos catálogos dos pacotes; a rentabilidade soma o honorário contábil e a taxa de BPO contra todas as horas.
- **Margem por empresa BPO, contratante e departamento** na aba Rentabilidade e capacidade do item BPO; sem Timesheet não há margem por empresa (recomendado, desmarcável).

## 18. Adendo: decisões do UI lab, segunda rodada (8/11/2026)

As horas do BPO entram como **sessões do pacote** (setor `bpo_financeiro`) e a Rentabilidade do wireframe usa um custo-hora fixo. **Decidido em 8/11/2026 (10, seção 12, Q7):** um custo-hora do escritório por padrão, com opção por pacote quando o custo diferir; o detalhe por departamento fica dentro dessa opção, e o adendo 17 vale com esse ajuste. O Gestor do BPO nunca vê margem; ver a Rentabilidade exige Gestão ou Financeiro (10, 5.4).

## 19. Adendo: últimas decisões (8/11/2026)

- **Custo-hora do escritório único, que inclui todos os pacotes.** O custo-hora por pacote (e por departamento) é **extra opcional, desligado por padrão**. A resposta de Q7 do 10 passa a: custo-hora do escritório único, por pacote opcional, BPO como filtro.
- **BPO como filtro na Rentabilidade e no Timesheet** (Equipe, Rentabilidade): chip "Pacote: Contábil | BPO | Todos", ao lado de setor, grupo, contratante e frente. Com "BPO", a tela mostra as horas do setor `bpo_financeiro` e o honorário do BPO contra o mesmo custo-hora do escritório; "Todos" é o padrão e soma contábil e BPO.
- **Efeito no UI lab:** os filtros da Rentabilidade e da Equipe ganham o chip de pacote (pedido já aceito pelo usuário; `ui-lab/` não foi tocado).

## Adendo: pacote Jurídico (9/11/2026)

Aprovado (JU-05): `Caso` como âncora; **valor-hora de cobrança** distinto do custo-hora (visível ao advogado e ao Gestor; o custo-hora segue só do Administrador); pré-fatura por hora, retainer com franquia, teto e orçamento de horas; chips Pacote: Jurídico e Área do direito em Rentabilidade e Equipe.

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-25 Comanda digital de serviço extra | Agora | 03, 7.2 (detalhe da tarefa: marcar extra); 05 (horas do extra); 09 (fatura, fase 3) | Do setor |
