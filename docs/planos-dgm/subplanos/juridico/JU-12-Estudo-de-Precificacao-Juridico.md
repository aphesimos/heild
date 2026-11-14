# JU-12 · Estudo de precificação do pacote Jurídico e calculadora planejada

**Versão 0.5 · 9/11/2026 (Essencial sem App; App incluído no Integrado e no Completo; fixos com IA; sem parecer pago; sem taxa de correspondente) · só planejamento; nada é desenvolvido agora.** Este estudo soma tudo o que os subplanos JU-01 a JU-11 pedem em dinheiro e responde: quanto custa entregar o pacote Jurídico a um escritório de advocacia, quanto cobrar, quanto sobra, quantos escritórios são precisos para a conta fechar e o que precisa ser medido antes de fixar preço. Segue o padrão do [Estudo de Precificação por Módulo](../../Estudo_de_Precificacao_por_Modulo.md) (Contábil). **Todos os preços são parâmetros de teste, não preço final de venda.** Os parâmetros em formato de máquina estão em [parametros-juridico.json](../../precificacao/parametros-juridico.json), que é só uma proposta: `parametros.json`, `configurador.html` e `teste_configurador.js` **não foram alterados**.

## Mudanças da v0.5

**Decisão do Enzo sobre a pergunta 15 (Essencial com ou sem App).** Ele perguntou se o mercado jurídico dá app nos planos essenciais e disse: "se não, pode deixar à parte e diminuir o preço". **Evidência** (marcar **[a confirmar]** nas páginas oficiais antes do lançamento): J8, linha 75, mostra o portal e app do cliente do Astrea só a partir do plano Smart (não nos de entrada Light e Up); o Projuris tem "área do cliente" no ADV completo, não no ADV Start (J1, linha 64); uma busca nova foi inconclusiva e contraditória (uma página do Astrea cita Company e VIP; um blog da Aurum diz que o Projuris cobra funcionalidades à parte). **Conclusão:** nos planos de entrada do mercado o portal não é padrão.

**O que mudou:** (1) o atalho **Essencial do Jurídico fica sem App**, voltando a **R$ 250 / 395 / 682** (Solo, Pequeno, Médio); conta refeita e conferida: núcleo + pacote Jurídico + captura. O **piso de R$ 250** e o **atalho de R$ 395**, aprovados em 9/11/2026, **voltam a valer**. (2) O **App** (R$ 40 fixos + R$ 0,60 por cliente efetivo, faixas) vira **complemento opcional do Essencial** (Essencial + App: R$ 261 / 559 / 984) e **continua incluído no Integrado e no Completo**, com os mesmos preços da v0.4. (3) **Isto é uma exceção do Jurídico** ao "App incluído por padrão", justificada pelo mercado jurídico; **não vale automaticamente ao Contábil**, cujo Essencial inclui o App e que **não foi reavaliado** aqui (seção 15).

| Número-chave (uso provável) | v0.4 (App também no Essencial) | **v0.5 (Essencial sem App)** |
| --- | --- | --- |
| **Preço do Essencial** (Solo / Pequeno / Médio) | R$ 261 / 559 / 984 | **R$ 250 / 395 / 682** (com App opcional: R$ 261 / 559 / 984) |
| **Preço do Integrado / do Completo** | R$ 338 / 726 / 1.279; R$ 413 / 920 / 1.681 | **Sem mudança** |
| **Margem de contribuição do Essencial** | 67,8% / 49,7% / 38,9% | **72,3% / 42,8% / 30,9%** |
| **Margem após fixos do Essencial** (R$ 6 mil; R$ 8,1 mil) | 52,5% / 13,9% / −1,7%; 47,1% / 1,4% / −16,0% | **56,3% / −7,8% / −27,7%; 50,7% / −25,6% / −48,3%** |
| **Equilíbrio** e **caixa no mês 12** (cenário base) | 15 / 19 escritórios; +R$ 14,3 mil | **Sem mudança** (a carteira de referência usa Integrado e Completo com IA, que já incluem o App) |
| **Capital inicial do piloto** | R$ 5,9 / 8,3 / 10,6 mil | **Sem mudança** (o piloto usa o Completo com IA, que inclui o App) |

**Leitura honesta:** o Essencial do Pequeno volta a ser **barato e não se paga** (−7,8% após fixos com R$ 6 mil, já era assim no JU-05); ele é a porta de entrada, e o App (R$ 164 no Pequeno) é o que leva o escritório ao Integrado ou ao complemento. O Essencial de R$ 395 do Pequeno fica **dentro da faixa de mercado** (R$ 349 a R$ 499); o Essencial com App (R$ 559) ficaria 12% acima do topo.

## Mudanças da v0.4 (mantidas, exceto o Essencial: ver v0.5)

**Correção do Enzo sobre o App.** Ele se enganou ao dizer que o App seria vendido à parte (pensava na marca branca). **Regra correta, para todos os pacotes de área:** o **App do cliente funciona por padrão, incluído nos atalhos e pacotes**, sem contratação extra; o que se vende à parte é a **marca branca** e o **app na loja** (complementos pagos que já existiam). O CRM segue como na v0.2 (incluso e escalando por cliente: R$ 0,70, faixa parando em 0,75). Como o App está incluído, **o valor por cliente sobe de R$ 0,15 (JU-05) para R$ 0,60**, com fixo de R$ 40 como parte do módulo e sem franquia. Critério: depois do fator da faixa de clientes, cobrir o custo provável (R$ 0,20 por cliente) com **folga de pelo menos 50% nas faixas até 1.000 clientes**: R$ 0,60 × 0,55 = R$ 0,33 (65% de folga); R$ 0,50 daria R$ 0,275 (37%), e não cumpre. O custo do App no Jurídico é o mesmo herdado do Contábil (R$ 3 / 5 / 10 fixos; R$ 0,10 / 0,20 / 0,50 por cliente), então o valor pode ser o mesmo nos dois pacotes.

| Número-chave (uso provável) | v0.3 (App à parte; não incluído) | **v0.4 (App incluído, R$ 40 + R$ 0,60 por cliente)** |
| --- | --- | --- |
| **Preço do Integrado** (Solo / Pequeno / Médio) | R$ 268 / 562 / 977 | **R$ 338 / 726 / 1.279** |
| **Preço do Completo** (sem IA) | R$ 344 / 757 / 1.378 | **R$ 413 / 920 / 1.681** |
| **Preço do Completo com IA e módulo Trabalhista** | R$ 483 / 1.174 / 2.212 | **R$ 552 / 1.337 / 2.515** |
| **Margem após fixos do Integrado** (com R$ 6 mil de fixos) | 53,8% / 16,7% / 1,6% | **58,8% / 27,9% / 14,7%** |
| **Margem após fixos do Completo** (R$ 6 mil) | 57,7% / 23,8% / 10,7% | **61,1% / 31,4% / 19,1%** |
| **Margem após fixos do Completo com IA** (R$ 6 mil) | 64,1% / 43,8% / 36,8% | **65,9% / 46,5% / 39,2%** |
| **Equilíbrio** (carteira de referência, fixos de R$ 8,1 mil; antes / após tributos) | 18 / 23 escritórios | **15 / 19** (com R$ 6 mil: 11 / 14; com encarregado terceirizado: 20 / 25) |
| **Caixa no mês 12**, cenário base (fixos de R$ 8,1 mil) | −R$ 3,8 mil | **+R$ 14,3 mil** (resultado do mês positivo no mês 6; caixa acumulado positivo no mês 11; com R$ 6 mil: +R$ 39,6 mil) |
| **Capital inicial em dinheiro** (piloto de 1 a 5 escritórios, 4 meses) | R$ 5,4 mil / 7,5 mil / 9,5 mil | **R$ 5,9 mil / 8,3 mil / 10,6 mil** (o App entra no custo do piloto) |

**Atenção (resolvida na v0.5):** com o App também no Essencial, ele custaria R$ 261 / 559 / 984 e o atalho de R$ 395 deixaria de valer. O Enzo decidiu **Essencial sem App**; o Integrado do Pequeno (R$ 726) segue 45% acima do topo do mercado (R$ 499).

## Mudanças da v0.3 (mantidas)

Três decisões do Enzo (9/11/2026) entraram, além da regra de CRM e App da v0.2: **(1)** automatizar com a IA do nosso time o que for possível nos fixos novos (calendário forense, encarregado de dados); seguro continua, mas só com cliente pagante; **(2)** **nenhum parecer especializado pago**: a revisão é por escrito, por advogados conhecidos do grupo, e o piloto é de **1 a 5 escritórios**; **(3)** **a plataforma não é marketplace**: sem taxa nem receita de correspondente (o JU-09 vale como está).

| Número-chave | v0.2 | v0.3 (sem o App incluído; os valores de equilíbrio e caixa foram refeitos na v0.4 acima) |
| --- | --- | --- |
| **Fixos por mês** (baixo / provável / alto) | R$ 9.080 / 11.330 / 13.580 | **R$ 3.547 / 8.105 / 9.630** (provável: R$ 7.475 em dinheiro e R$ 630 de valor do tempo da equipe); R$ 6.000 aprovados seguem como referência |
| **Equilíbrio** (carteira de referência; antes / após tributos) | 26 / 32 escritórios | **18 / 23** (com R$ 6 mil: 14 / 17; com encarregado contratado: 24 / 30) |
| **Capital inicial** antes da primeira venda | R$ 66 mil a 148 mil (pareceres R$ 21 a 82 mil mais piloto de 10 a 20 escritórios) | **Dinheiro: R$ 5,4 mil a 9,5 mil** (piloto de 1 a 5 escritórios por 4 meses; pareceres R$ 0). **Valor do tempo da equipe: R$ 7,3 mil a 14,2 mil**, mais R$ 18 mil de curadoria se for tempo e não pagamento |
| **Caixa no mês 12**, cenário base | −R$ 42,5 mil | **−R$ 3,8 mil** (resultado do mês positivo no mês 7; contando só dinheiro, sem o valor das horas da equipe: +R$ 90,3 mil) |
| Correspondentes | Taxa de R$ 5 por demanda | Sem taxa e sem receita |

**Aviso que não muda:** sem parecer pago, o **risco de sigilo, LGPD e ética continua**; o que muda é o controle, que passa a ser **contratual** (termo do piloto, cliente com termo de IA, casos reais só de quem consentiu, revisão escrita por advogado do grupo). O parecer pago volta quando houver clientes pagantes em escala (seção 4.6).

## 1. Resumo e como ler

**Palavras que aparecem (em linguagem simples):**

| Termo | Quer dizer |
| --- | --- |
| **Margem de contribuição (a)** | O que sobra do preço depois de pagar o que aquele escritório custa para atender: servidor, IA, suporte, conectores. Não conta contas fixas nem impostos |
| **Margem após fixos (b)** | (a) menos a fatia das contas fixas do pacote que cabe ao escritório |
| **Margem líquida estimada (c)** | (b) menos impostos sobre a receita (12,5% de trabalho). Ainda não é lucro: falta imposto de renda e outros |
| **Fixos** | Contas mensais que existem com ou sem cliente (curadoria das leis, seguro, coletor de publicações) |
| **Equilíbrio** | Quantos escritórios pagando são precisos para a contribuição cobrir os fixos |
| **Piso** | Menor preço que se aceita (mensalidade R$ 250; implantação nunca abaixo do custo) |
| **Faixa** | Desconto por volume: os clientes e processos que passam de certo número valem menos |
| **Inscrição OAB** | Um advogado inscrito. Captura de publicações, peticionamento, IA e módulos de lei contam por inscrição |
| **Agregador** | Empresa que vende consulta e monitoramento de processos de todos os tribunais (a referência é a Judit) |
| **UU** | Unidade de uso da IA: 10 mil tokens (pedaços de texto) |
| **Custo + 20%** | Repasse com acréscimo de um quinto sobre o custo real |

**Números-chave** (escritórios-tipo da seção 5; uso provável; fixos aprovados de R$ 6 mil por mês):

| Escritório | Atalho Integrado | Completo com IA e módulo Trabalhista | Margem (a) Integrado / Completo com IA | Margem (b) Integrado / Completo com IA |
| --- | ---: | ---: | --- | --- |
| **Solo** (1 advogado) | R$ 338 (Essencial R$ 250, sem App) | R$ 552 | 70,6% / 73,1% | 58,8% / 65,9% |
| **Pequeno** (5 usuários, 3 advogados) | R$ 726 (Essencial R$ 395, sem App) | R$ 1.337 | 55,4% / 61,5% | 27,9% / 46,5% |
| **Médio** (10 usuários, 6 advogados) | R$ 1.279 (Essencial R$ 682, sem App) | R$ 2.515 | 45,9% / 55,1% | 14,7% / 39,2% |

**App do cliente incluído no Integrado e no Completo; opcional no Essencial** (exceção do Jurídico, seção 15): R$ 40 fixos mais R$ 0,60 por cliente efetivo; no Solo, Pequeno e Médio, **R$ 69, R$ 164 e R$ 302 por mês**, com margem de 78,3% / 66,4% / 57,0%. O **Completo** inclui o CRM, a R$ 0,70 por cliente (seção 3.2).

**Equilíbrio:** com os fixos novos (R$ 8,1 mil: seção 4.4) e uma carteira de 50% Solo, 40% Pequeno e 10% Médio com 60% levando IA, bastam **cerca de 15 escritórios** antes de impostos e **19** depois (com os R$ 6 mil aprovados, 11 e 14; com encarregado terceirizado, R$ 10,5 mil, 20 e 25). O fluxo de caixa dos 12 primeiros meses no cenário base termina em **+R$ 14,3 mil** (resultado do mês positivo no mês 6); com R$ 6 mil de fixos seria +R$ 39,6 mil (seção 11).

**O que este estudo muda ou corrige em relação ao JU-05** (detalhes nas seções indicadas):

1. **Fixos:** os R$ 6 mil aprovados não incluem calendário forense, encarregado de dados e seguros, que JU-03 e JU-10 pedem; com a IA do nosso time fazendo o que dá, o total é R$ 8,1 mil e não R$ 11,3 mil (seção 4.4).
2. **CRM e App vendiam abaixo do custo por cliente** (R$ 0,40 contra R$ 0,43; R$ 0,15 contra R$ 0,20): decisão do Enzo aplicada, **CRM no Completo a R$ 0,70 por cliente, escalando com a quantidade, e App incluído nos atalhos a R$ 40 + R$ 0,60 por cliente** (seções 3.2, 5.3 e 15).
3. **A franquia de 15 GB por usuário** tinha custo fora das margens; entrou (seção 4.2).
4. **Erros de conta do JU-05** corrigidos: margem após fixos do Pequeno Essencial sem App é −7,8% (não 5,6%) e o equilíbrio do Integrado é 20 escritórios pequenos (não 19, e a conta misturava antes e depois de impostos) (seção 12).
5. **A margem de 60% na IA** só se mantém, com o suporte da IA somado, até 44% (Essencial) e 47% (Operação) do teto usado; a premissa é 50% (seção 6).
6. **Implantação do Solo grátis em autoatendimento** (decisão aprovada) entrou no fluxo de caixa (seção 11).

## 2. Escopo, método e limites

**Entradas lidas:** a conferência do pacote Jurídico; JU-05 (seções 5 e 6, que é a proposta de partida); JU-04, seção 7 (custos e cota ponderada); JU-03, seção 6 (custos de captura e conectores); as "Decisões do usuário (9/11/2026)" de JU-01 a JU-05; JU-07 (seção 11, custos de WhatsApp e IA) e JU-10 (seguros, encarregado, pareceres); o Estudo do Contábil e `parametros.json`. JU-06, JU-08, JU-09 e JU-11 ficaram prontos ao fim da escrita e foram lidos **só nas seções de custo** (JU-06 6.4, JU-08 8, JU-09 9, JU-11 2.8, 4 e 5.2); onde não trazem número, marquei **[premissa]**.

**Método.** Contas refeitas em Python (scripts fora do repositório); reproduzem a tabela do JU-05 antes das correções, e `parametros-juridico.json` foi conferido contra o modelo (15 combinações de preço e custo coincidem).

**Moeda:** reais de 7/11/2026; insumos em dólar a R$ 7,97, como no Contábil. **Tributos:** 12,5% de trabalho (faixa de 8% a 17%), **a confirmar com o contador da família**. **Mercado:** faixa lida pelo SIJUR em 18/10/2026 **[a confirmar]**; preços de blogs divergem; os de fabricantes vêm de J1 e J7 (fontes secundárias).

**O que este estudo não prova:** nenhum uso do Jurídico foi medido; clientes por escritório, 1,6 processo por cliente, 60% de advogados, mensagens, documentos, horas e adesão à IA são **premissas**. Proposta: aprovar parâmetros de teste e **medir no piloto de 1 a 5 escritórios antes de fixar preço**.

## 3. O configurador do Jurídico

### 3.1 A equação

O preço sai de uma equação, como no Contábil, com cinco mudanças próprias do Jurídico (e a regra de CRM e App da seção 15):

```
Preço = Σ módulos m [ B_m + a_m × C_ef + u_m × U + p_m × P_ef ]      (núcleo, pacote Jurídico, Timesheet, Financeiro, CRM, App)
      + 15 × I   (captura)  + 19 × I (peticionamento, opcional)
      + 1,2 × custo × processos monitorados                          (monitoramento, opcional)
      + 1,2 × custo × documentos assinados                           (assinatura, opcional)
      + Σ módulos de lei [ preço × advogados que usam ]
      + Σ planos de IA [ n_plano × preço ] + bolsa + uso extra
      + GB acima da franquia × R$ 0,45
Piso: se a soma ficar abaixo de R$ 250, cobra R$ 250.
C_ef = clientes pela faixa de clientes (no CRM a faixa não desce de 0,75; o App tem R$ 40 + R$ 0,60 × C_ef);  P_ef = processos pela faixa de processos;  I = inscrições OAB
```

**Mudanças:** (1) **tabela de preços por pacote de área**, porque as bases do Contábil (CRM R$ 200, Painel R$ 200) jogariam o Solo muito acima do mercado jurídico; (2) **componente de processo** (R$ 0,12 por processo ativo) com faixa própria; (3) **piso do pacote** de R$ 250 (o do Contábil é R$ 700); (4) **inscrição OAB** como unidade de cobrança; (5) **complementos por unidade** com preço de repasse. **Não há desconto implícito:** atalho é só marcação.

### 3.2 Tabela de preços (R$ por mês, parâmetros de teste)

| Componente | Base | Por cliente | Por usuário | Por processo | Origem |
| --- | ---: | ---: | ---: | ---: | --- |
| Núcleo (contas, papéis, cadastro, tarefas, cofre) | 100 | 0,30 | 5 | 0 | Herdado (`nucleo_sem_contabil`) |
| **Pacote Jurídico** | 30 | 0 | 18 | 0,12 | Aprovado (JU-05) |
| Timesheet | 20 | 0 | 7 | 0 | Aprovado |
| Financeiro (honorários) | 30 | 0,40 | 0 | 0 | Aprovado |
| CRM (e WhatsApp, repassado) | 40 | **0,70** (era 0,40) | 2 | 0 | **Regra do Enzo**; faixa de clientes com piso de fator 0,75 (5.3) |
| **App do cliente** (incluído no Integrado e no Completo; opcional no Essencial) | 40 | **0,60** (era 0,15) | 0 | 0 | **Correção do Enzo**; sem franquia; cobre o custo de R$ 0,20 com folga de 50% até 1.000 clientes (5.3) |

**Faixa de clientes** (as do Contábil): 1 a 30: 1,00; até 60: 0,92; até 120: 0,85; até 250: 0,75; até 500: 0,65; até 1.000: 0,55; acima: 0,50. **Faixa de processos:** 1 a 100: 1,00; até 300: 0,90; até 1.000: 0,80; acima: 0,70. **Atalhos** (sem desconto): **Essencial** = núcleo + pacote + captura (**sem App**; o App é complemento opcional); **Integrado** = Essencial + App + Timesheet + Financeiro; **Completo** = Integrado + CRM. **O Integrado e o Completo incluem o App**; o Essencial não, por exceção do Jurídico justificada pelo mercado (nos planos de entrada o portal do cliente não é padrão, J8 e J1 **[a confirmar]**; no Contábil o Essencial inclui o App). Nunca pré-marcados: monitoramento, peticionamento, assinatura, módulos de lei, IA, **marca branca e app na loja** (estes dois são o que se vende à parte).

### 3.3 Complementos e IA (preço)

| Complemento | Preço | Regra |
| --- | --- | --- |
| **Captura de publicações** (DJEN e Domicílio) | R$ 15 por inscrição OAB | Pré-marcada (aprovado) |
| **Monitoramento de andamentos** | Custo + 20% por processo monitorado (referência R$ 1,80) | Aprovado; o escritório escolhe os processos |
| **Peticionamento assistido** | R$ 19 por inscrição | Aprovado |
| **Assinatura eletrônica** | Custo + 20% por documento (referência R$ 3,00) | **Proposta**, para depois: na v1 o escritório contrata o provedor (JU-08 8.3) |
| **Módulo de lei** | Trabalhista R$ 60; Família e Sucessões R$ 60; Penal R$ 90; pacotes R$ 100 e R$ 110 | Contrato por escritório, cobrado por advogado (pergunta 3) |
| **IA** | Essencial R$ 79; Operação R$ 189; Intensivo R$ 299 por usuário | Iguais às do Contábil |
| **Marca branca; app na loja** (à parte) ; GB extra | R$ 150; R$ 350; R$ 0,45 | Iguais às do Contábil; o app na loja exige App e marca branca; 15 GB por usuário incluídos |

## 4. Custos por componente e fonte

### 4.1 Como ler

Listas **[baixo, provável, alto]** em R$ de 7/11/2026. **Herdado** vem de `parametros.json`. O restante é premissa a medir. O custo do suporte humano por assento (R$ 6 / 12,50 / 25) já está no núcleo.

### 4.2 Tabela de custos

| Componente | Fixo | Por cliente | Por usuário | Por processo | Fonte |
| --- | --- | --- | --- | --- | --- |
| Núcleo (com suporte por assento) | 12 / 22 / 55 | 0,10 / 0,30 / 0,75 | 6 / 12,50 / 25 | n/a | Herdado |
| Pacote Jurídico | 3 / 6 / 15 | n/a | 1 / 2 / 4 | 0,02 / 0,05 / 0,12 | Premissa (JU-05) |
| Timesheet | 0 | 0 | 1 / 2 / 5 | n/a | Herdado |
| Financeiro | 3 / 8 / 20 | 0,052 / 0,10 / 0,30 | 0 | n/a | Herdado |
| App do cliente | 3 / 5 / 10 | 0,10 / 0,20 / 0,50 | 0 | n/a | Herdado (igual ao do Contábil) |
| CRM sem WhatsApp | 0 | 0,20 / 0,43 / 1,18 | 0 | n/a | Herdado; JU-07 11 confirma que a quantidade do jurídico é emprestada do Contábil |
| Chat de suporte e ajuda | n/a | n/a | 1 / 2 / 4 e 0,06 / 0,16 / 0,65 | n/a | Herdado |
| **Armazenamento da franquia (15 GB por usuário)** | n/a | n/a | 0,24 / 1,50 / 5,25 | n/a | **Novo:** uso de 20% / 50% / 100% da franquia × R$ 0,08 / 0,20 / 0,35 por GB |
| Captura de publicações | n/a | n/a | por inscrição: 2 / 4 / 8 | n/a | JU-05 (premissa); inclui a segunda fonte do DJEN |
| Monitoramento | n/a | n/a | n/a | 1,00 / 1,50 / 2,00 | JU-03: Judit R$ 1,50 por processo (faixa de R$ 1 mil por mês); baixo e alto são premissas |
| Peticionamento assistido | n/a | n/a | por inscrição: 1 / 2 / 4 | n/a | Premissa |
| **Assinatura eletrônica** | n/a | n/a | n/a | por documento: 1,50 / 2,50 / 4,00 | JU-08 8.1: plano ÷ franquia dá R$ 1,30 a R$ 3,50 por documento (ZapSign, Clicksign) **[a confirmar]**; baixo e alto são premissas |
| Módulo de lei | curadoria R$ 1.500 (v1) ou R$ 4.000 por módulo | n/a | por advogado: 1 / 2 / 4 | n/a | JU-05 e JU-04 |

### 4.3 IA

**Utilização do teto no Jurídico:** 15% / **50%** / 80% / 100% (Contábil: 15 / 35 / 70 / 100), porque autos e peças pesam mais (J5). Custo por usuário = utilização × limite mensal × R$ 0,0882 por UU + infraestrutura. **Essencial: R$ 26,0** (0,50 × 430 UU × R$ 0,0882 + R$ 7) e **Operação: R$ 70,9** (0,50 × 1.290 × R$ 0,0882 + R$ 14). **Cota ponderada** (decisão de JU-04): o resumo de autos deixa de esgotar a janela, mas o custo por UU sobe. Derivação minha, a partir de JU-04 7.1 (25% dos tokens em modelo barato, R$ 0,60 por milhão): UU do modelo principal = R$ 0,1156, **31% acima** dos R$ 0,0882; entra como sensibilidade (seção 6).

### 4.4 Fixos do pacote, reavaliados com a IA do nosso time (v0.3)

**Pergunta do Enzo:** esses trabalhos não poderiam ser automatizados pela nossa IA? Item a item, o que dá e o que não dá. **Convenção:** "dinheiro" é o que sai do caixa; "tempo" é o valor das horas da equipe a R$ 90 (como no resto do Estudo), que não sai do caixa se a equipe não tem salário. IA no padrão do Estudo: 1 UU = 10 mil tokens a R$ 0,0882.

| Item (R$ por mês) | O que a IA faz | O que continua humano ou externo | Baixo / provável / alto | Natureza |
| --- | --- | --- | --- | --- |
| **Coletor no Brasil e monitor de saúde** | Nada: é servidor com IP brasileiro; o monitor já é automático | Contrato e infraestrutura | 400 / 400 / 400 | Dinheiro (premissa de JU-05) |
| **Mínimo de faixa do agregador** | Nada: é contrato | Só se contrata com cerca de 667 processos pedidos (7.1); no baixo, DataJud pela Res. 574 ou pré-pago **[a confirmar]** | 0 / 1.000 / 1.000 | Dinheiro |
| **Curadoria de 3 módulos de lei** (R$ 1.500 cada) | Ingestão, vigilância por norma e verificação já são IA (JU-04); a IA pode fazer a primeira versão | Gabarito, auditoria mensal e conferência do especialista no lançamento. **Não há base para cortar o valor**: o provável mantém R$ 4.500; o baixo (metade) é **premissa a medir** | 2.250 / 4.500 / 4.500 | Dinheiro se pago a revisor; tempo se da equipe **[a decidir]**; tratado como dinheiro, por prudência |
| **Calendário forense** (era 12 h = R$ 1.080) | Um integrante coleta atos de suspensão de prazo e feriados nos diários e portais, propõe o calendário **com fonte e data**: 15 / 30 / 60 tribunais × 25 UU = 375 / 750 / 1.500 UU, **R$ 33 / 66 / 132** (premissa) | Uma pessoa **ratifica** cada entrada: 2 / 3 / 4 horas = **R$ 180 / 270 / 360**. Erro de calendário é erro de prazo (R12): a ratificação não sai | 213 / 336 / 492 | IA em dinheiro; horas em tempo |
| **Encarregado de dados** (era R$ 1.500 a 4.000) | Um integrante redige RIPD, ROPA, respostas a pedidos de titulares e triagem de incidentes, para aprovação | Um **sócio da plataforma é nomeado por escrito** e aprova: 2 / 4 / 8 horas = **R$ 180 / 360 / 720**. IA: 50 / 100 / 200 UU = **R$ 4 / 9 / 18** | 184 / 369 / 738 | Tempo do sócio; IA em dinheiro. **Terceirizado só quando a escala ou um cliente exigir** (sensibilidade abaixo) |
| **Seguros** (E&O de tecnologia e cibernético) | Nada: não se automatiza | Contratação. **Começa só quando houver cliente pagante**; no piloto gratuito não há prêmio (e, por isso, não há cobertura) | 500 / 1.500 / 2.500 | Dinheiro (JU-10 9.2: R$ 3 mil a 15 mil por ano cada, estimativa) |
| **Total mensal** | | | **3.547 / 8.105 / 9.630** | Provável: **R$ 7.475 em dinheiro e R$ 630 em tempo** |

**Encarregado e a ANPD.** O JU-10 registra que a Res. CD/ANPD 2/2022 dispensa agentes de tratamento de pequeno porte de indicar encarregado, mas **não** quem faz tratamento de alto risco (uso de IA e dado sensível entram nos critérios) **[a confirmar o texto; este estudo não o leu]**. Por isso o sócio é nomeado por escrito mesmo que a dispensa valesse, e a nomeação vale para a plataforma e, como modelo, para os escritórios (JU-10 P2). **Se o encarregado for terceirizado** (R$ 1.500 / 2.750 / 4.000, JU-10 P3), o total sobe a **R$ 4.863 / 10.486 / 12.892**.

**O que não está na conta:** teste de invasão anual, certificação, carimbo do tempo e chaves por escritório (sem valor levantado, JU-10); reserva de prazos e testes com canários (JU-06). **Antes e depois:** R$ 6.000 aprovados (referência) → R$ 11.330 (v0.2) → **R$ 8.105** (v0.3). **Cenários de leitura:** com plataforma inclusa (soma R$ 8,2 mil comuns ao Contábil e ao BPO), R$ 16.305; com plataforma e encarregado terceirizado, R$ 18.686. **Possível dupla contagem:** os R$ 1.000 do agregador somam-se ao custo por processo; acima de 667 processos monitorados o mínimo some dentro do custo variável (7.2).

### 4.5 WhatsApp

Repassado ao escritório ao custo da Meta, **fora do preço e das margens**, como no Contábil. Premissa emprestada (JU-07 11.1): 6 mensagens de utilidade e 25 de serviço por cliente por mês no provável; marketing zero por desenho. **Estimativa repassada** (provável): Solo R$ 19, Pequeno (2 números) R$ 201 (JU-07 chega ao mesmo número), Médio (3 números) R$ 573. A plataforma só exibe a tarifa.

### 4.6 Capital inicial e piloto de 1 a 5 escritórios

**Decisão do Enzo:** **não haverá parecer especializado pago**; é um desenvolvimento freelance e o sistema será estudado com os vários advogados que ele conhece. O piloto é de **1 a 5 escritórios** (advogados que ele conhece; a advogada da família tem um escritório grande), que **talvez paguem um pouco**: a cobrança simbólica é parâmetro (R$ 0, 100 ou 250 por escritório por mês). **Pareceres em dinheiro: R$ 0** (antes, R$ 21 mil a 82 mil, JU-10 12). No lugar: **revisão por escrito por advogados conhecidos do grupo**, sem custo em dinheiro.

**Piloto modelado** (4 meses; Completo com IA; composições premissa minhas): 1 escritório = 1 Médio (o da advogada da família); 3 = 1 Médio, 1 Pequeno, 1 Solo; 5 = 1 Médio, 2 Pequenos, 2 Solos.

| | 1 escritório | 3 escritórios | 5 escritórios |
| --- | ---: | ---: | ---: |
| Horas de implantação (48 / 29 / 6 por Médio / Pequeno / Solo) | 48 | 83 | 118 |
| **Dinheiro:** custo variável sem o suporte humano (servidor, IA, chat), por mês | R$ 1.003 | R$ 1.592 | R$ 2.181 |
| **Dinheiro:** fixos que existem no piloto por mês (coletor R$ 400 e IA do calendário e do encarregado R$ 75; **sem** seguro, agregador, encarregado pago nem parecer) | R$ 475 | R$ 475 | R$ 475 |
| **Dinheiro em 4 meses (capital inicial)** | **R$ 5.913** | **R$ 8.268** | **R$ 10.623** |
| Com cobrança simbólica de R$ 100 / R$ 250 por escritório por mês | R$ 5.513 / 4.913 | R$ 7.068 / 5.268 | R$ 8.623 / 5.623 |
| **Tempo:** implantação (R$ 90 por hora) | R$ 4.320 | R$ 7.470 | R$ 10.620 |
| **Tempo:** suporte (R$ 12,50 por assento), calendário e encarregado, 4 meses | R$ 3.020 | R$ 3.320 | R$ 3.620 |
| **Valor do tempo da equipe, sem curadoria** | **R$ 7.340** | **R$ 10.790** | **R$ 14.240** |
| Curadoria de 3 módulos em 4 meses, **se for tempo** e não pagamento | R$ 18.000 | R$ 18.000 | R$ 18.000 |

**Antes e depois:** o capital inicial era de **R$ 66 mil a 148 mil** (JU-10: pareceres; JU-11 5.2: piloto grátis de 10 a 20 escritórios com R$ 24 mil de fixos por reflexo). Agora, **em dinheiro, R$ 5,9 mil a 10,6 mil** (R$ 4,9 mil a 5,6 mil com R$ 250 de cobrança simbólica); o resto é **valor do tempo da equipe**, que só vira caixa se alguém precisar ser pago. Os fixos de R$ 8.105 só passam a valer com **cliente pagante** (seguro, mínimo do agregador, encarregado): o piloto gratuito não os paga.

**O risco continua.** Sem parecer pago, **o risco de sigilo, LGPD e ética não desaparece**; só deixa de ter um escudo em dinheiro. O controle passa a ser **contratual e de processo**: termo do piloto (com operador, direito de sair e exportar), **cliente com termo de ciência de IA**, **casos reais só de quem consentiu** por escrito, modo sombra, e **revisão escrita por advogado do grupo** dos pontos de sigilo, ética e LGPD. Não há seguro no piloto gratuito (4.4). **O parecer pago volta quando houver clientes pagantes em escala** (e o JU-10, que exige parecer antes de caso real, será ajustado pelo coordenador).

## 5. Escritórios-tipo, preços e margens em três níveis

### 5.1 Perfis (premissas a medir)

| | Usuários | Inscrições OAB | Clientes | Processos |
| --- | ---: | ---: | ---: | ---: |
| **Solo** | 1 | 1 | 50 | 80 |
| **Pequeno** | 5 | 3 | 250 | 400 |
| **Médio** | 10 | 6 | 625 | 1.000 |

**Cenários:** **E** Essencial; **I** Integrado; **C** Completo; **C+IA** = C com IA Essencial e módulo Trabalhista (R$ 60) para os advogados; **C+IA+** = C com monitoramento de 40% dos processos, IA Operação, módulo Trabalhista e peticionamento assistido. **O Essencial (E) não inclui o App** (R$ 250 / 395 / 682); **todos os demais cenários incluem** o App (R$ 40 + R$ 0,60 por cliente efetivo; seção 7.5); Essencial + App: R$ 261 / 559 / 984. Fixos rateados com **30 escritórios de 5 usuários equivalentes** (peso = usuários ÷ 5): com R$ 6 mil, R$ 40 (Solo), R$ 200 (Pequeno), R$ 400 (Médio) por mês; com R$ 8.105, R$ 54 / 270 / 541; tributos 12,5%.

### 5.2 Preço, custo e margens (uso provável, R$ por mês)

| Escritório | Cenário | Preço | Custo | Contribuição | (a) | (b) com R$ 6 mil | (c) com R$ 6 mil | (b) com R$ 8,1 mil | (c) com R$ 8,1 mil |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Solo** | E | 250 | 69 | 181 | 72,3% | 56,3% | 43,8% | 50,7% | 38,2% |
|  | I | 338 | 99 | 238 | 70,6% | 58,8% | 46,3% | 54,6% | 42,1% |
|  | C | 413 | 121 | 293 | 70,8% | 61,1% | 48,6% | 57,7% | 45,2% |
|  | C+IA | 552 | 149 | 404 | 73,1% | 65,9% | 53,4% | 63,3% | 50,8% |
|  | C+IA+ | 739 | 244 | 495 | 67,0% | 61,6% | 49,1% | 59,7% | 47,2% |
| **Pequeno** | E | 395 | 226 | 169 | 42,8% | −7,8% | −20,3% | −25,6% | −38,1% |
|  | I | 726 | 324 | 402 | 55,4% | 27,9% | 15,4% | 18,2% | 5,7% |
|  | C | 920 | 431 | 489 | 53,1% | 31,4% | 18,9% | 23,8% | 11,3% |
|  | C+IA | 1.337 | 515 | 822 | 61,5% | 46,5% | 34,0% | 41,3% | 28,8% |
|  | C+IA+ | 2.012 | 896 | 1.116 | 55,5% | 45,5% | 33,0% | 42,1% | 29,6% |
| **Médio** | E | 682 | 471 | 211 | 30,9% | −27,7% | −40,2% | −48,3% | −60,8% |
|  | I | 1.279 | 692 | 588 | 45,9% | 14,7% | 2,2% | 3,7% | −8,8% |
|  | C | 1.681 | 960 | 720 | 42,9% | 19,1% | 6,6% | 10,7% | −1,8% |
|  | C+IA | 2.515 | 1.128 | 1.386 | 55,1% | 39,2% | 26,7% | 33,6% | 21,1% |
|  | C+IA+ | 4.009 | 2.010 | 1.999 | 49,9% | 39,9% | 27,4% | 36,4% | 23,9% |

**Conta do Pequeno em C+IA** (preço): núcleo R$ 187 + pacote R$ 163 + Timesheet R$ 55 + Financeiro R$ 112 + CRM R$ 194 + App R$ 164 + captura 3 × R$ 15 + IA Essencial 3 × R$ 79 + módulo Trabalhista 3 × R$ 60 = **R$ 1.337** (v0.3: R$ 1.174, sem o App). Custo: R$ 515 (núcleo R$ 160, CRM R$ 108, IA R$ 78, App R$ 55, Financeiro R$ 33). O Solo Essencial fica no piso (a soma, R$ 192, é menor que R$ 250); com o App opcional, R$ 261. 

### 5.3 Leitura honesta

1. **O App incluído melhora bastante a base.** Com R$ 6 mil de fixos, o Pequeno Integrado fica em +27,9% após fixos (era +16,7% sem App) e o Completo em +31,4%; o Médio Integrado em +14,7% (era +1,6%) e o Completo em +19,1%. Com R$ 8,1 mil: Pequeno Integrado +18,2%, Completo +23,8%; Médio Integrado +3,7%, Completo +10,7%. A contribuição do Integrado sobe para 55% (Pequeno) e 46% (Médio). **O Essencial (sem App)** não paga o Pequeno (−7,8% com R$ 6 mil; −25,6% com R$ 8,1 mil) nem o Médio (−27,7%); com o App opcional ele chega a +13,9% no Pequeno e −1,7% no Médio (R$ 6 mil).
2. **O Solo é saudável em percentual** (68% a 73%), mas rende R$ 177 a R$ 495 por mês: cobre pouco dos fixos.
3. **App: R$ 0,15 por cliente era abaixo do custo (R$ 0,20); passa a R$ 40 + R$ 0,60 por cliente efetivo** (correção do Enzo: App incluído, valor por cliente maior). Critério: depois da faixa, R$ 0,20 de custo com folga de pelo menos 50% até 1.000 clientes. R$ 0,60 × faixa: R$ 0,60 (faixa 1), 0,45 (121 a 250), 0,33 (501 a 1.000) e 0,30 (acima), ou seja, folga de 200%, 125%, 65% e 50%. R$ 0,50 deixaria R$ 0,275 na faixa de 501 a 1.000 (37%) e não cumpre. Margem do App: Solo 78,3%, Pequeno 66,4%, Médio 57,0%; no uso alto (R$ 0,50 por cliente) o cliente acima de 500 volta a dar prejuízo, como no CRM.
4. **CRM: R$ 0,70 por cliente, faixa parando em 0,75** (v0.2, mantido). A partida de R$ 0,60 com as faixas padrão cobria o custo provável (R$ 0,43) só até 250 clientes; com R$ 0,70 e piso 0,75, o cliente marginal rende no mínimo R$ 0,53 (22% acima do custo). **Somando núcleo, Financeiro, CRM e App**, cada cliente rende R$ 2,00 na faixa 1 e **R$ 1,24 até 1.000 clientes e R$ 1,18 acima**, contra R$ 1,03 de custo provável (núcleo R$ 0,30, Financeiro R$ 0,10, CRM R$ 0,43, App R$ 0,20): positivo em todas as faixas. No Médio (625 clientes) o CRM rende R$ 401 contra R$ 269 de custo e o **Completo rende mais que o Integrado** (R$ 720 contra R$ 588 de contribuição).
5. **Com R$ 8,1 mil de fixos** (colunas à direita) seguem positivos após fixos o Solo, o Pequeno e o Médio a partir do Integrado, e todos os cenários com IA; só os Essenciais do Pequeno (−25,6%) e do Médio (−48,3%), sem App, não se pagam; com o App opcional, ficam em +1,4% e −16,0%. **Se o encarregado for terceirizado** (R$ 10,5 mil), o Pequeno Integrado cai a +7,3% e o Médio Integrado a −8,7% após fixos.

## 6. A margem de 60% na IA e os módulos de lei

### 6.1 Margem da IA isolada, por plano (R$ 79 e R$ 189, 3 advogados no Pequeno)

| Plano e visão | 35% do teto | **50% (premissa)** | 80% | 100% |
| --- | ---: | ---: | ---: | ---: |
| **Essencial**: só tokens e infraestrutura | 74,3% | **67,1%** | 52,7% | 43,1% |
| Essencial: com suporte da IA (R$ 8 por usuário) | 64,2% | **57,0%** | 42,6% | 33,0% |
| Essencial: suporte e UU ponderada (R$ 0,1156) | 59,0% | **49,6%** | 30,7% | 18,1% |
| **Operação**: só tokens e infraestrutura | 71,5% | **62,5%** | 44,4% | 32,4% |
| Operação: com suporte da IA | 67,3% | **58,3%** | 40,2% | 28,2% |
| Operação: suporte e UU ponderada | 60,7% | **48,9%** | 25,2% | 9,5% |

**Leitura.** (1) Só com tokens e infraestrutura, a IA tem margem de **62% a 67%** no uso provável (JU-05 estava certo nisto). (2) **Somando o suporte da IA** (R$ 8 por usuário, premissa do Contábil), cai para **57% e 58%**: abaixo dos 60%. Para voltar a 60% o uso médio do teto teria de ser de **no máximo 44% (Essencial) e 47% (Operação)**, ou o preço subir para **R$ 85 e R$ 197** com 50% de uso. (3) **Com a cota ponderada e só o modelo principal**, a margem cai a 50% e 49%; no pior caso (100% do teto, custos altos) o Essencial fica com 5% e a Operação com −3%: o teto mensal do escritório e a bolsa são a defesa. (4) **Fixos da IA** (GPU e ciclos de atualização, R$ 3.992 por mês na plataforma, rateados como em 9.6 do Estudo): no Pequeno com 3 advogados, a IA Essencial fica em **1%** e a Operação em **35%** de margem total; o **Essencial só se paga se o Contábil carregar a GPU e a atualização**, como hoje. (5) **JU-06 6.4** estima o time inteiro de integrantes de um escritório pequeno em **1.140 a 1.450 UU por mês** (R$ 100 a R$ 128 no preço médio), cerca de uma IA Operação: é 29% a 37% do teto de três IA Operação (3.870 UU), então os 50% de utilização são **conservadores para a Operação**; mas **estoura o Essencial** (três IA Essencial têm 1.290 UU), e por isso integrantes proativos só rodam com Operação ou bolsa (pergunta 11). **O gargalo é a cota, não o dinheiro.**

**Onde está a margem do Pequeno C+IA (R$ 1.337):** base sem IA (núcleo ao App) 52,1%; captura 73,3%; IA 67,1%; módulo Trabalhista 96,7% (custo variável de R$ 2 por advogado). Os complementos levam o escritório de 53% (Completo) para 61% de contribuição: **a margem de 60% é mesmo da IA e do módulo de lei, não do sistema-base.**

### 6.2 Módulos de lei: equilíbrio e escada de curadoria

Equilíbrio de um módulo = curadoria ÷ (preço × 0,875 − R$ 2 de custo por advogado), com tributos de 12,5% (reproduz o JU-05).

| Oferta | Preço | Equilíbrio com R$ 1.500 | Com R$ 4.000 | Em escritórios de 2,4 advogados |
| --- | ---: | ---: | ---: | --- |
| Trabalhista ou Família e Sucessões | R$ 60 | 30 advogados | 79 | 12 e 33 |
| Penal | R$ 90 | 20 | 52 | 8 e 22 |
| Generalista (5 áreas) | R$ 100 | 18 | 47 | 7 e 19 |
| Completo | R$ 110 | 16 | 42 | 7 e 18 |

**Escada:** 3 módulos na v1 pesam R$ 4,5 mil (nos R$ 6 mil); todos os 19 módulos de JU-04 pesariam **R$ 28,5 mil por mês**, o que só se paga com **cerca de 302 advogados no pacote Completo (R$ 110)**, ou 126 escritórios de 2,4 advogados. **Se o preço fosse fixo por escritório** (R$ 60 por escritório, em vez de por advogado), o equilíbrio de um módulo triplica: pergunta 3. **Penal só sai depois da camada de lei no tempo e da política de dados sensíveis** (JU-04 e J5).

## 7. Complementos e teto de conectores

### 7.1 Margem de cada complemento

| Complemento | Preço | Custo provável | Margem da linha | Observação |
| --- | ---: | ---: | ---: | --- |
| Captura | R$ 15 / inscrição | R$ 4 | 73,3% | O coletor (R$ 400) está nos fixos |
| Peticionamento | R$ 19 / inscrição | R$ 2 | 89,5% | A plataforma não protocola; prepara e confere |
| Monitoramento | R$ 1,80 / processo | R$ 1,50 | 16,7% | Repasse; **não é centro de lucro** |
| Assinatura | R$ 3,00 / documento | R$ 2,50 | 16,7% | Repasse; custo sem fonte |
| Módulo de lei | R$ 60 / advogado | R$ 2 | 96,7% | Antes da curadoria fixa |
| **Marca branca** (à parte) | R$ 150 fixos | R$ 15 | 90,0% | Igual ao Contábil |
| **App na loja** (à parte) | R$ 350 fixos | R$ 240 | 31,4% | Exige App e marca branca; mais R$ 1,5 mil a 3 mil de publicação, uma vez |

**Monitoramento.** A cobrança é custo + 20% (decisão aprovada): R$ 1,80 com custo de R$ 1,50. A 100% dos processos o cliente pagaria **R$ 144 (Solo), R$ 720 (Pequeno) e R$ 1.800 (Médio)**: é o que mais empurra o preço acima do mercado, e o ADVBOX inclui 1.000 processos no Essencial (R$ 220). **Porta de entrada (proposta, pergunta 10):** a faixa de R$ 1 mil por mês do agregador só se contrata quando houver **cerca de 667 processos pedidos** (R$ 1.000 ÷ R$ 1,50; a R$ 1,80 de preço, 556 processos já cobrem o mínimo). Com 30% dos escritórios monitorando 40% dos processos (premissa), isso acontece com cerca de **19 escritórios**. Antes, usar consulta avulsa com cartão de custo (autos R$ 3,50) ou contrato pré-pago, se a Judit tiver **[a confirmar]**.

**Assinatura eletrônica.** JU-08 propõe, na v1, **conta do provedor no nome do escritório** (a plataforma só integra): sem custo nem receita para nós. O repasse a custo + 20% (referência R$ 3,00 por documento, sem franquia) fica como opção para depois. Uso: JU-08 8.2 estima 15 a 65 documentos por escritório por mês; adotei **5 / 12 / 22 por advogado** (Pequeno: 15 / 36 / 66), ou R$ 36 (Solo), R$ 108 (Pequeno) e R$ 216 (Médio) de preço no provável, com custo de provedor de R$ 70 a R$ 120 por escritório (JU-08).

### 7.2 Mínimo do agregador

O mínimo de R$ 1.000 é fixo com poucos processos e some dentro do custo por processo acima de 667 monitorados: os R$ 6 mil são conservadores depois dos primeiros 19 escritórios e **otimistas antes**, se o agregador exigir contrato anual desde o início.

### 7.3 Teto de conectores de 130%

No Contábil, o preço-base embute consultas até 130% do uso provável e o excedente é cobrado a custo + 20%. No Jurídico **quase nada é embutido**: o que custa por uso vai em cartão de custo (autos sob demanda R$ 3,50; cadastro SERPRO R$ 0,66 a R$ 1,17) ou em complemento por unidade (monitoramento, assinatura). O teto de 130% vale só para a segunda fonte paga do DJEN (R$ 1,35 por 100 entregas): provável de 100 publicações por inscrição por mês (R$ 1,35), **teto de 130** (R$ 1,76), excedente a R$ 0,0162 por publicação (custo + 20%). DJEN próprio, Domicílio, DataJud, legislação e índices custam R$ 0 por uso. **[a confirmar]** o que a Judit vende além da faixa de R$ 1 mil por mês (faixas intermediárias não foram levantadas).

### 7.4 Correspondentes: sem receita (decisão do Enzo)

**A plataforma não é um marketplace de correspondentes.** Vale o JU-09: o sistema organiza as despesas e permite pagar o correspondente a partir da **conta do escritório**, pelo Financeiro, **sempre com aprovação humana**; **a plataforma nunca segura dinheiro**. O correspondente entra como **convidado sem custo de assento** (JU-09, C5 **[a confirmar]**). Não há taxa por demanda nem linha de receita de correspondente neste estudo (a proposta de R$ 5 por demanda da v0.2 foi retirada); o custo do correspondente é do escritório e entra na rentabilidade do Caso (JU-05 4.1). Efeito nas contas: nenhum preço muda; só sai uma linha opcional que valia R$ 3 de contribuição por demanda.

### 7.5 App do cliente: incluído, com valor por cliente maior (correção do Enzo)

O App **funciona por padrão no Integrado e no Completo**, sem contratação extra; **no Essencial é complemento opcional** (exceção do Jurídico); **à parte também a marca branca e o app na loja** (7.1). Valores de teste: **R$ 40 fixos mais R$ 0,60 por cliente efetivo**, pela faixa de clientes (era R$ 30 + R$ 0,15 no JU-05; R$ 80 + R$ 0,30 no Contábil). Custo provável de R$ 5 fixos mais R$ 0,20 por cliente (R$ 3 a R$ 10 de fixo; R$ 0,10 a R$ 0,50 por cliente), o mesmo do Contábil. **Preço e margem:** Solo (50 clientes) R$ 69 contra R$ 15, **78,3%**; Pequeno (250) R$ 164 contra R$ 55, **66,4%**; Médio (625) R$ 302 contra R$ 130, **57,0%**. **Por que R$ 0,60:** é o menor valor, entre R$ 0,50, 0,60 e 0,70, que deixa pelo menos 50% de folga sobre o custo provável depois do fator de faixa até 1.000 clientes (R$ 0,60 × 0,55 = R$ 0,33, folga de 65%; R$ 0,50 dá R$ 0,275, 37%). No uso alto (R$ 0,50 por cliente) a margem do App é de 49% (Solo), 17% (Pequeno) e −7% (Médio): é estresse, o mesmo do CRM. **O que o App incluído faz com o preço:** o Integrado do Pequeno vai de R$ 562 (sem App) a R$ 726; o Essencial fica em R$ 395 e, com o App opcional, R$ 559 (seção 8).

## 8. Comparação com o mercado

**Faixas lidas:** SIJUR, 18/10/2026 **[a confirmar]**: Astrea do plano light grátis até R$ 1.249; ADVBOX de R$ 220 a R$ 5.000; Projuris ADV Start Solo a partir de R$ 79. J1 (fonte secundária; blogs divergem entre si): Solo R$ 79 a R$ 249; Pequeno R$ 349 a R$ 499; Médio R$ 769 a R$ 990. SGJur (J7, evidência fraca): R$ 377 (1 advogado), R$ 1.977 (6 usuários), R$ 4.200 (15 usuários).

| Escritório | Nosso Essencial (sem App; com App) | Nosso Integrado | Faixa J1 | Posição |
| --- | ---: | ---: | --- | --- |
| Solo | R$ 250 (R$ 261) | R$ 338 | R$ 79 a R$ 249 (ADVBOX R$ 220; EasyJur R$ 229) | Essencial +14% sobre o ADVBOX e +9% sobre o EasyJur; Integrado +54% e +48% |
| Pequeno | R$ 395 (R$ 559) | R$ 726 | R$ 349 a R$ 499 | Essencial **dentro da faixa**; com App +12% sobre o topo (EasyJur R$ 499); Integrado **+45%**; Completo (R$ 920) +84% |
| Médio | R$ 682 (R$ 984) | R$ 1.279 | R$ 769 a R$ 990 | Essencial 11% abaixo do Astrea Company; com App dentro da faixa; Integrado **+29%**; Completo (R$ 1.681) +70% |

**O Integrado do Pequeno, com App, fica 45% acima do topo do mercado.** O mercado jurídico **não dá o portal do cliente nos planos de entrada**: Astrea só a partir do Smart (J8, linha 75), Projuris só no ADV completo (J1, linha 64), com busca nova inconclusiva **[a confirmar nas páginas oficiais antes do lançamento]**; por isso o Essencial é **sem App** e fica na faixa, e o prêmio do Integrado se sustenta pelo que ele entrega (App, Timesheet, Financeiro), mas é grande.

**Com IA:** o Completo com IA Essencial e módulo Trabalhista (R$ 1.337 no Pequeno, com App) contra Astrea Smart (R$ 439) mais 3 Jus IA Essencial (R$ 78,90 cada) = **R$ 676**: 98% acima, com CRM e WhatsApp, êxito, conta de terceiros e citação conferida. O que justifica o prêmio é o que JU-05 5.7 lista (CRM e WhatsApp ligados ao processo, Financeiro com êxito, Timesheet com rentabilidade por Caso, preço previsível, IA com citação verificada). **Risco:** o mercado entrega 1.000 processos por R$ 220; nossa porta é o Essencial (R$ 395 para 5 usuários, sem App).

## 9. Implantação e migração

Horas a medir; R$ 90 por hora. **Piso = custo de entrega (margem zero)**: o time nunca vende abaixo disso.

| Trilha | Horas | Custo (piso) | Tabela | Desconto máximo |
| --- | ---: | ---: | ---: | ---: |
| **Solo em autoatendimento** (aprovado: gratuito) | 0,5 de apoio por chat | R$ 45 | R$ 0 | n/a |
| **Solo assistida** | 6 | R$ 540 | R$ 900 | 40,0% |
| Solo trilha completa | 14 | R$ 1.260 | R$ 1.800 | 30,0% |
| **Pequeno** | 29 | R$ 2.610 | R$ 3.900 | 33,1% |
| **Médio** | 48 | R$ 4.320 | R$ 6.500 | 33,5% |
| Com as duas migrações (histórico e financeiro) | Solo 11 / Pequeno 45 / Médio 80 | R$ 990 / 4.050 / 7.200 | R$ 1.550 / 5.980 / 10.660 | 36,1% / 32,3% / 32,5% |

A migração de outro sistema tem tabela de R$ 130 por hora e piso de R$ 90. Mais R$ 50 a R$ 300 de indexação de documentos. **Contra o mercado:** o Astrea tem plano gratuito de um ano e o setup do EasyJur seria R$ 880 (JU-05, a confirmar): **o prêmio de R$ 3.900 do Pequeno só se justifica com a migração assistida** e a segurança de prazo; é prêmio alto (pergunta 8). **Se a implantação for absorvida (não cobrada),** o custo se recupera em 3,2 meses no Pequeno e 3,1 no Médio com IA, e em 6,5 e 7,3 meses só com o Integrado.

## 10. Suporte humano

O núcleo já leva **R$ 12,50 por assento no provável** de suporte humano (R$ 6 a R$ 25), mais R$ 2 do chat e R$ 0,16 da ajuda. A R$ 90 por hora, R$ 12,50 são **8 minutos por usuário por mês**; para 30 escritórios com 105 usuários são **cerca de 15 horas por mês**: é uma premissa otimista. Se o suporte dobrar (R$ 25), a margem de contribuição cai: Solo I 70,6% → 66,9%; Pequeno I 55,4% → 46,8%; Médio I 45,9% → 36,2%. O suporte **nunca lê Caso restrito** (JU-10 6.5) e **não presta consultoria jurídica** nem opina sobre prazo. O aviso de incidente ao escritório em 24 horas (JU-10, P10) é custo de operação, sem preço próprio. **JU-11 4.2 propõe não ter plantão humano de prazo fatal** (R$ 64.800 por mês, cerca de 30 vezes o suporte inteiro do cenário base): o monitor da captura e a escada de alertas fazem esse papel; plantão só como complemento pago e opcional. JU-11 4.7: a **fila de divergência de contagem e a advogada de referência estão fora dos R$ 12,50** e o primeiro trimestre pesa mais: pode valer o alto, R$ 25. **Medir** nos 10 primeiros escritórios.

## 11. Fluxo de caixa dos primeiros 12 meses

**Regras (as do Estudo, 8.5):** entradas = implantação (à vista, no mês da assinatura, com desconto, nunca abaixo do piso) e mensalidades; saídas = horas de implantação (valor do tempo), custo variável, fixos, tributos de 12,5% sobre as entradas; **mensalidade começa um mês depois**; sem capital inicial (o piloto está em 4.6). **Mix de novos:** 50% Solo, 40% Pequeno, 10% Médio. **Solo:** 30% escolhe a trilha assistida (R$ 900, com desconto) e 70% faz sozinho (apoio de R$ 45). **Configuração:** quem não leva IA fica no Integrado; quem leva, no C+IA. **Fixos de R$ 8.105** (provável da v0.3; 4.4).

| | **Conservador** | **Base** | **Otimista** |
| --- | ---: | ---: | ---: |
| Escritórios novos por mês | 2 | 4 | 8 |
| Desconto médio da implantação | 30% | 20% | 10% |
| Cancelamento mensal | 2% | 1% | 0% |
| Escritórios com IA (C+IA) | 40% | 60% | 80% |
| Escritórios ativos no mês 12 | 19,5 | 41,4 | 88,0 |
| Resultado do mês fica positivo | Não (−R$ 1,1 mil no mês 12) | **Mês 6** | **Mês 3** |
| Caixa acumulado fica positivo | Não | **Mês 11** | **Mês 5** |
| Maior necessidade de caixa | R$ 55,2 mil (mês 12) | **R$ 22,4 mil** (mês 5) | R$ 8,0 mil (mês 2) |
| **Caixa no mês 12** | −R$ 55,2 mil | **+R$ 14,3 mil** | +R$ 183,7 mil |
| Implantação nas entradas (3 primeiros meses / ano) | 68% / 30% | 69% / 29% | 69% / 28% |
| Horas de implantação por mês | 35 | 70 | 140 |
| **Fixos de R$ 6 mil** (aprovados; referência): caixa no mês 12 | −R$ 30,0 mil | **+R$ 39,6 mil** (caixa positivo no mês 8) | +R$ 209,0 mil |
| **Fixos baixos (R$ 3.547):** caixa no mês 12 | −R$ 0,6 mil | +R$ 69,0 mil (mês 5) | +R$ 238,4 mil |
| **Fixos altos (R$ 9.630):** caixa no mês 12 | −R$ 73,5 mil | −R$ 4,0 mil | +R$ 165,4 mil |
| **Encarregado terceirizado (R$ 10.486):** caixa no mês 12 | −R$ 83,8 mil | −R$ 14,3 mil | +R$ 155,2 mil |
| **Plataforma inclusa (R$ 16.305):** caixa no mês 12 | −R$ 153,6 mil | −R$ 84,1 mil | +R$ 85,3 mil (caixa positivo no mês 9) |
| **Só dinheiro** (sem o valor das horas de implantação e suporte; fixos de R$ 7.475): caixa no mês 12 | −R$ 4,6 mil | **+R$ 108,4 mil** (positivo no mês 2) | +R$ 365,4 mil |

**Cenário base mês a mês** (R$ mil; saldo / acumulado, fixos de R$ 8.105): 1: −7,8 / −7,8; 2: −6,1 / −14,0; 3: −4,5 / −18,4; 4: −2,8 / −21,2; **5: −1,1 / −22,4**; 6: +0,5 / −21,9; 7: +2,1 / −19,8; 8: +3,7 / −16,1; 9: +5,3 / −10,8; 10: +6,8 / −4,0; **11: +8,4 / +4,4**; 12: +9,9 / +14,3. Conta do mês 1: entradas 4 × (50% × R$ 216 + 40% × R$ 3.120 + 10% × R$ 5.200) = R$ 7,5 mil; saídas R$ 15,3 mil (horas R$ 6,3 mil, fixos R$ 8,1 mil, tributos R$ 0,9 mil).

**Leitura.** (1) A implantação é **69% das entradas dos três primeiros meses**; sem cobrá-la, o caixa base é −R$ 64,5 mil no mês 12 (necessidade de R$ 69,9 mil). (2) **O ritmo de vendas manda**: com 1 novo por mês o caixa é −R$ 69,4 mil; com 2, −R$ 41,5 mil; com 3, −R$ 13,6 mil; com 4, +R$ 14,3 mil; com 6, +R$ 70,1 mil (positivo no mês 8). (3) **Contar ou não o valor das horas muda tudo**: as horas de implantação e suporte são o que mais pesa nas saídas, mas **só saem do caixa se a equipe for paga**; só dinheiro, o cenário base fecha com +R$ 108,4 mil e quase não precisa de capital (R$ 0,9 mil). O Estudo valora as horas por prudência. (4) **Sozinho (plataforma inclusa) o Jurídico** só empata no fim do ano (+R$ 1,7 mil de saldo no mês 12 e −R$ 84,1 mil acumulados). (5) Carga de implantação: **70 horas por mês no base** (cerca de meia pessoa), 140 no otimista. (6) **Sem cobrar a implantação**, o piso em margem zero deixa de existir. (7) **O capital inicial agora é o piloto de 4.6**, em dinheiro R$ 5,9 mil a 10,6 mil, e não os R$ 66 mil a 148 mil da v0.2. (8) **O App incluído** acrescentou cerca de R$ 18 mil ao caixa do mês 12 em relação à v0.3 (−R$ 3,8 mil para +R$ 14,3 mil).

## 12. Equilíbrio: quantos escritórios cobrem os fixos

**Carteira de referência:** 50% Solo, 40% Pequeno, 10% Médio; adesão à IA (C+IA) na tabela; os demais no Integrado. Preço médio de R$ 872 e contribuição de R$ 537 com 60% de adesão. "Antes" = contribuição ÷ fixos; "após" = depois de 12,5% de tributos.

| Adesão à IA | Preço médio | Contribuição média | R$ 6 mil: antes / após | R$ 8,1 mil: antes / após |
| --- | ---: | ---: | ---: | ---: |
| 0% | 587 | 339 | 17,7 / 22,6 | 23,9 / 30,5 |
| 20% | 682 | 405 | 14,8 / 18,8 | 20,0 / 25,4 |
| 40% | 777 | 471 | 12,7 / 16,0 | 17,2 / 21,7 |
| **60%** | 872 | 537 | 11,2 / 14,0 | **15,1 / 18,9** |
| 80% | 968 | 603 | 9,9 / 12,4 | 13,4 / 16,8 |
| 100% | 1.063 | 669 | 9,0 / 11,2 | 12,1 / 15,1 |

**Resposta:** **cerca de 15 escritórios antes de tributos e 19 depois** cobrem os fixos novos de R$ 8,1 mil (15,1 e 18,9). Por cenário de fixos (antes / após): R$ 3,5 mil (baixo) **7 e 8**; R$ 6 mil (aprovado) **11 e 14**; **R$ 8,1 mil (provável) 15 e 19**; R$ 9,6 mil (alto) **18 e 23**; **encarregado terceirizado (R$ 10,5 mil) 20 e 25**; plataforma inclusa (R$ 16,3 mil) **31 e 39**. Por tipo, escritórios do mesmo porte para cobrir R$ 8,1 mil (antes / após): Solo C+IA 20,1 / 24,2; Pequeno I 20,1 / 26,0; Pequeno C+IA 9,9 / 12,4; Médio I 13,8 / 18,9; Médio C+IA 5,8 / 7,6. **Correção do JU-05:** ele dizia 12 (C+IA) e 19 (I) com R$ 6 mil; o 12 é após tributos e o 19 não bate com nenhuma conta (R$ 6.000 ÷ R$ 307 = 19,5 antes; 27 após). **Evolução com R$ 8,1 mil:** 26 / 32 na v0.2, 18 / 23 na v0.3 (IA do time e seguro só com cliente pagante), **15 / 19 na v0.4** (App incluído: a contribuição média da carteira sobe de R$ 449 para R$ 537).

## 13. Sensibilidades

### 13.1 Adesão à IA

Tabela da seção 12 e fluxo de caixa (cenário base, caixa no mês 12 com fixos de R$ 6 mil / R$ 8,1 mil): **0%** de adesão: −R$ 1,6 mil / −R$ 26,8 mil; 20%: +R$ 12,1 mil / −R$ 13,1 mil; 40%: +R$ 25,8 mil / +R$ 0,6 mil; **60%: +R$ 39,6 mil / +R$ 14,3 mil**; 80%: +R$ 53,3 mil / +R$ 28,0 mil; 100%: +R$ 67,0 mil / +R$ 41,7 mil. **Cada 20 pontos de adesão valem cerca de R$ 13,7 mil de caixa no ano.** Com os fixos novos, o ano fecha com adesão de 40% ou mais.

### 13.2 Processos por cliente (Pequeno, 250 clientes)

| Processos por cliente | Processos | Integrado: preço / (a) / (b) | C+IA+ (monitora 40%): preço / (a) / (b) |
| ---: | ---: | --- | --- |
| 1,0 | 250 | R$ 711 / 55,5% / 27,4% | R$ 1.889 / 57,7% / 47,2% |
| **1,6** | 400 | R$ 726 / 55,4% / 27,9% | R$ 2.012 / 55,5% / 45,5% |
| 2,5 | 625 | R$ 748 / 55,2% / 28,4% | R$ 2.196 / 52,5% / 43,4% |
| 4,0 | 1.000 | R$ 784 / 54,9% / 29,3% | R$ 2.502 / 48,6% / 40,6% |

O preço por processo (R$ 0,12) tem margem de 58%, então o Integrado quase não muda. **O que sobe é o monitoramento** (repasse a 16,7%): com 4 processos por cliente o Pequeno pagaria R$ 2.502, **mais caro que o mercado**.

### 13.3 Custo do agregador (Pequeno C+IA+ com App, monitorando 160 processos)

| Custo por processo | Com preço fixo de R$ 1,80: margem da linha / (a) total | Com custo + 20%: preço total / (a) total |
| ---: | --- | --- |
| R$ 0,45 (faixa de R$ 35 mil) | 75,0% / 63,8% | R$ 1.811 / 59,8% |
| R$ 1,00 | 44,4% / 59,5% | R$ 1.916 / 57,4% |
| **R$ 1,50** | 16,7% / 55,5% | R$ 2.012 / 55,5% |
| R$ 2,00 | −11,1% / 51,5% | R$ 2.108 / 53,7% |
| R$ 3,00 | −66,7% / 43,6% | R$ 2.300 / 50,6% |

**A regra "custo + 20%" protege a margem da linha** (sempre 16,7%) mas passa o risco ao cliente: a R$ 3,00 o Pequeno pagaria R$ 288 a mais. A volume (R$ 0,45 na faixa de R$ 35 mil), o preço poderia cair para R$ 0,54 sem perda: decidir se o ganho é repassado.

### 13.4 Outras sensibilidades

| Variação | Efeito |
| --- | --- |
| **Utilização da IA** a 15% / 35% / 50% / 80% / 100% do teto (Pequeno C+IA, margem a) | 64,5% / 62,8% / **61,5%** / 58,9% / 57,2%; Médio: 58,3% / 56,5% / **55,1%** / 52,4% / 50,6% |
| UU ponderada de R$ 0,1156 a 50% | Pequeno C+IA 60,2%; Médio C+IA 53,7% |
| **Uso alto** (custos altos, IA a 80%), margem a | Solo I 29,2%; Pequeno I **−7,3%**; Médio I **−31,0%**; com IA: Solo 36,2%, Pequeno 7,5%, Médio −8,9% |
| **Uso baixo**, margem a (Integrado) | Solo 86,2%; Pequeno 80,1%; Médio 76,3% |
| **Pior caso** (IA a 100%), C+IA | Solo 34,8%; Pequeno 5,8%; Médio −10,7% |
| **Hora de implantação** a R$ 70 / 90 / 130 (caixa base, mês 12) | +R$ 30,9 mil (caixa positivo no mês 9) / +R$ 14,3 mil / −R$ 3,3 mil |
| **Tributos** 8% / 12,5% / 17% / 24,9% | +R$ 28,3 mil / +R$ 14,3 mil / +R$ 0,3 mil / −R$ 24,2 mil |
| Mix 80% Solo / 20% Pequeno; mix 20 / 60 / 20 | −R$ 13,6 mil; +R$ 42,2 mil |

O padrão é o do Contábil: o custo por cliente e por usuário **não cai com a escala** e o preço de mercado não cresce; a **IA e o teto de uso** são o remédio. **Medir o uso real no piloto é a decisão mais valiosa.**

## 14. Se o mesmo escritório tiver Contábil e Jurídico

**Regra (DA-02.1):** plataforma, faixa de clientes, usuários, GB e plano de IA são cobrados **uma vez**; o cliente atendido pelos dois pacotes conta uma vez; Timesheet, Financeiro, CRM e App são cobrados uma vez, **pela tabela do pacote principal** (proposta, pergunta 7); o segundo pacote soma só o seu componente (pacote Jurídico a R$ 30 + R$ 18 por usuário com acesso + R$ 0,12 por processo), a captura (R$ 15 por inscrição) e os complementos escolhidos.

**Exemplo** (10 usuários; 120 clientes únicos, sendo 60 com Caso; 4 usuários e 3 inscrições no Jurídico; 100 processos; Painel, CRM, Timesheet, App e Financeiro; sem IA):

| | Preço | Custo | Margem (a) |
| --- | ---: | ---: | ---: |
| Contábil sozinho (100 clientes, 10 usuários) | R$ 1.033 | R$ 346 | 66,5% |
| Jurídico sozinho (60 clientes, 4 usuários), Completo com a tabela do Jurídico | R$ 560 | R$ 200 | 64,2% |
| **Soma de duas assinaturas separadas** | **R$ 1.593** | R$ 546 | 65,7% |
| **Combinado (plataforma uma vez)** | **R$ 1.247** | R$ 409 | 67,2% |
| **Economia do escritório** | **R$ 347 (22%)** | | |

**Efeitos:** (1) o escritório paga 22% menos que em duas assinaturas, e a plataforma não duplica núcleo, suporte e servidor; (2) **o Jurídico como acréscimo** rende só R$ 159 de preço e **R$ 122 de contribuição** neste exemplo: para cobrir R$ 6 mil de fixos seriam **49 escritórios** (66 com R$ 8,1 mil), a menos que levem IA e módulo de lei (com IA Essencial e Trabalhista para 3 advogados, +R$ 417 de preço e **R$ 455 de contribuição**: 14 escritórios com R$ 6 mil e 18 com R$ 8,1 mil); (3) os **fixos da plataforma comum (R$ 8,2 mil)** ficam com o Contábil: por isso o Jurídico vendido a quem já tem Contábil precisa de R$ 8,1 mil, e vendido sozinho, de **R$ 16,3 mil** (31 escritórios antes de impostos); (4) um usuário com plano de IA paga **uma vez**; (5) a **base temporal de leis é compartilhada** (JU-04 3.5), sem curadoria duplicada. **Risco:** a tabela do pacote principal sai mais cara se o principal é o Contábil (CRM a R$ 0,90 por cliente e R$ 200 de base); a pergunta 7 decide.

## 15. Regra geral de CRM e App (todos os pacotes)

**Regra correta do Enzo (9/11/2026), para todos os pacotes de área** (corrige a versão anterior, que dizia "App à parte"): (1) o **CRM entra no uso completo** e é contabilizado conforme o número de clientes, podendo subir com eles; (2) o **App do cliente funciona por padrão, incluído nos atalhos e pacotes**, sem contratação extra (**exceção do Jurídico:** o Essencial não o inclui, ver abaixo); (3) **o que se vende à parte é a marca branca e o app na loja**, que já são complementos pagos. Como o App está incluído, **o valor por cliente do App deve ser maior** que o de antes. **Aplicação no Jurídico:** CRM a R$ 0,70 por cliente efetivo, faixa parando em 0,75; App a R$ 40 fixos mais R$ 0,60 por cliente efetivo, **incluído no Integrado e no Completo e opcional no Essencial** (seções 3.2, 5.3 e 7.5). **Critério comum a todos os pacotes (proposta):** depois do fator da faixa de clientes, o preço por cliente cobre o custo provável (CRM R$ 0,43; App R$ 0,20) com **folga de pelo menos 50% nas faixas até 1.000 clientes** (o CRM, com folga de 22% na última faixa, pede o piso de fator 0,75). O custo do App é o mesmo (herdado) no Jurídico e no Contábil, então **o mesmo valor por cliente de R$ 0,60 serve aos dois**; o outro agente que avalia o Contábil usa o mesmo critério.

**Exceção do Jurídico (decisão do Enzo, 9/11/2026):** o Essencial do Jurídico **não inclui o App**, porque o mercado jurídico não o dá nos planos de entrada (Astrea só no Smart, J8 linha 75; Projuris só no ADV completo, J1 linha 64; busca nova inconclusiva e contraditória; **[a confirmar]** nas páginas oficiais antes do lançamento). **Isto não vale automaticamente ao Contábil**, cujo Essencial inclui o App; **o Contábil não foi reavaliado** (o mercado contábil pode ser outro).

**O Contábil e o BPO diante da regra** (`parametros.json`; só descrição, nada alterado):

| Ponto | Situação hoje | Conflita? |
| --- | --- | --- |
| **App incluído** | **Já está dentro dos quatro atalhos** (`pacotes.base`, `essencial`, `operacao`, `completo` listam `app`), sem contratação extra | **Não.** Já segue a regra |
| **Valor por cliente do App** | R$ 80 + R$ 0,30 por cliente efetivo; R$ 0,30 × 0,55 = R$ 0,165 na faixa de 501 a 1.000 clientes, **abaixo do custo de R$ 0,20**; folga de 50% exige R$ 0,60 | **Sim, no valor, não na estrutura.** Subir o valor por cliente a R$ 0,60 (estimativa minha: +R$ 9 / +27 / +72 por mês no pequeno, médio e grande; margem do sistema-base de 67,5% / 39,9% / 4,3% para cerca de 67,8% / 41,0% / 7,2%) |
| **CRM** | R$ 200 + R$ 0,90 por cliente efetivo + R$ 2 por usuário, dentro dos quatro atalhos; custo provável R$ 0,43 | **Não.** Folga fina (R$ 0,90 × 0,50 = R$ 0,45, 5% acima do custo); sugestão de piso de fator 0,75 nas faixas do CRM (R$ 4,50 a mais no grande; zero até 250 clientes) |
| **Marca branca e app na loja** | Marca branca R$ 150; app na loja R$ 350, exige App e marca branca; já são complementos à parte | **Não.** É exatamente o que a regra manda vender à parte |
| **Dependências** | Chat do app exige CRM; Consultor da empresa, NFS-e e certidões pelo app exigem App; o pacote BPO exige Financeiro e App | **Não conflita** |
| **Referência HubStrom** | Só aparece com Painel, CRM, App, conectores federais e marca branca marcados | Sem mudança |

**Testes do Contábil** (só descrição): a estrutura não muda, porque o App já está nos atalhos. Se o valor por cliente do App ou o piso de fator do CRM mudarem em `parametros.json`, **cerca de 191 dos 304 testes de `teste_configurador.js`** (os que dependem dos atalhos: regressão v0.4, simulações 6.4, atalhos 8.1, margens 9.x e fluxos por pacote) mudariam de valor esperado, e 113 seguiriam iguais; a lógica não muda. Medi esse número numa cópia, tirando o App dos atalhos, que é o mesmo conjunto de testes que dependem do preço do App.

## 16. Chaves propostas em `parametros-juridico.json`

Arquivo novo, **proposta**, no formato do `parametros.json` (custos em listas [baixo, provável, alto]); não altera o atual. Chaves: `pacote_area` e `piso_mensal` (250); `faixas_clientes` e `faixas_processos`; `unidades` (1,6 processo por cliente; 0,6 inscrição por usuário); `modulos` (núcleo, pacote Jurídico, Timesheet, Financeiro, CRM e App, cada um com `preco` por base, cliente, usuário e processo, e `custo`; o CRM tem `piso_fator_faixa` de 0,75); `regra_modulos_compartilhados` (DA-02.1); `suporte` e `armazenamento` (franquia de 15 GB com custo, novo); `complementos` (captura, monitoramento, peticionamento, assinatura, correspondentes sem receita, **marca branca e app na loja, à parte**); `regra_crm_app` (regra da seção 15); `modulos_lei`; `ia` (planos, utilização 0,15 / 0,50 / 0,80 / 1,00, custo da UU e da UU ponderada, suporte da IA); `whatsapp`; `conectores_teto`; `escritorios_tipo`; `atalhos`; `fixos_pacote` (R$ 6 mil aprovados; baixo / provável / alto de R$ 3.547 / 8.105 / 9.630 com a IA do time; encarregado terceirizado como sensibilidade; plataforma comum), `piloto` (1 a 5 escritórios, cobrança simbólica) e `capital_inicial`; `tributos`; `implantacao`; `fluxo` (três cenários); `mercado`. Os valores batem com as seções 3 a 5 (conferido contra o modelo).

## 17. Calculadora jurídica: especificação (só texto)

**Princípio:** a calculadora do Jurídico é o `configurador.html` com **seletor de pacote de área** e campos novos; nada é construído agora. Deve ler `parametros-juridico.json` quando o pacote for Jurídico e continuar lendo `parametros.json` para o Contábil, sem mudar o resultado dele (os 304 testes de `teste_configurador.js` seguem verdes).

### 17.1 Campos

| Bloco | Campo | Observação |
| --- | --- | --- |
| Escritório | **Pacote de área** (Contábil, Jurídico, ambos) | Com "ambos", pede qual é o pacote principal |
| | Clientes; usuários; **usuários com acesso ao Jurídico**; **inscrições OAB**; **processos ativos** (ou razão por cliente, padrão 1,6); GB; números de WhatsApp; perfil de uso | Processos e inscrições são novos |
| Módulos | Timesheet, Financeiro, CRM, **App (incluído no Integrado e no Completo; opcional no Essencial)** | Preço pela tabela do pacote principal; CRM e App escalam por cliente |
| Complementos | captura (marcada); **marca branca e app na loja** (à parte); monitoramento (% ou número de processos); peticionamento; **documentos assinados por mês**; módulos de lei (quais e quantos advogados); marca branca; app na loja | Novos |
| IA | Plano por usuário (padrão: advogados); bolsa; uso extra | Como no Contábil |
| Premissas | Fixos do pacote (6.000, ou os de 4.4 com o encarregado interno ou terceirizado); **piloto: número de escritórios e cobrança simbólica**; **N escritórios**; tributos; custo da hora; utilização da IA por pacote; custo da UU ponderada; adesão ao monitoramento | Editáveis, nenhum percentual escondido |
| Implantação e fluxo | Porte ou perfil; **solo autoatendimento ou assistida**; migrações; cenário (novos por mês, desconto, cancelamento, adesão à IA) | Fluxo com 3 cenários |

### 17.2 Fórmulas

Preço, custo e margens como na seção 3.1: a margem (a) = (preço − custo) ÷ preço; (b) subtrai o rateio dos fixos do pacote × peso ÷ N, com **peso = usuários ÷ 5** (o Contábil usa clientes ÷ 100); (c) subtrai tributos e comissão. **Equilíbrio** = fixos ÷ contribuição; também **após tributos** (contribuição com preço × 0,875). **Margem da IA isolada** = receita dos planos menos tokens, infraestrutura, suporte da IA e fixos de IA rateados. **Equilíbrio do módulo de lei** = curadoria ÷ (preço × 0,875 − custo por advogado). **CRM** = base + valor por cliente × clientes efetivos com piso de fator da faixa + valor por usuário. **App** = fixo + valor por cliente × clientes efetivos (sem franquia). **Piso:** se o preço ficar abaixo de R$ 250, cobra R$ 250 e mostra o ajuste. **Monitoramento:** preço = 1,2 × custo × processos, e aviso quando o total do sistema ficar abaixo de 667 processos. **Alerta de margem negativa por cliente** quando o preço por cliente na última faixa ficar menos de 15% acima do custo (seção 15). **Implantação:** preço = máx(piso, tabela × (1 − desconto)), piso = custo; solo autoatendimento = R$ 0 com custo de apoio.

### 17.3 O que mudaria em `configurador.html` (lista, sem construir)

1. **Carregar** `parametros-juridico.json` (campo novo `pacote_area`) e escolher o conjunto de parâmetros por pacote; `P.modulos[id]` passa a vir de `P.pacotes_area[pacote].modulos[id]`.
2. **`clientesEfetivos(C, P)`** vira uma função geral de faixa (`faixaEfetiva(n, faixas)`) para servir a clientes e a processos; novo componente `processo` em `calcular()`.
3. **`calcular()`**: linhas novas (captura, peticionamento, monitoramento, assinatura, módulos de lei); armazenamento com franquia por usuário e custo; ajuda e chat como hoje.
4. **`niveis()` e `fixosPlataforma()`**: fixos do pacote, peso por usuários e opção "plataforma inclusa" (soma R$ 8,2 mil).
5. **`propMinIA`, `entradaPacote`, `implantacao`, `fluxoCaixa`**: atalhos Essencial (**sem App**, com App opcional), Integrado e Completo (**com App**); se o valor por cliente do App do Contábil mudar, cerca de 191 dos 304 testes mudariam de valor esperado; porte Solo; trilha de autoatendimento e assistida; parcela de solos assistidos.
6. **Interface**: seletor de pacote; campos de processos, inscrições e documentos; avisos novos (cliente marginal abaixo do custo, mínimo do agregador, fixos acima do caixa).
7. **Teste**: acrescentar casos ao `teste_configurador.js` para as 15 combinações da seção 5.2, o piso de R$ 250, a faixa de processos, o Essencial sem App (R$ 250 / 395 / 682) e com App (R$ 261 / 559 / 984), a regra "uma vez" do DA-02.1 e a reprodução dos números do Contábil.

## 18. Ajustes pedidos, ordem de construção e perguntas

### 18.1 Ajustes pedidos a outros documentos

| Documento | Ajuste |
| --- | --- |
| **JU-05** | Corrigir a margem (b) do Pequeno Essencial (−7,8%), o equilíbrio do Integrado (20 escritórios), acrescentar o custo da franquia de 15 GB e trocar a tabela de CRM (R$ 0,70) e App (incluído, R$ 40 mais R$ 0,60 por cliente); a seção 5 passa a ser histórico |
| **Estudo de Precificação** | Adendo com a tabela por pacote de área, o componente de processo, o piso, os fixos do pacote, a regra "uma vez" (DA-02.1) e a **regra geral de CRM e App** (seção 15): App incluído nos atalhos, marca branca e app na loja à parte, folga mínima de 50% (App) por cliente até 1.000 clientes |
| **JU-02 e JU-07** | O app do cliente é **incluído** no Integrado e no Completo, **opcional no Essencial**; à parte também a marca branca e o app na loja |
| **JU-03** | Calendário forense feito por integrante de IA com ratificação humana (R$ 336 por mês); **[a confirmar]** se a leitura automática dos portais respeita os termos; porta de entrada do monitoramento; pré-pago da Judit |
| **JU-07** | Decidir se a IA do atendimento vira franquia do escritório: hipótese, usar a Bolsa existente |
| **JU-08 e JU-09** | JU-08: confirmar o custo por documento e a conta do escritório na v1; JU-09: nada muda (sem taxa, sem marketplace; pagamento pela conta do escritório com aprovação humana) |
| **JU-10** (o coordenador ajusta) | Sem parecer pago no piloto: trocar a exigência de parecer pago por termo do piloto, termo de IA, consentimento e revisão escrita por advogado do grupo; sócio como encarregado, terceirizado só sob escala; seguro só com cliente pagante; cotar teste de invasão |
| **JU-06 e JU-11** | JU-06: medir UU por integrante e a reserva de prazos; JU-11: custo da advogada de referência e do suporte do primeiro trimestre; o piloto de 1 a 5 escritórios entra como capital inicial (4.6) |
| **`configurador.html`, `parametros.json`, `teste_configurador.js`** | Só quando o Jurídico for construído (seção 17.3); hoje nada é alterado |

### 18.2 Ordem de construção (só planejamento)

1. Aprovar este estudo e **cotar** só os seguros (JU-10), que começam com cliente pagante. 2. Montar o piloto de **1 a 5 escritórios** (termo do piloto, termo de IA, revisão escrita por advogado do grupo) e **medir** clientes, processos, mensagens, documentos, uso da IA, horas de implantação e suporte. 3. Só então fixar preço. 4. Construir a calculadora depois do BPO (decisão anterior), reaproveitando `configurador.html`. 5. Reabrir o preço dos módulos de lei e do monitoramento com volume e contrato do agregador.

### 18.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | **RESPONDIDA (Enzo, 9/11/2026).** **Fixos do pacote:** automatizar com a IA do nosso time o que der; sócio da plataforma como encarregado; seguros só com cliente pagante | Aplicada (4.4): fixos de R$ 3.547 / 8.105 / 9.630 (baixo / provável / alto); encarregado terceirizado só como sensibilidade (R$ 10.486) | "A nossa IA faz o trabalho de preparar o calendário dos tribunais e os papéis de privacidade, e uma pessoa só confere e aprova. Seguro só começa quando houver cliente pagando." |
| 2 | **RESPONDIDA (Enzo, 9/11/2026; corrigida no mesmo dia).** **CRM e App:** CRM incluso no uso completo e escalando por cliente; **App incluído por padrão em todos os atalhos**, com valor por cliente maior; **só marca branca e app na loja são à parte**; vale para todos os pacotes | Aplicada (seção 15): CRM a R$ 0,70 por cliente com faixa parando em 0,75; App a R$ 40 mais R$ 0,60 por cliente. Valores na pergunta 14 | "O CRM e o App vêm no pacote e ficam mais caros quando o escritório tem mais clientes. O que se compra à parte é só o app com a marca do escritório." |
| 3 | **RESPONDIDA (Enzo, 9/11/2026: segue a hipótese).** **Módulo de lei:** R$ 60 por advogado dentro de um contrato por escritório, ou preço fixo por escritório? | Por advogado, contrato por escritório | "O módulo da lei é contratado uma vez pelo escritório, mas cobrado por advogado que o usa (R$ 60 cada). A outra opção é cobrar R$ 60 fixos por escritório, que rende bem menos." |
| 4 | **RESPONDIDA (Enzo, 9/11/2026: segue a hipótese).** **Margem da IA:** manter R$ 79 e R$ 189 com 57% e 58% de margem a 50% de uso, ou subir a R$ 85 e R$ 197 para 60%? | Manter; medir antes de reajustar | "A IA deixa cerca de 57% de sobra depois dos custos dela, abaixo dos 60% que queríamos. Subimos o preço um pouco ou esperamos medir o uso real?" |
| 5 | **Assinatura eletrônica:** na v1 o escritório contrata o provedor (JU-08) e depois oferecemos o repasse a custo + 20% por documento? | Sim | "No começo o escritório contrata a empresa de assinatura e nós ligamos ao sistema; depois podemos revender ao custo mais um quinto?" |
| 6 | **RESPONDIDA (Enzo, 9/11/2026).** **Correspondentes:** vale o JU-09; **a plataforma não é um marketplace** | Aplicada (7.4): sem taxa e sem receita; o correspondente é convidado sem assento; o pagamento sai da conta do escritório pelo Financeiro, com aprovação humana | "O sistema organiza as despesas e ajuda a pagar o correspondente com o dinheiro do escritório, mas não cobra nada por isso e nunca guarda o dinheiro." |
| 7 | **Contábil e Jurídico juntos:** módulos compartilhados (CRM, Timesheet, Financeiro e App) cobrados uma vez, pela tabela do pacote principal? | Sim | "Quem tem os dois pacotes paga a plataforma, o CRM e o App uma vez só?" |
| 8 | **Implantação do Pequeno e do Médio** a R$ 3.900 e R$ 6.500 (acima do mercado jurídico), com piso em margem zero? | Manter a tabela, oferecer o Solo grátis e testar | "A implantação é bem mais cara que a do mercado de advocacia; mantemos e vemos quem aceita?" |
| 9 | **Solo gratuito em autoatendimento** (apoio de R$ 45), mesmo rendendo só R$ 181 a R$ 441 de contribuição? | Sim; ele atrai o escritório que cresce | "O advogado sozinho entra sem implantação paga, mesmo sobrando pouco dinheiro por mês?" |
| 10 | **Monitoramento:** só contratar a faixa de R$ 1 mil do agregador com cerca de 667 processos pedidos; antes, consulta avulsa ou pré-pago? | Sim [a confirmar o pré-pago] | "Só assinamos o plano mínimo do agregador quando houver processos suficientes para pagá-lo?" |
| 11 | **IA proativa (Controladoria, Atendimento):** só com IA Operação ou com a Bolsa do escritório, nunca no plano da secretária? | Sim; revisar com a medição (JU-06 e JU-07) | "A IA que responde clientes gasta de uma bolsa do escritório, e não do plano de uma pessoa?" |
| 12 | **Piloto antes do preço:** medir 1 a 5 escritórios por 4 meses antes de fixar valores? | Sim | "Medimos uso de verdade antes de bater o martelo no preço?" |
| 13 | **RESPONDIDA (Enzo, 9/11/2026).** **Capital inicial:** sem parecer pago; piloto de 1 a 5 escritórios, que talvez paguem um pouco | Aplicada (4.6): pareceres R$ 0; capital inicial em dinheiro R$ 5,9 mil a 10,6 mil (R$ 4,9 mil a 5,6 mil com R$ 250 de cobrança simbólica); valor do tempo R$ 7,3 mil a 14,2 mil; risco de sigilo, LGPD e ética segue, com controle contratual | "Não pagamos advogado para dar parecer agora. Testamos com poucos escritórios conhecidos, com termo assinado, e só entram casos reais de quem concordou." |
| 14 | **Valores de teste do CRM e do App:** CRM a R$ 0,70 por cliente com faixa até 0,75; App incluído a R$ 40 fixos mais R$ 0,60 por cliente (folga mínima de 50% sobre o custo até 1.000 clientes; o mesmo valor serve ao Contábil)? | Sim; revisar com o custo medido | "O CRM custa R$ 0,70 por cliente e o App R$ 40 por mês mais R$ 0,60 por cliente, já incluídos nos pacotes. Esses números servem de partida?" |
| 15 | **RESPONDIDA (Enzo, 9/11/2026).** **Essencial com ou sem App:** o mercado jurídico não dá app nos planos de entrada, então **Essencial sem App** | Aplicada (v0.5): Essencial R$ 250 / 395 / 682, App opcional (R$ 261 / 559 / 984 com App); Integrado e Completo incluem o App; exceção do Jurídico, Contábil não reavaliado; evidência **[a confirmar]** nas páginas oficiais | "O pacote mais barato não traz o app do cliente, como o mercado; o app entra a partir do Integrado ou pode ser comprado à parte no mais barato." |

### 18.4 Ressalvas

- **Nada do uso foi medido.** Clientes por escritório (50, 250, 625), 1,6 processo por cliente, 60% de advogados entre os usuários, 50% de uso da IA, mensagens do WhatsApp, documentos assinados, horas de implantação e adesão à IA e ao monitoramento são **premissas**. A margem varia de 86% (uso baixo) a −31% (uso alto).
- **JU-06, JU-08, JU-09 e JU-11 foram lidos só nas seções de custo.** O custo por documento vem de JU-08 (preço do plano ÷ franquia, **[a confirmar]**); as horas e as UU do calendário forense e do encarregado de dados (IA do time) **não têm medição**.
- **O mercado** vem do SIJUR de 18/10/2026 **[a confirmar]**, de J1 e J7 (fabricantes e agregadores, divergentes); a faixa intermediária da Judit, o mínimo de faixa e a existência de pré-pago **[a confirmar]**.
- **Custos de JU-10** (seguros e, como sensibilidade, encarregado terceirizado) são **estimativas da pesquisa 04** sem cotação; teste de invasão, certificação e carimbo do tempo **não têm valor**. A redução da curadoria à metade no cenário baixo **não tem base**. A dispensa de encarregado pela Res. CD/ANPD 2/2022 **[a confirmar]**; a leitura automática de portais de tribunais para o calendário **[a confirmar]** (JU-03 4.6).
- **Tributos** a 12,5% e **horas a R$ 90** são os do Contábil e **ainda a confirmar** (contador e medição). A plataforma **não presta consultoria jurídica nem tributária**.
- **O Essencial sem App** se apoia em evidência de mercado fraca: J8 (Astrea só no Smart), J1 (Projuris só no ADV completo) e uma busca nova inconclusiva e contraditória; **[a confirmar]** nas páginas oficiais antes do lançamento. O Contábil **não foi reavaliado** nesse ponto.
- **Correções ao JU-05** (margem do Pequeno Essencial, equilíbrio, custo da franquia) vêm de contas refeitas aqui; o texto do JU-05 não foi alterado.
- **Sem parecer pago, o risco continua** (sigilo, LGPD, ética, responsabilidade). A regra unificada 9 exigia parecer de advogado especializado antes de casos reais; por decisão do Enzo o piloto segue **sem parecer pago**, com controle contratual (termo do piloto, termo de IA, consentimento, revisão escrita por advogado do grupo, sem seguro). **O parecer pago volta com clientes pagantes em escala.** Nada deste estudo substitui parecer jurídico.

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].
