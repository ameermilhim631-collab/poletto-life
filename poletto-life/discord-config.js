// Discord OAuth Configuration
// لتفعيل تسجيل الدخول بالديسكورد، اتبع الخطوات التالية:

/*
===================================
خطوات إعداد تسجيل الدخول بالديسكورد:
===================================

1. اذهب إلى: https://discord.com/developers/applications

2. أنشئ تطبيق جديد:
   - اضغط "New Application"
   - أدخل اسم (مثل: Poletto Life Store)
   - اضغط "Create"

3. احصل على Client ID:
   - من القائمة الجانبية → OAuth2 → General
   - انسخ "Client ID"

4. أضف Redirect URI:
   - من OAuth2 → Redirects
   - اضغط "Add Redirect"
   - أضف: http://localhost/auth-callback.html
   - أو: https://yourdomain.com/auth-callback.html

5. ضع Client ID في الأسفل

===================================
*/

const DISCORD_CONFIG = {
    // ضع Client ID الخاص بك هنا
    clientId: 'YOUR_CLIENT_ID_HERE',
    
    // رابط صفحة العودة بعد التسجيل
    redirectUri: window.location.origin + '/auth-callback.html',
    
    // الصلاحيات المطلوبة
    scope: 'identify email guilds'
};

// دالة بناء رابط Discord OAuth
function buildDiscordOAuthURL() {
    const params = new URLSearchParams({
        client_id: DISCORD_CONFIG.clientId,
        redirect_uri: DISCORD_CONFIG.redirectUri,
        response_type: 'token',
        scope: DISCORD_CONFIG.scope
    });
    
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

// دالة جلب بيانات المستخدم من Discord
async function fetchDiscordUser(accessToken) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Discord API Error:', error);
        return null;
    }
}

// دالة تحويل بيانات Discord لبيانات المستخدم
function formatDiscordUser(discordUser) {
    return {
        id: discordUser.id,
        name: discordUser.global_name || discordUser.username,
        email: discordUser.email || `${discordUser.username}@discord.local`,
        avatar: discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${discordUser.username}`,
        banner: discordUser.banner 
            ? `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.png`
            : null,
        discord: {
            id: discordUser.id,
            username: discordUser.username,
            discriminator: discordUser.discriminator,
            global_name: discordUser.global_name,
            avatar: discordUser.avatar
        },
        loginMethod: 'discord',
        loginAt: new Date().toISOString()
    };
}

// التحقق من وجود Client ID صالح
function isDiscordConfigured() {
    return DISCORD_CONFIG.clientId && 
           DISCORD_CONFIG.clientId !== '' && 
           DISCORD_CONFIG.clientId !== 'YOUR_CLIENT_ID_HERE';
}
