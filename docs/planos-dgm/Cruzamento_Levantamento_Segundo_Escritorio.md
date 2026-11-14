# Cruzamento: levantamento do segundo escritório × plano da plataforma

**Data:** 14/11/2026 · **Para:** Enzo · **Base:** 10 fichas em PDF do segundo contador (investidor), datadas de 12 e 13/11/2026, com as "atividades e tarefas que realiza fora do sistema Domínio, inclusive obrigações acessórias", cruzadas com o `atividades.json` (589 atividades), as fichas D1 a D7, o Painel (subplano 03 e protótipo, oito abas), o Time de agentes (subplano 02) e o que já veio do Leandro ([Cruzamento](Cruzamento_Painel_do_Leandro.md) e [Lista de decisão](Lista_de_Decisao_Painel_do_Leandro.md)).

**Privacidade.** As fichas são dados de um cliente nosso. Aqui as pessoas aparecem só como setor e letra (ex.: "Trabalhista B"), e os nomes dos clientes do escritório e do próprio escritório foram tirados. Os PDFs não foram copiados para o repositório.

---

## Resumo em 12 linhas

1. **O que veio:** 10 fichas de 10 pessoas, com **272 atividades** feitas fora do Domínio. O número conta repetições: o DARF unificado, por exemplo, aparece nas três fichas do Trabalhista.
2. **Cruzamento:** **186 já temos planejadas (68%)**, **65 em parte (24%)** e **21 faltam (8%)**. Dessas 21, 7 estão fora do produto: compras, prédio, recrutamento, conflitos internos, TI e marketing.
3. **Onde caem hoje:** DP 61, Fiscal 55, Atendimento (CRM) 34, Contábil 31, Notas 20, Gestão 20, Societário 19, Financeiro 11, Obrigações 8, Consultoria 4 e Arquivos 2. Fora do produto, as 7 já citadas. Toda atividade do produto já tem aba e integrante.
4. **Domínio:** 31 linhas dependem dele. O escritório não quer trocar o Domínio. O que pede é fechar os buracos em volta dele: portais, confirmações, planilhas e módulos que o Domínio cobra à parte. Isso confirma o desenho "em volta do core" e aponta o que dá para substituir: Acessórias, HubStrom, SIEG, Taskem, Conexa e as planilhas.
5. **Pergunta 3, o Legal é o nosso Societário? Em parte.** O núcleo é o mesmo: abrir, alterar e encerrar empresa, licenças, conselhos e certificado. Cadastro, contratos e transição de clientes não são feitos pelo Legal de lá, e sim pela Supervisão e pela Direção. Em compensação, o Legal faz três coisas a mais: vende certificado digital, atende fiscalizações e levanta débitos nos órgãos.
6. **Nome:** a exibição padrão passa a ser **"Legalização"** na aba (título "Clientes e Legalização") e no integrante. O código `societario` não muda, e este escritório pode exibir "Legal". A aba ganha a renovação nos conselhos, a fiscalização de licença e a taxa anual de licença. O certificado vendido como serviço fica para depois.
7. **Pergunta 4, a divisão vale? Sim.** As oito abas cobrem os dois escritórios: nenhuma aba nova é necessária, e nenhuma sobra. O que muda são nomes e o vínculo de pessoas a setores.
8. **Como cada setor de lá se encaixa:** Contábil e Fiscal ficam em duas abas, com a mesma pessoa nos dois setores (as próprias pessoas preencheram fichas separadas). Recepção é o setor Gestão e Atendimento, com um perfil de "apoio" nos outros setores. Supervisão é o papel Gestor, e a Direção é o Administrador. Trabalhista é o DP, com visões de admissão e de rescisão. Obrigações continua transversal, e Notas vem junto com o Fiscal por padrão.
9. **Lista de decisão:** 34 itens, sendo **16 ENTRA agora**, **4 ENTRA depois**, **7 só a ideia** e **7 NÃO ENTRA**.
10. **Os 5 mais valiosos:** C2-01 kit de rescisão; C2-02 simulados de rescisão com cobrança de resposta; C2-07 nome de quem atende nas mensagens (com C2-08, e-mail enviado registrado sozinho); C2-03 boletos de sindicato, convênio e seguro de vida; C2-14 declaração de faturamento assinada.
11. **Dores mais repetidas:** cobrar o mesmo documento várias vezes, WhatsApp sem identificação nem triagem e planilhas paralelas (6 pessoas cada), além de salvar à mão e-mails e documentos (5 pessoas).
12. **Para mostrar ao investidor:** muito do que eles pedem já está planejado. A confirmação de recebimento vira o farol de entrega (D-17), a situação fiscal sai em lote (FIS-006) e o "gerente eletrônico" vira aviso automático (DP-007, DP-023). As lacunas maiores estão na rescisão do DP e na comunicação.

**Como ler.**
- **JÁ:** já está planejado num subplano ou no `atividades.json`. A plataforma ainda não tem código. Quando a atividade é de fase 3 em diante, a coluna diz.
- **PARCIAL:** o plano cobre parte. O que falta está escrito na linha.
- **FALTA:** não está no plano.
- **[Domínio]:** a atividade existe por causa do Domínio, seja por limite dele, por módulo pago à parte ou por trabalho que continua dentro dele.
- **D-xx:** itens do Leandro já aprovados (Lista de decisão de 9/11/2026).
- **Aba · integrante hoje:** onde a atividade cairia no desenho atual. Os nomes das abas são os curtos do protótipo.
- **Códigos dos itens:** pessoa, ficha e número da ficha. Por exemplo, TRB-DE-04 é Trabalhista B, ficha Demissão, item 04.

---


## Decisões do Enzo (14/11/2026)

- **Nome:** a aba e o integrante continuam **Societário** (E-01 = **Não**). Onde este documento diz "Legalização" como nome de aba ou integrante, leia Societário; "Legal" e "Legalização" valem só como sinônimos na busca e na IA.
- **Estrutura:** E-02, E-03, E-04 e E-05 = **Sim** ("o restante das abas estamos bem organizados").
- **Aba Obrigações:** compartilhada pelos setores, mas **dinâmica por setor**: cada setor vê as suas obrigações e o seu integrante; conta com vários setores, Gestor ou Administrador escolhe ver um, vários ou todos. Detalhe no adendo do subplano 03.
- **Lista C2:** os oito destacados foram aprovados pelo Enzo (C2-01, 02, 03, 04, 07, 08, 14 e 25). C2-14 entra no mapa de atividades. **Ampliado (Enzo):** o conector de e-mail lê **tudo**, como o painel do Leandro: caixa de entrada e enviados, com os anexos; cada arquivo vai para a pasta do cliente certo, com o mês descoberto pelas regras do D-02, e a conversa vira registro do cliente.
- **Demais itens:** seguem a recomendação deste documento (ENTRA agora = Sim; ENTRA depois = Depois; Só a ideia = Sim como ideia; NÃO ENTRA = Não). O Enzo pode trocar qualquer marcação.

## 1 e 2. Inventário das fichas e cruzamento com o nosso levantamento

Para não repetir 272 linhas duas vezes, o inventário (pedido 1) e o cruzamento (pedido 2) estão na mesma tabela. A atividade foi reescrita em linguagem simples, e a dor e a sugestão aparecem como estão na ficha, resumidas. A frequência só aparece quando a ficha diz ou quando o próprio texto deixa claro, como em "mensal" ou "por rescisão".

**Números por pessoa**

| Pessoa | Atividades | Já temos | Parcial | Falta |
| --- | --- | --- | --- | --- |
| Legal A | 8 | 5 | 3 | 0 |
| Recepção A | 17 | 6 | 7 | 4 |
| Contábil/Fiscal A | 21 | 19 | 2 | 0 |
| Contábil/Fiscal B | 15 | 13 | 1 | 1 |
| Contábil/Fiscal C | 46 | 38 | 4 | 4 |
| Direção A | 24 | 14 | 6 | 4 |
| Trabalhista A | 24 | 13 | 8 | 3 |
| Trabalhista B | 25 | 17 | 8 | 0 |
| Trabalhista C | 22 | 11 | 11 | 0 |
| Supervisão Administrativa A | 70 | 50 | 15 | 5 |
| **Total** | **272** | **186** (68%) | **65** (24%) | **21** (8%) |

**Atenção ao que as fichas não mostram.** Elas listam só o que é feito **fora** do Domínio. Escrituração, folha e apuração, que acontecem dentro dele, quase não aparecem. Por isso este levantamento não mede o tamanho de cada setor: ele mede onde estão os buracos em volta do core.

### 1.1 Legal A (ficha LEGAL/CERTIFICAÇÃO DIGITAL)

Uma ficha, 8 atividades. Sem dores nem sugestões preenchidas.

**Ficha Legal/Certificação digital**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| LEG-LE-01 | Abertura de empresa: separar documentos, montar contrato, viabilidade, DBE, registro na Junta (Jucesp), órgão de classe conforme a atividade (OAB, CRECI, CRO, CRF), Vigilância Sanitária e Anvisa; montar e acompanhar o processo; agendar e dar entrada na Junta. Deferido: CNPJ, regime tributário, Cadesp, Prefeitura e CLI, registro no conselho; guardar os documentos na pasta e mandar para o cadastro, o financeiro e o cliente; comprar e emitir o certificado digital | Por pedido | — | **JÁ** | SOC-025, 026, 027, 028, 030, 034, 038, 040; CIC-001 (passagem entre setores); certificado: SOC-201 (fase 5) | Societário · Societário |
| LEG-LE-02 | Alteração de empresa: o mesmo roteiro da abertura, mais a troca do responsável pelo CNPJ (com novo certificado digital) | Por pedido | — | **JÁ** | SOC-029, 033, 004, 009; SOC-201 (fase 5) | Societário · Societário |
| LEG-LE-03 | Encerramento de empresa: o mesmo roteiro, para cancelar registros (Junta, CNPJ, Cadesp, Prefeitura, CLI, conselho) | Por pedido | — | **JÁ** | SOC-031, 109; reflexos em FIS-110, CTB-110, DP-108 | Societário · Societário |
| LEG-LE-04 | Renovar licenças federais, estaduais e municipais | Pelo vencimento | — | **JÁ** | SOC-036 a 039, SOC-046 (calendário) | Societário · Societário |
| LEG-LE-05 | Renovar certificados (registro, regularidade) nos conselhos regionais | Pelo vencimento | — | **PARCIAL** | SOC-040 cobre registro e anuidade; a renovação do certificado do conselho não está escrita | Societário · Societário |
| LEG-LE-06 | Atender e regularizar fiscalizações federais, estaduais e municipais | Eventual | — | **PARCIAL** | Tributária: FIS-037, 038 (Fiscal); trabalhista: DP-041 (DP); fiscalização de licença (prefeitura, vigilância, bombeiros, conselho) não tem atividade | Fiscal, DP e Societário |
| LEG-LE-07 | Levantamentos nos órgãos federais, estaduais, municipais e previdenciários | Eventual e na entrada | — | **JÁ** | FIS-006, 027, 030 (Fiscal); SOC-022, 102 (entrada); GES-207 (prospect) | Fiscal · Fiscal; Societário na entrada |
| LEG-LE-08 | Certificação digital: separar documentos, comprar, vender, emitir, controlar vencimentos e enviar ao cliente | Contínua | — | **PARCIAL** | Controle e vencimento: SOC-008, 009, 010 (fase 0 a 2); emissão pelo escritório SOC-201 e revenda GES-205 (ambas fase 5) | Societário · Societário |

### 1.2 Recepção A

Quatro fichas (Recepção, Fiscal, Contábil, Trabalhista), 17 atividades. A ficha Fiscal pula o nº 06.

**Ficha Recepção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| REC-RE-01 | Atendimento no balcão | Diária | Sem dor; o presencial dá clareza e permite falar com dois setores juntos | **JÁ** | GES-033 (registrar o atendimento); o ato é humano | CRM (Atendimento) · Gestão e Atendimento |
| REC-RE-02 | Atendimento por telefone | Diária | Dor: a triagem (menu) do telefone só lista setores, sem orientar. Sugestão: menu com mais orientação; uniformizar também o WhatsApp | **PARCIAL** | GES-024 (encaminhar ao setor), GES-033, GES-050; a URA do telefone fixo não está no plano | CRM (Atendimento) · Gestão e Atendimento |
| REC-RE-03 | Imprimir a relação de malotes a enviar | Por remessa | Dor: a lista é atualizada à mão (empresas baixadas, que saíram ou novas que pedem malote). Sugestão: um sistema que avise sobre o malote das empresas novas | **FALTA** | Não há malote no plano; a lista sairia do ciclo de vida (CIC-001) e da preferência de entrega | CRM (Atendimento) · Gestão e Atendimento |
| REC-RE-04 | Organizar os malotes a enviar | Por remessa | Sem dor; trabalho manual de conferência | **FALTA** | Ato físico; o plano não tem malote | CRM (Atendimento) · Gestão e Atendimento |
| REC-RE-05 | Montar a lista de compras do escritório (estoque de material) | Periódica | Dor: dá para esquecer item ou comprar antes da hora. Sugestão: planilha compartilhada onde cada um marca o que pegou ou falta | **FALTA** | Fora do escopo (compras internas) | Fora do produto · — |

**Ficha Fiscal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| REC-FI-01 | Separar documentos que chegam pelo malote (notas de venda, de compra, de serviços tomados, NFS-e, notas manuais) e salvar na pasta | Por remessa | Dor: cliente manda tudo junto, amassado e rasgado; dá erro. Sugestão: as notas do malote só seriam conferidas e devolvidas, com consulta no sistema | **PARCIAL** | NFE-012 e CTB-004 (triagem do que chega digital); captura por XML (NFE-004 a 009) reduz o papel; papel físico não | Notas · Notas |
| REC-FI-02 | Consultar o pagamento dos impostos | Mensal | Dor: consulta espalhada por e-CAC, prefeituras e outros portais | **JÁ** | FIS-032 (verificar se a guia foi paga) | Fiscal · Fiscal |
| REC-FI-03 | Cobrar os pagamentos não localizados | Mensal | Sem dor; atendimento humano explica o imposto ao cliente | **JÁ** | FIS-032 (lembrar e cobrar) | Fiscal · Fiscal |
| REC-FI-04 | Digitalizar relatórios e protocolos e salvar nas pastas | Contínua | Sugestão: assinatura digital reduziria papel, mas leva tempo para os clientes aderirem | **PARCIAL** | Prova de entrega digital (D-17 do Leandro, DP-019); digitalização de papel não | Arquivos (módulo) · do setor |
| REC-FI-05 | Consultar a situação fiscal de todas as empresas no e-CAC e preencher planilha de pendências | Periódica | Dor: trabalho árduo em mais de 100 empresas. Sugestão: sistema que junte situação, pendências e impostos a pagar | **JÁ** | FIS-006 (faz sozinho, compara com o anterior) | Fiscal · Fiscal |
| REC-FI-07 | Protocolar as NF-e já lançadas e devolvê-las ao cliente | Por remessa | Sem dor; manuseio indispensável para devolver o papel | **FALTA** | Devolução física com protocolo não está no plano (só no desligamento, SOC-024) | CRM (Atendimento) · Gestão e Atendimento |

**Ficha Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| REC-CT-01 | Analisar as despesas gerais enviadas e cobrar as que faltam | Mensal | Dor: não se sabe quais despesas continuam (luz, água, aluguel, financiamento); o cliente avisa só na cobrança. Sugestão: o cliente comunicar formalmente as mudanças | **JÁ** | CTB-001, 003, 005; contas esperadas (D-03) | Contábil · Contábil |
| REC-CT-02 | Conferir as despesas já escrituradas e arquivar ou devolver ao cliente | Mensal | Sem dor; manuseio indispensável | **PARCIAL** | CTB-050 (guarda); devolução física não | Contábil · Contábil |

**Ficha Trabalhista**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| REC-TR-01 | Separar no malote os documentos trabalhistas (registro, atestados) e levar ao setor | Por remessa | — | **PARCIAL** | DP-002, DP-046 e GES-026 para o que chega digital; papel não | DP · DP |
| REC-TR-02 | Consultar o pagamento dos impostos trabalhistas (FGTS, sindicatos, e-CAC) | Mensal | Dor: consulta espalhada entre portais | **PARCIAL** | DP-021 (GFD e DARF); boleto de sindicato não | DP · DP |
| REC-TR-03 | Cobrar os pagamentos não realizados | Mensal | Sem dor; atendimento humano | **JÁ** | DP-021 | DP · DP |
| REC-TR-04 | Digitalizar os protocolos e guardar na pasta | Contínua | Mesma sugestão de assinatura digital | **PARCIAL** | Prova de entrega digital (D-17); papel não | Arquivos (módulo) · do setor |

### 1.3 Contábil/Fiscal A

Duas fichas (Contábil e Fiscal), 21 atividades.

**Ficha Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFA-CT-01 | Cobrar do cliente as despesas (a ficha não detalha; pelo contexto, os comprovantes de despesa) | Mensal | — | **JÁ** | CTB-003 | Contábil · Contábil |
| CFA-CT-02 | Conciliação (extrato bancário, fornecedores, impostos e folha) | Mensal | — | **JÁ** | CTB-015, 018, 019, 020 | Contábil · Contábil |
| CFA-CT-03 | Analisar balancete e demonstrações contábeis | Mensal | — | **JÁ** | CTB-025 | Contábil · Contábil |
| CFA-CT-04 | Montar, executar e controlar planilhas | Contínua | — | **PARCIAL** | Vago; os blocos do Painel substituem os controles conhecidos (central de guias, lucros, fechamento) | Contábil · Contábil |
| CFA-CT-05 | Atendimento ao cliente (telefone, e-mail e WhatsApp) | Diária | — | **JÁ** | GES-023, 024, 027 | CRM (Atendimento) · Gestão e Atendimento |
| CFA-CT-06 | Organizar e classificar documentos para a escrita contábil | Mensal | — | **JÁ** | CTB-004, 015 | Contábil · Contábil |
| CFA-CT-07 | Orientar e conferir as atividades feitas no contábil | Contínua | — | **JÁ** | CTB-026, GES-016; cartão de aprovação | Contábil · Contábil |
| CFA-CT-08 | Assinar e enviar as demonstrações contábeis quando o cliente pede | Por pedido | — | **JÁ** | CTB-031; assinatura do contador (D-16 do Leandro) | Contábil · Contábil |
| CFA-CT-09 | Analisar e calcular depreciações | Mensal | — | **JÁ** | CTB-047 | Contábil · Contábil |
| CFA-CT-10 | Entregar obrigações acessórias (ECD, ECF, Reinf, IBGE) | Anual e mensal | — | **PARCIAL** | CTB-041, 042, FIS-020; a pesquisa do IBGE não está no plano | Contábil · Contábil |
| CFA-CT-11 | Consultar a situação fiscal (e-CAC e DUC) | Periódica | — | **JÁ** | FIS-006 | Fiscal · Fiscal |
| CFA-CT-12 | Verificar as despesas recebidas por e-mail e WhatsApp | Diária | Dor: o Outlook funciona uns dias e outros não. Sugestão: trocar o servidor de e-mail; ter WhatsApp profissional | **JÁ** | CTB-004, GES-023, GES-027; conector de e-mail (08) | Contábil · Contábil |
| CFA-CT-13 | Montar o balanço de abertura | Por pedido | — | **JÁ** | CTB-108, 103 | Contábil · Contábil |
| CFA-CT-14 | Analisar as distribuições de lucros | Mensal | — | **JÁ** | CTB-033, 034; controle mensal de lucros (D-12) | Contábil · Contábil |
| CFA-CT-15 | Elaborar e enviar termos e comunicados diversos | Eventual | — | **JÁ** | GES-030; comunicado em PDF (D-19) | CRM (Atendimento) · Gestão e Atendimento |

**Ficha Fiscal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFA-FI-01 | Atendimento ao cliente (telefone, e-mail e WhatsApp) | Diária | — | **JÁ** | GES-023, 024, 027 | CRM (Atendimento) · Gestão e Atendimento |
| CFA-FI-02 | Orientar e conferir as atividades feitas no fiscal | Contínua | — | **JÁ** | FIS-004, FIS-047 | Fiscal · Fiscal |
| CFA-FI-03 | Entregar SPED ICMS e SPED Contribuições | Mensal | — **[Domínio]** | **JÁ** | FIS-023, 024 (o arquivo sai do core) | Obrigações · Fiscal |
| CFA-FI-04 | Apurar e enviar os impostos de um cliente de grande volume | Mensal | — | **JÁ** | FIS-021, 031 | Fiscal · Fiscal |
| CFA-FI-05 | Orientar clientes a emitir NFS-e no novo portal nacional | Por pedido | — | **JÁ** | NFE-031 | Notas · Notas |
| CFA-FI-06 | Emitir e enviar impostos quando necessário | Mensal | — | **JÁ** | FIS-031 | Fiscal · Fiscal |

### 1.4 Contábil/Fiscal B

Duas fichas (Contábil e Fiscal), 15 atividades. As linhas 11 e 12 da ficha Contábil são sugestões, não atividades: entram como dores.

**Ficha Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFB-CT-01 | Lançar impostos e despesas na planilha de controle de cada empresa | Mensal | Planilha paralela ao Domínio **[Domínio]** | **JÁ** | FIS-031 (central de guias), CTB-019 | Fiscal · Fiscal |
| CFB-CT-02 | Triar as despesas de dois clientes | Mensal | — | **JÁ** | CTB-004 | Contábil · Contábil |
| CFB-CT-03 | Conciliação bancária de dois clientes | Mensal | — | **JÁ** | CTB-015, 018 | Contábil · Contábil |
| CFB-CT-04 | Conciliação bancária de outros dois clientes | Mensal | — | **JÁ** | CTB-015, 018 | Contábil · Contábil |
| CFB-CT-05 | Atendimento por telefone, WhatsApp e e-mail | Diária | Dor: Outlook com problemas de envio e recebimento. Sugestão: melhorar o servidor de e-mail; no WhatsApp, inserir sozinho o nome de quem atende | **PARCIAL** | GES-023, 027; nome automático de quem atende não está escrito (C2-04) | CRM (Atendimento) · Gestão e Atendimento |
| CFB-CT-06 | Planilha de saldos e de antecipação ou distribuição de lucros | Mensal | — | **JÁ** | CTB-036; D-12 | Contábil · Contábil |
| CFB-CT-07 | Planilha de controle da EFD-Reinf de lucros | Mensal | — | **JÁ** | D-15 (trava depois do REINF) | Contábil · Contábil |
| CFB-CT-08 | Entregar a DCTFWeb da EFD-Reinf de lucros pelo e-CAC | Trimestral | Só para empresas com saldo alto e regularizadas | **JÁ** | FIS-019, 020; D-15 | Fiscal · Fiscal |
| CFB-CT-09 | Entregar a pesquisa do IBGE pelos aplicativos PAC (comércio) e PAS (serviços), quando a empresa é chamada | Anual | — | **FALTA** | Não está no plano | Contábil · Contábil |
| CFB-CT-10 | Conferir lucros distribuídos de um cliente, entregar a EFD-Reinf e emitir o DARF de IRRF | Mensal | Valores altos | **JÁ** | CTB-034; alerta de R$ 50 mil (D-14) | Contábil · Contábil |

**Ficha Fiscal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFB-FI-01 | Lançar a apuração do DAS nas planilhas de controle; emitir pelo e-CAC para alguns | Mensal | Planilha paralela **[Domínio]** | **JÁ** | FIS-009, 010 | Fiscal · Fiscal |
| CFB-FI-02 | Apurar DARF do Lucro Presumido (PIS e COFINS mensal, IRPJ e CSLL trimestral) na planilha, emitir guias e transmitir a DCTFWeb | Mensal e trimestral | Planilha paralela **[Domínio]** | **JÁ** | FIS-019, 021, 031 | Fiscal · Fiscal |
| CFB-FI-03 | Conferir os valores recebidos por um cliente para calcular os impostos | Mensal | — | **JÁ** | FIS-004, NFE-022 | Fiscal · Fiscal |
| CFB-FI-04 | Entregar SPED ICMS/IPI | Mensal | — **[Domínio]** | **JÁ** | FIS-023, 024 | Obrigações · Fiscal |
| CFB-FI-05 | Entregar SPED Contribuições | Mensal | — **[Domínio]** | **JÁ** | FIS-023 | Obrigações · Fiscal |

### 1.5 Contábil/Fiscal C

Duas fichas (Fiscal e Contábil), 46 atividades: é a ficha mais longa do escritório.

**Ficha Fiscal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFC-FI-01 | Atendimento por WhatsApp, telefone e e-mail | Diária | Dor: mensagens do Outlook com problema. Sugestão: outra plataforma para os e-mails | **JÁ** | GES-023, 027 | CRM (Atendimento) · Gestão e Atendimento |
| CFC-FI-02 | Montar a programação semanal | Semanal | — | **JÁ** | Minha fila (D-22); aviso da manhã (02, 7.1) | Gestão · Gestão e Atendimento |
| CFC-FI-03 | EFD-Reinf de INSS: salvar as notas | Mensal | Dor: notas lançadas e Reinf entregues à mão **[Domínio]** | **JÁ** | FIS-020, NFE-027 | Fiscal · Fiscal |
| CFC-FI-04 | EFD-Reinf de INSS: identificar a retenção | Mensal | Dor: às vezes o Domínio não identifica a retenção e é preciso ajustar à mão **[Domínio]** | **JÁ** | NFE-027 (conferir INSS retido nas NFS-e) | Notas · Notas |
| CFC-FI-05 | Escriturar notas de serviços tomados de outros municípios | Mensal | — **[Domínio]** | **JÁ** | NFE-007, FIS-028 | Notas · Notas |
| CFC-FI-06 | Cobrar notas de serviços tomados de outros municípios | Mensal | — | **JÁ** | NFE-038 | Notas · Notas |
| CFC-FI-07 | Emitir ficha e guia de ISS | Mensal | — | **JÁ** | FIS-028 | Fiscal · Fiscal |
| CFC-FI-08 | Mandar mensagem confirmando que o cliente recebeu a guia de ISS | Mensal | Confirmação manual | **JÁ** | FIS-031 (enviada, lida, paga); farol de entrega (D-17) | Fiscal · Fiscal |
| CFC-FI-09 | Cobrar o movimento fiscal das empresas | Mensal | — | **JÁ** | NFE-038, CTB-003 | Notas · Notas |
| CFC-FI-10 | Salvar os arquivos conforme os clientes mandam e registrar na ficha de controle | Diária | Controle paralelo | **JÁ** | GES-026, CTB-201 | Notas · Notas |
| CFC-FI-11 | Emitir nota fiscal de serviço (para o cliente) | Por pedido | — | **JÁ** | NFE-039 | Notas · Notas |
| CFC-FI-12 | Cobrar recibos e comprovantes de pagamento de aluguel | Mensal | — | **JÁ** | CTB-001, 003 (documento recorrente esperado) | Contábil · Contábil |
| CFC-FI-13 | EFD-Reinf e DARF de aluguel de um cliente | Mensal | Dor: cobrança repetida várias vezes | **JÁ** | FIS-020, 021 | Fiscal · Fiscal |
| CFC-FI-14 | Enviar o DARF de aluguel e de serviços tomados | Mensal | — | **JÁ** | FIS-031 | Fiscal · Fiscal |
| CFC-FI-15 | Relatório das notas de venda de dois clientes que mandam foto das notas | Mensal | Dor: faturamento chega por foto. Sugestão: converter imagem em PDF e juntar os PDFs | **JÁ** | NFE-012, CTB-009 | Notas · Notas |
| CFC-FI-16 | Emitir o DAS de um MEI (PGMEI) | Mensal | — | **JÁ** | FIS-016 | Fiscal · Fiscal |
| CFC-FI-17 | Enviar o livro de entradas a três clientes | Mensal | — **[Domínio]** | **JÁ** | Entrega pelo app (GES-039); o livro sai do core | Fiscal · Fiscal |
| CFC-FI-18 | Entregar a MIT e salvar as guias | Mensal | — | **JÁ** | FIS-019 | Fiscal · Fiscal |
| CFC-FI-19 | Separar notas de compra de outros estados para apurar o ICMS | Mensal | — | **JÁ** | NFE-026 | Notas · Notas |
| CFC-FI-20 | Mandar mensagem confirmando que o cliente recebeu os impostos | Mensal | Confirmação manual | **JÁ** | FIS-031; D-17 | Fiscal · Fiscal |
| CFC-FI-21 | Conferir e enviar o PGDAS sem movimento | Mensal | — | **JÁ** | FIS-009 | Fiscal · Fiscal |
| CFC-FI-22 | Conferir as notas de compra interestaduais na apuração do ICMS | Mensal | Dor: nota por nota e NCM por NCM leva tempo | **JÁ** | NFE-023, 025, 026 | Notas · Notas |
| CFC-FI-23 | Mandar mensagem confirmando as notas de compra de outros estados | Mensal | Confirmação manual | **JÁ** | D-17 | Notas · Notas |
| CFC-FI-24 | Carimbar, preencher e protocolar notas de compra de outros estados | Mensal | Ato em papel | **FALTA** | Ato físico; não está no plano | Notas · Notas |
| CFC-FI-25 | Conferir a apuração do ICMS DIFAL | Mensal | — | **JÁ** | NFE-026 | Notas · Notas |
| CFC-FI-26 | Consultar a Econet (base de legislação) | Contínua | — | **JÁ** | CON-002 (Consultor com base citada) | Consultoria · Consultor |
| CFC-FI-27 | Ficha de controle de parcelamentos | Mensal | Controle paralelo | **JÁ** | FIS-034 | Fiscal · Fiscal |
| CFC-FI-28 | Emitir, controlar, enviar e confirmar parcelamentos | Mensal | — | **JÁ** | FIS-034 | Fiscal · Fiscal |
| CFC-FI-29 | Mandar mensagem confirmando que o cliente recebeu o ICMS | Mensal | Confirmação manual | **JÁ** | FIS-031; D-17 | Fiscal · Fiscal |
| CFC-FI-30 | Entregar a DeSTDA (SEDIF) | Mensal | — | **JÁ** | FIS-024 | Obrigações · Fiscal |
| CFC-FI-31 | Declaração de faturamento das empresas | Por pedido | — | **FALTA** | Não está no plano (DECORE, CTB-032, é só de rendimento de pessoa física) | Contábil · Contábil |
| CFC-FI-32 | Escrituração manual das notas de compra | Mensal | Trabalho manual no core **[Domínio]** | **JÁ** | NFE-033 (lote ao core), NFE-008, 012 | Notas · Notas |
| CFC-FI-33 | Atualizar as fichas de controle de impostos | Mensal | Controle paralelo | **JÁ** | FIS-031, FIS-047 (substituem a ficha) | Obrigações · Fiscal |
| CFC-FI-34 | Termo de declaração de faturamento | Por pedido | — | **FALTA** | Não está no plano | Contábil · Contábil |
| CFC-FI-35 | Simular parcelamentos | Por pedido | — | **PARCIAL** | FIS-035 (fase 4); FIS-034 só controla | Fiscal · Fiscal |
| CFC-FI-36 | Atualizar certificados e cadastros no SIEG | Pelo vencimento | Ferramenta paralela | **JÁ** | NFE-003; GES-604 (o SIEG sai por último) | Notas · Notas |
| CFC-FI-37 | Enviar todo mês as CNDs atualizadas a clientes que pedem | Mensal | — | **JÁ** | FIS-036 | Fiscal · Fiscal |
| CFC-FI-38 | Enviar as alíquotas que o cliente pede (DAS, ISS, ICMS) | Por pedido | — | **JÁ** | FIS-044, FIS-033 | Fiscal · Fiscal |
| CFC-FI-39 | Recalcular impostos | Por pedido | — | **JÁ** | FIS-201, FIS-021 | Fiscal · Fiscal |
| CFC-FI-40 | Ajustar as notas de compra das locadoras | Mensal | A ficha não diz o motivo **[Domínio]** | **PARCIAL** | Provável NFE-034 (de-para e exceções por fornecedor); confirmar com o escritório | Notas · Notas |
| CFC-FI-41 | Credenciar o CSC (NFC-e) | Por pedido | — | **JÁ** | FIS-107 | Fiscal · Fiscal |
| CFC-FI-42 | Ajudar o cliente a emitir notas fiscais | Por pedido | — | **JÁ** | NFE-019, NFE-201, FIS-044 | Notas · Notas |
| CFC-FI-43 | Escrever passo a passo (tutorial) para o cliente | Eventual | — | **PARCIAL** | GES-020 é só procedimento interno; biblioteca de passo a passo para o cliente não está escrita | CRM (Atendimento) · Gestão e Atendimento |

**Ficha Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| CFC-CT-01 | Separar notas de compra de imobilizado para a depreciação | Mensal | — | **JÁ** | CTB-047 | Contábil · Contábil |
| CFC-CT-02 | Protocolar notas para lançamento | Mensal | Controle em papel | **PARCIAL** | Fila de documentos digitais (CTB-004); protocolo de papel não | Contábil · Contábil |
| CFC-CT-03 | Compartilhar os dados de faturamento da empresa (Pronampe) | Por pedido | — | **FALTA** | Não está no plano; vai junto da declaração de faturamento | Contábil · Contábil |

### 1.6 Direção A (sócio que conduz o escritório; o setor não vem escrito: a ficha cobre Comercial, Financeiro, Administração, Logística, Legal, Cadastro, TI, Marketing, apoio aos setores e IRPF)

Dez fichas, 24 atividades. Pelo conteúdo, é quem decide e cuida do negócio (é a leitura desta análise; a ficha não diz o cargo).

**Ficha Comercial**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-CO-01 | Contato com o prospect (WhatsApp, telefone, presencial) | Contínua | Dor: registro numa ficha de prospect. Sugestão: CRM com timesheet; IA usada de forma sadia, para não virar desserviço | **JÁ** | GES-042 (fase 3); Leads do CRM (04) | CRM (Atendimento) · Gestão e Atendimento |
| DIR-CO-02 | Elaborar e enviar a proposta de honorários | Por prospect | Dor: feita de cabeça. Sugestão: modelo padrão feito por IA | **JÁ** | SOC-015, GES-401, GES-402 | CRM (Atendimento) · Gestão e Atendimento |
| DIR-CO-03 | Fazer o contrato de honorários a partir da proposta, enviar e colher assinatura | Por cliente novo | Dor: hoje há contratos só verbais. Sugestão: modelo padrão feito por IA | **JÁ** | SOC-016 | Societário · Societário |
| DIR-CO-04 | Termo de cessação de serviços | Por saída | Hoje vai por e-mail e WhatsApp. Sugestão: modelo por IA | **JÁ** | SOC-106, GES-046 | Societário · Societário |
| DIR-CO-05 | Termo de reativação de serviços | Por retorno | Idem | **PARCIAL** | Reativação de ex-cliente não está escrita (CIC-010 trata mudança de porte) | Societário · Societário |
| DIR-CO-06 | Marketing em redes sociais (vídeos, tutoriais) para orientar e captar clientes | — | Dor: não há nada. Sugestão: montar um projeto | **FALTA** | Fora do escopo (só GES-032 responde mensagens) | Fora do produto · — |

**Ficha Financeiro**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-FN-01 | Abrir uma ficha em Excel para cada cliente | Por cliente novo | Dor: rudimentar e frágil | **JÁ** | FIN-001 | Financeiro (módulo) · Financeiro do escritório |
| DIR-FN-02 | Lançar na ficha os valores a cobrar e os recebidos | Mensal | — | **JÁ** | GES-003, FIN-002 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| DIR-FN-03 | Imprimir em PDF o demonstrativo da cobrança | Mensal | — | **JÁ** | FIN-010 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| DIR-FN-04 | Preencher no Word a relação mensal de faturamento | Mensal | — | **JÁ** | GES-001, FIN-001 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| DIR-FN-05 | Emitir a NFS-e no portal nacional e os boletos no banco, e mandar ao cliente | Mensal | Dor: processo trabalhoso. Sugestão: ligar o banco ao sistema de cobrança para emitir boleto, NFS-e e enviar | **JÁ** | GES-001, GES-007, FIN-603, FIN-604 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| DIR-FN-06 | Acompanhar recebimentos e atrasos em dois bancos | Diária | Dor: difícil ter extrato do que entrou e do que falta. Sugestão: ligar o extrato ao sistema e conciliar sozinho | **JÁ** | GES-003, FIN-004 (fase 3) | Financeiro (módulo) · Financeiro do escritório |

**Ficha Administração/Recepção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-AD-01 | Admissão, manutenção e demissão da equipe do escritório | Por evento | Dor: perde tempo com pagamentos por fora, em espécie. Sugestão: sistema que gere pagamentos e distribuição de lucros; controle de faltas e de atitudes positivas e negativas para bônus | **PARCIAL** | GES-061 (o escritório como cliente da carteira, fase 3), FIN-008 (bônus por meta, fase 3), GES-016 | Gestão · Gestão e Atendimento |
| DIR-AD-02 | Estrutura física do prédio | Contínua | Dor: só ele vê o que precisa melhorar. Sugestão: um lugar onde todos façam apontamentos | **FALTA** | Fora do escopo | Fora do produto · — |
| DIR-AD-03 | Copa, cozinha, limpeza e material de escritório | Contínua | Sugestão: controle de cotações no sistema | **FALTA** | Fora do escopo | Fora do produto · — |
| DIR-AD-04 | Plano de carreira: o que aprender nos primeiros 15, 30, 45, 60, 75 e 90 dias e depois | Por contratação | Montar de forma estruturada | **PARCIAL** | GES-022 (trilha por setor, fase 3) | Gestão · Gestão e Atendimento |

**Ficha Logística**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-LO-01 | Malote e entrega da folha de pagamento em mãos | Mensal | Dor: trabalhoso e caro (funcionário e motoboy). Sugestão: mandar pelo sistema, negociando com os clientes antigos | **PARCIAL** | DP-019, DP-020 e app (GES-039) para o digital; malote não | DP · DP |

**Ficha Legal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-LE-01 | Estruturar no sistema o fluxo de entrada, permanência e saída de clientes, para todos os setores, sem falhas entre eles | Contínua | Dor: há quem tenha dificuldade de sair do jeito antigo. Sugestão: sistema simples de operar | **JÁ** | CIC-001, trilhas de entrada e saída (03, seção 8) | Societário · Societário |

**Ficha Cadastro**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-CA-01 | Cadastro dos clientes ativos, inativos, cessados e que saíram | Contínua | Dor: falta centralizar. Sugestão: CRM com a história inteira do cliente no escritório | **JÁ** | SOC-001, CIC-001, CIC-011 | Societário · Societário |

**Ficha TI**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-TI-01 | TI terceirizada, com uma pessoa da equipe fazendo a ponte (e apoio do Enzo) | Contínua | Dor: vulnerabilidade, sem backup em nuvem. Sugestão: backup em nuvem e físico (diário, semanal, mensal) | **FALTA** | Fora do escopo; o que estiver na plataforma fica em nuvem com cópia | Fora do produto · — |
| DIR-TI-02 | Combinar com o Enzo a construção de IA e skills por setor | — | Dor: pouco conhecimento de IA na equipe. Quer a equipe estudando e trabalhando de forma consultiva | **JÁ** | É o próprio produto: integrantes por setor (02, 3.2); GES-407 (agentes próprios, fase 4) | Gestão · Gestão e Atendimento |

**Ficha Marketing e mídias sociais**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-MK-01 | Vídeos tutoriais e canais no YouTube, Instagram e LinkedIn; apoio ao comercial; circulares, comunicados e passo a passo em PDF para clientes | — | Dor: não há nada. Sugestão: desenhar e executar um projeto | **PARCIAL** | Comunicados (GES-030, GES-044) sim; marketing não; passo a passo para cliente não está escrito | CRM (Atendimento) · Gestão e Atendimento |

**Ficha Trabalhista/Fiscal/Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-SU-01 | Dar suporte em situações críticas | Eventual | Dor: precisa guardar o histórico dessas situações | **PARCIAL** | GES-019 (registro de erros e causas, fase 3) | Gestão · Gestão e Atendimento |

**Ficha IRPF**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| DIR-IR-01 | IRPF: análise, elaboração, entrega, controle e cobrança das declarações | Anual | Dor: ele faz a maioria; emitir NFS-e, boletos e cobrar é lento. Sugestão: sistema para conferir as declarações, salvar em PDF, cobrar, mandar as quotas e receber documentos | **JÁ** | PF-003 a 011 (perfil pessoa física, fases 1 e 2); GES-009 (cobrança anual, fase 3) | Fiscal (perfil pessoa física) · Fiscal |

### 1.7 Trabalhista A

Duas fichas (Admissão e manutenção; Demissão), 24 atividades.

**Ficha Admissão e manutenção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRA-AM-01 | Emitir o DARF unificado no e-CAC | Mensal | Dor: o Domínio emite, mas cobra à parte. Sugestão: incluir no sistema **[Domínio]** | **JÁ** | DP-017 | DP · DP |
| TRA-AM-02 | Emitir boletos de sindicato (assistencial, odontológico, convênio médico) e seguro de vida | Mensal | Dor: alguns só saem depois do dia 25; a folha fica aberta e o boleto pode ser esquecido. Sugestão: emitir e salvar sozinho na pasta da empresa | **PARCIAL** | DP-020 cita a guia sindical no pacote; emissão nos portais e lembrete do dia 25 não | DP · DP |
| TRA-AM-03 | Mandar ao cliente o 'gerente eletrônico' (avisos de vencimento do Domínio) | Semanal | Sugestão: mandar sozinho **[Domínio]** | **JÁ** | DP-007, DP-023 | DP · DP |
| TRA-AM-04 | Programação de férias | Mensal | Sugestão: mandar sozinho, com controle e lembrete das férias perto do limite | **JÁ** | DP-023, 024 | DP · DP |
| TRA-AM-05 | Salvar os e-mails enviados | Diária | Dor: toma tempo | **PARCIAL** | Envio pela plataforma já fica registrado; e-mail mandado por fora não (C2-13) | CRM (Atendimento) · Gestão e Atendimento |
| TRA-AM-06 | Emitir parcelamento | Por pedido | — | **JÁ** | FIS-034 | Fiscal · Fiscal |
| TRA-AM-07 | Situação fiscal para ver débitos em aberto | Periódica | Sugestão: conferir e passar ao cliente os débitos, perguntando se recalcula | **JÁ** | FIS-006, FIS-201 | Fiscal · Fiscal |
| TRA-AM-08 | Atendimento no WhatsApp | Diária | Sugestão: filtrar e controlar por prioridade | **JÁ** | GES-023, 024; virar tarefa (04) | CRM (Atendimento) · Gestão e Atendimento |
| TRA-AM-09 | Consultar convenções coletivas | Contínua | Dor: o Domínio faz, mas cobra à parte **[Domínio]** | **JÁ** | DP-033, DP-034 | DP · DP |
| TRA-AM-10 | Conferir os documentos da admissão e avisar o cliente do que falta | Por admissão | Sugestão: conferir e cobrar sozinho os documentos obrigatórios | **JÁ** | DP-002 | DP · DP |
| TRA-AM-11 | Salvar à mão os documentos da admissão | Por admissão | Sugestão: salvar sozinho na pasta de cada empresa | **JÁ** | GES-026, DP-060 | DP · DP |
| TRA-AM-12 | Confirmar recebimento: tudo que vai por e-mail é confirmado pelo WhatsApp | Diária | Sugestão: a IA fazer a confirmação | **JÁ** | Farol de entrega (D-17) | CRM (Atendimento) · Gestão e Atendimento |
| TRA-AM-13 | Comandas (ordens de serviço para cobrança) | Por serviço | — | **PARCIAL** | SOC-017, GES-002 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| TRA-AM-14 | Levantar as convenções e preencher o resumo interno com os pontos principais | Por convenção nova | Sugestão: fazer o levantamento e destacar os pontos usados no dia a dia | **PARCIAL** | DP-201 (fase 4) | DP · DP |
| TRA-AM-15 | Termo de ciência: fazer, mandar pelo ZapSign e acompanhar até o cliente assinar | Por caso | — | **PARCIAL** | Assinatura eletrônica existe para contrato (SOC-016); termo de ciência com régua não está escrito | DP · DP |
| TRA-AM-16 | Consultar empréstimos consignados no portal do governo e salvar | Mensal | Dor: toma muito tempo. Sugestão: a IA consultar e salvar | **JÁ** | DP-013 | DP · DP |
| TRA-AM-17 | Assinatura em toda conversa de WhatsApp | Diária | Dor: copiar e colar em toda conversa. Sugestão: assinatura automática | **FALTA** | O plano tem nome do número, não de quem atende (C2-04) | CRM (Atendimento) · Gestão e Atendimento |
| TRA-AM-18 | Acompanhar as mudanças na legislação trabalhista | Contínua | Sugestão: consultar sozinho e avisar | **JÁ** | DP-043 | DP · DP |

**Ficha Demissão**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRA-DE-01 | Controlar os simulados de rescisão, principalmente a data de pagamento | Por pedido | Sugestão: controlar e avisar quando algum estiver perto de vencer | **PARCIAL** | DP-027 conta o prazo da rescisão; simulado não | DP · DP |
| TRA-DE-02 | Passar o simulado do Domínio para o modelo próprio enviado ao cliente | Por pedido | Dor: retrabalho; o cliente não entende o simulado do Domínio. Sugestão: a IA importar do Domínio para o modelo **[Domínio]** | **FALTA** | Não está no plano | DP · DP |
| TRA-DE-03 | Extrato do FGTS | Por rescisão | Sugestão: emitir e salvar sozinho | **PARCIAL** | DP-029 (GFD rescisória); extrato não | DP · DP |
| TRA-DE-04 | Requerimento do seguro-desemprego | Por rescisão | Sugestão: emitir e salvar sozinho | **JÁ** | DP-031 | DP · DP |
| TRA-DE-05 | Extrato para fins rescisórios (para achar competências em aberto) | Por rescisão | Sugestão: pedir e fazer o levantamento | **PARCIAL** | Não está escrito; perto de DP-029 | DP · DP |
| TRA-DE-06 | Cobrar do cliente a resposta sobre o simulado | Diária | Dor: o cliente pede e não diz se segue; cobrança diária. Sugestão: cobrar sozinho | **FALTA** | Não está no plano | DP · DP |

### 1.8 Trabalhista B

Duas fichas (Admissão e manutenção; Demissão), 25 atividades.

**Ficha Admissão e manutenção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRB-AM-01 | Emitir o DARF unificado no e-CAC | Mensal | Dor: o Domínio emite, mas cobra à parte **[Domínio]** | **JÁ** | DP-017 | DP · DP |
| TRB-AM-02 | Emitir boletos do sindicato (assistencial, seguro de vida, odontológico, convênio médico) | Mensal | Dor: sites instáveis. Sugestão: um robô emitir e salvar na pasta | **PARCIAL** | DP-020; emissão nos portais não | DP · DP |
| TRB-AM-03 | Mandar a folha ao cliente por e-mail | Mensal | Dor: a Acessórias é complexa e não reconhecia os boletos do sindicato. Sugestão: envio prático e rápido | **JÁ** | DP-020 (pacote único) | DP · DP |
| TRB-AM-04 | Avisar os clientes dos contratos de experiência vencendo ('gerente eletrônico') | Semanal (1º dia útil) | Dor: consulta no Domínio e envio à mão. Sugestão: um robô mandar toda semana **[Domínio]** | **JÁ** | DP-007 | DP · DP |
| TRB-AM-05 | Avisar os clientes das férias vencendo | Mensal | Dor: consulta no Domínio e envio à mão. Sugestão: um robô mandar todo mês **[Domínio]** | **JÁ** | DP-023 | DP · DP |
| TRB-AM-06 | Emitir parcelamento previdenciário | Por pedido | Dor: e-CAC e Regularize instáveis. Sugestão: robô emite e salva; a pessoa confere; o robô manda ao cliente | **JÁ** | FIS-034 | Fiscal · Fiscal |
| TRB-AM-07 | Emitir a situação fiscal | Periódica | Dor: muito demorado, empresa por empresa no e-CAC. Sugestão: fazer sozinho com IA | **JÁ** | FIS-006 | Fiscal · Fiscal |
| TRB-AM-08 | Atendimento no WhatsApp | Diária | Dor: muita demanda e perguntas simples ('quando vence a experiência de X?'). Sugestão: IA responder na hora | **JÁ** | GES-025, DP-058 | CRM (Atendimento) · Gestão e Atendimento |
| TRB-AM-09 | Consultar convenções coletivas | Diária | Dor: o Domínio cobra; o site do Ministério do Trabalho não tem todos os sindicatos. Sugestão: IA baixar as convenções novas **[Domínio]** | **JÁ** | DP-034 | DP · DP |
| TRB-AM-10 | Salvar na pasta os e-mails mandados aos clientes | Diária | Dor: esquecem e voltam depois. Sugestão: IA salvar cópia de todo e-mail enviado | **PARCIAL** | C2-13 | CRM (Atendimento) · Gestão e Atendimento |
| TRB-AM-11 | Receber a documentação para registro | Por admissão | Dor: checklist e cobrança tomam tempo. Sugestão: IA triar e cobrar o que falta (ex.: comprovante de endereço) | **JÁ** | DP-002 | DP · DP |
| TRB-AM-12 | Confirmar recebimento de guias, folha, documentos e processos | Diária | Sugestão: a IA mandar WhatsApp confirmando sempre que algo sai por e-mail | **JÁ** | D-17 | CRM (Atendimento) · Gestão e Atendimento |
| TRB-AM-13 | Recalcular guias: DARF, FGTS, sindicato | Por pedido | — | **PARCIAL** | FIS-201 cobre DAS, DARF e parcelamento; FGTS e sindicato não | DP · DP |
| TRB-AM-14 | Comandas para o Financeiro | Por serviço | Dor: feitas em papel. Sugestão: automatizar | **PARCIAL** | SOC-017, GES-002 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| TRB-AM-15 | Levantar a convenção coletiva destacando os pontos principais | Por convenção nova | Dor: ler e listar todos os pontos. Sugestão: IA fazer o levantamento | **PARCIAL** | DP-201 (fase 4) | DP · DP |
| TRB-AM-16 | Aviso de férias: emitir, mandar e registrar | Por férias | Dor: toma tempo para algo simples. Sugestão: o sistema emitir, mandar e alimentar o controle | **JÁ** | DP-024 | DP · DP |
| TRB-AM-17 | Consultar empréstimos consignados | Mensal | Dor: manual. Sugestão: robô consultar e salvar o print na pasta | **JÁ** | DP-013 | DP · DP |
| TRB-AM-18 | WhatsApp controlado pela IA | Diária | Dor: parar para responder tira o foco. Sugestão: a demanda nova vira tarefa com prioridade no gerenciador | **JÁ** | GES-024; virar tarefa (04) | CRM (Atendimento) · Gestão e Atendimento |

**Ficha Demissão**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRB-DE-01 | Emitir o formulário do seguro-desemprego | Por rescisão | Dor: muitos passos no Empregador Web. Sugestão: IA emitir | **JÁ** | DP-031 | DP · DP |
| TRB-DE-02 | Emitir o extrato do FGTS | Por rescisão | Sugestão: IA salvar sozinha | **PARCIAL** | Não está escrito | DP · DP |
| TRB-DE-03 | Controlar o pagamento do FGTS rescisório | Por rescisão | Dor: o FGTS Digital não tem extrato de pagamento; empresa por empresa. Sugestão: puxar sozinho o que foi pago e o que está aberto | **JÁ** | DP-029, DP-021 | DP · DP |
| TRB-DE-04 | Extrato para fins rescisórios | Por rescisão | Dor: pede num dia e só chega no outro. Sugestão: emitir sozinho quando a rescisão é informada | **PARCIAL** | Não está escrito | DP · DP |
| TRB-DE-05 | Aviso prévio: emitir, mandar e registrar | Por rescisão | Dor: toma tempo. Sugestão: o sistema emitir, mandar e registrar (nome, modalidade, vencimento) | **JÁ** | DP-026, DP-030 | DP · DP |
| TRB-DE-06 | Conferir os dados cadastrais no formulário do Ministério do Trabalho | Por rescisão | Dor: erro feito na admissão aparece no seguro-desemprego. Sugestão: IA conferir nome, mãe, sexo contra a Receita | **PARCIAL** | DP-004 confere na admissão; reconferir na saída não está escrito | DP · DP |
| TRB-DE-07 | Emitir a guia rescisória no FGTS Digital | Por rescisão | Sugestão: IA baixar e salvar na pasta | **JÁ** | DP-029 | DP · DP |

### 1.9 Trabalhista C

Três fichas (Admissão e manutenção; Demissão; TI), 22 atividades. Na observação, conta que também troca cabos e monitores, cria perfis para quem entra e tira dúvidas de informática.

**Ficha Admissão e manutenção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRC-AM-01 | Emitir o DARF unificado no e-CAC | Mensal | Dor: o Domínio emite, mas cobra à parte. Sugestão: incluir no sistema **[Domínio]** | **JÁ** | DP-017 | DP · DP |
| TRC-AM-02 | Emitir boletos de sindicato (assistencial, odontológico, convênio médico, seguro de vida) | Mensal | — | **PARCIAL** | DP-020; emissão nos portais não | DP · DP |
| TRC-AM-03 | Mandar o 'gerente eletrônico' aos clientes | Semanal | Sugestão: mandar sozinho **[Domínio]** | **JÁ** | DP-007, DP-023 | DP · DP |
| TRC-AM-04 | Mandar a programação de férias aos clientes | Mensal | Sugestão: mandar sozinho | **JÁ** | DP-023 | DP · DP |
| TRC-AM-05 | Salvar à mão os e-mails enviados | Diária | Dor: toma tempo. Sugestão: salvar sozinho na pasta | **PARCIAL** | C2-13 | CRM (Atendimento) · Gestão e Atendimento |
| TRC-AM-06 | Emitir parcelamento | Por pedido | — | **JÁ** | FIS-034 | Fiscal · Fiscal |
| TRC-AM-07 | Emitir a situação fiscal para ver débitos | Periódica | — | **JÁ** | FIS-006 | Fiscal · Fiscal |
| TRC-AM-08 | Atendimento no WhatsApp | Diária | Sugestão: pôr sozinho o nome de quem manda a mensagem | **PARCIAL** | C2-04 | CRM (Atendimento) · Gestão e Atendimento |
| TRC-AM-09 | Consultar convenção coletiva | Contínua | Dor: o Domínio faz, mas cobra à parte. Sugestão: incluir no sistema **[Domínio]** | **JÁ** | DP-034 | DP · DP |
| TRC-AM-10 | Conferir os documentos para registro | Por admissão | Sugestão: alerta quando faltar documento obrigatório | **JÁ** | DP-002 | DP · DP |
| TRC-AM-11 | Salvar à mão os documentos da admissão | Por admissão | Sugestão: salvar sozinho na pasta | **JÁ** | GES-026, DP-060 | DP · DP |
| TRC-AM-12 | Confirmar recebimento à mão | Diária | Sugestão: confirmação automática | **JÁ** | D-17 | CRM (Atendimento) · Gestão e Atendimento |
| TRC-AM-13 | Comandas de valores | Por serviço | — | **PARCIAL** | SOC-017, GES-002 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| TRC-AM-14 | Levantar as convenções | Por convenção nova | Dor: toma tempo. Sugestão: destacar os pontos principais | **PARCIAL** | DP-201 (fase 4) | DP · DP |
| TRC-AM-15 | Registrar as demandas num aplicativo de tarefas (Taskem) para não esquecer | Diária | Sugestão: lembrete para cada pendência, para retomar depois | **JÁ** | Tarefas do Painel (03, seção 7); Minha fila (D-22) | Gestão · Gestão e Atendimento |

**Ficha Demissão**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRC-DE-01 | Controlar os simulados com vencimento próximo | Por pedido | Sugestão: controle no sistema dos simulados perto de vencer | **PARCIAL** | DP-027 só depois da rescisão; simulado não | DP · DP |
| TRC-DE-02 | Salvar o extrato do FGTS | Por rescisão | Sugestão: salvar sozinho ao escolher o empregado que sai | **PARCIAL** | Não está escrito | DP · DP |
| TRC-DE-03 | Salvar o extrato para fins rescisórios | Por rescisão | Sugestão: informar empregado e data; o sistema pede, salva no dia seguinte e lembra de conferir | **PARCIAL** | Não está escrito | DP · DP |
| TRC-DE-04 | Seguro-desemprego | Por rescisão | Sugestão: conferir nome, nome da mãe, nascimento e sexo e só então emitir | **PARCIAL** | DP-031 emite; conferência na saída não está escrita (DP-004 é na admissão) | DP · DP |

**Ficha TI (empresa terceirizada)**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| TRC-TI-01 | Comunicado de feriado | Por feriado | Sugestão: comunicado automático em cada feriado | **JÁ** | GES-030 | CRM (Atendimento) · Gestão e Atendimento |
| TRC-TI-02 | Despertador toda quinta para trocar o backup semanal | Semanal | Sugestão: alerta que só some quando ela confirmar a troca | **PARCIAL** | Tarefa recorrente com conclusão por confirmação (03, 7.6) serve; backup não é escopo | Gestão · Gestão e Atendimento |
| TRC-TI-03 | Despertador todo 1º dia útil para trocar o backup mensal | Mensal | Mesma sugestão | **PARCIAL** | Idem | Gestão · Gestão e Atendimento |

### 1.10 Supervisão Administrativa A

Sete fichas (Fiscal, Contábil, Admissão e manutenção, Demissão, Cadastro, Transição de clientes, Administrativo/Financeiro), 70 atividades: supervisiona o fiscal e cuida de parte do RH interno e do administrativo.

**Ficha Fiscal**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-FI-01 | Atendimento por telefone | Diária | — | **JÁ** | GES-033 | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-02 | Atendimento por WhatsApp | Diária | Sugestão: WhatsApp profissional com assinatura automática de quem fala | **PARCIAL** | WhatsApp oficial por setor (04); nome automático: C2-04 | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-03 | Mandar e ler e-mails | Diária | Dor: o Outlook é muito ruim no dia a dia. Sugestão: pedir outras opções à TI | **JÁ** | GES-027; conector de e-mail (08) | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-04 | Reunião semanal com a equipe | Semanal | — | **PARCIAL** | Os números saem da Gestão (GES-016); a pauta pronta não está escrita | Gestão · Gestão e Atendimento |
| SUP-FI-05 | Conferir e atualizar a ficha de controle de impostos | Mensal | Controle paralelo | **JÁ** | FIS-031, FIS-047 | Obrigações · Fiscal |
| SUP-FI-06 | Consultas constantes de legislação | Contínua | Sugestão: IA para ajudar a interpretar | **JÁ** | CON-002 (Consultor) | Consultoria · Consultor |
| SUP-FI-07 | Emitir e enviar os DARFs do IRPF (1ª a 8ª quota) | Anual | — | **JÁ** | PF-008 | Fiscal (perfil pessoa física) · Fiscal |
| SUP-FI-08 | Emitir DECORE quando o cliente pede | Por pedido | — | **JÁ** | CTB-032 | Contábil · Contábil |
| SUP-FI-09 | Conferir e assinar declarações de faturamento | Por pedido | — | **FALTA** | Não está no plano | Contábil · Contábil |
| SUP-FI-10 | Fazer e mandar comunicados aos clientes | Eventual | Hoje por lista de transmissão, sem muito tempo gasto | **JÁ** | GES-030 | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-11 | Apurar impostos (Simples e Presumido) | Mensal | Sugestão: incluir no HubStrom **[Domínio]** | **JÁ** | FIS-009, 019, 021 | Fiscal · Fiscal |
| SUP-FI-12 | Conferir e enviar os impostos apurados pelas colegas | Mensal | Já passou a emissão da guia para quem apura; ainda confere | **JÁ** | FIS-004; cartão de aprovação | Fiscal · Fiscal |
| SUP-FI-13 | Emitir NFS-e para alguns clientes | Por pedido | Sugestão: rever o preço, porque no portal nacional demora mais | **JÁ** | NFE-039; serviço extra (GES-002, fase 3) | Notas · Notas |
| SUP-FI-14 | Dar suporte às colegas | Contínua | — | **PARCIAL** | GES-020 (procedimentos), Consultor; o resto é humano | Gestão · Gestão e Atendimento |
| SUP-FI-15 | Entregar o PGDAS mensal | Mensal | Sugestão: pôr as sem movimento no robô do Domínio (a implantação parou por erros do sistema) **[Domínio]** | **JÁ** | FIS-009 | Fiscal · Fiscal |
| SUP-FI-16 | Entregar as anuais: DEFIS, D-SUP, DMED, MIT, IRPF, DEFIS de extinção | Anual | — | **PARCIAL** | FIS-013, FIS-028 (D-SUP), FIS-019 (MIT), PF-008, FIS-110; a DMED não está no plano | Obrigações · Fiscal |
| SUP-FI-17 | Levantamento fiscal da empresa que entra no escritório | Por cliente novo | — | **JÁ** | FIS-101, 103, SOC-022 | Fiscal · Fiscal |
| SUP-FI-18 | Credenciar NFC-e | Por pedido | — | **JÁ** | FIS-107 | Fiscal · Fiscal |
| SUP-FI-19 | Reunião inicial com o cliente | Por cliente novo | — | **JÁ** | GES-105 | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-20 | Consultar a situação fiscal | Periódica | Sugestão: incluir no HubStrom | **JÁ** | FIS-006 | Fiscal · Fiscal |
| SUP-FI-21 | Consultar a opção pelo Simples Nacional | Anual | — | **JÁ** | FIS-014 (fase 4), SOC-028 | Fiscal · Fiscal |
| SUP-FI-22 | Pedir parcelamento de impostos | Por pedido | — | **JÁ** | FIS-034 | Fiscal · Fiscal |
| SUP-FI-23 | Acompanhar os termos de exclusão do Simples | Anual | — | **JÁ** | FIS-008 | Fiscal · Fiscal |
| SUP-FI-24 | Gerar o código de acesso do Simples na abertura ou alteração | Por pedido | — | **PARCIAL** | Cabe em FIS-107 (habilitar o cliente), mas não está escrito | Fiscal · Fiscal |
| SUP-FI-25 | Mandar a taxa de licença de todas as prefeituras | Anual | Decidiram mandar todas para o cliente não deixar de receber | **PARCIAL** | SOC-036 fala em pagar taxas; a taxa anual como guia do calendário não está escrita | Societário · Societário |
| SUP-FI-26 | Fazer passo a passo de emissão de nota fiscal | Eventual | — | **PARCIAL** | Biblioteca de passo a passo para cliente não está escrita | CRM (Atendimento) · Gestão e Atendimento |
| SUP-FI-27 | Recalcular impostos | Por pedido | — | **JÁ** | FIS-201 | Fiscal · Fiscal |
| SUP-FI-28 | Parametrizar os sistemas | Por cliente novo | — **[Domínio]** | **JÁ** | NFE-103, catálogo (Gestão) | Gestão · Gestão e Atendimento |
| SUP-FI-29 | Consultar o CNAE para o anexo do Simples | Por pedido | — | **JÁ** | FIS-009, SOC-025 | Fiscal · Fiscal |
| SUP-FI-30 | Emitir CNDs | Por pedido | Sugestão: incluir no HubStrom | **JÁ** | FIS-036 | Fiscal · Fiscal |
| SUP-FI-31 | Levantar débitos fiscais em todos os órgãos | Periódica | — | **JÁ** | FIS-006, 027, 030 | Fiscal · Fiscal |
| SUP-FI-32 | Ver notificações e intimações fiscais | Diária | — | **JÁ** | FIS-005, 026, 029, 038 | Fiscal · Fiscal |
| SUP-FI-33 | Consultar códigos para as operações fiscais nas notas | Por pedido | — | **JÁ** | FIS-044, NFE-302 | Notas · Notas |
| SUP-FI-34 | Consultar o calendário de vencimentos | Mensal | — | **JÁ** | FIS-001 | Obrigações · Fiscal |
| SUP-FI-35 | Mandar consultas legislativas no começo do ano | Anual | — | **JÁ** | GES-044, CON-002 | Consultoria · Consultor |
| SUP-FI-36 | Gerir o setor: prazos, obrigações em dia, distribuir as tarefas | Contínua | — | **JÁ** | GES-016, GES-017, FIS-047 | Gestão · Gestão e Atendimento |
| SUP-FI-37 | Assistir aos vídeos de atualização que chegam pelo WhatsApp de um serviço de legislação | Contínua | Agrega muito valor | **PARCIAL** | Vigilância do Consultor (fase 4); resumo para a equipe não está escrito | Consultoria · Consultor |
| SUP-FI-38 | Cursos oferecidos pelo escritório | Contínua | — | **JÁ** | GES-022 (fase 3) | Gestão · Gestão e Atendimento |

**Ficha Contábil**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-CT-01 | Escrituração contábil | Mensal | — **[Domínio]** | **JÁ** | Feita no core; a plataforma prepara e confere (CTB-015 a 027) | Contábil · Contábil |
| SUP-CT-02 | Mandar a Reinf | Mensal | — | **JÁ** | FIS-020 | Fiscal · Fiscal |
| SUP-CT-03 | Fechamento anual para emitir os livros | Anual | — **[Domínio]** | **JÁ** | CTB-040 | Contábil · Contábil |

**Ficha Admissão e manutenção**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-AM-01 | Processar a folha mensal, pró-labore e antecipação de lucros | Mensal | — **[Domínio]** | **JÁ** | DP-009 a 016, DP-015 | DP · DP |
| SUP-AM-02 | Liberar férias anuais e coletivas | Por férias | — | **JÁ** | DP-024, 025 | DP · DP |
| SUP-AM-03 | Ler convenção coletiva | Por convenção nova | — | **PARCIAL** | DP-201 (fase 4) | DP · DP |
| SUP-AM-04 | Mandar a DCTFWeb | Mensal | — | **JÁ** | DP-017 | DP · DP |
| SUP-AM-05 | Controlar os horários das colegas (equipe do escritório) | Diária | — | **PARCIAL** | GES-061 (o escritório como cliente, fase 3); GES-052 | Gestão · Gestão e Atendimento |
| SUP-AM-06 | Mandar eventos de admissão, demissão e periódicos ao eSocial | Por evento | — | **JÁ** | DP-006, 016, 029 | DP · DP |
| SUP-AM-07 | Contrato de estagiária (pelo contexto, da equipe do escritório) | Por contratação | — | **PARCIAL** | DP-005 é contrato de trabalho; estágio não está escrito | DP · DP |
| SUP-AM-08 | Pré-entrevista com candidatas | Por contratação | — | **FALTA** | Fora do escopo (recrutamento) | Fora do produto · — |
| SUP-AM-09 | Acompanhar o desempenho das colegas | Contínua | — | **PARCIAL** | GES-016 (produtividade por pessoa); avaliação de desempenho não | Gestão · Gestão e Atendimento |
| SUP-AM-10 | Orientar as colegas sobre os procedimentos internos | Contínua | — | **JÁ** | GES-020 | Gestão · Gestão e Atendimento |
| SUP-AM-11 | Ajudar a treinar colegas novas | Por contratação | — | **JÁ** | GES-022 (fase 3) | Gestão · Gestão e Atendimento |
| SUP-AM-12 | Avaliar conflitos internos | Eventual | — | **FALTA** | Fora do escopo | Fora do produto · — |
| SUP-AM-13 | Acompanhar a qualidade do atendimento (WhatsApp e telefone) | Contínua | — | **JÁ** | GES-034, GES-038, GES-201 (fase 4) | Gestão · Gestão e Atendimento |
| SUP-AM-14 | Ajudar a implantar ferramentas de controle e comunicados | Eventual | — | **JÁ** | GES-608 (plano de migração) | Gestão · Gestão e Atendimento |

**Ficha Demissão**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-DE-01 | Simulado de rescisão | Por pedido | — **[Domínio]** | **PARCIAL** | DP-059 (custo de demitir, fase 4); controle do simulado não | DP · DP |
| SUP-DE-02 | Processo demissional completo | Por rescisão | — | **JÁ** | DP-026 a 032 | DP · DP |
| SUP-DE-03 | Agendar exame médico admissional e demissional | Por evento | — | **JÁ** | DP-003, DP-028 | DP · DP |
| SUP-DE-04 | Atendimento e acerto trabalhista | Por rescisão | — | **JÁ** | DP-030 | DP · DP |

**Ficha Cadastro**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-CA-01 | Cadastrar e atualizar nos sistemas a empresa que entra ou sai | Por evento | — **[Domínio]** | **JÁ** | SOC-001, SOC-021, GES-104, GES-108, CIC-001 | Societário · Societário |
| SUP-CA-02 | Parametrizar os sistemas de gestão (SIEG, Acessórias, HubStrom) | Por evento | Três ferramentas paralelas | **JÁ** | GES-601, 604, 606 (a plataforma substitui) | Gestão · Gestão e Atendimento |
| SUP-CA-03 | Atualizar as planilhas | Contínua | — | **JÁ** | Substituídas pelo cadastro único (SOC-001) | Societário · Societário |

**Ficha Transição de clientes**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-TC-01 | Fazer e mandar a autorização para retirar os documentos no contador anterior | Por cliente novo | — | **JÁ** | SOC-023, CIC-002 | Societário · Societário |
| SUP-TC-02 | Conduzir a transferência da empresa que entra ou sai, de forma organizada e respeitosa | Por evento | — | **JÁ** | CIC-002, CIC-003, SOC-024, trilhas (03, seção 8) | Societário · Societário |

**Ficha Administrativo/Financeiro**

| Nº | Atividade | Freq. | Dor e sugestão | Situação | No nosso levantamento | Aba · integrante hoje |
| --- | --- | --- | --- | --- | --- | --- |
| SUP-AF-01 | Cartão de Natal | Anual | — | **FALTA** | Não está no plano | CRM (Atendimento) · Gestão e Atendimento |
| SUP-AF-02 | Controlar e mandar os boletos do próprio escritório | Mensal | — | **JÁ** | GES-001, GES-004 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| SUP-AF-03 | Conferir a agenda de aniversariantes | Diária | — | **FALTA** | Não está no plano | CRM (Atendimento) · Gestão e Atendimento |
| SUP-AF-04 | Lançar as comandas de serviço | Por serviço | — | **PARCIAL** | SOC-017, GES-002 (fase 3) | Financeiro (módulo) · Financeiro do escritório |
| SUP-AF-05 | Mandar termo de cessação de serviços | Por saída | — | **JÁ** | SOC-106, GES-046 | Societário · Societário |
| SUP-AF-06 | Mandar termo de reativação de serviços | Por retorno | — | **PARCIAL** | Reativação de ex-cliente não está escrita | Societário · Societário |


---

## 3. O que as fichas dizem sobre o Domínio

**31 das 272 linhas** levam a marca [Domínio]. Elas se dividem em cinco grupos:

| Grupo | Linhas | O que acontece | O que isso diz |
| --- | --- | --- | --- |
| **Módulo que o Domínio cobra à parte** | TRA-AM-01, TRB-AM-01, TRC-AM-01 (DARF unificado); TRA-AM-09, TRB-AM-09, TRC-AM-09 (convenção coletiva) | O Domínio faz, mas o escritório não paga o módulo e faz à mão no e-CAC ou no site do Ministério do Trabalho | É argumento de venda: a plataforma faz isso pelo Integra Contador (DP-017) e pela vigilância de convenções (DP-034). Não sai de graça (o Integra Contador cobra por consulta), mas entra no pacote |
| **Relatório do Domínio repassado à mão** | TRA-AM-03, TRB-AM-04, TRB-AM-05, TRC-AM-03 ("gerente eletrônico": experiência e férias vencendo) | Consultam no Domínio e mandam por WhatsApp e e-mail toda semana ou todo mês | Já está planejado como aviso automático (DP-007, DP-023). Enquanto não houver API, o integrante lê o relatório exportado na pasta (08, 6.3: pasta do Domínio indexada) |
| **Saída do Domínio que o cliente não entende** | TRA-DE-02, SUP-DE-01 (simulado de rescisão) | Redigitam o simulado num modelo próprio | Não está no plano (C2-02). É o mesmo padrão: ler o PDF do core e reescrever para o cliente |
| **Falha ou limite do Domínio** | CFC-FI-04 (às vezes não identifica a retenção de INSS), SUP-FI-15 (o robô do PGDAS sem movimento travou por erros), CFC-FI-32 e CFC-FI-40 (escrituração e ajustes manuais de notas de compra) | Conferência e correção à mão | A conferência da plataforma antes de importar (NFE-027, NFE-034, NFE-033) é o que resolve. O PGDAS sem movimento não depende do robô do Domínio (FIS-009) |
| **Trabalho que continua dentro do Domínio, com controle por fora** | CFB-CT-01, CFB-FI-01, CFB-FI-02 (impostos copiados para planilha), CFA-FI-03, CFB-FI-04, CFB-FI-05 (SPED), CFC-FI-03, CFC-FI-05, CFC-FI-17, SUP-FI-11, SUP-FI-28, SUP-CT-01, SUP-CT-03, SUP-AM-01, SUP-CA-01 | Apuram, escrituram e geram arquivos no Domínio e controlam numa planilha (a "ficha de controle de impostos") | A plataforma não substitui essa parte. Ela substitui a planilha de controle (central de guias FIS-031, calendário FIS-001, painel de atrasos FIS-047) e confere e comprova o que o core gera (FIS-023) |

**Outras ferramentas citadas nas fichas, e o destino de cada uma no plano:**

| Ferramenta | Para que usam | No plano |
| --- | --- | --- |
| Acessórias | Envio da folha (dizem que é complexa e não reconhece boleto de sindicato) | Substituída (GES-601) |
| HubStrom | Atendimento e tarefas ("incluir esta tarefa no HubStrom") | Substituída (GES-606) |
| SIEG | Captura de XML e cadastro de certificados | Substituída, por último (GES-604) |
| Taskem | Lista de pendências do Trabalhista | Substituída pelas tarefas do Painel (03, seção 7) |
| Conexa | Cobrança do escritório (querem ligar o banco a ela) | Substituída (FIN-603, fase 3) |
| ZapSign | Assinatura do termo de ciência | Vira o conector de assinatura (fornecedor ainda não escolhido) |
| Econet e um serviço de vídeos de legislação | Consulta e atualização | O Consultor responde com base citada. A Econet pode seguir como fonte do escritório |
| Outlook | E-mail do dia a dia (instável, segundo quatro pessoas) | A plataforma tira volume do e-mail, mas o servidor de e-mail é infraestrutura do escritório (C2-12) |
| Excel e Word | Ficha financeira de cada cliente e relação mensal de faturamento | Financeiro do escritório (FIN-001, GES-001) |

**Conclusão sobre integrar ou substituir.** O escritório trabalha "fora do Domínio" porque o Domínio não alcança os portais (e-CAC, FGTS Digital, Empregador Web, sindicatos, prefeituras) nem a conversa com o cliente. O Domínio **fica** e a plataforma **integra**: entrada por API, saída a negociar e arquivo de troca enquanto isso, como está no 08, 6.3. O que a plataforma **substitui** são as ferramentas e planilhas do meio. Para a conversa com a Thomson Reuters, estas fichas acrescentam um pedido concreto: ler os relatórios do Domínio (gerente eletrônico e simulado de rescisão) sem passar por PDF.

---

## 4. Pergunta central 1: o setor "Legal" deste escritório é o nosso "Societário"?

### 4.1 Atividade por atividade

As linhas abaixo são as partes das 8 atividades da ficha Legal A, mais as tarefas de legalização que aparecem em outras fichas do escritório.

| Atividade do Legal deles | No nosso desenho | Onde mora | Situação |
| --- | --- | --- | --- |
| Separar documentos e montar o contrato (abertura, alteração, encerramento) | SOC-026, modelos SOC-101 | Societário | Cobre |
| Viabilidade | SOC-025 | Societário | Cobre |
| DBE | SOC-027 | Societário | Cobre |
| Registro na Junta Comercial (Jucesp), agendamento e entrada do processo | SOC-026, SOC-030 | Societário | Cobre |
| Montar e acompanhar o processo | SOC-030 (consulta de andamento e exigências) | Societário | Cobre |
| Órgãos de classe: OAB, CRECI, CRO, CRF | SOC-040 (registro da empresa e do responsável técnico, anuidades) | Societário | Cobre |
| Vigilância Sanitária e Anvisa | SOC-038 | Societário | Cobre (o integrante organiza e lembra; o ato é humano) |
| CNPJ e regime tributário | SOC-027, SOC-028 | Societário (regime com apoio do Fiscal) | Cobre |
| Cadesp (inscrição estadual em SP) | SOC-005, SOC-027 | Societário | Cobre |
| Prefeitura e CLI (licenciamento integrado) | SOC-027, SOC-035, SOC-036 | Societário | Cobre |
| Guardar os documentos na pasta e mandar para o cadastro, o financeiro e o cliente | SOC-034 (documentos vigentes); CIC-001 (passagem entre setores); FIN-002 e GES-103 (cobrar taxas e implantação, fase 3) | Societário, com aviso ao Financeiro | Em parte: a passagem existe, mas o aviso ao Financeiro para cobrar a abertura só vem na fase 3 (ver C2-25) |
| Troca do responsável pelo CNPJ | SOC-029, SOC-004 | Societário | Cobre |
| Encerramento: cancelar Junta, CNPJ, Cadesp, Prefeitura, CLI e conselho | SOC-031, SOC-109; reflexos FIS-110, CTB-110, DP-108 | Societário, com Fiscal, Contábil e DP | Cobre |
| Renovar licenças federais, estaduais e municipais | SOC-036 a 039, calendário SOC-046 | Societário | Cobre |
| Renovar certificados nos conselhos regionais | SOC-040 cita registro e anuidade, não a renovação | Societário | Em parte (C2-20) |
| Atender e regularizar fiscalização federal, estadual e municipal | Tributária: FIS-037, FIS-038; trabalhista: DP-041; de licença (prefeitura, vigilância, bombeiros, conselho): nada | **Fiscal e DP**; a de licença ficaria no Societário | Em parte (C2-21) |
| Levantamentos nos órgãos federais, estaduais, municipais e previdenciários | FIS-006, 027, 030 (situação fiscal); SOC-022, SOC-102 (na entrada); GES-207 (prospect) | **Fiscal**; Societário só na entrada | Cobre, em outra aba |
| Certificação digital: controle de vencimento e envio | SOC-008, 009, 010 | Societário | Cobre |
| Certificação digital: separar documentos, comprar, **vender** e emitir | SOC-201 (emitir pelo escritório) e GES-205 (revenda), ambas fase 5 | Societário e Financeiro | Em parte (C2-23) |
| Taxa anual de licença das prefeituras (lá, quem manda é a Supervisão) | SOC-036 cita pagar taxas | Societário, com guia na central de guias do Fiscal | Em parte (C2-22) |
| Código de acesso do Simples na abertura (lá, é a Supervisão) | Perto de FIS-107 | Fiscal | Em parte (C2-17) |
| Certidões negativas (lá, quem emite e manda é o Fiscal) | FIS-036, FIS-037 | **Fiscal** | Cobre; o mesmo lugar que lá |

### 4.2 O que o nosso Societário tem e o Legal deles não faz

| Bloco do nosso Societário (03, 6.1) | Quem faz neste escritório |
| --- | --- |
| Ficha e perfil do cliente, cadastro (SOC-001 a 005) | Supervisão (Cadastro) e Direção (Cadastro) |
| Contratos e honorários (SOC-015, 016, 106) | Direção (Comercial) e Supervisão (termos de cessação e reativação) |
| Ciclo de vida, entrada e saída de cliente (CIC, SOC-021 a 024) | Supervisão (Transição de clientes) e Direção (fluxo de entrada e saída) |
| Pessoas, acessos e procurações (SOC-004, 011 a 014) | Nenhuma ficha cita |
| Atas, livros, e-BEF, Domicílio Judicial, capital estrangeiro (SOC-006, 007, 041 a 045) | Nenhuma ficha cita |

### 4.3 Resposta

**Corresponde em parte.** O núcleo do Legal deles, a legalização, é o mesmo do nosso Societário: abrir, alterar e encerrar empresa, cuidar de licenças, conselhos e certificado digital. A diferença está nas bordas:
- **O Legal deles é mais estreito** no cadastro, nos contratos e na transição de clientes, que lá ficam com a Supervisão e a Direção.
- **O Legal deles é mais largo** em três pontos: vende certificado digital como serviço, atende fiscalizações e faz levantamentos nos órgãos. No nosso desenho, os dois últimos moram no Fiscal (e no DP, quando a fiscalização é trabalhista).

Não é outro setor. É o nosso Societário sem a parte de cadastro e com a certificação mais forte. O Leandro chama o mesmo setor de "Legalização", e ele também controla certificado e parcelamento.

**O nome deveria mudar.** "Societário" descreve só uma parte do trabalho (os atos da sociedade). Os dois escritórios usam a palavra da legalização ("Legalização" e "Legal").

| O que | Hoje | Recomendação |
| --- | --- | --- |
| Código do setor | `societario` | Não muda (só a exibição) |
| Título da aba | Clientes e Societário | **Clientes e Legalização** |
| Nome curto da aba | Societário | **Legalização** |
| Integrante | Societário | **Legalização** |
| Este escritório | — | Renomeia a exibição para "Legal", como as Fundações 4.1 já permitem |

**O que muda na aba (03, 6.1):**
- O bloco "Legalização e processos" ganha a renovação do registro e do certificado nos conselhos (C2-20), a fiscalização de licença como tipo de processo (C2-21) e a taxa anual de licença no calendário do setor (C2-22).
- O bloco "Certificados" ganha, depois, o certificado como serviço vendido pelo escritório (C2-23).
- A situação fiscal e as fiscalizações tributária e trabalhista continuam no Fiscal e no DP, com link a partir da ficha.

**O que muda no integrante (02, 3.2):** novos gatilhos:
- registro no conselho a vencer;
- fiscalização de licença registrada;
- certificado a 30 dias do vencimento, que passa a oferecer a emissão pelo escritório quando houver parceria.

A função ganha uma frase: "cuida da legalização e do certificado digital do cliente, do pedido ao vencimento".

---

## 5. Pergunta central 2: a nossa divisão de painéis vale para os dois escritórios?

### 5.1 Comparação

| Nossa aba (integrante) | Leandro | Este escritório | Leitura |
| --- | --- | --- | --- |
| Societário (Societário) | Legalização (pastas por órgão, certificado, parcelamento) | Legal/Certificação; cadastro com a Supervisão e a Direção | Mesmo setor; o nome dos dois é "legalização" (ver 4.3) |
| Obrigações (Fiscal, transversal) | Central de alertas e agenda tributária | "Ficha de controle de impostos" atualizada por várias pessoas e conferida pela Supervisão | Os dois precisam, nenhum tem equipe só para isso. Continua aba transversal, sem setor próprio |
| Notas (Notas) | Dentro do Fiscal | Dentro do Fiscal (escrituração, notas interestaduais) e da Recepção (separar o malote) | Nenhum dos dois tem equipe de notas. A aba e o integrante fazem sentido (20 linhas aqui, 48 atividades no mapa), mas o setor deve vir junto com o Fiscal |
| Fiscal (Fiscal) | Fiscal | Contábil/Fiscal (mesmas três pessoas) e Supervisão | Mesmo setor |
| DP (DP) | Pessoal | Trabalhista, dividido em "Admissão e manutenção" e "Demissão" | Mesmo setor; a divisão interna de lá é útil |
| Contábil (Contábil) | Contábil | Contábil/Fiscal (mesmas pessoas, fichas separadas) | Mesmo setor |
| Consultoria (Consultor) | Não há | Não há; consultas de legislação espalhadas (Econet, vídeos, "IA para interpretar") | Ninguém tem equipe de consultoria, e todos consultam. Continua aba fina, com o Consultor aberto a todos pelo chat |
| Gestão (Gestão e Atendimento) | Manutenção, Relatórios | Supervisão Administrativa e Direção | Mesmo papel. Fica de fora o RH interno, de propósito (C2-31) |
| Módulos laterais: CRM, Financeiro, Arquivos | Atendimento Vivo (a Renata), Ex-clientes, Certificados | Recepção, Comercial, Financeiro, Logística (malote), IRPF | Recepção e Comercial no CRM, Financeiro no módulo Financeiro. Malote falta (C2-09). IRPF é perfil de cliente dentro do Fiscal |

**Onde caem as 272 linhas:** DP 61, Fiscal 55 (2 de pessoa física), Atendimento (CRM) 34, Contábil 31, Notas 20, Gestão 20, Societário 19 (uma dividida com Fiscal e DP), Financeiro 11, Obrigações 8, Consultoria 4, Arquivos 2 e fora do produto 7. Nenhuma atividade do produto ficou sem lugar.

### 5.2 As perguntas, uma a uma

- **Contábil e Fiscal nas mesmas pessoas: uma aba, duas ou uma por pessoa?** **Duas abas.** As três pessoas que fazem os dois preencheram **uma ficha Contábil e outra Fiscal**: elas mesmas separam o trabalho em dois. Juntar as abas seria juntar setores, o que as Fundações (4.1, P1) já descartaram. O caso delas se resolve dando a cada conta os dois setores. Aba por pessoa também não: o recorte por pessoa já existe em "Minha fila" (D-22), no filtro "meus clientes" e na carteira de cada responsável.
- **Recepção: cabe em Gestão e Atendimento?** **Sim, na parte de atendimento**, que é o CRM, porta de entrada e triagem. O Desenho (seção 5) já diz que, num escritório com um número só, o setor Gestão e Atendimento faz o papel de recepção. Mas a ficha de lá tem também partes Fiscal, Contábil e Trabalhista: separar malote, consultar pagamentos, cobrar e digitalizar. Dar à recepção os setores inteiros é demais. A recomendação é um **perfil de apoio** (C2-26): ela vê e conclui as tarefas atribuídas a ela nesses setores, sem ver o setor todo. O malote e o papel faltam (C2-09).
- **Supervisão Administrativa: cabe em Gestão?** **Sim, e ela é um papel, não uma aba.** É o **Gestor** dos setores Fiscal, Contábil e DP: confere o que as colegas apuram (cartão de aprovação), distribui tarefas, acompanha atrasos e a qualidade do atendimento (aba Gestão). Também cuida do cadastro e da transição de clientes (Societário), dos boletos e comandas do escritório (Financeiro) e de um RH interno que fica fora do produto: ponto, recrutamento e conflitos.
- **Direção:** é o **Administrador**. O comercial dela fica no CRM (Leads), o financeiro no módulo Financeiro, o cadastro no Societário e o IRPF no perfil pessoa física do Fiscal. Marketing, TI e prédio ficam fora.
- **Trabalhista = DP?** **Sim.** O título da aba já é "Trabalhista e DP". As fichas de lá separam **Admissão e manutenção** de **Demissão**. Como o 03 (10.2) já aponta o DP como candidato a sub-abas (mais de 60 atividades), a recomendação é ter duas visões internas: **Admissão e rotina** e **Rescisão**.
- **Onde ficam Obrigações e Notas?** **Obrigações** continua aba transversal: os dois escritórios precisam do calendário, e nenhum tem equipe só para ele. **Notas** continua aba com integrante próprio, mas ninguém, nos dois escritórios, é "do setor Notas". Proposta: quem recebe o setor Fiscal recebe Notas junto, por padrão, e o escritório separa se quiser.
- **Falta ou sobra alguma aba?** **Não.** O que parecia faltar já tem lugar:
  - Certificados (aba própria no Leandro) é bloco e visão de carteira do Societário.
  - Ex-clientes é filtro do ciclo de vida.
  - IRPF é perfil de cliente.
  - Recepção e Comercial são o CRM.
  - Financeiro é módulo.

  O que parecia sobrar (Consultoria, Notas, Obrigações) tem conteúdo próprio, mas não tem equipe própria.

### 5.3 Recomendação

**Manter as oito abas e os integrantes, com cinco ajustes de nome e vínculo, sem refazer o produto:**

| # | Ajuste | O que muda | Onde (o coordenador aplica) | Decisão do Enzo |
| --- | --- | --- | --- | --- |
| E-01 | Societário vira **Legalização** na exibição padrão | Título "Clientes e Legalização", nome curto "Legalização", integrante "Legalização"; o código `societario` fica | 03, 2.3 e 6.1; 02, 3.2; Fundações 4.1 (nome de exibição padrão); protótipo (rótulos do Painel) | ☐ Sim ☐ Não ☐ Depois |
| E-02 | Contábil e Fiscal continuam **duas abas**; sem aba por pessoa | Nada no produto; vira regra escrita na implantação ("mesma pessoa, dois setores") | 03, 10.2; trilha de implantação (03, 8.2) | ☐ Sim ☐ Não ☐ Depois |
| E-03 | **Notas vem com o Fiscal** por padrão | Dar o setor Fiscal a uma conta já dá Notas; o escritório pode separar | Fundações 4.1 (vínculo usuário × setor); 03, 2.3 | ☐ Sim ☐ Não ☐ Depois |
| E-04 | **DP com duas visões internas**: Admissão e rotina; Rescisão | Visões (filtros com blocos), não setores novos | 03, 6.5 e 10.2 | ☐ Sim ☐ Não ☐ Depois |
| E-05 | **Papéis no lugar de abas** para Recepção, Supervisão e Direção | Recepção = Gestão e Atendimento + perfil de apoio (C2-26); Supervisão = Gestor; Direção = Administrador. Vira exemplo na implantação | 03, 9; Fundações 3 (papéis e exceções); trilha de implantação | ☐ Sim ☐ Não ☐ Depois |

**Próximo passo sugerido:** a validação do 03, seção 10 (cartões, "ache onde fazer X") com **os dois** escritórios, já usando os nomes novos. É o teste que confirma ou derruba E-01 e E-03.

---

## 6. Lista de decisão: o que este escritório faz e o nosso plano não tem

Só entra o que lá existe e aqui falta ou existe em parte. O que já está planejado por inteiro ficou de fora, como a confirmação de recebimento (D-17), a situação fiscal em lote (FIS-006) e o "gerente eletrônico" (DP-007, DP-023).

**Princípio (o mesmo do Leandro):** tudo entra **agentificado**, não como cópia crua.
- **Quem faz:** um integrante do time acorda com um gatilho.
- **O que faz:** faz sozinho o que é reversível, **prepara para aprovar** (cartão sim / editar / não) o que transmite, paga, assina ou sai para o cliente, e **organiza e lembra** quando o ato é humano.
- **Aprendizado:** cada decisão da equipe vira memória.
- **Saída ao cliente:** nada sai sem aprovação humana no início.

**Resumo.**
- **34 itens:** 16 ENTRA agora, 4 ENTRA depois, 7 só a ideia, 7 NÃO ENTRA.
- **Esforço:** pequeno (dias), médio (semanas), grande (um mês ou mais), contando com as Fundações prontas.
- **"ENTRA agora"** = primeiro corte (fases 1 e 2); **"ENTRA depois"** = fase 3 em diante.

**Os 5 mais valiosos:**
- **C2-01 Kit de rescisão** e **C2-02 Simulados de rescisão:** o kit é pedido pelas três pessoas do Trabalhista, e os simulados por duas delas e pela Supervisão. É a maior lacuna do nosso DP.
- **C2-07 Nome de quem atende** (com **C2-08 E-mail enviado registrado sozinho**): quatro pessoas pedem o nome automático no WhatsApp (uma copia e cola a assinatura em toda conversa), e três salvam e-mails à mão.
- **C2-03 Boletos de sindicato, convênio e seguro de vida:** a folha fica aberta esperando o dia 25, e o boleto é esquecido.
- **C2-14 Declaração de faturamento assinada:** pedida em três fichas e ausente do mapa de 589 atividades.

### A. Departamento Pessoal

| # | Função | O que fazem lá (quem) | O que já temos | Recomendação e motivo | Esforço | Decisão do Enzo |
| --- | --- | --- | --- | --- | --- | --- |
| C2-01 | **Kit de rescisão** | Extrato do FGTS, extrato para fins rescisórios (pede num dia, chega no outro), guia rescisória, seguro-desemprego com conferência de nome, mãe, nascimento e sexo (Trabalhista A, B, C) | DP-029 (GFD rescisória), DP-031 (seguro-desemprego), DP-004 (conferência só na admissão) | **ENTRA agora** (com o DP, fase 2): é o pedido mais repetido do setor e cabe no fluxo de rescisão já desenhado | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-02 | **Simulados de rescisão** | Controlam os simulados pedidos e a data de pagamento; passam o simulado do Domínio para um modelo legível; cobram todo dia a resposta do cliente (Trabalhista A, C; Supervisão) | Nada (DP-027 só conta o prazo depois da rescisão; DP-059 é custo, fase 4) | **ENTRA agora:** o cliente não entende o simulado do Domínio, e a cobrança diária é trabalho puro de régua | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-03 | **Boletos de sindicato, convênio e seguro de vida** | Emitem nos portais (instáveis); alguns só saem depois do dia 25; esquecem; salvam na pasta (Trabalhista A, B, C) | DP-020 põe a guia sindical no pacote; DP-036 (contribuição assistencial, fase 4); DP-052 (plano de saúde) | **ENTRA agora** a lista esperada, o lembrete e a anexação; **robô de portal depois**, só onde o portal for estável | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-04 | **Resumo da convenção coletiva** | Leem a convenção nova e preenchem um resumo interno com os pontos do dia a dia (Trabalhista A, B, C; Supervisão) | DP-201 (fase 4); DP-033, DP-034 (fase 1) | **ENTRA agora:** subir o DP-201 da fase 4 para a 2, junto com o DP-034. Quatro pessoas fazem isso à mão | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-05 | **Recálculo de guias de FGTS e de sindicato** | Recalculam DARF, FGTS e sindicato (Trabalhista B) | FIS-201 cobre DAS, DARF e parcelamento | **ENTRA depois:** menos frequente; o DARF já está coberto | Pequeno a médio | ☐ Sim ☐ Não ☐ Depois |
| C2-06 | **Termo de ciência com assinatura e acompanhamento** | Fazem o termo, mandam pelo ZapSign e acompanham até assinar (Trabalhista A) | Assinatura eletrônica só para contrato (SOC-016); prova de "pode fazer" por mensagem (GES-036) | **ENTRA agora:** é modelo de documento + assinatura + régua, peças que já existem | Pequeno | ☐ Sim ☐ Não ☐ Depois |

**Como fica agentificado**

- **C2-01**
  - **Quem:** DP.
  - **Gatilho:** rescisão registrada (DP-026), pelo app, pelo WhatsApp ou pela equipe.
  - **Faz sozinho:**
    - pede o extrato para fins rescisórios na data marcada;
    - no dia seguinte, baixa e guarda o extrato, o extrato do FGTS e a guia rescisória na pasta do empregado;
    - lista as competências em aberto;
    - confere nome, nome da mãe, nascimento e sexo do cadastro contra o CPF.
  - **Prepara:** o requerimento do seguro-desemprego para a pessoa transmitir (exige certificado; a situação do Empregador Web em 2026 está "não verificada" no D4) e o pacote ao cliente (só com aprovação).
  - **Lembra:** o prazo de 10 dias (DP-027).
  - **Explica:** "Rescisão de Fulano: extrato do FGTS ok; extrato rescisório pedido ontem, chegou hoje; 2 competências em aberto (03 e 04/2026); nome da mãe diverge da Receita".
- **C2-02**
  - **Quem:** DP.
  - **Gatilho:** pedido de simulado (app ou conversa) ou PDF do simulado do Domínio na pasta.
  - **Faz sozinho:** lê o PDF e monta o modelo do escritório, em linguagem do cliente.
  - **Prepara:** o envio ao cliente (cartão).
  - **Lembra:** cobra a resposta ("vai seguir?") em D+1 e D+3, pela régua.
  - **Ao virar rescisão:** abre o C2-01 e começa a contar o prazo.
  - **Aprende:** o modelo de cada escritório.
  - **Explica:** "3 simulados sem resposta; o de Empresa X vence o aviso na sexta".
- **C2-03**
  - **Quem:** DP.
  - **Gatilho:** fechamento da folha e, do dia 25 em diante, todo dia até sair o boleto.
  - **Organiza e lembra:** monta a lista de boletos esperados por cliente, a partir do sindicato (DP-033) e dos benefícios (DP-052), e mostra o que falta.
  - **Faz sozinho:** quando o boleto chega por e-mail ou é baixado, liga ao cliente, guarda e junta ao pacote da folha (DP-020); depois confere se foi pago (como o DP-021).
  - **Prepara:** o envio do pacote completo.
  - **Explica:** "Folha de outubro de 12 clientes pronta; 4 esperam o boleto do seguro de vida (sai dia 25)".
- **C2-04**
  - **Quem:** DP, com o Consultor.
  - **Gatilho:** convenção nova registrada (DP-034).
  - **Prepara:** resumo com piso, reajuste, data-base, contribuições, feriados e horas extras, cada ponto com a cláusula citada; a pessoa aprova.
  - **Faz sozinho, depois de aprovado:** vira parâmetro e tarefa (DP-201).
  - **Fonte:** o Mediador do Ministério do Trabalho onde houver; o resto, enviado pelo cliente ou pelo sindicato (o Trabalhista B diz que o site não tem todos).
- **C2-05** (depois)
  - **Quem:** DP.
  - **Gatilho:** guia vencida.
  - **Prepara:** o recálculo do FGTS (GFD em atraso) e o pedido do boleto atualizado ao sindicato.
- **C2-06**
  - **Quem:** o integrante do setor que gera o termo (normalmente o DP).
  - **Gatilho:** situação de risco registrada (ex.: cliente decide contra a orientação).
  - **Prepara:** o termo pelo modelo e o envio para assinatura (cartão).
  - **Lembra:** cobra até a assinatura.
  - **Faz sozinho:** guarda o termo assinado como prova ligada ao caso (GES-036).

### B. Atendimento e comunicação

| # | Função | O que fazem lá (quem) | O que já temos | Recomendação e motivo | Esforço | Decisão do Enzo |
| --- | --- | --- | --- | --- | --- | --- |
| C2-07 | **Nome de quem atende nas mensagens** | Copiam e colam a assinatura em toda conversa de WhatsApp (Contábil/Fiscal B, Trabalhista A, C, Supervisão) | Nome exibido do número, do tema (04, H4); número por setor (Desenho, 5) | **ENTRA agora:** com número compartilhado por setor, o cliente precisa saber quem fala | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-08 | **E-mail enviado vira registro sozinho** | Salvam à mão, na pasta do cliente, cada e-mail enviado; esquecem e voltam depois (Trabalhista A, B, C) | O que sai pela plataforma já fica registrado (D-17); conector de e-mail por setor (08, C9) | **ENTRA agora:** ler também a pasta "enviados" da caixa do setor e arquivar pelo destinatário | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-09 | **Malote e documentos em papel** | Lista de malotes atualizada à mão, malote montado, notas separadas e devolvidas com protocolo, folha entregue por motoboy (Recepção, Direção) | Nada (só a devolução no desligamento, SOC-024) | **ENTRA agora, no mínimo:** malote como canal de entrega na ficha, lista do dia gerada sozinha e protocolo digital. O resto vira campanha para levar o cliente ao app | Pequeno a médio | ☐ Sim ☐ Não ☐ Depois |
| C2-10 | **Biblioteca de passo a passo para o cliente** | Fazem tutoriais (emitir nota no portal nacional etc.) (Contábil/Fiscal C, Supervisão, Direção) | GES-020 (procedimento interno); biblioteca de modelos (SOC-101) | **Só a ideia:** o passo a passo vira modelo de documento, publicado no app e usado pelo integrante nas respostas | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-11 | **Menu (URA) do telefone fixo** | O menu só lista setores, sem orientar (Recepção) | Encaminhamento por setor no WhatsApp (GES-024) | **NÃO ENTRA:** a URA é do fornecedor de telefonia. Só a ideia: alinhar o texto do menu aos setores do sistema | — | ☐ Sim ☐ Não ☐ Depois |
| C2-12 | **Servidor de e-mail** | O Outlook falha no envio e no recebimento (Contábil/Fiscal A, B, C, Supervisão) | Conector de e-mail (08) | **NÃO ENTRA:** é infraestrutura do escritório. Na implantação, recomendar uma caixa de e-mail estável que o conector leia | — | ☐ Sim ☐ Não ☐ Depois |
| C2-13 | **Aniversariantes e cartão de Natal** | Conferem a agenda de aniversários; fazem cartão de Natal (Supervisão) | Comunicados (GES-030); nascimento dos sócios na ficha (SOC-004) | **Só a ideia:** aviso de aniversário e comunicado sazonal por modelo, com consentimento (LGPD) | Pequeno | ☐ Sim ☐ Não ☐ Depois |

**Como fica agentificado**

- **C2-07**
  - **Quem:** Gestão e Atendimento.
  - **Gatilho:** mensagem enviada por uma pessoa.
  - **Faz sozinho:** põe o nome e o setor no início da mensagem (ex.: "*Fulana · DP*"), no formato definido no tema, que pode ser desligado.
  - **Mensagem do integrante:** leva a marca de assistente do escritório, para o cliente nunca achar que falou com uma pessoa quando falou com a IA.
  - **Explica:** nada; é regra fixa.
- **C2-08**
  - **Quem:** Gestão e Atendimento.
  - **Gatilho:** e-mail novo na pasta de enviados da caixa do setor.
  - **Faz sozinho:** reconhece o cliente pelo destinatário ou pelo CNPJ no texto e guarda na pasta e na linha do tempo do cliente.
  - **Prepara:** só a dúvida ("este e-mail é de qual cliente?").
  - **Aprende:** "contato X = cliente Y".
- **C2-09**
  - **Quem:** Gestão e Atendimento.
  - **Gatilho:** dia de malote.
  - **Faz sozinho:** gera a lista dos clientes ativos com entrega "malote" (baixados e que saíram já ficam de fora).
  - **Prepara:** o protocolo de entrega para assinar na tela.
  - **Organiza:** o documento digitalizado entra com a origem "malote" e vai ao setor certo.
  - **Lembra:** propõe, a cada trimestre, a mudança para o app aos clientes de malote, com o custo do motoboy em mente.
- **C2-10:** o Gestão e Atendimento responde "como emito nota?" com o passo a passo do escritório; sem tela nova.
- **C2-13:** o Gestão e Atendimento prepara o comunicado sazonal e o aviso de aniversário, que saem só com aprovação.

### C. Fiscal e contábil

| # | Função | O que fazem lá (quem) | O que já temos | Recomendação e motivo | Esforço | Decisão do Enzo |
| --- | --- | --- | --- | --- | --- | --- |
| C2-14 | **Declaração de faturamento assinada pelo contador** | Fazem a declaração e o termo de faturamento, conferem e assinam; compartilham dados de faturamento (Pronampe) (Contábil/Fiscal C, Supervisão) | Nada (o DECORE, CTB-032, é de rendimento de pessoa física) | **ENTRA agora:** pedido comum (banco, crédito, licitação) e simples com o fluxo de assinatura do contador (D-16) | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-15 | **Pesquisas do IBGE (PAC e PAS)** | Entregam pelos aplicativos do IBGE quando a empresa é chamada (Contábil/Fiscal A, B) | Nada | **ENTRA agora** como obrigação eventual por cliente, que só nasce quando a empresa é chamada (como as guias eventuais, D-23) | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-16 | **DMED no calendário** | Entregam a DMED (Supervisão) | Nada | **ENTRA agora:** uma linha a mais nas regras de obrigação, pelo CNAE de saúde | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-17 | **Código de acesso do Simples na abertura** | Geram o código na abertura ou alteração (Supervisão) | Perto de FIS-107 | **Só a ideia:** item do checklist da abertura e da habilitação do cliente | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-18 | **Simulação de parcelamento** | Simulam antes de pedir (Contábil/Fiscal C) | FIS-035 (fase 4); FIS-034 controla | **ENTRA depois:** mantém a fase 4 | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-19 | **Notas interestaduais em papel** | Carimbam, preenchem e protocolam notas de compra de outros estados (Contábil/Fiscal C) | NFE-026 calcula o DIFAL e a antecipação | **NÃO ENTRA:** é ato físico; o NFE-026 já entrega a lista das notas | — | ☐ Sim ☐ Não ☐ Depois |

**Como fica agentificado**

- **C2-14**
  - **Quem:** Contábil, com a receita vinda do Fiscal.
  - **Gatilho:** pedido do cliente pelo app (pedido padronizado, GES-040) ou pela conversa.
  - **Faz sozinho:** soma a receita dos últimos 12 meses pelas notas capturadas e pelo PGDAS-D ou pela escrita, e confere as duas fontes.
  - **Prepara:** a declaração no modelo do escritório para a assinatura do contador (D-16).
  - **Envio:** só depois de assinada e aprovada.
  - **Explica:** "Receita de 11/2025 a 10/2026: R$ 1,92 mi (notas) × R$ 1,92 mi (PGDAS-D); pronta para assinar".
- **C2-15**
  - **Quem:** Contábil.
  - **Gatilho:** o cliente avisa ou chega a carta do IBGE.
  - **Organiza e lembra:** cria a obrigação com o prazo da carta e um checklist com o que vem do balanço e da DRE.
  - **Prepara:** os números para a pessoa preencher no aplicativo.
- **C2-16**
  - **Quem:** Fiscal.
  - **Gatilho:** geração do calendário (FIS-001).
  - **Faz sozinho:** cria a obrigação para quem tem CNAE de saúde.
  - **Prepara:** a declaração para a pessoa conferir.

### D. Legalização e certificado (ligado à pergunta 3)

| # | Função | O que fazem lá (quem) | O que já temos | Recomendação e motivo | Esforço | Decisão do Enzo |
| --- | --- | --- | --- | --- | --- | --- |
| C2-20 | **Renovação do registro e do certificado nos conselhos** | Renovam certificados nos conselhos regionais (Legal A) | SOC-040 (registro e anuidade) | **ENTRA agora:** a validade entra na lista de licenças e no calendário do setor (SOC-046) | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-21 | **Fiscalização de licença como processo** | Atendem e regularizam fiscalizações (Legal A) | Tributária FIS-038; trabalhista DP-041 | **ENTRA agora:** a de prefeitura, vigilância, bombeiros e conselho vira tipo de processo do Societário, reaproveitando o fluxo do FIS-038 | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-22 | **Taxa anual de licença municipal** | Mandam a taxa de todas as prefeituras para o cliente não deixar de receber (Supervisão) | SOC-036 fala em pagar taxas | **ENTRA agora:** obrigação anual do Societário, com a guia na central de guias (FIS-031) | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-23 | **Certificação digital como serviço** | Separam documentos, compram, vendem, emitem e mandam ao cliente (Legal A) | Controle de vencimento SOC-009 (fase 0 a 2); SOC-201 e GES-205 (fase 5) | **ENTRA depois:** antecipar da fase 5 para a 3, junto do Financeiro. Depende de parceria com uma autoridade certificadora | Médio a grande | ☐ Sim ☐ Não ☐ Depois |
| C2-24 | **Termo de reativação de serviços** | Mandam termo quando o ex-cliente volta (Direção, Supervisão) | Termo de cessação (SOC-106); reentrada parcial (CIC-010) | **Só a ideia:** o ex-cliente que volta reabre a ficha com o histórico, ganha o termo pelo modelo e uma trilha curta | Pequeno | ☐ Sim ☐ Não ☐ Depois |

**Como fica agentificado**

- **C2-20**
  - **Quem:** Legalização (hoje Societário).
  - **Gatilho:** registro ou certificado do conselho a 60 e a 30 dias do vencimento.
  - **Organiza e lembra:** tarefa com o que o conselho pede e cobrança dos documentos ao cliente.
  - **Prepara:** a guia da anuidade para envio.
- **C2-21**
  - **Quem:** Legalização.
  - **Gatilho:** auto, notificação ou visita registrada (a equipe registra ou o integrante lê do e-mail).
  - **Faz sozinho:** abre o processo com o prazo e a lista do que o órgão pediu.
  - **Prepara:** a resposta e o pedido de documentos ao cliente.
  - **Lembra:** até o prazo.
  - **Fiscalização tributária ou trabalhista:** passa ao Fiscal ou ao DP com o histórico.
- **C2-22**
  - **Quem:** Legalização.
  - **Gatilho:** mês de lançamento da taxa em cada município.
  - **Organiza:** lista quem tem a taxa e se a guia já chegou.
  - **Faz sozinho:** ao receber a guia, liga ao cliente e põe na central de guias.
  - **Prepara:** o envio.
- **C2-23** (depois)
  - **Quem:** Legalização, com o Financeiro do escritório.
  - **Gatilho:** certificado a 30 dias do vencimento, abertura de empresa ou troca de responsável.
  - **Prepara:** a oferta ao cliente, a lista de documentos e o agendamento da validação com a autoridade certificadora parceira.
  - **Faz sozinho:** lança a venda como serviço a faturar.
  - **Lembra:** até o certificado novo entrar no cofre.

### E. Gestão do escritório

| # | Função | O que fazem lá (quem) | O que já temos | Recomendação e motivo | Esforço | Decisão do Enzo |
| --- | --- | --- | --- | --- | --- | --- |
| C2-25 | **Comanda digital de serviço extra** | Fazem comandas em papel para o financeiro cobrar o extra (Trabalhista A, B, C; Supervisão) | SOC-017 e GES-002 (fase 3) | **ENTRA agora a marcação** (o extra fica registrado na tarefa, no momento em que é feito); o faturamento continua na fase 3 | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-26 | **Perfil de apoio (recepção)** | A recepção separa, consulta, cobra e digitaliza para o Fiscal, o Contábil e o Trabalhista (Recepção) | Papéis, setores e exceções por aba (Fundações 3) | **ENTRA agora:** a recepção vê e conclui só as tarefas atribuídas a ela nos outros setores. Falta confirmar na função de permissão (Fundações 3.4) que a exceção pode ser "só tarefas atribuídas" | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-27 | **Registro de ocorrências críticas** | A Direção dá suporte em situações críticas e quer o histórico | GES-019 (fase 3) | **Só a ideia agora:** a etiqueta "ocorrência crítica" na tarefa e uma lista na Gestão; o GES-019 completo na fase 3 | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-28 | **Pauta da reunião semanal** | Reunião semanal com a equipe (Supervisão) | Produtividade e atrasos na Gestão (GES-016) | **Só a ideia:** o Geral monta a pauta da semana com atrasos, riscos e pendências | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-29 | **Lembrete interno que só some com confirmação** | Despertador para trocar o backup toda semana e todo mês (Trabalhista C) | Tarefa recorrente com conclusão por evidência (03, 7.6) | **Só a ideia:** tarefa interna do escritório (o escritório como cliente, GES-061), que só fecha com "feito" | Pequeno | ☐ Sim ☐ Não ☐ Depois |
| C2-30 | **Trilha de integração da equipe (15 a 90 dias)** | Plano do que aprender em 15, 30, 45, 60, 75 e 90 dias (Direção); treinamento de novas colegas (Supervisão) | GES-022 (fase 3) | **ENTRA depois:** no GES-022, com marcos de 90 dias | Médio | ☐ Sim ☐ Não ☐ Depois |
| C2-31 | **RH interno** | Ponto da equipe, desempenho, bônus, recrutamento, conflitos, pagamentos por fora (Supervisão, Direção) | GES-061 (folha do escritório como cliente); FIN-008 (bônus por meta, fase 3) | **NÃO ENTRA** como módulo de RH. O ponto e a folha do escritório passam pelo próprio DP. Pagamento por fora da folha tem risco trabalhista e fiscal, e a plataforma não deve apoiar | — | ☐ Sim ☐ Não ☐ Depois |
| C2-32 | **Compras, estoque e prédio** | Lista de compras, cotações, manutenção do prédio (Recepção, Direção) | Nada | **NÃO ENTRA:** fora do produto | — | ☐ Sim ☐ Não ☐ Depois |
| C2-33 | **Marketing em redes sociais** | Vídeos e canais (Direção) | Nada | **NÃO ENTRA:** fora do produto (o tutorial para cliente está no C2-10) | — | ☐ Sim ☐ Não ☐ Depois |
| C2-34 | **TI e backup do escritório** | TI terceirizada, troca de backup, cabos, perfis (Direção, Trabalhista C) | Liberação e revogação de acessos (GES-021) | **NÃO ENTRA:** infraestrutura. O que estiver na plataforma fica em nuvem, com cópia | — | ☐ Sim ☐ Não ☐ Depois |

**Como fica agentificado**

- **C2-25**
  - **Quem:** o integrante do setor da tarefa.
  - **Gatilho:** tarefa concluída de um tipo fora do contrato (alteração contratual, certidão avulsa, NFS-e para o cliente, recálculo, simulado).
  - **Prepara:** o cartão "isto é extra? valor da tabela R$ X" para a pessoa confirmar.
  - **Faz sozinho:** guarda o extra com a evidência e as horas (05).
  - **Na fase 3:** o Financeiro do escritório fatura o extra.
  - **Explica:** "Outubro: 9 extras confirmados, R$ 1.350, nenhum faturado ainda".
- **C2-26**
  - **Quem:** Geral, para o Administrador.
  - **Gatilho:** conta nova com o papel de recepção na implantação.
  - **Prepara:** a proposta de exceções (vê e conclui tarefas atribuídas em Fiscal, Contábil e DP).
  - **Lembra:** revisar a cada 90 dias.
- **C2-30** (depois)
  - **Quem:** Gestão e Atendimento.
  - **Gatilho:** colaborador novo.
  - **Faz sozinho:** cria a trilha por setor com marcos em 15 a 90 dias.
  - **Lembra:** o Gestor, em cada marco.

### Onde cada item entra no plano

Para o coordenador escrever os adendos. Os itens marcados "Não" ficam de fora.

| Item | Subplano e seção que recebe o adendo | Integrante |
| --- | --- | --- |
| C2-01 Kit de rescisão | 03, 6.5 (Rescisão); 02, 3.2 (DP); 08 (FGTS Digital e Empregador Web, robô com certificado) | DP |
| C2-02 Simulados de rescisão | 03, 6.5 (bloco "Simulados"); 06 (pedido de simulado no app); 04 (régua) | DP |
| C2-03 Boletos de sindicato, convênio e seguro | 03, 6.5 (Guias, holerites, pagamento); 02, 3.2 (gatilho do dia 25); 08 (robô de portal, depois) | DP |
| C2-04 Resumo da convenção | 03, 6.5 (Convenções); `atividades.json` DP-201 da fase 4 para a 2; 07 (motores) | DP e Consultor |
| C2-05 Recálculo de FGTS e sindicato | 03, 6.5; FIS-201 ampliado | DP |
| C2-06 Termo de ciência | 01 (ferramentas de documento e assinatura); 03, 7.4; 04 (régua) | Do setor (DP) |
| C2-07 Nome de quem atende | 04 (Conversas; tema H4); 01 (mensagem) | Gestão e Atendimento |
| C2-08 E-mail enviado registrado | 08 (conector de e-mail, pasta de enviados); 04; 01, 7 (pasta do cliente) | Gestão e Atendimento |
| C2-09 Malote e papel | 04 (canais e comunicados); 03, 6.1 (preferência de entrega na ficha); Arquivos (origem "malote") | Gestão e Atendimento |
| C2-10 Passo a passo para cliente | SOC-101 (biblioteca de modelos); 06 (publicação no app) | Gestão e Atendimento |
| C2-13 Aniversários e Natal | 04 (comunicados por modelo) | Gestão e Atendimento |
| C2-14 Declaração de faturamento | 03, 6.6 (Relatórios ao cliente, junto do DECORE); 06 (pedido padronizado); D-16 (assinatura) | Contábil |
| C2-15 IBGE (PAC e PAS) | 07 (regras de obrigação, eventual); 03, 6.2 | Contábil |
| C2-16 DMED | 07 (regras de obrigação por CNAE); 03, 6.2 | Fiscal |
| C2-17 Código de acesso do Simples | Checklist de abertura (SOC-027) e FIS-107 | Legalização e Fiscal |
| C2-18 Simulação de parcelamento | Sem mudança (FIS-035, fase 4) | Fiscal |
| C2-20 Renovação nos conselhos | 03, 6.1 (Legalização e processos); SOC-046 | Legalização |
| C2-21 Fiscalização de licença | 03, 6.1; 02, 3.2 (gatilho) | Legalização |
| C2-22 Taxa anual de licença | 03, 6.1 e 6.4 (central de guias); 07 (regra anual por município) | Legalização |
| C2-23 Certificado como serviço | SOC-201 e GES-205 da fase 5 para a 3; 03, 6.1 (Certificados); 09 (faturamento) | Legalização e Financeiro do escritório |
| C2-24 Reativação | 03, 8 (trilhas); CIC-001 | Legalização |
| C2-25 Comanda digital | 03, 7.2 (detalhe da tarefa: marcar extra); 05 (horas do extra); 09 (fatura, fase 3) | Do setor |
| C2-26 Perfil de apoio | Fundações 3.4 e 3.5 (exceção); 03, 9.3 | Geral |
| C2-27 Ocorrências críticas | 03, 6.9 (Gestão); GES-019 (fase 3) | Gestão e Atendimento |
| C2-28 Pauta semanal | 02, 9 (Geral); 03, 6.9 | Geral |
| C2-29 Lembrete interno | 03, 7.6; GES-061 | Geral |
| C2-30 Trilha de integração | GES-022 (fase 3) | Gestão e Atendimento |

---

## 7. As dores mais repetidas (top 10)

Contagem por **pessoa** que cita a dor (ou faz a tarefa descrevendo o incômodo), entre as 10 fichas.

| # | Dor | Pessoas | Quem | O que o sistema resolve |
| --- | --- | --- | --- | --- |
| 1 | **Cobrar o mesmo documento várias vezes** (despesas, movimento, notas tomadas, aluguel, documentos de admissão) | 6 | Recepção; Contábil/Fiscal A, C; Trabalhista A, B, C | A régua cobra sozinha e para quando o documento chega (CTB-003, NFE-038, DP-002). As contas e documentos esperados por cliente (CTB-001, D-03) dizem o que falta, e o cliente manda pelo app |
| 2 | **WhatsApp sem identificação, sem triagem e interrompendo o trabalho** | 6 | Recepção; Contábil/Fiscal B; Trabalhista A, B, C; Supervisão | Número oficial por setor (04), nome automático de quem atende (C2-07), resposta do factual pelo integrante (GES-025: "quando vence a experiência de X?") e "virar tarefa" com prioridade (GES-024) |
| 3 | **Planilhas e fichas de controle paralelas** (impostos, lucros, Reinf, parcelamentos, financeiro) | 6 | Recepção; Contábil/Fiscal A, B, C; Supervisão; Direção | Calendário e central de guias (FIS-001, FIS-031, FIS-047), controle de lucros e trava do REINF (D-12, D-15), parcelamentos (FIS-034), financeiro (FIN-001) |
| 4 | **Salvar à mão** e-mails enviados, documentos de admissão e arquivos do cliente | 5 | Recepção; Contábil/Fiscal C; Trabalhista A, B, C | Tudo que chega ou sai pela plataforma já fica na pasta e na linha do tempo (GES-026, D-17); e-mail enviado por fora entra pelo conector (C2-08) |
| 5 | **Confirmar à mão que o cliente recebeu** (guias, ISS, ICMS, folha) | 4 | Contábil/Fiscal C; Trabalhista A, B, C | Farol de entrega: enviado, aberto, falhou, confirmado (D-17); guia com "enviada, lida, paga" (FIS-031). A equipe só cobra quem não abriu |
| 6 | **Outlook instável** | 4 | Contábil/Fiscal A, B, C; Supervisão | Menos dependência do e-mail (app e WhatsApp oficial). O servidor em si é infraestrutura (C2-12) |
| 7 | **Convenção coletiva:** consulta paga no Domínio, site do governo incompleto, leitura longa | 4 | Trabalhista A, B, C; Supervisão | Vigilância de convenções (DP-034) e resumo com cláusulas citadas (C2-04) |
| 8 | **Rescisão:** extratos que chegam no dia seguinte, seguro-desemprego com muitos passos, dados errados vindos da admissão, simulados sem resposta | 4 | Trabalhista A, B, C; Supervisão | Kit de rescisão (C2-01) e simulados com régua (C2-02) |
| 9 | **Comandas em papel** para o financeiro cobrar o extra | 4 | Trabalhista A, B, C; Supervisão | Marcação do extra na tarefa (C2-25) e fatura na fase 3 (GES-002) |
| 10 | **Portais instáveis, empresa por empresa** (situação fiscal, parcelamento, FGTS Digital, consignado, pagamentos) | 3 | Recepção; Trabalhista A, B | Situação fiscal em lote (FIS-006), conferência de pagamento (FIS-032, DP-021), parcelamentos (FIS-034), consignado (DP-013) |

**Empatadas com 3 pessoas, logo abaixo:**
- módulos do Domínio pagos à parte (Trabalhista A, B, C): ver a seção 3;
- boletos de sindicato no dia 25 (Trabalhista A, B, C): C2-03;
- papel e malote (Recepção, Direção, Contábil/Fiscal C): C2-09.

---

## 8. Perguntas ao escritório

1. **"Ajustes nas notas de compra das locadoras"** (Contábil/Fiscal C, item 40): o que é ajustado e por quê? *Hipótese:* troca de CFOP ou acumulador para clientes do ramo de locação, o que cairia no de-para por fornecedor (NFE-034).
2. **"DUC"** (Recepção e Contábil/Fiscal A) e **"CONFIR"** (Direção, IRPF): que portal e que ferramenta são? *Hipótese:* um portal de consulta de débitos e um conferidor de declarações. Não deduzimos.
3. **Comandas:** cada serviço extra tem preço de tabela? *Hipótese:* sim, para os mais comuns. Isso permitiria o C2-25 sugerir o valor.
4. **Malote:** quantos clientes ainda recebem por malote e quantos aceitariam o app? Isso dimensiona o C2-09.
5. **IRPF:** é tocado como linha de negócio separada? Se for, convém uma visão de carteira "campanha de IRPF" dentro do Fiscal (PF-003), sem aba nova.
6. **Recepção:** ela precisa ver o setor inteiro em algum caso, ou só as tarefas que recebe? A resposta confirma o C2-26.
