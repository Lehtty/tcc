# Relatório de Implementação dos Requisitos de Segurança e Esteganografia

Este documento detalha o status de desenvolvimento, a implementação técnica e o funcionamento prático dos requisitos de fachada, esteganografia, anti-forense e volatilidade definidos para a plataforma **MODEXA**.

---

## Link do video

https://youtu.be/dp7AgsY19Go

## Tecnologias Utilizadas e Onde São Aplicadas

Para viabilizar os requisitos de fachada, esteganografia e anti-forense, as seguintes tecnologias e APIs nativas foram utilizadas:

1. **HTML5 & CSS3 (Vanilla)**
   - **Onde:** Páginas de interface da loja ([index.html](tcc/public/index.html), [products.html](tcc/public/products.html), [product.html](tcc/public/product.html)).
   - **Objetivo:** Construção da fachada visual de e-commerce responsiva e simulação realista de compras.

2. **Vanilla JavaScript (ES6+)**
   - **Onde:** Todo o diretório de scripts da aplicação ([src/js/](tcc/src/js/)).
   - **Objetivo:** Lógica de negócio, roteamento dinâmico, alternância de temas e manipulação de estado em tempo de execução sem dependências ou frameworks externos.

3. **Web Crypto API (Nativa do Navegador)**
   - **Onde:** No script de segurança ([security.js](tcc/src/js/security.js)).
   - **Objetivo:** Geração de chaves criptográficas e cifragem simétrica de dados em tempo de execução usando o algoritmo **AES-GCM de 256 bits**.

4. **History API (HTML5)**
   - **Onde:** No gerenciamento de histórico e navegação ([security.js](tcc/src/js/security.js)).
   - **Objetivo:** Execução de `window.history.replaceState()` e `window.history.pushState()` para manipulação do histórico de navegação (`Ctrl+H`) e neutralização do botão "Voltar".

5. **DOM API & Event Listeners (Eventos de Toque/Mouse)**
   - **Onde:** No script de esteganografia comportamental ([steganography.js](tcc/src/js/steganography.js)).
   - **Objetivo:** Captura de eventos (`mousedown`/`mouseup`/`mouseleave` e `touchstart`/`touchend`/`touchcancel`) para detecção do pressionamento prolongado (Long Press de 4 segundos) no logotipo.

6. **In-Memory Storage (RAM Volátil & Session-Scoped)**
   - **Onde:** Armazenamento de estado da denúncia em ([security.js](tcc/src/js/security.js)) e do carrinho de compras em ([cart.js](tcc/src/js/cart.js)) com espelhamento temporário em `sessionStorage`.
   - **Objetivo:** Garantir a volatilidade absoluta das informações digitadas e configuradas pela usuária, sem persistência em cookies ou no disco rígido do dispositivo.

---

## Tabela Resumo dos Requisitos

| Requisito | Descrição | Status | Arquivos Envolvidos |
| :--- | :--- | :--- | :--- |
| **R1** | Interface de Fachada Estática | **Implementado (Expandido)** | `public/index.html`<br>`public/products.html`<br>`public/product.html`<br>`src/js/main.js` |
| **R2** | Gatilho por Esteganografia Comportamental (Long Press) | **Implementado** | `src/js/steganography.js`<br>`src/js/cart.js` |
| **R3** | Manipulação Imediata de Histórico | **Implementado** | `src/js/security.js` |
| **R4** | Gatilho de Saída de Emergência (Panic Exit) | **Implementado** | `src/js/security.js` |
| **R5** | Volatilidade Total de Dados | **Implementado** | `src/js/security.js`<br>`src/js/cart.js` |

---

##  Análise Detalhada dos Requisitos

### R1 – Interface de Fachada Estática
> **Requisito:** Desenvolver uma página simples de e-commerce (HTML/CSS) que sirva apenas como cenário visual, sem necessidade de filtros ou carrinhos complexos.

* **Status:** **Implementado (e Expandido)**
* **Como foi implementado (Técnico):** 
  A plataforma foi desenvolvida utilizando HTML5 e CSS3 vanilla para simular um comércio eletrônico real de vestuário. Ela vai além de uma fachada estática básica:
  * Carrega dinamicamente uma coleção de produtos mapeada em JavaScript (`src/js/products.js`).
  * Possui rotas de catálogo completo (`public/products.html`) e detalhes do produto (`public/product.html`).
  * Conta com um sistema de filtragem de categoria (Todos, Feminino, Masculino) e ordenação por preço (Menor para Maior / Maior para Menor).
  * Conta com um sistema de carrinho em memória (`src/js/cart.js`) capaz de acumular itens e calcular o preço total.
  * Implementa rotação dinâmica e aleatória de folhas de estilo CSS (`src/js/main.js`), garantindo que a loja pareça autêntica, com designs que mudam dinamicamente.
* **Como funciona na prática:**
  Ao abrir o arquivo `public/index.html` em qualquer navegador, a usuária é recebida por um e-commerce funcional. Ela pode rolar pelos destaques, clicar no catálogo, filtrar os itens e clicar em um produto específico para ver seus detalhes, selecionar tamanhos, cores e quantidade de peças.

---

### R2 – Gatilho por Esteganografia Comportamental (Long Press)
> **Requisito:** Implementar um detector de eventos de pressão prolongada em um elemento da interface (ex: o logotipo da loja), que ative a transição silenciosa para o formulário de denúncia após 3 ou 5 segundos.

* **Status:** **Implementado**
* **Como foi implementado (Técnico):**
  * O detector de pressão prolongada está presente em `src/js/steganography.js`, monitorando eventos de mouse (`mousedown`/`mouseup`/`mouseleave`) e de toque (`touchstart`/`touchend`/`touchcancel`) no logotipo principal da loja (`#shop-logo` ou `.logo`) com duração de **4 segundos** (`PRESS_DURATION = 4000`).
  * Conforme a arquitetura esteganográfica do projeto, o long press ativa/desativa o "Modo de Níveis de Ameaça" (`window.showThreatLevels = true/false`), revelando as correspondências de nível de perigo nas cores dos produtos.
  * Isso permite que os parâmetros da denúncia sejam codificados de forma esteganográfica na própria "compra" (carrinho de produtos), e o formulário secreto de relato seja acessado e submetido ao clicar em **"Finalizar Compra"** (`src/js/cart.js`).
* **Como funciona na prática:**
  1. A usuária acessa a página de detalhes de um produto (ex: *Vestido Floral Verão*).
  2. Pressiona e segura o logotipo **MODEXA** por **4 segundos** para ativar discretamente a esteganografia comportamental na interface.
  3. Com o modo ativo, ela seleciona as opções do produto (como cor, tamanho e quantidade) para codificar a gravidade e o tipo de violência.
  4. Adiciona o produto ao carrinho e clica em **"Finalizar Compra"** para acessar o formulário camuflado de denúncia, consolidando os parâmetros selecionados na compra.

---

### R3 – Manipulação Imediata de Histórico
> **Requisito:** Garantir que a abertura do formulário utilize window.history.replaceState(), impedindo que o agressor encontre a página de denúncia ao clicar em "Voltar".

* **Status:** **Implementado**
* **Como foi implementado (Técnico):**
  Na função `triggerSecureForm()` do script `src/js/security.js`, assim que o formulário camuflado de denúncia é renderizado sobre a tela, o sistema manipula a pilha de navegação usando a `History API` do HTML5:
  ```javascript
  const harmlessUrl = getHarmlessUrl();
  try {
      window.history.replaceState({ secureFormActive: false }, '', harmlessUrl);
      window.history.pushState({ secureFormActive: true }, '', harmlessUrl);
  } catch (e) { ... }
  ```
  A URL exposta na barra do navegador permanece um endereço inofensivo (como `/produtos`, `/product.html` ou `/products.html`), e não uma rota suspeita de denúncia. Adicionalmente, caso o usuário pressione o botão de voltar, o evento `popstate` é capturado globalmente para acionar instantaneamente a saída de pânico, impedindo o retorno visual à tela de denúncia.
* **Como funciona na prática:**
  Quando a usuária clica em "Finalizar Compra" e a interface camuflada de conformidade de cookies (o formulário oculto de denúncia) surge na tela, a barra de endereços do navegador continua exibindo a URL inofensiva da loja. Se alguém tentar clicar no botão "Voltar" do navegador ou se o agressor pegar o celular e tentar retornar a navegação, a página é imediatamente fechada e o navegador é redirecionado para o buscador do Google, sem deixar rastro da tela de denúncia no histórico de navegação.

---

### R4 – Gatilho de Saída de Emergência (Panic Exit)
> **Requisito:** Implementar um botão flutuante ou tecla de atalho (Esc) que redirecione instantaneamente para um site neutro (ex: G1 ou Google).

* **Status:** **Implementado**
* **Como foi implementado (Técnico):**
  * O redirecionamento de pânico e limpeza está implementado no script `src/js/security.js` sob a função `executePanicExit()`. Ela remove o formulário do DOM, reexibe a vitrine original limpa, limpa a RAM/carrinho e executa `window.location.replace("https://www.google.com")`.
  * Um **botão flutuante de emergência** (`#panic-exit-button`) é injetado dinamicamente no canto inferior direito de todas as páginas da loja. Ele exibe um símbolo de alerta (`⚠️`) e aciona a saída de pânico imediatamente após o clique.
  * O script também registra um escutador global para a tecla de atalho **Escape (Esc)**, permitindo o redirecionamento imediato por teclado físico.
  * A saída de pânico também é executada na interceptação da navegação no histórico (evento `popstate`) e após o envio do formulário de denúncia.
* **Como funciona na prática:**
  Se a usuária estiver em qualquer página da loja (ou preenchendo o formulário camuflado) e o agressor se aproximar, ela pode simplesmente clicar no botão flutuante de alerta (`⚠️`) no canto inferior direito ou pressionar a tecla `Esc` no teclado. O sistema limpa imediatamente toda a RAM, esvazia o carrinho de compras e redireciona o navegador instantaneamente para o buscador do Google.

---

### R5 – Volatilidade Total de Dados
> **Requisito:** Configurar o formulário para que nenhuma informação seja salva no navegador (sem cookies ou LocalStorage), mantendo tudo em variáveis voláteis de JavaScript.

* **Status:** **Implementado**
* **Como foi implementado (Técnico):**
  * Todas as variáveis que guardam o estado da denúncia configurada (produto, cor, tamanho, quantidade) são mantidas estritamente em um objeto na memória RAM (`const appState` em `src/js/security.js`).
  * O formulário de preenchimento lê esses dados da RAM para exibi-los no painel de auditoria. A cifragem nativa (Web Crypto API AES-GCM) acontece também puramente em memória dinâmica.
  * O carrinho simulado é sincronizado na sessão via `sessionStorage` apenas para conveniência visual, sendo completamente apagado (`sessionStorage.removeItem('cart')`) e limpo da memória RAM assim que o fluxo é fechado ou o protocolo de pânico é disparado.
  * Não há nenhuma instrução de gravação em bancos de dados locais persistentes (como `localStorage` ou `IndexedDB`) ou em cookies do navegador.
* **Como funciona na prática:**
  Mesmo que a denúncia seja configurada no produto e o formulário de socorro seja exibido, se o agressor fechar a aba do navegador, fechar o navegador por completo ou forçar a saída, nenhum rastro do formulário preenchido ou do carrinho de compras restará gravado no computador ou celular da vítima. A memória RAM do processo do navegador é desalocada e os dados deixam de existir permanentemente.
