# Subplano JU-03 · Prazos, comunicações e conectores (pacote Jurídico)

**8/11/2026 · versão 0.1 · só planejamento: nada será desenvolvido agora** (decisão d da Síntese, seção 10). Base: [Síntese do pacote Jurídico](../../Sintese_Pacote_Juridico.md); pesquisas J1, J3 (fluxo de 14 passos, atividades JUR), J4 (conectores, riscos R1 a R17), J7 (SGJur), J8; [Conectores (08)](../08-Conectores.md), [Fundações (01)](../01-Fundacoes.md) e [Time de agentes (02)](../02-Time-de-Agentes.md). Entidades do pacote, nomes fixos: **Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico**; os campos são do JU-01. **[a confirmar]** é o que as fontes não verificaram. Valores em R$ são de tabela pública ou de teste, nunca cotação.

**Resumo para quem não é advogado.** O prazo é o centro do produto. O sistema pega o aviso do tribunal, descobre quantos dias a lei dá, conta os dias úteis com o calendário do tribunal, marca uma data interna mais cedo e avisa em escada até a peça ser protocolada. A conta é feita por regra fixa, nunca por IA, e a advogada confirma os prazos que não podem falhar. O sistema nunca abre sozinho uma citação (abrir faz o prazo correr) e nunca protocola (só o advogado, com o certificado dele). O ponto mais frágil e mais caro é a captura dos avisos, porque o tribunal não oferece um caminho aberto completo.

---

## 1. Escopo e princípios

**Dentro:** ciclo do Prazo (da Comunicação ao encerramento), regras de contagem, calendário forense, alertas, comprovante de tempestividade; captura de Comunicações e Andamentos; conectores jurídicos e o risco de cada um; peticionamento assistido; custos de captura; permissões, sigilo e auditoria. **Fora:** campos das entidades (JU-01), telas (JU-02), base de leis, classificação jurídica, cálculos e índices (JU-04), honorários e preço (JU-05). Público inicial: escritório pequeno (1 a 10 usuários, R$ 220 a R$ 500 por mês, J1).

| # | Princípio | Consequência |
| --- | --- | --- |
| P1 | A conta do prazo é **regra, não IA**; a IA lê e propõe | Seção 2.9; gabarito antes de qualquer piloto |
| P2 | O advogado confirma os prazos fatais | O cálculo é recomendação |
| P3 | **Listar não dá ciência; abrir dá.** O agente nunca abre sozinho (regra C7 do 08, a mesma do e-CAC) | Seção 3.3 |
| P4 | Prazo nunca nasce no silêncio: toda Comunicação vira Prazo proposto ou "sem prazo identificado, confira" | "Não li prazo" nunca significa "não há prazo" (J7) |
| P5 | Erro para o lado seguro: dia sem fonte registrada conta como útil; datas saem mais cedo, nunca mais tarde | Seção 2.3 |
| P6 | Fonte única nunca basta; DJEN, Domicílio, painel e Andamento se conferem | Seções 3.5 a 3.7 |
| P7 | Robô parado é evento: saúde da captura visível (FX-001 de J8) | Seção 3.6 |
| P8 | Peticionamento é assistido; protocola o advogado com o A3 dele | Seção 5 |
| P9 | Nenhum robô autônomo em tribunal | Seção 4.6 |
| P10 | Sigilo por padrão; o coletor do DJEN roda no Brasil | Seções 4.6 e 7 |

---

## 2. O fluxo de prazos de ponta a ponta

### 2.1 Visão

Os 14 passos de J3 (7.2) em seis blocos. "Agente" é o integrante de Prazos (nome no JU-02).

| Bloco | Passos | O que acontece | Quem decide |
| --- | --- | --- | --- |
| A. Chegada | 1, 2 | Coletor traz a Comunicação; vínculo ao Processo; duplicatas se fundem | Agente |
| B. Prazo | 3 a 5 | Ato classificado; prazo, norma, unidade e termo inicial propostos | IA propõe; advogado confirma os fatais |
| C. Contagem | 6, 7 | Vencimento calculado; data interna (margem); responsável, revisor, substituto | Regra |
| D. Alerta | 8 | Escada D-5, D-3, D-1, dia | Regra |
| E. Cumprimento | 9 a 12 | Peça, revisão, assinatura e protocolo, juntada, comprovante | Agente prepara; **advogado conclui** |
| F. Controle | 13, 14 | Dupla checagem diária; exceção (justa causa) | Controladoria; advogado |

### 2.2 Da Comunicação ao Prazo

1. **Chegada.** A Comunicação nasce com canal, `id_externo`, quatro datas (disponibilização, publicação, ciência, tácita), destinatário, hash do teor e `origem_externa = true`: o teor de tribunal é dado, nunca instrução (C6 do 08).
2. **Vínculo.** Pelo número CNJ (dígito validado) ao Processo e ao Caso. Sem Processo cadastrado, vai para "acervo do diário", para o advogado incluir o que for dele; nenhum Processo vira Caso sozinho (J7).
3. **Classificação.** A IA classifica o ato (despacho, decisão, sentença, acórdão, audiência, juntada, intimação para manifestar), mostra o trecho que a justifica e a confiança (JUR-036). Revisão humana por amostra, total nos atos de risco. Ato de audiência gera proposta de Audiência.
4. **Prazo proposto.** A IA lê os dias no teor ou, se não estão escritos, sugere pelo tipo do ato **marcando que o número não foi lido**. Estado `proposto`.
5. **Confirmação.** O advogado confirma ou corrige nome da peça, responsável, dias, unidade e se é fatal. A conta aparece inteira antes. A data confirmada não muda sozinha; mudanças ficam em "por que a data andou" (J7).

### 2.3 Regras de contagem

**Dado versionado** (regra por tipo de ato e ramo, vigência, fonte), curado com o JU-04. Os artigos vêm de J3 e J7; **nenhum foi lido em texto oficial** e todos precisam de conferência por advogado antes do piloto.

| Tema | Regra proposta | Fonte indicada |
| --- | --- | --- |
| Unidade, cível | Dias úteis (prazo processual); prazo material (prescrição) é outra regra, no JU-04 | CPC art. 219 |
| Início e fim | Exclui o dia do começo, inclui o do vencimento; vencimento em dia sem expediente passa ao seguinte, **sem prorrogação automática em todos os ritos** (motor sinaliza) | CPC art. 224 |
| DJEN | Disponibilização; publicação no 1º dia útil seguinte; prazo no 1º dia útil seguinte à publicação | Lei 11.419/2006 art. 4º §3º; Res. CNJ 455/2022 e 569/2024 (texto **[a confirmar]**) |
| Domicílio, citação | Confirmada: prazo no 5º dia útil após a confirmação. Ente público sem confirmação: 10 dias corridos do envio. Empresa privada sem confirmação: prazo não corre, citação refeita, possível multa | TRT-12; Res. 455/2022 art. 20 |
| Domicílio, intimação pessoal | Confirmada: conta no dia da confirmação (ou dia útil seguinte). Não confirmada: após 10 dias corridos do envio | TRT-12 |
| Painel de tribunal | Ciência por abertura ou 10 dias corridos | Lei 11.419/2006 art. 5º §3º **[a confirmar]** |
| Carta, oficial, edital | Regra do art. 231; data-base digitada por pessoa | CPC art. 231 |
| Recesso | Suspensão de 20/12 a 20/01 | CPC art. 220; CPP art. 798-A |
| Trabalhista; juizados | Dias úteis; recurso ordinário em 8 dias | CLT art. 775; Lei 9.099 art. 12-A |
| Penal | Dias corridos; contínuos; prorroga se termina em dia sem expediente | CPP art. 798 |
| Dobro | Fazenda, MP, Defensoria; litisconsortes com advogados diferentes **exceto autos eletrônicos** | CPC arts. 180, 183, 186, 229 (alcance **[a confirmar]**) |
| Feriado local | Exigência de comprovação alterada pela Lei 14.939/2024; o motor guarda o ato de qualquer jeito | CPC art. 1.003 §6º (alcance **[a confirmar]**) |
| Indisponibilidade do sistema | Efeito por ato do tribunal | Lei 11.419/2006 **[a confirmar o artigo]** |

**Calendário forense** (dataset do pacote, deste subplano). Cada linha é um dia especial: tribunal, comarca ou foro, data, tipo (feriado, ponto facultativo, suspensão, indisponibilidade, recesso), **efeito** ("o dia não conta"; "o dia conta, mas o prazo não começa nem vence nele", art. 224 §1º; "sistema fora do ar"), fonte (ato do tribunal, hash do documento), vigência, versão, quem conferiu. Feriados móveis são calculados por regra, mas **só valem depois de confirmados por tribunal**, como no SGJur. Não há fonte aberta consolidada (J4 5.6): o dataset nasce de coleta e conferência humana, e é diferencial e risco ao mesmo tempo. **Dia sem fonte conta como útil**; prazo calculado sem calendário do tribunal traz o aviso "a data pode estar mais cedo, nunca mais tarde".

### 2.4 Estados, responsável e margem

```
proposto ► confirmado ► em_preparo ► em_revisao ► pronto_para_protocolar ► protocolado ► juntado
   └► sem_prazo / cancelado (com motivo)                    exceção: justa_causa (JUR-052)
```

Cada transição é ferramenta própria (`prazo.propor`, `.confirmar`, `.enviar_revisao`, `.registrar_protocolo`, `.encerrar`), como em Fundações 4.8. O Prazo tem uma Tarefa: `prazo_legal` = data fatal, `prazo_interno` = data com margem. Prazos de contrato, regulatórios e administrativos (J3 7.1) usam o mesmo ciclo, sem Comunicação.

- **Responsável, revisor e substituto** obrigatórios na confirmação; Comunicação sem dono ativo fica em "sem dono". Ausência: seção 3.8.
- **Margem interna** (JUR-043, FX-003): data de protocolo = fatal menos N dias úteis por tipo de peça, configurável, valendo só para tarefas futuras. Partida (hipótese, **[a confirmar com a advogada]**): recurso e contestação D-5 úteis; manifestação simples D-2; protocolo no último dia só com aprovação do Gestor. "Fatal" é campo exclusivo de prazo judicial.
- **Revisão sênior** (JUR-219): peça fatal sem revisão registrada não chega a `pronto_para_protocolar`.

### 2.5 Alertas

Escada D-5, D-3, D-1 e dia (JUR-044), sobre a data interna e a fatal, por sistema, e-mail e WhatsApp. D-5 e D-3 `alta`; D-1 e dia `urgente` (fura o silêncio). Tarefa parada 24 h após o D-3 avisa o revisor e o Gestor; no D-1 sem peça pronta, o sócio. O 02 (7.4) rebaixa integrante com mais de 20% de urgentes ignoradas; **prazo fatal fica fora dessa regra** (pedido ao 02). Um job diário sem modelo lista prazos a vencer e Comunicações sem tratamento. Relatório mensal de "quase perdidos" ajusta a margem.

### 2.6 Cumprimento e comprovante de tempestividade

O ato é do advogado (seção 5). O sistema monta o **dossiê de tempestividade** de cada prazo fatal (FX-002 de J8; a Legalcloud guarda documentos de 60 tribunais):

| Item | Origem |
| --- | --- |
| Trecho da Comunicação, com datas | Comunicação |
| **Memória de cálculo** (cada passo: data, regra, artigo, dia contado ou excluído, calendário e versão) | Motor |
| Cópia com hash do ato do tribunal de cada dia especial usado | Calendário forense |
| Recibo de protocolo (data e hora, número) | Anexado pelo advogado |
| Comprovante de juntada | Andamento ou Comunicação seguinte |
| Rascunho do "tópico de tempestividade" para o recurso | Agente prepara; advogado decide se junta |

A comparação "recibo contra fatal" é por regra e grava `tempestivo` (com folga) ou `fora do prazo`, que abre alerta imediato e o fluxo de justa causa.

### 2.7 Casos de borda

| Caso | Tratamento |
| --- | --- |
| Feriado local | Só conta com fonte; alerta recurso em semana de feriado e anexa o ato |
| Suspensão ou indisponibilidade | Dia especial com efeito; recalcula Prazos abertos e propõe nova data com cartão (a confirmada não muda sozinha) |
| Recesso | Suspende; casos penais com exceção (réu preso) saem do automático para decisão humana |
| Prazo comum (mais de um intimado) | Calcula por intimado, propõe a **mais cedo**, pede decisão (art. 231 §§ 1º e 2º **[a confirmar]**) |
| **Ciência tácita no Domicílio** | O prazo provável entra na agenda com a data da tácita mesmo que ninguém abra (3.3). Se o cliente ou outro advogado abrir antes no tribunal, a ciência real é anterior e o prazo vence antes: a listagem é relida todo dia e recalcula |
| Empresa privada não confirmada | Prazo não corre, mas há risco de multa; cartão avisa, sem Prazo contado |
| Fonte dupla divergente | Data mais cedo como provável; pede decisão |
| **Pedido de prorrogação** | Marca "prorrogação pedida"; o vencimento original **continua valendo** até a decisão (CPC art. 139, VI **[a confirmar]**) |
| Publicação cancelada pelo tribunal | Saída "nada a fazer", com motivo (J7) |
| Prazo sem Comunicação | "Prazo avulso" com data-base (audiência, processo físico, administrativo) |
| Falha do sistema ou do tribunal | Reúne evidências e minuta o pedido de devolução de prazo (JUR-052; CPC art. 223 **[a confirmar]**) |

### 2.8 O que é regra e o que é IA

| Etapa | Por regra, sem IA | IA propõe, nunca decide |
| --- | --- | --- |
| Vincular | Dígito verificador e correspondência exata | Sugestão se o número está truncado |
| Classificar o ato | Lista fechada de atos que sempre geram prazo (rede de segurança) | Classe, trecho, confiança; "pode ter prazo" na dúvida |
| Dias, unidade, norma | Tabela de regras por ato e ramo | Leitura do número no teor |
| Termo inicial | Regra do canal | Reconhecer o canal em foto ou PDF do cliente |
| Contagem, recesso, feriados, dobro, data interna, escada | **Tudo** | Nada |
| Memória de cálculo | Gerada do cálculo | Nada |
| Minuta e pesquisa; texto do tópico de tempestividade | | **Tudo**, em "prepara, pessoa conclui" (JU-04) |

**Rede de segurança dupla:** ato que a IA não vê como gerador de prazo, mas traz verbo de comando com número de dias, sobe como "pode ter prazo"; ato de tipo que sempre gera prazo e que a IA marca como expediente também sobe. O alarme falso custa um clique; o falso negativo, um prazo perdido.

### 2.9 Testes de conferência e responsabilidade

Nenhum piloto com dado real antes de o motor passar no gabarito:

1. **Gabarito de contagem**, validado pela advogada (regra jurídica) e conferido pelo contador da família (aritmética), como decidido em 8/11/2026. Meta de crescer para cerca de 100 casos (cinco tribunais; cível, trabalhista, juizado, penal); o especialista de cada área confere o conjunto da área no lançamento (Síntese, 10 e).
2. **Implementação de referência independente** (planilha do conferente): o teste roda as duas e acusa qualquer divergência.
3. **Modo sombra** (semanas **[a confirmar]**): o motor calcula em silêncio os prazos reais de uma advogada ao lado do sistema dela; divergência vira caso novo.

As datas abaixo foram **calculadas por esta sessão** (calendários de 2026 e 2027) e **não foram validadas por advogado**.

| # | Situação | Entrada | Esperado (proposta) |
| --- | --- | --- | --- |
| G01 | Cível, DJEN, 15 úteis | Disponibilizada seg 09/11/2026; 20/11 feriado **[a confirmar]** | Publicação 10/11; dia 1 = 11/11; **qua 02/12/2026** (exemplo de J3) |
| G02 | G01 com feriado local em 18/11 | Ato do tribunal anexado | **qui 03/12/2026** |
| G03 | Véspera de feriado e fim de semana | Disponibilizada qui 19/11/2026; 15 úteis | Publicação seg 23/11; dia 1 = 24/11; **seg 14/12/2026** |
| G04 | Recesso no meio | Disponibilizada seg 14/12/2026; 15 úteis | Contam 16, 17 e 18/12; suspensão; retoma 21/01; **sex 05/02/2027** |
| G05 | Dobro, 30 úteis | Disponibilizada 09/11/2026 | 27º dia em 18/12; 21/01 = 28º; **seg 25/01/2027** (capital de SP: feriado municipal, 26/01 **[a confirmar]**) |
| G06 | Trabalhista, recurso ordinário, 8 úteis | Disponibilizada 09/11/2026 | **seg 23/11/2026** |
| G07 | Penal, 10 corridos | Dia 1 = 11/11/2026 | Dia 10 = 20/11 (feriado): **seg 23/11/2026** (início penal **[a confirmar]**) |
| G08 | Penal no recesso, réu preso | Prazo entre 20/12 e 20/01 | O motor **não calcula**: "decisão humana" |
| G09 | Domicílio: citação confirmada; ente público sem confirmação | Seg 09/11/2026 | **[a definir pela advogada]**: o 5º dia útil, o dia 1, a tácita |
| G10 | Disponibilização no recesso | Sex 18/12/2026 | **[a definir pela advogada]** |
| G11 | Prazo comum; litisconsórcio em autos eletrônicos | Dois intimados; dois réus | Propõe a mais cedo e pede decisão; **sem** dobro **[a confirmar]** |

**Gabarito de classificação.** Atos reais anonimizados por ramo medem quantos prazos a IA acha. Meta de partida **[a confirmar]**: zero falso negativo em atos "sempre geram prazo"; amostra humana mensal; o resultado alimenta a política de autonomia do 02 (3.3).

**Responsabilidade.** O sistema registra memória de cálculo, versão da regra e do calendário, quem confirmou e quando. Termos de uso e seguro de responsabilidade civil são pareceres a obter (R12). Escritório com um só advogado não tem segundo conferente: alternativa proposta é um assistente ou a **recontagem independente** mostrada ao advogado (Pergunta P4).

---

## 3. Comunicações

### 3.1 Canais

| Canal | O que é | Prazo começa | Como entra |
| --- | --- | --- | --- |
| **DJEN** | Meio oficial de intimação de advogados e sociedades; obrigatório (Res. 455/2022 art. 13) | Pela publicação, **sem leitura** | Coletor (3.2) |
| **Domicílio Judicial** | Citações e intimações pessoais a partes, inclusive empresas; cadastro obrigatório (exceção ME e EPP com e-mail na Redesim, texto parcial) | Confirmação ou tácita | Coletor com credencial do titular; **abrir dá ciência** |
| **Painéis** (PJe, eproc, e-SAJ, Projudi) | Fora do DJEN | Abertura ou 10 dias corridos | Fornecedor B ou MNI; robô proibido |
| **Outros diários** | DOU, estaduais, municipais; DJe não migrado **[a confirmar]** | Regra do ato | INLABS, Querido Diário (A); fornecedor B |
| **Carta, oficial, edital** | Meios físicos | Art. 231 | Entrada manual, ou foto e PDF pelo app e WhatsApp: o agente reconhece e sobe como **urgente** |
| **Andamento** | Movimento do Processo; chega "semanas depois do diário" (J7) | Não gera prazo | Conciliação e juntada |

Quem atende empresa precisa do DJEN e do Domicílio; quem atende pessoa física depende mais do DJEN. O SGJur cobre só o DJEN, sem robô nem certificado (J7): o DJEN sozinho resolve a maior parte das intimações de advogado **sem credencial** (consulta pública, **[a confirmar]**).

### 3.2 DJEN: coleta

- **Fontes:** cada inscrição OAB (número e UF **conferidos na fonte**, mostrando o nome do advogado, J7), cada sociedade (CNPJ), nome e variações (JUR-050) e cada número de Processo. Cada fonte é uma Conexão (08 2.1) com cursor e saúde próprios.
- **Frequência:** duas coletas por dia útil (**[a confirmar]**), `fora_do_horario_ok`, mais **reconferência diária** dos últimos 10 dias corridos (hipótese), com aviso quando acha o que a coleta normal não achou.
- **Chave de deduplicação:** o identificador da comunicação, ou hash de (processo, data, tipo, teor) **[a confirmar a API]**.
- **O DJEN não dá ciência:** o risco é a **falta de tratamento**. Três saídas (J7): virar prazo, arquivar por ciência, "nada a fazer". Triagem com dono; meta de triar em 3 dias úteis, mas **o Prazo nasce na chegada** (P4).

### 3.3 Domicílio e painéis: listar não dá ciência, abrir dá

| Capacidade | Efeito | Aprovação |
| --- | --- | --- |
| `comunicacao.listar` | Assunto, data de envio, tipo, status e, se a fonte der, data de ciência | Nenhuma. **Aberto:** se listar no Domicílio dá ciência. Até a resposta, a primeira semana de cada escritório roda com aprovação do Gestor (salvaguarda do 08 5.2) **[a confirmar]** |
| `comunicacao.abrir` | Baixa o teor; **dá ciência**; `da_ciencia` e `irreversivel`; `exige_aprovacao = sempre` | Cartão (Fundações 6.4) |

**Cartão de ciência:** "Abrir aqui conta como ciência no Domicílio; o prazo passa a correr de [data]. Sem abrir, a ciência é considerada em DD/MM e o prazo vence em [data]", com a memória de cálculo dos dois cenários. Quem aprova: o advogado com Mandato; sem advogado (citação inicial de empresa), o representante do cliente pelo app **[a confirmar]**. A autorização geral do titular é pré-condição da Conexão; **cada abertura continua exigindo cartão**.

**Cartão de aviso antes da tácita.** Para toda Comunicação não aberta, avisos em **D-3 e D-1** da tácita (como no 08 13.1), com "abrir agora" e a data em que o prazo passará a correr sozinho. Na tácita, o evento `ciencia.tacita.registrar` troca o Prazo provável pelo real. Nenhuma Comunicação fica sem Prazo e sem aviso (P4).

### 3.4 Duas filas

| Fila | Contém | Risco | Regra |
| --- | --- | --- | --- |
| **Sem tratamento** | Publicações do DJEN sem Prazo confirmado, "sem prazo" ou "nada a fazer" | Prazo corre sem ninguém ver | Alerta por idade (3 dias úteis); escala ao Gestor |
| **Sem ciência** (Domicílio, painéis) | Comunicações fechadas, **ordenadas pelos dias até a tácita**: processo, cliente, tipo, envio, tácita em, cenários A e B, responsável, cartão | Tácita e abertura iniciam o prazo | Aviso D-3 e D-1; reconsulta diária da ciência real |

### 3.5 Deduplicação

Em três níveis, com contagem visível (08 2.3): **técnico** (`conexão + id_externo`); **lógico** (a mesma publicação em duas inscrições do escritório, ou na OAB e na sociedade, vira uma Comunicação com vários destinatários); **entre canais** (DJEN, painel e Andamento fundem-se com `canais[]`; o Prazo usa a data **mais cedo** como provável e pede decisão se divergirem).

### 3.6 Saúde da captura

Cabeçalho e tela por fonte (inscrição, sociedade, CNPJ no Domicílio, tribunal) e por credencial, no estilo "captura ok ontem 03:12" do Contábil (03 6.3). Nenhum fornecedor lido mostra isto (J8); o SGJur vigia "leitura parada" e "sem resposta do CNJ" (J7).

| Estado | Condição (hipótese **[a confirmar]**) | O que acontece |
| --- | --- | --- |
| Ok | Leitura com sucesso há menos de 26 h em dia útil | Verde |
| Atrasada | 26 a 50 h, ou resposta parcial | Amarelo; nova tentativa; aviso ao Administrador |
| **Parada** | Mais de 50 h, 3 falhas seguidas ou credencial inválida | Vermelho; aviso ao Administrador e ao Gestor em 24 h; **contingência em 72 h**: conferir DJEN e painel manualmente (08 seção 11) |
| Sem resposta do órgão | Fonte não respondeu nas últimas tentativas | "Pode haver publicação não lida" |
| **Lacuna** | Andamento de intimação sem Comunicação (JUR-051) | `captura.lacuna`; alerta; reconsulta retroativa |

Sinais: senha mudou, segundo fator ligado, certificado venceu, tribunal fora do ar, geobloqueio (403), chave do DataJud trocada, **faltam publicações esperadas**, versão da API mudou. Cada sinal traz a ação ("o titular precisa entrar de novo"). Na volta, **recaptura retroativa** e relatório do que chegou atrasado. Parada longa: cursor não avança, nada é marcado como feito. O painel global da plataforma vê a saúde por tribunal.

### 3.7 Conciliação e cobertura de ausência

**Conciliação diária sem IA** (JUR-051, JUR-048): Andamentos contra Comunicações; prazos fatais a vencer sem tarefa e Comunicações sem tratamento entram na dupla checagem, com relatório à controladoria.

**Cobertura de ausência** (FX-004, prioridade alta para 1 a 3 advogados). O escritório declara a ausência (período, substituto). O sistema (1) **redistribui** prazos abertos e a triagem da OAB ausente ao substituto, com aviso e registro; (2) **lista o que ficaria sem dono** antes de começar ("3 prazos fatais em 12 dias sem substituto"); (3) entrega resumo na volta; (4) para sócio único, exige indicar um **advogado de emergência** ou aceitar o risco com aviso. A ausência nunca passa em silêncio.

---

## 4. Conectores jurídicos

### 4.1 Família e contrato

Nova família `judiciario` com o contrato comum do 08 (Conector, Conexão, Execução, níveis, cofre, filas, teto de custo, observabilidade) e perfil **por tribunal** (dado versionado: tribunal × sistema × caminho × credencial × nível × data de conferência). Três acréscimos ao 08: `regiao_execucao`, `fonte_monitorada` (Conexão por inscrição, sociedade ou CNPJ, não por escritório) e `restricao_de_uso`. Níveis: **A** oficial gratuito, **A$** oficial pago, **B** fornecedor, **C** robô (fora, 4.6), **D-assistido** humano no circuito.

### 4.2 Oficiais do Judiciário

| Conector | Capacidades | Nível | Credencial | Custo | Limites | Atividades | Risco |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DataJud** | Capa e movimentos (TPU); `nivelSigilo`. **Sem partes, advogados, teor, peças** | **A, só não comercial**; A$ pela Res. 574/2024 **[a confirmar]** | Chave pública rotativa, em configuração | R$ 0; Res. 574: custo efetivo e contrapartida **[a confirmar]** | Termos 3.3 e 3.8 vedam uso comercial e informação derivada; limites sem aviso; sem webhook | JUR-047, 051, 035, 054 | **Alto** (R1) |
| **DJEN** | Publicações com teor, por inscrição, sociedade, processo, nome | **A** **[a confirmar]** | Consulta pública, sem login **[a confirmar]** | R$ 0; infraestrutura no Brasil | **Geobloqueio fora do Brasil** (403 testado em 8/11/2026); API não lida; sem SLA | JUR-032, 035, 050, 051 | **Alto** (R3) |
| **Domicílio Judicial** | `comunicacao.listar`, `.abrir` (**ciência**), confirmar citação; "Meus Representados" | **A** | Credencial de integração do CNPJ; certificado ou gov.br; tipo no cofre **[a confirmar]** | R$ 0 | Ciência irreversível; passo a passo não lido; Justiça do Trabalho: só citação inicial | JUR-033 | Médio |
| **PJe, Jus.br, PDPJ-Br** | Consulta e peticionamento por login humano; SSO com 2 fatores | **D-assistido** | Da pessoa; nunca guardada | R$ 0 | Robô com credencial do advogado: bloqueio (R2) | JUR-046 | Alto |
| **MNI e Escritório Digital** | Intimações e consulta pelo padrão do CNJ | **A** com **termo de adesão por tribunal** **[a confirmar]** | Termo e certificado | **[a confirmar]** | Sem documentação pública consolidada | JUR-034 | Médio |
| **e-SAJ, eproc, Projudi** | Consulta por número; painel | **D-assistido**; C evitado | Login ou certificado da pessoa | R$ 0 | CAPTCHA; bloqueio por volume (TRT4: mais de 1.500 acessos a processos de terceiros em 30 dias); termos por tribunal **[a confirmar]** | JUR-034, 047 | Alto |
| **Calendário forense** | Consultar e cadastrar dias especiais | **Próprio**, com coleta D-assistido; B (Legalcloud) como conferência **[a confirmar]** | Nenhuma | Horas de curadoria **[a confirmar]** | Sem fonte aberta consolidada | JUR-039 a 041 | Alto (R12) |

### 4.3 Captura por fornecedor (B)

| Conector | Capacidades | Credencial | Custo (tabela pública, 8/11/2026) | Limites | Risco |
| --- | --- | --- | --- | --- | --- |
| **Judit** | Consulta por número; histórica por CPF, CNPJ, OAB; autos; monitoramento diário; novas ações; **DJEN por processo e por entidade** | Chave; contrato anual pós-pago (faixas R$ 1 mil a R$ 35 mil por mês) ou pré-pago | Faixa R$ 1 mil: monitoramento **R$ 1,50 por processo por mês**; DJEN por processo R$ 1,35; **DJEN por entidade R$ 1,35 por 100 entregas**; autos R$ 3,50. Faixa R$ 35 mil: monitoramento R$ 0,45 | Mínimo de faixa **[a confirmar]**; termos de IA e redistribuição não lidos | Médio (R14) |
| **Escavador** | Consulta, monitoramento de tribunais e diários, callbacks; **cadastro de certificados no fornecedor** | Token; créditos | **Sob consulta** | A custódia de certificado contraria a regra de nunca guardar (R11): **capacidade desligada** | Médio |
| **Jusbrasil Soluções (Digesto)** | Monitoramento; base ampla | Contrato | **Sob proposta** | Concorrente em IA jurídica; termos proíbem bots e comercializar conteúdo gerado (R4) | Alto |
| **Legalcloud, Turivius, outros** | Prazos e suspensões; jurisprudência | Conta | **[a confirmar]**; Codilo, Predictus, Kurier, JusDados, Oystr **não levantados** | Responsabilidade por erro de prazo (R12) | Médio |

Interface única `processo.*` com **dois** fornecedores atrás (J4, R14) e dado local como saída: se um some, as Comunicações gravadas ficam.

### 4.4 Peticionamento, certificado, assinatura, fontes abertas e cadastros

| Conector | Capacidades | Nível | Credencial | Custo | Limites | Risco |
| --- | --- | --- | --- | --- | --- | --- |
| **Peticionamento** (Jus.br, eproc, e-SAJ, Projudi) | Plataforma só prepara, confere e registra o recibo | **D-assistido** | Do advogado, no equipamento dele | R$ 0 | Ato privativo; robô arrisca bloqueio | Alto |
| **Certificado ICP-Brasil** | Nenhuma. **A3 da OAB** (token ou nuvem; sem A1 em arquivo) fica com o advogado; guardamos só a validade informada. **A1** só de empresa-cliente, no cofre | Credencial humana | A3 | A3 R$ 199 a R$ 229 em OAB/SP; nuvem R$ 49 ao ano (matéria antiga **[a confirmar]**) | Aceite de certificado em nuvem em todos os tribunais **[a confirmar]** | Alto (R11) |
| **Assinatura** (ZapSign, Clicksign, D4Sign) | Procuração, contrato de honorários, termo de IA (Lei 14.063/2020: simples, avançada, qualificada) | B | Token; conta do escritório | R$ 69,90, R$ 69, R$ 79,90 por mês (08) | Aceite por tribunal; API do gov.br para terceiros **não encontrada**; qualificada nunca com o A1 do cofre | Médio |
| **Legislação, jurisprudência, índices** (Senado, LexML, Câmara, Planalto, INLABS, Querido Diário, STJ CKAN, BCB SGS) | Vigência das regras de prazo; base do JU-04 | A (Planalto C/F) | Nenhuma | R$ 0 (CC-BY: atribuir) | Planalto sem API; STF e TST sem dump | Baixo a médio; índices **Alto** (R15) |
| **OAB (CNA); ONR e e-Notariado; SERPRO CNPJ e CPF, Redesim, Juntas** | Conferir inscrição; certidões; qualificar Partes | D-assistido; B; A$ | n/a; conta ONR; contrato SERPRO | Grátis individual; emolumento por UF **[a confirmar]**; CNPJ R$ 0,66 a R$ 1,17, CPF R$ 0,66 | CNA sem API (Provimento 95/2000, R10); reuso do 08 | Médio |

### 4.5 O coletor no Brasil

O DJEN só responde de IP brasileiro. Os conectores `judiciario` rodam num serviço de coleta com saída em região brasileira (J4 cita sa-east-1), IP de saída fixo, isolado do resto, com batimento de coração que alimenta a saúde (3.6), devolvendo só eventos normalizados, nunca credencial. Se a plataforma já roda no Brasil, é um job comum **[a confirmar onde roda]**. Isso também evita transferência internacional de dados de processo (LGPD art. 33, R6). Teste de aceitação: chamada de prova a partir do Brasil e teste do 403 de fora, para o alarme funcionar.

### 4.6 Nunca robô autônomo em tribunal

Estende C8 e P5 do 08, porque o dano é maior: bloqueio da credencial do advogado (Res. CNJ 185/2013 art. 29; Res. 574/2024 art. 3º, também "por API"; avisos do TRT4 e TRT11) e ciência indevida.

| Proibido | Permitido |
| --- | --- |
| Navegador automatizado em PJe, eproc, e-SAJ, Projudi ou Jus.br com credencial do advogado | Consulta pública sem login, **por pessoa**, um número por vez |
| Resolver CAPTCHA automaticamente | API oficial (A) dentro do termo, com limite de taxa por credencial |
| Assinar, protocolar ou dar ciência por qualquer robô | Fornecedor B que cumpre os próprios termos, com contrato de operador |
| Guardar login, senha ou A3 do advogado | MNI com **termo de adesão por escrito**; extensão que só identifica o cliente (05 3) |

Qualquer exceção exige parecer por tribunal, humano no circuito, dor medida, taxa baixa e fallback D-assistido após três falhas (08 8.1 a 8.4). A fila de candidatos a robô do pacote **começa vazia**.

### 4.7 Comprar ou construir a captura

Três capacidades, três respostas (leitura nossa sobre tabelas públicas e J7):

| Capacidade | Fonte pública? | Recomendação |
| --- | --- | --- |
| **Publicações do DJEN** (o que gera prazo) | **Sim** (consulta sem login, a confirmar) | **Construir** (coletor no Brasil, saúde nossa) e **comprar como segunda fonte**: DJEN por entidade custa cerca de **R$ 2,70 por mês** para 200 publicações, e dá "dois olhos" (P6, R14). O SGJur oferece "publicações ilimitadas" porque a fonte é pública (J7) |
| **Andamentos** (capa e movimentos) | **Parcial:** DataJud, **não comercial** (R1) | **Abrir já a tratativa pela Res. 574/2024** (sem código); até lá, DataJud só como validação interna e conciliação, e fornecedor B **só para Processos ativos** |
| **Partes, teor, autos, monitoramento por CPF ou CNPJ** | Não | Fornecedor **sob demanda com cartão de custo**, nunca em lote contínuo |

**A conta, com a fonte.** Custo mensal por escritório = Processos monitorados × preço por processo (R$ 1,50 na faixa de R$ 1 mil; R$ 0,45 na de R$ 35 mil; **faixas intermediárias não levantadas**). Ilustração, **não é cotação**:

| Processos | A R$ 1,50 | A R$ 0,45 |
| ---: | ---: | ---: |
| 100 | R$ 150 | R$ 45 |
| 150 | R$ 225 | R$ 67,50 |
| 300 | R$ 450 | R$ 135 |
| 500 | R$ 750 | R$ 225 |

O preço de entrada do mercado é de R$ 220 a R$ 500, e o Astrea Smart (R$ 439 cheio) e o ADVBOX Essencial (R$ 220, 1.000 processos) incluem centenas de processos monitorados (J1). Logo, **comprar andamentos de todos os processos não fecha** a R$ 1,50, e os concorrentes devem ter captura própria ou condição melhor (leitura nossa, não verificada). Saídas, em ordem: (1) DataJud pela Res. 574; (2) fornecedor só para Processos ativos e o que o DataJud não traz; (3) volume somado de todos os escritórios, que desce a faixa; (4) franquia clara com excedente explícito (JU-05). **Gatilho de revisão:** tratativa negada, ou custo médio por Processo ativo acima do limite que o JU-05 fixar **[a confirmar]**.

---

## 5. Peticionamento assistido

### 5.1 O fluxo

| Passo | Quem | O que acontece |
| --- | --- | --- |
| 1. Peça pronta | Agente prepara; advogado fecha (JU-04) | Peça `pronta_para_protocolo`, com citações verificadas |
| 2. Conferência | Agente (checklist) e advogado sênior | Checklist pré-protocolo (JUR-219): pedidos, anexos, Mandato válido, preparo e depósito recursal (JUR-075), formato, tamanho e ordem por tribunal **[a confirmar]**, prazo. **Sem revisão humana registrada, peça fatal não avança** (J5) |
| 3. Pacote | Agente | Arquivos renomeados e ordenados conforme o tribunal |
| 4. Assinatura | **Advogado**, com o A3, no equipamento dele | **A plataforma não participa nem vê o certificado** |
| 5. Protocolo | **Advogado** | No sistema do tribunal; ato privativo |
| 6. Comprovante | Advogado anexa; agente lê | O recibo em PDF (ou número e hora informados) é comparado ao fatal; grava `tempestivo` ou alerta; Documento `comprovante_protocolo` com hash |
| 7. Juntada | Agente | Confere pelo Andamento ou pela Comunicação seguinte (JUR-047); `juntado`; baixa a Tarefa; registra horas |

Peça fatal no último dia só com aprovação do Gestor, com o horário previsto no cartão. A regra do protocolo até o fim do dia do vencimento (CPC art. 213; Lei 11.419/2006 art. 3º) é **[a confirmar]** e entra no motor como tempestividade com hora.

### 5.2 Por que não é automático

1. **Ato privativo do advogado** (Estatuto; J3): assinar, protocolar, dar ciência, aceitar acordo e aconselhar são sempre da pessoa.
2. **O A3 é pessoal;** a plataforma nunca o guarda (R11; C2 do 08).
3. **Robô arrisca bloquear a credencial** do advogado (R2); o dano é dele.
4. **Protocolo é irreversível.**
5. **Revisão humana integral** (Recomendação CFOAB 001/2024; CPC art. 77); automação sem advogado invade atividade privativa (J5, **[a confirmar]**).

### 5.3 Alternativas por tribunal

| Sistema | Como o advogado protocola | O pacote faz | Pendência |
| --- | --- | --- | --- |
| PJe (Jus.br, PDPJ) | SSO com 2 fatores (PJeOffice ou gov.br ouro) | Pacote, checklist, comprovante | gov.br basta em 2026? **[a confirmar]** |
| eproc, e-SAJ, Projudi | Portal com certificado ou token | Idem | Regras por tribunal **[a confirmar]** |
| Escritório Digital (CNJ e OAB) | Entrada única | Orientar; sem integração na v1 | Adesão MNI por tribunal |
| Processo físico | Papel | Prazo avulso; comprovante digitalizado | |
| MNI com assinatura local | Só com **termo de adesão** | Etapa final (8.2); assinatura continua do advogado | Tribunal por tribunal |

---

## 6. Custos e riscos (entrada para o JU-05)

### 6.1 Unidades de custo

| Unidade | Custo de referência | Tratamento (segue o 08 10.3) |
| --- | --- | --- |
| **Publicação do DJEN** | Próprio: infraestrutura **[a confirmar]**; Judit R$ 1,35 por 100 entregas | Embutida |
| **Processo ativo monitorado** | DataJud R$ 0 (Res. 574 **[a confirmar]**); Judit R$ 0,45 a R$ 1,50 por mês | **Maior custo variável**; franquia com excedente explícito |
| Domicílio, legislação, STJ, índices | R$ 0 | Embutida |
| Autos sob demanda; cadastro SERPRO | R$ 3,50; R$ 0,66 a R$ 1,17 | Cartão de custo; reuso do 08 |
| Assinatura; certificado A3 | R$ 69 a R$ 80 por mês; R$ 199 a R$ 229 em 3 anos **[a confirmar]** | Conta do escritório; do advogado |
| Coletor, cofre, armazenamento; modelo de IA | **[a confirmar]**; medir no piloto | Plano |

**Ordem de grandeza (ilustração):** 100 escritórios, 150 Processos ativos cada, 200 publicações por mês. DJEN comprado como segunda fonte: cerca de **R$ 270 por mês no total**. Monitoramento de todos os 15.000 Processos por fornecedor: R$ 6.750 (a R$ 0,45) a R$ 22.500 (a R$ 1,50), ou **R$ 67,50 a R$ 225 por escritório**, de cerca de 13% a 100% do preço de entrada; monitorando só metade, a metade. **O custo de captura por Processo é o primeiro número a medir no piloto** (Síntese 9.1).

### 6.2 Riscos R1 a R17 priorizados

Prioridade 1 = tratar antes de qualquer piloto com dado de cliente.

| Pr. | Risco (J4) | Tratamento neste subplano | Parecer? |
| --- | --- | --- | --- |
| 1 | **R12** erro de prazo | Seções 2.3 a 2.9: regra versionada, calendário com fonte, gabarito, modo sombra, confirmação, memória | **Sim** (regras, termos, seguro) |
| 1 | **R2** bloqueio de credencial | 4.6: nenhum robô; fornecedor B; limite de taxa | **Sim** (termos por tribunal) |
| 1 | **R3** geobloqueio do DJEN | Coletor no Brasil; falha vira alerta | Não |
| 1 | **R1** DataJud não comercial | Tratativa Res. 574; uso interno; DJEN e fornecedor como base | **Sim** |
| 1 | **R11** custódia de certificado | A3 nunca na plataforma; custódia do Escavador desligada; A1 de empresa só no cofre | Sim |
| 2 | **R5, R6, R7** sigilo, LGPD, segredo de justiça | Seção 7; contrato de operador; segredo fora de fonte compartilhada | **Sim** (parecer único antes do piloto) |
| 2 | **R4** termos de bases comerciais | Não raspar; contrato B com cláusula de IA e redistribuição | Sim |
| 2 | **R14** dependência de fornecedor | Dois fornecedores atrás de `processo.*`; DJEN próprio | Não |
| 3 | **R13** mudança de regra do CNJ | `risco_mudanca` e versão da API no evento (08) | Não |
| 3 | **R15** índices | JU-04: tabela versionada, parecer por justiça | Sim (JU-04) |
| 3 | **R10, R16** CNA da OAB; regulação da IA | Conferência manual da inscrição; humano no circuito | R16 sim |
| 4 | **R8, R9, R17** doutrina, bases, CC-BY | JU-04; metadados `licenca` e `atribuicao` | JU-04 |

### 6.3 O que exige parecer de advogado antes do piloto

(1) Uso comercial do DataJud e a Res. 574/2024; (2) condições do DJEN e do Domicílio, inclusive se **listar** dá ciência; (3) texto vigente das Res. 455/2022 e 569/2024, art. 231, Lei 14.939/2024 e hora do protocolo; (4) termos de cada tribunal do piloto para consulta automatizada; (5) sigilo, LGPD e contrato de operador com o fornecedor, inclusive o envio do número do Processo a terceiro; (6) custódia do A1 de cliente e aceite de assinatura avançada; (7) responsabilidade pelo cálculo e seguro; (8) se a autorização do cliente pelo app basta como "autorização expressa do titular".

---

## 7. Permissões, sigilo e auditoria dos conectores

### 7.1 Credenciais

Segue o cofre do 08 (seção 3): só o processo do conector abre o segredo; **o agente nunca vê certificado, senha ou token**, só "A1 da Empresa X, válido até 12/03/2027, usado 14 vezes em novembro".

| Tipo | Uso | Guardado? |
| --- | --- | --- |
| `token_api` | DataJud (configuração), Judit, assinatura | Sim, cofre |
| `a1_cliente` (ou `token_api`) | Domicílio da empresa-cliente | Sim, com termo e `servicos_autorizados` |
| `oauth` | Agenda e e-mail | Sim |
| **Certificado A3 da OAB** | Assinar e protocolar | **Nunca**; só a validade informada |
| `login_portal` (PJe, e-SAJ) | | **Nunca** (P10 do 08) |
| **Mandato** | Quem atua, até quando; define as OAB e CNPJ monitorados | Registro (JU-01) |

Alerta do A3: D-60, D-30 e D-7; **urgente** se houver prazo fatal em 7 dias e o certificado vencer antes (JUR-229).

### 7.2 Quem pode o quê

Segue a matriz das Fundações; papéis são hipótese para o JU-02.

| Ação | Quem pode |
| --- | --- |
| Listar Comunicações e Prazos, ver saúde | Quem tem o setor e o Caso |
| `prazo.propor` | Integrante e pessoa do setor |
| `prazo.confirmar` (fatal) | **Advogado inscrito na OAB** (inscrição conferida); estagiário só os não fatais |
| `comunicacao.abrir` (ciência) | Advogado com Mandato, por cartão; representante do cliente pelo app em citação inicial **[a confirmar]** |
| `prazo.registrar_protocolo`, `.encerrar` | Advogado ou quem ele indicar, com o recibo; fatal só encerra com recibo |
| Declarar ausência | Gestor jurídico; o próprio advogado |
| Calendário e regras de prazo | O calendário padrão é da plataforma; o escritório só acrescenta dias próprios do foro, com cartão |
| Habilitar Conexões, vincular `a1_cliente` | Administrador; cliente pelo app |
| Painel global de saúde | Equipe da plataforma, sem teor |

### 7.3 Sigilo

1. **O que o fornecedor B sabe:** número do Processo, OAB e CNPJ já dizem o que o cliente faz com o escritório. Enviar o mínimo, com contrato de operador; o escritório pode **excluir um Caso** da captura por fornecedor (fica DJEN ou manual).
2. **Segredo de justiça e `nivelSigilo`:** nunca em fonte compartilhada, nunca no corpus público; teor só para a equipe do Caso (FX-008 de J8).
3. **Isolamento por escritório:** Conexão, cursor, fila, credencial e saúde por escritório (C10 do 08); nenhum Caso de escritório treina, avalia ou alimenta cache global (Síntese 7).
4. **Teor para o modelo de IA:** só o necessário, com redação de dados e contrato de operador (JU-04).
5. **Cliente:** o advogado libera o que o cliente vê; Comunicação com ciência pendente não aparece ao cliente antes da decisão, salvo o aviso de citação reconhecida por foto.

### 7.4 Auditoria

Só inserção, com hash em cadeia (Fundações 5.2). Registra: **cada consulta** (`conector.executar`: conector, fonte, credencial, custo, resultado, itens novos e duplicados, região); **cada uso de credencial**; **cada ciência** (cartão, quem aprovou, texto com a data da tácita, hash do teor, recibo da ciência); **cada Prazo** (versão da regra e do calendário, memória de cálculo, quem propôs e confirmou, "por que a data andou"); **cada cumprimento** (recibo, tempestividade). Um **contador de acessos por credencial e por dia** avisa a 50% do limite conhecido (TRT4: 1.500 em 30 dias). Auditoria mensal automática: Conexões sem leitura há 90 dias, certificados a vencer, tokens sem rotação há 12 meses, fornecedor sem contrato de operador. A retenção do evento de Prazo deve durar enquanto durar o Processo e a responsabilidade do advogado **[a confirmar]**.

---

## 8. Ajustes pedidos, ordem de construção e perguntas

### 8.1 Ajustes pedidos

| Onde | Pedido |
| --- | --- |
| **Fundações 4.12, 08 3.1** | Credencial: `procuracao_judicial` (o Mandato) e registro de credencial humana **não guardada** (A3, só validade) |
| **Fundações 4.8** | Tarefa de Prazo usa `prazo_legal` e `prazo_interno`; `origem = comunicacao_judicial`; `quem_conclui` do Prazo fatal sempre "prepara, pessoa conclui" |
| **Fundações 4.11** | Documento: tipos `memoria_calculo`, `ato_calendario`, `comprovante_protocolo`, `teor_comunicacao` (sigilo por Caso); `origem = captura_judicial` |
| **Fundações 5.7, 6.5** | Eventos: `comunicacao.receber`, `ciencia.registrar`, `ciencia.tacita.registrar`, `prazo.criar`, `.confirmar`, `.recalcular`, `.vencer_hoje`, `captura.parada`, `captura.lacuna`, `calendario.dia_especial.cadastrar`. Catálogo: `comunicacao.*`, `prazo.*`, `calendario_forense.*`, `processo.consultar`, `djen.*`, `domicilio.*`, `peca.conferir`, `peca.preparar_pacote`, `captura.saude`, `ausencia.*`; `comunicacao.abrir` com `da_ciencia` |
| **Fundações 6.4, 8** | Cartão de ciência (dois cenários de data; expira na véspera) e de ausência; prazo fatal em D-1 e no dia é `urgente`, **nunca rebaixado nem agrupado** em resumo |
| **Fundações 5.2** | Retenção do evento de Prazo atrelada ao Processo |
| **02 (7.1, 7.2, 7.4, 3.3)** | Jobs: coleta do DJEN duas vezes ao dia (`fora_do_horario_ok`), conciliação diária, dupla checagem. Gatilhos: `comunicacao.receber`, `captura.parada`, `captura.lacuna`, `prazo.vencer_em_3_dias`, `ausencia.declarar`. **Exceção ao anti-ruído:** prazo fatal fora da regra dos 20%. Ciência e protocolo **nunca** sobem para "faz sozinho" |
| **08 (2.1, 8.3, 2.4, 10, 11)** | Família `judiciario`; `regiao_execucao`, `fonte_monitorada`, `restricao_de_uso`, custo por unidade (processo, publicação); fila de robôs do pacote vazia com a tabela de 4.6; cabeçalho de captura com os estados de 3.6; linhas de custo e riscos R1 a R3, R11, R12 |
| **JU-01** | **Processo:** número CNJ validado, tribunal, grau, sistema, ramo, `nivelSigilo`. **Parte:** polo e prerrogativa de dobro. **Comunicação:** canal, `id_externo`, as quatro datas, destinatário, hash, estado (nova, vinculada, tratada, sem ciência), `canais[]`. **Prazo:** Comunicação de origem (ou nula), norma, dias, unidade, multiplicador, termo inicial, fatal ou final, margem, responsável, revisor, substituto, estado, memória, versões da regra e do calendário. **Andamento:** código TPU, data e hora, fonte. **Mandato:** OAB e CNPJ monitorados, validade, poderes. **Peça:** estado, revisor, hash, vínculo ao Prazo. Entidades leves novas: **Ausência** e **Dia especial** do calendário |
| **JU-02** | Telas: caixa de Comunicações (três saídas, triagem com dono), **fila sem ciência**, painel de prazos (JUR-049), memória de cálculo, calendário forense, **saúde da captura**, cartão de ciência, ausência, conferência de peticionamento e dossiê de tempestividade; Home "hoje" |
| **JU-04** | `regra_prazo.vigente_em(data do ato, ramo, tipo de ato)` curada por advogado, com fonte e vigência; classificação de atos com trecho; texto-base do "tópico de tempestividade"; índices e cálculos; abstenção quando o ato não é reconhecido |
| **JU-05** | Unidades de custo de 6.1; processos monitorados com franquia e excedente explícito (o custo de captura é o que mais escala); custo de autos sob demanda; não prometer preço sem a conta de 4.7 |

### 8.2 Ordem de construção

**Nada é desenvolvido agora.** A ordem vale para depois do BPO. O que não é código começa já: tratativas, pareceres, coleta do calendário, gabarito.

**Por que o motor de prazos é o item mais difícil, e por que vai primeiro:**

1. **O erro é irreversível e pessoal:** um dia de erro é intempestividade (J3).
2. **O calendário forense é dado vivo, sem fonte aberta:** alguém coleta, confere e guarda a prova de cada suspensão (R12).
3. **A regra jurídica tem pontos abertos** (dobro, prazo comum, tácita, recesso, hora do protocolo) que só uma advogada resolve, caso a caso.
4. **Tudo depende da entidade Prazo:** captura sem motor é só uma caixa de entrada; peça, alerta, ausência e comprovante apontam para o Prazo.
5. **É testável sem captura:** com "prazo avulso" digitado já entrega valor (J7) e permite o modo sombra antes de ligar qualquer fonte.
6. **Validar é lento e caro** (gabarito, advogada, contador); começar cedo evita que vire o gargalo do lançamento.

| # | Etapa | Depende de | Entrega | Validação |
| --- | --- | --- | --- | --- |
| **E0** | **Sem código, já:** tratativa com o CNJ; parecer de sigilo, LGPD e termos; tribunais do piloto; gabarito com a advogada e o contador; coleta do calendário | | Respostas, pareceres, G01 a G12 validados | Resposta escrita; parecer registrado |
| **E1** | **Motor de contagem puro** | Fundações, JU-01, JU-04 | Regras de 2.3, calendário forense, memória, "prazo avulso", estados e Tarefa | Gabarito, referência independente, **modo sombra** |
| **E2** | **Alertas, margem, responsável, ausência** | E1, notificações | Escada, margem por peça, revisor, cobertura, "quase perdidos" | Teste da escada; simulação de ausência |
| **E3** | **Coletor do DJEN no Brasil e saúde da captura** | E1, núcleo de conectores (08 C1, C2) | Caixa com triagem, vínculo, deduplicação, estados, recaptura, contingência | Uma inscrição real contra o sistema da advogada; teste do 403 |
| **E4** | **Classificação e proposta por IA** | E1, E3, JU-04 | Ato com trecho, dias lidos, confiança, rede de segurança | Gabarito de classificação |
| **E5** | **Domicílio:** listar, fila sem ciência, cartões de ciência e de tácita | E3, E4, resposta sobre "listar dá ciência" | Conexão por CNPJ com termo; Prazo provável; reconsulta | Cliente PJ do piloto; aprovação do Gestor na 1ª semana |
| **E6** | **Andamentos e conciliação** | E3; CNJ ou fornecedor B | `processo.*` com dois fornecedores; lacunas; DJEN comprado como 2ª fonte | Custo por Processo ativo |
| **E7** | **Peticionamento assistido** | E1, E4, JU-04 | Checklist, pacote, comprovante, dossiê, juntada | Protocolos reais da advogada |
| **E8** | **Painéis por MNI (termo por tribunal), 2º agregador, assinatura** | E6, E7 | Adaptadores conforme as respostas | Por tribunal |

Diferença em relação a J4: o **motor de contagem vem antes de qualquer captura**, e o DJEN entra antes do Domicílio por ser público, de risco menor e sem ciência. O peticionamento fica por último, sem atalho.

### 8.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| P1 | A captura do DJEN é nossa, com uma segunda fonte paga só para conferir? | **Sim** (cerca de R$ 3 por escritório por mês) | "Buscamos nós mesmos os avisos do tribunal e pagamos pouco a uma empresa para conferir se algum escapou?" |
| P2 | Andamentos pelo CNJ por contrato, e fornecedor pago só para os processos ativos? | **Sim**; abrir já a conversa com o CNJ | "Pedimos ao CNJ autorização formal e, até lá, pagamos só pelos processos que estão andando?" |
| P3 | Na primeira semana de cada escritório, a lista do Domicílio roda com aprovação do gestor? | **Sim** (como no e-CAC) | "Até termos certeza de que olhar a lista não faz o prazo correr, uma pessoa aprova cada consulta?" |
| P4 | Escritório com um só advogado: quem confere o prazo fatal? | Assistente, ou recontagem independente do sistema | "Quando só há um advogado, quem confere o prazo?" |
| P5 | Margem padrão: 5 dias úteis para recurso e contestação, 2 para manifestação simples? | **Sim**, a advogada ajusta | "A peça deve ficar pronta uns 5 dias úteis antes do prazo final nos casos graves?" |
| P6 | Avisos com datas diferentes: usa-se a mais cedo e pergunta-se? | **Sim** | "O sistema usa a data mais cedo e pergunta ao advogado?" |
| P7 | Calendário dos tribunais montado por nós, começando pelos da advogada da família e um TRT? | **Sim**; Legalcloud só como conferência | "Montamos nós a lista de feriados e suspensões, começando pelos tribunais que a advogada usa?" |
| P8 | Quem abre uma citação de empresa sem advogado? | Advogado com Mandato; sem advogado, o representante pelo app, com aviso | "Se a empresa foi citada e não tem advogado, o dono pode autorizar pelo celular, sabendo que o prazo começa a correr?" |
| P9 | Modo sombra de algumas semanas antes de qualquer alerta real? | **Sim** | "O sistema calcula em silêncio os prazos que a advogada já tem, só para comparar?" |
| P10 | Parecer de advogado (sigilo, LGPD, termos, responsabilidade, seguro) antes de usar casos reais? | **Sim** | "Antes de usar casos reais, um advogado especializado confere se pode e como proteger quem usa?" |
| P11 | Sócio único: ausência sem substituto exige indicar advogado de emergência? | **Sim**, ou aviso de risco assumido | "Quem cobre o advogado nas férias? O sistema exige alguém ou avisa do risco?" |

## Decisões do usuário (9/11/2026)

Resposta: **segue a hipótese em todas as perguntas** (tabela de perguntas para aval acima). Ficam aprovadas como escritas.

- **P1 a P11 aprovadas.** Captura do DJEN própria com segunda fonte paga só para conferir (cerca de R$ 3 por escritório por mês); andamentos pelo CNJ por contrato (abrir a conversa já) e fornecedor pago só para processos ativos; calendário dos tribunais montado por nós; modo sombra de algumas semanas; sócio único precisa indicar advogado de emergência ou assinar aviso de risco; citação de empresa sem advogado: o representante abre pelo app, com aviso.

- **Regras unificadas** (valem nos cinco subplanos; em conflito, vale esta lista):
  1. **Caso restrito e sócio:** o sócio não entra automaticamente; pede acesso com motivo, o acesso fica registrado e os membros do Caso são avisados.
  2. **Segunda conferência do prazo fatal (um só advogado):** recontagem independente do motor, confirmação do advogado e segundo aviso no dia seguinte; colega de fora é opcional. Só advogado inscrito confirma prazo fatal e dá ciência.
  3. **Margem interna:** padrão por tipo de peça (JU-03: 5 dias úteis em recurso e contestação, 2 em manifestação simples); D-2 útil onde não houver regra do tipo; a advogada ajusta de D0 a D-5.
  4. **Domicílio Judicial:** ciência nunca delegável; autorização geral do titular mais cartão a cada ciência; na primeira semana de cada escritório a lista roda com aprovação do gestor. Listar nunca dá ciência.
  5. **Cache global:** só perguntas canônicas da base; perguntas dos advogados ficam no escritório.
  6. **Gestão sem Painel:** mora dentro do Jurídico, uma só, com Clientes (DA-02.1).
  7. **Contrato:** a entidade de cláusulas e vigência (consultivo) se chama *Contrato*; o de honorários é *Contrato de honorários* (JU-05) e não colide.
  8. **Avisos com datas diferentes:** vale a mais cedo, com pergunta ao advogado; o motor mostra a origem do número ("lido no texto" ou "sugerido"), não porcentagem de confiança.
  9. **Antes de usar casos reais:** parecer de advogado especializado (sigilo, LGPD, termos, responsabilidade, seguro) e modo sombra de algumas semanas sem alerta real.

## Decisão do usuário (9/11/2026, terceira rodada)

**Calendário forense agentificado:** um integrante coleta atos de suspensão de prazo e feriados nos diários e portais dos tribunais, propõe o calendário com fonte e data, e uma pessoa só ratifica; as horas humanas de curadoria caem (valor no JU-12 v0.3). A ratificação humana continua obrigatória.
