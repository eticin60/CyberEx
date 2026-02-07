// Authentication utilities for CyberEx
class AuthManager {

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

    // Register new user (Android registerUser ile TAMAMEN AYNI)
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
                registrationSource: 'web'
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

            // 9. Batch write (Android db.runBatch ile AYNI)
            const batch = db.batch();

            const userDocRef = db.collection('users').doc(userId);
            const walletColRef = userDocRef.collection('wallet');

            batch.set(userDocRef, userData);
            batch.set(walletColRef.doc('usdt_balance'), initialBalanceData);
            batch.set(walletColRef.doc('summary'), initialSummaryData);
            batch.set(walletColRef.doc('spot_assets'), { initialized: true });
            batch.set(walletColRef.doc('spot_history'), { initialized: true });

            await batch.commit();

            // 10. Referral code processing (Android processReferralCode ile AYNI)
            if (refCode) {
                await this.processReferralCode(refCode, userId);
            }

            console.log('User registered successfully:', userId, 'Cyber ID:', publicId);

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

    // Login user
    static async loginUser(email, password) {
        try {
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
            }

            return { success: false, error: errorMessage };
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
