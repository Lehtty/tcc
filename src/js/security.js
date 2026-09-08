
const EMAIL_CONFIG = {
    provider: 'none', // Opções: 'formspree' | 'emailjs' | 'custom' | 'none' (apenas simula no console)
    formspreeId: 'id', // ID do Formspree (alterar para o correto)
    emailjs: {
        serviceId: 'service_id',
        templateId: 'template_id',
        publicKey: 'public_key'
    },
    customEndpoint: 'http://localhost:3000/api/report'
};

async function sendReportEmail(payload) {
    if (EMAIL_CONFIG.provider === 'none') {
        console.log('[TCC Transmissão] Simulação de envio (Provedor desativado):', payload);
        return { success: true };
    }

    try {
        if (EMAIL_CONFIG.provider === 'formspree') {
            const response = await fetch(`https://formspree.io/f/${EMAIL_CONFIG.formspreeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    subject: '🚨 ALERTA: Relato de Violência Doméstica - MODEXA',
                    nivelRisco: payload.denuncia_mapeada.nivelRisco,
                    tipoViolencia: payload.denuncia_mapeada.tipoViolencia,
                    dependentesNoLocal: payload.denuncia_mapeada.dependentesNoLocal,
                    relatoComplementar: payload.denuncia_mapeada.relatoComplementar,
                    produtoFachada: payload.fachada_publica.produto,
                    corOriginal: payload.fachada_publica.corOriginal,
                    tamanhoOriginal: payload.fachada_publica.tamanhoOriginal,
                    quantidadeOriginal: payload.fachada_publica.quantidadeOriginal,
                    criptografia_ciphertext: payload.criptografia?.ciphertext || 'Não disponível',
                    criptografia_iv: payload.criptografia?.iv || 'Não disponível',
                    criptografia_key: payload.criptografia?.key ? JSON.stringify(payload.criptografia.key) : 'Não disponível',
                    timestamp: payload.timestamp
                })
            });
            if (!response.ok) {
                throw new Error(`Erro na API Formspree: ${response.statusText}`);
            }
            return { success: true };
        }

        if (EMAIL_CONFIG.provider === 'emailjs') {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_id: EMAIL_CONFIG.emailjs.serviceId,
                    template_id: EMAIL_CONFIG.emailjs.templateId,
                    user_id: EMAIL_CONFIG.emailjs.publicKey,
                    template_params: {
                        subject: '🚨 ALERTA: Relato de Violência Doméstica - MODEXA',
                        nivel_risco: payload.denuncia_mapeada.nivelRisco,
                        tipo_violencia: payload.denuncia_mapeada.tipoViolencia,
                        dependentes: payload.denuncia_mapeada.dependentesNoLocal,
                        relato: payload.denuncia_mapeada.relatoComplementar,
                        produto: payload.fachada_publica.produto,
                        cor: payload.fachada_publica.corOriginal,
                        tamanho: payload.fachada_publica.tamanhoOriginal,
                        quantidade: payload.fachada_publica.quantidadeOriginal,
                        ciphertext: payload.criptografia?.ciphertext || '',
                        iv: payload.criptografia?.iv || '',
                        key_jwk: payload.criptografia?.key ? JSON.stringify(payload.criptografia.key) : '',
                        timestamp: payload.timestamp
                    }
                })
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Erro na API EmailJS: ${errText}`);
            }
            return { success: true };
        }

        if (EMAIL_CONFIG.provider === 'custom') {
            const response = await fetch(EMAIL_CONFIG.customEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Erro no servidor customizado: ${response.statusText}`);
            }
            return { success: true };
        }

        throw new Error('Provedor de e-mail não configurado ou desconhecido.');
    } catch (error) {
        console.error('[TCC Transmissão] Erro de rede ou API:', error);
        throw error;
    }
}

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
    console.warn('[Anti-forense] Iniciando Wipe Total de Segurança.');

    // 1. Destruição Visual e de Memória (Apaga a loja inteira da tela instantaneamente)
    document.documentElement.innerHTML = `
        <head>
            <title>SHEIN Brasil | Compre Roupas Femininas</title>
            <link rel="icon" href="https://br.shein.com/favicon.ico" type="image/x-icon">
        </head>
        <body style="background-color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="font-family: sans-serif; color: #666;">Carregando...</div>
        </body>
    `;

    // 2. Aniquilação de Storage e Cookies
    localStorage.clear();
    sessionStorage.clear();
    
    // Varre e destrói todos os cookies do domínio atual
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // 3. Limpeza de variáveis de estado
    appState.selectedColor = null;
    appState.selectedSize = null;
    appState.selectedQuantity = 1;
    appState.reportData = null;
    appState.currentProduct = 'Nenhum (Visualização Geral)';
    
    if (typeof cart !== 'undefined') {
        cart.length = 0;
    }
    
    // 4. Determina o destino final (Shein ou URL do produto)
    let redirectUrl = 'https://br.shein.com/';
    if (window.product) {
        if (window.product.panicUrl) {
            redirectUrl = window.product.panicUrl;
        } else if (window.product.panicFallbackUrl) {
            redirectUrl = window.product.panicFallbackUrl;
        }
    }
    
    // 5. Substitui a rota no histórico e navega para fora
    window.location.replace(redirectUrl);
}

window.addEventListener('popstate', () => {
    const secureOverlay = document.getElementById('secure-report-overlay');
    if (secureOverlay) {
        executePanicExit();
    }
});

function triggerSecureForm() {
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

    const dangerText = typeof window.mapColorToDanger === 'function' ? window.mapColorToDanger(originalColor) : originalColor;
    const violenceText = mapSizeToViolence(originalSize);
    const peopleText = mapQuantityToPeople(originalQty);

    injectSecureStyles();

    const overlay = document.createElement('div');
    overlay.id = 'secure-report-overlay';
    overlay.innerHTML = `
        <div class="secure-report-container">
            <div class="user-panel">
                <div class="panel-header">
                    <h2>Configurações de Privacidade do Navegador</h2>
                    <p>Este formulário registra as preferências de conformidade de cookies e segurança de sessão.</p>
                </div>
                <form id="privacy-compliance-form" onsubmit="event.preventDefault();">
                    <div class="form-group">
                        <label for="input-risk-code">Código de Segurança do Canal (Automático)</label>
                        <input type="text" id="input-risk-code" value="${dangerText}" disabled />
                    </div>
                    <div class="form-group">
                        <label for="input-integrity">Parâmetro de Integridade de Dados</label>
                        <input type="text" id="input-integrity" value="${violenceText}" disabled />
                    </div>
                    <div class="form-group">
                        <label for="input-nodes">Nós de Conexão na Rede</label>
                        <input type="text" id="input-nodes" value="${peopleText}" disabled />
                    </div>
                    <div class="form-group">
                        <label for="textarea-relato">Relato Técnico / Observações Adicionais (Endereço, Detalhes)</label>
                        <textarea id="textarea-relato" placeholder="Digite aqui observações de roteamento (ex: endereço completo e relato complementar)..." rows="4"></textarea>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn-submit" id="btn-submit-report">Salvar Preferências e Enviar</button>
                    </div>
                </form>
                <div class="security-badge">
                    <span>🔒 Conexão Criptografada Nativamente (RAM Only)</span>
                </div>
            </div>

            <div class="audit-panel">
                <div class="audit-header">
                    <h3>PAINEL DE AUDITORIA & TESTE (Banca TCC)</h3>
                    <p>Este painel ilustra em tempo real a esteganografia comportamental e a cifragem local via Web Crypto API.</p>
                </div>
                
                <div class="audit-section">
                    <span class="audit-section-title">1. Valores Originais da Fachada Pública</span>
                    <div class="audit-grid">
                        <div class="audit-item"><strong>Produto Visualizado:</strong> <span>${appState.currentProduct}</span></div>
                        <div class="audit-item">
                            <strong>Cor Selecionada:</strong> 
                            <span style="display:inline-flex; align-items:center; gap:8px;">
                                <span class="color-dot" style="background-color: ${originalColor || '#ccc'}"></span>
                                ${originalColor || 'Nenhuma (Padrão)'}
                            </span>
                        </div>
                        <div class="audit-item"><strong>Tamanho Selecionado:</strong> <span>${originalSize || 'Nenhum (Padrão)'}</span></div>
                        <div class="audit-item"><strong>Quantidade Selecionada:</strong> <span>${originalQty}</span></div>
                    </div>
                </div>

                <div class="audit-section">
                    <span class="audit-section-title">2. Tradução Esteganográfica (Camada Oculta)</span>
                    <div class="audit-grid">
                        <div class="audit-item"><strong>Risco / Armas:</strong> <span class="highlight-val">${dangerText}</span></div>
                        <div class="audit-item"><strong>Tipo de Violência:</strong> <span class="highlight-val">${violenceText}</span></div>
                        <div class="audit-item"><strong>Dependentes no Local:</strong> <span class="highlight-val">${peopleText}</span></div>
                    </div>
                </div>

                <div class="audit-section">
                    <span class="audit-section-title">3. Visualizador de Criptografia Web Crypto API ( RAM Only )</span>
                    <div class="crypto-log-container">
                        <div class="crypto-log-item">
                            <strong>Dados Estruturados em Texto Plano (JSON):</strong>
                            <pre id="crypto-plaintext" class="code-block">Aguardando geração...</pre>
                        </div>
                        <div class="crypto-log-item">
                            <strong>Chave Simétrica AES-GCM Gerada em RAM (JWK):</strong>
                            <pre id="crypto-key" class="code-block">Chave não gerada...</pre>
                        </div>
                        <div class="crypto-log-item">
                            <strong>Vetor de Inicialização (IV - Base64):</strong>
                            <pre id="crypto-iv" class="code-block">Aguardando...</pre>
                        </div>
                        <div class="crypto-log-item">
                            <strong>Ciphertext (Texto Cifrado - Base64):</strong>
                            <pre id="crypto-ciphertext" class="code-block">Aguardando...</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const mainStoreElements = document.querySelectorAll('body > *:not(#secure-report-overlay):not(#panic-exit-button):not(style)');
    mainStoreElements.forEach(el => {
        el.style.display = 'none';
    });

    const relatoTextarea = document.getElementById('textarea-relato');
    const submitBtn = document.getElementById('btn-submit-report');

    let sessionCryptoKey = null;
    let sessionIV = null;

    async function updateRealtimeCrypto() {
        const relatoText = relatoTextarea.value;
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
            denuncia_mapeada: {
                nivelRisco: dangerText,
                tipoViolencia: violenceText,
                dependentesNoLocal: peopleText,
                relatoComplementar: relatoText
            },
            timestamp: new Date().toISOString()
        };

        const jsonString = JSON.stringify(payload, null, 2);
        document.getElementById('crypto-plaintext').textContent = jsonString;

        try {
            if (!sessionCryptoKey) {
                sessionCryptoKey = await window.crypto.subtle.generateKey(
                    { name: "AES-GCM", length: 256 },
                    true,
                    ["encrypt", "decrypt"]
                );
                sessionIV = window.crypto.getRandomValues(new Uint8Array(12));
                const exportedJwk = await window.crypto.subtle.exportKey("jwk", sessionCryptoKey);
                document.getElementById('crypto-key').textContent = JSON.stringify(exportedJwk, null, 2);
            }

            const encoder = new TextEncoder();
            const dataBytes = encoder.encode(jsonString);

            const encryptedBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: sessionIV },
                sessionCryptoKey,
                dataBytes
            );

            const ciphertextBytes = new Uint8Array(encryptedBuffer);
            const bufferToBase64 = (buf) => btoa(String.fromCharCode.apply(null, buf));

            const ivBase64 = bufferToBase64(sessionIV);
            const ciphertextBase64 = bufferToBase64(ciphertextBytes);

            document.getElementById('crypto-iv').textContent = ivBase64;
            document.getElementById('crypto-ciphertext').textContent = ciphertextBase64;

            const exportedJwk = await window.crypto.subtle.exportKey("jwk", sessionCryptoKey);
            payload.criptografia = {
                ciphertext: ciphertextBase64,
                iv: ivBase64,
                key: exportedJwk
            };
        } catch (err) {
            console.error('[Web Crypto API] Falha na cifragem:', err);
            document.getElementById('crypto-ciphertext').textContent = "Falha: " + err.message;
        }

        return payload;
    }

    updateRealtimeCrypto();
    relatoTextarea.addEventListener('input', updateRealtimeCrypto);

    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.textContent = "Transmitindo...";

        try {
            // Gera o payload final contendo as chaves e dados criptografados
            const payload = await updateRealtimeCrypto();

            // Envia de forma assíncrona por e-mail de acordo com a configuração
            await sendReportEmail(payload);

            // UX de Crise: Mostra um feedback discreto compatível com a fachada de cookies
            if (typeof showToast === 'function') {
                showToast('Preferências de cookies salvas com sucesso.');
            }
        } catch (err) {
            console.error('[TCC Transmissão] Erro ao enviar denúncia:', err);
            if (typeof showToast === 'function') {
                showToast('Erro ao atualizar configurações. Tente novamente.');
            }
        } finally {
            // PROTOCOLO ANTI-FORENSE: Limpeza de dados confidenciais da RAM imediatamente
            appState.selectedColor = null;
            appState.selectedSize = null;
            appState.selectedQuantity = 1;
            appState.reportData = null;
            appState.currentProduct = 'Nenhum (Visualização Geral)';

            sessionCryptoKey = null;
            sessionIV = null;

            // Limpa os campos do formulário para evitar cache no DOM visual
            if (relatoTextarea) {
                relatoTextarea.value = '';
            }
            const formInputs = document.querySelectorAll('#privacy-compliance-form input, #privacy-compliance-form textarea');
            formInputs.forEach(input => {
                input.value = '';
            });

            // Limpa o carrinho de compras simulado
            if (typeof cart !== 'undefined') {
                cart.length = 0;
            }
            sessionStorage.removeItem('cart');
            if (typeof updateCart === 'function') {
                updateCart();
            }

            // Remove o overlay camuflado de privacidade do DOM e restaura a fachada pública
            const secureOverlay = document.getElementById('secure-report-overlay');
            if (secureOverlay) {
                secureOverlay.remove();
            }
            const mainStoreElements = document.querySelectorAll('body > *:not(#secure-report-overlay):not(#panic-exit-button):not(style)');
            mainStoreElements.forEach(el => {
                el.style.display = '';
            });

            // Evasão de Histórico: Substitui o histórico atual pela rota inofensiva da loja
            const harmlessUrl = getHarmlessUrl();
            try {
                window.history.replaceState(null, '', harmlessUrl);
            } catch (e) {
                console.warn('[Anti-forense R3] Erro replaceState pós-envio:', e.message);
            }

            // [ANTI-FORENSE R3] Redirecionamento de saída de segurança após o envio concluído
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
    });
}

function injectSecureStyles() {
    if (document.getElementById('secure-report-styles')) return;

    const style = document.createElement('style');
    style.id = 'secure-report-styles';
    style.textContent = `
        #secure-report-overlay {
            position: fixed;
            inset: 0;
            background: #0f172a;
            color: #f8fafc;
            z-index: 999999;
            overflow-y: auto;
            font-family: 'DM Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            animation: fadeInReport 0.4s ease-out;
        }

        @keyframes fadeInReport {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }

        .secure-report-container {
            width: 100%;
            max-width: 1240px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            background: #1e293b;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
            border: 1px solid #334155;
            overflow: hidden;
            animation: slideUpReport 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUpReport {
            from { transform: translateY(20px); }
            to { transform: translateY(0); }
        }

        @media (max-width: 992px) {
            .secure-report-container {
                grid-template-columns: 1fr;
            }
        }

        .user-panel {
            padding: 3rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            border-right: 1px solid #334155;
        }

        @media (max-width: 992px) {
            .user-panel {
                border-right: none;
                border-bottom: 1px solid #334155;
                padding: 2rem;
            }
        }

        .panel-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            color: #38bdf8;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .panel-header p {
            color: #94a3b8;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
        }

        .form-group label {
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #cbd5e1;
        }

        .form-group input, .form-group textarea {
            background: #0f172a;
            border: 1px solid #475569;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            color: #f1f5f9;
            font-family: inherit;
            font-size: 0.95rem;
            transition: all 0.2s;
        }

        .form-group input:disabled {
            background: #1e293b;
            color: #94a3b8;
            border-color: #334155;
            cursor: not-allowed;
            font-weight: 500;
        }

        .form-group textarea:focus {
            outline: none;
            border-color: #38bdf8;
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
        }

        .btn-submit {
            background: #0284c7;
            color: #fff;
            border: none;
            padding: 1rem 2rem;
            border-radius: 6px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }

        .btn-submit:hover {
            background: #0369a1;
            transform: translateY(-1px);
        }

        .btn-submit:disabled {
            background: #475569;
            cursor: not-allowed;
            transform: none;
        }

        .security-badge {
            text-align: center;
            font-size: 0.8rem;
            color: #22c55e;
            font-weight: 500;
            margin-top: 1rem;
        }

        .audit-panel {
            padding: 3rem;
            background: #111827;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            overflow-y: auto;
        }

        @media (max-width: 992px) {
            .audit-panel {
                padding: 2rem;
            }
        }

        .audit-header h3 {
            font-size: 1.3rem;
            color: #f472b6;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }

        .audit-header p {
            color: #9ca3af;
            font-size: 0.85rem;
            line-height: 1.4;
        }

        .audit-section {
            border-top: 1px solid #374151;
            padding-top: 1.5rem;
        }

        .audit-section-title {
            display: block;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #f472b6;
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
        }

        .audit-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        .audit-item {
            font-size: 0.9rem;
            color: #d1d5db;
            background: #1f2937;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .audit-item strong {
            color: #9ca3af;
            font-weight: 500;
        }

        .color-dot {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 1px solid #4b5563;
        }

        .highlight-val {
            color: #38bdf8;
            font-weight: 600;
        }

        .crypto-log-container {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .crypto-log-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .crypto-log-item strong {
            font-size: 0.8rem;
            color: #cbd5e1;
        }

        .code-block {
            background: #030712;
            border: 1px solid #1f2937;
            padding: 0.85rem;
            border-radius: 6px;
            font-family: 'Consolas', 'Courier New', Courier, monospace;
            font-size: 0.8rem;
            color: #34d399;
            overflow-x: auto;
            max-height: 160px;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.4;
        }
    `;
    document.head.appendChild(style);
}

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
