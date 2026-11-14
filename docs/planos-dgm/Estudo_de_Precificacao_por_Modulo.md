# Estudo de precificação por módulo

**Adendo v0.9 de 9/11/2026: App do cliente incluído nos pacotes e atalhos, com preço por cliente de R$ 0,30 para R$ 0,60 (adendo no fim).** · **Adendo v0.8 de 8/11/2026: custo do diagnóstico de leitura incorporado aos totais (ajuda de R$ 0,16 no provável e R$ 0,65 no alto), FAQ como primeira camada do suporte e custo-hora do escritório único (seção 6.8.10).** · **Adendo v0.7 de 8/11/2026: suporte geral com chat e assistente de ajuda, teto dos conectores em 130%, piso da implantação em margem zero (P25, P26 e P27 respondidas).** · **Adendo v0.6 de 8/11/2026: pacote BPO financeiro recalibrado (R$ 390 + R$ 65 por empresa; seção 10.4). O restante é da v0.5.** · **Versão 0.5 · 7/11/2026 · suporte reduzido com ajuda do sistema por modelo pequeno, conectores embutidos com teto, premissas visíveis e implantação como receita e caixa. Não define preço final de venda.**

Este estudo responde ao pedido de vender o sistema de forma modular: quanto custa entregar cada módulo por escritório, qual estrutura de preço foi escolhida (uma equação, o configurador da seção 6) e o que ainda precisa de confirmação. Ele fecha a pendência registrada em [08 · Conectores, 13.2](subplanos/08-Conectores.md) e no [Desenho do Sistema, seção 9](Desenho_do_Sistema.md). Os preços que aparecem são **parâmetros de teste**; não são preço final de venda. A calculadora está em [precificacao/configurador.html](precificacao/configurador.html). A estrutura foi decidida pelo usuário em 7/11/2026; a versão 0.1 trazia três estruturas candidatas (A, B e C), agora descartadas (6.7). A versão 0.3 separou a IA do sistema-base: a IA é vendida em **planos por usuário**, com limite por janela de 5 horas e por semana (6.8).

**A versão 0.7 aplica quatro decisões do usuário de 8/11/2026** (as margens abaixo são de contribuição, uso provável, sistema-base sem IA, P / M / G):

1. **P25, suporte geral com assistente de ajuda: sim.** O sistema tem um **chat de suporte geral com pessoas** (a equipe da plataforma) e, dentro dele, **incluído**, um **assistente de ajuda padrão e barato**, que responde só sobre o sistema e as configurações dele, com limite de **30 perguntas por usuário por mês** (hipótese), para todo usuário, com ou sem plano de IA, sem gastar UU. É da plataforma, não de um pacote de área (6.8.9). O suporte humano por assento segue em R$ 12,50 (é a hora de atendimento) e **somam-se ao custo do sistema-base o chat com pessoas (ferramenta e cobertura de horário, R$ 2 por assento, premissa a medir) e o assistente (R$ 0,15 por usuário no provável; R$ 0,47 no limite de 30 perguntas)**. A margem de contribuição do sistema-base passa de 68,5% / 42,0% / 7,8% para **67,5% / 39,9% / 4,3%** (R$ 668 / 549 / 100 por mês, contra 678 / 579 / 180); com o assistente sempre no limite, 67,4% / 39,6% / 4,0%.
2. **P26, teto dos conectores apertado: 130% do uso provável** (era 162%). No provável o teto continua sem excedente. No **uso alto do médio a margem sobe de −13,5% para −3,9%** só pelo teto (R$ 191 de excedente por mês contra R$ 55); com o chat de suporte, −7,7% (3.11 e 6.9). O custo da decisão: quem usar mais de 130% do provável paga extra (R$ 86 por mês no médio com 150%).
3. **P27, implantação: o piso é a margem zero.** O preço depende do contexto, mas o time **nunca vende abaixo do custo de entrega**: R$ 2.520 / 5.400 / 13.500 (28, 60 e 150 horas a R$ 90). A tabela segue (R$ 4.500 / 8.500 / 19.500); o desconto máximo é de 44% / 36,5% / 30,8% (8.3). **P28 (custo real da hora) segue aberta:** medir nos primeiros escritórios.
4. **"Exige: Painel" passa a "Exige: pacote de área"** (DA-02) nas tabelas e em `parametros.json`; os módulos `exige` técnicos continuam usando a chave `painel`, que é o pacote Contábil.

**A versão 0.8 (8/11/2026) refaz os totais com o custo do diagnóstico** (decisão do usuário, "parece bom"): a ajuda do sistema vai a **R$ 0,06 / 0,16 / 0,65** por usuário por mês (era 0,06 / 0,15 / 0,47), em `parametros.json` (`ajuda.diagnostico`), na calculadora e em `teste_configurador.js` (304 verificações). **Efeito no sistema-base sem IA, P / M / G:** custo provável +R$ 0,05 / 0,16 / 0,43 por mês e margem de contribuição **67,5% / 39,9% / 4,3%, sem mudança na primeira casa** (−0,005 / −0,012 / −0,019 ponto); no uso alto o custo sobe R$ 0,9 / 2,7 / 7,2 e a margem vai de 35,4% / −7,5% / −53,9% a **35,3% / −7,7% / −54,2%**. O **FAQ** (seções básicas na Ajuda, antes do assistente) tem custo de conteúdo e manutenção, sem custo por consulta, e entra com R$ 0. As seções 3 a 7 e 10 foram corrigidas; a v0.7 e a v0.5 abaixo ficam como histórico.

**Caixa com 3 escritórios novos por mês e o novo piso** (8.5): o sistema-base sem IA fica com caixa acumulado positivo no **mês 12** (+R$ 1,4 mil; necessidade máxima de R$ 21,1 mil no mês 6), a Operação no **mês 6** e o Completo no **mês 4**. Os números das seções 6.4, 6.9, 8 e 9 abaixo já estão recalculados com as quatro decisões; onde a v0.5 ou a v0.6 aparecem entre parênteses, é o valor anterior.

**A versão 0.5 muda quatro coisas** (decisões do usuário de 7/11/2026):

1. **O suporte humano recorrente por assento cai de R$ 25 para R$ 12,50 no provável** (R$ 6 no baixo; R$ 25 no alto): "sistema auto explicativo raramente precisa de suporte". Entra um **modelo pequeno e barato de ajuda do sistema**, com base de conhecimento do produto, que responde as dúvidas de uso feitas ao Assistente por **R$ 0,15 por usuário por mês** (3.3, 6.8.8). Com isso a contribuição do sistema-base sem IA passa de 62,3% / 28,6% / −13,5% para **68,5% / 42,0% / 7,8%** (P / M / G; 6.4 e 6.9).
2. **Os conectores de governo e estaduais ficam embutidos no preço-base, com teto de uso por cliente por mês**; o que passar do teto é cobrado como extra, a custo + 20% (3.11). O teto cobre o uso provável com folga de 62%.
3. **Tributos e os demais percentuais estimados ficam visíveis e editáveis** no painel Premissas da calculadora (6.10); a alíquota (12,5% de valor de trabalho, faixa de 8% a 17%) será discutida depois.
4. **A implantação passa a ser receita e caixa inicial**: preço por porte, margem, efeito no primeiro ano e no equilíbrio e fluxo de caixa de 12 meses (8.3 a 8.7). Com 3 escritórios novos por mês, o caixa acumulado do sistema-base sem IA fica positivo no mês 12 e o da configuração Operação, no mês 6.

**A versão 0.4 mudou três coisas** (decisões do usuário de 7/11/2026; os números abaixo foram recalculados na v0.5):

1. **A margem alta (cerca de 60%) fica só na IA.** O sistema-base, sem IA, é vendido **um pouco acima do mercado** (HubStrom com app de marca branca; no ponto de referência do usuário, 200 clientes e 10 usuários, a HubStrom cobra cerca de R$ 1.500 de tabela e cerca de R$ 1.200 com o desconto que ele recebeu). A margem do sistema-base é baixa e é mostrada como é, inclusive negativa no grande na v0.4 (na v0.5, positiva e ainda baixa, 7,8%: 5.3, 5.4, 6.3, 6.4 e 6.9).
2. **A margem aparece em três níveis** (1.6): contribuição, após a parte rateada dos custos fixos da plataforma e líquida estimada após tributos e comissão (6.4, 9.4). A margem de 60% de antes é a contribuição; não é a margem final.
3. **Os custos de API do painel do cliente têm linha própria** (3.10): quem paga cada um e como entra nas margens e na calculadora.

As tabelas de custo das seções 3.2 a 3.6 seguem como **demanda bruta de IA da versão 0.2** (referência de volume), não como o custo cobrado.

Fontes: [Desenho do Sistema](Desenho_do_Sistema.md); subplanos [02](subplanos/02-Time-de-Agentes.md), [04](subplanos/04-CRM.md), [05](subplanos/05-Timesheet.md), [06](subplanos/06-App-do-Cliente.md), [07](subplanos/07-Motores-e-Consultor.md), [08](subplanos/08-Conectores.md), [09](subplanos/09-Financeiro.md); pesquisas [01](../pesquisa/01-infra-aws.md), [02](../pesquisa/02-custos-llm.md), [05](../pesquisa/05-mercado-preco.md), [08](../pesquisa/08-modelo-mvp.md) e as da plataforma (B1 a B3, S2, S3, 90); [Plano MVP](Plano_MVP_6_meses.md).

---

## 1. Escopo, método e limites

### 1.1 O que entra e o que não entra

| Tipo de custo | Definição | Exemplos | Onde aparece |
| --- | --- | --- | --- |
| **Variável** | Cresce com o uso | Tokens de IA, mensagens de WhatsApp, chamadas do Integra, GB armazenados | Seção 3, por unidade |
| **Fixo por escritório** | Existe desde que o escritório é ativado | Chave de criptografia do cofre, domínio e tema, monitoramento | Seção 3, coluna "fixo" |
| **Variável, API paga do painel do cliente** | Consulta paga que a plataforma faz em nome do cliente do escritório | Integra Contador, CNPJ, InfoSimples, integrador de NFS-e, certidões, agregador de Open Finance | Seção 3.10; já dentro da margem de contribuição; embutida até o teto de uso (3.11) |
| **Variável, ajuda do sistema** | Pergunta de uso do próprio sistema, respondida por um modelo pequeno com base de conhecimento do produto | Tokens do modelo barato e busca na base | Seções 3.3 e 6.8.8; custo do sistema-base, sem receita própria |
| **Fixo da plataforma** | Existe com ou sem clientes | Índice legal, GPU, DGM, seguro, equipe | Fora da margem de contribuição; entra no nível (b) e no equilíbrio (1.6, 9.4) |
| **Único (implantação)** | Acontece uma vez | Importação de clientes, treinamento, migração | Seção 8 (preço, margem e caixa em 8.3 a 8.7) |

Já decididos: o contrato do SERPRO é da plataforma, com volume somado e consumo cobrado; o Open Finance é módulo à parte, cobrado do escritório; o custo por mensagem de WhatsApp vai ao escritório. Seguem como hipótese: os limites e preços dos planos de IA (6.8) e os tributos sobre serviço importado (câmbio).

### 1.2 Moeda, data-base e câmbio

Reais de 7/11/2026. Os insumos em dólar (modelos de IA, AWS) usam **R$ 7,97 por US$**: a premissa do [Plano MVP](Plano_MVP_6_meses.md) para a empresa com CNPJ, que inclui IOF e tributos de importação de serviço **[a confirmar com o contador do projeto]**. Com só o IOF (R$ 5,69), a parte em dólar cai cerca de 29% (seção 9). Preços de Meta, SERPRO, InfoSimples e fornecedores nacionais já estão em reais.

### 1.3 Escritórios-tipo

| | Pequeno (P) | Médio (M) | Grande (G) |
| --- | ---: | ---: | ---: |
| Clientes atendidos | 30 | 100 | 300 |
| Usuários | 5 | 15 | 40 |
| Números de WhatsApp | 1 | 2 | 4 |
| Mix de regimes (premissa de 08, 10.2) | 70% Simples, 10% MEI, 20% Presumido ou Real | igual | igual |

O médio é o escritório de 100 clientes do 08 (10.2) e da capacidade de 13 a 14 pessoas do mapa L2.

### 1.4 Cenários de uso

Cada custo tem três valores: **baixo**, **provável** (uso regular) e **alto** (tudo alto ao mesmo tempo: teste de estresse, não expectativa). O que não vem de fonte está marcado **[premissa]**. Nada foi medido em produção.

### 1.5 Limites da pesquisa

Quatro buscas na web em 7/11/2026 não acharam preço público de Acessórias, Conexa ou Domínio Processos (só um comentário de fórum, R$ 390 por usuário para o ex-Gestta, **não confirmado**). Os preços de B2 e R2 vêm de comparadores (**secundário**). O resto vem dos arquivos do repositório, com as marcas que eles já traziam.

### 1.6 Três níveis de margem

Em todo o estudo e na calculadora, "margem" sem qualificação é a **(a) margem de contribuição**. Os outros dois níveis desconstroem o "61%" que o estudo mostrava.

| Nível | Conta | Inclui | Não inclui |
| --- | --- | --- | --- |
| **(a) Contribuição** | Preço − custo por escritório | Custo variável (tokens, Integra, InfoSimples, GB, API do painel do cliente), fixo por escritório (chave de criptografia, domínio, monitoramento), **infraestrutura rateada por usuário e por cliente** (premissas de engenharia) , **suporte recorrente por assento** e **ajuda do sistema** (modelo pequeno) | Fixos da plataforma, tributos, comissão de vendas, tarifas de cobrança dos clientes, implantação (custo único) e WhatsApp (repassado ao escritório) |
| **(b) Após fixos rateados** | (a) − rateio dos fixos da plataforma | Rateio dos fixos: **R$ 8,2 mil por mês sem pró-labore, R$ 18,2 mil com** (9.4: infra 1.200, GPU 2.111, índice legal e DGM 1.881, operação 3.000), × (clientes ÷ 100) ÷ N, com N = 10, 30 ou 100 escritórios médios equivalentes (100 clientes cada) ativos | Tributos, comissão, implantação |
| **(c) Líquida operacional estimada** | (b) − tributos − comissão | Tributos sobre a receita: **hipótese de 8% a 17%** (ISS ou equivalentes, PIS e COFINS), **a confirmar com o contador do projeto** (será discutida depois; editável no painel Premissas da calculadora, 6.10); comissão de vendas de 0% ou 10% da receita **[premissa]** | Imposto de renda sobre o lucro, tarifas de cobrança dos clientes e implantação |

A pesquisa 08 trabalhou com 15,5% (Simples, Anexo V, 1ª faixa) a 24,9% (Lucro Presumido 2027); o intervalo de 8% a 17% é a hipótese do usuário e deve ser confirmada. A parcela fixa de infraestrutura (R$ 1.200 do degrau 0) está nos fixos da plataforma e a parcela rateada por cliente e usuário está na contribuição; se a engenharia confirmar que a rateada já inclui o degrau, há dupla contagem leve e as margens (b) e (c) melhoram.

---

## 2. Inventário dos módulos vendáveis

### 2.1 Base obrigatória (não se vende isolada)

Fundações (contas, papéis, cadastro único, tarefas, índice de documentos, eventos, ferramentas tipadas, notificações, dados separados por escritório), cofre de credenciais e certificados, tema padrão da plataforma (a **marca branca é complemento opcional**) e registro de eventos. Todo módulo depende dela. O mínimo vendável é o Painel, que traz a Base.

### 2.2 Módulos e dependências

| Módulo | O que entrega | Exige | Pode ser vendido sozinho (sobre a base) |
| --- | --- | --- | --- |
| **Painel** (com Início e tarefas) | Abas por setor, calendário, pendências, tarefas | Base | Sim |
| **CRM** | Caixa de conversas, WhatsApp, e-mail, leads, comunicados, réguas, IA por clique | Base | Sim |
| **Timesheet** (com extensão de navegador) | Sessões de trabalho, horas por cliente, confirmação assistida | Pacote de área (a tarefa aberta atribui o cliente). Rentabilidade exige também o Financeiro | Não: exige pacote de área |
| **IA** (planos por usuário: Essencial, Operação, Intensivo, ou sem IA; bolsa compartilhada opcional) | Chat Geral e perguntas, Consultor (perguntar, parecer, vigilância, revisão de enquadramento), integrantes sob demanda e proativos (jobs e eventos), segunda opinião, conforme o plano (6.8) | Base e um módulo com ferramentas (Fundações 2.2). O integrante de Atendimento exige CRM; o do Financeiro, Financeiro | Sim, com um pacote de área. O Administrador atribui o plano a cada usuário |
| **Consultor da empresa** (complemento, por cliente) | Perguntas do cliente final ao Consultor, pelo App, com franquia por cliente | Pacote de área e App; não exige plano de IA dos usuários | Não: complemento do App |
| **App do cliente** | Documentos, pendências, pedidos, agenda, serviços extras. Marca branca (marca, domínio e tema do escritório) e app na loja são complementos opcionais; sem eles, usa a marca e o tema padrão da plataforma | Pacote de área (pedidos viram tarefa). O chat do app exige CRM (fio único) | Sim, sem chat |
| **Conectores: governo federal** | Integra Contador, CNPJ, DF-e, eSocial, Reinf, ADN | Pacote de área (Contábil), contrato SERPRO, e-CNPJ, cofre | Não: precisa do pacote de área |
| **Conectores: estaduais e municipais** | DTE por agregador (InfoSimples), certidões, NFS-e fora do padrão | A1 do cliente (pelo App ou pelo escritório) | Não |
| **Conectores: cores** | Alterdata, Domínio, Contmatic, Questor, SCI | Pacote de área (Contábil) e contrato do escritório | Não |
| **Conectores: WhatsApp e e-mail** | Canais do CRM e das notificações | Faz parte do CRM quando ele é contratado | Não é vendido à parte |
| **Conectores: bancos e cobrança** | Pix, boleto, CNAB, Asaas, Efí | Financeiro | Não |
| **Suporte geral** (plataforma, v0.7; P25) | Chat de suporte com pessoas (equipe da plataforma) e, dentro dele, assistente de ajuda padrão (modelo pequeno, só sobre o sistema, até 30 perguntas por usuário por mês, sem consumir UU); encaminha para a equipe ao atingir o limite | Base | **Incluído para todo usuário**, com ou sem plano de IA; sem preço próprio (6.8.9) |
| **Conectores: nuvens** | Espelho do Drive, OneDrive, S3, WebDAV, SFTP | Base (índice de documentos) | **Recomendado dentro da Base**, sem preço próprio |
| **Financeiro** | Contratos, cobrança, NFS-e dos honorários, contas a pagar, fluxo de caixa | Base. A régua por WhatsApp exige CRM; sem ele, só e-mail (09, 12.1) | Sim: "Contratos e honorários" na v1; "Financeiro completo" na fase 3 |
| **Open Finance** (módulo à parte, cobrado do escritório) | Conciliação por consentimento | Financeiro completo e contrato com agregador | Não |
| **Modo BPO entre escritórios** (extra, fora dos atalhos Essencial, Operação e Completo; modo da plataforma) | Multi-inquilino em dois níveis: o inquilino BPO tem subescritórios (os escritórios contratantes), cada um com seus clientes (BPO-001 a BPO-023; [B10](../pesquisa/plataforma/B10-bpo-escritorios.md)) | Pacote de área com setor executado | Sim, sobre a Base |
| **Pacote BPO financeiro** (extra, fora dos pacotes; fase 3c, v0.6) | O escritório faz o contas a pagar e a receber das empresas clientes (FIN-201), **trabalhando no ERP que o cliente já usa** (Conta Azul, Omie e outros, por API ou arquivo), com a plataforma como camada de orquestração; livro próprio como opção. Duas partes: mensalidade-base do pacote por escritório e valor por empresa incluída ([subplano 10](subplanos/10-BPO.md), seções 3 e 9) | Financeiro (espelho e conciliação) e App (aprovação do cliente); Timesheet, CRM e Open Finance recomendados e desmarcáveis | Não |


---

## 3. Custo por módulo e por escritório-tipo

### 3.1 Preços unitários dos insumos

| Insumo | Preço | Fonte |
| --- | --- | --- |
| Sonnet 5.5, por milhão de tokens (MTok) | US$ 2 entrada; US$ 0,10 leitura de cache; US$ 10 saída | 02 (pesquisa), 2.1 |
| Haiku 5.5 (modelo barato) | US$ 0,10; US$ 0,01; US$ 0,50 | idem |
| **Preço médio por MTok** (premissa: 50% leitura de cache, 45% entrada nova, 5% saída) | Sonnet US$ 1,45 = **R$ 11,56**; Haiku US$ 0,075 = **R$ 0,60** | cálculo: 0,5 × 0,10 + 0,45 × 2 + 0,05 × 10 |
| Mistura de modelos (02, 13: um quarto em modelo barato) | 25% barato: **R$ 8,82/MTok**; 50%: R$ 6,08; 60%: R$ 4,98; 75%: R$ 3,34 | cálculo |
| WhatsApp (Meta) | Marketing R$ 0,3217; utilidade, autenticação e serviço R$ 0,035; 1.000 de serviço grátis por número | 08, 10.1 |
| Transcrição de áudio | R$ 0,015 a 0,02 por minuto | S3 |
| Integra Contador | Consulta R$ 0,24→0,06; Emissão R$ 0,32→0,08; Declaração R$ 0,40→0,12 (faixa 1 → mais alta); pós-pago, sem adesão | 08, 10.1 (SERPRO, 06/11/2026) |
| Consulta CNPJ | R$ 0,6591 (Básica), 0,8683 (QSA), 1,1717 (Empresa) | 08, 10.1 |
| InfoSimples | R$ 0,20→0,05 + adicional de R$ 0 a 0,10; mínimo R$ 100/mês | 08, 10.1 |
| Open Finance | Pluggy a partir de R$ 2.500/mês (**não confirmado no site oficial**); Belvo US$ 1.000/mês | 08, 10.1; B1 |
| Armazenamento (S3 São Paulo) | Standard-IA US$ 0,0221/GB-mês; cópia em Deep Archive US$ 0,0032/GB-mês | 01, 4.2 |
| Armazenamento alternativo | Backblaze B2 cerca de US$ 6/TB; Cloudflare R2 cerca de US$ 15/TB | busca de 7/11/2026, **secundário** |
| Integrador de NFS-e (Focus) | Solo R$ 94,90; Growth R$ 572 (4.000 notas, R$ 0,125 adicional); município novo R$ 199 | 08, 10.1 |
| Cobrança (Asaas; Efí) | Asaas R$ 1,59 por boleto ou Pix (R$ 0,79 promocional), NFS-e R$ 0,49; Efí boleto R$ 3,45, Pix 1,19% | 09, 12 |

### 3.2 Custo de uma execução de IA

Tokens de 02, seção 13, e de 07, seção 10, a R$ 7,97 por US$, com o cache de cada execução.

| Execução | Tokens (02 e 07) | Modelo | Custo por execução |
| --- | --- | --- | ---: |
| Checagem sem modelo (job ou evento vazio) | 0 | nenhum | R$ 0 |
| Turno de chat simples | 10 mil em cache + 3 mil + 0,5 mil de saída | Sonnet | R$ 0,10 |
| Turno de chat com ação | 40 mil em cache + 13 mil + 1,5 mil | Sonnet | R$ 0,36 |
| Evento simples (documento classificado) | 10 mil em cache + 2,5 mil + 0,3 mil | barato / Sonnet | R$ 0,004 / R$ 0,07 |
| Evento com trabalho (pedido implícito) | 35 mil em cache + 14 mil + 1 mil | Sonnet | R$ 0,33 |
| Job sobre a carteira (60 clientes) | 80 mil, metade em modelo barato | misto | R$ 0,49 (R$ 0,008 por cliente) |
| Pergunta legal (`legal.consultar`) | 15 a 30 mil, principal uma vez | roteado | **R$ 0,15 a 0,58; média R$ 0,217** (08 pesquisa, 2 e 7) |

Conferência: o usuário intenso do 02 (20 turnos, 10 eventos com trabalho, 4 jobs por dia) soma 1,5 milhão de tokens e **R$ 194 por mês** pela soma das execuções. A regra de R$ 8,82 por MTok dá R$ 277: **cerca de 30% mais conservadora**.

### 3.3 Premissas de uso

| Unidade | Baixo | Provável | Alto | Base da premissa |
| --- | ---: | ---: | ---: | --- |
| Chat e jobs dos integrantes, MTok por usuário por dia útil (21 dias) | 0,25 | 0,6 | 1,2 | 02: usuário intenso 1,5 a 2,5 **[premissa]** |
| Eventos por cliente (documentos, pedidos, atendimento), MTok por cliente por mês | 0,2 | 0,5 | 1,2 | 15 documentos × 15 mil + 4 eventos × 50 mil + 10 respostas × 15 mil ≈ 0,5 (02, 13) |
| Parcela em modelo barato | 50% | 25% | 25% | 02, 13 |
| Preço médio de IA, R$ por MTok | 6,08 | 8,82 | 8,82 | 3.1 |
| Perguntas diretas ao Consultor por usuário por mês | 40 | 80 | 200 | 50, 150, 400 do 02 reduzidas: o chat dos integrantes já consome tokens **[premissa]** |
| Custo por pergunta ao Consultor | R$ 0,152 | R$ 0,217 | R$ 0,58 | 08 (pesquisa), 7: API −30%, base, roteamento conservador |
| Vigilância e revisão de enquadramento, R$ por cliente por mês | 0,14 | 0,45 | 2,64 | 0,05 / 0,1 / 0,3 MTok [premissa] |
| IA por clique no CRM (tom, resumo, triagem), R$ por cliente | 0,14 | 0,28 | 0,84 | 0,05 / 0,1 / 0,3 MTok em modelo barato [premissa] |
| Áudio transcrito, minutos por cliente | 3 | 5 | 12 | 08, 10.2 usa 5 [premissa] |
| WhatsApp, mensagens por cliente por mês: utilidade / marketing / serviço | 3 / 0 / 10 | 6 / 0,5 / 25 | 12 / 2 / 50 | Réguas de 3 a 5 etapas (04, 7.2) **[premissa]** |
| Armazenamento, GB por cliente (acumulado) | 3 | 8 | 20 | 0,2 GB por mês × 3 anos **[premissa]** |
| Preço de armazenamento, R$ por GB-mês | 0,08 | 0,20 | 0,35 | B2 + cópia; S3 Standard-IA + cópia; S3 Standard + cópia |
| Integra + CNPJ, R$ por cliente por mês | 1,07 | 2,25 | 3,80 | Baixo: contrato A, −55% **[inferência]**; provável: 08, 10.2; alto: 1,5× chamadas |
| InfoSimples, R$ por cliente por mês | 0,70 | 1,37 | 2,50 | 08, 10.2: R$ 137 por 100 clientes |
| Infraestrutura do assistente rateada, R$ por assento por mês | 5 | 14 | 40 | MVP degraus 2 e 1: R$ 4,8 e 13,7; AWS com 1.000 usuários ≈ R$ 34 |
| Infraestrutura da plataforma: fixo por escritório + por cliente | 15 + 0,2 | 25 + 0,6 | 60 + 1,5 | Engenharia **[premissa]**; chave KMS R$ 8 já inclusa |
| Suporte recorrente, R$ por assento por mês | 6 | 12,5 | 25 | Decisão de 7/11/2026 (v0.4: 6 / 25 / 60): sistema auto explicativo raramente precisa de suporte; provável = 2 h × R$ 90 ÷ 15 usuários **[premissa a medir]** |
| Chat de suporte com pessoas (v0.7, P25), R$ por assento por mês | 1 | 2 | 4 | Ferramenta de chat (licença por agente) e cobertura de horário comercial, rateadas por assento: cerca de R$ 1,40 com 2 agentes de US$ 40 e 450 assentos, arredondado; a hora de atendimento está no suporte recorrente acima **[premissa a medir]** |
| Ajuda do sistema: perguntas por usuário por mês | 4 | 10 | 30 | Dúvidas de uso respondidas por modelo pequeno; **30 é o limite mensal por usuário (P25)** **[premissa]** |
| Ajuda do sistema: tokens por pergunta | 5 mil | 8 mil | 15 mil | Pergunta + trechos da base de conhecimento do produto + resposta **[premissa]** |
| Ajuda do sistema: infraestrutura por usuário, R$ por mês | 0,05 | 0,10 | 0,20 | Busca vetorial e registro **[premissa]** |
| Ajuda do sistema, custo por usuário, R$ por mês, sem diagnóstico | 0,06 | 0,15 | 0,47 | Tokens × US$ 0,075 por MTok (mistura do modelo barato, 3.1) × R$ 7,97, mais infraestrutura (6.8.8) |
| **Ajuda do sistema, diagnóstico de leitura (v0.8, Q9), R$ por usuário por mês** | 0,001 | 0,011 | 0,18 | Acesso de leitura do assistente pelo escopo do usuário: parte das perguntas (10% / 20% / 40%) faz de 2 a 5 chamadas de leitura (2 a 5 mil tokens de resultado cada) **[premissa a medir]**; conta em 6.8.8; campo `ajuda.diagnostico` de `parametros.json` |
| **Ajuda do sistema com diagnóstico, R$ por usuário por mês (o valor dos totais, desde a v0.8)** | **0,06** | **0,16** | **0,65** | Soma das duas linhas acima; é o que a calculadora usa. **FAQ**: seções básicas da Ajuda, antes do assistente; custo de conteúdo e manutenção, sem custo por consulta, tratado como R$ 0 |

### 3.4 Custo mensal por módulo (R$ por mês)

Fórmula de cada linha: premissa × quantidade × preço (exemplos do médio provável abaixo da tabela). **Nota da v0.3:** as linhas "Time de agentes" e "Consultor" e o total mostram a **demanda bruta de IA da v0.2** (uso sem limite). O custo que entra no preço agora vem dos planos de IA (6.8): utilização do teto de cada plano × tokens × preço do modelo. A demanda bruta serve para comparar volume (6.4 e 6.8.5).

| Módulo | P baixo | P prov. | P alto | M baixo | M prov. | M alto | G baixo | G prov. | G alto |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Base (infra, cofre, eventos, e-mail) | 21 | 43 | 105 | 35 | 85 | 210 | 75 | 205 | 510 |
| Painel | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| CRM (WhatsApp, áudio, IA por clique) | 9 | 24 | 86 | 31 | 98 | 334 | 93 | 363 | 1.073 |
| Timesheet e extensão | 5 | 10 | 25 | 15 | 30 | 75 | 40 | 80 | 200 |
| Time de agentes | 196 | 688 | 1.428 | 600 | 2.107 | 4.391 | 1.641 | 5.766 | 12.061 |
| Consultor | 60 | 170 | 859 | 180 | 515 | 2.604 | 485 | 1.389 | 7.032 |
| App do cliente | 13 | 26 | 55 | 20 | 40 | 90 | 40 | 80 | 190 |
| Armazenamento de documentos (opcional; 8 GB por cliente acumulados) | 7 | 48 | 210 | 24 | 160 | 700 | 72 | 480 | 2.100 |
| Conectores: governo federal | 42 | 92 | 174 | 117 | 250 | 440 | 331 | 700 | 1.200 |
| Conectores: estaduais e municipais | 26 | 56 | 115 | 75 | 152 | 290 | 215 | 426 | 790 |
| Conectores: cores | 5 | 10 | 30 | 5 | 10 | 30 | 5 | 10 | 30 |
| Conectores: bancos e nuvens | 6 | 16 | 40 | 6 | 16 | 40 | 6 | 16 | 40 |
| Financeiro | 4 | 11 | 29 | 8 | 18 | 50 | 18 | 38 | 110 |
| Suporte recorrente (v0.5: R$ 6 / 12,50 / 25 por assento) | 30 | 62,5 | 125 | 90 | 187,5 | 375 | 240 | 500 | 1.000 |
| Chat de suporte com pessoas (v0.7: R$ 1 / 2 / 4 por assento) | 5 | 10 | 20 | 15 | 30 | 60 | 40 | 80 | 160 |
| Ajuda do sistema (modelo pequeno, v0.5) | 0,3 | 0,7 | 2,3 | 0,9 | 2,2 | 7,0 | 2,5 | 5,9 | 18,8 |
| **Total** | **430** | **1.268** | **3.304** | **1.222** | **3.701** | **9.696** | **3.303** | **10.139** | **26.515** |
| Por usuário | 86 | 254 | 661 | 81 | 247 | 646 | 83 | 253 | 663 |
| Por cliente atendido | 14 | 42 | 110 | 12 | 37 | 97 | 11 | 34 | 88 |

Fora do total: Open Finance (3.7); tarifas de cobrança, assinatura e integrador de NFS-e (contas do escritório); cores (**não público**); captura por fornecedor (R$ 223 a 800, só até existir o conector próprio).

**Ajustes de 7/11/2026 para o configurador:** (1) o **WhatsApp é repassado ao escritório**: sem ele o CRM custa R$ 13 / 43 / 129 (P / M / G) e o repasse estimado é R$ 11 / 55 / 234; (2) o **armazenamento é opcional e o padrão é 5 GB por cliente** (custo R$ 1,00 por cliente, não os 8 GB acumulados da tabela, que seguem como premissa de uso); (3) a **marca branca** (R$ 15 por mês de custo) é complemento opcional e sai do módulo App.

**Contas do escritório médio, provável:**

| Linha | Conta | R$ |
| --- | --- | ---: |
| Agentes | (15 usuários × 0,6 MTok × 21 dias + 100 clientes × 0,5 MTok) = 239 MTok × R$ 8,82 | 2.107 |
| Consultor | 15 × 80 perguntas × R$ 0,217 = 260; 100 × R$ 0,45 = 45; 15 × R$ 14 = 210 | 515 |
| CRM | WhatsApp: 600 utilidade × 0,035 = 21; 50 marketing × 0,3217 = 16; serviço 2.500 − 2.000 grátis = 500 × 0,035 = 18; áudio 100 × 5 min × 0,02 = 10; clique 28; e-mail 5 | 98 |
| Governo federal | Integra: 70 × R$ 2,24 + 10 × R$ 0,56 + 20 × R$ 2,64 = 215; CNPJ 10; fixo 25 | 250 |
| Estaduais e municipais | InfoSimples 100 × R$ 1,37 = 137; fixo 15 | 152 |
| Armazenamento | 100 × 8 GB = 800 GB × R$ 0,20 | 160 |
| Suporte | 15 assentos × R$ 12,50 (v0.4: R$ 25 = 375) | 188 |
| Chat de suporte com pessoas (v0.7) | 15 assentos × R$ 2 | 30 |
| Ajuda do sistema | 15 usuários × R$ 0,148 | 2 |

### 3.5 Custo variável por unidade (provável)

| Unidade | Componentes | R$ |
| --- | --- | ---: |
| **Por cliente atendido por mês** | Integra + CNPJ 2,25; InfoSimples 1,37; eventos dos integrantes 0,5 MTok × 8,82 = 4,41; vigilância 0,45; WhatsApp, áudio, clique e e-mail ≈ 1,0; infraestrutura 0,60; app 0,20; armazenamento 8 GB × 0,20 = 1,60 | ≈ 12 |
| **Por usuário por mês** | Chat e jobs 12,6 MTok × 8,82 = 111; Consultor 80 × 0,217 = 17; infraestrutura rateada 14; Timesheet 2; suporte 12,5; chat de suporte 2; ajuda do sistema 0,16 | ≈ 159 |
| **Por 1 milhão de tokens** | Mistura de modelos | 8,82 (3,34 com 75% em modelo barato) |
| **Por mensagem de WhatsApp** | Utilidade ou serviço fora da franquia / marketing | 0,035 / 0,3217 |
| **Por chamada de Integra** | Consulta / emissão / declaração, faixa 1 | 0,24 / 0,32 / 0,40 |
| **Por GB de documento por mês** | S3 Standard-IA + cópia | 0,20 (R$ 205 por TB) |
| **Por minuto de áudio** | Transcrição | 0,02 |

### 3.6 Leitura

1. **A IA é mais de dois terços do custo bruto** (demanda sem limite): Agentes mais Consultor somam 68% (P), 71% (M) e 71% (G) do total provável (v0.4: 65%, 68% e 68%; a parcela subiu porque o suporte caiu). Com os planos da v0.3 o custo cobrado de IA cai, porque o limite é um teto e o usuário médio usa parte dele (6.8.5): no Completo do médio, a IA é 47% do custo provável e 56% no pior caso.
2. **Os conectores custam pouco**: R$ 3,6 por cliente em custo variável, perto dos R$ 3,5 a 4,2 do 08.
3. **Armazenamento só pesa se o escritório contratar o da plataforma** (opcional; padrão de 5 GB por cliente); com a nuvem própria, o custo é só o índice.
4. **O Painel quase não tem custo variável**; seu custo está na base.
5. **Dois itens mudam de dono conforme a decisão**: Open Finance (3.7) e o contrato do Integra (3.8).

### 3.7 Open Finance

O piso de R$ 2.500 por mês (Pluggy) é um contrato, não um custo por conexão. **Decisão: é módulo à parte, cobrado do escritório, nunca embutido.** A plataforma assina o contrato e rateia; o configurador usa o rateio por 10 escritórios (R$ 250) mais R$ 1 por cliente conectado **[custo por conexão a confirmar]**.

| Cenário | Conta | R$ por escritório por mês |
| --- | --- | ---: |
| Escritório contrata sozinho | R$ 2.500 | 2.500 |
| Plataforma contrata e divide por 10 escritórios | 2.500 ÷ 10 | 250 |
| Plataforma contrata e divide por 25 | 2.500 ÷ 25 | 100 |
| Por conexão, escritório médio com 40 clientes conectados, contrato sozinho | 2.500 ÷ 40 | 62,50 por conexão |
| Belvo (alternativa) | US$ 1.000 × 7,97 | 7.970 |

### 3.8 Integra Contador: modelo A ou B

| Modelo | Quem contrata | Faixa de preço | Consulta | Efeito no médio (100 clientes) |
| --- | --- | --- | ---: | ---: |
| **A** | A plataforma, um contrato, termo por escritório | Volume somado de todos os escritórios | R$ 0,24 até R$ 0,06 **[faixas e período a confirmar]** | R$ 108 (−55%, hipótese) a R$ 215 |
| **B** | Cada escritório | Só o próprio volume (faixa 1) | R$ 0,24 | R$ 215 a 238 |

A diferença no médio é pequena (cerca de R$ 110 por mês), mas o preço por consulta pode cair até 4 vezes no modelo A. **Decisão: modelo A** (a plataforma assina, volume somado, consumo cobrado). O custo provável do 3.4 usa a faixa 1 nos dois.

### 3.9 O que não está nos totais

Custos **fixos da plataforma**: backfill da base legal (US$ 11 mil uma vez) e manutenção (US$ 136 a 542 por mês), ciclos da DGM (US$ 755 a 6.223 por mês), GPU (R$ 2,1 mil a 4,9 mil) e infraestrutura (R$ 1,2 mil a 6 mil) nos degraus 0 a 2 do MVP, seguro e auditoria (R$ 6 por assento). Também fora: tributos sobre serviço importado além do IOF (30% a 45% sobre a API, **não confirmado**; o câmbio de R$ 7,97 embute parte deles) e os contratos dos cores (**preço não público**).

### 3.10 Custos de API do painel do cliente

O painel do cliente (o App) e os conectores consomem APIs pagas **em nome do cliente do escritório**. Cada linha abaixo é medida por cliente do escritório (ou por serviço extra ativado no app), entra no **custo** da margem de contribuição (a) e, portanto, em (b) e (c), e tem a regra de quem paga. Preços unitários verificados em 06 e 07/11/2026 (08, seção 10; 3.1).

| Linha de API | Preço unitário | Uso provável | Custo provável (baixo a alto) | Quem paga | Onde entra na calculadora |
| --- | --- | --- | --- | --- | --- |
| **Integra Contador e CNPJ** (situação fiscal, caixa postal, guias, consultas do app) | Consulta R$ 0,24 a 0,06; emissão R$ 0,32 a 0,08; declaração R$ 0,40 a 0,12; CNPJ R$ 0,6591 a 1,1717 | 70 clientes com consultas, 10 com emissão, 20 com declaração por 100 clientes (3.4) | **R$ 2,25 por cliente por mês** (1,07 a 3,80) | **Embutido no preço-base** até o teto de uso por cliente por mês (3.11); acima dele, **consumo cobrado ao escritório** a custo + 20% | Custo do módulo Conectores: governo federal; excedente na linha de consumo |
| **InfoSimples** (DTE estadual, certidões, NFS-e fora do padrão) | R$ 0,20 a 0,05 + adicional de R$ 0 a 0,10; mínimo R$ 100 por mês | 1,37 consulta-equivalente por cliente | **R$ 1,37 por cliente por mês** (0,70 a 2,50) | Embutido no preço-base até o teto (3.11); acima, consumo a custo + 20% | Custo do módulo Conectores: estaduais e municipais |
| **Distribuição de NF-e e NFS-e** (DF-e, ADN, captura) | Captura própria sem custo por nota (5.2) | | R$ 0 por cliente; o fixo de R$ 25 está no módulo federal | Embutido no plano-base | Dentro do módulo federal |
| **NFS-e emitida pelo app** (serviço extra) | Emissor Nacional R$ 0 + infra R$ 0,05 por nota; fora do padrão, Asaas R$ 0,49 por nota (Focus Solo R$ 94,90 por contrato) | 20 notas por cliente ativo | **R$ 10,80 por cliente ativo** (R$ 1 de infra + R$ 9,80 do integrador) | **Parte do serviço extra**: integrador repassado ao custo; participação de R$ 6 por cliente ativo (preço R$ 15,80, margem de linha 32%) | Complemento "NFS-e pelo app", por cliente ativo |
| **Certidões sob demanda** (serviço extra) | R$ 0,25 a 0,60 por certidão | 2 certidões por cliente ativo | **R$ 0,85 por cliente ativo** (0,25 a 2,40) | **Parte do serviço extra**: participação de R$ 1 por certidão (margem de linha 57%) | Complemento "Certidões pelo app" |
| **Open Finance** (conciliação simplificada) | Pluggy a partir de R$ 2.500 por mês (**não confirmado**); Belvo US$ 1.000 | R$ 2.500 ÷ 10 escritórios + R$ 1 por cliente conectado | **R$ 290** com 40 clientes conectados (3.7) | **Módulo à parte, cobrado do escritório** (R$ 450 + R$ 6 por cliente conectado) | Complemento Open Finance |
| **Consultor da empresa** (tokens do assistente no app) | R$ 0,12 por pergunta (7.2) | 5 a 15 perguntas por cliente ativo | **R$ 0,60 a 1,80 por cliente ativo** | **Complemento por cliente ativo** (R$ 10; franquia de 15 perguntas); o escritório ativa e fixa o preço ao cliente final | Complemento Consultor da empresa |
| **Cobrança** (Asaas R$ 1,59 por boleto ou Pix; Efí) | Tarifa do provedor | | R$ 0 para a plataforma | Conta do escritório e do cliente (08, P8) | Fora do preço e do custo |

**Totais, médio provável:** no sistema-base, a API paga é de **R$ 3,62 por cliente por mês (R$ 362 de R$ 828 de custo, 44%)**, toda ela nos dois módulos de conectores; no ponto de referência (200 clientes), R$ 724 de R$ 1.229 (59%). Com 30 clientes usando NFS-e pelo app e certidões, somam-se R$ 324 e R$ 26 de API, que voltam como receita do serviço extra (R$ 474 e R$ 60). **A maior linha de custo do sistema-base é, portanto, a API dos conectores**, e é nela que atua o teto de uso (3.11, 6.9). Se o monitoramento fiscal puder usar o e-CAC por procuração e certificado em vez do Integra pago (como o mercado parece fazer; **hipótese a verificar com a engenharia, não calculada**), o médio ganharia até R$ 215 por mês de contribuição.

### 3.11 Teto de uso dos conectores embutidos (decisão de 7/11/2026; teto apertado em 8/11/2026, P26)

**Decisão:** os conectores de governo federal e estaduais e municipais ficam **embutidos no preço-base, com teto de uso por cliente por mês**; **qualquer uso acima do teto é cobrado como extra, a custo + 20%**. O teto é do escritório (clientes × teto por cliente, somado): um cliente que consome mais compensa outro que consome menos. **Em 8/11/2026 (P26) o usuário escolheu o teto apertado: 130% do uso provável** (a v0.5 tinha 162%, "folgado"). O consumo por cliente fica visível em Gestão (GES-010, 08).

| Tipo de chamada | Preço (faixa 1, 08, 10.1) | Teto por cliente por mês (v0.7) | Custo no teto | Uso provável aproximado (08, 10.2) | Teto da v0.5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Integra: consulta | R$ 0,24 | 8 | R$ 1,92 | cerca de 6 | 10 |
| Integra: emissão | R$ 0,32 | 1,6 | R$ 0,51 | cerca de 1 | 2 |
| Integra: declaração | R$ 0,40 | 0,8 | R$ 0,32 | cerca de 1 | 1 |
| Consulta de CNPJ (Básica) | R$ 0,6591 | 0,27 | R$ 0,18 | cerca de 0,1 | 0,3 |
| **Integra e CNPJ, total** | | | **R$ 2,93** | **R$ 2,25** (teto = 130%) | R$ 3,64 (162%) |
| InfoSimples: consulta (média com adicional) | R$ 0,22 | 8,1 | **R$ 1,78** | 6,2 consultas = R$ 1,37 (teto = 130%) | 10 consultas, R$ 2,20 (161%) |

O uso provável do Integra vem do 08 (10.2): por 100 clientes, 70 do Simples a R$ 2,24, 10 MEI a R$ 0,56 e 20 do Presumido ou Real a R$ 2,64, mais o CNPJ, o que dá R$ 2,25 por cliente; a decomposição em chamadas é aproximação **[premissa]**. Os preços são os da faixa 1; no contrato A (volume somado) o custo real é menor, e o teto em chamadas continua valendo.

**Efeito.** No médio (100 clientes), o teto é de 800 consultas, 160 emissões, 80 declarações, 27 consultas de CNPJ e 810 consultas de InfoSimples por mês. **No uso baixo e no provável não há excedente.** No uso alto (R$ 3,80 e R$ 2,50 por cliente) o excedente é de R$ 0,87 e R$ 0,72 por cliente, a custo + 20%: R$ 104 + R$ 86 = **R$ 191 por mês no médio** (R$ 57 no pequeno e R$ 572 no grande; na v0.5, R$ 55 no médio). **Só o teto leva o uso alto do sistema-base do médio de −13,5% para −3,9%**; com o chat de suporte da v0.7, −7,7% (6.9).

**O risco do teto apertado: cobrar extra de quem está no provável.** O teto soma os clientes do escritório, então o extra só aparece quando o uso do escritório inteiro passa de 130% do provável. Excedente por mês no médio, a custo + 20% (soma dos dois conectores):

| Uso real do escritório, em % do provável | 100% | 120% | 130% | 150% | 175% | 200% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Excedente, teto de 130% (adotado) | R$ 0 | R$ 0 | R$ 0 | R$ 86 | R$ 195 | R$ 303 |
| Excedente, teto de 162% (v0.5) | R$ 0 | R$ 0 | R$ 0 | R$ 0 | R$ 60 | R$ 168 |

Como o uso provável é estimativa (08, 10.2), **um escritório cujo uso real fique 50% acima do estimado já paga R$ 86 por mês a mais**, 6% da mensalidade de R$ 1.376. Mitigação proposta: o consumo por cliente já aparece em Gestão (GES-010) e um aviso ao chegar a 80% do teto, antes de cobrar extra, evita a surpresa; medir o uso real nos primeiros escritórios e revisar o teto a cada trimestre (10.3).

---

## 4. Repasse, embutido e consumo

### 4.1 Classificação de cada custo

| Custo | Tratamento proposto | Regra |
| --- | --- | --- |
| Tokens dos integrantes e perguntas ao Consultor (usuários) | **Plano por usuário, com limite por janela de 5 horas e por semana** (v0.3) | A IA é produto à parte; o limite é um teto em unidades de uso (6.8). Acima dele, só uso extra avulso (pacote pré-pago) ou espera |
| Perguntas do cliente final ao Consultor (modo cliente) | **Complemento por cliente, com franquia** | R$ 10 por cliente ativo; 15 perguntas por cliente por mês (6.8.6) |
| IA por clique no CRM, transcrição, e-mail, push | **Embutido** | Centavos; sem franquia visível |
| Chat de suporte com pessoas e assistente de ajuda (v0.7, P25) | **Embutido, da plataforma, para todo usuário** | R$ 2 por assento de chat mais R$ 0,16 da ajuda (modelo pequeno com diagnóstico) por usuário (limite de 30 perguntas por mês, sem consumir UU); a hora de atendimento está no suporte de R$ 12,50 (6.8.9) |
| WhatsApp utilidade, serviço e autenticação | **Repasse ao escritório, ao custo da Meta** (decisão de 7/11/2026) | A plataforma só exibe a tarifa por categoria. Franquia embutida só se os cálculos mostrarem que cabe: cabe no provável (R$ 55 no médio, 0,6% do preço) e não no uso alto (R$ 211); mantém o repasse |
| WhatsApp marketing (comunicados) | **Repasse ao escritório, ao custo da Meta** | R$ 0,3217 por mensagem; sem margem |
| Integra, CNPJ, InfoSimples | **Embutido com teto por cliente por mês; consumo cobrado acima dele** | Contrato do SERPRO da plataforma (volume somado). Teto no valor do módulo (3.11: R$ 2,93 e R$ 1,78 de custo por cliente por mês, 130% do provável); excedente a custo + 20% (decisão de 7/11/2026) |
| Ajuda do sistema (modelo pequeno) | **Embutido, custo do sistema-base** | R$ 0,16 por usuário por mês, com o diagnóstico (6.8.8); limite de 30 perguntas por usuário por mês, com ou sem plano de IA, dentro do chat de suporte geral (6.8.9; P25, respondida em 8/11/2026) |
| NFS-e e certidões pelo app, Consultor da empresa | **Serviço extra, ativado pelo escritório por cliente; cobrado por cliente ativo** | O escritório liga o serviço para cada cliente nas configurações; a cobrança passa a valer na hora. API do integrador repassada ao custo (3.10) |
| Armazenamento da plataforma | **Opcional, cobrado por GB contratado** | Padrão de 5 GB por cliente a R$ 0,45 por GB (custo R$ 0,20); nuvem própria do escritório: R$ 0 |
| Cores | **Contrato do escritório** | A plataforma integra; parceria à parte (decisão 2 do fundador) |
| Asaas, Efí, banco | **Conta do escritório** | A plataforma não intermedeia dinheiro (08, P8) |
| Assinatura avançada, integrador de NFS-e | **Contrato do escritório** | R$ 69 a 80 por mês; Focus R$ 94,90 a 572 |
| Open Finance | **Módulo à parte, cobrado do escritório; nunca embutido** | Valor fixo mais valor por cliente conectado (6.2) |
| Serviços extras do App | **Repasse ao custo, mais participação** | Seção 7 |

### 4.2 Limites do 02 (12.2) e como os planos de IA os usam

O 02 define o **mecanismo** (janelas de 5 horas e de 7 dias por usuário, teto mensal do escritório, limite diário por integrante) e deixa os valores para este estudo. Na v0.3 os valores por usuário passam a depender do **plano de IA** (6.8); o que não depende do plano continua como defesa.

| Limite do 02 | Valor | Custo máximo (R$ 8,82/MTok) | Ao estourar (02) |
| --- | --- | ---: | --- |
| Janela de 5 horas por usuário (`limites.tokens_5h`) | Plano: 25 / 60 / 100 UU (0,25 / 0,6 / 1 MTok) | R$ 2,2 / 5,3 / 8,8 | Jobs e eventos do usuário pausam; chat e perguntas continuam |
| Janela de 7 dias por usuário (`limites.tokens_semana`) | Plano: 100 / 300 / 500 UU (1 / 3 / 5 MTok); o do Intensivo é o proposto na v0.2 | R$ 8,8 / 26,5 / 44,1 | Idem, com aviso a 80%; o chat segue em modelo barato (6.8.4) |
| Por escritório por mês (`Assinatura.limites.tokens_mes`) | Soma dos limites semanais dos planos × 4,3 semanas, mais os pacotes extras; o Administrador pode baixar | M com 15 IA Operação: 193 MTok, R$ 1.707 | Aviso a 80%; a 100% só chat e perguntas; jobs e eventos acumulam na fila |
| Por integrante por dia (`limites.tokens_dia`), defesa contra loop | 2 MTok (200 UU) em todos os planos | R$ 18 | Pausa até o dia seguinte; `alta` ao dono |
| Falhas consecutivas e cadeia entre integrantes | 3 falhas; profundidade 4 (02) | | Pausa e aviso |

O teto duro de 30 MTok por usuário por mês e a franquia de 16 MTok da v0.2 deixam de existir: o maior limite mensal possível é o do Intensivo (500 UU × 4,3 semanas = 2.150 UU = 21,5 MTok, R$ 190), abaixo dos 30 MTok. O excedente de R$ 18 por MTok vira o **uso extra avulso** (R$ 0,18 por UU, 6.8.6).

---

## 5. Referências de mercado

### 5.1 O que os concorrentes cobram

| Produto | Preço público | Unidade | Fonte |
| --- | --- | --- | --- |
| HubStrom Professional | A partir de R$ 527/mês (30 perfis, 1 número) | Por escritório | B2 |
| HubStrom Enterprise | A partir de R$ 957/mês (perfis ilimitados, 3 números) | Por escritório | B2 |
| HubStrom app com marca branca | + R$ 300/mês, ou AppHub+ R$ 9,90 por cliente/mês | Escritório ou cliente | B2 |
| Makro | R$ 0 (3 empresas); R$ 195, 295, 395, 595/mês; licença extra R$ 60 ou 90; IA (Gi) incluída | Por licença, em faixas de empresas | B2 |
| Conta Azul Mais | Portal gratuito; Pro R$ 199,90 e Pro BPO R$ 129,90 (mínimo 3 licenças); IA sem custo adicional | Por licença do cliente | B2 |
| Conta Azul ERP / Omie / Granatum | R$ 179,90 a 929,90; Omie a partir de R$ 339; Granatum R$ 396 | Por empresa | B1 |
| Nibo Gestão Financeira | R$ 166, 250, 383/mês | Por escritório | B1 |
| SIEG (captura de XML) | R$ 223, 470, 800/mês; A1 R$ 49 a 69 | Por escritório | B3 |
| Jus IA | R$ 78,90 (30 mensagens), 108,90 (150), 208,90 (ilimitado) | Por usuário | 05 |
| Nosso assistente (MVP) | Escritório R$ 790 (5 usuários, 400 perguntas); Corporativo R$ 2.290 (15 usuários, 1.050 perguntas) | Por escritório | MVP |
| Domínio Processos (ex-Gestta), Acessórias, Conexa, Alterdata, Nibo Obrigações, VERI, Jettax, e-Kontroll | **Não público** | | B2, B3; busca de 7/11/2026 |

### 5.2 A faixa do mercado e onde cada módulo nosso cai

| Peça de mercado | Faixa pública | Módulo nosso | Custo provável do médio | Posição do preço de teste no médio (seção 6) |
| --- | --- | --- | ---: | --- |
| Gestão de processos e atendimento (HubStrom, Makro) | R$ 195 a 957 por escritório | Painel + CRM + Timesheet | R$ 384 (Base, suporte e chat 311, CRM sem WhatsApp 43, Timesheet 30) | **Na faixa** (R$ 796: Painel 339, CRM 312, Timesheet 145, contra R$ 957 do HubStrom Enterprise); o Timesheet com rentabilidade não tem equivalente público |
| App com marca branca | R$ 300 por escritório ou R$ 9,90 por cliente (R$ 990 com 100 clientes) | App + marca branca (opcional) | R$ 40 | **Na faixa** (R$ 257: App 107 + marca branca 150, contra R$ 300) |
| Captura de XML e monitoramento | R$ 223 a 957 | Conectores federal e estaduais | R$ 402 | **Abaixo** (R$ 322 contra R$ 470 do SIEG); o custo de API é R$ 402 (3.10) |
| Financeiro do escritório | R$ 166 a 930 | Financeiro | R$ 18 | **Na faixa** (R$ 199); o Conexa não tem preço público |
| IA jurídica por usuário | R$ 79 a 250 | IA Essencial (chat e Consultor perguntar) | R$ 20 por usuário no uso provável (6.8.5) | **Na faixa** (R$ 79 por usuário, igual ao plano de entrada do Jus IA, com volume maior) |
| IA agêntica nos setores | Embutida ("sem custo adicional" no Makro e no Conta Azul) | IA Operação e IA Intensivo | R$ 54 e R$ 80 por usuário no uso provável | **Acima** do mercado, que não cobra por ela (R$ 189 e R$ 299 por usuário), mas **opcional e por usuário**: quem não quer IA não paga. Preço acima é aceito (decisão de 7/11/2026) |

A soma das peças públicas para um escritório de 100 clientes e 15 usuários é de **R$ 4,4 mil por mês**: HubStrom Enterprise 957 + app 300 + SIEG Flow 470 + Nibo Premium 383 + assistente Corporativo 2.290. Faltam Domínio Processos, Conexa e e-Kontroll, sem preço público.

### 5.3 Referência de mercado para o sistema-base sem IA, por escritório-tipo

A referência principal é a **HubStrom com o app de marca branca**: pelo B2, o mesmo produto entrega processos, WhatsApp, monitor do e-CAC, captura de XML (XMLHub) e app. Por isso a captura de notas (SIEG) e o financeiro (Nibo) não entram na referência principal: aparecem à parte, como o que o escritório compraria se montasse o conjunto por peças.

| R$ por mês | P (30 clientes) | M (100) | G (300) | Fonte |
| --- | ---: | ---: | ---: | --- |
| HubStrom (Professional em P; Enterprise em M e G; "a partir de") | 527 | 957 | 957 | B2 |
| App com marca branca | 300 | 300 | 300 | B2 |
| **Referência principal (HubStrom + app)** | **827** | **1.257** | **1.743** | P e M: soma. G: extrapolação a partir do ponto de 200 clientes (R$ 1.500) **[premissa; pedir cotação]** |
| Com o desconto de 20% que o usuário obteve | 662 | 1.006 | 1.394 | Se o mesmo desconto valesse nos três portes |
| Captura de notas (SIEG), se comprada à parte | 223 | 470 | 800 | B3 |
| Financeiro do escritório (Nibo) | 166 | 383 | 383 | B1 |
| Soma ampliada (HubStrom + app + SIEG + Nibo) | 1.216 | 2.110 | 2.440 | peças públicas |
| Timesheet com rentabilidade | sem equivalente público | | | B2 (só o e-Kontroll chega perto) |
| **Preço de teste do sistema-base sem IA (6.4)** | **990** | **1.376** | **2.314** | |
| Posição contra a referência principal | +20% | +9,5% | +33% | |
| Posição contra a referência com desconto | +50% | +37% | +66% | |
| Custo provável (a) | 322 | 828 | 2.214 | 3.4 e 6.4 (v0.5: 312 / 798 / 2.134, sem o chat de suporte) |

O sistema-base sem IA compreende Painel, CRM, Timesheet, App, conectores federal e estaduais e municipais e marca branca, sem armazenamento da plataforma (opcional) e sem Financeiro. Nos módulos comparáveis, o preço do médio fica na faixa do mercado (5.2). No **grande**, o preço de teste fica 33% acima da referência extrapolada **e fecha com margem de só 4,3%** (custo R$ 2.214; R$ 100 de contribuição por mês; na v0.5, sem o chat de suporte, 7,8% e R$ 180; na v0.4, com suporte de R$ 25 por assento, perdia R$ 314): cobre o custo, não paga a plataforma (6.4 e 6.9).

### 5.4 O ponto de referência do usuário: 200 clientes e 10 usuários

A HubStrom cobra cerca de **R$ 1.500 de tabela** pelo sistema "todo" nesse porte e o usuário recebeu **R$ 300 de desconto (cerca de R$ 1.200)**. Como a HubStrom oferece menos que o nosso sistema completo sem IA, o preço de teste fica **um pouco acima**, não igual.

| Nosso sistema (marca branca, sem IA, sem GB; 3 números) | Preço | Custo (a) | Margem (a) | Contra a tabela (R$ 1.500) | Contra o valor com desconto (R$ 1.200) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Núcleo comparável: Painel, CRM, App, conectores federal e estaduais, marca branca | 1.504 | 1.209 | 19,6% | +0,3% | +25% |
| **Sistema-base: núcleo + Timesheet** | **1.614** | 1.229 | **23,8%** | **+7,6%** | **+35%** |
| Sistema-base + Financeiro do escritório (quando existir) | 1.914 | 1.257 | 34,3% | +28% | +60% |

**Faixa do sistema-base nesse ponto: R$ 1.504 a 1.614 (de 0% a 8% acima da tabela e de 25% a 35% acima do preço com desconto).** O que temos a mais do que a HubStrom, pelo B2 e por este estudo:

- **Timesheet com rentabilidade por cliente** (a rentabilidade exige o Financeiro); a HubStrom não mostrou tempo medido nem rentabilidade.
- **Financeiro do escritório** (contratos, honorários, cobrança, NFS-e dos honorários), quando existir: o mercado vende à parte (Nibo R$ 166 a 383, Conexa).
- **Captura de notas e conectores federais, estaduais e municipais** dentro do preço (SIEG vende à parte por R$ 223 a 800).
- **App com marca branca, domínio e tema** (R$ 150 no complemento) e, à parte, **Consultor da empresa** e **serviços extras do app** (NFS-e, certidões).
- **IA em planos por usuário**, opcional (6.8): integrantes proativos, Consultor, MCP e ferramentas tipadas.

**O que a HubStrom tem e nós ainda não igualamos:** seis módulos maduros, mais de 6.000 escritórios, URA de IA e envio em lote (B2). O preço acima só se sustenta com o que está na lista acima entregue.

**A margem, com honestidade:** no ponto de referência o sistema-base tem **R$ 385 de contribuição (23,8%)** (v0.5: R$ 405, 25,1%; v0.4: R$ 281, 17,4%); descontado o rateio dos fixos (peso 2 escritórios médios; 30 escritórios ativos, R$ 8,2 mil), a margem **(b) é de −10,0%** e a **(c) de −22,5%** (tributos de 12,5%). **O sistema-base sozinho não paga a plataforma**; com IA Operação para 3 dos 10 usuários, o conjunto vai a 36,2% (a), 11,2% (b) e −1,3% (c).

---

## 6. Modelo escolhido: configurador modular

**Decisão de 7/11/2026:** o sistema é vendido de forma modular e o preço sai de **uma equação**, como na HubStrom: o escritório marca os módulos e o preço muda conforme clientes e usuários. As estruturas A, B e C da versão 0.1 ficam como alternativas descartadas (6.7). Todos os valores desta seção são **parâmetros de teste, não preço final de venda**. Na v0.3 a IA saiu dos módulos e é vendida em planos por usuário (6.8); na v0.4 o sistema-base foi recalibrado para o mercado (6.3) e as alavancas que o fariam fechar estão em 6.9. A calculadora está em [precificacao/configurador.html](precificacao/configurador.html) e os parâmetros em [precificacao/parametros.json](precificacao/parametros.json) (mesmos valores, para edição).

### 6.1 A equação

**Cinco entradas:** (1) módulos selecionados (sem a IA); (2) clientes atendidos, por faixa; (3) usuários; (4) **plano de IA de cada usuário** (ou bolsa compartilhada); (5) GB de nuvem da plataforma, se contratada.

```
Preço = Σ módulos m [ B_m + a_m × C_ef + u_m × U ]   (módulos selecionados, sem IA)
      + g × GB                                      (armazenamento opcional)
      + Σ planos de IA p [ n_p × P_p ]              (n_p usuários no plano p; Σ n_p ≤ U)
      + Bolsa [ B_b + b_b × UU_semana ]             (opcional, para usuários sem plano individual)
      + Σ complementos k [ F_k + v_k × Q_k ]        (Open Finance, marca branca, app na loja,
                                                     Consultor da empresa, NFS-e e certidões pelo app, BPO)
      + Consumo acima do teto                       (uso extra de IA, conectores)

C_ef = Σ faixas f [ fator_f × clientes na faixa f ]   (faixa marginal, sem saltos)
Piso: se a soma ficar abaixo de R$ 700, cobra R$ 700.
```

Em palavras: o preço é a **soma dos módulos escolhidos** mais a **soma dos planos de IA por usuário** mais os **complementos de IA** (bolsa, uso extra, Consultor da empresa). Cada módulo tem um **valor-base** (B), mais um valor que cresce com os **clientes** (a, aplicado aos clientes efetivos C_ef) e com os **usuários** (u). **A IA não depende do número de clientes**: o limite do plano de cada usuário é o teto de custo, e os eventos dos clientes consomem o limite do usuário dono do integrante. Somam-se o armazenamento e os **complementos** (Open Finance, marca branca, app na loja, Consultor da empresa, BPO), que têm valor fixo mais, quando cabe, um valor por unidade Q (cliente conectado, cliente com o serviço ativo, empresa, subescritório). Soma-se o **consumo acima do teto** (uso extra de IA e conectores acima do teto de uso, 3.11). **Não há desconto implícito:** pacote não altera a conta; é só um atalho de seleção. O custo por mensagem de WhatsApp **não entra**: vai ao escritório (6.5).

### 6.2 Parâmetros de teste

**Módulos** (R$ por mês). Preços recalibrados na v0.4 (6.3); custo provável: unidades do 3.4 e 3.5, câmbio R$ 7,97. O valor por usuário é pequeno (R$ 14 no total) porque o mercado cobra por escritório e não por usuário; a v0.3 cobrava R$ 71.

| Módulo | Base B | Por cliente a | Por usuário u | Consumo cobrado à parte | Exige | Custo provável (fixo + por cliente + por usuário) |
| --- | ---: | ---: | ---: | --- | --- | --- |
| **Painel** (pacote Contábil; traz a Base; **o pacote de área obrigatório do produto contábil**, DA-02) | 200 | 0,7 | 5 | | | 33 + 0,6 + 12,5 (suporte humano); o chat de suporte (2) e a ajuda do sistema (0,16) são linhas à parte |
| CRM | 200 | 0,9 | 2 | WhatsApp (ao escritório) | Pacote de área | 0 + 0,43 + 0 |
| Timesheet | 40 | 0 | 7 | | Pacote de área | 0 + 0 + 2 |
| App do cliente | 80 | 0,3 | 0 | | Pacote de área (chat do app exige CRM) | 5 + 0,2 + 0 |
| Conectores: governo federal | 90 | 1,4 | 0 | Consultas acima do teto (3.11: teto de R$ 2,93 de custo por cliente por mês, 130% do provável), a custo + 20% | Pacote de área | 25 + 2,25 + 0 |
| Conectores: estaduais e municipais | 40 | 0,7 | 0 | Acima do teto (R$ 1,78 de custo por cliente por mês, 130% do provável), a custo + 20% | Pacote de área | 15 + 1,37 + 0 |
| Conectores: cores | 40 | 0 | 0 | | Pacote de área | 10 + 0 + 0 |
| Financeiro | 80 | 1,3 | 0 | | Pacote de área (régua por WhatsApp exige CRM) | 16 + 0,10 + 0 |

**A IA (antigos Time de agentes e Consultor) não é mais módulo com valor por cliente e por usuário**: é vendida em planos por usuário (6.8). As nuvens do escritório (espelho do Drive, OneDrive, S3) ficam dentro da Base, sem preço próprio. Os conectores de WhatsApp e e-mail fazem parte do CRM.

**Faixas de clientes** (faixa marginal: cada cliente vale o fator da faixa em que cai; o fator multiplica só o componente por cliente a).

| Faixa | Clientes | Fator | Clientes efetivos acumulados |
| --- | --- | ---: | ---: |
| 1 | 1 a 30 | 1,00 | 30,0 |
| 2 | 31 a 60 | 0,92 | 57,6 |
| 3 | 61 a 120 | 0,85 | 108,6 |
| 4 | 121 a 250 | 0,75 | 206,1 |
| 5 | 251 a 500 | 0,65 | 368,6 |
| 6 | 501 a 1.000 | 0,55 | 643,6 |
| 7 | acima de 1.000 | 0,50 | sob proposta |

Exemplos: 30 clientes = 30,0 efetivos; **100 = 30 + 27,6 + 34,0 = 91,6**; **300 = 30 + 27,6 + 51,0 + 97,5 + 32,5 = 238,6**; 400 = 303,6.

**Armazenamento e complementos**

| Item | Preço de teste | Custo provável | Regra |
| --- | --- | --- | --- |
| Armazenamento da plataforma | R$ 0,45 por GB contratado; **padrão 5 GB por cliente** | R$ 0,20 por GB | Opcional; com a nuvem do escritório, R$ 0 |
| **Chat de suporte com pessoas** (v0.7, P25) | Incluído para todo usuário, sem preço próprio | R$ 1 / 2 / 4 por assento (ferramenta de chat e cobertura de horário; a hora de atendimento está no suporte de R$ 12,50) **[premissa a medir]** | Custo do sistema-base; da plataforma, não de um pacote de área; 6.8.9 |
| Assistente de ajuda (modelo pequeno, dentro do chat de suporte) | Incluído, sem preço próprio | R$ 0,06 / 0,16 / 0,65 por usuário (com o diagnóstico) | Custo do sistema-base; vale para todo usuário, com ou sem plano de IA; limite de 30 perguntas por usuário por mês (P25); 6.8.8 e 6.8.9 |
| Marca branca (sistema e app com marca, domínio e tema do escritório) | R$ 150 fixo (v0.3: R$ 250) | R$ 15 | Opcional; sem ela, marca e tema padrão da plataforma |
| App próprio na loja | R$ 350 fixo (+ publicação inicial, R$ 1,5 mil a 3 mil, uma vez) | R$ 240 (150 a 330) | Exige App e Marca branca |
| **Open Finance** (módulo à parte) | R$ 450 + R$ 6 por cliente conectado | R$ 250 (R$ 2.500 do agregador ÷ 10 escritórios) + R$ 1 por cliente | Exige Financeiro; nunca embutido |
| **Modo BPO entre escritórios** (extra) | R$ 490 + R$ 120 por subescritório | R$ 30 + R$ 25 por subescritório | Exige um pacote de área; fora de qualquer pacote |
| **Pacote BPO financeiro** (extra, fase 3c; v0.6) | **R$ 390 de mensalidade-base por escritório + R$ 65 por empresa incluída** (era R$ 150 + R$ 12; proposta intermediária R$ 150 + R$ 18) | R$ 30 de fixo + por empresa R$ 9 de IA (4 / 9 / 18) e R$ 3 de conector de ERP financeiro (1 / 3 / 8) **[premissa]** | Exige Financeiro e App; fora de qualquer pacote; o cliente paga o próprio ERP |
| **Planos de IA por usuário** | IA Essencial R$ 79; IA Operação R$ 189; IA Intensivo R$ 299, por usuário por mês | R$ 20 / 54 / 80 no uso provável (35% do teto) | 6.8; exige Painel |
| **Bolsa compartilhada de IA** | R$ 90 + R$ 0,65 por UU por semana | R$ 431 para 1.500 UU por semana, 15 usuários | 6.8.6 |
| **Uso extra de IA** | R$ 90 por pacote de 500 UU (R$ 0,18 por UU) | R$ 44 por pacote | 6.8.6 |
| **Consultor da empresa** (complemento por cliente) | R$ 10 por cliente com o serviço ativado pelo escritório; 15 perguntas por cliente por mês; excedente R$ 0,40 | R$ 0,60 / 1,20 / 1,80 por cliente | Exige App; o escritório vende e ativa por cliente (6.8.6) |
| **NFS-e pelo app** (serviço extra) | R$ 6 por cliente ativo + integrador repassado (R$ 0,49 por nota; 20 notas = R$ 9,80) | R$ 1 de infra + R$ 9,80 do integrador por cliente ativo | Exige App; 3.10 e 7.2 |
| **Certidões pelo app** (serviço extra) | R$ 1 por certidão (2 por cliente ativo por mês = R$ 2) | R$ 0,85 por cliente ativo | Exige App; 3.10 e 7.2 |
| Preço mínimo por escritório | R$ 700 | | Ver 6.6 |

### 6.3 Calibração (v0.4, recalculada na v0.5)

A v0.3 calibrava cada módulo para cerca de 2,5 vezes o custo e o conjunto para 60% de margem. A v0.4 inverte a lógica do sistema-base (decisão de 7/11/2026): **a margem alta fica só na IA; o sistema-base sem IA fica na faixa do mercado, um pouco acima da HubStrom**, mesmo com margem menor. Método:

1. **Custo por módulo e por unidade** conforme 3.4, 3.5 e 3.10: **todos os custos do sistema em si**, isto é, infraestrutura rateada por cliente e por usuário, suporte recorrente por assento (R$ 12,50 desde a v0.5; era R$ 25), chat de suporte com pessoas (R$ 2 por assento, v0.7), assistente de ajuda (R$ 0,16 por usuário, com o diagnóstico) e API paga do painel do cliente, **sem WhatsApp** (repassado), sem armazenamento (opcional) e sem a IA.
2. **Preço do sistema-base ancorado no mercado, não no custo** (5.3 e 5.4): o mesmo preço por escritório e por cliente que a HubStrom faz, com um valor por usuário pequeno (R$ 14: Painel 5, CRM 2, Timesheet 7) que, na v0.5, passa a cobrir o suporte por assento (R$ 12,50). Resultado: **+20% (P), +9,5% (M) e +33% (G) sobre HubStrom + app, e +7,6% no ponto de 200 clientes e 10 usuários** (R$ 1.614 contra R$ 1.500 de tabela e R$ 1.200 com desconto). O preço não mudou na v0.5; mudou o custo.
3. **Planos de IA** como na v0.3, calibrados pela utilização do teto: preço de cada plano para cerca de **70% de margem no uso provável**, margem de 60% até 54% a 56% do teto e positiva no pior caso (6.8.5).

**Resultado, médio provável (margem de contribuição; v0.7, com o chat de suporte e o teto de 130%):** **sem IA 39,9%** (v0.5: 42,0%; v0.4: 28,6%); IA Operação para 1/3 dos usuários 52,7%; IA Operação para todos 61,2%; IA Intensivo para todos 65,3%. Pequeno: 67,5% sem IA e 69,5% com IA Operação para todos. **Grande: sem IA 4,3%** (v0.5: 7,8%; v0.4: −13,5%; o custo, R$ 2.214, cabe no preço, R$ 2.314, com R$ 100 de sobra) e 55,8% com IA Operação para todos. No **uso alto** e no **pior caso** (6.4) o sistema-base do médio fica em −7,7% (v0.5: −13,5%; v0.4: −26,2%) e o do grande em −54,2% (v0.5: −72,6%): o teto de 130% devolve margem ao uso alto, mas o sistema-base segue sem folga. **A margem de 60% passa a valer só para a IA** (6.8.5 e 9.6); no conjunto do médio ela é atingida com IA Operação para todos os usuários (61,2%) e o Completo chega a 62,2% (8.1). O sistema-base segue com margem baixa, por escolha: o que fecha as contas está na IA, nas alavancas que sobram em 6.9 e nas margens (b) e (c) de 6.4 e 9.4.

### 6.4 Simulações

Escritórios-tipo (1.3). **Base de todos os cenários** = o sistema-base sem IA: Painel, CRM, Timesheet, App, conectores federal e estaduais e municipais e marca branca, **sem armazenamento da plataforma** (opcional, 6.5). Sobre ela, quatro cenários de IA: **(a) sem IA**; **(b) IA Operação para 1/3 dos usuários** (2, 5 e 13 usuários); **(c1) IA Operação para todos**; **(c2) IA Intensivo para todos**. O custo é o de sempre (infraestrutura rateada, suporte por assento, **chat de suporte (v0.7)** e assistente de ajuda incluídos; WhatsApp ao escritório). **Na v0.7 as margens trazem o chat de suporte (R$ 2 por assento) e o teto dos conectores a 130%; na v0.8, o diagnóstico de leitura na ajuda (R$ 0,16 por usuário), que só mexe no uso alto.** Margens do uso provável (IA a 35% do teto), com as **três margens** de 1.6: **(a)** contribuição; **(b)** após o rateio de R$ 8,2 mil de fixos com 30 escritórios médios equivalentes ativos (sem pró-labore; peso por clientes: P 0,3, M 1, G 3); **(c)** líquida após 12,5% de tributos e 0% de comissão (outros valores em 9.4). "Alta / pior" é a margem de contribuição no uso alto (IA a 70% do teto e demais custos altos) e no pior caso (100% do teto).

| | Preço mensal | Custo provável | (a) Contribuição | (a) alta / pior | (b) após fixos | (c) líquida | Preço por cliente | v0.3: preço (com 5 GB por cliente) |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| **P (30 clientes, 5 usuários)** | | | | | | | | |
| (a) sem IA | 990 | 322 | 67,5% | 35,3% / 35,3% | 59,2% | 46,7% | 33 | 1.681 |
| (b) IA Operação para 2 | 1.368 | 429 | 68,6% | 35,7% / 30,1% | 62,6% | 50,1% | 46 | 2.059 |
| (c1) IA Operação para 5 | 1.935 | 591 | 69,5% | 36,0% / 26,0% | 65,2% | 52,7% | 65 | 2.626 |
| (c2) IA Intensivo para 5 | 2.485 | 724 | 70,9% | 39,4% / 27,1% | 67,6% | 55,1% | 83 | 3.176 |
| **M (100 clientes, 15 usuários)** | | | | | | | | |
| (a) sem IA | 1.376 | 828 | **39,9%** | −7,7% / −7,7% | 20,0% | 7,5% | 14 | 3.263 |
| (b) IA Operação para 5 | 2.321 | 1.097 | 52,7% | 9,0% / 1,1% | 41,0% | 28,5% | 23 | 4.208 |
| (c1) IA Operação para 15 | 4.211 | 1.635 | 61,2% | 20,9% / 7,4% | 54,7% | 42,2% | 42 | 6.098 |
| (c2) IA Intensivo para 15 | 5.861 | 2.033 | 65,3% | 29,3% / 13,9% | 60,6% | 48,1% | 59 | 7.748 |
| **G (300 clientes, 40 usuários)** | | | | | | | | |
| (a) sem IA | 2.314 | 2.214 | **4,3%** | −54,2% / −54,2% | −31,1% | −43,6% | 8 | 7.193 |
| (b) IA Operação para 13 | 4.771 | 2.914 | 38,9% | −12,4% / −22,0% | 21,7% | 9,2% | 16 | 9.650 |
| (c1) IA Operação para 40 | 9.874 | 4.367 | 55,8% | 11,6% / −3,6% | 47,5% | 35,0% | 33 | 14.753 |
| (c2) IA Intensivo para 40 | 14.274 | 5.429 | 62,0% | 23,5% / 6,7% | 56,2% | 43,7% | 48 | 19.153 |

**Leitura honesta:**

1. **O sistema-base sem IA no médio tem R$ 549 de contribuição por mês (39,9%; v0.5: R$ 579, 42,0%) e, descontado o rateio dos fixos, 20,0%.** Em (c) fica em **7,5%** com tributos de 12,5% (v0.5: 9,7%; v0.4: −3,8%). No grande, o sistema-base **cobre o custo por escritório, mas só com R$ 100 de contribuição (4,3%; v0.5: R$ 180, 7,8%)**: o custo do G é dominado por R$ 500 de suporte por assento (40 × R$ 12,50; v0.4: R$ 1.000), R$ 80 do chat de suporte, R$ 1.126 dos conectores (R$ 1.086 de API) e R$ 180 de infraestrutura por cliente (3.4), contra um preço de mercado que não cresce com os usuários. Após o rateio dos fixos o grande fica em −31,1% (b) e −43,6% (c): **ainda não paga a plataforma**. No pequeno, com poucos assentos, o sistema-base fecha com folga (67,5%).
2. **A margem alta está na IA**: do sistema-base (39,9% no M) para IA Operação a 1/3 (52,7%) e para todos (61,2%), a contribuição sobe porque cada usuário com IA Operação deixa R$ 135 (R$ 189 − R$ 54).
3. **Uso alto**: no médio, o sistema-base fica em −7,7% (v0.5: −13,5%; v0.4: −26,2%) porque os custos altos (suporte de R$ 25 e chat de R$ 4 por assento, conectores a R$ 6,3 por cliente) não têm preço correspondente: só o que passa do teto dos conectores (R$ 191 por mês, com o teto de 130%; v0.5: R$ 55) é cobrado, a custo + 20%. É um teste de estresse (3.3: tudo alto ao mesmo tempo), não uma expectativa, mas mostra que o sistema-base não tem folga; só o teto de 130% leva o médio de −13,5% a −3,9%, e o chat de suporte tira mais 3,8 pontos (6.9).
4. O preço por cliente cai de R$ 33 (P) para R$ 14 (M) e R$ 8 (G) sem IA, porque a parcela por cliente é pequena e as faixas de clientes (6.2) são degressivas.

O sistema-base sem IA custa **R$ 990 / 1.376 / 2.314** (P / M / G), **de 72% a 89% menos que a Intermediária da v0.2** (R$ 3.490 / 8.712 / 21.908) e de 41% a 68% menos que o sistema-base da v0.3 (R$ 1.681 / 3.263 / 7.193, que incluía 5 GB por cliente). Nas margens "alta", os custos que não são de IA também sobem ao valor alto; a diferença entre "alta" e "pior caso" é só a IA.

**Cobertura da demanda da v0.2.** A demanda bruta de IA da v0.2 (3.3: 0,6 MTok por usuário por dia útil e 0,5 MTok por cliente) é de 239 MTok por mês no médio, ou 23.900 UU. Contra a capacidade dos planos no teto: (c1) 19.350 UU, **123%**; (c2) 32.250 UU, **74%**; (b) 6.450 UU, **175%**, porque os eventos de todos os clientes recaem sobre poucos usuários. Se essa demanda for real, a IA Operação para todos satura (os jobs pausam antes do fim da semana) e o escritório precisa de IA Intensivo, bolsa ou uso extra; com IA Intensivo para todos, a margem de contribuição do médio a 74% de utilização do teto é de 46,4% (a 60%, 53,2%). A demanda da v0.2 nunca foi medida: é a primeira coisa a medir no piloto (10.3).

**Conta do médio, (b) IA Operação para 5 usuários** (91,6 clientes efetivos, 15 usuários):

| Linha | Conta | Preço | Custo |
| --- | --- | ---: | ---: |
| Painel | 200 + 0,7 × 91,6 + 5 × 15; custo 33 + 0,6 × 100 + 12,5 × 15 | 339 | 281 |
| CRM | 200 + 0,9 × 91,6 + 2 × 15 | 312 | 43 |
| Timesheet | 40 + 7 × 15 | 145 | 30 |
| App | 80 + 0,3 × 91,6 | 107 | 25 |
| Conectores federal | 90 + 1,4 × 91,6 (custo inclui R$ 225 de API) | 218 | 250 |
| Conectores estaduais e municipais | 40 + 0,7 × 91,6 (custo inclui R$ 137 de API) | 104 | 152 |
| Marca branca | fixo | 150 | 15 |
| Chat de suporte com pessoas (v0.7) | 15 usuários × R$ 2; sem receita própria | 0 | 30 |
| Ajuda do sistema | 15 usuários × R$ 0,159 (com o diagnóstico, v0.8); sem receita própria | 0 | 2 |
| **IA Operação, 5 usuários** | 5 × R$ 189; custo 5 × (0,35 × 1.290 UU × R$ 0,0882 + 14) = 5 × 53,8 | 945 | 269 |
| **Total** | | **2.321** | **1.097** |

**Três margens do mesmo escritório** (30 escritórios ativos, sem pró-labore):

| Nível | Conta | R$ por mês | Margem |
| --- | --- | ---: | ---: |
| (a) Contribuição | 2.321 − 1.097 | 1.224 | 52,7% |
| (b) Após fixos rateados | 1.224 − 8.200 × 1 ÷ 30 (273) | 951 | 41,0% |
| (c) Líquida, tributos de 12,5% | 951 − 0,125 × 2.321 (290) | 661 | 28,5% |
| (c) com 8% / 17% | 951 − 186 / 951 − 395 | 765 / 556 | 33,0% / 24,0% |
| (c) com comissão de 10% (mais R$ 232) | | 533 a 324 | 23,0% a 14,0% |

**Comparação com o mercado.** Preço ÷ referência principal (HubStrom + app, 5.3), sistema-base sem IA: **1,20 / 1,09 / 1,33** (P / M / G). Preço ÷ soma de todas as peças públicas, incluindo o assistente do MVP (5.1; P 2.006, M 4.400, G 8.540): **(b) 0,68 / 0,53 / 0,56; Completo 1,06 / 1,05 / 1,28** (8.1). A diferença do Completo para a soma de mercado equivale a 1,2 / 2,4 / 24 horas de trabalho por mês a R$ 100 por hora (mapa L2: 22 horas por cliente por mês, 660 / 2.200 / 6.600 horas) **[premissa; medir pelo GES-056]**: bastam 0,1% a 0,4% de horas liberadas para pagar o prêmio. Se os integrantes liberarem 5% a 10% do trabalho (110 a 220 horas no médio), o valor é de R$ 11 mil a 22 mil por mês.

### 6.5 Como a equação trata cada tema

| Tema | Tratamento | Números (provável, salvo indicação) |
| --- | --- | --- |
| **IA** | Planos por usuário (IA Essencial, Operação, Intensivo), com limite por janela de 5 horas e por semana em unidades de uso (UU); bolsa compartilhada opcional; uso extra avulso a R$ 90 por 500 UU; Consultor da empresa como complemento por cliente (6.8) | M, IA Operação para 5 usuários: R$ 945, custo R$ 269 (margem de linha 71,5%); uso extra de 2 pacotes: R$ 180, custo R$ 88 (51%) |
| **Mensagens de WhatsApp** | **Fora da equação. O custo por mensagem vai ao escritório**, ao custo da Meta; a plataforma só exibe a tarifa por categoria (utilidade, serviço, autenticação R$ 0,035; marketing R$ 0,3217; 1.000 de serviço grátis por número). Franquia embutida: **caberia no provável** (R$ 11 no P, 55 no M, 234 no G, 0,6% do preço do M) **mas não no uso alto** (R$ 49, 211 e 704), e a decisão é repassar | O configurador mostra a estimativa em quadro separado, fora da mensalidade e da margem |
| **GB de nuvem** | Opcional; R$ 0,45 por GB contratado; padrão 5 GB por cliente; quem usa a nuvem própria não paga | M: 500 GB = R$ 225, custo R$ 100 (margem 55,6%); P R$ 68; G R$ 675 |
| **Open Finance** | Módulo à parte, cobrado do escritório, nunca embutido; exige Financeiro | M com 40 clientes conectados: 450 + 6 × 40 = **R$ 690**, custo R$ 290 (250 de rateio do contrato + 40), margem de linha 58,0% |
| **App e marca branca** | App é módulo; marca branca é complemento opcional (R$ 150; v0.3: R$ 250); sem ela, sistema e app usam a marca e o tema padrão da plataforma. App próprio na loja é outro complemento (R$ 350) | App na loja: custo R$ 240, margem de linha 31,4%, a menor do conjunto (custo de terceiros). Acima do HubStrom (R$ 300): aceito |
| **Modo BPO entre escritórios** (extra) | Complemento: R$ 490 + R$ 120 por subescritório (tema, domínio e app de cada um, isolamento de dados). **A faixa soma os clientes de todos os subescritórios** (P10). A mãe contrata e paga os módulos uma vez; cada subescritório é um inquilino separado nos dados (Fundações 2.2) | Mãe com 4 subescritórios, 400 clientes (303,6 efetivos), 10 usuários, Operação sem IA + marca branca + 2.000 GB + **IA Intensivo para os 10 usuários**: **R$ 7.014**, custo R$ 3.533, margem de contribuição **49,6%** (baixo 78,7%, alto 9,9%, pior caso 1,9%; v0.5: 49,9%, 3,8% e −4,8%). Com IA Operação: R$ 5.914, 44,8%; sem IA: R$ 4.024, 32,2%. Na v0.3: R$ 10.002 (63,6%); na v0.2: R$ 16.075 (65,0%) |
| **Pacote BPO financeiro** (extra; v0.6) | R$ 390 de mensalidade-base + R$ 65 por empresa incluída, as duas partes ajustáveis no configurador; fora dos pacotes (10.4) | 10 empresas: R$ 1.040, custo R$ 150, margem de linha 85,6%; 40 empresas: R$ 2.990, custo R$ 510, margem de linha 82,9% (a margem de linha alta paga o desenvolvimento e a manutenção dos conectores de ERP, que não entram no custo variável) |
| **Consultor da empresa** (complemento por cliente) | R$ 10 por cliente com o serviço **ativado pelo escritório** (a venda ao cliente final e o preço a ele são do escritório); franquia de 15 perguntas por cliente por mês; excedente R$ 0,40 por pergunta; exige App, não exige plano de IA dos usuários (6.8.6) | M com 40 clientes ativos: R$ 400, custo R$ 48 (margem de linha 88%) |
| **NFS-e e certidões pelo app** (serviços extras, por cliente ativo) | R$ 6 por cliente ativo de NFS-e mais o integrador repassado ao custo; R$ 1 por certidão. Ativados pelo escritório por cliente (3.10 e 7.2) | M com 30 clientes ativos de cada: NFS-e R$ 474, custo R$ 324 (margem de linha 31,6%); certidões R$ 60, custo R$ 25,50 (57,5%) |
| **Consultas do governo** | Embutido no valor do módulo até o teto por cliente por mês (3.11); o que passar é consumo cobrado a custo + 20%. O contrato com o SERPRO é da plataforma (volume somado) | M provável: excedente R$ 0; uso alto: cobra R$ 191 (a parte acima do teto de 130%; v0.5: R$ 55). Com teto menor ou tudo como consumo, o consumo vira receita (6.9) |

No BPO, poucos usuários atendem muitos clientes: a demanda bruta da v0.2 (10 usuários e 400 clientes) é de 32.600 UU por mês contra 21.500 UU de capacidade do Intensivo (152%). Faltam 11.100 UU: 23 pacotes de uso extra (R$ 2.070 por mês, margem de linha 51%) ou uma bolsa. O limite do plano é o teto de custo; a diferença vira receita só se o Administrador comprar uso extra, e o que ele não comprar fica na fila. A equação acompanha o BPO sem trocar de estrutura.

### 6.6 Vantagens, riscos e regras de proteção

**Vantagens**
- Cumpre a decisão modular: o escritório compra só o que usa e cada linha é comparável à peça do concorrente.
- O preço cresce com os dois geradores de custo: **usuários** (IA) e **clientes** (Integra, InfoSimples, eventos).
- Serve a escritório de equipe grande e a BPO (que a estrutura B não atendia) e dispensa pacote fechado.
- **A IA é opcional e por usuário:** quem não quer IA não paga; um escritório pode ter 3 usuários com IA Intensivo e 12 sem IA. O sistema-base sem IA cai de R$ 8.712 (v0.2) para R$ 1.376 no médio, um pouco acima da HubStrom (5.3).
- **A margem alta fica na IA** (60% a 70% no uso provável, 6.8.5 e 9.6) e cada plano tem um teto de custo por usuário: o Completo do médio tem 62,2% de contribuição no provável e 10,9% no pior caso (positiva nos três; **no G, só 0,6% no pior caso**; v0.5: −1,6%).

**Riscos**
- **Complexidade de explicar:** 10 módulos, 7 faixas e complementos. Mitigação: o escritório vê só quatro entradas, os atalhos Essencial, Operação e Completo e a calculadora; a tabela das faixas fica no contrato.
- **Escritório que compra só o mínimo:** o Painel sozinho vale R$ 339 no médio contra custo de R$ 313 (suporte de R$ 12,50 e chat de R$ 2 por assento); o piso de R$ 700 o leva a 55,3% no médio e **não salva o grande** (custo R$ 799, −14,1%; v0.5: −2,7%). O atalho Essencial tem 65,8% / 35,5% / −3,4% (P / M / G, 8.1).
- **O sistema-base não paga a plataforma sozinho:** margem de contribuição de 39,9% no médio e 4,3% no grande (6.4), equilíbrio com 15 escritórios médios só de sistema-base, contra 4 com IA Operação para todos (9.4). A IA é o que sustenta o negócio; vender só o sistema-base em volume não fecha sem as alavancas que sobram em 6.9.
- **Utilização do teto é premissa:** a margem de 70% supõe que o usuário médio use 35% do teto. O preço mantém 60% de margem até 54% a 56% do teto (6.8.5); acima disso a margem cai, mas nunca passa do teto de custo por usuário. A proteção depende de **medir UU por usuário no piloto** (9.1).
- **Demanda da v0.2 acima da capacidade da IA Operação:** se o uso do 0.2 for real, a IA Operação para todos satura (123% no médio). O escritório sobe para Intensivo, bolsa ou uso extra, ou os jobs pausam; é risco de percepção, não de margem.
- **Margens desiguais por linha:** no médio, os conectores (−15% e −46%) ficam **abaixo do custo**, o Painel fica em 17% (v0.4: −38%) e CRM, Timesheet, App e marca branca ficam entre 77% e 90%; é um subsídio cruzado dentro do conjunto, igual ao do mercado (um preço por escritório). Quem olha só os conectores pode achar a conta arbitrária. Mitigação: mostrar o preço por módulo e a margem só internamente.
- **Preço acima do mercado:** o sistema-base fica 9,5% acima (M) e 20% (P) da referência HubStrom + app e o Completo 1,05 a 1,28 vez a soma das peças públicas (6.4); a IA, sem peça equivalente, fica acima do mercado por decisão. Aceito, mas exige a prova das horas liberadas.

**Regras de proteção**
1. **Preço mínimo por escritório:** R$ 700 (o pequeno só com o Painel cairia em R$ 246).
2. **Pacote de área obrigatório (hoje o Painel contábil; pelo menos um, DA-02)** e **dependências automáticas (só as técnicas; as recomendadas são desmarcáveis, subplano 10, P6):** marcar um módulo marca o que ele exige; desmarcar um módulo desmarca quem depende dele (tabela 6.2).
3. **Teto de uso:** janelas de 5 horas e 7 dias por plano, limite diário por integrante e teto mensal do escritório (4.2); acima do teto, só uso extra avulso a R$ 0,18 por UU, autorizado pelo Administrador.
4. **Consumo cobrado** nos conectores acima do teto (custo + 20%) e no uso extra de IA.
5. **Revisão dos parâmetros** a cada trimestre com tokens, horas e custos medidos; contrato com revisão de preço.
6. **Extras fora dos pacotes:** Open Finance, Modo BPO, BPO financeiro e app na loja só por seleção explícita.

### 6.7 Alternativas descartadas

**A: por módulo, com valor por cliente acima de 50.** Cada módulo tinha um fixo (R$ 390 a 690, com 50 clientes e usuários ilimitados) mais valor por cliente acima de 50. No médio, tudo contratado: R$ 8.462, margem de 54%. Descartada porque o preço não acompanha o número de usuários, que é o que mais consome IA, e porque o pequeno pagava a soma dos fixos (R$ 3.802 por 30 clientes). O que ficou: preço por módulo.

**B: por usuário (assento), com módulos como adicionais.** Assento base de R$ 149 mais adicionais por usuário. No médio: R$ 10.207, margem de 62%. Descartada porque o assento base obriga a comprar um conjunto (não é modular), estimula login compartilhado e não serve ao BPO, que tem poucos usuários e muitos clientes. O que ficou: o componente por usuário.

**C: por cliente atendido, em faixas, com módulos por nível.** Níveis Essencial, Operação e Completo a R$ 26 a 90 por cliente. No médio, Completo: R$ 8.360, margem de 54%. Descartada porque o nível é um pacote fechado, que contraria a venda modular, e a faixa por cliente inteiro cria saltos. O que ficou: as faixas de clientes (agora marginais) e os níveis como atalhos de seleção.

### 6.8 IA em planos por usuário

**Decisão de 7/11/2026:** a IA é produto à parte, vendido em planos por usuário com limites diferentes, no estilo dos serviços de IA por assinatura (limite por janela de 5 horas e limite semanal). Já decidido antes e mantido: quando o limite acaba, os **trabalhos automáticos** dos integrantes (jobs e eventos) **pausam**, e **o chat e as perguntas continuam**; o Colaborador vê a **porcentagem usada** do próprio limite, não tokens; Gestor e Administrador veem o custo. Os valores são **parâmetros de teste**. Para não confundir com os atalhos (Essencial, Operação, Completo), os planos aparecem sempre como "IA Essencial", "IA Operação" e "IA Intensivo".

#### 6.8.1 Unidade de uso (UU) e conversão em tokens

**1 UU = 10 mil tokens** (entrada nova, leitura de cache e saída somadas, como o 02 conta). Custo por UU = 10 mil × R$ 8,82 por MTok (3.1) = **R$ 0,0882** (R$ 0,0608 no uso baixo, com mais modelo barato). O preço médio de R$ 8,82 é cerca de 30% mais conservador que a soma das execuções (3.2).

| Ação | Tokens (02, 13; 07, 10.1) | UU | Custo a R$ 0,0882 por UU |
| --- | --- | ---: | ---: |
| Pergunta simples no chat Geral | 15 mil | 1,5 | R$ 0,13 |
| Pergunta ao Consultor (`legal.consultar`) | 15 a 30 mil | 2,5 | R$ 0,22 |
| Turno de chat com ação (3 a 5 ferramentas) | 40 a 70 mil | 5,5 | R$ 0,49 |
| Evento simples (documento classificado) | 15 mil | 1,5 | R$ 0,13 |
| Evento com trabalho (pedido implícito) | 40 a 60 mil | 5 | R$ 0,44 |
| Job sobre a carteira (60 clientes) | 60 a 100 mil | 8 | R$ 0,71 |
| Parecer (`parecer.rascunhar`) | 40 a 80 mil + 3 a 5 mil | 7,5 | R$ 0,66 |
| Checagem sem modelo (job ou evento vazio) | 0 | 0 | R$ 0 |

#### 6.8.2 Os planos

| | **Sem IA** | **IA Essencial** | **IA Operação** | **IA Intensivo** |
| --- | --- | --- | --- | --- |
| Chat Geral e perguntas | não | sim | sim | sim |
| Consultor: modo perguntar | não | sim | sim | sim |
| Consultor: parecer | não | não | sim | sim |
| Integrantes sob demanda (pelo chat) | não | sim | sim | sim |
| Integrantes proativos (jobs e eventos) | não | não | sim | sim |
| Vigilância e revisão de enquadramento | não | não | sim | sim |
| Segunda opinião (revisão por segundo integrante) | não | não | não | sim |
| **Limite por janela de 5 horas** | | 25 UU = 0,25 MTok | 60 UU = 0,6 MTok | 100 UU = 1 MTok |
| **Limite por 7 dias** | | 100 UU = 1 MTok | 300 UU = 3 MTok | 500 UU = 5 MTok |
| Máximo por mês (7 dias × 4,3) | | 430 UU = 4,3 MTok | 1.290 UU = 12,9 MTok | 2.150 UU = 21,5 MTok |
| Custo no teto (R$ 0,0882 por UU) | | R$ 37,9 | R$ 113,8 | R$ 189,6 |
| Um dia útil equivale a (limite semanal ÷ 5) | | 20 UU: 8 perguntas simples e 3 ao Consultor | 60 UU: 15 perguntas simples, 3 eventos com trabalho, 2 jobs e 2 ao Consultor | 100 UU: 20 turnos simples, 6 eventos com trabalho, 4 jobs e 3 ao Consultor |
| **Preço de teste por usuário por mês** | R$ 0 | **R$ 79** | **R$ 189** | **R$ 299** |

O IA Intensivo usa os limites propostos para o 02 na v0.2 (1 MTok por 5 horas e 5 MTok por 7 dias); o usuário intenso do 02 (1,5 a 2,5 MTok por dia, 150 a 250 UU) passa do Intensivo (100 UU por dia): para ele, o limite pausa os jobs e o excedente é uso extra. O IA Operação é 60% do Intensivo; o IA Essencial, 20%. **Usuário sem plano** usa o sistema normalmente (Painel, CRM, Timesheet), e a IA por clique do CRM (tom, resumo, triagem) segue embutida no CRM; só não conversa com a IA dos integrantes; a ajuda sobre o próprio sistema (modelo pequeno, 6.8.8) segue disponível. Pode ver e aprovar os cartões que os integrantes de colegas produzem, se tiver permissão.

#### 6.8.3 Conversão para o usuário

O Colaborador não vê tokens nem UU: vê duas barras, "janela de 5 horas: 40% usado" e "semana: 25% usado". O Gestor e o Administrador veem as UU consumidas por usuário, por integrante e por cliente, e o custo em reais.

#### 6.8.4 Comportamento ao atingir o limite

| Situação | O que pausa | O que continua |
| --- | --- | --- |
| Janela de 5 horas cheia | Jobs e eventos do usuário, até a janela liberar | Chat e perguntas, no modelo normal (contam na semana) |
| Limite de 7 dias cheio (aviso a 80%) | Jobs e eventos do usuário | Chat e perguntas **em modelo mais barato**, com reserva de 30 UU por dia (proposta; pergunta P17) |
| Teto mensal do escritório (aviso a 80%) | Jobs e eventos acumulam na fila e rodam quando renova | Chat e perguntas |
| Limite diário do integrante (2 MTok = 200 UU) | O integrante, até o dia seguinte; `alta` ao dono | Os demais integrantes |
| Uso extra comprado | Nada: libera jobs e eventos até o pacote acabar | |

A reserva de chat em modelo barato custa no máximo 30 UU × R$ 0,006 (R$ 0,60 por MTok) × 30 dias = **R$ 5,4 por usuário por mês**, contados no pior caso. O consumo de um integrante (job, evento) é debitado do usuário dono dele; um integrante proativo só roda se o dono tiver IA Operação, IA Intensivo ou bolsa.

#### 6.8.5 Custo e margem com utilização realista

Como nos planos de ferramentas de código, o limite é um teto, e o usuário médio usa parte dele. **Premissas de utilização do teto [premissa, medir no piloto]:**

| Perfil | Utilização do teto de 7 dias | Base |
| --- | ---: | --- |
| Baixo | 15% | Usuário ocasional |
| **Provável** | **35%** | Uso regular; é o caso do preço |
| Alto | 70% | Cerca da demanda da v0.2 (0,6 MTok por dia útil) somada aos eventos; custos de infraestrutura e demais custos também altos |
| **Pior caso** | **100%** | Teto todo mês, mais a reserva de chat em modelo barato e infraestrutura alta |

Custo por usuário por mês = utilização × limite mensal em UU × R$ 0,0882 (R$ 0,0608 no baixo) + infraestrutura do assistente por usuário (3.3: R$ 5 / 14 / 40; no Essencial R$ 3 / 7 / 20, por não ter jobs) + reserva de chat (R$ 5,4, só no pior caso).

| Plano (preço) | Baixo 15% | Provável 35% | Alto 70% | Pior caso 100% |
| --- | ---: | ---: | ---: | ---: |
| **IA Essencial (R$ 79)**, custo | 0,15 × 430 × 0,0608 + 3 = 6,9 | 0,35 × 430 × 0,0882 + 7 = 20,3 | 0,70 × 430 × 0,0882 + 20 = 46,5 | 430 × 0,0882 + 20 + 5,4 = 63,3 |
| margem | 91,2% | **74,3%** | 41,1% | 19,8% |
| **IA Operação (R$ 189)**, custo | 0,15 × 1.290 × 0,0608 + 5 = 16,8 | 0,35 × 1.290 × 0,0882 + 14 = 53,8 | 0,70 × 1.290 × 0,0882 + 40 = 119,6 | 1.290 × 0,0882 + 40 + 5,4 = 159,2 |
| margem | 91,1% | **71,5%** | 36,7% | 15,8% |
| **IA Intensivo (R$ 299)**, custo | 0,15 × 2.150 × 0,0608 + 5 = 24,6 | 0,35 × 2.150 × 0,0882 + 14 = 80,4 | 0,70 × 2.150 × 0,0882 + 40 = 172,7 | 2.150 × 0,0882 + 40 + 5,4 = 235,0 |
| margem | 91,8% | **73,1%** | 42,2% | 21,4% |

Com a infraestrutura provável (R$ 14), o preço mantém margem de 60% até **65% (Essencial), 54% (Operação) e 56% (Intensivo)** de utilização do teto, e de 50% até 86%, 71% e 72%. Preço do Essencial ancorado no plano de entrada do Jus IA (R$ 79, 5.1); Operação e Intensivo a cerca de R$ 0,60 por UU de limite semanal, com desconto de volume no Intensivo. No médio, com IA Operação ou Intensivo para todos, a margem de contribuição do escritório inteiro (sistema-base incluído) é de 51,8% ou 53,7% a 60% de utilização do teto e de 46,1% ou 46,9% a 74% (a demanda da v0.2 no Intensivo); a margem da IA isolada, com todos os custos de IA, está em 9.6.

#### 6.8.6 Regras do escritório

1. **Plano por usuário.** O Administrador atribui o plano a cada usuário (Sem IA, Essencial, Operação, Intensivo) e pode mudá-lo: subir vale na hora, com cobrança proporcional; descer vale no ciclo seguinte. Exemplo no médio: 3 usuários com IA Intensivo e 12 sem IA = 3 × R$ 299 = **R$ 897**, custo R$ 241 (provável), total do escritório R$ 2.273 (contribuição de 54,3%), contra R$ 4.211 se os 15 usassem IA Operação (61,9%).
2. **Bolsa compartilhada (opcional).** Para escritórios que não querem contas individuais: um **pool semanal de UU** dividido entre os usuários sem plano individual, com os recursos da IA Operação e limite de 60 UU por usuário a cada 5 horas, para um usuário não esgotar o pool. Preço de teste: **R$ 90 + R$ 0,65 por UU por semana**. Custo: infraestrutura R$ 15 / 30 / 60 por escritório mais R$ 2 / 4 / 10 por usuário, mais a utilização do pool, **premissa de 60% no provável** (30% no baixo, 85% no alto, 100% no pior caso), maior que a do plano individual porque o escritório dimensiona o pool pela necessidade e não paga teto ocioso por pessoa.

   | Bolsa (UU por semana; usuários) | Preço | Custo provável | Margem baixo / provável / alto / pior caso |
   | --- | ---: | ---: | --- |
   | 500 (5 usuários) | 415 | 164 | 84,5% / 60,5% / 34,7% / 21,3% |
   | 1.000 (10) | 740 | 298 | 84,7% / 59,8% / 34,8% / 19,8% |
   | 1.500 (15) | 1.065 | 431 | 84,7% / 59,5% / 34,9% / 19,3% |
   | 4.000 (40) | 2.690 | 1.100 | 84,8% / 59,1% / 35,0% / 18,5% |

   Conta de 1.500 UU: preço 90 + 0,65 × 1.500 = 1.065; custo 30 + 4 × 15 + 0,60 × 1.500 × 4,3 × 0,0882 = 30 + 60 + 341 = 431. Para os 15 usuários do médio, a bolsa (R$ 1.065, 1.500 UU por semana) custa 62% menos que 15 IA Operação (R$ 2.835, 4.500 UU por semana) e **34% menos por UU efetivamente usada** (R$ 1,18 contra R$ 1,80 por UU por semana usada, com 60% e 35% de utilização). Em troca, o pool é menor e os jobs pausam mais cedo.
3. **Uso extra avulso.** Pacote pré-pago de **500 UU por R$ 90** (R$ 0,18 por UU, os R$ 18 por MTok da v0.2), custo R$ 44,1 (margem 51%), válido por 30 dias. Só entra quando o limite do plano ou da bolsa acabou; **só o Administrador compra**, e fixa um teto mensal de pacotes (padrão: zero). Conta contra o teto mensal do escritório.
4. **Consultor da empresa (complemento por cliente).** Serviço do App, separado dos planos: as perguntas do cliente final ao Consultor (modo cliente). **R$ 10 por cliente com o serviço ativo**, franquia de **15 perguntas por cliente por mês**, excedente R$ 0,40 por pergunta; o preço é a participação fixa já decidida em 7.2 (P9). Custo R$ 0,12 por pergunta (7.2): R$ 0,60 / 1,20 / 1,80 por cliente com 5 / 10 / 15 perguntas, margem de linha 94% / 88% / 82%. Os tokens ficam na conta do cliente, não nos limites dos usuários. Exige App; não exige plano de IA.
   **Como a venda funciona (decisão de 7/11/2026):** o Consultor da empresa é o assistente de IA dentro do app do cliente do escritório; responde dúvidas sobre a própria empresa dele (guia, prazo, situação). **A venda ao cliente final é feita pelo próprio escritório**: ele só **ativa a funcionalidade para aquele cliente nas configurações do sistema** e a cobrança da plataforma ao escritório, **por cliente ativo**, passa a valer automaticamente (cliente ativado = linha cobrada, proporcional ao mês). O **preço ao cliente final é definido pelo escritório** (a referência de R$ 29 a 79 em 7.2 é só sugestão). Na calculadora, o campo "clientes com o Consultor da empresa ativado" gera essa linha.
5. **Defesas que continuam:** limite diário por integrante (2 MTok), teto mensal do escritório (soma dos planos × 4,3 semanas, que o Administrador pode baixar), 3 falhas consecutivas e cadeia entre integrantes de profundidade 4 (4.2). Os eventos dos clientes consomem o limite do usuário dono do integrante: um escritório com poucos usuários com IA e muitos clientes enche o limite e deixa eventos na fila (BPO, 6.5).

#### 6.8.7 O que mudou na equação

A IA deixa de ser um módulo com componente por cliente (R$ 12) e por usuário (R$ 290, mais o Consultor a R$ 55): é a **soma dos planos por usuário** (mais bolsa) **e dos complementos de IA** (uso extra e Consultor da empresa). O resto da equação (módulos, faixas de clientes, GB, complementos, piso de R$ 700, consumo dos conectores) continua. No médio, a IA da v0.2 (Time de agentes R$ 5.449 e Consultor R$ 988) dava R$ 6.437; agora vai de R$ 0 (sem IA) a R$ 2.835 (IA Operação para todos) ou R$ 4.485 (IA Intensivo para todos).

#### 6.8.8 Ajuda do sistema (modelo pequeno)

**Decisão de 7/11/2026:** quando o usuário pergunta ao Assistente uma dúvida **sobre o próprio sistema** (como fazer algo, onde fica), um **modelo pequeno e barato** responde, com uma **base de conhecimento do produto** (trechos da documentação recuperados por busca). Se não souber, ou ao atingir o limite mensal, encaminha para a equipe pelo chat de suporte (6.8.9). É **custo do sistema-base**, sem receita própria, e é o que permite baixar o suporte humano por assento (3.3, 6.9). Pergunta de ajuda não consome UU.

| | Baixo | Provável | Alto |
| --- | ---: | ---: | ---: |
| Perguntas por usuário por mês | 4 | 10 | 30 |
| Tokens por pergunta (pergunta + trechos da base + resposta) | 5 mil | 8 mil | 15 mil |
| Tokens por usuário por mês | 20 mil | 80 mil | 450 mil |
| Preço do modelo pequeno (US$ 0,075 por MTok na mistura de 3.1 × R$ 7,97) | R$ 0,598 por MTok | idem | idem |
| Tokens, R$ por usuário por mês | 0,012 | 0,048 | 0,269 |
| Infraestrutura (busca vetorial e registro), R$ por usuário por mês | 0,05 | 0,10 | 0,20 |
| **Custo por usuário por mês** | **R$ 0,06** | **R$ 0,15** | **R$ 0,47** |

Conta do provável: 10 perguntas × 8 mil tokens = 80 mil tokens = 0,08 MTok × R$ 0,598 = R$ 0,048, mais R$ 0,10 de infraestrutura = **R$ 0,148**. Por escritório: P (5 usuários) R$ 0,7; M (15) R$ 2,2; G (40) R$ 5,9 no provável (R$ 2,3, R$ 7,0 e R$ 18,8 no alto). Uma pergunta de ajuda custa cerca de R$ 0,015; cinco minutos de suporte humano custam R$ 7,50 (R$ 90 por hora): a ajuda se paga se evitar um atendimento a cada 500 perguntas **[premissa a medir]**. O custo do modelo pequeno é só 1,2% do suporte humano de R$ 12,50 por assento, e por isso o ganho está todo na redução do suporte, não no custo da ajuda.

**P25, respondida em 8/11/2026:** o assistente de ajuda fica disponível **para todo usuário, com ou sem plano de IA**, com limite de **30 perguntas por usuário por mês** (hipótese); a pergunta de ajuda é roteada ao modelo pequeno e **não consome UU**. Ele passa a fazer parte do **chat de suporte geral** da plataforma (6.8.9). Custo máximo, no limite: R$ 0,47 por usuário por mês.

**Diagnóstico de leitura (decisão de 8/11/2026, Q9 do 10).** O assistente passa a **ler configurações, dados e estrutura do escritório, só pelo escopo de quem perguntou**, e não altera nada sem aprovação (a correção vira cartão). Custo novo: **poucas chamadas de leitura por pergunta de diagnóstico**, cada uma devolvendo ao modelo um resultado resumido.

| Premissa nova **[a medir]** | Baixo | Provável | Alto |
| --- | ---: | ---: | ---: |
| Perguntas que viram diagnóstico | 10% | 20% | 40% |
| Chamadas de leitura por diagnóstico | 2 | 3 | 5 |
| Tokens de resultado por chamada | 2 mil | 3 mil | 5 mil |
| Tokens extras por diagnóstico | 4 mil | 9 mil | 25 mil |
| Perguntas com diagnóstico por usuário por mês | 0,4 | 2 | 12 |
| Tokens extras por usuário por mês | 1,6 mil | 18 mil | 300 mil |
| **Custo extra, R$ por usuário por mês** (× R$ 0,598 por MTok) | **0,001** | **0,011** | **0,18** |
| **Custo da ajuda com diagnóstico** | R$ 0,06 | **R$ 0,16** | **R$ 0,65** |

Por escritório no provável: P R$ 0,05; M R$ 0,16; G R$ 0,43 a mais por mês (no alto: R$ 0,9, R$ 2,7 e R$ 7,2). **Quanto muda:** o total de suporte do provável vai de R$ 14,65 para R$ 14,66 por assento; a margem de contribuição não muda na primeira casa decimal (menos de 0,02 ponto), e no pior caso (G, alto) cai cerca de 0,3 ponto. As leituras no banco do escritório cabem na infraestrutura já rateada (R$ 0,10 por usuário). A **sessão de tela com a equipe** (6.8.9) não tem custo novo: a hora de atendimento já está nos R$ 12,50 e a ferramenta de compartilhar a tela vem na licença do chat dos R$ 2, sem gravação nem armazenamento **[premissa a medir]**. **Desde a v0.8, os totais do estudo e a calculadora já trazem o acréscimo** (R$ 0,16 provável e R$ 0,65 alto); `parametros.json` tem o campo `ajuda.diagnostico` (percentual das perguntas, chamadas e tokens por chamada). Efeito no sistema-base sem IA, margem de contribuição (P / M / G): provável −0,005 / −0,012 / −0,019 ponto (67,5% / 39,9% / 4,3%, sem mudança na primeira casa); uso alto −0,09 / −0,17 / −0,25 ponto (35,3% / −7,7% / −54,2%).


#### 6.8.9 Suporte geral: chat com pessoas e assistente de ajuda (decisão de 8/11/2026, P25)

**Decisão:** o sistema tem um **chat de suporte geral com pessoas** (a equipe da plataforma) e, dentro dele, **incluído**, um **assistente de ajuda padrão e bem barato**, que responde **só sobre o sistema e as configurações dele**, com **limite básico de perguntas por mês** (hipótese: 30). Vale para **todo usuário**, inclusive quem não tem plano de IA, e **não consome o limite do plano de IA**; ao atingir o limite, encaminha para a equipe. É da **plataforma**, não de um pacote de área, e não tem preço próprio: entra no custo do sistema-base. O assistente de ajuda **não é um integrante do usuário** (02): usa modelo pequeno, base de conhecimento do produto e, desde a v0.8 (8/11/2026), **lê configurações, dados e estrutura do escritório só dentro do escopo de quem perguntou**, sem alterar nada sem a aprovação dele (6.8.8).

| Parte do suporte, por assento por mês | Baixo | Provável | Alto | Observação |
| --- | ---: | ---: | ---: | --- |
| Suporte humano (hora de atendimento do chat e dos chamados) | R$ 6 | R$ 12,50 | R$ 25 | Já reduzido na v0.5; **não muda** |
| **Chat com pessoas (ferramenta de chat e cobertura de horário)** | R$ 1 | **R$ 2** | R$ 4 | **Novo na v0.7**; licença por agente e cobertura de horário comercial, rateadas por assento (cerca de R$ 1,40 com 2 agentes de US$ 40 e 450 assentos; arredondado) **[premissa a medir]** |
| Assistente de ajuda (modelo pequeno, com diagnóstico, v0.8) | R$ 0,06 | R$ 0,16 | R$ 0,65 | Era 0,06 / 0,15 / 0,47 na v0.5 e na v0.7; **o limite de 30 perguntas é o uso alto** |
| **Total do suporte** | R$ 7,06 | **R$ 14,66** | R$ 29,65 | Era R$ 12,65 no provável (v0.5) |

Por escritório no provável: P R$ 73 por mês (7,4% do preço de R$ 990), M R$ 220 (16,0% de R$ 1.376) e G R$ 586 (25,3% de R$ 2.314). **Efeito na margem de contribuição do sistema-base, no provável** (preço igual; o custo sobe R$ 10 / 30 / 80 pelo chat):

| | P (5 usuários) | M (15) | G (40) |
| --- | ---: | ---: | ---: |
| v0.5: suporte humano e assistente (10 perguntas) | 678 (68,5%) | 579 (42,0%) | 180 (7,8%) |
| **v0.7: mais o chat com pessoas (R$ 2 por assento)** | **668 (67,5%)** | **549 (39,9%)** | **100 (4,3%)** |
| Variação | −1,0 ponto | −2,1 pontos | −3,5 pontos |
| Se todo usuário usar as 30 perguntas e o diagnóstico alto todo mês (R$ 0,65) | 666 (67,2%) | 541 (39,3%) | 80 (3,5%) |

O assistente no limite (30 perguntas com o diagnóstico alto) custa só R$ 2,4 / 7,4 / 19,6 por mês a mais que no provável: **o peso do suporte está no chat com pessoas e na hora de atendimento, não no modelo pequeno**. O que justifica a camada barata é a conta de 6.8.8: cada pergunta resolvida pelo assistente evita atendimento humano de R$ 7,50 (5 minutos a R$ 90 por hora). **A medir:** a hora de atendimento por assento (R$ 12,50), a cobertura de horário (R$ 2) e o quanto o limite de 30 perguntas é atingido (10.3).

#### 6.8.10 Ordem do suporte (FAQ, assistente, equipe), comparação com o suporte humano e custo-hora (decisões de 8/11/2026)

**Ordem de atendimento:** a Ajuda do sistema ganha **seções básicas de FAQ** (perguntas curtas, escritas e mantidas pela equipe do produto, sem IA e sem custo por consulta), e a ordem passa a ser **FAQ, depois o assistente de ajuda, depois a equipe**. O FAQ entra nos totais com **R$ 0**: o custo é de conteúdo e manutenção (horas de escrita e de revisão a cada versão), dentro da hora de suporte já contada **[premissa a medir]**. O efeito esperado é desviar perguntas repetidas do assistente e da equipe; não foi medido.

**Comparação com o suporte humano.** O usuário observa que o suporte humano está em R$ 25 por usuário. Na conta, R$ 25 é o **uso alto** de hoje e foi o **provável da v0.4**, antes da ajuda por IA; com o FAQ e o assistente, o provável assumido é R$ 12,50, a metade **[premissa a medir]**.

| Por usuário por mês | Suporte humano | IA de suporte (assistente com diagnóstico) | Observação |
| --- | ---: | ---: | --- |
| v0.4: sem ajuda por IA | R$ 25 | R$ 0 | Provável da v0.4 |
| v0.8 provável | R$ 12,50 | R$ 0,16 | A IA custa 1,3% do suporte humano e evita R$ 12,50 |
| v0.8 alto | R$ 25 | R$ 0,65 | A IA custa 2,6% do suporte humano |

**Se o suporte humano ficasse em R$ 25 no provável** (a IA não reduzir nada), a margem de contribuição do sistema-base cai de 67,5% / 39,9% / 4,3% para **61,2% / 26,2% / −17,3%** (P / M / G; contribuição de R$ 606 / 361 / −400 por mês): a IA e o FAQ valem R$ 62 / 187 / 500 por mês nos três escritórios, contra R$ 0,8 / 2,4 / 6,3 de custo da ajuda. A conta fecha se a ajuda evitar apenas cerca de 6 segundos de atendimento por usuário por mês (R$ 0,16 ÷ R$ 1,50 por minuto). **A medir no piloto:** quantas perguntas o FAQ e o assistente resolvem sem a equipe.

**Custo-hora (Timesheet e Rentabilidade).** O custo-hora **continua um só, do escritório, e inclui todos os pacotes**. O **custo-hora por pacote é só um extra opcional**, desligado por padrão. O BPO entra como **filtro (chip "Pacote: Contábil | BPO | Todos")** nas telas do Timesheet e da Rentabilidade, sem custo-hora próprio, a menos que o extra esteja ligado. Não muda preço nem custo da plataforma (05, 10 e 7.1 do 10).

### 6.9 O sistema-base fecha? O que mudou na v0.5 e na v0.7 e o que sobra

A v0.4 mostrou que o sistema-base sem IA, a preço de mercado, **não fechava** no grande e tinha pouca folga no médio, e listou quatro alavancas. **A v0.5 aplicou duas por decisão do usuário** (suporte menor; conectores embutidos com teto). **A v0.7 (8/11/2026) acrescentou o chat de suporte com pessoas, que custa margem (P25), e apertou o teto dos conectores a 130%, que devolve margem no uso alto (P26).** Este bloco mostra o efeito de cada passo e as alavancas que sobram. Todas as contas são do sistema-base sem IA, no uso provável, sem GB; "total" é o que o escritório paga por mês (mensalidade + consumo) e "contribuição" é a margem de contribuição (a). Os números saem da calculadora com os valores do painel Premissas alterados (6.10).

**A. Efeito das decisões na contribuição por mês**

| Passo | P | M | G | Ponto de 200 clientes e 10 usuários |
| --- | --- | --- | --- | --- |
| v0.4: suporte de R$ 25 por assento; teto = uso provável | 617 (62,3%) | 393 (28,6%) | −314 (−13,5%) | 281 (17,4%) |
| + suporte de R$ 12,50 por assento (v0.5) | 679 (68,6%) | 581 (42,2%) | 186 (8,1%) | 406 (25,2%) |
| + ajuda do sistema (R$ 0,15 por usuário) (v0.5) | 678 (68,5%) | 579 (42,0%) | 180 (7,8%) | 405 (25,1%) |
| + teto dos conectores a 162% do provável (v0.5) | 678 (68,5%) | 579 (42,0%) | 180 (7,8%) | 405 (25,1%) |
| **+ chat de suporte com pessoas, R$ 2 por assento (v0.7)** | **668 (67,5%)** | **549 (39,9%)** | **100 (4,3%)** | **385 (23,8%)** |
| **+ teto dos conectores a 130% do provável (v0.7)** | **668 (67,5%)** | **549 (39,9%)** | **100 (4,3%)** | **385 (23,8%)** |
| **+ diagnóstico de leitura na ajuda, R$ 0,16 por usuário (v0.8)** | **668 (67,5%)** | **549 (39,9%)** | **100 (4,3%)** | **385 (23,8%)** |

No uso provável o teto não muda a margem, porque o uso cabe dentro dele (nem a 130%); o efeito do teto está no uso alto (B). O grande saiu de −R$ 314 para +R$ 180 com o suporte reduzido e a ajuda, e **volta a R$ 100 com o chat de suporte**.

**B. O teto no uso alto** (excedente cobrado por mês e margem de contribuição, sistema-base sem IA, com o chat de suporte da v0.7)

| Teto por cliente | P | M | G | Ponto de 200 clientes |
| --- | --- | --- | --- | --- |
| Igual ao uso provável (100%) | R$ 96 / 37,6% | R$ 321 / 0,6% | R$ 963 / −35,8% | R$ 642 / −9,1% |
| **Adotado em 8/11/2026 (130%)** | **R$ 57 / 35,3%** | **R$ 191 / −7,7%** | **R$ 572 / −54,2%** | **R$ 381 / −23,4%** |
| 162% (v0.5, sem o diagnóstico) | R$ 17 / 32,8% | R$ 55 / −17,7% | R$ 166 / −79,1% | R$ 111 / −42,6% |

Sem o chat de suporte, as mesmas linhas dão: 100%: 39,5% / 4,1% / −30,9%; **130%: 37,2% / −3,9% / −48,6%**; 162% (v0.5, sem o diagnóstico): 34,8% / −13,5% / −72,6%. **O teto de 130% leva o uso alto do médio de −13,5% a −3,9%** (−17,7% a −7,7% com o chat), ao custo de o escritório pagar, no uso alto, R$ 136 por mês a mais (R$ 191 contra R$ 55) e de **pagar extra mesmo no provável se o uso real passar de 130% do estimado** (3.11: R$ 86 por mês no médio com 150%). É a troca entre conta previsível para o escritório e margem no teste de estresse; o usuário escolheu a margem (P26) e o uso real é o que valida a escolha.

**C. Alavancas que sobram** (total / contribuição por mês, uso provável, v0.7)

| Alavanca (o que muda) | M | Ponto de 200 clientes | G |
| --- | --- | --- | --- |
| **Nenhuma** (v0.7) | 1.376 / 549 (39,9%) | 1.614 / 385 (23,8%) | 2.314 / 100 (4,3%) |
| **Infraestrutura por cliente menor** (R$ 0,60 para R$ 0,30) | 1.376 / 579 (42,0%) | 1.614 / 445 (27,6%) | 2.314 / 190 (8,2%) |
| **Teto menor**: 50% do uso provável (o resto a custo + 20%) | 1.594 / 766 (48,1%) | 2.049 / 819 (40,0%) | 2.966 / 752 (25,4%) |
| Tudo como consumo, sem valor por cliente nos conectores (alternativa descartada na P22) | 1.618 / 791 (48,9%) | 2.129 / 900 (42,3%) | 3.117 / 903 (29,0%) |
| Infraestrutura menor + teto a 50% | 1.594 / 796 (49,9%) | 2.049 / 879 (42,9%) | 2.966 / 842 (28,4%) |

**Margens (b) e (c) com e sem as duas últimas alavancas** (30 escritórios, sem pró-labore, tributos de 12,5%):

| | (a) | (b) | (c) |
| --- | ---: | ---: | ---: |
| Médio, sistema-base, v0.7 | 39,9% | 20,0% | 7,5% |
| Médio, sistema-base, infraestrutura menor + teto a 50% | 49,9% | 32,8% | 20,3% |
| Médio, IA Operação para 1/3, v0.8 | 52,7% | 41,0% | 28,5% |
| Médio, IA Operação para 1/3, infraestrutura menor + teto a 50% | 58,0% | 47,2% | 34,7% |
| **Grande**, IA Operação para 1/3, v0.8 / infraestrutura menor + teto a 50% (esta, da v0.7) | 38,9% / 47,9% | 21,7% / 32,8% | 9,2% / 20,3% |

**O que isso diz:**

1. **O suporte era a maior alavanca e foi aplicada**: +R$ 188 por mês no médio e +R$ 500 no grande, sem encarecer o cliente. O chat com pessoas devolve R$ 30 (M) e R$ 80 (G) por mês, e a ajuda do sistema custa R$ 2 (M) e R$ 6 (G). As premissas de R$ 12,50 por assento (cerca de 5,6 horas por mês para 40 usuários, a R$ 90 por hora) e de R$ 2 de chat **continuam a medir** (P23, 10.3).
2. **O grande ficou em 4,3%** (v0.5: 7,8%; v0.4: −13,5%): cobre o custo, com R$ 100 de sobra, mas não a plataforma (margem (b) de −31,1%); precisa de IA para pagar a sua parte dos fixos (9.6).
3. **A infraestrutura por cliente rende pouco** (+R$ 30 no médio, +R$ 90 no grande).
4. **Teto menor move a API dos conectores para o cliente** e é a alavanca de maior efeito (+R$ 217 no médio com teto a 50%), mas **encarece a conta do escritório**: o médio vai de R$ 1.376 para R$ 1.594 (27% acima da HubStrom + app, R$ 1.257) e o ponto de 200 clientes de R$ 1.614 para R$ 2.049 (37% acima da tabela de R$ 1.500). O usuário decidiu por conectores embutidos com teto (P22) e **apertou o teto a 130% (P26)**; o teto a 50% fica como opção, se a medição mostrar que o uso provável é menor que o estimado.
5. **Alavanca de engenharia, não calculada:** se o monitoramento fiscal puder usar o e-CAC por procuração e certificado em vez do Integra pago, a contribuição do médio sobe até R$ 215 (3.10). **Hipótese a verificar.**

**Recomendação do estudo:** manter o sistema-base perto do mercado (P21, respondida), medir primeiro o suporte por assento (hora de atendimento e chat), as perguntas de ajuda e o uso real de Integra e InfoSimples por cliente (10.3) e rever o teto a 130% com o uso medido (P26). Sem a IA, o sistema-base ainda é um produto de entrada que não paga a plataforma sozinho.

### 6.10 Premissas visíveis e editáveis na calculadora

Decisão de 7/11/2026: tributos e os demais percentuais estimados **não ficam escondidos no código**. A calculadora tem um painel **Premissas** (bloco 6), com cada valor editável, o valor em uso ao lado do resultado (chips no cartão "Resultado" e nos três níveis de margem) e a marca **a confirmar** ou **a medir** nas que dependem de confirmação externa. O botão "Restaurar valores de partida" volta aos valores de `parametros.json`.

| Premissa | Valor de partida | Faixa | Marca |
| --- | --- | --- | --- |
| Tributos sobre a receita | 12,5% | 8% a 17% (pesquisa 08: 15,5% a 24,9%) | **a confirmar** com o contador; **será discutida depois** |
| Comissão de vendas | 0% | 0% a 10% | a confirmar (vendas) |
| Câmbio (R$ por US$) | 7,97 | 5,69 (só IOF) a 7,97 | **a confirmar** (contador) |
| Utilização do teto de IA: baixo / provável / alto | 15% / 35% / 70% (pior caso 100%) | | a medir no piloto |
| Suporte humano por assento: baixo / provável / alto | R$ 6 / 12,50 / 25 | | decisão de 7/11; a medir |
| Chat de suporte com pessoas, R$ por assento por mês: baixo / provável / alto | R$ 1 / 2 / 4 | | **a medir** (P25, v0.7) |
| Ajuda do sistema: perguntas, tokens e infraestrutura por usuário; limite mensal de perguntas (todo usuário) | 4 / 10 / 30; 5 / 8 / 15 mil; R$ 0,05 / 0,10 / 0,20; 30 | | premissa; P25 |
| Infraestrutura por cliente | R$ 0,20 / 0,60 / 1,50 | | premissa (engenharia) |
| Custo fixo da plataforma | R$ 8.200 | | premissa |
| Pró-labore (ligado ou desligado) | R$ 10.000; desligado | | premissa |
| Escritórios ativos (médios equivalentes) | 30 | 10 a 100 | premissa |
| Teto dos conectores (chamadas por cliente por mês), 130% do provável | 8 / 1,6 / 0,8 / 0,27 do Integra e CNPJ; 8,1 do InfoSimples (v0.5: 10 / 2 / 1 / 0,3; 10) | | **a confirmar**; decidido em 8/11 (P26) |
| Acréscimo sobre o consumo acima do teto | 20% | | decisão do estudo |
| Uso de Integra e CNPJ; de InfoSimples (R$ por cliente por mês) | 1,07 / 2,25 / 3,80; 0,70 / 1,37 / 2,50 | | 08, 10.2 |
| Custo da hora de implantação; margem mínima no piso | R$ 90 (R$ 70 a 130); **0% (piso = custo, P27)** | | premissa (8.3); P28 aberta |
| Cenário de caixa: novos por mês, mix, desconto, parcelas, cancelamento, meses até a mensalidade, migrações, pró-labore | 3; 50 / 40 / 10; 20%; 1; 0%; 1; não; desligado | | premissa (8.5) |

Os preços de tabela dos módulos, dos planos de IA e da implantação ficam em `PARAMETROS` (topo do script e `parametros.json`). A lógica é testada por `precificacao/teste_configurador.js` (Node, sem dependências): reproduz a v0.4 quando os valores da v0.4 são restaurados, confere os números da v0.5 e da v0.7 (chat de suporte, teto de 130%, piso da implantação) com contas à parte e o fluxo de caixa com uma simulação independente. **O campo de desconto de implantação não passa do piso** (o menor desconto máximo dos três portes, 30,7%): o valor digitado acima aparece em um aviso vermelho com o preço que levaria cada porte abaixo do custo, e o preço aplicado nunca fica abaixo do custo.


---

## 7. Serviços extras e marca branca

### 7.1 Marca branca e app próprio (opcionais)

**Decisão de 7/11/2026:** a marca branca e o app próprio são **customizáveis e opcionais**. Quem contrata tem o sistema e o app com a marca, o domínio e o tema do escritório; quem não contrata usa o sistema e o app com a **marca e os temas padrão da plataforma**.

| Opção | O que o escritório tem | Custo para a plataforma | Preço de referência |
| --- | --- | --- | --- |
| **Web instalável com tema e domínio próprio** (primeira versão, 06, 11) | Logo, cores, domínio, remetente de e-mail, no sistema e no app | R$ 15 fixo por mês (3.4) | **Complemento Marca branca: R$ 150 por mês (teste; v0.3: R$ 250)**; sem ele, tema padrão |
| **App único na loja, com seleção do escritório** | App em nome da plataforma; o tema aparece depois de abrir (o do escritório com Marca branca, o padrão sem ela) | Uma conta de desenvolvedor; atualizações únicas | Incluído no App |
| **App por escritório na loja** (GES-204) | Nome e ícone do escritório na loja | Conta Apple (US$ 99 por ano **[a confirmar]**, R$ 66 por mês), revisão a cada versão, 2 horas por mês de engenharia **[premissa]**: **R$ 150 a 330 por mês**, mais R$ 1,5 mil a 3 mil de publicação inicial | HubStrom: R$ 300 por mês ou R$ 9,90 por cliente. **Complemento App na loja: R$ 350 por mês (teste)**, mais publicação inicial; exige App e Marca branca |

Política das lojas para apps repetidos: **[a confirmar]** (06, 11.3).

### 7.2 Serviços extras (06, 8)

Custo da plataforma por cliente final por mês e o que o escritório pode cobrar dele. As faixas de preço ao cliente final são **[premissa]**: não há referência pública, só a tarifa do Domínio (boleto R$ 1,80) e o AppHub+ (R$ 9,90 por cliente).

| Serviço | Custo da plataforma | Conta | Preço sugerido ao cliente final | Participação da plataforma (proposta) |
| --- | --- | --- | --- | --- |
| **NFS-e pelo app** | Emissor Nacional R$ 0 + infra R$ 0,05 por nota; fora do padrão: Asaas R$ 0,49 por nota (R$ 9,80 com 20 notas) ou Focus Solo R$ 94,90 | 20 notas × R$ 0,05 = R$ 1 | R$ 39 a 89 por mês | R$ 6 fixo por cliente ativo; integrador repassado ao custo |
| **Consultor da empresa** | 15 perguntas × R$ 0,12 = R$ 1,80 (R$ 0,8 a 6) | tokens contados no cliente, com teto | R$ 29 a 79 | R$ 10 fixo por cliente ativo: é o **complemento Consultor da empresa** da equação (6.8.6), com franquia de 15 perguntas; **ativado pelo escritório, cliente a cliente** |
| **Certidões sob demanda** | R$ 0,25 a 0,60 por certidão | 2 por mês = R$ 1 | R$ 5 por certidão, ou R$ 29 por mês | R$ 1 por certidão |
| **Simulador da reforma** | R$ 0,40 a 1,00 por relatório (cálculo é código; explicação em modelo barato) | revisão do contador | R$ 49 a 149 por relatório | R$ 5 por relatório |
| **Painel do sócio** | R$ 0,20 a 0,50 por mês | infra | R$ 29 a 59 | R$ 4 |
| **Conciliação simplificada** | Open Finance: R$ 2.500 ÷ conexões (R$ 25 com 100 conexões) + classificação R$ 0,5 a 3 | R$ 28 a 35 por empresa | R$ 99 a 199 | Custo do agregador cobrado do escritório (08, 13.3); participação R$ 10 |
| **Cobrança dos clientes do cliente** | Tarifa do provedor (Asaas R$ 1,59 por boleto ou Pix; Efí Pix 1,19%) na conta do cliente | zero para a plataforma | Tarifa do provedor + margem do escritório | R$ 0,25 por cobrança, ou nada **[parceria com provedor a confirmar]** |

### 7.3 Como a plataforma participa

| Modelo | Regra | A favor | Contra |
| --- | --- | --- | --- |
| **Nada** | Serviço entra no preço do módulo App | Simples | Sem receita extra; custo sem cobertura |
| **Fixo por serviço ativo por cliente** (recomendado) | Valores da última coluna | Cobre o custo com margem; previsível | Não cresce com o preço do escritório |
| **Percentual** (10% a 20% do que o escritório cobra) | % do valor cobrado do cliente final | Alinha com o escritório | Exige ver o preço dele; risco de atrito |

**Como a venda funciona (decisão de 7/11/2026).** Os serviços extras do app, e entre eles o Consultor da empresa, **são vendidos pelo próprio escritório** ao cliente dele: o escritório **ativa o serviço para aquele cliente nas configurações do sistema** e a cobrança da plataforma ao escritório, **por cliente ativo**, passa a valer automaticamente; **o preço ao cliente final é definido pelo escritório** (as faixas da tabela são só sugestão). Na calculadora, cada serviço tem o campo "clientes ativos" (Consultor da empresa, NFS-e e certidões pelo app), e cada cliente ativado é uma linha cobrada; os custos de API deles estão em 3.10.

A participação fixa recupera o custo com margem de 40% a 90% por serviço (a menor é a das certidões). Nos serviços com custo de terceiro (integrador, Open Finance), o terceiro é repassado ao custo.

---

## 8. Pacotes e implantação

### 8.1 Pacotes como atalhos do configurador

Os pacotes **não são estruturas de preço separadas**: são seleções pré-marcadas do configurador (6), sem desconto implícito. Marcar "Operação" apenas marca os módulos e a distribuição dos planos de IA; o preço sai da equação, e o escritório pode adicionar ou tirar módulos e mudar o plano de cada usuário depois. **Os dois BPOs, o Open Finance, o Consultor da empresa e o app na loja não entram em nenhum pacote.** Os planos de IA aparecem como "IA Essencial", "IA Operação" e "IA Intensivo" para não se confundirem com os atalhos.

| Atalho | Módulos pré-selecionados | IA pré-selecionada | Complementos pré-selecionados | Preço de teste P / M / G | Custo provável P / M / G (sem WhatsApp) | Margem (a) P / M / G |
| --- | --- | --- | --- | --- | --- | --- |
| **Sistema-base** (novo na v0.4) | Painel, CRM, Timesheet, App, conectores federal e estaduais e municipais | **Sem IA** | Marca branca; nuvem própria | R$ 990 / 1.376 / 2.314 | R$ 322 / 828 / 2.214 | 68% / 40% / 4% |
| **Essencial** | Painel, CRM, App, conectores federal | **Sem IA** | Nenhum (marca e tema padrão; nuvem própria) | R$ 704 / 977 / 1.637 | R$ 241 / 631 / 1.693 | 66% / 36% / −3% |
| **Operação** | Essencial + Timesheet, conectores estaduais e municipais | **IA Operação para 1/3 dos usuários** (2 / 5 / 13) | Marca branca; 5 GB por cliente | R$ 1.436 / 2.546 / 5.446 | R$ 459 / 1.197 / 3.214 | 68% / 53% / 41% |
| **Completo** | Operação + Financeiro | **IA Operação para todos os usuários** | Marca branca; 5 GB por cliente | R$ 2.122 / 4.635 / 10.940 | R$ 632 / 1.753 / 4.705 | 70% / 62% / 57% |
| **Extras** (nunca pré-marcados) | Conectores: cores | IA Intensivo, bolsa, uso extra | Consultor da empresa; NFS-e e certidões pelo app; Open Finance; Modo BPO entre escritórios; BPO financeiro; app na loja | Seção 6.2 | Seção 6.2 | |

Preços de teste, uso provável (IA a 35% do teto); margem (a) é a contribuição. Margem após fixos rateados (b) e líquida (c), 30 escritórios, sem pró-labore, tributos de 12,5%: Operação (P / M / G) 62% / 42% / 26% e 50% / 30% / 13%; Completo 66% / 56% / 50% e 54% / 44% / 37%. Na v0.3, o Completo custava R$ 2.761 / 6.325 / 15.201; na v0.4, **23%, 27% e 28% menos**, porque o sistema-base foi trazido ao mercado e a IA não mudou; na v0.5 o preço é o mesmo e o custo caiu com o suporte; na v0.7 o custo sobe R$ 10 / 30 / 80 com o chat de suporte. **A margem alta do Completo vem da IA**: dos R$ 2.882 de contribuição do médio, R$ 2.028 vêm da IA Operação (15 usuários × R$ 135), R$ 305 do Financeiro e do armazenamento e R$ 549 do sistema-base. As menores margens do conjunto são as do **Essencial** e do **sistema-base no grande** (−3% e 4%; v0.5: 1% e 8%): sem IA, o preço de mercado mal cobre o suporte e os conectores de 300 clientes.

### 8.2 Implantação e migração (custo para servir)

Horas por escritório, **[estimativa a medir no piloto]**, a R$ 90 por hora (R$ 70 a 130).

| Atividade | P | M | G |
| --- | ---: | ---: | ---: |
| Contrato, tenant, tema, domínio, usuários e papéis | 3 | 5 | 10 |
| Importação de clientes (arquivo do core, planilha) e conferência | 4 | 8 | 20 |
| Espelho de nuvem e mapeamento de pastas | 3 | 6 | 14 |
| Conectores federais (termo do Integra, e-CNPJ, procurações em lote) | 4 | 8 | 20 |
| WhatsApp (cadastro na Meta, setores, templates em aprovação) | 3 | 6 | 12 |
| Integrantes, lista "faz sozinho", réguas | 3 | 8 | 20 |
| Treinamento da equipe | 4 | 9 | 24 |
| Acompanhamento de 30 dias | 4 | 10 | 30 |
| **Trilha de implantação do escritório** | **28 h** | **60 h** | **150 h** |
| Custo | R$ 2.520 | R$ 5.400 | R$ 13.500 |
| Migração de ferramentas atuais (Gestta, SIEG, HubStrom: L2) | 6 h | 14 h | 36 h |
| Migração do financeiro (Conta Azul, Omie, Nibo, Conexa; 09, 9), com um ciclo de convivência | 8 h | 16 h | 40 h |
| **Total com as duas migrações** | **42 h = R$ 3.780** | **90 h = R$ 8.100** | **226 h = R$ 20.340** |

Mais R$ 50 a 300 de indexação dos documentos (embeddings). O trabalho por cliente (A1, procuração, convite do app) é do escritório e está na trilha de entrada do Painel (03, 8).

Recuperação do custo da implantação com a margem de contribuição do atalho Completo (preço menos custo, 6.4 e 8.1): P R$ 1.490 por mês, M R$ 2.882, G R$ 6.235 (v0.7, com o chat de suporte). Se o escritório não pagar implantação, o custo da trilha com as duas migrações (R$ 3.780 / 8.100 / 20.340) se recupera em **2,5 / 2,8 / 3,3 meses**. (Correção da v0.5: a v0.4 somava 98 e 246 horas no médio e no grande; a soma correta é 90 e 226 horas, 60 + 14 + 16 e 150 + 36 + 40.) **Só com o sistema-base sem IA e só a trilha (R$ 2.520 / 5.400 / 13.500), a recuperação é de 3,8 meses no P (R$ 668 por mês), 9,8 meses no M (R$ 549) e 135 meses no G (R$ 100)**: para o sistema-base a preço de mercado, a implantação deve ser **cobrada**, não absorvida (8.3). A implantação é custo único e fica fora das três margens (1.6); em 8.4 ela entra no primeiro ano e no equilíbrio e em 8.5 no caixa.

### 8.3 Preço da implantação por porte

**Decisão de 7/11/2026:** o usuário relata que os sistemas do mercado cobram valor alto de implantação (HubStrom: **R$ 4.500 de tabela**; após negociação, o usuário conseguiu **R$ 2.200**) e que **grande parte do caixa inicial virá dela**. A implantação passa a ser vendida e tratada como receita, com custo de entrega de horas × **custo da hora de implantação de R$ 90 [premissa a registrar; R$ 70 a 130; P28, aberta: medir nos primeiros escritórios]**. **Decisão de 8/11/2026 (P27): o preço depende do contexto (uma venda grande, por exemplo, pode pesar na negociação), mas o piso é a margem zero: o time nunca vende abaixo do custo de entrega.** Na v0.6 o piso era o custo mais 15% de margem (R$ 3.000 / 6.400 / 15.900). Os valores abaixo são parâmetros de teste, não preço final de venda.

| | Pequeno | Médio | Grande |
| --- | ---: | ---: | ---: |
| Horas da trilha (8.2) | 28 | 60 | 150 |
| Custo de entregar a trilha (R$ 90 por hora) | R$ 2.520 | R$ 5.400 | R$ 13.500 |
| **Preço de tabela** | **R$ 4.500** | **R$ 8.500** | **R$ 19.500** |
| Margem na tabela | 44,0% | 36,5% | 30,8% |
| **Piso = custo de entrega (margem zero)** | **R$ 2.520** | **R$ 5.400** | **R$ 13.500** |
| Margem no piso | 0% | 0% | 0% |
| Desconto máximo (da tabela ao piso) | 44,0% | 36,5% | 30,8% |
| Migração de ferramentas e do financeiro (opcional): horas | 14 | 30 | 76 |
| Com as duas migrações: custo / tabela / piso | R$ 3.780 / 6.320 / 3.780 | R$ 8.100 / 12.400 / 8.100 | R$ 20.340 / 29.380 / 20.340 |
| Margem com as migrações: tabela / piso | 40,2% / 0% | 34,7% / 0% | 30,8% / 0% |

**O que inclui o preço da trilha** (8.2): contrato, tenant, tema, domínio, usuários e papéis; **importação de clientes** (arquivo do core ou planilha) e conferência; espelho de nuvem e mapeamento de pastas; conectores federais (termo do Integra, e-CNPJ, procurações em lote); WhatsApp (cadastro na Meta, setores, templates); integrantes, lista "faz sozinho" e réguas; **treinamento da equipe**; acompanhamento de 30 dias. A **migração de ferramentas atuais** (Gestta, SIEG, HubStrom) e a **migração do financeiro** (Conta Azul, Omie, Nibo, Conexa, com um ciclo de convivência) são opcionais e saem a R$ 130 por hora na tabela (o piso é o custo, a R$ 90 por hora). A indexação dos documentos (R$ 50 a 300 de embeddings, 8.2) fica dentro do preço.

**Contra o mercado.** O preço de tabela do pequeno (R$ 4.500) iguala o da HubStrom. O valor que o usuário negociou lá, R$ 2.200, paga cerca de **24 horas de entrega** a R$ 90, sem margem; a nossa trilha tem 28, 60 e 150 horas. Se o escritório só aceitar R$ 2.200, a implantação **perde** R$ 320 no pequeno, R$ 3.200 no médio e R$ 11.300 no grande. O piso existe para impedir isso: o desconto máximo é de 44%, 36,5% e 30,8%, contra os 51% que o mercado concedeu (R$ 4.500 para R$ 2.200). **Na calculadora o campo de desconto não passa do piso (30,7%, o menor dos três) e um aviso vermelho mostra o que um desconto maior faria: levaria o porte abaixo do custo.** Vender no piso significa implantação sem margem e o ganho só na mensalidade (8.4): é o limite, não o preço-alvo. Dois caminhos se o preço for resistido: reduzir as horas (importação e conferência automatizadas, treinamento gravado) ou vender a trilha em etapas.

### 8.4 Margem do primeiro ano e ponto de equilíbrio

**Primeiro ano de um escritório** = 12 mensalidades + implantação; margem de contribuição (a), uso provável, desconto médio de 20% (o piso, o custo, só trava a partir de 44% / 36,5% / 30,8%). Margem em R$ e em % da receita do primeiro ano (v0.7: com o chat de suporte e o piso em margem zero):

| Escritório | Contribuição mensal | Implantação absorvida (não cobra) | Piso (a custo) | Desconto de 20% | Tabela |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Sistema-base**, P | 668 | 5.499 (46,3%) | 8.019 (55,7%) | 9.099 (58,8%) | 9.999 (61,0%) |
| M | 549 | 1.184 (7,2%) | 6.584 (30,0%) | 7.984 (34,2%) | 9.684 (38,7%) |
| G | 100 | −12.294 (−44,3%) | 1.206 (2,9%) | 3.306 (7,6%) | 7.206 (15,2%) |
| **Operação** (IA Operação para 1/3), P | 976 | 9.193 (53,4%) | 11.713 (59,3%) | 12.793 (61,4%) | 13.693 (63,0%) |
| M | 1.350 | 10.795 (35,3%) | 16.195 (45,0%) | 17.595 (47,1%) | 19.295 (49,4%) |
| G | 2.233 | 13.294 (20,3%) | 26.794 (34,0%) | 28.894 (35,7%) | 32.794 (38,6%) |

Na coluna "piso" a implantação é vendida ao custo: a margem do ano é só a das 12 mensalidades. A implantação cobrada **reduz o percentual** do primeiro ano do médio (de 39,9% em regime para 34,2% com 20% de desconto), porque a margem dela, de 36% na tabela, é menor que a da mensalidade; mas **soma R$ 1.100 a 2.100 de contribuição ao ano com o desconto de 20% (R$ 2.000 a 6.000 na tabela)** e, sobretudo, evita o prejuízo de R$ 5.400 da implantação absorvida: sem cobrar, a contribuição do primeiro ano do médio com sistema-base cai de R$ 6.584 (12 × 549) para R$ 1.184, e a do grande vai a −R$ 12.294.

**Ponto de equilíbrio da plataforma, em escritórios do mesmo porte** (fixos de R$ 8,2 mil sem pró-labore / R$ 18,2 mil com). "Em regime" usa só as mensalidades; "1º ano" soma a margem da implantação cobrada (desconto de 20%) à contribuição do ano: 12 × fixos ÷ (12 × contribuição + margem da implantação).

| Escritório | Em regime: sem / com pró-labore | No 1º ano: sem / com pró-labore |
| --- | ---: | ---: |
| **Sistema-base**, P | 12,3 / 27,2 | 10,8 / 24,0 |
| M | 14,9 / 33,2 | 12,3 / 27,4 |
| G | 81,6 / 181,1 | 29,8 / 66,1 |
| **Operação**, P | 8,4 / 18,6 | 7,7 / 17,1 |
| M | 6,1 / 13,5 | 5,6 / 12,4 |
| G | 3,7 / 8,2 | 3,4 / 7,6 |

A implantação não muda o equilíbrio em regime, mas **antecipa o do primeiro ano**: o médio só com sistema-base passa de 14,9 para 12,3 escritórios e o grande de 82 para 30. Depois do primeiro ano só vale a mensalidade: a implantação **paga a fase de crescimento, não a plataforma em regime**.

### 8.5 Fluxo de caixa dos primeiros 12 meses

A calculadora (bloco 7) e este estudo usam o mesmo modelo, com cenário configurável: escritórios novos por mês, mix de portes, configuração vendida, desconto médio de implantação, parcelamento em 1 a 6 vezes, migrações incluídas ou não, custos fixos com ou sem pró-labore, cancelamento mensal e meses de implantação antes da mensalidade.

**Regras do modelo.** Os escritórios novos assinam no início do mês; a implantação é recebida no mês da assinatura (ou em parcelas iguais, uma por mês) e as horas de entrega são pagas nesse mês; a **mensalidade começa 1 mês depois** (a implantação leva cerca de 30 dias) e traz o custo variável do escritório; os **fixos da plataforma** (R$ 8,2 mil) correm desde o mês 1; **tributos (12,5%) e comissão (0%)** incidem sobre as entradas (implantação e mensalidade); não há capital inicial; o preço da implantação é o da tabela com o desconto médio, **nunca abaixo do piso, que agora é o custo (P27)**. Cenário de partida: **3 escritórios novos por mês**, mix de **50% pequenos, 40% médios e 10% grandes**, desconto médio de 20% (preço efetivo de R$ 3.600 / 6.800 / 15.600; na v0.6 o grande ficava no piso de R$ 15.900), implantação à vista, só a trilha, sem cancelamento.

| Configuração (3 novos por mês) | Resultado do mês fica positivo | **Caixa acumulado fica positivo** | Maior necessidade de caixa | Caixa no mês 12 | Implantação nas entradas: 3 meses / 12 meses |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Sistema-base sem IA** | mês 7 | **mês 12** | R$ 21,1 mil (mês 6) | +R$ 1,4 mil | 83% / 46% |
| Operação (IA Operação para 1/3) | mês 4 | **mês 6** | R$ 11,0 mil (mês 3) | +R$ 112,7 mil | 73% / 33% |
| Completo | mês 3 | **mês 4** | R$ 7,0 mil (mês 2) | +R$ 321,4 mil | 60% / 22% |

A v0.6 trazia mês 12 (+R$ 7,3 mil, necessidade de R$ 19,5 mil) para o sistema-base, mês 6 para a Operação e mês 4 para o Completo: **o piso em margem zero não muda os meses no cenário de partida**, porque o desconto de 20% já fica acima do piso; o que piora o sistema-base é o chat de suporte (R$ 10 / 30 / 80 de custo por mês e escritório; cerca de R$ 5 mil no ano) e o grande sair do piso de R$ 15.900 para os R$ 15.600 do desconto de 20% (cerca de R$ 1 mil): juntos, R$ 5,9 mil a menos no caixa do mês 12. O sistema-base fecha o ano com **R$ 1,4 mil de folga**: qualquer premissa um pouco pior o tira do horizonte (8.6).

Sistema-base sem IA, mês a mês (R$ mil; ativos = escritórios pagando mensalidade):

| Mês | Ativos | Entradas | Saídas | Saldo | Acumulado |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 0,0 | 18,2 | 24,8 | −6,5 | −6,5 |
| 2 | 3,0 | 22,1 | 27,4 | −5,3 | −11,9 |
| 3 | 6,0 | 25,9 | 30,0 | −4,1 | −16,0 |
| 4 | 9,0 | 29,7 | 32,6 | −2,9 | −18,9 |
| 5 | 12,0 | 33,6 | 35,3 | −1,7 | −20,6 |
| 6 | 15,0 | 37,4 | 37,9 | −0,5 | −21,1 |
| 7 | 18,0 | 41,2 | 40,5 | 0,7 | −20,4 |
| 8 | 21,0 | 45,1 | 43,1 | 1,9 | −18,5 |
| 9 | 24,0 | 48,9 | 45,7 | 3,1 | −15,3 |
| 10 | 27,0 | 52,7 | 48,4 | 4,4 | −11,0 |
| 11 | 30,0 | 56,5 | 51,0 | 5,6 | −5,4 |
| 12 | 33,0 | 60,4 | 53,6 | 6,8 | 1,4 |

Conta do mês 1: entradas = 3 × (50% × 3.600 + 40% × 6.800 + 10% × 15.600) = 3 × 6.080 = R$ 18.240; saídas = horas de implantação 3 × 4.770 = 14.310 + fixos 8.200 + tributos 2.280 = R$ 24.790; saldo −R$ 6,5 mil. Conta do mês 12: 33 escritórios pagando; entradas = implantação 18.240 + mensalidades 42.133 = 60,4 mil; saídas = horas 14.310 + custo variável 23.543 + fixos 8.200 + tributos 7.547 = 53,6 mil.

**Leitura.**

1. **A implantação é a maior parte do caixa dos primeiros meses**: 83% das entradas dos três primeiros meses no sistema-base (73% na Operação), caindo para 46% e 33% no ano, na medida em que as mensalidades se acumulam. Isso confirma a expectativa do usuário.
2. **Sem cobrar a implantação, o caixa não fecha**: no sistema-base a necessidade chega a R$ 190 mil e o caixa do mês 12 é −R$ 190 mil; na Operação, −R$ 79 mil (maior necessidade, R$ 99 mil).
3. **O sistema-base sozinho fecha por pouco**: caixa positivo só no mês 12, com R$ 21,1 mil de capital necessário, e **não fecha com pró-labore** (necessidade de R$ 119 mil). A **Operação** fecha no mês 6; com pró-labore ligado, ainda está em −R$ 7,3 mil no mês 12.
4. **No piso (margem zero) a implantação deixa de ajudar**: com desconto de 51% (o do mercado; os três portes ao custo) o sistema-base não fecha em 12 meses (−R$ 39,9 mil no mês 12) e a Operação fecha no mês 8. O piso protege contra o prejuízo, não gera caixa.
5. **A mensalidade é o que sustenta o caixa a partir do mês 7**: o resultado do mês é positivo a partir do mês 7 (sistema-base), quando as mensalidades acumuladas cobrem fixos e horas de entrega.

### 8.6 Sensibilidades do caixa

Caixa acumulado positivo no mês indicado ("não" = não nos 12 meses), maior necessidade de caixa e caixa no mês 12, em R$ mil, 3 novos por mês salvo indicação:

| Variação | Sistema-base sem IA | Operação (IA Operação para 1/3) |
| --- | --- | --- |
| **Cenário de partida** | mês 12 / 21,1 / +1,4 | mês 6 / 11,0 / +112,7 |
| Sem cobrar implantação | não / 190,1 / −190,1 | não / 98,9 / −78,8 |
| Desconto 0% (tabela) | mês 6 / 4,0 / +49,3 | mês 3 / 2,6 / +160,6 |
| Desconto de 30,7% (o máximo do campo) | não / 35,5 / −24,2 | mês 7 / 17,4 / +87,1 |
| Desconto de 51% (o do mercado; o piso trava, tudo ao custo) | não / 46,3 / −39,9 | mês 8 / 22,6 / +71,4 |
| Parcelamento em 3 vezes | não / 37,1 / −14,6 | mês 8 / 26,9 / +96,7 |
| Parcelamento em 6 vezes | não / 61,0 / −38,5 | mês 9 / 46,1 / +72,8 |
| Fixos com pró-labore (R$ 18,2 mil) | não / 118,6 / −118,6 | não / 55,8 / −7,3 |
| Cancelamento de 3% ao mês | não / 22,4 / −8,3 | mês 6 / 11,3 / +89,6 |
| Cancelamento de 3% e 6 parcelas | não / 66,3 / −57,8 | mês 10 / 47,7 / +40,1 |
| Com as duas migrações (cobradas) | mês 12 / 20,6 / +2,4 | mês 6 / 10,7 / +113,6 |
| 1 escritório novo por mês | não / 65,1 / −65,1 | não / 34,2 / −28,0 |
| 2 por mês | não / 34,8 / −31,9 | mês 9 / 16,8 / +42,3 |
| 5 por mês | mês 7 / 10,3 / +67,9 | mês 4 / 6,1 / +253,4 |
| 10 por mês | mês 3 / 2,7 / +234,3 | mês 2 / 2,7 / +605,2 |
| Mix 100% médios | não / 22,4 / −4,0 | mês 6 / 10,4 / +125,6 |
| Mix 20% / 30% / 50% (muitos grandes) | não / 60,0 / −60,0 | mês 5 / 10,5 / +161,2 |
| Mix 80% / 20% / 0% | mês 10 / 16,5 / +24,9 | mês 7 / 11,5 / +90,7 |
| Custo da hora de R$ 130 (o piso sobe junto) | não / 53,4 / −49,4 | mês 9 / 25,7 / +61,9 |
| Custo da hora de R$ 70 | mês 7 / 6,5 / +39,6 | mês 4 / 3,8 / +150,8 |
| Tributos de 17% | não / 29,9 / −19,8 | mês 7 / 14,3 / +82,5 |
| Tributos de 8% | mês 10 / 14,8 / +22,6 | mês 5 / 8,3 / +142,9 |
| Mensalidade só 2 meses após a assinatura | não / 27,7 / −11,9 | mês 8 / 17,5 / +80,8 |

O **sistema-base sem IA é sensível a quase tudo**: desconto, parcelamento, custo da hora, tributos e ritmo de vendas o tiram do horizonte de 12 meses. A **Operação** tem folga porque a contribuição por escritório é de R$ 976 a R$ 2.233 e não de R$ 100 a R$ 668. A alíquota de 12,5% e o custo da hora estão a confirmar (P24, P28) e movem o resultado.

### 8.7 Risco de depender da implantação para o caixa

1. **Custo das horas.** Os R$ 90 por hora e as 28, 60 e 150 horas são estimativa (P28, aberta): a R$ 130 por hora o sistema-base não fecha em 12 meses (a R$ 70 fecha no mês 7), e como o piso é o custo, o preço mínimo sobe junto com a hora. Se as horas forem dos próprios sócios, contar R$ 90 por hora e o pró-labore juntos conta a mesma hora duas vezes; não contar a hora superestima o caixa.
2. **Concentração de entrega.** Três escritórios novos por mês, no mix 50 / 40 / 10, pedem **159 horas de implantação por mês**, ou uma pessoa só implantando; um grande (150 horas) toma quase um mês dela, e 5 por mês pedem cerca de 1,7 pessoa. Atraso na entrega atrasa a mensalidade: com 2 meses até a mensalidade em vez de 1, o sistema-base sai do horizonte de 12 meses.
3. **Preço e piso.** O mercado concedeu 51% de desconto (R$ 4.500 para R$ 2.200); o nosso piso, o custo, limita o desconto a 44% / 36,5% / 30,8%. Abaixo disso a implantação vira prejuízo: a R$ 2.200, cada médio perde R$ 3.200. Com desconto de 51% (tudo ao custo) o sistema-base não fecha (−R$ 39,9 mil no mês 12), e com o preço de tabela fecha no mês 6. **Vender sempre no piso tira a implantação do caixa**; o piso é a defesa, não o preço-alvo.
4. **Cancelamento nos primeiros meses e parcelamento.** Parcelas a receber de quem cancela não entram: com 3% de cancelamento ao mês e 6 parcelas, o sistema-base tem R$ 66 mil de necessidade de caixa e a Operação só fica positiva no mês 10. Mitigação: cobrar à vista ou uma primeira parcela alta, cláusula de permanência mínima, parcelas ligadas à entrega.
5. **Dependência do ritmo de vendas.** A implantação paga a fase de crescimento, não a plataforma em regime (8.4): com 1 escritório novo por mês nem a Operação fecha o caixa em 12 meses, e se as vendas caírem as entradas perdem os R$ 18 mil mensais de implantação (3 por mês), enquanto os fixos de R$ 8,2 mil exigem 15 escritórios médios só de sistema-base (9.4).


---

## 9. Sensibilidades e riscos

### 9.1 O que mais move o custo (médio, Completo: IA Operação para 15 usuários, provável: custo R$ 1.753, preço R$ 4.635, margem de contribuição de 62,2%; v0.6: R$ 1.723 e 62,8%, sem o chat de suporte)

O custo de IA no preço vem da **utilização do teto** (6.8.5), com custo de tokens de R$ 597 (15 × 0,35 × 1.290 UU × R$ 0,0882) dentro dos R$ 1.753.

| Variação | Mudança de custo | Novo custo | Margem (a) (era 62,2%) |
| --- | ---: | ---: | ---: |
| Utilização do teto de 35% para 15% | − 341 | 1.412 | 69,5% |
| Utilização de 35% para 70% (só tokens) | + 597 | 2.350 | 49,3% |
| Utilização de 35% para 100% (só tokens) | + 1.109 | 2.862 | 38,3% |
| Infraestrutura de IA por usuário de R$ 14 para R$ 40 | + 390 | 2.143 | 53,8% |
| Suporte de volta a R$ 25 por assento (valor da v0.4) | + 188 | 1.941 | 58,1% |
| Suporte a R$ 50 por assento | + 563 | 2.316 | 50,0% |
| Suporte pela metade (R$ 6,25 por assento) | − 94 | 1.659 | 64,2% |
| Chat de suporte no alto (R$ 4 por assento; v0.7) | + 30 | 1.783 | 61,5% |
| Parcela em modelo barato de 25% para 60% (R$ 4,98 por MTok) | − 260 | 1.493 | 67,8% |
| Câmbio R$ 5,69 em vez de R$ 7,97 (tokens e ajuda do sistema) | − 171 | 1.582 | 65,9% |
| Integra e CNPJ no cenário alto (R$ 3,80 por cliente; R$ 104 de excedente cobrado acima do teto de 130%) | + 155 | 1.908 | 59,7% (preço R$ 4.740) |
| Armazenamento ×2 (16 GB por cliente) | + 100 | 1.853 | 60,0% |
| Assistente de ajuda no limite (30 perguntas, 15 mil tokens) | + 5 | 1.758 | 62,1% |
| WhatsApp no cenário alto | **ao escritório**: sem efeito no custo | | |
| Plataforma absorve o Open Finance (R$ 2.500) | **não se aplica**: o Open Finance é cobrado do escritório | | |

Ordem: **utilização do teto de IA**, infraestrutura de IA por usuário, suporte, mistura de modelos, câmbio. Com o suporte reduzido a R$ 12,50, o Completo ganha 4 pontos de margem (58,1% para 62,2%); o chat de suporte da v0.7 custa 0,6 ponto (62,8% para 62,2%) e **o assistente de ajuda não pesa na lista**: no limite custa R$ 5 por mês no médio. A utilização a 70% leva o Completo de 62,2% a 49,3%. Na v0.2 o item dominante eram os tokens por escritório (×2 = +55% de custo); com o teto por plano, o risco da IA fica limitado a R$ 2.388 por mês no médio (15 × R$ 159 no pior caso).

### 9.2 Cenários de uso

Custo do Completo (IA Operação para todos) em R$ por mês, e margem de contribuição com o preço de cada cenário (no uso alto, o consumo de conectores acima do teto é cobrado):

| Cenário | P | M | G |
| --- | ---: | ---: | ---: |
| Baixo (IA a 15% do teto): custo | 252 | 691 | 1.856 |
| margem (a) | 88,1% | 85,1% | 83,0% |
| Provável (35%): custo | 632 | 1.753 | 4.705 |
| margem (a) | 70,2% | 62,2% | 57,0% |
| Alto (70%): custo | 1.357 | 3.707 | 9.871 |
| margem (a) | 37,7% | 23,2% | 14,3% |
| Pior caso (100%): custo | 1.555 | 4.300 | 11.452 |
| margem (a) | 28,6% | 10,9% | **0,5%** |

Do baixo ao pior caso o custo multiplica por 6,2 no médio (R$ 691 para R$ 4.300); a IA responde por 59% do aumento (R$ 2.136 de R$ 3.609). Os planos limitam o custo de IA por usuário: o pior caso é o teto, não a demanda. **No pior caso, o Completo do grande mal empata** (0,5%; v0.5: −1,6%: o teto de 130% cobra R$ 572 de excedente dos conectores no pior caso e o chat de suporte soma R$ 80 de custo; preço de mercado no sistema-base, suporte e conectores de 300 clientes). É preciso **medir UU por usuário no piloto antes de fixar preço**.

### 9.3 Ponto de equilíbrio por escritório

| | P | M | G |
| --- | ---: | ---: | ---: |
| Preço mínimo para margem zero (custo provável do Completo) | 632 | 1.753 | 4.705 |
| Preço para margem bruta de 50% | 1.264 | 3.506 | 9.410 |
| Preço para margem bruta de 60% | 1.580 | 4.383 | 11.763 |
| Soma de peças públicas de mercado, Completa (6.4) | cerca de 2,0 mil (HubStrom 527 + app 300 + SIEG 223 + Nibo 166 + assistente 790) | cerca de 4,4 mil | cerca de 8,5 mil (HubStrom 957 + app 300 + SIEG 800 + Nibo 383 + assistente ≈ 6.100) **[premissa de escala]** |
| **Preço de teste do configurador, Completo** | 2.122 (70,2%) | 4.635 (62,2%) | 10.940 (57,0%) |

O Completo do configurador fica **1,06 / 1,05 / 1,28 vez** a soma das peças públicas (v0.3: 1,4 / 1,4 / 1,8; v0.2: 2,0 / 2,3 / 2,9). O argumento é o valor: o mapa L2 estima 2.200 horas por mês para 100 clientes; basta liberar 2,4 horas (0,1%) no médio para pagar a diferença (6.4). **O preço de 60% de margem (R$ 4.383 no médio) fica 5% abaixo do preço de teste**: o Completo do médio já passa dos 60% de contribuição (62,2%); no grande, o preço de 60% (R$ 11.763) fica 8% acima do de teste (57,0%).

### 9.4 Margem em três níveis e ponto de equilíbrio da plataforma

Fixos mensais: **R$ 8,2 mil sem pró-labore** = infra 1.200 + GPU 2.111 + API fixa (índice legal e DGM) 1.881 (degrau 0 do MVP: R$ 5.190) + R$ 3.000 de operação multi-escritório **[premissa]**; **R$ 18,2 mil com pró-labore** de R$ 10 mil (MVP). Rateio por escritório = fixos × (clientes ÷ 100) ÷ N, em que N é o número de **escritórios médios equivalentes** ativos (10, 30 ou 100). Os três níveis estão definidos em 1.6.

**A. Os três níveis no médio, por configuração** (N = 30, sem pró-labore, tributos de 12,5%, comissão 0%; sistema-base sem GB):

| Configuração | (a) Contribuição | (b) Após fixos | (c) Líquida |
| --- | ---: | ---: | ---: |
| Sistema-base sem IA | 549 (39,9%) | 275 (20,0%) | 103 (7,5%) |
| + IA Operação para 5 (1/3) | 1.224 (52,7%) | 951 (41,0%) | 661 (28,5%) |
| + IA Operação para 15 | 2.576 (61,2%) | 2.303 (54,7%) | 1.777 (42,2%) |
| + IA Intensivo para 15 | 3.828 (65,3%) | 3.555 (60,6%) | 2.822 (48,1%) |

No **pequeno** (a / b / c): sem IA 67,5% / 59,2% / 46,7%; IA Operação para todos 69,5% / 65,2% / 52,7%. No **grande**: sem IA 4,3% / −31,1% / −43,6%; IA Operação para 1/3 38,9% / 21,7% / 9,2%; para todos 55,8% / 47,5% / 35,0% (6.4).

**B. O médio com IA Operação para 1/3, nos cenários de escritórios ativos e de fixos.** (b) e (c) com tributos de 8% e de 17%, sem e com comissão de 10%; rateio em R$ por mês:

| Escritórios ativos | Fixos | Rateio | (b) | (c) 8% / 17% | (c) com comissão 10%: 8% / 17% |
| --- | --- | ---: | ---: | ---: | ---: |
| 10 | sem pró-labore | 820 | 17,4% | 9,4% / 0,4% | −0,6% / −9,6% |
| 10 | com pró-labore | 1.820 | −25,6% | −33,6% / −42,6% | −43,6% / −52,6% |
| **30** | sem pró-labore | 273 | **41,0%** | **33,0% / 24,0%** | **23,0% / 14,0%** |
| 30 | com pró-labore | 607 | 26,6% | 18,6% / 9,6% | 8,6% / −0,4% |
| 100 | sem pró-labore | 82 | 49,2% | 41,2% / 32,2% | 31,2% / 22,2% |
| 100 | com pró-labore | 182 | 44,9% | 36,9% / 27,9% | 26,9% / 17,9% |

**C. Ponto de equilíbrio da plataforma**, em escritórios médios equivalentes (100 clientes), antes de tributos e após tributos de 12,5% (contribuição ÷ fixos; médio arredondado para cima):

| Configuração | Médio: sem pró-labore | Médio: com pró-labore | Médio, após tributos: sem / com | Pequeno (médios eq.): sem / com | Grande (médios eq.): sem / com |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sistema-base sem IA | **15** | **34** | 22 / 49 | 3,7 / 8,2 | 245 / 543 |
| + IA Operação para 1/3 | 7 | 15 | 9 / 20 | 2,6 / 5,8 | 13 / 29 |
| + IA Operação para todos | 4 | 8 | 4 / 9 | 1,8 / 4,1 | 4,5 / 9,9 |
| + IA Intensivo para todos | 3 | 5 | 3 / 6 | 1,4 / 3,1 | 2,8 / 6,2 |

O equilíbrio é calculado com os fixos de R$ 8,2 mil; **a v0.4 dizia 21 escritórios médios sem pró-labore e 47 com, só com o sistema-base**; com o suporte reduzido (v0.5) eram **15 e 32** e, com o chat de suporte (v0.7), **15 e 34**. Com IA Operação para todos são 4 e 8 (v0.5: 4 e 7). Só com o sistema-base, o grande (R$ 100 de contribuição) exigiria 245 médios equivalentes, ou 82 grandes: na prática não fecha. A implantação cobrada antecipa o equilíbrio do primeiro ano (8.4).

**D. Sensibilidades que podem piorar o quadro:**

- **Degraus de infraestrutura (MVP, 08).** O degrau 0 (R$ 8,2 mil) vale só até 50 usuários pagantes, cerca de 3 escritórios médios. Com 50 a 500 usuários (4 a 33 médios, degrau 1: infra 2.500, GPU 2.457, API fixa 1.881, operação 3.000) os fixos são **R$ 9,8 mil**; com 1.500 usuários (100 médios, degrau 2: infra 6.000, GPU 4.914, API fixa 3.475, operação 3.000) são **R$ 17,4 mil**. Para o médio com IA Operação para 1/3, a margem (b) cai de 17,4% para 10,5% (N = 10), de 41,0% para 38,7% (N = 30) e de 49,2% para 45,3% (N = 100).
- **Tributos.** A pesquisa 08 trabalha com 15,5% a 24,9% de tributos. Com 24,9%, a margem (c) do médio com IA Operação para 1/3 (N = 30) é de **16,1%**, contra 28,5% a 12,5%. A alíquota será discutida depois (P24).
- **Fixos com pró-labore** pesam mais que tudo no cenário de poucos escritórios: com 10 escritórios ativos o médio tem margem (b) de −25,6% (B).
- **Escritório que não leva IA.** Se metade dos escritórios médios ficar só com o sistema-base, o equilíbrio sobe de 3,2 para cerca de 5,2 escritórios médios (conta aproximada: contribuição média de R$ 1.563, entre R$ 549 e R$ 2.576).

### 9.5 Alavancas de custo

Checagem sem modelo (02); 60% a 75% dos tokens em modelo barato (R$ 4,98 a 3,34 por MTok); chat em modelo barato após o limite; cache de prefixo e semântico; despesa em reais (VPS no Brasil, MVP); contrato A do Integra; armazenamento em provedor mais barato. Todas dependem de medir no piloto.

### 9.6 A margem está na IA: margem da IA isolada e proporção mínima de IA

**A. Margem da IA isolada, com todos os custos de IA.** Receita dos planos menos: tokens (utilização do teto de 35%), infraestrutura rateada do assistente (R$ 14 por usuário), **suporte da IA** (R$ 8 por usuário com plano, **premissa a medir**) e **a parte de IA dos fixos da plataforma** (GPU R$ 2.111 e API fixa com ciclos da DGM R$ 1.881, **R$ 3.992 por mês**), rateada como em 9.4 (peso por clientes, N escritórios ativos). Médio, sem pró-labore (o pró-labore não entra: é custo de equipe, não de IA):

| Médio | N | Receita | Tokens e infra | Suporte da IA | Fixos de IA | **Sobra** | Margem | Após tributos de 12,5% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| IA Operação para 5 (1/3) | 10 | 945 | 269 | 40 | 399 | **237** | 25,0% | 12,5% |
| | 30 | 945 | 269 | 40 | 133 | **503** | 53,2% | 40,7% |
| | 100 | 945 | 269 | 40 | 40 | **596** | 63,1% | 50,6% |
| IA Operação para 15 | 10 | 2.835 | 807 | 120 | 399 | **1.508** | 53,2% | 40,7% |
| | 30 | 2.835 | 807 | 120 | 133 | **1.775** | 62,6% | 50,1% |
| | 100 | 2.835 | 807 | 120 | 40 | **1.868** | 65,9% | 53,4% |
| IA Intensivo para 15 | 30 | 4.485 | 1.206 | 120 | 133 | **3.026** | 67,5% | 55,0% |

Para o pequeno (N = 30), IA Operação para 2 usuários deixa 56,7% e para 5 usuários 63,1%; para o grande, 51,0% (13 usuários) e 62,0% (40 usuários). **Com 30 escritórios ou mais, a IA isolada fica entre 51% e 68% de margem, com todos os custos de IA; com 10 escritórios e IA só para 1/3 dos usuários, cai para 18% a 36%**, porque a GPU e a DGM são rateadas por poucos usuários. É a IA que carrega a margem de 60% do estudo; o sistema-base, não.

**B. Proporção mínima de usuários com IA que cobre a parte dos fixos no equilíbrio.** Fórmula: (rateio dos fixos − contribuição do sistema-base) ÷ (usuários × sobra de cada usuário). A sobra por usuário com plano, no provável, é de **R$ 59 (IA Essencial), R$ 135 (IA Operação) e R$ 219 (IA Intensivo)** (preço menos tokens e infraestrutura). "Após tributos" desconta 12,5% do preço de cada plano e do sistema-base. Os números abaixo são para o plano **IA Operação**; 0% significa que o sistema-base já cobre o rateio.

| Escritório | N | Fixos sem pró-labore: mínimo de usuários com IA Operação (antes / após tributos) | Fixos com pró-labore (antes / após tributos) |
| --- | ---: | ---: | ---: |
| **Pequeno** (5 usuários) | 10 | 0% / 0% | 0% / 0,3% |
| | 30 | 0% / 0% | 0% / 0% |
| | 100 | 0% / 0% | 0% / 0% |
| **Médio** (15 usuários) | 10 | **13,4% / 26,5%** | 62,7% / 86,3% |
| | 30 | 0% / 0% | **2,9% / 13,7%** |
| | 100 | 0% / 0% | 0% / 0% |
| **Grande** (40 usuários) | 10 | 43,6% / 59,4% | 99,1% / mais de 100% |
| | 30 | **13,3% / 22,6%** | 31,8% / 45,0% |
| | 100 | 2,7% / 9,7% | 8,2% / 16,5% |

Outros planos, no médio (N = 10 sem pró-labore, antes de tributos): IA Essencial 30,8%, IA Operação 13,4%, IA Intensivo 8,3%; (N = 30 com pró-labore, após tributos): 31,4%, 13,7% e 8,5%. No grande (N = 30, sem pró-labore, antes de tributos): 30,6%, 13,3% e 8,2%. (Números da v0.7, com o chat de suporte; na v0.5 o grande pedia 11,8% de IA Operação com 30 escritórios.)

**Leitura:** (1) o **pequeno** não precisa de IA para cobrir a sua parte: o sistema-base tem 67,5% de contribuição; (2) o **médio** precisa de IA Operação para **cerca de 1 em cada 7 usuários** com 10 escritórios ativos (13%) e para quase nenhum com 30 escritórios, mesmo com pró-labore (2,9%); a regra "um terço dos usuários" do atalho Operação cobre esses casos antes de tributos, mas **não** com 10 escritórios e pró-labore (63%); (3) o **grande**, com a contribuição do sistema-base ainda positiva (R$ 100), precisa de IA para **um oitavo a um quarto** dos usuários com 30 escritórios (13% a 23%) e, com 10 escritórios, de 44% (Operação). A redução do suporte tirou do grande boa parte da dependência da IA (v0.4: 21% a 32% com 30 escritórios; v0.5: 12% a 21%), mas não toda, e o chat de suporte devolveu um ponto ou dois: quanto mais o sistema-base é vendido perto do mercado, mais o equilíbrio depende da IA.

---

## 10. Decisões e perguntas para aval

### 10.1 Situação das perguntas

Respostas do usuário de 7/11/2026 (quatro rodadas) e de 8/11/2026 (quinta rodada). As 13 perguntas originais, as **7 da v0.3 (P14 a P20)** e as **4 da v0.4 (P21 a P24)** têm resposta; a v0.5 abriu **quatro perguntas (P25 a P28)**, sobre a ajuda do sistema, o teto dos conectores, o preço da implantação e o custo da hora. **Em 8/11/2026 o usuário respondeu P25, P26 e P27; só a P28 (custo real da hora) segue aberta, a medir nos primeiros escritórios.** Além disso restam as confirmações externas e a medição no piloto (10.3).

| # | Pergunta | Situação | Decisão ou hipótese adotada |
| --- | --- | --- | --- |
| P1 | **Quem assina o contrato do SERPRO:** a plataforma (modelo A) ou cada escritório (modelo B)? | **Respondido: segue** | A plataforma assina (volume somado) e o consumo é cobrado do escritório; B no piloto até ler o contrato-padrão (08, P1). |
| P2 | **Quem arca com o Open Finance?** | **Respondido: módulo à parte** | Cobrado do escritório, modular, **nunca embutido**. Teste: R$ 450 + R$ 6 por cliente conectado; custo = R$ 2.500 do agregador ÷ 10 escritórios + R$ 1 por cliente. |
| P3 | **Política de franquia de IA** | **Respondido: segue; refeito na v0.3** | Era franquia por usuário com excedente pago (16 MTok, R$ 18 por MTok, teto de 30). **A IA passou a planos por usuário com limite por janela de 5 horas e por semana (6.8)**; o excedente virou uso extra avulso (R$ 0,18 por UU). Limites e preços saem da medição no piloto. |
| P4 | **O preço é público e onde entra o BPO?** | **Respondido: decisão comercial do time de vendas; o configurador funciona nos dois casos** | A tabela pode ser pública ou só em propostas privadas; o time de vendas decide depois. Sobre o BPO, veja 10.2: os dois são módulos extras, fora dos pacotes. |
| P5 | **Qual estrutura de cobrança priorizar?** | **Respondido: uma equação (configurador modular)** | Cinco entradas: módulos, clientes por faixa, usuários, plano de IA por usuário e GB. A, B e C descartadas (6.7). |
| P6 | **Qual margem bruta-alvo?** | **Respondido: a margem de 60% fica só na IA; o sistema-base vai a preço de mercado** | A margem de 60% a 70% vale para a **IA** (planos por usuário, 6.8.5 e 9.6). O sistema-base sem IA é vendido um pouco acima da HubStrom, com margem de contribuição de 67,5% no pequeno, 39,9% no médio e 4,3% no grande, depois da redução do suporte, do teto dos conectores e do chat de suporte (v0.7; na v0.5, 68,5% / 42,0% / 7,8%; na v0.4, 62,3% / 28,6% / −13,5%); no conjunto, o médio tem 52,8% (IA Operação para 1/3) a 61,2% (para todos). As margens são mostradas em três níveis (1.6, 9.4); a de 60% era a de contribuição, não a final. |
| P7 | **O preço pode ficar acima da soma das peças de mercado?** | **Respondido: sim, um pouco acima do mercado** | Não há concorrente com sistema agêntico integrado. O sistema-base fica de 0% a 8% acima da tabela HubStrom no ponto de 200 clientes e 10 usuários (R$ 1.504 a 1.614 contra R$ 1.500; 25% a 35% acima do valor com desconto, 5.4); o Completo fica 1,05 vez a soma das peças públicas no médio (6.4). |
| P8 | **App por escritório na loja é cobrado à parte?** | **Respondido: segue, opcional e customizável** | Marca branca (R$ 150 na v0.4; era R$ 250) e app na loja (R$ 350) são complementos opcionais; sem eles, sistema e app usam a marca e os temas padrão da plataforma. |
| P9 | **Como a plataforma participa dos serviços extras do app?** | **Respondido: segue** | Valor fixo por cliente por serviço ativo; terceiros repassados ao custo (7.3). |
| P10 | **Subinquilinos: os clientes de todos somam para a faixa da mãe?** | **Respondido: somam** | A faixa do Modo BPO conta os clientes de todos os subescritórios; tema, domínio e app de cada um entram em R$ 120 por subescritório (6.5). Regra embutida no configurador. |
| P11 | **Armazenamento da plataforma:** quantos GB incluídos? | **Respondido: opcional por cliente, padrão de 5 GB** | Cobrado por GB contratado (R$ 0,45 no teste); quem usa a nuvem própria não paga GB; nuvens do escritório dentro da Base. |
| P12 | **Câmbio e tributo sobre IA importada** | **Respondido: segue** | R$ 7,97 por dólar até o parecer do contador. |
| P13 | **WhatsApp:** categorias e tarifa de IA da Meta | **Respondido: mantém** | O custo por mensagem vai ao escritório, ao custo da Meta; a plataforma só exibe a tarifa por categoria. A tarifa de "IA" (US$ 0,0625 por mensagem) continua a confirmar com a Meta antes de vender "a IA responde o cliente". |
| P14 | **Quantos níveis de IA?** "Três planos mais a opção sem IA (Essencial, Operação, Intensivo), ou menos níveis?" | **Respondido: segue a hipótese** | Três planos e sem IA: R$ 79, R$ 189 e R$ 299 por usuário (6.8.2). |
| P15 | **Bolsa compartilhada: sim ou não?** "O escritório pode comprar um pool de uso dividido entre os usuários, sem contas individuais?" | **Respondido: segue a hipótese** | Sim, opcional: R$ 90 + R$ 0,65 por UU por semana, limite de 60 UU por usuário a cada 5 horas (6.8.6). |
| P16 | **O limite semanal é igual ao do 02?** (terceira das sete perguntas da rodada) "O plano mais alto usa 1 MTok por 5 horas e 5 MTok por 7 dias, como o 02 propôs?" | **Respondido: está bom, segue** | O "02" é o [subplano 02, Time de agentes](subplanos/02-Time-de-Agentes.md), que propôs limites por usuário de **1 milhão de tokens por janela de 5 horas e 5 milhões por semana**. O IA Intensivo usa esses limites (100 UU por 5 horas e 500 UU por semana); o IA Operação a 60% e o IA Essencial a 20% (6.8.2). A pergunta era só se isso está bom. |
| P17 | **Ao atingir o limite, o chat passa a modelo mais barato?** "Quando a semana acaba, o chat continua, mas com um modelo mais simples?" | **Respondido: segue a hipótese** | Sim, com reserva de 30 UU por dia (R$ 5,4 por usuário por mês no pior caso); jobs e eventos pausam (6.8.4). |
| P18 | **Qual a política de uso extra?** "Quem pode comprar mais uso quando o limite acaba, e por quanto?" | **Respondido: segue a hipótese** | Pacote de 500 UU por R$ 90, válido por 30 dias, só o Administrador compra, com teto mensal de pacotes definido por ele (6.8.6). |
| P19 | **A utilização de 35% do teto vale como base do preço?** "Podemos supor que o usuário médio gasta cerca de um terço do limite, até medir?" | **Respondido: segue a hipótese; premissa a medir no piloto** | 35% no provável, 70% no alto, 100% no pior caso; o preço mantém 60% de margem até 54% a 56% do teto (6.8.5). |
| P20 | **O Consultor da empresa fica à parte, por cliente?** (sétima pergunta da rodada) Em linguagem simples: o Consultor da empresa é o **assistente de IA dentro do app do cliente do escritório**; ele responde dúvidas do cliente sobre a própria empresa dele (qual guia pagar, qual o prazo, qual a situação). A dúvida era se ele é vendido como **complemento separado, cobrado por cliente**, e não embutido no plano de IA dos usuários do escritório. | **Respondido: sim, à parte, por cliente; a venda é feita pelo próprio escritório** | R$ 10 por cliente ativo, franquia de 15 perguntas por cliente por mês, excedente R$ 0,40 (6.8.6). **O escritório ativa o serviço para cada cliente nas configurações do sistema e a cobrança da plataforma ao escritório, por cliente ativo, passa a valer automaticamente; o preço ao cliente final é do escritório** (6.8.6 e 7.3). Na calculadora, cada cliente ativado vira linha cobrada. |
| P21 | **O sistema-base pode ficar um pouco acima da HubStrom, com margem baixa?** "Aceita vender o sistema sem IA a R$ 1,5 mil a 1,6 mil no ponto de 200 clientes e 10 usuários (0% a 8% acima da tabela), sabendo que ele sozinho não paga a plataforma?" | **Respondido: segue a hipótese** | Sistema-base perto do mercado e margem alta só na IA (5.4, 6.3). Depois da redução do suporte e do teto dos conectores, o sistema-base tem 67,5% / 39,9% / 4,3% de contribuição (P / M / G; 6.4; v0.5: 68,5% / 42,0% / 7,8%, antes do chat de suporte). |
| P22 | **Os conectores de governo ficam embutidos, com franquia ou como consumo?** "A consulta paga (Integra, InfoSimples) vai no preço, tem franquia menor ou é cobrada do escritório pelo que usar?" | **Respondido: embutidos, com teto e extra acima do teto** | Integra, CNPJ e InfoSimples ficam no preço-base até o teto por cliente por mês (8 consultas, 1,6 emissão, 0,8 declaração e 0,27 consulta de CNPJ; 8,1 consultas de InfoSimples; era 10 / 2 / 1 / 0,3 e 10 até 7/11); acima dele, custo + 20% (3.11, 6.9). **O teto passou a 130% do uso provável em 8/11/2026 (P26).** |
| P23 | **Qual o suporte real por usuário?** "Quantas horas de suporte por mês um escritório de 15 e um de 40 usuários consomem?" | **Respondido: pode descer; a IA pequena de ajuda também serve de suporte** | R$ 12,50 no provável, R$ 6 no baixo e R$ 25 no alto (era 6 / 25 / 60); a ajuda do sistema (modelo pequeno) custa R$ 0,15 por usuário por mês (v0.8, com o diagnóstico: R$ 0,16; 3.3, 6.8.8); **o chat de suporte com pessoas soma R$ 2 por assento (v0.7, P25; 6.8.9)**. Os valores seguem a medir (10.3). |
| P24 | **Qual a alíquota de tributos e o regime?** "O contador do projeto confirma a faixa de 8% a 17% sobre a receita?" | **Respondido: manter assim, será discutido depois; percentuais estimados visíveis na calculadora** | 12,5% como valor de trabalho (faixa de 8% a 17%), editável no painel Premissas com comissão, câmbio, utilização do teto de IA, suporte, fixos, pró-labore e escritórios ativos (1.6, 6.10). A alíquota será discutida depois com o contador do projeto. |
| P25 | **A ajuda do sistema vale também para quem não tem plano de IA?** "Quem não tem plano de IA pode perguntar ao Assistente como usar o sistema, com uma franquia pequena (30 perguntas por mês), porque isso barateia o suporte humano?" | **Respondido em 8/11/2026: sim, e com chat de suporte com pessoas** | O sistema tem um **chat de suporte geral com pessoas** (a equipe da plataforma) e, nele, **incluído**, um **assistente de ajuda padrão e barato**: responde só sobre o sistema e as configurações dele, limite básico de 30 perguntas por usuário por mês (hipótese), para todo usuário (com ou sem plano de IA), sem consumir UU; ao atingir o limite, encaminha para a equipe. É da plataforma, não de um pacote de área. Custo: R$ 0,15 por usuário por mês no provável (R$ 0,47 no limite; v0.8, com o diagnóstico: R$ 0,16 e R$ 0,65) mais R$ 2 por assento do chat com pessoas; a margem de contribuição do sistema-base cai de 68,5% / 42,0% / 7,8% para 67,5% / 39,9% / 4,3% (6.8.9). |
| P26 | **O teto dos conectores deve ser folgado (162% do uso provável) ou mais apertado (130%)?** "Prefere que o escritório quase nunca pague extra, ou mais margem no uso alto?" | **Respondido em 8/11/2026: apertado, 130% do uso provável** | Teto de R$ 2,93 de custo por cliente por mês no Integra e CNPJ e R$ 1,78 no InfoSimples, somados no escritório (era R$ 3,64 e R$ 2,20). O uso alto do médio vai de −13,5% a −3,9% (−7,7% com o chat de suporte) e **a chance de cobrar extra de quem está no provável sobe**: R$ 86 por mês no médio se o uso real for 150% do estimado (3.11, 6.9). Medir o uso real e rever o teto a cada trimestre. |
| P27 | **Aceita cobrar a implantação de R$ 4,5 mil / 8,5 mil / 19,5 mil (tabela) com piso, quando o mercado negocia R$ 2,2 mil?** "O piso de 15% de margem fica, ou o time de vendas pode ir abaixo?" | **Respondido em 8/11/2026: o preço depende do contexto, mas o piso é a margem zero** | O time **nunca vende abaixo do custo de entrega**: piso de R$ 2.520 / 5.400 / 13.500 (28, 60 e 150 horas a R$ 90); a tabela continua R$ 4.500 / 8.500 / 19.500 e o desconto máximo é de 44% / 36,5% / 30,8%. A calculadora não deixa o desconto passar do piso e avisa em vermelho quando ele levaria abaixo do custo (8.3). O valor de R$ 2,2 mil do mercado daria prejuízo de R$ 0,3 mil, R$ 3,2 mil e R$ 11,3 mil. |
| P28 | **Qual o custo real da hora de implantação e quantas horas cada porte consome?** "Os R$ 90 por hora e as 28 / 60 / 150 horas valem?" | **Aberto: medir nos primeiros escritórios** | A R$ 130 por hora o sistema-base não fecha o caixa em 12 meses (e o piso sobe junto, porque é o custo); a R$ 70 fecha no mês 7 (8.6). |

### 10.2 O termo BPO tem dois sentidos neste projeto

Ambos são **módulos extras, opcionais, fora de qualquer pacote-base**, com parâmetros próprios no configurador:

1. **Modo BPO entre escritórios** (BPO-001 a BPO-023, [B10](../pesquisa/plataforma/B10-bpo-escritorios.md)): um escritório executa departamentos (fiscal, DP, contábil) para outros escritórios de contabilidade. É um **modo da plataforma**, com multi-inquilino em dois níveis: o inquilino BPO tem subescritórios (os contratantes), cada um com seus clientes. Parâmetros de teste: R$ 490 + R$ 120 por subescritório; a faixa soma os clientes de todos.
2. **Pacote BPO financeiro** (FIN-201, fase 3c): o escritório faz o contas a pagar e a receber das empresas clientes, no ERP financeiro que elas já usam. Exige Financeiro e App (dependências técnicas reais); o resto é recomendado e desmarcável. Parâmetros de teste da v0.6: R$ 390 de mensalidade-base + R$ 65 por empresa incluída (10.4).

### 10.3 Próximos passos

1. **Medir o suporte humano por assento (hoje R$ 12,50), o custo do chat de suporte (R$ 2 por assento), as perguntas de ajuda do sistema por usuário (e quantos chegam ao limite de 30) e a infraestrutura por cliente** (P23, P25): são as premissas que decidem se o sistema-base fecha (6.9). **Medir o uso real de Integra e InfoSimples por cliente** para validar o teto de 130% (P26). Depois, **medir UU por usuário e por semana no piloto**: a utilização do teto (35%) e a demanda bruta da v0.2 (239 MTok no médio) são as premissas que mais mudam o resultado; recalibrar limites, preços dos planos, bolsa e uso extra.
2. **Confirmar** com a Meta a tarifa de IA, com o SERPRO as faixas e o contrato-padrão, com o agregador o piso e o custo por conexão do Open Finance, e com o contador o câmbio e o tributo.
3. **Pedir cotação** de Acessórias, Conexa e Domínio Processos como cliente oculto, e **a cotação da HubStrom** para 100 e 300 clientes (a referência do grande é extrapolação, 5.3).
4. **Medir horas poupadas** (GES-056) nos escritórios do grupo: é a prova do preço acima das peças.
5. **Verificar com a engenharia** se o monitoramento fiscal pode usar o e-CAC por procuração e certificado em vez do Integra pago (3.10): pode valer até R$ 215 por mês de contribuição no médio.
6. **Medir o custo do BPO financeiro** (documentos por empresa, tokens e infraestrutura dos conectores de ERP), hoje **[premissa]**; confirmar as condições de API de Conta Azul, Omie, Nibo, Bling e Granatum (subplano 10, seção 8).
7. **Medir as horas e o custo da hora de implantação** nos primeiros escritórios do grupo (P28) e **testar o preço e o piso da implantação** com o time de vendas (P27); medir o ritmo de vendas, o desconto concedido e o cancelamento nos três primeiros meses (8.5 a 8.7).
8. Repetir as contas com os dados medidos, publicar os parâmetros definitivos em `precificacao/parametros.json` e fechar a versão 1.0.

### 10.4 Pacote BPO financeiro: recalibração da v0.6 (8/11/2026)

**Decisão do usuário (P14 do subplano 10):** o pacote BPO financeiro é "praticamente um sistema inteiro novo". Ele paga **pelo acesso** (a assinatura da plataforma sobe junto com o sistema) e **por empresa cliente incluída**. O cliente paga o próprio ERP.

| Parte | Teste v0.6 | Custo provável | Observação |
| --- | --- | --- | --- |
| Mensalidade-base do pacote, por escritório | R$ 390 | R$ 30 (15 / 30 / 60) | Acesso ao sistema do BPO: painel, fila, aprovação, alçadas, SLA |
| Valor por empresa cliente incluída | R$ 65 (era R$ 12; proposta de R$ 18) | R$ 12: IA R$ 9 (4 / 9 / 18) + conector de ERP R$ 3 (1 / 3 / 8) **[premissa]** | Sem tarifa de terceiros conhecida nos conectores de ERP **[a confirmar]** |

**Referências de mercado** (S5; páginas comerciais, sem auditoria): Sofia R$ 250 por organização ativa (R$ 179 no Founders, mínimo de 3), que é o teto de referência; BPO Suite R$ 299 (3 CNPJs), 475 (5), 800 (10), 1.750 (25), CNPJ extra de R$ 70 a 99; Conta Azul Pro BPO R$ 129,90 por licença; Nortcash R$ 179 a 467. O pacote sozinho fica um pouco acima do BPO Suite em 10 e 25 empresas (R$ 1.040 contra 800; R$ 2.015 contra 1.750) e no mesmo nível em 40 (R$ 2.990 contra cerca de R$ 3.018). O preço total do escritório (plataforma, IA, Open Finance) fica em R$ 158 por empresa no BPO puro de 40 empresas, contra R$ 250 da Sofia. Sensibilidade do valor por empresa: R$ 48, R$ 65 e R$ 90 dão R$ 5.638 (R$ 141 por empresa), R$ 6.318 (R$ 158) e R$ 7.318 (R$ 183) no caso 2, ainda abaixo da Sofia.

**Três simulações do subplano 10** (configurador v0.7, com o chat de suporte de R$ 2 por assento e o teto de 130%; perfil provável, câmbio R$ 7,97, sem armazenamento da plataforma; margens: (a) contribuição, (b) após fixos rateados, (c) líquida com tributos de 12,5%; entre parênteses, a v0.6):

| | **Caso 1** · Contabilidade com BPO de 10 empresas (100 clientes, 15 usuários) | **Caso 2** · BPO financeiro puro, 40 empresas, 6 usuários | **Caso 3** · BPO entre escritórios, 8 subescritórios, 160 clientes, 12 usuários |
| --- | ---: | ---: | ---: |
| Preço mensal | R$ 3.692 | R$ 6.318 | R$ 5.371 |
| Custo provável | R$ 1.417 (1.387) | R$ 1.473 (1.461) | R$ 1.963 (1.939) |
| (a) Margem de contribuição | **61,6%** (62,4%) | **76,7%** (76,9%) | **63,4%** (63,9%) |
| (b) Após fixos rateados | 54,2% (55,0%) | 74,9% (75,1%) | 55,3% (55,7%) |
| (c) Líquida | 41,7% (42,5%) | 62,4% (62,6%) | 42,8% (43,2%) |
| (a) no uso alto | 30,8% (30,0%) | 54,1% (54,5%) | 29,2% (27,3%) |
| Parte do BPO | Pacote R$ 1.040 (R$ 104 por empresa) | Pacote R$ 2.990 (R$ 75 por empresa) | Modo BPO R$ 1.450; Financeiro conta os 8 contratantes (P9, respondida) |

**Nota v0.9 (9/11/2026):** com o App a R$ 0,60 por cliente, os preços passam a R$ 3.720 / 6.330 / 5.412 (custos iguais); (a) 61,9% / 76,7% / 63,7%; (b) 54,6% / 75,0% / 55,6%; (c) 42,1% / 62,5% / 43,1%; (a) no uso alto 31,3% / 54,2% / 29,7%. Sem o pacote: caso 1 R$ 2.680 (52,7%), caso 2 R$ 3.340 (71,2%). Caso 2 segue em R$ 158 por empresa; sensibilidade R$ 48 / 65 / 90: R$ 5.650 / 6.330 / 7.330. A tabela acima fica como registro da v0.7/v0.8.

Composição: caso 1 com marca branca, Open Finance (10), IA Operação para 3; caso 2 com núcleo no lugar do Painel (sem pacote Contábil), CRM, Timesheet, App, Financeiro, marca branca, Open Finance (40), IA Intensivo para 6; caso 3 com Painel, CRM, Timesheet, App, Financeiro (8), gov, est, cores, marca branca, modo BPO (8), IA Operação para 12. **Sem o pacote**, o caso 1 vale R$ 2.652 (52,2%) e o caso 2, R$ 3.328 (71,1%). O chat de suporte soma R$ 30, R$ 12 e R$ 24 ao custo dos três casos (15, 6 e 12 usuários); no uso alto, o teto de 130% cobra excedente dos conectores nos casos 1 e 3, e por isso a margem alta sobe.

**Correção de custo.** A tabela anterior do subplano 10 trazia custos de R$ 1.540, R$ 1.880 e R$ 2.730, que **não se reproduzem** com os parâmetros 0.5 (o preço do caso 3, R$ 5.371, sim); a diferença era de R$ 200 a R$ 790 e a origem não foi achada. Os números acima vêm direto do configurador, com 299 verificações em `teste_configurador.js`; as margens sobem em parte por essa correção. **Regras do subplano 10 que valem aqui:** o BPO que atende escritórios (caso 3) assina a plataforma e o contratante é cliente dele, com portal de convidado **sem preço por usuário** (teto de abuso de 10 convidados por contratante, editável; P5); o Financeiro conta só os contratantes (P9); não se cobra por aba nem por setor (P8). **Não entram:** implantação, WhatsApp (repassado), tarifas de banco e provedor, o desenvolvimento e a manutenção dos conectores de ERP, e o suporte específico do BPO. **Medir no piloto.**

| # | Pergunta | Situação | Decisão ou hipótese |
| --- | --- | --- | --- |
| P29 | **Preço do pacote BPO financeiro:** mensalidade-base e valor por empresa (P14 do subplano 10) | **Respondido em direção; valores são teste** | Duas partes, calibradas pela Sofia como teto e pelo BPO Suite como piso: R$ 390 + R$ 65 por empresa. O time de vendas ajusta; o configurador tem os dois campos editáveis. |

## Nota de arquitetura (DA-02, 8/11/2026)

O módulo **Painel** deste estudo é o **pacote de área Contábil**, não um módulo universal obrigatório. A assinatura é plataforma + pacote(s) de área + módulos extras; outro produto (por exemplo, BPO financeiro ou Direito) troca o pacote. A estrutura de preço (base, faixa de clientes, usuários, GB, planos de IA, complementos) continua valendo; o que muda por produto são os parâmetros do pacote. A recalibração por pacote fica para quando houver mais de um.

## Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [subplano 10](subplanos/10-BPO.md), seções 9 e 11.2 (A1, A12, A14 e A20). A v0.6 já trouxe o pacote BPO financeiro (R$ 390 + R$ 65 por empresa), o conector de ERP no custo, o produto sem Contábil (`nucleo_sem_contabil`) e o Financeiro contando os contratantes; o que faltava nas regras:

- **A equação ganha uma camada:** preço = núcleo + pacotes de área + módulos + planos de IA + complementos. **Núcleo** (B 100 + 0,30 por cliente efetivo + 5 por usuário) e **pacote Contábil** (B 100 + 0,40 por cliente efetivo) somam o Painel atual (200 + 0,70): quem só compra o Contábil paga o de hoje. O C1 (BPO financeiro puro) usa o núcleo sem o Contábil. **Pendência de código:** falta no configurador a seleção "produto" (núcleo e pacotes separados), sem alterar preço; os "pacotes" do Estudo (8.1: Essencial, Operação, Completo) são **atalhos do configurador**, não "pacotes de área".
- **Sem dupla cobrança** (DA-02.1, regra 8): plataforma, faixa de clientes, usuários e GB são cobrados **uma vez** (o cliente atendido pelos dois pacotes conta uma vez); o componente do Financeiro é cobrado pelo módulo Financeiro e o valor por empresa do pacote BPO cobre só rotinas, alçadas, fila, aprovação, perfil, conectores de ERP e IA de BPO; **uma contratação de Open Finance** serve aos dois titulares; App, CRM, Timesheet e plano de IA são cobrados uma vez por cliente ou usuário.
- **Dependências (P6):** só as técnicas reais são obrigatórias (o pacote BPO exige núcleo, Financeiro e App; o modo BPO exige um pacote com setor executado, e não necessariamente o Painel, como diz 2.2); Timesheet, CRM e Open Finance são **recomendados e desmarcáveis**.
- **Não se cobra por aba nem por setor** (P8): desativar um setor ou uma aba não reduz o preço; os módulos são opcionais, as abas não.
- **Modo BPO (P5 e P9):** o BPO assina; o contratante é cliente do BPO e recebe **portal de convidado sem preço por usuário**, com teto de abuso de 10 convidados por contratante (editável, não é cobrança); o Financeiro conta os contratantes, e os clientes finais de todos somam para a faixa (P10).
- **"Exige: Painel"** nas tabelas 2.2 e 6.2 e em `parametros.json` (CRM, Timesheet, App, Financeiro, modo BPO) deve ser lido como **núcleo mais um pacote de área** (o C1 usa o núcleo sem Contábil; o caso 2 já foi simulado assim). **Corrigido em 8/11/2026: as tabelas e as notas de `parametros.json` dizem "Exige: pacote de área"**; a chave técnica `painel` segue sendo o pacote Contábil e a seleção "produto" no configurador continua pendente de código. A linha do Modo BPO em 6.4 ("tema, domínio e app de cada um") é anterior à P5 e à P10: o contratante recebe portal de convidado e PWA, e o app com a marca dele na loja é opção cobrada à parte.
- **Regras de venda por ordem (P1):** primeiro o B (contabilidade que compra o BPO financeiro), depois o C1, por último o C2.

## Adendo: decisões do UI lab, segunda rodada (8/11/2026)

- **Suporte desenhado:** a tela tem Ajuda do sistema (30 perguntas por mês, fora do limite de IA), Falar com a equipe (com **fila** e aviso **fora do horário**) e Histórico (Desenho 1.10). Os R$ 2 por assento do chat com pessoas (6.8.9) cobrem ferramenta e **cobertura de horário**: a fila e o aviso fora do horário assumem horário comercial, sem plantão; se a equipe passar a atender fora dele, o custo sobe **[premissa a medir]**. O diagnóstico por **compartilhar a visão** da tela, com pedido prévio, consentimento, prazo e registro, foi **decidido em 8/11/2026** (Q9) e não tem custo novo (6.8.8); o assistente também lê, só pelo escopo de quem perguntou, com custo pequeno (adendo v0.8).
- **BPO:** o módulo extra ligado em Configurações › Assinatura aparece **sem preço** no wireframe; os valores seguem os de 9.1 do 10 (parâmetros de teste). A fatura é uma por cliente, com linhas por serviço (honorário contábil, mensalidade do BPO e excedente; Q6, **decidida**), e as NFS-e saem por serviço.

## Adendo: respostas finais do BPO, faturamento e suporte (8/11/2026)

- **Suporte com diagnóstico (Q9 do 10):** o assistente de ajuda deixa de ser "sem acesso a dados" e passa a **ler configurações, dados e estrutura do escritório pelo escopo de quem perguntou**, sem escrever. Premissa nova (6.8.8): 20% das perguntas viram diagnóstico no provável, com 3 chamadas de leitura de 3 mil tokens. **Efeito: R$ 0,011 por usuário por mês no provável** (a ajuda vai de R$ 0,15 para R$ 0,16), R$ 0,18 no alto (de R$ 0,47 para R$ 0,65) e R$ 0,001 no baixo; no escritório M, R$ 0,16 por mês; margem sem mudança perceptível. **Os totais foram refeitos na v0.8** (adendo do topo, 3.3, 6.4, 6.9, 9.2 e 10.4): a ajuda é R$ 0,16 (provável) e R$ 0,65 (alto) nas tabelas e na calculadora.
- **Faturamento conjunto (Q6):** uma cobrança por mês, serviços em linhas, NFS-e por serviço. O custo do integrante de NFS-e (Asaas, R$ 0,49 por nota; Focus, R$ 94,90 por mês) passa a contar **por serviço**: com dois serviços, uma nota a mais por cliente por mês, R$ 0,49 a mais por cliente com Asaas (pago pelo escritório, fora do total, 3.4); com o Focus, só pesa se passar da franquia de notas do plano **[a confirmar]**.
- **Papel por serviço (Q8):** sem efeito de preço; o assento do usuário e o contato continuam um só.

## Adendo: últimas decisões (8/11/2026)

- **Totais refeitos com o diagnóstico (v0.8):** ajuda a R$ 0,06 / 0,16 / 0,65 por usuário por mês; `parametros.json` (`ajuda.diagnostico`), calculadora e `teste_configurador.js` (304 verificações) atualizados. Sistema-base sem IA, P / M / G: margem provável **67,5% / 39,9% / 4,3%** (sem mudança na primeira casa; −0,005 / −0,012 / −0,019 ponto) e no alto 35,3% / −7,7% / −54,2% (−0,09 / −0,17 / −0,25 ponto). Caixa de 12 meses: sem mudança nos meses; necessidade máxima do sistema-base R$ 21,1 mil (+R$ 6).
- **FAQ:** primeira camada da Ajuda, antes do assistente e da equipe; custo de conteúdo e manutenção, R$ 0 nos totais (6.8.10).
- **Suporte humano a R$ 25:** comparação em 6.8.10; com R$ 25 no provável a margem do sistema-base seria 61,2% / 26,2% / −17,3%.
- **Custo-hora:** único, do escritório, com todos os pacotes; por pacote é extra opcional; o BPO é filtro (6.8.10).
- **NFS-e:** o layout nacional decide; uma NFS-e por serviço como padrão. O custo do integrante (Asaas, R$ 0,49 por nota) segue contando por serviço (3.4); vários itens por nota só se a NT 007/2026 confirmar **[a confirmar]**.


## Adendo: pacote Jurídico, parâmetros aprovados (9/11/2026)

Resposta do usuário: segue hipótese em JU-05 (a a k) e JU-04 (7 e 8). **Valores de teste, sem medição**; a calculadora e `parametros.json` **não** foram alterados (o Jurídico só será construído depois do BPO). Quando for construir, acrescentar:

| Item | Valor de teste |
| --- | --- |
| Piso mensal do Jurídico | R$ 250 (Contábil: R$ 700) |
| Módulos da plataforma com preço por pacote | Timesheet 20 + 7 por usuário; Financeiro 30 + 0,40 por cliente; App 30 + 0,15 por cliente; CRM 40 + 0,40 por cliente + 2 por usuário |
| Pacote Jurídico | 30 + 18 por usuário + 0,12 por processo; faixas de processos 100: 1,00 / 300: 0,90 / 1.000: 0,80 / acima: 0,70 |
| Captura de publicações | R$ 15 por inscrição OAB, pré-marcada; custo 2 / 4 / 8 |
| Monitoramento de andamentos | por processo, custo + 20% (referência R$ 1,80; custo R$ 1,00 a 2,00) |
| Peticionamento assistido | R$ 19 por inscrição |
| IA, utilização do plano no Jurídico | 0,15 / 0,50 / 0,80 / 1,00 (Contábil: 0,15 / 0,35 / 0,70 / 1,00) |
| Módulos de lei | por escritório, assentos incluídos; Trabalhista 60, Família e Sucessões 60, Penal 90; curadoria R$ 1.500 (v1) |
| Fixos do pacote | R$ 6.000 por mês até medir |
| Implantação | solo gratuita em autoatendimento; assistida R$ 900 (piso R$ 540) |
| Atalho Essencial | R$ 395 |

Cota de IA ponderada pelo modelo e franquia por documentos (JU-04, 7). A calculadora precisará de seletor de pacote de área, campos de processos e inscrições OAB e tabela por pacote.


## Adendo: App incluído e preço por cliente (v0.9, 9/11/2026)

**Decisão do usuário (9/11/2026):** o App do cliente continua **incluído por padrão** nos pacotes e atalhos do Contábil e do BPO, sem contratação extra. O que se vende à parte é a **marca branca** (R$ 150 por mês) e o **app próprio na loja** (R$ 350 por mês, mais a publicação inicial), que já existem como complementos pagos (7.1) e não mudam. Como o App vem incluído, o **valor por cliente sobe**. O CRM fica como está (o piso de 0,75 sugerido antes não foi aplicado). A mesma regra vale para os demais pacotes de área (o Jurídico segue no próprio adendo).

**Novo valor: R$ 0,60 por cliente efetivo** (era R$ 0,30); a base de R$ 80 fica igual. Critério: depois do fator de faixa, o preço de cada cliente adicional deve cobrir o custo provável do App (R$ 0,20 por cliente) com **folga de 50% ou mais** em todas as faixas até 1.000 clientes. Com R$ 0,30, a faixa de 251 a 500 já ficava abaixo do custo (R$ 0,195) e a de 501 a 1.000 em R$ 0,165. R$ 0,50 não basta (R$ 0,275 na faixa de 501 a 1.000, folga de 38%); **R$ 0,60 é o menor valor testado que cumpre** (R$ 0,33, folga de 65%; acima de 1.000, R$ 0,30, folga de 50%). R$ 0,70 também cumpre, mas sobe o preço sem necessidade.

| Faixa de clientes | Fator | R$ 0,30 (antes) | R$ 0,50 | **R$ 0,60 (v0.9)** | R$ 0,70 |
| --- | ---: | ---: | ---: | ---: | ---: |
| até 30 | 1,00 | 0,300 (+50%) | 0,500 (+150%) | **0,600 (+200%)** | 0,700 (+250%) |
| 31 a 60 | 0,92 | 0,276 (+38%) | 0,460 (+130%) | **0,552 (+176%)** | 0,644 (+222%) |
| 61 a 120 | 0,85 | 0,255 (+27%) | 0,425 (+113%) | **0,510 (+155%)** | 0,595 (+197%) |
| 121 a 250 | 0,75 | 0,225 (+12%) | 0,375 (+88%) | **0,450 (+125%)** | 0,525 (+162%) |
| 251 a 500 | 0,65 | 0,195 (−3%) | 0,325 (+63%) | **0,390 (+95%)** | 0,455 (+127%) |
| 501 a 1.000 | 0,55 | 0,165 (−18%) | 0,275 (+38%) | **0,330 (+65%)** | 0,385 (+93%) |
| acima de 1.000 | 0,50 | 0,150 (−25%) | 0,250 (+25%) | **0,300 (+50%)** | 0,350 (+75%) |

(Entre parênteses, a folga sobre o custo provável de R$ 0,20 por cliente.)

**Efeito no preço e na margem de contribuição** (uso provável, escritórios-tipo P / M / G de 8.1; o custo não muda; a linha do App passa de R$ 89 / 108 / 152 para R$ 98 / 135 / 223):

| Pacote | Porte | Preço antes | Preço v0.9 | Diferença | Margem antes | Margem v0.9 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Sistema-base (sem IA) | P | R$ 990 | R$ 999 | +R$ 9 | 67,5% | 67,8% |
| | M | R$ 1.376 | R$ 1.404 | +R$ 27 | 39,9% | 41,0% |
| | G | R$ 2.314 | R$ 2.386 | +R$ 72 | 4,3% | 7,2% |
| Essencial | P | R$ 704 | R$ 713 | +R$ 9 | 65,8% | 66,2% |
| | M | R$ 977 | R$ 1.005 | +R$ 27 | 35,4% | 37,2% |
| | G | R$ 1.637 | R$ 1.709 | +R$ 72 | −3,4% | 0,9% |
| Operação | P | R$ 1.436 | R$ 1.445 | +R$ 9 | 68,0% | 68,2% |
| | M | R$ 2.546 | R$ 2.574 | +R$ 27 | 53,0% | 53,5% |
| | G | R$ 5.446 | R$ 5.518 | +R$ 72 | 41,0% | 41,8% |
| Completo | P | R$ 2.122 | R$ 2.131 | +R$ 9 | 70,2% | 70,3% |
| | M | R$ 4.635 | R$ 4.663 | +R$ 27 | 62,2% | 62,4% |
| | G | R$ 10.940 | R$ 11.011 | +R$ 72 | 57,0% | 57,3% |

**Outras margens do sistema-base (P / M / G):** após fixos rateados (b) 59,6% / 21,6% / −27,2% (eram 59,2% / 20,0% / −31,1%); líquida (c) 47,1% / 9,1% / −39,7% (eram 46,7% / 7,5% / −43,6%); uso alto 35,8% / −5,9% / −50,5% (eram 35,3% / −7,7% / −54,2%). O Essencial do grande sai do negativo (−3,4% para 0,9%), mas segue no limite: o problema do grande continua sendo o custo por cliente do Painel e dos conectores, não o App (6.9). Ponto de equilíbrio da plataforma (9.4, médio equivalente): 15 escritórios sem pró-labore (igual) e **32 com pró-labore** (eram 34). Caixa de 12 meses do sistema-base (8.5): mesmos meses (caixa positivo no mês 12, resultado positivo no mês 7), necessidade máxima de R$ 20,2 mil (era 21,1 mil) e acumulado no mês 12 de R$ 5,3 mil (era 1,4 mil).

**Comparação com o HubStrom (com app de marca branca, 5.3 e 5.4):** o sistema-base fica um pouco mais acima do mercado. Contra a tabela: P +20,8% (era +19,7%), M +11,7% (era +9,5%), G +36,9% (era +32,8%). Contra o valor negociado pelo usuário (80% da tabela): P +51,0% (era +49,6%), M +39,6% (era +36,9%), G +71,1% (era +66,0%). O HubStrom cobra o app à parte (R$ 300); no nosso preço o App já vem dentro, e a diferença de R$ 9 a 72 por mês continua menor que esse valor. O argumento de venda segue o de 5.4: captura de notas e conectores dentro do preço, o que o mercado vende à parte.

**Pacote BPO (10.4 e subplano 10):** custos iguais; preços dos três casos R$ 3.720 / 6.330 / 5.412 (eram 3.692 / 6.318 / 5.371), margem de contribuição 61,9% / 76,7% / 63,7%. O caso 2 continua em R$ 158 por empresa, abaixo da Sofia (R$ 250). Nota curta acrescentada em 10.4 e no subplano 10.

**Arquivos:** `parametros.json` e a calculadora (versão "parametros de teste 0.9", 9/11/2026; `modulos.app.preco.cliente` = 0,6) e `teste_configurador.js` (**310 de 310 verificações**: os valores fixos das tabelas 6.4, 8.1, 9.2, 9.4, do caixa e dos casos do BPO foram refeitos; a regressão da v0.4 restaura o App a R$ 0,30, como os demais valores históricos; o preço do sistema-base passou a ser conferido também por uma conta à parte, a partir dos parâmetros crus). As tabelas das seções 6 a 10 ficam como registro da v0.8; vale este adendo onde houver diferença. **Marca branca e app próprio na loja continuam complementos pagos**, sem mudança.

## Adendo: comunicação interna (14/11/2026)

A comunicação interna ([subplano 11](subplanos/11-Comunicacao-Interna.md)) entra na plataforma, sem preço próprio. Premissa de custo: R$ 0,20 a R$ 1,00 por usuário por mês **[a medir]**, dentro da linha do Painel; ainda **não** está em `parametros.json` nem na calculadora (entra quando houver medição ou se o Enzo pedir).
