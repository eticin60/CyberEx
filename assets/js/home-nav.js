/**
 * CyberEx Shared Navigation Controller
 * Handles auth state and profile dropdown across all pages
 */

document.addEventListener('DOMContentLoaded', () => {
    const userNav = document.getElementById('userNav');
    if (!userNav) return;

    // Listen for Auth State
    auth.onAuthStateChanged(user => {
        if (user) {
            renderUserNav(user);
        } else {
            renderGuestNav();
        }
    });

    // Close dropdown on click outside
    window.onclick = (event) => {
        if (!event.target.closest('.user-profile-nav')) {
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        }
    };
});

async function renderUserNav(user) {
    const userNav = document.getElementById('userNav');

    // Hide central Download button if logged in
    const centralDownload = document.getElementById('navDownloadBtn');
    if (centralDownload) centralDownload.style.display = 'none';

    // Fetch profile data for username and avatar
    const doc = await db.collection('users').doc(user.uid).get();
    const data = doc.exists ? doc.data() : {};
    const username = data.username || 'Kullanıcı';
    const avatarId = data.avatarId || 0;

    userNav.innerHTML = `
        <div class="nav-notification-bell" onclick="window.location.href='account.html#messages'">
            <i class="fas fa-bell"></i>
            <span class="unread-badge" id="navUnreadCount" style="display: none;">0</span>
        </div>

        <div class="profile-summary" onclick="toggleProfileMenu()">
            <span id="navUsername">${username}</span>
            <div class="avatar-circle" id="navAvatar">
                ${getAvatarHTML(avatarId)}
            </div>
            <i class="fas fa-chevron-down"></i>
        </div>

        <div class="profile-dropdown" id="profileDropdown">
            <a href="account.html#wallet"><i class="fas fa-wallet"></i> Cüzdan</a>
            <a href="account.html#messages"><i class="fas fa-envelope"></i> Mesajlar</a>
            <a href="account.html#settings"><i class="fas fa-cog"></i> Ayarlar</a>
            <a href="account.html"><i class="fas fa-user-circle"></i> Hesabım</a>
            <hr>
            <a href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a>
        </div>
    `;

    // Initialize Unread Count from account.js logic if on account page, 
    // or standalone listener here
    listenUnreadCount(user.uid);
}

function renderGuestNav() {
    const userNav = document.getElementById('userNav');

    // Show central Download button if guest
    const centralDownload = document.getElementById('navDownloadBtn');
    if (centralDownload) centralDownload.style.display = 'inline-block';

    userNav.innerHTML = `
        <div class="nav-auth-buttons">
            <a href="login.html" class="nav-btn-outline" style="border: none;" data-tr="GİRİŞ YAP" data-en="LOGIN">GİRİŞ YAP</a>
            <a href="register.html" class="nav-btn-filled" data-tr="HEMEN KATIL" data-en="JOIN NOW">HEMEN KATIL</a>
        </div>
    `;
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function getAvatarHTML(id) {
    if (id >= 1 && id <= 15) {
        return `<img src="assets/images/avatars/avatar_${id}.png" onerror="this.outerHTML='<i class=\'fas fa-user\'></i>'">`;
    }
    return `<i class="fas fa-user"></i>`;
}

function listenUnreadCount(uid) {
    db.collection('users').doc(uid).collection('notifications')
        .where('read', '==', false)
        .onSnapshot(snapshot => {
            const badge = document.getElementById('navUnreadCount');
            if (badge) {
                const count = snapshot.size;
                if (count > 0) {
                    badge.textContent = count > 9 ? '9+' : count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
}

async function handleLogout() {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        try {
            await auth.signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
}
