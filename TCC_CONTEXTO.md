# Resumo Executivo e Estrutural do TCC

## 1. Identificação Acadêmica e Tema

* **Instituição:** Centro Universitário Barriga Verde – UNIBAVE
* **Curso:** Sistemas de Informação (7ª Fase)
* **Disciplina:** Desenvolvimento de Protótipo
* **Orientador:** Prof. Ricardo A. Vargas Barbosa
* **Título do Trabalho:** *Desenvolvimento de Plataforma E-commerce Camuflada com Esteganografia Comportamental e Protocolos Anti-forense para Denúncia de Violência Doméstica*
* **Marca/Nome Fantasia da Aplicação:** MODEXA (ou ModaXpress) --Sujeito a mudanças


## 2. Contextualização e Justificativa (O Problema)

* **Vigilância e Controle Coercitivo:** Parceiros agressores comumente realizam perícias físicas e visuais nos dispositivos das vítimas (histórico de buscas, aplicativos instalados, consumo de dados).
* **Riscos das Soluções Tradicionais:** Aplicativos nativos dedicados à denúncia deixam ícones na gaveta de apps, exigem downloads rastreáveis em lojas (Google Play/App Store) e geram notificações suspeitas, o que eleva o risco físico para a vítima.
* **Cenário Estatístico Real:** Casos crescentes de violência doméstica no Brasil contrastados por altos índices de subnotificação gerada pelo medo de retaliação e pela falta de canais de socorro discretos.


## 3. Conceito Central do Protótipo (A Solução)

A solução consiste em uma aplicação web camuflada sob a fachada de um **e-commerce de roupas de apelo visual minimalista e genérico**. O trunfo da plataforma reside em não parecer um canal governamental ou emergencial. Ela opera em duas camadas paralelas:

1. **Camada Pública (Fachada):** Uma vitrine funcional de vestuário capaz de enganar o agressor caso este examine a tela do dispositivo.
2. **Camada Oculta (Esteganográfica):** Um sistema invisível ativado por padrões de comportamento da usuária que codificam e transmitem dados de socorro sem levantar suspeitas visuais.


## 4. Regras de Negócio e Mecanismos Técnicos

### 4.1 Esteganografia Comportamental (Mapeamento de Ações)

A inserção de informações na denúncia e os gatilhos para acionar telas de emergência acontecem por meio da interação padronizada da usuária com os produtos da loja:

* **Gatilho de Entrada Long-Press:** Segurar o dedo pressionado por um intervalo específico (ex: 3 a 5 segundos) sobre uma imagem ou elemento neutro para invocar o formulário sem cliques explícitos.
* **Mapeamento de Atributos:** As seleções comuns de compra convertem-se em dados sensíveis para as autoridades:
* **Seleção de Cor (ex: Vestido Vermelho):** Classifica o nível de risco ou perigo iminente (ex: presença de armas no local).
* **Seleção de Quantidade:** Indica a quantidade de pessoas envolvidas ou se há crianças no ambiente.
* **Seleção de Tamanhos (P, M, G):** Categoriza o tipo de violência sofrida (física, psicológica, patrimonial).


* **Feedback Visual Zero:** Durante interações esteganográficas (como o ato de segurar o dedo na imagem), nenhuma barra de progresso, som ou mudança drástica de cor deve ocorrer para evitar que um observador adjacente note anomalias.

### 4.2 Protocolos Anti-forense e Sigilo Digital

O sistema assume como premissa que **não há privacidade no dispositivo**. Portanto, foram adotadas as seguintes regras arquiteturais para mitigar o rastro local:

* **In-Memory Storage (Armazenamento em Volatilidade):** O carrinho de compras simulado e os dados parciais da denúncia são guardados puramente em variáveis de estado em memória RAM (JavaScript Objects). É terminantemente **proibido** o uso de `LocalStorage`, `SessionStorage` ou `Cookies`, garantindo que nada persista se a aba for fechada.
* **Manipulação de Histórico via History API:** No exato momento em que o formulário de preenchimento ou opções reais surgem na tela, o sistema executa o método `window.history.replaceState()`. Isso altera a URL exposta no navegador para um endereço genérico (ex: `/produtos` ou `/home`), impedindo que subpáginas de denúncia entrem na pilha do botão "Voltar" ou fiquem explícitas no histórico (`Ctrl + H`).
* **Protocolo de Saída de Emergência (Panic Exit):** Monitoramento contínuo de gatilhos físicos rápidos (tecla `Esc`, tecla `F4` ou clique rápido em qualquer área neutra do layout). Ao ser acionado, o JavaScript remove os elementos de denúncia do DOM instantaneamente e executa um redirecionamento forçado real (`window.location.href`) para portais de massa indestrutíveis ou buscas comuns (como o Google Shopping ou o Pinterest), exibindo um produto idêntico ao que estava na vitrine.
* **Política de Referência (Corte de Rastro):** Configuração da tag de cabeçalho `Referrer-Policy: no-referrer` para impedir que o servidor web de destino registre os metadados de origem da navegação da usuária.

### 4.3 Segurança dos Dados (Criptografia de Ponta a Ponta)

* **Web Crypto API:** Cifragem feita do lado do cliente (Client-Side). Os dados da denúncia coletados via formulário oculto são codificados nativamente no navegador através do método `window.crypto.subtle.encrypt` utilizando algoritmos robustos (como AES ou RSA). A mensagem já sai do celular ou computador da vítima totalmente cifrada, impedindo a interceptação por provedores de internet (ISP) locais ou redes Wi-Fi domésticas controladas.
