---
name: suportif-design-review
description: Auditar visual, UX, responsividade e clareza do SuportIF como LMS gamificado. Usar quando o usuário pedir crítica de interface, revisão de tela ou sugestões de design sem implementação automática.
---

# SuportIF Design Review

## Trigger

Invocar para revisão visual, auditoria de UX, responsividade, acessibilidade ou aparência excessivamente genérica de uma tela.

## Structure

Auditar e relatar primeiro. Separar problemas críticos, melhorias recomendadas e sugestões opcionais; implementar somente quando o usuário pedir.

## Steering

### Perspectiva do produto

Tratar o SuportIF como LMS gamificado centrado em trilhas, módulos, missões, exercícios, progresso, revisões após erros e simulados. Não o reduzir a CMS, blog, dashboard corporativo ou área de membros.

### Avaliação

- **Hierarquia:** destacar tarefa atual, próximo passo e resultado principal.
- **Aprendizagem:** manter objetivo, explicação, prática e feedback fáceis de percorrer.
- **Gamificação:** apresentar XP, nível, badges e progresso sem competir com o conteúdo.
- **Navegação:** preservar a relação trilha → módulo → missão e as áreas por papel.
- **Consistência:** reutilizar componentes, tipografia, espaçamento, cores e ícones existentes.
- **Responsividade:** verificar pelo menos viewport de 375 px, áreas de toque e ausência de overflow.
- **Acessibilidade:** verificar contraste, foco, semântica, labels e navegação por teclado.
- **Estados:** revisar loading, vazio, erro e sucesso.
- **Integridade:** não recomendar dado inventado, mock final nem botão sem ação.

### Saída

Para cada achado, informar categoria, evidência, impacto, solução específica e arquivo ou componente afetado. Distinguir observação baseada em inspeção de hipótese que exige teste no navegador.

## Pruning

- Não implementar durante uma tarefa somente de auditoria.
- Não propor redesign completo quando um ajuste pontual resolve.
- Não sugerir biblioteca ou dependência sem justificativa e aprovação.
- Não alterar schema, auth ou `.env` sem aprovação explícita.
- Não prometer funcionalidades além do MVP documentado.

## Checklist

- [ ] Identidade de LMS preservada.
- [ ] Hierarquia e próximo passo claros.
- [ ] Mobile e acessibilidade considerados.
- [ ] Estados aplicáveis revisados.
- [ ] Nenhuma UI fake ou funcionalidade inventada sugerida.
- [ ] Achados priorizados e ligados a arquivos reais.

## Critérios de conclusão

Encerrar quando a auditoria priorizada tiver sido entregue, com evidências, limites da análise e próximos passos que dependam de decisão do usuário.
