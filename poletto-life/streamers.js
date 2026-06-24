// Streamers Page JavaScript

// =====================
// Discord OAuth Config
// =====================
// لتفعيل تسجيل الدخول بالديسكورد:
// 1. اذهب إلى https://discord.com/developers/applications
// 2. أنشئ تطبيق جديد
// 3. انسخ Client ID من OAuth2 → General
// 4. أضف Redirect URI في OAuth2 → Redirects
// 5. ضع Client ID في الأسفل

// Will be loaded from settings
let DISCORD_CLIENT_ID = '';

// Default Streamers Data
const defaultStreamers = [
    {
        id: 1,
        username: 'boltx',
        displayName: 'BoltX',
        platform: 'twitch',
        url: 'https://twitch.tv/boltx',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/8a734da9-21b0-4c82-b451-0e3d76bc375c-profile_image-300x300.png',
        banner: '',
        bio: 'بثوث مباشرة من سيرفر بوليتو لايف - roleplay احترافي',
        isLive: false,
        followers: 45000,
        featured: true
    },
    {
        id: 2,
        username: 'mansourko',
        displayName: ' MansourKO',
        platform: 'youtube',
        url: 'https://youtube.com/@mansourko',
        avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_kJxVJhXQzQzQzQzQzQzQzQzQzQzQzQzQzQzQ=s300-c-k-c0x00ffffff-no-rj',
        banner: '',
        bio: 'محتوى CFW حصري - دليل وتعليم.roleplay',
        isLive: true,
        followers: 120000,
        featured: true
    },
    {
        id: 3,
        username: 'hika',
        displayName: 'Hika',
        platform: 'kick',
        url: 'https://kick.com/hika',
        avatar: 'https://files.kick.com/images/avatars/a1b2c3d4/profile_300x300.jpg',
        banner: '',
        bio: 'بثوث مباشرة من السيرفر - اقوى اللحظات',
        isLive: false,
        followers: 28000,
        featured: true
    },
    {
        id: 4,
        username: 'hmashri',
        displayName: 'HMashri',
        platform: 'twitch',
        url: 'https://twitch.tv/hmashri',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/hmashri-profile_image-300x300.png',
        banner: '',
        bio: 'roleplay specialist - محتوى مميز وسخيف',
        isLive: false,
        followers: 35000,
        featured: true
    },
    {
        id: 5,
        username: 'q0tb',
        displayName: 'Q0TB',
        platform: 'youtube',
        url: 'https://youtube.com/@q0tb',
        avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_q0tb-profile.jpg',
        banner: '',
        bio: 'فيديوهات تعليمية وسخيفة من السيرفر',
        isLive: false,
        followers: 18000,
        featured: false
    },
    {
        id: 6,
        username: '3mzone',
        displayName: '3MZone',
        platform: 'twitch',
        url: 'https://twitch.tv/3mzone',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3mzone-profile_image-300x300.png',
        banner: '',
        bio: 'بثوث يومية - أكبر مجتمع roleplay عربي',
        isLive: false,
        followers: 52000,
        featured: true
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Hide page loader
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.classList.add('hidden');
    }, 1500);
    
    initializeStreamers();
    checkAuth();
    loadStreamers();
    createParticles();
    animateStats();
    setupFilters();
    handleOAuthCallback();
    
    // Hide add streamer section by default, then check permission
    const addSection = document.getElementById('addStreamerSection');
    if (addSection) addSection.style.display = 'none';
    
    // Check admin access after a short delay
    setTimeout(() => {
        checkAdminAccess();
    }, 100);
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

// Initialize Streamers Data
function initializeStreamers() {
    if (!localStorage.getItem('poletto_streamers')) {
        localStorage.setItem('poletto_streamers', JSON.stringify(defaultStreamers));
    }
}

// Load Streamers
function loadStreamers() {
    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    const grid = document.getElementById('streamersGrid');
    const avatarCloud = document.getElementById('avatarCloud');
    const liveFrame = document.getElementById('liveFrame');

    // Filter live streamers only
    const liveStreamers = streamers.filter(s => s.isLive);

    // Update live frame - only show if there are live streamers
    if (liveFrame) {
        if (liveStreamers.length > 0) {
            liveFrame.classList.add('visible');
            
            // Update avatar cloud with live streamers
            if (avatarCloud) {
                avatarCloud.innerHTML = liveStreamers.slice(0, 5).map(s => {
                    const avatarSrc = s.avatar && s.avatar.trim() !== '' 
                        ? s.avatar 
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                    return `<img src="${avatarSrc}" alt="${s.displayName}" loading="lazy" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}&backgroundColor=b6e3f4'">`;
                }).join('');
            }
        } else {
            liveFrame.classList.remove('visible');
        }
    }

    // Update count
    const countEl = document.getElementById('streamersCount');
    if (countEl) {
        countEl.textContent = streamers.length;
    }

    // Render streamer cards
    renderStreamers(streamers);
}

function renderStreamers(streamers) {
    const grid = document.getElementById('streamersGrid');
    if (!grid) return;
    
    if (streamers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 60px; text-align: center;">
                <i class="fas fa-video-slash" style="font-size: 4rem; color: var(--text-muted); opacity: 0.5; margin-bottom: 20px; display: block;"></i>
                <p style="color: var(--text-muted); font-size: 1.1rem;">لا يوجد صناع محتوى بعد</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = streamers.map(streamer => {
        const avatarSrc = streamer.avatar && streamer.avatar.trim() !== '' 
            ? streamer.avatar 
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${streamer.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
        
        const bannerSrc = streamer.banner && streamer.banner.trim() !== '' 
            ? streamer.banner 
            : null;

        return `
            <div class="streamer-card ${streamer.isLive ? 'live' : ''}" data-platform="${streamer.platform}" data-live="${streamer.isLive}" data-featured="${streamer.featured}">
                <div class="streamer-banner">
                    ${bannerSrc ? `<img src="${bannerSrc}" alt="banner" onerror="this.style.display='none'">` : ''}
                </div>
                <img src="${avatarSrc}" alt="${streamer.displayName}" class="streamer-avatar" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${streamer.username}&backgroundColor=b6e3f4'">
                <div class="streamer-content">
                    <h3 class="streamer-name">${streamer.displayName}</h3>
                    <div class="streamer-username">
                        <i class="fab fa-${getPlatformIcon(streamer.platform)}"></i>
                        @${streamer.username}
                    </div>
                    <p class="streamer-bio">${streamer.bio || 'صناع محتوى بوليتو لايف'}</p>
                    <div class="streamer-meta">
                        <span class="meta-tag ${streamer.platform}">
                            <i class="fab fa-${getPlatformIcon(streamer.platform)}"></i>
                            ${getPlatformName(streamer.platform)}
                        </span>
                        <span class="meta-tag">
                            <i class="fas fa-users"></i>
                            ${formatNumber(streamer.followers || 0)} متابع
                        </span>
                        ${streamer.featured ? '<span class="meta-tag" style="color: #f59e0b;"><i class="fas fa-star"></i> مميز</span>' : ''}
                    </div>
                    <div class="streamer-status">
                        <span class="status-dot ${streamer.isLive ? 'online' : 'offline'}"></span>
                        ${streamer.isLive ? 'بث مباشر الآن' : 'أوفلاين'}
                    </div>
                </div>
                <div class="streamer-actions">
                    <a href="${streamer.url}" target="_blank" class="watch-btn">
                        <i class="fas fa-${streamer.isLive ? 'play' : 'external-link-alt'}"></i>
                        ${streamer.isLive ? 'شاهد الآن' : 'فتح الحساب'}
                    </a>
                    <button class="profile-btn" onclick="viewStreamer(${streamer.id})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Helper Functions
function getPlatformIcon(platform) {
    const icons = {
        twitch: 'twitch',
        youtube: 'youtube',
        kick: 'bolt',
        tiktok: 'tiktok'
    };
    return icons[platform] || 'globe';
}

function getPlatformName(platform) {
    const names = {
        twitch: 'Twitch',
        youtube: 'YouTube',
        kick: 'Kick',
        tiktok: 'TikTok'
    };
    return names[platform] || platform;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Filters
function setupFilters() {
    document.querySelectorAll('.streamers-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.streamers-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
            
            let filtered;
            switch(filter) {
                case 'live':
                    filtered = streamers.filter(s => s.isLive);
                    break;
                case 'offline':
                    filtered = streamers.filter(s => !s.isLive);
                    break;
                case 'top':
                    filtered = [...streamers].sort((a, b) => (b.followers || 0) - (a.followers || 0));
                    break;
                default:
                    filtered = streamers;
            }

            renderStreamers(filtered);
        });
    });
}

// View Streamer Details
function viewStreamer(id) {
    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    const streamer = streamers.find(s => s.id === id);
    
    if (streamer) {
        alert(`
الاسم: ${streamer.displayName}
المستخدم: @${streamer.username}
المنصة: ${getPlatformName(streamer.platform)}
المتابعون: ${formatNumber(streamer.followers || 0)}
الحالة: ${streamer.isLive ? 'بث مباشر' : 'أوفلاين'}
الوصف: ${streamer.bio || 'لا يوجد وصف'}
        `);
    }
}

// Add Streamer (Admin Only) - فحص أمان مضاعف
function addStreamer(e) {
    e.preventDefault();
    
    // فحص الصلاحية أولاً - يجب أن يكون owner
    if (!checkStreamerPermission()) {
        showToast('ليس لديك صلاحية لتنفيذ هذا الإجراء', 'error');
        return;
    }
    
    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    
    const newStreamer = {
        id: Date.now(),
        username: document.getElementById('streamerUsername').value,
        displayName: document.getElementById('streamerDisplayName').value,
        platform: document.getElementById('streamerPlatform').value,
        url: document.getElementById('streamerUrl').value,
        avatar: document.getElementById('streamerAvatar').value || `https://api.dicebear.com/7.x/avataaars/svg?seed=${document.getElementById('streamerUsername').value}&backgroundColor=b6e3f4`,
        bio: document.getElementById('streamerBio').value,
        isLive: false,
        followers: 0,
        featured: false,
        addedBy: 'owner'
    };

    streamers.push(newStreamer);
    localStorage.setItem('poletto_streamers', JSON.stringify(streamers));
    
    document.getElementById('addStreamerForm').reset();
    loadStreamers();
    showToast('تم إضافة صانع المحتوى بنجاح!', 'success');
}

// Check Admin Access - فقط المدير (Owner) يقدر يشوف نموذج الإضافة
function checkAdminAccess() {
    const addSection = document.getElementById('addStreamerSection');
    const adminLink = document.getElementById('adminLink');
    
    // فحص أمان: التحقق من تسجيل الدخول كمدير من لوحة التحكم
    const adminUser = JSON.parse(localStorage.getItem('poletto_current_admin'));
    const isOwner = adminUser && adminUser.role === 'admin' && adminUser.username === 'owner';
    
    // إظهار/إخفاء نموذج الإضافة
    if (addSection) {
        addSection.style.display = isOwner ? 'block' : 'none';
    }
    
    // إظهار/إخفاء رابط لوحة التحكم
    if (adminLink) {
        adminLink.style.display = isOwner ? 'flex' : 'none';
    }
}

// فحص الصلاحية - يُستدعى قبل أي عملية تعديل
function checkStreamerPermission() {
    const adminUser = JSON.parse(localStorage.getItem('poletto_current_admin'));
    return adminUser && adminUser.role === 'admin' && adminUser.username === 'owner';
}

// =====================
// Discord Login
// =====================
function loginWithDiscord() {
    // Read Client ID from settings
    const settings = JSON.parse(localStorage.getItem('poletto_store_settings') || '{}');
    const clientId = settings.discordClientId || DISCORD_CLIENT_ID;
    
    if (!clientId) {
        showToast('يجب إعداد Client ID أولاً من لوحة التحكم', 'error');
        return;
    }

    // Discord OAuth
    const redirectUri = settings.discordRedirectUri || window.location.origin + '/auth-callback.html';
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: 'identify email'
    });
    
    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

// Handle OAuth Callback
function handleOAuthCallback() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
        fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        .then(r => r.json())
        .then(user => {
            if (user.id) {
                const userData = {
                    id: user.id,
                    name: user.global_name || user.username,
                    email: user.email || `${user.username}@discord.local`,
                    avatar: user.avatar 
                        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                    discord: {
                        id: user.id,
                        username: user.username,
                        discriminator: user.discriminator,
                        global_name: user.global_name
                    }
                };

                loginUser(userData);
                showToast(`مرحباً ${user.global_name || user.username}!`, 'success');
                window.history.replaceState(null, null, window.location.pathname);
            }
        })
        .catch(err => {
            console.error('Discord Error:', err);
            showToast('حدث خطأ أثناء تسجيل الدخول', 'error');
        });
    }
}

// Auth Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const adminUsers = JSON.parse(localStorage.getItem('poletto_admin_users') || '[]');
    const adminUser = adminUsers.find(u => u.email === email && u.password === password);
    
    if (adminUser) {
        loginUser({
            name: adminUser.username,
            email: adminUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser.username}&backgroundColor=b6e3f4`,
            isAdmin: true,
            role: adminUser.role
        });
        closeModal('loginModal');
        showToast(`مرحباً ${adminUser.username}!`, 'success');
        checkAdminAccess();
        return;
    }
    
    loginUser({
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`
    });
    closeModal('loginModal');
    showToast('تم تسجيل الدخول بنجاح!', 'success');
}

function handleRegister(e) {
    e.preventDefault();
    const user = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        discord: document.getElementById('registerDiscord').value,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${document.getElementById('registerEmail').value}&backgroundColor=b6e3f4`
    };
    
    loginUser(user);
    closeModal('registerModal');
    showToast('تم إنشاء الحساب بنجاح!', 'success');
}

function loginUser(user) {
    localStorage.setItem('poletto_user', JSON.stringify(user));
    updateUIForLoggedInUser(user);
    
    // Check admin access after login
    setTimeout(() => {
        checkAdminAccess();
    }, 100);
}

function logout() {
    localStorage.removeItem('poletto_user');
    localStorage.removeItem('poletto_current_admin');
    updateUIForLoggedOutUser();
    
    // Hide admin sections
    const addSection = document.getElementById('addStreamerSection');
    const adminLink = document.getElementById('adminLink');
    if (addSection) addSection.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
    
    showToast('تم تسجيل الخروج', 'success');
}

function updateUIForLoggedInUser(user) {
    const userSection = document.getElementById('userSection');
    const authButtons = document.getElementById('authButtons');
    
    if (userSection) userSection.classList.remove('hidden');
    if (authButtons) authButtons.classList.add('hidden');
    
    if (userSection) {
        userSection.querySelector('.user-avatar').src = user.avatar;
        userSection.querySelector('.user-name').textContent = user.name;
    }
}

function updateUIForLoggedOutUser() {
    const userSection = document.getElementById('userSection');
    const authButtons = document.getElementById('authButtons');
    
    if (userSection) userSection.classList.add('hidden');
    if (authButtons) authButtons.classList.remove('hidden');
}

function checkAuth() {
    const user = localStorage.getItem('poletto_user');
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    }
}

// Modal Functions
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

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Particles
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = Math.random() * 20 + 10 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// Animate Stats
function animateStats() {
    const countEl = document.getElementById('streamersCount');
    if (!countEl) return;
    
    const streamers = JSON.parse(localStorage.getItem('poletto_streamers') || '[]');
    let current = 0;
    const target = streamers.length;
    const duration = 1500;
    const step = target / (duration / 16);
    
    const animate = () => {
        current += step;
        if (current < target) {
            countEl.textContent = Math.floor(current);
            requestAnimationFrame(animate);
        } else {
            countEl.textContent = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(countEl);
}

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.mobile-nav-links a, .mobile-nav-links button').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});
