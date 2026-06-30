# PRD / Contexto Mestre — Sistema Concursos / SuportIF

**Data:** 2026-06-30  
**Status:** Documento de alinhamento operacional e produto  
**Objetivo:** Manter uma fonte clara para não perdermos o contexto entre ChatGPT, Codex, Claude Code Pro, Claude Design, Hermes e OpenCode.

---

## 1. Fonte deste documento

Este documento consolida o que já foi alinhado nos chats do projeto **Sistema Concursos** e no relatório de auditoria profunda do workspace gerado pelo **Codex**.

O relatório usado como base identificou o workspace em `/home/lalix/workspace`, com destaque para:

- `suportif` como projeto principal e mais maduro;
- `miniprojeto` como POC financeira/WhatsApp com riscos críticos se exposta publicamente;
- `hermes` como laboratório de relatórios/automações com dados locais sensíveis;
- `graylog-lab` como laboratório de logs;
- `codex-terminal`, `prompts`, `relatorios`, `sandbox`, `scripts` e demais pastas como apoio operacional.

**Importante:** este documento não inventa funcionalidades futuras como se já existissem. Quando algo for plano, será marcado como **planejado**.

---

## 2. Definição correta do produto

O **SuportIF** deve ser entendido como um:

> **LMS gamificado para apoio educacional, voltado a trilhas de aprendizagem, exercícios, simulados, revisões agendadas após erros, acompanhamento de progresso e gestão por papéis. Ele inclui uma camada de CMS/admin para cadastrar e organizar conteúdos educacionais, mas seu núcleo é de aprendizagem, avaliação e acompanhamento.**

Essa definição é importante porque evita que agentes de IA tratem o projeto como:

- blog;
- site institucional;
- dashboard genérico;
- plataforma só de conteúdo;
- área de membros simples;
- CMS puro.

A forma correta de pensar o SuportIF é:

```text
SuportIF = LMS gamificado
├── Área do aluno / membro
├── Trilhas, módulos, missões e exercícios
├── Simulados e revisão pós-erro
├── Progresso, XP e gamificação
├── Tutor / acompanhamento pedagógico
├── Admin / CMS educacional
└── Autorização por papéis
```

---

## 3. Stack atual conhecida

Com base na auditoria do workspace e no histórico do projeto, o SuportIF usa:

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Prisma**
- **PostgreSQL**
- **Zod**
- **bcryptjs**
- **React Hook Form**
- **Recharts**
- **Vitest**
- **Docker Compose**

A arquitetura atual já possui:

- autenticação própria;
- sessão com cookie `httpOnly`;
- papéis de usuário;
- área pública;
- login;
- área do aluno;
- área do tutor;
- área administrativa;
- trilhas;
- módulos;
- missões;
- exercícios;
- simulados;
- progresso;
- XP;
- revisões;
- seed demonstrativo;
- testes unitários.

---

## 4. Estado técnico conhecido do SuportIF

Segundo a auditoria do Codex:

- o SuportIF era o projeto mais maduro do workspace;
- o repositório estava limpo no momento da análise;
- lint passou sem warnings;
- build de produção passou;
- 24 testes unitários passaram;
- as páginas protegidas encontradas chamavam `requireRole`;
- server actions sensíveis validavam papel no servidor;
- `.env`, `node_modules`, `.next`, bancos Prisma e `tsbuildinfo` estavam ignorados pelo Git.

Estado Git informado posteriormente pelo usuário:

```text
Repo: /home/lalix/workspace/suportif
Branch: melhoria-design-ux-suportif
Worktrees existentes no momento: apenas a principal
```

Ainda não foi confirmado neste documento que worktrees separadas para Claude e Codex foram criadas. Portanto, o uso de worktrees permanece como **planejado/opcional**.

---

## 5. O que é produto, o que é laboratório

### 5.1 Projeto principal

```text
/home/lalix/workspace/suportif
```

Este é o projeto principal do Sistema Concursos neste momento.

### 5.2 Laboratórios e apoio

```text
/home/lalix/workspace/miniprojeto
/home/lalix/workspace/hermes
/home/lalix/workspace/graylog-lab
/home/lalix/workspace/codex-terminal
/home/lalix/workspace/relatorios
/home/lalix/workspace/prompts
/home/lalix/workspace/sandbox
/home/lalix/workspace/scripts
```

Essas pastas não devem ser confundidas com o produto principal.

---

## 6. Riscos conhecidos do workspace

### 6.1 Riscos do SuportIF

O SuportIF está saudável para desenvolvimento e demonstração, mas ainda possui pontos antes de produção:

- PostgreSQL do Docker Compose está publicado como `5432:5432`, acessível em todas as interfaces;
- não foi identificado rate limiting de login;
- política de expiração/revogação administrativa de sessões ainda pode ser melhorada;
- `AUTH_SESSION_DAYS` precisa de validação de faixa;
- `next.config.ts` pode receber headers de segurança;
- testes são majoritariamente unitários, sem E2E/integrados visíveis para login/RBAC/fluxos completos;
- aviso futuro do Prisma 7 sobre configuração em `package.json`;
- necessidade de fixar versão de Node com `.nvmrc` ou `engines`.

### 6.2 Riscos do miniprojeto Agro/Mercado Pago/WhatsApp

Este é o ponto mais sensível do workspace.

A POC possui, ou pode possuir:

- criação de cobrança Pix;
- integração com Mercado Pago;
- integração/simulação WhatsApp;
- uso de IA externa;
- banco SQLite com vendas/pagamentos/payloads;
- dashboard sem autenticação;
- webhooks sem validação de assinatura.

**Regra:** não publicar esse miniprojeto na internet enquanto não houver autenticação, validação de assinatura dos webhooks, rate limiting, proteção de dados e revisão de segurança.

### 6.3 Riscos do Hermes

O Hermes contém exportações e relatórios derivados de WhatsApp.

Esses dados devem ser tratados como pessoais/confidenciais.

Pontos de atenção:

- permissões locais;
- retenção de dados;
- anonimização de relatórios;
- não commitar exports, ZIPs ou bancos locais.

### 6.4 Riscos do Graylog Lab

O laboratório Graylog é útil para análise de logs, mas precisa manter portas sensíveis presas a `127.0.0.1` quando for uso local.

A auditoria apontou possível exposição do Syslog UDP `1514` em todas as interfaces.

---

## 7. Regras absolutas para qualquer agente

Qualquer agente trabalhando no SuportIF deve obedecer:

```text
1. Não criar UI fake.
2. Não usar mock final como se fosse dado real.
3. Não inventar funcionalidade inexistente.
4. Não criar botão sem ação.
5. Não quebrar autenticação.
6. Não quebrar autorização por papéis.
7. Não alterar schema Prisma sem aprovação explícita.
8. Não mexer em .env.
9. Não imprimir segredos.
10. Não instalar dependências sem justificar.
11. Não fazer commit/push sem pedido explícito.
12. Preservar lint, testes e build.
13. Antes de editar, explicar plano.
14. Depois de editar, entregar diff, riscos e validações.
```

---

## 8. Papéis dos agentes

### 8.1 ChatGPT

Papel principal:

- coordenação estratégica;
- arquitetura;
- priorização;
- criação de prompts;
- decisão de qual agente usar;
- auditoria das entregas;
- prevenção de bagunça entre agentes.

Não deve ser usado como executor direto do repositório sem validação externa.

### 8.2 Codex

Papel principal:

- auditoria profunda;
- validação técnica;
- lint/test/build;
- segurança;
- backend/dados;
- análise de diffs;
- revisão crítica antes de merge.

Uso ideal:

```text
Codex = auditor técnico e validador final
```

Evitar:

- usar Codex como principal agente de design visual subjetivo;
- deixar Codex refatorar tudo sem escopo.

### 8.3 Claude Code Pro

Papel principal:

- implementação guiada;
- refino de componentes;
- criação de skills locais;
- UX com código real;
- melhorias controladas no frontend;
- ajustes de documentação e fluxo.

Uso ideal:

```text
Claude Code Pro = implementador/refinador com plano claro
```

Evitar:

- deixar mexer em vários domínios ao mesmo tempo;
- deixar criar tela bonita sem banco/ação real;
- usar sem gate de validação do Codex.

### 8.4 Claude Design / Claude Web

Papel principal:

- design visual;
- inspiração de UI;
- crítica estética;
- copy;
- fluxo visual;
- referência de produto.

Uso ideal:

```text
Claude Design = direção visual e UX
```

Evitar:

- aceitar proposta visual sem validação técnica;
- transformar SuportIF em landing page ou app fake.

### 8.5 Hermes

Papel principal:

- relatórios;
- automações;
- pesquisa local autorizada;
- organização de dados;
- radar de WhatsApp/exportações locais.

Uso ideal:

```text
Hermes = agente operacional e de relatórios
```

Evitar:

- alterar código principal do SuportIF;
- manipular dados sensíveis sem política de retenção.

### 8.6 OpenCode

Papel principal:

- agente alternativo/local;
- comparação de solução;
- tarefas pequenas isoladas;
- revisão pontual.

Uso ideal:

```text
OpenCode = reserva técnica / comparação / tarefa isolada
```

Evitar:

- virar terceiro agente editando o mesmo repo sem controle;
- rodar junto com Claude e Codex na mesma pasta.

---

## 9. Fluxo recomendado entre agentes

### 9.1 Fluxo simples

```text
ChatGPT define tarefa
↓
Claude Code Pro implementa ou propõe
↓
Codex valida lint/test/build/diff
↓
ChatGPT audita resultado
↓
Usuário decide commit/push
```

### 9.2 Fluxo com worktrees — planejado/opcional

Para evitar que Claude e Codex editem o mesmo diretório:

```text
~/workspace/suportif          = principal estável
~/workspace/suportif-claude   = Claude implementa/design
~/workspace/suportif-codex    = Codex valida/audita
~/workspace/agent-hub         = handoffs, relatórios, patches, validações
```

Criação planejada, somente se o usuário confirmar:

```bash
cd ~/workspace/suportif
mkdir -p ~/workspace/agent-hub/suportif/{handoffs,reports,validations,diffs}
git worktree add ../suportif-claude -b agent/claude-suportif
git worktree add ../suportif-codex -b agent/codex-suportif
git worktree list
```

**Atenção:** esses comandos não devem ser executados se houver alterações pendentes ou se o usuário não quiser fluxo paralelo.

---

## 10. Skills locais planejadas para Claude Code Pro

A estratégia correta é evitar “Skill Hell”.

Não instalar pacotes gigantes de skills sem necessidade.

Criar poucas skills locais do SuportIF:

### 10.1 `suportif-runbook`

Tipo: user-invoked.

Objetivo:

- ensinar como rodar o projeto;
- comandos de dev, Docker, Prisma, lint, test, build;
- evitar que o agente chute comandos.

### 10.2 `suportif-anti-fake-ui`

Tipo: model-invoked ou user-invoked com trigger muito claro.

Objetivo:

- impedir UI fake;
- impedir botão sem ação;
- impedir dado mockado como real;
- exigir fluxo persistido quando a tela disser que faz algo.

### 10.3 `suportif-design-review`

Tipo: user-invoked.

Objetivo:

- revisar visualmente o SuportIF;
- reduzir aparência de “sistema interno”;
- aproximar o produto de LMS moderno, limpo e funcional;
- manter inspiração em produtos educacionais/SaaS bons, sem copiar.

### 10.4 `suportif-rbac-security-review`

Tipo: user-invoked.

Objetivo:

- revisar aluno/tutor/admin;
- checar server actions sensíveis;
- checar `requireRole`;
- evitar vazamento entre papéis.

### 10.5 `suportif-test-gate`

Tipo: user-invoked.

Objetivo:

- rodar lint;
- rodar testes;
- rodar build;
- verificar diff;
- listar riscos antes de commit/push.

---

## 11. Repositórios enviados e decisão atual

### 11.1 `maxbogo/awesome-ai-tools-for-ui`

Decisão:

```text
Usar como referência/inspiração, não instalar agora.
```

Serve para:

- descobrir ferramentas e referências de UI;
- inspirar Claude Design;
- melhorar repertório visual.

Não serve, por enquanto, para:

- virar dependência do projeto;
- ser instalado no workspace;
- ser entregue ao Codex como regra operacional.

### 11.2 `affaan-m/ecc`

Decisão:

```text
Estudar com calma, não instalar agora.
```

Pode servir como inspiração para:

- organização de regras;
- skills;
- hooks;
- configs para múltiplos agentes;
- harness entre Claude/Codex/OpenCode.

Risco:

- virar Skill Hell;
- sobrescrever configurações;
- misturar regras genéricas com regras específicas do SuportIF.

---

## 12. Documentação que deve existir no projeto

Documentos recomendados:

```text
README.md
AGENTS.md
CLAUDE.md
PROJECT_CONTEXT.md ou docs/PROJECT_CONTEXT.md
docs/PRD-SUPORTIF.md
docs/AUDITORIA-MVP.md
docs/IDEIA-SUPORTIF.md
```

Se for criado um hub externo:

```text
~/workspace/agent-hub/suportif/CONTEXT.md
~/workspace/agent-hub/suportif/DECISIONS.md
~/workspace/agent-hub/suportif/handoffs/
~/workspace/agent-hub/suportif/reports/
~/workspace/agent-hub/suportif/validations/
~/workspace/agent-hub/suportif/diffs/
```

---

## 13. Critérios de pronto para mudanças no SuportIF

Uma mudança só deve ser considerada pronta se:

```text
1. O objetivo foi explicado antes.
2. O escopo ficou pequeno e claro.
3. Não houve alteração indevida em .env/schema/auth.
4. Não foram criados dados fake como se fossem reais.
5. Não há botão sem ação.
6. Fluxos principais continuam funcionando.
7. npm run lint passou.
8. npm test passou.
9. npm run build passou.
10. git diff foi explicado.
11. riscos restantes foram listados.
```

---

## 14. Próximas decisões pendentes

### Decisão 1 — Criar ou não worktrees

Opção A: manter fluxo simples por enquanto.  
Opção B: criar `suportif-claude` e `suportif-codex` para fluxo paralelo controlado.

Recomendação atual:

```text
Criar worktrees só quando o usuário quiser realmente trabalhar com Claude e Codex em paralelo.
```

### Decisão 2 — Fazer hardening local P1

Pontos:

- `chmod 600` em `.env`;
- `chmod 600` em bancos SQLite sensíveis;
- `chmod 600` em exports/ZIPs/relatórios sensíveis;
- não apagar nada;
- não imprimir segredos.

Recomendação atual:

```text
Fazer com Codex, pois ele já realizou a auditoria profunda do workspace.
```

### Decisão 3 — Criar skills locais do Claude Code Pro

Recomendação atual:

```text
Criar depois do alinhamento deste PRD/contexto.
```

### Decisão 4 — Voltar ao design do SuportIF

Recomendação atual:

```text
Só depois de contexto, segurança local mínima e skills/guardrails básicos.
```

---

## 15. Prompt base para qualquer agente

Use este contexto quando iniciar uma nova sessão de agente:

```text
Você está trabalhando no projeto Sistema Concursos, cujo produto principal atual é o SuportIF.

O SuportIF é um LMS gamificado para apoio educacional, com trilhas de aprendizagem, missões, exercícios, simulados, revisões agendadas após erros, progresso, XP, área de aluno, área de tutor e admin/CMS educacional.

Não trate o projeto como blog, dashboard genérico, CMS puro ou área de membros simples.

Regras absolutas:
- não criar UI fake;
- não usar mock final;
- não inventar dados;
- não criar botão sem ação;
- não quebrar auth;
- não quebrar RBAC aluno/tutor/admin;
- não alterar schema Prisma sem aprovação;
- não mexer em .env;
- não imprimir segredos;
- não fazer commit/push sem pedido;
- preservar lint, testes e build.

Antes de editar, explique plano. Depois de editar, entregue diff, validações e riscos.
```

---

## 16. Resumo final

O projeto não está perdido. O estado atual é bom:

- o SuportIF já tem base técnica real;
- o domínio correto é LMS gamificado;
- a stack Next.js + PostgreSQL está adequada;
- Codex deve ser usado como auditor/validador;
- Claude Code Pro deve ser usado para implementação/refino controlado;
- Claude Design deve ajudar na estética e UX;
- Hermes fica para relatórios/automações;
- OpenCode fica como apoio alternativo;
- o principal risco imediato está fora do SuportIF: miniprojeto financeiro/WhatsApp e dados locais sensíveis.

A próxima etapa não é instalar muitas ferramentas. A próxima etapa é transformar este alinhamento em fonte de verdade do projeto e fazer os agentes trabalharem com escopo pequeno, validação forte e sem Skill Hell.
