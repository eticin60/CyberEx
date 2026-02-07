// Firebase Cloud Function Örneği
// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Bu kod SERVER'da çalışır, kullanıcı göremez
exports.processWithdrawal = functions.https.onCall(async (data, context) => {
    // Authentication kontrolü
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Giriş yapmalısınız');
    }

    const userId = context.auth.uid;
    const amount = data.amount;

    // SERVER-SIDE SECRET KEY kullanabilirsin (kullanıcı ASLA göremez)
    const PAYMENT_API_SECRET = functions.config().payment.secret;

    // İşlemler...
    // Ödeme API'sine bağlan vb.

    return { success: true };
});
