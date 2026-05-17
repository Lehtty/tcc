let cart = [];

function applyRandomTheme() {
    const cssFiles = ['../src/assets/styles/style_one.css', '../src/assets/styles/style_two.css', '../src/assets/styles/style_three.css'];
    const selectedCss = cssFiles[Math.floor(Math.random() * cssFiles.length)];
    const themeLink = document.getElementById('theme-style') || document.querySelector('link[href*="assets/styles/"]');
    if (themeLink) {
        themeLink.href = selectedCss;
    }

    const themes = [
        { 
            name: 'Classic Rose',
            colors: { rose: '#c4705a', cream: '#faf9f6', black: '#111' },
            layout: { navHeight: '70px', radius: '4px', ratio: '3/4' }
        },
        { 
            name: 'Modern Blue',
            colors: { rose: '#5a82c4', cream: '#f0f5fa', black: '#0a1a2a' },
            layout: { navHeight: '90px', radius: '24px', ratio: '1/1' } 
        },
        { 
            name: 'Minimalist Dark',
            colors: { rose: '#ff4757', cream: '#1a1a1a', black: '#ffffff' },
            layout: { navHeight: '60px', radius: '0px', ratio: '2/3' } 
        }
    ];

    const selected = themes[Math.floor(Math.random() * themes.length)];
    
    const root = document.documentElement;
    root.style.setProperty('--rose', selected.colors.rose);
    root.style.setProperty('--cream', selected.colors.cream);
    root.style.setProperty('--black', selected.colors.black);
    root.style.setProperty('--nav-height', selected.layout.navHeight);
    root.style.setProperty('--radius', selected.layout.radius);
    root.style.setProperty('--img-ratio', selected.layout.ratio);

    console.log(`[TCC Camuflagem] Sistema carregado: ${selected.name}`);
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.error("Erro: Elemento 'products-grid' não encontrado no HTML.");
        return;
    }

    if (typeof products === 'undefined') {
        console.error("Erro: A variável 'products' não foi carregada. Verifique se o ficheiro products.js está correto.");
        grid.innerHTML = "<p>Erro ao carregar produtos.</p>";
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <span class="prod-name">${p.name}</span>
            <div class="prod-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
            <button class="btn-primary" style="margin-top:10px; width:100%" onclick="addToCart(${p.id})">
                Adicionar
            </button>
        </div>
    `).join('');
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    cart.push(p);
    updateCart();
    showToast(`${p.name} adicionado!`);
}

function updateCart() {
    const badge = document.getElementById('cart-count');
    if(badge) badge.textContent = cart.length;
    
    const total = cart.reduce((s, i) => s + i.price, 0);
    const totalElem = document.getElementById('cart-total');
    if(totalElem) totalElem.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const container = document.getElementById('cart-items');
    if(container) {
        container.innerHTML = cart.map(i => `
            <div style="margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px">
                ${i.name} - <strong>R$ ${i.price.toFixed(2)}</strong>
            </div>
        `).join('');
    }
}

function openCart() { document.getElementById('cart-overlay').classList.add('open'); }
function closeCart() { document.getElementById('cart-overlay').classList.remove('open'); }
function closeCartOutside(e) { if (e.target.id === 'cart-overlay') closeCart(); }

function showToast(msg) {
    const t = document.getElementById('toast');
    if(t) {
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    }
}

function scrollToProducts() {
    const target = document.getElementById('products');
    if(target) target.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    applyRandomTheme();
    renderProducts();
});