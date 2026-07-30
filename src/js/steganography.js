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

window.mapSizeToViolence = (sizeStr) => {
    if (!sizeStr) return 'Não especificado / Sob Investigação';
    const s = sizeStr.toUpperCase();
    if (s === 'P' || s === '36' || s === '38') {
        return 'Violência Psicológica e Moral (Ameaças, Humilhações, Controle Coercitivo)';
    } else if (s === 'M' || s === '40' || s === '42') {
        return 'Violência Patrimonial e Sexual (Danos Materiais, Retenção de Documentos, Abuso)';
    } else if (s === 'G' || s === 'GG' || s === '44') {
        return 'Violência Física e Corporal (Agressão Direta, Empurrões, Lesão Corporal)';
    }
    return 'Violência Psicológica / Verbal';
};

window.mapQuantityToPeople = (qty) => {
    const q = parseInt(qty) || 1;
    if (q === 1) {
        return 'Apenas Vítima e Agressor (Sem crianças ou dependentes no local)';
    } else if (q === 2) {
        return 'Presença de 1 Criança / Dependente no ambiente da agressão';
    } else if (q === 3) {
        return 'Presença de 2 Crianças / Dependentes no ambiente da agressão';
    } else {
        return `Múltiplas Testemunhas ou Presença de ${q - 1} Crianças no local`;
    }
};

(function() {
    let longPressTimer = null;
    const PRESS_DURATION = 4000;

    const logoElements = document.querySelectorAll('.logo');

    if (logoElements.length > 0) {
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
                if (typeof updateAllThreatLabels === 'function') {
                    updateAllThreatLabels();
                } else if (typeof updateColorNameLabel === 'function') {
                    updateColorNameLabel();
                }
                if (typeof updateCartThreatLabels === 'function') {
                    updateCartThreatLabels();
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
                if (typeof updateAllThreatLabels === 'function') {
                    updateAllThreatLabels();
                } else if (typeof updateColorNameLabel === 'function') {
                    updateColorNameLabel();
                }
                if (typeof updateCartThreatLabels === 'function') {
                    updateCartThreatLabels();
                }
                if (typeof showToast === 'function') {
                    showToast('Modo padrão ativado');
                }
            }
        };

        logoElements.forEach(logoElement => {
            logoElement.addEventListener('mousedown', startPress);
            logoElement.addEventListener('mouseup', cancelPress);
            logoElement.addEventListener('mouseleave', cancelPress);

            logoElement.addEventListener('touchstart', startPress, { passive: false });
            logoElement.addEventListener('touchend', cancelPress);
            logoElement.addEventListener('touchcancel', cancelPress);

            logoElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            logoElement.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });
    }
})();
