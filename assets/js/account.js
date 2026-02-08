/**
 * CyberEx Account Dashboard logic
 * Synchronized with Android implementation (Paths, KYC, VIP, Avatars)
 */

// Close dropdown on click outside
window.onclick = function (event) {
    if (!event.target.closest('.user-profile-nav')) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    }
}

async function initDashboard(user) {
    console.log("Dashboard initializing for:", user.email);

    // Start background particles if canvas exists
    initParticles();

    // Load components in parallel
    loadUserProfile(user.uid);
    loadWalletData(user.uid);
    loadOpenPositions(user.uid);
    loadDailyPnl(user.uid);
    loadNotifications(user.uid);
    checkSecurityStatus(user.uid);

    // Add form listener for settings
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateSettings(user.uid);
        });
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.alpha = Math.random();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };
    animate();
}

async function loadUserProfile(uid) {
    db.collection('users').doc(uid).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            safeSetText('displayName', data.username || 'Kullanıcı');
            safeSetText('displayEmail', data.email || '---');

            // Cyber ID Fix: Use document ID if uid field is missing in data
            const cId = data.publicId || data.uid || doc.id || '---------';
            safeSetText('cyberId', cId.length > 10 ? cId.substring(0, 10).toUpperCase() : cId.toUpperCase());

            // VIP & Level Icons
            const vip = data.vipLevel || 0;
            // Logic parity with Android: 0-1 Starter, 2-4 Silver, 5+ Gold
            let vipText = 'STARTER';
            let vipColor = '#00f0ff';
            if (vip >= 5) {
                vipText = 'GOLD VIP';
                vipColor = '#ffd700';
            } else if (vip >= 2) {
                vipText = 'SILVER VIP';
                vipColor = '#c0c0c0';
            } else {
                vipText = 'STARTER';
                vipColor = '#00f0ff';
            }

            const vipEl = document.getElementById('vipLevel');
            if (vipEl) {
                vipEl.innerHTML = `<i class="fas fa-crown" style="color: ${vipColor}"></i> ${vipText} (Lvl ${vip})`;
            }

            // KYC Status with Icon
            // Android keys: "verified", "pending", "rejected", "unverified"
            const kyc = data.kycStatus || 'unverified';
            const kycEl = document.getElementById('kycStatus');
            if (kycEl) {
                let kycText = 'Doğrulanmadı';
                let kycClass = 'status-unverified';
                let kycIcon = 'fa-times-circle';

                if (kyc === 'verified') {
                    kycText = 'Doğrulandı';
                    kycClass = 'status-verified';
                    kycIcon = 'fa-check-circle';
                } else if (kyc === 'pending') {
                    kycText = 'İnceleniyor';
                    kycClass = 'status-unverified'; // Or specific pending class
                    kycIcon = 'fa-clock';
                }

                kycEl.innerHTML = `<i class="fas ${kycIcon}"></i> ${kycText}`;
                kycEl.className = `status-badge ${kycClass}`;
            }

            // Avatar Logic: Check custom URL -> Google URL -> Preset ID
            let avatarUrl = data.photoUrl;
            if (!avatarUrl && firebase.auth().currentUser) {
                avatarUrl = firebase.auth().currentUser.photoURL;
            }
            if (!avatarUrl) {
                const avatarId = data.avatarId || 1;
                avatarUrl = `assets/avatar/avatar_${avatarId}.png`;
            }

            const avatarContainer = document.getElementById('mainAvatar');
            if (avatarContainer) {
                avatarContainer.innerHTML = `<img src="${avatarUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.src='assets/images/logo.png'">`;
            }

            // Pre-fill phone

            // Pre-fill phone
            const phoneInput = document.getElementById('phoneInput');
            if (phoneInput && data.phone && !phoneInput.value) {
                phoneInput.value = data.phone;
            }
        }
    }, error => console.error("Profile sync error:", error));
}

function updateKycBadge(status) {
    const badge = document.getElementById('kycStatus');
    if (!badge) return;

    let config = { text: "Doğrulanmadı", color: "#ff3366", icon: "fa-times-circle" };
    if (status === 'verified') config = { text: "Doğrulandı", color: "#00ff88", icon: "fa-check-circle" };
    else if (status === 'pending') config = { text: "İncelemede", color: "#ffcc00", icon: "fa-clock" };
    else if (status === 'rejected') config = { text: "Reddedildi", color: "#ff3366", icon: "fa-exclamation-triangle" };

    badge.innerHTML = `<i class="fas ${config.icon}"></i> ${config.text}`;
    badge.style.color = config.color;
    badge.style.borderColor = config.color;
}

function renderBadges(data) {
    const container = document.getElementById('badgeContainer');
    if (!container) return;
    let html = '';
    if (data.admin) html += '<span class="badge admin-badge"><i class="fas fa-crown"></i> Admin</span>';
    if (data.premium) html += '<span class="badge premium-badge"><i class="fas fa-gem"></i> Premium</span>';
    container.innerHTML = html;
}

function updateAvatarUI(avatarId) {
    // Exact path: assets/avatar/
    const avatarHTML = avatarId >= 1 && avatarId <= 15
        ? `<img src="assets/avatar/avatar_${avatarId}.png" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML='<i class=\'fas fa-user\'></i>'">`
        : `<i class="fas fa-user-shield"></i>`;

    ['mainAvatar', 'navAvatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = avatarHTML;
    });
}

function loadWalletData(uid) {
    let spotBal = 0;
    let futuresBal = 0;

    const updateUI = () => {
        const total = spotBal + futuresBal;
        // Accurate total balance display with 2 decimal places
        const totalEl = document.getElementById('totalBalance');
        if (totalEl) {
            totalEl.style.fontSize = total > 100000 ? '1.8rem' : '2.5rem'; // Auto scale font
            totalEl.innerText = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        safeSetText('spotBalance', `$${spotBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        safeSetText('futuresBalance', `$${futuresBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    };

    // Spot Balance: users/{uid}/wallet/usdt_balance
    db.collection('users').doc(uid).collection('wallet').doc('usdt_balance')
        .onSnapshot(doc => {
            spotBal = doc.exists ? parseFloat(doc.data().balance || 0) : 0;
            updateUI();
        }, err => console.error("Spot balance error:", err));

    // Futures Balance: users/{uid}/futures_wallet/usdt_balance
    db.collection('users').doc(uid).collection('futures_wallet').doc('usdt_balance')
        .onSnapshot(doc => {
            futuresBal = doc.exists ? parseFloat(doc.data().balance || 0) : 0;
            updateUI();
        }, err => console.error("Futures balance error:", err));
}

function copyCyberId() {
    const id = document.getElementById('cyberId').textContent;
    if (id && id !== '---------') {
        navigator.clipboard.writeText(id).then(() => {
            alert("Cyber ID kopyalandı: " + id);
        }).catch(err => {
            console.error('Kopyalama hatası:', err);
        });
    }
}

function openAvatarModal() {
    alert("Profil düzenleme yakında web sürümüne eklenecektir. Lütfen Android uygulamasını kullanın.");
}

function loadOpenPositions(uid) {
    const list = document.getElementById('positionsContainer');
    const countBadge = document.getElementById('positionCount');
    if (!list) return;

    db.collection('users').doc(uid).collection('futures_wallet').doc('open_positions').collection('positions')
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                list.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-stream"></i>
                        <p>Açık pozisyon bulunamadı</p>
                    </div>
                `;
                if (countBadge) countBadge.innerText = '0';
                return;
            }

            if (countBadge) countBadge.innerText = snapshot.size;

            let html = '';
            snapshot.forEach(doc => {
                const p = doc.data();
                const pnl = parseFloat(p.unrealizedPnl || 0);
                const pnlPercent = parseFloat(p.pnlPercentage || 0);
                const pnlClass = pnl >= 0 ? 'text-success' : 'text-danger';

                html += `
                    <div class="position-item glass-item">
                        <div class="pos-top">
                            <span class="symbol">${p.symbol || 'USDT'}</span>
                            <span class="side ${p.side === 'LONG' ? 'side-buy' : 'side-sell'}">${p.side || 'LONG'} ${p.leverage || 1}x</span>
                        </div>
                        <div class="pos-details">
                            <div class="detail-row">
                                <span>Giriş / Piyasa</span>
                                <strong>$${parseFloat(p.entryPrice || 0).toLocaleString()} / $${parseFloat(p.markPrice || 0).toLocaleString()}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Büyüklük</span>
                                <strong>${parseFloat(p.sizeInUsdt || 0).toFixed(2)} USDT</strong>
                            </div>
                            <div class="detail-row">
                                <span>PNL</span>
                                <strong class="${pnlClass}">$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)</strong>
                            </div>
                        </div>
                        <button class="btn-outline-danger" onclick="closePosition('${doc.id}')">Kapat</button>
                    </div>
                `;
            });
            list.innerHTML = html;
        }, err => console.error("Positions listener error:", err));
}

function loadDailyPnl(uid) {
    const pnlEl = document.getElementById('dailyPnl');
    if (!pnlEl) return;

    // Standard Android path for daily PNL
    db.collection('users').doc(uid).collection('futures_wallet').doc('daily_stats')
        .onSnapshot(doc => {
            const data = doc.exists ? doc.data() : { pnl: 0, pnlPercent: 0 };
            const pnl = data.pnl || 0;
            const percent = data.pnlPercent || 0;
            pnlEl.textContent = `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${percent.toFixed(2)}%)`;
            pnlEl.className = `pnl-value ${pnl >= 0 ? 'text-success' : 'text-danger'}`;

            // Store for sharing
            window.currentPnl = { pnl, percent };
        });
}

function sharePnl() {
    const data = window.currentPnl || { pnl: 0, percent: 0 };
    const pnlStr = `${data.pnl >= 0 ? '+' : ''}$${data.pnl.toFixed(2)} (${data.percent.toFixed(2)}%)`;
    const emoji = data.pnl >= 0 ? '🚀' : '🔻';

    // Marketing Text
    const text = `${emoji} CyberEx'te bugün işlem performansım: ${pnlStr}!\n\n🤖 Yapay zeka destekli alım satım ile sen de kazanmaya başla.\n\n👇 Hemen Üye Ol ve Fırsatları Yakala:\nhttps://cyberex.com.tr\n\n#CyberEx #Kripto #Bitcoin #YapayZeka #Borsa`;

    // Check if mobile for native share, else open Twitter/WhatsApp choice
    if (navigator.share) {
        navigator.share({
            title: 'CyberEx PNL Paylaşımı',
            text: text,
            url: 'https://cyberex.com.tr'
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard or open WhatsApp
        const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(waLink, '_blank');
    }
}

async function updateSettings(uid) {
    const phone = document.getElementById('phoneInput').value;
    const newPass = document.getElementById('newPassword').value;
    const updates = {};
    let securityChanged = false;
    let changeReason = "";

    try {
        // Phone Update Logic
        const phoneInput = document.getElementById('phoneInput');
        if (phone && !phoneInput.hasAttribute('readonly')) {
            updates.phone = phone;
            securityChanged = true;
            changeReason = "Telefon numarası değişikliği";
        }

        // Password Update Logic
        if (newPass) {
            await firebase.auth().currentUser.updatePassword(newPass);
            securityChanged = true;
            changeReason = changeReason ? changeReason + " ve Şifre değişikliği" : "Şifre değişikliği";
        }

        if (Object.keys(updates).length > 0) {
            await db.collection('users').doc(uid).update(updates);
        }

        // Apply Security Block (Android Parity)
        if (securityChanged) {
            const now = Date.now();
            const blockedUntil = now + (48 * 60 * 60 * 1000); // 48 hours

            await db.collection('users').doc(uid).update({
                withdrawalBlocked: true,
                withdrawalBlockedUntil: blockedUntil,
                withdrawalBlockReason: `${changeReason} nedeniyle 48 saat çekim engeli`,
                lastSecurityChange: 'WEB_UPDATE',
                lastSecurityChangeAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert(`Ayarlar güncellendi. ${changeReason} nedeniyle hesabınıza 48 saat çekim kısıtlaması uygulandı.`);
        } else if (!securityChanged && Object.keys(updates).length > 0) {
            alert("Bilgiler güncellendi.");
        } else if (!securityChanged && Object.keys(updates).length === 0) {
            // No changes
        }

        // Clear password field
        document.getElementById('newPassword').value = '';
        if (phoneInput) phoneInput.setAttribute('readonly', 'true');

    } catch (err) {
        console.error("Update error:", err);
        alert("Güncelleme sırasında bir hata oluştu: " + err.message);
    }
}

function loadNotifications(uid) {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;

    db.collection('users').doc(uid).collection('notifications')
        .orderBy('timestamp', 'desc').limit(20)
        .onSnapshot(snapshot => {
            let html = '';
            if (snapshot.empty) {
                html = '<div class="empty-state"><p>Henüz bildirim yok.</p></div>';
            } else {
                snapshot.forEach(doc => {
                    const n = doc.data();
                    const date = n.timestamp ? new Date(n.timestamp.seconds * 1000).toLocaleString() : '---';
                    const typeIcon = n.type === 'trade' ? 'fa-exchange-alt' : (n.type === 'security' ? 'fa-shield-alt' : 'fa-info-circle');

                    html += `
                        <div class="notification-item ${n.read ? 'read' : 'unread'}">
                            <div class="n-icon"><i class="fas ${typeIcon}"></i></div>
                            <div class="n-body">
                                <p>${n.message}</p>
                                <span class="n-time">${date}</span>
                            </div>
                        </div>
                    `;
                });
            }
            container.innerHTML = html;
        });
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function checkSecurityStatus(uid) {
    db.collection('users').doc(uid).onSnapshot(doc => {
        if (!doc.exists) return;
        const data = doc.data();

        // Android Key: withdrawalBlocked (bool), withdrawalBlockedUntil (long timestamp)
        const isBlocked = data.withdrawalBlocked || false;
        const blockedUntil = data.withdrawalBlockedUntil || 0;
        const now = Date.now();

        const banner = document.getElementById('securityBanner');

        if (isBlocked && blockedUntil > now) {
            if (banner) {
                banner.style.display = 'flex';
                const reason = data.withdrawalBlockReason || "Güvenlik değişikliği";
                document.getElementById('securityReason').textContent = reason;

                // Calculate remaining time
                const remainingMs = blockedUntil - now;
                const hours = Math.floor(remainingMs / (1000 * 60 * 60));
                const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

                document.getElementById('securityTimer').textContent = `Kalan Süre: ${hours} sa ${minutes} dk`;
            }
        } else {
            if (banner) banner.style.display = 'none';
        }

        // 2FA Status
        const twoFa = data.twoFactorEnabled || false;
        const twoFaBadge = document.getElementById('2faStatus');
        if (twoFaBadge) {
            twoFaBadge.textContent = twoFa ? 'Aktif' : 'Pasif';
            twoFaBadge.className = `status-badge ${twoFa ? 'status-verified' : 'status-unverified'}`;
        }

    });
}

function togglePhoneEdit() {
    const input = document.getElementById('phoneInput');
    if (input.hasAttribute('readonly')) {
        if (confirm("Telefon numarasını değiştirmek, güvenlik gereği 48 saat boyunca çekim işlemlerini kısıtlayacaktır. Devam etmek istiyor musunuz?")) {
            input.removeAttribute('readonly');
            input.focus();
        }
    } else {
        input.setAttribute('readonly', 'true');
    }
}

async function closePosition(posId) {
    if (confirm("Bu pozisyonu piyasa fiyatından kapatmak istediğinize emin misiniz?")) {
        console.log("Closing position:", posId);
        alert("Pozisyon kapatma isteği gönderildi.");
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            initDashboard(user);
        } else {
            console.log("User not logged in, redirecting...");
            window.location.href = 'login.html';
        }
    });

    // Mobile menu toggle logic if not in home-nav
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.querySelector('.navbar').classList.toggle('mobile-open');
        });
    }
});
