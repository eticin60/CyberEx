// Firebase Configuration for CyberEx Web
const firebaseConfig = {
    apiKey: "AIzaSyCC5H6_5CDrmCqJPD5GvpUdIlCMBS8EwEk",
    authDomain: "cyberex-firebase.firebaseapp.com",
    databaseURL: "https://cyberex-firebase-default-rtdb.firebaseio.com",
    projectId: "cyberex-firebase",
    storageBucket: "cyberex-firebase.firebasestorage.app",
    messagingSenderId: "25879594487",
    appId: "1:25879594487:android:e2989ff0a5df955d3bdaf2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("Persistence set to LOCAL"))
    .catch((error) => console.error("Persistence error:", error));

console.log("Firebase initialized successfully");
