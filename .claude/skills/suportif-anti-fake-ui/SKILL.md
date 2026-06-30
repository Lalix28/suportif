---
name: suportif-anti-fake-ui
description: Revisar integridade de interfaces e fluxos do SuportIF. Usar ao criar ou revisar páginas, componentes, formulários, botões, estados visuais ou rotas para impedir UI fake e dados apresentados como reais sem suporte.
---

# SuportIF Anti-Fake UI

## Trigger

Invocar em mudanças de UI que adicionem ou alterem interação, formulário, dado dinâmico, estado visual ou promessa funcional.

## Structure

Rastrear cada promessa da interface até seu comportamento real: navegação, estado local legítimo, query, server action e persistência quando aplicável.

## Steering

### Ações

- Aceitar `Link`, navegação, abertura de painel, troca de aba e outros estados locais quando esse for o comportamento declarado.
- Exigir server action ou fluxo equivalente quando a UI prometer salvar, concluir, enviar ou alterar dados.
- Rejeitar handlers vazios e botões que prometam efeito inexistente.
- Aceitar toast como feedback; não aceitá-lo como substituto de uma persistência prometida.

### Dados

- Rastrear dados de usuário, XP, progresso, revisões e resultados até Prisma ou queries reais.
- Permitir textos editoriais, configuração visual e estados locais estáticos.
- Permitir conteúdo do seed somente quando estiver identificado como demonstrativo, fictício e não oficial.
- Não exigir que toda leitura esteja em `src/server/queries/`; acesso Prisma existente e devidamente protegido também é válido.

### Estados e formulários

- Cobrir loading, vazio, erro e sucesso quando aplicáveis.
- Validar entradas no servidor com Zod; validação cliente é opcional e não substitui a validação do servidor.
- Confirmar que IDs e opções recebidos pertencem ao recurso e ao usuário autorizados.

### Autorização

- Confirmar proteção server-side com `requireRole` na fronteira da rota protegida.
- Confirmar escopo por usuário ou turma antes de expor dados pessoais.

## Pruning

- Não bloquear ajustes puramente visuais nem interações locais legítimas.
- Não exigir persistência para controles que não prometem alterar dados.
- Não exigir E2E para toda mudança visual.
- Não alterar schema, auth, `.env` ou dependências sem aprovação explícita.
- Não reescrever componentes inteiros quando um ajuste localizado resolve.

## Checklist

- [ ] Nenhum botão ou formulário promete ação inexistente.
- [ ] Dados dinâmicos têm origem real; conteúdo demo está identificado.
- [ ] Persistência existe quando a UI afirma salvar ou concluir algo.
- [ ] Estados aplicáveis foram tratados.
- [ ] Validação e autorização server-side foram verificadas.

## Critérios de conclusão

Encerrar quando o checklist estiver verificado e os bloqueios de integridade estiverem corrigidos ou relatados claramente.
