---
name: suportif-rbac-security-review
description: Auditar autenticação, sessão, RBAC e isolamento de dados do SuportIF. Usar em mudanças que afetem rotas protegidas, server actions, queries pessoais, papéis, turmas ou sessão, especialmente antes de merge.
---

# SuportIF RBAC Security Review

## Trigger

Invocar ao revisar autenticação, sessão, papéis, server actions, queries de usuário, rotas protegidas ou lógica de acesso de tutor.

## Structure

Executar revisão somente leitura e classificar achados por impacto. Não corrigir segurança sem autorização específica.

## Steering

### Modelo atual

```text
STUDENT → /app/*
TEACHER → /tutor/*
ADMIN   → /admin/*
```

### Rotas e sessão

- Confirmar que cada ramo protegido chama `requireRole` em `page.tsx`, `layout.tsx` ou outra fronteira server-side antes de fornecer dados.
- Confirmar que usuário anônimo vai para `/login` e papel incorreto volta à área do próprio papel com indicação de acesso proibido.
- Confirmar consulta de `Session` pelo hash, verificação de `expiresAt` e cookie `httpOnly`.
- Confirmar que logout remove a sessão persistida.

### Actions e queries

- Confirmar `requireRole` no início de cada action sensível.
- Confirmar validação Zod para entradas não confiáveis.
- Em ações de aluno, derivar `userId` da sessão.
- Em ações e consultas de tutor, validar vínculo com o aluno por `ClassMembership` ou helper equivalente, como `teacherCanAccessStudent`.
- Em admin, impedir acesso de `STUDENT` e `TEACHER`.
- Em queries internas que recebem IDs, verificar se o chamador autenticado estabeleceu o escopo antes da consulta.

### Dados sensíveis

- Não expor `passwordHash`, `tokenHash`, cookies ou segredos.
- Verificar risco de enumeração, acesso cross-role e acesso a aluno fora da turma.
- Registrar como risco conhecido a ausência de rate limiting no login quando continuar aplicável.

### Saída

Classificar como crítico, alto, médio ou baixo. Para cada achado, informar arquivo, linha, evidência, impacto e correção sugerida.

## Pruning

- Não alterar código durante a auditoria.
- Não exigir autenticação em `/` ou `/login`.
- Não revisar estética ou performance fora do impacto de segurança.
- Não alterar auth, schema, `.env` ou dependências sem aprovação explícita.

## Checklist

- [ ] Rotas protegidas cobertas por autorização server-side.
- [ ] Actions sensíveis validam papel e entrada.
- [ ] Aluno limitado aos próprios dados.
- [ ] Tutor limitado às próprias turmas.
- [ ] Sessão e logout verificados.
- [ ] Dados sensíveis não expostos.
- [ ] Riscos conhecidos e limites registrados.

## Critérios de conclusão

Encerrar quando o relatório classificado estiver entregue com evidências e escopo revisado; qualquer correção deve ser uma tarefa aprovada separadamente.
