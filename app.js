/* ============================================
   PowerHit Cricket Store - JavaScript
   Cart, Search, Filter & Animations
   ============================================ */

// ============================================
// Cart System
// ============================================
let cart = JSON.parse(localStorage.getItem('powerhitCart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart function
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Added to cart!');
    
    // Open cart sidebar
    openCartSidebar();
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Update quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('powerhitCart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p style="text-align: center; color: var(--color-gray); padding: var(--space-xl);">
                <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.3;"></i>
                Your cart is empty
            </p>
        `;
        if (cartTotal) cartTotal.textContent = '$0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ============================================
// Cart Sidebar Toggle
// ============================================
function openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Notification System
// ============================================
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 24px;
        background: var(--color-primary);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 20px rgba(13, 77, 43, 0.4);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Product Filtering
// ============================================
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter products
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            product.style.display = 'none';
        }
    });
}

// ============================================
// Product Search
// ============================================
function initProductSearch() {
    const searchInput = document.getElementById('productSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                const category = product.querySelector('.product-category').textContent.toLowerCase();
                
                if (name.includes(query) || category.includes(query)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}

// ============================================
// Checkout Functions
// ============================================
function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems) return;
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div class="order-summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = html;
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${(subtotal + 10).toFixed(2)}`;
}

// ============================================
// Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                showNotification('Form submitted successfully!');
                form.reset();
            }
        });
    });
}

// ============================================
// Cart Page Functions
// ============================================
function renderCartPage() {
    const cartPageItems = document.getElementById('cartPageItems');
    const cartPageSubtotal = document.getElementById('cartPageSubtotal');
    const cartPageTotal = document.getElementById('cartPageTotal');
    
    if (!cartPageItems) return;
    
    if (cart.length === 0) {
        cartPageItems.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-shopping-bag" style="font-size: 80px; color: var(--color-gray); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 16px;">Your cart is empty</h3>
                <p style="margin-bottom: 24px;">Looks like you haven't added anything to your cart yet.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        if (cartPageSubtotal) cartPageSubtotal.textContent = '$0.00';
        if (cartPageTotal) cartPageTotal.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div class="cart-item" style="display: flex; gap: 20px; padding: 20px; background: var(--color-charcoal); border-radius: 12px; margin-bottom: 16px;">
                <div style="width: 120px; height: 120px; border-radius: 8px; overflow: hidden;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 8px;">${item.name}</h4>
                    <p style="color: var(--color-gold); font-weight: 600; margin-bottom: 12px;">$${item.price}</p>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1); renderCartPage();">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span style="font-weight: 600;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1); renderCartPage();">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;">
                    <button onclick="removeFromCart(${item.id}); renderCartPage();" style="color: var(--color-gray); font-size: 18px; background: none; border: none; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                    <p style="font-weight: 700; font-size: 18px;">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `;
    });
    
    cartPageItems.innerHTML = html;
    if (cartPageSubtotal) cartPageSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartPageTotal) cartPageTotal.textContent = `$${(subtotal + 10).toFixed(2)}`;
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    updateCartCount();
    renderCartItems();
    
    // Initialize components
    initMobileMenu();
    initNavbarScroll();
    initScrollAnimations();
    initProductSearch();
    initFormValidation();
    
    // Cart sidebar events
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartSidebar();
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    // Filter buttons event listeners
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterProducts(btn.dataset.category);
        });
    });
    
    // Initialize cart page if on cart page
    renderCartPage();
    
    // Initialize checkout page if on checkout page
    renderCheckoutItems();
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);
