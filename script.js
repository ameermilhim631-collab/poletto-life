// Page Loader - Hide after load or max 3 seconds
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
}

window.addEventListener('load', () => {
    setTimeout(hideLoader, 1500);
});

// Fallback: force hide after 3 seconds no matter what
setTimeout(hideLoader, 3000);

// Also hide on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 2000);
});

// Page transition when clicking links
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && href.endsWith('.html')) {
            e.preventDefault();
            const loader = document.getElementById('pageLoader');
            if (loader) {
                loader.classList.remove('hidden');
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            } else {
                window.location.href = href;
            }
        }
    });
});

// Load products from localStorage
function loadProductsFromStorage() {
    const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
    return products;
}

// Generate product card HTML
function generateProductCard(product) {
    const categoryMap = {
        'vehicles': 'vehicle',
        'realestate': 'realestate',
        'business': 'business',
        'packages': 'package',
        'ranks': 'rank'
    };

    const badgeClass = {
        'hot': 'hot',
        'new': 'new',
        'sale': 'sale',
        'premium': 'premium',
        'legendary': 'legendary'
    };

    const badgeLabels = {
        'hot': '🔥 الأكثر مبيعاً',
        'new': '✨ جديد',
        'sale': '💰 تخفيض',
        'premium': '💎 فاخر',
        'legendary': '⭐ أسطوري'
    };

    const categoryIcons = {
        'vehicles': 'fa-car',
        'realestate': 'fa-home',
        'business': 'fa-store',
        'packages': 'fa-box-open',
        'ranks': 'fa-crown'
    };

    const imageHtml = product.image || product.imageUrl 
        ? `<img src="${product.image || product.imageUrl}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`
        : `<i class="fas ${categoryIcons[product.category] || 'fa-box'} vehicle-icon"></i>`;

    const featuresHtml = product.features && product.features.length > 0
        ? `<ul class="product-features-mini">${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>`
        : '';

    return `
        <div class="product-card" data-category="${product.subcategory || product.category}">
            ${product.badge ? `<div class="product-badge ${badgeClass[product.badge] || ''}">${badgeLabels[product.badge] || product.badge}</div>` : ''}
            <div class="product-image ${product.category === 'realestate' ? 'real-estate-img' : ''} ${product.category === 'business' ? 'business-img' : ''}">
                ${imageHtml}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                ${featuresHtml}
            </div>
            <div class="product-footer">
                <div class="product-price">
                    <span class="price">$${product.price}</span>
                </div>
                <button class="buy-btn" onclick="openCheckout('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${categoryMap[product.category] || product.category}')">
                    <i class="fas fa-shopping-cart"></i> شراء
                </button>
            </div>
        </div>
    `;
}

// Render products to section
function renderProductsToSection(sectionId, category) {
    const container = document.querySelector(`#${sectionId} .products-grid`);
    if (!container) return;

    const products = loadProductsFromStorage();
    const filteredProducts = products.filter(p => p.category === category && p.status === 'active');

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <p>لا توجد منتجات في هذا القسم بعد</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(p => generateProductCard(p)).join('');
}

// Render packages (pricing cards)
function renderPackages() {
    const container = document.querySelector('#packages .pricing-grid');
    if (!container) return;

    const products = loadProductsFromStorage();
    const packages = products.filter(p => p.category === 'packages' && p.status === 'active');

    if (packages.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <p>لا توجد حزم بعد</p>
            </div>
        `;
        return;
    }

    container.innerHTML = packages.map((pkg, index) => `
        <div class="pricing-card ${index === 1 ? 'featured' : ''}">
            ${index === 1 ? '<div class="pricing-badge">⭐ الأكثر طلباً</div>' : ''}
            <div class="pricing-icon"><i class="fas fa-box-open"></i></div>
            <div class="pricing-header">
                <h3>${pkg.name}</h3>
                <div class="pricing-price">
                    <span class="currency">$</span>
                    <span class="amount">${pkg.price}</span>
                </div>
            </div>
            <ul class="pricing-features">
                ${(pkg.features || []).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="pricing-btn ${index === 1 ? 'featured-btn' : ''}" onclick="openCheckout('${pkg.name.replace(/'/g, "\\'")}', ${pkg.price}, 'package')">اشترِ الحزمة</button>
        </div>
    `).join('');
}

// Render ranks
function renderRanks() {
    const container = document.querySelector('#ranks .products-grid');
    if (!container) return;

    const products = loadProductsFromStorage();
    const ranks = products.filter(p => p.category === 'ranks' && p.status === 'active');

    if (ranks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-crown"></i>
                <p>لا توجد رتب بعد</p>
            </div>
        `;
        return;
    }

    container.innerHTML = ranks.map(rank => {
        const featuresHtml = (rank.features || []).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
        return `
            <div class="product-card">
                ${rank.badge ? `<div class="product-badge ${rank.badge}">${getBadgeLabel(rank.badge)}</div>` : ''}
                <div class="product-image rank-img">
                    <i class="fas fa-crown vehicle-icon ${rank.badge || 'vip'}-icon"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${rank.name}</h3>
                    <p class="product-desc">${rank.description}</p>
                    <ul class="product-features-mini">${featuresHtml}</ul>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price">$${rank.price}</span>
                    </div>
                    <button class="buy-btn" onclick="openCheckout('${rank.name.replace(/'/g, "\\'")}', ${rank.price}, 'rank')">
                        <i class="fas fa-shopping-cart"></i> شراء
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getBadgeLabel(badge) {
    const labels = {
        'hot': '🔥 شهري',
        'premium': '💎 شهري',
        'legendary': '⭐ دائم'
    };
    return labels[badge] || badge;
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-links a, .mobile-nav-links button').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Products filter
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const section = e.target.closest('.products, .packages');
        const filterBtns = section.querySelectorAll('.filter-btn');
        const productCards = section.querySelectorAll('.product-card');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        
        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
});

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for counter animation
const statsSection = document.querySelector('.hero-stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchModal(fromId, toId) {
    closeModal(fromId);
    setTimeout(() => openModal(toId), 300);
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'loginModal' || 
            e.target.id === 'registerModal' || 
            e.target.id === 'checkoutModal') {
            closeModal(e.target.id);
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Check admin users first
    const adminUsers = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const adminUser = adminUsers.find(u => u.email === email && u.password === password);

    if (adminUser) {
        if (adminUser.status === 'inactive') {
            showToast('هذا الحساب معطل', 'error');
            return;
        }
        const user = {
            name: adminUser.username,
            email: adminUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser.username}`,
            isAdmin: true,
            role: adminUser.role
        };
        loginUser(user);
        closeModal('loginModal');
        showToast(`مرحباً ${adminUser.username}!`, 'success');
        return;
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('poletto_users') || '[]');
    const regUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (regUser) {
        const user = {
            name: regUser.name,
            email: regUser.email,
            discord: regUser.discord,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regUser.email}`
        };
        loginUser(user);
        closeModal('loginModal');
        showToast(`مرحباً ${regUser.name}!`, 'success');
        return;
    }

    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
}

// Register handler
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const discord = document.getElementById('registerDiscord').value;

    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('poletto_users') || '[]');
    if (registeredUsers.find(u => u.email === email)) {
        showToast('هذا البريد الإلكتروني مسجل بالفعل', 'error');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        discord: discord,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString()
    };

    registeredUsers.push(newUser);
    localStorage.setItem('poletto_users', JSON.stringify(registeredUsers));

    loginUser({
        name: name,
        email: email,
        discord: discord,
        avatar: newUser.avatar
    });
    closeModal('registerModal');
    showToast('تم إنشاء الحساب بنجاح!', 'success');
}

// Login with Discord
function loginWithDiscord() {
    // Read Client ID from settings
    const settings = JSON.parse(localStorage.getItem('poletto_store_settings') || '{}');
    const DISCORD_CLIENT_ID = settings.discordClientId || '';
    
    if (!DISCORD_CLIENT_ID) {
        showToast('يجب إعداد Client ID أولاً من لوحة التحكم', 'error');
        return;
    }
    
    // Discord OAuth
    const redirectUri = settings.discordRedirectUri || window.location.origin + '/auth-callback.html';
    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: 'identify email'
    });
    
    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

// Login user
function loginUser(user) {
    localStorage.setItem('poletto_user', JSON.stringify(user));
    if (user.isAdmin) {
        localStorage.setItem('poletto_current_admin', JSON.stringify(user));
    }
    updateUIForLoggedInUser(user);
    checkAdminLink();
}

// Logout
function logout() {
    localStorage.removeItem('poletto_user');
    localStorage.removeItem('poletto_current_admin');
    updateUIForLoggedOutUser();
    checkAdminLink();
    showToast('تم تسجيل الخروج', 'success');
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userSection = document.getElementById('userSection');
    const authButtons = document.getElementById('authButtons');
    
    userSection.classList.remove('hidden');
    authButtons.classList.add('hidden');
    
    userSection.querySelector('.user-avatar').src = user.avatar;
    userSection.querySelector('.user-name').textContent = user.name;
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const userSection = document.getElementById('userSection');
    const authButtons = document.getElementById('authButtons');
    
    userSection.classList.add('hidden');
    authButtons.classList.remove('hidden');
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('poletto_user');
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    }
    
    // Show admin link only for owner
    checkAdminLink();
}

// Check admin link visibility
function checkAdminLink() {
    const adminLink = document.getElementById('adminLink');
    if (!adminLink) return;
    
    const adminUser = JSON.parse(localStorage.getItem('poletto_current_admin'));
    const isOwner = adminUser && adminUser.role === 'admin' && adminUser.username === 'owner';
    
    adminLink.style.display = isOwner ? 'flex' : 'none';
}

// Copy server IP
function copyServerIP() {
    const ip = document.getElementById('ipAddress').textContent;
    navigator.clipboard.writeText(ip).then(() => {
        showToast('تم نسخ عنوان السيرفر!', 'success');
    }).catch(() => {
        showToast('فشل نسخ العنوان', 'error');
    });
}

// Checkout functionality
let checkoutData = {
    product: '',
    price: 0,
    type: ''
};

function openCheckout(productName, price, type) {
    const user = localStorage.getItem('poletto_user');
    if (!user) {
        openModal('loginModal');
        showToast('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    checkoutData = { product: productName, price: price, type: type };
    
    document.getElementById('checkoutProductName').textContent = productName;
    document.getElementById('checkoutProductPrice').textContent = '$' + price;
    document.getElementById('checkoutProductType').textContent = getTypeLabel(type);
    document.getElementById('summaryProduct').textContent = productName;
    document.getElementById('summaryTotal').textContent = '$' + price;
    
    const iconEl = document.getElementById('checkoutProductIcon');
    iconEl.className = 'fas ' + getTypeIcon(type);
    
    goToStep(1);
    
    openModal('checkoutModal');
}

function getTypeLabel(type) {
    const labels = {
        'vehicle': 'مركبة',
        'realestate': 'عقار',
        'business': 'مشروع تجاري',
        'package': 'حزمة',
        'rank': 'رتبة'
    };
    return labels[type] || 'منتج';
}

function getTypeIcon(type) {
    const icons = {
        'vehicle': 'fa-car',
        'realestate': 'fa-home',
        'business': 'fa-store',
        'package': 'fa-box-open',
        'rank': 'fa-crown'
    };
    return icons[type] || 'fa-box';
}

function goToStep(step) {
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.getElementById('checkoutStep' + step).classList.add('active');
    
    document.querySelectorAll('.checkout-steps .step').forEach((s, i) => {
        if (i + 1 <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function nextStep(step) {
    goToStep(step);
}

function prevStep(step) {
    goToStep(step);
}

function completePurchase() {
    const username = document.getElementById('checkoutUsername').value;
    const email = document.getElementById('checkoutEmail').value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'paypal';
    
    if (!username || !email) {
        showToast('يرجى ملء جميع البيانات المطلوبة', 'error');
        return;
    }
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('poletto_orders') || '[]');
    orders.push({
        id: Date.now(),
        username: username,
        email: email,
        product: checkoutData.product,
        price: checkoutData.price,
        type: checkoutData.type,
        payment: payment,
        status: 'pending',
        date: new Date().toISOString()
    });
    localStorage.setItem('poletto_orders', JSON.stringify(orders));
    
    closeModal('checkoutModal');
    showToast('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً عبر الديسكورد', 'success');
    
    document.getElementById('checkoutUsername').value = '';
    document.getElementById('checkoutEmail').value = '';
    document.getElementById('checkoutIGN').value = '';
}

// FAQ toggle
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Payment Methods
function loadPaymentMethods() {
    const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
    const activeMethods = methods.filter(m => m.status === 'active').sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Update checkout modal payment options
    const paymentContainer = document.querySelector('#checkoutModal .payment-methods');
    if (paymentContainer && activeMethods.length > 0) {
        paymentContainer.innerHTML = activeMethods.map((method, index) => `
            <label class="payment-option">
                <input type="radio" name="payment" value="${method.name.toLowerCase()}" ${index === 0 ? 'checked' : ''}>
                <div class="payment-card">
                    <i class="${method.icon}" style="color: ${method.color}"></i>
                    <span>${method.name}</span>
                </div>
            </label>
        `).join('');
        
        // Re-bind payment selection events
        document.querySelectorAll('input[name="payment"]').forEach(input => {
            input.addEventListener('change', (e) => {
                document.getElementById('summaryPayment').textContent = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
            });
        });
    }
    
    return activeMethods;
}

// Payment method selection (for initial load)
document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener('change', (e) => {
        document.getElementById('summaryPayment').textContent = 
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    });
});

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Create particles for hero section
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = Math.random() * 20 + 10 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// Add particle styles dynamically
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    .particle {
        position: absolute;
        background: var(--primary);
        border-radius: 50%;
        opacity: 0.3;
        animation: particleFloat linear infinite;
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles
createParticles();

// Add active class to current nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const activeLinkStyles = document.createElement('style');
activeLinkStyles.textContent = `
    .nav-links a.active {
        color: var(--primary);
    }
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyles);

// Render Streamers Preview
function renderStreamersPreview() {
    const container = document.getElementById('streamersPreviewGrid');
    if (!container) return;

    const apiBase = window.location.origin + '/api/streamers';
    fetch(apiBase)
        .then(r => r.json())
        .then(streamers => {
            renderStreamersPreviewData(streamers, container);
        })
        .catch(() => {
            fetch('streamers.json')
                .then(r => r.json())
                .then(streamers => {
                    if (streamers.length === 0) {
                        const local = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
                        if (local.length > 0) streamers = local;
                    }
                    renderStreamersPreviewData(streamers, container);
                })
                .catch(() => {
                    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
                    renderStreamersPreviewData(streamers, container);
                });
        });
}

function renderStreamersPreviewData(streamers, container) {
    const featured = streamers.filter(s => s.featured || s.isLive).slice(0, 4);

    if (featured.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-video-slash"></i>
                <p>قريباً: صناع محتوى مميزين</p>
            </div>
        `;
        return;
    }

    const platformIcons = {
        twitch: 'twitch',
        youtube: 'youtube',
        kick: 'bolt',
        tiktok: 'tiktok'
    };

    container.innerHTML = featured.map(streamer => `
        <div class="streamer-preview-card ${streamer.isLive ? 'live' : ''}">
            <img src="${streamer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${streamer.username}`}" 
                 alt="${streamer.displayName}" 
                 class="streamer-preview-avatar">
            <h3 class="streamer-preview-name">${streamer.displayName}</h3>
            <div class="streamer-preview-platform ${streamer.platform}">
                <i class="fab fa-${platformIcons[streamer.platform] || 'globe'}"></i>
                @${streamer.username}
            </div>
            <div class="streamer-preview-status">
                <span class="status-dot ${streamer.isLive ? 'online' : 'offline'}"></span>
                ${streamer.isLive ? 'بث مباشر الآن' : 'أوفلاين'}
            </div>
            <a href="${streamer.url}" target="_blank" class="btn-primary" style="margin-top: 15px; display: inline-flex;">
                <i class="fas fa-external-link-alt"></i>
                ${streamer.isLive ? 'شاهد الآن' : 'فتح الحساب'}
            </a>
        </div>
    `).join('');
}

// Check for successful login from OAuth
function checkOAuthLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
        const user = JSON.parse(localStorage.getItem('poletto_user'));
        if (user) {
            showToast(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح`, 'success');
            updateUIForLoggedInUser(user);
        }
        // Clear the URL parameter
        window.history.replaceState(null, null, window.location.pathname);
    }
}

// Initialize default data
function initializeDefaultData() {
    if (!localStorage.getItem('poletto_admin_users')) {
        localStorage.setItem('poletto_admin_users', JSON.stringify([{
            username: 'owner',
            password: 'pollitos4',
            email: 'admin@polettolife.com',
            role: 'admin',
            permissions: { products: true, orders: true, users: true, settings: true, store: true }
        }]));
    }
    if (!localStorage.getItem('poletto_products')) {
        localStorage.setItem('poletto_products', JSON.stringify([]));
    }
    if (!localStorage.getItem('poletto_orders')) {
        localStorage.setItem('poletto_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('poletto_store_settings')) {
        localStorage.setItem('poletto_store_settings', JSON.stringify({
            storeName: 'Poletto Life',
            discordLink: 'https://discord.gg/FRNyFAqv5',
            serverAddress: 'play.polettolife.com'
        }));
    }
    if (!localStorage.getItem('poletto_users')) {
        localStorage.setItem('poletto_users', JSON.stringify([]));
    }
    if (!localStorage.getItem('poletto_streamers')) {
        localStorage.setItem('poletto_streamers', JSON.stringify([]));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultData();
    checkAuth();
    checkOAuthLogin();
    renderProductsToSection('vehicles', 'vehicles');
    renderProductsToSection('realestate', 'realestate');
    renderProductsToSection('products', 'business');
    renderPackages();
    renderRanks();
    renderStreamersPreview();
    loadPaymentMethods();
});

// Listen for storage changes
window.addEventListener('storage', () => {
    renderProductsToSection('vehicles', 'vehicles');
    renderProductsToSection('realestate', 'realestate');
    renderProductsToSection('products', 'business');
    renderPackages();
    renderRanks();
});

// ============================================
// PREMIUM ENHANCEMENTS - Interactive Effects
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {

// Cursor Glow Effect
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Hide cursor glow on mobile
if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
}

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Add scroll-reveal class to sections
document.querySelectorAll('.products, .packages, .streamers-preview, .contact, .faq').forEach(section => {
    section.classList.add('scroll-reveal');
    scrollObserver.observe(section);
});

// 3D Tilt Effect on Product Cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Copy Server IP with Animation
function copyServerIP() {
    const ip = document.getElementById('ipAddress').textContent;
    const copyBtn = document.querySelector('.copy-btn');
    
    navigator.clipboard.writeText(ip).then(() => {
        copyBtn.classList.add('copied');
        showToast('تم نسخ عنوان السيرفر!', 'success');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        showToast('فشل نسخ العنوان', 'error');
    });
}

// Enhanced Counter Animation with Easing
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Smooth Reveal for FAQ Items
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Close other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        } else {
            answer.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
        }
    });
});

}); // End DOMContentLoaded
