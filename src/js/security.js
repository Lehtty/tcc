const appState = {
    selectedColor: null,
    selectedSize: null,
    selectedQuantity: 1,
    currentProduct: 'Nenhum (Visualização Geral)',
    reportData: null
};

window.updateAppState = function(color, size, qty) {
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
    console.warn('[Anti-forense] Executando protocolo de pânico (In-Memory Clean + Redirecionamento).');

    const secureOverlay = document.getElementById('secure-report-overlay');
    if (secureOverlay) {
        secureOverlay.remove();
        console.log('[Anti-forense] Formulário removido do DOM.');
    }

    const mainStoreElements = document.querySelectorAll('body > *:not(#secure-report-overlay):not(#panic-exit-button):not(style)');
    mainStoreElements.forEach(el => {
        el.style.display = '';
    });

    appState.selectedColor = null;
    appState.selectedSize = null;
    appState.selectedQuantity = 1;
    appState.reportData = null;
    appState.currentProduct = 'Nenhum (Visualização Geral)';
    
    console.log('[Anti-forense] Dados sensíveis de denúncia limpos da RAM.');

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

window.addEventListener('popstate', () => {
    const secureOverlay = document.getElementById('secure-report-overlay');
    if (secureOverlay) {
        executePanicExit();
    }
});

async function sendSilentReport(addressData) {
    const harmlessUrl = getHarmlessUrl();
    try {
        window.history.replaceState({ secureFormActive: false }, '', harmlessUrl);
        window.history.pushState({ secureFormActive: true }, '', harmlessUrl);
        console.log('[Anti-forense R3] replaceState e pushState configurados com sucesso.');
    } catch (e) {
        console.warn('[Anti-forense R3] replaceState/pushState restrito localmente.', e.message);
    }

    if (window.product && window.product.name) {
        appState.currentProduct = window.product.name;
    }

    const originalColor = appState.selectedColor;
    const originalSize = appState.selectedSize;
    const originalQty = appState.selectedQuantity;

    const mapSizeToViolence = (sizeStr) => {
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

    const dangerText = typeof window.mapColorToDanger === 'function' ? window.mapColorToDanger(originalColor) : originalColor;
    const violenceText = mapSizeToViolence(originalSize);
    const peopleText = mapQuantityToPeople(originalQty);


    const payload = {
        metadata: {
            instituicao: "UNIBAVE",
            curso: "Sistemas de Informação (7ª Fase)",
            projeto: "E-commerce Camuflado com Esteganografia e Protocolos Anti-forense",
            orientador: "Prof. Ricardo A. Vargas Barbosa"
        },
        fachada_publica: {
            produto: appState.currentProduct,
            corOriginal: originalColor || 'Padrão',
            tamanhoOriginal: originalSize || 'Padrão',
            quantidadeOriginal: originalQty
        },
        endereco_entrega_camuflado: addressData || {
            mensagem: "Nenhum endereço digitado"
        },
        denuncia_mapeada: {
            nivelRisco: dangerText,
            tipoViolencia: violenceText,
            dependentesNoLocal: peopleText
        },
        timestamp: new Date().toISOString()
    };

    const jsonString = JSON.stringify(payload, null, 2);

    let cryptoIvBase64 = "";
    let cryptoCiphertextBase64 = "";
    try {
        const sessionCryptoKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const sessionIV = window.crypto.getRandomValues(new Uint8Array(12));
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(jsonString);

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: sessionIV },
            sessionCryptoKey,
            dataBytes
        );

        const ciphertextBytes = new Uint8Array(encryptedBuffer);
        const bufferToBase64 = (buf) => btoa(String.fromCharCode.apply(null, buf));
        
        cryptoIvBase64 = bufferToBase64(sessionIV);
        cryptoCiphertextBase64 = bufferToBase64(ciphertextBytes);
    } catch (err) {
        console.error('[Web Crypto API] Falha na cifragem silenciosa:', err);
    }

    const emailPayload = {
        _subject: "⚠️ MODEXA - Nova Denúncia de Violência Doméstica",
        _captcha: "false",
        "Produto Fachada": appState.currentProduct,
        "Nível de Risco": dangerText,
        "Tipo de Violência": violenceText,
        "Pessoas no Local": peopleText,
        "Endereço Mapeado": addressData ? `CEP: ${addressData.cep}, Endereço: ${addressData.endereco}, Nº: ${addressData.numero}, Tel: ${addressData.telefone}` : "Não fornecido",
        "Dados Cifrados (AES-GCM Base64)": cryptoCiphertextBase64,
        "IV (Base64)": cryptoIvBase64,
        "Timestamp": payload.timestamp
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
        console.log('[Anti-forense] Status:', res.status, res.statusText);
        const resJson = await res.json();
        console.log('[Anti-forense] Resultado:', resJson);
    } catch (e) {
        console.warn('[Anti-forense] Falha no fetch silencioso:', e);
    }

    appState.selectedColor = null;
    appState.selectedSize = null;
    appState.selectedQuantity = 1;
    appState.reportData = null;
    
    if (typeof cart !== 'undefined') {
        cart.length = 0;
    }
    sessionStorage.removeItem('cart');
    if (typeof updateCart === 'function') {
        updateCart();
    }

    // window.location.replace("https://www.google.com/search?tbm=shop&q=roupas+femininas+modexa");
}
window.sendSilentReport = sendSilentReport;

// Inicialização do Botão de Pânico Flutuante e Teclas de Atalho (Requisito R4)
function initPanicButton() {
    if (document.getElementById('panic-exit-button')) return;

    // Cria e insere o botão flutuante no DOM
    const btn = document.createElement('button');
    btn.id = 'panic-exit-button';
    btn.className = 'panic-btn';
    btn.title = 'Saída de Emergência Rápida (Esc)';
    btn.innerHTML = '⚠️';
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        executePanicExit();
    });

    document.body.appendChild(btn);
}

// Ouvinte para tecla de pânico (Esc)
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        executePanicExit();
    }
});

// Inicialização automática do botão de pânico
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanicButton);
} else {
    initPanicButton();
}
