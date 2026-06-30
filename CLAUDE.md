# CLAUDE.md — SuportIF / Sistema Concursos

## Identidade do projeto

O SuportIF é um LMS gamificado para apoio educacional, voltado a trilhas de aprendizagem, exercícios, simulados, revisões agendadas após erros, acompanhamento de progresso e gestão por papéis.

Ele inclui uma camada de CMS/admin para cadastrar e organizar conteúdos educacionais, mas seu núcleo é aprendizagem, avaliação, progresso e acompanhamento.

Não trate este projeto como blog, landing page simples, CMS puro, área de membros simples ou dashboard genérico.

## Stack

- Next.js App Router
- TypeScript
- Tailwind/shadcn
- Prisma
- PostgreSQL
- Docker Compose
- Zod
- Vitest

## Papéis

O sistema possui áreas e permissões para:

- aluno
- tutor
- admin

Qualquer mudança deve respeitar autenticação, autorização e isolamento por papel.

## Regras absolutas

- Não criar UI fake.
- Não usar mock final.
- Não inventar dados.
- Não criar botão sem ação.
- Não quebrar auth.
- Não alterar schema Prisma sem aprovação explícita.
- Não mexer em permissões sem justificar.
- Não mexer em .env.
- Não imprimir segredos.
- Não instalar dependências sem aprovação.
- Não fazer commit sem pedido explícito.
- Não fazer push sem pedido explícito.

## Antes de editar

Antes de alterar arquivos, explique:

1. objetivo da mudança;
2. arquivos que pretende alterar;
3. riscos;
4. como vai validar.

Se houver risco de schema, auth, permissões ou dados sensíveis, pare e peça aprovação.

## Validação obrigatória

Ao final de mudanças relevantes, rodar quando possível:

```bash
npm run lint
npm test
npm run build
