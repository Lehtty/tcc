# Relatório de Implementação dos Requisitos de Segurança e Esteganografia

Este documento detalha o status de desenvolvimento, a implementação técnica e o funcionamento prático dos requisitos de fachada, esteganografia, anti-forense e volatilidade definidos para a plataforma **MODEXA**.

---

## Link do video

https://youtu.be/dp7AgsY19Go

## Tecnologias Utilizadas e Onde São Aplicadas

Para viabilizar os requisitos de fachada, esteganografia e anti-forense, as seguintes tecnologias e APIs nativas foram utilizadas:

1. **HTML5 & CSS3 (Vanilla)**
   - **Onde:** Páginas de interface da loja ([index.html](public/index.html), [products.html](public/products.html), [product.html](public/product.html)) e folhas de estilo em [src/assets/styles/](src/assets/styles/).
   - **Objetivo:** Construção da fachada visual de e-commerce responsiva e simulação realista de compras.

2. **Vanilla JavaScript (ES6+)**
   - **Onde:** Todo o diretório de scripts da aplicação ([src/js/](src/js/)).
   - **Objetivo:** Lógica de negócio, alternância de temas e manipulação de estado em tempo de execução, sem dependências ou frameworks externos.

3. **Fetch API + formsubmit.co**
   - **Onde:** Na função `sendSilentReport` do script de segurança ([security.js](src/js/security.js)).
   - **Objetivo:** Envio do relato em JSON, por HTTPS e com `keepalive`, ao endpoint `https://formsubmit.co/ajax/...`, que o repassa por e-mail. O envio só conta como concluído com `res.ok` e `success: true` na resposta. Os dados não são cifrados no navegador; a proteção em trânsito é a do HTTPS.

4. **History API (HTML5)**
   - **Onde:** No fluxo de envio ([security.js](src/js/security.js)).
   - **Objetivo:** Execução de `window.history.replaceState()` e `window.history.pushState()` após o envio confirmado, trocando a URL exibida por uma página comum da loja e armando a saída de pânico no botão "Voltar".

5. **DOM API & Event Listeners (Eventos de Toque/Mouse/Teclado)**
   - **Onde:** No script de esteganografia comportamental ([steganography.js](src/js/steganography.js)), no carrinho ([cart.js](src/js/cart.js)) e no script de segurança ([security.js](src/js/security.js)).
   - **Objetivo:** Detecção do duplo clique e do pressionamento prolongado (4 segundos) no logotipo, do pressionamento prolongado (0,8 s) nos itens do carrinho, da tecla `Esc` e do evento `popstate`.

6. **Armazenamento Volátil (Memória + `sessionStorage`)**
   - **Onde:** Estado da denúncia em ([security.js](src/js/security.js)), carrinho em ([cart.js](src/js/cart.js)) e tema visual em ([main.js](src/js/main.js)).
   - **Objetivo:** Manter os dados apenas durante a sessão da aba, sem cookies, `localStorage` ou `IndexedDB`.

7. **PWA (Web App Manifest + Service Worker + Cache Storage)**
   - **Onde:** [manifest.json](manifest.json) e [sw.js](sw.js), registrado em [main.js](src/js/main.js).
   - **Objetivo:** Permitir instalar a loja como aplicativo e manter cópias em cache das páginas e recursos. A saída de pânico apaga o Cache Storage e desregistra o service worker.

---

## Tabela Resumo dos Requisitos

| Requisito | Descrição | Status | Arquivos Envolvidos |
| :--- | :--- | :--- | :--- |
| **R1** | Interface de Fachada Estática | **Implementado (Expandido)** | `public/index.html`<br>`public/products.html`<br>`public/product.html`<br>`src/js/main.js` |
| **R2** | Gatilho por Esteganografia Comportamental (Long Press) | **Implementado (Adaptado)** | `src/js/steganography.js`<br>`src/js/cart.js` |
| **R3** | Manipulação de Histórico | **Implementado (após o envio confirmado)** | `src/js/security.js` |
| **R4** | Gatilho de Saída de Emergência (Panic Exit) | **Implementado** | `src/js/security.js` |
| **R5** | Volatilidade dos Dados | **Implementado (com `sessionStorage`)** | `src/js/security.js`<br>`src/js/cart.js`<br>`src/js/main.js` |

---

##  Análise Detalhada dos Requisitos

### R1 – Interface de Fachada Estática
> **Requisito:** Desenvolver uma página simples de e-commerce (HTML/CSS) que sirva apenas como cenário visual, sem necessidade de filtros ou carrinhos complexos.

* **Status:** **Implementado (e Expandido)**
* **Como foi implementado (Técnico):** 
  A plataforma foi desenvolvida utilizando HTML5 e CSS3 vanilla para simular um comércio eletrônico real de vestuário. Ela vai além de uma fachada estática básica:
  * Carrega dinamicamente uma coleção de 10 produtos femininos mapeada em JavaScript (`src/js/products.js`).
  * Possui página de catálogo completo (`public/products.html`) e de detalhes do produto (`public/product.html`).
  * Conta com filtragem por categoria (Todos, Feminino, Masculino) e ordenação por preço (Menor para Maior / Maior para Menor). A categoria Masculino não tem produtos cadastrados e exibe *"No momento, não há produtos disponíveis nesta categoria."*.
  * Conta com um carrinho (`src/js/cart.js`) capaz de acumular itens e calcular o preço total, seguido de um formulário de **Dados de Entrega**.
  * Sorteia, a cada sessão, uma de três folhas de estilo e uma de três paletas/layouts (`src/js/main.js`), garantindo que a loja pareça autêntica, com designs que mudam dinamicamente.
* **Como funciona na prática:**
  Ao abrir `public/index.html` no navegador, a usuária é recebida por um e-commerce funcional. Ela pode rolar pelos destaques, clicar no catálogo, filtrar os itens e clicar em um produto específico para ver seus detalhes, selecionar tamanhos, cores e quantidade de peças.

---

### R2 – Gatilho por Esteganografia Comportamental (Long Press)
> **Requisito:** Implementar um detector de eventos de pressão prolongada em um elemento da interface (ex: o logotipo da loja), que ative a transição silenciosa para o formulário de denúncia após 3 ou 5 segundos.

* **Status:** **Implementado (Adaptado)**
* **Como foi implementado (Técnico):**
  * O detector de pressão prolongada está em `src/js/steganography.js`, monitorando eventos de mouse (`mousedown`/`mouseup`/`mouseleave`) e de toque (`touchstart`/`touchend`/`touchcancel`) nos elementos `.logo` com duração de **4 segundos** (`PRESS_DURATION = 4000`). O modo fica ativo enquanto o logotipo é segurado e é desativado ao soltar.
  * Um **duplo clique** no logotipo ativa o modo de forma persistente; um clique simples o desativa.
  * Em vez de abrir um formulário separado, o gatilho ativa o "Modo de Níveis de Ameaça" (`window.showThreatLevels = true/false`), que revela o significado oculto das cores, tamanhos e quantidades na página do produto e no carrinho.
  * No carrinho, segurar um item por **0,8 s** revela temporariamente as informações ocultas daquele item.
  * Os parâmetros da denúncia ficam codificados na própria "compra": cor e tamanho do último item do carrinho e a quantidade total de itens. O envio acontece pelo formulário comum de entrega, acessado em **"Finalizar Compra"** (`src/js/cart.js`).
* **Como funciona na prática:**
  1. A usuária acessa a página de detalhes de um produto.
  2. Pressiona e segura o logotipo **MODEXA** por **4 segundos** (ou dá um duplo clique) para ver os níveis de ameaça na interface.
  3. Seleciona cor, tamanho e quantidade para codificar a gravidade, o tipo de violência e as pessoas no local.
  4. Adiciona o produto ao carrinho, clica em **"Finalizar Compra"**, preenche os **Dados de Entrega** (nome completo, CEP, endereço, número e telefone) e clica em **"Confirmar Pedido e Concluir"**.

---

### R3 – Manipulação de Histórico
> **Requisito:** Garantir que a abertura do formulário utilize window.history.replaceState(), impedindo que o agressor encontre a página de denúncia ao clicar em "Voltar".

* **Status:** **Implementado (após o envio confirmado)**
* **Como foi implementado (Técnico):**
  Na função `sendSilentReport()` de `src/js/security.js`, o histórico só é manipulado depois que o envio é confirmado pelo servidor:
  ```javascript
  if (!delivered) {
      // mantém carrinho e seleção e mostra o aviso de erro
      return false;
  }

  const harmlessUrl = getHarmlessUrl();
  try {
      window.history.replaceState({ activeFlow: false }, '', harmlessUrl);
      window.history.pushState({ activeFlow: true }, '', harmlessUrl);
      appState.historyArmed = true;
  } catch (e) { ... }
  ```
  `getHarmlessUrl()` devolve `products.html` (ou `product.html`/`products.html` quando o site é aberto via `file://`), um caminho relativo a uma página que existe, de modo que os links da loja continuam funcionando. Um ouvinte global de `popstate` chama a saída de pânico apenas se `appState.historyArmed` for verdadeiro ou se o modo de níveis de ameaça estiver ligado; a navegação comum na loja, como os filtros do catálogo (que usam `replaceState`), não aciona o pânico.
* **Como funciona na prática:**
  Depois de um pedido enviado com sucesso, a barra de endereços mostra uma página comum do catálogo. Se alguém apertar "Voltar", a saída de pânico é acionada e a aba vai para a SHEIN. Se o envio falhar, o histórico não é alterado, o carrinho é mantido e o "Voltar" funciona normalmente, para que a usuária possa tentar de novo.

---

### R4 – Gatilho de Saída de Emergência (Panic Exit)
> **Requisito:** Implementar um botão flutuante ou tecla de atalho (Esc) que redirecione instantaneamente para um site neutro (ex: G1 ou Google).

* **Status:** **Implementado**
* **Como foi implementado (Técnico):**
  * A saída de pânico está em `executePanicExit()` (`src/js/security.js`). Ela substitui a página por uma tela de "Carregando..." com título e ícone da SHEIN, limpa `localStorage`, `sessionStorage`, cookies, o estado em memória (`appState`) e o carrinho, apaga o Cache Storage e desregistra o service worker (esperando no máximo 400 ms) e executa `window.location.replace()`.
  * O destino é a página do mesmo produto na SHEIN (`panicUrl`), a categoria feminina da SHEIN (`panicFallbackUrl`) ou, fora de uma página de produto, `https://br.shein.com/`.
  * Um **botão flutuante** (`#panic-exit-button`) é injetado no canto inferior direito de todas as páginas, disfarçado de suporte: exibe `💬` e tem o título "Suporte / Reportar erro".
  * Um escutador global da tecla **Escape (Esc)** aciona a saída de pânico pelo teclado.
  * O evento `popstate` ("Voltar") também aciona a saída, mas apenas após uma denúncia enviada ou com o modo de níveis de ameaça ligado (ver R3).
* **Como funciona na prática:**
  Se a usuária estiver em qualquer página da loja e o agressor se aproximar, ela pode clicar no botão 💬 ou pressionar `Esc`. O sistema limpa os dados da sessão e redireciona a aba para uma página de roupas da SHEIN, simulando uma navegação comum por compras.

---

### R5 – Volatilidade dos Dados
> **Requisito:** Configurar o formulário para que nenhuma informação seja salva no navegador (sem cookies ou LocalStorage), mantendo tudo em variáveis voláteis de JavaScript.

* **Status:** **Implementado (com `sessionStorage`)**
* **Como foi implementado (Técnico):**
  * O estado da denúncia (produto, cor, tamanho, quantidade) fica apenas em memória, no objeto `appState` de `src/js/security.js`.
  * Os campos do formulário de entrega (nome, CEP, endereço, número e telefone) são lidos no momento do envio e não são gravados no navegador.
  * O carrinho é espelhado no `sessionStorage` para sobreviver à troca de páginas, e o tema sorteado também fica no `sessionStorage`. Após um envio bem-sucedido o carrinho é apagado (`sessionStorage.removeItem('cart')`); na saída de pânico todo o `sessionStorage` é limpo.
  * Não há gravação em cookies, `localStorage` ou `IndexedDB`.
* **Como funciona na prática:**
  Ao fechar a aba, o `sessionStorage` é descartado e não restam no aparelho dados do carrinho ou do formulário. Continuam como limitações: o histórico de navegação anterior ao pânico, que não pode ser apagado por script, e o ícone do app, se o PWA tiver sido instalado.
