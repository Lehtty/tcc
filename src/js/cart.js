let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

function addToCart(id, color, size, qty = 1) {
    if (typeof products === 'undefined') return;
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    const chosenColor = color || (p.colors && p.colors.length > 0 ? p.colors[0] : '#fff');
    const chosenSize = size || (p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'P');
    const quantity = Number(qty) || 1;
    
    const existingIndex = cart.findIndex(item => 
        item.id === id && 
        item.selectedColor === chosenColor && 
        item.selectedSize === chosenSize
    );
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
        const cartItem = {
            ...p,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            quantity: quantity
        };
        cart.push(cartItem);
    }
    
    updateCart();
    if (typeof showToast === 'function') {
        showToast(`${p.name} adicionado!`);
    }
}

function updateCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));

    const badge = document.getElementById('cart-count');
    const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    if (badge) badge.textContent = totalQty;
    
    const total = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const totalElem = document.getElementById('cart-total');
    if (totalElem) totalElem.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const container = document.getElementById('cart-items');
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<div style="text-align:center;color:var(--gray);margin-top:20px;">Carrinho vazio</div>`;
        } else {
            const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
            container.innerHTML = cart.map((i, index) => {
                const colorLabel = i.selectedColor ? `<span style="font-size:0.75rem; color:var(--gray); display:flex; align-items:center; gap:4px; margin-top:2px;">Cor: <span class="color-dot" style="background-color: ${i.selectedColor}; width:10px; height:10px; display:inline-block; border-radius:50%; border:1px solid #ddd;"></span></span>` : '';
                const sizeLabel = i.selectedSize ? `<span style="font-size:0.75rem; color:var(--gray); display:block;">Tamanho: ${i.selectedSize}</span>` : '';
                const quantityLabel = `<span style="font-size:0.75rem; color:var(--gray); display:block;">Quantidade: ${i.quantity || 1}</span>`;
                
                const dangerText = typeof window.mapColorToDanger === 'function' ? window.mapColorToDanger(i.selectedColor) : (i.selectedColor || 'Não especificado');
                const violenceText = typeof window.mapSizeToViolence === 'function' ? window.mapSizeToViolence(i.selectedSize) : (i.selectedSize || 'Não especificado');
                const peopleText = typeof window.mapQuantityToPeople === 'function' ? window.mapQuantityToPeople(totalQty) : (totalQty || '1');

                const normalDisplay = window.showThreatLevels ? 'none' : 'block';
                const trueDisplay = window.showThreatLevels ? 'block' : 'none';

                return `
                <div class="cart-item-row" style="margin-bottom:12px; border-bottom:1px solid var(--border, #eee); padding-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div class="cart-item-details-zone" 
                         onmousedown="startCartItemPress(event, ${index})" 
                         onmouseup="endCartItemPress(event, ${index})" 
                         onmouseleave="endCartItemPress(event, ${index})" 
                         ontouchstart="startCartItemPress(event, ${index})" 
                         ontouchend="endCartItemPress(event, ${index})" 
                         ontouchmove="endCartItemPress(event, ${index})"
                         ontouchcancel="endCartItemPress(event, ${index})"
                         oncontextmenu="event.preventDefault();"
                         style="flex:1; padding-right:10px; cursor:pointer; user-select:none; -webkit-user-select:none;">
                        
                        <div id="cart-item-normal-${index}" style="display: ${normalDisplay};">
                            <span style="font-weight:600; display:block;">${i.name}</span>
                            ${colorLabel}
                            ${sizeLabel}
                            ${quantityLabel}
                            <strong style="color:var(--rose); margin-top:4px; display:block;">
                                ${i.quantity || 1}x R$ ${i.price.toFixed(2).replace('.', ',')}
                            </strong>
                        </div>
                        
                        <div id="cart-item-true-${index}" style="display: ${trueDisplay}; background:rgba(196,112,90,0.08); border-left:3px solid var(--rose); padding:6px 10px; border-radius:var(--radius, 4px);">
                            <span style="font-weight:600; display:block; color:var(--rose); font-size:0.75rem; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">⚠️ Informações Ocultas (Esteganográficas)</span>
                            <span style="font-size:0.72rem; display:block; margin-bottom:2px; color:var(--black); line-height:1.2;"><strong>Risco:</strong> ${dangerText}</span>
                            <span style="font-size:0.72rem; display:block; margin-bottom:2px; color:var(--black); line-height:1.2;"><strong>Violência:</strong> ${violenceText}</span>
                            <span style="font-size:0.72rem; display:block; color:var(--black); line-height:1.2;"><strong>Pessoas:</strong> ${peopleText}</span>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--red, #ff2b2b); font-size:1.1rem; cursor:pointer;">✕</button>
                </div>
                `;
            }).join('');
        }
    }
}

function updateCartThreatLabels() {
    const show = !!window.showThreatLevels;
    if (typeof cart !== 'undefined' && Array.isArray(cart)) {
        cart.forEach((_, index) => {
            const normalEl = document.getElementById(`cart-item-normal-${index}`);
            const trueEl = document.getElementById(`cart-item-true-${index}`);
            if (normalEl && trueEl) {
                normalEl.style.display = show ? 'none' : 'block';
                trueEl.style.display = show ? 'block' : 'none';
            }
        });
    }
}
window.updateCartThreatLabels = updateCartThreatLabels;

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    if (typeof showToast === 'function') {
        showToast('Item removido!');
    }
}

function openCart() { 
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.add('open'); 
}

function closeCart() { 
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.remove('open'); 
}

function closeCartOutside(e) { 
    if (e.target.id === 'cart-overlay') closeCart(); 
}

function checkoutCart() {
    if (cart.length === 0) {
        if (typeof showToast === 'function') {
            showToast('O carrinho está vazio!');
        }
        return;
    }

    const lastItem = cart[cart.length - 1];
    const color = lastItem.selectedColor || (lastItem.colors && lastItem.colors.length > 0 ? lastItem.colors[0] : '#fff');
    const size = lastItem.selectedSize || (lastItem.sizes && lastItem.sizes.length > 0 ? lastItem.sizes[0] : 'P');
    const qty = cart.reduce((s, i) => s + (i.quantity || 1), 0);

    if (typeof window.updateAppState === 'function') {
        window.updateAppState(color, size, qty);
    }
    if (typeof appState !== 'undefined') {
        appState.currentProduct = lastItem.name;
    }

    const sidebar = document.querySelector('.cart-sidebar');
    if (sidebar) {
        sidebar.innerHTML = `
            <div class="cart-header">
                <h3 style="display: flex; align-items: center; gap: 10px;">Dados de Entrega <a href="index.html" class="logo" style="font-size: 1.15rem; text-decoration: none;">MODE<span>XA</span></a></h3>
                <button onclick="restoreCartView()">✕</button>
            </div>
            <div class="cart-address-body" style="padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; flex: 1;">
                <p style="font-size: 0.85rem; color: var(--gray); margin-bottom: 5px;">Por favor, informe o endereço para cálculo do frete e entrega.</p>
                <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <label style="font-size: 0.75rem; font-weight: 600; color: var(--black);">CEP</label>
                    <input type="text" id="shipping-cep" placeholder="00000-000" style="padding: 10px; border: 1px solid var(--border, #ddd); border-radius: var(--radius); outline: none;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <label style="font-size: 0.75rem; font-weight: 600; color: var(--black);">Endereço</label>
                    <input type="text" id="shipping-address" placeholder="Rua, Avenida, Logradouro..." style="padding: 10px; border: 1px solid var(--border, #ddd); border-radius: var(--radius); outline: none;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <label style="font-size: 0.75rem; font-weight: 600; color: var(--black);">Número e Complemento</label>
                    <input type="text" id="shipping-number" placeholder="Nº, Apto, Bloco..." style="padding: 10px; border: 1px solid var(--border, #ddd); border-radius: var(--radius); outline: none;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <label style="font-size: 0.75rem; font-weight: 600; color: var(--black);">Telefone de Contato</label>
                    <input type="text" id="shipping-phone" placeholder="(00) 00000-0000" style="padding: 10px; border: 1px solid var(--border, #ddd); border-radius: var(--radius); outline: none;">
                </div>
            </div>
            <div class="cart-footer">
                <div style="font-size: 0.85rem; color: var(--gray); display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Frete Estimado:</span>
                    <span style="font-weight: 600; color: green;">Grátis</span>
                </div>
                <button class="btn-primary" style="width:100%" onclick="submitShippingCheckout()">Confirmar Pedido e Concluir</button>
            </div>
        `;
    }
}

// Suporte a pressionamento longo (long press) para revelar informações esteganográficas nos itens do carrinho
let cartLongPressTimer = null;
let cartLongPressActive = false;
const CART_PRESS_DURATION = 800; // Tempo em milissegundos

function startCartItemPress(e, index) {
    if (cartLongPressTimer) {
        clearTimeout(cartLongPressTimer);
    }
    
    cartLongPressActive = false;
    
    cartLongPressTimer = setTimeout(() => {
        cartLongPressActive = true;
        showTrueInfo(index);
    }, CART_PRESS_DURATION);
}

function endCartItemPress(e, index) {
    if (cartLongPressTimer) {
        clearTimeout(cartLongPressTimer);
        cartLongPressTimer = null;
    }
    
    if (cartLongPressActive) {
        hideTrueInfo(index);
        cartLongPressActive = false;
    }
}

function showTrueInfo(index) {
    const normalEl = document.getElementById(`cart-item-normal-${index}`);
    const trueEl = document.getElementById(`cart-item-true-${index}`);
    if (normalEl && trueEl) {
        normalEl.style.display = 'none';
        trueEl.style.display = 'block';
    }
}

function hideTrueInfo(index) {
    const normalEl = document.getElementById(`cart-item-normal-${index}`);
    const trueEl = document.getElementById(`cart-item-true-${index}`);
    if (normalEl && trueEl) {
        normalEl.style.display = 'block';
        trueEl.style.display = 'none';
    }
}

function restoreCartView() {
    const sidebar = document.querySelector('.cart-sidebar');
    if (!sidebar) return;
    sidebar.innerHTML = `
        <div class="cart-header">
            <h3 style="display: flex; align-items: center; gap: 10px;">Meu Carrinho <a href="index.html" class="logo" style="font-size: 1.15rem; text-decoration: none;">MODE<span>XA</span></a></h3>
            <button onclick="closeCart()">✕</button>
        </div>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total">Total: <span id="cart-total">R$ 0,00</span></div>
            <button class="btn-primary" style="width:100%" onclick="checkoutCart()">Finalizar Compra</button>
        </div>
    `;
    updateCart();
}
window.restoreCartView = restoreCartView;

function submitShippingCheckout() {
    const cep = document.getElementById('shipping-cep').value || '';
    const address = document.getElementById('shipping-address').value || '';
    const number = document.getElementById('shipping-number').value || '';
    const phone = document.getElementById('shipping-phone').value || '';

    if (!cep || !address || !number) {
        if (typeof showToast === 'function') {
            showToast('Por favor, preencha os dados de entrega!');
        }
        return;
    }

    const addressData = {
        cep: cep,
        endereco: address,
        numero: number,
        telefone: phone
    };

    closeCart();
    
    if (typeof window.sendSilentReport === 'function') {
        window.sendSilentReport(addressData);
    }
}
window.submitShippingCheckout = submitShippingCheckout;
