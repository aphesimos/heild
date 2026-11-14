# Sessões do wireframe

**Versão 1 · 14/11/2026.** Como dividir o trabalho do `MAPA_DE_TELAS.md` em onze sessões que rodam em paralelo, cada uma no seu branch, sem pisar no código das outras. O mapa diz **o que** cada tela tem; este arquivo diz **onde** cada sessão mexe.

## 1. Regras para todas as sessões

- **Base e branch.** Cada sessão parte do branch `wireframe` e trabalha no seu: `wf-s01-inicio`, `wf-s02-painel-a`, `wf-s03-painel-b`, `wf-s04-painel-c`, `wf-s05-crm-interna`, `wf-s06-timesheet`, `wf-s07-financeiro`, `wf-s08-bpo`, `wf-s09-arquivos-config`, `wf-s10-app-cliente`, `wf-s11-juridico`. A coordenação integra no `wireframe`.
- **Antes de começar:** ler `CLAUDE.md`, `app/README.md`, a seção da sessão no `MAPA_DE_TELAS.md` (com as seções 0 e 1 do mapa) e a seção da sessão aqui.
- **Commits** em português, pequenos, em nome do dono e sem co-autoria nem menção a agente ou modelo: `git -c user.name=sundenlast -c user.email=126630868+sundenlast@users.noreply.github.com commit ...`.
- **Design system:** tokens do tema (`src/theme/`), camadas nomeadas, sombras nomeadas, `<heild-logo>`; nenhuma cor solta; claro e escuro com o mesmo cuidado; nada inventado (sem clientes reais, números de uso ou depoimentos). Mudança de marca não é feita aqui.
- **Antes de cada push:** `cd app && npm run typecheck` sem erro e o app abrindo (`npm run app`). Teste novo de ponta a ponta vai em arquivo novo `app/scripts/sNN-<assunto>.cjs`; não editar os scripts existentes.
- **Simulação:** IA e APIs só simuladas (mapa, seção 1.6 e 1.7). Estado novo guardado com `usePersistente` e chave com o prefixo da sessão (`s05:interna:conversas`), sem alterar o redutor da loja.
- **O que fica pronto, fica registrado:** ao terminar, a sessão escreve `docs/wireframe/entregas/SNN.md` (arquivo novo e só dela: o que fez, por código de tela e ação do mapa, e o que ficou de fora). Decisão que muda o plano ou que o plano não cobre vai para `docs/wireframe/DECISOES.md`, **na seção da própria sessão**.
- **Não editar:** `app/README.md`, `app/PLANO.md`, `app/REVISAO.md`, `docs/planos-dgm/` (leitura) e este arquivo. A coordenação atualiza o README do app na integração, a partir das entregas.

## 2. Arquivos compartilhados

Arquivos que mais de uma sessão precisa tocar. A regra é **só acrescentar**, no ponto indicado, sem reordenar nem reformatar o que já existe; mudança no que já existe só pelo dono indicado ou por pedido em `DECISOES.md`.

| Arquivo | Dono | O que as outras sessões podem fazer |
| --- | --- | --- |
| `src/telas/Plataforma.tsx` (rotas) | coordenação | Acrescentar as linhas de rota das suas telas novas, uma por tela, junto das linhas do seu módulo |
| `src/telas/modulos.ts` | coordenação | Acrescentar módulo ou aba nova no fim da lista do seu módulo (S05: `interna`; S09: `conectores` em `config`; S11: `juridico`) e o nome completo em `nomeCompleto` |
| `src/ambiente/sessao.tsx` (permissões) | coordenação | Acrescentar campos e regras novas em `permissoesDe` para as suas telas, sem mudar as existentes |
| `src/ambiente/loja.tsx` (estado, `Destino`) | coordenação | Acrescentar campo opcional em `Destino` (ex.: `processo?`, `conversaInterna?`); não mudar o redutor; estado novo por `usePersistente` |
| `src/ambiente/efeitos.tsx` (o que cada cartão faz) | coordenação | Acrescentar os efeitos dos seus cartões, com chave prefixada pela sessão |
| `src/ambiente/PainelLab.tsx` (painel Demonstração) | coordenação | Acrescentar uma seção própria com os controles da sessão (ex.: "Simular conector fora do ar") |
| `src/dados/simulacao.ts` (roteiros) | coordenação | Acrescentar entradas em `fluxos`, `pedidosAssistente`, `rotinas` e `respostasProntas`, com chave prefixada pela sessão; roteiros longos em arquivo novo `src/dados/simulacao-sNN.ts` importado por uma linha |
| `src/dados/tipos.ts` | por tipo (abaixo) | Tipo novo no fim do arquivo ou em arquivo novo `src/dados/tipos-sNN.ts`. Mudar tipo existente só o dono: `Tarefa` e `StatusTarefa` → S04; `Cliente` → S02; `Integrante`, `Mensagem`, `Cartao`, `Aviso` → S01; `Conversa` → S05 |
| `src/dados/exemplo.ts` | coordenação | Não editar; dados novos em arquivo próprio da sessão. Se precisar entrar numa lista comum (tarefas, clientes), acrescentar no fim do array com o comentário `// SNN` e registrar em `DECISOES.md` |
| `src/dados/painel.ts` | S02 (`abasPainel`); S03 (`fiscalDetalhe`, `contabilDetalhe`); S04 (`dpDetalhe`) | Cada sessão edita só o bloco dela |
| `src/dados/painel-abas.ts` | S02 (`societarioDetalhe`, `obrigacoesDetalhe`, `notasDetalhe`); S03 (`consultoriaDetalhe`); S04 (`gestaoDetalhe`) | Cada sessão edita só o bloco dela |
| `src/telas/painel/padroes.ts` (arranjo padrão dos widgets) | S02 | S03 e S04 editam só as chaves das suas abas |
| `src/ambiente/fluxos.tsx` (gavetas comuns) | S04 | S02 edita só `GavetaFichaCliente`; ninguém mais altera; novas gavetas em arquivo próprio |
| `src/components/compostos/rotulos.ts` | S04 | Outras sessões acrescentam rótulos novos no fim |
| `src/telas/financeiro/pecas.tsx` (peças com titular) | S07 | S08 consome; mudança pedida em `DECISOES.md` |
| `src/components/compostos/blocos.tsx` | S09 | S06 consome; acrescentar bloco novo no fim |
| `src/components/ui/*`, `src/components/widgets/*`, `src/theme/*`, `src/lib/*`, `src/hooks/*`, `src/index.css`, `src/App.tsx`, `src/main.tsx`, `src/assets/*`, `src/vendor/*` | coordenação | Não editar. Componente novo vai na pasta da sessão; se for genérico, registrar em `DECISOES.md` para a coordenação promover |

## 3. Contratos entre sessões

Para trabalhar em paralelo, as sessões combinam as interfaces abaixo. O dono publica primeiro um esqueleto (assinatura e conteúdo simples) num commit pequeno que a coordenação leva ao `wireframe` logo no início; as outras sessões fazem rebase depois dele.

| # | Contrato | Dono | Quem usa | Forma combinada |
| --- | --- | --- | --- | --- |
| C1 | Bloco "Obrigações do setor" | S02 | S03, S04 | `src/telas/painel/obrigacoes-setor.tsx` exporta `widgetObrigacoesDoSetor(setor: SetorIntegrante, ctx: CtxAba): DefWidget`; "ver todas" navega com `Destino { modulo: 'painel', aba: 'obrigacoes', filtroSetor }` |
| C2 | Setor dono da obrigação | S02 | S01 (calendário), S03, S04 | Campo `setor` em cada item de obrigação; filtro por setores guardado em `usePersistente('s02:obrigacoes:setores')` |
| C3 | Estados novos da tarefa | S04 | todas | `StatusTarefa` passa a ter `aguardando_terceiro`, `em_revisao`, `cancelada`; telas tratam os novos rótulos por `rotuloStatus` |
| C4 | Abrir e criar tarefa | S04 | S01, S02, S03, S05, S10 | `useFluxos().abrirTarefa(id)` (já existe) e `useFluxos().novaTarefa({ cliente?, setor })` (já existe), estendida com campos opcionais `atividade?`, `origem?`, `origemRef?`, `titulo?`, usada por "virar tarefa" no CRM e na comunicação interna |
| C5 | Calendário | S04 | S01 (widget da Visão geral), S11 | `src/components/compostos/calendario.tsx` exporta `Calendario({ tarefas, visao, onReprogramar, filtros })` |
| C6 | Faixa de ciclo de vida e trilha | S04 | S02 (cabeçalho da aba) | `FaixaCicloDeVida({ cliente })` em `src/telas/painel/trilha/faixa.tsx`; "ver trilha" navega para `Destino { modulo: 'painel', aba: 'societario', trilha: clienteId }` |
| C7 | Busca global | S01 | todas | Cada módulo expõe uma função `buscar(termo, escopo)` em arquivo próprio (`src/dados/busca-sNN.ts`); S01 junta |
| C8 | Item Conversas internas | S05 | S01 (contador na barra) | Módulo `interna` em `modulos.ts`; contador de não lidas por `usePersistente('s05:interna:naoLidas')` |
| C9 | Conectores e saúde | S09 | S02 (saúde da captura), S03, S08 | Estado dos conectores em `src/dados/conectores.ts` (S09); leitura por `estadoConector(id)`; link `Destino { modulo: 'config', aba: 'conectores' }` |
| C10 | Telas do BPO no app | S08 | S10 | `src/cliente/bpo.tsx` continua exportando `AprovacoesApp`, `CaixaApp`, `PropostaAlcadaApp`; S10 não muda os pontos de uso sem combinar |
| C11 | Gaveta "Pedir ao integrante" e trabalho simulado | coordenação | todas | `usePedirIntegrante` (`src/ambiente/pedir.ts`) sem mudança de assinatura |

## 4. As sessões

### S01 · Início e moldura (`wf-s01-inicio`)

- **Escopo:** S01-T01 a T11 do mapa: barra lateral e cabeçalho (com o celular), Assistente, Time, novo integrante, Visão geral, gaveta do chat, sino e avisos, Minha conta, busca global, seletor de cliente e troca de contexto, modo de espera.
- **Pode alterar:** `src/telas/AssistenteTela.tsx`, `TimeTela.tsx`, `VisaoGeralTela.tsx`, `ListaMensagens.tsx`, `ModuloTela.tsx`, `Moldura.tsx`, `useConversa.ts`, `useHistorico.ts`, `pedidoAoTime.ts`; em `src/components/compostos/`: `barra-lateral`, `cabecalho-modulo`, `seletor-cliente`, `abas-segmentadas`, `campo-chat`, `bolha-chat`, `barra-conversa`, `cartoes-chat`, `cartoes-legal`, `botoes-decisao`, `lista-integrantes`, `cabecalho-integrante`, `novo-integrante`, `aviso-integrante`, `aviso-compacto`, `widgets`, `limite-uso`, `progresso-trabalho`, `orb-mensagem`, `marca`; `src/ambiente/interface.tsx`, `conta.tsx`, `espera.tsx`, `integrante-vivo.ts`; arquivos novos (busca global, memória do integrante, configurar integrante).
- **Só acrescentar:** `Plataforma.tsx`, `modulos.ts`, `sessao.tsx`, `loja.tsx` (`Destino`), `simulacao.ts`, `efeitos.tsx`, `PainelLab.tsx`, `tipos.ts` (é dona de `Integrante`, `Mensagem`, `Cartao`, `Aviso`).
- **Não mexer:** telas dos módulos (Painel, CRM, Timesheet, Financeiro, BPO, Arquivos, Configurações, app).
- **Depende de:** S04 (C5 calendário, C4 tarefa); S05 (C8 contador); todas (C7 busca). Até chegarem, o widget usa o calendário da semana atual.
- **Entrega para:** cartões de aprovação, chat e seletor que todas usam; busca global (C7).

### S02 · Painel A: anatomia, Societário, Obrigações, Notas (`wf-s02-painel-a`)

- **Escopo:** S02-T01 a T05: anatomia comum da aba (faixa, cabeçalho, pendências, documentos, ações, relatórios, bloco "Obrigações do setor"), Societário, Obrigações dinâmica por setor, Notas, ficha do cliente.
- **Pode alterar:** `src/telas/PainelTela.tsx`, `src/telas/painel/comuns.tsx`, `Tabela.tsx`, `tipos.ts`, `padroes.ts` (chaves das suas abas e a estrutura), `societario.tsx`, `obrigacoes.tsx`, `notas.tsx`; `src/components/compostos/painel-aba.tsx`; `src/dados/painel-abas.ts` (blocos `societarioDetalhe`, `obrigacoesDetalhe`, `notasDetalhe`), `src/dados/painel.ts` (`abasPainel`), `src/dados/perfil-cliente.ts`, `src/ambiente/clientes.ts`; em `src/ambiente/fluxos.tsx` só `GavetaFichaCliente`; arquivos novos (`obrigacoes-setor.tsx`, dados de obrigação por setor).
- **Só acrescentar:** os compartilhados da seção 2; `tipos.ts` (dona de `Cliente`).
- **Não mexer:** `fiscal.tsx`, `contabil.tsx`, `consultoria.tsx`, `dp.tsx`, `gestao.tsx`, `bloco-tarefas.tsx`, resto de `fluxos.tsx`.
- **Depende de:** S04 (C3, C4, C6); S09 (C9 saúde dos conectores no cabeçalho de Notas).
- **Entrega para:** C1 e C2 (primeiro commit), anatomia que S03 e S04 usam.

### S03 · Painel B: Fiscal, Contábil, Consultoria (`wf-s03-painel-b`)

- **Escopo:** S03-T01 a T03: Fiscal (Simples, MEI, Presumido e Real, pessoa física), Contábil (com D-02, D-03, D-11 a D-16, D-21, D-22, D-26, C2-14), Consultoria (todas as fases).
- **Pode alterar:** `src/telas/painel/fiscal.tsx`, `contabil.tsx`, `consultoria.tsx`; `src/dados/painel.ts` (blocos `fiscalDetalhe`, `contabilDetalhe`); `src/dados/painel-abas.ts` (bloco `consultoriaDetalhe`); `padroes.ts` (chaves das suas abas); arquivos novos (`src/telas/painel/fiscal/*`, `contabil/*`, `consultoria/*`, `src/dados/painel-sNN-*.ts`).
- **Só acrescentar:** os compartilhados da seção 2.
- **Não mexer:** anatomia (`painel-aba.tsx`, `comuns.tsx`, `PainelTela.tsx`), abas de S02 e S04, `cartoes-legal.tsx` (de S01; pedir em `DECISOES.md` se o parecer precisar de outro cartão).
- **Depende de:** S02 (C1), S04 (C3, C4), S09 (C9 caixa postal e conectores).
- **Entrega para:** S10 (declaração de faturamento e documentos assinados que chegam ao app), S07 (fora do escopo vira avulso).

### S04 · Painel C: DP, Gestão, tarefas, trilhas, ciclo de vida (`wf-s04-painel-c`)

- **Escopo:** S04-T01 a T09: DP (duas visões; C2-01 a C2-06), Gestão (D-38, C2-27, C2-28), lista e visão por responsável, calendário, detalhe da tarefa com checklist e fila de revisão, nova tarefa e recorrência, trilha de entrada, trilha de saída, ciclo de vida.
- **Pode alterar:** `src/telas/painel/dp.tsx`, `gestao.tsx`; `src/components/compostos/bloco-tarefas.tsx`, `cartao-tarefa.tsx`, `rotulos.ts`; `src/ambiente/fluxos.tsx` (menos `GavetaFichaCliente`); `src/dados/painel.ts` (bloco `dpDetalhe`); `src/dados/painel-abas.ts` (bloco `gestaoDetalhe`); `padroes.ts` (chaves das suas abas); arquivos novos (`src/components/compostos/calendario.tsx`, `src/telas/painel/trilha/*`, `src/telas/tarefas/*`).
- **Só acrescentar:** os compartilhados da seção 2; `tipos.ts` (dona de `Tarefa` e `StatusTarefa`).
- **Não mexer:** abas de S02 e S03, anatomia.
- **Depende de:** S02 (C1); S05 (pedido de "virar tarefa" usa C4).
- **Entrega para:** C3, C4, C5, C6 (primeiro commit com os esqueletos).

### S05 · CRM e Comunicação interna (`wf-s05-crm-interna`)

- **Escopo:** S05-T01 a T05: Conversas, Leads, Comunicados e réguas, Números e configurações, Conversas internas (módulo novo, com janela flutuante).
- **Pode alterar:** `src/telas/crm/*` (inclusive `config/`), `src/dados/crm.ts`; arquivos novos `src/telas/interna/*`, `src/dados/interna.ts`, `src/ambiente/interna.tsx`.
- **Só acrescentar:** `modulos.ts` (módulo `interna`), `Plataforma.tsx`, `sessao.tsx`, `loja.tsx` (`Destino.conversaInterna?`), `simulacao.ts`, `efeitos.tsx`, `PainelLab.tsx`, `tipos.ts` (dona de `Conversa`).
- **Não mexer:** Painel, Timesheet, app do cliente (o fio do app é lido, não reescrito), `barra-lateral.tsx` (o contador entra pelo C8).
- **Depende de:** S04 (C4 virar tarefa), S01 (C8 contador na barra), S02 (trilha disparada ao fechar contrato, via C6).
- **Entrega para:** S10 (mensagens do escritório que aparecem no app), S01 (contador), S09 (anexos da comunicação interna em Arquivos com origem própria).

### S06 · Timesheet (`wf-s06-timesheet`)

- **Escopo:** S06-T01 a T06: Meu tempo, Confirmações, Equipe, Rentabilidade, configurações e pop-ups, extensão simulada.
- **Pode alterar:** `src/telas/timesheet/*`, `src/dados/timesheet.ts`; arquivos novos.
- **Só acrescentar:** os compartilhados da seção 2.
- **Não mexer:** `blocos.tsx` (de S09; acrescentar bloco novo no fim, se precisar).
- **Depende de:** S04 (C3: "não era esta" e serviço extra C2-25 marcados na tarefa).
- **Entrega para:** S07 (custo-hora e rentabilidade), S04 (ausências para o substituto).

### S07 · Financeiro do escritório (`wf-s07-financeiro`)

- **Escopo:** S07-T01 a T08: as sete abas e Configurar (com C2-23 e C2-25 nos extras).
- **Pode alterar:** `src/telas/financeiro/*` (dona de `pecas.tsx`), `src/dados/financeiro.ts`; arquivos novos.
- **Só acrescentar:** os compartilhados da seção 2.
- **Não mexer:** `src/telas/bpo/*`.
- **Depende de:** S04 (comanda de extra na tarefa), S06 (custo-hora).
- **Entrega para:** S08 (peças com titular, sem mudar a assinatura dos componentes sem registrar), S10 (faturas no app).

### S08 · BPO (`wf-s08-bpo`)

- **Escopo:** S08-T01 a T10: as nove abas nas duas frentes, Clientes do BPO puro, contexto mãe e contratante, portal do convidado, telas do BPO no app.
- **Pode alterar:** `src/telas/bpo/*`, `src/telas/ClientesTela.tsx`, `src/dados/bpo.ts`, `src/cliente/bpo.tsx`; arquivos novos (portal do convidado, contexto).
- **Só acrescentar:** os compartilhados da seção 2.
- **Não mexer:** `src/telas/financeiro/*` (pedir mudança em `pecas.tsx` em `DECISOES.md`), `ClienteApp.tsx`.
- **Depende de:** S07 (peças), S01 (troca de contexto no seletor, S01-A82), S09 (conexão de ERP no cofre).
- **Entrega para:** S10 (C10).

### S09 · Arquivos, Configurações, entrada e implantação (`wf-s09-arquivos-config`)

- **Escopo:** S09-T01 a T14: Arquivos, visualizador, Escritório, Usuários, Papéis e permissões, Integrantes, Tema e marca branca, Armazenamento, Conectores e cofre (aba nova), Assinatura, Suporte, login e primeiro acesso, assistente de implantação, Raio-X do Drive.
- **Pode alterar:** `src/telas/ArquivosTela.tsx`, `src/telas/LoginTela.tsx`, `src/telas/config/*`, `src/dados/arquivos.ts`, `src/dados/configuracoes.ts`, `src/ambiente/documentos.tsx`, `src/ambiente/suporte.tsx`, `src/components/compostos/visualizador-documento.tsx`, `blocos.tsx`; arquivos novos (`src/telas/config/ConectoresTela.tsx`, `src/dados/conectores.ts`, `src/telas/implantacao/*`, `src/telas/raio-x/*`).
- **Só acrescentar:** `modulos.ts` (abas `conectores` e, se adotada, `permissoes` em `config`), os demais compartilhados.
- **Não mexer:** `src/theme/*` (o tema de fábrica e os temas de exemplo são da marca; a tela edita o objeto `Tema` em memória, como hoje).
- **Depende de:** S01 (login leva à moldura), S04 (trilha usa o Raio-X).
- **Entrega para:** C9; visualizador usado por todas.

### S10 · App do cliente (`wf-s10-app-cliente`)

- **Escopo:** S10-T01 a T11: entrada e primeiro acesso, Início, Documentos, Pendências, Pedidos, Conversa, Agenda, Financeiro, Empresa, Serviços e Consultor, avisos e saída.
- **Pode alterar:** `src/cliente/ClienteApp.tsx`, `MolduraCliente.tsx`, `servicos.tsx`, `src/dados/servicos-extras.ts`; arquivos novos em `src/cliente/`.
- **Só acrescentar:** os compartilhados da seção 2.
- **Não mexer:** `src/cliente/bpo.tsx` (de S08, C10), telas do escritório.
- **Depende de:** S02 (contatos da ficha, pendências), S04 (C3, C4: pedido vira tarefa), S05 (fio da conversa), S07 (faturas), S08 (C10), S03 (documentos assinados).
- **Entrega para:** eventos "Chegou ao escritório" lidos pelas telas do escritório.

### S11 · Pacote Jurídico (`wf-s11-juridico`, depois da integração de S01 a S10)

- **Escopo:** S11-T01 a T14: item Jurídico com Hoje, Processos e ficha, Prazos e agenda, Intimações, Peças e modelos, Mandatos, Controladoria; agenda com audiências, perícias, diligências e correspondentes; CRM jurídico; app jurídico; segurança e LGPD; migração e modo sombra; configurador de preço.
- **Pode alterar:** só arquivos novos: `src/telas/juridico/*`, `src/dados/juridico/*`, `src/cliente/juridico.tsx`.
- **Só acrescentar:** `modulos.ts` (módulo `juridico`), `Plataforma.tsx`, `sessao.tsx`, `loja.tsx` (`Destino.processo?`), `simulacao.ts`, `efeitos.tsx`, `PainelLab.tsx`; nas telas de outras sessões, só por pedido em `DECISOES.md` (seção Jurídico da ficha do cliente, funil jurídico no CRM, "Meu processo" no app, chips do Timesheet, configurador na Assinatura).
- **Não mexer:** telas do Contábil e do BPO.
- **Depende de:** todas (roda sobre o `wireframe` integrado).

## 5. Ordem de integração sugerida

1. Esqueletos dos contratos: S02 (C1, C2), S04 (C3 a C6), S05 (C8), S09 (C9), em commits pequenos levados ao `wireframe` antes do resto.
2. S01 (casca e cartões), S04 (tarefas), S02 (anatomia e abas A).
3. S03, S05, S06, S07, S09 em qualquer ordem.
4. S08 (depois de S07), S10 (depois de S02, S05, S07 e S08).
5. S11, sobre o `wireframe` integrado.

Conflito em arquivo compartilhado se resolve mantendo as duas inclusões; mudança no que já existia sem dono vira pedido em `DECISOES.md`.
