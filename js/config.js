// Configuration Manager - Environment variables kullanarak hassas bilgileri yönetir
// Bu dosya build zamanında environment variables ile doldurulacak

// Firebase Configuration - Environment variables'dan al
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCC5H6_5CDrmCqJPD5GvpUdIlCMBS8EwEk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cyberex-firebase.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cyberex-firebase",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cyberex-firebase.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "25879594487",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:25879594487:android:e2989ff0a5df955d3bdaf2",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cyberex-firebase-default-rtdb.firebaseio.com"
};

// API Endpoints - Backend proxy kullan (hassas API key'leri backend'de tut)
export const API_ENDPOINTS = {
  // Binance API'yi direkt çağırma, backend proxy kullan
  BINANCE_PROXY: '/api/binance',
  COINGECKO_PROXY: '/api/coingecko',
  
  // Public endpoints (API key gerektirmeyen)
  BINANCE_PUBLIC: 'https://api.binance.com/api/v3',
  COINGECKO_PUBLIC: 'https://api.coingecko.com/api/v3'
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'CyberEx',
  VERSION: '2.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  
  // Feature flags
  ENABLE_DEBUG: import.meta.env.MODE === 'development',
  ENABLE_ANALYTICS: import.meta.env.MODE === 'production'
};

// Security: Hassas bilgileri buraya yazma!
// Tüm hassas API key'ler backend'de (Firebase Functions) tutulmalı
