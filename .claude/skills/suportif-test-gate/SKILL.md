---
name: suportif-test-gate
description: Executar o gate de qualidade do SuportIF antes de commit ou merge. Usar para validar lint, testes, tipos, build, diff, arquivos inesperados e riscos residuais após uma mudança.
---

# SuportIF Test Gate

## Trigger

Invocar quando o usuário pedir validação de uma mudança, prontidão para merge ou confirmação de lint, testes, tipos e build.

## Structure

Executar verificações, preservar a saída relevante e entregar um relatório objetivo. Não corrigir falhas nem fazer commit/push sem pedido.

## Steering

### Sequência

1. Estado inicial:

   ```bash
   git status --short --branch
   ```

2. Lint:

   ```bash
   npm run lint
   ```

3. Testes unitários:

   ```bash
   npm test
   ```

4. Type check:

   ```bash
   npx tsc --noEmit
   ```

5. Build:

   ```bash
   npm run build
   ```

6. Mudanças locais:

   ```bash
   git diff --stat
   git diff
   git diff --cached --stat
   git diff --cached
   git status --short
   ```

Inspecionar separadamente arquivos não rastreados relevantes, pois `git diff` não mostra seu conteúdo. Usar comparação com uma branch-base apenas quando ela existir e o usuário solicitar esse escopo.

### Avaliação

- Tratar qualquer exit code diferente de zero como falha.
- Reportar warnings e avaliar impacto. O aviso conhecido sobre configuração futura do Prisma 7 não equivale, sozinho, a falha no Prisma 6 atual.
- Não ocultar erro com `eslint-disable`, mudança de teste ou configuração.
- Listar o que não foi coberto automaticamente, como E2E, login real e mobile.

## Pruning

- Não instalar dependências para fazer o gate passar sem aprovação.
- Não alterar código, testes, schema, auth ou `.env` durante uma tarefa somente de validação.
- Não fazer commit ou push.
- Não declarar aprovação se uma etapa obrigatória falhar ou não puder ser executada.

## Checklist

- [ ] Estado inicial registrado.
- [ ] Lint, testes, tipos e build executados.
- [ ] Diff versionado, staged e arquivos não rastreados revisados.
- [ ] Nenhuma mudança inesperada em `.env`, schema ou auth.
- [ ] Nenhum mock final, dado fake ou botão sem ação introduzido.
- [ ] Warnings e riscos residuais listados.

## Critérios de conclusão

Encerrar quando o relatório apresentar o resultado de cada etapa e os riscos residuais. Aprovar somente se todas as etapas obrigatórias passarem e o diff estiver coerente com o escopo.
