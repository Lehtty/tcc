let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');

function addToCart(id, color, size) {
    if (typeof products === 'undefined') return;
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    const chosenColor = color || (p.colors && p.colors.length > 0 ? p.colors[0] : '#fff');
    const chosenSize = size || (p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'P');
    
    const cartItem = {
        ...p,
        selectedColor: chosenColor,
        selectedSize: chosenSize
    };
    
    cart.push(cartItem);
    updateCart();
    if (typeof showToast === 'function') {
        showToast(`${p.name} adicionado!`);
    }
}

function updateCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));

    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = cart.length;
    
    const total = cart.reduce((s, i) => s + i.price, 0);
    const totalElem = document.getElementById('cart-total');
    if (totalElem) totalElem.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const container = document.getElementById('cart-items');
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<div style="text-align:center;color:var(--gray);margin-top:20px;">Carrinho vazio</div>`;
        } else {
            container.innerHTML = cart.map((i, index) => {
                const colorLabel = i.selectedColor ? `<span style="font-size:0.75rem; color:var(--gray); display:flex; align-items:center; gap:4px; margin-top:2px;">Cor: <span class="color-dot" style="background-color: ${i.selectedColor}; width:10px; height:10px; display:inline-block; border-radius:50%; border:1px solid #ddd;"></span></span>` : '';
                const sizeLabel = i.selectedSize ? `<span style="font-size:0.75rem; color:var(--gray); display:block;">Tamanho: ${i.selectedSize}</span>` : '';
                return `
                <div class="cart-item-row" style="margin-bottom:12px; border-bottom:1px solid var(--border, #eee); padding-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex:1; padding-right:10px;">
                        <span style="font-weight:600; display:block;">${i.name}</span>
                        ${colorLabel}
                        ${sizeLabel}
                        <strong style="color:var(--rose); margin-top:4px; display:block;">R$ ${i.price.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--red, #ff2b2b); font-size:1.1rem; cursor:pointer;">✕</button>
                </div>
                `;
            }).join('');
        }
    }
}

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
    const qty = cart.length;

    if (typeof window.updateAppState === 'function') {
        window.updateAppState(color, size, qty);
    }
    if (typeof appState !== 'undefined') {
        appState.currentProduct = lastItem.name;
    }

    closeCart();
    if (typeof triggerSecureForm === 'function') {
        triggerSecureForm();
    }
}
