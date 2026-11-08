# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Escritórios de contabilidade e de BPO financeiro** que compram a Heild como sistema de gestão (a Heild é vendida a outros escritórios, como Hubstrom ou Domínio), no lugar de Hubstrom, Conexa, Domínio, Acessórias e das cerca de 20 ferramentas que usam hoje.
- **Quem usa o dia inteiro:** a equipe de cada setor (fiscal, DP, contábil, societário, notas, atendimento, BPO), com o painel do setor aberto, aprovando o que os integrantes de IA prepararam e falando com os clientes pelo WhatsApp.
- **Quem gere:** o dono ou gestor do escritório, que olha prazos, rentabilidade por cliente, timesheet e financeiro.
- **O cliente do escritório:** a empresa atendida, pelo app do cliente: pendências, documentos, aprovação de lotes de pagamento, conversa.

## Product Purpose

A Heild é o sistema único do escritório, com IA agêntica. Painel por setor, CRM com WhatsApp, timesheet, financeiro do escritório, BPO, arquivos e app do cliente ficam num produto só. Um time de integrantes (um por setor, mais o Assistente e o Consultor) faz o trabalho operacional e devolve cartões para uma pessoa aprovar. O sucesso é o escritório desligar as ferramentas atuais e atender mais clientes com a mesma equipe, sem perder prazo.

## Positioning

- Integrantes de IA por setor que fazem o trabalho (preparam, conciliam, cobram, respondem) e passam tarefas entre si, sempre com aprovação humana para transmitir, pagar e assinar.
- Respostas sobre a lei com citação conferida, pela redação vigente na data do fato, com grau de segurança e abstenção quando não há base.
- Um cadastro único e um registro de eventos que ligam Painel, CRM, timesheet, financeiro e app: o mesmo fato aparece em todos os lados.

## Operating Context

- Uso diário, o dia inteiro, no desktop do escritório; o app do cliente é usado no celular.
- Fontes e conectores: e-CAC e Integra Contador (SERPRO), SEFAZ, prefeituras, eSocial, bancos e ERPs dos clientes (Nibo, Conta Azul, Bling), WhatsApp.
- Português do Brasil. Termos do ofício (PGDAS-D, DCTFWeb, fator R, lote, conciliação) sem explicação.

## Capabilities and Constraints

- **Áreas no lançamento:** contábil (fiscal, DP, contábil, societário, notas), BPO financeiro e os sistemas não core (CRM, timesheet, financeiro do escritório, arquivos, app do cliente). Jurídico fica fora do lançamento.
- **Marca branca:** a marca do produto é Heild. Dentro do sistema, cada escritório pode mostrar o próprio nome, sigla, cores e fontes pelo tema; sem personalização, o padrão é Heild.
- **Nunca automático:** transmitir, pagar, assinar e enviar ao cliente passam por um cartão de aprovação de uma pessoa.
- **Protótipo navegável** em `ui-lab/` (Vite, React, Tailwind), com a demonstração publicada; os planos estão em `docs/`.
- **Em aberto:** preço (por escritório, com faixas por número de CNPJs, ainda por decidir).

## Brand Commitments

- **Nome:** Heild, do nórdico antigo *heild*, "o inteiro". Linha: "O inteiro: todos os sistemas da empresa em um só lugar."
- **Logo:** wordmark HE · I · LD com o I em pílula, em uma cor só, e o sistema de movimento em que o I se transforma (componente `<heild-logo>`). Fonte: o design system Heild (claude.ai/artifact/ASwj7jTmkAy81R2RL1Gdqx).
- **Tema de fábrica:** areia em camadas (claro e escuro), PP Neue Montreal e Neue Montreal Text, um índigo de destaque, orbs coloridos por integrante (`ui-lab/src/theme/temas.ts`).
- **Voz:** direta, em português, frases curtas, voz ativa; os integrantes falam na primeira pessoa e dizem o que fizeram e o que falta.

## Evidence on Hand

- Pesquisa de mercado e preços em `pesquisa/05-mercado-preco.md`, levantamento de 589 atividades em `pesquisa/plataforma/90-consolidado.md`.
- Não há clientes, depoimentos, números de uso ou casos publicados: o produto não foi lançado. Nada disso pode ser inventado em site ou material.
- Os escritórios e clientes do protótipo são fictícios.

## Product Principles

1. A IA faz e a pessoa aprova: tudo que tem efeito fora do escritório passa por um cartão.
2. Um sistema, um fato: o que acontece em um módulo aparece em todos os outros, sem digitar duas vezes.
3. Afirmação legal só com fonte conferida; sem fonte, a resposta diz que não encontrou.
4. Substituir, não somar: cada módulo existe para desligar uma ferramenta que o escritório paga hoje.

## Accessibility & Inclusion

- Texto a 4,5:1 nos dois modos (claro e escuro), estado sempre com palavra ou ícone além da cor, foco visível por teclado, movimento reduzido respeitado.
