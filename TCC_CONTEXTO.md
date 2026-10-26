# Resumo Executivo e Estrutural do TCC

## 1. Identificação Acadêmica e Tema

* **Instituição:** Centro Universitário Barriga Verde – UNIBAVE
* **Curso:** Sistemas de Informação (8ª Fase)
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

* **Gatilho Long-Press no Logotipo:** Segurar o logotipo **MODEXA** por 4 segundos ativa, enquanto ele estiver pressionado, o "Modo de Níveis de Ameaça", que revela o significado oculto das opções de compra. Um duplo clique no logotipo ativa o modo de forma persistente e um clique simples o desativa. No carrinho, segurar um item por 0,8 s revela as informações ocultas daquele item.
* **Mapeamento de Atributos:** As seleções comuns de compra convertem-se em dados sensíveis para as autoridades. Cor e tamanho vêm do último item do carrinho; a quantidade é a soma dos itens:
* **Seleção de Cor (ex: Preto Editorial):** Classifica o nível de risco ou perigo iminente (ex: presença de armas no local).
* **Seleção de Quantidade:** Indica a quantidade de pessoas envolvidas ou se há crianças no ambiente.
* **Seleção de Tamanhos (P, M, G/GG ou 36 a 44):** Categoriza o tipo de violência sofrida (psicológica e moral, patrimonial e sexual, física).
* **Envio pelo Checkout:** A denúncia é enviada pelo formulário comum de **Dados de Entrega** (nome completo, CEP, endereço, número e complemento, telefone), ao clicar em "Confirmar Pedido e Concluir".


* **Feedback Visual Mínimo:** O pressionamento não exibe barra de progresso nem som. Ao ativar ou desativar o modo, aparece apenas um aviso curto ("Níveis de ameaça ativados" / "Modo padrão ativado"), e os rótulos de cor, tamanho e quantidade passam a mostrar o significado oculto.

### 4.2 Protocolos Anti-forense e Sigilo Digital

O sistema assume como premissa que **não há privacidade no dispositivo**. Portanto, foram adotadas as seguintes regras arquiteturais para mitigar o rastro local:

* **Armazenamento Volátil:** Os dados da denúncia em andamento ficam apenas em memória (objeto `appState`). O carrinho e o tema sorteado são espelhados no `sessionStorage`, descartado ao fechar a aba. Não são usados cookies, `localStorage` nem `IndexedDB`.
* **Manipulação de Histórico via History API:** Somente depois que o envio da denúncia é confirmado, o sistema executa `window.history.replaceState()` e `window.history.pushState()` para exibir um endereço comum da loja (`products.html`) e arma a saída de pânico no botão "Voltar". Se o envio falhar, o histórico não é alterado e o carrinho é mantido para nova tentativa.
* **Protocolo de Saída de Emergência (Panic Exit):** Acionado pelo botão flutuante 💬 (disfarçado de "Suporte / Reportar erro"), pela tecla `Esc` ou pelo botão "Voltar" (apenas após uma denúncia enviada ou com o modo de níveis de ameaça ligado). Ao ser acionado, a página é substituída por uma tela de carregamento da SHEIN; `localStorage`, `sessionStorage`, cookies, memória e carrinho são limpos; o Cache Storage é apagado e o service worker desregistrado; e a aba é redirecionada com `window.location.replace` para a página do mesmo produto na SHEIN (ou para a categoria feminina da SHEIN).
* **Limitações Conhecidas:** O histórico anterior ao pânico não pode ser apagado por script, e o ícone do app permanece na tela se o PWA tiver sido instalado.

### 4.3 Segurança dos Dados

* **Transmissão:** Os dados da denúncia (nível de risco, tipo de violência, pessoas no local, nome completo, endereço e data/hora) são enviados em JSON por `fetch` sobre HTTPS ao serviço formsubmit.co, que os repassa por e-mail. O envio só é considerado concluído quando o serviço confirma o recebimento (`success: true`).
* **Limitação:** Não há cifragem no navegador; a proteção em trânsito é a do HTTPS, e o conteúdo chega em texto claro ao serviço de e-mail. Cifrar os dados exigiria uma ferramenta para decifrar do lado de quem recebe e hospedagem própria, o que fica como trabalho futuro. O envio usa `_captcha: "false"`, então qualquer pessoa que leia o código pode enviar mensagens ao endpoint.
