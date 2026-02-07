/**
 * CyberEx Account Dashboard logic
 * Synchronized with Android implementation (Paths, KYC, VIP, Avatars)
 */

auth.onAuthStateChanged(user => {
    if (user) {
        initDashboard(user);
    } else {
        window.location.href = 'login.html';
    }
});

async function initDashboard(user) {
    console.log("Dashboard initializing for:", user.email);
    // Load components in parallel
    loadUserProfile(user.uid);
    loadWalletData(user.uid);
    loadOpenPositions(user.uid);
    loadDailyPnl(user.uid);
    loadNotifications(user.uid);
}

function loadUserProfile(uid) {
    db.collection('users').doc(uid).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();

            // Basic Info
            safeSetText('navUsername', data.username || 'Kullanıcı');
            safeSetText('displayName', data.username || 'Kullanıcı');
            safeSetText('displayEmail', data.email || '');
            safeSetText('cyberId', data.publicId || 'Oluşturuluyor...');

            // VIP Level logic (Matching Android VIPLevelManager)
            let vipLvlText = "Lvl 1";
            if (data.admin) vipLvlText = "Elite";
            else if (data.premium) vipLvlText = "Premium";
            else if (data.vipLevel) vipLvlText = `Lvl ${data.vipLevel}`;
            safeSetText('vipLevel', vipLvlText);

            // KYC Status logic
            updateKycBadge(data.kycStatus);

            // Badges
            renderBadges(data);

            // Avatar Sync
            updateAvatarUI(data.avatarId || 0);
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
    const avatarHTML = avatarId >= 1 && avatarId <= 15
        ? `<img src="assets/images/avatars/avatar_${avatarId}.png" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML='<i class=\'fas fa-user\'></i>'">`
        : `<i class="fas fa-user-shield"></i>`;

    ['mainAvatar', 'navAvatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = avatarHTML;
    });
}

function loadWalletData(uid) {
    db.collection('users').doc(uid).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            const spot = data.spot_balance || 0;
            const futures = data.futures_balance || 0;
            const total = spot + futures;

            safeSetText('totalBalance', `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
            safeSetText('spotBalance', `$${spot.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
            safeSetText('futuresBalance', `$${futures.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        }
    });
}

function loadOpenPositions(uid) {
    // Android path verification: users/{uid}/futures_wallet/open_positions/positions
    const posRef = db.collection('users').doc(uid)
        .collection('futures_wallet')
        .doc('open_positions')
        .collection('positions');

    posRef.onSnapshot(snapshot => {
        const container = document.getElementById('positionsContainer');
        if (!container) return;

        const countBadge = document.getElementById('positionCount');
        if (countBadge) countBadge.textContent = snapshot.size;

        if (snapshot.empty) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-stream"></i><p>Açık pozisyon bulunamadı</p></div>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const pos = doc.data();
            const pnlColor = pos.pnl >= 0 ? '#00ff88' : '#ff3366';
            html += `
                <div class="position-item">
                    <div class="pos-main">
                        <span class="symbol">${pos.symbol}</span>
                        <span class="type ${pos.direction?.toLowerCase()}">${pos.direction} x${pos.leverage}</span>
                    </div>
                    <div class="pos-details">
                        <div class="detail">
                            <span class="lbl">Giriş</span>
                            <span class="val">$${pos.entryPrice?.toFixed(2)}</span>
                        </div>
                        <div class="detail">
                            <span class="lbl">PNL</span>
                            <span class="val" style="color: ${pnlColor}">${pos.pnl >= 0 ? '+' : ''}${pos.pnl?.toFixed(2)} (${pos.pnlPercent?.toFixed(2)}%)</span>
                        </div>
                    </div>
                    <button class="btn btn-close-mini" onclick="closePosition('${doc.id}')">
                        <i class="fas fa-times"></i> KAPAT
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;
    }, err => console.error("Positions listener error:", err));
}

function loadDailyPnl(uid) {
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const tradesRef = db.collection('users').doc(uid)
        .collection('futures_wallet')
        .doc('futures_history')
        .collection('trade');

    tradesRef.where('timestamp', '>=', twentyFourHoursAgo).onSnapshot(snapshot => {
        let totalPnl = 0;
        snapshot.forEach(doc => totalPnl += (doc.data().pnl || 0));

        const pnlEl = document.getElementById('dailyPnl');
        if (pnlEl) {
            pnlEl.textContent = `${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)} USDT`;
            pnlEl.className = totalPnl >= 0 ? 'pnl-up' : 'pnl-down';
        }
    });
}

function loadNotifications(uid) {
    const list = document.getElementById('notificationList');
    if (!list) return;

    db.collection('users').doc(uid).collection('notifications')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                list.innerHTML = '<div class="no-data">Bildirim bulunmuyor.</div>';
                return;
            }
            let html = '';
            snapshot.forEach(doc => {
                const note = doc.data();
                html += `
                    <div class="notification-item ${note.read ? '' : 'unread'}">
                        <div class="note-icon"><i class="fas fa-info-circle"></i></div>
                        <div class="note-content">
                            <p class="note-title">${note.title}</p>
                            <p class="note-text">${note.message}</p>
                            <span class="note-time">${new Date(note.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;
        });
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

async function closePosition(posId) {
    if (confirm("Bu pozisyonu piyasa fiyatından kapatmak istediğinize emin misiniz?")) {
        // In a real app, this calls an API or Cloud Function
        // For CyberEx web, we update Firestore if local closing is allowed, 
        // but typically this should be a backend call.
        console.log("Closing position:", posId);
        alert("Pozisyon kapatma isteği gönderildi.");
    }
}
