# 🚀 Frontend Challenge - Catálogo de Produtos

Este projeto é uma implementação de um catálogo de produtos paginado e filtrável, construído com React, TypeScript, Vite e Tailwind CSS v4. O foco principal da arquitetura foi garantir alta performance, acessibilidade (A11y) e um código escalável com mentalidade de produção.

## 🏗️ 1. Arquitetura e Decisões de Design (Trade-offs)

**Trade-off: Por que você escolheu esse padrão de arquitetura/pastas?**
Optei por uma arquitetura baseada em *Feature-Sliced Design* simplificada (`src/features/catalog` e `src/shared`). Agrupar código por funcionalidade (e não por tipo de arquivo, como "todos os hooks" ou "todos os componentes") aumenta drasticamente a coesão. Isso facilita a manutenção porque todo o contexto de um domínio fica no mesmo lugar. O trade-off é uma leve curva de aprendizado inicial para quem está acostumado com MVC clássico no front-end.

**O que você mudaria em 6 meses?**
Se o projeto escalasse, eu migraria para um monorepo (como Turborepo) para extrair a pasta `shared/ui` para um pacote próprio. Também introduziria o Zustand ou Redux Toolkit caso o estado dos filtros precisasse ser compartilhado massivamente entre rotas distantes, e moveria o gerenciamento de chamadas assíncronas para o React Query/TanStack Query para abstrair o cache e o gerenciamento de re-fetch.

## ♿ 2. Acessibilidade (A11y)

**A11y: Cite 3 problemas de acessibilidade comuns em listas com filtros e como você evitou.**
1. **Falta de feedback para leitores de tela:** Ao filtrar itens, a tela muda visualmente, mas o leitor de tela fica mudo. *Solução:* Adicionei uma região `aria-live="polite"` invisível (sr-only) que anuncia o status de loading e o total de resultados encontrados.
2. **Armadilha de foco em Modais (Focus Trap):** Usuários de teclado continuam navegando na lista de fundo enquanto o modal está aberto. *Solução:* Utilizei a tag semântica `<dialog>` nativa do HTML5. O método `.showModal()` implementa *focus trap* e suporte à tecla `Escape` nativamente pelo browser.
3. **Perda de contorno de foco:** Elementos clicáveis costumam perder o *outline* padrão em resets de CSS. *Solução:* Desenvolvi os componentes de UI (`Button` e `TextField`) garantindo estados explícitos de `focus-visible:ring` com Tailwind, garantindo navegação clara por `Tab`.

## ⚡ 3. Performance

**2 gargalos comuns nesse tipo de tela:**
1. Renders desnecessários da grid inteira enquanto o usuário digita no input de texto.
2. Condições de corrida (*race conditions*) devido a requisições assíncronas concorrentes de busca.

**2 técnicas que você aplicou ou aplicaria (com justificativa):**
1. **Memoização Responsável:** Apliquei `React.memo` nos componentes de filtro e `useCallback` nas funções manipuladoras. Isso garante que a grid não sofra re-renders estruturais até que o hook de estado efetivamente entregue novos dados.
2. **Prevenção de Race Conditions com `AbortController`:** Se a API demorar 3s e o usuário digitar rápido, as primeiras chamadas podem retornar depois das últimas, sobrescrevendo a UI com dados incorretos. *Solução:* Como o código evita bugs?  Instanciei um `AbortController` no ciclo de vida do `useEffect`. Sempre que os filtros mudam, a requisição anterior é sumariamente cancelada no nível do browser, garantindo que a tela sempre reflita apenas a última intenção do usuário.

## 🧪 4. Estratégia de Testes

* **Teste Unitário:** Focado no `useDebounce` e na lógica de cancelamento do `useCatalogQuery`.
* **Teste de Componente:** Renderizar a `CatalogFilters` garantindo que os eventos de `onChange` sejam disparados corretamente ao interagir com inputs e selects.
* **Plano de E2E:** 1. Acessar a aplicação e aguardar a interceptação da chamada da API mock.
    2. Digitar um termo no campo de busca.
    3. Validar se a lista reduziu para os itens esperados.
    4. Clicar no botão "Detalhes" e validar se o `<dialog>` foi aberto com os dados corretos.

**Testes: Por que esses 3 testes e não outros?**  **O que você não testou e por quê?**
A pirâmide de testes foca no que traz mais ROI. Testamos a lógica pura (unitários), a interação do usuário com os controles (componentes) e o fluxo crítico de negócio (E2E). Não testei 100% de cobertura nos componentes puramente visuais (como o `Button` base), pois testes frágeis acoplados a classes CSS geram manutenção excessiva sem garantir estabilidade real de regras de negócio.

## 🔒 5. Segurança Básica (Production Mindset)

* **Como você mitigaria XSS nesse cenário?**  Contar com o escape automático do React em chaves `{}` e banir estritamente o uso de `dangerouslySetInnerHTML`. Inputs de texto devem ter validação de esquema no front-end e sanitização rigorosa obrigatória no back-end.
* **Como você trataria tokens/credenciais se existissem?**  Tokens de sessão nunca devem ser guardados em `localStorage` (vulneráveis a ataques de scripts injetados). A abordagem correta é o back-end enviar o JWT como um cookie `HttpOnly`, `Secure` e `SameSite=Strict`, tornando-o inacessível ao JavaScript do cliente.
* **Uma medida de segurança relacionada a dependências (supply chain) e CI:**  Implementar `npm audit` no pipeline de CI/CD para quebrar a build se vulnerabilidades críticas forem detectadas. Manter versões de dependências controladas pelo `package-lock.json` e auditar atualizações com ferramentas como Dependabot ou Renovate.

## 🎨 6. Design System

**Explique como evoluiria isso para um design system de verdade (governança + versionamento + breaking changes):**
A pasta `src/shared/ui` é um embrião. Para evoluir isso para uma biblioteca corporativa, os próximos passos seriam:
1. Extrair os componentes para um pacote NPM privado no contexto corporativo.
2. Instaurar **Storybook** para documentação interativa e desenvolvimento isolado de páginas.
3. Adicionar testes de regressão visual automatizados (ex: Chromatic).
4. **Governança:** Usar *Semantic Versioning (SemVer)*. Atualizações de cor/layout sobem como `patch` ou `minor`, enquanto remoção ou alteração de propriedades (ex: renomear `variant` para `colorType`) geram um `major` (*breaking change*), permitindo que os times consumidores atualizem a biblioteca no seu próprio ritmo.

## 🌐 7. SEO Técnico

**SEO técnico: Se isso virasse Next.js, o que você faria diferente para SEO e performance?**
1. **Server-Side Rendering (SSR):** A lista inicial do catálogo viria renderizada do servidor (React Server Components ou `getServerSideProps`), garantindo que crawlers indexem os produtos instantaneamente e melhorando o *Largest Contentful Paint (LCP)*.
2. **Roteamento Dinâmico para SEO:** Em vez de usar um modal para detalhes do item, eu criaria rotas dinâmicas (ex: `/product/:id`) para cada produto.
3. **Metadados e OpenGraph:** Utilizaria a API de metadata do Next para gerar `title`, `description` e *OG Tags* exclusivas para cada produto, otimizando o compartilhamento em redes sociais e buscas.
