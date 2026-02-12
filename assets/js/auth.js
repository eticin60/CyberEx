// Supabase Configuration (Lütfen gerçek anahtarlarınızı buraya ekleyin veya .env kullanın)
const SUPABASE_URL = 'https://fkxynlctcbagfvpatzlb.supabase.co'; // TODO: Gerçek URL ile değiştirilmelidir
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: Gerçek Anon Key ile değiştirilmelidir
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication utilities for CyberEx
class AuthManager {

    // Davet edilen kullanıcı kaydını tamamla (Dual-Write: Firebase + Supabase Profile)
    static async finalizeInviteRegistration(userEmail, userPassword, userUid) {
        try {
            console.log("Finalizing invite registration for:", userEmail);

            // 1. Firebase Auth Kullanıcısı Var mı Kontrol Et
            // Not: İstemci tarafında 'getUserByEmail' yoktur, giriş yapmayı deneriz veya direkt oluştururuz.
            // En temizi: Create etmeyi dene, hata verirse "email-already-in-use" ise sorun yok, sign-in ederiz.

            let firebaseUserUid = null;

            try {
                // Firebase'de kullanıcı oluşturmayı dene
                const userCredential = await auth.createUserWithEmailAndPassword(userEmail, userPassword);
                firebaseUserUid = userCredential.user.uid;
                console.log("Firebase Auth user created:", firebaseUserUid);
            } catch (fbError) {
                if (fbError.code === 'auth/email-already-in-use') {
                    console.log("User already exists in Firebase, signing in...");
                    // Zaten varsa giriş yapalım ki UID'yi alabilelim
                    const signInCred = await auth.signInWithEmailAndPassword(userEmail, userPassword);
                    firebaseUserUid = signInCred.user.uid;
                } else {
                    throw fbError; // Diğer hataları fırlat
                }
            }

            // 2. Cyber ID / Profil Verilerini Hazırla (Eğer yoksa)
            // Firestore'da 'users' dokümanı var mı bak
            const userDoc = await db.collection('users').doc(firebaseUserUid).get();

            if (!userDoc.exists) {
                console.log("Creating new user profile in Firestore...");

                const publicId = await this.generateCyberId();
                const baseUsername = userEmail.split('@')[0];
                const uniqueUsername = await this.generateUniqueUsername(baseUsername);
                const deviceId = `web_${this.generateDeviceId()}`;
                const welcomeBonus = 100.0; // Davet edilenlere de bonus verelim

                // Firestore Data
                const userData = {
                    username: uniqueUsername,
                    publicId: publicId,
                    email: userEmail,
                    phoneNumber: '',
                    ageVerified: true,
                    premium: false,
                    admin: false, // Admin panelinden davet edilse bile varsayılan 'user'
                    user: true,
                    deviceId: deviceId,
                    createdAt: firebase.firestore.Timestamp.now(),
                    referralCode: publicId,
                    referralCount: 0,
                    feeDiscount: 0.0,
                    welcomeBonus: welcomeBonus,
                    welcomeBonusClaimed: false,
                    welcomeBonusAddedAt: firebase.firestore.Timestamp.now(),
                    spotBalance: welcomeBonus,
                    enteredReferralCode: '', // Davet olduğu için ref kodu yok (veya admin'in kodu eklenebilir)
                    registrationSource: 'invite',
                    isMigrated: true
                };

                // Wallet Data
                const initialBalanceData = { balance: welcomeBonus };
                const initialSummaryData = {
                    principalBalance: welcomeBonus,
                    totalPortfolioValue: welcomeBonus,
                    totalPnl: 0.0
                };

                // Batch Write to Firestore
                const batch = db.batch();
                const userDocRef = db.collection('users').doc(firebaseUserUid);
                const walletColRef = userDocRef.collection('wallet');

                batch.set(userDocRef, userData);
                batch.set(walletColRef.doc('usdt_balance'), initialBalanceData);
                batch.set(walletColRef.doc('summary'), initialSummaryData);
                batch.set(walletColRef.doc('spot_assets'), { initialized: true });
                batch.set(walletColRef.doc('spot_history'), { initialized: true });

                await batch.commit();
                console.log("Firebase profile created.");

                // 3. Supabase Profile Sync
                // Supabase Auth user zaten var (Invite linki ile geldi)
                // userUid parametresi Supabase Auth UID'sidir.
                // İdeal senaryoda Firebase UID ile Supabase UID aynı olmalıydı ama
                // burada Supabase ID'si önceden oluştuğu için onu kullanacağız.
                // VEYA Firebase UID'sini Supabase profilinde 'user_id' olarak kullanmak istersek
                // Supabase Auth ID'si ile eşleşmez.

                // KARAR: Supabase Auth ID'sini 'user_id' olarak kullanacağız.
                // Firebase'deki 'publicId' ve verileri buraya eşleyeceğiz.

                const { error: sbProfileError } = await supabase.from('user_profiles').upsert({
                    user_id: userUid, // Supabase Auth ID
                    username: uniqueUsername,
                    email: userEmail,
                    phone_number: null,
                    referral_code: publicId,
                    spot_available: welcomeBonus,
                    net_investment: welcomeBonus,
                    is_migrated: true,
                    device_id: deviceId
                });

                if (sbProfileError) console.error('Supabase profile sync error:', sbProfileError);
                else console.log('Supabase profile created.');

                return { success: true };

            } else {
                console.log("User profile already exists.");
                return { success: true, message: 'Existing profile found.' };
            }

        } catch (error) {
            console.error('Finalize invite error:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate unique 9-digit Cyber ID (Android IdGenerator.generateUniqueCyberId() ile aynı)
    static async generateCyberId() {
        const min = 100000000;
        const max = 999999999;

        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            const id = Math.floor(Math.random() * (max - min + 1)) + min;
            const idString = id.toString();

            // Check if this ID already exists
            const existingUsers = await db.collection('users')
                .where('publicId', '==', idString)
                .limit(1)
                .get();

            if (existingUsers.empty) {
                return idString;
            }

            attempts++;
        }

        // Fallback: use timestamp (son 9 hane)
        return Date.now().toString().slice(-9);
    }

    // Generate unique username (Android generateUniqueUsername ile aynı)
    static async generateUniqueUsername(baseUsername) {
        try {
            const snapshot = await db.collection('users')
                .where('username', '>=', baseUsername)
                .get();

            const takenUsernames = snapshot.docs.map(doc => doc.data().username);
            let finalUsername = baseUsername;
            let counter = 1;

            while (takenUsernames.includes(finalUsername)) {
                finalUsername = `${baseUsername}${counter}`;
                counter++;
            }

            return finalUsername;
        } catch (error) {
            console.error('Username generation error:', error);
            return baseUsername;
        }
    }

    // Register new user (Android registerUser ile TAMAMEN AYNI - Dual-Write)
    static async registerUser(email, password, phoneNumber, refCode, tcId = '') {
        try {
            // 1. Firebase Authentication ile kullanıcı oluştur
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const userId = user.uid;

            // 2. Cyber ID oluştur
            const publicId = await this.generateCyberId();

            // 3. Username oluştur (email'den)
            const baseUsername = email.split('@')[0];
            const uniqueUsername = await this.generateUniqueUsername(baseUsername);

            // 4. Device ID (web için)
            const deviceId = `web_${this.generateDeviceId()}`;

            // 5. Kullanıcı referral kodu = publicId (Android'deki gibi)
            const userReferralCode = publicId;

            // 6. Welcome Bonus (Android'deki gibi 100 USDT)
            const welcomeBonus = 100.0;

            // 7. User document data (Android userData ile AYNI)
            const userData = {
                username: uniqueUsername,
                publicId: publicId,
                email: email,
                phoneNumber: phoneNumber || '',
                ageVerified: true,
                premium: false,
                admin: false,
                user: true,
                deviceId: deviceId,
                createdAt: firebase.firestore.Timestamp.now(),
                referralCode: userReferralCode,
                referralCount: 0,
                feeDiscount: 0.0,
                welcomeBonus: welcomeBonus,
                welcomeBonusClaimed: false,
                welcomeBonusAddedAt: firebase.firestore.Timestamp.now(),
                spotBalance: welcomeBonus,
                enteredReferralCode: refCode || '',
                registrationSource: 'web',
                isMigrated: true
            };

            // TC ID opsiyonel, sadece doluysa ekle (Android ile AYNI mantık)
            if (tcId && tcId.length === 11) {
                userData.tcId = tcId;
            }

            // 8. Wallet data (Android initialBalanceData ve initialSummaryData ile AYNI)
            const initialBalance = welcomeBonus;
            const initialBalanceData = { balance: initialBalance };
            const initialSummaryData = {
                principalBalance: initialBalance,
                totalPortfolioValue: initialBalance,
                totalPnl: 0.0
            };

            // 9. FIREBASE BATCH WRITE
            const batch = db.batch();

            const userDocRef = db.collection('users').doc(userId);
            const walletColRef = userDocRef.collection('wallet');

            batch.set(userDocRef, userData);
            batch.set(walletColRef.doc('usdt_balance'), initialBalanceData);
            batch.set(walletColRef.doc('summary'), initialSummaryData);
            batch.set(walletColRef.doc('spot_assets'), { initialized: true });
            batch.set(walletColRef.doc('spot_history'), { initialized: true });

            await batch.commit();
            console.log('Firebase registration successful');

            // 10. SUPABASE DUAL-WRITE
            try {
                // Supabase Auth
                const { data: sbAuthData, error: sbAuthError } = await supabase.auth.signUp({
                    email: email,
                    password: password
                });

                const supabaseUid = sbAuthData?.user?.id || userId;

                // Supabase Profile (UserProfileDTO ile aynı)
                const { error: sbProfileError } = await supabase.from('user_profiles').upsert({
                    user_id: supabaseUid,
                    username: uniqueUsername,
                    email: email,
                    phone_number: phoneNumber,
                    tc_id: tcId || null,
                    referral_code: publicId,
                    spot_available: welcomeBonus,
                    net_investment: welcomeBonus,
                    is_migrated: true,
                    device_id: deviceId
                });

                if (sbProfileError) console.error('Supabase profile error:', sbProfileError);
                else console.log('Supabase registration successful');

            } catch (sbError) {
                console.error('Supabase sync failed, but Firebase succeeded:', sbError);
            }

            // 11. Referral code processing (Android processReferralCode ile AYNI)
            if (refCode) {
                await this.processReferralCode(refCode, userId);
            }

            return { success: true, user: user, cyberId: publicId, username: uniqueUsername };
        } catch (error) {
            console.error('Registration error:', error);

            // Firebase hatalarını Türkçeye çevir
            let errorMessage = 'Kayıt sırasında bir hata oluştu';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Şifre çok zayıf (en az 6 karakter)';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi';
            }

            return { success: false, error: errorMessage };
        }
    }

    // Process referral code (Android processReferralCode ile AYNI)
    static async processReferralCode(refCode, newUserId) {
        try {
            // Find user with this publicId (Cyber ID)
            const referrerQuery = await db.collection('users')
                .where('publicId', '==', refCode)
                .limit(1)
                .get();

            if (!referrerQuery.empty) {
                const referrerDoc = referrerQuery.docs[0];
                const currentCount = referrerDoc.data().referralCount || 0;

                await db.collection('users').doc(referrerDoc.id).update({
                    referralCount: currentCount + 1
                });

                console.log(`Referral count updated for referrer: ${referrerDoc.id}`);
            } else {
                console.log(`No referrer found with publicId: ${refCode}`);
            }
        } catch (error) {
            console.error('Referral processing error:', error);
        }
    }

    // Login user (Dual-Login: Firebase + Supabase for Verification)
    static async loginUser(email, password) {
        try {
            // 1. Önce Supabase ile giriş yapmayı dene (Email verification kontrolü için)
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Supabase Login Error:', error);

                // Email onaylanmamış hatası kontrolü
                if (error.message.includes('Email not confirmed')) {
                    return {
                        success: false,
                        error: 'EmailNotConfirmed',
                        message: 'Lütfen önce e-posta adresinizi doğrulayın.'
                    };
                }

                // Diğer Supabase hatalarını şimdilik yutabiliriz (Firebase başarabilir)
                // Ancak "Invalid login credentials" ise Firebase de muhtemelen başarısız olacaktır.
            }

            // 2. Firebase Authentication ile giriş yap
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };

        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Giriş yapılırken hata oluştu';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Kullanıcı bulunamadı';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Hatalı şifre';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Çok fazla başarısız deneme. Lütfen bekleyin.';
            }

            return { success: false, error: errorMessage };
        }
    }

    // Resend Verification Email (Web)
    static async resendVerificationEmail(email) {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Resend verification error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout user
    static async logoutUser() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user is logged in
    static getCurrentUser() {
        return auth.currentUser;
    }

    // Generate device ID
    static generateDeviceId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Auth state observer
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'Not logged in');

    // Update index.html navbar if we are on that page
    const navAuthGroup = document.getElementById('navAuthGroup');
    if (navAuthGroup) {
        if (user) {
            navAuthGroup.innerHTML = `
                <a href="account.html" class="nav-btn-outline" style="background: rgba(0, 240, 255, 0.1);">
                    <i class="fas fa-user-circle"></i> <span data-tr="HESABIM" data-en="ACCOUNT">HESABIM</span>
                </a>
            `;
        } else {
            // Restore default buttons if logged out
            navAuthGroup.innerHTML = `
                <a href="login.html" class="nav-btn-outline" style="border: none;" data-tr="GİRİŞ YAP" data-en="LOGIN">GİRİŞ YAP</a>
                <a href="register.html" class="nav-btn-filled" data-tr="HEMEN KATIL" data-en="JOIN NOW">HEMEN KATIL</a>
            `;
        }
    }

    // Dispatch custom event for auth state changes
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
});

// --- URL HASH LISTENER (Invite, Recovery & Email Change Logic) ---
window.addEventListener('load', async () => {
    const hash = window.location.hash;

    // 1. Password Recovery & Invite -> set-password.html
    if (hash && (hash.includes('type=invite') || hash.includes('type=recovery'))) {
        console.log('Invite/Recovery token detected, redirecting to set-password.html...');
        window.location.href = 'set-password.html' + hash;
    }

    // 2. Email Change Verification -> Sync Databases
    else if (hash && hash.includes('type=email_change')) {
        console.log('Email change token detected. Verifying and syncing...');

        // Supabase bu işlem için token'ı otomatik algılar ve auth.users'ı günceller.
        // Bizim yapmamız gereken: Yeni email'i Firestore ve user_profiles'a eşitlemek.

        // Kullanıcı oturumunun güncellenmesini bekle
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            console.log('Email change verified for:', user.email);

            // Kullanıcıya bilgi ver
            // alert('E-posta adresiniz başarıyla güncellendi! Sistem verileri senkronize ediliyor...');

            // Firebase ve Supabase Profile Güncellemesi
            // Not: Firebase tarafında updateEmail yapmak için kullanıcının yeniden giriş yapması gerekebilir (Sensitive Operation).
            // Ancak Firestore ve Supabase Profile'ı güncelleyebiliriz.

            try {
                // A. Firestore Güncelle (Eğer Firebase UID, Supabase ile aynı değilse publicId üzerinden veya auth ile bulup güncellememiz lazım)
                // Şimdilik AuthManager'ın veritabanı bağlantılarını kullandığını varsayıyoruz.
                // İstemci tarafında "currentUser" Firebase kullanıcısıdır. Ancak email değişimi Supabase tarafında oldu.

                // Firestore'daki email'i güncellemek için Firebase Auth ile de email'i değiştirmemiz lazım.
                // Bu biraz karmaşık çünkü Firebase ayrıca bir doğrulama isteyebilir.
                // BASİT ÇÖZÜM: Sadece veritabanı kayıtlarını güncellemek.

                // Not: Kullanıcının Firebase UID'sini bilmiyorsak (Supabase ile giriş yaptıysa)
                // Supabase 'user_profiles' tablosunu güncelleyebiliriz.

                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .update({ email: user.email })
                    .eq('user_id', user.id);

                if (profileError) console.error('Profile update failed:', profileError);
                else console.log('Supabase profile email updated.');

                // Kullanıcıyı profiline veya ana sayfaya yönlendir
                alert('E-posta adresiniz başarıyla güncellendi!');
                window.location.href = 'account.html';

            } catch (err) {
                console.error('Email sync error:', err);
                window.location.href = 'index.html';
            }
        }
    }
});
