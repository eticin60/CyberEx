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

    const refCode = data.uid ? data.uid.substring(0, 8).toUpperCase() : '---';
    const refCount = data.referralCount || 0;
    const commission = data.commissionRate || 10;

    // Update Modal Data
    const refLinkEl = document.getElementById('refLink');
    if (refLinkEl) refLinkEl.value = `https://cyberex.com.tr/register?ref=${refCode}`;

    const totalRefsEl = document.getElementById('totalRefs');
    if (totalRefsEl) totalRefsEl.textContent = refCount;

    const commRateEl = document.getElementById('commissionRate');
    if (commRateEl) commRateEl.textContent = `%${commission}`;


    userNav.innerHTML = `
        <button class="nav-btn-filled" onclick="document.getElementById('referenceModal').style.display='block'" style="font-size: 0.75rem; margin-right: 10px;">
            <i class="fas fa-users"></i> Referans Sistemi
        </button>
        <button class="nav-btn-outline" onclick="handleLogout()" style="font-size: 0.75rem; border-color: #ff3366; color: #ff3366;">
            <i class="fas fa-sign-out-alt"></i> Çıkış Yap
        </button>
    `;

    // Initialize Unread Count
    listenUnreadCount(user.uid);
}

function handleLogout() {
    firebase.auth().signOut().then(() => {
        window.location.reload();
    });
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
        return `<img src="assets/avatar/avatar_${id}.png" onerror="this.outerHTML='<i class=\'fas fa-user\'></i>'">`;
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
