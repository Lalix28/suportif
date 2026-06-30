---
name: suportif-runbook
description: Orientar setup e operação local do SuportIF. Usar quando o usuário pedir comandos de desenvolvimento, Docker, Prisma, seed, testes, build ou diagnóstico do ambiente.
---

# SuportIF Runbook

## Trigger

Invocar para rodar ou configurar o projeto, explicar comandos, operar Docker/Prisma, executar seed ou validar o ambiente.

## Structure

Atuar como referência operacional: conferir `package.json`, `README.md` e o estado local antes de orientar ou executar comandos.

## Steering

### Setup do zero

Apresentar esta sequência, mas obter aprovação antes de criar `.env`, instalar dependências ou alterar o banco:

```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
```

O usuário deve revisar as variáveis locais; não ler nem editar `.env` sem autorização. O seed recria dados demonstrativos e não deve ser descrito como upsert ou como seguro para dados reais.

### Desenvolvimento

```bash
npm run dev
npm run lint
npm test
npx tsc --noEmit
npm run build
```

### Prisma e Docker

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npx prisma studio
docker compose up -d
docker compose down
docker compose logs -f
```

Explicar efeitos antes de executar migração, seed, Studio ou comandos que alterem containers/banco. `npm run build` executa `prisma generate` antes do build do Next.js.

### Rotas e usuários demo

- `/` pública; `/login` autenticação.
- `/app/*` aluno (`STUDENT`).
- `/tutor/*` professor/tutor (`TEACHER`).
- `/admin/*` administrador (`ADMIN`).
- Usar somente as credenciais demonstrativas documentadas no `README.md`.

## Pruning

- Não inventar comandos, flags ou scripts ausentes do `package.json`.
- Não editar `.env`, schema, autenticação ou permissões sem aprovação explícita.
- Não instalar dependências sem aprovação.
- Não sugerir `prisma migrate reset` ou outra operação destrutiva sem explicar a perda de dados e obter confirmação.

## Checklist

- [ ] Comando confirmado no projeto.
- [ ] Pré-requisitos e efeitos explicados.
- [ ] Aprovação obtida para `.env`, dependências, migração ou seed.
- [ ] Nenhum segredo exibido.
- [ ] Resultado ou próximo diagnóstico informado.

## Critérios de conclusão

Encerrar quando o comando solicitado tiver sido executado e verificado, ou quando o bloqueio e o próximo passo seguro estiverem claros.
