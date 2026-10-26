# tcc
TCC - Plataforma web segura com mecanismos de criptografia e camuflagem para mitigação de riscos digitais em contexto de violência domestica

---

# MODEXA — Plataforma E-commerce Camuflada para Denúncia Silenciosa

## 📚 Informações Acadêmicas e Contexto
* **Instituição:** Centro Universitário Barriga Verde – UNIBAVE
* **Curso:** Sistemas de Informação (8ª Fase)
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
2. **Camada Oculta (Esteganografia e Segurança):** Um fluxo secreto ativado por comportamentos de interação que traduz dados comerciais comuns em informações cruciais de emergência e as transmite sem levantar suspeitas.

---

## 🛠️ Regras de Negócio e Mecanismos Técnicos

### 1. Esteganografia Comportamental
Os dados de denúncia e pedidos de socorro são codificados e mapeados a partir de escolhas rotineiras na loja virtual:
* **Gatilho de Níveis de Ameaça:** Suporta dois métodos:
    1. **Duplo Clique**: Dê um duplo clique no logotipo principal (`MODE`<span>`XA`</span>) para ativar a exibição esteganográfica persistentemente. Para desativar, dê um único clique no logotipo.
    2. **Pressionamento Longo (4s)**: Toque ou clique e mantenha pressionado o logotipo por 4 segundos para ativar os níveis de ameaça temporariamente. O modo será desativado automaticamente assim que você soltar o clique/toque.
* **Revelação no Carrinho:** Pressionar e segurar um item do carrinho por 0,8 s mostra temporariamente as informações ocultas (risco, violência e pessoas) daquele item.
* **Mapeamento de Atributos do Carrinho:** A denúncia é montada a partir do carrinho no checkout. Cor e tamanho vêm do último produto inserido; a quantidade é a soma de todos os itens do carrinho:
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

### 2. Formulário de Entrega e Envio da Denúncia
* Ao clicar em **"Finalizar Compra"**, o carrinho dá lugar a um formulário comum de **"Dados de Entrega"** com os campos **Nome completo**, **CEP**, **Endereço**, **Número e Complemento** e **Telefone de Contato**. Nome, CEP, endereço e número são obrigatórios.
* Ao clicar em **"Confirmar Pedido e Concluir"**, a função `sendSilentReport` (`src/js/security.js`) monta um JSON com nível de risco, tipo de violência, pessoas no local, nome completo, endereço completo e data/hora, e o envia por `fetch` (HTTPS, `keepalive`) ao serviço **formsubmit.co**, que repassa o relato por e-mail.
* O envio só é considerado concluído quando a resposta tem `res.ok` e `success: true`. Nesse caso, o carrinho é esvaziado e aparece *"Pedido realizado com sucesso! Enviamos a confirmação para seu e-mail."*. Se o envio falhar, o carrinho e a seleção são mantidos e aparece *"Não foi possível finalizar o pedido. Verifique sua conexão e tente novamente."*, uma mensagem comum de loja.
* **Limitação:** os dados não são cifrados no navegador; a proteção em trânsito é a do HTTPS. O payload envia `_captcha: "false"`, então qualquer pessoa que leia o código pode enviar mensagens ao endpoint.

### 3. Protocolos Anti-forense e Sigilo Digital
* **Armazenamento Volátil:** O estado da denúncia em andamento fica apenas em memória (`appState` em `src/js/security.js`). O carrinho e o tema visual são espelhados no `sessionStorage`, que é descartado ao fechar a aba. Não são usados cookies, `localStorage` nem `IndexedDB`.
* **Manipulação de Histórico:** Somente depois que o envio é confirmado, o sistema usa a `History API` (`replaceState`/`pushState`) para trocar a URL exibida por `products.html` (ou `product.html`/`products.html` quando aberto via `file://`) e arma a saída de pânico no botão "Voltar" (`appState.historyArmed = true`). Se o envio falhar, o histórico não é alterado e o "Voltar" funciona normalmente.
* **Saída de Pânico (Panic Exit):** Acionada pelo botão flutuante 💬 (disfarçado de "Suporte / Reportar erro"), pela tecla `Esc` ou pelo botão "Voltar" (`popstate`), este último apenas depois de uma denúncia enviada ou com o modo de níveis de ameaça ligado. A página é substituída por uma tela de carregamento com título da SHEIN; `localStorage`, `sessionStorage`, cookies, estado em memória e carrinho são limpos; o Cache Storage é apagado e o service worker é desregistrado (espera máxima de 400 ms); por fim, a aba é redirecionada com `window.location.replace` para a página do mesmo produto na **SHEIN** (`panicUrl`), para a categoria feminina (`panicFallbackUrl`) ou para `br.shein.com`.
* **Limitações:** o histórico anterior ao pânico não pode ser apagado por script, e o ícone do app permanece na tela se o PWA tiver sido instalado.

---

## 📂 Estrutura de Diretórios e Componentes

* [public/](public/) - Páginas HTML (Fachada Pública)
  * [index.html](public/index.html) - Página inicial da loja virtual (Vitrine Principal)
  * [products.html](public/products.html) - Catálogo geral de produtos com filtros e ordenação
  * [product.html](public/product.html) - Tela de detalhes do produto (onde são selecionados atributos)
* [src/](src/) - Código-fonte da aplicação
  * [js/](src/js/) - Scripts JavaScript com a lógica de negócio
    * [products.js](src/js/products.js) - Banco de dados simulado de produtos (Atributos e metadados)
    * [cart.js](src/js/cart.js) - Carrinho de compras, formulário de Dados de Entrega e checkout
    * [security.js](src/js/security.js) - Envio da denúncia (formsubmit.co), manipulação de histórico e Panic Exit
    * [steganography.js](src/js/steganography.js) - Mapeamentos de cor/tamanho/quantidade e gatilhos no logotipo
    * [main.js](src/js/main.js) - Inicialização da loja, temas aleatórios por sessão, carrossel e registro do service worker
  * [assets/](src/assets/) - Estilos (3 temas + carrossel), imagens dos produtos e ícones
* [manifest.json](manifest.json) e [sw.js](sw.js) - PWA (manifesto e service worker com cache)

---

## 🚀 Como Executar e Testar o Protótipo
1. Abra o arquivo [public/index.html](public/index.html) em um navegador web. Para usar o PWA (service worker), sirva a raiz do repositório em um servidor estático, por exemplo `python -m http.server 8765`, e acesse `http://localhost:8765/public/index.html`.
2. Navegue pelos produtos do catálogo ou clique em um deles para visualizar seus detalhes. A categoria Masculino não tem produtos e exibe *"No momento, não há produtos disponíveis nesta categoria."*.
3. Para ativar a exibição dos níveis de ameaça (esteganografia reversa nas cores), você pode:
   * **Opção 1**: Dar um duplo clique na logo **MODEXA** no cabeçalho. O aviso visual surgirá na tela e as opções de cores exibirão os níveis de risco. Para desativar, clique uma vez na logo.
   * **Opção 2**: Clicar e segurar a logo **MODEXA** por 4 segundos. Os níveis de ameaça ficarão visíveis e serão desativados assim que você soltar a logo.
4. Fluxo de envio da denúncia:
   * Escolha as opções de cor, tamanho e quantidade do produto para representar a sua situação de perigo.
   * Adicione o item ao carrinho e clique em **"Finalizar Compra"**.
   * Preencha o formulário **"Dados de Entrega"** (nome completo, CEP, endereço, número e telefone).
   * Clique em **"Confirmar Pedido e Concluir"**. Com envio bem-sucedido, aparece a mensagem de pedido realizado e o carrinho é esvaziado; a partir daí, o botão "Voltar" aciona a saída de pânico. Com falha, aparece o aviso para tentar novamente e o carrinho é mantido.
5. Saída de pânico: clique no botão flutuante 💬 ou pressione `Esc` em qualquer página. A aba é limpa e redirecionada para a SHEIN.
