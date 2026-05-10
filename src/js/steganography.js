// Lógica secreta do TCC
// Exemplo: Se o usuário segurar o clique no logo por 3 segundos, ativa o modo de denúncia.
let pressTimer;

const logo = document.querySelector('.logo');
if(logo) {
    logo.addEventListener('mousedown', () => {
        pressTimer = window.setTimeout(() => {
            alert('Protocolo de Segurança Ativado: Iniciando formulário camuflado.');
            // Aqui entraria a lógica de trocar o conteúdo do site em memória
        }, 3000);
    });
    logo.addEventListener('mouseup', () => clearTimeout(pressTimer));
}