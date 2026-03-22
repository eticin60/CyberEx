
// Admin Manager - Handles authentication and admin operations
class AdminManager {

    // Admin Credentials Mapping
    // "admin" kullanıcı adını gerçek bir e-posta ile eşleştiriyoruz
    static ADMIN_EMAIL = 'admin@cyberex.com.tr';

    static async login(username, password) {
        // 1. Kullanıcı adı kontrolü (Basit güvenlik katmanı)
        if (username.toLowerCase() !== 'admin') {
            return { success: false, error: 'Yetkisiz kullanıcı adı.' };
        }

        try {
            // 2. Supabase ile giriş yap (Email/Password)
            // Kullanıcı "admin" yazdı ama biz arkada "admin@cyberex.com.tr" ile deniyoruz
            const { data, error } = await sb.auth.signInWithPassword({
                email: this.ADMIN_EMAIL,
                password: password
            });

            if (error) {
                console.error('Admin login error:', error);
                if (error.message.includes('Invalid login credentials')) {
                    return { success: false, error: 'Admin hesabı bulunamadı veya şifre hatalı.' };
                }
                return { success: false, error: 'Hatalı şifre veya yetki yok.' };
            }

            // 3. Admin rolü kontrolü (Gelecekte user_profiles tablosundan 'role' alanı kontrol edilebilir)
            // Şimdilik e-posta 'admin@cyberex.com.tr' ise kabul ediyoruz.
            return { success: true };

        } catch (err) {
            console.error('System error:', err);
            return { success: false, error: 'Bağlantı hatası.' };
        }
    }

    // Admin oturumu kontrolü
    static async checkSession() {
        const { data: { session } } = await sb.auth.getSession();
        if (!session || session.user.email !== this.ADMIN_EMAIL) {
            window.location.href = 'admin-login.html';
        }
        return session.user;
    }

    // --- YÖNETİM FONKSİYONLARI ---

    // 1. Tüm Kullanıcıları Listele (Edge Function üzerinden)
    static async listUsers() {
        try {
            const { data, error } = await sb.functions.invoke('admin-api', {
                body: { action: 'list_users' }
            });
            if (error) {
                console.error('List users error:', error);
                return [];
            }
            return data?.users || [];
        } catch (e) {
            console.error('List users error:', e);
            return [];
        }
    }

    // 2. Bakiye Güncelleme (Admin Yetkisiyle) - Edge Function
    static async updateUserBalance(userId, amount) {
        try {
            const { data, error } = await sb.functions.invoke('admin-api', {
                body: { action: 'update_user_balance', user_id: userId, amount }
            });
            if (error) return { success: false, error };
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e };
        }
    }
}
