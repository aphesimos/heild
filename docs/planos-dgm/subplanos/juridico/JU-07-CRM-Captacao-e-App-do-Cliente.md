# Subplano JU-07 · CRM jurídico, captação e app do cliente (pacote Jurídico)

**Versão 0.1 · 9/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Adapta ao pacote Jurídico os modelos do [Subplano 04 (CRM)](../04-CRM.md) e do [Subplano 06 (App do cliente)](../06-App-do-Cliente.md) do Contábil, sobre a plataforma comum (DA-02 e DA-02.1 do [Plano da Plataforma](../../Plano_Plataforma_do_Escritorio.md)). Fontes: [Conferência do pacote Jurídico](../../Conferencia_Pacote_Juridico.md) (que propôs este subplano), [Síntese](../../Sintese_Pacote_Juridico.md), JU-01 a JU-05 e as pesquisas J3 (atividades JUR), J7 (SGJur) e J8 (matriz). **[a confirmar]** marca o que nenhuma fonte verificou. **Nenhuma norma da OAB foi lida em texto oficial** para este documento (a tentativa de abrir o site da OAB falhou por rede): tudo o que cita Provimento 205/2021, Código de Ética e Disciplina (CED), Estatuto da Advocacia (EAOAB) ou Lei 14.063/2020 vem do resumo das buscas e **precisa de conferência pela advogada da família e, antes de vender, por advogado de ética**. Entidades de nome fixo: Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato (o de cláusulas e vigência) e *Contrato de honorários* (JU-05).

**Resumo para quem não é advogado.** No Contábil, o CRM busca clientes: responde, manda proposta, lembra, faz campanha. Na advocacia, a OAB restringe como o advogado pode se oferecer ao público; um sistema que fizesse "régua de vendas" ou "campanha para quem não contratou" colocaria o escritório em risco disciplinar. Por isso este subplano faz o CRM jurídico com **travas de fábrica**: o sistema ajuda o escritório a atender quem o procurou, **checar se pode aceitar o caso** (conflito de interesses: não atender dois lados opostos), formalizar a contratação (procuração e contrato de honorários) e manter o cliente informado, mas **não** a perseguir ninguém. A segunda metade descreve o **app do cliente**: o cliente vê o andamento do processo em palavras simples, só depois de o advogado liberar o que vale mostrar, e nunca vê o que é interno (estratégia, minutas, notas, conflito, horas).

---

## 1. Escopo e princípios

### 1.1 Dentro e fora

**Dentro:**
- (A) **CRM jurídico:** funil de captação e intake (primeiro contato, triagem, consulta, proposta, contratação); **checagem de conflito de interesses** e acesso ao registro de conflitos; regras de publicidade e captação como travas de desenho; retenção e finalidade LGPD de quem consultou e não contratou; indicação e parceria entre advogados; WhatsApp com um número por setor e uso de áudio; tarefas a partir de conversas; ligação com o Caso.
- (B) **App do cliente jurídico:** login; andamento traduzido; envio de documentos; assinatura (só a ligação com o app); pagamento de honorários; agendamento; aviso de audiência; o que o cliente nunca vê; cliente pessoa jurídica com vários usuários; marca branca e web instalável.
- **Itens de custo** de WhatsApp e de IA, como entrada para o JU-12 (seção 11).

**Fora (e onde está):**
- Campos do Lead, do Caso, da Verificação de conflito e do Mandato: **JU-01** (aqui só os campos que o CRM acrescenta, seção 13.1).
- Mecânica da assinatura, modelos de procuração e geração do Contrato de honorários a partir da proposta: **JU-08** (a conferência o propôs; ainda não escrito).
- Cobrança, parcelas, conta do cliente, partilha: **JU-05**.
- Tradução jurídica do andamento (texto-base, vigência) e termo de IA: **JU-04**. Time de agentes, promoção "faz sozinho": **JU-06** (a escrever).
- Segurança, LGPD em profundidade (RIPD, encarregado, resposta a incidente, conflito entre LGPD e sigilo): **JU-10** (a escrever).
- Preço e calculadora: **JU-12** (a escrever). Departamento jurídico de empresa e contencioso de massa: fora do primeiro lançamento (decisão de 8/11/2026).

### 1.2 Termos em linguagem simples

| Termo | O que quer dizer aqui |
| --- | --- |
| **Intake** (ou triagem) | A primeira entrevista: quem é a pessoa, o que quer, se há urgência, em que área do direito cai |
| **Conflito de interesses** | Situação em que atender um novo cliente prejudicaria outro, atual ou antigo (ex.: defender quem o escritório já processou em nome de outro cliente). O advogado deve checar **antes** de aceitar |
| **Procuração** (Mandato) | Documento em que o cliente dá ao advogado poderes para agir por ele |
| **Contrato de honorários** | O acordo do preço do serviço (JU-05) |
| **Publicidade ativa e passiva** | Passiva: a pessoa chega até o escritório (site, indicação, ela escreve primeiro). Ativa: o escritório vai atrás (anúncio, mensagem a quem não pediu). O Provimento 205/2021 trata as duas de modo diferente **[a confirmar]** |
| **Captação de clientela** | Procurar cliente de modo que a OAB proíbe (ex.: abordar quem não pediu, usar preço ou "grátis" como isca). **[a confirmar o alcance no texto oficial]** |
| **Sigilo profissional** | O advogado não revela o que sabe do cliente; vale também para quem só consultou **[a confirmar]** |
| **Ciência** | Abrir uma intimação ou citação eletrônica faz o prazo começar a correr; nunca é do sistema nem do agente (regra unificada 4) |

### 1.3 Princípios

| # | Princípio | Consequência no desenho |
| --- | --- | --- |
| CR1 | **O escritório atende; não persegue.** O CRM jurídico responde a quem procurou e acompanha quem é cliente; nunca abre contato por conta própria com quem não pediu | Sem campanha a leads e a ex-consultas; sem "régua de lembrete" automática a lead; seção 5 |
| CR2 | **Conflito antes de aceitar.** Sem Verificação de conflito decidida, não há Mandato, Prazo nem tarefa do Caso (JU-01, 3.2: `aguardando_conflito` bloqueia) | `lead.fechar_contrato` recusa sem decisão do sócio |
| CR3 | **Quem consultou tem sigilo, mesmo sem contratar** [a confirmar] | A consulta com conteúdo vira Caso `em_estudo` com sigilo desde o início (seção 3.3) |
| CR4 | **Registro de conflitos é lista sensível, com acesso restrito** | Nome e documento entram na varredura; o conteúdo do Caso restrito não (JU-01, 4.2); seção 4.5 |
| CR5 | **Publicidade sóbria por desenho** (Provimento 205/2021 [a confirmar]) | Modelos de mensagem aprovados, checklist de vedações, nenhum modelo cita preço, "grátis", desconto ou promete resultado |
| CR6 | **IA exige termo do cliente** (regra do pacote; Rec. CFOAB 001/2024 [a confirmar texto]) | Sem termo registrado, o integrante não lê conteúdo do Caso nem transcreve áudio dele |
| CR7 | **Ciência nunca é delegável** | O app e o WhatsApp nunca abrem Comunicação de ofício; seção 10.5 |
| CR8 | **O cliente lê só o que o advogado liberou, em linguagem simples** | Andamento visível = `visivel_ao_cliente`; automático só para andamento relevante, de modelo aprovado |
| CR9 | **Um cadastro, um número por setor, um fio** (DA-02.1; 04, 3.1) | O cliente que também é do Contábil é a mesma pessoa; a conversa liga ao Caso por etiqueta |
| CR10 | **Mensagem e push não carregam o conteúdo do Caso** | Só "há novidade; abra o app" (seção 10.11) |
| CR11 | **Custo variável é visível** (WhatsApp ao custo da Meta; IA no plano do usuário) | Seção 11; nada de pedágio escondido (JU-05, H10) |
| CR12 | **A responsabilidade é do advogado.** O sistema não aconselha, não estima êxito, não promete | Texto de interface; o integrante nunca opina (JU-04, 4.5) |

---

## 2. Visão geral

Primeiro contato, triagem, consulta, proposta, contratação, Caso ativo e cliente no app. O funil é o do Contábil com cinco diferenças: (1) a etapa **Consulta** é jurídica e já tem sigilo; (2) o **conflito** é uma trava em três pontos; (3) a **proposta** só sai por pessoa e sem as iscas vedadas; (4) a **contratação** junta três documentos (procuração, contrato de honorários, termo de ciência de IA); (5) não há "campanha" nem "reativação".

---

## 3. O funil de captação e intake

### 3.1 As etapas

Segunda aba do item CRM (Leads), com as etapas abaixo (o quadro é o do 04, 6.1; os nomes são do jurídico). Visível a quem tem o setor Gestão e Atendimento e ao Administrador; o advogado responsável vê os leads da área dele.

| Etapa | Entra quando | Sai quando | Quem decide | Travas |
| --- | --- | --- | --- | --- |
| **Primeiro contato** (JUR-001) | A pessoa escreve ao número, preenche o formulário do site, ou o escritório registra indicação ou telefone | Triagem preenchida | Secretária; o integrante classifica área e urgência e rascunha a resposta | Resposta só a quem escreveu (publicidade passiva); número de origem registrado |
| **Triagem** (JUR-002, 006) | Primeiro contato respondido | Decisão de atender, encaminhar ou recusar | **Advogado** decide se atende; urgência vai ao topo | **Conflito rápido** (4.2); pergunta de urgência (citação, intimação, prisão) |
| **Consulta** | Advogado aceita ouvir (reunião ou conversa) | Estudo feito; proposta ou recusa | Advogado | **Caso `em_estudo`** com sigilo (3.3); conflito completo (4.3) |
| **Proposta** (JUR-009) | Interesse mútuo, conflito sem bloqueio | Aceite, recusa ou sem resposta | Sócio ou advogado | Sai por pessoa (cartão); sem cláusula-isca (seção 5); referência da tabela de honorários da seccional como aviso (JU-05, 2.2) |
| **Contratação** (JUR-010 a 015) | Aceite | Três documentos assinados e conflito liberado | Advogado | `lead.fechar_contrato` (3.5) |
| **Recusado ou encerrado sem contratar** | Recusa do escritório ou do lead | Fim do prazo de retenção (seção 6) | Advogado | A pessoa **não** vai para lista de reativação |

Estados do Lead além das Fundações 4.9: `em_triagem`, `em_consulta`, `proposta_enviada`, `em_contratacao`, `fechado`, `recusado_pelo_escritorio`, `desistiu`, `sem_resposta`. Lead que não responde em 7 dias vai a `sem_resposta` (como no 04, 5.5), sem lembrete automático.

### 3.2 Primeiro contato e triagem: o que o integrante faz e o que não faz

O integrante de Atendimento do setor Gestão e Atendimento (02, 3.2) trata o primeiro contato.

| Faz (nível) | Nunca faz |
| --- | --- |
| Reconhece quem escreve; abre o Lead; pergunta por botões se já é cliente (04, 5.2) | Dar opinião jurídica, dizer "tem direito", "vai ganhar", estimar prazo de resultado |
| Classifica **área** (as 19 de J9) e **urgência**: citação, intimação ou prisão exigem **humano em minutos** (JUR-002, 116, 126) | Citar valor de honorário, gratuidade ou desconto (seção 5) |
| Rascunha resposta-padrão informativa ("o escritório atua em X; para agendar uma conversa, diga o melhor horário") | Insistir com quem não respondeu |
| Pede os **dados mínimos** (nome, telefone, área, resumo curto; seção 3.4) | Pedir documentos do caso antes de haver consulta marcada (guarda de sigilo e de minimização) |
| Faz o **conflito rápido** com nome e documento (4.2) | Decidir conflito, aceitar ou recusar o caso |
| Oferece 3 horários de reunião (JUR-006) e confirma por botão | Enviar proposta (só pessoa) |
| Transcreve áudio **só com o aceite do lead** (seção 8.4) | Responder a áudio ou texto de lead como se fosse cliente (sem `ia_permitida`) |

**Urgência.** Quando o texto traz sinais de urgência (palavras como "citação", "intimação", "preso", "audiência amanhã", ou uma foto de documento), a conversa sobe como **alta** ao advogado de plantão e o integrante responde só a mensagem-padrão de recebimento ("recebemos; um advogado vai falar com você em minutos"). Se há **intimação ou citação** na foto, o integrante extrai tipo de ato e data e cria **Comunicação manual** (JU-03, 3.1) **marcada urgente**, mas **só como rascunho de Prazo**; quem confirma é advogado inscrito. Vale mesmo para quem ainda não é cliente: o risco de perder prazo é do futuro cliente e do escritório que o atendeu.

### 3.3 A Consulta e o Caso em estudo

Se a conversa já traz **fatos do caso**, o conteúdo está protegido pelo sigilo profissional mesmo que a pessoa não contrate **[a confirmar]**. Desenho:

1. Quando o advogado aceita ouvir, o sistema abre um **Caso `em_estudo`** (estado já previsto no JU-01, 3.2) ligado ao Lead, com `sigilo = por_equipe` (só a equipe nominal) e `ia_permitida = falso` até haver termo.
2. Tudo o que chegar daí em diante (mensagens, áudios, documentos, anotações) é do Caso e herda o compartimento. Antes disso, a conversa de lead **não deve conter** fato do caso; o primeiro contato é de agendamento.
3. Se a pessoa **não** contrata, o Caso vai a `arquivado` com motivo "não contratou", **sem Mandato, Prazo nem Honorário-Jurídico**, e entra nas regras de retenção da seção 6.
4. Se contrata, o Caso passa por `aguardando_conflito` → `aguardando_contrato` → `ativo` (JU-01, 3.2).

**Por que não manter só no CRM.** O CRM é aberto a quem tem Gestão e Atendimento. Conteúdo de consulta no CRM comum quebraria o sigilo por Caso (JR4) e a minimização (LGPD). Pergunta 1.

### 3.4 Dados mínimos na triagem

Hipótese de desenho, a confirmar com advogado de ética e DPO: pedir **só** nome, meio de contato, área presumida, urgência (sim/não e qual), como conheceu o escritório (origem, JUR-001) e um resumo livre de até 500 caracteres **sem** documentos. CPF ou CNPJ só quando for rodar o conflito completo (4.3) ou na contratação. A extensão do formulário do site segue o mesmo limite.

### 3.5 A contratação: um ato só, com três documentos

Equivalente ao `lead.fechar_contrato` do 04 (6.2), com mais condições. É uma transação, um evento por efeito, e **recusa** se faltar qualquer item:

| # | Condição | Fonte |
| --- | --- | --- |
| 1 | **Verificação de conflito decidida** (liberar, liberar com ressalva e anexo, ou recusar; recusada impede) | 4.3; JU-01, 3.3 |
| 2 | **Mandato** (procuração) emitido, enviado e **assinado** pelo outorgante certo (o representante, se incapaz ou espólio) | JU-01, 4.7; mecânica no JU-08 |
| 3 | **Contrato de honorários** assinado, com Caso, base de cálculo, evento gerador, retenção e partilha preenchidos | JU-05, 2.2 |
| 4 | **Termo de ciência de IA** oferecido: aceito, ou recusado (Caso fica sem IA) | JU-01, 3.3; JU-04, 5.3 |
| 5 | Dados cadastrais e base legal LGPD registrados (JUR-012) | JU-01, 3.1 |
| 6 | Hipossuficiência, se houver, declarada com documentos (JUR-016) | JU-01, 3.1 |

Efeitos: cria o **Cliente** com o perfil jurídico (ou liga ao que já existe, se já é do Contábil: **mesmo cadastro**), passa o Caso a `ativo`, religa conversas e documentos do Lead ao Caso, convida a pessoa ao app (seção 10), abre a trilha de implantação do Caso (checklist por tipo de ação, JUR-008) e avisa o Financeiro para gerar as parcelas. Se o cliente **recusa o termo de IA**, o fechamento prossegue, `ia_permitida = falso`, e as regras de prazo, o cadastro e o app continuam funcionando.

---

## 4. Checagem de conflito de interesses

### 4.1 O que é e por que o sistema ajuda

O CED trata do conflito de interesses (arts. 19 e 20; o alcance abrange a **sociedade de advogados** e **parcerias permanentes**, ou seja, o advogado não pode ficar "livre" porque o caso é de outro sócio ou de um parceiro fixo) **[a confirmar no texto oficial, na numeração vigente]**. Desde J3 (JUR-003, 004, 020) e J7 (SG-029, 030), o caminho do mercado é a **varredura determinística** (regra fixa, sem IA decidindo) que lista coincidências, com a **decisão sempre do sócio**. O JU-01 já define a entidade **Verificação de conflito** (3.3); aqui estão os momentos, as fontes, o acesso e as telas.

### 4.2 Conflito rápido, ao primeiro contato com nome

Roda quando a secretária ou o integrante preenche **nome e telefone, ou CPF/CNPJ** do Lead. Compara com:

- Clientes (ativos e **encerrados**), Partes de todos os Casos (inclusive arquivados) e advogados contrários;
- telefones e e-mails repetidos;
- sócios e advogados do próprio escritório (JUR-004: impedimentos do advogado).

Resultado em três cores, sem revelar conteúdo:

| Resultado | Mensagem ao usuário comum | Efeito |
| --- | --- | --- |
| Sem coincidência | "Nenhuma coincidência encontrada nas bases do escritório" | Segue |
| **Coincidência possível** | "Há coincidência; fale com o sócio antes de ouvir o caso" (**sem dizer quem nem de que Caso**) | Aviso; o advogado da triagem **não** abre consulta até o sócio ver |
| **Homônimo** | "Nome igual; confirme o documento" | O nome não é identidade (JU-01, 3.3) |

**Por que o aviso é vago.** Revelar "essa pessoa é parte contrária no Caso X" a um funcionário sem acesso ao Caso restrito revelaria dado de outro cliente. Só o sócio (e quem ele indicar) vê o detalhe (4.5).

### 4.3 Conflito completo, antes da proposta e antes do contrato

Roda com CPF/CNPJ e **todas as partes que o lead informou** (parte contrária, sócios da empresa, grupo econômico). É a `conflito.varrer`/`conflito.decidir` do JU-01 (7.1). Passos:

1. O advogado cadastra as **Partes presumidas** (autor, réu, terceiros) no Caso `em_estudo`; `na_base_de_conflito = verdadeiro`.
2. A varredura cruza com as bases da 4.2 e mais: mesmo grupo econômico, parte contrária de cliente ativo, ex-cliente e **registro de parcerias** (4.4).
3. O sócio recebe um **cartão de decisão**: coincidências com as regras que as geraram, **liberar**, **liberar com ressalva** (anexando o consentimento das partes quando couber), ou **recusar**, com motivo.
4. A decisão é **permanente**; rever cria registro novo (JU-01, 3.3).

**Nova Parte depois do contrato.** Quando entra Parte nova no Caso (litisconsorte, terceiro, mudança de réu), a varredura roda de novo e, se achar coincidência, o Caso vai a `aguardando_conflito` (bloqueado) até decisão. Conflito **superveniente** (que surge no meio do mandato) é o ponto mais fácil de esquecer; o sistema o torna automático.

### 4.4 Alcance: sociedade e parcerias permanentes

| Alcance | Como o sistema trata |
| --- | --- |
| **Toda a sociedade** (sócios e associados) | O registro é **por escritório**, não por advogado: uma varredura vale para todos, mesmo para casos de outro sócio |
| **Advogado que sai ou entra** | Ao incluir advogado novo, o escritório pode informar clientes e casos **anteriores dele** (impedimentos); o sistema oferece formulário de "histórico do advogado" |
| **Parceria permanente** (outro escritório ou advogado que atua sempre junto) | Cadastro de **Parceiro** com lista de clientes/partes que o parceiro **informa ao escritório**; o sistema compara com essa lista. **A plataforma nunca cruza dados entre escritórios** (isolamento por inquilino, DA-01; sigilo, JR4), mesmo que o parceiro também use a plataforma |
| **Grupo econômico do cliente** | Mesma regra de grupo como rótulo (03, 3.4), usado só para conflito |

**Consequência prática:** a checagem de parceria é tão boa quanto a lista que o parceiro entrega. O sistema avisa "lista de parceria atualizada há X dias" e marca a varredura com "parcerias consideradas: 2 (atualizadas em 15/09)". Pergunta 3.

### 4.5 Quem acessa o registro de conflitos

O registro de conflitos (todas as Verificações, Partes e decisões) é **dado sensível**: sozinho, já diz quem consultou o escritório e contra quem.

| Perfil | Pode | Não pode |
| --- | --- | --- |
| **Sócio** | Ver detalhe de coincidências, decidir, restringir | (sem restrição, mas leitura gera evento) |
| **Associado** | Rodar varredura; ver "há coincidência"; consultar o detalhe **dos Casos a que pertence** | Decidir; ver detalhe de Caso restrito de outro |
| **Estagiário, secretária, controladoria** | Rodar varredura e ver o semáforo | Ver quem é a coincidência |
| **Administrador de TI / suporte da plataforma** | Nada do conteúdo (suporte não lê Caso restrito, JU-01, 6.2) | |

**Regras:** (1) o detalhe de coincidência com Caso restrito só aparece a quem é membro ou ao sócio **com motivo registrado e aviso aos membros** (regra unificada 1); (2) toda leitura do registro é evento; o Administrador vê **quem consultou e quando**, não o conteúdo; (3) a lista não é exportável sem o sócio e gera evento; (4) o registro **sobrevive ao Caso**: o conflito de um cliente de 2024 continua a valer em 2027, então os dados mínimos ficam mesmo depois da retenção do conteúdo (seção 6).

### 4.6 Wireframe: cartão de decisão de conflito

```
┌─ Conflito · Lead "Maria Souza" → Caso em estudo: Trabalhista · Dra. Ana ───────────┐
│ Varredura de 09/11 às 10:42 · 4 fontes · parcerias consideradas: 1 (atual. 15/09) │
│ Partes presumidas: Maria Souza (cliente) · Alfa Comércio Ltda. (parte contrária)    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ⚠ 1 coincidência: "Alfa Comércio Ltda." = parte contrária em Caso ATIVO (Dr. Beto) │
│   regra: parte contrária que já é cliente · detalhe do Caso: restrito (Beto, Ana)   │
│ ○ homônimo: "Maria Souza" (outro CPF) em Caso encerrado · ignorar (documento difere)│
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Decisão (só sócio):  [Liberar]  [Liberar com ressalva + anexar consentimento]       │
│                      [Recusar, motivo ▾]                                             │
│ Ao decidir: registro permanente, aviso aos membros do Caso restrito, evento.        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Publicidade e captação: travas por design

### 5.1 Como ler esta seção

O **Provimento 205/2021** do CFOAB trata de publicidade e informação na advocacia. O resumo das buscas (Conferência, seção 3) aponta: distingue **publicidade ativa e passiva**; admite **anúncios pagos**; permite **mensagem por WhatsApp só a pessoas determinadas**; fixa **dados mínimos** que o material deve conter; e proíbe **mercantilização** e captação **[tudo a confirmar no texto oficial]**. J3 (JUR-001, 027, 030) e JU-05 (seção 7) acrescentam: nada de promessa de resultado, nada de valores em divulgação, e **gratuidade e desconto** usados como forma de captar são vedados **[a confirmar]**.

**Regra deste subplano:** onde a norma for incerta, o sistema **trava por padrão** e o advogado de ética decide se abre. Travar é barato; liberar o que a OAB veda é caro (processo disciplinar).

### 5.2 As travas

| # | Conduta de risco | Trava por design | Onde |
| --- | --- | --- | --- |
| T1 | **Mandar mensagem a quem não pediu** (publicidade ativa por WhatsApp) | `conversa.responder` e `comunicado.enviar` a **Lead** só se o lead escreveu primeiro, dentro da janela de 24 h da Meta; **nunca** template de marketing a lead ou a ex-consulta | CRM; `canal` |
| T2 | **Comunicado em massa a lead, a ex-consulta ou a "base"** | Aba Comunicados **só para clientes com Caso ativo ou mandato vigente**, e só conteúdo **informativo do próprio Caso** (ex.: mudança de horário do escritório). Segmento por "todos os leads" **não existe** | CRM, Comunicados |
| T3 | **Régua de lead sem resposta** (D+3, D+7 do Contábil) | **Desligada** no jurídico. Existe só o lembrete **interno** ao advogado ("lead sem retorno há 3 dias, decidir se encerra") | CRM, réguas (04, 7.2) |
| T4 | **Preço, "grátis", desconto ou "primeira consulta gratuita" na conversa ou na proposta como isca** [a confirmar] | O integrante **nunca cita valor**; o modelo de proposta não tem campo de desconto promocional; honorário sai só em **proposta por pessoa**, a quem pediu orçamento (JUR-009); a referência da tabela da OAB aparece como **aviso interno**, não como oferta | Integrante; modelos |
| T5 | **Promessa de resultado ou "garantia de êxito"** | Lista de termos vetados nos modelos (ex.: "garantimos", "ganho certo", "sem risco"); **nenhum modelo de mensagem cita êxito**; o integrante recusa e transfere a pergunta ao advogado | Modelos; integrante |
| T6 | **Conteúdo "sensacionalista" ou mercantil** em divulgação (JUR-227) | A IA de conteúdo gera **texto informativo**, com checklist de vedações ("há promessa? preço? comparação? foto de cliente?"); sempre `prepara, pessoa conclui`; o sócio aprova | Time de agentes; JU-04 |
| T7 | **Dados no material fora do mínimo** (ex.: cartão, assinatura de e-mail, site) | Checklist "dados que o material deve ter" (nome, OAB, contato) e "dados que não deve" (valores, êxito, depoimento de cliente) **[a confirmar a lista no texto oficial]** | Modelos; Configurações |
| T8 | **Pedido de indicação ativo** ao encerrar o Caso | A pesquisa de satisfação (JUR-030) é **neutra** e **não contém pedido de indicação**; o NPS vai só a quem é cliente e só uma vez por Caso | CRM; 04, 8.2 |
| T9 | **Pagar comissão a quem trouxe cliente** (agenciador) | Não existe campo de comissão por indicação para quem não é advogado; indicação entre advogados vira **partilha de honorários** com contrato (seção 7) | Financeiro; JU-05 |
| T10 | **Grupos de WhatsApp, listas de transmissão e aplicativos de mensagem para público indeterminado** | Não existem no produto (grupos já ficam fora, 04, 3.1); lista de transmissão desligada | Canal |
| T11 | **Anúncio pago e impulsionamento** | Permitido pela norma **[a confirmar condições]**; **fora do produto** (o sistema não compra anúncio nem mede "cliques"); se o escritório anuncia, o lead chega por canal passivo e a origem registrada é "anúncio" | Fora de escopo |
| T12 | **Uso de dado de quem consultou para mala direta** | Proibido por desenho: o dado de consulta tem finalidade limitada (seção 6) e **não alimenta** segmentos de comunicado | CRM; LGPD |

### 5.3 Modelos de mensagem aprovados

A biblioteca de **Modelos** (04, 3.3) do jurídico traz só mensagens de **utilidade** (nunca marketing para lead): recebimento e agendamento; confirmação e lembrete de reunião (a pedido do lead); pedido de documento (só a cliente); andamento em linguagem simples (10.5); aviso de audiência (10.9); aviso "nova mensagem no app" (sem conteúdo); parcela de honorário (sem valor no texto); satisfação neutra, sem pedido de indicação. Todo modelo traz **versão**, **quem aprovou** (advogado) e **resultado do checklist de vedações**; mudar o texto exige nova aprovação (SG-037).

### 5.4 O que depende de parecer

O JU-05 (seção 7) já lista a publicidade como ponto que **exige advogado de ética**. Este subplano acrescenta, para o parecer: (1) alcance de "gratuidade e desconto como captação"; (2) o que vale como "pessoa determinada" no WhatsApp (quem escreveu primeiro? quem foi indicado e consentiu?); (3) se a **proposta de honorários**, enviada a quem pediu orçamento, pode citar valor e desconto (hipótese: pode valor; desconto **não**); (4) conteúdo mínimo do material; (5) regras para o **formulário do site** e o botão de WhatsApp. **Sem parecer, as travas T1 a T12 ficam ligadas e só o sócio, com aviso, abre exceções.**

---

## 6. LGPD e retenção: quem consultou e não contratou

### 6.1 O problema

No Contábil, o lead perdido é **mantido para campanhas futuras**, com nome, contato, origem e motivo, enquanto houver consentimento, e o texto das conversas é removido em 12 meses (04, 10.3; decisão de 7/11/2026). **Essa decisão não vale para o pacote Jurídico**, por duas razões: (1) mala direta e reativação de quem não pediu é o que a norma de publicidade tende a vedar (T1 a T3, T12); (2) a consulta, mesmo sem contrato, tem sigilo profissional **[a confirmar]** e o dado pode ser sensível (saúde, família, criminal; LGPD art. 11).

### 6.2 Categorias, finalidade e prazo

As bases legais e os prazos abaixo são **hipóteses de desenho**, a confirmar com a advogada da família, o advogado de ética e o DPO (JU-10); **nada aqui é parecer jurídico**.

| Categoria | O que é | Finalidade permitida | Base legal (hipótese) | Prazo (hipótese) | O que acontece no fim |
| --- | --- | --- | --- | --- | --- |
| **A. Lead sem consulta** | Primeiro contato e triagem, sem fatos do caso | Atender o pedido; evitar duplicidade; medir origem em número agregado | Procedimentos preliminares a pedido do titular (LGPD art. 7º, V) **[a confirmar]** | **90 dias** após o último contato | Anonimização (contagem de origem fica) |
| **B. Consulta com conteúdo** (Caso `em_estudo` arquivado sem contrato) | Fatos, áudios, documentos | Defesa do escritório (provar o que foi dito) e sigilo; **não** marketing | Exercício regular de direitos (art. 7º, VI) e proteção do crédito/obrigação ética **[a confirmar]** | **Prazo de guarda do Caso** (JU-01, `prazo_guarda_ate`; prazo legal **[a confirmar]**; hipótese de partida: 5 anos) | Descarte ou devolução ao titular; fica registro mínimo (C) |
| **C. Registro mínimo de conflito** | Nome, documento, data, área, papel (consultante, parte), decisão | Checar conflito futuro (4.5) | Cumprimento de dever ético e exercício regular de direito **[a confirmar]** | **Mais longo que A e B** (hipótese: 5 anos após o último Caso ou consulta); **[a confirmar]** com advogada | Anonimizar o que não for necessário; documento hasheado possível **[a confirmar]** |
| **D. Cliente** | Caso contratado | Execução do contrato e obrigação legal | Execução de contrato; obrigação legal | Guarda do Caso (JUR-029) | Tabela de temporalidade; descarte |

### 6.3 Regras

1. **Sem lista de reativação.** Lead A e consulta B não entram em segmentos de Comunicado nem em "campanhas futuras". O campo `guardar_leads` do 04 (10.3) **não existe** no jurídico.
2. **O motivo de recusa não é apagado**, mas a descrição é neutra ("conflito", "fora da área", "escritório não atua", "cliente desistiu"), para não virar dossiê.
3. **Conteúdo de consulta B** fica no compartimento do Caso, só com a equipe; busca e memória dos integrantes **não indexam** consulta sem termo de IA.
4. **Direitos do titular.** Pedido de exclusão, acesso ou correção de quem consultou vira tarefa ao Administrador (GES-054) **com resposta que equilibra** LGPD e sigilo: o titular pode pedir seus dados; o escritório explica o que guarda por dever ético e o que descarta. O desenho do conflito entre LGPD e sigilo é do JU-10 (a conferência o aponta como lacuna); aqui só se garante que o sistema **separa os dados por categoria** para permitir a resposta.
5. **Descarte é rotina**, com aviso ao responsável 30 dias antes, e nunca apaga o evento (R7); só o conteúdo e a identidade.
6. **Aviso de privacidade na triagem:** a primeira resposta traz link curto para o aviso do escritório (finalidade, prazo, direitos), em linguagem simples.

Pergunta 5.

---

## 7. Indicação e parceria entre advogados

### 7.1 Três situações diferentes

| Situação | Exemplo | Tratamento |
| --- | --- | --- |
| **Cliente indica o escritório** | Ex-cliente recomenda a um amigo | Registra-se `indicado_por` no Lead (JU-01, 3.1) para saber a origem; **o sistema não incentiva** (T8) e **não oferece benefício** ao indicador (isca, T4, T9) |
| **Advogado indica a outro advogado** | Colega sem área passa o cliente | Registro de **Parceiro**; se houver divisão de honorários, é **partilha** entre advogados, com contrato e regra no Contrato de honorários (JU-05, 2.2 e 7); a plataforma só **aplica e registra** a regra do escritório |
| **Parceria permanente** | Escritório A e B atuam sempre juntos | Cadastro de Parceiro com contrato, lista de clientes/partes e **conflito estendido** (4.4); substabelecimento (JUR-017) quando um atua pelo outro |
| **Correspondente** | Advogado local faz audiência em outra comarca | É do **JU-09** (a escrever); aqui só o cadastro de Parceiro com papel `correspondente` e a regra "pagamento ao correspondente não é comissão de indicação" |

### 7.2 O que o cadastro de Parceiro guarda

`nome`, `oab`, `tipo` (indicador, parceiro permanente, correspondente), `contrato_id` (documento), `lista_de_conflito_atualizada_em`, `partilha_padrao` (se houver, referência ao JU-05), `ativo`. Parceiro **não é Cliente**, não vê nada do escritório; se precisar ver um Caso (substabelecimento), entra como **convidado temporário** com prazo e Casos escolhidos (modelo do SG-028; JU-02, 5.4).

### 7.3 Trava

O sistema **não cria campo de comissão** por indicação a quem não é advogado inscrito. Se o escritório tentar registrar "pagamento a indicador" que não é advogado, o Financeiro mostra aviso ("pode configurar captação vedada; falar com o sócio") e exige o **cartão do sócio** **[a confirmar texto oficial]**. A divisão entre advogados e a titularidade da sucumbência seguem a regra do JU-05 (partilha) **[a confirmar EAOAB art. 24 e correlatos]**. Pergunta 6.

---

## 8. WhatsApp: um número por setor, áudio e conversa ligada ao Caso

### 8.1 Um número por setor

Vale a decisão do 04 (3.1): **um número por setor com equipe**, o do Gestão e Atendimento é o principal; setor sem número usa o principal e a conversa **transfere**; **não existe setor "Geral"**. Aplicado aos nove setores do pacote Jurídico (JU-01, 2.1):

| Setor | Número próprio no escritório pequeno? | Observação |
| --- | --- | --- |
| **Gestão e Atendimento** | **Sim** (principal) | Recebe primeiro contato, lead e cliente |
| Contencioso, Trabalhista, Família e Sucessões, Previdenciário, Penal, Tributário, Consultivo | **Só se o escritório quiser** | Por padrão usam o principal e recebem por transferência |
| **Controladoria** | **Não** | É setor interno; não conversa com cliente. Comunicação urgente de prazo vira alerta interno, não mensagem externa |
| Financeiro do escritório | Opcional | Cobrança de honorários |

**Conversa de cliente ligada ao Caso.** A conversa do cliente é **uma pessoa, um setor**, mas ganha **etiqueta de Caso** (JU-01, 4.11). Quando a pessoa tem vários Casos, o integrante **infere** o Caso pelo assunto e marca `caso_inferido`; confirmação por um clique do atendente (como `cliente_inferido`, 04, 5.1). **Conversa que cai em Caso restrito nunca é inferida:** o atendente liga manualmente, porque a inferência olharia o conteúdo.

### 8.2 Janela de 24 horas e templates

Segue o 04, 3.3, com duas adaptações: (1) para **lead**, fora da janela **não há** template (T1); (2) para **cliente**, só templates de **utilidade**; "marketing" **não é usado** no jurídico. O custo por mensagem vai ao escritório, ao custo da Meta (seção 11.1).

### 8.3 Modo não oficial

O modo experimental do 04 (3.5) é **desligado** no pacote Jurídico (hipótese): banimento sem aviso e falta de registro auditável são incompatíveis com a guarda de provas e o sigilo. Pergunta 7.

### 8.4 Áudio

Todo áudio de cliente chega ao CRM. No Contábil, é **transcrito sempre** (04, 3.6). No jurídico, a transcrição é **tratamento por IA e por provedor de terceiro** e muitas vezes traz fatos do caso; vale a regra CR6:

| Quem enviou | Transcrição | Por quê |
| --- | --- | --- |
| Cliente com `ia_permitida = verdadeiro` | **Sim**, marcada "gerada", dentro do compartimento do Caso | Termo registrado |
| Cliente com `ia_permitida = falso` (recusou) | **Não**; fica o áudio, que a equipe ouve | Recusou IA |
| Lead (sem termo) | **Só com aceite** na triagem: botão "posso transcrever seu áudio com apoio de tecnologia? [sim] [prefiro que ouçam]" (aceite grava texto, data e canal) | Não há termo ainda; a pessoa decide na hora |
| Caso com segredo de justiça | **Não** por padrão (JU-04: IA desligada por padrão) | Sigilo reforçado |

A transcrição respeita o **compartimento**: quem não é do Caso restrito não vê nem o áudio, nem o texto, nem a busca. O cliente vê **só o áudio dele** no app (como no 06, 7.4). Fornecedor de transcrição é subprocessador (JU-04, 5.5; JU-10), com contrato de operador e **sem treino** com o áudio. Pergunta 8.

### 8.5 Tarefas a partir de conversas

A ferramenta `conversa.virar_tarefa` do 04 (8.1) continua, com cartão "criar, editar, não", mas a tarefa herda o **setor do Caso** (JU-01, 5.1: `regra_setor = do_caso`) e a **sigilo** dele. Exemplos de **pedido implícito** do jurídico (o integrante do **setor do Caso** propõe; ninguém abre sozinho):

| O cliente escreve | O integrante propõe | Quem conclui |
| --- | --- | --- |
| "Recebi uma intimação" (com foto ou áudio) | **Comunicação manual** urgente e rascunho de Prazo (JU-03) | **Advogado**: confirma o Prazo |
| "Mudei de endereço" / "troquei de número" | Tarefa de atualização cadastral e de aviso ao tribunal, se houver Processo | Secretária; advogado se houver peça |
| "O réu me ligou propondo acordo" | Tarefa de **advogado**: "cliente relata proposta de acordo" (nunca resposta automática) | Advogado (aceitar acordo é ato privativo, JR1) |
| "Perdi o documento X" | Tarefa de pedir segunda via e checklist | Estagiário ou secretária |
| "Quero marcar uma conversa" | `reuniao.agendar` (3 horários) | Secretária confirma |
| "Preciso de recibo / saldo" | Tarefa do Financeiro; extrato só se o advogado liberou | Financeiro |
| "Vai dar tudo certo?" / "vamos ganhar?" | **Não** responde; cria pedido ao advogado | Advogado |

**O integrante de Atendimento jurídico** (lê só com `ia_permitida` e só Casos de que é membro) responde o **factual** (JUR-026, 225): data da audiência, "o documento chegou", status liberado; nunca prevê resultado, aconselha, negocia valor (SG-035) nem promete prazo de peça. O que envia passa por `conversa.responder`, com cartão fora da lista liberada (04, 8.3).

---

## 9. Integração com o Caso, o Processo e o resto do pacote

| O que acontece no CRM | O que acontece no Caso ou no Processo |
| --- | --- |
| Lead vira **Caso `em_estudo`** (3.3) | Conversa, áudio e documento da consulta passam ao compartimento do Caso |
| `lead.fechar_contrato` (3.5) | Cliente e Caso `ativo`; Mandato `vigente`; trilha de documentos; parcelas no Financeiro |
| Foto de intimação na conversa | **Comunicação** manual urgente; Prazo proposto; alerta à Controladoria (JU-03) |
| Mensagem do cliente com número CNJ | Detecta o número como identificador; propõe **Processo `candidato`** (nunca cria sozinho, SG-019) |
| Documento recebido por WhatsApp ou app | `documento.registrar` com `caso_id`; baixa a pendência do checklist; classifica por tipo (RG, comprovante, contrato) |
| **Andamento relevante** registrado | Se o modelo está aprovado e o cliente está em "automático": aviso (10.5); senão cartão ao advogado |
| **Audiência** designada | Evento na agenda; escada de aviso ao cliente (10.9) |
| Conversa de cliente com Caso restrito | Fica no compartimento; notificação do resumo diário mostra só "há novidade no Caso X" aos membros (JU-01, 6.2) |
| Tempo de atendimento | Sessão de trabalho por **Caso**, não só por cliente (JU-05, 4.2) |

O CRM **não** guarda prazo, peça, honorário nem dado do Processo: lê do pacote por ferramentas e mostra na lateral da conversa.

---

## 10. O app do cliente jurídico

Um só app (06), com seções por serviço contratado (DA-02.1, regra 6). O cliente com serviço jurídico recebe as seções abaixo; quem também é do Contábil vê **as seções dos dois**, no mesmo login. O JU-02 (seção 7) fixou a lista de seções; aqui está o detalhe.

### 10.1 Regras herdadas do 06 e acrescentadas

Valem H1 a H8 do 06 (só ferramentas `exposta_ao_cliente`; escopo da conta; tema; tudo gera evento; sem desligamento por inatividade; conteúdo do cliente é dado; lead não entra; central de notificações). Acrescentam-se: **AJ1** visibilidade **por Caso**, não só por cliente; **AJ2** só o liberado (`visivel_ao_cliente` padrão falso); **AJ3** linguagem simples e sem opinião ("vou ganhar?" vira pedido ao advogado); **AJ4** nunca estimar êxito, valor ou risco; **AJ5** sigilo reforçado também no app (Caso restrito ou com segredo de justiça exige código a cada abertura em aparelho novo e mostra só o liberado).

### 10.2 Login e papéis (pessoa física)

Convite, primeiro acesso e autenticação são os do 06 (2.1 e 2.2): link de 7 dias, código de 6 dígitos no canal já cadastrado, senha opcional, chave de acesso por aparelho, sessão longa e revogável. Diferenças do jurídico:

- **Quem convida:** o `lead.fechar_contrato` (3.5) envia o convite; **lead não entra** no app (06, H7).
- **Representante.** Para incapaz representado, espólio ou massa falida, quem entra é o **representante** (JU-01, 3.1), com papel `representante`; o app mostra "você acessa em nome de ...". O Mandato é assinado por ele.
- **Cliente que é parte e testemunha em outro Caso:** são papéis distintos no Caso; testemunha **não** tem conta.
- **Segundo fator** para quem tem Caso restrito ou segredo de justiça: obrigatório (hipótese; pergunta 11).

### 10.3 Cliente pessoa jurídica com vários usuários

A empresa cliente pode ter vários usuários. Papéis por **serviço contratado** e agora também **por Caso** (acréscimo ao 06, 2.4):

| Papel | Vê no Jurídico | Não vê |
| --- | --- | --- |
| **Representante legal** (sócio-administrador) | Todos os Casos da empresa; Assinaturas; Honorários | Nada escondido (menos o que o advogado não liberou) |
| **Contato jurídico** (diretor ou gerente jurídico, advogado interno) | Casos atribuídos a ele; andamentos; documentos; agenda; conversa dos Casos dele | Honorários, a menos que também seja financeiro |
| **Financeiro** | Contrato de honorários, parcelas, extrato, boletos, nota | Andamentos e documentos dos Casos |
| **Contador interno / RH** | **Nada do jurídico por padrão** (só se o representante atribuir) | Tudo do Jurídico |
| **Preposto** (quem vai à audiência pela empresa) | Só a **Audiência** designada e as instruções, por prazo | Todo o resto |

Regras: (1) o escritório (ou o representante, pelo app, como no 06, 2.5) **atribui o contato a cada Caso**; (2) quem saiu da empresa é revogado na hora, e o registro de entrega fica; (3) com **Contábil e Jurídico na mesma empresa**, a pessoa entra uma vez e vê a **união das áreas** (06, 2.3), mas **o contador interno só vê o jurídico se for atribuído**; (4) grupo econômico é rótulo: as empresas aparecem juntas no seletor, e **os Casos nunca se misturam** (nem para conflito de interesses mostrado ao cliente); (5) mudança de papel gera evento.

### 10.4 As seções do app

| Seção | O que mostra | Regra |
| --- | --- | --- |
| **Início** | "O que falta você fazer", próxima audiência, aviso de pendência | Só o liberado |
| **Meu processo** | Linha do tempo do Caso em linguagem simples (10.5) | `visivel_ao_cliente` |
| **Documentos** | Pasta `Entregáveis/Jurídico`: peças protocoladas liberadas, procuração, contrato; "Enviados por você" | Pasta visível; comprovante de leitura (06, 5.2) |
| **Pendências** | Checklist por tipo de ação; envio por foto ou arquivo (SG-032) | Pedido do advogado vira pendência |
| **Honorários** | Contrato de honorários, parcelas, Pix e boleto, extrato da conta do cliente | JU-05; sem estimativa de êxito |
| **Agenda** | Audiências com local, link e instruções; agendar reunião | Pedido vira tarefa |
| **Assinatura** | Procuração, contrato de honorários, termo de ciência de IA | 10.7; mecânica no JU-08 |
| **Conversa** | Fio único do CRM, filtrável por Caso | Notas internas e cartões não aparecem |
| **Empresa** (PJ) | Pessoas, papéis por Caso, termos, acessos | 10.3 |

### 10.5 Andamento traduzido em linguagem simples

**O que a decisão do usuário diz:** automático **só** para andamento relevante, com texto de **modelo aprovado**; o advogado escolhe por cliente se é "automático" ou "revisar antes" (JU-02, 9.3, item 8).

**Fluxo:**

1. Entra um **Andamento** (JU-01, 4.3). O integrante o classifica como **relevante** ou **burocrático** (JUR-057). Burocrático **não** vai ao cliente.
2. Para o relevante, o motor procura um **modelo de texto** daquele tipo de movimento (tabela unificada do CNJ), aprovado por advogado, com **campos** extraídos (data, órgão, o que mudou).
3. Se o cliente está em **"automático"** **e** o modelo está aprovado **e** o tipo não está na lista de exclusões (abaixo), o aviso sai com `liberado_por = modelo aprovado por [advogado] em [data]`.
4. Caso contrário, vai a **cartão ao advogado** com prévia exata (JU-02, 5.3). "Revisar antes" nunca sai sozinho.

**Conteúdo do texto:** diz **o que aconteceu**, **o que acontece agora**, **quando** e **o que precisa do cliente** (J8, nota a). Nunca diz prazo, estratégia, risco, probabilidade, nem opina; sempre traz "dúvidas? fale com o escritório".

```
Modelo aprovado: "Juntada de contestação"     (v3 · aprovado por Dra. Ana em 02/11)
"Olá, {nome}. O {parte contrária} apresentou sua defesa no processo em {data}.
 Agora o juiz deve decidir os próximos passos. Não precisa fazer nada neste momento.
 Quando houver data de audiência, avisaremos por aqui. Dúvidas? Fale com o escritório."
```

**Exclusões propostas (a validar, pergunta 9):** nunca automáticos, sempre cartão: **sentença, acórdão, decisão que nega pedido ou liminar, qualquer ato que exija ação do cliente, citação ou intimação pessoal, Caso com segredo de justiça, Caso com cliente em estado sensível** (família, penal). Esses tipos vão a cartão porque o texto do modelo não prevê a nuance.

**Atraso de segurança (hipótese):** o aviso automático sai **30 minutos depois**, com botão "cancelar" ao advogado; a lista de "saiu / vai sair" fica no Hoje.

**Versão e responsabilidade:** cada modelo tem versão e aprovador (SG-037); o histórico do que o cliente viu fica no Caso (`traducao_cliente`, JU-01, 4.3); texto marcado "gerado" internamente, mas o cliente vê só a mensagem; **a plataforma não promete que o texto substitui orientação do advogado** (JR6).

**Comunicação com ciência pendente** (Domicílio, painel) **não aparece** ao cliente antes da decisão do advogado, salvo o aviso de citação reconhecida por foto (JU-03, 7.3).

### 10.6 Envio de documentos

O cliente envia por foto, arquivo ou pelo WhatsApp; o fluxo é o do 06 (4 e 7.4): `documento.registrar` → classificação → baixa a pendência → "recebido: RG". Particularidades: (1) documento de **Caso restrito** vai só ao compartimento; (2) **foto de intimação** gera Comunicação urgente (8.5); (3) pedido de **originais** (JUR-028) aparece como pendência "entregar presencialmente"; (4) o cliente vê "Enviados por você" mesmo que a pasta de destino seja interna.

### 10.7 Assinatura de procuração e contrato de honorários

O app é só a **porta de entrada**: mostra o que está para assinar, abre o provedor, recebe o arquivo assinado e atualiza o estado do Mandato ou do Contrato de honorários. **A mecânica** (níveis de assinatura da Lei 14.063/2020, o que cada tribunal aceita, o relatório de evidências, procuração com poderes especiais, ICP-Brasil quando exigida) é do **JU-08**. O que o app garante:

- o que o cliente vê **antes de assinar**: o documento completo, **sem** alteração por trás; hash do que foi aberto;
- **quem assina**: o outorgante ou o representante, nunca terceiro;
- **estado visível**: `aguardando_assinatura` → `vigente`;
- **termo de ciência de IA**: texto simples, com opção de **recusar** sem perder o serviço (JU-01, 3.3);
- **aceite por tribunal** varia **[a confirmar]**: o app mostra, se for o caso, "pode ser necessário assinar com certificado digital" e abre tarefa à secretária (JUR-015).

O JU-05 (2.2) diz que o contrato é assinado por **assinatura avançada** (D4Sign, Clicksign, ZapSign, nível B); a escolha do provedor é do JU-08.

### 10.8 Pagamento de honorários

Segue JU-05 e o 06 (3.8): contrato, parcelas, Pix e boleto, 2ª via, nota. Particularidades: (1) **extrato da conta do cliente** (valores em poder do escritório, JU-05, 2.5) só após liberação do advogado; (2) **nunca** estima êxito nem "quanto você vai receber"; (3) valor de honorário **não vai em texto de WhatsApp**, só no app (regra do 06, 10); (4) pagamento por **cartão ou Pix** é do Financeiro do escritório (H3: a plataforma não intermedia dinheiro, JU-05); (5) pergunta de cliente sobre repasse ou alvará vira tarefa do sócio.

### 10.9 Agendamento e aviso de audiência

**Agendamento de reunião:** `reuniao.agendar` oferece 3 horários do advogado (conector de calendário), o cliente escolhe por botão, vira tarefa e evento (04, 8.2). **Aviso de audiência:** a Audiência (JU-01, 4.6) dispara uma escada ao cliente: confirmação ao ser designada ("foi marcada audiência em 15/12, 14h; o escritório vai orientar você"), **D-3**, **D-1** e **no dia**, pelo canal preferido, **sem conteúdo do Caso** no WhatsApp (só "você tem uma audiência; veja no app"); o app traz local, link, o que levar e se a presença é obrigatória (instruções preparadas pelo advogado; JUR-066, 067). O cliente confirma presença por botão; ausência de confirmação gera tarefa ao advogado. O reagendamento é por **pedido** (vira tarefa); quem decide é o advogado. Audiência de **preso** ou de **réu preso** não usa app: é atendimento humano (JUR-116, 126).

### 10.10 O que o cliente nunca vê

| Item interno | Por que fica de fora |
| --- | --- |
| **Estratégia, minutas e comentários de revisão** de Peça | Trabalho do advogado; sigilo; confidencialidade de rascunho |
| **Notas e conversas internas**, marcos de repasse | Notas nunca saem pelo canal (04, 10.2) |
| **Risco, probabilidade de êxito, jurimetria** | O advogado aconselha; a plataforma não estima (JR1, CR12) |
| **Data interna e a conta do Prazo** | No máximo "o escritório responde até"; a conta é do advogado |
| **Horas, custo-hora, rentabilidade, valor-hora** | Dado interno e financeiro (JU-05, H9) |
| **Verificação de conflito e registro de conflitos** | Sigilo de terceiros e de outros clientes (4.5) |
| **Trilha de IA** (quem pediu, agente, versão) | Trilha interna (JUR-234) |
| **Andamento não liberado** e **Comunicação com ciência pendente** | Decisão do advogado antes |
| **Dados de outros clientes**, inclusive do **mesmo grupo** | Grupo é rótulo; sigilo por Caso |
| **Transcrições de áudio** | Uso interno (04, 11) |
| **Caso restrito de que a pessoa não é parte** | Compartimento |

Segredo de justiça: só com **liberação expressa do advogado**, para a **pessoa autorizada**, com código extra (AJ5). Famílias e penal têm **política própria** a definir com o JU-04 e o JU-10 (JU-02, 7) **[a confirmar]**.

### 10.11 Notificações, marca branca e web instalável

**Notificações** seguem a central (06, 10): categorias, prioridades, agrupamento. Eventos jurídicos: andamento liberado, audiência (escada), pendência, assinatura, parcela, resposta na conversa. **Regra CR10: push e WhatsApp nunca carregam conteúdo do Caso** (nem nome da parte, nem número CNJ, nem valor): o texto é "há novidade no seu processo; abra o app". O resumo diário do escritório, para Caso restrito, também mostra só "há novidade no Caso X" aos membros (JU-01, 6.2).

**Marca branca** é a do 06 (11): nome, logotipo, cores, domínio, remetente, textos e documentos vêm do **Tema**; nenhuma referência ao fornecedor. No jurídico, o texto do tema (nome de exibição, descrição do app, rodapé, assinatura) passa pelo checklist de publicidade (T7) **[a confirmar por advogado de ética]**: nada de "melhores advogados" ou promessa no nome do app ou na loja.

**Web instalável** é a do 06 (3.11): Android com aviso, iOS por "Adicionar à Tela de Início", computador por Chrome/Edge; push no iOS só instalado **[a confirmar nas notas do WebKit]**. Loja de aplicativos fica **depois**, com as ressalvas do 06 (11.3: regra 4.2.6 da App Store e caminhos de publicação).

### 10.12 Quando o vínculo acaba

**Revogação ou renúncia do Mandato:** o Mandato vai a `revogado` ou `renunciado` (JU-01); o app mostra o aviso e o prazo em que o escritório ainda representa o cliente **[a confirmar prazo legal]** (JUR-018); depois, só leitura dos documentos do cliente. **Caso encerrado:** app em leitura; relatório final e devolução de originais como pendência (JUR-028). **Cliente troca de escritório ou escritório sai da plataforma:** exportação e período de leitura de 90 dias (06, 12.6); quem recebe os documentos é o cliente. **Pedido de exclusão:** tarefa ao Administrador, separando o que se descarta do que se guarda por dever ético (seção 6).

---

## 11. Itens de custo de WhatsApp e de IA (entrada para o JU-12)

**Tudo é premissa a medir.** Os valores unitários vêm do Estudo de Precificação (seção 3) e de `parametros.json`; as quantidades do jurídico **não foram medidas**: emprestam as do Contábil (3, 6 e 12 mensagens de utilidade por cliente por mês, etc.) e devem ser trocadas no piloto.

### 11.1 WhatsApp (repassado ao escritório, ao custo da Meta)

| Item | Unidade | Valor unitário (Estudo) | Premissa jurídica (baixo / provável / alto) **[a medir]** |
| --- | --- | --- | --- |
| Mensagem de **utilidade** (andamento, audiência, pendência, parcela) | por mensagem | R$ 0,035 | por cliente com Caso ativo por mês: 3 / 6 / 12 (emprestada do Contábil) |
| Mensagem de **serviço** (resposta ao cliente dentro da janela) | por mensagem; **1.000 grátis por número** | R$ 0,035 acima da franquia | por cliente por mês: 10 / 25 / 50 (emprestada) |
| Mensagem de **marketing** | por mensagem | R$ 0,3217 | **0** no jurídico por desenho (T1, T2) |
| **Tarifa da IA da Meta** ("a IA responde o cliente") | por mensagem | US$ 0,0625 (**a confirmar com a Meta antes de vender**, Estudo, P13) | Só se o integrante responder dentro do WhatsApp |
| **Número adicional** (por setor) | por número | Cadastro e templates, sem tarifa mensal conhecida | 1 / 2 / 4 números (Estudo, parâmetros) |

**Exemplo ilustrativo (não é cotação),** escritório "pequeno" de JU-05 (250 clientes com Caso ativo, 2 números): utilidade 250 × 6 × R$ 0,035 = **R$ 52,50**; serviço (250 × 25 = 6.250, menos 2.000 grátis = 4.250) × R$ 0,035 = **R$ 148,75**; marketing zero; **total cerca de R$ 201 por mês, ao escritório**. A fórmula é a do Estudo; o número de mensagens do jurídico é a medir. **Observação:** como o conteúdo do cliente não vai no texto do WhatsApp (CR10), o jurídico tende a mandar **mais avisos curtos** e menos texto longo; por isso a quantidade provável pode subir.

### 11.2 Áudio e IA no CRM e no app

| Item | Unidade | Premissa de custo | Observação |
| --- | --- | --- | --- |
| **Transcrição de áudio** | por minuto | R$ 0,015 a 0,02 (S3) | Só com termo ou aceite (8.4); minutos por cliente: 3 / 5 / 12 (Contábil), **jurídico a medir**. Exemplo: 250 × 5 × R$ 0,02 = **R$ 25** |
| **Triagem e classificação** (área, urgência, cliente inferido) | por conversa | Modelo barato: centavos | Baixo; parte é regra |
| **Rascunho de resposta factual** | por resposta | 3 a 6 mil tokens (premissa) × R$ 0,60/MTok no barato ≈ **R$ 0,002 a 0,004** | O consumo do **plano do usuário** é medido em UU; 1 UU = 10 mil tokens (Estudo); a UU **não distingue o modelo** (achado de JU-04, 7.1: propõe-se UU ponderada) |
| **Tradução de andamento por modelo** | por Andamento relevante | Texto de modelo com campos: **sem IA** quando o modelo já está aprovado (só preenche); **com IA** só para tipo sem modelo | Meta: maioria sem modelo de IA. A **criação** do modelo pelo advogado usa 8 a 16 UU (como minuta, JU-04, 7.1) |
| **Resumo de conversa** | por conversa longa | Modelo barato | Só em conversa de cliente com `ia_permitida` |
| **Conflito (varredura)** | por varredura | **Sem IA** (regra e comparação de nomes); custo de infraestrutura | Homônimo e variações de grafia por código |
| **Conteúdo de divulgação com checklist** (T6) | por texto | Modelo principal; 8 a 16 UU | Ocasional; plano **Operação** |
| **Resumo de autos** para a consulta (JUR-055) | por 300 páginas | 25 a 40 UU (JU-04, 7.1) | **Exige termo** (CR6); pode consumir a janela do IA Essencial: franquia por "documentos analisados" |

**Quem paga a IA do integrante.** Os eventos do integrante consomem o **limite do usuário dono** (Estudo, 3.11): se a secretária é a dona do Atendimento, a franquia dela é que baixa. O JU-12 deve decidir se a **IA do atendimento** vira **franquia do escritório** (separada do plano por usuário), porque o consumo cresce com o número de clientes e não com o de usuários.

### 11.3 Outros itens para o JU-12

Marca branca R$ 150 e app na loja R$ 350 (parâmetros de teste do JU-05, 5.1; o app do jurídico reaproveita o do Contábil); armazenamento a R$ 0,45 por GB com 15 GB por usuário incluídos (documentos escaneados e fotos pesam mais que no Contábil [a medir]); **assinatura eletrônica** (ZapSign, Clicksign, D4Sign, nível B): custo por documento ou pacote **[a confirmar]**, embutido ou repassado (JU-08 e JU-12); código de acesso na categoria "autenticação" da Meta (R$ 0,035); usuários do app do cliente PJ **não contam** como usuário do escritório (06), com a decisão de haver ou não limite por empresa; custo de guardar por 5 anos o que fica de consultas e registros [a medir]; suporte por sessão de tela de 30 minutos, sem ler Caso restrito (JU-01, adendo 26).

---

## 12. Permissões, ferramentas e eventos do CRM jurídico

### 12.1 Matriz por perfil

Níveis: **L** ler, **R** rascunhar, **E** executar, **—** nada. "(ato)" = só advogado inscrito.

| Capacidade | Sócio | Associado | Estagiário | Secretária | Controladoria |
| --- | --- | --- | --- | --- | --- |
| Ver e atender conversas do setor | E | E (próprias) | R | E | L (só de prazo) |
| Criar e mover Lead | E | E | R | E | — |
| Rodar varredura de conflito | E | E | E | E | E |
| **Ver detalhe de conflito** | E | L (Casos dele) | — | — | — |
| **Decidir conflito** | E (ato) | — | — | — | — |
| Abrir Caso `em_estudo` | E | E | R | R | — |
| Enviar proposta | E | E (cartão) | — | — | — |
| Fechar contratação | E | E (cartão) | — | R | — |
| Enviar comunicado a clientes | E | R | — | R | — |
| **Liberar andamento ao cliente** | E | E | — | — | — |
| Aprovar modelo de andamento ou de mensagem | E | E (ato) | — | — | — |
| Ver auditoria de leitura do registro de conflitos | L (Administrador) | — | — | — | — |

### 12.2 Ferramentas e eventos

Famílias novas, no padrão `entidade.acao` (JU-01, 7): `lead.*` (`criar`, `triar`, `abrir_consulta`, `enviar_proposta` só por pessoa, `fechar_contrato`, que recusa sem conflito decidido, Mandato, Contrato de honorários e termo oferecido); `conflito.*` (`consultar`, `varrer`, `decidir` só sócio, `parceria.atualizar`); `modelo.andamento.aprovar` e `modelo.mensagem.aprovar` (só advogado, com versão); `andamento.traduzir` e `andamento.liberar_ao_cliente` (automático só nas condições de 10.5); `conversa.ligar_caso`; `retencao.agendar_descarte` e `retencao.anonimizar` (sempre com aviso e evento). `mensagem.transcrever` fica condicionada a `ia_permitida` ou ao aceite do lead. Eventos principais: `lead.fechar_contrato`, `conflito.decidir`, `conflito.ler_detalhe` (leitura gera evento), `conflito.superveniente`, `andamento.liberar_ao_cliente`, `audiencia.confirmada_pelo_cliente`, `retencao.descarte_em_30_dias`. Mensagem com sinal de urgência aciona a Controladoria e o advogado de plantão.

**Métricas de funil** (04, 6.3), **sem** pontuação de produtividade nem ranking (FX-012 rejeitada): leads por origem e mês, conversão por etapa, tempo de primeira resposta, motivo de recusa (lista neutra), contratos fechados, conflitos encontrados e decisões, tempo de decisão do sócio.

---

## 13. Ajustes pedidos, ordem de construção e perguntas

### 13.1 Ajustes pedidos a outros documentos

| Documento | Ajuste |
| --- | --- |
| **Fundações (01)** | (a) Lead com estados do jurídico (3.1) e vínculo opcional a Caso `em_estudo`; (b) campo `aceite_transcricao` (texto, data, canal) na Identidade; (c) `caso_inferido` na Conversa e regra "Caso restrito nunca é inferido"; (d) `retencao` por categoria (A a D, seção 6) com descarte agendado; (e) entidade **Parceiro** (não é Cliente) |
| **04 CRM** | (a) Funil jurídico (3.1); (b) **régua "lead sem resposta" e "guardar leads" não valem** no jurídico (T3, 6.3); (c) Comunicados só a clientes com Caso ativo e conteúdo informativo (T2); (d) **sem template de marketing** a lead; (e) modelos com checklist de vedações, versão e aprovador; (f) modo experimental desligado; (g) `mensagem.transcrever` condicionada a `ia_permitida`; (h) lateral de Caso na conversa; (i) retenção de lead do 10.3 não vale; (j) mensagem de urgência com foto vira Comunicação manual |
| **06 App** | (a) Papéis por **Caso** (10.3) e preposto; (b) Seções do jurídico (10.4); (c) **push e WhatsApp sem conteúdo** (CR10); (d) segundo fator para Caso restrito (AJ5); (e) abertura de citação inicial de empresa pelo representante com aviso (10.5 e JU-03, 3.3) e **harmonização com a regra "ciência nunca delegável"** (pergunta 12); (f) saída do escritório com atenção ao sigilo (10.12) |
| **JU-01** | (a) Campos do Lead jurídico e `indicado_por`; (b) **Parceiro** e `lista_de_conflito_atualizada_em`; (c) Verificação de conflito com `fonte_da_coincidencia` e "parcerias consideradas"; (d) Caso `em_estudo` aceito para **consulta arquivada sem contrato** (categoria B) com sigilo; (e) `ia_permitida` lida por áudio e por resumo |
| **JU-02** | (a) "Consultar conflito" no Lead e cartão de decisão (4.6); (b) lateral da conversa com Caso; (c) painel "andamentos a liberar / saindo em 30 minutos" no Hoje; (d) bloco "Como o cliente vê" com a prévia exata |
| **JU-03** | (a) Comunicação manual urgente por foto ou áudio no app e no WhatsApp; (b) cartão de ciência para citação inicial de empresa pelo representante (junto da decisão P11 do JU-03) |
| **JU-04** | (a) **Modelos de andamento em linguagem simples**, versionados e aprovados, por tipo de movimento; (b) lista de exclusões de envio automático; (c) checklist de comunicação comercial (T6, T7); (d) `legal.consultar(explicar)` no modo cliente |
| **JU-05** | (a) Proposta gerada do lead e **sem desconto promocional**; (b) **partilha entre advogados** e aviso na tentativa de comissão a não advogado (T9); (c) extrato da conta do cliente liberado no app; (d) parcelas no app com valor só no app |
| **JU-06 (a escrever)** | Limites do integrante de Atendimento jurídico (3.2 e fim da seção 8) e promoção "faz sozinho" para andamento relevante por modelo aprovado |
| **JU-08 (a escrever)** | Assinatura de Mandato, contrato e termo pelo app (10.7); evidências; custo por documento |
| **JU-09 (a escrever)** | Papel `correspondente` no cadastro de Parceiro; aviso de audiência |
| **JU-10 (a escrever)** | Retenção por categoria, base legal, **LGPD × sigilo** para quem consultou, RIPD do CRM, subprocessador de transcrição |
| **JU-12 (a escrever)** | Seção 11: WhatsApp, áudio, IA do atendimento, assinatura e armazenamento |
| **Estudo de Precificação** | WhatsApp jurídico (marketing zero), quantidades do jurídico a medir, franquia de IA do atendimento |

### 13.2 Ordem de construção

Só começa depois do BPO e depois das etapas J1 a J4 do JU-01 (pacote como dados, compartimento, Cliente, Caso, Parte, Processo e Mandato). Cada etapa passa por teste de vazamento por Caso e revisão da advogada e do contador da família.

| # | Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- | --- |
| C1 | **Lead e funil jurídico** (sem WhatsApp) | Quadro, estados, triagem, origem, dados mínimos | JU-01 J3 | Mostrar o quadro e os dados mínimos à advogada (20 minutos) |
| C2 | **Conflito: varredura e registro** | Conflito rápido e completo, cartão do sócio, homônimo, superveniente, Parceiro | JU-01 J3 e J4 | **10 casos de conflito e de homônimo** com a advogada; teste de vazamento do registro |
| C3 | **Travas de publicidade** | Lista de vedações, modelos aprovados, Comunicados restritos, régua de lead desligada | Parecer do advogado de ética (5.4) | Parecer; revisão dos modelos |
| C4 | **WhatsApp por setor e conversa ligada ao Caso** | Números, janela, templates de utilidade, `caso_inferido` | 04 pronto; JU-01 J2 (compartimento) | Teste: conversa de Caso restrito não aparece a quem não é membro |
| C5 | **Áudio e tarefas de conversa** | Transcrição condicionada, pedido implícito jurídico, urgência por foto | C4; JU-03 (Comunicação manual) | Teste: sem termo, áudio não é transcrito; foto vira Comunicação urgente |
| C6 | **Caso em estudo, retenção e descarte** | Categorias A a D, descarte agendado, anonimização | JU-10 (LGPD) | Parecer sobre prazos e bases (a advogada e o DPO) |
| C7 | **Proposta e contratação** | Proposta por pessoa, `lead.fechar_contrato` com 6 condições | JU-05; JU-08; C2 | Teste: contrato não fecha sem conflito, Mandato ou contrato assinado |
| C8 | **App: login, Meu processo, documentos, pendências** | Seções 10.2 a 10.6; papéis por Caso | 06; JU-01; JU-04 (modelos de andamento) | Prévia à advogada; teste de visibilidade por Caso |
| C9 | **Andamento automático por modelo** | Modelos aprovados, "automático" por cliente, lista de exclusões, atraso de 30 minutos | C8; JU-06 | **Modo sombra** de algumas semanas (regra unificada 9), sem envio real |
| C10 | **Assinatura, honorários e agenda no app** | 10.7 a 10.9 | JU-08; JU-05; JU-09 | Teste com procuração real em ambiente de teste |
| C11 | **Cliente PJ com vários usuários e marca branca** | Papéis (10.3), preposto, tema | C8 | Revisão do checklist de publicidade do tema |
| C12 | **Medição de custo** | Mensagens, áudio, IA do atendimento por escritório | C4 a C10; JU-12 | Piloto de 10 a 20 escritórios (Síntese) |

### 13.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | A consulta com fatos do caso vira Caso `em_estudo` com sigilo, e não fica no CRM comum? | Sim; lead sem fatos fica no CRM; consulta com conteúdo vira Caso em estudo, restrito por equipe | "Se a pessoa já contou o caso, o sistema trata como caso sigiloso mesmo antes de ela contratar?" |
| 2 | Quando o conflito roda e quando bloqueia? | Rápido ao receber nome ou documento (só avisa); completo antes da proposta; **bloqueia** o contrato e a nova Parte | "O sistema confere conflito já no primeiro contato e só impede de fechar se o sócio não tiver decidido?" |
| 3 | Como tratar parceria permanente sem cruzar dados entre escritórios? | A plataforma nunca cruza escritórios; o parceiro entrega uma lista, o escritório a sobe, e o sistema compara com ela | "Para conferir conflito com meu parceiro, ele me passa a lista de clientes dele e o sistema compara só com essa lista?" |
| 4 | Quem vê o detalhe do conflito? | Só o sócio; os demais veem "há coincidência, fale com o sócio" (já previsto no JU-01, a confirmar) | "A secretária vê só um aviso, e o nome da coincidência só o sócio?" |
| 5 | Quanto tempo guardar quem consultou e não contratou? | Lead sem consulta, 90 dias; consulta com conteúdo, pelo prazo de guarda do Caso (partida: 5 anos); registro mínimo de conflito por tempo igual ou maior **[a confirmar prazos e bases com advogada e DPO]**; **sem lista de reativação** | "Guardo nome de quem só consultou para checar conflito, mas nunca para mandar propaganda?" |
| 6 | Indicação e parceria: como tratar? | Cliente que indica só é registrado (nada de benefício); entre advogados, partilha com contrato; sem comissão a quem não é advogado | "O sistema registra quem indicou, mas não paga nem recompensa quem não é advogado?" |
| 7 | WhatsApp e modo não oficial | Um número por setor como no Contábil; **sem** modo não oficial; sem template de marketing; Controladoria sem número | "No jurídico, só o WhatsApp oficial e nunca mensagem de propaganda?" |
| 8 | Áudio: transcrever ou não? | Só cliente com termo de IA ou lead que aceitou na hora; recusou, o áudio fica sem texto | "O sistema só transforma áudio em texto se a pessoa deixou?" |
| 9 | Quais andamentos nunca saem sozinhos, e há atraso de segurança? | Nunca automáticos: sentença, acórdão, decisão negativa, ato que exige ação do cliente, citação, segredo de justiça, família e penal; demais relevantes saem com 30 minutos de atraso e botão "cancelar" | "Os andamentos importantes demais passam por você antes, e os simples saem com meia hora para você desfazer?" |
| 10 | Push e WhatsApp com conteúdo? | Nunca; só "há novidade, abra o app" | "O aviso no celular nunca diz o que aconteceu, só que há novidade?" |
| 11 | Segundo código para Caso sigiloso | Obrigatório para Caso restrito e segredo de justiça; o resto segue o login normal | "Casos sigilosos pedem um segundo código quando o cliente abre?" |
| 12 | Citação inicial de empresa aberta pelo representante no app | Vale como ato do **próprio titular**, com aviso do que acontece, nunca do escritório nem do integrante; o advogado é avisado; **compatibilizar com a regra "ciência nunca delegável"** com a advogada | "Se a empresa abre a própria citação no app, isso é decisão dela e não do sistema?" |
| 13 | Papel por Caso para o cliente empresa | Contato jurídico vê só os Casos atribuídos; financeiro só honorários; contador interno e RH nada do jurídico por padrão; preposto só a audiência | "Cada pessoa da empresa cliente vê só os casos e as partes que você liberou?" |

---

## Ressalvas

- **Normas não lidas.** Provimento 205/2021, CED (arts. 19 e 20), EAOAB, Lei 14.063/2020, LGPD e a Recomendação CFOAB 001/2024 vêm de resumos de busca e de documentos anteriores do projeto; **a leitura do texto oficial falhou** (o site da OAB não abriu nesta sessão). Cada trava da seção 5 e cada prazo da seção 6 é **hipótese conservadora** e exige conferência pela advogada da família e parecer de advogado de ética antes de vender ou usar com dados reais (regra unificada 9).
- **Nada aqui é parecer jurídico.** Bases legais, prazos de retenção e o alcance do sigilo sobre quem não contratou são **[a confirmar]**.
- **Quantidades de WhatsApp, áudio e IA** do jurídico **não foram medidas**; as do Contábil foram emprestadas só como ponto de partida. O exemplo de R$ 201 por mês é **ilustrativo**.
- **O alcance da "pessoa determinada"** para mensagem de WhatsApp, o tratamento do desconto e da gratuidade e a possibilidade de citar valor na proposta dependem do parecer de ética.
- **A conferência de parceria permanente** depende da lista que o parceiro fornece; o sistema não garante o que ele não informar.
- **Tensão registrada.** A decisão de JU-03 (P11) permite que o **representante da empresa abra a citação inicial no app, com aviso**; a regra unificada 4 diz que a **ciência nunca é delegável**. O texto propõe que o ato é do **titular**, não delegado, mas **isso precisa da confirmação da advogada** (pergunta 12).
- **Subplanos JU-06, JU-08, JU-09, JU-10 e JU-12** ainda não existem; os nomes e pontos de contato daqui são provisórios.
- **Premissa de mercado** (Projuris, Advbox, LexFlow vendem CRM com travas) vem da Conferência, **não verificada**.

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].
