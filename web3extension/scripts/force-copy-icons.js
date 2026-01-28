const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcLogo = path.join(rootDir, 'src/icons/logo.png');
const distDir = path.join(rootDir, 'dist/icons');
const sizes = [16, 32, 48, 128];

console.log('İkonlar logo.png ile güncelleniyor (Fallback)...');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(srcLogo)) {
    sizes.forEach(size => {
        const dest = path.join(distDir, `icon${size}.png`);
        fs.copyFileSync(srcLogo, dest);
        console.log(`✅ ${dest} güncellendi.`);
    });
    console.log('⚠️ Not: İkonlar orijinal boyutta kopyalandı. En iyi performans için "npm run generate-icons" çalıştırın.');
} else {
    console.error('❌ Kaynak logo bulunamadı:', srcLogo);
}
