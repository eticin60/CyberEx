// Firebase Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Firebase config (environment variables veya default değerler)
const firebaseConfig = {
  apiKey: "AIzaSyCC5H6_5CDrmCqJPD5GvpUdIlCMBS8EwEk",
  authDomain: "cyberex-firebase.firebaseapp.com",
  projectId: "cyberex-firebase",
  storageBucket: "cyberex-firebase.firebasestorage.app",
  messagingSenderId: "25879594487",
  appId: "1:25879594487:android:e2989ff0a5df955d3bdaf2",
  databaseURL: "https://cyberex-firebase-default-rtdb.firebaseio.com"
};

// Firebase'i initialize et
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);

// Global window'a ekle (backward compatibility için)
window.firebaseApp = app;
window.auth = auth;
window.db = db;
window.database = database;

// Development'ta log, production'da log yok (security.js'de devre dışı bırakıldı)
if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') {
  console.log('Firebase initialized');
}
