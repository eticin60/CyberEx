const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../src/icons');
const srcLogo = path.join(iconsDir, 'logo.png');
const sizes = [16, 32, 48, 128];

console.log('Kaynak ikonlar logo.png ile eşitleniyor (Source Sync)...');

if (fs.existsSync(srcLogo)) {
    sizes.forEach(size => {
        const dest = path.join(iconsDir, `icon${size}.png`);
        try {
            fs.copyFileSync(srcLogo, dest);
            console.log(`✅ src/icons/icon${size}.png güncellendi.`);
        } catch (e) {
            console.error(`❌ Hata: ${dest}`, e.message);
        }
    });
    console.log('✨ Kaynak ikonlar hazır. Webpack build artık doğru ikonları kullanacak.');
} else {
    console.error('❌ Kaynak logo bulunamadı (src/icons/logo.png).');

    // Try to find it in root or parent
    const rootLogo = path.join(__dirname, '../../cyberex-logo.png');
    if (fs.existsSync(rootLogo)) {
        console.log('⚠️ Logo ana dizinde bulundu, kopyalanıyor...');
        fs.copyFileSync(rootLogo, srcLogo);
        // Retry
        sizes.forEach(size => {
            const dest = path.join(iconsDir, `icon${size}.png`);
            fs.copyFileSync(srcLogo, dest);
        });
        console.log('✨ Kurtarma başarılı.');
    }
}
