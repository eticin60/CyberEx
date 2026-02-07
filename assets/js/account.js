// Account Dashboard Controller
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Check Authentication
    auth.onAuthStateChanged(user => {
        if (!user) {
            console.log("Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor...");
            window.location.href = 'login.html';
        } else {
            console.log("Kullanıcı doğrulandı:", user.uid);
            initDashboard(user);
        }
    });

    // Handle Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.onsubmit = async (e) => {
            e.preventDefault();
            const phone = document.getElementById('phoneInput').value;
            const password = document.getElementById('newPassword').value;
            const uid = auth.currentUser.uid;

            try {
                const updates = {};
                if (phone) updates.phoneNumber = phone;

                if (Object.keys(updates).length > 0) {
                    await db.collection('users').doc(uid).update(updates);
                }

                if (password) {
                    await auth.currentUser.updatePassword(password);
                }

                alert("Ayarlar başarıyla güncellendi!");
            } catch (error) {
                console.error("Ayarlar güncellenirken hata:", error);
                alert("Hata: " + error.message);
            }
        };
    }
});

async function initDashboard(user) {
    // 1. Load User Profile Data
    loadUserProfile(user.uid);

    // 2. Load Wallet Balances
    loadWalletBalances(user.uid);

    // 3. Load Open Positions
    loadOpenPositions(user.uid);

    // 4. Load Notifications
    loadNotifications(user.uid);

    // 5. Load Unread Count
    loadUnreadCount(user.uid);
}

/**
 * Android loadUserData() mantığıyla profil verilerini getirir
 */
function loadUserProfile(uid) {
    const userDocRef = db.collection('users').document(uid);

    userDocRef.onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();

            // UI Update
            document.getElementById('navUsername').textContent = data.username || 'Kullanıcı';
            document.getElementById('displayName').textContent = data.username || 'Kullanıcı';
            document.getElementById('displayEmail').textContent = data.email || '';
            document.getElementById('cyberId').textContent = data.publicId || 'Henüz Yok';
            document.getElementById('vipLevel').textContent = `Lvl ${data.vipLevel || 1}`;

            // KYC Status logic
            updateKycBadge(data.kycStatus);

            // Badges
            renderBadges(data);

            // Avatar
            updateAvatarUI(data.avatarId);
        }
    }, error => {
        console.error("Profil verisi dinlenirken hata:", error);
    });
}

function updateKycBadge(status) {
    const badge = document.getElementById('kycStatus');
    switch (status) {
        case 'verified':
            badge.textContent = 'Doğrulandı';
            badge.style.color = 'var(--success)';
            badge.style.borderColor = 'var(--success)';
            badge.style.background = 'rgba(0, 255, 136, 0.1)';
            break;
        case 'pending':
            badge.textContent = 'Beklemede';
            badge.style.color = 'var(--warning)';
            break;
        default:
            badge.textContent = 'Doğrulanmadı';
    }
}

function renderBadges(data) {
    const container = document.getElementById('badgeContainer');
    container.innerHTML = '';

    if (data.admin) {
        container.innerHTML += `<span class="badge admin-badge"><i class="fas fa-shield-alt"></i> Admin</span>`;
    }
    if (data.premium) {
        container.innerHTML += `<span class="badge premium-badge"><i class="fas fa-crown"></i> Premium</span>`;
    }
}

/**
 * Cüzdan bakiyelerini Android WalletManager mantığıyla getirir
 */
async function loadWalletBalances(uid) {
    // Spot Balance
    db.collection('users').doc(uid).collection('wallet').doc('usdt_balance')
        .onSnapshot(doc => {
            if (doc.exists) {
                const balance = doc.data().balance || 0;
                document.getElementById('spotBalance').textContent = `$${balance.toLocaleString()}`;
                updateTotalBalance();
            }
        });

    // Futures Balance
    db.collection('users').doc(uid).collection('futures_wallet').doc('usdt_balance')
        .onSnapshot(doc => {
            if (doc.exists) {
                const balance = doc.data().balance || 0;
                document.getElementById('futuresBalance').textContent = `$${balance.toLocaleString()}`;
                updateTotalBalance();
            }
        });
}

function updateTotalBalance() {
    const spotStr = document.getElementById('spotBalance').textContent.replace('$', '').replace(/,/g, '');
    const futuresStr = document.getElementById('futuresBalance').textContent.replace('$', '').replace(/,/g, '');

    const total = parseFloat(spotStr) + parseFloat(futuresStr);
    document.getElementById('totalBalance').textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

/**
 * Açık Pozisyonları Getirir (Read-only)
 */
function loadOpenPositions(uid) {
    db.collection('users').doc(uid).collection('futures_wallet').collection('futures_history')
        .where('status', '==', 'open')
        .onSnapshot(snapshot => {
            const container = document.getElementById('positionsContainer');
            const countBadge = document.getElementById('positionCount');

            countBadge.textContent = snapshot.size;

            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-stream"></i>
                        <p>Açık pozisyon bulunamadı</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const pos = doc.data();
                const pnlClass = pos.pnl >= 0 ? 'text-success' : 'text-danger';

                container.innerHTML += `
                    <div class="position-item">
                        <div class="pos-main">
                            <span class="symbol">${pos.symbol} / USDT</span>
                            <span class="type ${pos.type.toLowerCase()}">${pos.type} x${pos.leverage}</span>
                        </div>
                        <div class="pos-details">
                            <div class="detail">
                                <span class="lbl">Giriş</span>
                                <span class="val">$${pos.entryPrice}</span>
                            </div>
                            <div class="detail">
                                <span class="lbl">K/Z</span>
                                <span class="val ${pnlClass}">$${pos.pnl} (${pos.pnlPercent}%)</span>
                            </div>
                        </div>
                        <button class="btn btn-close-mini" onclick="confirmClosePosition('${doc.id}')">
                            <i class="fas fa-times"></i> ACİL KAPAT
                        </button>
                    </div>
                `;
            });
        });
}

/**
 * Bildirimleri Getirir
 */
function loadNotifications(uid) {
    db.collection('users').doc(uid).collection('notifications')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .onSnapshot(snapshot => {
            const container = document.getElementById('notificationsContainer');
            if (snapshot.empty) {
                container.innerHTML = '<p class="text-center py-4 opacity-50">Yeni bildirim yok</p>';
                return;
            }

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const note = doc.data();
                const noteId = doc.id;
                container.innerHTML += `
                    <div class="notification-item ${note.read ? 'read' : 'unread'}" onclick="markAsRead('${noteId}')">
                        <div class="note-icon"><i class="fas fa-info-circle"></i></div>
                        <div class="note-body">
                            <p class="note-title">${note.title}</p>
                            <p class="note-text">${note.body}</p>
                            <span class="note-time">${formatDate(note.timestamp)}</span>
                        </div>
                    </div>
                `;
            });
        });
}

async function markAsRead(noteId) {
    try {
        const uid = auth.currentUser.uid;
        await db.collection('users').doc(uid).collection('notifications').doc(noteId).update({
            read: true
        });
    } catch (error) {
        console.error("Bildirim işaretlenirken hata:", error);
    }
}

// Helpers
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function copyCyberId() {
    const id = document.getElementById('cyberId').textContent;
    navigator.clipboard.writeText(id).then(() => {
        alert("Cyber ID kopyalandı!");
    });
}

/**
 * Pozisyon kapatma onayı
 */
function confirmClosePosition(posId) {
    const modal = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmCloseBtn');

    modal.style.display = 'flex';

    confirmBtn.onclick = async () => {
        try {
            const uid = auth.currentUser.uid;
            await db.collection('users').doc(uid)
                .collection('futures_wallet')
                .collection('futures_history')
                .doc(posId)
                .update({ status: 'closed', closedAt: firebase.firestore.FieldValue.serverTimestamp() });

            closeModal();
            alert("Pozisyon başarıyla kapatıldı.");
        } catch (error) {
            console.error("Pozisyon kapatılırken hata:", error);
            alert("Hata oluştu: " + error.message);
        }
    };
}

function closeModal() {
    const modal = document.getElementById('closeModal');
    const avatarModal = document.getElementById('avatarModal');
    if (modal) modal.style.display = 'none';
    if (avatarModal) avatarModal.style.display = 'none';
}

function openAvatarModal() {
    let avatarModal = document.getElementById('avatarModal');
    if (!avatarModal) {
        // Create modal dynamically if not in HTML
        avatarModal = document.createElement('div');
        avatarModal.id = 'avatarModal';
        avatarModal.className = 'modal';
        avatarModal.innerHTML = `
            <div class="modal-content">
                <h3>Avatar Seçin</h3>
                <div class="avatar-grid">
                    ${[0, 1, 2, 3, 4, 5].map(id => `
                        <div class="avatar-option" onclick="selectAvatar(${id})">
                            <i class="fas ${['fa-user-astronaut', 'fa-user-ninja', 'fa-user-secret', 'fa-robot', 'fa-user-tie', 'fa-user-graduate'][id]}"></i>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary mt-4" onclick="closeModal()">İptal</button>
            </div>
        `;
        document.body.appendChild(avatarModal);
    }
    avatarModal.style.display = 'flex';
}

async function selectAvatar(id) {
    try {
        const uid = auth.currentUser.uid;
        await db.collection('users').doc(uid).update({ avatarId: id });
        closeModal();
    } catch (error) {
        console.error("Avatar güncellenirken hata:", error);
    }
}

/**
 * Okunmamış bildirim sayısını dinler
 */
function loadUnreadCount(uid) {
    db.collection('users').doc(uid).collection('notifications')
        .where('read', '==', false)
        .onSnapshot(snapshot => {
            const badge = document.getElementById('navUnreadCount');
            const count = snapshot.size;

            if (count > 0) {
                badge.textContent = count > 9 ? '9+' : count;
                badge.style.display = 'flex';
                // Animasyon efekti
                badge.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => badge.style.animation = '', 500);
            } else {
                badge.style.display = 'none';
            }
        });
}

function scrollToMessages() {
    const section = document.getElementById('messages');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Görsel efekt için yanıp söndürme
        section.style.boxShadow = '0 0 30px var(--primary-neon)';
        setTimeout(() => {
            section.style.boxShadow = '';
        }, 1500);
    }
}

function updateAvatarUI(avatarId) {
    const avatars = [
        'fa-user-astronaut', 'fa-user-ninja', 'fa-user-secret',
        'fa-robot', 'fa-user-tie', 'fa-user-graduate'
    ];

    const iconClass = avatars[avatarId] || 'fa-user-shield';
    const mainAvatar = document.getElementById('mainAvatar');
    const navAvatar = document.getElementById('navAvatar');

    if (mainAvatar) mainAvatar.innerHTML = `<i class="fas ${iconClass}"></i>`;
    if (navAvatar) navAvatar.innerHTML = `<i class="fas ${iconClass}"></i>`;
}

async function handleLogout() {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        await auth.signOut();
        window.location.href = 'login.html';
    }
}

// Close dropdown on click outside
window.onclick = function (event) {
    if (!event.target.closest('.user-profile-nav')) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    }
}
