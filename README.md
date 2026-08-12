# tcc
TCC - Plataforma web segura com mecanismos de criptografia e camuflagem para mitigação de riscos digitais em contexto de violência domestica

---

# MODEXA — Plataforma E-commerce Camuflada para Denúncia Silenciosa

## 📚 Informações Acadêmicas e Contexto
* **Instituição:** Centro Universitário Barriga Verde – UNIBAVE
* **Curso:** Sistemas de Informação (7ª Fase)
* **Disciplina:** Desenvolvimento de Protótipo
* **Orientador:** Prof. Ricardo A. Vargas Barbosa
* **Título do Trabalho:** *Desenvolvimento de Plataforma E-commerce Camuflada com Esteganografia Comportamental e Protocolos Anti-forense para Denúncia de Violência Doméstica*
* **Marca / Nome Fantasia:** MODEXA (ModaXpress) --Sujeito a mudanças--

---

## 💡 Sobre o Projeto
O projeto consiste em uma aplicação web de comércio eletrônico de roupas, com apelo visual minimalista e funcional, que atua como **fachada e camuflagem** para um canal secreto de denúncia e socorro para vítimas de violência doméstica. 

A premissa do projeto baseia-se na realidade de que agressores frequentemente exercem controle coercitivo sobre os dispositivos das vítimas (fiscalizando histórico, aplicativos e conversas). Ao invés de um aplicativo dedicado à denúncia (que deixaria rastros visíveis), a vítima acessa uma loja virtual comum de vestuário.

O sistema opera em duas camadas paralelas:
1. **Camada Pública (Loja Virtual/Fachada):** Vitrine funcional que exibe produtos, permite selecionar cores, tamanhos e quantidades, e adicioná-los a um carrinho de compras.
2. **Camada Oculta (Esteganografia e Segurança):** Um fluxo secreto ativado por comportamentos de interação que traduz dados comerciais comuns em informações cruciais de emergência, cifrando e transmitindo os dados sem levantar suspeitas.

---

## 🛠️ Regras de Negócio e Mecanismos Técnicos

### 1. Esteganografia Comportamental
Os dados de denúncia e pedidos de socorro são codificados e mapeados a partir de escolhas rotineiras na loja virtual:
* **Gatilho de Níveis de Ameaça:** Suporta dois métodos:
    1. **Duplo Clique**: Dê um duplo clique no logotipo principal (`MODE`<span>`XA`</span>) para ativar a exibição esteganográfica persistentemente. Para desativar, dê um único clique no logotipo.
    2. **Pressionamento Longo (4s)**: Toque ou clique e mantenha pressionado o logotipo por 4 segundos para ativar os níveis de ameaça temporariamente. O modo será desativado automaticamente assim que você soltar o clique/toque.
* **Mapeamento de Atributos do Carrinho:** O fechamento e envio da denúncia é disparado silenciosamente ao clicar em **"Finalizar Compra"** no carrinho de compras. Os dados transmitidos são baseados no último produto inserido:
  * **Cor do Produto (Nível de Risco/Presença de Armas):**
    * `#2c2c2a` (Preto) ➔ Nível Vermelho (Risco Extremo - Presença de Armas de Fogo no Local)
    * `#c4705a` (Rosa) ➔ Nível Laranja (Risco Alto - Ameaça Física / Agressor no Local)
    * Outras cores mapeadas para Níveis de Risco Moderado ou Inicial (Discussão Verbal, Controle Coercitivo, Tensão Elevada).
  * **Tamanho do Produto (Tipo de Violência):**
    * `P` ou `36`/`38` ➔ Violência Psicológica e Moral (Ameaças, Humilhações, Controle Coercitivo)
    * `M` ou `40`/`42` ➔ Violência Patrimonial e Sexual (Danos Materiais, Retenção de Documentos, Abuso)
    * `G` / `GG` ou `44` ➔ Violência Física e Corporal (Agressão Direta, Empurrões, Lesão Corporal)
  * **Quantidade de Itens (Presença de Dependentes):**
    * `1` item ➔ Apenas Vítima e Agressor (Sem crianças/dependentes no local)
    * `2` itens ➔ Presença de 1 Criança/Dependente no ambiente da agressão
    * `3` itens ➔ Presença de 2 Crianças/Dependentes no ambiente da agressão
    * `4+` itens ➔ Múltiplas Testemunhas ou presença de mais crianças no local

### 2. Cifragem Local de Ponta a Ponta (Web Crypto API)
* Ao clicar em "Finalizar Compra", surge um formulário camuflado como **"Configurações de Privacidade do Navegador / Conformidade de Cookies"** contendo as informações de risco pré-mapeadas e um campo para o relato técnico complementar (endereço completo e descrição).
* O sistema cria um objeto JSON e realiza a cifragem simétrica de forma nativa no navegador (Client-Side) utilizando a **Web Crypto API (algoritmo AES-GCM de 256 bits)**. A chave simétrica e o vetor de inicialização (IV) são gerados em RAM.
* Um painel de auditoria integrado (voltado para a banca avaliadora do TCC) expõe o JSON em texto plano, a chave simétrica exportada no formato JWK, o IV e o Ciphertext resultante em Base64 em tempo real.

### 3. Protocolos Anti-forense e Sigilo Digital
* **In-Memory Storage (RAM Only):** Os dados temporários do carrinho e o estado da denúncia em andamento são mantidos estritamente na memória volátil do JavaScript (RAM). Não são gravados cookies persistentes, `LocalStorage` ou `IndexedDB` que possam ser posteriormente examinados pelo agressor.
* **Manipulação de Histórico:** O sistema utiliza a `History API` (`replaceState`/`pushState`) para alterar a URL exibida na barra do navegador para endereços inofensivos (como `/produtos` ou `products.html`), ocultando o acesso a fluxos de emergência no histórico (`Ctrl + H`) e inutilizando o botão "Voltar".
* **Saída de Pânico (Panic Exit):** Monitoramento contínuo de gatilhos como o botão "Voltar" (`popstate`) ou a submissão do formulário seguro. Em frações de segundo, todos os elementos visuais da denúncia são expurgados do DOM, o estado da RAM é limpo e a aba do navegador é redirecionada de forma forçada (`window.location.replace`) para o buscador do Google, simulando uma navegação comum por compras femininas.
* **Política de Referência:** Cabeçalho e tag `no-referrer` são empregados para remover metadados de origem de navegação, dificultando rastreamentos adicionais.

---

## 📂 Estrutura de Diretórios e Componentes

* [public/](public/) - Páginas HTML (Fachada Pública)
  * [index.html](public/index.html) - Página inicial da loja virtual (Vitrine Principal)
  * [products.html](public/products.html) - Catálogo geral de produtos com filtros e ordenação
  * [product.html](public/product.html) - Tela de detalhes do produto (onde são selecionados atributos)
* [src/](src/) - Código-fonte da aplicação
  * [js/](src/js/) - Scripts JavaScript com a lógica de negócio
    * [products.js](src/js/products.js) - Banco de dados simulado de produtos (Atributos e metadados)
    * [cart.js](src/js/cart.js) - Lógica do carrinho de compras em memória e gatilho de checkout
    * [security.js](src/js/security.js) - Lógica anti-forense, formulário de denúncia cifrada (AES-GCM) e Panic Exit
    * [steganography.js](src/js/steganography.js) - Manipulação dos eventos de interação e ativação de níveis de risco
    * [main.js](src/js/main.js) - Inicialização da loja e alternância dinâmica de estilos/temas

---

## 🚀 Como Executar e Testar o Protótipo
1. Abra o arquivo [public/index.html](public/index.html) em um navegador web.
2. Navegue pelos produtos do catálogo ou clique em um deles para visualizar seus detalhes.
3. Para ativar a exibição dos níveis de ameaça (esteganografia reversa nas cores), você pode:
   * **Opção 1**: Dar um duplo clique na logo **MODEXA** no cabeçalho. O aviso visual surgirá na tela e as opções de cores exibirão os níveis de risco. Para desativar, clique uma vez na logo.
   * **Opção 2**: Clicar e segurar a logo **MODEXA** por 4 segundos. Os níveis de ameaça ficarão visíveis e serão desativados assim que você soltar a logo.
4. Fluxo de envio de denúncia cifrada:
   * Escolha as opções de cor, tamanho e quantidade do produto para representar a sua situação de perigo.
   * Adicione o item ao carrinho e clique em **"Finalizar Compra"**.
   * O formulário secreto de privacidade será exibido na tela, contendo os dados traduzidos na seção de auditoria e permitindo escrever o endereço de socorro no campo "Relato Técnico".
   * Clique em **"Salvar Preferências e Enviar"**. A tela mostrará a denúncia enviada e redirecionará a aba instantaneamente para o buscador do Google.
