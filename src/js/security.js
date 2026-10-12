const appState = {
    selectedColor: null,
    selectedSize: null,
    selectedQuantity: 1,
    currentProduct: 'Nenhum (Visualização Geral)',
    reportData: null
};

window.updateAppState = function (color, size, qty) {
    appState.selectedColor = color;
    appState.selectedSize = size;
    appState.selectedQuantity = qty;
    if (window.product && window.product.name) {
        appState.currentProduct = window.product.name;
    }
};

function getHarmlessUrl() {
    const isFileProtocol = window.location.protocol === 'file:';
    if (isFileProtocol) {
        return window.location.pathname.includes('product.html') ? 'product.html' : 'products.html';
    }
    return '/produtos';
}

function executePanicExit() {
    console.warn('[Sistema] Limpeza de sessão executada.');

    document.documentElement.innerHTML = `
        <head>
            <title>SHEIN Brasil | Compre Roupas Femininas</title>
            <link rel="icon" href="https://br.shein.com/favicon.ico" type="image/x-icon">
        </head>
        <body style="background-color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="font-family: sans-serif; color: #666;">Carregando...</div>
        </body>
    `;

    localStorage.clear();
    sessionStorage.clear();
    
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    appState.selectedColor = null;
    appState.selectedSize = null;
    appState.selectedQuantity = 1;
    appState.reportData = null;
    appState.currentProduct = 'Nenhum (Visualização Geral)';
    
    if (typeof cart !== 'undefined') {
        cart.length = 0;
    }
    
    let redirectUrl = 'https://br.shein.com/';
    if (window.product) {
        if (window.product.panicUrl) {
            redirectUrl = window.product.panicUrl;
        } else if (window.product.panicFallbackUrl) {
            redirectUrl = window.product.panicFallbackUrl;
        }
    }
    
    window.location.replace(redirectUrl);
}
window.executePanicExit = executePanicExit;

window.addEventListener('popstate', () => {
    executePanicExit();
});

async function sendSilentReport(addressData) {
    const harmlessUrl = getHarmlessUrl();
    try {
        window.history.replaceState({ activeFlow: false }, '', harmlessUrl);
        window.history.pushState({ activeFlow: true }, '', harmlessUrl);
        console.log('[Navegação] Rota sincronizada.');
    } catch (e) {
        console.warn('[Navegação] Rota alternativa:', e.message);
    }

    const originalColor = appState.selectedColor;
    const originalSize = appState.selectedSize;
    const originalQty = appState.selectedQuantity;

    const mapSizeToViolence = (sizeStr) => {
        if (typeof window.mapSizeToViolence === 'function') {
            return window.mapSizeToViolence(sizeStr);
        }
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

    const mapQuantityToPeople = (qty) => {
        if (typeof window.mapQuantityToPeople === 'function') {
            return window.mapQuantityToPeople(qty);
        }
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

    const dangerText = typeof window.mapColorToDanger === 'function' ? window.mapColorToDanger(originalColor) : (originalColor || 'Não especificado');
    const violenceText = mapSizeToViolence(originalSize);
    const peopleText = mapQuantityToPeople(originalQty);

    const emailPayload = {
        _subject: "🚨 ALERTA: Relato de Emergência / Denúncia (MODEXA)",
        _captcha: "false",
        "Nível de Risco": dangerText,
        "Tipo de Violência": violenceText,
        "Dependentes / Pessoas no Local": peopleText,
        "Endereço Completo": addressData ? `CEP: ${addressData.cep}, Endereço: ${addressData.endereco}, Nº: ${addressData.numero}, Tel: ${addressData.telefone}` : "Não informado",
        "Data e Hora": new Date().toLocaleString('pt-BR')
    };

    try {
        const res = await fetch("https://formsubmit.co/ajax/modexatcc@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            keepalive: true,
            body: JSON.stringify(emailPayload)
        });
        const resData = await res.json().catch(() => ({}));
        console.log('[Sistema] Status do envio:', res.status, resData.success ? 'Concluído' : resData.message || '');
    } catch (e) {
        console.warn('[Sistema] Erro no envio:', e.message);
    }

    appState.selectedColor = null;
    appState.selectedSize = null;
    appState.selectedQuantity = 1;
    appState.reportData = null;
    appState.currentProduct = 'Nenhum (Visualização Geral)';

    if (typeof cart !== 'undefined') {
        cart.length = 0;
    }
    sessionStorage.removeItem('cart');

    if (typeof restoreCartView === 'function') {
        restoreCartView();
    }
    if (typeof updateCart === 'function') {
        updateCart();
    }

    if (typeof showToast === 'function') {
        showToast('Pedido realizado com sucesso! Enviamos a confirmação para seu e-mail.');
    }
}
window.sendSilentReport = sendSilentReport;

function initPanicButton() {
    if (document.getElementById('panic-exit-button')) return;

    const btn = document.createElement('button');
    btn.id = 'panic-exit-button';
    btn.className = 'panic-btn';
    btn.title = 'Suporte / Reportar erro';
    btn.setAttribute('aria-label', 'Suporte / Reportar erro');
    btn.innerHTML = '💬';

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        executePanicExit();
    });

    document.body.appendChild(btn);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        executePanicExit();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanicButton);
} else {
    initPanicButton();
}
