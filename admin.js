// Admin Configuration
const ADMIN_CONFIG = {
    defaultAdmin: {
        username: 'owner',
        password: 'pollitos4',
        email: 'admin@polettolife.com',
        role: 'admin',
        permissions: {
            products: true,
            orders: true,
            users: true,
            settings: true,
            store: true
        }
    }
};

// Initialize Data
function initializeData() {
    // Initialize admin users if not exists
    if (!localStorage.getItem('poletto_admin_users')) {
        const adminUsers = [ADMIN_CONFIG.defaultAdmin];
        localStorage.setItem('poletto_admin_users', JSON.stringify(adminUsers));
    }

    // Initialize products if not exists
    if (!localStorage.getItem('poletto_products')) {
        const defaultProducts = [
            {
                id: 1,
                name: 'Lamborghini Huracán',
                description: 'سيارة رياضية فائقة السرعة مع أداء خارق',
                price: 25,
                category: 'vehicles',
                subcategory: 'sport',
                features: ['سرعة عالية', 'تعديلات كاملة'],
                image: '',
                imageUrl: '',
                badge: 'hot',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'شقة في وسط المدينة',
                description: 'شقة عصرية مع إطلالة رائعة على المدينة',
                price: 40,
                category: 'realestate',
                subcategory: 'apartment',
                features: ['3 غرف نوم', '2 حمام', 'موقف سيارات'],
                image: '',
                imageUrl: '',
                badge: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'حزمة المحترف',
                description: 'حزمة شاملة للمحترفين',
                price: 50,
                category: 'packages',
                subcategory: '',
                features: ['$50,000 في اللعبة', 'سيارة فاخرة', 'شقة كبيرة'],
                image: '',
                imageUrl: '',
                badge: 'premium',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('poletto_products', JSON.stringify(defaultProducts));
    }

    // Initialize orders if not exists
    if (!localStorage.getItem('poletto_orders')) {
        localStorage.setItem('poletto_orders', JSON.stringify([]));
    }

    // Initialize store settings if not exists
    if (!localStorage.getItem('poletto_store_settings')) {
        const settings = {
            storeName: '𝐏𝐨𝐥𝐞𝐭𝐭𝗼 𝗹𝗶𝗳 e ᶜᶠʷ',
            storeDescription: 'أفضل سيرفر CFW للعب Roleplay',
            discordLink: 'https://discord.gg/FRNyFAqv5',
            serverAddress: 'play.polettolife.com',
            paypalEnabled: true,
            visaEnabled: true,
            mastercardEnabled: true
        };
        localStorage.setItem('poletto_store_settings', JSON.stringify(settings));
    }
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (user) {
        if (user.status === 'inactive') {
            showToast('هذا الحساب معطل', 'error');
            return;
        }

        localStorage.setItem('poletto_current_admin', JSON.stringify(user));
        showDashboard();
        showToast('مرحباً ' + user.username + '!', 'success');
    } else {
        showToast('اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('poletto_current_admin');
    showLogin();
    showToast('تم تسجيل الخروج', 'success');
}

// Show Dashboard
function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    updateAdminInfo();
    loadDashboardData();
}

// Show Login
function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Update Admin Info
function updateAdminInfo() {
    const user = JSON.parse(localStorage.getItem('poletto_current_admin'));
    if (user) {
        document.getElementById('currentAdminName').textContent = user.username;
    }
}

// Check Auth
function checkAuth() {
    const user = localStorage.getItem('poletto_current_admin');
    if (user) {
        showDashboard();
    }
}

// Toggle Password Visibility
function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Sidebar Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        showSection(section);
    });
});

function showSection(section) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + 'Section').classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'لوحة التحكم',
        products: 'إدارة المنتجات',
        orders: 'إدارة الطلبات',
        users: 'إدارة المستخدمين',
        streamers: 'صناع المحتوى',
        settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Load section data
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'streamers':
            loadStreamersAdmin();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Dashboard Data
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('poletto_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalUsers').textContent = users.length;

    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.price, 0);
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue;

    // Load recent orders
    loadRecentOrders(orders);
}

function loadRecentOrders(orders) {
    const container = document.getElementById('recentOrdersList');
    const recentOrders = orders.slice(-5).reverse();

    if (recentOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>لا توجد طلبات بعد</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <span class="order-user">${order.username}</span>
                <span class="order-product">${order.product}</span>
            </div>
            <div class="order-meta">
                <span class="order-price">$${order.price}</span>
                <span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    const labels = {
        pending: 'قيد الانتظار',
        completed: 'مكتمل',
        cancelled: 'ملغى'
    };
    return labels[status] || status;
}

// Products Management
let currentImageData = null;

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
    const tbody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('productsEmptyState');

    if (products.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="table-image">
                    ${product.image || product.imageUrl 
                        ? `<img src="${product.image || product.imageUrl}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:10px;">`
                        : `<i class="fas fa-box"></i>`
                    }
                </div>
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.badge ? `<span class="product-badge-mini">${getBadgeLabel(product.badge)}</span>` : ''}
            </td>
            <td>${getCategoryLabel(product.category)}</td>
            <td>${product.subcategory ? getSubcategoryLabel(product.subcategory) : '-'}</td>
            <td><strong>$${product.price}</strong></td>
            <td><span class="status-badge ${product.status}">${product.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn-table" onclick="deleteProduct(${product.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getCategoryLabel(category) {
    const labels = {
        vehicles: 'مركبات',
        realestate: 'عقارات',
        business: 'مشاريع',
        packages: 'حزم',
        ranks: 'رتب'
    };
    return labels[category] || category;
}

function getSubcategoryLabel(sub) {
    const labels = {
        sport: 'رياضية',
        luxury: 'فاخرة',
        offroad: 'دفع رباعي',
        bike: 'دراجات',
        apartment: 'شقق',
        villa: 'فلل',
        mansion: 'قصور',
        shop: 'محلات',
        garage: 'معارض'
    };
    return labels[sub] || sub;
}

function getBadgeLabel(badge) {
    const labels = {
        hot: '🔥 الأكثر مبيعاً',
        new: '✨ جديد',
        sale: '💰 تخفيض',
        premium: '💎 فاخر',
        legendary: '⭐ أسطوري'
    };
    return labels[badge] || badge;
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    
    form.reset();
    currentImageData = null;
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    document.getElementById('removeImage').classList.add('hidden');
    document.getElementById('editProductId').value = '';

    if (productId) {
        const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (product) {
            title.textContent = 'تعديل المنتج';
            document.getElementById('editProductId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productSubcategory').value = product.subcategory || '';
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productFeatures').value = (product.features || []).join('\n');
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productImageUrl').value = product.imageUrl || '';

            if (product.image) {
                currentImageData = product.image;
                document.getElementById('imagePreview').src = product.image;
                document.getElementById('imagePreview').classList.remove('hidden');
                document.getElementById('uploadPlaceholder').classList.add('hidden');
                document.getElementById('removeImage').classList.remove('hidden');
            }
        }
    } else {
        title.textContent = 'إضافة منتج جديد';
    }

    modal.classList.add('active');
}

function editProduct(id) {
    openProductModal(id);
}

function saveProduct(e) {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
    const editId = document.getElementById('editProductId').value;

    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value,
        description: document.getElementById('productDescription').value,
        features: document.getElementById('productFeatures').value.split('\n').filter(f => f.trim()),
        image: currentImageData || '',
        imageUrl: document.getElementById('productImageUrl').value,
        badge: document.getElementById('productBadge').value,
        status: document.getElementById('productStatus').value
    };

    if (editId) {
        const index = products.findIndex(p => p.id === parseInt(editId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        productData.id = Date.now();
        productData.createdAt = new Date().toISOString();
        products.push(productData);
    }

    localStorage.setItem('poletto_products', JSON.stringify(products));
    closeModal('productModal');
    loadProducts();
    updateMainStore();
    showToast(editId ? 'تم تعديل المنتج' : 'تم إضافة المنتج', 'success');
}

function deleteProduct(id) {
    openDeleteModal('هل أنت متأكد من حذف هذا المنتج؟', () => {
        const products = JSON.parse(localStorage.getItem('poletto_products') || '[]');
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('poletto_products', JSON.stringify(filtered));
        loadProducts();
        updateMainStore();
        showToast('تم حذف المنتج', 'success');
    });
}

// Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        currentImageData = event.target.result;
        document.getElementById('imagePreview').src = currentImageData;
        document.getElementById('imagePreview').classList.remove('hidden');
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        document.getElementById('removeImage').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageData = null;
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    document.getElementById('removeImage').classList.add('hidden');
    document.getElementById('productImage').value = '';
}

// Orders Management
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('poletto_orders') || '[]');
    const filter = document.getElementById('orderFilter').value;
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }

    const tbody = document.getElementById('ordersTableBody');
    const emptyState = document.getElementById('ordersEmptyState');

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = filteredOrders.map((order, index) => `
        <tr>
            <td>#${order.id || index + 1}</td>
            <td>${order.username}</td>
            <td>${order.product}</td>
            <td><strong>$${order.price}</strong></td>
            <td>${order.payment}</td>
            <td>${new Date(order.date).toLocaleDateString('ar-SA')}</td>
            <td><span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>
                <div class="table-actions">
                    ${order.status === 'pending' ? `
                        <button class="edit-btn" onclick="updateOrderStatus(${index}, 'completed')" title="إكمال">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="delete-btn-table" onclick="updateOrderStatus(${index}, 'cancelled')" title="إلغاء">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    loadOrders();
}

function updateOrderStatus(index, status) {
    const orders = JSON.parse(localStorage.getItem('poletto_orders') || '[]');
    orders[index].status = status;
    localStorage.setItem('poletto_orders', JSON.stringify(orders));
    loadOrders();
    loadDashboardData();
    showToast('تم تحديث حالة الطلب', 'success');
}

// Users Management
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const tbody = document.getElementById('usersTableBody');

    tbody.innerHTML = users.map((user, index) => `
        <tr>
            <td>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}" 
                     alt="${user.username}" 
                     style="width:40px;height:40px;border-radius:10px;border:2px solid var(--primary);">
            </td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${getRoleLabel(user.role)}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
            <td><span class="status-badge ${user.status || 'active'}">${user.status === 'inactive' ? 'معطل' : 'نشط'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="editUser(${index})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.username !== 'owner' ? `
                        <button class="delete-btn-table" onclick="deleteUser(${index})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function getRoleLabel(role) {
    const labels = {
        admin: 'مدير',
        editor: 'محرر',
        viewer: 'مشاهد'
    };
    return labels[role] || role;
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalTitle');
    const passwordGroup = document.getElementById('passwordGroup');
    
    form.reset();
    document.getElementById('editUserId').value = '';

    if (userId !== null) {
        const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
        const user = users[userId];
        
        if (user) {
            title.textContent = 'تعديل المستخدم';
            document.getElementById('editUserId').value = userId;
            document.getElementById('newUsername').value = user.username;
            document.getElementById('newUserEmail').value = user.email;
            document.getElementById('newUserRole').value = user.role;
            document.getElementById('newUserStatus').value = user.status || 'active';
            passwordGroup.classList.add('hidden');

            if (user.permissions) {
                document.getElementById('permProducts').checked = user.permissions.products;
                document.getElementById('permOrders').checked = user.permissions.orders;
                document.getElementById('permUsers').checked = user.permissions.users;
                document.getElementById('permSettings').checked = user.permissions.settings;
                document.getElementById('permStore').checked = user.permissions.store;
            }
        }
    } else {
        title.textContent = 'إضافة مستخدم جديد';
        passwordGroup.classList.remove('hidden');
    }

    modal.classList.add('active');
}

function editUser(index) {
    openUserModal(index);
}

function saveUser(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const editId = document.getElementById('editUserId').value;
    
    const permissions = {
        products: document.getElementById('permProducts').checked,
        orders: document.getElementById('permOrders').checked,
        users: document.getElementById('permUsers').checked,
        settings: document.getElementById('permSettings').checked,
        store: document.getElementById('permStore').checked
    };

    const userData = {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('newUserEmail').value,
        role: document.getElementById('newUserRole').value,
        status: document.getElementById('newUserStatus').value,
        permissions: permissions
    };

    if (editId !== '') {
        const index = parseInt(editId);
        users[index] = { ...users[index], ...userData };
    } else {
        const password = document.getElementById('newUserPassword').value;
        if (!password) {
            showToast('يرجى إدخال كلمة المرور', 'error');
            return;
        }
        userData.password = password;
        userData.createdAt = new Date().toISOString();
        userData.status = 'active';
        users.push(userData);
    }

    localStorage.setItem('poletto_admin_users', JSON.stringify(users));
    closeModal('userModal');
    loadUsers();
    loadDashboardData();
    showToast(editId ? 'تم تعديل المستخدم' : 'تم إضافة المستخدم', 'success');
}

function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    if (users[index].username === 'owner') {
        showToast('لا يمكن حذف الحساب الرئيسي', 'error');
        return;
    }

    openDeleteModal('هل أنت متأكد من حذف هذا المستخدم؟', () => {
        users.splice(index, 1);
        localStorage.setItem('poletto_admin_users', JSON.stringify(users));
        loadUsers();
        loadDashboardData();
        showToast('تم حذف المستخدم', 'success');
    });
}

// Settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('poletto_store_settings') || '{}');
    
    document.getElementById('storeName').value = settings.storeName || '';
    document.getElementById('storeDescription').value = settings.storeDescription || '';
    document.getElementById('discordLink').value = settings.discordLink || '';
    document.getElementById('serverAddress').value = settings.serverAddress || '';
    
    // Discord settings
    document.getElementById('discordClientId').value = settings.discordClientId || '';
    document.getElementById('discordRedirectUri').value = settings.discordRedirectUri || '';
    document.getElementById('discordInvite').value = settings.discordInvite || 'https://discord.gg/FRNyFAqv5';
    
    // Load payment methods
    loadPaymentMethods();
}

function saveStoreSettings(e) {
    e.preventDefault();

    const settings = {
        storeName: document.getElementById('storeName').value,
        storeDescription: document.getElementById('storeDescription').value,
        discordLink: document.getElementById('discordLink').value,
        serverAddress: document.getElementById('serverAddress').value,
        paypalEnabled: document.getElementById('paypalEnabled').checked,
        visaEnabled: document.getElementById('visaEnabled').checked,
        mastercardEnabled: document.getElementById('mastercardEnabled').checked
    };

    localStorage.setItem('poletto_store_settings', JSON.stringify(settings));
    updateMainStore();
    showToast('تم حفظ الإعدادات', 'success');
}

function saveDiscordSettings(e) {
    e.preventDefault();
    const settings = JSON.parse(localStorage.getItem('poletto_store_settings') || '{}');
    settings.discordClientId = document.getElementById('discordClientId').value;
    settings.discordRedirectUri = document.getElementById('discordRedirectUri').value;
    settings.discordInvite = document.getElementById('discordInvite').value;
    localStorage.setItem('poletto_store_settings', JSON.stringify(settings));
    showToast('تم حفظ إعدادات الديسكورد', 'success');
}

// Payment Methods Management
function loadPaymentMethods() {
    const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
    const container = document.getElementById('paymentMethodsList');
    
    if (methods.length === 0) {
        // Initialize with default methods
        const defaultMethods = [
            { id: 1, name: 'PayPal', icon: 'fab fa-paypal', color: '#003087', status: 'active', details: '', instructions: '', order: 0 },
            { id: 2, name: 'Visa', icon: 'fab fa-cc-visa', color: '#1a1f71', status: 'active', details: '', instructions: '', order: 1 },
            { id: 3, name: 'Mastercard', icon: 'fab fa-cc-mastercard', color: '#eb001b', status: 'active', details: '', instructions: '', order: 2 }
        ];
        localStorage.setItem('poletto_payment_methods', JSON.stringify(defaultMethods));
        loadPaymentMethods();
        return;
    }

    container.innerHTML = methods.sort((a, b) => (a.order || 0) - (b.order || 0)).map(method => `
        <div class="payment-toggle">
            <div class="payment-info">
                <i class="${method.icon}" style="color: ${method.color}"></i>
                <span>${method.name}</span>
                ${method.status === 'inactive' ? '<span style="color: #ef4444; font-size: 0.75rem;">(معطل)</span>' : ''}
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="edit-btn" onclick="editPaymentMethod(${method.id})" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn-table" onclick="deletePaymentMethod(${method.id})" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
                <label class="switch">
                    <input type="checkbox" ${method.status === 'active' ? 'checked' : ''} onchange="togglePaymentMethod(${method.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `).join('');
}

function openPaymentMethodModal(id = null) {
    const modal = document.getElementById('paymentMethodModal');
    const form = document.getElementById('paymentMethodForm');
    const title = document.getElementById('paymentModalTitle');
    
    form.reset();
    document.getElementById('editPaymentMethodId').value = '';

    if (id) {
        const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
        const method = methods.find(m => m.id === id);
        
        if (method) {
            title.textContent = 'تعديل طريقة الدفع';
            document.getElementById('editPaymentMethodId').value = method.id;
            document.getElementById('paymentMethodName').value = method.name;
            document.getElementById('paymentMethodIcon').value = method.icon;
            document.getElementById('paymentMethodColor').value = method.color || '#00b4ff';
            document.getElementById('paymentMethodStatus').value = method.status;
            document.getElementById('paymentMethodDetails').value = method.details || '';
            document.getElementById('paymentMethodInstructions').value = method.instructions || '';
            document.getElementById('paymentMethodOrder').value = method.order || 0;
        }
    } else {
        title.textContent = 'إضافة طريقة دفع';
    }

    modal.classList.add('active');
}

function editPaymentMethod(id) {
    openPaymentMethodModal(id);
}

function savePaymentMethod(e) {
    e.preventDefault();
    const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
    const editId = document.getElementById('editPaymentMethodId').value;

    const methodData = {
        name: document.getElementById('paymentMethodName').value,
        icon: document.getElementById('paymentMethodIcon').value,
        color: document.getElementById('paymentMethodColor').value,
        status: document.getElementById('paymentMethodStatus').value,
        details: document.getElementById('paymentMethodDetails').value,
        instructions: document.getElementById('paymentMethodInstructions').value,
        order: parseInt(document.getElementById('paymentMethodOrder').value) || 0
    };

    if (editId) {
        const index = methods.findIndex(m => m.id === parseInt(editId));
        if (index !== -1) {
            methods[index] = { ...methods[index], ...methodData };
        }
    } else {
        methodData.id = Date.now();
        methods.push(methodData);
    }

    localStorage.setItem('poletto_payment_methods', JSON.stringify(methods));
    closeModal('paymentMethodModal');
    loadPaymentMethods();
    showToast(editId ? 'تم تعديل طريقة الدفع' : 'تم إضافة طريقة الدفع', 'success');
}

function deletePaymentMethod(id) {
    openDeleteModal('هل أنت متأكد من حذف طريقة الدفع هذه؟', () => {
        const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
        const filtered = methods.filter(m => m.id !== id);
        localStorage.setItem('poletto_payment_methods', JSON.stringify(filtered));
        loadPaymentMethods();
        showToast('تم حذف طريقة الدفع', 'success');
    });
}

function togglePaymentMethod(id, enabled) {
    const methods = JSON.parse(localStorage.getItem('poletto_payment_methods') || '[]');
    const method = methods.find(m => m.id === id);
    if (method) {
        method.status = enabled ? 'active' : 'inactive';
        localStorage.setItem('poletto_payment_methods', JSON.stringify(methods));
        loadPaymentMethods();
        showToast(enabled ? 'تم تفعيل طريقة الدفع' : 'تم تعطيل طريقة الدفع', 'success');
    }
}

function changePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const currentUser = JSON.parse(localStorage.getItem('poletto_current_admin'));
    const users = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (users[userIndex].password !== currentPassword) {
        showToast('كلمة المرور الحالية غير صحيحة', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('كلمتا المرور غير متطابقتين', 'error');
        return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('poletto_admin_users', JSON.stringify(users));
    localStorage.setItem('poletto_current_admin', JSON.stringify(users[userIndex]));

    document.getElementById('passwordForm').reset();
    showToast('تم تغيير كلمة المرور', 'success');
}

// Delete Modal
let deleteCallback = null;

function openDeleteModal(message, callback) {
    document.getElementById('deleteMessage').textContent = message;
    deleteCallback = callback;
    document.getElementById('confirmDeleteBtn').onclick = () => {
        if (deleteCallback) deleteCallback();
        closeModal('deleteModal');
    };
    document.getElementById('deleteModal').classList.add('active');
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Export Data
function exportData() {
    const data = {
        products: JSON.parse(localStorage.getItem('poletto_products') || '[]'),
        orders: JSON.parse(localStorage.getItem('poletto_orders') || '[]'),
        users: JSON.parse(localStorage.getItem('poletto_admin_users') || '[]'),
        settings: JSON.parse(localStorage.getItem('poletto_store_settings') || '{}'),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poletto-store-data-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('تم تصدير البيانات بنجاح', 'success');
}

// Update Main Store (notify about changes)
function updateMainStore() {
    // This function can be used to communicate with the main store
    // For now, we'll just trigger a storage event
    window.dispatchEvent(new Event('storage'));
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            modal.classList.remove('active');
        }
    });
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Streamers Management
function loadStreamersAdmin() {
    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    const tbody = document.getElementById('streamersTableBody');
    const emptyState = document.getElementById('streamersEmptyState');

    if (streamers.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    const platformIcons = {
        twitch: 'twitch',
        youtube: 'youtube',
        kick: 'bolt',
        tiktok: 'tiktok'
    };

    tbody.innerHTML = streamers.map((streamer, index) => `
        <tr>
            <td>
                <img src="${streamer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${streamer.username}`}" 
                     alt="${streamer.displayName}" 
                     style="width:45px;height:45px;border-radius:50%;border:2px solid var(--primary);object-fit:cover;">
            </td>
            <td><strong>${streamer.displayName}</strong></td>
            <td>@${streamer.username}</td>
            <td>
                <span class="meta-tag ${streamer.platform}" style="display:inline-flex;">
                    <i class="fab fa-${platformIcons[streamer.platform] || 'globe'}"></i>
                    ${streamer.platform}
                </span>
            </td>
            <td>${formatNumber(streamer.followers || 0)}</td>
            <td>
                <span class="status-badge ${streamer.isLive ? 'active' : 'inactive'}">
                    ${streamer.isLive ? 'مباشر' : 'أوفلاين'}
                </span>
            </td>
            <td>
                ${streamer.featured ? '<i class="fas fa-star" style="color: #f59e0b;"></i>' : '<i class="far fa-star" style="color: #666;"></i>'}
            </td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="editStreamer(${index})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn-table" onclick="deleteStreamer(${index})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openStreamerModal(index = null) {
    const modal = document.getElementById('streamerModal');
    const form = document.getElementById('streamerForm');
    const title = document.getElementById('streamerModalTitle');
    
    form.reset();
    document.getElementById('editStreamerId').value = '';

    if (index !== null) {
        const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
        const streamer = streamers[index];
        
        if (streamer) {
            title.textContent = 'تعديل صانع المحتوى';
            document.getElementById('editStreamerId').value = index;
            document.getElementById('streamerUsernameAdmin').value = streamer.username;
            document.getElementById('streamerDisplayNameAdmin').value = streamer.displayName;
            document.getElementById('streamerPlatformAdmin').value = streamer.platform;
            document.getElementById('streamerUrlAdmin').value = streamer.url;
            document.getElementById('streamerAvatarAdmin').value = streamer.avatar || '';
            document.getElementById('streamerBioAdmin').value = streamer.bio || '';
            document.getElementById('streamerFollowersAdmin').value = streamer.followers || 0;
            document.getElementById('streamerStatusAdmin').value = streamer.isLive ? 'true' : 'false';
            document.getElementById('streamerFeaturedAdmin').checked = streamer.featured || false;
        }
    } else {
        title.textContent = 'إضافة صانع محتوى جديد';
    }

    modal.classList.add('active');
}

function editStreamer(index) {
    openStreamerModal(index);
}

function saveStreamer(e) {
    e.preventDefault();

    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    const editId = document.getElementById('editStreamerId').value;

    const streamerData = {
        username: document.getElementById('streamerUsernameAdmin').value,
        displayName: document.getElementById('streamerDisplayNameAdmin').value,
        platform: document.getElementById('streamerPlatformAdmin').value,
        url: document.getElementById('streamerUrlAdmin').value,
        avatar: document.getElementById('streamerAvatarAdmin').value || `https://api.dicebear.com/7.x/avataaars/svg?seed=${document.getElementById('streamerUsernameAdmin').value}`,
        bio: document.getElementById('streamerBioAdmin').value,
        followers: parseInt(document.getElementById('streamerFollowersAdmin').value) || 0,
        isLive: document.getElementById('streamerStatusAdmin').value === 'true',
        featured: document.getElementById('streamerFeaturedAdmin').checked
    };

    if (editId !== '') {
        const index = parseInt(editId);
        streamers[index] = { ...streamers[index], ...streamerData };
    } else {
        streamerData.id = Date.now();
        streamers.push(streamerData);
    }

    localStorage.setItem('poletto_streamers', JSON.stringify(streamers));
    closeModal('streamerModal');
    loadStreamersAdmin();
    showToast(editId ? 'تم تعديل صانع المحتوى' : 'تم إضافة صانع المحتوى', 'success');
}

function deleteStreamer(index) {
    openDeleteModal('هل أنت متأكد من حذف هذا الصانع؟', () => {
        const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
        streamers.splice(index, 1);
        localStorage.setItem('poletto_streamers', JSON.stringify(streamers));
        loadStreamersAdmin();
        showToast('تم حذف صانع المحتوى', 'success');
    });
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    checkAuth();
});
