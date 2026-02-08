/**
 * CyberEx Shared Navigation Controller
 * Handles auth state and profile dropdown across all pages
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("home-nav.js: DOMContentLoaded - Initializing Auth Listener");
    const userNav = document.getElementById('userNav');
    if (!userNav) return;

    // Listen for Auth State
    firebase.auth().onAuthStateChanged(user => {
        console.log("Auth State Changed:", user ? "User Logged In" : "No User");
        if (user) {
            console.log("Rendering User Nav for:", user.uid);
            renderUserNav(user);
        } else {
            console.log("Rendering Guest Nav");
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

    // Ensure Styles for Dropdown exist
    if (!document.getElementById('nav-dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-dropdown-styles';
        style.textContent = `
            .user-profile-nav { position: relative; display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 5px 10px; border-radius: 8px; transition: background 0.2s; }
            .user-profile-nav:hover { background: rgba(255, 255, 255, 0.05); }
            .profile-dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                width: 220px;
                background: #0a0f1c;
                border: 1px solid rgba(0, 240, 255, 0.2);
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                padding: 10px 0;
                display: none;
                z-index: 10000;
                margin-top: 10px;
            }
            .profile-dropdown-menu.active { display: block; }
            .profile-dropdown-menu a {
                display: flex !important;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                color: #e0e0e0;
                text-decoration: none;
                transition: background 0.2s;
                font-size: 0.9rem;
            }
            .profile-dropdown-menu a:hover { background: rgba(0, 240, 255, 0.1); color: #fff; }
            .profile-dropdown-menu .divider { border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 5px 0; }
            .profile-dropdown-menu .text-danger { color: #ff3366 !important; }
            .profile-dropdown-menu .text-danger:hover { background: rgba(255, 51, 102, 0.1); }
        `;
        document.head.appendChild(style);
    }

    // Hide central Download button if logged in
    const centralDownload = document.getElementById('navDownloadBtn');
    if (centralDownload) centralDownload.style.display = 'none';

    // Fetch profile data safely
    let data = {};
    try {
        const doc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (doc.exists) data = doc.data();
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }

    // Fallbacks
    const refCode = (data.uid || user.uid).substring(0, 8).toUpperCase();
    const refCount = data.referralCount || 0;
    const commission = data.commissionRate || 10;
    const avatar = data.photoUrl || user.photoURL || 'assets/images/default-avatar.png'; // Fallback to Auth or Default
    const displayName = data.username || user.displayName || user.email.split('@')[0];

    // Update Modal Data (if modal exists on page)
    const refLinkEl = document.getElementById('refLink');
    if (refLinkEl) refLinkEl.value = `https://cyberex.com.tr/register?ref=${refCode}`;

    const totalRefsEl = document.getElementById('totalRefs');
    if (totalRefsEl) totalRefsEl.textContent = refCount;

    const commRateEl = document.getElementById('commissionRate');
    if (commRateEl) commRateEl.textContent = `%${commission}`;


    // Render Dropdown UI
    userNav.innerHTML = `
        <div class="user-profile-nav" onclick="toggleDropdown()">
            <img src="${avatar}" onerror="this.src='assets/images/logo.png'" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid #00f0ff; object-fit: cover;">
            <div class="profile-info" style="display: flex; flex-direction: column; align-items: flex-start;">
                <span style="color: #fff; font-weight: 600; font-size: 0.85rem;">${displayName}</span>
                <span style="color: #00f0ff; font-size: 0.7rem;">UID: ${refCode}</span>
            </div>
            <i class="fas fa-chevron-down" style="font-size: 0.75rem; color: #888; margin-left: 5px;"></i>
            
            <!-- Dropdown Menu -->
            <div id="profileDropdown" class="profile-dropdown-menu">
                <a href="account.html"><i class="fas fa-columns"></i> Dashboard</a>
                <a href="#" onclick="event.stopPropagation(); document.getElementById('referenceModal').style.display='block'; toggleDropdown()"><i class="fas fa-users"></i> Referans Sistemi</a>
                <div class="divider"></div>
                <a href="#" onclick="handleLogout()" class="text-danger"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a>
            </div>
        </div>
    `;

    // Initialize Unread Count
    listenUnreadCount(user.uid);
}

function renderGuestNav() {
    const userNav = document.getElementById('userNav');

    // Show central Download button if guest
    const centralDownload = document.getElementById('navDownloadBtn');
    if (centralDownload) centralDownload.style.display = 'inline-block';

    userNav.innerHTML = `
    <div class="nav-auth-buttons" style="display:flex; gap:10px;">
        <a href="#" class="nav-btn-outline" style="border: none; opacity: 0.5; cursor: not-allowed;" onclick="return false;" data-tr="GİRİŞ YAP (YAKINDA)" data-en="LOGIN (SOON)">GİRİŞ YAP <span style="font-size:0.6em; background:#333; padding:2px 4px; border-radius:4px;">YAKINDA</span></a>
        <a href="register.html" class="nav-btn-filled" data-tr="HEMEN KATIL" data-en="JOIN NOW">HEMEN KATIL</a>
    </div>
`;
}

function toggleDropdown() {
    const d = document.getElementById('profileDropdown');
    if (d) d.classList.toggle('active');
}

// Mobile Menu Toggle (Shared)
window.toggleMobileMenu = function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.classList.toggle('mobile-open');

    const icon = document.querySelector('.mobile-menu-btn i');
    if (icon) {
        if (navbar.classList.contains('mobile-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }

    // Safety: ensure dropdowns are closed
    const d = document.getElementById('profileDropdown');
    if (d) d.classList.remove('active');
};

async function handleLogout() {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        try {
            await firebase.auth().signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
}

function listenUnreadCount(uid) {
    if (!firebase.firestore) return;
    try {
        firebase.firestore().collection('users').doc(uid).collection('notifications')
            .where('read', '==', false)
            .onSnapshot(snapshot => {
                const badge = document.getElementById('navUnreadCount'); // Needs to exist in HTML if used
                // Implementation preserved but simplified
            }, err => console.log("Notif error", err));
    } catch (e) { console.log("Notif intent error", e); }
}
