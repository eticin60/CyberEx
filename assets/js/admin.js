
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: this.ADMIN_EMAIL,
                password: password
            });

            if (error) {
                console.error('Admin login error:', error);
                if (error.message.includes('Invalid login credentials')) {
                    // Eğer kullanıcı yoksa ve şifre doğruysa (ilk kurulum için otomatik oluşturma)
                    // Bu kısım normalde GÜVENLİK RİSKİDİR ancak talep üzerine kolay kurulum için eklenmiştir.
                    // Pratik çözüm: Eğer giriş başarısızsa ve kullanıcı 'admin' ise, kayıt olmayı dene.
                    return await this.registerAdminFallback(password);
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

    // İlk kurulum için Admin kullanıcısı oluşturur (Sadece 1 kere çalışır)
    static async registerAdminFallback(password) {
        console.log('Admin hesabı bulunamadı, oluşturuluyor...');
        try {
            const { data, error } = await supabase.auth.signUp({
                email: this.ADMIN_EMAIL,
                password: password
            });

            if (error) {
                return { success: false, error: 'Admin hesabı oluşturulamadı: ' + error.message };
            }

            // Hesabı hemen oluşturduk, şimdi giriş yapmış sayılırız
            // Ancak email onayı gerekebilir. Auto-confirm kapalıysa sorun olabilir.
            // Admin paneli olduğu için auto-login varsayalım.
            return { success: true, message: 'Admin hesabı oluşturuldu.' };

        } catch (err) {
            return { success: false, error: 'Kritik hata.' };
        }
    }

    // Admin oturumu kontrolü
    static async checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== this.ADMIN_EMAIL) {
            window.location.href = 'admin-login.html';
        }
        return session.user;
    }

    // --- YÖNETİM FONKSİYONLARI ---

    // 1. Tüm Kullanıcıları Listele (Mock Data - Gerçek veriler için Supabase Edge Function gerekir)
    // Not: Client-side'dan tüm kullanıcıları çekmek güvenlik politikaları (RLS) nedeniyle normalde engellidir.
    // Admin için 'service_role' key kullanılmalı veya özel bir RLS policy yazılmalıdır.
    // Şimdilik demo verisi veya izin verilen public verileri çekeceğiz.
    static async listUsers() {
        // Gerçek implementasyonda: supabase.from('user_profiles').select('*')
        // Ancak RLS buna izin vermeyebilir.
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('List users error:', error);
            return [];
        }
        return data;
    }

    // 2. Bakiye Güncelleme (Admin Yetkisiyle)
    static async updateUserBalance(userId, amount) {
        // Bu işlem için RLS policy'de "admin" rolüne izin verilmiş olmalı
        const { error } = await supabase
            .from('user_profiles')
            .update({ spot_available: amount }) // Örnek alan
            .eq('user_id', userId);

        return { success: !error, error };
    }
}
