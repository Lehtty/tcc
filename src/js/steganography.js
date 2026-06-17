window.showThreatLevels = false;

window.mapColorToDanger = (colorHex) => {
    const dangerMap = {
        '#2c2c2a': 'Nível Vermelho (Risco Extremo - Presença de Armas de Fogo no Local)',
        '#c4705a': 'Nível Laranja (Risco Alto - Ameaça Física / Agressor no Local)',
        '#80a080': 'Nível Amarelo (Risco Moderado - Histórico Recente de Agressões)',
        '#888': 'Nível Amarelo (Risco Moderado - Violência Psicológica Continuada)',
        '#6080a0': 'Nível Amarelo (Risco Moderado - Agressão Verbal e Ameaça)',
        '#f5c4b3': 'Nível Azul (Risco Inicial - Discussão Verbal e Tensão Elevada)',
        '#aaf0cb': 'Nível Azul (Risco Inicial - Comportamento Controlador e Isolamento)',
        '#b5d4f4': 'Nível Azul (Risco Inicial - Ameaça de Dano Patrimonial)',
        '#fff': 'Nível Azul (Risco Inicial - Outros Sinais de Risco)',
        '#f5e6e0': 'Nível Azul (Risco Inicial - Tensão Elevada no Domicílio)',
        '#f5ece8': 'Nível Azul (Risco Inicial - Controle Coercitivo)'
    };
    return dangerMap[colorHex] || 'Nível Geral (Monitoramento / Risco Inicial)';
};

(function() {
    let longPressTimer = null;
    const PRESS_DURATION = 4000;

    const logoElement = document.getElementById('shop-logo') || document.querySelector('.logo');

    if (logoElement) {
        if (!logoElement.id) {
            logoElement.id = 'shop-logo';
        }

        const startPress = (e) => {
            if (e.type === 'touchstart') {
                e.preventDefault();
            }

            if (longPressTimer) {
                clearTimeout(longPressTimer);
            }

            longPressTimer = setTimeout(() => {
                window.showThreatLevels = !window.showThreatLevels;
                console.log(`[TCC Esteganografia] Modo de Níveis de Ameaça: ${window.showThreatLevels}`);
                if (typeof updateColorNameLabel === 'function') {
                    updateColorNameLabel();
                }
                if (typeof showToast === 'function') {
                    showToast(window.showThreatLevels ? 'Níveis de ameaça ativados' : 'Modo padrão ativado');
                }
            }, PRESS_DURATION);
        };

        const cancelPress = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            if (window.showThreatLevels === true) {
                window.showThreatLevels = false;
                console.log(`[TCC Esteganografia] Modo de Níveis de Ameaça desativado (logo solta)`);
                if (typeof updateColorNameLabel === 'function') {
                    updateColorNameLabel();
                }
                if (typeof showToast === 'function') {
                    showToast('Modo padrão ativado');
                }
            }
        };

        logoElement.addEventListener('mousedown', startPress);
        logoElement.addEventListener('mouseup', cancelPress);
        logoElement.addEventListener('mouseleave', cancelPress);

        logoElement.addEventListener('touchstart', startPress, { passive: false });
        logoElement.addEventListener('touchend', cancelPress);
        logoElement.addEventListener('touchcancel', cancelPress);

        logoElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
})();
