function applyRandomTheme() {
    const cssFiles = [
        '../src/assets/styles/style_one.css',
        '../src/assets/styles/style_two.css',
        '../src/assets/styles/style_three.css'
    ];
    
    let isReload = false;
    if (window.performance && window.performance.getEntriesByType) {
        const navEntries = window.performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            isReload = navEntries[0].type === 'reload';
        }
    }

    if (isReload) {
        sessionStorage.removeItem('selectedCss');
        sessionStorage.removeItem('selectedThemeIndex');
    }

    let selectedCss = sessionStorage.getItem('selectedCss');
    let themeIndex = sessionStorage.getItem('selectedThemeIndex');

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

    if (!selectedCss || themeIndex === null) {
        selectedCss = cssFiles[Math.floor(Math.random() * cssFiles.length)];
        themeIndex = Math.floor(Math.random() * themes.length).toString();
        sessionStorage.setItem('selectedCss', selectedCss);
        sessionStorage.setItem('selectedThemeIndex', themeIndex);
    }

    const themeLink = document.getElementById('theme-style') || document.querySelector('link[href*="assets/styles/"]');
    if (themeLink) {
        themeLink.onload = () => {
            document.body.style.opacity = '1';
        };
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 120);
        themeLink.href = selectedCss;
    } else {
        document.body.style.opacity = '1';
    }

    const selected = themes[parseInt(themeIndex)];
    const root = document.documentElement;
    root.style.setProperty('--rose', selected.colors.rose);
    root.style.setProperty('--cream', selected.colors.cream);
    root.style.setProperty('--black', selected.colors.black);
    root.style.setProperty('--nav-height', selected.layout.navHeight);
    root.style.setProperty('--radius', selected.layout.radius);
    root.style.setProperty('--img-ratio', selected.layout.ratio);
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (typeof products === 'undefined') {
        console.error("Erro: A variável 'products' não foi carregada. Verifique se o ficheiro products.js está correto.");
        grid.innerHTML = "<p>Erro ao carregar produtos.</p>";
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="goToProductDetail(${p.id})">
            <img src="${p.img}" alt="${p.name}">
            <span class="prod-name">${p.name}</span>
            <div class="prod-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
            <button class="btn-primary" style="margin-top:10px; width:100%" onclick="event.stopPropagation(); addToCart(${p.id})">
                Adicionar
            </button>
        </div>
    `).join('');
}

function goToProductDetail(id) {
    window.location.href = `product.html?id=${id}`;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (t) {
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    }
}

function scrollToProducts() {
    const target = document.getElementById('products');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'products.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    if (typeof updateCart === 'function') {
        updateCart();
    }
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
        });
        logo.addEventListener('dblclick', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('selectedCss');
            sessionStorage.removeItem('selectedThemeIndex');
            window.location.reload();
        });
    });
});

applyRandomTheme();