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

    closeCart();
    if (typeof window.sendSilentReport === 'function') {
        window.sendSilentReport();
    } else if (typeof triggerSecureForm === 'function') {
        triggerSecureForm();
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
